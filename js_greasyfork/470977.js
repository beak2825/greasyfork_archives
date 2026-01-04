// ==UserScript==
// @name         名字竞技场修改器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在下方添加了7个按钮（剁手刀、全员剁手刀、死亡笔记、全员死亡笔记、口罩、全员口罩、清除武器），点击BOSS图标和名字的中间可以自动复制BOSS真名
// @author       HIM7
// @match        https://namerena.github.io/
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470977/%E5%90%8D%E5%AD%97%E7%AB%9E%E6%8A%80%E5%9C%BA%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470977/%E5%90%8D%E5%AD%97%E7%AB%9E%E6%8A%80%E5%9C%BA%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Increase the height of the text area
    let textDiv = document.querySelector('#textdiv');
    textDiv.style.height = 'calc(100% + 50px)';

    // Add custom buttons to bottom left corner
    let inputPanel = document.querySelector('#inputPanel');
    let buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap';
    inputPanel.appendChild(buttonContainer);

    let chopMeatButton = document.createElement('button');
    chopMeatButton.innerText = '剁手刀';
    buttonContainer.appendChild(chopMeatButton);

    let allChopMeatButton = document.createElement('button');
    allChopMeatButton.innerText = '全员剁手刀';
    buttonContainer.appendChild(allChopMeatButton);

    let deathNoteButton = document.createElement('button');
    deathNoteButton.innerText = '死亡笔记';
    buttonContainer.appendChild(deathNoteButton);

    let allDeathNoteButton = document.createElement('button');
    allDeathNoteButton.innerText = '全员死亡笔记';
    buttonContainer.appendChild(allDeathNoteButton);

    let maskButton = document.createElement('button');
    maskButton.innerText = '口罩';
    buttonContainer.appendChild(maskButton);

    let allMaskButton = document.createElement('button');
    allMaskButton.innerText = '全员口罩';
    buttonContainer.appendChild(allMaskButton);

    let guiYueTrophyButton = document.createElement('button');
    guiYueTrophyButton.innerText = '桂月奖杯';
    buttonContainer.appendChild(guiYueTrophyButton);

    let allGuiYueTrophyButton = document.createElement('button');
    allGuiYueTrophyButton.innerText = '全员桂月奖杯';
    buttonContainer.appendChild(allGuiYueTrophyButton);

    let xuanYueTrophyButton = document.createElement('button');
    xuanYueTrophyButton.innerText = '玄月奖杯';
    buttonContainer.appendChild(xuanYueTrophyButton);

    let allXuanYueTrophyButton = document.createElement('button');
    allXuanYueTrophyButton.innerText = '全员玄月奖杯';
    buttonContainer.appendChild(allXuanYueTrophyButton);

    let clearWeaponsButton = document.createElement('button');
    clearWeaponsButton.innerText = '清除武器';
    buttonContainer.appendChild(clearWeaponsButton);

    // Add event listeners to custom buttons
    chopMeatButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let cursorPosition = textArea.selectionStart;
        let textBeforeCursor = textArea.value.slice(0, cursorPosition);
        let textAfterCursor = textArea.value.slice(cursorPosition);
        let lastLineBreak = textBeforeCursor.lastIndexOf('\n') + 1;
        if (textBeforeCursor.slice(lastLineBreak).trim() !== '' && !textBeforeCursor.slice(lastLineBreak).includes('@!')&& !textBeforeCursor.slice(lastLineBreak).includes('!test!') && !/\+\S*$/.test(textBeforeCursor.slice(lastLineBreak))) {
            textArea.value = textBeforeCursor + '+剁手刀' + textAfterCursor;
            textArea.selectionStart = cursorPosition + 4;
            textArea.selectionEnd = cursorPosition + 4;
        }
    });

    deathNoteButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let cursorPosition = textArea.selectionStart;
        let textBeforeCursor = textArea.value.slice(0, cursorPosition);
        let textAfterCursor = textArea.value.slice(cursorPosition);
        let lastLineBreak = textBeforeCursor.lastIndexOf('\n') + 1;
        if (textBeforeCursor.slice(lastLineBreak).trim() !== '' && !textBeforeCursor.slice(lastLineBreak).includes('@!')&& !textBeforeCursor.slice(lastLineBreak).includes('!test!') && !/\+\S*$/.test(textBeforeCursor.slice(lastLineBreak))) {
            textArea.value = textBeforeCursor + '+死亡笔记' + textAfterCursor;
            textArea.selectionStart = cursorPosition + 5;
            textArea.selectionEnd = cursorPosition + 5;
        }
    });

    allChopMeatButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
        lines.forEach(function(line, index) {
            if (line.trim() !== '' && !line.includes('@!')&& !line.includes('!test!')&& !/\+\S*$/.test(line)) {
                lines[index] += '+剁手刀';
            }
        });
        textArea.value = lines.join('\n');
    });

    allDeathNoteButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
        lines.forEach(function(line, index) {
            if (line.trim() !== '' && !line.includes('@!')&& !line.includes('!test!')&& !/\+\S*$/.test(line)) {
                lines[index] += '+死亡笔记';
            }
        });
        textArea.value = lines.join('\n');
    });

    maskButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let cursorPosition = textArea.selectionStart;
        let textBeforeCursor = textArea.value.slice(0, cursorPosition);
        let textAfterCursor = textArea.value.slice(cursorPosition);
        let lastLineBreak = textBeforeCursor.lastIndexOf('\n') + 1;
        if (textBeforeCursor.slice(lastLineBreak).trim() !== '' && !textBeforeCursor.slice(lastLineBreak).includes('@!')&& !textBeforeCursor.slice(lastLineBreak).includes('!test!') && !/\+\S*$/.test(textBeforeCursor.slice(lastLineBreak))) {
            textArea.value = textBeforeCursor + '+口罩' + textAfterCursor;
            textArea.selectionStart = cursorPosition + 3;
            textArea.selectionEnd = cursorPosition + 3;
        }
    });

    allMaskButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
        lines.forEach(function(line, index) {
            if (line.trim() !== '' && !line.includes('@!')&& !line.includes('!test!')&& !/\+\S*$/.test(line)) {
                lines[index] += '+口罩';
            }
        });
        textArea.value = lines.join('\n');
    });

    guiYueTrophyButton.addEventListener('click', function() {
    let textArea = document.querySelector('#textdiv textarea');
    let cursorPosition = textArea.selectionStart;
    let textBeforeCursor = textArea.value.slice(0, cursorPosition);
    let textAfterCursor = textArea.value.slice(cursorPosition);
    let lastLineBreak = textBeforeCursor.lastIndexOf('\n') + 1;
    if (textBeforeCursor.slice(lastLineBreak).trim() !== '' && !textBeforeCursor.slice(lastLineBreak).includes('@!')&& !textBeforeCursor.slice(lastLineBreak).includes('!test!') && !/\+\S*$/.test(textBeforeCursor.slice(lastLineBreak))) {
        textArea.value = textBeforeCursor + '+桂月奖杯' + textAfterCursor;
        textArea.selectionStart = cursorPosition + 5;
        textArea.selectionEnd = cursorPosition + 5;
    }
    });

    allGuiYueTrophyButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
    lines.forEach(function(line, index) {
        if (line.trim() !== '' && !line.includes('@!')&& !line.includes('!test!')&& !/\+\S*$/.test(line)) {
            lines[index] += '+桂月奖杯';
        }
    });
    textArea.value = lines.join('\n');
    });

    xuanYueTrophyButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let cursorPosition = textArea.selectionStart;
        let textBeforeCursor = textArea.value.slice(0, cursorPosition);
        let textAfterCursor = textArea.value.slice(cursorPosition);
        let lastLineBreak = textBeforeCursor.lastIndexOf('\n') + 1;
    if (textBeforeCursor.slice(lastLineBreak).trim() !== '' && !textBeforeCursor.slice(lastLineBreak).includes('@!')&& !textBeforeCursor.slice(lastLineBreak).includes('!test!') && !/\+\S*$/.test(textBeforeCursor.slice(lastLineBreak))) {
        textArea.value = textBeforeCursor + '+玄月奖杯' + textAfterCursor;
        textArea.selectionStart = cursorPosition + 5;
        textArea.selectionEnd = cursorPosition + 5;
    }
    });

    allXuanYueTrophyButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
    lines.forEach(function(line, index) {
        if (line.trim() !== '' && !line.includes('@!')&& !line.includes('!test!')&& !/\+\S*$/.test(line)) {
            lines[index] += '+玄月奖杯';
        }
    });
    textArea.value = lines.join('\n');
    });

    clearWeaponsButton.addEventListener('click', function() {
        let textArea = document.querySelector('#textdiv textarea');
        let lines = textArea.value.split('\n');
    lines.forEach(function(line, index) {
            let plusIndex = line.lastIndexOf('+');
            if (plusIndex !== -1) {
                lines[index] = line.slice(0, plusIndex);
            }
        });
        textArea.value = lines.join('\n');
    });
})();



(function() {
    'use strict';

    // 为所有boss的SelRow元素添加点击事件监听器
    let bossSelRows = document.querySelectorAll(".bossSelRow");
    for (let i = 0; i < bossSelRows.length; i++) {
        let bossSelRow = bossSelRows[i];
        bossSelRow.addEventListener("click", function(event) {
            // 从 data-boss 属性中获取BOSS名称
            let bossName = event.target.getAttribute("data-boss");
            if (bossName) {
                // 将BOSS名称复制到剪贴板
                GM_setClipboard(bossName);
                // 显示警告消息
                alert("该BOSS的名字已经复制！");
            }
        });
    }
})();
