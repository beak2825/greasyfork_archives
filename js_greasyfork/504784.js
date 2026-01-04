// ==UserScript==
// @name         Tamarin Web Tool
// @namespace    *
// @version      2024-08-23
// @description  Tamarin-prover web interface tool.
// @author       You
// @match        http://127.0.0.1:*/*
// @match        http://localhost:*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504784/Tamarin%20Web%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/504784/Tamarin%20Web%20Tool.meta.js
// ==/UserScript==




(function () {
    'use strict';

    let TamarinWebTool = {
        running: false,
        breakpoints: []
    }

    // 监听页面卸载事件
    window.onbeforeunload = function(e) {
        GM_setValue('TamarinWebTool', TamarinWebTool);
    };

    // 在页面加载时读取数据
    TamarinWebTool = GM_getValue('TamarinWebTool', TamarinWebTool);
    console.log("Loading Tamarin Web Tool Data: ", TamarinWebTool);

    function isTamarin() {
        let tamarin = document.querySelector('span.tamarin');
        return tamarin.textContent == "Tamarin"
    }

    function addBreakPoint(bp) {
        TamarinWebTool.breakpoints.push(bp);
    }

    function delBreakPoint(bp) {
        let index = TamarinWebTool.breakpoints.indexOf(bp);
        if (index !== -1) {
            TamarinWebTool.breakpoints.splice(index, 1);
        }
    }

    function clearBreakPoints() {
        TamarinWebTool.breakpoints = []
    }

    function isBreak(methods) {
        for (let method of methods) {
            let originalHTML = method.innerHTML;
            method.innerHTML = method.innerHTML.replaceAll('&nbsp;', '').replaceAll('<br>', '');
            let method_name = method.textContent.replaceAll('\n', '')
            method.innerHTML = originalHTML;

            for (let bp of TamarinWebTool.breakpoints) {
                let match = method_name.match(new RegExp(bp, ''));
                if (match) {
                    method.style.backgroundColor = "rgb(255, 245, 157)";
                    return true;
                }
            }
        }
        return false;
    }

    function run() {
        let xpath = '//a[@class="internal-link proof-method"]';
        let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let methods = []
        for (let i = 0; i < result.snapshotLength; i++) {
            methods.push(result.snapshotItem(i))
        }

        if (isBreak(methods)) {
            TamarinWebTool.running = false;
            return
        }

        if (methods.length > 0 && TamarinWebTool.running) {
            methods[0].click();
        } else {
            TamarinWebTool.running = false;
        }
    }

    function createMenuContent() {
        let content = document.createElement('div');
        content.style.padding = '10px';

        let buttons = document.createElement('div');

        let runButton = document.createElement('span');
        runButton.textContent = '▶️'; 
        runButton.style.fontSize = '24px';
        runButton.style.marginLeft = '36px';
        runButton.style.cursor = 'pointer';
        runButton.onclick = function() {
            TamarinWebTool.running = true;
            run();
        }

        let stopButton = document.createElement('span');
        stopButton.textContent = '⏸️'; 
        stopButton.style.fontSize = '24px';
        stopButton.style.marginRight = '36px';
        stopButton.style.float = 'right';
        stopButton.style.cursor = 'pointer';
        stopButton.onclick = function() {
            TamarinWebTool.running = false;
        }

        buttons.appendChild(runButton);
        buttons.appendChild(stopButton);
        content.appendChild(buttons);

        // 创建工具框容器
        let bpbox = document.createElement('div');
        bpbox.style.padding = '10px';
        bpbox.style.borderRadius = '5px';

        // 创建输入框
        let bpinput = document.createElement('input');
        bpinput.type = 'text';
        bpinput.placeholder = '输入断点';
        bpinput.style.marginRight = '10px';
        bpinput.style.width = '140px';

        // 创建添加按钮
        let addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.style.marginRight = '10px';
        addButton.onclick = function() {
            let text = bpinput.value.trim();
            if (text !== '') {
                addBreakPoint(text);

                let listItem = document.createElement('div');
                listItem.textContent = text;
                
                // 创建删除按钮
                let deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.style.marginLeft = '10px';
                deleteButton.onclick = function() {
                    delBreakPoint(text);
                    bplist.removeChild(listItem);
                };
                
                listItem.appendChild(deleteButton);
                bplist.appendChild(listItem);
                bpinput.value = ''; // 清空输入框
            }
        };

        // 创建展示框
        let bplist = document.createElement('div');
        bplist.style.marginTop = '10px';

        for (let text of TamarinWebTool.breakpoints) {
            let listItem = document.createElement('div');
            listItem.textContent = text;
                
            // 创建删除按钮
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.style.marginLeft = '10px';
            deleteButton.onclick = function() {
                delBreakPoint(text);
                bplist.removeChild(listItem);
            };

            listItem.appendChild(deleteButton);
            bplist.appendChild(listItem);
        }

        // 创建清除按钮
        let clearButton = document.createElement('button');
        clearButton.textContent = '清除';
        clearButton.onclick = function() {
            bplist.innerHTML = ''; // 清空展示框
            clearBreakPoints();
        };

        // 将元素添加到工具框
        bpbox.appendChild(bpinput);
        bpbox.appendChild(addButton);
        bpbox.appendChild(clearButton);
        bpbox.appendChild(bplist);

        content.appendChild(bpbox);
        return content;
    }

    function createDebugMenu() {
       // 创建一个新的 div 元素
        let floatingDiv = document.createElement('div');
        let header = document.createElement('div');
        let minimizeButton = document.createElement('button');

        // 设置 header 样式
        header.style.backgroundColor = '#2980b9';
        header.style.color = 'white';
        header.style.padding = '10px';
        header.style.cursor = 'move';
        header.style.borderTopLeftRadius = '10px';
        header.style.borderTopRightRadius = '10px';

        // 设置最小化按钮样式
        minimizeButton.textContent = '–';
        minimizeButton.style.float = 'right';
        minimizeButton.style.backgroundColor = '#2980b9';
        minimizeButton.style.border = 'none';
        minimizeButton.style.color = 'white';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.fontSize = '16px';
        minimizeButton.style.marginTop = '-10px';

        // 设置浮动 div 的样式
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.bottom = '20px';
        floatingDiv.style.right = '20px';
        floatingDiv.style.width = '300px';
        floatingDiv.style.height = '400px';
        floatingDiv.style.backgroundColor = '#3498db';
        floatingDiv.style.color = 'white';
        floatingDiv.style.borderRadius = '10px';
        floatingDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        floatingDiv.style.zIndex = '9999';

        // 创建content
        let content = createMenuContent()

        // 组合元素
        header.appendChild(minimizeButton);
        floatingDiv.appendChild(header);
        floatingDiv.appendChild(content);

        // 将 div 添加到页面 body 中
        document.body.appendChild(floatingDiv);

        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', function(event) {
            isDragging = true;
            offsetX = event.clientX - floatingDiv.getBoundingClientRect().left;
            offsetY = event.clientY - floatingDiv.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(event) {
            if (isDragging) {
                floatingDiv.style.left = (event.clientX - offsetX) + 'px';
                floatingDiv.style.top = (event.clientY - offsetY) + 'px';
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // 最小化功能
        minimizeButton.addEventListener('click', function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                minimizeButton.textContent = '–';
                floatingDiv.style.width = '300px';
                floatingDiv.style.height = '400px';
            } else {
                content.style.display = 'none';
                minimizeButton.textContent = '+';
                floatingDiv.style.width = '300px';
                floatingDiv.style.height = '30px';
            }
        });
    }


    if (isTamarin()) {
        createDebugMenu()
        if (TamarinWebTool.running) {
            run()
        }
    }
})();