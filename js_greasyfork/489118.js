// ==UserScript==
// @name         Qihang
// @namespace    http://tampermonkey.net/
// @version      2024-02-24
// @description  iQihang
// @author       You
// @match        https://www.iqihang.com/ark/record/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqihang.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       end
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/489118/Qihang.user.js
// @updateURL https://update.greasyfork.org/scripts/489118/Qihang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        let recordContentTitle = document.querySelector('.record--content--title'); // 顶栏
        let recordSlide = document.querySelector('.record--slide'); // 侧边栏
        let recordSlideTitle = document.querySelector('.record--slide--title'); // 侧边栏 “章节目录”行


        let learnTreeTitle = recordSlide.querySelectorAll('.learn--tree__title');
        let learnTreeSub = recordSlide.querySelectorAll('.learn--tree__sub');
        let learnTreeContent = recordSlide.querySelectorAll('.learn--tree__content');


        // 添加按钮
        let buttonSpan = document.createElement('span');
        buttonSpan.className = 'scriptSpan';
        buttonSpan.innerHTML = `
            <button class="scriptButton unFoldButton">展开全部视频</button>
            <button class="scriptButton foldButton">折叠全部视频</button>
            <button class="scriptButton videoInfoButton">输出视频信息</button>
        `;
        recordContentTitle.appendChild(buttonSpan);

        // 添加按钮事件
        document.querySelector('.foldButton').onclick = function() {foldAllTab();}
        document.querySelector('.unFoldButton').onclick = function() {unFoldAllTab();}
        document.querySelector('.videoInfoButton').onclick = function() {showAllVideoInfo();}



        // 展开全部
        function unFoldAllTab() {
            for (let i = 0; i < learnTreeSub.length; i++) {
                learnTreeSub[i].style.display = '';
            }
        }


        // 折叠全部
        function foldAllTab() {
            for (let i = 0; i < learnTreeSub.length; i++) {
                learnTreeSub[i].style.display = 'none';
            }
        }


        // 显示全部视频信息
        function showAllVideoInfo() {
            let messageList = [];
            let watchedVideoTime = 0;
            let sumVideoTime = 0;
            for (let i = 1; i < learnTreeContent.length + 1; i++) {
                let title = learnTreeContent[i-1].querySelector('.title-text').innerText;
                let vDuration = learnTreeContent[i-1].querySelector('.vDuration').innerText;
                let progress = learnTreeContent[i-1].querySelector('.progress-bar--text');
                sumVideoTime += strTimeToSec(vDuration);
                if (progress) {
                    progress = progress.innerText;
                    messageList.push('[' + i + '] ' + progress + ' ' + title + ' -- ' + vDuration + '\n');
                    if (progress == '已学习100%') {watchedVideoTime += strTimeToSec(vDuration);}
                }
                else {messageList.push('[' + i + '] ' + title + ' -- ' + vDuration + '\n');}
            }
            messageList.push('----------')
            messageList.push('已学习：' + watchedVideoTime + 's / 未学习：' + sumVideoTime + 's');
            messageList.push('已学习：' + secToStrTime(parseInt(watchedVideoTime)) + ' / 未学习：' + secToStrTime(parseInt(sumVideoTime)));
            messageList.push('已学习百分比：' + 100*watchedVideoTime/sumVideoTime +'%');
            showMessage('视频信息', messageList);
        }


        function showMessage(title, infoList) {
            backgroungBlur()

            let scriptMessageDiv = document.createElement('div');
            scriptMessageDiv.className = 'scriptMessageDiv';
            scriptMessageDiv.innerHTML = '<h2>' + title + '</h2><hr>';
            for (let i = 0; i < infoList.length; i++) {
                scriptMessageDiv.innerHTML = scriptMessageDiv.innerHTML + '<p>' + infoList[i] + '</p>';
            }
            scriptMessageDiv.innerHTML = scriptMessageDiv.innerHTML + '<button class="closeScriptMessageDiv">关闭</button>';
            document.body.appendChild(scriptMessageDiv);
            document.querySelector('.closeScriptMessageDiv').onclick = function() {document.querySelector('.scriptMessageDiv').remove();backgroungBlur();}
        }


        function strTimeToSec(strTime) {
            // strTime: xx:xx:xx or xx:xx
            let timeList = strTime.split(':');
            if (timeList.length == 2) {
                return parseInt(timeList[0])*60 + parseInt(timeList[1]);
            }
            else if (timeList.length == 3) {
                return parseInt(timeList[0])*3600 + parseInt(timeList[1])*60 + parseInt(timeList[2]);
            }
            else {return 'ERROR'}
        }

        function secToStrTime(sec) {
            if(sec < 3600) {
                let m = parseInt(sec/60);
                let s = (sec-(parseInt(sec/60))*60);
                return m + '分' + s + '秒'
            }
            else {
                let h = parseInt(sec/3600);
                let m = parseInt((sec-h*3600)/60);
                let s = parseInt(sec- h*3600 - m*60)
                return h + '时' + m + '分' + s + '秒';
            }
        }


        // 背景模糊函数，使用try避免因小错误导致脚本失效
        function backgroungBlur() {
            try {
                let targetArea = document.querySelector('.app-content');
                targetArea.style.transition = '0.2s';
                targetArea.style.filter == '' ? targetArea.style.filter = 'blur(10px)' : targetArea.style.filter = '';

            } catch(err) {
                console.log(GM_info.script.name + "：设置背景模糊或背景滚动失效");
            }
        }


        GM_addStyle(`
            .feedback-icon {
                display: none;
            }

            div.scriptMessageDiv {
                transition: 0.2s;
                position: fixed;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-size: large;
                height: 80%;
                width: 80%;
                left: 50%;
                top: 50%;
                padding: 20px;
                transform: translate(-50%, -50%);
                background-color: aliceblue;
                border: solid lightgray 1px;
                border-radius: 8px;
                z-index: 9999;
                overflow: scroll;
            }

            div.scriptMessageDiv h2 {
                font-size: xx-large;
            }

            div.scriptMessageDiv p {
                margin: 10px;
            }

            .scriptSpan {
                float: right;
                font-
            }

            .scriptButton {
                margin: 2px;
                border: solid 2px #ffffff;
                border-radius: 5px;
                background: none;
                color: white;
            }
        `)

    }, 1000)

})();