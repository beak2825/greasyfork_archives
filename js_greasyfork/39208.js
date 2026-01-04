// ==UserScript==
// @name         WME Utils - Google Link Enhancer
// @namespace    WazeDev
// @version      2025.04.11.002
// @description  Adds some extra WME functionality related to Google place links.
// @author       MapOMatic, WazeDev group
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// ==/UserScript==

/* global OpenLayers */
/* global W */
/* global google */

/* eslint-disable max-classes-per-file */

// eslint-disable-next-line func-names
const GoogleLinkEnhancer = (function() {
    'use strict';

    class GooglePlaceCache {
        constructor() {
            this.cache = new Map();
            this.pendingPromises = new Map();
        }

        async getPlace(placeId) {
            if (this.cache.has(placeId)) {
                return this.cache.get(placeId);
            }

            if (!this.pendingPromises.has(placeId)) {
                let resolveFn;
                let rejectFn;
                const promise = new Promise((resolve, reject) => {
                    resolveFn = resolve;
                    rejectFn = reject;

                    // Set a timeout to reject the promise if not resolved in 3 seconds
                    setTimeout(() => {
                        if (this.pendingPromises.has(placeId)) {
                            this.pendingPromises.delete(placeId);
                            rejectFn(new Error(`Timeout: Place ${placeId} not found within 3 seconds`));
                        }
                    }, 3000);
                });

                this.pendingPromises.set(placeId, { promise, resolve: resolveFn, reject: rejectFn });
            }

            return this.pendingPromises.get(placeId).promise;
        }

        addPlace(placeId, properties) {
            this.cache.set(placeId, properties);

            if (this.pendingPromises.has(placeId)) {
                this.pendingPromises.get(placeId).resolve(properties);
                this.pendingPromises.delete(placeId);
            }
        }
    }
    class GLE {
        #DISABLE_CLOSED_PLACES = false; // Set to TRUE if the feature needs to be temporarily disabled, e.g. during the COVID-19 pandemic.
        #EXT_PROV_ELEM_QUERY = 'wz-list-item.external-provider';
        #EXT_PROV_ELEM_EDIT_QUERY = 'wz-list-item.external-provider-edit';
        #EXT_PROV_ELEM_CONTENT_QUERY = 'div.external-provider-content';

        linkCache;
        #enabled = false;
        #mapLayer = null;
        #distanceLimit = 400; // Default distance (meters) when Waze place is flagged for being too far from Google place.
        // Area place is calculated as #distanceLimit + <distance between centroid and furthest node>
        #showTempClosedPOIs = true;
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
            this.linkCache = new GooglePlaceCache();
            this.#initLayer();

            // NOTE: Arrow functions are necessary for calling methods on object instances.
            // This could be made more efficient by only processing the relevant places.
            W.model.events.register('mergeend', null, () => { this.#processPlaces(); });
            W.model.venues.on('objectschanged', () => { this.#processPlaces(); });
            W.model.venues.on('objectsremoved', () => { this.#processPlaces(); });
            W.model.venues.on('objectsadded', () => { this.#processPlaces(); });

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

            W.selectionManager.events.register('selectionchanged', null, this.#onWmeSelectionChanged.bind(this));
        }

        #initLayer() {
            this.#mapLayer = new OpenLayers.Layer.Vector('Google Link Enhancements.', {
                uniqueName: '___GoogleLinkEnhancements',
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

        #onWmeSelectionChanged() {
            if (this.#enabled) {
                this.#destroyPoint();
                const selected = W.selectionManager.getSelectedDataModelObjects();
                if (selected[0]?.type === 'venue') {
                    // The setTimeout is necessary (in beta WME currently, at least) to allow the
                    // panel UI DOM to update after a place is selected.
                    setTimeout(() => this.#formatLinkElements(), 0);
                }
            }
        }

        enable() {
            if (!this.#enabled) {
                this.#interceptPlacesService();
                // Note: Using on() allows passing "this" as a variable, so it can be used in the handler function.
                $('#map').on('mouseenter', null, this, GLE.#onMapMouseenter);
                W.model.venues.on('objectschanged', this.#formatLinkElements, this);
                this.#processPlaces();
                this.#enabled = true;
            }
        }

        disable() {
            if (this.#enabled) {
                $('#map').off('mouseenter', GLE.#onMapMouseenter);
                W.model.venues.off('objectschanged', this.#formatLinkElements, this);
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
        }

        get showTempClosedPOIs() {
            return this.#showTempClosedPOIs;
        }

        set showTempClosedPOIs(value) {
            this.#showTempClosedPOIs = value;
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
                    distanceLim += GLE.#distanceBetweenPoints(venuePt, topRightPt);
                }
                const distance = GLE.#distanceBetweenPoints(linkPt, venuePt);
                return distance > distanceLim;
            }
            return false;
        }

        #processPlaces() {
            if (this.#enabled) {
                try {
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
                } catch (ex) {
                    console.error('PIE (Google Link Enhancer) error:', ex);
                }
            }
        }

        static #onMapMouseenter(event) {
            // If the point isn't destroyed yet, destroy it when mousing over the map.
            event.data.#destroyPoint();
        }

        async #formatLinkElements() {
            const $links = $('#edit-panel').find(this.#EXT_PROV_ELEM_QUERY);
            if ($links.length) {
                const existingLinks = GLE.#getExistingLinks();

                // fetch all links first
                const promises = [];
                const extProvElements = [];
                $links.each((ix, linkEl) => {
                    const $linkEl = $(linkEl);
                    extProvElements.push($linkEl);

                    const id = GLE.#getIdFromElement($linkEl);
                    promises.push(this.linkCache.getPlace(id));
                });
                const links = await Promise.all(promises);

                extProvElements.forEach(($extProvElem, i) => {
                    const id = GLE.#getIdFromElement($extProvElem);

                    if (!id) return;

                    const link = links[i];
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
                    if (!thisPlaceIDs.includes(id)) {
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
        async #addPoint(id) {
            if (!id) return;
            const link = await this.linkCache.getPlace(id);
            if (link) {
                if (!link.notFound) {
                    const coord = link.loc;
                    const poiPt = new OpenLayers.Geometry.Point(coord.lng, coord.lat);
                    poiPt.transform(W.Config.map.projection.remote, W.map.getProjectionObject().projCode);
                    const placeGeom = W.selectionManager.getSelectedDataModelObjects()[0].geometry.getCentroid();
                    const placePt = new OpenLayers.Geometry.Point(placeGeom.x, placeGeom.y);
                    const ext = GLE.#getOLMapExtent();
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
                        let distance = GLE.#distanceBetweenPoints(poiPt, placePt);
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
                // this.#getLinkInfoAsync(id).then(res => {
                //     if (res.error || res.apiDisabled) {
                //         // API was temporarily disabled.  Ignore for now.
                //     } else {
                //         this.#addPoint(id);
                //     }
                // });
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
            $el.hover(() => this.#addPoint(GLE.#getIdFromElement($el)), () => this.#destroyPoint());
        }

        #interceptPlacesService() {
            if (typeof google === 'undefined' || !google.maps || !google.maps.places || !google.maps.places.PlacesService) {
                console.debug('Google Maps PlacesService not loaded yet.');
                setTimeout(this.#interceptPlacesService.bind(this), 500); // Retry until it loads
                return;
            }

            const originalGetDetails = google.maps.places.PlacesService.prototype.getDetails;
            const that = this;
            google.maps.places.PlacesService.prototype.getDetails = function interceptedGetDetails(request, callback) {
                console.debug('Intercepted getDetails call:', request);

                const customCallback = function(result, status) {
                    console.debug('Intercepted getDetails response:', result, status);
                    const link = {};
                    switch (status) {
                        case google.maps.places.PlacesServiceStatus.OK: {
                            const loc = result.geometry.location;
                            link.loc = { lng: loc.lng(), lat: loc.lat() };
                            if (result.business_status === google.maps.places.BusinessStatus.CLOSED_PERMANENTLY) {
                                link.permclosed = true;
                            } else if (result.business_status === google.maps.places.BusinessStatus.CLOSED_TEMPORARILY) {
                                link.tempclosed = true;
                            }
                            that.linkCache.addPlace(request.placeId, link);
                            break;
                        }
                        case google.maps.places.PlacesServiceStatus.NOT_FOUND:
                            link.notfound = true;
                            that.linkCache.addPlace(request.placeId, link);
                            break;
                        default:
                            link.error = status;
                    }
                    callback(result, status); // Pass the result to the original callback
                };

                return originalGetDetails.call(this, request, customCallback);
            };

            console.debug('Google Maps PlacesService.getDetails intercepted successfully.');
        }
    }

    return GLE;
}());
