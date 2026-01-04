// ==UserScript==
// @name         hello
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       su
// @match        www.baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405722/hello.user.js
// @updateURL https://update.greasyfork.org/scripts/405722/hello.meta.js
// ==/UserScript==

(function() {
    'use strict';
    debugger
    alert("try to take over the world!");
    var lg = $('#lg');
    $(lg).html('<img src="http://i.serengeseba.com/uploads/i_5_3710479204x2749858487_15.jpg" />');
})();