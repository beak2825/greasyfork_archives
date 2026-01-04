// ==UserScript==
// @name         只是针对CSDN 的博客
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  只是净化CSDN 的博客
// @author       You
// @match        *://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374810/%E5%8F%AA%E6%98%AF%E9%92%88%E5%AF%B9CSDN%20%E7%9A%84%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/374810/%E5%8F%AA%E6%98%AF%E9%92%88%E5%AF%B9CSDN%20%E7%9A%84%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var yxx = document.getElementsByClassName('fourth_column');
    var body1 = document.getElementsByClassName('csdn-tracking-statistics mb8 box-shadow');
    var un = document.getElementsByClassName('pulllog-box');
    var vpi = document.getElementById('adContent');

    yxx[0].parentNode.removeChild(yxx[0]);
    body1[0].parentNode.removeChild(body1[0]);
    un[0].parentNode.removeChild(un[0]);
    vpi[0].parentNode.removeChild(vpi[0]);

    var un2 = document.getElementById('recommend-box');

    un2[0].parentNode.removeChild(un2[0]);
})();