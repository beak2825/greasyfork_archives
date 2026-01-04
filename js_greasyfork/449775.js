// ==UserScript==
// @name         腾讯云-合作伙伴学堂 - 自动学习外挂
// @version      1.4
// @description  此插件的目的是为了实现用户在<腾讯云-合作伙伴学堂>能够自动挂机学习, 插件会自动点击 <播放>, <静音>, <恢复播放进度>, <确认>, <下一课>按钮。目前已知的问题如下: 1.有时候由于学习窗口处于不活跃状态, 所以插件的功能可能会无法触发; 2.此插件只能自动挂机当前章节下的所有课程, 如果用户希望学习其他章节的内容, 需要手动切换章节.
// @match        https://cloudpartner.lexiangla.com/classes/*
// @match        https://cloudpartner.lexiangla.com/teams/*
// @match        https://cloud.tencent.com/edu/learning/*
// @match        https://lexiangla.com/teams/*
// @author       CapSnake
// @namespace    https://greasyfork.org/zh-CN/users/200326-snake-cap
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449775/%E8%85%BE%E8%AE%AF%E4%BA%91-%E5%90%88%E4%BD%9C%E4%BC%99%E4%BC%B4%E5%AD%A6%E5%A0%82%20-%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/449775/%E8%85%BE%E8%AE%AF%E4%BA%91-%E5%90%88%E4%BD%9C%E4%BC%99%E4%BC%B4%E5%AD%A6%E5%A0%82%20-%20%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUnsafeWindow() {
        if (this) {
            //console.log(this);
            if (typeof(this.unsafeWindow) !== "undefined") { //Greasemonkey, Scriptish, Tampermonkey, etc.
                return this.unsafeWindow;
            } else if (typeof(unsafeWindow) !== "undefined" && this === window && unsafeWindow === window) { //Google Chrome natively
                var node = document.createElement("div");
                node.setAttribute("onclick", "return window;");
                return node.onclick();
            }
        } else { //Opera, IE7Pro, etc.
            return window;
        }
    }

    var myUnsafeWindow = getUnsafeWindow();

    var processTimer = null;
    var cntRetry = 0;
    myUnsafeWindow.clearInterval(processTimer);
    // 每隔5秒检测一次
    processTimer = myUnsafeWindow.setInterval(TimeProcess, 5000);

    // 检测函数
    function TimeProcess() {
        // 播放按钮表示时，点击按钮
        var playDiv = $(".vjs-big-play-button");
        //console.log("playDiv:", playDiv);
        if (playDiv.length > 0 && playDiv.css('display') != 'none') {
            console.log('点击播放');
            //playBtn.click();
            var playBtn = $("#learn-video-player_html5_api");
            //console.log("playBtn:", playBtn);
            playBtn.get(0).play();
        }

        // 设置播放器静音
        var muteBtn = $(".vjs-mute-control.vjs-control.vjs-button.enable-volume-control");
        //console.log('muteBtn:', muteBtn);
        if (muteBtn.length > 0 && muteBtn.css('display') != 'none') {
            var title = muteBtn.attr("title");
            //console.log('title:', title);
            if (title.length > 0 && title != '取消静音') {
                console.log('点击静音');
                $("#learn-video-player_html5_api").prop('muted', true);
            }
        }

        // 恢复播放按钮表示时，点击按钮
        var continuePlayBtn = $(".tcp-continue-play-buttom");
        //console.log(continuePlayBtn);
        if (continuePlayBtn.length > 0 && continuePlayBtn.css('display') != 'none') {
            console.log('点击恢复播放');
            continuePlayBtn.click();
        }

        // 确定按钮表示时，点击按钮
        var confirmBtn = $(".venom-btn.venom-btn-primary");
        //console.log(confirmBtn);
        if (confirmBtn.length > 0 && confirmBtn.css('display') != 'none') {
            console.log('点击确定');
            confirmBtn.click();
        }

        // 下一课按钮表示时，点击按钮
        var nextClassBtn = $("a.blue.ml-m");
        //console.log(nextClassBtn);
        if (nextClassBtn.length > 0 && nextClassBtn.css('display') != 'none') {
            console.log('点击下一课');

            var marker = '<span id = "marker"></span>';
            nextClassBtn.append(marker);
            //console.log('marker:', $('#marker'));
            $('#marker').click();
        }
    }
})();