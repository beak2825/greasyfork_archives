// ==UserScript==
// @name         奥鹏作业自动答题
// @version      0.0.1
// @description  打开考试自动筛选正确答案
// @author       DJX
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/398913
// @downloadURL https://update.greasyfork.org/scripts/392577/%E5%A5%A5%E9%B9%8F%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/392577/%E5%A5%A5%E9%B9%8F%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 页面执行完执行
    var check = setInterval(main, 250);
    var paperContent = [];

    function main() {
        if (window.require == null || window.jQuery == null) { return; };
        clearInterval(check);
        // 这里执行比较快，需要延迟执行
        setTimeout(crack_common, 3000);
        add_show_btn();
        request_monitoring();
    }

    function add_show_btn() {
        $('.score').append('<span class="marginr30" style="color: blue;" pp>SHOW GO</span>');
        $('.score span[pp]')
            .css({
                "cursor": "pointer",
                "color": "blue"
            })
            .on('click', show_quest);
    }


    function request_monitoring() {
        $(document).ajaxComplete(
            function(event, xhr, settings) {
                if (settings.url.indexOf('OnlineJob/DoHomework') <= 0) {
                    return;
                }
                var res = JSON.parse(xhr.responseText);
                if (res.status == 0) {
                    paperContent = res.data.TestPaperContent.Items;
                    show_quest();
                }
            }
        );
    }

    function show_quest() {
        $('.qestitle').each(function(i, e) {
            var choices = []
            var list = paperContent[i].Choices
            list.forEach(function(item) {
                if (item.IsCorrect) choices.push(item);
            });
            var question = $(e).text();
            var equestion = encodeURIComponent(question);
            var td = $(e).attr('style', '');
            choices.forEach(function(item) {
                td.parent().prepend('<td>选项：' + item.I1 + ' <->  值: ' + item.I2 + '</td>');
            })
            var height = td.height();
            td.html('<textarea readonly style="width: 100%; border:0; font-weight:400;">' + question + '</textarea>').find('textarea').height(height);
        });
    }

    // 破解常规限制：右键、 ctrl+c、 选中禁用
    function crack_common() {
        // 禁用右键
        document.oncontextmenu = function() {
            return true;
        }

        //禁用ctrl+c功能
        document.onkeydown = function() {
            if (event.ctrlKey && window.event.keyCode == 67) {
                return true;
            }
        }

        //禁用选中
        $(document).unbind('selectstart');
    }
})();