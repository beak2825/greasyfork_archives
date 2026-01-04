// ==UserScript==
// @name         WME Crosshair NEW
// @version      0.0.8.001
// @description  Adds a Crosshair in Center of screen in WME
// @author       JustinS83 (Original author: Joshua M. Kriegshauser)
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace    https://greasyfork.org/users/30701
// @grant        none
// @icon          data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/34704/WME%20Crosshair%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/34704/WME%20Crosshair%20NEW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var WMEMe_Layer = null;
    var WMEMe_Marker = null;
    var WMEMe_TempMarker = null;
    var settings = {};


    function WMEMe_ZoomEnd() {
        //console.log('WMEMe_ZoomEnd');
        WMEMe_Marker.moveTo(W.map.getLayerPxFromLonLat(W.map.center));
    }

    function WMEMe_Drag() {
        //console.log('WMEMe_Drag ' + W.map.getCenter());
        WMEMe_TempMarker.moveTo(W.map.getLayerPxFromLonLat(W.map.getCenter()));
    }

    function WMEMe_MoveEnd() {
        //console.log('WMEMe_MoveEnd');
        WMEMe_Layer.removeMarker(WMEMe_TempMarker);
        WMEMe_TempMarker = null;
        WMEMe_Marker.moveTo(W.map.getLayerPxFromLonLat(W.map.center));
    }

    function WMEMe_InstallIcon() {
        OpenLayers.Icon=OpenLayers.Class({url:null,size:null,offset:null,calculateOffset:null,imageDiv:null,px:null,initialize:function(a,b,c,d){this.url=a;this.size=b||{w:20,h:20};this.offset=c||{x:-(this.size.w/2),y:-(this.size.h/2)};this.calculateOffset=d;a=OpenLayers.Util.createUniqueID("OL_Icon_");this.imageDiv=OpenLayers.Util.createAlphaImageDiv(a)},destroy:function(){this.erase();OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);this.imageDiv.innerHTML="";this.imageDiv=null},clone:function(){return new OpenLayers.Icon(this.url,
	this.size,this.offset,this.calculateOffset)},setSize:function(a){null!=a&&(this.size=a);this.draw()},setUrl:function(a){null!=a&&(this.url=a);this.draw()},draw:function(a){OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,this.size,this.url,"absolute");this.moveTo(a);return this.imageDiv},erase:function(){null!=this.imageDiv&&null!=this.imageDiv.parentNode&&OpenLayers.Element.remove(this.imageDiv)},setOpacity:function(a){OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,null,null,null,
	null,null,null,a)},moveTo:function(a){null!=a&&(this.px=a);null!=this.imageDiv&&(null==this.px?this.display(!1):(this.calculateOffset&&(this.offset=this.calculateOffset(this.size)),OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,null,{x:this.px.x+this.offset.x,y:this.px.y+this.offset.y})))},display:function(a){this.imageDiv.style.display=a?"":"none"},isDrawn:function(){return this.imageDiv&&this.imageDiv.parentNode&&11!=this.imageDiv.parentNode.nodeType},CLASS_NAME:"OpenLayers.Icon"});
    }


    function WMEMe_Install() {
        loadSettings();
        var layer = W.map.getLayersBy('uniqueName', '__WMEcrosshair');
        var newLayer = new OpenLayers.Layer.Markers('Me!', {
            displayInLayerSwitcher: true,
            uniqueName: '__WMEcrosshair'
        });

        // For some reason, OpenLayers.Icon is missing?!?
        if (!OpenLayers.Icon) {
            WMEMe_InstallIcon();
        }

        WMEMe_Layer = newLayer;
        var tween = new OpenLayers.Tween(OpenLayers.Easing.Linear.easeInOut);

        I18n.translations[I18n.currentLocale()].layers.name['__WMEcrosshair'] = 'Crosshair!';

        W.map.addLayer(newLayer);

        newLayer.setVisibility(settings.layerEnabled);

        WazeWrap.Interface.AddLayerCheckbox("display", "Crosshair", settings.layerEnabled, function(enabled){newLayer.setVisibility(enabled); settings.layerEnabled = enabled; saveSettings();});


        var icon = new OpenLayers.Icon('https://ggrane.000webhostapp.com/crosshair1.png', new OpenLayers.Size(40,35), new OpenLayers.Pixel(-25,-42));

        // Me! Text
        if(settings.showName)
            $(icon.imageDiv).append($('<div id="WMEME_name">' + WazeWrap.User.Username() + '</div>').css('position','absolute').css('text-align','center').css('pointer-events','none').css('font-size','12px').css('top','2px').css('color','white'));
        else
            $(icon.imageDiv).append($('<div  id="WMEME_name"></div>').css('position','absolute').css('left','16px').css('pointer-events','none').css('font-size','12px').css('top','2px').css('color','white'));

        if (!W.model.chat.attributes.visible)
            icon.setOpacity(0.9);

        W.model.chat._events["change:visible"].push({callback:function(e) {
            icon.setOpacity(W.model.chat.attributes.visible ? 1.0 : 0.5);
        }});

        $(icon.imageDiv).click(function(){settings.showName=!settings.showName; SetName(settings.showName); saveSettings();});

        function tweenToPoint(e) {
            var newlonlat = W.map.center;
            var newpx = W.map.getLayerPxFromLonLat(newlonlat);
            var begin = {x: WMEMe_Marker.icon.px.x, y:WMEMe_Marker.icon.px.y};
            var end = {x: newpx.x, y:newpx.y};
            console.log('tweenToPoint: '+begin.x+','+begin.y+' '+end.x+','+end.y);
            tween.start(begin, end, 10, { callbacks:{
                eachStep: function(e) {
                    //console.log('eachStep: '+e.x+','+e.y);
                    WMEMe_Marker.icon.moveTo(e);
                },
                done: function(e) {
                    //console.log('done: '+e.x+','+e.y);
                    WMEMe_Marker.moveTo(newpx);
                }}
                                        });
            tween.play();
            if (WMEMe_TempMarker) {
                newLayer.removeMarker(WMEMe_TempMarker);
                WMEMe_TempMarker = null;
            }
        }

        W.map.events.register('zoomend', null, tweenToPoint);
        W.map.events.register('move', null, WMEMe_Drag);
        W.map.events.register('moveend', null, tweenToPoint);
        W.map.events.register('movestart', null, function(e) {
            var iconClone = icon.clone();
            iconClone.setOpacity(0.5);
            WMEMe_TempMarker = new OpenLayers.Marker(W.map.center, iconClone);
            newLayer.addMarker(WMEMe_TempMarker);
        });

        WMEMe_Marker = new OpenLayers.Marker(W.map.center, icon);
        newLayer.addMarker(WMEMe_Marker);
    }

