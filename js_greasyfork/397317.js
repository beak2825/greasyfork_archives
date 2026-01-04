// ==UserScript==
// @name        Hide new-bar and logo - dumpert.nl
// @namespace   Violentmonkey Scripts
// @match       https://legacy.dumpert.nl/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/29/2020, 5:54:31 PM
// @downloadURL https://update.greasyfork.org/scripts/397317/Hide%20new-bar%20and%20logo%20-%20dumpertnl.user.js
// @updateURL https://update.greasyfork.org/scripts/397317/Hide%20new-bar%20and%20logo%20-%20dumpertnl.meta.js
// ==/UserScript==

$(".dump-lgo").remove();
$(".backtothefuture").remove();