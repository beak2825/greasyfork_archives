// ==UserScript==
// @name         BaiduShareInitAutClickSubmit
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Try to take over the world!
// @author       You
// @include      /https?:\/\/pan\.baidu\.com\/share\/init?.*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/480763/BaiduShareInitAutClickSubmit.user.js
// @updateURL https://update.greasyfork.org/scripts/480763/BaiduShareInitAutClickSubmit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var body = document.getElementsByTagName('body')[0];
    if (body === undefined || body === null) {
        return false;
    }

    window.addEventListener('load', function(event) {
        doMyMain();
    });
})();

function doMyMain() {
    var inputCode = document.getElementById('accessCode');
    if (inputCode === undefined || inputCode === null) {
        console.error("no input id 'accessCode' found.");
        return;
    }

    if (inputCode.value.length <= 0) {
        console.error("no access code inputed.")
        return;
    }

    var divSubmit = document.getElementById('submitBtn');
    if (inputCode === undefined || inputCode === null) {
        console.error("no submit button found.");
        return;
    }

    divSubmit.click();
    // https://pan.baidu.com/share/init?surl=wnG0QJ9KELh0YqE7A1OK4A&pwd=6uv1
}