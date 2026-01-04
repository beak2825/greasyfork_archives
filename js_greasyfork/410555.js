// ==UserScript==
// @name         ELMS video quiz reviewer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       Terp
// @match        https://umd.hosted.panopto.com/Panopto/Pages/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/410555/ELMS%20video%20quiz%20reviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/410555/ELMS%20video%20quiz%20reviewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.textContent = 'Load Answers';
    btn.addEventListener('click', loadAnswers);
    btn.style = 'position:fixed;right:10px;top:10px;z-index:9999;';
    document.body.append(btn);

    function setLoading(state) {
        if (state === true) {
            btn.textContent = 'Loading...';
            btn.disabled = true;
        } else {
            btn.textContent = 'Toggle Answers';
            btn.disabled = false;
            btn.removeEventListener('click', loadAnswers);
            btn.addEventListener('click', toggleAnswers);
        }
    }

    const answerView = document.createElement('div');
    answerView.style = 'position:fixed;right:125px;top:0;left:10px;background-color:rgb(142,142,147);padding:15px;display:none;flex-direction:column;font-family:monospace;max-height:800px;overflow:auto;z-index:99999;';
    document.body.append(answerView);

    async function loadDocuments() {
        const urlParams = new URLSearchParams(window.location.search);
        const deliveryId = urlParams.get('id');
        const req = await fetch('https://umd.hosted.panopto.com/Panopto/Pages/Viewer/DeliveryInfo.aspx', {
            'headers': {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
            },
            'body': `deliveryId=${deliveryId}&invocationId=&isLiveNotes=false&refreshAuthCookie=true&isActiveBroadcast=false&isEditing=false&isKollectiveAgentInstalled=false&isEmbed=false&responseType=json`,
            'method': 'POST',
            'mode': 'cors',
            'credentials': 'include',
        });
        return await req.json();
    }

    async function loadAnswers() {
        setLoading(true);

        const documentData = await loadDocuments();
        const quizInfoList = documentData.Delivery.Timestamps.filter((info) => {
            return info.ObjectIdentifier === 'QuestionList';
        }).map((info) => {
            return {
                title: info.Caption,
                id: info.PublicId,
                isQuiz: true,
            };
        });

        const allAnswerData = [];
        for (const { title, id: quizId, isQuiz } of quizInfoList) {
            if (isQuiz) {
                const res = await fetch(`https://umd.hosted.panopto.com/Panopto/Api/QuestionLists/${quizId}`, {
                    'referrerPolicy': 'no-referrer-when-downgrade',
                    'body': null,
                    'method': 'GET',
                    'mode': 'cors',
                    'credentials': 'include',
                });
                const resData = await res.json();

                const questionReport = resData.Questions.map(({ QuestionType: questionType, Name: questionName, Options: optionList, Prompt: prompt }) => {
                    if (questionType === 1 || questionType === 0) {
                        const options = optionList.map(({ Name: optionName, IsCorrect: isCorrect }) => {
                            return `${isCorrect ? '✔️' : '❌'} ${optionName}`;
                        }).join(`<br>`);
                        return `<h4>${questionName}</h4>${options}<br>`;
                    } else if (questionType === 3) {
                        return `<h4>${prompt}</h4><br>`;
                    } else {
                        return `<h4>NOT SUPPORTED TYPE ${questionType}<br>`;
                    }
                }).join(`<br>`);

                allAnswerData.push(`<h2 style="margin-bottom:0;">${title}</h2>${questionReport}`);
                // console.log(resData);
            }
        }
        setLoading(false);
        // generate report
        const allReport = allAnswerData.join(`<hr>`);
        answerView.innerHTML = allReport;
    }

    function toggleAnswers() {
        if (answerView.style.display === 'none') {
            answerView.style.display = 'flex';
        } else {
            answerView.style.display = 'none';
        }
    }
})();