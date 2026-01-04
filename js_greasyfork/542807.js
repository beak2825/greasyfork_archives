// ==UserScript==
// @name         摸鱼偷懒小说阅读器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在浏览器右侧查看本地小说txt，支持gbk/utf8编码、调整字体透明度、阅读进度、鼠标悬停显示，移开隐藏等
// @author       CYC
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542807/%E6%91%B8%E9%B1%BC%E5%81%B7%E6%87%92%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542807/%E6%91%B8%E9%B1%BC%E5%81%B7%E6%87%92%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用于存储文件内容和滚动定时器
    let contentData = '';
    let scrollTimeout;
    const STORAGE_KEY = 'novel_reader_progress'; // 本地存储进度的键名

    // 创建主阅读器容器
    const reader = document.createElement('div');
    reader.style.position = 'fixed';
    reader.style.right = '10px';
    reader.style.top = '50%';
    reader.style.transform = 'translateY(-50%)';
    reader.style.width = '250px';
    reader.style.height = '400px';
    reader.style.background = 'transparent';
    reader.style.zIndex = 99999;
    reader.style.pointerEvents = 'auto';
    reader.style.display = 'flex';
    reader.style.flexDirection = 'column';
    reader.style.justifyContent = 'space-between';

    // 显示文本的区域
    const textEl = document.createElement('div');
    textEl.style.flex = '1';
    textEl.style.flex = '1';
    textEl.style.overflowY = 'auto';
    textEl.style.fontSize = '14px';
    textEl.style.color = 'rgba(0,0,0,0.8)';
    textEl.style.lineHeight = '1.5';

    // 设置面板容器（初始隐藏）
    const controlWrapper = document.createElement('div');
    controlWrapper.style.position = 'absolute';
    controlWrapper.style.top = '6%';
    controlWrapper.style.right = '0';
    controlWrapper.style.width = '100%';
    controlWrapper.style.background = 'rgba(255,255,255,0.3)';
    controlWrapper.style.display = 'none';
    controlWrapper.style.flexDirection = 'column';
    controlWrapper.style.gap = '1px';
    controlWrapper.style.padding = '1px';

    // ⚙️按钮：用于显示/隐藏设置面板
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '⚙️';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = '0';
    toggleBtn.style.right = '0';
    toggleBtn.style.zIndex = 999999;
    toggleBtn.onclick = () => {
        controlWrapper.style.display = controlWrapper.style.display === 'none' ? 'flex' : 'none';
    };

    // 文件选择输入（支持.txt 和 .epub）
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.epub';

    // 字体大小调节
    const fontSizeInput = document.createElement('input');
    fontSizeInput.type = 'range';
    fontSizeInput.min = 10;
    fontSizeInput.max = 30;
    fontSizeInput.value = 14;
    fontSizeInput.title = '字体大小';
    fontSizeInput.oninput = () => {
        textEl.style.fontSize = fontSizeInput.value + 'px';
    };

    // 字体透明度调节
    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.min = 0;
    opacityInput.max = 100;
    opacityInput.value = 80;
    opacityInput.title = '字体透明度';
    opacityInput.oninput = () => {
        textEl.style.color = `rgba(0,0,0,${opacityInput.value / 100})`;
    };

    // 切换深色模式按钮
    const darkModeToggle = document.createElement('button');
    darkModeToggle.textContent = '切换深色模式';
    darkModeToggle.onclick = () => {
        if (reader.style.background === 'black') {
            reader.style.background = 'transparent';
            textEl.style.color = `rgba(0,0,0,${opacityInput.value / 100})`;
        } else {
            reader.style.background = 'black';
            textEl.style.color = 'rgba(255,255,255,0.9)';
        }
    };

    // 章节选择器（通过正则识别章节标题）
    const chapterSelect = document.createElement('select');
    chapterSelect.title = '跳转章节';
    chapterSelect.style.maxWidth = '100%';
    chapterSelect.onchange = () => {
        const index = parseInt(chapterSelect.value);
        const pos = textEl.scrollHeight * index / 100;
        textEl.scrollTop = pos;
    };

    // 阅读进度条
    const progressInput = document.createElement('input');
    progressInput.type = 'range';
    progressInput.min = 0;
    progressInput.max = 100000;
    progressInput.value = 0;
    progressInput.title = '阅读进度';
    progressInput.oninput = () => {
        const percent = progressInput.value / 1000;
        const scrollHeight = textEl.scrollHeight - textEl.clientHeight;
        textEl.scrollTop = scrollHeight * percent / 100;
        progressLabel.textContent = percent.toFixed(3) + '%';
    };

    // 显示百分比的标签
    const progressLabel = document.createElement('div');
    progressLabel.textContent = '0.000%';
    progressLabel.style.fontSize = '12px';
    progressLabel.style.textAlign = 'center';

    // 文件选择逻辑（自动判断是否是gbk编码）
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext === 'epub') {
            alert('EPUB暂未支持，未来版本支持');
            return;
        }

        const readerUTF8 = new FileReader();
        readerUTF8.onload = () => {
            let content = readerUTF8.result;
            if (/�/.test(content)) { // 如果有乱码，尝试用GBK重新读
                const readerGBK = new FileReader();
                readerGBK.onload = () => {
                    const gbkText = new TextDecoder('gbk').decode(readerGBK.result);
                    contentData = gbkText;
                    renderContent(contentData);
                };
                readerGBK.readAsArrayBuffer(file);
            } else {
                contentData = content;
                renderContent(contentData);
            }
        };
        readerUTF8.readAsText(file, 'utf-8');
    });

    // 渲染小说内容并提取章节信息
    function renderContent(text) {
        textEl.innerText = text;
        chapterSelect.innerHTML = '';
        const lines = text.split('\n');
        let chapterCount = 0;
        lines.forEach((line, i) => {
            if (/第.{1,9}[章节卷集]/.test(line)) {
                const opt = document.createElement('option');
                opt.text = line.trim().slice(0, 20);
                opt.value = Math.floor(i / lines.length * 100);
                chapterSelect.appendChild(opt);
                chapterCount++;
            }
        });
        if (chapterCount === 0) {
            const opt = document.createElement('option');
            opt.text = '无章节';
            opt.value = 0;
            chapterSelect.appendChild(opt);
        }
    }

    // 滚动监听，更新阅读进度并存入 localStorage
    textEl.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollTop = textEl.scrollTop;
            const scrollHeight = textEl.scrollHeight - textEl.clientHeight;
            const percent = (scrollTop / scrollHeight) * 100;
            progressInput.value = Math.floor(percent * 1000);
            progressLabel.textContent = percent.toFixed(3) + '%';
            localStorage.setItem(STORAGE_KEY, percent);
        }, 300);
    });

    // 创建一个透明的感应层
