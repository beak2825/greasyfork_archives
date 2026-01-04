// ==UserScript==
// @name         国际站店铺产品数量查询 By 公众号搜索国际站Sky，微信号sky-0945
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      2.0
// @license      
// @description  快速查看国际站店铺全部产品数
// @author       By 公众号搜 国际站Sky
// @match        https://*.en.alibaba.com/*
// @icon         http://wx.qlogo.cn/mmopen/P5BIJwfH4HxRiapnX9AQg7FIh4nqEGmpncvIvdBqFxiaYPUyzq8ibNGoORy5B4kNMicRhicRshBSZAl9yogvJWm2RibenCdFsZZuzD/64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458880/%E5%9B%BD%E9%99%85%E7%AB%99%E5%BA%97%E9%93%BA%E4%BA%A7%E5%93%81%E6%95%B0%E9%87%8F%E6%9F%A5%E8%AF%A2%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.user.js
// @updateURL https://update.greasyfork.org/scripts/458880/%E5%9B%BD%E9%99%85%E7%AB%99%E5%BA%97%E9%93%BA%E4%BA%A7%E5%93%81%E6%95%B0%E9%87%8F%E6%9F%A5%E8%AF%A2%20By%20%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99Sky%EF%BC%8C%E5%BE%AE%E4%BF%A1%E5%8F%B7sky-0945.meta.js
// ==/UserScript==
 
var main = setInterval(function() {
    var html = document.documentElement.outerHTML;
    var titles = document.head.querySelector("[name~=description][content]").content;
    if (titles)
    {
    var reg = /TotalLines%22%3A(\d+)%2C/g;
    var content = titles.substring(titles.indexOf("and") + 3);
    //alert(content);
    var number = reg.exec(html)[1]
    //alert(number)
    var div = document.querySelector(".next-tabs-nav");
    div.style.color = "Blue";
    div.style.fontWeight = "bold";
    var hr1 = document.createElement("hr");
    div.appendChild(hr1);
    var e = document.createElement("span");
    e.innerText = "(公众号搜 国际站Sky 进交流群 微信号:sky-0945)  全店产品数量：" + number;
    div.appendChild(e);
    var hr2 = document.createElement("hr");
    div.appendChild(hr2);
    clearInterval(main);
    }
},
2000);