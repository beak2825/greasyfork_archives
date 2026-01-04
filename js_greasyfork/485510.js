// ==UserScript==
// @name         pornleaks.in and leak.sx bypass
// @version      1.2
// @description  Redirect ComoHoy.com URLs
// @author       Rust1667
// @match        https://comohoy.com/view/out.html?url=*
// @match        https://comohoy.com/grab/out.html?url=*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leak.sx
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485510/pornleaksin%20and%20leaksx%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485510/pornleaksin%20and%20leaksx%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParam = new URLSearchParams(window.location.search).get('url');
    const decodedURL = atob(urlParam);
    window.location.assign(decodedURL);

})();
