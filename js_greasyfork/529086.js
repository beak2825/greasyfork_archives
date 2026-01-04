// ==UserScript==
// @name         Keep Teams available while OS is unlocked
// @namespace    http://pietz.me
// @version      1.0
// @description  Keeps your Microsoft Teams status available while the device is unlocked
// @author       Tim Pietz
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529086/Keep%20Teams%20available%20while%20OS%20is%20unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/529086/Keep%20Teams%20available%20while%20OS%20is%20unlocked.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!('IdleDetector' in window)) {
        console.error("IdleDetector API not supported in this browser.");
        return;
    }

    const simulateKeyPress = key => {
        const target = document.activeElement || document.body;
        const keyProps = {
            key,
            code: `Key${key.toUpperCase()}`,
            bubbles: true,
            cancelable: true,
            composed: true
        };
        const keyDown = new KeyboardEvent("keydown", keyProps);
        const keyUp = new KeyboardEvent("keyup", keyProps);
        target.dispatchEvent(keyDown);
        setTimeout(() => target.dispatchEvent(keyUp), 50);
    };

    let simulationIntervalId = null;

    async function startIdleDetector() {
        const controller = new AbortController();
        const signal = controller.signal;
        const idleDetector = new IdleDetector();

        idleDetector.addEventListener("change", () => {
            console.log(`Idle change: userState=${idleDetector.userState}, screenState=${idleDetector.screenState}`);
            if (idleDetector.screenState === "unlocked") {
                if (!simulationIntervalId) {
                    simulationIntervalId = setInterval(() => simulateKeyPress('F13'), 60 * 1000);
                    console.log("Started key simulation.");
                }
            } else if (simulationIntervalId) {
                clearInterval(simulationIntervalId);
                simulationIntervalId = null;
                console.log("Stopped key simulation (screen locked).");
            }
        });

        await idleDetector.start({ signal });
        console.log("IdleDetector started.");
    }

    function showPermissionButton() {
        const btn = document.createElement("button");
        btn.textContent = "Use system away state";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.left = "50%";
        btn.style.transform = "translateX(-50%)";
        btn.style.zIndex = "9999";
        btn.style.padding = "10px 20px";
        btn.style.backgroundColor = "#0078D7";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        document.body.appendChild(btn);

        btn.addEventListener("click", async () => {
            const permission = await IdleDetector.requestPermission();
            if (permission === "granted") {
                document.body.removeChild(btn);
                try {
                    await startIdleDetector();
                } catch (err) {
                    console.error(err.name, err.message);
                    showPermissionButton();
                }
            } else {
                console.error("Idle detection permission denied on click.");
            }
        });
    }

    (async () => {
        try {
            await startIdleDetector();
        } catch (err) {
            console.error(err.name, err.message);
            showPermissionButton();
        }
    })();
})();
