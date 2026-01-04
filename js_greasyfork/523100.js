// ==UserScript==
// @name         GitHub PR Squasher
// @namespace    https://github.com/balakumardev/github-pr-squasher
// @version      2.0
// @description  One-click tool to squash GitHub Pull Requests. Creates a new PR with squashed commits and preserves the description.
// @author       Bala Kumar
// @license      MIT
// @match        https://github.com/*
// @match        https://*.github.com/*
// @match        https://*.github.io/*
// @match        https://*.githubusercontent.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @connect      *
// @supportURL   https://github.com/balakumardev/github-pr-squasher/issues
// @homepage     https://github.com/balakumardev/github-pr-squasher
// @downloadURL https://update.greasyfork.org/scripts/523100/GitHub%20PR%20Squasher.user.js
// @updateURL https://update.greasyfork.org/scripts/523100/GitHub%20PR%20Squasher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;

    // Add settings menu to Tampermonkey
    GM_registerMenuCommand('Set GitHub Token', async () => {
        const token = prompt('Enter your GitHub Personal Access Token (Classic):', GM_getValue('github_token', ''));
        if (token !== null) {
            if (token.startsWith('ghp_')) {
                await GM_setValue('github_token', token);
                alert('Token saved! Please refresh the page.');
            } else {
                alert('Invalid token format. Token should start with "ghp_"');
            }
        }
    });

    function debugLog(...args) {
        if (DEBUG) console.log('[PR Squasher]', ...args);
    }

    async function getGitHubToken() {
        const token = GM_getValue('github_token');
        if (!token) {
            throw new Error('GitHub token not set. Click on the Tampermonkey icon and select "Set GitHub Token"');
        }
        return token;
    }

    async function githubAPI(endpoint, method = 'GET', body = null) {
        debugLog(`API Call: ${method} ${endpoint}`);
        if (body) debugLog('Request Body:', body);

        const token = await getGitHubToken();

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `https://api.github.com${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                data: body ? JSON.stringify(body) : null,
                onload: function(response) {
                    debugLog(`Response ${endpoint}:`, {
                        status: response.status,
                        statusText: response.statusText,
                        responseText: response.responseText.substring(0, 500) + (response.responseText.length > 500 ? '...' : '')
                    });

                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText || '{}'));
                    } else {
                        reject(new Error(`GitHub API error: ${response.status} - ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    debugLog('Request failed:', error);
                    reject(error);
                }
            });
        });
    }

    async function handleSquash() {
        const button = document.getElementById('squash-button');
        button.disabled = true;
        button.innerHTML = '⏳ Starting...';

        try {
            await getGitHubToken();

            const prInfo = {
                owner: window.location.pathname.split('/')[1],
                repo: window.location.pathname.split('/')[2],
                prNumber: window.location.pathname.split('/')[4],
                branch: document.querySelector('.head-ref').innerText.trim(),
                title: document.querySelector('.js-issue-title').innerText.trim(),
                baseBranch: document.querySelector('.base-ref').innerText.trim()
            };
            debugLog('PR Info:', prInfo);

            button.innerHTML = '⏳ Getting PR details...';
            const prDetails = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/pulls/${prInfo.prNumber}`);
            debugLog('PR Details:', prDetails);
            
            // Get the exact PR description from the API to preserve formatting
            prInfo.description = prDetails.body || '';

            // Get the latest base branch commit
            button.innerHTML = '⏳ Getting latest base branch...';
            const latestBaseRef = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/refs/heads/${prInfo.baseBranch}`);
            const latestBaseSha = latestBaseRef.object.sha;
            debugLog('Latest Base SHA:', latestBaseSha);

            // Get the comparison between base and head
            button.innerHTML = '⏳ Comparing changes...';
            const comparison = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/compare/${prDetails.base.sha}...${prDetails.head.sha}`);
            debugLog('Comparison:', comparison);

            // Create new branch name
            const timestamp = new Date().getTime();
            const newBranchName = `squashed-pr-${prInfo.prNumber}-${timestamp}`;
            debugLog('New Branch Name:', newBranchName);

            // Create new branch from the latest base
            button.innerHTML = '⏳ Creating new branch...';
            await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/refs`, 'POST', {
                ref: `refs/heads/${newBranchName}`,
                sha: latestBaseSha
            });

            // Get the PR commits to form a proper commit message
            button.innerHTML = '⏳ Getting PR commits...';
            const commits = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/pulls/${prInfo.prNumber}/commits`);
            
            // Create a combined commit message
            let commitMessage = `${prInfo.title}\n\n`;
            if (prInfo.description) {
                commitMessage += `${prInfo.description}\n\n`;
            }
            commitMessage += `Squashed commits from #${prInfo.prNumber}:\n\n`;
            
            commits.forEach(commit => {
                commitMessage += `* ${commit.commit.message.split('\n')[0]}\n`;
            });

            // Get the PR files to apply changes
            button.innerHTML = '⏳ Getting PR changes...';
            const files = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/pulls/${prInfo.prNumber}/files`);
            debugLog(`PR has ${files.length} changed files`);

            // Get the latest tree from the base branch
            const baseTree = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/trees/${latestBaseSha}`);
            
            // Create a new tree with the changes
            button.innerHTML = '⏳ Creating new tree with changes...';
            
            // For each changed file, we need to get its content
            const treeItems = [];
            for (const file of files) {
                if (file.status === 'removed') {
                    // For deleted files, we don't include them in the new tree
                    treeItems.push({
                        path: file.filename,
                        mode: '100644',
                        type: 'blob',
                        sha: null // null SHA means delete the file
                    });
                } else {
                    // For added or modified files, get the content from the head branch
                    const fileContent = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/contents/${file.filename}?ref=${prDetails.head.ref}`);
                    
                    // If the file is binary or too large, use its SHA directly
                    if (fileContent.encoding === 'base64') {
                        treeItems.push({
                            path: file.filename,
                            mode: '100644',
                            type: 'blob',
                            content: atob(fileContent.content.replace(/\s/g, ''))
                        });
                    } else {
                        // For other cases (like submodules or very large files), use the SHA
                        treeItems.push({
                            path: file.filename,
                            mode: '100644',
                            type: 'blob',
                            sha: fileContent.sha
                        });
                    }
                }
            }
            
            // Create a new tree
            const newTree = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/trees`, 'POST', {
                base_tree: latestBaseSha,
                tree: treeItems
            });
            
            // Create the squashed commit
            button.innerHTML = '⏳ Creating squashed commit...';
            const newCommit = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/commits`, 'POST', {
                message: commitMessage,
                tree: newTree.sha,
                parents: [latestBaseSha]
            });
            
            // Update the new branch to point to the squashed commit
            button.innerHTML = '⏳ Updating branch...';
            await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/git/refs/heads/${newBranchName}`, 'PATCH', {
                sha: newCommit.sha,
                force: true
            });

            // Create new PR with the exact same description
            button.innerHTML = '⏳ Creating new PR...';
            const newPR = await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/pulls`, 'POST', {
                title: `${prInfo.title} (Squashed)`,
                head: newBranchName,
                base: prInfo.baseBranch,
                body: `${prInfo.description}\n\n---\n_Squashed version of #${prInfo.prNumber}_`
            });

            // Close original PR
            button.innerHTML = '⏳ Closing original PR...';
            await githubAPI(`/repos/${prInfo.owner}/${prInfo.repo}/pulls/${prInfo.prNumber}`, 'PATCH', {
                state: 'closed'
            });

            // Redirect to the new PR
            window.location.href = newPR.html_url;

        } catch (error) {
            console.error('Failed to squash PR:', error);
            debugLog('Error details:', error);
            alert(`Failed to squash PR: ${error.message}\nCheck console for details`);
            button.disabled = false;
            button.innerHTML = '🔄 Squash & Recreate PR';
        }
    }

    function addSquashButton() {
        if (window.location.href.includes('/pull/')) {
            const actionBar = document.querySelector('.gh-header-actions');
            if (actionBar && !document.getElementById('squash-button')) {
                const squashButton = document.createElement('button');
                squashButton.id = 'squash-button';
                squashButton.className = 'btn btn-sm btn-primary';
                squashButton.innerHTML = '🔄 Squash & Recreate PR';
                squashButton.onclick = handleSquash;
                actionBar.appendChild(squashButton);
            }
        }
    }

    // Add button when page loads
    addSquashButton();

    // Add button when navigation occurs
    const observer = new MutationObserver(() => {
        if (window.location.href.includes('/pull/')) {
            addSquashButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
