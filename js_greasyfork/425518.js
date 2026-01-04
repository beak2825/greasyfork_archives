// ==UserScript==
// @name         DxSale Auto Accept Disclaimer
// @namespace    http://hermanfassett.me
// @version      0.1
// @description  Auto accept the DxSale disclaimer popup
// @author       You
// @match        https://dxsale.app/app/pages/defipresale*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425518/DxSale%20Auto%20Accept%20Disclaimer.user.js
// @updateURL https://update.greasyfork.org/scripts/425518/DxSale%20Auto%20Accept%20Disclaimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function findCheckbox() {
        let checkbox = document.querySelector('[type=checkbox]');
        if (checkbox == null) {
            return setTimeout(findCheckbox, 100);
        }
        checkbox.click();
        document.querySelector('.MuiGrid-root > .MuiButton-containedPrimary').click(this);
    })();
})();