// ==UserScript==
// @name        Highlight specific friends who play
// @match       https://steamcommunity.com/id/*/friendsthatplay/*
// @match       https://store.steampowered.com/app/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @author      rdavydov
// @description Highlights specific friends on the "who play" page and on the store page
// @license MIT
// @version 0.0.1.20220829135439
// @namespace https://greasyfork.org/users/952134
// @downloadURL https://update.greasyfork.org/scripts/450409/Highlight%20specific%20friends%20who%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/450409/Highlight%20specific%20friends%20who%20play.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////
// Add links to your friends' profiles (without a slash at the end), separated by commas
// Each link should be surrounded with apostrophes ('), see the example below //////////
////////////////////////////////////////////////////////////////////////////////////////
var friends = ['https://steamcommunity.com/id/gabelogannewell','https://steamcommunity.com/id/gaben'];
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
////////////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll('.friendBlockLinkOverlay').forEach(function(element, index) {
    if (friends.indexOf(element.href) >= 0) {
        document.querySelectorAll('.friendBlockLinkOverlay')[index].style.background = 'rgba(0, 255, 0, 0.20)';
    }
});

document.querySelectorAll('.friend_blocks_grid a').forEach(function(element, index) {
    if (friends.indexOf(element.href.slice(0,-1)) >= 0) {
        document.querySelectorAll('.friend_blocks_grid a')[index].style.background = 'green';
    }
});