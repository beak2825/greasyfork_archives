// ==UserScript==
// @name         E-Hentai to ExHentai Auto Redirect
// @namespace    https://sleazyfork.org/users/your-username
// @version      1.0
// @description  Redirects to ExHentai automatically if the gallery is not available on E-Hentai
// @match        http*://e-hentai.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538148/E-Hentai%20to%20ExHentai%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/538148/E-Hentai%20to%20ExHentai%20Auto%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.title === 'Gallery Not Available - E-Hentai Galleries') {
        document.location.href = 'https://exhentai.org' + parse_gallery_identifier();
    }

    function parse_gallery_identifier(link) {
        let identifier_start, identifier_end, identifier;
        if (link === undefined) {
            identifier_start = location.href.indexOf('e-hentai.org') + 12;
            identifier_end = location.href.length;
            identifier = location.href.substring(identifier_start, identifier_end);
        } else {
            identifier_start = link.indexOf('e-hentai.org') + 12;
            identifier_end = link.length;
            identifier = link.substring(identifier_start, identifier_end);
        }
        return identifier;
    }
})();
