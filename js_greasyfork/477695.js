// ==UserScript==
// @name         Basketbal Rusko - Přesměrování
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměrování Ruska na #plays
// @author       Michal Hornok
// @match        https://russiabasket.ru/games/*?apiUrl=https://org.infobasket.su&lang=ru
// @icon         https://www.google.com/s2/favicons?sz=64&domain=russiabasket.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477695/Basketbal%20Rusko%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/477695/Basketbal%20Rusko%20-%20P%C5%99esm%C4%9Brov%C3%A1n%C3%AD.meta.js
// ==/UserScript==

(function() {
    var currentUrl = window.location.href;

    var newUrl = currentUrl.replace('?apiUrl=https://org.infobasket.su&lang=ru', '#plays');

    window.location.href = newUrl;
})();