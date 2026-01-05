// ==UserScript==
// @name            download.mokeedev.com
// @name:ru         download.mokeedev.com
// @namespace       FIX
// @version         0.2
// @description     download.mokeedev.com without waiting
// @description:ru  download.mokeedev.com без ожидания
// @author          raletag
// @match           *://download.mokeedev.com/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/28480/downloadmokeedevcom.user.js
// @updateURL https://update.greasyfork.org/scripts/28480/downloadmokeedevcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('download.mokeedev.com without waiting');
    if (location.pathname == '/link.php' && document.body.innerText && document.body.innerText.match(/^http(|s):\/\//i)) location.href = document.body.innerText;
    else for (var links = document.querySelectorAll('a[href*="downloadPost"]'), i = links.length - 1; i >= 0; --i) {
            links[i].href = links[i].href.replace('download.php', 'link.php').replace('get','key');
    }
})();