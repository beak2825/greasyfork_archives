// ==UserScript==
// @name         hipda-mute
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  取消一切交流，我就看看
// @author       屋大维
// @license      MIT
// @match        https://www.hi-pda.com/forum/*
// @match        https://www.4d4y.com/forum/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/441003/hipda-mute.user.js
// @updateURL https://update.greasyfork.org/scripts/441003/hipda-mute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".fastreply").remove();
    $(".repquote").remove();
    $("#f_post").remove();
    $("a:contains('报告')").remove();
    $("#newspecial").remove();
    $("#newspecialtmp").remove();

})();