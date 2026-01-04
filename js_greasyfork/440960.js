// ==UserScript==
// @name         Bilibili内嵌字幕遮盖
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       huangyuanxin
// @match        *://www.bilibili.com/*
// @grant        none
// @license      MIT
// @description 支持列表：老友记
// @downloadURL https://update.greasyfork.org/scripts/440960/Bilibili%E5%86%85%E5%B5%8C%E5%AD%97%E5%B9%95%E9%81%AE%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440960/Bilibili%E5%86%85%E5%B5%8C%E5%AD%97%E5%B9%95%E9%81%AE%E7%9B%96.meta.js
// ==/UserScript==

(function() {
   "use strict"
    var {lyj,ldsh,nd} = {
        lyj:{//老友记
            height:"10vh",
            bottom:"0"
        },
        ldsh:{//伦敦生活
            height:"12vh",
            bottom:"0"
        },
        nd:{//诺顿秀
            height:"14vh",
            bottom:"0"
        }
    }
    var config = lyj//把这里更换成上面的对应的英文
    //创建遮罩
    var frame = document.createElement("div")
    frame.innerHtml = "遮罩"
    frame.style.position = "absolute"
    frame.style.width = "100%"
    frame.style.backgroundColor = "rgba(0,0,0,1)"
    frame.style.height = config.height
    frame.style.bottom = config.bottom
    frame.style.zIndex = 100
    //创建开关按钮
    var button = document.createElement("button")
    button.innerHTML = "开关"
    button.style.right = 0
    button.style.top = "50%"
    button.style.position = "absolute"
    button.style.backgroundColor = "#4CAF50"
    button.style.border = 0
    //等待组件加载完成之后添加子节点
    var timer = setInterval(function() {
        var video = document.getElementsByClassName("bpx-player-video-wrap")[0]
        if (video !== undefined) {
            clearInterval(timer)
            video.appendChild(frame)
            video.appendChild(button)
        }
    }, 300)


    button.addEventListener("click", function(e) {
        e.stopPropagation()
        if (frame.style.display !== "none") {
            button.innerHTML = "打开遮罩"
            frame.style.display = "none"
        } else {
            button.innerHTML = "关闭遮罩"
            frame.style.display = ""
        }
    })
})();