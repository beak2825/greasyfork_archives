// ==UserScript==
// @name            geoportal.gov.pl layers for WME without translating PROXY
// @version         0.2.15.1
// @description     Displays layers from geoportal.gov.pl in WME
// @grant           none
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @include         https://editor-beta.waze.com*
// @copyright       2013-2018+, Patryk Ściborek, Paweł Pyrczak
// @run-at          document-end
// @namespace https://greasyfork.org/users/9996
// @downloadURL https://update.greasyfork.org/scripts/10611/geoportalgovpl%20layers%20for%20WME%20without%20translating%20PROXY.user.js
// @updateURL https://update.greasyfork.org/scripts/10611/geoportalgovpl%20layers%20for%20WME%20without%20translating%20PROXY.meta.js
// ==/UserScript==

/**
 * Source code: https://github.com/TKr/WME-geoportal
 */


/* Changelog:
 *
 *  0.2.15.1 - fixes window.Waze/window.W deprecation warnings
 *  0.2.15.0 - fixes layers zIndex switching
 *  0.2.14.1 - fixes include addresses
 *  0.2.14.0 - fixed adding toggle on layer list (new WME version)
 */
function GEOPORTAL_bootstrap()
{
    console.log("Geoportal: injecting code to page.");
    //use "dirty" but effective method with injection to document
    var DLscript = document.createElement("script");
    DLscript.textContent =''+
    geoportal_run.toString()+'unsafeWindow=window; \n'+
        'geoportal_run() \n';
    DLscript.setAttribute("type", "application/javascript");
    document.body.appendChild(DLscript);
}

