// ==UserScript==
// @name         快速导航按钮
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Quick navigation button with settings
// @author       Lotsu&Cherry
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @match        http://127.0.0.1:5500/webtest.html
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @downloadURL https://update.greasyfork.org/scripts/487611/%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/487611/%E5%BF%AB%E9%80%9F%E5%AF%BC%E8%88%AA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

GM_addStyle(`
    #myButton {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 50px;
        cursor: pointer;
        user-select: none;
        z-index: 9999;
    }
    .half {
        height: 100%;
        float: left;
        color: white;
        text-align: center;
        line-height: 50px;
    }
    #navigate {
        background-color: #4CAF50;
        width: 75%;
    }
    #settings {
        background-color: #3F51B5;
        width: 25%;
    }
    #settings::before {
        content: "⚙";
        font-size: 20px;
    }
    #settingsPanel {
        display: none;
        position: fixed;
        width: 200px; // Same width as the button
        height: 50px; // Same height as the button
        background-color: #3F51B5; // Same background color as the button
        border: 1px solid #000;
        z-index: 9999;
        color: white;
        cursor: pointer;
        user-select: none;
        flex-direction: column;
    }
    .settingsOption {
        width: 50%;
        height: 75%;
        float: left;
        color: #FFFFFF;
        background-color: #3F51B5;
        text-align: center;
        line-height: 35px;
        flex-direction: column;
        z-index: 9999;
    }
    .settingsOption:hover {
        background-color: #3F51B5;
    }
`);

// 在页面加载时，恢复按钮的位置
window.addEventListener('load', function () {
    var buttonPosition = localStorage.getItem('buttonPosition');
    if (buttonPosition) {
        buttonPosition = JSON.parse(buttonPosition);
        button.style.top = buttonPosition.top;
        button.style.left = buttonPosition.left;
    }
});

var baseWidth = 100; // Base width
var baseHeight = 50; // Base height


var button = document.createElement('div');
button.id = 'myButton';
button.style.width = baseWidth + 'px';
button.style.height = baseHeight + 'px';
button.style.position = 'fixed'; // Set initial position to fixed
document.body.appendChild(button);

var navigate = document.createElement('div');
navigate.id = 'navigate';
navigate.className = 'half';
navigate.textContent = '→';
button.appendChild(navigate);

var settings = document.createElement('div');
settings.id = 'settings';
settings.className = 'half';
button.appendChild(settings);

var settingsPanel = document.createElement('div');
settingsPanel.id = 'settingsPanel';
document.body.appendChild(settingsPanel);

var saveUrlOption = document.createElement('div');
saveUrlOption.className = 'settingsOption';
saveUrlOption.textContent = '保存';
saveUrlOption.style.marginTop = 'bottom';
saveUrlOption.style.backgroundColor = '#3FB53F'; // 更改按钮的背景颜色
saveUrlOption.style.width = '100px'; // 更改按钮的宽度
saveUrlOption.style.height = '35px'; // 更改按钮的高度
settingsPanel.appendChild(saveUrlOption);

var lockUnlockOption = document.createElement('div');
lockUnlockOption.className = 'settingsOption';
lockUnlockOption.textContent = '解锁';
settingsPanel.appendChild(lockUnlockOption);

var redirectOption = document.createElement('div');
redirectOption.className = 'settingsOption';
redirectOption.textContent = '左右';
settingsPanel.appendChild(redirectOption);

var resizeOption = document.createElement('div');
resizeOption.className = 'settingsOption';
resizeOption.textContent = '缩放';
settingsPanel.appendChild(resizeOption);

var isLocked = true; // Set initial state to locked
var defaultUrl = 'https://game.granbluefantasy.jp/#mypage';

navigate.addEventListener('click', function (e) {
    var savedUrl = localStorage.getItem('savedUrl');
    var urlToNavigate = savedUrl ? savedUrl : defaultUrl;

    if (isLocked) {
        window.location.href = urlToNavigate; // Replace with your URL
    } else {
        // 如果 isLocked = false，阻止跳转
        e.preventDefault();
    }
});

settings.addEventListener('click', function () {
    var display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    settingsPanel.style.display = display;
    if (display === 'block') {
        var rect = button.getBoundingClientRect();
        settingsPanel.style.display = 'flex';
        settingsPanel.style.flexDirection = 'column';
        settingsPanel.style.bottom = (window.innerHeight - rect.top) + 'px'; // Align settings panel with the top edge of the button
        settingsPanel.style.left = rect.left + 'px'; // Position settings panel to the left of the button
    }
});

saveUrlOption.addEventListener('click', function () {
    var currentUrl = window.location.href;
    localStorage.setItem('savedUrl', currentUrl);
    console.log("Current Page URL: " + currentUrl + " has been saved.");
});

var isLocked = true; // Set initial state to locked
var dragStartX, dragStartY;
var elemStartX, elemStartY;

