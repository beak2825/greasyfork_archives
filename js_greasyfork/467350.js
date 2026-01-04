// ==UserScript==
// @name         中国干部网络培训
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoplay
// @author       Hui
// @license      AGPL License
// @match        https://cela.gwypx.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gwypx.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467350/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/467350/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        if(window.location.href.includes('student/my_course.do?')){
            if(document.querySelector('.h_pro_percent').innerText!="100.00%"){
                const aElements = document.getElementsByTagName("a");

                const onclickAttributeValue = aElements[20].getAttribute("onclick");

                if (onclickAttributeValue && onclickAttributeValue.includes("addUrl")) {
                    console.log(onclickAttributeValue);
                }
                window.location.href="https://cela.gwypx.com.cn/portal/playnew.do?menu=course&id="+onclickAttributeValue.match((/\d+/g))}}
        if(window.location.href.includes('playnew.do?')){
            if(window.frames['t'].document.querySelector('video').paused){window.frames['t'].document.querySelector('video').play();}
            const frames = window.frames;
            for (let i = 0; i < frames.length; i++) {
                const videos = frames[i].document.getElementsByTagName("video");
                for (let j = 0; j < videos.length; j++) {
                    if (!videos[j].paused) {
                        videos[j].pause();
                    }
                    videos[j].currentTime = 0;
                    videos[j].play();
                }
            }
            var Load_Title

            //if(window.frames['course_frm'].document.querySelector('video').paused){window.frames['course_frm'].document.querySelector('video').play();}
            if(window.frames['t'].document.querySelector('.course_name')){Load_Title=window.frames['t'].document.querySelector('.course_name').innerText}
            //if(window.frames['course_frm'].document.querySelector('.course_name')){Load_Title=window.frames['course_frm'].document.querySelector('.course_name').innerText}
            const url = 'https://cela.gwypx.com.cn/student/my_course.do?menu=course&searchType=2';
            var numfinish
           setInterval($.ajax({
                type: 'GET',
                url: url,
                success: function(data) {
                    const textContentArray = [];

                    // 寻找所有className为"hoz_course_row"的元素

                    $(data).find('.hoz_course_row').each(function() {
                        if($(this).text().includes(Load_Title)){
                            //if(textContentArray.includes(Load_Title)){
                            $(this).find('.h_pro_percent').each(function() {
                                textContentArray.push($(this).text());
                            })
                        }
                    });
                    numfinish=textContentArray.toString();
                    console.log(textContentArray);
                    console.log(numfinish);
                    if(numfinish=='100.0%'){window.location.href="https://cela.gwypx.com.cn/student/my_course.do?searchType=1&menu=course";}
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Error: ' + textStatus + ' - ' + errorThrown);
                    // 在控制台输出错误信息
                }
            }),60*10*1000);
        }
    },10000)
    // Your code here...
})();