// ==UserScript==
// @name        Add Labels to GitHub Notifications
// @namespace   https://greasyfork.org/en/users/668659-denvercoder1
// @match       https://github.com/notifications
// @grant       none
// @license     MIT
// @version     1.0.3
// @author      Jonah Lawrence
// @description Use API calls to get the labels of all issues and pull requests from the notification list.
// @downloadURL https://update.greasyfork.org/scripts/472333/Add%20Labels%20to%20GitHub%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/472333/Add%20Labels%20to%20GitHub%20Notifications.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

/*
 * Get more GitHub API requests and enable private repos with a personal access token:
 * localStorage.setItem("gh_token", "YOUR_TOKEN_HERE");
 *
 * To get a personal access token go to https://github.com/settings/tokens/new
 * To enable private repos, you will need to enable the repos scope for the token.
 *
 * Manually clear cache by running the following in the console:
 * localStorage.setItem("labels", "{}");
 */

(() => {
    // cached labels
    let cachedLabels = {};

    /**
     * Convert a hex color to RGB
     * @param {string} hex - hex color (eg. FFFFFF)
     * @returns {number[]} [r, g, b]
     */
    function hexToRgb(hex) {
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }

    /**
     * Convert a hex color to HSL
     * @param {string} hex - hex color (eg. FFFFFF)
     * @returns {number[]} [h, s, l]
     */
    function hexToHsl(hex) {
        let [r, g, b] = hexToRgb(hex);
        r /= 255;
        g /= 255;
        b /= 255;
        const l = Math.max(r, g, b);
        const s = l - Math.min(r, g, b);
        const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
        return [
            60 * h < 0 ? 60 * h + 360 : 60 * h,
            100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
            (100 * (2 * l - s)) / 2,
        ];
    }

    /**
     * Add labels to the notification list
     * @param {object[]} labels - array of label objects
     * @param {HTMLElement} container - parent element to append labels to
     */
    function addLabels(labels, container) {
        // if there are already labels, do nothing
        if (container.querySelector(".js-issue-labels")) {
            return;
        }
        // append colored labels to the notification list
        const labelContainer = document.createElement("div");
        labelContainer.className = "js-issue-labels d-flex flex-wrap";
        labelContainer.style.marginTop = "10px";
        labelContainer.style.maxHeight = "20px";
        labels.forEach((label) => {
            const labelElement = document.createElement("span");
            labelElement.className = "IssueLabel hx_IssueLabel width-fit mb-1 mr-1 d-inline-flex";
            const [r, g, b] = hexToRgb(label.color);
            const [h, s, l] = hexToHsl(label.color);
            labelElement.setAttribute(
                "style",
                `--label-r:${r};--label-g:${g};--label-b:${b};--label-h:${h};--label-s:${s};--label-l:${l}; cursor:pointer;`
            );
            labelElement.innerText = label.name;
            labelElement.addEventListener("click", (e) => {
                e.stopPropagation();
                window.open(label.filterUrl);
            });
            labelContainer.appendChild(labelElement);
        });
        container.appendChild(labelContainer);
    }

    /**
     * Fetch labels from the GitHub API and add them to the cache for an issue or pull request given its url
     * @param {string} url - url of the issue or pull request
     * @param {HTMLElement|null} container - parent element to append labels to (optional)
     */
    function fetchLabels(url, container) {
        const issueRegex = /https:\/\/github.com\/(.*)\/(.*)\/(issues|pull)\/(\d+)/;
        const match = url.match(issueRegex);
        if (match) {
            const [, owner, repo, , number] = match;
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
            const repoIssuesUrl = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`;
            const headers = {
                Accept: "application/vnd.github.v3+json",
            };
            const token = localStorage.getItem("gh_token") || "";
            if (token) {
                headers.Authorization = `token ${token}`;
            }
            fetch(apiUrl, {
                headers,
            })
                .then((response) => response.json())
                .then((data) => {
                    const labels = data.labels || [];
                    cachedLabels[url] = {
                        date: new Date(),
                        labels: labels.map((label) => ({
                            name: label.name,
                            color: label.color,
                            filterUrl: `${repoIssuesUrl}?q=is%3Aopen+label%3A"${encodeURIComponent(label.name)}"`,
                        })),
                    };
                    console.info("fetched", url, cachedLabels[url]);
                    localStorage.setItem("labels", JSON.stringify(cachedLabels));
                    if (container) {
                        addLabels(cachedLabels[url].labels, container);
                    }
                })
                .catch((error) => console.error(error));
        }
    }

    /**
     * Check the notification list for new issues and pull requests and add labels to them
     */
    function run() {
        const notificationLinks = [
            ...document.querySelectorAll(".notification-list-item-link:not(.added-notifications)"),
        ];
        if (notificationLinks.length === 0) {
            return;
        }
        notificationLinks.forEach((a) => {
            a.classList.add("added-notifications");
            const url = a.href;
            const container = a.parentElement;
            // use cached labels if they exist and the notification last update is older than the fetch date of the labels
            const updatedDate = container.parentElement.querySelector("relative-time")?.getAttribute("datetime");
            if (cachedLabels[url] && new Date(updatedDate) < new Date(cachedLabels[url].date)) {
                console.info("cached", url, cachedLabels[url]);
                addLabels(cachedLabels[url].labels || [], container);
                return;
            }
            // otherwise fetch the labels from the GitHub API
            fetchLabels(url, container);
        });
    }

    function init() {
        // clear cache older than 6 hours
        cachedLabels = JSON.parse(localStorage.getItem("labels") || "{}");
        Object.keys(cachedLabels).forEach((url) => {
            const { date } = cachedLabels[url];
            if (new Date() - new Date(date) > 1000 * 60 * 60 * 6) {
                delete cachedLabels[url];
            }
        });
        localStorage.setItem("labels", JSON.stringify(cachedLabels));

        // run every 500ms
        setInterval(run, 500);
    }

    // run init when the page loads or if it has already loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
