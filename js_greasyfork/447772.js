// ==UserScript==
// @name         Klanowicze online
// @author       Reskiezis edit by Lord Asidmi
// @description  Dodatek do gry Margonem
// @version      1.4
// @match        http*://*.margonem.pl/
// @match        http*://*.margonem.com/
// @grant        none
// @namespace    https://greasyfork.org/users/233329
// @downloadURL https://update.greasyfork.org/scripts/447772/Klanowicze%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/447772/Klanowicze%20online.meta.js
// ==/UserScript==

//Klasy css z przedrostkiem mz- wzięte od maddonza(barlaga) oraz button
(function() {
    'use strict';

    function getScript(url) {
         var script = document.createElement('script');
         script.src = url;
         document.body.appendChild(script);
    }
    function getScriptWrapper(url) {
        if (window.$) return getScript(url);
        setTimeout(getScriptWrapper, 50, url);
    }

    if (window.__build || window.__bootNI) {

        var d = new Date();
        var verStr = [
            d.getUTCDate(),
            d.getUTCMonth() + 1,
        ].join('.');
        getScriptWrapper('https://addons2.margonem.pl/get/136/136578dev.js');
    }
  })()