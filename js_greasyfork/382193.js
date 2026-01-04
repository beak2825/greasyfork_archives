// ==UserScript==
// @name         麦能网成教自动播放、自动答题（停止维护，请使用麦能网学习助手）
// @namespace    https://blog.luoyb.com/
// @version      1.8final
// @description  继续教育自动播放、自动答题
// @author       robin<37701233@qq.com>
// @match        http://g.cjnep.net/lms/web/course/*
// @exclude      http://g.cjnep.net/lms/web/course/detail/*
// @grant        none
// @license      GPL
// @icon         http://fs.cjnep.net/resources/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/382193/%E9%BA%A6%E8%83%BD%E7%BD%91%E6%88%90%E6%95%99%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E9%BA%A6%E8%83%BD%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/382193/%E9%BA%A6%E8%83%BD%E7%BD%91%E6%88%90%E6%95%99%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E8%AF%B7%E4%BD%BF%E7%94%A8%E9%BA%A6%E8%83%BD%E7%BD%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _mute = false, _playing = false;
    function _check(){
        var _next_btn = $('.pull-right>a')[0];
        var _rtime = $('.vjs-remaining-time-display').text();
        var _curtime = $('.vjs-current-time-display').text().substr(-5).replace(':', '');
        var _total = $('.vjs-duration-display').text().substr(-5).replace(':', '');
        var _is_last = $('.contdiv>div>.item:last').hasClass('active');
        var _vlist = $('.icon-weibiaoti2');
        if (_vlist.length > 0) {
            for(var i = 0; i < _vlist.length; i++) {
                if (!$(_vlist[i]).hasClass('active')) {
                    $(_vlist[i]).click();
                }
                break;
            }
        }
        var _play_btn = $('.vjs-play-control');
        if (!_playing && _play_btn.length > 0 && !$(_play_btn[0]).hasClass('vjs-playing')) {
            console.log('start play');
            $(_play_btn[0]).click();
            _playing = true;
        }
        if (parseInt(_total) > 0) {
            var _lx = $('#quiz_wnd');
            if (_lx.length > 0 && _lx.is(':visible')) {
                autoanswer();//自动答题
            }
            var _mute_btn = $(".job-bcolbody>.vjs-mute-control");
            if (!_mute && _mute_btn.length > 0) {
                _mute_btn[0].click();
                _mute = true;
            }
            _rtime = parseInt(_rtime.substr(_rtime.lastIndexOf('-')+1).replace(':', ''));
            console.log("Remaining: "+_rtime);
            if (_total <= _curtime && _rtime == 0) {
                if (_is_last) {
                    window.location.href = 'http://g.cjnep.net/lms/web/';
                }else {
                    _next_btn.click();
                }
            }
        } else {
            console.info("Video loading...");
        }
        setTimeout(_check, 5000);
    }
    function autoanswer(){
        var _list = $("#job_quizlist>li").find('input');
        for (var i = 0; i < _list.length; i++) {
            var _ele = $(_list[i]);
            if (_ele.attr('flag') == 'Y') {
                _ele.parent().click();
            }
        }
        if (_list.length > 0) {
            $('.job-quiz-cbar>#job_quizsub').click();
            $('.job-quiz-cbar>#job_quizfinish').click();
        }
    }
    //_check();
alert("停止维护，如有需要请使用'麦能网学习助手'");
})();