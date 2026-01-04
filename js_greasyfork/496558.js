// ==UserScript==
// @name         显示中国保密在线考试答案
// @namespace    https://github.com/jiang-taibai/show_baomi_answer
// @version      v1.0.4-2024-05-31
// @description  显示中国保密在线考试答案的脚本，用黄色突出正确选项
// @author       CoderJiang
// @match        http://www.baomi.org.cn/*
// @match        https://www.baomi.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baomi.org.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496558/%E6%98%BE%E7%A4%BA%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496558/%E6%98%BE%E7%A4%BA%E4%B8%AD%E5%9B%BD%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getOptionIndex(option) {
        return option.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    function getAnsIndex(jsonObject) {
        const typeList = jsonObject.data.typeList;
        const answers = [];
        typeList.forEach(type => {
            type.questionList.forEach(question => {
                const ans = question.answer
                const ansIndex = getOptionIndex(ans);
                answers.push(ansIndex);
            });
        });
        return answers
    }

    function displayAnswers(answers) {
        const quesOptionsBoxes = document.querySelectorAll('.ques_options-box');
        for (let i = 0; i < answers.length; i++) {
            const quesOptionsBox = quesOptionsBoxes[i];
            const ansIndex = answers[i];
            const option = quesOptionsBox.querySelectorAll('label')[ansIndex];
            option.style.backgroundColor = '#abc89a';
        }
    }

    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.includes("/portal/main-api/v2/activity/exam/getExamContentData.do")) {
            console.debug(url)
            const examId = url.split('examId=')[1].split('&')[0];
            const randomId = url.split('randomId=')[1];
            const apiUrl = `https://www.baomi.org.cn/portal/main-api/v2/activity/exam/getExamContentData.do?examId=${examId}&randomId=${randomId}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const answers = getAnsIndex(JSON.parse(response.responseText));
                        displayAnswers(answers);
                    } else {
                        console.debug('API Request Failed:', response.statusText);
                    }
                }
            });
        }
        originalOpen.apply(this, arguments)
    }
})();