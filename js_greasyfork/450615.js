// ==UserScript==
// @name         百度谷歌互相跳转 手机页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 手机端百度谷歌互相跳转 手机页面
// @author       qxin
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license  MIT

// @match        *m.baidu.com/s?*
// @match        *www.google.com/search*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/450615/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E4%BA%92%E7%9B%B8%E8%B7%B3%E8%BD%AC%20%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450615/%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E4%BA%92%E7%9B%B8%E8%B7%B3%E8%BD%AC%20%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var baidu = false;
    var google = false;
    var keyword = "";
    var savDiv = document.createElement("savDiv");
    savDiv.addEventListener("click",clickSearch)

    // savList = [
    //         ["百度","https://m.baidu.com/s?word=%s",],
    //         ["谷歌","https://www.google.com/search?q=%s",]
    //     ]
    var savLink = ""

    if(window.location.host.match(/baidu.com/i)){
        savLink = "https://www.google.com/search?q=%s";
        baidu = true;
        savDiv.innerText="谷歌";
    } else{
        savLink = "https://m.baidu.com/s?word=%s";
        google = true;
        savDiv.innerText="百度";
    }

    document.body.appendChild(savDiv);

    function clickSearch(){
        if(baidu){
            keyword = document.querySelector("input#kw").value;
        }else if(google){
            keyword = document.querySelector("input[name='q']").value;
        }else{
            return;
        }
        savLink = savLink.replace("%s",keyword)
        window.open(savLink)
    }

    GM_addStyle("" +
        "savDiv{" +
            // "width:2em;" +
            "font-size:1.2em;" +
            "background:#ffffff40;" +
            "position:fixed;" +
            "right:1em;" +
            "top:10em;" +
            "padding: 2px;" +
            "border-radius: 2px;" +
            "border: 1px solid #fff;" +
            "backdrop-filter: blur(5px);" +
            "box-shadow: -1px -1px 2px rgb(240 240 240), 2px 2px 4px rgb(70 70 70 / 50%);" +
        "}" +
    +"")
})();