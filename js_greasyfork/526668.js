// ==UserScript==
// @name         fuyu2022读漫屋章节获取
// @namespace    https://github.com/fuyu2022
// @version      1.0.0
// @description  获取章节信息
// @author       fuyu
// @match        https://www.dumanwu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dumanwu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526668/fuyu2022%E8%AF%BB%E6%BC%AB%E5%B1%8B%E7%AB%A0%E8%8A%82%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526668/fuyu2022%E8%AF%BB%E6%BC%AB%E5%B1%8B%E7%AB%A0%E8%8A%82%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var selector = ("body > div > div > div.forminfo > div.chapterList > div.chapterlistload > ul > a")
    var isTextBox = 0;
    var textBox;
    (function(){
    let loadmore = document.querySelector("body > div > div > div.forminfo > div.chapterList > div.chapterlistload > div")
        let loadbtn = document.querySelector("body > div > div > div.forminfo > div.chapterList > div.chapterlistload > div > button")
        let id=setInterval(()=>{
            if(loadmore.style.display==='none'){
                clearInterval(id);
                (function(){
                    document.querySelector("body > div.view-body > div > div.forminfo > div.chapterList > div.topBar > i").click()
                })();
            }
            else{
                loadbtn.click();
            }

        },100)
    })();
    function geturl() {
        let comicName=document.querySelector("body > div > div > div.forminfo > div.comicInfo > div.detinfo > h1").textContent.trim();
        let result = {};
        result[comicName] = [];
        let chaptersArray=document.querySelectorAll(selector);

        chaptersArray.forEach(
            (aTag,index) => {
                let title = aTag.querySelector("li").textContent.trim();
                let href = aTag.href; // 获取 a 标签的 href 属性
                if (title) {
                    let chapter = [(index+1)+"_"+title, href]
                    result[comicName].push(chapter)
                }
            }
        );


        console.log(result);
        let resJSON = JSON.stringify(result, null, 2);

        // 创建一个悬浮的只读文本框
        textBox = document.createElement('textarea');
        textBox.value = resJSON; // 设置文本框的值为 resJSON
        textBox.style.position = 'fixed';
        textBox.style.top = '120px'; // 离按钮稍微远一点
        textBox.style.right = '10px';
        textBox.style.width = '300px';
        textBox.style.height = '200px';
        textBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        textBox.style.color = 'white';
        textBox.style.border = '1px solid rgba(255, 255, 255, 0.5)';
        textBox.style.borderRadius = '8px';
        textBox.style.padding = '10px';
        textBox.style.resize = 'none'; // 禁止手动调整大小
        textBox.style.zIndex = '9998'; // 确保文本框在按钮下方
        //textBox.setAttribute('readonly', true); // 设置为只读

        document.body.appendChild(textBox);
    }

    function addBtn(){
        // 创建悬浮按钮
        const button = document.createElement('div');
        button.innerText = '读漫屋';

        // 基础样式
        Object.assign(button.style, {
            position: 'fixed',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 0, 0, 0.5)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: '9999',
            userSelect: 'none',
            transition: 'all 0.1s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 添加阴影提升悬浮感
            border: 'none', // 移除默认边框
            outline: 'none' // 移除点击时的轮廓线
        });

        // 初始位置居中
        button.style.left = `${100}px`;
        button.style.top = '10px';

        // 拖动相关变量
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // 鼠标按下事件（包括拖动和按压效果）
        button.addEventListener('mousedown', (e) => {
            // 触发按压效果
            button.style.transform = 'scale(0.9)';
            button.style.background = 'rgba(255, 0, 0, 0.7)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

            // 初始化拖动
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;

            // 添加移动和松开事件监听
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // 鼠标移动处理拖动
        function onMouseMove(e) {
            if (!isDragging) return;

            // 计算新位置（限制在窗口范围内）
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // 边界限制
            newX = Math.max(0, Math.min(newX, window.innerWidth - button.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - button.offsetHeight));

            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
        }

        // 鼠标松开处理
        function onMouseUp() {
            if (isDragging) {
                isDragging = false;
                // 恢复按钮状态
                button.style.transform = 'scale(1)';
                button.style.background = 'rgba(255, 0, 0, 0.5)';
                button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }

            // 移除事件监听
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // 防止鼠标移出时卡在按下状态
        button.addEventListener('mouseleave', () => {
            if (!isDragging) {
                button.style.transform = 'scale(1)';
                button.style.background = 'rgba(255, 0, 0, 0.5)';
            }
        });

        document.body.appendChild(button);
        return button
    }

    const button = addBtn();
    button.id="mytest";
    console.log(button);
    button.addEventListener('click', ()=>{
        if (isTextBox){
            document.body.removeChild(textBox);
            isTextBox = 0;
        }
        else{
            geturl();
            document.body.appendChild(textBox);
            isTextBox = 1;
        }
    });

})();