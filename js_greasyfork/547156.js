// ==UserScript==
// @name         Worldbox Discord Server Rank Count
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Count users by Mee6 XP-level titles on the Worldbox Discord server
// @match        https://mee6.xyz/en/leaderboard/522561390330904585*
// @grant        GM_xmlhttpRequest
// @connect      mee6.xyz
// @downloadURL https://update.greasyfork.org/scripts/547156/Worldbox%20Discord%20Server%20Rank%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/547156/Worldbox%20Discord%20Server%20Rank%20Count.meta.js
// ==/UserScript==

/*
HOW TO USE:
1. Install this script in Tampermonkey and make sure it's enabled.

2. Open the Worldbox Discord server Mee6 leaderboard page:
   https://mee6.xyz/en/leaderboard/522561390330904585

3. press Ctrl Shift J to open the console and let it do its thing

4. The script will fetch all members with XP, count them by level titles,
   calculate "Never Talked / No XP", and download a text file.

5. The text file includes counts per XP title, "No Title" and "Never Talked / No XP",
   total members counted, current server member count, and a timestamp in the filename.

NOTES:
- Keep the leaderboard page open while the script runs.
- Fetching all pages may take some time depending on server size.
- You can update "Total server members" at any time via the input box.
*/




(function() {
    'use strict';

    const serverId = '522561390330904585'; // your server ID
    let totalServerMembers = 603248;       // <--- EDIT THIS VALUE when member count changes
    let page = 0;
    let allMembers = [];
    let finished = false;

    // Define the level titles in ascending order
    const levelTitles = [
        {level: 3, title: "Grasshopper"},
        {level: 5, title: "Butterfly"},
        {level: 10, title: "Chicken"},
        {level: 15, title: "Wolf"},
        {level: 20, title: "Crocodile"},
        {level: 25, title: "Bear"},
        {level: 30, title: "Plague Doctor"},
        {level: 35, title: "Druid"},
        {level: 40, title: "Dragon"},
        {level: 45, title: "UFO"},
        {level: 50, title: "Demon"},
        {level: 55, title: "Crabzilla"},
        {level: 60, title: "Necromancer"},
        {level: 65, title: "Mage"},
        {level: 70, title: "Rat King"},
        {level: 75, title: "God Finger"},
        {level: 80, title: "Robo Santa"},
        {level: 85, title: "Bowling Ball"},
        {level: 90, title: "Tornado"},
        {level: 95, title: "Grey Goo"},
        {level: 100, title: "Super Pumpkin"}
    ];

    function getTitle(level) {
        let title = "No Title";
        for (const t of levelTitles) {
            if (level >= t.level) title = t.title;
        }
        return title;
    }

    function fetchPage(pageNumber) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://mee6.xyz/api/plugins/levels/leaderboard/${serverId}?limit=1000&page=${pageNumber}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.players || []);
                    } catch(e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    function downloadTextFile(filename, text) {
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getTimestamp() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const h = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `${y}${m}${d}_${h}${min}${s}`;
    }

    async function fetchAllPages() {
        while (!finished) {
            console.log(`Fetching page ${page}...`);
            const players = await fetchPage(page);
            if (players.length === 0) {
                finished = true;
                break;
            }
            allMembers.push(...players);
            page++;
            await new Promise(r => setTimeout(r, 300)); // avoid rate-limits
        }

        // Count titles
        const titleCounts = {};
        allMembers.forEach(member => {
            const title = getTitle(member.level);
            titleCounts[title] = (titleCounts[title] || 0) + 1;
        });

        // Add “Never Talked / No XP” category
        const inactiveCount = totalServerMembers - allMembers.length;
        titleCounts["Never Talked / No XP"] = inactiveCount;

        // Sort titles: highest level first
        const sortedTitles = [...levelTitles].reverse().map(t => t.title);
        if (titleCounts["No Title"]) sortedTitles.push("No Title");
        sortedTitles.push("Never Talked / No XP");

        // Prepare text output
        let outputText = "=== Mee6 XP Title Counts ===\n";
        sortedTitles.forEach(title => {
            if (titleCounts[title] !== undefined) {
                outputText += `${title}: ${titleCounts[title]}\n`;
            }
        });

        // Add totals: total members counted first
        outputText += `\nTotal members counted: ${allMembers.length}\n`;
        outputText += `Current member count: ${totalServerMembers}`;

        // Print to console
        console.clear();
        console.log(outputText);

        // Download text file with timestamp
        const filename = `mee6_title_counts_${serverId}_${getTimestamp()}.txt`;
        downloadTextFile(filename, outputText);
    }

    fetchAllPages();
})();
