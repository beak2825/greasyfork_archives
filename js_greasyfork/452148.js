// ==UserScript==
// @name         運輸署預約-0730準時進入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  當網頁位置在https://www.gov.hk/tc/residents/transport/drivinglicense/roadtest.htm, 在早上07:30,準時進入運輸署預約系統排隊
// @author       You
// @match        https://www.gov.hk/tc/residents/transport/drivinglicense/roadtest.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452148/%E9%81%8B%E8%BC%B8%E7%BD%B2%E9%A0%90%E7%B4%84-0730%E6%BA%96%E6%99%82%E9%80%B2%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/452148/%E9%81%8B%E8%BC%B8%E7%BD%B2%E9%A0%90%E7%B4%84-0730%E6%BA%96%E6%99%82%E9%80%B2%E5%85%A5.meta.js
// ==/UserScript==

var now=new Date(),
    then=new Date(),
    diff;
    then.setHours(07);
    then.setMinutes(29);
    then.setSeconds(58);
    diff=then.getTime()-now.getTime();

    //
    if(diff<=0){}

    //
    else{
     window.setTimeout(function(){window.location = "https://eapps-queue.td.gov.hk/?c=transportdep&e=retasprod&t=https%3A%2F%2Feapps.td.gov.hk%2Frepoes%2Fapp517_tc.html&cid=en-US";},diff);
    }