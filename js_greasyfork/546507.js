// ==UserScript==
// @name         YouTube 修復儲存快捷按鈕
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  在主按鈕列新增一個「儲存」快捷鍵，點擊自動展開選單並點擊儲存
// @author       shanlan(ChatGPT o3-mini)
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546507/YouTube%20%E4%BF%AE%E5%BE%A9%E5%84%B2%E5%AD%98%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/546507/YouTube%20%E4%BF%AE%E5%BE%A9%E5%84%B2%E5%AD%98%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const observer = new MutationObserver(addSaveShortcut);
    observer.observe(document.body, {childList: true, subtree: true});
    function addSaveShortcut(){
        const topBtnsList = Array.from(document.querySelectorAll('#top-level-buttons-computed'))
    .filter(el => el.closest('ytd-watch-metadata'));
        if(!topBtnsList.length) return;
        topBtnsList.forEach(topBtns => {
            const menuRenderer = topBtns.closest('ytd-menu-renderer');
            const hasNativeSave = menuRenderer && Array.from(menuRenderer.querySelectorAll('button')).some(b =>
              !b.classList.contains('yt-save-shortcut-btn') &&
              /儲存|Save/i.test((b.innerText || b.textContent || b.getAttribute('aria-label') || b.title || '').trim())
            );
            if (topBtns.querySelector('.yt-save-shortcut-btn') || hasNativeSave) return;
            const btn = document.createElement('button');
            btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-save-shortcut-btn';
            btn.style.marginLeft = '8px';
            btn.innerHTML = `
                <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" style="vertical-align:middle">
                        <path d="M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z"></path>
                    </svg>
                </div>
                <div class="yt-spec-button-shape-next__button-text-content">儲存</div>`;
            btn.onclick = function(e){
                e.stopPropagation();
                const top = e.currentTarget.closest('#top-level-buttons-computed');
                const container = top ? top.parentElement : null;
                const moreBtn = container ? container.querySelector('yt-icon-button#button, yt-button-shape#button-shape, ytd-button-renderer #button') : null;
                if(!moreBtn) return;
                moreBtn.dispatchEvent(new MouseEvent('click', {bubbles: true, composed: true}));
                let tryCount = 0;
                const tryClickSave = setInterval(()=>{
                    tryCount++;
                    const menus = Array.from(document.querySelectorAll('ytd-menu-popup-renderer')).filter(m => m.offsetParent !== null);
                    const saveItem = menus.flatMap(m => Array.from(m.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item')))
                        .find(item => /儲存|Save/i.test(item.innerText.trim()));
                    if(saveItem){
                        saveItem.click();
                        clearInterval(tryClickSave);
                    }
                    if(tryCount > 30) clearInterval(tryClickSave);
                }, 100);
            };
            topBtns.appendChild(btn);
        });
    }
})();