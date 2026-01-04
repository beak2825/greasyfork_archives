// ==UserScript==
// @name         图寻tips
// @namespace    https://tuxun.fun/
// @version      4.8
// @description  由于会被系统误判为作弊，目前已经违法使用，以后更新。需要特定地图才能提示，按Q键可以提示plonkit中的知识，比如：plonkit新手向等等，或者带有tips关键词的题库才能使用
// @supportURL   https://sleazyfork.org/en/scripts/480332-图寻tips
// @author       yukejun
// @match        https://tuxun.fun/*
// @grant        GM_xmlhttpRequest
// @connect      knowledgetips.fun
// @connect      nominatim.openstreetmap.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480332/%E5%9B%BE%E5%AF%BBtips.user.js
// @updateURL https://update.greasyfork.org/scripts/480332/%E5%9B%BE%E5%AF%BBtips.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 在闭包中初始化 isMatch
let isMatch = true;
   //
// CSS样式
const modalStyles = `
#customModal {
    cursor: move;
    display: none;
    position: fixed;
    z-index: 1000;
    top: 10vh;
    left: 10vw;
    background-color: #fff;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 80vw;
    max-width: 350px;
    transform: translate(0, 0);
    text-align: left;
    opacity: 0;
    visibility: hidden;
    border: 0.5px solid #000;
    transition: opacity 0.4s ease, visibility 0.4s ease, transform 0.4s ease; /* 添加 max-height 到过渡效果中 */
}
/* 添加显示时的样式 */
#customModal.show {
    opacity: 1;
    visibility: visible;
    transform: translate(0, 10px); /* 添加轻微的向下移动效果以增强动态感 */
}
/* 鼠标悬停时的按钮样式 */
.modalButton {
    padding: 2px 5px;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    transition: box-shadow 0.3s ease; /* 添加过渡效果 */
}
.modalButton:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}
#customModal * {
    user-select: text; /* 允许文本选择 */
    cursor: auto; /* 设置鼠标为默认样式 */
}
/* 特定元素，如按钮，可能需要重写这些样式 */
#customModal button {
    user-select: none; /* 防止按钮文本被选择 */
    cursor: pointer; /* 为按钮设置手型鼠标样式 */
}
#setTimeButton {
    background-image: url('https://pic1.zhimg.com/80/v2-7c700be8d7b319f5845121926faaae37_1440w.png');
    background-size: contain;
    background-repeat: no-repeat;
    border: none; /* 移除边框 */
    width: 18px; /* 根据需要调整尺寸 */
    height: 18px; /* 根据需要调整尺寸 */
    cursor: pointer; /* 鼠标悬停时显示手型光标 */
    position: absolute;
    top: 3px;
    right: 50px;
    background-color: #ffffff;
}
#customModalHeader {
    cursor: pointer;
    padding: 7px;
    background-color: #fff;
}
#customModalHeader h2 {
    font-size: 1.5em;
    margin: 0;
    color: #333;
    text-align: left;
}
#pinModal {
    background-image: url('https://pic1.zhimg.com/80/v2-0b6c9fb7436ac72d00ccc1f49a3919c0_1440w.webp'); /* 默认图钉图片 */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    color: transparent; /* 隐藏文本 */
    width: 21px; /* 设置合适的宽度 */
    height: 21px; /* 设置合适的高度 */
    position: absolute;
    top: 3px;
    right: 27px;
    background-color: #ffffff;
}
#modalContent {
    user-select: text;
    font-size: 16px;
    color: black;
    margin-top: 5px; /* 调整位置高度 */
    /* 根据需要，您也可以添加 margin-bottom */
}
#customInputBox {
    width: 90%;
    padding: 5px;
    margin: 10px 5%;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow-y: hidden;
    resize: none;
}
#modalClose {
    position: absolute;
    top: -4px;
    right: 8px;
    cursor: pointer;
    font-size: 1.5em;
    color: #333;
}
/* 响应式设计 */
@media (max-width: 600px) {
    #customModal {
        width: 95vw;
        left: 2.5vw;
        font-size: 14px;
    }
    #imageDisplay {
        width: 90%;
    }
    #customModalHeader {
        padding: 5px;
    }
}
@media (min-width: 601px) and (max-width: 800px) {
    #customModal {
        width: 70vw;
        left: 15vw;
        font-size: 16px;
    }
    #imageDisplay {
        width: 70%;
    }
}
/* 可以继续添加更多样式... */
/* 响应式设计 */
@media (max-width: 600px) {
    #customModal {
        width: 95vw;
        left: 2.5vw;
    }
}
#buttonGroup {
    display: flex;
    justify-content: center;
    gap: 5px;
    font-size: 14px;
}
.modalButton {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}
.centered-content {
    text-align: center;
    margin-bottom: 10px;
}
.locationSymbol {
    width: 20px;
    height: 25px;
    position: relative; /* 或者 'absolute'，取决于您的需要 */
    top: 5px;  /* 向下移动5像素 */
    bottom: 5px; /* 向上移动5像素 */
    left: -5px; /* 向右移动10像素 */
}
#imageDisplay {
    width: 100%; /* 根据需要调整宽度 */
    margin-top: 10px;
    border-radius: 10px; /* 添加圆角 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* 添加阴影以增加深度感 */
    padding: 5px; /* 添加内边距 */
    background-color: #ffffff; /* 设定背景颜色 */
    transition: all 0.3s ease; /* 平滑过渡效果 */
}
.blankSpace {
    height: 5px; /* 您可以根据需要调整这个高度 */
    width: 100%;
}
.blankSpace1 {
    height: 5px; /* 您可以根据需要调整这个高度 */
    width: 100%;
}
.blankSpace2 {
    height: 5px; /* 您可以根据需要调整这个高度 */
    width: 100%;
}
.buttonActive {
    background-color: rgb(19, 206, 102); /* 浅绿色 */
    color: white;
}
.loader {
    border: 4px solid #3498db; /* 边框更细，整体为蓝色边框 */
    border-top: 3px solid #f3f3f3; /* 边框更细，顶部为轻色边框 */
    border-radius: 50%;
    width: 50px; /* 增大半径 */
    height: 50px; /* 增大半径 */
    animation: spin 2s linear infinite;
    margin: 0 auto; /* 水平居中 */
    display: block; /* 确保能够应用margin auto */
    margin-top: 25px; /* 增加顶部边距 */
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
// HTML结构
const modalHTML = `
    <div id="customModal">
        <div id="customModalHeader">
            <h2>小技巧</h2>
            <div class="blankSpace1"></div> <!-- 新增的空白区域 -->
            <div id="buttonGroup" class="centered-content">
            <button class="modalButton" data-function="imagetip">Tips</button>
            <button class="modalButton" data-function="nationalflag">国旗</button>
            <button class="modalButton" data-function="areanumber">区编</button>
            <button class="modalButton" data-function="licensePlate">车牌</button>
            <button class="modalButton" data-function="text">文字</button>
            <button class="modalButton" data-function="tellphone">电话</button>
            </div>
            <div id="imageDisplayContainer">
            <img id="imageDisplay" src="" alt="显示图片" style="display:none;">
            </div>
            <div class="blankSpace"></div> <!-- 新增的空白区域 -->
            <button id="setTimeButton"></button>
            <button id="pinModal"></button>
            <div id="modalContent"></div>
            <textarea id="customInputBox" placeholder="在此输入内容..."></textarea>
        </div>
        <div style="text-align: center; margin-top: 10px;">
            <button id="addButton">新增</button>
        </div>
        <span id="modalClose">&times;</span>
    </div>
