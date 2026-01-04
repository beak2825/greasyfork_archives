// ==UserScript==
// @name         Google AI Studio Redirect Cleaner
// @namespace    https://blog.valley.town/@zeronox
// @version      1.0
// @description  구글 검색 결과의 불필요한 리다이렉트를 제거하고 직접적인 링크로 바로 이동합니다.
// @author       zeronox
// @license      MIT
// @match        *://www.google.com/url*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547698/Google%20AI%20Studio%20Redirect%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/547698/Google%20AI%20Studio%20Redirect%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('q');
    if (targetUrl) {
        window.location.replace(targetUrl);
    }
})();