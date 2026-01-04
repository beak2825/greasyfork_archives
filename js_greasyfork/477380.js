// ==UserScript==
// @name         京东JD无货商品加购物车2023
// @namespace    https://mou.science
// @version      0.3
// @description  添加京东无货加购按钮，使京东JD无货商品可加入购物车，方便购买
// @author       You
// @match        https://item.jd.com/*
// @match        https://item.yiyaojd.com/*
// @match        https://npcitem.jd.hk/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477380/%E4%BA%AC%E4%B8%9CJD%E6%97%A0%E8%B4%A7%E5%95%86%E5%93%81%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A62023.user.js
// @updateURL https://update.greasyfork.org/scripts/477380/%E4%BA%AC%E4%B8%9CJD%E6%97%A0%E8%B4%A7%E5%95%86%E5%93%81%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A62023.meta.js
// ==/UserScript==

// 定义函数来在id为 InitCartUrl 的按钮后面添加一个新按钮
function addButtonAfterCartButton(){
    // 从URL中提取商品ID
    let item_id = window.location.href.match(/.*\/(\d+).html.*?/)[1];
    // 获取原始按钮元素
    let cartButton = document.getElementById('InitCartUrl');
    console.log("Cart Button Element:", cartButton); // 在控制台输出 cartButton 的值

    // 创建一个新的按钮元素
    let newButton = document.createElement("button");
    newButton.innerHTML = "无货加购"; // 设置新按钮的文本内容
    newButton.setAttribute("class",'btn-special1 btn-lg'); // 设置新按钮的类
    newButton.onclick = function(){
        window.location.href = 'http://gate.jd.com/InitCart.aspx?pid='+item_id + '&pcount=1&ptype=1';
    };

    // 在原始按钮后面插入新按钮
    cartButton.parentNode.insertBefore(newButton, cartButton.nextSibling);
}

// 在页面加载时执行添加新按钮的函数
(function() {
    'use strict';
    // 添加控制台输出以检查脚本是否运行
    console.log("Running JD cart script...");
    window.addEventListener('load', function() {
        // 添加控制台输出以检查按钮编辑是否成功
        console.log("Adding new button after cart button...");
        addButtonAfterCartButton();
    }, false);
})();
