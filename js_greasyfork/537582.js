// ==UserScript==
// @name         Auto Add Offers
// @namespace    http://yourdomain.com/auto-offers
// @version      1.0
// @description  Automatically clicks offer buttons on supported pages
// @author       Your Name
// @match        https://secure.chase.com/web/auth/dashboard#/dashboard/merchantOffers/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537582/Auto%20Add%20Offers.user.js
// @updateURL https://update.greasyfork.org/scripts/537582/Auto%20Add%20Offers.meta.js
// ==/UserScript==


(function () {
    const originalUrl = window.location.href;
    let isRunning = false;
    let delayTime = 200; // Default to Fast (1 sec delay)

    // Create floating UI panel
    const panel = document.createElement("div");
    panel.innerHTML = `
        <div id="auto-offers-panel" style="
            position: fixed; bottom: 20px; right: 20px;
            width: 250px; padding: 10px; background: white;
            border: 2px solid #333; border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif; font-size: 14px;
            text-align: center; z-index: 9999;
        ">
            <h3>🛒 Auto Add Offers</h3>
            <p id="status">⏹️ Status: Stopped</p>
            <p id="progress">🔄 Offers Remaining: --</p>
            <p id="timeLeft">⏳ Est. Time Left: --</p>
            <label>⏩ Speed:</label>
            <select id="speed-control">
                <option value="3000">Slow</option>
                <option value="2000">Normal</option>
                <option value="200" selected>Fast</option> <!-- Default set to Fast -->
            </select>
            <br><br>
            <button id="start-btn" style="padding:5px 10px; margin: 5px; cursor:pointer;">▶ Start</button>
            <button id="stop-btn" style="padding:5px 10px; margin: 5px; cursor:pointer;">⏹ Stop</button>
        </div>
    `;
    document.body.appendChild(panel);

    function clickAndReturn(attempts = 0) {
        if (!isRunning) {
            document.getElementById("status").innerText = "⏹️ Status: Stopped";
            return;
        }

        const buttons = document.querySelectorAll('[data-cy="commerce-tile-button"]');

        if (buttons.length > 0) {
            const offersLeft = buttons.length;
            const minTimeSec = ((offersLeft * (delayTime / 2)) / 1000).toFixed(0);
            const maxTimeSec = ((offersLeft * delayTime) / 1000).toFixed(0);

            document.getElementById("progress").innerText = `🔄 Offers Remaining: ${offersLeft}`;
            document.getElementById("timeLeft").innerText = `⏳ Est. Time Left: ${minTimeSec}-${maxTimeSec} sec`;
            document.getElementById("status").innerText = "✅ Status: Running...";

            console.log(`📌 Clicking an offer... (${offersLeft} remaining)`);
            console.log(`⏳ Estimated time left: ${minTimeSec}-${maxTimeSec} seconds`);

            buttons[0].click();

            let backDelay = Math.floor(Math.random() * (delayTime / 2)) + delayTime;
            setTimeout(() => {
                console.log("🔄 Returning to original page...");
                window.location.href = originalUrl;

                let reloadDelay = Math.floor(Math.random() * (delayTime / 2)) + delayTime;
                setTimeout(() => {
                    if (isRunning) {
                        console.log("⏳ Waiting before next click...");
                        clickAndReturn();
                    }
                }, reloadDelay);
            }, backDelay);
        } else {
            if (attempts < 3) {
                console.log(`⚠️ No buttons detected. Retrying (${attempts + 1}/3)...`);
                setTimeout(() => clickAndReturn(attempts + 1), 2000);
            } else {
                console.log("✅ All offers added! (or no more found)");
                document.getElementById("status").innerText = "✅ Status: Completed!";
            }
        }
    }

    document.getElementById("start-btn").addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            clickAndReturn();
        }
    });

    document.getElementById("stop-btn").addEventListener("click", () => {
        isRunning = false;
        document.getElementById("status").innerText = "⏹️ Status: Stopped";
        console.log("⏹️ Auto Add Offers script stopped.");
    });

    document.getElementById("speed-control").addEventListener("change", (event) => {
        delayTime = parseInt(event.target.value);
        console.log(`⏩ Speed changed to: ${event.target.options[event.target.selectedIndex].text}`);
    });

    console.log("🚀 Auto Add Offers script loaded! Use the floating panel to start.");
})();