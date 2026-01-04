// ==UserScript==
// @name         Korail Ticket Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  자동으로 매진이 아닌 표를 클릭합니다. (floating 버튼으로 시작/중지, 대기시간 설정)
// @author       Your name
// @license      MIT
// @match        https://www.korail.com/ticket/search/list
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537177/Korail%20Ticket%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/537177/Korail%20Ticket%20Auto%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false;
    let stopFlag = false;
    let waitMs = 250; // 기본 대기시간(ms)
    const STORAGE_KEY = 'korail-auto-waitMs';

    // localStorage에서 waitMs 불러오기
    const savedWaitMs = localStorage.getItem(STORAGE_KEY);
    if (savedWaitMs && !isNaN(parseInt(savedWaitMs, 10))) {
        waitMs = parseInt(savedWaitMs, 10);
    }

    // floating 컨테이너 생성
    function createFloatingContainer() {
        const container = document.createElement('div');
        container.id = 'korail-auto-container';
        container.style.position = 'fixed';
        container.style.right = '32px';
        container.style.bottom = '32px';
        container.style.zIndex = '9999';
        container.style.display = 'grid';
        container.style.gap = '.5rem';
        document.body.appendChild(container);
        return container;
    }

    // floating 버튼 생성
    function createFloatingButton() {
        const btn = document.createElement('button');
        btn.id = 'korail-auto-btn';
        btn.textContent = '자동 예매 시작';
        btn.style.padding = '16px 24px';
        btn.style.background = '#1976d2';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        btn.style.fontSize = '16px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s';
        btn.addEventListener('mouseenter', () => btn.style.background = '#1565c0');
        btn.addEventListener('mouseleave', () => btn.style.background = '#1976d2');
        return btn;
    }

    // 대기시간 설정 버튼 생성
    function createSettingButton() {
        const btn = document.createElement('button');
        btn.id = 'korail-setting-btn';
        btn.textContent = `대기시간: ${waitMs}ms`;
        btn.style.padding = '10px 18px';
        btn.style.background = '#fff';
        btn.style.color = '#1976d2';
        btn.style.border = '2px solid #1976d2';
        btn.style.borderRadius = '8px';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'background 0.2s, color 0.2s';
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#1976d2';
            btn.style.color = '#fff';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#fff';
            btn.style.color = '#1976d2';
        });
        return btn;
    }

    // 특정 selector의 element가 나타날 때까지 기다리는 함수
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout'));
            }, timeout);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(el);
                }
            });

            // 최초에 이미 있으면 바로 resolve
            const el = document.querySelector(selector);
            if (el) {
                clearTimeout(timer);
                observer.disconnect();
                resolve(el);
                return;
            }

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // tab 영역의 subtree 변경을 기다리는 함수
    function waitForTabChange(tabSelector) {
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                observer.disconnect();
                resolve();
            });
            observer.observe(document.querySelector(tabSelector), { childList: true, subtree: true });
        });
    }

    // 반복 동작 함수
    async function tryClick() {
        while (!stopFlag) {
            // 탭 버튼이 나타날 때까지 대기
            const tabBtn = await waitForElement("#btn_tab_info1 > button").catch(() => null);
            if (!tabBtn || stopFlag) break;

            // 매진이 아닌 표 찾기
            const items = document.querySelectorAll("#tab_tab_info1 > div > ul > li:nth-child(1) > div > div.price_box.fl-l.gen");
            let found = false;
            for (const item of items) {
                if (!item.innerText.includes("매진")) {
                    const anchor = item.querySelector("a");
                    if (anchor) {
                        anchor.click();
                        found = true;
                        // anchor 클릭 후 무조건 active 클래스가 붙을 때까지 대기
                        const parentItem = item.closest('li');
                        if (parentItem) {
                            await new Promise(resolve => {
                                const checkActive = () => {
                                    if (parentItem.classList.contains('active')) {
                                        resolve();
                                    } else {
                                        setTimeout(checkActive, 50);
                                    }
                                };
                                checkActive();
                            });
                            // 예약 버튼 클릭 (waitForElement로 대기하고, visible할 때만 클릭)
                            const reserveBtn = await waitForElement("#container > div.ticket_reserv_wrap > div > div.ticket_reserv.clear.oneline > div > button", 10000).catch(() => null);
                            if (reserveBtn) {
                                // 버튼이 visible할 때만 클릭
                                function isVisible(el) {
                                    const style = window.getComputedStyle(el);
                                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                                }
                                // visible할 때까지 대기
                                while (!isVisible(reserveBtn)) {
                                    await new Promise(res => setTimeout(res, 50));
                                }
                                reserveBtn.click();
                                // 예약 버튼 클릭 후 자동예매 중지
                                stopFlag = true;
                                running = false;
                                const autoBtn = document.getElementById('korail-auto-btn');
                                if (autoBtn) {
                                    autoBtn.textContent = '자동 예매 시작';
                                    autoBtn.style.background = '#1976d2';
                                }
                            }
                            break;
                        }
                    }
                }
            }

            if (found || stopFlag) break; // 매진이 아닌 표를 클릭했으면 종료

            // 매진이 아닌 표가 없으면 대기 후 탭 버튼 클릭
            await new Promise(res => setTimeout(res, waitMs));
            if (stopFlag) break;
            tabBtn.click();

            // 탭 영역의 subtree 변경 대기
            await waitForTabChange("#tab_tab_info1");
        }
    }

    // 버튼 클릭 이벤트 핸들러
    function toggleAuto() {
        const btn = document.getElementById('korail-auto-btn');
        if (!running) {
            running = true;
            stopFlag = false;
            btn.textContent = '자동 예매 중지';
            btn.style.background = '#d32f2f';
            tryClick().then(() => {
                running = false;
                stopFlag = false;
                btn.textContent = '자동 예매 시작';
                btn.style.background = '#1976d2';
            });
        } else {
            stopFlag = true;
            running = false;
            btn.textContent = '자동 예매 시작';
            btn.style.background = '#1976d2';
        }
    }

    // 대기시간 설정 버튼 핸들러
    function openSetting() {
        const ms = prompt('탭 새로고침 대기시간(ms)을 입력하세요.', waitMs);
        if (ms !== null) {
            const n = parseInt(ms, 10);
            if (!isNaN(n) && n > 0) {
                waitMs = n;
                localStorage.setItem(STORAGE_KEY, waitMs);
                document.getElementById('korail-setting-btn').textContent = `대기시간: ${waitMs}ms`;
            } else {
                alert('올바른 숫자를 입력하세요.');
            }
        }
    }

    // 컨테이너 및 버튼 생성 및 이벤트 연결
    const container = createFloatingContainer();
    const btn = createFloatingButton();
    const settingBtn = createSettingButton();
    container.appendChild(btn);
    container.appendChild(settingBtn);

    btn.addEventListener('click', toggleAuto);
    settingBtn.addEventListener('click', openSetting);

})();
