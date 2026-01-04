// ==UserScript==
// @name         Backup GitHub Repository
// @namespace    Violentmonkey Scripts
// @version      2.1
// @description  Backup GitHub repositories directly from user profile page
// @author       maanimis
// @match        https://github.com/*?tab=repositories
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at      document-end
// @license MIT
// @require      https://update.greasyfork.org/scripts/530526/1558038/ProgressUI-Module.js
// @downloadURL https://update.greasyfork.org/scripts/532441/Backup%20GitHub%20Repository.user.js
// @updateURL https://update.greasyfork.org/scripts/532441/Backup%20GitHub%20Repository.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractBaseUrl(urlString = location.href) {
        const urlObj = new URL(urlString);
        return `${urlObj.origin}${urlObj.pathname.split("/").slice(0, 2).join("/")}`;
    }

    function extractRepoData() {
        const ulElement = document.querySelector('ul[data-filterable-for="your-repos-filter"][data-filterable-type="substring"]');
        if (!ulElement){
            alert("ulElement not found!!")
            return
        }
        
        const liElements = ulElement.querySelectorAll("li");
        const liArray = Array.from(liElements);
        
        return liArray.map(li => {
            const repoLink = li.querySelector('a[itemprop="name codeRepository"]');
            if (!repoLink) return null;
            const repository = repoLink.href;

            const name = repoLink.textContent.trim();

            const language = li.querySelector('span[itemprop="programmingLanguage"]')?.textContent.trim();

            const lastUpdated = li.querySelector("relative-time")?.getAttribute("datetime");

            const isPublic = li.querySelector(".Label.Label--secondary")?.textContent.trim() === "Public";
            
            const downloadLinks = [
                `${repository}/archive/refs/heads/master.zip`,
                `${repository}/archive/refs/heads/main.zip`
            ];
            
            return {
                name,
                language,
                lastUpdated,
                isPublic,
                repository,
                downloadLinks
            };
        }).filter(Boolean);
    }

    function downloadRepos() {
        const repos = extractRepoData();
        if (repos.length === 0) {
            ProgressUI.showQuick('No repositories found on this page', { 
                percent: 100, 
                theme: 'dark',
                duration: 3000
            });
            return;
        }

        const progress = new ProgressUI({
            position: 'bottom-right',
            theme: 'dark',
            title: 'GitHub Repository Downloader',
            closable: true,
            width: '350px',
        });

        let downloadedCount = 0;
        let failedCount = 0;
        const totalCount = repos.length;

        progress.update(`Starting download of ${totalCount} repositories...`, 0);

        repos.forEach((repo, index) => {
            const mainZipUrl = repo.downloadLinks[1];
            const masterZipUrl = repo.downloadLinks[0];
            
            setTimeout(() => {
                progress.update(`Downloading ${repo.name} (${index + 1}/${totalCount})...`, (index / totalCount) * 100);
                
                GM_download({
                    url: mainZipUrl,
                    name: `${repo.name}-main.zip`,
                    onload: () => {
                        downloadedCount++;
                        updateProgressStatus(progress, downloadedCount, failedCount, totalCount);
                    },
                    onerror: () => {
                        progress.update(`Trying master branch for ${repo.name}...`, (index / totalCount) * 100);
                        
                        GM_download({
                            url: masterZipUrl,
                            name: `${repo.name}-master.zip`,
                            onload: () => {
                                downloadedCount++;
                                updateProgressStatus(progress, downloadedCount, failedCount, totalCount);
                            },
                            onerror: () => {
                                failedCount++;
                                progress.update(`Failed to download ${repo.name}`, (index / totalCount) * 100);
                                updateProgressStatus(progress, downloadedCount, failedCount, totalCount);
                            }
                        });
                    }
                });
            }, index * 1000);
        });
    }

    function updateProgressStatus(progress, downloaded, failed, total) {
        const completed = downloaded + failed;
        const percent = Math.round((completed / total) * 100);
        
        if (completed === total) {
            if (failed === 0) {
                progress.update(`All ${total} repositories downloaded successfully!`, 100);
            } else {
                progress.update(`Download completed: ${downloaded} successful, ${failed} failed`, 100);
            }
            progress.scheduleCleanup(5000);
        } else {
            progress.update(`Downloaded: ${downloaded}, Failed: ${failed}, Remaining: ${total - completed}`, percent);
        }
    }

    GM_registerMenuCommand("Download GitHub Repositories", downloadRepos);
})();
