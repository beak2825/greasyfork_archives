// ==UserScript==
// @name         Fetch Titles and Log Descriptions
// @namespace    http://tampermonkey.net/
// @version      2024-08-08
// @description  sdfsdfsd
// @author       You
// @match        https://www.nexusmods.com/users/myaccount?tab=download+history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502689/Fetch%20Titles%20and%20Log%20Descriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/502689/Fetch%20Titles%20and%20Log%20Descriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var first = true;

    let allDescriptions = [];
    let currentPage = 1;

    function waitForElement(selector, conditionFn = () => true) {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, me) => {
                const element = document.querySelector(selector);
                if (element && conditionFn(element)) {
                    me.disconnect();
                    resolve();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        });
    }

    async function fetchAndDisplayDescriptions() {
        await waitForElement('#DataTables_Table_0', (element) => element.querySelectorAll('.tracking-title').length > 0);
        if(first){
            first = false;
            reFetchOnNextClick();
        }
        let titles = document.querySelectorAll('#DataTables_Table_0 .tracking-title');
        let loadingScreen = createLoadingScreen(titles.length);

        for (let i = 0; i < titles.length; i++) {
            let title = titles[i];
            let modName = title.innerText.trim();
            let url = title.querySelector('a').href;
            if(url.indexOf('https://www.nexusmods.com/baldursgate3/mods/') != -1){
                let response = await fetch(url);
                let html = await response.text();
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                let description = tempDiv.querySelector('.mod_description_container').innerText;
                allDescriptions.push(`${modName}: ${description}`);
            }
            updateLoadingScreen(loadingScreen, i + 1, titles.length);
        }

        updateLoadingScreen(loadingScreen, titles.length, titles.length); // Ensure the loading message reflects completion
        displayDescriptionButton(loadingScreen);
        clickNextPage();
    }

    function createLoadingScreen(total) {
        let loadingScreen = document.createElement('div');
        loadingScreen.style.position = 'fixed';
        loadingScreen.style.top = '0';
        loadingScreen.style.left = '0';
        loadingScreen.style.width = '100%';
        loadingScreen.style.height = '100%';
        loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingScreen.style.color = 'white';
        loadingScreen.style.zIndex = '10000';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.innerHTML = `
            <div id="loadingMessage">Loading Page ${currentPage} 0/${total}</div>
            <button id="showDescriptions" style="margin-top: 20px;">Show Descriptions</button>
        `;
        document.body.appendChild(loadingScreen);
        return loadingScreen;
    }

    function updateLoadingScreen(loadingScreen, done, total) {
        let message = loadingScreen.querySelector('#loadingMessage');
        message.innerText = `Loading Page ${currentPage} ${done}/${total}`;
    }

    function copyToClipboard(text) {
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function displayDescriptionButton(loadingScreen) {
        let button = loadingScreen.querySelector('#showDescriptions');
        button.addEventListener('click', () => {
            document.body.removeChild(loadingScreen);
            displayDescriptions(allDescriptions);
        });
    }

    function displayDescriptions(descriptions) {
        let existingOverlay = document.querySelector('#descriptionsOverlay');
        if (existingOverlay) {
            existingOverlay.querySelector('ul').innerHTML = '';
        } else {
            let overlay = document.createElement('div');
            overlay.id = 'descriptionsOverlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            overlay.style.color = 'white';
            overlay.style.zIndex = '10000';
            overlay.style.overflowY = 'scroll';
            overlay.style.padding = '20px';
            overlay.style.boxSizing = 'border-box';

            let closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.position = 'fixed';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.zIndex = '10001';
            closeButton.addEventListener('click', () => document.body.removeChild(overlay));

            let list = document.createElement('ul');

            overlay.appendChild(closeButton);
            overlay.appendChild(list);
            document.body.appendChild(overlay);
        }

        let list = document.querySelector('#descriptionsOverlay ul');
        descriptions.forEach(desc => {
            let listItem = document.createElement('li');
            listItem.innerText = desc;
            listItem.style.marginBottom = '10px';
            list.appendChild(listItem);
        });
    }

    function clickNextPage() {
        let nextButton = document.querySelector('.paginate_button.next');
        if (nextButton) {
            currentPage++;
            nextButton.click();
        }
    }

    async function reFetchOnNextClick() {
        let buttons = document.querySelectorAll('.paginate_button');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', async (event) => {
                fetchAndDisplayDescriptions();
            });
        }
    }

    fetchAndDisplayDescriptions();
})();
