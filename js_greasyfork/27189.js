// ==UserScript==
// @name         Facebook Notifications Highlighter
// @namespace    http://www.JamesKoss.com/
// @version      2.59
// @description  Highlights your interesting notifications, with an option to hide the unimportant ones.
// @author       James Koss
// @match        https://www.facebook.com/*
// @supportURL   https://greasyfork.org/en/scripts/27189-facebook-your-notifications-highlighter/feedback
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27189/Facebook%20Notifications%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/27189/Facebook%20Notifications%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var first = true;     // First notifications popup loading.
    var hidden = false;   // Non-highlighted notifications are hidden.
    var updater = null;   // Timed updating.

    var fbNotificationsJewel = null;
    var fbNotificationsFlyout = null;
    var ulElement = null;
    var firstNotification = null;
    var lastNotification = null;

    var notificationColors = {
        'darkblue':   '#c3d4ef',
        'lightpink':  '#efd0ea',
        'lightgreen': '#c9f1c9',
        'darkpurple': '#dec3ef'
    };

    // Substring in notification.
    // Array must match all substrings in notification.
    // NOTE: There's more general matches in updateNotifications().
    var notificationTypes = {
        'important': [
            'replied to your',
            'commented on your',
            'commented on and reacted to your',
            'shared your',
            'mentioned you',
            'tagged you',
            "you're tagged in",
            'also replied',
            'also commented on his post',
            'also commented on her post',
            'also commented on their post',
            ['replied to', 'on your'],
            ['marked', 'safe'],
            'replied to his'
        ],
        'react': [
            //'likes your',
            //'like your',
            //'liked your',
            //'reacted to',
            //['likes a', 'you']
        ],
        'urgent': [
            'your Timeline',
            'added a photo of you',
            'invited you to join',
            'is live now',
            'now a member of',
            'on your timeline'
        ],
        'mod': [
            'approved your',
            'changed the name of the',
            'changed the type of the',
            'needs review',
            'flagged as possible spam',
            'made you',
            'changed the privacy'
        ]
    };

    // Should run after page has loaded, without CSS and images.
    document.addEventListener('DOMContentLoaded', function() {
        startScript();
    }, false);

    function startScript() {
        // Listen to a click on the notifications button on FB.
        fbNotificationsJewel = document.getElementById("fbNotificationsJewel");
        // Don't reload script on Ajax page change only.
        if (fbNotificationsJewel === null) return;
        fbNotificationsJewel.addEventListener("click", onclickJewel);

        fbNotificationsFlyout = document.getElementById('fbNotificationsFlyout');

        // Auto updater.
        updater = setInterval(updateView, 500);
    }

    // Clicking the notifications button on FB.
    function onclickJewel(e) {
        if (e.which === 1) {
            setTimeout(function(){ updateNotifications(); }, 500);
        }
    }

    // Check if notifications need updating while displayed.
    function updateView() {
        // Notifications must be visible and ready.
        if (fbNotificationsFlyout.offsetParent === null) return;
        if (ulElement === null) return;

        // Request more notifications.
        if (hidden === true) {
            // Scrollbar hidden.
            var sbh = fbNotificationsFlyout.querySelector('div.uiScrollableAreaGripper.hidden_elem');
            // Or scrolled to bottom.
            var wrap = fbNotificationsFlyout.querySelector('div.uiScrollableAreaWrap');
            var bottom = wrap.offsetHeight + wrap.scrollTop >= wrap.scrollHeight - 10;
            // And loading jewel must exist, otherwise finished all loadings.
            var jewel = fbNotificationsFlyout.querySelector('div.uiScrollableAreaContent span.jewelLoading');

            if ((sbh || bottom) && jewel) {
                // Fake a scroll event for loader.
                var e = new Event('scroll');
                fbNotificationsFlyout.querySelector('div.uiScrollableArea').dispatchEvent(e);
            }
        }

        var mergeLIs = ulElement.querySelectorAll("._33c");
        var curFirstNotification = mergeLIs[0];
        var curLastNotification = mergeLIs[mergeLIs.length-1];
        // Update view, if new notifications, or loaded old ones.
        if (curLastNotification !== lastNotification ||
            curFirstNotification !== firstNotification) {
            // Update globals.
            firstNotification = curFirstNotification;
            lastNotification = curLastNotification;

            updateNotifications();
            updateVisibility();
        }
    }

    // After clicking the notification, remove highlight color and eventListener.
    function removeHighlight(e) {
        e.currentTarget.removeEventListener("click", removeHighlight);
        // Remove script styling.
        e.currentTarget.style.backgroundColor = "";
        if (e.currentTarget.paramA !== null) {
            e.currentTarget.paramA.style.backgroundColor = "";
        }
    }

    // Update notifications visibility.
    function updateVisibility(req) {
        // Select all relevant notifications.
        var notifications = ulElement.querySelectorAll('li._33c:not([data-highlighted]), li._33c[data-highlightedreact]');

        for (var i=0; i < notifications.length; i++) {
            var cur = notifications[i];
            var displayMode = null;

            if (hidden === true)
                displayMode = 'none';

            cur.style.display = displayMode;
        }
    }

    // Return true if substr exists in nstr.
    // substr Arrays must match every string in them.
    function matchType(nstr, substr) {
        switch(typeof(substr)) {
            case 'string':
                if (~nstr.indexOf(substr)) {
                    return true;
                }
                break;

            case 'object':
                var all = true;
                for (var i=0; i < substr.length; i++) {
                    var c = substr[i];
                    // Every substring must exist.
                    if (!~nstr.indexOf(c)) {
                        all = false;
                    }
                }
                if (all) return true;
                break;
        }
    }

    // Return True if notification matches type.
    // n - Notification text.
    // t - Type String in notificationTypes.
    function notificationType(n, t) {
        var group = notificationTypes[t];
        for (var i=0; i < group.length; i++) {
            var c = group[i];
            if (matchType(n, c)) {
                return true;
            }
        }
    }

    // Update relevant notifications with highlight.
    function updateNotifications() {
        if (ulElement === null) {
            ulElement = fbNotificationsFlyout.querySelector('ul');
        }
        // Delay until notifications elements are available.
        if (ulElement === null) {
            setTimeout(function(){ updateNotifications(); }, 500);
            return;
        }

        // On first viewing.
        if (first === true) {
            first = false;
            // Hide/Show option.
            var headerActions = fbNotificationsFlyout.querySelector('div.uiHeaderActions');
            var toggleOption = document.createElement("a");
            toggleOption.style = "font-weight: bold;";
            toggleOption.title = "Hide unimportant notifications.";
            toggleOption.innerHTML = 'Hide Unimportant';

            toggleOption.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();

                if (hidden === true) {
                    hidden = false;
                    toggleOption.title = "Hide unimportant notifications.";
                    toggleOption.innerHTML = 'Hide Unimportant';
                } else {
                    hidden = true;
                    toggleOption.title = "Show unimportant notifications.";
                    toggleOption.innerHTML = 'Show Unimportant';
                }

                updateVisibility();
            };

            var spacer = document.createElement("span");
            spacer.setAttribute("role", "presentation");
            spacer.setAttribute("aria-hidden", "true");
            spacer.innerHTML = ' · ';

            headerActions.insertBefore(toggleOption, headerActions.firstChild);
            headerActions.insertBefore(spacer, toggleOption.nextSibling);
        }

        // Only check new notifications.
        var notificationsNew = ulElement.querySelectorAll('li.jewelItemNew:not([data-highlighted])');

        for (var i = 0; i < notificationsNew.length; i++) {
            var match = false;
            var current = notificationsNew[i];

            // General matches by notification type.
            // NOTE: Substring matches will override these in next check.
            if ('dataset' in current && 'gt' in current.dataset) {
                // Important notifications.
                if (~current.dataset.gt.indexOf(':"from_friend"') ||
                    ~current.dataset.gt.indexOf(':"highlights_friend_liker_commenter"') ||
                    ~current.dataset.gt.indexOf(':"event_joined_nearby"') ||
                    ~current.dataset.gt.indexOf(':"app_notification"') ||
                    ~current.dataset.gt.indexOf(':"message_request"') ||
                    // ~current.dataset.gt.indexOf(':"watch_party_started_implicit"') ||
                    ~current.dataset.gt.indexOf(':"appeal_content_block_message_update"') ||
                    ~current.dataset.gt.indexOf(':"group_r2j_approved"') ||
                    ~current.dataset.gt.indexOf(':"mention"') ||
                    ~current.dataset.gt.indexOf(':"feed_comment_reply"') ||
                    ~current.dataset.gt.indexOf(':"photo_tag"')) {
                    match = 1;
                }
                // React notifications.
                if (~current.dataset.gt.indexOf(':"feedback_reaction_generic"') ||
                    ~current.dataset.gt.indexOf(':"like"')) {
                    match = 2;
                }
                // Urgent notifications.
                if (~current.dataset.gt.indexOf(':"flytrap_bug_report_response"') ||
                    ~current.dataset.gt.indexOf(':"scase_reviewed') ||
                    ~current.dataset.gt.indexOf(':"scase_response') ||
                    ~current.dataset.gt.indexOf(':"appeal_content_block_message_create')) {
                    match = 3;
                }
                // Mod notifications.
                //if (~current.dataset.gt.indexOf(':""')) {
                //	match = 4;
                //}
            }

            var notificationParent = current.querySelector('div[class="_4l_v"]');
            var notificationYour = notificationParent.querySelectorAll('span:not(.fwb)');

            // Loop over all new notifications.
            for (var j=0; j < notificationYour.length; j++) {
                // Matched before loop.
                if (match) break;

                var cur = notificationYour[j];
                var t = cur.textContent.trim();

                // Skip single word SPAN elements.
                if (!~t.trim().indexOf(" ")) continue;

                // Relevant text inside notification element.
                if (notificationType(t, 'important')) {
                    match = 1;
                    break;
                }
                if (notificationType(t, 'react')) {
                    match = 2;
                    break;
                }
                if (notificationType(t, 'urgent')) {
                    match = 3;
                    break;
                }
                if (notificationType(t, 'mod')) {
                    match = 4;
                    break;
                }
            }

            // No match, check next notification.
            if (!match) continue;

            // Remember highlighted element.
            current.dataset.highlighted = "1";

            // Select color by matching value.
            var color;
            switch(match) {
                case 1:
                    color = notificationColors.darkblue;
                    break;
                case 2:
                    color = notificationColors.lightpink;
                    current.dataset.highlightedreact = "1";
                    break;
                case 3:
                    color = notificationColors.lightgreen;
                    break;
                case 4:
                    color = notificationColors.darkpurple;
                    break;
            }

            // Update the li & a elements backgrounds.
            current.style.backgroundColor = color;

            var a = current.querySelector('a[class="_33e _1_0e"]');
            if (a !== null) {
                a.style.backgroundColor = color;
            }
            // Pass to object, for highlight removal after click.
            current.paramA = a;

            current.addEventListener("click", removeHighlight);
        }
    }
})();