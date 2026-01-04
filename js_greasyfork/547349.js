// ==UserScript==
// @name         Perplexity AI Model Selector
// @namespace    https://blog.valley.town/@zeronox
// @version      2.2
// @description  Alt+A로 모델 선택 팝업 띄우기. 1-9, 0, -, =로 AI 모델을 선택할 수 있습니다.
// @author       zeronox
// @license      MIT
// @match        https://www.perplexity.ai/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @downloadURL https://update.greasyfork.org/scripts/547349/Perplexity%20AI%20Model%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/547349/Perplexity%20AI%20Model%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isModelSelectionActive = false;
    let observer = null;

    function addNumberBadges() {
        const allItems = document.querySelectorAll('[data-placement] [role="menuitem"]');
        const modelItems = Array.from(allItems).filter(item => !item.textContent.includes('최고'));

        modelItems.forEach((item, index) => {
            if (item.querySelector('.model-selector-badge')) return;
            item.style.position = 'relative';

            const badge = document.createElement('span');
            let badgeText;
            if (index < 9) badgeText = (index + 1).toString();
            else if (index === 9) badgeText = '0';
            else if (index === 10) badgeText = '-';
            else if (index === 11) badgeText = '=';
            else badgeText = (index + 1).toString();

            badge.textContent = badgeText;
            badge.className = 'model-selector-badge';
            Object.assign(badge.style, {
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                backgroundColor: 'black', color: 'white', borderRadius: '50%',
                width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', zIndex: '100'
            });

            const textContainer = item.querySelector('.flex-1');
            if (textContainer) textContainer.style.paddingLeft = '25px';

            item.appendChild(badge);
        });
    }

    function removeNumberBadges() {
        document.querySelectorAll('.model-selector-badge').forEach(badge => badge.remove());
        document.querySelectorAll('[data-placement] [role="menuitem"]').forEach(item => {
            item.style.position = '';
            const textContainer = item.querySelector('.flex-1');
            if(textContainer) textContainer.style.paddingLeft = '';
        });
    }

    function setupObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver((mutationsList, obs) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length && document.querySelector('[data-placement]')) {
                    addNumberBadges();
                    return;
                }
                if (mutation.removedNodes.length && !document.querySelector('[data-placement]')) {
                    removeNumberBadges();
                    isModelSelectionActive = false;
                    obs.disconnect();
                    return;
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            const modelButton = document.querySelector('button[data-state] .tabler-icon-cpu')?.closest('button');

            if (modelButton) {
                modelButton.click();
                isModelSelectionActive = true;
                setupObserver();
                console.log('모델 선택 활성. 숫자 키로 선택하세요.');
            } else {
                console.error('이 페이지에서 모델 선택 버튼을 찾을 수 없습니다.');
            }
            return;
        }

        if (isModelSelectionActive && (event.key >= '1' && event.key <= '9' || event.key === '0' || event.key === '-' || event.key === '=')) {
            event.preventDefault();
            const allItems = document.querySelectorAll('[data-placement] [role="menuitem"]');
            const modelItems = Array.from(allItems).filter(item => !item.textContent.includes('최고'));
            if (modelItems.length > 0) {
                let index;
                if (event.key >= '1' && event.key <= '9') index = parseInt(event.key) - 1;
                else if (event.key === '0') index = 9;
                else if (event.key === '-') index = 10;
                else if (event.key === '=') index = 11;

                if (modelItems[index]) {
                    modelItems[index].click();
                    console.log(`선택된 모델: ${modelItems[index].textContent}`);
                }
            }
            isModelSelectionActive = false;
        }

        if (isModelSelectionActive && event.key === 'Escape') {
            isModelSelectionActive = false;
            console.log('모델 선택이 취소되었습니다.');
        }
    });
})();