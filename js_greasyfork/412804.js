// ==UserScript==
// @name         우푸푸푸푸푸
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.yuhan-kimberly.co.kr/Campaign/ForestquizProc*
// @match        https://www.yuhan-kimberly.co.kr/Campaign/ForestquizPreJoin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412804/%EC%9A%B0%ED%91%B8%ED%91%B8%ED%91%B8%ED%91%B8%ED%91%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/412804/%EC%9A%B0%ED%91%B8%ED%91%B8%ED%91%B8%ED%91%B8%ED%91%B8.meta.js
// ==/UserScript==

if (/\/Campaign\/ForestquizPreJoin/.test (location.pathname) ) {
    quizJoin();
}
else {
    var str = $('.question').text();
    var qval = $('input[name=F_QNO]').val();
    var cnt = str.indexOf("프로젝트 25주년 광고 문구이다. 괄호 안에 들어갈 단어");
    if(qval == 1 && cnt<0){
        location.href = 'https://www.yuhan-kimberly.co.kr/Campaign/ForestquizPreJoin';
    } else{
        var ans = [2,1,3,2,1,1,4,2,1,1,3,3,1,2,4,2,1,4,3,3];
        setChecked(ans[qval-1]);
        goSearchPre();
    }
}