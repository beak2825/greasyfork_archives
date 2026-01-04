// ==UserScript==
// @name         WME Status Always Visible
// @updateurl    https://openuserjs.org/meta/Magno/WME_Status_Always_Visible.meta.js
// @namespace    https://openuserjs.org/users/Magno
// @version      2018.03.08.001
// @description  After loading the page, makes sure your status is set to visible.
// @copyright    2018, Magno (https://openuserjs.org/users/Magno)
// @license      MIT
// @author       MagnoBE
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/38921/WME%20Status%20Always%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/38921/WME%20Status%20Always%20Visible.meta.js
// ==/UserScript==

(function () {

  var CurrentVersion = GM_info.script.version;
  var VisibleVersionUpdateNotes = "WME Status Always Visible has been updated to " + CurrentVersion;
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
    if (e && e.user === null) {
      return;
    }

    if (typeof W === 'undefined') {
      setTimeout(init, 300);
    }

    if (typeof W === 'undefined' ||
      typeof W.loginManager === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    if (!W.loginManager.user) {
      W.loginManager.events.register("login", null, init);
      W.loginManager.events.register("loginStatus", null, init);
      if (!W.loginManager.user) {
        return;
      }
    }

    var chatControl = document.querySelector('#chat');
    if (chatControl === null) {
      setTimeout(init, 300);
      return;
    }

    setStatusVisible();
    W.model.chat.on('change:visible', setStatusVisible, this);
  }

  init();

  function setStatusVisible() {
    if (W.model.chat.get('visible') === false) {
        W.model.chat.set('visible', true);
/*
      var wasChatOpen = true;
      var chatControl = document.querySelector('#chat-toggle > button');
      if (W.model.chat.changed.open === false) {
        chatControl.click();
        wasChatOpen = false;
      }
      var visibleDropDown = document.querySelector('#chat > div.header > div.dropdown.visibilty-menu > a');
      visibleDropDown.click();

      var visibleStatusButton = document.querySelector('#chat > div.header > div.dropdown.visibilty-menu.open > ul > li.visibility-visible > a');
      visibleStatusButton.click();

      if (wasChatOpen === false) {
        chatControl = document.querySelector('#chat > div.header > button');
        chatControl.click();
      }
*/
      log('Status updated to Visible');
    }

  }

  function log(message) {
    console.log('WME Visible: ' + message);
  }
})();
