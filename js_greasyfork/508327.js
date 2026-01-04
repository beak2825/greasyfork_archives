// ==UserScript==
// @name 墨君阁
// @version M-1
// @require https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @description The script is for personal study and research only and is used at your own risk.
// @author 墨君阁
// @match https://www.gaoding.com/editor/design?*
// @match https://www.focodesign.com/editor/design?*
// @match https://www.focodesign.com/editor/odyssey?template_id=*
// @license      Creative Commons (CC)

// @namespace https://greasyfork.org/en/users/1324676-jack-han
// @downloadURL https://update.greasyfork.org/scripts/508327/%E5%A2%A8%E5%90%9B%E9%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/508327/%E5%A2%A8%E5%90%9B%E9%98%81.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return mobileUserAgent;
        },
        configurable: true
    });
    
    const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function() {
            console.error('nowBB');
            return null;
        };

    function downloadImg() {
        let imgDom = document.querySelector('.infinite-canvas')
        if (!imgDom) {
            imgDom = document.querySelector('.editor-canvas')
        }if (imgDom) {
            var root = document.documentElement
            root.style.overflow = 'auto'
            const canvas = document.createElement('canvas')
            const width = parseInt(window.getComputedStyle(imgDom).width)
            const height = parseInt(window.getComputedStyle(imgDom).height)
            let scale = 1
            canvas.width = width * scale
            canvas.height = height * scale
            canvas.style.width = width + 'px'
            canvas.style.height = height + 'px'
            Array.from(document.querySelectorAll('.editor-layout-current div'))
                .filter((el) => el.classList.length===0 && el.childNodes.length===0)
                .forEach((el) => {
                el.setAttribute('data-html2canvas-ignore', '')
            })
            html2canvas(imgDom, {
                canvas: canvas,
                scale: scale,
                useCORS: true ,
            }).then((canvas) => {
                let dataURL = canvas.toDataURL('image/png')
                const el = document.createElement('a')
                el.download = 'PIC.png'
                el.href = dataURL
                document.body.append(el)
                el.click()
                el.remove()
            })
        }}function addTool() {
            const button = document.createElement('button')
            button.style.position = 'absolute'
            button.style.zIndex = '999'
            button.style.top = '28px'
            button.style.left = '800px'
            button.style.width = '100px'
            button.style.height = '32px'
            button.style.fontSize = '16px'
            button.style.background = '#ADD8E6'
            button.innerText = '下载 '
            document.body.append(button)
            button.onclick = downloadImg
        }addTool()
})();