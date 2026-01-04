// ==UserScript==
// @name         Elearning Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  高雄科技大學 Elearning 檔案下載
// @author       Juirmin
// @match        https://elearning.nkust.edu.tw/learn/path/viewPDF.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442998/Elearning%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/442998/Elearning%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let secondaryDownload = document.getElementById('secondaryDownload')
    secondaryDownload.classList.remove("visibleLargeView")
    secondaryDownload.classList.remove("visibleMediumView")
    secondaryDownload.classList.remove("visibleSmallView")
    secondaryDownload.style.display = 'block'
    secondaryDownload.onclick = function(){
        open(DEFAULT_URL)
    }
})();
