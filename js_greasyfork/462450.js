// ==UserScript==
// @name         温州继续教育学习助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动跳过弹窗，静音
// @author       bingkx
// @match        https://www.wzjxjy.cn/course-section-video-play?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wzjxjy.cn
// @grant        none
// @run-at       document-end
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/462450/%E6%B8%A9%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462450/%E6%B8%A9%E5%B7%9E%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.oldOpenDlg=openDialog;
    window.oldAlert=alert;
    function myDlg(){
        var ct = player.currentTime()//当前播放时长
        var tt = player.duration()//视频总时长
        let lt = learningTime // 当前学习时间默认为上次记录的学习时间
        if (ct > lt) {
          lt = ct // 如果当前学习时间大于上次记录的学习时间，则覆盖
        }
        ModifyListeningSignUpCourseSection(lt, tt, 0)
    };
    function myAlert(e){
        if (e=="学习完成，谢谢观看！"){ //下一节
            //oldAlert("转下一节，如果存在的话！");
            var oldURL=window.location.href;
            var idx=oldURL.indexOf("csecID=")+7;
            var secId=parseInt(oldURL.substring(idx))+1;
            var newURL=oldURL.substring(0, idx)+secId;
            window.location.href=newURL;
        }
        else{
            oldAlert(e);
        }
    }
    openDialog=myDlg;
    alert=myAlert;
    player.volume(0);
    if (player.paused()){ //自动开始
        player.play();
    }
})();