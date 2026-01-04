// ==UserScript==
// @name         CNMOOC播放器热键
// @namespace    dottorrent.hotkey-for-cnmooc-player
// @version      1.0.2
// @description  为CNMOOC的视频播放(jwPlayer)添加键盘快捷键支持，比如左右键修改进度条、空格播放暂停、上下键增减音量
// @author       .torrent
// @match        https://*.cnmooc.org/study/initplay/*.mooc
// @match        https://*.cnmooc.org/study/unit/*.mooc
// @match        https://cnmooc.org/study/initplay/*.mooc
// @match        https://cnmooc.org/study/unit/*.mooc
// @icon         https://www.cnmooc.org/images/zhitu/icon-sub01.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422545/CNMOOC%E6%92%AD%E6%94%BE%E5%99%A8%E7%83%AD%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/422545/CNMOOC%E6%92%AD%E6%94%BE%E5%99%A8%E7%83%AD%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var debugMode = true;
    var intervalTime = 3000; // 每次检测间隔时间(ms)
    var addTime = 5; // 右键按一次前进时间(s)
    var decTime = 5; // 左键按一次回退时间(s)
    var addVolume = 5; // 上键按一次增加音量(s)
    var decVolume = 5; // 下键按一次减小音量(s)
    var scriptInfo = '[CNMOOC视频键盘快捷键支持] '; // INFO
    if(debugMode) console.debug(scriptInfo + '启用脚本');
    function setKeydownEvent(){
        var playerArea = document.querySelector("#mediaplayer_view span.jwcontrols");
        playerArea.tabIndex = -1; //让播放器元素可被聚焦
        playerArea.focus();
        playerArea.onkeydown = function(event) {
            var e = event || window.event;
            if (e && e.keyCode == 37) {
                //左
                e.preventDefault(); //干掉默认效果，防止按下时页面滚动
                if(debugMode) console.debug(scriptInfo + '左键-进度回退');
                jwObj.seek(jwObj.getPosition() - decTime < 0 ? 0 : jwObj.getPosition() - decTime);
            } else if (e && e.keyCode == 39) {
                //右
                e.preventDefault();
                if(debugMode) console.debug(scriptInfo + '右键-进度前进');
                jwObj.seek(jwObj.getPosition() + addTime > jwObj.getDuration() ? jwObj.getDuration() : jwObj.getPosition() + addTime);
            } else if (e && e.keyCode == 38) {
                //上
                e.preventDefault();
                if(debugMode) console.debug(scriptInfo + '上键-增加音量');
                jwObj.setVolume(jwObj.getVolume() + addVolume > 100 ? 100 : jwObj.getVolume() + addVolume);
            } else if (e && e.keyCode == 40) {
                //下
                e.preventDefault();
                if(debugMode) console.debug(scriptInfo + '下键-降低音量');
                jwObj.setVolume(jwObj.getVolume() - decVolume < 0 ? 0 : jwObj.getVolume() - decVolume);
            } else if (e && e.keyCode == 32) {
                //空格
                e.preventDefault();
                if (jwObj.getState() == 'PAUSED') {
                    if(debugMode) console.debug(scriptInfo + '空格-播放');
                    jwObj.play();
                } else if (jwObj.getState() == 'PLAYING') {
                    if(debugMode) console.debug(scriptInfo + '空格-暂停');
                    jwObj.pause();
                }
            }
        }
    }
    var intervalId = setInterval(function() {
        //每隔time时间检测一次jwPlayer的js是否被加载 && 播放器元素是否已插入
        if(typeof jwObj != 'undefined' && document.querySelector("#mediaplayer_view span.jwcontrols") != null){
            if(debugMode) console.debug(scriptInfo + '检测到jwPlayer已初始化，启用键盘快捷键支持');
            setKeydownEvent();
            //clearInterval(intervalId); //检测成功并设置完按键事件后删除该定时任务 ←不删了
        }
    }, intervalTime);
})();