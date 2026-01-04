// ==UserScript==
// @name         Terabox download helper
// @description  Download terabox files through terabox.hnn.workers.dev
// @author       Rust1667
// @version      1.0
// @include      /terabox.hnn.workers.dev/
// @include      /https:\/\/(www\.)?(1024tera.com|teraboxapp.com|terabox.(app|com))\/(?:sharing\/link\?surl=|s\/)[a-zA-Z0-9_-]+/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/492953/Terabox%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492953/Terabox%20download%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    const teraboxRegex = /https:\/\/(www\.)?(1024tera.com|teraboxapp.com|terabox.(app|com))\/(?:sharing\/link\?surl=|s\/)[a-zA-Z0-9_-]+/;
    if (teraboxRegex.test(url)) {
        GM_setValue('savedShortlink', url);
        window.location.assign('https://terabox.hnn.workers.dev/');
    } else if (/terabox.hnn.workers.dev/.test(url)) {
        window.addEventListener("load", function(event) {
            var savedShortlink = GM_getValue('savedShortlink', null);
            var inputField = document.querySelector('#input-url');
            if (savedShortlink && inputField) {
                inputField.value = savedShortlink;
                GM_deleteValue('savedShortlink');
                setTimeout(function() {let bypassButton = document.querySelector('#get-link-button');if (bypassButton) {bypassButton.click();}}, 500);
            }
        });
    }
})();
