// ==UserScript==
// @name         csdn 极简版
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  csdn 页面极端简化版, 只显示正文.
// @author       kgzhang
// @match        https://blog.csdn.net/*/article/details/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401197/csdn%20%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/401197/csdn%20%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

// 有时会渲染失败,影响后面的执行
try{
    GM_addStyle('.recommend-right_aside {display:none}');
    GM_addStyle('.tool-box {display:none}');
    GM_addStyle('.csdn-side-toolbar {display:none}');
    GM_addStyle('.blog_container_aside {display:none}');
    GM_addStyle('.csdn-toolbar {display:none}');
    GM_addStyle('.csdn-toolbar {display:none}');
    GM_addStyle('.container#mainBox main {width: unset 1000px}');
    GM_addStyle('.blog-content-box{width: 1200px; margin-left: -200px;}')
    // 屏蔽评论框
    GM_addStyle('.comment-box{display: none;}')
    // 屏蔽推荐
    GM_addStyle('.recommend-box{display: none;}')
    GM_addStyle('.template-box{display: none;}')
} catch (e){

}



(function() {
    'use strict';

    // Your code here...
    window.onload = ()=> {
        window.localstorage.setItem('anonymousUserLimit','');
        const box = document.getElementById('passportbox');
        if (box) {
            box.style.display = 'none';
        }
        const blog = document.querySelector('.blog-content-box');
        if (blog) {
            blog.parentNode.children[4].style.display = 'none';
        }
    }
    window.addEventListener('scroll', ()=>{
        // 阅读更多
        const got = document.querySelector('a[class="btn-readmore"]')
        if (got) {
            got.click();
        }
    })
    // 定期检查广告弹框
    setInterval(()=>{
        const blog = document.querySelector('.blog-content-box');
        if (blog && blog.parentElement.children[4].tagName === 'DIV') {
            blog.parentElement.children[4].style.display = 'none';
        }
    }, 200);
})();