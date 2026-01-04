// ==UserScript==
// @name         Study Timer
// @namespace    https://github.com/ymhomer/ym_Userscript
// @version      2.0
// @description  Records webpage study time and displays a floating timer window in the upper right corner, with exportable study logs
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516057/Study%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/516057/Study%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the base URL (main page) for logging consistency across multiple tabs of the same site
    const baseUrl = location.origin;

    let timerDisplayed = GM_getValue(baseUrl + "_timerDisplayed", false);
    let timerActive = GM_getValue(baseUrl + "_timerActive", false);
    let startTime = Date.now();
    let elapsed = 0;
    let pauseCount = 0;
    let totalPauseTime = 0;
    let interval;
    let focus = document.hasFocus();
    let pauseStartTime = null;

    // Reset on load to avoid interference from previous records
    GM_setValue(baseUrl + "_startTime", startTime);
    GM_setValue(baseUrl + "_elapsed", elapsed);
    GM_setValue(baseUrl + "_pauseCount", pauseCount);
    GM_setValue(baseUrl + "_totalPauseTime", totalPauseTime);

    // Initialize the timer window
    const timerWindow = document.createElement('div');
    timerWindow.style.position = 'fixed';
    timerWindow.style.top = '10px';
    timerWindow.style.right = '10px';
    timerWindow.style.padding = '10px';
    timerWindow.style.zIndex = '9999';
    timerWindow.style.background = 'rgba(0, 0, 0, 0.8)';
    timerWindow.style.color = '#fff';
    timerWindow.style.borderRadius = '5px';
    timerWindow.style.cursor = 'move';
    timerWindow.style.display = timerDisplayed ? 'block' : 'none';
    timerWindow.innerHTML = `<span id="timeDisplay">00:00:00</span>
                             <button id="toggleTimer" style="margin-left: 5px;">${timerActive ? 'Pause' : 'Start'}</button>
                             <button id="stopTimer" style="margin-left: 5px;">End</button>`;
    document.body.appendChild(timerWindow);

    // Enable dragging of the timer window
    timerWindow.onmousedown = function(e) {
        let shiftX = e.clientX - timerWindow.getBoundingClientRect().left;
        let shiftY = e.clientY - timerWindow.getBoundingClientRect().top;
        document.onmousemove = function(e) {
            timerWindow.style.left = e.pageX - shiftX + 'px';
            timerWindow.style.top = e.pageY - shiftY + 'px';
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            timerWindow.onmouseup = null;
        };
    };

    timerWindow.ondragstart = () => false;

    // Toggle timer state (start/pause)
    function toggleTimer() {
        if (timerActive) {
            // Pause the timer
            clearInterval(interval);
            pauseCount++;
            pauseStartTime = Date.now();
            elapsed += Date.now() - startTime;
            GM_setValue(baseUrl + "_elapsed", elapsed);
            timerWindow.style.background = 'red';
            document.getElementById('toggleTimer').innerText = 'Resume';
        } else {
            // Resume the timer
            if (pauseStartTime) {
                totalPauseTime += Date.now() - pauseStartTime;
                pauseStartTime = null;
            }
            startTime = Date.now();
            timerWindow.style.background = 'rgba(0, 0, 0, 0.8)';
            interval = setInterval(updateTime, 1000);
            document.getElementById('toggleTimer').innerText = 'Pause';
        }
        timerActive = !timerActive;
        GM_setValue(baseUrl + "_timerActive", timerActive);
        GM_setValue(baseUrl + "_pauseCount", pauseCount);
        GM_setValue(baseUrl + "_totalPauseTime", totalPauseTime);
    }

    // Update timer display
    function updateTime() {
        let totalTime = elapsed + (Date.now() - startTime);
        document.getElementById('timeDisplay').innerText = new Date(totalTime).toISOString().substr(11, 8);
    }

    // Stop timer, display dialog with record details, and reset timer to zero
    function stopTimer() {
        clearInterval(interval);
        let currentSessionTime = Date.now() - startTime;
        if (timerActive) elapsed += currentSessionTime;

        // If paused, add the final pause duration
        if (pauseStartTime) {
            totalPauseTime += Date.now() - pauseStartTime;
            pauseStartTime = null;
        }

        let endTime = Date.now();
        let totalElapsed = GM_getValue("total_elapsed", 0) + elapsed;
        GM_setValue("total_elapsed", totalElapsed);

        // Log session by date
        const sessionDate = new Date().toISOString().split("T")[0];
        const history = GM_getValue(baseUrl + "_history", {});
        if (!history[sessionDate]) {
            history[sessionDate] = { sessions: [] };
        }
        history[sessionDate].sessions.push({
            start: new Date(startTime).toLocaleString(),
            end: new Date(endTime).toLocaleString(),
            studyTime: new Date(currentSessionTime).toISOString().substr(11, 8),
            pauseCount,
            totalPauseTime: new Date(totalPauseTime).toISOString().substr(11, 8)
        });
        GM_setValue(baseUrl + "_history", history);

        // Prepare the report with additional details
        const report = `URL: ${baseUrl}\n` +
                       `Start Time: ${new Date(startTime).toLocaleString()}\n` +
                       `End Time: ${new Date(endTime).toLocaleString()}\n` +
                       `Session Study Time: ${new Date(currentSessionTime).toISOString().substr(11, 8)}\n` +
                       `Total Study Time: ${new Date(totalElapsed).toISOString().substr(11, 8)}\n` +
                       `Total Pause Time: ${new Date(totalPauseTime).toISOString().substr(11, 8)}\n` +
                       `Pause Count: ${pauseCount}`;

        // Show the dialog with record details
        showEndDialog(report);

        // Reset timer display to zero and reset variables
        timerActive = false;
        elapsed = 0;
        pauseCount = 0;
        totalPauseTime = 0;
        document.getElementById('timeDisplay').innerText = "00:00:00";
        document.getElementById('toggleTimer').innerText = 'Start';
        timerWindow.style.background = 'rgba(0, 0, 0, 0.8)';
    }

    // Show end dialog with record details
    function showEndDialog(report) {
        const dialog = document.createElement('dialog');
        dialog.style.width = '80%';
        dialog.style.maxWidth = '500px';
        dialog.style.padding = '20px';
        dialog.style.border = '2px solid #888';
        dialog.style.borderRadius = '8px';
        dialog.style.backgroundColor = '#f9f9f9';
        dialog.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';

        let content = `<h2 style="text-align:center; color: #333;">Session Summary</h2><pre style="white-space: pre-wrap; font-size:0.9em; color: #333; padding:10px;">${report}</pre>`;
        content += `<div style="text-align:center; margin-top: 15px;">
                        <button id="exportRecord" style="margin-right:10px; padding:8px 16px; background-color:#333; color:#fff; border:none; border-radius:4px; cursor:pointer;">Export Record</button>
                        <button id="closeDialog" style="padding:8px 16px; background-color:#333; color:#fff; border:none; border-radius:4px; cursor:pointer;">Close</button>
                    </div>`;

        dialog.innerHTML = content;
        document.body.appendChild(dialog);
        dialog.showModal();

        // Export button functionality
        document.getElementById('exportRecord').onclick = () => saveRecord(report);
        // Close button functionality
        document.getElementById('closeDialog').onclick = () => dialog.close();

        dialog.addEventListener('close', () => document.body.removeChild(dialog));
    }

    // Save and export the study record
    function saveRecord(data) {
        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `study_record_${new Date().toISOString().slice(0, 10)}.txt`;
        link.click();
    }

    // Check if window is in focus
    function focusCheck() {
        focus = document.hasFocus();
        if (focus && timerActive) {
            startTime = Date.now();
            interval = setInterval(updateTime, 1000);
        } else if (!focus && timerActive) {
            clearInterval(interval);
            pauseCount++;
            pauseStartTime = Date.now();
            elapsed += Date.now() - startTime;
        }
    }

    // View study history with a styled calendar dialog
    function viewHistory() {
        const history = GM_getValue(baseUrl + "_history", {});
        const dialog = document.createElement('dialog');
        dialog.style.width = '90%';
        dialog.style.maxWidth = '600px';
        dialog.style.padding = '20px';
        dialog.style.border = '2px solid #888';
        dialog.style.borderRadius = '8px';
        dialog.style.backgroundColor = '#f9f9f9';
        dialog.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';

        let content = `<h2 style="text-align:center; color: #333;">Study History for ${baseUrl}</h2><table border="0" style="width:100%; font-size:0.9em; color: #333;">`;
        for (const date in history) {
            const daySessions = history[date].sessions;
            content += `<tr style="background-color:#eee; color:#555;"><td colspan="3" style="padding: 8px;"><strong>${date}</strong></td></tr>`;
            daySessions.forEach((session, index) => {
                content += `<tr><td style="padding: 6px;">Session ${index + 1}</td><td>Start: ${session.start}</td><td>End: ${session.end}</td></tr>`;
                content += `<tr><td colspan="3" style="padding: 6px 8px;">Study Time: ${session.studyTime}, Pauses: ${session.pauseCount}, Total Pause Time: ${session.totalPauseTime}</td></tr>`;
            });
        }
        content += `</table><br/><button id="closeDialog" style="margin-top: 15px; padding: 8px 16px; background-color: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>`;
        dialog.innerHTML = content;

        document.body.appendChild(dialog);
        dialog.showModal();

        document.getElementById('closeDialog').onclick = () => dialog.close();
        dialog.addEventListener('close', () => document.body.removeChild(dialog));
    }

    // Bind events
    document.getElementById('toggleTimer').addEventListener('click', toggleTimer);
    document.getElementById('stopTimer').addEventListener('click', stopTimer);
    window.addEventListener('focus', focusCheck);
    window.addEventListener('blur', focusCheck);

    // Add Tampermonkey menu options
    GM_registerMenuCommand("Toggle Study Timer Display", function() {
        timerDisplayed = !timerDisplayed;
        GM_setValue(baseUrl + "_timerDisplayed", timerDisplayed);
        timerWindow.style.display = timerDisplayed ? 'block' : 'none';
    });
    GM_registerMenuCommand("View Study History", viewHistory);

    // Initialize
    if (timerActive) {
        interval = setInterval(updateTime, 1000);
    }
})();
