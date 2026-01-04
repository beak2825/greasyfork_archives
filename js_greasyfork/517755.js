// ==UserScript==
// @name         自动考试
// @namespace    genggongzi_cx
// @version      1.1
// @description  自动进入下一个章节在单元测试结束后
// @author       genggongzi
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      api.gochati.cn
// @connect      up.gochati.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @original-author qq:2621905853
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/517755/%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/517755/%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==


        // Function to check for the presence of the element and click "確認"
    function checkAndClickConfirm() {
        // Select the "確認" button by its ID
        const confirmButton = document.getElementById('okBtn');

        // Check if the button exists
        if (confirmButton) {
            console.log('确认按钮已找到，正在点击...');

            // Simulate a click event
            confirmButton.click();

            // Clear the interval to stop further checks
            clearInterval(intervalId);
        } else {
            console.log('确认按钮尚未出现，继续监听...');
        }
    }

// Function to check for the presence of the element and click "確認"
function checkAndClickConfirm1() {
    // Select the "確認" button using a more general selector
    const confirmButton = document.querySelector('.cx_alert-blue');

    // Check if the button exists
    if (confirmButton && confirmButton.textContent.includes('确认')) {
        console.log('确认按钮已找到，正在点击...');

        // Simulate a click event
        confirmButton.click();

        // Clear the interval to stop further checks
        clearInterval(intervalId);
    } else {
        console.log('确认按钮尚未出现，继续监听...');
    }
}

// Set an interval to check every 10 seconds
const intervalId1 = setInterval(checkAndClickConfirm1, 10000);

function checkAndClickConfirm2() {
    const confirmButton = document.querySelector('.cx_alert-blue');

    if (confirmButton && confirmButton.textContent.includes('确认')) {
        console.log('确认按钮已找到，强制触发点击...');

        // Manually create and dispatch a click event
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        confirmButton.dispatchEvent(event);

        clearInterval(intervalId);
    } else {
        console.log('确认按钮尚未出现，继续监听...');
    }
}

const intervalId2 = setInterval(checkAndClickConfirm2, 10000);

const observer = new MutationObserver(() => {
    const confirmButton = document.querySelector('.cx_alert-blue');
    if (confirmButton && confirmButton.textContent.includes('确认')) {
        console.log('确认按钮已找到，正在点击...');
        confirmButton.click();
        observer.disconnect(); // 停止观察
    }
});

// 开始观察整个文档
observer.observe(document.body, { childList: true, subtree: true });
