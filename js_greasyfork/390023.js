// ==UserScript==
// @name         @N_1. 네이버 초이스 목록에서 1분뒤 자동으로 새탭 문제열기
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://m.kin.naver.com/mobile/choice/list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390023/%40N_1%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B4%88%EC%9D%B4%EC%8A%A4%20%EB%AA%A9%EB%A1%9D%EC%97%90%EC%84%9C%201%EB%B6%84%EB%92%A4%20%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C%20%EC%83%88%ED%83%AD%20%EB%AC%B8%EC%A0%9C%EC%97%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390023/%40N_1%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%B4%88%EC%9D%B4%EC%8A%A4%20%EB%AA%A9%EB%A1%9D%EC%97%90%EC%84%9C%201%EB%B6%84%EB%92%A4%20%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C%20%EC%83%88%ED%83%AD%20%EB%AC%B8%EC%A0%9C%EC%97%B4%EA%B8%B0.meta.js
// ==/UserScript==


function answermacro(){
    var num=0;
    var macro = setInterval(function() {
        var a = $('.spi_sns_share').eq(num).attr("data-oninitialize").split('\'');
        window.open( a[1],  '_blank' );
        num++;
        if(num>=$('.spi_sns_share').length){
            clearInterval(macro);
        }
    }, 2000);
}

 setTimeout(function() {
      answermacro();
 }, 60000);