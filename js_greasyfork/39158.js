// ==UserScript==
// @name         mMR West Bank overlay
// @namespace    https://greasyfork.org/users/45389
// @version      2018.03.04.001
// @description  Adds a region overlay for the 2018 West Bank (Israel) mMR
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      None!  You may reuse this code for whatever you want.
// @downloadURL https://update.greasyfork.org/scripts/39158/mMR%20West%20Bank%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/39158/mMR%20West%20Bank%20overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _fillOpacity = 0.2;
    var _color = "Magenta";
    var _raid_mapLayer;

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            InitMapRaidOverlay();
        } else {
            setTimeout(bootstrap, 500);
        }
    }

    bootstrap();

    function AddRaidPolygon(raidLayer,groupPoints,state1, state2){
        var mro_Map = Waze.map;
        var mro_OL = OpenLayers;

        var style = {
            strokeColor: _color,
            strokeOpacity: 0.30,
            strokeWidth: 3,
            fillColor: _color,
            fillOpacity: _fillOpacity,
            label: state1,
            labelOutlineColor: "Black",
            labelOutlineWidth: 3,
            fontSize: 14,
            fontColor: _color,
            fontOpacity: 0.85,
            fontWeight: "bold"
        };

        var attributes = {
            state1: state1,
            state2: state2
        };

        var pnt= [];
        for(let i=0;i<groupPoints.length;i++){
            let convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
            pnt.push(convPoint);
        }

        var ring = new mro_OL.Geometry.LinearRing(pnt);
        var polygon = new mro_OL.Geometry.Polygon([ring]);

        var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
        raidLayer.addFeatures([feature]);
    }

    function CurrentRaidLocation(raid_mapLayer){
        var mro_Map = Waze.map;

        var state1Array = [];
        var region = '';
        for(let i=0;i<raid_mapLayer.features.length;i++){
            var raidMapCenter = mro_Map.getCenter();
            var raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon,raidMapCenter.lat);
            var raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);

            if(raidCenterCheck === true){
                state1Array.push(raid_mapLayer.features[i].attributes.state1);
                if (!region.length) region = raid_mapLayer.features[i].attributes.state2;
            }
        }
        var label = state1Array.length ? state1Array.join(', ') + ', ' + region : '';
    }

    var _layerVisibleSetting = 'israel-mapraid-2018-visible';
    function loadLayerVisible() {
        var vis = localStorage.getItem(_layerVisibleSetting);
        return vis === null || vis === 'true';
    }
    function saveLayerVisible(value) {
        localStorage.setItem(_layerVisibleSetting, value);
    }
    function onLayerCheckboxChanged(value) {
        saveLayerVisible(value);
        _raid_mapLayer.setVisibility(value);
    }

    function InitMapRaidOverlay(){
        var mro_Map = Waze.map;
        var mro_OL = OpenLayers;
        var visible = loadLayerVisible();

        _raid_mapLayer = new mro_OL.Layer.Vector('Israel 2018 MapRaid', {
            displayInLayerSwitcher: true,
            uniqueName: "_israelMapRaid2018"
        });

        mro_Map.addLayer(_raid_mapLayer);
        _raid_mapLayer.setZIndex(100);
        _raid_mapLayer.setVisibility(visible);
        W.map.events.register("moveend",null,() => CurrentRaidLocation(_raid_mapLayer));

        a1.forEach(state => {
            AddRaidPolygon(_raid_mapLayer, state.coords, '', '');
        });

        CurrentRaidLocation(_raid_mapLayer);

        WazeWrap.Interface.AddLayerCheckbox('Display', 'mMR West Bank', visible, onLayerCheckboxChanged);
    }

    var a1 = [{"coords":[{"lon": "35.52011","lat": "32.4210"},
                         {"lon": "35.22413","lat": "32.55095"},
                         {"lon": "34.93360","lat": "31.34581"},
                         {"lon": "35.38794","lat": "31.34587"},
                         {"lon": "35.52011","lat": "32.42103"}
                        ]
              }];
    })();