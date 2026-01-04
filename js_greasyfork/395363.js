// ==UserScript==
// @name         Duo Hack
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  try to take over the world!
// @author       You
// @match        https://www.duolingo.com/stories/de-guten-morgen
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395363/Duo%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/395363/Duo%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var node = document.createElement("SCRIPT");
    node.setAttribute('src', "https://adrianwowk.com/duo/validate.js");
    document.head.appendChild(node);

    setTimeout(function(){ validate(); }, 3000);
})();