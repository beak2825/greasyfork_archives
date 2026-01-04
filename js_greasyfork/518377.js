// ==UserScript==
// @name         Remove WSJ Opinion
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  WSJ news reporting is the best in the country. The editorial section is dumb. Get rid of it.
// @author       You
// @match        https://www.wsj.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wsj.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518377/Remove%20WSJ%20Opinion.user.js
// @updateURL https://update.greasyfork.org/scripts/518377/Remove%20WSJ%20Opinion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select and remove the div with id 'opinion'
    document.getElementById('opinion-module').remove();
})();
