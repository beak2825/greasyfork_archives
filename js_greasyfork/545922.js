// ==UserScript==
// @name         摸鱼神器 - 极简透明阅读器
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2.8
// @description  透明可调、无边栏、TXT小说阅读器；Alt+Shift+X 启动/隐藏；三击空白隐藏 + S键显示 + 自动记忆章节和滚动位置
// @author       YangKunlong
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/545922/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%20-%20%E6%9E%81%E7%AE%80%E9%80%8F%E6%98%8E%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545922/%E6%91%B8%E9%B1%BC%E7%A5%9E%E5%99%A8%20-%20%E6%9E%81%E7%AE%80%E9%80%8F%E6%98%8E%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isActive = false;
    let readerApp = null;

    function startReader() {
        if (document.getElementById('novel-reader')) return;

        // 创建阅读器容器
        const container = document.createElement('div');
        container.id = 'novel-reader';
        container.innerHTML = `
            <div id="reader-frame" style="position:fixed;top:100px;right:100px;width:400px;height:500px;z-index:999999;background:none;resize:both;overflow:hidden;min-width:200px;min-height:200px;">
                <div id="reader-header" style="height:30px;background:rgba(0,0,0,0.2);cursor:move;display:flex;align-items:center;justify-content:flex-end;padding:0 10px;color:white;font-size:14px;">
                    <button id="load-file" title="导入TXT">📂</button>
                    <button id="toggle-ui" title="隐藏/显示界面">👁️</button>
                    <button id="toggle-settings" title="设置">⚙️</button>
                </div>
                <div id="reader-body" style="height:calc(100% - 30px);display:flex;">
                    <div id="reader-sidebar" style="width:30%;display:none;background:rgba(0,0,0,0.3);overflow-y:auto;padding:10px;font-size:14px;color:white;">
                        <h4 style="margin:0 0 10px;">目录</h4>
                        <ul id="toc-list" style="list-style:none;padding:0;margin:0;"></ul>
                    </div>
                    <div id="reader-content" style="flex:1;overflow-y:auto;padding:15px;color:#ffffff;font-size:15px;line-height:1.8;white-space:pre-wrap;">
                        <div id="chapter-title" style="font-size:16px;font-weight:bold;margin-bottom:10px;"></div>
                        <div id="chapter-text">点击右上角“📂”加载TXT小说</div>
                    </div>
                </div>
                <input type="file" id="file-input" accept=".txt" style="display:none;">
            </div>
            <div id="settings-panel" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#222;color:#fff;padding:20px;border-radius:8px;display:none;z-index:1000000;font-size:14px;">
                <h3>设置</h3>
                <label>字体颜色：<input type="color" id="color-picker" value="#ffffff"></label><br>
                <label>字体大小：<input type="range" id="font-size-slider" min="12" max="24" value="15"></label><span id="font-size-value">15</span>px<br>
                <label>背景透明度：<input type="range" id="bg-opacity" min="0" max="1" step="0.05" value="0"></label><br>
                <button onclick="document.getElementById('settings-panel').style.display='none'">关闭</button>
            </div>
        `;
        document.body.appendChild(container);

        // 样式
        const style = document.createElement('style');
        style.textContent = `
            #reader-frame{transition:opacity .3s;}
            #reader-content.hide-scrollbar::-webkit-scrollbar { display:none; }
            #reader-content.hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
            #reader-frame:hover #reader-header{opacity:1;}
            #reader-header{opacity:.3;transition:opacity .3s;}
            #toc-list li{cursor:pointer;padding:5px;border-radius:3px;}
            #toc-list li:hover{background:rgba(255,255,255,.2);}
            #reader-content::-webkit-scrollbar,
            #reader-sidebar::-webkit-scrollbar{width:5px;}
            #reader-content::-webkit-scrollbar-thumb,
            #reader-sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.3);border-radius:3px;}
        `;
        document.head.appendChild(style);

        // 变量初始化
        let chapters = [], currentChapter = 0, uiVisible = true, currentFileName = '';

        const frame = document.getElementById('reader-frame');
        const sidebar = document.getElementById('reader-sidebar');
        const content = document.getElementById('reader-content');

        const saved = {
            top: GM_getValue('top', 100),
            left: GM_getValue('left', 100),
            width: GM_getValue('width', 400),
            height: GM_getValue('height', 500),
            color: GM_getValue('color', '#ffffff'),
            fontSize: GM_getValue('fontSize', 15),
            bgOpacity: GM_getValue('bgOpacity', 0)
        };
        frame.style.top = saved.top + 'px';
        frame.style.left = saved.left + 'px';
        frame.style.width = saved.width + 'px';
        frame.style.height = saved.height + 'px';
        content.style.color = saved.color;
        content.style.fontSize = saved.fontSize + 'px';
        document.getElementById('reader-body').style.background = `rgba(0,0,0,${saved.bgOpacity})`;

        // 拖拽
        let isDragging = false, dragX, dragY;
        document.getElementById('reader-header').addEventListener('mousedown', e => {
            isDragging = true;
            dragX = e.clientX - frame.offsetLeft;
            dragY = e.clientY - frame.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            frame.style.left = (e.clientX - dragX) + 'px';
            frame.style.top = (e.clientY - dragY) + 'px';
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            GM_setValue('top', parseInt(frame.style.top));
            GM_setValue('left', parseInt(frame.style.left));
        });

        // 文件导入
        document.getElementById('load-file').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        document.getElementById('file-input').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;

            currentFileName = file.name.replace(/[^a-z0-9]/gi, '_');

            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result;
                chapters = [];
                let content = '', title = '序章';
                text.split(/\r?\n/).forEach(line => {
                    if (line.match(/^第[\d一二三四五六七八九十百千万]+[章回]/)) {
                        if (content.trim()) chapters.push({ title, content: content.trim() });
                        title = line.trim();
                        content = '';
                    } else {
                        content += line + '\n';
                    }
                });
                if (content.trim()) chapters.push({ title, content: content.trim() });
                if (!chapters.length) chapters.push({ title: '全文', content: text });

                renderTOC();
                const savedChapter = GM_getValue('chapter_' + currentFileName, 0);
                displayChapter(savedChapter);
            };
            reader.readAsText(file);
        });

        function renderTOC() {
            const toc = document.getElementById('toc-list');
            toc.innerHTML = '';
            chapters.forEach((c, i) => {
                const li = document.createElement('li');
                li.textContent = c.title;
                li.onclick = () => displayChapter(i);
                toc.appendChild(li);
            });
        }

        function displayChapter(i) {
            if (!chapters[i]) return;
            currentChapter = i;
            GM_setValue('chapter_' + currentFileName, i);

            document.getElementById('chapter-title').textContent = chapters[i].title;
            document.getElementById('chapter-text').textContent = chapters[i].content;

            const lis = document.querySelectorAll('#toc-list li');
            lis.forEach((li, idx) => li.style.background = idx === i ? 'rgba(255,255,255,.2)' : '');

            setTimeout(() => {
                const saved = GM_getValue('scroll_' + currentFileName + '_' + i, 0);
                content.scrollTop = Math.round(saved * (content.scrollHeight - content.clientHeight));
            }, 0);
        }

        content.addEventListener('scroll', () => {
            if (!currentFileName) return;
            const percent = content.scrollTop / Math.max(1, content.scrollHeight - content.clientHeight);
            GM_setValue('scroll_' + currentFileName + '_' + currentChapter, percent);
        });

        document.getElementById('toggle-settings').addEventListener('click', () => {
            document.getElementById('settings-panel').style.display = 'block';
        });
        document.getElementById('color-picker').addEventListener('input', e => {
            content.style.color = e.target.value;
            GM_setValue('color', e.target.value);
        });
        document.getElementById('font-size-slider').addEventListener('input', e => {
            const size = e.target.value;
            content.style.fontSize = size + 'px';
            document.getElementById('font-size-value').textContent = size;
            GM_setValue('fontSize', size);
        });
        document.getElementById('bg-opacity').addEventListener('input', e => {
            const op = e.target.value;
            document.getElementById('reader-body').style.background = `rgba(0,0,0,${op})`;
            GM_setValue('bgOpacity', op);
        });

        function toggleUI() {
            const header = document.getElementById('reader-header');
            const sidebar = document.getElementById('reader-sidebar');
            const body = document.getElementById('reader-body');
            const content = document.getElementById('reader-content');

            if (uiVisible) {
                header.style.display = 'flex';
                body.style.background = `rgba(0,0,0,${saved.bgOpacity})`;
                frame.style.resize = 'both';
                content.classList.remove('hide-scrollbar');
            } else {
                header.style.display = 'none';
                sidebar.style.display = 'none';
                body.style.background = 'transparent';
                frame.style.resize = 'none';
                content.classList.add('hide-scrollbar');
            }
        }

        document.getElementById('toggle-ui').addEventListener('click', () => {
            uiVisible = !uiVisible;
            toggleUI();
        });
        toggleUI();

        let clickCount = 0;
        let lastClickTime = 0;
        const TRIPLE_CLICK_TIMEOUT = 400;
        document.addEventListener('click', e => {
            if (frame.contains(e.target)) return;
            const now = Date.now();
            if (now - lastClickTime > TRIPLE_CLICK_TIMEOUT) clickCount = 0;
            clickCount++;
            lastClickTime = now;
            if (clickCount === 3) {
                frame.style.display = 'none';
                clickCount = 0;
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key.toLowerCase() === 'h') {
                uiVisible = !uiVisible;
                toggleUI();
                return;
            }
            if (e.key.toLowerCase() === 's' && frame.style.display === 'none') {
                frame.style.display = 'block';
                return;
            }
            if (e.key === 'ArrowLeft') displayChapter(currentChapter - 1);
            if (e.key === 'ArrowRight') displayChapter(currentChapter + 1);
            if (e.key.toLowerCase() === 't') {
                sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
            }
        });

        const resizeObserver = new ResizeObserver(() => {
            GM_setValue('width', frame.offsetWidth);
            GM_setValue('height', frame.offsetHeight);
        });
        resizeObserver.observe(frame);
    }

    // 监听 Alt+Shift+X 启动/关闭
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            isActive = !isActive;

            if (isActive) {
                startReader();
            } else {
                const reader = document.getElementById('novel-reader');
                if (reader) reader.remove();
            }
        }
    });
})();