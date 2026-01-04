// ==UserScript==
// @name         Chzzk_L&V: UserBlockPopup
// @namespace    Chzzk_L&V: UserBlockPopup
// @version      1.1
// @description  치지직 페이지에서 닉네임 클릭 시 userId 추출 후 차단 팝업 띄우기 (토글 기능 포함, 상태 저장)
// @author       DOGJIP
// @match        https://chzzk.naver.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/538274/Chzzk_LV%3A%20UserBlockPopup.user.js
// @updateURL https://update.greasyfork.org/scripts/538274/Chzzk_LV%3A%20UserBlockPopup.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let enabled = false;
    let toggleCommandId = null;

    async function init() {
        enabled = await GM_getValue('chzzkUserBlock_enabled', false);
        updateMenu();
    }

    function updateMenu() {
        try {
            GM_unregisterMenuCommand(toggleCommandId);
        } catch (e) {}

        const title = enabled ? '스크립트 비활성화' : '스크립트 활성화';
        toggleCommandId = GM_registerMenuCommand(title, async () => {
            enabled = !enabled;
            await GM_setValue('chzzkUserBlock_enabled', enabled);
            alert(enabled ? 'UserBlockPopup 스크립트가 활성화되었습니다.' : 'UserBlockPopup 스크립트가 비활성화되었습니다.');
            updateMenu();
        });
    }

    init();

    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        if (!enabled) return originalPushState.apply(this, args);
        const url = args[2];
        if (typeof url === 'string' && /^\/[a-z0-9]{32}$/i.test(url)) {
            const userId = url.slice(1);
            const userUrl = window.location.origin + '/' + userId;
            console.log('[Chzzk-Block] pushState 감지, userId:', userId);
            showPopup(userId, userUrl);
            return;
        }
        return originalPushState.apply(this, args);
    };

    window.addEventListener('popstate', (e) => {
        if (!enabled) return;
        const path = location.pathname;
        if (/^\/[a-z0-9]{32}$/i.test(path)) {
            const userId = path.slice(1);
            const userUrl = window.location.origin + '/' + userId;
            console.log('[Chzzk-Block] popstate 감지, userId:', userId);
            showPopup(userId, userUrl);
        }
    });

    document.body.addEventListener('click', (e) => {
        if (!enabled) return;
        const span = e.target.closest('span[class^="name_text__"]');
        if (!span) return;

        const link = span.closest('a[href^="/"]');
        if (!link) return;

        const href = link.getAttribute('href');
        const match = href.match(/^\/([a-z0-9]{32})$/i);
        if (!match) return;

        const userId = match[1];
        const userUrl = window.location.origin + '/' + userId;
        console.log('[Chzzk-Block] <a> 클릭 감지, userId:', userId);

        e.preventDefault();
        e.stopPropagation();
        showPopup(userId, userUrl);
    });

    function showPopup(userId, userUrl) {
        const existing = document.getElementById('chzzkBlockPopup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'chzzkBlockPopup';
        popup.style.cssText = `
            position: fixed;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -35%);
            background: #fff;
            border: 2px solid #333;
            padding: 18px 24px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            min-width: 300px;
            text-align: center;
        `;

        popup.innerHTML = `
            <p style="margin-bottom: 14px; font-size: 15px; color: #333;">
                "${userId}" 님을 차단하시겠습니까?
            </p>
            <div style="display: flex; justify-content: center; gap: 8px;">
                <button id="chzzkBlockYes" style="padding: 6px 12px; border:none; background:#d33; color:#fff; border-radius:4px; cursor:pointer;">
                    예
                </button>
                <button id="chzzkBlockGo" style="padding: 6px 12px; border:none; background:#555; color:#fff; border-radius:4px; cursor:pointer;">
                    사용자 페이지 이동
                </button>
                <button id="chzzkBlockClose" style="padding: 6px 12px; border:none; background:#999; color:#fff; border-radius:4px; cursor:pointer;">
                    닫기
                </button>
            </div>
        `;

        document.body.appendChild(popup);

        popup.querySelector('#chzzkBlockYes').onclick = async () => {
            try {
                const res = await fetch(
                    `https://comm-api.game.naver.com/nng_main/v1/privateUserBlocks/${userId}?loungeId=`,
                    {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            accept: 'application/json, text/plain, */*',
                            origin: 'https://game.naver.com',
                            referer: `https://game.naver.com/profile/${userId}`,
                        },
                    }
                );
                if (res.ok) {
                    alert(`"${userId}" 님이 차단되었습니다.`);
                } else {
                    alert(`차단 실패 (HTTP ${res.status})`);
                }
            } catch (err) {
                console.error('[Chzzk-Block] 차단 중 오류:', err);
                alert('차단 중 오류가 발생했습니다.');
            } finally {
                popup.remove();
            }
        };

        popup.querySelector('#chzzkBlockGo').onclick = () => {
            popup.remove();
            window.location.href = userUrl;
        };

        popup.querySelector('#chzzkBlockClose').onclick = () => {
            popup.remove();
        };
    }
})();
