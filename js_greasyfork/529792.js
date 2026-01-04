// ==UserScript==
// @name         GOJ比赛界面修复
// @version      0.1
// @description  比赛界面修复
// @match        http://goj.wiki/d/Union2024/contest/*
// @author       MlkMathew
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/529792/GOJ%E6%AF%94%E8%B5%9B%E7%95%8C%E9%9D%A2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/529792/GOJ%E6%AF%94%E8%B5%9B%E7%95%8C%E9%9D%A2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!location.href.match('scoreboard')){
        return ;
    }
    const s=document.querySelectorAll('.col--');
    for(let i=0;i<s.length;i++)
    {
        s[i].className='col--problem';
    }
})();
