// ==UserScript==
// @name         Munzee Garden Painter
// @version      0.1
// @description  Show an 80x80 grid
// @author       rabe85
// @match        *://gardenpainter.ide.sk/paint.php
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/391030/Munzee%20Garden%20Painter.user.js
// @updateURL https://update.greasyfork.org/scripts/391030/Munzee%20Garden%20Painter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_garden_painter() {

        // Show an 80x80 grid button
        var toolbox = document.getElementById('toolbox');
        if(toolbox) {
            toolbox.querySelector('img[src="grid_size3.png"]').insertAdjacentHTML("afterend", "<img class='btn' src='https://www.otb-server.de/munzee/grid_size4.png' title='Grid size: 80 x 80' onclick='n=80;setupCrosses();setupPins();setGridSize(n);'>");
        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_garden_painter();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_garden_painter, false);
    }

})();