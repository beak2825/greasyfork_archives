// ==UserScript==
// @name         评教
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  预防腱鞘炎
// @author       You
// @match       https://cdtutms.cdtu.edu.cn/jsxsd/xspj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cdtu.edu.cn
// @grant        none
// @license  GPL
// @downloadURL https://update.greasyfork.org/scripts/501639/%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/501639/%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
     // 创建一个正方形按钮,显示“开”或者“关”
    function createButton() {
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top='0';
        button.style.left='0';
        button.style.width = '25px';
        button.style.height = '25px';
        button.style.backgroundColor = 'transparent';
        button.style.color = '#ff7f50';
        button.style.border = '1px solid #ff7f50';
        button.style.cursor = 'move';
        button.style.float = 'right';
        button.innerText = '关';
        return button;}


     // 按钮右键自由拖动
    function makeDraggable(element) {
        let offsetX, offsetY;
        element.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 将按钮添加到页面中
    const button = createButton();
    document.body.appendChild(button);
    makeDraggable(button);

    // 点击按钮触发开关，并且下次打开浏览器保持最后选择的状态
    button.addEventListener('click', () => {
        if (button.innerText === '关') {
            button.innerText = '开';
        } else {
            button.innerText = '关';
        }
        localStorage.setItem('buttonState', button.innerText);
    });

    // 初始化按钮状态
    const savedState = localStorage.getItem('buttonState');
    if (savedState) {
        button.innerText = savedState;
    }
     //判断开关状态
    if (button.innerText === '开') {
    setTimeout(function() {
        var labels = document.querySelectorAll('.icon-radio');
        for (let i = 0; i < labels.length-5; i++) {
            if (i % 5 === 0) {
            labels[i].click();
            }
}
        labels[51].click();

var tjs = document.querySelectorAll('#tj');
        tjs[0].click();
        }, 100);

    }
})();