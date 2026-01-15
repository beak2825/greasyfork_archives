// ==UserScript==
// @name         neituiya
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  刷题网页调整
// @author       onionycs
// @license MIT
// @match        https://www.neituiya.com/oj/*
// @match        https://www.sspnote.com/oj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sspnote.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/502407/neituiya.user.js
// @updateURL https://update.greasyfork.org/scripts/502407/neituiya.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */
    console.log('sspnote javaer start');
    var fbutton= $('#semiTabdetail');
    $('<button class="open-answer">打开题解</button>').insertBefore(fbutton);

    $('.open-answer').click(function() {
        $('#semiTabanswer')[0].click();
        $('.answer-note').find('a')[3].click();
        setTimeout(function(){
            fbutton[0].click();
        },1000);
    });
    setTimeout(function() {
            console.log('延迟1000ms...');
        adjust();
    }, 1000);



    function adjust() {

        console.log("start");
        $('div[role="combobox"]')[0].click();
        var id=$('div[role="combobox"]')[0].id+'-option-6';
        setTimeout(function() {
            // 这里写你希望延迟执行的代码
            console.log('执行了延迟300ms的代码');
            $('#'+id)[0].click();
        }, 500);
        document.getElementsByClassName("left-content")[0].style.width = "40%";
        document.getElementsByClassName("right-content")[0].style.width = "60%";
        console.log("end");
        $('img[alt="image"]')[0].style.maxWidth="30%";

    }

    
})();