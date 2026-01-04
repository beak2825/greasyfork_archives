// ==UserScript==
// @name         simple-filtering
// @namespace    https://github.com/PenguinCabinet
// @version      v0.0.2
// @description  The simple tool filtering websites.
// @author       PenguinCabinet
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509744/simple-filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/509744/simple-filtering.meta.js
// ==/UserScript==

//CONFIG
let URL_denylist = [

];
let Keyword_denylist = [

];
//CONFIG



const redirect_URL = "https://example.com";
function block_redirect() {
    location.replace(redirect_URL);
}

(function () {
    URL_denylist.forEach(function (e) {
        if (location.href.includes(e))
            block_redirect();
    });

    Keyword_denylist.forEach(function (e) {
        if (document.body.textContent.includes(e))
            block_redirect();
    });

    'use strict';

    // Your code here...
})();