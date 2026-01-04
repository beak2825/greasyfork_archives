// ==UserScript==
// @name         RoLocate
// @namespace    https://oqarshi.github.io/
// @version      44.5
// @description  Adds filter options to roblox server page. Alternative to paid extensions like RoPro, RoGold®, RoQol, and RoKit.
// @author       Oqarshi
// @match        https://www.roblox.com/*
// @license      Custom - Personal Use Only
// @icon         https://oqarshi.github.io/Invite/rolocate/assets/logo.svg
// @supportURL   https://greasyfork.org/en/scripts/523727-rolocate/feedback
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      https://update.greasyfork.org/scripts/535590/1586769/Rolocate%20Base64%20Image%20Library%2020.js
// @require      https://update.greasyfork.org/scripts/547134/1722939/Rolocate%20Server%20Region%20Data%20%28Data%20Saving%29.js
// @require      https://update.greasyfork.org/scripts/540553/1648593/Rolocate%20Flag%20Base64%20Data.js
// @require      https://update.greasyfork.org/scripts/544437/1642116/Rolocate%20Restore%20Classic%20Terms%20All%20Languages.js
// @connect      thumbnails.roblox.com
// @connect      games.roblox.com
// @connect      gamejoin.roblox.com
// @connect      presence.roblox.com
// @connect      www.roblox.com
// @connect      friends.roblox.com
// @connect      apis.roblox.com
// @connect      groups.roblox.com
// @connect      users.roblox.com
// @connect      catalog.roblox.com
// @downloadURL https://update.greasyfork.org/scripts/523727/RoLocate.user.js
// @updateURL https://update.greasyfork.org/scripts/523727/RoLocate.meta.js
// ==/UserScript==

/**
 * -- RoLocate Userscript --------------------------------
 * Author: Oqarshi
 * License: Custom - Personal Use Only
 * Copyright (c) 2025 Oqarshi
 *
 * This license grants limited rights to end users and does not imply
 * any transfer of copyright ownership.
 *
 * You MAY:
 *   * Use and modify this script for personal, non-commercial use only.
 *
 * You MAY NOT:
 *   * Redistribute or reupload this script (original or modified)
 *   ** Publish it on any website (GreasyFork, GitHub, UserScripts.org, etc.)
 *   * Include it in commercial, monetized, or donation-based tools
 *   * Remove or alter this license or attribution
 *
 * Attribution to the original author (Oqarshi) must always be preserved.
 * Violations may result in takedown notices under DMCA or applicable law.
 *
 * --- Dependencies --------------------------------------
 * * Base64 Images & Icons:
 *   https://update.greasyfork.org/scripts/535590/1586769/Rolocate%20Base64%20Image%20Library%2020.js
 *
 * * Server Regions Data:
 *   https://update.greasyfork.org/scripts/547134/1652105/Rolocate%20Server%20Region%20Data%20%28Data%20Saving%29.js
 *
 * * Flag Icons (Base64):
 *   https://update.greasyfork.org/scripts/540553/1648593/Rolocate%20Flag%20Base64%20Data.js
 *
 * * Classic Terms Replacements:
 *   https://update.greasyfork.org/scripts/544437/1642116/Rolocate%20Restore%20Classic%20Terms%20All%20Languages.js
 *
 * -------------------------------------------------------
 */

/*jshint esversion: 6 */
/*jshint esversion: 11 */
(function() {
    'use strict';


    //---------------XSS Attack Vectors Protection--------------------
    // ik this should be fixed, but roblox engineers are not the brightest...
    // so extra protection i guess.
    // escape the hmtl. Used in consolog function, notifications function, etc.
    const escapeHtmlnoxssattackvectors = (text) => {
        const temp = document.createElement('div');
        temp.textContent = text;
        return temp.innerHTML;
    };

    // for numbers. currently used in mutualfriends function
    const sanitizeUserId = (id) => {
        const numId = parseInt(id, 10);
        return (!isNaN(numId) && numId > 0) ? numId : 0; // return 0 install of null yea
    };

    // for attributes. currenltyy used in custombackgrounds function
    const sanitizeAttribute = (str) => {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    };

    // for hex value colors. currenltyy used in custombackgrounds function
    const sanitizeColor = (color) => {
        return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#ffffff';
    };

    // for css values like rgb and rgba. currenltyy used in custombackgrounds function
    const sanitizeCssValue = (value) => {
        const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/;
        const hexPattern = /^#[0-9A-Fa-f]{3,6}$/;
        return (rgbaPattern.test(value) || hexPattern.test(value)) ? value : 'rgba(40,40,40,0.85)';
    };
    //----------------------------------------------------------

    /*******************************************************
    name of function: ConsoleLogEnabled
    description: console.logs everything if settings is turned
    on
    *******************************************************/
    function ConsoleLogEnabled(...args) {
        if (localStorage.getItem("ROLOCATE_enableLogs") === "true") {
            escapeHtmlnoxssattackvectors(console.log("[ROLOCATE]", ...args)); // be safe
        }
    }

    /*******************************************************
    name of function: notifications
    description: notifications function (XSS-safe)
    *******************************************************/
    function notifications(message, type = 'info', emoji = '', duration = 3000) {
            if (localStorage.getItem('ROLOCATE_enablenotifications') !== 'true') return;

            if (!document.getElementById('toast-styles')) {
                const style = document.createElement('style');
                style.id = 'toast-styles';
                style.innerHTML = `
            @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
            @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
            @keyframes shrink { from { width: 100%; } to { width: 0%; } }

            #toast-container {
                position: fixed; top: 20px; right: 20px; z-index: 999999999999999999;
                display: flex; flex-direction: column; gap: 8px; pointer-events: none;
            }

            .toast {
                background: #2d2d2d; color: #e8e8e8; padding: 12px 16px; border-radius: 8px;
                font: 500 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                min-width: 280px; max-width: 400px; border: 1px solid rgba(255,255,255,0.15);
                box-shadow: 0 4px 12px rgba(0,0,0,0.25); animation: slideIn 0.3s ease-out;
                pointer-events: auto; position: relative; overflow: hidden; will-change: transform;
            }

            .toast.removing { animation: slideOut 0.3s ease-in forwards; }
            .toast:hover { background: #373737; }

            .toast-content { display: flex; align-items: center; gap: 10px; }
            .toast-icon { width: 16px; height: 16px; flex-shrink: 0; }
            .toast-emoji { font-size: 16px; flex-shrink: 0; }
            .toast-message { flex: 1; line-height: 1.4; white-space: pre-wrap; }

            .toast-close {
                position: absolute; top: 4px; right: 6px; width: 20px; height: 20px;
                cursor: pointer; opacity: 0.6; display: flex; align-items: center;
                justify-content: center; border-radius: 4px; transition: opacity 0.2s;
            }
            .toast-close:hover { opacity: 1; background: rgba(255,255,255,0.1); }
            .toast-close::before, .toast-close::after {
                content: ''; position: absolute; width: 10px; height: 1px; background: #ccc;
            }
            .toast-close::before { transform: rotate(45deg); }
            .toast-close::after { transform: rotate(-45deg); }

            .progress-bar {
                position: absolute; bottom: 0; left: 0; height: 2px;
                background: rgba(255,255,255,0.25); animation: shrink linear forwards;
            }

            .toast.success { border-left: 3px solid #4CAF50; }
            .toast.error { border-left: 3px solid #F44336; }
            .toast.warning { border-left: 3px solid #FF9800; }
            .toast.info { border-left: 3px solid #2196F3; }
            `;
                document.head.appendChild(style);
            }

            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            const validTypes = ['success', 'error', 'warning', 'info'];
            const safeType = validTypes.includes(type) ? type : 'info';
            toast.className = `toast ${safeType}`;

            const icons = {
                success: '<svg width="16" height="16" fill="none" stroke="#4CAF50" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
                error: '<svg width="16" height="16" fill="none" stroke="#F44336" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
                warning: '<svg width="16" height="16" fill="none" stroke="#FF9800" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>',
                info: '<svg width="16" height="16" fill="none" stroke="#2196F3" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
            };

            // escape the user input sduyhgads
            const safeMessage = escapeHtmlnoxssattackvectors(message);
            const safeEmoji = escapeHtmlnoxssattackvectors(emoji);

            toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icons[safeType]}</div>
                ${emoji ? `<span class="toast-emoji">${safeEmoji}</span>` : ''}
                <span class="toast-message">${safeMessage.replace(/\n/g, '<br>')}</span>
            </div>
            <div class="toast-close"></div>
            <div class="progress-bar" style="animation-duration: ${parseInt(duration)}ms;"></div>
        `;

            container.appendChild(toast);

            let timeout = setTimeout(removeToast, duration);
            const progressBar = toast.querySelector('.progress-bar');

            toast.addEventListener('mouseenter', () => {
                progressBar.style.animationPlayState = 'paused';
                clearTimeout(timeout);
            });

            toast.addEventListener('mouseleave', () => {
                progressBar.style.animationPlayState = 'running';
                const remaining = (progressBar.offsetWidth / toast.offsetWidth) * duration;
                timeout = setTimeout(removeToast, remaining);
            });

            toast.querySelector('.toast-close').addEventListener('click', removeToast);

            function removeToast() {
                clearTimeout(timeout);
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 300);
            }

            return {
                remove: removeToast,
                update: (newMessage) => {
                    const escaped = escapeHtmlnoxssattackvectors(newMessage);
                    toast.querySelector('.toast-message').innerHTML = escaped.replace(/\n/g, '<br>');
                },
                setType: (newType) => {
                    const validType = validTypes.includes(newType) ? newType : 'info';
                    toast.className = `toast ${validType}`;
                    toast.querySelector('.toast-icon').innerHTML = icons[validType];
                },
                setDuration: (newDuration) => {
                    clearTimeout(timeout);
                    const safeDuration = parseInt(newDuration);
                    progressBar.style.animation = `shrink ${safeDuration}ms linear forwards`;
                    timeout = setTimeout(removeToast, safeDuration);
                },
                updateEmoji: (newEmoji) => {
                    const emojiEl = toast.querySelector('.toast-emoji');
                    if (emojiEl) emojiEl.textContent = escapeHtmlnoxssattackvectors(newEmoji);
                }
            };
        }

    /*******************************************************
    name of function: Update_Popup
    description: basically update for every upodate
    *******************************************************/
    function Update_Popup() {

        const VERSION = "V44.5";
        const PREV_VERSION = "V44.4";

        const CHANGELOG = {
            Mobilemode: {
                title: "Mobile Mode",
                icon: "📱",
                subtitle: "Mobile Mode (Android Only)",
                description: "Note: Still very buggy. Mobile users can now use RoLocate on Mobile! Join Server Regions using your phone! A Video is available on how to do this is available here: https://www.youtube.com/watch?v=gz5SHAro08Q",
                badge: "New", // badges: New, Updated, Removed
                settings: [
                    { label: "Enabled by default", value: "False" },
                    { label: "Toggle Location", value: "Advanced Tab" },
                    { label: "Scope", value: "Roblox.com/*" }
                ]
            },
            Serverversions: {
                title: "Server Regions",
                icon: "🌐",
                subtitle: "Server Regions",
                description: "Fixed some servers being confused between the UK and Poland.",
                badge: "Updated", // badges: New, Updated, Removed
                settings: [
                    { label: "Enabled by default", value: "True" },
                    { label: "Toggle Location", value: "Advanced Tab" },
                    { label: "Scope", value: "Roblox.com/games/*" }
                ]
            },
            mutualfriends: {
                title: "Mutual Friends",
                icon: "😎",
                subtitle: "Mutual Friends",
                description: "Mutual Friends has been optimized so now it loads faster.",
                badge: "Updated", // badges: New, Updated, Removed
                settings: [
                    { label: "Enabled by default", value: "True" },
                    { label: "Toggle Location", value: "Extras Tab" },
                    { label: "Scope", value: "Roblox.com/users/*" }
                ]
            },
            securityupdate: {
                title: "Security Update",
                icon: "🛡️",
                subtitle: "Security Update",
                description: "Improved the xss attack vectors protection.",
                badge: "Updated", // badges: New, Updated, Removed
                settings: [
                    { label: "Always On (Cannot Disable)", value: "True" },
                    { label: "User Control", value: "Not Available" },
                    { label: "Applies To", value: "Roblox.com/*" }
                ]
            },
            autoserverregions: {
                title: "Auto Server Regions",
                icon: "🛜",
                subtitle: "Auto Server Regions",
                description: "Select how many servers to search. Customizable in settings.",
                badge: "Updated", // badges: New, Updated, Removed
                settings: [
                    { label: "Always On (Cannot Disable)", value: "True" },
                    { label: "User Control", value: "Not Available" },
                    { label: "Applies To", value: "Roblox.com/games/*" }
                ]
            },
        };

        const currentVersion = localStorage.getItem('version') || "V0.0";
        if (currentVersion === VERSION) return;
        localStorage.setItem('version', VERSION);
        if (localStorage.getItem(PREV_VERSION)) localStorage.removeItem(PREV_VERSION);

        const style = document.createElement('style'); // compact css in readablt format so it can save space.
        style.innerHTML = `
    .rup-popup {
        display: flex; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);
        justify-content: center; align-items: center; z-index: 1000; opacity: 0;
        animation: rup-fadeIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    }
    .rup-content {
        background: #2a2a2a; border-radius: 20px; padding: 0; width: 900px; max-width: 95%;
        max-height: 85vh; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
        border: 1px solid #404040; color: #e8e8e8; transform: scale(0.95);
        animation: rup-scaleUp 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
        position: relative; display: flex; flex-direction: column; will-change: transform;
    }
    .rup-header {
        padding: 24px 32px; border-bottom: 1px solid #404040; display: flex;
        align-items: center; gap: 16px; background: #1f1f1f; position: relative;
    }
    .rup-logo { width: 56px; height: 56px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); flex-shrink: 0; }
    .rup-header-content { flex: 1; }
    .rup-title {
        font-size: 24px; font-weight: 600; color: #ffffff; margin: 0 0 4px;
        letter-spacing: -0.5px;
    }
    .rup-version {
        display: inline-block; background: #1a1a1a; color: #ffffff; padding: 6px 12px;
        border-radius: 6px; font-size: 13px; font-weight: 500; border: 1px solid #404040;
    }
    .rup-main { display: flex; flex: 1; min-height: 0; }
    .rup-left {
        flex: 1; padding: 24px; border-right: 1px solid #404040;
        overflow-y: auto; background: #252525;
    }
    .rup-right {
        flex: 1; padding: 24px; overflow-y: auto; background: #2a2a2a;
        display: flex; flex-direction: column;
    }
    .rup-close {
        position: absolute; top: 16px; right: 16px; width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center; cursor: pointer;
        color: #888888; font-size: 18px; font-weight: 300; border-radius: 8px;
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        background: rgba(255, 255, 255, 0.05); border: 1px solid transparent; z-index: 10;
    }
    .rup-close:hover {
        color: #ffffff; background: rgba(255, 255, 255, 0.1);
        border-color: #555555; transform: rotate(90deg);
    }
    .rup-features-title {
        font-size: 18px; font-weight: 600; color: #ffffff; margin-bottom: 16px;
        display: flex; align-items: center; gap: 8px;
    }
    .rup-feature-item {
        margin-bottom: 12px; border-radius: 10px; overflow: hidden; border: 1px solid #404040;
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1); cursor: pointer;
    }
    .rup-feature-item:hover {
        border-color: #555555; background: #303030; transform: translateY(-2px);
    }
    .rup-feature-item.rup-active { border-color: #666666; background: #303030; }
    .rup-feature-header {
        display: flex; align-items: center; padding: 16px; background: #1f1f1f;
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1); user-select: none;
    }
    .rup-feature-item:hover .rup-feature-header { background: #2a2a2a; }
    .rup-feature-item.rup-active .rup-feature-header { background: #333333; }
    .rup-feature-icon {
        font-size: 20px; margin-right: 12px; min-width: 24px;
        transition: transform 0.3s ease;
    }
    .rup-feature-item:hover .rup-feature-icon { transform: scale(1.1); }
    .rup-feature-title { flex: 1; font-size: 15px; font-weight: 500; color: #ffffff; margin: 0; }
    .rup-feature-badge {
        background: #404040; color: #cccccc; padding: 4px 8px; border-radius: 4px;
        font-size: 11px; font-weight: 500; text-transform: uppercase;
        letter-spacing: 0.5px; transition: all 0.3s ease;
    }
    .rup-feature-item:hover .rup-feature-badge { transform: translateX(3px); }
    .rup-detail-panel {
        background: #1f1f1f; border-radius: 12px; padding: 24px; margin-bottom: 20px;
        border: 1px solid #404040; flex: 1; display: flex; flex-direction: column;
        opacity: 0; transform: translateY(15px);
        animation: rup-fadeInUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        will-change: transform, opacity;
    }
    .rup-detail-title {
        font-size: 20px; font-weight: 600; color: #ffffff; margin: 0 0 8px;
        display: flex; align-items: center; gap: 10px;
    }
    .rup-detail-subtitle {
        font-size: 13px; color: #999999; margin-bottom: 16px;
        text-transform: uppercase; letter-spacing: 0.5px;
    }
    .rup-detail-description {
        font-size: 14px; color: #cccccc; line-height: 1.6; margin-bottom: 16px; flex: 1;
    }
    .rup-detail-settings {
        padding: 16px; background: #252525; border-radius: 8px; border: 1px solid #404040; margin-top: auto;
    }
    .rup-setting-row {
        display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    }
    .rup-setting-row:last-child { margin-bottom: 0; }
    .rup-setting-label { font-size: 13px; color: #cccccc; font-weight: 500; }
    .rup-setting-value {
        font-size: 12px; color: #999999; padding: 4px 8px; background: #1a1a1a;
        border-radius: 4px; border: 1px solid #404040;
    }
    .rup-welcome-panel {
        text-align: center; padding: 40px 20px; color: #999999; display: flex;
        flex-direction: column; align-items: center; justify-content: center; height: 100%;
    }
    .rup-welcome-icon {
        font-size: 48px; margin-bottom: 16px; opacity: 0.5;
        animation: rup-float 4s ease-in-out infinite;
    }
    .rup-welcome-text { font-size: 16px; margin-bottom: 8px; }
    .rup-welcome-subtext { font-size: 13px; color: #666666; }
    .rup-developer-message {
        background: #1a1a1a; border-radius: 8px; padding: 16px; margin-bottom: 20px;
        border-left: 3px solid #555555; transition: all 0.4s ease;
    }
    .rup-developer-message:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }
    .rup-developer-message-title {
        font-weight: 600; color: #ffffff; margin-bottom: 8px; font-size: 14px;
    }
    .rup-developer-message-text { font-size: 13px; color: #cccccc; line-height: 1.5; }
    .rup-help-section {
        background: #1f1f1f; border-radius: 8px; padding: 16px; border: 1px solid #404040;
    }
    .rup-help-title { font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 12px; }
    .rup-help-link {
        color: #70a5ff; text-decoration: none; font-size: 13px; display: flex;
        align-items: center; gap: 8px; padding: 10px 12px; border-radius: 6px;
        transition: all 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
        background: rgba(112, 165, 255, 0.1); border: 1px solid rgba(112, 165, 255, 0.2);
    }
    .rup-help-link:hover {
        color: #ffffff; background: rgba(112, 165, 255, 0.2);
        border-color: rgba(112, 165, 255, 0.4); transform: translateY(-2px);
    }
    .rup-help-link-icon { font-size: 16px; transition: transform 0.3s ease; }
    .rup-help-link:hover .rup-help-link-icon { transform: translateY(-2px); }
    .rup-footer {
        padding: 16px 32px; border-top: 1px solid #404040; background: #1f1f1f; text-align: center;
    }
    .rup-note { font-size: 12px; color: #999999; margin: 0; }

    .rup-left::-webkit-scrollbar, .rup-right::-webkit-scrollbar { width: 6px; }
    .rup-left::-webkit-scrollbar-track, .rup-right::-webkit-scrollbar-track { background: #1a1a1a; }
    .rup-left::-webkit-scrollbar-thumb, .rup-right::-webkit-scrollbar-thumb {
        background: #555555; border-radius: 3px; transition: background 0.3s ease;
    }
    .rup-left::-webkit-scrollbar-thumb:hover, .rup-right::-webkit-scrollbar-thumb:hover {
        background: #666666;
    }

    @keyframes rup-fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes rup-fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes rup-scaleUp { 0% { transform: scale(0.95) translateY(10px); } 100% { transform: scale(1) translateY(0); } }
    @keyframes rup-scaleDown { from { transform: scale(1); } to { transform: scale(0.9); opacity: 0; } }
    @keyframes rup-fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes rup-float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

    @media (max-width: 768px) {
        .rup-content { width: 95%; flex-direction: column; }
        .rup-main { flex-direction: column; }
        .rup-left, .rup-right { flex: none; }
        .rup-left { border-right: none; border-bottom: 1px solid #404040; }
    }
    `;
        document.head.appendChild(style);

        const popupHTML = `
            <div class="rup-popup">
                <div class="rup-content">
                    <div class="rup-header">
                        <img class="rup-logo" src="${window.Base64Images.logo}" alt="Rolocate Logo">
                        <div class="rup-header-content">
                            <h1 class="rup-title">Rolocate Update</h1>
                            <div class="rup-version">${VERSION}</div>
                        </div>
                        <span class="rup-close">&times;</span>
                    </div>

                    <div class="rup-main">
                        <div class="rup-left">
                            <div class="rup-developer-message">
                                <div class="rup-developer-message-title">From Oqarshi:</div>
                                <div class="rup-developer-message-text">Please report any issues on GreasyFork if something breaks! Thank you! RoLocate is designed to be used with Roblox's dark mode or dark theme.</div>
                            </div>
                            <div class="rup-features-title">✨${VERSION}🚀</div>
                            ${Object.entries(CHANGELOG).map(([key, feat]) => `
                            <div class="rup-feature-item" data-feature="${key}">
                                <div class="rup-feature-header">
                                    <span class="rup-feature-icon">${feat.icon}</span>
                                    <div class="rup-feature-title">${feat.title}</div>
                                    <span class="rup-feature-badge">${feat.badge}</span>
                                </div>
                            </div>
                            `).join('')}
                        </div>

                        <div class="rup-right">
                            <div class="rup-welcome-panel" id="rup-welcome-panel">
                                <div class="rup-welcome-icon">🚀</div>
                                <div class="rup-welcome-text">Select a feature to learn more</div>
                                <div class="rup-welcome-subtext">Click on any feature from the left to see detailed information</div>
                            </div>

                            <div class="rup-detail-panel" id="rup-detail-panel" style="display: none;"></div>

                            <div class="rup-help-section">
                                <div class="rup-help-title">Need Help?</div>
                                <a href="https://oqarshi.github.io/Invite/rolocate/docs/" target="_blank" class="rup-help-link">
                                    <span class="rup-help-link-icon">📖</span>
                                    <span>Documentation</span>
                                </a>
                                <a>&nbsp;</a>
                                <a href="https://greasyfork.org/en/scripts/523727-rolocate/feedback" target="_blank" class="rup-help-link">
                                    <span class="rup-help-link-icon">🛡️</span>
                                    <span>Greasyfork Support</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="rup-footer">
                        <p class="rup-note">This notification will not appear again until the next version release.</p>
                    </div>
                </div>
            </div>
        `;

        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = popupHTML;
        document.body.appendChild(popupContainer);

        const closeButton = popupContainer.querySelector('.rup-close');
        const popup = popupContainer.querySelector('.rup-popup');
        const featureItems = popupContainer.querySelectorAll('.rup-feature-item');
        const welcomePanel = popupContainer.querySelector('#rup-welcome-panel');
        const detailPanel = popupContainer.querySelector('#rup-detail-panel');

        featureItems.forEach(item => {
            item.addEventListener('click', () => {
                featureItems.forEach(i => i.classList.remove('rup-active'));
                item.classList.add('rup-active');

                const key = item.dataset.feature;
                const feat = CHANGELOG[key];

                if (feat) {
                    welcomePanel.style.display = 'none';
                    detailPanel.style.display = 'flex';

                    detailPanel.classList.remove('rup-detail-panel');
                    void detailPanel.offsetWidth;
                    detailPanel.classList.add('rup-detail-panel');

                    detailPanel.innerHTML = `
                        <div class="rup-detail-title">
                            <span>${feat.icon}</span>
                            <span>${feat.title}</span>
                        </div>
                        <div class="rup-detail-subtitle">${feat.subtitle.replace(/\n/g, '<br>')}</div>
                        <div class="rup-detail-description">${feat.description.replace(/\\n/g, '<br>')}</div>
                        <div class="rup-detail-settings">
                            ${feat.settings.map(setting => `
                                <div class="rup-setting-row">
                                    <span class="rup-setting-label">${setting.label}:</span>
                                    <span class="rup-setting-value">${setting.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            });
        });

        closeButton.addEventListener('click', () => {
            popup.style.animation = 'rup-fadeOut 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards';
            popup.querySelector('.rup-content').style.animation = 'rup-scaleDown 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards';
            setTimeout(() => {
                popup.parentNode.removeChild(popup);
                document.body.appendChild(document.createRange().createContextualFragment(`
                    <style>
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes slideIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                    </style>
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease-out;">
                        <div style="background: #1a1c23; padding: 35px; border-radius: 16px; max-width: 420px; text-align: center; color: #fff; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5); animation: slideIn 0.3s ease-out;">
                            <h3 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #f8f9fa;">RoLocate</h3>
                            <p style="margin: 0 0 28px 0; font-size: 16px; line-height: 1.5; color: #e9ecef;">RoLocate needs to refresh the page to enable some features.</p>
                            <button onclick="this.style.transform='scale(0.95)';setTimeout(()=>location.reload(),100)" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'" style="background: #2563eb; color: #fff; border: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; transform: scale(1);">Refresh Now</button>
                        </div>
                    </div>
                `));
            }, 300);
        });
    }


    const defaultSettings = {
        enableLogs: false, // disabled by default
        removeads: true, // enabled by default
        togglefilterserversbutton: true, // enable by default
        toggleserverhopbutton: true, // enable by default
        AutoRunServerRegions: false, // disabled by default
        ShowOldGreeting: true, // enabled by default
        togglerecentserverbutton: true, // enable by default
        prioritylocation: "automatic", // automatic by default
        fastservers: false, // enabled by default
        invertplayercount: false, // disabled by default
        enablenotifications: true, // enabled by default
        disabletrailer: true, // enabled by default
        gamequalityfilter: false, // disabled by default
        mutualfriends: true, // enabled by default
        disablechat: false, // disabled by default
        smartsearch: true, // enabled by default
        quicklaunchgames: true, // enabled by default
        smartjoinpopup: true, // enabled by default
        betterfriends: true, // enabled by default
        restoreclassicterms: true, // enabled by default
        compactprivateservers: true, // enabled by default
        custombackgrounds: false, // disabled by default
        btrobloxfix: false, // disabled by default
        mobilemode: false // disabled by default
    };

    const presetConfigurations = {
        default: {
            name: "Default",
            settings: {
                enableLogs: false,
                removeads: true,
                togglefilterserversbutton: true,
                toggleserverhopbutton: true,
                AutoRunServerRegions: false,
                ShowOldGreeting: true,
                togglerecentserverbutton: true,
                prioritylocation: "automatic",
                fastservers: false,
                invertplayercount: false,
                enablenotifications: true,
                disabletrailer: true,
                gamequalityfilter: false,
                mutualfriends: true,
                disablechat: false,
                smartsearch: true,
                quicklaunchgames: true,
                smartjoinpopup: true,
                betterfriends: true,
                restoreclassicterms: true,
                compactprivateservers: true,
                custombackgrounds: false,
                btrobloxfix: false,
                mobilemode: false
            }
        },
        mobilesettings: {
            name: "Mobile Settings",
            settings: {
                enableLogs: false,
                removeads: true,
                togglefilterserversbutton: true,
                toggleserverhopbutton: true,
                AutoRunServerRegions: false,
                ShowOldGreeting: true,
                togglerecentserverbutton: false,
                prioritylocation: "automatic",
                fastservers: true,
                invertplayercount: false,
                enablenotifications: true,
                disabletrailer: true,
                gamequalityfilter: false,
                mutualfriends: false,
                disablechat: true,
                smartsearch: false,
                quicklaunchgames: true,
                smartjoinpopup: false,
                betterfriends: true,
                restoreclassicterms: true,
                compactprivateservers: true,
                custombackgrounds: false,
                btrobloxfix: false,
                mobilemode: true
            }
        },
        developerpref: {
            name: "Developer Preference",
            settings: {
                enableLogs: true,
                removeads: true,
                togglefilterserversbutton: true,
                toggleserverhopbutton: true,
                AutoRunServerRegions: false,
                ShowOldGreeting: true,
                togglerecentserverbutton: true,
                prioritylocation: "automatic",
                fastservers: true,
                invertplayercount: false,
                enablenotifications: true,
                disabletrailer: true,
                gamequalityfilter: false,
                mutualfriends: true,
                disablechat: true,
                smartsearch: true,
                quicklaunchgames: true,
                smartjoinpopup: true,
                betterfriends: true,
                restoreclassicterms: true,
                compactprivateservers: true,
                custombackgrounds: false,
                btrobloxfix: false,
                mobilemode: false
            }
        },
        disablerolocate: {
            name: "Disable RoLocate",
            settings: {
                enableLogs: false,
                removeads: false,
                togglefilterserversbutton: false,
                toggleserverhopbutton: false,
                AutoRunServerRegions: false,
                ShowOldGreeting: false,
                togglerecentserverbutton: false,
                prioritylocation: "automatic",
                fastservers: false,
                invertplayercount: false,
                enablenotifications: true, // ik its suppose to turn off evyerhitng but its for confirmation
                disabletrailer: false,
                gamequalityfilter: false,
                mutualfriends: false,
                disablechat: false,
                smartsearch: false,
                quicklaunchgames: false,
                smartjoinpopup: false,
                betterfriends: false,
                restoreclassicterms: false,
                compactprivateservers: false,
                custombackgrounds: false,
                btrobloxfix: false,
                mobilemode: false
            }
        }
    };

    function initializeLocalStorage() {
        // this loops through the settings and if they dont exist then add them
        Object.entries(defaultSettings).forEach(([key, value]) => {
            const storageKey = `ROLOCATE_${key}`;
            if (localStorage.getItem(storageKey) === null) {
                localStorage.setItem(storageKey, value);
            }
        });
    }


    /*******************************************************
    name of function: initializeCoordinatesStorage
    description: finds coordinates
    *******************************************************/
    function initializeCoordinatesStorage() {
        // coors alredyt in there
        try {
            const storedCoords = GM_getValue("ROLOCATE_coordinates");
            if (!storedCoords) {
                // make empty
                GM_setValue("ROLOCATE_coordinates", JSON.stringify({
                    lat: "",
                    lng: ""
                }));
            } else {
                // yea
                const parsedCoords = JSON.parse(storedCoords);
                if ((!parsedCoords.lat || !parsedCoords.lng) && localStorage.getItem("ROLOCATE_prioritylocation") === "manual") {
                    // if manual mode but no coordinates, revert to automatic
                    localStorage.setItem("ROLOCATE_prioritylocation", "automatic");
                }
            }
        } catch (e) {
            ConsoleLogEnabled("Error initializing coordinates storage:", e);
            // used like the userscript manager storage (cannot be accessed by other extensions) to store coordinates.
            GM_setValue("ROLOCATE_coordinates", JSON.stringify({
                lat: "",
                lng: ""
            }));
        }
    }

    /*******************************************************
    name of function: getSettingsContent
    description: adds section to settings page
    *******************************************************/
    function getSettingsContent(section) {
        if (section === "home") {
            return `
        <div class="home-section">
            <img class="rolocate-logo" src="${window.Base64Images.logo}" alt="ROLOCATE Logo">
            <div class="version">Rolocate: Version 44.5</div>
            <div class="section-separator"></div>
            <p>Rolocate by Oqarshi.</p>
            <p class="license-note">
                Licensed under a <strong>Custom License – Personal Use Only</strong>. No redistribution.
            </p>
        </div>
    `;
        }


        if (section === "presets") {
            return `
                <div class="presets-section">
                    <div class="presets-actions">
                        <button id="export-settings" class="preset-btn export-btn">📤 Export Settings</button>
                        <button id="import-settings" class="preset-btn import-btn">📥 Import Settings</button>
                        <input type="file" id="import-file" accept=".json" style="display: none;">
                    </div>
                    <div class="section-separator"></div>
                    <p>Overwhelmed by the number of features? Pick a preset right here!</p>
                    <div class="section-separator"></div>
                    <h3 class="grayish-center">Built-in Presets</h3>
                    <div class="presets-grid">
                        <div class="preset-card" data-preset="default">
                            <h4>🛠️ Default</h4>
                            <p>Default settings that RoLocate comes with.</p>
                        </div>
                        <div class="preset-card" data-preset="mobilesettings">
                            <h4>📱 Mobile Settings</h4>
                            <p>Optimized for Mobile Users.</p>
                        </div>
                        <div class="preset-card" data-preset="developerpref">
                            <h4>👑 Dev Settings</h4>
                            <p>Settings used by the developer Oqarshi.</p>
                        </div>
                        <div class="preset-card" data-preset="disablerolocate">
                            <h4>🚫 RoLocate Off </h4>
                            <p>Turns off all settings.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        if (section === "appearance") {
            return `
        <div class="appearance-section">

            <label class="toggle-slider">
                <input type="checkbox" id="disabletrailer">
                <span class="slider"></span>
                Disable Trailer Autoplay
                <span class="help-icon" data-help="Disable Trailer Autoplay">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="smartjoinpopup">
                <span class="slider"></span>
                Smart Join Popup
                <span class="help-icon" data-help="Smart Join Popup">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="removeads">
                <span class="slider"></span>
                Remove All Roblox Ads
                <button id="edit-removeads-btn" class="edit-button" type="button" style="display: none;">Edit</button>
                <span class="help-icon" data-help="Remove All Roblox Ads">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="restoreclassicterms">
                <span class="slider"></span>
                Restore Classic Terms
                <span class="help-icon" data-help="Restore Classic Terms">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="compactprivateservers">
                <span class="slider"></span>
                Compact Private Servers
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Compact Private Servers">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="custombackgrounds">
                <span class="slider"></span>
                Custom Backgrounds
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <button id="edit-backgrounds-btn" class="edit-button" type="button" style="display: none;">Edit</button>
                <span class="help-icon" data-help="Backgrounds">?</span>
            </label>
        </div>
    `;
        }

        if (section === "advanced") {
            return `
        <div class="advanced-section">
            <span class="warning_advanced">For Experienced Users Only🧠🙃</span>
            <div class="section-separator"></div>

            <label class="toggle-slider">
                <input type="checkbox" id="enableLogs">
                <span class="slider"></span>
                Enable Console Logs
                <span class="help-icon" data-help="Enable Console Logs">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="togglefilterserversbutton">
                <span class="slider"></span>
                Enable Server Filters
                <span class="help-icon" data-help="Enable Server Filters">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="toggleserverhopbutton">
                <span class="slider"></span>
                Enable Server Hop Button
                <span class="help-icon" data-help="Enable Server Hop Button">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="enablenotifications">
                <span class="slider"></span>
                Enable Notifications
                <span class="help-icon" data-help="Enable Notifications">?</span>
            </label>

            <label class="toggle-slider">
                <input type="checkbox" id="btrobloxfix">
                <span class="slider"></span>
                Fix BTRoblox Compatability
                <span class="help-icon" data-help="Fix BTRoblox">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="mobilemode">
                <span class="slider"></span>
                Mobile Mode
                <a href="https://www.youtube.com/watch?v=gz5SHAro08Q" target="_blank" style="margin-left:8px;color:#4CAF50;text-decoration:underline;cursor:pointer;font-weight:bold;">Video</a>
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <a href="https://example.com/help/mobile-mode" target="_blank" class="help-icon" data-help="Mobile Mode">?</a>
            </label>


            <div class="location-settings">
                <div class="setting-header">
                    <span>Set Default Location Mode</span>
                    <span class="help-icon" data-help="Set default location">?</span>
                </div>

                <select id="prioritylocation-select">
                    <option value="manual" style="color: rgb(255, 40, 40);">Manual</option>
                    <option value="automatic" style="color: rgb(255, 40, 40);">Automatic</option>
                </select>

                <div id="location-hint">
                    <strong>Manual:</strong> Set your location manually below
                    <strong>Automatic:</strong> Auto detect your device's location
                </div>

                <div id="manual-coordinates" style="margin-top: 15px; display: none;">
                    <div class="coordinates-inputs" style="display: flex; gap: 10px; margin-bottom: 12px;">
                        <div style="flex: 1;">
                            <label for="latitude" style="display: block; margin-bottom: 8px; font-size: 14px;">Latitude</label>
                            <input type="text" id="latitude" placeholder="e.g. 34.0549"
                                style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);; background: rgba(255,255,255,0.05); color: #e0e0e0;">
                        </div>
                        <div style="flex: 1;">
                            <label for="longitude" style="display: block; margin-bottom: 8px; font-size: 14px;">Longitude</label>
                            <input type="text" id="longitude" placeholder="e.g. -118.2426"
                                style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);; background: rgba(255,255,255,0.05); color: #e0e0e0;">
                        </div>
                    </div>
                    <button id="save-coordinates" class="edit-nav-button" style="width: 100%; margin-top: 8px;">
                        Save Coordinates
                    </button>
                    <div class="hint-text" style="margin-top: 12px; font-size: 13px; color: #a0a0a0;">
                        Enter your location's decimal coordinates, or if you're not comfortable sharing them, use the nearest Roblox server coordinates (e.g., Los Angeles: 34.0549, -118.2426).
                    </div>
                </div>
            </div>
        </div>
    `;
        }




        if (section === "extras") {
            return `
        <div class="extras-section">

            <span class="extras_section">Features that might be useful!</span>

            <label class="toggle-slider">
                <input type="checkbox" id="gamequalityfilter">
                <span class="slider"></span>
                Game Quality Filter
                <button id="edit-gamequality-btn" class="edit-button" type="button" style="display: none;">Edit</button>
                <span class="help-icon" data-help="Game Quality Filter">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="mutualfriends">
                <span class="slider"></span>
                Mutual Friends
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Enable Mutual Friends">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="disablechat">
                <span class="slider"></span>
                Disable Chat
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Disable Chat">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="quicklaunchgames">
                <span class="slider"></span>
                Quick Launch Games
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Quick Launch Games">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="ShowOldGreeting">
                <span class="slider"></span>
                Show Old Greeting
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Show Old Greeting">?</span>
            </label>

            <label class="toggle-slider new_label">
                <input type="checkbox" id="betterfriends">
                <span class="slider"></span>
                Better Friends
                <span class="new">New
                    <span class="tooltip">Just Released/Updated</span>
                </span>
                <span class="help-icon" data-help="Better Friends">?</span>
            </label>

        </div>
    `;
        }


        if (section === "about") {
            return `
        <div class="about-section">
            <h3 class="grayish-center">Credits</h3>
            <p>This project was created by:</p>
            <ul>
                <li><strong>Developer:</strong> <a href="https://www.roblox.com/users/545334824/profile" target="_blank">Oqarshi</a></li>
                <li><strong>Rolocate Source Code:</strong> <a href="https://greasyfork.org/en/scripts/523727-rolocate/code" target="_blank">GreasyFork</a></li>
                <li><strong>Invite & FAQ Source Code:</strong> <a href="https://github.com/Oqarshi/Invite" target="_blank">GitHub</a></li>
                <li><strong>Official Website:</strong> <a href="https://oqarshi.github.io/Invite/rolocate/index.html" target="_blank">RoLocate Website</a></li>
                <li><strong>Suggest or Report Issues:</strong> <a href="https://greasyfork.org/en/scripts/523727-rolocate/feedback" target="_blank">Submit Feedback</a></li>
                <li><strong>Inspiration:</strong> <a href="https://chromewebstore.google.com/detail/btroblox-making-roblox-be/hbkpclpemjeibhioopcebchdmohaieln" target="_blank">Btroblox Team</a></li>
            </ul>
        </div>
    `;
        }

        if (section === "help") {
            return `
        <div class="help-section">
            <div class="section-separator"></div>
            <h3 class="grayish-center">⚙️ General Tab</h3>
            <ul>
                <li id="help-Smart Search"><strong>SmartSearch:</strong> <span>Improves the Roblox website’s search bar by enabling instant searches for games, users, and groups.</span></li>
                <li id="help-Auto Server Regions"><strong>Auto Server Regions:</strong> <span>Replaces Roblox's 8 default servers with at least 8 servers, providing detailed info such as location and ping.</span></li>
                <li id="help-Fast Server Search"><strong>Fast Server Search:</strong> <span>Boosts server search speed up to 100x (experimental). Replaces player thumbnails with Builderman/Roblox icons to bypass rate limits.</span></li>
                <li id="help-Invert Player Count"><strong>Invert Player Count:</strong> <span>For server regions: shows low-player servers when enabled, high-player servers when disabled. You can also control this on the Roblox server popup.</span></li>
                <li id="help-Recent Servers"><strong>Recent Servers:</strong> <span>Shows the most recent servers you have joined in the past 3 days.</span></li>
            </ul>

            <div class="section-separator"></div>

            <h3 class="grayish-center">🎨 Appearance Tab</h3>
            <ul>
                <li id="help-Disable Trailer Autoplay"><strong>Disable Trailer Autoplay:</strong> <span>Prevents trailers from autoplaying on Roblox game pages.</span></li>
                <li id="help-Smart Join Popup"><strong>Smart Join Popup:</strong> <span>Shows a custom join popup that displays server location about the server before joining it.</span></li>
                <li id="help-Remove All Roblox Ads"><strong>Remove All Roblox Ads:</strong> <span>Blocks most ads on the Roblox site.</span></li>
                <li id="help-Restore Classic Terms"><strong>Restore Classic Terms:</strong> <span>Reverts corporate buzzwords Roblox has added. Example: “Connections” becomes “Friends”. May not be translated into all languages yet.</span></li>
                <li id="help-Compact Private Servers"><strong>Compact Private Servers:</strong> <span>Compacts private servers on game pages, so that they do not take up so much space.</span></li>
                <li id="help-Backgrounds"><strong>Backgrounds:</strong> <span>Allows you to change the background of your roblox page and customize the colors of other stuff on the page.</span></li>
            </ul>

            <div class="section-separator"></div>

            <h3 class="grayish-center">🚀 Advanced Tab</h3>
            <ul>
                <li id="help-Enable Console Logs"><strong>Enable Console Logs:</strong> <span>Enables console.log messages from the script.</span></li>
                <li id="help-Enable Server Filters"><strong>Enable Server Filters:</strong> <span>Enables server filter features on the game page.</span></li>
                <li id="help-Enable Server Hop Button"><strong>Enable Server Hop Button:</strong> <span>Enables server hop feature on the game page.</span></li>
                <li id="help-Enable Notifications"><strong>Enable Notifications:</strong> <span>Enables helpful notifications from the script.</span></li>
                <li id="help-Fix BTRoblox"><strong>Fix Btroblox Compatability:</strong> <span>Uses alternative methods to make the script compatible with BTRoblox.</span></li>
                <li id="help-Mobile Mode"><strong>Mobile Mode:</strong> <span>Allows you to join server regions on mobile devices.</span></li>
                <li id="help-Set default location"><strong>Set default location:</strong> <span>Enables the user to set a default location for Roblox server regions. Turn this on if the script cannot automatically detect your location.</span></li>
            </ul>

            <h3 class="grayish-center">✨ Extra Tab</h3>
            <ul>
                <li id="help-Game Quality Filter"><strong>Game Quality Filter:</strong> <span>Removes games from the charts/discover page based on your settings.</span></li>
                <li id="help-Enable Mutual Friends"><strong>Mutual Friends:</strong> <span>Displays friends you share with a certain person on their profile page.</span></li>
                <li id="help-Disable Chat"><strong>Disable Chat:</strong> <span>Disables the chat feature on the roblox website.</span></li>
                <li id="help-Quick Launch Games"><strong>Quick Launch Games:</strong> <span>Adds the ability to quickly launch your favorite games from the homepage.</span></li>
                <li id="help-Show Old Greeting"><strong>Show Old Greeting:</strong> <span>Shows the old greeting Roblox had on their home page.</span></li>
                <li id="help-Better Friends"><strong>Better Friends:</strong> <span>Improves the look of the friends section on the homepage and adds Best Friends option.</span></li>
            </ul>
            <div class="section-separator"></div>
            <h3 class="grayish-center">Need more help?</h3>
            <li>
              For help, see the
              <a href="https://oqarshi.github.io/Invite/rolocate/docs/#troubleshooting" target="_blank" class="about-link">troubleshooting</a>
              page or report an issue on
              <a href="https://greasyfork.org/en/scripts/523727-rolocate/feedback" target="_blank" class="about-link">GreasyFork</a>.
            </li>
        </div>
    `;
        }

        // general tab which is the default
        return `
    <div class="general-section">

        <label class="toggle-slider new_label">
            <input type="checkbox" id="smartsearch">
            <span class="slider"></span>
            SmartSearch
            <span class="new">New
                <span class="tooltip">Just Released/Updated</span>
            </span>
            <span class="help-icon" data-help="Smart Search">?</span>
        </label>

        <label class="toggle-slider">
            <input type="checkbox" id="AutoRunServerRegions">
            <span class="slider"></span>
            Auto Server Regions
            <button id="edit-autoserverregionsbutton-btn" class="edit-button" type="button" style="display: none;">Edit</button>
            <span class="help-icon" data-help="Auto Server Regions">?</span>
        </label>

        <label class="toggle-slider experiment_label">
            <input type="checkbox" id="fastservers">
            <span class="slider"></span>
            Fast Server Search
            <span class="experimental">Experimental
                <span class="tooltip">Still being tested</span>
            </span>
            <span class="help-icon" data-help="Fast Server Search">?</span>
        </label>

        <label class="toggle-slider">
            <input type="checkbox" id="invertplayercount">
            <span class="slider"></span>
            Invert Player Count
            <span class="help-icon" data-help="Invert Player Count">?</span>
        </label>

        <label class="toggle-slider">
            <input type="checkbox" id="togglerecentserverbutton">
            <span class="slider"></span>
            Recent Servers
            <span class="help-icon" data-help="Recent Servers">?</span>
        </label>
    </div>
`;
    }



    /*******************************************************
    name of function: openSettingsMenu
    description: opens setting menu and makes it look good
    *******************************************************/
    function openSettingsMenu() {
        if (document.getElementById("userscript-settings-menu")) return;
        // storage make go uyea
        initializeLocalStorage();
        initializeCoordinatesStorage();
        const overlay = document.createElement("div");
        overlay.id = "userscript-settings-menu";
        overlay.innerHTML = `
    <div class="settings-container">
        <button id="close-settings">✖</button>
        <div class="settings-sidebar">
            <h2>RoLocate</h2>
            <ul>
                <li class="active" data-section="home">🏠 Home</li>
                <li data-section="presets">🧩 Presets</li>
                <li class="section-divider"></li>
                <li data-section="general">⚙️ General</li>
                <li data-section="appearance">🎨 Appearance</li>
                <li data-section="advanced">🧠 Advanced</li>
                <li data-section="extras">✨ Extras</li>
                <li class="section-divider"></li>
                <li data-section="help">❓ Help</li>
                <li data-section="about">📘 About</li>
            </ul>
        </div>
        <div class="settings-content">
            <h2 id="settings-title">Home</h2>
            <div id="settings-body" class="animated-content">${getSettingsContent("home")}</div>
        </div>
    </div>
    `;
        document.body.appendChild(overlay);
        // put css in
        const style = document.createElement("style");
        style.textContent = `
.presets-section {
    text-align: center;
}
.presets-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 20px;
}
.preset-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}
.export-btn {
    background: #4CAF50;
    color: white;
}
.export-btn:hover {
    background: #45a049;
    transform: translateY(-2px);
}
.import-btn {
    background: #dc3545;
    color: white;
}
.import-btn:hover {
    background: #c82333;
    transform: translateY(-2px);
}
.presets-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 16px;
}
.preset-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}
.preset-card:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.preset-card h4 {
    margin: 0 0 8px 0;
    color: #4CAF50;
    font-size: 14px;
}
.preset-card p {
    margin: 0;
    font-size: 12px;
    color: #c0c0c0;
    line-height: 1.4;
}
.confirmation-popup {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    opacity: 0;
    animation-fill-mode: forwards;
}
.confirmation-content {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 24px;
    width: 400px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}
.confirmation-content h3 {
    margin-top: 0;
    color: #4CAF50;
}
.confirmation-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
}
.confirm-btn, .cancel-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.1s ease, background 0.2s ease;
}
.confirm-btn {
    background: #4CAF50;
    color: white;
}
.cancel-btn {
    background: #666;
    color: white;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
.fade-in {
    animation: fadeIn 0.25s ease-out forwards;
}
.fade-out {
    animation: fadeOut 0.2s ease-in forwards;
}

.confirm-btn:active,
.cancel-btn:active {
    transform: scale(0.96);
    filter: brightness(0.95);
}
.grayish-center {
  color: white;
  font-weight: bold;
  text-align: center;
  position: relative;
  display: inline-block;
  font-size: 18px !important;
}
.grayish-center::after {
  content: "";
  display: block;
  margin: 4px auto 0;
  width: 50%;
  border-bottom: 2px solid #888888;
  opacity: 0.6;
  border-radius: 2px;
}
li a.about-link {
  position: relative !important;
  font-weight: bold !important;
  color: #dc2626 !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: color 0.2s ease !important;
}
li a.about-link::after {
  content: '' !important;
  position: absolute !important;
  left: 0 !important;
  bottom: -2px !important;
  height: 2px !important;
  width: 100% !important;
  background-color: #dc2626 !important;
  transform: scaleX(0) !important;
  transform-origin: left !important;
  transition: transform 0.3s ease !important;
}
li a.about-link:hover {
  color: #b91c1c !important;
}
li a.about-link:hover::after {
  transform: scaleX(1) !important;
}
.about-section ul li a {
  position: relative;
  font-weight: bold;
  color: #dc2626;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}
.about-section ul li a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 2px;
  width: 100%;
  background-color: #dc2626;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.about-section ul li a:hover {
  color: #b91c1c;
}
.about-section ul li a:hover::after {
  transform: scaleX(1);
}
.license-note {
    font-size: 0.65em;
    color: #999;
    margin-top: 12px;
    font-style: italic;
    text-align: center;
}
.edit-button {
    margin-left: auto;
    padding: 2px 8px;
    font-size: 12px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(145deg, #3a3a3a, #2c2c2c);
    color: #f0f0f0;
    cursor: pointer;
    font-weight: 500;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05),
                0 2px 4px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease;
}
.edit-button:hover {
    background: linear-gradient(145deg, #4a4a4a, #343434);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08),
                0 3px 6px rgba(0, 0, 0, 0.35);
    transform: translateY(-0.5px);
}
.help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(220, 53, 69, 0.15);
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    color: #e02d3c;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
    border: 1px solid rgba(220, 53, 69, 0.2);
}
.help-icon:hover {
    background: rgba(220, 53, 69, 0.25);
    transform: translateY(-1px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.15);
    cursor: pointer;
}

.help-icon::after {
    content: "Click for help";
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
}
.help-icon:hover::after {
    opacity: 1;
    visibility: visible;
}
.help-icon:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
    100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
}
.help-icon.attention {
    animation: pulse 2s infinite;
}
.highlight-help-item {
    animation: highlight 1.5s ease;
    background: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4CAF50;
}
@keyframes highlight {
    0% { background: rgba(76, 175, 80, 0.3); }
    100% { background: rgba(76, 175, 80, 0.1); }
}
.new_label .new {
    margin-left: 8px;
    color: #32cd32;
    font-size: 12px;
    font-weight: bold;
    background-color: rgba(50, 205, 50, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    position: relative;
    z-index: 10001;
}
.new_label .tooltip {
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.75);
    color: #fff;
    font-size: 12px;
    padding: 6px;
    border-radius: 5px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s;
}
.new_label .new:hover .tooltip {
    visibility: visible;
    opacity: 1;
    z-index: 10001;
}
.experiment_label .experimental {
    margin-left: 8px;
    color: gold;
    font-size: 12px;
    font-weight: bold;
    background-color: rgba(255, 215, 0, 0.1);
    padding: 2px 6px;
    border-radius: 3px;
    position: relative;
    z-index: 10001;
}
.experiment_label .tooltip {
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 12px;
    padding: 6px;
    border-radius: 5px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 10001;
    opacity: 0;
    transition: opacity 0.3s;
}
.experiment_label .experimental:hover .tooltip {
    visibility: visible;
    opacity: 1;
    z-index: 10001;
}
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
}
@keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.96); }
}
@keyframes sectionFade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
#userscript-settings-menu {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.7s cubic-bezier(0.19, 1, 0.22, 1);
}
.settings-container {
    display: flex;
    position: relative;
    width: 580px;
    height: 480px;
    background: linear-gradient(145deg, #1a1a1a, #232323);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
#close-settings {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    color: #c0c0c0;
    font-size: 20px;
    cursor: pointer;
    z-index: 10001;
    transition: all 0.5s ease;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#close-settings:hover {
    color: #ff3b47;
    background: rgba(255, 59, 71, 0.1);
    transform: rotate(90deg);
}
.settings-sidebar {
    width: 32%;
    background: #272727;
    padding: 18px 12px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 6px 0 12px -6px rgba(0,0,0,0.3);
    position: relative;
    overflow-y: auto;
}
.settings-sidebar h2 {
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 22px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
    text-decoration: none;
    position: relative;
    text-align: center;
}
.settings-sidebar h2::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -6px;
    width: 36px;
    height: 3px;
    background: white;
    border-radius: 2px;
}
.settings-sidebar ul {
    list-style: none;
    padding: 0;
    width: 100%;
    margin-top: 5px;
}
.settings-sidebar li {
    padding: 10px 12px;
    margin: 6px 0;
    text-align: left;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    border-radius: 8px;
    font-weight: 500;
    font-size: 17px;
    position: relative;
    animation: slideIn 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    animation-fill-mode: both;
    display: flex;
    align-items: center;
}
.settings-sidebar li:hover {
    background: #444;
    transform: translateX(5px);
}
.settings-sidebar .active {
    background: #444;
    color: white;
    transform: translateX(0);
}
.settings-sidebar .active:hover {
    transform: translateX(0);
}
.settings-sidebar li:hover::before {
    height: 100%;
}
.settings-sidebar .active::before {
    background: #dc3545;
}

.settings-sidebar::-webkit-scrollbar {
    width: 6px;
}
.settings-sidebar::-webkit-scrollbar-track {
    background: black;
    border-radius: 3px;
}
.settings-sidebar::-webkit-scrollbar-thumb {
    background: darkgreen;
    border-radius: 3px;
}
.settings-sidebar::-webkit-scrollbar-thumb:hover {
    background: #006400;
}

.settings-sidebar {
    scrollbar-width: thin;
    scrollbar-color: darkgreen black;
}

.settings-content {
    flex: 1;
    padding: 24px;
    color: white;
    text-align: center;
    max-height: 100%;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: darkgreen black;
    background: #1e1e1e;
    position: relative;
}

.settings-content::-webkit-scrollbar {
    width: 6px;
}
.settings-content::-webkit-scrollbar-track {
    background: #333;
    border-radius: 3px;
}
.settings-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #dc3545, #b02a37);
    border-radius: 3px;
}
.settings-content::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #ff3b47, #dc3545);
}
.settings-content h2 {
    margin-bottom: 24px;
    font-weight: 600;
    font-size: 22px;
    color: white;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    letter-spacing: 0.5px;
    position: relative;
    display: inline-block;
    padding-bottom: 6px;
}
.settings-content h2::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
    border-radius: 2px;
}
.settings-content div {
    animation: sectionFade 0.7s cubic-bezier(0.19, 1, 0.22, 1);
}

.toggle-slider {
    display: flex;
    align-items: center;
    margin: 12px 0;
    cursor: pointer;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    transition: all 0.5s ease;
    user-select: none;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
.toggle-slider:hover {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}
.toggle-slider input {
    display: none;
}
.toggle-slider .slider {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 22px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 22px;
    margin-right: 12px;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}
.toggle-slider .slider::before {
    content: "";
    position: absolute;
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.toggle-slider input:checked + .slider {
    background-color: #4CAF50;
    box-shadow: 0 0 0 1px rgba(220, 53, 69, 0.05), inset 0 1px 3px rgba(0, 0, 0, 0.2);
}
.toggle-slider input:checked + .slider::before {
    transform: translateX(20px);
}
.toggle-slider input:checked + .slider::after {
    opacity: 1;
}
.rolocate-logo {
    width: 90px !important;
    height: 90px !important;
    object-fit: contain;
    border-radius: 14px;
    display: block;
    margin: 0 auto 16px auto;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    transition: all 0.5s ease;
    border: 2px solid rgba(220, 53, 69, 0.4);
}
.rolocate-logo:hover {
    transform: scale(1.05);
}
.version {
    font-size: 13px;
    color: #aaa;
    margin-bottom: 24px;
    display: inline-block;
    padding: 5px 14px;
    background: rgba(220, 53, 69, 0.1);
    border-radius: 18px;
    border: 1px solid rgba(220, 53, 69, 0.2);
}
.settings-content ul {
    text-align: left;
    list-style-type: none;
    padding: 0;
    margin-top: 16px;
}
.settings-content ul li {
    margin: 12px 0;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    transition: all 0.4s ease;
}
.settings-content ul li:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left: 3px solid #4CAF50;
    transform: translateX(5px);
}
.settings-content ul li strong {
    color: #4CAF50;
}
.warning_advanced {
    font-size: 14px;
    color: #ff3b47;
    font-weight: bold;
    padding: 8px 14px;
    background: rgba(220, 53, 69, 0.1);
    border-radius: 6px;
    margin-bottom: 16px;
    display: inline-block;
    border: 1px solid rgba(220, 53, 69, 0.2);
    box-shadow: 0 0 6px rgba(220, 53, 69, 0.3);
    transition: box-shadow 0.3s ease;
}
.warning_advanced:hover {
    box-shadow: 0 0 12px rgba(220, 53, 69, 0.6);
}
.extras_section {
    font-size: 14px;
    color: #0d6efd;
    font-weight: bold;
    padding: 8px 14px;
    background: rgba(13, 110, 253, 0.1);
    border-radius: 6px;
    margin-bottom: 16px;
    display: inline-block;
    border: 1px solid rgba(13, 110, 253, 0.3);
    box-shadow: 0 0 6px rgba(13, 110, 253, 0.3);
    transition: box-shadow 0.3s ease;
}
.extras_section:hover {
    box-shadow: 0 0 12px rgba(13, 110, 253, 0.6);
}
.edit-nav-button {
    padding: 6px 14px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Inter', 'Helvetica', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    height: auto;
    line-height: 1.5;
    position: relative;
    overflow: hidden;
}
.edit-nav-button:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #1e8449 0%, #196f3d 100%);
}
.edit-nav-button:hover::before {
    left: 100%;
}
.edit-nav-button:active {
    background: linear-gradient(135deg, #1e8449 0%, #196f3d 100%);
    transform: translateY(1px);
}

#prioritylocation-select {
    width: 100%;
    padding: 10px 14px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    color: #e0e0e0;
    font-size: 14px
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-size: 14px;
    transition: all 0.5s ease;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.05);
}

#location-hint {
    margin-top: 10px;
    font-size: 12px;
    color: #c0c0c0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 10px 14px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    line-height: 1.6;
    transition: all 0.5s ease;
}

.section-separator {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #272727, transparent);
    margin: 24px 0;
}

.help-section h3, .about-section h3 {
    color: white;
    margin-top: 20px;
    margin-bottom: 12px;
    font-size: 16px;
    text-align: left;
}

.hint-text {
    font-size: 13px;
    color: #a0a0a0;
    margin-top: 6px;
    margin-left: 16px;
    text-align: left;
}

.location-settings {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 6px;
    padding: 14px;
    margin-top: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.5s ease;
}
.setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.setting-header span {
    font-size: 14px;
    font-weight: 500;
}
.help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(220, 53, 69, 0.2);
    border-radius: 50%;
    font-size: 11px;
    color: #ff3b47;
    cursor: help;
    transition: all 0.5s ease;
}

#manual-coordinates {
    margin-top: 12px !important;
}
.coordinates-inputs {
    gap: 8px !important;
    margin-bottom: 10px !important;
}
#manual-coordinates input {
    padding: 8px 10px !important;
    border-radius: 6px !important;
    font-size: 13px !important;
}
#manual-coordinates label {
    margin-bottom: 6px !important;
    font-size: 13px !important;
}
#save-coordinates {
    margin-top: 6px !important;
}

.animated-content {
    animation: sectionFade 0.7s cubic-bezier(0.19, 1, 0.22, 1);
}

.section-divider {
    height: 1px !important;
    background: linear-gradient(90deg, transparent, #444, transparent);
    margin: 8px 12px !important;
    padding: 0 !important;
    cursor: default !important;
    pointer-events: none;
}

.section-divider:hover {
    background: linear-gradient(90deg, transparent, #444, transparent) !important;
    transform: none !important;
}
    `;
        document.head.appendChild(style);
        // hopefully this works
        document.querySelectorAll(".settings-sidebar li").forEach((li, index) => {
            // aniamtions stuff
            li.style.animationDelay = `${0.05 * (index + 1)}s`;
            li.addEventListener("click", function() {
                const currentActive = document.querySelector(".settings-sidebar .active");
                if (currentActive) currentActive.classList.remove("active");
                this.classList.add("active");
                const section = this.getAttribute("data-section");
                const settingsBody = document.getElementById("settings-body");
                const settingsTitle = document.getElementById("settings-title");
                // aniamtions stuff
                settingsBody.style.opacity = "0";
                settingsBody.style.transform = "translateY(10px)";
                settingsTitle.style.opacity = "0";
                settingsTitle.style.transform = "translateY(10px)";
                setTimeout(() => {
                    // aniamtions stuff
                    settingsTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
                    settingsBody.innerHTML = getSettingsContent(section);


                    if (section === "general") {
                        const autoserverregionscheckbox = document.getElementById("AutoRunServerRegions");
                        const editButton_autoserverregionsbtn = document.getElementById("edit-autoserverregionsbutton-btn");
                        if (autoserverregionscheckbox && editButton_autoserverregionsbtn) {
                            // show edit button
                            editButton_autoserverregionsbtn.style.display = localStorage.getItem("ROLOCATE_AutoRunServerRegions") === "true" ? "block" : "none";
                            // uhh on and off for edit buttoin
                            autoserverregionscheckbox.addEventListener("change", function() {
                                const isEnabled = this.checked;
                                editButton_autoserverregionsbtn.style.display = isEnabled ? "block" : "none";
                            });
                        }
                    }
                    // quick nav and removeads stuff
                    if (section === "appearance") {
                        // remove the ads
                        const removeAdsCheckbox = document.getElementById("removeads");
                        const editRemoveAdsButton = document.getElementById("edit-removeads-btn");
                        if (removeAdsCheckbox && editRemoveAdsButton) {
                            editRemoveAdsButton.style.display = localStorage.getItem("ROLOCATE_removeads") === "true" ? "block" : "none";
                            removeAdsCheckbox.addEventListener("change", function() {
                                const isEnabled = this.checked;
                                localStorage.setItem("ROLOCATE_removeads", isEnabled);
                                editRemoveAdsButton.style.display = isEnabled ? "block" : "none";
                            });
                        }

                        // custom backtgrounds
                        const customBackgroundsCheckbox = document.getElementById("custombackgrounds");
                        const editBackgroundsButton = document.getElementById("edit-backgrounds-btn");
                        if (customBackgroundsCheckbox && editBackgroundsButton) {

                            editBackgroundsButton.style.display = localStorage.getItem("ROLOCATE_custombackgrounds") === "true" ? "block" : "none";

                            // update localstorage and show edit button if button has any
                            customBackgroundsCheckbox.addEventListener("change", function() {
                                const isEnabled = this.checked;
                                localStorage.setItem("ROLOCATE_custombackgrounds", isEnabled);
                                editBackgroundsButton.style.display = isEnabled ? "block" : "none";
                            });
                        }
                    }


                    if (section === "extras") {
                        const gameQualityCheckbox = document.getElementById("gamequalityfilter");
                        const editButton = document.getElementById("edit-gamequality-btn");
                        if (gameQualityCheckbox && editButton) {
                            // show edit button
                            editButton.style.display = localStorage.getItem("ROLOCATE_gamequalityfilter") === "true" ? "block" : "none";
                            // uhh on and off for edit buttoin
                            gameQualityCheckbox.addEventListener("change", function() {
                                const isEnabled = this.checked;
                                editButton.style.display = isEnabled ? "block" : "none";
                            });
                        }
                    }
                    settingsBody.style.transition = "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
                    settingsTitle.style.transition = "all 0.4s cubic-bezier(0.19, 1, 0.22, 1)";
                    void settingsBody.offsetWidth;
                    void settingsTitle.offsetWidth;
                    settingsBody.style.opacity = "1";
                    settingsBody.style.transform = "translateY(0)";
                    settingsTitle.style.opacity = "1";
                    settingsTitle.style.transform = "translateY(0)";
                    applyStoredSettings();
                }, 200);
            });
        });
        // close button
        document.getElementById("close-settings").addEventListener("click", function() {
            const priorityLocation = localStorage.getItem("ROLOCATE_prioritylocation");
            if (priorityLocation === "manual") {
                try {
                    const coords = JSON.parse(GM_getValue("ROLOCATE_coordinates", '{"lat":"","lng":""}'));
                    if (!coords.lat || !coords.lng) {
                        notifications('Please set the latitude and longitude values for the manual location, or set it to automatic.', 'error', '⚠️', 8000);
                        return; // prevent closing if no coordiantes in manual mode
                    }
                } catch (error) {
                    ConsoleLogEnabled("Error checking coordinates:", error);
                    notifications('Error checking location settings', 'error', '⚠️', 8000);
                    return; // prevent closing if there is an error
                }
            }
            // uh close if all is good
            const menu = document.getElementById("userscript-settings-menu");
            menu.style.animation = "fadeOut 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards";
            // cool aniamtion for the close button
            this.style.transform = "rotate(90deg)";
            setTimeout(() => menu.remove(), 400);
        });
        // uh does whats in the fucntion name
        applyStoredSettings();
        // oooo a ripple animation cool :)
        const buttons = document.querySelectorAll(".edit-nav-button, .settings-button");
        buttons.forEach(button => {
            button.addEventListener("mousedown", function(e) {
                const ripple = document.createElement("span");
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.cssText = `
                position: absolute;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                pointer-events: none;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                transform: scale(0);
                transition: transform 0.6s, opacity 0.6s;
            `;
                this.appendChild(ripple);
                setTimeout(() => {
                    ripple.style.transform = "scale(2)";
                    ripple.style.opacity = "0";
                    setTimeout(() => ripple.remove(), 600);
                }, 10);
            });
        });
        // uh look at help icon clicky
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('help-icon')) {
                // no glitches no bubble up
                e.stopPropagation();
                e.preventDefault();
                const helpItem = e.target.getAttribute('data-help');
                if (helpItem) {
                    // go to help tab
                    const helpTab = document.querySelector('.settings-sidebar li[data-section="help"]');
                    if (helpTab) helpTab.click();
                    // cool animtion to scroll down on help tab
                    setTimeout(() => {
                        const helpElement = document.getElementById(`help-${helpItem}`);
                        if (helpElement) {
                            helpElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                            helpElement.classList.add('highlight-help-item');
                            setTimeout(() => {
                                helpElement.classList.remove('highlight-help-item');
                            }, 1500);
                        }
                    }, 300);
                }
            }
        });
    }


    /*******************************************************
    name of function: applyStoredSettings
    description: makes sure local storage is stored in correctly
    *******************************************************/
    function applyStoredSettings() {
        // checkbox stuff
        document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
            const storageKey = `ROLOCATE_${checkbox.id}`;
            const savedValue = localStorage.getItem(storageKey);
            checkbox.checked = savedValue === "true";

            checkbox.addEventListener("change", () => {
                localStorage.setItem(storageKey, checkbox.checked);
            });
        });

        // location stuff
        const prioritySelect = document.getElementById("prioritylocation-select");
        if (prioritySelect) {
            const storageKey = "ROLOCATE_prioritylocation";
            const savedValue = localStorage.getItem(storageKey) || "automatic";
            prioritySelect.value = savedValue;

            // hide coordinate box if in automica vice versa
            const manualCoordinates = document.getElementById("manual-coordinates");
            if (manualCoordinates) {
                manualCoordinates.style.display = savedValue === "manual" ? "block" : "none";

                // manual set input stuff
                if (savedValue === "manual") {
                    try {
                        const savedCoords = JSON.parse(GM_getValue("ROLOCATE_coordinates", '{"lat":"","lng":""}'));
                        document.getElementById("latitude").value = savedCoords.lat || "";
                        document.getElementById("longitude").value = savedCoords.lng || "";

                        // if manual mode but no coordinates saved go back to automatic
                        if (!savedCoords.lat || !savedCoords.lng) {
                            prioritySelect.value = "automatic";
                            localStorage.setItem(storageKey, "automatic");
                            manualCoordinates.style.display = "none";
                        }
                    } catch (error) {
                        ConsoleLogEnabled("Error loading saved coordinates:", error);
                    }
                }
            }

            prioritySelect.addEventListener("change", () => {
                const newValue = prioritySelect.value;
                localStorage.setItem(storageKey, newValue);

                // show coordinate input if thereq
                if (manualCoordinates) {
                    manualCoordinates.style.display = newValue === "manual" ? "block" : "none";

                    // when switching to manual mode load any saved coordinates
                    if (newValue === "manual") {
                        try {
                            const savedCoords = JSON.parse(GM_getValue("ROLOCATE_coordinates", '{"lat":"","lng":""}'));
                            document.getElementById("latitude").value = savedCoords.lat || "";
                            document.getElementById("longitude").value = savedCoords.lng || "";

                            // if no input then keep it empty
                        } catch (error) {
                            ConsoleLogEnabled("Error loading saved coordinates:", error);
                        }
                    }
                }
            });
        }

        // uh buttons that need special treatment

        const editRemoveads = document.getElementById("edit-removeads-btn");
        if (editRemoveads) {
            editRemoveads.addEventListener("click", () => {
                editremoveads();
            });
        }

        const editBackgrounds = document.getElementById("edit-backgrounds-btn");
        if (editBackgrounds) {
            editBackgrounds.addEventListener("click", () => {
                showSettingsPopup_background();
            });
        }

        const editQualityGameBtn = document.getElementById("edit-gamequality-btn");
        if (editQualityGameBtn) {
            editQualityGameBtn.addEventListener("click", () => {
                openGameQualitySettings();
            });
        }

        const fastServersToggle = document.getElementById("fastservers");
        if (fastServersToggle) {
            fastServersToggle.addEventListener("change", () => {
                if (fastServersToggle.checked) {
                    notifications('Fast Server Search: 100x faster on Violentmonkey, ~2x on Tampermonkey.', 'info', '🧪', 2000);
                }
            });
        }

        const AutoRunServerRegions = document.getElementById("AutoRunServerRegions");
        const AutoRunServerRegionsbutton = document.getElementById("edit-autoserverregionsbutton-btn")
        if (AutoRunServerRegions) {
            AutoRunServerRegions.addEventListener("change", () => {
                if (AutoRunServerRegions.checked) {
                    notifications('Auto Server Regions works best when paired with Fast Server Search in Advanced Settings.', 'info', '🧪', 2000);
                }
            });
            AutoRunServerRegionsbutton.addEventListener("click", () => {
                ChangeAutoServerRegionCount();
            });
        }



        // save coordinates button duh
        const saveCoordinatesBtn = document.getElementById("save-coordinates");
        if (saveCoordinatesBtn) {
            saveCoordinatesBtn.addEventListener("click", () => {
                const latInput = document.getElementById("latitude");
                const lngInput = document.getElementById("longitude");
                const lat = latInput.value.trim();
                const lng = lngInput.value.trim();

                // doubole check for stuff
                if (!lat || !lng) {
                    const prioritySelect = document.getElementById("prioritylocation-select");
                    if (prioritySelect) {
                        prioritySelect.value = "automatic";
                        localStorage.setItem("ROLOCATE_prioritylocation", "automatic");
                        document.getElementById("manual-coordinates").style.display = "none";

                        // if user sees this then something went wrong.
                        saveCoordinatesBtn.textContent = "Reverted to Automatic!";
                        saveCoordinatesBtn.style.background = "#4CAF50";

                        setTimeout(() => {
                            saveCoordinatesBtn.textContent = "Save Coordinates";
                            saveCoordinatesBtn.style.background = "background: #4CAF50;";
                        }, 2000);
                    }
                    return;
                }

                // make sure they are actually real coordiantes
                // wont check if ur in a middle of the ocean lmao
                const latNum = parseFloat(lat);
                const lngNum = parseFloat(lng);
                if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
                    notifications('Invalid coordinates! Latitude must be between -90 and 90, and longitude between -180 and 180.', 'error', '⚠️', '8000');
                    return;
                }

                // save the coordinates
                const coordinates = {
                    lat,
                    lng
                };
                GM_setValue("ROLOCATE_coordinates", JSON.stringify(coordinates)); // store coordinates in secure storage

                // make sure in manaul mode. triple check
                localStorage.setItem("ROLOCATE_prioritylocation", "manual");
                if (prioritySelect) {
                    prioritySelect.value = "manual";
                }

                // tell user it saved
                saveCoordinatesBtn.textContent = "Saved!";
                saveCoordinatesBtn.style.background = "linear-gradient(135deg, #1e8449 0%, #196f3d 100%);";

                setTimeout(() => {
                    saveCoordinatesBtn.textContent = "Save Coordinates";
                    saveCoordinatesBtn.style.background = "background: #4CAF50;";
                }, 2000);
            });
        }

        const exportBtn = document.getElementById("export-settings");
        const importBtn = document.getElementById("import-settings");
        const importFile = document.getElementById("import-file");

        if (exportBtn) {
            exportBtn.addEventListener("click", exportSettings);
        }

        if (importBtn && importFile) {
            importBtn.addEventListener("click", () => importFile.click());
            importFile.addEventListener("change", (e) => {
                if (e.target.files[0]) {
                    showConfirmation(
                        "Import Settings",
                        "This will overwrite your current settings. Continue?",
                        () => importSettings(e.target.files[0])
                    );
                }
            });
        }

        // preset cards
        document.querySelectorAll(".preset-card").forEach(card => {
            card.addEventListener("click", () => {
                const preset = card.dataset.preset;
                const config = presetConfigurations[preset];
                if (config) {
                    showConfirmation(
                        `Apply ${config.name} Preset`,
                        `This will change your current settings to the ${config.name} configuration. Continue?`,
                        () => applyPreset(preset)
                    );
                }
            });
        });
    }



    function exportSettings() {
        const settings = {};
        Object.keys(defaultSettings).forEach(key => {
            settings[key] = localStorage.getItem(`ROLOCATE_${key}`);
        });

        const blob = new Blob([JSON.stringify(settings, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rolocate-settings.json';
        a.click();
        URL.revokeObjectURL(url);

        notifications('Settings exported successfully!', 'success', '📤', 3000);
    }

    function importSettings(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const settings = JSON.parse(e.target.result);
                Object.entries(settings).forEach(([key, value]) => {
                    if (Object.prototype.hasOwnProperty.call(defaultSettings, key) && value !== null) {
                        localStorage.setItem(`ROLOCATE_${key}`, value);
                    }
                });
                notifications('Settings imported successfully! Refresh the page to see changes.', 'success', '📥', 5000);
            } catch (error) {
                notifications('Invalid settings file!', 'error', '❌', 3000);
            }
        };
        reader.readAsText(file);
    }

    function applyPreset(presetKey) {
        const preset = presetConfigurations[presetKey];
        if (!preset) return;

        Object.entries(preset.settings).forEach(([key, value]) => {
            localStorage.setItem(`ROLOCATE_${key}`, value);
        });

        notifications(`${preset.name} preset applied! Refreshing the page in 3 seconds...`, 'success', '⚡', 3000);
        setTimeout(() => { location.reload(); }, 3000); // refresh after 5 seconds
    }

    function showConfirmation(title, message, onConfirm) {
        const popup = document.createElement('div');
        popup.className = 'confirmation-popup fade-in';
        popup.innerHTML = `
            <div class="confirmation-content">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="confirmation-buttons">
                    <button class="confirm-btn">Confirm</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        const removePopup = () => {
            popup.classList.remove('fade-in');
            popup.classList.add('fade-out');
            popup.addEventListener('animationend', () => popup.remove(), {
                once: true
            });
        };

        popup.querySelector('.confirm-btn').addEventListener('click', () => {
            removePopup();
            onConfirm();
        });

        popup.querySelector('.cancel-btn').addEventListener('click', () => {
            removePopup();
        });
    }


    /*******************************************************
    name of function: AddSettingsButton
    description: adds settings button
    *******************************************************/
    function AddSettingsButton() {
        const base64Logo = window.Base64Images.logo;
        const navbarGroup = document.querySelector('.nav.navbar-right.rbx-navbar-icon-group');
        if (!navbarGroup || document.getElementById('custom-logo')) return;

        const li = document.createElement('li');
        li.id = 'custom-logo-container';
        li.style.position = 'relative';

        li.innerHTML = `
        <img id="custom-logo"
             style="
                 margin-top: 6px;
                 margin-left: 6px;
                 width: 26px;
                 cursor: pointer;
                 border-radius: 4px;
                 transition: all 0.2s ease-in-out;
             "
             src="${base64Logo}">
        <span id="custom-tooltip"
              style="
                  visibility: hidden;
                  background-color: black;
                  color: white;
                  text-align: center;
                  padding: 5px;
                  border-radius: 5px;
                  position: absolute;
                  top: 35px;
                  left: 50%;
                  transform: translateX(-50%);
                  white-space: nowrap;
                  font-size: 12px;
                  opacity: 0;
                  transition: opacity 0.2s ease-in-out;
              ">
              Settings
        </span>
    `;

        const logo = li.querySelector('#custom-logo');
        const tooltip = li.querySelector('#custom-tooltip');

        logo.addEventListener('click', () => openSettingsMenu());

        logo.addEventListener('mouseover', () => {
            logo.style.width = '30px';
            logo.style.border = '2px solid white';
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        logo.addEventListener('mouseout', () => {
            logo.style.width = '26px';
            logo.style.border = 'none';
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });

        navbarGroup.appendChild(li);
    }

    /*******************************************************
    name of function: editremoveads
    description: popup for customizing the ads
    *******************************************************/
    function editremoveads() {
      if (document.getElementById('rolocate-ad-settings-modal')) return;

      const defaults = {
        adIframes: true, sponsoredGames: true, sponsoredSections: true,
        todaysPicks: true, recommendedForYou: true, feedItems: true
      };
      const settings = { ...defaults, ...JSON.parse(localStorage.getItem("ROLOCATE_editremoveads") || '{}') };

      const overlay = document.createElement('div');
      overlay.id = 'rolocate-ad-settings-modal';
      overlay.style.cssText = `
        position:fixed;inset:0;display:flex;justify-content:center;align-items:center;
        background:rgba(0,0,0,.3);z-index:10000;opacity:0;transition:.2s;
      `;

      const modal = document.createElement('div');
      modal.style.cssText = `
        background:#1a1a1a;border-radius:12px;padding:20px;width:320px;max-width:90vw;
        color:#fff;border:1px solid #333;transform:scale(.95) translateY(10px);
        box-shadow:0 4px 20px rgba(0,0,0,.5);transition:.2s;
      `;

      modal.innerHTML = `<h2 style="text-align:center;font-size:18px;margin:0 0 12px">Ad Settings</h2>`;

      const options = [
        ['adIframes', 'Hide Ad Iframes'],
        ['sponsoredGames', 'Hide Sponsored Games'],
        ['sponsoredSections', 'Hide Sponsored Sections'],
        ['todaysPicks', 'Hide "Today\'s Picks"'],
        ['recommendedForYou', 'Hide "Recommended For You"'],
        ['feedItems', 'Hide Feed Posts']
      ];

      const optsDiv = document.createElement('div');
      optsDiv.style.cssText = `background:#2a2a2a;padding:12px;border-radius:8px;`;

      options.forEach(([key, label]) => {
        const div = document.createElement('div');
        div.innerHTML = `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="${key}" ${settings[key] ? 'checked' : ''} style="transform:scale(1.2)">
          <span style="font-size:13px">${label}</span></label>`;
        optsDiv.appendChild(div);
      });

      const btns = document.createElement('div');
      btns.style.cssText = `display:flex;justify-content:end;gap:8px;margin-top:14px;`;

      const makeBtn = (txt, bg, fn) => {
        const b = document.createElement('button');
        b.textContent = txt;
        b.style.cssText = `
          padding:8px 14px;border-radius:6px;border:1px solid ${bg};
          background:${bg};color:#fff;cursor:pointer;font-size:13px;
          transition:.15s;
        `;
        b.onmouseenter = () => b.style.opacity = .85;
        b.onmouseleave = () => b.style.opacity = 1;
        b.onclick = fn;
        return b;
      };

      const close = () => {
        modal.style.transform = 'scale(.95) translateY(10px)';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
      };

      btns.append(
        makeBtn('Cancel', '#333', close),
        makeBtn('Save', '#166534', () => {
          const newSettings = {};
          options.forEach(([k]) => newSettings[k] = document.getElementById(k).checked);
          localStorage.setItem('ROLOCATE_editremoveads', JSON.stringify(newSettings));
          ConsoleLogEnabled('Ad settings saved:', newSettings);
          notifications('Settings saved', 'success', '👍', '5000');
          close();
        })
      );

      modal.append(optsDiv, btns);
      overlay.append(modal);
      document.body.append(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1) translateY(0)';
      });
    }



    /*******************************************************
    name of function: removeAds
    description: remove roblox ads
    *******************************************************/
    function removeAds() {
        if (localStorage.getItem("ROLOCATE_removeads") !== "true") {
            return;
        }

        const userSettings = JSON.parse(localStorage.getItem("ROLOCATE_editremoveads") || '{}');
        const defaultSettings = {
            adIframes: true,
            sponsoredGames: true,
            sponsoredSections: true,
            todaysPicks: true,
            recommendedForYou: true,
            feedItems: true
        };// if no settings use default settings
        const settings = { ...defaultSettings, ...userSettings };

        const doneMap = new WeakMap();
        let isRunning = false;

        /*******************************************************
        name of function: removeElements
        description: remove the roblox elements where ads and specific sections are in
        no script removal to avoid conflicts
        Updated to filter based on user settings
        *******************************************************/
        function removeElements() {
            // prevent multiple runs at same time
            if (isRunning) return;
            isRunning = true;

            try {
                // block ad iframes if enabled by roblox for some reason
                if (settings.adIframes) {
                    const adIframes = document.querySelectorAll(`
                        .ads-container iframe,
                        .abp iframe,
                        .abp-spacer iframe,
                        .abp-container iframe,
                        .top-abp-container iframe,
                        #AdvertisingLeaderboard iframe,
                        #AdvertisementRight iframe,
                        #MessagesAdSkyscraper iframe,
                        .Ads_WideSkyscraper iframe,
                        .profile-ads-container iframe,
                        #ad iframe,
                        iframe[src*="roblox.com/user-sponsorship/"]
                    `);

                    adIframes.forEach(iframe => {
                        if (!doneMap.get(iframe)) {
                            // hide instead of remove cause no want page break
                            iframe.style.display = "none";
                            iframe.style.visibility = "hidden";
                            doneMap.set(iframe, true);
                        }
                    });
                }

                // block sponsored game cards if enabled
                if (settings.sponsoredGames) {
                    document.querySelectorAll(".game-card-native-ad").forEach(ad => {
                        if (!doneMap.get(ad)) {
                            const gameCard = ad.closest(".game-card-container");
                            if (gameCard) {
                                gameCard.style.display = "none";
                            }
                            doneMap.set(ad, true);
                        }
                    });
                }

                // block sponsored sections if enabled
                if (settings.sponsoredSections) {
                    document.querySelectorAll(".game-sort-carousel-wrapper").forEach(wrapper => {
                        if (doneMap.get(wrapper)) return;

                        const headerText = wrapper.querySelector('[data-testid="text-icon-row-text"]')?.textContent.trim();
                        const linkElement = wrapper.querySelector('a[href*="/sortName/v2/"]');

                        // Check if it's specifically a sponsored section
                        const isSponsored = headerText === "Sponsored" ||
                            (linkElement && linkElement.href.includes("/sortName/v2/Sponsored"));

                        if (isSponsored) {
                            wrapper.style.display = "none";
                            doneMap.set(wrapper, true);
                        }
                    });
                }

                // block "today's picks" section if enabled
                if (settings.todaysPicks) {
                    document.querySelectorAll('.game-sort-carousel-wrapper').forEach(wrapper => {
                        if (doneMap.get(wrapper)) return;

                        const headerText = wrapper.querySelector('[data-testid="text-icon-row-text"]');
                        if (headerText && /today's picks(:|$)/i.test(headerText.textContent.trim())) {
                            wrapper.style.display = "none";
                            doneMap.set(wrapper, true);
                        }
                    });
                }

                // block "recommended for you" section if enabled
                if (settings.recommendedForYou) {
                    document.querySelectorAll('[data-testid="home-page-game-grid"]').forEach(grid => {
                        if (!doneMap.get(grid)) {
                            grid.style.display = "none";
                            doneMap.set(grid, true);
                        }
                    });
                }

                // block feed items if enabled
                if (settings.feedItems) {
                    document.querySelectorAll(".sdui-feed-item-container").forEach(node => {
                        if (!doneMap.get(node)) {
                            node.style.display = "none";
                            doneMap.set(node, true);
                        }
                    });
                }

            } finally {
                isRunning = false;
            }
        }

        // no comment
        let timeoutId;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(removeElements, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // wait a bit before initial run to let ublock orgin do its thing first if its installed
        // master at glitch fixing ikr
        setTimeout(removeElements, 100);
    }


    /*******************************************************
    name of function: changeServerCount
    description: gui to cyhange autoservergion count
    *******************************************************/
    function ChangeAutoServerRegionCount() {
        const current = localStorage.getItem('ROLOCATE_AutoRunServerRegionsnumber') || '16';

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99998;opacity:0;transition:opacity 0.3s ease-in-out';

        // Create modal
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;padding:20px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.5);z-index:99999;color:white;font-family:system-ui;opacity:0;transition:opacity 0.3s ease-in-out';
        div.innerHTML = `
            <div style="font-size:18px;margin-bottom:15px;font-weight:bold"># of Servers to Search</div>
            <input type="number" value="${current}" min="1" max="1000" style="width:200px;padding:8px;border-radius:6px;border:1px solid #444;background:#2a2a2a;color:white;font-size:16px;margin-bottom:15px">
            <div style="display:flex;gap:10px">
                <button style="flex:1;padding:8px;border:none;border-radius:6px;background:#667eea;color:white;cursor:pointer;font-weight:600">Save</button>
                <button style="padding:8px 15px;border:none;border-radius:6px;background:#444;color:white;cursor:pointer">Cancel</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(div);

        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
            div.style.opacity = '1';
        }, 10);

        const input = div.querySelector('input');
        const saveBtn = div.querySelectorAll('button')[0];
        const cancelBtn = div.querySelectorAll('button')[1];

        input.focus();

        // Helper function to fade out and remove
        const fadeOutAndRemove = () => {
            overlay.style.opacity = '0';
            div.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                div.remove();
            }, 300);
        };

        saveBtn.onclick = () => {
            const val = parseInt(input.value);
            if (val >= 1 && val <= 1000) {
                localStorage.setItem('ROLOCATE_AutoRunServerRegionsnumber', val.toString());
                saveBtn.textContent = '✓ Saved!';
                saveBtn.style.background = '#10b981';
                setTimeout(() => fadeOutAndRemove(), 1000);
            }
        };

        cancelBtn.onclick = () => fadeOutAndRemove();
        overlay.onclick = () => fadeOutAndRemove();
    }

    /*******************************************************
    applycustombackgrounds(): applies user background and handles transparency
    *******************************************************/
    async function applycustombackgrounds() {
        // stupid storage helper
        const getFile = k => {
            let d = (typeof GM_getValue != 'undefined') ? GM_getValue(`ROLOCATE_FILE_${k}`) : localStorage.getItem(`ROLOCATE_FILE_${k}`);
            return d ? JSON.parse(d) : null;
        };

        if (localStorage.getItem("ROLOCATE_custombackgrounds") !== "true") return;

        // this was so painful
        const useVid = localStorage.getItem('ROLOCATE_CUSTOMBACKGROUND_use_animated') === 'true';
        const vidURL = localStorage.getItem('ROLOCATE_CUSTOMBACKGROUND_video_url') || '';
        const txtColor = localStorage.getItem('ROLOCATE_CUSTOMBACKGROUND_text_color') || '';
        const overrideTxt = localStorage.getItem('ROLOCATE_CUSTOMBACKGROUND_override_text_color') === 'true';
        const adv = localStorage.getItem('ROLOCATE_CUSTOMBACKGROUND_use_advanced') === 'true';

        // clear leftovers
        document.querySelectorAll('video[custom-bg], img[custom-bg], #custom-ui-style').forEach(e => e.remove());

        let hasBG = false;
        const el = document.createElement(useVid ? 'video' : 'img');
        el.setAttribute('custom-bg', '');
        el.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;object-fit:cover;z-index:-9999;pointer-events:none;`;
        if (useVid) Object.assign(el, { muted: true, loop: true, playsInline: true });

        const file = getFile(useVid ? 'video' : 'image');
        if (file?.data) { el.src = file.data; hasBG = true; }
        else if (useVid && vidURL) { el.src = vidURL; hasBG = true; }

        if (hasBG) {
            if (useVid) el.play().catch(() => {});
            document.documentElement.appendChild(el);
        }

        // using the variable css isnt a good idea but idc
        let css = hasBG ? `html,body,.content{background:transparent!important}` : '';

        // advanced panel
        if (adv) {
            const def = 'rgba(45,45,45,0.85)';
            const map = [
                ['.profile-avatar-mask', 'avatar-mask'],
                ['.chat-body', 'chat-body'],
                ['.dropdown-menu', 'dropdown-menu'],
                ['.container-footer', 'footer']
            ];
            map.forEach(([sel, key]) => {
                const c = localStorage.getItem(`ROLOCATE_CUSTOMBACKGROUND_style_${key}`) || def;
                css += `${sel}{background-color:${c}!important}`;
            });
        }

        if (overrideTxt && txtColor) css += `body,body *{color:${txtColor}!important}`;

        const style = document.createElement('style');
        style.id = 'custom-ui-style';
        style.textContent = css;
        document.head.appendChild(style);

        // trasnaprent backgroudn
        const targets = [
            '.rolocate-greeting-header',
            '.best-friends-section',
            '.friend-carousel-container',
            '.ROLOCATE_QUICKLAUNCHGAMES_new-games-container'
        ];
        const tStyle = document.createElement('style');
        tStyle.id = 'rolocate-transparency-style';
        document.head.appendChild(tStyle);

        const applyTransparent = s => {
            if (!tStyle.textContent.includes(s))
                tStyle.textContent += `${s}{background:transparent!important;box-shadow:none!important;border-color:transparent!important}`;
            document.querySelectorAll(s).forEach(e => {
                Object.assign(e.style, { background: 'transparent', backgroundColor: 'transparent', boxShadow: 'none', borderColor: 'transparent' });
            });
        };

        const maybeTransparent = () => {
            const bodyBg = getComputedStyle(document.body).backgroundColor;
            if (bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent') targets.forEach(applyTransparent);
            else tStyle.textContent = '';
        };

        maybeTransparent(); // initial check

        // wont even comment
        new MutationObserver(maybeTransparent).observe(document.body, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class']
        });
    }

    /*******************************************************
    name of function: showSettingsPopup_background
    description: menu to manage the custom backgrounds
    *******************************************************/
    function showSettingsPopup_background() {
        notifications('Uh maybe i will work on this later but its kinda hard to update this', 'info', 'ℹ️', 4000);
        // uh the file helper
        const fileToBase64 = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

        const saveFile = async (key, file) => {
            // validate file type
            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']; // yea gif is considered an image.
            const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
            const isImage = validImageTypes.includes(file.type);
            const isVideo = validVideoTypes.includes(file.type);
            if ((key === 'image' && !isImage) || (key === 'video' && !isVideo)) {
                notifications(`Invalid file type: ${file.type}. Please upload a valid ${key === 'image' ? 'image (JPG, PNG, GIF, WebP)' : 'video (MP4, WebM, OGG)'} file.`, 'error', '⚠️', 8000);
                return;
            }

            const SOFT_LIMIT = 5 * 1024 * 1024;   // 5MB - warning
            const HARD_LIMIT = 20 * 1024 * 1024;  // 20MB - blocked
            if (file.size > HARD_LIMIT) {
                notifications(`File exceeds hard limit of ${(HARD_LIMIT / 1024 / 1024).toFixed(0)}MB (${(file.size / 1024 / 1024).toFixed(2)}MB). Please use a direct URL for larger files.`, 'error', '⚠️', 8000);
                return;
            }
            if (file.size > SOFT_LIMIT) {
                notifications(`Warning: File size is ${(file.size / 1024 / 1024).toFixed(2)}MB. Files over ${(SOFT_LIMIT / 1024 / 1024).toFixed(0)}MB may cause lag or slow page loads. Consider using a direct URL instead.`, 'warning', '⚠️', 10000);
            }
            if (typeof GM_setValue === 'undefined') {
                notifications('Userscript storage (GM_setValue) not available. Cannot save file.', 'error', '⚠️', 8000);
                return;
            }
            const base64Data = await fileToBase64(file);
            const fileData = { name: file.name, size: file.size, type: file.type, data: base64Data };
            GM_setValue(`ROLOCATE_FILE_${key}`, JSON.stringify(fileData));
        };

        const getFile = (key) => {
            const storage = typeof GM_getValue !== 'undefined' ? GM_getValue : (k) => localStorage.getItem(k);
            const data = storage(`ROLOCATE_FILE_${key}`, null);
            if (!data) return null;
            try { return JSON.parse(data); } catch { return null; }
        };

        const deleteFile = (key) => {
            const del = typeof GM_deleteValue !== 'undefined' ? GM_deleteValue : (k) => localStorage.removeItem(k);
            del(`ROLOCATE_FILE_${key}`);
        };

        // cleanup stuff
        document.getElementById('rolocate-settings-popup')?.remove();

        const style = document.createElement('style'); // css smaller to save space
        style.textContent = `
            @keyframes rFadeIn{from{opacity:0}to{opacity:1}}
            @keyframes rSlideIn{from{opacity:0;transform:translate(-50%,-48%)scale(.96)}to{opacity:1;transform:translate(-50%,-50%)scale(1)}}
            @keyframes rSlideTab{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
            .r-toggle{position:relative;display:inline-block;width:44px;height:24px;vertical-align:middle}
            .r-toggle input{opacity:0;width:0;height:0}
            .r-slider{position:absolute;cursor:pointer;inset:0;background:#3d3d3d;transition:.25s;border-radius:24px}
            .r-slider:before{content:"";position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:#8a8a8a;transition:.25s;border-radius:50%}
            input:checked+.r-slider{background:#2f4f3f}
            input:checked+.r-slider:before{background:#5fb589;transform:translateX(20px)}
            .r-input{width:100%;padding:10px;background:#2a2a2a;border:1px solid #3d3d3d;border-radius:6px;color:#d0d0d0;font-size:13px;transition:.2s;box-sizing:border-box}
            .r-input:focus{outline:none;border-color:#5fb589;background:#2f2f2f}
            .r-card{background:#242424;border-radius:10px;padding:16px;margin:0 0 12px;border:1px solid #323232;transition:border-color .2s}
            .r-card:hover{border-color:#3d3d3d}
            .r-card-title{color:#e0e0e0;margin:0 0 12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}
            .r-label{display:flex;align-items:center;justify-content:space-between;margin:0;padding:10px 0}
            .r-label-text{font-size:13px;color:#c0c0c0;line-height:1.4}
            .r-helper{font-size:11px;color:#808080;margin:6px 0 0;line-height:1.5}
            .r-upload-zone{margin-top:10px;padding:20px;background:#1e1e1e;border:2px dashed #3d3d3d;border-radius:8px;text-align:center;cursor:pointer;transition:.2s}
            .r-upload-zone:hover{border-color:#5fb589;background:#232323}
            .r-file-preview{margin-top:12px;padding:12px;background:#1e1e1e;border:1px solid #3d3d3d;border-radius:8px;display:flex;align-items:center;justify-content:space-between}
            .r-file-info{display:flex;align-items:center;gap:10px;color:#c0c0c0;font-size:12px}
            .r-remove-btn{padding:6px 12px;background:#3d2a2a;color:#ff9999;border:1px solid #4d3535;border-radius:5px;cursor:pointer;font-size:11px;font-weight:500;transition:.15s}
            .r-remove-btn:hover{background:#4d3535;color:#ffb0b0}
            .r-tabs{display:flex;gap:6px;margin-bottom:12px;background:#1e1e1e;padding:5px;border-radius:8px}
            .r-tab{flex:1;padding:8px 12px;background:transparent;color:#808080;border:none;border-radius:5px;cursor:pointer;font-size:12px;font-weight:500;transition:.2s}
            .r-tab:hover{background:#242424;color:#b5b5b5}
            .r-tab.active{background:#2f4f3f;color:#5fb589}
            .r-tab-content{display:none}
            .r-tab-content.active{display:block;animation:rSlideTab .3s ease-out}
            .r-adv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:10px}
            .r-adv-item{padding:10px;background:#1e1e1e;border:1px solid #2a2a2a;border-radius:6px}
            .r-adv-label{display:block;color:#999;font-size:10px;margin-bottom:5px;font-weight:500;text-transform:uppercase;letter-spacing:.5px}
        `;
        document.head.appendChild(style);

        // overlay
        const overlay = Object.assign(document.createElement('div'), {
            id: 'rolocate-settings-overlay',
            style: 'position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:9999998;animation:rFadeIn .2s'
        });

        // popup
        const popup = Object.assign(document.createElement('div'), {
            id: 'rolocate-settings-popup',
            style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a1a;color:#d0d0d0;border:1px solid #2a2a2a;border-radius:14px;width:94%;max-width:520px;max-height:85vh;overflow:hidden;z-index:9999999;box-shadow:0 24px 48px rgba(0,0,0,.8);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;font-size:13px;animation:rSlideIn .3s cubic-bezier(.16,1,.3,1)'
        });

        // the header
        const header = Object.assign(document.createElement('div'), {
            innerHTML: `<div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;background:linear-gradient(135deg,#5fb589,#2f4f3f);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px">🎨</div>
                <div><h2 style="margin:0;color:#fff;font-weight:600;font-size:16px;line-height:1.3">Custom Backgrounds</h2></div>`,
            style: 'background:linear-gradient(135deg,#2a2a2a,#1e1e1e);padding:18px 20px;border-bottom:1px solid #2a2a2a;display:flex;align-items:center;justify-content:space-between'
        });

        const closeBtn = Object.assign(document.createElement('button'), {
            innerHTML: '✕',
            style: 'background:#2a2a2a;color:#999;border:none;width:32px;height:32px;font-size:16px;cursor:pointer;border-radius:7px;transition:.15s',
            onmouseover() { this.style.cssText += 'background:#3d3d3d;color:#fff' },
            onmouseout() { this.style.cssText = this.style.cssText.replace(/background:#3d3d3d;color:#fff/, 'background:#2a2a2a;color:#999') },
            onclick() {
                popup.style.animation = 'rSlideIn .2s reverse';
                overlay.style.animation = 'rFadeIn .2s reverse';
                setTimeout(() => { overlay.remove(); popup.remove(); }, 200);
            }
        });
        header.appendChild(closeBtn);
        popup.appendChild(header);

        // content
        const content = Object.assign(document.createElement('div'), {
            style: 'padding:18px 20px;overflow-y:auto;max-height:calc(85vh - 160px)'
        });

        // the tabs ooooo
        const tabs = Object.assign(document.createElement('div'), {
            className: 'r-tabs',
            innerHTML: `<button class="r-tab active" data-tab="basic">Basic</button>
                <button class="r-tab" data-tab="appearance">Appearance</button>
                <button class="r-tab" data-tab="advanced">Advanced</button>`
        });
        content.appendChild(tabs);

        // get localStorage helper
        const localstoragegetternator = (key, def = '') => localStorage.getItem(`ROLOCATE_CUSTOMBACKGROUND_${key}`) || def;

        // basictav
        const basicTab = Object.assign(document.createElement('div'), {
            className: 'r-tab-content active',
            innerHTML: `<div class="r-card">
                <h3 class="r-card-title"><span>🎬</span> Background Type</h3>
                <label class="r-label"><span class="r-label-text">Animated Video Background</span>
                <label class="r-toggle"><input type="checkbox" id="use-animated" ${localstoragegetternator('use_animated', 'true') !== 'false' ? 'checked' : ''}><span class="r-slider"></span></label></label>
                <p class="r-helper">Choose between a video or an image</p></div>
                <div class="r-card" id="video-section"><h3 class="r-card-title"><span>📹</span> Video Background</h3>
                <label style="display:block;color:#c0c0c0;font-size:12px;margin-bottom:8px;font-weight:500">Video Source</label>
                <input type="text" id="video-url" class="r-input" value="${sanitizeAttribute(localstoragegetternator('video_url'))}" placeholder="https://example.com/video.mp4">
                <p class="r-helper">Enter a direct URL to an MP4 video file, or upload your own below</p>
                <input type="file" id="video-file-input" accept="video/*" style="display:none">
                <div class="r-upload-zone" id="video-upload-zone"><div style="font-size:28px;margin-bottom:6px">📤</div>
                <div style="color:#b5b5b5;font-size:13px;font-weight:500;margin-bottom:4px">Upload Video File</div>
                <div style="color:#808080;font-size:11px">Click to browse • Max 5MB • MP4, WebM</div></div>
                <div id="video-file-preview" style="display:none"></div></div>
                <div class="r-card" id="image-section"><h3 class="r-card-title"><span>🖼️</span> Image Background</h3>
                <p class="r-helper" style="margin-bottom:10px">Upload a static image to use as your background</p>
                <input type="file" id="image-file-input" accept="image/*" style="display:none">
                <div class="r-upload-zone" id="image-upload-zone"><div style="font-size:28px;margin-bottom:6px">📤</div>
                <div style="color:#b5b5b5;font-size:13px;font-weight:500;margin-bottom:4px">Upload Image File</div>
                <div style="color:#808080;font-size:11px">Click to browse • Max 5MB • JPG, PNG, GIF</div></div>
                <div id="image-file-preview" style="display:none"></div></div>`
        });
        content.appendChild(basicTab);

        // appearance tab
        const appearanceTab = Object.assign(document.createElement('div'), {
            className: 'r-tab-content',
            innerHTML: `<div class="r-card"><h3 class="r-card-title"><span>🎨</span> Text Color</h3>
                <label class="r-label"><span class="r-label-text">Custom text color</span>
                <label class="r-toggle"><input type="checkbox" id="override-text-color" ${localstoragegetternator('override_text_color') === 'true' ? 'checked' : ''}>
                <span class="r-slider"></span></label></label>
                <div id="text-color-group" style="margin-top:14px;transition:opacity .2s;${localstoragegetternator('override_text_color') === 'true' ? '' : 'opacity:.3;pointer-events:none'}">
                <div style="display:flex;align-items:center;gap:10px">
                <input type="color" id="text-color" value="${sanitizeColor(localstoragegetternator('text_color', '#ffffff'))}" style="width:50px;height:50px;border:none;border-radius:8px;cursor:pointer">
                <div style="flex:1"><input type="text" id="text-color-hex" class="r-input" value="${sanitizeColor(localstoragegetternator('text_color', '#ffffff'))}" style="font-family:Consolas,monospace;text-align:center;font-size:12px"></div>
                <div style="padding:14px 20px;background:#2a2a2a;border-radius:8px;border:1px solid #3d3d3d">
                <span id="text-color-preview" style="font-size:13px;font-weight:600">Preview</span></div></div>
                <p class="r-helper">This will change all text on the page to your selected color</p></div></div>`
        });
        content.appendChild(appearanceTab);

        // the advanced tav
        const advancedTab = Object.assign(document.createElement('div'), {
            className: 'r-tab-content',
            innerHTML: `<div class="r-card"><h3 class="r-card-title"><span>⚙️</span> Advanced Settings</h3>
                <label class="r-label"><span class="r-label-text">Enable Advanced UI Styling</span>
                <label class="r-toggle"><input type="checkbox" id="use-advanced" ${localstoragegetternator('use_advanced') === 'true' ? 'checked' : ''}>
                <span class="r-slider"></span></label></label>
                <p class="r-helper" style="margin-bottom:12px; color: red;">These styles are not documented correctly yet. So yea advanced users only.</p>
                <div class="r-adv-grid" id="advanced-grid" style="${localstoragegetternator('use_advanced') === 'true' ? '' : 'display:none'}"></div></div>`
        });
        content.appendChild(advancedTab);
        popup.appendChild(content);

        // the footor of the popup
        const footer = Object.assign(document.createElement('div'), {
            style: 'padding:16px 20px;background:#1e1e1e;border-top:1px solid #2a2a2a;display:flex;justify-content:space-between;gap:10px'
        });

        const resetBtn = Object.assign(document.createElement('button'), {
            textContent: '🔄 Reset All',
            style: 'padding:10px 18px;background:#2a2a2a;color:#b5b5b5;border:1px solid #3d3d3d;border-radius:7px;cursor:pointer;font-weight:500;font-size:13px;transition:.15s',
            onmouseover() { this.style.cssText += ';background:#3d3d3d;color:#fff' },
            onmouseout() { this.style.cssText = this.style.cssText.replace(/;background:#3d3d3d;color:#fff/, '') }
        });

        const saveBtn = Object.assign(document.createElement('button'), {
            textContent: '✓ Save Changes',
            style: 'padding:10px 26px;background:linear-gradient(135deg,#5fb589,#2f4f3f);color:#fff;border:none;border-radius:7px;cursor:pointer;font-weight:600;font-size:13px;transition:.15s;box-shadow:0 3px 10px rgba(95,181,137,.3)',
            onmouseover() { this.style.transform = 'translateY(-2px)'; this.style.boxShadow = '0 5px 14px rgba(95,181,137,.4)' },
            onmouseout() { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 3px 10px rgba(95,181,137,.3)' }
        });

        footer.append(resetBtn, saveBtn);
        popup.appendChild(footer);

        // uhhhhhh the elemnt refreenrencessss
        const $ = (sel) => popup.querySelector(sel);
        const useAnimated = $('#use-animated');
        const videoSection = $('#video-section');
        const imageSection = $('#image-section');
        const videoUrl = $('#video-url');
        const overrideTextColor = $('#override-text-color');
        const textColorGroup = $('#text-color-group');
        const textColorInput = $('#text-color');
        const textColorHex = $('#text-color-hex');
        const textColorPreview = $('#text-color-preview');
        const useAdvanced = $('#use-advanced');
        const advancedGrid = $('#advanced-grid');

        // the file upload
        const updateFilePreview = (type) => {
            const fileData = getFile(type);
            const preview = document.querySelector(`#${type}-file-preview`);
            if (fileData) {
                preview.innerHTML = `<div class="r-file-preview"><div class="r-file-info">
                    <span style="font-size:20px">${type === 'video' ? '📹' : '🖼️'}</span>
                    <div><div style="font-weight:500" class="r-filename"></div>
                    <div style="font-size:10px;color:#808080;margin-top:2px">${(fileData.size / 1024 / 1024).toFixed(2)} MB</div></div></div>
                    <button class="r-remove-btn">Remove</button></div>`;

                // no attakcs here
                preview.querySelector('.r-filename').textContent = fileData.name;

                preview.style.display = 'block';
                preview.querySelector('.r-remove-btn').onclick = () => {
                    deleteFile(type);
                    preview.style.display = 'none';
                    preview.innerHTML = '';
                    document.querySelector(`#${type}-file-input`).value = '';
                };
            }
        };

        const setupFileUpload = (type) => {
            const input = $(`#${type}-file-input`);
            const zone = $(`#${type}-upload-zone`);
            zone.onclick = () => input.click();
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    try { await saveFile(type, file); updateFilePreview(type); }
                    catch (err) { alert(err.message); input.value = ''; }
                }
            };
        };
        setupFileUpload('video');
        setupFileUpload('image');

        // this does tab switching stuff
        popup.querySelectorAll('.r-tab').forEach(tab => {
            tab.onclick = () => {
                popup.querySelectorAll('.r-tab').forEach(t => t.classList.remove('active'));
                popup.querySelectorAll('.r-tab-content').forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                $(`.r-tab-content:nth-child(${Array.from(tab.parentNode.children).indexOf(tab) + 2})`).classList.add('active');
            };
        });

        // update the visibiltiyiedsadasdasdjkahgdiakhgdikagsdJ
        const updateVisibility = () => {
            videoSection.style.display = useAnimated.checked ? 'block' : 'none';
            imageSection.style.display = useAnimated.checked ? 'none' : 'block';
            textColorGroup.style.opacity = overrideTextColor.checked ? '1' : '.3';
            textColorGroup.style.pointerEvents = overrideTextColor.checked ? 'auto' : 'none';
            textColorPreview.style.color = textColorInput.value;
            advancedGrid.style.display = useAdvanced.checked ? 'grid' : 'none';
        };

        useAnimated.addEventListener('change', updateVisibility);
        overrideTextColor.addEventListener('change', updateVisibility);
        useAdvanced.addEventListener('change', updateVisibility);

        textColorInput.addEventListener('input', () => {
            textColorHex.value = textColorInput.value;
            textColorPreview.style.color = textColorInput.value;
        });

        textColorHex.addEventListener('input', () => {
            if (/^#[0-9A-F]{6}$/i.test(textColorHex.value)) {
                textColorInput.value = textColorHex.value;
                textColorPreview.style.color = textColorHex.value;
            }
        });

        updateVisibility();

        // bro finding all of these stiles on the roblox website was a pain
        const styleMap = {
            'profile-header': 'Profile Header', 'tabs-nav': 'Navigation Tabs', 'avatar-mask': 'Avatar Container',
            'collections': 'Collections', 'switcher': 'Switcher', 'stats-panel': 'Statistics',
            'search-input': 'Search Input', 'item-details': 'Item Details', 'comment-section': 'Comments',
            'charts-container': 'Charts', 'vertical-menu': 'Vertical Menu', 'store-card-footer': 'Store Footer',
            'submenu': 'Submenu', 'chat-body': 'Chat Body', 'dropdown-menu': 'Dropdown',
            'select-group': 'Select Group', 'game-stats': 'Game Stats', 'server-banner': 'Server Banner',
            'badge-rows': 'Badge Rows', 'security-container': 'Security Settings', 'security-desc': 'Security Desc',
            'footer': 'Footer'
        };

        // random defaults
        const defaultStyles = {
            'profile-header': 'rgba(40,40,40,0.85)', 'tabs-nav': 'rgba(50,50,50,0.85)', 'avatar-mask': 'rgba(45,45,45,0.85)',
            'collections': 'rgba(40,40,40,0.85)', 'switcher': 'rgba(50,50,50,0.85)', 'stats-panel': 'rgba(45,45,45,0.85)',
            'search-input': 'rgba(40,40,40,0.85)', 'item-details': 'rgba(50,50,50,0.85)', 'comment-section': 'rgba(45,45,45,0.85)',
            'charts-container': 'rgba(40,40,40,0.85)', 'vertical-menu': 'rgba(50,50,50,0.85)', 'store-card-footer': 'rgba(45,45,45,0.85)',
            'submenu': 'rgba(40,40,40,0.85)', 'chat-body': 'rgba(50,50,50,0.85)', 'dropdown-menu': 'rgba(45,45,45,0.85)',
            'select-group': 'rgba(40,40,40,0.85)', 'game-stats': 'rgba(50,50,50,0.85)', 'server-banner': 'rgba(45,45,45,0.85)',
            'badge-rows': 'rgba(40,40,40,0.85)', 'security-container': 'rgba(50,50,50,0.85)', 'security-desc': 'rgba(45,45,45,0.85)',
            'footer': 'rgba(40,40,40,0.85)'
        };

        Object.entries(styleMap).forEach(([key, label]) => {
            const saved = sanitizeCssValue(localstoragegetternator(`style_${key}`, defaultStyles[key]));
            advancedGrid.innerHTML += `<div class="r-adv-item"><label class="r-adv-label">${escapeHtmlnoxssattackvectors(label)}</label>
                <input type="text" class="r-input" data-key="${sanitizeAttribute(key)}" value="${sanitizeAttribute(saved)}"
                style="font-family:Consolas,monospace;font-size:11px;padding:6px" placeholder="rgba(0,0,0,0.85)"></div>`;
        });

        // save button
        saveBtn.onclick = () => {
            localStorage.setItem('ROLOCATE_CUSTOMBACKGROUND_use_animated', useAnimated.checked);
            localStorage.setItem('ROLOCATE_CUSTOMBACKGROUND_video_url', videoUrl.value.trim());
            localStorage.setItem('ROLOCATE_CUSTOMBACKGROUND_override_text_color', overrideTextColor.checked);
            localStorage.setItem('ROLOCATE_CUSTOMBACKGROUND_text_color', textColorInput.value);
            localStorage.setItem('ROLOCATE_CUSTOMBACKGROUND_use_advanced', useAdvanced.checked);
            if (useAdvanced.checked) {
                advancedGrid.querySelectorAll('input[data-key]').forEach(input => {
                    localStorage.setItem(`ROLOCATE_CUSTOMBACKGROUND_style_${input.dataset.key}`, input.value.trim());
                });
            }
            applycustombackgrounds();
            popup.style.animation = 'rSlideIn .2s reverse';
            overlay.style.animation = 'rFadeIn .2s reverse';
            setTimeout(() => { overlay.remove(); popup.remove(); }, 200);
        };

        // reset button
        resetBtn.onclick = () => {
            const confirm = Object.assign(document.createElement('div'), {
                innerHTML: `<h3 style="margin:0 0 10px;color:#e0e0e0;font-size:15px;font-weight:600">⚠️ Reset Everything?</h3>
                    <p style="margin:0 0 20px;color:#b5b5b5;font-size:12px;line-height:1.5">This will restore all settings to defaults and delete all uploaded files. This cannot be undone.</p>
                    <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button id="cancel-reset" style="padding:8px 16px;background:#2a2a2a;color:#b5b5b5;border:1px solid #3d3d3d;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;transition:.15s">Cancel</button>
                    <button id="confirm-reset" style="padding:8px 16px;background:#5a3838;color:#ffb0b0;border:1px solid #6d4545;border-radius:7px;cursor:pointer;font-size:12px;font-weight:600;transition:.15s">Reset All</button></div>`,
                style: 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1e1e1e;border:1px solid #3d3d3d;border-radius:10px;padding:24px;z-index:99999999;box-shadow:0 20px 50px rgba(0,0,0,.9);animation:rSlideIn .2s;min-width:320px'
            });
            document.body.appendChild(confirm);

            const cancel = confirm.querySelector('#cancel-reset');
            const confirmBtn = confirm.querySelector('#confirm-reset');
            cancel.onmouseover = () => { cancel.style.background = '#3d3d3d'; cancel.style.color = '#fff'; };
            cancel.onmouseout = () => { cancel.style.background = '#2a2a2a'; cancel.style.color = '#b5b5b5'; };
            confirmBtn.onmouseover = () => confirmBtn.style.background = '#6d4545';
            confirmBtn.onmouseout = () => confirmBtn.style.background = '#5a3838';
            cancel.onclick = () => confirm.remove();
            confirmBtn.onclick = () => {
                Object.keys(localStorage).forEach(k => { if (k.startsWith('ROLOCATE_CUSTOMBACKGROUND_')) localStorage.removeItem(k); });
                deleteFile('video');
                deleteFile('image');
                confirm.remove();
                location.reload();
            };
        };
        document.body.append(overlay, popup);

        updateFilePreview('video');
        updateFilePreview('image');
    }


    /*******************************************************
    name of function: openGameQualitySettings
    description: opens game quality settings
    *******************************************************/
    function openGameQualitySettings() {
        if (document.getElementById('game-settings-modal')) return;

        // make the dark overlay thing
        const overlay = document.createElement('div');
        overlay.id = 'game-settings-modal';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'modal-title');
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;

        // the actual modal box
        const modal = document.createElement('div');
        modal.style.cssText = `
        background: #1a1a1a;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        width: 480px;
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.95) translateY(20px);
        transition: all 0.2s ease;
        color: #ffffff;
        border: 1px solid #404040;
    `;

        const form = document.createElement('form');
        form.setAttribute('novalidate', '');

        // title text
        const title = document.createElement('h2');
        title.id = 'modal-title';
        title.textContent = 'Game Quality Settings';
        title.style.cssText = `
        margin: 0 0 24px 0;
        font-size: 24px;
        font-weight: 600;
        color: #e0e0e0;
        text-align: center;
        line-height: 1.3;
    `;

        // rating slider section
        const ratingSection = document.createElement('div');
        ratingSection.style.cssText = `
        margin-bottom: 32px;
        padding: 24px;
        background: #2a2a2a;
        border-radius: 10px;
        border: 1px solid #404040;
    `;

        const ratingFieldset = document.createElement('fieldset');
        ratingFieldset.style.cssText = `
        border: none;
        padding: 0;
        margin: 0;
    `;

        const ratingLegend = document.createElement('legend');
        ratingLegend.textContent = 'Game Rating Threshold';
        ratingLegend.style.cssText = `
        font-weight: 600;
        color: #e0e0e0;
        font-size: 16px;
        margin-bottom: 16px;
        padding: 0;
    `;

        const ratingContainer = document.createElement('div');
        ratingContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 16px;
    `;

        const ratingSlider = document.createElement('input');
        ratingSlider.type = 'range';
        ratingSlider.id = 'game-rating-slider';
        ratingSlider.name = 'gameRating';
        ratingSlider.min = '1';
        ratingSlider.max = '100';
        ratingSlider.step = '1';
        ratingSlider.value = localStorage.getItem('ROLOCATE_gamerating') || '75';
        ratingSlider.setAttribute('aria-label', 'Game rating threshold percentage');
        ratingSlider.style.cssText = `
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: #333333;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
    `;

        // slider thumb styles
        const sliderStyles = document.createElement('style');
        sliderStyles.textContent = `
        #game-rating-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #166534;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        #game-rating-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #166534;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        #game-rating-slider:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.25);
        }
        #game-rating-slider:focus::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.25);
        }
    `;
        document.head.appendChild(sliderStyles);

        const ratingDisplay = document.createElement('div');
        ratingDisplay.style.cssText = `
        min-width: 60px;
        text-align: center;
        font-weight: 600;
        color: #cccccc;
        font-size: 16px;
    `;

        const ratingValue = document.createElement('span');
        ratingValue.id = 'rating-value';
        ratingValue.textContent = `${ratingSlider.value}%`;
        ratingValue.setAttribute('aria-live', 'polite');

        const ratingDescription = document.createElement('p');
        ratingDescription.style.cssText = `
        margin: 12px 0 0 0;
        font-size: 14px;
        color: #b0b0b0;
        line-height: 1.4;
    `;
        ratingDescription.textContent = 'Show games with ratings at or above this threshold';

        ratingSlider.addEventListener('input', function() {
            ratingValue.textContent = `${this.value}%`;
        });

        ratingDisplay.appendChild(ratingValue);
        ratingContainer.appendChild(ratingSlider);
        ratingContainer.appendChild(ratingDisplay);
        ratingFieldset.appendChild(ratingLegend);
        ratingFieldset.appendChild(ratingContainer);
        ratingFieldset.appendChild(ratingDescription);
        ratingSection.appendChild(ratingFieldset);

        // player count section
        const playerSection = document.createElement('div');
        playerSection.style.cssText = `
        margin-bottom: 32px;
        padding: 24px;
        background: #2a2a2a;
        border-radius: 10px;
        border: 1px solid #404040;
    `;

        const playerFieldset = document.createElement('fieldset');
        playerFieldset.style.cssText = `
        border: none;
        padding: 0;
        margin: 0;
    `;

        const playerLegend = document.createElement('legend');
        playerLegend.textContent = 'Player Count Range';
        playerLegend.style.cssText = `
        font-weight: 600;
        color: #e0e0e0;
        font-size: 16px;
        margin-bottom: 16px;
        padding: 0;
    `;

        const inputGrid = document.createElement('div');
        inputGrid.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 12px;
    `;

        // get existing player count or defaults
        const existingPlayerCount = localStorage.getItem('ROLOCATE_playercount');
        let minPlayerValue = '2500',
            maxPlayerValue = 'unlimited';

        if (existingPlayerCount) {
            try {
                const playerCountData = JSON.parse(existingPlayerCount);
                minPlayerValue = playerCountData.min || '2500';
                maxPlayerValue = playerCountData.max || 'unlimited';
            } catch (e) {
                ConsoleLogEnabled('Failed to parse player count data, using defaults');
            }
        }

        // function to create input containers
        function createInputContainer(labelText, inputType, inputId, inputName, inputValue, extraAttrs = {}) {
            const container = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = labelText;
            label.setAttribute('for', inputId);
            label.style.cssText = `
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #e0e0e0;
            font-size: 14px;
        `;

            const input = document.createElement('input');
            input.type = inputType;
            input.id = inputId;
            input.name = inputName;
            input.value = inputValue;
            input.setAttribute('aria-describedby', 'player-count-desc');
            input.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #333333;
            border: 2px solid #555555;
            border-radius: 8px;
            color: #ffffff;
            font-size: 14px;
            transition: border-color 0.15s ease;
            outline: none;
            box-sizing: border-box;
        `;

            // add extra attributes
            Object.entries(extraAttrs).forEach(([key, value]) => {
                input.setAttribute(key, value);
            });

            container.appendChild(label);
            container.appendChild(input);
            return {
                container,
                input
            };
        }

        // min player input
        const minData = createInputContainer('Minimum Players', 'number', 'min-players', 'minPlayers', minPlayerValue, {
            min: '0',
            max: '1000000'
        });

        // max player input
        const maxData = createInputContainer('Maximum Players', 'text', 'max-players', 'maxPlayers', maxPlayerValue, {
            placeholder: 'Enter number or "unlimited"'
        });

        // fix max label color
        maxData.container.querySelector('label').style.color = '#495057';

        const playerDescription = document.createElement('p');
        playerDescription.id = 'player-count-desc';
        playerDescription.style.cssText = `
        margin: 0;
        font-size: 14px;
        color: #b0b0b0;
        line-height: 1.4;
    `;
        playerDescription.textContent = 'Filter games by active player count. Use "unlimited" for no upper limit.';

        // error message thing
        const errorContainer = document.createElement('div');
        errorContainer.style.cssText = `
        margin-top: 12px;
        padding: 8px 12px;
        background: #2a2a2a;
        color: #ff4757;
        border: 1px solid #ff6b6b;
        border-radius: 8px;
        font-size: 14px;
        display: none;
    `;

        // validation and focus effects for inputs
        [minData.input, maxData.input].forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#166534';
                this.style.boxShadow = '0 0 0 3px rgba(22, 101, 52, 0.25)';
            });

            input.addEventListener('blur', function() {
                this.style.borderColor = '#555555';
                this.style.boxShadow = 'none';
                validateInputs();
            });

            input.addEventListener('input', validateInputs);
        });

        function validateInputs() {
            errorContainer.style.display = 'none';
            const minValue = parseInt(minData.input.value);
            const maxValue = maxData.input.value.toLowerCase() === 'unlimited' ? Infinity : parseInt(maxData.input.value);

            if (isNaN(minValue) || minValue < 0) {
                errorContainer.textContent = 'Minimum player count must be a valid number greater than or equal to 0.';
                errorContainer.style.display = 'block';
                return false;
            }
            if (maxData.input.value.toLowerCase() !== 'unlimited' && (isNaN(maxValue) || maxValue < 0)) {
                errorContainer.textContent = 'Maximum player count must be a valid number or "unlimited".';
                errorContainer.style.display = 'block';
                return false;
            }
            if (maxValue !== Infinity && minValue > maxValue) {
                errorContainer.textContent = 'Minimum player count cannot be greater than maximum player count.';
                errorContainer.style.display = 'block';
                return false;
            }
            return true;
        }

        inputGrid.appendChild(minData.container);
        inputGrid.appendChild(maxData.container);
        playerFieldset.appendChild(playerLegend);
        playerFieldset.appendChild(inputGrid);
        playerFieldset.appendChild(playerDescription);
        playerFieldset.appendChild(errorContainer);
        playerSection.appendChild(playerFieldset);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 32px;
    `;

        // helper for button creation
        function createButton(text, type, bgColor, borderColor, hoverBg, hoverBorder) {
            const button = document.createElement('button');
            button.type = type;
            button.textContent = text;
            button.style.cssText = `
            padding: 12px 24px;
            background: ${bgColor};
            color: ${type === 'submit' ? 'white' : '#cccccc'};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.15s ease;
            outline: none;
        `;

            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = hoverBg;
                this.style.borderColor = hoverBorder;
            });

            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = bgColor;
                this.style.borderColor = borderColor;
            });

            button.addEventListener('focus', function() {
                this.style.boxShadow = type === 'submit' ? '0 0 0 3px rgba(22, 101, 52, 0.25)' : '0 0 0 3px rgba(108, 117, 125, 0.25)';
            });

            button.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
            });

            return button;
        }

        const cancelButton = createButton('Cancel', 'button', '#333333', '#555555', '#404040', '#666666');
        const saveButton = createButton('Save Settings', 'submit', '#166534', '#166534', '#14532d', '#14532d');

        // form submit handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validateInputs()) return;

            try {
                const playerCountData = {
                    min: minData.input.value,
                    max: maxData.input.value
                };

                localStorage.setItem('ROLOCATE_gamerating', ratingSlider.value);
                localStorage.setItem('ROLOCATE_playercount', JSON.stringify(playerCountData));
                closeModal();
            } catch (error) {
                ConsoleLogEnabled('Failed to save settings:', error);
                errorContainer.textContent = 'Failed to save settings. Please try again.';
                errorContainer.style.display = 'block';
            }
        });

        cancelButton.addEventListener('click', closeModal);

        // close modal with animation
        function closeModal() {
            modal.style.transform = 'scale(0.95) translateY(20px)';
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(overlay)) document.body.removeChild(overlay);
                if (document.head.contains(sliderStyles)) document.head.removeChild(sliderStyles);
            }, 200);
        }

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);

        // put it all together
        form.appendChild(title);
        form.appendChild(ratingSection);
        form.appendChild(playerSection);
        form.appendChild(buttonContainer);
        modal.appendChild(form);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);

        // show modal with animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1) translateY(0)';
        });

        // focus first input
        setTimeout(() => ratingSlider.focus(), 250);
    }



    function qualityfilterRobloxGames() {

        // exit if on home page or filter disabled
        if (/^https?:\/\/(www\.)?roblox\.com(\/[a-z]{2})?\/home\/?$/i.test(window.location.href)) {
            ConsoleLogEnabled("On roblox.com/home. Gamequalityfilter Exiting function.");
            return;
        }
        if (localStorage.ROLOCATE_gamequalityfilter !== "true") return;
        if (window.robloxGameFilterObserver) window.robloxGameFilterObserver.disconnect();

        const seenCards = new WeakSet();

        function parsePlayerCount(text) {
            if (!text) return 0;
            const clean = text.replace(/[,\s]/g, '').toLowerCase();
            const multiplier = clean.includes('k') ? 1000 : clean.includes('m') ? 1000000 : 1;
            const number = parseFloat(clean.replace(/[km]/, ''));
            return isNaN(number) ? 0 : number * multiplier;
        }

        function getFilterSettings() {
            return {
                rating: parseInt(localStorage.getItem('ROLOCATE_gamerating') || '80'),
                playerCount: (() => {
                    const data = JSON.parse(localStorage.getItem('ROLOCATE_playercount') || '{"min":"5000","max":"unlimited"}');
                    return {
                        min: parseInt(data.min),
                        max: data.max === 'unlimited' ? Infinity : parseInt(data.max)
                    };
                })()
            };
        }

        function filterCard(card, settings) {
            if (seenCards.has(card)) return;
            seenCards.add(card);

            let rating = 0;
            const ratingSelectors = [
                '.vote-percentage-label',
                '[data-testid="game-tile-stats-rating"] .vote-percentage-label',
                '.game-card-info .vote-percentage-label',
                '.base-metadata .vote-percentage-label'
            ];
            for (const sel of ratingSelectors) {
                const el = card.querySelector(sel);
                if (el) {
                    const match = el.textContent.match(/(\d+)%/);
                    if (match) {
                        rating = parseInt(match[1]);
                        break;
                    }
                }
            }

            let playerCount = 0;
            let hasPlayerCount = false;
            const pcEl = card.querySelector('.playing-counts-label');
            if (pcEl) {
                playerCount = parsePlayerCount(pcEl.textContent);
                hasPlayerCount = true;
            }

            const shouldShow = (
                rating >= settings.rating &&
                (!hasPlayerCount || (playerCount >= settings.playerCount.min && playerCount <= settings.playerCount.max))
            );

            card.style.display = shouldShow ? '' : 'none';
        }

        function filterAllCards() {
            const settings = getFilterSettings();

            const cards = document.querySelectorAll(`
            li.game-card,
            li[data-testid="wide-game-tile"],
            .grid-item-container.game-card-container
        `);
            cards.forEach(card => filterCard(card, settings));
        }

        // run filtering every second to pick up new cards and setting changes
        // plz no memoryt leak
        const intervalId = setInterval(() => {
            try {
                filterAllCards();
            } catch (err) {
                ConsoleLogEnabled('[ROLOCATE] Filter error:', err);
            }
        }, 1000);

        const observer = new MutationObserver(() => {
            filterAllCards();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }



    /***************************************************************
     *  name of function: showOldRobloxGreeting
     *  description: shows old roblox greeting if setting is turned on
     ****************************************************************/
    async function showOldRobloxGreeting() {
        const implementation = async () => {
            ConsoleLogEnabled("Function showOldRobloxGreeting() started.");

            // if we are on homepage
            if (!/^https?:\/\/(www\.)?roblox\.com(\/[a-z]{2})?\/home\/?$/i.test(window.location.href)) {
                ConsoleLogEnabled("Not on roblox.com/home. Exiting function.");
                return;
            }

            if (localStorage.getItem("ROLOCATE_ShowOldGreeting") !== "true") {
                ConsoleLogEnabled("ShowOldGreeting is disabled. Exiting function.");
                return;
            }

            // wait for apge to laod
            await new Promise(r => setTimeout(r, 500));

            // functions
            const observeElement = (selector) => {
                return new Promise((resolve) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        ConsoleLogEnabled(`Element found immediately: ${selector}`);
                        return resolve(element);
                    }

                    ConsoleLogEnabled(`Observing for element: ${selector}`);
                    const observer = new MutationObserver(() => {
                        const element = document.querySelector(selector);
                        if (element) {
                            ConsoleLogEnabled(`Element found: ${selector}`);
                            observer.disconnect();
                            resolve(element);
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            };

            const fetchAvatar = async (selector, fallbackImage) => {
                ConsoleLogEnabled(`Fetching avatar from selector: ${selector}`);
                for (let attempt = 0; attempt < 3; attempt++) {
                    ConsoleLogEnabled(`Attempt ${attempt + 1} to fetch avatar.`);
                    const imgElement = document.querySelector(selector);
                    if (imgElement && imgElement.src !== fallbackImage) {
                        ConsoleLogEnabled(`Avatar found: ${imgElement.src}`);
                        return imgElement.src;
                    }
                    await new Promise(r => setTimeout(r, 1500));
                }
                ConsoleLogEnabled("Avatar not found, using fallback image.");
                return fallbackImage;
            };

            const getTimeBasedGreeting = (username) => {
                const hour = new Date().getHours();
                if (hour < 12) return `Morning, ${username}!`;
                if (hour < 18) return `Afternoon, ${username}!`;
                return `Evening, ${username}!`;
            };

            try {
                // elements needed
                const homeContainer = await observeElement("#HomeContainer .section:first-child");
                ConsoleLogEnabled("Home container located.");

                const userNameElement = document.querySelector("#navigation.rbx-left-col > ul > li > a .font-header-2");
                const rawUsername = userNameElement ? userNameElement.innerText : "Robloxian";
                ConsoleLogEnabled(`User name found: ${rawUsername}`);

                const styleId = 'rolocate-greeting-styles';
                if (!document.getElementById(styleId)) {
                    const styleTag = document.createElement("style");
                    styleTag.id = styleId;
                    styleTag.textContent = `
                    .rolocate-greeting-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 16px;
                        padding: 30px;
                        background: #1a1c23;
                        border-radius: 12px;
                        border: 1px solid #2a2a30;
                        min-height: 180px;
                    }
                    .rolocate-profile-frame {
                        width: 140px;
                        height: 140px;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 3px solid #2a2a30;
                    }
                    .rolocate-profile-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    .rolocate-user-details {
                        margin-left: 25px;
                    }
                    .rolocate-user-name {
                        font-size: 2em;
                        font-weight: 600;
                        color: #ffffff;
                        margin: 0;
                        font-family: 'Segoe UI', Roboto, sans-serif;
                    }
                `;
                    document.head.appendChild(styleTag);
                }

                // header creation
                const headerContainer = document.createElement("div");
                headerContainer.className = "rolocate-greeting-header";

                // make profile
                const profileFrame = document.createElement("div");
                profileFrame.className = "rolocate-profile-frame";
                const profileImage = document.createElement("img");
                profileImage.className = "rolocate-profile-img";
                profileImage.src = await fetchAvatar("#navigation.rbx-left-col > ul > li > a img",
                    window.Base64Images?.image_place_holder || "https://www.roblox.com/Thumbs/Asset.ashx?width=100&height=100&assetId=0");
                profileFrame.appendChild(profileImage);

                // make greeting
                const userDetails = document.createElement("div");
                userDetails.className = "rolocate-user-details";
                const userName = document.createElement("h1");
                userName.className = "rolocate-user-name";
                userName.textContent = getTimeBasedGreeting(rawUsername);
                userDetails.appendChild(userName);

                // mix them
                headerContainer.appendChild(profileFrame);
                headerContainer.appendChild(userDetails);

                homeContainer.replaceWith(headerContainer);

                ConsoleLogEnabled("Greeting header created successfully.");

            } catch (error) {
                ConsoleLogEnabled(`Error creating greeting: ${error.message}`);
            }
        };

        // add them
        implementation().catch(error => {
            ConsoleLogEnabled("Error in showOldRobloxGreeting:", error);
        });
    }



    /*******************************************************
    name of function: observeURLChanges
    description: observes url changes for the old old greeting,
    quality game filter, and betterfriends
    *******************************************************/
    function observeURLChanges() {
        // dont run this twice
        if (window.urlObserverActive) return;
        window.urlObserverActive = true;

        let lastUrl = window.location.href.split("#")[0];

        const checkUrl = () => {
            const currentUrl = window.location.href.split("#")[0];
            if (currentUrl !== lastUrl) {
                ConsoleLogEnabled(`URL changed from ${lastUrl} to ${currentUrl}`);
                lastUrl = currentUrl;

                // if we go back to home page do the stuff
                if (/roblox\.com(\/[a-z]{2})?\/home/.test(currentUrl)) {
                    ConsoleLogEnabled("back on home page");
                    betterfriends();
                    quicklaunchgamesfunction();
                    showOldRobloxGreeting();
                }


                // if on games or discover pages do gamequalityfilter
                if (/roblox\.com(\/[a-z]{2})?\/(games(\/.*)?|discover(\/.*)?)\/?$/.test(currentUrl)) {
                    ConsoleLogEnabled("on games or discover page");
                    qualityfilterRobloxGames();
                }
            }
        };

        // hook into history changes if not already done
        if (!window.historyIntercepted) {
            const interceptHistoryMethod = (method) => {
                const original = history[method];
                history[method] = function(...args) {
                    const result = original.apply(this, args);
                    setTimeout(checkUrl, 0);
                    return result;
                };
            };

            interceptHistoryMethod('pushState');
            interceptHistoryMethod('replaceState');
            window.historyIntercepted = true;
        }

        // save handler so we can remove it later if needed
        window.urlChangeHandler = checkUrl;

        // get rid of old popstate if it exists to avoid duplicates
        if (window.urlChangeHandler) {
            window.removeEventListener('popstate', window.urlChangeHandler);
        }
        window.addEventListener('popstate', checkUrl);
    }

    /*******************************************************
    name of function: validateManualMode
    description: Check if user set their location manually
    or if it is still in automatic. Some error handling also
    *******************************************************/
    // why tf did i put this all the way down here
    function validateManualMode() {
        // if manual mode
        if (localStorage.getItem("ROLOCATE_prioritylocation") === "manual") {
            ConsoleLogEnabled("Manual mode detected");

            try {
                // get cooridnates
                const coords = JSON.parse(GM_getValue("ROLOCATE_coordinates", '{"lat":"","lng":""}'));
                ConsoleLogEnabled("Coordinates fetched:", coords);

                // if coordiates are missing switch to auatomcait
                if (!coords.lat || !coords.lng) {
                    localStorage.setItem("ROLOCATE_prioritylocation", "automatic");
                    ConsoleLogEnabled("No coordinates set. Switched to automatic mode.");
                    return true;
                }
            } catch (error) {
                ConsoleLogEnabled("Error checking coordinates:", error);
                // if error swithc to automatic
                localStorage.setItem("ROLOCATE_prioritylocation", "automatic");
                ConsoleLogEnabled("Error encountered while fetching coordinates. Switched to automatic mode.");
                return true;
            }
        }
        ConsoleLogEnabled("No Errors detected with manual mode.");
        return false;
    }



    /*******************************************************
    name of function: loadBase64Library
    description: Loads base64 images
    *******************************************************/
    function loadBase64Library(callback, timeout = 5000) {
        let elapsed = 0;
        (function waitForLibrary() {
            if (typeof window.Base64Images === "undefined") {
                if (elapsed < timeout) {
                    elapsed += 50;
                    setTimeout(waitForLibrary, 50);
                } else {
                    ConsoleLogEnabled("Base64Images did not load within the timeout.");
                    notifications('An error occurred! No icons will show. Please refresh the page.', 'error', '⚠️', '8000');
                }
            } else {
                if (callback) callback();
            }
        })();
    }



    /*******************************************************
    name of function: loadmutualfriends
    description: shows mutual friends. optimized version with minimal API calls.
    *******************************************************/
    async function loadmutualfriends() {
        // check if mutualfriends is enabled in localStorage and double check if url is the correct one.
        if (localStorage.getItem("ROLOCATE_mutualfriends") !== "true" || !/^\/(?:[a-z]{2}\/)?users\/\d+\/profile$/.test(window.location.pathname)) return;
        // store for spedup
        let localAvatarCache = {};

        // function to get current user ID
        const getCurrentUserId = () => Roblox?.CurrentUser?.userId || null;

        // function to fetch user details in batch (up to 100 at once)
        const fetchUserDetailsBatch = (userIds) => {
            if (userIds.length === 0) return Promise.resolve([]);

            const url = `https://users.roblox.com/v1/users`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({ userIds: userIds.slice(0, 100) }),
                    onload: function(response) {
                        if (response.status === 429) {
                            ConsoleLogEnabled(`[fetchUserDetailsBatch] Rate limited - stopping requests`);
                            resolve(null);
                            return;
                        }
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data.data || []);
                            } catch (e) {
                                ConsoleLogEnabled(`[fetchUserDetailsBatch] Failed to parse response`, e);
                                resolve([]);
                            }
                        } else {
                            ConsoleLogEnabled(`[fetchUserDetailsBatch] Request failed with status ${response.status}`);
                            resolve([]);
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled(`[fetchUserDetailsBatch] Network error`, err);
                        resolve([]);
                    }
                });
            });
        };

        // function to fetch friends
        const gmFetchFriends = async (userId) => {
            const url = `https://friends.roblox.com/v1/users/${userId}/friends`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: function(response) {
                        if (response.status === 429) {
                            ConsoleLogEnabled(`[gmFetchFriends] Rate limited for user ${userId}`);
                            resolve(null);
                            return;
                        }
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data.data);
                            } catch (e) {
                                ConsoleLogEnabled(`[gmFetchFriends] Failed to parse response for user ${userId}`, e);
                                resolve(null);
                            }
                        } else {
                            ConsoleLogEnabled(`[gmFetchFriends] Request failed for user ${userId} with status ${response.status}`);
                            resolve(null);
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled(`[gmFetchFriends] Network error for user ${userId}`, err);
                        resolve(null);
                    }
                });
            });
        };

        // function to fetch user avatars in batches
        const fetchUserAvatars = (userIds) => {
            return new Promise((resolve) => {
                const requests = userIds.slice(0, 100).map(userId => ({
                    requestId: userId.toString(),
                    targetId: userId,
                    type: "AvatarHeadShot",
                    size: "150x150",
                    format: "Png",
                    isCircular: false
                }));

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://thumbnails.roblox.com/v1/batch",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(requests),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const avatarMap = {};
                                data.data.forEach(item => {
                                    if (item.state === "Completed" && item.imageUrl) {
                                        avatarMap[item.targetId] = item.imageUrl;
                                    }
                                });
                                resolve(avatarMap);
                            } catch (e) {
                                ConsoleLogEnabled("[fetchUserAvatars] Failed to parse response", e);
                                resolve({});
                            }
                        } else {
                            ConsoleLogEnabled(`[fetchUserAvatars] Request failed with status ${response.status}`);
                            resolve({});
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled("[fetchUserAvatars] Network error", err);
                        resolve({});
                    }
                });
            });
        };

        // function to fetch and cache all avatars at once
        const fetchAllAvatars = async (mutualFriends) => {
            if (mutualFriends.length === 0) return {};

            ConsoleLogEnabled(`[fetchAllAvatars] Fetching avatars for ${mutualFriends.length} mutual friends`);

            const allIds = mutualFriends.map(f => f.id);
            const batches = [];

            for (let i = 0; i < allIds.length; i += 100) {
                batches.push(allIds.slice(i, i + 100));
            }

            const avatarResults = await Promise.all(batches.map(batch => fetchUserAvatars(batch)));
            const combinedAvatars = Object.assign({}, ...avatarResults);

            ConsoleLogEnabled(`[fetchAllAvatars] Cached ${Object.keys(combinedAvatars).length} avatars`);
            return combinedAvatars;
        };

        // function to create the mutual friends element with all styles
        const createMutualFriendsElement = () => {
            if (!document.querySelector('#mutual-friends-styles')) { // css stuff
                const style = document.createElement('style');
                style.id = 'mutual-friends-styles';
                style.textContent = `
                    .mutual-friends-container {
                      background: linear-gradient(135deg, #111114 0%, #1a1a1d 100%);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 12px;
                      padding: 20px;
                      margin: 20px 0;
                      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                      transition: all 0.2s ease;
                      position: relative;
                      overflow: hidden;
                      animation: slideInUp 0.3s ease-out;
                    }
                    .mutual-friends-container:hover {
                      background: linear-gradient(135deg, #1a1a1d 0%, #222226 100%);
                      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
                      transform: translateY(-1px);
                      border-color: rgba(255, 255, 255, 0.2);
                    }
                    @keyframes slideInUp {
                      from {
                        opacity: 0;
                        transform: translateY(20px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                    .mutual-friends-header {
                      display: flex;
                      align-items: center;
                      margin-bottom: 16px;
                      color: #ffffff;
                      font-size: 18px;
                      font-weight: 700;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      position: relative;
                      z-index: 1;
                    }
                    .mutual-friends-icon {
                      width: 24px;
                      height: 24px;
                      margin-right: 12px;
                      fill: url(#iconGradient);
                      flex-shrink: 0;
                    }
                    .mutual-friends-count {
                      background: linear-gradient(45deg, #4a90e2, #357abd);
                      color: white;
                      padding: 8px 14px;
                      border-radius: 20px;
                      font-size: 14px;
                      font-weight: 800;
                      margin-left: 12px;
                      box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
                      animation: bounceIn 0.3s ease-out;
                      min-width: 40px;
                      text-align: center;
                      border: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    @keyframes bounceIn {
                      0% {
                        transform: scale(0.5);
                        opacity: 0;
                      }
                      60% {
                        transform: scale(1.05);
                      }
                      100% {
                        transform: scale(1);
                        opacity: 1;
                      }
                    }
                    .mutual-friends-list {
                      display: flex;
                      flex-wrap: wrap;
                      gap: 12px;
                    }
                    .mutual-friend-tag {
                      background: rgba(255, 255, 255, 0.08);
                      color: #ffffff;
                      padding: 8px 16px;
                      border-radius: 25px;
                      font-size: 14px;
                      font-weight: 600;
                      border: 1px solid rgba(255, 255, 255, 0.15);
                      transition: all 0.15s ease;
                      cursor: pointer;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      white-space: nowrap;
                      position: relative;
                      overflow: hidden;
                      animation: fadeInScale 0.2s ease-out backwards;
                    }
                    .mutual-friend-tag:nth-child(1) {
                      animation-delay: 0.05s;
                    }
                    .mutual-friend-tag:nth-child(2) {
                      animation-delay: 0.1s;
                    }
                    .mutual-friend-tag:nth-child(3) {
                      animation-delay: 0.15s;
                    }
                    .mutual-friend-tag:nth-child(4) {
                      animation-delay: 0.2s;
                    }
                    .mutual-friend-tag:nth-child(5) {
                      animation-delay: 0.25s;
                    }
                    .mutual-friend-tag:nth-child(6) {
                      animation-delay: 0.3s;
                    }
                    @keyframes fadeInScale {
                      from {
                        opacity: 0;
                        transform: scale(0.9) translateY(10px);
                      }
                      to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                      }
                    }
                    .mutual-friend-tag:hover {
                      background: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.15),
                        rgba(255, 255, 255, 0.12)
                      );
                      border-color: rgba(255, 255, 255, 0.3);
                      transform: translateY(-2px) scale(1.02);
                      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                    }
                    .mutual-friends-more {
                      background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
                      border-color: rgba(255, 255, 255, 0.3) !important;
                      color: white !important;
                      font-weight: 700 !important;
                      padding-top: 13.5px;
                      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2) !important;
                    }
                    .mutual-friends-more:hover {
                      background: linear-gradient(45deg, #ff5722, #e68900) !important;
                      border-color: rgba(255, 255, 255, 0.5) !important;
                      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4) !important;
                    }
                    .mutual-friends-overlay {
                      position: fixed;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      background: rgba(0, 0, 0, 0.3);
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      z-index: 10000;
                      animation: fadeIn 0.2s ease-out;
                    }
                    @keyframes fadeIn {
                      from {
                        opacity: 0;
                      }
                      to {
                        opacity: 1;
                      }
                    }
                    .mutual-friends-popup {
                      background: linear-gradient(135deg, #111114 0%, #1a1a1d 100%);
                      border: 1px solid rgba(255, 255, 255, 0.15);
                      border-radius: 16px;
                      width: 90%;
                      max-width: 700px;
                      max-height: 80vh;
                      overflow: hidden;
                      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                      animation: popupSlideIn 0.2s ease-out;
                    }
                    @keyframes popupSlideIn {
                      from {
                        opacity: 0;
                        transform: scale(0.95) translateY(20px);
                      }
                      to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                      }
                    }
                    .mutual-friends-popup-header {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      padding: 24px;
                      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), transparent);
                    }
                    .mutual-friends-popup-header h3 {
                      color: #ffffff;
                      margin: 0;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      font-size: 20px;
                      font-weight: 700;
                    }
                    .mutual-friends-close {
                      background: rgba(255, 255, 255, 0.1);
                      border: 1px solid rgba(255, 255, 255, 0.2);
                      color: #ffffff;
                      font-size: 20px;
                      cursor: pointer;
                      padding: 8px;
                      width: 36px;
                      height: 36px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border-radius: 50%;
                      transition: all 0.15s ease;
                    }
                    .mutual-friends-close:hover {
                      background: rgba(255, 59, 59, 0.2);
                      border-color: rgba(255, 59, 59, 0.4);
                      transform: rotate(90deg);
                    }
                    .mutual-friends-popup-grid {
                      padding: 24px;
                      max-height: 60vh;
                      overflow-y: auto;
                      display: grid;
                      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                      gap: 16px;
                    }
                    .mutual-friends-popup-item {
                      display: flex;
                      align-items: center;
                      padding: 16px;
                      background: rgba(255, 255, 255, 0.05);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 12px;
                      cursor: pointer;
                      transition: all 0.15s ease;
                      animation: itemSlideIn 0.2s ease-out backwards;
                    }
                    .mutual-friends-popup-item:nth-child(odd) {
                      animation-delay: 0.05s;
                    }
                    .mutual-friends-popup-item:nth-child(even) {
                      animation-delay: 0.1s;
                    }
                    @keyframes itemSlideIn {
                      from {
                        opacity: 0;
                        transform: translateX(-20px);
                      }
                      to {
                        opacity: 1;
                        transform: translateX(0);
                      }
                    }
                    .mutual-friends-popup-item:hover {
                      background: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.08)
                      );
                      border-color: rgba(255, 255, 255, 0.25);
                      transform: translateY(-2px) scale(1.01);
                      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    }
                    .mutual-friend-avatar {
                      width: 48px;
                      height: 48px;
                      background: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.08)
                      );
                      border: 2px solid rgba(255, 255, 255, 0.15);
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 16px;
                      font-size: 20px;
                      flex-shrink: 0;
                      overflow: hidden;
                      transition: all 0.15s ease;
                    }
                    .mutual-friend-avatar img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 50%;
                    }
                    .mutual-friends-popup-item:hover .mutual-friend-avatar {
                      transform: scale(1.05);
                      border-color: rgba(255, 255, 255, 0.3);
                    }
                    .mutual-friend-name {
                      color: #ffffff;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      font-size: 16px;
                      font-weight: 600;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                    .mutual-friends-loading {
                      display: flex;
                      align-items: center;
                      color: rgba(255, 255, 255, 0.8);
                      font-size: 16px;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      font-weight: 500;
                    }
                    .loading-spinner {
                      width: 20px;
                      height: 20px;
                      border: 3px solid rgba(255, 255, 255, 0.2);
                      border-top: 3px solid #ffffff;
                      border-radius: 50%;
                      animation: spin 0.8s linear infinite;
                      margin-right: 12px;
                    }
                    @keyframes spin {
                      0% {
                        transform: rotate(0deg);
                      }
                      100% {
                        transform: rotate(360deg);
                      }
                    }
                    .no-mutual-friends {
                      color: rgba(255, 255, 255, 0.6);
                      font-style: italic;
                      font-size: 16px;
                      font-family: "Source Sans Pro", Arial, sans-serif;
                      text-align: center;
                      padding: 20px;
                    }
                    .mutual-friends-popup-grid::-webkit-scrollbar {
                      width: 8px;
                    }
                    .mutual-friends-popup-grid::-webkit-scrollbar-track {
                      background: rgba(255, 255, 255, 0.1);
                      border-radius: 4px;
                    }
                    .mutual-friends-popup-grid::-webkit-scrollbar-thumb {
                      background: linear-gradient(45deg, #555555, #666666);
                      border-radius: 4px;
                    }
                    .mutual-friends-popup-grid::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(45deg, #666666, #777777);
                    }
                    @keyframes fadeOut {
                      from {
                        opacity: 1;
                      }
                      to {
                        opacity: 0;
                      }
                    }
                `;
                document.head.appendChild(style);

                const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgDefs.style.width = '0';
                svgDefs.style.height = '0';
                svgDefs.style.position = 'absolute';
                svgDefs.innerHTML = `<defs><linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#cccccc;stop-opacity:1" /><stop offset="100%" style="stop-color:#999999;stop-opacity:1" /></linearGradient></defs>`;
                document.body.appendChild(svgDefs);
            }

            const container = document.createElement('div');
            container.className = 'mutual-friends-container';
            container.style.display = 'none';

            const header = document.createElement('div');
            header.className = 'mutual-friends-header';
            header.innerHTML = `<svg class="mutual-friends-icon" viewBox="0 0 24 24"><path transform="translate(0,-5)" d="M17.25 20.5c1.281 0.719 2 1.906 1.875 3.125-0.063 0.75-0.031 0.75-1 0.875-0.594 0.063-4.375 0.094-8.219 0.094-4.375 0-8.938-0.031-9.281-0.125-1.281-0.344-0.531-2.719 1.156-3.844 1.344-0.844 4.063-2.156 4.813-2.313 1.031-0.219 1.156-0.875 0-2.844-0.25-0.469-0.531-1.813-0.563-3.25-0.031-2.313 0.375-3.875 2.406-4.656 0.375-0.125 0.813-0.188 1.219-0.188 1.344 0 2.594 0.75 3.125 1.844 0.719 1.469 0.375 5.313-0.375 6.719-0.906 1.594-0.813 2.094 0.188 2.344 0.625 0.156 2.688 1.125 4.656 2.219zM24.094 18.531c1 0.531 1.563 1.5 1.469 2.438-0.031 0.563-0.031 0.594-0.781 0.688-0.375 0.063-2.344 0.094-4.656 0.094-0.406-0.969-1.188-1.844-2.25-2.406-1.219-0.688-2.656-1.406-3.75-1.875 0.719-0.344 1.344-0.625 1.625-0.688 0.781-0.188 0.875-0.625 0-2.188-0.219-0.375-0.469-1.438-0.5-2.563-0.031-1.813 0.375-3.063 1.938-3.656 0.313-0.094 0.656-0.156 0.969-0.156 1.031 0 2 0.563 2.406 1.438 0.531 1.156 0.281 4.156-0.281 5.281-0.688 1.25-0.625 1.625 0.156 1.813 0.5 0.125 2.094 0.906 3.656 1.781z"/></svg>Mutual Friends`;

            const content = document.createElement('div');
            content.className = 'mutual-friends-content';

            container.appendChild(header);
            container.appendChild(content);
            return container;
        };

        // function to show loading state
        const showMutualFriendsLoading = (contentElement) => {
            contentElement.innerHTML = `<div class="mutual-friends-loading"><div class="loading-spinner"></div>Finding mutual friends...</div>`;
        };

        // make popup for mutual frineds
        const createMutualFriendsPopup = async (mutualFriends) => {
            const overlay = document.createElement('div');
            overlay.className = 'mutual-friends-overlay';

            const popup = document.createElement('div');
            popup.className = 'mutual-friends-popup';

            const header = document.createElement('div');
            header.className = 'mutual-friends-popup-header';
            header.innerHTML = `<h3>All Mutual Friends (${mutualFriends.length})</h3><button class="mutual-friends-close">×</button>`;

            const grid = document.createElement('div');
            grid.className = 'mutual-friends-popup-grid';

            const avatarMap = localAvatarCache;

            mutualFriends.forEach(friend => {
                const friendItem = document.createElement('div');
                friendItem.className = 'mutual-friends-popup-item';

                const avatarUrl = avatarMap[friend.id];
                const avatarContent = avatarUrl ? `<img src="${avatarUrl}" alt="${friend.displayName || friend.name}">` : '👤';
                const displayName = friend.displayName || friend.name || `User${friend.id}`;

                friendItem.innerHTML = `
                  <div class="mutual-friend-avatar">
                    ${avatarUrl ? `<img src="${avatarUrl}">` : '👤'}
                  </div>
                  <span class="mutual-friend-name"></span>
                `;
                friendItem.lastElementChild.textContent = displayName;

                friendItem.onclick = () => { // i dont even know how hackers and inject js in a url but whatever
                    window.open(`https://www.roblox.com/users/${sanitizeUserId(friend.id)}/profile`, '_blank'); // yo ik this isnt really neccessary but better safe than sorry.
                };
                grid.appendChild(friendItem);
            });

            popup.appendChild(header);
            popup.appendChild(grid);
            overlay.appendChild(popup);

            header.querySelector('.mutual-friends-close').onclick = () => {
                overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
                setTimeout(() => overlay.remove(), 200);
            };

            overlay.onclick = (randomvariableineed) => {
                if (randomvariableineed.target === overlay) {
                    overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
                    setTimeout(() => overlay.remove(), 200);
                }
            };

            return overlay;
        };

        // show mutal frinds
        const displayMutualFriends = async (contentElement, mutualFriends) => {
            contentElement.innerHTML = '';

            if (mutualFriends.length === 0) {
                contentElement.innerHTML = '<div class="no-mutual-friends">No mutual friends found. RoLocate by Oqarshi</div>';
                return;
            }

            const header = contentElement.parentElement.querySelector('.mutual-friends-header');
            const countBadge = document.createElement('span');
            countBadge.className = 'mutual-friends-count';
            countBadge.textContent = mutualFriends.length;
            header.appendChild(countBadge);

            const friendsList = document.createElement('div');
            friendsList.className = 'mutual-friends-list';

            const maxVisible = 4;
            const friendsToShow = mutualFriends.slice(0, maxVisible);

            // get avatar fromcm cache
            const avatarMap = localAvatarCache;

            friendsToShow.forEach(friend => {
                const friendTag = document.createElement('div');
                friendTag.className = 'mutual-friend-tag';

                // add it to tag
                const avatarUrl = avatarMap[friend.id];
                const displayName = friend.displayName || friend.name || `User${friend.id}`;

               // no attacks
                if (avatarUrl) {
                    const avatarDiv = document.createElement('div');
                    avatarDiv.className = 'mutual-friend-avatar';
                    avatarDiv.style.cssText = 'width: 32px; height: 32px; margin-right: 10px; display: inline-block; vertical-align: middle;';

                    const img = document.createElement('img');
                    img.src = avatarUrl;
                    img.alt = '';
                    img.style.cssText = 'width: 100%; height: 100%; border-radius: 50%; object-fit: cover;';

                    avatarDiv.appendChild(img);

                    const nameSpan = document.createElement('span');
                    nameSpan.style.verticalAlign = 'middle';
                    nameSpan.textContent = escapeHtmlnoxssattackvectors(displayName);

                    friendTag.appendChild(avatarDiv);
                    friendTag.appendChild(nameSpan);
                } else {
                    friendTag.textContent = escapeHtmlnoxssattackvectors(displayName); // no attacks
                }

                friendTag.onclick = () => {
                    window.open(`https://www.roblox.com/users/${friend.id}/profile`, '_blank');
                };
                friendsList.appendChild(friendTag);
            });

            if (mutualFriends.length > maxVisible) {
                const moreButton = document.createElement('div');
                moreButton.className = 'mutual-friend-tag mutual-friends-more';
                moreButton.textContent = `+${mutualFriends.length - maxVisible} more`;
                moreButton.onclick = async () => {
                    const popup = await createMutualFriendsPopup(mutualFriends);
                    document.body.appendChild(popup);
                };
                friendsList.appendChild(moreButton);
            }

            contentElement.appendChild(friendsList);
        };

        // function to find profile insertion point
        const findProfileInsertionPoint = () => {
            return document.querySelector('ul.profile-tabs.flex');
        };

        // main code
        try {
            const currentUserId = getCurrentUserId();
            if (!currentUserId) return;

            const urlMatch = window.location.pathname.match(/^\/(?:[a-z]{2}\/)?users\/(\d+)\/profile$/);
            if (!urlMatch) return;

            const otherUserId = urlMatch[1];
            if (otherUserId === String(currentUserId)) return;

            // clear local cache for new page visit
            localAvatarCache = {};

            const mutualFriendsElement = createMutualFriendsElement();
            const insertionPoint = findProfileInsertionPoint();

            if (!insertionPoint) {
                ConsoleLogEnabled('[Mutual Friends] Could not find suitable insertion point');
                return;
            }

            insertionPoint.insertAdjacentElement('afterend', mutualFriendsElement);
            mutualFriendsElement.style.display = 'block';

            const contentElement = mutualFriendsElement.querySelector('.mutual-friends-content');
            showMutualFriendsLoading(contentElement);

            // Step 1: fetch both friend lists
            const [currentUserFriends, otherUserFriends] = await Promise.all([
                gmFetchFriends(currentUserId),
                gmFetchFriends(otherUserId),
            ]);

            if (!currentUserFriends || !otherUserFriends) {
                contentElement.innerHTML = '<div class="no-mutual-friends">Failed to load friend data</div>';
                return;
            }

            ConsoleLogEnabled(`[Mutual Friends] Current user has ${currentUserFriends.length} friends`);
            ConsoleLogEnabled(`[Mutual Friends] Other user has ${otherUserFriends.length} friends`);

            // Step 2: find mutual friends via comparison of id
            const otherFriendIds = new Set(otherUserFriends.map(f => f.id));
            let mutualFriends = currentUserFriends.filter(f => otherFriendIds.has(f.id));

            ConsoleLogEnabled(`[Mutual Friends] Found ${mutualFriends.length} mutual friends`);

            if (mutualFriends.length === 0) {
                await displayMutualFriends(contentElement, mutualFriends);
                return;
            }

            // Step 3: check if they need display anmes
            const friendsNeedingData = mutualFriends.filter(f =>
                !f.name || f.name.trim() === '' ||
                !f.displayName || f.displayName.trim() === ''
            );

            ConsoleLogEnabled(`[Mutual Friends] ${friendsNeedingData.length} mutual friends need data fixes`);

            // Step 4: fetch details of the friends that are mutual friends. find dispolayname
            if (friendsNeedingData.length > 0) {
                const userIds = friendsNeedingData.map(f => f.id);
                const userDetails = await fetchUserDetailsBatch(userIds);

                if (userDetails && userDetails.length > 0) {
                    const detailsMap = new Map(userDetails.map(u => [u.id, u]));

                    mutualFriends = mutualFriends.map(friend => {
                        if (friend.name && friend.displayName) return friend;
                        const details = detailsMap.get(friend.id);
                        return {
                            ...friend,
                            name: details?.name || `User${friend.id}`,
                            displayName: details?.displayName || details?.name || `User${friend.id}`
                        };
                    });

                    ConsoleLogEnabled(`[Mutual Friends] Successfully enriched ${userDetails.length} friend details`);
                }
            }

            // Step 5: fetch the avatars
            localAvatarCache = await fetchAllAvatars(mutualFriends);

            // Step 6: show it to the user
            await displayMutualFriends(contentElement, mutualFriends);

            ConsoleLogEnabled('[Mutual Friends] Feature loaded successfully');

        } catch (error) {
            ConsoleLogEnabled('[loadmutualfriends] Error occurred:', error);
        }
    }



    /*******************************************************
    name of function: manageRobloxChatBar
    description: Disables roblox chat when ROLOCATE_disablechat is true
    *******************************************************/
    function manageRobloxChatBar() {
        if (localStorage.getItem('ROLOCATE_disablechat') !== "true") return;
        const CHAT_ID = 'chat-container';
        let chatObserver = null;

        // cleanup stuff so we dont leak memory
        const cleanup_managechatbar = () => chatObserver?.disconnect();
        // remove the chat bar
        const removeChatBar = () => {
            const chat = document.getElementById(CHAT_ID);
            if (chat) {
                chat.remove();
                ConsoleLogEnabled('Roblox chat bar removed');
                cleanup_managechatbar();
                return true;
            }
            return false;
        };

        // try removing it right away
        if (removeChatBar()) return;
        // if not found yet, watch for it
        chatObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (!mutation.addedNodes) continue;
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.id === CHAT_ID || node.querySelector(`#${CHAT_ID}`))) {
                        if (removeChatBar()) return;
                    }
                }
            }
        });

        // start watching
        document.body && chatObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // give up after 30 seconds
        const timeout = setTimeout(() => {
            cleanup_managechatbar();
            ConsoleLogEnabled('Chat removal observer timeout');
        }, 30000);

        // return cleanup function
        return () => {
            cleanup_managechatbar();
            clearTimeout(timeout);
        };
    }



    /*******************************************************
    name: SmartSearch
    desc: Enhanced Smart Search with friend integration
    *******************************************************/
    function SmartSearch() {
        if (localStorage.ROLOCATE_smartsearch !== "true") return;
        const SMARTSEARCH_getCurrentUserId = () => Roblox?.CurrentUser?.userId || null;
        let friendList = [], friendIdSet = new Set(), friendListFetched = false, friendListFetching = false;

        async function fetchFriendList(userId) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://friends.roblox.com/v1/users/${userId}/friends`,
                    headers: {"Accept": "application/json"},
                    onload: function(response) {
                        if (response.status === 200) {
                            try { resolve(JSON.parse(response.responseText).data || []); }
                            catch (e) { resolve([]); }
                        } else resolve([]);
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        function hasSubstringMatch(str, query) {
            if (query.length < 3) return false;
            return str.toLowerCase().includes(query.toLowerCase());
        }

        function chunkArray(array, size) {
            const chunks = [];
            for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
            return chunks;
        }

        // levenshteinDistance functiuon. leetcode
        function levenshteinDistance(a, b) {
            const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
            for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
            for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
            for (let j = 1; j <= b.length; j++) {
                for (let i = 1; i <= a.length; i++) {
                    const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                    matrix[j][i] = Math.min(
                        matrix[j][i - 1] + 1,
                        matrix[j - 1][i] + 1,
                        matrix[j - 1][i - 1] + indicator
                    );
                }
            }
            return matrix[b.length][a.length];
        }

        function getSimilarityScore(str1, str2) {
            ConsoleLogEnabled("Original strings:", {str1, str2});

            // no emojis yea
            const removeEmojisAndClean = (str) =>
                str.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
                   .toLowerCase().replace(/[^a-z0-9]/g, '');

            const searchQuery = removeEmojisAndClean(str1);
            const targetText = removeEmojisAndClean(str2);
            ConsoleLogEnabled("Cleaned strings:", {searchQuery, targetText});

            // if something includes the samething then its prob a match
            if (searchQuery.includes(targetText) || targetText.includes(searchQuery)) {
                ConsoleLogEnabled("One string includes the other.");

                const longerText = searchQuery.length > targetText.length ? searchQuery : targetText;
                const shorterText = searchQuery.length > targetText.length ? targetText : searchQuery;

                ConsoleLogEnabled("Longer string:", longerText);
                ConsoleLogEnabled("Shorter string:", shorterText);

                // uh increase score if it has like lengths
                let matchScore = 0.8 + (shorterText.length / longerText.length) * 0.15;
                ConsoleLogEnabled("Base score (inclusion case):", matchScore);

                if (searchQuery === targetText) {
                    ConsoleLogEnabled("Exact match.");
                    return 1.0;
                }

                const result = Math.min(0.95, matchScore);
                ConsoleLogEnabled("Inclusion final score:", result);
                return result;
            }

            // if no direct match do distance claucaltion instead
            const maxLen = Math.max(searchQuery.length, targetText.length);

            if (maxLen === 0) {
                ConsoleLogEnabled("uh maybe all emojis returning 1");
                return 1;
            }

            const editDistance = levenshteinDistance(searchQuery, targetText);
            const distanceScore = 1 - (editDistance / maxLen);

            ConsoleLogEnabled("Levenshtein distance:", editDistance);
            ConsoleLogEnabled("Levenshtein score:", distanceScore);

            // comon chunks then yeasss
            const minLen = Math.min(searchQuery.length, targetText.length);
            let bonusPoints = 0;
            let bestMatch = 0;

            for (let i = 0; i < searchQuery.length; i++) {
                for (let j = 0; j < targetText.length; j++) {
                    let matchLen = 0;
                    while (i + matchLen < searchQuery.length &&
                           j + matchLen < targetText.length &&
                           searchQuery[i + matchLen] === targetText[j + matchLen]) {
                        matchLen++;
                    }

                    if (matchLen > bestMatch) bestMatch = matchLen;
                }
            }

            ConsoleLogEnabled("longest matching substring length:", bestMatch);

            // boost if its decent ig
            if (bestMatch >= 3) {
                bonusPoints = (bestMatch / minLen) * 0.5;
                ConsoleLogEnabled("boosting subtring:", bonusPoints);
            } else {
                ConsoleLogEnabled("no substring boost applied");
            }

            const finalScore = Math.min(0.95, distanceScore + bonusPoints);
            ConsoleLogEnabled("final similarity score:", finalScore);

            return finalScore; // this is the final score to rank the items
        }

        function formatNumberCount(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+';
            else if (num >= 1000) return (num / 1000).toFixed(1) + 'K+';
            else return num.toString();
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = {year: 'numeric', month: 'short', day: 'numeric'};
            return date.toLocaleDateString('en-US', options);
        }

        /*******************************************************
        Optimized thumbnail fetching
        *******************************************************/
        async function fetchGameIconsBatch(universeIds) {
            if (!universeIds.length) return [];
            const apiUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(',')}&size=512x512&format=Png&isCircular=false`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET", url: apiUrl, headers: {"Accept": "application/json"},
                    onload: function(response) {
                        if (response.status === 200) {
                            try { resolve(JSON.parse(response.responseText).data || []); }
                            catch (error) { resolve([]); }
                        } else resolve([]);
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        async function fetchPlayerThumbnailsBatch(userIds) {
            if (!userIds.length) return [];
            const params = new URLSearchParams({userIds: userIds.join(","), size: "150x150", format: "Png", isCircular: "false"});
            const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?${params.toString()}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url, headers: {"Accept": "application/json"},
                    onload: function(response) {
                        try {
                            if (response.status === 200) resolve(JSON.parse(response.responseText).data || []);
                            else resolve([]);
                        } catch (error) { resolve([]); }
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        async function fetchGroupIconsBatch(groupIds) {
            if (!groupIds.length) return [];
            const params = new URLSearchParams({groupIds: groupIds.join(","), size: "150x150", format: "Png", isCircular: "false"});
            const url = `https://thumbnails.roblox.com/v1/groups/icons?${params.toString()}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url, headers: {"Accept": "application/json"},
                    onload: function(response) {
                        try {
                            if (response.status === 200) resolve(JSON.parse(response.responseText).data || []);
                            else resolve([]);
                        } catch (error) { resolve([]); }
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        async function fetchCatalogItemDetails(assetId) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://catalog.roblox.com/v1/catalog/items/${assetId}/details?itemType=Asset`,
                    headers: {"Accept": "application/json"},
                    onload: function(response) {
                        if (response.status === 200) {
                            try { resolve(JSON.parse(response.responseText)); }
                            catch (e) { resolve(null); }
                        } else resolve(null);
                    },
                    onerror: function() { resolve(null); }
                });
            });
        }

        async function fetchCatalogThumbnailsBatch(assetIds) {
            if (!assetIds.length) return [];
            const params = new URLSearchParams({assetIds: assetIds.join(","), size: "150x150", format: "png", isCircular: "false"});
            const url = `https://thumbnails.roblox.com/v1/assets?${params.toString()}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url, headers: {"Accept": "application/json"},
                    onload: function(response) {
                        try {
                            if (response.status === 200) resolve(JSON.parse(response.responseText).data || []);
                            else resolve([]);
                        } catch (error) { resolve([]); }
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        // find thumbnails in a batch
        async function fetchBundleThumbnailsBatch(bundleIds) {
            if (!bundleIds.length) return [];
            const params = new URLSearchParams({bundleIds: bundleIds.join(","), size: "150x150", format: "png", isCircular: "false"});
            const url = `https://thumbnails.roblox.com/v1/bundles/thumbnails?${params.toString()}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url, headers: {"Accept": "application/json"},
                    onload: function(response) {
                        try {
                            if (response.status === 200) resolve(JSON.parse(response.responseText).data || []);
                            else resolve([]);
                        } catch (error) { resolve([]); }
                    },
                    onerror: function() { resolve([]); }
                });
            });
        }

        /*******************************************************
        search fucntionssnsnsn
        *******************************************************/
        async function fetchGameSearchResults(query) {
            const sessionId = Date.now();
            const apiUrl = `https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(query)}&pageToken=&sessionId=${sessionId}&pageType=all`;
            contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_loading">Loading games...</div>';
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({method: "GET", url: apiUrl, headers: {"Accept": "application/json"}, onload: resolve, onerror: reject});
                });
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const searchResults = data.searchResults || [];
                    const allGames = searchResults.map(result => result.contents[0]);
                    const gamesWithSimilarity = allGames.map(game => ({...game, similarity: getSimilarityScore(query, game.name)}));
                    const sortedGames = gamesWithSimilarity.sort((a, b) => {
                        const similarityA = a.similarity; const similarityB = b.similarity;
                        if ((similarityA >= 0.80 && similarityB >= 0.80) || Math.abs(similarityA - similarityB) < 0.0001) return b.playerCount - a.playerCount;
                        return similarityB - similarityA;
                    });
                    const games = sortedGames.slice(0, 30);
                    const activeTab = document.querySelector('.ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active')?.textContent;
                    if (activeTab !== "Games") return;
                    if (games.length === 0) {
                        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_no-results">No results found</div>';
                        return;
                    }
                    contentArea.innerHTML = games.map(game => `
                    <div class="ROLOCATE_SMARTSEARCH_game-card-container">
                        <a href="https://www.roblox.com/games/${game.rootPlaceId}" class="ROLOCATE_SMARTSEARCH_game-card-link" target="_self">
                            <div class="ROLOCATE_SMARTSEARCH_game-card">
                                <div class="ROLOCATE_SMARTSEARCH_thumbnail-loading" data-universe-id="${game.universeId}"></div>
                                <div class="ROLOCATE_SMARTSEARCH_game-info">
                                    <h3 class="ROLOCATE_SMARTSEARCH_game-name">${game.name}</h3>
                                    <p class="ROLOCATE_SMARTSEARCH_game-stats">
                                        Players: ${formatNumberCount(game.playerCount)} |
                                        <span class="ROLOCATE_SMARTSEARCH_thumbs-up">👍      ${formatNumberCount(game.totalUpVotes)}</span> |
                                        <span class="ROLOCATE_SMARTSEARCH_thumbs-down">👎      ${formatNumberCount(game.totalDownVotes)}</span>
                                    </p>
                                </div>
                            </div>
                        </a>
                        <button class="ROLOCATE_SMARTSEARCH_play-button"
                                data-place-id="${game.rootPlaceId}"
                                title="Quick Join">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5V19L19 12L8 5Z" fill="#4CAF50"/>
                            </svg>
                        </button>
                    </div>
                `).join('');
                    setTimeout(() => {
                        document.querySelectorAll('.ROLOCATE_SMARTSEARCH_play-button').forEach(button => {
                            button.addEventListener('click', function(e) {
                                e.preventDefault(); e.stopPropagation();
                                const placeId = this.getAttribute('data-place-id');
                                window.location.href = `https://www.roblox.com/games/${placeId}#?ROLOCATE_QUICKJOIN`;
                            });
                        });
                    }, 100);
                    const universeIds = games.map(game => game.universeId);
                    const thumbnailBatches = chunkArray(universeIds, 10);
                    for (const batch of thumbnailBatches) {
                        try {
                            const thumbnails = await fetchGameIconsBatch(batch);
                            thumbnails.forEach(thumb => {
                                const loadingElement = document.querySelector(`.ROLOCATE_SMARTSEARCH_thumbnail-loading[data-universe-id="${thumb.targetId}"]`);
                                if (loadingElement) {
                                    loadingElement.outerHTML = `<img src="${thumb.imageUrl}" alt="${games.find(g => g.universeId == thumb.targetId)?.name || 'Game'}" class="ROLOCATE_SMARTSEARCH_game-thumbnail">`;
                                }
                            });
                        } catch (error) { ConsoleLogEnabled('Error fetching game thumbnails:', error); }
                    }
                } else contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading results</div>';
            } catch (error) {
                ConsoleLogEnabled('Error in game search:', error);
                contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading results</div>';
            }
        }

        async function fetchUserSearchResults(query) {
            const sessionId = Date.now();
            const apiUrl = `https://apis.roblox.com/search-api/omni-search?verticalType=user&searchQuery=${encodeURIComponent(query)}&pageToken=&globalSessionId=${sessionId}&sessionId=${sessionId}`;
            contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_loading">Loading users...</div>';
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({method: "GET", url: apiUrl, headers: {"Accept": "application/json"}, onload: resolve, onerror: reject});
                });
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const userGroup = data.searchResults?.find(group => group.contentGroupType === "User");
                    const apiUsers = userGroup?.contents || [];
                    const currentUserId = SMARTSEARCH_getCurrentUserId();
                    if (currentUserId && !friendListFetched && !friendListFetching) {
                        friendListFetching = true;
                        friendList = await fetchFriendList(currentUserId);
                        friendIdSet = new Set(friendList.map(friend => friend.id));
                        friendListFetched = true;
                        friendListFetching = false;
                    }
                    const matchedFriends = [];
                    if (query.length >= 3 && friendListFetched) {
                        friendList.forEach(friend => {
                            const nameMatch = hasSubstringMatch(friend.name, query);
                            const displayMatch = friend.displayName && hasSubstringMatch(friend.displayName, query);
                            if (nameMatch || displayMatch) {
                                matchedFriends.push({
                                    contentId: friend.id,
                                    username: friend.name,
                                    displayName: friend.displayName || friend.name,
                                    isFriend: true,
                                });
                            }
                        });
                    }
                    let combinedResults = [
                        ...apiUsers.map(user => ({...user, isFriend: friendIdSet.has(user.contentId)})),
                        ...matchedFriends.filter(friend => !apiUsers.some(u => u.contentId === friend.contentId))
                    ];
                    combinedResults.sort((a, b) => {
                        if (a.isFriend && !b.isFriend) return -1;
                        if (!a.isFriend && b.isFriend) return 1;
                        return 0;
                    });
                    const users = combinedResults.slice(0, 30);
                    if (users.length === 0) {
                        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_no-results">No users found</div>';
                        return;
                    }
                    contentArea.innerHTML = users.map(user => `
                        <a href="https://www.roblox.com/users/${user.contentId}/profile" class="ROLOCATE_SMARTSEARCH_user-card-link" target="_self">
                            <div class="ROLOCATE_SMARTSEARCH_user-card">
                                <div class="ROLOCATE_SMARTSEARCH_thumbnail-loading" data-user-id="${user.contentId}"></div>
                                <div class="ROLOCATE_SMARTSEARCH_user-info">
                                    <h3 class="ROLOCATE_SMARTSEARCH_user-display-name">${user.displayName || user.username}</h3>
                                    <p class="ROLOCATE_SMARTSEARCH_user-username">
                                        @${user.username}
                                        ${user.isFriend ? '<span class="ROLOCATE_SMARTSEARCH_friend-badge">Friend</span>' : ''}
                                    </p>
                                </div>
                            </div>
                        </a>
                    `).join('');
                    const userIds = users.map(user => user.contentId);
                    const thumbnailBatches = chunkArray(userIds, 10);
                    for (const batch of thumbnailBatches) {
                        try {
                            const thumbnails = await fetchPlayerThumbnailsBatch(batch);
                            thumbnails.forEach(thumb => {
                                const loadingElement = document.querySelector(`.ROLOCATE_SMARTSEARCH_thumbnail-loading[data-user-id="${thumb.targetId}"]`);
                                if (loadingElement) {
                                    loadingElement.outerHTML = `<img src="${thumb.imageUrl}" alt="${users.find(u => u.contentId == thumb.targetId)?.username || 'User'}" class="ROLOCATE_SMARTSEARCH_user-thumbnail">`;
                                }
                            });
                        } catch (error) { ConsoleLogEnabled('Error fetching user thumbnails:', error); }
                    }
                } else contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading user results</div>';
            } catch (error) {
                ConsoleLogEnabled('Error in user search:', error);
                contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading user results</div>';
            }
        }

        async function fetchGroupSearchResults(query) {
            const apiUrl = `https://groups.roblox.com/v1/groups/search?cursor=&keyword=${encodeURIComponent(query)}&limit=25&prioritizeExactMatch=true&sortOrder=Asc`;
            contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_loading">Loading groups...</div>';
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({method: "GET", url: apiUrl, headers: {"Accept": "application/json"}, onload: resolve, onerror: reject});
                });
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const groups = data.data || [];
                    if (groups.length === 0) {
                        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_no-results">No groups found</div>';
                        return;
                    }
                    contentArea.innerHTML = groups.map(group => `
                    <a href="https://www.roblox.com/groups/${group.id}" class="ROLOCATE_SMARTSEARCH_group-card-link" target="_self">
                        <div class="ROLOCATE_SMARTSEARCH_group-card">
                            <div class="ROLOCATE_SMARTSEARCH_thumbnail-loading" data-group-id="${group.id}"></div>
                            <div class="ROLOCATE_SMARTSEARCH_group-info">
                                <h3 class="ROLOCATE_SMARTSEARCH_group-name">${group.name}</h3>
                                <p class="ROLOCATE_SMARTSEARCH_group-members">Members: ${formatNumberCount(group.memberCount)}</p>
                                <p class="ROLOCATE_SMARTSEARCH_group-created">Created: ${formatDate(group.created)}</p>
                            </div>
                        </div>
                    </a>
                `).join('');
                    const groupIds = groups.map(group => group.id);
                    const thumbnailBatches = chunkArray(groupIds, 10);
                    for (const batch of thumbnailBatches) {
                        try {
                            const thumbnails = await fetchGroupIconsBatch(batch);
                            thumbnails.forEach(thumb => {
                                const loadingElement = document.querySelector(`.ROLOCATE_SMARTSEARCH_thumbnail-loading[data-group-id="${thumb.targetId}"]`);
                                if (loadingElement) {
                                    loadingElement.outerHTML = `<img src="${thumb.imageUrl}" alt="${groups.find(g => g.id == thumb.targetId)?.name || 'Group'}" class="ROLOCATE_SMARTSEARCH_group-thumbnail">`;
                                }
                            });
                        } catch (error) { ConsoleLogEnabled('Error fetching group thumbnails:', error); }
                    }
                } else contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading group results</div>';
            } catch (error) {
                ConsoleLogEnabled('Error in group search:', error);
                contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading group results</div>';
            }
        }

        async function fetchCatalogSearchResults(query) {
            const apiUrl = `https://catalog.roblox.com/v1/search/items?keyword=${encodeURIComponent(query)}&category=All&salesTypeFilter=1&limit=30`;
            contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_loading">Loading catalog items...</div>';
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({method: "GET", url: apiUrl, headers: {"Accept": "application/json"}, onload: resolve, onerror: reject});
                });
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const catalogItems = data.data || [];
                    if (catalogItems.length === 0) {
                        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_no-results">No catalog items found</div>';
                        return;
                    }
                    ConsoleLogEnabled('Creating fetch promises for Asset and Bundle types...');
                    const detailPromises_Asset = catalogItems.slice(0, 120).map(item => fetchCatalogItemDetails(item.id));
                    ConsoleLogEnabled('Waiting for Asset fetches to complete...');
                    const detailedResults_Asset = await Promise.all(detailPromises_Asset);
                    const itemsNeedingBundleRetry = catalogItems.slice(0, 120).filter((item, index) => detailedResults_Asset[index] === null);
                    ConsoleLogEnabled(`Failed as Asset, retrying as Bundle for ${itemsNeedingBundleRetry.length} items:`, itemsNeedingBundleRetry.map(i => i.id));
                    const detailPromises_Bundle = itemsNeedingBundleRetry.map(item =>
                        new Promise((resolve) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: `https://catalog.roblox.com/v1/catalog/items/${item.id}/details?itemType=Bundle`,
                                headers: {"Accept": "application/json"},
                                onload: function(response) {
                                    if (response.status === 200) {
                                        try { resolve(JSON.parse(response.responseText)); }
                                        catch (e) { resolve(null); }
                                    } else resolve(null);
                                },
                                onerror: function() { resolve(null); }
                            });
                        })
                    );
                    ConsoleLogEnabled('Waiting for Bundle fetches to complete...');
                    const detailedResults_Bundle = await Promise.all(detailPromises_Bundle);
                    const combinedResults = detailedResults_Asset.map((assetResult, index) => {
                        if (assetResult !== null) return { ...assetResult, __itemType: 'Asset' };
                        else {
                            const bundleIndex = itemsNeedingBundleRetry.findIndex(item => item.id === catalogItems[index].id);
                            return bundleIndex >= 0 ? { ...detailedResults_Bundle[bundleIndex], __itemType: 'Bundle' } : null;
                        }
                    });
                    const failedIds = catalogItems.slice(0, 100).filter((item, index) => combinedResults[index] === null).map(item => item.id);
                    ConsoleLogEnabled(`â    Failed to fetch details (Asset & Bundle) for ${failedIds.length} items:`, failedIds);
                    ConsoleLogEnabled('Filtering out completely failed requests...');
                    const detailedItems = combinedResults.filter(details => details !== null);
                    ConsoleLogEnabled(`â    Got ${detailedItems.length} valid items.`);
                    if (detailedItems.length === 0) {
                        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_no-results">No catalog items found</div>';
                        return;
                    }
                    contentArea.innerHTML = detailedItems.map(item => `
                        <a href="https://www.roblox.com/${item.__itemType === 'Bundle' ? 'bundles' : 'catalog'}/${item.id}" class="ROLOCATE_SMARTSEARCH_catalog-card-link" target="_self">
                            <div class="ROLOCATE_SMARTSEARCH_catalog-card">
                                <div class="ROLOCATE_SMARTSEARCH_thumbnail-loading" data-asset-id="${item.id}" data-item-type="${item.__itemType}"></div>
                                <div class="ROLOCATE_SMARTSEARCH_catalog-info">
                                <h3 class="ROLOCATE_SMARTSEARCH_catalog-name">${item.name}</h3>
                                <p class="ROLOCATE_SMARTSEARCH_catalog-price">
                                    ${item.priceStatus === "Free"
                                        ? '<span style="color:#4caf50;">Free</span>'
                                        : `<span style="color:#4caf50;">${item.price}</span> ⏣`}
                                    ${item.favoriteCount > 0 ? ` | <span style="color:#4caf50;">👍 ${formatNumberCount(item.favoriteCount)}</span>` : ''}
                                </p>
                                <p class="ROLOCATE_SMARTSEARCH_catalog-creator">
                                    by ${item.creatorName}
                                </p>

                                </div>
                            </div>
                        </a>
                    `).join('');
                    const assetIds = detailedItems.filter(item => item.__itemType === 'Asset').map(item => item.id);
                    const bundleIds = detailedItems.filter(item => item.__itemType === 'Bundle').map(item => item.id);
                    if (assetIds.length > 0) {
                        const assetThumbnailBatches = chunkArray(assetIds, 10);
                        for (const batch of assetThumbnailBatches) {
                            try {
                                const thumbnails = await fetchCatalogThumbnailsBatch(batch);
                                thumbnails.forEach(thumb => {
                                    const loadingElement = document.querySelector(`.ROLOCATE_SMARTSEARCH_thumbnail-loading[data-asset-id="${thumb.targetId}"]`);
                                    if (loadingElement) {
                                        loadingElement.outerHTML = `<img src="${thumb.imageUrl}" alt="${detailedItems.find(i => i.id == thumb.targetId)?.name || 'Item'}" class="ROLOCATE_SMARTSEARCH_catalog-thumbnail">`;
                                    }
                                });
                            } catch (error) { ConsoleLogEnabled('Error fetching catalog thumbnails:', error); }
                        }
                    }
                    if (bundleIds.length > 0) {
                        const bundleThumbnailBatches = chunkArray(bundleIds, 10);
                        for (const batch of bundleThumbnailBatches) {
                            try {
                                const thumbnails = await fetchBundleThumbnailsBatch(batch);
                                thumbnails.forEach(thumb => {
                                    const loadingElement = document.querySelector(`.ROLOCATE_SMARTSEARCH_thumbnail-loading[data-asset-id="${thumb.targetId}"]`);
                                    if (loadingElement) {
                                        loadingElement.outerHTML = `<img src="${thumb.imageUrl}" alt="${detailedItems.find(i => i.id == thumb.targetId)?.name || 'Bundle'}" class="ROLOCATE_SMARTSEARCH_catalog-thumbnail">`;
                                    }
                                });
                            } catch (error) { ConsoleLogEnabled('Error fetching bundle thumbnails:', error); }
                        }
                    }
                } else contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading catalog results</div>';
            } catch (error) {
                ConsoleLogEnabled('Error in catalog search:', error);
                contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_error">Error loading catalog results</div>';
            }
        }

        const originalSearchContainer = document.querySelector('[data-testid="navigation-search-input"]');
        if (!originalSearchContainer) {
            ConsoleLogEnabled('Search container not found');
            return false;
        }
        originalSearchContainer.remove();

        const customSearchContainer = document.createElement('div');
        customSearchContainer.className = 'navbar-left navbar-search col-xs-5 col-sm-6 col-md-2 col-lg-3 shown';
        customSearchContainer.setAttribute('role', 'search');
        customSearchContainer.style.marginTop = '4px';
        customSearchContainer.style.position = 'relative';

        const form = document.createElement('form');
        form.name = 'custom-search-form';
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (!query) return;
            const activeTab = document.querySelector('.ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active')?.dataset.tab;
            let url = '';
            switch (activeTab) {
                case 'games': url = `https://www.roblox.com/discover/?Keyword=${encodeURIComponent(query)}`; break;
                case 'users': url = `https://www.roblox.com/search/users?keyword=${encodeURIComponent(query)}`; break;
                case 'groups': url = `https://www.roblox.com/search/communities?keyword=${encodeURIComponent(query)}`; break;
                case 'catalog': url = `https://www.roblox.com/catalog?Keyword=${encodeURIComponent(query)}`; break;
                default: url = `https://www.roblox.com/discover/?Keyword=${encodeURIComponent(query)}`; break;
            }
            window.location.href = url;
        });

        const formWrapper = document.createElement('div');
        formWrapper.className = 'ROLOCATE_SMARTSEARCH_form-has-feedback';

        const searchInput = document.createElement('input');
        let wasPreviouslyBlurred = true; let lastInputValue = '';
        searchInput.addEventListener('focus', () => {
            if (wasPreviouslyBlurred) {
                const activeTab = document.querySelector('.ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active')?.textContent || 'Unknown';
                const typedText = searchInput.value.trim();
                ConsoleLogEnabled(`[SmartSearch] Search bar focused | Tab: ${activeTab} | Input: "${typedText}"`);
                wasPreviouslyBlurred = false;
            }
        });
        searchInput.addEventListener('blur', () => { wasPreviouslyBlurred = true; });

        searchInput.id = 'custom-navbar-search-input';
        searchInput.type = 'search';
        searchInput.className = 'form-control input-field ROLOCATE_SMARTSEARCH_custom-search-input';
        searchInput.placeholder = 'SmartSearch | RoLocate by Oqarshi';
        searchInput.maxLength = 120;
        searchInput.autocomplete = 'off';

        const searchIcon = document.createElement('span');
        searchIcon.className = 'icon-common-search-sm ROLOCATE_SMARTSEARCH_custom-search-icon';

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'ROLOCATE_SMARTSEARCH_search-dropdown-menu';
        dropdownMenu.style.display = 'none';

        const navTabs = document.createElement('div');
        navTabs.className = 'ROLOCATE_SMARTSEARCH_dropdown-nav-tabs';
        const tabs = ['Games', 'Users', 'Groups', 'Catalog'];
        const tabButtons = [];
        tabs.forEach((tabName, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = `ROLOCATE_SMARTSEARCH_dropdown-tab ${index === 0 ? 'ROLOCATE_SMARTSEARCH_active' : ''}`;
            tabButton.textContent = tabName;
            tabButton.type = 'button';
            tabButton.dataset.tab = tabName.toLowerCase();
            tabButtons.push(tabButton);
            navTabs.appendChild(tabButton);
        });

        const contentArea = document.createElement('div');
        contentArea.className = 'ROLOCATE_SMARTSEARCH_dropdown-content';
        contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_content-text">Quickly search for <strong>games</strong> above!</div>';

        dropdownMenu.appendChild(navTabs);
        dropdownMenu.appendChild(contentArea);
        formWrapper.appendChild(searchInput);
        formWrapper.appendChild(searchIcon);
        form.appendChild(formWrapper);
        customSearchContainer.appendChild(form);
        customSearchContainer.appendChild(dropdownMenu);

        let isMenuOpen = false;
        searchInput.addEventListener('click', showDropdownMenu);
        searchInput.addEventListener('focus', showDropdownMenu);
        searchInput.addEventListener('input', function() {
            const currentValue = this.value.trim();
            if (currentValue && currentValue !== lastInputValue && !isMenuOpen) showDropdownMenu();
            lastInputValue = currentValue;
        });

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                tabButtons.forEach(tab => tab.classList.remove('ROLOCATE_SMARTSEARCH_active'));
                button.classList.add('ROLOCATE_SMARTSEARCH_active');
                const query = searchInput.value.trim();
                if (query) {
                    if (button.textContent === "Games") fetchGameSearchResults(query);
                    else if (button.textContent === "Users") fetchUserSearchResults(query);
                    else if (button.textContent === "Groups") fetchGroupSearchResults(query);
                    else if (button.textContent === "Catalog") fetchCatalogSearchResults(query);
                } else {
                    if (button.textContent === "Games") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Quickly search for <strong>games</strong> above!</div>`;
                    else if (button.textContent === "Users") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Instantly find the <strong>user</strong> you're looking for!</div>`;
                    else if (button.textContent === "Groups") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Search for <strong>groups</strong> rapidly.</div>`;
                    else if (button.textContent === "Catalog") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Browse the <strong>catalog</strong> for items!</div>`;
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!customSearchContainer.contains(e.target)) hideDropdownMenu();
        });
        dropdownMenu.addEventListener('click', (e) => { e.stopPropagation(); });

        function showDropdownMenu() {
            isMenuOpen = true;
            dropdownMenu.style.display = 'block';
            formWrapper.classList.add('ROLOCATE_SMARTSEARCH_menu-open');
            setTimeout(() => { dropdownMenu.classList.add('ROLOCATE_SMARTSEARCH_show'); }, 10);
            const activeTab = document.querySelector('.ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active')?.textContent;
            const query = searchInput.value.trim();
            if (query) {
                if (activeTab === "Games" && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_game-card') === null && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_no-results') === null) fetchGameSearchResults(query);
                else if (activeTab === "Users" && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_user-card') === null && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_no-results') === null) fetchUserSearchResults(query);
                else if (activeTab === "Groups" && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_group-card') === null && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_no-results') === null) fetchGroupSearchResults(query);
                else if (activeTab === "Catalog" && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_catalog-card') === null && contentArea.querySelector('.ROLOCATE_SMARTSEARCH_no-results') === null) fetchCatalogSearchResults(query);
            }
        }

        function hideDropdownMenu() {
            isMenuOpen = false;
            dropdownMenu.classList.remove('ROLOCATE_SMARTSEARCH_show');
            formWrapper.classList.remove('ROLOCATE_SMARTSEARCH_menu-open');
            setTimeout(() => { if (!isMenuOpen) dropdownMenu.style.display = 'none'; }, 200);
        }

        const rightNavigation = document.getElementById('right-navigation-header');
        if (rightNavigation) rightNavigation.insertBefore(customSearchContainer, rightNavigation.firstChild);

        let debounceTimeout;
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() && !isMenuOpen) showDropdownMenu();
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const query = searchInput.value.trim();
                const activeTab = document.querySelector('.ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active')?.textContent;
                if (!query) {
                    if (activeTab === "Games") contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_content-text">Quickly search for <strong>games</strong> above!</div>';
                    else if (activeTab === "Users") contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_content-text">Instantly find the <strong>user</strong> you\'re looking for!</div>';
                    else if (activeTab === "Groups") contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_content-text">Search for <strong>groups</strong> rapidly.</div>';
                    else if (activeTab === "Catalog") contentArea.innerHTML = '<div class="ROLOCATE_SMARTSEARCH_content-text">Browse the <strong>catalog</strong> for items!</div>';
                    return;
                }
                if (activeTab === "Games") fetchGameSearchResults(query);
                else if (activeTab === "Users") fetchUserSearchResults(query);
                else if (activeTab === "Groups") fetchGroupSearchResults(query);
                else if (activeTab === "Catalog") fetchCatalogSearchResults(query);
            }, 250);
        });

        const style = document.createElement('style');
        // one day i gotta clean this up cause ik some of these styles arnt needed
        style.textContent = `
        .ROLOCATE_SMARTSEARCH_form-has-feedback {
            position: relative !important;
            display: flex !important;
            align-items: center !important;
            border: 2px solid #2c2f36 !important;
            border-radius: 8px !important;
            background-color: #191a1f !important;
            transition: all 0.3s ease !important;
            z-index: 1000 !important;
        }
        .ROLOCATE_SMARTSEARCH_form-has-feedback:focus-within,
        .ROLOCATE_SMARTSEARCH_form-has-feedback.ROLOCATE_SMARTSEARCH_menu-open {
            border-color: #00b2ff !important;
        }
        .ROLOCATE_SMARTSEARCH_form-has-feedback.ROLOCATE_SMARTSEARCH_menu-open {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
            border-bottom-color: transparent !important;
            position: relative !important;
        }
        .ROLOCATE_SMARTSEARCH_form-has-feedback.ROLOCATE_SMARTSEARCH_menu-open::after {
            content: '' !important;
            position: absolute !important;
            bottom: -12px !important;
            left: -2px !important;
            right: -2px !important;
            height: 12px !important;
            border-left: 2px solid #00b2ff !important;
            border-right: 2px solid #00b2ff !important;
            background-color: transparent !important;
            z-index: 1000 !important;
        }
        .ROLOCATE_SMARTSEARCH_custom-search-input {
            width: 100% !important;
            border: none !important;
            background-color: transparent !important;
            color: #ffffff !important;
            padding: 8px 36px 8px 12px !important;
            font-size: 16px !important;
            height: 27px !important;
            border-radius: 8px !important;
        }
        .ROLOCATE_SMARTSEARCH_custom-search-input:focus {
            outline: none !important;
            box-shadow: none !important;
        }
        .ROLOCATE_SMARTSEARCH_custom-search-input::placeholder {
            color: #8a8d93 !important;
            opacity: 1 !important;
        }
        .ROLOCATE_SMARTSEARCH_custom-search-icon {
            position: absolute !important;
            right: 10px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            pointer-events: none !important;
            font-size: 16px !important;
            color: #8a8d93 !important;
        }
        .ROLOCATE_SMARTSEARCH_form-has-feedback:focus-within .ROLOCATE_SMARTSEARCH_custom-search-icon,
        .ROLOCATE_SMARTSEARCH_form-has-feedback.ROLOCATE_SMARTSEARCH_menu-open .ROLOCATE_SMARTSEARCH_custom-search-icon {
            color: #00b2ff !important;
        }
        .ROLOCATE_SMARTSEARCH_search-dropdown-menu {
            position: absolute !important;
            top: calc(100% - 2px) !important;
            left: 0 !important;
            width: 100% !important;
            background-color: #191a1f !important;
            border-left: 2px solid #00b2ff !important;
            border-right: 2px solid #00b2ff !important;
            border-bottom: 2px solid #00b2ff !important;
            border-top: none !important;
            border-radius: 0 0 8px 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            z-index: 999 !important;
            opacity: 0 !important;
            transform: translateY(-10px) !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
        }
        .ROLOCATE_SMARTSEARCH_search-dropdown-menu.ROLOCATE_SMARTSEARCH_show {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .ROLOCATE_SMARTSEARCH_dropdown-nav-tabs {
            display: flex !important;
            background-color: #1e2025 !important;
            border-bottom: 1px solid #2c2f36 !important;
        }
        .ROLOCATE_SMARTSEARCH_dropdown-tab {
            flex: 1 !important;
            padding: 12px 16px !important;
            background: none !important;
            border: none !important;
            color: #8a8d93 !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            border-bottom: 2px solid transparent !important;
        }
        .ROLOCATE_SMARTSEARCH_dropdown-tab:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .ROLOCATE_SMARTSEARCH_dropdown-tab.ROLOCATE_SMARTSEARCH_active {
            color: #00b2ff !important;
            border-bottom-color: #00b2ff !important;
            background-color: rgba(0, 178, 255, 0.1) !important;
        }
        .ROLOCATE_SMARTSEARCH_dropdown-content {
            padding: 10px !important;
            max-height: 350px !important;
            overflow-y: auto !important;
            display: block !important;
        }
        .ROLOCATE_SMARTSEARCH_content-text {
            color: #ffffff !important;
            font-size: 16px !important;
            text-align: center !important;
        }
        .ROLOCATE_SMARTSEARCH_content-text strong {
            color: #00b2ff !important;
        }
        .navbar-left.navbar-search {
            z-index: 1001 !important;
            position: relative !important;
        }
        /* Game card styles with play button */
        .ROLOCATE_SMARTSEARCH_game-card-container {
            position: relative;
            margin: 6px 0;
        }
        .ROLOCATE_SMARTSEARCH_game-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .ROLOCATE_SMARTSEARCH_game-card {
            display: flex;
            align-items: center;
            padding: 8px;
            background-color: #1e2025;
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }
        .ROLOCATE_SMARTSEARCH_game-card:hover {
            background-color: #2c2f36;
        }
        .ROLOCATE_SMARTSEARCH_thumbnail-loading {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 10px;
            background-color: #2c2f36;
            position: relative;
            overflow: hidden;
        }
        .ROLOCATE_SMARTSEARCH_thumbnail-loading::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            animation: loading 1.5s infinite;
        }
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .ROLOCATE_SMARTSEARCH_game-thumbnail {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 10px;
            object-fit: cover;
        }
        .ROLOCATE_SMARTSEARCH_game-info {
            flex: 1;
            overflow: hidden;
            padding-right: 40px !important;
        }
        .ROLOCATE_SMARTSEARCH_game-name {
            font-size: 16px;
            color: #ffffff;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 40px);
        }
        .ROLOCATE_SMARTSEARCH_game-stats {
            font-size: 16px;
            color: #8a8d93;
            margin: 2px 0 0 0;
        }
        .ROLOCATE_SMARTSEARCH_thumbs-up {
            color: #4caf50;
        }
        .ROLOCATE_SMARTSEARCH_thumbs-down {
            color: #f44336;
        }
        /* Play button styles - square with rounded edges */
        .ROLOCATE_SMARTSEARCH_play-button {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 36px;
            height: 36px;
            border-radius: 6px;
            background: rgba(76, 175, 80, 0.2);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 2;
        }
        .ROLOCATE_SMARTSEARCH_play-button:hover {
            background: rgba(76, 175, 80, 0.3);
            transform: translateY(-50%) scale(1.05);
        }
        .ROLOCATE_SMARTSEARCH_play-button svg {
            width: 18px;
            height: 18px;
        }
        /* User card styles */
        .ROLOCATE_SMARTSEARCH_user-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .ROLOCATE_SMARTSEARCH_user-card {
            display: flex;
            align-items: center;
            padding: 8px;
            margin: 6px 0;
            background-color: #1e2025;
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }
        .ROLOCATE_SMARTSEARCH_user-card:hover {
            background-color: #2c2f36;
        }
        .ROLOCATE_SMARTSEARCH_user-thumbnail {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 12px;
            object-fit: cover;
        }
        .ROLOCATE_SMARTSEARCH_user-info {
            flex: 1;
            overflow: hidden;
        }
        .ROLOCATE_SMARTSEARCH_user-display-name {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 2px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ROLOCATE_SMARTSEARCH_user-username {
            font-size: 16px;
            color: #8a8d93;
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        /* Group card styles */
        .ROLOCATE_SMARTSEARCH_group-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .ROLOCATE_SMARTSEARCH_group-card {
            display: flex;
            align-items: center;
            padding: 8px;
            margin: 6px 0;
            background-color: #1e2025;
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }
        .ROLOCATE_SMARTSEARCH_group-card:hover {
            background-color: #2c2f36;
        }
        .ROLOCATE_SMARTSEARCH_group-thumbnail {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 12px;
            object-fit: cover;
        }
        .ROLOCATE_SMARTSEARCH_group-info {
            flex: 1;
            overflow: hidden;
        }
        .ROLOCATE_SMARTSEARCH_group-name {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ROLOCATE_SMARTSEARCH_group-members {
            font-size: 16px;
            color: #8a8d93;
            margin: 0 0 2px 0;
        }
        .ROLOCATE_SMARTSEARCH_group-created {
            font-size: 16px;
            color: #6d717a;
            margin: 0;
        }
        /* Catalog card styles */
        .ROLOCATE_SMARTSEARCH_catalog-card-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }
        .ROLOCATE_SMARTSEARCH_catalog-card {
            display: flex;
            align-items: center;
            padding: 8px;
            margin: 6px 0;
            background-color: #1e2025;
            border-radius: 8px;
            transition: background-color 0.2s ease;
        }
        .ROLOCATE_SMARTSEARCH_catalog-card:hover {
            background-color: #2c2f36;
        }
        .ROLOCATE_SMARTSEARCH_catalog-thumbnail {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 12px;
            object-fit: cover;
        }
        .ROLOCATE_SMARTSEARCH_catalog-info {
            flex: 1;
            overflow: hidden;
        }
        .ROLOCATE_SMARTSEARCH_catalog-name {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 4px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ROLOCATE_SMARTSEARCH_catalog-price {
            font-size: 16px;
            margin: 0 0 2px 0;
        }
        .ROLOCATE_SMARTSEARCH_catalog-creator {
            font-size: 16px;
            color: #6d717a;
            margin: 0;
        }
        /* Status messages */
        .ROLOCATE_SMARTSEARCH_loading,
        .ROLOCATE_SMARTSEARCH_no-results,
        .ROLOCATE_SMARTSEARCH_error {
            text-align: center;
            color: #8a8d93;
            padding: 20px;
            font-size: 16px;
        }
        /* Friend badge styles */
        .ROLOCATE_SMARTSEARCH_friend-badge {
            display: inline-block;
            background-color: #6b7280;
            color: #ffffff;
            font-size: 16px;
            font-weight: 500;
            padding: 3px 8px;
            border-radius: 4px;
            margin-left: 8px;
            vertical-align: middle;
            line-height: 1.2;
            letter-spacing: 0.025em;
            transform: translateY(-3px);
            border: 1px solid #d1d5db;
        }
        `;
        document.head.appendChild(style);
        ConsoleLogEnabled('Enhanced search bar with friend integration added successfully!');

        const urlParams = new URLSearchParams(window.location.search);
        const keywordParam = urlParams.get('keyword') || urlParams.get('Keyword');
        if (keywordParam) {
            searchInput.value = decodeURIComponent(keywordParam);
            if (window.location.href.includes('/search/users')) setActiveTab('users');
            else if (window.location.href.includes('/search/communities')) setActiveTab('groups');
            else if (window.location.href.includes('/catalog')) setActiveTab('catalog');
            else setActiveTab('games');
        }

        function setActiveTab(tabKey) {
            tabButtons.forEach(btn => {
                if (btn.dataset.tab === tabKey) {
                    btn.classList.add('ROLOCATE_SMARTSEARCH_active');
                    if (btn.textContent === "Games") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Quickly search for <strong>games</strong> above!</div>`;
                    else if (btn.textContent === "Users") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Instantly find the <strong>user</strong> you're looking for!</div>`;
                    else if (btn.textContent === "Groups") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Search for <strong>groups</strong> rapidly.</div>`;
                    else if (btn.textContent === "Catalog") contentArea.innerHTML = `<div class="ROLOCATE_SMARTSEARCH_content-text">Browse the <strong>catalog</strong> for items!</div>`;
                } else btn.classList.remove('ROLOCATE_SMARTSEARCH_active');
            });
        }
        return true;
    }

    //fetch Universe ID from Place ID using GM_xmlhttpRequest
    function getUniverseIdFromPlaceId(placeId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
                headers: {
                    "Accept": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (Array.isArray(data) && data.length > 0 && data[0].universeId) {
                                // Console log inside the function
                                ConsoleLogEnabled(`Universe ID for place ${placeId}: ${data[0].universeId}`);
                                resolve(data[0].universeId);
                            } else {
                                reject(new Error("Universe ID not found in response."));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(`HTTP error! Status: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Fetches the game icon thumbnail URL using universeId via GM_xmlhttpRequest
    function getGameIconFromUniverseId(universeId) {
        const apiUrl = `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false&returnPolicy=PlaceHolder`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: {
                    "Accept": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (Array.isArray(data.data) && data.data.length > 0 && data.data[0].imageUrl) {
                                ConsoleLogEnabled(`Game icon URL for universe ${universeId}: ${data.data[0].imageUrl}`);
                                resolve(data.data[0].imageUrl);
                            } else {
                                reject(new Error("Image URL not found in response."));
                            }
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject(new Error(`HTTP error! Status: ${response.status}`));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    /*******************************************************
    name of function: quicklaunchgamesfunction
    description: adds quick launch
    *******************************************************/
    function quicklaunchgamesfunction() {
        if (!/^https?:\/\/(www\.)?roblox\.com(\/[a-z]{2})?\/home\/?$/i.test(window.location.href)) return;
        if (localStorage.getItem('ROLOCATE_quicklaunchgames') !== 'true') return;

        const observer = new MutationObserver((mutations, obs) => {
            const friendsSection = document.querySelector('.friend-carousel-container');
            const friendTiles = document.querySelectorAll('.friends-carousel-tile');

            if (friendsSection && friendTiles.length > 1) {
                obs.disconnect();

                const newGamesContainer = document.createElement('div');
                newGamesContainer.className = 'ROLOCATE_QUICKLAUNCHGAMES_new-games-container';
                newGamesContainer.innerHTML = `
                    <div class="container-header people-list-header">
                        <div class="ROLOCATE_QUICKLAUNCHGAMES_header-content">
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_title">Quick Launch Games</div>
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_subtitle">Click ◀ ▶ to reorder • Click to play</div>
                        </div>
                    </div>
                    <div class="ROLOCATE_QUICKLAUNCHGAMES_game-grid-container">
                        <div class="ROLOCATE_QUICKLAUNCHGAMES_game-grid">
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_add-tile" id="ROLOCATE_QUICKLAUNCHGAMES_add-button">
                                <div class="ROLOCATE_QUICKLAUNCHGAMES_add-content">
                                    <svg class="ROLOCATE_QUICKLAUNCHGAMES_add-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <div class="ROLOCATE_QUICKLAUNCHGAMES_add-text">Add Game</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const style = document.createElement('style');
                style.textContent = `
                    .ROLOCATE_QUICKLAUNCHGAMES_new-games-container {
                        background: #1a1c23;
                        padding: 20px;
                        margin: 16px 0;
                        margin-bottom: 32px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                        border-radius: 12px;
                        border: 1px solid #2a2a30;
                    }

                    .container-header.people-list-header {
                        margin-bottom: 18px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_header-content {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_title {
                        font-size: 22px !important;
                        font-weight: 700 !important;
                        color: #f7f8fa !important;
                        margin: 0 !important;
                        letter-spacing: -0.3px !important;
                        background: linear-gradient(to right, #8a9cff, #5d78ff) !important;
                        -webkit-background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_subtitle {
                        font-size: 12px !important;
                        color: #a0a5b1 !important;
                        font-weight: 500 !important;
                        letter-spacing: 0.2px !important;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid-container {
                        margin-top: 16px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid {
                        display: flex;
                        gap: 20px;
                        overflow-x: auto;
                        padding-bottom: 12px;
                        scrollbar-width: thin;
                        scrollbar-color: #5d78ff #2d2f36;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid::-webkit-scrollbar {
                        height: 6px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid::-webkit-scrollbar-track {
                        background: #23252d;
                        border-radius: 3px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid::-webkit-scrollbar-thumb {
                        background: linear-gradient(to right, #5d78ff, #8a9cff);
                        border-radius: 3px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-grid::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to right, #6d85ff, #9aabff);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile {
                        flex: 0 0 auto;
                        width: 170px;
                        height: 230px;
                        background: linear-gradient(145deg, #23252d, #1e2028);
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
                        position: relative;
                        overflow: hidden;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(93, 120, 255, 0.1), rgba(138, 156, 255, 0.05));
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile:hover {
                        transform: translateY(4px) scale(1.03);
                        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile:hover::before {
                        opacity: 1;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-content {
                        text-align: center;
                        color: #8b8d94;
                        z-index: 1;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 12px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-icon {
                        width: 32px;
                        height: 32px;
                        stroke-width: 2;
                        color: #5d78ff;
                        transition: all 0.3s ease;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile:hover .ROLOCATE_QUICKLAUNCHGAMES_add-icon {
                        color: #8a9cff;
                        transform: scale(1.2) rotate(90deg);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-text {
                        font-size: 15px;
                        font-weight: 600;
                        color: #d0d4e0;
                        letter-spacing: 0.3px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile {
                        flex: 0 0 auto;
                        width: 170px;
                        background: linear-gradient(145deg, #23252d, #1e2028);
                        border-radius: 14px;
                        overflow: hidden;
                        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
                        cursor: pointer;
                        position: relative;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile:hover {
                        transform: translateY(-7px) scale(1.04);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                        z-index: 10;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile .thumbnail-container {
                        width: 100%;
                        height: 150px;
                        display: block;
                        position: relative;
                        overflow: hidden;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.6s ease;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile:hover img {
                        transform: scale(1.12);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-name {
                        padding: 14px 16px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #f0f2f6;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        background: transparent;
                        position: relative;
                        z-index: 1;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-info {
                        padding: 10px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: rgba(28, 30, 38, 0.85);
                        position: relative;
                        border-top: 1px solid rgba(255, 255, 255, 0.05);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-stat {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        color: #b8b9bf;
                        gap: 4px;
                        font-weight: 500;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_player-count::before {
                        content: "👤";
                        margin-right: 4px;
                        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_like-ratio {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_like-ratio .thumb {
                        font-size: 12px;
                        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_arrow-controls {
                        position: absolute;
                        top: 55%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        z-index: 3;
                        pointer-events: none;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile:hover .ROLOCATE_QUICKLAUNCHGAMES_arrow-controls {
                        opacity: 1;
                        pointer-events: auto;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_arrow-btn {
                        width: 25px;
                        height: 25px;
                        border-radius: 8px;
                        background: rgba(20, 22, 30, 0.92);
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: #a0a5b1;
                        font-size: 16px;
                        font-weight: bold;
                        transition: all 0.25s ease;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_arrow-btn:hover {
                        background: rgba(93, 120, 255, 0.45);
                        color: #ffffff;
                        transform: scale(1.15) translateY(-2px);
                        box-shadow: 0 4px 10px rgba(93, 120, 255, 0.3);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_arrow-btn:disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                        transform: none;
                        background: rgba(60, 64, 78, 0.6);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        width: 25px;
                        height: 25px;
                        background: rgba(20, 22, 30, 0.85);
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        z-index: 2;
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button::before,
                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button::after {
                        content: '';
                        position: absolute;
                        width: 14px;
                        height: 2px;
                        background: #f0f2f6;
                        border-radius: 1px;
                        transition: all 0.2s ease;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button::before {
                        transform: rotate(45deg);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button::after {
                        transform: rotate(-45deg);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button:hover {
                        background: rgba(255, 75, 66, 0.95);
                        transform: rotate(90deg) scale(1.1);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button:hover::before,
                    .ROLOCATE_QUICKLAUNCHGAMES_remove-button:hover::after {
                        background: white;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile:hover .ROLOCATE_QUICKLAUNCHGAMES_remove-button {
                        opacity: 1;
                    }

                    @keyframes tileAppear {
                        0% { transform: translateY(10px) scale(0.95); opacity: 0; }
                        100% { transform: translateY(0) scale(1); opacity: 1; }
                    }

                    @keyframes tileRemove {
                        0% { transform: translateY(0) scale(1); opacity: 1; }
                        50% { transform: translateY(-20px) scale(0.9); opacity: 0.5; }
                        100% { transform: translateY(40px) scale(0.8); opacity: 0; }
                    }

                    @keyframes moveTile {
                        0% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                        100% { transform: translateY(0); }
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile {
                        animation: tileAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile.removing {
                        animation: tileRemove 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
                        pointer-events: none;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_game-tile.moving {
                        animation: moveTile 0.4s ease;
                    }

                    /* Popup styles (unchanged) */
                    .ROLOCATE_QUICKLAUNCHGAMES_popup-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.3);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 10000;
                        opacity: 0;
                        animation: fadeIn 0.3s ease forwards;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup {
                        background: linear-gradient(to bottom, #1f2128, #1a1c23);
                        border-radius: 18px;
                        padding: 32px;
                        width: 440px;
                        max-width: 90vw;
                        box-shadow: 0 40px 70px rgba(0, 0, 0, 0.7);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        transform: scale(0.9);
                        animation: popupIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                        position: relative;
                        overflow: hidden;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: linear-gradient(to right, #5d78ff, #8a9cff);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup h3 {
                        color: #f7f8fa;
                        font-size: 22px;
                        font-weight: 700;
                        margin: 0 0 24px 0;
                        text-align: center;
                        letter-spacing: -0.3px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup label {
                        color: #a0a5b1;
                        font-size: 15px;
                        font-weight: 500;
                        display: block;
                        margin-bottom: 10px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup input {
                        width: 100%;
                        padding: 15px;
                        background: rgba(40, 42, 50, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        color: #f7f8fa;
                        font-size: 15px;
                        margin-bottom: 28px;
                        outline: none;
                        transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup input::placeholder {
                        color: #6a6e7d;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup input:focus {
                        border-color: #5d78ff;
                        box-shadow: 0 0 0 4px rgba(93, 120, 255, 0.25);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-buttons {
                        display: flex;
                        gap: 16px;
                        justify-content: flex-end;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button {
                        padding: 14px 28px;
                        border: none;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        letter-spacing: 0.3px;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button.cancel {
                        background: rgba(60, 64, 78, 0.5);
                        color: #d0d4e0;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button.cancel:hover {
                        background: rgba(80, 84, 98, 0.7);
                        transform: translateY(-3px);
                        box-shadow: 0 6px 12px rgba(0,0,0,0.25);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button.confirm {
                        background: linear-gradient(135deg, #5d78ff, #8a9cff);
                        color: white;
                        box-shadow: 0 6px 16px rgba(93, 120, 255, 0.4);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button.confirm:hover {
                        background: linear-gradient(135deg, #6d85ff, #9aabff);
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(93, 120, 255, 0.5);
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup-button:active {
                        transform: translateY(1px);
                    }

                    @keyframes fadeIn {
                        to { opacity: 1; }
                    }

                    @keyframes popupIn {
                        to { transform: scale(1); opacity: 1; }
                    }

                    @keyframes popupFadeOut {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(0.95); opacity: 0; }
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_popup.fade-out {
                        animation: popupFadeOut 0.3s ease forwards;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile:active {
                        transform: translateY(2px) scale(0.97) !important;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
                    }

                    .ROLOCATE_QUICKLAUNCHGAMES_add-tile.clicked {
                        animation: buttonClick 0.3s ease;
                    }

                    @keyframes buttonClick {
                        0% { transform: scale(1); }
                        50% { transform: scale(0.95); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);

                friendsSection.parentNode.insertBefore(newGamesContainer, friendsSection.nextSibling);

                // dumb functions
                async function getGameDetails(universeId) {
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://games.roblox.com/v1/games?universeIds=${universeId}`,
                            headers: { "Accept": "application/json" },
                            onload: function(response) {
                                if (response.status === 200) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        resolve(data.data && data.data.length > 0 ? data.data[0] : null);
                                    } catch (e) {
                                        reject(e);
                                    }
                                } else {
                                    reject(new Error(`HTTP ${response.status}`));
                                }
                            },
                            onerror: function(err) {
                                reject(err);
                            }
                        });
                    });
                }

                function formatNumber(num) {
                    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }

                function saveCurrentOrder() {
                    const tiles = document.querySelectorAll('.ROLOCATE_QUICKLAUNCHGAMES_game-tile');
                    const order = Array.from(tiles).map(tile => tile.dataset.gameId);
                    localStorage.setItem('ROLOCATE_quicklaunch_games_storage', JSON.stringify(order));
                }

                function moveTile(tile, direction) {
                    const gameGrid = document.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_game-grid');
                    const tiles = Array.from(gameGrid.querySelectorAll('.ROLOCATE_QUICKLAUNCHGAMES_game-tile'));
                    const index = tiles.indexOf(tile);

                    if (direction === 'left' && index > 0) {
                        const target = tiles[index - 1];
                        gameGrid.insertBefore(tile, target);
                        tile.classList.add('moving');
                        setTimeout(() => tile.classList.remove('moving'), 400);
                    } else if (direction === 'right' && index < tiles.length - 1) {
                        const target = tiles[index + 1];
                        gameGrid.insertBefore(tile, target.nextSibling);
                        tile.classList.add('moving');
                        setTimeout(() => tile.classList.remove('moving'), 400);
                    }

                    saveCurrentOrder();
                }

                function addGameTile(gameId, gameDetails = null) {
                    const gameGrid = document.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_game-grid');
                    if (!gameGrid) return;

                    const gameTile = document.createElement('div');
                    gameTile.className = 'ROLOCATE_QUICKLAUNCHGAMES_game-tile';
                    gameTile.dataset.gameId = gameId;

                    gameTile.innerHTML = `
                        <a href="https://www.roblox.com/games/${gameId}#?ROLOCATE_QUICKJOIN" target="_blank">
                            <div class="thumbnail-container">
                                <div style="width:100%;height:100%;background:linear-gradient(135deg,#23252d,#1e2028);display:flex;align-items:center;justify-content:center;">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 8H20V16H4V8Z" stroke="#4a4d56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8 4V8" stroke="#4a4d56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16 4V8" stroke="#4a4d56" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_game-name">Loading...</div>
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_game-info">
                                <div class="ROLOCATE_QUICKLAUNCHGAMES_like-ratio">
                                    <span class="thumb">👍</span> -
                                </div>
                                <div class="ROLOCATE_QUICKLAUNCHGAMES_game-stat ROLOCATE_QUICKLAUNCHGAMES_player-count">-</div>
                            </div>
                        </a>
                        <div class="ROLOCATE_QUICKLAUNCHGAMES_remove-button"></div>
                        <div class="ROLOCATE_QUICKLAUNCHGAMES_arrow-controls">
                            <button class="ROLOCATE_QUICKLAUNCHGAMES_arrow-btn left" title="Move left">◀</button>
                            <button class="ROLOCATE_QUICKLAUNCHGAMES_arrow-btn right" title="Move right">▶</button>
                        </div>
                    `;

                    gameGrid.insertBefore(gameTile, gameGrid.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_add-tile'));

                    // remove button for tyhe quaklcjahcgyhin gmasjerhbvsajmn
                    const removeBtn = gameTile.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_remove-button');
                    removeBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        gameTile.classList.add('removing');
                        setTimeout(() => {
                            const games = JSON.parse(localStorage.getItem('ROLOCATE_quicklaunch_games_storage') || '[]');
                            const updatedGames = games.filter(id => id !== gameId);
                            localStorage.setItem('ROLOCATE_quicklaunch_games_storage', JSON.stringify(updatedGames));
                            gameTile.remove();
                        }, 400);
                    });

                    // arrow button
                    const leftBtn = gameTile.querySelector('.left');
                    const rightBtn = gameTile.querySelector('.right');

                    leftBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        moveTile(gameTile, 'left');
                    });

                    rightBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        moveTile(gameTile, 'right');
                    });

                    // udpat ethe vbuyttons whenever hover
                    gameTile.addEventListener('mouseenter', () => {
                        const tiles = Array.from(document.querySelectorAll('.ROLOCATE_QUICKLAUNCHGAMES_game-tile'));
                        const index = tiles.indexOf(gameTile);
                        leftBtn.disabled = index === 0;
                        rightBtn.disabled = index === tiles.length - 1;
                    });

                    // load detials of the gmae
                    (async () => {
                        try {
                            const universeId = await getUniverseIdFromPlaceId(gameId);
                            const [iconUrl, details] = await Promise.all([
                                getGameIconFromUniverseId(universeId),
                                gameDetails || getGameDetails(universeId)
                            ]);

                            const thumbContainer = gameTile.querySelector('.thumbnail-container');
                            thumbContainer.innerHTML = `<img src="${iconUrl}" alt="${details?.name || 'Game'}" onerror="this.src='https://via.placeholder.com/150x150?text=No+Image'">`;

                            const gameName = gameTile.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_game-name');
                            gameName.textContent = details?.name || 'Unknown Game';

                            const playerCount = gameTile.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_player-count');
                            const likeRatio = gameTile.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_like-ratio');

                            playerCount.textContent = formatNumber(details?.playing || 0);
                            const ratio = details?.favoritedCount > 0 ?
                                Math.min(100, Math.round((details.favoritedCount / (details.favoritedCount + details.favoritedCount * 0.1)) * 100)) : 0;
                            likeRatio.innerHTML = `<span class="thumb">👍</span> ${ratio}%`;
                        } catch (err) {
                            ConsoleLogEnabled('Game load err:', err);
                            const gameName = gameTile.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_game-name');
                            gameName.textContent = 'Load Failed';
                        }
                    })();
                }

                function showAddGamePopup() {
                    const existingGames = document.querySelectorAll('.ROLOCATE_QUICKLAUNCHGAMES_game-tile').length;
                    if (existingGames >= 10) {
                        notifications('Maximum 10 games allowed', 'error', '⚠️', '4000');
                        return;
                    }

                    const addButton = document.getElementById('ROLOCATE_QUICKLAUNCHGAMES_add-button');
                    addButton.classList.add('clicked');
                    setTimeout(() => addButton.classList.remove('clicked'), 300);

                    const overlay = document.createElement('div');
                    overlay.className = 'ROLOCATE_QUICKLAUNCHGAMES_popup-overlay';
                    overlay.innerHTML = `
                        <div class="ROLOCATE_QUICKLAUNCHGAMES_popup">
                            <h3>Add New Game</h3>
                            <label for="gameIdInput">Game ID:</label>
                            <input type="text" id="gameIdInput" placeholder="Enter game ID | RoLocate by Oqarshi">
                            <small style="display:block; margin-top:4px; color:#aaa;">
                                Example: roblox.com/games/<b style="color:#4da6ff;">17625359962</b>/RIVALS
                            </small>
                            <div class="ROLOCATE_QUICKLAUNCHGAMES_popup-buttons" style="margin-top:12px;">
                                <button class="ROLOCATE_QUICKLAUNCHGAMES_popup-button cancel">Cancel</button>
                                <button class="ROLOCATE_QUICKLAUNCHGAMES_popup-button confirm">Add Game</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    setTimeout(() => document.getElementById('gameIdInput').focus(), 100);

                    const cancelBtn = overlay.querySelector('.cancel');
                    const confirmBtn = overlay.querySelector('.confirm');
                    const input = document.getElementById('gameIdInput');

                    cancelBtn.onclick = () => {
                        overlay.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_popup').classList.add('fade-out');
                        setTimeout(() => overlay.remove(), 300);
                    };

                    confirmBtn.onclick = async () => {
                        const gameId = input.value.trim();
                        if (!gameId) {
                            notifications('Please enter a game ID', 'error', '⚠️', '4000');
                            return;
                        }
                        if (!/^\d+$/.test(gameId)) {
                            notifications('Game ID must be numeric', 'error', '⚠️', '4000');
                            return;
                        }

                        const games = JSON.parse(localStorage.getItem('ROLOCATE_quicklaunch_games_storage') || '[]');
                        if (games.includes(gameId)) {
                            notifications('Game already added!', 'error', '⚠️', '4000');
                            return;
                        }

                        confirmBtn.textContent = 'Adding...';
                        confirmBtn.disabled = true;

                        try {
                            const universeId = await getUniverseIdFromPlaceId(gameId);
                            const gameDetails = await getGameDetails(universeId);
                            games.push(gameId);
                            localStorage.setItem('ROLOCATE_quicklaunch_games_storage', JSON.stringify(games));
                            addGameTile(gameId, gameDetails);

                            overlay.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_popup').classList.add('fade-out');
                            setTimeout(() => overlay.remove(), 300);
                        } catch (error) {
                            notifications('Error: ' + (error.message || 'Failed to add game'), 'error', '⚠️', '4000');
                            confirmBtn.textContent = 'Add Game';
                            confirmBtn.disabled = false;
                        }
                    };
                }

                function loadSavedGames() {
                    const savedGames = JSON.parse(localStorage.getItem('ROLOCATE_quicklaunch_games_storage') || '[]');
                    savedGames.forEach(gameId => {
                        addGameTile(gameId);
                    });
                }

                // add button
                const addButton = document.getElementById('ROLOCATE_QUICKLAUNCHGAMES_add-button');
                addButton.addEventListener('click', showAddGamePopup);

                setTimeout(loadSavedGames, 100);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            if (!document.querySelector('.ROLOCATE_QUICKLAUNCHGAMES_new-games-container')) {
                quicklaunchgamesfunction();
            }
        }, 5000);
    }


    /*******************************************************
    name of function: betterfriends
    description: betterfriends and yea
    *******************************************************/
    // make sure to remove ROLOCATE_checkBestFriendsStatus();
    // WARNING: Do not republish this script. Licensed for personal use only.
    function betterfriends() {

        // check if in right url
        if (!/^https?:\/\/(www\.)?roblox\.com(\/[a-z]{2})?\/home\/?$/i.test(window.location.href)) return;
        // check localStorage
        if (localStorage.getItem('ROLOCATE_betterfriends') !== 'true') {
            return;
        }

        // variables
        let dropdownObserver = null;
        let avatarObserver = null;
        let mainObserver = null;
        let observerTimeout = null;
        let isStylesAdded = false;
        let bestFriendsButtonObserver = null;
        let localAvatarCache = {};

        // class names for styling
        const CLASSES = {
            STYLES_ID: 'ROLOCATE_friend-status-styles',
            STATUS_ONLINE: 'ROLOCATE_friend-status-online',
            STATUS_GAME: 'ROLOCATE_friend-status-game',
            STATUS_OFFLINE: 'ROLOCATE_friend-status-offline',
            STATUS_OTHER: 'ROLOCATE_friend-status-other',
            DROPDOWN_STYLED: 'ROLOCATE_dropdown-styled',
            TILE_STYLED: 'ROLOCATE_tile-styled',
            BEST_FRIENDS_BUTTON: 'ROLOCATE_best-friends-button',
            BEST_FRIEND_STAR: 'ROLOCATE-best-friend-star'
        };

        const addStatusStyles = () => {
            if (isStylesAdded || document.getElementById(CLASSES.STYLES_ID)) return;

            const styleSheet = document.createElement('style');
            styleSheet.id = CLASSES.STYLES_ID; // save space
            styleSheet.textContent = `
            .${CLASSES.STATUS_ONLINE},
            .${CLASSES.STATUS_GAME},
            .${CLASSES.STATUS_OFFLINE},
            .${CLASSES.STATUS_OTHER} {
                border: 4px solid !important;
                border-radius: 50% !important;
            }
            .${CLASSES.STATUS_ONLINE} { border-color: #00a2ff !important; }
            .${CLASSES.STATUS_GAME}   { border-color: #02b757 !important; }
            .${CLASSES.STATUS_OFFLINE}{ border-color: #6b7280 !important; }
            .${CLASSES.STATUS_OTHER}  { border-color: #f68802 !important; }


            .friend-tile-dropdown {
                background: #1a1c23 !important;
                border: 1px solid rgba(148, 163, 184, 0.2) !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
                overflow: hidden !important;
            }

            .friend-tile-dropdown {
                transition: opacity 0.15s ease, transform 0.15s ease !important;
            }

            .friend-tile-dropdown ul {
                padding: 8px !important;
                margin: 0 !important;
                list-style: none !important;
            }

            .friend-tile-dropdown li {
                margin: 0 !important;
                padding: 0 !important;
            }

            .friend-tile-dropdown-button {
                width: 100% !important;
                padding: 10px 14px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 6px !important;
                color: #e2e8f0 !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                text-align: left !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                transition: background-color 0.15s ease !important;
            }

            .friend-tile-dropdown-button:hover {
                background: rgba(37, 99, 235, 0.08) !important;
            }

            .friend-tile-dropdown-button:active {
                background: rgba(37, 99, 235, 0.15) !important;
            }

            .friend-tile-dropdown-button .icon {
                flex-shrink: 0 !important;
            }

            .${CLASSES.BEST_FRIENDS_BUTTON} {
                background: transparent !important;
                border: 1px solid #2563eb !important;
                border-radius: 6px !important;
                color: #3b82f6 !important;
                font-size: 13px !important;
                font-weight: 500 !important;
                padding: 6px 12px !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 6px !important;
                transition: background-color 0.15s ease, border-color 0.15s ease !important;
                margin-left: 12px !important;
                margin-top: -2px !important;
                text-decoration: none !important;
            }

            .${CLASSES.BEST_FRIENDS_BUTTON}:hover {
                background: rgba(37, 99, 235, 0.08) !important;
                border-color: #3b82f6 !important;
            }

            .${CLASSES.BEST_FRIENDS_BUTTON}:active {
                background: rgba(37, 99, 235, 0.15) !important;
            }

            .${CLASSES.BEST_FRIENDS_BUTTON} svg {
                width: 14px !important;
                height: 14px !important;
                flex-shrink: 0 !important;
            }

            /* BEST FRIENDS POPUP STYLES */
            .best-friends-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.2s ease-out;
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            .best-friends-popup {
                background: linear-gradient(135deg, #111114 0%, #1a1a1d 100%);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                width: 90%;
                max-width: 700px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: popupSlideIn 0.2s ease-out;
            }
            @keyframes popupSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .best-friends-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .best-friends-popup-header h3 {
                color: #ffffff;
                margin: 0;
                font-family: "Source Sans Pro", Arial, sans-serif;
                font-size: 20px;
                font-weight: 700;
            }
            .best-friends-close {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #ffffff;
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.15s ease;
            }
            .best-friends-close:hover {
                background: rgba(255, 59, 59, 0.2);
                border-color: rgba(255, 59, 59, 0.4);
                transform: rotate(90deg);
            }
            .best-friends-popup-grid {
                padding: 24px;
                max-height: 60vh;
                overflow-y: auto;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 16px;
            }
            .best-friends-popup-item {
                display: flex;
                align-items: center;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.15s ease;
                animation: itemSlideIn 0.2s ease-out backwards;
                position: relative;
            }
            @keyframes itemSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .best-friends-popup-item:hover {
                background: linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.1),
                    rgba(255, 255, 255, 0.08)
                );
                border-color: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px) scale(1.01);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            }
            .best-friend-avatar {
                width: 48px;
                height: 48px;
                border: 2px solid rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;
                font-size: 20px;
                flex-shrink: 0;
                overflow: hidden;
                transition: all 0.15s ease;
            }
            .best-friend-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            .best-friends-popup-item:hover .best-friend-avatar {
                transform: scale(1.05);
                border-color: rgba(255, 255, 255, 0.3);
            }
            .best-friend-name {
                color: #ffffff;
                font-family: "Source Sans Pro", Arial, sans-serif;
                font-size: 16px;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex-grow: 1;
            }
            .${CLASSES.BEST_FRIEND_STAR} {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 26px;
                height: 26px;
                color: #ffd700;
                fill: currentColor;
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
                animation: starGlow 2s ease-in-out infinite alternate;
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .${CLASSES.BEST_FRIEND_STAR}.star-visible {
                opacity: 1;
                transform: scale(1);
            }

            .${CLASSES.BEST_FRIEND_STAR}:hover {
                transform: scale(1.1);
                filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))
                        drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
            }

            @keyframes starGlow {
                0% {
                    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))
                            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
                }
                100% {
                    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))
                            drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
                }
            }
            .best-friends-loading {
                display: flex;
                align-items: center;
                color: rgba(255, 255, 255, 0.8);
                font-size: 16px;
                font-family: "Source Sans Pro", Arial, sans-serif;
                font-weight: 500;
            }
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255, 255, 255, 0.2);
                border-top: 3px solid #ffffff;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-right: 12px;
            }
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .no-best-friends {
                color: rgba(255, 255, 255, 0.6);
                font-style: italic;
                font-size: 16px;
                font-family: "Source Sans Pro", Arial, sans-serif;
                text-align: center;
                padding: 20px;
            }
            .best-friends-popup-grid::-webkit-scrollbar {
                width: 8px;
            }
            .best-friends-popup-grid::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            .best-friends-popup-grid::-webkit-scrollbar-thumb {
                background: linear-gradient(45deg, #555555, #666666);
                border-radius: 4px;
            }
            .best-friends-popup-grid::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(45deg, #666666, #777777);
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            .best-friends-search-container {
                border: 2px solid #2563eb;
                border-radius: 8px;
                flex: 1;
                margin: 0 20px;
            }
            .best-friends-search {
                width: 100%;
                padding: 10px 15px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: white;
                font-size: 14px;
                outline: none;
            }
        `;
            document.head.appendChild(styleSheet);
            isStylesAdded = true;
        };

        // create best friends section
        const createBestFriendsSection = () => {
            const existingBestFriendsSection = document.querySelector('.best-friends-section');
            if (existingBestFriendsSection) return;

            const friendsContainer = document.querySelector('.friend-carousel-container');
            if (!friendsContainer) return;

            const bestFriends = getBestFriends();
            if (bestFriends.size === 0) return;

            // create best friends section tf
            const bestFriendsSection = document.createElement('div');
            bestFriendsSection.className = 'best-friends-section';
            bestFriendsSection.style.cssText = `
        background-color: #1a1c23;
        border-radius: 12px;
        border: 1px solid #2a2a30;
        padding: 12px;
        box-sizing: border-box;
        margin: 0 0 16px 0;
    `;

            // create header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'container-header people-list-header';
            headerDiv.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 12px;
    `;

            const headerTitle = document.createElement('h2');
            headerTitle.textContent = 'Best Friends';
            headerTitle.style.cssText = `
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        font-family: "Source Sans Pro", Arial, sans-serif;
    `;

            headerDiv.appendChild(headerTitle);

            // caroskulecontioner for the frinds
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'friends-carousel-container';
            carouselContainer.style.cssText = `
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
    `;

            // create another
            const carousel = document.createElement('div');
            carousel.className = 'friends-carousel';
            carousel.style.cssText = `
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding: 4px;
    `;

            bestFriendsSection.appendChild(headerDiv);
            carouselContainer.appendChild(carousel);
            bestFriendsSection.appendChild(carouselContainer);

            // add before friends section so ontop of the frineds section
            friendsContainer.parentNode.insertBefore(bestFriendsSection, friendsContainer);

            // populat
            populateBestFriendsSection();
        };

        //add best frinds
        const populateBestFriendsSection = async () => {
            const bestFriendsCarousel = document.querySelector('.best-friends-section .friends-carousel');
            if (!bestFriendsCarousel) return;

            const bestFriends = getBestFriends();
            if (bestFriends.size === 0) return;

            bestFriendsCarousel.innerHTML = '';

            try {
                const currentUserId = Roblox?.CurrentUser?.userId;
                if (!currentUserId) return;

                const allFriends = await gmFetchFriends(currentUserId);
                if (!allFriends) return;

                const onlineFriends = await ROLOCATE_fetchOnlineFriends(currentUserId);
                const onlineStatusMap = {};
                onlineFriends.forEach(friend => {
                    const presence = friend.userPresence;
                    if (presence.UserPresenceType === 'Online') {
                        onlineStatusMap[friend.id] = 'online';
                    } else if (presence.UserPresenceType === 'InGame') {
                        onlineStatusMap[friend.id] = 'game';
                    } else {
                        onlineStatusMap[friend.id] = 'other';
                    }
                });

                // friends ingame are frist
                const bestFriendsList = allFriends
                    .filter(friend => bestFriends.has(friend.id))
                    .sort((a, b) => {
                        const aStatus = onlineStatusMap[a.id] || 'offline';
                        const bStatus = onlineStatusMap[b.id] || 'offline';

                        // priority: game > online > other (studio) > offline
                        const priority = {
                            'game': 3,
                            'other': 2,
                            'online': 1,
                            'offline': 0
                        };

                        return priority[bStatus] - priority[aStatus];
                    });

                if (bestFriendsList.length === 0) return;

                const friendIds = bestFriendsList.map(friend => friend.id);
                const avatarMap = await fetchUserAvatars(friendIds);

                bestFriendsList.forEach(friend => {
                    const tile = createBestFriendTile(friend, avatarMap[friend.id]);
                    const status = onlineStatusMap[friend.id] || 'offline';

                    // Add hover functionality only if online/offline (not ingame)
                    if (status === 'online' || status === 'offline') {
                        tile.classList.add('ROLOCATE_hover-enabled');
                    }

                    const statusIcon = tile.querySelector('[data-testid="presence-icon"]');
                    if (statusIcon) {
                        statusIcon.className = '';
                        statusIcon.classList.add(`icon-${status}`);

                        const statusTitles = {
                            'online': 'Online',
                            'other': 'In Studio', // other is studio
                            'game': 'In Game',
                            'offline': 'Offline'
                        };
                        statusIcon.setAttribute('title', statusTitles[status]);

                        const statusColors = {
                            'online': '#00a2ff',
                            'other': '#f68802',
                            'game': '#02b757',
                            'offline': '#6b7280'
                        };
                        statusIcon.style.background = statusColors[status];
                    }

                    bestFriendsCarousel.appendChild(tile);
                });

                setTimeout(() => applyFriendStatusStyling(), 100);
            } catch (error) {
                ConsoleLogEnabled('[populateBestFriendsSection] Error:', error);
            }
        };

        // remove best friends from regular friends section
        const removeBestFriendsFromRegularSection = () => {
            const bestFriends = getBestFriends();
            if (bestFriends.size === 0) return;

            const regularFriendsTiles = document.querySelectorAll('.friend-carousel-container:not(.best-friends-section .friends-carousel-container) .friends-carousel-tile');

            regularFriendsTiles.forEach(tile => {
                const nameElement = tile.querySelector('.friend-name');
                if (!nameElement) return;

                // try to find friend id from the firned ssection
                const profileLink = tile.querySelector('a[href*="/users/"]');
                if (profileLink) {
                    const match = profileLink.href.match(/\/users\/(\d+)/);
                    if (match) {
                        const friendId = parseInt(match[1]);
                        if (bestFriends.has(friendId)) {
                            tile.style.display = 'none';
                        }
                    }
                }
            });
        };

        // create individual best friend tile
        const createBestFriendTile = (friend, avatarUrl) => {
            const tile = document.createElement('div');
            tile.className = 'friends-carousel-tile';
            tile.style.cssText = `
        flex: 0 0 auto;
        width: 100px;
        text-align: center;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s ease;
    `;

            // create avatar card
            const avatarCard = document.createElement('div');
            avatarCard.className = 'avatar-card';
            avatarCard.style.cssText = `
        position: relative;
        margin-bottom: 8px;
    `;

            const avatarCardImage = document.createElement('div');
            avatarCardImage.className = 'avatar-card-image';
            avatarCardImage.style.cssText = `
        position: relative;
        width: 84px;
        height: 84px;
        margin: 0 auto;
    `;

            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl || window.Base64Images.builderman_avatar; // default to builderman if thumbnails fail for some reason
            avatarImg.alt = friend.displayName || friend.name;
            avatarImg.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    `;

            // status circle thing
            const avatarStatus = document.createElement('div');
            avatarStatus.className = 'avatar-status';
            avatarStatus.style.cssText = `
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 24px;
        height: 24px;
        background: #1a1c23;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #1a1c23;
    `;

            const statusIcon = document.createElement('span');
            statusIcon.setAttribute('data-testid', 'presence-icon');
            statusIcon.className = 'icon-offline'; // default to offline
            statusIcon.setAttribute('title', 'Offline');
            statusIcon.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #6b7280;
        display: block;
    `;

            avatarStatus.appendChild(statusIcon);
            avatarCardImage.appendChild(avatarImg);
            avatarCardImage.appendChild(avatarStatus);
            avatarCard.appendChild(avatarCardImage);

            // create name label
            const nameLabel = document.createElement('div');
            nameLabel.className = 'friend-name';
            nameLabel.textContent = friend.displayName || friend.name;
            nameLabel.style.cssText = `
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
    `;

            tile.appendChild(avatarCard);
            tile.appendChild(nameLabel);

            // add click handler to go to profile
            tile.addEventListener('click', () => {
                window.open(`https://www.roblox.com/users/${friend.id}/profile`, '_blank');
            });

            return tile;
        };

        // get friend status from tile element
        const getFriendStatusFromTile = (tile) => {
            const avatarStatusElement = tile.querySelector('.avatar-status');

            if (!avatarStatusElement) {
                return 'offline';
            }

            const statusIconElement = avatarStatusElement.querySelector('span[data-testid="presence-icon"]');
            if (!statusIconElement) {
                return 'offline';
            }

            const statusClassList = statusIconElement.className || '';
            const statusTitleAttribute = statusIconElement.getAttribute('title') || '';

            // status detection stuff for friends
            if (statusClassList.includes('icon-game') ||
                statusClassList.includes('game') ||
                statusTitleAttribute.toLowerCase().includes('game') ||
                statusTitleAttribute.toLowerCase().includes('playing')) {
                return 'game';
            }

            if (statusClassList.includes('icon-online') ||
                statusClassList.includes('online') ||
                statusTitleAttribute.toLowerCase().includes('website') ||
                statusTitleAttribute.toLowerCase().includes('active')) {
                return 'online';
            }

            if (statusClassList.includes('icon-offline') ||
                statusClassList.includes('offline') ||
                statusTitleAttribute.toLowerCase().includes('offline')) {
                return 'offline';
            }

            // if status exists but doesnt match known patterns, its "other" (studio)
            return statusClassList.trim() ? 'other' : 'offline';
        };

        // apply status outline styling to avatars
        const applyFriendStatusStyling = () => {
            const friendTileElements = document.querySelectorAll('.friends-carousel-tile');

            friendTileElements.forEach(tileElement => {
                const avatarImageElement = tileElement.querySelector('.avatar-card-image img');
                if (!avatarImageElement) return;

                // remove existing status classes
                Object.values(CLASSES).forEach(className => {
                    if (className.startsWith('ROLOCATE_friend-status-')) {
                        avatarImageElement.classList.remove(className);
                    }
                });

                const currentFriendStatus = getFriendStatusFromTile(tileElement);
                const statusClassToApply = CLASSES[`STATUS_${currentFriendStatus.toUpperCase()}`];

                if (statusClassToApply) {
                    avatarImageElement.classList.add(statusClassToApply);
                }

                tileElement.setAttribute(`data-${CLASSES.TILE_STYLED}`, 'true');
            });
        };

        // style dropdown menu stuff
        const styleDropdownMenus = () => {
            const dropdownElements = document.querySelectorAll(`.friend-tile-dropdown:not([data-${CLASSES.DROPDOWN_STYLED}])`);

            dropdownElements.forEach(dropdownElement => {
                const parentTileElement = dropdownElement.closest('.friends-carousel-tile');
                let friendStatusForDropdown = 'offline';

                if (parentTileElement) {
                    friendStatusForDropdown = getFriendStatusFromTile(parentTileElement);
                }

                dropdownElement.setAttribute('data-friend-status', friendStatusForDropdown);
                dropdownElement.setAttribute(`data-${CLASSES.DROPDOWN_STYLED}`, 'true');

                // icon styling for dropdown buttons
                const iconElements = dropdownElement.querySelectorAll('.friend-tile-dropdown-button .icon');
                iconElements.forEach(iconElement => {
                    iconElement.style.transition = 'opacity 0.2s ease';
                    iconElement.style.flexShrink = '0';
                });
            });
        };

        // function to fetch friends with fallback for missing names
        const gmFetchFriends = async (userId) => {
            const url = `https://friends.roblox.com/v1/users/${userId}/friends`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: async function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                let friends = data.data;

                                // check if any friends have missing names/displayNames
                                const friendsWithMissingData = friends.filter(friend =>
                                    !friend.name || !friend.displayName ||
                                    friend.name === "" || friend.displayName === ""
                                );

                                if (friendsWithMissingData.length > 0) {
                                    ConsoleLogEnabled(`[gmFetchFriends] Found ${friendsWithMissingData.length} friends with missing name data, fetching individual user data...`);

                                    // fetchj user data
                                    const userDataResults = await fetchUserDataWithRateLimit(friendsWithMissingData);

                                    try {

                                        // create a map for the user data
                                        const userDataMap = {};
                                        userDataResults.forEach((userData, index) => {
                                            if (userData) {
                                                userDataMap[friendsWithMissingData[index].id] = userData;
                                            }
                                        });

                                        // update the friends array with suer data
                                        friends = friends.map(friend => {
                                            if (userDataMap[friend.id]) {
                                                return {
                                                    ...friend,
                                                    name: userDataMap[friend.id].name,
                                                    displayName: userDataMap[friend.id].displayName
                                                };
                                            }
                                            return friend;
                                        });

                                        ConsoleLogEnabled(`[gmFetchFriends] Successfully updated ${Object.keys(userDataMap).length} friends with user data`);
                                    } catch (fallbackError) {
                                        ConsoleLogEnabled(`[gmFetchFriends] Failed to fetch some individual user data:`, fallbackError);
                                        // continue with user data
                                    }
                                }

                                resolve(friends);
                            } catch (e) {
                                ConsoleLogEnabled(`[gmFetchFriends] Failed to parse response for user ${userId}`, e);
                                resolve(null);
                            }
                        } else {
                            ConsoleLogEnabled(`[gmFetchFriends] Request failed for user ${userId} with status ${response.status}`);
                            resolve(null);
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled(`[gmFetchFriends] Network error for user ${userId}`, err);
                        resolve(null);
                    }
                });
            });
        };

        // function to fetch user data with rate limiting
        const fetchUserDataWithRateLimit = async (friendsWithMissingData) => {
            const results = [];
            const DELAY_MS = 100; // 100ms delay between requests
            const BATCH_SIZE = 5; // do 5 requests at a time

            for (let i = 0; i < friendsWithMissingData.length; i += BATCH_SIZE) {
                const batch = friendsWithMissingData.slice(i, i + BATCH_SIZE);

                // batch concurrently
                const batchPromises = batch.map(friend => fetchIndividualUserData(friend.id));
                const batchResults = await Promise.all(batchPromises);

                results.push(...batchResults);

                // add the delay between batches except for the last batch cause like, its the end lol
                if (i + BATCH_SIZE < friendsWithMissingData.length) {
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                }
            }

            return results;
        };

        // function to fetch individual user data
        const fetchIndividualUserData = (userId) => {
            const url = `https://users.roblox.com/v1/users/${userId}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const userData = JSON.parse(response.responseText);
                                resolve({
                                    id: userData.id,
                                    name: userData.name,
                                    displayName: userData.displayName
                                });
                            } catch (e) {
                                ConsoleLogEnabled(`[fetchIndividualUserData] Failed to parse response for user ${userId}`, e);
                                resolve(null);
                            }
                        } else if (response.status === 429) {
                            ConsoleLogEnabled(`[fetchIndividualUserData] Rate limited for user ${userId}, retrying after delay...`);
                            // retry after a longer delay for rate limiting
                            setTimeout(() => {
                                fetchIndividualUserData(userId).then(resolve);
                            }, 1000);
                        } else {
                            ConsoleLogEnabled(`[fetchIndividualUserData] Request failed for user ${userId} with status ${response.status}`);
                            resolve(null);
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled(`[fetchIndividualUserData] Network error for user ${userId}`, err);
                        resolve(null);
                    }
                });
            });
        };

        // function to fetch user avatars
        const fetchUserAvatars = (userIds) => {
            return new Promise((resolve) => {
                const requests = userIds.map(userId => ({
                    requestId: userId.toString(),
                    targetId: userId,
                    type: "AvatarHeadShot",
                    size: "150x150",
                    format: "Png",
                    isCircular: false
                }));

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://thumbnails.roblox.com/v1/batch",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(requests),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const avatarMap = {};
                                data.data.forEach(item => {
                                    if (item.state === "Completed" && item.imageUrl) {
                                        avatarMap[item.targetId] = item.imageUrl;
                                    }
                                });
                                resolve(avatarMap);
                            } catch (e) {
                                ConsoleLogEnabled("[fetchUserAvatars] Failed to parse response", e);
                                resolve({});
                            }
                        } else {
                            ConsoleLogEnabled(`[fetchUserAvatars] Request failed with status ${response.status}`);
                            resolve({});
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled("[fetchUserAvatars] Network error", err);
                        resolve({});
                    }
                });
            });
        };

        // create star icon for best friends
        const createStarIcon = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', CLASSES.BEST_FRIEND_STAR);
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'currentColor');
            svg.setAttribute('stroke', 'none');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z');
            svg.appendChild(path);

            // fade in animation
            setTimeout(() => {
                svg.classList.add('star-visible');
            }, 50);

            return svg;
        };

        // get best friends from localStorage
        const getBestFriends = () => {
            try {
                const stored = localStorage.getItem('ROLOCATE_BEST_FRIENDS_IDS');
                return stored ? new Set(JSON.parse(stored)) : new Set();
            } catch (e) {
                return new Set();
            }
        };

        // save best friends to localStorage
        const saveBestFriends = (bestFriends) => {
            localStorage.setItem('ROLOCATE_BEST_FRIENDS_IDS', JSON.stringify([...bestFriends]));
        };

        // fetch online friends status from API
        const ROLOCATE_fetchOnlineFriends = async (userId) => {
            try {
                const url = `https://friends.roblox.com/v1/users/${userId}/friends/online`;
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: resolve,
                        onerror: reject
                    });
                });

                if (response.status >= 200 && response.status < 300) {
                    return JSON.parse(response.responseText).data || [];
                }
                ConsoleLogEnabled(`ROLOCATE: Online friends API error: ${response.status}`);
                return [];
            } catch (error) {
                ConsoleLogEnabled('ROLOCATE: Failed to fetch online friends:', error);
                return [];
            }
        };

        // check best friends online status
        const ROLOCATE_checkBestFriendsStatus = async () => {
            const currentUserId = Roblox?.CurrentUser?.userId;
            if (!currentUserId) {
                ConsoleLogEnabled('ROLOCATE: Current user ID not available');
                return;
            }

            const bestFriends = getBestFriends();
            if (bestFriends.size === 0) {
                ConsoleLogEnabled('ROLOCATE: No best friends set');
                return;
            }

            const onlineFriends = await ROLOCATE_fetchOnlineFriends(currentUserId);
            const onlineIds = new Set(onlineFriends.map(friend => friend.id));

            bestFriends.forEach(bfId => {
                const friend = onlineFriends.find(f => f.id === bfId);

                if (friend) {
                    const presence = friend.userPresence;
                    if (presence.UserPresenceType === 'Online') {
                        ConsoleLogEnabled(`ROLOCATE: Best friend ${bfId} is online (Website)`);
                    } else if (presence.UserPresenceType === 'InGame') {
                        ConsoleLogEnabled(`ROLOCATE: Best friend ${bfId} is in-game: ${presence.lastLocation}`);
                    } else { // else user is in studio
                        ConsoleLogEnabled(`ROLOCATE: Best friend ${bfId} is in-studio: ${presence.UserPresenceType}`);
                    }
                } else {
                    ConsoleLogEnabled(`ROLOCATE: Best friend ${bfId} is offline`);
                }
            });
        };


        const showBestFriendsPopup = async () => {
            const overlay = document.createElement('div');
            overlay.className = 'best-friends-overlay';

            const popup = document.createElement('div');
            popup.className = 'best-friends-popup';

            const header = document.createElement('div');
            header.className = 'best-friends-popup-header';
            header.innerHTML = `<h3>Pick Your Best Friends</h3>`;

            // add search container
            const searchContainer = document.createElement('div');
            searchContainer.className = 'best-friends-search-container';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.className = 'best-friends-search';
            searchInput.placeholder = 'Search friends';
            searchContainer.appendChild(searchInput);
            header.appendChild(searchContainer);

            // add close button
            const closeButton = document.createElement('button');
            closeButton.className = 'best-friends-close';
            closeButton.innerHTML = '×';
            header.appendChild(closeButton);

            popup.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'best-friends-popup-grid';

            const loading = document.createElement('div');
            loading.className = 'best-friends-loading';
            loading.innerHTML = `<div class="loading-spinner"></div>Loading friends...`;
            grid.appendChild(loading);

            popup.appendChild(grid);
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            // get current best friends
            let bestFriends = getBestFriends();

            closeButton.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.2s ease-out forwards';
                setTimeout(() => overlay.remove(), 200);
            });

            // search stuff for the ui best friewnds
            let allFriends = [];
            const performSearch = () => {
                const searchTerm = searchInput.value.toLowerCase();
                if (!allFriends.length) return;

                grid.innerHTML = '';

                const filtered = allFriends.filter(friend =>
                    friend.displayName.toLowerCase().includes(searchTerm)
                );

                if (filtered.length === 0) {
                    grid.innerHTML = '<div class="no-best-friends">No friends match your search</div>';
                    return;
                }

                filtered.forEach(friend => {
                    const friendItem = createFriendItem(friend, bestFriends.has(friend.id));
                    grid.appendChild(friendItem);
                });
            };

            searchInput.addEventListener('input', performSearch);

            try {
                const currentUserId = Roblox?.CurrentUser?.userId || null;
                if (!currentUserId) {
                    loading.innerHTML = 'Failed to get current user ID.';
                    return;
                }

                const friends = await gmFetchFriends(currentUserId);
                if (!friends || friends.length === 0) {
                    loading.innerHTML = 'You have no friends.';
                    return;
                }

                // get friend id
                const friendIds = friends.map(friend => friend.id);

                // fetch avatars in batches
                const avatarMap = {};
                const batchSize = 5;
                for (let i = 0; i < friendIds.length; i += batchSize) {
                    const batch = friendIds.slice(i, i + batchSize);
                    const batchAvatars = await fetchUserAvatars(batch);
                    Object.assign(avatarMap, batchAvatars);
                }

                // clear loading and populate grid
                grid.innerHTML = '';
                allFriends = friends.map(friend => ({
                    id: friend.id,
                    displayName: friend.displayName || friend.name,
                    avatarUrl: avatarMap[friend.id]
                }));

                // store all friends for search
                allFriends.forEach(friend => {
                    const friendItem = createFriendItem(friend, bestFriends.has(friend.id));
                    grid.appendChild(friendItem);
                });

            } catch (error) {
                ConsoleLogEnabled('[showBestFriendsPopup] Error:', error);
                grid.innerHTML = '<div class="no-best-friends">Failed to load friends</div>';
            }

            // create friend item element
            function createFriendItem(friend, isBestFriend) {
                const friendItem = document.createElement('div');
                friendItem.className = 'best-friends-popup-item';

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'best-friend-avatar';

                if (friend.avatarUrl) {
                    const img = document.createElement('img');
                    img.src = friend.avatarUrl;
                    img.alt = friend.displayName;
                    avatarDiv.appendChild(img);
                } else {
                    avatarDiv.textContent = '👤';
                }

                const nameSpan = document.createElement('span');
                nameSpan.className = 'best-friend-name';
                nameSpan.textContent = friend.displayName;

                friendItem.appendChild(avatarDiv);
                friendItem.appendChild(nameSpan);

                // add star if best friend
                if (isBestFriend) {
                    const star = createStarIcon();
                    friendItem.appendChild(star);
                }

                // click handler
                friendItem.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // toggle best friend status
                    if (bestFriends.has(friend.id)) {
                        bestFriends.delete(friend.id);
                        const star = friendItem.querySelector(`.${CLASSES.BEST_FRIEND_STAR}`);
                        if (star) {
                            star.classList.remove('star-visible');
                            setTimeout(() => star.remove(), 300);
                        }
                    } else {

                        // check if adding would exceed the limit
                        if (bestFriends.size >= 20) {
                            notifications('Maximum of 20 best friends allowed!', 'error', '⚠️', '2000');
                            return;
                        }

                        bestFriends.add(friend.id);
                        const star = createStarIcon();
                        friendItem.appendChild(star);
                    }

                    // save to localStorage
                    saveBestFriends(bestFriends);
                });

                return friendItem;
            }
        };

        // handle best friends button click event
        const handleBestFriendsButtonClick = () => {
            showBestFriendsPopup();
            notifications('Once you pick your best friends, make sure to refresh the page for it to show best friends!', 'info', '', '6000');
            notifications('This feature is still buggy and incomplete. Remove best friends if it causes any issues.', 'warning', '👤', '12000');
        };

        // create person icon SVG
        const createPersonIcon = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2');
            svg.appendChild(path);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '12');
            circle.setAttribute('cy', '7');
            circle.setAttribute('r', '4');
            svg.appendChild(circle);

            return svg;
        };

        // create and insert best friends button
        const createAndInsertBestFriendsButton = () => {
            const existingBestFriendsButton = document.querySelector(`.${CLASSES.BEST_FRIENDS_BUTTON}`);
            if (existingBestFriendsButton) return;

            const friendsHeaderElement = document.querySelector('.container-header.people-list-header h2');
            if (!friendsHeaderElement) return;

            const bestFriendsButton = document.createElement('button');
            bestFriendsButton.className = CLASSES.BEST_FRIENDS_BUTTON;

            // add the person icon
            const personIcon = createPersonIcon();
            bestFriendsButton.appendChild(personIcon);

            // add the text
            const textNode = document.createTextNode('Best Friends');
            bestFriendsButton.appendChild(textNode);

            bestFriendsButton.addEventListener('click', handleBestFriendsButtonClick);

            // insert button right after the friends header element (next to it, not inside)
            friendsHeaderElement.insertAdjacentElement('afterend', bestFriendsButton);
        };

        // setup observer for best friends button creation
        const setupBestFriendsButtonObserver = () => {
            if (bestFriendsButtonObserver) {
                bestFriendsButtonObserver.disconnect();
            }

            bestFriendsButtonObserver = new MutationObserver(() => {
                createAndInsertBestFriendsButton();
            });

            bestFriendsButtonObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        // setup dropdown observer for dynamic content
        const setupDropdownMutationObserver = () => {
            if (dropdownObserver) {
                dropdownObserver.disconnect();
            }

            dropdownObserver = new MutationObserver((mutations) => {
                let needsDropdownStylingUpdate = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((addedNode) => {
                            if (addedNode.nodeType === 1 &&
                                (addedNode.classList?.contains('friend-tile-dropdown') ||
                                    addedNode.querySelector?.('.friend-tile-dropdown'))) {
                                needsDropdownStylingUpdate = true;
                            }
                        });
                    }
                });

                if (needsDropdownStylingUpdate) {
                    styleDropdownMenus();
                }
            });

            dropdownObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        // setup avatar observer for status changes
        const setupAvatarMutationObserver = () => {
            if (avatarObserver) {
                avatarObserver.disconnect();
            }

            const friendsContainerElement = document.querySelector('.friend-carousel-container');
            if (!friendsContainerElement) return;

            avatarObserver = new MutationObserver((mutations) => {
                let needsAvatarStylingUpdate = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((addedNode) => {
                            if (addedNode.nodeType === 1 &&
                                (addedNode.classList?.contains('friends-carousel-tile') ||
                                    addedNode.querySelector?.('.friends-carousel-tile') ||
                                    addedNode.classList?.contains('avatar-card-image') ||
                                    addedNode.classList?.contains('avatar-status'))) {
                                needsAvatarStylingUpdate = true;
                            }
                        });
                    } else if (mutation.type === 'attributes') {
                        const targetElement = mutation.target;
                        if (targetElement.classList?.contains('avatar-status') ||
                            targetElement.getAttribute('data-testid') === 'presence-icon' ||
                            targetElement.closest('.avatar-status') ||
                            targetElement.closest('.friends-carousel-tile')) {
                            needsAvatarStylingUpdate = true;
                        }
                    }
                });

                if (needsAvatarStylingUpdate) {
                    // small delay to ensure dom is ready
                    setTimeout(applyFriendStatusStyling, 100);
                }
            });

            avatarObserver.observe(friendsContainerElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'title', 'src']
            });
        };

        // apply main container styling
        const applyFriendsContainerStyling = () => {
            const friendsContainerElement = document.querySelector('.friend-carousel-container');
            if (!friendsContainerElement) return false;

            friendsContainerElement.style.backgroundColor = '#1a1c23';
            friendsContainerElement.style.borderRadius = '12px';
            friendsContainerElement.style.border = '1px solid #2a2a30';
            friendsContainerElement.style.padding = '12px';
            friendsContainerElement.style.boxSizing = 'border-box';
            friendsContainerElement.style.margin = '0 0 16px 0';

            return true;
        };

        const initializeBetterFriendsFeatures = () => {
            if (!applyFriendsContainerStyling()) return false;

            addStatusStyles();
            applyFriendStatusStyling();
            setupDropdownMutationObserver();
            setupAvatarMutationObserver();
            setupBestFriendsButtonObserver();
            createAndInsertBestFriendsButton();

            // add best friends section
            createBestFriendsSection();
            removeBestFriendsFromRegularSection();

            // check if dom is ready
            const checkWhenReady = () => {
                if (Roblox?.CurrentUser?.userId) {
                    ROLOCATE_checkBestFriendsStatus();
                } else {
                    requestAnimationFrame(checkWhenReady);
                }
            };
            checkWhenReady();
            return true;
        };

        // cleanup function for observers so no memory leaks
        const cleanupAllObservers = () => {
            if (dropdownObserver) dropdownObserver.disconnect();
            if (avatarObserver) avatarObserver.disconnect();
            if (mainObserver) mainObserver.disconnect();
            if (bestFriendsButtonObserver) bestFriendsButtonObserver.disconnect();
            if (observerTimeout) clearTimeout(observerTimeout);
        };

        // check if friends section exists
        const checkForFriendsSectionExistence = () => {
            return document.querySelector('.friend-carousel-container') ||
                document.querySelector('.add-friends-icon-container');
        };

        // main execution logic
        if (checkForFriendsSectionExistence()) {
            initializeBetterFriendsFeatures();
            return cleanupAllObservers;
        }

        // timeout for cleanup if friends section doesnt appear
        observerTimeout = setTimeout(cleanupAllObservers, 15000);

        // main observer for waiting for friends section
        mainObserver = new MutationObserver(() => {
            if (checkForFriendsSectionExistence()) {
                if (initializeBetterFriendsFeatures()) {
                    mainObserver.disconnect();
                    if (observerTimeout) clearTimeout(observerTimeout);
                }
            }
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return cleanupAllObservers;
    }



    /*******************************************************
    name of function: restoreclassicterms
    description: restores the classic terms that roblox removed
    *******************************************************/
    function restoreclassicterms() {
        // bug report fix #308650
        if (window.location.pathname.toLowerCase() === '/login' || window.location.pathname.toLowerCase().match(/^\/[a-z]{2}\/login$/)) {
            return;
        }

        if (localStorage.getItem("ROLOCATE_restoreclassicterms") !== "true") return;

        // language from the page
        const htmlElement = document.querySelector('html');
        const robloxLang = (htmlElement.getAttribute('lang') ||
            htmlElement.getAttribute('xml:lang') ||
            'en').split('-')[0].toLowerCase();
        const currentLang = Object.prototype.hasOwnProperty.call(classicTerms, robloxLang) ? robloxLang : 'en';
        const classicTermReplacementsList = classicTerms[currentLang];

        const attributesToCheckForTextContent = ["placeholder", "title", "aria-label", "alt"];
        const htmlTagsToTargetForReplacement = [
            "span", "div", "a", "button", "label", "input", "textarea",
            "h1", "h2", "h3", "li", "p"
        ];

        function isElementInOverrideContainer(element) { // override
            return !!element.closest(`
                .container-header.people-list-header,
                .server-list-container-header,
                .profile-header-social-count,
                .create-server-banner-text,
                .play-with-others-text,
                .announcement-display-body-content,
                .profile-header-buttons,
                .friends-in-server-label,
                .friends-carousel-display-name,
                .actions-btn-container,
                .games-list-header,
                .catalog-header,
                .chat-search-input,
                .select-friends-input,
                .content-action-utility
            `.replace(/\s+/g, ''));
        }

        function isElementInBlockedGameContext(element) {
            if (isElementInOverrideContainer(element)) return false;

            const experienceTerms = { // tf did i do here
                en: 'experience',
                fr: 'expérience',
                es: 'experiencia'
            };
            const currentExperienceTerm = experienceTerms[currentLang] || 'experience';
            const isExperienceTerm = element.textContent &&
                new RegExp(currentExperienceTerm, 'i').test(element.textContent);

            let currentElement = element;
            while (currentElement) {
                const elementIdLower = (currentElement.id || "").toLowerCase();
                if (!isExperienceTerm && elementIdLower.includes("game")) return true;

                const classList = currentElement.classList;
                if (classList) {
                    for (const className of classList) {
                        const lowerClassName = className.toLowerCase(); // to keep safe
                        if (
                            lowerClassName.includes("shopping-cart") ||
                            lowerClassName.includes("catalog-item-container") ||
                            lowerClassName.includes("catalog") ||
                            lowerClassName.includes("profile-header-details") ||
                            lowerClassName.includes("rolocate_smartsearch_") ||
                            lowerClassName.includes("avatar-card-container") ||
                            lowerClassName.includes("dialog-container") ||
                            lowerClassName.includes("friends-carousel-tile-label") ||
                            lowerClassName.includes("chat-container") ||
                            lowerClassName.includes("profile") ||
                            lowerClassName.includes("mutual-friends-container") ||
                            lowerClassName.includes("game-name") ||
                            lowerClassName.includes("settings-container") ||
                            lowerClassName.includes("text-overflow") ||
                            lowerClassName.includes("profile-about-content-text")
                        ) {
                            return true;
                        }
                    }
                }

                currentElement = currentElement.parentElement;
            }

            return false;
        }

        function replaceTextContentWithClassicTerms(textNode) {
            if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

            let originalText = textNode.textContent;
            let modifiedText = originalText;

            for (const {
                    from,
                    to
                }
                of classicTermReplacementsList) {
                modifiedText = modifiedText.replace(from, to);
            }

            if (modifiedText !== originalText) {
                textNode.textContent = modifiedText;
            }
        }

        function processElementForTermReplacement(element) {
            if (!element || (!isElementInOverrideContainer(element) && isElementInBlockedGameContext(element))) return;

            element.childNodes.forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE) {
                    replaceTextContentWithClassicTerms(childNode);
                }
            });

            attributesToCheckForTextContent.forEach(attribute => {
                const attributeValue = element.getAttribute(attribute);
                if (attributeValue && typeof attributeValue === "string") {
                    let updatedValue = attributeValue;
                    for (const {
                            from,
                            to
                        }
                        of classicTermReplacementsList) {
                        updatedValue = updatedValue.replace(from, to);
                    }
                    if (updatedValue !== attributeValue) {
                        element.setAttribute(attribute, updatedValue);
                    }
                }
            });
        }

        function scanAndReplaceInitialPageContent() {
            htmlTagsToTargetForReplacement.forEach(tag => {
                document.querySelectorAll(tag).forEach(processElementForTermReplacement);
            });
        }

        scanAndReplaceInitialPageContent();

        const domChangeObserver = new MutationObserver(mutationRecords => {
            for (const mutation of mutationRecords) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(addedNode => {
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            processElementForTermReplacement(addedNode);
                            htmlTagsToTargetForReplacement.forEach(tag => {
                                addedNode.querySelectorAll(tag).forEach(processElementForTermReplacement);
                            });
                        } else if (addedNode.nodeType === Node.TEXT_NODE && addedNode.parentElement) {
                            const parent = addedNode.parentElement;
                            if (isElementInOverrideContainer(parent) || !isElementInBlockedGameContext(parent)) {
                                replaceTextContentWithClassicTerms(addedNode);
                            }
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    const textNode = mutation.target;
                    if (textNode.nodeType === Node.TEXT_NODE) {
                        const parent = textNode.parentElement;
                        if (parent && (isElementInOverrideContainer(parent) || !isElementInBlockedGameContext(parent))) {
                            replaceTextContentWithClassicTerms(textNode);
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    const element = mutation.target;
                    const attrName = mutation.attributeName;

                    if (attributesToCheckForTextContent.includes(attrName)) {
                        if (isElementInOverrideContainer(element) || !isElementInBlockedGameContext(element)) {
                            const value = element.getAttribute(attrName);
                            let newValue = value;
                            for (const {
                                    from,
                                    to
                                }
                                of classicTermReplacementsList) {
                                newValue = newValue.replace(from, to);
                            }
                            if (newValue !== value) {
                                element.setAttribute(attrName, newValue);
                            }
                        }
                    }
                }
            }
        });

        domChangeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: attributesToCheckForTextContent
        });
    }

    /*******************************************************
    name of function: event listener
    description: Not a function but runs the initial setup for the script to actually
    start working. Very important
    *******************************************************/
    window.addEventListener("load", () => {
        const startTime = performance.now();

        loadBase64Library(() => {
            ConsoleLogEnabled("Loaded Base64Images. It is ready to use!");
        });

        AddSettingsButton(() => {
            ConsoleLogEnabled("Loaded Settings button!");
        });

        betterfriends();
        SmartSearch(); // love this function btw lmao
        applycustombackgrounds();
        restoreclassicterms();
        quicklaunchgamesfunction();
        manageRobloxChatBar();
        loadmutualfriends();
        Update_Popup();
        initializeLocalStorage();
        removeAds();
        showOldRobloxGreeting();
        validateManualMode();
        qualityfilterRobloxGames();

        // start observing URL changes cuase its cool
        observeURLChanges();

        const endTime = performance.now();
        const elapsed = Math.round(endTime - startTime);

        // add small delay
        setTimeout(() => {
            const endTime = performance.now();
            const elapsed = Math.round(endTime - startTime);
            console.log(`%cRoLocate by Oqarshi - loaded in ${elapsed} ms. Personal use only.`, "color: #FFD700; font-size: 18px; font-weight: bold;");
        }, 10);
    });

    /*******************************************************
    name of function: mobile stuff #1
    description: mobile mode thing. if mobile mode true and not in game link then show notification.
    *******************************************************/

    if (localStorage.ROLOCATE_mobilemode === "true" && !location.href.match(/^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//)) {
        console.log("true");
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a[href*="/games/"]').forEach(link => {
                if (link.dataset.mobileModeAttached) return;
                link.dataset.mobileModeAttached = "true";
                link.addEventListener("click", () => notifications('Tap the "Cancel" button', 'info', '❗', '60000'));
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /*******************************************************
    name of function: mobile stuff #2
    description: mobile mode thingy so that servers can show on mobile devices. this is so scuffed lmao
    *******************************************************/
    if (localStorage.ROLOCATE_mobilemode === "true" && /^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(location.href)) {
      if (!location.href.includes("#!/game-instances")) {
        // not yet on game-instance
        notifications('Mobile Mode is Enabled. Some features may be disabled.', 'info', 'ℹ️', '6000');
        setTimeout(() => {
          location.replace(location.href + "#!/game-instances");
        }, 1000);
      } else {
        // after on game-instance
        notifications('Mobile Mode is Enabled. Some features may be disabled.', 'info', 'ℹ️', '6000');
      }
    }

    /*******************************************************
    name of function: mobile stuff #3
    description: so like if on roblox.com where says go to app, tell user to not do that
    *******************************************************/
    if (localStorage.ROLOCATE_mobilemode === "true" && location.href.match(/^https:\/\/www\.roblox\.com\/?$/)) {
        notifications('Tap "Continue in browser"', 'info', '❗', '30000');
    }


    /*******************************************************
    The code for the random hop button and the filter button on roblox.com/games/*
    *******************************************************/
        if (
            window.location.href.includes("/games/") &&
            (
                localStorage.getItem("ROLOCATE_togglefilterserversbutton") === "true" ||
                localStorage.getItem("ROLOCATE_toggleserverhopbutton") === "true" ||
                localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true" ||
                localStorage.getItem("ROLOCATE_compactprivateservers") == "true"
            )
        ) {

        let Isongamespage = true;

        if (window.location.href.includes("/games/")) { // saftey check and lazy load data to save the 2mb of ram lmao
            loadServerRegions(); // lazy loads the server region data to save 1.4mb of ram
            InitRobloxLaunchHandler();

            if (window.serverRegionsByIp) {
                ConsoleLogEnabled("Server regions data loaded successfully.");
            } else {
                ConsoleLogEnabled("Failed to load server regions data.");
            }
            getFlagEmoji(); // lazy loads the flag emoji base64 to save some ram i guess
        }


        /*******************************************************
        name of function: JoinServer
        description: a function to join servers. has btroblox comptabaility
        *******************************************************/
        async function JoinServer(placeId, serverId) {
            if (!/^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(window.location.href)) return;

            // mobile mode exception
            if (localStorage.getItem("ROLOCATE_mobilemode") === "true") {
                window.open(
                    `https://oqarshi.github.io/Invite/?placeid=${placeId}&serverid=${serverId}&mobilemode=true`,
                    "_blank"
                );
                return;
            }

            if (localStorage.getItem("ROLOCATE_btrobloxfix") === "true") {

                /* ---------- recent‑servers handling (always runs) ---------- */
                if (localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true") {
                    await HandleRecentServersAddGames(placeId, serverId);
                    document.querySelector(".recent-servers-section")?.remove();
                    HandleRecentServers();
                }

                /* ---------- smartserver join---------- */
                if (localStorage.getItem("ROLOCATE_smartjoinpopup") === "true") {
                    showLoadingOverlay(placeId, serverId); // visual feedback
                    await new Promise(res => setTimeout(res, 1500)); // 1.5s delay
                }
                //join via deeplink
                ConsoleLogEnabled(`Joining via deeplink: placeId=${placeId}, serverId=${serverId}`);
                window.location.href = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${serverId}`;
            } else {
                // join via roblox launcher
                ConsoleLogEnabled(`Joining via Roblox launcher: placeId=${placeId}, serverId=${serverId}`);

                /* ---------- recent‑servers handling (always runs) ---------- */
                if (localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true") {
                    await HandleRecentServersAddGames(placeId, serverId); // fixed: was gameId
                    document.querySelector(".recent-servers-section")?.remove();
                    HandleRecentServers();
                }

                /* ---------- smartserver join---------- */
                if (localStorage.getItem("ROLOCATE_smartjoinpopup") === "true") {
                    showLoadingOverlay(placeId, serverId); // fixed: was gameId
                    await new Promise(res => setTimeout(res, 1500)); // 1.5s delay
                }

                // set flag to bypass interceptor
                window._skipRobloxJoinInterceptor = true;
                Roblox.GameLauncher.joinGameInstance(placeId, serverId);
            }
        }

        /*******************************************************
        name of function: InitRobloxLaunchHandler
        description: Detects when the user joins a Roblox server,
        adds it to recent servers (if enabled), and only when
        SmartSearch is on shows a loading overlay and waits 1.5s.
        *******************************************************/
        function InitRobloxLaunchHandler() {
            if (localStorage.getItem("ROLOCATE_btrobloxfix") === "true" || localStorage.getItem("ROLOCATE_mobilemode") === "true") {
                return;
            }

            if (!/^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(window.location.href)) return;

            if (window._robloxJoinInterceptorInitialized) return;
            window._robloxJoinInterceptorInitialized = true;

            const originalJoin = Roblox.GameLauncher.joinGameInstance;

            Roblox.GameLauncher.joinGameInstance = async function(gameId, serverId) {

                // check if we should skip interception (called from JoinServer)
                if (window._skipRobloxJoinInterceptor) {
                    window._skipRobloxJoinInterceptor = false; // reset flag
                    return originalJoin.apply(this, arguments);
                }

                ConsoleLogEnabled(`Intercepted join: Game ID = ${gameId}, Server ID = ${serverId}`);

                /* ---------- recent‑servers handling (always runs) ---------- */
                if (localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true") {
                    await HandleRecentServersAddGames(gameId, serverId);
                    document.querySelector(".recent-servers-section")?.remove();
                    HandleRecentServers();
                }

                /* ---------- smartserver join---------- */
                if (localStorage.getItem("ROLOCATE_smartjoinpopup") === "true") {
                    showLoadingOverlay(gameId, serverId); // visual feedback
                    await new Promise(res => setTimeout(res, 1500)); // 1.5s delay
                }
                /* ---------- finally join the game ---------- */
                return originalJoin.apply(this, arguments);
            };
        }
        /*******************************************************
        name of function: HandleRecentServersAddGames
        description: Adds recent servers to localstorage for safe
        keeping
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        async function HandleRecentServersAddGames(gameId, serverId) {
            const storageKey = "ROLOCATE_recentservers_button";
            const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
            const key = `${gameId}_${serverId}`;

            // check if we already have region data for this server
            if (!stored[key] || !stored[key].region) {
                try {
                    // fetch server region if not already stored
                    const region = await fetchServerDetails(gameId, serverId);
                    stored[key] = {
                        timestamp: Date.now(),
                        region: region
                    };
                } catch (error) {
                    ConsoleLogEnabled("Failed to fetch server region:", error);
                    // store without region data if fetch fails
                    stored[key] = {
                        timestamp: Date.now(),
                        region: null
                    };
                }
            } else {
                // update timestamp but keep existing region data
                stored[key].timestamp = Date.now();
            }

            localStorage.setItem(storageKey, JSON.stringify(stored));
        }


        /*******************************************************
        name of function: HandleRecentServersURL
        description: Detects recent servers from the url if
        user joins server from invite url and cleans up the URL
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        function HandleRecentServersURL() {
            // static like variable to remember if we've already found an invalid URL
            if (HandleRecentServersURL.alreadyInvalid) {
                return;
            }

            const url = window.location.href;

            // in url to match ROLOCATE_GAMEID and SERVERID from the hash
            const match = url.match(/ROLOCATE_GAMEID=(\d+)_SERVERID=([a-f0-9-]+)/i);

            if (match && match.length === 3) {
                const gameId = match[1];
                const serverId = match[2];

                // clean up the URL from invite
                const cleanURL = window.location.pathname + window.location.search;
                history.replaceState(null, null, cleanURL);

                // call handler stuff
                HandleRecentServersAddGames(gameId, serverId);
            } else {
                ConsoleLogEnabled("No gameId and serverId found in URL. (From invite link)");
                HandleRecentServersURL.alreadyInvalid = true; // Set internal flag
            }
        }

        /*******************************************************
        name of function: getFlagEmoji
        description: Guves Flag Emoji
        *******************************************************/
        function getFlagEmoji(countryCode) {
            // static variables to maintain state without globals
            if (!getFlagEmoji.flagsData) {
                ConsoleLogEnabled("[getFlagEmoji] Initializing static variables.");
                getFlagEmoji.flagsData = null;
                getFlagEmoji.isLoaded = false;
            }

            // if no countryCode provided, lazy load all data
            if (!countryCode) {
                ConsoleLogEnabled("[getFlagEmoji] No country code provided.");
                if (!getFlagEmoji.isLoaded) {
                    ConsoleLogEnabled("[getFlagEmoji] Loading flag data (no countryCode).");
                    getFlagEmoji.flagsData = loadFlagsData(); // this function comes from @require
                    getFlagEmoji.isLoaded = true;
                    ConsoleLogEnabled("[getFlagEmoji] Flag data loaded successfully.");
                } else {
                    ConsoleLogEnabled("[getFlagEmoji] Flag data already loaded.");
                }
                return;
            }

            // if data not loaded yet, load it now
            if (!getFlagEmoji.isLoaded) {
                ConsoleLogEnabled(`[getFlagEmoji] Lazy loading flag data for country: ${countryCode}`);
                getFlagEmoji.flagsData = loadFlagsData();
                getFlagEmoji.isLoaded = true;
                ConsoleLogEnabled("[getFlagEmoji] Flag data loaded successfully.");
            }

            const src = getFlagEmoji.flagsData[countryCode];

            ConsoleLogEnabled(`[getFlagEmoji] Creating flag image for country code: ${countryCode}`);

            const img = document.createElement('img');
            img.src = src;
            img.alt = countryCode;
            img.width = 24;
            img.height = 18;
            img.style.verticalAlign = 'middle';
            img.style.marginRight = '4px';

            return img;
        }


        /*******************************************************
        name of function: HandleRecentServers
        description: Detects if recent servers are in localstorage
        and then adds them to the page with css styles
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        function HandleRecentServers() {
            const serverList = document.querySelector('.server-list-options');
            if (!serverList || document.querySelector('.recent-servers-section')) return;

            const match = window.location.href.match(/\/games\/(\d+)\//);
            if (!match) return;
            const currentGameId = match[1];

            const allHeaders = document.querySelectorAll('.server-list-header');
            let friendsSectionHeader = null;

            allHeaders.forEach(header => { // fix so restore classic terms would not interfere
                const text = header.textContent.trim();
                const match = ['Servers My Connections Are In', 'Servers My Friends Are In'].some(
                    label => text === label
                );
                if (match) {
                    friendsSectionHeader = header.closest('.container-header');
                }
            });


            function formatLastPlayedWithRelative(lastPlayed, mode) {
                const lastPlayedDate = new Date(lastPlayed);
                const now = new Date();

                const diffMs = now - lastPlayedDate;
                const diffSeconds = Math.floor(diffMs / 1000);
                const diffMinutes = Math.floor(diffSeconds / 60);
                const diffHours = Math.floor(diffMinutes / 60);
                const diffDays = Math.floor(diffHours / 24);

                let relativeTime = '';
                if (diffDays > 0) {
                    relativeTime = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
                } else if (diffHours > 0) {
                    relativeTime = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
                } else if (diffMinutes > 0) {
                    relativeTime = diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
                } else {
                    relativeTime = diffSeconds <= 1 ? 'just now' : `${diffSeconds} seconds ago`;
                }

                if (mode === "relativeOnly") {
                    return relativeTime;
                }

                return `${lastPlayed} (${relativeTime})`;
            }

            if (!friendsSectionHeader) return;

            const theme = {
                bgGradient: 'linear-gradient(145deg, #1e2228, #18191e)',
                bgGradientHover: 'linear-gradient(145deg, #23272f, #1c1f25)',
                accentPrimary: '#4d85ee',
                accentGradient: 'linear-gradient(to bottom, #4d85ee, #3464c9)',
                accentGradientHover: 'linear-gradient(to bottom, #5990ff, #3b6fdd)',
                textPrimary: '#e8ecf3',
                textSecondary: '#a0a8b8',
                borderLight: 'rgba(255, 255, 255, 0.06)',
                borderLightHover: 'rgba(255, 255, 255, 0.12)',
                shadow: '0 5px 15px rgba(0, 0, 0, 0.25)',
                shadowHover: '0 8px 25px rgba(0, 0, 0, 0.3)',
                dangerGradient: 'linear-gradient(to bottom, #ff5b5b, #e04444)',
                dangerGradientHover: 'linear-gradient(to bottom, #ff7575, #f55)',
                popupBg: 'rgba(20, 22, 26, 0.95)',
                popupBorder: 'rgba(77, 133, 238, 0.2)'
            };

            const recentSection = document.createElement('div');
            recentSection.className = 'recent-servers-section premium-dark';
            recentSection.style.marginBottom = '24px';

            const headerContainer = document.createElement('div');
            headerContainer.className = 'container-header';

            const headerInner = document.createElement('div');
            headerInner.className = 'server-list-container-header';
            headerInner.style.padding = '0 4px';
            headerInner.style.display = 'flex';
            headerInner.style.justifyContent = 'space-between';
            headerInner.style.alignItems = 'center';

            const headerTitleContainer = document.createElement('div');
            headerTitleContainer.style.display = 'flex';
            headerTitleContainer.style.alignItems = 'center';

            const headerTitle = document.createElement('h2');
            headerTitle.className = 'server-list-header';
            headerTitle.textContent = 'Recent Servers';
            headerTitle.style.cssText = `
                font-weight: 600;
                color: ${theme.textPrimary};
                letter-spacing: 0.5px;
                position: relative;
                display: inline-block;
                padding-bottom: 4px;
            `;

            const headerAccent = document.createElement('span');
            headerAccent.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 40px;
                height: 2px;
                background: ${theme.accentGradient};
                border-radius: 2px;
            `;
            headerTitle.appendChild(headerAccent);
            headerTitleContainer.appendChild(headerTitle);

            const clearAllButton = document.createElement('button');
            clearAllButton.textContent = 'Clear All'; // this button is in the popup in recent servers
            clearAllButton.style.cssText = `
                background: transparent;
                color: ${theme.textSecondary};
                border: 1px solid ${theme.borderLight};
                padding: 4px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 4px;
                margin-left: 12px;
            `;

            clearAllButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Clear All
            `;

            clearAllButton.onmouseover = function() {
                this.style.background = 'rgba(100, 0, 0, 0.85)'; // dark red
                this.style.color = 'white';
                this.style.borderColor = 'rgba(100, 0, 0, 0.85)'; // boarder color
                this.style.transform = 'scale(1.02)';
            };


            clearAllButton.onmouseout = function() {
                this.style.background = 'transparent';
                this.style.color = theme.textSecondary;
                this.style.borderColor = theme.borderLight;
                this.style.transform = 'scale(1)';
            };

            clearAllButton.addEventListener('click', function() {
                const popup = document.createElement('div');
                popup.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    background: rgba(0, 0, 0, 0.3);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;

                const popupContent = document.createElement('div');
                popupContent.style.cssText = `
                    background: ${theme.popupBg};
                    border-radius: 12px;
                    padding: 20px;
                    width: 360px;
                    max-width: 90%;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    border: 1px solid ${theme.popupBorder};
                    text-align: center;
                    transform: translateY(20px);
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    opacity: 0;
                `;

                const popupTitle = document.createElement('h3');
                popupTitle.textContent = 'Clear All Recent Servers';
                popupTitle.style.cssText = `
                    color: ${theme.textPrimary};
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    font-weight: 600;
                `;

                const popupMessage = document.createElement('p');
                popupMessage.textContent = 'Are you sure you want to clear all recent servers? This action cannot be undone.';
                popupMessage.style.cssText = `
                    color: ${theme.textSecondary};
                    margin: 0 0 24px 0;
                    font-size: 13px;
                    line-height: 1.5;
                `;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                `;

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.style.cssText = `
                    background: rgba(28, 31, 37, 0.6);
                    color: ${theme.textPrimary};
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;

                cancelButton.onmouseover = function() {
                    this.style.background = 'rgba(35, 39, 46, 0.8)';
                    this.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                    this.style.transform = 'scale(1.05)';
                };

                cancelButton.onmouseout = function() {
                    this.style.background = 'rgba(28, 31, 37, 0.6)';
                    this.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    this.style.transform = 'scale(1)';
                };

                cancelButton.addEventListener('click', function() {
                    popup.style.opacity = '0';
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                });

                const confirmButton = document.createElement('button');
                confirmButton.textContent = 'Clear All'; // this one is in the popup
                confirmButton.style.cssText = `
                    background: rgba(100, 0, 0, 0.85); /* solid dark red */
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(100, 0, 0, 0.3);
                `;

                confirmButton.onmouseover = function() {
                    this.style.background = 'rgba(80, 0, 0, 0.95)'; /* slightly darker solid red on hover */
                    this.style.boxShadow = '0 4px 10px rgba(80, 0, 0, 0.4)';
                    this.style.transform = 'scale(1.02)';
                };

                confirmButton.onmouseout = function() {
                    this.style.background = 'rgba(100, 0, 0, 0.85)'; /* revert to original */
                    this.style.boxShadow = '0 2px 8px rgba(100, 0, 0, 0.3)';
                    this.style.transform = 'scale(1)';
                };


                confirmButton.addEventListener('click', function() {
                    const cardsWrapper = document.querySelector('.recent-servers-section .section-content-off');
                    if (cardsWrapper) {
                        cardsWrapper.querySelectorAll('.recent-server-card').forEach(card => {
                            card.style.transition = 'all 0.3s ease-out';
                            card.style.opacity = '0';
                            card.style.height = '0';
                            card.style.margin = '0';
                            card.style.padding = '0';
                            setTimeout(() => card.remove(), 300);
                        });
                    }

                    const storageKey = "ROLOCATE_recentservers_button";
                    localStorage.setItem(storageKey, JSON.stringify({}));

                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'no-servers-message';
                    emptyMessage.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.7; margin-right: 10px;">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 17H12.01" stroke="${theme.accentPrimary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>No Recent Servers Found`;
                    emptyMessage.style.cssText = `
                        color: ${theme.textSecondary};
                        text-align: center;
                        padding: 28px 0;
                        font-size: 14px;
                        letter-spacing: 0.3px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(20, 22, 26, 0.4);
                        border-radius: 12px;
                        border: 1px solid rgba(77, 133, 238, 0.15);
                        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                    `;

                    if (cardsWrapper) {
                        cardsWrapper.innerHTML = '';
                        cardsWrapper.appendChild(emptyMessage);
                    }

                    popup.style.opacity = '0';
                    setTimeout(() => {
                        popup.remove();
                    }, 300);
                });

                buttonContainer.appendChild(cancelButton);
                buttonContainer.appendChild(confirmButton);
                popupContent.appendChild(popupTitle);
                popupContent.appendChild(popupMessage);
                popupContent.appendChild(buttonContainer);
                popup.appendChild(popupContent);
                document.body.appendChild(popup);

                setTimeout(() => {
                    popup.style.opacity = '1';
                    popupContent.style.transform = 'translateY(0)';
                    popupContent.style.opacity = '1';
                }, 10);

                popup.addEventListener('click', function(e) {
                    if (e.target === popup) {
                        popup.style.opacity = '0';
                        setTimeout(() => {
                            popup.remove();
                        }, 300);
                    }
                });
            });

            headerInner.appendChild(headerTitleContainer);
            headerInner.appendChild(clearAllButton);
            headerContainer.appendChild(headerInner);

            const contentContainer = document.createElement('div');
            contentContainer.className = 'section-content-off empty-game-instances-container';
            contentContainer.style.padding = '8px 4px';

            const storageKey = "ROLOCATE_recentservers_button";
            let stored = JSON.parse(localStorage.getItem(storageKey) || "{}");

            const currentTime = Date.now();
            const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
            let storageUpdated = false;

            Object.keys(stored).forEach(key => {
                const serverData = stored[key];
                const serverTime = typeof serverData === 'object' ? serverData.timestamp : serverData;

                if (currentTime - serverTime > threeDaysInMs) {
                    delete stored[key];
                    storageUpdated = true;
                }
            });

            if (storageUpdated) {
                localStorage.setItem(storageKey, JSON.stringify(stored));
            }

            const keys = Object.keys(stored).filter(key => key.startsWith(`${currentGameId}_`));
            if (keys.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'no-servers-message';
                emptyMessage.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.7; margin-right: 10px;">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 17H12.01" stroke="${theme.accentPrimary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>No Recent Servers Found`;
                emptyMessage.style.cssText = `
                    color: ${theme.textSecondary};
                    text-align: center;
                    padding: 28px 0;
                    font-size: 14px;
                    letter-spacing: 0.3px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(20, 22, 26, 0.4);
                    border-radius: 12px;
                    border: 1px solid rgba(77, 133, 238, 0.15);
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                `;
                contentContainer.appendChild(emptyMessage);
            } else {
                keys.sort((a, b) => {
                    const aData = stored[a];
                    const bData = stored[b];
                    const aTime = typeof aData === 'object' ? aData.timestamp : aData;
                    const bTime = typeof bData === 'object' ? bData.timestamp : bData;
                    return bTime - aTime;
                });

                const cardsWrapper = document.createElement('div');
                cardsWrapper.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin: 2px 0;
                `;

                keys.forEach((key, index) => {
                    const [gameId, serverId] = key.split("_");
                    const serverData = stored[key];

                    const timeStored = typeof serverData === 'object' ? serverData.timestamp : serverData;
                    const regionData = typeof serverData === 'object' ? serverData.region : null;

                    const date = new Date(timeStored);
                    const formattedTime = date.toLocaleString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    let regionDisplay = '';
                    let flagElement = null;

                    if (regionData && regionData !== null) {
                        const city = regionData.city || 'Unknown';
                        const countryCode = (regionData.country && regionData.country.code) || '';
                        flagElement = getFlagEmoji(countryCode);
                    } else {
                        flagElement = getFlagEmoji('');
                        regionDisplay = 'Unknown';
                    }

                    if (!flagElement) {
                        flagElement = document.createTextNode('🌍');
                        regionDisplay = regionDisplay || 'Unknown';
                    }

                    if (flagElement && flagElement.tagName === 'IMG') {
                        flagElement.style.cssText = `
                            width: 24px;
                            height: 18px;
                            vertical-align: middle;
                            margin-right: 4px;
                            display: inline-block;
                        `;
                    }

                    if (!regionDisplay) {
                        if (regionData && regionData !== null && regionData.city) {
                            regionDisplay = regionData.city;
                        } else {
                            regionDisplay = 'Unknown';
                        }
                    }

                    const serverCard = document.createElement('div');
                    serverCard.className = 'recent-server-card premium-dark';
                    serverCard.dataset.serverKey = key;
                    serverCard.dataset.gameId = gameId;
                    serverCard.dataset.serverId = serverId;
                    serverCard.dataset.region = regionDisplay;
                    serverCard.dataset.lastPlayed = formattedTime;
                    serverCard.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 16px 22px;
                        height: 76px;
                        border-radius: 14px;
                        background: ${theme.bgGradient};
                        box-shadow: ${theme.shadow};
                        color: ${theme.textPrimary};
                        font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
                        font-size: 14px;
                        box-sizing: border-box;
                        width: 100%;
                        position: relative;
                        overflow: hidden;
                        border: 1px solid ${theme.borderLight};
                        transition: all 0.2s ease-out;
                    `;

                    serverCard.onmouseover = function() {
                        this.style.boxShadow = theme.shadowHover;
                        this.style.transform = 'translateY(-2px)';
                        this.style.borderColor = theme.borderLightHover;
                        this.style.background = theme.bgGradientHover;
                    };

                    serverCard.onmouseout = function() {
                        this.style.boxShadow = theme.shadow;
                        this.style.transform = 'translateY(0)';
                        this.style.borderColor = theme.borderLight;
                        this.style.background = theme.bgGradient;
                    };

                    const glassOverlay = document.createElement('div');
                    glassOverlay.style.cssText = `
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        height: 50%;
                        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0));
                        border-radius: 14px 14px 0 0;
                        pointer-events: none;
                    `;
                    serverCard.appendChild(glassOverlay);

                    const serverIconWrapper = document.createElement('div');
                    serverIconWrapper.style.cssText = `
                        position: absolute;
                        left: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                    `;

                    const serverIcon = document.createElement('div');
                    serverIcon.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 17L12 22L22 17" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 7L12 12L22 7L12 2L2 7Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    serverIconWrapper.appendChild(serverIcon);

                    const iconGlow = document.createElement('div');
                    iconGlow.style.cssText = `
                        position: absolute;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: ${theme.accentPrimary};
                        opacity: 0.15;
                        z-index: -1;
                    `;
                    serverIconWrapper.appendChild(iconGlow);

                    const left = document.createElement('div');
                    left.style.cssText = `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        margin-left: 12px;
                        width: calc(100% - 180px);
                    `;

                    const lastPlayed = document.createElement('div');
                    lastPlayed.textContent = `Last Played: ${formatLastPlayedWithRelative(formattedTime, "relativeOnly")}`;
                    lastPlayed.style.cssText = `
                        font-weight: 600;
                        font-size: 14px;
                        color: ${theme.textPrimary};
                        line-height: 1.3;
                        letter-spacing: 0.3px;
                        margin-left: 40px;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `;

                    const regionInfo = document.createElement('div');
                    regionInfo.style.cssText = `
                        font-size: 12px;
                        color: ${theme.textSecondary};
                        margin-top: 2px;
                        opacity: 0.9;
                        margin-left: 40px;
                        line-height: 18px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `;

                    regionInfo.innerHTML = `<span style="color: ${theme.accentPrimary};">Region:</span> `;
                    if (flagElement && (flagElement.nodeType === Node.ELEMENT_NODE || flagElement.nodeType === Node.TEXT_NODE)) {
                        if (flagElement.nodeType === Node.ELEMENT_NODE) {
                            flagElement.style.position = 'relative';
                            flagElement.style.top = '-2px';
                        }
                        regionInfo.appendChild(flagElement);
                    } else {
                        regionInfo.appendChild(document.createTextNode('🌍'));
                    }

                    const regionText = document.createElement('span');
                    regionText.textContent = ` ${regionDisplay}`;
                    regionText.style.position = 'relative';
                    regionText.style.left = '-4px';
                    regionInfo.appendChild(regionText);

                    left.appendChild(lastPlayed);
                    left.appendChild(regionInfo);

                    const buttonGroup = document.createElement('div');
                    buttonGroup.style.cssText = `
                        display: flex;
                        gap: 12px;
                        align-items: center;
                        z-index: 2;
                    `;

                    const removeButton = document.createElement('button');
                    removeButton.innerHTML = `
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    removeButton.className = 'btn-control-xs remove-button';
                    removeButton.style.cssText = `
                        background: ${theme.dangerGradient};
                        color: white;
                        border: none;
                        padding: 6px;
                        border-radius: 8px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        letter-spacing: 0.4px;
                        box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 30px;
                        height: 30px;
                    `;

                    removeButton.onmouseover = function() {
                        this.style.background = theme.dangerGradientHover;
                        this.style.boxShadow = '0 4px 10px rgba(211, 47, 47, 0.4)';
                        this.style.transform = 'translateY(-1px)';
                    };

                    removeButton.onmouseout = function() {
                        this.style.background = theme.dangerGradient;
                        this.style.boxShadow = '0 2px 8px rgba(211, 47, 47, 0.3)';
                        this.style.transform = 'translateY(0)';
                    };

                    removeButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const serverKey = this.closest('.recent-server-card').dataset.serverKey;

                        serverCard.style.transition = 'all 0.3s ease-out';
                        serverCard.style.opacity = '0';
                        serverCard.style.height = '0';
                        serverCard.style.margin = '0';
                        serverCard.style.padding = '0';

                        setTimeout(() => {
                            serverCard.remove();

                            const storedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
                            delete storedData[serverKey];
                            localStorage.setItem(storageKey, JSON.stringify(storedData));

                            if (document.querySelectorAll('.recent-server-card').length === 0) {
                                const emptyMessage = document.createElement('div');
                                emptyMessage.className = 'no-servers-message';
                                emptyMessage.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.7; margin-right: 10px;">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 17H12.01" stroke="${theme.accentPrimary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>No Recent Servers Found`;
                                emptyMessage.style.cssText = `
                                    color: ${theme.textSecondary};
                                    text-align: center;
                                    padding: 28px 0;
                                    font-size: 14px;
                                    letter-spacing: 0.3px;
                                    font-weight: 500;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: rgba(20, 22, 26, 0.4);
                                    border-radius: 12px;
                                    border: 1px solid rgba(77, 133, 238, 0.15);
                                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);
                                `;
                                cardsWrapper.appendChild(emptyMessage);
                            }
                        }, 300);
                    });

                    const separator = document.createElement('div');
                    separator.style.cssText = `
                        height: 24px;
                        width: 1px;
                        background-color: rgba(255, 255, 255, 0.15);
                        margin: 0 2px;
                    `;

                    const joinButton = document.createElement('button');
                    joinButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Join
                    `;
                    joinButton.className = 'btn-control-xs join-button';
                    joinButton.style.cssText = `
                        background: ${theme.accentGradient};
                        color: white;
                        border: none;
                        padding: 8px 18px;
                        border-radius: 10px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        letter-spacing: 0.4px;
                        box-shadow: 0 2px 10px rgba(52, 100, 201, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;

                    joinButton.addEventListener('click', function() {
                        try {
                            JoinServer(gameId, serverId);
                        } catch (error) {
                            ConsoleLogEnabled("Error joining game:", error);
                        }
                    });

                    joinButton.onmouseover = function() {
                        this.style.background = theme.accentGradientHover;
                        this.style.boxShadow = '0 4px 12px rgba(77, 133, 238, 0.4)';
                        this.style.transform = 'translateY(-1px)';
                    };

                    joinButton.onmouseout = function() {
                        this.style.background = theme.accentGradient;
                        this.style.boxShadow = '0 2px 10px rgba(52, 100, 201, 0.3)';
                        this.style.transform = 'translateY(0)';
                    };

                    const inviteButton = document.createElement('button');
                    inviteButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                            <path d="M16 18L18 20L22 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20 12V13.4C20 13.4 19.5 13 19 13C18.5 13 18 13.5 18 14C18 14.5 18.5 15 19 15C19.5 15 20 14.6 20 14.6V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4 20C4 17 7 17 8 17C9 17 13 17 13 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M9.5 10C10.8807 10 12 8.88071 12 7.5C12 6.11929 10.8807 5 9.5 5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Invite
                    `;
                    inviteButton.className = 'btn-control-xs invite-button';
                    inviteButton.style.cssText = `
                        background: rgba(28, 31, 37, 0.6);
                        color: ${theme.textPrimary};
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        padding: 8px 18px;
                        border-radius: 10px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;

                    inviteButton.addEventListener('click', function() {
                        const inviteUrl = `https://oqarshi.github.io/Invite/?placeid=${gameId}&serverid=${serverId}`;
                        inviteButton.disabled = true;

                        navigator.clipboard.writeText(inviteUrl).then(
                            function() {
                                const originalText = inviteButton.innerHTML;
                                inviteButton.innerHTML = `
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Copied!
                                `;
                                ConsoleLogEnabled(`Invite link copied to clipboard`);
                                notifications('Success! Invite link copied to clipboard!', 'success', '🎉', '2000');
                                setTimeout(() => {
                                    inviteButton.innerHTML = originalText;
                                    inviteButton.disabled = false;
                                }, 1000);
                            },
                            function(err) {
                                ConsoleLogEnabled('Could not copy text: ', err);
                                inviteButton.disabled = false;
                            }
                        );
                    });

                    inviteButton.onmouseover = function() {
                        this.style.background = 'rgba(35, 39, 46, 0.8)';
                        this.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                        this.style.transform = 'translateY(-1px)';
                    };

                    inviteButton.onmouseout = function() {
                        this.style.background = 'rgba(28, 31, 37, 0.6)';
                        this.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        this.style.transform = 'translateY(0)';
                    };

                    const moreInfoButton = document.createElement('button');
                    moreInfoButton.innerHTML = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12V8ZM12 16H12.01H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
                        </svg>
                    `;
                    moreInfoButton.className = 'btn-control-xs more-info-button';
                    moreInfoButton.style.cssText = `
                        background: rgba(28, 31, 37, 0.6);
                        color: ${theme.textPrimary};
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        padding: 8px;
                        border-radius: 10px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 34px;
                        height: 34px;
                    `;

                    moreInfoButton.onmouseover = function() {
                        this.style.background = 'rgba(35, 39, 46, 0.8)';
                        this.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                        this.style.transform = 'translateY(-1px)';
                        this.style.color = theme.accentPrimary;
                    };

                    moreInfoButton.onmouseout = function() {
                        this.style.background = 'rgba(28, 31, 37, 0.6)';
                        this.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        this.style.transform = 'translateY(0)';
                        this.style.color = theme.textPrimary;
                    };

                    moreInfoButton.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const card = this.closest('.recent-server-card');
                        const gameId = card.dataset.gameId;
                        const serverId = card.dataset.serverId;
                        const region = card.dataset.region;
                        const lastPlayed = card.dataset.lastPlayed;

                        const existingPopup = document.querySelector('.server-info-popup');
                        if (existingPopup) existingPopup.remove();

                        const popup = document.createElement('div');
                        popup.className = 'server-info-popup';
                        popup.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                            background: rgba(0, 0, 0, 0.3);
                            opacity: 0;
                            transition: opacity 0.2s ease-out;
                        `;

                        const popupContent = document.createElement('div');
                        popupContent.style.cssText = `
                            background: ${theme.popupBg};
                            border-radius: 16px;
                            width: 420px;
                            max-width: 90%;
                            padding: 24px;
                            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                            border: 1px solid ${theme.popupBorder};
                            transform: translateY(20px);
                            opacity: 0;
                            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        `;

                        const popupHeader = document.createElement('div');
                        popupHeader.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 20px;
                            padding-bottom: 12px;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        `;

                        const popupTitle = document.createElement('h3');
                        popupTitle.textContent = 'Server Information';
                        popupTitle.style.cssText = `
                            color: ${theme.textPrimary};
                            font-size: 18px;
                            font-weight: 600;
                            margin: 0;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        `;

                        const serverIconPopup = document.createElement('div');
                        serverIconPopup.innerHTML = `
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 17L12 22L22 17" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 7L12 12L22 7L12 2L2 7Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `;
                        popupTitle.prepend(serverIconPopup);

                        popupHeader.appendChild(popupTitle);

                        const infoItems = document.createElement('div');
                        infoItems.style.cssText = `
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        `;

                        function createInfoItem(label, value, icon) {
                            const item = document.createElement('div');
                            item.style.cssText = `
                                display: flex;
                                gap: 12px;
                                align-items: flex-start;
                            `;

                            const iconContainer = document.createElement('div');
                            iconContainer.style.cssText = `
                                background: rgba(77, 133, 238, 0.15);
                                border-radius: 8px;
                                width: 36px;
                                height: 36px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-shrink: 0;
                            `;
                            iconContainer.innerHTML = icon || `
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8V12V8ZM12 16H12.01H12Z" stroke="${theme.accentPrimary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${theme.accentPrimary}" stroke-width="1.5"/>
                                </svg>
                            `;

                            const textContainer = document.createElement('div');
                            const labelEl = document.createElement('div');
                            labelEl.textContent = label;
                            labelEl.style.cssText = `
                                color: ${theme.textSecondary};
                                font-size: 12px;
                                font-weight: 500;
                                margin-bottom: 4px;
                            `;

                            const valueEl = document.createElement('div');
                            valueEl.textContent = value;
                            valueEl.style.cssText = `
                                color: ${theme.textPrimary};
                                font-size: 14px;
                                font-weight: 600;
                                word-break: break-all;
                            `;

                            textContainer.appendChild(labelEl);
                            textContainer.appendChild(valueEl);
                            item.appendChild(iconContainer);
                            item.appendChild(textContainer);
                            return item;
                        }

                        infoItems.appendChild(createInfoItem('Game ID', gameId, `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 22.08V12" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `));

                        infoItems.appendChild(createInfoItem('Server ID', serverId, `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12.55L11 17.75L19 6.95" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${theme.accentPrimary}" stroke-width="1.5"/>
                            </svg>
                        `));

                        infoItems.appendChild(createInfoItem('Region', region, `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `));

                        const formattedLastPlayed = formatLastPlayedWithRelative(lastPlayed);
                        infoItems.appendChild(createInfoItem('Last Played', formattedLastPlayed, `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12L15 15" stroke="${theme.accentPrimary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${theme.accentPrimary}" stroke-width="1.5"/>
                            </svg>
                        `));

                        const popupFooter = document.createElement('div');
                        popupFooter.style.cssText = `
                            display: flex;
                            justify-content: flex-end;
                            gap: 10px;
                            margin-top: 24px;
                            padding-top: 16px;
                            border-top: 1px solid rgba(255, 255, 255, 0.08);
                        `;

                        const copyButton = document.createElement('button');
                        copyButton.textContent = 'Copy Info';
                        copyButton.style.cssText = `
                            background: rgba(28, 31, 37, 0.6);
                            color: ${theme.textPrimary};
                            border: 1px solid rgba(255, 255, 255, 0.12);
                            padding: 8px 16px;
                            border-radius: 8px;
                            font-size: 13px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.15s ease;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        `;
                        copyButton.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Copy Info
                        `;
                        copyButton.addEventListener('click', function() {
                            const infoText = `Game ID: ${gameId}\nServer ID: ${serverId}\nRegion: ${region}\nLast Played: ${lastPlayed}`;
                            navigator.clipboard.writeText(infoText);
                            copyButton.innerHTML = `
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Copied!
                            `;
                            setTimeout(() => {
                                copyButton.innerHTML = `
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                  Copy Info
                              `;
                            }, 2000);
                        });

                        const closeButton = document.createElement('button');
                        closeButton.textContent = 'Close';
                        closeButton.style.cssText = `
                            background: rgba(77, 133, 238, 0.15);
                            color: ${theme.accentPrimary};
                            border: none;
                            padding: 8px 24px;
                            border-radius: 8px;
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.15s ease;
                        `;
                        closeButton.addEventListener('click', function() {
                            popup.style.opacity = '0';
                            setTimeout(() => {
                                popup.remove();
                            }, 200);
                        });

                        popupFooter.appendChild(copyButton);
                        popupFooter.appendChild(closeButton);

                        popupContent.appendChild(popupHeader);
                        popupContent.appendChild(infoItems);
                        popupContent.appendChild(popupFooter);
                        popup.appendChild(popupContent);

                        document.body.appendChild(popup);

                        setTimeout(() => {
                            popup.style.opacity = '1';
                            popupContent.style.opacity = '1';
                            popupContent.style.transform = 'translateY(0)';
                        }, 10);

                        popup.addEventListener('click', function(e) {
                            if (e.target === popup) {
                                popup.style.opacity = '0';
                                setTimeout(() => {
                                    popup.remove();
                                }, 200);
                            }
                        });
                    });

                    buttonGroup.appendChild(removeButton);
                    buttonGroup.appendChild(separator);
                    buttonGroup.appendChild(joinButton);
                    buttonGroup.appendChild(inviteButton);
                    buttonGroup.appendChild(moreInfoButton);

                    serverCard.appendChild(serverIconWrapper);
                    serverCard.appendChild(left);
                    serverCard.appendChild(buttonGroup);

                    const lineAccent = document.createElement('div');
                    lineAccent.style.cssText = `
                        position: absolute;
                        left: 0;
                        top: 16px;
                        bottom: 16px;
                        width: 3px;
                        background: ${theme.accentGradient};
                        border-radius: 0 2px 2px 0;
                    `;
                    serverCard.appendChild(lineAccent);

                    if (index === 0) { // makes it feel premium. trust me its not a waste of space hehe
                        const cornerAccent = document.createElement('div');
                        cornerAccent.style.cssText = `
                            position: absolute;
                            right: 0;
                            top: 0;
                            width: 40px;
                            height: 40px;
                            overflow: hidden;
                            pointer-events: none;
                        `;

                        const cornerInner = document.createElement('div');
                        cornerInner.style.cssText = `
                            position: absolute;
                            right: -20px;
                            top: -20px;
                            width: 40px;
                            height: 40px;
                            background: ${theme.accentPrimary};
                            transform: rotate(45deg);
                            opacity: 0.15;
                        `;

                        cornerAccent.appendChild(cornerInner);
                        serverCard.appendChild(cornerAccent);
                    }

                    cardsWrapper.appendChild(serverCard);
                });

                contentContainer.appendChild(cardsWrapper);
            }

            recentSection.appendChild(headerContainer);
            recentSection.appendChild(contentContainer);
            friendsSectionHeader.parentNode.insertBefore(recentSection, friendsSectionHeader);
        }
        /*******************************************************
        name of function: disableYouTubeAutoplayInIframes
        Description:
        disable autoplay in YouTube iframes on game page
        *******************************************************/
        // currently bug where if u play the video it like keeps playing when scrolling through
        function disableYouTubeAutoplayInIframes(rootElement = document, observeMutations = false) {
            const processedFlag = 'data-autoplay-blocked';

            function disableAutoplay(iframe) {
                if (iframe.hasAttribute(processedFlag)) return;
                const src = iframe.src;
                if (!src || (!src.includes('youtube.com') && !src.includes('youtube-nocookie.com'))) return;
                iframe.removeAttribute('allow');
                try {
                    const url = new URL(src);
                    url.searchParams.delete('autoplay');
                    url.searchParams.set('enablejsapi', '0');
                    const newSrc = url.toString();
                    if (src !== newSrc) iframe.src = newSrc;
                    iframe.setAttribute(processedFlag, 'true');
                } catch (e) {
                    // url parsing failed, just skip it
                    ConsoleLogEnabled('Failed to parse iframe src URL', e);
                }
            }

            function processAll() {
                const selector = 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]';
                const iframes = rootElement.querySelectorAll ? rootElement.querySelectorAll(selector) : [];
                iframes.forEach(disableAutoplay);
            }
            processAll();
            if (!observeMutations) return null;
            // watch for new iframes if needed
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (!(node instanceof HTMLElement)) return;
                        if (node.tagName === 'IFRAME') {
                            disableAutoplay(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]')
                                .forEach(disableAutoplay);
                        }
                    });
                });
            });
            observer.observe(rootElement.body || rootElement, {
                childList: true,
                subtree: true
            });
            return observer;
        }

        /*******************************************************
        name of function: cleanupPrivateServerCards
        Description:
        compacts private servers so they don't take up so much space
        *******************************************************/
        function cleanupPrivateServerCards() {
          if (localStorage.ROLOCATE_compactprivateservers !== "true") return;
          // prevent multiple observers or other runs
          if (cleanupPrivateServerCards._initialized) return;
          cleanupPrivateServerCards._initialized = true;

          let isRunning = false;

          // popup stuff
          const showPlayersPopup = (thumbs, card) => {
            const overlay = document.createElement('div');
            overlay.className = 'players-popup-overlay';

            const box = document.createElement('div');
            box.className = 'players-popup-content';
            box.innerHTML = '<h3 style="font-size: 1.4em;">Players in Server</h3>';

            if (thumbs && thumbs.querySelector('img')) {
              Object.assign(thumbs.style, {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
              });

              // open in new tab
              thumbs.querySelectorAll('a').forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
              });

              // stop propagation on thumbnail clicks so links work
              thumbs.addEventListener('click', (e) => {
                e.stopPropagation();
              });

              box.appendChild(thumbs);
            } else {
              const noP = document.createElement('p');
              noP.innerHTML = '<b style="font-size: 1.2em;">No players currently in this server.</b><br><span style="color: gray; font-size: 1.0em;">RoLocate: To disable: Settings -> Appearance -> Compact Private Servers.</span>';
              box.appendChild(noP);
            }

            const close = document.createElement('button');
            close.className = 'players-popup-close btn-secondary-md';
            close.textContent = 'Close';

            const closeOverlay = () => {
              overlay.classList.add('fade-out');
              overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
            };

            close.onclick = closeOverlay;
            overlay.onclick = e => e.target === overlay && closeOverlay();

            box.addEventListener('click', (e) => {
              e.stopPropagation();
            });

            box.appendChild(close);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
          };

          // cleanup logic
          const performCleanup = () => {
            if (isRunning) return;
            isRunning = true;

            const cards = document.querySelectorAll('.card-item-private-server');
            for (const card of cards) {
              const thumbs = card.querySelector('.player-thumbnails-container');
              if (thumbs) thumbs.remove();

              const details = card.querySelector('.rbx-private-game-server-details');
              details?.classList.remove('game-server-details', 'border-right');

              const joinBtn = card.querySelector('.rbx-private-game-server-join');
              if (joinBtn && !card.querySelector('.view-players-btn')) {
                const btn = document.createElement('button');
                btn.textContent = 'View Players';
                btn.className = 'btn-full-width btn-control-xs view-players-btn btn-secondary-md btn-min-width';
                btn.style.marginTop = '6px';
                joinBtn.after(btn);

                // no "once" here allows multiple uses without leaking memory
                btn.addEventListener('click', () => {
                  const clonedThumbs = thumbs ? thumbs.cloneNode(true) : null;
                  showPlayersPopup(clonedThumbs, card);
                });
              }
            }

            document.querySelectorAll('.rbx-private-game-server-item')
              .forEach(i => i.classList.remove('rbx-private-game-server-item'));

            if (!document.getElementById('private-server-cleanup-styles')) {
              const s = document.createElement('style');
              s.id = 'private-server-cleanup-styles';
              s.textContent = `
                .card-item-private-server{display:inline-block;width:auto;max-width:250px;min-width:200px}
                #rbx-private-game-server-item-container li{display:inline-block;width:auto!important;float:none}
                .rbx-private-game-server-item-container{display:flex;flex-wrap:wrap;gap:10px}
                .players-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;animation:fadeIn .2s ease-out;opacity:1}
                .players-popup-content{background:rgba(20, 22, 26, 0.95);color:#e8ecf3;border-radius:12px;padding:20px;max-width:400px;width:90%;box-shadow:0 10px 25px rgba(0,0,0,.3);border:1px solid rgba(77, 133, 238, 0.2);text-align:center;transform:scale(.95);animation:popIn .2s ease-out forwards}
                .players-popup-content h3{margin-top:0;color:#e8ecf3;font-size:16px;font-weight:600;margin-bottom:16px}
                .players-popup-content p{color:#a0a8b8;font-size:13px;line-height:1.5;margin-bottom:24px}
                .players-popup-content .player-thumbnails-container{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:10px}
                .players-popup-close{margin-top:15px;padding:8px 20px;cursor:pointer;background:rgba(28, 31, 37, 0.6);color:#e8ecf3;border:1px solid rgba(255, 255, 255, 0.12);border-radius:6px;font-size:13px;font-weight:500;transition:0.2s}
                @keyframes fadeIn{from{opacity:0}to{opacity:1}}
                @keyframes popIn{to{transform:scale(1)}}
                @keyframes fadeOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.95)}}
                .fade-out{animation:fadeOut .2s ease-out forwards}
              `;
              document.head.appendChild(s);
            }

            isRunning = false;
          };

          // observer inside same scope
          const observer = new MutationObserver(() => {
            observer.disconnect();
            performCleanup();
            observer.observe(document.body, { childList: true, subtree: true });
          });

          // run
          performCleanup();
          observer.observe(document.body, { childList: true, subtree: true });
        }

        /*******************************************************
        name of function: createPopup
        description: Creates a popup with server filtering options and interactive buttons.
        *******************************************************/
        function createPopup() {
            const popup = document.createElement('div');
            popup.className = 'server-filters-dropdown-box';
            popup.style.cssText = `
        position: absolute;
        width: 210px;
        height: 382px;
        right: 0px;
        top: 30px;
        z-index: 1000;
        border-radius: 5px;
        background-color: rgb(30, 32, 34);
        display: flex;
        flex-direction: column;
        padding: 5px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        `;

            // header section
            const header = document.createElement('div');
            header.style.cssText = `
        display: flex;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #444;
        margin-bottom: 5px;
        `;

            // add base64 logo
            const logo = document.createElement('img');
            logo.src = window.Base64Images.logo;
            logo.style.cssText = `
        width: 24px;
        height: 24px;
        margin-right: 10px;
        `;

            // add title
            const title = document.createElement('span');
            title.textContent = 'RoLocate';
            title.style.cssText = `
        color: white;
        font-size: 18px;
        font-weight: bold;
        `;

            // add logo and title
            header.appendChild(logo);
            header.appendChild(title);

            // add header
            popup.appendChild(header);

            // stuff for unique names, tooltips, experimental status, and explanations for each button
            const buttonData = [{
                    name: "Smallest Servers",
                    tooltip: "**Reverses the order of the server list.** The emptiest servers will be displayed first.",
                    experimental: false,
                    disabled: false,
                },
                {
                    name: "Available Space",
                    tooltip: "**Filters out servers which are full.** Servers with space will only be shown.",
                    experimental: false,
                    disabled: false,
                },
                {
                    name: "Player Count",
                    tooltip: "**Rolocate will find servers with your specified player count or fewer.** Searching for up to 3 minutes. If no exact match is found, it shows servers closest to the target.",
                    experimental: false,
                    disabled: false,
                },
                {
                    name: "Random Shuffle",
                    tooltip: "**Display servers in a completely random order.** Shows servers with space and servers with low player counts in a randomized order.",
                    experimental: false,
                    disabled: false,
                },
                {
                    name: "Server Region",
                    tooltip: "**Filters servers by region.** Offering more accuracy than 'Best Connection' in areas with fewer Roblox servers, like India, or in games with high player counts.",
                    experimental: true,
                    experimentalExplanation: "**Experimental**: Still in development and testing. Sometimes user location cannot be detected.",
                    disabled: false,
                },
                {
                    name: "Best Connection",
                    tooltip: "**Automatically joins the fastest servers for you.** However, it may be less accurate in regions with fewer Roblox servers, like India, or in games with large player counts.",
                    experimental: true,
                    experimentalExplanation: "**Experimental**: Still in development and testing.  it may be less accurate in regions with fewer Roblox servers",
                    disabled: false,
                },
                {
                    name: "Join Small Server",
                    tooltip: "**Automatically tries to join a server with a very low population.** On popular games servers may fill up very fast so you might not always get in alone.",
                    experimental: false,
                    disabled: false,
                },
                {
                    name: "Newest server",
                    tooltip: "**Tries to find Roblox servers that are less than 5 minute old.** This may take longer for very popular games or games with few players.",
                    disabledExplanation: "Does not work anymore.",
                    experimental: false,
                    disabled: true,
                },
            ];

            // create buttons with unique names, tooltips, experimental status, and explanations
            buttonData.forEach((data, index) => {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'server-filter-option';
                buttonContainer.classList.add(data.disabled ? "disabled" : "enabled");

                // create a wrapper for the button content that can have opacity applied
                const buttonContentWrapper = document.createElement('div');
                buttonContentWrapper.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            ${data.disabled ? 'opacity: 0.7;' : ''}
        `;

                buttonContainer.style.cssText = `
            width: 190px;
            height: 30px;
            background-color: ${data.disabled ? '#2c2c2c' : '#393B3D'};
            margin: 5px;
            border-radius: 5px;
            padding: 3.5px;
            position: relative;
            cursor: ${data.disabled ? 'not-allowed' : 'pointer'};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            transform: translateY(-30px);
            opacity: 0;
        `;

                // tooltip on the right side
                const tooltip = document.createElement('div');
                tooltip.className = 'filter-tooltip';
                tooltip.style.cssText = `
            display: none;
            position: absolute;
            top: -10px;
            left: 200px;
            width: auto;
            inline-size: 200px;
            height: auto;
            background-color: #191B1D;
            color: white;
            padding: 5px;
            border-radius: 5px;
            white-space: pre-wrap;
            font-size: 14px;
            opacity: 1;
            z-index: 1001;
        `;

                // parse tooltip text and replace **...** with bold HTML tags
                tooltip.innerHTML = data.tooltip.replace(/\*\*(.*?)\*\*/g, "<b style='color: #068f00;'>$1</b>");

                const buttonText = document.createElement('p');
                buttonText.style.cssText = `
            margin: 0;
            color: white;
            font-size: 16px;
        `;
                buttonText.textContent = data.name;

                // add "DISABLED" style if the button is disabled
                if (data.disabled) {
                    // show explanation tooltip (left side like experimental)
                    const disabledTooltip = document.createElement('div');
                    disabledTooltip.className = 'disabled-tooltip';
                    disabledTooltip.style.cssText = `
                        display: none;
                        position: absolute;
                        top: 0;
                        right: 200px;
                        width: 200px;
                        background-color: #191B1D;
                        color: white;
                        padding: 5px;
                        border-radius: 5px;
                        font-size: 14px;
                        white-space: pre-wrap;
                        z-index: 1001;
                        opacity: 1;
                    `;
                    disabledTooltip.innerHTML = data.disabledExplanation.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold; color: #ff5555;">$1</span>');

                    buttonContainer.appendChild(disabledTooltip);

                    // add disabled indicator
                    const disabledIndicator = document.createElement('span');
                    disabledIndicator.textContent = 'DISABLED';
                    disabledIndicator.style.cssText = `
                        margin-left: 8px;
                        color: #ff5555;
                        font-size: 10px;
                        font-weight: bold;
                        background-color: rgba(255, 85, 85, 0.1);
                        padding: 1px 4px;
                        border-radius: 3px;
                    `;
                    buttonText.appendChild(disabledIndicator);

                    // show on hover
                    buttonContainer.addEventListener('mouseenter', () => {
                        disabledTooltip.style.display = 'block';
                    });
                    buttonContainer.addEventListener('mouseleave', () => {
                        disabledTooltip.style.display = 'none';
                    });
                }

                // add "EXP" label if the button is experimental
                if (data.experimental) {
                    const expLabel = document.createElement('span');
                    expLabel.textContent = 'EXP';
                    expLabel.style.cssText = `
                margin-left: 8px;
                color: gold;
                font-size: 12px;
                font-weight: bold;
                background-color: rgba(255, 215, 0, 0.1);
                padding: 2px 6px;
                border-radius: 3px;
            `;
                    buttonText.appendChild(expLabel);

                    // add experimental explanation tooltip (left side)
                    const experimentalTooltip = document.createElement('div');
                    experimentalTooltip.className = 'experimental-tooltip';
                    experimentalTooltip.style.cssText = `
                      display: none;
                      position: absolute;
                      top: 0;
                      right: 200px;
                      width: 200px;
                      background-color: #191B1D;
                      color: white;
                      padding: 5px;
                      border-radius: 5px;
                      font-size: 14px;
                      white-space: pre-wrap;
                      z-index: 1001;
                      opacity: 1;
                  `;

                    // function to replace **text** with bold and gold styled text
                    const formatText = (text) => {
                        return text.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold; color: gold;">$1</span>');
                    };

                    // apply the formatting to the experimental explanation
                    experimentalTooltip.innerHTML = formatText(data.experimentalExplanation);

                    buttonContainer.appendChild(experimentalTooltip);

                    // show on hover
                    buttonContainer.addEventListener('mouseenter', () => {
                        experimentalTooltip.style.display = 'block';
                    });
                    buttonContainer.addEventListener('mouseleave', () => {
                        experimentalTooltip.style.display = 'none';
                    });
                }

                // appent main tooltip
                buttonContainer.appendChild(tooltip);

                // button text next top cointyainer
                buttonContentWrapper.appendChild(buttonText);

                // content wrapper to button contadiner
                buttonContainer.appendChild(buttonContentWrapper);

                // event listerners:
                buttonContainer.addEventListener('mouseover', () => {
                    tooltip.style.display = 'block';

                    if (data.experimental) {
                        const expTooltip = buttonContainer.querySelector('.experimental-tooltip');
                        if (expTooltip) expTooltip.style.display = 'block';
                    }
                    if (!data.disabled) {
                        buttonContainer.style.backgroundColor = '#4A4C4E';
                        buttonContainer.style.transform = 'translateY(0px) scale(1.02)';
                    }
                });

                buttonContainer.addEventListener('mouseout', () => {
                    tooltip.style.display = 'none';

                    if (data.experimental) {
                        const expTooltip = buttonContainer.querySelector('.experimental-tooltip');
                        if (expTooltip) expTooltip.style.display = 'none';
                    }
                    if (!data.disabled) {
                        buttonContainer.style.backgroundColor = '#393B3D';
                        buttonContainer.style.transform = 'translateY(0px) scale(1)';
                    }
                });

                buttonContainer.addEventListener('click', () => {
                    // no clciks on disabled buttons
                    if (data.disabled) {
                        return;
                    }

                    // add click animation
                    buttonContainer.style.transform = 'translateY(0px) scale(0.95)';
                    setTimeout(() => {
                        buttonContainer.style.transform = 'translateY(0px) scale(1)';
                    }, 150);

                    switch (index) {
                        case 0:
                            smallest_servers();
                            break;
                        case 1:
                            available_space_servers();
                            break;
                        case 2:
                            player_count_tab();
                            break;
                        case 3:
                            random_servers();
                            break;
                        case 4:
                            createServerCountPopup((totalLimit) => {
                                rebuildServerList(gameId, totalLimit);
                            });
                            break;
                        case 5:
                            rebuildServerList(gameId, 100, true); // finds 100 servers but this is for safety
                            break;
                        case 6:
                            auto_join_small_server();
                            break;
                        case 7:
                            auto_join_small_server(); // for now
                            break;
                    }
                });

                popup.appendChild(buttonContainer);
            });

            // trigger the button animations after DOM insertion
            setTimeout(() => {
                const buttons = popup.querySelectorAll('.server-filter-option');
                buttons.forEach((button, index) => {
                    setTimeout(() => {
                        button.style.transform = 'translateY(0px)';
                        button.style.opacity = '1';
                    }, index * 30);
                });
            }, 20);

            return popup;
        }



        /*******************************************************
        name of function: ServerHop
        description: Handles server hopping by fetching and joining a random server, excluding recently joined servers.
        *******************************************************/
        function ServerHop() {
            ConsoleLogEnabled("Starting server hop...");

            showLoadingOverlay();
            // extract the game ID from the URL
            const url = window.location.href;
            const gameId = (url.split("/").indexOf("games") !== -1) ? url.split("/")[url.split("/").indexOf("games") + 1] : null;

            ConsoleLogEnabled(`Game ID: ${gameId}`);

            // array to store server IDs
            let serverIds = [];
            let nextPageCursor = null;
            let pagesRequested = 0;

            // get the list of all recently joined servers in localStorage
            const allStoredServers = Object.keys(localStorage)
                .filter(key => key.startsWith("ROLOCATE_recentServers_")) // server go after!
                .map(key => JSON.parse(localStorage.getItem(key)));

            // remove any expired servers for all games (older than 15 minutes)
            const currentTime = new Date().getTime();
            allStoredServers.forEach(storedServers => {
                const validServers = storedServers.filter(server => {
                    const lastJoinedTime = new Date(server.timestamp).getTime();
                    return (currentTime - lastJoinedTime) <= 15 * 60 * 1000; // 15 minutes
                });

                // update localStorage with the valid servers
                localStorage.setItem(`ROLOCATE_recentServers_${gameId}`, JSON.stringify(validServers));
            });

            // get the list of recently joined servers for the current game
            const storedServers = JSON.parse(localStorage.getItem(`ROLOCATE_recentServers_${gameId}`)) || [];

            // check if there are any recently joined servers and exclude them from selection
            const validServers = storedServers.filter(server => {
                const lastJoinedTime = new Date(server.timestamp).getTime();
                return (currentTime - lastJoinedTime) <= 15 * 60 * 1000; // 15 minutes
            });

            if (validServers.length > 0) {
                ConsoleLogEnabled(`Excluding servers joined in the last 15 minutes: ${validServers.map(s => s.serverId).join(', ')}`);
            } else {
                ConsoleLogEnabled("No recently joined servers within the last 15 minutes. Proceeding to pick a new server.");
            }

            let currentDelay = 150; // Start with 0.15 seconds
            let isRateLimited = false;

            /*******************************************************
            name of function: fetchServers
            description: Function to fetch servers
            *******************************************************/
            function fetchServers(cursor) {
                // randomly choose between sortOrder=1 and sortOrder=2
                const sortOrder = Math.random() < 0.5 ? 1 : 2;
                const url = `https://games.roblox.com/v1/games/${gameId}/servers/0?sortOrder=${sortOrder}&excludeFullGames=true&limit=100${cursor ? `&cursor=${cursor}` : ""}`;

                ConsoleLogEnabled(`Using sortOrder: ${sortOrder}`);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        ConsoleLogEnabled("API Response:", response.responseText);

                        if (response.status === 429) {
                            ConsoleLogEnabled("Rate limited! Slowing down requests.");
                            isRateLimited = true;
                            currentDelay = 750; // switch to 0.75 seconds
                            setTimeout(() => fetchServers(cursor), currentDelay);
                            return;
                        } else if (isRateLimited && response.status === 200) {
                            ConsoleLogEnabled("Recovered from rate limiting. Restoring normal delay.");
                            isRateLimited = false;
                            currentDelay = 150; // back to normal 0.15 seconds
                        }

                        try {
                            const data = JSON.parse(response.responseText);

                            if (data.errors) {
                                ConsoleLogEnabled("Skipping unreadable response:", data.errors[0].message);
                                return;
                            }

                            setTimeout(() => {
                                if (!data || !data.data) {
                                    ConsoleLogEnabled("Invalid response structure: 'data' is missing or undefined", data);
                                    return;
                                }

                                data.data.forEach(server => {
                                    if (validServers.some(vs => vs.serverId === server.id)) {
                                        ConsoleLogEnabled(`Skipping previously joined server ${server.id}.`);
                                    } else {
                                        serverIds.push(server.id);
                                    }
                                });

                                if (data.nextPageCursor && pagesRequested < 4) {
                                    pagesRequested++;
                                    ConsoleLogEnabled(`Fetching page ${pagesRequested}...`);
                                    fetchServers(data.nextPageCursor);
                                } else {
                                    pickRandomServer();
                                }
                            }, currentDelay);
                        } catch (error) {
                            ConsoleLogEnabled("Error parsing response:", error);
                        }
                    },
                    onerror: function(error) {
                        ConsoleLogEnabled("Error fetching server data:", error);
                    }
                });
            }

            /*******************************************************
            name of function: pickRandomServer
            description: Function to pick a random server and join it
            *******************************************************/
            function pickRandomServer() {
                if (serverIds.length > 0) {
                    const randomServerId = serverIds[Math.floor(Math.random() * serverIds.length)];
                    ConsoleLogEnabled(`Joining server: ${randomServerId}`);

                    // join the game instance with the selected server ID
                    JoinServer(gameId, randomServerId);

                    // store the selected server ID with the time and date in localStorage
                    const timestamp = new Date().toISOString();
                    const newServer = {
                        serverId: randomServerId,
                        timestamp
                    };
                    validServers.push(newServer);

                    // save the updated list of recently joined servers to localStorage
                    localStorage.setItem(`ROLOCATE_recentServers_${gameId}`, JSON.stringify(validServers));

                    ConsoleLogEnabled(`Server ${randomServerId} stored with timestamp ${timestamp}`);
                } else {
                    ConsoleLogEnabled("No servers found to join.");
                    notifications("You have joined all the servers recently. No servers found to join.", "error", "⚠️", "5000");
                }
            }

            // start the fetching process
            fetchServers();
        }

        /*******************************************************
        name of function: Bulk of functions for observer stuff
        description: adds lots of stuff like autoserver regions and stuff
        *******************************************************/
        if (/^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(window.location.href)) {
            if (localStorage.ROLOCATE_AutoRunServerRegions === "true") {
                (() => {
                    /*******************************************************
                    name of function: waitForElement
                    description: waits for a specific element to load onto
                    the page
                    *******************************************************/
                    function waitForElement(selector, timeout = 5000) {
                        return new Promise((resolve, reject) => {
                            const intervalTime = 100;
                            let elapsed = 0;
                            const interval = setInterval(() => {
                                const el = document.querySelector(selector);
                                if (el) {
                                    clearInterval(interval);
                                    resolve(el);
                                } else if (elapsed >= timeout) {
                                    clearInterval(interval);
                                    reject(new Error(`Element "${selector}" not found after ${timeout}ms`));
                                }
                                elapsed += intervalTime;
                            }, intervalTime);
                        });
                    }


                    /*******************************************************
                    name of function: waitForAnyElement
                    description: waits for any element on the page to load
                    *******************************************************/
                    function waitForAnyElement(selector, timeout = 5000) {
                        return new Promise((resolve, reject) => {
                            const intervalTime = 100;
                            let elapsed = 0;
                            const interval = setInterval(() => {
                                const elements = document.querySelectorAll(selector);
                                if (elements.length > 0) {
                                    clearInterval(interval);
                                    resolve(elements);
                                } else if (elapsed >= timeout) {
                                    clearInterval(interval);
                                    reject(new Error(`No elements matching "${selector}" found after ${timeout}ms`));
                                }
                                elapsed += intervalTime;
                            }, intervalTime);
                        });
                    }


                    /*******************************************************
                    name of function: waitForDivWithStyleSubstring
                    description: waits for server tab to show up, if this doesent
                    happen then it just spits out an error
                    *******************************************************/
                    function waitForDivWithStyleSubstring(substring, timeout = 5000) {
                        return new Promise((resolve, reject) => {
                            const intervalTime = 100;
                            let elapsed = 0;
                            const interval = setInterval(() => {
                                const divs = Array.from(document.querySelectorAll("div[style]"));
                                const found = divs.find(div => div.style && div.style.background && div.style.background.includes(substring));
                                if (found) {
                                    clearInterval(interval);
                                    resolve(found);
                                } else if (elapsed >= timeout) {
                                    clearInterval(interval);
                                    reject(new Error(`No div with style containing "${substring}" found after ${timeout}ms`));
                                }
                                elapsed += intervalTime;
                            }, intervalTime);
                        });
                    }

                    /*******************************************************
                    name of function: clickServersTab
                    description: clicks server tab on game page
                    *******************************************************/
                    async function clickServersTab() {
                        try {
                            const serversTab = await waitForElement("#tab-game-instances a");
                            serversTab.click();
                            ConsoleLogEnabled("[Auto] Servers tab clicked.");
                            return true;
                        } catch (err) {
                            ConsoleLogEnabled("[Auto] Servers tab not found:", err.message);
                            return false;
                        }
                    }

                    /*******************************************************
                    name of function: waitForServerListContainer
                    description: Waits for server list container to load onto the page
                    *******************************************************/
                    async function waitForServerListContainer() {
                        try {
                            const container = await waitForElement("#rbx-public-running-games");
                            ConsoleLogEnabled("[Auto] Server list container (#rbx-public-running-games) detected.");
                            return container;
                        } catch (err) {
                            ConsoleLogEnabled("[Auto] Server list container not found:", err.message);
                            return null;
                        }
                    }

                    /*******************************************************
                    name of function: waitForServerItems
                    description: Detects the server item for the functions to start
                    *******************************************************/
                    async function waitForServerItems() {
                        try {
                            const items = await waitForAnyElement(".rbx-public-game-server-item");
                            ConsoleLogEnabled(`[Auto] Detected ${items.length} server item(s) (.rbx-public-game-server-item)`);
                            return items;
                        } catch (err) {
                            ConsoleLogEnabled("[Auto] Server items not found:", err.message);
                            return null;
                        }
                    }

                    /*******************************************************
                    name of function: runServerRegions
                    description: Runs auto server regions
                    *******************************************************/

                    async function runServerRegions() {
                        // store the original state at the beginning using getItem/setItem
                        // i did some magic here now i don't know why this disabled notificatioons
                        const originalNotifFlag = window.localStorage.getItem('ROLOCATE_enablenotifications');

                        ConsoleLogEnabled("[DEBUG] Original state:", originalNotifFlag);

                        if (originalNotifFlag === "true") {
                            window.localStorage.setItem('ROLOCATE_enablenotifications', 'false');
                            ConsoleLogEnabled("[Auto] Notifications disabled.");
                        } else {
                            ConsoleLogEnabled("[Auto] Notifications already disabled; leaving flag untouched.");
                        }

                        const gameId = /^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(window.location.href) ? (window.location.href.match(/\/games\/(\d+)/) || [])[1] || null : null;
                        if (!gameId) {
                            ConsoleLogEnabled("[Auto] Game ID not found, aborting runServerRegions.");
                            // restore original state before early return
                            if (originalNotifFlag !== null) {
                                window.localStorage.setItem('ROLOCATE_enablenotifications', originalNotifFlag);
                            }
                            ConsoleLogEnabled("[DEBUG] Restored to:", window.localStorage.getItem('ROLOCATE_enablenotifications'));
                            ConsoleLogEnabled("[Auto] Notifications restored to original state (early abort).");
                            return;
                        }

                        if (typeof Loadingbar === "function") Loadingbar(true);
                        if (typeof disableFilterButton === "function") disableFilterButton(true);
                        if (typeof disableLoadMoreButton === "function") disableLoadMoreButton();
                        if (typeof rebuildServerList === "function") {
                            const serverCount = parseInt(window.localStorage.getItem('ROLOCATE_AutoRunServerRegionsnumber')) || 16; // fallback to 16
                            rebuildServerList(gameId, serverCount); // search 100 servers
                            ConsoleLogEnabled(`[Auto] Server list rebuilt for game ID: ${gameId}`);
                        } else {
                            ConsoleLogEnabled("[Auto] rebuildServerList function not found.");
                        }

                        if (originalNotifFlag === "true") {
                            try {
                                await waitForDivWithStyleSubstring(
                                    "radial-gradient(circle, rgba(255, 40, 40, 0.4)",
                                    5000
                                );
                                // restore original state
                                window.localStorage.setItem('ROLOCATE_enablenotifications', originalNotifFlag);
                                ConsoleLogEnabled("[DEBUG] Restored to:", window.localStorage.getItem('ROLOCATE_enablenotifications'));
                                ConsoleLogEnabled("[Auto] Notifications restored to original state (style div detected).");
                            } catch (err) {
                                ConsoleLogEnabled("[Auto] Style div not detected in time:", err.message);
                                // restore original state even if there's an error
                                window.localStorage.setItem('ROLOCATE_enablenotifications', originalNotifFlag);
                                ConsoleLogEnabled("[DEBUG] Restored to:", window.localStorage.getItem('ROLOCATE_enablenotifications'));
                                ConsoleLogEnabled("[Auto] Notifications restored to original state (error occurred).");
                            }
                        }

                        // final restoration to ensure it's always restored
                        if (originalNotifFlag !== null) {
                            window.localStorage.setItem('ROLOCATE_enablenotifications', originalNotifFlag);
                        }
                        ConsoleLogEnabled("[DEBUG] Final restore to:", window.localStorage.getItem('ROLOCATE_enablenotifications'));
                        ConsoleLogEnabled("[Auto] Function completed - notifications restored to original state.");
                    }

                    window.addEventListener("load", async () => {
                        const clicked = await clickServersTab();
                        if (!clicked) return;

                        const container = await waitForServerListContainer();
                        if (!container) return;

                        const items = await waitForServerItems();
                        if (!items) return;

                        await runServerRegions();
                    });
                })();
            } else {
                ConsoleLogEnabled("[Auto] ROLOCATE_AutoRunServerRegions is not true. Script skipped.");
            }

            /*******************************************************
            name of function: An observer
            description: Not a function, but an observer which adds the
            filter button, server hop button, recent servers, and disables
            trailer autoplay if settings are true
            *******************************************************/
            const observer = new MutationObserver((mutations, obs) => {
                const serverListOptions = document.querySelector('.server-list-options');
                const playButton = document.querySelector('.btn-common-play-game-lg.btn-primary-md');
                if (serverListOptions && !document.querySelector('.RL-filter-button') && localStorage.getItem("ROLOCATE_togglefilterserversbutton") === "true") {

                    ConsoleLogEnabled("Added Filter Button");
                    const filterButton = document.createElement('a'); // yes lmao
                    filterButton.className = 'RL-filter-button';
                    filterButton.style.cssText = `
                color: white;
                font-weight: bold;
                text-decoration: none;
                cursor: pointer;
                margin-left: 10px;
                padding: 5px 10px;
                display: flex;
                align-items: center;
                gap: 5px;
                position: relative;
                margin-top: 4px;
            `;

                    filterButton.addEventListener('mouseover', () => {
                        filterButton.style.textDecoration = 'underline';
                    });
                    filterButton.addEventListener('mouseout', () => {
                        filterButton.style.textDecoration = 'none';
                    });

                    const buttonText = document.createElement('span');
                    buttonText.className = 'RL-filter-text';
                    buttonText.textContent = 'Filters';
                    filterButton.appendChild(buttonText);

                    const icon = document.createElement('span');
                    icon.className = 'RL-filter-icon';
                    icon.textContent = '≡';
                    icon.style.cssText = `font-size: 18px;`;
                    filterButton.appendChild(icon);

                    serverListOptions.appendChild(filterButton);

                    let popup = null;
                    filterButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        if (popup) {
                            popup.remove();
                            popup = null;
                        } else {
                            popup = createPopup();
                            popup.style.top = `${filterButton.offsetHeight}px`;
                            popup.style.left = '0';
                            filterButton.appendChild(popup);
                        }
                    });

                    document.addEventListener('click', (event) => {
                        if (popup && !filterButton.contains(event.target)) {
                            popup.remove();
                            popup = null;
                        }
                    });
                }
                // new condition to trigger recent server logic
                if (localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true") {
                    HandleRecentServers();
                    HandleRecentServersURL();
                }
                // new condition to trigger disable trailer logic
                if (localStorage.getItem("ROLOCATE_disabletrailer") === "true") {
                    disableYouTubeAutoplayInIframes();
                }

                // new condition to trigger compact private server logic
                if (localStorage.getItem("ROLOCATE_compactprivateservers") === "true") {
                    cleanupPrivateServerCards();
                }

                if (playButton && !document.querySelector('.custom-play-button') && localStorage.getItem("ROLOCATE_toggleserverhopbutton") === "true") {
                    ConsoleLogEnabled("Added Server Hop Button");
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                align-items: center;
                width: 100%;
            `;

                    playButton.style.cssText += `
                flex: 3;
                padding: 10px 12px;
                text-align: center;
            `;

                    const serverHopButton = document.createElement('button');
                    serverHopButton.className = 'custom-play-button';
                    serverHopButton.style.cssText = `
                background-color: #335fff;
                color: white;
                border: none;
                padding: 7.5px 12px;
                cursor: pointer;
                font-weight: bold;
                border-radius: 8px;
                flex: 1;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            `;

                    const tooltip = document.createElement('div');
                    tooltip.textContent = 'Join Random Server / Server Hop';
                    tooltip.style.cssText = `
                        position: absolute;
                        background: rgba(51, 95, 255, 0.9);
                        color: white;
                        padding: 6px 10px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: 500;
                        letter-spacing: 0.025em;
                        visibility: hidden;
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        bottom: calc(100% + 8px);
                        left: 50%;
                        transform: translateX(-50%) translateY(4px);
                        white-space: nowrap;
                        box-shadow:
                            0 20px 25px -5px rgba(0, 0, 0, 0.1),
                            0 10px 10px -5px rgba(0, 0, 0, 0.04),
                            0 0 0 1px rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(148, 163, 184, 0.1);
                        z-index: 1000;

                        /* Arrow */
                        &::after {
                            content: '';
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 0;
                            height: 0;
                            border-left: 5px solid transparent;
                            border-right: 5px solid transparent;
                            border-top: 5px solid rgba(51, 95, 255, 0.9);
                            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
                        }
                    `;
                    serverHopButton.appendChild(tooltip);

                    serverHopButton.addEventListener('mouseover', () => {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = '1';
                    });

                    serverHopButton.addEventListener('mouseout', () => {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    });

                    const logo = document.createElement('img');
                    logo.src = window.Base64Images.icon_serverhop;
                    logo.style.cssText = `
                width: 45px;
                height: 45px;
            `;
                    serverHopButton.appendChild(logo);

                    playButton.parentNode.insertBefore(buttonContainer, playButton);
                    buttonContainer.appendChild(playButton);
                    buttonContainer.appendChild(serverHopButton);

                    serverHopButton.addEventListener('click', () => {
                        ServerHop();
                    });
                }

                const filterEnabled = localStorage.getItem("ROLOCATE_togglefilterserversbutton") === "true";
                const hopEnabled = localStorage.getItem("ROLOCATE_toggleserverhopbutton") === "true";
                const recentEnabled = localStorage.getItem("ROLOCATE_togglerecentserverbutton") === "true";

                const filterPresent = !filterEnabled || document.querySelector('.RL-filter-button');
                const hopPresent = !hopEnabled || document.querySelector('.custom-play-button');
                const recentPresent = !recentEnabled || document.querySelector('.recent-servers-section');

                if (filterPresent && hopPresent && recentPresent) {
                    obs.disconnect();
                    ConsoleLogEnabled("Disconnected Observer");
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }




        /*********************************************************************************************************************************************************************************************************************************************
                                                                 The End of: This is all of the functions for the filter button and the popup for the 8 buttons does not include the functions for the 8 buttons

        *********************************************************************************************************************************************************************************************************************************************/

        // Quick join handler for smartsearch
        if (window.location.hash === '#?ROLOCATE_QUICKJOIN') {
            if (localStorage.ROLOCATE_smartsearch === 'true' || localStorage.ROLOCATE_quicklaunchgames === 'true') { // fixed this

                // get gameid from url
                const gameIdMatch = window.location.pathname.match(/\/games\/(\d+)/);

                if (gameIdMatch && gameIdMatch[1]) {
                    const gameId = gameIdMatch[1];
                    rebuildServerList(gameId, 50, false, true); // quick join mode
                } else {
                    ConsoleLogEnabled('[RoLocate] Could not extract gameId from URL');
                    notifications('Error: Failed to extract gameid. Please try again later.', 'error', '⚠️', '5000');
                }

                // clean up the URL
                history.replaceState(null, null, window.location.pathname + window.location.search);
            } else {
                ConsoleLogEnabled('[RoLocate] Quick Join detected but smartsearch is disabled');
            }
        }



        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 1st button

        *********************************************************************************************************************************************************************************************************************************************/


        /*******************************************************
        name of function: smallest_servers
        description: Fetches the smallest servers, disables the "Load More" button, shows a loading bar, and recreates the server cards.
        *******************************************************/
        async function smallest_servers() {
            // disable the "Load More" button and show the loading bar
            Loadingbar(true);
            disableFilterButton(true);
            disableLoadMoreButton();
            notifications("Finding small servers...", "success", "🧐");

            // get the game ID from the URL
            const gameId = ((p => {
                const i = p.indexOf('games');
                return i !== -1 && p.length > i + 1 ? p[i + 1] : null;
            })(window.location.pathname.split('/')));

            // retry thing
            let retries = 3;
            let success = false;

            while (retries > 0 && !success) {
                try {
                    // get server data
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://games.roblox.com/v1/games/${gameId}/servers/0?sortOrder=1&excludeFullGames=true&limit=25`,
                            onload: function(response) {
                                if (response.status === 429) {
                                    reject(new Error('429: Too Many Requests'));
                                } else if (response.status >= 200 && response.status < 300) {
                                    resolve(response);
                                } else {
                                    reject(new Error(`HTTP error! status: ${response.status}`));
                                }
                            },
                            onerror: function(error) {
                                reject(error);
                            }
                        });
                    });

                    const data = JSON.parse(response.responseText);

                    // find info on each server
                    for (const server of data.data) {
                        const {
                            id: serverId,
                            playerTokens,
                            maxPlayers,
                            playing
                        } = server;

                        // give to rbx_card function
                        await rbx_card(serverId, playerTokens, maxPlayers, playing, gameId);
                    }

                    success = true; // mark as successful if no errors occurred
                } catch (error) {
                    retries--; // remove 1

                    if (error.message === '429: Too Many Requests' && retries > 0) {
                        ConsoleLogEnabled('Encountered a 429 error. Retrying in 5 seconds...');
                        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
                    } else {
                        ConsoleLogEnabled('Error fetching server data:', error);
                        notifications('Error: Failed to fetch server data. Please try again later.', 'error', '⚠️', '5000');
                        Loadingbar(false);
                        break; // exit the loop if it's not a 429 error or no retries left
                    }
                } finally {
                    if (success || retries === 0) {
                        // hide the loading bar and enable the filter button
                        Loadingbar(false);
                        disableFilterButton(false);
                    }
                }
            }
        }



        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 2nd button

        *********************************************************************************************************************************************************************************************************************************************/


        /*******************************************************
        name of function: available_space_servers
        description: Fetches servers with available space, disables the "Load More" button, shows a loading bar, and recreates the server cards.
        *******************************************************/
        async function available_space_servers() {
            // disable the "Load More" button and show the loading bar
            Loadingbar(true);
            disableLoadMoreButton();
            disableFilterButton(true);
            notifications("Finding servers with space...", "success", "🧐");

            // get the game ID from the URL
            const gameId = ((p => {
                const i = p.indexOf('games');
                return i !== -1 && p.length > i + 1 ? p[i + 1] : null;
            })(window.location.pathname.split('/')));

            // retry thing
            let retries = 3;
            let success = false;

            while (retries > 0 && !success) {
                try {
                    // get server data
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://games.roblox.com/v1/games/${gameId}/servers/0?sortOrder=2&excludeFullGames=true&limit=25`,
                            onload: function(response) {
                                if (response.status === 429) {
                                    reject(new Error('429: Too Many Requests'));
                                } else if (response.status >= 200 && response.status < 300) {
                                    resolve(response);
                                } else {
                                    reject(new Error(`HTTP error! status: ${response.status}`));
                                }
                            },
                            onerror: function(error) {
                                reject(error);
                            }
                        });
                    });

                    const data = JSON.parse(response.responseText);

                    // get server info
                    for (const server of data.data) {
                        const {
                            id: serverId,
                            playerTokens,
                            maxPlayers,
                            playing
                        } = server;

                        // give to function for card creation
                        await rbx_card(serverId, playerTokens, maxPlayers, playing, gameId);
                    }

                    success = true; // mark successful if no errors
                } catch (error) {
                    retries--; // remove 1

                    if (error.message === '429: Too Many Requests' && retries > 0) {
                        ConsoleLogEnabled('Encountered a 429 error. Retrying in 10 seconds...');
                        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
                    } else {
                        ConsoleLogEnabled('Error fetching server data:', error);
                        break; // exit the loop if it's not a 429 error or no retries left
                    }
                } finally {
                    if (success || retries === 0) {
                        // hide the loading bar and enable the filter button
                        Loadingbar(false);
                        disableFilterButton(false);
                    }
                }
            }
        }

        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 3rd button

        *********************************************************************************************************************************************************************************************************************************************/


        /*******************************************************
        	name of function: player_count_tab
        	description: Opens a popup for the user to select the max player count using a slider and filters servers accordingly. Maybe one of my best functions lowkey.
        *******************************************************/
        function player_count_tab() {
            // check if the max player count has already been determined
            if (!player_count_tab.maxPlayers) {
                // try to find the element containing the player count information
                const playerCountElement = document.querySelector('.text-info.rbx-game-status.rbx-game-server-status.text-overflow');
                if (playerCountElement) {
                    const playerCountText = playerCountElement.textContent.trim();
                    const match = playerCountText.match(/(\d+) of (\d+) people max/);
                    if (match) {
                        const maxPlayers = parseInt(match[2], 10);
                        if (!isNaN(maxPlayers) && maxPlayers > 1) {
                            player_count_tab.maxPlayers = maxPlayers;
                            ConsoleLogEnabled("Found text element with max playercount");
                        }
                    }
                } else {
                    // if the element is not found, extract the gameId from the URL
                    const gameIdMatch = window.location.href.match(/\/(?:[a-z]{2}\/)?games\/(\d+)/);
                    if (gameIdMatch && gameIdMatch[1]) {
                        const gameId = gameIdMatch[1];
                        // send a request to the Roblox API to get server information
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://games.roblox.com/v1/games/${gameId}/servers/public?sortOrder=1&excludeFullGames=true&limit=100`,
                            onload: function(response) {
                                try {
                                    if (response.status === 429) {
                                        // Rate limit error, default to 100
                                        ConsoleLogEnabled("Rate limited defaulting to 100.");
                                        player_count_tab.maxPlayers = 100;
                                    } else {
                                        ConsoleLogEnabled("Valid api response");
                                        const data = JSON.parse(response.responseText);
                                        if (data.data && data.data.length > 0) {
                                            const maxPlayers = data.data[0].maxPlayers;
                                            if (!isNaN(maxPlayers) && maxPlayers > 1) {
                                                player_count_tab.maxPlayers = maxPlayers;
                                            }
                                        }
                                    }
                                    // update the slider range if the popup is already created
                                    const slider = document.querySelector('.player-count-popup input[type="range"]');
                                    if (slider) {
                                        slider.max = player_count_tab.maxPlayers ? (player_count_tab.maxPlayers - 1).toString() : '100';
                                        slider.style.background = `
                        linear-gradient(
                            to right,
                            #00A2FF 0%,
                            #00A2FF ${slider.value}%,
                            #444 ${slider.value}%,
                            #444 100%
                        );
                    `;
                                    }
                                } catch (error) {
                                    ConsoleLogEnabled('Failed to parse API response:', error);
                                    // default to 100 if parsing fails
                                    player_count_tab.maxPlayers = 100;
                                    const slider = document.querySelector('.player-count-popup input[type="range"]');
                                    if (slider) {
                                        slider.max = '100';
                                        slider.style.background = `
                        linear-gradient(
                            to right,
                            #00A2FF 0%,
                            #00A2FF ${slider.value}%,
                            #444 ${slider.value}%,
                            #444 100%
                        );
                    `;
                                    }
                                }
                            },
                            onerror: function(error) {
                                ConsoleLogEnabled('Failed to fetch server information:', error);
                                ConsoleLogEnabled('Fallback to 100 players.');
                                // default to 100 if the request fails
                                player_count_tab.maxPlayers = 100;
                                const slider = document.querySelector('.player-count-popup input[type="range"]');
                                if (slider) {
                                    slider.max = '100';
                                    slider.style.background = `
                    linear-gradient(
                        to right,
                        #00A2FF 0%,
                        #00A2FF ${slider.value}%,
                        #444 ${slider.value}%,
                        #444 100%
                    );
                `;
                                }
                            }
                        });
                    }
                }
            }
            // create the overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
            document.body.appendChild(overlay);

            // create the popup container
            const popup = document.createElement('div');
            popup.className = 'player-count-popup';
            popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgb(30, 32, 34);
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 300px;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
    `;

            // add a close button in the top-right corner (bigger size)
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;'; // using '×' for the close icon
            closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 24px; /* Increased font size */
        cursor: pointer;
        width: 36px; /* Increased size */
        height: 36px; /* Increased size */
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease, color 0.3s ease;
    `;
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                closeButton.style.color = '#ff4444';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.backgroundColor = 'transparent';
                closeButton.style.color = '#ffffff';
            });

            // add a title
            const title = document.createElement('h3');
            title.textContent = 'Select Max Player Count';
            title.style.cssText = `
        color: white;
        margin: 0;
        font-size: 18px;
        font-weight: 500;
    `;
            popup.appendChild(title);

            // add a slider with improved functionality and styling
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '1';
            slider.max = player_count_tab.maxPlayers ? (player_count_tab.maxPlayers - 1).toString() : '100';
            slider.value = '1'; // Default value
            slider.step = '1'; // Step for better accuracy
            slider.style.cssText = `
        width: 80%;
        cursor: pointer;
        margin: 10px 0;
        -webkit-appearance: none; /* Remove default styling */
        background: transparent;
    `;
            // Custom slider track
            slider.style.background = `
        linear-gradient(
            to right,
            #00A2FF 0%,
            #00A2FF ${slider.value}%,
            #444 ${slider.value}%,
            #444 100%
        );
        border-radius: 5px;
        height: 6px;
    `;
            // custom slider thumb
            slider.style.setProperty('--thumb-size', '20px'); /* Larger thumb */
            slider.style.setProperty('--thumb-color', '#00A2FF');
            slider.style.setProperty('--thumb-hover-color', '#0088cc');
            slider.style.setProperty('--thumb-border', '2px solid #fff');
            slider.style.setProperty('--thumb-shadow', '0 0 5px rgba(0, 0, 0, 0.5)');
            slider.addEventListener('input', () => {
                slider.style.background = `
            linear-gradient(
                to right,
                #00A2FF 0%,
                #00A2FF ${slider.value}%,
                #444 ${slider.value}%,
                #444 100%
            );
        `;
                sliderValue.textContent = slider.value; // update the displayed value
            });
            // keyboard support for better accuracy (fixed to increment/decrement by 1)
            slider.addEventListener('keydown', (arrowkeybutton) => {
                arrowkeybutton.preventDefault(); // orevent default behavior (which might cause jumps)
                let newValue = parseInt(slider.value, 10);
                if (arrowkeybutton.key === 'ArrowLeft' || arrowkeybutton.key === 'ArrowDown') {
                    newValue = Math.max(1, newValue - 1); // decrease by 1
                } else if (arrowkeybutton.key === 'ArrowRight' || arrowkeybutton.key === 'ArrowUp') {
                    newValue = Math.min(100, newValue + 1); // increase by 1
                }
                slider.value = newValue;
                slider.dispatchEvent(new Event('input'));
            });
            popup.appendChild(slider);

            // add a display for the slider value
            const sliderValue = document.createElement('span');
            sliderValue.textContent = slider.value;
            sliderValue.style.cssText = `
        color: white;
        font-size: 16px;
        font-weight: bold;
    `;
            popup.appendChild(sliderValue);

            // add a submit button with dark, blackish style
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Search';
            submitButton.style.cssText = `
        padding: 8px 20px;
        font-size: 16px;
        background-color: #1a1a1a; /* Dark blackish color */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    `;
            submitButton.addEventListener('mouseenter', () => {
                submitButton.style.backgroundColor = '#333';
                submitButton.style.transform = 'scale(1.05)';
            });
            submitButton.addEventListener('mouseleave', () => {
                submitButton.style.backgroundColor = '#1a1a1a';
                submitButton.style.transform = 'scale(1)';
            });

            // add yeelow stuff
            const tipBox = document.createElement('div');
            tipBox.style.cssText = `
        width: 100%;
        padding: 10px;
        background-color: rgba(255, 204, 0, 0.15);
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
        color: #ffcc00;
        transition: background-color 0.3s ease;
    `;
            tipBox.textContent = 'Tip: Click the slider and use the arrow keys for more accuracy.';
            tipBox.addEventListener('mouseenter', () => {
                tipBox.style.backgroundColor = 'rgba(255, 204, 0, 0.25)';
            });
            tipBox.addEventListener('mouseleave', () => {
                tipBox.style.backgroundColor = 'rgba(255, 204, 0, 0.15)';
            });
            popup.appendChild(tipBox);

            // append the popup to the body
            document.body.appendChild(popup);

            // fade in the overlay and popup
            setTimeout(() => {
                overlay.style.opacity = '1';
                popup.style.opacity = '1';
                popup.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);

            /*******************************************************
                name of function: fadeOutAndRemove
                description: Fades out and removes the popup and overlay.
            *******************************************************/
            function fadeOutAndRemove(popup, overlay) {
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    popup.remove();
                    overlay.remove();
                }, 300); // match the duration of the transition
            }

            // close the popup when the close button is clicked
            closeButton.addEventListener('click', () => {
                fadeOutAndRemove(popup, overlay);
            });

            // handle submit button click
            submitButton.addEventListener('click', () => {
                const maxPlayers = parseInt(slider.value, 10);
                if (!isNaN(maxPlayers) && maxPlayers > 0) {
                    filterServersByPlayerCount(maxPlayers);
                    fadeOutAndRemove(popup, overlay);
                } else {
                    notifications('Error: Please enter a number greater than 0', 'error', '⚠️', '5000');
                }
            });

            popup.appendChild(submitButton);
            popup.appendChild(closeButton);
        }


        /*******************************************************
        name of function: fetchServersWithRetry
        description: Fetches server data with retry logic and a delay between requests to avoid rate-limiting.
        Uses GM_xmlhttpRequest instead of fetch.
        *******************************************************/
        async function fetchServersWithRetry(url, retries = 15, currentDelay = 750) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        // check for 429 rate limit
                        if (response.status === 429) {
                            if (retries > 0) {
                                const newDelay = currentDelay * 1; // Exponential backoff
                                ConsoleLogEnabled(`[DEBUG] Rate limited. Waiting ${newDelay / 1000} seconds before retrying...`);
                                setTimeout(() => {
                                    resolve(fetchServersWithRetry(url, retries - 1, newDelay)); // Retry with increased delay
                                }, newDelay);
                            } else {
                                ConsoleLogEnabled('[DEBUG] Rate limit retries exhausted.');
                                notifications('Error: Rate limited please try again later.', 'error', '⚠️', '5000');
                                reject(new Error('RateLimit'));
                            }
                            return;
                        }

                        // random errors handle it
                        if (response.status < 200 || response.status >= 300) {
                            ConsoleLogEnabled('[DEBUG] HTTP error:', response.status, response.statusText);
                            reject(new Error(`HTTP error: ${response.status}`));
                            return;
                        }

                        // give json data af5ter parsing
                        try {
                            const data = JSON.parse(response.responseText);
                            ConsoleLogEnabled('[DEBUG] Fetched data successfully:', data);
                            resolve(data);
                        } catch (error) {
                            ConsoleLogEnabled('[DEBUG] Error parsing JSON:', error);
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        ConsoleLogEnabled('[DEBUG] Error in GM_xmlhttpRequest:', error);
                        reject(error);
                    }
                });
            });
        }

        /*******************************************************
        name of function: filterServersByPlayerCount
        description: Filters servers to show only those with a player count equal to or below the specified max.
        If no exact matches are found, prioritizes servers with player counts lower than the input.
        Keeps fetching until at least 8 servers are found, with a dynamic delay between requests.
        *******************************************************/
        async function filterServersByPlayerCount(maxPlayers) {
            // make sure it actually good
            if (isNaN(maxPlayers) || maxPlayers < 1 || !Number.isInteger(maxPlayers)) {
                ConsoleLogEnabled('[DEBUG] Invalid input for maxPlayers.');
                notifications('Error: Please input a valid whole number greater than or equal to 1.', 'error', '⚠️', '5000');
                return;
            }

            // disable UI elements and clear the server list
            Loadingbar(true);
            disableLoadMoreButton();
            disableFilterButton(true);
            document.querySelector('#rbx-public-game-server-item-container').innerHTML = '';

            const gameId = ((p = window.location.pathname.split('/')) => {
                const i = p.indexOf('games');
                return i !== -1 && p.length > i + 1 ? p[i + 1] : null;
            })();

            let cursor = null,
                serversFound = 0,
                serverMaxPlayers = null,
                isCloserToOne = null;
            let topDownServers = [],
                bottomUpServers = []; // servers collected during searches
            let currentDelay = 500; // initial delay of 0.5 seconds
            const timeLimit = 3 * 60 * 1000,
                startTime = Date.now(); // 3 minutes limit
            notifications('Will search for a maximum of 3 minutes to find a server.', 'success', '🔎', '5000');

            try {
                while (serversFound < 16) {
                    // check if the time limit has been exceeded
                    if (Date.now() - startTime > timeLimit) {
                        ConsoleLogEnabled('[DEBUG] Time limit reached. Proceeding to fallback servers.');
                        notifications('Warning: Time limit reached. Proceeding to fallback servers.', 'warning', '❗', '5000');
                        break;
                    }

                    // fetch initial data to determine serverMaxPlayers and isCloserToOne
                    if (!serverMaxPlayers) {
                        const initialUrl = cursor ?
                            `https://games.roblox.com/v1/games/${gameId}/servers/public?excludeFullGames=true&limit=100&cursor=${cursor}` :
                            `https://games.roblox.com/v1/games/${gameId}/servers/public?excludeFullGames=true&limit=100`;

                        const initialData = await fetchServersWithRetry(initialUrl);
                        if (initialData.data.length > 0) {
                            serverMaxPlayers = initialData.data[0].maxPlayers;
                            isCloserToOne = maxPlayers <= (serverMaxPlayers / 2);
                        } else {
                            notifications("No servers found in initial fetch.", "error", "⚠️", "5000");
                            ConsoleLogEnabled('[DEBUG] No servers found in initial fetch.', 'warning', '❗');
                            break;
                        }
                    }

                    // vaklidate maxplayers
                    if (maxPlayers >= serverMaxPlayers) {
                        ConsoleLogEnabled('[DEBUG] Invalid input: maxPlayers is greater than or equal to serverMaxPlayers.');
                        notifications(`Error: Please input a number between 1 through ${serverMaxPlayers - 1}`, 'error', '⚠️', '5000');
                        return;
                    }

                    // adjust the URL based on isCloserToOne
                    const baseUrl = isCloserToOne ?
                        `https://games.roblox.com/v1/games/${gameId}/servers/public?sortOrder=1&excludeFullGames=true&limit=100` :
                        `https://games.roblox.com/v1/games/${gameId}/servers/public?excludeFullGames=true&limit=100`;

                    const url = cursor ? `${baseUrl}&cursor=${cursor}` : baseUrl;
                    const data = await fetchServersWithRetry(url);

                    // servber lsit good?
                    if (!Array.isArray(data.data)) {
                        ConsoleLogEnabled('[DEBUG] Invalid server list received. Waiting 1 second before retrying...');
                        await delay(1000);
                        continue;
                    }

                    // filter sevrers
                    for (const server of data.data) {
                        if (server.playing === maxPlayers) {
                            await rbx_card(server.id, server.playerTokens, server.maxPlayers, server.playing, gameId);
                            serversFound++;
                            if (serversFound >= 16) break;
                        } else if (!isCloserToOne && server.playing > maxPlayers) {
                            topDownServers.push(server);
                        } else if (isCloserToOne && server.playing < maxPlayers) {
                            bottomUpServers.push(server);
                        }
                    }

                    if (!data.nextPageCursor) break;
                    cursor = data.nextPageCursor;

                    // dynamicaic delay
                    if (currentDelay > 150) {
                        currentDelay = Math.max(150, currentDelay / 2);
                    }
                    ConsoleLogEnabled(`[DEBUG] Waiting ${currentDelay / 1000} seconds before next request...`);
                    await delay(currentDelay);
                }

                // if no exact matches were found or time limit reached, use fallback servers
                if (serversFound === 0 && (topDownServers.length > 0 || bottomUpServers.length > 0)) {
                    notifications(`There are no servers with ${maxPlayers} players. Showing servers closest to ${maxPlayers} players.`, 'warning', '😔', '8000');

                    topDownServers.sort((a, b) => a.playing - b.playing);
                    bottomUpServers.sort((a, b) => b.playing - a.playing);
                    const combinedFallback = [...topDownServers, ...bottomUpServers];

                    for (const server of combinedFallback) {
                        await rbx_card(server.id, server.playerTokens, server.maxPlayers, server.playing, gameId);
                        serversFound++;
                        if (serversFound >= 16) break;
                    }
                }

                if (serversFound <= 0) {
                    notifications('No Servers Found Within The Provided Criteria', 'info', '🔎', '5000');
                }
            } catch (error) {
                ConsoleLogEnabled('[DEBUG] Error in filterServersByPlayerCount:', error);
            } finally {
                Loadingbar(false);
                disableFilterButton(false);
            }
        }

        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 4th button

        *********************************************************************************************************************************************************************************************************************************************/

        /*******************************************************
        name of function: random_servers
        description: Fetches servers from two different URLs, combines the results, ensures no duplicates, shuffles the list, and passes the server information to the rbx_card function in a random order. Handles 429 errors with retries.
        *******************************************************/
        async function random_servers() {
            notifications('Finding Random Servers. Please wait 2-5 seconds', 'success', '🔎', '5000');
            // disable the "Load More" button and show the loading bar
            Loadingbar(true);
            disableFilterButton(true);
            disableLoadMoreButton();

            // get the game ID from the URL ik reduent function
            const gameId = ((p = window.location.pathname.split('/')) => {
                const i = p.indexOf('games');
                return i !== -1 && p.length > i + 1 ? p[i + 1] : null;
            })();

            try {
                // fetch servers from the first URL with retry logic
                const firstUrl = `https://games.roblox.com/v1/games/${gameId}/servers/public?excludeFullGames=true&limit=10`;
                const firstData = await fetchWithRetry(firstUrl, 10); // Retry up to 3 times

                // wait for 1.5 seconds
                await delay(1500);

                // fetch servers from the second URL with retry logic
                const secondUrl = `https://games.roblox.com/v1/games/${gameId}/servers/public?sortOrder=1&excludeFullGames=true&limit=10`;
                const secondData = await fetchWithRetry(secondUrl, 10); // Retry up to 3 times

                // combine the servers from both URLs. Yea im kinda proud of this lmao
                const combinedServers = [...firstData.data, ...secondData.data];

                // remove duplicates by server ID
                const uniqueServers = [];
                const seenServerIds = new Set();

                for (const server of combinedServers) {
                    if (!seenServerIds.has(server.id)) {
                        seenServerIds.add(server.id);
                        uniqueServers.push(server);
                    }
                }

                // shuffl;y it
                const shuffledServers = shuffleArray(uniqueServers);

                // get first 16 shuffled
                const selectedServers = shuffledServers.slice(0, 16);

                // random order
                for (const server of selectedServers) {
                    const {
                        id: serverId,
                        playerTokens,
                        maxPlayers,
                        playing
                    } = server;

                    // give it to this function
                    await rbx_card(serverId, playerTokens, maxPlayers, playing, gameId);
                }
            } catch (error) {
                ConsoleLogEnabled('Error fetching server data:', error);
                notifications('Error: Failed to fetch server data. Please try again later.', 'error', '⚠️', '5000');
            } finally {
                // hide the loading bar and enable the filter button
                Loadingbar(false);
                disableFilterButton(false);
            }
        }



        /*******************************************************
        name of function: fetchWithRetry
        description: Fetches data from a URL with retry logic for 429 errors using GM_xmlhttpRequest.
        *******************************************************/
        function fetchWithRetry(url, retries) {
            return new Promise((resolve, reject) => {
                const attemptFetch = (attempt = 0) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function(response) {
                            if (response.status === 429) {
                                if (attempt < retries) {
                                    ConsoleLogEnabled(`Rate limited. Retrying in 2.5 seconds... (Attempt ${attempt + 1}/${retries})`);
                                    setTimeout(() => attemptFetch(attempt + 1), 1500); // wait 1.5 seconds and retry
                                } else {
                                    reject(new Error('Rate limit exceeded after retries'));
                                }
                            } else if (response.status >= 200 && response.status < 300) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve(data);
                                } catch (error) {
                                    reject(new Error('Failed to parse JSON response'));
                                }
                            } else {
                                reject(new Error(`HTTP error: ${response.status}`));
                            }
                        },
                        onerror: function(error) {
                            if (attempt < retries) {
                                ConsoleLogEnabled(`Error occurred. Retrying in 10 seconds... (Attempt ${attempt + 1}/${retries})`);
                                setTimeout(() => attemptFetch(attempt + 1), 10000); // wait 10 seconds and retry
                            } else {
                                reject(error);
                            }
                        }
                    });
                };

                attemptFetch();
            });
        }

        /*******************************************************
        name of function: shuffleArray
        description: Shuffles an array using the Fisher-Yates algorithm. This ronald fisher guy was kinda smart
        *******************************************************/
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
                [array[i], array[j]] = [array[j], array[i]]; // swap elements
            }
            return array;
        }


        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 5th button. taken from my other project

        *********************************************************************************************************************************************************************************************************************************************/

        /*******************************************************
        name of function: Isongamespage
        description: not a function but if on game page inject styles
        *******************************************************/
        if (Isongamespage) {
            // global styles for serverfilters to use
            const style = document.createElement('style');
            style.textContent = `
/* Overlay for the modal background */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85); /* Solid black overlay */
    z-index: 1000; /* Ensure overlay is below the popup */
    opacity: 0; /* Start invisible */
    animation: fadeIn 0.3s ease forwards; /* Fade-in animation */
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Popup Container for the server region */
.filter-popup {
    background-color: #1e1e1e; /* Darker background */
    color: #ffffff; /* White text */
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
    width: 320px;
    max-width: 90%;
    position: fixed; /* Fixed positioning */
    top: 50%; /* Center vertically */
    left: 50%; /* Center horizontally */
    transform: translate(-50%, -50%); /* Offset to truly center */
    text-align: center;
    z-index: 1001; /* Ensure popup is above the overlay */
    border: 1px solid #444; /* Subtle border */
    opacity: 0; /* Start invisible */
    animation: fadeInPopup 0.3s ease 0.1s forwards; /* Fade-in animation with delay */
}

@keyframes fadeInPopup {
    from {
        opacity: 0;
        transform: translate(-50%, -55%); /* Slight upward offset */
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%); /* Center position */
    }
}

/* Fade-out animation for overlay and popup */
.overlay.fade-out {
    animation: fadeOut 0.3s ease forwards;
}

.filter-popup.fade-out {
    animation: fadeOutPopup 0.3s ease forwards;
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

@keyframes fadeOutPopup {
    from {
        opacity: 1;
        transform: translate(-50%, -50%); /* Center position */
    }
    to {
        opacity: 0;
        transform: translate(-50%, -55%); /* Slight upward offset */
    }
}

/* Label */
.filter-popup label {
    display: block;
    margin-bottom: 12px;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500; /* Slightly bolder text */
}

/* Dropdown */
.filter-popup select {
    background-color: #333; /* Darker gray background */
    color: #ffffff; /* White text */
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #555; /* Darker border */
    width: 100%;
    margin-bottom: 12px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.filter-popup select:focus {
    border-color: #888; /* Lighter border on focus */
    outline: none;
}

/* Custom Input */
.filter-popup input[type="number"] {
    background-color: #333; /* Darker gray background */
    color: #ffffff; /* White text */
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #555; /* Darker border */
    width: 100%;
    margin-bottom: 12px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.filter-popup input[type="number"]:focus {
    border-color: #888; /* Lighter border on focus */
    outline: none;
}

/* Confirm Button */
#confirmServerCount {
    background-color: #444; /* Dark gray background */
    color: #ffffff; /* White text */
    padding: 10px 20px;
    border: 1px solid #666; /* Gray border */
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

#confirmServerCount:hover {
    background-color: #555; /* Lighter gray on hover */
    transform: translateY(-1px); /* Slight lift effect */
}

#confirmServerCount:active {
    transform: translateY(0); /* Reset lift effect on click */
}

/* Highlighted server item */
.rbx-game-server-item.highlighted {
    border: 2px solid #4caf50; /* Green border */
    border-radius: 8px;
    background-color: rgba(76, 175, 80, 0.1); /* Subtle green background */
}

/* Disabled fetch button */
.fetch-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Popup Header for server coutnodwn */
.popup-header {
    margin-bottom: 24px;
    text-align: left;
    padding: 16px;
    background-color: rgba(255, 255, 255, 0.05); /* Subtle background for contrast */
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.popup-header:hover {
    background-color: rgba(255, 255, 255, 0.08); /* Slightly brighter on hover */
    border-color: rgba(255, 255, 255, 0.2);
}

.popup-header h3 {
    margin: 0 0 12px 0;
    font-size: 22px;
    color: #ffffff;
    font-weight: 700; /* Bolder for emphasis */
    letter-spacing: -0.5px; /* Tighter letter spacing for modern look */
}

.popup-header p {
    margin: 0;
    font-size: 14px;
    color: #cccccc;
    line-height: 1.6; /* Improved line height for readability */
    opacity: 0.9; /* Slightly transparent for a softer look */
}

/* Popup Footer */
.popup-footer {
    margin-top: 20px;
    text-align: left;
    font-size: 14px;
    color: #ffcc00; /* Yellow color for warnings */
    background-color: rgba(255, 204, 0, 0.15); /* Lighter yellow background */
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 204, 0, 0.15); /* Subtle border */
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.popup-footer:hover {
    background-color: rgba(255, 204, 0, 0.25); /* Slightly brighter on hover */
    border-color: rgba(255, 204, 0, 0.25);
}

.popup-footer p {
    margin: 0;
    line-height: 1.5;
    font-weight: 500; /* Slightly bolder for emphasis */
}

/* Label */
.filter-popup label {
    display: block;
    margin-bottom: 12px;
    font-size: 15px;
    color: #ffffff;
    font-weight: 500;
    text-align: left;
    opacity: 0.9; /* Slightly transparent for a softer look */
    transition: opacity 0.3s ease;
}

.filter-popup label:hover {
    opacity: 1; /* Fully opaque on hover */
}

select:hover, select:focus {
    border-color: #ffffff;
    outline: none;
}


    `;
            // add element to the document head
            document.head.appendChild(style);
        }




        /*******************************************************
        name of function: showMessage
        description: Shows the good looking messages on the bottom of server region search
        *******************************************************/
        function showMessage(message) {
            const loadMoreButtonContainer = document.querySelector('.rbx-public-running-games-footer');

            if (!loadMoreButtonContainer) {
                ConsoleLogEnabled("Error: 'Load More' button container not found! Ensure the element exists in the DOM.");
                return;
            }

            const existingMessage = loadMoreButtonContainer.querySelector('.premium-message-container');

            // If message is "END", remove any existing message and exit
            if (message === "END") {
                if (existingMessage) {
                    existingMessage.remove();
                    ConsoleLogEnabled("Message container removed.");
                } else {
                    ConsoleLogEnabled("No message container found to remove.");
                }
                return;
            }

            // Remove existing message if present before showing a new one
            if (existingMessage) {
                existingMessage.remove();
                ConsoleLogEnabled("Warning: An existing message was found and replaced.");
            }

            // Inject CSS only once
            if (!document.getElementById('premium-message-styles')) {
                const style = document.createElement('style');
                style.id = 'premium-message-styles';
                style.textContent = `
            .premium-message-container {
                margin-top: 20px;
                padding: 18px 26px;
                background: linear-gradient(145deg, #2b0000, #1a0000);
                border-radius: 14px;
                box-shadow: 0 6px 20px rgba(255, 0, 0, 0.2);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                color: #ffdddd;
                transition: all 0.3s ease-in-out, transform 0.3s ease, box-shadow 0.3s ease;
                opacity: 0;
                animation: fadeIn 0.6s ease forwards;
                border: 1px solid #440000;
                display: flex;
                align-items: center;
                gap: 16px;
                cursor: default;
                user-select: none;
            }

            .premium-message-container:hover {
                transform: scale(1.015);
                box-shadow: 0 8px 24px rgba(255, 0, 0, 0.25);
                background: linear-gradient(145deg, #330000, #220000);
                color: #ffe5e5;
            }

            .premium-message-logo {
                width: 28px;
                height: 28px;
                border-radius: 6px;
                object-fit: contain;
                box-shadow: 0 0 8px rgba(255, 0, 0, 0.2);
                background-color: #000;
            }

            .premium-message-text {
                flex: 1;
                text-align: left;
                font-weight: 500;
                letter-spacing: 0.3px;
            }

            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
                document.head.appendChild(style);
            }

            // Create the message container
            const container = document.createElement('div');
            container.className = 'premium-message-container';

            // Create and insert the logo
            const logo = document.createElement('img');
            logo.className = 'premium-message-logo';
            logo.src = window.Base64Images.logo;

            // Create and insert the message text
            const messageText = document.createElement('div');
            messageText.className = 'premium-message-text';
            messageText.textContent = message;

            // Build the full component
            container.appendChild(logo);
            container.appendChild(messageText);
            loadMoreButtonContainer.appendChild(container);

            ConsoleLogEnabled("Message displayed successfully:", message);
            return container;
        }



        /*******************************************************
        name of function: fetchServerDetails
        description: Function to fetch server details so game id and job id. yea!
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        async function fetchServerDetails(gameId, jobId) { //here!
            const useBatching = localStorage.ROLOCATE_fastservers === "true";

            if (!useBatching) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://gamejoin.roblox.com/v1/join-game-instance",
                        headers: {
                            "Content-Type": "application/json",
                            "User-Agent": "Roblox/WinInet",
                        },
                        data: JSON.stringify({
                            placeId: gameId,
                            gameId: jobId
                        }),
                        onload: function(response) {
                            const json = JSON.parse(response.responseText);
                            ConsoleLogEnabled("API Response:", json);

                            if (json.status === 12 && json.message === 'You need to purchase access to this game before you can play.') {
                                reject('purchase_required');
                                return;
                            }

                            if (json.status === 12 && json.message === 'Cannot join this non-root place due to join restrictions') {
                                reject('subplace_join_restriction');
                                return;
                            }

                            if (json.status === 23 && json.message.includes('You have been banned from this experience by its creators.')) {
                                reject('banned_by_creator');
                                return;
                            }

                            const address = json?.joinScript?.UdmuxEndpoints?.[0]?.Address ?? json?.joinScript?.MachineAddress;
                            if (!address) {
                                ConsoleLogEnabled("API Response (Unknown Location) Which means Full Server!:", json);
                                reject(`Unable to fetch server location: Status ${json.status}`);
                                return;
                            }

                            function findBestMatchingIp(address) { // we are not using O[1] searches here but it should be fine cause its fast enough
                                // function to get all IP keys (excluding the _locations key)
                                function getIpKeys() {
                                    return Object.keys(serverRegionsByIp).filter(key => key !== '_locations');
                                }

                                // Special case: If IP starts with 128.116.*, replace last octet with 0
                                if (/^128\.116\.\d+\.\d+$/.test(address)) {
                                    ConsoleLogEnabled("using 128.116 rule");
                                    return address.replace(/^(128\.116\.\d+)\.\d+$/, "$1.0");
                                }

                                // Priority 1: Match first 3 octets
                                const threeOctets = address.match(/^(\d+\.\d+\.\d+)\./)?.[1];
                                if (threeOctets) {
                                    const match = getIpKeys().find(ip => ip.startsWith(threeOctets + "."));
                                    if (match) {
                                        ConsoleLogEnabled("using three octet rule");
                                        return match;
                                    }
                                }

                                // Priority 2: Match first 2 octets
                                const twoOctets = address.match(/^(\d+\.\d+)\./)?.[1];
                                if (twoOctets) {
                                    const match = getIpKeys().find(ip => ip.startsWith(twoOctets + "."));
                                    if (match) {
                                        ConsoleLogEnabled("using two octet rule (fallback)");
                                        return match;
                                    }
                                }

                                // Priority 3: Fallback to original
                                ConsoleLogEnabled("no match found, returning original");
                                return address;
                            }

                            // function to get location data for an IP
                            function getLocationData(ip) {
                                const locationId = serverRegionsByIp[ip];
                                if (locationId && serverRegionsByIp._locations && serverRegionsByIp._locations[locationId]) {
                                    return serverRegionsByIp._locations[locationId];
                                }
                                return null;
                            }

                            const lookupIp = findBestMatchingIp(address);
                            const location = getLocationData(lookupIp);
                            if (!location) {
                                ConsoleLogEnabled("API Response (Unknown Location):", json);
                                reject(`Unknown server address ${address}`);
                                return;
                            }

                            location.placeVersion = json.joinScript.PlaceVersion; // not wrapping this in an object cause it breaks stuff. so this should do
                            resolve(location);
                        },
                        onerror: function(error) {
                            ConsoleLogEnabled("API Request Failed:", error);
                            reject(`Failed to fetch server details: ${error}`);
                        },
                    });
                });
            }

            // Batching logic with rate limit handling
            const queue = fetchServerDetails._queue || [];
            const concurrencyLimit = 100; // this can be any value from 1 to 2000 (integer)

            if (!fetchServerDetails._queue) {
                fetchServerDetails._queue = queue;
                fetchServerDetails._activeCount = 0;
                fetchServerDetails._rateLimited = false;
            }

            return new Promise((resolve, reject) => {
                const makeRequest = async (gameId, jobId) => {
                    return new Promise((innerResolve, innerReject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://gamejoin.roblox.com/v1/join-game-instance",
                            headers: {
                                "Content-Type": "application/json",
                                "User-Agent": "Roblox/WinInet",
                            },
                            data: JSON.stringify({
                                placeId: gameId,
                                gameId: jobId
                            }),
                            onload: function(response) {
                                const json = JSON.parse(response.responseText);
                                ConsoleLogEnabled("API Response:", json);

                                // Check if we got rate limited (status undefined)
                                if (json.status === undefined) {
                                    ConsoleLogEnabled("Rate limited detected - status undefined");
                                    innerReject('rate_limited');
                                    return;
                                }

                                if (json.status === 12 && json.message === 'You need to purchase access to this game before you can play.') {
                                    innerReject('purchase_required');
                                    return;
                                }

                                if (json.status === 12 && json.message === 'Cannot join this non-root place due to join restrictions') {
                                    innerReject('subplace_join_restriction');
                                    return;
                                }

                                if (json.status === 23 && json.message.includes('You have been banned from this experience by its creators.')) {
                                    reject('banned_by_creator');
                                    return;
                                }

                                const address = json?.joinScript?.UdmuxEndpoints?.[0]?.Address ?? json?.joinScript?.MachineAddress;
                                if (!address) {
                                    ConsoleLogEnabled("API Response (Unknown Location) Which means Full Server!:", json);
                                    innerReject(`Unable to fetch server location: Status ${json.status}`);
                                    return;
                                }

                                function findBestMatchingIp(address) { // we are not using O[1] searches here but it should be fine cause its fast enough
                                    // function to get all IP keys (excluding the _locations key)
                                    function getIpKeys() {
                                        return Object.keys(serverRegionsByIp).filter(key => key !== '_locations');
                                    }

                                    // Special case: If IP starts with 128.116.*, replace last octet with 0
                                    if (/^128\.116\.\d+\.\d+$/.test(address)) {
                                        ConsoleLogEnabled("using 128.116 rule");
                                        return address.replace(/^(128\.116\.\d+)\.\d+$/, "$1.0");
                                    }

                                    // Priority 1: Match first 3 octets
                                    const threeOctets = address.match(/^(\d+\.\d+\.\d+)\./)?.[1];
                                    if (threeOctets) {
                                        const match = getIpKeys().find(ip => ip.startsWith(threeOctets + "."));
                                        if (match) {
                                            ConsoleLogEnabled("using three octet rule");
                                            return match;
                                        }
                                    }

                                    // Priority 2: Match first 2 octets
                                    const twoOctets = address.match(/^(\d+\.\d+)\./)?.[1];
                                    if (twoOctets) {
                                        const match = getIpKeys().find(ip => ip.startsWith(twoOctets + "."));
                                        if (match) {
                                            ConsoleLogEnabled("using two octet rule (fallback)");
                                            return match;
                                        }
                                    }

                                    // Priority 3: Fallback to original
                                    ConsoleLogEnabled("no match found, returning original");
                                    return address;
                                }

                                // function to get location data for an IP
                                function getLocationData(ip) {
                                    const locationId = serverRegionsByIp[ip];
                                    if (locationId && serverRegionsByIp._locations && serverRegionsByIp._locations[locationId]) {
                                        return serverRegionsByIp._locations[locationId];
                                    }
                                    return null;
                                }

                                const lookupIp = findBestMatchingIp(address);
                                const location = getLocationData(lookupIp);
                                if (!location) {
                                    ConsoleLogEnabled("API Response (Unknown Location):", json);
                                    //// this is for finding server regions
                                    //// Store unknown IP in localStorage
                                    //let unknownIPs = JSON.parse(localStorage.getItem("unknownIPs") || "[]");
                                    //if (!unknownIPs.includes(address)) {
                                    //    unknownIPs.push(address);
                                    //    localStorage.setItem("unknownIPs", JSON.stringify(unknownIPs));
                                    //}
                                    innerReject(`Unknown server address ${address}`);
                                    return;
                                }

                                location.placeVersion = json.joinScript.PlaceVersion; // samething
                                innerResolve(location);
                            },
                            onerror: function(error) {
                                ConsoleLogEnabled("API Request Failed:", error);
                                innerReject(`Failed to fetch server details: ${error}`);
                            },
                        });
                    });
                };

                const task = async () => {
                    try {
                        fetchServerDetails._activeCount++;

                        let result;
                        let attempts = 0;
                        const maxAttempts = 100; // prevent infinite loops

                        while (attempts < maxAttempts) {
                            try {
                                result = await makeRequest(gameId, jobId);
                                // if we get here, request was successful
                                if (fetchServerDetails._rateLimited) {
                                    ConsoleLogEnabled("Rate limit cleared, resuming normal operation");
                                    fetchServerDetails._rateLimited = false;
                                }
                                break;
                            } catch (err) {
                                if (err === 'rate_limited') {
                                    if (!fetchServerDetails._rateLimited) {
                                        ConsoleLogEnabled("Rate limited - retrying every second until cleared");
                                        fetchServerDetails._rateLimited = true;
                                    }
                                    ConsoleLogEnabled(`Rate limit retry attempt ${attempts + 1}`);
                                    await delay(1000); // wait 1 second before retry
                                    attempts++;
                                } else {
                                    // for other errors, don't retry
                                    throw err;
                                }
                            }
                        }

                        if (attempts >= maxAttempts) {
                            throw new Error(`Rate limited for too long, exceeded ${maxAttempts} attempts`);
                        }

                        resolve(result);
                    } catch (err) {
                        reject(err);
                    } finally {
                        fetchServerDetails._activeCount--;
                        if (queue.length > 0) {
                            const next = queue.shift();
                            next();
                        }
                    }
                };

                if (fetchServerDetails._activeCount < concurrencyLimit) {
                    task();
                } else {
                    queue.push(task);
                }
            });
        }

        /*******************************************************
        name of function: delay
        description: custom delay also known as sleep function in js cause this language sucks and doesent have a default built-in sleep.
        *******************************************************/
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /*******************************************************
         name of function: createServerCountPopup
         description: Creates the first time popup and allows user to pick the amount of servers they want.
         *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        function createServerCountPopup(callback) {
            const overlay = document.createElement('div');
            overlay.className = 'overlay';

            const popup = document.createElement('div');
            popup.className = 'filter-popup';

            // get current player count preference from localStorage
            const currentPlayerCountPreference = localStorage.getItem('ROLOCATE_invertplayercount');
            const isLowPlayerCount = currentPlayerCountPreference === 'true';

            // inject styles for dropdown icon and mobile responsiveness
            const style = document.createElement('style');
            style.textContent = `
            .overlay {
                z-index: 10000;
            }

            .filter-popup {
                width: 90%;
                max-width: 460px;
                max-height: 90vh;
                margin: 0 auto;
                box-sizing: border-box;
                overflow-y: auto;
                z-index: 10001;
            }

            .filter-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 15px;
            }

            @media (max-width: 600px) {
                .filter-grid {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }

                .filter-popup {
                    width: 95%;
                    padding: 20px 15px;
                }

                .popup-header h3 {
                    font-size: 18px;
                }

                .popup-header p {
                    font-size: 13px;
                }

                .popup-footer p {
                    font-size: 12px;
                }
            }

            /* Very small screens */
            @media (max-width: 400px) {
                .filter-popup {
                    width: 98%;
                    padding: 15px 10px;
                }

                .popup-header h3 {
                    font-size: 16px;
                }

                .filter-section label {
                    font-size: 13px;
                }

                select, input, button {
                    font-size: 13px;
                }
            }

            .dropdown-wrapper {
                position: relative;
                display: inline-block;
                width: 100%;
            }

            .dropdown-wrapper select {
                width: 100%;
                padding-right: 30px;
                appearance: none;
                -webkit-appearance: none;
                -moz-appearance: none;
                box-sizing: border-box;
            }

            .dropdown-wrapper .dropdown-icon {
                position: absolute;
                right: 10px;
                top: 40%;
                transform: translateY(-50%);
                pointer-events: none;
                font-size: 12px;
                color: #fff;
            }

            .filter-section label {
                display: block;
                margin-bottom: 5px;
                font-weight: 600;
            }

            #cancelServerCount {
                background-color: #2a1f1f;
                border: 1px solid #3d2626;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
            }

            #cancelServerCount:hover {
                background-color: #332222;
                transform: translateY(-1px);
            }

            #cancelServerCount:active {
                transform: translateY(0);
            }

            /* Ensure buttons are touch-friendly on mobile */
            @media (max-width: 600px) {
                button {
                    padding: 12px;
                    min-height: 44px;
                }
            }
        `;
            document.head.appendChild(style);

            popup.innerHTML = `
            <div class="popup-header">
                <h3>Select Number of Servers</h3>
                <p><strong>More servers = more variety, but longer search times.</strong></p>
            </div>

            <div class="filter-grid">
                <div class="filter-section">
                    <label for="serverCount">Number of Servers:</label>
                    <div class="dropdown-wrapper">
                        <select id="serverCount">
                            <option value="10">10 Servers</option>
                            <option value="25">50 Servers</option>
                            <option value="100" selected>100 Servers</option>
                            <option value="200">200 Servers</option>
                            <option value="500">500 Servers</option>
                            <option value="700">700 Servers</option>
                            <option value="custom">Custom</option>
                        </select>
                        <span class="dropdown-icon">▼</span>
                    </div>
                    <input id="customServerCount" type="number" min="1" max="700" placeholder="Enter number (1–700)" style="display: none; margin-top: 5px; width: calc(100% - 10px); box-sizing: border-box;">
                </div>

                <div class="filter-section">
                    <label for="playerCountFilter">Find Servers with:</label>
                    <div class="dropdown-wrapper">
                        <select id="playerCountFilter">
                            <option value="high" ${!isLowPlayerCount ? 'selected' : ''}>High Player Counts</option>
                            <option value="low" ${isLowPlayerCount ? 'selected' : ''}>Low Player Counts</option>
                        </select>
                        <span class="dropdown-icon">▼</span>
                    </div>
                </div>
            </div>

            <div class="popup-footer" style="text-align: left; margin-top: 0;">
                <p><strong>Note:</strong> If you have fast servers on, the buildman thumbnails are intentional! It's because it saves time for the search.</p>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button id="cancelServerCount" style="width:25%;">Cancel</button>
                <button id="confirmServerCount" style="width: 75%;">Confirm</button>
            </div>
        `;

            document.body.appendChild(overlay);
            document.body.appendChild(popup);

            const serverCountDropdown = popup.querySelector('#serverCount');
            const customServerCountInput = popup.querySelector('#customServerCount');
            const playerCountFilter = popup.querySelector('#playerCountFilter');
            const confirmButton = popup.querySelector('#confirmServerCount');
            const cancelButton = popup.querySelector('#cancelServerCount');

            serverCountDropdown.addEventListener('change', () => {
                if (serverCountDropdown.value === 'custom') {
                    customServerCountInput.style.display = 'block';
                } else {
                    customServerCountInput.style.display = 'none';
                }
            });

            confirmButton.addEventListener('click', () => {
                let serverCount;

                if (serverCountDropdown.value === 'custom') {
                    serverCount = parseInt(customServerCountInput.value);
                    if (isNaN(serverCount) || serverCount < 1 || serverCount > 2000) {
                        notifications('Error: Please enter a valid number between 1 and 2000.', 'error', '⚠️', '5000');
                        return;
                    }
                } else {
                    serverCount = parseInt(serverCountDropdown.value);
                }

                const playerCountPreference = playerCountFilter.value;
                localStorage.setItem('ROLOCATE_invertplayercount', playerCountPreference === 'low' ? 'true' : 'false');

                callback(serverCount);
                disableFilterButton(true);
                disableLoadMoreButton(true);
                hidePopup();
                Loadingbar(true);
            });

            cancelButton.addEventListener('click', () => {
                hidePopup();
            });

            function hidePopup() {
                const overlay = document.querySelector('.overlay');
                const popup = document.querySelector('.filter-popup');

                overlay.classList.add('fade-out');
                popup.classList.add('fade-out');

                setTimeout(() => {
                    overlay.remove();
                    popup.remove();
                }, 300);
            }
        }

        /*******************************************************
        name of function: fetchPublicServers
        description: Function to fetch public servers with rate limtiing and stuff (Server regions)
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        async function fetchPublicServers(gameId, totalLimit) {
            let servers = [];
            let cursor = null;
            let delayTime = 250; // Start with 0.25 seconds
            let retryingDueToRateLimit = false;
            let pageCount = 0;

            const invertPlayerCount = localStorage.getItem("ROLOCATE_invertplayercount") === "true";

            ConsoleLogEnabled(`Starting to fetch up to ${totalLimit} public servers for game ${gameId}...`);
            ConsoleLogEnabled(`Invert player count: ${invertPlayerCount}`);

            while (servers.length < totalLimit) {
                const url = `https://games.roblox.com/v1/games/${gameId}/servers/public?excludeFullGames=true&limit=100${invertPlayerCount ? '&sortOrder=1' : ''}${cursor ? `&cursor=${cursor}` : ''}`;

                pageCount++;
                ConsoleLogEnabled(`Fetching page ${pageCount}... (Current delay: ${delayTime}ms)`);

                let responseData;
                try {
                    responseData = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            onload: function(response) {
                                if (response.status === 429 || !response.responseText) {
                                    reject({
                                        rateLimited: true
                                    });
                                } else {
                                    try {
                                        const json = JSON.parse(response.responseText);
                                        resolve(json);
                                    } catch (err) {
                                        reject({
                                            rateLimited: true
                                        });
                                    }
                                }
                            },
                            onerror: function(error) {
                                reject({
                                    rateLimited: false,
                                    error
                                });
                            },
                        });
                    });

                    if (retryingDueToRateLimit) {
                        delayTime = 250;
                        retryingDueToRateLimit = false;
                        ConsoleLogEnabled(`Rate limit cleared. Resuming normal delay (${delayTime}ms).`);
                    }

                    const newServers = responseData.data || [];
                    servers = servers.concat(newServers);
                    ConsoleLogEnabled(`Fetched ${newServers.length} servers (Total: ${servers.length}/${totalLimit})`);

                    if (!responseData.nextPageCursor || servers.length >= totalLimit) {
                        ConsoleLogEnabled("No more pages or reached limit.");
                        break;
                    }

                    cursor = responseData.nextPageCursor;

                } catch (err) {
                    if (err.rateLimited) {
                        delayTime = 750;
                        retryingDueToRateLimit = true;
                        ConsoleLogEnabled("⚠️ Rate limited. Increasing delay to 0.75s...");
                    } else {
                        ConsoleLogEnabled("❌ Failed to fetch due to error:", err.error);
                        break;
                    }
                }

                await delay(delayTime);
            }

            ConsoleLogEnabled(`✅ Done. Fetched ${servers.length} servers in total.`);
            return servers.slice(0, totalLimit);
        }




        /*******************************************************
        name of function: createFilterDropdowns
        description: Creates the server selecting dropdown with country flags.
        *******************************************************/
        function createFilterDropdowns(servers) {
            // get flag data
            getFlagEmoji(); // load flag data without country code

            // create the main filter container with premium styling
            const filterContainer = document.createElement('div');
            Object.assign(filterContainer.style, {
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                padding: '20px 24px',
                background: 'linear-gradient(145deg, rgba(12,12,12,0.98) 0%, rgba(8,8,8,0.98) 25%, rgba(15,10,10,0.98) 75%, rgba(10,8,8,0.98) 100%)',
                borderRadius: '28px',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,30,30,0.15), inset 0 1px 0 rgba(255,255,255,0.02)',
                opacity: '0',
                transform: 'translateY(-50px) scale(0.94)',
                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                border: '1px solid rgba(200,30,30,0.12)',
                margin: '40px',
                fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                fontSize: '16px',
                overflow: 'hidden'
            });

            // Premium animated border with subtle red glow
            const borderGlow = document.createElement('div');
            Object.assign(borderGlow.style, {
                position: 'absolute',
                inset: '-2px',
                borderRadius: '30px',
                pointerEvents: 'none',
                background: 'linear-gradient(60deg, rgba(200,25,25,0.25), rgba(50,50,50,0.1), rgba(200,25,25,0.15), rgba(30,30,30,0.1), rgba(200,25,25,0.2))',
                backgroundSize: '300% 300%',
                zIndex: '-1',
                animation: 'premiumFlow 20s ease infinite',
                opacity: '0.7'
            });
            filterContainer.appendChild(borderGlow);

            // Add premium CSS animations and styling
            const style = document.createElement('style');
            style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes premiumFlow {
            0% { background-position: 0% 50%; transform: rotate(0deg); }
            25% { background-position: 100% 25%; }
            50% { background-position: 100% 100%; transform: rotate(0.5deg); }
            75% { background-position: 0% 75%; }
            100% { background-position: 0% 50%; transform: rotate(0deg); }
        }

        @keyframes premiumPulse {
            0% { box-shadow: 0 0 0 0 rgba(200, 30, 30, 0.4); }
            50% { box-shadow: 0 0 0 20px rgba(200, 30, 30, 0); }
            100% { box-shadow: 0 0 0 0 rgba(200, 30, 30, 0); }
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes iconFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
        }

        .premium-select {
            scrollbar-width: thin;
            scrollbar-color: rgba(200,30,30,0.6) rgba(20,20,20,0.4);
        }

        .premium-select::-webkit-scrollbar {
            width: 6px;
        }
        .premium-select::-webkit-scrollbar-track {
            background: rgba(15,15,15,0.8);
            border-radius: 10px;
        }
        .premium-select::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, rgba(200,30,30,0.8), rgba(150,25,25,0.6));
            border-radius: 10px;
            border: 1px solid rgba(0,0,0,0.2);
        }
        .premium-select::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, rgba(220,35,35,0.9), rgba(170,30,30,0.7));
        }

        .logo-premium-pulse {
            animation: premiumPulse 3s infinite;
        }

        .shimmer-effect {
            position: relative;
            overflow: hidden;
        }

        .shimmer-effect::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
            animation: shimmer 3s infinite;
        }

        .premium-icon {
            animation: iconFloat 3s ease-in-out infinite;
        }

        .flag-image {
            width: 26px !important; /* Slightly larger */
            height: 20px !important; /* Slightly larger */
            object-fit: cover;
            object-position: center;
            overflow: hidden;
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            flex-shrink: 0;
            /* Crop the edges to hide outline */
            clip-path: inset(1px 1px 1px 1px);
        }

        /* Custom select styling for flags */
        .premium-select option {
            padding: 12px 16px;
            background: rgba(15,15,15,0.98) !important;
            color: rgba(200,30,30,0.9) !important;
            border-radius: 8px;
            margin: 2px;
            display: flex;
            align-items: center;
        }
    `;
            document.head.appendChild(style);

            // Enhanced premium logo with sophisticated hover effects
            const logoWrapper = document.createElement('div');
            Object.assign(logoWrapper.style, {
                position: 'relative',
                marginRight: '36px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            });

            const logoContainer = document.createElement('div');
            Object.assign(logoContainer.style, {
                position: 'relative',
                padding: '8px',
                borderRadius: '20px',
                background: 'linear-gradient(145deg, rgba(25,25,25,0.8), rgba(15,15,15,0.9))',
                border: '1px solid rgba(200,30,30,0.2)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            });

            const logo = document.createElement('img');
            logo.src = window.Base64Images.logo;
            Object.assign(logo.style, {
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: 'drop-shadow(0 12px 24px rgba(200,30,30,0.4))',
                border: '2px solid rgba(200,30,30,0.3)',
            });

            const logoGlow = document.createElement('div');
            Object.assign(logoGlow.style, {
                position: 'absolute',
                inset: '-6px',
                borderRadius: '24px',
                background: 'radial-gradient(circle at center, rgba(200,30,30,0.5) 0%, rgba(200,30,30,0.1) 50%, transparent 70%)',
                opacity: '0',
                transition: 'all 0.6s ease',
                pointerEvents: 'none',
                zIndex: '-1',
            });

            // Premium logo interactions
            logoContainer.addEventListener('mouseover', () => {
                logo.style.transform = 'rotate(-6deg) scale(1.12)';
                logo.style.filter = 'drop-shadow(0 16px 32px rgba(200,30,30,0.6))';
                logo.style.border = '2px solid rgba(200,30,30,0.7)';
                logoContainer.style.background = 'linear-gradient(145deg, rgba(35,35,35,0.9), rgba(20,20,20,0.95))';
                logoContainer.style.border = '1px solid rgba(200,30,30,0.4)';
                logoGlow.style.opacity = '1';
                logo.classList.add('logo-premium-pulse');
            });

            logoContainer.addEventListener('mouseout', () => {
                logo.style.transform = 'rotate(0) scale(1)';
                logo.style.filter = 'drop-shadow(0 12px 24px rgba(200,30,30,0.4))';
                logo.style.border = '2px solid rgba(200,30,30,0.3)';
                logoContainer.style.background = 'linear-gradient(145deg, rgba(25,25,25,0.8), rgba(15,15,15,0.9))';
                logoContainer.style.border = '1px solid rgba(200,30,30,0.2)';
                logoGlow.style.opacity = '0';
                logo.classList.remove('logo-premium-pulse');
            });

            logoContainer.appendChild(logoGlow);
            logoContainer.appendChild(logo);
            logoWrapper.appendChild(logoContainer);
            filterContainer.appendChild(logoWrapper);

            // create icons
            const createIcon = (type) => {
                const iconMap = {
                    globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 2a14.5 14.5 0 0 1 0 20 14.5 14.5 0 0 1 0-20z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
                    city: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="9" width="6" height="12" rx="1"/><rect x="13" y="5" width="6" height="16" rx="1"/><rect x="5" y="12" width="2" height="2" rx="0.5"/><rect x="5" y="16" width="2" height="2" rx="0.5"/><rect x="15" y="8" width="2" height="2" rx="0.5"/><rect x="15" y="12" width="2" height="2" rx="0.5"/><rect x="15" y="16" width="2" height="2" rx="0.5"/></svg>`,
                    version: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 2.5v6.527a2 2 0 0 1-.211.896L5.22 19.55a1 1 0 0 0 .9 1.45h11.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 13.5 9.027V2.5"/><path d="M8.5 2.5h7"/><path d="M7 15.5h10"/></svg>`,
                    chevron: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`
                };
                return iconMap[type] || '';
            };

            // function to get country code from country name
            const getCountryCode = (countryName) => {
                // name to code name 2 letter name yea daskdha
                const countryCodeMap = {
                    'Australia': 'AU',
                    'Brazil': 'BR',
                    'Germany': 'DE',
                    'France': 'FR',
                    'United Kingdom': 'GB',
                    'Hong Kong': 'HK',
                    'India': 'IN',
                    'Japan': 'JP',
                    'Netherlands': 'NL',
                    'Poland': 'PL',
                    'Singapore': 'SG',
                    'United States': 'US',
                    'Ireland': 'IE'
                };

                // Return the country code or the first two letters of the country name as fallback
                return countryCodeMap[countryName] || countryName.substring(0, 2).toUpperCase();
            };

            // Function to create a premium dropdown with enhanced styling and icons
            const createDropdown = (id, placeholder, iconType) => {
                const wrapper = document.createElement('div');
                Object.assign(wrapper.style, {
                    position: 'relative',
                    minWidth: '200px',
                    flex: '1'
                });

                // Premium label with icon
                const labelContainer = document.createElement('div');
                Object.assign(labelContainer.style, {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '14px',
                    opacity: '0',
                    transform: 'translateX(-10px)',
                    transition: 'all 0.6s ease'
                });

                const labelIcon = document.createElement('span');
                labelIcon.innerHTML = createIcon(iconType);
                labelIcon.className = 'premium-icon';
                Object.assign(labelIcon.style, {
                    color: 'rgba(200,30,30,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    filter: 'drop-shadow(0 2px 4px rgba(200,30,30,0.3))'
                });

                const label = document.createElement('div');
                label.textContent = placeholder.replace('All ', '').toUpperCase();
                Object.assign(label.style, {
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '13px',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    transition: 'all 0.4s ease',
                    fontFamily: "'Inter', sans-serif"
                });

                labelContainer.appendChild(labelIcon);
                labelContainer.appendChild(label);
                wrapper.appendChild(labelContainer);

                // Premium dropdown with enhanced design
                const dropdownContainer = document.createElement('div');
                dropdownContainer.className = 'shimmer-effect';
                Object.assign(dropdownContainer.style, {
                    position: 'relative',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
                    border: '1px solid rgba(200,30,30,0.15)',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
                });

                const dropdown = document.createElement('select');
                dropdown.id = id;
                dropdown.className = 'premium-select';
                dropdown.innerHTML = `<option value="">${placeholder}</option>`;
                Object.assign(dropdown.style, {
                    width: '100%',
                    padding: '20px 60px 20px 28px',
                    fontSize: '16px',
                    fontWeight: '500',
                    background: 'transparent',
                    color: 'rgba(200,30,30,0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: '0',
                    transform: 'translateY(-25px)',
                    letterSpacing: '0.4px',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none'
                });

                // Premium chevron with enhanced styling
                const chevronContainer = document.createElement('div');
                Object.assign(chevronContainer.style, {
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    color: 'rgba(200,30,30,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    borderRadius: '8px',
                    background: 'rgba(200,30,30,0.1)',
                    border: '1px solid rgba(200,30,30,0.2)'
                });
                chevronContainer.innerHTML = createIcon('chevron');

                // Enhanced dropdown interactions with premium effects
                const addHoverEffect = () => {
                    dropdownContainer.style.background = 'linear-gradient(145deg, rgba(30,30,30,0.98), rgba(18,18,18,1))';
                    dropdownContainer.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 0 2px rgba(200,30,30,0.3), inset 0 1px 0 rgba(255,255,255,0.05)';
                    dropdownContainer.style.border = '1px solid rgba(200,30,30,0.3)';
                    dropdownContainer.style.transform = 'translateY(-2px)';
                    label.style.color = 'rgba(200,30,30,0.95)';
                    labelIcon.style.color = 'rgba(200,30,30,1)';
                    chevronContainer.style.transform = 'translateY(-50%) rotate(180deg)';
                    chevronContainer.style.background = 'rgba(200,30,30,0.2)';
                    chevronContainer.style.border = '1px solid rgba(200,30,30,0.4)';
                };

                const removeHoverEffect = () => {
                    if (document.activeElement !== dropdown) {
                        dropdownContainer.style.background = 'linear-gradient(145deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))';
                        dropdownContainer.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)';
                        dropdownContainer.style.border = '1px solid rgba(200,30,30,0.15)';
                        dropdownContainer.style.transform = 'translateY(0)';
                        label.style.color = 'rgba(255,255,255,0.85)';
                        labelIcon.style.color = 'rgba(200,30,30,0.8)';
                        chevronContainer.style.transform = 'translateY(-50%) rotate(0deg)';
                        chevronContainer.style.background = 'rgba(200,30,30,0.1)';
                        chevronContainer.style.border = '1px solid rgba(200,30,30,0.2)';
                    }
                };

                dropdownContainer.addEventListener('mouseover', addHoverEffect);
                dropdownContainer.addEventListener('mouseout', removeHoverEffect);

                dropdown.addEventListener('focus', () => {
                    dropdownContainer.style.outline = 'none';
                    dropdownContainer.style.border = '1px solid rgba(200,30,30,0.5)';
                    dropdownContainer.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 0 4px rgba(200,30,30,0.25), inset 0 1px 0 rgba(255,255,255,0.05)';
                    label.style.color = 'rgba(200,30,30,1)';
                    labelIcon.style.color = 'rgba(200,30,30,1)';
                    chevronContainer.style.transform = 'translateY(-50%) rotate(180deg)';
                });

                dropdown.addEventListener('blur', removeHoverEffect);

                dropdown.addEventListener('change', () => {
                    // Premium selection animation
                    dropdownContainer.style.transform = 'translateY(-2px) scale(0.98)';
                    setTimeout(() => {
                        dropdownContainer.style.transform = 'translateY(-2px) scale(1)';
                    }, 150);

                    // Enhanced flash effect
                    const flash = document.createElement('div');
                    Object.assign(flash.style, {
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '16px',
                        background: 'linear-gradient(145deg, rgba(200,30,30,0.2), rgba(200,30,30,0.1))',
                        pointerEvents: 'none',
                        opacity: '0',
                        transition: 'opacity 0.4s ease'
                    });
                    dropdownContainer.appendChild(flash);
                    flash.style.opacity = '1';
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        setTimeout(() => dropdownContainer.removeChild(flash), 400);
                    }, 80);
                });

                // Staggered fade-in animation
                setTimeout(() => {
                    labelContainer.style.opacity = '1';
                    labelContainer.style.transform = 'translateX(0)';
                }, 400);

                setTimeout(() => {
                    dropdown.style.opacity = '1';
                    dropdown.style.transform = 'translateY(0)';
                }, 600);

                dropdownContainer.appendChild(dropdown);
                dropdownContainer.appendChild(chevronContainer);
                wrapper.appendChild(dropdownContainer);
                return wrapper;
            };

            // Create premium dropdowns with icons
            const countryDropdown = createDropdown('countryFilter', 'All Countries', 'globe');
            const cityDropdown = createDropdown('cityFilter', 'All Cities', 'city');
            const versionDropdown = createDropdown('versionFilter', 'Server Versions', 'version'); // glitch somehwre ein the code but idc

            // server data and flasgs
            const countryCounts = {};
            const countryServerMap = {}; // store server ifno for each one

            servers.forEach(server => {
                const country = server.location.country.name;
                countryCounts[country] = (countryCounts[country] || 0) + 1;
                if (!countryServerMap[country]) {
                    countryServerMap[country] = server; // store first server for country code reference
                }
            });

            const sortedCountries = Object.keys(countryCounts).sort();
            const countrySelect = countryDropdown.querySelector('select');

            sortedCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;

                // Try to get country code from server data first, then fallback to mapping
                let countryCode;
                const server = countryServerMap[country];
                if (server && server.location.country.code) {
                    countryCode = server.location.country.code;
                } else {
                    countryCode = getCountryCode(country);
                }

                // Create flag element
                try {
                    const flagImg = getFlagEmoji(countryCode);
                    if (flagImg) {
                        flagImg.className = 'flag-image';
                        // Since we can't directly add HTML to option text, we'll use a data attribute
                        // and handle the display with CSS or JavaScript
                        option.setAttribute('data-flag-src', flagImg.src);
                        option.setAttribute('data-country-code', countryCode);
                        option.textContent = `${country} (${countryCounts[country]})`;
                    }
                } catch (error) {
                    ConsoleLogEnabled(`Could not load flag for ${country} (${countryCode}):`, error);
                    option.textContent = `${country} (${countryCounts[country]})`;
                }

                Object.assign(option.style, {
                    background: 'rgba(15,15,15,0.98)',
                    color: 'rgba(200,30,30,0.9)',
                    padding: '12px',
                    borderRadius: '8px',
                    margin: '2px'
                });
                countrySelect.appendChild(option);
            });

            // Create a custom dropdown display that shows flags
            const createCustomDropdownDisplay = (selectElement) => {
                const customDisplay = document.createElement('div');
                Object.assign(customDisplay.style, {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 60px 20px 28px',
                    pointerEvents: 'none',
                    zIndex: '1',
                    color: 'rgba(200,30,30,0.95)',
                    fontSize: '16px',
                    fontWeight: '500',
                    letterSpacing: '0.4px',
                    fontFamily: "'Inter', sans-serif"
                });

                const updateDisplay = () => {
                    const selectedOption = selectElement.options[selectElement.selectedIndex];
                    if (selectedOption && selectedOption.getAttribute('data-flag-src')) {
                        const flagSrc = selectedOption.getAttribute('data-flag-src');
                        const countryCode = selectedOption.getAttribute('data-country-code');

                        customDisplay.innerHTML = `
                    <img src="${flagSrc}"
                         alt="${countryCode}"
                         class="flag-image"
                         style="width: 24px; height: 18px; margin-right: 12px; border-radius: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
                    <span>${selectedOption.textContent}</span>
                `;
                    } else {
                        customDisplay.textContent = selectedOption ? selectedOption.textContent : selectElement.options[0].textContent;
                    }
                };

                selectElement.addEventListener('change', updateDisplay);
                updateDisplay(); // Initial display

                return customDisplay;
            };

            // add custom display to country dropdown
            const countryDropdownContainer = countryDropdown.querySelector('.shimmer-effect');
            const countryCustomDisplay = createCustomDropdownDisplay(countrySelect);
            countryDropdownContainer.appendChild(countryCustomDisplay);

            // make it transparent
            countrySelect.addEventListener('change', () => {
                if (countrySelect.value) {
                    countrySelect.style.color = 'transparent';
                } else {
                    countrySelect.style.color = 'rgba(200,30,30,0.95)';
                }
            });

            // premium separator with gradient
            const separator = document.createElement('div');
            Object.assign(separator.style, {
                height: '80px',
                width: '2px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(200,30,30,0.4) 20%, rgba(200,30,30,0.6) 50%, rgba(200,30,30,0.4) 80%, rgba(255,255,255,0))',
                margin: '0 8px',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden'
            });

            // Add subtle animation to separator
            const separatorGlow = document.createElement('div');
            Object.assign(separatorGlow.style, {
                position: 'absolute',
                inset: '0',
                background: 'linear-gradient(to bottom, transparent, rgba(200,30,30,0.8), transparent)',
                animation: 'shimmer 4s infinite',
                opacity: '0.3'
            });
            separator.appendChild(separatorGlow);

            // Enhanced country change handler with flag support
            countrySelect.addEventListener('change', () => {
                const selectedCountry = countrySelect.value;
                const citySelect = cityDropdown.querySelector('select');
                citySelect.innerHTML = '<option value="">All Cities</option>';

                if (selectedCountry) {
                    const cityCounts = {};
                    servers
                        .filter(server => server.location.country.name === selectedCountry)
                        .forEach(server => {
                            const city = server.location.city;
                            const region = server.location.region?.name;
                            const cityKey = region ? `${city}, ${region}` : city;
                            cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;
                        });

                    const sortedCities = Object.keys(cityCounts).sort();
                    sortedCities.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city;
                        option.textContent = `${city} (${cityCounts[city]})`;
                        Object.assign(option.style, {
                            background: 'rgba(15,15,15,0.98)',
                            color: 'rgba(200,30,30,0.9)',
                            padding: '12px'
                        });
                        citySelect.appendChild(option);
                    });

                    // Premium update animation
                    const cityContainer = cityDropdown.querySelector('div');
                    cityContainer.style.opacity = '0.4';
                    cityContainer.style.transform = 'translateY(-15px)';
                    setTimeout(() => {
                        cityContainer.style.opacity = '1';
                        cityContainer.style.transform = 'translateY(0)';
                    }, 200);

                    // Visual update indicator
                    const updateRipple = document.createElement('div');
                    Object.assign(updateRipple.style, {
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '16px',
                        background: 'radial-gradient(circle at center, rgba(200,30,30,0.3) 0%, rgba(200,30,30,0.1) 40%, transparent 70%)',
                        pointerEvents: 'none',
                        opacity: '1',
                        transition: 'all 1s ease',
                        transform: 'scale(0.8)'
                    });
                    cityDropdown.style.position = 'relative';
                    cityDropdown.appendChild(updateRipple);

                    setTimeout(() => {
                        updateRipple.style.opacity = '0';
                        updateRipple.style.transform = 'scale(1.2)';
                        setTimeout(() => cityDropdown.removeChild(updateRipple), 1000);
                    }, 100);
                }
                // update theis
                populateVersionOptions(countrySelect.value, citySelect.value);
            });

            // function to do stuff like picmversioin
            // hopefulyl works no buggy wuggys
            const versionSelect = versionDropdown.querySelector('select');
            function populateVersionOptions(countryValue, cityValue) {
                const prevValue = versionSelect.value;
                versionSelect.innerHTML = '<option value="">All Versions</option>';
                let candidateServers = servers;
                if (countryValue) candidateServers = candidateServers.filter(s => s.location.country.name === countryValue);
                if (cityValue) {
                    candidateServers = candidateServers.filter(s => `${s.location.city}${s.location.region?.name ? `, ${s.location.region.name}` : ''}` === cityValue);
                }
                const versionsSet = new Set();
                candidateServers.forEach(s => {
                    const v = s.location.placeVersion;
                    if (v != null && v !== 'N/A') versionsSet.add(Number(v));
                });
                const versions = Array.from(versionsSet).sort((a,b) => b - a); // newest on top to oldest
                if (versions.length === 0) return; // safety
                const min = versions[versions.length - 1];
                const max = versions[0];
                versions.forEach(v => {
                    const option = document.createElement('option');
                    option.value = String(v);
                    // label newest and oldest
                    if (v === max) {
                        option.textContent = `Newest (${v})`;
                    } else if (v === min) {
                        option.textContent = `Oldest (${v})`;
                    } else {
                        option.textContent = String(v);
                    }
                    Object.assign(option.style, {
                        background: 'rgba(15,15,15,0.98)',
                        color: 'rgba(200,30,30,0.9)',
                        padding: '12px'
                    });
                    versionSelect.appendChild(option);
                });
                // try to restore previous value if still available
                if (prevValue && Array.from(versionSelect.options).some(o => o.value === prevValue)) {
                    versionSelect.value = prevValue;
                }
            };
            // on city change update versions so no bugs
            const citySelect = cityDropdown.querySelector('select');
            citySelect.addEventListener('change', () => {
                populateVersionOptions(countrySelect.value, citySelect.value);
            });

            // elemtns inside so country city and version
            filterContainer.appendChild(countryDropdown);
            filterContainer.appendChild(cityDropdown);
            filterContainer.appendChild(versionDropdown);

            // add versions in
            populateVersionOptions('', '');

            // Premium container entrance animation
            setTimeout(() => {
                filterContainer.style.opacity = '1';
                filterContainer.style.transform = 'translateY(0) scale(1)';
            }, 200);

            return filterContainer;
        }

        /*******************************************************
        name of function: filterServers
        description: Function to filter servers based on selected country and city cause im lazy
        *******************************************************/
        function filterServers(servers, country, city, version) {
          if (!filterServers.index || filterServers.lastServers !== servers) {
            filterServers.index = new Map();
            filterServers.lastServers = servers;

            for (const s of servers) {
              const countryName = s.location.country.name;
              const cityName = `${s.location.city}${s.location.region?.name ? `, ${s.location.region.name}` : ''}`;

              // hopefully i can remember later on what this does
              const cKey = `country:${countryName}`;
              const cityKey = `city:${countryName}:${cityName}`;
              const placeVersion = s.location.placeVersion;
              const hasValidVersion = placeVersion != null && placeVersion !== 'N/A';
              const versionStr = hasValidVersion ? String(placeVersion) : null;
              const vKey = versionStr ? `version:${versionStr}` : null;
              const cVKey = versionStr ? `version:${countryName}:${versionStr}` : null;
              const cityVKey = versionStr ? `version:${countryName}:${cityName}:${versionStr}` : null;

              // holy if spam
              if (!filterServers.index.has(cKey)) {
                filterServers.index.set(cKey, []);
              }
              if (!filterServers.index.has(cityKey)) {
                filterServers.index.set(cityKey, []);
              }
              if (vKey && !filterServers.index.has(vKey)) {
                filterServers.index.set(vKey, []);
              }
              if (cVKey && !filterServers.index.has(cVKey)) {
                filterServers.index.set(cVKey, []);
              }
              if (cityVKey && !filterServers.index.has(cityVKey)) {
                filterServers.index.set(cityVKey, []);
              }

              filterServers.index.get(cKey).push(s);
              filterServers.index.get(cityKey).push(s);
              if (vKey) {
                filterServers.index.get(vKey).push(s);
              }
              if (cVKey) {
                filterServers.index.get(cVKey).push(s);
              }
              if (cityVKey) {
                filterServers.index.get(cityVKey).push(s);
              }
            }
          }

          if (country && city && version) {
            return filterServers.index.get(`version:${country}:${city}:${version}`) || [];
          }
          if (country && city) {
            return filterServers.index.get(`city:${country}:${city}`) || [];
          }
          if (country && version) {
            return filterServers.index.get(`version:${country}:${version}`) || [];
          }
          if (version) {
            return filterServers.index.get(`version:${version}`) || [];
          }
          if (country) {
            return filterServers.index.get(`country:${country}`) || [];
          }

          return servers;
        }



        /*******************************************************
        name of function: fetchPlayerThumbnails_servers
        description: finds player thumbnails (Server regions) - now returns promise
        *******************************************************/
        const fetchPlayerThumbnails_servers = (() => {
            const queue = [];
            let processing = false;

            return async function(playerTokens) {
                ConsoleLogEnabled("Function called with playerTokens:", playerTokens);
                const waitHalfSecond = (ms = 250) => new Promise(res => setTimeout(res, ms));

                return new Promise(resolve => {
                    ConsoleLogEnabled("Pushing to queue:", playerTokens);
                    queue.push({
                        playerTokens,
                        resolve
                    });

                    const processQueue = async () => {
                        if (processing) {
                            ConsoleLogEnabled("Already processing, exiting...");
                            return;
                        }
                        processing = true;
                        ConsoleLogEnabled("Started processing queue...");

                        while (queue.length > 0) {
                            const {
                                playerTokens,
                                resolve
                            } = queue.shift();
                            ConsoleLogEnabled("Processing batch:", playerTokens);

                            const body = playerTokens.map(token => ({
                                requestId: `0:${token}:AvatarHeadshot:150x150:png:regular`,
                                type: "AvatarHeadShot",
                                targetId: 0,
                                token,
                                format: "png",
                                size: "150x150",
                            }));

                            let success = false;
                            let data = [];

                            while (!success) {
                                ConsoleLogEnabled("Sending request to thumbnails.roblox.com...");
                                const response = await fetch("https://thumbnails.roblox.com/v1/batch", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                    },
                                    body: JSON.stringify(body),
                                });

                                ConsoleLogEnabled("Response status:", response.status);

                                if (response.status === 429) {
                                    ConsoleLogEnabled("Rate limited. Waiting...");
                                    await waitHalfSecond();
                                } else {
                                    const json = await response.json();
                                    data = json.data || [];
                                    success = true;
                                    ConsoleLogEnabled("Received data:", data);
                                }
                            }

                            resolve(data);
                            ConsoleLogEnabled("Resolved promise with data");
                        }

                        processing = false;
                        ConsoleLogEnabled("Finished processing queue.");
                    };

                    processQueue();
                });
            };
        })();

        /*******************************************************
        name of function: updateServerCardThumbnails
        description: updates thumbnails for a specific server card after they're loaded
        *******************************************************/
        function updateServerCardThumbnails(serverId, playerThumbnails, maxPlayers, currentPlayers) {
            const serverCard = document.querySelector(`[data-server-id="${serverId}"]`);
            if (!serverCard) return;

            const thumbnailsContainer = serverCard.querySelector('.player-thumbnails-container');
            if (!thumbnailsContainer) return;

            // Clear existing content (mock thumbnails)
            thumbnailsContainer.innerHTML = '';

            // Add real player thumbnails
            const maxThumbnails = 5;
            const displayedThumbnails = playerThumbnails.slice(0, maxThumbnails);

            displayedThumbnails.forEach(thumb => {
                if (thumb && thumb.imageUrl) {
                    const img = document.createElement("img");
                    img.src = thumb.imageUrl;
                    img.className = "avatar-card-image";
                    img.style.width = "60px";
                    img.style.height = "60px";
                    img.style.borderRadius = "50%";
                    img.style.transition = "opacity 0.3s ease";
                    img.style.opacity = "0";
                    thumbnailsContainer.appendChild(img);

                    img.onload = () => {
                        img.style.opacity = "1";
                    };
                }
            });

            // Add placeholder for hidden players
            const hiddenPlayers = currentPlayers - displayedThumbnails.length;
            if (hiddenPlayers > 0) {
                const placeholder = document.createElement("div");
                placeholder.className = "avatar-card-image";
                placeholder.style.width = "60px";
                placeholder.style.height = "60px";
                placeholder.style.borderRadius = "50%";
                placeholder.style.backgroundColor = "#6a6f81";
                placeholder.style.display = "flex";
                placeholder.style.alignItems = "center";
                placeholder.style.justifyContent = "center";
                placeholder.style.color = "#fff";
                placeholder.style.fontSize = "14px";
                placeholder.textContent = `+${hiddenPlayers}`;
                thumbnailsContainer.appendChild(placeholder);
            }
        }

        /*******************************************************
        name of function: createThumbnailContainer
        description: Creates thumbnail container - now works for both real and mock thumbnails
        *******************************************************/
        function createThumbnailContainer(playerThumbnails, maxPlayers, currentPlayers, isMock = false) {
            const thumbnailsContainer = document.createElement("div");
            thumbnailsContainer.className = "player-thumbnails-container";
            thumbnailsContainer.style.display = "grid";
            thumbnailsContainer.style.gridTemplateColumns = "repeat(3, 60px)";
            thumbnailsContainer.style.gridTemplateRows = "repeat(2, 60px)";
            thumbnailsContainer.style.gap = "5px";
            thumbnailsContainer.style.marginBottom = "10px";

            // function for mock thumbnails
            const randomBase64Image = () => {
                const placeholders = [
                    window.Base64Images.roblox_avatar,
                    window.Base64Images.builderman_avatar,
                ];
                return placeholders[Math.floor(Math.random() * placeholders.length)];
            };

            const maxThumbnails = 5;
            const displayedCount = Math.min(currentPlayers, maxThumbnails);

            // Create thumbnails (mock or real)
            for (let i = 0; i < displayedCount; i++) {
                const img = document.createElement("img");

                if (isMock) {
                    img.src = randomBase64Image();
                } else if (playerThumbnails[i] && playerThumbnails[i].imageUrl) {
                    img.src = playerThumbnails[i].imageUrl;
                } else {
                    continue; // Skip if no thumbnail data
                }

                img.className = "avatar-card-image";
                img.style.width = "60px";
                img.style.height = "60px";
                img.style.borderRadius = "50%";
                img.style.opacity = "1";
                thumbnailsContainer.appendChild(img);
            }

            // add +x placeholder for hidden players
            const hiddenPlayers = currentPlayers - displayedCount;
            if (hiddenPlayers > 0) {
                const placeholder = document.createElement("div");
                placeholder.className = "avatar-card-image";
                placeholder.style.width = "60px";
                placeholder.style.height = "60px";
                placeholder.style.borderRadius = "50%";
                placeholder.style.backgroundColor = "#6a6f81";
                placeholder.style.display = "flex";
                placeholder.style.alignItems = "center";
                placeholder.style.justifyContent = "center";
                placeholder.style.color = "#fff";
                placeholder.style.fontSize = "14px";
                placeholder.textContent = `+${hiddenPlayers}`;
                thumbnailsContainer.appendChild(placeholder);
            }

            return thumbnailsContainer;
        }

        /*******************************************************
        name of function: getCsrfToken
        description: get crsf token
        *******************************************************/
        async function getCsrfToken() { // look ik this function may get called like a million times. but shouldnt be an issue. :) real men test in production >:)
            return new Promise((resolve) => {
                GM_xmlhttpRequest({ // low risk endpoint. hopefully no ratelimit
                    url: "https://catalog.roblox.com/v1/catalog/items/details",
                    method: "POST",
                    withCredentials: true,
                    onload: function(response) {
                        const token = response.responseHeaders
                            .split("\n")
                            .find(h => h.toLowerCase().startsWith("x-csrf-token"));

                        if (!token) {
                            ConsoleLogEnabled("Error: Something went wrong getting csrf token!");
                            resolve(null);
                            return;
                        }

                        const value = token.split(":")[1].trim();
                        resolve(value);
                    },
                    onerror: function() {
                        ConsoleLogEnabled("Error: Request failed while getting csrf token!");
                        resolve(null);
                    }
                });
            });
        }

        /*******************************************************
        name of function: getLatestPlaceVersion
        description: get the latest published version of a place
        *******************************************************/
        async function getLatestPlaceVersion(gameId) { // yea may get called 1 billion times
            try {
                const token = await getCsrfToken();
                if (!token) {
                    ConsoleLogEnabled("Error: Could not get CSRF token for version check");
                    return null;
                }

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://develop.roblox.com/v1/assets/latest-versions",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": token
                        },
                        data: JSON.stringify({
                            assetIds: [parseInt(gameId)],
                            versionStatus: "Published"
                        }),
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.results && data.results.length > 0 && data.results[0].status === "Success") {
                                    const versionNumber = data.results[0].versionNumber;
                                    ConsoleLogEnabled(`Latest Published Place Version: ${versionNumber}`);
                                    resolve(versionNumber);
                                } else {
                                    ConsoleLogEnabled("Error: Could not retrieve version number from response");
                                    resolve(null);
                                }
                            } catch (err) {
                                ConsoleLogEnabled("Error parsing latest version response:", err);
                                resolve(null);
                            }
                        },
                        onerror: function(err) {
                            ConsoleLogEnabled("Error fetching latest place version:", err);
                            resolve(null);
                        },
                        withCredentials: true
                    });
                });

            } catch (error) {
                ConsoleLogEnabled("Error fetching latest place version:", error);
                return null;
            }
        }

        /*******************************************************
        name of function: rebuildServerList
        description: function to create server cards immediately and load thumbnails
        *******************************************************/
        async function rebuildServerList(gameId, totalLimit, best_connection, quick_join = false) {
            const latestPublishedVersion = await getLatestPlaceVersion(gameId);
            const serverListContainer = document.getElementById("rbx-public-game-server-item-container");
            const isJoinMode = best_connection || quick_join;

            // If in any join mode (best connection or quick join)
            if (isJoinMode) {
                const originalInvert = localStorage.getItem('ROLOCATE_invertplayercount') === 'true';
                let foundServer = false;

                try {
                    // Only disable filter button for best_connection, not for quick_join
                    if (best_connection) {
                        disableFilterButton(true);
                    }

                    notifications("Retrieving Location...", "success", "🌎", '5000');
                    const userLocation = await getUserLocation(true);
                    if (!userLocation) {
                        notifications('Error: Unable to fetch your location. Please enable location access or set it to manual in settings.', 'error', '⚠️', '5000');
                        return;
                    }

                    // Attempt to find server (up to 2 attempts)
                    for (let attempt = 0; attempt < 2 && !foundServer; attempt++) {
                        // Set the appropriate invert setting for this attempt
                        if (attempt === 0) {
                            localStorage.setItem('ROLOCATE_invertplayercount', originalInvert.toString());
                        } else {
                            localStorage.setItem('ROLOCATE_invertplayercount', 'true');
                            notifications('No available servers found. Trying smallest servers...', 'info', '🔄', '3000');
                        }

                        const servers = await fetchPublicServers(gameId, 50);
                        if (servers.length === 0) {
                            notifications('No servers found for this game.', 'error', '⚠️', '3000');
                            continue;
                        }

                        const isFastServers = localStorage.getItem("ROLOCATE_fastservers") === "true";
                        let closestServer = null;
                        let minDistance = Infinity;
                        let closestServerLocation = null; // used for best connection (ik it says not used but its used)

                        if (isFastServers) {
                            const results = await Promise.allSettled(
                                servers.map(async server => {
                                    const {
                                        id: serverId,
                                        maxPlayers,
                                        playing
                                    } = server;
                                    if (playing >= maxPlayers) return null;

                                    try {
                                        const location = await fetchServerDetails(gameId, serverId);
                                        const distance = calculateDistance(
                                            userLocation.latitude,
                                            userLocation.longitude,
                                            location.latitude,
                                            location.longitude
                                        );
                                        return {
                                            server,
                                            location,
                                            distance
                                        };
                                    } catch (error) {
                                        ConsoleLogEnabled(`Error fetching details for server ${serverId}:`, error);
                                        return null;
                                    }
                                })
                            );

                            for (const result of results) {
                                if (result.status === "fulfilled" && result.value) {
                                    const {
                                        server,
                                        location,
                                        distance
                                    } = result.value;
                                    if (distance < minDistance) {
                                        minDistance = distance;
                                        closestServer = server;
                                        closestServerLocation = location; // used for best connection
                                    }
                                }
                            }
                        } else {
                            for (const server of servers) {
                                const {
                                    id: serverId,
                                    maxPlayers,
                                    playing
                                } = server;
                                if (playing >= maxPlayers) continue;

                                try {
                                    const location = await fetchServerDetails(gameId, serverId);
                                    const distance = calculateDistance(
                                        userLocation.latitude,
                                        userLocation.longitude,
                                        location.latitude,
                                        location.longitude
                                    );

                                    if (distance < minDistance) {
                                        minDistance = distance;
                                        closestServer = server;
                                        closestServerLocation = location; // used for best connection
                                    }
                                } catch (error) {
                                    ConsoleLogEnabled(`Error fetching details for server ${serverId}:`, error);
                                    continue;
                                }
                            }
                        }

                        if (closestServer) {
                            JoinServer(gameId, closestServer.id);
                            notifications(`Joining nearest server! \nDistance: ${Math.round(minDistance / 1.609)} miles | ${Math.round(minDistance)} km`, 'success', '🚀', '5000');
                            foundServer = true;
                        }
                    }

                    if (!foundServer) {
                        notifications('No valid servers found. This game might be popular right now. Try using \'Server Region\' or refresh the page and try again later.', 'error', '⚠️', '8000');
                    }
                } catch (error) {
                    ConsoleLogEnabled("Error in join mode:", error);
                    notifications('Error during server search: ' + error.message, 'error', '⚠️', '5000');
                } finally {
                    localStorage.setItem('ROLOCATE_invertplayercount', originalInvert.toString());
                    if (best_connection) {
                        disableFilterButton(false);
                    }
                    Loadingbar(false);
                }
                return;
            }

            // Rest of the function for normal server list display
            if (!serverListContainer) {
                ConsoleLogEnabled("Server list container not found!");
                notifications('Error: No Servers found. There is nobody playing this game. Please refresh the page.', 'error', '⚠️', '8000');
                Loadingbar(false);
                return;
            }

            const messageElement = showMessage("Just a moment — to detect your location accurately, please stay on this page...");
            const premium_message = messageElement.querySelector('.premium-message-text');

            try {
                // Retrieve user's location for distance calculations
                const userLocation = await getUserLocation();
                if (!userLocation) {
                    notifications('Error: Unable to fetch your location. Please enable location access.', 'error', '⚠️', '5000');
                    disableFilterButton(false);
                    return;
                }

                // update message after location is retrieved
                if (premium_message) {
                    premium_message.textContent = "Location detected! Discovering servers...";
                }

                const servers = await fetchPublicServers(gameId, totalLimit);
                const totalServers = servers.length;
                let skippedServers = 0;

                if (premium_message) {
                    premium_message.textContent = `Filtering servers... Please stay on this page to ensure a faster and more accurate search. ${totalServers} servers found, 0 loaded so far.`;
                }

                notifications(`Please do not leave this page as it slows down the search. \nFound a total of ${totalServers} servers.`, 'success', '👍', '3000');

                const serverDetails = [];
                const thumbnailCache = new Map(); // Cache for thumbnails
                const useBatching = localStorage.ROLOCATE_fastservers === "true";

                // Process servers to get location data (WITHOUT waiting for thumbnails)
                if (useBatching) {
                    const batchSize = 100;
                    let processedCount = 0;

                    for (let i = 0; i < servers.length; i += batchSize) {
                        const batch = servers.slice(i, i + batchSize);
                        const batchPromises = batch.map(async (server) => {
                            const {
                                id: serverId,
                                maxPlayers,
                                playing
                            } = server;

                            if (playing >= maxPlayers) {
                                skippedServers++;
                                return null;
                            }

                            try {
                                const location = await fetchServerDetails(gameId, serverId);

                                if (location.city === "Unknown") {
                                    ConsoleLogEnabled(`Skipping server ${serverId} because location is unknown.`);
                                    skippedServers++;
                                    return null;
                                }

                                return {
                                    server,
                                    location
                                };
                            } catch (error) {
                                if (error === 'purchase_required') {
                                    throw error;
                                } else if (error === 'subplace_join_restriction') {
                                    throw error;
                                } else if (error === 'banned_by_creator') {
                                    throw error;
                                } else {
                                    ConsoleLogEnabled(error);
                                    skippedServers++;
                                    return null;
                                }
                            }
                        });

                        const batchResults = await Promise.all(batchPromises);
                        const previousProcessedCount = processedCount;
                        const validResults = batchResults.filter(result => result !== null);
                        serverDetails.push(...validResults);
                        processedCount += batch.length;

                        // smoothly update the processed count
                        function updateProcessedCountSmoothly(startCount, targetCount) {
                            const increment = 1;
                            let currentCount = startCount;

                            const interval = setInterval(() => {
                                if (currentCount < targetCount) {
                                    currentCount += increment;
                                    if (premium_message) {
                                        premium_message.textContent = `Filtering servers, please do not leave this page...\n${totalServers} servers found, ${currentCount} server locations found`;
                                    }
                                } else {
                                    clearInterval(interval);
                                }
                            }, 0.5);
                        }

                        updateProcessedCountSmoothly(previousProcessedCount, processedCount);
                    }
                } else {
                    // sequential processing
                    for (let i = 0; i < servers.length; i++) {
                        const server = servers[i];
                        const {
                            id: serverId,
                            maxPlayers,
                            playing
                        } = server;

                        let location;
                        try {
                            location = await fetchServerDetails(gameId, serverId);
                        } catch (error) {
                            if (error === 'purchase_required') {
                                if (premium_message) {
                                    premium_message.textContent = "Error: Cannot access server regions because you have not purchased the game.";
                                }
                                notifications('Error: Cannot access server regions because you have not purchased the game.', 'error', '⚠️', '15000');
                                Loadingbar(false);
                                return;
                            } else if (error === 'subplace_join_restriction') {
                                if (premium_message) {
                                    premium_message.textContent = "Error: This game requires users to teleport to a subplace. As a result, server regions cannot be retrieved.";
                                }
                                notifications('Error: This game requires users to teleport to a subplace. As a result, server regions cannot be retrieved.', 'error', '⚠️', '15000');
                                Loadingbar(false);
                                return;
                            } else if (error === 'banned_by_creator') {
                                if (premium_message) {
                                    premium_message.textContent = "Error: Cannot access server regions because the creator has banned you from the game.";
                                }
                                notifications('Error: Cannot access server regions because the creator has banned you from the game.', 'error', '⚠️', '15000');
                                Loadingbar(false);
                                return;
                            } else {
                                ConsoleLogEnabled(error);
                                location = {
                                    city: "Unknown",
                                    country: {
                                        name: "Unknown",
                                        code: "??"
                                    }
                                };
                            }
                        }

                        if (location.city === "Unknown" || playing >= maxPlayers) {
                            ConsoleLogEnabled(`Skipping server ${serverId} because it is full or location is unknown.`);
                            skippedServers++;
                            continue;
                        }

                        serverDetails.push({
                            server,
                            location
                        });

                        if (premium_message) {
                            premium_message.textContent = `Filtering servers, please do not leave this page...\n${totalServers} servers found, ${i + 1} server locations found`;
                        }
                    }
                }

                if (serverDetails.length === 0) {
                    showMessage("END");
                    if (servers.every(s => s.maxPlayers === 1)) {
                        notifications('All servers have a max player count of 1. These are likely solo servers and cannot be joined normally.', 'error', '⚠️', '8000');
                    } else {
                        notifications('Error: No servers found. Try increasing the search limit or try searching with server with low player count.', 'error', '⚠️', '8000');
                    }
                    Loadingbar(false);
                    return;
                }

                const loadedServers = totalServers - skippedServers;
                notifications(`Filtering complete!\n${totalServers} servers found, ${loadedServers} servers loaded, ${skippedServers} servers skipped (full).`, 'success', '👍', '2000');

                // Check script handler notifications
                if (typeof GM_info !== 'undefined') {
                    const handler = GM_info.scriptHandler?.toLowerCase();
                    const fastServers = localStorage.getItem('ROLOCATE_fastservers');

                    if (handler?.includes('violentmonkey') && fastServers === 'false') {
                        notifications(`You're using Violentmonkey, it supports Fast Servers. Turn on "Fast Server Search" in Settings → General → Fast Server Search, to search servers up to 100x faster!`, 'info', '🚀', '12000');
                    }

                    if (handler?.includes('scriptcat') && fastServers === 'false') {
                        notifications(`You're using ScriptCat, it supports Fast Servers. Turn on "Fast Server Search" in Settings → General → Fast Server Search, to search servers up to 100x faster!`, 'info', '🚀', '12000');
                    }

                    if (handler?.includes('tampermonkey')) {
                        notifications(`Server search is slow because of a bug in Tampermonkey. Use Violentmonkey or Scriptcat to make it 100x faster!`, 'info', '🚀', '12000');
                    }
                }

                showMessage("END");
                Loadingbar(false);

                // Add filter dropdowns
                const filterContainer = createFilterDropdowns(serverDetails);
                serverListContainer.parentNode.insertBefore(filterContainer, serverListContainer);

                // Style the server list container
                serverListContainer.style.display = "grid";
                serverListContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
                serverListContainer.style.gap = "0px";

                // compacted code to save some space. still readable tho. for server version labels (New) and (Old)
                const serverVersions = serverDetails.map(d => d.location.placeVersion).filter(v => v != null && v !== 'N/A').map(Number);
                const minVersion = serverVersions.length > 0 ? Math.min(...serverVersions) : null;
                const maxVersion = serverVersions.length > 0 ? Math.max(...serverVersions) : null;

                const displayFilteredServers = (country, city, version) => {
                    serverListContainer.innerHTML = "";

                    const filteredServers = filterServers(serverDetails, country, city, version);
                    const sortedServers = filteredServers.sort((a, b) => {
                        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.location.latitude, a.location.longitude);
                        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.location.latitude, b.location.longitude);
                        return distanceA - distanceB;
                    });

                    //create server cards immediately
                    sortedServers.forEach(({
                        server,
                        location
                    }) => {
                        const serverCard = document.createElement("li");
                        serverCard.className = "rbx-game-server-item col-md-3 col-sm-4 col-xs-6";
                        serverCard.style.width = "100%";
                        serverCard.style.minHeight = "400px";
                        serverCard.style.display = "flex";
                        serverCard.style.flexDirection = "column";
                        serverCard.style.justifyContent = "space-between";
                        serverCard.style.boxSizing = "border-box";
                        serverCard.style.outline = 'none';

                        serverCard.setAttribute('data-server-id', server.id);

                        // Create ping label
                        const pingLabel = document.createElement("div");
                        pingLabel.style.marginBottom = "8px";
                        pingLabel.style.padding = "8px 12px";
                        pingLabel.style.borderRadius = "8px";
                        pingLabel.style.fontWeight = "bold";
                        pingLabel.style.textAlign = "center";
                        pingLabel.style.fontSize = "13px !important";
                        pingLabel.style.textTransform = "uppercase !important";
                        pingLabel.style.letterSpacing = "0.5px !important";

                        // calculate distance and ping
                        const distance = calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            location.latitude,
                            location.longitude
                        );

                        // formula derived from regression of 382 data points. restricted domain of distance >= 0
                        // distance is km
                        const calculatedPing = 2.05816 * Math.sqrt((1/0.700042) * (Math.max(distance,0) + 2479.47383)) - 72.29266;


                        if (Math.max(distance, 0) < 1250) {
                            pingLabel.textContent = "⚡ Fast";
                            pingLabel.style.backgroundColor = "#1a4a3a";
                            pingLabel.style.color = "#4ade80";
                            pingLabel.style.border = "1px solid #22c55e";
                        } else if (Math.max(distance, 0) < 5000) {
                            pingLabel.textContent = "⏳ OK";
                            pingLabel.style.backgroundColor = "#4a3a1a";
                            pingLabel.style.color = "#fbbf24";
                            pingLabel.style.border = "1px solid #f59e0b";
                        } else {
                            pingLabel.textContent = "🐌 Slow";
                            pingLabel.style.backgroundColor = "#4a1a1a";
                            pingLabel.style.color = "#f87171";
                            pingLabel.style.border = "1px solid #ef4444";
                        }

                        // create thumbnails
                        let thumbnailsContainer;
                        const cachedThumbnails = thumbnailCache.get(server.id);
                        if (cachedThumbnails && cachedThumbnails !== 'loading') {
                            thumbnailsContainer = createThumbnailContainer(cachedThumbnails, server.maxPlayers, server.playing, false);
                        } else {
                            thumbnailsContainer = createThumbnailContainer(null, server.maxPlayers, server.playing, true);
                        }

                        // calculate server health
                        const healthPercentage = Math.min(100, Math.round((server.fps / 60) * 100));
                        let healthBg, healthIcon;
                        if (healthPercentage >= 90) {
                            healthBg = '#1a4a3a';
                            healthIcon = '🟢';
                        } else if (healthPercentage >= 80) {
                            healthBg = '#4a3a1a';
                            healthIcon = '🟡';
                        } else if (healthPercentage >= 70) {
                            healthBg = '#4a2a1a';
                            healthIcon = '🟠';
                        } else {
                            healthBg = '#4a1a1a'; // yea bad server
                            healthIcon = '🔴';
                        }

                        const cardItem = document.createElement("div");
                        cardItem.className = "card-item";
                        cardItem.style.display = "flex";
                        cardItem.style.flexDirection = "column";
                        cardItem.style.justifyContent = "space-between";
                        cardItem.style.height = "100%";
                        cardItem.style.color = "#e5e5e5";

                        const versionDisplay = location.placeVersion && location.placeVersion !== 'N/A'
                            ? (location.placeVersion === latestPublishedVersion
                                ? `${location.placeVersion} <span style="display: inline-block; background: rgba(34, 197, 94, 0.12); color: #22c55e; font-weight: 600; font-size: 10px; padding: 3px 10px; border-radius: 6px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.8px; border: 1px solid rgba(34, 197, 94, 0.25);">NEW</span>`
                                : location.placeVersion === minVersion
                                    ? `${location.placeVersion} <span style="display: inline-block; background: rgba(239, 68, 68, 0.12); color: #ef4444; font-weight: 600; font-size: 10px; padding: 3px 10px; border-radius: 6px; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.8px; border: 1px solid rgba(239, 68, 68, 0.25);">OLD</span>`
                                    : location.placeVersion)
                            : 'N/A';

                        cardItem.innerHTML = `
                        ${thumbnailsContainer.outerHTML}
                        <div class="rbx-game-server-details game-server-details" style="margin-top: 12px;">
                            <div class="text-info rbx-game-status rbx-game-server-status text-overflow" style="color: #b3b3b3; font-size: 16px; margin-bottom: 8px; text-align: center;">
                                ${server.playing} of ${server.maxPlayers} people max
                            </div>
                            <div class="server-player-count-gauge border" style="background: #1a1a1a; border: 1px solid #404040; border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: 12px;">
                                <div class="gauge-inner-bar border" style="background: linear-gradient(90deg, #bcbec8, #bcbec8); height: 100%; border: none; transition: width 0.3s ease; width: ${(server.playing / server.maxPlayers) * 100}%;"></div>
                            </div>
                            <span data-placeid="${gameId}">
                                <button type="button" class="btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width" style="background: #404040; border: 1px solid #555555; color: #e5e5e5; border-radius: 8px; padding: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; width: 100%; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px;">Join</button>
                            </span>
                        </div>
                            <div style="margin-top: 12px; text-align: center; color: #b3b3b3;">
                                ${pingLabel.outerHTML}
                                <div style="margin-top: 10px; background: #1f1f1f; border-radius: 8px; padding: 12px; border: 1px solid #333333;">
                                    <div style="margin-bottom: 6px; font-size: 14px; color: #888888;">
                                        <span style="color: #e5e5e5; font-weight: 600;">Estimated Ping:</span> ${calculatedPing.toFixed(1)}ms
                                    </div>
                                    <hr style="margin: 6px 0; border: none; height: 1px; background: #333333;">
                                    <div style="margin-bottom: 6px; font-size: 14px; color: #888888;">
                                        <span style="color: #e5e5e5; font-weight: 600;">Distance:</span> ${distance.toFixed(1)}km
                                    </div>
                                    <hr style="margin: 6px 0; border: none; height: 1px; background: #333333;">
                                    <div style="margin-bottom: 6px; font-size: 14px; color: #888888;">
                                        <span style="color: #e5e5e5; font-weight: 600;">Location:</span> ${location.city}, ${location.country.name}
                                    </div>
                                    <hr style="margin: 6px 0; border: none; height: 1px; background: #333333;">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                                        <span style="color: #e5e5e5; font-weight: 600; font-size: 14px;">Server Health:</span>
                                        <div style="display: flex; align-items: center; gap: 4px; background: ${healthBg}; padding: 3px 8px; border-radius: 6px;">
                                            <span style="font-size: 12px;">${healthIcon}</span>
                                            <span style="font-weight: 700; font-size: 13px;">${healthPercentage}%</span>
                                        </div>
                                    </div>
                                    <hr style="margin: 6px 0; border: none; height: 1px; background: #333333;">
                                    <div style="margin-bottom: 6px; font-size: 14px; color: #888888;">
                                            <span style="color: #e5e5e5; font-weight: 600;">Version:</span> ${versionDisplay}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;

                        const joinButton = cardItem.querySelector(".rbx-game-server-join");
                        joinButton.addEventListener('mouseenter', () => {
                            joinButton.style.background = '#4a4a4a';
                            joinButton.style.borderColor = '#666666';
                            joinButton.style.transform = 'translateY(-1px)';
                        });
                        joinButton.addEventListener('mouseleave', () => {
                            joinButton.style.background = '#404040';
                            joinButton.style.borderColor = '#555555';
                            joinButton.style.transform = 'translateY(0)';
                        });

                        joinButton.addEventListener("click", () => {
                            ConsoleLogEnabled(`Roblox.GameLauncher.joinGameInstance(${gameId}, "${server.id}")`); // not anymore
                            JoinServer(gameId, server.id);
                        });

                        const container = adjustJoinButtonContainer(joinButton);
                        const inviteButton = createInviteButton(gameId, server.id);

                        inviteButton.style.background = '#404040';
                        inviteButton.style.border = '1px solid #555555';
                        inviteButton.style.color = '#e5e5e5';
                        inviteButton.style.borderRadius = '8px';
                        inviteButton.style.fontWeight = '600';
                        inviteButton.style.transition = 'all 0.2s ease';
                        inviteButton.style.textTransform = 'uppercase';
                        inviteButton.style.letterSpacing = '0.5px';
                        inviteButton.style.fontSize = '12px';

                        inviteButton.addEventListener('mouseenter', () => {
                            inviteButton.style.background = '#4a4a4a';
                            inviteButton.style.borderColor = '#666666';
                            inviteButton.style.transform = 'translateY(-1px)';
                        });
                        inviteButton.addEventListener('mouseleave', () => {
                            inviteButton.style.background = '#404040';
                            inviteButton.style.borderColor = '#555555';
                            inviteButton.style.transform = 'translateY(0)';
                        });

                        container.appendChild(inviteButton);

                        serverCard.appendChild(cardItem);
                        serverListContainer.appendChild(serverCard);

                      // load real thumbnails in background if not cached and not already being fetched
                      // added another condition so that finding thumbnails only occurs if mobilemode = false. This is a performance upgrade for mobile users.
                      if (server.playerTokens && server.playerTokens.length > 0 && !thumbnailCache.has(server.id) && localStorage.ROLOCATE_mobilemode === "false") {
                          // mark as being fetched to prevent duplicate requests
                          thumbnailCache.set(server.id, 'loading');
                          fetchPlayerThumbnails_servers(server.playerTokens)
                              .then(thumbnails => {
                                  thumbnailCache.set(server.id, thumbnails);
                                  updateServerCardThumbnails(server.id, thumbnails, server.maxPlayers, server.playing);
                              })
                              .catch(error => {
                                  ConsoleLogEnabled(`Failed to load thumbnails for server ${server.id}:`, error);
                                  // remove the 'loading' marker on error so it can be retried
                                  thumbnailCache.delete(server.id);
                          });
                      }
                    });
                };

                // Add event listeners to dropdowns
                const countryFilter = document.getElementById('countryFilter');
                const cityFilter = document.getElementById('cityFilter');
                const versionFilter = document.getElementById('versionFilter');

                countryFilter.addEventListener('change', () => {
                    displayFilteredServers(countryFilter.value, cityFilter.value, versionFilter.value);
                });

                cityFilter.addEventListener('change', () => {
                    displayFilteredServers(countryFilter.value, cityFilter.value, versionFilter.value);
                });

                versionFilter.addEventListener('change', () => {
                    displayFilteredServers(countryFilter.value, cityFilter.value, versionFilter.value);
                });

                // countries cities and versions
                displayFilteredServers("", "", "");

            } catch (error) {
                if (error === 'purchase_required') {
                    if (premium_message) {
                        premium_message.textContent = "Error: Cannot access server regions because you have not purchased the game.";
                    }
                    notifications('Error: Cannot access server regions because you have not purchased the game.', 'error', '⚠️', '15000');
                    Loadingbar(false);
                    return;
                } else if (error === 'subplace_join_restriction') {
                    if (premium_message) {
                        premium_message.textContent = "Error: This game requires users to teleport to a subplace. As a result, server regions cannot be retrieved.";
                    }
                    notifications('Error: This game requires users to teleport to a subplace. As a result, server regions cannot be retrieved.', 'error', '⚠️', '15000');
                    Loadingbar(false);
                    return;
                } else if (error === 'banned_by_creator') {
                    if (premium_message) {
                        premium_message.textContent = "Error: Cannot access server regions because the creator has banned you from the game.";
                    }
                    notifications('Error: Cannot access server regions because the creator has banned you from the game.', 'error', '⚠️', '15000');
                    Loadingbar(false);
                    return;
                } else {
                    ConsoleLogEnabled("Error rebuilding server list:", error);
                    notifications('Filtering Error: Failed to obtain permission to send API requests to the Roblox API. Please allow the script to enable request sending.', 'error', '⚠️ ', '8000');
                    if (premium_message) {
                        premium_message.textContent = "Filtering Error: Failed to obtain permission to send API requests to the Roblox API. Please allow the script to enable request sending.";
                    }
                    Loadingbar(false);
                }
            } finally {
                Loadingbar(false);
                disableFilterButton(false);
            }
        }

        // game id remains the same
        const gameId = /^https:\/\/www\.roblox\.com(\/[a-z]{2})?\/games\//.test(window.location.href) ? (window.location.href.match(/\/games\/(\d+)/) || [])[1] || null : null;
        /*******************************************************
        name of function: createInviteButton
        description: Creates the invite button (server region)
        *******************************************************/
        function createInviteButton(placeId, serverId) {
            const inviteButton = document.createElement('button');
            inviteButton.textContent = 'Invite';
            inviteButton.className = 'btn-control-xs btn-primary-md btn-min-width btn-full-width';
            inviteButton.style.width = '25%';
            inviteButton.style.marginLeft = '5px';

            inviteButton.style.padding = '4px 8px';
            inviteButton.style.fontSize = '12px';
            inviteButton.style.borderRadius = '8px';
            inviteButton.style.backgroundColor = '#3b3e49';
            inviteButton.style.borderColor = '#3b3e49';
            inviteButton.style.color = '#ffffff';
            inviteButton.style.cursor = 'pointer';
            inviteButton.style.fontWeight = '500';
            inviteButton.style.textAlign = 'center';
            inviteButton.style.whiteSpace = 'nowrap';
            inviteButton.style.verticalAlign = 'middle';
            inviteButton.style.lineHeight = '100%';
            inviteButton.style.fontFamily = 'Builder Sans, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
            inviteButton.style.textRendering = 'auto';
            inviteButton.style.webkitFontSmoothing = 'antialiased';
            inviteButton.style.mozOsxFontSmoothing = 'grayscale';

            let resetTextTimeout = null;

            inviteButton.addEventListener('click', () => {
                const inviteLink = `https://oqarshi.github.io/Invite/?placeid=${placeId}&serverid=${serverId}`;
                navigator.clipboard.writeText(inviteLink).then(() => {
                    ConsoleLogEnabled(`Invite link copied to clipboard: ${inviteLink}`);
                    notifications('Success! Invite link copied to clipboard!', 'success', '🎉', '2000');

                    // no spam clicks
                    inviteButton.disabled = true;
                    inviteButton.style.opacity = '0.6';
                    inviteButton.style.cursor = 'not-allowed';

                    // reset the timeout
                    if (resetTextTimeout !== null) {
                        clearTimeout(resetTextTimeout);
                    }

                    inviteButton.textContent = 'Copied!';
                    resetTextTimeout = setTimeout(() => {
                        inviteButton.textContent = 'Invite';
                        inviteButton.disabled = false;
                        inviteButton.style.opacity = '1';
                        inviteButton.style.cursor = 'pointer';
                        resetTextTimeout = null;
                    }, 1000);
                }).catch(() => {
                    ConsoleLogEnabled('Failed to copy invite link.');
                    notifications('Error: Failed to copy invite link', 'error', '😔', '2000');
                });
            });

            return inviteButton;
        }


        /*******************************************************
        name of function: adjustJoinButtonContainer
        description: Function to adjust the Join button and its container
                     but it fails lmao and does 50/50 instead of 75/25
        *******************************************************/
        function adjustJoinButtonContainer(joinButton) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.width = '100%';

            joinButton.style.width = '75%';

            joinButton.parentNode.insertBefore(container, joinButton);
            container.appendChild(joinButton);

            return container;
        }




        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 6th button.

        *********************************************************************************************************************************************************************************************************************************************/


        /*******************************************************
        name of function: calculateDistance
        description: finds the distance between two points on a sphere (Earth)
        *******************************************************/

        function calculateDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; // radius of the Earth in kilometers as a perfect sphere but obv its not a perfect sphere but close enough
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLon = (lon2 - lon1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // distance in kilometers
        }


        /*******************************************************
        name of function: resolveOfflineFallbackLocation
        description: estimate user location if user declines
        *******************************************************/
        // fallback location resolver with timezone-based estimation
        function resolveOfflineFallbackLocation(resolve) {
            ConsoleLogEnabled("Attempting offline location estimation...");

            let guessedLocation = null;
            let closestLocation = null;
            let closestDistance = Infinity;

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
            const timezoneMap = {
              "America/Los_Angeles": { lat: 34.0522, lon: -118.2437 },
              "America/Denver": { lat: 39.7392, lon: -104.9903 },
              "America/Chicago": { lat: 41.8781, lon: -87.6298 },
              "America/New_York": { lat: 40.7128, lon: -74.006 },
              "Europe/London": { lat: 51.5074, lon: -0.1278 },
              "Europe/Berlin": { lat: 52.52, lon: 13.405 },
              "Europe/Paris": { lat: 48.8566, lon: 2.3522 },
              "Asia/Tokyo": { lat: 35.6895, lon: 139.6917 },
              "Asia/Kolkata": { lat: 28.6139, lon: 77.209 },
              "Australia/Sydney": { lat: -33.8688, lon: 151.2093 },
              "America/Argentina/Buenos_Aires": { lat: -34.6037, lon: -58.3816 },
              "Africa/Nairobi": { lat: -1.286389, lon: 36.817223 },
              "Asia/Singapore": { lat: 1.3521, lon: 103.8198 },
              "America/Toronto": { lat: 43.65107, lon: -79.347015 },
              "Europe/Moscow": { lat: 55.7558, lon: 37.6173 },
              "Europe/Madrid": { lat: 40.4168, lon: -3.7038 },
              "Asia/Shanghai": { lat: 31.2304, lon: 121.4737 },
              "Africa/Cairo": { lat: 30.0444, lon: 31.2357 },
              "Africa/Johannesburg": { lat: -26.2041, lon: 28.0473 },
              "Europe/Amsterdam": { lat: 52.3676, lon: 4.9041 },
              "Asia/Manila": { lat: 14.5995, lon: 120.9842 },
              "Asia/Seoul": { lat: 37.5665, lon: 126.978 }
            };


            // check if user's timezone in map
            if (timezoneMap[timezone]) {
                guessedLocation = timezoneMap[timezone];
                ConsoleLogEnabled("User's timezone found:", timezone);
            }

            // if no timezone find closest one
            if (!guessedLocation) {
                ConsoleLogEnabled("User's timezone not found. Finding closest match...");
                Object.keys(timezoneMap).forEach((tz) => {
                    const location = timezoneMap[tz];
                    const distance = calculateDistance(location.lat, location.lon, 0, 0); // distance from equator
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestLocation = location;
                    }
                });
                guessedLocation = closestLocation;
            }

            //if location then good, if not then newyork
            if (guessedLocation) {
                notifications("Estimated location based on timezone. Please allow location access to see what servers are closest to you or change to manual in settings.", "info", "🕒", "6000");
                resolve({
                    latitude: guessedLocation.lat,
                    longitude: guessedLocation.lon
                });
            } else {
                notifications("Error: Could not estimate location. Fatal error, please report on Greasyfork. Using default (New York).", "error", "⚠️", "6000");
                resolve({
                    latitude: 40.7128,
                    longitude: -74.0060
                }); // nyc
            }
        }


        /*******************************************************
        name of function: getUserLocation
        description: gets the user's location
        @param {boolean} [quickJoin=false] – when true, operates in lightweight "quick join" mode
        *******************************************************/
        function getUserLocation(quickJoin = false) {
            return new Promise((resolve, reject) => {
                // check priority location setting
                const priorityLocation = localStorage.getItem("ROLOCATE_prioritylocation") || "automatic";

                // if in manual mode, use stored coordinates
                if (priorityLocation === "manual") {
                    try {
                        const coords = JSON.parse(GM_getValue("ROLOCATE_coordinates", '{"lat":"","lng":""}'));
                        if (coords.lat && coords.lng) {
                            ConsoleLogEnabled("Using manual location from storage");
                            notifications("We successfully detected your location.", "success", "🌎", "2000");
                            return resolve({
                                latitude: parseFloat(coords.lat), // changed to match automatic mode
                                longitude: parseFloat(coords.lng), // changed to match automatic mode
                                source: "manual",
                                accuracy: 0 // manual coordinates have no accuracy metric
                            });
                        } else {
                            ConsoleLogEnabled("Manual mode selected but no coordinates set - falling back to automatic behavior");
                            notifications("Manual mode selected but no coordinates set. Fatal error: Report on greasyfork. Using Automatic Mode.", "error", "", "2000");
                            // fall through to automatic behavior
                        }
                    } catch (e) {
                        ConsoleLogEnabled("Error reading manual coordinates:", e);
                        notifications("Error reading manual coordinates. Fatal error: Report on greasyfork. Using Automatic Mode.", "error", "", "2000");
                        // fall through to automatic behavior
                    }
                }

                // automatic mode behavior
                if (!navigator.geolocation) {
                    ConsoleLogEnabled("Geolocation not supported.");
                    notifications("Geolocation is not supported by your browser.", "error", "⚠️", "15000");
                    return resolveOfflineFallbackLocation(resolve);
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => resolveSuccess(position, resolve, quickJoin),
                    async (error) => {
                        ConsoleLogEnabled("Geolocation error:", error);

                        // attempt to inspect geolocation permission state
                        try {
                            if (navigator.permissions && navigator.permissions.query) {
                                const permissionStatus = await navigator.permissions.query({
                                    name: "geolocation"
                                });
                                ConsoleLogEnabled("Geolocation permission status:", permissionStatus.state);

                                if (permissionStatus.state === "denied") {
                                    return resolveOfflineFallbackLocation(resolve);
                                }
                            }
                        } catch (permError) {
                            ConsoleLogEnabled("Permission check failed:", permError);
                        }

                        // retry geolocation once
                        navigator.geolocation.getCurrentPosition(
                            (position) => resolveSuccess(position, resolve, quickJoin),
                            (retryError) => {
                                ConsoleLogEnabled("Second geolocation attempt failed:", retryError);
                                notifications("Could not get your location. Using fallback.", "error", "⚠️", "15000");
                                resolveOfflineFallbackLocation(resolve);
                            }, {
                                maximumAge: 5000,
                                timeout: 10000,
                            }
                        );
                    }, {
                        timeout: 10000,
                        maximumAge: 0,
                    }
                );
            });
        }

        /*******************************************************
        name of function: resolveSuccess
        description: tells the user that location was detected
        @param {GeolocationPosition} position – browser geolocation position
        @param {Function} resolve – promise resolver
        @param {boolean} [quickJoin=false] – when true, skips UI-disabling side‑effects
        *******************************************************/
        function resolveSuccess(position, resolve, quickJoin = false) {
            notifications("We successfully detected your location.", "success", "🌎", "2000");
            if (!quickJoin) {
                disableLoadMoreButton(true);
                disableFilterButton(true);
                Loadingbar(true);
            }
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                source: "geolocation",
                accuracy: position.coords.accuracy
            });
        }



        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 7th button.

        *********************************************************************************************************************************************************************************************************************************************/
        /*******************************************************
        name of function: auto_join_small_server
        description: Automatically joins the smallest server
        *******************************************************/
        async function auto_join_small_server() {
            // disable the "Load More" button and show the loading bar
            Loadingbar(true);
            disableFilterButton(true);
            disableLoadMoreButton();

            // get the game ID from the URL
            const gameId = ((p = window.location.pathname.split('/')) => {
                const i = p.indexOf('games');
                return i !== -1 && p.length > i + 1 ? p[i + 1] : null;
            })();

            // retry mechanism for 429 errors
            let retries = 3; // number of retries
            let success = false;

            while (retries > 0 && !success) {
                try {
                    // fetch server data
                    const data = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `https://games.roblox.com/v1/games/${gameId}/servers/public?sortOrder=1&excludeFullGames=true&limit=25`,
                            onload: function(response) {
                                if (response.status === 429) {
                                    reject('429: Too Many Requests');
                                } else if (response.status >= 200 && response.status < 300) {
                                    resolve(JSON.parse(response.responseText));
                                } else {
                                    reject(`HTTP error: ${response.status}`);
                                }
                            },
                            onerror: function(error) {
                                reject(error);
                            },
                        });
                    });

                    // find servers with low player count, prob doesnet work with bloxfruits cause bots
                    let minPlayers = Infinity;
                    let targetServer = null;

                    for (const server of data.data) {
                        if (server.playing < minPlayers) {
                            minPlayers = server.playing;
                            targetServer = server;
                        }
                    }

                    if (targetServer) {
                        // join the server with the lowest player count
                        JoinServer(gameId, targetServer.id);
                        notifications(`Joining a server with ${targetServer.playing} player(s).`, 'success', '🚀');
                        success = true;
                    } else {
                        notifications('No available servers found.', 'error', '⚠️');
                        break;
                    }
                } catch (error) {
                    if (error === '429: Too Many Requests' && retries > 0) {
                        ConsoleLogEnabled('Rate limited. Retrying in 10 seconds...');
                        notifications('Rate limited. Retrying in 10 seconds...', 'warning', '⏳', '10000');
                        await delay(10000);
                        retries--;
                    } else {
                        ConsoleLogEnabled('Error fetching server data:', error);
                        notifications('Error: Failed to fetch server data. Please try again later.', 'error', '⚠️', '5000');
                        Loadingbar(false);
                        break;
                    }
                }
            }

            Loadingbar(false);
            disableFilterButton(false);
        }
        /*********************************************************************************************************************************************************************************************************************************************
                                                                 Functions for the 8th button. roblox borke it lmao. basically fillter code, might remove it one day

        *********************************************************************************************************************************************************************************************************************************************/


        /*********************************************************************************************************************************************************************************************************************************************
                                                                 End of: This is all the functions for the 8 buttons

        *********************************************************************************************************************************************************************************************************************************************/

        /*******************************************************
        name of function: disableLoadMoreButton
        description: Disables the "Load More" button
        *******************************************************/
        function disableLoadMoreButton() {
            const loadMoreButton = document.querySelector('.rbx-running-games-load-more');
            if (loadMoreButton) {
                loadMoreButton.disabled = true;
                loadMoreButton.style.opacity = '0.5';
                loadMoreButton.style.cursor = 'not-allowed';

                // only add the label if it doesnt already exist
                if (!loadMoreButton.textContent.includes('(Disabled by RoLocate)')) {
                    loadMoreButton.textContent += ' (Disabled by RoLocate)';
                }

                ConsoleLogEnabled('Load More button disabled with text change');
            } else {
                ConsoleLogEnabled('Load More button not found!');
            }
        }


        /*******************************************************
        name of function: Loadingbar
        description: Shows or hides a loading bar (now using pulsing boxes)
        *******************************************************/
        function Loadingbar(disable) {
            const serverListSection = document.querySelector('#rbx-public-running-games');
            const serverCardsContainer = document.querySelector('#rbx-public-game-server-item-container');
            const emptyGameInstancesContainer = document.querySelector('.section-content-off.empty-game-instances-container');
            const noServersMessage = emptyGameInstancesContainer?.querySelector('.no-servers-message');

            // check if the "Unable to load servers." message is visible
            if (!serverCardsContainer && noServersMessage?.textContent.includes('Unable to load servers.')) {
                notifications('Unable to load servers. Please refresh the page.', 'error', '⚠️', '8000');
                return;
            }

            // reset
            if (disable) {
                if (serverCardsContainer) {
                    serverCardsContainer.innerHTML = '';
                    serverCardsContainer.removeAttribute('style');
                }

                // no duplicate ones
                const existingLoadingBar = document.querySelector('#loading-bar');
                if (existingLoadingBar) {
                    existingLoadingBar.remove();
                }

                // create the laoding boxes
                const loadingContainer = document.createElement('div');
                loadingContainer.id = 'loading-bar';
                loadingContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
        `;

                const fragment = document.createDocumentFragment();
                for (let i = 0; i < 3; i++) {
                    const box = document.createElement('div');
                    box.style.cssText = `
                width: 10px;
                height: 10px;
                background-color: white;
                margin: 0 5px;
                border-radius: 2px;
                animation: pulse 1.2s ${i * 0.2}s infinite;
            `;
                    fragment.appendChild(box);
                }
                loadingContainer.appendChild(fragment);

                if (serverListSection) {
                    serverListSection.appendChild(loadingContainer);
                }

                // make thing look good
                const existingStyle = document.querySelector('#loading-style');
                if (!existingStyle) {
                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'loading-style';
                    styleSheet.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.5); }
                }
            `;
                    document.head.appendChild(styleSheet);
                }

                // target by the unique select IDs that are created in the component
                const countryFilter_remove = document.getElementById('countryFilter');
                const cityFilter_remove = document.getElementById('cityFilter');
                const versionFilter_remove = document.getElementById('versionFilter');

                // find the dumb container
                let outerDiv = null;
                if (countryFilter_remove) {
                    outerDiv = countryFilter_remove.closest('div[style*="display: flex"][style*="gap: 16px"]');
                } else if (cityFilter_remove) {
                    outerDiv = cityFilter_remove.closest('div[style*="display: flex"][style*="gap: 16px"]');
                } else if (versionFilter_remove) {
                    outerDiv = versionFilter_remove.closest('div[style*="display: flex"][style*="gap: 16px"]');
                }
                // remove it
                if (outerDiv) {
                    outerDiv.remove();
                }

                // ik this approach sucks but its the best i can do. it remove ths premium messages with this specific
                // text so it doesnet remove the other stuff, you prob cant even understand what im sayin right now
                const premiumMessageDiv = document.querySelector('.premium-message-text');
                if (premiumMessageDiv) {
                    const messageText = premiumMessageDiv.textContent.trim();
                    const errorMessages = [
                        "Error: Cannot access server regions because you have not purchased the game.",
                        "Error: This game requires users to teleport to a subplace. As a result, server regions cannot be retrieved.",
                        "Error: Cannot access server regions because the creator has banned you from the game."
                    ];

                    if (errorMessages.includes(messageText)) {
                        showMessage("END");
                    }
                }

            } else {
                // if disable is false, remove the loading bar
                const loadingBar = document.querySelector('#loading-bar');
                if (loadingBar) {
                    loadingBar.remove();
                }

                // reset any applied styles
                const styleSheet = document.querySelector('#loading-style');
                if (styleSheet) {
                    styleSheet.remove();
                }
            }
        }




        /*******************************************************
        name of function: fetchPlayerThumbnails
        description: Fetches player thumbnails for up to 5 players. Skips the batch if an error occurs.
        *******************************************************/
        async function fetchPlayerThumbnails(playerTokens) {
            const limitedTokens = playerTokens.slice(0, 5);

            const body = limitedTokens.map(token => ({
                requestId: `0:${token}:AvatarHeadshot:150x150:png:regular`,
                type: "AvatarHeadShot",
                targetId: 0,
                token,
                format: "png",
                size: "150x150",
            }));

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://thumbnails.roblox.com/v1/batch",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    data: JSON.stringify(body),
                    onload: function(response) {
                        try {
                            if (response.status >= 200 && response.status < 300) {
                                const data = JSON.parse(response.responseText);
                                resolve(data.data || []);
                            } else {
                                ConsoleLogEnabled(`HTTP error! Status: ${response.status}`);
                                resolve([]);
                            }
                        } catch (error) {
                            ConsoleLogEnabled('Error parsing batch thumbnail response:', error);
                            resolve([]);
                        }
                    },
                    onerror: function(err) {
                        ConsoleLogEnabled('Request error fetching batch thumbnails:', err);
                        resolve([]);
                    }
                });
            });
        }


        /*******************************************************
        name of function: disableFilterButton
        description: Disables or enables the filter button based on the input.
        *******************************************************/
        function disableFilterButton(disable) {
            const filterButton = document.querySelector('.RL-filter-button');
            const refreshButtons = document.querySelectorAll('.btn-more.rbx-refresh.refresh-link-icon.btn-control-xs.btn-min-width');
            const filterOverlayId = 'filter-button-overlay';
            const refreshOverlayClass = 'refresh-button-overlay';

            if (filterButton) {
                const parent = filterButton.parentElement;

                if (disable) {
                    // kill the filter button so it cant be clicked
                    filterButton.disabled = true;
                    filterButton.style.opacity = '0.5';
                    filterButton.style.cursor = 'not-allowed';

                    // an invisible overlay on it so no sneaky clicks
                    let overlay = document.getElementById(filterOverlayId);
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = filterOverlayId;
                        overlay.style.position = 'absolute';
                        overlay.style.top = '-10px';
                        overlay.style.left = '-10px';
                        overlay.style.width = 'calc(100% + 20px)';
                        overlay.style.height = 'calc(100% + 20px)';
                        overlay.style.backgroundColor = 'transparent';
                        overlay.style.zIndex = '9999';
                        overlay.style.pointerEvents = 'all'; // block clicks like a boss
                        parent.style.position = 'relative';
                        parent.appendChild(overlay);
                    }
                } else {
                    // bring the filter button back to life
                    filterButton.disabled = false;
                    filterButton.style.opacity = '1';
                    filterButton.style.cursor = 'pointer';

                    // remove that annoying overlay
                    const overlay = document.getElementById(filterOverlayId);
                    if (overlay) {
                        overlay.remove();
                    }
                }
            } else {
                ConsoleLogEnabled('Filter button not found! Something is wrong!');
                notifications("Something's wrong. Please report an issue on Greasyfork.", "error", "⚠️", "15000");
            }

            if (refreshButtons.length > 0) {
                refreshButtons.forEach((refreshButton) => {
                    const refreshParent = refreshButton.parentElement;

                    if (disable) {
                        // same overlay trick but for refresh buttons
                        let refreshOverlay = refreshParent.querySelector(`.${refreshOverlayClass}`);
                        if (!refreshOverlay) {
                            refreshOverlay = document.createElement('div');
                            refreshOverlay.className = refreshOverlayClass;
                            refreshOverlay.style.position = 'absolute';
                            refreshOverlay.style.top = '-10px';
                            refreshOverlay.style.left = '-10px';
                            refreshOverlay.style.width = 'calc(100% + 20px)';
                            refreshOverlay.style.height = 'calc(100% + 20px)';
                            refreshOverlay.style.backgroundColor = 'transparent';
                            refreshOverlay.style.zIndex = '9999';
                            refreshOverlay.style.pointerEvents = 'all'; // no clicks allowed here either
                            refreshParent.style.position = 'relative';
                            refreshParent.appendChild(refreshOverlay);
                        }
                    } else {
                        // remove overlays and let buttons live again
                        const refreshOverlay = refreshParent.querySelector(`.${refreshOverlayClass}`);
                        if (refreshOverlay) {
                            refreshOverlay.remove();
                        }
                    }
                });
            } else {
                ConsoleLogEnabled('Refresh button not found!');
                notifications("Something's wrong. Please report an issue on Greasyfork.", "error", "⚠️", "15000");
            }
        }

        /*******************************************************
        name of function: rbx_card
        description: Creates the roblox cards that are not from server regions
        *******************************************************/
        async function rbx_card(serverId, playerTokens, maxPlayers, playing, gameId) {
            const thumbnails = await fetchPlayerThumbnails(playerTokens);

            // helper function to create elements with properties
            const createElement = (tag, props = {}, styles = {}) => {
                const el = document.createElement(tag);
                Object.assign(el, props);
                Object.assign(el.style, styles);
                return el;
            };

            const cardItem = createElement('li', { className: 'rbx-game-server-item col-md-3 col-sm-4 col-xs-6' });
            const playerThumbnailsContainer = createElement('div', { className: 'player-thumbnails-container' });

            // add player thumbnails
            thumbnails.forEach(thumbnail => {
                const playerAvatar = createElement('span', { className: 'avatar avatar-headshot-md player-avatar' });
                const thumbnailImage = createElement('span', { className: 'thumbnail-2d-container avatar-card-image' });
                const img = createElement('img', { src: thumbnail.imageUrl, alt: '', title: '' });

                thumbnailImage.appendChild(img);
                playerAvatar.appendChild(thumbnailImage);
                playerThumbnailsContainer.appendChild(playerAvatar);
            });

            // add placeholder for remaining players
            if (playing > 5) {
                const placeholder = createElement('span', {
                    className: 'avatar avatar-headshot-md player-avatar hidden-players-placeholder',
                    textContent: `+${playing - 5}`
                }, {
                    backgroundColor: '#6a6f81', color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                    fontSize: '16px', width: '60px', height: '60px'
                });
                playerThumbnailsContainer.appendChild(placeholder);
            }

            // server details
            const serverDetails = createElement('div', { className: 'rbx-game-server-details game-server-details' });
            const serverStatus = createElement('div', {
                className: 'text-info rbx-game-status rbx-game-server-status text-overflow',
                textContent: `${playing} of ${maxPlayers} people max`
            });

            // player count gauge
            const gaugeContainer = createElement('div', { className: 'server-player-count-gauge border' });
            const gaugeInner = createElement('div', { className: 'gauge-inner-bar border' }, {
                width: `${(playing / maxPlayers) * 100}%`
            });
            gaugeContainer.appendChild(gaugeInner);

            // button container with buttons
            const buttonContainer = createElement('div', { className: 'button-container' }, {
                display: 'flex', gap: '8px'
            });

            // join button
            const joinButton = createElement('button', {
                type: 'button',
                className: 'btn-full-width btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width',
                textContent: 'Join',
                onclick: () => JoinServer(gameId, serverId)
            });

            // invite button
            const inviteButton = createElement('button', {
                type: 'button',
                className: 'btn-full-width btn-control-xs rbx-game-server-invite game-server-invite-btn btn-secondary-md btn-min-width',
                textContent: 'Invite'
            });

            inviteButton.onclick = async () => {
                const inviteLink = `https://oqarshi.github.io/Invite/?placeid=${gameId}&serverid=${serverId}`;
                ConsoleLogEnabled('Copied invite link:', inviteLink);

                try {
                    await navigator.clipboard.writeText(inviteLink);
                    notifications('Success! Invite link copied to clipboard!', 'success', '🎉', '2000');
                    ConsoleLogEnabled('Invite link copied to clipboard');

                    const originalText = inviteButton.textContent;
                    inviteButton.textContent = 'Copied!';
                    inviteButton.disabled = true;
                    setTimeout(() => {
                        inviteButton.textContent = originalText;
                        inviteButton.disabled = false;
                    }, 1000);
                } catch (err) {
                    ConsoleLogEnabled('Failed to copy invite link:', err);
                    notifications('Failed! Invite link copied to clipboard!', 'error', '⚠️', '2000');
                }
            };

            // uh create the stuff
            buttonContainer.append(joinButton, inviteButton);
            serverDetails.append(serverStatus, gaugeContainer, buttonContainer);

            const cardContainer = createElement('div', { className: 'card-item' });
            cardContainer.append(playerThumbnailsContainer, serverDetails);
            cardItem.appendChild(cardContainer);

            document.querySelector('#rbx-public-game-server-item-container').appendChild(cardItem);
        }

        /*******************************************************
        name of function: showLoadingOverlay
        description: Loading box when joining a server + Shows server location
        *******************************************************/
        // WARNING: Do not republish this script. Licensed for personal use only.
        async function showLoadingOverlay(gameId, serverId, mainMessage = "", statusMessage = "") {
            // remove existing overlay if present
            const existingOverlay = document.querySelector('[data-loading-overlay]');
            if (existingOverlay) {
                existingOverlay.style.opacity = '0';
                existingOverlay.querySelector('div').style.transform = 'translate(-50%, -55%) scale(0.9)';
                setTimeout(() => existingOverlay.remove(), 400);
            }

            // remove existing styles
            const existingStyle = document.querySelector('[data-loading-overlay-style]');
            if (existingStyle) existingStyle.remove();

            // function to create elements with styles
            const createElement = (tag, styles, content = '') => {
                const el = document.createElement(tag);
                Object.assign(el.style, styles);
                if (content) el.innerHTML = content;
                return el;
            };

            // function for common gradient background
            const gradientBg = (color1, color2) => `linear-gradient(145deg, ${color1}, ${color2})`;

            const style = createElement('style', {}, `
                @keyframes loading-slide {
                    0% { transform: translateX(-100%); background-position: 0% 50%; }
                    100% { transform: translateX(250%); background-position: 100% 50%; }
                }
                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.7; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes dots {
                    0%, 20% { content: ''; }
                    40% { content: '.'; }
                    60% { content: '..'; }
                    80%, 100% { content: '...'; }
                }
            `);
            style.setAttribute('data-loading-overlay-style', '');
            document.head.appendChild(style);

            // the main stuff
            const overlay = createElement('div', {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                zIndex: '999999',
                opacity: '0',
                transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            });
            overlay.setAttribute('data-loading-overlay', '');

            // other main stuff
            const container = createElement('div', {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -55%) scale(0.9)',
                width: '534px',
                height: '380px',
                background: gradientBg('#1e1e1e', '#161616'),
                borderRadius: '22px',
                boxShadow: '0 18px 55px rgba(0, 0, 0, 0.5), 0 7px 23px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                flexDirection: 'column',
                padding: '33px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                zIndex: '1000000',
                opacity: '0',
                transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            });

            // exit button
            const exitButton = createElement('button', {
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '33px',
                height: '33px',
                borderRadius: '11px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: gradientBg('#2a2a2a', '#1f1f1f'),
                color: '#a0a0a0',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 7px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                outline: 'none'
            }, '✕');

            // exit button handelrs
            const exitButtonHover = (enter) => {
                exitButton.style.background = enter ? gradientBg('#333333', '#262626') : gradientBg('#2a2a2a', '#1f1f1f');
                exitButton.style.color = enter ? '#ffffff' : '#a0a0a0';
                exitButton.style.transform = enter ? 'scale(1.05)' : 'scale(1)';
                exitButton.style.boxShadow = enter ?
                    '0 4px 11px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)' :
                    '0 2px 7px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            };

            exitButton.addEventListener('mouseenter', () => exitButtonHover(true));
            exitButton.addEventListener('mouseleave', () => exitButtonHover(false));
            exitButton.addEventListener('mousedown', () => exitButton.style.transform = 'scale(0.95)');
            exitButton.addEventListener('mouseup', () => exitButton.style.transform = 'scale(1.05)');

            // top section
            const topSection = createElement('div', {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '26px'
            });

            // icon
            const iconContainer = createElement('div', {
                width: '77px',
                height: '77px',
                borderRadius: '18px',
                background: gradientBg('#2a2a2a', '#1f1f1f'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '22px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                overflow: 'hidden',
                flexShrink: '0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            });

            // the logo
            const defaultLogo = createElement('div', {
                width: '40px',
                height: '40px',
                borderRadius: '11px',
                background: gradientBg('#404040', '#333333'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                animation: 'pulse-glow 2s ease-in-out infinite'
            }, `<img src="${window.Base64Images.logo}" alt="Logo" width="80" height="80">`);

            // the game icon
            const gameIcon = createElement('img', {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '18px',
                display: 'none',
                transition: 'opacity 0.3s ease'
            });

            iconContainer.appendChild(defaultLogo);
            iconContainer.appendChild(gameIcon);

            // other stuff
            const textContainer = createElement('div', {
                flex: '1',
                display: 'flex',
                flexDirection: 'column'
            });

            // main loading text
            const isServerHopping = !gameId || !serverId;
            const loadingText = createElement('div', {
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff, #e5e5e5)',
                webkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '6px',
                letterSpacing: '-0.03em',
                lineHeight: '1.2'
            }, mainMessage || (isServerHopping ? 'Server Hopping' : 'Joining Roblox Game'));

            // animated dots
            const dotsSpan = createElement('span', {
                animation: 'dots 1.5s steps(4, end) infinite'
            });
            loadingText.appendChild(dotsSpan);

            // status
            const statusText = createElement('div', {
                fontSize: '14px',
                color: '#a0a0a0',
                lineHeight: '1.4',
                fontWeight: '500',
                marginBottom: '12px'
            }, statusMessage || (isServerHopping ? 'Picking a random server...' : 'Please wait while we connect you'));

            textContainer.appendChild(loadingText);
            textContainer.appendChild(statusText);
            topSection.appendChild(iconContainer);
            topSection.appendChild(textContainer);

            // location
            const locationSection = createElement('div', {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                padding: '18px',
                background: gradientBg('#282828', '#202020'),
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '60px',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden'
            });

            // background stuff
            const pattern = createElement('div', {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                opacity: '0.03',
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '18px 18px'
            });
            locationSection.appendChild(pattern);

            // location
            const locationContent = createElement('div', {
                textAlign: 'center',
                opacity: '0',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                transform: 'translateY(10px)',
                zIndex: '1',
                position: 'relative'
            });

            const locationDisplay = createElement('div', {
                fontSize: '17px',
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '4px',
                letterSpacing: '-0.01em'
            });

            const locationSubtext = createElement('div', {
                fontSize: '12px',
                color: '#999999',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            });

            locationContent.appendChild(locationDisplay);
            locationContent.appendChild(locationSubtext);
            locationSection.appendChild(locationContent);

            // server details
            const serverDetailsContainer = createElement('div', {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                padding: '12px 16px',
                background: gradientBg('#262626', '#1e1e1e'),
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                opacity: '0',
                transition: 'opacity 0.4s ease 0.2s',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)'
            });

            // function to create ID displays
            const createIdDisplay = (label, value, color) => {
                const container = createElement('div', {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    flex: '1',
                    minWidth: '0'
                });

                const labelSpan = createElement('span', {
                    fontSize: '9px',
                    color: '#888888',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    flexShrink: '0'
                }, label);

                const valueSpan = createElement('span', {
                    fontSize: '11px',
                    color: color,
                    fontWeight: '600',
                    fontFamily: 'Monaco, Consolas, monospace',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: '0',
                    flex: '1'
                }, value || 'N/A');

                container.appendChild(labelSpan);
                container.appendChild(valueSpan);
                return container;
            };

            serverDetailsContainer.appendChild(createIdDisplay('Game', gameId, '#60a5fa'));
            serverDetailsContainer.appendChild(createIdDisplay('Server', serverId, '#34d399'));

            // loading
            const loadingBarContainer = createElement('div', {
                width: '100%',
                height: '7px',
                backgroundColor: '#2a2a2a',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '12px',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            });

            // loading bar
            const loadingBar = createElement('div', {
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6)',
                backgroundSize: '300% 100%',
                borderRadius: '4px',
                animation: 'loading-slide 2s ease-in-out infinite',
                width: '60%',
                boxShadow: '0 0 11px rgba(96, 165, 250, 0.4)'
            });

            loadingBarContainer.appendChild(loadingBar);

            // the rolocate stuff
            const brandingSection = createElement('div', {
                textAlign: 'center',
                marginTop: 'auto',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            });

            const brandingText = createElement('div', {
                fontSize: '11px',
                color: '#666666',
                fontWeight: '600',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                opacity: '0.7',
                transition: 'opacity 0.2s ease, color 0.2s ease'
            }, 'RoLocate by Oqarshi');

            brandingText.addEventListener('mouseenter', () => {
                brandingText.style.opacity = '1';
                brandingText.style.color = '#888888';
            });

            brandingText.addEventListener('mouseleave', () => {
                brandingText.style.opacity = '0.7';
                brandingText.style.color = '#666666';
            });

            brandingSection.appendChild(brandingText);

            container.appendChild(exitButton);
            container.appendChild(topSection);
            container.appendChild(locationSection);
            container.appendChild(serverDetailsContainer);
            container.appendChild(loadingBarContainer);
            container.appendChild(brandingSection);
            overlay.appendChild(container);
            document.body.appendChild(overlay);

            // aniamtion
            setTimeout(() => {
                overlay.style.opacity = '1';
                container.style.opacity = '1';
                container.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);

            setTimeout(() => serverDetailsContainer.style.opacity = '1', 300);

            // hover effects
            const iconHover = (enter) => {
                iconContainer.style.transform = enter ? 'scale(1.05)' : 'scale(1)';
                iconContainer.style.boxShadow = enter ?
                    '0 7px 23px rgba(0, 0, 0, 0.4), 0 0 18px rgba(96, 165, 250, 0.2)' :
                    '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            };

            iconContainer.addEventListener('mouseenter', () => iconHover(true));
            iconContainer.addEventListener('mouseleave', () => iconHover(false));

            // fetch game icons
            if (gameId) {
                getUniverseIdFromPlaceId(gameId)
                    .then(universeId => getGameIconFromUniverseId(universeId))
                    .then(iconUrl => {
                        gameIcon.src = iconUrl;
                        gameIcon.onload = () => {
                            defaultLogo.style.opacity = '0';
                            setTimeout(() => {
                                defaultLogo.style.display = 'none';
                                gameIcon.style.display = 'block';
                                gameIcon.style.opacity = '1';
                            }, 200);
                        };
                        gameIcon.onerror = () => ConsoleLogEnabled('Failed to load game icon, using default');
                    })
                    .catch(error => ConsoleLogEnabled('Error fetching game icon:', error));
            }

            // server location detector thing
            (async () => {
                statusText.textContent = statusMessage || (isServerHopping ? 'Finding available server...' : 'Locating server location...');

                await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    if (isServerHopping) {
                        locationDisplay.innerHTML = '🌍 Joining Roblox Game';
                        locationSubtext.textContent = 'Joining Game';
                        statusText.textContent = statusMessage || 'Connecting to random server...';
                    } else {
                        const locationData = await fetchServerDetails(gameId, serverId);
                        const flagEmoji = getFlagEmoji(locationData.country.code);
                        locationDisplay.innerHTML = '';
                        locationDisplay.appendChild(flagEmoji);
                        locationDisplay.append(` ${locationData.city}, ${locationData.country.name}`);
                        locationSubtext.textContent = 'Server Located';
                        statusText.innerHTML = statusMessage || `Connecting to <strong style="color: #60a5fa; font-weight: 600;">${locationData.city}</strong> server`;
                    }
                } catch (error) {
                    ConsoleLogEnabled('Error fetching server location:', error);
                    locationDisplay.innerHTML = isServerHopping ? '🌍 Random Server' : '🌍 Unknown Server Location';
                    locationSubtext.textContent = isServerHopping ? 'SERVER HOPPING' : 'JOINING FULL/RESTRICTED SERVER';
                    statusText.textContent = statusMessage || (isServerHopping ? 'Connecting to random server...' : 'Joining Server...');
                }

                locationContent.style.opacity = '1';
                locationContent.style.transform = 'translateY(0)';
            })();

            // clean everytihng up
            const cleanup = () => {
                overlay.style.opacity = '0';
                container.style.transform = 'translate(-50%, -55%) scale(0.9)';
                setTimeout(() => {
                    overlay.remove();
                    style.remove();
                }, 400);
            };

            // hide after 6 seconds
            const fadeOutTimer = setTimeout(cleanup, 6000);

            // exit button stuff
            exitButton.addEventListener('click', () => {
                clearTimeout(fadeOutTimer);
                cleanup();
            });
        }
    }
})();