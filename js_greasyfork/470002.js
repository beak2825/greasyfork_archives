// ==UserScript==
// @name        My "Reddit Old Mobile" Tweaks
// @namespace   Violentmonkey Scripts
// @match       *://old.reddit.com/*
// @exclude     *://old.reddit.com/login*
// @exclude     *://old.reddit.com/logout*
// @grant       none
// @version     2024.03.08_1638
// @author      screwyou00
// @license     GNU GPLv3
// @icon        https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @description adds extra tweaks to https://greasyfork.org/en/scripts/469760-reddit-old-mobile
// @downloadURL https://update.greasyfork.org/scripts/470002/My%20%22Reddit%20Old%20Mobile%22%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/470002/My%20%22Reddit%20Old%20Mobile%22%20Tweaks.meta.js
// ==/UserScript==

// add javascript stuff here
$(function() {
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(
        `
        /* makes Reddit header float and stick to top */
        div#header {
            position: sticky;
            top: 0;
            border: solid black 1px;
            z-index: 9999; /* ensures that no other elements will block this out */
        }

        /* display left sidebar for user multireddits */
        body.with-listing-chooser > .listing-chooser.initialized {
            position: fixed;
            display: inherit;
            top: 0;
            z-index: 9998; /* ensures the left side-bar cannot be beneath another element */
        }

        /* when screen is landscape */
        @media only screen and (min-width: 507px) {
            .contents {
                height: 70%;
                margin-top: 130%;
                overflow: auto;
            }
        }

        /* when screen is portrait */
        /* change the size of the contents within the left-sidebar */
        @media only screen and (max-width: 506px) {
            .contents {
                height: 100%;
                margin-top: 130%;
                overflow: auto;
            }
        }

        .link .title, .thing.link .title a.title, .link .entry .buttons li a.comments, .entry .buttons li a {
            color:unset !important;
        }

        .reddit-profile-picture {
            display:none;
        }

        .comments-page .comment .expand {
            opacity: unset;
            font-size: 1.5em;
        }

        .commentarea .entry:not(:hover) .buttons, #header-bottom-right:not(:hover) .user a {
            opacity: unset !important;
        }

        .thing.even, .thing.odd {
            background: unset !important;
        }

        /* add solid border around upvoted/downvoted comments for better visibility */
        .upmod, .downmod {
            border: solid black 1px;
        }

        /* add left margin between comment author and expander */
        a.author {
            margin-left: 0.5em;
            margin-right: 0.5em;
        }

        /* adjust left margin in "Sidebar" view to account for grippy */
        div.side--active {
            top: unset;
            margin: unset;
            width: 90%;
            left: 30px;
            padding-left: 4px;
            border: solid black 2px;
        }

        /* change size of submission post content area because of grippy size changes */
        /* start from the adjacent element "listing-chooser" so it only applies to the frontpage of reddit */
        .listing-chooser + a + .content > .sitetable {
            margin-left: 32px;
        }

        /* center-align the "multireddit" text */
        .subreddit-logo-wrapper > .listing-chooser h3 {
            text-align: center;
        }

        /* set maximum width of multireddit buttons so the right side doesn't collide with grippy */
        .contents ul {
            max-width: 120px;
        }

        /* puts border around multireddit button */
        .contents ul li, .contents ul li.selected {
            border: solid black 1px;
        }

        /* center align header text for multireddit buttons */
        .listing-chooser h3 {
            text-align: center;
        }

        /* display left sidebar for user multireddits when collapsed */
        body.with-listing-chooser.listing-chooser-collapsed > .listing-chooser {
            width: 15px;
        }

        /* expand size of grippy */
        body.with-listing-chooser > .listing-chooser.initialized > .grippy {
            border: solid black 1px;
            width: 30px;
        }

        /* center align username and login text */
        div#header-bottom-right {
            text-align: center;
        }
        
        /* re-add footer-parent element. Firefox mobile needs this for jscroll to work */
        .footer-parent {
            display: inherit;
        }
        
        `
    );

});