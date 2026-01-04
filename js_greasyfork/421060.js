// ==UserScript==
// @name         The Revolutionary RevCon Resolver
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2021.02.02
// @description  Standalone RevCon Solution
// @author       SkiDooGuy
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/421060/The%20Revolutionary%20RevCon%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/421060/The%20Revolutionary%20RevCon%20Resolver.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global OL */
/* global _ */
/* global require */


const revConImg = 'data:image/png;base64,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';
const recConImgDisabled = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAE6klEQVRIicWWa2xURRTHfzN3d+9uH7t93N0tEbpiCy5VpAFFiGCEiEAINuCbEBFMISGVqB+QmEAUQWOIJARN1EhrIAGDoYaoUULxi/WL8YMaYkiMn3hDpA+23ZbdvWNm9lVq0RYqTnKzO2dmzv/8/+fMuZf/a1g3iVsGbAAWA2eArtsVfxsCZR74Eai6HaDrkKiGWFwtemShilY4GvzT/xrUAa5ErGrV2dGhOo93qMdmLFRIMsCcsTgaa453WZZ8+MvD7eBVSCmJ1dXyy7GfRVem554cczUaR3IMoHEEzWsWrsIT8mBZFvKaZPKdk+m2+7SnucCq0TobC/BbNT7H29zyIiJncH0uynLZv+9jZgcbteltoHI8gZcjeTJluyhfTkmVewRkyDBpVoyAx54IbB4vYC/wxrzo/Xx1oB3X4yISku2bdrLm+XUkTicIBoO8+tomHKVrj5dNWsZhvGJJS33fflz9cOyE+vbwUTWlrj7PV4VKA6a6O4+fUN8d+UbdFYpp+5FbZRwGtpQQoMftNYbSYCm9vb2FDcmBFCIlEBnoTfeSGXS1/CuBJbcCvCNcXhlp/+IQoVDQ5FNY4FRVFyPzOjAozJq2f952kAdsU2jvAp6bAZ6BYG04EiVQGkAIYcQVCKrKKsmXtmtDUiVRUiFTkmvOINXxsO4Q9wEbb+Rc3MCuA+qYaEcXbN/1JlMb6nMoWeD+RD+Lnlquy5n9H35CtCZCwOvH8mb7UTKZZOmKFaTc1HmgAegeLeOVSBZc9SSZenc9whWFMDWzQHmAEss282g0gi1tpGUZRfS6v8TPyoeasD2eCcDO0Uod0I3gQV8jXx9tN01VOzO4qhhAhQhlN3v9eP0e8BQ7pZZ8VfPT1JUbpTaMdL1GAm6ZPq1hSt+EVJZp3p9mI4qd2CdsUzrSloXA9K854wqciMPePe/h+Cq1/ruHp3U4cC2wtf9SP8tWLEYJhcgUt8i0KARR768vzil2MROcpQOATMBlklOrUZaa7vcPwNuqvKHyYCTE3Nmzs44styCv7lr54Qt6qbUnFOUfQkgzV5aipCLA+227mROYqc07cl8uZgy9Z/MRrItGa9jYsh7HcQoLBckNI3OneL11MypdzD/arrK/ygKREYUgkr401oCYnsmol4B3GPI+1swP3BuIxz44uIdIOGyujSGRf4Zro3JLmrEs5t7MRVEAHfTk+hhnO89xLnVB3+1DQG/e3Vos5l/wXyaRSGSbxQ2GzEiudid4tGkZS55o4uL5S9nEiiE5zs2tQQuRFkybFWf+c/MI+crCuY5mtmvdT1bKUKy17SPCdzjXl6+4nmV60OWZ1au52H3JmMrKyjjWfjQrucofuP5qadOffVdY39zC+e4L11DM1VJvtT3exz9r3U9FTch8zhQARbFa87K5ymVmYyOnfj1J10AP29ZsYWJ8ElIOOTAkWHPG6xKw/TQtXsYfP/1une46F9fF9WxcTGXAM0iQkNlYKJgCAZErGoVHepgSr6NtX6uZ/02VfJBKmE8jDZr3aVfYpINmzyxD74w6S+JKH6SzcmVfc7mXgitMwRbVU0ghs6AiW706j+Zxh+xz9V+FGJTGpiWXScnJU7+Ro8ILwL5oZbX0uTbJvuSIVZVPgeu6I67/6xCQUil6MgkdyMca2B7Pz5VRjMvA3tuENWwAfwH2n6NFrwa86QAAAABJRU5ErkJggg==';
let SetTurn; 
let UpdateObject;
let rcSettings = {};
let rcHighlightsLayer;
let nodesToFix = [];

