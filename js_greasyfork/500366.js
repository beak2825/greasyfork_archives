// ==UserScript==
// @name        AP-intranet + open TP in new tab
// @description  AP-intranet + open TP in new tab.
// @namespace   english
// @include     http*://*globaljtbgroup.sharepoint.com/sites/AsiaPacific/Pages/Home.asp*
// @version     1.15
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500366/AP-intranet%20%2B%20open%20TP%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/500366/AP-intranet%20%2B%20open%20TP%20in%20new%20tab.meta.js
// ==/UserScript==

// Main - CSS added to header 
/*
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                     ';
document.getElementsByTagName('head')[0].appendChild(style);
*/




function tpnxinitpukka(){


let event = new KeyboardEvent("keypress", {
  bubbles: true,
  cancelable: true,
  charCode: 0,
  keyCode: 84,
  key: "",
  shiftKey: false,
  altKey: false,
  ctrlKey: true,
  metaKey: false,
  repeat: false,
  location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
});


// Select the element to target
let inputElement = document.getElementById("ms-designer-ribbon");

// Create and dispatch the event
inputElement.dispatchEvent(event);



window.open("https://google.com", '_blank');




}



window.open("https://pa-jtbsyd.nx.tourplan.net/tourplannx/", '_blank');




/*

window.addEventListener("load", (event) => {
  tpnxinitpukka();setTimeout(() => { tpnxinitpukka(); }, 888);
});

*/
