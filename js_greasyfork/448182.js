// ==UserScript==
// @name         playem
// @namespace    Reiwilo09
// @version      1.1.0
// @description  Support extension for SwOrDz.Io
// @author       Reiwilo
// @match        *.playem.io
// @grant        ur mum
// @downloadURL https://update.greasyfork.org/scripts/448182/playem.user.js
// @updateURL https://update.greasyfork.org/scripts/448182/playem.meta.js
// ==/UserScript==


var openGame = function(value) {
    if(value === 'swordzio') {
        link = 'https://eu-3.swordz.io';
    }
window.open(link, '_blank');
}
    