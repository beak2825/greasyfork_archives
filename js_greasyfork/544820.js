// ==UserScript==
// @name         bzws-update-fix
// @namespace    http://tampermonkey.net/
// @version      2025-08-06
// @description  修复暴走无双更新接口
// @author       You
// @match        http://bzdsj.linzhigame.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linzhigame.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544820/bzws-update-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/544820/bzws-update-fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var originalAjax = $.ajax;
    $.ajax = function(options) {
        if (options.url && options.url.includes('update_world13')) {

            if (options.success) {
                options.success({status: 1});
            }
            return;
        }
        return originalAjax.apply(this, arguments);
    };
    init();
})();