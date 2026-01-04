// ==UserScript==
// @name         潜入底部
// @namespace    https://greasyfork.org/zh-CN/scripts/483583-%E6%BD%9C%E5%85%A5%E5%BA%95%E9%83%A8
// @version      1.2
// @description  某些网站舍弃了传统的数字分页方式，而是采用滚动条向下滚动自动翻页，而当页数很多时，手动滚动非常麻烦，所以此脚本让它自动滚动。
// @author       蚩尤后裔
// @homepage     https://greasyfork.org/zh-CN/scripts/483583-%E6%BD%9C%E5%85%A5%E5%BA%95%E9%83%A8
// @match        http*://*/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artDialog/7.0.0/dialog.js
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483583/%E6%BD%9C%E5%85%A5%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/483583/%E6%BD%9C%E5%85%A5%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

// 将本内容直接复制粘贴到油猴中即可使用.
(function () {
    'use strict';

    let v_timer_interval = 500; // 间隔多少时间(毫秒)向下滚动一次
    let v_pre_scrollTop = -1; // 上一次滚动条距离顶部的高度
    let v_count_tatol = 5; // 滚动条距离顶部的高度在连续 v_count 都没有再发生变化时，停止继续向下滚动.
    let v_count = 0; // 次数统计,当值达到 v_count_tatol 时，将停止滚动

    $(function () {
        // 向原始页面添加倒计时元素
        appendCountDownEle('flex-end');

        // 自定义功能菜单
        GM_registerMenuCommand("开始下潜", customSetting);
    });

    /**
     * 滚动条向底部运动翻页
     * timer01 ：是定时调用自己的定时器，用于停止
     */
    function toBottom(timer01) {
        /**
         * scrollTop：div 滚动条距离 div 上边缘的距离
         * scrollHeight：div 内文档总高度（包括被隐藏的），当没有出现滚动条时，scrollHeight = height
         * height：div 元素的高度，只与自己 height 属性有关，与滚动条无关
         */
        let scrollTop = $("html").scrollTop();
        let scrollHeight = $("html")[0].scrollHeight;
        let height = $("html").height();

        // 设置滚动条距离顶部的高度
        $("html").animate({
            scrollTop: scrollHeight
        }, v_timer_interval);
        // console.log("============ height=" + height, "scrollTop=" + scrollTop, "scrollHeight=" + scrollHeight);

        if (v_pre_scrollTop != scrollTop) {
            v_pre_scrollTop = scrollTop;
            v_count = 0;
            $('#wmx_countdown_msg_div').text(scrollTop);
        } else {
            $('#wmx_countdown_msg_div').text(v_count_tatol - v_count);
            v_count++;
        }
        // console.log("===================== v_count_tatol=" + v_count_tatol + ", v_count=" + v_count + ", v_pre_scrollTop=" + v_pre_scrollTop);
        if (v_count >= v_count_tatol) {
            //  console.log("============ 连续 " + v_count + " 次，内容都没有变化，不再继续向下滚动。");
            clearInterval(timer01);

            // 清空提示内容并进行隐藏
            $('#wmx_countdown_msg_div').text('已经到达底部啦');
            $('#wmx_countdown_msg_div').hide(5000);
        }
    }

    /**
     * 自定义设置菜单功能
     */
    function customSetting() {
        // 如果已经弹出了，则直接跳过，不再重复弹出
        if ($("#wmx_dialog_div").length > 0) {
            return;
        }
        let contentHtml = "<div id='wmx_dialog_div'><p>是否开始向下潜到底部？<p/></div>";
        let wmx_dialog = dialog({
            title: '提示',
            // quickClose: true, // 点击空白处快速关闭
            fixed: true,
            content: contentHtml,
            okValue: '确定',
            ok: function () {
                // 清空提示内容并进行展示
                $('#wmx_countdown_msg_div').text('');
                $('#wmx_countdown_msg_div').show();
                let timer01 = setInterval(() => {
                    toBottom(timer01);
                }, v_timer_interval);
            },
            cancelValue: '取消',
            cancel: function () {}
        });
        // 弹框
        wmx_dialog.showModal();
    }

    /**
     * 向原始页面添加倒计时元素
     *
     * @param align_items ：对齐方式
     * * align-items: flex-start; 上对齐
     * * align-items: center; 中对齐
     * * align-items: flex-end; 下对齐
     */
    function appendCountDownEle(msg) {
        let contDownJQ = $(`<div id="wmx_countdown_msg_div">Test</div>`);
        contDownJQ.css({
            'position': 'fixed',
            'top': 0,
            'bottom': 0,
            'left': 0,
            'right': 0,
            'display': 'flex'
        });
        contDownJQ.css({
            'justify-content': 'center',
            'align-items': 'flex-end'
        });
        contDownJQ.css({
            'color': 'rgba(252,85,49, 0.5)',
            'font-size': '5vw'
        });
        contDownJQ.css({
            'pointer-events': 'none',
            'z-index': '9999'
        });
        // 默认隐藏
        contDownJQ.hide();
        $('body').append(contDownJQ);
    }

})();
