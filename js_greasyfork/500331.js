// ==UserScript==
// @name     Lands of Lords Dots coloring
// @match  www.landsoflords.com/map/*
// @grant    GM_addStyle
// @run-at   document-start
// @author       RandomNotes
// @description "Changes the forced dot colors on Lands of Lords"
// @license MIT
// @version      2024-07-11
// @namespace https://greasyfork.org/users/1048269
// @downloadURL https://update.greasyfork.org/scripts/500331/Lands%20of%20Lords%20Dots%20coloring.user.js
// @updateURL https://update.greasyfork.org/scripts/500331/Lands%20of%20Lords%20Dots%20coloring.meta.js
// ==/UserScript==

GM_addStyle ( `
    #map .map > .units > .group > * { position: absolute; width: 4px; height: 4px; border: 2px solid #666; background: #00FF00  ; transform: translateZ(0); }
    }
/* https://www.rapidtables.com/convert/color/rgb-to-hex.html Use this website to change the Background color above "background: #00FF00"
Here are some examples RED #FF0000 Blue #0200FF GREEN #02FF00*/
` );
