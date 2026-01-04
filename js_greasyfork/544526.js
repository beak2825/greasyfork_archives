// ==UserScript==
// @name      PyBrid Auto Converter
// @namespace PybridMagnetListener
// @version   4.0
// @description  Automatically convert magnet links through PyBrid
// @author       harryeffinpotter
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GPL-3.0-only
// @connect      *
// @connect      https://pydrive.harryeffingpotter.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544526/PyBrid%20Auto%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/544526/PyBrid%20Auto%20Converter.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    // Configuration
    const PYBRID_URL = 'https://pydrive.harryeffingpotter.com'; // UPDATE THIS WITH YOUR ACTUAL URL

    // Account management
    async function getCredentials() {
        const username = GM_getValue('pybrid_username', null);
        const password = GM_getValue('pybrid_password', null);
        return username && password ? { username, password } : null;
    }

    async function saveCredentials(username, password) {
        await GM_setValue('pybrid_username', username);
        await GM_setValue('pybrid_password', password);
    }

    async function promptForCredentials() {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Create modal
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
            `;

            modal.innerHTML = `
                <h2 style="margin: 0 0 20px 0; color: #333;">PyBrid Login Required</h2>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; color: #555;">Username:</label>
                    <input type="text" id="pybrid-username" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 16px;
                        box-sizing: border-box;
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; color: #555;">Password:</label>
                    <div style="position: relative;">
                        <input type="password" id="pybrid-password" style="
                            width: 100%;
                            padding: 10px;
                            padding-right: 40px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            font-size: 16px;
                            box-sizing: border-box;
                        ">
                        <button type="button" id="toggle-password" style="
                            position: absolute;
                            right: 10px;
                            top: 50%;
                            transform: translateY(-50%);
                            background: none;
                            border: none;
                            cursor: pointer;
                            padding: 5px;
                            color: #666;
                        ">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path id="eye-open" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle id="eye-pupil" cx="12" cy="12" r="3"></circle>
                                <path id="eye-closed" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" style="display: none;"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancel-btn" style="
                        padding: 10px 20px;
                        border: 1px solid #ddd;
                        background: white;
                        color: #666;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Cancel</button>
                    <button id="login-btn" style="
                        padding: 10px 20px;
                        border: none;
                        background: #5DADE2;
                        color: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Login</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Focus username field
            const usernameInput = modal.querySelector('#pybrid-username');
            const passwordInput = modal.querySelector('#pybrid-password');
            usernameInput.focus();

            // Toggle password visibility
            const toggleBtn = modal.querySelector('#toggle-password');
            const eyeOpen = modal.querySelector('#eye-open');
            const eyePupil = modal.querySelector('#eye-pupil');
            const eyeClosed = modal.querySelector('#eye-closed');

            toggleBtn.addEventListener('click', () => {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeOpen.style.display = 'none';
                    eyePupil.style.display = 'none';
                    eyeClosed.style.display = 'block';
                } else {
                    passwordInput.type = 'password';
                    eyeOpen.style.display = 'block';
                    eyePupil.style.display = 'block';
                    eyeClosed.style.display = 'none';
                }
            });

            // Handle login
            const handleLogin = async () => {
                const username = usernameInput.value.trim();
                const password = passwordInput.value;

                if (username && password) {
                    await saveCredentials(username, password);
                    document.body.removeChild(overlay);
                    resolve({ username, password });
                }
            };

            // Handle cancel
            const handleCancel = () => {
                document.body.removeChild(overlay);
                resolve(null);
            };

            // Button clicks
            modal.querySelector('#login-btn').addEventListener('click', handleLogin);
            modal.querySelector('#cancel-btn').addEventListener('click', handleCancel);

            // Enter key submits
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') passwordInput.focus();
            });
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleLogin();
            });

            // Escape key cancels
            overlay.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') handleCancel();
            });
        });
    }

    // Convert a magnet link
    async function convertMagnet(magnetUrl, retryCount = 0) {
        // Get saved credentials or prompt for them
        let credentials = await getCredentials();
        if (!credentials) {
            credentials = await promptForCredentials();
            if (!credentials) {
                alert('Cannot convert without login credentials.');
                return null;
            }
        }

        const formData = new FormData();
        formData.append('link_0', magnetUrl);
        formData.append('source', 'tampermonkey');
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${PYBRID_URL}/convert`,
                data: formData,
                onload: async function(response) {
                    if (response.status === 200 || response.status === 303) {
                        // Success - get the redirect URL
                        const redirectUrl = response.finalUrl || response.responseHeaders.match(/location: (.+)/i)?.[1];
                        if (redirectUrl) {
                            window.open(redirectUrl, '_blank');
                            resolve(true);
                        } else {
                            alert('Conversion succeeded but no redirect URL found');
                            resolve(false);
                        }
                    } else if (response.status === 401 && retryCount === 0) {
                        // Invalid credentials - clear and retry once
                        await GM_deleteValue('pybrid_username');
                        await GM_deleteValue('pybrid_password');
                        alert('Invalid username or password. Please login again.');
                        resolve(await convertMagnet(magnetUrl, 1));
                    } else if (response.status === 429) {
                        alert('Rate limit exceeded. Please wait a moment and try again.');
                        resolve(false);
                    } else {
                        alert(`Conversion failed: ${response.status}`);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('PyBrid conversion error:', error);
                    alert('Network error. This usually means:\n\n' +
                          '1. Tampermonkey blocked the connection\n' +
                          '2. Wrong PyBrid URL in script\n' +
                          '3. PyBrid server is down\n\n' +
                          'Check browser console (F12) for details.');
                    resolve(false);
                }
            });
        });
    }

    // Intercept all clicks
    function interceptClicks(e) {
        let target = e.target;

        // Check if clicked element or any parent is a link
        while (target && target !== document.body) {
            if (target.tagName === 'A' && target.href) {
                const href = target.href;

                // Check if it's a magnet link
                if (href.startsWith('magnet:')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // Convert the magnet link
                    convertMagnet(href);
                    return false;
                }
            }
            target = target.parentElement;
        }
    }

    // Set up interceptors as early as possible
    document.addEventListener('click', interceptClicks, true);

    // Also intercept dynamically added links
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // Check if it's a link or contains links
                    if (node.tagName === 'A' && node.href && node.href.startsWith('magnet:')) {
                        node.addEventListener('click', interceptClicks, true);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('a[href^="magnet:"]').forEach(link => {
                            link.addEventListener('click', interceptClicks, true);
                        });
                    }
                }
            });
        });
    });

    // Start observing when DOM is ready
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

})();
