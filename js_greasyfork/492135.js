// ==UserScript==
// @name         Upload To Gitlab Button for Claude.ai Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds an "Upload To Gitlab" button before the chat controls on Claude.ai chat pages
// @match        https://claude.ai/chat/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492135/Upload%20To%20Gitlab%20Button%20for%20Claudeai%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/492135/Upload%20To%20Gitlab%20Button%20for%20Claudeai%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the "Upload To Gitlab" button
    function createUploadToGitlabButton() {
        const uploadButton = document.createElement('button');
        uploadButton.textContent = 'Upload To Gitlab';
        uploadButton.id = 'upload-to-gitlab-btn';
        uploadButton.style.backgroundColor = 'blue';
        uploadButton.style.color = 'white';
        uploadButton.style.padding = '5px 10px';
        uploadButton.style.borderRadius = '5px';
        uploadButton.style.marginRight = '10px';
        uploadButton.addEventListener('click', openModal);
        return uploadButton;
    }

    // Function to open the modal
    function openModal() {
        const modal = document.createElement('div');
        modal.id = 'gitlab-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'hsl(var(--bg-200)/var(--tw-bg-opacity))';
        modal.style.padding = '20px';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <h2>Upload To Gitlab</h2>
            <form id="gitlab-form">
                <label for="gitlab-domain">Gitlab Domain:</label>
                <input type="text" id="gitlab-domain" name="gitlab-domain" required style="background-color: hsl(var(--bg-200)/var(--tw-bg-opacity));"><br>
                <label for="gitlab-token">Gitlab Token:</label>
                <input type="text" id="gitlab-token" name="gitlab-token" required style="background-color: hsl(var(--bg-200)/var(--tw-bg-opacity));"><br>
                <label for="gitlab-project-id">Gitlab Project ID:</label>
                <input type="text" id="gitlab-project-id" name="gitlab-project-id" required style="background-color: hsl(var(--bg-200)/var(--tw-bg-opacity));"><br>
                <label for="project-branch">Project Branch:</label>
                <input type="text" id="project-branch" name="project-branch" required style="background-color: hsl(var(--bg-200)/var(--tw-bg-opacity));"><br>
                <label for="file-path">Path:</label>
                <input type="text" id="file-path" name="file-path" style="background-color: hsl(var(--bg-200)/var(--tw-bg-opacity));"><br>
                <div style="text-align: right;">
                    <button type="button" id="close-modal-btn" style="margin-right: 10px;">X</button>
                    <button type="submit" style="background-color: green; color: white;">Upload</button>
                </div>
            </form>
        `;
        document.body.appendChild(modal);

        // Populate form fields with saved data
        const gitlabDomain = localStorage.getItem('gitlab-domain');
        const gitlabToken = localStorage.getItem('gitlab-token');
        const gitlabProjectId = localStorage.getItem('gitlab-project-id');
        const projectBranch = localStorage.getItem('project-branch');
        const filePath = localStorage.getItem('file-path');
        if (gitlabDomain) {
            document.getElementById('gitlab-domain').value = gitlabDomain;
        }
        if (gitlabToken) {
            document.getElementById('gitlab-token').value = gitlabToken;
        }
        if (gitlabProjectId) {
            document.getElementById('gitlab-project-id').value = gitlabProjectId;
        }
        if (projectBranch) {
            document.getElementById('project-branch').value = projectBranch;
        }
        if (filePath) {
            document.getElementById('file-path').value = filePath;
        }

        // Handle form submission
        document.getElementById('gitlab-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const gitlabDomain = document.getElementById('gitlab-domain').value.replace(/^https?:\/\//, '').replace(/\/$/, '');
            const gitlabToken = document.getElementById('gitlab-token').value;
            const gitlabProjectId = document.getElementById('gitlab-project-id').value;
            const projectBranch = document.getElementById('project-branch').value;
            const filePath = document.getElementById('file-path').value.trim();

            // Save form data in localStorage
            localStorage.setItem('gitlab-domain', gitlabDomain);
            localStorage.setItem('gitlab-token', gitlabToken);
            localStorage.setItem('gitlab-project-id', gitlabProjectId);
            localStorage.setItem('project-branch', projectBranch);
            localStorage.setItem('file-path', filePath);

            // Close the modal
            document.body.removeChild(modal);

            // Fetch data from the API and upload to Gitlab
            uploadToGitlab(gitlabDomain, gitlabToken, gitlabProjectId, projectBranch, filePath);
        });

        // Handle modal close button click
        document.getElementById('close-modal-btn').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // Function to check if the file exists on Gitlab
    function checkFileExists(gitlabDomain, gitlabToken, gitlabProjectId, projectBranch, filePath) {
        const checkFileUrl = `https://${gitlabDomain}/api/v4/projects/${gitlabProjectId}/repository/files/${encodeURIComponent(filePath)}?ref=${projectBranch}`;
        return fetch(checkFileUrl, {
            method: 'GET',
            headers: {
                'PRIVATE-TOKEN': gitlabToken
            }
        }).then(response => {
            if (response.status === 200) {
                return true;
            } else if (response.status === 404) {
                return false;
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        });
    }

    // Function to upload data to Gitlab
    function uploadToGitlab(gitlabDomain, gitlabToken, gitlabProjectId, projectBranch, userFilePath) {
        const cacheName = 'apis';
        caches.open(cacheName).then(function(cache) {
            cache.keys().then(function(requests) {
                let organizationId = null;
                requests.forEach(function(request) {
                    if (request.url.includes('https://claude.ai/api/organizations/')) {
                        const parts = request.url.split('/');
                        const index = parts.indexOf('organizations');
                        if (index !== -1 && parts.length > index + 1) {
                            organizationId = parts[index + 1];
                        }
                    }
                });
                console.log('Organization ID (from cache):', organizationId);

                // Get the current chat ID from the browser URL
                const currentUrl = window.location.href;
                const chatId = currentUrl.split('/').pop();
                console.log('Current Chat ID (from URL):', chatId);

                // Fetch JSON data from the API URL
                const apiUrl = `https://claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}`;
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log('API Response:', data);

                        const filePath = userFilePath ? `${userFilePath.replace(/\/$/, '')}/${chatId}.json` : `${chatId}.json`;
                        checkFileExists(gitlabDomain, gitlabToken, gitlabProjectId, projectBranch, filePath)
                            .then(fileExists => {
                                const action = fileExists ? 'update' : 'create';

                                // Prepare the payload for Gitlab API request
                                const payload = {
                                    branch: projectBranch,
                                    commit_message: `${action === 'create' ? 'Add' : 'Update'} chat: ${data.name}`,
                                    actions: [
                                        {
                                            action: action,
                                            file_path: filePath,
                                            content: JSON.stringify(data, null, 2)
                                        }
                                    ]
                                };

                                // Make the Gitlab API request to create or update the file
                                const gitlabUrl = `https://${gitlabDomain}/api/v4/projects/${gitlabProjectId}/repository/commits`;
                                fetch(gitlabUrl, {
                                    method: 'POST',
                                    headers: {
                                        'PRIVATE-TOKEN': gitlabToken,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(payload)
                                })
                                    .then(response => {
                                        if (response.status === 401) {
                                            alert('Unauthorized: Invalid Gitlab token');
                                        } else if (response.status !== 201) {
                                            return response.json().then(data => {
                                                throw new Error(JSON.stringify(data));
                                            });
                                        } else {
                                            return response.json();
                                        }
                                    })
                                    .then(data => {
                                        console.log('Gitlab API Response:', data);
                                        window.open(data.web_url, '_blank');
                                    })
                                    .catch(error => {
                                        console.error('Error uploading to Gitlab:', error);
                                        alert(`Failed to upload chat to Gitlab. Error: ${error.message}`);
                                    });
                            })
                            .catch(error => {
                                console.error('Error checking file existence:', error);
                                alert('Failed to check file existence on Gitlab.');
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching API data:', error);
                        alert('Failed to fetch chat data from the API.');
                    });
            });
        });
    }

    // Function to insert the "Upload To Gitlab" button before the chat controls
    function insertUploadToGitlabButton() {
        const chatControls = document.querySelector('[data-testid="chat-controls"]');
        const existingButton = document.getElementById('upload-to-gitlab-btn');
        if (chatControls && !existingButton) {
            const uploadButton = createUploadToGitlabButton();
            chatControls.parentNode.insertBefore(uploadButton, chatControls);
        }
    }

    // Observe changes in the DOM and insert the "Upload To Gitlab" button when the chat controls appear
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                insertUploadToGitlabButton();
            }
        });
    });

    // Configure the observer to watch for changes in the entire document
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    // Insert the "Upload To Gitlab" button initially if the chat controls are already present
    insertUploadToGitlabButton();
})();
