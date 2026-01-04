// ==UserScript==
// @name         [停更]UnipusPrime - U校园小工具
// @namespace    ckylin-script-unipus-prime
// @version      0.1
// @description  我一直在学习~自动点击“由于你长时间未操作，请点确定继续使用”弹窗
// @author       CKylinMC
// @match        https://*.unipus.cn/*
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422510/%5B%E5%81%9C%E6%9B%B4%5DUnipusPrime%20-%20U%E6%A0%A1%E5%9B%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/422510/%5B%E5%81%9C%E6%9B%B4%5DUnipusPrime%20-%20U%E6%A0%A1%E5%9B%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const wait = (t = 100) => new Promise(r=>setTimeout(r,t));
    async function onBodyChange(){
        await wait();
        let w = window;
        if(typeof(unsafeWindow)!='undefined') w = unsafeWindow;
        let jq;
        if(w.jQuery) jq = w.jQuery;
        else jq = w.aijQuery;
        var target = jq("p:contains('由于你长时间未操作，请点确定继续使用。')");
        if(target&&target[0]){
            target[0].parentNode.querySelector("button").click();
            if(!w.UPP_keeptime) w.UPP_keeptime = 1;
            else w.UPP_keeptime++;
            console.info('[UnipusPrime] 已自动点击学习检查弹窗 '+w.UPP_keeptime+' 次。');
        }
    }
    let ob = new MutationObserver(onBodyChange);
    ob.observe(document.body,{subtree:true,childList:true});
    console.info('[UnipusPrime] 开始保持学习状态');
})();