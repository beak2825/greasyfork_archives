// ==UserScript==
// @name         baidu baike remove side content
// @namespace    http://tampermonkey.net/baidu_baike_remove_side_content
// @version      0.1
// @description  去掉右侧的其他推荐项 增宽百科的内容的显示区域
// @author       hongbin
// @match        https://baike.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424502/baidu%20baike%20remove%20side%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/424502/baidu%20baike%20remove%20side%20content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('👏');
    const sideContent = document.getElementsByClassName('side-content')[0];
    sideContent.parentNode.removeChild(sideContent);
    const mainContent = document.getElementsByClassName('main-content')[0];
    mainContent.style.width = '95%';
})();