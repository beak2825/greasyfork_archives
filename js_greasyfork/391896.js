// ==UserScript==
// @name         Hide ads
// @namespace    http://thiswasfun.com/whydidyoucomehere
// @version      0.2
// @description  No more invasive, loud adverts while waiting to download!
// @author       Aidan Warner
// @include      http://larati.net/
// @include      http://adf.ly/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391896/Hide%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/391896/Hide%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.GetElementById('#rf').attr('src', 'http://example.com');
    document.GetElementById('#rf2').attr('src', 'http://example.com');
})();