// ==UserScript==
// @name         外挂弹幕插件
// @version      0.3.0
// @description  为任意网页播放器提供了加载本地弹幕的功能
// @author       DeltaFlyer
// @copyright    2023, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        https://pan.baidu.com/pfile/video*
// @match        https://www.alipan.com/drive/file/backup*
// @match        https://g.alicdn.com/*
// @match        https://www.tucao.cam/play/*
// @match        https://ani.v300.eu.org/*
// @match        *://*/m3u8.php*
// @match        https://aniopen.an-i.workers.dev/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://avatars.githubusercontent.com/u/1879224?v=4
// @require      https://cdn.jsdelivr.net/npm/@xpadev-net/niconicomments@0.2.73/dist/bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/danmaku@2.0.7/dist/danmaku.min.js
// @namespace    https://greasyfork.org/users/927887
// @downloadURL https://update.greasyfork.org/scripts/473735/%E5%A4%96%E6%8C%82%E5%BC%B9%E5%B9%95%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473735/%E5%A4%96%E6%8C%82%E5%BC%B9%E5%B9%95%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(async function main() {
    async function waitForDOMContentLoaded() {
        return new Promise((resolve) => {
            console.log(document.readyState)
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async function waitMessage(handler, timeoutMs) {
        return new Promise((resolve, reject) => {
            let timeoutId;

            function handleMessage(event) {
                if (handler(event.data)) {
                    // Remove the message event listener
                    window.removeEventListener('message', handleMessage);

                    // Clear the timeout
                    clearTimeout(timeoutId);

                    // Resolve the promise
                    resolve(event.data);
                }
            }

            // Add a message event listener
            window.addEventListener('message', handleMessage);

            // Set a timeout to reject the promise if the timeout is reached
            timeoutId = setTimeout(() => {
                window.removeEventListener('message', handleMessage);
                reject(new Error('Timeout reached'));
            }, timeoutMs);
        });
    }

    async function sleep(time) {
        await new Promise((resolve) => setTimeout(resolve, time));
    }

    await waitForDOMContentLoaded()
    let danmakuPlayer
    let toastText = (function () {
        let html = `
<style>
.df-bubble-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    display: block !important;
}

.df-bubble {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    max-width: 300px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    display: block !important;
}

.df-show-bubble {
    opacity: 1;
}
</style>
<div class="df-bubble-container" id="bubbleContainer"></div>`
        document.body.insertAdjacentHTML("beforeend", html)
        let bubbleContainer = document.querySelector('.df-bubble-container')

        function createToast(text) {
            if (!document.getElementById(bubbleContainer.id)) {
                document.body.insertAdjacentHTML("beforeend", html)
                bubbleContainer = document.querySelector('.df-bubble-container')
            }
            console.log('toast', text)
            const bubble = document.createElement('div');
            bubble.classList.add('df-bubble');
            bubble.textContent = text;

            bubbleContainer.appendChild(bubble);
            setTimeout(() => {
                bubble.classList.add('df-show-bubble');
                setTimeout(() => {
                    bubble.classList.remove('df-show-bubble');
                    setTimeout(() => {
                        bubbleContainer.removeChild(bubble);
                    }, 500); // Remove the bubble after fade out
                }, 3000); // Show bubble for 3 seconds
            }, 100); // Delay before showing the bubble
        }

        return createToast
    })();
    let loadDanmaku = (function () {
        let [loadNicoCommentArt, clearNicoComment] = (function loadNicoCommentArt() {
            function buildCanvas() {
                // Get a reference to the existing element in the document
                let html = `
<style>
  #nico-canvas,
  #nico-container
   {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 999;
  }
</style>
<div id="nico-container">
<canvas id="nico-canvas" width="1920" height="1080""></canvas>
</div>
`
                videoElem.parentElement.insertAdjacentHTML('beforeend', html);
                return videoElem.parentElement.querySelector("#nico-canvas")
            }

            let niconiComments
            let canvasElem
            let interval

            return [async function (comments) {
                if (!niconiComments) {
                    canvasElem = buildCanvas()
                    console.log('buildNicoCanvas', canvasElem)
                    niconiComments = new NiconiComments(canvasElem, [], {
                        mode: 'default',
                        keepCA: true,
                    });
                    interval = setInterval(() => {
                        niconiComments.drawCanvas(Math.floor(videoElem.currentTime * 100))
                    }, 10);
                }
                niconiComments.addComments(...comments)
                console.log('addCommentArt', niconiComments, comments)
            }, function () {
                if (canvasElem) {
                    canvasElem.parentElement.removeChild(canvasElem)
                    clearInterval(interval)
                    niconiComments = undefined
                    interval = undefined
                    canvasElem = undefined
                }
            }];
        })();


        function xmlunEscape(content) {
            return content.replace('；', ';')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
        }

        function findAll(inputString, regex) {
            const matches = [];
            let match;

            while ((match = regex.exec(inputString)) !== null) {
                matches.push(match);
            }
            return matches;
        }

        function xml2danmu(sdanmu) {
            const extraArgRegex = /(\S+?)\s*=\s*"(.*?)"/g
            let ldanmu = findAll(sdanmu, /<d p="(.*?)"(.*?)>(.*?)<\/d>/g);
            for (let i = 0; i < ldanmu.length; i++) {
                let danmu = ldanmu[i]
                let argv = danmu[1].split(',')
                let result = {
                    color: Number(argv[3]),
                    content: xmlunEscape(danmu[3]),
                    ctime: Number(argv[4]),
                    fontsize: Number(argv[2]),
                    id: Number(argv[7]),
                    idStr: argv[7],
                    midHash: argv[6],
                    mode: Number(argv[1]),
                    progress: Math.round(Number(argv[0]) * 1000),
                    weight: 8
                }
                if (danmu[2].length !== 0) {
                    for (let extraArg of findAll(danmu[2], extraArgRegex)) {
                        result[extraArg[1]] = xmlunEscape(extraArg[2])
                    }
                }
                ldanmu[i] = result
            }
            return ldanmu
        }

        let isCommentArt = (function () {
            let caCommands = ['full', 'patissier', 'ender', 'mincho', 'gothic', 'migi', 'hidari', 'shita']
            let caCharRegex = new RegExp(' ◥█◤■◯△×\u05C1\u0E3A\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u200B\u200C\u200D\u200E\u200F\u3000\u3164\u2580\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588\u2589\u258A\u258B\u258C\u258D\u258E\u258F\u2590\u2591\u2592\u2593\u2594\u2595\u2596\u2597\u2598\u2599\u259A\u259B\u259C\u259D\u259E\u259F\u25E2\u25E3\u25E4\u25E5'.split('').join('|'))

            return function (danmu) {
                let command = danmu.mail
                let content = danmu.content
                let isCommentArt = content.split("\n").length > 2;
                if (caCharRegex.exec(content)) {
                    isCommentArt = true
                }
                let lcommand = command.split(' ')
                for (let command of lcommand) {
                    switch (command) {
                        case  'owner': {
                            isCommentArt = true
                            danmu.owner = true
                            break
                        }
                        case caCommands.includes(command): {
                            isCommentArt = true
                            break
                        }
                        case command[0] === "@": {
                            isCommentArt = true
                            break
                        }
                    }
                }
                if (isCommentArt) {
                    return {
                        vpos: Math.round(danmu.progress / 10),
                        date: danmu.time,
                        content: danmu.content,
                        mail: danmu.mail.split(' ')
                    }
                }
            }
        })();

        function intToHexColor(colorInt) {
            const red = (colorInt >> 16) & 0xFF;
            const green = (colorInt >> 8) & 0xFF;
            const blue = colorInt & 0xFF;

            const hex = ((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1);

            return `#${hex}`;
        }

        async function loadDanmaku(text) {
            let ldanmu = xml2danmu(text)
            console.log(ldanmu)
            toastText(`从文件中读取到${ldanmu.length}条弹幕`)
            let modeDict = {
                1: 'rtl',
                4: 'bottom',
                5: 'top'
            }
            let nicoCommentList = []
            let biliDanmakuList = []
            let hashSet = new Set()
            for (let danmu of ldanmu) {
                if (danmu.mail) {
                    let art = isCommentArt(danmu)
                    if (art) {
                        nicoCommentList.push(art)
                        continue
                    }
                }
                let hash = danmu.content + danmu.progress
                if (hashSet.has(hash)) {
                    continue
                } else {
                    hashSet.add(hash)
                }
                danmu.fontsize = 25
                biliDanmakuList.push(
                    {
                        text: danmu.content,
                        time: danmu.progress / 1000,
                        mode: modeDict[danmu.mode],
                        style: {
                            originFontSize: danmu.fontsize,
                            fontSize: danmu.fontsize * currentSetting.scale + 'px',
                            color: intToHexColor(danmu.color),
                            textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
                        }
                    }
                )
            }
            while (!danmakuPlayer) {
                await sleep(500)
            }
            biliDanmakuList.sort((a, b) =>
                b.id - a.id
            )
            for (let danmaku of biliDanmakuList) {
                danmakuPlayer.emit(danmaku)
            }
            if (nicoCommentList.length !== 0) {
                loadNicoCommentArt(nicoCommentList)
            }
        }

        return loadDanmaku
    })();
    let settingPanelOptions = [
        {type: 'slider', id: 'speed', label: "弹幕速度", range: [0.5, 1.5], default: 1},
        {type: 'slider', id: 'scale', label: "字体大小", range: [0.5, 1.5], default: 1},
        {type: 'slider', id: 'opacity', label: '不透明度', range: [0, 1], default: 1},
        {
            type: 'row', children: [
                {
                    'type': 'numberInput', 'id': 'danmakuOffset', label: "弹幕延迟", default: 0,
                },
                {
                    'type': 'textSelector',
                    'id': 'maxHeight',
                    label: "显示区域",
                    optionText: ['25%', '50%', '75%', '100%'],
                    optionValue: ['25%', '50%', '75%', '100%'],
                    default: '100%'
                },
            ]
        }
    ]
    let currentSetting = getLocalSetting("danmakuSetting")
    setDefaultValue(currentSetting, settingPanelOptions)

    function getLocalSetting(key) {
        let value = GM_getValue(key)
        console.log('get', key, value)
        if (value) {

            return value
        } else {
            return {}
        }
    }

    function setDefaultValue(currentSetting, settingPanelOptions) {
        for (let option of settingPanelOptions) {
            if (option.id) {
                if (!currentSetting[option.id]) {
                    currentSetting[option.id] = option.default
                }
            } else if (option.children) {
                for (let child of option.children) {
                    if (child.id) {
                        if (!currentSetting[child.id]) {
                            currentSetting[child.id] = child.default
                        }
                    }
                }
            }
        }
    }

    function saveLocalSetting(key, value) {
        console.log('save', key, value)
        GM_setValue(key, value)
    }


    let currentOffset = 0

    function updateDanmakuOffset(value) {
        for (let comment of danmakuPlayer.comments) {
            comment.time = comment.time - currentOffset + value
        }
        danmakuPlayer.clear()
        currentOffset = value
        let message
        if (currentOffset < 0) {
            message = `弹幕提前${-currentOffset}秒出现`
        } else if (currentOffset > 0) {
            message = `弹幕延迟${currentOffset}秒出现`
        } else {
            message = '重置弹幕时间'
        }
        toastText(message)
    }


    let showSettingPanel = (function (settingPanelOptions, changeHandle) {
        let panelStyles = `
        <style>
        
        

        #panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 999999;
        }
        
        .slider-label{
            width: 12ch;
        }

        
    
        .apply-button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #555;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 10px;
            margin-left: auto;
        }

        .row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .slider {
            flex: 1;
        }

        .slider-value {
            margin-left: 10px;
            font-size: 14px;
            color: #bbb;
            width: 4ch;
        }

        .selector {
            flex: 1;
            margin-right: 10px;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
        }

        .number-input {
            width: 6ch;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-right: 10px;
            margin-left: 5px;
        }

        .text-selector {
            width: 10ch;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-left: 5px;
        }

        .equal-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .checkbox-group {
            flex: 1;
            display: flex;
            justify-content: center;
        }
    </style>
`

        // Create the setting panel HTML string based on the provided options
        function createPanelHTML(options) {
            let html = '<div id="panel" style="display: none;">'
            options.forEach(option => {
                if (option.type === 'slider') {
                    html += `<div class="row">
                <label class="slider-label" for="${option.id}">${option.label}:</label>
                <input type="range" class="slider" id="${option.id}" min="${option.range[0]}" max="${option.range[1]}" step="0.01" value="${currentSetting[option.id] || option.default}">
                <span class="slider-value" id="${option.id}Value">${currentSetting[option.id] || option.default}</span>
            </div>`;
                } else if (option.type === 'equal-row' || option.type === 'row') {
                    html += `<div class="${option.type}">`;
                    option.children.forEach(child => {
                        // Handle checkboxes
                        if (child.type === 'checkbox') {
                            const checked = currentSetting[child.id] !== undefined ? currentSetting[child.id] : child.default;
                            html += `<div class="checkbox-group">
                                    <label for="${child.id}">${child.label}:</label>
                                    <input type="checkbox" id="${child.id}" ${checked ? 'checked' : ''}>
                                    </div>`;
                        }
                        // Handle number input
                        else if (child.type === 'numberInput') {
                            html += `<label for="${child.id}">${child.label}:</label>
                                    <input type="number" class="number-input" id="${child.id}" value="${currentSetting[child.id] || child.default}">
                                    `;
                        }
                        // Handle text selector
                        else if (child.type === 'textSelector') {
                            let currentValue = currentSetting[child.id] || child.default
                            html += `<label for="${child.id}">${child.label}:</label>
                                    <select class="selector text-selector" id="${child.id}">`;
                            child.optionText.forEach((text, index) => {
                                const value = child.optionValue[index];
                                const selected = currentValue === value ? 'selected' : '';
                                html += `<option value="${value}" ${selected}>${text}</option>`;
                            });
                            html += `</select>`;
                        }
                    });
                    html += `</div>`;
                }
            });
            html += '<button class="apply-button" id="applyButton">应用</button></div>';
            return html;
        }

        function createSettingPanel(settingPanelOptions, changeHandle) {

            document.body.insertAdjacentHTML('beforeend', panelStyles);
            const panelHTML = createPanelHTML(settingPanelOptions);
            document.body.insertAdjacentHTML('beforeend', panelHTML);

            const panel = document.getElementById('panel');

            panel.querySelector('#applyButton').addEventListener('click', () => {
                panel.style.display = 'none';
                saveLocalSetting('danmakuSetting', currentSetting)
            });

            const sliders = panel.querySelectorAll('.slider');
            const sliderValues = panel.querySelectorAll('.slider-value');

            sliders.forEach((slider, index) => {
                slider.addEventListener('input', () => {
                    sliderValues[index].textContent = slider.value;
                    changeHandle[slider.id](parseFloat(slider.value), slider.id);
                });
            });

            // Handle checkbox changes
            const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    changeHandle[checkbox.id](Number(checkbox.checked), checkbox.id);
                });
            });

            // Handle number input changes
            const numberInputs = panel.querySelectorAll('.number-input');
            numberInputs.forEach(input => {
                input.addEventListener('input', () => {
                    const value = parseFloat(input.value);
                    if (!isNaN(value)) {
                        changeHandle[input.id](value, input.id);
                    }
                });
            });

            // Handle text selector changes
            const textSelectors = panel.querySelectorAll('.text-selector');
            textSelectors.forEach(selector => {
                selector.addEventListener('change', () => {
                    changeHandle[selector.id](selector.value, selector.id);
                });
            });

            return panel
        }


        let panel = createSettingPanel(settingPanelOptions, changeHandle)
        panel.style.display = 'none'
        return function () {
            if (!document.getElementById(panel.id)) {
                panel = createSettingPanel(settingPanelOptions, changeHandle)
            }
            if (panel.style.display !== 'block') {
                panel.style.display = 'block'
            } else {
                panel.style.display = 'none'
            }
        }
    })(
        settingPanelOptions,
        {
            speed(value, id) {
                danmakuPlayer.speed = 144 * value;
                currentSetting[id] = value;
            }, scale(value, id) {
                danmakuPlayer.comments.forEach((danmaku) => {
                    danmaku.style.fontSize = danmaku.style.originFontSize * Number(value) + 'px'
                })
                currentSetting[id] = value;
            }, opacity(value, id) {
                setCssVar(id, value);
                currentSetting[id] = value;
            }, maxHeight(value, id) {
                setCssVar(id, value);
                currentSetting[id] = value;
                danmakuPlayer.resize()
            }, danmakuOffset(value) {
                updateDanmakuOffset(value)
            }
        });

    let showKeymapPanel = (function () {
        function buildPanel() {
            let html = `<style>
        #keymapPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 999999;
            display: none;
        }
        #keymapPanel>ul{
        margin-bottom: 30px;
        }
        #keymapPanel>ul>li{
        margin-top: 5px;
        margin-left: 10px;
        margin-right: 10px;
        }
        .close-button {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: #555;
        color: white;
        border: none;
        border-radius: 3px;
        padding: 5px 10px;
        cursor: pointer;
        }
        </style>
        <div id="keymapPanel"><ul>
            <li><span>大写锁定键</span> : 切换弹幕显示</li>
            <li><span>C</span> : 切换弹幕显示</li>
            <li><span>D</span> : 选择弹幕文件</li>
            <li><span>O</span> : 显示/关闭弹幕设置</li>
            <li><span>K</span> : 显示/关闭快捷键说明</li>
            
            <li><span>[</span> : 所有弹幕提前1秒出现</li>
            <li><span>]</span> : 所有弹幕延迟1秒出现</li>
            <li><span>Ctrl+[</span> : 弹幕提前5秒出现</li>
            <li><span>Ctrl+]</span> : 弹幕延迟5秒出现</li>
        </ul>
        <button class="close-button" id="closeKeymapPanelButton">关闭</button>
        </div>`
            document.body.insertAdjacentHTML('beforeend', html)
            let panel = document.getElementById('keymapPanel')
            panel.querySelector('#closeKeymapPanelButton').addEventListener('click', () => {
                panel.style.display = 'none'
            })
            return panel
        }

        let panel = buildPanel()
        return function () {
            if (!document.getElementById(panel.id)) {
                panel = buildPanel()
            }
            if (panel.style.display !== 'block') {
                panel.style.display = 'block'
            } else {
                panel.style.display = 'none'
            }
        }
    })();

    function selectDanmakuFile() {
        let html = '<input type="file" accept="application/xml" id="danmaku-input" multiple>'
        document.body.insertAdjacentHTML('afterbegin', html)
        let input = document.getElementById("danmaku-input")
        return new Promise((resolve, reject) => {
            input.addEventListener('change', (event) => {
                for (let file of event.target.files) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        console.log(['File content:', event.target.result]);
                        loadDanmaku(event.target.result)
                    };
                    reader.readAsText(file);
                }
                input.remove()
                resolve()
            });
            input.click();
        });
    }


    let setCssVar = function (vars) {
        let styleTag = document.createElement('style');
        document.head.appendChild(styleTag);
        const root = document.documentElement;

        // Generate the CSS variable declarations based on the provided variables
        let cssText = ':root {\n';
        for (const [name, value] of Object.entries(vars)) {
            cssText += `    --${name}: ${value};\n`;
        }
        cssText += '}\n';

        styleTag.innerHTML = cssText; // Apply the CSS variables

        return function updateCssVar(name, value) {
            root.style.setProperty(`--${name}`, value);
        };
    }({
        'opacity': currentSetting['opacity'],
        'maxHeight': currentSetting['maxHeight'],
    });


    let videoElem
    window.addEventListener("message", (event) => {
        if (event.data.type) {
            console.log(event.data)
        }
        if (event.data.type === "scriptLoadOrNot") {
            console.log("Response", event.data, 'scriptLoadOrNot')
            window.top.postMessage({
                "type": 'scriptLoaded',
                "src": event.data.src
            }, '*')
        }
    })

    async function testIframe() {
        let iframes = document.querySelectorAll('iframe')
        for (let iframe of iframes) {
            if (!iframe.contentWindow) continue
            if (iframe.hasAttribute("tested")) continue
            let origin = new URL(iframe.src).origin
            waitMessage((eventData) => {
                return eventData.type === 'scriptLoaded' && eventData.src === iframe.src;
            }, 15000).then((result) => {
                console.log('Received:', result);
            })
                .catch((error) => {
                    if (iframe.hasAttribute("tested")) return
                    console.error('Error:', error.message);
                    alert("在页面中找到未注册的iframe, 请在脚本头中添加\"// @match        " + origin + '/*  ",以使外挂弹幕正常加载')
                }).finally(() => {
                iframe.setAttribute("tested", 1)
            });
            console.log('postMessage to iframe', window.location.href, {
                "type": 'scriptLoadOrNot',
                "src": iframe.src
            })
            iframe.contentWindow.postMessage({
                "type": 'scriptLoadOrNot',
                "src": iframe.src
            }, '*')
        }
    }

    function createDanmakuPlayer(videoElem) {
        function buildContainer(videoElem) {
            // Get a reference to the existing element in the document
            let html = `
<style>
  #bottom-danmaku-container
   {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height:  100%;
    width: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 999;
    line-height: 1.2;
    opacity: var(--opacity);
  }
  #top-danmaku-container
   {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height:  100%;
    width: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 999;
    line-height: 1.2;
    opacity: var(--opacity);
  }
  #danmaku-container
   {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--maxHeight);
    width: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 999;
    line-height: 1.2;
    opacity: var(--opacity);
  }
</style>
<div id="bottom-danmaku-container"></div>
<div id="danmaku-container"></div>
<div id="top-container"></div>
`
            videoElem.parentElement.insertAdjacentHTML('beforeend', html);
            return [document.getElementById("danmaku-container"),
                document.getElementById("bottom-danmaku-container"),
                document.getElementById("top-danmaku-container")]
        }

        let [danmakuContainer, bottomContainer, topContainer] = buildContainer(videoElem)
        let bottomDanmaku = new Danmaku({
            container: bottomContainer,
            media: videoElem,
            comments: [],
            speed: 144
        })
        let topDanmaku = new Danmaku({
            container: topContainer,
            media: videoElem,
            comments: [],
            speed: 144
        })
        let danmaku = new Danmaku({
            container: danmakuContainer,
            media: videoElem,
            comments: [],
            speed: currentSetting.speed * 144
        })
        let player = {
            engines: [danmaku, topDanmaku, bottomDanmaku],
            bottomDanmaku: bottomDanmaku,
            topDanmaku: topDanmaku,
            danmaku: danmaku,
            shown: true,
            emit(comment) {
                if (comment.mode === 'bottom') {
                    this.bottomDanmaku.emit(comment)
                } else if (comment.mode === 'top') {
                    this.topDanmaku.emit(comment)
                } else {
                    this.danmaku.emit(comment)
                }
            },
            clear() {
                this.engines.forEach((it) => (it.clear()))
            },
            resize() {
                this.engines.forEach((it) => {
                    it.resize()
                    if (it !== this.danmaku) {
                        it._.duration = 4
                    }
                })
            },
            destroy() {
                this.engines.forEach((it) => (it.destroy()))
            },
            show() {
                this.engines.forEach((it) => (it.show()))
            },
            hide() {
                this.engines.forEach((it) => (it.hide()))
            },
            switch() {
                if (this.shown) {
                    this.hide()
                    this.shown = false
                    toastText("弹幕已隐藏")
                } else {
                    this.show()
                    this.shown = true
                    toastText("弹幕已显示")
                }
            }
        }
        Object.defineProperty(player, 'comments', {
            get() {
                return player.danmaku.comments.concat(player.bottomDanmaku.comments)
            }
        })
        Object.defineProperty(player, 'speed', {
            set(value) {
                this.danmaku.speed = value
            }
        })
        return player
    }

    async function getPlayingVideoElem() {
        let videoElem = null
        let videoMap = {}
        let count = 0
        while (!videoElem) {
            count += 1
            if (count > 5) {
                testIframe()
            }
            let videos = document.querySelectorAll('video')
            for (let videoElement of videos) {
                videoMap[videoElement] = [videoElement.paused, videoElement.currentTime]
                if (!videoElement.paused) {
                    videoElem = videoElement
                    console.log(videoElement, videos, videoElement.paused)
                }
            }
            await sleep(1000)
        }
        console.log(videoElem, videoMap)
        return videoElem
    }

    let initialed = false

    async function startHook() {
        videoElem = await getPlayingVideoElem();
        if (!initialed) {
            initialed = true;
            (function createToolbar(config) {
                let html = `
<style>

  #triggerArea {
    position: fixed;
    top: 10%;
    left: 0;
    width: 2%;
    height: 80%;
    cursor: pointer;
  }

  #toolbar {
    position: fixed;
    top: 50%;
    left: -250px;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: grab;
    transition: left 0.3s;
    z-index: 999999;
  }

  #toolbar:active {
    cursor: grabbing;
  }

  #toolbar button {
    display: block;
    margin: 5px 0;
    padding: 8px;
    background-color: #555;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
  }
</style>
<div id="triggerArea"></div>
<div id="toolbar"></div>
`


                document.body.insertAdjacentHTML('beforeend', html)
                const triggerArea = document.getElementById('triggerArea');
                const toolbar = document.getElementById('toolbar');
                let isDragging = false;
                let isExpanded = false;
                let startY = 0;
                let initialTop = 0;
                let currentSetting = getLocalSetting('dfToolbar')
                if (currentSetting['offsetTopPercent']) {
                    toolbar.offsetTop = currentSetting['offsetTopPercent'] * window.innerHeight
                }
                console.log('createToolbar', config)
                for (let option of Object.keys(config.options)) {
                    let button = document.createElement("button")
                    button.innerText = option
                    button.addEventListener('click', config.options[option])
                    toolbar.appendChild(button)
                }


                function expandToolbar() {
                    if (!isExpanded) {
                        toolbar.style.left = '0';
                        isExpanded = true;
                    }
                }

                function collapseToolbar() {
                    if (isExpanded) {
                        toolbar.style.left = '-250px';
                        isExpanded = false;
                    }
                }

                triggerArea.addEventListener('mouseenter', () => {
                    expandToolbar();
                });

                triggerArea.addEventListener('mouseleave', () => {
                    collapseToolbar();
                    if (isDragging) {
                        isDragging = false
                        dragEndHandle()
                    }
                });

                toolbar.addEventListener('mouseenter', () => {
                    expandToolbar();
                });

                toolbar.addEventListener('mouseleave', () => {
                    if (!isDragging) {
                        collapseToolbar();
                    }
                });

                toolbar.addEventListener('mousedown', (e) => {
                    if (e.target === toolbar) {
                        console.log(e.type, e)
                        isDragging = true;
                        startY = e.clientY;
                        initialTop = toolbar.offsetTop;
                    }
                });


                let draggingHandle = (e) => {
                    if (!isDragging) return;
                    const deltaY = e.clientY - startY;
                    toolbar.style.top = `${initialTop + deltaY}px`;
                }

                let dragEndHandle = (e) => {
                    if (isDragging) {
                        isDragging = false;
                        currentSetting.offsetTopPercent = toolbar.offsetTop / window.innerHeight
                        saveLocalSetting('dfToolbar', currentSetting)
                    }
                }

                window.addEventListener('mousemove', draggingHandle);
                window.addEventListener('mouseup', dragEndHandle);

                expandToolbar()
                setTimeout(collapseToolbar, 3000)
            })({
                options: {
                    "加载弹幕(D)": selectDanmakuFile,
                    "弹幕选项(O)": showSettingPanel,
                    "快捷键(K)": showKeymapPanel
                }
            });
            (function createFileDropMask() {
                const mask = document.createElement('div');
                mask.id = "danmakuLoaderMask"
                mask.style.position = 'fixed';
                mask.style.top = '0';
                mask.style.left = '0';
                mask.style.width = '100%';
                mask.style.height = '100%';
                mask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                mask.style.zIndex = '9999';
                mask.style.pointerEvents = 'none';
                mask.style.opacity = '0';

                document.documentElement.insertBefore(mask, document.documentElement.firstChild);

                const handleFileDrop = function (event) {
                    event.preventDefault();
                    for (let file of event.dataTransfer.files) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            console.log(['File content:', event.target.result]);
                            loadDanmaku(event.target.result)
                        };
                        reader.readAsText(file);
                    }
                };

                document.addEventListener('dragover', function (event) {
                    event.preventDefault();
                    mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                });

                document.addEventListener('dragleave', function (event) {
                    event.preventDefault();
                    mask.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                });

                document.addEventListener('drop', handleFileDrop);
            })();
            (function applyKeymap(keycodeMap) {
                document.addEventListener('keydown', (event) => {
                    const keysPressed = [];

                    if (event.ctrlKey) {
                        keysPressed.push('17');  // Ctrl key
                    }
                    if (event.altKey) {
                        keysPressed.push('18');  // Alt key
                    }
                    if (event.shiftKey) {
                        keysPressed.push('16');  // Shift key
                    }

                    keysPressed.push(event.keyCode.toString());

                    const combinedKey = keysPressed.join('+');
                    const action = keycodeMap[combinedKey];
                    console.log('combinedKey', combinedKey, action)

                    if (action) {
                        action();
                    }
                });
            })({
                '20': function () {
                    danmakuPlayer.switch()
                },
                '55': function () {
                    danmakuPlayer.switch()
                },
                '219': function () {
                    updateDanmakuOffset(currentOffset - 1)
                },
                '221': function () {
                    updateDanmakuOffset(currentOffset + 1)
                },
                '17+221': function () {
                    updateDanmakuOffset(currentOffset + 5)
                },
                '17+219': function () {
                    updateDanmakuOffset(currentOffset - 5)
                },
                '79': function () {
                    showSettingPanel()
                },
                '68': function () {
                    selectDanmakuFile()
                },
                '75': function () {
                    showKeymapPanel()
                }
            });
        }


        danmakuPlayer = createDanmakuPlayer(videoElem)
        toastText("danmakuPlayer initialed")
        console.log("danmakuPlayer inited", danmakuPlayer)

        let lastWidth = videoElem.offsetWidth
        unsafeWindow.danmaku = danmakuPlayer

        while (true) {
            if (videoElem.offsetWidth !== lastWidth) {
                console.log(lastWidth, videoElem.offsetWidth)
                if (videoElem.offsetWidth !== 0) {
                    danmakuPlayer.resize()
                    lastWidth = videoElem.offsetWidth
                } else {
                    danmakuPlayer.destroy()
                    toastText("danmakuPlayer destroyed")
                    break
                }
            }
            await sleep(500)
        }
    }

    while (true) {
        await startHook()
    }

})
()