function rcBootstrap(rctries = 0) {
    if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready) {
        // console.log('RC: Starting');
        initRC();
    } else if (rctries < 500) {
        setTimeout(() => {
            rcBootstrap(rctries + 1);
        }, 200);
    } else {
        console.error('RC: Failed to load');
    }
}

function initRC() {

    // Get stored settings
    const localSettings = $.parseJSON(localStorage.getItem('rcSettings'));
    const defaultSettings = {
        rcHighEn: true,
        rcFixEn: true
    }

    if (localSettings) {
        rcSettings = $.extend({}, defaultSettings, localSettings);
    } else {
        rcSettings = defaultSettings;
    }

    createElements();
    // ModifyConnection = require("Waze/Action/ModifyConnection");
    SetTurn = require("Waze/Model/Graph/Actions/SetTurn");
    UpdateObject = require("Waze/Action/UpdateObject");
}

function createElements() {
    // Create UI elements
    const $rcContainer = $('<div class="form-group" />');
    const $rcContLabel = $(`<label class="control-label">The Revolutionary RevCon Resolver</label>`);
    const $rcControls = $('<div class="controls-container" />');
    const $rcHighEn = $('<input type="checkbox" name="rcHighEn" id="rcHighEn">');
    const $rcHighEnLbl = $('<label for="rcHighEn">Highlights</label></br>');
    const $rcFixEn = $('<input type="checkbox" name="rcFixEn" id="rcFixEn">');
    const $rcfixEnLbl = $('<label for="rcFixEn">Fix Them</label>');

    $rcHighEn.appendTo($rcControls);
    $rcHighEnLbl.appendTo($rcControls);
    $rcFixEn.appendTo($rcControls);
    $rcfixEnLbl.appendTo($rcControls);
    $rcContLabel.appendTo($rcContainer);
    $rcControls.appendTo($rcContainer);

    // Attach elements to UI
    $rcContainer.appendTo('#sidepanel-prefs > div > div > form');

    $('#rcHighEn').prop('checked', rcSettings['rcHighEn']);
    $('#rcFixEn').prop('checked', rcSettings['rcFixEn']);

    $('#rcHighEn').change(function () {
        rcSettings['rcHighEn'] = $(this).prop('checked');
        localStorage.setItem('rcSettings', JSON.stringify(rcSettings));
        toggleLayer();
    });
    $('#rcFixEn').change(function () {
        rcSettings['rcFixEn'] = $(this).prop('checked');
        localStorage.setItem('rcSettings', JSON.stringify(rcSettings));
        toggleFix();
    });

    if ($('#rcHighEn').prop('checked') === true) toggleLayer();
    if ($('#rcFixEn').prop('checked') === true) toggleFix();
}

function toggleLayer() {
    if ($('#rcHighEn').prop('checked') === true) {
        // Create layer for highlights
        rcHighlightsLayer = new OpenLayers.Layer.Vector('rcHighlights', { uniqueName: 'rcHighlights' });
        W.map.addLayer(rcHighlightsLayer);
        rcHighlightsLayer.setVisibility(true);

        // Register WME event listeners
        W.map.events.register('moveend', null, removeHighlights);
        W.map.events.register('moveend', null, detectRevcons);
        W.model.actionManager.events.register('afteraction', null, removeHighlights);
        W.model.actionManager.events.register('afteraction', null, detectRevcons);
        W.model.actionManager.events.register('afterundoaction', null, removeHighlights);
        W.model.actionManager.events.register('afterundoaction', null, detectRevcons);
        W.model.actionManager.events.register('afterclearactions', null, removeHighlights);
        W.model.actionManager.events.register('afterclearactions', null, detectRevcons);

        detectRevcons();
    } else {
        // Remove layer
        W.map.removeLayer(rcHighlightsLayer);

        // Remove WME event listeners
        W.map.events.unregister('moveend', null, removeHighlights);
        W.map.events.unregister('moveend', null, detectRevcons);
        W.model.actionManager.events.unregister('afteraction', null, removeHighlights);
        W.model.actionManager.events.unregister('afteraction', null, detectRevcons);
        W.model.actionManager.events.unregister('afterundoaction', null, removeHighlights);
        W.model.actionManager.events.unregister('afterundoaction', null, detectRevcons);
        W.model.actionManager.events.unregister('afterclearactions', null, removeHighlights);
        W.model.actionManager.events.unregister('afterclearactions', null, detectRevcons);

    }
    
}

