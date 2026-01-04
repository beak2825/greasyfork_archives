// ==UserScript==
// @name         auto download
// @namespace    https://carpt.net/
// @version      2024-01-31
// @description  auto download for carpt
// @author       Cccor
// @match        https://carpt.net/details.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carpt.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492823/auto%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/492823/auto%20download.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    'use strict';
    setTimeout(()=> {
    const downloadButton = document.querySelector('a[title="下载种子"]');
    downloadButton.click();
    })
})();