`;
    // 将CSS添加到页面
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalStyles;
document.head.appendChild(styleSheet);
    // 插入模态窗口到<body>的末尾
    document.body.insertAdjacentHTML('beforeend', modalHTML);
function updateModalPosition(x, y) {
    const modal = document.getElementById('customModal');
    modal.style.left = `${x}px`;
    modal.style.top = `${y}px`;
    localStorage.setItem('modalPosition', JSON.stringify({ x, y }));
}
function restoreModalPosition() {
    const modal = document.getElementById('customModal');
    const position = JSON.parse(localStorage.getItem('modalPosition'));
    if (position) {
        modal.style.left = `${position.x}px`;
        modal.style.top = `${position.y}px`;
    }
}
// 函数用于创建标签元素（段落和保存按钮）
function createTagElement(text, index) {
    // 创建一个 div 元素作为标签的外层容器
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tag-container'); // 添加类名以便应用CSS样式
    // 创建一个 div 元素来容纳标签的内容（编号和文本）
    const tagContentContainer = document.createElement('div');
    tagContentContainer.classList.add('tag-content-container'); // 添加类名
    // 创建一个 span 元素作为标签编号的容器
    const label = document.createElement('span');
    label.textContent = index !== undefined ? `${index + 1}. ` : ''; // 如果提供了 index，则显示编号
    label.classList.add('tag-label'); // 添加类名
    // 创建一个段落元素用于显示传入的文本
    const paragraph = document.createElement('p');
    paragraph.textContent = text; // 设置段落文本
    paragraph.contentEditable = false; // 设置为不可编辑
    paragraph.id = index !== undefined ? `tag-${index}` : undefined; // 如果提供了 index，则设置ID
    // 创建一个占位元素，用于在需要时占据保存按钮的空间
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none'; // 初始状态隐藏
// 创建一个新的按钮元素
const saveButton = document.createElement('button');
// 设置按钮的文本内容为'保存'
saveButton.textContent = '保存';
// 给按钮添加一个CSS类名'save-button'
saveButton.classList.add('save-button');
// 根据index变量的值设置按钮的点击事件处理函数
saveButton.onclick = index !== undefined ?
    () => {
        saveTag(paragraph, index); // 如果index已定义，调用saveTag函数并传递paragraph和index参数
        saveButton.style.display = 'none'; // 点击后使按钮消失
    } :
    () => {
        saveTag(paragraph); // 如果index未定义，只调用saveTag函数并传递paragraph参数
        saveButton.style.display = 'none'; // 点击后使按钮消失
    };
// 设置按钮的初始显示状态为隐藏
saveButton.style.display = 'none';
    // 应用保存按钮的样式
    applyButtonStyles(saveButton);
    // 设置段落的双击事件处理函数
    // 使段落在双击时变为可编辑，并显示保存按钮和占位元素
    let isEditable = false; // 发布时需要更改的代码
    paragraph.ondblclick = function() {
        if (isEditable) {
            makeEditable(paragraph, saveButton, placeholder);
        }
        // 如果 isEditable 为 false，则不执行任何操作
    };
    // 从本地存储中获取创建者名称
    const creatorName = localStorage.getItem('creatorName');
    // 创建一个新段落来显示创建者信息
    const creatorParagraph = document.createElement('p');
    creatorParagraph.textContent = `${creatorName}`;
    creatorParagraph.classList.add('creator-info'); // 添加类名
    creatorParagraph.style.fontSize = '10px'; // 设置字体大小
    creatorParagraph.style.color = 'black'; // 设置字体颜色
    creatorParagraph.style.marginLeft = '60px'; // 设置左边距
    // 在段落旁边添加标签元素
    tagContentContainer.appendChild(label);
    tagContentContainer.appendChild(paragraph);
    tagContainer.appendChild(placeholder);
    tagContainer.appendChild(tagContentContainer);
    tagContainer.appendChild(creatorParagraph);
    tagContainer.appendChild(saveButton);
    return tagContainer;
}
// 函数使段落变为可编辑并显示保存按钮
function makeEditable(paragraph, saveButton, placeholder) {
    paragraph.contentEditable = "true";
    paragraph.focus(); // 立即聚焦到段落，方便编辑
    saveButton.style.display = 'inline-block'; // 显示保存按钮
    placeholder.style.display = 'block'; // 显示占位元素
}
// 应用按钮样式的函数
function applyButtonStyles(button) {
        // 使用响应式设计，例如min-width和min-height，以适应不同屏幕尺寸
    button.style.minWidth = '50px';
    button.style.minHeight = '25px';
    button.style.overflow = 'hidden'; // 防止内容溢出
    button.style.backgroundColor = '#4CAF50'; // 绿色背景
    button.style.color = 'white'; // 白色文字
    button.style.border = 'none'; // 无边框
    button.style.borderRadius = '5px'; // 圆角
    button.style.padding = '5px 5px'; // 内边距
    button.style.cursor = 'text'; // 鼠标悬停时的手指图标
    // 悬浮效果
    button.onmouseover = function() {
        button.style.backgroundColor = '#45a049'; // 深绿色
    };
    button.onmouseout = function() {
        button.style.backgroundColor = '#4CAF50'; // 原绿色
    };
}
    // 创建一个style元素并添加CSS
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .tag-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end; // 所有子元素向右对齐
            margin-bottom: 10px;
            high: 110%
        }
        .tag-content-container {
            cursor: auto;
            display: flex;
            align-items: center; // 内部元素水平对齐
            flex-grow: 1;
            width: 100%; // 占满整个容器宽度
        }
        .tag-label {
            cursor: auto;
            margin-right: 8px;
            font-weight: bold;
            align-self: flex-start; // 标签向左上角对齐
        }
        .tag-container p {
            cursor: auto;
            margin: 0;
            margin-right: 8px;
            flex-grow: 1; // 让段落填满剩余空间
        }
        .save-button {
            display: none;
        }
        .creator-info {
            cursor: auto;
            align-self: flex-end; // 向右对齐
        }
        @media (max-width: 600px) {
            .save-button {
                // 小屏幕上的特定样式
                min-width: 30px;
                min-height: 10px;
                align-self: flex-end; // 向右对齐
            }
        }
    `;
        document.head.appendChild(style);
    }
