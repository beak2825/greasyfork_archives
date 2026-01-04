// ==UserScript==
// @name         不知道叫什么的工具箱
// @namespace    https://s.wkan.xyz/
// @version      0.2
// @description  一个不知道叫什么的工具箱
// @author       Wkan
// @include      /^https://ipublish.tmall.com/tmall/manager/render.htm?.*tab=on_sale.*/
// @include      /^https://item.manager.tmall.com/tmall/manager/render.htm?.*tab=on_sale.*/
// @grant GM_setClipboard
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391536/%E4%B8%8D%E7%9F%A5%E9%81%93%E5%8F%AB%E4%BB%80%E4%B9%88%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/391536/%E4%B8%8D%E7%9F%A5%E9%81%93%E5%8F%AB%E4%BB%80%E4%B9%88%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

var style = `
#toolsContainer {
position: fixed;
top: 40%;
left: 5px;
background-color: rgba(255, 255, 255, 0.5);
font-size: 14px;
border: 1px solid #ccc;
z-index: 99999;
padding: 0 15px 5px 15px;
}
#copyCurrentPage {
cursor: pointer;
width: 90px;
}
#subTitle {
font-size: 12px;
transform: scale(0.75);
display: inline-block;
line-height: 1;
color: #ccc
}
#boxTitle {
padding: 0 0 10px;
font-size: 16px;
text-align: center;
line-height: 1;
}
#boxTitle > h3 {
line-height: 1;
}
`;

var d = document;

function copyCurrentPage(e) {
    e.preventDefault();
    GM_setClipboard(Array.from(d.querySelectorAll('tr.next-table-row'))
                    .map(t => Array.from(t.querySelectorAll('span.product-desc-span'))
                         .map(n => n.innerText.trim()
                              .replace('ID:', '')
                              .replace(' 编码:', '\t'))
                         .join('\t'))
                    .join('\n'));

    e.target.innerText = "✔";

    setTimeout(() => {
        e.target.innerText = "复制商品列表";
    }, 1000);
}

(function() {
    'use strict';
    GM_addStyle(style);

    var title = d.createElement('div');
    title.innerHTML = '<span id="subTitle">不知道叫什么的</span><h3>工具箱</h3>';
    title.id = 'boxTitle';

    var c = d.createElement('div');
    c.id = 'toolsContainer';

    c.appendChild(title);


    var btn_ccp = d.createElement('button');
    btn_ccp.id = 'copyCurrentPage';
    btn_ccp.innerText = '复制商品列表';
    btn_ccp.onclick = copyCurrentPage;

    c.appendChild(btn_ccp);

    d.body.appendChild(c);
    console.dir(copyCurrentPage);
})();