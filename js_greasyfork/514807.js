// ==UserScript==
// @name         ithome布局修改
// @version      0.1
// @description  修改ithome布局
// @match        https://www.ithome.com/
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1384640
// @downloadURL https://update.greasyfork.org/scripts/514807/ithome%E5%B8%83%E5%B1%80%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/514807/ithome%E5%B8%83%E5%B1%80%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.evaluate("//*[@id=\"news\"]/div[1]",document).iterateNext().classList.remove("fl");
    document.evaluate("//*[@id=\"news\"]/div[1]",document).iterateNext().classList.add("fr");
});