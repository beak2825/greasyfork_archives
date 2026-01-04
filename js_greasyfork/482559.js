// ==UserScript==
// @name         Embed Images On reddit-stream
// @namespace    just.a.guyy
// @version      1.1
// @description  EmbeddedImages
// @match        http://reddit-stream.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482559/Embed%20Images%20On%20reddit-stream.user.js
// @updateURL https://update.greasyfork.org/scripts/482559/Embed%20Images%20On%20reddit-stream.meta.js
// ==/UserScript==
// Inspired by: https://greasyfork.org/en/scripts/432548-reddit-stream-dinger/code (Thanks a lot!)

new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.nodeType == Node.ELEMENT_NODE) {
                var links = node.getElementsByTagName('a');
                for (var i = 0;i< links.length;i++)
                {
                    if((links[i].href).includes("https://preview.redd.it")){
                        links[i].innerHTML = `<img src="`+links[i].href+`" style="height:35vh;width:25vw">`;
                    }

                }
            }
        }
    }
}).observe(document.getElementById('c-main'), {
    childList: true,
    subtree: true
});