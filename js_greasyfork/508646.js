// ==UserScript==
// @name         摸鱼日报转稿姬
// @namespace    https://microblock.cc
// @version      0.0.0
// @description  摸鱼日报转稿
// @author       You
// @match        https://www.bilibili.com/video/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508646/%E6%91%B8%E9%B1%BC%E6%97%A5%E6%8A%A5%E8%BD%AC%E7%A8%BF%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/508646/%E6%91%B8%E9%B1%BC%E6%97%A5%E6%8A%A5%E8%BD%AC%E7%A8%BF%E5%A7%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let onHidePage = ()=>{}
    const showPostFrame = () => {
        const frame = document.createElement('iframe');
        frame.src = 'https://microblock.cc/leisure-daily/post'
        const removeFrame = () => {
            frame.animate([{ opacity: 1, transform: 'translateY(0px)' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 300 }).onfinish = () => frame.remove()
            removeEventListener('message', handler)
            onHidePage()
        }
        const handler = e => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.type === 'close') {
                    removeFrame()
                }
                if (msg.type === 'post_submited') {
                    setTimeout(removeFrame, 1000)
                }
            } catch (e) { }
        }
        addEventListener('message', handler)
        frame.style = `position: fixed;inset: 0px;border: none;left: 0;right: 0;top: 0;bottom: 0;width: 100%;height: 100%;z-index: 99999999;background: transparent;opacity:0;`
    document.body.appendChild(frame)
        frame.onload = () => {
            frame.animate([{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1 }], { duration: 300, fill: 'forwards' })
            setTimeout(() => {
                frame.contentWindow.postMessage(JSON.stringify({ type: 'set_forward_link', link: location.href, parser: 'bilibili' }), "*")
            }, 400)

            setTimeout(() => {
                frame.contentWindow.postMessage(JSON.stringify({ type: 'set_forward_link', link: location.href, parser: 'bilibili' }), "*")
            }, 1000)
        }
    }

    if(document.location.hostname.includes('bilibili.com')) {
        const initInterval = setInterval(()=>{
            const div = document.createElement('div');
            div.innerHTML = `<div class="leisure_daily"><button>转至摸鱼日报</button></div><style>
            .leisure_daily {
                position: fixed;
                left: 10px;
                top: 200px;
                z-index: 99999;
            }

            .leisure_daily > button {
    border-radius: 200px;
    border: none;
    background: #FB7299;
    color: white;
    box-shadow: rgba(251, 114, 153, 0.4) 0px 6px 10px 0px;
    cursor: pointer;
    padding: 5px 10px;
    max-width: 32px;
            }
            </style>`
            const btn = div.querySelector('button');
            btn.onclick = (e)=>{
                e.stopPropagation()
                showPostFrame()
                btn.style.display = 'none'
                onHidePage = ()=>btn.style.display = 'block'
            }
            document.body.appendChild(div);
            clearInterval(initInterval)
        }, 100)
        }
})();