// ==UserScript==
// @name         adclicker-bypass
// @version      1.8
// @description  Bypass some shorteners
// @author       Rust1667
// @match        https://adclicker.io/url/#*
// @match        https://adclicker.info/url/#*
// @match        https://discoveryultrasecure.com/url/#*
// @match        https://yourihollier.com/url/#*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/477591/adclicker-bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/477591/adclicker-bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let decodedData = decodeURIComponent(atob(atob(atob(window.location.href.split('/url/#')[1]))));
    if (decodedData.includes('&amp;url=')) decodedData = decodedData.split('&amp;')[1];
    let urlParam = new URLSearchParams(decodedData).get('url');
    if (urlParam) window.location.assign(urlParam);

})();
