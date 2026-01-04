// ==UserScript==
// @name         AcFun 直播声道调整
// @namespace    https://github.com/DaddyTrap
// @version      0.3
// @description  将直播视频的双声道合到左声道或右声道，或许能在同时D两个主播时更容易听清……
// @author       PlusC
// @license      GNU GPLv3
// @match        https://live.acfun.cn/live/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446697/AcFun%20%E7%9B%B4%E6%92%AD%E5%A3%B0%E9%81%93%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/446697/AcFun%20%E7%9B%B4%E6%92%AD%E5%A3%B0%E9%81%93%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

// 0.3: '.container-player video' 现在不是 DOM 出来就有的, 所以换一下实现, 等到它了再执行 init

// 复制一些原本的style；加一点自己的修改
GM_addStyle(`
    .sound-channel-panel .selected {
        pointer-events: none;
        color: #FD4C5C;
    }
    .sound-channel-panel {
        position: absolute;
        display: none;
        left: 50%;
        top: 0;
        -webkit-transform: translate(-50%, -100%);
        transform: translate(-50%, -100%);
        cursor: auto;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
    }
    .sound-channel-panel .transparent-placeholder {
        height: 20px;
        background: transparent;
    }
    .sound-channel-panel ul li {
        height: 36px;
        text-align: center;
        line-height: 36px;
        padding: 0px 0px;
        margin: 0px;
        cursor: pointer;
        width: 100%;
    }
    .sound-channel-panel ul {
        background: rgba(21,21,21,0.8);
        border-radius: 4px;
        margin: 0px;
        padding: 0px;
        width: 100%;
        list-style: none;
    }
    .sound-channel:hover .sound-channel-panel {
        display: block;
    }
`)

;(function() {
    'use strict';

    // Source: https://stackoverflow.com/a/61511955
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
    
            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    class MediaController {
        constructor(mediaElement) {
            this.mediaElement = mediaElement
            this.audioContext = new AudioContext()
            // 默认先不把 mediaElement 放到 audioContext，免得有问题恢复不了
            this.source = null
            this.channelSplitter = this.audioContext.createChannelSplitter(2)
            this.channelMerger = this.audioContext.createChannelMerger(2)
        }

        _tryInit = ()=>{
            if (this.source !== null) return
            this.source = this.audioContext.createMediaElementSource(this.mediaElement)
        }

        // channel: 0->Left, 1->Right, other->Recover
        mergeToOneChannel = (channel) => {
            this._tryInit()
            this.source.connect(this.channelSplitter)
            this.channelSplitter.disconnect() // 先断掉所有输出，后面重新接
            if (channel === 0) {
                this.channelSplitter.connect(this.channelMerger, 1, 0)
            } else if (channel === 1) {
                this.channelSplitter.connect(this.channelMerger, 0, 1)
            } else {
                // console.error('Unknown "channel" in mergeToOneChannel', channel)
                this.recover()
                return
            }
            this.channelMerger.connect(this.audioContext.destination)
        }

        // 恢复 - 不再连接filter
        recover = ()=>{
            this._tryInit()
            this.channelMerger.disconnect()
            this.source.connect(this.audioContext.destination)
        }
    }

    // source: https://stackoverflow.com/a/35385518
    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     */
    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function init() {
        // 找到 video
        const videoEle = document.querySelector('.container-player video')
        const controller = new MediaController(videoEle)
        // 造一个 div
        const controlBtn = htmlToElement(`
            <div class="control-btn sound-channel">
                <span>原声道</span>
                    <div class="sound-channel-panel">
                        <ul style="width: 86px;">
                            <li class='selected' data-val='origin'>原声道</li>
                            <li data-val='left'>左声道</li>
                            <li data-val='right'>右声道</li>
                        </ul>
                    <div class="transparent-placeholder"></div>
                </div>
            </div>
        `)
        const selectedChannelNameSpan = controlBtn.querySelector('div > span')
        let selectedChannel = 'origin'
        let selectedChannelBtn = null
        const ulEle = controlBtn.querySelector('ul')
        const selections = controlBtn.querySelectorAll('ul > li')
        const selectionBtns = {}
        for (const selection of selections) {
            const v = selection.dataset['val']
            selectionBtns[v] = selection
            if (selection.classList.contains('selected')) {
                selectedChannel = v
                selectedChannelBtn = selection
            }
        }
        ulEle.addEventListener('click', (event)=>{
            if (!('val' in event.target.dataset)) return
            const channel = event.target.dataset['val']
            selectedChannel = channel // 换成新的channel
            selectedChannelBtn.classList.remove('selected') // 老的不再selected
            selectedChannelBtn = event.target
            // controller 调用
            console.log(`Change to channel ${channel}`)
            if (channel === 'left') {
                controller.mergeToOneChannel(0)
            } else if (channel === 'right') {
                controller.mergeToOneChannel(1)
            } else if (channel === 'origin') {
                controller.mergeToOneChannel(-1)
            } else {
                console.log(`Unknown channel ${channel}`)
                return
            }
            // UI 变化
            selectedChannelBtn.classList.add('selected') // 新的变成selected
            selectedChannelNameSpan.textContent = selectedChannelBtn.textContent
        })
        // 简单粗暴地轮询有没有元素 - MutationObserver? 有空再说
        let timer = null;
        timer = setInterval(()=>{
            const container = document.querySelector('.container-player .container-plugins-inner .control-bar-top .box-right')
            if (!container) return
            clearInterval(timer)
            container.prepend(controlBtn)
        }, 1000)
    }

    // DOM 好了就初始化
    waitForElm('.container-player video').then(init);
})();
