// ==UserScript==
// @name         TorrentBD - Uploads + Pending Approval
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Show uploads Today/Week/Month and count of torrents not approved, button style, auto-update
// @match        https://www.torrentbd.net/account-details.php*
// @grant        none
// @license      Gli7ch_HunteR
// @downloadURL https://update.greasyfork.org/scripts/546932/TorrentBD%20-%20Uploads%20%2B%20Pending%20Approval.user.js
// @updateURL https://update.greasyfork.org/scripts/546932/TorrentBD%20-%20Uploads%20%2B%20Pending%20Approval.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getLastSaturday(date) {
        let day = date.getDay(); // Sunday=0 ... Saturday=6
        let offset = (day === 6) ? 0 : day + 1;
        let saturday = new Date(date);
        saturday.setHours(0,0,0,0);
        saturday.setDate(date.getDate() - offset);
        return saturday;
    }

    function countUploads() {
        let torrents = document.querySelectorAll(".torrent-added-on");
        let now = new Date();
        let lastSaturday = getLastSaturday(now);
        let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0,0,0,0);
        let today = new Date();
        today.setHours(0,0,0,0);

        let counts = { today: 0, week: 0, month: 0, pending: 0 };

        torrents.forEach(el => {
            let title = el.getAttribute("title");
            if (title) {
                let uploadDate = new Date(title);
                uploadDate.setHours(0,0,0,0);

                if (uploadDate >= today) counts.today++;
                if (uploadDate >= lastSaturday) counts.week++;
                if (uploadDate >= startOfMonth) counts.month++;
            }

            // Check if torrent is not approved
            let row = el.closest("tr"); // assuming .torrent-added-on is in a table row
            if (row && row.innerText.includes("Not Approved")) {
                counts.pending++;
            }
        });

        function createOrUpdate(id, labelText, value) {
            let wrapper = document.querySelector(`#${id}`);
            if (!wrapper) {
                wrapper = document.createElement("div");
                wrapper.className = "short-links";
                wrapper.id = id;

                let label = document.createElement("span");
                label.className = "short-link-label";
                label.textContent = labelText;

                let counter = document.createElement("span");
                counter.className = "short-link-counter";

                wrapper.appendChild(label);
                wrapper.appendChild(counter);

                // Insert next to Upvotes button
                let upvotes = Array.from(document.querySelectorAll(".short-links"))
                    .find(div => div.innerText.includes("Upvotes"));
                if (upvotes) {
                    upvotes.insertAdjacentElement("afterend", wrapper);
                } else {
                    let first = document.querySelector(".short-links");
                    if (first) first.parentNode.appendChild(wrapper);
                }
            }
            wrapper.querySelector(".short-link-counter").textContent = value;
        }

        createOrUpdate("uploads-today", "Today", counts.today);
        createOrUpdate("uploads-week", "This Week", counts.week);
        createOrUpdate("uploads-month", "This Month", counts.month);
        createOrUpdate("uploads-pending", "Not Approved", counts.pending);
    }

    setTimeout(countUploads, 1500);
    setInterval(countUploads, 5000);

})();
