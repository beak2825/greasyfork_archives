// ==UserScript==
// @name        SRPG EZ Reader
// @author      CERiNG
// @namespace   https://cering.dev/
// @match       https://srpg*.groovestats.com/*
// @match       https://ecs*.groovestats.com/*
// @grant       none
// @version     1.1.0
// @noframes
// @grant       GM_addStyle
// @run-at      document-end
// @description Allows for an easier viewing experience on Stamina RPG websites.
// @license     MIT
// @icon        https://srpg8.groovestats.com/img/favicon/apple-touch-icon.png
// @downloadURL https://update.greasyfork.org/scripts/469120/SRPG%20EZ%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/469120/SRPG%20EZ%20Reader.meta.js
// ==/UserScript==

const style = `
    * {
        text-shadow: none !important;
    }

   .dataTable {
        font-size: 80%;
    }

    h1, h2, h3, h4, #ruleswrap h1,
    .questname, .questwrap .accBody h4,
    .questwrap .accHead h4, .accHead h4,
    .navbar-nav .dropdown-menu,
    .navbar-light .navbar-nav .nav-link,
    div.floatingAcc.accBody h6,
    div.floatingAcc.accBody #songlookup h6,
    div.floatingAcc.accBody #questoptions h6,
    #passrankstats div.floatingAcc.accBody h6,
    .questwrap span.bighead,
    #shopTop h4,
    #statblockWrap .accHead h4,
    #statblockWrap .vitals h5,
    #questblock .qactivedaily .daily-timer,
    .stattop .accStand h4,
    .subTableWrap .accBody h6,
    #statblockWrap .faction-panel h5,
    a.complist,
    a.reliclist,
    .subTableWrap a,
    #download a.unlocklink
    #statblockWrap h3, .nav-link, .nav-item {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
    }

    body, #resultdialog, #ruleswrap,
    .questwrap .accBody li, a.complist,
    .questwrap .accBody span,
    .questwrap .hint,
    button.qdownload,
    button#qdownloadallnew,
    button#qdownloadallfull,
    button#qfilterbtn,
    button.cdownload,
    button#cdownloadallnew,
    button#cdownloadallfull,
    button.dialogDownload,
    button#updateDlBtn,
    button#updatesettings,
    button#chillFilterBtn,
    .breakdownBlock,
    #relics .subTableWrap a {
        font-family: 'Barlow', sans-serif;
    }

    a.complist, #relics .subTableWrap a {
        font-size: 90%
    }

    #questblock .qactivedaily.questwrap {
        background-color: #0d150fe3;
    }

    body {
        background: #191426;
    }

`;
GM_addStyle(style);