// ==UserScript==
// @name         蜜桃
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @match        https://v.tprodgo.com*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390863/%E8%9C%9C%E6%A1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/390863/%E8%9C%9C%E6%A1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

        function hello(){
            $("#AcceptTask")[0].click()
        }
        var t1 = window.setInterval(hello,5000);



})();