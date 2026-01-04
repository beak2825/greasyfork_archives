// ==UserScript==
// @name         WME Edit Area Age
// @namespace    https://greasyfork.org/users/1365511
// @version      2025.01.21.002
// @description  Displays age of editable areas
// @author       robosphinx_
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523701/WME%20Edit%20Area%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/523701/WME%20Edit%20Area%20Age.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function main() {
    'use strict';

    const SCRIPT_LONG_NAME = GM_info.script.name;
    const SCRIPT_SHORT_NAME = "WME-EAA";
    const SCRIPT_SHORTEST_NAME = "EAA";
    const SCRIPT_VERSION = GM_info.script.version;

    const TIME_PER_DRIVE_MS = 250;
    const DRIVES_PER_PAGE   = 15;
    const TIME_PER_PAGE_MS  = (DRIVES_PER_PAGE + 5) * TIME_PER_DRIVE_MS;
    const MAX_DRIVES = 300;

    const EAA_STYLE = {
        strokeWidth: 0
    };

    // For OL geometry conversion
    // Grabbing geometry from WME segments gives typical lat/lon coordinates as we humans know them.  We must convert to OL scale :)
    // Discovered through trial and error :')
    // See: https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
    const srcProjection = 'EPSG:4326'; // WGS 84 / Geographic (human-readable degrees lat/lon)
    const destProjection = 'EPSG:3857'; // WGS 84 / Spherical Mercator (meters, cartesian/planar?)
    
    // For spherical (ESPG:4326) math.  It's what I've worked on before, even if it's mathematically
    // more complex than planar math.  Why reinvent the wheel when the planar math doesn't seem to
    // fully extend to the EA bounds??  Seems Waze is using something other than planar math when
    // calculating it...
    const EQUATORIAL_RADIUS_METERS = 6378137.0;
    const POLAR_RADIUS_METERS = 6356752.31424518;
    // This is gross, but I've played with a LOT of projection code to figure out how EA is
    // calculated based on drive traces and it's nothing obvious...
    // Time to break out the magic numbers </3
    // oof even the magic numbers don't fix this because it's varying with latitude still.
    // I'm NOT going to find a magic equation to fudge the sizes dynamically.  This gets pretty close.
    const VERTICAL_SCALAR = 1.12;
    const HORIZONTAL_SCALAR = 0.90;


    // TODO: Configurable
    const DAYS_TO_EXPIRY = 7;


    // One-time load/set
    let WM;
    let DL;
    let editRadius = 0;
    let wmeeaaEditAgeLayer;
    let _$scanDrivesButton = null;

    // Volatile things and stuff - changes on user input
    let layerEnabled = true;
    let centerAtProcessDrivesStart;
    let zoomAtProcessDrivesStart;
    let numDrives = 0;
    let driveDates = [];
    let features = [];

    /*
     * log does what you expect.  Intended use is a severity and a message, but it really just
     * appends the two strings together.  Not really any rules on severity tags, but ERROR will
     * be printed as an error to the js console.
     */
    function log(tag, message) {
        if (tag == "ERROR") {
            console.error(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
        else {
            console.log(SCRIPT_SHORT_NAME + ": " + tag + ": " + message);
        }
    }

    /*
     * Event handler for when the map move finishes.
     * Set this as an active event handler only when scanning.
     * Remove from event handlers when finished to avoid headache.
     * Expects a drive to be added to the map from the user drives history list.
     * Takes the OpenLayers geometry and saves all points from the drive trace along with the date of the drive.
     */
    function mapMoveEnd() {
        try {
            if (DL.features.length > 0) {
                let numFeatures = DL.features.length;
                let coordinatesList = [];
                // log("DEBUG", "NumFeatures: " + numFeatures);
                for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
                    // log("DEBUG", "Processing feature " + featureIndex);
                    let specificGeometry = DL.features[featureIndex].attributes.wazeFeature.geometry; // OL.Geometry.LineString

                    let drivePoints = [];
                    for (let i = 0; i < specificGeometry.coordinates.length; i++) {
                        let lon = specificGeometry.coordinates[i][0];
                        let lat = specificGeometry.coordinates[i][1];
                        drivePoints.push(new OpenLayers.Geometry.Point(lon, lat));
                    }

                    let lineString = new OpenLayers.Geometry.LineString(drivePoints);
                    // log("DEBUG", "Found " + specificGeometry.coordinates.length + " coordinates.");
                    // log("DEBUG", "Captured " + drivePoints.length + " of them.");

                    let age = getDuration(driveDates[numDrives]);
                    let color = getColorFromAge(age);
                    let z = (MAX_DRIVES * 5) - (numDrives * 5);

                    let vertices = lineString.getVertices();

                    // log("DEBUG", "Creating start cap");
                    // Create start cap of the polygon
                    let startCap = getSemiCircularCap(vertices[0], vertices[1], editRadius);
                    let polygon = new OpenLayers.Geometry.LinearRing(startCap)

                    // log("DEBUG", "Polygon has " + polygon.getVertices().length + " points and area " + polygon.getArea());

                    // log("DEBUG", "Creating edges");
                    for (let i = 1; i < vertices.length - 1; i++) {
                        // getPolygonEdges gives right and then left point
                        let edges = getPolygonEdges(vertices[i], vertices[i + 1], editRadius);
                        // log("DEBUG", "Created edges");
                        polygon.addComponent(edges[0], 0); // Add to start of list
                        // log("DEBUG", "Inserted first edge at index 0");
                        polygon.addComponent(edges[1], polygon.getVertices().length); // Add to end of list
                        // log("DEBUG", "Appended second edge to end of list");
                    }

                    // log("DEBUG", "Polygon has " + polygon.getVertices().length + " points and area " + polygon.getArea());

                    // log("DEBUG", "Creating end cap");
                    // Create end cap of polygon
                    let endCap = getSemiCircularCap(vertices[vertices.length - 1], vertices[vertices.length - 2], editRadius);
                    // TODO: Do we need to reverse the end cap point order before appending?
                    for (let i = 0; i < endCap.length; i++) {
                        polygon.addComponent(endCap[i]); // Add to end of list
                    }

                    // log("DEBUG", "Polygon has " + polygon.getVertices().length + " points and area " + polygon.getArea());

                    // Transform projections after calculating circle to properly stretch to
                    // EA bounds
                    // log("DEBUG", "Transforming polygon");
                    polygon.transform(srcProjection, destProjection);
                    
                    // log("DEBUG", "Adding polygon to vector");
                    // Create a vector containing the geometry to add to the map layer
                    let vector = new OpenLayers.Feature.Vector(polygon, null, {
                        strokeWidth: 0,
                        zIndex: z,
                        fillOpacity: 1.0,
                        fillColor: color
                    });
                    // log("DEBUG", "Adding vector to features");
                    features.push(vector);

                    // log("DEBUG", "Drive " + numDrives + " was " + age + " days old.  Using color " + color + " at z index " + z);
                }

                numDrives++;

                // log("DEBUG", "Found " + coordinatesList.length + " coordinates in this drive - processed " + fullyProcessedCoordinates + " of them.");
                // log("DEBUG", "Processed " + numDrives + " drives.");
            }
        }
        catch (err) {
            log("ERROR", "mapMoveEnd returned error " + err);
        }
    }

    function openDrivesTab() {
        // Check if div id="sidepanel-drives" class contains active (if not, click drives)
        if ( $('[data-for="drives"]').attr('selected').includes("true") ) {
            // log("DEBUG", "Pane is active");
        }
        else {
            // log("DEBUG", "Pane is NOT active, clicking");
            // Select wz-navigation-item data-for="drives" (drives button in left sidebar)
            $('[data-for="drives"]').click();
        }
    }

    function closeDrivesTab() {
        // Check if div id="sidepanel-drives" class contains active (if not, click drives)
        if ( $('[data-for="drives"]').attr('selected').includes("true") ) {
            log("DEBUG", "Pane is active, clicking");
            // Select wz-navigation-item data-for="drives" (drives button in left sidebar)
            $('[data-for="drives"]').click();
        }
        else {
            // log("DEBUG", "Pane is NOT active");
        }
        // closeLastDrive();
    }

    function closeLastDrive() {
        let allButtons = $('wz-button')
        for (let i = 0; i < allButtons.length; i++) {
            if ($(allButtons[i]).attr('color')) {
                // log("DEBUG", "Button included color attribute");
                if ($(allButtons[i]).attr('color').includes("clear-icon")) {
                    // log("DEBUG", "Button included correct color attribute value");
                    if ($(allButtons[i]).attr('size')) {
                        // log("DEBUG", "Button included size attribute");
                        if ($(allButtons[i]).attr('size').includes("xs")) {
                            // log("DEBUG", "Button included correct size attribute value");
                            $(allButtons[i]).click();
                            return;
                        }
                    }
                }
            }
        }
    }

    function openScriptsTab() {
        // Check if div id="sidepanel-drives" class contains active (if not, click drives)
        if ( $('#user-tabs').attr('hidden') ) {
            // log("DEBUG", "Pane is NOT active, clicking");
            // Select wz-navigation-item data-for="userscript_tab" (scripts button in left sidebar)
            $('[data-for="userscript_tab"]').click();
        }
        // else {
        //     log("DEBUG", "Pane is active");
        // }
    }

    function clickDriveAndCaptureDate(driveCard) {
        let dateString = $(driveCard).find('.list-item-card-title')[0].innerText;
        // log("DEBUG", "Date: " + dateString);
        driveDates.push(new Date(dateString));
        $(driveCard).click();
    }

    function selectEachDriveAndGoToNextPage() {
        try {
            let nextPageButtonEnabled = false;
            let maxPages = MAX_DRIVES / 15; // 20 pages, 300 drives, up to 3.5 drives per day.  Might need more for daily wazers?  90 days' worth
            //log("DEBUG", "Selecting all wz-card children of sidepanel-drives");
            let visibleCards = $('#sidepanel-drives .drive-list wz-card');
            //log("DEBUG", "Selected " + visibleCards.length + " elements");
            let numCards = 0;
            //log("DEBUG", "Iterating over selected wz-card");
            let totalDelay = TIME_PER_DRIVE_MS;
            for (let cardIndex = 0; cardIndex < visibleCards.length; cardIndex++) {
                //log("DEBUG", "Iterating over card " + cardIndex);
                setTimeout(clickDriveAndCaptureDate(visibleCards[cardIndex]), totalDelay);
                totalDelay += TIME_PER_DRIVE_MS;
            }
            //log("DEBUG", "Done with wz-card");
            //log("DEBUG", "Looking for paginator");
            let pageButtons = $('.drive-list .paginator wz-button');
            for (let buttonIndex = 0; buttonIndex < pageButtons.length; buttonIndex++) {
                let nextPageButtonIcon = $(pageButtons[buttonIndex]).find('i');

                if ($(nextPageButtonIcon).attr('class').split('-').includes("right")) {
                    //log("DEBUG", "found next page button");

                    nextPageButtonEnabled = !($(pageButtons[buttonIndex]).prop("disabled"));
                    //log("DEBUG", "next page button is " + (nextPageButtonEnabled ? "" : "NOT " ) + "enabled.");
                    if (nextPageButtonEnabled) {
                        $(pageButtons[buttonIndex]).click();
                        setTimeout(selectEachDriveAndGoToNextPage, TIME_PER_PAGE_MS);
                    }
                    else {
                        // TODO: Do something after collecting all geoms.  Wait with a timeout then call some func
                        // This executes right after we START the timeout for the last page drives.  So we should get the number of drives on the last page and set a delay accordingly, much like the next page timeout

                        setTimeout(processedAllDrives, TIME_PER_PAGE_MS); // 7 minutes later... Need to insert a Spongebob transition screen here.
                        // That seems to trigger too early no matter how long the timeout is... SOme other callback?
                    }
                }
            }
        }
        catch (err) {
            log("ERROR", "Clicking drives encountered an error: " + err);
        }
    }

    function processedAllDrives() {
        try {
            // log("DEBUG", "Finished creating gargantuan geoms.  Processed " + numDrives + " drives.");
            // Update script panel label for number of processed drives.  TODO: Probably remove later
            $('#wmeeaaDrives').text( numDrives );
            WM.events.unregister('moveend', null, mapMoveEnd);
            // Return to center and zoom from before we started
            W.map.setCenter(centerAtProcessDrivesStart);
            W.map.getOLMap().zoomTo(zoomAtProcessDrivesStart);
            // log("DEBUG", "Adding all features (" + features.length + " components)");
            // Reverse features so newest drive is added last
            features.reverse();
            // Add accumulated drive features to layer
            wmeeaaEditAgeLayer.addFeatures(features);
            // log("DEBUG", "Added all features (" + features.length + " components)");

            // openScriptsTab();
            closeDrivesTab();

            // for (let i = 0; i < driveDates.length; i++) {
            //     log("DEBUG", "Drive " + (i + 1) + " date: " + driveDates[i]);
            // }
        }
        catch (err) {
            log("ERROR", "final drives processing encountered an error: " + err);
        }
    }

    function iterateDrives() {
        try {
            WM.events.register('moveend', null, mapMoveEnd);
            // Record current center and zoom level so we can return after scanning drives
            centerAtProcessDrivesStart = W.map.getCenter();
            zoomAtProcessDrivesStart = W.map.getOLMap().getZoom();
            // Clear any previous scans.  Drives may have updated
            numDrives = 0;
            features = [];
            wmeeaaEditAgeLayer.removeAllFeatures();
            // Start scanning drives
            setTimeout(selectEachDriveAndGoToNextPage, 1000);
        }
        catch (err) {
            log("ERROR", "Iterating over drives pages encountered an error: " + err);
        }
    }

    function onScanDrivesButtonClick() {
        try {
            try {
                WM.events.unregister('moveend', null, mapMoveEnd);
            }
            catch (err) {
                log("DEBUG", "MapMoveEnd was not registered");
            }
            numDrives = 0;
            // log("INFO", "Opening drives tab");
            openDrivesTab();
            // log("DEBUG", "Drives tab should be open now");
            setTimeout(iterateDrives, 1000);
        }
        catch (err) {
            log("ERROR", "Button click handler encountered error: " + err);
        }
    }

    // Shamelessly ripped from UR-MP and modified to fit my needs
    // Takes a timestamp and calculates its age (delta from now)
    function getDuration(ts) {
        const aDate = new Date()
        const now = aDate.getTime()
        const duration = now - ts
        aDate.setHours(0)
        aDate.setMinutes(0)
        aDate.setSeconds(0)
        aDate.setMilliseconds(0)
        const startOfDay = aDate.getTime()
        if (duration < now - startOfDay) {
            return 0
        }
        return Math.ceil((duration - (now - startOfDay)) / 86400000)
    }

    // Shamelessly ripped from UR-MP and modified to fit my needs
    // Takes a decimal value and a total number of characters and returns an equivalent 0-padded hex value
    function decimalToHex(d, padding) {
        let hex = Number(d).toString(16);
        padding = typeof padding === 'undefined' || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = '0' + hex;
        }
        return hex;
    }

    // Shamelessly ripped from UR-MP and modified to fit my needs
    // Takes a number of days (generally age of a drive) and returns a corresponding color
    // Drive-based EA lasts for 90 days
    // Newest drives should be green, shifting through yellow @ 45 days, reaching 90 days age at full red.
    function getColorFromAge(ageInDays) {
        let r = 0;
        let g = 0;
        let b = 255;

        r = -15 + (6 * ageInDays);
        g = 525 - (6 * ageInDays);
        if (r < 0) {
            r = 0;
        }
        if (r > 255) {
            r = 255;
        }
        if (g < 0) {
            g = 0;
        }
        if (g > 255) {
            g = 255;
        }
        b = 0;
        if (ageInDays > (90 - DAYS_TO_EXPIRY)) {
            r = 255;
            g = 0;
            b = 255;
        }
        return '#' + decimalToHex(r, 2) + decimalToHex(g, 2) + decimalToHex(b, 2);
    }

    /*
     * Creates a pair of points around a given center point, perpendicular to the ray created between the center and a provided reference point, with the specified radius.
     * Ex: Providing a center at 0, 0 and a reference at 1,1 will create a pair of points at 135 degrees and 315 degrees
     */
    function getPolygonEdges(center, nextPoint, radius_mi) {
        // log("DEBUG", "Circle center: " + center);
        // For use with EPSG:3857 projection, meter-based cartesian/planar
        const radius_m = radius_mi * 1609.344; // miles to meters
        let points = [];
        let referenceBearing = getBearingFromCoordinatePair(center.y, center.x, nextPoint.y, nextPoint.x);

        for (let degree = referenceBearing + 90; degree <= referenceBearing + 270; degree += 180) {
            // Degrees use 0-north
            // For use with EPSG:4326 projection, WGS-84/human-readable degrees lat/lon
            const relativePoint = getNewScaledRelativeCoordinates(center.y, center.x, radius_m, (degree % 360));
            const globalPoint = new OpenLayers.Geometry.Point(center.x + relativePoint.x, center.y + relativePoint.y)
            // log("DEBUG", "Edge " + (degree % 360) + "\t" + center.x + "\t" + center.y + ":\t" + globalPoint.x + "\t" + globalPoint.y);
            points.push(globalPoint);
        }
        return points;
    }

    /*
     * Creates a semi-circle around a given center point, opposite a provided reference point, with the specified radius.
     * Ex: Providing a center at 0, 0 and a reference at 1,1 will create an arc from 135 degrees to 315 degrees
     */
    function getSemiCircularCap(center, referencePoint, radius_mi) {
        // log("DEBUG", "Circle center: " + center);
        // For use with EPSG:3857 projection, meter-based cartesian/planar
        const radius_m = radius_mi * 1609.344; // miles to meters
        let points = [];
        let referenceBearing = getBearingFromCoordinatePair(center.y, center.x, referencePoint.y, referencePoint.x);

        for (let degree = referenceBearing + 90; degree <= referenceBearing + 270; degree += 5) {
            // Degrees use 0-north
            // For use with EPSG:4326 projection, WGS-84/human-readable degrees lat/lon
            const relativePoint = getNewScaledRelativeCoordinates(center.y, center.x, radius_m, (degree % 360));
            const globalPoint = new OpenLayers.Geometry.Point(center.x + relativePoint.x, center.y + relativePoint.y)
            // log("DEBUG", "Cap " + (degree % 360) + "\t" + center.x + "\t" + center.y + ":\t" + globalPoint.x + "\t" + globalPoint.y);
            points.push(globalPoint);
        }
        return points;
    }

    // Shamelessly ripped from WME-USGB and modified to fit my needs
    // Takes a center point and a radius and makes a corresponding circle
    function getCircleLinearRing(center, radius_mi) {
        // log("DEBUG", "Circle center: " + center);
        // For use with EPSG:3857 projection, meter-based cartesian/planar
        const radius_m = radius_mi * 1609.344; // miles to meters
        const points = [];

        for (let degree = 0; degree < 360; degree += 5) {
            // Degrees use 0-north
            // For use with EPSG:4326 projection, WGS-84/human-readable degrees lat/lon
            const relativePoint = getNewScaledRelativeCoordinates(center.y, center.x, radius_m, degree);
            const globalPoint = new OpenLayers.Geometry.Point(center.x + relativePoint.x, center.y + relativePoint.y)
            points.push(globalPoint);
        }
        return new OpenLayers.Geometry.LinearRing(points);
    }

    /*
     * Gets an approximate radius in meters of the earth at a given latitude.
     * Useful for more locally accurate calculations.
     * Would it be nice to be a flat-earther?  Yes.  It would make this whole thing much easier.
     * Unfortunately the sphereical-earthers are wrong, too.  Turns out the earth is squishy
     * enough to deform along the equator because that's what happens when you spin a really large
     * mass really fast.  Science is cool.
     */
    function getEarthRadiusMeters(latitudeRadians)
    {
        return Math.sqrt(
            (Math.pow(Math.pow(EQUATORIAL_RADIUS_METERS, 2) * Math.cos(latitudeRadians), 2)
                + Math.pow(Math.pow(POLAR_RADIUS_METERS, 2) * Math.sin(latitudeRadians), 2)) /* end numerator */
            / (Math.pow(EQUATORIAL_RADIUS_METERS * Math.cos(latitudeRadians), 2)
                + Math.pow(POLAR_RADIUS_METERS * Math.sin(latitudeRadians), 2)) /* end denominator */
            ); /* End sqrt */
    }

    /*
     * Calculates new coordinates on a spheroid surface, given some initial point along with a
     * direction and distance to the desired new point.
     */
    function getNewCoordinates(latDegrees, lonDegrees, distanceMeters, bearingDegrees) {
        if (distanceMeters == 0) return new OpenLayers.Geometry.Point(lonDegrees, latDegrees);

        let latitudeRadians = toRadians(latDegrees);
        let longitudeRadians = toRadians(lonDegrees);
        let bearingRadians = toRadiansZeroEastPositiveCCW(bearingDegrees);
        let distanceRadians = distanceMeters / getEarthRadiusMeters(latitudeRadians);
        let newLatRadians = Math.asin(Math.sin(latitudeRadians) * Math.cos(distanceRadians) + Math.cos(latitudeRadians) * Math.cos(bearingRadians) * Math.sin(distanceRadians));
        let newLonRadians = longitudeRadians + Math.atan2(Math.sin(bearingRadians) * Math.sin(distanceRadians) * Math.cos(latitudeRadians), Math.cos(distanceRadians) - Math.sin(latitudeRadians) * Math.sin(newLatRadians));

        return new OpenLayers.Geometry.Point(toDegrees(newLonRadians), toDegrees(newLatRadians));
    }

    /*
     * Calculates new coordinates on a spheroid surface, treating the input coordinates as the origin (0, 0)
     * Creates relative or offset coordinates.
     */
    function getNewRelativeCoordinates(latDegrees, lonDegrees, distanceMeters, bearingDegrees) {
        if (distanceMeters == 0) return new OpenLayers.Geometry.Point(lonDegrees, latDegrees);

        let latitudeRadians = toRadians(latDegrees);
        let longitudeRadians = toRadians(lonDegrees);
        let bearingRadians = toRadians(bearingDegrees);
        let distanceRadians = distanceMeters / getEarthRadiusMeters(latitudeRadians);
        let newLatRadians = Math.asin(Math.sin(latitudeRadians) * Math.cos(distanceRadians) + Math.cos(latitudeRadians) * Math.cos(bearingRadians) * Math.sin(distanceRadians));
        let newLonRadians = longitudeRadians + Math.atan2(Math.sin(bearingRadians) * Math.sin(distanceRadians) * Math.cos(latitudeRadians), Math.cos(distanceRadians) - Math.sin(latitudeRadians) * Math.sin(newLatRadians));
        // Subtract original coordinates from resultant coordinates to provide relative/offset coordinates
        return new OpenLayers.Geometry.Point(toDegrees(newLonRadians) - lonDegrees, toDegrees(newLatRadians) - latDegrees);
    }

    /*
     * Calculates new coordinates on a spheroid surface, treating the input coordinates as the origin (0, 0)
     * Creates relative or offset coordinates that include magic number scalars.
     */
    function getNewScaledRelativeCoordinates(latDegrees, lonDegrees, distanceMeters, bearingDegrees) {
        let originalRelativePoint = getNewRelativeCoordinates(latDegrees, lonDegrees, distanceMeters, bearingDegrees);
        return new OpenLayers.Geometry.Point(originalRelativePoint.x * HORIZONTAL_SCALAR, originalRelativePoint.y * VERTICAL_SCALAR);
    }

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    /*
     * Converts from
     * degree with zero-north origin, increasing in the clockwise direction (earth, navigation)
     * to
     * radian with zero-west origin, increasing in the counterclockwise direction (math)
     */
    function toRadiansZeroEastPositiveCCW(degrees) {
        // Flip across line y = x
        let inputRadians = toRadians(degrees);
        let inputX = Math.cos(inputRadians);
        let inputY = Math.sin(inputRadians);
        // Here's the flip ladies and gents
        let flippedRadians = Math.atan2( inputX, inputY );
        // log("DEBUG", "Input degrees: " + degrees + "\t x: " + inputX + "\ty: " + inputY + "\tflipped: " + toDegrees(flippedRadians) + "\tradians: " + flippedRadians);
        return flippedRadians;
    }

    /*
     * Converts from
     * radian with zero-west origin, increasing in the counterclockwise direction (math)
     * to
     * degree with zero-north origin, increasing in the clockwise direction (earth, navigation)
     */
    function toDegreesZeroNorthPositiveCW(radians) {
        // Flip across line y = x
        let inputX = Math.cos(radians);
        let inputY = Math.sin(radians);
        // Here's the flip ladies and gents
        let flippedRadians = Math.atan2( inputX, inputY );
        return toDegrees(flippedRadians);
    }

    /*
     * Takes the given pair of coordinates and calculates an approximate bearing betwixt them
     */
    function getBearingFromCoordinatePair(lat1, lon1, lat2, lon2) {
        let lat1rad = toRadians(lat1);
        let lat2rad = toRadians(lat2);
        let lon1rad = toRadians(lon1);
        let lon2rad = toRadians(lon2);
        let y = Math.sin(lon2rad - lon1rad) * Math.cos(lat2rad);
        let x = Math.cos(lat1rad) * Math.sin(lat2rad) - Math.sin(lat1rad) * Math.cos(lat2rad) * Math.cos(lon2rad - lon1rad);
        return toDegrees(Math.atan2(y, x));
    }


    function initializeSettings() {
        // TODO: All the things
        // TODO: loadSettings if we ever have settings to load/save (can we save the area?  That's a lot of data but probably nicer than rescanning every time...)
        // Layer on/off status?
        $('#wmeeaaRadius').text(editRadius + " miles"); // TODO: Support km
        $('#wmeeaaDrives').text("Unknown! Please scan.");
        // $('#wmeeaaArea').text("Unknown! Please scan.");
    }

    function onAgeLayerToggleChanged(checked) {
        wmeeaaEditAgeLayer.setVisibility(checked);
        // log("DEBUG", "Layer checkbox is " + (checked ? "" : "not ") + "checked.");
    }

    function init() {
        try {
            log("INFO", SCRIPT_LONG_NAME + " " + SCRIPT_VERSION + " started");

            WM = W.map;
            DL = WM.driveLayer;
            editRadius = W.loginManager.user.attributes.editableMiles;

            // WazeWrap and whatever else initialization
            // Create our layer
            wmeeaaEditAgeLayer = new OpenLayers.Layer.Vector('wmeeaaEditAgeLayer', {
                uniqueName: '__wmeeaaEditAgeLayer',
                styleMap: new OpenLayers.StyleMap({ default: EAA_STYLE })
            } );
            // TODO: Set visibility to loaded value
            wmeeaaEditAgeLayer.setVisibility(true);
            wmeeaaEditAgeLayer.setZIndex(W.map.roadLayer.getZIndex() - 1);
            wmeeaaEditAgeLayer.setOpacity(0.3);

            // Add the layer checkbox to the Layers menu.
            WazeWrap.Interface.AddLayerCheckbox('display', 'Edit Age', layerEnabled, onAgeLayerToggleChanged);

            WM.addLayer(wmeeaaEditAgeLayer);

            _$scanDrivesButton = $('<button>', { id: 'wmeeaaStartScan', class: 'wmeeaaSettingsButton' }).text('Scan Area');


            // Userscripts tab section
            var $section = $("<div>");
            $section.append([
                '<div>',
                '<h2>WME Edit Area Age</h2>'
            ].join(' '));
            $section.append(_$scanDrivesButton);
            // TODO: Adjustable expiry age to only show area near expiry
            $section.append([
                '<hr>',
                '<div>',
                '<h3>Edit Age Info</h3>',
                'Editable radius: <span id="wmeeaaRadius"></span></br>',
                'Drives: <span id="wmeeaaDrives"></span></br>',
                // 'Editable area from drives: <span id="wmeeaaArea"></span></br>',
                '</div>',
                '</div>'
            ].join(' '));

            WazeWrap.Interface.Tab(SCRIPT_SHORTEST_NAME, $section.html(), initializeSettings);

            log("INFO", SCRIPT_LONG_NAME + " initialized!");

            $("#wmeeaaStartScan").click(onScanDrivesButtonClick);
        }
        catch (err) {
            log("ERROR", SCRIPT_LONG_NAME + " could not initialize: " + err);
        }
    }

    function onWmeReady() {
        if (WazeWrap && WazeWrap.Ready) {
            init();
        } else {
            setTimeout(onWmeReady, 100);
        }
    }

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            onWmeReady();
        } else {
            document.addEventListener('wme-ready', onWmeReady, { once: true });
        }
    }

    bootstrap();
})();
