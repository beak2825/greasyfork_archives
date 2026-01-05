// ==UserScript==
// @name         IITC-UI-display-none
// @namespace    
// @version      0.0.2
// @description  IITCのUI消すよ
// @author       kik0220 fork from IGUCHI
// @match        https://www.ingress.com/intel*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10869/IITC-UI-display-none.user.js
// @updateURL https://update.greasyfork.org/scripts/10869/IITC-UI-display-none.meta.js
// ==/UserScript==

document.body.addEventListener("DOMNodeInserted", function(e){
  try{
    GM_addStyle('#updatestatus, #scrollwrapper, #sidebartoggle, #privacycontrols, div.leaflet-control-container {display:none;}');
  } catch(e) { return; }
}, false);
