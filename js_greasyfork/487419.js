// ==UserScript==
// @name         CurseForge Get
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Adds direct "Get" download buttons across CurseForge for all games, categories, and resources, including mods, modpacks, maps, plugins, etc., simplifying access to downloads.
// @author       Vulpeep
// @homepage     https://github.com/vulpeep
// @match        https://*.curseforge.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487419/CurseForge%20Get.user.js
// @updateURL https://update.greasyfork.org/scripts/487419/CurseForge%20Get.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .btn-get {
              background-color: #1ea7b8!important;
            }
            .btn-get:hover {
              background-color: #3bc0d1!important;
            }
          `;
        document.head.appendChild(style);
    }

    function updateOrAddHeaderGetButton() {
        const projectHeaderActions = document.querySelector('.project-header > .actions > .split-button');
        if (projectHeaderActions) {
            const downloadButton = projectHeaderActions.querySelector('a.download-cta');
            if (downloadButton) {
                const href = downloadButton.getAttribute('href');
                const fileId = href.split('/').pop();
                const newHref = `/api/v1/mods/0/files/${fileId}/download`;

                let customButton = projectHeaderActions.querySelector('a.btn-get');
                if (!customButton) {
                    customButton = document.createElement('a');
                    customButton.setAttribute('class', 'btn-cta btn-get');
                    customButton.innerHTML = '<svg class="smaller-icon"><use href="/images/sprite.svg#icon-download"></use></svg><span>Get</span>';
                    projectHeaderActions.appendChild(customButton);
                }

                customButton.setAttribute('href', newHref);
            }
        }
    }

    function addGetButtonToFileRows(fileRowElement) {
        const fileRowDetails = fileRowElement.querySelector('.file-row-details');
        const href = fileRowDetails.getAttribute('href');
        const fileId = href.split('/').pop();
        const kebabMenu = fileRowElement.querySelector('.kebab-menu');
        const moreOptions = kebabMenu.querySelector('ul');

        if (moreOptions && !moreOptions.querySelector('.btn-get')) {
            const newHref = `/api/v1/mods/0/files/${fileId}/download`;
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${newHref}"><svg class="smaller-icon"><use href="/images/sprite.svg#icon-download"></use></svg>Get</a>`;

            listItem.querySelector('a').addEventListener('click', (event) => {
                kebabMenu.classList.remove('is-open');
                event.stopPropagation();
            });

            moreOptions.appendChild(listItem);
        }
    }

    function addGetButtonToMemberProjectCard(memberProjectCardElement) {
        const actions = memberProjectCardElement.querySelector('.actions .split-button');
        if (actions) {
            const downloadButton = actions.querySelector('a.download-cta');
            if (downloadButton) {
                const href = downloadButton.getAttribute('href');
                const fileId = href.split('/').pop();

                if (fileId === 'download') return;

                const newHref = `/api/v1/mods/0/files/${fileId}/download`;
                const getButton = document.createElement('a');
                getButton.innerHTML = '<svg class="smaller-icon"><use href="/images/sprite.svg#icon-download"></use></svg><span>Get</span>';
                getButton.setAttribute('class', 'btn-cta btn-get');
                getButton.setAttribute('href', newHref);

                getButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                });

                actions.appendChild(getButton);
            }
        }
    }

    function addGetButtonToProjectCard(projectCardElement) {
        const actions = projectCardElement.querySelector('.actions-container .split-button');
        if (actions) {
            const downloadButton = actions.querySelector('a.download-cta');
            if (downloadButton) {
                const href = downloadButton.getAttribute('href');
                const fileId = href.split('/').pop();

                if (fileId === 'download') return;

                const newHref = `/api/v1/mods/0/files/${fileId}/download`;
                const getButton = document.createElement('a');
                getButton.innerHTML = '<svg class="smaller-icon"><use href="/images/sprite.svg#icon-download"></use></svg><span>Get</span>';
                getButton.setAttribute('class', 'btn-cta btn-get');
                getButton.setAttribute('href', newHref);

                getButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                });

                actions.appendChild(getButton);
            }
        }
    }

    function getFileIdFromUrl() {
        const pathParts = window.location.pathname.split('/');
        const fileIdIndex = pathParts.findIndex(part => part === 'files') + 1;
        return fileIdIndex < pathParts.length ? pathParts[fileIdIndex] : null;
    }

    function updateOrAddFileDetailsGetButton(fileDetailsActionsElement) {
        const fileId = getFileIdFromUrl();
        if (!fileId) return;

        const newHref = `/api/v1/mods/0/files/${fileId}/download`;

        let customButton = fileDetailsActionsElement.querySelector('a.btn-get');
        if (!customButton) {
            customButton = document.createElement('a');
            customButton.setAttribute('class', 'btn-cta btn-get');
            customButton.innerHTML = '<svg class="smaller-icon"><use href="/images/sprite.svg#icon-download"></use></svg><span>Get</span>';
            fileDetailsActionsElement.appendChild(customButton);
        }

        customButton.setAttribute('href', newHref);
    }

    function onModalAdded(modalElement) {
        const actionsElement = modalElement.querySelector('.actions');

        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn-primary btn-get';
        downloadButton.textContent = 'Get';

        downloadButton.onclick = function () {
            const fileCard = modalElement.querySelector('a.file-card');
            if (fileCard) {
                const href = fileCard.getAttribute('href');
                const fileId = href.split('/').pop();
                window.location.href = `/api/v1/mods/0/files/${fileId}/download`;
            }
        };

        if (actionsElement) {
            actionsElement.insertBefore(downloadButton, actionsElement.firstChild);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    console.log(node.classList);
                    if (node.classList.contains('modal-container') && node.querySelector('.download-details')) {
                        onModalAdded(node);
                    }
                    if (node.classList.contains('file-details')) {
                        updateOrAddFileDetailsGetButton(node.querySelector('.actions .split-button'));
                    }
                    if (node.classList.contains('file-row')) {
                        addGetButtonToFileRows(node);
                    }
                    if (node.classList.contains('results-container')) {
                        node.querySelectorAll('.project-card').forEach(addGetButtonToProjectCard);
                    }
                    if (node.classList.contains('member-projects-cards-list')) {
                        node.querySelectorAll('.member-project-card').forEach(addGetButtonToMemberProjectCard);
                    }
                }
            });
        });
    });

    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(document, config);

    window.addEventListener('popstate', () => {
        updateOrAddFileDetailsGetButton(document.querySelector('.file-details .actions .split-button'));
        updateOrAddHeaderGetButton();
    });

    addStyles();

    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(addGetButtonToProjectCard);
        document.querySelectorAll('.member-project-card').forEach(addGetButtonToMemberProjectCard);
        updateOrAddHeaderGetButton();
    }, 0);
})();