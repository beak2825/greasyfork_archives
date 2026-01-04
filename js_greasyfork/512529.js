// ==UserScript==
// @name         自动阅读脚本
// @namespace    https://h5.metareader.cn/
// @version      2024-10-11
// @description  xiaoyang
// @license      ni
// @author       You
// @match        https://h5.metareader.cn/h5/pages/pc/activity/teamDetail?activityId=*
// @match        https://h5.metareader.cn/h5/pages/pc/web?bid=*
// @match        https://h5.metareader.cn/h5/pages/pc/detail?bid=*
// @icon         https://h5.metareader.cn/h5/pages/pc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512529/%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512529/%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


let continueLoop = false;
console.log("111111");
document.addEventListener("keydown", function(event) {
    console.log(event.key);

    if (event.key == "z") {
        if (!continueLoop) {
            console.log('开始循环');
            startLoop();
        }
    }else if (event.key == "x") {
        stopLoop();
    }
});

function startLoop() {
    continueLoop = true;
    let count = 0;
    // 使用setInterval替代while循环以避免阻塞UI线程
    const intervalId = setInterval(function() {
        if (!continueLoop) {
            clearInterval(intervalId);
            return;
        }
        document.body.style.height='200vh'
        document.body.style.background='linear-gradient(to bottom, #f0f8ff, #4682b4)'

        window.scrollBy(0, 1);
        if ((window.innerHeight + window.scrollY+1) >= document.body.offsetHeight) {
            document.getElementsByClassName('change-btn')[1].click();
        }

        // 在这里执行你的循环体代码
    },1300); // 每秒执行一次
}
function stopLoop() {
    console.log('停止循环');
    continueLoop = false;
}