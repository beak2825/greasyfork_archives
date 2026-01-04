// ==UserScript==
// @name         CSDN 免关注查看文章
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.1
// @description  CSDN 免关注查看完整文章
// @author       Jiang
// @match        *://*.csdn.net
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498425/CSDN%20%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/498425/CSDN%20%E5%85%8D%E5%85%B3%E6%B3%A8%E6%9F%A5%E7%9C%8B%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let article_content = document.querySelector('#article_content');
    if (article_content) {
        article_content.height = 'auto';
    }
})();