// ==UserScript==
// @name         去除 Adblocker detected 提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  去除 Adblocker detected 提示123
// @author       your father
// @match        *://camcam.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=camcam.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448715/%E5%8E%BB%E9%99%A4%20Adblocker%20detected%20%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448715/%E5%8E%BB%E9%99%A4%20Adblocker%20detected%20%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

	document.querySelector('.adde_modal-overlay').remove()
	document.querySelector('.adde_modal_detector').remove()
	
})();