// ==UserScript==
// @name     			Dallas Morning News Adblock Remover
// @description		Remove the adblock paywall from the Dallas Morning News
// @version				0.3
// @author              Erik Hanson
// @namespace    	https://lefte.com/
// @grant    			none
// @match    			https://www.dallasnews.com/*
// @require  			https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/391264/Dallas%20Morning%20News%20Adblock%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/391264/Dallas%20Morning%20News%20Adblock%20Remover.meta.js
// ==/UserScript==

function paywallChecker() {
  var paywalled = $("#courier-iframe").is(':visible');

  if (paywalled) {
    console.log("DMNAR: Removing paywall frame");
    var paywallEl = $("#courier-iframe").css("display", "none");
    console.log("DMNAR: Setting content to scroll again");
    var bodyEl = $("#courier-body-wrapper").css("position", "inherit");
  } else {
    console.log("DMNAR: No paywall, but still (re-)setting content to scroll again");
    var bodyEl = $("#courier-body-wrapper").css("position", "inherit");
    console.log("DMNAR: Removing message");
    $("#dmnarMessage").remove();
  }    
}

(function() {
  'use strict';
  
  setTimeout(paywallChecker, 5000);
  setTimeout(paywallChecker, 15000);
  console.log("DMNAR: Adding paywall message");
  $("body").append("<div id=\"dmnarMessage\" style=\"position: fixed; bottom: 0; background-color: red; color: white; padding: 0.5em; font-size: 1em; font-style: italic; \">DMNAR: Waiting to remove paywall message...</div>");
})();
