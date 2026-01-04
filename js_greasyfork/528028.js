// ==UserScript==
// @name         nodejsAnywhereBetterPage
// @namespace    http://leizingyiu.net/
// @version      20250305
// @description  Convert nodejs_anywhere file directory into thumbnail view with image/video preview, fullscreen viewer, and keyboard navigation.
// @author       leizingyiu
// @match        http://*.*:8000/*
// @match        https://*.*:8001/*
// @license     GNU AGPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528028/nodejsAnywhereBetterPage.user.js
// @updateURL https://update.greasyfork.org/scripts/528028/nodejsAnywhereBetterPage.meta.js
// ==/UserScript==

const originHtml = document.getElementsByTagName('html')[0].outerHTML;

function globalKeyDown(event) {
    console.log(event);
    if (event.ctrlKey && event.altKey && event.code === 'KeyS') {

        const content = originHtml.replace('</html>', '') + `<script>(${String(nodejsAnywhereBetterPage)})()</script><\/html>`;
        downloadThisHTML(content);

    }
}

function downloadThisHTML(content) {
    const blob = new Blob([content], { type: 'text/html' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';

    link.click();

    URL.revokeObjectURL(link.href);
}


function nodejsAnywhereBetterPage() {
    if (document.body.hasAttribute('yiu_nodejsAnywhereBetterPage')) {
        return;
    }
    'use strict';
    let currentIndex = 0;
    let fileList = [];

    function isTargetPage() {
        const urlPath = window.location.pathname.toLowerCase();
        const isAnyWhereFileView = document.querySelector('#files') !== null;
        return isAnyWhereFileView;
    }

    function setupLazyGifLoading() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const gifSrc = img.dataset.gifSrc;

                    if (gifSrc) {
                        img.src = gifSrc;
                        img.classList.remove('gif-lazy');
                        img.classList.add('gif-loaded');
                        observer.unobserve(img);
                    }
                } else {
                    const img = entry.target;
                    if (img.classList.contains('gif-loaded')) {
                        img.src = '';
                        img.classList.remove('gif-loaded');
                        img.classList.add('gif-lazy');
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.01
        });

        return observer;
    }

    function createThumbnailView() {
        const fileListElements = Array.from(document.querySelectorAll('#files li a'));
        fileList = fileListElements.map(file => ({
            url: file.href,
            name: file.querySelector('.name').textContent
        }));

        const container = document.createElement('div');
        container.classList.add('thumbnail-container');

        const lazyLoadObserver = setupLazyGifLoading();

        fileList.forEach((file, index) => {
            const { url, name } = file;

            const wrapper = document.createElement('div');
            wrapper.classList.add('thumbnail-wrapper');

            let hintTxt = '双击预览'
            if (url.match(/\.(png|jpe?g|gif|webp)$/i)) {
                const img = document.createElement('img');
                img.alt = name;
                img.setAttribute('draggable', 'false');

                if (url.match(/\.gif$/i)) {
                    img.classList.add('gif-lazy');
                    img.dataset.gifSrc = url;
                    const gifLabel = document.createElement('div');
                    gifLabel.textContent = 'GIF';
                    gifLabel.classList.add('gif-label');
                    wrapper.appendChild(gifLabel);
                } else {
                    img.src = url;
                }

                wrapper.appendChild(img);
                wrapper.addEventListener('dblclick', () => openFullscreen(index));

                if (url.match(/\.gif$/i)) {
                    lazyLoadObserver.observe(img);
                }

            } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
                const video = document.createElement('video');
                video.src = url;
                video.classList.add('video');
                video.muted = true;
                video.playsInline = true;
                video.preload = 'metadata';
                video.onloadedmetadata = () => video.currentTime = 0.1;
                wrapper.appendChild(video);

                wrapper.addEventListener('dblclick', () => openFullscreen(index));

            } else {

                hintTxt = '双击打开/下载';

                wrapper.addEventListener('dblclick', () => {
                    window.location.href = url;
                });


            }
            const downloadTip = document.createElement('div');
            downloadTip.classList.add('downloadTip');
            downloadTip.textContent = hintTxt;
            downloadTip.classList.add('download_tip');

            wrapper.appendChild(downloadTip);


            const caption = document.createElement('div');
            caption.textContent = name;
            caption.classList.add('thumbnail-caption');
            wrapper.appendChild(caption);

            container.appendChild(wrapper);
        });

        document.body.innerHTML = '';
        document.body.appendChild(container);
    }

    // 打开全屏预览
    function openFullscreen(index) {
        currentIndex = index;

        const overlay = document.createElement('div');
        overlay.classList.add('fullscreen-overlay');

        const content = document.createElement(fileList[currentIndex].url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'img');
        content.src = fileList[currentIndex].url;
        content.classList.add('fullscreen-content');
        content.setAttribute('draggable', 'false');
        if (content.tagName === 'VIDEO') {
            content.controls = true;
            content.autoplay = true;
        }


        let backgroundBrightness = 255;
        let accumulatedDelta = 0;
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.target === overlay) {
                accumulatedDelta += e.deltaY * 0.02;
                backgroundBrightness = Math.floor(
                    127.5 + 127.5 * Math.sin(accumulatedDelta * 0.1)
                );

                overlay.style.backgroundColor = `rgba(${backgroundBrightness}, ${backgroundBrightness}, ${backgroundBrightness}, 1)`;
            }
        });
        overlay.appendChild(content);


        const fileNameP = document.createElement('p');
        let _fileName = fileList[currentIndex].url.split('/');
        fileNameP.classList.add('fileNameP');
        fileNameP.textContent = decodeURIComponent(_fileName[_fileName.length - 1]);
        overlay.appendChild(fileNameP);


        const closeButton = document.createElement('div');
        closeButton.textContent = '×';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => overlay.remove());
        overlay.appendChild(closeButton);



        const downloadBtn = document.createElement('div');
        downloadBtn.textContent = '⬇️';
        downloadBtn.classList.add('download-button');
        overlay.appendChild(downloadBtn);

        // 绑定点击事件
        downloadBtn.addEventListener('click', function () {
            // 指定要下载的文件链接
            const fileUrl = fileList[currentIndex].url; // 替换为实际文件链接
            let pathGroup = fileUrl.split('/');
            const fileName = decodeURIComponent(pathGroup[pathGroup.length - 1]); // 下载后的文件名

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName; // 设置下载的文件名
            a.style.display = 'none'; // 隐藏 <a> 标签

            // 将 <a> 标签添加到文档中
            document.body.appendChild(a);

            // 触发点击事件以开始下载
            a.click();

            // 移除 <a> 标签
            document.body.removeChild(a);
        });




        let scale = 1;
        let isDragging = false;
        let startX, startY;

        content.addEventListener('wheel', (e) => {
            e.preventDefault();
            scale += e.deltaY > 0 ? -0.1 : 0.1;
            scale = Math.max(0.1, Math.min(scale, 5));
            content.style.transform = `scale(${scale})`;
        });

        content.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - content.offsetLeft;
            startY = e.clientY - content.offsetTop;
            content.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - startX;
                const y = e.clientY - startY;
                content.style.left = `${x}px`;
                content.style.top = `${y}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            content.style.cursor = 'grab';
        });

        document.body.appendChild(overlay);


        document.addEventListener('keydown', handleKeyDown);

        overlay.addEventListener('remove', () => {
            document.removeEventListener('keydown', handleKeyDown);
        });

        overlay.addEventListener('dblclick', () => {
            const overlay = document.querySelector('.fullscreen-overlay');
            if (overlay) {
                overlay.remove();
            }
        })
    }



    // 防抖函数
    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer); // 清除之前的定时器
            timer = setTimeout(() => func.apply(this, args), delay); // 设置新的定时器
        };
    }

    function toggleBodyClass(cls, t) {
        const body = document.body;
        body.classList.add(cls);
        setTimeout(() => {
            body.classList.remove(cls);
        }, t);
    }

    // 使用防抖包装 toggleBodyClass 函数
    const debouncedToggleBodyClass = debounce(() => { toggleBodyClass('hiliArrow', 3000) }, 500);











    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function addBodyClass(cls) {
        const body = document.body;
        if (!body.classList.contains(cls)) {
            body.classList.add(cls);
        }
    }

    function removeBodyClass(cls) {
        const body = document.body;
        body.classList.remove(cls);
    }

    function createDebouncedRemoveBodyClass(cls, delay) {
        return debounce(() => removeBodyClass(cls), delay);
    }











    function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            showPrevious();
            const className = 'hiliArrowLeft';
            addBodyClass(className);
            const debouncedRemoveBodyClass = createDebouncedRemoveBodyClass(className, 500);
            debouncedRemoveBodyClass();
        } else if (event.key === 'ArrowRight') {
            showNext();
            const className = 'hiliArrowRight';
            addBodyClass(className);
            const debouncedRemoveBodyClass = createDebouncedRemoveBodyClass(className, 500);
            debouncedRemoveBodyClass();
        } else if (event.key === 'Escape' || event.keyCode === 27) { // 检测 Esc 键
            const overlay = document.querySelector('.fullscreen-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }




    document.addEventListener('keydown', typeof globalKeyDown != 'undefined' ? globalKeyDown : () => { });

    // 显示上一张
    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateFullscreenContent();
        }
    }

    // 显示下一张
    function showNext() {
        if (currentIndex < fileList.length - 1) {
            currentIndex++;
            updateFullscreenContent();
        }
    }

    // 更新全屏内容
    function updateFullscreenContent() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (!overlay) return;

        const content = overlay.querySelector('.fullscreen-content');
        const newUrl = fileList[currentIndex].url;

        if (content.tagName === 'VIDEO' && !newUrl.match(/\.(mp4|webm|ogg)$/i)) {
            // 如果当前是视频但新内容是图片，则替换为图片
            const img = document.createElement('img');
            img.src = newUrl;
            img.classList.add('fullscreen-content');
            img.setAttribute('draggable', 'false');
            overlay.replaceChild(img, content);
        } else if (content.tagName === 'IMG' && newUrl.match(/\.(mp4|webm|ogg)$/i)) {
            // 如果当前是图片但新内容是视频，则替换为视频
            const video = document.createElement('video');
            video.src = newUrl;
            video.classList.add('fullscreen-content');
            video.controls = true;
            video.autoplay = true;
            overlay.replaceChild(video, content);
        } else {
            // 同类型内容更新
            content.src = newUrl;
        }

        let _fileName = newUrl.split('/');
        const fileNameP = overlay.querySelector('.fileNameP');
        fileNameP.textContent = decodeURIComponent(_fileName[_fileName.length - 1])
    }

    // 样式化
    function styling() {
        const styleTag = document.createElement('style');
        styleTag.textContent = `
        .thumbnail-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            padding: 10px;
        }
        .thumbnail-wrapper {
            position: relative;
            overflow: hidden;
            border: 1px solid #ddd;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
            max-height: 40vh;
            overflow-y: scroll;
            padding: 0 !important;
            margin: 0 !important;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .thumbnail-wrapper img,
        .thumbnail-wrapper video {
            width: 100%;
            height: auto;
            flex-grow: 1;
            object-fit: contain;
        }
        .gif-label {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            font-size: 12px;
            padding: 2px 5px;
            border-radius: 3px;
        }
        .thumbnail-caption {
            font-size: 12px;
            padding: 5px;
            position: sticky;
            bottom: 0;
            width: 96%;
            overflow: hidden;
            word-break: break-all;
            background: #ffffffaa;
        }
        .fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999999;
        }

