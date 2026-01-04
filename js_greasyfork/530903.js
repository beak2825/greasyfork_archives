// ==UserScript==
// @name         Github Actions: Dispatch Workflow with Active Branch
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Userscript allowing you to select active branches when dispatching a workflow
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530903/Github%20Actions%3A%20Dispatch%20Workflow%20with%20Active%20Branch.user.js
// @updateURL https://update.greasyfork.org/scripts/530903/Github%20Actions%3A%20Dispatch%20Workflow%20with%20Active%20Branch.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('github-actions-workflow-dispatch-active-branch');

    const getActiveBranch = async () => (await fetch(`https://github.com/${window.location.pathname.match(/\/([^\/]*\/[^\/]*)/)[1]}/branches/active`, {
        "headers": {
            "accept": "application/json",
        },
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })).json();

    const getClientEnv = function () {
        if ("undefined" != typeof document) {
            let e = document.getElementById("client-env");
            if (e)
                try {
                    return JSON.parse(e.textContent || "")
                } catch (e) {
                    console.error("Error parsing client-env", e)
                }
        }
    }
    const userLogin = getClientEnv().login;
    const watchElement = (selector, onShow) => {
        let el;
        let onHide;
        const work = () => {
            const targetEl = document.querySelector(selector);
            if (!el && targetEl) {
                el = targetEl;
                onHide = onShow?.(el);
            } else if (el && !targetEl) {
                el = undefined;
                onHide?.();
            }
        }
        const it = setInterval(work, 100);
        return () => clearInterval(it);
    }


    watchElement('details.details-overlay[open] .workflow-dispatch', (wf) => {
        let cleanup;
        getActiveBranch().then(res => {
            let controls;
            cleanup = watchElement('details.details-overlay[open] .branch-selection .details-overlay[open] #ref-list-branches', (el) => {
                controls = document.createElement('div');
                controls.id = "github-actions-use-active-branch-branches";
                controls.innerHTML = `
                    ${res.payload.branches.map(b => `
                        <div class="SelectMenu-item" style="background-color:${b.author.login == userLogin ? '#8882' : 'inherit'}" data-name="${b.name}"><b class="css-truncate css-truncate-overflow" style="width:64px;">${b.author.login}</b><span class="flex-1 css-truncate css-truncate-overflow ">${b.name}</span></div>
                        `).join('')}
                `;

                el.append(controls);

                const filterInput = el.closest('.workflow-dispatch').querySelector('.SelectMenu-filter input');
                const handler = () => {
                    if (filterInput.value.length > 0) {
                        controls.style.display = 'none';
                        el.querySelector('.SelectMenu-list').style.display = 'block';
                    } else {
                        controls.style.display = 'block';
                        el.querySelector('.SelectMenu-list').style.display = 'none';
                    }
                }
                filterInput.addEventListener('input', handler);
                handler();

                controls.querySelectorAll('.SelectMenu-item').forEach(item => {
                    item.addEventListener('click', () => {
                        filterInput.value = item.dataset.name;
                        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
                        el.querySelector('.SelectMenu-item[value="' + item.dataset.name + '"]').click();
                    });
                });

                return () => {
                    if (controls) {
                        controls.remove();
                    }
                }
            });
        }).catch(console.error);
        return () => {
            cleanup?.();
        }
    });

    // Your code here...
})();