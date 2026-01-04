// ==UserScript==
// @name         行程单
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2024-09-20
// @description     Remove Cookies Consent Modal Windows
// @description:cn  Eliminar los mensajes de consentimiento de cookies de los sitios web
// @author       You
// @match        https://banshi.whlyj.beijing.gov.cn/tdfw/lxs/indexm_un.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beijing.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509355/%E8%A1%8C%E7%A8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/509355/%E8%A1%8C%E7%A8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    document.querySelector("body > div.xrs_tk > div.layui-layer.layui-layer-dialog > div.layui-layer-content.layui-layer-content0 > div > span").click()
    document.querySelector("#yzx-top > a").click()

 document.querySelector("#guanbi > a").click()
    document.querySelector("#tz-btn").click()
    document.querySelector("#layui-layer1 > span.layui-layer-setwin > a.layui-layer-ico.layui-layer-close.layui-layer-close1").click()
    'use strict';
    setTimeout(function(){
    document.querySelector("#tz-btn").click()
    document.querySelector("#a3041 > a").click()
    document.querySelector("#a3041_2 > a").click()

    },5000);


    // Your code here...
})();