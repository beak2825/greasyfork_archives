// ==UserScript==
// @name         恢复百度贴吧吧务删帖按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  恢复吧务删帖按钮
// @match        https://tieba.baidu.com/p/*
// @icon         https://tieba.baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437516/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%90%A7%E5%8A%A1%E5%88%A0%E5%B8%96%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/437516/%E6%81%A2%E5%A4%8D%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%90%A7%E5%8A%A1%E5%88%A0%E5%B8%96%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    // 当帖子内有屏蔽选项（判断是否为吧务）且没有删帖选项（排除自己发的帖子）时，再执行替换
    if(document.querySelector('.l_thread_manage>.d_del_thread') && document.querySelector('.l_thread_manage').children[0].children[0].textContent != '删除主题')
    {
        'use strict';
        let temp0=document.querySelector('.l_thread_manage');
        let temp1=document.createElement('div');
        temp1.className='d_del_thread';
        temp1.appendChild(document.createElement('a'));
        temp1.children[0].rel='noopener';
        temp1.children[0].className='j_thread_delete';
        temp1.children[0].textContent='删除主题';
        temp1.children[0].href=temp0.children[0].children[0].href;
        temp0.insertBefore(temp1,temp0.children[0]);
        // Your code here...
    }
})();