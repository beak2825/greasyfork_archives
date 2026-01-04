// ==UserScript==
// @name         Replace image placeholders on spiegel.de
// @namespace    ImgPlcholderRepl
// @version      0.1
// @description  Replaces the image placeholders on spiegel.de if JS is disabled
// @author       Das Boo
// @match        *://www.spiegel.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389984/Replace%20image%20placeholders%20on%20spiegelde.user.js
// @updateURL https://update.greasyfork.org/scripts/389984/Replace%20image%20placeholders%20on%20spiegelde.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imgs = document.querySelectorAll('img');
    var len = imgs.length;

    for (var i=0;i<len;i++) {
        if (imgs[i].src.match("dimension")) {
            imgs[i].src = imgs[i].getAttribute("data-original");
        }
    }
})();