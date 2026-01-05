// ==UserScript==
// @name                WME BeenThere (Beta)
// @namespace           https://greasyfork.org/users/30701-justins83-waze
// @description         This lets you drop boxes around the map to help visualize where you have been editing
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://beta.waze.com/*
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require             https://greasyfork.org/scripts/27023-jscolor/code/JSColor.js
// @require             https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js
// @version             0.4.3
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/27220/WME%20BeenThere%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27220/WME%20BeenThere%20%28Beta%29.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------

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

(function() {
    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.W.loginManager.user &&
            $ &&
            window.jscolor) {
            InitMapRaidOverlay();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function AddExtent() {
        var point = Waze.map.getExtent();

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

        beenTheresettings.layerHistory.push(groupPoints2);
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

            var ring = new OL.Geometry.LinearRing(pnt);
            var polygon = new OL.Geometry.Polygon([ring]);
            feature = new OL.Feature.Vector(polygon, attributes, style);
        }
        else{ //circle
            var poly = new OL.Geometry.Polygon.createRegularPolygon(obj.centerPoint, obj.radius, 40, 0);
            feature = new OL.Feature.Vector(poly, attributes, style);
        }

        mapLayers.addFeatures([feature]);
        updateTotalRectCount();
        /*
        var ring2 = new OL.Geometry.LinearRing(pnt2);
        var polygon2 = new OL.Geometry.Polygon([ring2]);
        var feature2 = new OL.Feature.Vector(polygon2);

        var pnt3 = [];
        pnt3.push(new OL.Geometry.Point(-84.3197299999999,40.100960000000285));
        pnt3.push(new OL.Geometry.Point(-84.3197299999999,40.04566000000004));
        pnt3.push(new OL.Geometry.Point(-84.24969999999959,40.04566000000004));
        pnt3.push(new OL.Geometry.Point(-84.24969999999959,40.100960000000285));
        pnt3.push(new OL.Geometry.Point(-84.3197299999999,40.100960000000285));
        var ring3 = new OL.Geometry.LinearRing(pnt3);
        var polygon3 = new OL.Geometry.Polygon([ring3]);
        var feature3 = new OL.Feature.Vector(polygon3);

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
        $("#map").on('mousemove', MouseMoveHandlerRect);
        document.addEventListener('keyup', keyUpHandler, false);
        $("#map").click(ClickHandler);
    }

    function NewUserCircle(e){
        e.stopPropagation();
        EndUserRectMode();
        clickCount = 0;
        clearLayer();
        $("#map").on('mousemove', MouseMoveHandlerCircle);
        document.addEventListener('keyup', keyUpHandler, false);
        $("#map").click(ClickHandlerCircle);
    }

    function ClickHandlerCircle(){
        if(clickCount === 0){
            userCircleCenter = getMousePos900913();
            clickCount++;
        }
        else{
            var point2 = getMousePos900913();
            var points = [new OL.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat), new OL.Geometry.Point(point2.lon, point2.lat)];
            var radius = WazeWrap.Geometry.calculateDistance(points);
            var circleData = {
                centerPoint : new OL.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat),
                radius : radius,
                color: currColor,
                type : "circle"
            };

            beenTheresettings.layerHistory.push(circleData);
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
            beenTheresettings.layerHistory.push(groupPoints2);
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
            var points = [new OL.Geometry.Point(userCircleCenter.lon, userCircleCenter.lat), new OL.Geometry.Point(currMousePos.lon, currMousePos.lat)];
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

            var ring = new OL.Geometry.LinearRing(pnt);
            var polygon = new OL.Geometry.Polygon([ring]);
            var feature = new OL.Feature.Vector(polygon, attributes, style);
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
            var pt = new OL.Geometry.Point(e.lon, e.lat);
            var polygon = new OL.Geometry.Polygon.createRegularPolygon(pt,radius, 40, 0);
            var feature = new OL.Feature.Vector(polygon, attributes, style);
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
        var pointFeature = new OL.Feature.Vector(new OL.Geometry.Point(e.lon, e.lat), {}, pointStyle);
		W.map.getLayersByName("BeenThereUserRect")[0].addFeatures([pointFeature]);
    }

    function getMousePos900913(){
        var mousePosition = $('.WazeControlMousePosition').text().split(" ");
        return WazeWrap.Geometry.ConvertTo900913(mousePosition[0], mousePosition[1]);
    }

    function keyUpHandler(e){
        if (e.keyCode == 27){
            EndUserRectMode();
            EndUserCircleMode();
         }
    }

    function EndUserRectMode(){
        $('#map').css('cursor', 'initial');
        $("#map").off('click');
        $("#map").off('mousemove', MouseMoveHandlerRect);
        clearLayer();
        document.removeEventListener('keyup', keyUpHandler);
        clickCount = 0;
        userRectPoint1 = null;
    }

    function EndUserCircleMode(){
        $("#map").off('click');
        $("#map").off('mousemove', MouseMoveHandlerCircle);
        clearLayer();
        document.removeEventListener('keyup', keyUpHandler);
        clickCount = 0;
        userCircleCenter = null;
    }

    function RemoveLastBox() {
        var mro_Map = Waze.map;
        var mro_mapLayers = mro_Map.getLayersBy("uniqueName", "__beenThere");

        var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
        if (mro_mapLayers_mapLayerLength > 0)
            mro_mapLayers[0].features[mro_mapLayers_mapLayerLength - 1].destroy();
        if(beenTheresettings.layerHistory.length > 0)
            layerFuture.push(beenTheresettings.layerHistory.pop());
        saveSettings();
        updateTotalRectCount();
    }

    function RedoLastBox(){
        if(layerFuture.length >0){
            var rect = layerFuture.pop();
            beenTheresettings.layerHistory.push(rect);
            DrawFeature(rect);
        }
    }

    function RemoveAllBoxes() {
        if(beenTheresettings.layerHistory.length > 0)
            if(confirm("Clearing all boxes cannot be undone.\nPress OK to clear all boxes.")){
                var mro_Map = Waze.map;
                var mro_mapLayers = mro_Map.getLayersBy("uniqueName", "__beenThere");

                var mro_mapLayers_mapLayerLength = mro_mapLayers[0].features.length;
                if (mro_mapLayers_mapLayerLength > 0)
                    mro_mapLayers[0].destroyFeatures();
                beenTheresettings.layerHistory = [];
                layerFuture = [];
                saveSettings();
                updateTotalRectCount();
            }
    }

    var mapLayers;
    var userRectLayer;
    function InitMapRaidOverlay() {
        mapLayers = new OpenLayers.Layer.Vector("Been There", {
            displayInLayerSwitcher: true,
            uniqueName: "__beenThere"
        });

        userRectLayer = new OpenLayers.Layer.Vector("BeenThereUserRect", {
            displayInLayerSwitcher: false,
            uniqueName: "__beenThereUserRect"
        });
        //$.getScript('https://npmcdn.com/@turf/turf@3.9.0/turf.min.js');
        Waze.map.addLayer(mapLayers);
        mapLayers.setVisibility(true);
        mapLayers.setOpacity(0.6);
        W.map.addLayer(userRectLayer);
        userRectLayer.setOpacity(0.6);

        var mro_Map = Waze.map;
        if (mro_Map === null) return;

        LoadSettingsObj();

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
            '<div id="RemoveLastBox" class="waze-icon-undo beenThereButtons" style="display:block;margin-bottom:-10px;" title="Remove last box"></div>',
            '<div id="Redo" class="waze-icon-redo beenThereButtons" style="display:block;margin-bottom:-10px;" title="Redo last box"></div>',
            '<div id="TrashBox" class="waze-icon-trash beenThereButtons" style="margin-bottom:-5px; display:block;" title="Remove all boxes">',
            '<span id="rectCount" style="position:absolute; top:150px; right:16px;font-size:12px;">0</span></div>',
            '<div id="Settings" class="fa fa-cog" style="display:block; float:left; margin-left:3px; color:#59899e; cursor:pointer; font-size:20px;"></div>',
            '</div>',//close left side container
            '<div class="flex-container" style="width:30px; height:90px; flex-wrap:wrap; justify-content:flex-start;">', //right side container
            '<input type="radio" name="currColor" value="colorPicker1" style="width:10px;" checked="checked">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="colorPicker1"></button>',
            '<input type="radio" name="currColor" value="colorPicker2" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="colorPicker2"></button>',
            '<input type="radio" name="currColor" value="colorPicker3" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="colorPicker3"></button>',
            '<input type="radio" name="currColor" value="colorPicker4" style="width:10px;">',
            '<button class="jscolor {valueElement:null,hash:true,closable:true}" style="float:right;width:15px; height:15px;border:2px solid black" id="colorPicker4"></button>',
            '</div>' //close right side container
            ].join(' '));

        $("#WazeMap").append($section.html());

        BuildSettings();

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
        }

        initColorPicker();
        LoadSettings();
    }

    /*
    Takes the settings loaded into the settings obj and loads them into the interface and draws any features that were saved
    */
    function LoadSettings(){
        if(beenTheresettings.layerHistory.length > 0)
            for(var i=0;i<beenTheresettings.layerHistory.length;i++)
                DrawFeature(beenTheresettings.layerHistory[i]);

        if ($('#colorPicker1')[0].jscolor && $('#colorPicker2')[0].jscolor && $('#colorPicker3')[0].jscolor && $('#colorPicker4')[0].jscolor){
            $('#colorPicker1')[0].jscolor.fromString(beenTheresettings.CP1);
            $('#colorPicker2')[0].jscolor.fromString(beenTheresettings.CP2);
            $('#colorPicker3')[0].jscolor.fromString(beenTheresettings.CP3);
            $('#colorPicker4')[0].jscolor.fromString(beenTheresettings.CP4);
        }
    }

    function BuildSettings(){
        var $section = $("<div>", {style:"padding:8px 16px", id:"WMEBeenThereSettings"});
        $section.html([
            '<div id="BeenThereSettings" style="visibility:hidden; position:fixed; top:40%; left:50%; width:388px; height:240px; z-index:1000; background-color:white; border-width:3px; border-style:solid; border-radius:10px; padding:4px;">',
            '<div>',
            '<h3>Drawing</h3>',
            '<input type="radio" name="DrawOptions" id="chkBTShapeBorder">Draw shape border</br>',
            '<input type="radio" name="DrawOptions" id="chkBTShapeFill">Fill shape</br>',
            '</div></br>',//close drawing div
            '<div>',
            '<h3>Export/Import</h3>',
            '<div>',
            '<button class="fa fa-upload fa-2x" aria-hidden="true" id="btnBTCopySettings" style="cursor:pointer;border: 0; background: none; box-shadow:none;" title="Copy BeenThere settings to the clipboard" data-clipboard-target="#BTSettings"></button>',
            '<textarea rows="4" cols="30" readonly id="BTSettings" style="resize:none;">Test</textarea>',
            '</div>',//end export div
            '<div>',
            '<button class="fa fa-download fa-2x" aria-hidden="true" id="btnBTImportSettings" style="cursor:pointer;border: 0; background: none; box-shadow:none;" title="Import copied settings"></button>',
            '<textarea rows="4" cols="30" id="txtBTImportSettings" style="resize:none;"></textarea>',
            '</div>',//end import div
            '</div>',//close import/export div
            '<div style="position: relative; float: right; top:10px; display: inline-block">', //save/cancel buttons
            '<button id="BeenThereSettingsSave" style="width: 85px;" class="btn btn-primary">Save</button>',
            '<button id="BeenThereSettingsCancel" class="btn btn-default">Cancel</button>',
            '</div>',//end save/cancel buttons
            '</div>'
            ].join(' '));

        $("#WazeMap").append($section.html());

        $("#BeenThereSettingsCancel").click(function(){
            $('#BeenThereSettings').css({'visibility':'hidden'}); //hide the settings window
        });

        $("#BeenThereSettingsSave").click(function(){
            beenTheresettings.DrawShapeBorder = isChecked('chkBTShapeBorder');
            beenTheresettings.FillShape = isChecked('chkBTShapeFill');
            saveSettings();

            $('#BeenThereSettings').css({'visibility':'hidden'}); //hide the settings window
        });

        $('#btnBTImportSettings').click(function(){
            if($('#txtBTImportSettings')[0].value !== ""){
                localStorage.beenThere_Settings = $('#txtBTImportSettings')[0].value;
                LoadSettingsObj();
                LoadSettings();
            }
        });

        new Clipboard('#btnBTCopySettings');
    }

    function isChecked(checkboxId) {
        return $('#' + checkboxId).is(':checked');
    }

    function setChecked(checkboxId, checked) {
        $('#' + checkboxId).prop('checked', checked);
    }

    function initColorPicker(tries){
         tries = tries || 1;

        if ($('#colorPicker1')[0].jscolor && $('#colorPicker2')[0].jscolor) {
            $('#colorPicker1')[0].jscolor.fromString(beenTheresettings.CP1);
            $('#colorPicker2')[0].jscolor.fromString(beenTheresettings.CP2);
            $('#colorPicker3')[0].jscolor.fromString(beenTheresettings.CP3);
            $('#colorPicker4')[0].jscolor.fromString(beenTheresettings.CP4);
            $('[id^="colorPicker"]')[0].jscolor.closeText = 'Close';
            $('#colorPicker1')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker2')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker3')[0].jscolor.onChange = jscolorChanged;
            $('#colorPicker4')[0].jscolor.onChange = jscolorChanged;


        } else if (tries < 1000) {
            setTimeout(function () {initColorPicker(tries++);}, 200);
        }
    }

    function jscolorChanged(){
        beenTheresettings.CP1 = "#" + $('#colorPicker1')[0].jscolor.toString();
        beenTheresettings.CP2 = "#" + $('#colorPicker2')[0].jscolor.toString();
        beenTheresettings.CP3 = "#" + $('#colorPicker3')[0].jscolor.toString();
        beenTheresettings.CP4 = "#" + $('#colorPicker4')[0].jscolor.toString();
        //In case they changed the color of the currently selected color, re-set currColor
        currColor = '#' + $('#' + $("input[type='radio'][name='currColor']:checked").val())[0].jscolor.toString();
        saveSettings();
    }

    function LoadSettingsObj() {
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
            FillShape: false
        };
        beenTheresettings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!beenTheresettings.hasOwnProperty(prop))
                beenTheresettings[prop] = defaultSettings[prop];
        }

        currColor = beenTheresettings.CP1;
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
                FillShape: beenTheresettings.FillShape
            };
            localStorage.setItem("beenThere_Settings", JSON.stringify(localsettings));
        }
    }
})();
