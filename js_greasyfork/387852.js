/* jslint          moz: true, expr: true */
// ==UserScript==
// @name           Contentful Delete File Fixer
// @namespace      Contentful Delete File Fixer
// @description    Fix the missing delete button on media
// @include        http*://app.contentful.com/spaces/*/assets/*
// @noframe
// @author         SerSeek
// @priority          2
// @run-at         document-end
// @version        1.0.0.0
// @downloadURL https://update.greasyfork.org/scripts/387852/Contentful%20Delete%20File%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/387852/Contentful%20Delete%20File%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(after, 2000);
})();

function after() {
    document.querySelector("body > div.client > cf-app-container > div.app-container__content > div > div > div > div > cf-asset-editor > div > div > div.workbench-main__content > div > cf-entity-field:nth-child(4) > div > div.entity-editor__field-locale > div.entity-editor__control-group > cf-widget-renderer > cf-file-editor > div > div.file-buttons > button:nth-child(9)").classList.remove("ng-hide");
}