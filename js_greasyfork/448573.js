// ==UserScript==
// @name         Craigslist dark theme
// @namespace    http://tampermonkey.net/
// @version      1.9.8
// @description  Craigslist is so bright! Let's turn down the dimmer.
// @author       https://greasyfork.org/en/users/810921-guywmustang
// @match        http*://*.craigslist.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=craigslist.org
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448573/Craigslist%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/448573/Craigslist%20dark%20theme.meta.js
// ==/UserScript==
(function() {
        'use strict';

    function addInitialStyle() {
        console.log("addInitialStyle...");

        GM_addStyle(`
            :root {
                --darkgray: #252525;
                --white-text: #DDDDDD;
                --dim-white: #BBBBBB;
                --light-blue: #84d7ff;
                --dark-gray-blue: #4D6174;
                --nearly-black: #2A2F35;
                --bright-blue: #268def;
                --medium-gray: #444444;
                --darker-yellow: #898931;
                --black-color: #000000;
                --purple-logo: #9d4de7;
            }

            body, body.dayTheme, ul, footer {
              color: var(--white-text) !important;
              background-color: var(--nearly-black);
            }

            a, a:visited {
              color: var(--white-text);
            }

            .homepage #logo a {
              color: var(--white-text);
            }

            .homepage #logo>a:before {
              color: var(--purple-logo);
            }

            .homepage .leftlinks > *,
            .homepage .leftlinks li a,
            .homepage li a#post:before,
            .homepage #postlks a#post,
            .homepage #postlks {
              color: var(--white-text);
              background-color: var(--darkgray);
            }

            .homepage .emoji {
              margin-bottom: 0px;
            }

            .bd-anchor span.label {
              color: var(--black-color);
            }

            .cl-app-anchor.cl-goto-home span, .cl-app-anchor.cl-goto-home span:visited,
            a.cl-thumb-anchor span.icon, button.cl-thumb-button span.icon
            .cl-app-anchor.cl-goto-home, .cl-app-anchor.cl-goto-home:visited {
              color: var(--white-text);
              text-decoration: none;
              text-line-decoration: none;
            }

            /* Account icon color */
            a.cl-thumb-anchor.cl-goto-account span.icom-:after {
              color: var(--white-text);
            }

            `);
    }

    function addStyle() {
        console.log("addStyle...");

        GM_addStyle(`
            :root {
                --darkgray: #252525;
                --white-text: #DDDDDD;
                --dim-white: #BBBBBB;
                --light-blue: #84d7ff;
                --dark-gray-blue: #4D6174;
                --nearly-black: #2A2F35;
                --bright-blue: #268def;
                --medium-gray: #444444;
                --darker-yellow: #898931;
                --black-color: #000000;
                --purple-logo: #9d4de7;
            }

            body, body.dayTheme, ul, footer {
              color: var(--white-text) !important;
              background-color: var(--nearly-black);
            }

            a, a:visited {
              color: var(--white-text);
            }

            .homepage #logo a {
              color: var(--white-text);
            }

            .homepage #logo>a:before {
              color: var(--purple-logo);
            }

            .homepage .leftlinks > *,
            .homepage .leftlinks li a,
            .homepage li a#post:before,
            .homepage #postlks a#post,
            .homepage #postlks {
              color: var(--white-text);
              background-color: var(--darkgray);
            }

            .homepage .emoji {
              margin-bottom: 0px;
            }

            .bd-anchor span.label {
              color: var(--black-color);
            }

            .cl-app-anchor.cl-goto-home span, .cl-app-anchor.cl-goto-home span:visited,
            a.cl-thumb-anchor span.icon, button.cl-thumb-button span.icon
            .cl-app-anchor.cl-goto-home, .cl-app-anchor.cl-goto-home:visited {
              color: var(--white-text);
              text-decoration: none;
              text-line-decoration: none;
            }

            /* Account icon color */
            a.cl-thumb-anchor.cl-goto-account span.icom-:after {
              color: var(--white-text);
            }

            `);

        GM_addStyle(`
            a,
            #leftbar .leftlinks a:visited {
                color: var(--light-blue);
                font-weight: 500;
            }

            /* Top bar city banner */
            .cl-location-picker-homepage-link a, .cl-location-picker-homepage-link a:visited, .cl-location-picker-homepage-link a:active,
            .cl-homepage-top-banner, .cl-homepage-top-banner>div,
            .cl-homepage-top-banner .cl-subarea-button {
                color: var(--light-blue) !important;
                background-color: var(--darkgray) !important;
            }

            .bd-can-hover .cl-location-picker-homepage-link a:hover {
                color: var(--white-text) !important;
            }

            .managestatus a {
                color: var(--bright-blue) !important;
            }

            aside#loginWidget a, #loginWidget, #loginWidget a {
              border: none;
              color: var(--white-text) !important;
              background-color: var(--black-color) !important;
            }

            /* bar graph text colors */
            .avg-text, text.tick, line.tickmark, line.arrowhead,
            .cl-bar-chart-control .chart-container .xaxis .arrowhead,
            .cl-bar-chart-control .chart-container .xaxis .abs-max-price {
                stroke: var(--white-text);
                font-size: 10px;
                font-weight: 100;
            }

            `);

        GM_addStyle(` span.result-price {
                color: var(--light-blue) !important;
                font-weight: 700 !important;
            }

            `);

        GM_addStyle(` body.dayTheme, nav, ul, aside, section.page-container,
            .cl-content,
            div.querybox, div.content,
            div.form-tab, section.page-container, div.querybox, div.form-tab,
            div.search-options-container, div.search-options, .hasPic, .tsb,
            .cl-search-query .cl-query-bar, .cl-search-ng .cl-search-toolbar,
            .ban .bantext, table.cal, .cal td,
            div.wrapper {
                background-color: var(--nearly-black);
            }

            /* Search bar buttons */
            .cl-filter-buttons .bd-button.filter-button {
              color: var(--white-text) !important;
              background-color: var(--darkgray);
            }
            .cl-filter-buttons .bd-button.filter-button:hover {
              color: var(--bright-blue) !important;
              background-color: var(--darkgray);
            }

            /* Search bar button selected */
            .cl-filter-buttons .bd-button.filter-button .sel,
            .cl-filter-buttons .bd-button.filter-button.is-set,
            button.bd-button .text-only .filter-button .is-set {
              color: var(--darkgray) !important;
              background-color: var(--light-blue);
            }

            /* Footer links */
            footer.cl-footer-tx a, footer.cl-footer-tx a:visited {
              color: var(--white-text);
            }

            header:has(.cl-area-serach),
            header:not(.dateReplyBar),
            div.cl-content header,
            header.cl-header .bd-button.link-like,
            header.cl-header .bd-button.link-like:hover
            {
                 color: var(--white-text) !important;
                 background-color: var(--black-color) !important;
                 border-color: var(--black-color) !important;
                 padding: 0 0 !important;
                 text-decoration: none !important;
            }

            header.cl-header .bd-button.link-like,
            header.cl-header .bd-button.link-like:hover {
                 color: var(--white-text) !important;
                 background-color: var(--black-color) !important;
                 border-color: var(--black-color) !important;
                 text-decoration: none !important;
                 padding: 0 0 !important;
            }

            div.cl-jsonform-filters-panel button {
              text-decoration: none !important;
            }
            div.cl-jsonform-filters-panel button:hover {
              font-weight: bold;
              text-decoration: none !important;
            }

            .cal td.today {
              background-color: var(--darker-yellow) !important;
            }

            /* Left bar for sale styles */
            .cl-search-filters-panel {
                background-color: var(--nearly-black);
            }

            .bd-button .icon,
            .bd-button.link-like span.label,
            .cl-search-filters-panel .cl-title-bar,
            .cl-search-filters-panel .cl-title-bar .back-and-title-links h1,
            .cl-jsonform-category-picker div.show-all, .bd-button, .bd-button:hover,
            .cl-search-filters-panel a, .cl-search-filters-panel a:visited,
            .cl-psa span.label,
            .cl-other-cats .category .cat-label > span.label,
            a.cl-thumb-anchor span.cl-label, button.cl-thumb-button span.cl-label,
            .cl-jsonform-category-picker div.show-all,
            .cl-jsonform-category-picker div.hide-some {
                color: var(--white-text) !important;
                text-decoration: none !important;
            }

            /* Dropdown button text color */
            span.label, span.icon {
                color: var(--medium-gray);
            }

            /* Show contact info "button" */
            .posting #postingbody a:hover {
                color: var(--white-text) !important;
                text-decoration: none !important;
                border-color: initial !important;
            }

            /* Related Searches dropdown/text */
            .related-searches span,
            .related-searches .label {
              color: var(--white-text);
            }

            `);

        // the result boxes
        GM_addStyle(`
            /* view mode option buttons */
            li.result-row,
            div.search-suggs,
            .gallery-card,
            .cl-search-result.cl-search-view-mode-gallery .gallery-card .titlestring,
            .cl-search-ng .cl-view-mode-selector .bd-button {
                background-color: var(--dark-gray-blue);
                color: var(--white-text) !important;
                border-color: var(--dark-gray-blue);
            }
            /* change the gallery color button as highlighted */
            .cl-search-view-mode-gallery .cl-search-ng .cl-view-mode-selector .cl-search-view-mode-gallery {
                background-color: var(--light-blue);
                color: var(--darkgray) !important;
                border-color: var(--dim-white);
            }
            /* set the icon color for the gallery icon */
            .cl-search-view-mode-gallery .cl-search-ng .cl-view-mode-selector .cl-search-view-mode-gallery span.icon {
              color: var(--darkgray) !important;
            }

            .cl-result-info .supertitle {
                color: var(--dim-white) !important;
            }

            /* date & location text on tiles */
            .cl-search-result.cl-search-view-mode-gallery .gallery-card .meta {
                color: var(--dim-white) !important;
            }

            /* Result tile visited text */
            .cl-result-info .title-blob .titlestring:visited,
            .cl-search-result a:visited {
                color: var(--dim-white) !important;
            }

            /* Services links */
            a.titlestring, a.titlestring:visited {
                color: var(--white-text);
            }

            /* search region text */
            .cl-search-result.cl-search-view-mode-thumb .result-node .result-info .supertitle {
                color: var(--dim-white);
            }

            `);

        GM_addStyle(`
                /* Updated search button format */
                .cl-command-buttons .bd-button,
                .resetsearch .searchlink.changed_input {
                  color: var(--nearly-black) !important;
                  font-weight: bold !important;
                }

            `);

        // The 'see also' bar
        GM_addStyle(`

            /* filter buttons below search box */
            .cl-horiz-scroller {
                color: var(--white-text) !important;
                background-color: var(--nearly-black) !important;
            }

            div.hub-links > a, .linklike, .search-suggs .prompt, .result-date,
            div.cl-hub-links, .cl-hub-links-content, .cl-hub-links-content > a > *, .cl-hub-links-content > h2 {
                color: var(--white-text) !important;
                background-color: var(--black-color) !important;
            }

            /* Gallery dropdown & search order dropdown */
            .cl-results-toolbar {
                color: var(--white-text) !important;
                background-color: var(--black-color) !important;
            }
        `);

        GM_addStyle(` header.global-header, .global-header.wide .userlinks,
            .to-banish-page, .user-favs-discards,
            .header-logo, ul.breadcrumbs, nav.breadcrumbs-container {
                color: var(--white-text);
                background-color: var(--black-color) !important;
            }

            /* top bar - hidden, post, account */
            .header-logo, .header-logo:visited,
            nav.breadcrumbs-container a,
            nav.breadcrumbs-container a:visited,
            .user-favs-discards a,
            ul.user-actions,
            ul.user-actions li.user.post a,
            ul.user-actions li.user.post a:visited,
            ul.user-actions li.user.account a,
            ul.user-actions li.user.account a:visited {
              color: var(--white-text);
              background-color: var(--black-color) !important;
            }

            `);

        GM_addStyle(` .purveyor a:visited, li.button > a,
            .buttongroup .button.sel,
            .buttongroup, .buttongroup sel, .button.sel, li.button,
            .paginator,
            a.next, a.backtotop {
                color: var(--black-color) !important;
                background-color: var(--white-text) !important;
            }

            .remuneration .sel a, .purveyor .sel a {
                color: var(--nearly-black) !important;
            }

            `);

        // Listing page styles
        GM_addStyle(` .posting .attrgroup span,
            div.prevnext-sec > div > a.next {
                color: var(--white-text) !important;
                background-color: var(--nearly-black) !important;
                border: 0 !important;
            }

            `);

        GM_addStyle(` a.show-contact, .actions-combo .action .action-label {
                color: var(--white-text) !important;
            }

            `);

        // Home page styles
        GM_addStyle(`
            /* Main left bar styles */
            .leftbar, #leftbar {
              margin: 2px 0px;
              background-color: var(--darkgray);
              color: var(--white-text);
              border: 1px var(--dark-gray-blue) solid;
            }

            .rightbar, .homepage #rightbar, #rightbar {
              background-color: var(--darkgray) !important;
              color: var(--white-text) !important;
              border: 1px var(--dark-gray-blue) solid !important;
            }

            #center, field,
            .homepage .col ul,
            .homepage footer,
            .desktop footer,
            footer .clfooter li a, footer .clfooter li a:visited,
            #topban .sublinks a,
            #topban .sublinks a:visited,
            #topban .sublinks li,
            .cl-filter-buttons,
            .cl-component.location-picker-homepage-link a {
              margin: 2px 0px;
              background-color: var(--nearly-black) !important;
              color: var(--white-text) !important!;
            }

            #center h3 {
                padding: 0px;
                background-color: var(--dark-gray-blue);
                color: var(--white-text);
                border: 1px var(--dark-gray-blue) solid;
            }

            .ban {
              font-weight: normal;
            }

            /* Brighter colors for column header backgrounds */
            .ban a, .ban a:visited,
            .homepage .ban a, .homepage .ban a:visited {
                padding: 0px;
                background-color: var(--darkgray);
                color: var(--white-text);
                border: none;
            }

            /* Top location bar */
            #topban {
              background-color: var(--darkgray) !important;
              border: 1px var(--dark-gray-blue) solid;
              border-top: initial;
              border-bottom: initial;
              color: var(--white-text);
            }

            #topban .regular-area {
              background-color: var(--darkgray);
              color: var(--white-text);
              margin-left: 0px;
              padding-left: 10px;
            }

            .homepage h3 .txt {
              font-weight: 700;
            }

            /* center page listing links (ie: for sale -> antiques) */
            .homepage .col ul li a {
                padding: 0px;
                background-color: var(--nearly-black);
                color: var(--white-text);
                border-bottom: 1px solid var(--dark-gray-blue);
            }

            /* Home page link hover style */
            .homepage .col ul li a:hover,
            .homepage .col ul li a:hover span,
            .homepage .ban a:hover span,
            .homepage .ban a:hover {
              padding: 0px;
              background-color: var(--white-text);
              color: var(--bright-blue);
            }

            .homepage #rightbar h5 {
                color: var(--bright-blue) !important;
            }

            #rightbar ul.menu li.s a:hover,
            #leftbar a:hover,
            .homepage a:hover {
                color: var(--bright-blue);
            }

            #rightbar ul.menu li.s a:visited {
                color: var(--white-text);
            }

            /* colors for all/owner/dealer */
            .cl-jsonform-select.segmented button {
              color: var(--white-text) !important;
              background-color: var(--darkgray);
            }

            /* selected all/owner/dealer button */
            .cl-jsonform-select.segmented .sel {
              color: var(--darkgray) !important;
              background: unset;
              background-color: var(--light-blue) !important;
              border-color: initial;
            }

            /* unselected all/owner/dealer button hover */
            .bd-can-hover .bd-button:hover, .bd-can-hover .bd-button.tickle:hover {
              color:  var(--darkgray) !important;
            }

            /* selected all/owner/dealer button */
            .cl-jsonform-select.segmented .sel:hover {
              color: var(--darkgray) !important;
              background: unset;
              background-color: var(--bright-blue) !important;
              border-color: initial;
            }

            `);

        // create a posting link style
        GM_addStyle(`
            .homepage #postlks #post, #postlks a:visited {
              background-color: var(--darkgray);
              color: var(--bright-blue);
            }

            `);
        // my account page style
        GM_addStyle(`
            .accountform-banner, .account-header, #account-homepage, #searchfieldset, #paginator, .account fieldset.homepage_label, .account .accountsettings .setting_name {
              background-color: var(--nearly-black);
              color: var(--bright-blue);
            }

            .account .filterbtn {
              color: var(--bright-blue);
            }

            #onetime {
              color: var(--black-color);
            }

            `);

       GM_addStyle(`
            .managestatus {
              background-color: var(--nearly-black);
              color: var(--bright-blue);
            }
            `);

      GM_addStyle(`
            /* Create post page */
            .post .selection-list label,
            .post .selection-list label:hover,
            div.json-form span.option-label,
            div.json-form span.option-label:hover,
            div.json-form label.radio-option,
            div.json-form label.radio-option:hover,
            .json-form .json-form-item.req .label,
            .json-form .row .label,
            .json-form .boolean .label,
            .json-form .json-form-item.disabled .label,
            fieldset {
              background-color: var(--dark-gray) !important;
              color: var(--white-text) !important;
            }

            .json-form .numeric label.input>*:first-child {
              color: var(--darkgray);
            }

            .json-form .json-form-item.req label.input,
            .json-form .json-form-item.req textarea,
            .json-form .json-form-item.req select {
              border: 1px solid var(--dark-gray-blue) !important;
            }

            section.body a {
              color: var(--bright-blue);
            }

            /* Actual create page */
            .page-container {
              background-color: var(--nearly-black);
              color: var(--white-text);
            }

            /* Posting details block */
            .json-form .label {
              color: var(--dim-white);
            }

            /* Ignore texts requesting... */
            .json-form .json-form-item.phone-warning {
              color: var(--nearly-black);
            }

            `);

        GM_addStyle(`
            /* Feedback sidebar */
            .cl-feedback-tool .banner {
              background-color: var(--darkgray);
              color: var(--white-text);
            }
            `);
        }

        addInitialStyle();

        window.onload = function() { addStyle(); }
    })();