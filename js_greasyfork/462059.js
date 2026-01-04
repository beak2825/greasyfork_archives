// ==UserScript==
// @name         看雪一键签到
// @namespace    http://lyricpoem.cn/
// @version      Alpha
// @description  实现看雪论坛一键签到，以及去掉看雪的新手顶部弹框。
// @author       Lyr1cP03m
// @match        https://bbs.kanxue.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/462059/%E7%9C%8B%E9%9B%AA%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462059/%E7%9C%8B%E9%9B%AA%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 关闭弹框
    $(".temporary_member_box").css("height", "0");
    // 自动签到  (使用改脚本会多访问一次`user-is_signin.htm`这个接口)
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://bbs.kanxue.com/user-is_signin.htm",
        onload: function(res) {
            res = eval("(" + res.response + ")");
            console.log(res);
            if (res.code == '1') {  //查询到未签到的处理方式
                setTimeout(function() {
                    $(".signin").click();
                }, 1000);
                console.log("[+]TemperMonkeyMessage 已一键签到*_*")
            } else if (res.code == '0') {  // 查询到签过到了的处理方式
                console.log("[+]TemperMonkeyMessage 已签过到*_*")
                var sign_html = `<span>${res.message}</span>`;
                $(".signin").html(sign_html);
                $(".signin").attr("disabled","true");  //签过到后禁用按钮。
                $(".signin").addClass("signin_over").removeClass('sign');
            }
        }
    });
})();