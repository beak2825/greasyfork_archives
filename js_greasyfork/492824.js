// ==UserScript==
// @name         unlock button disabled
// @namespace    https://carpt.net/
// @version      2024-01-31
// @description  unlock button disabled for carpt
// @author       Cccor
// @match        https://carpt.net/downloadnotice.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carpt.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492824/unlock%20button%20disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/492824/unlock%20button%20disabled.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    'use strict';
    // 选取所有带有 disabled 属性的按钮
    setTimeout(()=> {

    const disabledButtons = document.querySelectorAll('input[disabled]');

    const downloadButton = disabledButtons[1]

    downloadButton.removeAttribute('disabled');

    downloadButton.click()
    });
    setTimeout(() => {window.close();}, 5000)
})();