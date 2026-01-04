// ==UserScript==
// @name         TODO Problem Manager
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Save TODO Problems for CF, QOJ, and AtCoder
// @author       jakao
// @license      MIT
// @match        *://qoj.ac/*
// @match        *://codeforces.com/contest/*
// @match        *://codeforces.com/gym/*
// @match        *://atcoder.jp/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/521696/TODO%20Problem%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/521696/TODO%20Problem%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUrls() {
        return GM_getValue('savedUrls', {});
    }

    function saveUrls(urls) {
        GM_setValue('savedUrls', urls);
    }

    const modal = document.createElement('div');

    function createModal() {
        modal.id = 'urlModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '10000';
        modal.style.backgroundColor = '#fff';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        modal.style.padding = '20px';
        modal.style.width = '80%';
        modal.style.maxWidth = '600px';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';
        modal.style.display = 'none';
        document.body.appendChild(modal);
    }

    function displaySavedUrls() {
        const urls = getUrls();
        createModal();
        // 清空彈窗內容，保留 Close 按鈕
        modal.innerHTML = '<button style="position: absolute; top: 10px; right: 10px; background-color: #f50057; color: #fff; border: none; padding: 5px; cursor: pointer;" onclick="document.getElementById(\'urlModal\').style.display=\'none\';">Close</button>';
        modal.innerHTML += '<h2>Saved Problems</h2>';

        for (const domain in urls) {
            const domainSection = document.createElement('div');
            domainSection.innerHTML = `<h3>${domain}</h3>`;
            const urlList = document.createElement('ul');

            urls[domain].forEach((url, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                <button style="margin-left: 10px;">Delete</button>
                <a href="${url.link}" target="_blank">${url.name}</a>
            `;

                const deleteButton = listItem.querySelector('button');
                deleteButton.onclick = () => {
                    deleteUrl(domain, index);
                };

                urlList.appendChild(listItem);
            });

            domainSection.appendChild(urlList);
            modal.appendChild(domainSection);
        }


        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Problem';
        saveButton.style.position = 'absolute';
        saveButton.style.top = '10px';
        saveButton.style.right = '70px';
        saveButton.style.backgroundColor = '#3D9140';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.padding = '5px';
        saveButton.style.cursor = 'pointer';

        saveButton.onclick = function() {
            addUrl();
        };
        modal.appendChild(saveButton);

        modal.style.display = 'block';
    }

    function deleteUrl(domain, index) {
        const urls = getUrls();
        if (urls[domain]) {
            urls[domain].splice(index, 1);
            if (urls[domain].length === 0) {
                delete urls[domain];
            }
            saveUrls(urls);
            displaySavedUrls();
            alert('URL deleted successfully!');
        }
    }

    function addUrl(){
        const currentProb = {
            "link": window.location.href,
            "name": window.location.href
        };

        const regexCF = /^https:\/\/codeforces\.com\/(gym|contest)\/\d+\/problem\/[A-Za-z0-9]+$/;
        const regexQOJ = /^https:\/\/qoj\.ac\/contest\/\d+\/problem\/[A-Za-z0-9]+$/;
        const regexAC = /^https:\/\/atcoder\.jp\/contests\/[^\/]+\/tasks\/[^\/]+$/;

        if (regexCF.test(currentProb.link)) {
            const parts = currentProb.link.split('/');
            currentProb.name = parts[4] + parts[6];
        }
        else if (regexQOJ.test(currentProb.link)) {
            const parts = currentProb.link.split('/');
            currentProb.name = parts[6];
        }
        else if (regexAC.test(currentProb.link)) {
            const parts = currentProb.link.split('/');
            currentProb.name = parts[6];
        }

        const domain = new URL(currentProb.link).hostname.split('.')[0];
        const urls = getUrls();

        if (!urls[domain]) {
            urls[domain] = [];
        }

        if (!urls[domain].some(item => item.link === currentProb.link)) {
            urls[domain].push(currentProb);
            saveUrls(urls);
            displaySavedUrls();
            alert('URL saved successfully!');
        } else {
            alert('URL is already saved.');
        }
    }

    function addViewButton() {
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View Saved Problems';
        viewButton.style.position = 'fixed';
        viewButton.style.bottom = '10px';
        viewButton.style.right = '10px';
        viewButton.style.zIndex = '9999';
        viewButton.style.backgroundColor = '#3f51b5';
        viewButton.style.color = '#fff';
        viewButton.style.border = 'none';
        viewButton.style.padding = '10px';
        viewButton.style.cursor = 'pointer';

        viewButton.onclick = displaySavedUrls;

        document.body.appendChild(viewButton);
    }

    function init() {
        createModal();

        addViewButton();
        window.deleteUrl = deleteUrl;
        window.addUrl = addUrl;
    }

    init();
})();
