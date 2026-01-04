// ==UserScript==
// @name         虎牙登录屏蔽器V1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏幕HUAYA的登录,让你安心,专注看片儿!!
// @author       Limk
// @match        https://www.huya.com/*
// @license 
// @downloadURL https://update.greasyfork.org/scripts/471980/%E8%99%8E%E7%89%99%E7%99%BB%E5%BD%95%E5%B1%8F%E8%94%BD%E5%99%A8V1.user.js
// @updateURL https://update.greasyfork.org/scripts/471980/%E8%99%8E%E7%89%99%E7%99%BB%E5%BD%95%E5%B1%8F%E8%94%BD%E5%99%A8V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(findLoginWin,2000);//2秒检测一次,发现删除
    function findLoginWin(){
        let node = document.getElementById("UDBSdkLgn");
        console.log("UDBSdkLgn node =",node);
        if(node != null && node != undefined){
            console.log("UDBSdkLgn remove");
            node.style.display="none";
        }
    }
})();