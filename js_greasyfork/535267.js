// ==UserScript==
// @name         Add Remote Upload All Button on Offcloud
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license      MIT
// @description  Adds new buttons for remote upload with additional parameters and specific folder option
// @author       Your Name
// @match        https://offcloud.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      offcloud.com
// @downloadURL https://update.greasyfork.org/scripts/535267/Add%20Remote%20Upload%20All%20Button%20on%20Offcloud.user.js
// @updateURL https://update.greasyfork.org/scripts/535267/Add%20Remote%20Upload%20All%20Button%20on%20Offcloud.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -START- Below ensures that the script gets acivated on Single page activation only when it matches
    // Check if the URL contains a '#'
    function checkHashUrl() {
        return window.location.href.includes('/#/explore');
    }

    // Your custom code here
    function customScript() {
        console.log('Tampermonkey script activated on SPA page with # in URL');
        waitForAngular();
        // Add your script functionality here
    }

    // Initial check
    if (checkHashUrl()) {
        customScript();
    }

    // Listen for URL changes using history API
    const pushState = history.pushState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        if (checkHashUrl()) {
            customScript();
        }
    };

    const replaceState = history.replaceState;
    history.replaceState = function() {
        replaceState.apply(history, arguments);
        if (checkHashUrl()) {
            customScript();
        }
    };
    // Listen for popstate event (back/forward navigation)
    window.addEventListener('popstate', function() {
        if (checkHashUrl()) {
            customScript();
        }
    });


    // Listen for URL changes
    window.addEventListener('hashchange', function() {
        if (checkHashUrl()) {
            customScript();
        }
    });
    // -END of logic handling single page navigation with # in url

    // Configurable timeout for hiding the banner
    const BANNER_TIMEOUT = 5000;
    const SKIP_EXTENSIONS = ['aria2', 'aria2__temp', 'torrent']; // Default list of extensions to skip

    // Register Greasemonkey menu commands
    GM_registerMenuCommand('Set API Key', setApiKey);
    GM_registerMenuCommand('Select Remote Option', selectRemoteOption);

    // Function to set the API key
    function setApiKey() {
        const apiKey = prompt('Enter your API key:');
        if (apiKey) {
            GM_setValue('apiKey', apiKey);
            fetchRemoteOptions(apiKey);
        }
    }

    // Function to fetch remote options
    function fetchRemoteOptions(apiKey) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://offcloud.com/api/remote-account/list?key=${apiKey}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText).data;
                const options = data.map(option => {
                    const host = option.host ? option.host + ' ' : '';
                    return `${host}${option.username} (${option.type}) ${option.path}`;
                });
                displayRemoteOptions(options, data);
            }
        });
    }

    // Function to display remote options with radio buttons
    function displayRemoteOptions(options, data) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.padding = '20px';
        container.style.border = '1px solid black';
        container.style.zIndex = '10000';

        const currentRemoteOptionId = GM_getValue('remoteOptionId');

        options.forEach((option, index) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'remoteOption';
            radio.value = index;
            if (data[index].remoteOptionId === currentRemoteOptionId) {
                radio.checked = true;
            }
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
            container.appendChild(document.createElement('br'));
        });

        const button = document.createElement('button');
        button.textContent = 'Select';
        button.onclick = function() {
            const selectedOption = document.querySelector('input[name="remoteOption"]:checked');
            if (selectedOption) {
                const selectedData = data[selectedOption.value];
                GM_setValue('remoteOptionId', selectedData.remoteOptionId);
                GM_setValue('remotePath', selectedData.path);
                document.body.removeChild(container);
            } else {
                alert('Please select an option.');
            }
        };
        container.appendChild(button);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = function() {
            document.body.removeChild(container);
        };
        container.appendChild(cancelButton);

        document.body.appendChild(container);
    }

    // Function to select remote option
    function selectRemoteOption() {
        const apiKey = GM_getValue('apiKey');
        if (apiKey) {
            fetchRemoteOptions(apiKey);
        } else {
            alert('Please set the API key first.');
        }
    }

    // Wait for the AngularJS app to load
    function waitForAngular() {
        if (typeof angular !== 'undefined' && angular.element(document.body).scope()) {
            waitForElement();
        } else {
            setTimeout(waitForAngular, 100);
        }
    }

    // Wait for the existing button to be available
    function waitForElement() {
        var existingButton = document.querySelector('a[ng-click="remoteUploadAll();"]');
        if (existingButton) {
            addNewButtons(existingButton);
        } else {
            setTimeout(waitForElement, 100);
        }
    }

    // Function to add the new buttons
    function addNewButtons(existingButton) {
        var scope = angular.element(document.body).scope();

        // Button for remote upload with params
        var newButton = createButton('Remote upload all files with params', function() {
            if (confirm('Do you want to upload all files?')) {
                scope.$apply(function() {
                    remoteUploadAllWithParams();
                });
            }
        });
        existingButton.parentNode.appendChild(newButton);

        // Button for remote upload to specific folder
        var specificFolderButton = createButton('Remote upload all to specific folder', function() {
            var defaultFolderPath = document.querySelector('h4[ng-if="fileName"]').innerHTML.replace(/<small.*?<\/small>/, '').trim();
            var folderPath = prompt('Enter the folder path:', defaultFolderPath);
            if (folderPath && confirm('Do you want to upload all files to ' + folderPath + '?')) {
                scope.$apply(function() {
                    remoteUploadAllToSpecificFolder(folderPath);
                });
            }
        });
        existingButton.parentNode.appendChild(specificFolderButton);
    }

    // Function to create a button
    function createButton(text, onClick) {
        var button = document.createElement('a');
        button.href = 'javascript:void(0);';
        button.className = 'btn btn-default';
        button.style.marginTop = '10px';
        button.innerHTML = '<i class="ico-upload-alt"></i> ' + text;
        button.onclick = onClick;
        return button;
    }

    // Function to handle the remote upload with parameters
    function remoteUploadAllWithParams() {
        handleRemoteUpload(function(row) {
            var fileName = row.querySelector('td.ng-binding').innerText.trim();
            if (!fileName.startsWith('/')) {
                fileName = '/' + fileName;
            }
            return fileName.substring(0, fileName.lastIndexOf('/') + 1);
        });
    }

    // Function to handle the remote upload to a specific folder
    function remoteUploadAllToSpecificFolder(folderPath) {
        handleRemoteUpload(function() {
            return folderPath;
        });
    }

    // Function to handle the remote upload
    function handleRemoteUpload(getFolderPath) {
        var rows = document.querySelectorAll('tr[ng-repeat="file in fileContent"]');
        var promises = [];
        var hasFailures = false;
        var remoteOptionId = GM_getValue('remoteOptionId');
        var remotePath = GM_getValue('remotePath');

        rows.forEach(function(row) {
            var fileName = row.querySelector('td.ng-binding').innerText.replace(/[⚫✔️❌]/g, '').trim();
            var href = row.querySelector('a[ng-href]').href;
            var fileExt = fileName.split('.').pop();

            if (SKIP_EXTENSIONS.includes(fileExt)) {
                addStatusIcon(row, '⚫', 'black');
                return;
            }

            var folderPath = getFolderPath(row);
            if (remotePath) {
                folderPath = remotePath.replace(/\/$/, '') + '/' + folderPath.replace(/^\//, '');
            }

            var postData = {
                url: href,
                remoteOptionId: remoteOptionId,
                folderId: folderPath
            };

            var promise = fetch('https://offcloud.com/api/remote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            }).then(response => response.json())
              .then(data => {
                  if (data.status === 'created' && data.requestId) {
                      addStatusIcon(row, '✔️', 'green');
                  } else {
                      hasFailures = true;
                      addStatusIcon(row, '❌', 'red');
                  }
              }).catch(() => {
                  hasFailures = true;
                  addStatusIcon(row, '❌', 'red');
              });

            promises.push(promise);
        });

        Promise.all(promises).then(() => {
            showBanner(hasFailures ? 'Some files failed to queue remotely' : 'All files are remotely queued', hasFailures ? '#d9534f' : '#5cb85c');
        });
    }

    // Function to add status icon to a row
    function addStatusIcon(row, icon, color) {
        var statusIcon = document.createElement('span');
        statusIcon.innerHTML = icon;
        statusIcon.style.color = color;
        row.querySelector('td.ng-binding').appendChild(statusIcon);
    }

    // Function to show a banner
    function showBanner(message, backgroundColor) {
        var banner = document.createElement('div');
        banner.innerHTML = message;
        banner.style.backgroundColor = backgroundColor;
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.width = '100%';
        banner.style.color = 'white';
        banner.style.textAlign = 'center';
        banner.style.padding = '10px';
        document.body.appendChild(banner);

        setTimeout(() => {
            banner.remove();
        }, BANNER_TIMEOUT);
    }

    // Start the script - Moved this start logic to customScript function
    //waitForAngular();
})();