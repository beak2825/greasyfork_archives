// ==UserScript==
// @name         csdn阅读模式
// @namespace
// @include      *://blog.csdn.net/*/article/details/*
// @version      0.0.9
// @description  csdn阅读模式，隐藏左右栏
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453678/csdn%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453678/csdn%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    .blog-content-box.fullscreen {
        overflow: auto;
        padding: 20px max(20px, calc(50% - 600px));
    }
    .read-model .recommend-right,
    .read-model .blog_container_aside {display:none}
    .blog-content-box {overflow:auto}
    .m-helper-box {
        position: fixed;
        bottom: 20px;
        right:20px;
        width:40px;
        padding:4px;
        box-shadow: 0 0 4px 0px #000;
        background-color:#fff;
        z-index:10000;
    }
    .m-menu-btn {
        cursor:pointer;
        display:block;
        padding: 0px 4px;
        border: 1px solid #999;
        border-radius: 4px;
        background-color:#F2F3F5;
        color:#636569;
        text-align:center;
    }
    .m-menu-btn + .m-menu-btn {margin-top:4px}
`)
;
(function() {
	'use strict'
    let htmlDOM, bodyDOM, articleDOM
 
    window.onload = function() {
        initDOM()
        const csdnSideToolbar = document.querySelector('.csdn-side-toolbar')
        const fsDOM = document.createElement('a')
        fsDOM.id = 'go-fullscreen'
        fsDOM.className = 'option-box'
        fsDOM.innerHTML = `<span class="show-txt" style="display:flex;opacity:100;">全屏</span>`
        const lastDOM = document.querySelector('.csdn-side-toolbar .option-box[data-type="gotop"]')
        csdnSideToolbar.insertBefore(fsDOM,lastDOM)
        
        // let div = document.createElement('div')
        // div.className = 'm-helper-box'
        // let btn1 = document.createElement('span')
        // btn1.innerHTML = 'H'
        // btn1.id = 'menu-trigger-topmenu'
        // btn1.className = 'm-menu-btn'
        // let btn2 = document.createElement('span')
        // btn2.innerHTML = 'F11'
        // btn2.id = 'menu-fullscreen'
        // btn2.className = 'm-menu-btn'
        // div.appendChild(btn1)
        // div.appendChild(btn2)
        // document.body.appendChild(div)
        // document.getElementById("menu-trigger-topmenu").addEventListener("click", function(){
        //     const curr = this.innerHTML
        //     if(curr === 'H') {
        //         triggerReadModel(false)
        //         this.innerHTML = 'S'
        //     } else {
        //         triggerReadModel(true)
        //         this.innerHTML = 'H'
        //     }
        // })
        document.getElementById("go-fullscreen").addEventListener("click", function(){
            goToFullScreen(articleDOM)
        // document.getElementById("menu-fullscreen").addEventListener("click", function(){
            // const curr = this.innerHTML
            // if(curr === 'F11') {
            //     goToFullScreen(articleDOM)
            //     this.innerHTML = 'Esc'
            // } else {
            //     goExitFullscreen(articleDOM)
            //     this.innerHTML = 'F11'
            // }
        })
        articleDOM.addEventListener('fullscreenchange', function() {
            const isArticleFullscreen = document.fullscreenElement === this
            if(!isArticleFullscreen) {
                // document.getElementById("menu-fullscreen").innerHTML = 'F11'
                if(this.classList.contains('fullscreen')) this.classList.remove('fullscreen')
            } else {
                if(!this.classList.contains('fullscreen')) this.classList.add('fullscreen')
            }
        })
    }
    
    function initDOM() {
        if(!bodyDOM) bodyDOM = document.querySelector('body')
        if(!articleDOM) articleDOM = document.querySelector('.blog-content-box')
        if(!htmlDOM) {
            htmlDOM = document.querySelector('html')
            if(!htmlDOM.classList.contains('m-helper')) htmlDOM.classList.add('m-helper')
        }
    }

    // function triggerReadModel(bool) {
    //     // hide
    //     if(!bool && !bodyDOM.classList.contains('read-model')) {
    //         bodyDOM.classList.add('read-model')
    //     }
    //     // show
    //     if(bool && bodyDOM.classList.contains('read-model')) {
    //         bodyDOM.classList.remove('read-model')
    //     }
    // }

    function goToFullScreen(element) {
        element = element || document.body
        if (element.requestFullscreen) {
            element.requestFullscreen()
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen()
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen()
        }
    }
    function goExitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
 
})();