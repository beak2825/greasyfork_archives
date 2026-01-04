// ==UserScript==
// @name         Quick login plugin / 快速登录插件
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Quick login plugin / 快速登录网站
// @author       Tony Ma
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533913/Quick%20login%20plugin%20%20%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/533913/Quick%20login%20plugin%20%20%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(async function () {
    // shortcut (ctrl + enter) or (alt + enter) could quickly log in USERS[0]
    // 快捷键(ctrl + enter) 或 (alt + enter) 可以快速登录USERS[0]
    let USERS = []
    switch (window.location.host) {
        case 'can specify host here': {
            USERS = [
                { name: "name", accountId: "accountId", vault: "encryped password", /*domainCode: 'optional, default to <designer>'*/ },
            ];
            break;
        }
        default: USERS = [
            { name: "Zhiming", accountId: "zhiming", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
            { name: "Zhenyu", accountId: "zhenyu", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
            { name: "Rongrong", accountId: "rongrong", vault: "Xt6DQb116oMideFa+z87Upv5jhAMR6ChrnCkAG7JDHYMfSu/DGvSHJz6tIvrj7eV0jE3ksGBJPnvp/OtxDbtMuWPJXZHFTCk0jx1s2xF6KDeg8Sm+gFM0tAgUN8/xlHHzDYKHOPdLWNb8fC/bb2lReNUs4mJxzfC9CfHWer9d7AnK71+tpUFgZASHxttIC3NS65D4CGMtPTjaIA+Qu5rQvWEfO1OcwIZpE/1eprlk/XNeMsp1wOs0NqwcuJD/hKvRsGqYK0FzZU/AR1552tP1B6IVYBhh5mGpuyFppvu6M2ckTkdIMsGwB8r3oawCVHTRtFEDm58xiVoSIa5f4fXcQ==" },
            { name: "Yichun", accountId: "yichun", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
            { name: "管理员", accountId: "admin", vault: "ii6yw5jQAviHVP2xxL7g1h0uQjSfjM94iNIQmD1QnhX74BmeNTJ67CKjCq1jMNwfMlK4+prYXsCLnhx5UedUH0PaBZ0fnlXC54J2dgDfmuvNyv1qHZaBHnsrgDAiS4GVNkwncour2lTAwNn4f9vdWfnjvzc8TUcNWHihcEtiEUj7YSyijfNjvjv7A+usH2e65f+zFCDypkIGuo+wwz0+WFKpSSMJGsncwaKIucG1YI+3olR7lvGPVVb2BjfLcLT1eXV5EEP9H/VJxfzUELQSKFZZ0LsuVWwfzvZIZcmkx9oxn0eV5+9zbhma8ItYLxM0j6rU3zYlOc1Q1twmZgGpPQ==" },
            // 可添加更多用户
        ]
    }

    function showToast(type, text) {
        const colorMap = {
            success: '#52c41a',
            error: '#ff4d4f',
            loading: '#1890ff'
        };

        const toast = document.createElement('div');
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colorMap[type] || '#333'};
            color: #fff;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => (toast.style.opacity = 1), 10);

        const remove = () => {
            toast.style.opacity = 0;
            setTimeout(() => toast.remove(), 300);
        };

        if (type !== 'loading') {
            setTimeout(remove, 2000);
        }

        return remove;
    }
    let prefixCache;
    function getCsrfTokenPrefix() {
        if(prefixCache) return prefixCache;
        const defaultPrefix = 'agp-cookie-csrf';

        return fetch('/config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(config => {
                prefixCache = config.CSRF_TOKEN_PREFIX || defaultPrefix;
                return config.CSRF_TOKEN_PREFIX || defaultPrefix;
            })
            .catch(error => {
                prefixCache = defaultPrefix;
                console.error('Failed to fetch config.json:', error);
                return defaultPrefix;
            });
    }

    async function getCSRF() {
        const cookies = document.cookie.split('; ');
        const csrfKey = await getCsrfTokenPrefix()
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === csrfKey) {
                return cookie.substring(key.length + 1, cookie.length);
            }
        }
        return '';
    }


    async function loginWithUser(user) {
        const hide = showToast('loading', '正在登录 ' + user.name);
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': await getCSRF() },
                body: JSON.stringify({
                    userAccountId: user.accountId,
                    vault: user.vault,
                    userDomainCode: user.domainCode ?? 'designer'
                })
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData?.message || '请求失败');
            }
            hide();
            showToast('success', '登录成功');
            localStorage.setItem('isLogin', 'true');
            if (location.hash === '#/login') {
                window.location.href = '/#/console';
            }
        } catch (e) {
            hide();
            showToast('error', '登录失败：' + e.message);
        }
    }

    // 快捷键支持
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.altKey) && e.key === 'Enter') {
            loginWithUser(USERS[0]);
        } else if (e.altKey && (e.key - 1) < USERS.length) {
            loginWithUser(USERS[e.key - 1]);
        }
    });

    // 添加悬浮控制面板
    const ctrlDiv = document.createElement('div');
    ctrlDiv.id = 'quick-login-controller';
    ctrlDiv.innerHTML = `
<style>
/* 同你原来的悬浮按钮样式 */
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#quick-login-fab-wrapper { position: fixed; top: 100px; left: 20px; z-index: 9999; display: flex; gap: 10px; }
#quick-login-fab { opacity: 0.75; width: 48px; height: 48px; border-radius: 50%; cursor: grab; background: #136fb736;
    box-shadow: 0 0px 8px rgb(189 245 255 / 98%), inset 0 3px 1px rgb(98 193 245 / 54%) !important;
    display: flex; align-items: center; justify-content: center; user-select: none; font-size: 2em; color: #fff; }
#quick-login-fab-wrapper:hover #quick-login-fab { opacity: 1 !important; }
#quick-login-fab-wrapper:hover .quick-login-fab-btns { display: flex; }
.quick-login-fab-btns { display: none; flex-direction: column; gap: 6px; top: 0; left: 60px; }
.quick-login-fab-btns button { text-align: left; padding: 4px 8px; font-size: 12px; background-color: white;
    border: 1px solid #ccc; border-radius: 6px; cursor: pointer; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
</style>
<div id="quick-login-fab-wrapper">
  <div id="quick-login-fab">
    <svg style="transform: scale(0.7); opacity: 1" fill="#ecf9fd" t="1745546148895" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 590.75c-142.5 0-258.75-116.25-258.75-258.75s116.25-262.5 258.75-262.5 258.75 116.25 258.75 258.75-116.25 262.5-258.75 262.5zM512 144.5c-101.25 0-183.75 82.5-183.75 183.75s82.5 183.75 183.75 183.75 183.75-82.5 183.75-183.75-82.5-183.75-183.75-183.75z"></path><path d="M170.75 950.75c-18.75 0-37.5-15-37.5-37.5 0-7.5 0-11.25 0-15 0-210 172.5-382.5 382.5-382.5 22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5c-168.75 0-307.5 138.75-307.5 307.5v11.25c0 22.5-18.75 41.25-37.5 41.25v0z"></path><path d="M853.25 947v0c-22.5 0-37.5-15-37.5-37.5v-11.25c0-168.75-138.75-307.5-307.5-307.5-22.5 0-37.5-15-37.5-37.5s15-37.5 37.5-37.5c210 0 382.5 172.5 382.5 382.5 0 3.75 0 7.5 0 11.25 0 22.5-15 37.5-37.5 37.5z"></path></svg>
  </div>
  <div class="quick-login-fab-btns">
    ${USERS.map((u, i) => `<button class="quick-login-btn" data-index="${i}">Alt + ${i + 1}. 快速登录 ${u.name}</button>`).join('')}
  </div>
</div>
    `;
    document.body.appendChild(ctrlDiv);

    function saveFabPosition(left, top) {
        localStorage.setItem('login-fabPosition', JSON.stringify({ left, top }));
    }

    function loadFabPosition() {
        const pos = JSON.parse(localStorage.getItem('login-fabPosition'));
        if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
            wrapper.style.left = `${pos.left}px`;
            wrapper.style.top = `${pos.top}px`;
        } else {
            wrapper.style.left = `0px`;
            wrapper.style.top = `50%`;
        }
    }

    const wrapper = document.getElementById('quick-login-fab-wrapper');
    const fab = document.getElementById('quick-login-fab');
    let isDragging = false, offsetX = 0, offsetY = 0;

    loadFabPosition();

    fab.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - wrapper.offsetLeft;
        offsetY = e.clientY - wrapper.offsetTop;
        fab.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            const halfWidth = wrapper.offsetWidth / 2;
            const halfHeight = wrapper.offsetHeight / 2;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            newLeft = Math.max(-halfWidth, Math.min(newLeft, window.innerWidth - halfWidth));
            newTop = Math.max(-halfHeight, Math.min(newTop, window.innerHeight - halfHeight));

            wrapper.style.left = `${newLeft}px`;
            wrapper.style.top = `${newTop}px`;
            saveFabPosition(newLeft, newTop);
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        fab.style.cursor = 'grab';
    });

    document.querySelectorAll('.quick-login-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = +e.target.getAttribute('data-index');
            loginWithUser(USERS[idx]);
        });
    });

    // 插入 Quick Login 按钮
    function createQuickLoginButton() {
        const control = document.querySelector('.next-icestark-form .next-icestark-form-item:last-child');
        const btn = document.createElement('button');
        btn.id = 'fillFormBtn';
        btn.className = 'next-icestark-btn next-icestark-large next-icestark-btn-primary';
        btn.style.cssText = `
            width: 100%;
            margin-top: 10px;
            background: rgb(82, 144, 237);
            border-radius: 8.9px;
            height: 45px;
            box-shadow: rgba(0,0,0,0.12) 0px 4.44748px 6.67122px -1.11187px, rgba(0,0,0,0.07) 0px 2.22374px 4.44748px -1.11187px;
        `;
        btn.innerText = `Quick Login - ${USERS[0].name}`;

        control.appendChild(btn);

        btn.addEventListener('click', () => loginWithUser(USERS[0]));
    }

    function checkElement(times = 40) {
        if (times <= 0) return;
        const control = document.querySelector('.next-icestark-form .next-icestark-form-item:last-child');
        if (control) {
            createQuickLoginButton();
        } else {
            setTimeout(() => checkElement(times - 1), 500);
        }
    }

    checkElement();
})();
