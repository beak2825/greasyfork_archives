// ==UserScript==
// @name         替换百度学术知网链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  null
// @author       flaribbit
// @match        https://xueshu.baidu.com/usercenter/paper/show?paperid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416855/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AF%E7%9F%A5%E7%BD%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416855/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E5%AD%A6%E6%9C%AF%E7%9F%A5%E7%BD%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var item = document.querySelector(".dl_source[title=知网]");
    if(item){
        var res = item.parentElement.href.match(/www.cnki.com.cn\/Article\/(.+?)-(.+?)\.htm/);
        if(res){
            item.innerText = "知网（已替换）"
            item.parentElement.href = `http://kns.cnki.net/kcms/detail/detail.aspx?dbname=${res[1]}&filename=${res[2]}`;
        }
    }
})();