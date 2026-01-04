// ==UserScript==
// @name         sql.ru customizer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  changing sql.ru styles a bit
// @author       Timur Akhmadeev timur.akhmadeev@gmail.com
// @match        https://www.sql.ru/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/424377/sqlru%20customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/424377/sqlru%20customizer.meta.js
// ==/UserScript==

GM_addStyle(`.forumTable {
    width: 100%;
    border-collapse: collapse;
    font: 15px Arial,Verdana;
}`);

GM_addStyle(`a {
    color: #000000;
}`);

GM_addStyle(`a:visited {
    color: #777;
}`);

GM_addStyle(`a.forumLink {
    color: #000000;
    font: 700 15px Arial,Verdana;
}`);

GM_addStyle(`a.forumLink:visited {
    color: #777;
    font: 700 15px Arial,Verdana;
}`);


GM_addStyle(`.forumTable tr>td {
    margin: 0;
    padding: 3px;
    border: 1px solid #d2d3dd;
    background-color: #eee;
}`);

GM_addStyle(`.msgBody a {
    color: #202020;
}`);