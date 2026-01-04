// ==UserScript==
// @name         京东无货商品加购物车
// @namespace    https://greasyfork.org/zh-CN/scripts/441968
// @version      0.2
// @description  修改按钮和链接，使京东JD无货商品可加入购物车，方便购买
// @author       You
// @match        https://item.jd.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441968/%E4%BA%AC%E4%B8%9C%E6%97%A0%E8%B4%A7%E5%95%86%E5%93%81%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/441968/%E4%BA%AC%E4%B8%9C%E6%97%A0%E8%B4%A7%E5%95%86%E5%93%81%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
// ==/UserScript==
function editButton(){
    let item_id = window.location.href.match(/.*\/(\d+).html.*?/)[1];
    let cartButton = document.getElementById('InitCartUrl');
    if (cartButton.href.indexOf("#none") != -1 ){
        // cartButton.href = 'http://gate.jd.com/InitCart.aspx?pid='+item_id + '&pcount=1&ptype=1'
        cartButton.href = 'https://cart.jd.com/gate.action?pid=' + item_id + '&pcount=1&ptype=1'
        cartButton.setAttribute("class",'btn-special1 btn-lg');
    }
}
 
(function() {
    'use strict';
    window.addEventListener('load', function() {
        editButton();
    }, false);
})();