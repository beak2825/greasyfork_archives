// ==UserScript==
// @name         删帖【上次不小心更新错脚本了】
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  一个删帖小脚本!
// @author       You
// @include      *://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @license        MIT
// @description    删帖
// @downloadURL https://update.greasyfork.org/scripts/436403/%E5%88%A0%E5%B8%96%E3%80%90%E4%B8%8A%E6%AC%A1%E4%B8%8D%E5%B0%8F%E5%BF%83%E6%9B%B4%E6%96%B0%E9%94%99%E8%84%9A%E6%9C%AC%E4%BA%86%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/436403/%E5%88%A0%E5%B8%96%E3%80%90%E4%B8%8A%E6%AC%A1%E4%B8%8D%E5%B0%8F%E5%BF%83%E6%9B%B4%E6%96%B0%E9%94%99%E8%84%9A%E6%9C%AC%E4%BA%86%E3%80%91.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let d_post_manage=document.getElementById('d_post_manage');
    let l_thread_manage=d_post_manage.parentNode;
 
    let d_del_thread=document.createElement("div");
    d_del_thread.className="d_del_thread";
 
    let j_thread_delete=document.createElement("a");
    j_thread_delete.rel="noopener";
    j_thread_delete.className="j_thread_delete";
    j_thread_delete.href="#";
    j_thread_delete.innerText="删除主题（吧务）";
    d_del_thread.appendChild(j_thread_delete);
    l_thread_manage.insertBefore(d_del_thread,d_post_manage);
 
 
 
 
    //let a=document.getElementsByClassName("j_thread_shield")[0];a.innerText="删除主题（吧务）";a.className="j_thread_delete";
 
    // Your code here...
})();