// ==UserScript==
// @name         Link Enhancer
// @namespace    WazeDev
// @version      2025.09.07.1
// @description  Adds some extra WME functionality related to Google place links.
// @author       MapOMatic, WazeDev group
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// ==/UserScript==
 
/* global OpenLayers */
/* global W */
/* global google */
 
// /* eslint-disable */
/* eslint-disable no-unused-vars */
class GoogleLinkEnhancer {
    #DISABLE_CLOSED_PLACES = false; // Set to TRUE if the feature needs to be temporarily disabled, e.g. during the COVID-19 pandemic.
    #EXT_PROV_ELEM_QUERY = 'wz-list-item.external-provider';
    #EXT_PROV_ELEM_EDIT_QUERY = 'wz-list-item.external-provider-edit';
    #EXT_PROV_ELEM_CONTENT_QUERY = 'div.external-provider-content';
    #LINK_CACHE_NAME = 'gle_link_cache';
    #LINK_CACHE_CLEAN_INTERVAL_MIN = 1; // Interval to remove old links and save new ones.
    #LINK_CACHE_LIFESPAN_HR = 6; // Remove old links when they exceed this time limit.
 
    #linkCache;
    #enabled = false;
    #disableApiUntil = null; // When a serious API error occurs (OVER_QUERY_LIMIT, REQUEST_DENIED), set this to a time in the future.
    #mapLayer = null;
    #distanceLimit = 400; // Default distance (meters) when Waze place is flagged for being too far from Google place.
    // Area place is calculated as #distanceLimit + <distance between centroid and furthest node>
    #showTempClosedPOIs = true;
    #placesService;
    #linkObserver;
    #modeObserver;
    #searchResultsObserver;
    #lzString;
    #cacheCleanIntervalID;
    #originalHeadAppendChildMethod;
    #ptFeature;
    #lineFeature;
    #timeoutID;
    strings = {
        permClosedPlace: 'Google indicates this place is permanently closed.\nVerify with other sources or your editor community before deleting.',
        tempClosedPlace: 'Google indicates this place is temporarily closed.',
        multiLinked: 'Linked more than once already. Please find and remove multiple links.',
        linkedToThisPlace: 'Already linked to this place',
        linkedNearby: 'Already linked to a nearby place',
        linkedToXPlaces: 'This is linked to {0} places',
        badLink: 'Invalid Google link. Please remove it.',
        tooFar: 'The Google linked place is more than {0} meters from the Waze place.  Please verify the link is correct.'
    };
 