window.onload = function() {
    // 获取所有的 .creator-info 元素
    var creatorInfoElements = document.querySelectorAll('.creator-info');
    let isPageFirstLoad = localStorage.getItem('isPageFirstLoad') !== 'false';
    if (isPageFirstLoad) {
        // 这里是第一次加载页面时需要执行的代码
        const storedTagsText = localStorage.getItem('tagsText');
        const storedImageUrls = JSON.parse(localStorage.getItem('imageUrls') || '[]');
        if (storedTagsText) {
            let modalContent = storedTagsText;
            showModal(modalContent); // 显示模态窗口
        }
        localStorage.setItem('isPageFirstLoad', 'false');
    }
    // 遍历所有元素并直接设置其样式
    creatorInfoElements.forEach(function(elem) {
        elem.style.fontSize = '14px'; // 设置字体大小
        elem.style.color = '#333333'; // 设置字体颜色
    });
};
const customInputBox = document.getElementById('customInputBox');
customInputBox.addEventListener('keyup', function(event) {
    adjustTextareaHeight(this);
});
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; // 重置高度
        textarea.style.height = textarea.scrollHeight + 'px'; // 根据内容调整高度
    }
// 函数用于激活模态窗口时阻止键盘事件传播
function preventKeyPropagation() {
    const modal = document.getElementById('customModal');
    modal.addEventListener('keydown', function(event) {
        event.stopPropagation(); // 阻止事件冒泡到父元素
        // 如果需要，也可以根据需求阻止默认行为
        // event.preventDefault();
    });
}
        // 在页面加载时调用函数以添加样式
window.addEventListener('load', function() {
        addCustomStyles(); // 添加自定义样式
        preventKeyPropagation(); // 防止键盘事件传播
        // 尝试从 localStorage 中获取模态窗口的位置
        const savedPosition = localStorage.getItem('modalPosition');
        if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        const modal = document.getElementById('customModal');
        if (modal) {
            // 设置模态窗口的位置
            modal.style.left = x + 'px';
            modal.style.top = y + 'px';
        }
    }
    //发布时需要添加的代码
    document.getElementById('addButton').style.display = 'none';
    document.getElementById('customInputBox').style.display = 'none';
    });
