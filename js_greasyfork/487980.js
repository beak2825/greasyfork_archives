// ==UserScript==
// @name         Neopets: Redirect to home
// @name:es      Neopets: Redirige al juego
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects neopets.com to home
// @description:es  Redirige neopets.com a la página del juego
// @author       Nyu@Clraik
// @match        *://*.neopets.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487980/Neopets%3A%20Redirect%20to%20home.user.js
// @updateURL https://update.greasyfork.org/scripts/487980/Neopets%3A%20Redirect%20to%20home.meta.js
// ==/UserScript==

document.location = document.location +'/home'