// ==UserScript==
// @name         Soundmondo - Sync Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add sync links to soundmondo website
// @author       REY Florian
// @match        https://soundmondo.yamahasynth.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yamaha.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476426/Soundmondo%20-%20Sync%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/476426/Soundmondo%20-%20Sync%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Add sync links");

    var updatedLinks = [];

    function update_links(){
        // Check links
        var links = document.getElementsByTagName("a");
        for(let i = 0; i < links.length; i++){
            // Match only voice links
            if(links[i].href.match(/.*voices\/\d+$/gi)){
                const voiceLink = links[i].href;
                // Avoid duplicates
                if(updatedLinks.includes(voiceLink)){
                    continue;
                }

                // Create sync link btn
                const syncLink = document.createElement("a");
                syncLink.href = voiceLink.replace('voices/', 'voices/sync/');;
                syncLink.innerHTML = "SYNC";
                syncLink.classList.add("btn");
                syncLink.classList.add("btn-info");
                syncLink.target = "_blank";

                // Create sync parent element
                const syncBtn = document.createElement("span");
                syncBtn.style.marginRight = "12px";
                syncBtn.appendChild(syncLink);

                // Insert it
                const parentNode = links[i].parentNode;
                parentNode.insertBefore(syncBtn, links[i]);

                // Backup to avoid duplicates
                updatedLinks.push(voiceLink);
            }
        }
    };

    const send = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            window.setTimeout(() => {
                update_links();
            }, 0);
        })
        return send.apply(this, arguments)
    }

})();