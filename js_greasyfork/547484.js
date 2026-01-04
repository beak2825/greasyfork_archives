// ==UserScript==
// @name         WME Status Always Visible
// @namespace    https://greasyfork.org/en/users/1365511-robosphinx
// @version      2025.08.27.002
// @description  After loading the page, makes sure your status is set to visible.
// @copyright    2018, Magno (https://openuserjs.org/users/Magno, https://greasyfork.org/en/users/172473-magno)
// @license      MIT
// @author       MagnoBE, robosphinx
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        none
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/547484/WME%20Status%20Always%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/547484/WME%20Status%20Always%20Visible.meta.js
// ==/UserScript==

(function () {

  var CurrentVersion = GM_info.script.version;
  var VisibleVersionUpdateNotes = "WME Status Always Visible has been updated to " + CurrentVersion;
  VisibleVersionUpdateNotes += "\n\n" + "2025.08.27";
  VisibleVersionUpdateNotes += "\n" + "Updated to use button clicks instead of subscribing to events :/";

  VisibleVersionUpdateNotes += "\n" + "Will also keep you online without refresh";
  VisibleVersionUpdateNotes += "\n\n" + "2018.03.08";
  VisibleVersionUpdateNotes += "\n" + "Updated to use events instead of invoking button clicks";
  VisibleVersionUpdateNotes += "\n" + "Will also keep you online without refresh";

  VisibleVersionUpdateNotes += "\n\n" + "2018.02.26";
  VisibleVersionUpdateNotes += "\n" + "Initial Version";

  if (localStorage.getItem('WMEVisibleVersion') === CurrentVersion) {
    log("Version - " + CurrentVersion);
  }
  else {
    alert(VisibleVersionUpdateNotes);
    localStorage.setItem('WMEVisibleVersion', CurrentVersion);
  }

  function init(e) {
    // log("Getting e");
    if (e && e.user === null) {
      return;
    }

    // log("Getting W");
    if (typeof W === 'undefined') {
      setTimeout(init, 300);
    }

    // log("Getting loginManager");
    if (typeof W === 'undefined' ||
      typeof W.loginManager === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    // log("Getting user");
    if (!W.loginManager.user) {
      W.loginManager.events.register("login", null, init);
      W.loginManager.events.register("loginStatus", null, init);
      if (!W.loginManager.user) {
        setTimeout(init, 300);
        return;
      }
    }

    // log("Getting online editors control");
    var onlineEditorsControl = $('.online-editors-bubble');
    if (onlineEditorsControl === null) {
      setTimeout(init, 300);
      return;
    }

    setStatusVisible();
  }

  init();

  var wasClosed = false;

  function setStatusVisible() {
      //log('Setting status to Visible');
      //log ("Getting editors list");
      if ($(".online-editors-list-wrapper").length === 0) {
          //log ("Editors list was closed.");
          wasClosed = true;
          $('.online-editors-bubble').click();
          setTimeout(setStatusVisible, 500);
          return;
      }

      //log ("Getting layer visibility");
      if ($(".turn-on-button").length === 1) {
          //log ("Layer is invisible.");
          $(".turn-on-button").click();
          //log ("Clicked \"Turn on\" button.");
          setTimeout(setStatusVisible, 500);
          return;
      }

      //log ("Getting editor visibility");
      if ($(".w-icon-invisible")) {
          //log ("Editor is invisible.");
          $(".w-icon-invisible").click();
          //log ("Clicked invisible icon.");
      }

      //log ("Returning editors list to previous state");
      if (wasClosed) {
          //log("Closing editors list.");
          $('.online-editors-bubble').click();
      }
      log('Status updated to Visible');
  }

  function log(message) {
    console.log('WME Visible: ' + message);
  }
})();
