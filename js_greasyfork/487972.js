// ==UserScript==
// @name         Limit Infinite Craft
// @namespace    https://www.tornpaws.uk
// @version      1.0
// @description  Limiting amount of time on infinite craft
// @author       lonerider543
// @match        https://neal.fun/infinite-craft/
// @icon         https://neal.fun/favicons/infinite-craft.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487972/Limit%20Infinite%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/487972/Limit%20Infinite%20Craft.meta.js
// ==/UserScript==

GM_addStyle(`
.timeroverlay {
    opacity: 0.8;
    position: fixed;
    height: 100px;
    width: 200px;
    top: 10px;
    left: 10px;
    right: calc(100% - 210px);
    border-radius: 10px;
    background-color: white;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: #2f2f2f;
    transition: all 1s;
    pointer-events: none;
}
`);

(async function() {
    // Set daily limit
    var limit = 30;

    // Get timeSpent from storage
    var timeSpent = await GM.getValue("timeSpent", 0);

    // Get dates
    var currentDate = new Date();
    var lastDate = await GM.getValue("lastDate", new Date().getTime());

    // Add timer
    document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend", `<div class="timeroverlay"><span class="time"></div>`);
    const timerOverlay = document.querySelector(".timeroverlay");
    const overlayTime = timerOverlay.querySelector(".time");

    // Function to clear screen when limit reached
    function clearScreen() {
        document.querySelector("body").innerHTML = "Daily limit reached!";
    }

    // Check to see if new day has started - then reset timer
    async function dateCheck() {
        // Get current date
        currentDate = new Date();

        if (new Date(lastDate).getDate() != currentDate.getDate()) {
            // If lastDate different to currentDate update lastDate and reset timeSpent
            lastDate = new Date().getTime();
            timeSpent = 0;

            await GM.setValue("lastDate", lastDate);
            await GM.setValue("timeSpent", 0);
        }
    }

    // Check time remaining and clear screen if limit reached
    function timerCheck() {
        let timeLeft = limit*60 - timeSpent;
        if (timeLeft <= 0) clearScreen();
    }

    timerCheck();

    // Format seconds to HH:MM:SS or MM:SS
    function secondsToHms(d) {
        d = Number(d);
        var date = new Date(0);
        date.setSeconds(d);
        var timeString = d > 3600 ? date.toISOString().substring(11, 19) : date.toISOString().substring(14,19);
        return timeString;
    }

    // Tick
    async function timeTick() {
        // Skip if hidden
        if (document.hidden) return;

        // Run date check
        await dateCheck();

        // Run timer check
        timerCheck();

        // Add to timeSpent and calculate timeLeft
        timeSpent += 1;
        let timeLeft = secondsToHms(limit*60-timeSpent);

        // Display timeLeft in overlay
        overlayTime.innerHTML = timeLeft;

        // Save timeSpent in storage
        await GM.setValue("timeSpent", timeSpent);
        await GM.setValue("lastDate", currentDate.getTime());
    }

    // Tick every second
    const timer = setInterval(timeTick, 1000);
})();