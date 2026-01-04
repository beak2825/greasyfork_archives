// ==UserScript==
// @name         WME Jay's custom QW it all
// @version      0.12
// @description  Add uturns from node
// @author       jaywazin
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant        none
// @namespace    https://greasyfork.org/ru/scripts/16950-wme-add-uturns-from-node2

// @downloadURL https://update.greasyfork.org/scripts/430467/WME%20Jay%27s%20custom%20QW%20it%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/430467/WME%20Jay%27s%20custom%20QW%20it%20all.meta.js
// ==/UserScript==
function Uturns_bootstrap() {
    console.log("Bootstrap");
    var bGreasemonkeyServiceDefined = false;

    try {
        if ("object" === typeof Components.interfaces.gmIGreasemonkeyService) {
            bGreasemonkeyServiceDefined = true;
        }
    } catch (err) {
        //Ignore.
    }
    if ("undefined" === typeof unsafeWindow || !bGreasemonkeyServiceDefined) {
        unsafeWindow = (function() {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        })();
    }
    /* begin running the code! */
    setTimeout(startSidebarFunction, 999);
}

function getSegmentsCount(node) {
    console.log("getSegmentsCount");
    return node.attributes.segIDs.length;
}

function runQW(singleNodeID) {
    var modifyAllConnections = require("Waze/Action/ModifyAllConnections");
    var node = W.model.nodes.objects[singleNodeID];

    node.areAllConnectionsDisabled() || W.model.actionManager.add(new modifyAllConnections(node,!1));
    node.areAllConnectionsEnabled() || W.model.actionManager.add(new modifyAllConnections(node,!0));
}

function runEnableAllUTurns(singleNodeID) {
    var wazeActionSetTurn = require("Waze/Model/Graph/Actions/SetTurn");

    var segIDs = W.model.nodes.objects[singleNodeID].attributes.segIDs;
    var node = W.model.nodes.objects[singleNodeID];
    for (var i = 0; i < segIDs.length; i++) {
        var segment = W.model.segments.objects[segIDs[i]];
        if (segment.attributes.fromNodeID == node.attributes.id) {
            console.log('А', segment.attributes.id);
            var turn = W.model.getTurnGraph().getTurnThroughNode(node, segment, segment);
            W.model.actionManager.add(new wazeActionSetTurn(W.model.getTurnGraph(), turn.withTurnData(turn.getTurnData().withState(1))));
        } else {
            console.log('B', segment.attributes.id);
            var turn2 = W.model.getTurnGraph().getTurnThroughNode(node, segment, segment);
            W.model.actionManager.add(new wazeActionSetTurn(W.model.getTurnGraph(), turn2.withTurnData(turn2.getTurnData().withState(1))));
        }
    }
}

function junctionsFromSegments() {
    // run function on all junctions touching more than one segment
    var nodeList = [];
    var segmentList = [];
    var qualList = [];

    var i;

    for (i = 0; i < W.selectionManager.getSelectedFeatures().length; i++) {
        var sel = W.selectionManager.getSelectedFeatures()[i];
        var v = sel.model;
        var seg = v.attributes.id;
        var from = v.attributes.fromNodeID;
        var to = v.attributes.toNodeID;
        console.log("Segment #"+ seg +" Nodes: "+ from +" "+ to) ;
        segmentList.push(seg);
        if (nodeList.indexOf(from) === -1) nodeList.push(from);
        if (nodeList.indexOf(to) === -1) nodeList.push(to);
    }
    console.log("Segment List");
    for (i = 0; i < segmentList.length; i++) {
        console.log(segmentList[i]) ;
    }
    console.log("Node List");
    for (i = 0; i < nodeList.length; i++) {
        console.log(nodeList[i]) ;
    }

    var j;
    var k;
    var q;
    for (i = 0; i < nodeList.length; i++) {
        // find nodes inside the selected segments
        q = 0;
        k = W.model.nodes.objects[nodeList[i]].attributes;
        for (j = 0; j < k.segIDs.length; j++ ){
            if (segmentList.indexOf(k.segIDs[j]) > 0) {
                q++;
            }
        }
        if (q > 1) {
            console.log("Qualified node: " + nodeList[i]) ;
            qualList.push(nodeList[i]);
        }
    }
    return qualList;
}

function startSidebarFunction() {

    console.log("Start Sidebar Function");

    W.selectionManager.events.register("selectionchanged", null, showButton);  // only triggers if a single object is selected; multiple segments do not triggerr

    function showButton() {
        console.log("enter showButtons function");
        if (W.selectionManager.getSelectedFeatures().length === 0) {
            return;
        }
        else if (W.selectionManager.getSelectedFeatures().length === 1) {
            if (W.selectionManager.getSelectedFeatures()[0].model.type == "node") {
                $('.side-panel-section:first-child').append('<button id="QW" class="btn btn-default">QW shortcut</button>');
                $('.side-panel-section:first-child').append('<button id="UTurns" class="btn btn-default">U-Turns</button>');
            }
        }
        if (W.selectionManager.getSelectedFeatures()[0].model.type == "segment") {
            $('.selection:first-child').append('<button id="SegmentQW" class="btn btn-default">QW Segment Junctions</button>');
        }
        console.log("exit showButtons function");
    }
    // JW Mod
    $('#sidebar').on('click', '#QW', function(event) {
        runQW(W.selectionManager.getSelectedFeatures()[0].model.attributes.id);
        // $(this).hide();
    });

    $('#sidebar').on('click', '#UTurns', function(event) {
        runEnableAllUTurns(W.selectionManager.getSelectedFeatures()[0].model.attributes.id);
        // $(this).hide();
    });

    $('#sidebar').on('click', '#SegmentQW', function(event) {
        var nodeList = junctionsFromSegments();
        for (var i = 0; i < nodeList.length; i++) {
            runQW(nodeList[i]);
            console.log("QW on "+ nodeList[i]);
        }
    });
    // JW Mod end

}

Uturns_bootstrap();