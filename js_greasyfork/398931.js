// ==UserScript==
// @name         卡特推踩通知開關
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自行切換卡特的推踩通知發送
// @author       MirukuTEA
// @include      https://kater.me/*
// @exclude      https://kater.me/api/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398931/%E5%8D%A1%E7%89%B9%E6%8E%A8%E8%B8%A9%E9%80%9A%E7%9F%A5%E9%96%8B%E9%97%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/398931/%E5%8D%A1%E7%89%B9%E6%8E%A8%E8%B8%A9%E9%80%9A%E7%9F%A5%E9%96%8B%E9%97%9C.meta.js
// ==/UserScript==

'use strict';
GM_registerMenuCommand("切換推踩通知", function () {
    app.session.user.data.attributes.preferences.notify_vote_alert = !app.session.user.data.attributes.preferences.notify_vote_alert;
    app.session.user.savePreferences();
    location.reload(true);
});