// ==UserScript==
// @name         Google Bard AI 自动翻译输入内容
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Google Bard AI 自动翻译输入内容.
// @author       王树羽/674613047@qq.com
// @match        https://www.tampermonkey.net/index.php?version=4.18.1&ext=dhdg&updated=true
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @match        https://bard.google.com/*
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/464735/Google%20Bard%20AI%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/464735/Google%20Bard%20AI%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
/*以下参数需要你自己填写*/
var appid="百度翻译的appid";
var secretKey="百度翻译的secretKey";

(function() {
    // 'use strict';
    /* globals jQuery, $, waitForKeyElements */

    setTimeout(function() {
        if ($("#wsySend").length <= 0) {

            $(".input-area .send-button").hide();
            $(".input-area").append('<button id="wsySend" style="width: 90px;height: 45px;font-weight: bold;color: #fff;font-size: 18px;margin-left: 10px;margin-top: 6px;background: #428bca;border: 1px #357ebd;border-radius: 5px;">发&nbsp;&nbsp;送</button>');
            $("#wsySend").click(function() {
                fanyi();
            });


            function fanyi() {
                $.ajax({
                    url: "https://fanyi.wangshuyu.top/?q=" + encodeURIComponent($("textarea").val()),
                    method: "GET",
                    success: function(data) {
                        console.log(data);
                        $("textarea").val(data);

                        $("textarea").focus();
                        $("textarea")[0].dispatchEvent(new Event('input'));

                        setTimeout(function() {
                            $(".input-area .send-button").click();
                        }, 300);

                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log("Error: " + textStatus);
                    }
                });
            }
        }
    }, 2000);
})();