//    function SetName(ShowUsername){
//        if(ShowUsername){
//            $('#WMEME_name')[0].innerHTML = WazeWrap.User.Username();
//            $('#WMEME_name').css('position','absolute').css('left','16px').css('position','absolute').css('text-align','center').css('pointer-events','none').css('font-size','12px').css('top','2px').css('color','white').css('left','initial');
//        }
//        else{
//            $('#WMEME_name')[0].innerHTML = "Me!";
//            $('#WMEME_name').css('position','absolute').css('position','absolute').css('left','16px').css('pointer-events','none').css('font-size','12px').css('top','2px').css('color','white');
//        }
//    }

    function WMEMe_Bootstrap() {
        console.log('WMECrosshair_Bootstrap');
        if ($('#user-info') !== undefined && W && W.map && W.model && W.model.chat && W.model.chat.attributes && OpenLayers && OpenLayers.Layer && WazeWrap.User) {
            // Found the me panel
            WMEMe_Install();
        }
        else {
            // Try again in a second
            setTimeout(WMEMe_Bootstrap, 1000);
        }
    }

    WMEMe_Bootstrap();

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("WMECrosshair_Settings"));
        var defaultSettings = {
            layerEnabled: false,
            showName: false
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }

    }

     function saveSettings() {
        if (localStorage) {
            var localsettings = {
                layerEnabled: settings.layerEnabled,
                showName: settings.showName
            };

            localStorage.setItem("WMECrosshair_Settings", JSON.stringify(localsettings));
        }
    }
})();
