// ==UserScript==
// @name         사이다 행운 로도 자동 응모
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @include      https://saidalotto.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/25049/%EC%82%AC%EC%9D%B4%EB%8B%A4%20%ED%96%89%EC%9A%B4%20%EB%A1%9C%EB%8F%84%20%EC%9E%90%EB%8F%99%20%EC%9D%91%EB%AA%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/25049/%EC%82%AC%EC%9D%B4%EB%8B%A4%20%ED%96%89%EC%9A%B4%20%EB%A1%9C%EB%8F%84%20%EC%9E%90%EB%8F%99%20%EC%9D%91%EB%AA%A8.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function(){
        if(!$('.shadow:visible').length && $('a[onclick*="event_start()"]:visible').length){
            $('a[onclick*="event_start()"]:visible').get(0).click();
        }
        var lock1 = false;
        var lock2 = false;
        setInterval(function(){
            /**/
            if(lock2 == false && $('a[onclick*="saida_lotto_run()"]:visible').length){
                console.log('test1');
                lock2 = true;
                $('a[onclick*="saida_lotto_run()"]:visible').get(0).click();
            }
            /**/
            if($('a[onclick*="step01_pass()"]:visible').length){
                console.log('test2');
                $('a[onclick*="step01_pass()"]:visible').get(0).click();
            }
            if($('#alert_pop_btn:visible').length){
                $('#alert_pop_btn:visible').get(0).click();
            }
            if(lock1 == false && $('.friend-item:visible').length){
                console.log('test3');
                lock1 = true;
                $('.friend-item:visible').trigger('click');
            }
        }, 10);
    });
    window.addEventListener('load', function(){
    });
})();