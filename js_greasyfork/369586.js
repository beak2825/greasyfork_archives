// ==UserScript==
// @name         EZTV row highlight
// @namespace    mikeos
// @version      0.1
// @description  Highlights row on hover
// @author       Michael Osincev
// @include        *eztv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369586/EZTV%20row%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/369586/EZTV%20row%20highlight.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.innerHTML = '[name="hover"]:hover,.forum_header_border:hover{background:#fff!important;}';
document.getElementsByTagName("body")[0].appendChild(style);