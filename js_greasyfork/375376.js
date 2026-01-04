// ==UserScript==
// @name         Reddit Web Boss
// @name:de      Reddit Web Boss
// @namespace    https://greasyfork.org/en/users/8579-rarspace01
// @version      0.1
// @description  Hides your reddit session at work
// @description:de Versteckt die reddit auf der Arbeit
// @author       rarspace01
// @match        https://www.reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375376/Reddit%20Web%20Boss.user.js
// @updateURL https://update.greasyfork.org/scripts/375376/Reddit%20Web%20Boss.meta.js
// ==/UserScript==

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

//function to change favicon to stackoverflow and Tabtitle to a fitting title
function doTheBossStuff() {
changeFavicon('https://stackoverflow.com/favicon.ico');
document.title = "How to send multiple attachments .xls files of different objects using apex"; 
}

window.setInterval(function(){
  
    doTheBossStuff();
    
}, 5000);