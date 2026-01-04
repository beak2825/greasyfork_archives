// ==UserScript==
// @name         FPS Indicator
// @version      1.3
// @description  Inject FPS indicator into current page.
// @author       hustcc
// @match        *://**/*
// @noframes
// @run-at       document-end
// @namespace https://atool.vip
// @downloadURL https://update.greasyfork.org/scripts/381558/FPS%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/381558/FPS%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.src = 'https://unpkg.alipay.com/page-fps/dist/entry.min.js';

    document.body.appendChild(script);
})();