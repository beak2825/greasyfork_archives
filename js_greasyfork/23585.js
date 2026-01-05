// ==UserScript==
// @name        메가박스 스토어관람권 모니터링
// @namespace   https://greasyfork.org/ko/users/15592/
// @version     2.1
// @description 메가박스 스토어관람권 남은수 모니터링
// @author      jwjang
// @match       http://www.megabox.co.kr/?menuId=store
// @downloadURL https://update.greasyfork.org/scripts/23585/%EB%A9%94%EA%B0%80%EB%B0%95%EC%8A%A4%20%EC%8A%A4%ED%86%A0%EC%96%B4%EA%B4%80%EB%9E%8C%EA%B6%8C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/23585/%EB%A9%94%EA%B0%80%EB%B0%95%EC%8A%A4%20%EC%8A%A4%ED%86%A0%EC%96%B4%EA%B4%80%EB%9E%8C%EA%B6%8C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==
(function() {
    'use strict';


    var titles = ['[모아나] 1+1 관람권', '[더 킹] 1+1 관람권', '[공조] 1+1 관람권'];
    //titles = ['[터닝메카드W: 블랙미러의 부활] 메가 패키지'];

    var targetItem = null;
    var remainCount = 0;
    var intervalId;

    $(".store_lst").eq(1).find('h5').each(function(idx, dom) {
        var title = $(dom).text();
        if (titles.indexOf(title) > -1) {
            // 수량 체크
            remainCount = $(dom).parent().find('.price p b').html();

            $(dom).parents('li').find('.price').css('background-color', 'rgb(200, 230, 220)');

            $(dom).parents('li').find('.price').bind('click.myClick', function() {
                clearTimeout(intervalId);
                $(this).unbind('click.myClick');
                alert('자동갱신 종료');
            });

            if (remainCount > 0)
            {
                targetItem = $(dom).parents('li');
                return false;
            }
        }
    });

    if (targetItem === null)
    {
        //alert('SOLD OUT');
        // refresh
        intervalId = setTimeout(function() {
            location.href = location.href;
        }, 1000 * 15);
    } else {
        targetItem.find('a.blank').click();

        // 메가찬스 팝업
        setTimeout(function() {
            // 구매하기 버튼 클릭
            $('.btn_buy').eq(0)[0].click();
        }, 1500);

        // 결제하기 팝업
        setTimeout(function() {
            // 신용/체크카드 선택
            $('label[for=store_payType_credit]').click();
            // 결제 버튼 클릭
            $('.btn-st1').filter('.btn-l')[0].click();
        }, 2500);

        // push
        var msg = {
            type: "note", // 푸시 종류
            title: "장진욱 알림", // 타이틀
            body: "메가박스 스토어 관람권 잔여수량 [" + remainCount + "] 확인바람", // 내용
            email: "jwjang@gmail.com" // 받는사람 이메일
        };
        $.ajax(
            {
                type: "post",
                url: 'https://api.pushbullet.com/v2/pushes',
                headers: {
                    "Access-Token":"OJ2MkCNGMZzZ6LNZ9W9tams4zqzcO96H",
                    "Content-Type":"application/json"
                },
                dataType: "json",
                async: true,
                cache: false,
                data: JSON.stringify(msg),
                success: function(req)
                {
                    //alert(req.active);
                },
                error: function(req)
                {
                    //alert("Error : \n\n" + req.responseText);
                }
            }
        );
    }
})();
