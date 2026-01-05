// ==UserScript==
// @name                WME BeenThere
// @namespace           https://greasyfork.org/users/30701-justins83-waze
// @description         This lets you drop boxes around the map to help visualize where you have been editing
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*/user/editor*
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require             https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require             https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @require             https://greasyfork.org/scripts/28687-jquery-ui-1-11-4-custom-min-js/code/jquery-ui-1114customminjs.js
// @resource            jqUI_CSS  https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css
// @version             2020.06.02.02
// @downloadURL https://update.greasyfork.org/scripts/27035/WME%20BeenThere.user.js
// @updateURL https://update.greasyfork.org/scripts/27035/WME%20BeenThere.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

/* global W */
/* global OpenLayers */
/* ecmaVersion 2017 */
/* global $ */
/* global jscolor */
/* global _ */
/* global WazeWrap */
/* global require */
/* global Clipboard */
/* eslint curly: ["warn", "multi-or-nest"] */

var beenTheresettings = [];
var attributes = {
    name: ""
};
var layerFuture = [];
var pointStyle = {
    pointRadius: 3,
    fillOpacity: 50,
    strokeColor: '#00ece3',
    strokeWidth: '2',
    strokeLinecap: 'round'
};
var clickCount = 0;
var userRectPoint1 = null;
var userCircleCenter = null;
var currColor;
const updateMessage = "";

