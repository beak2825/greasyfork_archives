// ==UserScript==
// @name Supremacy1914 AD blocker
// @namespace http://tampermonkey.net/
// @version 1.5
// @description AD = cancer, Script can may soon be obsolete
// @author Somka
// @match *://www.supremacy1914.pl/*
// @match *://pl.callofwar.com/*
// @match *://www.callofwar.com/*
// @match *://www.callofwar.fr/*
// @match *://www.callofwar.de/*
// @match *://www.callofwar.ru/*
// @match *://www.callofwar.nl/*
// @match *://www.callofwar.es/*
// @match *://www.callofwar.it/*
// @match *://www.supremacy1914.com/*
// @match *://www.supremacy1914.fr/*
// @match *://www.supremacy1914.de/*
// @match *://www.supremacy1914.ru/*
// @match *://www.supremacy1914.nl/*
// @match *://www.supremacy1914.es/*
// @match *://www.supremacy1914.it/*
// @match *://www.callofwar.pl/*
// @icon https://www.magnum-x.pl/files/2018/TWH/SP-5-2018/6.jpg
// @license CC BY-NC-ND
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/457615/Supremacy1914%20AD%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/457615/Supremacy1914%20AD%20blocker.meta.js
// ==/UserScript==

(function() {
'use strict';
function toggleAdMode() {
var element = document.getElementById("ultimate");
if (element) {
element.setAttribute("data-ad-mode", "false"); //no more auto-enabling ad mode
}
}

function rmAdBar() {
var ifm = document.getElementById('ifm');
if (ifm && ifm.contentDocument) {
var inGameAdsContainer = ifm.contentDocument.getElementById('inGameAdsContainer'); //ad bar
if (inGameAdsContainer) {
inGameAdsContainer.parentNode.removeChild(inGameAdsContainer);
var s1914 = ifm.contentDocument.getElementById('s1914');
}
}

// pain
var elements = document.querySelectorAll('img[src*="static1.bytro.com/fileadmin/templates"]'); //ads pics sup
for (var i = 0; i < elements.length; i++) {
elements[i].parentNode.removeChild(elements[i]);
}
var elements = document.querySelectorAll('img[src*="//www.callofwar.com/clients/ww2-uber"]'); //ads pics cow
for (var i = 0; i < elements.length; i++) {
elements[i].parentNode.removeChild(elements[i]);
}
}
var intervalId = window.setInterval(function chrono() {
  rmAdBar();
  toggleAdMode();
}, 100);

var url = document.location.href;
var addresses = [ 'www.supremacy1914.pl/play.php?', 'www.supremacy1914.fr/play.php?', 'www.supremacy1914.it/play.php?', 'www.supremacy1914.es/play.php?', 'www.supremacy1914.com/play.php?', 'www.supremacy1914.nl/play.php?', 'www.supremacy1914.de/play.php?', 'www.supremacy1914.ru/play.php?', 'www.callofwar.com/play.php?', 'www.callofwar.fr/play.php?', 'www.callofwar.nl/play.php?', 'www.callofwar.de/play.php?', 'www.callofwar.ru/play.php?', 'www.callofwar.pl/play.php?', 'www.callofwar.es/play.php?', 'www.callofwar.it/play.php?']

for (var i = 0; i < addresses.length; i++) {
if (url.indexOf(addresses[i]) > -1) {
chrono();
break;
}
}
})();