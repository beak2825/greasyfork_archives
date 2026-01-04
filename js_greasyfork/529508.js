// ==UserScript==
// @name         JAVRemark
// @version      1.0
// @author       Xiang
// @description  根据本地文件突出显示页面中的电影代码并显示自定义备注信息
// @license      MIT
// @icon         https://www.javbus.com/favicon.ico
// @include      /^https:\/\/(\w*\.)?JavBus(\d)*\.com.*$/
// @match        *://*.javbus.com/*
// @match        *://*.javlibrary.com/*
// @match        *://*.javdb.com/*
// @exclude      *://*.javlibrary.com/*/login.php
// @exclude      *://*.javlibrary.com/login.php
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace https://greasyfork.org/users/1407672
// @downloadURL https://update.greasyfork.org/scripts/529508/JAVRemark.user.js
// @updateURL https://update.greasyfork.org/scripts/529508/JAVRemark.meta.js
// ==/UserScript==

(function () {
    'use strict'; // 使用严格模式，提高代码质量和性能

    // 存储从txt文件中读取的电影代码和备注
    // 数据格式: [{code: "ABC-123", comment: "这是备注", line: "ABC-123:这是备注"}]
    let movieData = [];

    // 创建"文件"按钮 - 用于上传包含电影代码和备注的txt文件
    function createFileButton() {
        // 创建一个按钮元素
        const fileButton = document.createElement('button');
        // 设置按钮文字为"文件"
        fileButton.textContent = '文件';
        // 设置按钮样式 - 可以修改这里的CSS来自定义按钮外观
        // position: fixed - 固定位置不随滚动而变化
        // bottom: 20px; left: 20px - 位于页面左下角
        // z-index: 9999 - 确保显示在最上层
        // padding: 8px 12px - 内边距，影响按钮大小
        // background-color: #4CAF50 - 背景颜色（绿色）
        // color: white - 文字颜色（白色）
        fileButton.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; padding: 8px 12px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
        // 将按钮添加到页面
        document.body.appendChild(fileButton);

        // 为按钮添加点击事件监听器
        fileButton.addEventListener('click', function () {
            // 创建一个隐藏的文件输入框
            const fileInput = document.createElement('input');
            // 设置为文件选择类型
            fileInput.type = 'file';
            // 只接受txt文本文件
            fileInput.accept = '.txt';
            // 隐藏文件输入框
            fileInput.style.display = 'none';
            // 添加到页面
            document.body.appendChild(fileInput);

            // 模拟点击文件输入框，弹出文件选择对话框
            fileInput.click();

            // 监听文件选择事件
            fileInput.addEventListener('change', function (event) {
                // 获取选择的文件
                const file = event.target.files[0];
                // 如果有选择文件
                if (file) {
                    // 创建文件读取器
                    const reader = new FileReader();
                    // 文件读取完成后的回调
                    reader.onload = function (e) {
                        // 解析文件内容，提取电影代码和备注
                        parseMovieData(e.target.result);
                        // 在页面上查找匹配的代码并高亮显示
                        matchAndHighlight();
                    };
                    // 以文本方式读取文件
                    reader.readAsText(file);
                }
                // 移除文件输入框
                document.body.removeChild(fileInput);
            });
        });
    }

    // 创建"备注"按钮 - 用于显示/隐藏包含匹配信息的浮动窗口
    function createListButton() {
        // 创建一个按钮元素
        const listButton = document.createElement('button');
        // 设置按钮文字为"备注"
        listButton.textContent = '备注';
        // 设置按钮样式 - 可以修改这里的CSS来自定义按钮外观
        // position: fixed - 固定位置不随滚动而变化
        // bottom: 20px; left: 100px - 位于页面左下角，在"文件"按钮右侧
        // z-index: 9999 - 确保显示在最上层
        // background-color: #2196F3 - 背景颜色（蓝色）
        listButton.style.cssText = 'position: fixed; bottom: 20px; left: 100px; z-index: 9999; padding: 8px 12px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;';
        // 将按钮添加到页面
        document.body.appendChild(listButton);

        // 初始状态 - 窗口和按钮是否可见
        let isElementsVisible = true;

        // 为按钮添加点击事件监听器
        listButton.addEventListener('click', function () {
            // 获取浮动窗口元素
            const floatingWindow = document.getElementById('movie-info-window');
            // 获取其他按钮元素
            const fileButton = document.querySelector('button[style*="background-color: #4CAF50"]');
            const clearButton = document.querySelector('button[style*="background-color: #F44336"]');
            const addButton = document.querySelector('button[style*="background-color: #FF9800"]');

            // 切换元素的显示状态
            if (isElementsVisible) {
                // 如果当前可见，则隐藏所有元素
                if (floatingWindow) floatingWindow.style.display = 'none';
                if (fileButton) fileButton.style.display = 'none';
                if (clearButton) clearButton.style.display = 'none';
                if (addButton) addButton.style.display = 'none';
                isElementsVisible = false;
            } else {
                // 如果当前隐藏，则显示所有元素
                if (floatingWindow) {
                    floatingWindow.style.display = 'block';
                } else {
                    // 如果窗口不存在则创建
                    createFloatingWindow();
                }
                if (fileButton) fileButton.style.display = 'block';
                if (clearButton) clearButton.style.display = 'block';
                if (addButton) addButton.style.display = 'block';
                isElementsVisible = true;
            }
        });
    }

    // 创建"清除"按钮 - 用于清除所有已加载的电影数据
    function createClearButton() {
        // 创建一个按钮元素
        const clearButton = document.createElement('div');
        // 设置按钮文本
        clearButton.textContent = '清除';
        // 设置按钮样式 - 可以自定义
        clearButton.style.cssText = `
            width: 30px;
            height: 30px;
            background-color: #d9534f;
            color: white;
            text-align: center;
            line-height: 30px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 5px;
            font-size: 12px;
            transition: background-color 0.3s;
        `;

        // 为按钮添加点击事件监听器
        clearButton.addEventListener('click', function () {
            // 弹出确认对话框，防止意外清除数据
            if (confirm('确定要清除所有已加载的数据吗？这将删除您上传的所有电影信息。')) {
                // 从GM存储中删除保存的数据
                GM_deleteValue('JAVRemark_movieData');
                // 清空内存中的数据
                movieData = [];
                console.log('已清除所有电影数据');

                // 更新浮动窗口内容，显示数据已清除的提示
                const floatingWindow = document.getElementById('movie-info-window');
                if (floatingWindow) {
                    floatingWindow.innerHTML = '<h3 style="margin-top: 0; color: #f8f8f8; border-bottom: 1px solid #555; padding-bottom: 5px;">数据已清除</h3><p style="color: #ccc;">请点击"文件"按钮重新上传数据</p>';
                }

                // 移除页面上所有高亮标记
                document.querySelectorAll('span[style*="background-color: yellow"]').forEach(el => {
                    // 创建一个文本节点替换高亮元素
                    const text = document.createTextNode(el.textContent);
                    el.parentNode.replaceChild(text, el);
                });
            }
        });

        return clearButton;
    }

    // 创建"添加"按钮 - 用于手动添加新的电影代码和备注
    function createAddButton() {
        // 创建一个按钮元素
        const addButton = document.createElement('button');
        // 设置按钮文字为"添加"
        addButton.textContent = '添加';
        // 设置按钮样式 - 可以修改这里的CSS来自定义按钮外观
        // position: fixed - 固定位置不随滚动而变化
        // bottom: 20px; left: 260px - 位于页面左下角，在"清除"按钮右侧
        // background-color: #FF9800 - 背景颜色（橙色）
        addButton.style.cssText = 'position: fixed; bottom: 20px; left: 260px; z-index: 9999; padding: 8px 12px; background-color: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;';
        // 将按钮添加到页面
        document.body.appendChild(addButton);

        // 为按钮添加点击事件监听器
        addButton.addEventListener('click', function () {
            // 显示添加电影代码和备注的对话框
            showAddDialog();
        });
    }

    // 显示添加电影代码和备注的对话框
    // 可选参数code：如果提供，则预填充电影代码
    // 这样当点击页面上未匹配的电影代码时，可以自动填充代码
    function showAddDialog(code = '') {
        // 创建一个模态对话框
        const dialogOverlay = document.createElement('div');
        // 设置对话框样式 - 半透明黑色背景覆盖整个页面
        dialogOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex; justify-content: center; align-items: center;';

        // 创建对话框内容
        const dialogContent = document.createElement('div');
        // 设置对话框内容样式 - 可以修改这里的CSS来自定义对话框外观
        dialogContent.style.cssText = 'background-color: #333; color: white; padding: 20px; border-radius: 5px; width: 350px; box-shadow: 0 0 10px rgba(0,0,0,0.5);';

        // 设置对话框标题和内容
        // value="${code}" - 如果传入了代码参数，预填充到输入框中
        dialogContent.innerHTML = `
            <h3 style="margin-top: 0; color: #f8f8f8; border-bottom: 1px solid #555; padding-bottom: 10px;">添加新条目</h3>
            <div style="margin-bottom: 15px;">
                <label for="movie-code" style="display: block; margin-bottom: 5px;">电影代码:</label>
                <input type="text" id="movie-code" style="width: 100%; padding: 8px; box-sizing: border-box; background-color: #444; color: white; border: 1px solid #555; border-radius: 3px;" placeholder="例如: ABC-123" value="${code}">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="movie-comment" style="display: block; margin-bottom: 5px;">备注信息:</label>
                <textarea id="movie-comment" style="width: 100%; min-height: 100px; padding: 8px; box-sizing: border-box; background-color: #444; color: white; border: 1px solid #555; border-radius: 3px;" placeholder="输入备注信息..."></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button id="cancel-add" style="background-color: #777; color: white; border: none; border-radius: 3px; padding: 8px 15px; cursor: pointer; margin-right: 10px;">取消</button>
                <button id="confirm-add" style="background-color: #FF9800; color: white; border: none; border-radius: 3px; padding: 8px 15px; cursor: pointer;">添加</button>
            </div>
        `;

        // 将对话框内容添加到对话框中
        dialogOverlay.appendChild(dialogContent);
        // 将对话框添加到页面
        document.body.appendChild(dialogOverlay);

        // 获取对话框中的元素
        const codeInput = document.getElementById('movie-code');
        const commentInput = document.getElementById('movie-comment');
        const cancelButton = document.getElementById('cancel-add');
        const confirmButton = document.getElementById('confirm-add');

        // 为取消按钮添加点击事件
        cancelButton.addEventListener('click', function () {
            // 移除对话框
            document.body.removeChild(dialogOverlay);
        });

        // 为确认按钮添加点击事件
        confirmButton.addEventListener('click', function () {
            // 获取输入的电影代码和备注
            const code = codeInput.value.trim();
            const comment = commentInput.value.trim();

            // 验证输入
            if (!code) {
                alert('请输入电影代码');
                return;
            }

            // 添加或更新数据到movieData数组
            let exists = false;
            for (let i = 0; i < movieData.length; i++) {
                // 不区分大小写比较代码
                if (movieData[i].code.toLowerCase() === code.toLowerCase()) {
                    // 代码已存在，更新现有记录
                    movieData[i].comment = comment;
                    movieData[i].line = `${code}:${comment}`;
                    movieData[i].lastModified = Date.now(); // 添加最后修改时间
                    exists = true;
                    break;
                }
            }

            // 如果代码不存在，添加新记录
            if (!exists) {
                // 创建新的电影数据对象
                const newMovie = {
                    code: code,
                    comment: comment,
                    line: `${code}:${comment}`,
                    lastModified: Date.now() // 添加最后修改时间
                };
                // 添加到电影数据数组
                movieData.push(newMovie);
            }

            // 保存到GM存储
            try {
                GM_setValue('JAVRemark_movieData', JSON.stringify(movieData));
                console.log('已添加/更新电影数据并保存到GM存储');
            } catch (e) {
                console.error('保存到GM存储失败:', e);
            }

            // 移除对话框
            document.body.removeChild(dialogOverlay);

            // 重新进行匹配和高亮显示
            matchAndHighlight();
        });

        // 设置焦点到代码输入框
        setTimeout(() => {
            // 如果有预填写的代码，焦点设置到备注输入框
            // 这样当点击页面上的未匹配代码时，用户可以直接输入备注，不需要再输入代码
            if (code) {
                commentInput.focus();
            } else {
                codeInput.focus();
            }
        }, 100);
    }

    // 解析上传的txt文件内容并保存到localStorage
    // 文件格式要求：每行一条记录，格式为 "代码:备注"，例如 "ABC-123:这是一个备注"
    function parseMovieData(content) {
        // 清空现有数据
        movieData = [];
        // 按行分割内容
        const lines = content.split('\n');
        // 记录当前时间作为导入时间
        const importTime = Date.now();
        // 遍历每一行
        for (const line of lines) {
            // 跳过空行
            if (line.trim() === '') continue;

            // 按冒号分割代码和备注
            const parts = line.split(':');
            // 确保至少有代码和备注两部分
            if (parts.length >= 2) {
                // 提取代码（第一部分），并去除前后空格
                const code = parts[0].trim();
                // 提取备注（剩余部分合并），并去除前后空格
                // 使用join是为了处理备注中可能包含冒号的情况
                const comment = parts.slice(1).join(':').trim();
                // 将代码、备注和原始行添加到数据集，并添加导入时间作为lastModified
                movieData.push({ code, comment, line, lastModified: importTime });
            }
        }

        // 存储到GM_setValue以便在不同网站之间共享数据
        try {
            // 使用'JAVRemark_movieData'作为存储键名
            GM_setValue('JAVRemark_movieData', JSON.stringify(movieData));
            console.log('已保存电影数据到GM存储');
        } catch (e) {
            // 存储失败时输出错误信息
            console.error('保存到GM存储失败:', e);
        }

        console.log('已加载电影数据:', movieData.length, '条记录');
    }

    // 从GM存储加载数据
    // 当页面加载时自动调用，恢复之前存储的电影数据
    function loadMovieDataFromStorage() {
        try {
            // 从GM存储获取数据
            // 'JAVRemark_movieData'是存储键名，必须与parseMovieData函数中使用的一致
            const storedData = GM_getValue('JAVRemark_movieData');
            // 如果有数据
            if (storedData) {
                // 解析JSON数据
                const parsedData = JSON.parse(storedData);

                // 验证数据格式是否正确
                // 确保数据是数组且不为空
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    // 验证每条数据是否包含必要的字段
                    const isValidFormat = parsedData.every(item =>
                        // 检查每一项是否为对象
                        item && typeof item === 'object' &&
                        // 检查是否包含code字段且为字符串
                        'code' in item && typeof item.code === 'string' &&
                        // 检查是否包含comment字段且为字符串
                        'comment' in item && typeof item.comment === 'string'
                    );

                    // 如果数据格式有效
                    if (isValidFormat) {
                        // 将数据加载到movieData变量
                        movieData = parsedData;
                        console.log('从GM存储加载到电影数据:', movieData.length, '条记录');
                        return true;
                    } else {
                        // 数据格式无效，删除存储的数据
                        console.warn('GM存储中的数据格式不正确，将重新初始化');
                        GM_deleteValue('JAVRemark_movieData');
                    }
                } else {
                    // 数据不是有效数组，输出警告
                    console.warn('GM存储中的数据不是有效数组，将重新初始化');
                }
            }
        } catch (e) {
            // 读取出错，输出错误信息
            console.error('从GM存储加载数据失败:', e);
            // 清除可能损坏的数据
            GM_deleteValue('JAVRemark_movieData');
        }
        // 加载失败返回false
        return false;
    }

    // 从页面标题或URL提取电影代码
    // 用于提取当前页面可能包含的电影代码
    function getMovieCodeFromPage() {
        // 常见的电影代码格式正则表达式 (例如: ABC-123, ABCD-123)
        // 如果需要匹配其他格式，可以修改这个正则表达式
        const codeRegex = /[a-zA-Z]+-\d+/g;

        // 获取页面标题
        const title = document.title;
        // 获取页面URL
        const url = window.location.href;

        // 从标题中提取电影代码
        let matches = title.match(codeRegex);
        // 如果在标题中找到匹配的代码，返回结果
        if (matches && matches.length > 0) {
            return matches;
        }

        // 如果标题中没有找到，从URL中提取电影代码
        matches = url.match(codeRegex);
        // 如果在URL中找到匹配的代码，返回结果
        if (matches && matches.length > 0) {
            return matches;
        }

        // 没有找到任何匹配的代码，返回空数组
        return [];
    }

    // 创建悬浮窗口
    // 用于显示匹配的电影信息
    function createFloatingWindow() {
        // 创建一个div元素作为浮动窗口
        const floatingWindow = document.createElement('div');
        // 设置窗口的ID，用于后续获取窗口元素
        floatingWindow.id = 'movie-info-window';

        // 设置窗口样式 - 可以修改这些样式来自定义窗口外观
        // position: fixed - 固定位置不随滚动而变化
        floatingWindow.style.position = 'fixed';
        // left: 20px - 位于页面左侧
        floatingWindow.style.left = '60px';  // 调整位置，为左侧按钮栏留出空间
        // top: 50px - 距离页面顶部50px
        floatingWindow.style.top = '50px';
        // width: 300px - 窗口宽度
        floatingWindow.style.width = '300px';
        // maxHeight: 80vh - 最大高度为视口高度的80%
        floatingWindow.style.maxHeight = '80vh';
        // backgroundColor: rgba(0, 0, 0, 0.8) - 半透明黑色背景
        floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        // color: white - 文字颜色为白色
        floatingWindow.style.color = 'white';
        // padding: 10px - 内边距
        floatingWindow.style.padding = '10px';
        // borderRadius: 5px - 圆角边框
        floatingWindow.style.borderRadius = '5px';
        // zIndex: 1000 - 确保显示在页面内容上方
        floatingWindow.style.zIndex = '1000';
        // overflowY: auto - 内容过多时显示垂直滚动条
        floatingWindow.style.overflowY = 'auto';
        // fontSize: 12px - 字体大小
        floatingWindow.style.fontSize = '12px';
        // boxShadow - 添加阴影效果
        floatingWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        // resize: both - 允许用户调整窗口大小
        floatingWindow.style.resize = 'both';
        // overflow: auto - 配合resize使用，允许内容滚动
        floatingWindow.style.overflow = 'auto';
        // 默认显示窗口
        // 如果希望默认隐藏，改为'none'
        floatingWindow.style.display = 'block';

        // 将浮动窗口添加到页面
        document.body.appendChild(floatingWindow);

        // 创建左侧按钮栏
        createSideButtonBar();

        // 返回创建的窗口元素，供其他函数使用
        return floatingWindow;
    }

    // 创建左侧按钮栏
    function createSideButtonBar() {
        // 创建一个div作为按钮容器
        const buttonBar = document.createElement('div');
        buttonBar.id = 'side-button-bar';
        buttonBar.style.cssText = 'position: fixed; left: 10px; top: 50px; z-index: 1001; display: flex; flex-direction: column; gap: 10px;';

        // 创建四个按钮，按指定顺序排列：备注、文件、清除、添加

        // 备注按钮
        const listButton = document.createElement('button');
        listButton.textContent = '备注';
        listButton.style.cssText = 'padding: 3px 8px; background-color: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';

        // 文件按钮
        const fileButton = document.createElement('button');
        fileButton.textContent = '文件';
        fileButton.style.cssText = 'padding: 3px 8px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';

        // 清除按钮
        const clearButton = document.createElement('button');
        clearButton.textContent = '清除';
        clearButton.style.cssText = 'padding: 3px 8px; background-color: #F44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';

        // 添加按钮
        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.style.cssText = 'padding: 3px 8px; background-color: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;';

        // 添加按钮到容器
        buttonBar.appendChild(listButton);
        buttonBar.appendChild(fileButton);
        buttonBar.appendChild(clearButton);
        buttonBar.appendChild(addButton);

        // 添加按钮容器到页面
        document.body.appendChild(buttonBar);

        // 备注按钮事件 - 控制浮动窗口的显示/隐藏
        let isWindowVisible = true;
        listButton.addEventListener('click', function () {
            const floatingWindow = document.getElementById('movie-info-window');

            // 切换显示状态
            if (isWindowVisible) {
                // 隐藏浮动窗口
                if (floatingWindow) {
                    floatingWindow.style.display = 'none';
                }
                isWindowVisible = false;
            } else {
                // 显示浮动窗口
                if (floatingWindow) {
                    floatingWindow.style.display = 'block';
                } else {
                    createFloatingWindow();
                }
                isWindowVisible = true;
            }
        });

        // 文件按钮事件
        fileButton.addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.txt';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.click();

            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        parseMovieData(e.target.result);
                        matchAndHighlight();
                    };
                    reader.readAsText(file);
                }
                document.body.removeChild(fileInput);
            });
        });

        // 清除按钮事件
        clearButton.addEventListener('click', function () {
            if (confirm('确定要清除所有已加载的数据吗？这将删除您上传的所有电影信息。')) {
                GM_deleteValue('JAVRemark_movieData');
                movieData = [];
                console.log('已清除所有电影数据');

                const floatingWindow = document.getElementById('movie-info-window');
                if (floatingWindow) {
                    updateFloatingWindow([]);
                }

                document.querySelectorAll('span[style*="background-color: yellow"]').forEach(el => {
                    const text = document.createTextNode(el.textContent);
                    el.parentNode.replaceChild(text, el);
                });
            }
        });

        // 添加按钮事件
        addButton.addEventListener('click', function () {
            showAddDialog();
        });
    }

    // 更新悬浮窗口内容
    // 根据匹配结果显示电影信息
    function updateFloatingWindow(matches) {
        // 获取已存在的浮动窗口，如果不存在则创建新窗口
        const floatingWindow = document.getElementById('movie-info-window') || createFloatingWindow();

        // 提取当前页面可能的电影代码
        const pageCodes = getMovieCodeFromPage();
        const currentPageCode = pageCodes.length > 0 ? pageCodes[0] : '';

        // 显示匹配信息标题和所有按钮
        floatingWindow.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">
                <h3 style="margin: 0; color: #f8f8f8;">匹配信息</h3>
                <div style="display: flex; gap: 5px;">
                    <button id="file-btn-window" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; font-size: 12px;">文件</button>
                    <button id="clear-btn-window" style="background-color: #F44336; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; font-size: 12px;">清除</button>
                    <button id="add-btn-window" style="background-color: #FF9800; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; font-size: 12px;">添加</button>
                    <button id="export-remarks-btn" style="background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; font-size: 12px;">导出</button>
                </div>
            </div>`;

        // 添加按钮的点击事件
        document.getElementById('export-remarks-btn').addEventListener('click', exportToTxtFile);

        // 文件按钮事件
        document.getElementById('file-btn-window').addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.txt';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.click();

            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        parseMovieData(e.target.result);
                        matchAndHighlight();
                    };
                    reader.readAsText(file);
                }
                document.body.removeChild(fileInput);
            });
        });

        // 清除按钮事件
        document.getElementById('clear-btn-window').addEventListener('click', function () {
            if (confirm('确定要清除所有已加载的数据吗？这将删除您上传的所有电影信息。')) {
                GM_deleteValue('JAVRemark_movieData');
                movieData = [];
                console.log('已清除所有电影数据');

                const floatingWindow = document.getElementById('movie-info-window');
                if (floatingWindow) {
                    updateFloatingWindow([]);
                }

                document.querySelectorAll('span[style*="background-color: yellow"]').forEach(el => {
                    const text = document.createTextNode(el.textContent);
                    el.parentNode.replaceChild(text, el);
                });
            }
        });

        // 添加按钮事件
        document.getElementById('add-btn-window').addEventListener('click', function () {
            showAddDialog();
        });

        // 如果movieData为空数组，说明没有上传文件
        if (movieData.length === 0) {
            // 创建一个div元素来显示未上传文件的提示
            const infoDiv = document.createElement('div');
            // 设置div样式
            infoDiv.style.cssText = 'margin-bottom: 10px; padding: 5px; background-color: rgba(50, 50, 50, 0.7); border-radius: 3px;';

            // 设置div内容 - 显示提示信息
            infoDiv.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <strong style="color: #ffcc00;">当前数据文件不存在，请点击"文件"上传数据文件</strong>
                </div>
                <div style="color: #e0e0e0;">上传包含电影代码和备注的数据文件后，将在此处显示匹配信息</div>`;

            // 将信息div添加到浮动窗口
            floatingWindow.appendChild(infoDiv);
        }
        // 如果有匹配项
        else if (matches.length > 0) {
            // 遍历所有匹配项并添加到窗口中
            for (const match of matches) {
                // 创建一个div元素来显示每条匹配信息
                const infoDiv = document.createElement('div');
                // 设置div样式 - 可以修改这里的CSS来自定义每条信息的外观
                infoDiv.style.cssText = 'margin-bottom: 10px; padding: 5px; background-color: rgba(50, 50, 50, 0.7); border-radius: 3px;';

                // 设置div内容 - 显示电影代码、备注和编辑按钮
                infoDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <strong style="color: #ffcc00;">${match.code}</strong>
                        <button class="edit-remark-btn" data-code="${match.code}" style="background-color: #2196F3; color: white; border: none; border-radius: 3px; padding: 2px 5px; cursor: pointer; font-size: 10px;">编辑</button>
                    </div>
                    <div class="remark-content" data-code="${match.code}" style="color: #e0e0e0;">${match.comment}</div>`;

                // 将信息div添加到浮动窗口
                floatingWindow.appendChild(infoDiv);
            }
        }
        // 如果没有匹配项但数据文件存在
        else {
            // 创建一个div元素来显示未匹配信息
            const infoDiv = document.createElement('div');
            // 设置div样式
            infoDiv.style.cssText = 'margin-bottom: 10px; padding: 5px; background-color: rgba(50, 50, 50, 0.7); border-radius: 3px;';

            // 设置div内容 - 显示未找到匹配信息，并添加"添加"按钮
            infoDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong style="color: #ffcc00;">当前页面未发现匹配的电影代码</strong>
                    <button class="add-remark-btn" data-code="${currentPageCode}" style="background-color: #FF9800; color: white; border: none; border-radius: 3px; padding: 2px 5px; cursor: pointer; font-size: 10px;">添加</button>
                </div>
                <div class="remark-content" data-code="${currentPageCode}" style="color: #e0e0e0;">无备注信息</div>`;

            // 将信息div添加到浮动窗口
            floatingWindow.appendChild(infoDiv);
        }

        // 添加编辑功能的事件监听器
        // 使用setTimeout确保DOM元素已经添加到页面
        setTimeout(() => {
            // 为所有编辑按钮添加点击事件
            document.querySelectorAll('.edit-remark-btn').forEach(button => {
                button.addEventListener('click', function () {
                    // 检查是否已经处于编辑模式
                    if (this.textContent === '取消保存') {
                        // 如果当前是"取消保存"状态，点击后恢复备注显示（相当于取消编辑）
                        const code = this.getAttribute('data-code');
                        const remarkContentDiv = document.querySelector(`.remark-content[data-code="${code}"]`);
                        const currentComment = remarkContentDiv.getAttribute('data-original-comment') || '';

                        // 恢复原来的备注显示
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = currentComment;
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 将按钮文本改回"编辑"
                        this.textContent = '编辑';
                        return;
                    }

                    // 获取当前点击的电影代码
                    const code = this.getAttribute('data-code');
                    // 找到对应的备注内容div
                    const remarkContentDiv = document.querySelector(`.remark-content[data-code="${code}"]`);
                    // 获取当前备注内容
                    const currentComment = remarkContentDiv.textContent;

                    // 存储原始备注内容，以便取消时恢复
                    remarkContentDiv.setAttribute('data-original-comment', currentComment);

                    // 将编辑按钮文本改为"取消保存"
                    this.textContent = '取消保存';

                    // 创建一个文本输入框替换备注内容
                    // 可以修改这里的样式来自定义输入框外观
                    const textarea = document.createElement('textarea');
                    textarea.value = currentComment; // 设置初始值为当前备注
                    textarea.style.cssText = 'width: 100%; min-height: 50px; background-color: #333; color: white; border: 1px solid #555; border-radius: 3px; padding: 5px; margin-top: 5px; font-size: 12px;';

                    // 创建保存和取消按钮的容器
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 5px;';

                    // 创建保存按钮 - 可以修改这里的样式
                    const saveButton = document.createElement('button');
                    saveButton.textContent = '保存';
                    saveButton.style.cssText = 'background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; margin-left: 5px;';

                    // 创建取消按钮 - 可以修改这里的样式
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '取消';
                    cancelButton.style.cssText = 'background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;';

                    // 添加按钮到容器
                    buttonsDiv.appendChild(cancelButton);
                    buttonsDiv.appendChild(saveButton);

                    // 替换原备注内容为编辑界面
                    remarkContentDiv.innerHTML = '';
                    remarkContentDiv.appendChild(textarea);
                    remarkContentDiv.appendChild(buttonsDiv);

                    // 保存按钮点击事件
                    saveButton.addEventListener('click', function () {
                        // 获取输入框中的新备注内容
                        const newComment = textarea.value.trim();

                        // 更新内存中的电影数据
                        for (let i = 0; i < movieData.length; i++) {
                            if (movieData[i].code === code) {
                                movieData[i].comment = newComment;
                                // 更新原始行，用于导出
                                movieData[i].line = `${code}:${newComment}`;
                                break;
                            }
                        }

                        // 保存到GM存储
                        try {
                            GM_setValue('JAVRemark_movieData', JSON.stringify(movieData));
                            console.log('已更新电影数据并保存到GM存储');
                        } catch (e) {
                            console.error('保存到GM存储失败:', e);
                        }

                        // 更新显示回普通文本模式
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = newComment;
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 更新页面上高亮显示元素的title属性（鼠标悬停提示）
                        document.querySelectorAll(`span[title="${currentComment}"]`).forEach(span => {
                            if (span.textContent === code) {
                                span.title = newComment;
                            }
                        });

                        // 将编辑按钮文本改回"编辑"
                        const editButton = document.querySelector(`.edit-remark-btn[data-code="${code}"]`);
                        if (editButton) {
                            editButton.textContent = '编辑';
                        }
                    });

                    // 取消按钮点击事件
                    cancelButton.addEventListener('click', function () {
                        // 恢复原来的备注显示
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = currentComment;
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 将编辑按钮文本改回"编辑"
                        const editButton = document.querySelector(`.edit-remark-btn[data-code="${code}"]`);
                        if (editButton) {
                            editButton.textContent = '编辑';
                        }
                    });
                });
            });

            // 为所有添加按钮添加点击事件
            document.querySelectorAll('.add-remark-btn').forEach(button => {
                button.addEventListener('click', function () {
                    // 检查是否已经处于编辑模式
                    if (this.textContent === '取消保存') {
                        // 如果当前是"取消保存"状态，点击后恢复原始显示
                        const code = this.getAttribute('data-code');
                        const remarkContentDiv = document.querySelector(`.remark-content[data-code="${code}"]`);

                        // 恢复原来的显示
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = '无备注信息';
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 将标题恢复为"当前页面未发现匹配的电影代码"
                        const titleElement = this.parentElement.querySelector('strong');
                        if (titleElement) {
                            titleElement.textContent = '当前页面未发现匹配的电影代码';
                        }

                        // 将按钮文本改回"添加"
                        this.textContent = '添加';
                        return;
                    }

                    // 获取当前页面可能的电影代码
                    const pageCodes = getMovieCodeFromPage();
                    const currentPageCode = pageCodes.length > 0 ? pageCodes[0] : '';

                    // 找到对应的标题和备注内容div
                    const titleElement = this.parentElement.querySelector('strong');
                    const remarkContentDiv = document.querySelector(`.remark-content[data-code="${currentPageCode}"]`);

                    // 将标题改为当前电影代码或提示用户输入
                    if (titleElement) {
                        titleElement.textContent = currentPageCode || '请在下方输入电影代码';
                    }

                    // 将添加按钮文本改为"取消保存"
                    this.textContent = '取消保存';

                    // 创建一个文本输入框替换备注内容
                    const textarea = document.createElement('textarea');
                    textarea.placeholder = '输入备注信息...';
                    textarea.style.cssText = 'width: 100%; min-height: 50px; background-color: #333; color: white; border: 1px solid #555; border-radius: 3px; padding: 5px; margin-top: 5px; font-size: 12px;';

                    // 创建电影代码输入框（如果页面没有检测到电影代码）
                    let codeInput = null;
                    if (!currentPageCode) {
                        codeInput = document.createElement('input');
                        codeInput.type = 'text';
                        codeInput.placeholder = '输入电影代码，例如: ABC-123';
                        codeInput.style.cssText = 'width: 100%; padding: 5px; margin-top: 5px; background-color: #333; color: white; border: 1px solid #555; border-radius: 3px; font-size: 12px;';
                    }

                    // 创建保存和取消按钮的容器
                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 5px;';

                    // 创建保存按钮
                    const saveButton = document.createElement('button');
                    saveButton.textContent = '保存';
                    saveButton.style.cssText = 'background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; margin-left: 5px;';

                    // 创建取消按钮
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = '取消';
                    cancelButton.style.cssText = 'background-color: #f44336; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer;';

                    // 添加按钮到容器
                    buttonsDiv.appendChild(cancelButton);
                    buttonsDiv.appendChild(saveButton);

                    // 清空并添加新元素
                    remarkContentDiv.innerHTML = '';
                    if (codeInput) {
                        remarkContentDiv.appendChild(codeInput);
                    }
                    remarkContentDiv.appendChild(textarea);
                    remarkContentDiv.appendChild(buttonsDiv);

                    // 保存按钮点击事件
                    saveButton.addEventListener('click', function () {
                        // 获取输入的备注内容
                        const newComment = textarea.value.trim();
                        // 获取电影代码（从页面检测或用户输入）
                        let code = currentPageCode;
                        if (codeInput) {
                            code = codeInput.value.trim();
                        }

                        // 验证输入
                        if (!code) {
                            alert('请输入电影代码');
                            return;
                        }

                        // 检查代码是否已存在
                        const exists = movieData.some(item => item.code.toLowerCase() === code.toLowerCase());
                        if (exists) {
                            // 如果代码已存在，询问是否更新
                            if (confirm(`电影代码 "${code}" 已存在，是否更新备注信息？`)) {
                                // 更新已有条目
                                for (let i = 0; i < movieData.length; i++) {
                                    if (movieData[i].code.toLowerCase() === code.toLowerCase()) {
                                        movieData[i].comment = newComment;
                                        movieData[i].line = `${code}:${newComment}`;
                                        break;
                                    }
                                }
                            } else {
                                // 用户取消更新，保留编辑状态
                                return;
                            }
                        } else {
                            // 添加新条目
                            const newItem = {
                                code: code,
                                comment: newComment,
                                line: `${code}:${newComment}`,
                                lastModified: Date.now() // 添加最后修改时间
                            };
                            movieData.push(newItem);
                        }

                        // 保存到GM存储
                        try {
                            GM_setValue('JAVRemark_movieData', JSON.stringify(movieData));
                            console.log('已更新电影数据并保存到GM存储');
                        } catch (e) {
                            console.error('保存到GM存储失败:', e);
                        }

                        // 更新显示
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = newComment;
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 更新标题显示为电影代码
                        if (titleElement) {
                            titleElement.textContent = code;
                        }

                        // 将按钮文本改回"编辑"并更改类和样式
                        const addButton = document.querySelector(`.add-remark-btn[data-code="${currentPageCode}"]`);
                        if (addButton) {
                            addButton.textContent = '编辑';
                            addButton.className = 'edit-remark-btn';
                            addButton.setAttribute('data-code', code);
                            addButton.style.backgroundColor = '#2196F3';
                        }

                        // 重新运行匹配和高亮功能
                        matchAndHighlight();
                    });

                    // 取消按钮点击事件
                    cancelButton.addEventListener('click', function () {
                        // 恢复原来的显示
                        remarkContentDiv.innerHTML = '';
                        remarkContentDiv.textContent = '无备注信息';
                        remarkContentDiv.style.color = '#e0e0e0';

                        // 将标题恢复为"当前页面未发现匹配的电影代码"
                        if (titleElement) {
                            titleElement.textContent = '当前页面未发现匹配的电影代码';
                        }

                        // 将按钮文本改回"添加"
                        const addButton = document.querySelector(`.add-remark-btn[data-code="${currentPageCode}"]`);
                        if (addButton) {
                            addButton.textContent = '添加';
                        }
                    });
                });
            });
        }, 100); // 延迟100毫秒确保DOM已更新
    }

    // 导出电影数据到txt文件
    // 将当前内存中的电影数据（包括编辑过的）导出为txt文件
    function exportToTxtFile() {
        // 先从GM存储重新加载最新数据以确保导出的是最新的数据
        try {
            const storedData = GM_getValue('JAVRemark_movieData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    const isValidFormat = parsedData.every(item =>
                        item && typeof item === 'object' &&
                        'code' in item && typeof item.code === 'string' &&
                        'comment' in item && typeof item.comment === 'string'
                    );

                    if (isValidFormat) {
                        // 更新内存中的数据
                        movieData = parsedData;
                        console.log('导出前已刷新数据，从GM存储加载到:', movieData.length, '条记录');
                    }
                }
            }
        } catch (e) {
            console.error('导出前刷新数据失败:', e);
        }

        // 将movieData转换为文本格式
        // 每行格式为: 代码:备注
        let content = '';
        for (const item of movieData) {
            content += `${item.code}:${item.comment}\n`;
        }

        // 创建Blob对象，表示文件内容
        // 设置MIME类型为文本，使用UTF-8编码确保中文正常显示
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

        // 创建一个用于下载的链接元素
        const a = document.createElement('a');
        // 设置下载链接的URL
        a.href = URL.createObjectURL(blob);
        // 设置下载文件名，包含当前日期
        a.download = 'JAVRemark_' + new Date().toISOString().slice(0, 10) + '.txt';

        // 添加到页面并模拟点击，触发下载
        document.body.appendChild(a);
        a.click();

        // 清理：移除链接元素并释放URL对象
        // 使用setTimeout确保下载开始后再清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        }, 100);

        console.log('已导出电影数据到txt文件');
    }

    // 匹配和高亮功能
    // 在页面上查找与已加载数据匹配的电影代码并高亮显示
    function matchAndHighlight() {
        // 从页面提取可能的电影代码
        const pageCodes = getMovieCodeFromPage();

        // 存储匹配到的电影信息
        const matches = [];

        // 递归查找页面中的所有文本节点并处理
        findTextNodes(document.body);

        // 查找文本节点中的电影代码并高亮显示
        // 这个函数被定义在matchAndHighlight内部，以便访问外部变量
        function findTextNodes(node) {
            // 如果是文本节点
            if (node.nodeType === Node.TEXT_NODE) {
                // 获取文本内容
                const text = node.textContent;
                // 如果文本内容不为空
                if (text && text.trim().length > 0) {
                    // 创建一个文档片段，用于替换原文本节点
                    const fragment = document.createDocumentFragment();

                    // 保存上次匹配结束位置
                    let lastIndex = 0;
                    // 记录是否找到匹配
                    let found = false;

                    // 电影代码格式的正则表达式 - 匹配如"ABC-123"格式的代码
                    // 可以修改这个正则表达式来匹配不同格式的电影代码
                    const codeRegex = /[a-zA-Z]+-\d+/g;

                    // 在文本中查找所有可能的电影代码
                    // 不再只查找已加载的数据中的代码，而是查找所有符合格式的代码
                    let match;
                    while ((match = codeRegex.exec(text)) !== null) {
                        // 找到匹配项
                        found = true;

                        // 将匹配项前的文本添加到文档片段
                        if (match.index > lastIndex) {
                            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                        }

                        // 更新上次匹配结束位置
                        lastIndex = match.index + match[0].length;

                        // 当前匹配的代码
                        const currentCode = match[0];

                        // 查找该代码是否在已加载的电影数据中
                        // 使用find方法在movieData中查找匹配的代码（不区分大小写）
                        const movieItem = movieData.find(item =>
                            item.code.toLowerCase() === currentCode.toLowerCase()
                        );

                        // 创建高亮span元素
                        const span = document.createElement('span');
                        // 设置span文本为匹配到的电影代码
                        span.textContent = currentCode;

                        if (movieItem) {
                            // 如果在数据中找到匹配 - 使用黄色高亮（已有备注的代码）
                            // 可以修改这里的CSS来自定义已匹配代码的外观
                            span.style.cssText = 'background-color: yellow; font-weight: bold; color: black;';
                            span.title = movieItem.comment; // 鼠标悬停显示备注

                            // 添加到匹配列表（如果尚未添加）- 用于浮动窗口显示
                            const existingMatch = matches.find(m => m.code.toLowerCase() === movieItem.code.toLowerCase());
                            if (!existingMatch) {
                                matches.push(movieItem);
                            }
                        } else {
                            // 如果没有匹配 - 使用灰色背景，并添加点击添加备注的功能
                            // 这是新增功能：未匹配代码可点击添加备注。如果要显示为灰色，把后面这段加到cssText的单引号里 background-color: #cccccc;。如果要显示为黑色，把后面这段加到cssText的单引号里 color: black;
                            // 可以修改这里的CSS来自定义未匹配代码的外观
                            span.style.cssText = 'font-weight: bold; cursor: pointer; text-decoration: dashed underline;';
                            span.title = '点击添加备注'; // 鼠标悬停提示

                            // 添加点击事件，显示添加备注对话框
                            // 点击未匹配的代码时，自动打开添加备注对话框并预填充代码
                            // span.addEventListener('click', function () {
                            //     showAddDialog(currentCode);
                            // });
                        }

                        // 将高亮span添加到文档片段
                        fragment.appendChild(span);
                    }

                    // 如果找到匹配项
                    if (found) {
                        // 添加匹配后剩余的文本
                        if (lastIndex < text.length) {
                            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                        }

                        // 用文档片段替换原文本节点
                        node.parentNode.replaceChild(fragment, node);
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 如果是元素节点，递归处理其子节点

                // 跳过脚本元素和浮动窗口，避免不必要的处理
                if (node.nodeName.toLowerCase() === 'script' || node.id === 'movie-info-window') {
                    return;
                }

                // 复制子节点列表，因为在处理过程中可能会修改DOM结构
                const childNodes = Array.from(node.childNodes);
                // 递归处理每个子节点
                for (const child of childNodes) {
                    findTextNodes(child);
                }
            }
        }

        // 更新悬浮窗口，显示匹配结果
        updateFloatingWindow(matches);
    }

    // 定期检查GM存储中的数据是否有更新
    function checkForDataUpdates() {
        try {
            // 从GM存储获取最新数据
            const storedData = GM_getValue('JAVRemark_movieData');
            if (!storedData) return;

            const parsedData = JSON.parse(storedData);
            if (!Array.isArray(parsedData) || parsedData.length === 0) return;

            // 检查数据是否有变化
            let hasUpdates = false;

            // 如果记录数不同，肯定有更新
            if (parsedData.length !== movieData.length) {
                hasUpdates = true;
            } else {
                // 否则，用更复杂的方法比较
                // 1. 检查最新的lastModified时间戳
                let localLatestModified = 0;
                let storedLatestModified = 0;

                for (const item of movieData) {
                    if (item.lastModified && item.lastModified > localLatestModified) {
                        localLatestModified = item.lastModified;
                    }
                }

                for (const item of parsedData) {
                    if (item.lastModified && item.lastModified > storedLatestModified) {
                        storedLatestModified = item.lastModified;
                    }
                }

                if (storedLatestModified > localLatestModified) {
                    hasUpdates = true;
                }

                // 2. 如果没有时间戳或时间戳相同，检查数据内容
                if (!hasUpdates && JSON.stringify(movieData) !== JSON.stringify(parsedData)) {
                    hasUpdates = true;
                }
            }

            // 如果有更新，应用更新
            if (hasUpdates) {
                console.log('检测到GM存储中的数据已更新，正在同步...');
                console.log(`当前数据: ${movieData.length}条记录, 新数据: ${parsedData.length}条记录`);

                // 更新内存中的数据
                movieData = parsedData;

                // 重新匹配和高亮显示
                matchAndHighlight();

                console.log('数据已同步更新');
            }
        } catch (e) {
            console.error('检查数据更新时出错:', e);
        }
    }

    // 在页面加载完成后自动执行的函数
    function init() {
        createFloatingWindow();

        // 尝试从GM存储加载之前保存的数据
        if (loadMovieDataFromStorage()) {
            // 如果成功加载了数据，立即执行匹配和高亮
            matchAndHighlight();
        } else {
            // 如果没有数据或加载失败，仍然更新浮动窗口，显示默认内容
            updateFloatingWindow([]);
        }

        // 隐藏侧边按钮栏中的文件、清除、添加按钮，只保留备注按钮
        const sideButtonBar = document.getElementById('side-button-bar');
        if (sideButtonBar) {
            // 获取所有按钮
            const buttons = Array.from(sideButtonBar.children);
            // 仅显示备注按钮（第一个按钮），隐藏其他按钮
            buttons.forEach((button, index) => {
                if (index === 0) {
                    button.style.display = 'block'; // 保留备注按钮
                } else {
                    button.style.display = 'none'; // 隐藏其他按钮
                }
            });
        }

        // 设置定时器，每30秒检查一次数据更新
        setInterval(checkForDataUpdates, 30000);
    }

    // 当页面加载完成后初始化脚本
    window.addEventListener('load', init);
})();