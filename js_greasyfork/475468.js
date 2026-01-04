// ==UserScript==
// @name         Burning-Series Redirector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirect burning-series.io to bs.to and modify Google search results
// @author       2ndSky95
// @match        *://burning-series.io/*
// @match        *://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475468/Burning-Series%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/475468/Burning-Series%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectPage() {
        let newURL = window.location.href.replace('burning-series.io', 'bs.to');
        window.location.replace(newURL);
    }

    function modifyGoogleResults() {
        document.querySelectorAll('a').forEach(function(link) {
            if (link.href.includes('burning-series.io')) {
                // Ändere die URL im href-Attribut
                link.href = link.href.replace('burning-series.io', 'bs.to');

                // Ändere den sichtbaren Text des Links, falls es ein Textknoten ist
                let textNode = link.childNodes[0];
                if (textNode && textNode.nodeType === 3) { // Überprüfe, ob es sich um einen Textknoten handelt
                    textNode.nodeValue = textNode.nodeValue.replace('burning-series.io', 'bs.to');
                }

                // Füge eine optische Kennzeichnung hinzu (z.B. Änderung der Textfarbe zu rot)
                link.style.color = '#55ff55dd';
                link.style.textShadow = '3px 3px 6px #000000';

                // Füge ein Bild hinter der URL ein
                let imgHTML = '<img src="https://cdn.tsicons.com/icons/RJE5G5p9Xol3.png" style="height:16px;width:16px;margin-left:5px;">';
                link.insertAdjacentHTML('beforeend', imgHTML);
            }
        });
    }

    if (window.location.host.includes('burning-series.io')) {
        redirectPage();
    } else if (window.location.host.includes('www.google.com')) {
        setTimeout(modifyGoogleResults, 1000);
    }
})();
