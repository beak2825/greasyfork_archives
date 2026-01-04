// ==UserScript==
// @name         Gitee宽屏显示
// @version      1.3
// @description  Gitee宽屏显示，更方便的阅读内容。
// @author       蚩尤后裔-汪茂雄
// @homepage     https://greasyfork.org/zh-CN/scripts/518028-gitee%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA
// @match        http*://gitee.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/scripts/518028-gitee%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA
// @downloadURL https://update.greasyfork.org/scripts/518028/Gitee%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518028/Gitee%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttonIdName = "btn_25081993"; // 自定义操作按钮的ID名称
    const restoreTitle = '宽屏恢复';
    const wideScreenTitle = '宽屏显示';


    $(function(){
        appendWideScreenButton();
    });


    /**
    * 向页面添加自定义操作按钮
    * 添加到提交次数的后面
    */
    function appendWideScreenButton() {
        // 定义自定义操作按钮
        let downloadJQ = $("<div>" + wideScreenTitle + "</div>");
        downloadJQ.css({
            "position" : "fixed",
            "left" : "1px",
            "top" : "80%",
            "height" : "90px",
            "width" : "20px",
            'background-color': 'rgba(46,46,46, 1)',
            "color": "#fff",
            'font-size': '16px',
            'cursor': 'pointer'
        });
        downloadJQ.attr("id", buttonIdName);

        // 添加到body最后，默认在页面左下角
        $('body').append(downloadJQ);
        $("#" + buttonIdName).draggable({scroll: false}); // 让按钮支持拖动到页面任意位置

        // 绑定单击事件。隐藏或者展示右侧面板
        downloadJQ.on("click", function(event){
            if(downloadJQ.text() == wideScreenTitle) {
                // 宽屏展示
                $('.four.wide.column').hide();
                $('#git-project-container').attr('style', 'width:100% !important;');
                $('.ui.container').attr('style', 'width:100% !important;');
                $('.twelve.wide.column.right-wrapper').attr('style', 'width:100% !important;');
                downloadJQ.text(restoreTitle);
            } else {
                // 恢复原样
                $('.four.wide.column').show();
                $('#git-project-container').attr('style', 'width:75% !important;');
                $('.ui.container').attr('style', 'width:1240px !important;');
                $('.twelve.wide.column.right-wrapper').attr('style', '');
                downloadJQ.text(wideScreenTitle);
            }
        });
    }





})();