// ==UserScript==
// @name        BlitzRhythm Editor Mod Loader
// @name:zh-CN  闪韵灵境谱面编辑器 模组加载器
// @namespace   cipher-editor-mods-loader
// @version     1.1.4
// @description A BlitzRhythm Editor Mod Loader
// @description:zh-CN  一款《闪韵灵境》谱面编辑器的Mod加载器
// @author      Moyuer
// @author:zh-CN 如梦Nya
// @license     MIT
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     beatsaver.com
// @connect     gitmirror.com
// @connect     githubusercontent.com
// @match       https://cipher-editor-cn.picovr.com/*
// @match       https://cipher-editor-va.picovr.com/*
// @icon        https://cipher-editor-va.picovr.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/474681/BlitzRhythm%20Editor%20Mod%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/474681/BlitzRhythm%20Editor%20Mod%20Loader.meta.js
// ==/UserScript==

let htmlSrc = "https://raw.githubusercontent.com/CMoyuer/BlitzRhythm-Editor-Mod-Loader/main/ModLoaderDrawer/dist/index.html"

if (getLanguage() === "zh")
    htmlSrc = "https://raw.gitmirror.com/CMoyuer/BlitzRhythm-Editor-Mod-Loader/main/ModLoaderDrawer/dist/index.html"
if (GM_info.script.namespace.endsWith("-dev"))
    htmlSrc = "http://127.0.0.1"

/** @type {HTMLElement} */
let modloaderBox
/** @type {HTMLElement} */
let divMask
/** @type {HTMLElement} */
let iframe

function initModloaderBox() {
    if (modloaderBox) return
    modloaderBox = document.createElement("div")
    modloaderBox.style = "position:absolute;width:100%;height:100%;top:0;left:0;z-index:9001;pointer-events:none;"

    divMask = document.createElement("div")
    divMask.style = "width:100%;height:100%;background-color:#00000050;display:none;pointer-events:auto;"
    divMask.onclick = hideIframe
    modloaderBox.append(divMask)

    iframe = document.createElement("iframe")
    modloaderBox.id = "modloaderIframe"
    iframe.style = "box-shadow: 0 0 10px 0 black;border:none;width:360px;height:100vh;position:fixed;right:0;top:0;bottom:0;transform:translateX(100%);z-index:9999;transition: transform 0.3s ease-in-out;pointer-events: auto;"
    let loadHtml = () => {
        let url = htmlSrc + "?t=" + new Date().getTime()
        console.log("ModLoader loading html from:", url)
        GM_xmlhttpRequest({
            url,
            method: "GET",
            timeout: 10 * 1000,
            onload: res => {
                iframe.srcdoc = res.response
                console.log("ModLoader load html success!")
            },
            onerror: res => {
                console.error("ModLoader load html failed:", res)
                setTimeout(loadHtml, 1000)
            },
            ontimeout: res => {
                console.error("ModLoader load html timeout")
                loadHtml()
            }
        })
    }
    loadHtml()
    modloaderBox.append(iframe)
    document.body.append(modloaderBox)
}

function showIframe() {
    divMask.style.display = "block"
    iframe.style.transform = "translateX(0)"
}

function hideIframe() {
    divMask.style.display = "none"
    iframe.style.transform = "translateX(100%)"
}

function initShowButton() {
    let btnShow = document.createElement("div")
    btnShow.id = "btnModLoaderShow"
    btnShow.innerHTML = "M"
    btnShow.style = "position:absolute;transform:translate(-50%, -50%);left:calc(100vw - 50px);top:calc(100vh - 50px);width:50px;height: 50px;background-color:#2196F3;border-radius:25px;z-index:9000;font-size:1.5em;line-height:50px;text-align:center;color:white;font-family:Roboto,Helvetica,Arial,sans-serif;box-shadow: 0 0 6px 0 gray;user-select:none;"
    let info = {
        handle: 0,
        mousedown: false,
        dragging: false,
        canClick: true,
        rawPos: [0, 0],
        position: [0, 0],
    }

    function getMoveDistance() {
        return Math.abs(info.position[0] - info.rawPos[0]) + Math.abs(info.position[1] - info.rawPos[1])
    }

    btnShow.onmousedown = res => {
        btnShow.style.backgroundColor = "#1769AA"
        info.canClick = true
        info.mousedown = true
        info.handle = setTimeout(() => {
            btnShow.style.boxShadow = "0 0 6px 2px white"
            info.dragging = true
            info.handle = 0
        }, 100)
        if (btnShow.style.left && btnShow.style.left.startsWith("calc"))
            btnShow.style.left = btnShow.offsetLeft + "px"
        if (btnShow.style.top && btnShow.style.top.startsWith("calc"))
            btnShow.style.top = btnShow.offsetTop + "px"
        info.rawPos = [btnShow.offsetLeft, btnShow.offsetTop]
        info.position = [res.clientX, res.clientY]
    }
    btnShow.onmousemove = res => {
        if (!info.dragging) return
        let x = res.clientX
        let y = res.clientY
        let deltaX = x - info.position[0]
        let deltaY = y - info.position[1]
        let left = parseInt(btnShow.style.left || 0)
        let top = parseInt(btnShow.style.top || 0)
        btnShow.style.left = left + deltaX + 'px'
        btnShow.style.top = top + deltaY + 'px'
        info.position = [x, y]
    }
    btnShow.onmouseup = btnShow.onmouseleave = () => {
        btnShow.style.backgroundColor = "#2196F3"
        btnShow.style.boxShadow = "0 0 6px 0 gray"
        if (info.handle > 0) {
            clearTimeout(info.handle)
            info.handle = 0
        }
        info.canClick = !info.dragging
        info.mousedown = false
        info.dragging = false
    }
    btnShow.onclick = () => {
        if (!info.canClick) return
        showIframe()
    }

    window.onresize = () => {
        let left = parseInt(btnShow.style.left || 0)
        let top = parseInt(btnShow.style.top || 0)
        if (window.innerWidth < left + 50)
            btnShow.style.left = "calc(100vw - 50px)"
        if (window.innerHeight < top + 50)
            btnShow.style.top = "calc(100vh - 50px)"
    }

    document.body.appendChild(btnShow)
}

function getLanguage() {
    let language = localStorage.getItem("i18nextLng") ?? "en"
    if (/^zh-?/.test(language)) language = "zh"
    return language
}

(function () {
    'use strict'
    initModloaderBox()

    let handle = setInterval(() => {
        if (!unsafeWindow.modloader) return
        unsafeWindow.modloader.drawer = {
            methods: {
                show: showIframe,
                hide: hideIframe
            }
        }
        initShowButton()
        clearInterval(handle)
    }, 100)
})();