// ==UserScript==
// @name         이엠바이 품절체크
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://m.embuy.co.kr/product/list_thumb.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400181/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%ED%92%88%EC%A0%88%EC%B2%B4%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/400181/%EC%9D%B4%EC%97%A0%EB%B0%94%EC%9D%B4%20%ED%92%88%EC%A0%88%EC%B2%B4%ED%81%AC.meta.js
// ==/UserScript==

$("img[alt = \"품절\"]").parents('.information').attr('class','soldoutitem');

$('a:contains(\"PS4 VR 헤드셋 실리콘 케이스\")').parents('.information').attr('class','eventitem'); //테스트용
$('a:contains(\"네온\")').parents('.information').attr('class','eventitem');
$('a:contains(\"그레이\")').parents('.information').attr('class','eventitem');
$('a:contains(\"모여봐요\")').parents('.information').attr('class','eventitem');
$('a:contains(\"동물의\")').parents('.information').attr('class','eventitem');
$('a:contains(\"링피트\")').parents('.information').attr('class','eventitem');

if($('.eventitem').length){
    var href = $('.eventitem a').attr('href');
    window.location.href=href;
}else{
    location.reload();
}
