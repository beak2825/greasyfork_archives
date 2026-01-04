// ==UserScript==
// @name         多语言翻译
// @namespace    https://orthogonalandparallel.github.io/
// @version      0.2
// @description  将网页按指定语言翻译
// @author       JinChen
// @match        *://*/*
// @grant        translate
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532297/%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/532297/%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* 毛玻璃拖动框 */
        .custom-glass {
            position: fixed;
            top: -150px;
            left: 100px;
            transform: translate(-50%, -50%);
            height: 300px;
            width: 200px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow:
                inset -0.75px -0.5px rgba(255, 255, 255, 0.1),
                inset +0.75px +0.5px rgba(255, 255, 255, 0.025),
                3px 2px 10px rgba(0, 0, 0, 0.25),
                inset 0px 0px 10px 5px rgba(255, 255, 255, 0.025),
                inset 0px 0px 40px 5px rgba(255, 255, 255, 0.025);
            position: relative;
            border-radius: 5px;
            overflow: hidden;
            z-index: 9999;
        }

        .custom-drag-me {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 44px;
            background-color: rgba(12, 13, 14, 0.75);
            color: rgba(255, 255, 255, 1);
            cursor: move;
        }

        /* 列表 */
        .custom-glass ul {
            list-style: none;
            padding: 15px;
            margin: 0;
            max-height: calc(100% - 30px);
            overflow-y: auto;
        }

        .custom-glass ul::-webkit-scrollbar {
            width: 6px;
        }

        .custom-glass ul::-webkit-scrollbar-thumb {
            border-radius: 3px;
        }

        .custom-glass ul li {
            padding: 12px 15px;
            margin: 8px 0;
            border-radius: 6px;
            transition: all 0.3s ease;
        }

        .custom-glass ul li:hover {
            background-color: rgba(12, 13, 14, 0.75);
            color: rgba(255, 255, 255, 1);
            transform: translateX(5px);
        }

        .custom-glass ul li a {
            color: rgba(0, 0, 0, 0.8);
            text-decoration: none;
            display: block;
            font-size: 14px;
            font-weight: 500;
        }

        .custom-glass ul li:hover a {
            color: rgba(255, 255, 255, 1);
        }

    `;
    document.head.appendChild(style);

    // ------- 页面元素 begin -------

    // 创建毛玻璃窗口
    const glass = document.createElement('div');
    glass.className = 'custom-glass ignore';

    const dragMe = document.createElement('div');
    dragMe.className = 'custom-drag-me';
    dragMe.textContent = '多语言翻译';

    // 创建列表
    const ul = document.createElement('ul');
    const items = [
        { text: 'English', lang: 'english' },
        { text: '简体中文', lang: 'chinese_simplified' },
        { text: '繁體中文', lang: 'chinese_traditional' }
    ];

    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `javascript:translate.changeLanguage('${item.lang}');`;
        a.textContent = item.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    glass.appendChild(dragMe);
    glass.appendChild(ul);

    const topBody = window.top.document.body;
    topBody.appendChild(glass);

    // ------- 页面元素 end -------

    // ------- 拖拽功能 begin -------
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragMe.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === dragMe) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, glass);
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
    // ------- 拖拽功能 end -------

    // ------- 翻译功能 begin -------

    // 注入 translate.js 脚本
    const translateScript = document.createElement('script');
    translateScript.src = 'https://cdn.staticfile.net/translate.js/3.12.0/translate.js';
    document.head.appendChild(translateScript);

    // 初始化 translate.js 脚本加载完成后
    translateScript.onload = function() {
        const initScript = document.createElement('script');
        initScript.textContent = `
            translate.selectLanguageTag.show = false; //不出现的select的选择语言
            translate.service.use('client.edge'); //设置机器翻译服务通道
            translate.execute();
        `;
        document.body.appendChild(initScript);
    };

    // ------- 翻译功能 end -------

})();