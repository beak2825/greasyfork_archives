// ==UserScript==
// @name         打开评价页面
// @namespace    http://tampermonkey.net/
// @version      2024-08-03
// @description  打开jd评价页面
// @author       You
// @match        https://club.jd.com/myJdcomments/myJdcomment.action*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519822/%E6%89%93%E5%BC%80%E8%AF%84%E4%BB%B7%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/519822/%E6%89%93%E5%BC%80%E8%AF%84%E4%BB%B7%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".btn-def").get().forEach(x => {x.click()})
    // Your code here...
})();