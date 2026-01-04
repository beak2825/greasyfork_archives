// ==UserScript==
// @name         CSDN免登录复制
// @version      1.2
// @namespace    http://tampermonkey.net/
// @description  new script
// @author       yumaocc
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449754/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449754/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
      let code = document.querySelectorAll('code')
      code.forEach(item => {
        item.style.userSelect = 'text'
      })
})();