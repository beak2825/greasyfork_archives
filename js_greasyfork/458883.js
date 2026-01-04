// ==UserScript==
// @name         国际站关键词对应搜索产品数查询 By 公众号搜索国际站Sky，微信号sky-0945
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      4.0
// @license      
// @description  快速查看国际站具体某个关键词对应的产品数
// @author       By 公众号搜 国际站Sky
// @match        https://www.alibaba.com/trade/search?*
// @icon         http://wx.qlogo.cn/mmopen/P5BIJwfH4HxRiapnX9AQg7FIh4nqEGmpncvIvdBqFxiaYPUyzq8ibNGoORy5B4kNMicRhicRshBSZAl9yogvJWm2RibenCdFsZZuzD/64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458883/%E5%9B%BD%E9%99%85%E7%AB%99%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AF%B9%E5%BA%94%E6%90%9C%E7%B4%A2%E4%BA%A7%E5%93%81%E6%95%B0%E6%9F%A5%E8%AF%A2%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.user.js
// @updateURL https://update.greasyfork.org/scripts/458883/%E5%9B%BD%E9%99%85%E7%AB%99%E5%85%B3%E9%94%AE%E8%AF%8D%E5%AF%B9%E5%BA%94%E6%90%9C%E7%B4%A2%E4%BA%A7%E5%93%81%E6%95%B0%E6%9F%A5%E8%AF%A2%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.meta.js
// ==/UserScript==
 
setTimeout(function() {
    var html = document.documentElement.outerHTML;
    var number = html.match(/"offerTotalCount":(\d+),/g);
    var content = /\d+/.exec(number);
    //alert(content)
    var div = document.querySelector(".refine-filters__result-section");
    div.style.color = "Blue";
    div.style.fontWeight = "bold";
    var hr1 = document.createElement("hr");
    div.appendChild(hr1);
    var e = document.createElement("span");
    e.innerText = "(微信公众号搜 国际站Sky 进交流群，微信号:sky-0945)  搜索结果产品数 仅供参考：" + content;
    div.appendChild(e);
    var hr2 = document.createElement("hr");
    div.appendChild(hr2);
},
1000);