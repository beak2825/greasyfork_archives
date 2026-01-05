// ==UserScript==
// @name            Decrease click at Sakurafile
// @name:ja         Sakurafileで楽をするためのスクリプト
// @namespace       http://hogehoge/
// @version         1.*
// @description     none
// @description:ja  多分これが一番楽だと思います(使用は自己責任でお願いします)
// @author          H. Amami
// @match           *://sakurafile.com/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/28482/Decrease%20click%20at%20Sakurafile.user.js
// @updateURL https://update.greasyfork.org/scripts/28482/Decrease%20click%20at%20Sakurafile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($(".error_message").length !== 0 || $(".err").length !== 0) {
        console.error("Sakurafile error @ " + location.href);
    } else if (typeof $('#dlink').attr("href") !== "undefined") {
        console.info("Download started @ " + location.href);
        location.href = $('#dlink').attr("href");
    } else if ($('[name="op"]').val() === "download2") {
        var captcha_text = "";
        var $items = $('td>div>span:not(:first):not(:first)');
        $items.sort(function(a, b) {
            return parseInt($(a).css("padding-left")) > parseInt($(b).css("padding-left"));
        });
        $items.each(function() {
            captcha_text += $(this).text();
        });
        while (captcha_text[0] === "0") {
            captcha_text = captcha_text.substr(1);
        }
        $(".captcha_code").val(captcha_text);
        console.info("Solved captcha (" + captcha_text + ") @ " + location.href);
        setInterval(function() {
            if ($('.seconds').text() <= 1) $('form').submit();
        }, 1000);
    } else if ($('[name="op"]').val() === "download1") {
        console.info("Free Download button was clicked @ " + location.href);
        $('[name=method_free]').click();
    }
})();