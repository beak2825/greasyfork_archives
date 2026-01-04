// ==UserScript==
// @name         将cyol重定向到qndxx
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将https://h5.cyol.com/special/daxuexi/*的网站重定向到http://qndxx.bestcood.com/nanning/daxuexi
// @author       You
// @match        https://h5.cyol.com/special/daxuexi/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496756/%E5%B0%86cyol%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0qndxx.user.js
// @updateURL https://update.greasyfork.org/scripts/496756/%E5%B0%86cyol%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0qndxx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = 'http://qndxx.bestcood.com/nanning/daxuexi';
})();
