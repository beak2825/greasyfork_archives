// ==UserScript==
// @name         职业技能刷课
// @namespace    http://tampermonkey.net/
// @namespace    https://www.bjjnts.cn/lessonStudy/398/7605
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bjjnts.cn/lessonStudy/*/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409741/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/409741/%E8%81%8C%E4%B8%9A%E6%8A%80%E8%83%BD%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var next = getNextCourse()

    console.log("next===:", next)

    $.post("/lessonStudy/" + 398 + "/" + next.shouldId, {},function(data){
      console.log("初始化===:", data)
    });

    sendUpdate(next.duration, 100, 3000)
    for(let i = 3; i > 0 ; i -- ){
       sendUpdate(next.shouldId, 1000 * (next.duration / i), 2000)
    }

    setTimeout(function (){
       window.location.href = 'https://www.bjjnts.cn/lessonStudy/398/7605'
    }, 6000);


})();

function sendUpdate(id, time, dura){
    setTimeout(function (){
        $.post("/addstudentTaskVer2/" + 398 + "/" + id, { "learnTime": time,"push_event":"update" },function(data){
            console.log("开始刷===:", data)
            if(data && data.msg && data.msg.indexOf('8小时') > -1){
                alert("兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！兄弟，明天再来吧！" + data.msg)
            }
        });
    }, dura);
}


function getNextCourse(){
    var menus = $('.new_demoul li')
    let shouldId = ''
    let duration = ''
    $('.new_demoul li').each(function(i,v){
        var item = $(v)
        var percent = item.find('em').html()
        if(percent.indexOf('100%') == -1){
            shouldId = item.find('a')[0].getAttribute('data-lessonid')
            duration = item.find('.course_study_menudate')
            duration = duration.html().match(/:(.*):/)[1]
            duration = Number(duration) + 1
            return false;
        }
    })
    return {
        shouldId,
        duration
    }
}