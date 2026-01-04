// ==UserScript==
// @name         Olivela Snipet
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Console snipet for Olivela
// @author       Nikita
// @match        https://www.olivela.com/products/colette-jewelry-white-enamel-diamond-band-476032?recommendations=algolia
// @icon         https://www.google.com/s2/favicons?sz=64&domain=olivela.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545567/Olivela%20Snipet.user.js
// @updateURL https://update.greasyfork.org/scripts/545567/Olivela%20Snipet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function (d) {     var s = d.createElement("script"),         t = d.head || d.getElementsByTagName("head").item(0) || d.getElementsByTagName("body").item(0);     s.async = true;     s.id = "tangiblee-integration";     s.src = "//cdn.tangiblee.com/integration/5.0/managed/www.olivela.com/revision_1/variation_original/tangiblee-bundle.min.js";     t.appendChild(s); })(document);
})();