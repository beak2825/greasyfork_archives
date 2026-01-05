// ==UserScript==
// @name        메가박스.예매권등록
// @namespace   https://greasyfork.org/ko/users/15592/
// @version     1.2
// @description 메가박스.예매권등록 쉽게 하기
// @author      jwjang
// @match       http://www.megabox.co.kr/?menuId=mypage-coupon
// @downloadURL https://update.greasyfork.org/scripts/20503/%EB%A9%94%EA%B0%80%EB%B0%95%EC%8A%A4%EC%98%88%EB%A7%A4%EA%B6%8C%EB%93%B1%EB%A1%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/20503/%EB%A9%94%EA%B0%80%EB%B0%95%EC%8A%A4%EC%98%88%EB%A7%A4%EA%B6%8C%EB%93%B1%EB%A1%9D.meta.js
// ==/UserScript==

var url = "";

function init()
{
    addControl();
}

function addControl () {
    var myDiv = $('<div>')
        .attr('id', 'myIdv')
        .css('position', 'absolute')
        .css('top', '350px')
        .css('left', '24px')
        .css('border', '2px solid gray')
        .css('background-color', 'gray');

    var myInput = $('<input type=text>').val("")
        .attr("id", "myInput")
        .attr("placeholder", "붙여넣으세요~")
        .css('width', '220px')
        .css('height', '30px')
        .css('border', '2px solid #aaa');

    var myBtn = $('<input type=button>').val("등록")
        .attr("id", "myBtn")
        .css('width', '80px')
        .css('text-indent', '0px')
        .css('height', '30px')
        .css('border', '2px solid #aaa')
        .css('margin-left', '2px')
        .css('text-align', 'center');


    myBtn.click(function() {
        var val = $('#myInput').val();
        val = val.replace("\t", "-");
        var arr = val.split("-");

        MyPageCouponRegister.showPage('mypage-coupon');

        $("input[name='chipId1']").val(arr[0]);
        $("input[name='chipId2']").val(arr[1]);
        $("input[name='chipId3']").val(arr[2]);
        $("input[name='ctrlKey']").val(arr[3]);

        MyPageCouponRegister.registerPopup();
    });


    $("body").append(myDiv);
    myDiv.append(myInput);
    myDiv.append(myBtn);
}

init();

