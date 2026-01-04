// ==UserScript==
// @name         重庆继续教育选修小节自动播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  只支持选修小节自动播放
// @author       moxiaoying
// @match        http://chinaredstar.21tb.com/els/html/index.parser.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396807/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E9%80%89%E4%BF%AE%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/396807/%E9%87%8D%E5%BA%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E9%80%89%E4%BF%AE%E5%B0%8F%E8%8A%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
//     var org_text = $('.cl-catalog-playing').text();
    var url = 'http://chinaredstar.21tb.com/els/html/index.parser.do?host=&vbox_server=http://chinaredstar.21tb.com/els/html/index.parser.do?id=NEW_COURSE_CENTER&sourceType=WIDGET&current_app_id=8a80810f5ab29060015ad1906d0b3811#!%2Fels%2Fhtml%2FcourseCenter%2FcourseCenter.loadStudyTask.do'
    var data = 'scoId=' + info.scoId +'&courseId=' + info.courseId + '&firstLoad=true&location=2348.1&elsSign=elnSessionId.5fdbc05182394b04be959d211d6d419d&current_app_id='
    $.ajax({
        url: url,
        data: data,
        async: false,
        type: 'post',
        dataType: 'json',
        success: function(data){
            console.log(parseInt(data.minStudyTime));
            setTimeout(function(){
               window.location.reload();
            },1000*60*parseInt(data.minStudyTime));
        },
        error: function(d){
            setInterval(function(){
                //         var now_text = $('.cl-catalog-playing').text();
                var min_time = parseInt($('#minStudyTime').text());
                var studied_time =  parseInt($('#studiedTime').text());
                if(min_time-studied_time<=1){
                    window.location.reload();
                }
                console.log('studied_time:'+studied_time+'min_time:'+min_time);
            }, 1000*60);
        }
    });
    // Your code here...
})();