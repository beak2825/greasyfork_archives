// ==UserScript==
// @name         提取码哦耶
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  度盘自定义提取码
// @author       Chinshry
// @license      MIT
// @match        *://pan.baidu.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/447054/%E6%8F%90%E5%8F%96%E7%A0%81%E5%93%A6%E8%80%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/447054/%E6%8F%90%E5%8F%96%E7%A0%81%E5%93%A6%E8%80%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    $(document).on("DOMNodeInserted", ".share-file__link-expired", function() {
        if ($(".nd-input-share-pwd").length == 0) {
            setTimeout(()=>{
                var o=document.querySelector("#g-select-1");
                o.querySelector(".g-select-inner").click()
                var event = new CustomEvent("mousedown",{bubbles: 'true'});
                o.querySelector('#g-select-1 [data-value="0"]').dispatchEvent(event);
            },200);
            var sharePwd = GM_getValue("share_pwd");
            var html = '<div style="margin:10px;"></div><div class="share-file__link-expired-title">自定义分享密码</div>';
            html += '<div class="share-file__link-pwd"><div class="share-file__link-pwd-label">提取码</div>';
            html += '<input type="text" class="nd-input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="为空则随机四位" style="margin-left: 16px; width: 120px; height: 32px; line-height: 28px; border: 1px solid #D4D7DE; border-radius: 8px; text-align: left; padding-left: 12px"></div>';
            $(".share-file__link-expired").after(html);
        }
        setTimeout(function () {
            console.log($(".g-select-dropdown-item[data-value=0]"))
            $(".g-select-dropdown-item[data-value=0]").click()
        }, 2000)
    });

    unsafeWindow.require.async("function-widget-1:share/util/newShare/linkSetting.js", function (detail) {
        detail.makePrivatePasswordA = detail.makePrivatePassword;
        detail.makePrivatePassword = function () {
            var sharePwd = GM_getValue("share_pwd");
            return sharePwd ? sharePwd : this.makePrivatePasswordA();
        };
    });

    $(document).on("change", ".nd-input-share-pwd", function () {
        var value = this.value;
        if (value && !value.match(/^[a-z\d]{4}$/i)) {
            unsafeWindow.require("system-core:system/uiService/tip/tip.js").show({mode: "failure", msg: "提取码不合规范，只能是四位字母数字组合"});
        }
        GM_setValue("share_pwd", value);
    });

})();