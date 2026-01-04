// ==UserScript==
// @name	KOC-Popup-Blocker
// @namespace		KPB
// @description		Block KOC poup facebook
// @include			*apps.facebook.com/kingdomsofcamelot/*
// @author      Mandalorian
// @license     CC-BY-4.0
// @version			1.10
// @releasenotes	    <p>Release</p>
// @downloadURL https://update.greasyfork.org/scripts/431304/KOC-Popup-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/431304/KOC-Popup-Blocker.meta.js
// ==/UserScript==
setInterval(()=> {
 var selectorId = document.querySelector('a.autofocus._9l2h.layerCancel._4jy0._4jy3._4jy1._51sy.selected._42ft');
 if(selectorId){
  selectorId.click()}
  },1000)