// ==UserScript==
// @name         To Dounai 抢HUAWEI Mate 60 Pro 12GB+512GB 雅川青
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抢HUAWEI Mate 60 Pro 12GB+512GB 雅川青
// @author       Juzi
// @match        https://www.vmall.com/product/10086009079805.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/475729/To%20Dounai%20%E6%8A%A2HUAWEI%20Mate%2060%20Pro%2012GB%2B512GB%20%E9%9B%85%E5%B7%9D%E9%9D%92.user.js
// @updateURL https://update.greasyfork.org/scripts/475729/To%20Dounai%20%E6%8A%A2HUAWEI%20Mate%2060%20Pro%2012GB%2B512GB%20%E9%9B%85%E5%B7%9D%E9%9D%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个按钮元素
    var button = document.createElement("button");
    // 设置按钮的文本内容
    button.innerHTML = "开始抢购";
    button.style.cssText = `
    width: 140px;
    height:80px;
position: fixed;
top:50%;
right:5%;
background:#E27500;
color: #fff;
    font-size:28px;
    cursor: pointer;
    border-radius: 8px;
    `
    // 给按钮添加事件监听器
    button.addEventListener("click", function() {
        const willStartBtnWrap = document.querySelector(".product-buttonmain");
        if (willStartBtnWrap) {
            const willStartBtn = willStartBtnWrap.querySelector(".product-button02");
            console.log("willStartBtn", willStartBtn);
            if (willStartBtn && willStartBtn.className.indexOf("disabled") > -1) {
                willStartBtn.className = willStartBtn.className.replace("disabled", "");
                console.log("开始去订单页");
                window.ec.product.orderNow();
            }
        }
    });
    document.body.appendChild(button);
})();