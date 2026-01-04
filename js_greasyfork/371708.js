// ==UserScript==
// @name         Force bitbucket PR old UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force PR old UI
// @author       You
// @match        https://bitbucket.org/*/pull-requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371708/Force%20bitbucket%20PR%20old%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/371708/Force%20bitbucket%20PR%20old%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href = window.location.href;
    if (href.indexOf('?w=1') > -1) {
        var newHref = href.replace("w=1", "spa=0");
        window.location.href = newHref;
    }
})();