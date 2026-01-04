// ==UserScript==
// @name     Unnamed Script 311383
// @version  1.2
// @include  http://www.jeuxvideo.com/*
// @include  https://www.jeuxvideo.com/*
// @match  http://www.jeuxvideo.com/*
// @match  https://www.jeuxvideo.com/*
// @description Combattre le bot !
// @grant    none
// @namespace https://greasyfork.org/users/103119
// @downloadURL https://update.greasyfork.org/scripts/39491/Unnamed%20Script%20311383.user.js
// @updateURL https://update.greasyfork.org/scripts/39491/Unnamed%20Script%20311383.meta.js
// ==/UserScript==

document.getElementById("message_topic").value = "https://www.egaliteetreconciliation.fr/";
setTimeout(function() {document.getElementsByClassName("btn btn-poster-msg datalayer-push js-post-message")[0].click();}, 2000);