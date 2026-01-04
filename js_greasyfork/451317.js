// ==UserScript==
// @name         nunutv2
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  remove ad
// @author       rindy
// @match        https://www.nunuyy3.org/*/*
// @icon         https://www.hltv.org/img/static/favicon/favicon-32x32.png
// @grant        none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/451317/nunutv2.user.js
// @updateURL https://update.greasyfork.org/scripts/451317/nunutv2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.insertAdjacentHTML('beforeend', `<style>[classname]{display:none}.list-like{display:none}</style>`)
})();