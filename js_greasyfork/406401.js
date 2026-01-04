// ==UserScript==
// @name        [WM] Accesskey Navigation for Animekisa.tv
// @namespace   https://github.com/WidgetMidget/scripts-and-userstyles
// @author      WidgetMidget
// @description Ctrl + Arrow Key navigation.
// @version     1.1.31
// @icon        https://raw.githubusercontent.com/WidgetMidget/scripts-and-userstyles/master/resources/favicons/animekisa-tv.png
// @supportURL  https://github.com/WidgetMidget/scripts-and-userstyles/issues
// @match       *://*.animekisa.tv/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406401/%5BWM%5D%20Accesskey%20Navigation%20for%20Animekisatv.user.js
// @updateURL https://update.greasyfork.org/scripts/406401/%5BWM%5D%20Accesskey%20Navigation%20for%20Animekisatv.meta.js
// ==/UserScript==

/* globals $ */

document.addEventListener('keydown', function(e){
  if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey)
  {
    switch (e.keyCode)
    {
      case 37:
        $("#playerselector").find("option:selected").prev().prop("selected", true).trigger("change");
      break;
      case 39:

        $("#playerselector").find("option:selected").next().prop("selected", true).trigger("change");
      break;
    }
  }
}, true);