// ==UserScript==
// @name         焦作专业技术人员继续教育
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  焦作专业技术人员继续教育自动学习
// @author       You
// @match        http://www.jzjxjy.cn/kjlearn/ktjs/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476860/%E7%84%A6%E4%BD%9C%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/476860/%E7%84%A6%E4%BD%9C%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timeFormat = (seconds)=> {
        var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60);
        var s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
        return m + ":" + s;
    }

    const button4 = document.getElementById('Button4')
    console.log(button4)
    if(button4 && button4.value=='学习'){
        setTimeout(()=>{
            const video = document.getElementById('videozxkt')
            console.log(video)
            console.log(video.duration)
            const seconds = video.duration
            console.log(timeFormat(seconds))

            const roomid = window.location.pathname.replace('/kjlearn/ktjs/','').replace('/1.aspx','')
            const time = parseInt(seconds);
            const learntime = time + Math.floor(Math.random() * 100)

            $.ajax({
                url: "/tools/submit_ajax.ashx?action=zxkthf&time="+(new Date()),
                type: "get",
                data:{
                    learntime:learntime,
                    roomid:roomid,
                    playHeadTime:time
                },
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    if (data.msg == 1) {
                        console.log('success')

                    } else if (data.msg == 0) {

                    }
                },
                error: function (data) {
                }
            });
        },2000)
    }
})();