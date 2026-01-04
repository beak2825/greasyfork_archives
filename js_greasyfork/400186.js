// ==UserScript==
// @name         이엠바이 이벤트 주소찾기
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://m.embuy.co.kr/board/free/read.html?no=704&board_no=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400186/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EC%A3%BC%EC%86%8C%EC%B0%BE%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/400186/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EC%A3%BC%EC%86%8C%EC%B0%BE%EA%B8%B0.meta.js
// ==/UserScript==
var href = $('.content a').attr('href');

if (href.match('product_no=1410')) {
    location.reload();
}else if(href.match('product_no=1408')){
    location.reload();
}else if(href.match('product_no=1413')){
    location.reload();
}else if(href.match('product_no=1415')){
    location.reload();
}else {
    window.location.href=href;
}

