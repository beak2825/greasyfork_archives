// ==UserScript==
// @name         No Flashing Tabs
// @namespace    https://stackoverflow.com/questions/36740937/how-do-i-prevent-a-page-and-tabs-document-title-from-changing
// @homepage     https://github.com/ghoulatsch
// @version      240923
// @description  Stop tabs from flashing.
// @author       see namespace
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509847/No%20Flashing%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/509847/No%20Flashing%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(document, 'title', {
        set: function(){}
    });
})();
