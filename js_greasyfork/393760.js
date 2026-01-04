// ==UserScript==
// @name         AbemaTV Radio
// @namespace    None
// @version      1.0
// @description  【请不要公开此脚本】你需要日本IP（可以非原生，即中转的IP）
// @author       旋风 & Kaito & 果厨果厨果
// @match        https://abema.tv/now-on-air/abema-radio
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393760/AbemaTV%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/393760/AbemaTV%20Radio.meta.js
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

                }
 });

})();