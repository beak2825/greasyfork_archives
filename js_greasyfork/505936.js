// ==UserScript==
// @name         NixOS Package Search: GitHub Stargazers badge for every package in results with a GH repo "Homepage"
// @namespace    https://github.com/m1kethai/UserScripts
// @supportURL   https://github.com/m1kethai/UserScripts
// @version      1.3
// @description  Show the # of GitHub repo stars for every applicable NixOS package. Since this only fetches the stargazers count via GitHub's public API at the moment, there's a rate limit of 60 requests/hr.
// @author       m1kethai
// @license      MIT
// @match        https://search.nixos.org/packages*query*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nixos.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505936/NixOS%20Package%20Search%3A%20GitHub%20Stargazers%20badge%20for%20every%20package%20in%20results%20with%20a%20GH%20repo%20%22Homepage%22.user.js
// @updateURL https://update.greasyfork.org/scripts/505936/NixOS%20Package%20Search%3A%20GitHub%20Stargazers%20badge%20for%20every%20package%20in%20results%20with%20a%20GH%20repo%20%22Homepage%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = {
        badgeEl: `
            display: inherit;
            margin-left: 1em;
            padding: 0.04em 0.6em 0.04em 0.4em;
            background-color: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-align: center;
            transition: all 0.2s;
        `,
        badgeText: `
            color: white;
            text-decoration: none !important;
            transition: all 0.2s;
        `
    };

    async function pkgsWithGhRepoHomepages() {
        const homepageLinkSelector = `div.search-page.success > div.search-results > div > ul > li.package > ul > li > a`;
        const homepageLinks = document.querySelectorAll(homepageLinkSelector);
        const githubRepoHomepages = Array.from(homepageLinks).filter(link => link.innerText.includes("Homepage") && link.href.includes("github.com") && !link.href.includes("blob"));

        console.info(`🚀 ~ githubRepoHomepages:`, githubRepoHomepages)
        return githubRepoHomepages;
    }

    async function fetchGithubRepoStars(ghRepoLink) {
        try {
            const
                repoUrl = ghRepoLink.href,
                apiUrl = new URL(`https://api.github.com/repos${repoUrl.replace("https://github.com", "")}`),
                response = await fetch(apiUrl),
                data = await response.json(),
                gazers = data.stargazers_count;

            return `⭐️ ${gazers || "???"}`;
        } catch (error) {
            console.error("Failed to fetch stars:", error);
            return `⭐️ ???`;
        }
    }

    const createBadgeElements = repoLinkList => repoLinkList.map(repoLink => {
        const starsBadge = document.createElement("li"), starsLink = document.createElement("a");
        starsBadge.appendChild(starsLink);
        starsBadge.style = styles.badgeEl;
        starsLink.style = styles.badgeText;
        starsLink.target = "_blank";
        starsLink.href = repoLink.href;
        return starsBadge;
    });

    async function main() {
        const repoLinkList = await pkgsWithGhRepoHomepages();
        if (repoLinkList.length === 0) {
            console.warn("No GitHub repo homepages found.");
            return;
        }
        const badgeElements = createBadgeElements(repoLinkList);
        const starsList = await Promise.all(repoLinkList.map(async repoLink => await fetchGithubRepoStars(repoLink)));
        badgeElements.map((badge, i) => {
            badge.querySelector("a").innerText = starsList[i]
        });
        repoLinkList.forEach((repoLink, i) => repoLink.parentElement.appendChild(badgeElements[i]));
    }

    function runWhenLoaded() {
        if (document.readyState === "complete") {
            main();
        } else {
            window.addEventListener('load', main);
        }
    }

    function retryUntilSuccess() {
        let retryCount = 0;
        const maxRetries = 5;
        const delay = 1000; // 1 second

        const interval = setInterval(() => {
            if (document.querySelector('div.search-page.success > div.search-results > div > ul > li.package')) {
                clearInterval(interval);
                runWhenLoaded();
            } else if (retryCount >= maxRetries) {
                clearInterval(interval);
                console.warn("Max retries reached. Custom elements may not load properly.");
            } else {
                retryCount++;
            }
        }, delay);
    }

    retryUntilSuccess();
})();
