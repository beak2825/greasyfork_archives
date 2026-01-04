// ==UserScript==
// @name         ERP扩展
// @namespace    undefined
// @version      2024-05-14
// @description  专用于erp的扩展脚本插件
// @author       You
// @match        https://*.superboss.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=superboss.cc
// @grant        GM.xmlHttpRequest
// @license      AFL-3.0
// @downloadURL https://update.greasyfork.org/scripts/496405/ERP%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/496405/ERP%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://gitee.com/joeonehe/ruoteng/raw/master/erp.js?ts=${(+new Date())}`,
        onload: function(response) {
            let remoteScript = document.createElement('script');
            remoteScript.id = 'tm-dev-script';
            remoteScript.innerHTML = response.responseText;
            document.body.appendChild(remoteScript);
        }
    });
    GM.xmlHttpRequest({
        method: "GET",
        url: `https://gitee.com/joeonehe/ruoteng/raw/master/erp.css?ts=${(+new Date())}`,
        onload: function(response) {
            let remoteScript = document.createElement('style');
            remoteScript.id = 'tm-dev-style';
            remoteScript.innerHTML = response.responseText;
            document.body.appendChild(remoteScript);
        }
    });
})();