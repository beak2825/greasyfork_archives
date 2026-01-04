// ==UserScript==
// @name         Flight Rising Color Schemer Bigger Colors
// @namespace    https://greasyfork.org/en/users/547396
// @version      0.1
// @description  Make color boxes larger / centre aligned 
// @author       Necramancy
// @match        http://fr.fintastic.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425351/Flight%20Rising%20Color%20Schemer%20Bigger%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/425351/Flight%20Rising%20Color%20Schemer%20Bigger%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var css = '.border { width:25px; height:25px; border-radius: 999rem; margin: .15rem .05rem; float: right; } .center { width: auto;  height: auto !important; } #palettes { display: flex; flex-wrap: wrap; align-items: center; } .colorlist { flex: 0 0 90%;  } .center { text-align: left; flex: 0 0 10%; margin: 10px 0; }',
    var css = '.border { width:15px; height:25px; margin: .15rem .05rem; } .center { width: auto; height: auto !important; margin: 10px 0; } .colorlist { width: 100% !important; display: flex; justify-content: center; }',
        container = document.getElementById('palettes'),
        style = document.createElement('style'),
        node = document.createTextNode(css);

    container.appendChild(style);
    style.appendChild(node);
})();