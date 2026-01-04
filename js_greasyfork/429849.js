// ==UserScript==
// @name         爱奇艺CK获取
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  用于获取爱奇艺Cookie,方便解析m3u8
// @author       晚枫QQ237832960
// @match        https://www.iqiyi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429849/%E7%88%B1%E5%A5%87%E8%89%BACK%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429849/%E7%88%B1%E5%A5%87%E8%89%BACK%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var div = document.createElement("a")
    div.innerHTML = "点击获取ck"
    document.body.appendChild(div)
    div.style.cssText="color: white;\n" +
        "    text-decoration: none;\n" +
        "    width: 130px;\n" +
        "    height: 40px;\n" +
        "    line-height: 40px;\n" +
        "    text-align: center;\n" +
        "    background: transparent;\n" +
        "    border: 1px solid #d2691e;\n" +
        "    font-family: Microsoft soft;\n" +
        "    border-radius: 3px;\n" +
        "    color:#ff7f50;\n" +
        "    position: fixed;\n" +
        "    top: 30%;\n" +
        "    z-index:1;\n" +
        "    left: -10px;\n" +
        "    cursor: pointer;"
    div.addEventListener('click', function (e) {
        getck();
    });
    function getCookie(cookieName){
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }
    let getck = function(){
        //alert("调用");
        let cookie = getCookie("P00001")
        //alert(cookie);
        prompt("使用Ctrl+C，复制下方CK","P00001="+cookie);
    }
    })();