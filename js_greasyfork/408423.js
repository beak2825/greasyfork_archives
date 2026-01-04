// ==UserScript==
// @name         EmailHunter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  找到页面中的邮箱
// @author       Neo
// @match        *://*/*
// @grant        none
// @exclude *://*.google.com/*
// @exclude *://*.baidu.com/*
// @exclude *://*.google.com.hk/*
// @downloadURL https://update.greasyfork.org/scripts/408423/EmailHunter.user.js
// @updateURL https://update.greasyfork.org/scripts/408423/EmailHunter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let content = document.getElementsByTagName('body')[0].outerText;
    let emails = content.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g) || ['没有发现邮箱'];
    alert(emails.join('\n'));
})();