// ==UserScript==
// @name         测试-国际站直播回放数据查询-By 微信公众号搜索国际站运营Sky
// @namespace    https://mp.weixin.qq.com/s/DtcPGtbc34bORAsrsf0OvA
// @version      0.1
// @license      MIT
// @description  快速查看直播回放的观看数和点赞数
// @author       By 公众号搜 国际站Sky
// @match        https://www.alibaba.com/live/*
// @match        https://watch.alibaba.com/*
// @icon         data:http://wx.qlogo.cn/mmopen/P5BIJwfH4HxRiapnX9AQg7FIh4nqEGmpncvIvdBqFxiaYPUyzq8ibNGoORy5B4kNMicRhicRshBSZAl9yogvJWm2RibenCdFsZZuzD/64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458122/%E6%B5%8B%E8%AF%95-%E5%9B%BD%E9%99%85%E7%AB%99%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2-By%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.user.js
// @updateURL https://update.greasyfork.org/scripts/458122/%E6%B5%8B%E8%AF%95-%E5%9B%BD%E9%99%85%E7%AB%99%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2-By%20%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E5%9B%BD%E9%99%85%E7%AB%99%E8%BF%90%E8%90%A5Sky.meta.js
// ==/UserScript==
 
setTimeout(function() {
    var html = document.documentElement.outerHTML;
    //var number = html.match(/"userInteractionCount":(\d+)}/g);
    var viewCount = /"userInteractionCount":(\d+)}/.exec(html)[1];
    var praise = /"praiseCount":(\d+),/.exec(html)[1];
    //alert(praise)
    var div = document.querySelector('.room-head-left');
    //var child = document.getElementsByClassName('meta-title');
    var e = document.createElement("span");
    e.style.color = "white";
    e.style.fontWeight = "BOLD";
    e.innerText = "微信公众号搜 国际站Sky 进交流群，微信号:sky-0945 \r\n 直播累计观看人次：" + viewCount;
    div.appendChild(e);
    var f = document.createElement("span");
    f.style.color = "white";
    f.style.fontWeight = "bold";
    f.innerText = "\r\n 直播累计点赞人次：" + praise;
    div.appendChild(f);
},
1000);