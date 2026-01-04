// ==UserScript==
// @name         Minecraft Fandom redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MC Fandom To Wiki Redirect
// @author       SaishoVibes
// @match        *://*minecraft.fandom.com/*
// @icon         https://www.google.com/s2/favicons?domain=minecraft.net
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/476556/Minecraft%20Fandom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/476556/Minecraft%20Fandom%20redirect.meta.js
// ==/UserScript==
var oldHref = document.location.href;
if (window.location.href.indexOf('minecraft.fandom.com/wiki/') > -1) {
    window.location.replace(window.location.toString().replace('fandom.com/wiki', 'wiki/w'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('minecraft.fandom.com/wiki/') > -1) {
                    window.location.replace(window.location.toString().replace('fandom.com/wiki', 'wiki/w'));
                }
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
};