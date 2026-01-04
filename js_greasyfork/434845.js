// ==UserScript==
// @name          Melvor Remove 8 Keybind
// @version       1.0
// @author        koolioolio
// @description   Prevents the 8 key from creating 8 items. Tested Melvor 22.1 (1209)
// @match         https://*.melvoridle.com/*
// @exclude-match https://wiki.melvoridle.com/*
// @noframes
// @grant         none
// @inject-into   page
// @run-at        document-idle
// @namespace https://greasyfork.org/users/808226
// @downloadURL https://update.greasyfork.org/scripts/434845/Melvor%20Remove%208%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/434845/Melvor%20Remove%208%20Keybind.meta.js
// ==/UserScript==
function removeEightKeybind() {
  var eventsToRemove = []; //first remove the document-wide keypress bind which does nothing but 8
  $._data(document, "events").keypress.forEach(function append(e){if (e.handler.toString().includes("(e.keyCode==56)")) eventsToRemove.push(e);});
  eventsToRemove.forEach(function remove(e){$(document).unbind("keypress", e.handler);});
  eventsToRemove = []; //then remove the searchTextbox keyup bind which has other purposes
  $._data($("#searchTextbox")[0], "events").keyup.forEach(function append(e){if (e.handler.toString().includes("if(!eightSeconds)")) eventsToRemove.push(e);});
  eventsToRemove.forEach(function remove(e){$($("#searchTextbox")[0]).unbind("keyup", e.handler);});
  //finally, re-add a copy of the keyup bind that has no 8 code so we don't break searching and wherearemylemons
  $("#searchTextbox").keyup(function(){let search=$("#searchTextbox").val();updateBankSearch(search);if(search==="wherearemylemons")addItemToBank(CONSTANTS.item.Lemon,1);});
}
var load = setInterval(function() {
  if (isLoaded) {
    clearInterval(load);
    removeEightKeybind();
  }
}, 300);