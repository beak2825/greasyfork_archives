// ==UserScript==
// @name         MyGTOJ
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  This is our adrenaline-pumping combo move!
// @author       desivr
// @match        https://coding-oj.gaotu100.com/*
// @match        http://coding-oj.gaotu100.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/492468/MyGTOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/492468/MyGTOJ.meta.js
// ==/UserScript==
const defaultEnablePE = true; // 启用手机自适应功能
const defaultPcImage = "https://api.oick.cn/random/api.php?type=pc";
// 随机风景图API：https://unsplash.it/1600/900?random
const defaultPeImage = "https://api.oick.cn/random/api.php?type=pe";
const updateLogHtml = `
<h2>设置内容解释</h2>
<ol>
  <li>第一个复选框代表是否启用手机版壁纸，勾选后会自适应电脑或手机设备，如果是手机设备就加载手机随机图片api，反之加载电脑图片api</li>
  <li>第二个文本框代表电脑随机图片API，你可以填写自己的API</li>
  <li>第三个文本框代表手机随机图片API，你可以填写自己的API，如果没有勾选上面的复选框则不启用</li>
  <li>保存按钮代表保存设置，并且切换壁纸</li>
</ol>

<h2>更新日志</h2>

<h3>2.3版本更新(2024-05-03)</h3>
<ol>
  <li>修改保存加载功能的一些bug（其实还有很多，遇到了刷新吧，又不是不能用.jpg）</li>
  <li>优化设置界面</li>
</ol>

<h3>2.2版本更新(2024-05-02)</h3>
<ol>
  <li>添加保存加载文章的功能，可以将你的文章放在本地，加载时会从本地拿取，并替换原来的文章内容，建议写几个字保存一下（就是这个玩意把我代码量撑到790行）（嗯，疑似bug有点多，啥时候改一下）</li>
</ol>

<h3>2.1版本更新(2024-05-01)</h3>
<ol>
   <li>修复手机有时屏幕会暗下来一块，操作无反应的bug</li>
  <li>在手机menu栏添加插件按钮</li>
  <li>添加设置内容解释</li>
</ol>

<h3>2.0版本更新(2024-04-27)</h3>
<ol>
  <li>在menu栏添加插件</li>
  <li>把<a href="https://coding-oj.gaotu100.com/addon">这里</a>设为插件设置页面</li>
  <li>在插件设置页面添加GUI式更改背景的功能，废除以前在代码中修改GUI的选项</li>
  <li>更换新的左上角图标与网页预览图标</li>
</ol>

<h3>1.3.2版本更新(2024-04-27)</h3>
<ol>
  <li>更容易修改图片API（代码内）（自适应带参链接）</li>
  <li>可选择是否添加手机自适应</li>
</ol>

<hr>

<h3>1.3版本更新(2024-04-26)</h3>
<ol>
  <li>更换已经爆掉的dmoe API为零七API，快要爆掉的tuapi.eees.cc为Lorem Picsum。他们都是免费的，总有支撑不了的时候，大家理解。</li>
  <li>添加手机与电脑的图片自适应（归功于新API）</li>
</ol>

<hr>

<h3>1.2版本更新(2024-04-15)</h3>
<ol>
  <li>更新Bing图片API，请在源码13~16行更改以启用。</li>
  <li>修复某些打开窗口的黑屏bug和某些浏览器无法启用bug</li>
</ol>

<hr>

<h3>1.1版本更新(2024-04-14)</h3>
<ol>
  <li>添加仅刷新图片功能，按钮在左下角</li>
</ol>

<hr>

<h3>1.0版本更新(2024-04-13)</h3>
<ol>
  <li>增加刷新按钮，更改顶部按钮位置</li>
  <li>更改元素透明度为80%</li>
</ol>

<hr>

<h3>0.1版本(2024-02-25)</h3>
<ol>
  <li>更换gtoj背景，添加滑动跟随。</li>
  <li>更改GTOJ左上角图标和网页预览图标。</li>
</ol>

<h2>制作人员/特别鸣谢
<ol>
  <li>Made By Desivr, Bilibili@desivr @ptr0x4</li>
  <li>鸣谢：ImgTp，通义千问，以及大大小小的API</li>
  <li>代码很烂，各种陈年屎山堆积，多多谅解</li>
</ol>
`;

