// ==UserScript==
// @name         华为云工作项列表突出展示工作项
// @version      1.0.0
// @description  华为云工作项列表中突出展示自己的工作项(蚩尤后裔)
// @author       蚩尤后裔
// @run-at       document-end
// @match        http*://*.huaweicloud.com/*
// @match        https://auth.huaweicloud.com/authui/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artDialog/7.0.0/dialog.js
// @license      MIT
// @namespace https://greasyfork.org/users/1008816
// @downloadURL https://update.greasyfork.org/scripts/459871/%E5%8D%8E%E4%B8%BA%E4%BA%91%E5%B7%A5%E4%BD%9C%E9%A1%B9%E5%88%97%E8%A1%A8%E7%AA%81%E5%87%BA%E5%B1%95%E7%A4%BA%E5%B7%A5%E4%BD%9C%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/459871/%E5%8D%8E%E4%B8%BA%E4%BA%91%E5%B7%A5%E4%BD%9C%E9%A1%B9%E5%88%97%E8%A1%A8%E7%AA%81%E5%87%BA%E5%B1%95%E7%A4%BA%E5%B7%A5%E4%BD%9C%E9%A1%B9.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';
    // 需要突出展示的目标处理人
    let targetName = '汪茂雄';
    // 定义缓存的key名，用于缓存目标处理人
    const cacheKey_target_user_name = "wmx_target_user_name";
    // 设置需要高亮的背景颜色
    GM_addStyle(".CYHY_ClASS {background-color: rgba(240,100,108,0.1) !important;}");

    // 缓存有值时，进行回写
    if(GM_getValue(cacheKey_target_user_name)) {
        targetName = GM_getValue(cacheKey_target_user_name);
    }

    /**
     * 查找目标元素并突出显示
     * 注意事项：建议采用定时器持续查找标签。
     */
    function findTargetEle() {
        // 查找含有高亮背景色的行，如果行中没有目标处理人，则取消高亮背景色
        let targetUserTrArr = $(".CYHY_ClASS");
        if(targetUserTrArr.length > 0 ) {
            // console.log("目标元素个数："+ targetUserTrArr.length);
            targetUserTrArr.each(function (index) {
                if($(this).text().indexOf(targetName) < 0){
                    $(this).removeClass("CYHY_ClASS");
                }
            });
        }

        // 查找含有目标处理人的元素，然后将整行设置高亮背景色
        let targetUserDivArr = $("div[title='" + targetName + "']");
        if(targetUserDivArr.length > 0 ) {
            // console.log("目标元素个数："+ targetUserDivArr.length);
            targetUserDivArr.each(function (index) {
                $(this).parent().parent().parent().addClass('CYHY_ClASS');
            });
        }
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
            "<p>需要高亮的目标处理人：<input type='text' maxlength=60 id='wmx_target_user_name'/>" +
            "</div>";
        let wmx_dialog = dialog({
            title: '自定义设置',
            // quickClose: true, // 点击空白处快速关闭
            fixed: true,
            content: contentHtml,
            okValue: '确定',
            ok: function () {
                if($("#wmx_target_user_name").val() && $("#wmx_target_user_name").val().trim().length > 0){
                    targetName = $("#wmx_target_user_name").val().trim();
                    // 查找目标元素并突出显示
                    findTargetEle();
                    // 缓存
                    GM_setValue(cacheKey_target_user_name, targetName);
                }
            },
            cancelValue: '取消',
            cancel: function () {
            }
        });
        // 缓存有值时，进行回写
        if(GM_getValue(cacheKey_target_user_name)) {
            $("#wmx_target_user_name").val(GM_getValue(cacheKey_target_user_name));
        }
        // 弹框
        wmx_dialog.showModal();
    }


    $(function () {
        // 检查是否在目标网页执行.
        // console.log(location.href);

        // 定时查找目标元素并突出显示
        setInterval(function(){
            // 查找目标元素并突出显示
            findTargetEle();
        }, 3000);

        // 自定义功能菜单
        GM_registerMenuCommand("自定义设置", customSetting);
    });

})();