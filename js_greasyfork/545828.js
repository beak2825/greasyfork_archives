// ==UserScript==
// @name         Sync Repo to Local Gitea
// @namespace    https://github.com/flaging/greasy-plugin.git
// @version      1.0
// @description  Add a button to mirror the current repository to Gitea
// @author       flaging
// @match        https://github.com/*/*
// @match        https://gitee.com/*/*
// @match        https://gitlab.com/*/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545828/Sync%20Repo%20to%20Local%20Gitea.user.js
// @updateURL https://update.greasyfork.org/scripts/545828/Sync%20Repo%20to%20Local%20Gitea.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // Load configuration from storage
  let giteaBaseUrl = GM_getValue('giteaBaseUrl', '');
  let giteaToken = GM_getValue('giteaToken', '');

  function addMirrorButton() {
      // Check if we're on a repository page
      const repoPath = window.location.pathname.match(/^\/([^/]+)\/([^/]+)(?:\/|$)/);
      if (repoPath) {
          // Get the username and repository name from the URL
          const owner = repoPath[1];
          const repo = repoPath[2];

          // Determine the platform based on the current URL
          const platform = getPlatform();

          // Create the mirror button
          const mirrorButton = document.createElement('button');
          mirrorButton.classList.add('btn', 'btn-sm', 'btn-outline', 'ml-2');
          mirrorButton.style.position = 'fixed';
          mirrorButton.style.bottom = '20px';
          mirrorButton.style.right = '70px';
          mirrorButton.style.zIndex = '9999';
          mirrorButton.title = `Mirror Repository to Gitea`;

          // Add the Emoji light bulb icon
          mirrorButton.textContent = `💡 Mirror to Gitea`;

          // Append the button to the page
          document.body.appendChild(mirrorButton);

          // Add click event listener to the button
          mirrorButton.addEventListener('click', () => {
              if (!giteaBaseUrl || !giteaToken) {
                  alert('Please configure Gitea Base URL and Token first.');
                  openConfigModal();
              } else {
                  createMirrorInGitea(owner, repo, platform);
              }
          });
      }
  }

  function createMirrorInGitea(owner, repo, platform) {
      const payload = {
          clone_addr: `https://github.com/${owner}/${repo}`,
          description: '',
          repo_name: repo,
          repo_owner: platform,
          private: false,
          auto_init: false,
          mirror: true,
          issues: true,
          pull_requests: true,
          wiki: true,
          labels: true,
          milestones: true,
          releases: true,
          git_content: true,
          lfs: true,
          avatar: '',
          template: false,
          default_branch: ''
      };

      GM_xmlhttpRequest({
          method: 'POST',
          url: `${giteaBaseUrl}/api/v1/repos/migrate`,
          headers: {
              'Authorization': `token ${giteaToken}`,
              'Content-Type': 'application/json'
          },
          data: JSON.stringify(payload),
          onload: function(response) {
              if (response.status === 201) {
                  alert('Repository mirrored successfully!');
              } else {
                  alert('Failed to mirror repository: ' + response.responseText);
              }
          },
          onerror: function(error) {
              console.error('Error:', error);
              alert('An error occurred while mirroring the repository.');
          }
      });
  }

  function openConfigModal() {
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.id = 'gitea-config-modal';
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0';
      modalContainer.style.left = '0';
      modalContainer.style.width = '100%';
      modalContainer.style.height = '100%';
      modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modalContainer.style.display = 'flex';
      modalContainer.style.justifyContent = 'center';
      modalContainer.style.alignItems = 'center';
      modalContainer.style.zIndex = '10000';

      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = '#fff';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '5px';
      modalContent.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

      // Create form elements
      const titleLabel = document.createElement('h3');
      titleLabel.textContent = 'Configure Gitea Settings';

      const baseUrlLabel = document.createElement('label');
      baseUrlLabel.for = 'gitea-base-url';
      baseUrlLabel.textContent = 'Gitea Base URL:';

      const baseUrlInput = document.createElement('input');
      baseUrlInput.type = 'text';
      baseUrlInput.id = 'gitea-base-url';
      baseUrlInput.value = giteaBaseUrl;
      baseUrlInput.style.width = '100%';
      baseUrlInput.style.marginBottom = '10px';
      baseUrlInput.style.padding = '8px';

      const tokenLabel = document.createElement('label');
      tokenLabel.for = 'gitea-token';
      tokenLabel.textContent = 'Gitea Token:';

      const tokenInput = document.createElement('input');
      tokenInput.type = 'password';
      tokenInput.id = 'gitea-token';
      tokenInput.value = giteaToken;
      tokenInput.style.width = '100%';
      tokenInput.style.marginBottom = '10px';
      tokenInput.style.padding = '8px';

      const saveButton = document.createElement('button');
      saveButton.className = 'btn btn-primary';
      saveButton.textContent = 'Save';

      saveButton.addEventListener('click', () => {
          giteaBaseUrl = baseUrlInput.value.trim();
          giteaToken = tokenInput.value.trim();
          GM_setValue('giteaBaseUrl', giteaBaseUrl);
          GM_setValue('giteaToken', giteaToken);
          document.body.removeChild(modalContainer);
      });

      // Append elements to modal content
      modalContent.appendChild(titleLabel);
      modalContent.appendChild(baseUrlLabel);
      modalContent.appendChild(baseUrlInput);
      modalContent.appendChild(tokenLabel);
      modalContent.appendChild(tokenInput);
      modalContent.appendChild(saveButton);

      // Append modal content to modal container
      modalContainer.appendChild(modalContent);

      // Append modal container to body
      document.body.appendChild(modalContainer);
  }

  function getPlatform() {
      const host = window.location.host;
      if (host.includes('github')) {
          return 'github';
      } else if (host.includes('gitee')) {
          return 'gitee';
      } else if (host.includes('gitlab')) {
          return 'gitlab';
      } else if (host.includes('gitea')) {
          return 'gitea';
      }
      return 'unknown';
  }

  // Add the mirror button when the page loads
  window.addEventListener('load', addMirrorButton);
})();