.fullscreen-overlay:after {
    content: '>';
    right: 2em;
}

.fullscreen-overlay:before {
    content: "<";
    left: 2em;
}
.fullscreen-overlay:before, .fullscreen-overlay:after {
    position: absolute;
    top: 50%;
    opacity: 0.2;
    transform: translate(0, -50%);
    font-size: 2em;
    transition:opacity 0.3s ease;
}

.hiliArrowLeft .fullscreen-overlay:before,
.hiliArrowRight .fullscreen-overlay:after {
    opacity: 1;
}


        .fullscreen-content {
            max-width: 90%;
            max-height: 90%;
            position: absolute;
            user-select: none;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
            mix-blend-mode: difference;
            user-select: none;
        }

          .download-button {
            position: absolute;
            bottom: 10px;
            right: 20px;
            font-size: 30px;
            color: #fff;
            cursor: pointer;
            user-select: none;
        }


        .fullscreen-content.video {
            pointer-events: none;
        }
        .gif-lazy {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .gif-loaded {
            opacity: 1;
        }

.download_tip{
font-size:1.5em;
opacity:0;

transition: opacity 0.2s ease;
    position: absolute;
    width: 100%;
    text-align-last: center;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 9999;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

        background: #ffffff99;
    backdrop-filter: blur(1px);

}
.download_tip:hover{
opacity:1;
}


.fileNameP{
position:absolute;
bottom:2em;
left:50%;
transform:translate(-50%,0);
mix-blend-mode: difference;
user-select: none;
}

        /* 针对 Webkit 内核浏览器（如 Chrome、Edge、Safari） */
::-webkit-scrollbar {
    width: 4px; /* 水平滚动条的高度 */
    height: 4px; /* 垂直滚动条的宽度 */
}

::-webkit-scrollbar-track {
    background: transparent; /* 滚动条轨道背景 */
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 滚动条滑块颜色 */
    border-radius: 2px; /* 滚动条滑块圆角 */
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 滑块悬停时的颜色 */
}

/* 针对 Firefox 浏览器 */
* {
    scrollbar-width: thin; /* 设置滚动条为细 */
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent; /* 滑块颜色和轨道颜色 */
}


        `;
        document.head.appendChild(styleTag);
    }

    // 主逻辑
    if (!isTargetPage()) {
        console.log('Not a target page, exiting...');
        return;
    } else {
        styling();
        createThumbnailView();
    }

    document.body.setAttribute('yiu_nodejsAnywhereBetterPage', true);
}

window.onload = () => {
    nodejsAnywhereBetterPage();
};

nodejsAnywhereBetterPage();