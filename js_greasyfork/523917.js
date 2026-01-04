// ==UserScript==
// @name         XMUM AC Evaluation Tool
// @namespace    http://tampermonkey.net/
// @version      2024-12-20
// @description  try to take over the AC system!
// @author       Reality361
// @run-at       document-idle
// @match        https://ac.xmu.edu.my/student/index.php?c=Pj&a=add*
// @icon         https://ac.xmu.edu.my/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523917/XMUM%20AC%20Evaluation%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/523917/XMUM%20AC%20Evaluation%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        // 获取所有 input 元素
        const maxScoreInputs = document.querySelectorAll('input[value="5"]');

        // 遍历这些元素并选中 value 为 5 的元素
        maxScoreInputs.forEach(input => {
            // 操作
            input.checked = true;
        });

        var textArea1 = document.querySelector('textarea[name="wt[1]"]');
        if (textArea1) {
            textArea1.innerHTML = "The best things about the course were the engaging lectures and the professor’s ability to explain complex concepts in an understandable manner. The use of real-world examples and interactive activities made the lessons interesting and relevant. Additionally, the professor was always approachable and willing to help, creating a supportive learning environment that encouraged student participation and discussion.";
        }

        var textArea2 = document.querySelector('textarea[name="wt[2]"]');
        if (textArea2) {
            textArea2.innerHTML = "One area for improvement could be the pacing of the course. At times, the material was covered very quickly, which made it challenging to fully grasp some of the more complex topics. Slowing down the pace slightly, especially for difficult concepts, and incorporating more hands-on exercises or examples could enhance understanding and retention. Additionally, providing more detailed feedback on assignments would be beneficial for better learning outcomes.";
        }

    }, false);
})();