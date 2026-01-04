// ==UserScript==
// @name         GitHub Commit File Downloader
// @description  Allows you to download individual files or all files as ZIP directly from commit pages.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.1
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535850/GitHub%20Commit%20File%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/535850/GitHub%20Commit%20File%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fileZipIconIndividual = '<svg aria-hidden="true" focusable="false" class="octicon octicon-file-zip" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><g><path d="M1,1.8C1,0.8,1.8,0,2.8,0h7.6c0.5,0,0.9,0.2,1.2,0.5l2.9,2.9C14.8,3.8,15,4.2,15,4.7v9.6c0,1-0.8,1.8-1.8,1.8H2.8c-1,0-1.8-0.8-1.8-1.8V1.8z M10.5,1.6c0,0-0.1-0.1-0.2-0.1H2.8c-0.1,0-0.2,0.1-0.2,0.2v12.5c0,0.1,0.1,0.2,0.2,0.2h10.5c0.1,0,0.2-0.1,0.2-0.2V4.7c0-0.1,0-0.1-0.1-0.2" /><path d="M8.7,9.2V5c0-0.4-0.4-0.7-0.7-0.7S7.3,4.7,7.3,5v4.1L5.5,7.5c-0.2-0.4-0.7-0.4-1,0c-0.2,0.2-0.2,0.7,0,1l3,3c0.2,0.2,0.7,0.2,1,0l0,0l3-3c0.2-0.2,0.2-0.7,0-1c-0.2-0.2-0.7-0.2-1,0L8.7,9.2z" /></g></svg>';    const fileZipIconAll = '<svg aria-hidden="true" focusable="false" class="octicon octicon-file-zip" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M3.5 1.75v11.5c0 .09.048.173.126.217a.75.75 0 0 1-.752 1.298A1.748 1.748 0 0 1 2 13.25V1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.185 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 12.25 15h-.5a.75.75 0 0 1 0-1.5h.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177L9.513 1.573a.25.25 0 0 0-.177-.073H7.25a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5h-3a.25.25 0 0 0-.25.25Zm3.75 8.75h.5c.966 0 1.75.784 1.75 1.75v3a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-3c0-.966.784-1.75 1.75-1.75ZM6 5.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 5.25Zm.75 2.25h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM8 6.75A.75.75 0 0 1 8.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 8 6.75ZM8.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM8 9.75A.75.75 0 0 1 8.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 8 9.75Zm-1 2.5v2.25h1v-2.25a.25.25 0 0 0-.25-.25h-.5a.25.25 0 0 0-.25.25Z"></path></svg>';

    function createIndividualDownloadButtons() {
        const fileRows = document.querySelectorAll('li[id][role="treeitem"]');
        fileRows.forEach(row => {
            const filename = row.id.replace(/\u200E/g, '');
            
            if (row.hasAttribute('aria-expanded') || row.querySelector('.gh-file-download')) return;
            if (!filename || !filename.includes('.')) return;

            const fileIconDiv = row.querySelector('.PRIVATE_TreeView-item-visual');
            if (!fileIconDiv) return;
            
            fileIconDiv.innerHTML = fileZipIconIndividual;
            fileIconDiv.style.cursor = 'pointer';
            fileIconDiv.className += ' gh-file-download';
            fileIconDiv.style.transition = 'transform 0.15s ease-in-out';
            fileIconDiv.addEventListener('mouseenter', () => fileIconDiv.style.transform = 'scale(1.1)');
            fileIconDiv.addEventListener('mouseleave', () => fileIconDiv.style.transform = 'scale(1)');

            fileIconDiv.onclick = async (e) => {
                e.stopPropagation();
                const [_, user, repo, __, commit] = location.pathname.split('/');
                const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${commit}/${filename}`;
                try {
                    const res = await fetch(rawUrl);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename.split('/').pop();
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                } catch (e) {
                    alert(`Failed to download ${filename}`);
                    console.error(e);
                }
            };
        });
    }

    function createDownloadAllZipButton() {
        const titleEl = document.querySelector('h1[data-component="PH_Title"]');
        if (!titleEl || titleEl.querySelector('.gh-download-all-zip')) return;

        const btn = document.createElement('button');
        btn.innerHTML = fileZipIconAll;
        btn.className = 'gh-download-all-zip';
        btn.style.marginLeft = '12px';
        btn.style.cursor = 'pointer';
        btn.style.border = 'none';
        btn.style.background = 'none';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.padding = '0';
        btn.style.transition = 'transform 0.15s ease-in-out';        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.2)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

        btn.onclick = async () => {
            const [_, user, repo, __, commit] = location.pathname.split('/');
            const directUrl = `https://github.com/${user}/${repo}/archive/${commit}.zip`;
            const a = document.createElement('a');
            a.href = directUrl;
            a.download = `${repo}-${commit.slice(0, 7)}.zip`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
        };

        titleEl.appendChild(btn);
    }

    function handleRouteChange() {
        if (!location.pathname.match(/^\/[^\/]+\/[^\/]+\/commit\/[a-f0-9]+$/)) return;
        createIndividualDownloadButtons();
        createDownloadAllZipButton();
    }

    const observer = new MutationObserver(() => {
        handleRouteChange();
    });
    observer.observe(document.body, { childList: true, subtree: true });    (function() {
        const origPushState = history.pushState;
        const origReplaceState = history.replaceState;
        let lastPath = location.pathname;

        function checkPathChange() {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
                setTimeout(handleRouteChange, 100);
            }
        }

        history.pushState = function(...args) {
            origPushState.apply(this, args);
            checkPathChange();
        };

        history.replaceState = function(...args) {
            origReplaceState.apply(this, args);
            checkPathChange();
        };

        window.addEventListener('popstate', checkPathChange);
    })();

    handleRouteChange();
})();