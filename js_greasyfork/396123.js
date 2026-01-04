// ==UserScript==
// @name         BusinessInsider Adblock Blocker
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Get rid of BusinessInsiders adblock blocker
// @author       Josh Hubbard
// @match        https://businessinsider.com/@*
// @match        https://*.businessinsider.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/396123/BusinessInsider%20Adblock%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/396123/BusinessInsider%20Adblock%20Blocker.meta.js
// ==/UserScript==

time=setInterval(function(){
  $("body").removeClass("tp-modal-open");
  $(".tp-modal, .tp-backdrop").remove();
},500);

