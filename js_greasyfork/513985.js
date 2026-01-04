// ==UserScript==
// @name         ZZ16Z Online Judge Problem_delete
// @namespace    http://tampermonkey.net/
// @version      0.0.0-alpha.0
// @description  快速删除问题
// @author       SLIGHTNING, Vistamin
// @match        http://1.192.219.102:5214/admin/problem_list.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=219.102
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513985/ZZ16Z%20Online%20Judge%20Problem_delete.user.js
// @updateURL https://update.greasyfork.org/scripts/513985/ZZ16Z%20Online%20Judge%20Problem_delete.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.confirm = function () { return true; }
})();