// 为 setTimeButton 按钮添加点击事件监听器
document.getElementById('setTimeButton').addEventListener('click', function() {
    event.stopPropagation()
    // 弹出一个对话框让用户输入新的倒计时时间
    let newTime = prompt("请输入新的倒计时时间（秒），时间必须是 3 秒或以上的正整数:");
    // 如果用户点击取消，newTime 将是 null，不执行任何操作
    if (newTime === null) {
        return;
    }
    // 验证输入是否为正整数且大于等于 3
    if (!isNaN(newTime) && Number.isInteger(parseFloat(newTime)) && parseInt(newTime) >= 3) {
        // 更新倒计时时间
        countdownTime = parseInt(newTime);
        // 将新的倒计时时间存储在 localStorage 中
        localStorage.setItem('countdownTime', countdownTime);
        // 可以在这里重新开始倒计时或者进行其他操作
    } else {
        alert("请输入有效的正整数（3秒或以上）！");
    }
});
// 全局变量，控制是否显示图片
let shouldDisplayImage = false;
let countdownTime = 30; // 默认倒计时时间为3秒
let countdownInterval; // 将倒计时定时器声明为全局变量
let immediateDisplay = false; // 新增一个全局变量来控制是否立即显示文本内容
// 从localStorage获取倒计时时间
function getStoredCountdownTime() {
    const storedCountdown = localStorage.getItem('countdownTime');
    if (storedCountdown !== null) {
        countdownTime = parseInt(storedCountdown, 10);
    }
}
// 显示模态窗口并在15秒内进行倒计时
function showModal(serverText) {
 //
    // 重置immediateDisplay为false
    immediateDisplay = false;
    // 获取存储的倒计时时间
    getStoredCountdownTime();
    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    // 清空modalContent的内容
    modalContent.innerHTML = '倒计时: 15秒';
// 获取存储在 localStorage 中的各个地址组件
const storedAddress = localStorage.getItem('address');
const storedState = localStorage.getItem('state');
const storedRegion = localStorage.getItem('region');
const storedCity = localStorage.getItem('city');
const displayAddress = storedAddress || storedState || storedRegion || storedCity || '地址信息未找到';
//
const storedModalPosition = JSON.parse(localStorage.getItem('modalPosition'));
const storedImageUrl = localStorage.getItem('savedImageUrl');
if (storedModalPosition) {
    modal.style.left = storedModalPosition.x + 'px';
    modal.style.top = storedModalPosition.y + 'px';
}
    // 如果之前的倒计时仍在运行，则清除它
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    // 初始化倒计时
    let countdown = countdownTime;
    // 设置一个每秒更新一次的定时器
    countdownInterval = setInterval(function() {
        if (immediateDisplay) {
            // 如果需要立即显示文本内容
            clearInterval(countdownInterval);
            displayContent(serverText, displayAddress);
            shouldDisplayImage = true;
        } else {
            countdown--;
           modalContent.innerHTML = `<p style="text-align: center; font-size: 18px; margin-top: 48px; position: relative; top: -20px;">倒计时: ${countdown}秒</p>`;
            // 当倒计时结束时
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            displayContent(serverText, displayAddress);
            shouldDisplayImage = true;
        }
        }
    }, 1000);
    // 清空modalContent的内容
    modalContent.innerHTML = '<div class="loader"></div><p></p>';
   // 显示模态窗口
if (modal.style.display === 'none') {
    modal.style.display = 'block';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
}
const wrapperElement = document.querySelector('.wrapper___NMMQn');
    if (wrapperElement) {
    const observer = new MutationObserver(function(mutations, obs) {
    const canvasElement = wrapperElement.querySelector('.mapConfirm___Q8fp1');
    if (canvasElement) {
    } else {
        skipCountdown();
        obs.disconnect();

    }
});
        observer.observe(wrapperElement, { childList: true, subtree: true });
    }else {
        console.log('wei找到选择器wrapper');
    }

}
// 显示最终内容的函数
function displayContent(serverText, displayAddress) {
    const locationSymbolHtml = `<img
    src="https://pic1.zhimg.com/80/v2-b5108764f32666bde67f8e7340b3350c_r.jpg"
alt="Location" class="locationSymbol" />`;
    modalContent.innerHTML = `<p>${locationSymbolHtml} ${displayAddress}</p>`;
    // 显示解析后的serverText内容
    const tags = serverText.split('; ');
    tags.forEach((tag, index) => {
        const tagElement = createTagElement(tag, index);
        modalContent.appendChild(tagElement);
    });
}
// 在需要的时候可以调用这个函数来立即显示文本内容
function skipCountdown() {
    immediateDisplay = true;
}
    // 关闭模态窗口的函数
    function closeModal() {
        const modal = document.getElementById('customModal');
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => modal.style.display = 'none', 100); // 确保过渡效果结束后再隐藏
    }
    //更新标签
