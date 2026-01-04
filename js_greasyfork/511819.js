// ==UserScript==
// @name         AWBW - Show Player's GL Rating
// @namespace    https://awbw.amarriner.com/
// @version      0.33
// @description  Fetch and display official scores for users from their profile pages next to their name on Join Game page.
// @author       Hollen9 (edited by VIH)
// @license      MIT
// @match        https://awbw.amarriner.com/games*
// @match        https://awbw.amarriner.com/yourgames.php
// @match        https://awbw.amarriner.com/yourturn.php
// @match        https://awbw.amarriner.com/following.php*
// @match        https://awbw.amarriner.com/profile.php*
// @match        https://awbw.amarriner.com/friends.php*
// @match        https://awbw.amarriner.com/viewtournament.php*
// @match        https://awbw.amarriner.com/tourney_profile.php*
// @match        https://awbw.amarriner.com/live_queue.php*
// @match        https://awbw.amarriner.com/gamescurrent_all.php?start=1&tag*
// @match        https://awbw.amarriner.com/gamescurrent_all.php?start=1&username*
// @match        https://awbw.amarriner.com/gamescurrent_all.php?username*
// @exclude      https://awbw.amarriner.com/gamescurrent_all.php*
// @icon         https://awbw.amarriner.com/terrain/userstats.gif
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/511819/AWBW%20-%20Show%20Player%27s%20GL%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/511819/AWBW%20-%20Show%20Player%27s%20GL%20Rating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fetchInterval = 60 * 60 * 1000; // 60 minutes in milliseconds
    let delayBetweenRequests = 1000; // 1 second in milliseconds

    function fetchUserScore(username) {
        let userData = GM_getValue(username);
        let currentTime = Date.now();

        // Update display with existing data if available
        if (userData) {
            updateLinkDisplay(username, userData.score, userData.lastFetch);
        }

        // Fetch new data if none exists or if it's outdated
        if (!userData || currentTime - userData.lastFetch >= fetchInterval) {
            GM.xmlHttpRequest({
                method: "GET",
                url: 'https://awbw.amarriner.com/profile.php?username=' + username,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, "text/html");
                    // let scoreElement = doc.querySelector('#profile_page > table:nth-child(1) > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(5) > td:nth-child(2)');
                    //let score = scoreElement ? scoreElement.innerText.trim() : 'N/A';
                    let ratingLabelElement = Array.from(doc.querySelectorAll('#profile_page td')).find(td => td.textContent.trim() === "Official Rating:");
                    let scoreElement = ratingLabelElement ? ratingLabelElement.nextElementSibling : null;
                    let score = scoreElement ? scoreElement.innerText.trim() : 'N/A';
                    let responseTime = Date.now();
                    GM_setValue(username, { score: score, lastFetch: responseTime });
                    updateLinkDisplay(username, score, responseTime);
                    scheduleNextUser(true); // Delay only after a new fetch
                }
            });
        } else {
            scheduleNextUser(false); // No delay for local data
        }
    }

    function updateLinkDisplay(username, score, time) {
        let linksToUpdate = document.querySelectorAll('.norm[href$="profile.php?username=' + username + '"]');
        linksToUpdate.forEach(function(link) {
            // Suffix AttrSelector should be enough, but still
            let linkUsername;
            if (link.dataset.hlnScriptUsername) {
               linkUsername = link.dataset.hlnScriptUsername;
            } else {
               linkUsername = extractUsernameFromLink(link.href);
               link.dataset.hlnScriptUsername = linkUsername;
            }
            if (linkUsername === username) {
                link.dataset.hlnScriptScore = score;
                link.dataset.hlnScriptScoreTime = time;
                // Check if the text is wrapped in <b> or <i>
                let bold = link.querySelector('b');
                let italic = link.querySelector('i');

                if (bold) {
                    bold.textContent = username + ' (' + score + ')';
                } else if (italic) {
                    italic.textContent = username + ' (' + score + ')';
                } else {
                    link.textContent = username + ' (' + score + ')';
                }
            }
        });
    }

    function scheduleNextUser(shouldDelay) {
        if (userQueue.length > 0) {
            let delay = shouldDelay ? delayBetweenRequests : 0;
            if (shouldDelay) {
                setTimeout(shiftNext, delay);
            } else {
                shiftNext();
            }
        }
    }

    function shiftNext() {
        let nextUsername = userQueue.shift();
        fetchUserScore(nextUsername);
    }

    function extractUsernameFromLink(link) {
        let match = link.match(/username=(.*)$/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    // Initialize the queue
    let userQueue = Array.from(document.querySelectorAll('.norm[href*="profile.php?username="]'))
        .map(link => extractUsernameFromLink(link.href))
        .filter(username => username != null);

    // First, update all users with local data
    userQueue.forEach(username => {
        let userData = GM_getValue(username);
        if (userData) {
            updateLinkDisplay(username, userData.score, userData.lastFetch);
        }
    });

    // Start processing the queue
    scheduleNextUser(false);
})();