// ==UserScript==
// @name         WME Phantom Nodes
// @description Marks WME Phantom nodes
// @version      0.2
// @author       dgerritsen95
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/*
// @exclude      https://www.waze.com/user/*
// @grant        none
// @namespace https://greasyfork.org/users/208937
// @downloadURL https://update.greasyfork.org/scripts/377644/WME%20Phantom%20Nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/377644/WME%20Phantom%20Nodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Ww = {};
    const App = {};

    App.settings = {
        debug: false,
        zoomLevel: 3,
    };

    Ww.available = false;

    Ww.init = function () {
        Ww.available = true;
        Ww.obj = W;
        App.init();
    }

    Ww.getWazeTarget = function (x = 0) {
        App.debug('getWazeTarget()');
        if (W && W.map && W.model && W.loginManager.user) {
            Ww.init();
        } else if (x < 1000) {
            setTimeout(function () {Ww.getWazeTarget(x++)}, 500);
        }
    };

    App.init = function () {
        setInterval(() => { App.highlightPhantomNodes() }, 1000);
    };

    App.highlightPhantomNodes = function () {
        if (Ww.obj.map.zoom > App.settings.zoomLevel) {
            const phantomNodes = App.findPhantomNodes();
            phantomNodes.forEach(node => {
                App.debug(App.nodeHasWalkingTrail(node));
                if(App.nodeHasWalkingTrail(node)) {
                    App.highlightNode(node);
                }
            });
        }
    }

    App.getSegmentFromId = function (segId) {
        return Ww.obj.model.segments.getObjectById(segId);
    };

    App.getNodeFromId = function (nodeId) {
        return Ww.obj.model.nodes.getObjectById(nodeId);
    };

    App.nodeHasWalkingTrail = function (node) {
        let answer = false;

        node.attributes.segIDs.forEach(segId => {
            const seg = App.getSegmentFromId(segId);
            if (seg.attributes.roadType === 5) {
                App.debug(segId + ' is WT');
                answer = true;
            } else {
                App.debug(segId + ' is not WT');
            }
        });

        return answer;
    };

    App.highlightNode = function(node) {
        const el = document.getElementById(node.attributes.geometry.id);
        if (el) {
            el.setAttribute("stroke", "white");
            el.setAttribute("fill-opacity", "1");
            el.setAttribute("fill", "red");
            el.setAttribute("stroke-width", "3");
            el.setAttribute("stroke-linecap", "round");
            el.setAttribute("stroke-linejoin", "round");
            el.setAttribute("stroke-dasharray", "3, 5");
            el.setAttribute("r", "7");
        }
    };

    App.findPhantomNodes = function() {
        const nodes = [];
        for (var currentSeg in Ww.obj.model.segments.objects) {
            const segAttrs = App.getSegmentFromId(currentSeg).attributes;
            const vnodes = segAttrs.virtualNodeIDs;
            if (vnodes && vnodes.length > 0) {
                vnodes.forEach(node => {
                    nodes.push(App.getNodeFromId(node));
                });
            }
        }
        return nodes;
    };

    App.debug = function (message) {
        if (App.settings.debug) {
            console.log('WMEPN: '+ message);
        }
    }

    App.log = function (message) {
        console.info('WMEPN: '+ message);
    };

    Ww.getWazeTarget();
})();