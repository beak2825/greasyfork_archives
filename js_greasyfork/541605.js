// ==UserScript==
// @name         网页截图
// @namespace
// @include      *
// @version      0.0.7
// @description  使用SnapDOM实现的网页截图工具
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @require      https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js
// @downloadURL https://update.greasyfork.org/scripts/541605/%E7%BD%91%E9%A1%B5%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/541605/%E7%BD%91%E9%A1%B5%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==
GM_addStyle(`
    :root {
        --snap-theme-color: #fff;
        --snap-txt-color: #000;
        --snap-shadow-color: #0003;
    }
    #snap-dom {
        position: fixed;
        bottom: 15px;
        right: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: var(--snap-txt-color);
        height: 30px;
        width: 30px;
        background-color: var(--snap-theme-color);
        border-radius: 50%;
        box-shadow: 0 0 4px 2px var(--snap-shadow-color);
        text-decoration: none;
        cursor: pointer;
        z-index: 3000;
    }
    #snap-dom.loading {color:transparent}
    #snap-dom.loading::before {
        --g: no-repeat radial-gradient(circle closest-side,var(--snap-txt-color) 90%,transparent);
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background:
          var(--g) 0%   50%,
          var(--g) 50%  50%,
          var(--g) 100% 50%;
        background-size: calc(100%/3) 50%;
        animation: l3 1s infinite linear;
        cursor: wait;
    }
    .snap-target {
        box-shadow: inset 0 0 4px 2px green, 0 0 10px 4px green !important;
    }
    @keyframes l3 {
        20%{background-position:0%   0%, 50%  50%,100%  50%}
        40%{background-position:0% 100%, 50%   0%,100%  50%}
        60%{background-position:0%  50%, 50% 100%,100%   0%}
        80%{background-position:0%  50%, 50%  50%,100% 100%}
    }
    @media (prefers-color-scheme: dark) {
        :root {
            --snap-theme-color: #1b2832;
            --snap-txt-color: #ddd;
            --snap-shadow-color: #ddd3;
        }
    }
`)
/**
 * 网页截图插件
 *
 * @description 基于 [snapdom](https://github.com/zumerlab/snapdom) 实现的网页截图功能，开始截图后，可移动鼠标选中网页元素，点击以下载
 * @author ymzhaobth@gmail.com
 * @license MIT
 */
;(function() {
	'use strict'


    let hoverEl = null
    let isChosing = false
    let loading = false
    const TIMEOUT = 1000 * 60

    window.onload = function() {
        const startEl = document.createElement('a')
        startEl.id = 'snap-dom'
        startEl.innerText = '截'
        startEl.addEventListener('click', async () => {
            if(isChosing || loading) return
            isChosing = true
            document.body.addEventListener('mousemove', handleMousemove)
            setTimeout(() => {
                document.body.addEventListener('click', handleConfirmTarget)
            }, 200)
        })
        document.body.append(startEl)
    }

    function handleMousemove(e) {
        if(!isChosing || !e.target) return
        if(hoverEl) hoverEl.classList.remove('snap-target')
        e.target.classList.add('snap-target')
        hoverEl = e.target
    }
    async function handleConfirmTarget(e) {
        isChosing = false
        document.body.removeEventListener('mousemove', handleMousemove)
        document.body.removeEventListener('click', handleConfirmTarget)

        if(!hoverEl) {
            shining('未选中目标', 'orange')
            return
        }
        hoverEl.classList.remove('snap-target')
        // 下载
        loading = true
        const startEl = document.getElementById('snap-dom')
        startEl.classList.add('loading')
        await manualDelay(50)
        try {
            await execSnapDom(hoverEl)
            shining('下载成功')
        } catch(err) {
            shining('下载失败', 'red')
            console.error(err)
        }
        loading = false
        startEl.classList.remove('loading')
        hoverEl = null
    }

    // 指定DOM元素，下载其内容
    async function execSnapDom(targetEl) {
        if(!snapdom) {
            console.error('未加载插件snapdom')
            return
        }
        if(!targetEl) {
            console.error('未指定捕获元素')
            return
        }
        console.time('捕获耗时：')
        const capture = await snapdom(targetEl, {
            embedFonts: true,
            compress: true
        })
        console.timeEnd('捕获耗时：')
        console.time('下载耗时：')
        await capture.download({
            format: 'jpg',
            filename: 'chart-report-2025'
        });
        console.timeEnd('下载耗时：')
    }
    // 延时
    function manualDelay(delay = 500) {
        return new Promise(resolve => setTimeout(resolve, delay))
    }
    // 提示
    function shining(message, color = 'rgb(50, 177, 108)', fontSize = 'xxx-large') {
        if (!message) return
        const i = document.createElement('span')
        i.textContent = message
        i.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            color: ${color};
            font-size: ${fontSize};
            font-weight: bold;
            transform: translate(-50%, -50%);
            user-select: none;
            z-index: 2002;`
        document.body.appendChild(i)
        const duration = 2500
        i.animate(
            [{ top: '50%', opacity: 1 }, { top: '30%', opacity: 0 }],
            { duration, fill: 'forwards' }
        )
        setTimeout(i.remove, duration)
    }
})();