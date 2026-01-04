// ==UserScript==
// @name                LV WME Admin helper v2
// @namespace           https://greasyfork.org/en/users/318631-kaspars-foigts
// @description         Miscelannia
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/jsts/2.0.6/jsts.min.js
// @version             2.06
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/387861/LV%20WME%20Admin%20helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/387861/LV%20WME%20Admin%20helper%20v2.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global axios */

(function () {

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

    const log = {
        cssOn: 'font-weight: bold; background-color: #669; color: #fff; padding-left: .5rem; padding-right: .5rem;',
        cssOff: 'font-weight: normal; background-color: #fff;',
        info(...args) {
            console.info('%cWME LV%c', this.cssOn, this.cssOff, ...args);
        },
        debug(...args) {
            console.debug('%cWME LV%c', this.cssOn, this.cssOff, ...args);
        }
    };

    const blabla = {
        citiesByAttributes: attributes => {
            return Object.values(W.model.cities.objects).filter(city => {
                let ok = true;
                Object.keys(attributes).forEach(property => {
                    ok = ok && city.attributes[property] === attributes[property];
                });
                return ok;
            });
        },

        streetsByAttributes: attributes => {
            return Object.values(W.model.streets.objects).filter(street => {
                let ok = true;
                Object.keys(attributes).forEach(property => {
                    ok = ok && street[property] === attributes[property];
                });
                return ok;
            });
        }

    };

    let UpdateObject = null,
        Landmark = null,
        AddLandmark = null,
        DeleteSegment = null;

    const reStreetNames = /(^.+(aleja|apvedceļš|bulvāris|ceļš|dambis|gatve|iela|krastmala|laukums|līnija|prospekts|šķērslīnija|šoseja) (\d+.+$))/;
    const reHN = /^(\d+[a-zA-Z]*)( k-\d+)?$/;

    let updateTimeout = false,
        loadVenuesTimeout = false,
        suggestAddressesTimeout = false,
        loadTopoTimeout = false,
        visibleStreets = [],
        suggestedAddresses = [],
        hnLayer = false,
        topoLayer = false,
        placeInfo = false,
        apiAvailable = false,
        experimentalFeaturesEnabled = false,
        geojsonWriter = new OpenLayers.Format.GeoJSON(),
        qsa = (selector) => {
            let self = this;
            self.elements = [].map.call(document.querySelectorAll(selector), e => e);

            this.forEach = (method) => self.elements.forEach(method)
            this.addEventListener = (evt, callback) => {
                this.elements.forEach(el => {
                    el.addEventListener(evt, callback);
                })
            };
            this.length = this.elements.length;

            return self;
        },
        qs = (selector) => document.querySelector(selector);


    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },
        initialize: function (options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            );
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            );
        }
    });


    let settings = {
        configuration: {
            apiKey: 'api key required',
            hlSmallArea: true,
            hlLowerCaseHN: true,
            hlNoHN: true,
            hlNameHNMismatch: true,
            addressFixer: false,
            hlDupes: true,
            hlIela: true,
            autoHN: false,
            autoHNSegmentSelection: true,
            minHNZoomLevel: 4,
            edgeDraggingEnabled: false,
            segmentToHouseWidth: 10,
            topoEnabled: false,
        },
        get: function (key, def) {
            return typeof this.configuration[key] !== 'undefined' ? this.configuration[key] : def;
        },
        set: function (key, value) {
            this.configuration[key] = value;
            this.save();
        },
        save() {
            if (localStorage) {
                localStorage.setItem("_blabla2_settings", JSON.stringify(this.configuration));
            }
            checkAPIAvailability();
        },
        load() {
            let loadedSettings = JSON.parse(localStorage.getItem("_blabla2_settings"));
            this.config = Object.assign(this.configuration, loadedSettings ? loadedSettings : {});
            checkAPIAvailability();
        }
    };

    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            W.loginManager.user &&
            typeof W.selectionManager !== 'undefined' &&
            typeof WazeWrap !== "undefined" &&
            WazeWrap.Ready) {
            init();
        } else if (tries < 1000) {
            setTimeout(() => {
                bootstrap(tries + 1);
            }, 200);
        }
    }

    function checkAPIAvailability() {
        axios.post('//waze.dev.laacz.lv/api/ping', {
            api_key: settings.get('apiKey'),
            user: W.loginManager.user.userName,
        }).then(({data}) => {
            apiAvailable = data.status;
            qsa('[data-api-required]').forEach(el => {
                el.style.display = apiAvailable ? 'block' : 'none';
            });
            qsa('[data-hide]').forEach(el => {
                el.style.display = experimentalFeaturesEnabled ? 'block' : 'none';
            });
            update();
        })
    }

    function createNewPlace(geometry, params) {
        let place = new Landmark();
        if (!params) params = {};
        if (!params.categories || !params.categories.length) params.categories = ["OTHER"];

        place.geometry = geometry;
        place.attributes.name = params.name ? params.name : '';
        place.attributes.lockRank = params.lockRank ? params.lockRank : 2;
        params.categories.forEach(cat => {
            place.attributes.categories.push(cat);
        });

        place.attributes.entryExitPoints.push(new NavigationPoint(place.geometry.getCentroid()));

        W.model.actionManager.add(new AddLandmark(place));
        W.selectionManager.setSelectedModels([place]);

        if (params.address && Object.keys(params.address).length) {
            W.model.actionManager.add(new UpdateObject(place, params.address));
        }

        return place;
    }

    function updateVenuesFilterList() {
        if (!experimentalFeaturesEnabled) return;
        let html = '<ul>',
            extent = W.map.getExtent();
        Object.values(W.model.venues.objects).map(venue => {
            if (venue.geometry.getBounds().intersectsBounds(extent)) {
                html += `
                <li><a href="" data-venue-id="${venue.attributes.id}"
                    data-geometry-id="${venue.geometry.id}"
                    data-type="${venue.isPoint() ? 'point' : 'area'}"
                    data-lock-rank="${venue.attributes.lockRank}"
                 >
                 <span class="wmelv-lock-rank">${venue.attributes.lockRank + 1}</span>
                 ${venue.attributes.name ? venue.attributes.name : 'Bez nosaukuma'}</a></li>
                `;
            }
        });
        html += '</ul>';

        qs('#wmelv-venues-list').innerHTML = html;
        qsa('#wmelv-venues-list ul li a').forEach(el => {
            let geom = qs('#' + el.dataset['geometryId']);
            el.addEventListener('click', (e) => {
                e.preventDefault();
                W.selectionManager.setSelectedModels([W.model.venues.objects[e.target.dataset.venueId]]);
            });
            el.addEventListener('mouseover', () => {
                geom.setAttribute('fill-opacity-previous', geom.getAttribute('fill-opacity'));
                geom.setAttribute('fill-opacity', .8);
            });
            el.addEventListener('mouseout', () => {
                geom.setAttribute('fill-opacity', geom.getAttribute('fill-opacity-previous'));
            });
        });
    }

    function wmelvRegisterGlobalHandlers() {
        /**
         * Registers selection changed handler
         */
        W.selectionManager.events.register('selectionchanged', this, () => {
            if (apiAvailable && settings.get('addressFixer')) {
                updateAddressSuggestions();
            }
        });

        W.map.events.register('zoomend', this, () => {
            loadTopo();
            updateVenuesFilterList();
            updateAddressSuggestions();
        });
        W.map.events.register('moveend', this, () => {
            loadTopo();
            updateVenuesFilterList();
            updateAddressSuggestions();
        });

        /**
         * Registers click handler to the main map
         */
        let mapClickControl = new OpenLayers.Control.Click({
            trigger: (e) => {
                updateAddressSuggestions(e);
            },
        });
        W.map.addControl(mapClickControl);
        mapClickControl.activate();
    }

    function updateAddressSuggestionUI() {
        // Single selection detected
        if (!apiAvailable) return;
        let venues = W.selectionManager.getSelectedFeatures();
        if (venues.length === 1 && qs('#blabla-landmark-edit .addresses')) {
            let el = qs('#blabla-landmark-edit .addresses'),
                div = document.createElement('div'),
                venue = venues[0].model,
                addresses = suggestedAddresses[venue.attributes.id]
            ;

            if (!addresses) return;
            el.classList.remove('alert-success');
            el.classList.remove('alert-danger');
            el.classList.add('alert-info');

            el.innerHTML = '';

            addresses.forEach(function (a) {
                div.classList.add('address-entry');

                div.innerHTML = `${a.full_name} (<a href="" data-venue-id="${venue.attributes.id}">pielietot šo adresi</a>)`;

                el.appendChild(div);
                div.querySelector('[data-venue-id]').addEventListener('click', function (e) {
                    e.preventDefault();
                    setVenueAddress(venue.attributes.id, suggestedAddresses[venue.attributes.id].length - 1)
                });

                if (a.name === venue.attributes.name) {
                    el.classList.remove('alert-danger');
                    el.classList.remove('alert-info');
                    el.classList.add('alert-success');
                }

            })

        } else if (venues.length > 1) {

            qsa('#mergeVenuesCollection .merge-item .content .details').forEach((el, idx) => {
                let div = el.querySelector('.wme-lv-details'),
                    v = venues[idx],
                    a = (v && suggestedAddresses[v.model.attributes.id]) ? suggestedAddresses[v.model.attributes.id][0] : false;
                if (!div) {
                    div = document.createElement('div');
                    div.classList.add('wme-lv-details');
                    div.classList.add('text');
                    el.appendChild(div);
                }
                if (a) {
                    div.innerHTML = a.full_name;
                } else {
                    div.innerHTML = 'Adresi neizdevās noteikt';
                }
            });
        }

        if (placeInfo) {

            let html = placeInfo ? `Tuvākā vieta: <strong>${placeInfo.full_name}<strong>` : 'Noklikšķini adreses tuvumā kartē un tadā.';
            qs('#wmlelv-place-info').innerHTML = html;
            
        }

        qs('#blablaCreatePlace').disabled = !placeInfo;
        qs('#blablaCreatePlace2').disabled = !placeInfo;

        if (qs('#mergeVenuesCollection') && !qs('#applyAllAddresses')) {
            let lockRank = false;
            venues.forEach(v => {
                lockRank = lockRank === false ? v.model.attributes.lockRank : (lockRank !== v.model.attributes.lockRank ? -1 : lockRank);
            });

            let lockButtonsHTML = `
                <input type="radio" name="wme-lv-lock-rank" value="MIXED" id="wme-lv-lock-rank-mixed" disabled  ${lockRank === -1 ? 'checked' : ''}>
                <label for="wme-lv-lock-rank-mixed">Dažādi</label>
            `;
            for (let rank = 0; rank <= W.loginManager.user.rank; rank++) {
                lockButtonsHTML += `
                <input type="radio" name="wme-lv-lock-rank" value="${rank}" id="wme-lv-lock-rank-${rank}" ${lockRank === rank ? 'checked' : ''}>
                <label for="wme-lv-lock-rank-${rank}">${rank + 1}</label>
                `;
            }
            let html = `
                <div class="action-buttons" data-api-required>
                    <button class="waze-btn waze-btn-blue waze-btn-big" type="submit" id="fixAllAddresses">Pielietot visas adreses</button>
                </div>
            
                <div class="form-group">
                    <label class="control-label">Uzstādīt vienu lock līmeni:</label>
                    <div class="controls">
                        <div class="form-control waze-radio-container" style="display: block;">
                        ${lockButtonsHTML}
                        </div>
                    </div>
                </div>
                `,
                div = document.createElement('div');


            div.id = 'applyAllAddresses';
            div.innerHTML = html;

            qs('#mergeVenuesCollection').insertBefore(div, qs('#mergeVenuesCollection').firstChild);

            qs('#fixAllAddresses').addEventListener('click', () => {
                W.selectionManager.getSelectedFeatures().forEach(feature => {
                    if (suggestedAddresses[feature.model.attributes.id]) {
                        setVenueAddress(feature.model.attributes.id, 0);
                    }
                });
            });

            qsa('[name="wme-lv-lock-rank"]').forEach(el => {
                el.addEventListener('click', (e) => {
                    let newRank = parseInt(e.target.value);
                    W.selectionManager.getSelectedFeatures().forEach(f => {
                        if (parseInt(f.model.attributes.lockRank) < newRank) {
                            W.model.actionManager.add(new UpdateObject(f.model, {
                                lockRank: newRank,
                            }));
                        }
                    })
                })
            });

        }

    }

    function updateAddressSuggestions(e) {

        let features = W.selectionManager.getSelectedFeatures().filter(feature => feature.model.type === 'venue'),
            request = {},
            lonlat = {};

        // Single POST
        if (features.length && e && e.target) return;

        if (features.length) {
            let venues = [];
            features.forEach(feature => {
                venues.push({
                    id: feature.model.attributes.id,
                    geometry: JSON.parse(geojsonWriter.write(feature.model.attributes.geometry.clone().transform('EPSG:900913', 'EPSG:4326'))),
                })
            });
            request.venues = venues;
        } else if (e && e.xy) {
            lonlat = W.map.getLonLatFromViewPortPx(e.xy).clone();
            request.venues = [{
                id: false,
                geometry: JSON.parse(geojsonWriter.write((new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)).transform('EPSG:900913', 'EPSG:4326')))
            }];
        }

        if (request.venues && request.venues.length) {
            request.api_key = settings.get('apiKey');
            request.user = W.loginManager.user.userName;
            request.bounds = JSON.parse(geojsonWriter.write(W.map.getExtent().toGeometry().transform('EPSG:900913', 'EPSG:4326')));

            if (suggestAddressesTimeout) clearTimeout(suggestAddressesTimeout);
            suggestAddressesTimeout = setTimeout(() => {
                axios.post('//waze.dev.laacz.lv/api/suggest-addresses', request)
                    .then(({data}) => {
                        suggestedAddresses = [];
                        data.venues.forEach(a => {
                            let tmp = [];
                            a.city_id = null;
                            a.street_id = null;
                            // Find city, if specified

                            if (!a.city_name) {
                                a.city_id = blabla.citiesByAttributes({isEmpty: true})[0].attributes.id;
                            } else {
                                let city_names = [];
                                if (a.district) {
                                    city_names.push(a.city_name + ', ' + a.district);
                                }
                                city_names.push(a.city_name);
                                city_names.forEach(city_name => {
                                    if (!a.city_id) {
                                        tmp = blabla.citiesByAttributes({'name': city_name});
                                        if (tmp.length) {
                                            a.city_id = tmp[0].attributes.id;
                                        }
                                    }
                                })
                            }

                            // Find street, if specified
                            if (a.street_name) {
                                tmp = blabla.streetsByAttributes({name: a.street_name, cityID: a.city_id});
                            } else if (a.city_name) {
                                tmp = blabla.streetsByAttributes({isEmpty: true, cityID: a.city_id});
                            } else if (!a.city_name) {
                                tmp = blabla.streetsByAttributes({cityID: a.city_id});
                            }

                            if (tmp.length) {
                                a.street_id = tmp[0].id;
                            }

                            if (!suggestedAddresses[a.venue_id]) {
                                suggestedAddresses[a.venue_id] = [];
                            }
                            suggestedAddresses[a.venue_id].push(a);
                            if (a.venue_id === 0) {
                                placeInfo = a;
                                placeInfo.lonlat = lonlat;
                            }
                        });

                        updateAddressSuggestionUI();

                    })
            }, 246);
        }
    }

    function init() {
        log.info('Init started');

        UpdateObject = require("Waze/Action/UpdateObject");
        Landmark = require("Waze/Feature/Vector/Landmark");
        AddLandmark = require("Waze/Action/AddLandmark");
        DeleteSegment = require("Waze/Action/DeleteSegment");
        
        experimentalFeaturesEnabled = W.loginManager.user.userName === 'laacz';

        let style = document.getElementById('wmelv-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'wmelv-style';
            document.head.appendChild(style);
        }

        // Creates HN layer, if does not already exist
        if (!hnLayer) {
            hnLayer = new OpenLayers.Layer.Vector("wmelv-hn-layer", {
                styleMap: new OpenLayers.StyleMap({
                    default: new OpenLayers.Style({
                        pointRadius: 10,
                        fillColor: '${color}',
                        fillOpacity: 0.8,
                        strokeColor: '${color}',
                        strokeWidth: 2,
                        strokeOpacity: 0.8,
                        labelOutlineColor: '#ffffff',
                        labelOutlineWidth: 2,
                        label: '${house_number}',
                        fontColor: '#000000',
                    })
                }),
            });

        }

        style.innerText = `
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
        
        
        #blabla-landmark-edit .alert {
            margin-bottom: .25rem;
            text-transform: none;
            font-size: 12px;
        }

        #blabla-landmark-edit .alert-danger {
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

        let html = ``;

        if (experimentalFeaturesEnabled) {

            html = `
            <div class="action-buttons">
                <button class="waze-btn waze-btn-smaller" type="submit" id="wmlelv-select-filtered-venues">Iezīmēt atlasīto</button>
            </div>
            <div id="wmelv-venues-list">
            </div>
            `;

            new WazeWrap.Interface.Tab('WME LVL 5+', html, () => {
                updateVenuesFilterList();

                qs('#wmlelv-select-filtered-venues').addEventListener('click', () => {
                    let selection = [];
                    qsa('#wmelv-venues-list [data-venue-id]').forEach(el => {
                        selection.push(W.model.venues.objects[el.dataset.venueId]);
                    });
                    W.selectionManager.setSelectedModels(selection);
                })
            })

        }


        html = `
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
                   ><label for="hlSmallArea"> Vietas, kuras mazākas par 509m² (zils)</label>        
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
                   name="addressFixer" 
                   id="addressFixer" 
                   ${settings.get('addressFixer') ? 'checked' : ''}
                   ><label for="addressFixer"> Adrešu ieteicējs</label>        
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
        
        <div class="action-buttons" data-api-required>
            <button class="waze-btn waze-btn-smaller" ${settings.get('autoHN') ? 'disabled' : ''} type="submit" id="blablaLoadHN">Ielādēt adreses</button>
            <button class="waze-btn waze-btn-smaller waze-btn-transparent" type="button" id="blablaClearPlaces">Notīrīt ielādēto</button>
        </div>
        
        
        <div class="form-group" data-api-required>
            <div class="controls-container">
            <input type="checkbox" 
                   class="settings-input"
                   name="autoHNSegmentSelection" 
                   id="autoHNSegmentSelection" 
                   ${settings.get('autoHNSegmentSelection') ? 'checked' : ''}
                   ><label for="autoHNSegmentSelection"> Iezīmējot segmentu, rādīt tikai tās ielas HN</label>        
            </div>
        </div>
        
        <div data-hide>
            <hr>
            <div class="form-group">
                <div class="controls-container">
                <input type="checkbox" 
                       class="settings-input"
                       name="topoEnabled" 
                       id="topoEnabled" 
                       ${settings.get('topoEnabled') ? 'checked' : ''}
                       ><label for="topoEnabled"> Topogrāfiskās kartes elementu auto ielāde</label>        
                </div>
            </div>
        </div>
        
        <div id="wmelv-place-info" data-api-required>
        <hr>
            <p id="wmlelv-place-info">Noklikšķini viensētas tuvumā kartē un tadā.</p>
            <div class="action-buttons">
                <button class="waze-btn waze-btn-smaller" type="submit" id="blablaCreatePlace" data-action="create-place" data-ratio="1:1">Izveidot 1:1</button>
                <button class="waze-btn waze-btn-smaller" type="submit" id="blablaCreatePlace2" data-action="create-place" data-ratio="2:1">Izveidot 2:1</button>
            </div>
        </div>
        
        <hr>
        
        <p>
            Tu esi ${W.loginManager.user.userName} (${W.loginManager.user.normalizedLevel}), es esmu skripts.
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

        <div class="form-group">
            <label class="control-label" for="segmentToHouseWidth">Ēkas platums, veidojot to no segmenta</label>
                <div class="controls">
                <input class="form-control settings-input" name="segmentToHouseWidth" type="number" id="segmentToHouseWidth" value="${settings.get('segmentToHouseWidth')}">
            </div>
        </div>

        
        <hr>
        
            <dl>
                <dt>2.06</dt>
                <dd>WME pārsaukuši dažus elementus (Landmark -> Venue). Rezultātā nerādījās labošanas lietiņas.</dd>
                <dt>2.05</dt>
                <dd>OL deprecated, tāpēc OpenLayers.</dd>
                <dt>2.04</dt>
                <dd>Nebūtiski labojumiņi</dd>
                <dt>2.03</dt>
                <dd>Līdz ar jauno WME versiju "require" tagad tiek ielādēts "slinki". Atbalstīsim.</dd>
                <dt>2.02</dt>
                <dd>WME pēkšņi pazuda <code>W.Model.queries</code>...</dd>
                <dt>2.01</dt>
                <dd>Iespēja izveidot arī 2:1 vietu, ne tikai 1:1.</dd>
                <dt>2.0</dt>
                <dd>Tagad tuvākās viensētas tiek pievilktas, iezīmējot vietu.</dd>
                <dd>Ja iet louka, iznes miskast.</dd>
                <dt>1.45</dt>
                <dd>Minimālā zoom līmeņa iestatījums tagad attiecas uz visu funkcionalitāti.</dd>
                <dd>Izzūmojoties zem minimālā zoom līmeņa, ielādētie HN tiek notīrīti (lai nesēž un nebremzē).</dd>
                <dt>1.44</dt>
                <dd>Salabota nespēja korekti noteikt pilsētu, taisot mājas, kuras neatrodas ielā, bet gan ciemā..</dd>
                <dt>1.43</dt>
                <dd>Iespēja paslēpt citu ielu HN, kad uzklikšķina uz kāda segmenta.</dd>
                <dt>1.42</dt>
                <dd>Iespēja norādīt noklusēto vietas platumu, to pārveidojot par vietu.</dd>
                <dt>1.41</dt>
                <dd>Uzzīmē segmentu (izolētu), nospied kreisajā pusē redzamo pogu "Pārveidot par vietu" :)</dd>
                <dt>1.40</dt>
                <dd>Automātiski veidojot vietu, tagad tiek izveidots arī entry-exit punkts.</dd>
                <dt>1.37, 1.38, 1.39</dt>
                <dt>Sīki labojumi.</dt>
                <dt>1.36</dt>
                <dd>Spēja noteikt, kad nesakrīt ēkas numurs adresē ar ēkas numuru nosaukumā (dzeltens).</dd>
                <dt>1.35</dt>
                <dd>Iespēja norādīt, pie kāda zoom līmeņa vairs nelādēt adreses automātiski.</dd>
                <dt>1.34</dt>
                <dd>Iezīmējot vairākas vietas, tagad visām var nomainīt lock līmeni ar vienu klikšķi.</dd>
                <dt>1.33</dt>
                <dd>Neliels labojums tam, ka vieta tiek izveidota nepareizā apdzīvotajā vietā.</dd>
                <dt>1.32</dt>
                <dd>Pievienota izmaiņu vēsture ;)</dd>
                <dt>1.31</dt>
                <dd>Pareizi ģenerējas nosaukums ēkām, kurām ir nosaukums, bet tās atrodas pilsētā: "Bergmaņi, Svēte" vietā tagad ir "Bergmaņi".</dd>
                <dt>1.30</dt>
                <dd>Protam izveidot vietas apdzīvotās vietās.</dd>
                <dt>1.29</dt>
                <dd>Info lodziņš vairs nemirgo divreiz pēc klikšķa.</dd>
                <dt>1.28</dt>
                <dd>Protam atpazīt ēkas, kurām nosaukumā ir "iela", "prospekts", utt.</dd>
                <dt>1.26</dt>
                <dd>Idiots ;P</dd>
                <dt>1.25</dt>
                <dd>Iespēja iezīmēt vairākas vietas vienlaicīgi un tām uzreiz salabot adreses.</dd>
                <dt>1.24</dt>
                <dd>Tagad jebkuras izmaiņas atspoguļojas ne tikai pēc kartes pabīdīšanas.</dd>
                <dt>1.23</dt>
                <dd>Automātiskās ielādes ķeksi nediseiblojam, lai var atslēgt arī tad, kad zūms par lielu.</dd>
                <dt>1.18</dt>
                <dd>Neveicam automātisko ielādi, ja zūms par mazu (lai nav slikti).</dd>
                <dt>1.17</dt>
                <dd>Izveidotās vietas lokojam ar 3. līmeni, jajau  nav augstāks.</dd>
                <dt>1.15</dt>
                <dd>Nepajukt starp diviem Baltezeriem (Ādažu un Garkalnes novados)</dd>
            </dl>

        <hr>

        <div class="form-group">
            <label class="control-label" for="apiKey">API atslēga</label>
                <div class="controls">
                <input class="form-control settings-input" autocomplete="new-password" maxlength="100" name="apiKey" type="password" id="apiKey" value="${settings.get('apiKey')}">
            </div>
        </div>
        `;

        new WazeWrap.Interface.Tab('WME LV', html, () => {

            // Attach settings change handler to corresponding inputs
            qsa('.settings-input').forEach(element => {
                element.addEventListener('change', event => {
                    settings.set(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
                    update();
                })
            });

            qsa('[name="minHNZoomLevel"]').forEach(element => {
                element.addEventListener('change', event => {
                    settings.set('minHNZoomLevel', parseInt(event.target.value));
                });
            });

            qs('#blablaLoadHN').addEventListener('click', () => {
                loadVenues(true);
            });

            qs('#blablaClearPlaces').addEventListener('click', (e) => {
                hnLayer.destroyFeatures();
            });

            qsa('[data-action="create-place"]').forEach(el => {
                el.addEventListener('click', (e) => {
                    log.info(e.target)
                    const vertex = 22.57;

                    let place = new Landmark(),
                        poly = new OpenLayers.Geometry.LinearRing([
                            new OpenLayers.Geometry.Point(placeInfo.lonlat.lon - vertex, placeInfo.lonlat.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                            new OpenLayers.Geometry.Point(placeInfo.lonlat.lon - vertex, placeInfo.lonlat.lat + (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                            new OpenLayers.Geometry.Point(placeInfo.lonlat.lon + vertex, placeInfo.lonlat.lat + (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                            new OpenLayers.Geometry.Point(placeInfo.lonlat.lon + vertex, placeInfo.lonlat.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                            new OpenLayers.Geometry.Point(placeInfo.lonlat.lon - vertex, placeInfo.lonlat.lat - (e.target.dataset.ratio === '2:1' ? vertex / 2 : vertex)),
                        ]),
                        name = false,
                        address = {};
                    poly.rotate(10, poly.getCentroid());

                    place = createNewPlace(new OpenLayers.Geometry.Polygon([poly]), {});

                    suggestedAddresses = [];
                    suggestedAddresses[place.attributes.id] = [placeInfo];
                    setVenueAddress(place.attributes.id, 0);
                    fixPlaceArea(place);

                    update();
                });
            });

            /**
             * v2 handlers
             */
            wmelvRegisterGlobalHandlers();
            /**
             * v1 handlers
             */
            W.selectionManager.events.register('selectionchanged', this, update);
            W.model.actionManager.events.register('afteraction', this, update);
            W.map.events.register('zoomend', this, update);
            W.map.events.register('moveend', this, update);

            update();
            updatePeriodically();
            checkAPIAvailability();

            log.info('Ready');

        });

    }

    function loadTopo() {
        if (loadTopoTimeout) clearTimeout(loadTopoTimeout);

        if (!topoLayer) {
            topoLayer = new OpenLayers.Layer.Vector("wmelv-topo-layer", {
                styleMap: new OpenLayers.StyleMap({
                    default: new OpenLayers.Style({
                        strokeColor: "#00ff00",
                        strokeOpacity: .9,
                        strokeWidth: 3,
                        pointRadius: 6,
                        labelOutlineColor: '#ffffff',
                        labelOutlineWidth: 2,
                        label: '${label_text}',
                        fontColor: '#000000',
                    })
                })
            });
        }

        if (!settings.get('topoEnabled')) {
            topoLayer.destroyFeatures();
            return
        }
        loadTopoTimeout = setTimeout(() => {
            let uri = '//waze.dev.laacz.lv/api/lgia',
                params = {
                    layer: 'rail',
                    bounds: geojsonWriter.write(W.map.getExtent().toGeometry()),
                };

            axios.post(uri, params)
                .then(({data}) => {
                    let parser = new OpenLayers.Format.GeoJSON({
                            internalProjection: W.map.getProjectionObject(),
                            externalProjection: new OpenLayers.Projection("EPSG:900913"),
                        }),
                        features = parser.read(data);

                    topoLayer.destroyFeatures();

                    if (!W.map.getLayersByName("wmelv-topo-layer").length) {
                        W.map.addLayer(topoLayer);
                    }

                    topoLayer.addFeatures(features);
                });
        })
    }

    function loadVenues(force) {
        if (loadVenuesTimeout) clearTimeout(loadVenuesTimeout);
        if (!apiAvailable) return;

        loadVenuesTimeout = setTimeout(() => {

            let uri = '//waze.dev.laacz.lv/api/venues',
                current_street_id = W.selectionManager.getSelectedFeatures().length && W.selectionManager.getSelectedFeatures()[0].model.type === 'segment' ? W.selectionManager.getSelectedFeatures()[0].model.attributes.primaryStreetID : false,
                current_street_name = current_street_id && W.model.streets.objects[current_street_id] && W.model.streets.objects[current_street_id].name ? W.model.streets.objects[current_street_id].name : false,
                writer = new OpenLayers.Format.GeoJSON(),
                params = {
                    api_key: settings.get('apiKey'),
                    user: W.loginManager.user.userName,
                    bounds: writer.write(W.map.getExtent().transform('EPSG:900913', 'EPSG:4326').toGeometry()),
                    street: settings.get('autoHNSegmentSelection') ? current_street_name : false,
                };

            if ((force === true || settings.get('autoHN'))) {
                hnLayer.destroyFeatures();
                axios.post(uri, params)
                    .then(({data}) => {
                        let parser = new OpenLayers.Format.GeoJSON({
                                internalProjection: W.map.getProjectionObject(),
                                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                            }),
                            features = parser.read(data);

                        if (!W.map.getLayersByName("wmelv-hn-layer").length) W.map.addLayer(hnLayer);

                        hnLayer.addFeatures(features);
                    });
            }
        }, 500);
    }

    function drawVenueColors() {

        Object.values(W.model.venues.objects).forEach((v) => {
            let el = qs('#' + v.geometry.id),
                hled = false;
            if (!hled && el && (
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
        });

    }

    function updatePeriodically() {
        if (updateTimeout) clearTimeout(updateTimeout);

        let blablaCounts = {
            fixArea: 0,
            fixLowerCase: 0,
            fixNoHN: 0,
            fixIela: 0,
        };

        if (W.map.getZoom() < settings.get('minHNZoomLevel')) {
            if (qs('#zoom-level-warning')) qs('#zoom-level-warning').style.display = 'inline-block';
            if (qs('#blablaLoadHN')) qs('#blablaLoadHN').disabled = true;
        } else {
            if (qs('#autoHN')) qs('#autoHN').disabled = false;
            if (qs('#zoom-level-warning')) qs('#zoom-level-warning').style.display = 'none';
            if (qs('#blablaLoadHN')) qs('#blablaLoadHN').disabled = false;
        }

        if (W.map.getZoom() < settings.get('minHNZoomLevel')) {
            if (hnLayer) hnLayer.destroyFeatures();
            return;
        }

        Object.keys(W.model.venues.objects).forEach((k, idx_v) => {
            let v = W.model.venues.objects[k].attributes,
                area = W.model.venues.objects[k].geometry.toString().indexOf('POLYGON') === 0 ? W.model.venues.objects[k].geometry.getGeodesicArea(W.map.getProjectionObject()) : false;

            W.model.venues.objects[k].attributes.fixLowerCase =
                (v.houseNumber && v.houseNumber.toUpperCase() !== v.houseNumber) ||
                (v.houseNumber && v.name && v.name.toUpperCase() === v.houseNumber.toUpperCase() && v.name !== v.houseNumber.toUpperCase()) ||
                (v.name && v.name.replace(/ k-\d+$/, '').match(/^\d+[a-z]+/) && v.name.replace(/ k-\d+$/, '').toUpperCase() !== v.name.replace(/ k-\d+$/, ''));

            W.model.venues.objects[k].attributes.fixNameHNMismatch =
                !v.residential && (
                    (v.houseNumber && !v.name) ||
                    (v.houseNumber && v.name && v.name.match(reHN) && v.houseNumber.toLowerCase() !== v.name.toLowerCase().replace(' k-', '-'))
                );

            W.model.venues.objects[k].attributes.fixNoHN = !v.houseNumber &&
                v.streetID &&
                W.model.streets.objects[v.streetID] &&
                W.model.streets.objects[v.streetID].name &&
                W.model.streets.objects[v.streetID].cityID &&
                W.model.cities.objects[W.model.streets.objects[v.streetID].cityID] &&
                W.model.cities.objects[W.model.streets.objects[v.streetID].cityID].attributes.name &&
                v.categories.indexOf('PARKING_LOT') === -1 &&
                v.categories.indexOf('TAXI_STATION') === -1 &&
                v.categories.indexOf('PARK') === -1
            ;


            W.model.venues.objects[k].attributes.fixIela = v.name.toLowerCase().match(reStreetNames);
            W.model.venues.objects[k].attributes.fixArea = !v.residential && area !== false && area < 509 ? area : false;

            blablaCounts.fixArea += !!W.model.venues.objects[k].attributes.fixArea;
            blablaCounts.fixLowerCase += !!W.model.venues.objects[k].attributes.fixLowerCase;
            blablaCounts.fixIela += !!W.model.venues.objects[k].attributes.fixIela;

        });

        // Updates interface

        if (!qs('[for="hlSmallArea"] .count')) {
            let el = document.createElement('span');
            el.classList.add('count');
            qs('[for="hlSmallArea"]').appendChild(el);
        }
        qs('[for="hlSmallArea"] .count').classList.toggle('hidden', !settings.get('hlSmallArea'));
        qs('[for="hlSmallArea"] .count').innerText = blablaCounts.fixArea;

        if (!qs('[for="hlLowerCaseHN"] .count')) {
            let el = document.createElement('span');
            el.classList.add('count');
            qs('[for="hlLowerCaseHN"]').appendChild(el);
        }
        qs('[for="hlLowerCaseHN"] .count').classList.toggle('hidden', !settings.get('hlLowerCaseHN'));
        qs('[for="hlLowerCaseHN"] .count').innerText = blablaCounts.fixLowerCase;

        drawVenueColors();

        updateTimeout = setTimeout(updatePeriodically, 345);
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

        update();

    }

    function setVenueAddress(id, idx) {

        let venue_model = W.model.venues.objects[id],
            venue = venue_model.attributes,
            changes = {},
            address = suggestedAddresses[id][idx];

        if (!address) {
            log.info('bug');
        }

        if (venue.streetID !== address.street_id) {
            changes.streetID = address.street_id;
        }

        if (address.name && address.name.match(reHN) && venue.houseNumber !== address.name.replace(' k-', '-')) {
            changes.houseNumber = address.name.replace(' k-', '-');
        } else if (address.name && !address.name.match(reHN) && venue.houseNumber) {
            changes.houseNumber = null;
        }

        if ((!venue.name) ||
            (venue.name.match(reHN) && venue.name !== address.name) ||
            (venue.name.indexOf('(copy') !== -1)
        ) {
            changes.name = address.name + (!address.city_name && address.district ? ', ' + address.district : '');
        }

        if (venue.lockRank < 2) {
            venue.lockRank = 2;
        }

        if (Object.keys(changes).length) W.model.actionManager.add(new UpdateObject(venue_model, changes));

    }

    function fixVenueAddress(id, address) {
        let streets = blabla.streetsByAttributes({name: address.streetName}),
            street = streets.length ? streets[0] : false,
            houseNumber = address.houseNumber ? address.houseNumber.replace(' k-', '-') : address.houseNumber,
            venue = W.model.venues.objects[id],
            changes = {};

        if (!houseNumber) return;

        if (venue.attributes.houseNumber !== houseNumber) changes.houseNumber = houseNumber;
        if (venue.attributes.name !== address.houseNumber &&
            venue.attributes.residential === false &&
            (!venue.attributes.name || venue.attributes.name.toUpperCase().indexOf(address.houseNumber) === 0) ||
            venue.attributes.name.indexOf('(copy') !== -1) changes.name = address.houseNumber;
        if (venue.attributes.streetID !== street.id) changes.streetID = street.id;

        if (changes) W.model.actionManager.add(new UpdateObject(venue, changes));

    }

    function update(e) {

        updatePeriodically();

        if (W.map.getZoom() < settings.get('minHNZoomLevel')) return;

        Object.keys(W.model.venues.objects).forEach((k, idx_v) => {
            let v = W.model.venues.objects[k].attributes;
            W.model.venues.objects[k].attributes.fixDupes = settings.get('hlDupes') && !!Object.values(W.model.venues.objects).find((f, idx_f) => idx_v !== idx_f && f.geometry.equals(v.geometry));
        });

        let html = '';

        visibleStreets = [];

        qs('#blablaLoadHN').disabled = settings.get('autoHN');

        Object.values(W.model.streets.objects).forEach(street => {
            if (!visibleStreets[street.id] && street.name) {
                visibleStreets[street.id] = street;
            }
        });

        // Loads HNs from API
        loadVenues();
        // updateAddressSuggestions();

        // Sets blabla attributes of venues

        if (false && e &&
            apiAvailable && settings.get('addressFixer') &&
            W.selectionManager.hasSelectedFeatures() &&
            W.selectionManager.getSelectedFeatures().length > 1 &&
            W.selectionManager.getSelectedFeatures().filter(f => f.model.type !== 'venue').length === 0) {
        } else if (e &&
            W.selectionManager.hasSelectedFeatures() &&
            W.selectionManager.getSelectedFeatures().length === 1 &&
            W.selectionManager.getSelectedFeatures()[0].model.type === "venue") {

            let venue = W.selectionManager.getSelectedFeatures()[0].model,
                warnings = [],
                html = `
                <div class="action-buttons">
                    <div class="alert addresses"></div>
                `;

            if (venue.attributes.fixLowerCase) warnings.push('Ēkas numurs satur mazo burtu (<a href="" id="fixThisLowerCase">salabot</a>)');
            if (venue.attributes.fixNameHNMismatch) warnings.push('Ēkas numurs nesakrīt ar numuru nosaukumā<br/>' +
                '(<a href="" id="fixNameHNMismatchToAddress">pareiza adrese</a>, <a href="" id="fixNameHNMismatchToName">pareizs nosaukums</a>)');
            if (venue.attributes.fixIela) warnings.push('Vietas nosaukums satur "' +
                venue.attributes.name.match(reStreetNames)[0] +
                '" (<a href="" id="fixIelaInName">salabot</a>)');
            if (venue.attributes.fixNoHN) warnings.push('Adrese ir, bet ēkas numura nav');
            if (venue.attributes.fixArea) warnings.push('Ēkas platība ' + Math.floor(venue.attributes.fixArea) + 'm² ir mazāka par 509m² (<a href="" id="fixThisArea">salabot</a>)');

            html += warnings.map(warning => `<div class="alert alert-danger">${warning}</div>`).join('');

            html += '</div>';

            /**
             * Update landmark edit tab.
             */
            if (!qs('#blabla-landmark-edit')) {
                let div = document.createElement('div');
                div.id = 'blabla-landmark-edit';
                qs('#venue-edit-general').insertBefore(div, qs('#venue-edit-general').firstChild);
            }

            qs('#blabla-landmark-edit').innerHTML = html;

            if (qs('#fixNameHNMismatchToAddress')) {
                qs('#fixNameHNMismatchToAddress').addEventListener('click', (e) => {
                    e.preventDefault();
                    let venue = W.selectionManager.getSelectedFeatures()[0],
                        changes = {
                            name: venue.model.attributes.houseNumber.replace('-', ' k-'),
                        };

                    if (changes) W.model.actionManager.add(new UpdateObject(venue.model, changes));

                })
            }
            if (qs('#fixNameHNMismatchToName')) {
                qs('#fixNameHNMismatchToName').addEventListener('click', (e) => {
                    e.preventDefault();
                    let venue = W.selectionManager.getSelectedFeatures()[0],
                        changes = {
                            houseNumber: venue.model.attributes.name.replace(' k-', '-'),
                        };

                    if (changes) W.model.actionManager.add(new UpdateObject(venue.model, changes));

                })
            }

            if (qs('#fixThisArea')) {
                qs('#fixThisArea').addEventListener('click', fixCurrentlySelectedArea);
            }
            if (qs('#fixIelaInName')) {
                qs('#fixIelaInName').addEventListener('click', (e) => {
                    e.preventDefault();
                    let venue = W.selectionManager.getSelectedFeatures()[0],
                        name = venue.model.attributes.name,
                        changes = {
                            name: name.replace(reStreetNames, '$3'),
                        };

                    if (changes) W.model.actionManager.add(new UpdateObject(venue.model, changes));

                });

            }
            if (qs('#fixThisLowerCase')) {
                qs('#fixThisLowerCase').addEventListener('click', (e) => {
                    e.preventDefault();
                    let changes = {};
                    if (venue.attributes.houseNumber && venue.attributes.houseNumber.toUpperCase() !== venue.attributes.houseNumber) {
                        changes.houseNumber = venue.attributes.houseNumber.toUpperCase();
                    }
                    if (venue.attributes.name && venue.attributes.name.match(/^\d+[a-z][^a-z]*/)) {
                        changes.name = venue.attributes.name.toUpperCase().replace(' K-', ' k-');
                        if (venue.attributes.houseNumber) changes.houseNumber = venue.attributes.houseNumber.toUpperCase();
                    }
                    if (changes) W.model.actionManager.add(new UpdateObject(venue, changes));
                    update();
                });
            }

        } else if (e &&
            W.selectionManager.hasSelectedFeatures() &&
            W.selectionManager.getSelectedFeatures().length === 1 &&
            W.selectionManager.getSelectedFeatures()[0].model.type === "segment") {

            let segment = W.selectionManager.getSelectedFeatures()[0];

            if (!qs('#wmelv-convert-to-area')) {

                let button = document.createElement('button');
                button.id = 'wmelv-convert-to-area';
                button.classList.add('action-button', 'waze-btn', 'waze-btn-white');
                button.innerHTML = 'Pārveidot par vietu';

                qs('#edit-panel .form-group.more-actions').appendChild(button)
            }

            qs('#wmelv-convert-to-area').disabled = !(segment.model.getConnectedSegments().length === 1 && segment.model.getConnectedSegments()[0].attributes.id === segment.model.attributes.id);

            qs('#wmelv-convert-to-area').addEventListener('click', () => {
                let wkt_reader = new jsts.io.WKTReader(),
                    input = wkt_reader.read(segment.geometry.toString()),
                    buffer = input.buffer(settings.get('segmentToHouseWidth'), -100, 2),
                    geojson_writer = new jsts.io.GeoJSONWriter(),
                    buffer_geometry = geojson_writer.write(buffer),
                    parser = new OpenLayers.Format.GeoJSON();

                let poly = parser.read(buffer_geometry);

                W.model.actionManager.add(new DeleteSegment(segment.model));
                createNewPlace(poly[0].geometry)

            });

        } else if (W.selectionManager.getSelectedFeatures().length === 0) {
            qsa('.resizer-handle').forEach(el => {
                el.parentNode.removeChild(el);
            });
        }

        if (apiAvailable && qs('#wmlelv-place-info')) {
            updateAddressSuggestionUI();
        }

    }

    bootstrap();

})();
/* end ======================================================================= */
