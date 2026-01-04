// ==UserScript==
// @name         4chan Quick Reply Mass Quote Button
// @match        https://boards.4channel.org/*/thread/*
// @match        https://boards.4chan.org/*/thread/*
// @description  Mass quote posts (adapted from WAH-HEEs script)
// @version      0.2
// @namespace https://greasyfork.org/users/473762
// @downloadURL https://update.greasyfork.org/scripts/494497/4chan%20Quick%20Reply%20Mass%20Quote%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/494497/4chan%20Quick%20Reply%20Mass%20Quote%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addWH(qr) {
        //console.log("4chan Quick Reply Mass Quote Button: Adding mass reply button...");
        var massreplybtn = document.createElement("button");
        var massreplytext = document.createTextNode("mass reply");
        massreplybtn.setAttribute("style", "color:#8ba446;font-size:23px;background-color:#333333");
        massreplybtn.onclick = function() {
            //console.log("4chan Quick Reply Mass Quote Button: mass reply button clicked...");
            var arr = Array.from(document.querySelectorAll(".postContainer")).map(e => {
                return ">>" + e.id.slice(2)
            });
            document.querySelector('[placeholder="Comment"]').value = arr.slice(Math.max(arr.length - 150, 0)).join(" ") + "\n*.*";
        }
        massreplybtn.appendChild(massreplytext);
        qr.appendChild(massreplybtn);
    }

    var bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.from(mutation.addedNodes).forEach(function(node) {
                if (node.id === 'quickReply') {
                    //console.log("4chan Quick Reply Mass Quote Button: Quick reply box found. Adding mass reply button...");
                    addWH(node);
                    bodyObserver.disconnect();
                }
            });
        });
    });

    //console.log("4chan Quick Reply Mass Quote Button: Observing body for changes...");
    bodyObserver.observe(document.body, { childList: true, subtree: true });
})();


