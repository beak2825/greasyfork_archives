// ==UserScript==
// @name 巨量账户信息复制优化
// @namespace https://www.kuiwaiwai.com
// @version 0.4
// @description 垃圾巨量，别乱改我UI！！！
// @author kuiwaiwai
// @match https://business.oceanengine.com/site/account-manage/ad/bidding/superior/account*
// @license GNU General Public License v3.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/500156/%E5%B7%A8%E9%87%8F%E8%B4%A6%E6%88%B7%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500156/%E5%B7%A8%E9%87%8F%E8%B4%A6%E6%88%B7%E4%BF%A1%E6%81%AF%E5%A4%8D%E5%88%B6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var setting = 1; // 设置复制后账户信息的排列方式，1为名称在前ID在后，2为ID在前名称在后

    function replaceButtons() {
        let rows = document.querySelectorAll("#app > div > div.account-content > div > div.oc-card > div > div > div.detail-content > div.ad-bidding-superior-account > div.ecp-bidding-account-table.relative.z-1 > div.oc-table-wrapper > div.ovui-table__container.ovui-table__container--sticky > div.ovui-table__body-wrapper > table > tbody > tr");

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let dataButton = rows[i].querySelector("td:nth-child(4) > div > div > span");

                if (dataButton) {
                    let divElement = document.createElement("div");
                    divElement.textContent = "复制";
                    divElement.style.cursor = "pointer";

                    divElement.className = "cursor-pointer mr-12 group-hover:text-skyBlue-6";

                    dataButton.parentNode.replaceChild(divElement, dataButton);

                    divElement.addEventListener("click", function() {
                        let accountName = rows[i].querySelector("td.ovui-td.ovui-td--sticky.ovui-table-cell.ovui-table-cell--left > div > div > div.cursor-pointer.group-hover\\:text-skyBlue-6 > div.name.truncate").textContent.trim();
                        let accountId = rows[i].querySelector("td.ovui-td.ovui-td--sticky.ovui-table-cell.ovui-table-cell--left > div > div > div.cursor-pointer.group-hover\\:text-skyBlue-6 > div.id.text-gray-9.truncate").textContent.replace("ID：", "").trim();

                        let textarea = document.createElement("textarea");
                        switch (setting) {
                            case 1:
                                textarea.value = accountName + "	" + accountId;
                                break;
                            case 2:
                                textarea.value = accountId + "	" + accountName;
                                break;
                            default:
                                textarea.value = accountName + "	" + accountId;
                                break;
                        }
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);

                        let popup = document.createElement("div");
                        popup.innerHTML = '<div id="okee-message-container" style="z-index: 2000;"><div class="ovui-message ovui-message--success"><div class="ovui-message__content"><div class="ovui-icon ovui-message__icon"><svg viewBox="0 0 48 48" width="1em" height="1em" fill="currentColor"><path fill-rule="nonzero" d="M24 46C11.85 46 2 36.15 2 24S11.85 2 24 2s22 9.85 22 22-9.85 22-22 22zm-2.483-18.868l-5.103-5.103a2 2 0 0 0-2.828 2.829l6.516 6.516a2 2 0 0 0 2.829 0l11.96-11.96a2 2 0 0 0-2.829-2.828L21.517 27.132z"></path></svg></div><span class="ovui-message__text">复制成功</span></div></div></div>';
                        document.body.appendChild(popup);

                        // 1秒后自动关闭浮动窗口
                        setTimeout(function() {
                            document.body.removeChild(popup);
                        }, 1000);

                    });
                }}}}
    let observer = new MutationObserver(replaceButtons);

    observer.observe(document, { childList: true, subtree: true });

    window.onpopstate = function(event) {
        observer.disconnect();
        observer.observe(document, { childList: true, subtree: true });
    };
})();