// ==UserScript==
// @name        포텐알림차단
// @namespace   Violentmonkey Scripts
// @match       https://www.fmkorea.com/*
// @grant       none
// @version     1.0
// @author      Geoff
// @description 실시간 알림 중 포텐만 안뜨게 하는 스크립트. 그저 클-황

// @downloadURL https://update.greasyfork.org/scripts/539761/%ED%8F%AC%ED%85%90%EC%95%8C%EB%A6%BC%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539761/%ED%8F%AC%ED%85%90%EC%95%8C%EB%A6%BC%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('포텐 알림 차단 스크립트 ON');

    const processedElements = new WeakSet();

    const globalObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.id === 'fm_alert') {
                        observeFmAlert(node);
                    }

                    checkAndRemoveBestAlert(node);

                    if (node.querySelector && node.querySelector('#fm_alert')) {
                        const fmAlert = node.querySelector('#fm_alert');
                        observeFmAlert(fmAlert);
                    }
                }
            });
        });
    });

    globalObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    function observeFmAlert(fmAlertElement) {
        const alertObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        checkAndRemoveBestAlert(node);
                    }
                });
            });
        });

        alertObserver.observe(fmAlertElement, {
            childList: true,
            subtree: true
        });
    }

    let blockedCount = 0;

    function checkAndRemoveBestAlert(element) {
        if (!element || !element.classList) return;

        if (element.classList.contains('fm_alert_wrap') &&
            element.classList.contains('best')) {
            // 이미 한번 거른건지 확인
            if (!processedElements.has(element)) {
                processedElements.add(element);  // 처리 목록에 추가
                element.remove();
                blockedCount++;
                console.log(`포텐알림 팝업이 차단되었습니다. (${blockedCount}개 차단됨)`);
            }
            return;
        }

        if (element.querySelectorAll) {
            const bestAlerts = element.querySelectorAll('.fm_alert_wrap.best');
            bestAlerts.forEach(function(alert) {
                // 중복 체크
                if (!processedElements.has(alert)) {
                    processedElements.add(alert);
                    alert.remove();
                    blockedCount++;
                    console.log(`포텐알림 팝업이 차단되었습니다. (${blockedCount}개 차단됨)`);
                }
            });
        }
    }
    // CSS 수정
    const style = document.createElement('style');
    style.textContent = `
        .fm_alert_wrap.best {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;

    if (document.head) {
        document.head.appendChild(style);
    } else {
        const headObserver = new MutationObserver(function(mutations, obs) {
            if (document.head) {
                document.head.appendChild(style);
                obs.disconnect();
            }
        });
        headObserver.observe(document.documentElement, {childList: true, subtree: true});
    }

    function checkExistingElements() {
        const existingFmAlert = document.getElementById('fm_alert');
        if (existingFmAlert) {
            observeFmAlert(existingFmAlert);

            const existingBestAlerts = existingFmAlert.querySelectorAll('.fm_alert_wrap.best');
            existingBestAlerts.forEach(function(alert) {
                if (!processedElements.has(alert)) {
                    processedElements.add(alert);
                    alert.remove();
                    blockedCount++;
                    console.log(`포텐알림 팝업이 차단되었습니다. (${blockedCount}개 차단됨)`);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkExistingElements);
    } else {
        checkExistingElements();
    }

    // 처음 5초간 클리너
    let checkCount = 0;
    const checkInterval = setInterval(function() {
        const bestAlerts = document.querySelectorAll('.fm_alert_wrap.best');
        bestAlerts.forEach(function(alert) {
            if (!processedElements.has(alert)) {
                processedElements.add(alert);
                alert.remove();
                blockedCount++;
                console.log(`포텐알림 팝업이 차단되었습니다. (${blockedCount}개 차단됨)`);
            }
        });

        checkCount++;
        if (checkCount > 10) {
            clearInterval(checkInterval);
        }
    }, 500);

})();