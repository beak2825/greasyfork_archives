// ==UserScript==
// @name         HACKZAO BOLADO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35106/HACKZAO%20BOLADO.user.js
// @updateURL https://update.greasyfork.org/scripts/35106/HACKZAO%20BOLADO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
    function playersLinked(a,d){
        if(a.sid==player.sid&&d.name.startsWith(clanTag)){
           return true;
        }
     }