function toggleFix() {
    if ($('#rcFixEn').prop('checked') === true) {
        const $rcFixCont = $('<div id="rcFixCont" style="display:inline-block;width:60px;height:100%;" />');
        const $rcFixDiv = $('<div style="padding-left:15px;margin-top:16px;" />');
        const $rcFixButton = $(`<img id='rcFixImg' height='20px' width='20px' src=${recConImgDisabled} />`);

        $rcFixButton.appendTo($rcFixDiv);
        $rcFixDiv.appendTo($rcFixCont);
        $rcFixCont.insertBefore('#edit-buttons > div > div.toolbar-button.ItemDisabled.toolbar-button-with-icon.waze-icon-trash');

        detectRevcons();
    } else {
        $('#rcFixCont').remove();
    }
}

function removeHighlights() {
    let rcLayer = W.map.getLayerByUniqueName('rcHighlights');
    rcLayer.removeAllFeatures();

    $("#rcFixImg").attr("src", recConImgDisabled);
    $("#rcFixImg").css('cursor', 'default');
    $("#rcFixImg").off();
}

function Label_Distance() {
    let label_distance;
    switch (W.map.getOLMap().getZoom()) {
        case 9:
            label_distance = 2;
            break;
        case 8:
            label_distance = 4;
            break;
        case 7:
            label_distance = 7;
            break;
        case 6:
            label_distance = 12;
            break;
        case 5:
            label_distance = 20;
            break;
        case 4:
            label_distance = 40;
            break;
        case 3:
            label_distance = 70;
            break;
        case 2:
            label_distance = 150;
            break;
        case 1:
            label_distance = 200;
            break;
    }
    return label_distance;
}

function detectRevcons() {
    nodesToFix = [];

    // Detect and highlight RevCons
    for (var currentNode in W.model.nodes.objects) {
        var node = W.model.nodes.getObjectById(currentNode);
        if (node === undefined)
            continue;

        // ignore dead-end nodes
        if (node.attributes.segIDs.length <= 1) {
            continue;
        }

        var numRevConns = 0;

        // find allowed turns against segment direction
        var seg1, seg2;
        for (var i = 0; i < node.attributes.segIDs.length - 1; i++) {
            seg1 = W.model.segments.getObjectById(node.attributes.segIDs[i]);
            for (var j = i + 1; j < node.attributes.segIDs.length; j++) {
                seg2 = W.model.segments.getObjectById(node.attributes.segIDs[j]);
                if (seg1 != undefined && seg2 != undefined) {
                    if (seg1.isDeleted() == false && seg2.isDeleted() == false) {
                        var fwd_t = seg1.isTurnAllowed(seg2, node);
                        var rev_t = seg2.isTurnAllowed(seg1, node);
                        var fwd_a = node.isTurnAllowedBySegDirections(seg1, seg2);
                        var rev_a = node.isTurnAllowedBySegDirections(seg2, seg1);
                        if ((fwd_t && !fwd_a) || (rev_t && !rev_a)) {
                            // Check for unkown direction on either segment
                            if (!(seg1.attributes.fwdDirection == false && seg1.attributes.revDirection == false)
                                && !(seg2.attributes.fwdDirection == false && seg2.attributes.revDirection == false)) {
                                
                                numRevConns++;
                                if (!nodesToFix.includes(node.attributes.id)) {
                                    nodesToFix.push(node.attributes.id);
                                }
                            }

                        }
                    }
                }
            }
        }

        if (numRevConns > 0) {
            // Update button img
            $("#rcFixImg").attr("src", revConImg);
            $("#rcFixImg").css('cursor', 'pointer');
            $("#rcFixImg").off();
            $("#rcFixImg").click(function() { fixRevcons(); });
        
            if ($('#rcHighEn').prop('checked') === true) highlightRevcons(node);
        }
    }
}

function highlightRevcons(node) {
    let rcLayer = W.map.getLayerByUniqueName('rcHighlights');
    var points = [];
    // Node coords
    var pointNode = new OpenLayers.Geometry.Point(node.geometry.getVertices()[0].x, node.geometry.getVertices()[0].y);
    points.push(pointNode);

    // Label coords
    var pointLabel = new OpenLayers.Geometry.Point(node.geometry.getVertices()[0].x + Label_Distance(), node.geometry.getVertices()[0].y + Label_Distance());
    points.push(pointLabel);

    var styleNode = {
        strokeColor: "#FF00FF",
        strokeOpacity: 0.75,
        strokeWidth: 4,
        fillColor: "#0000FF",
        pointRadius: 3
    };

    var styleLabel = {
        externalGraphic: revConImg,
        graphicHeight: 30,
        graphicWidth: 30
    };

    // Point on node
    var pointFeature = new OpenLayers.Feature.Vector(pointNode, null, styleNode);
    rcLayer.addFeatures([pointFeature]);

    // Line between node and label
    var newline = new OpenLayers.Geometry.LineString(points);
    var lineFeature = new OpenLayers.Feature.Vector(newline, null, styleNode);
    rcLayer.addFeatures([lineFeature]);

    // Label
    var pointFeature = new OpenLayers.Feature.Vector(pointLabel, null, styleLabel);
    rcLayer.addFeatures([pointFeature]);
}

