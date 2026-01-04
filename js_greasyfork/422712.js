// ==UserScript==
// @name         VDRM fast
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  VDRM integration script
// @author       Anton Lazarau
// @include      https://*test.venatusmedia.com/*
// @include      https://*op.gg/*
// @include      https://*futbin.com/*
// @include      https://*nookazon.com/*
// @include      https://*hltv.org/*
// @include      https://*whatculture.com/*
// @include      https://*gfinityesports.com/*
// @include      https://*fifaindex.com/*
// @include      https://*realsport101.com/*
// @include      https://*gosunoob.com/*
// @include      https://*challonge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422712/VDRM%20fast.user.js
// @updateURL https://update.greasyfork.org/scripts/422712/VDRM%20fast.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.onload = function () {
        console.log('VDMR script loaded');
    };
    script.src = 'http://127.0.0.1:8887/creative1.js';
    script.id = "vdrm-script-65"; //Это тестовые параметры
    script.clickTag = "https://www.google.com/"; //Это тестовые параметры
    document.head.appendChild(script);
})();