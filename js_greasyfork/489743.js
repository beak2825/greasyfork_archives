// ==UserScript==
// @name     wegfatale2
// @version   0.7
// @description   weg met fatale
// @match        https://www.budgetgaming.nl/*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=15061&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=681&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=905&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=20334&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=8719&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=21207&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=21834&*
// @exclude      https://www.budgetgaming.nl/forum.php?*&topic_id=3496&*
// @run-at      document-end

// @grant    none
// @namespace https://greasyfork.org/users/1031439
// @downloadURL https://update.greasyfork.org/scripts/489743/wegfatale2.user.js
// @updateURL https://update.greasyfork.org/scripts/489743/wegfatale2.meta.js
// ==/UserScript==
 
$(".gamereactie-meta > a[href*='/profile/GameFatale']").closest (".gamereactie").remove ();