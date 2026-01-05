// ==UserScript==
// @name         EMP trippy
// @namespace    http://tampermonkey.net/
// @version      1
// @description  making things roll along.
// @author       Some evil guy.
// @include      /https?://www\.empornium\.(me|sx)*/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/18426/EMP%20trippy.user.js
// @updateURL https://update.greasyfork.org/scripts/18426/EMP%20trippy.meta.js
// ==/UserScript==
'use strict';

GM_addStyle("@keyframes spin {0%  {transform: rotate(0deg);}100% {transform: rotate(360deg);}0%  {-ms-transform: rotate(0deg);}100% {-ms-transform: rotate(360deg);0%  {-webkit-transform: rotate(0deg);}100% {-webkit-transform: rotate(360deg);}}}");

GM_addStyle("table {animation: spin 30s infinite linear;-ms-transform: spin 30s infinite linear;-webkit-transform: spin 30s infinite linear;}");