// ==UserScript==
// @name         BitBucket Advanced Statuses
// @version      1.0
// @description  Show advanced statuses
// @icon         https://clipground.com/images/png-connection-status.png
// @author       Mihai Stancu
// @license      MIT
// @namespace    msus
// @match        https://bitbucket.org/*/*/pull-requests*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/475885/BitBucket%20Advanced%20Statuses.user.js
// @updateURL https://update.greasyfork.org/scripts/475885/BitBucket%20Advanced%20Statuses.meta.js
// ==/UserScript==

(() => new MutationObserver(main).observe(document.querySelector('body'), {childList: true, subtree: true}))();

function main(mutations, observer) {
    const PRs = document.querySelectorAll('[data-qa=pull-request-row]');
    if (!PRs[0]) {
        return;
    }

    observer.disconnect();
    const table = PRs[0].closest('table');

    table.insertAdjacentHTML('beforeend', '<tbody class="pseudo-header"><tr><th colspan=15>Approved</th></tr></tbody>');
    table.insertAdjacentHTML('beforeend', '<tbody class="approved"></tbody>');
    table.insertAdjacentHTML('beforeend', '<tbody class="pseudo-header"><tr><th colspan=15>Needs review</th></tr></tbody>');
    table.insertAdjacentHTML('beforeend', '<tbody class="needs-review"></tbody>');
    table.insertAdjacentHTML('beforeend', '<tbody class="pseudo-header"><tr><th colspan=15>In progress</th></tr></tbody>');
    table.insertAdjacentHTML('beforeend', '<tbody class="in-progress"></tbody>');

    for (const PR of PRs) {
        table.querySelector('tbody.' + status(PR)).appendChild(PR);
    }
}


/**
 * @param {Element} item
 *
 * @returns {string}
 */
function status(item) {
    /** If changes have been requested => in progress */
    const rejection = item.querySelector('[aria-label="avatar group"] [alt*=" requested changes "]');
    if (rejection) {
        return 'in-progress';
    }

    /** If there are open tasks => in progress */
    const activities = item.querySelectorAll('td:nth-child(2)')
    for (const activity of activities) {
        if (activity.innerHTML.includes(' open tasks')) {
            return 'in-progress';
        }
    }

    /** If there are open tasks => in progress */
    const avatars = item.querySelectorAll('[aria-label="avatar group"] img[alt]');
    const approvals = item.querySelectorAll('[aria-label="avatar group"] img[alt*=" approved "]');
    if (approvals.length >= 1 && avatars.length === approvals.length) {
        return 'approved';
    }

    if (approvals.length >= 2) {
        return 'approved';
    }

    return 'needs-review';
}

GM_addStyle(`
    .pseudo-header {
        border-bottom: 0px;
    }
    .pseudo-header th {
        padding-top: 32px;
    }

    tbody.needs-review {
        border-bottom: 0;
        border-top: 2px solid #FFAB00;
    }
    tbody.approved {
        border-bottom: 0;
        border-top: 2px solid #00875A;
    }
    tbody.in-progress {
        border-bottom: 0;
        border-top: 2px solid #DE350B;
    }
`);
