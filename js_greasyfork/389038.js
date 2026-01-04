// ==UserScript==
// @name         GitHub RepoSize
// @namespace    http://js.zombie110year.top/
// @version      0.2.0
// @description  show repo's size
// @author       zombie110year@outlook.com
// @match        https://github.com/*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389038/GitHub%20RepoSize.user.js
// @updateURL https://update.greasyfork.org/scripts/389038/GitHub%20RepoSize.meta.js
// ==/UserScript==

(() => {
    const ICON_DATABASE = `<svg t="1566195284663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1131" width="16" height="16"><path d="M894.030769 177.230769c0-74.830769-171.323077-135.876923-382.030769-135.876923S129.969231 102.4 129.969231 177.230769v47.261539c0 74.830769 171.323077 135.876923 382.030769 135.876923s382.030769-61.046154 382.030769-135.876923V177.230769zM129.969231 334.769231c0 59.076923 171.323077 106.338462 382.030769 106.338461S894.030769 393.846154 894.030769 334.769231v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876924S129.969231 506.092308 129.969231 431.261538V334.769231z m0 0c0 59.076923 171.323077 106.338462 382.030769 106.338461S894.030769 393.846154 894.030769 334.769231v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876924S129.969231 506.092308 129.969231 431.261538V334.769231z m0 206.769231c0 59.076923 171.323077 106.338462 382.030769 106.338461s382.030769-47.261538 382.030769-106.338461v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876923s-382.030769-59.076923-382.030769-133.907692v-98.461538z m0 208.738461c0 59.076923 171.323077 106.338462 382.030769 106.338462s382.030769-47.261538 382.030769-106.338462V846.769231c0 74.830769-171.323077 135.876923-382.030769 135.876923S129.969231 921.6 129.969231 846.769231v-96.492308z" p-id="1132" fill="#515151"></path></svg>`;
    const SESSION_STORAGE_KEY = "api_fetched";
    parseURL()
        .then(obj => {
            return `https://api.github.com/repos/${obj.owner}/${obj.repo}`;
        })
        .then(async (url) => {
            // cache repo info
            if (sessionStorage.getItem(SESSION_STORAGE_KEY) === null) {
                let data = await fetch(url).then(resp => resp.json());
                sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
            }
        })
        .then(main);

    /**
     * main processing, **assume api info has been cached in sessionStorage**.
     *
     * 1. reposize
     */
    async function main() {
        let status = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
        showRepoSize(status["size"]);
    }

    /**
     * add repo's size infomation into summary list
     *
     * @param {number} size kilobytes
     */
    async function showRepoSize(size) {
        let unit = "KB";
        let display_size = -1;
        if (size < 1024) {
            display_size = size;
            unit = "KB";
        } else if (size < 1048576) {
            display_size = (size / 1024).toFixed(3);
            unit = "MB";
        } else {
            display_size = (size / 1048576).toFixed(3);
            unit = "GB";
        }
        let ul = document.querySelector(".numbers-summary");
        let li = document.createElement("li");
        li.innerHTML = `<a href="${location.pathname}">${ICON_DATABASE} <span class="num text-emphasized">${display_size}</span> ${unit}</a>`;
        ul.appendChild(li);
    }

    /**
     * get repo's owner and name to fetch GitHub's api
     */
    async function parseURL() {
        let pattern = RegExp("/([^/]+)/([^/]+)/?");
        let paths = pattern.exec(location.pathname);
        let obj = {
            owner: paths[1],
            repo: paths[2]
        }
        return obj;
    }
})();
