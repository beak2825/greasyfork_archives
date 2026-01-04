// ==UserScript==
// @name         Embed - 废柴视频网
// @namespace    https://greasyfork.org/zh-CN/users/108076
// @version      1.8.9
// @description  允许直接播放VIP视频❗
// @author       草木灰
// @match        http*://fcw.xxx/*
// @match        http*://fcw.cool/*
// @match        http*://newfcw.info/*
// @include      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?fcw[0-9][0-9]\.com(:[0-9]{1,5})?\/.*$)/
// @include      /(^[^:\/#\?]*:\/\/([^#\?\/]*\.)?fcww[0-9][0-9]\.com(:[0-9]{1,5})?\/.*$)/
// @icon         https://www.google.com/s2/favicons?domain=fcw.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448649/Embed%20-%20%E5%BA%9F%E6%9F%B4%E8%A7%86%E9%A2%91%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448649/Embed%20-%20%E5%BA%9F%E6%9F%B4%E8%A7%86%E9%A2%91%E7%BD%91.meta.js
// ==/UserScript==

(function () {

    'use strict';

    var origin = document.location.origin;
    var PRO_VIDEO_ID = document.location.pathname.replace(/videos\/([\d]+)\/(.*)/, "embed/$1");
    // console.log(origin);

    if ($(".no-player").length === 1) {
        $('.player').html('<iframe width="100%" height="566" src=' + origin + PRO_VIDEO_ID + ' frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>');
    }
    // Your code here...
})();