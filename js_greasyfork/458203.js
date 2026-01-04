// ==UserScript==
// @name         EnableLoginPassBilling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ajusta el tipo texto en la contraseña para poder guardar la contraseña!
// @license      MIT
// @author       You
// @match        https://data.instatfootball.tv/views_custom/cabinet/web/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instatfootball.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458203/EnableLoginPassBilling.user.js
// @updateURL https://update.greasyfork.org/scripts/458203/EnableLoginPassBilling.meta.js
// ==/UserScript==

(function() {
    'use strict';
     document.querySelector('input[name="password"]').type = 'password';
    // Your code here...
})();