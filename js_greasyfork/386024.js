// ==UserScript==
// @name         麦能网挂机助手
// @namespace    https://blog.luoyb.com
// @version      1.6.7
// @description  麦能网成人教育课程自动选课、自动答题、自动播放
// @author       robin<37701233@qq.com>
// @match        *://*.cjnep.net/lms/*
// @match        *://*.cjnep.net/lms/web/
// @match        *://*.cjnep.net/lms/web/default/index
// @match        *://*.cjnep.net/lms/web/course/*
// @grant        none
// @license      GPL
// @run-at       document-body
// @icon         http://fs.cjnep.net/resources/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/386024/%E9%BA%A6%E8%83%BD%E7%BD%91%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386024/%E9%BA%A6%E8%83%BD%E7%BD%91%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $origin = window.location.origin;
    function createtoolbar(){
        var html = '<div id="cjnep-helper">'
        +'<span style="display:inline-block;text-align: center;width:100%;margin-top:15px;"><a href="http://blog.luoyb.com" style="color:#fff;" target="_blank">挂机助手</a></span>'
        +'<span style="display:inline-block;text-align: center;width:100%;margin-top:10px;">自动选课：<span id="auto-select" style="cursor:pointer;color:red;font-weight:bold;border-bottom:1px solid;">关闭</span></span>'
        +'<span style="display:inline-block;text-align: center;width:100%;margin:2px 0;">自动播放：<span id="auto-play" style="cursor:pointer;font-weight:bold;color:red;border-bottom:1px solid;">关闭</span></span>'
        +'<span style="display:inline-block;text-align: center;width:100%">自动静音：<span id="auto-mute" style="cursor:pointer;font-weight:bold;color:red;border-bottom:1px solid;">关闭</span></span>'
        +'<a href="https://blog.luoyb.com/cjnep-helper" target="_bank" style="display:inline-block;text-align: center;width:100%;color: #ffffff;margin-top: 10px;font-size: 10px;">联系我</a>'
        +'</div>';
        var styles = {"border": "2px solid #fff", "width": "150px", "height": "150px", "position": "fixed", "right": "0", "top": "10%", "background-color": "rgb(12, 147, 243)", "color": "#fff"
                      ,"padding-left":"5px","filter":"alpha(Opacity=80)","-moz-opacity":"0.8","opacity":"0.8","z-index":"99999999","border-radius":"80px","box-shadow": "1px 1px 6px #f7c804","cursor":"move"};
        $("body").append(html);
        $("#cjnep-helper").css(styles);
        sessionStorage.getItem("auto-select")==="on"?$("#auto-select").text("开启").css("color", "#00fb00"):$("#auto-select").text("关闭").css("color","red");
        sessionStorage.getItem("auto-play")==="on"?$("#auto-play").text("开启").css("color", "#00fb00"):$("#auto-play").text("关闭").css("color","red");
        sessionStorage.getItem("auto-mute")==="on"?$("#auto-mute").text("开启").css("color", "#00fb00"):$("#auto-mute").text("关闭").css("color","red");
        $("#auto-select").click(function(){
            if(sessionStorage.getItem("auto-select")==="on"){
                sessionStorage.setItem("auto-select", "off");
                $(this).text("关闭").css("color","red");
            }else{
                sessionStorage.setItem("auto-select", "on");
                $(this).text("开启").css("color", "#00fb00");
            }
        });
        $("#auto-play").click(function(){
            if(sessionStorage.getItem("auto-play")==="on"){
                sessionStorage.setItem("auto-play", "off");
                $(this).text("关闭").css("color","red");
            }else{
                sessionStorage.setItem("auto-play", "on");
                $(this).text("开启").css("color", "#00fb00");
            }
        });
        $("#auto-mute").click(function(){
            if(sessionStorage.getItem("auto-mute")==="on"){
                sessionStorage.setItem("auto-mute", "off");
                $(this).text("关闭").css("color","red");
            }else{
                sessionStorage.setItem("auto-mute", "on");
                $(this).text("开启").css("color", "#00fb00");
            }
        });
    }
    function autoselect(){
        var _list = $('.coursediv>.courselist>.row>div');
        if(_list.length===0){ return; }
        if(sessionStorage.getItem("auto-select")==="on"){
            var o = true;
            for (var i = 0; i < _list.length; i++) {
                if (!$(_list[i]).find('.statusdiv').length) {
                    //console.log("跳转至："+$(_list[i]).find('.introdiv').text());
                    o = false;
                    window.location.href = $origin+$(_list[i]).find('.zbtn').attr('href').replace('/detail', '');
                    break;
                }
            }
            if(o && _list.length>0) {
                var course_index = sessionStorage.getItem("selected-course");
                course_index = course_index ? course_index : -1;
                if (_list.length > (course_index+1)){course_index++;}else{return;}
                window.location.href = $origin+$(_list[course_index]).find('.zbtn').attr('href').replace('/detail', '');
            }
        }
        setTimeout(autoselect, 10000);
    }
    function autoplay(){
        if ($(".videodiv").length === 0){ return; }
        if (sessionStorage.getItem("auto-play")==="on") {
            var _next_btn = $('.pull-right>a')[0];
            var _rtime = $('.vjs-remaining-time-display').text();
            var _curtime = $('.vjs-current-time-display').text().substr(-5).replace(':', '');
            var _total = $('.vjs-duration-display').text().substr(-5).replace(':', '');
            var _is_last = $('.contdiv>div>.item:last').hasClass('active');
            var _vlist = $('.icon-weibiaoti2');
            if (_vlist.length > 0) {
                var $_var = null;
                for(var i = 0; i < _vlist.length; i++) {
                    if ($(_vlist[i]).hasClass('active')) {
                        $_var = null;
                        break;
                    } else {
                        $_var = $(_vlist[i]);
                    }
                }
                if($_var != null)$_var.click();
            }
            var _play_btn = $('.vjs-play-control');
            if (_play_btn.length > 0 && !_play_btn.hasClass('vjs-playing')) {
                _play_btn.click();
            }
            var _lx = $('#quiz_wnd');
            if (_lx.length > 0 && _lx.is(':visible')) {
                autoanswer();//自动答题
            }
            if (parseInt(_total) > 0) {
                var _mute_btn = $(".job-bcolbody>.vjs-mute-control");
                if (sessionStorage.getItem("auto-mute")=="on" && _mute_btn.length > 0 && !_mute_btn.hasClass("vjs-vol-0")) {
                    _mute_btn.click();
                }
                _rtime = parseInt(_rtime.substr(_rtime.lastIndexOf('-')+1).replace(':', ''));
                //console.log("Remaining: "+_rtime);
                if (_total <= _curtime && _rtime == 0) {
                    if (_is_last) {
                        window.location.href = $origin+'/lms/web/course/index';
                    }else {
                        _next_btn.click();
                    }
                }
            }
        }
        setTimeout(autoplay, 5000);
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
    function relieve(){
        document.body.ondragstart = '';
        document.body.onselect = '';
        document.body.oncopy = '';
        document.body.onbeforecopy = '';
        document.body.onselectstart = '';
        document.body.onmouseup = '';
    }
    function drag(){
        var dv = document.getElementById('cjnep-helper');
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        dv.onmousedown = function(e) {
            x = e.clientX;
            y = e.clientY;
            l = dv.offsetLeft;
            t = dv.offsetTop;
            isDown = true;
            dv.style.cursor = 'move';
        }
        window.onmousemove = function(e) {
            if (isDown == false) {
                return;
            }
            var nx = e.clientX;
            var ny = e.clientY;
            var nl = nx - (x - l);
            var nt = ny - (y - t);
            dv.style.left = nl + 'px';
            dv.style.top = nt + 'px';
        }
        dv.onmouseup = function() {
            isDown = false;
            //dv.style.cursor = 'default';
        }
    }
    createtoolbar();
    autoselect();
    autoplay();
    relieve();
    drag();
})();