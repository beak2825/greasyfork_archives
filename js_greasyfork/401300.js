// ==UserScript==
// @name         学习通 uooc 键盘快进
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.mooc1-1.chaoxing.com/*
// @match        *://*.uooc.net.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401300/%E5%AD%A6%E4%B9%A0%E9%80%9A%20uooc%20%E9%94%AE%E7%9B%98%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/401300/%E5%AD%A6%E4%B9%A0%E9%80%9A%20uooc%20%E9%94%AE%E7%9B%98%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==
(function() {
    'use strict';
document.onkeydown = function(event) {
                var e = event;                var keyCode = e.keyCode;　　　　                switch (keyCode) {　　　　                    case 39:                        document.getElementsByTagName('video')[0].currentTime += 5;                        break;                    case 37:                        document.getElementsByTagName('video')[0].currentTime -= 5;　　　                        break;                    case 32:                                                if (document.getElementsByTagName('video')[0].paused) {                            document.getElementsByTagName('video')[0].play()                        } else {                            document.getElementsByTagName('video')[0].pause()                        }　　                }　　            }
    // Your code here...
})();