    /* eslint-enable no-unused-vars */
    constructor() {
        const attributionElem = document.createElement('div');
        this.#placesService = new google.maps.places.PlacesService(attributionElem);
        this.#initLZString();
        const STORED_CACHE = localStorage.getItem(this.#LINK_CACHE_NAME);
        try {
            this.#linkCache = STORED_CACHE ? $.parseJSON(this.#lzString.decompressFromUTF16(STORED_CACHE)) : {};
        } catch (ex) {
            if (ex.name === 'SyntaxError') {
                // In case the cache is corrupted and can't be read.
                this.#linkCache = {};
                console.warn('GoogleLinkEnhancer:', 'An error occurred while loading the stored cache. A new cache was created.');
            } else {
                throw ex;
            }
        }
        if (this.#linkCache === null || this.#linkCache.length === 0) this.#linkCache = {};
 
        this.#initLayer();
 
        // NOTE: Arrow functions are necessary for calling methods on object instances.
        // This could be made more efficient by only processing the relevant places.
        W.model.events.register('mergeend', null, () => { this.#processPlaces(); });
        W.model.venues.on('objectschanged', () => { this.#processPlaces(); });
        W.model.venues.on('objectsremoved', () => { this.#processPlaces(); });
        W.model.venues.on('objectsadded', () => { this.#processPlaces(); });
 
        // Watch for ext provider elements being added to the DOM, and add hover events.
        this.#linkObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let idx = 0; idx < mutation.addedNodes.length; idx++) {
                    const nd = mutation.addedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE) {
                        const $el = $(nd);
                        const $subel = $el.find(this.#EXT_PROV_ELEM_QUERY);
                        if ($el.is(this.#EXT_PROV_ELEM_QUERY)) {
                            this.#addHoverEvent($el);
                            this.#formatLinkElements();
                        } else if ($subel.length) {
                            for (let i = 0; i < $subel.length; i++) {
                                this.#addHoverEvent($($subel[i]));
                            }
                            this.#formatLinkElements();
                        }
                        if ($el.is(this.#EXT_PROV_ELEM_EDIT_QUERY)) {
                            // Support both production and beta: find any wz-autocomplete
                            const wzAuto = $el.find('wz-autocomplete')[0];
                            if (wzAuto) {
                                // Try to observe shadowRoot if available
                                if (wzAuto.shadowRoot) {
                                    this.#searchResultsObserver.observe(wzAuto.shadowRoot, { childList: true, subtree: true });
                                } else {
                                    // Fallback: try to observe the element itself (may not work if results are in shadow DOM)
                                    this.#searchResultsObserver.observe(wzAuto, { childList: true, subtree: true });
                                    console.warn('GLE: wz-autocomplete has no shadowRoot, observing element directly (beta fallback)');
                                }
                            } else {
                                console.warn('GLE: wz-autocomplete not found in external-provider-edit');
                            }
                        }
                    }
                }
                for (let idx = 0; idx < mutation.removedNodes.length; idx++) {
                    const nd = mutation.removedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE) {
                        const $el = $(nd);
                        if ($el.is(this.#EXT_PROV_ELEM_EDIT_QUERY)) {
                            this.#searchResultsObserver.disconnect();
                        }
                    }
                }
            });
        });
 
        // Watch for Google place search result list items being added to the DOM
        const that = this;
        this.#searchResultsObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let idx = 0; idx < mutation.addedNodes.length; idx++) {
                    const nd = mutation.addedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE && $(nd).is('wz-menu-item.simple-item')) {
                        $(nd).mouseenter(() => {
                            // When mousing over a list item, find the Google place ID from the list that was stored previously.
                            // Then add the point/line to the map.
                            that.#addPoint($(nd).attr('item-id'));
                        }).mouseleave(() => {
                            // When leaving the list item, remove the point.
                            that.#destroyPoint();
                        });
                    }
                }
            });
        });
 
        // Watch the side panel for addition of the sidebar-layout div, which indicates a mode change.
        this.#modeObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let idx = 0; idx < mutation.addedNodes.length; idx++) {
                    const nd = mutation.addedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE && $(nd).is('.sidebar-layout')) {
                        this.#observeLinks();
                        break;
                    }
                }
            });
        });
 
        // This is a special event that will be triggered when DOM elements are destroyed.
        /* eslint-disable wrap-iife, func-names, object-shorthand */
        (function($) {
            $.event.special.destroyed = {
                remove: function(o) {
                    if (o.handler && o.type !== 'destroyed') {
                        o.handler();
                    }
                }
            };
        })(jQuery);
        /* eslint-enable wrap-iife, func-names, object-shorthand */
 
        // In case a place is already selected on load.
        const selObjects = W.selectionManager.getSelectedDataModelObjects();
        if (selObjects.length && selObjects[0].type === 'venue') {
            this.#formatLinkElements();
        }
    }
 
    #initLayer() {
        // Prevent duplicate layer creation
        const uniqueName = '___GoogleGLELinkEnhancements';
        let existingLayer = W.map.getLayerByUniqueName(uniqueName);
        if (existingLayer) {
            this.#mapLayer = existingLayer;
        } else {
            this.#mapLayer = new OpenLayers.Layer.Vector('Google GLE Link Enhancements.', {
                uniqueName: uniqueName,
                displayInLayerSwitcher: true,
                styleMap: new OpenLayers.StyleMap({
                    default: {
                        strokeColor: '${strokeColor}',
                        strokeWidth: '${strokeWidth}',
                        strokeDashstyle: '${strokeDashstyle}',
                        pointRadius: '15',
                        fillOpacity: '0'
                    }
                })
            });
            this.#mapLayer.setOpacity(0.8);
            W.map.addLayer(this.#mapLayer);
        }
    }
 
    enable() {
        if (!this.#enabled) {
            this.#modeObserver.observe($('.edit-area #sidebarContent')[0], { childList: true, subtree: false });
            this.#observeLinks();
            // Watch for JSONP callbacks. JSONP is used for the autocomplete results when searching for Google links.
            this.#addJsonpInterceptor();
            // Note: Using on() allows passing "this" as a variable, so it can be used in the handler function.
            $('#map').on('mouseenter', null, this, GoogleLinkEnhancer.#onMapMouseenter);
            $(window).on('unload', null, this, GoogleLinkEnhancer.#onWindowUnload);
            W.model.venues.on('objectschanged', this.#formatLinkElements, this);
            this.#processPlaces();
            this.#cleanAndSaveLinkCache();
            this.#cacheCleanIntervalID = setInterval(() => this.#cleanAndSaveLinkCache(), 1000 * 60 * this.#LINK_CACHE_CLEAN_INTERVAL_MIN);
            this.#enabled = true;
        }
    }
 
    disable() {
        if (this.#enabled) {
            this.#modeObserver.disconnect();
            this.#linkObserver.disconnect();
            this.#searchResultsObserver.disconnect();
            this.#removeJsonpInterceptor();
            $('#map').off('mouseenter', GoogleLinkEnhancer.#onMapMouseenter);
            $(window).off('unload', null, this, GoogleLinkEnhancer.#onWindowUnload);
            W.model.venues.off('objectschanged', this.#formatLinkElements, this);
            if (this.#cacheCleanIntervalID) clearInterval(this.#cacheCleanIntervalID);
            this.#cleanAndSaveLinkCache();
            this.#enabled = false;
        }
    }
 
    // The distance (in meters) before flagging a Waze place that is too far from the linked Google place.
    // Area places use distanceLimit, plus the distance from the centroid of the AP to its furthest node.
    get distanceLimit() {
        return this.#distanceLimit;
    }
 
    set distanceLimit(value) {
        this.#distanceLimit = value;
        this.#processPlaces();
    }
 
    get showTempClosedPOIs() {
        return this.#showTempClosedPOIs;
    }
 
    set showTempClosedPOIs(value) {
        this.#showTempClosedPOIs = value;
        this.#processPlaces();
    }
 
    static #onWindowUnload(evt) {
        evt.data.#cleanAndSaveLinkCache();
    }
 
    #cleanAndSaveLinkCache() {
        if (!this.#linkCache) return;
        const now = new Date();
        Object.keys(this.#linkCache).forEach(id => {
            const link = this.#linkCache[id];
            // Bug fix:
            if (link.location) {
                link.loc = link.location;
                delete link.location;
            }
            // Delete link if older than X hours.
            if (!link.ts || (now - new Date(link.ts)) > this.#LINK_CACHE_LIFESPAN_HR * 3600 * 1000) {
                delete this.#linkCache[id];
            }
        });
        localStorage.setItem(this.#LINK_CACHE_NAME, this.#lzString.compressToUTF16(JSON.stringify(this.#linkCache)));
        // console.log('link cache count: ' + Object.keys(this.#linkCache).length, this.#linkCache);
    }
 
    // Borrowed from WazeWrap
    static #distanceBetweenPoints(point1, point2) {
        const line = new OpenLayers.Geometry.LineString([point1, point2]);
        const length = line.getGeodesicLength(W.map.getProjectionObject());
        return length; // multiply by 3.28084 to convert to feet
    }
 
    #isLinkTooFar(link, venue) {
        if (link.loc) {
            const linkPt = new OpenLayers.Geometry.Point(link.loc.lng, link.loc.lat);
            linkPt.transform(W.Config.map.projection.remote, W.map.getProjectionObject());
            let venuePt;
            let distanceLim = this.distanceLimit;
            if (venue.isPoint()) {
                venuePt = venue.geometry.getCentroid();
            } else {
                const bounds = venue.geometry.getBounds();
                const center = bounds.getCenterLonLat();
                venuePt = new OpenLayers.Geometry.Point(center.lon, center.lat);
                const topRightPt = new OpenLayers.Geometry.Point(bounds.right, bounds.top);
                distanceLim += GoogleLinkEnhancer.#distanceBetweenPoints(venuePt, topRightPt);
            }
            const distance = GoogleLinkEnhancer.#distanceBetweenPoints(linkPt, venuePt);
            return distance > distanceLim;
        }
        return false;
    }
 
    // eslint-disable-next-line class-methods-use-this
    #processPlaces() {
        try {
            if (this.#enabled) {
                const that = this;
                // Get a list of already-linked id's
                const existingLinks = GoogleLinkEnhancer.#getExistingLinks();
                this.#mapLayer.removeAllFeatures();
                const drawnLinks = [];
                W.model.venues.getObjectArray().forEach(venue => {
                    const promises = [];
                    venue.attributes.externalProviderIDs.forEach(provID => {
                        const id = provID.attributes.uuid;

                        // Check for duplicate links
                        const linkInfo = existingLinks[id];
                        if (linkInfo.count > 1) {
                            const geometry = venue.isPoint() ? venue.geometry.getCentroid() : venue.geometry.clone();
                            const width = venue.isPoint() ? '4' : '12';
                            const color = '#fb8d00';
                            const features = [new OpenLayers.Feature.Vector(geometry, {
                                strokeWidth: width, strokeColor: color
                            })];
                            const lineStart = geometry.getCentroid();
                            linkInfo.venues.forEach(linkVenue => {
                                if (linkVenue !== venue
                                    && !drawnLinks.some(dl => (dl[0] === venue && dl[1] === linkVenue) || (dl[0] === linkVenue && dl[1] === venue))) {
                                    features.push(
                                        new OpenLayers.Feature.Vector(
                                            new OpenLayers.Geometry.LineString([lineStart, linkVenue.geometry.getCentroid()]),
                                            {
                                                strokeWidth: 4,
                                                strokeColor: color,
                                                strokeDashstyle: '12 12'
                                            }
                                        )
                                    );
                                    drawnLinks.push([venue, linkVenue]);
                                }
                            });
                            that.#mapLayer.addFeatures(features);
                        }

                        // Get Google link info, and store results for processing.
                        promises.push(that.#getLinkInfoAsync(id));
                    });

                    // Process all results of link lookups and add a highlight feature if needed.
                    Promise.all(promises).then(results => {
                        let strokeColor = null;
                        let strokeDashStyle = 'solid';
                        if (!that.#DISABLE_CLOSED_PLACES && results.some(res => res.permclosed)) {
                            if (/^(\[|\()?(permanently )?closed(\]|\)| -)/i.test(venue.attributes.name)
                                || /(\(|- |\[)(permanently )?closed(\)|\])?$/i.test(venue.attributes.name)) {
                                strokeDashStyle = venue.isPoint() ? '2 6' : '2 16';
                            }
                            strokeColor = '#F00';
                        } else if (results.some(res => that.#isLinkTooFar(res, venue))) {
                            strokeColor = '#0FF';
                        } else if (!that.#DISABLE_CLOSED_PLACES && that.#showTempClosedPOIs && results.some(res => res.tempclosed)) {
                            if (/^(\[|\()?(temporarily )?closed(\]|\)| -)/i.test(venue.attributes.name)
                                || /(\(|- |\[)(temporarily )?closed(\)|\])?$/i.test(venue.attributes.name)) {
                                strokeDashStyle = venue.isPoint() ? '2 6' : '2 16';
                            }
                            strokeColor = '#FD3';
                        } else if (results.some(res => res.notFound)) {
                            strokeColor = '#F0F';
                        }
                        if (strokeColor) {
                            const style = {
                                strokeWidth: venue.isPoint() ? '4' : '12',
                                strokeColor,
                                strokeDashStyle
                            };
                            const geometry = venue.isPoint() ? venue.geometry.getCentroid() : venue.geometry.clone();
                            that.#mapLayer.addFeatures([new OpenLayers.Feature.Vector(geometry, style)]);
                        }
                    });
                });
            }
        } catch (ex) {
            console.error('PIE (Google Link Enhancer) error:', ex);
        }
    }
 
    #cacheLink(id, link) {
        link.ts = new Date();
        this.#linkCache[id] = link;
        // console.log('link cache count: ' + Object.keys(this.#linkCache).length, this.#linkCache);
    }
 
    #getLinkInfoAsync(placeId) {
        return new Promise(resolve => {
            let link = this.#linkCache[placeId];
            if (!link) {
                const request = {
                    placeId,
                    fields: ['geometry', 'business_status']
                };
                this.#placesService.getDetails(request, (place, requestStatus) => {
                    link = {};
                    if (requestStatus === google.maps.places.PlacesServiceStatus.OK) {
                        const loc = place.geometry.location;
                        link.loc = { lng: loc.lng(), lat: loc.lat() };
                        if (place.business_status === 'CLOSED_PERMANENTLY') {
                            link.permclosed = true;
                        } else if (place.business_status === 'CLOSED_TEMPORARILY') {
                            link.tempclosed = true;
                        }
                        this.#cacheLink(placeId, link);
                    } else if (requestStatus === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
                        link.notfound = true;
                        this.#cacheLink(placeId, link);
                    } else if (this.#disableApiUntil) {
                        link.apiDisabled = true;
                    } else {
                        link.error = requestStatus;
                        // res.errorMessage = json.error_message;
                        this.#disableApiUntil = Date.now() + 10 * 1000; // Disable api calls for 10 seconds.
                        console.error(`${GM_info.script.name}, Google Link Enhancer disabled for 10 seconds due to API error.`, link);
                    }
                    resolve(link);
                });
            } else {
                resolve(link);
            }
                // link = {};
                // this.#cacheLink(placeId, link);
             // }
            // resolve(link);			
        });
    }
 
    static #onMapMouseenter(event) {
        // If the point isn't destroyed yet, destroy it when mousing over the map.
        event.data.#destroyPoint();
    }
 
    async #formatLinkElements(callCount = 0) {
        const $links = $('#edit-panel').find(this.#EXT_PROV_ELEM_QUERY);
        const selObjects = W.selectionManager.getSelectedDataModelObjects();
        if (!$links.length) {
            // If links aren't available, continue calling this function for up to 3 seconds unless place has been deselected.
            if (callCount < 30 && selObjects.length && selObjects[0].type === 'venue') {
                setTimeout(() => this.#formatLinkElements(++callCount), 100);
            }
        } else {
            const existingLinks = GoogleLinkEnhancer.#getExistingLinks();
 
            // fetch all links first
            const promises = [];
            const extProvElements = [];
            $links.each((ix, linkEl) => {
                const $linkEl = $(linkEl);
                extProvElements.push($linkEl);
 
                const id = GoogleLinkEnhancer.#getIdFromElement($linkEl);
                if (!id) return;
 
                promises.push(this.#getLinkInfoAsync(id));
            });
            await Promise.all(promises);
 
            extProvElements.forEach($extProvElem => {
                const id = GoogleLinkEnhancer.#getIdFromElement($extProvElem);
 
                if (!id) return;
 
                const link = this.#linkCache[id];
                if (existingLinks[id] && existingLinks[id].count > 1 && existingLinks[id].isThisVenue) {
                    setTimeout(() => {
                        $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '#FFA500' }).attr({
                            title: this.strings.linkedToXPlaces.replace('{0}', existingLinks[id].count)
                        });
                    }, 50);
                }
                this.#addHoverEvent($extProvElem);
                if (link) {
                    if (link.permclosed && !this.#DISABLE_CLOSED_PLACES) {
                        $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '#FAA' }).attr('title', this.strings.permClosedPlace);
                    } else if (link.tempclosed && !this.#DISABLE_CLOSED_PLACES) {
                        $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '#FFA' }).attr('title', this.strings.tempClosedPlace);
                    } else if (link.notFound) {
                        $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '#F0F' }).attr('title', this.strings.badLink);
                    } else {
                        const venue = W.selectionManager.getSelectedDataModelObjects()[0];
                        if (this.#isLinkTooFar(link, venue)) {
                            $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '#0FF' }).attr('title', this.strings.tooFar.replace('{0}', this.distanceLimit));
                        } else { // reset in case we just deleted another provider
                            $extProvElem.find(this.#EXT_PROV_ELEM_CONTENT_QUERY).css({ backgroundColor: '' }).attr('title', '');
                        }
                    }
                }
            });
        }
    }
 
    static #getExistingLinks() {
        const existingLinks = {};
        const thisVenue = W.selectionManager.getSelectedDataModelObjects()[0];
        W.model.venues.getObjectArray().forEach(venue => {
            const isThisVenue = venue === thisVenue;
            const thisPlaceIDs = [];
            venue.attributes.externalProviderIDs.forEach(provID => {
                const id = provID.attributes.uuid;
                if (thisPlaceIDs.indexOf(id) === -1) {
                    thisPlaceIDs.push(id);
                    let link = existingLinks[id];
                    if (link) {
                        link.count++;
                        link.venues.push(venue);
                    } else {
                        link = { count: 1, venues: [venue] };
                        existingLinks[id] = link;
                        if (provID.attributes.url != null) {
                            const u = provID.attributes.url.replace('https://maps.google.com/?', '');
                            link.url = u;
                        }
                    }
                    link.isThisVenue = link.isThisVenue || isThisVenue;
                }
            });
        });
        return existingLinks;
    }
 
    // Remove the POI point from the map.
    #destroyPoint() {
        if (this.#ptFeature) {
            this.#ptFeature.destroy();
            this.#ptFeature = null;
            this.#lineFeature.destroy();
            this.#lineFeature = null;
        }
    }
 
    static #getOLMapExtent() {
        let extent = W.map.getExtent();
        if (Array.isArray(extent)) {
            extent = new OpenLayers.Bounds(extent);
            extent.transform('EPSG:4326', 'EPSG:3857');
        }
        return extent;
    }
 
    // Add the POI point to the map.
    #addPoint(id) {
        if (!id) return;
        const link = this.#linkCache[id];
        if (link) {
            if (!link.notFound) {
                const coord = link.loc;
                const poiPt = new OpenLayers.Geometry.Point(coord.lng, coord.lat);
                poiPt.transform(W.Config.map.projection.remote, W.map.getProjectionObject().projCode);
                const placeGeom = W.selectionManager.getSelectedDataModelObjects()[0].geometry.getCentroid();
                const placePt = new OpenLayers.Geometry.Point(placeGeom.x, placeGeom.y);
                const ext = GoogleLinkEnhancer.#getOLMapExtent();
                const lsBounds = new OpenLayers.Geometry.LineString([
                    new OpenLayers.Geometry.Point(ext.left, ext.bottom),
                    new OpenLayers.Geometry.Point(ext.left, ext.top),
                    new OpenLayers.Geometry.Point(ext.right, ext.top),
                    new OpenLayers.Geometry.Point(ext.right, ext.bottom),
                    new OpenLayers.Geometry.Point(ext.left, ext.bottom)]);
                let lsLine = new OpenLayers.Geometry.LineString([placePt, poiPt]);
 
                // If the line extends outside the bounds, split it so we don't draw a line across the world.
                const splits = lsLine.splitWith(lsBounds);
                let label = '';
                if (splits) {
                    let splitPoints;
                    splits.forEach(split => {
                        split.components.forEach(component => {
                            if (component.x === placePt.x && component.y === placePt.y) splitPoints = split;
                        });
                    });
                    lsLine = new OpenLayers.Geometry.LineString([splitPoints.components[0], splitPoints.components[1]]);
                    let distance = GoogleLinkEnhancer.#distanceBetweenPoints(poiPt, placePt);
                    let unitConversion;
                    let unit1;
                    let unit2;
                    if (W.model.isImperial) {
                        distance *= 3.28084;
                        unitConversion = 5280;
                        unit1 = ' ft';
                        unit2 = ' mi';
                    } else {
                        unitConversion = 1000;
                        unit1 = ' m';
                        unit2 = ' km';
                    }
                    if (distance > unitConversion * 10) {
                        label = Math.round(distance / unitConversion) + unit2;
                    } else if (distance > 1000) {
                        label = (Math.round(distance / (unitConversion / 10)) / 10) + unit2;
                    } else {
                        label = Math.round(distance) + unit1;
                    }
                }
 
                this.#destroyPoint(); // Just in case it still exists.
                this.#ptFeature = new OpenLayers.Feature.Vector(poiPt, { poiCoord: true }, {
                    pointRadius: 6,
                    strokeWidth: 30,
                    strokeColor: '#FF0',
                    fillColor: '#FF0',
                    strokeOpacity: 0.5
                });
                this.#lineFeature = new OpenLayers.Feature.Vector(lsLine, {}, {
                    strokeWidth: 3,
                    strokeDashstyle: '12 8',
                    strokeColor: '#FF0',
                    label,
                    labelYOffset: 45,
                    fontColor: '#FF0',
                    fontWeight: 'bold',
                    labelOutlineColor: '#000',
                    labelOutlineWidth: 4,
                    fontSize: '18'
                });
                W.map.getLayerByUniqueName('venues').addFeatures([this.#ptFeature, this.#lineFeature]);
                this.#timeoutDestroyPoint();
            }
        } else {
            this.#getLinkInfoAsync(id).then(res => {
                if (res.error || res.apiDisabled) {
                    // API was temporarily disabled.  Ignore for now.
                } else {
                    this.#addPoint(id);
                }
            });
        }
    }
 
    // Destroy the point after some time, if it hasn't been destroyed already.
    #timeoutDestroyPoint() {
        if (this.#timeoutID) clearTimeout(this.#timeoutID);
        this.#timeoutID = setTimeout(() => this.#destroyPoint(), 4000);
    }
 
    static #getIdFromElement($el) {
        const providerIndex = $el.parent().children().toArray().indexOf($el[0]);
        return W.selectionManager.getSelectedDataModelObjects()[0].getExternalProviderIDs()[providerIndex]?.attributes.uuid;
    }
 
    #addHoverEvent($el) {
        $el.hover(() => this.#addPoint(GoogleLinkEnhancer.#getIdFromElement($el)), () => this.#destroyPoint());
    }
 
    #observeLinks() {
        const editPanel = document.querySelector('#edit-panel');
        if (!editPanel) {
            setTimeout(() => this.#observeLinks(), 250);
            return;
        }
        this.editPanelElem = editPanel;
        this.#linkObserver.observe(editPanel, { childList: true, subtree: true });
    }
 
    // The JSONP interceptor is used to watch the head element for the addition of JSONP functions
    // that process Google link search results. Those functions are overridden by our own so we can
    // process the results before sending them on to the original function.
    #addJsonpInterceptor() {
        // The idea for this function was hatched here:
        // https://stackoverflow.com/questions/6803521/can-google-maps-places-autocomplete-api-be-used-via-ajax/9856786
 
        // The head element, where the Google Autocomplete code will insert a tag
        // for a javascript file.
        const head = $('head')[0];
        // The name of the method the Autocomplete code uses to insert the tag.
        const method = 'appendChild';
        // The method we will be overriding.
        const originalMethod = head[method];
        this.#originalHeadAppendChildMethod = originalMethod;
        const that = this;
        /* eslint-disable func-names, prefer-rest-params */ // Doesn't work as an arrow function (at least not without some modifications)
        head[method] = function() {
            // Check that the element is a javascript tag being inserted by Google.
            if (arguments[0] && arguments[0].src && arguments[0].src.match(/GetPredictions/)) {
                // Regex to extract the name of the callback method that the JSONP will call.
                const callbackMatchObject = (/callback=([^&]+)&|$/).exec(arguments[0].src);
 
                // Regex to extract the search term that was entered by the user.
                const searchTermMatchObject = (/\?1s([^&]+)&/).exec(arguments[0].src);
 
                // const searchTerm = unescape(searchTermMatchObject[1]);
                if (callbackMatchObject && searchTermMatchObject) {
                    // The JSONP callback method is in the form "abc.def" and each time has a different random name.
                    const names = callbackMatchObject[1].split('.');
                    // Store the original callback method.
                    const originalCallback = names[0] && names[1] && window[names[0]] && window[names[0]][names[1]];
 
                    if (originalCallback) {
                        const newCallback = function() { // Define your own JSONP callback
                            if (arguments[0] && arguments[0].predictions) {
                                // SUCCESS!
 
                                // The autocomplete results
                                const data = arguments[0];
 
                                // console.log('GLE: ' + JSON.stringify(data));
                                that._lastSearchResultPlaceIds = data.predictions.map(pred => pred.place_id);
 
                                // Call the original callback so the WME dropdown can do its thing.
                                originalCallback(data);
                            }
                        };
 
                        // Add copy of all the attributes of the old callback function to the new callback function.
                        // This prevents the autocomplete functionality from throwing an error.
                        Object.keys(originalCallback).forEach(key => {
                            newCallback[key] = originalCallback[key];
                        });
                        window[names[0]][names[1]] = newCallback; // Override the JSONP callback
                    }
                }
            }
            // Insert the element into the dom, regardless of whether it was being inserted by Google.
            return originalMethod.apply(this, arguments);
        };
        /* eslint-enable func-names, prefer-rest-params */
    }
 
    #removeJsonpInterceptor() {
        $('head')[0].appendChild = this.#originalHeadAppendChildMethod;
    }
 
    /* eslint-disable */ // Disabling eslint since this is copied code.
    #initLZString() {
        // LZ Compressor
        // Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
        // This work is free. You can redistribute it and/or modify it
        // under the terms of the WTFPL, Version 2
        // LZ-based compression algorithm, version 1.4.4
        this.#lzString = (function () {
            // private property
            const f = String.fromCharCode;
            const keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
            const baseReverseDic = {};
 
            function getBaseValue(alphabet, character) {
                if (!baseReverseDic[alphabet]) {
                    baseReverseDic[alphabet] = {};
                    for (let i = 0; i < alphabet.length; i++) {
                        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                    }
                }
                return baseReverseDic[alphabet][character];
            }
            var LZString = {
                compressToBase64: function (input) {
                    if (input === null) return "";
                    const res = LZString._compress(input, 6, function (a) {
                        return keyStrBase64.charAt(a);
                    });
                    switch (res.length % 4) { // To produce valid Base64
                        default: // When could this happen ?
                        case 0:
                            return res;
                        case 1:
                            return res + "===";
                        case 2:
                            return res + "==";
                        case 3:
                            return res + "=";
                    }
                },
                decompressFromBase64: function (input) {
                    if (input === null) return "";
                    if (input === "") return null;
                    return LZString._decompress(input.length, 32, function (index) {
                        return getBaseValue(keyStrBase64, input.charAt(index));
                    });
                },
                compressToUTF16: function (input) {
                    if (input === null) return "";
                    return LZString._compress(input, 15, function (a) {
                        return f(a + 32);
                    }) + " ";
                },
                decompressFromUTF16: function (compressed) {
                    if (compressed === null) return "";
                    if (compressed === "") return null;
                    return LZString._decompress(compressed.length, 16384, function (index) {
                        return compressed.charCodeAt(index) - 32;
                    });
                },
 
                compress: function (uncompressed) {
                    return LZString._compress(uncompressed, 16, function (a) {
                        return f(a);
                    });
                },
                _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
                    if (uncompressed === null) return "";
                    let i, value,
                        context_dictionary = {},
                        context_dictionaryToCreate = {},
                        context_c = "",
                        context_wc = "",
                        context_w = "",
                        context_enlargeIn = 2, // Compensate for the first entry which should not count
                        context_dictSize = 3,
                        context_numBits = 2,
                        context_data = [],
                        context_data_val = 0,
                        context_data_position = 0,
                        ii;
                    for (ii = 0; ii < uncompressed.length; ii += 1) {
                        context_c = uncompressed.charAt(ii);
                        if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                            context_dictionary[context_c] = context_dictSize++;
                            context_dictionaryToCreate[context_c] = true;
                        }
                        context_wc = context_w + context_c;
                        if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                            context_w = context_wc;
                        } else {
                            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                                if (context_w.charCodeAt(0) < 256) {
                                    for (i = 0; i < context_numBits; i++) {
                                        context_data_val = (context_data_val << 1);
                                        if (context_data_position === bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                    }
                                    value = context_w.charCodeAt(0);
                                    for (i = 0; i < 8; i++) {
                                        context_data_val = (context_data_val << 1) | (value & 1);
                                        if (context_data_position === bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = value >> 1;
                                    }
                                } else {
                                    value = 1;
                                    for (i = 0; i < context_numBits; i++) {
                                        context_data_val = (context_data_val << 1) | value;
                                        if (context_data_position === bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = 0;
                                    }
                                    value = context_w.charCodeAt(0);
                                    for (i = 0; i < 16; i++) {
                                        context_data_val = (context_data_val << 1) | (value & 1);
                                        if (context_data_position === bitsPerChar - 1) {
                                            context_data_position = 0;
                                            context_data.push(getCharFromInt(context_data_val));
                                            context_data_val = 0;
                                        } else {
                                            context_data_position++;
                                        }
                                        value = value >> 1;
                                    }
                                }
                                context_enlargeIn--;
                                if (context_enlargeIn === 0) {
                                    context_enlargeIn = Math.pow(2, context_numBits);
                                    context_numBits++;
                                }
                                delete context_dictionaryToCreate[context_w];
                            } else {
                                value = context_dictionary[context_w];
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position === bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn === 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }
                            // Add wc to the dictionary.
                            context_dictionary[context_wc] = context_dictSize++;
                            context_w = String(context_c);
                        }
                    }
                    // Output the code for w.
                    if (context_w !== "") {
                        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                            if (context_w.charCodeAt(0) < 256) {
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1);
                                    if (context_data_position === bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                }
                                value = context_w.charCodeAt(0);
                                for (i = 0; i < 8; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position === bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            } else {
                                value = 1;
                                for (i = 0; i < context_numBits; i++) {
                                    context_data_val = (context_data_val << 1) | value;
                                    if (context_data_position === bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = 0;
                                }
                                value = context_w.charCodeAt(0);
                                for (i = 0; i < 16; i++) {
                                    context_data_val = (context_data_val << 1) | (value & 1);
                                    if (context_data_position === bitsPerChar - 1) {
                                        context_data_position = 0;
                                        context_data.push(getCharFromInt(context_data_val));
                                        context_data_val = 0;
                                    } else {
                                        context_data_position++;
                                    }
                                    value = value >> 1;
                                }
                            }
                            context_enlargeIn--;
                            if (context_enlargeIn === 0) {
                                context_enlargeIn = Math.pow(2, context_numBits);
                                context_numBits++;
                            }
                            delete context_dictionaryToCreate[context_w];
                        } else {
                            value = context_dictionary[context_w];
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position === bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                } else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn === 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                    }
                    // Mark the end of the stream
                    value = 2;
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        } else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                    // Flush the last char
                    while (true) {
                        context_data_val = (context_data_val << 1);
                        if (context_data_position === bitsPerChar - 1) {
                            context_data.push(getCharFromInt(context_data_val));
                            break;
                        } else context_data_position++;
                    }
                    return context_data.join('');
                },
                decompress: function (compressed) {
                    if (compressed === null) return "";
                    if (compressed === "") return null;
                    return LZString._decompress(compressed.length, 32768, function (index) {
                        return compressed.charCodeAt(index);
                    });
                },
                _decompress: function (length, resetValue, getNextValue) {
                    let dictionary = [],
                        next,
                        enlargeIn = 4,
                        dictSize = 4,
                        numBits = 3,
                        entry = "",
                        result = [],
                        i,
                        w,
                        bits, resb, maxpower, power,
                        c,
                        data = {
                            val: getNextValue(0),
                            position: resetValue,
                            index: 1
                        };
                    for (i = 0; i < 3; i += 1) {
                        dictionary[i] = i;
                    }
                    bits = 0;
                    maxpower = Math.pow(2, 2);
                    power = 1;
                    while (power !== maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position === 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    switch (next = bits) {
                        case 0:
                            bits = 0;
                            maxpower = Math.pow(2, 8);
                            power = 1;
                            while (power !== maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position === 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 1:
                            bits = 0;
                            maxpower = Math.pow(2, 16);
                            power = 1;
                            while (power !== maxpower) {
                                resb = data.val & data.position;
                                data.position >>= 1;
                                if (data.position === 0) {
                                    data.position = resetValue;
                                    data.val = getNextValue(data.index++);
                                }
                                bits |= (resb > 0 ? 1 : 0) * power;
                                power <<= 1;
                            }
                            c = f(bits);
                            break;
                        case 2:
                            return "";
                    }
                    dictionary[3] = c;
                    w = c;
                    result.push(c);
                    while (true) {
                        if (data.index > length) {
                            return "";
                        }
                        bits = 0;
                        maxpower = Math.pow(2, numBits);
                        power = 1;
                        while (power !== maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position === 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        switch (c = bits) {
                            case 0:
                                bits = 0;
                                maxpower = Math.pow(2, 8);
                                power = 1;
                                while (power !== maxpower) {
                                    resb = data.val & data.position;
                                    data.position >>= 1;
                                    if (data.position === 0) {
                                        data.position = resetValue;
                                        data.val = getNextValue(data.index++);
                                    }
                                    bits |= (resb > 0 ? 1 : 0) * power;
                                    power <<= 1;
                                }
                                dictionary[dictSize++] = f(bits);
                                c = dictSize - 1;
                                enlargeIn--;
                                break;
                            case 1:
                                bits = 0;
                                maxpower = Math.pow(2, 16);
                                power = 1;
                                while (power !== maxpower) {
                                    resb = data.val & data.position;
                                    data.position >>= 1;
                                    if (data.position === 0) {
                                        data.position = resetValue;
                                        data.val = getNextValue(data.index++);
                                    }
                                    bits |= (resb > 0 ? 1 : 0) * power;
                                    power <<= 1;
                                }
                                dictionary[dictSize++] = f(bits);
                                c = dictSize - 1;
                                enlargeIn--;
                                break;
                            case 2:
                                return result.join('');
                        }
                        if (enlargeIn === 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }
                        if (dictionary[c]) {
                            entry = dictionary[c];
                        } else {
                            if (c === dictSize) {
                                entry = w + w.charAt(0);
                            } else {
                                return null;
                            }
                        }
                        result.push(entry);
                        // Add w+entry[0] to the dictionary.
                        dictionary[dictSize++] = w + entry.charAt(0);
                        enlargeIn--;
                        w = entry;
                        if (enlargeIn === 0) {
                            enlargeIn = Math.pow(2, numBits);
                            numBits++;
                        }
                    }
                }
            };
            return LZString;
        })();
    }
    /* eslint-enable */
}