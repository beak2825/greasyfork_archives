// ==UserScript==
// @name         CJmall | 여름 제대로 준비하기 1탄 최적화
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        http://mw.cjmall.com/m/shop/planshop/plan_shop.jsp*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19748/CJmall%20%7C%20%EC%97%AC%EB%A6%84%20%EC%A0%9C%EB%8C%80%EB%A1%9C%20%EC%A4%80%EB%B9%84%ED%95%98%EA%B8%B0%201%ED%83%84%20%EC%B5%9C%EC%A0%81%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/19748/CJmall%20%7C%20%EC%97%AC%EB%A6%84%20%EC%A0%9C%EB%8C%80%EB%A1%9C%20%EC%A4%80%EB%B9%84%ED%95%98%EA%B8%B0%201%ED%83%84%20%EC%B5%9C%EC%A0%81%ED%99%94.meta.js
// ==/UserScript==

(function() {
	var currentTimeStates = '';
	intervalTimer = null;

	document.addEventListener('DOMContentLoaded', function(){
        if($('h3:contains("혜택두울 투썸 아메리카노 받기")').length){
            window.trying = function(test) {
                // if(test){
                // 	$('#eventMessage').html(test);
                // 	return;
                // }
                if (false) {
                    if (confirm("앱에서만 신청가능합니다.")) {
                        appTransfer();
                    }
                    return;
                }
                if (!isLogin) {
                    location.href = 'http://mw.cjmall.com/m/login/login.jsp?pic=LM02&app_cd=APP&head=APP&rtn_url=' + rtn_url;
                    return;
                }
                var sel = $(':input:radio[name=msg_img]:checked').val();
                if (sel == '' || sel == undefined) {
                    $('#eventMessage').html('보기중 한개를 선택하셔야만 합니다. ');
                    return;
                }
                // if (isClickEvent) {
                // 	isClickEvent = false;
                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        'sel': sel,
                        'timer': currentTimeStates
                    },
                    url: 'http://mw.cjmall.com/m/event/e/json/summer_0516_Rst.jsp',
                    jsonp: 'jsonp',
                    success: function(json) {
                        isClickEvent = true;
                        var resCd = $.trim(json.resCode);
                        var message = '';
                        if (resCd == "91") {
                            $('#eventMessage').html(json.resMsg);
                            location.href = 'http://mw.cjmall.com/m/login/login.jsp?pic=LM02&app_cd=APP&head=APP&rtn_url=' + rtn_url;
                        } else if (resCd == "4" || resCd == "5" || resCd == "6" || resCd == "7" || resCd == "8" || resCd == "9" || resCd == "10" || resCd == "5_v2") {
                            if(resCd == "4"){
                                message = '정답입니다! 6월 22일(수)이내, 투썸플레이스 아메리카노(R) 일괄지급 예정';
                            }
                            if(resCd == "5"){
                                message = '정답이 아닙니다. 내일 다시 도전해주세요!(ID당 1일 1회 참여가능합니다';
                            }
                            if(resCd == "6"){
                                message = '이미 당첨 되셨습니다. 재응모 불가합니다.';
                            }
                            if(resCd == "7"){
                                message = '선착순 마감되었습니다. 감사합니다.';
                            }
                            if(resCd == "8"){
                                message = 'CJ 임직원은 참여불가합니다.';
                            }
                            if(resCd == "9"){
                                message = '오늘은 이미 참여하셨습니다. 내일 다시 도전해주세요!(ID당 1일 1회 참여가능)';
                            }
                            if(resCd == "10"){
                                message = '당일 오전 10시부터 참여 가능합니다.';
                            }
                            if(resCd == "5_v2"){
                                message = '정답이 아닙니다. ID당 1일 1회 참여 가능합니다.';
                            }
                            $('#eventMessage').html(message);
                            showPop(resCd);
                            $('button:contains("연속전송 정지")').trigger('click');
                            return;
                        } else {
                            $('#eventMessage').html(json.resMsg);
                            //location.reload();
                        }
                    },
                    error: function(request, status, error) {
                        $('#eventMessage').html("죄송합니다.\n현재 정상적으로 진행되지 않았습니다.\n잠시후 다시 시도해 주세요.");
                        //location.reload();
                    }
                });
                // } else {
                // 	$('#eventMessage').html("처리중입니다.");
                // 	return;
                // }
            };

            $('.evt_sec:nth-child(1), .evt_sec:nth-child(2), .evt_noticewrap, .bn_card').hide();
            $('<div style="overflow:hidden;text-align: center;color: #fff;font-size: 1em;left: 0;right: 0;background-color: #000;line-height: 1em;padding: 1em;"><div id="eventController" style="width:100%;margin-bottom:.5em;"></div><div id="timerStates" style="padding:1em;"></div><div id="eventMessage" style="background: yellow;color: #000;text-align: left;padding: 1em;">이벤트 메세지</div></div>').insertAfter('.evt_noticewrap:last');
            $('<button type="button" style="width: calc(50% - 1px);border: 1px solid #fff;margin-right: 1px;color: #fff;padding: 1em;">연속전송 시작</button>').on('click', function(){
                intervalTimer = setInterval(function(){
                    window.trying('연속전송 테스트 시작'+intervalTimer);
                }, 100);
            }).appendTo('#eventController');
            $('<button type="button" style="width: calc(50% - 1px);border: 1px solid #fff;margin-left: 1px;color: #fff;padding: 1em;">연속전송 정지</button>').on('click', function(){
                clearInterval(intervalTimer);
                window.trying('연속전송 테스트 정지'+intervalTimer);
            }).appendTo('#eventController');

            $.ajax({
                url: ''
            }).done(function(result){
                console.log(result);
                console.log(result.match(/[0-9]{14}/g)[1]);
                currentTimeStates = parseInt(result.match(/[0-9]{14}/g)[1]);
                $('#timerStates').html(currentTimeStates);

                setInterval(function(){
                    currentTimeStates = currentTimeStates + 1;
                    $('#timerStates').html(currentTimeStates);
                }, 1000);
            });
        }
	});
})();