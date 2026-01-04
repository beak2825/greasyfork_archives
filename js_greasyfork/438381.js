// ==UserScript==
// @name            UserAgent-iPad
// @version         0.2.0
// @match           https://tv.cctv.com/1*
// @match           https://tv.cctv.com/2*
// @match           https://www.huya.com/*
// @match           https://www.douyu.com/*
// @description     脚本用于开启移动视图
// @grant           none
// @run-at          document-start
// @license         CC
// @namespace       https://greasyfork.org/zh-CN/users/135090
// @author          zwb
// @downloadURL https://update.greasyfork.org/scripts/438381/UserAgent-iPad.user.js
// @updateURL https://update.greasyfork.org/scripts/438381/UserAgent-iPad.meta.js
// ==/UserScript==
Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
'use strict';
Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (iPad; CPU OS 12_4_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",writable:false,configurable:false,enumerable:true});