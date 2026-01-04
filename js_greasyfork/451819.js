// ==UserScript==
// @name         拉勾教育学习助手
// @namespace
// @include      https://kaiwu.lagou.com/course/courseInfo.htm?courseId=*
// @version      0.0.7
// @description  拉勾教育学习助手，隐藏标题，全屏阅读
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451819/%E6%8B%89%E5%8B%BE%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451819/%E6%8B%89%E5%8B%BE%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
GM_addStyle(`
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

    .m-helper .pc-header {display:none}
    .m-helper .pub-header {top:0}
    .m-helper .content-wrap .left-content-wrap {top:0}
    .m-helper .content-wrap .right-content-wrap {
        margin-top:0;
        height:unset !important;
    }
`)
;
(function() {
	'use strict'
    let courseDetailDOM
    function getCourseDetailDOM() {
        if(!courseDetailDOM) {
            courseDetailDOM = document.querySelector('.pc-detail-wrap')
        }
    }

    window.onload = function() {
        getCourseDetailDOM()

        let div = document.createElement('div')
        div.className = 'm-helper-box'
        let btn1 = document.createElement('span')
        btn1.innerHTML = 'H'
        btn1.id = 'menu-trigger-topmenu'
        btn1.className = 'm-menu-btn'
        let btn2 = document.createElement('span')
        btn2.innerHTML = 'F11'
        btn2.id = 'menu-fullscreen'
        btn2.className = 'm-menu-btn'
        div.appendChild(btn1)
        div.appendChild(btn2)
        document.body.appendChild(div)
        document.getElementById("menu-trigger-topmenu").addEventListener("click", function(){
            const curr = this.innerHTML
            if(curr === 'H') {
                hideTopMenu()
                this.innerHTML = 'S'
            } else {
                showTopMenu()
                this.innerHTML = 'H'
            }
        })
        document.getElementById("menu-fullscreen").addEventListener("click", function(){
            const curr = this.innerHTML
            if(curr === 'F11') {
                goToFullScreen()
                this.innerHTML = 'Esc'
            } else {
                goExitFullscreen()
                this.innerHTML = 'F11'
            }
        })
    }
    function hideTopMenu() {
        getCourseDetailDOM()
        if(!courseDetailDOM.classList.contains('m-helper')) {
            courseDetailDOM.classList.add('m-helper')
        }
    }
    function showTopMenu() {
        getCourseDetailDOM()
        if(courseDetailDOM.classList.contains('m-helper')) {
            courseDetailDOM.classList.remove('m-helper')
        }
    }
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