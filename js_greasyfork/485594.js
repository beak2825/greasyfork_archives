// ==UserScript==
// @name         edu.hse.ru compact wiew
// @namespace    http://tampermonkey.net/
// @version      2024-01-24
// @description  removes padding on most elements, so more elements could fit on one screen
// @author       kvnovikov
// @match        https://edu.hse.ru/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485594/eduhseru%20compact%20wiew.user.js
// @updateURL https://update.greasyfork.org/scripts/485594/eduhseru%20compact%20wiew.meta.js
// ==/UserScript==

GM_addStyle ( `
    .activity-item {
       padding: 0.2rem !important;
    }
    .course-description-item {
        margin-top: 0.2rem !important;
        padding-top: 0.2rem !important;
        padding-bottom: 0.2rem !important;
    }
    .my-3 {
        margin-top: 0.2rem !important;
        margin-bottom: 0.2rem !important;
    }
    .activityiconcontainer{
        width: 40px !important;
        height: 40px !important;
    }
    .drawer.drawer-left {
        width: 370px !important;
        max-width: 550px !important;
    }
    .nav-link{
        height: 40px !important;
    }
    .navbar.fixed-top {
        height: 45px !important;
    }
    .secondary-navigation {
        top: 45px !important;
    }
    .moremenu {
        height: 40px !important;
    }
    .drawer-left {
        top: calc(120px + 1px) !important;
        height: calc(100vh - 120px) !important;
    }
    .body.has-secondarynavigation.hasaccessibilitybar:not(.notloggedin) #page {
        margin-top: 110px !important;
    }
    #page-header {
        margin: 0.15rem auto;
    }
    #page {
        margin-top: 120px !important;
    }
    #page.drawers {
        margin-top: 120px !important;
    }
` );