function dragStart(event) {
    if (!isLocked) {
        // 获取鼠标或触摸点的初始位置
        dragStartX = event.clientX || event.touches[0].clientX;
        dragStartY = event.clientY || event.touches[0].clientY;

        // 获取元素的初始位置
        elemStartX = button.offsetLeft;
        elemStartY = button.offsetTop;

        // 添加 mousemove 或 touchmove 事件监听器
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('touchmove', dragMove);

        // 添加 mouseup 或 touchend 事件监听器
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);

        event.preventDefault();
    }
}

function dragMove(event) {
    // 计算鼠标或触摸点的新位置
    var newX = (event.clientX || event.touches[0].clientX) - dragStartX;
    var newY = (event.clientY || event.touches[0].clientY) - dragStartY;

    // 更新元素的位置
    button.style.left = (elemStartX + newX) + 'px';
    button.style.top = (elemStartY + newY) + 'px';
}

function dragEnd(event) {
    // 清除鼠标或触摸点的位置
    dragStartX = null;
    dragStartY = null;

    // 移除 mousemove 或 touchmove 事件监听器
    window.removeEventListener('mousemove', dragMove);
    window.removeEventListener('touchmove', dragMove);

    // 移除 mouseup 或 touchend 事件监听器
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchend', dragEnd);

    localStorage.setItem('buttonPosition', JSON.stringify({ top: button.style.top, left: button.style.left }));

}

// 添加 mousedown 或 touchstart 事件监听器
button.addEventListener('mousedown', dragStart);
button.addEventListener('touchstart', dragStart);

lockUnlockOption.addEventListener('click', function () {
    if (isLocked) {
        // 将按钮放在左侧的中间
        button.style.top = '50%';
        button.style.left = '8%';
        lockUnlockOption.textContent = '锁定';
        isLocked = false;
    } else {
        var rect = button.getBoundingClientRect();
        button.style.position = 'fixed';
        button.style.top = rect.top;
        button.style.left = rect.left;
        lockUnlockOption.textContent = '解锁';
        isLocked = true;
    }
    localStorage.setItem('buttonPosition', JSON.stringify({ top: button.style.top, left: button.style.left }));
    localStorage.setItem('isLocked', isLocked);
});


var isReversed = false;

redirectOption.addEventListener('click', function () {
    // Remove elements from parent
    navigate.remove();
    settings.remove();
    settingsPanel.remove();

    // Append in reverse order
    if (isReversed) {
        button.appendChild(navigate);
        button.appendChild(settings);
        document.body.appendChild(settingsPanel);
    } else {
        button.appendChild(settings);
        button.appendChild(navigate);
        document.body.insertBefore(settingsPanel, document.body.firstChild);
    }

    isReversed = !isReversed;
    localStorage.setItem('isReversed', isReversed);
});

// // Resize button and settings panel
// resizeOption.addEventListener('click', function () {
//     var percentage = prompt("Enter size percentage:", "100");
//     if (percentage !== null) {
//         var scale = percentage / 100;
//         button.style.width = (baseWidth * scale) + 'px';
//         button.style.height = (baseHeight * scale) + 'px';
//         settingsPanel.style.width = (baseWidth * scale) + 'px';
//         settingsPanel.style.height = (baseHeight * scale) + 'px';
//         localStorage.setItem('buttonSize', percentage);
//     }
// });

// // 获取要拖动的元素
// var dragElement = document.getElementById('settings');
// var container = document.getElementById('myButton');

// var dragStartX, dragStartY;
// var elemStartX, elemStartY;

// // 添加 mousedown 或 touchstart 事件监听器
// dragElement.addEventListener('mousedown', dragStart);
// dragElement.addEventListener('touchstart', dragStart);

// // 添加 mousemove 或 touchmove 事件监听器
// window.addEventListener('mousemove', dragMove);
// window.addEventListener('touchmove', dragMove);

// // 添加 mouseup 或 touchend 事件监听器
// window.addEventListener('mouseup', dragEnd);
// window.addEventListener('touchend', dragEnd);

// function dragStart(event) {
//     // 获取鼠标或触摸点的初始位置
//     dragStartX = event.clientX || event.touches[0].clientX;
//     dragStartY = event.clientY || event.touches[0].clientY;

//     // 获取元素的初始位置
//     elemStartX = container.offsetLeft;
//     elemStartY = container.offsetTop;

//     event.preventDefault();
// }

// function dragMove(event) {
//     // 计算鼠标或触摸点的新位置
//     var newX = (event.clientX || event.touches[0].clientX) - dragStartX;
//     var newY = (event.clientY || event.touches[0].clientY) - dragStartY;

//     // 更新元素的位置
//     container.style.left = (elemStartX + newX) + 'px';
//     container.style.top = (elemStartY + newY) + 'px';
// }

// function dragEnd(event) {
//     // 清除鼠标或触摸点的位置
//     dragStartX = null;
//     dragStartY = null;
// }