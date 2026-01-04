// ==UserScript==
// @name         getTaobaoDetails
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.taobao.com/trace/*
// @grant        none
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js?version=174357
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/vue
// @downloadURL https://update.greasyfork.org/scripts/416049/getTaobaoDetails.user.js
// @updateURL https://update.greasyfork.org/scripts/416049/getTaobaoDetails.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delivery_no = $(".order-row .em").html();
    delivery_no = delivery_no.replace(/\s{2,}/g, ' ');
    delivery_no = delivery_no.replace(/\t/g, ' ');
    delivery_no = delivery_no.toString().trim().replace(/(\r\n|\n|\r)/g,"");
    var description = $(".order-list img:first").attr("alt");
    var maxLength = 13; //最长宝贝描述字数
    if (description.length > maxLength) {
        description = description.slice(description.length-maxLength,description.length);
        //alert(description);
    }
    var clipbard_text = delivery_no + '&#9;'
                        + description;
    var clipboard = new Clipboard('.btn');
    var infoHTML = ' <button style="font-size:13px;" class="btn" data-clipboard-text="' + clipbard_text + '"> 点我复制 delivery_no / description </button>';
    $(".indent").append(infoHTML);
    // Your code here...
})();