// ==UserScript==
// @name                Bilibili ASS Loader
// @name:zh             哔哩哔哩本地 ASS 弹幕加载器
// @name:zh-CN          哔哩哔哩本地 ASS 弹幕加载器
// @namespace           https://github.com/HirotaZX
// @match               *://www.bilibili.com/video/*
// @grant               none
// @version             0.1.3
// @author              HirotaZX
// @require             https://gcore.jsdelivr.net/npm/assjs@0.1.2/dist/ass.global.min.js
// @description         Load local ASS subtitles or danmaku for Bilibili videos
// @description:zh      为哔哩哔哩视频加载本地 ASS 弹幕/字幕
// @description:zh-CN   为哔哩哔哩视频加载本地 ASS 弹幕/字幕
// @downloadURL https://update.greasyfork.org/scripts/516600/Bilibili%20ASS%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/516600/Bilibili%20ASS%20Loader.meta.js
// ==/UserScript==

(function () {
    let vid = null;
    let files = [];
    let pod = 0;
    let ass = null;

    // 获取分P标题
    const titles = Array.from(document.querySelectorAll('.video-pod__item > .title')).map(t => t.title);

    // 获取视频元素
    const vidWrap = document.querySelector('.bpx-player-video-wrap');
    vid = vidWrap && vidWrap.querySelector('video');
    if (vid) {
        init();
    } else {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === 'VIDEO') {
                            vid = node;
                            init();
                            observer.disconnect();
                        }
                    });
                }
            }
        });

        observer.observe(document.getElementById('bilibili-player'), { childList: true, subtree: true });
    }

    function init() {
        // 初始化UI和事件
        initUI();
        initEvent();

        // 获取分P
        const activePod = document.querySelector('.video-pod__item.active');
        pod = Array.from(activePod.parentNode.children).indexOf(activePod) + 1;

        // 监听分P变化
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src' && vid.src) {
                    const podElm = document.querySelector('.video-pod');
                    pod = podElm && podElm.__vue__ && podElm.__vue__.p;
                    loadAss();
                }
            }
        });
        observer.observe(vid, { attributes: true });
    }

    function initEvent() {
        const bassl = document.getElementById('bilibili-ass-loader');
        const trigger = document.getElementById('bassl-trigger');
        trigger.addEventListener('click', (e) => {
            if (!bassl.classList.contains('show')) {
                bassl.classList.add('show');
            }
        });

        const close = document.getElementById('bassl-close');
        close.addEventListener('click', (e) => {
            if (bassl.classList.contains('show')) {
                bassl.classList.remove('show');
            }
        });

        const fileInput = document.getElementById('bassl-file-input');
        const fileCount = document.getElementById('bassl-file-count');
        fileInput.addEventListener('change', (event) => {
            files = Array.from(event.target.files).filter(f => f.name.includes('.ass'));
            fileCount.innerText = files.length;
            loadAss();
        });
        
        const assContainer = document.getElementById('ass-container');
        const opacitySlider = document.getElementById('bassl-opacity-slider');
        opacitySlider.addEventListener('input', function() {
            const opacity = opacitySlider.value / 100;
            assContainer.style.opacity = opacity;
        });

        const showAss = document.getElementById('bassl-show');
        showAss.addEventListener('click', (e) => {
            if (!ass) {
                e.preventDefault();
                alert("ASS弹幕尚未加载，请先选择文件夹！");
            } else if (showAss.checked) {
                ass.show();
            } else {
                ass.hide();
            }
        });
    }

    function loadAss() {
        if (ass) {
            ass.destroy();
            ass = null;
        }

        if (pod && pod > 0) {
            let assFile = findAssByTitle(titles[pod - 1]);
            if (!assFile) {
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                const assContent = e.target.result;
                ass = new ASS(assContent, vid, {
                    container: document.querySelector('#ass-container'),
                });
                setTimeout(() => {
                    if (document.getElementById('bassl-show').checked) {
                        ass.show();
                    } else {
                        ass.hide();
                    }
                }, 0);
            };
            reader.readAsText(assFile);
        }

    }

    // 根据分P标题匹配字幕
    function findAssByTitle(title) {
        const equalMatch = Array.from(files).find(f => f.name == title + '.ass');
        if (equalMatch) {
            return equalMatch;
        } else {
            const containsMatch = Array.from(files).find(f => f.name.includes(title));
            return containsMatch;
        }
    }

    function initUI() {
        const assContainer = document.createElement('div');
        assContainer.id = 'ass-container';
        assContainer.style = 'position:absolute; top:0; left:0; right:0; bottom:0; z-index:1;';
        vid.insertAdjacentElement('afterend', assContainer);

        const htmlContent = `
<div id="bilibili-ass-loader" class="bassl">
    <div class="bassl-container">
        <div id="bassl-close" class="bassl-close">
            ×
        </div>
        <div class="bassl-row" style="flex-flow:column; gap:4px; align-items:flex-start;">
            <label>选择 ASS 弹幕文件夹：</label>
            <input id="bassl-file-input" type="file" webkitdirectory multiple style="max-width:180px; font-size:0.9em; pointer:cursor;"/>
        </div>
        <div class="bassl-row">
            <label>已加载 <span id="bassl-file-count">0</span> 个分P弹幕</label>
        </div>
        <div class="bassl-row">
            <label>透明度</label>
            <div class="bassl-num-slider">
                <input id="bassl-opacity-slider" type="range" min="0" max="100" value="100">
            </div>
        </div>
        <div class="bassl-row">
            <label>显示 ASS 弹幕</label>
            <label class="bassl-switch">
                <input id="bassl-show" type="checkbox" checked>
                <span class="bassl-slider"></span>
            </label>
        </div>
    </div>
    <div id="bassl-trigger" class="bassl-trigger">
        ASS
    </div>
</div>
`;
        const cssContent = `
        .bassl {
            position:fixed;
            right:8px;
            bottom:260px;
            z-index:100;
            user-select:none;
        }

        .bassl.show .bassl-container{
            display:block;
        }

        .bassl.show .bassl-trigger{
            display:none;
        }

        .bassl-container {
            position: relative;
            display:none;
            border-radius: 5px;
            padding: 20px;
            background: white;
            box-shadow: 0px 0px 5px #ddd;
        }

        .bassl-trigger {
            width:40px;
            height:40px;
            border-radius:20px;
            background: white;
            display:flex;
            justify-content:center;
            align-items:center;
            font-weight:bold;
            font-size:14px;
            color:#444;
            box-shadow: 0px 0px 5px #ddd;
            transition: all 0.3s ease;
            cursor:pointer;
        }

        .bassl-trigger:hover {
            background: #2196F3;
            color: #fff;
        }

        .bassl-close {
            position: absolute;
            top: 8px;
            right: 8px;
            color: #999;
            cursor: pointer;
            font-size: 26px;
            line-height: 16px;
        }


        .bassl-row {
            display:flex;
            flex-flow:row;
            gap:10px;
            align-items:center;
            margin-bottom:12px;
        }

        .bassl-row:last-child {
            margin-bottom:0;
        }

        .bassl-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        .bassl-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .bassl-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 20px;
        }

        .bassl-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
        }

        input:checked + .bassl-slider {
            background-color: #2196F3;
        }

        input:checked + .bassl-slider:before {
            transform: translateX(20px);
        }

        .bassl-num-slider {
            width: 96px;
            display: flex;
            align-items: center;
        }

        .bassl-num-slider input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: #ccc;
            border-radius: 5px;
            outline: none;
            transition: background 0.3s;
        }

        .bassl-num-slider input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px; 
            height: 16px;
            background: #2196F3;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s;
        }

        .bassl-num-slider input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #2196F3;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s;
        }

        .bassl-num-slider input[type="range"]:hover::-webkit-slider-thumb {
            background: #1e88e5;
        }

        .bassl-num-slider input[type="range"]:hover::-moz-range-thumb {
            background: #1e88e5;
        }
`;

        const htmlContainer = document.createElement('div');
        htmlContainer.innerHTML = htmlContent;
        document.documentElement.append(htmlContainer.firstElementChild);

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(cssContent));
        document.head.appendChild(style);
    }

})();