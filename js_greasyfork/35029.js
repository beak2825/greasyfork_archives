// ==UserScript==
// @name         VidTube.
// @namespace    http://youtube.net/
// @version      0.1
// @description  Changes VidLii into YouTube
// @author       Creatable
// @match        https://www.vidlii.com/*
// @include        http://vidlii.com/*
// @include        https://vidlii.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35029/VidTube.user.js
// @updateURL https://update.greasyfork.org/scripts/35029/VidTube.meta.js
// ==/UserScript==
document.title = 'YouTube - Broadcast Yourself.';
function htmlreplace(a, b, element) {
    if (!element) element = document.body;
    var nodes = element.childNodes;
    for (var n=0; n<nodes.length; n++) {
        if (nodes[n].nodeType == Node.TEXT_NODE) {
            var r = new RegExp(a, 'gi');
            nodes[n].textContent = nodes[n].textContent.replace(r, b);
        } else {
            htmlreplace(a, b, nodes[n]);
        }
    }
}

htmlreplace('VidLii', 'YouTube');