// ==UserScript==
// @name        Messenger.com Sidebar Hider
// @namespace   messengerSidebarHider
// @match       https://www.messenger.com/*
// @match       https://messenger.com/*
// @match       https://m.me/*
// @description Hide sidebars in FB Messenger with Alt+Shift+ArrowLeft and Alt+Shift+ArrowRight
// @version     1.0.1
// @grant       none
// @run-at      document-idle
// @icon        view-source:https://static.xx.fbcdn.net/rsrc.php/y7/r/O6n_HQxozp9.ico
// @author      Adam Carmichael <carneeki@carneeki.net>
// @downloadURL https://update.greasyfork.org/scripts/377701/Messengercom%20Sidebar%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/377701/Messengercom%20Sidebar%20Hider.meta.js
// ==/UserScript==

function toggleElements(e) {  
  if(e === null) {
    console.warn("mSH: toggleElements received a null");
    return;
  }
  
  if(e.length === 0) {
    console.warn("mSH: toggleElements received zero elements");
    return;
  }
  
  for(var i = 0; i < e.length; i++)
  {
    element = e.item(i);
    element.style.display = (element.style.display == 'none' ? 'block' : 'none');
  }
}

function keyEvt(e) {
  var report =
        "mSH: " +
        ( e.ctrlKey  ? "Control " : "" ) +
        ( e.shiftKey ? "Shift "   : "" ) +
        ( e.altKey   ? "Alt "     : "" ) +
        ( e.metaKey  ? "Meta "    : "" ) +
        e.code + " " +
        "key was pressed.";
  console.debug(report);
  
  if(e.altKey && e.shiftKey && e.code === "ArrowLeft") {
    // alt+shift+left: hide conversation list
    elements = document.getElementsByClassName('_1enh');
    toggleElements(elements);
    console.debug("mSH: TRIGGER LEFT!");
  }
  if (e.altKey && e.shiftKey && e.code === "ArrowRight") {
    // alt+shift+right: hide right hand bar
    element = document.getElementsByClassName('_4_j5');
    toggleElements(element);
    console.debug("mSH: TRIGGER RIGHT!");
  }
}

window.addEventListener('keydown', keyEvt, true);