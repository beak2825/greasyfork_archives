// ==UserScript==
// @name         Yukuotang Animated Uncover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reveal hidden slides with animation.
// @author       Leo
// @match        https://pro.yuketang.cn/lesson/fullscreen/v3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478052/Yukuotang%20Animated%20Uncover.user.js
// @updateURL https://update.greasyfork.org/scripts/478052/Yukuotang%20Animated%20Uncover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const check_set = () => {
        document.getElementsByClassName('ppt__modal box-center')[0].style.display = 'none';
        document.getElementsByClassName('slide__cmp')[0].style.display = 'block';
    };
    setInterval(check_set, 1000);
})();