function updateTagNumbers() {
    const tags = document.querySelectorAll('.tag-container');
    tags.forEach((tag, index) => {
        const label = tag.querySelector('.tag-label');
        if (label) {
            label.textContent = `${index + 1}. `;
        }
    });
}
// 全局变量
let isSaveTagActive = true; // 控制函数是否激活
// 函数保存编辑后的标签并发送数据到服务器
function saveTag(paragraph, index) {
    // 如果全局变量为 false，则函数不执行任何操作
    if (!isSaveTagActive) {
        return;
    }
    // 获取并处理编辑后的文本
    const editedText = paragraph.textContent.trim();
    paragraph.contentEditable = "false"; // 关闭可编辑状态
    // 从localStorage获取当前标签列表
    let tags = localStorage.getItem('tagsText') ? localStorage.getItem('tagsText').split('; ') : [];
    // 更新或移除标签
    if (index !== undefined) {
        if (editedText === '') {
            // 用户删除了所有文本，从标签数组中移除该标签
            tags.splice(index, 1);
if (editedText === '') {
    tags.splice(index, 1); // 从标签数组中移除该标签
    // 从 DOM 中移除标签元素及其内部元素
    const tagContainer = paragraph.parentElement.parentElement;
    if (tagContainer) {
        tagContainer.remove();
        updateTagNumbers(); // 更新标签编号
    }
}
        } else {
            // 更新指定索引的标签
            tags[index] = editedText;
        }
    } else if (editedText !== '') {
        // 添加新标签时，追加到标签数组的末尾
        tags.push(editedText);
    }
    // 过滤和更新标签列表
    tags = tags.filter(tag => tag && tag.trim());
    const updatedTagsText = tags.join('; ');
    localStorage.setItem('tagsText', updatedTagsText);
const storedCoordinates = JSON.parse(localStorage.getItem('newCoordinateName'));
    // 准备发送的数据
    const dataToSendtext = {
        mapsId: localStorage.getItem('mapsId'),
        coordinates: storedCoordinates,
        tagsText: updatedTagsText
    };
    // 隐藏保存按钮
    const saveButton = paragraph.parentElement.querySelector('.save-button');
    if (saveButton) {
        saveButton.style.display = 'none';
    }
}
//发布时添加
isSaveTagActive = false; // 关闭
isSaveTagActive = true;  // 开启
// 验证输入内容的函数
function isValidInput(input) {
    const maxLength = 300; // 最大字符长度设置为300
    // 检查长度
    if (input.length > maxLength) {
        alert(`输入的文本太长，请输入不超过 ${maxLength} 个字符的文本。`);
        return false;
    }
    return true;
}
// 新增标签的函数
function addNewTag() {
    //
    const inputBox = document.getElementById('customInputBox');
    const newText = inputBox.value.trim();
    if (newText && isValidInput(newText)) {
        const newTagElement = createTagElement(newText);
        const modalContent = document.getElementById('modalContent');
        modalContent.appendChild(newTagElement);
        // 保存新标签并发送到服务器
        saveTag(newTagElement.querySelector('p'));
        inputBox.value = '';
        // 更新所有标签的序号
        updateTagNumbers();
    }
    inputBox.value = ''; // 清空输入框
    // 重置文本框的高度
    const customInputBox = document.getElementById('customInputBox');
    customInputBox.style.height = '30px'; // 设置为初始高度或任意合适的固定高度
}
// 给新增按钮添加点击事件监听器
const addButton = document.getElementById('addButton');
    if (addButton) {
   //
} else {
  //
}
addButton.addEventListener('click', addNewTag);
// 置顶状态追踪变量
let isPinned = false;
// 从localStorage读取置顶状态
function loadPinState() {
    // 尝试从localStorage获取之前保存的状态
    const savedState = localStorage.getItem('isPinned');
    if (savedState !== null) {
        // 更新isPinned变量为保存的状态（需要将字符串转换为布尔值）
        isPinned = savedState === 'true';
    }
    // 更新按钮的显示
    updatePinButton();
}
// 更新置顶按钮的显示
function updatePinButton() {
    const pinButton = document.getElementById('pinModal');
    if (isPinned) {
        pinButton.style.backgroundImage = "url('https://pic1.zhimg.com/80/v2-0b6c9fb7436ac72d00ccc1f49a3919c0_1440w.webp')";
    } else {
        pinButton.style.backgroundImage = "url('https://pic2.zhimg.com/80/v2-893d2c6777c1205430e5fa2cc4019ae9_1440w.webp')";
    }
}
// 切换置顶状态的函数
function togglePin() {
    isPinned = !isPinned;
    // 保存当前状态到localStorage
    localStorage.setItem('isPinned', isPinned);
    // 更新按钮的显示
    updatePinButton();
}
// 添加置顶按钮的事件监听器
document.getElementById('pinModal').addEventListener('click', function(event) {
    togglePin();
    event.stopPropagation(); // 阻止事件冒泡到document，防止触发关闭模态窗口的逻辑
});
// 当页面加载时，读取并显示之前保存的置顶状态
window.addEventListener('load', loadPinState);
//以上是置顶函数变量
let isDragging = false;
let dragStartX, dragStartY;
let originalX, originalY;
document.getElementById('customModalHeader').addEventListener('mousedown', function(e) {
    if (e.target !== this && e.target !== document.querySelector('#customModalHeader h2')) {
        return;
    }
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const modal = document.getElementById('customModal');
    originalX = parseInt(window.getComputedStyle(modal).left, 10);
    originalY = parseInt(window.getComputedStyle(modal).top, 10);
    e.preventDefault();
});
document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    let newX = originalX + e.clientX - dragStartX;
    let newY = originalY + e.clientY - dragStartY;
    updateModalPosition(newX, newY);
});
document.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;
        let newX = originalX + e.clientX - dragStartX;
        let newY = originalY + e.clientY - dragStartY;
        updateModalPosition(newX, newY);
                // 存储新位置到 localStorage
        localStorage.setItem('modalPosition', JSON.stringify({ x: newX, y: newY }));
    }
});
    // 点击模态窗口以外的区域关闭模态窗口
// 修改点击模态窗口以外区域关闭模态窗口的逻辑，加入置顶状态判断
document.addEventListener('click', function(event) {
    const modal = document.getElementById('customModal');
    // 如果模态窗口未被置顶，并且点击的不是模态窗口也不是模态窗口的子元素，则关闭模态窗口
    if (!isPinned && !modal.contains(event.target)) {
        closeModal();
    }
});

    document.getElementById('modalClose').addEventListener('click', closeModal);

    function toggleModal() {
        const modal = document.getElementById('customModal');
        if (modal.style.opacity === '1' || modal.style.visibility === 'visible') {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.display = 'none';
        } else {
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.display = 'block';
        }
    }
var shouldSend = true; 

    document.addEventListener("keyup", function(evt) {
        const targetTagName = (evt.target || evt.srcElement).tagName;
        if (evt.key === 'q' && targetTagName !== 'INPUT' && targetTagName !== 'TEXTAREA') {
            toggleModal();
       // 改变发送状态 shouldSend = !shouldSend;
        }
    });

    const mapsIdPattern = /mapsId=(\d+)|\/map\/(\d+)/;

const addressPattern = /\[\s*null,\s*null,\s*\[\s*(\[\s*"([^"]*)",\s*"([^"]*)"\s*\])(,\s*\[\s*"([^"]*)",\s*"([^"]*)"\s*\])?\s*\]\s*\]/;
    // 合并的正则表达式，用于匹配两种不同类型的坐标
