// ==UserScript==
// @name         bjjnts helper
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动点击确定，在视频播放完成后自动点击下一个视频。
// @author       whlsbc
// @match        https://www.bjjnts.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406204/bjjnts%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406204/bjjnts%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var confirm = $('a:contains(确定)');
        //console.log('check...');
        if(confirm.length > 0){
            confirm.click();
            console.log('click...');
        }

        if($('#studymovie').length ==1){
            $('#studymovie')[0].play()
        }

    },3000);

    $('.course_study_videobox video').on('ended',function(){
        console.log('redirect...');
        var next = $('.on').parent('li').next().find('a').attr('href');
        if(next){
            setTimeout(function(){
                location.href =$('.on').parent('li').next().find('a').attr('href')
            },3000);
        }
    });

    if($('#studymovie').length ==1){
        $('#studymovie')[0].play()
    }

})();