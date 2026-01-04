// ==UserScript==
// @name         法宣在线自动点击视频下一章
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  视频播放完成后自动点击下一章
// @author       AN drew
// @match        *://www.faxuanyun.com/bps/courseware/t/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467690/%E6%B3%95%E5%AE%A3%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%A7%86%E9%A2%91%E4%B8%8B%E4%B8%80%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/467690/%E6%B3%95%E5%AE%A3%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%A7%86%E9%A2%91%E4%B8%8B%E4%B8%80%E7%AB%A0.meta.js
// ==/UserScript==

const action = () => new Promise((resolve, reject) => {
    if($('.psVideo-play-btn.psVideo-stop').length>0) //暂停按钮
    {
        $('.psVideo-play-btn.psVideo-stop').get(0).click();
    }

    if($('#maincontent').find('#psVideo').length==0)//非视频
    {
        $('#maincontent').scrollTop($('#maincontent').prop("scrollHeight"))
        $('#viewerContainer').scrollTop($('#viewerContainer').prop("scrollHeight"))
    }

    return setTimeout(()=>{
        if($('#popwinContent').length>0 && $('#popwinContent>p').text()=='已经是最后一章了')
        {
            window.close();
        }

        if($('#maincontent').find('#psVideo').length>0) //视频
        {
            if($('.psVideo-timeBar').length>0 && $('.psVideo-timeBar').attr('style')!=undefined)
            {
                if(parseInt($('.psVideo-timeBar').attr('style').substring(7))==100)
                {
                    if($('#nextCourse').length>0)
                        $('#nextCourse').get(0).click();
                }
            }
        }
        /*
        else //非视频
        {
            if($('#nextCourse').length>0)
                $('#nextCourse').get(0).click();
        }
        */
        resolve();
    },3000)
})

const actionRecursion = () => {
    action().then(() => {
        setTimeout(actionRecursion, 1000)
    })
}

(function() {
    'use strict';

    actionRecursion();

})();