const coordinatePattern = /\[\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\],\[\d+\.\d+\],\[\d+\.\d+,\d+\.\d+,\d+\.\d+\]\]|\[\s*null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\s*\]|"lat":\s*(-?\d+\.\d+),\s*"lng":\s*(-?\d+\.\d+)/;
  // 保存原始的send方法
try {
    // 检查shouldSend变量
    if (shouldSend) {
        // 在发送请求之前保存请求的URL
    let currentUrl = this._url;
    // 初始化mapsIdChanged变量为false
    // 添加一个事件监听器来处理请求加载完成后的逻辑
    this.addEventListener("loadstart", function() {
        currentUrl = this._url; // 保存实际发送时的URL
// 当请求完成时检查URL
this.addEventListener("load", function() {
    // 从localStorage获取当前和之前的mapsId
    let previousMapsId = localStorage.getItem('previousMapsId');
    let currentMapsId = localStorage.getItem('mapsId');
    // 检查URL是否包含mapsId，如果不包含则从响应中获取
   if (this._url.includes('https://tuxun.fun/api/v0/tuxun/solo/get?gameId')) {
        var response = JSON.parse(this.responseText);
                    try {
    // 提取并打印 mapsId 字段
    if (response && response.data && response.data.mapsId !== undefined) {
        const newMapsId = response.data.mapsId;
        if (newMapsId !== currentMapsId) {
                localStorage.setItem('previousMapsId', currentMapsId);
                localStorage.setItem('mapsId', newMapsId);
        }

    } else {
        console.error("没找到");
    }
            } catch (error) {
                console.error("Error parsing JSON response:", error);
            }
    }

            // 在发布时需要删除这段代码，从URL中提取新的mapsId
if (currentUrl.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getGooglePanoInfoPost') ||
    currentUrl.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getPanoInfo?pano=')) {
        //
// 定义isCountryCode函数
function isCountryCode(str) {
    return /^[A-Za-z]{2}$/.test(str);
}
const responseText = this.responseText;
let addressMatches;
let isAddressFound = false;
let loopCount = 0;
let address;
while ((addressMatches = addressPattern.exec(responseText)) !== null && loopCount < 3) {
    loopCount++;

    if (addressMatches[5] && !isCountryCode(addressMatches[5])) {
        address = addressMatches[5];
        isAddressFound = true;

    }

    else if (addressMatches[2] && !isCountryCode(addressMatches[2])) {
        address = addressMatches[2];
        isAddressFound = true;
      //
    }
    if (isAddressFound) {

        break; 
    } else {
      //
    }
}
if (!isAddressFound) {
 //
}

if (isAddressFound) {
    const storedAddress = localStorage.getItem('address');
    if (address !== storedAddress) {
        localStorage.setItem('address', address);
    } else {
    }
} else {
    localStorage.removeItem('address');
}

if (coordinatePattern.test(responseText)) {

let latitude, longitude;
const matches = coordinatePattern.exec(responseText);
if (matches) {

    if (matches[1] !== undefined && matches[2] !== undefined) {
        latitude = matches[1];
        longitude = matches[2];
          }

    else if (matches[3] !== undefined && matches[4] !== undefined) {
        latitude = matches[3];
        longitude = matches[4];
      //
    }

    else if (matches[5] !== undefined && matches[6] !== undefined) {
        latitude = matches[5];
        longitude = matches[6];
            }
    if (latitude !== undefined && longitude !== undefined) {
let storedCoordinates = null 
const storedCoordinatesString = localStorage.getItem('newCoordinateName');
if (storedCoordinatesString) {

    try {
        if (storedCoordinatesString !== "null") {
            storedCoordinates = JSON.parse(storedCoordinatesString);

        }
    } catch (e) {
        console.error('解析存储的坐标时发生错误，使用默认坐标: ', e);
    }
}
const tolerance = 0.005;
let isWithinTolerance = true;
function isCoordinateCloseEnough(storedCoordinates, latitude, longitude, tolerance) {
    if (!storedCoordinates) {
        return true;
    }
    const latDifference = Math.abs(storedCoordinates.latitude - latitude);
    const lonDifference = Math.abs(storedCoordinates.longitude - longitude);
    if (latDifference > tolerance || lonDifference > tolerance) {
        isWithinTolerance = true; // 坐标不在容差范围内，设置isMatch为true
    } else {
        isWithinTolerance = false; // 坐标在容差范围内，设置isMatch为false
    }
    return isMatch;
}
function processIfCoordinateChanged(storedCoordinates, latitude, longitude) {
    if (isCoordinateCloseEnough(storedCoordinates, latitude, longitude, tolerance)) {
        const newCoordinates = { latitude: latitude, longitude: longitude };
        localStorage.setItem('newCoordinateName', JSON.stringify(newCoordinates));
        localStorage.removeItem('tagsText');
        localStorage.removeItem('state');
        localStorage.removeItem('address');
        getAddressAndProcessData(latitude, longitude);
        shouldDisplayImage = false;
        clearImageDisplay()
    } else {

    }
}
processIfCoordinateChanged(storedCoordinates, latitude, longitude)

function getAddress(lat, lon) {
    return new Promise((resolve) => {
        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.123.com`,
                onload: function(response) {
                   //
                    if (response.status === 200) {
                       //
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve({ error: `无法获取地址。状态码: ${response.status}`, lat, lon }); // 使用 resolve 代替 reject
                    }
                },
                onerror: function(error) {

                    resolve({ error: "在获取地址时发生错误", lat, lon }); // 使用 resolve 代替 reject
                }
            });
        } catch (error) {

            resolve({ error: "在获取地址时发生异常", lat, lon }); // 使用 resolve 代替 reject
        }
    });
}

function checkAndSendRequest() {

    if (isMatch && isWithinTolerance) {
        sendRequest();
    }
}
function getAddressAndProcessData(latitude, longitude) {

    getAddress(latitude, longitude)
        .then(addressData => {
            if (addressData) {
                ['country', 'state', 'region', 'city'].forEach(key => {
                    processAddressData(addressData, key);
                });
            } else {
            }

checkAndSendRequest();

window.checkAndSendRequest = checkAndSendRequest;
    })
    .catch(errorData => {
        // 此处可以继续使用 errorData.lat 和 errorData.lon
    });
}

function processAddressData(data, key) {
    if (data && data.address && data.address[key]) {
        const value = data.address[key].split('/')[0].trim();
        const storedValue = localStorage.getItem(key);
        localStorage.setItem(key, value);
        // 如果 country 信息相同，则清除 localStorage 中的 country 信息
/*        if (key === 'country' && storedValue === value) {
            localStorage.removeItem(key);
        } else if (storedValue !== value) {
            // 对于 country 以外的信息，或者 country 信息不同，更新 localStorage
          //
            localStorage.setItem(key, value);
        }
*/
    } else {
    }
}
// 初始化一个变量来跟踪重试次数
let retryCount = 0;
    function sendRequest() {
                    const mapsId = localStorage.getItem('mapsId');
                    const country = localStorage.getItem('country');
                    // 定义将要发送的数据
                    const dataToSend = JSON.stringify({ mapsId, coordinates: `${latitude},${longitude}`,country });
                    // 使用GM_xmlhttpRequest发送坐标和mapsId到指定的服务器地址
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: 'http://knowledgetips.fun:3000/receive-data',
                        data: JSON.stringify({ mapsId, coordinates: `${latitude},${longitude}`,country }),
                        headers: {
                            "Content-Type": "application/json"
                        },
onload: function(response) {
   //
    if (response && response.responseText) {
        try {
            const jsonResponse = JSON.parse(response.responseText);
            handleResponse(response);
        } catch (error) {
            console.error('解析响应时出错:', error);
            console.error('原始响应文本:', response.responseText);
        }
    } else {
        console.error('响应文本不存在或为空');
    }
},
    onerror: function(error) {
        // 检查是否已达到最大重试次数
        if (retryCount < 3) {
            retryCount++;
            setTimeout(sendRequest, 1000); // 1秒后重新发送请求
        } else {
        }
    },
                    });
}
function handleResponse(response) {
    try {
        const jsonResponse = JSON.parse(response.responseText);
        // 处理 jsonResponse
        processResponseData(jsonResponse);
        storeResponseData(jsonResponse);
        updateIsMatch(jsonResponse);
        updateButtonStates(jsonResponse);
    } catch (error) {
        console.error("解析JSON失败：", error);
    }
}
function storeResponseData(jsonResponse) {
    // 检查响应中是否包含 creator 字段
    if (jsonResponse.hasOwnProperty('creator')) {
        const creatorName = jsonResponse.creator;
        localStorage.setItem('creatorName', creatorName); // 将 creator 字段的内容存储在 localStorage 中
      //
    }
    // 检查响应中是否包含 images 字段
    if (jsonResponse.hasOwnProperty('images')) {
        const images = jsonResponse.images;
        localStorage.setItem('images', JSON.stringify(images)); // 将 images 字段的内容以字符串形式存储在 localStorage 中
      //
        // 检查是否存在 imagetip 键，并单独存储
        if (images.hasOwnProperty('imagetip')) {
            const imagetip = images.imagetip;
            localStorage.setItem('imagetip', imagetip); // 单独存储 imagetip 字段的内容
          //
        }
    }
}
function updateIsMatch(jsonResponse) {
        // 根据响应中的 mymapsid 值更新 isMatch 变量
        if (jsonResponse.hasOwnProperty('mymapsid')) {
            isMatch = jsonResponse.mymapsid;
        }
}
// ***********************控制按钮的颜色***********************  //
function updateButtonStates(jsonResponse) {
    const buttonContainer = document.getElementById('buttonGroup');
    const buttons = buttonContainer.querySelectorAll('button');
    // 首先，从所有按钮中移除 'buttonActive' 类
    buttons.forEach(button => button.classList.remove('buttonActive'));
    for (const key in jsonResponse.images) {
      //
        if (jsonResponse.images[key]) {
            const button = buttonContainer.querySelector(`button[data-function="${key}"]`);
            if (button) {
                button.classList.add('buttonActive');
               //
            } else {
             //
            }
        } else {
          //
        }
    }
}
// ***********************控制按钮的颜色***********************  //
function processResponseData(jsonResponse, coordinates) {
    if (jsonResponse.match === false) {
        return;
    }
    if (jsonResponse.match && jsonResponse.tags && jsonResponse.tags.join('; ').length >= 6) {
        // 将标签数组转换为文本并存储在localStorage中
        const tagsText = jsonResponse.tags.join('; ');
        // 更新模态窗口内容
        const modal = document.getElementById('customModal');
        if (modal.style.display !== 'none') {
            const modalContent = document.getElementById('modalContent');
            modalContent.textContent = tagsText; // 更新模态窗口内容
        }
        // 显示模态窗口
        localStorage.setItem('tagsText', tagsText);
        localStorage.setItem('coordinates', JSON.stringify(coordinates));
        showModal(tagsText);
    } else {
        skipCountdown()
        showModal('无提示');
    }
}
const customInputBox = document.getElementById('customInputBox');
function updateImagesDict() {
        // 检查是否在customInputBox中
    if (document.activeElement === customInputBox) {
       //
        return;
    }
        // 如果shouldDisplayImage为false，则不执行任何操作
    if (!shouldDisplayImage) {
       //
        return;
    }
    // 尝试从localStorage获取images字段
    const storedImages = localStorage.getItem('images');
 //
    let imagesDict = {};
    if (storedImages) {
        try {
            // 将存储的字符串转换为对象
            imagesDict = JSON.parse(storedImages);
        } catch (error) {
            console.error("解析images失败:", error);
        }
    }
    return imagesDict;
}
// 创建或获取img标签的函数
function getOrCreateImageTag() {
    let imgTag = document.getElementById('uniqueImageId');
    if (!imgTag) {
        imgTag = document.createElement('img');
        imgTag.id = 'uniqueImageId';
        // 设置样式
        Object.assign(imgTag.style, {
            height: "80vh", // 高度为视口高度的80%
            width: 'auto',
            backgroundColor: 'white',
            position: 'absolute',  // 绝对定位
            left: '30%',  // 水平居中
            top: '46%',  // 垂直居中
            transform: 'translate(-50%, -50%)',  // 用于确保准确居中
            zIndex: 1200, // 高层级
            display: 'none'  // 默认不显示图片
        });
        document.body.appendChild(imgTag);
    }
    return imgTag;
}
// 用于显示或隐藏图片的函数
function displayImage(fieldName, fieldKey) {
        // 如果shouldDisplayImage为false，则不执行任何操作
    // 每次调用时都从localStorage获取最新的imagesDict
    const imagesDict = updateImagesDict();
        // 在适当的时机调用 setupModalListener
    // 当imagesDict为空时，不执行任何操作
 try {
    if (Object.keys(imagesDict).length === 0) {
        return;
    }
        let imgTag;
        if (['1', '2', '3', '4', '5', '6'].includes(fieldKey)) {
            imgTag = document.getElementById('imageDisplay');
        } else {
            imgTag = getOrCreateImageTag();
        }
        // 检查imagesDict是否包含fieldName对应的项
        if (imgTag && imagesDict.hasOwnProperty(fieldName)) {
            if (imgTag.style.display === 'none' || imgTag.src !== imagesDict[fieldName]) {
                imgTag.src = imagesDict[fieldName];
                imgTag.style.display = 'block';
            } else {
                imgTag.style.display = 'none';
            }
        } else {
        }
    } catch (error) {
       // console.error(`显示图片时发生错误: ${error.message}`);
    }
}
function clearImageDisplay() {
    const imgTag = document.getElementById('imageDisplay');
    if (imgTag) {
        imgTag.style.display = 'none';  // 隐藏图片容器
      //
    } else {
    }
}
// 仅在必要时添加事件监听器
function setupEventListener() {
    const imagesDict = updateImagesDict();
    const existingListener = document.getElementById('imageDisplayListener');
    if (!existingListener) {
        const listenerTag = document.createElement('span');
        listenerTag.id = 'imageDisplayListener';
        document.body.appendChild(listenerTag);
        document.addEventListener('keyup', function(event) {
            const fieldKeyMap = {
                '1': 'imagetip',
                '2': 'nationalflag',
                '3': 'areanumber',
                '4': 'licensePlate',
                '5': 'text',
                '6': 'tellphone',
                'e': 'mapjpg',
                'r': '3dmap',
                't': 'climateimg'
            };
            const fieldKey = event.key;
            const fieldName = fieldKeyMap[fieldKey];
            if (fieldName) {
             //
                displayImage(fieldName, fieldKey, imagesDict);
            } else {
              //
            }
        });
    }
}
/****************************以下这段代码有bug不知道怎么解决，
就是在点击事件中，总会被重复执行，随着游戏轮次增加
每次点击按钮显示图片，都会被重复执行
当点击一次按钮时，会输出三次点击效果，如果是第四轮游戏，就会同时输出四次点击效果，以此类推。。。
*/
// 假设 setupEventListener 是在这个函数内定义的
function outerFunction(callback) {
function setupModalListener() {
    const buttonGroup = document.getElementById('buttonGroup');
    if (buttonGroup) {
        buttonGroup.addEventListener('click', function(event) {
            if (event.target && event.target.classList.contains('modalButton')) {
                // 根据按钮的 data-function 属性确定要显示的图片
                const fieldName = event.target.getAttribute('data-function');
                const fakeEvent = { key: '1' };
                displayImage(fieldName, fakeEvent.key);
            }
        });
    } else {
    }
}
// displayImage 函数保持不变
setupModalListener();
}
//*********上面这段代码
// 执行事件监听器设置
setupEventListener();
        // ... 其他需要坐标的函数
    } else {
    }
                    } else {
    }
            // 确保在这一点之后使用 latitude 和 longitude
if (latitude !== undefined && longitude !== undefined) {
    // 使用 latitude 和 longitude 的代码
    // ...
}
        }else {
    // 清空modalContent的内容
    modalContent.innerHTML = '';
//
    }
            }
    }, false);
// 括号被移动到最后了
});
        }
        realSend.call(this, value); // 使用正确的上下文调用原始send方法
    } catch (error) {
        console.error("send方法替换中发生错误:", error);
        // 可以选择在出错时调用原始send方法或者处理错误
        realSend.call(this, value);
    }

// 重写open方法以捕获请求URL
XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    this._url = url; // 保存请求的URL
    this.realOpen(method, url, async, user, pass);
};
    if (XMLHttpRequest.prototype.send === XMLHttpRequest.prototype.realSend) {
      //  console.error('Tampermonkey script failed to override XMLHttpRequest.send.');
    } else {
    }
})();