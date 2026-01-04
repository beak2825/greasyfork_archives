// ==UserScript==
// @name         MDN 文档自动重定向到中文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将 MDN 的文档自动重定向到中文
// @license      ISC
// @author       mscststs
// @match        https://developer.mozilla.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472408/MDN%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/472408/MDN%20%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function handleChangeMock(lang){
        document.querySelector("#languages-switcher-button").dispatchEvent(new Event("click",{bubbles:true}));
        setTimeout(()=>{
            document.querySelector(`button[name='${lang}']`).dispatchEvent(new Event("click",{bubbles:true}))
        },100)
    }

    const hydration = JSON.parse(document.querySelector("#hydration").innerText);
    console.log(hydration);

    for(let item of hydration.doc.other_translations){
        if(item.locale === "zh-CN"){
            handleChangeMock("zh-CN");
            return;
        }
    }
})();