// ==UserScript==
// @name         ClassAvg for Schoolis
// @namespace    http://your.namespace.com
// @version      1.0
// @description  ClassAvg for Schoolis.
// @match        https://*.schoolis.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467565/ClassAvg%20for%20Schoolis.user.js
// @updateURL https://update.greasyfork.org/scripts/467565/ClassAvg%20for%20Schoolis.meta.js
// ==/UserScript==
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
(function () {
    'use strict';
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === 'string' && input.includes('/api/LearningTask/GetDetail?learningTaskId=') && !input.includes('&abucket')) {
            const splitArray = input.split('/');
            const learningTaskId = splitArray[splitArray.length - 1].split('=')[1];
            const url = `/api/LearningTask/GetDetail?learningTaskId=${learningTaskId}&abucket`;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(async data => {
                    await sleep(1000);
                    var regex = /fe-components-stu-app-task-detail-__itemClassInfo(?!Show)/;
                    var elements = document.querySelectorAll('[class*="components-stu-app-task-detail"]');
                    elements.forEach(function (element) {
                        if (regex.test(element.className)) {
                            const classAvgScore = data['data']['classAvgScore'];
                            const classMaxScore = data['data']['classMaxScore'];

                            var content = document.createElement('div');
                            content.innerHTML = "Class Avg: " + classAvgScore + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Class Max: " + classMaxScore;
                            content.style.color = 'red';
                            content.style.lineHeight = '35px';
                            content.style.fontSize = '14px';
                            element.appendChild(content);


                        }
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
        return originalFetch.apply(this, arguments);
    };
})();
