// ==UserScript==
// @name         Aternos access Toolkit
// @namespace    https://aternos.org/access
// @version      1.0
// @description  Aternos Felszerelés Balazsmanustól
// @author       BalazsManus
// @match        https://aternos.org/access/*
// @grant        none
// @icon         https://www.spigotmc.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/454737/Aternos%20access%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/454737/Aternos%20access%20Toolkit.meta.js
// ==/UserScript==
// Elhozta neked BalazsManus :D

$('#placement-account-bottom').remove();
$('#placement-takeover').remove();
$('.responsive-leaderboard').remove();
$('.sidebar').css('display', 'none');