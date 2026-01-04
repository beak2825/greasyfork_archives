// ==UserScript==
// @name         WordPress 自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动登录Wordpress
// @author       hausen1012
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529703/WordPress%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529703/WordPress%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🔍 WordPress 自动登录脚本已加载");

    const currentOrigin = window.location.origin;

    // Update config to store the selector per domain
    let config = {
        username: GM_getValue(`wp_username_${currentOrigin}`, ""),
        password: GM_getValue(`wp_password_${currentOrigin}`, ""),
        allowedDomains: GM_getValue("allowed_domains", "").split(","),
        loginButtonSelector: GM_getValue(`login_button_selector_${currentOrigin}`, "a[data-title='登入']") // Isolate by domain
    };

    // Modify createSettingsPanel to allow configuration per domain
    function createSettingsPanel() {
        let panel = document.createElement('div');
        panel.id = 'gm-settings-panel';
        panel.innerHTML =
            `<div class="gm-panel">
                <h2>WordPress 登录配置</h2>
                <p>配置说明：请确保网站填写正确。多个网站请用<strong>,</strong>分隔。</p>
                <label>当前网站: ${currentOrigin}</label>
                <label>允许的网站 (可直接复制上面):
                    <input id="gm-allowed-domains" type="text" value="${config.allowedDomains.join(',')}">
                </label>
                <label>用户名:
                    <input id="gm-username" type="text" value="${config.username}">
                </label>
                <label>密码:
                    <input id="gm-password" type="password" value="${config.password}">
                </label>
                <label>登录按钮选择器:
                    <input id="gm-login-button-selector" type="text" value="${config.loginButtonSelector}">
                </label>
                <button id="gm-save-settings">保存</button>
                <button id="gm-close-settings">关闭</button>
            </div>`;
        document.body.appendChild(panel);

        document.getElementById('gm-save-settings').addEventListener('click', () => {
            // Save each setting isolated per domain
            GM_setValue(`wp_username_${currentOrigin}`, document.getElementById('gm-username').value);
            GM_setValue(`wp_password_${currentOrigin}`, document.getElementById('gm-password').value);
            GM_setValue('allowed_domains', document.getElementById('gm-allowed-domains').value);
            GM_setValue(`login_button_selector_${currentOrigin}`, document.getElementById('gm-login-button-selector').value); // Save per site

            config.username = GM_getValue(`wp_username_${currentOrigin}`);
            config.password = GM_getValue(`wp_password_${currentOrigin}`);
            config.allowedDomains = GM_getValue('allowed_domains', "").split(",");
            config.loginButtonSelector = GM_getValue(`login_button_selector_${currentOrigin}`, "a[data-title='登入']"); // Load per site

            panel.remove();
            showSuccessMessage("配置已保存！刷新页面后生效。");
        });

        document.getElementById('gm-close-settings').addEventListener('click', () => {
            panel.remove();
        });

        GM_addStyle(
            `#gm-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                z-index: 10000;
            }
            .gm-panel h2 { margin: 0 0 10px; font-size: 18px; }
            .gm-panel label { display: block; margin-bottom: 10px; }
            .gm-panel input { width: 100%; padding: 5px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px; }
            .gm-panel button { margin-right: 10px; padding: 5px 10px; cursor: pointer; }`
        );
    }

    GM_registerMenuCommand("⚙️ 配置 WordPress 登录信息", createSettingsPanel);

    function isLoggedIn() {
        const loginButton = document.querySelector(config.loginButtonSelector); // Use domain-specific selector
        if (loginButton) {
            console.log("🔍 检测到未登录状态，存在登录按钮");
            return false;
        }
        console.log("🔍 未检测到登录标识，假定登录，防止浪费性能");
        return true;
    }

    function autoLogin() {
        if (isLoggedIn()) {
            console.log("✅ 已检测到登录状态，无需自动登录");
            return;
        }

        console.log("🚀 检测到未登录，尝试后台自动登录...");

        const currentPage = window.location.href;
        localStorage.setItem("redirectAfterLogin", currentPage);

        const loginUrl = `${currentOrigin}/wp-login.php`;
        const loginData = new URLSearchParams();
        loginData.append("log", config.username);
        loginData.append("pwd", config.password);
        loginData.append("rememberme", "forever");
        loginData.append("wp-submit", "登录");
        loginData.append("redirect_to", currentPage);
        loginData.append("testcookie", "1");

        fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: loginData.toString(),
            credentials: "same-origin"
        })
        .then(response => {
            if (response.ok) {
                console.log("✅ 登录成功！");
                const redirectUrl = localStorage.getItem("redirectAfterLogin");
                    let finalRedirectUrl = redirectUrl && !redirectUrl.includes("/wp-login")
                        ? redirectUrl
                        : `${currentOrigin}/wp-admin/`;

                console.log("✅ 重定向地址：", finalRedirectUrl);
                setTimeout(() => {
                    window.location.href = finalRedirectUrl;
                    localStorage.removeItem("redirectAfterLogin");
                }, 2000);
            } else {
                console.error("⚠️ 登录失败，检查用户名和密码！");
            }
        })
        .catch(error => {
            console.error("⚠️ 自动登录时发生错误:", error);
        });
    }

    function showSuccessMessage(message) {
        let successModal = document.createElement('div');
        successModal.id = 'success-modal';
        successModal.innerHTML =
            `<div class="success-modal-content">
                <p>${message}</p>
            </div>`;
        document.body.appendChild(successModal);

        GM_addStyle(
            `#success-modal {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 128, 0, 0.8);
                padding: 10px 20px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                font-size: 16px;
            }`
        );

        setTimeout(() => {
            let modal = document.getElementById('success-modal');
            if (modal) {
                modal.remove();
            }
        }, 3000);
    }

    window.addEventListener('load', function () {

        console.log("🔍 当前网站：", currentOrigin);
        console.log("🔍 允许的网站：", config.allowedDomains.join(", "));

        if (!config.allowedDomains.includes(currentOrigin)) {
            console.log(`⚠️ 当前网站不在允许的域名列表中，退出脚本`);
            return;
        }

        console.log("🔄 页面加载完成，执行自动登录");
        autoLogin();
    });

})();

