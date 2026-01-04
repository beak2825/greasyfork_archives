// ==UserScript==
// @name                LV WME Helper
// @namespace           https://dev.laacz.lv/
// @description         WME Helper for Latvia Waze Map Editors
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/jsts/2.0.6/jsts.min.js
// @license             CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/
// @version             2.11
// @connect             waze.dev.laacz.lv
// @grant               GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387600/LV%20WME%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/387600/LV%20WME%20Helper.meta.js
// ==/UserScript==
// noinspection DuplicatedCode

/* global W */
/* global WazeWrap */
/* global axios */

(function () {

    /**
     * @typedef Address
     * @property code {number}
     * @property name {string}
     * @property waze_house_number {string}
     * @property waze_name {string}
     * @property iela_name {string}
     * @property ciems_name {string}
     * @property pilseta_name {string}
     * @property pagasts_name {string}
     * @property novads_name {string}
     * @property full_name {string}
     * @property parent_code {number}
     * @property geom {object}
     * @property lat {float}
     * @property lng {float}
     * @property Point {Point}
     */

    /**
     * Fetched and mutated address list.
     * @type {Address[]}
     */
    let addresses = [];

    // Reassigned by requure()
    let UpdateObject = null;
    let Landmark = null;
    let AddLandmark = null;
    let DeleteSegment = null;


    // Minimum venue area, which is drawn on the map, in m²
    const MIN_VISIBLE_AREA = 514;
    // Regluar expression for validating street name
    const REGEXP_STREET_NAMES = /(^.+(aleja|apvedceļš|bulvāris|ceļš|dambis|gatve|iela|krastmala|laukums|līnija|prospekts|šķērslīnija|šoseja) (\d+.+$))/;
    // Regular expression for validating house number
    /**
     * ['1', '12', '12a', '12 k-1', '12a k-12', '2/4'].every((x) => !!x.match(REGEXP_HOUSE_NUMBERS))
     * ['1//2', 'a1', ''].every((x) => !x.match(REGEXP_HOUSE_NUMBERS))
     */
    const REGEXP_HOUSE_NUMBERS = /^(\d+[a-zA-Z]*(\/\d+[a-zA-Z]*)?)( k-\d+)?$/;
    // Regular expression for validating waze house number
    const REGEXP_WAZE_HOUSE_NUMBER = /^\d+[A-Z]?(-\d+)?$/;
    // Game loop's interval
    let updateTimeout = undefined;
    // Indicates that REST request is in progress
    let wmelvLoadingIndicator = true;

    function wmelvLoading(value) {
        if (value !== undefined) {
            wmelvLoadingIndicator = value;
            qs('#wmelv-loading-indicator').style.visibility = value ? 'visible' : 'hidden';
        }
        return wmelvLoadingIndicator;
    }

    /**
     * https://greasyfork.org/en/scripts/38421-wme-utils-navigationpoint
     */
    class NavigationPoint {
        constructor(point) {
            this._point = point.clone();
            this._entry = true;
            this._exit = true;
            this._isPrimary = true;
            this._name = "";
        }

        with() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if (e.point == null)
                e.point = this.toJSON().point;
            return new this.constructor((this.toJSON().point, e.point));
        }

        getPoint() {
            return this._point.clone();
        }

        getEntry() {
            return this._entry;
        }

        getExit() {
            return this._exit;
        }

        getName() {
            return this._name;
        }

        isPrimary() {
            return this._isPrimary;
        }

        toJSON() {
            return {
                point: this._point,
                entry: this._entry,
                exit: this._exit,
                primary: this._isPrimary,
                name: this._name
            };
        }

        clone() {
            return this.with();
        }
    }

    /**
     * Settings object with getters, setters, and default values.
     */
    const settings = {
        configuration: {
            minHNZoomLevel: 16,
            hlIncorrectAddress: true,
            hlSmallArea: true,
            hlLowerCaseHN: true,
            hlNoHN: true,
            hlNameHNMismatch: true,
            addressFixer: false,
            hlDupes: true,
            hlIela: true,
            autoHN: false,
        }, get: function (key, def) {
            return typeof this.configuration[key] !== 'undefined' ? this.configuration[key] : def;
        }, set: function (key, value) {
            this.configuration[key] = value;
            this.save();
        }, save() {
            if (localStorage) {
                localStorage.setItem("_wmelv3_settings", JSON.stringify(this.configuration));
            }
        }, load() {
            let loadedSettings = JSON.parse(localStorage.getItem("_wmelv3_settings"));
            this.config = Object.assign(this.configuration, loadedSettings ? loadedSettings : {});
        }
    };

    /**
     * querySelectorAll shorthand
     * @param selector
     * @returns {*[]}
     */
    function qsa(selector) {
        return Array.from(document.querySelectorAll(selector), e => e);
    }

    /**
     * querySelector shorthand.
     * @param selector
     * @returns {*}
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * Shamelessly taken from WME PlaceNames Russian:
     * https://greasyfork.org/en/scripts/15310-wme-placenames-russian/code
     */
    function fixPlaceArea(place) {
        let requiredArea = 516,
            oldGeometry = place.geometry.clone(),
            newGeometry = place.geometry.clone(),
            centerPT = newGeometry.getCentroid(),
            oldArea = oldGeometry.getGeodesicArea(W.map.getProjectionObject()),
            scale = Math.sqrt(requiredArea / oldArea);

        newGeometry.resize(scale, centerPT);

        let wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry"),
            action = new wazeActionUpdateFeatureGeometry(place, W.model.venues, oldGeometry, newGeometry);

        place.attributes.fixArea = false;

        W.model.actionManager.add(action);
    }

    function fixCurrentlySelectedArea(e) {
        if (e) e.preventDefault();

        if (!W.selectionManager.hasSelectedFeatures()
            || W.selectionManager.getSelectedFeatures()[0].model.type !== "venue"
            || !W.selectionManager.getSelectedFeatures()[0].model.isGeometryEditable()) {
            return;
        }

        fixPlaceArea(W.selectionManager.getSelectedFeatures()[0].model);
        wmelvUpdate();
    }

    /**
     * Colorful logger ;)
     * @type {{warn(...[*]): void, debug(...[*]): void, crit(...[*]): void, log(*, ...[*]): void, info(...[*]): void}}
     */
    const Logger = {
        log(style, ...args) {
            console.log("%c●%c", style, 'color: #000; background-color: #fff;', ...args)
        }, debug(...args) {
            Logger.log('background-color: gray; color: #fff; font-weight: bold; padding: .2em .5em;', ...args)
        }, info(...args) {
            Logger.log('background-color: navy; color: #fff; font-weight: bold; padding: .2em .5em;', ...args)
        }, crit(...args) {
            Logger.log('background-color: maroon; color: #fff; font-weight: bold; padding: .2em .5em;', ...args)
        }, warn(...args) {
            Logger.log('background-color: orange; color: #fff; font-weight: bold; padding: .2em .5em;', ...args)
        },
    }

    /**
     * Returns the closest address to a given point on the map.
     * @param point {Point}
     * @return Address|null
     */
    function getClosestAddress(point) {
        const p = point.clone();
        p.transform('EPSG:900913', "EPSG:4326");
        return addresses.length ? addresses.reduce((prev, curr) => {
            if (!prev) return curr;
            return prev.Point.distanceTo(p) < curr.Point.distanceTo(p) ? prev : curr;
        }) : null;
    }

    /**
     * Helper to build a bbox string from the map's extent.
     * @returns {string}
     */
    function wmelvBBOX() {
        const bounds = W.map.getExtent();
        bounds.transform("EPSG:900913", "EPSG:4326");
        return bounds.toBBOX();
    }

    /**
     * Adds attributes to address which cannot be added in the backend.
     * @param addresses
     * @returns {*}
     */
    function wmelvMutateAddresses(addresses) {
        if (addresses && addresses.length) {
            addresses = addresses.map((ads) => {
                ads.Point = new OpenLayers.Geometry.Point(ads.lng, ads.lat);
                return ads;
            })
        }
        return addresses;
    }

    /**
     * Creates a new place, given a geometry and attributes, selects it and registers in the actionmanager's history.
     * @param geometry
     * @param params
     * @returns {*}
     */
    function wmelvCreateNewPlace(geometry, params) {
        let place = new Landmark();
        if (!Object.values(params).length) params = {};
        if (!params.categories || !params.categories.length) params.categories = ["OTHER"];

        place.geometry = geometry;
        place.attributes.name = params.name ? params.name : '';
        place.attributes.lockRank = params.lockRank ? params.lockRank : 2;
        params.categories.forEach(cat => {
            place.attributes.categories.push(cat);
        });

        place.attributes.entryExitPoints.push(new NavigationPoint(place.geometry.getCentroid()));

        W.model.actionManager.add(new AddLandmark(place));
        W.model.actionManager.add(new UpdateObject(place, params));
        W.selectionManager.setSelectedModels([place]);

        return place;
    }

    /**
     * Game loop as they say.
     */
    function wmelvUpdate() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        if (!wmelvLoading()) {
            Object.keys(W.model.venues.objects).forEach((k) => {
                const venue = W.model.venues.objects[k];
                const el = qs('#' + venue.geometry.id);

                if (!el) {
                    return
                }
                if ('attributes' in venue) {
                    let v = venue.attributes;
                    let hn = v.houseNumber;
                    let street = {name: ''};
                    let city = {name: ''};
                    let full_address = '';

                    if (v.streetID) {
                        street = W.model.streets.objects[v.streetID];
                    }
                    if (street) {
                        city = W.model.cities.objects[street.cityID].attributes
                    }

                    if (street.name.length) {
                        full_address = `${hn}, ${street.name}, ${city.name}`;
                    } else {
                        full_address = `${v.name}, ${city.name}`
                    }

                    full_address = full_address.replace(/[, ]+$/g, '');

                    const area = W.model.venues.objects[k].geometry.toString().indexOf('POLYGON') === 0
                        ? W.model.venues.objects[k].geometry.getGeodesicArea(W.map.getProjectionObject())
                        : false;

                    W.model.venues.objects[k].attributes.fixLowerCase =
                        (v.houseNumber && v.houseNumber.toUpperCase() !== v.houseNumber) ||
                        (v.houseNumber && v.name && v.name.toUpperCase() === v.houseNumber.toUpperCase() && v.name !== v.houseNumber.toUpperCase()) ||
                        (v.name && v.name.replace(/ k-\d+$/, '').match(/^\d+[a-z]+/) && v.name.replace(/ k-\d+$/, '').toUpperCase() !== v.name.replace(/ k-\d+$/, ''));

                    W.model.venues.objects[k].attributes.fixNameHNMismatch =
                        !v.residential &&
                        (
                            (v.houseNumber && !v.name) ||
                            (
                                v.houseNumber &&
                                v.name &&
                                v.name.match(REGEXP_HOUSE_NUMBERS) &&
                                v.houseNumber.toLowerCase() !== v.name.toLowerCase().replace(' k-', '-'))
                        );

                    W.model.venues.objects[k].attributes.fixNoHN =
                        !v.houseNumber &&
                        v.streetID && W.model.streets.objects[v.streetID] &&
                        W.model.streets.objects[v.streetID].name &&
                        W.model.streets.objects[v.streetID].cityID &&
                        W.model.cities.objects[W.model.streets.objects[v.streetID].cityID] &&
                        W.model.cities.objects[W.model.streets.objects[v.streetID].cityID].attributes.name &&
                        v.categories.indexOf('PARKING_LOT') === -1 &&
                        v.categories.indexOf('TAXI_STATION') === -1 &&
                        v.categories.indexOf('PARK') === -1;

                    W.model.venues.objects[k].attributes.fixIela = v.name.toLowerCase().match(REGEXP_STREET_NAMES);
                    W.model.venues.objects[k].attributes.fixArea = !v.residential && area !== false && area < MIN_VISIBLE_AREA ? area : false;

                    const closest = getClosestAddress(venue.geometry.getCentroid());
                    let ads_nok = false;
                    if (closest && venue.geometry.id.indexOf('Point') !== -1) {
                        // When geometry is a point, closest address is the right one
                        ads_nok = closest.waze_name !== full_address;
                    } else if (venue.geometry.id.indexOf('Point') === -1) {
                        // When geometry is a polygon, it must contain at least one point
                        // with the right address. If no points are within a polygon
                        // (offset issues), the closest address is the right one.
                        const geom = venue.geometry.clone();
                        geom.transform('EPSG:900913', 'EPSG:4326');
                        const points = addresses.filter((a) => geom.containsPoint(a.Point));
                        ads_nok = points.length && points.every((a) => a.waze_name !== full_address);
                        ads_nok |= points.length === 0 && closest.waze_name !== full_address;
                    }
                    W.model.venues.objects[k].attributes.fixAddress =
                        ads_nok &&
                        !W.model.venues.objects[k].attributes.categories.some((c) => ['BEACH', 'BRIDGE', 'CAMPING_TRAILER_PARK', 'CANAL', 'CEMETERY', 'DAM', 'DESSERT', 'FARM', 'FERRY_PIER', 'FOREST_GROVE', 'GOLF_COURSE', 'ISLAND', 'JUNCTION_INTERCHANGE', 'NATURAL_FEATURES', 'OUTDOORS', 'PARK', 'PARKING_LOT', 'PLAYGROUND', 'POOL', 'PROMENADE', 'RACING_TRACK', 'REST_AREAS', 'RIVER_STREAM', 'SCENIC_LOOKOUT_VIEWPOINT', 'SEA_LAKE_POOL', 'SEAPORT_MARINA_HARBOR', 'SKI_AREA', 'SWAMP_MARSH', 'TAXI_STATION', 'THEME_PARK', 'TOURIST_ATTRACTION_HISTORIC_SITE', 'TUNNEL', 'ZOO_AQUARIUM'].indexOf(c) > -1)
                    ;
                    W.model.venues.objects[k].attributes.ads = closest;
                }
            });

            wmelvDraw();
        }
        updateTimeout = setTimeout(wmelvUpdate, 345);
    }

    /**
     * Sets venue's address, changing only parts, which are ough to be changed.
     * @param venue
     * @param address
     */
    function wmelvSetVenueAddress(venue, address) {
        let attrs = venue.model.attributes;
        const changes = {};

        const street_name = address.iela_name ? address.iela_name : '';
        const city_name = address.pilseta_name ? address.pilseta_name : (address.ciems_name ? address.ciems_name : '');
        let house_name = address.name.replace(' k-', '-');
        if (!city_name) {
            house_name += ', ' + (address.pagasts_name ? address.pagasts_name : address.novads_name);
        }

        // Find the street from waze model (there is always a street, even when there is none)
        const street = Object.values(W.model.streets.objects).find((street) => {
            if (street.name === street_name &&
                W.model.cities.objects[street.cityID].attributes.name === city_name) {
                return true;
            }
        });

        if (!street) {
            Logger.warn('Could not find a street "' + street_name + '" in ' + city_name);
            return;
        }

        if (attrs.streetID !== street.id) {
            changes.streetID = street.id;
        }

        if (address.name.match(REGEXP_HOUSE_NUMBERS)) {
            if (attrs.houseNumber !== house_name) {
                // It's a house number
                changes.houseNumber = house_name;
            }
            if (!attrs.name || (attrs.name.match(REGEXP_HOUSE_NUMBERS) && attrs.name !== house_name)) {
                // If name is a house number, and it is different, replace
                changes.name = address.name;
            } else if (attrs.name !== house_name) {
                // If name is in an alias, and it differs, fix that
                let modified = false;
                for (const alias_idx in attrs.aliases) {
                    if (attrs.aliases[alias_idx].match(REGEXP_HOUSE_NUMBERS)) {
                        if (house_name === attrs.aliases[alias_idx]) {
                            modified = true;
                            break;
                        }
                        changes.aliases = attrs.aliases;
                        changes.aliases[alias_idx] = address.name;
                        modified = true;
                        break;
                    }
                }
                if (!modified) {
                    // Obviously we have not changed name or updated an alias. So, add as a new alias.
                    changes.aliases = attrs.aliases;
                    changes.aliases.push(address.name);
                }
            }
        } else if (attrs.name !== house_name) {
            // It's a house name outside city
            changes.name = house_name;
        }

        postChanges(changes, venue.model)
    }

    /**
     * Updates visualizations.
     */
    function wmelvDraw() {
        Object.values(W.model.venues.objects).forEach((v) => {
            let el = qs('#' + v.geometry.id), hled = false;
            if (el) {
                if (!el.getAttribute('ogAttributes')) {
                    el.setAttribute('ogAttributes', {
                        'stroke': el.getAttribute('stroke'),
                        "stroke-width": el.getAttribute("stroke-width"),
                        "stroke-dash-array": el.getAttribute("stroke-dash-array"),
                    });
                }
                if (!hled && settings.get('hlIncorrectAddress') && v.attributes.fixAddress) {
                    el.setAttribute('stroke', '#ff00ff');
                    el.setAttribute("stroke-width", "4");
                    el.setAttribute("stroke-dash-array", "none");
                    hled = true;
                }
                if (!hled && (
                    (settings.get('hlLowerCaseHN') && v.attributes.fixLowerCase) ||
                    (settings.get('hlNoHN') && v.attributes.fixNoHN) ||
                    (settings.get('hlIela') && v.attributes.fixIela)
                )) {
                    el.setAttribute('stroke', '#ff0000');
                    el.setAttribute("stroke-width", "4");
                    el.setAttribute("stroke-dash-array", "none");
                    hled = true;
                }
                if (!hled && settings.get('hlSmallArea') && el && v.attributes.fixArea) {
                    el.setAttribute('stroke', '#0000ff');
                    el.setAttribute("stroke-width", "4");
                    el.setAttribute("stroke-dash-array", "none");
                    hled = true;
                }
                if (!hled && settings.get('hlNameHNMismatch') && el && v.attributes.fixNameHNMismatch) {
                    el.setAttribute('stroke', '#ffff00');
                    el.setAttribute("stroke-width", "4");
                    el.setAttribute("stroke-dash-array", "none");
                    hled = true;
                }
                if (!hled && settings.get('hlDupes') && el && v.attributes.fixDupes) {
                    el.setAttribute('stroke', '#00ffff');
                    el.setAttribute("stroke-width", "4");
                    el.setAttribute("stroke-dash-array", "none");
                    hled = true;
                }
            }
        });
    }

    /**
     * Fetches VZD addresses from an API. Restricts to viewport plus a tiny buffer.
     */
    function wmelvLoadAddresses() {
        if (!settings.get('autoHN') || W.map.getZoom() < 16) {
            if (W.map.getLayersByName("pointLayer").length) {
                W.map.removeLayer(W.map.getLayersByName("pointLayer")[0]);
            }
            return;
        }

        const request = {
            bounds: wmelvBBOX(),
            // objects: {},
        }

        // // Build a hasmap of polygons to post along the bounds.
        // const writer = new OpenLayers.Format.GeoJSON();
        // for (const g of Object.values(W.model.venues.objects)) {
        //     if (g.geometry.id.indexOf('Point') !== -1){
        //         continue;
        //     }
        //     request.objects[g.attributes.id] = writer.write(g.geometry);
        // }
        //
        wmelvLoading(true);
        GM.xmlHttpRequest({
            method: 'POST', url: '//waze.dev.laacz.lv/api/2/addresses', data: JSON.stringify(request), headers: {
                'Content-Type': 'application/json'
            }, onload: function (response) {
                addresses = JSON.parse(response.responseText);
                addresses = wmelvMutateAddresses(addresses)
                if (W.map.getLayersByName("pointLayer").length) {
                    W.map.removeLayer(W.map.getLayersByName("pointLayer")[0]);
                }
                const pointLayer = new OpenLayers.Layer.Vector("pointLayer");
                const proj = new OpenLayers.Projection("EPSG:4326");
                const features = [];

                for (const addr of addresses) {
                    const point = new OpenLayers.Geometry.Point(addr.lng, addr.lat).transform(proj, W.map.getProjectionObject());
                    const ft = new OpenLayers.Feature.Vector(point, null, null);
                    ft.style = {
                        label: addr.name,
                        pointRadius: 15,
                        fillColor: addr.color,
                        fillOpacity: 0.8,
                        strokeColor: "#cc6633",
                        strokeWidth: 2,
                        strokeOpacity: 0.8,
                        fontColor: "black",
                        labelOutlineColor: "white",
                        labelOutlineWidth: 3,
                    };
                    features.push(ft);
                }
                pointLayer.addFeatures(features);
                W.map.addLayer(pointLayer);
                wmelvLoading(false);
                wmelvUpdate();
            },
            onerror: (e) => {
                Logger.crit("Failed to load addresses", e);
                wmelvLoading(false);
            },
            onabort: () => {
                Logger.crit("Aborted address loading");
                wmelvLoading(false);
            },
            ontimeout: () => {
                Logger.crit("Loading timed out");
                wmelvLoading(false);
            },
        });
    }

    /**
     * Posts changes to buffer, reloads feature, if it is selected.
     * @param changes
     * @param venue
     */
    function postChanges(changes, venue) {
        if (Object.values(changes).length > 0) {
            W.model.actionManager.add(new UpdateObject(venue, changes));
            wmelvUpdate();
            if (W.selectionManager.getSelectedFeatures().length) {
                W.selectionManager.unselectAll();
                W.selectionManager.setSelectedModels([W.model.venues.objects[venue.attributes.id]]);
            }
        }
    }

    /**
     * Triggered when selection changes (user selects or deselects a WME feature)
     * @param e {Event}
     */
    function wmelvDrawVenueDetails(e) {
        if (W.selectionManager.hasSelectedFeatures() &&
            W.selectionManager.getSelectedFeatures().length === 1 &&
            W.selectionManager.getSelectedFeatures()[0].model.type === "venue") {

            const venue = W.selectionManager.getSelectedFeatures()[0].model.attributes;
            const venueModel = W.selectionManager.getSelectedFeatures()[0].model;

            let warnings = []
            let html = `<div class="action-buttons"><div class="alert addresses"></div>`;

            if (venue.fixAddress) warnings.push('Ēkas adrese, iespējams, nav korekta (tuvākā ir ' + venue.ads.waze_name + '; <a href="#" id="fixCurrentlySelectedVenueAddress">salabot</a>)');
            if (venue.fixLowerCase) warnings.push('Ēkas numurs satur mazo burtu (<a href="" id="fixThisLowerCase">salabot</a>)');
            if (venue.fixNameHNMismatch) warnings.push('Ēkas numurs nesakrīt ar numuru nosaukumā<br/>' + '(<a href="#" id="fixNameHNMismatchToAddress">pareiza adrese</a>, <a href="" id="fixNameHNMismatchToName">pareizs nosaukums</a>)');
            if (venue.fixIela) warnings.push('Vietas nosaukums satur "' + venue.name.match(REGEXP_STREET_NAMES)[0] + '" (<a href="#" id="fixIelaInName">salabot</a>)');
            if (venue.fixNoHN) warnings.push('Adrese ir, bet ēkas numura nav');
            if (venue.fixArea) warnings.push('Laukuma platība ' + Math.floor(venue.fixArea) + 'm² ir mazāka par ' + MIN_VISIBLE_AREA + 'm² (<a href="#" id="fixThisArea">salabot</a>)');

            html += warnings.map(warning => `<div class="alert alert-danger">${warning}</div>`).join('');

            html += '</div>';

            /**
             * Update landmark edit tab.
             */
            if (!qs('#wmelv-landmark-edit')) {
                let div = document.createElement('div');
                div.id = 'wmelv-landmark-edit';
                qs('#venue-edit-general').insertBefore(div, qs('#venue-edit-general').firstChild);
            }
            qs('#wmelv-landmark-edit').innerHTML = html;

            let changes = {}

            if (qs('#fixCurrentlySelectedVenueAddress')) {
                qs('#fixCurrentlySelectedVenueAddress').addEventListener('click', (e) => {
                    e.preventDefault();
                    let venue = W.selectionManager.getSelectedFeatures()[0];
                    const closest = getClosestAddress(venue.geometry.getCentroid());
                    wmelvSetVenueAddress(venue, closest);
                })
            }

            if (qs('#fixNameHNMismatchToAddress')) {
                qs('#fixNameHNMismatchToAddress').addEventListener('click', (e) => {
                    e.preventDefault();
                    changes.name = venue.houseNumber.replace('-', ' k-');
                    postChanges(changes, venueModel)
                })
            }

            if (qs('#fixNameHNMismatchToName')) {
                qs('#fixNameHNMismatchToName').addEventListener('click', (e) => {
                    e.preventDefault();
                    changes.houseNumber = venue.name.replace(' k-', '-');
                    postChanges(changes, venueModel)
                })
            }

            if (qs('#fixThisArea')) {
                qs('#fixThisArea').addEventListener('click', fixCurrentlySelectedArea);
            }

            if (qs('#fixIelaInName')) {
                qs('#fixIelaInName').addEventListener('click', (e) => {
                    e.preventDefault();
                    changes.name = venue.name.replace(REGEXP_STREET_NAMES, '$3');
                    postChanges(changes, venueModel)
                });
            }

            if (qs('#fixThisLowerCase')) {
                qs('#fixThisLowerCase').addEventListener('click', (e) => {
                    e.preventDefault();
                    changes.houseNumber = venue.houseNumber.toUpperCase();

                    if (venue.name && venue.name.match(/^\d+[a-z][^a-z]*/)) {
                        changes.name = venue.name.toUpperCase().replace(' K-', ' k-');
                    }
                    postChanges(changes, venueModel);
                });
            }
        }
    }

    /**
     * Creates WME tab and registers all corresponding event listeners on inputs.
     */
    function wmelvRegisterTab() {
        let style = document.getElementById('wmelv-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'wmelv-style';
            document.head.appendChild(style);
        }
        style.innerText = `
        #wmelv-loading-indicator {
            text-align: center;
            display: inline-block;
        }

        #wmelv-loading-indicator path,
        #wmelv-loading-indicator rect {
            fill: #FF6700;
        }

        #sidepanel-wmelv hr {
            height: 1px;
            width: 100%;
            border-top: 1px solid #ccc;
        }

        #sidepanel-wmelv label {
            white-space: normal;
        }
        .waze-btn:disabled {
            cursor: no-drop;
        }

        #applyAllAddresses {
            text-align: center;
        }

        .count {
            background-color: #009900;
            color: #fff;
            font-size: 90%;
            border-radius: 25%;
            padding-left: .5rem;
            margin-left: 1rem;
            padding-right: .5rem;
        }


        #wmelv-landmark-edit .alert {
            margin-bottom: .25rem;
            text-transform: none;
            font-size: 12px;
        }

        #wmelv-landmark-edit .alert-danger {
            border: 1px solid #ed503b;
        }

        .alert .waze-btn.waze-btn-blue {
            box-shadow: none;
        }

        #zoom-level-warning {
            color: red;
            font-weight: bold;
        }

        .wme-lv-details {
            font-weight: bold;
            color: green;
        }

        #wmelv-convert-to-area {
            margin-top: .25rem;
        }

        #wmelv-venues-list ul {
            margin: 1rem;
            padding: 0;
        }

        #wmelv-venues-list ul li {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
        #wmelv-venues-list [data-type]:before {
            content: "";
            display: inline-block;
            position: relative;
            top: 1px;
            background-image: url(//editor-assets.waze.com/production/img/buttons756c103910d73f4d45328e08f6016871.png);
            width: 11px;
            height: 11px;
            margin-right: 5px;
        }
        #wmelv-venues-list [data-type="point"]:before {
            background-position: -49px -58px;
        }

        #wmelv-venues-list [data-type="area"]:before {
            background-position: -25px -58px;
        }

        #wmelv-venues-list li a {
            text-decoration: none;
        }

        .wmelv-lock-rank {
            box-shadow: 0 4px 4px 0 #def7ff;
            color: #fff;
            background: #32a852;
            height: 23px;
            line-height: 23px;
            margin-right: 1px;
            text-align: center;
            font-weight: normal;
            font-size: 13px;
            padding-left: 8px;
            padding-right: 8px;
            border-radius: 13px;
        }

        [data-lock-rank="0"] .wmelv-lock-rank,
        [data-lock-rank="1"] .wmelv-lock-rank {
            background: #ff7f00;
        }

        `;
        settings.load();

        const html = `
        <div class="form-group">
            <span id="zoom-level-warning" style="display: none;">Zoom par mazu. Funkcionalitāte atslēgta.</span>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlSmallArea"
                   id="hlSmallArea"
                   ${settings.get('hlSmallArea') ? 'checked' : ''}
                   ><label for="hlSmallArea"> Vietas, kuras mazākas par ${MIN_VISIBLE_AREA}m² (zils)</label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlIncorrectAddress"
                   id="hlIncorrectAddress"
                   ${settings.get('hlIncorrectAddress') ? 'checked' : ''}
                   ><label for="hlIncorrectAddress"> Vietas, kurām adrešu reģistra adrese atšķiras no Waze (lillā)</label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlNoHN"
                   id="hlNoHN"
                   ${settings.get('hlNoHN') ? 'checked' : ''}
                   ><label for="hlNoHN"> Adresē ir iela, pilsēta, bet nav ēkas numura (sarkans)</label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlIela"
                   id="hlIela"
                   ${settings.get('hlIela') ? 'checked' : ''}
                   ><label for="hlIela"> Vietas nosaukumā ir vārds "iela" (sarkans)</label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlLowerCaseHN"
                   id="hlLowerCaseHN"
                   ${settings.get('hlLowerCaseHN') ? 'checked' : ''}
                   ><label for="hlLowerCaseHN"> Ēkas numurā ir mazie burti (sarkans)</label>
            </div>
        </div>
        <div class="form-group">
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlNameHNMismatch"
                   id="hlNameHNMismatch"
                   ${settings.get('hlNameHNMismatch') ? 'checked' : ''}
                   ><label for="hlNameHNMismatch"> Ēkas numurs adresē un numurs nosaukumā nesakrīt (dzeltens)</label>
            </div>
        </div>
        <div class="form-group" data-hide>
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="hlDupes"
                   id="hlDupes"
                   ${settings.get('hlDupes') ? 'checked' : ''}
                   ><label for="hlDupes"> Identiski objekti, viens uz otra (gaiši zils)</label>
            </div>
        </div>
        <div class="form-group" data-api-required>
            <div class="controls-container">
            <input type="checkbox"
                   class="settings-input"
                   name="autoHN"
                   id="autoHN"
                   ${settings.get('autoHN') ? 'checked' : ''}
                   ><label for="autoHN"> Ielādēt adreses automātiski</label>
            </div>
        </div>
        <div id="wmelv-place-info" data-api-required>
        <hr>
            <p id="wmlelv-place-info">Izveidot paralelograma formas vietu kartes centrā:</p>
            <div class="action-buttons">
                <button class="waze-btn waze-btn-smaller" type="submit" id="wmelvCreatePlace" data-action="create-place"    data-ratio="1:1">Izveidot 1:1</button>
                <button class="waze-btn waze-btn-smaller" type="submit" id="wmelvCreatePlace2" data-action="create-place" data-ratio="2:1">Izveidot 2:1</button>
            </div>
        </div>

        <hr>

        <p>
            Tu esi ${W.loginManager.user.userName} (level ${W.loginManager.user.rank + 1}), es esmu skripts.
        </p>

        <hr>

        <div class="form-group" data-api-required>
            <label class="control-label">Funkcionalitāte sāk darboties, ja zoom ir vismaz:</label>
            <div class="controls">
                <div class="form-control waze-radio-container" style="display: block;">
                    <input type="radio" name="minHNZoomLevel" value="3" id="minHNZoomLevel-3"  ${parseInt(settings.get('minHNZoomLevel')) === 3 ? 'checked' : ''}>
                    <label for="minHNZoomLevel-3">3 (drosmīgajiem)</label>
                    <input type="radio" name="minHNZoomLevel" value="4" id="minHNZoomLevel-4"  ${parseInt(settings.get('minHNZoomLevel')) === 4 ? 'checked' : ''}>
                    <label for="minHNZoomLevel-4">4</label>
                    <input type="radio" name="minHNZoomLevel" value="5" id="minHNZoomLevel-5"  ${parseInt(settings.get('minHNZoomLevel')) === 5 ? 'checked' : ''}>
                    <label for="minHNZoomLevel-5">5</label>
                    <input type="radio" name="minHNZoomLevel" value="6" id="minHNZoomLevel-6"  ${parseInt(settings.get('minHNZoomLevel')) === 6 ? 'checked' : ''}>
                    <label for="minHNZoomLevel-6">6</label>
                </div>
            </div>
        </div>

        <hr>

        <dl>
            <dt>2.11</dt>
            <dd>Vajadzētu būt izķertiem gadījumiem, kad tuvākā adrese sarežģitākas formas laukumiem netiek rēķināta korekti.</dd>
            <dt>2.10</dt>
            <dd>Pēc viena klikšķa labojumu veikšanas, attiecīgās rekomendācijas pazūd.</dd>
            <dt>2.09</dt>
            <dd>Tagad protam arī ēku numurus formā '2/4'.</dd>
            <dd>Nedarbojās dažas no ātrajām labošanām.</dd>
            <dt>2.08</dt>
            <dd>Ja labojamās vietas nosaukumā adrese ir pareiza, bet ēkas numurā nav, tad nosaukums tika kļūdaini uzskatīts par nekorektu.</dd>
            <dt>2.07</dt>
            <dd>Veidojot vietas ārpus apdzīvotām vietām, adrese tagad tiek norādīta pareizi</dd>
            <dd>Adrešu validācija notiek tikai tām vietu kategorijām, kurām to ir jēga darīt</dd>
            <dt>2.06</dt>
            <dd>Minimālais laukuma izmērs samazināts uz uz 514m²</dd>
            <dd>Iespēja izveidot poligonu vietā, kur ieklikšķināts ar peli</dd>
            <dd>Adrešu labotājs apdzīvotās vietās darbojas.</dd>
            <dd>Ārpus apdzīvotajām vietām adreses tagad arī tiek ieteiktas korekti.</dd>
            <dt>2.05</dt>
            <dd>Minimālais <em>area</em> izmērs palielināts uz 550m²</dd>
            <dt>2.04</dt>
            <dd>Adreses maiņas rezultātā tā nomainās arī saskarnē.</dd>
            <dt>2.03</dt>
            <dd>Iespēja koriģēt kļūda (laukumu, adreses, utt) ar vienu pogas klikšķi.</dd>
            <dd>Paplašinājums vairs nesalauž Google StreetView.</dd>
            <dd>Vēl kārtīgi jātestē, jo daudz kas nestrādā.</dd>
            <dd>Ielādes indikācija blakus cilnes nosaukumam.</dd>
            <dt>2.02</dt>
            <dd>Salasāmāki māju numuri un nosaukumi.</dd>
            <dt>2.01</dt>
            <dd>Labota kļūda ar ķekškastīti pie VZD adrešu neatbilstību krāsošanas</dd>
            <dt>2.00</dt>
            <dd>Pirmā publiskā versija</dd>
        </dl>

        <hr>
        `;

        new WazeWrap.Interface.Tab('WME LV', html, () => {
            Array.from(document.querySelectorAll("#user-tabs > ul > li")).map((el) => {
                const a = el.querySelector('a')
                // Change tab title to title plus loading indicator
                if (a && a.innerText === 'WME LV') {
                    a.innerHTML = `
                    WME LV
                    <svg id="wmelv-loading-indicator" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/></path></svg>
                    `
                }
            })

            // Attach settings change handler to corresponding inputs

            qsa('.settings-input').forEach(element => {
                element.addEventListener('change', event => {
                    settings.set(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
                    wmelvUpdate();
                    wmelvLoadAddresses();
                })
            });

            qsa('[name="minHNZoomLevel"]').forEach(element => {
                element.addEventListener('change', event => {
                    settings.set('minHNZoomLevel', parseInt(event.target.value));
                });
            });

            qsa('[data-action="create-place"]').forEach(el => {
                el.addEventListener('click', (e) => {
                    const vertex = 22.57;
                    const point = W.map.getCenter();

                    let place = new Landmark()
                    let poly = new OpenLayers.Geometry.LinearRing([
                        new OpenLayers.Geometry.Point(point.lon - vertex, point.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                        new OpenLayers.Geometry.Point(point.lon - vertex, point.lat + (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                        new OpenLayers.Geometry.Point(point.lon + vertex, point.lat + (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                        new OpenLayers.Geometry.Point(point.lon + vertex, point.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                        new OpenLayers.Geometry.Point(point.lon - vertex, point.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                    ]);
                    poly.rotate(10, poly.getCentroid());

                    const closest = getClosestAddress(poly.getCentroid());
                    if (closest) {
                        const house_name = closest.name.replace(' k-', '-');
                        const street_name = closest.iela_name ? closest.iela_name : '';
                        const city_name = closest.pilseta_name ? closest.pilseta_name : (closest.ciems_name ? closest.ciems_name : '');
                        const street = Object.values(W.model.streets.objects).find((street) => {
                            if (street.name === street_name &&
                                W.model.cities.objects[street.cityID].attributes.name === city_name) {
                                return true;
                            }
                        });
                        const params = {}
                        params.streetID = street.id;
                        if (closest.name.match(REGEXP_HOUSE_NUMBERS)) {
                            params.houseNumber = house_name;
                            params.name = closest.name;
                        } else {
                            params.name = closest.waze_name;
                        }
                        const place = wmelvCreateNewPlace(new OpenLayers.Geometry.Polygon([poly]), params);

                        fixPlaceArea(place);
                    }
                });
            });
        });
        //
        // update();
    }

    /**
     * Registers global handlers which apply to W and W.map.
     */
    function wmelvRegisterGlobalHandlers() {
        W.map.events.register('zoomend', this, () => {
            // updateVenuesFilterList();
            // updateAddressSuggestions();
        });

        W.map.events.register('moveend', this, () => {
            wmelvLoadAddresses();
        });

        W.selectionManager.events.register('selectionchanged', this, wmelvDrawVenueDetails);
    }

    /**
     * Initializes application.
     */
    function init() {
        Logger.info('WMELV initializing...');
        UpdateObject = require("Waze/Action/UpdateObject");
        Landmark = require("Waze/Feature/Vector/Landmark");
        AddLandmark = require("Waze/Action/AddLandmark");
        DeleteSegment = require("Waze/Action/DeleteSegment");

        wmelvRegisterGlobalHandlers();
        wmelvRegisterTab();
        wmelvLoadAddresses();
        wmelvUpdate();
        Logger.info('WMELV initialized.');
    }

    /**
     * Starts waiting for W to load. Max 1000 times (100 seconds)
     * @param tries {number}
     */
    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            W.loginManager.user &&
            typeof W.selectionManager !== 'undefined' &&
            typeof WazeWrap !== "undefined" &&
            WazeWrap.Ready
        ) {
            init();
        } else if (tries < 1000) {
            setTimeout(() => {
                bootstrap(tries + 1);
            }, 200);
        }
    }

    Logger.info('WMELV waiting...');
    bootstrap();
}());
/* end ======================================================================= */
