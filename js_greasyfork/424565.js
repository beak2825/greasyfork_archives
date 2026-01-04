// ==UserScript==
// @name         hidden baidu baike recommend list
// @namespace    http://tampermonkey.net/hiddenbaidubaikerecommendlist
// @version      0.1
// @description  屏蔽百度知道右侧推荐列表 增加内容显示区域
// @author       宏斌
// @match        https://zhidao.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424565/hidden%20baidu%20baike%20recommend%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/424565/hidden%20baidu%20baike%20recommend%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const slid = document.getElementsByClassName('grid-r qb-side')[0];
    if(slid){
        slid.parentNode.removeChild(slid);
        const content = document.getElementsByClassName('grid qb-content')[0];
        content.style.width='100%';
        console.log('👏');
    }
})();