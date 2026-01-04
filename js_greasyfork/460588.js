// ==UserScript==
// @name         GitHub Homepage Button
// @description  Adds a "Homepage" button to GitHub repository search results to quickly access the repository's homepage URL.
// @version      1
// @match        https://github.com/search?*
// @namespace    https://gist.github.com/bethropolis/37cfb3821ad2321b53749ca097ec2963
// @author       bethropolis
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460588/GitHub%20Homepage%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/460588/GitHub%20Homepage%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const repoList = document.querySelector(".repo-list");
    if (repoList) {
        const repos = repoList.querySelectorAll("li");
        for (const repo of repos) {
            const repoLink = repo.querySelector(" div > div > div > a");
            if (repoLink) {
                const repoUrl = repoLink.getAttribute("href");
                const parts = repoUrl.split("/");
                const owner = parts[parts.length - 2];
                const repoName = parts[parts.length - 1];
                const repoListItem = repo.closest('li'); // Get reference to parent li item

                // Fetch repository details to get homepage URL
                fetch(`https://api.github.com/repos/${owner}/${repoName}`)
                    .then(response => response.json())
                    .then(data => {
                        const homepageUrl = data.homepage;

                        // Add "Homepage" button
                        if (homepageUrl) {
                            const repoDetails = repo.querySelector(".d-flex");
                            const a = document.createElement('a');
                            a.innerText = 'Homepage';
                            a.href = homepageUrl;
                            a.target = '_blank'; // Open link in a new tab
                            a.style.marginLeft = '1rem'; // Add some margin to the left
                            repoDetails.appendChild(a);
                        }
                    })
                    .catch(error => console.error(error));
            }
        }
    }
})();