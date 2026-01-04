// ==UserScript==
// @name EMPeror Dark Theme
// @namespace github.com/openstyles/stylus
// @version 1.0.7
// @description OLED Dark Style
// @author bighype
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https:\/\/www\.empornium\.(sx|is).+)$/
// @downloadURL https://update.greasyfork.org/scripts/505919/EMPeror%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/505919/EMPeror%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
    :root {
        --background: #000;
        --background-light: #0c0c0c;
        --selection-text: #1d1f21;
        --font-color: #e1e1e1;
        --emp-dark-blue: #07206E;
        --emp-light-blue: #07c;
        --emp-dark-red: #350b0b;
        --emp-light-red: #840000;
        --emp-light-green: #135300;
    }
    body {
        background-image: none !important;
        color: var(--font-color) !important;
        background-color: var(--background) !important;
        border-color: var(--selection-text) !important;
        font-size: small;
    }
    h1,
    h2 {
        color: var(--font-color);
    }
    #content {
        width: initial;
        min-width: initial;
        max-width: initial;
        margin: initial;
    }
    span.s-tag.s-good a {
        color: var(--font-color) !important;
        /* font-weight: bold !important; */
    }
    span.s-tag.s-disliked > a {
        color: var(--font-color) !important;
        /* font-weight: bold !important; */
    }
    input[type="checkbox"] {
        transform: scale(1.7);
        accent-color: var(--emp-light-blue);
        opacity: 0.6;
        margin-right: 2px;
    }
    table input[type="checkbox"] + label {
        font-size: 16px;
    }
    input[type="checkbox"]:checked {
        background-size: cover;
        padding: 2px;
    }
    select,
    .inputtext,
    .smallish,
    .smallest {
        background: var(--background-light);
        color: var(--font-color);
    }
    input[type=text]:read-only {
        background: #222;
        color: var(--font-color);
    }
    textarea {
        background-image: initial;
        background-color: var(--background);
        color: var(--font-color);
    }

    .s-tag.s-staff a {
        max-width: initial;
    }
    .details .sidebar,
    #requests .sidebar {
        width: 330px;
    }
    .details .middle_column,
    #requests .middle_column {
        margin: 0px 330px 10px 0px;
    }
    input {
        background: #666;
        color: var(font-color);
    }
    input[type="submit"],
    input[type="button"],
    #threadman-save-settings {
        background-color: var(--emp-dark-blue);
        border: 1px solid transparent;
        border-radius: 3px;
        box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;
        box-sizing: border-box;
        color: var(--font-color);
        cursor: pointer;
        font-size: 13px;
        margin: 0;
        outline: none;
        padding: 4px .6em;
        position: relative;
        text-align: center;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        vertical-align: baseline;
        white-space: nowrap;
    }

    input[type="submit"]:hover,
    input[type="submit"]:focus,
    input[type="button"]:hover,
    input[type="button"]:focus {
        background-color: var(--emp-light-blue);
    }
    input {
        background: var(--background);
        color: var(--font-color);
    }
    input[type="submit"]:focus,
    input[type="button"]:focus {
        box-shadow: 0 0 0 4px rgba(0, 149, 255, .15);
    }

    input[type="submit"]:active,
    input[type="button"]:active {
        background-color: var(--emp-light-blue);
        box-shadow: none;
    }
    .blueButton,
    .infoButton {
        background: var(--emp-light-blue);
    }
    .greenButton {
        background: var(--emp-light-green);
    }
    .orangeButton {
        background: #b54e07;
    }
    .filter_torrents .inputtext {
        width: 80%;
    }
    .button_sort.sort_select {
        background-color: var(--emp-light-blue);
        color: var(--font-color);
    }
    .bbcode {
        background-image: none !important;
    }
    hr {
        border-color: #222;
        opacity: 0.5;
    }
    span.bbcode.tooltip[title="Se7enSeas"] {
        display: none;
    }
    div#logo {
        filter: invert(100%);
        opacity: 0.5;
        transition: opacity 0.3s ease-in-out;
        /* display: none; */
    }
    div#logo:hover {
        filter: invert(0);
        opacity: 1;
    }

    /* Links */
    a,
    .head a,
    .torrent_table .linkbox a {
        color: var(--emp-light-blue);
    }
    .linkbox a,
    .breadcrumbs a {
        color: var(--font-color);
    }
    #menu a {
        color: var(--font-color);
    }
    #menu a:hover {
        background-color: var(--emp-dark-blue);
    }
    #header_bottom a:hover {
        background-color: var(--emp-dark-blue);
    }
    .label {
        background-color: var(--background);
    }