function geoportal_run() {
    GEOPORTAL = { ver: "0.2.15.1" };
    GEOPORTAL.init = function(w)
    {
        console.log('Geoportal: Version ' + this.ver + ' init start');

        wms_service_orto="http://mapy.geoportal.gov.pl/wss/service/img/guest/ORTO/MapServer/WMSServer?"; // layer: Raster
        wms_service_orto_2="http://sdi.geoportal.gov.pl/wms_orto/wmservice.aspx?"; // layer: ORTOFOTO,ORTOFOTO_ISOK
        wms_service_prng="http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_PRNG_WMS/MapServer/WMSServer?dpi=130&"; // nazwy
        wms_service_bud="http://mapy.geoportal.gov.pl/wss/service/pub/guest/G2_BDOT_BUD_2010/MapServer/WMSServer?"; // budynki
        wms_bdot = "http://mapy.geoportal.gov.pl/wss/service/pub/guest/kompozycjaG2_TBD_WMS/MapServer/WMSServer?dpi=130&";
        var my_wazeMap = w;
        if (typeof my_wazeMap == undefined) my_wazeMap = window.W.map;

        var epsg900913 = new window.OpenLayers.Projection("EPSG:900913");
        var epsg4326 =  new window.OpenLayers.Projection("EPSG:4326");
        var tileSizeG = new window.OpenLayers.Size(512,512);

        ConvTo2180 = function(p) {
            var D2R = 0.01745329251994329577;
            var mlfn = function(e0, e1, e2, e3, phi) {
                return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
            }
            var contants = {
                a: 6378137.0,
                rf: 298.257222101,
                x0 : 500000,
                y0 : -5300000,
                k0 : 0.9993,
                init : function() {
                    var D2R = 0.01745329251994329577;
                    this.lon0 = 19.0 * D2R;
                    this.lat0 = 0 * D2R;
                    this.b = ((1.0 - 1.0 / this.rf) * this.a);
                    this.ep2 = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.b,2));
                    this.es = ((Math.pow(this.a,2) - Math.pow(this.b,2)) / Math.pow(this.a,2));
                    this.e0 =  (1 - 0.25 * this.es * (1 + this.es / 16 * (3 + 1.25 * this.es)));
                    this.e1 = (0.375 * this.es * (1 + 0.25 * this.es * (1 + 0.46875 * this.es)));
                    this.e2 = (0.05859375 * this.es * this.es * (1 + 0.75 * this.es));
                    this.e3 = (this.es * this.es * this.es * (35 / 3072));
                    this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
                }
            };
            contants.init();
            var lon = p.lon * D2R;
            var lat = p.lat * D2R;
            var a0 = 0;
            var b0 = 0;
            var k0 = 0.9993;
            var lon0 = 19.0 * D2R;
            var lat0 = 0 * D2R;
            var delta_lon = lon - lon0;
            var slon = (delta_lon < 0) ? -1 : 1;
            var delta_lon = (Math.abs(delta_lon) < Math.PI) ? delta_lon : (delta_lon - (slon * (Math.PI * 2)));
            var con;
            var x, y;
            var sin_phi = Math.sin(lat);
            var cos_phi = Math.cos(lat);
            var sphere = false;
            if (sphere) {
                var b = cos_phi * Math.sin(delta_lon);
                if ((Math.abs(Math.abs(b) - 1)) < 0.0000000001) {
                    return (93);
                } else {
                    x = 0.5 * a0 * k0 * Math.log((1 + b) / (1 - b));
                    con = Math.acos(cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - b * b));
                    if (lat < 0) {
                        con = -con;
                    }
                    y = a0 * k0 * (con - lat0);
                }
            } else {
                var al = cos_phi * delta_lon;
                var als = Math.pow(al, 2);
                var c = contants.ep2 * Math.pow(cos_phi, 2);
                var tq = Math.tan(lat);
                var t = Math.pow(tq, 2);
                con = 1 - contants.es * Math.pow(sin_phi, 2);
                var n = contants.a / Math.sqrt(con);
                var ml = contants.a * mlfn(contants.e0, contants.e1, contants.e2, contants.e3, lat);
                x = contants.k0 * n * al * (1 + als / 6 * (1 - t + c + als / 20 * (5 - 18 * t + Math.pow(t, 2) + 72 * c - 58 * contants.ep2))) + contants.x0;
                y = contants.k0 * (ml - contants.ml0 + n * tq * (als * (0.5 + als / 24 * (5 - t + 9 * c + 4 * Math.pow(c, 2) + als / 30 * (61 - 58 * t + Math.pow(t, 2) + 600 * c - 330 * contants.ep2))))) + contants.y0;
            }
            p.lon = x;
            p.lat = y;
            return p;
        };

        getUrl4326 = function (bounds) {
            /* this function is modified Openlayer WMS CLASS part */
            /* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
            * full list of contributors). Published under the 2-clause BSD license.
            * See license.txt in the OpenLayers distribution or repository for the
            * full text of the license. */
            bounds = bounds.clone(); // Zrobione dlatego że tranformacja była dziedziczona do parenta i się sypało aż niemiło
            bounds = this.adjustBounds(bounds);

            var imageSize = this.getImageSize(bounds);
            var newParams = {};
            bounds.transform(this.epsg900913,this.epsg4326);
            if (this.ep2180) {
                bounds = bounds.clone();
                a={lat: bounds.bottom , lon: bounds.right}
                b={lat: bounds.top, lon: bounds.left}
                a=this.ConvTo2180(a);
                b=this.ConvTo2180(b);

                bounds.bottom = a.lat;
                bounds.right = a.lon;
                bounds.top = b.lat;
                bounds.left = b.lon;
            }
            // WMS 1.3 introduced axis order
            var reverseAxisOrder = this.reverseAxisOrder();
            newParams.BBOX = this.encodeBBOX ?
                bounds.toBBOX(null, reverseAxisOrder) :
                bounds.toArray(reverseAxisOrder);
            newParams.WIDTH = imageSize.w;
            newParams.HEIGHT = imageSize.h;
            var requestString = this.getFullRequestString(newParams);
            return requestString;
        };

        getFullRequestString4326 = function(newParams, altUrl) {
            /* this function is modified Openlayer WMS CLASS part */
            /* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
            * full list of contributors). Published under the 2-clause BSD license.
            * See license.txt in the OpenLayers distribution or repository for the
            * full text of the license. */
            var mapProjection = this.map.getProjectionObject();
            var projectionCode = this.projection.getCode();
            var value = (projectionCode == "none") ? null : projectionCode;
            if (parseFloat(this.params.VERSION) >= 1.3) {
                this.params.CRS = value;
            } else {
                if (this.ep2180) {
                    this.params.SRS = "EPSG:2180"; //na sztywno najlepiej
                } else {
                    this.params.SRS = "EPSG:4326"; //na sztywno najlepiej
                }
            }

            if (typeof this.params.TRANSPARENT == "boolean") {
                newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
            }

            return window.OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                            this, arguments);
        }

        geoportalAddLayer = function(layer) {
            // Add layer entry in the new layer drawer
            var displayGroupSelector = document.getElementById('layer-switcher-group_display');
            if (displayGroupSelector != null) {
                var displayGroup = displayGroupSelector.parentNode.parentNode.querySelector('.children');
                var toggler = document.createElement('li');
                var togglerContainer = document.createElement('div');
                togglerContainer.className = 'controls-container toggler';
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'layer-switcher-geop_' + Math.random().toString(36).substring(7);
                checkbox.className = 'toggle';
                checkbox.addEventListener('click', function(e) {
                  layer.setVisibility(e.target.checked);
                });
                togglerContainer.appendChild(checkbox);
                var label = document.createElement('label');
                label.htmlFor = checkbox.id;
                var labelText = document.createElement('span');
                labelText.className = 'label-text';
                labelText.appendChild(document.createTextNode(layer.name));
                label.appendChild(labelText);
                togglerContainer.appendChild(label);
                toggler.appendChild(togglerContainer);
                displayGroup.appendChild(toggler);
            }
        }

        var geop_orto = new window.OpenLayers.Layer.WMS(
            "Geoportal - ortofoto",
            wms_service_orto,
            {
                layers: "Raster",
                format: "image/jpeg"
            },
            {
                tileSize: tileSizeG,
                isBaseLayer: false,
                visibility: false,
                transitionEffect: "resize",
                uniqueName: "orto1",
                epsg900913: epsg900913,
                epsg4326: epsg4326,
                getURL: getUrl4326,
                ConvTo2180: ConvTo2180,
                ep2180: false,
                getFullRequestString: getFullRequestString4326
            }
        );
        if ("undefined" != typeof I18n.translations.en) {
           I18n.translations.en.layers.name["orto1"] = "Geoportal - ortofoto";
        }

        if ("undefined" != typeof I18n.translations.pl) {
           I18n.translations.pl.layers.name["orto1"] = "Geoportal - ortofoto";
        }

        //geoportal_prng
        var geop_prng = new OpenLayers.Layer.WMS(
            "Geoportal - nazwy PRNG",
            wms_service_prng,
            {
                layers: "Wies,Miasto",
                transparent: "true",
                format: "image/png"
            },
            {
                tileSize: tileSizeG,
                isBaseLayer: false,
                visibility: false,
                uniqueName: "nazwy",
                epsg900913: epsg900913,
                epsg4326: epsg4326,
                getURL: getUrl4326,
                ConvTo2180: ConvTo2180,
                ep2180: false,
                getFullRequestString: getFullRequestString4326
            }
        );
        if ("undefined" != typeof I18n.translations.en) {
           I18n.translations.en.layers.name["nazwy"] = "Geoportal - nazwy PRNG";
        }

        if ("undefined" != typeof I18n.translations.pl) {
           I18n.translations.pl.layers.name["nazwy"] = "Geoportal - nazwy PRNG";
        }

        /// ,Zabudowa_A,Przem_gosp_A,KomplKom_A
        var geop_adresy2 = new OpenLayers.Layer.WMS(
            "Geoportal - adresy BDOT",
            wms_bdot,
            {
                layers: "BudHydro_A,Bud_A,BudSport_A,BudWys_A,BudCment_A,PktAdr_P,IUrzTechn_A,ZbTech_A",
                transparent: "true",
                format: "image/png32"
            },
            {
                tileSize: tileSizeG,
                isBaseLayer: false,
                visibility: false,
                uniqueName: "adresy2",
                epsg900913: epsg900913,
                epsg4326: epsg4326,
                getURL: getUrl4326,
                ConvTo2180: ConvTo2180,
                ep2180: true,
                getFullRequestString: getFullRequestString4326
            }
        );

        if ("undefined" != typeof I18n.translations.en) {
           I18n.translations.en.layers.name["adresy2"] = "Geoportal - adresy BDOT";
        }

        if ("undefined" != typeof I18n.translations.pl) {
           I18n.translations.pl.layers.name["adresy2"] = "Geoportal - adresy BDOT";
        }

        console.log('Geoportal: adding layers');
        if(my_wazeMap.getLayersByName("Geoportal - orto").length == 0)
        {
            my_wazeMap.addLayer(geop_orto);
            geoportalAddLayer(geop_orto);

            my_wazeMap.addLayer(geop_prng);
            geoportalAddLayer(geop_prng);

            my_wazeMap.addLayer(geop_adresy2);
            geoportalAddLayer(geop_adresy2);

            console.log('Geoportal: layers added');
            this.OrtoTimer();
        }
    }

    GEOPORTAL.OrtoTimer = function() {
        setTimeout(function(){
            var a = window.W.map.getLayersBy("uniqueName","orto1");
            if (a[0]) {
                a[0].setZIndex(3);
            }

            var google_map = window.W.map.getLayersBy("uniqueName","satellite_imagery");
            if (google_map[0]) {
                google_map[0].setZIndex(1); // mapy Googla
            }

            GEOPORTAL.OrtoTimer();
        },1000);
    }

    GEOPORTAL.initBootstrap = function() {
        try {
            if (document.getElementById('layer-switcher-group_display') != null) {
                this.init(window.W.map);
            } else {
                console.log("Geoportal: WME not initialized yet, trying again later.");
                setTimeout(function(){
                    GEOPORTAL.initBootstrap();
                },1000);
            }
        } catch (err) {
            console.log(err);
            console.log("Geoportal: WME not initialized yet, trying again later.");
            setTimeout(function(){
                GEOPORTAL.initBootstrap();
            },1000);
        }
    }
    GEOPORTAL.initBootstrap();
}
GEOPORTAL_bootstrap()

