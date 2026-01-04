// ==UserScript==
// @name         @N_2. 초이스 문제 A로 자동 선택후 닫기
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://m.kin.naver.com/mobile/choice/detail?*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/390024/%40N_2%20%EC%B4%88%EC%9D%B4%EC%8A%A4%20%EB%AC%B8%EC%A0%9C%20A%EB%A1%9C%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D%ED%9B%84%20%EB%8B%AB%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390024/%40N_2%20%EC%B4%88%EC%9D%B4%EC%8A%A4%20%EB%AC%B8%EC%A0%9C%20A%EB%A1%9C%20%EC%9E%90%EB%8F%99%20%EC%84%A0%ED%83%9D%ED%9B%84%20%EB%8B%AB%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        if($('.choiceButton').text()!="다시 투표하기"){
            $('input:first').trigger('click');
            $('.choiceButton').trigger('click');
        }
    }, 400);
    setTimeout (window.close, 800);
})();