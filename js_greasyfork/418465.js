// ==UserScript==
// @match       https://github.com/*/*/actions
// @name        GitHub Actions notifications
// @description Enable desktop notifications for GitHub Actions updates
// @grant       GM_notification
// @version     1.0.2
// @author      KaKi87
// @license     GPL-3.0-or-later
// @namespace   https://git.kaki87.net/KaKi87/userscripts/src/branch/master/GitHubActionsNotifications
// @downloadURL https://update.greasyfork.org/scripts/418465/GitHub%20Actions%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/418465/GitHub%20Actions%20notifications.meta.js
// ==/UserScript==

const
    _username = document.querySelector('img[alt^="@"]').alt.slice(1),
    _lastActionStatus = {},
    getActions = () => [...document.querySelectorAll('[id^="check_suite"]')].map(el => {
        let status;
        const
            svgClassList = el.querySelector('svg').classList,
            titleLink = el.querySelector('a');
        if(svgClassList.contains('octicon-check-circle-fill'))
            status = 'success';
        if(svgClassList.contains('octicon-x-circle-fill'))
            status = 'failure';
        if(svgClassList.contains('octicon-stop'))
            status = 'aborted';
        if(svgClassList.contains('anim-rotate'))
            status = 'in progress';
        if(svgClassList.contains('octicon-dot-fill'))
            status = 'idle';
        return {
            id: parseInt(titleLink.href.split('/').slice(-1)[0]),
            title: titleLink.textContent,
            status,
            author: el.querySelector('a[data-hovercard-type]').textContent
        };
    });

getActions().forEach(action => _lastActionStatus[action.id] = action.status);

(new MutationObserver(() => getActions().forEach(action => {
    if(_lastActionStatus[action.id] !== action.status && action.author === _username) GM_notification({
        title: `GitHub Actions update (${action.id})`,
        text: `${action.title}\nStatus : ${action.status}`,
        image: 'https://git.kaki87.net/KaKi87/userscripts/raw/branch/master/GitHubActionsNotifications/assets/logo_github.png'
    });
    _lastActionStatus[action.id] = action.status;
}))).observe(document.querySelector('#partial-actions-workflow-runs'), { childList: true });