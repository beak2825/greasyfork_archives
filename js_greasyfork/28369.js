// ==UserScript==
// @name Callback Button Killer
// @namespace Violentmonkey Scripts
// @grant none
// @version 0.1
// @match  *://lk.mango-office.ru/*
// @description  Bobrovskih A.
// @description:ru Kill the Button :)
// @copyright      2017, Bobrovskih A.

// @downloadURL https://update.greasyfork.org/scripts/28369/Callback%20Button%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/28369/Callback%20Button%20Killer.meta.js
// ==/UserScript==

if (window.location.host.includes('lk.mango-office.ru')) {
    removeMangoCallbackFromLk();
    return;
}

function removeMangoCallbackFromLk(){
  var buttonColl = document.getElementsByClassName('mango-callback');
  for(i=0;i<buttonColl.length;i++)
    buttonColl[i].remove();
}