// ==UserScript==
// @name Streamworld automatizer
// @description Automatisiert die Weiterleitung von streamworld.cc zum Hoster. Funktioniert nur, solange ReCaptcha nicht durch ungewöhnlichen Netzwerkverkehr aktiviert worden ist.
// @namespace Violentmonkey Scripts
// @match https://streamworld.cc/film/*
// @match https://streamworld.cc/serie/*
// @grant none
// @version 0.0.1.20190506130914
// @downloadURL https://update.greasyfork.org/scripts/381647/Streamworld%20automatizer.user.js
// @updateURL https://update.greasyfork.org/scripts/381647/Streamworld%20automatizer.meta.js
// ==/UserScript==

    var oldOnload = window.onload;

    window.onload = function () {

        if (typeof oldOnload == 'function') {
          oldOnload();
        }
      
      document.getElementsByTagName('button')[0].click();
      
    }