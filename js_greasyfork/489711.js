// ==UserScript==
// @name     wegfatale
// @version   0.1
// @description   weg met fatale
// @match        https://www.budgetgaming.nl/*
// @grant    none
// @namespace https://greasyfork.org/users/1031439
// @downloadURL https://update.greasyfork.org/scripts/489711/wegfatale.user.js
// @updateURL https://update.greasyfork.org/scripts/489711/wegfatale.meta.js
// ==/UserScript==

$(".gamereactie-meta > a[href*='/profile/GameFatale']").closest (".gamereactie-content").remove ();