function fixRevcons() {
    let numNodes = nodesToFix.length;

    if (numNodes > 0) {
        let turnGraph = W.model.getTurnGraph();
        let fixedRevCons = 0;

        for (let n = 0; n < numNodes; n++) {
            let node = W.model.nodes.getObjectById(nodesToFix[0]);
            var seg1, seg2;

            for (var i = 0; i < (node.attributes.segIDs.length - 1); i++) {
            seg1 = W.model.segments.getObjectById(node.attributes.segIDs[i]);

                for (var j = i + 1; j < node.attributes.segIDs.length; j++) {
                    seg2 = W.model.segments.getObjectById(node.attributes.segIDs[j]);
                    console.log(`Node: ${node.attributes.id} into seg: ${seg2.attributes.id}`);

                    if (seg1.isDeleted() == false && seg2.isDeleted() == false) {
                        var fwd_t;
                        var rev_t;
                        var fwd_a;
                        var rev_a;

                        if (node.attributes.connections) {
                            fwd_t = node.isTurnAllowed(seg1, seg2);
                            rev_t = node.isTurnAllowed(seg2, seg1);
                        } else {
                            fwd_t = seg1.isTurnAllowed(seg2, node);
                            rev_t = seg2.isTurnAllowed(seg1, node);
                        }

                        fwd_a = node.isTurnAllowedBySegDirections(seg1, seg2);
                        rev_a = node.isTurnAllowedBySegDirections(seg2, seg1);

                        if (fwd_t && !fwd_a) {
                            // console.log("Disabling RevCon from", node.getID(), "into", seg2.getID());
                            let turnStatus = turnGraph.getTurnThroughNode(node, seg1, seg2);
                            let turnData = turnStatus.getTurnData();

                            turnData = turnData.withToggledState();
                            turnStatus = turnStatus.withTurnData(turnData);
                            W.model.actionManager.add(new SetTurn(turnGraph, turnStatus));
                            fixedRevCons++;
                        }
                        if (rev_t && !rev_a) {
                            // console.log("Disabling RevCon from", node.getID(), "into", seg1.getID());
                            let turnStatus = turnGraph.getTurnThroughNode(node, seg2, seg1);
                            let turnData = turnStatus.getTurnData();

                            turnData = turnData.withToggledState();
                            turnStatus = turnStatus.withTurnData(turnData);
                            W.model.actionManager.add(new SetTurn(turnGraph, turnStatus));
                            fixedRevCons++;
                        }
                        if ((seg1.attributes.fromNodeID == seg2.attributes.fromNodeID && seg1.attributes.toNodeID == seg2.attributes.toNodeID) ||
                            (seg1.attributes.fromNodeID == seg2.attributes.toNodeID && seg1.attributes.toNodeID == seg2.attributes.fromNodeID)) {
                            console.log("sid:", seg1.getID(), "and sid:", seg2.getID(), "connected to same nodes:", seg1.attributes.fromNodeID, seg1.attributes.toNodeID);
                        // WMETB_JNF_smn(seg1, seg2);
                        }
                    }
                }

                if (!seg1.isDeleted() && !seg1.areTurnsLocked(node)) {
                    var attr = seg1.getTurnsLockAttribute(node);
                    var dict = {}
                    dict[attr] = true;
                    // console.log("Locking Turns at", node.getID(), "on", seg1.getID());
                    W.model.actionManager.add(new UpdateObject(seg1, dict));
                }
            }

            if (!seg2.isDeleted() && !seg2.areTurnsLocked(node)) {
                var attr = seg2.getTurnsLockAttribute(node);
                var dict = {}

                dict[attr] = true;
                // console.log("Locking Turns at", node.getID(), "on", seg2.getID());
                W.model.actionManager.add(new UpdateObject(seg2, dict));
            }
        }

        WazeWrap.Alerts.info(GM_info.script.name, `Eradicated ${fixedRevCons} RevCons on ${numNodes} nodes`);
        nodesToFix = [];
    } else {
        WazeWrap.Alerts.error(GM_info.script.name, `There are no RevCons to fix. And you shouldn't see this message. What did you break????`);
    }
}

rcBootstrap();
