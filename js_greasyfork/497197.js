// ==UserScript==
// @name         环境标注
// @namespace    xx
// @version      0.0.4
// @description  环境标注-zz
// @author       icebear-zz
// @match        http*://*.aliyunidaas.com/*
// @match        http*://*.aliyun.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artDialog/7.0.0/dialog.js
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497197/%E7%8E%AF%E5%A2%83%E6%A0%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/497197/%E7%8E%AF%E5%A2%83%E6%A0%87%E6%B3%A8.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';
    let tipPrefix = 'prod';
    const cacheKeyNameForName = "wmx_targetName";
    /**
     * 向原始页面添加倒计时元素
     *
     * @param align_items ：对齐方式
     * * align-items: flex-start; 上对齐
     * * align-items: center; 中对齐
     * * align-items: flex-end; 下对齐
     */

    function appendCountDownEle(align_items) {
        let contDownJQ = $(`<div id="page-countdown"></div>`);
        contDownJQ.css({'position': 'fixed', 'top': 0, 'bottom': 0, 'left': 0, 'right': 0, 'display': 'flex'});
        contDownJQ.css({'justify-content': 'right', 'align-items': align_items});
        contDownJQ.css({'color': 'rgba(252,85,49, 0.5)', 'font-size': '5vw'});
        contDownJQ.css({'pointer-events': 'none', 'z-index': '9999'});
        // $('body').append(contDownJQ);
        $("body").each(function (index) {
            $(this).append(contDownJQ);
        });
    }

    /**
     * 开始倒计时，每隔1秒刷新一下
     */
    function countDown() {
        if(GM_getValue(cacheKeyNameForName)) {
            tipPrefix = GM_getValue(cacheKeyNameForName)
        }
        $("#page-countdown").text(`${tipPrefix}`);
    }

        /**
    * 自定义设置菜单功能
    */
    function customSetting() {
        // 如果已经弹出了，则直接跳过，不再重复弹出
        if($("#wmx_dialog_div").length > 0 ){
            return;
        }
        let contentHtml = "<div id='wmx_dialog_div'>\n" +
            "    <p>文本名称：<input type='text' maxlength=60 id='wmx_target_name'/>\n" +
            "</div>";
        let wmx_dialog = dialog({
            title: '自定义设置',
            quickClose: true, // 点击空白处快速关闭
            fixed: true,
            content: contentHtml
        });
        // 缓存有值时，进行回写
        if(GM_getValue(cacheKeyNameForName)) {
            $("#wmx_target_name").val(GM_getValue(cacheKeyNameForName));
        }
        // 弹框
        wmx_dialog.show();

        // 获取名称
        $("#wmx_target_name").on("blur", function () {
            if ($(this).val() && $(this).val().trim().length > 0) {
                GM_setValue(cacheKeyNameForName, $(this).val().trim());
                tipPrefix = $(this).val().trim();
            }
        });

        // 获取[展示位置]
        $("input[name='wmx_show_position']").on("change", function () {
            console.log($(this).val());
        });
    }
    $(function () {
        // 页面不是被其它页面 iframe 嵌入时才进行添加
        if (self == top) {
            // 向原始页面添加倒计时元素
            appendCountDownEle('flex-start');
            countDown();
            // 自定义功能菜单
            GM_registerMenuCommand("自定义设置", customSetting);
        }
    });

})();