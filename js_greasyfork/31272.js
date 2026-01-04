// ==UserScript==
// @name        Grayscaler
// @description Render entire page in grayscale (greyscale). Updated 2017-07-08.
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2017 Jefferson Scher
// @license     MIT
// @include     *
// @version     0.5.2
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/31272/Grayscaler.user.js
// @updateURL https://update.greasyfork.org/scripts/31272/Grayscaler.meta.js
// ==/UserScript==
function toggleGrayscale(){
  var s=document.getElementById('grayscaler_css'); 
  if(s){
    if (s.innerHTML.indexOf('(100%)') > -1) {
      s.innerHTML='body{transition: filter .2s ease-in-out; filter: grayscale(0%)}'; 
    } else {
      s.innerHTML='body{transition: filter .2s ease-in-out; filter: grayscale(100%) !important}'; 
    }
  } else {
    s=document.createElement('style'); 
    s.id='grayscaler_css'; 
    s.innerHTML='body{filter: grayscale(100%) !important}'; 
    document.getElementsByTagName("head")[0].appendChild(s);
  }
}
// Inject style rule when only <html><head>...</head></html> exists
if (document.getElementsByTagName("head").length > 0){
  // do not style stand alone image pages
  if (document.getElementsByTagName("head")[0].innerHTML.indexOf('TopLevelImageDocument.css') == -1){
    toggleGrayscale();
  }
}

// Add menu item
GM_registerMenuCommand("Toggle Grayscaler (Alt+g)", toggleGrayscale);

// Add keyboard shortcut: Ctrl+Shift+g
function Gray_hotkey(evt){
  if (evt.key == 'g' && evt.altKey) {
    toggleGrayscale();
    evt.preventDefault();
    evt.stopPropagation();
  }
}
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {
    document.body.addEventListener("keypress", Gray_hotkey, true);
  }
};