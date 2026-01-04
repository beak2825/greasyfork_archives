// ==UserScript==
// @name         奥鹏在线作业助手
// @namespace    https://github.com/ousui/open-learn-helper
// @version      0.9.4
// @description  奥鹏在线答题小助手
// @author       shuai.w
// @match        https://learn.open.com.cn/StudentCenter/OnLineJob/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383094/%E5%A5%A5%E9%B9%8F%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383094/%E5%A5%A5%E9%B9%8F%E5%9C%A8%E7%BA%BF%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 页面执行完执行
    var check = setInterval(main, 250);

    var is_test = false;
    var btn_pcls = 'Opration-Btn-Box';

    function main() {
        if (
            document.getElementsByClassName('Opration-Btn-Box').length == 0 &&
            document.getElementsByClassName('resultshow').length == 0
            ) {
            console.info('>>> 循环检测页面作业类型......');
            return; };
        is_test = document.getElementsByClassName('resultshow').length > 0;
        if (is_test) {
            btn_pcls = 'right-bottom';
            console.info('>>> 作业类型: 作业考核');
        } else {
            console.info('>>> 作业类型: 平时作业');
        }
        clearInterval(check);

        // 这里执行比较快，需要延迟执行
        setTimeout(crack_common, 3000);
        
        add_btn_group();
    }

    function add_btn_group() {
        $('.' + btn_pcls).append('<hr />');
        add_btn('show', do_tags, '搜题');
        add_btn('clean', do_clean, '重做');
    }

    function add_btn(tag, func, text) {
        
        $('.'+btn_pcls).append(
            '<button class="same-margin relative" x-btn-'+tag+'>'+text+'</button>'
        );

        $('.'+btn_pcls+' button[x-btn-'+tag+']')
            .css({
                'background': '#0089ff',
            })
            .hover(function(){
                $(this).css({
                    '-webkit-box-shadow': '0 0 4px #5f5a5a',
                    'box-shadow': '0 0 4px #5f5a5a'
                });
            }, function(){
                $(this).css({
                    '-webkit-box-shadow': '',
                    'box-shadow': ''
                });
            })
            .on('click', func);
    }

    function do_clean() {
        $('.Choosed').click();
    }

     function do_tags() {

        $('.Subject-Title').each(function(i, e){
            var parent = $(e).parents('.Subject-Area');
            
            if (!!parent.attr('x-init')) {
                return;
            }

            parent.attr('x-init', true);
            
            var question = $(e).text();
            var equestion = encodeURIComponent(question);

            var query = $('<div>').css({
                'background': '#efefef',
                'margin-top': '-10px'
            });

            parent.find('.Subject-Title').after(query);
            get_forword_tag(query, 0, "https://www.shangxueba.com/ask/search.aspx?key="+ equestion, "上学吧");
            get_forword_tag(query, 1, "https://www.baidu.com/s?wd="+ equestion, "百度!");
            query.find('a[x-query-li]').css({
                'color': '#03b000',
                'margin': '3px 5px 3px 3px',
                'padding': '0px 5px',
                'font-weight': 800,
                'cursor': 'pointer',
                'font-size': 'larger',
                'padding': '0 8px'
            });
        });

         // fix_width();
    }

    function get_forword_tag(el, i, link, text) {
       var el_a = $('<a />').attr({
            'x-query-li': i,
            'href': link,
            'title': text,
            'target': '_blank'
        }).html(text);
        el.append(el_a);
    }

    function fix_width() {
        $('.blank-title td img').css('width', 'auto');
        $('.question-options li img').css('width', 'auto');
    }

    function request_monitoring() {
        $(document).ajaxComplete(
            function(event, xhr, settings) {

                if (settings.url.indexOf('OnlineJob/DoHomework') <= 0) {
                    return;
                }
                $('.qestitle').each(function(i, e){
                    var question = $(e).text();
                    var equestion = encodeURIComponent(question);
                    var td = $(e).attr('style', '');
                    td.parent().prepend('<td><a href="http://www.baidu.com/s?wd='+ question +'" target="_blank">Q</a></td>');
                    var height = td.height();

                    td.html('<textarea readonly style="width: 100%; border:0; font-weight:400;">'+question+'</textarea>').find('textarea').height(height);
                    // 太丑
                    // var squestion = question.replace(' ）', ' ').replace('（', '').replace('。', '');
                    // td.parent().parent().append('<tr><td colspan="3"><input style="width: 100%; height:20px; font-size: 14px;font-weight:100;" value="' + squestion + '" /></td></tr>');
                });
            }
        );
    }

    // 破解常规限制：右键、 ctrl+c、 选中禁用
    function crack_common() {
        console.info('>>> 解除右键限制');
        // 禁用右键
        document.oncontextmenu = function () {
            return true;
        }
        console.info('>>> 解除禁用ctrl+c功能');
        //禁用ctrl+c功能
        document.onkeydown = function () {
            if (event.ctrlKey && window.event.keyCode == 67) {
                return true;
            }
        }
        console.info('>>> 解除禁用选中功能');
        //禁用选中
        $(document).unbind('selectstart');
    }
})();
