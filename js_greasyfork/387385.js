// ==UserScript==
// @name         bitoke 0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto abrir caixas no site bitoke
// @author       alexcordeiro1979
// @match        https://bitoke.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387385/bitoke%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/387385/bitoke%2001.meta.js
// ==/UserScript==

setInterval(function(){

    document.getElementsByClassName('side side-2')[0].click();

},5000);