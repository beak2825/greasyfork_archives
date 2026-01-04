// ==UserScript==
// @name         Gaia Mod Report Extractor (To Clipboard)
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      5.0
// @description  Extracts all NEW/DEQUEUED reports w/ thread & post info, adds a warning if older than 90 days, copies to clipboard.
// @author       kloob
// @grant        GM_setClipboard
// @match        https://www.gaiaonline.com/moddog/report/area/*
// @downloadURL https://update.greasyfork.org/scripts/491660/Gaia%20Mod%20Report%20Extractor%20%28To%20Clipboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491660/Gaia%20Mod%20Report%20Extractor%20%28To%20Clipboard%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Parse "09Jul25 7:49pm" to Date object
    function parseGaiaDate(dateStr) {
        try {
            let [dayMonthYear, time] = dateStr.split(' ');
            let day = parseInt(dayMonthYear.slice(0,2));
            let monthStr = dayMonthYear.slice(2,5);
            let yearShort = parseInt(dayMonthYear.slice(5));
            let monthMap = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
            let month = monthMap[monthStr];
            let year = 2000 + yearShort;

            let dateObj = new Date(year, month, day);

            let timeMatch = time.match(/(\d+):(\d+)(am|pm)/);
            if (timeMatch) {
                let hour = parseInt(timeMatch[1]);
                let minute = parseInt(timeMatch[2]);
                let ampm = timeMatch[3];
                if (ampm === 'pm' && hour < 12) hour += 12;
                if (ampm === 'am' && hour === 12) hour = 0;
                dateObj.setHours(hour, minute, 0, 0);
            }
            return dateObj;
        } catch(e) {
            console.error("Failed to parse date:", dateStr, e);
            return new Date(0); // epoch fallback
        }
    }

    async function fetchThreadPostDetails(reportURL) {
        const fullURL = `https://www.gaiaonline.com${reportURL}`;
        try {
            const response = await fetch(fullURL);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            let referencesRow = Array.from(doc.querySelectorAll("td.fname"))
                .find(td => td.textContent.includes("References"));
            if (referencesRow) {
                let refContent = referencesRow.nextElementSibling?.innerHTML || "";
                console.log(`References for ${reportURL}:`, refContent);

                let threadMatch = refContent.match(/t=(\d+)/);
                let threadID = threadMatch ? threadMatch[1] : null;

                if (!threadID) {
                    let detailMatch = refContent.match(/\/forum\/detail\/(\d+)\//);
                    threadID = detailMatch ? detailMatch[1] : null;
                }

                let postMatch = refContent.match(/p=(\d+_\d+)/);
                let postID = postMatch ? postMatch[1] : null;

                let titleRow = Array.from(doc.querySelectorAll("td.fname"))
                    .find(td => td.textContent.includes("Thread Title"));
                let threadTitle = titleRow
                    ? titleRow.nextElementSibling?.textContent.trim()
                    : threadID;

                return { threadID, postID, threadTitle };
            }
        } catch (err) {
            console.error(`Error fetching or parsing ${fullURL}:`, err);
        }
        return {};
    }

    async function extractAllReports() {
        let rows = document.querySelectorAll("tr.rowon, tr.rowoff");
        let formattedReports = [];

        for (let row of rows) {
            let status = row.querySelector("td.status a")?.textContent.trim() || "";
            if (status !== "New" && status !== "Dequeued") continue;

            let reportID = row.querySelector("td.key a")?.textContent.trim() || "N/A";
            let reportURL = row.querySelector("td.key a")?.getAttribute("href") || "#";
            let reason = row.querySelector("td.reason div")?.textContent.trim() || "N/A";

            let date = row.querySelector("td.date")?.textContent.trim() || "N/A";
            let reportDateObj = parseGaiaDate(date);
            let now = new Date();
            let diffDays = (now - reportDateObj) / (1000 * 60 * 60 * 24);

            let oldIndicator = "";
            if (diffDays > 90) {
                oldIndicator = `[b][color=red]WARNING:[/color] Report older than 90 days! (${Math.round(diffDays)} days old)[/b]\n`;
            }

            let reporterLink = row.querySelector("td.reporter a");
            let reporterName = reporterLink?.textContent.trim() || "N/A";
            let reporterID = reporterLink?.href.includes("reporter=") ? reporterLink.href.split("reporter=")[1] : "N/A";

            let offenderLink = row.querySelector("td.offender a");
            let offenderName = offenderLink?.textContent.trim() || "N/A";
            let offenderID = offenderLink?.href.includes("offender=") ? offenderLink.href.split("offender=")[1] : "N/A";

            console.log(`Fetching thread/post info for report ${reportID}...`);
            let { threadID, postID, threadTitle } = await fetchThreadPostDetails(reportURL);

            let threadLine = threadID
                ? `[b]Thread:[/b] [url=https://www.gaiaonline.com/forum/viewtopic.php?t=${threadID}]${threadTitle || threadID}[/url]`
                : "";
            let postLine = postID
                ? ` | [b]Reported Post:[/b] [url=https://www.gaiaonline.com/forum/viewtopic.php?p=${postID}#${postID}]${postID}[/url]`
                : "";

            let formatted = oldIndicator
                + `[b]Report ID:[/b] ${reportID} | [b]Report Type:[/b] ${reason}\n`
                + `[b]Report URL:[/b] [url]https://www.gaiaonline.com${reportURL}[/url]\n`
                + `[b]Offender:[/b] ${offenderName} | ${offenderID} | [url=https://www.gaiaonline.com/admin/user/mod/${offenderID}]Profile Tools[/url]\n`
                + `[b]Reporter:[/b] ${reporterName} | ${reporterID} | [url=https://www.gaiaonline.com/admin/user/mod/${reporterID}]Profile Tools[/url]\n`
                + `[b]Date Reported:[/b] ${date}\n`
                + `${threadLine}${postLine}`;

            formattedReports.push(formatted);
            await sleep(300);
        }

        console.log(`Finished extracting. Total formatted reports: ${formattedReports.length}`);
        return formattedReports.join("\n\n");
    }

    function addCopyButton() {
        let table = document.querySelector("table");
        if (!table) return;

        let btn = document.createElement("button");
        btn.textContent = "Copy All Reports & Details";
        btn.style = "margin: 10px; padding: 5px;";
        btn.onclick = async () => {
            btn.disabled = true;
            btn.textContent = "Processing...";
            let data = await extractAllReports();
            GM_setClipboard(data);
            btn.textContent = "Reports Copied!";
            console.log("Copied BBCode:", data);
        };

        table.parentNode.insertBefore(btn, table);
    }

    window.addEventListener("load", addCopyButton);
})();
