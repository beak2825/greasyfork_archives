// ==UserScript==
// @name         bilibili直播全屏SC显示
// @namespace    http://tampermonkey.net/
// @version      2024-08-10
// @description  bilibili直播全屏状态下在屏幕右侧显示SC列表
// @author       lying
// @match           *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503209/bilibili%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8FSC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/503209/bilibili%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8FSC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let originalStyles = {};
    let originalParent = null;

    function saveOriginalStyles(element) {
        if (!originalStyles[element]) {
            originalStyles[element] = element.getAttribute('style') || '';
        }
    }


    function disableDoubleClick(element) {
        element.addEventListener('dblclick', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, true);

        Array.from(element.getElementsByTagName('*')).forEach(child => {
            child.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                e.preventDefault();
            }, true);
        });
    }

    function applyStylesToPayCard() {
        var fullVideoDiv = document.querySelector('.live-player-mounter');
        var payCards = document.getElementsByClassName('pay-note-panel');
        var asideBar = document.getElementById('aside-area-vm');

        if (fullVideoDiv && fullVideoDiv === document.fullscreenElement) {
            if (payCards.length === 0 || !asideBar) {
                return;
            }
            var payCard = payCards[0];
            var cardList = document.querySelector('.pay-note-panel .card-list');
            var cardWrapper = document.querySelector('.pay-note-panel .card-list .card-wrapper');
            var detailInfo = document.querySelector('.pay-note-panel .detail-info');

            saveOriginalStyles(asideBar);
            saveOriginalStyles(payCard);
            saveOriginalStyles(cardList);
            saveOriginalStyles(cardWrapper);

            asideBar.style.zIndex = '100';
            Object.assign(payCard.style, {
                position: 'fixed',
                top: '50%',
                transform: 'translateY(-50%)',
                right: '0',
                zIndex: '9999',
                height: 'auto',
                maxWidth: '300px',
                display: 'flex',
                alignItems: 'flex-end',
                backgroundColor: 'transparent'
            });

            Object.assign(cardList.style, {
                maxHeight: '80%',
                overflowY: 'auto',
                justifyContent: 'end'
            });

            Object.assign(cardWrapper.style, {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            });

            if (detailInfo) {
                saveOriginalStyles(cardWrapper);
                Object.assign(detailInfo.style, {
                    zIndex: '9999'
                });
            }

            if (payCard.parentNode !== fullVideoDiv) {
                fullVideoDiv.appendChild(payCard);
            }
            disableDoubleClick(payCard);
        } else {
            resetStyles();
        }
    }

    function resetStyles() {
        var payCards = document.getElementsByClassName('pay-note-panel');
        var asideBar = document.getElementById('aside-area-vm');

        if (payCards.length > 0) {
            var payCard = payCards[0];
            var cardList = document.querySelector('.pay-note-panel .card-list');
            var cardWrapper = document.querySelector('.pay-note-panel .card-list .card-wrapper');
            var detailInfo = document.querySelector('.pay-note-panel .detail-info');

            payCard.setAttribute('style', originalStyles[payCard] || '');
            if (cardList) cardList.setAttribute('style', originalStyles[cardList] || '');
            if (cardWrapper) cardWrapper.setAttribute('style', originalStyles[cardWrapper] || '');
            if (detailInfo) detailInfo.setAttribute('style', originalStyles[detailInfo] || '');

            // 将 payCard 移回原始位置
            originalParent = document.querySelector('.pay-note-setting');
            if (originalParent && payCard.parentNode !== originalParent) {
                originalParent.appendChild(payCard);
            }
        }

        if (asideBar) {
            asideBar.setAttribute('style', originalStyles[asideBar] || '');
        }
    }

    function handleFullscreenChange() {
        applyStylesToPayCard();
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                applyStylesToPayCard();
            }
        });
    });

    observer.observe(document.querySelector('.live-player-mounter'), { childList: true, subtree: true });

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    applyStylesToPayCard();
})();