// ==UserScript==
// @name MIT Technology Review Paywall Remover
// @author Shiny_Eevee
// @author noname120

// @namespace HandyUserscripts
// @description Remove the paywall on MIT Technology Review
// @version 2
// @license Creative Commons BY-NC-SA

// @match http*://technologyreview.com/
// @match http*://www.technologyreview.com/
// @match http*://www.technologyreview.com/*

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/445661/MIT%20Technology%20Review%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/445661/MIT%20Technology%20Review%20Paywall%20Remover.meta.js
// ==/UserScript==

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
window.addEventListener('load',
  function() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.localStorage.clear();
  }, false);
