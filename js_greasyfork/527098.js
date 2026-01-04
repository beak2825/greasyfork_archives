// ==UserScript==
// @name         Sprints AI - Auto Mark Episodes as Watched
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Marks Sprints AI episodes as watched, updates UI, and moves to the next episode automatically.
// @author       You
// @license      MIT
// @match        https://sprints.ai/journeys/learning/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527098/Sprints%20AI%20-%20Auto%20Mark%20Episodes%20as%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/527098/Sprints%20AI%20-%20Auto%20Mark%20Episodes%20as%20Watched.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function markAsWatched(episode, checkmark) {
        const itemId = episode.getAttribute("data-id");
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        if (!itemId) {
            alert("Error: No Item ID found.");
            return;
        }

        console.log(`Marking episode ${itemId} as watched...`);

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://sprints.ai/course/1999481/learningStatus",
            headers: {
                "User-Agent": navigator.userAgent,
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-CSRF-TOKEN": csrfToken,
                "X-Requested-With": "XMLHttpRequest",
            },
            data: `item=file_id&item_id=${itemId}&status=true`,
            onload: function (response) {
                if (response.status === 200) {
                    console.log(`Episode ${itemId} marked as watched!`);
                    updateEpisodeUI(episode, checkmark);
                    moveToNextEpisode(episode);
                } else {
                    alert("Failed to mark as watched.");
                }
            },
            onerror: function () {
                alert("Network error.");
            }
        });
    }

    function updateEpisodeUI(episode, checkmark) {
        episode.setAttribute("data-progress-status", "done");

        let iconDiv = episode.querySelector(".item-icon img");
        if (iconDiv) {
            iconDiv.src = "/assets/default/img/learning/watched.svg";
        }

        checkmark.style.display = "none"; // Hide checkmark after marking watched
    }

    function moveToNextEpisode(currentEpisode) {
        let episodes = document.querySelectorAll(".content-item-link[data-file-type='video']");
        let currentIndex = Array.from(episodes).indexOf(currentEpisode);

        if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
            let nextEpisode = episodes[currentIndex + 1];
            console.log(`Switching to next episode: ${nextEpisode.getAttribute("data-id")}`);
            nextEpisode.click();
        }
    }

    function addCheckmarksToEpisodes() {
        document.querySelectorAll(".content-item-link[data-file-type='video']").forEach(episode => {
            if (episode.getAttribute("data-progress-status") === "done") {
                console.log(`Skipping watched episode: ${episode.getAttribute("data-id")}`);
                return; // Do not add a button to already watched episodes
            }

            if (episode.querySelector(".checkmark-button")) return; // Avoid duplicate buttons

            let titleSpan = episode.querySelector(".p2.tw-text-petroleum-1000");
            if (!titleSpan) return; // Ensure the title exists

            let checkmark = document.createElement("span");
            checkmark.innerHTML = "✔️";
            checkmark.className = "checkmark-button";
            checkmark.style.marginLeft = "10px";
            checkmark.style.fontSize = "14px";
            checkmark.style.cursor = "pointer";
            checkmark.style.color = "green";
            checkmark.style.fontWeight = "bold";
            checkmark.title = "Mark as Watched";

            checkmark.onclick = function (event) {
                event.stopPropagation();
                markAsWatched(episode, checkmark);
            };

            titleSpan.parentNode.appendChild(checkmark);

            console.log(`Checkmark added to episode: ${episode.getAttribute("data-id")}`);
        });
    }

    // Wait for page load
    setTimeout(addCheckmarksToEpisodes, 3000);
})();
