// ==UserScript==
// @name         Pour kamel
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://registre-vtc.din.developpement-durable.gouv.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387878/Pour%20kamel.user.js
// @updateURL https://update.greasyfork.org/scripts/387878/Pour%20kamel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        var els = document.getElementsByTagName("td");
        for(var i = 0, l = els.length; i < l; i++) {
            var el = els[i];
            el.innerHTML = el.innerHTML.replace('A traiter', 'Accepté');
            el.innerHTML = el.innerHTML.replace('Refusé', 'Accepté');
        }
    }, 50);
})();