// ==UserScript==
// @name         Ultimate Picture-in-Picture Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Automatically enable PIP mode with a smooth transition and a configurable, centered control panel.
// @author       OB_BUFF
// @license      GPL-3.0
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526826/Ultimate%20Picture-in-Picture%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526826/Ultimate%20Picture-in-Picture%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load saved settings or use defaults
    let pipAnimationEnabled = GM_getValue("pipAnimationEnabled", true);
    let notificationEnabled = GM_getValue("notificationEnabled", true);
    let pipThreshold = GM_getValue("pipThreshold", 0.3);
    let pipActive = false;
    const iconUrl = "https://images.sftcdn.net/images/t_app-icon-m/p/e858578e-7424-4b99-a13f-c57cd65f8017/4229007087/pip-it-picture-in-picture-logo";

    // Multi-language support for UI texts
    const messages = {
        "en": {
            "enterPiP": "Page lost focus, video entered Picture-in-Picture mode",
            "exitPiP": "Page is back in focus, exiting Picture-in-Picture mode",
            "pipSettings": "PIP Enhancer Settings",
            "enableAnimation": "Enable Animation",
            "disableAnimation": "Disable Animation",
            "enableNotifications": "Enable Notifications",
            "disableNotifications": "Disable Notifications",
            "pipThreshold": "PIP Trigger Ratio"
        },
        "zh": {
            "enterPiP": "网页失去焦点，视频进入画中画模式",
            "exitPiP": "网页回到前台，退出画中画模式",
            "pipSettings": "画中画增强设置",
            "enableAnimation": "启用动画",
            "disableAnimation": "禁用动画",
            "enableNotifications": "启用通知",
            "disableNotifications": "禁用通知",
            "pipThreshold": "PIP 触发比例"
        },
        "es": {
            "enterPiP": "La página perdió el foco, el video entró en modo PiP",
            "exitPiP": "La página volvió a enfocarse, saliendo del modo PiP",
            "pipSettings": "Configuración de PIP Enhancer",
            "enableAnimation": "Habilitar animación",
            "disableAnimation": "Deshabilitar animación",
            "enableNotifications": "Habilitar notificaciones",
            "disableNotifications": "Deshabilitar notificaciones",
            "pipThreshold": "Proporción de activación de PiP"
        }
    };

    // Detect browser language (default to English)
    const userLang = navigator.language.startsWith("zh") ? "zh" :
        navigator.language.startsWith("es") ? "es" : "en";

    // Save current settings
    function saveSettings() {
        GM_setValue("pipAnimationEnabled", pipAnimationEnabled);
        GM_setValue("notificationEnabled", notificationEnabled);
        GM_setValue("pipThreshold", pipThreshold);
    }

    // Add a single menu command to open the control panel
    GM_registerMenuCommand(messages[userLang].pipSettings, openControlPanel);

    /**
     * Checks if a video meets the PIP criteria:
     * - Playing
     * - Has sound (volume > 0 and not muted)
     * - Covers at least pipThreshold of the screen area
     */
    function isEligibleVideo(video) {
        const rect = video.getBoundingClientRect();
        const screenArea = window.innerWidth * window.innerHeight;
        const videoArea = rect.width * rect.height;
        return (
            !video.paused &&
            video.volume > 0 && !video.muted &&
            (videoArea / screenArea) > pipThreshold
        );
    }

    /**
     * Enters Picture-in-Picture mode.
     */
    async function enterPiP() {
        if (pipActive) return;
        const videos = document.querySelectorAll("video");
        for (let video of videos) {
            if (isEligibleVideo(video)) {
                try {
                    if (pipAnimationEnabled) animatePiP(video);
                    await video.requestPictureInPicture();
                    pipActive = true;
                    if (notificationEnabled) {
                        GM_notification({
                            text: messages[userLang].enterPiP,
                            title: messages[userLang].pipSettings,
                            timeout: 5000,
                            image: iconUrl
                        });
                    }
                } catch (error) {
                    console.error("Unable to enter PIP mode:", error);
                }
                break;
            }
        }
    }

    /**
     * Exits Picture-in-Picture mode.
     */
    function exitPiP() {
        if (!pipActive) return;
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            if (notificationEnabled) {
                GM_notification({
                    text: messages[userLang].exitPiP,
                    title: messages[userLang].pipSettings,
                    timeout: 5000,
                    image: iconUrl
                });
            }
        }
        pipActive = false;
    }

    /**
     * Applies a smooth animation effect to the video element before PIP activation.
     */
    function animatePiP(video) {
        video.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
        video.style.transform = "scale(0.9)";
        video.style.opacity = "0.8";
        setTimeout(() => {
            video.style.transform = "scale(1)";
            video.style.opacity = "1";
        }, 700);
    }

    /**
     * Opens a centered HTML control panel that allows users to configure settings.
     */
    function openControlPanel() {
        // Create panel container
        let panel = document.createElement("div");
        panel.id = "pip-control-panel";
        panel.innerHTML = `
            <div class="pip-panel-inner">
                <h2>${messages[userLang].pipSettings}</h2>
                <div>
                    <label>
                        <input type="checkbox" id="pipAnimationCheckbox">
                        ${messages[userLang].enableAnimation}
                    </label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" id="pipNotificationsCheckbox">
                        ${messages[userLang].enableNotifications}
                    </label>
                </div>
                <div>
                    <label>
                        ${messages[userLang].pipThreshold}:
                        <input type="number" id="pipThresholdInput" value="${pipThreshold}" step="0.1" min="0" max="1">
                    </label>
                </div>
                <button id="pipSaveSettings">Save</button>
                <button id="pipClosePanel">Close</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    // Add some CSS for the control panel using GM_addStyle
    GM_addStyle(`
        #pip-control-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #222;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            width: 300px;
            font-family: sans-serif;
        }
        #pip-control-panel .pip-panel-inner {
            text-align: center;
        }
        #pip-control-panel h2 {
            margin-top: 0;
            font-size: 20px;
        }
        #pip-control-panel label {
            display: block;
            margin: 10px 0;
            font-size: 14px;
        }
        #pip-control-panel input[type="number"] {
            width: 60px;
            margin-left: 5px;
        }
        #pip-control-panel button {
            margin: 10px 5px 0;
            padding: 5px 10px;
            background: #555;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
        }
        #pip-control-panel button:hover {
            background: #666;
        }
    `);

    // Event delegation for the control panel buttons (using event listeners on document)
    document.addEventListener("click", function (e) {
        if (e.target && e.target.id === "pipSaveSettings") {
            // Save the settings from the control panel
            pipAnimationEnabled = document.getElementById("pipAnimationCheckbox").checked;
            notificationEnabled = document.getElementById("pipNotificationsCheckbox").checked;
            pipThreshold = parseFloat(document.getElementById("pipThresholdInput").value);
            saveSettings();
            document.getElementById("pip-control-panel").remove();
        }
        if (e.target && e.target.id === "pipClosePanel") {
            document.getElementById("pip-control-panel").remove();
        }
    });

    // When the control panel is opened, pre-check the current settings.
    document.addEventListener("click", function (e) {
        if (e.target && e.target.id === "pip-control-panel") {
            // do nothing here
        }
    });

    // Pre-populate control panel checkboxes when panel is added.
    const observer = new MutationObserver((mutationsList, observer) => {
        const panel = document.getElementById("pip-control-panel");
        if (panel) {
            document.getElementById("pipAnimationCheckbox").checked = pipAnimationEnabled;
            document.getElementById("pipNotificationsCheckbox").checked = notificationEnabled;
        }
    });
    observer.observe(document.body, { childList: true });

    /**
     * Listen for visibility changes to trigger PIP.
     */
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            setTimeout(() => {
                if (document.hidden) enterPiP();
            }, 300);
        } else {
            exitPiP();
        }
    });

    /**
     * Listen for window focus changes.
     */
    window.addEventListener("blur", enterPiP);
    window.addEventListener("focus", exitPiP);

})();
