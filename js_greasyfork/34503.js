// ==UserScript==
// @name         New WME Contrast Fix
// @namespace    https://greasyfork.org/en/users/77740
// @version      0.13
// @description  Fix a sever contrast issues that make new editor hard to use
// @author       FastestBeef, SunnyRaynbows
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @run-at document-end
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34503/New%20WME%20Contrast%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/34503/New%20WME%20Contrast%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('.toolbar-button.ItemDisabled { opacity: 1 !important; }');
    GM_addStyle('.toolbar-button.ItemInactive { font-weight: bolder !important; }');
    GM_addStyle('.toolbar .toolbar-button.waze-icon-save.ItemDisabled {color: black !important; }');
    GM_addStyle('.toolbar .toolbar-button.ItemDisabled.delete-feature { opacity: 0.4 !important; }');
    GM_addStyle('.feed-issue .content .subtext {color: #2b2d2f !important; }');
    GM_addStyle('.waze-radio-container input[type="radio"]:disabled + label, .waze-radio-container input[type="radio"] label.disabled {color: black !important;}');
    GM_addStyle('.olControlPanZoomBar {background-color: #f0f2f2; border-radius: 30px; height: 52px; width: 24px;border: 3px solid #f0f2f2; box-sizing: initial; top: 190px; right: 14px !important;}');
    GM_addStyle('.overlay-buttons-container.top {position: absolute; top: 47px; !important;}');
    GM_addStyle('.bottom.overlay-buttons-container {position: absolute; top: 150px; height: 150px; !important;}');
})();
