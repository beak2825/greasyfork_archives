// ==UserScript==
// @name         Outlook Mail 邊框調整，添加快捷鍵
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  邊框調整，添加快捷鍵（Del鍵刪除信件，方向鍵左右上下一封信）
// @author       Shanlan
// @match        https://outlook.office.com/mail/*
// @match        https://outlook.office365.com/mail/*
// @match        https://outlook.cloud.microsoft/mail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542597/Outlook%20Mail%20%E9%82%8A%E6%A1%86%E8%AA%BF%E6%95%B4%EF%BC%8C%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/542597/Outlook%20Mail%20%E9%82%8A%E6%A1%86%E8%AA%BF%E6%95%B4%EF%BC%8C%E6%B7%BB%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==

// 動態將所有 data-min-width 屬性值改為 50
(function(){
    function setMinWidth(n){
        if(n.nodeType!==1)return;
        if(n.hasAttribute&&n.hasAttribute('data-min-width'))n.setAttribute('data-min-width','50');
        if(n.querySelectorAll)n.querySelectorAll('[data-min-width]').forEach(e=>e.setAttribute('data-min-width','50'));
    }
    setMinWidth(document.body);
    new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(setMinWidth)))
        .observe(document.body,{childList:true,subtree:true});
})();

// 左鍵切換前一個
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 37) { // Left
        var btn = document.querySelector('button[title="開啟前一個項目"]');
        if (btn) btn.click();
    }
});

// 右鍵切換下一個
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 39) { // Right
        var btn = document.querySelector('button[title="開啟下一個項目"]');
        if (btn) btn.click();
    }
});

// 新增：Del鍵觸發刪除，但在輸入框或可編輯區域時不生效
document.addEventListener("keydown", function(event) {
    if (event.key === "Delete") {
        const tgt = event.target;
        // 如果焦點在 INPUT、TEXTAREA 或任何 contenteditable 元素內，就跳過
        if (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable) {
            return;
        }
        var btn = document.querySelector('button[name="刪除"], button[aria-label="刪除"]');
        if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
            btn.click();
        }
    }
});