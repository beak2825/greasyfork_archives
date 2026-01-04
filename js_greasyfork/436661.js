// ==UserScript==
// @name         法宣在线10分钟自动结束学习
// @namespace    http://tampermonkey.net/
// @version      0.1.5.1
// @description  10分钟自动结束学习
// @author       AN drew
// @match        *://*.faxuanyun.com/sps/courseware/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436661/%E6%B3%95%E5%AE%A3%E5%9C%A8%E7%BA%BF10%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%BB%93%E6%9D%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/436661/%E6%B3%95%E5%AE%A3%E5%9C%A8%E7%BA%BF10%E5%88%86%E9%92%9F%E8%87%AA%E5%8A%A8%E7%BB%93%E6%9D%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        if($('#inBtnDiv a').length>0)
            $('#inBtnDiv a').get(0).click();
        if($('#prompt2 a').length>0)
            $('#prompt2 a').get(0).click();
    },3000);

    setInterval(function(){
        var time = $('#ware_time_num').text().split(':');
        if(time[1]>=10 && $('#popwin').length==0)
        {
            $('#exitCourse').get(0).click();
            setTimeout(function(){
                if($('#exitBtnDiv > a.pms-newspoint-btn:nth-child(2)').length>0)
                    $('#exitBtnDiv > a.pms-newspoint-btn:nth-child(2)').get(0).click();
                if($('#popwinConfirm.tanchu_btn01').length>0)
                    $('#popwinConfirm.tanchu_btn01').get(0).click();
            },3000);
        }

        var timer = $('#timer').text().split(':');
        if(timer[1]>=10 && $('#popwin').length==0)
        {
            $('#mainyemian2 > div.lessoncontainer > div.timebtn.clear > a').get(0).click();
            setTimeout(function(){
                if($('#exitBtnDiv > a.pms-newspoint-btn:nth-child(2)').length>0)
                    $('#exitBtnDiv > a.pms-newspoint-btn:nth-child(2)').get(0).click();
                if($('#popwinConfirm.tanchu_btn01').length>0)
                    $('#popwinConfirm.tanchu_btn01').get(0).click();
            },3000);
        }
    },100);

    /*
    //自动点击未学习课程的第一个课程
    let t = setInterval(function(){
        $('#kejmc-box-id li a').each(function(){
            if($(this).text().indexOf('开始学习')>-1)
            {
                $(this).get(0).click();
                clearInterval(t);
            }
        })
    },1000);
    */

})();
