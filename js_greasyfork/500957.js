// ==UserScript==
// @name         拼多多自动跟价去除默认勾选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  None
// @author       linauror
// @match        https://mms.pinduoduo.com/goods/goods_add/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500957/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E8%B7%9F%E4%BB%B7%E5%8E%BB%E9%99%A4%E9%BB%98%E8%AE%A4%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/500957/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E8%B7%9F%E4%BB%B7%E5%8E%BB%E9%99%A4%E9%BB%98%E8%AE%A4%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setTimeout(function(){
        var autoFollowEle = document.getElementsByClassName('enroll-page-auto-follow_down__3O8R1');
        if (!autoFollowEle || autoFollowEle.length != 1) {
            console.log('拼多多自动跟价：未检测到自动跟价元素，忽略');
            return;
        }
        var autoFollowCheckBox = autoFollowEle[0].getElementsByTagName('input');
        if (!autoFollowCheckBox || autoFollowCheckBox.length != 1) {
            console.log('拼多多自动跟价：未检测到自动跟价复选框，忽略');
            return;
        }
        autoFollowCheckBox[0].click(); // 点击去除勾选
        console.log('拼多多自动跟价：已去除勾选');
    },5000);


})();