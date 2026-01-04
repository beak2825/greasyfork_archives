// ==UserScript==
// @name         WME Google Link Enhancements (demo)
// @namespace    WazeDev
// @version      2018.02.27.002
// @description  Shows Google places on the map when hovering over links.  Highlights links that are already linked.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/38959/WME%20Google%20Link%20Enhancements%20%28demo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38959/WME%20Google%20Link%20Enhancements%20%28demo%29.meta.js
// ==/UserScript==

class GoogleLinkEnhancer {

    constructor() {
        this.EXT_PROV_ELEM_QUERY = 'li.external-provider-item';
        this.CLOSED_PLACE_TEXT = 'Google indicates this place is permanently closed.\nVerify with other sources or the editor community before deleting.';
        this.LINK_CACHE_NAME = 'gle_link_cache';
        this.LINK_CACHE_CLEAN_INTERVAL_MIN = 3;
        this.LINK_CACHE_LIFESPAN_HR = 6;
        this._enabled = false;
        this._mapLayer = null;
        this._urlOrigin = window.location.origin;

        this._initLZString();
        let storedCache = localStorage.getItem(this.LINK_CACHE_NAME);
        this._linkCache = storedCache ? $.parseJSON(this._LZString.decompress(storedCache)) : {};

        this._initLayer();

        // Watch for ext provider elements being added to the DOM, and add hover events.
        this._linkObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let idx=0; idx<mutation.addedNodes.length; idx++) {
                    let nd = mutation.addedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE) {
                        let $el = $(nd);
                        if ($el.is(this.EXT_PROV_ELEM_QUERY)) {
                            this._addHoverEvent($el);
                        } else {
                            if ($el.find('div.uuid').length) {
                                this._formatLinkElements();
                            }
                        }
                    }
                }
            });
        });

        // Watch the side panel for addition of the sidebar-layout div, which indicates a mode change.
        this._modeObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let idx = 0; idx<mutation.addedNodes.length; idx++) {
                    let nd = mutation.addedNodes[idx];
                    if (nd.nodeType === Node.ELEMENT_NODE && $(nd).is('.sidebar-layout')) {
                        this._observeLinks();
                        break;
                    }
                }
            });
        });

        // This is a special event that will be triggered when DOM elements are destroyed.
        (function($){
            $.event.special.destroyed = {
                remove: function(o) {
                    if (o.handler && o.type !== 'destroyed') {
                        o.handler();
                    }
                }
            };
        })(jQuery);
    }

    _initLayer(){
        this._mapLayer = new OpenLayers.Layer.Vector("External Provider Link Enhancements.", {
            uniqueName: "___ExtProvLinkEnhancements",
            displayInLayerSwitcher: true,
            styleMap: new OpenLayers.StyleMap({
                default: {
                    strokeColor: '${strokeColor}',
                    strokeWidth: '${strokeWidth}',
                    strokeDashstyle: '${strokeDashstyle}',
                    //fillColor: '#ffff00',
                    pointRadius: '15',
                    fillOpacity: '0'
                }
            })
        });

        this._mapLayer.setOpacity(0.8);

        I18n.translations[I18n.locale].layers.name.___ExtProvLinkEnhancements = "External Provider Link Enhancements";

        W.map.addLayer(this._mapLayer);

        W.model.events.register("mergeend",this,function(e){
            this._processPlaces();
        },true);
        W.map.events.register("moveend",this,function(e){
            this._processPlaces();
        },true);
        W.model.venues.on('objectschanged', function(e) {
            this._processPlaces();
        }, this);
    }

    enable() {
        this._enabled = true;
        this._modeObserver.observe($('.edit-area #sidebarContent')[0], {childList: true, subtree:false});
        this._observeLinks();
        // Note: Using on() allows passing "this" as a variable, so it can be used in the handler function.
        $(document).on('ajaxSuccess', null, this, this._onAjaxSuccess);
        $('#map').on('mouseenter', null, this, this._onMapMouseenter);
        W.model.venues.on('objectschanged', this._formatLinkElements, this);
        this._cleanAndSaveLinkCache();
        this._cacheCleanIntervalID = setInterval(() => this._cleanAndSaveLinkCache(), 1000 * 60 * this.LINK_CACHE_CLEAN_INTERVAL_MIN);
    }

    disable() {
        this._enabled = false;
        this._modeObserver.disconnect();
        this._linkObserver.disconnect();
        $(document).off('ajaxSuccess', this._onAjaxSuccess);
        $('#map').off('mouseenter', this._onMapMouseenter);
        W.model.venues.off('objectschanged', this._formatLinkElements, this);
        if (this._cacheCleanIntervalID) clearInterval(this._cacheCleanIntervalID);
        this._cleanAndSaveLinkCache();
    }

    _cleanAndSaveLinkCache() {
        if (!this._linkCache) return;
        let now = new Date();
        Object.keys(this._linkCache).forEach(id => {
            let link = this._linkCache[id];
            // Bug fix:
            if (link.location) {
                link.loc = link.location;
                delete link.location;
            }
            // Delete link if older than 6 hours.
            if (!link.ts || (now - link.ts) > this.LINK_CACHE_LIFESPAN_HR * 3600 * 1000) {
                delete this._linkCache[id];
            }
        });
        localStorage.setItem(this.LINK_CACHE_NAME, this._LZString.compress(JSON.stringify(this._linkCache)));
        //console.log('link cache count: ' + Object.keys(this._linkCache).length, this._linkCache);
    }

    _processPlaces() {
        let that = this;
        this._mapLayer.removeAllFeatures();
        W.model.venues.getObjectArray().forEach(function(venue) {
            venue.attributes.externalProviderIDs.forEach(provID => {
                let id = provID.attributes.uuid;
                that._getLinkInfoAsync(id).then(link => {
                    if (link.closed || link.notFound) {
                        let dashStyle = link.closed && /(\(|- )(permanently )?closed\)?$/i.test(venue.attributes.name) ? venue.isPoint() ? '2 6' : '2 16' : 'solid';
                        let geometry = venue.isPoint() ? venue.geometry.getCentroid() : venue.geometry.clone();
                        let width = venue.isPoint() ? '4' : '12';
                        let color = link.notFound ? '#FF00FF' : '#FF0000';
                        that._mapLayer.addFeatures([new OpenLayers.Feature.Vector(geometry, {strokeWidth:width, strokeColor:color, strokeDashstyle:dashStyle})]);
                    }
                }).catch(res => {
                    console.log(res);
                });
            });
        });
    }

    _cacheLink(id, link) {
        link.ts = new Date();
        this._linkCache[id] = link;
        //console.log('link cache count: ' + Object.keys(this._linkCache).length, this._linkCache);
    }

    _getLinkInfoAsync(id) {
        var link = this._linkCache[id];
        if (link) {
            return Promise.resolve(link);
        } else {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'https://maps.googleapis.com/maps/api/place/details/json?&key=AIzaSyAsAX1j9V0mRqFZx3HiTF0NLdGXWddck3U&placeid=' + id,
                    context: this,
                    onload: function(res) {
                        let json = JSON.parse(res.responseText);
                        if (json.status==='NOT_FOUND')  {
                            link = {notFound: true};
                        } else {
                            link = {loc:json.result.geometry.location,closed:json.result.permanently_closed};
                        }
                        res.context._cacheLink(id, link);
                        resolve(link);
                    },
                    onerror: function() {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                });
            });
        }
    }

    _onMapMouseenter(event) {
        // If the point isn't destroyed yet, destroy it when mousing over the map.
        event.data._destroyPoint();
    }

    _formatLinkElements(a,b,c) {
        let existingLinks = this._getExistingLinks();
        $('#edit-panel').find(this.EXT_PROV_ELEM_QUERY).each((ix, childEl) => {
            let $childEl = $(childEl);
            let id = this._getIdFromElement($childEl);
            if (existingLinks[id] && existingLinks[id].count > 1 && existingLinks[id].isThisVenue) {
                setTimeout(() => {
                    $childEl.find('div.uuid').css({backgroundColor:'#FF0'}).attr({'title':'This is linked to ' + existingLinks[id].count.toString() + ' places'});
                }, 50);
            }
            this._addHoverEvent($(childEl));

            let link = this._linkCache[id];
            if (link) {
                if (link.closed) {
                    // A delay is needed to allow the UI to do its formatting so it doesn't overwrite ours.
                    setTimeout(() => {
                        $childEl.find('div.uuid').css({backgroundColor:'#FAA'}).attr('title',this.CLOSED_PLACE_TEXT);
                    }, 50);
                }
            }
        });
    }

    _getExistingLinks() {
        let existingLinks = {};
        let thisVenue;
        if (W.selectionManager.selectedItems.length) {
            thisVenue = W.selectionManager.selectedItems[0].model;
        }
        W.model.venues.getObjectArray().forEach(venue => {
            let isThisVenue = venue === thisVenue;
            let thisPlaceIDs = [];
            venue.attributes.externalProviderIDs.forEach(provID => {
                let id = provID.attributes.uuid;
                if (thisPlaceIDs.indexOf(id) === -1) {
                    thisPlaceIDs.push(id);
                    let link = existingLinks[id];
                    if (link) {
                        link.count++;
                    } else {
                        link = {count: 1};
                        existingLinks[id] = link;
                    }
                    link.isThisVenue = link.isThisVenue || isThisVenue;
                }
            });
        });
        return existingLinks;
    }

    _onAjaxSuccess(event, jqXHR, ajaxOptions, data) {
        let url = ajaxOptions.url;
        let that = event.data;

        if(/^\/maps\/api\/place\/autocomplete\/json?/i.test(url)) {
            // After an "autocomplete" api call...

            // Get a list of already-linked id's
            let existingLinks = that._getExistingLinks();

            // Examine the suggestions and format any that are already linked.
            $('#select2-drop ul li').each((idx, el) => {
                let $el = $(el);
                let linkData = $el.data('select2Data');
                if (linkData) {
                    let link = existingLinks[linkData.id];
                    if (link) {
                        let title, bgColor, textColor, fontWeight;
                        if (link.count > 1) {
                            title = 'Linked more than once already.  Please find and remove multiple links.';
                            textColor = '#000';
                            bgColor = '#FF0';
                        } else {
                            bgColor = '#ddd';
                            if (link.isThisVenue) {
                                title = 'Already linked to this place';
                                textColor = '#444';
                                fontWeight = 600;
                            } else {
                                title = 'Already linked to a nearby place';
                                textColor = '#888';
                            }
                        }
                        if (bgColor) $el.css({backgroundColor: bgColor});
                        if (textColor) $el.css({color: textColor});
                        if (fontWeight) $el.css({fontWeight: fontWeight});
                        $el.attr('title',title);
                    }
                    $el.mouseover(function() {
                        that._addPoint(linkData.id);
                    }).mouseleave(() => that._destroyPoint()).bind('destroyed', () => that._destroyPoint()).mousedown(() => that._destroyPoint());
                }
            });
        } else if (/^\/maps\/api\/place\/details\/json?/i.test(url)) {
            //After a "details" api call...

            // Cache location results.  Note this isn't absolutely necessary because they're
            // cached when calling for them on mouseover.  However, WME calls this api for each link
            // when the place is first loaded, so might as well take advantage of it.

            let link = {};
            if (data.status === 'NOT_FOUND') {
                link.notFound = true;
            } else {
                link.loc = data.result.geometry.location;
                link.closed = data.result.permanently_closed;
            }
            var id = url.match(/placeid=(.*)&?/)[0];
            that._cacheLink(id, link);
            that._formatLinkElements();
        }
    }

    // Remove the POI point from the map.
    _destroyPoint() {
        if (this._feature) this._feature.destroy();
        this._feature = null;
    }

    // Add the POI point to the map.
    _addPoint(id) {
        if (!id) return;
        let link = this._linkCache[id];
        if (link) {
            if (!link.notFound) {
                let coord = link.loc;
                let pt = new OpenLayers.Geometry.Point(coord.lng, coord.lat);
                pt.transform(W.map.displayProjection, W.map.projection);
                if ( pt.intersects(W.map.getExtent().toGeometry()) ) {
                    this._destroyPoint();  // Just in case it still exists.
                    this._feature = new OL.Feature.Vector(pt,{poiCoord:true},{
                        pointRadius: 6,
                        strokeWidth: 30,
                        strokeColor: '#FFA500',
                        fillColor: '#FFA500',
                        strokeOpacity: 0.5
                    });
                    W.map.getLayerByUniqueName('landmarks').addFeatures([this._feature]);
                    this._timeoutDestroyPoint();
                }
            }
        } else {
            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://maps.googleapis.com/maps/api/place/details/json?&key=AIzaSyAsAX1j9V0mRqFZx3HiTF0NLdGXWddck3U&placeid=' + id,
                context: this,
                onload: function(res) {
                    res.context._cacheLink(id, {loc:json.result.geometry.location,closed:json.result.permanently_closed});
                    res.context._addPoint(id);
                }
            });
        }
    }

    // Destroy the point after some time, if it hasn't been destroyed already.
    _timeoutDestroyPoint() {
        if (this._timeoutID) clearTimeout(this._timeoutID);
        this._timeoutID = setTimeout(() => this._destroyPoint(), 4000);
    }

    _getIdFromElement($el) {
        return $el.find('input.uuid').attr('value');
    }

    _addHoverEvent($el) {
        $el.hover(() => this._addPoint(this._getIdFromElement($el)) , () => this._destroyPoint());
    }

    _observeLinks() {
        this._linkObserver.observe($('#edit-panel')[0],{ childList: true, subtree: true });
    }

    _initLZString() {
        // LZ Compressor
        // Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
        // This work is free. You can redistribute it and/or modify it
        // under the terms of the WTFPL, Version 2
        // LZ-based compression algorithm, version 1.4.4
        this._LZString = (function() {
            // private property
            var f = String.fromCharCode;
            var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
            var baseReverseDic = {};

            function getBaseValue(alphabet, character) {
                if (!baseReverseDic[alphabet]) {
                    baseReverseDic[alphabet] = {};
                    for (var i = 0; i < alphabet.length; i++) {
                        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
                    }
                }
                return baseReverseDic[alphabet][character];
            }
            var LZString = {
                compressToBase64: function(input) {
                    if (input === null) return "";
                    var res = LZString._compress(input, 6, function(a) {
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
                decompressFromBase64: function(input) {
                    if (input === null) return "";
                    if (input === "") return null;
                    return LZString._decompress(input.length, 32, function(index) {
                        return getBaseValue(keyStrBase64, input.charAt(index));
                    });
                },
                compressToUTF16: function(input) {
                    if (input === null) return "";
                    return LZString._compress(input, 15, function(a) {
                        return f(a + 32);
                    }) + " ";
                },
                decompressFromUTF16: function(compressed) {
                    if (compressed === null) return "";
                    if (compressed === "") return null;
                    return LZString._decompress(compressed.length, 16384, function(index) {
                        return compressed.charCodeAt(index) - 32;
                    });
                },

                compress: function(uncompressed) {
                    return LZString._compress(uncompressed, 16, function(a) {
                        return f(a);
                    });
                },
                _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
                    if (uncompressed === null) return "";
                    var i, value,
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
                decompress: function(compressed) {
                    if (compressed === null) return "";
                    if (compressed === "") return null;
                    return LZString._decompress(compressed.length, 32768, function(index) {
                        return compressed.charCodeAt(index);
                    });
                },
                _decompress: function(length, resetValue, getNextValue) {
                    var dictionary = [],
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
}

let _glEnhancer;
function bootstrap() {
    if (W && W.loginManager && W.loginManager.isLoggedIn()) {
        _glEnhancer = new GoogleLinkEnhancer();
        _glEnhancer.enable();
    } else {
        setTimeout(() => bootstrap(), 500);
    }
}

bootstrap();