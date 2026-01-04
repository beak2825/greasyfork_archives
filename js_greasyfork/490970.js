// ==UserScript==
// @name         乐课网助手
// @version      2.0.1
// @author       1208nn
// @namespace    https://gist.github.com/1208nn/c39d88ffca57d3a602f6aa740ba978b1
// @description  用于乐课网录播课学习任务，选择用户脚本管理器右键菜单中快速完成课程选项即可，仅限学习交流，后果一概不负责，计划3.0可在课程目录批量操作，后期随时可能加入错误检测报告功能，日志提示功能，成功后提示功能
// @match        https://www.letaoedu.com/page/lt/weike/play?*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @connect      https://file.leke.cn/*
// @connect      https://www.letaoedu.com/*
// @downloadURL https://update.greasyfork.org/scripts/490970/%E4%B9%90%E8%AF%BE%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490970/%E4%B9%90%E8%AF%BE%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const courseID = parseInt(urlParams.get('courseId'));
    const cwId = urlParams.get('stuCwid');
    const gcId = urlParams.get('stuCid');

    GM_registerMenuCommand('快速完成课程', async function () {
        function getMilliseconds() {
            const durationElement = document.querySelector('.duration');
            const durationText = durationElement.textContent;
            const [minutes, seconds] = durationText.split(':');
            const durationInMillis = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
            return durationInMillis;
        }
        const Duration = getMilliseconds();
        const reportTime = Date.now();
        const userId = INITSTATE.userInfo.userId;
        const userName = INITSTATE.userInfo.userName;

        const requestData1 = {
            courseId: courseID,
            courseType: 2,
            watchId: cwId,
            watchPosition: Duration,
            reportTime: reportTime
        };
        const requestData2 = {
            cwId: cwId,
            duration: Duration,
            userId: userId
        };

        class FetchRequests {
            constructor(URL, method, data) {
                this.URL = URL;
                this.method = method;
                this.data = data;
                this.headers = {
                    'Content-Type': 'application/json'
                };
                this.struct = {
                    method: this.method,
                    headers: this.headers
                }
                if (this.data) {
                    this.struct.body = JSON.stringify(this.data);
                }
                fetch(this.URL, this.struct);
            }
        }
        const requests = [
            ['https://www.letaoedu.com/proxy/lesson/auth/common/watch/report.htm', requestData1],
            ['https://www.letaoedu.com/proxy/resource/auth/cware/common/saveStudyTime.htm', requestData2]
        ];
        await Promise.all(requests.map(request => new FetchRequests(request[0], 'POST', request[1])));

        const requestData = {
            "cwId": cwId,
            "userName": userName,
            "duration": Duration,
            "rightRate": 100,
            "isComplete": 100,
            "frameNumber": 0,
            "answerRecord": "",
            "userId": userId,
            "gcId": gcId
        };
        fetch('https://www.letaoedu.com/proxy/resource/auth/cware/common/saveStudyAnswerRecordV2.htm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
    });

    GM_registerMenuCommand('视频下载', async function () {
        console.log('视频下载');
        var fileId, filePath;
        await fetch(`https://www.letaoedu.com/proxy/beike/auth/common/microcourse/new/preview.htm?microcourseId=${INITSTATE.mcId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.datas.data.fileId);
                fileId = data.datas.data.fileId;
            })
        console.log(fileId);
        await fetch(`https://www.letaoedu.com/auth/global/fs/file/access/data.htm?id=${fileId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.datas.file.path);
                filePath = data.datas.file.path;
            })
        console.log(filePath);
        window.location.href = filePath;
    })
})();