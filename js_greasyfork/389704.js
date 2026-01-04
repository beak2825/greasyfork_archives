// ==UserScript==
// @name                WME Auto Reload
// @namespace           http://greasemonkey.chizzum.com
// @description         Auto-reloads the WME data model on map moves
// @include             https://*.waze.com/*editor*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/*editor/*
// @exclude             https://www.waze.com/*/user/*editor/*
// @grant               none
// @version             1.1
// @downloadURL https://update.greasyfork.org/scripts/389704/WME%20Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/389704/WME%20Auto%20Reload.meta.js
// ==/UserScript==

/* JSHint Directives */
/* globals W: true */
/* jshint bitwise: false */
/* jshint eqnull: true */
/* jshint esversion: 6 */

function warReload()
{
   var inhibitReload = false;
   inhibitReload = inhibitReload || (document.getElementsByClassName("waze-icon-save ItemDisabled").length == 0);
   inhibitReload = inhibitReload || W.selectionManager.hasSelectedFeatures();
   if(inhibitReload === false)
   {
      W.controller.reload();
   }
}
function warInit()
{
   if(document.location.href.indexOf('user') !== -1)
   {
      return;
   }
   if(typeof W != "undefined")
   {
      if((typeof W.controller != "undefined") && (typeof W.selectionManager != "undefined") && (typeof W.map != "undefined"))
      {
         W.map.events.register("moveend", null, warReload);
         return;
      }
   }
   window.setTimeout(warInit,250);
}
warInit();