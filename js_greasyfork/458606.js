// ==UserScript==
// @name        hejto - wymuś motyw nocny/ciemny/dark lub dzienny/jasny/light
// @namespace   Hejto.pl scripts
// @match       https://www.hejto.pl/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      Orlin
// @description Wymusza ciemny/nocny motyw na hejto.pl
// @downloadURL https://update.greasyfork.org/scripts/458606/hejto%20-%20wymu%C5%9B%20motyw%20nocnyciemnydark%20lub%20dziennyjasnylight.user.js
// @updateURL https://update.greasyfork.org/scripts/458606/hejto%20-%20wymu%C5%9B%20motyw%20nocnyciemnydark%20lub%20dziennyjasnylight.meta.js
// ==/UserScript==

var forcingDark = true; // true=> wymusza ciemny/nocny; false => wymusza jasny/dzienny


function forceDark()
{
  let isThereDark = document.body.classList.contains('dark');
  if(forcingDark && !isThereDark || !forcingDark && isThereDark)
  {
    document.querySelectorAll('button[aria-label="Zmień motyw"]')[0].click();
  }
}

var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return;

    if( MutationObserver ){

      var mutationObserver = new MutationObserver(callback)

      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }

    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})();

window.addEventListener('load', function() {
    forceDark();
    observeDOM(document.body, function(m){
      forceDark();
    });
}, false);
