// ==UserScript==
// @name        Right Open & Close
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @match       file:///*
// @run-at      document-start
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       window.close
// @version     1.2
// @author      leoshone
// @description RClick open link, Double RClick close tab
// @downloadURL https://update.greasyfork.org/scripts/419370/Right%20Open%20%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/419370/Right%20Open%20%20Close.meta.js
// ==/UserScript==
(function() {
  //Hide context menu, Press CTRL + RClick show context menu
  document.addEventListener('contextmenu', function(e) {
    if (!e.ctrlKey)
      e.preventDefault();
  }, false);
  
  //RClick open link in background tab, Double RClick close tab
  var clickNo = 0;
  var resetId;
  document.addEventListener('mousedown', function(e) {
    if (!e.ctrlKey && e.button == 2) {
      clickNo++;
      if (clickNo == 1) {
        resetId = setTimeout(function() {
          clickNo = 0;
          var href = e.target.closest('a').href;  
          if (href !== "" && !/^javascript:/i.test(href.toString()))
            GM_openInTab(href, {active: false, insert: false});
        }, 300);
      } else if (clickNo == 2) {
        clickNo = 0;
        clearTimeout(resetId);
        window.close();
      } 
    }
    else
      clickNo = 0;
  }, false);
})();