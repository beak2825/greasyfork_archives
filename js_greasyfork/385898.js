// ==UserScript==
// @name         【吉他社-jitashe.org】免登录下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       fengxxc
// @match        https://www.jitashe.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385898/%E3%80%90%E5%90%89%E4%BB%96%E7%A4%BE-jitasheorg%E3%80%91%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/385898/%E3%80%90%E5%90%89%E4%BB%96%E7%A4%BE-jitasheorg%E3%80%91%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var curdom = document.getElementById('gtp_download');
    curdom.removeAttribute('onclick');
    curdom.setAttribute('href', curdom.getAttribute('dlink'));
})();