// ==UserScript==
// @name         Reload onecognizantbcazrapps.cognizant.com
// @namespace    https://onecognizantbcazrapps.cognizant.com/
// @version      0.1
// @description  Reload onecognizantbcazrapps.cognizant.com To Keep Session Alive
// @author       angelo.ndira@gmail.com
// @match        https://onecognizantbcazrapps.cognizant.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cognizant.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/478819/Reload%20onecognizantbcazrappscognizantcom.user.js
// @updateURL https://update.greasyfork.org/scripts/478819/Reload%20onecognizantbcazrappscognizantcom.meta.js
// ==/UserScript==
var pageReloadInterval = 120000;
function start() {
    'use strict';
    window.location.reload(false);
}
(function () {
    'use strict';
    console.log("document loaded(). Reload onecognizantbcazrapps.cognizant.com To Keep Session Alive. Reload will start in 120 seconds");
    setTimeout(start, pageReloadInterval);
})();