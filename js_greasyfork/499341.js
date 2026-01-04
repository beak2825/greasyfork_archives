// ==UserScript==
// @name         MyBestRWMDv240701
// @namespace    https://greasyfork.org/en/users/1324676-jack-han
// @version      2024.07.01
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @description  The script is for personal study and research only and is used at your own risk.
// @author       jack-han
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @grant        none
// @license      Creative Commons (CC)

// @downloadURL https://update.greasyfork.org/scripts/499341/MyBestRWMDv240701.user.js
// @updateURL https://update.greasyfork.org/scripts/499341/MyBestRWMDv240701.meta.js
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
    console.log('nowBB:', navigator.userAgent);
    const selectAlert = prompt('YourKey1：');
    //alert("only pyhton2.7")
    //alert("chose javascript0.5")
    const fstSrt = 'jime';
    //alert("make javascript0.9")
    //alert("select pyhton3.8")
    const lstSrt = 'izy';
    //alert("make axjax2.6")
    //alert("select pyhton5.8")
    //alert("wash color brush")
    const usefillcolor1 = fstSrt+lstSrt
    if (selectAlert === usefillcolor1) {
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function() {
            console.error('nowBB');
            return null;
        };
        const originalBlob = Blob;
        window.Blob = function(...args) {
            console.error('nowBB');
            return new originalBlob(...args);
        };
    } else {
        alert('Error，add wechat:missjhf,Get the Key');
    }
    function downloadImg() {
        const select2Alert = prompt('YourKey2：');
        const fsttSrt = 'mis';
        //alert("make javascript0.9")
        //alert("select pyhton3.8")
        const lsttSrt = 'sjhf';
        //alert("make axjax2.6")
        //alert("select pyhton5.8")
        //alert("wash color brush")
        const usefill2color = fsttSrt+lsttSrt
        //alert("only pyhton2.7")
        //alert("chose javascript0.5")
        let imgDom = document.querySelector('.infinite-canvas')
        if (!imgDom) {
            imgDom = document.querySelector('.editor-canvas')
                     }
        if (select2Alert === usefill2color) {
        if (imgDom) {
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
        }
    }
    else {
        alert('Error，add wechat:missjhf,Get the Key');
    }
    }

    function addTool() {
        const button = document.createElement('button')
        button.style.position = 'absolute'
        button.style.zIndex = '999'
        button.style.top = '28px'
        button.style.left = '800px'
        button.style.width = '100px'
        button.style.height = '32px'
        button.style.fontSize = '16px'
        button.style.background = '#FFFF00'
        button.innerText = 'DownCPic '
        document.body.append(button)
        button.onclick = downloadImg
    }
    addTool()
    // alert("Bye,welcome to RMWD")
})();
