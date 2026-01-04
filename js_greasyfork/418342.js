// ==UserScript==
// @name         VDRM
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  VDRM integration script
// @author       Vladislav Aleynikov
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
// @downloadURL https://update.greasyfork.org/scripts/418342/VDRM.user.js
// @updateURL https://update.greasyfork.org/scripts/418342/VDRM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var script = document.createElement('script');
    script.onload = function () {
        console.log('VDMR script loaded');
    };
    script.src = 'https://cdn.prvk.io//test/tampermonkey/creative.js';
    script.id = "vdrm-script";
    script.clickTag = "https://venatus.com/";

    document.head.appendChild(script);

    setTimeout(() => document.querySelectorAll('.vm-skin').forEach((element) => element.remove()), 5000);

})();