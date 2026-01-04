// ==UserScript==
// @name        百度网盘打开中文字幕（改）
// @namespace   http://tampermonkey.net/
// @version     1.44
// @description 百度网盘自动打开中文字幕
// @author      woshilisisui
// @match       https://pan.baidu.com/pfile/video?path=*
// @icon        https://th.bing.com/th?id=ODLS.039b3eb8-253e-4d80-8727-6e7d039c3891&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/514593/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514593/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%93%E5%BC%80%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict'
    ///* 修改字幕的样式，不喜欢可以删除或修改，red green blue  */
    //GM_addStyle(`
    //.vp-video__subtitle-text.show {
    //    background: rgba(214, 214, 214, 0.5) !important;
    //    color: red !important;
    //}
    //`);
    ///* 修改字幕样式 */

    /* 修改字幕样式菜单设置 */
    // 默认值
    //const defaultConfig = {
    //    bgColor: '#d6d6d6',
    //    opacity: 0.5,
    //    textColor: 'green'
    //};
    const defaultConfig = {
        bgColor: '#030b1a',
        opacity: 0.8,
        textColor: '#fff'
    };

    // 修改字幕样式
    function applyStyle() {
        const bg = GM_getValue('bgColor', defaultConfig.bgColor);
        const opacity = GM_getValue('opacity', defaultConfig.opacity);
        const color = GM_getValue('textColor', defaultConfig.textColor);

        const css = `
        .vp-video__subtitle-text.show {
            background: ${hexToRgba(bg, opacity)} !important;
            color: ${color} !important;
        }`;

        GM_addStyle(css);
    }

    // hex转换为rgba
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function colorNameToHex(color) {
        const temp = document.createElement("div");
        temp.style.color = color;
        document.body.appendChild(temp);
        const computed = getComputedStyle(temp).color; // rgb(r,g,b)
        document.body.removeChild(temp);
        return rgbToHex(computed);
    }

    // rgb 转 hex
    function rgbToHex(rgb) {
        const match = rgb.match(/\d+/g);
        if (!match) return '#000000';
        return "#" + match.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0"+hex : hex;
        }).join('');
    }

    function expandHex(hex) {
        // 如果是 #rgb 格式，扩展成 #rrggbb
        if(/^#[0-9a-fA-F]{3}$/.test(hex)) {
            return '#' + hex[1]+hex[1] + hex[2]+hex[2] + hex[3]+hex[3];
        }
        // 已经是 6 位或其他合法值直接返回
        return hex;
    }

    // 设置菜单
    function openSettings() {
        if (document.querySelector('#subtitle-setting-panel')) {
            document.querySelector('#subtitle-setting-panel').style.display = 'block';
            return;
        }

        const bg = GM_getValue('bgColor', defaultConfig.bgColor);
        const opacity = GM_getValue('opacity', defaultConfig.opacity);
        const color = GM_getValue('textColor', defaultConfig.textColor);

        const wrapper = document.createElement('div');
        wrapper.id = 'subtitle-setting-panel';
        wrapper.innerHTML = `
        <div class="subtitle-setting-modal">
            <h2>🎨 字幕样式设置</h2>

            <div class="row">
                <label for="bgColor">背景颜色</label>
                <input type="color" id="bgColor" value="${bg}">
            </div>

            <div class="row">
                <label for="textColor">字幕颜色</label>
                <input type="color" id="textColor" value="${color}">
            </div>

            <div class="row">
                <label for="opacity">透明度</label>
                <div class="range-box">
                    <input type="range" id="opacity" min="0" max="1" step="0.05" value="${opacity}">
                    <span id="opacityValue">${opacity}</span>
                </div>
            </div>

            <div class="row">
                <label>预设颜色</label>
                <div class="preset-box">
                    <button class="preset" data-color="red" style="background:red"></button>
                    <button class="preset" data-color="green" style="background:green"></button>
                    <button class="preset" data-color="blue" style="background:blue"></button>
                    <button class="preset" data-color="black" style="background:black"></button>
                </div>
            </div>

            <div class="btn-box">
                <button id="reset">重置</button>
                <button id="close">关闭</button>
            </div>
        </div>
        `;

        document.body.appendChild(wrapper);

        GM_addStyle(`
        #subtitle-setting-panel {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 99999;
            font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
        }
        .subtitle-setting-modal {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px 30px;
            border-radius: 14px;
            box-shadow: 0 6px 15px rgba(0,0,0,0.2);
            min-width: 400px;
            animation: fadeIn 0.25s ease;
            text-align: center;
        }
        .subtitle-setting-modal h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 18px;
            color: #333;
        }
        .row {
            display: grid;
            grid-template-columns: 1fr 2fr;
            align-items: center;
            margin: 12px 0;
        }
        .row label {
            display: inline-block;
            width: 60px;            /* 固定列宽，按最长的 label 来设置 */
            text-align: justify;    /* 两端对齐 */
            font-size: 14px;
            color: #444;
            margin-right: 10px;
            margin-left: 70px;
        }

        .row label::after {
            content: "";
            display: inline-block;
            width: 100%;  /* 触发两端对齐 */
        }

        .row input[type="color"],
        .range-box,
        .preset-box {
            justify-self: center; /* 控件居中 */
            inline-size: 129px
        }
        .range-box {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .preset-box {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-top: 6px;
        }
        .preset {
            width: 25px; height: 25px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
        }
        .btn-box {
            text-align: center;
            margin-top: 15px;
        }
        .btn-box button {
            margin: 0 25px;
            padding: 6px 14px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            background: linear-gradient(135deg, #f0f0f0, #ddd);
            transition: all 0.2s ease;
        }
        .btn-box button:hover {
            background: linear-gradient(135deg, #ddd, #bbb);
        }
        @keyframes fadeIn {
            from {opacity: 0; transform: translate(-50%, -40%);}
            to {opacity: 1; transform: translate(-50%, -50%);}
        }
        `);

        // 实时预览
        wrapper.querySelector('#bgColor').addEventListener('input', (e) => {
            GM_setValue('bgColor', e.target.value);
            applyStyle();
        });
        wrapper.querySelector('#textColor').addEventListener('input', (e) => {
            GM_setValue('textColor', e.target.value);
            applyStyle();
        });
        wrapper.querySelector('#opacity').addEventListener('input', (e) => {
            wrapper.querySelector('#opacityValue').textContent = e.target.value;
            GM_setValue('opacity', parseFloat(e.target.value));
            applyStyle();
        });

        wrapper.querySelector('#reset').addEventListener('click', () => {
            GM_setValue('bgColor', defaultConfig.bgColor);
            GM_setValue('textColor', defaultConfig.textColor);
            GM_setValue('opacity', defaultConfig.opacity);
            applyStyle();

            // 更新控件
            const bgInput = wrapper.querySelector('#bgColor');
            const textInput = wrapper.querySelector('#textColor');
            const opacityInput = wrapper.querySelector('#opacity');
            const opacityValue = wrapper.querySelector('#opacityValue');

            if (bgInput) bgInput.value = expandHex(defaultConfig.bgColor);
            if (textInput) {
                textInput.value = expandHex(defaultConfig.textColor);
                textInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (opacityInput) {
                opacityInput.value = defaultConfig.opacity;
                opacityValue.textContent = defaultConfig.opacity;
                opacityInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        wrapper.querySelector('#close').addEventListener('click', () => {
            wrapper.style.display = 'none';
        });

        // 点击预设颜色
        wrapper.querySelectorAll('.preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;// red / green / blue / black
                GM_setValue('textColor', color);
                applyStyle();

                // 更新取色控件为正确 HEX
                const colorInput = wrapper.querySelector('#textColor');
                if (colorInput) {
                    colorInput.value = colorNameToHex(color);

                    // 触发 input 事件让实时预览生效
                    colorInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        });
    }

    GM_registerMenuCommand("字幕样式设置", openSettings);
    applyStyle();
    /* 修改字幕样式菜单设置 */


    // 修改播放区域控件动画效果
    // 隐藏大播放按钮
    GM_addStyle(`
        .vjs-big-play-button { display: none !important; }
    `);

    // 控制条样式
    GM_addStyle(`
        .auto-hide-controlbar {
            opacity: 0 !important;
            pointer-events: none !important; /* 禁止点击 */
            transition: opacity 0.3s;
        }
        .auto-hide-controlbar.show {
            opacity: 1 !important;
            pointer-events: auto !important; /* 显示时可点击 */
        }
    `);

    const controlSelectors = [
        '.video-js .vjs-control-bar',
        '.vp-video .vp-video__control-bar',
        '.vp-file-video-container__tools',
        '.vp-video .vp-video__control-bar--play-time-current',
        '.vp-video .vp-video__control-bar--play-time-all'
    ];

    // 动态等待控制条加载
    function waitForElements(selectors, callback, interval = 500, maxAttempts = 40) {
        let attempts = 0;
        const timer = setInterval(() => {
            const elements = selectors.map(sel => document.querySelector(sel));
            if (elements.every(el => el)) {
                clearInterval(timer);
                callback(elements);
            } else if (++attempts >= maxAttempts) {
                clearInterval(timer);
                console.warn('控制条元素未找到');
            }
        }, interval);
    }

    waitForElements(controlSelectors, (elements) => {
        console.log('控制条加载完成', elements);
        elements.forEach(el => el.classList.add('auto-hide-controlbar'));

        let hideTimer = null;
        const player = document.querySelector('.vp-video, .video-js');

        if (player) {
            player.addEventListener('mousemove', () => {
                // 鼠标移动 → 显示控制条
                elements.forEach(el => el.classList.add('show'));

                // 清理之前定时器
                clearTimeout(hideTimer);

                // 鼠标不动 1 秒后隐藏
                hideTimer = setTimeout(() => {
                    elements.forEach(el => el.classList.remove('show'));
                }, 1000);
            });

            // 鼠标移出播放器区域 → 立即隐藏
            player.addEventListener('mouseleave', () => {
                clearTimeout(hideTimer);
                elements.forEach(el => el.classList.remove('show'));
            });
        }
    });

    //
    const w = unsafeWindow;

    let interval
    // 等待页面完全加载完毕后执行脚本
    window.onload = function() {

        let lastUrl = '' // 存储上一个 URL
        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;

            // 检查 URL 是否发生变化
            if (currentUrl !== lastUrl) {
                console.log('URL发生变化');
                lastUrl = currentUrl; // 更新上一个 URL
                //controlBDisplay();
                //controlB();
                setTimeout(() => {
                    simulateMouseHoverToButton();
                }, 0);

                clearInterval(interval); // 停止当前轮询
                // URL 变化后稍微延迟一段时间再检测，确保 DOM 完全更新
                setTimeout(() => {
                    waitForSubtitleButton();
                    checkAddDownloadButton();
                }, 0);
            }
        });
        // 开始观察 DOM 变化，监听整个页面的变化
        observer.observe(document.body, { childList: true, subtree: true });

        function waitForSubtitleButton() {
            const maxAttempts = 100; // 设置最大尝试次数
            let attempts = 0;
            interval = setInterval(function () {
                attempts++;
                if (attempts >= maxAttempts) {
                    console.log('尝试次数过多，停止轮询');
                    console.log('不存在中文字幕');
                    clearInterval(interval);
                    return
                }

                simulateMouseHoverToButton();

                // 获取所有符合条件的元素
                const subtitleElements = document.querySelectorAll('li.vp-video__control-bar--video-subtitles-select-item');
                console.log(subtitleElements)

                if (subtitleElements && subtitleElements.length > 0) {
                    // 遍历所有符合条件的元素
                    subtitleElements.forEach(element => {
                        console.log(element.textContent);
                        // 检查元素的文本内容是否为“中文字幕”
                        if (element.textContent.trim() === '中文字幕') {
                            clearInterval(interval); // 停止检测
                            console.log('检测到中文字幕，进行点击...');
                            element.click(); // 模拟点击操作
                        }
                    });
                }

            }, 2000);
        }

        function simulateMouseHoverToButton() {
            // 获取需要悬停的按钮
            const buttonElement = document.querySelector('.vp-video__control-bar--button.is-text');
            console.log(buttonElement);

            if (buttonElement) {
                // 创建一个鼠标事件
                const mouseOverEvent = new MouseEvent('mouseenter', {
                    view: w,
                    bubbles: true,
                    cancelable: true
                });

                // 触发鼠标悬停事件
                buttonElement.dispatchEvent(mouseOverEvent);
                console.log('鼠标悬停到按钮上');

                setTimeout(() => {

                    // 创建一个鼠标移开事件
                    const mouseLeaveEvent = new MouseEvent('mouseleave', {
                        view: w,
                        bubbles: true,
                        cancelable: true
                    });

                    // 触发鼠标移开事件
                    buttonElement.dispatchEvent(mouseLeaveEvent);
                    console.log('鼠标移开按钮');
                }, 500);
            } else {
                console.log('未找到需要悬停的按钮');
            }
        }



        // 下载字幕
        function clearResources() {
            performance.clearResourceTimings();
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function retryOperation(operation, maxRetries = 3, delay = 1000) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await operation();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    console.log(`尝试失败,${maxRetries - i - 1}次重试后重新尝试`);
                    await sleep(delay);
                }
            }
        }

        async function findSubtitleUrl() {
            const resources = performance.getEntriesByType("resource");
            let matchedUrls = resources.filter(resource => resource.name.includes('netdisk-subtitle'));

            if (matchedUrls.length > 0) {
                let url = matchedUrls[matchedUrls.length - 1].name;
                console.log('找到匹配的URL:', url);
                return url;
            } else {
                throw new Error('未找到匹配的URL');
            }
        }

        async function downloadSubtitle() {
            let button = document.querySelector('li.vp-video__control-bar--video-subtitles-select-item.is-checked');
            clearResources(); // 清理资源
            if (button.classList.contains('is-normal')) {
                button = document.querySelector('ul.vp-video__control-bar--video-subtitles-select-group.is-large li:nth-child(2)');
            }
            button.click();
            await sleep(500);

            try {
                // 获取字幕名称
                const subtitleurl = await retryOperation(findSubtitleUrl);
                // const regex = /fn=(.*)\.mp4/;
                // let fileName = decodeURIComponent(url.match(regex)[1]).replace('+', ' ') + '.srt';

                // 获取视频名称
                const url = window.location.href;
                const params = new URLSearchParams(url.split('?')[1]);
                const path = params.get('path'); // /公务员/.../赠送：课后作业 4.mp4
                const fileName = path.match(/([^/]+)(?=\.[^.]+$)/)[0] + '.srt';
                console.log(fileName);

                let ttt = 0;

                const download = GM_download({
                    url: subtitleurl,
                    name: fileName,
                    saveAs: true,
                    onerror: function (error) {
                        //如果下载最终出现错误，则要执行的回调
                        console.log(error)
                    },
                    ontimeout: () => {
                        //如果此下载由于超时而失败，则要执行的回调
                        console.log('下载超时')
                    },
                    onload: () => {
                        //如果此下载完成，则要执行的回调
                        console.log('下载成功')
                    }
                });
                download;

                //// 使用 Fetch 获取字幕文件内容
                //const response = await fetch(subtitleurl);
                //if (!response.ok) throw new Error('获取字幕文件失败');
//
                //const subtitleText = await response.text();
//
                //// 创建一个 Blob 对象用于下载
                //const blob = new Blob([subtitleText], { type: 'text/plain' });
                //const link = document.createElement('a');
                //link.href = URL.createObjectURL(blob);
                //link.download = fileName;
//
                //// 自动点击下载链接
                //link.click();
            } catch (error) {
                console.error('下载失败:', error);
            }
        }


        // 深色模式切换后重新添加下载字幕按钮
        function colorButtonBind() {
            // console.log('1111111111')
            const colorButton = document.querySelector('div.vp-toolsbar__more-group > button:nth-child(1)')
            // console.log('2222222222'+colorButton)
            colorButton.addEventListener('click', addDownloadButton);
            // console.log('3333333333'+colorButton)
        }



        function addDownloadButton() {

            //const controlBar = document.querySelector("#vjs_video_594 > section > div.vp-video__control-bar--setup > div:nth-child(1) > div > div.vp-inner-vontainer > div > div.vp-video__control-bar--video-subtitles > div > ul");
            const controlBar = document.querySelector('.vp-video-player .vp-video__control-bar .vp-video__control-bar--video-subtitles .vp-video__control-bar--video-subtitles-select .vp-video__control-bar--video-subtitles-select-group')
            // console.log(controlBar)
            if (controlBar) {
                // let downloadButton = controlBar.querySelector('button.download-subtitle');
                const controlBox = document.querySelector('div.vp-toolsbar__tools')
                let downloadButton = controlBox.querySelector('button.download-subtitle');
                // 获取第三个子节点

                if (!downloadButton) {
                    console.log('创建字幕下载按钮！');
                    // 如果按钮不存在，则创建一个新的按钮
                    downloadButton = document.createElement('button');
                    downloadButton.type = 'button'
                    downloadButton.className = 'vp-btn normal is-round vp-toolsbar__tools-btn download-subtitle'; // 添加类名方便识别
                    // downloadButton.textContent = '下载字幕';
                    downloadButton.title = '下载字幕';

                    const i = document.createElement('i');
                    i.className = 'u-icon-download-bold'

                    const span = document.createElement('span');
                    span.textContent = '字幕'


                    const thirdChild = controlBox.children[2];
                    if (thirdChild) {
                        // 在第三个子节点前插入新元素
                        controlBox.insertBefore(downloadButton, thirdChild);
                    } else {
                        // 如果没有第三个子节点，直接添加到末尾
                        controlBox.appendChild(downloadButton);
                    }
                    downloadButton.appendChild(i)
                    downloadButton.appendChild(span)
                    // controlBox.appendChild(downloadButton);
                    console.log('创建成功！');
                }
                // console.log(downloadButton)

                // 更新按钮的点击事件
                downloadButton.removeEventListener('click', downloadSubtitle); // 移除旧的事件处理器
                downloadButton.addEventListener('click', downloadSubtitle); // 添加新的事件处理器
                // 重新绑定
                colorButtonBind()

                return true;
            }
            return false;
        }

        function checkAddDownloadButton() {
            const checkFunction = setInterval(() => {
                if (addDownloadButton()) {
                    console.log("检测到下载按钮，停止轮询");
                    clearInterval(checkFunction); // 停止轮询
                }
            }, 500); // 每 500ms 检查一次
        }
    }
})();