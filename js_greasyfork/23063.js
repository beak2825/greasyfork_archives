// ==UserScript==
// @name         Fuck Autoplay
// @namespace    https://greasyfork.org/en/users/11508-arcbell
// @version      1.0
// @description  Epicmafia profile videos no longer autoplay
// @author       Arcbell
// @match        https://epicmafia.com/user/*
// @match        https://epicmafia.com/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23063/Fuck%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/23063/Fuck%20Autoplay.meta.js
// ==/UserScript==

var youtubeurl = $('#embed iframe')[0].src;
$('#embed iframe')[0].src = youtubeurl.replace('autoplay=1', 'autoplay=0');