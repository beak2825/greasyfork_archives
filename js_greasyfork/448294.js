// ==UserScript==
// @run-at       document-start
// @name         洛谷学术脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  洛谷逐渐饭圈化，抵制摸鱼，认真学术
// @author       cyx
// @match        *://www.luogu.com.cn/discuss/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448294/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448294/%E6%B4%9B%E8%B0%B7%E5%AD%A6%E6%9C%AF%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
    'use strict';
    let url=window.location.href
    if(url.includes("lists")){
        let css=`
            .am-u-md-4 [href="/discuss/lists?forumname=relevantaffairs"]{
                display:none
            }
        `
        GM_addStyle(css)
        if(url.includes("relevantaffairs")){
            // ShowMsg("您正在浏览灌水区讨论。快去卷题！5秒后将自动关闭当前页面。")
            document.getElementsByClassName("lfe-h1")[0].innerHTML+='<br><a href="/problem/list" style="color: white">不要摸鱼，点击这里去卷题</a>';
            // setTimeout("window.close()",5000)
        }
    }
    else if(document.getElementsByClassName('colored')[0].href.includes("relevantaffairs") || document.getElementsByClassName('colored')[0].innerText=="灌水区"){
        // ShowMsg("您正在浏览灌水区讨论。快去卷题！5秒后将自动关闭当前页面。")
        document.getElementsByClassName("lfe-h1")[0].innerHTML+='<br><a href="/problem/list" style="color: white">不要摸鱼，点击这里去卷题</a>';
        // setTimeout("window.close()",5000)
    }
    //1.2版
})();