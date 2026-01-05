// ==UserScript==
// @name         css88辅助工具
// @namespace    https://blog.tofuliang.tk/
// @version      0.1
// @description  css88上的辅助性工具，用于去除广告等
// @author       tofuliang
// @match        http://www.css88.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22923/css88%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/22923/css88%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var uw = this;
    var ac = uw.Node.prototype.appendChild;
    uw.Node.prototype.appendChild = function(dom) {
        if ((dom.nodeName || dom.tagName).toUpperCase() === 'DIV' && this.tagName === 'BODY' && dom.querySelector('.cry-face-con-close')) {
            uw.Node.prototype.appendChild = ac;
            return;
        }
        return ac.apply(this, Array.prototype.slice.call(arguments));
    };
}).apply(unsafeWindow);
