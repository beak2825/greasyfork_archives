// ==UserScript==
// @name         Cutout Pro Util
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable disabling contextmenu
// @author       蝙蝠の目
// @match        https://www.cutout.pro/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451226/Cutout%20Pro%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/451226/Cutout%20Pro%20Util.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const org = Node.prototype.appendChild;
    Node.prototype.appendChild = function (elm) {
        if (elm?.tagName === "IMG") {
            elm.oncontextmenu = null;
        }
        return org.call(this, elm);
    };
})();