// ==UserScript==
// @name         注册测绘师继续教育平台自动选课
// @namespace    http://www.52lovehome.com/
// @version      0.1
// @description  注册测绘师继续教育平台跳过验证码,后台不暂停继续播放
// @author       G魂帅X
// @match        http://rsedu.ch.mnr.gov.cn//index/user/myColumn?*
// @match        https://rsedu.ch.mnr.gov.cn//index/user/myColumn?*
// @match        http://rsedu.ch.mnr.gov.cn//index/class?*
// @match        https://rsedu.ch.mnr.gov.cn//index/class?*
// @match        http://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/class?*
// @match        https://rsedu.ch.mnr.gov.cn//index/onlineCourseUser/class?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467635/%E6%B3%A8%E5%86%8C%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/467635/%E6%B3%A8%E5%86%8C%E6%B5%8B%E7%BB%98%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E8%AF%BE.meta.js
// ==/UserScript==

(function($, window, document, undefined) {
    'use strict';

    // Your code here...
    var $logView = $(`<div></div>`).appendTo($('body')).css({
        'position': 'fixed',
        'left': '0',
        'bottom': '0',
        'width': '300px',
        'height': '100px',
        'padding': '20px',
        'border-radius': '0 20px 0 0',
        'background': 'linear-gradient(45deg, #5d6aff, #2effc5)',
        'z-index': '999',
        'overflow': 'auto'
    });
    var $logInner = $(`<div></div>`).appendTo($logView);

    var log = (info) => {
        $(`<p>${info}</p>`).appendTo($logInner).css({
            'font-size': '17px',
            'color': '#FFF',
            'padding-bottom': '10px'
        });
        $logView.scrollTop($logInner.outerHeight(true) + 40);
    };

    var pathname = window.location.pathname;
    if (pathname.includes('user/myColumn')) {
        var load;
        layui.use('layer', function() {
            var layer = layui.layer;
            load = layer.load();

            layer.close(load);
            layer.confirm('是否启用自动跳转视频结尾,跳过播放过程？有风险，请谨慎！', {
                btn: ['启用','关闭'] //按钮
            }, function(index){
                window.localStorage.setItem('enable_jump', 'true');
                layer.close(index);
            }, function(){
                window.localStorage.setItem('enable_jump', 'false');
            });
        });
    } else {
        var pInterval = setInterval(() => {
            setTimeout(() => {
                var $tb = $('#videos').next().find('.layui-table-body .layui-table');
                if ($tb.length > 0) {
                    var $tr = $tb.find('tr');
                    if ($tr.length > 0) {
                        clearInterval(pInterval);
                        var nextUrl = '';
                        for (var i = 0, len = $tr.length; i < len; i++) {
                            var $cutr = $tr.eq(i);
                            var $time = $cutr.find('td[data-field="PLAY_TIME"] span');
                            if ($time.html() !== '已完成') {
                                var $a = $cutr.find('td[data-field="caozuo"] a');
                                nextUrl = $a.prop('href');
                                break;
                            }
                        }
                        if (nextUrl != '') {
                            log('开始学习！！！');
                            window.location.assign(nextUrl);
                        }
                    }
                }
            }, 0);
        }, 200);
    }
})(jQuery, window, document);