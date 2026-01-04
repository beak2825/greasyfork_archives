// ==UserScript==
// @name        Fullscreen production - satisfactory-calculator.com
// @namespace   Violentmonkey Scripts
// @match       https://satisfactory-calculator.com/*/planners/production/*
// @grant       none
// @version     1.0
// @license MIT
// @author      Petr Leo Compel (https://github.com/petrleocompel)
// @description 06/07/2022, 21:48:04
// @downloadURL https://update.greasyfork.org/scripts/447522/Fullscreen%20production%20-%20satisfactory-calculatorcom.user.js
// @updateURL https://update.greasyfork.org/scripts/447522/Fullscreen%20production%20-%20satisfactory-calculatorcom.meta.js
// ==/UserScript==

setTimeout(function() {
  var ad = document.querySelector('[id^="responsiveAds-"]');
  if (ad != null) {
    ad.parentElement.parentElement.remove();
    window.scrollTo(0,0);
  }
  
  var btn = document.createElement("button");
  btn.className = "btn btn-primary btn-sm ml-3";
  btn.innerHTML = 'Fullscreen';
  
  btn.onclick = function() {
    var el = document.getElementById('productionContainer');
    el.requestFullscreen();
    
    document.getElementById('productionTabContent').classList.add('h-100');
    document.getElementById('productionNetwork').classList.add('h-100');
  };
  document.querySelector('.breadcrumb-item.active').parentElement.appendChild(btn)
}, 1000);


if (document.addEventListener)
{
 document.addEventListener('fullscreenchange', exitHandler, false);
 document.addEventListener('mozfullscreenchange', exitHandler, false);
 document.addEventListener('MSFullscreenChange', exitHandler, false);
 document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
 if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
 {
    document.getElementById('productionTabContent').classList.remove('h-100');
    document.getElementById('productionNetwork').classList.remove('h-100');
 }
}
