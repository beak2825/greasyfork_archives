// ==UserScript==
// @name        Bing去广告
// @namespace   http://lovexy.fun/
// @version     0.0.1
// @description 去除Bing搜索结果的广告
// @author      lovexy-fun
// @license     MIT
// @match       https://cn.bing.com/search*
// @icon        https://cn.bing.com/favicon.ico
// @grant       none
// @run-at      document-end
// @supportURL  https://github.com/lovexy-fun/tampermonkey-script/issues
// @downloadURL https://update.greasyfork.org/scripts/453658/Bing%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/453658/Bing%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var self = document.getElementsByClassName('b_adTop')[0];
    if (self !== undefined) {
        var parent = self.parentElement;
        parent.removeChild(self);
    }

})();