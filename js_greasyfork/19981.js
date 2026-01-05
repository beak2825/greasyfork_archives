// ==UserScript==
// @name         영단기 | 매일 무료 배포 자동응모
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  try to take over the world!
// @author       You
// @match        http://eng.dangi.co.kr/promotion/new_zone/free_book
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19981/%EC%98%81%EB%8B%A8%EA%B8%B0%20%7C%20%EB%A7%A4%EC%9D%BC%20%EB%AC%B4%EB%A3%8C%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%EC%9D%91%EB%AA%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/19981/%EC%98%81%EB%8B%A8%EA%B8%B0%20%7C%20%EB%A7%A4%EC%9D%BC%20%EB%AC%B4%EB%A3%8C%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%EC%9D%91%EB%AA%A8.meta.js
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
\
.free_book_v3 .fix_width {float:left;width:300px !important;margin:0 !important;}\
#wrap {padding:0;min-width:auto;padding:0 !important;padding-top:30px !important;background:none !important;}\
#wrap, #contents {background-color:#F5F5F5}\
.free_book_v3 > div {display:none;}\
#contents {min-height:auto !important;}\
#contents .cont_book_schedule {display:block;padding:0;margin:0;}\
.count_box {display:none;}\
\
#contents .ib_con {float:left;background:none !important;}\
#contents .ib_con > div {overflow:hidden;margin:0;width:100%;padding:0;margin:0;text-align:left;}\
\
#contents .btn_join,\
#contents .ib_bot {display:none;}\
.free_book_v3 .cont_book_schedule .info_txt {padding:0;}\
.free_book_v3 .cont_book_schedule .input_box {float:left;width:inherit !important;background:none !important;}\
.input_box {float:left;padding:0;margin:0;min-height:inherit !important;}\
.free_book_v3 .cont_book_schedule .write_box,\
.free_book_v3 .cont_book_schedule .write_box input {float:left;width:100% !important;box-sizing:border-box;}\
.free_book_v3 .cont_book_schedule .write_box span {display:none !important;}\
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
    ');
    document.addEventListener('DOMContentLoaded', function(){

        $.ajax({
            url: 'http://st-event-eng.dangi.co.kr/api/event/newtoeic_free_book/api_user_info2',
            dataType: "jsonp",
            cache: false,
            success: function(r) {
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
                                popup_rc();
                            } else if (r.result_code == 2) {
                                popup_lc();
                            } else if (r.result_code == 3) {
                                popup_voca();
                            } else if (r.result_code == 4) {
                                popup_fail();
                            } else {
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
    });
})();