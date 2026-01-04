// ==UserScript==
// @name         Hide Asana Blocked Tasks
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds 'show/hide blocked tasks' button in Asana
// @author       David McNab <david@conscious.co.nz>
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411316/Hide%20Asana%20Blocked%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/411316/Hide%20Asana%20Blocked%20Tasks.meta.js
// ==/UserScript==

/*
Instructions for installing this script:

1. Install the TamperMonkey browser plugin
2. Load up your Asana tasks lists in a browser tab
3. While still in that tab, click the TamperMonkey button on your browser
   toolbar to open the TamperMonkey menu
4. In the TamperMonkey menu, click 'Create a New Script...'
5. When the script edit tab opens,
6. Delete the comment block
7. Paste in this script in its place
8. Click the 'Settings' tab in the script editor
9. In the "Includes/Excludes" section, add a 'User Include' entry for
   https://app.asana.com/*
10. Go back to 'Editor tab, click the 'save' icon (or press Ctrl-s)
11. Go back to the Asana tab
12. Click again on TamperMonkey button

If you've followed all these correctly, you should be able to return
to the Asana tab, refresh it, and notice a new button labelled 'Show Blocked'
or 'Hide Blocked'
*/

(function() {
  'use strict';

  console.log("TamperMonkey: Adding 'Show/Hide Blocked Tasks' button to Asana");
  var hide = Object();
  hide.hide = true;
  hide.btn = null;
  hide.btnAddTask = null;
  hide.taskRows = null;
  hide.tasksHeading = null;
  hide.interval = null;
  hide.addedSheet = false;
  hide.buttonHTML = "<button id='toggleHide' style='padding: 6px 10px 5px 10px;margin-left:20px;border:solid 1px #e0e0e0; border-radius:7px'>Show Blocked</button>";

  hide.update = function() {
    hide.btnToggleHide = document.getElementById("toggleHide");
    if (hide.btnToggleHide) {
      console.log("found btnToggleHide");
      var row = document.getElementsByClassName('DropTargetRow');
      if (hide.hide) {
        for (var r of row) {
          if (r.innerHTML && r.innerHTML.search('dependentOnIcon') > 0) {
            r.setAttribute('style', 'display:none;');
          }
        }
      } else {
        for (r of row) {
          if (r.innerHTML && r.innerHTML.search('dependentOnIcon') > 0) {
            r.setAttribute('style', 'display:inline;');
          }
        }
      }
      window.setTimeout(hide.update, 3000);
    } else {
      console.log("hideBlocked.update: lost button, recreate it");
      hide.init();
    }
  };

  hide.onClick = function() {
    if (hide.hide) {
      hide.btnToggleHide.innerText = 'Hide Blocked';
      hide.hide = false;
    } else {
      hide.btnToggleHide.innerText = 'Show Blocked';
      hide.hide = true;
    }
    hide.update();
    hide.updateTasksHeading();
  };

  hide.updateTasksHeading = function() {
    if (!hide.tasksHeading) {
      var e = hide.tasksHeading = document.getElementsByClassName('SpreadsheetHeaderLeftStructure-taskNameHeading');
      if (e.length) {
        hide.tasksHeading = e[0];
      }
    }
    if (hide.tasksHeading) {
      hide.tasksHeading.innerHTML = hide.hide ? "Task name (blocked tasks hidden)" : "Task name (including blocked)";
    }
  };

  hide.init = function() {
    hide.tasksHeading = null;
    hide.btnAddTask = document.getElementsByClassName("AddTaskDropdownButton");
    if (hide.btnAddTask.length) {
      hide.btnAddTask = hide.btnAddTask[0];
      hide.btnToggleHide = document.getElementById("toggleHide");
      if (!hide.btnToggleHide) {
        window.clearInterval(hide.initInterval);
        // button either doesn't exist, or disappeared
        hide.btnAddTask.insertAdjacentHTML("afterend", hide.buttonHTML);
        hide.btnToggleHide = document.getElementById("toggleHide");
        hide.btnToggleHide.innerText = hide.hide ? 'Show Blocked' : 'Hide Blocked';
        hide.updateTasksHeading();
        hide.btnToggleHide.addEventListener("click", hide.onClick);
        if (!hide.addedSheet) {
          var sheet = window.document.styleSheets[0];
          sheet.insertRule('#toggleHide:before { display:none;}', sheet.cssRules.length );
          hide.addedSheet = true;
        }
        window.setTimeout(hide.update, 1000);
      }
    }
  };

  hide.initInterval = window.setInterval(hide.init, 1000);
  console.log("GreaseMonkey Code insertion completed");
})();

