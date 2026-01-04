// ==UserScript==
// @name         双拼练习计时统计
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为双拼练习页面添加可设置X分钟计时和正确率统计功能，按钮更明显地放在顶部菜单区域。
// @author
// @match        https://api.ihint.me/shuang*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/520197/%E5%8F%8C%E6%8B%BC%E7%BB%83%E4%B9%A0%E8%AE%A1%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520197/%E5%8F%8C%E6%8B%BC%E7%BB%83%E4%B9%A0%E8%AE%A1%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let attempts = [];
    let timer = null;
    let timeLeft = 300; // 默认5分钟
    let isTiming = false;
    let timerDisplay;
    let startButton;
    let inputMinutes; // 新增：用户输入分钟数

    let waitForShuangInterval = setInterval(() => {
        if (window.Shuang && window.$) {
            clearInterval(waitForShuangInterval);
            initTimerUI();
            patchJudgeFunction();
        }
    }, 500);

    function initTimerUI() {
        // 尝试在页面顶部插入UI，比如与".header"同级或在header内部
        const header = document.querySelector('.header');
        if (!header) {
            console.warn('Header not found, cannot insert timer UI. Will try body.');
        }

        // 创建一个容器，让UI更清晰
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.margin = '10px 0';
        container.style.gap = '10px';

        // 创建输入框用于设置分钟数
        inputMinutes = document.createElement('input');
        inputMinutes.type = 'number';
        inputMinutes.min = 1;
        inputMinutes.value = 5; // 默认5分钟
        inputMinutes.style.width = '50px';
        inputMinutes.title = '设置练习时长（分钟）';

        // 创建"开始计时"按钮
        startButton = document.createElement('button');
        startButton.innerText = '开始计时练习';
        startButton.title = '开始倒计时并统计正确率';
        startButton.onclick = startPractice;
        startButton.style.padding = '5px 10px';
        startButton.style.cursor = 'pointer';
        startButton.style.background = '#4CAF50';
        startButton.style.color = '#fff';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '4px';

        // 创建显示剩余时间的元素
        timerDisplay = document.createElement('div');
        timerDisplay.style.fontSize = '16px';
        timerDisplay.innerText = '剩余时间: 未开始';
        timerDisplay.style.marginLeft = '10px';

        // 将元素加入container
        container.appendChild(document.createTextNode('设置时长(分钟):'));
        container.appendChild(inputMinutes);
        container.appendChild(startButton);
        container.appendChild(timerDisplay);

        // 将container插入header中
        if (header) {
            header.appendChild(container);
        } else {
            // 如果header不存在，就插入到body顶部
            document.body.insertBefore(container, document.body.firstChild);
        }
    }

    function startPractice() {
        if (isTiming) return;
        // 根据用户输入的分钟数设置timeLeft
        const minutes = parseInt(inputMinutes.value, 10);
        if (isNaN(minutes) || minutes < 1) {
            alert('请输入有效的分钟数（>=1）');
            return;
        }

        timeLeft = minutes * 60;
        isTiming = true;
        attempts = [];
        timerDisplay.innerText = `剩余时间: ${timeLeft}秒`;

        timer = setInterval(()=>{
            timeLeft--;
            timerDisplay.innerText = '剩余时间: ' + timeLeft + '秒';
            if (timeLeft <= 0) {
                clearInterval(timer);
                isTiming = false;
                timerDisplay.innerText = '时间到！';
                showStatistics();
            }
        }, 1000);
    }

    function showStatistics() {
    let total = attempts.length;
    let correctCount = attempts.filter(a=>a.correct).length;
    let wrongCount = total - correctCount;
    let accuracy = total > 0 ? ((correctCount/total)*100).toFixed(2) + '%' : 'N/A';
    let wrongItems = attempts.filter(a=>!a.correct).map(a=>a.dict);

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    // 创建对话框
    const modal = document.createElement('div');
    modal.style.background = '#fff';
    modal.style.padding = '20px';
    modal.style.borderRadius = '8px';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';
    modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.style.textAlign = 'center';

    // 标题
    const title = document.createElement('h2');
    title.innerText = '练习结束！';
    title.style.marginTop = '0';

    // 统计信息内容
    const stats = document.createElement('div');
    stats.style.textAlign = 'left';
    stats.style.margin = '15px 0';

    // 使用换行和特殊样式呈现信息
    stats.innerHTML = `
        <p><strong>总次数:</strong> ${total}</p>
        <p><strong>正确:</strong> ${correctCount}</p>
        <p><strong>错误:</strong> ${wrongCount}</p>
        <p><strong>正确率:</strong> ${accuracy}</p>
        ${ wrongCount > 0
            ? `<p><strong>错误的字有:</strong> ${wrongItems.join('、')}</p>`
            : `<p>全部正确，棒棒哒！</p>`
        }
    `;

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.padding = '8px 16px';
    closeButton.style.marginTop = '10px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.background = '#007BFF';
    closeButton.style.color = '#fff';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    modal.appendChild(title);
    modal.appendChild(stats);
    modal.appendChild(closeButton);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}
    function patchJudgeFunction() {
        if (!Shuang.app || !Shuang.app.action || !Shuang.app.action.judge) {
            console.warn("Unable to patch judge function, Shuang structure changed?");
            return;
        }

        const originalJudge = Shuang.app.action.judge;
        Shuang.app.action.judge = function() {
            const inputVal = $("#a").value;
            const correct = Shuang.core.current.judge(inputVal[0], inputVal[1]);

            if (isTiming && inputVal.length === 2) {
                attempts.push({
                    sheng: Shuang.core.current.sheng,
                    yun: Shuang.core.current.yun,
                    dict: Shuang.core.current.dict,
                    correct: correct
                });
            }

            return originalJudge.call(this);
        };
    }

})();
