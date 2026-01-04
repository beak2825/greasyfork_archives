// ==UserScript==
// @name         Github HTML Preview Button (HTML 预览按钮)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Adds a button to preview HTML files on Github using htmlpreview. 添加一个按钮以使用 htmlpreview 在 Github 上预览 HTML 文件。
// @author      cjm
// @match        https://github.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462832/Github%20HTML%20Preview%20Button%20%28HTML%20%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462832/Github%20HTML%20Preview%20Button%20%28HTML%20%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const func = ()=>{
        var element = document.getElementById("wocao3");
        element && element.parentNode.removeChild(element);

        if (window.location.href.endsWith('.htm') || window.location.href.endsWith('.html')) {
            const url = window.location.href;
            const btn1 = `<a id="wocao3" class="btn ml-2 d-none d-md-block" style="
background: #171a1c;
    color: white;
    display: inline-block !important;
    /*width: 48%;*/
    text-align: center;
    /*margin: 5px;*/
    " target="_blank" href="${`http://htmlpreview.github.io/?${url}`}">` + 'HTML Preview' + '</a>'

            const parent = document.querySelector('.pagehead-actions > li:last-child');
            //.pagehead-actions   //#repository-container-header
            parent.insertAdjacentHTML('beforeBegin', btn1);
        }
    }

    func();

    window.addEventListener('hashchange', ()=>{
        func();
    }
    )

    //修改native以拦截popstate事件
    var pushState = history.pushState;
    history.pushState = function() {
        var ret = pushState.apply(history, arguments);
        window.dispatchEvent(new Event("pushstate"));
        window.dispatchEvent(new Event("locationchangefathom"));
        return ret;
    }

    window.addEventListener("popstate", function() {
        window.dispatchEvent(new Event("locationchangefathom"))
    });
    window.addEventListener("locationchangefathom", trackPageview)
    function trackPageview() {
        func();
    }

}
)();
