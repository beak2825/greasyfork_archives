// ==UserScript==
// @name         호텔 조인 | 간식 이벤트
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @include      http://m.hoteljoin.com/appweb/index.php/event/eventRenewOpen*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/20800/%ED%98%B8%ED%85%94%20%EC%A1%B0%EC%9D%B8%20%7C%20%EA%B0%84%EC%8B%9D%20%EC%9D%B4%EB%B2%A4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/20800/%ED%98%B8%ED%85%94%20%EC%A1%B0%EC%9D%B8%20%7C%20%EA%B0%84%EC%8B%9D%20%EC%9D%B4%EB%B2%A4%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function(){
        if($('#btnAutoApply').length){
             return;
        }
        $('.renewalArea').after($('<button type="button" id="btnAutoApply" style="width: 100%;padding: 0.5em;font-size: 3em;color: yellow;background: #000 !important;border-radius: 1em;font-weight: bold;">자동응모</button>').bind('click', function() {
            gc_isAndroidApp = function() {
                return true;
            };
            gc_isIosApp = function() {
                return true;
            };
            gc_alertPopupMsg = function(msg, targetObj, calbackFn) {
                if (!document.getElementById('gm_divAlertPopup')) {
                    var popupObj = document.createElement("div");
                    $(popupObj).attr("id", "gm_divAlertPopup");
                    $(popupObj).attr("data-role", "popup");
                    $(popupObj).attr("data-theme", "g");
                    $(popupObj).attr("data-overlay-theme", "g");
                    $(popupObj).attr('data-dismissible', 'true');
                    $(popupObj).attr('data-history', 'false'); // iOS9 버그(popupafterclose 적용안됨)로 인한 패치 (2015.09.23)
                    $(popupObj).css("width", "100%");
                    var str_html = '<div id="gm_alertPopupMsg"  style="font-size:14px; padding:20px 10px; color:#4e4a45; text-align:center; font-weight:normal;"></div>';
                    str_html += '<a id="gm_alertPopupButton" href="#" data-rel="back" data-role="button" data-theme="e" data-icon="delete" data-iconpos="notext" class="ui-btn-right" style="background: #fff!important;border: 1px solid #e45857!important;border-radius: 4px!important;color: #e45857!important;width:inherit; height:inherit;max-width:90px;">닫기</a>';
                    $(popupObj).html(str_html);
                    //document.body.appendChild(popupObj);
                    //$("#gmPage").append(popupObj)
                    /*
			if(!gc_isEmpty(targetObj)){
			    $(targetObj).append(popupObj).trigger("pagecreate");
			}else{
			    $.mobile.activePage.prepend(popupObj).trigger("pagecreate");
			    //console.log("page create")
			}*/
                    $.mobile.activePage.prepend(popupObj).trigger("pagecreate");
                    //$(popupObj).parent().css("width","80%");
                    // autoinitialize
                    //        setTimeout(function(){
                    $("#gm_divAlertPopup").popup(); // pupup 초기화
                    $("#gm_divAlertPopup").trigger('create'); // button 초기화
                    //        },200);
                }
                $('.gm-footer-fixed_v01').hide(); // android 4.0.x bug(footer fixed 경우 버그 해결)
                $("#gm_divAlertPopup").off("popupafterclose");
                $("#gm_divAlertPopup").on("popupafterclose", function(event, ui) {
                    //console.log($('#gm_confirmResultValue').val());
                    //console.log('close');
                    if (!gc_isEmpty(calbackFn)) {
                        calbackFn(event, ui);
                    }
                    $('.gm-footer-fixed_v01').show(); // android 4.0.x bug(footer fixed 경우 버그 해결)
                });
                $('#gm_alertPopupMsg').html(msg).parent().parent().css({
                    "width": "80%"
                });
                //setTimeout(function () {
                $("#gm_divAlertPopup").popup("open", {
                    positionTo: 'window',
                    history: false
                });
                //}, 500);
            };
            // 응모하기
            goEntry = function() {
                //if(appCheck() == false) return;
                if (m_loginYn != 'Y') {
                    goLogin();
                    return;
                }
                // 앱정보
                var eventFill5 = "Mobile-web";
                if (gc_isAndroidApp()) {
                    eventFill5 = "Android-App";
                } else if (gc_isIosApp()) {
                    eventFill5 = "IOS-App";
                }
                var url = "http://m.hoteljoin.com/appweb/index.php/event/eventRenewOpenJson";
                var paramsObj = {
                    eventFill5: eventFill5,
                    day: gc_getValue('day')
                };
                gc_ajaxJsonRequest(url, paramsObj, function(resvMsg) {
                    eval("var respJSON = " + resvMsg);
                    if (respJSON['errorCode'] == '0') {
                        var addMsg = '';
                        if (respJSON['itemOkYn'] == 'Y') {
                            addMsg = '축!<br/><br/>' + respJSON['itemName'] + '<br/>당첨되셨습니다.';
                            alert('축!<br/><br/>' + respJSON['itemName'] + '<br/>당첨되셨습니다.');
                        } else {
                            addMsg = '오늘의 선착순 선물이 종료되었습니다';
                            alert(addMsg = '오늘의 선착순 선물이 종료되었습니다');
                        }
                        gc_alertPopupMsg(addMsg, '', function() {
                            alert('페이지 새로 고침');
                            //location.reload();
                        });
                    } else {
                        console.log('test1');
                        gc_alertPopupMsg(respJSON['errorMsg'].replace(/\\n/g, "\n"));
                    }
                });
            };
            setInterval(function(){
                goEntry();
                //$('#gm_alertPopupButton').trigger('click');
            }, 20);
        }));
    });
})();