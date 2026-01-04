// ==UserScript==
// @name         wb-script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  just for play
// @author       wb
// @match        https://www.baidu.com/
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430335/wb-script.user.js
// @updateURL https://update.greasyfork.org/scripts/430335/wb-script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //$(".nav").css("position","relative");
    var ht = "<div style='width:100%;height:200px;'><embed height='200' width='100%' src='https://goodbin.cn/music/xx.mp3' /></div>";
    var x = $("body").prepend(ht);
})();