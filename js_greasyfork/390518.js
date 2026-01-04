// ==UserScript==
// @name         WME Yandex Layer mod uranik (ThanksBunches update)
// @namespace    https://github.com/Shibalba/waze-yandex-layer-mod/
// @version      0.24
// @description  Добавление слоя с Yandex картами с автозагрузкой слоя в редакторе
// @author       ThanksBunches
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://editor-beta.waze.com/editor*
// @include      https://editor-beta.waze.com/*/editor*
// @match        https://www.waze.com/ru/editor
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390518/WME%20Yandex%20Layer%20mod%20uranik%20%28ThanksBunches%20update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390518/WME%20Yandex%20Layer%20mod%20uranik%20%28ThanksBunches%20update%29.meta.js
// ==/UserScript==

(function () {
    //var WM = {};
    OpenLayers.Layer.Yandex = OpenLayers.Class(
        OpenLayers.Layer.EventPane,
        OpenLayers.Layer.FixedZoomLevels, {
            MIN_ZOOM_LEVEL: 0,
            MAX_ZOOM_LEVEL: 20,
            attribution: '<a href="http://beta-maps.yandex.ru"  class="mapLogo" title="Yandex maps"><img src="https://api-maps.yandex.ru/i/0.2/YMaps-logo.png" alt="Yandex logo" /></a>',
            type: null,
            sphericalMercator: false,
            dragObject: null,
            initialize: function (name, options) {
                OpenLayers.Layer.EventPane.prototype.initialize.apply(this, arguments);
                OpenLayers.Layer.FixedZoomLevels.prototype.initialize.apply(this,
                    arguments);
                this.addContainerPxFunction();
                if (this.sphericalMercator) {
                    OpenLayers.Util.extend(this, OpenLayers.Layer.SphericalMercator);
                    this.initMercatorParameters();
                }
            },

            loadMapObject: function () {
                try {
                    this.mapObject = new YMaps.Map(this.div);
                    this.mapObject.disableDragging();
                    this.dragPanMapObject = null;
                } catch (e) {
                    OpenLayers.Console.error(e);
                }

            },

            setMap: function (map) {
                OpenLayers.Layer.EventPane.prototype.setMap.apply(this, arguments);

                if (this.type !== null) {
                    this.map.events.register("moveend", this, this.setMapType);
                }
            },

            setMapType2: function (type) {
                this.mapObject.setType(type);
            },

            setMapType: function () {
                if (this.mapObject.getCenter() != null) {
                    this.mapObject.setType(this.type);//setType is function of YMaps.Map
                    this.map.events.unregister("moveend", this, this.setType);
                }
            },

            onMapResize() {
                if (this.visibility) {
                    this.mapObject.redraw();
                } else {
                    this.windowResized = true;
                }
            },


            getOLBoundsFromMapObjectBounds: function (moBounds) {
                var olBounds = null;
                if (moBounds != null) {
                    var sw = moBounds.getSouthWest();
                    var ne = moBounds.getNorthEast();
                    if (this.sphericalMercator) {
                        sw = this.forwardMercator(sw.lng(), sw.lat());
                        ne = this.forwardMercator(ne.lng(), ne.lat());
                    } else {
                        sw = new OpenLayers.LonLat(sw.lng(), sw.lat());
                        ne = new OpenLayers.LonLat(ne.lng(), ne.lat());
                    }
                    olBounds = new OpenLayers.Bounds(sw.lon,
                        sw.lat,
                        ne.lon,
                        ne.lat);
                }
                return olBounds;
            },

            getMapObjectBoundsFromOLBounds: function (olBounds) {
                var moBounds = null;
                if (olBounds != null) {
                    var sw = this.sphericalMercator ?
                        this.inverseMercator(olBounds.bottom, olBounds.left) :
                        new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
                    var ne = this.sphericalMercator ?
                        this.inverseMercator(olBounds.top, olBounds.right) :
                        new OpenLayers.LonLat(olBounds.top, olBounds.right);
                    moBounds = new YMaps.GeoBounds(new YMaps.GeoPoint(sw.lon, sw.lat),
                        new YMaps.GeoPoint(ne.lon, ne.lat));
                }
                return moBounds;
            },

            addContainerPxFunction: function () {
                if ((typeof YMaps.Map != "undefined") && !YMaps.Map.prototype.fromLatLngToContainerPixel) {

                    YMaps.Map.prototype.fromLatLngToContainerPixel = function (geoPoint) {
                        // first we translate into "DivPixel"
                        var divPoint = this.fromLatLngToDivPixel(geoPoint);
                        // locate the sliding "Div" div
                        var div = this.getContainer().firstChild.firstChild;
                        //adjust by the offset of "Div"
                        divPoint.x += div.offsetLeft;
                        divPoint.y += div.offsetTop;
                        return divPoint;
                    };
                }
            },

            getWarningHTML: function () {
                return OpenLayers.i18n("yandexWarning");
            },

            setMapObjectCenter: function (center, zoom) {
                this.mapObject.setCenter(center, zoom);
            },

            getMapObjectCenter: function () {
                return this.mapObject.getCenter();
            },
            getMapObjectZoom: function () {
                return this.mapObject.getZoom();


            },


            getMapObjectLonLatFromMapObjectPixel: function (moPixel) {
                //return this.mapObject.fromContainerPixelToLatLng(moPixel);
                return this.mapObject.converter.mapPixelsToCoordinates(moPixel);
            },

            getMapObjectPixelFromMapObjectLonLat: function (moLonLat) {
                return this.mapObject.converter.coordinatesToMapPixels(moLonLat);
            },

            getMapObjectZoomFromMapObjectBounds: function (moBounds) {
                this.mapObject.setBounds(moBounds);

                return this.mapObject.getZoom();
            },

            getLongitudeFromMapObjectLonLat: function (moLonLat) {
                return this.sphericalMercator ?
                    this.forwardMercator(moLonLat.getLng(), moLonLat.getLat()).lon :
                    moLonLat.getLng();
            },

            getLatitudeFromMapObjectLonLat: function (moLonLat) {
                var lat = this.sphericalMercator ?
                    this.forwardMercator(moLonLat.getLng(), moLonLat.getLat()).lat :
                    moLonLat.getLat();
                return lat;
            },

            getMapObjectLonLatFromLonLat: function (lon, lat) {
                var gLatLng;
                if (this.sphericalMercator) {
                    var lonlat = this.inverseMercator(lon, lat);
                    gLatLng = new YMaps.GeoPoint(lonlat.lon, lonlat.lat);
                } else {
                    gLatLng = new YMaps.GeoPoint(lon, lat);
                }
                return gLatLng;
            },

            getXFromMapObjectPixel: function (moPixel) {
                return moPixel.x;
            },

            getYFromMapObjectPixel: function (moPixel) {
                return moPixel.y;
            },

            getMapObjectPixelFromXY: function (x, y) {
                return new YMaps.Point(x, y);
            },

            CLASS_NAME: "OpenLayers.Layer.Yandex"
        });


    function startYa() {
        var evntObj = {},
            activeLayer = {},
            WM = window.Waze.map.olMap;
        var googleMapId = WM.layers.map(item => item.id).filter(item => item.indexOf("Google") > 0).join();


        var yandexAerialLayer = new OpenLayers.Layer.Yandex("Yandex Satellite", {
            type: YMaps.MapType.SATELLITE,
            sphericalMercator: true,
            numZoomLevels: 21,
            name: 'Yandex Satellite',
            uniqueName: "yandex_satellite",
        });
        var yandexMapLayer = new OpenLayers.Layer.Yandex("Yandex Map", {
            type: YMaps.MapType.MAP,
            sphericalMercator: true,
            numZoomLevels: 21,
            name: 'Yandex Map',
            uniqueName: "yandex_map",
        });

        WM.addLayer(yandexAerialLayer);

        yandexAerialLayer.setMapType2(YMaps.MapType.SATELLITE);
        WM.setLayerIndex(yandexAerialLayer, 1);

        WM.addLayer(yandexMapLayer);
        WM.setLayerIndex(yandexMapLayer, 2);

        WM.events.register("zoomend", map, function () {
            if (activeLayer.name == "Yandex Satellite" || activeLayer.name == "Yandex Map") {
                activeLayer.redraw();
                update();
            }
        });

        WM.events.register("moveend", map, function () {
            if (activeLayer.name == "Yandex Satellite" || activeLayer.name == "Yandex Map") {
                activeLayer.redraw();
                update();
            }
        });


        WM.events.register("changelayer", evntObj, changeLayer);

        function changeLayer(e) {
            if (e.property == "visibility" && e.layer.visibility && e.layer.isBaseLayer) {
                activeLayer = e.layer;
                if (activeLayer.name == "Yandex Satellite" || activeLayer.name == "Yandex Map") {
                    if (activeLayer.name == "Yandex Satellite") {
                        WM.getLayer(yandexMapLayer.id).setVisibility(false);
                        WM.getLayer(googleMapId).setVisibility(false);
                    } else {
                        ;
                        WM.getLayer(yandexAerialLayer.id).setVisibility(false);
                        WM.getLayer(googleMapId).setVisibility(false);
                    }
                    activeLayer.map.$map.resize();
                } else if (activeLayer.id == googleMapId) {
                    WM.getLayer(yandexAerialLayer.id).setVisibility(false);
                    WM.getLayer(yandexMapLayer.id).setVisibility(false);
                }
            }
        }


        var buttonContainer = $('ul.collapsible-GROUP_DISPLAY');

        buttonContainer.prepend('<li><wz-checkbox id="layer-switcher-item_yandex_map" class="hydrated" checked=""> Yandex map </wz-checkbox></li>');
        buttonContainer.prepend('<li><wz-checkbox id="layer-switcher-item_yandex_satellite" class="hydrated" checked=""> Yandex Satellite </wz-checkbox></li>');

        buttonContainer.on('click', '#layer-switcher-item_yandex_map', function (event) {
            if ($(this)[0].checked) {
                buttonContainer.find('#layer-switcher-item_yandex_satellite')[0].checked = false;
                buttonContainer.find('#layer-switcher-item_satellite_imagery')[0].checked = false;
                WM.getLayer(yandexMapLayer.id).setVisibility(true);
//               WM.getLayer(yandexAerialLayer.id).setVisibility(false);
//               WM.getLayer(googleMapId).setVisibility(false);
            } else {
                WM.getLayer(yandexMapLayer.id).setVisibility(false);
                if ($("#layer-switcher-item_satellite_imagery").is(":not(:checked)")) {
                    $("#layer-switcher-item_satellite_imagery").click();
                    WM.getLayer(googleMapId).setVisibility(true);
                }
            }
        });

        buttonContainer.on('click', '#layer-switcher-item_yandex_satellite', function (event) {
            if ($(this)[0].checked) {
                WM.getLayer(yandexAerialLayer.id).setVisibility(true);
                buttonContainer.find('#layer-switcher-item_yandex_map')[0].checked = false;
                buttonContainer.find('#layer-switcher-item_satellite_imagery')[0].checked = false;
            } else {
                WM.getLayer(yandexAerialLayer.id).setVisibility(false);
            }
        });

        buttonContainer.on('click', '#layer-switcher-item_satellite_imagery', function (event) {
            if ($(this)[0].checked) {
                buttonContainer.find('#layer-switcher-item_yandex_map')[0].checked = false;
                buttonContainer.find('#layer-switcher-item_yandex_satellite')[0].checked = false;
                WM.getLayer(googleMapId).setVisibility(true);
            }
        });


        var sx = $('#toolbar').find('#WAS_sx'),
            sy = $('#toolbar').find('#WAS_sy');

        sx.change(update);
        sy.change(update);


        function update() {
            if (activeLayer.name == "Yandex Satellite" || activeLayer.name == "Yandex Map") {

                var ipu = OpenLayers.INCHES_PER_UNIT;
                var metersPerPixel = WM.getResolution() * ipu['m'] / ipu[WM.getUnits()];
                var shiftX = parseInt(sx.val(), 10);
                var shiftY = parseInt(sy.val(), 10);

                activeLayer.div.style.left = Math.round(shiftX / metersPerPixel) + 'px';
                activeLayer.div.style.top = Math.round(shiftY / metersPerPixel) + 'px';
            }
        }

    }


    $(function () {

        $.getScript("https://api-maps.yandex.ru/1.1/")
            .done(function (script, textStatus) {
                $.getScript("https://api-maps.yandex.ru/1.1/index.xml")
                    .done(function (script, textStatus) {
                        $.getScript("https://api-maps.yandex.ru/1.1/_YMaps.js?v=1.1.21-43")
                            .done(function (script, textStatus) {
                                startYa();
                                if ($("#layer-switcher-item_yandex_map").is(":not(:checked)")) {
                                    $("#layer-switcher-item_yandex_map").click();
                                }
                            });
                    });
            });
    });

})();
