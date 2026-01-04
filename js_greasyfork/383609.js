// ==UserScript==
// @name         	WME HN Eraser
// @description		Removes all HNs on street in one click
// @version      	2019.05.27
// @author			SAR85/JustinS83/MajkiiTelini
// @copyright		SAR85/JustinS83
// @license		 	CC BY-NC-ND
// @grant		 	none
// @include			/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace		https://greasyfork.org/cs/users/110192
// @downloadURL https://update.greasyfork.org/scripts/383609/WME%20HN%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/383609/WME%20HN%20Eraser.meta.js
// ==/UserScript==

/* global W */

(function () {
    'use strict';
    var hnMarkerLayer;
    var debug = false;

	function checkForHNLayer() {
		var layers = W.map.getLayersByName('houseNumberMarkers');
		if (layers.length > 0) {
			hnMarkerLayer = layers[0];
		}
    }

    function delayedCheckForHNLayer(){
        setTimeout(checkForHNLayer, 1500);
    }

    function toggleInterface(){
        if(W.editingMediator.attributes.editingHouseNumbers){
            checkForHNLayer();

            W.model.actionManager.events.unregister("afterundoaction",null, checkForHNLayer);
            W.model.actionManager.events.unregister("afterclearactions",null, delayedCheckForHNLayer);
            W.model.actionManager.events.unregister("afteraction",null, checkForHNLayer);
            W.model.actionManager.events.unregister("noActions", null, checkForHNLayer);

            W.model.actionManager.events.register("afterundoaction",null, checkForHNLayer);
            W.model.actionManager.events.register("afterclearactions",null, delayedCheckForHNLayer);
            W.model.actionManager.events.register("afteraction",null, checkForHNLayer);
            W.model.actionManager.events.register("noActions", null, checkForHNLayer);

            if(WazeWrap.User.Rank() > 3){
                var $HNToolClearHNs = $("<div>");
                $HNToolClearHNs.html([
                    '<div id="HNToolClearHNsDiv" class="toolbar-button" title="Clear house numbers" style="float:left;">',
                    '<span id="HNToolClearHNsButton"><i class="fa fa-times-circle" style="color:red;" aria-hidden="true"></i> Clear HNs</span>',
                    '</div>'
                ].join(' '));
                $('.add-house-number').before($HNToolClearHNs.html());
                $('#HNToolClearHNsButton').click(clearHNs);
            }
        }
        else{
            W.model.actionManager.events.unregister("afterundoaction",null, checkForHNLayer);
            W.model.actionManager.events.unregister("afterclearactions",null, delayedCheckForHNLayer);
            W.model.actionManager.events.unregister("afteraction",null, checkForHNLayer);
            W.model.actionManager.events.unregister("noActions", null, checkForHNLayer);
        }
    }

    function clearHNs(){
        let HouseNumber = require('Waze/Actions/DeleteHouseNumber');
        let currMarker;
		W.model.actionManager.add(new HouseNumber(W.map.getLayersByName('houseNumberMarkers')[0].markers[0].model));
        let markerCount = W.map.getLayersByName('houseNumberMarkers')[0].markers.length;
        for(let i = markerCount -1; i > -1; i--){
            currMarker = W.map.getLayersByName('houseNumberMarkers')[0].markers[i];
			W.model.actionManager.add(new HouseNumber(currMarker.model));
        }
    }

    function hnInit() {
        W.editingMediator.on('change:editingHouseNumbers', toggleInterface);
		console.debug('HN Tool: Initialized.');
    }

    function hnBootstrap(count) {
        count = count || 0;

        if (W &&
            W.map &&
            W.map.events &&
            W.map.events.register &&
            W.loginManager &&
            W.loginManager.user &&
            require && WazeWrap.Ready) {
            console.debug('HN Tool: Initializing...');
            hnInit();

		} else if (count < 10) {
			console.debug('HN Tool: Bootstrap failed. Trying again...');
			setTimeout(function () {hnBootstrap(++count);}, 1000);
		} else {
			console.error('HN Tool: Bootstrap error.');
		}
    }

	console.debug('HN Tool: Bootstrap...');
    hnBootstrap();
} ());