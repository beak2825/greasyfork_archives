// ==UserScript==
// @name         淘宝链接简化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在淘宝天猫商品详情页的左上角“网页无障碍”右侧，添加一个复制精简链接的按钮，点击后去除url中的id和skuId并写入剪贴板。
// @author       makabaka1234
// @match        https://detail.tmall.com/*
// @match        https://item.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542006/%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542006/%E6%B7%98%E5%AE%9D%E9%93%BE%E6%8E%A5%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function simplifyUrl() {
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        const skuId = url.searchParams.get('skuId');
        const simpleUrl = `https://item.taobao.com/item.htm?id=${id}${skuId?`&skuId=${skuId}`:''}`;
        // 复制到剪贴板
        navigator.clipboard.writeText(simpleUrl).then(() => {
            const msg = document.querySelector("#simplifyUrlMsg");
            msg.innerText = "已复制到剪贴板";
            setTimeout(() => {
                msg.innerText = "";
            }, 2000);
        })
    }
    const timerId = setInterval(()=>{
        const navBar = document.querySelector(".site-nav-bd-l");
        if(!navBar) return;
        clearInterval(timerId);
        setTimeout(() => {
            // 给navBar插入一个li > div > div > a
            const li = document.createElement("li");
            const div1 = document.createElement("div");
            // 设置div是flex 横向布局
            div1.style.display = "flex";
            div1.style.justifyContent = "center";
            div1.style.alignItems = "center";
            const p = document.createElement("p");
            p.id = "simplifyUrlMsg";
            p.style.color = "red";
            const a = document.createElement("a");
            const span = document.createElement("span");

            // 给li加上site-nav-menu site-nav-mobile这两个class
            li.classList.add("site-nav-menu", "site-nav-mobile");
            div1.classList.add("site-nav-menu-hd");
            span.innerText = "复制简化链接";
            a.href = "javascript:void(0)";
            a.onclick = simplifyUrl;
            a.appendChild(span);
            div1.appendChild(a);
            div1.appendChild(p);
            li.appendChild(div1);
            navBar.appendChild(li);
            console.log(navBar);
        }, 200);
    }, 50);
})();