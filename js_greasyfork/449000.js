// ==UserScript==
// @name         speedrun.com [] prefixer
// @namespace    https://www.speedrun.com/
// @version      1.0
// @description  Prefix players with []
// @author       Penguin#7568
// @match        https://www.speedrun.com/*/run/*/edit
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449000/speedruncom%20%5B%5D%20prefixer.user.js
// @updateURL https://update.greasyfork.org/scripts/449000/speedruncom%20%5B%5D%20prefixer.meta.js
// ==/UserScript==

(function() {
    for(var i = 1; i <= 16; i++) {
        if(!document.getElementById('player' + i + 'field')) {
            break;
        }
        var name = document.getElementById('player' + i + 'field').value;
        if(name && !name.startsWith('[')) {
           document.getElementById('player' + i + 'field').value = '[]' + name;
        }
    }
})();