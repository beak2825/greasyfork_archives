// ==UserScript==
// @name         Dcard 訪客友善模式
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  參考現有的腳本並改善相關問題，營造出免登入友善瀏覽環境
// @author       Creeper@2022
// @match        http*://*.dcard.tw/*
// @icon         https://www.google.com/s2/favicons?domain=dcard.tw
// @grant        GM_addStyle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/448575/Dcard%20%E8%A8%AA%E5%AE%A2%E5%8F%8B%E5%96%84%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/448575/Dcard%20%E8%A8%AA%E5%AE%A2%E5%8F%8B%E5%96%84%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

const OBS_SETTING = {
    childList: true
};

(() => {
    let login_type = document.querySelectorAll("[role='navigation']>a").length;
    /* 防呆，如果登入將停止運作避免影響其他功能 */
    if(login_type < 4) {
        /* 等待 __portal 元素生成 */
        let observer = new MutationObserver((mutations, obs) => {
            let portal_element = document.querySelector(".__portal");
            if(portal_element){
                let clean_popup = new MutationObserver(cleanLoginPopup);
                clean_popup.observe(portal_element, OBS_SETTING);
                obs.disconnect();
            }
        });
        observer.observe(document.body, OBS_SETTING);
    }

    /* 自訂義 CSS 語法 */
    customCSS();
})();

function cleanLoginPopup(mutations, obs) {
    /* 刪除滑動時出現的登入視窗 */
    let login_request_popup = document.querySelector("[role='dialog']");
    if(login_request_popup) {
        let login_popup_overlay = login_request_popup.closest("[data-testid='overlay']:last-child");
        login_popup_overlay.style.display = "none";
        login_request_popup.remove();
        document.body.style.overflow = "auto";
    }
}

function customCSS() {
    GM_addStyle('[data-key^="ad-"] {display:none !important}');
    GM_addStyle('.__portal>div:not([data-testid="overlay"], .overlay-enter-done) {display:none !important}');
}