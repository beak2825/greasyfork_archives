// ==UserScript==
// @name         迪士尼防跳转
// @namespace    http://lupohan.com
// @version      0.1
// @description  防止迪士尼跳转至迪士尼中国
// @author       lupohan44
// @match        http://*.disney.com/*
// @match        http://disney.com/*
// @grant        none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/28929/%E8%BF%AA%E5%A3%AB%E5%B0%BC%E9%98%B2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/28929/%E8%BF%AA%E5%A3%AB%E5%B0%BC%E9%98%B2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.match("intoverride=true"))
    {
        console.log("已不会自动跳转");
    }
    else
    {
        if(window.location.href.match("[?？]"))
        {
            console.log("在末尾添加&intoverride=true");
            window.location.href=window.location.href+"&intoverride=true"; 
        }
        else
        {
            console.log("在末尾添加?intoverride=true");
            window.location.href=window.location.href+"?intoverride=true"; 
        }

    }
})();