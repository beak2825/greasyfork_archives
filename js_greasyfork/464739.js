// ==UserScript==
// @name         T2SCHOLA Efficient Layout
// @namespace    https://t2schola.titech.ac.jp/
// @version      0.1
// @description  コースを横並びにします。
// @author       hayatroid
// @match        https://t2schola.titech.ac.jp/my/courses.php
// @license      CC0-1.0 Universal
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/464739/T2SCHOLA%20Efficient%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/464739/T2SCHOLA%20Efficient%20Layout.meta.js
// ==/UserScript==
 
(function () {
    console.log("Hello");
    
    update();
    
    $(".edw-course-list-container").css({
        "grid-template-columns": "1fr 1fr 1fr 1fr 1fr !important",
    });
})();