(function() {
    //var jqUI_CssSrc = GM_getResourceText("jqUI_CSS");
    //GM_addStyle(jqUI_CssSrc);

    function bootstrap(tries = 1) {
        if (W && W.map &&
            W.model && W.loginManager.user &&
            $ && window.jscolor &&
            WazeWrap.Ready && W.model.users)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    bootstrap();

    function AddExtent() {
        var point = W.map.getExtent();

        var groupPoints2 = {
            topLeft : {
                lon:point.left,
                lat:point.top
            },
            botLeft : {
                lon: point.left,
                lat: point.bottom
            },
            botRight: {
                lon: point.right,
                lat: point.bottom
            },
            topRight:{
                lon: point.right,
                lat: point.top
            },
            color: currColor,
            type: "rectangle",
            radius: null
        };

        beenTheresettings.Groups[beenTheresettings.CurrentGroup].push(groupPoints2);
        DrawFeature(groupPoints2);
    }

    function DrawFeature(obj){
        var pnt = [];
        //var pnt2 = [];
        //var pnt4326;
        var feature;
        var style = {
                strokeColor: obj.color, strokeOpacity: 1, strokeWidth: 5, fillColor: obj.color, fillOpacity: 0.0,
                label: "", labelOutlineColor: "black", labelOutlineWidth: 3, fontSize: 14,
                fontColor: "orange", fontOpacity: 1, fontWeight: "bold"};
        if(beenTheresettings.DrawShapeBorder)
            style.strokeOpacity = 1;
        else
            style.strokeOpacity = 0;

        if(beenTheresettings.FillShape)
            style.fillOpacity = 1;
        else
            style.fillOpacity = 0;

        if(obj.type === "rectangle"){
            var convPoint = new OpenLayers.Geometry.Point(obj.topLeft.lon, obj.topLeft.lat);
            pnt.push(convPoint);
            //pnt4326 = WazeWrap.Geometry.ConvertTo4326(obj.topLeft.lon,obj.topLeft.lat);
            //pnt2.push(new OpenLayers.Geometry.Point(pnt4326.lon, pnt4326.lat));

            convPoint = new OpenLayers.Geometry.Point(obj.botLeft.lon, obj.botLeft.lat);
            pnt.push(convPoint);
            //pnt4326 = WazeWrap.Geometry.ConvertTo4326(obj.botLeft.lon,obj.botLeft.lat);
            //pnt2.push(new OpenLayers.Geometry.Point(pnt4326.lon, pnt4326.lat));

            convPoint = new OpenLayers.Geometry.Point(obj.botRight.lon, obj.botRight.lat);
            pnt.push(convPoint);
            //pnt4326 = WazeWrap.Geometry.ConvertTo4326(obj.botRight.lon,obj.botRight.lat);
            //pnt2.push(new OpenLayers.Geometry.Point(pnt4326.lon, pnt4326.lat));

            convPoint = new OpenLayers.Geometry.Point(obj.topRight.lon, obj.topRight.lat);
            pnt.push(convPoint);
            //pnt4326 = WazeWrap.Geometry.ConvertTo4326(obj.topRight.lon,obj.topRight.lat);
            //pnt2.push(new OpenLayers.Geometry.Point(pnt4326.lon, pnt4326.lat));

            convPoint = new OpenLayers.Geometry.Point(obj.topLeft.lon, obj.topLeft.lat);
            pnt.push(convPoint);
            //pnt4326 = WazeWrap.Geometry.ConvertTo4326(obj.topLeft.lon,obj.topLeft.lat);
            //pnt2.push(new OpenLayers.Geometry.Point(pnt4326.lon, pnt4326.lat));

            var ring = new OpenLayers.Geometry.LinearRing(pnt);
            var polygon = new OpenLayers.Geometry.Polygon([ring]);
            feature = new OpenLayers.Feature.Vector(polygon, attributes, style);
        }
        else{ //circle
            var poly = new OpenLayers.Geometry.Polygon.createRegularPolygon(obj.centerPoint, obj.radius, 40, 0);
            feature = new OpenLayers.Feature.Vector(poly, attributes, style);
        }

        mapLayers.addFeatures([feature]);
        updateTotalRectCount();
        /*
        var ring2 = new OpenLayers.Geometry.LinearRing(pnt2);
        var polygon2 = new OpenLayers.Geometry.Polygon([ring2]);
        var feature2 = new OpenLayers.Feature.Vector(polygon2);

        var pnt3 = [];
        pnt3.push(new OpenLayers.Geometry.Point(-84.3197299999999,40.100960000000285));
        pnt3.push(new OpenLayers.Geometry.Point(-84.3197299999999,40.04566000000004));
        pnt3.push(new OpenLayers.Geometry.Point(-84.24969999999959,40.04566000000004));
        pnt3.push(new OpenLayers.Geometry.Point(-84.24969999999959,40.100960000000285));
        pnt3.push(new OpenLayers.Geometry.Point(-84.3197299999999,40.100960000000285));
        var ring3 = new OpenLayers.Geometry.LinearRing(pnt3);
        var polygon3 = new OpenLayers.Geometry.Polygon([ring3]);
        var feature3 = new OpenLayers.Feature.Vector(polygon3);

        var geoJSON = new OpenLayers.Format.GeoJSON();
        //var geoJSONText = geoJSON.write(feature3, true);
        //var geoJSONText2 = geoJSON.write(feature2, true);
        //console.log("geoJSONText = " + geoJSONText);
        //console.log("geoJSONText2 = " + geoJSONText2);

        var turfpolygon = turf.polygon([[
 [-84.3197299999999, 40.100960000000285],
 [-84.3197299999999, 40.04566000000004],
 [-84.24969999999959, 40.04566000000004],
 [-84.24969999999959, 40.100960000000285],
 [-84.3197299999999, 40.100960000000285]
]]);
        var turfpoly2 = turf.polygon([[
        [-84.3034299999997, 40.11526999999987],
        [-84.3034299999997, 40.085729999999806],
        [-84.24437, 40.085729999999806],
        [-84.24437, 40.11526999999987],
        [-84.3034299999997, 40.11526999999987]
        ]]);

        var union = turf.union(turfpolygon, turfpoly2);
        console.log("Justin");
        console.log(union);*/
    }

    function updateTotalRectCount(){
        $('#rectCount')[0].innerHTML = mapLayers.features.length;
    }

    function NewBox(e) {
        e.stopPropagation();
        AddExtent();
        saveSettings();
    }

    function NewUserRect(e){
        e.stopPropagation();
        EndUserCircleMode();
        clickCount = 0;
        clearLayer();
        $(".olMapViewport").on('mousemove', MouseMoveHandlerRect);
        document.addEventListener('keyup', keyUpHandler, false);
        $(".olMapViewport").click(ClickHandler);
    }

    function NewUserCircle(e){
        e.stopPropagation();
        EndUserRectMode();
        clickCount = 0;
        clearLayer();
        $(".olMapViewport").on('mousemove', MouseMoveHandlerCircle);
        document.addEventListener('keyup', keyUpHandler, false);
        $(".olMapViewport").click(ClickHandlerCircle);
    }

    function ClickHandlerCircle(){
        if(clickCount === 0){
            userCircleCenter = getMousePos900913();
            clickCount++;
        }
        else{
            var point2 = getMousePos900913();
            var points = [new OpenLayers.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat), new OpenLayers.Geometry.Point(point2.lon, point2.lat)];
            var radius = WazeWrap.Geometry.calculateDistance(points);
            var circleData = {
                centerPoint : new OpenLayers.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat),
                radius : radius,
                color: currColor,
                type : "circle"
            };

            beenTheresettings.Groups[beenTheresettings.CurrentGroup].push(circleData);
            saveSettings();
            DrawFeature(circleData);
            EndUserCircleMode();
        }
    }

    function ClickHandler(){
        if(clickCount === 0){ //first point chosen - draw rectangle as the mouse moves
            userRectPoint1 = getMousePos900913();
            clickCount++;
        }
        else{ //second point chose - take both coordinates and draw a rectangle on the BeenThere layer
            var point2 = getMousePos900913();

            var groupPoints2 = {
                topLeft : {
                    lon: userRectPoint1.lon,
                    lat: userRectPoint1.lat
                },
                botLeft : {
                    lon: userRectPoint1.lon,
                    lat: point2.lat
                },
                botRight: {
                    lon: point2.lon,
                    lat: point2.lat
                },
                topRight:{
                    lon: point2.lon,
                    lat: userRectPoint1.lat
                },
                color: currColor,
                type: "rectangle"
            };
            beenTheresettings.Groups[beenTheresettings.CurrentGroup].push(groupPoints2);
            saveSettings();
            DrawFeature(groupPoints2);
            EndUserRectMode();
        }
    }

    function MouseMoveHandlerRect(e){
        clearLayer();
		drawPointer(getMousePos900913(), false);
        drawRect(userRectPoint1);
    }

    function MouseMoveHandlerCircle(e){
        clearLayer();
        var currMousePos = getMousePos900913();
		drawPointer(currMousePos, true);
        if(userCircleCenter){
            var points = [new OpenLayers.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat), new OpenLayers.Geometry.Point(currMousePos.lon, currMousePos.lat)];
            var radius = WazeWrap.Geometry.calculateDistance(points);
            drawCircle(userCircleCenter, radius);
        }
    }

    function clearLayer() {
		var layer = W.map.getLayersByName("BeenThereUserRect")[0];
		layer.removeAllFeatures();
	}

    function drawRect(e){
        if(e !== null){
            var color = currColor;
            var style = {
                strokeColor: color, strokeOpacity: 1, strokeWidth: 5, fillColor: color, fillOpacity: 0.0,
                label: "", labelOutlineColor: "black", labelOutlineWidth: 3, fontSize: 14,
                fontColor: color, fontOpacity: 0.85, fontWeight: "bold"};
            if(beenTheresettings.DrawShapeBorder)
                style.strokeOpacity = 1;
            else
                style.strokeOpacity = 0;

            if(beenTheresettings.FillShape)
                style.fillOpacity = 1;
            else
                style.fillOpacity = 0;

            var point2 = getMousePos900913();

            var pnt = [];
            var convPoint = new OpenLayers.Geometry.Point(e.lon, e.lat);
            pnt.push(convPoint);
            convPoint = new OpenLayers.Geometry.Point(e.lon, point2.lat);
            pnt.push(convPoint);
            convPoint = new OpenLayers.Geometry.Point(point2.lon, point2.lat);
            pnt.push(convPoint);
            convPoint = new OpenLayers.Geometry.Point(point2.lon, e.lat);
            pnt.push(convPoint);
            convPoint = new OpenLayers.Geometry.Point(e.lon, e.lat);
            pnt.push(convPoint);

            var ring = new OpenLayers.Geometry.LinearRing(pnt);
            var polygon = new OpenLayers.Geometry.Polygon([ring]);
            var feature = new OpenLayers.Feature.Vector(polygon, attributes, style);
            W.map.getLayersByName("BeenThereUserRect")[0].addFeatures([feature]);
        }
    }

    function drawCircle(e, radius){
        if(e !== null){
            var color = currColor;
            var style = {
                strokeColor: color, strokeOpacity: 0.8, strokeWidth: 5, fillColor: color, fillOpacity: 0.0,
                label: "", labelOutlineColor: "black", labelOutlineWidth: 3, fontSize: 14,
                fontColor: color, fontOpacity: 0.85, fontWeight: "bold"};
            if(beenTheresettings.DrawShapeBorder)
                style.strokeOpacity = 1;
            else
                style.strokeOpacity = 0;

            if(beenTheresettings.FillShape)
                style.fillOpacity = 1;
            else
                style.fillOpacity = 0;

            var point2 = getMousePos900913();
            var pt = new OpenLayers.Geometry.Point(e.lon, e.lat);
            var polygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(pt,radius, 40, 0);
            var feature = new OpenLayers.Feature.Vector(polygon, attributes, style);
            W.map.getLayersByName("BeenThereUserRect")[0].addFeatures([feature]);
        }
    }

    function drawPointer(e, circle){
        var color = currColor;
        pointStyle.strokeColor = color;
        pointStyle.fillColor = color;
        if(circle && circle === true)
            pointStyle.fillOpacity = 0;
        else
            pointStyle.fillOpacity = 1;
        var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(e.lon, e.lat), {}, pointStyle);
		W.map.getLayersByName("BeenThereUserRect")[0].addFeatures([pointFeature]);
    }

    function getMousePos900913(){
        var mousePosition = $('.WazeControlMousePosition').text().split(" "); 
        [mousePosition[0], mousePosition[1]] = [mousePosition[1], mousePosition[0]];
        return WazeWrap.Geometry.ConvertTo900913(mousePosition[0], mousePosition[1]);
    }

    function keyUpHandler(e){
        if (e.keyCode == 27){
            EndUserRectMode();
            EndUserCircleMode();
         }
    }

    function EndUserRectMode(){
        $('.olMapViewport').css('cursor', 'initial');
        $(".olMapViewport").off('click');
        $(".olMapViewport").off('mousemove', MouseMoveHandlerRect);
        clearLayer();
        document.removeEventListener('keyup', keyUpHandler);
        clickCount = 0;
        userRectPoint1 = null;
    }

    function EndUserCircleMode(){
        $(".olMapViewport").off('click');
        $(".olMapViewport").off('mousemove', MouseMoveHandlerCircle);
        clearLayer();
        document.removeEventListener('keyup', keyUpHandler);
        clickCount = 0;
        userCircleCenter = null;
    }

    function RemoveLastBox() {
        var mro_mapLayers = W.map.getLayersBy("uniqueName", "__beenThere");

        var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
        if (mro_mapLayers_mapLayerLength > 0)
            mro_mapLayers[0].features[mro_mapLayers_mapLayerLength - 1].destroy();
        if(beenTheresettings.Groups[beenTheresettings.CurrentGroup].length > 0)
            layerFuture.push(beenTheresettings.Groups[beenTheresettings.CurrentGroup].pop());
        saveSettings();
        updateTotalRectCount();
    }

    function RedoLastBox(){
        if(layerFuture.length >0){
            var rect = layerFuture.pop();
            beenTheresettings.Groups[beenTheresettings.CurrentGroup].push(rect);
            DrawFeature(rect);
        }
    }

    function RemoveAllBoxes() {
        if(beenTheresettings.Groups[beenTheresettings.CurrentGroup].length > 0)
            if(confirm("Clearing all boxes cannot be undone.\nPress OK to clear all boxes.")){
                var mro_mapLayers = W.map.getLayersBy("uniqueName", "__beenThere");

                var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
                if (mro_mapLayers_mapLayerLength > 0)
                    mro_mapLayers[0].destroyFeatures();
                beenTheresettings.Groups[beenTheresettings.CurrentGroup] = [];
                layerFuture = [];
                saveSettings();
                updateTotalRectCount();
            }
    }

    var mapLayers;
    var userRectLayer;
    function init() {
        LoadSettingsObj();

        mapLayers = new OpenLayers.Layer.Vector("Been There", {
            displayInLayerSwitcher: true,
            uniqueName: "__beenThere"
        });

        userRectLayer = new OpenLayers.Layer.Vector("BeenThereUserRect", {
            displayInLayerSwitcher: false,
            uniqueName: "__beenThereUserRect"
        });
        //$.getScript('https://npmcdn.com/@turf/turf@3.9.0/turf.min.js');
        W.map.addLayer(mapLayers);
        mapLayers.setVisibility(beenTheresettings.layerVisible);
        mapLayers.setOpacity(0.6);
        W.map.addLayer(userRectLayer);
        userRectLayer.setOpacity(0.6);
        userRectLayer.setVisibility(beenTheresettings.layerVisible);

        WazeWrap.Interface.AddLayerCheckbox("display", "Been There", beenTheresettings.layerVisible, LayerToggled, [mapLayers, userRectLayer]);

        //append our css to the head
        var g = '.beenThereButtons {font-size:26px; color:#59899e; cursor:pointer;} .flex-container {display: -webkit-flex; display: flex; background-color:black;}';
        $("head").append($('<style type="text/css">' + g + '</style>'));

        //add controls to the map
        var $section = $("<div>", {style:"padding:8px 16px", id:"WMEBeenThere"});
        $section.html([
            '<div id="beenThere" class="flex-container" style="width:65px; position: absolute;top:' + beenTheresettings.LocTop + '; left: ' + beenTheresettings.LocLeft + '; z-index: 1040 !important; border-radius: 5px; padding: 4px; background-color: #000000;">',
            '<div class="flex-container" style="width:32px; flex-wrap:wrap;" >',//left side container
            '<div id="NewBox" class="waze-icon-plus_neg beenThereButtons" style="margin-top:-10px; display:block; float:left;" title="Draw a box around the visible area"></div>',
            '<div id="UserRect" class="fa fa-pencil-square-o" style="display:block; float:left; margin-left:3px; color:#59899e; cursor:pointer; font-size:25px;"></div>',
            '<div id="UserCirc" class="fa-stack" style="margin-top:10px; display:block; float:left; color:#59899e; cursor:pointer;"><span class="fa fa-circle-thin fa-stack-2x"></span><span class="fa fa-pencil" style="font-size:20px; margin-left:8px;"></span></div>',
            '<div id="RemoveLastBox" class="waze-icon-undo beenThereButtons" style="display:block;margin-bottom:-10px;" title="Remove last shape"></div>',
            '<div id="Redo" class="waze-icon-redo beenThereButtons" style="display:block;margin-bottom:-10px;" title="Redo last shape"></div>',
            '<div id="TrashBox" class="waze-icon-trash beenThereButtons" style="margin-bottom:-5px; display:block;" title="Remove all shapes">',
            '<span id="rectCount" style="position:absolute; top:150px; right:16px;font-size:12px;">0</span></div>',
            '<div id="Settings" class="fa fa-cog" style="display:block; float:left; margin-left:3px; color:#59899e; cursor:pointer; font-size:20px;"></div>',
            '</div>',//close left side container
            '<div class="flex-container" style="width:30px; height:90px; flex-wrap:wrap; justify-content:flex-start;">', //right side container
            '<input type="radio" name="currColor" value="btcolorPicker1" style="width:10px;" checked="checked">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="btcolorPicker1"></button>',
            '<input type="radio" name="currColor" value="btcolorPicker2" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="btcolorPicker2"></button>',
            '<input type="radio" name="currColor" value="btcolorPicker3" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="btcolorPicker3"></button>',
            '<input type="radio" name="currColor" value="btcolorPicker4" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="btcolorPicker4"></button>',
            '</div>' //close right side container
            ].join(' '));

        $("#WazeMap").append($section.html());

        BuildSettingsInterface();

        //set up listeners
        $("#NewBox").click(NewBox);
        $('#UserRect').click(NewUserRect);
        $('#UserCirc').click(NewUserCircle);
        $("#RemoveLastBox").click(RemoveLastBox);
        $('#Redo').click(RedoLastBox);
        $("#TrashBox").click(RemoveAllBoxes);
        $('#Settings').click(function(){
            $('#BTSettings')[0].innerHTML = localStorage.beenThere_Settings;
            setChecked('chkBTShapeBorder',beenTheresettings.DrawShapeBorder);
            setChecked('chkBTShapeFill',beenTheresettings.FillShape);
            $('#BeenThereSettings').css({'visibility':'visible'});
        });
        new WazeWrap.Interface.Shortcut('NewBoxShortcut', 'Draw a box around the visible area', 'wmebt', 'Been There', beenTheresettings.NewBoxShortcut, NewBox, null).add();
        new WazeWrap.Interface.Shortcut('NewUserRectShortcut', 'Draw a rectangle', 'wmebt', 'Been There', beenTheresettings.NewUserRectShortcut, NewUserRect, null).add();
        new WazeWrap.Interface.Shortcut('NewUserCircleShortcut', 'Draw a circle', 'wmebt', 'Been There', beenTheresettings.NewUserCircleShortcut, NewUserCircle, null).add();
        new WazeWrap.Interface.Shortcut('RemoveLastShapeShortcut', 'Remove last shape', 'wmebt', 'Been There', beenTheresettings.RemoveLastShapeShortcut, RemoveLastBox, null).add();
        new WazeWrap.Interface.Shortcut('RedoLastShapeShortcut', 'Redo last shape', 'wmebt', 'Been There', beenTheresettings.RedoLastShapeShortcut, RedoLastBox, null).add();
        new WazeWrap.Interface.Shortcut('RemoveAllShapesShortcut', 'Remove all shapes', 'wmebt', 'Been There', beenTheresettings.RemoveAllShapesShortcut, RemoveAllBoxes, null).add();

        //necessary to catch changes to the keyboard shortcuts
        window.onbeforeunload = function() {
            checkShortcutsChanged();
        };

        $('[name="currColor"]').change(function() {
            currColor = '#' + $('#' + this.value)[0].jscolor.toString();
        });

        if($.ui){
            $('#beenThere').draggable({
                stop: function(event, ui) {
                    beenTheresettings.LocLeft = $('#beenThere').css('left');
                    beenTheresettings.LocTop = $('#beenThere').css('top');
                    saveSettings();
                }
            });

            $('#BeenThereSettings').draggable({
                stop: function(event, ui) {
                    beenTheresettings.SettingsLocLeft = $('#BeenThereSettings').css('left');
                    beenTheresettings.SettingsLocTop = $('#BeenThereSettings').css('top');
                    saveSettings();
                }
            });
        }

        initColorPicker();
        LoadSettings();

        WazeWrap.Interface.ShowScriptUpdate("WME BeenThere", GM_info.script.version, updateMessage, "https://greasyfork.org/scripts/27035-wme-beenthere", "https://www.waze.com/forum/viewtopic.php?f=819&t=218182");
    }

    function LayerToggled(checked){
        userRectLayer.setVisibility(checked);
        mapLayers.setVisibility(checked);
        beenTheresettings.layerVisible = checked;
        saveSettings();
    }

    /*
    Takes the settings loaded into the settings obj and loads them into the interface and draws any features that were saved
    */
    function LoadSettings(){
        loadGroup(beenTheresettings.CurrentGroup);

        if ($('#btcolorPicker1')[0].jscolor && $('#btcolorPicker2')[0].jscolor && $('#btcolorPicker3')[0].jscolor && $('#btcolorPicker4')[0].jscolor){
            $('#btcolorPicker1')[0].jscolor.fromString(beenTheresettings.CP1);
            $('#btcolorPicker2')[0].jscolor.fromString(beenTheresettings.CP2);
            $('#btcolorPicker3')[0].jscolor.fromString(beenTheresettings.CP3);
            $('#btcolorPicker4')[0].jscolor.fromString(beenTheresettings.CP4);
        }
    }

    function loadGroup(group){
        for(var i=0;i<beenTheresettings.Groups[group].length;i++)
            DrawFeature(beenTheresettings.Groups[group][i]);
    }

    function BuildSettingsInterface(){
        var $section = $("<div>", {style:"padding:8px 16px", id:"WMEBeenThereSettings"});
        $section.html([
            `<div id="BeenThereSettings" style="visibility:hidden; position:fixed; top:${beenTheresettings.SettingsLocTop}; left:${beenTheresettings.SettingsLocLeft}; z-index:1000; background-color:white; border-width:3px; border-style:solid; border-radius:10px; padding:4px;">`,
            '<div>', //top div - split left/right
            '<div style="width:328px; height:240px; display:inline-block; float:left;">', //left side div
            '<div><h3>Drawing</h3>',
            '<input type="radio" name="DrawOptions" class="btOptions" id="chkBTShapeBorder">Draw shape border</br>',
            '<input type="radio" name="DrawOptions" class="btOptions" id="chkBTShapeFill">Fill shape</br>',
            '</div></br>',//close drawing div
            '<div><h3>Export/Import</h3>',
            '<div><button class="fa fa-upload fa-2x" aria-hidden="true" id="btnBTCopySettings" style="cursor:pointer;border: 1; background: none; box-shadow:none;" title="Copy BeenThere settings to the clipboard" data-clipboard-target="#BTSettings"></button>',
            '<textarea rows="4" cols="30" readonly id="BTSettings" style="resize:none;"></textarea>',
            '</div>',//end export div
            '<div>', // import div
            '<button class="fa fa-download fa-2x" aria-hidden="true" id="btnBTImportSettings" style="cursor:pointer;border: 1; background: none; box-shadow:none;" title="Import copied settings"></button>',
            '<textarea rows="4" cols="30" id="txtBTImportSettings" style="resize:none;"></textarea>',
            '</div>',//end import div
            '</div>',//close import/export div
            '</div>', //close left side div

            '<div style="display:inline-block; height:240px;">', //right side div
            '<h3>Groups</h3>',
            '<div id="BeenThereGroups">',
            '<div id="BeenThereGroupsList">',
            '</div>',
            '<div style="float:left;">',//textboxes div
            '<label for="btGroupName" style="display:inline-block; width:40px;">Name </label><input type="text" id="btGroupName" size="10" style="border: 1px solid #000000; height:20px;"/></br>',
			'</div>', //End textboxes div

			'<div style="float:right; text-align:center;">',//button div
			'<button id="btAddGroup">Add</button>',
			'</div>',//close button div
            '</div>', //close BeenThereGroups
            '</div>', //close right side div
            '</div>', //close top div

            '<div style="float: right; top:10px;">', //save/cancel buttons
            '<button id="BeenThereSettingsClose" class="btn btn-default">Close</button>',
            '</div>',//end save/cancel buttons
            '</div>'
            ].join(' '));

        $("#WazeMap").append($section.html());

        $('.btOptions').change(function(){
            beenTheresettings.DrawShapeBorder = isChecked('chkBTShapeBorder');
            beenTheresettings.FillShape = isChecked('chkBTShapeFill');
            saveSettings();
        });

        $("#BeenThereSettingsClose").click(function(){
            $('#BeenThereSettings').css({'visibility':'hidden'}); //hide the settings window
        });

        $('#btnBTImportSettings').click(function(){
            if($('#txtBTImportSettings')[0].value !== ""){
                localStorage.beenThere_Settings = $('#txtBTImportSettings')[0].value;
                LoadSettingsObj();
                LoadSettings();
            }
        });

        LoadCustomGroups();

        $('#btAddGroup').click(function(){
            if($('#btGroupName').val() !== ""){
                let name = $('#btGroupName').val();
                let exists = beenTheresettings.Groups[name];
                if(exists == null){
                    beenTheresettings.Groups[name] = [];
                    $('#btGroupsName').val("");
                    LoadCustomGroups();
                    saveSettings();
                }
            }
        });

        new Clipboard('#btnBTCopySettings');
    }

    function LoadCustomGroups(){
        $('#BeenThereGroupsList').empty();
        var groups = "";
        $.each(beenTheresettings.Groups, function(k, v){
            groups += '<div style="position:relative;">' + k + '<i id="BTGroupsClose' + k + '" style="position:absolute; right:0; top:0;" class="fa fa-times" title="Remove group"></i></div>';
        });

        groups += 'Current group: <select id="btCurrGroup">';
        $.each(beenTheresettings.Groups, function(val, obj){
            groups += `<option value="${val}">${val}</option>`;
        });
        groups += '</select>';

        $('#BeenThereGroupsList').prepend(groups);

        $('#btCurrGroup')[0].value = beenTheresettings.CurrentGroup;

        $('#btCurrGroup').change(function(){
            beenTheresettings.CurrentGroup = $(this)[0].value;
            clearLayer();
            mapLayers.removeAllFeatures();
            loadGroup(beenTheresettings.CurrentGroup);
            saveSettings();
        });

        $('[id^="BTGroupsClose"]').click(function(){
            if(getObjectPropertyCount(beenTheresettings.Groups) > 1){
                delete beenTheresettings.Groups[this.id.replace('BTGroupsClose','')];
                saveSettings();
                LoadCustomGroups();
            }
            else
                alert("There must be at least one group");
        });
    }

    function isChecked(checkboxId) {
        return $('#' + checkboxId).is(':checked');
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function initColorPicker(tries = 1){
        if ($('#btcolorPicker1')[0].jscolor && $('#btcolorPicker2')[0].jscolor) {
            $('#btcolorPicker1')[0].jscolor.fromString(beenTheresettings.CP1);
            $('#btcolorPicker2')[0].jscolor.fromString(beenTheresettings.CP2);
            $('#btcolorPicker3')[0].jscolor.fromString(beenTheresettings.CP3);
            $('#btcolorPicker4')[0].jscolor.fromString(beenTheresettings.CP4);
            $('[id^="colorPicker"]')[0].jscolor.closeText = 'Close';
            $('#btcolorPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#btcolorPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#btcolorPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#btcolorPicker4')[0].jscolor.onChange = jscolorChanged;


        } else if (tries < 1000)
            setTimeout(function () {initColorPicker(tries++);}, 200);
    }

    function jscolorChanged(){
        beenTheresettings.CP1 = "#" + $('#btcolorPicker1')[0].jscolor.toString();
        beenTheresettings.CP2 = "#" + $('#btcolorPicker2')[0].jscolor.toString();
        beenTheresettings.CP3 = "#" + $('#btcolorPicker3')[0].jscolor.toString();
        beenTheresettings.CP4 = "#" + $('#btcolorPicker4')[0].jscolor.toString();
        //In case they changed the color of the currently selected color, re-set currColor
        currColor = '#' + $('#' + $("input[type='radio'][name='currColor']:checked").val())[0].jscolor.toString();
        saveSettings();
    }

    function objectHasProperties(object) {
        for (var prop in object) {
            if (object.hasOwnProperty(prop))
                return true;
        }
        return false;
    }

    function getObjectPropertyCount(object){
        let count = 0;
        for (var prop in object) {
            if (object.hasOwnProperty(prop))
                count++;
        }
        return count;
    }

    async function LoadSettingsObj() {
        var loadedSettings;
        try{
            loadedSettings = $.parseJSON(localStorage.getItem("beenThere_Settings"));
        }
        catch(err){
            loadedSettings = null;
        }

        var defaultSettings = {
            layerHistory: [],
            LocLeft: "6px",
            LocTop: "280px",
            CP1: "#FDA400",
            CP2: "#fd0303",
            CP3: "#1303fd",
            CP4: "#00fd22",
            DrawShapeBorder: true,
            FillShape: false,
            NewBoxShortcut: "",
            NewUserRectShortcut: "",
            NewUserCircleShortcut: "",
            RemoveLastShapeShortcut: "",
            RedoLastShapeShortcut: "",
            RemoveAllShapesShortcut: "",
            SettingsLocTop: "40%",
            SettingsLocLeft: "50%",
            Groups: {"default": []},
            CurrentGroup: "default",
            layerVisible: true,
            lastSaved: 0
        };

	beenTheresettings = $.extend({}, defaultSettings, loadedSettings);

        let serverSettings = await WazeWrap.Remote.RetrieveSettings("BeenThere");
        if(serverSettings && serverSettings.lastSaved > beenTheresettings.lastSaved)
            $.extend(beenTheresettings, serverSettings);
	    
        if(parseInt(beenTheresettings.LocLeft.replace('px', '')) < 0)
            beenTheresettings.LocLeft = "6px";
        if(parseInt(beenTheresettings.LocTop.replace('px','')) < 0)
            beenTheresettings.LocTop = "280px";

        currColor = beenTheresettings.CP1;

        if(beenTheresettings.layerHistory.length > 0){ //move our old layers into the default group
            beenTheresettings.Groups.default = [...beenTheresettings.layerHistory];
            beenTheresettings.layerHistory = [];
            saveSettings();
        }
    }

    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                layerHistory: beenTheresettings.layerHistory,
                LocLeft: beenTheresettings.LocLeft,
                LocTop: beenTheresettings.LocTop,
                CP1: beenTheresettings.CP1,
                CP2: beenTheresettings.CP2,
                CP3: beenTheresettings.CP3,
                CP4: beenTheresettings.CP4,
                DrawShapeBorder: beenTheresettings.DrawShapeBorder,
                FillShape: beenTheresettings.FillShape,
                NewBoxShortcut: beenTheresettings.NewBoxShortcut,
                NewUserRectShortcut: beenTheresettings.NewUserRectShortcut,
                NewUserCircleShortcut: beenTheresettings.NewUserCircleShortcut,
                RemoveLastShapeShortcut: beenTheresettings.RemoveLastShapeShortcut,
                RedoLastShapeShortcut: beenTheresettings.RedoLastShapeShortcut,
                RemoveAllShapesShortcut: beenTheresettings.RemoveAllShapesShortcut,
                SettingsLocTop: beenTheresettings.SettingsLocTop,
                SettingsLocLeft: beenTheresettings.SettingsLocLeft,
                Groups: beenTheresettings.Groups,
                CurrentGroup: beenTheresettings.CurrentGroup,
                layerVisible: beenTheresettings.layerVisible,
                lastSaved: Date.now()
            };
            if(parseInt(localsettings.LocLeft.replace('px', '')) < 0)
			localsettings.LocLeft = "6px";
	    	if(parseInt(localsettings.LocTop.replace('px','')) < 0)
			localsettings.LocTop = "280px";

            for (var name in W.accelerators.Actions) {
                let TempKeys = "";
                if (W.accelerators.Actions[name].group == 'wmebt') {
                    console.log(name);
                    if (W.accelerators.Actions[name].shortcut) {
                        if (W.accelerators.Actions[name].shortcut.altKey === true)
                            TempKeys += 'A';
                        if (W.accelerators.Actions[name].shortcut.shiftKey === true)
                            TempKeys += 'S';
                        if (W.accelerators.Actions[name].shortcut.ctrlKey === true)
                            TempKeys += 'C';
                        if (TempKeys !== "")
                            TempKeys += '+';
                        if (W.accelerators.Actions[name].shortcut.keyCode)
                            TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
                    } else
                        TempKeys = "-1";
                    localsettings[name] = TempKeys;
                }
            }

            localStorage.setItem("beenThere_Settings", JSON.stringify(localsettings));
            WazeWrap.Remote.SaveSettings("BeenThere", localsettings);
        }
    }

    function checkShortcutsChanged(){
        let triggerSave = false;
        for (let name in W.accelerators.Actions) {
            let TempKeys = "";
            if (W.accelerators.Actions[name].group == 'wmepie') {
                if (W.accelerators.Actions[name].shortcut) {
                    if (W.accelerators.Actions[name].shortcut.altKey === true)
                        TempKeys += 'A';
                    if (W.accelerators.Actions[name].shortcut.shiftKey === true)
                        TempKeys += 'S';
                    if (W.accelerators.Actions[name].shortcut.ctrlKey === true)
                        TempKeys += 'C';
                    if (TempKeys !== "")
                        TempKeys += '+';
                    if (W.accelerators.Actions[name].shortcut.keyCode)
                        TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
                } else
                    TempKeys = "-1";
                if(beenTheresettings[name] != TempKeys){
                    beenTheresettings[name] = TempKeys;
                    triggerSave = true;
                    break;
                }
            }
        }
        if(triggerSave)
            saveSettings();
    }
})();
