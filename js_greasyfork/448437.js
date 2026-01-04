// ==UserScript==
// @name         QQ 中转页直接跳转
// @namespace    mscststs
// @version      0.2
// @description  直接跳转
// @author       mscststs
// @match        https://c.pc.qq.com/middlem.html?pfurl=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @run-at       document-start
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448437/QQ%20%E4%B8%AD%E8%BD%AC%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448437/QQ%20%E4%B8%AD%E8%BD%AC%E9%A1%B5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let f =new URL(location.href).searchParams.get("pfurl");
    if(f.startsWith("http")){
        location.href = f;
    }else{
        location.href = "http://"+f;
    }
})();