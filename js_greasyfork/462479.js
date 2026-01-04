// ==UserScript==
// @name        Jira issue page updated notification
// @namespace   https://greasyfork.org/users/1047370
// @description Give Jira issue page an update button, in the top navigation bar, when the issue is updated while the page is shown.  Also update the title.
// @author      Marnix Klooster <marnix.klooster@gmail.com>
// @copyright   public domain
// @license     public domain
// @version     0.10
// @homepage    https://greasyfork.org/scripts/462479
// @include     /^https?://(jira\.[^/]*|[^/]*\.atlassian\.net)/(browse|projects/[^/]+/issues)//
// @require     https://cdn.jsdelivr.net/npm/luxon@3.4.4/build/global/luxon.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/462479/Jira%20issue%20page%20updated%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/462479/Jira%20issue%20page%20updated%20notification.meta.js
// ==/UserScript==

/// TODO list
///
///  * Bug report in Edge: After the button shows, and it has been clicked, then using browser 'back',
///    which goes from a URL ending in a '#' to a URL without it,
///    results in the 'refresh icon' shown again in the tab title bar.  (Edge bug?)
///
///  * Also support URLs like https://jira.example.com/secure/RapidBoard.jspa?...&selectedIssue=MYPROJ-98765&...
///
///  * Usability issue.  On 'Jira issue in search result' .../browse/SOMEPROJ-12345?jql=... pages,
///    the top navigation bar scrolls out of view when scrolling down,
///    making the 'update' button inaccessible, which is not helpful.
///
///    Consider moving the button into the issue header (<header id="stalker" class="issue-header"/>),
///    either in the primary toolbar on the left (`<div class="aui-toolbar2-primary">`)
///    or in the secondary toolbar on the right (`<div class="aui-toolbar2-secondary">`).
///
///    EXCEPT that on .../projects/SOMEPROJ/issues/... pages, it is the other way around:
///    There the top navigation bar remains visible, and the issue header scrolls out of view...
///
///    Options:
///     - Do nothing, the 'search result' user will see the 'refresh' circular arrow in the title,
///       and that triggers them to scroll up.
///     - Show two buttons always, both in top bar and in issue header.  Ugly.
///     - If the top bar button scrolls out of view, then show that button e.g. floating.
///       (Or add a second button in the issue header?)
///
///  * Try to get rid of `href="#"`, since the URL-changing when clicking the button is not nice.
///
///  * Perhaps: Also show the _type_ of changes, in the 'updated' button's tooltip.
///    (It seems this needs both its ...?field=&expand=changelog
///    and the issue's full .../comment list, and perhaps more.)
///      If this is built, it also would make sense to keep watching for issue updates,
///    and keep updating the tooltip (and perhaps the time, see other TODO item).
///
///    Additionally, if (at least) the Description changed, make the button red/bold/highlighted
///    since that other Description change will be lost.
///    (And/or make that a separate userscript, that only looks at Description collisions.)
///
///  * Idea: Switch to relative times, e.g. as follows:
///
///       changed 10 min. — 52 sec. ago
///
///    (using `DateTime.toRelative()` twice) or
///
///       changed yesterday 4:30 PM — 7:42 PM GMT+2
///
///    (using `DateTime.toRelativeCalendar()` and `DateTime.toLocaleString(DateTime.TIME_...)` twice),
///    together with the following algorithm to combine two strings into an 'interval string':
///     - Split start and end time string using `s.split(/\s+(?!(?:AM|PM))\b/)`, resulting in two arrays.
///     - Show the start, but leave out the suffix common to start and end.
///     - Show `"—"` (that is, an `&mdash`).
///     - Show the end, but leave out the prefix common to start and end.
///
///    If this is done, try hard to update the button also in case of a connection error.
///    (The button could even be made a different color in that case...)
///
///  * Bug/limitation: From a query result page (https://jira.infor.com/issues/?jql=...)
///    clicking on a specific issue, the page is updated 'in place',
///    so even though the address bar URL changes, this userscript is not activated.
///    See if there is a way to fix that.
///
///  * Robustness in case `aui-nav` element does not exist.
///
///  * Perhaps: Wait longer after an error response, to reduce server load?

/// END of TODO list


"use strict";

/// Configuration settings
/// (also look at @include and @match in the manifest above,
/// which you can usually override in your userscript browser extension configuration)

/// Setting the following too high will overload the Jira server;
/// setting it too low will make this userscript less useful.
var timeBetweenChecksInSeconds = 10;

/// END of Configuration settings


/// Helper functions

/// From https://stackoverflow.com/a/35385518/223837:
/// Construct an DOM element from the given HTML string.
/// The caller must ensure no injection occurs, e.g. using `stringToHTML()` below.
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/// From https://stackoverflow.com/a/22706073/223837:
/// Convert a string to the equivalent HTML source code.
function stringToHTML(str){
    return new Option(str).innerHTML;
}

/// END of Helper functions


// Documentation about the Jira REST API that is used here can be found at
// https://docs.atlassian.com/software/jira/docs/api/REST/latest/
// (currently https://docs.atlassian.com/software/jira/docs/api/REST/9.7.0/),
// specifically
//
// - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#api/2/issue-getIssue
// - https://docs.atlassian.com/software/jira/docs/api/REST/latest/#api/2/issue-getComments
//
// Documentation about the Javascript JIRA object's API doesn't seem to exist.
// There are mostly fragments floating around in forum questions and answers.

