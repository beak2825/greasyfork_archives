// ==UserScript==
// @name         Enlarge Segment Geo Handles
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @description  Enlarges the geometry handles on segments so they are easier to find
// @version      2023.03.21.01
// @author       JustinS83
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/412932/Enlarge%20Segment%20Geo%20Handles.user.js
// @updateURL https://update.greasyfork.org/scripts/412932/Enlarge%20Segment%20Geo%20Handles.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */

(function() {
    'use strict';

    function bootstrap(tries = 1) {
        if (W &&
            W.map &&
            W.model &&
            W.loginManager.user &&
            $ &&
            WazeWrap.Ready)
            init();
        else if (tries < 1000)
            setTimeout(function () {bootstrap(++tries);}, 200);
    }

    function init(){
        registerEvents(changeGeoHandleStyle);
    }

    function changeGeoHandleStyle(){
        if(WazeWrap.hasSegmentSelected()){
            setTimeout(function(){
                let controls = W.map.controls.find((c) => c.dragControl != null); //W.map.controls.find((c) => c.displayClass === "WazeControlModifyFeatureSegment");
                let rules = controls.sketchLayer.styleMap.styles.default.rules;
                debugger;
                for(let i=0; i< rules.length; i++){
                    if(rules[i].id === "OpenLayers_Rule_5"){ //2023-03-21 was Rule_30
                        rules[i].symbolizer.pointRadius = 8;
                        break;
                    }
                }
                controls.resetVertices()
                unregisterEvents(changeGeoHandleStyle);
            },100);
        }
    }

    function registerEvents(handler){
        WazeWrap.Events.register("selectionchanged", null, handler);
        WazeWrap.Events.register("afterundoaction",null, handler);
        WazeWrap.Events.register("afterclearactions",null, handler);
        WazeWrap.Events.register("afteraction",null, handler);
    }

    function unregisterEvents(handler){
        WazeWrap.Events.unregister("selectionchanged", null, handler);
        WazeWrap.Events.unregister("afterundoaction",null, handler);
        WazeWrap.Events.unregister("afterclearactions",null, handler);
        WazeWrap.Events.unregister("afteraction",null, handler);
    }

    bootstrap();
})();