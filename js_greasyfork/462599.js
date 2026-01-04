// ==UserScript==
// @name     Lands of Lords Dots coloring
// @match  www.landsoflords.com/map/*
// @grant    GM_addStyle
// @run-at   document-start
// @description "Changes the godawefull white dots to thicker red dots"
// @version 1.0
// @namespace https://greasyfork.org/users/1048269
// @downloadURL https://update.greasyfork.org/scripts/462599/Lands%20of%20Lords%20Dots%20coloring.user.js
// @updateURL https://update.greasyfork.org/scripts/462599/Lands%20of%20Lords%20Dots%20coloring.meta.js
// ==/UserScript==

GM_addStyle ( `
    #map .map > .units > * { position: absolute; width: 4px; height: 4px; border: 2px solid #666; background: #DC143C; transform: translateZ(0); }
    }
` );