(function () {

    /// 'global' variables
    var theInterval = null;
    var issueFirstUpdatedAfterPage = null;

    function start() {
        if (theInterval) {
            console.log(`SOMETHING WENT WRONG.  Ignoring this call to start().`);
            return;
        }
        console.log(`STARTING regular check for issue updates`);
        theInterval = setInterval(checkForUpdates, timeBetweenChecksInSeconds * 1000);
    }

    /// (Note that this function is currently not used.)
    function stop() {
        if (!theInterval) {
            console.log(`SOMETHING WENT WRONG.  Ignoring this call to stop().`);
            return;
        }
        console.log(`STOPPING regular check for issue updates`);
        clearInterval(theInterval);
        theInterval = null;
    }

    function getPageLastUpdated() {
        // The 'best' implementation for this would be
        // ```
        // luxon.DateTime.fromISO(document.getElementById("updated-val").getElementsByTagName("time")[0].getAttribute("datetime"));
        // ```
        // but because of Jira 9 bug https://jira.atlassian.com/browse/JRASERVER-76257 (at least up until 9.10.1),
        // instead we take the latest <... class="livestamp" datetime="..."> we can find on the page.
        return luxon.DateTime.max(...Array.from(document.querySelectorAll('.livestamp[datetime]')).map(
            (t) => luxon.DateTime.fromISO(t.getAttribute("datetime"))
        ));
    }

    function checkForUpdates() {
        var issueNumber = JIRA.Issue.getIssueKey();
        if (issueNumber == null) {
            console.log(`No issue number found (yet?)...  trying again in a little while`);
            return;
        }

        console.log(`Checking whether issue ${issueNumber} has been recently updated`);
        fetch(new Request(`/rest/api/latest/issue/${issueNumber}?fields=updated`, {
            headers: {'Content-Type': 'application/json'}
        })).then((response) => {
            // technical handling of the response
            if (!response.ok) {
                console.log(`Something went wrong checking for updates of issue ${issueNumber}, will retry in a little while: ${response.statusText}`);
                return Promise.reject(response); // not handled in any way, no need
            }
            return response.json();
        }).then((responseJSON) => {
            // functional handling of the response

            // 'last updated' according to the Jira REST API
            var issueLastUpdated = luxon.DateTime.fromISO(responseJSON.fields.updated);
            // 'last updated' according to this page; could perhaps also be read via the JIRA object? could not find any documentation
            var pageLastUpdated = getPageLastUpdated();
            console.log(`Issue ${issueNumber} was last updated ${issueLastUpdated}`);
            console.log(`This page says its data is from ${pageLastUpdated}' (+/- 1 second)`);

            // remove any UI changes, preparing to make them again below if necessary.
            var updateButtonElement = document.getElementById('marnix_update_page_button');
            if (updateButtonElement) {
                // below always add a fresh button, so that we have the updated text
                updateButtonElement.remove();
            }
            const prefix = '\u21BB ';
            if (document.title.startsWith(prefix)) {
                document.title = document.title.substring(prefix.length);
            }

            if (pageLastUpdated.toMillis() + 1000 < issueLastUpdated.toMillis()) { // + 1000 since 'page last updated' has no millisecond information
                // issue was updated after the page information was refreshed

                if (!issueFirstUpdatedAfterPage) {
                    issueFirstUpdatedAfterPage = issueLastUpdated;
                }

                var issueLastUpdatedText = luxon.Interval.fromDateTimes(
                    issueFirstUpdatedAfterPage, issueLastUpdated).toLocaleString(luxon.DateTime.TIME_WITH_SHORT_OFFSET, {});
                console.log(`Concluding that issue was updated after last page refresh, just now at ${issueLastUpdatedText}: ensuring update button and updated title`);

                // We put the button as the last in the <ul class="aui-nav"> top navigation bar.
                // (The button is the same as the 'Create' button; `href="#"` is needed for the correct hover color.)
                updateButtonElement = htmlToElement(`
                            <li id="marnix_update_page_button">
                                <a
                                    href="#"
                                    class="aui-button aui-button-primary aui-style"
                                    title="Update page"
                                   >Update (changed ${stringToHTML(issueLastUpdatedText)})</a>
                            </li>
                        `);
                updateButtonElement.addEventListener("click", updateThisPage);
                document.getElementsByClassName("aui-nav")[0].appendChild(updateButtonElement);

                // prepend 'Clockwise Open Circle Arrow' character
                document.title = `${prefix}${document.title}`;

                return;
            }

            console.log(`Concluding that there was no recent issue ${issueNumber} update, will check again in a little while.`);
        });
    }

    function updateThisPage() {
        console.log(`Let this page update its information (which also reverts the title)`);
        JIRA.trigger(JIRA.Events.REFRESH_ISSUE_PAGE, [JIRA.Issue.getIssueId()]);
        // this event triggers an update, which raises an ISSUE_REFRESHED event,
        // which is caught by the event handler below, which will re-enable the regular check for issue updates
        // (or it triggers a full page reload, sometimes, it seems, e.g. if there is a network issue)
    }

    JIRA.bind(JIRA.Events.ISSUE_REFRESHED, function (e, context) {
        console.log(`Something triggered a refresh of this page`);

        if (!theInterval) {
            console.log(`We will start to look for issue updates again in a little while`);
            start();
        }

        var updateButtonElement = document.getElementById('marnix_update_page_button')
        if (updateButtonElement) {
            console.log(`We can remove the update button again`);
            updateButtonElement.remove();

            issueFirstUpdatedAfterPage = null;

            // no need to revert the document.title, the refresh that just happened has already done that
        }
    });

    // No need to updateThisPage() on JIRA.Events.INLINE_EDIT_SAVE_COMPLETE,
    // because every inline edit also updates the `Updated:` (id="updated-val") field,
    // and we already trigger on that.

    start();
})();