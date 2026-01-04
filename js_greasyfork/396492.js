// ==UserScript==
// @name         preview iconfont diff
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  preview iconfont diff when update icon
// @author       rrf
// @match        *://www.iconfont.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396492/preview%20iconfont%20diff.user.js
// @updateURL https://update.greasyfork.org/scripts/396492/preview%20iconfont%20diff.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldIcon, newIcon, oldIconDom, initOldIcon
    const reader = new FileReader();
    /*reader.onload = e => {
        newIcon = e.target.result
    }*/
    function watchFileChange() {
        document.getElementById('J_uploader_svg').addEventListener('change', e=>{
            updateOldIconDom()
            watchFileChange()
            //reader.readAsDataURL(e.target.file[0])
        })
    }
    function updateOldIconDom() {
        if (!oldIconDom) {
            oldIconDom = document.createElement('div')
            let wrap = document.createElement('div')
            let content = document.querySelector('.svg-wrap.clearfix')
            // 包裹一层，用于布局
            wrap.style = 'display: flex'
            content.parentNode.insertBefore(wrap, content)
            wrap.appendChild(content)
            oldIconDom.className = 'ea-iconfont-oldicon-preview'
            oldIconDom.innerHTML = initOldIcon
            let titleNew = document.createElement('div')
            let titleOld = document.createElement('div')
            titleNew.innerText = '新icon：'
            titleOld.innerText = '旧icon：'
            titleNew.style = titleOld.style = 'font-size: 14px; font-weight: 600'
            document.querySelector('.mp-e2e-content.edit-dialog').style.overflow = 'auto'
            content.prepend(titleNew)
            oldIconDom.prepend(titleOld)
            wrap.append(oldIconDom)
        }
    }
    let style = document.createElement('style')
    style.innerText = `.ea-iconfont-oldicon-preview {
         height: 400px;
         width: 400px;
    }
    .ea-iconfont-oldicon-preview svg {
         height: 400px !important;
         width: 400px !important;
    }`
    document.body.append(style)
    document.addEventListener('click', e=>{
        if(e.target.title === '编辑图标') {
            setTimeout(()=>{
                initOldIcon = document.querySelector('#J_icon_container svg').outerHTML
                document.querySelector('.mp-e2e-content.edit-dialog').style.overflow = 'hidden'
                oldIconDom = void 0
                watchFileChange()
            }, 1000)
        }
    })
})();