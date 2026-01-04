// ==UserScript==
// @name         AV01.tv Redirect Removal
// @name:zh-TW   AV01.tv 跳轉移除
// @namespace    Cache
// @version      0.2
// @description  Remove the redirect when click on video tile
// @description:zh-TW 移除當按影片時跳轉到另一頁
// @author       Cache
// @match        https://www.av01.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=av01.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441380/AV01tv%20Redirect%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/441380/AV01tv%20Redirect%20Removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Get all video tiles
    var tiles = document.getElementsByClassName("well-sm");

    //Remove onclick event to the video tile
    for (var i = 0; i < tiles.length; i++) {
        var tile_a = tiles[i].firstElementChild;
        tile_a.removeAttribute('onclick');
    }
})();