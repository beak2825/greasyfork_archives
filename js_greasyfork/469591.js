// ==UserScript==
// @name               CordTextSMS Discord Token Fetcher
// @name:en            CordTextSMS Discord Token Fetcher
// @description:en     See your Discord token
// @description:es     See your Discord token
// @author             cordtextsms
// @version            1.0
// @namespace          https://greasyfork.org/users/469591
// @match              *://*.discord.com/channels/*
// @icon               https://www.google.com/s2/favicons?domain=discord.com
// @require            https://code.jquery.com/jquery-3.6.0.min.js
// @run-at             document-start
// @license            GNU/GLP
// @description See your Discord token
// @downloadURL https://update.greasyfork.org/scripts/469591/CordTextSMS%20Discord%20Token%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/469591/CordTextSMS%20Discord%20Token%20Fetcher.meta.js
// ==/UserScript==
 
$(function() {
  let discordToken = localStorage.getItem("token").split('"').join("");
  if (!0 === confirm("Do you want to see your Discord token? 1/3")) {
    if (!0 === confirm("Do you want to see your Discord token? 2/3")) {
      !0 === confirm("Do you want to see your Discord token? 3/3") ? (prompt("Your Discord token:", discordToken), discordToken = "") : discordToken = ""
    } else discordToken = ""
  } else discordToken = ""
});