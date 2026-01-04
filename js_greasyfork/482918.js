// ==UserScript==
// @name         深圳税务局数据自动填入
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  深圳税务局登录数据自动填入
// @author       You
// @match        https://etax.shenzhen.chinatax.gov.cn/bszm-web/apps/views/beforeLogin/indexBefore/pageIndex.html*
// @match        https://tpass.shenzhen.chinatax.gov.cn*
// @icon         https://etax.shenzhen.chinatax.gov.cn/favicon.ico
// @grant        none
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/482918/%E6%B7%B1%E5%9C%B3%E7%A8%8E%E5%8A%A1%E5%B1%80%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/482918/%E6%B7%B1%E5%9C%B3%E7%A8%8E%E5%8A%A1%E5%B1%80%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.hostname==="tpass.shenzhen.chinatax.gov.cn"){
        const urlParams = new URLSearchParams(location.href.substr(location.href.indexOf("&")));
        setTimeout(()=>{
            document.querySelector("div.login-index-contain").__vue__.$data.roleName="agentBusinessTab";
        },1000);
        setTimeout(()=>{
            let data=document.querySelector(".formContentE form.el-form").parentElement.__vue__._data.form;
            data.account = urlParams.get("a") || "";
            data.creditCode = urlParams.get("c") || "";
            data.password = urlParams.get("p") || "";
        },1500);
    }else{
        const urlParams = new URLSearchParams(location.search);
        document.querySelector(".mini-panel.mini-messagebox").remove();
        setTimeout(()=>{
            document.querySelector("ul.ant-menu-root li:last-child").click();
        },1000);
        setTimeout(()=>{
            var inputElement = document.querySelector("#userName-r");
            inputElement.value = urlParams.get("u") || "";
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            inputElement.dispatchEvent(event);
            inputElement = document.querySelector("#passWord-r");
            inputElement.value = urlParams.get("p") || "";
            event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            inputElement.dispatchEvent(event);
        },1500);
    }
})();