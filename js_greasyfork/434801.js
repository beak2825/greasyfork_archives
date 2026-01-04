// ==UserScript==
// @name         订单详情自动点击取消隐藏按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this!
// @author       双鱼
// @include      *://trade.tmall.com/detail/orderDetail*
// @icon         //img.alicdn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434801/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/434801/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
var xsDiv="#appSifg > div > div > div" //声明按钮元素,用来模拟点击
var imgSrc="https://img.alicdn.com/imgextra/i2/O1CN01GSdb4q28dtn7GUSSr_!!6000000007956-2-tps-166-104.png"//声明按钮图片链接,关闭状态的图片地址
var xsSrc="#appSifg > div > div > div > img"//声明按钮图片元素地址，用以获取src地址
window.onload=function(){//网页加载完之后再运行
        //新手，啥都不会，所有代码都是东拼西凑的，但是功能能够实现自己的需求。大神们可以多多指导一下~
    if(document.querySelector(xsSrc).src==imgSrc){
        document.querySelector(xsDiv).click();
        }
    }
})();