// ==UserScript==
// @name         Mobius
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Mobius Helper
// @license      AGPL License
// @author       zty
// @match        https://mobius.sre.gotokeep.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460121/Mobius.user.js
// @updateURL https://update.greasyfork.org/scripts/460121/Mobius.meta.js
// ==/UserScript==

// use this to load jQuery
/* globals jQuery, $, waitForKeyElements */

this.$ = this.jQuery = jQuery.noConflict(true);

function fill_info() {
    var miigo_id = '3223972'
    // $("input.ivu-select-input[placeholder='请选择']:eq(1)").val('master')
    let inputLabel = $("input[placeholder*='项目id']")
    if (inputLabel.length > 0 && inputLabel.val() == '') {
        inputLabel.val(miigo_id)
        inputLabel[0].dispatchEvent(new InputEvent("input"))

        inputLabel = $("input[placeholder*='回滚']")
        inputLabel.val('回滚');//给input赋值
        inputLabel[0].dispatchEvent(new InputEvent("input"))

        inputLabel = $("input[placeholder*='feature']")
        inputLabel.val('feature')
        inputLabel[0].dispatchEvent(new InputEvent("input"))


        inputLabel = $("input[placeholder*='验证']")
        inputLabel.val('日志')
        inputLabel[0].dispatchEvent(new InputEvent("input"))

        inputLabel = $("label:contains('紧急申请') input")
        inputLabel.click()
        inputLabel[0].dispatchEvent(new InputEvent("input"))
    }

    inputLabel = $("input[placeholder*='miigo id']")
    if (inputLabel.length > 0 && inputLabel.val() == '') {
        inputLabel.val(miigo_id)
        inputLabel[0].dispatchEvent(new InputEvent("input"))
    }

    var btn = $("button:contains('我已知晓,继续发布'):visible")
    if (btn.length > 0) {
        btn.click()
    }

}


(function() {
    'use strict';
    setInterval(fill_info, 1500);
})();