const triggerArea = document.createElement('div');
triggerArea.id = 'reader-hover-trigger';
Object.assign(triggerArea.style, {
    position: 'fixed',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '250px',
    height: '400px',
    zIndex: '9998',
    background: 'transparent',
    pointerEvents: 'auto',
});
document.body.appendChild(triggerArea);

// 设置初始 reader 样式为隐藏
reader.style.opacity = '0';
reader.style.pointerEvents = 'none';
reader.style.transition = 'opacity 0.3s';

// 绑定 hover 事件
triggerArea.addEventListener('mouseenter', () => {
    reader.style.opacity = '1';
    reader.style.pointerEvents = 'auto';
});
reader.addEventListener('mouseleave', () => {
    reader.style.opacity = '0';
    reader.style.pointerEvents = 'none';
});

    // 控件添加到设置面板
    controlWrapper.appendChild(fileInput);
    controlWrapper.appendChild(fontSizeInput);
    controlWrapper.appendChild(opacityInput);
    controlWrapper.appendChild(progressInput);
    controlWrapper.appendChild(progressLabel);
    controlWrapper.appendChild(chapterSelect);
    controlWrapper.appendChild(darkModeToggle);

    // 鼠标移出阅读器时隐藏控制面板
    reader.addEventListener('mouseleave', () => {
        controlWrapper.style.display = 'none';
    });

    // DOM结构添加
    reader.appendChild(toggleBtn);
    reader.appendChild(controlWrapper);
    reader.appendChild(textEl);
    document.body.appendChild(reader);

    // 页面加载后尝试恢复上次阅读进度
    setTimeout(() => {
        const saved = parseFloat(localStorage.getItem(STORAGE_KEY));
        if (!isNaN(saved)) {
            const scrollHeight = textEl.scrollHeight - textEl.clientHeight;
            textEl.scrollTop = scrollHeight * saved / 100;
            progressInput.value = Math.floor(saved * 1000);
            progressLabel.textContent = saved.toFixed(3) + '%';
        }
    }, 1000);
})();
