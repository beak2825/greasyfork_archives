// ==UserScript==
// @name         BCAPI
// @namespace    http://tampermonkey.net/
// @version      2024-06-23
// @description  Download BrightCove Videos
// @author       You
// @match        *://players.brightcove.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brightcove.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499501/BCAPI.user.js
// @updateURL https://update.greasyfork.org/scripts/499501/BCAPI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let linkCounter = 1;

    function addDownloadLink_o(url) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = `Télécharger video ${linkCounter++}`;
        link.style.display = 'block';
        link.style.margin = '10px 0';
        document.body.appendChild(link);
    }
    function addDownloadLink(url) {
        // Create the button element
        var button = document.createElement("button");
        button.type = "button";
        button.title = "download";
        button.className = "vjs-menu-button vjs-button";
        button.innerHTML = "<svg width='17px' height='17px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g id='Interface / Download'><path id='Vector' d='M6 21H18M12 3V17M12 17L17 12M12 17L7 12' stroke='#fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'></path></g></svg>";
        button.onclick = function() {
            window.open(url, '_blank').focus();
        };

        // Find the target element
        var controlBar = document.querySelector(".vjs-control-bar");

        if (controlBar) {
            // Append the button as the last child
            controlBar.appendChild(button);
        } else {
            console.log('vjs-control-bar not found');
        }
    }

    // Interception des requêtes XMLHttpRequest
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.addEventListener("readystatechange", function() {
                if (this.readyState === 4 && url.includes("master.m3u8")) {
                    console.log("XMLHttpRequest", method, url, this.status, this.responseText);
                    //addDownloadLink(url);
                    const pageUrl = window.location.href;
                    addDownloadLink("https://justcooldev.helioho.st/convert?m3u8_url=" + url);
                    //if (confirm(`Voulez-vous télécharger la vidéo ? ${url}`)) {
                    //    console.log(pageUrl,"no");
                    //    GM_openInTab("http://nodeptero.vizle.xyz:25572/convert?m3u8_url=" + url);
                    //}
                }
            }, false);
            open.call(this, method, url, async, user, password);
        };
    })(XMLHttpRequest.prototype.open);
})();