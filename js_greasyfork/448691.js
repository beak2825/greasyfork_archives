// ==UserScript==
// @name         3选择小区
// @description  第三步骤选择小区
// @namespace    data
// @version      0.4
// @match        https://m.xflapp.com/f100/activity/client/owner_comments_main_select_neighbor?*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      dats
// @downloadURL https://update.greasyfork.org/scripts/448691/3%E9%80%89%E6%8B%A9%E5%B0%8F%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448691/3%E9%80%89%E6%8B%A9%E5%B0%8F%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function random(min,max) {
        return Math.floor(min + Math.random() * (max - min));
    }
    setTimeout(function () {
        var data = ['紫金新干线一区','紫金新干线二区']
        $("input").val(data[random(0,2)])
        $("input")[0].dispatchEvent(new Event('change'));
        let evt = new InputEvent('input', {
            inputType: 'insertText',
            data: 'aaa',
            dataTransfer: null,
            isComposing: false
        });
        $("input").value = 'aaa';
        $("input")[0].dispatchEvent(evt);
        setTimeout(function () {
            $('.item-box')[0].click()

        }, 1000);
    }, 1000);

})();