// ==UserScript==
// @name         简书外链去除重定向，直接跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  新发现一个简书跳转链接的前缀
// @description  简书外链免跳转，去除重定向，直接访问源地址
// @author       sgd
// @icon         https://www.jianshu.com/favicon.ico
// @match        *://*.jianshu.com/*
// @grant        none
// @note         2020-01-08 创建
// @downloadURL https://update.greasyfork.org/scripts/394861/%E7%AE%80%E4%B9%A6%E5%A4%96%E9%93%BE%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/394861/%E7%AE%80%E4%B9%A6%E5%A4%96%E9%93%BE%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    // 定义简书跳转链接的前缀
    var prefixs = ["https://links.jianshu.com/go?to=", "https://link.jianshu.com/?t="];

    // 取出页面所有a标签
    var aList = document.getElementsByTagName("a");
    for(var i=0; i< aList.length; i++){
        var a = aList[i];
        var link = a.href;
        // 是否需要修改
        var flag = false;
        for(var j in prefixs){
            var prefix = prefixs[j];
            if(link.startsWith(prefix)){
                flag = true;
                // 将链接前缀去掉 并且对url进行转码
                link = decodeURIComponent(link.replace(prefix, ""));
                console.log(a.innerText +"  " + link);
                break;
            }
        }
        if(flag){
            // 是外链，需要修改
            a.href = link;
        }
    }
})();
