// ==UserScript==
// @license       MIT
// @name iocoder弹窗
// @namespace ViolentMonkey Scripts
// @version 1.0
// @description Intercept jquery.min.js on the website and rewrite the setTimeout method
// @match https://*.iocoder.cn/*
// @grant unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/533188/iocoder%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/533188/iocoder%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
 
(function(unsafeWindow) {
'use strict';
 
// Intercept jquery.min.js on the website
var originalTimeout = unsafeWindow.setTimeout; // Save the original setTimeout method
 
// Global override to hijack the website's setTimeout method
unsafeWindow.setTimeout = function(ref, tm) {
//rewrite done
};
 
})(unsafeWindow);