// ==UserScript==
// @name         淘宝规格名字显示
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  像手机淘宝一样选择规格时会显示它的名称而不是只显示图片
// @author       You
// @include      *://*.taobao.com/*
// @include      *://*.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381072/%E6%B7%98%E5%AE%9D%E8%A7%84%E6%A0%BC%E5%90%8D%E5%AD%97%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/381072/%E6%B7%98%E5%AE%9D%E8%A7%84%E6%A0%BC%E5%90%8D%E5%AD%97%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
addGlobalStyle(".tb-prop .tb-img li a span{max-width:1000px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-indent:0}.tb-prop .tb-img li a{text-decoration:none;width:auto!important;background-position:left center!important;padding:0 9px 0 45px!important}#detail .tb-key .tb-prop .tb-img li span{display:inline}");function addGlobalStyle(css){var head,style;head=document.getElementsByTagName("head")[0];if(!head){return}style=document.createElement("style");style.type="text/css";style.innerHTML=css;head.appendChild(style);};
setTimeout(function(){if(typeof(Hub)=="undefined")return;var a = document.getElementsByTagName('dd')[0].firstElementChild.children;var aa=Hub.config.config.sku.valItemInfo.propertyMemoMap;for(var i=0;i<a.length;i++){var b=a[i];var c=a[i].dataset.value;if(typeof(aa[c])!="undefined"&&b.firstElementChild.firstElementChild.innerText!=aa[c]){b.firstElementChild.firstElementChild.innerText=aa[c]}};},3000);
})();