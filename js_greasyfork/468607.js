// ==UserScript==
// @name        Rekonize Bypasser
// @namespace   Violentmonkey Scripts
// @match       https://rekonise.com/*
// @grant       none
// @version     1.1.0
// @license     MIT
// @author      Colby Faulkn
// @description Bypasses the subscription prompts present on rekonise urls.
//              Queries rekonise's API for the redirect url, prompts the user if they'd like to continue and then redirects them.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468607/Rekonize%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/468607/Rekonize%20Bypasser.meta.js
// ==/UserScript==


let $ = jQuery.noConflict();
let sPathname = window.location.pathname;
let sRedirectUrl = `https://api.rekonise.com/social-unlocks${sPathname}/unlock`;
let sHeader = '----------------------------------\nColby\'s Rekonise.com Bypasser\n----------------------------------\n';

// request the redirect url from rekonise's api
$.getJSON(sRedirectUrl, function(data) {
  if (confirm(`${sHeader}> Response from API received.\n> You will be redirected to:\n> ${data['url']}`)) {
    window.location.href = data['url'];
  }
  else {
    alert(`${sHeader}> The redirect was declined!\n> To try the bypasser again, just refresh the page.`);
  }
});
