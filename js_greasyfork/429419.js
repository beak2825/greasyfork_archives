// ==UserScript==
// @name         潍坊职业培训视频快进
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  潍坊职业培训视频快进，可快速完成视频观看
// @author       You
// @match        https://www.wfjtip.com/lessondetail*
// @icon         https://www.google.com/s2/favicons?domain=wfjtip.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/429419/%E6%BD%8D%E5%9D%8A%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/429419/%E6%BD%8D%E5%9D%8A%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

unsafeWindow.window.updatetime=function(isFinished) {
            console.log("my update");

            unsafeWindow.window.$.ajax({
                url: "/lesson/modifyplaybacktime",
                type: "post",
                data: {
                    playbacktime: Math.floor(unsafeWindow.window.player.currentTime() * 1000),
                    lessonid:unsafeWindow.window.$("#sub_title").attr("data"),
                    finish: isFinished
                },
                beforeSend: function (xhr) {

                },
                success: function (result) {
                   unsafeWindow.window.backtime = unsafeWindow.window.player.currentTime()
                }
            });

        }


function toEnd(){
    var endpoint = unsafeWindow.window.lessonSupervisedInfo.lessonMediaDuration;
    console.log(endpoint);
   unsafeWindow.window. player.currentTime(endpoint/1000-5);
    unsafeWindow.window.player.playbackRate(12);
   unsafeWindow.window. player.play();
}
    toEnd();
})();