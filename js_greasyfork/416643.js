// ==UserScript==
// @name Kitsu Rails Admin Dark-Mode
// @namespace https://greasyfork.org/users/703350
// @version 1.0.1
// @description Dark-theme for Rails Admin.
// @author Reina
// @license unlicensed
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:(^[\s\S]+kitsu\.io\/api\/admin[\s\S]*)|(^[\s\S]+kitsu\.io\/api))$/
// @downloadURL https://update.greasyfork.org/scripts/416643/Kitsu%20Rails%20Admin%20Dark-Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/416643/Kitsu%20Rails%20Admin%20Dark-Mode.meta.js
// ==/UserScript==

(function() {
let css = `
/* Major */
body {
    background: #151515 !important;
    color: #ddd;
}
.modal-content {
    background-color: #151515 !important;
}

/*nav*/
.navbar {
    background: #151515;
}
.nav {
    background: #151515;
    color: #ddd;
}
.nav-tabs {
    background: #151515;
    border-radius: 5px;
}
a.pjax:hover {
    background-color: #32353c!important;
}
.breadcrumb {
    background: #151515;
}
span {
    color: #ddd;
}

/*nav-tabs*/
.nav-tabs > li > a > i {
    color: #fff;
}
tabs > li.active > a {
    background-color: #000;
}
.nav-tabs > li.active > a:hover {
    background-color: #000;
}
.nav-tabs > li.active > a:focus {
    background-color: #000;
}


/*some kinda table iirc*/
.well {
    background: #333;
}
.input-group {
    background: #333;
}
.anime_row > td {
    background: #151515 !important;
}
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
    background-color: #333;
}

/*date picker*/
.bootstrap-datetimepicker-widget {
    background-color: #1c1b1b;
}
.bootstrap-datetimepicker-widget table td:hover, .bootstrap-datetimepicker-widget table th:hover  {
    background-color: #384148!important;
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-button {
    display: none;
}
::-webkit-scrollbar-track {
    background-color: #111;
    width: 5px;
}
::-webkit-scrollbar-track-piece {
    display: none;
}
::-webkit-scrollbar-thumb {
    background-color: #e06552;
}
::-webkit-scrollbar-corner {
    display: none;
}
::-webkit-resizer {
    display: none;
}
nav-item.open .notifications {
    background: #a8a3a9;
}

/* Form inputs */
.controls > input,
.form-control,
.controls > textarea {
    background: #212121;
    color: #ccc;
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
