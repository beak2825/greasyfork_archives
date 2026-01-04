// ==UserScript==
// @name         메이플캐나다 주작기
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  악용하지마세요
// @author       Meda
// @match        https://www.maplecanada.co.kr/kr/event/event/event_ing_view?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390301/%EB%A9%94%EC%9D%B4%ED%94%8C%EC%BA%90%EB%82%98%EB%8B%A4%20%EC%A3%BC%EC%9E%91%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390301/%EB%A9%94%EC%9D%B4%ED%94%8C%EC%BA%90%EB%82%98%EB%8B%A4%20%EC%A3%BC%EC%9E%91%EA%B8%B0.meta.js
// ==/UserScript==

//버튼 추가
$(".sns_area li:last").append(`
<h1>주작기-> </h1>
<input type=\"button\" id=\"hackbtn1\" value=\"메이플워터\" />
<input type=\"button\" id=\"hackbtn2\" value=\"와인쿨러\" />
<input type=\"button\" id=\"hackbtn3\" value=\"모링가잎\" />
<input type=\"button\" id=\"hackbtn4\" value=\"자메이슨 크릴오일\" />
<input type=\"button\" id=\"hackbtn5\" value=\"시티즌 건강차\" />
<input type=\"button\" id=\"hackbtn6\" value=\"적립금3,000원\" />
<input type=\"button\" id=\"hackbtn7\" value=\"쿠폰2,000원\" />
<input type=\"button\" id=\"hackbtn8\" value=\"적립금500원\" />
`);

//recomm('coupon_type_1', 'Event_Roulette_pop_01.jpg');
/* 룰렛 */
$(function(){
    var $hackbtn1 = $('#hackbtn1');
    var $hackbtn2 = $('#hackbtn2');
    var $hackbtn3 = $('#hackbtn3');
    var $hackbtn4 = $('#hackbtn4');
    var $hackbtn5 = $('#hackbtn5');
    var $hackbtn6 = $('#hackbtn6');
    var $hackbtn7 = $('#hackbtn7');
    var $hackbtn8 = $('#hackbtn8');
    $hackbtn1.on("click", function(){
        recomm('coupon_type_1', 'Event_Roulette_pop_01.jpg');
    });
    $hackbtn2.on("click", function(){
        recomm('coupon_type_2', 'Event_Roulette_pop_02.jpg');
    });
    $hackbtn3.on("click", function(){
        recomm('coupon_type_3', 'Event_Roulette_pop_03.jpg');
    });
    $hackbtn4.on("click", function(){
        recomm('coupon_type_4', 'Event_Roulette_pop_08.jpg');
    });
    $hackbtn5.on("click", function(){
        recomm('coupon_type_5', 'Event_Roulette_pop_05.jpg');
    });
    $hackbtn6.on("click", function(){
        recomm('coupon_type_6', 'Event_Roulette_pop_06.jpg');
    });
    $hackbtn7.on("click", function(){
        recomm('coupon_type_7', 'Event_Roulette_pop_07.jpg');
    });
    $hackbtn8.on("click", function(){
        recomm('coupon_type_8', 'Event_Roulette_pop_04.jpg');
    });
}());