(function() {
    'use strict';
    function isMobile() {
        return /Mobi|Android|iPhone|iPod|BlackBerry|Windows Phone/.test(navigator.userAgent);
    }
    function csssss(){
        const customStyles = `
    .myinput {
        width: 200px;
        height: 30px;
        border: 1px solid #139be1;
        border-radius: 5px;
        color: blue;
        font-size: 15px;
        font-weight: bold;
        background-color: #faf1d8;
        text-indent: 10px;
    }
    .mybutton {
    background-color: skyblue;
    border: none;
    border-radius: 12px;
    color:white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition-duration: 0.4s;
    -webkit-transition-duration: 0.4s;
    }
    .mybutton:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,.24),
    0 17px 50px 0 rgba(0,0,0,.19);
    }
  `;

        const styleElement = document.createElement('style');
        styleElement.textContent = customStyles;

        document.head.appendChild(styleElement);
    }
    let enablePE = GM_getValue('enablePE', defaultEnablePE);
    let pcImage = GM_getValue('pcImage', defaultPcImage);
    let peImage = GM_getValue('peImage', defaultPeImage);
    var backgroundImageUrl;
    if(enablePE){
        if(isMobile()){
            backgroundImageUrl = peImage;
        } else {
            backgroundImageUrl = pcImage;
        }
    } else {
        backgroundImageUrl = pcImage;
    }

    function showSuccessMessage(messageContent) {
        // 获取或创建消息容器
        let messageContainer = document.querySelector("body > .m-message-container.is-top-center");
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = "m-message-container is-top-center";
            messageContainer.style.zIndex = "3000";
            document.body.appendChild(messageContainer);
        } else {
            // 清除旧的消息
            clearOldMessages(messageContainer);
        }

        // 创建消息组件
        const messageWrapper = createMessageWrapper();

        // 添加成功图标
        const messageIcon = addSuccessIcon(messageWrapper);

        // 添加消息内容
        const messageDescription = addMessageDescription(messageWrapper, messageContent);

        // 添加CSS过渡效果并显示消息
        applyOpacityTransition(messageWrapper);

        // 在5秒后淡出并移除消息
        scheduleMessageRemoval(messageWrapper, 5000);

        // 将带有消息的messageWrapper添加到container中
        messageContainer.appendChild(messageWrapper);

        // 辅助函数
        function createMessageWrapper() {
            const wrapper = document.createElement('div');
            wrapper.className = "m-message-wrapper";
            return wrapper;
        }

        function addSuccessIcon(wrapper) {
            const messageIcons = document.createElement('div');
            messageIcons.className = "m-message-icons";

            const icon = document.createElement('span');
            icon.className = "m-message--icon m-svg-icon m-svg-icon--success";

            const svg = createSvgIcon('success');
            messageIcons.appendChild(icon);
            icon.appendChild(svg);

            wrapper.appendChild(messageIcons);
            return messageIcons;
        }

        function createSvgIcon(type) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('version', '1.1');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('viewBox', '0 0 1024 1024');
            svg.style.color = getIconColor(type);

            const pathData = getIconPathData(type); // 需要实现此方法获取不同类型的SVG路径数据
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('d', pathData);

            svg.appendChild(path);
            return svg;
        }

        function getIconColor(type) {
            switch (type) {
                case 'success':
                    return 'rgb(23, 183, 126)';
                    // 其他类型的颜色处理...
                default:
                    return '#000';
            }
        }

        function getIconPathData(type) {
            // 实现此方法，根据type返回对应SVG路径数据
            // 示例：
            if (type === 'success') {
                return 'M512,72C269,72,72,269,72,512s197,440,440,440s440-197,440-440S755,72,512,72L512,72z M758.9,374 c-48.5,48.6-81.2,76.9-172.3,186.8c-52.6,63.4-102.3,131.5-102.7,132L462.1,720c-4.6,6.1-13.5,6.8-19.1,1.6L267.9,558.9 c-17.8-16.5-18.8-44.4-2.3-62.2s44.4-18.8,62.2-2.3l104.9,97.5c5.5,5.1,14.1,4.5,18.9-1.3c16.2-20.1,38.4-44.5,62.4-68.6 c90.2-90.9,145.6-139.7,175.2-161.3c36-26.2,77.3-48.6,87.3-36.2C792,343.9,782.5,350.3,758.9,374L758.9,374z'; // 使用示例中的SVG路径数据
            }
        }

        function addMessageDescription(wrapper, content) {
            const contentDiv = document.createElement('div');
            contentDiv.className = "m-message-content";
            const description = document.createElement('div');
            description.className = "m-message--description";
            description.textContent = content;
            contentDiv.appendChild(description);
            wrapper.appendChild(contentDiv);
            return description;
        }

        function applyOpacityTransition(wrapper) {
            wrapper.style.opacity = 0;
            wrapper.style.transition = 'opacity 0.5s ease-in-out';
            requestAnimationFrame(() => {
                wrapper.style.opacity = 1;
            });
        }

        function clearOldMessages(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        function scheduleMessageRemoval(wrapper, timeout) {
            setTimeout(() => {
                wrapper.style.opacity = 0;
                setTimeout(() => {
                    wrapper.remove();
                }, 500); // 设置一个小延时以等待淡出动画完成
            }, timeout);
        }
    }
    // 设置背景图片
    function setBg() {
        document.body.style.backgroundImage = "url(" + backgroundImageUrl + ")";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center center";
    }

    // 防止背景图片随滚动消失
    function fix() {
        window.addEventListener('scroll', function() {
            var yOffset = window.pageYOffset;
            var y = Math.max(yOffset, 0);
            document.body.style.backgroundPositionY = y + 'px';
        });
    }

    // 替换头图
    function replaceHI() {
        var imgSelector = 'img[src="/assets/img/logo.a0924d7d.png"]';
        var images = document.querySelectorAll(imgSelector);
        images.forEach(function(img) {
            var newSrc = 'https://img2.imgtp.com/2024/04/27/Lzf19AGt.png';
            img.src = newSrc;
        });
    }

    // 替换图标
    function replaceF() {
        var newFaviconUrl = 'https://img2.imgtp.com/2024/04/27/Tdzd8Ut0.ico';
        var links = document.querySelectorAll('link');
        for (var i = 0; i < links.length; i++) {
            if (links[i].rel === 'icon' || links[i].rel === 'shortcut icon') {
                links[i].href = newFaviconUrl;
            }
        }
    }

    // 改变其他元素透明度
    function changeOpacity() {
        var elements = document.querySelectorAll('.full-height.flex-column');
        elements.forEach(function(element) {
            element.style.opacity = 0.8;
        });
    }
    // 创建刷新按钮
    function refreshButton() {
        const cssStyle = `
            .custom-refresh-button {
                /* 按钮样式 */
                -webkit-text-size-adjust: 100%;
                font-weight: 400;
                -webkit-tap-highlight-color: transparent;
                line-height: 1.5;
                font-variant: tabular-nums;
                font-feature-settings: "tnum";
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif !important;
                box-sizing: border-box;
                color: #409eff;
                position: fixed;
                background-color: #fff;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 0 6px rgba(0,0,0,0.12);
                cursor: pointer;
                z-index: 5;
                right: 10px;
                bottom: 10px;
                background-image: url('https://img2.imgtp.com/2024/04/13/UHYlTeCQ.png');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 20px 20px;
                overflow: hidden;
            }

            .custom-refresh-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: transparent;
                transition: background-color 0.3s ease;
            }

            .custom-refresh-button:hover::before {
                background-color: rgba(0, 0, 0, 0.5);
            }
        `;

        // 注入CSS样式
        const styleElement = document.createElement('style');
        styleElement.textContent = cssStyle;
        document.head.appendChild(styleElement);

        // 创建并添加刷新按钮
        const refreshButton = document.createElement('div');
        refreshButton.classList.add('custom-refresh-button');
        refreshButton.addEventListener('click', () => window.location.reload());
        document.body.appendChild(refreshButton);
    }
    // 改置顶按钮位置
    function modBacktop() {
        let observerConfig = { childList: true, subtree: true };
        const targetNode = document.body;

        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.matches && node.matches('.el-backtop')) {
                            node.style.bottom = '60px';
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, observerConfig);
    }// 创建刷新图片按钮
    function reloadImage() {
        // 图标和背景图片的URL
        const newIconUrl = 'https://img2.imgtp.com/2024/04/14/RW8cANAE.png';

        // 定义按钮的CSS样式，包括新图标的背景
        const cssStyle = `
        .custom-reload-image-button {
            -webkit-text-size-adjust: 100%;
            font-weight: 400;
            -webkit-tap-highlight-color: transparent;
            line-height: 1.5;
            font-variant: tabular-nums;
            font-feature-settings: "tnum";
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, Arial, sans-serif !important;
            box-sizing: border-box;
            color: #409eff;
            position: fixed;
            background-color: #fff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 6px rgba(0,0,0,0.12);
            cursor: pointer;
            z-index: 5;
            left: 10px;
            bottom: 10px;
            background-image: url('${newIconUrl}');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 20px 20px;
            overflow: hidden;
        }

        .custom-reload-image-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            transition: background-color 0.3s ease;
        }

        .custom-reload-image-button:hover::before {
            background-color: rgba(0, 0, 0, 0.5);
        }
    `;

        // 注入CSS样式
        const styleElement = document.createElement('style');
        styleElement.textContent = cssStyle;
        document.head.appendChild(styleElement);

        // 创建并添加刷新背景图片的按钮
        function reloadBackgroundImage() {
            const body = document.body;

            // 动态创建新的img元素以强制重新加载图片
            const tempImg = new Image();
            if (backgroundImageUrl.includes('?')){
                tempImg.src = backgroundImageUrl + '&' + new Date().getTime();
            }
            else {
                tempImg.src = backgroundImageUrl + '?' + new Date().getTime(); // 添加时间戳防止缓存
            }
            tempImg.onload = function() {
                // 图片加载完成后，更新body的背景图片
                body.style.backgroundImage = 'url("' + this.src + '")';
            };
        }

        const refreshButton = document.createElement('div');
        refreshButton.classList.add('custom-reload-image-button');

        // 绑定点击事件
        refreshButton.addEventListener('click', reloadBackgroundImage);
        document.body.appendChild(refreshButton);
    }
    function fixwindows(){
        // 创建MutationObserver实例，观察文档子树的变化
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const modalDiv = mutation.target.querySelector('.v-modal[tabindex="0"]');
                    if (modalDiv) {
                        modalDiv.parentNode.removeChild(modalDiv);
                    }
                    const overlayDiv = mutation.target.querySelector('.mu-overlay[style*="position: fixed"][style*="z-index: 20141227"]');
                    if (overlayDiv) {
                        overlayDiv.parentNode.removeChild(overlayDiv);
                    }
                }
            });
        });

        // 从文档根节点开始观察
        const targetNode = document.documentElement;
        const config = { childList: true, subtree: true };

        // 开始监视
        observer.observe(targetNode, config);

        // 在页面卸载时停止观察
        window.addEventListener('beforeunload', () => observer.disconnect());
    }

    function addonButton(){ // 目标定位到特定的UL元素
        if(!isMobile()){
            // 目标定位到特定的UL元素
            const menuBar = document.querySelector('ul.el-menu--horizontal.el-menu[data-v-5331f7a2]');
            // 创建新的LI元素及其内容
            const newMenuItem = document.createElement('li');
            newMenuItem.setAttribute('data-v-5331f7a2', '');
            newMenuItem.setAttribute('role', 'menuitem');
            newMenuItem.setAttribute('tabindex', '0');
            newMenuItem.classList.add('el-menu-item');

            // 应用与现有项相同的样式
            newMenuItem.style.color = 'rgb(73, 80, 96)';
            newMenuItem.style.borderBottomColor = 'transparent';

            // 创建图像元素并添加至LI
            const addonImage = document.createElement('img');
            addonImage.src = 'https://img2.imgtp.com/2024/04/27/jpkV4cRc.png';
            addonImage.alt = 'addon';
            addonImage.width = '24';
            addonImage.height = '14';
            newMenuItem.appendChild(addonImage);

            // 向LI添加文本节点
            const addonText = document.createTextNode('插件');
            newMenuItem.appendChild(addonText);

            // 给LI元素添加点击事件，实现跳转
            newMenuItem.addEventListener('click', function() {
                window.location.href = 'https://coding-oj.gaotu100.com/addon';
            });
            //不想改了捏，ajax好难捏

            // 在“团队”LI之后插入新的“插件”LI
            let teamItem;
            for (const item of menuBar.querySelectorAll('li.el-menu-item[data-v-5331f7a2][role="menuitem"][tabindex="0"]')) {
                if (item.textContent.includes('团队')) {
                    teamItem = item;
                    break;
                }
            }
            menuBar.insertBefore(newMenuItem, teamItem.nextSibling);
        }
        else{
            // 获取目标元素
            var targetElement = document.querySelector("#app > div > div:nth-child(1) > div:nth-child(1) > div > ul > li:nth-child(8)")

            // 新增HTML内容
            const newLiElement = `
        <li data-v-5331f7a2="">
            <a href="/addon" class="mu-item-wrapper">
                <div class="mu-item">
                    <div class="mu-ripple-wrapper"></div>
                    <img src="https://img2.imgtp.com/2024/04/27/WWmipuak.png" alt="aa.png" title="aa.png" />
                    <div data-v-5331f7a2="" class="mu-item-title">插件</div>
                </div>
            </a>
        </li>
    `;

            // 在目标元素的最后一个子节点后插入新的li元素
            targetElement.insertAdjacentHTML('beforeend', newLiElement);
        }
    }
    function customizeAddonPage() {
        // 检查是否处于目标页面
        if (window.location.href === 'https://coding-oj.gaotu100.com/addon' || window.location.href === 'http://coding-oj.gaotu100.com/addon') {
            document.title = "Addon - MyGTOJ高途编程";

            // 创建带有属性的元素的实用函数
            function createEl(tag, attrs = {}, children = []) {
                const el = document.createElement(tag);
                for (const attr in attrs) {
                    el.setAttribute(attr, attrs[attr]);
                }
                children.forEach(child => {
                    if (typeof child === 'string') {
                        el.appendChild(document.createTextNode(child));
                    } else {
                        el.appendChild(child);
                    }
                });
                return el;
            }

            // 获取待替换的容器元素
            const ojContentDiv = document.querySelector('#oj-content > div > div.el-card__body');
            ojContentDiv.innerHTML = ""; // 清空原有内容

            // 第一个元素：启用手机版壁纸复选框
            const enablePECheckbox = createEl('input', {
                type: 'checkbox',
                id: 'enablePE',
                checked: enablePE // 假设enablePE是一个全局变量，表示默认是否启用手机版壁纸
            }, []);
            // 中文注释
            const enablePELabel = createEl('label', { htmlFor: 'enablePE' }, ['启用手机版壁纸']);
            enablePECheckbox.addEventListener('change', () => {
                enablePE = enablePECheckbox.checked;
                // 根据复选框状态决定是否加载手机或电脑图片API
            });

            // 第二个元素：电脑随机图片API输入框
            const pcImageInput = createEl('input', {
                type: 'text',
                value: pcImage, // 假设pcImage是一个全局变量，表示电脑图片API
                placeholder: '请输入电脑图片链接',
                class: 'myinput'
            }, []);
            // 中文注释
            const pcImageInputLabel = createEl('label', {}, ['电脑随机图片API：']);

            // 第三个元素：手机随机图片API输入框
            const peImageInput = createEl('input', {
                type: 'text',
                value: peImage, // 假设peImage是一个全局变量，表示手机图片API
                placeholder: '请输入手机图片链接',
                class: 'myinput'
            }, []);
            // 中文注释
            const peImageInputLabel = createEl('label', {}, ['手机随机图片API（仅在启用手机版壁纸时生效）：']);

            // 保存设置并切换壁纸按钮
            const saveButton = createEl('button', { type: 'button', class: 'mybutton' }, ['保存']);
            saveButton.addEventListener('click', () => {
                // 在此处实现保存设置和切换壁纸的功能
            });

            // 将元素添加至容器中
            ojContentDiv.appendChild(enablePECheckbox);
            ojContentDiv.appendChild(enablePELabel);
            ojContentDiv.appendChild(document.createElement('br'));
            ojContentDiv.appendChild(pcImageInputLabel);
            ojContentDiv.appendChild(pcImageInput);
            ojContentDiv.appendChild(document.createElement('br'));
            ojContentDiv.appendChild(peImageInputLabel);
            ojContentDiv.appendChild(peImageInput);
            ojContentDiv.appendChild(document.createElement('br'));
            ojContentDiv.appendChild(saveButton);
            ojContentDiv.appendChild(document.createElement('br'));
            const parser = new DOMParser();
            const docFragment = parser.parseFromString(updateLogHtml, 'text/html');

            // 解析后的所有子节点添加到目标容器的末尾
            for (let i = 0; i < docFragment.documentElement.childNodes.length; i++) {
                const childNode = docFragment.documentElement.childNodes[i].cloneNode(true);
                ojContentDiv.appendChild(childNode);
            }


            // 为保存按钮添加点击事件监听器
            saveButton.addEventListener('click', () => {
                // 存储更新后的值到localStorage
                GM_setValue('enablePE', enablePE);
                GM_setValue('pcImage', pcImage);
                GM_setValue('peImage', peImage);
                if(enablePE){
                    if(isMobile()){
                        backgroundImageUrl = peImage;
                    } else {
                        backgroundImageUrl = pcImage;
                    }
                } else {
                    backgroundImageUrl = pcImage;
                }
                const body = document.body;

                // 动态创建新的img元素以强制重新加载图片
                const tempImg = new Image();
                if (backgroundImageUrl.includes('?')){
                    tempImg.src = backgroundImageUrl + '&' + new Date().getTime();
                }
                else {
                    tempImg.src = backgroundImageUrl + '?' + new Date().getTime(); // 添加时间戳防止缓存
                }
                tempImg.onload = function() {
                    // 图片加载完成后，更新body的背景图片
                    body.style.backgroundImage = 'url("' + this.src + '")';
                };
                showSuccessMessage('保存成功');
            });
        }
    }

    var title = localStorage.getItem('title') || ' ';
    var description = localStorage.getItem('description') || ' ';
    var classify = localStorage.getItem('classify') || ' ';
    var writedocument = localStorage.getItem('writedocument') || ' ';

    function documentExplorer(ismain) {
        var dialogFooter;
        // 获取目标父节点（假设它允许包含button）
        if(ismain){
            dialogFooter = document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__footer > span");
        }
        else{
            dialogFooter = document.querySelector("#oj-content > div > div:nth-child(3) > div > div.el-dialog__footer > span");
        }

        // 创建并添加保存按钮
        const saveButton = document.createElement('button');
        saveButton.setAttribute('data-v-035c1bb8', '');
        saveButton.type = 'button';
        saveButton.classList.add('el-button', 'el-button--danger');
        const saveButtonText = document.createElement('span');
        saveButtonText.textContent = '保存';
        saveButton.appendChild(saveButtonText);
        dialogFooter.appendChild(saveButton);

        saveButton.addEventListener('click', function(event) {
            event.preventDefault();
            title = document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(1) > div > div > input").value;
            description = document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(2) > div > div > input").value;
            classify = document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(3) > div > div > div.el-input.el-input--suffix > input").value;
            writedocument = document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(4) > div > div > div > div.v-note-panel > div.v-note-edit.divarea-wrapper.scroll-style.transition > div > div > textarea").value;

            // 存储数据到localStorage
            localStorage.setItem('title', title);
            localStorage.setItem('description', description);
            localStorage.setItem('classify', classify);
            localStorage.setItem('writedocument', writedocument);

            showSuccessMessage('保存成功');
        });

        // 创建并添加加载按钮
        const loadButton = document.createElement('button');
        loadButton.setAttribute('data-v-035c1bb8', '');
        loadButton.type = 'button';
        loadButton.classList.add('el-button', 'el-button--primary');
        const loadButtonText = document.createElement('span');
        loadButtonText.textContent = '加载';
        loadButton.appendChild(loadButtonText);
        dialogFooter.appendChild(loadButton);

        loadButton.addEventListener('click', function(event) {
            event.preventDefault();
            showSuccessMessage('加载成功');

            // 从localStorage加载数据
            title = localStorage.getItem('title') || ' ';
            description = localStorage.getItem('description') || ' ';
            classify = localStorage.getItem('classify') || ' ';
            writedocument = localStorage.getItem('writedocument') || ' ';

            // 将数据赋值给对应的DOM元素，并触发事件
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(1) > div > div > input").value = title;
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(1) > div > div > input").dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(1) > div > div > input").dispatchEvent(new Event('change', { bubbles: true }));

            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(2) > div > div > input").value = description;
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(2) > div > div > input").dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(2) > div > div > input").dispatchEvent(new Event('change', { bubbles: true }));

            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(3) > div > div > div.el-input.el-input--suffix > input").value = classify;
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(3) > div > div > div.el-input.el-input--suffix > input").dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(3) > div > div > div.el-input.el-input--suffix > input").dispatchEvent(new Event('change', { bubbles: true }));

            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(4) > div > div > div > div.v-note-panel > div.v-note-edit.divarea-wrapper.scroll-style.transition > div > div > textarea").value = writedocument;
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(4) > div > div > div > div.v-note-panel > div.v-note-edit.divarea-wrapper.scroll-style.transition > div > div > textarea").dispatchEvent(new Event('input', { bubbles: true }));
            document.querySelector("#oj-content > div > div.el-dialog__wrapper > div > div.el-dialog__body > form > div:nth-child(4) > div > div > div > div.v-note-panel > div.v-note-edit.divarea-wrapper.scroll-style.transition > div > div > textarea").dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    var isDetailVisited = false;
    var isDiscussionVisited = false;
    var currentUrl;

    function startexper() {
        setInterval(function() {
            currentUrl = new URL(window.location.href);

            // 判断discussion是否在路径中且discussion-detail不在路径中
            if (currentUrl.pathname.includes('/discussion') && !currentUrl.pathname.includes('/discussion-detail')) {
                if (!isDiscussionVisited) {
                    isDiscussionVisited = true;
                    documentExplorer(true);
                }
            }
            else {
                isDiscussionVisited = false;
            }

            // 判断discussion-detail是否在路径中
            if (currentUrl.pathname.includes('/discussion-detail')) {
                if (!isDetailVisited) {
                    isDetailVisited = true;
                    documentExplorer(false);
                }
            }
            else {
                isDetailVisited = false;
            }
        }, 500);
    }

    // 页面加载完成后执行所有功能
    window.onload = function() {
        console.log("Welcome To MyGTOJ!\nMade By Desivr");
        csssss();
        setBg();
        fix();
        replaceHI();
        replaceF();
        changeOpacity();
        refreshButton();
        modBacktop();
        reloadImage();
        fixwindows();
        addonButton();
        customizeAddonPage();
        startexper();
    };
})();