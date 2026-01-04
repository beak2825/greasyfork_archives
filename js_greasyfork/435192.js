// ==UserScript==
// @name         webfunny 优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  webfunny width change
// @author       tangs
// @include      https://ifebsp-webfunny-admin.sf.global/webfunny/*
// @icon         https://www.google.com/s2/favicons?domain=sf.global
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435192/webfunny%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435192/webfunny%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择项目的 select 宽度调整
    const style = document.createElement("style");
    style.innerText = ".project-select-box .ant-select {width: 300px!important;}";
    document.body.appendChild(style);

    // 解除下拉项目只能展示 10 个的限制
    const targetCode = "a.length>10&&(a.length=10),";
    const href = window.location.href;
    const TARGET_SIT = ["/overview.html", "/behaviors.html", "/javascriptError.html"];
    if (TARGET_SIT.every(i => !href.includes(i))) return;

    const tarScript = Array.from(document.getElementsByTagName("script")).find(i => i.src && !i.src.includes("/common."));
    if (!tarScript) return;

    fetch(tarScript.src).then(i => i.text()).then(scriptContent => {
        const index = scriptContent.indexOf(targetCode);
        if (index === -1) {
            console.log("未找到限制只显示10个项目的代码");
            return;
        }
        scriptContent.replace(targetCode, "");
        eval(scriptContent);
    });



})();