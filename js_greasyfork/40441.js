// ==UserScript==
// @name         扇贝听力、一键展开
// @namespace    none
// @version      0.2
// @description  一键展开覆盖单词
// @author       You
// @match        https://www.shanbay.com/listen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40441/%E6%89%87%E8%B4%9D%E5%90%AC%E5%8A%9B%E3%80%81%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40441/%E6%89%87%E8%B4%9D%E5%90%AC%E5%8A%9B%E3%80%81%E4%B8%80%E9%94%AE%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

function exp() {
    items = document.querySelector('#test-or-preview > div.row-fluid.sentence-content.hide > div > p').children;
    for(var i=0;i<items.length;i++){
        items[i].click();
    }
};

var click_btn = document.createElement('li');
var click_a = document.createElement('a');
click_a.innerText="展开所有";
click_a.onclick = function(){exp();};
click_btn.appendChild(click_a);
var ul = document.querySelector('#main-navbar > div.sub-menu.active > ul');
ul.appendChild(click_btn);