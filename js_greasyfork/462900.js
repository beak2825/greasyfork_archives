// ==UserScript==
// @name         超新学习助手，简单免费
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动跳到下一节，简单免费，不会答题
// @author       bingkx
// @match        http://*.chaoxing.com/mycourse/studentstudy?*
// @match        */mycourse/studentstudy?*
// @match        *.chaoxing.com/mooc-ans/mycourse/studentstudy?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @run-at       document-end
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/462900/%E8%B6%85%E6%96%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%8C%E7%AE%80%E5%8D%95%E5%85%8D%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462900/%E8%B6%85%E6%96%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%8C%E7%AE%80%E5%8D%95%E5%85%8D%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.playMyVideo=function(i) {
        if (videoAutoPlay == 0) {
            return;
        }
        var iframeArr = $("#iframe").contents().find("iframe.ans-insertvideo-online");
        var iframeItem = iframeArr[i];
        $(iframeItem).contents().find(".vjs-big-play-button").click();
    }

   window.checkMyJob=function() {
        $("#jobFinishTip").hide();
        var jobDiv = $("#iframe").contents().find(".ans-job-icon");
        for (var i=0;i<jobDiv.length; i++){
            if(!$(jobDiv[i]).parent().hasClass("ans-job-finished")){
                return i;
            }
        }
        return -1;
    }
    alert=function (){}; //取消弹出窗口提示
    window.checkEnd=function(){
        autoCheckTime+=1;
        var check=checkMyJob();
        if (check==-1){
            var sta=JSON.parse($("#_studystate").val().replace("nextChapterId","\"nextChapterId\"").replace("unfinishCount","\"unfinishCount\""));
            var nextChapterId=sta.nextChapterId;
            var curCourseId=$("#curCourseId").val();
            var curChapterId=$("#curChapterId").val();
            var curClazzId=$("#curClazzId").val();
            if(nextChapterId){
                getTeacherAjax(curCourseId,curClazzId,nextChapterId)
            }
        }else{
            playMyVideo(check);
        }
    }
    window.autoCheckTM=setInterval(checkEnd, 60*1000);
    window.autoCheckTime=0;
    videoAutoPlay=1;
})();

