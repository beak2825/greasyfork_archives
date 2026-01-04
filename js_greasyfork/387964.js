// ==UserScript==
// @name         twiming
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto volume down at twiming. oketuiku.
// @author       i_nomu
// @match        https://video.twimg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387964/twiming.user.js
// @updateURL https://update.greasyfork.org/scripts/387964/twiming.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = document.querySelector("video");
    video.volume = 0.2; //ここの数値を0.0-1.0の間で調節可能．
})();