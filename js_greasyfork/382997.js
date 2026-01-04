// ==UserScript==
// @name         Free Dark Mode MeWe
// @version      0.0.5
// @description  Enables dark mode on MeWe for free!
// @author       TotoDude
// @match        *://*.mewe.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/301529
// @downloadURL https://update.greasyfork.org/scripts/382997/Free%20Dark%20Mode%20MeWe.user.js
// @updateURL https://update.greasyfork.org/scripts/382997/Free%20Dark%20Mode%20MeWe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var user = localStorage.getItem("currentUser"),
      team;

    if (user) {
      team = user.match('"team":{"id":"([a-z0-9]+)"');
      team = team && team[1];
      user = user.match('"id":"([a-z0-9]+)"');
      user = user && user[1];
      if ( !user) {
        return;
      }

      if (team) team = '-' + team;
      else team = '';

    } else { return; }
    if (!localStorage.getItem("isDarkThemeAllowed-" + user + team) || localStorage.getItem("isDarkThemeAllowed-" + user + team) !== "") {
        localStorage.setItem("isDarkThemeAllowed-" + user + team, true);
    }
    setInterval(function() {
        if ($('#dark-theme-styles-head').length < 0 && $('.theme-dark').length < 0) {
            document.getElementsByTagName("html")[0].className += " theme-dark";
            var themeCss = document.createElement("link");
            themeCss.type = "text/css";
            themeCss.rel = "stylesheet";
            themeCss.href = "/app/themes/theme-dark.744097f5.css";
            themeCss.id = "dark-theme-styles-head";
            document.getElementsByTagName("head")[0].appendChild(themeCss);
        }
    }, 1000);
})();