// ==UserScript==
//
// @name         Azure DevOps PullRequest Row Enhancer
// @version      1.3
// @author       Chad
// @description  Adds useful annotations to all PR rows in Azure DevOps to include status and file count. Based on the More Awesome Azure DevOps (userscript) v3.7.5, by Alejandro Barreto (NI)
// @license      MIT

// @namespace    https://github.com/yourusername
// @include      https://dev.azure.com/*
// @include      https://*.visualstudio.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/536619/Azure%20DevOps%20PullRequest%20Row%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/536619/Azure%20DevOps%20PullRequest%20Row%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Style enhancements for PR rows
    GM_addStyle(`
        /* Align labels to the right and give them a nice border */
        .repos-pr-list .bolt-pill-group {
            flex-grow: 1;
            justify-content: flex-end;
        }
        .bolt-pill {
            border: 1px solid #0001;
        }
        /* Annotation styling */
        .pr-annotation:not([title=""]) {
            cursor: help !important;
        }
        .pr-annotation.file-count,
        .pr-annotation.build-status {
            background: #fff4 !important;
            min-width: 8ex;
        }
        /* Bug severity colors */
        .pr-bug-severity-1 {
            background: #a008 !important;
        }
        .pr-bug-severity-2 {
            background: #fd38 !important;
        }
    `);

    let currentUser;
    let azdoApiBaseUrl;

    function debug(...args) {
        console.log('[PR Row Enhancer]', args);
    }

    function error(...args) {
        console.error('[PR Row Enhancer]', args);
    }

    function onReady() {
        const pageData = JSON.parse(document.getElementById('dataProviders').innerHTML).data;
        currentUser = pageData['ms.vss-web.page-data'].user;
        azdoApiBaseUrl = `${window.location.origin}${pageData['ms.vss-tfs-web.header-action-data'].suiteHomeUrl}`;

        watchPullRequestDashboard();
    }

    function watchPullRequestDashboard() {
        console.log('[PR Enhancer] Found sections:', document.querySelectorAll('.repos-pr-section-card').length);
        console.log('[PR Enhancer] Found rows:', document.querySelectorAll('a[role="row"]').length);

        const observer = new MutationObserver(_.throttle(() => {
            document.querySelectorAll('.repos-pr-section-card').forEach(section => {
                section.querySelectorAll('a[role="row"]').forEach(row => {
                    enhancePullRequestRow(row);
                });
            });
        }, 400));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async function enhancePullRequestRow(row) {
        console.log('[PR Enhancer] Processing PR row:', row.href);
        const pullRequestUrl = new URL(row.href, window.location.origin);
        const pullRequestId = parseInt(pullRequestUrl.pathname.substring(pullRequestUrl.pathname.lastIndexOf('/') + 1), 10);

        // Skip if we've already processed this PR
        if (row.dataset.pullRequestId === pullRequestId.toString()) return;
        row.dataset.pullRequestId = pullRequestId;

        // Remove any existing annotations
        for (const element of row.querySelectorAll('.pr-annotation')) {
            element.remove();
        }

        try {
            const pr = await getPullRequestAsync(pullRequestId);
            console.log('[PR Enhancer] PR data:', pr);
            await annotateBugsOnPullRequestRow(row, pr);
            await annotateFileCountOnPullRequestRow(row, pr);
            await annotateBuildStatusOnPullRequestRow(row, pr);
        } catch (e) {
            row.style.outline = '1px solid lime';
            error('Failed to enhance PR row', e);
        }
    }

    async function annotateBugsOnPullRequestRow(row, pr) {
        const workItemRefs = (await $.get(`${pr.url}/workitems?api-version=5.1`)).value;
        let highestSeverityBug = null;
        let highestSeverity = 100;
        let otherHighestSeverityBugsCount = 0;

        for (const workItemRef of workItemRefs) {
            const workItem = await $.get(`${workItemRef.url}?api-version=5.1`);
            if (workItem.fields['System.WorkItemType'] === 'Bug') {
                const severityString = workItem.fields['Microsoft.VSTS.Common.Severity'];
                if (severityString) {
                    const severity = parseInt(severityString.replace(/ - .*$/, ''), 10);
                    if (severity < highestSeverity) {
                        highestSeverity = severity;
                        highestSeverityBug = workItem;
                        otherHighestSeverityBugsCount = 0;
                    } else if (severity === highestSeverity) {
                        otherHighestSeverityBugsCount += 1;
                    }
                }
            }
        }

        if (highestSeverityBug && highestSeverity <= 2) {
            let title = highestSeverityBug.fields['System.Title'];
            if (otherHighestSeverityBugsCount) {
                title += ` (and ${otherHighestSeverityBugsCount} other)`;
            }

            annotatePullRequestLabel(row, `pr-bug-severity-${highestSeverity}`, title, `SEV${highestSeverity}`);
        }
    }

    async function annotateFileCountOnPullRequestRow(row, pr) {
        let fileCount;

        if (pr.lastMergeCommit) {
            const mergeCommitInfo = await $.get(`${pr.lastMergeCommit.url}/changes?api-version=5.0`);
            const files = _(mergeCommitInfo.changes).filter(item => !item.item.isFolder);
            fileCount = files.size();
        } else {
            fileCount = '⛔';
        }

        const label = `<span class="contributed-icon flex-noshrink fabric-icon ms-Icon--FileCode"></span>&nbsp;${fileCount}`;
        annotatePullRequestLabel(row, 'file-count', '# of files changed', label);
    }

    async function annotateBuildStatusOnPullRequestRow(row, pr) {
    try {
        // Debug output
        console.groupCollapsed(`PR ${pr.pullRequestId} Status Check`);
        console.log('PR Object:', pr);

        if (!pr.lastMergeCommit) {
            console.log('No merge commit - skipping');
            console.groupEnd();
            return;
        }

        const projectPath = pr.repository.url.split('/_apis/git/repositories/')[0];
        const projectId = projectPath.split('/').pop();

        // Build the status URL
        const statusUrl = `https://dev.azure.com/NNSA-G2/${projectId}` +
            `/_apis/git/repositories/${pr.repository.id}` +
            `/commits/${pr.lastMergeCommit.commitId}` +
            `/statuses?api-version=5.1&latestOnly=true`;

        console.log('Status API URL:', statusUrl);

        let builds = [];
        try {
            const response = await $.get(statusUrl);
            builds = response.value || [];
            console.log('Build Statuses:', builds);
        } catch (error) {
            console.error('Status API Error:', error);
            console.groupEnd();
            return;
        }

        if (!builds.length) {
            console.log('No build statuses found');
            console.groupEnd();
            return;
        }

        // Determine status
        let state;
        const hasFailures = builds.some(b => b.state === 'failed');
        const hasPending = builds.some(b => b.state === 'pending' || b.state === 'inprogress');
        const allSuccess = builds.every(b =>
            b.state === 'succeeded' ||
            (b.description && b.description.includes('partially succeeded'))
        );

        if (hasFailures) {
            state = '❌';
        } else if (hasPending) {
            state = '▶️';
        } else if (allSuccess) {
            state = '✔️';
        } else {
            state = '❓'; // Unknown state
        }

        // Create tooltip with more detailed information
        const tooltip = builds.map(b => {
            let line = `• ${b.context?.name || 'Unknown check'}: ${b.state}`;
            return line;
        }).join('\n\n');

        const label = `<span aria-hidden="true" class="contributed-icon flex-noshrink fabric-icon ms-Icon--Build"></span>&nbsp;${state}`;
        annotatePullRequestLabel(row, 'build-status', tooltip, label);

        console.groupEnd();
    } catch (error) {
        console.error(`Error processing PR ${pr.pullRequestId}:`, error);
    }
}

    function annotatePullRequestLabel(pullRequestRow, cssClass, title, html) {
        let labels = pullRequestRow.querySelector('.bolt-pill-group-inner');

        if (!labels) {
            const labelContainer = $(`
                <div class="bolt-pill-group margin-left-8 bolt-pill-group flex-row">
                    <div class="bolt-pill-overflow flex-row">
                        <div class="bolt-pill-group-inner flex-row">
                        </div>
                        <div class="bolt-pill-observe"></div>
                    </div>
                </div>`)[0];
            pullRequestRow.querySelector('.body-l').insertAdjacentElement('afterend', labelContainer);
            labels = pullRequestRow.querySelector('.bolt-pill-group-inner');
        }

        const label = `
            <div class="pr-annotation bolt-pill flex-row flex-center standard compact ${cssClass}" title="${escapeStringForHtml(title)}">
                <div class="bolt-pill-content text-ellipsis">${html}</div>
            </div>`;
        labels.insertAdjacentHTML('beforeend', label);
    }

    function getPullRequestAsync(id) {
        return $.get(`${azdoApiBaseUrl}/_apis/git/pullrequests/${id}?api-version=5.0`);
    }

    function escapeStringForHtml(string) {
        return string.replace(/[\u00A0-\u9999<>&]/gim, ch => `&#${ch.charCodeAt(0)};`);
    }

    // Start when DOM is ready
    if (document.readyState !== 'loading') {
        onReady();
    } else {
        document.addEventListener('DOMContentLoaded', onReady);
    }
})();