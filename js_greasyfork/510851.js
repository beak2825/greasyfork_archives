// ==UserScript==
// @name         Nyaa Casement
// @name:en      Nyaa Casement
// @name:vi      Nyaa Casement
// @name:zh-CN   Nyaa Casement
// @name:zh-TW   Nyaa Casement
// @name:ja      Nyaa Casement
// @namespace    https://greasyfork.org/vi/users/1195312
// @author       Yuusei
// @description  ~simple pleb theme~  ~Dark Mode only~
// @description:en  ~simple pleb theme~  ~Dark Mode only~
// @description:vi  ~simple pleb theme~  ~Dark Mode only~
// @description:zh-CN  ~简单的主题~  ~仅限深色模式~
// @description:zh-TW  ~簡單的 Pleb 主題~  ~僅限深色模式~
// @description:ja  〜シンプルなplebテーマ〜　〜ダークモードのみ〜
// @version      1.0
// @license      NONE
// @match        https://nyaa.si/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/510851/Nyaa%20Casement.user.js
// @updateURL https://update.greasyfork.org/scripts/510851/Nyaa%20Casement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
/* General Styles */
body {
    background: url(https://w.wallhaven.cc/full/85/wallhaven-85prg1.jpg) !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    color: white !important;
    text-shadow: 2px 2px 4px #000000;
}

a, a.comments {
    color: #9d9d9d !important;
}
a:hover {
    color: #ff0051 !important;
    text-decoration: none !important;
}
a:visited:hover {
    color: #970030 !important;
}

/* Table Styles */
.table-responsive, table.table-bordered.table-hover.table-striped.torrent-list {
    background: rgba(0, 0, 0, .3) !important;
    color: #9d9d9d !important;
    border: solid 1px #3d3d3d !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
    border-radius: 10px;
}
th, td {
    border: none !important;
    background: rgba(0, 0, 0, .1) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
thead {
    background: rgba(0, 0, 0, .7) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}


/* Button Styles */
.default {
    background: rgba(0, 0, 0, .3) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.default:hover {
    background: rgba(0, 0, 0, .5) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.danger {
    background: rgba(255, 0, 0, .04) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.danger:hover {
    background: rgba(70, 0, 0, .5) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.success {
    background: rgba(10, 255, 0, .04) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.success:hover {
    background: rgba(11, 76, 0, .5) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}



/* Navbar Styles */
.navbar.navbar-default.navbar-static-top.navbar-inverse {
    background: rgba(0, 0, 0, 0.4) !important;
    border: none;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.navbar a {
    color: white !important;
}
.navbar a:hover {
    color: #ff0051 !important;
    text-decoration: none !important;
}


/* Alert Styles */
.alert {
    background: rgba(0, 0, 0, .5) !important;
    border: none !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
}
.alert a {
    color: white !important;
}
.alert a:hover {
    color: #ff0051 !important;
    text-decoration: none !important;
}


/* Panel Styles */
.panel, .panel-heading, .panel-footer {
    background: rgba(0, 0, 0, .5) !important;
    border: none !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5);
    color: white;
}


/* List and Dropdown Styles */
li a {
    color: white !important;
}
ul.pagination, .dropdown-menu {
    background: rgba(0, 0, 0, 0.4) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5) !important;
}
.dropdown-menu a:hover {
    background: rgba(0, 0, 0, 0.6) !important;
}


/* Profile Page Styles */
body[href*="/profile"] div.container {
    background: rgba(0, 0, 0, .5) !important;
}


/* Rules and Help Page Styles */
body[href*="/rules"] .container:nth-child(2),
body[href*="/help"] .container:nth-child(2) {
    background: rgba(0, 0, 0, .7) !important;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .5) !important;
    border-radius: 10px;
    padding-bottom: 30px;
    margin-bottom: 30px;
}

/* Mobile Styles */
@media (max-width: 768px) {
    .table-responsive {
        overflow-x: auto; /* Enable horizontal scrolling for tables on small screens */
    }
}
`;

    GM_addStyle(css);
})();