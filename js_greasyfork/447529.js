// ==UserScript==
// @name            opensubtitles VIP
// @name:en         opensubtitles VIP
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description:zh  假装订阅
// @description:en  Pretend to be subscribed
// @author          涛之雨
// @match           *://*.opensubtitles.com/*
// @icon            http://opensubtitles.com/favicon.ico
// @grant           none
// @license         GPL-3.0-only
// @description 假装订阅
// @downloadURL https://update.greasyfork.org/scripts/447529/opensubtitles%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/447529/opensubtitles%20VIP.meta.js
// ==/UserScript==

/* eslint-disable no-native-reassign */
/* globals setNewCheckExist extInstalled removepopup fetchUserData data_url*/
(function() {
    'use strict';
    setNewCheckExist=function(){
        extInstalled = true;
        removepopup();
        clearInterval(arguments[1]);
        fetchUserData(data_url,"booster - onload");
    };
})();