// ==UserScript==
// @name         영단기 | 매일 무료 배포 자동응모(6차), 빠른 계정 생성, 로그인 화면 최적화, 아이디 노출
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  try to take over the world!
// @author       You
// @match        http://eng.dangi.co.kr/promotion/new_zone/free_book
// @include      http://member.dangi.co.kr/*
// @include      https://member.dangi.co.kr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19830/%EC%98%81%EB%8B%A8%EA%B8%B0%20%7C%20%EB%A7%A4%EC%9D%BC%20%EB%AC%B4%EB%A3%8C%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%EC%9D%91%EB%AA%A8%286%EC%B0%A8%29%2C%20%EB%B9%A0%EB%A5%B8%20%EA%B3%84%EC%A0%95%20%EC%83%9D%EC%84%B1%2C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%ED%99%94%EB%A9%B4%20%EC%B5%9C%EC%A0%81%ED%99%94%2C%20%EC%95%84%EC%9D%B4%EB%94%94%20%EB%85%B8%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/19830/%EC%98%81%EB%8B%A8%EA%B8%B0%20%7C%20%EB%A7%A4%EC%9D%BC%20%EB%AC%B4%EB%A3%8C%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%EC%9D%91%EB%AA%A8%286%EC%B0%A8%29%2C%20%EB%B9%A0%EB%A5%B8%20%EA%B3%84%EC%A0%95%20%EC%83%9D%EC%84%B1%2C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%20%ED%99%94%EB%A9%B4%20%EC%B5%9C%EC%A0%81%ED%99%94%2C%20%EC%95%84%EC%9D%B4%EB%94%94%20%EB%85%B8%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    setCss = function(cssRule){
        var css = '',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = cssRule;
        } else {
            style.appendChild(document.createTextNode(cssRule));
        }
        head.appendChild(style);
    };
    
    if(location.href.indexOf('authorize/login') > -1){
        setCss('\
#wrap, #cboxOverlay {display:none !important;}\
.banner_box {display:none;}\
#colorbox, label {display:inline !important;position:static !important;}\
#colorbox div {position:static !important;float:none;width:auto !important;height:auto !important;margin:0;padding:0;}\
.login_box form {clear:both;float:left:width:100%;}\
');
        window.addEventListener('load', function(){
            $('#pw').val('dangi12');
            $('#id').attr('tabindex', '0').get(0).focus();
        });
    }
    if(location.href.indexOf('http://eng.dangi.co.kr/promotion/new_zone/free_book') > -1){
        setCss('\
div {position:static !important;}\
a, button, textarea, div, span, iframe, body, p  {font-size:12px !important;}\
.login-area,\
.login-area li {padding:0 !important;}\
.lnb-menu,\
.greeting_msg {display:none !important;}\
#tgnb {position:fixed !important;top:0;left:0;width:auto !important;height:30px !important;}\
#header,\
#tfooter {display:none !important;padding:0 !important;}\
.logstate {width:auto !important;margin:0 !important;padding:0 !important;}\
.log-menu {float:left;width:100% !important;padding:0 !important;}\
.log-menu li,\
.log-menu a {float:left;margin:0 !important;padding:0 !important;background-image:none !important;}\
.log-menu li {margin-right:1px !important;}\
.log-menu a,\
.log-menu a:hover {width:auto !important;padding:.75em !important;background-color:#000;color:#fff !important;border-radius:4px;background-image:none !important;}\
\
.free_book_v6 .fix_width {float:left;width:300px !important;margin:0 !important;}\
#wrap {padding:0;min-width:auto;padding:0 !important;padding-top:30px !important;background:none !important;}\
#wrap, #contents {background-color:#F5F5F5}\
.free_book_v6 > div {display:none;}\
#contents {min-height:auto !important;}\
#contents .cont_book_schedule {display:block;padding:0;margin:0;}\
.count_box {display:none;}\
\
#contents .ib_con {float:left;background:none !important;}\
#contents .ib_con > div {overflow:hidden;margin:0;width:100%;padding:0;margin:0;text-align:left;}\
\
#contents .btn_join,\
#contents .ib_bot {display:none;}\
.free_book_v6 .cont_book_schedule .info_txt {padding:0;}\
.free_book_v6 .cont_book_schedule .input_box {float:left;width:inherit !important;background:none !important;}\
.input_box {float:left;padding:0;margin:0;min-height:inherit !important;}\
.free_book_v6 .cont_book_schedule .write_box,\
.free_book_v6 .cont_book_schedule .write_box input {float:left;width:100% !important;box-sizing:border-box;}\
.free_book_v6 .cont_book_schedule .write_box span {display:none !important;}\
.input_box img,\
.input_box button {float:left;width:50%;}\
.btn {float:left;}\
\
.day_box {display:none;}\
.btn_delivery img {width:100% !important;border-radius:40px;}\
\
.greeting {padding:0 !important;}\
.greeting a {display:none;}\
.greeting p {padding:0 !important;}\
.ban_floating_box,\
.event_floating_box {display:none !important;}\
.login-area .greeting p {display:none;}\
.visual_zico {display:none;}\
.layer_box {display:none;}\
');
    }
    document.addEventListener('DOMContentLoaded', function(){
        $('<meta name="viewport" content="initial-scale=1, width=device-width">').prependTo('head');

        if(location.href.indexOf('member.dangi.co.kr/member/join') > -1){
            $('#contents').prepend($('<input type="text" placeholder="홍길동(성명)/honggil(아이디)" style="width:100%;padding:1em;font-size:2em;color:yellow !important;;background:#000 !important;">').on('keypress', function(evt){
                console.log('evt.keyCode', evt.keyCode);
                console.log('$(this).val()', $(this).val());
                //return;
                if(evt.keyCode !== 13){
                    return;
                }
                // 영단기 계정 생성
                createMember = function(param){
                    if(!param.split('/').length){
                        return;
                    } else {
                        var name = param.split('/')[0];
                        var id = param.split('/')[1];
                    }
                    var randomBirthYear = function() {
                        var min = 85;
                        var max = 99;
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    var randomBirthMonth = function() {
                        var min = 1;
                        var max = 9;
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    var randomBirthDay = function() {
                        var min = 10;
                        var max = 30;
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    var randomForeNumber = function() {
                        var min = 1000;
                        var max = 9999;
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };

                    $.ajax({
                        type: 'POST'
                        ,url: '/member/join/union_join_proc/'
                        ,contentType: "application/x-www-form-urlencoded; charset=UTF-8"
                        ,data: $.param({
                            name			: name
                            ,id				: id
                            ,nick_name		: id
                            ,hand1			: '011'//generate
                            ,hand2			: randomForeNumber()//generate
                            ,hand3			: randomForeNumber()//generate
                            ,birth_year		: '19'+randomBirthYear()//generate
                            ,birth_month	: '0'+randomBirthMonth()//generate
                            ,birth_day		: randomBirthDay()//generate
                            ,email_id		: id+'@'+id+'.com'
                            ,pass			: 'dangi12'
                            ,re_pass		: 'dangi12'
                            ,sex			: '남자'
                            ,index			: '0'
                            ,email_yn		: 'N'
                            ,sms_yn			: 'N'
                            ,view_type		: 'PC'
                            ,tel_1			: '02'
                        })
                    }).done(function(data){
                        console.log(data);
                        if(data.match(/회원가입이 완료되었습니다/g)){
                            alert('회원가입이 완료되었습니다. '+name+'/'+id, true);
                            var logoutWin = window.open('https://member.dangi.co.kr/authorize/logout');
                            //logoutWin.opener.focus();
                            setTimeout(function(){
                                logoutWin.close();
                            }, 250);
                        }
                    });
                };
                //createMember('', '');
                createMember($(this).val());
            }));
        }
        if(location.href.indexOf('http://eng.dangi.co.kr/promotion/new_zone/free_book') > -1){
            $.ajax({
                url: 'http://st-event-eng.dangi.co.kr/api/event/newtoeic_free_book/api_user_info2',
                dataType: "jsonp",
                cache: false,
                success: function(r) {
                    $('.name:visible').append('/<span title="id">'+r.user_id+'</span>');
                    var arrayState = new Array();

                    if(!$('#applyState').length){
                        $('<span id="applyState" style="color:blue;"></span>').insertAfter($('span[class="name"]'));
                    } else {
                        $('#applyState').html('');
                    }

                    if (r.win == false) {
                        arrayState.push('당첨X');
                    }
                    if (r.win_detail.rc.result == true) {
                        arrayState.push("RC");
                    }
                    if (r.win_detail.lc.result == true) {
                        arrayState.push("LC");
                    }
                    if (r.win_detail.voca.result == true) {
                        arrayState.push("VO");
                    }

                    arrayState = arrayState.join(', ');

                    $('#applyState').text('('+arrayState+')');
                }
            });

            $('<button type="button" style="padding: 0.5em;font-size: 3em;color: yellow;background-color: #000;border-radius: 1em;font-weight: bold;">자동응모</button>').bind('click', function(){
                (function() {
                    window.app = {};
                    app.user_info = null;
                    //실행
                    app.get_free = function() {
                        if (!is_login) {
                            location.href = "https://member.dangi.co.kr/authorize/login?redirect_url=http%3A%2F%2Feng.dangi.co.kr%2Fpromotion%2Fnew_zone%2Ffree_book";
                            return;
                        }
                        var url = 'http://st-event-eng.dangi.co.kr/api/event/newtoeic_free_book/api_free';
                        var answer = $('#quiz_answer').val();
                        var data = {
                            'answer': answer
                        };
                        $.ajax({
                            url: url,
                            data: data,
                            dataType: "jsonp",
                            cache: false,
                            success: function(r) {
                                if (r.result_code == 1) {
                                    //popup_rc();
                                    alert('rc');
                                } else if (r.result_code == 2) {
                                    //popup_lc();
                                    alert('lc');
                                } else if (r.result_code == 3) {
                                    //popup_voca();
                                    alert('vo');
                                } else if (r.result_code == 4) {
                                    //popup_fail();
                                    alert('fail');
                                } else {
                                    alert(r.msg);
                                    console.log(r.msg);
                                }
                                app.load_cnt();
                            }
                        });
                    };
                    //당첨정보
                    app.get_user_info = function(callback) {
                        if (!is_login) {
                            location.href = "https://member.dangi.co.kr/authorize/login?redirect_url=http%3A%2F%2Feng.dangi.co.kr%2Fpromotion%2Fnew_zone%2Ffree_book";
                            return;
                        }
                        var url = 'http://st-event-eng.dangi.co.kr/api/event/newtoeic_free_book/api_user_info';
                        $.ajax({
                            url: url,
                            dataType: "jsonp",
                            cache: false,
                            success: function(r) {
                                if (typeof callback == "function") {
                                    callback(r);
                                }
                            }
                        });
                    };
                    //카운트
                    app.load_cnt = function() {
                        var url = 'http://st-event-eng.dangi.co.kr/api/event/newtoeic_free_book/api_free_remain_cnt';
                        $.ajax({
                            url: url,
                            dataType: "jsonp",
                            cache: false,
                            success: function(r) {
                                //var str = r.remain_digits.d3 + r.remain_digits.d2 + r.remain_digits.d1;
                                //$('#remain_cnt').html(str);
                                $("#remain_d1").text(r.remain_digits.d1);
                                $("#remain_d2").text(r.remain_digits.d2);
                                $("#remain_d3").text(r.remain_digits.d3);
                                $("#remain_d4").text(r.remain_digits.d4);
                                $(".quize").html("오늘의 퀴즈 : " + r.quiz);
                                if (r.dist_order == 0) {
                                    setEndImage(r.today);
                                } else if (r.remain < 1) {
                                    setEndImage(r.today, r.dist_order);
                                } else {
                                    setEndImage(r.today, r.dist_order - 1);
                                }
                            }
                        });
                    };
                    app.load_cnt();
                    //app.get_user_info();
                })();

                setInterval(function(){
                    app.get_free();
                }, 65);
            }).appendTo('.btn');
        }
    });
})();