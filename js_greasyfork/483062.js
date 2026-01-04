// ==UserScript==
// @name         Jenkins quick build
// @namespace    http://tampermonkey.net/
// @version      2023-12-22
// @description  quick build from list
// @author       Rex
// @match        *://*/view/*
// @match        *://*/job/*
// @match        *://*/user/*/my-views/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483062/Jenkins%20quick%20build.user.js
// @updateURL https://update.greasyfork.org/scripts/483062/Jenkins%20quick%20build.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isListPage = !!document.querySelector('body[data-model-type="hudson.model.ListView"]');
    const isBuildPage = !!document.querySelector('body[data-model-type="hudson.model.ParametersDefinitionProperty"]');

    function initPopupBuildPage() {
        // try to get git-branch from url
        let urlParams = new URLSearchParams(window.location.search);
        let branch = urlParams.get('git-branch');
        if (branch) {
            let branchInput = document.querySelector('input[value=git_branch]+input[name=value]');
            if (branchInput) {
                branchInput.value = branch;

                document.querySelector('input[value=git_branch]').insertAdjacentHTML('afterend', /*html*/`last branch: <span style='cursor:copy; user-select: all'>${branch}</span>`);
            }
        }

        if (window.top !== window.self) {
            // hide other elements
            let hiddenCss = document.createElement('style');
            document.head.appendChild(hiddenCss);
            hiddenCss.innerHTML = `
                #side-panel,
                #page-head,
                #menuSelector,
                .page-footer {
                    display: none;
                }
            `;

            window.addEventListener('submit', (e) => {
                document.querySelector('button[type=submit]').disable();
                window.parent.postMessage({ type: 'build', branch: branch }, '*'); // notify project built.
            });
        }
    }

    function initListPage() {
        let header = document.querySelector('div.dashboard table#projectstatus tr.header');
        if (!header) {
            return; // no header found.
        }

        let columns = Array.from(header.querySelectorAll('th'));
        let gitBranchColumnIndex = columns.findIndex((el) => el.textContent && el.textContent.trim() === 'Git Branches');
        let buildColumnIndex = columns.findIndex((el) => el.getAttribute('width') == 1);
        if (buildColumnIndex === -1) {
            return; // no columns found.
        }

        let projects = Array.from(document.querySelectorAll('div.dashboard table#projectstatus tr[id]'));
        if (projects.length === 0) {
            return; // no project items found.
        }

        projects.forEach((project) => {
            let branch = gitBranchColumnIndex === -1 ? '' : project.childNodes[gitBranchColumnIndex].textContent.trim();
            let buildColumn = project.childNodes[buildColumnIndex];

            if (gitBranchColumnIndex > -1) {
                let gitBranchColumn = project.childNodes[gitBranchColumnIndex];
                gitBranchColumn.style.cursor = 'copy';
                gitBranchColumn.style.userSelect = 'all';
            }

            let link = buildColumn.querySelector('a[href]');
            if (!link) {
                return;
            }

            let buildUrl = link.href;
            link.href = link.href + '&git-branch=' + branch;

            const buildButton = new DOMParser().parseFromString(/* html */ `
                <button style="position: absolute; margin: 0 7px 0 7px;">quick</button>
            `, 'text/html').body.firstChild;

            buildColumn.appendChild(buildButton);
            buildButton.onclick = (e) => {
                popupBuildPageModal(buildUrl + '&git-branch=' + branch);
            }
        })

        window.addEventListener('message', (e) => {
            if (e.data.type === 'build') {
                setTimeout(() => { window.location.reload(); }, 500);
            }
        })
    }

    function popupBuildPageModal(src) {
        let modal = document.querySelector('dialog#popupBuildPage');
        if (!modal) {
            modal = document.createElement('dialog');
            modal.id = 'popupBuildPage';
            modal.style = 'width: 600px; height: 600px;';
            modal.innerHTML = /* html */ `
                <button id="closePopupBuildPage"
                        style='position: absolute; right: 0; top: 0; margin: 5px;'
                        onclick='document.querySelector("dialog#popupBuildPage").close()'>
                    Close
                </button>
                <iframe sandbox="
                    allow-same-origin
                    allow-scripts
                    allow-forms
                    allow-popups
                    allow-modals
                    allow-popups-to-escape-sandbox
                    allow-top-navigation"
                    style="width: 100%; height: 100%; border: none; padding: 5px;">
                </iframe>
            `;

            document.body.appendChild(modal);
        }

        modal.querySelector('iframe').src = src;
        modal.showModal();
    }

    // detect page.
    if (isListPage) {
        initListPage();
    } else if (isBuildPage) {
        initPopupBuildPage();
    }
})();
