// ==UserScript==
// @name         GitHub Delete Repositories
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add delete button to GitHub repositories
// @author       ChatGPT
// @match        https://github.com/*&tab=repositories*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.github.com
// @license      ChatGPT
// @downloadURL https://update.greasyfork.org/scripts/500173/GitHub%20Delete%20Repositories.user.js
// @updateURL https://update.greasyfork.org/scripts/500173/GitHub%20Delete%20Repositories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TOKEN_KEY = 'github_token';

    // Function to get GitHub token from localStorage or prompt user
    function getToken() {
        let token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            token = prompt("Please enter your GitHub token:");
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                alert("GitHub token is required to delete repositories.");
            }
        }
        return token;
    }

    // Retrieve the GitHub token
    const GITHUB_TOKEN = getToken();
    if (!GITHUB_TOKEN) return;

    // Add custom styles for the delete button
    GM_addStyle(`
        .delete-repo-btn {
            margin-left: 10px;
            color: white;
            background-color: red;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        }
    `);

    // Add delete button to each repository item
    const repoItems = document.querySelectorAll('li[itemprop="owns"]');
    repoItems.forEach(item => {
        const repoName = item.querySelector('a[itemprop="name codeRepository"]').textContent.trim();
        const ownerName = window.location.pathname.split('/')[1];
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-repo-btn');
        deleteButton.onclick = function() {
            if (confirm(`Are you sure you want to delete the repository "${repoName}"?`)) {
                deleteRepository(ownerName, repoName);
            }
        };
        item.appendChild(deleteButton);
    });

    // Function to delete repository using GitHub API
    function deleteRepository(owner, repo) {
        GM_xmlhttpRequest({
            method: 'DELETE',
            url: `https://api.github.com/repos/${owner}/${repo}`,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            onload: function(response) {
                if (response.status === 204) {
                    alert(`Repository "${repo}" deleted successfully.`);
                    location.reload();
                } else {
                    alert(`Failed to delete repository "${repo}". Status: ${response.status}`);
                }
            },
            onerror: function(error) {
                alert(`An error occurred: ${error}`);
            }
        });
    }
})();