// ==UserScript==
// @name         robloxscripts.com ad blocker detection bypass
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  Bypasses the ad blocker detection for robloxscripts.com
// @run-at       document-start
// @author       noam01
// @match        https://robloxscripts.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=robloxscripts.com
// @antifeature  Forced ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492094/robloxscriptscom%20ad%20blocker%20detection%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/492094/robloxscriptscom%20ad%20blocker%20detection%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ad_detect = false;
    let observer = new MutationObserver((list,obs)=>{
        list.forEach(ch=>{
            if (ch.addedNodes) {
                ch.addedNodes.forEach(node=>{
                    if (node.nodeName == "#comment" && node.data.trim().toLowerCase() == "code for ad blocking detection") {
                        ad_detect = true;
                    } else if (node.nodeName == "#comment" && node.data.trim().toLowerCase() == "code for ad blocking detection end") {
                        observer.disconnect();
                    }
                    if (node.nodeName == "SCRIPT" && ad_detect) {
                        node.remove();
                    }
                })
            }
        })
    });
    observer.observe(document.body,{
        attributes: false, childList: true, subtree: true
    });
})();