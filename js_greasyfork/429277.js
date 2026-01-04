// ==UserScript==
// @name         Gutefrage werbung blockieren
// @namespace    https://greasyfork.org/de/users/777213-tripzz-ѕкιηѕ-lpwsand
// @version      0.1
// @description  Gutefrage Werbung blockieren
// @author       Genc
// @match        https://www.gutefrage.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/429277/Gutefrage%20werbung%20blockieren.user.js
// @updateURL https://update.greasyfork.org/scripts/429277/Gutefrage%20werbung%20blockieren.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var IntervalFunction = setInterval(domSearch, 10);

    function myStopFunction() {
        clearInterval(IntervalFunction);
    };

    function domSearch() {
        var container = document.querySelector("#wl-container");
        if (container !== null) {
            container.remove();
            myStopFunction();
        }
    };
})();