// ==UserScript==
// @name 禁止弹出对话框
// @namespace 禁止弹出对话框
// @description 阻止弹出对话框
// @author shalongbus
// @version 1.0
// @run-at document-start
// @include http://*
// @include https://*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/371877/%E7%A6%81%E6%AD%A2%E5%BC%B9%E5%87%BA%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/371877/%E7%A6%81%E6%AD%A2%E5%BC%B9%E5%87%BA%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==

window.alert = function(a) {
    console.log.call(this, a);
};