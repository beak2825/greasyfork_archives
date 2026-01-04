// ==UserScript==
// @name         nerinyan.moe dl mirror
// @version      1.21
// @description  replaces osu!direct button to nerinyan.moe download mirror. based on oSumAtrIX's script
// @author       klovik
// @include      https://osu.ppy.sh/*
// @namespace https://greasyfork.org/users/1087418
// @downloadURL https://update.greasyfork.org/scripts/467509/nerinyanmoe%20dl%20mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/467509/nerinyanmoe%20dl%20mirror.meta.js
// ==/UserScript==

(() => {
    'use strict';
    let button;
    let interval = setInterval(() => {
        if (!location.pathname.includes('/beatmapsets/') || (button = document.querySelector("div.beatmapset-header__buttons > a[href*=support]")) == null) return;
        button.querySelector("span > span.btn-osu-big__left > span").innerText = 'nerinyan.moe';
        button.attributes.href.value = "https://api.nerinyan.moe/d/" + location.pathname.split('/')[2]
}, 500);
})();