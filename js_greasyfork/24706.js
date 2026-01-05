// ==UserScript==
// @name         livereload-lego
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  livereload-plugin from https://github.com/xxcanghai/userscript/blob/master/legoHelper/legoHelper.js
// @author       mine
// @match        http://lego.waimai.sankuai.com/?edit=*
// @match        http://127.0.0.1:3000/?edit=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24706/livereload-lego.user.js
// @updateURL https://update.greasyfork.org/scripts/24706/livereload-lego.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $('body').on('save.lego.modules', function() {
      setTimeout(function () {
        $.get("http://localhost:3700/livereload");
      }, 300);
    });
})(jQuery);