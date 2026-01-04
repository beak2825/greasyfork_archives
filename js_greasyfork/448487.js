// ==UserScript==
// @name         add url in title bar
// @version      0.1.1
// @namespace    local
// @description  add url in title bar of the web browser
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/448487/add%20url%20in%20title%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/448487/add%20url%20in%20title%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let title = document.title;
    let location = document.location.href;
    if(title.indexOf(location) === -1){
        document.title = location + " " + title;
    }
})();