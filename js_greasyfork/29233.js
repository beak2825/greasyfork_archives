// ==UserScript==
// @name          Atlassian JIRA - Auto-expand older comments
// @description   Automatically expands the older comments accordion in JIRA so you see all comments by default. Workaround to jira.comment.collapsing.minimum.hidden. Aids in searching page.
// @include       https://jira.*
// @include       http://jira.*
// @match         https://jira.*
// @match         http://jira.*
// @version       0.5
// @namespace https://greasyfork.org/users/77886
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/29233/Atlassian%20JIRA%20-%20Auto-expand%20older%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/29233/Atlassian%20JIRA%20-%20Auto-expand%20older%20comments.meta.js
// ==/UserScript==

function clickWhenItAppears (jNode) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}

bWaitOnce = true;
// <a class="collapsed-comments" href="(redacted)"><span class="collapsed-comments-line"></span><span class="collapsed-comments-line"></span><span class="show-more-comments" data-collapsed-count="12">12 older comments</span></a>
waitForKeyElements (
    "a[class='collapsed-comments']",
    clickWhenItAppears
);