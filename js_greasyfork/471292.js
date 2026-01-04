// ==UserScript==
// @name         LolzToZelenka
// @author       123
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @description  Redirect from lolz.guru/.live to zelenka.guru
// @icon         https://zelenka.guru/favicon.ico
// @run-at       document-start
// @grant        none
// @version      1.1
// @namespace https://greasyfork.org/users/1131795
// @downloadURL https://update.greasyfork.org/scripts/471292/LolzToZelenka.user.js
// @updateURL https://update.greasyfork.org/scripts/471292/LolzToZelenka.meta.js
// ==/UserScript==

(function() {
    var oldUrlPath = window.location.pathname;
    if (!/\.compact$/.test(oldUrlPath)) {
        var newURL = "https://zelenka.guru" + oldUrlPath
        window.location.replace(newURL);
    }
})();