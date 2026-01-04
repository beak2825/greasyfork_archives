// ==UserScript==
// @name         Calculate Missed Hours for Classes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically calculates the total hours missed for each class based on attendance records.
// @match        https://stars.bilkent.edu.tr/srs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515086/Calculate%20Missed%20Hours%20for%20Classes.user.js
// @updateURL https://update.greasyfork.org/scripts/515086/Calculate%20Missed%20Hours%20for%20Classes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateMissedHours() {
        const attendanceDivs = document.querySelectorAll(".attendDiv");
        const results = [];

        attendanceDivs.forEach(attendDiv => {
            const className = attendDiv.querySelector("h4")?.innerText.trim() || "Unknown Class";
            const attendanceRows = attendDiv.querySelectorAll("table tr");
            let totalMissedHours = 0;

            attendanceRows.forEach((row, index) => {
                if (index === 0) return;
                const attendanceCell = row.cells[2];
                if (attendanceCell) {
                    const attended = parseInt(attendanceCell.querySelector("b")?.innerText || "0");
                    const total = parseInt(attendanceCell.innerText.split("/")[1].trim());
                    const missed = total - attended;
                    totalMissedHours += missed;
                }
            });

            results.push({ className, totalMissedHours });
        });

        if (results.length > 0) {
            results.forEach(result => {
                console.log(`Class: ${result.className}, Total Hours Missed: ${result.totalMissedHours}`);
                alert(`Class: ${result.className}, Total Hours Missed: ${result.totalMissedHours}`);
            });
        } else {
            console.log("No attendance data found.");
            alert("No attendance data found.");
        }
    }

    // Run the function automatically
    calculateMissedHours();
})();