.redbar a, .orangebar a {
    color: var(--emp-light-blue);
}
    /* Tables */
    tr {
        background-color: var(--background);
    }
    td {
        /* background-color: var(--background-light); */
        background-color: var(--background);
    }
    td a {
        font-size: 1em;
    }
    table.boxstat td {
        background-color: var(--background);
    }
    table.boxstat a,
    table.boxstat a:visited {
        color: var(--font-color);
    }
    table.boxstat {
        color: rgb(249, 240, 226);
    }
    .cat_list tr td {
        background-color: var(--background);
    }
    tr.rowa,
    .rowa {
        background-color: var(--background-light);
    }
    tr.rowb,
    .rowb {
        background-color: var(--background);
    }
    table.border {
        border: 1px solid var(--background-light);
    }
    table input[type="checkbox"] + label {
        font-size: 0.9em;
    }

    #articles tr.colhead,
    #forums tr.colhead,
    #top10 tr.colhead,
    #torrents tr.colhead,
    #staff tr.colhead,
    #collage tr.colhead,
    #staffpm tr.colhead,
    #staffpms tr.colhead,
    #tools tr.colhead,
    #userhistory tr.colhead,
    #user tr.colhead,
    #reports tr.colhead,
    #requests tr.colhead,
    #upload tr.colhead,
    #tags tr.colhead,
    #inbox tr.colhead {
        background-color: var(--background-light);
        color: #999;
    }
    .box {
        background: var(--background);
    }
    .font_icon.forum_icons.forum_hint_unread {
        background-image: linear-gradient(rgb(0, 33, 49) 0%, rgb(0, 0, 0) 100%);
        background-color: initial;
        -webkit-text-fill-color: transparent;
        -webkit-text-stroke-color: rgb(78, 153, 200);
    }
    #searchbars input.searchbox {
        background-color: rgb(31, 33, 34);
        border-width: 0px;
        border-style: initial;
        border-color: initial;
        color: rgb(207, 198, 182);
    }
    #searchbars .searchbutton {
        background-image: initial;
        background-color: rgb(31, 33, 34);
        border-width: 0px;
        border-style: initial;
        border-color: initial;
    }
    #searchbars .searchcontainer {
        display: inline-block;
        background-color: rgb(31, 33, 34);
        border: 1px solid black;
        color: #ccc;
        position: relative;
        width: 10%;
        min-width: 110px;
        border-radius: 6px;
        white-space: nowrap;
    }

    .font_icon.torrent_icons.icon_torrent_okay,
    .font_icon.torrent_icons.download,
    .font_icon.torrent_icons.icon_torrent_bonus.bonus,
    .font_icon.torrent_icons.bookmark {
        opacity: 0.6;
    }
    #footer img {
        opacity: 0.5;
        transition: opacity 0.3s ease-in-out;
    }
    #footer img:hover {
        opacity: 1;
    }
    h2 a img {
        opacity: 0.8;
    }
    /* OPTIONAL: hide the modal download details */
    #modal_content .details.thin {
        display: none !important;
    }
    .alertbar {
        background-color: var(--emp-dark-blue);
    }

    .head {
        background: var(--background-light);
        color: var(--font-color);
    }
    .top_info {
        background: var(--background);
    }

    input[type="text"],
    input[type="password"] {
        background: var(--background-light);
        color: var(--font-color);
    }

    /*Tags and script specific modifications */
    span.s-tag.s-disliked {
        background-image: initial;
        background-color: #340000;
        border-bottom-color: #9c0000;
    }
    span.s-tag.s-good {
        background-image: initial;
        background-color: #2a4811;
        border-bottom-color: #716757;
    }
    span.s-tag.s-useless {
        background: #7b7b7b;
    }
    .user_name {
        background-color: #242424;
        border: 1px solid #999;
    }
    .tag_inner .s-tag {
        color: var(--font-color);
        background-color: #1b1d1d;
        border-bottom: 1px solid #232a01;
    }
    .tag_inner .s-tag > a {
        color: var(--font-color);
    }
    .s-add-good,
    .s-remove-good {
        background: #5a7454;
        border: 1px solid var(--emp-light-green);
    }
    .s-add-disliked,
    .s-remove-disliked {
        background: #9E3333;
        border: 1px solid var(--emp-light-red);
    }
    .s-add-terrible,
    .s-remove-terrible {
        background: #333;
        border: 1px solid var(--background);
    }

    .messagebar {
        background-color: #2a4811;
        border: 1px solid #0a390a;
    }
    .messagebar.alert {
        background-color: var(--emp-light-red);
        border: 1px solid var(--emp-dark-red);
    }

    #s-conf-wrapper,
    #s-conf-form {
        background-color: var(--background);
        color: var(--font-color);
        box-shadow: 0 0 20px var(--background);
    }
    /*    
    .tab-row-container a.s-conf-tab {
        color: var(--font-color);
    }
    .tab-row-container a.s-conf-tab:hover {
        color: var(--background);
    }
    */
    .tab-row-container .s-selected a.s-conf-tab {
        background-color: white;
        color: var(--background);
    }
    #s-conf-content textarea {
        background-color: var(--background);
        color: var(--font-color);
    }
    #s-conf-status.s-success {
        color: var(--background);
    }
    #autoresults {
        background-color: var(--background);
        color: var(--font-color);
    }
    /* make almost all user posting themes compliant */
    .bbcode {
        background-color: var(--background) !important;
        color: var(--font-color) !important;
    }
    table.overlay {
        border: 1px solid var(--emp-dark-blue);
        box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, .9);
    }
    .overlay,
    .overlay .leftOverlay,
    .overlay .rightOverlay {
        border: 1px dashed var(--emp-dark-blue);
        background-color: var(--background);
        color: var(--font-color);
    }
    /*
    span.rank {
        color: var(--emp-light-blue) !important; 
    }
    */
    #close-threadman-settings a:hover {
        background-color: var(--emp-light-red);
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
