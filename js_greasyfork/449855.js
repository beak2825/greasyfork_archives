// ==UserScript==
// @name          职培云刷课-公测
// @namespace     http://tampermonkey.net/
// @version       0.2.3
// @description   自动进入未学习课程，自动静音播放，完成后自动进入下一个未学
// @author        Dominic
// @match         https://px.class.com.cn/player/*
// @match         https://px.class.com.cn/study/*
// @match         *.ataclass.cn/player/*
// @match         *.ataclass.cn/study/*
// @icon          https://a66ab57a.ataclass.cn/favicon.ico
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/449855/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE-%E5%85%AC%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449855/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE-%E5%85%AC%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    /* 获取页面的url */
    var url = window.location.href;
    /* 有未完成的课程，自动进入视频 */
    if (url.indexOf('study/myclass/index') != -1) {
        var unfinished = document.getElementsByClassName('class-list-box')[0]
        .getElementsByClassName('unfinished');
        if (unfinished.length > 0) {
            for (var i = 0; i < unfinished.length; i++) {
                var testStatus = unfinished[i]
                .getElementsByClassName('test-status')[0]
                .getElementsByTagName('span')[1]
                .innerText != '（ 未开放 ）';
                if (testStatus) {
                    /*进入课程*/
                    unfinished[i].getElementsByClassName('toStudy')[0].click();
                    break;
                }
                console.log('testStatus: ', testStatus);
            }
        }
        /* 课程已学完或无开放学习课程，返回班级 */
    } else if (url.indexOf('study/myclass/course') != -1) {
        /* 未测试 */
        var finish_no =
            document.getElementsByClassName('list-box')[0].getElementsByClassName(
                'finish-no');
        if (finish_no.length > 0) {
            /* 进入视频 */
            finish_no[1].getElementsByTagName('button')[0].click();
        } else {
            /* 返回班级 */
            document.getElementsByClassName('text-header')[0]
                .getElementsByTagName('a')[0]
                .click();
        }
    } else {
        /* 加载插件 */
        function loadPlugin() {
            /* 视频嵌套标签 */
            var myIframe = document.getElementsByClassName('cell')[0].querySelector('iframe').contentWindow.document;
            /* 分 */
            var minute = -1;
            /* 秒 */
            var second = 0;
            /* 时间 */
            var totalTime = myIframe.getElementsByClassName('duration')[0].innerText.split(':');
            minute = totalTime[0];
            second = totalTime[1];
            var plugin = document.createElement('div');
            plugin.style = 'position:fixed;top:20px;left:30%;background-color: #ba77ed;align="center";height:20px;vertical-align:middle;line-height:20px;';
            plugin.innerHTML = `<p>视频总长 ${minute}分 ${second}秒，已开启自动静音播放 <a href="https://www.cnblogs.com/dominickk/" target="_Blank">   🌹脚本作者 @Dominic🌹</a></p>`;
            document.body.append(plugin);
            /* 静音 */
            myIframe.getElementsByTagName('video')[0].muted = true;
        }
        /* 检查状态 */
        function autoCheck() {
            /* 刷新状态：0未学习 1学习中 2已学习 */
            var studyStatus = -1;
            $.ajax({
               url: location.href,
                type: "GET",
                async: false,
                success: function (data) {
                    data = data.match(/hiddenStudyStatus.*?(\d).*?>/)
                    $('#hiddenStudyStatus').val(data[1]);
                    studyStatus = data[1];
                    console.log("studyStatus:", studyStatus);
                }
            });
            if (studyStatus == '2') {
                console.log('autoCheck:',true);
                return true;
            } else {
                console.log('自动检查：未看完');
                return false;
            }
        }
        /* 自动播放 */
        function autoPlay() {
            var myIframe = document.getElementsByClassName('cell')[0].querySelector('iframe').contentWindow.document
            var playBtn = myIframe.getElementsByClassName('prism-big-play-btn')[0];
            if (playBtn.style.display == 'block') {
                /* 静音 */
                myIframe.getElementsByTagName('video')[0].muted = true;
                playBtn.click();
            }
        }
        function isPause(){
            var myIframe = document.getElementsByClassName('cell')[0].querySelector('iframe').contentWindow.document
            var playBtn = myIframe.getElementsByClassName('prism-big-play-btn')[0];
            if (playBtn.style.display == 'block') {
                return true;
            }
            return false;
        }
        function goBack(){
            document.getElementsByClassName('btn-back')[0].getElementsByTagName('a')[0].click();
        }
        /* 延时启动 */
        setTimeout(function () {
            try{
                loadPlugin();
            } catch (err) {
                alert('🌹 插件加载异常，可能网络不佳，可通过手动暂停视频解决 🌹');
            }
        }, 5000)
        /* 定时启动 */
        setInterval(function() {
            if (isPause()){
                loadPlugin();
                if (autoCheck()) {
                    goBack();
                } else {
                    autoPlay();
                }
            }
        }, 3000)
    }
})();