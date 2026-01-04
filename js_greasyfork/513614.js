// ==UserScript==
// @name         安培在线学习
// @namespace    http://tampermonkey.net/
// @version      2025-8-20
// @description  进入到学习界面点击
// @author       buhuixue
// @match        https://sctt.anpeiwang.com/courseStudyAction/toCourseStudyV2.action
// @icon         https://sctt.anpeiwang.com/courseStudyAction/toCourseStudyV2.action
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513614/%E5%AE%89%E5%9F%B9%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/513614/%E5%AE%89%E5%9F%B9%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '开始学习';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    // 显示结果
    const resultDisplay = document.createElement('div');
    resultDisplay.style.position = 'fixed';
    resultDisplay.style.top = '50px';
    resultDisplay.style.right = '10px';
    resultDisplay.style.zIndex = 1000;
    resultDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    resultDisplay.style.border = '1px solid #ccc';
    resultDisplay.style.borderRadius = '5px';
    resultDisplay.style.padding = '10px';
    resultDisplay.style.display = 'none';
    document.body.appendChild(resultDisplay);

    button.addEventListener('click', function() {
        const isPDF = window.location.href.endsWith('.pdf') || document.querySelector('embed[type="application/pdf"], iframe[src*=".pdf"]') !== null;
        const isVideo = document.querySelector('video') !== null;

        const wareRecordId = window.wareRecordId;
        const courseRecordId = window.courseRecordId;
        const courseId = window.courseId;
        const userId = window.userId;
        const source = window.source;
        const relationId = window.relationId;
        const courseWareId = window.courseWareId;
        let pdfTotalPage;
        let videoTotalTime;

        if (isPDF) {
            const pdfMaxElement = document.querySelector('iframe').contentDocument.querySelector('#pageNumber').max;
            if (pdfMaxElement) {
                pdfTotalPage = pdfMaxElement.trim();
                resultDisplay.textContent = 'PDF 总页数: ' + pdfTotalPage;
                resultDisplay.style.display = 'block';
            } else {
                resultDisplay.textContent = '未找到页数元素。';
                resultDisplay.style.display = 'block';
            }
        } else if (isVideo) {
            const durationElement = document.querySelector('.prism-time-display .duration');
            if (durationElement) {
                videoTotalTime = durationElement.textContent;
                resultDisplay.textContent = '视频 总时长: ' + videoTotalTime;
                resultDisplay.style.display = 'block';
            } else {
                resultDisplay.textContent = '未找到时长元素。';
                resultDisplay.style.display = 'block';
            }
        } else {
            resultDisplay.textContent = '此页面既不是 PDF 也不是视频。';
            resultDisplay.style.display = 'block';
        }

        let bodyContent = '';
        let postUrl = '';

        if (isPDF) {
            bodyContent = `wareRecordId=${wareRecordId}&courseRecordId=${courseRecordId}&courseId=${courseId}&userId=${userId}&totalPages=${pdfTotalPage}&currPage=${pdfTotalPage}&source=${source}&relationId=${relationId}`;
            postUrl = "https://sctt.anpeiwang.com/courseStudyAction/recordSwfWareAfterLeavePage.action";
        } else if (isVideo) {
            const totalTimeInSeconds = convertTimeToSeconds(videoTotalTime);
            bodyContent = `wareRecordId=${wareRecordId}&courseRecordId=${courseRecordId}&courseId=${courseId}&userId=${userId}&totalTime=${totalTimeInSeconds}&currentTime=${totalTimeInSeconds}&source=${source}&relationId=${relationId}&courseWareId=${courseWareId}`;
            postUrl = "https://sctt.anpeiwang.com/courseStudyAction/recordVedioWareAfterLeavePage.action";
        }

        if (postUrl) {
            fetch(postUrl, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "pragma": "no-cache",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://sctt.anpeiwang.com/courseStudyAction/toCourseStudyV2.action",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": bodyContent,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json()
                        .then(data => {
                            console.log('Success:', data);
                            resultDisplay.textContent += '\nPOST 返回值: ' + JSON.stringify(data);
                        })
                        .catch(() => response.text().then(text => {
                            console.log('Response text:', text);
                            resultDisplay.textContent += '\nPOST 返回文本: ' + text;
                        }));
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultDisplay.textContent += '\n错误信息: ' + error;
                });
        }
    });

    function convertTimeToSeconds(time) {
        const parts = time.split(':');
        let seconds = 0;
        if (parts.length === 2) {
            seconds += parseInt(parts[0], 10) * 60;
            seconds += parseInt(parts[1], 10);
        }
        return seconds;
    }
})();
