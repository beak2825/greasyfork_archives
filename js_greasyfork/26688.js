// ==UserScript==
// @name         	WME HN Tool (beta) - JS83
// @description		Highlights un-nudged house numbers
// @version      	1.40.9
// @author		SAR85/JustinS83
// @copyright		SAR85
// @license		CC BY-NC-ND
// @grant		none
// @include		https://www.waze.com/editor*
// @include		https://www.waze.com/*/editor*
// @include		https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @namespace		https://greasyfork.org/users/30701-justins83-waze
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @downloadURL https://update.greasyfork.org/scripts/26688/WME%20HN%20Tool%20%28beta%29%20-%20JS83.user.js
// @updateURL https://update.greasyfork.org/scripts/26688/WME%20HN%20Tool%20%28beta%29%20-%20JS83.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function () {
    'use strict';
    var hnControl,
        hnControlPrototype,
        hnMarkerLayer,
        messageBar;
    
    /**
     * Changes the highlight status of an HN marker.
     * @param {Object} marker The HN marker to highlight.
     * @param {Boolean} highlight True to highlight, false to unhighlight.
     */
    function changeHighlight(marker, highlight) {
        //var color = highlight ? '#FFAD85' : 'white';
        if (marker) {
            marker.icon.$div.find('.uneditable-number').
                    css('background-color', highlight);

            if(marker.inputWrapper)
                marker.inputWrapper.css('background-color', highlight);
        }
    }

    /**
     * Nudges all currently loaded house numbers.
     */
    function nudgeAll() {
        var i,
            n,
            currentMarker,
            count = 0,
            hnMarkers = hnMarkerLayer.markers,
            objectForUpdate,
            oldGeometry;

        if (!hnControl) { return; }

        if (hnControl.selectedNumber) {
            hnControl.unselectNumber(hnControl.selectedNumber);
        }

        objectForUpdate = {
            model: W.model,
            houseNumberSets: hnControl.houseNumberSets,
            ignoreUpdates: hnControlPrototype.prototype.ignoreUpdates,
            originalGeometry: null,
            selectedNumber: null
        };

        for (i = 0, n = hnMarkers.length; i < n; i++) {
            currentMarker = hnMarkers[i];

            if (currentMarker && null === currentMarker.model.updatedBy) {
                oldGeometry = currentMarker.model.geometry.clone();
                currentMarker.model.geometry.x += 0.0001;

                objectForUpdate.originalGeometry = oldGeometry;
                objectForUpdate.selectedNumber = currentMarker;

                hnControlPrototype.prototype.onDragEnd.call(objectForUpdate,
                    objectForUpdate);
                count++;
            }
        }

        messageBar.displayMessage({
            messageText: count + ' house numbers nudged.',
            messageType: 'info'
        });
    }
 
    /**
     * Highlights never-edited house numbers.
     */
	function highlightUntouched(retryCount) {
        console.log("HN Tool - highlightUntouched");
        var i,
            n,
            marker,
            hnMarkers;
		retryCount = retryCount || 0;
		hnMarkers = hnMarkerLayer.markers;
		if (hnMarkers.length === 0) {
			if (retryCount < 1000) {
				console.debug('HN Tool: HN Markers not found. Retry #' + (retryCount + 1));
				setTimeout(function () {
					highlightUntouched(++retryCount);
				}, 10);
			} else {
				console.debug('HN Tool: HN Markers not found. Giving up.');
				return;
			}
		}
		for (i = 0, n = hnMarkers.length; i < n; i++) {
			marker = hnMarkers[i];
            var color = 'white';
			if (marker.model && null === marker.model.updatedBy)
                color = '#FFAD85';
            else if (marker.model && marker.model.updatedBy === W.loginManager.user.id)
                color = '#85ffad';

            changeHighlight(marker, color);
            }
		}

    /**
     * Checks for the presence of the HN map layer.
     */
	function checkForHNLayer() {
		var layers = W.map.getLayersByName('houseNumberMarkers');
		if (layers.length > 0) {
			hnMarkerLayer = layers[0];
			highlightUntouched();
		}
    }
    
    function delayedCheckForHNLayer(){
        setTimeout(checkForHNLayer, 1500);
    }

    /**
     * Stores version and changes info and alerts user.
     */
	function updateAlert() {
		var hnVersion = '1.40.4',
			alertOnUpdate = true,
            versionChanges = 'WME Highlight HNs has been updated to ' +
                hnVersion + '.\n';

        versionChanges += 'Changes:\n';
        versionChanges += '[*] House Nuumbers last updated by you will be highlighted light green.';

        if (alertOnUpdate && window.localStorage &&
            window.localStorage.hnVersion !== hnVersion) {
			window.localStorage.hnVersion = hnVersion;
			alert(versionChanges);
		}
    }

    /**
     * Initializes the script variables.
     */
    var saving = false;
    function hnInit() {
        var segmentEditor = window.require('Waze/Feature/Vector/Segment');

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {

                if($('[class~="house-numbers-layer"]').length === 1){
                    checkForHNLayer();

                    W.model.actionManager.events.unregister("afterundoaction",null, checkForHNLayer);
                    W.model.actionManager.events.unregister("afterclearactions",null, delayedCheckForHNLayer);
                    W.model.actionManager.events.unregister("afteraction",null, checkForHNLayer);
                    W.model.actionManager.events.unregister("noActions", null, checkForHNLayer);

                    W.model.actionManager.events.register("afterundoaction",null, checkForHNLayer);
                    W.model.actionManager.events.register("afterclearactions",null, delayedCheckForHNLayer);
                    W.model.actionManager.events.register("afteraction",null, checkForHNLayer);
                    W.model.actionManager.events.register("noActions", null, checkForHNLayer);
                }
                else{
                    W.model.actionManager.events.unregister("afterundoaction",null, checkForHNLayer);
                    W.model.actionManager.events.unregister("afterclearactions",null, delayedCheckForHNLayer);
                    W.model.actionManager.events.unregister("afteraction",null, checkForHNLayer);
                    W.model.actionManager.events.unregister("noActions", null, checkForHNLayer);

                }
            });
        });

        var observerConfig = {
            childList: true
        };

        var targetNode = $('[id~="OpenLayers.Map_178_OpenLayers_Container"]')[0];
        observer.observe(targetNode, observerConfig);

        /*
        var customRender = function () {
                hnControlPrototype.prototype.render.call(hnControl);
                checkForHNLayer();
            },
            customOnDragEnd = function () {
                hnControlPrototype.prototype.onDragEnd.call(hnControl);
                changeHighlight(hnControl.selectedNumber, '#FFAD85');
            };

        var editHNs = function () {
            var e = this.model.children.clone(),
                t = this.model.children.first(),
                i = t.getEntireStreet(this.dataModel),
                y = window.require('Waze/Control/HouseNumbers'),
                n = new y({
                    model: this.dataModel,
                    map: W.map,
                    editable: t.canEditHouseNumbers(),
                    segments: i
                });
            n.on("destroy", function () {
                this.selectionManager.select(e);
                hnControl = null;
            }, this);
            hnControl = n;
            hnControl.render = customRender;
            hnControl.onDragEnd = customOnDragEnd;
        };

        hnControlPrototype = window.require('Waze/Control/HouseNumbers') ||
        function () { };

        console.log(segmentEditor.prototype.editHouseNumbers);
        segmentEditor.prototype.editHouseNumbers = editHNs;

        console.log(segmentEditor.prototype.editHouseNumbers);
        window.require.define('Waze/Feature/Vector/Segment', segmentEditor);*/
        /*
		messageBar = new wLib.Interface.MessageBar({
			messagePrefix: 'WME HN Tool:'
        });
        */
        if (WazeWrap.User.Rank > 2) {
            new WazeWrap.Interface.Shortcut('nudgeHN', 'editing', 'CS+h', nudgeAll, this).add();
        }

		console.debug('HN Tool: Initialized.');
		updateAlert();
    }

    /**
     * Checks for necessary DOM and WME elements before initialization.
     */
    function hnBootstrap(count) {
        count = count || 0;

        if (
            window.W &&
            window.W.map &&
            window.W.map.events &&
            window.W.map.events.register &&
            window.W.loginManager &&
            window.W.loginManager.user &&
            window.W.loginManager.user.normalizedLevel &&
            window.require) {
            console.debug('HN Tool: Initializing...');
            hnInit();
            /*
            $.get(W.Config.api_base + '/info/version').done(function (data) {
                if (data.version === '1.2.104-4369560') {
                    hnInit();
                } else {
                    console.error(
                        'HN Tool: WME version problem. Contact SAR85.');
                }
            }).fail(function () {
                console.error('HN Tool: WME version could not be verified.');
            });
            */
		} else if (count < 10) {
			console.debug('HN Tool: Bootstrap failed. Trying again...');
			window.setTimeout(function () {
				hnBootstrap(++count);
			}, 1000);
		} else {
			console.error('HN Tool: Bootstrap error.');
		}
    }
    
	console.debug('HN Tool: Bootstrap...');
    hnBootstrap();
} ());