// ==UserScript==
// @version      0.5
// @description  自动刷律协培训课程更新版
// @author       自动刷律协培训课程
// @license      自动刷律协培训课程
// @match        https://lawschool.lawyerpass.com/course/*
// @match        https://lawschool.lawyerpass.com/center/*
// @icon         https://lawschool.lawyerpass.com/assets/images/favicon.ico
// @grant        自动刷律协培训课程
// @author       yagizaMJ
// @match        https://*.edu-xl.com/*
// @name         自动刷律协培训课程
// @grant        自动刷律协培训课程
// @grant      				GM_info
// @grant      				GM_getTab
// @grant      				GM_saveTab
// @grant      				GM_setValue
// @grant      				GM_getValue
// @grant      				unsafeWindow
// @grant      				GM_listValues
// @grant      				GM_deleteValue
// @grant      				GM_notification
// @grant      				GM_xmlhttpRequest
// @grant      				GM_getResourceText
// @grant      				GM_addValueChangeListener
// @grant      				GM_removeValueChangeListener
// @run-at     				document-start
// @namespace  				https://enncy.cn
// @homepage   				https://docs.ocsjs.com
// @source     				https://github.com/ocsjs/ocsjs
// @icon       				https://cdn.ocsjs.com/logo.png
// @connect    				enncy.cn
// @connect    				icodef.com
// @connect    				ocsjs.com
// @connect    				localhost
// @antifeature				payment
// @downloadURL https://update.greasyfork.org/scripts/518758/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%BE%8B%E5%8D%8F%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518758/%E8%87%AA%E5%8A%A8%E5%88%B7%E5%BE%8B%E5%8D%8F%E5%9F%B9%E8%AE%AD%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在顶级框架中
    if (window.self !== window.top) {
        return;
    }

    // 创建悬浮框元素
    var floatBox = document.createElement('div');
    floatBox.id = 'floatBox';
    floatBox.style.position = 'fixed';
    floatBox.style.top = '50px';
    floatBox.style.left = '50px';
    floatBox.style.width = '300px';
    floatBox.style.height = '200px';
    floatBox.style.background = 'linear-gradient(to bottom, #87CEEB, #ADD8E6)';
    floatBox.style.border = '1px solid #000';
    floatBox.style.borderRadius = '5px';
    floatBox.style.padding = '10px';
    floatBox.style.zIndex = '9999';
    floatBox.style.cursor = 'move';

    // 创建标题元素
    var title = document.createElement('h2');
    title.innerText = 'Float Box for 律师云课堂';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '18px';
    title.style.marginBottom = '10px';

    // 创建显示card-wrap数量的文字和选择框
    var cardWrapCount = document.getElementsByClassName('card-wrap').length;
    var cardWrapText = document.createElement('p');
    cardWrapText.innerText = 'card-wrap数量：' + cardWrapCount;
    cardWrapText.style.marginBottom = '10px';

    // 创建课件滑动开关和作业按钮
    var switchLabel = document.createElement('label');
    switchLabel.innerText = '课件：';
    switchLabel.style.marginRight = '10px';
    var switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    switchInput.style.marginRight = '10px';
    var homeworkButton = document.createElement('button');
    homeworkButton.innerText = '作业';
    homeworkButton.style.marginRight = '10px';

    // 创建启动按钮
    var startButton = document.createElement('button');
    startButton.innerText = '启动';
    startButton.style.margin = '10px auto';
    startButton.addEventListener('click', function() {
        alert('启动失败需要更新');
    });

    // 创建题库数量显示
    var questionBankCount = 888868;
    var questionBankText = document.createElement('p');
    questionBankText.innerText = '当前题库共：' + questionBankCount + '道';
    questionBankText.style.marginBottom = '10px';

    // 创建查看批量教程链接
    var tutorialLink = document.createElement('a');
    tutorialLink.href = 'https://flowus.cn/share/320cb53a-9376-4c35-987e-436e46f9b235';
    tutorialLink.innerText = '查看批量教程';
    tutorialLink.style.color = 'blue';

    // 将所有元素添加到悬浮框中
    floatBox.appendChild(title);
    floatBox.appendChild(cardWrapText);
    floatBox.appendChild(switchLabel);
    floatBox.appendChild(switchInput);
    floatBox.appendChild(homeworkButton);
    floatBox.appendChild(startButton);
    floatBox.appendChild(questionBankText);
    floatBox.appendChild(tutorialLink);

    // 将悬浮框添加到页面顶级框架中
    var topFrame = document.querySelector('html');
    topFrame.appendChild(floatBox);

    // 初始化拖动功能
    var isDragging = false;
    var offsetX = 0;
    var offsetY = 0;
    floatBox.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - floatBox.offsetLeft;
        offsetY = e.clientY - floatBox.offsetTop;
    });
    floatBox.addEventListener('mousemove', function(e) {
        if (isDragging) {
            floatBox.style.left = (e.clientX - offsetX) + 'px';
            floatBox.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    floatBox.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 添加样式
    GM_addStyle(`
        #floatBox {
            -webkit-app-region: no-drag;
        }
    `);
})();