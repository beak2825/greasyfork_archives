// ==UserScript==
// @name         webtoons.com scroll killer
// @namespace    https://github.com/Crack/webtoons.com-scroll-killer
// @description  Restores normal behaviour of down and up keys on webtoons.com
// @version      1.0
// @match        http://www.webtoons.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11198/webtoonscom%20scroll%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/11198/webtoonscom%20scroll%20killer.meta.js
// ==/UserScript==

function copyFunction(source) {
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = "" + source;

  document.body.appendChild(script);
  document.body.removeChild(script);
}

function movePrevious(){}
function moveNext(){}

copyFunction(movePrevious);
copyFunction(moveNext);