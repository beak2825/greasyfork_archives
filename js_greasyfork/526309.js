// ==UserScript==
// @name         Browndust2 News EasyRead
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在 browndust2.com 的新聞頁面中新增EasyRead按鈕，打開固定的燈箱顯示新聞內容
// @author       Souseihaku
// @license      MIT
// @match        https://www.browndust2.com/zh-tw/news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526309/Browndust2%20News%20EasyRead.user.js
// @updateURL https://update.greasyfork.org/scripts/526309/Browndust2%20News%20EasyRead.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('Browndust2 News Lightbox UserScript loaded');

    var checkInterval = setInterval(function() {
        var rightOptContainer = document.querySelector('[class*="right-opt"]');
        if (rightOptContainer) {
            clearInterval(checkInterval);
            insertButton(rightOptContainer);
        }
    }, 500);

    function insertButton(container) {
        var btn = document.createElement('button');
        btn.textContent = 'EasyRead';
        btn.style.padding = '5px 10px';
        btn.style.marginLeft = '10px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#fff';

        container.appendChild(btn);
        btn.addEventListener('click', openLightbox);
    }

function openLightbox() {
    var viewContent = document.querySelector('div[class*="view-content"]');
    if (!viewContent) {
        console.error('找不到 div._view-content_xdbj7_414');
        return;
    }

    var overlay = document.createElement('div');
    overlay.id = 'custom-news-lightbox-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100dvh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';

    var modal = document.createElement('div');
    modal.style.backgroundColor = '#fff';
    modal.style.maxWidth = '1024px';
    modal.style.width = '100%';
    modal.style.height = '100dvh';
    modal.style.overflowY = 'auto';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.position = 'relative';
    modal.style.padding = '0';
    modal.style.boxSizing = 'border-box';
    modal.style.borderRadius = '8px';

    var closeContainer = document.createElement('div');
    closeContainer.style.display = 'flex';
    closeContainer.style.justifyContent = 'end';
    closeContainer.style.padding = '8px 12px';
    closeContainer.style.borderBottom = '1px solid #ddd';

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✖';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.width = '24px';
    closeBtn.style.height = '24px';
    closeBtn.style.lineHeight = '24px';
    closeBtn.style.textAlign = 'center';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.border = 'none';
    closeBtn.style.backgroundColor = 'transparent';
    closeBtn.style.color = '#666';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.transition = 'color 0.2s ease';
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.color = '#000');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.color = '#666');

    closeBtn.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });

    closeContainer.appendChild(closeBtn);

    var contentWrapper = document.createElement('div');
    contentWrapper.style.flexGrow = '1';
    contentWrapper.style.overflowY = 'auto';
    contentWrapper.style.padding = '15px';
    contentWrapper.style.boxSizing = 'border-box';

    // **複製 viewContent，並加入 lightbox_view_content**
    var contentClone = viewContent.cloneNode(true);
    contentClone.classList.add('lightbox_view_content');

    // **確保 overflow 恢復預設 (unset) 並加上 !important**
    contentClone.style.setProperty('overflow', 'unset', 'important');

    // **確保燈箱內所有 <span> 字體大小為 18px**
    var spans = contentClone.querySelectorAll('span');
    spans.forEach(span => {
        span.style.setProperty('font-size', '18px', 'important');
    });

    contentWrapper.appendChild(contentClone);

    modal.appendChild(closeContainer);
    modal.appendChild(contentWrapper);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}


})();
