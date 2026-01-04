// ==UserScript==
// @name         AniBrain: replace JavaScript links
// @version      2023-12-31
// @description  Replaces JS links using proper links that allow 'Right-click > Open in new tab' and other stuff
// @author       thepbone
// @match        https://anibrain.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anibrain.ai
// @grant        none
// @license      GPLv3
// @run-at       document-idle
// @namespace https://greasyfork.org/users/174601
// @downloadURL https://update.greasyfork.org/scripts/483536/AniBrain%3A%20replace%20JavaScript%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/483536/AniBrain%3A%20replace%20JavaScript%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function fixLinks() {
        console.log("Fixing links");

        var mangaDivs = document.getElementsByTagName("div");


        for (var i = mangaDivs.length -1 ; i >=0; i--) {
            var div = mangaDivs[i];
            if(!div.id.startsWith("mrc-Manga-")) {
                console.log("skip " + div.id);
                continue;
            }

            console.log("DONE " + div.id);

            var p = document.createElement("a");
            p.setAttribute("href", div.id.match(/\d/g).join(''));
            var newDiv = div.cloneNode(true);
            newDiv.removeAttribute("id");
            p.appendChild(newDiv);
            div.parentNode.insertBefore(p, div);
            div.parentNode.removeChild(div);
        }
    }

    var count = 0;

    var currentInterval = 0;
    var x = new MutationObserver(function (e) {
        if(count >= 10) {
            x.disconnect();
        }

        if (e[0].addedNodes) {
            if(currentInterval != 0) {
                clearInterval(currentInterval);
            }

            currentInterval = setInterval(function(){
                currentInterval = 0;
                fixLinks();
            }, 1000);

            count++;
        }
    });

    x.observe(document.getElementsByTagName('main')[0], { childList: true, subTree: true });
})();