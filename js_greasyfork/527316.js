// ==UserScript==
// @name         bugcase
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  bug case
// @author       You
// @match        http://*/zentao/bug-create-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akuvox.local
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/527316/bugcase.user.js
// @updateURL https://update.greasyfork.org/scripts/527316/bugcase.meta.js
// ==/UserScript==

(function() {
    'use strict';
    caseAdjust()
    // Your code here...
})();

function caseAdjust(){
    const iframe = document.querySelector('.ke-edit-iframe').contentWindow.document;
    const content = iframe.querySelector('.article-content');
    content.innerHTML += `
    <p><strong>5、用例ID(无或者用例ID):</strong></p>
    <p><strong>6、是否需要整改用例(是/否):</strong></p>
    <p><strong>7、是否已经完成用例整改(是/否):</strong></p>
    `;
}