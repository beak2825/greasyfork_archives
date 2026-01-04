// ==UserScript==
// @name         获取订单号
// @namespace    希音
// @version      0.2.2
// @description  获取希音后台我的订单页面的订单号
// @author       GROK
// @match        https://sso.geiwohuo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geiwohuo.com
// @grant        none 
// @license MIT  证书。最好直接写上，不然发布脚本的时候会出现提醒
// @downloadURL https://update.greasyfork.org/scripts/520570/%E8%8E%B7%E5%8F%96%E8%AE%A2%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520570/%E8%8E%B7%E5%8F%96%E8%AE%A2%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==


(function() {
    'use strict';
// 引入js
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
document.head.appendChild(script);
// 引入css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
document.head.appendChild(link);

// 创建按钮元素
const button = document.createElement('button');
button.textContent = '订单号';
button.className = 'floating-button';

// 为按钮添加样式
const style = document.createElement('style');
style.textContent = `
    .floating-button {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s;
        z-index: 1000;
    }
    .floating-button:hover {
        background-color: #0056b3;
    }
`;

// 将样式添加到文档头部
document.head.appendChild(style);

// 将按钮添加到页面
// document.querySelector("#sc-container-root > div > div > div.index-module__headerContainer___3PVl4.bg-shell-theme-mms-header > div > div.index-module__content___2wbL5.bg-shell-theme-mms-content > div.index-module__routerInfo___1h0cw").appendChild(button);
document.body.appendChild(button);


// 为按钮添加点击事件
button.addEventListener('click', async function () {


    if (document.title !== "我的订单") {
        Swal.fire({
            icon: 'error',
            title: '只能在我的订单页面使用',
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: 'top'
        })
        return
    }


    let list = new Array()
    document.querySelectorAll(".orderInfoCardLayout_akEku").forEach((item) => {
        let elementText = item.querySelector("div.orderListLayout_vl5a2 > div.orderListInner_DttdL > div:nth-child(1) > div.orderInfoCardItemHeader_KIWjU > div:nth-child(1) > span > span:nth-child(1)").textContent
        if (!elementText) {
            return
        }
        // list.push(elementText.match("GSUNP[A-Z0-9]+")[0])
        list.push(elementText.substring(4))

    })
    const text = JSON.stringify(list);
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            icon: 'success',
            title: '复制成功',
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: 'top'
        })
    }).catch(err => {
        Swal.fire({
            icon: 'error',
            title: '复制失败',
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            position: 'top'
        })
    });

})


    // Your code here...
})();