// ==UserScript==
// @name         国际站快速查看产品关键词 By 公众号搜索国际站Sky，微信号sky-0945
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      2.0
// @icon         http://wx.qlogo.cn/mmopen/P5BIJwfH4HxRiapnX9AQg7FIh4nqEGmpncvIvdBqFxiaYPUyzq8ibNGoORy5B4kNMicRhicRshBSZAl9yogvJWm2RibenCdFsZZuzD/64
// @description  快速查看产品关键词
// @author       国际站Sky
// @match        https://www.alibaba.com/product-detail/*
// @match        https://*.en.alibaba.com/product/*
// @grant        unsafeWindow
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/458898/%E5%9B%BD%E9%99%85%E7%AB%99%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E4%BA%A7%E5%93%81%E5%85%B3%E9%94%AE%E8%AF%8D%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.user.js
// @updateURL https://update.greasyfork.org/scripts/458898/%E5%9B%BD%E9%99%85%E7%AB%99%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B%E4%BA%A7%E5%93%81%E5%85%B3%E9%94%AE%E8%AF%8D%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.meta.js
// ==/UserScript==


setTimeout(function(){

  var html=document.documentElement.outerHTML;var titles=document.title;var title=titles.substring(titles.indexOf("- Buy")+5).replace("Product on Alibaba.com","");var edit="";if(html.indexOf("is-magic")==-1){edit="普通编辑 [公众号@国际站Sky;微信号sky-0945 ]"}else{edit="智能编辑 [公众号@国际站Sky; 微信号sky-0945]"}var key=title.split(",");var div=document.querySelector("[id=module_title] div");if(!div){div=document.querySelector(".product-title")}var hr1=document.createElement("hr");div.appendChild(hr1);var e=document.createElement("span");e.innerText=edit;div.appendChild(e);var hr2=document.createElement("hr");div.appendChild(hr2);for(var i=0;i<key.length;i++){var div2=document.createElement("span");div2.setAttribute("class","");div2.setAttribute("style","color:#E56600");div2.setAttribute("title","公众号：国际站Sky");div2.setAttribute("alt","公众号：国际站Sky");div2.innerText=key[i];div.appendChild(div2);div.appendChild(document.createElement("br"))}var hr=document.createElement("hr");div.appendChild(hr);
div.style.color = "Blue";


},1000);