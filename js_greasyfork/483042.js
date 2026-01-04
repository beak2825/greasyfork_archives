// ==UserScript==
// @name         Fofa搜索页一键导入GOBY扫描
// @version      0.0.2
// @description  将Fofa扫描页的结果一键导入Goby进行扫描
// @author       Cool-Star
// @match        https://fofa.info/result*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fofa.info
// @grant        none
// @namespace https://greasyfork.org/users/743520
// @downloadURL https://update.greasyfork.org/scripts/483042/Fofa%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%B8%80%E9%94%AE%E5%AF%BC%E5%85%A5GOBY%E6%89%AB%E6%8F%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/483042/Fofa%E6%90%9C%E7%B4%A2%E9%A1%B5%E4%B8%80%E9%94%AE%E5%AF%BC%E5%85%A5GOBY%E6%89%AB%E6%8F%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';
     function startScan() {
        const ipDoms = document.querySelectorAll('.hsxa-meta-data-list .hsxa-meta-data-item .hsxa-host');
        const ips = [...ipDoms].map(dom => dom.innerText?.trim());
        const portDoms = document.querySelectorAll('.hsxa-meta-data-list .hsxa-meta-data-item .hsxa-port');
        const ports = [...new Set([...portDoms].map(dom => dom.innerText?.trim()))];
        if(ips.length > 0) {
           const gobyurl = `goby://openScanDia?ips=${ips.join(',')}&&ports=${ports.join(',')}`;
            console.log(gobyurl);
            window.open(gobyurl);
        }
     }
    const button = document.createElement('div');
    button.title = "一键将当前结果导入Goby扫描";
    button.innerHTML = 'G'
    button.style.position = "fixed"
    button.style.right = "48px"
    button.style.bottom = "183px"
    button.style.color = "#fff"
    button.style.padding = "5px 10px"
    button.style.borderRadius = "50%"
    button.style.background = "var(--main-color)";
    button.style.cursor = "pointer";
    button.addEventListener('click', startScan);
    document.body.append(button);
})();