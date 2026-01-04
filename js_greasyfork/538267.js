// ==UserScript==
// @name         DUO_FARMEDGEMS
// @namespace    http://tampermonkey.net/
// @version      v1.0BETA
// @description  THIS TOOL AUTO FARMED GEMS FOR YOU
// @author       ´꒳`ⓎⒶⓂⒾⓈⒸⓇⒾⓅⓉ×͜×
// @match        https://www.duolingo.com/learn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538267/DUO_FARMEDGEMS.user.js
// @updateURL https://update.greasyfork.org/scripts/538267/DUO_FARMEDGEMS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const colors = {
        primary: '#58CC02',
        secondary: '#1DA462',
        danger: '#FF4757',
        background: '#003049',
        text: '#FFFFFF'
    };

    function createElement(tag, options = {}) {
        const el = document.createElement(tag);
        if (options.styles) Object.assign(el.style, options.styles);
        if (options.content) el.innerHTML = options.content;
        if (options.events) {
            for (const [event, handler] of Object.entries(options.events)) {
                el.addEventListener(event, handler);
            }
        }
        return el;
    }

    function createBtn(label, bg, shadow, onClick) {
        return createElement('button', {
            styles: {
                flex: '1 1 120px',
                padding: '12px 0',
                fontSize: '16px',
                fontWeight: '600',
                background: bg,
                color: colors.text,
                border: 'none',
                borderRadius: '15px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                boxShadow: `0 8px 25px ${shadow}66`,
                minWidth: '120px'
            },
            content: label,
            events: {
                click: onClick,
                mouseenter: e => e.currentTarget.style.transform = 'translateY(-2px)',
                mouseleave: e => e.currentTarget.style.transform = 'translateY(0)'
            }
        });
    }

    function createSmallBtn(label, bg, shadow, onClick) {
        return createElement('button', {
            styles: {
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                background: bg,
                color: colors.text,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                boxShadow: `0 5px 15px ${shadow}44`,
                margin: '5px'
            },
            content: label,
            events: {
                click: onClick,
                mouseenter: e => e.currentTarget.style.transform = 'translateY(-1px)',
                mouseleave: e => e.currentTarget.style.transform = 'translateY(0)'
            }
        });
    }

    const gemBtn = createElement('button', {
        styles: {
            position: 'fixed',
            bottom: '25px',
            right: '10px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: colors.text,
            fontSize: '32px',
            cursor: 'pointer',
            zIndex: 10000,
            boxShadow: '0 8px 20px rgba(88, 204, 2, 0.3)',
            transition: 'transform 0.3s ease',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        content: '💎',
        events: { click: togglePanel }
    });

    const panel = createElement('div', {
        styles: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '460px',
            background: colors.background,
            borderRadius: '25px',
            zIndex: 10000,
            padding: '30px',
            fontFamily: "'Segoe UI', system-ui",
            color: colors.text,
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.9)',
            pointerEvents: 'none',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            overflow: 'hidden',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column'
        }
    });
    panel.id = 'duoPanel';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes borderAnim {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        #duoPanel {
            border: 2px solid transparent;
            background-origin: border-box;
            background-clip: padding-box, border-box;
            background-image:
                linear-gradient(${colors.background}, ${colors.background}),
                linear-gradient(270deg, #58CC02, #1DA462, #FF4757, #58CC02);
            background-size: 400% 400%;
            background-repeat: no-repeat;
            animation: borderAnim 10s linear infinite;
        }
        #duoPanel.active {
            opacity: 1 !important;
            transform: translate(-50%, -50%) scale(1) !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    function togglePanel() {
        panel.classList.toggle('active');
        gemBtn.style.transform = panel.classList.contains('active') ? 'rotate(360deg)' : 'rotate(0deg)';
    }

    const header = createElement('div', {
        styles: { textAlign: 'center', marginBottom: '10px' },
        content: `
            <h1 style="margin: 0 0 10px 0;
                       font-size: 32px;
                       background: linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.text}cc);
                       -webkit-background-clip: text;
                       background-clip: text;
                       color: transparent;
                       font-weight: 700;
                       letter-spacing: 1px;">
            DUO_FARMEDGEMS</h1>
            <p style="margin: 0; color: ${colors.text}; font-size: 14px;">MADE BY YAMISCRIPT_DEV</p>
            <p id="_loginStatus">LOADING...</p>
        `
    });

    const usernameGreeting = createElement('div', {
        styles: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px',
            fontSize: '18px',
            color: colors.text
        },
    });

    async function fetchUsername() {
        const userId = getCookie('logged_out_uuid');
        const jwt = getCookie('jwt_token');
        if (!userId || !jwt) return;
        try {
            const res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=username`, {
                headers: { authorization: `Bearer ${jwt}` }
            });
            const data = await res.json();
            if (data.username) {
                document.getElementById('_loginStatus').innerHTML = ``;
                usernameGreeting.innerHTML = `<span>👋Welcome, <b style="color: ${colors.primary}">${data.username}</b>!</span>`;
            }
        } catch (e) {
            document.getElementById('_loginStatus').innerText = 'BRUH!';
        }
    }

    const gemCountDiv = createElement('div', {
        styles: { textAlign: 'center', margin: '20px 0' },
        content: `<div id="gemCount" style="font-size: 42px;
                                            font-weight: 700;
                                            color: ${colors.primary};
                                            text-shadow: 0 4px 12px rgba(88,204,2,0.2);
                                            margin-top: 10px;">0</div>`
    });

    const btnGroup = createElement('div', {
        styles: {
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            margin: '25px 0',
            flexWrap: 'wrap'
        }
    });

    const statusText = createElement('div', {
        styles: {
            textAlign: 'center',
            color: colors.text + '99',
            fontSize: '14px',
            marginTop: '5px'
        },
        content: '<span id="statusText">NON-ACTIVE:❌</span>'
    });

    const startBtn = createBtn('START', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, colors.primary, startFarm);
    const stopBtn = createBtn('STOP', `linear-gradient(135deg, ${colors.danger}, #CC2E3D)`, colors.danger, stopFarm);
    stopBtn.style.display = 'none';

    const discordBtn = createBtn('DISCORD', `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`, colors.secondary, () => window.open('https://discord.gg/aDD9DMz6', '_blank'));
    const profileBtn = createBtn('PROFILE', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, colors.primary, () => window.open('https://guns.lol/yamiscript_dev'));
    const settingBtn = createBtn('SETTING', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, colors.primary, showTokenPanel);

    const tokenPanel = createElement('div', {
        styles: {
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: '#144d1d',
            marginTop: '15px',
            textAlign: 'center',
            fontSize: '14px',
            userSelect: 'text'
        }
    });

    const tokenTextarea = createElement('textarea', {
        styles: {
            width: '100%',
            height: '80px',
            borderRadius: '10px',
            border: 'none',
            resize: 'none',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'monospace',
            marginBottom: '12px',
            backgroundColor: '#0b2e0f',
            color: '#a6e22e'
        },
        events: {
            focus: (e) => e.target.select()
        }
    });

    const copyTokenBtn = createSmallBtn('Copy token', `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, colors.primary, () => {
        tokenTextarea.select();
        document.execCommand('copy');
        copyTokenBtn.textContent = 'Copied!';
        setTimeout(() => copyTokenBtn.textContent = 'Copy token', 2000);
    });

    const closeTokenBtn = createSmallBtn('Close', colors.danger, colors.danger, showMainPanel);

    tokenPanel.append(
        createElement('div', { content: '<b>Token JWT of you:</b>', styles: { marginBottom: '10px', fontSize: '10px' } }),
        tokenTextarea,
        copyTokenBtn,
        closeTokenBtn
    );

    btnGroup.append(startBtn, stopBtn, discordBtn, profileBtn, settingBtn);
    panel.append(header, usernameGreeting, gemCountDiv, btnGroup, statusText, tokenPanel);
    document.body.append(gemBtn, panel);

    let farming = false;
    let gemCount = parseInt(localStorage.getItem('gemsCount')) || 0;
    let farmInterval;

    function updateGemCount() {
        localStorage.setItem('gemsCount', gemCount);
        document.getElementById('gemCount').textContent = gemCount;
    }

    function showTokenPanel() {
        const token = getCookie('jwt_token') || 'Không tìm thấy token';
        tokenTextarea.value = token;
        btnGroup.style.display = 'none';
        statusText.style.display = 'none';
        gemCountDiv.style.display = 'none';
        tokenPanel.style.display = 'flex';
    }

    function showMainPanel() {
        tokenPanel.style.display = 'none';
        btnGroup.style.display = 'flex';
        statusText.style.display = 'block';
        gemCountDiv.style.display = 'block';
    }

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    async function farmGems() {
        try {
            const userId = getCookie('logged_out_uuid');
            const jwt = getCookie('jwt_token');
            const res = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/rewards/CAPSTONE_COMPLETION-xxxx-2-GEMS`, {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + jwt,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ amount: 0, consumed: true, skillId: 'xxx', type: 'mission' })
            });
            if (res.status === 200) {
                for (let i = 1; i <= 15; i++) {
                    setTimeout(() => {
                        gemCount++;
                        updateGemCount();
                    }, i * 250);
                }
            }
        } catch (err) {
            console.error('Lỗi farm:', err);
        }
    }

    function startFarm() {
        if (!farming) {
            farming = true;
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
            document.getElementById('statusText').textContent = 'ACTIVE:✅';
            farmInterval = setInterval(farmGems, 100);
        }
    }

    function stopFarm() {
        farming = false;
        clearInterval(farmInterval);
        stopBtn.style.display = 'none';
        startBtn.style.display = 'block';
        document.getElementById('statusText').textContent = 'NON-ACTIVE:❌';
        updateGemCount();
    }

    window.addEventListener('load', () => {
        fetchUsername();
        updateGemCount();
    });

    window.onbeforeunload = () => farming ? 'Đang farm gems - Bạn có chắc chắn muốn thoát?' : null;
})();
