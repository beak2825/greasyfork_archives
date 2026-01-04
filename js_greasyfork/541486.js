// ==UserScript==
// @name         Discord Token Extractor (Auto Compatible)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Lấy token Discord khi click nút ẩn. Hoạt động trên tất cả trang Discord Web.
// @author       TranMC
// @match        https://discord.com/*
// @grant        none
// @license MIT2
// @downloadURL https://update.greasyfork.org/scripts/541486/Discord%20Token%20Extractor%20%28Auto%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541486/Discord%20Token%20Extractor%20%28Auto%20Compatible%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let buttonAdded = false;
    let tokenFetched = false; 

    function addTokenButton() {
        if (buttonAdded) return;

        const btn = document.createElement('button');
        btn.innerText = '⋮';
        btn.title = 'Click để lấy token';
        btn.style.position = 'fixed';
        btn.style.top = '5px';
        btn.style.left = '5px';
        btn.style.zIndex = 9999;
        btn.style.padding = '3px 6px';
        btn.style.fontSize = '12px';
        btn.style.background = '#5865F2';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '0.2';
        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.2';

        btn.onclick = async () => {
            if (tokenFetched) {
                showModal(window.__lastToken || 'Token đã được lấy trước đó rồi.', true);
                return;
            }

            try {
                webpackChunkdiscord_app.push([
                    [Symbol()],
                    {},
                    async r => {
                        const token = Object.values(r.c || {}).find(x => x?.exports?.getToken)?.exports?.getToken();
                        if (token && !tokenFetched) {
                            tokenFetched = true;
                            window.__lastToken = token;
                            const ok = await copyToClipboard(token);
                            showModal(token);
                            // Hiển thị thông báo copy thành công/thất bại
                            const copied = document.getElementById('token-modal-copied');
                            const fail = document.getElementById('token-modal-fail');
                            const box = document.getElementById('token-modal-box');
                            const tokenBox = document.getElementById('token-modal-token');
                            if (copied && fail && box && tokenBox) {
                                tokenBox.classList.remove('glow', 'fail');
                                void tokenBox.offsetWidth;
                                if (ok) {
                                    copied.innerText = 'Đã copy vào clipboard!';
                                    fail.innerText = '';
                                    box.classList.add('copied');
                                    tokenBox.classList.add('glow');
                                    setTimeout(() => {
                                        box.classList.remove('copied');
                                        tokenBox.classList.remove('glow');
                                    }, 600);
                                } else {
                                    copied.innerText = '';
                                    fail.innerText = 'Copy thất bại!';
                                    box.classList.add('shake');
                                    tokenBox.classList.add('fail');
                                    setTimeout(() => {
                                        box.classList.remove('shake');
                                        tokenBox.classList.remove('fail');
                                    }, 600);
                                }
                                setTimeout(() => {
                                    copied.innerText = '';
                                    fail.innerText = '';
                                }, 1500);
                            }
                        }
                    }
                ]);

                setTimeout(() => {
                    if (!tokenFetched) {
                        showModal('Không tìm thấy token. Hãy thử lại sau.');
                    }
                }, 1000);
            } catch (err) {
                showModal('Lỗi khi lấy token.');
                console.error('Lỗi:', err);
            }
        };

        document.body.appendChild(btn);
        buttonAdded = true;
    }

    function waitForApp() {
        if (document.body) {
            addTokenButton();
        } else {
            setTimeout(waitForApp, 500);
        }
    }

    function injectModalStyles() {
        if (document.getElementById('token-modal-style')) return;
        const style = document.createElement('style');
        style.id = 'token-modal-style';
        style.innerHTML = `
        #token-modal {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.35); backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000; opacity: 0; pointer-events: none;
            transition: opacity 0.35s cubic-bezier(.4,0,.2,1), backdrop-filter 0.35s;
            animation: modalFadeOut 0.35s forwards;
        }
        #token-modal.active {
            opacity: 1; pointer-events: auto;
            animation: modalFadeIn 0.35s forwards;
        }
        @keyframes modalFadeIn {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(6px); }
        }
        @keyframes modalFadeOut {
            from { opacity: 1; backdrop-filter: blur(6px); }
            to { opacity: 0; backdrop-filter: blur(0px); }
        }
        #token-modal-box {
            background: #23272A; color: #fff; padding: 24px 32px; border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0,0,0,0.35);
            text-align: center; min-width: 320px; position: relative;
            animation: boxPopIn 0.45s cubic-bezier(.4,0,.2,1);
            transition: box-shadow 0.2s, transform 0.2s;
        }
        #token-modal-box.copied {
            box-shadow: 0 0 0 6px #43b58188, 0 8px 32px 0 rgba(0,0,0,0.35);
        }
        #token-modal-box.shake {
            animation: boxShake 0.35s;
        }
        @keyframes boxPopIn {
            0% { transform: translateY(40px) scale(0.85); opacity: 0; }
            60% { transform: translateY(-10px) scale(1.05); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes boxShake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-7px); }
            80% { transform: translateX(7px); }
            100% { transform: translateX(0); }
        }
        #token-modal-token {
            background: #111; padding: 8px 12px; border-radius: 4px; word-break: break-all;
            margin-bottom: 16px; font-family: monospace; font-size: 15px; cursor: pointer; user-select: all;
            border: 1px solid #444; transition: background 0.2s, box-shadow 0.2s, color 0.2s;
            display: inline-block;
        }
        #token-modal-token:hover { background: #222; }
        #token-modal-token.glow {
            box-shadow: 0 0 12px 2px #43b581cc;
            animation: tokenBounce 0.5s;
        }
        #token-modal-token.fail {
            color: #fa4a4a; border-color: #fa4a4a; background: #2a1111;
            animation: tokenFailFlash 0.5s;
        }
        @keyframes tokenBounce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
            50% { transform: translateY(0); }
            70% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
        @keyframes tokenFailFlash {
            0% { background: #2a1111; }
            30% { background: #fa4a4a; color: #fff; }
            60% { background: #2a1111; }
            100% { background: #2a1111; }
        }
        #token-modal-close {
            background: #5865F2; color: #fff; border: none; border-radius: 4px;
            padding: 6px 18px; font-size: 15px; cursor: pointer;
            transition: background 0.2s, transform 0.15s;
        }
        #token-modal-close:hover {
            background: #4752c4;
        }
        #token-modal-close:active {
            transform: scale(0.92);
        }
        #token-modal-copied {
            color: #43b581; font-size: 14px; margin-bottom: 10px; min-height: 18px;
        }
        #token-modal-fail {
            color: #fa4a4a; font-size: 14px; margin-bottom: 10px; min-height: 18px;
        }
        `;
        document.head.appendChild(style);
    }

    function copyToClipboard(text) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    }

    function showModal(token, alreadyFetched = false) {
        injectModalStyles();
        const oldModal = document.getElementById('token-modal');
        if (oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = 'token-modal';

        const box = document.createElement('div');
        box.id = 'token-modal-box';

        const title = document.createElement('div');
        title.innerText = alreadyFetched ? 'Token đã được lấy trước đó:' : 'Token Discord của bạn:';
        title.style.fontSize = '18px';
        title.style.marginBottom = '12px';
        title.style.fontWeight = 'bold';

        const tokenBox = document.createElement('div');
        tokenBox.id = 'token-modal-token';
        tokenBox.innerText = token;
        tokenBox.title = 'Click để copy lại token';

        const copied = document.createElement('div');
        copied.id = 'token-modal-copied';
        copied.innerText = '';

        const fail = document.createElement('div');
        fail.id = 'token-modal-fail';
        fail.innerText = '';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'token-modal-close';
        closeBtn.innerText = 'Đóng';
        closeBtn.onclick = closeModal;

        tokenBox.onclick = async () => {
            const ok = await copyToClipboard(token);
            tokenBox.classList.remove('glow', 'fail');
            void tokenBox.offsetWidth; 
            if (ok) {
                copied.innerText = 'Đã copy vào clipboard!';
                fail.innerText = '';
                box.classList.add('copied');
                tokenBox.classList.add('glow');
                setTimeout(() => {
                    box.classList.remove('copied');
                    tokenBox.classList.remove('glow');
                }, 600);
            } else {
                copied.innerText = '';
                fail.innerText = 'Copy thất bại!';
                box.classList.add('shake');
                tokenBox.classList.add('fail');
                setTimeout(() => {
                    box.classList.remove('shake');
                    tokenBox.classList.remove('fail');
                }, 600);
            }
            setTimeout(() => {
                copied.innerText = '';
                fail.innerText = '';
            }, 1500);
        };

        box.appendChild(title);
        box.appendChild(tokenBox);
        box.appendChild(copied);
        box.appendChild(fail);
        box.appendChild(closeBtn);
        modal.appendChild(box);
        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('active'), 10);

        modal.addEventListener('mousedown', function(e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', escListener);
    }

    function closeModal() {
        const modal = document.getElementById('token-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => { if (modal) modal.remove(); }, 250);
        }
        document.removeEventListener('keydown', escListener);
    }

    function escListener(e) {
        if (e.key === 'Escape') closeModal();
    }

    waitForApp();
})();