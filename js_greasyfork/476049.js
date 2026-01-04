// ==UserScript==
// @name         Minecraft Wiki Redirect
// @namespace    https://minecraft.fandom.com/
// @version      0.1
// @description  Redirect
// @author       trashgaylie
// @match        https://minecraft.fandom.com/*
// @icon         https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e6/Site-logo.png
// @grant        none
// @run-at       document-start
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/476049/Minecraft%20Wiki%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/476049/Minecraft%20Wiki%20Redirect.meta.js
// ==/UserScript==

// Original Code by Fuim https://greasyfork.org/en/scripts/439993-youtube-shorts-redirect
// Only incoming and outgoing URLs replaced

var oldHref = document.location.href;
if (window.location.href.indexOf('https://minecraft.fandom.com/') > -1) {
    window.location.replace(window.location.toString().replace('https://minecraft.fandom.com/', 'https://minecraft.wiki/'));
}
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                console.log('location changed!');
                if (window.location.href.indexOf('https://minecraft.fandom.com/') > -1) {
                    window.location.replace(window.location.toString().replace('https://minecraft.fandom.com/', 'https://minecraft.wiki/'));
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