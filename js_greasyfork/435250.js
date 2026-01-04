// ==UserScript==
// @name         Graphpad-Prism8/9英文在线帮助替换为中文网址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Graphpad软件中点击帮助后，链接转跳到浏览器打开帮助页，帮助页为英文，本脚本实现将帮助地址自动转换为中文地址
// @author       gdqb521
// @match        https://www.graphpad.com/guides/*
// @icon         http://www.graphpad-prism.cn/konecms/module/content/template/static/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435250/Graphpad-Prism89%E8%8B%B1%E6%96%87%E5%9C%A8%E7%BA%BF%E5%B8%AE%E5%8A%A9%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/435250/Graphpad-Prism89%E8%8B%B1%E6%96%87%E5%9C%A8%E7%BA%BF%E5%B8%AE%E5%8A%A9%E6%9B%BF%E6%8D%A2%E4%B8%BA%E4%B8%AD%E6%96%87%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==


(function() {
    var target_url;
    var current_url = window.location.href;
    if (current_url.indexOf("www.graphpad.com/guides") != -1 )
    {
        //替换“统计”
        target_url = current_url.replace("/统计/","/statistics/");
        target_url = target_url.replace("/%E7%BB%9F%E8%AE%A1/","/statistics/");
        //替换“曲线拟合”
        target_url = target_url.replace("/曲线拟合/","/curve-fitting/");
        target_url = target_url.replace("/%E6%9B%B2%E7%BA%BF%E6%8B%9F%E5%90%88/","/curve-fitting/");
        //替换latest
        target_url = target_url.replace("/latest/","/9/");
        //替换原始域名为中文官网域名
        target_url = target_url.replace("www.graphpad.com","www.graphpad-prism.cn");
    }
    window.location = target_url;
}
)();

