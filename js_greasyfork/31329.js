// ==UserScript==
// @name         博客园
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  快速添加随笔和文章!
// @author       Yungs
// @match        http*://www.cnblogs.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31329/%E5%8D%9A%E5%AE%A2%E5%9B%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/31329/%E5%8D%9A%E5%AE%A2%E5%9B%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = Delay();
    function Delay()
    {
        setTimeout(AddWrite,300);
    }
    function AddWrite()
    {
        var p = document.getElementById("span_userinfo");
        var f = p.firstElementChild;
        
        var a = document.createElement("a");
        a.href="https://i.cnblogs.com/EditPosts.aspx?opt=1";
        a.innerText="添加随笔";
        p.insertBefore(a,f);
        var b = document.createElement("a");
        b.href = "https://i.cnblogs.com/EditArticles.aspx?opt=1";
        b.innerText="添加文章";
        p.insertBefore(b,f);
    }
})();