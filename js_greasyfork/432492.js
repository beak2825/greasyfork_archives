// ==UserScript==
// @name         HappyLeetcode
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/mouday/tampermonkey-script
// @version      0.2
// @description  做一个快乐的工程师，增加字体大小
// @author       Mouday
// @match        https://leetcode-cn.com/*
// @grant        none
// @email        pengshiyuyx@163.com

// @grant        window.onload
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/432492/HappyLeetcode.user.js
// @updateURL https://update.greasyfork.org/scripts/432492/HappyLeetcode.meta.js
// ==/UserScript==


// 添加用户自定义样式
function addUserStyle(){
    let style_ = '<style>.content__1Y2H{font-size: 16px}</style>';
    document.body.insertAdjacentHTML('beforeend', style_);
}


(function() {
    'use strict';
    addUserStyle();

})();