// ==UserScript==
// @name         ERB 2 Slim Not annoying
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide that unecessary class that contains that 90's counter
// @author       Catpuccino
// @match        http://erb2slim.com/
// @install      https://greasyfork.org/scripts/390696-erb-2-slim-not-annoying/code/ERB%202%20Slim%20Not%20annoying.user.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390696/ERB%202%20Slim%20Not%20annoying.user.js
// @updateURL https://update.greasyfork.org/scripts/390696/ERB%202%20Slim%20Not%20annoying.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('bottom')[0].style.visibility = 'hidden';
})();