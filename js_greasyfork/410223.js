// ==UserScript==
// @name         複製投票清單
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Copy twitch participant list of gifts
// @author       josephchong
// @match        https://www.twitch.tv/popout/*/reward-queue
// @grant        GM_setClipboard
// @require      https://unpkg.com/hotkeys-js@3.13.2/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/410223/%E8%A4%87%E8%A3%BD%E6%8A%95%E7%A5%A8%E6%B8%85%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/410223/%E8%A4%87%E8%A3%BD%E6%8A%95%E7%A5%A8%E6%B8%85%E5%96%AE.meta.js
// ==/UserScript==

function copyList() {
    let text = Array.from(document.querySelectorAll('.redemption-list-item__body .redemption-list-item__context')).map(el => el.innerText).join('\n');
    if (text.trim().length === 0) {
        text = Array.from(document.querySelectorAll('.redemption-list-item__checkbox + div div:has(+.redemption-list-item__report-button)')).map(el => el.innerText).join('\n')
    }
    if (text.trim().length === 0) {
        alert("找不到人名，請叫相關人員處理");
        return;
    }
    GM_setClipboard(text);
}

function createRetrieveBtn() {
    var onMutate = function(mutationsList) {
        mutationsList.forEach(mutation => {
            const footer = document.querySelector('.reward-queue-footer');
            const hasCopyBtn = !!document.querySelector('#copy-btn');
            if(footer && !hasCopyBtn) {
                const btn = document.createElement('button');
                btn.setAttribute("id", "copy-btn");
                btn.style.marginLeft = '10px';
                btn.style.padding = '0 8px';
                btn.setAttribute("class", "ScCoreButton-sc-1qn4ixc-0 ScCoreButtonPrimary-sc-1qn4ixc-1 cmkXFa");
                btn.innerHTML = "複製名單到剪貼板";
                btn.onclick = copyList;
                const btnContainer = document.querySelector('.reward-queue-footer button[class*="ScCoreButtonPrimary-sc-"]').parentNode;
                btnContainer.appendChild(btn);
            }
        })
    }
    var observer = new MutationObserver(onMutate);
    observer.observe(document.body, {childList: true, subtree: true});
}

(function() {
    'use strict';

    hotkeys('ctrl+d', function(event,handler) {
        copyList();
    });
})();