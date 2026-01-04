// ==UserScript==
// @name         Waze Editor - Easy Place Node Dragging
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows easier dragging of place nodes in Waze Editor.
// @author       aoi
// @match        https://www.waze.com/*/editor
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461029/Waze%20Editor%20-%20Easy%20Place%20Node%20Dragging.user.js
// @updateURL https://update.greasyfork.org/scripts/461029/Waze%20Editor%20-%20Easy%20Place%20Node%20Dragging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the map object.
    let map = W.map;

    // Define the drag function.
    let dragNode = (e) => {
        // Get the current node being dragged.
        let node = e.target;

        // Get the current map point.
        let latlng = map.mouseEventToLatLng(e);

        // Move the node to the new map point.
        node.setLatLng(latlng);
    };

    // Add the drag event listener to all place nodes.
    map.on('click', (e) => {
        // Check if the clicked item is a place node.
        if (e.target instanceof Waze.Feature.Vector.PlaceNode) {
            // Add the drag event listener.
            e.target.on('drag', dragNode);
        }
    });

    // Remove the drag event listener from all place nodes when the mouse is released.
    map.on('mouseup', (e) => {
        // Check if the released item is a place node.
        if (e.target instanceof Waze.Feature.Vector.PlaceNode) {
            // Remove the drag event listener.
            e.target.off('drag', dragNode);
        }
    });
})();
