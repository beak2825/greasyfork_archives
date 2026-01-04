// ==UserScript==
// @name         WME MSN 交通情報
// @description  WME MSN Baustellen & Traffic Overlay
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2023.02.05
// @author       vertexcode, hiwi234, su-mo
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @connect      mydrive.api-system.tomtom.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495224/WME%20MSN%20%E4%BA%A4%E9%80%9A%E6%83%85%E5%A0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/495224/WME%20MSN%20%E4%BA%A4%E9%80%9A%E6%83%85%E5%A0%B1.meta.js
// ==/UserScript==
 
// Versions Format
// yyyy.mm.dd
 
/* global I18n */
 
(function () {
    'use strict';
 
    const prefix = "⛔🛣️🚧";
    const version = GM_info.script.version;
    const name = GM_info.script.name;
    const scriptURL = GM_info.script.namespace;
    let uOpenLayers;
    let uWaze;
    let iconsLayer;
    let epsg900913, epsg4326;
    let btfDiv;
    let btfDivVisible = false;
    let mouseInPopup = false;
    let popupID = false;
    let btfDivOffset = -3;
    let layerCheckBoxElement;
    let panelCheckBoxElement;
    let language ='en';
 
    const mtotypes = [
        { "type" : "closure",   "icon" : 'https://upload.wikimedia.org/wikipedia/commons/4/46/Zeichen_250_-_Verbot_f%C3%BCr_Fahrzeuge_aller_Art%2C_StVO_1970.svg' },
        { "type" : "construct", "icon" : 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Zeichen_123_-_Arbeitsstelle%2C_StVO_2013.svg' },
        { "type" : "narrows",   "icon" : 'https://upload.wikimedia.org/wikipedia/commons/0/08/Zeichen_120_-_Verengte_Fahrbahn%2C_StVO_1970.svg' },
        { "type" : "traffic",   "icon" : 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Zeichen_124_-_Stau%2C_StVO_1992.svg' },
        { "type" : "others",    "icon" : 'https://upload.wikimedia.org/wikipedia/commons/0/02/Zeichen_101_-_Gefahrstelle%2C_StVO_1970.svg' }
    ];
 
    function loadTranslations() {
        setTranslations({
            en: {
                closure     : 'Closures',
                construct   : 'Roadworks',
                narrows     : 'Lane narrowing',
                traffic     : 'Traffic jam',
                others      : 'Others',
                enable      : 'Enable',
                regex       : {
                    closure     : /closed/i,
                    construct   : /roadworks/i,
                    narrows     : /(reduced|lane|line)/i,
                    traffic     : /traffic/i,
                    others      : "",
                },
                reason      : 'Reason',
                street      : 'Street',
                from        : 'From',
                direction   : 'Direction',
                distance    : 'Distance',
                at          : 'At',
                till        : 'Till'
            },
            de: {
                closure     : 'Sperrungen',
                construct   : 'Baustellen',
                narrows     : 'Fahrbahn Verengungen',
                traffic     : 'Staus',
                others      : 'Sonstiges',
                enable      : 'Aktivieren',
                regex       : {
                    closure     : /gesperrt/i,
                    construct   : /Baustelle/i,
                    narrows     : /(vereng|Fahrstreifen)/i,
                    traffic     : /(Stau|Verkehr)/i,
                    others      : "",
                },
                reason      : 'Grund',
                street      : 'Straße',
                from        : 'von',
                direction   : 'nach',
                distance    : 'Länge',
                at          : 'ab',
                till        : 'bis'
            }
        });
    }
 
    function insertCSS() {
        // Style sheet for buttons
        var style = document.createElement('style')
        style.type = 'text/css'
        style.append(`#sidepanel-${prefix} .mto-container { display:flex; align-items:center; margin:2px; font-weight:normal; }`)
        style.append(`#sidepanel-${prefix} .mto-container img { width:1.5em; height:1.5em; margin:0 1ex; }`)
        style.append(`#sidepanel-${prefix} .mto-container MTOCheckbox { margin:0; }`)
        document.getElementsByTagName('head')[0].appendChild(style)
    }
 
    function setTranslations(translations) {
        I18n.translations[I18n.currentLocale()][prefix] = translations.en;
        for (var i = 0; i < Object.keys(translations).length; i++) {
            var locale = Object.keys(translations)[i];
            if (I18n.currentLocale().match(locale)) {
                I18n.translations[I18n.currentLocale()][prefix] = translations[locale];
                language = locale;
                return;
            }
        }
    }
 
    function convertBase(value) {
        return {
            from: function (baseFrom) {
                return {
                    to: function (baseTo) {
                        return parseInt(value, baseFrom).toString(baseTo);
                    }
                };
            }
        };
    }
 
    /**
     * fill value with leading zeros
     */
    function zfill(value, length) {
        let s = value + "";
 
        while (s.length < length) {
            s = "0" + s;
        }
 
        return s;
    }
 
    function tile2key(x, y, z) {
        let x_bin = convertBase(x).from(10).to(2);
        let y_bin = convertBase(y).from(10).to(2);
        x_bin = zfill(x_bin, z);
        y_bin = zfill(y_bin, z);
        // interleave bits
        let quadkey = [];
        for (let i = 0; i < z; i++) {
            // rows, i.e., y-axis, comes first
            quadkey.push(y_bin.charAt(i));
            quadkey.push(x_bin.charAt(i));
        }
        // convert quadkey to base-4 number, maintaining leading zeros (!)
        quadkey = quadkey.join("");
        quadkey = convertBase(quadkey).from(2).to(4);
        // add leading zeros if needed
        quadkey = zfill(quadkey, z);
 
        return quadkey;
    };
 
    function addIcon() {
        if (uOpenLayers.Icon) return;
        uOpenLayers.Icon = uOpenLayers.Class({
 
            /**
             * Property: url
             * {String}  image url
             */
            url: null,
 
            /**
             * Property: size
             * {<OpenLayers.Size>|Object} An OpenLayers.Size or
             * an object with a 'w' and 'h' properties.
             */
            size: null,
 
            /**
             * Property: offset
             * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
             * image when being rendered. An OpenLayers.Pixel or an object
             * with a 'x' and 'y' properties.
             */
            offset: null,
 
            /**
             * Property: calculateOffset
             * {Function} Function to calculate the offset (based on the size)
             */
            calculateOffset: null,
 
            /**
             * Property: imageDiv
             * {DOMElement}
             */
            imageDiv: null,
 
            /**
             * Property: px
             * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
             * with a 'x' and 'y' properties.
             */
            px: null,
 
            /**
             * Constructor: OpenLayers.Icon
             * Creates an icon, which is an image tag in a div.
             *
             * url - {String}
             * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or an
             *                                   object with a 'w' and 'h'
             *                                   properties.
             * offset - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
             *                                      object with a 'x' and 'y'
             *                                      properties.
             * calculateOffset - {Function}
             */
            initialize: function (url, size, offset, calculateOffset) {
                this.url = url;
                this.size = size || {w: 20, h: 20};
                this.offset = offset || {x: -(this.size.w / 2), y: -(this.size.h / 2)};
                this.calculateOffset = calculateOffset;
 
                var id = uOpenLayers.Util.createUniqueID("OL_Icon_");
                this.imageDiv = uOpenLayers.Util.createAlphaImageDiv(id);
            },
 
            /**
             * Method: destroy
             * Nullify references and remove event listeners to prevent circular
             * references and memory leaks
             */
            destroy: function () {
                // erase any drawn elements
                this.erase();
 
                OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
                this.imageDiv.innerHTML = "";
                this.imageDiv = null;
            },
 
            /**
             * Method: clone
             *
             * Returns:
             * {<OpenLayers.Icon>} A fresh copy of the icon.
             */
            clone: function () {
                return new OpenLayers.Icon(this.url,
                    this.size,
                    this.offset,
                    this.calculateOffset);
            },
 
            /**
             * Method: setSize
             *
             * Parameters:
             * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or
             * an object with a 'w' and 'h' properties.
             */
            setSize: function (size) {
                if (size != null) {
                    this.size = size;
                }
                this.draw();
            },
 
            /**
             * Method: setUrl
             *
             * Parameters:
             * url - {String}
             */
            setUrl: function (url) {
                if (url != null) {
                    this.url = url;
                }
                this.draw();
            },
 
            /**
             * Method: draw
             * Move the div to the given pixel.
             *
             * Parameters:
             * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
             *                                  object with a 'x' and 'y' properties.
             *
             * Returns:
             * {DOMElement} A new DOM Image of this icon set at the location passed-in
             */
            draw: function (px) {
                uOpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,
                    null,
                    null,
                    this.size,
                    this.url,
                    "absolute");
                this.moveTo(px);
                return this.imageDiv;
            },
 
            /**
             * Method: erase
             * Erase the underlying image element.
             */
            erase: function () {
                if (this.imageDiv != null && this.imageDiv.parentNode != null) {
                    uOpenLayers.Element.remove(this.imageDiv);
                }
            },
 
            /**
             * Method: setOpacity
             * Change the icon's opacity
             *
             * Parameters:
             * opacity - {float}
             */
            setOpacity: function (opacity) {
                uOpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null,
                    null, null, null, null, opacity);
 
            },
 
            /**
             * Method: moveTo
             * move icon to passed in px.
             *
             * Parameters:
             * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
             * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
             */
            moveTo: function (px) {
                //if no px passed in, use stored location
                if (px != null) {
                    this.px = px;
                }
 
                if (this.imageDiv != null) {
                    if (this.px == null) {
                        this.display(false);
                    } else {
                        if (this.calculateOffset) {
                            this.offset = this.calculateOffset(this.size);
                        }
                        uOpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                            x: this.px.x + this.offset.x,
                            y: this.px.y + this.offset.y
                        });
                    }
                }
            },
 
            /**
             * Method: display
             * Hide or show the icon
             *
             * Parameters:
             * display - {Boolean}
             */
            display: function (display) {
                this.imageDiv.style.display = (display) ? "" : "none";
            },
 
 
            /**
             * APIMethod: isDrawn
             *
             * Returns:
             * {Boolean} Whether or not the icon is drawn.
             */
            isDrawn: function () {
                // nodeType 11 for ie, whose nodes *always* have a parentNode
                // (of type document fragment)
                var isDrawn = (this.imageDiv && this.imageDiv.parentNode &&
                    (this.imageDiv.parentNode.nodeType != 11));
 
                return isDrawn;
            },
 
            CLASS_NAME: "OpenLayers.Icon"
        });
    }
 
    function addQuadKeyLayer() {
        if (uOpenLayers.Layer.QuadKey) return;
        uOpenLayers.Layer.QuadKey = uOpenLayers.Class(uOpenLayers.Layer.Grid, {
            isBaseLayer: false,
            sphericalMercator: false,
            zoomOffset: 0,
            serverResolutions: null,
 
            /**
             * Constructor: OpenLayers.Layer.XYZ
             *
             * Parameters:
             * name - {String}
             * url - {String}
             * options - {Object} Hashtable of extra options to tag onto the layer
             */
            initialize: function (name, url, options) {
                if (options && options.sphericalMercator || this.sphericalMercator) {
                    options = uOpenLayers.Util.extend({
                        projection: "EPSG:900913",
                        numZoomLevels: 19
                    }, options);
                }
                uOpenLayers.Layer.Grid.prototype.initialize.apply(this, [
                    name || this.name, url || this.url, {}, options
                ]);
            },
 
            /**
             * APIMethod: clone
             * Create a clone of this layer
             *
             * Parameters:
             * obj - {Object} Is this ever used?
             *
             * Returns:
             * {<OpenLayers.Layer.XYZ>} An exact clone of this OpenLayers.Layer.XYZ
             */
            clone: function (obj) {
                if (obj == null) {
                    obj = new uOpenLayers.Layer.QuadKey(this.name,
                        this.url,
                        this.getOptions());
                }
 
                //get all additions from superclasses
                obj = uOpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
 
                return obj;
            },
 
            /**
             * Method: getURL
             *
             * Parameters:
             * bounds - {<OpenLayers.Bounds>}
             *
             * Returns:
             * {String} A string with the layer's url and parameters and also the
             *          passed-in bounds and appropriate tile size specified as
             *          parameters
             */
            getURL: function (bounds) {
                let xyz = this.getXYZ(bounds);
                let url = this.url;
 
                let key = tile2key(xyz.x, xyz.y, xyz.z);
 
                return uOpenLayers.String.format(url, {key});
            },
 
            /**
             * Method: getXYZ
             * Calculates x, y and z for the given bounds.
             *
             * Parameters:
             * bounds - {<OpenLayers.Bounds>}
             *
             * Returns:
             * {Object} - an object with x, y and z properties.
             */
            getXYZ: function (bounds) {
                let res = this.getServerResolution();
                let x = Math.round((bounds.left - this.maxExtent.left) /
                    (res * this.tileSize.w));
                let y = Math.round((this.maxExtent.top - bounds.top) /
                    (res * this.tileSize.h));
                let z = this.getServerZoom();
 
                if (this.wrapDateLine) {
                    let limit = Math.pow(2, z);
                    x = ((x % limit) + limit) % limit;
                }
 
                return {'x': x, 'y': y, 'z': z};
            },
 
            setMap: function (map) {
                uOpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
                if (!this.tileOrigin) {
                    this.tileOrigin = new uOpenLayers.LonLat(this.maxExtent.left,
                        this.maxExtent.bottom);
                }
            },
 
            CLASS_NAME: "OpenLayers.Layer.QuadKey"
        });
    }
 
    function addInfoPopup(Layer) {
        // Style sheet for buttons
        var style = document.createElement('style')
            style.type = 'text/css'
            style.append('#btfDiv td { white-space: nowrap; }')
        document.getElementsByTagName('head')[0].appendChild(style)
 
        // create a new div to display the Marker details floaty-box
        btfDiv = document.createElement('div');
        btfDiv.id = "btfDiv";
        btfDiv.style.position = 'absolute';
        btfDiv.style.visibility = 'hidden';
        btfDiv.style.top = '0';
        btfDiv.style.left = '0';
        btfDiv.style.zIndex = 10000;
        btfDiv.style.backgroundColor = 'aliceblue';
        btfDiv.style.borderWidth = '3px';
        btfDiv.style.borderStyle = 'solid';
        btfDiv.style.borderRadius = '10px';
        btfDiv.style.boxShadow = '5px 5px 10px Silver';
        btfDiv.style.padding = '4px';
        document.body.appendChild(btfDiv);
        btfDiv.addEventListener("mouseenter", enterPopup, false);
        btfDiv.addEventListener("mouseleave", leavePopup, false);
    }
 
    function enterPopup(params) {
        mouseInPopup = true;
    }
 
    function leavePopup(params) {
        mouseInPopup = false;
        hidePopup();
    }
 
    function toISOLocal(d) {
        var z  = n =>  ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off > 0? '-' : '+';
        off = Math.abs(off);
 
        return d.getFullYear() + '-'
               + z(d.getMonth()+1) + '-' +
               z(d.getDate()) + ' ' +
               z(d.getHours()) + ':'  +
               z(d.getMinutes()) + ':' +
               z(d.getSeconds()); // + '.' +
            //    zz(d.getMilliseconds()) +
            //    sign + z(off/60|0) + ':' + z(off%60);
    }
 
    function getPopupText(poi) {
        let html = `<b>${poi.d}</b><br>\n`;
        html += "<table>";
        html += poi.c  ? `<tr><td>`+I18n.t(prefix).reason+` &nbsp;</td><td>${poi.c}</td></tr>\n` : ""
        html += poi.r  ? `<tr><td>`+I18n.t(prefix).street+` &nbsp;</td><td>${poi.r}</td></tr>\n` : ""
        html += poi.f  ? `<tr><td>`+I18n.t(prefix).from+` &nbsp;</td><td>${poi.f}</td></tr>\n` : ""
        html += poi.t  ? `<tr><td>`+I18n.t(prefix).direction+` &nbsp;</td><td>${poi.t}</td></tr>\n` : ""
        html += poi.l  ? `<tr><td>`+I18n.t(prefix).distance+` &nbsp;</td><td>${(1000 <= poi.l ) ? `${(poi.l / 1000).toFixed(1)} km` : `${poi.l} m`}</td></tr>\n` : ""
        html += poi.sd  ? `<tr><td>`+I18n.t(prefix).at+` &nbsp;</td><td>${toISOLocal(new Date(poi.sd))}</td></tr>\n` : ""
        html += poi.ed  ? `<tr><td>`+I18n.t(prefix).till+` &nbsp;</td><td>${toISOLocal(new Date(poi.ed))}</td></tr>\n` : ""
        html += "</table>";
        return getTrustedHTML(html);
    }
 
    function getTrustedHTML(htmlIn) {
        if (typeof trustedTypes === "undefined") {
            return htmlIn;
        } else {
            const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape});
            return escapeHTMLPolicy.createHTML(htmlIn);
        }
    }
 
    function showPopup(poi, element) {
        if (popupID != poi.id) { return; }
 
        btfDiv.style.visibility = "hidden";
        btfDiv.style.top = "0px";
        btfDiv.style.left = "0px";
        btfDiv.style.height = "auto";
        btfDiv.style.width = "auto";
        btfDiv.style.overflow = "auto";
        btfDiv.innerHTML = getPopupText(poi);
        // limit popup size
        let cw = parseInt(btfDiv.clientWidth);
        if(cw > (window.innerWidth * 0.45)) {
            cw = (window.innerWidth * 0.45);
            btfDiv.style.width = cw+'px';
        }
        let ch = parseInt(btfDiv.clientHeight);
        if(ch > (window.innerHeight * 0.80))
        {
            ch = (window.innerHeight * 0.80);
            btfDiv.style.height = ch+'px';
            btfDiv.style.overflow = 'scroll';
        }
        // set popup position
        let iconRect = element.getBoundingClientRect();
        let viewPortRect = iconsLayer.div.offsetParent.offsetParent.getBoundingClientRect();
        let left = iconRect.right + btfDivOffset;
        if (viewPortRect.right-10 < iconRect.right + cw) {
            left = iconRect.left - btfDivOffset - cw;
        }
        let top = iconRect.bottom + btfDivOffset;
        if (viewPortRect.bottom -100 < iconRect.bottom + ch) {
            top = iconRect.top - btfDivOffset - ch;
        }
        btfDiv.style.top = top + "px";
        btfDiv.style.left = left + "px";
        btfDiv.style.visibility = "visible";
        btfDivVisible = true;
    }
 
    function hidePopup() {
        if (! mouseInPopup) {
            btfDiv.style.visibility = "hidden";
            btfDivVisible = false;
        }
    }
 
    function checkTypeEnabled(type) {
        let myConf = JSON.parse(localStorage[prefix]);
        return myConf[ type ];
    }
 
    function requestClosures() {
        if (iconsLayer.getVisibility()) {
            let extent = uWaze.map.getExtent();
            let z = uWaze.map.getZoom();
            if (z >= 11) {
                let oh = 500;
                let pLB = new uOpenLayers.Geometry.Point(extent.left - oh, extent.bottom - oh).transform(epsg900913, epsg4326);
                let pRT = new uOpenLayers.Geometry.Point(extent.right + oh, extent.top + oh).transform(epsg900913, epsg4326);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://mydrive.api-system.tomtom.com/traffic/services/4/incidentDetails/s2/${pLB.y},${pRT.x},${pRT.y},${pLB.x}/${z}/-1/json?key=sATA9OwG11zrMKQcCxR3eSEjj2n8Jsrg&projection=EPSG4326&language=${language}`,
                    onload: function (response) {
                        let resp = JSON.parse(response.responseText);
 
                        iconsLayer.clearMarkers();
                        for (let poi of resp.tm.poi) {
                            let icontype = 'others';
                            let img = 'https://upload.wikimedia.org/wikipedia/commons/0/02/Zeichen_101_-_Gefahrstelle%2C_StVO_1970.svg';
                            mtotypes.some(element => {
                                let regex = I18n.t(`${prefix}.regex`)[element.type];
                                if (poi.d.match(regex)) {
                                    icontype = element.type;
                                    img = element.icon;
                                    return true;
                                }
                            });
 
                            if (!checkTypeEnabled(icontype)) {
                                continue;
                            }
 
                            let icon = new uOpenLayers.Icon(img, {w: 35, h: 35});
                            let marker = new uOpenLayers.Marker(new uOpenLayers.LonLat(poi.p.x, poi.p.y).transform(epsg4326, epsg900913), icon);
 
                            marker.events.register('mousedown', marker, function (evt) {
                                showPopup(poi, evt.element);
                                uOpenLayers.Event.stop(evt);
                            });
                            marker.events.register('mouseover', marker, function (evt) {
                                popupID = poi.id;
                                setTimeout(showPopup, 500, poi, evt.element);
                                uOpenLayers.Event.stop(evt);
                            });
                            marker.events.register('mouseout', marker, function (evt) {
                                popupID = false;
                                if (btfDivVisible) {
                                    mouseInPopup = false;
                                    setTimeout(hidePopup,200);
                                    uOpenLayers.Event.stop(evt);
                                }
                            })
 
                            iconsLayer.addMarker(marker);
                        }
                    }
                });
            } else {
                iconsLayer.clearMarkers();
            }
        }
    }
 
    function getCheckbox(idSuffix, iconURL, labelText, title, divCss = {}, labelCss = {}) {
		let id = `${prefix}-${idSuffix}`;
		return $('<div>').append(
			$('<label>', { class: "mto-container" }).append(
                $('<input>', { id: id, type: 'checkbox', title: title, class: `${prefix}Checkbox` }),
                $(`<img src="${iconURL}">`),
                document.createTextNode(labelText)
            ).css(labelCss)
		).css(divCss);
	}
 
    function checkboxChanged(evt) {
        let myConf = JSON.parse(localStorage[prefix]);
        myConf[ evt.target.id.replace(`${prefix}-`,'') ] = evt.target.checked;
        localStorage[prefix] = JSON.stringify(myConf);
        // link panel-checkbox with layer-checkbox
        if (evt.target == panelCheckBoxElement) {
            $(layerCheckBoxElement).click();
        }
    }
 
    function addSidepanel() {
        let userTabs = document.getElementById('user-info');
        let navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0];
        let tabContent = document.getElementsByClassName('tab-content', userTabs)[0];
        let newtab = '';
 
        newtab = document.createElement('li');
        newtab.innerHTML = getTrustedHTML(`<a href="#sidepanel-${prefix}" data-toggle="tab" title="MSN Baustellen & Traffic Overlay">${prefix}</a>`);
        navTabs.appendChild(newtab);
 
        // add new box to left of the map
        let addon = document.createElement('section');
        addon.id = `sidepanel-${prefix}`;
        addon.className = 'tab-pane';
        tabContent.appendChild(addon);
 
        // add title
        let sidepanel = $(addon);
        sidepanel.append(
            $('<div>', {style:"margin-bottom: 0.5em"}).append(
                $(`<a href="${scriptURL}" target="_blank">${name} V${version}</a>`)
            )
        );
 
        // add enable-box
        sidepanel.append(
            getCheckbox(`enable`, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", I18n.t(`${prefix}.enable`),"",{margin:"0.5em 0"}),
            $("<hr>", {style: "margin: 1em 0"})
        );
        panelCheckBoxElement = document.getElementById(`${prefix}-enable`);
 
        // add type-boxes
        mtotypes.forEach(element => {
            let icon = $(`<img href="$(element.icon)">`)
            sidepanel.append(getCheckbox(element.type, element.icon, I18n.t(`${prefix}.${element.type}`),""));
        });
 
        let myConf = JSON.parse(localStorage[prefix]);
        let boxes = $(`.${prefix}Checkbox`).each(function () {
            let id = $(this).attr("id").replace(`${prefix}-`,'');
            $(this)
                .prop("checked", myConf[id])
                .change(checkboxChanged);
        });
    }
 
    function initLocalStorage() {
        if (undefined == localStorage[prefix]) {
            let myConf = {};
            mtotypes.forEach(element => {
                myConf[element.type] = true;
            });
            // integrate old config
            if (localStorage.DrawMSNTrafficOverlay) {
                myConf.enable = localStorage.DrawMSNTrafficOverlay;
                delete localStorage.DrawMSNTrafficOverlay;
            } else {
                myConf.enable = true;
            }
            localStorage[prefix] = JSON.stringify(myConf);
        }
    }
 
    function toggleLayer(e, checkbox, MSNLayer, iconsLayer) {
        let myConf = JSON.parse(localStorage[prefix]);
        MSNLayer.setVisibility(e.target.checked && checkbox.checked);
        iconsLayer.setVisibility(e.target.checked && checkbox.checked);
        myConf.enable = checkbox.checked;
        localStorage[prefix] = JSON.stringify(myConf);
        // sync sidepanel checkbox
        panelCheckBoxElement.checked = checkbox.checked;
    }
 
    function MSN_traffic_init() {
        initLocalStorage();
        loadTranslations();
        insertCSS();
        addSidepanel();
        addQuadKeyLayer();
        addIcon();
 
        let myConf = JSON.parse(localStorage[prefix]);
 
        let MSNLayer = new uOpenLayers.Layer.QuadKey("MSN Traffic", 'https://t0-traffic.tiles.virtualearth.net/comp/ch/${key}?it=Z,TF&n=z', {
            isBaseLayer: false,
            uniqueName: '__DrawMSNTraffic',
            tileSize: new uOpenLayers.Size(256, 256),
            transitionEffect: 'resize',
            displayInLayerSwitcher: false,
            opacity: 0.64,
            visibility: false
        });
        epsg900913 = new uOpenLayers.Projection("EPSG:900913");
        epsg4326 = new uOpenLayers.Projection("EPSG:4326");
        iconsLayer = new uOpenLayers.Layer.Markers("MSN Traffic Icons", {
            displayInLayerSwitcher: false,
            uniqueName: "__DrawMSNTrafficIcons"
        });
        addInfoPopup(iconsLayer);
        uWaze.map.addLayer(MSNLayer);
        uWaze.map.addLayer(iconsLayer);
        MSNLayer.setVisibility(myConf.enable);
        iconsLayer.setVisibility(myConf.enable);
        let roadGroupSelector = document.getElementById('layer-switcher-group_road');
        if (roadGroupSelector != null) {
            let roadGroup = roadGroupSelector.parentNode.parentNode.getElementsByTagName("UL")[0];
            let toggler = document.createElement('li');
            let checkbox = document.createElement("wz-checkbox");
            checkbox.id = 'layer-switcher-MSN-traffic';
            checkbox.className = "hydrated";
            checkbox.disabled = !roadGroupSelector.checked;
            checkbox.checked = MSNLayer.getVisibility();
            checkbox.appendChild(document.createTextNode("MSN Traffic Overlay"));
            toggler.appendChild(checkbox);
            roadGroup.appendChild(toggler);
            checkbox.addEventListener('change', function (e) {
                toggleLayer(e, checkbox, MSNLayer, iconsLayer);
            });
            roadGroupSelector.addEventListener('change', function (e) {
                toggleLayer(e, checkbox, MSNLayer, iconsLayer);
                checkbox.disabled = !e.target.checked;
            });
            layerCheckBoxElement = checkbox;
        }
 
        uWaze.map.events.register("zoomend", null, requestClosures);
        uWaze.map.events.register("moveend", null, requestClosures);
        requestClosures();
    }
 
    function MSN_traffic_bootstrap() {
        uWaze = window.W || unsafeWindow.W;
        uOpenLayers = window.OpenLayers || unsafeWindow.OpenLayers;
        if (typeof (uOpenLayers) === 'undefined' || typeof (uWaze) === 'undefined' || typeof (uWaze.map) === 'undefined' || document.querySelector('.list-unstyled.togglers .group') === null) {
            setTimeout(MSN_traffic_bootstrap, 500);
        } else {
            MSN_traffic_init();
        }
    }
 
 
    MSN_traffic_bootstrap();
})();