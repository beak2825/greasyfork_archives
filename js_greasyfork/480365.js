// ==UserScript==
// @name         ChatGPT瑞士军刀
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  侧边栏按钮呼出工具箱：支付链接生成 + Token一键复制 + 账单门户管理 + 取消订阅 + 重构还原JSON
// @author       ChatGPT指导员V：chatgpt4v
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/480365/ChatGPT%E7%91%9E%E5%A3%AB%E5%86%9B%E5%88%80.user.js
// @updateURL https://update.greasyfork.org/scripts/480365/ChatGPT%E7%91%9E%E5%A3%AB%E5%86%9B%E5%88%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;

    const BASE_URL = "https://chatgpt.com";
    const CANCEL_API_PATH = `${BASE_URL}/backend-api/subscriptions/cancel`;
    const CHECKOUT_API_PATH = `${BASE_URL}/backend-api/payments/checkout`;
    const PORTAL_API_PATH = `${BASE_URL}/backend-api/payments/customer_portal`;
    const SESSION_API_PATH = `${BASE_URL}/api/auth/session`;

    let var_TokenOnly = null;
    let var_CancelData = null;
    let var_FullJson = null;

    // =========================================================================
    // 注入样式
    // =========================================================================
    const css = `
    #gpt-tool-trigger {
        position: fixed; right: 0; background: #212121; color: rgba(255, 255, 255, 0.9);
        padding: 10px 12px; border-radius: 12px 0 0 12px;
        border: 1px solid rgba(255, 255, 255, 0.1); border-right: none;
        cursor: move; z-index: 2147483647; font-size: 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.3); transition: background 0.2s, padding 0.2s;
        user-select: none; touch-action: none;
    }
    #gpt-tool-trigger:hover { padding-right: 18px; background: #2a2a2a; }
    .gpt-tool-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: transparent; z-index: 10000; display: block;
        transition: opacity 0.3s ease; opacity: 0;
    }
    .gpt-tool-overlay.active { opacity: 1; }
    .gpt-tool-modal {
        position: fixed; right: 70px; transform: scale(0.1) translateX(60px); transform-origin: right center;
        opacity: 0; transition: transform 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.35s ease;
        background: rgba(33, 33, 33, 0.98) !important;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;
        width: 320px; padding: 24px 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        text-align: center; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        box-sizing: border-box; color: #fff !important;
    }
    .gpt-tool-modal.active { opacity: 1; transform: scale(1) translateX(0); }
    .gpt-tool-modal.closing { opacity: 0; transform: scale(0.1) translateX(60px) !important; }
    .gpt-btn-group { display: flex; flex-direction: column; gap: 14px; width: 100%; }
    .gpt-tool-btn {
        background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px; padding: 14px; font-size: 14px; font-weight: 700;
        cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%;
    }
    .gpt-tool-btn:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25); transform: scale(1.02); }
    .gpt-textarea {
        width: 100%; height: 120px; background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
        color: #eee; padding: 10px; font-size: 12px; resize: none;
        margin-bottom: 10px; outline: none; box-sizing: border-box;
    }
    .gpt-textarea:focus { border-color: #10a37f; }
    .grad-top { background-image: linear-gradient(45deg, #FC466B 0%, #3F5EFB 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .grad-manage { background-image: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(0, 242, 254, 0.2)); }
    .grad-cancel { background-image: linear-gradient(135deg, #FF512F 0%, #DD2476 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(221, 36, 118, 0.25)); }
    .grad-token { background-image: linear-gradient(135deg, #E2B0FF 0%, #9F44D3 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(159, 68, 211, 0.3)); }
    .grad-restore { background-image: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3)); }
    .gpt-divider { display: flex; align-items: center; justify-content: center; margin: 6px 0; color: rgba(255,255,255,0.3); font-size: 12px; font-weight: 500; }
    .gpt-divider::before, .gpt-divider::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
    .gpt-divider::before { margin-right: 12px; } .gpt-divider::after { margin-left: 12px; }
    .gpt-toast {
        position: fixed; bottom: 30px; right: 30px; background: #212121; color: #fff;
        padding: 12px 20px; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10002; transform: translateY(100px); transition: transform 0.3s ease; opacity: 0; white-space: pre-wrap;
    }
    .gpt-toast.loading { border: 1px solid rgba(16, 163, 127, 0.3); animation: gpt-pulse 1.5s infinite ease-in-out; }
    @keyframes gpt-pulse { 0% { opacity: 1; transform: translateY(0) scale(1); } 50% { opacity: 0.85; transform: translateY(0) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    .gpt-toast.success-green { background: #10a37f !important; border: none !important; box-shadow: 0 4px 15px rgba(16, 163, 127, 0.4); font-weight: 500; }
    .gpt-toast.error { background: #cf2e2e !important; }
    .gpt-toast.show { transform: translateY(0); opacity: 1; }
    `;

    if (typeof GM_addStyle !== 'undefined') { GM_addStyle(css); } else { const style = document.createElement('style'); style.innerHTML = css; document.head.appendChild(style); }

    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || "GET",
                url: url,
                headers: options.headers || {},
                data: options.body,
                responseType: 'text',
                timeout: 15000,
                onload: (response) => {
                    resolve({
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        text: () => Promise.resolve(response.responseText),
                        json: () => { try { return Promise.resolve(JSON.parse(response.responseText)); } catch (e) { return Promise.reject(e); } }
                    });
                },
                ontimeout: () => reject(new Error("Timeout")),
                onerror: (err) => reject(new Error("Network Error"))
            });
        });
    }

    const tryInitButton = () => {
        if (document.getElementById('gpt-tool-trigger')) return;
        if (!document.body) return;
        const triggerBtn = document.createElement('div');
        triggerBtn.id = 'gpt-tool-trigger';
        triggerBtn.innerText = '🛠️';
        const savedTop = localStorage.getItem('gpt_swiss_knife_top');
        if (savedTop) triggerBtn.style.top = savedTop; else triggerBtn.style.top = '50%';
        initDraggable(triggerBtn);
        document.body.appendChild(triggerBtn);
    };

    function updateModalPosition(triggerBtn, modal, forceMeasure = false) {
        if (!triggerBtn || !modal) return;
        let modalHeight = modal.offsetHeight;
        if (forceMeasure) {
            const originalVisibility = modal.style.visibility;
            const originalTransform = modal.style.transform;
            modal.style.visibility = 'hidden'; modal.style.transform = 'none';
            modalHeight = modal.offsetHeight;
            modal.style.visibility = originalVisibility; modal.style.transform = originalTransform;
        }
        const btnRect = triggerBtn.getBoundingClientRect();
        const winHeight = window.innerHeight;
        const padding = 15;
        let targetTop = btnRect.top + (btnRect.height / 2) - (modalHeight / 2);
        if (targetTop < padding) targetTop = padding;
        if (targetTop + modalHeight > winHeight - padding) targetTop = winHeight - modalHeight - padding;
        modal.style.top = targetTop + 'px';
    }

    function initDraggable(el) {
        let isDragging = false; let hasMoved = false; let startX, startY, initialTop, initialRight;
        el.addEventListener('mousedown', (e) => {
            isDragging = true; hasMoved = false; startX = e.clientX; startY = e.clientY;
            const rect = el.getBoundingClientRect(); initialTop = rect.top; initialRight = window.innerWidth - rect.right;
            el.style.transition = 'none'; e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) hasMoved = true;
            let newTop = initialTop + (e.clientY - startY);
            if (newTop < 0) newTop = 0; if (newTop > window.innerHeight - 40) newTop = window.innerHeight - 40;
            el.style.top = newTop + 'px'; el.style.right = (initialRight - (e.clientX - startX)) + 'px';
            const activeModal = document.querySelector('.gpt-tool-modal.active');
            if (activeModal) updateModalPosition(el, activeModal, false);
        });
        window.addEventListener('mouseup', () => {
            if (!isDragging) return; isDragging = false;
            el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'; el.style.right = '0px';
            if (hasMoved) localStorage.setItem('gpt_swiss_knife_top', el.style.top);
        });
        el.onclick = (e) => { if (hasMoved) { e.preventDefault(); e.stopPropagation(); return; } toggleModal(); };
    }

    tryInitButton(); window.addEventListener('load', tryInitButton); setInterval(tryInitButton, 2000);

    function processSessionData(d) {
        if (!d || !d.user || !d.accessToken) return false;
        var_TokenOnly = d.accessToken;
        if (d.account && d.account.id) var_CancelData = { token: d.accessToken, accountId: d.account.id };
        var_FullJson = d;
        return true;
    }

    async function preLoadAllData(needNotify = false) {
        if (var_TokenOnly && var_CancelData && var_FullJson) return true;
        if (needNotify && window.location.hostname.includes("chatgpt.com")) showToast("🚀 正在预加载 Token 数据……", 'green', 1000);
        try { const r = await gmFetch(SESSION_API_PATH); if (r.ok) { const d = await r.json(); if (processSessionData(d)) return true; } } catch (e) {}
        try { const r = await fetch(SESSION_API_PATH); if (r.ok) { const d = await r.json(); if (processSessionData(d)) return true; } } catch (e) {}
        if (needNotify && window.location.hostname.includes("chatgpt.com")) showToast("❌ 数据同步失败", 'error');
        return false;
    }

    function toggleModal() {
        const existingOverlay = document.querySelector('.gpt-tool-overlay');
        const existingModal = document.querySelector('.gpt-tool-modal');
        if (existingOverlay && existingModal) closeModalAnimate(existingOverlay, existingModal); else showModal();
    }

    function closeModalAnimate(overlay, modal) {
        modal.classList.remove('active'); modal.classList.add('closing'); overlay.classList.remove('active');
        setTimeout(() => { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 350);
    }

    function showModal() {
        preLoadAllData(false); if (document.querySelector('.gpt-tool-overlay')) return;
        const overlay = document.createElement('div'); overlay.className = 'gpt-tool-overlay';
        const modal = document.createElement('div'); modal.className = 'gpt-tool-modal';
        const btnGroup = document.createElement('div'); btnGroup.className = 'gpt-btn-group';
        buildMainMenu(btnGroup, overlay, modal);
        overlay.onclick = (e) => { if (e.target === overlay) closeModalAnimate(overlay, modal); };
        modal.appendChild(btnGroup); overlay.appendChild(modal); document.body.appendChild(overlay);
        const triggerBtn = document.getElementById('gpt-tool-trigger');
        if (triggerBtn) updateModalPosition(triggerBtn, modal, true);
        requestAnimationFrame(() => { overlay.classList.add('active'); modal.classList.add('active'); });
    }

    // =========================================================================
    // 核心工具：JWT 解析
    // =========================================================================
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) { return null; }
    }

    function buildMainMenu(container, overlay, modal) {
        container.innerHTML = '';
        container.appendChild(createDivider("支付订阅 / 账单管理"));
        container.appendChild(createBtn(`🇵🇭 <span class="grad-top">比索支付入口 (PHP)</span>`, "btn-pay", () => showPayMenu(container, overlay, "PH", "PHP")));
        container.appendChild(createBtn(`🇺🇸 <span class="grad-top">美元支付入口 (USD)</span>`, "btn-pay", () => showPayMenu(container, overlay, "US", "USD")));
        container.appendChild(createBtn(`💳 <span class="grad-manage">账单订阅管理 (Billing)</span>`, "btn-portal", () => showBillingOptions(container, overlay)));
        container.appendChild(createBtn(`🚫 <span class="grad-cancel">取消自动续费 (Cancel)</span>`, "btn-cancel", () => showCancelMenu(container, overlay)));
        container.appendChild(createDivider("开发者选项"));
        container.appendChild(createBtn(`🔑 <span class="grad-token">复制Access Token(Single)</span>`, "btn-token", () => handleCopyToken(overlay)));
        container.appendChild(createBtn(`📤 <span class="grad-json">Copy All Data (Full JSON)</span>`, "btn-data", () => handleCopyFullJson(overlay)));
        container.appendChild(createBtn(`🔄 <span class="grad-restore">Restore & Rebuild (JSON)</span>`, "btn-restore", () => showRestoreJsonMenu(container, overlay)));
    }

    // =========================================================================
    // Restore Full Data (Rebuild JSON)
    // =========================================================================
    function showRestoreJsonMenu(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("粘贴 Xy混合Json"));
        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = 'Xy Hybrid JSON Only (includes accounts_info)';
        container.appendChild(textarea);

        container.appendChild(createBtn(`🔄 重构还原 (Json)`, "btn-restore", () => {
            const rawVal = textarea.value.trim();
            if (!rawVal) return showToast("❌ 输入不能为空", 'error');

            let token = null;
            let inputJson = null;

            try {
                if (rawVal.startsWith('{')) {
                    inputJson = JSON.parse(rawVal);
                    token = inputJson.accessToken || inputJson.access_token;
                } else {
                    token = rawVal;
                }
            } catch (e) { token = rawVal; }

            if (!token || !token.startsWith('ey')) return showToast("❌ 无法提取有效 Token", 'error');

            const payload = parseJwt(token);
            if (!payload) return showToast("❌ Token 解码失败", 'error');

            const userId = payload['https://api.openai.com/auth']?.user_id || payload.user?.id || payload.sub;
            const email = payload['https://api.openai.com/profile']?.email || payload.email || "user@example.com";
            
            let idp = "auth0";
            if (payload.sub && payload.sub.includes('|')) {
                idp = payload.sub.split('|')[0];
            } else if (payload.authProvider) {
                idp = payload.authProvider;
            }

            let finalAccount = {
                "id": userId,
                "planType": "free",
                "structure": "personal",
                "organizationId": null
            };

            if (inputJson && inputJson.accounts_info && inputJson.accounts_info.accounts) {
                let targetAccount = null;

                if (inputJson.accountCheckInfo && inputJson.accountCheckInfo.team_ids && inputJson.accountCheckInfo.team_ids.length > 0) {
                    const teamId = inputJson.accountCheckInfo.team_ids[0];
                    if (inputJson.accounts_info.accounts[teamId]) {
                        targetAccount = inputJson.accounts_info.accounts[teamId].account;
                    }
                }

                if (!targetAccount) {
                    const priorityMap = { 'pro': 4, 'team': 3, 'plus': 2, 'go': 2 };
                    let currentMaxPriority = 0;

                    for (const key in inputJson.accounts_info.accounts) {
                        const acc = inputJson.accounts_info.accounts[key].account;
                        const p = priorityMap[acc.plan_type] || 0;

                        if (p > currentMaxPriority) {
                            currentMaxPriority = p;
                            targetAccount = acc;
                        }
                    }
                }

                if (!targetAccount && inputJson.accounts_info.default) {
                    targetAccount = inputJson.accounts_info.default.account;
                }

                if (targetAccount) {
                    finalAccount = {
                        "id": targetAccount.account_id,
                        "planType": targetAccount.plan_type,
                        "structure": targetAccount.structure || "personal",
                        "organizationId": targetAccount.organization_id || null
                    };
                }
            }

            const restoredJson = {
                "user": {
                    "id": userId,
                    "email": email,
                    "idp": idp,
                    "iat": payload.iat,
                    "mfa": true,
                    "intercom_hash": null
                },
                "expires": new Date(payload.exp * 1000).toISOString(),
                "account": finalAccount,
                "accessToken": token,
                "authProvider": "openai",
                "rumViewTags": {
                    "light_account": { "fetched": false }
                }
            };

            navigator.clipboard.writeText(JSON.stringify(restoredJson, null, 2))
                .then(() => {
                    showToast("✅ 已还原并复制 (基于真实数据)！", 'green');
                    document.body.removeChild(overlay);
                })
                .catch(() => showToast("❌ 复制失败", 'error'));
        }));
        container.appendChild(createBtn(`⬅️ 返回上级菜单`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    // =========================================================================
    // 逻辑检测
    // =========================================================================
    function checkSubscriptionStatus(currentPlan, targetPlanName) {
        if (!currentPlan || currentPlan === 'free') return true;

        if (targetPlanName === 'chatgptplusplan') {
            if (currentPlan === 'plus') {
                alert("❌ 此账号已是 Plus 订阅用户，无需重复订阅。");
                return false;
            }
            if (currentPlan === 'pro') {
                alert("❌ 此账号已是 Pro 订阅用户 (等级高于Plus)，无需降级操作。");
                return false;
            }
            if (currentPlan === 'team') {
                return confirm("⚠️ 此账号是 Team (团队) 账户，你确定要为它开通个人 Plus 订阅吗？");
            }
        }

        if (targetPlanName === 'chatgptpro') {
            if (currentPlan === 'pro') {
                alert("❌ 此账号已是 Pro 订阅用户，无需重复订阅。");
                return false;
            }
            
            if (currentPlan === 'team') {
                return confirm("⚠️ 此账号是 Team (团队) 账户，你确定要为它开通个人 Pro 订阅吗？");
            }
        }

        return true;
    }

    function extractTokenAndPlan(inputVal) {
        if (!inputVal) return { token: null, plan: null };
        let token = null; let plan = null;
        try {
            const data = JSON.parse(inputVal);
            if (data.accessToken) {
                token = data.accessToken;
                if (data.account && data.account.planType) plan = data.account.planType;
            }
        } catch (e) {
            if (inputVal.length > 20 && !inputVal.includes(' ')) token = inputVal;
        }
        return { token, plan };
    }

    function showBillingOptions(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("选择账户数据来源"));
        container.appendChild(createBtn(`🤖 当前账号Token(自动)`, "btn-portal", async () => {
            document.body.removeChild(overlay);
            let token = var_TokenOnly;
            if (!token) { await preLoadAllData(true); token = var_TokenOnly; }
            if (!token) return showToast("❌ 未检测到登录状态 (请手动模式)", 'error');
            openBillingPortal(token);
        }));
        container.appendChild(createBtn(`✍️ 其他账号Token(手动)`, "btn-data", () => showBillingManualInput(container, overlay)));
        container.appendChild(createDivider(""));
        container.appendChild(createBtn(`⬅️ 返回上级菜单`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    // =========================================================================
    // 支付 / PRO 菜单逻辑
    // =========================================================================

    function showPayMenu(container, overlay, code, currency) {
        container.innerHTML = '';
        container.appendChild(createDivider(`选择 ${currency} 支付数据来源 (Plus)`));

        container.appendChild(createBtn(`🤖 Plus-当前账号Token(自动)`, "btn-pay", async () => {
            document.body.removeChild(overlay);
            if (!var_TokenOnly) await preLoadAllData(true);
            if (!var_TokenOnly) return showToast("❌ 未检测到登录状态 (请手动模式)", 'error');

            const currentPlan = var_FullJson?.account?.planType;
            if (!checkSubscriptionStatus(currentPlan, "chatgptplusplan")) return;

            handlePayAction(overlay, code, currency, var_TokenOnly, "chatgptplusplan");
        }));

        container.appendChild(createBtn(`✍️ Plus-其他账号Token(手动)`, "btn-data", () =>
            showPayManualInput(container, overlay, code, currency, "chatgptplusplan")
        ));

        container.appendChild(createBtn(`🚀 <span class="grad-top">GPT PRO 订阅入口</span>`, "btn-restore", () =>
            showProMenu(container, overlay, code, currency)
        ));

        container.appendChild(createDivider(""));
        container.appendChild(createBtn(`⬅️ 返回上级菜单`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    function showProMenu(container, overlay, code, currency) {
        container.innerHTML = '';
        container.appendChild(createDivider(`${currency} - GPT PRO 订阅`));

        container.appendChild(createBtn(`🤖 PRO-当前账号Token(自动)`, "btn-pay", async () => {
            document.body.removeChild(overlay);
            if (!var_TokenOnly) await preLoadAllData(true);
            if (!var_TokenOnly) return showToast("❌ 未检测到登录状态 (请手动模式)", 'error');

            const currentPlan = var_FullJson?.account?.planType;
            if (!checkSubscriptionStatus(currentPlan, "chatgptpro")) return;

            handlePayAction(overlay, code, currency, var_TokenOnly, "chatgptpro");
        }));

        container.appendChild(createBtn(`✍️ PRO-其他账号Token(手动)`, "btn-data", () =>
            showPayManualInput(container, overlay, code, currency, "chatgptpro")
        ));

        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => showPayMenu(container, overlay, code, currency)));
    }

    function showCancelMenu(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("取消订阅的账户来源"));
        container.appendChild(createBtn(`🤖 当前账号Token(自动)`, "btn-cancel", async () => {
            document.body.removeChild(overlay);
            if(!var_CancelData) await preLoadAllData();
            handleCancelSubscription();
        }));
        container.appendChild(createBtn(`✍️ 其他账号 Json (完整)`, "btn-data", () => showCancelManualInput(container, overlay)));
        container.appendChild(createDivider(""));
        container.appendChild(createBtn(`⬅️ 返回上级菜单`, "btn-back", () => buildMainMenu(container, overlay)));
    }

    function showBillingManualInput(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("请粘贴 JSON / Token 以获取账单链接"));
        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = '在此粘贴 JSON {"accessToken":...} \n或直接粘贴 Token 字符串 (ey...)';
        container.appendChild(textarea);
        container.appendChild(createBtn(`✅ 提取并跳转 (Submit)`, "btn-portal", () => {
            const rawVal = textarea.value.trim();
            const { token } = extractTokenAndPlan(rawVal);
            if (!token) return showToast("❌ 格式错误：请粘贴有效 JSON 或 Token", 'error');
            showToast(`✅ Token 提取成功! 跨域请求中……`, 'green');
            document.body.removeChild(overlay);
            openBillingPortal(token);
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => showBillingOptions(container, overlay)));
    }

    function showPayManualInput(container, overlay, code, currency, planName = "chatgptplusplan") {
        container.innerHTML = '';
        const titleType = planName === "chatgptpro" ? "PRO" : "Plus";
        container.appendChild(createDivider(`粘贴 Token 以获取 ${currency} (${titleType})`));

        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = '在此粘贴 JSON {"accessToken":...} \n或直接粘贴 Token 字符串 (ey...)';
        container.appendChild(textarea);

        container.appendChild(createBtn(`✅ 提取并跳转 (Submit)`, "btn-pay", () => {
            const rawVal = textarea.value.trim();
            const { token, plan } = extractTokenAndPlan(rawVal);
            if (!token) return showToast("❌ 格式错误：请粘贴有效 JSON 或 Token", 'error');

            if (!checkSubscriptionStatus(plan, planName)) return;

            showToast(`✅ Token 提取成功! 正在请求 ${titleType} 链接……`, 'green');
            document.body.removeChild(overlay);
            handlePayAction(overlay, code, currency, token, planName);
        }));

        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => {
            if (planName === "chatgptpro") {
                showProMenu(container, overlay, code, currency);
            } else {
                showPayMenu(container, overlay, code, currency);
            }
        }));
    }

    function showCancelManualInput(container, overlay) {
        container.innerHTML = '';
        container.appendChild(createDivider("请粘贴完整(含ID)JSON 以取消订阅"));
        const textarea = document.createElement('textarea');
        textarea.className = 'gpt-textarea';
        textarea.placeholder = '取消订阅必须完整Json……\n请粘贴完整 JSON:\n{"user": {...}, "accessToken": "..."}';
        container.appendChild(textarea);
        container.appendChild(createBtn(`🚫 提取并取消 (Submit)`, "btn-cancel", () => {
            const rawJson = textarea.value.trim();
            if (!rawJson) return showToast("❌ 内容不能为空", 'error');
            try {
                const data = JSON.parse(rawJson);
                const token = data.accessToken;
                const accountId = (data.account && data.account.id) ? data.account.id : (data.user && data.user.id ? data.user.id : null);
                if (!token) return showToast("❌ 缺失 accessToken", 'error');
                if (!accountId) return showToast("❌ 缺失 account.id 或 user.id", 'error');
                showToast(`✅ ID:${accountId} 提取成功!`, 'green');
                document.body.removeChild(overlay);
                handleCancelSubscription({ token: token, accountId: accountId });
            } catch (e) { showToast("❌ JSON 格式错误 (需完整JSON)", 'error'); }
        }));
        container.appendChild(createBtn(`⬅️ 返回`, "btn-back", () => showCancelMenu(container, overlay)));
    }

    function createLoadingWindow(loadingText) {
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><title>Please wait...</title><style>body{background-color:#212121;color:#e4e4e7;height:100vh;margin:0;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center;}h2{font-weight:400;margin-bottom:10px;}p{opacity:0.7;font-size:14px;}</style></head><body>${loadingText}</body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        return window.open(URL.createObjectURL(blob), '_blank');
    }

    function openBillingPortal(token) {
        const win = createLoadingWindow(`<h2>正在请求账单链接 (API)...</h2><p>如果长时间无响应，请关闭重试</p>`);
        if(!win) return showToast("❌ 请允许弹窗！", 'error');
        gmFetch(PORTAL_API_PATH, { headers: { "Authorization": "Bearer " + token } })
        .then(async r => {
            if (r.status === 401) { showToast("❌ Token 已失效 (401)", 'error'); win.close(); throw new Error("401"); }
            if (!r.ok) throw new Error(`HTTP Error ${r.status}`);
            return r.json();
        })
        .then(res => { if (res.url) win.location.href = res.url; else throw new Error("API OK but NO URL"); })
        .catch((err) => { if (err.message === "401") return; win.close(); showToast(`❌ 请求失败: ${err.message}`, 'error'); });
    }

    function handlePayAction(overlay, code, currency, explicitToken, planName = "chatgptplusplan") {
        const titleType = planName === "chatgptpro" ? "PRO" : "Plus";
        const win = createLoadingWindow(`<h2>正在获取 <span style="font-weight:bold;color:#fff;">${currency} ${titleType}</span> 支付链接...</h2>`);
        if (!win) return showToast("❌ 请允许弹窗！", 'error');
        if (!explicitToken) { win.close(); return showToast("❌ 获取 Token 失败", 'error'); }

        gmFetch(CHECKOUT_API_PATH, {
            method: "POST", headers: { "Authorization": "Bearer " + explicitToken, "Content-Type": "application/json" },
            body: JSON.stringify({ plan_name: planName, billing_details: { country: code, currency } })
        })
        .then(async r => { if (r.status === 401) { showToast("❌ Token 已失效 (401)", 'error'); win.close(); throw new Error("401"); } return r.json(); })
        .then(res => res.url ? win.location.href = res.url : win.close())
        .catch((err) => { if (err.message === "401") return; win.close(); showToast(`❌ 失败: ${err.message}`, 'error'); });
    }

    async function handleCancelSubscription(explicitData = null) {
        let data = explicitData;
        if (!data) { data = var_CancelData; if (!data) { await preLoadAllData(); data = var_CancelData; } }
        if (!data || !data.token || !data.accountId) return showToast("❌ 未检测到登录状态 (请手动模式)", 'error');
        showToast(`🚀 ID已获取：${data.accountId}...\n⏳ 正在发送取消请求,请稍候…… `, 'green', 0);
        try {
            const r = await gmFetch(CANCEL_API_PATH, {
                method: "POST", headers: { "Authorization": "Bearer " + data.token, "Content-Type": "application/json" },
                body: JSON.stringify({ account_id: data.accountId })
            });
            if (r.ok) { showToast("🎉 取消成功！若为当前账号则会刷新页面", 'green'); if (!explicitData && window.location.hostname.includes("chatgpt.com")) setTimeout(() => location.reload(), 2000); }
            else showToast(`❌ 取消失败 HTTP ${r.status}`, 'error');
        } catch (e) { showToast("❌ 取消失败：网络错误或Token失效", 'error'); }
    }

    function handleCopyToken(overlay) {
        const modal = document.querySelector('.gpt-tool-modal');
        if (overlay && modal) closeModalAnimate(overlay, modal);
        if (var_TokenOnly) navigator.clipboard.writeText(var_TokenOnly).then(() => showToast("✅ Token 已复制", 'green'));
        else preLoadAllData(true).then(() => { if(var_TokenOnly) navigator.clipboard.writeText(var_TokenOnly).then(() => showToast("✅ Token 已复制", 'green')); else showToast("❌ 未检测到登录状态", 'error'); });
    }

    function handleCopyFullJson(overlay) {
        const modal = document.querySelector('.gpt-tool-modal');
        if (overlay && modal) closeModalAnimate(overlay, modal);
        if (var_FullJson) navigator.clipboard.writeText(JSON.stringify(var_FullJson)).then(() => showToast("✅ JSON 已复制", 'green'));
        else preLoadAllData(true).then(() => { if(var_FullJson) navigator.clipboard.writeText(JSON.stringify(var_FullJson)).then(() => showToast("✅ JSON 已复制", 'green')); else showToast("❌ 未检测到登录状态", 'error'); });
    }

    function createDivider(text) { const div = document.createElement('div'); div.className = 'gpt-divider'; div.innerText = text; return div; }
    function createBtn(htmlContent, className, onClick) { const btn = document.createElement('button'); btn.className = `gpt-tool-btn ${className}`; btn.innerHTML = htmlContent; btn.onclick = onClick; return btn; }
    function showToast(text, styleType = 'normal', duration = 4000) {
        const existing = document.querySelector('.gpt-toast'); if (existing) existing.remove();
        const toast = document.createElement('div'); toast.className = 'gpt-toast';
        if (styleType === 'error') toast.classList.add('error'); if (styleType === 'green') toast.classList.add('success-green');
        if (duration === 0) toast.classList.add('loading');
        toast.innerText = text; document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        if (duration > 0) setTimeout(() => toast.remove(), duration);
    }
})();