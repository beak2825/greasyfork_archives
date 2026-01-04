// ==UserScript==
// @name         FixDailyWireFuckUp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DailyWire sucks, it won't load without some garbage tracking link. This fixes that.
// @author       AnUnhappyDailyWireSubscriber
// @match        https://www.dailywire.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391305/FixDailyWireFuckUp.user.js
// @updateURL https://update.greasyfork.org/scripts/391305/FixDailyWireFuckUp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.OBR = {};
    unsafeWindow.OBR.extern = {};
    unsafeWindow.OBR.extern.renderSpaWidgets = function (_) {};
})();