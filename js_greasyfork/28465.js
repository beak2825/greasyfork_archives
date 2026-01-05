// ==UserScript==
// @name         qq-h5
// @namespace    https://greasyfork.org/users/111819-gooyie
// @version      0.1.0
// @description  在非mac平台上使用qq html5播放器
// @author       gooyie
// @license      MIT License
//
// @include      *://*.qq.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28465/qq-h5.user.js
// @updateURL https://update.greasyfork.org/scripts/28465/qq-h5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UA_MAC = 'Macintosh Mac OS X 2333...'; // regexp: /Macintosh.*mac\sos\sx\s([\d_\.]+)/i

    class Mocker {

        static mock() {
            this._fakeMacPlatform();
        }

        static _fakeMacPlatform() {
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_MAC});
        }

    }

    Mocker.mock();

})();