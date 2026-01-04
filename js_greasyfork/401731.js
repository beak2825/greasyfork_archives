// ==UserScript==
// @name         Surviv.io theme gif ricaruto
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  This gives surviv.io a darker look.
// @author       w clear msh
// @match        http://surviv.io/*
// @match        https://surviv.io/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401731/Survivio%20theme%20gif%20ricaruto.user.js
// @updateURL https://update.greasyfork.org/scripts/401731/Survivio%20theme%20gif%20ricaruto.meta.js
// ==/UserScript==

(function() {
    document.querySelector('#background').style.cssText = 'background-image: url(https://i.imgur.com/nQR8aQ5.gif)'
})();