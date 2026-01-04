// ==UserScript==
// @name         xivanalysis Button
// @namespace    dansa#5509
// @version      1.1
// @description  Jump from FFlogs fight to respective xivanalysis page with a button. Redirects to selected player and pull (if any), or to the report page per default.
// @author       dansa
// @match        https://*.fflogs.com/reports/*
// @match        https://fflogs.com/reports/*
// @run-at document-idle
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406899/xivanalysis%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/406899/xivanalysis%20Button.meta.js
// ==/UserScript==

GM_addStyle(".xivabtn { position: fixed; z-index: 2000; bottom:0; right:0; background-color: #202020;}");
GM_addStyle(".xivaimg { height:33px;width:33px;margin:5px;background-image: url(https://xivanalysis.com/logo.png);background-size: contain;}");

(function () {
  $("body").append("<div class='report-overview-boss-box xivabtn'><a id='xivabtn' href='"+ "https://xivanalysis.com/report-redirect/" + location.href +"'><div class='xivaimg'></div></a></div>");
})();

window.onhashchange = function() { 
  $("#xivabtn").attr("href", "https://xivanalysis.com/report-redirect/" + location.href);
};