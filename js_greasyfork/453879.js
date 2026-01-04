// ==UserScript==
// @name         csdn文章全屏阅读
// @namespace
// @include      *://blog.csdn.net/*/article/details/*
// @version      0.2.1
// @description  csdn文章全屏阅读，开关在侧边工具栏中
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453879/csdn%E6%96%87%E7%AB%A0%E5%85%A8%E5%B1%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/453879/csdn%E6%96%87%E7%AB%A0%E5%85%A8%E5%B1%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==
GM_addStyle(`
    .blog-content-box.fullscreen {
        overflow: auto;
        padding: 20px max(20px, calc(50% - 600px));
    }
    .blog-content-box {overflow:auto}
    #go-fullscreen {
        font-size: 12px;
        line-height: 14px;
        color: #999aaa;
    }
`)
;
(function() {
	'use strict'

    window.onload = function() {
        const articleDOM = document.querySelector('.blog-content-box')

        const csdnSideToolbar = document.querySelector('.csdn-side-toolbar')
        const fsDOM = document.createElement('a')
        fsDOM.id = 'go-fullscreen'
        fsDOM.className = 'option-box'
        // fsDOM.innerHTML = `<span class="show-txt" style="display:flex;opacity:100;">全屏</span>`
        fsDOM.innerText = '全屏'
        const lastDOM = document.querySelector('.csdn-side-toolbar .option-box[data-type="gotop"]')
        csdnSideToolbar.insertBefore(fsDOM,lastDOM)

        document.getElementById('go-fullscreen').addEventListener('click', function(){
            goToFullScreen(articleDOM)
        })
        articleDOM.addEventListener('fullscreenchange', function() {
            const isArticleFullscreen = document.fullscreenElement === this
            if(!isArticleFullscreen) {
                if(this.classList.contains('fullscreen')) this.classList.remove('fullscreen')
            } else {
                if(!this.classList.contains('fullscreen')) this.classList.add('fullscreen')
            }
        })
    }

    function goToFullScreen(element) {
        element = element || document.body
        if (element.requestFullscreen) element.requestFullscreen()
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
        else if (element.msRequestFullscreen) element.msRequestFullscreen()
        else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
    }
})();