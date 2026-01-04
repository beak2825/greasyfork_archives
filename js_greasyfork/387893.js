// ==UserScript==
// @name         CSDN去重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CSDN外链免跳转，去除重定向，直接访问源地址
// @author       慎终君
// @match        *://*.csdn.com/*
// @note         2019.07.26-V0.1 未找到CSDN去重定向脚本，根据xiaobai050的简书外链去除重定向脚本修改而来。如有侵权请联系我。
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387893/CSDN%E5%8E%BB%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/387893/CSDN%E5%8E%BB%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    var pre = "https://www.csdn.net/link/?target_url=";
    var as = document.getElementsByTagName("a");
    for(var i = 0; i < as.length; i++){
        var a = as[i];
        var link = a.href;
        if(link.startsWith(pre)){
            link = link.replace(pre,"");
            link = decodeURIComponent(link);
            a.href = link;
        }
    }
})();