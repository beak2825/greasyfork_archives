// ==UserScript==
// @name        Sticker Size
// @license     MIT
// @match       https://vk.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      seneaL
// @description 01.09.2023, 19:52:16
// @namespace https://greasyfork.org/users/541945
// @downloadURL https://update.greasyfork.org/scripts/474369/Sticker%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/474369/Sticker%20Size.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newStyle = '.sticker_img { height: 100px !important; width: auto !important }';
    GM_addStyle(newStyle);
})();