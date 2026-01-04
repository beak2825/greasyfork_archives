// ==UserScript==
// @name         AbemaTV Fly high
// @namespace    None
// @version      4.0
// @description  【请不要公开此脚本】你需要日本IP（可以非原生）
// @author       旋风 & Kaito & 果厨果厨果
// @match        https://abema.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389571/AbemaTV%20Fly%20high.user.js
// @updateURL https://update.greasyfork.org/scripts/389571/AbemaTV%20Fly%20high.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _region;
Object.defineProperty(window,'__CLIENT_REGION__', {
                get: function () {
                    return _region;
                },
                set: function (newValue) {
                    _region = newValue;
                    newValue.status = false;
                    newValue.isAllowed = true;
                    newValue.cdnURL = 'https://abematv.akamaized.net/region';
                    newValue.timezone = 'Asia/Tokyo'
                    newValue.isoCountryCode = 'JP'
                }
 });

})();