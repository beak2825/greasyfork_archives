// ==UserScript==
// @name         不要poop在我的剪貼板, bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stop pooping on my dear clipboard, bilibili
// @author       rotatehisglasses
// @match        https://www.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/455998/%E4%B8%8D%E8%A6%81poop%E5%9C%A8%E6%88%91%E7%9A%84%E5%89%AA%E8%B2%BC%E6%9D%BF%2C%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/455998/%E4%B8%8D%E8%A6%81poop%E5%9C%A8%E6%88%91%E7%9A%84%E5%89%AA%E8%B2%BC%E6%9D%BF%2C%20bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Element.prototype._addEventListener = Element.prototype.addEventListener;

    Element.prototype.addEventListener = function(type, listener, useCapture=false) {
        if (type !== 'copy'){
            this._addEventListener(type, listener, useCapture);
        }
    };
})();
