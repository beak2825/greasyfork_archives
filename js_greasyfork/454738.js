// ==UserScript==
// @name         Aternos account Toolkit
// @namespace    https://aternos.org/account
// @version      1.0
// @description  Aternos Felszerelés Balazsmanustól
// @author       BalazsManus
// @match        https://aternos.org/account/*
// @grant        none
// @icon         https://www.spigotmc.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/454738/Aternos%20account%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/454738/Aternos%20account%20Toolkit.meta.js
// ==/UserScript==
// Elhozta neked BalazsManus :D

$('#placement-account-bottom').remove();
$('#placement-takeover').remove();
$('.responsive-leaderboard').remove();
$('.sidebar').css('display', 'none');