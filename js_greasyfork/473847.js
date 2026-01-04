// ==UserScript==
// @name         B站添加 当前在线 按钮
// @namespace    https://greasyfork.org/zh-CN/scripts/473847
// @license      MIT
// @version      0.1
// @description  在换一换的下面添加"当前在线"按钮
// @author       bowya
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473847/B%E7%AB%99%E6%B7%BB%E5%8A%A0%20%E5%BD%93%E5%89%8D%E5%9C%A8%E7%BA%BF%20%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/473847/B%E7%AB%99%E6%B7%BB%E5%8A%A0%20%E5%BD%93%E5%89%8D%E5%9C%A8%E7%BA%BF%20%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="absolute"
    Container.style.left="92.75%"
    Container.style.top="20%"
    Container.style['z-index']="999999"
    Container.innerHTML =`<button id="myCustomize" style="position:absolute; top:210px; width:40px; height:80px" class="primary-btn roll-btn"><span>当前在线</span></button>`

    document.body.appendChild(Container);
    Container.addEventListener('click',function () {
        //你的点击事件
        //同一页面跳转
        //window.location.href = "https://www.bilibili.com/video/online.html";

        //不同页面跳转
        window.open("https://www.bilibili.com/video/online.html");
    })

    //参考网址
    //http://t.csdn.cn/rk3Vd

})();