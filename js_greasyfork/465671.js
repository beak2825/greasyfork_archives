// ==UserScript==
// @name         天堂
// @version      0.0.4
// @description  删除天堂网站广告
// @author       You
// @include      /^https://\d+maoaq\.com.+$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=40maoaq.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/933558
// @downloadURL https://update.greasyfork.org/scripts/465671/%E5%A4%A9%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/465671/%E5%A4%A9%E5%A0%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const origin = window.location.origin;
    const reg = /http(s)?:\/\/\d+maoaq\.com/img;
    setTimeout(() => {
        if (reg.test(origin)) {
            const ad = document.querySelector('#midBox'),
                fixedAd = document.querySelector('#couplet'),
                btmBox = document.querySelector('#btmBox'),
                listBox = document.querySelector('#listBox'),
                listwoBox = document.querySelector('#listwoBox');
            document.querySelectorAll('.search')[0].style.display = 'block';
            ad.remove();
            fixedAd.remove();
            btmBox.remove();
            listBox && listBox.remove();
            listwoBox && listwoBox.remove();
        }
    })
    // Your code here...
})();
