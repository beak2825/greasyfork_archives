// ==UserScript==
// @name         Ranobelib.me chapter titles
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Show chapter title on page of Ranobelib
// @author       DikUln
// @match        https://ranobelib.me/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ranobelib.me
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475687/Ranobelibme%20chapter%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/475687/Ranobelibme%20chapter%20titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".reader-container").prepend('<p>' + window.__DATA__.current.chapter_name + '</p>');

})();