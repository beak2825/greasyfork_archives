// ==UserScript==
// @name         导出京东购物车文本链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  导出京东购物车文本链接到 Chrome 控制台
// @author       Androidcn
// @license      MIT
// @match        https://cart.jd.com/cart_index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @require     http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/443496/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/443496/%E5%AF%BC%E5%87%BA%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var $ = window.$;
    'use strict';

    $('#cart-body div.p-name a').each(function()
{
	var jdlink = /\/\/item\.jd\.com\/\d+\.html/
	var patt1 = new RegExp(jdlink);

    if(patt1.test($(this).attr('href')))
    {
    console.log($(this).attr('title'));
    console.log($(this).attr('href'));
    }
});
})();