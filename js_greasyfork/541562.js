// ==UserScript==
// @name         Dark Theme for lms.human.ua
// @namespace    https://github.com/FL1IP
// @version      0.2.1
// @homepage     https://github.com/FL1IP/dark-theme-lms.human.ua
// @description  Тёмная тема для сайта lms.human.ua
// @icon         https://i.ibb.co/7tfx27mJ/humanblack.png
// @author       FL1IP
// @license      MIT
// @match        https://lms.human.ua/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541562/Dark%20Theme%20for%20lmshumanua.user.js
// @updateURL https://update.greasyfork.org/scripts/541562/Dark%20Theme%20for%20lmshumanua.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        body {
            background-color: #121212 !important;
        }

        .lesson-ui, .calendar-wrapper  {
            background-color: #121212 !important;
        }

        .post-item-user-name, .post-item-header, .central-part, .post-item-heading, .post-item-hometask-container__info-title, .date__day-number, .header-with-number, .calendar-day-name, .activity-title, .activity-status {
        color: #b3b3b3 !important;
        }

        .workspaces, .workspaces__header, .calendar-day-date {
            background-color: #121212;
        }

        .workspaces__logo, .workspaces__close-button {
            filter: invert(1);
        }

        .ev-profile-person, .institution__details, .institution {
            background-color: #1e1e1e;
        }

         .post-item-group-info a, .post-item-hometask-container__info-sub-title, .activity-name, .badge__item--inverse-colors, .calendar-event-group, .calendar-event-subject {
        color: #999999 !important;
        }

        .calendar-canvas-container {
            background-color: #141414c7 !important;
            border-color: #252525 !important;
        }

        .calendar-day-of-week--border-gray {
            border-color: #252525 !important;
        }

        .calendar-day-title {
            color: #bdbdbd !important;
            border-color: #252525 !important;
        }

        .calendar-event-details-lesson-title, .calendar-event-details-item, .dropdown--default, .calendar-feed-event-time-container, .calendar-feed-event-link-container {
            background-color: #181818 !important;
            color: #bdbdbd !important;
        }

        .calendar-event-lesson-number, .calendar-feed-event-time {
            border: 1px solid #252525 !important;
            background-color: #202020 !important;
            color: #bdbdbd !important;
        }

        .calendar-event {
            background-color: #181818 !important;
            color: #bdbdbd !important;
        }

        .button.bordered {
            border-color: #252525 !important;
            background-color: #202020;
        }

        .left-navigation-button {
            background-color: #121212 !important;
            filter: opacity(97%) !important;
            border-color: rgb(105 105 105) !important;
            color: #ffffff !important;
        }

        /* Стили для боковой панели на главной странице */
        .community-tile {
            background-color: #1e1e1e !important;
            border: 2px solid #252525 !important;
            color: #e0e0e0 !important;
        }

        .left-side-bar {
            background-color: #121212 !important;
            color: #ffffff !important;
            box-shadow: inset -3px 0 9px #262626 !important;
        }

        .ellipse-button, .info-box__icon2 {
            filter: invert(97%) !important;
        }

        .post-item-hometask-container, .basic-box, .box-content {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .basic-box__header-title, .new-heading h1, .calendar-navigation-current-period__title, .hometask-data-view__title, .hometask-info__title, .info-box__text, .info-box__text-title, .spinner.spinner--default, .bem-user__name, .outside-angular-app__loading-heading, .hometask-sidebar__item__text {
            color: #b3b3b3 !important;
        }

        .hometask-card__theme-info__title, .student-hometask-card__task-statuses__badge__text {
            color: #9eaabb !important;
        }

         .tabs-navigation-container {
            border-bottom: none !important;
        }

        .ng-navigation-mobile {
            background-color: #121212 !important;
        }

        .ng-tabs--design-3, .mat-mdc-tab-link, .ng-tabs--design-3, .mat-mdc-tab-link, .mdc-tab__text-label {
            color: #e0e0e0;
            --mat-tab-header-inactive-hover-label-text-color: #6090d7
        }

        .ng-navigation {
            background-color: #121212 !important;
            color: #ffffff !important;
        }

        .intercom__button {
            background-color: #121212 !important;
        }



        .mat-mdc-tab-links {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
        }

        .activities-tabs {
            background-color: #121212 !important;
            border-color: rgb(105 105 105) !important
        }

        .tile2__footer {
            background-color: #1e1e1e !important;
            border-color: #333333 !important;
        }

        .tile2 {
            border: 2px solid #252525;
            background-color: #252525;
        }

        .tile2__title {
            filter: invert(97%) !important;
        }

        .hometask-info[_ngcontent-ng-c1915296917] {
            border: #181818 !important;
            background-color: #181818 !important;
        }

         .hometask-card {
            border: #181818 !important;
            background-color: #181818 !important;
            color: #e0e0e0 !important;
        }

        .basic-box {
            border: none;
            box-shadow: none;
        }

        .calendar-period-navigation--bubble-design {
            border-color: #252525;
            background-color: #252525;
        }

        .calendar-period-navigation--clickable:hover {
            background-color: #181818;
        }

        .info-box {
            color: #e0e0e0 !important;
            background-color: #1e1e1e !important;
            border: 2px #252525 !important;
            box-shadow: none
        }

        .text-left {
            border-color: #252525 !important;
            background-color: #292929 !important;
            color: #e0e0e0;
        }

        .p-dropdown {
            border: 2px solid #202020;
            background-color: #181818;
            color: #e0e0e0;
        }

        .p-inputtext {
            background-color: #181818;
            border-color: #202020 !important;
        }

        .p-dropdown-panel, .p-dropdown-items, .p-dropdown-item, .p-dropdown-item-group {
            background-color: #181818;
            color: #e0e0e0;
        }

        .p-dropdown-item-group {
            background-color: #181818;
            color: #e0e0e0;
            border-top: 2px solid #202020;
            border-right: 2px solid #202020;
            border-left: 2px solid #202020;
        }

        .outside-angular-app {
            background-color: #616c83;
        }

        .hometask-sidebar__item.selected {
            background-color: #202020 !important;
            color: #e0e0e0 !important;
        }

        .layout-container-full__header3 {
            filter: opacity(97%) !important;
        }
    `);

    function hideFirstDropdownItem() {
        const items = document.querySelectorAll(".p-dropdown-item-group");
        if (items.length > 0) {
            items[0].style.display = "none";
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                hideFirstDropdownItem();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    hideFirstDropdownItem();
})();