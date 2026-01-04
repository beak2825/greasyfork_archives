// ==UserScript==
// @name         上应大自动答题插件
// @version      1.0.2
// @namespace    https://www.tiankong.info/
// @description  上海应用技术大学继续教育学院自动答题插件，如果题库有答案则自动填充，否则需要手动提交一次然后刷新答案
// @license      MIT
// @author       竟康
// @match        https://www.learnin.com.cn/user*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      www.learnin.com.cn
// @connect      work.polish.work
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.3/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/434941/%E4%B8%8A%E5%BA%94%E5%A4%A7%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/434941/%E4%B8%8A%E5%BA%94%E5%A4%A7%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

$(function () {
    'use strict';
    let host = 'http://work.polish.work:10086'
    setTimeout(function () {
        console.log('上应大题库收集器插件已加载');
        let url = window.location.href;
        if (url.endsWith('/do')) {
            console.log('已进入答题页面');
            let buttonElement = document.createElement('button');
            buttonElement.innerText = '刷新答案';
            buttonElement.style.width = '120px'
            buttonElement.style.height = '60px'
            buttonElement.style.fontSize = '22px'
            buttonElement.style.borderRadius = '30px'
            buttonElement.style.left = '100px'
            buttonElement.style.top = '100px'
            buttonElement.style.background = '#409EFF';
            buttonElement.style.color = 'white';
            buttonElement.style.position = 'fixed'
            document.body.appendChild(buttonElement);

            let randomElement = document.createElement('button');
            randomElement.innerText = '随机选择';
            randomElement.style.width = '120px'
            randomElement.style.height = '60px'
            randomElement.style.fontSize = '22px'
            randomElement.style.borderRadius = '30px'
            randomElement.style.left = '100px'
            randomElement.style.top = '200px'
            randomElement.style.background = '#F56C6C';
            randomElement.style.color = 'white';
            randomElement.style.position = 'fixed'
            document.body.appendChild(randomElement);
            let split = url.split('/');
            let courseId = split[split.length - 4];
            let topicId = split[split.length - 2];
            getAnswer(courseId, topicId);
            buttonElement.onclick = function () {
                getAnswer(courseId, topicId);
            }
            randomElement.onclick = function () {
                randomAnswer();
            }
        } else {
            console.log('非答题页面');
        }
    }, 1000)

    function getAnswer(courseId, topicId) {
        let data = 'courseId=' + courseId + '&topicId=' + topicId;
        console.log('data = ' + data)
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://www.learnin.com.cn/app/user/student/course/space/topic/appStudentCourseTopic/loadTopicData',
            data: data,
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function (res) {
                if (res.status === 200) {
                    let result = JSON.parse(res.responseText);
                    let topic = result.topic;
                    if (topic.state === '11') {
                        setTimeout(function () {
                            loadAnswer(courseId, topicId);
                        }, 1000)
                    } else if (topic.state === '02') {
                        let titleButton = document.getElementsByClassName('function-btn')[0]
                        if (titleButton.innerText.indexOf('重新答题') !== -1) {
                            console.log('开始上传答案')
                            let childList = topic.topicItems[0].childList;
                            $.each(childList, function (index) {
                                let optionList = this.optionList;
                                $.each(optionList, function () {
                                    if (this.isAnswer) {
                                        let answer = this.content;
                                        let question = courseId + '/' + topicId + '/' + index;
                                        let importData = JSON.stringify({question: question, answer: answer});
                                        console.log(importData)
                                        GM_xmlhttpRequest({
                                            method: "post",
                                            url: host + '/import',
                                            data: importData,
                                            headers: {"Content-Type": "application/json"},
                                            onload: function (res) {
                                                if (res.status === 200) {
                                                    let result = JSON.parse(res.responseText);
                                                    console.log(result)
                                                }
                                            }
                                        })
                                    }
                                })
                            })
                            console.log('答案上传完成')
                        } else {
                            setTimeout(function () {
                                console.log('开始填充答案')
                                loadAnswer(courseId, topicId);
                            }, 1000)
                        }
                    }
                }
            }
        })
    }

    function loadAnswer(courseId, topicId) {
        let itemContainer = document.getElementsByClassName('store-question-item-container');
        $.each(itemContainer, function (itemIndex) {
            let optionList = this.getElementsByClassName('option-item');
            let question = courseId + '/' + topicId + '/' + itemIndex;
            $.each(optionList, function () {
                let optionItem = this;
                let answer = optionItem.getElementsByClassName('option-content')[0].innerText;
                let data = JSON.stringify({question: question, answer: answer + ''});
                GM_xmlhttpRequest({
                    method: "post",
                    url: host + '/check',
                    data: data,
                    headers: {"Content-Type": "application/json"},
                    onload: function (res) {
                        if (res.status === 200) {
                            let result = JSON.parse(res.responseText);
                            if (result.data) {
                                console.log(result)
                                let optionIndex = optionItem.getElementsByClassName('option-index')[0];
                                optionIndex.click()
                                optionItem.style.color = 'red';
                            }
                        }
                    }
                })
            })
        })
    }

    function randomAnswer() {
        let itemContainer = document.getElementsByClassName('store-question-item-container');
        $.each(itemContainer, function () {
            let random = Math.floor(Math.random() * 4)
            let optionItem = this.getElementsByClassName('option-item')[random];
            let optionIndex = optionItem.getElementsByClassName('option-index')[0];
            optionIndex.click()
        })
    }
});