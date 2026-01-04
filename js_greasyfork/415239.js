// ==UserScript==
// @name         share跳转KD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在分享页面填写提取码后可跳转至KD
// @author       hello world
// @match        https://pan.baidu.com/share/init?surl=*
// @match        https://pan.kdbaidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415239/share%E8%B7%B3%E8%BD%ACKD.user.js
// @updateURL https://update.greasyfork.org/scripts/415239/share%E8%B7%B3%E8%BD%ACKD.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf('pan.baidu.com') > -1){
        let timer = setInterval(_=>{
            if($('#accessCode').val().length === 4){
                let surl = '1' + window.location.href.split('?surl=')[1];
                let pwd = $('#accessCode').val();
                $('.pickpw').append(`<br><a class='nd-open-page-option KD' href='https://pan.kdbaidu.com/?surl=${surl}&pwd=${pwd}'>跳转至KD网页版</a>`);
                if($('.KD')){
                    console.log('1')
                    clearInterval(timer);
                }
            }
        },1000)
    } else {
        if(window.location.href.indexOf('surl=') > -1 && window.location.href.indexOf('pwd=') > -1){
            $('button').eq(1).hide();
            let surl = window.location.href.split('surl=')[1].split('&')[0];
            let pwd = window.location.href.split('pwd=')[1];
            $('input[name="surl"]').val(surl);
            $('input[name="pwd"]').val(pwd);
            $('button').eq(1).click();
        }
    }
})();