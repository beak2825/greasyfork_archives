// ==UserScript==
// @name         Scratch Admin Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  これで君もST😎
// @author
// @match        https://scratch.mit.edu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536273/Scratch%20Admin%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/536273/Scratch%20Admin%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const collapsedHTML = `<span class="toggle">&gt;</span>`;

    const expandedHTML = `
        <span class="toggle">x</span>
        <div class="admin-header"><h3>Admin Panel</h3></div>
        <div class="admin-content">
            <dl>
                <dt>Tools</dt>
                <dd>
                    <ul>
                        <li><a href="/scratch_admin/tickets">Ticket Queue</a></li>
                        <li><a href="/scratch_admin/ip-search/">IP Search</a></li>
                        <li><a href="/scratch_admin/email-search/">Email Search</a></li>
                    </ul>
                </dd>
                <dt>Homepage Cache</dt>
                <dd>
                    <ul class="cache-list">
                        <li>
                            <div class="button-row">
                                <span>Refresh row data:</span>
                                <button class="button notrequested"><span>Refresh</span></button>
                            </div>
                        </li>
                    </ul>
                </dd>
                <dt>Page Cache</dt>
                <dd>
                    <ul class="cache-list">
                        <li>
                            <form action="/scratch_admin/page/clear-anon-cache/" method="post">
                                <input name="path" type="hidden" value="/">
                                <div class="button-row">
                                    <span>For anonymous users:</span>
                                    <button class="button" type="submit"><span>Clear</span></button>
                                </div>
                            </form>
                        </li>
                    </ul>
                </dd>
            </dl>
        </div>
    `;

    const parentSelector = '#view > div > div:nth-child(2)';

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement(parentSelector, (parent) => {
        const panel = document.createElement('div');
        panel.className = 'admin-panel splash-admin-panel collapsed';
        panel.innerHTML = collapsedHTML;
        parent.prepend(panel);

        panel.addEventListener('click', (e) => {
            if (!e.target.classList.contains('toggle')) return;

            if (panel.classList.contains('collapsed')) {
                panel.classList.remove('collapsed');
                panel.innerHTML = expandedHTML;
            } else {
                panel.classList.add('collapsed');
                panel.innerHTML = collapsedHTML;
            }
        });
    });
})();
