// ==UserScript==
// @name         # of parking spots estimator thingy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28909/%20of%20parking%20spots%20estimator%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/28909/%20of%20parking%20spots%20estimator%20thingy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var drawControl;
    var isDrawing = false;
    var layerName = 'parking spot test';
    var newPlaceLayer;

    function doneHandler(geom){
        //drawControl.destroy();
        newPlaceLayer.addFeatures(new OL.Feature.Vector(geom));

        var totalSpots = 0;
        newPlaceLayer.features.forEach(function(f) {
            var spots = Math.round(f.geometry.getLength()/3.44);
            totalSpots += spots;
        });

        console.log(totalSpots);
        isDrawing = false;
    }

    function pointHandler() {
        isDrawing = true;
    }

    function clearLayer() {
        newPlaceLayer.removeAllFeatures();
    }

    function startPlacementMode(){
        console.log('ok');
        var polyDrawFeatureOptions = {callbacks : {"done": doneHandler, "point": pointHandler}};

        drawControl = new OpenLayers.Control.DrawFeature(newPlaceLayer, OpenLayers.Handler.Path, polyDrawFeatureOptions);
        W.map.addControl(drawControl);
        drawControl.activate();

        document.addEventListener('keyup', keyUpHandler, false);
    }

    function disablePlacementMode(){
        $("#map").off('click');//, endPlacementMode);
        drawControl.deactivate();
        drawControl.destroy();
        clearLayer();
        document.removeEventListener('keyup', keyUpHandler);
    }

    function keyUpHandler(e){
        if (e.keyCode == 27){
            if (isDrawing) {
                drawControl.cancel();
                isDrawing = false;
            } else {
                disablePlacementMode();
                if(drawControl !== "undefined")
                    drawControl.destroy();
            }
        }
        else if(e.keyCode == 90 && e.ctrlKey)
            drawControl.undo();
        else if(e.keyCode == 89 && e.ctrlKey)
            drawControl.redo();
        else if(e.keyCode == 13)
            drawControl.finishSketch();
    }

    function init() {
        $('.level-icon').click(function() {
            if (drawControl && drawControl.active) {
                disablePlacementMode();
            } else {
                startPlacementMode();
            }
        });

        newPlaceLayer = new OL.Layer.Vector(layerName,{displayInLayerSwitcher: false});
        W.map.addLayer(newPlaceLayer);
    }

    function bootstrap() {
        if (W && W.loginManager && W.loginManager.isLoggedIn()) {
            init();
        } else {
            setTimeout(bootstrap, 250);
        }
    }

    bootstrap();
})();