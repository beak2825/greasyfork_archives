// ==UserScript==
// @name         WhatsApp Web Boss
// @namespace    https://greasyfork.org/en/users/8579-rarspace01
// @version      0.3
// @description  Hides your whatsapp session at work
// @author       rarspace01, Graphen
// @match        https://web.whatsapp.com/
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/38528/WhatsApp%20Web%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/38528/WhatsApp%20Web%20Boss.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';

/*!
 * Dynamically changing favicons with JavaScript
 * Works in all A-grade browsers except Safari and Internet Explorer
 * Demo: http://mathiasbynens.be/demo/dynamic-favicons
 */

// HTML5™, baby! http://mathiasbynens.be/notes/document-head
document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

//Change favicon to stackoverflow and tabtitle to a fitting title
function doTheBossStuff() {
    changeFavicon('https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico');
    document.title = "How to send multiple attachments .xls files of different objects using apex"; 
}

//Execute every 5 seconds
window.setInterval(function(){
    doTheBossStuff();
}, 5000);

})();
