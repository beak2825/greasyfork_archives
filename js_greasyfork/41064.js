// ==UserScript==
// @name        WME: Remove Junction Nodes
// @namespace   http://gdp.org
// @description Removes Junction Nodes with keyboard shortcut "J"
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.0.3
// @grant       none
// @require https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=264605
// @downloadURL https://update.greasyfork.org/scripts/41064/WME%3A%20Remove%20Junction%20Nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/41064/WME%3A%20Remove%20Junction%20Nodes.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

(function() {

    var removeJunctionNodes;

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.require &&
            WazeWrap.Interface &&
            $) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function init(){

        new WazeWrap.Interface.Shortcut('removeJunctionNodes', 'Removes Junction Nodes', 'editing', 'Editing', 'J', removeNodes, this).add();

    }

    function removeNodes(){

        javascript: (function() {
            if (typeof(require) == "undefined") {
                MergeSegments = W.Action.MergeSegments;
            } else {
                MergeSegments = require("Waze/Action/MergeSegments");
            }
            if (typeof(onScreen) == "undefined") {
                function onScreen(obj) {
                    if (obj.geometry) {
                        return (W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
                    }
                    return (false);
                }
            }
            var count = 0;
            _.each(W.model.nodes.objects, function(v,k) {
                if (count < 40) {
                    if (v.areConnectionsEditable() && onScreen(v)) {
                        if (v.attributes.segIDs.length == 2) {
                            var seg1 = W.model.segments.get(v.attributes.segIDs[0]);
                            var seg2 = W.model.segments.get(v.attributes.segIDs[1]);
                            if (seg1 && seg2 && seg1.attributes.primaryStreetID === seg2.attributes.primaryStreetID && seg1.attributes.roadType === seg2.attributes.roadType && seg1.attributes.routingRoadType === seg2.attributes.routingRoadType && seg1.isOneWay() === seg2.isOneWay() && seg1.isDrivable() && seg2.isDrivable()) {
                                var update = true;
                                if (seg1.attributes.fwdRestrictions && seg1.attributes.revRestrictions && seg2.attributes.fwdRestrictions && seg2.attributes.revRestrictions) {
                                    console.log("both have restrictions");
                                    if (seg1.attributes.fwdRestrictions.length === 0 && seg1.attributes.revRestrictions.length === 0 && seg2.attributes.fwdRestrictions.length === 0 && seg2.attributes.revRestrictions.length === 0) {
                                        console.log("s1, s2 fwd, rev restriction lengths all 0");
                                        if (v.attributes.restrictions) {
                                            for (var obj in v.attributes.restrictions) {
                                                update = false;
                                                break;
                                            }
                                        }
                                        if (seg1.attributes.toRestrictions && seg1.getToNode() === v) {
                                            for (var obj in seg1.attributes.toRestrictions) {
                                                update = false;
                                                break;
                                            }
                                        }
                                        if (seg1.attributes.fromRestrictions && seg1.getFromNode() === v) {
                                            for (var obj in seg1.attributes.fromRestrictions) {
                                                update = false;
                                                break;
                                            }
                                        }
                                        if (seg2.attributes.toRestrictions && seg2.getToNode() === v) {
                                            for (var obj in seg2.attributes.toRestrictions) {
                                                update = false;
                                                break;
                                            }
                                        }
                                        if (seg2.attributes.fromRestrictions && seg2.getFromNode() === v) {
                                            for (var obj in seg2.attributes.fromRestrictions) {
                                                update = false;
                                                break;
                                            }
                                        }
                                        if (update && (seg1.attributes.hasOwnProperty("flags") && seg2.attributes.hasOwnProperty("flags") && seg1.attributes.flags != seg2.attributes.flags)) {
                                            console.log("segments have different flags");
                                            update = false;
                                        }
                                        if (update && (seg1.attributes.hasOwnProperty("level") && seg2.attributes.hasOwnProperty("level") && seg1.attributes.level != seg2.attributes.level)) {
                                            console.log("segments have different elevations");
                                            update = false;
                                        }
                                        if (update && ((seg1.attributes.hasOwnProperty("level") && !seg2.attributes.hasOwnProperty("level") && seg1.attributes.level === 0) || (!seg1.attributes.hasOwnProperty("level") && seg2.attributes.hasOwnProperty("level") && seg2.attributes.level === 0))) {
                                            console.log("segments have different elevations");
                                            update = false;
                                        }
                                        if (update && (seg1.attributes.toNodeID === seg1.attributes.fromNodeID || seg2.attributes.toNodeID === seg2.attributes.fromNodeID)) {
                                            console.log("closed loop on s1 or s2");
                                            update = false;
                                        }
                                        if (update && (seg1.attributes.toNodeID !== v.getID() && (seg1.attributes.toNodeID === seg2.attributes.toNodeID || seg1.attributes.toNodeID === seg2.attributes.fromNodeID))) {
                                            console.log(v.getID(), "natural direction match, same nodes");
                                            update = false;
                                        }
                                        if (update && (seg1.attributes.fromNodeID !== v.getID() && (seg1.attributes.fromNodeID === seg2.attributes.toNodeID || seg1.attributes.fromNodeID === seg2.attributes.fromNodeID))) {
                                            console.log(v.getID(), "natural direction mismatch, same nodes");
                                            update = false;
                                        }
                                        if (update && (seg1.attributes.toNodeID === seg2.attributes.fromNodeID || seg1.attributes.fromNodeID === seg2.attributes.toNodeID)) {
                                            if (seg1.attributes.fwdMaxSpeed !== seg2.attributes.fwdMaxSpeed || seg1.attributes.revMaxSpeed !== seg2.attributes.revMaxSpeed) {
                                                console.log(v.getID(), "natural direction match, speed limit mismatch");
                                                update = false;
                                            }
                                        } else {
                                            if (update && (seg1.attributes.revMaxSpeed !== seg2.attributes.fwdMaxSpeed || seg1.attributes.fwdMaxSpeed !== seg2.attributes.revMaxSpeed)) {
                                                console.log(v.getID(), "natural direction mismatch, speed limit mismatch");
                                                update = false;
                                            }
                                        }
                                    } else {
                                        console.log("s1, s2 fwd, rev restriction lengths not 0");
                                        update = false;
                                    }
                                } else {
                                    console.log("neither have restrictions");
                                    if (v.attributes.restrictions) {
                                        for (var obj in v.attributes.restrictions) {
                                            update = false;
                                            break;
                                        }
                                    }
                                    if (seg1.attributes.toRestrictions && seg1.getToNode() === v) {
                                        for (var obj in seg1.attributes.toRestrictions) {
                                            update = false;
                                            break;
                                        }
                                    }
                                    if (seg1.attributes.fromRestrictions && seg1.getFromNode() === v) {
                                        for (var obj in seg1.attributes.fromRestrictions) {
                                            update = false;
                                            break;
                                        }
                                    }
                                    if (seg2.attributes.toRestrictions && seg2.getToNode() === v) {
                                        for (var obj in seg2.attributes.toRestrictions) {
                                            update = false;
                                            break;
                                        }
                                    }
                                    if (seg2.attributes.fromRestrictions && seg2.getFromNode() === v) {
                                        for (var obj in seg2.attributes.fromRestrictions) {
                                            update = false;
                                            break;
                                        }
                                    }
                                    if (update && (seg1.attributes.hasOwnProperty("flags") && seg2.attributes.hasOwnProperty("flags") && seg1.attributes.flags != seg2.attributes.flags)) {
                                        console.log("segments have different flags");
                                        update = false;
                                    }
                                    if (update && (seg1.attributes.hasOwnProperty("level") && seg2.attributes.hasOwnProperty("level") && seg1.attributes.level != seg2.attributes.level)) {
                                        console.log("segments have different elevations");
                                        update = false;
                                    }
                                    if (update && ((seg1.attributes.hasOwnProperty("level") && !seg2.attributes.hasOwnProperty("level") && seg1.attributes.level === 0) || (!seg1.attributes.hasOwnProperty("level") && seg2.attributes.hasOwnProperty("level") && seg2.attributes.level === 0))) {
                                        console.log("segments have different elevations");
                                        update = false;
                                    }
                                    if (update && (seg1.attributes.toNodeID === seg1.attributes.fromNodeID || seg2.attributes.toNodeID === seg2.attributes.fromNodeID)) {
                                        console.log("closed loop on s1 or s2");
                                        update = false;
                                    }
                                    if (update && (seg1.attributes.toNodeID !== v.getID() && (seg1.attributes.toNodeID === seg2.attributes.toNodeID || seg1.attributes.toNodeID === seg2.attributes.fromNodeID))) {
                                        console.log(v.getID(), "natural direction match, same nodes");
                                        update = false;
                                    }
                                    if (update && (seg1.attributes.fromNodeID !== v.getID() && (seg1.attributes.fromNodeID === seg2.attributes.toNodeID || seg1.attributes.fromNodeID === seg2.attributes.fromNodeID))) {
                                        console.log(v.getID(), "natural direction mismatch, same nodes");
                                        update = false;
                                    }
                                    if (update && (seg1.attributes.toNodeID === seg2.attributes.fromNodeID || seg1.attributes.fromNodeID === seg2.attributes.toNodeID)) {
                                        if (seg1.attributes.fwdMaxSpeed !== seg2.attributes.fwdMaxSpeed || seg1.attributes.revMaxSpeed !== seg2.attributes.revMaxSpeed) {
                                            console.log(v.getID(), "natural direction match, speed limit mismatch");
                                            update = false;
                                        }
                                    } else {
                                        if (update && (seg1.attributes.revMaxSpeed !== seg2.attributes.fwdMaxSpeed || seg1.attributes.fwdMaxSpeed !== seg2.attributes.revMaxSpeed)) {
                                            console.log(v.getID(), "natural direction mismatch, speed limit mismatch");
                                            update = false;
                                        }
                                    }
                                }
                                if (update) {
                                    var n1;
                                    var n2;
                                    if (seg1.attributes.toNodeID == v.getID()) {
                                        n1 = W.model.nodes.get(seg1.attributes.fromNodeID);
                                    } else {
                                        n1 = W.model.nodes.get(seg1.attributes.toNodeID);
                                    }
                                    if (seg2.attributes.toNodeID == v.getID()) {
                                        n2 = W.model.nodes.get(seg2.attributes.fromNodeID);
                                    } else {
                                        n2 = W.model.nodes.get(seg2.attributes.toNodeID);
                                    }
                                    if (n1 && n2) {
                                        for (var i = 0; i < n1.attributes.segIDs.length; i++) {
                                            for (var j = 0; j < n2.attributes.segIDs.length; j++) {
                                                if (n1.attributes.segIDs[i] == n2.attributes.segIDs[j]) {
                                                    console.log("Merge on", v.getID(), "would cause two or more segments connected to same nodes.");
                                                    update = false;
                                                    break;
                                                }
                                            }
                                            if (update == false) {
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (update) {
                                    W.model.actionManager.add(new MergeSegments(null, v));
                                    count++;
                                    console.log("merged(" + count + ") " + seg1.getID() + " with " + seg2.getID() + " at " + v.getID());
                                }
                            }
                        }
                    }
                }
            });
        })();
    }
})();