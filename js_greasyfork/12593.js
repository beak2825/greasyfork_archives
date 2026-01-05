// ==UserScript==
// @name         Feedsportal ad skipper
// @description  Skips feedsportal interstitial ads
// @version      1.01
// @author       ablauch
// @include      http://da.feedsportal.com/*
// @include      https://da.feedsportal.com/*
// @grant        none
// @namespace    ablauch
// @downloadURL https://update.greasyfork.org/scripts/12593/Feedsportal%20ad%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/12593/Feedsportal%20ad%20skipper.meta.js
// ==/UserScript==

if (document.querySelector) {
  var finalLink = document.querySelector("div#clicker div a");
  if (finalLink) {
    console.debug("Skipping Feedsportal Ad...");
    window.location = finalLink.href;
  }
}