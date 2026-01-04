// ==UserScript==
// @name         運輸署Time 07:29:59" to click the "I am not robot"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Time 07:29:59" to click the "I am not robot"
// @author       You
// @match        https://eapps-queue.td.gov.hk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452147/%E9%81%8B%E8%BC%B8%E7%BD%B2Time%2007%3A29%3A59%22%20to%20click%20the%20%22I%20am%20not%20robot%22.user.js
// @updateURL https://update.greasyfork.org/scripts/452147/%E9%81%8B%E8%BC%B8%E7%BD%B2Time%2007%3A29%3A59%22%20to%20click%20the%20%22I%20am%20not%20robot%22.meta.js
// ==/UserScript==


var now=new Date(),
    then=new Date(),
    diff;
    then.setHours(07);
    then.setMinutes(29);
    then.setSeconds(59);
    diff=then.getTime()-now.getTime();

    //
    if(diff<=0){}

else{
    setTimeout(function(){document.querySelector("#challenge-container > button").click()}
               ,diff);
}
