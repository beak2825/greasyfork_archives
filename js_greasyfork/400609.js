// ==UserScript==
// @name                Youtube: Hide Video
// @name:zh-TW          Youtube 隱藏影片
// @name:ja             Youtube ビデオを隠す
// @name:ko             Youtube 비디오 숨기기
// @name:ru             Youtube Скрыть видео
// @version             1.0.7
// @description         Make the video and images opacity lower.
// @description:zh-TW   使影片較為透明。
// @description:zh-CN   使视频较为透明。
// @description:ja      ビデオと画像の不透明度を低くします。
// @description:ko      비디오 및 이미지의 불투명도를 낮추십시오.
// @description:ru      Уменьшите непрозрачность видео и изображений.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://www.webwise.ie/wp-content/uploads/2015/10/youtube.png
// @match               https://www.youtube.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/400609/Youtube%3A%20Hide%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/400609/Youtube%3A%20Hide%20Video.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict'

    // icons made by https://www.flaticon.com/authors/pixel-perfect
    const on1 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m0 149.332031c0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031zm277.332031 0c0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938-47.0625 0-85.335938-38.273438-85.335938-85.335938zm0 0"/></svg>`
    const on2 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m362.667969 234.667969c-47.0625 0-85.335938-38.273438-85.335938-85.335938 0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938zm0-138.667969c-29.398438 0-53.335938 23.914062-53.335938 53.332031 0 29.421875 23.9375 53.335938 53.335938 53.335938 29.394531 0 53.332031-23.914063 53.332031-53.335938 0-29.417969-23.9375-53.332031-53.332031-53.332031zm0 0"/></svg>`
    const off1 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m149.332031 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0-138.667969c-29.394531 0-53.332031 23.914062-53.332031 53.332031 0 29.421875 23.9375 53.335938 53.332031 53.335938 29.398438 0 53.335938-23.914063 53.335938-53.335938 0-29.417969-23.9375-53.332031-53.335938-53.332031zm0 0"/></svg>`
    const off2 = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 0h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031 0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031zm-213.335938 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0 0"/></svg>`

    const textStyle = `
.switch {
    display: block;
    margin: auto 30px;
    cursor: pointer;
}
.switch[dark="true"] {
    fill: white;
}
.hide-set {
    transition: opacity 0.3s;
    opacity: 0.1;
}`

    const targets = [
        "img",
        "video",
        "#background",
        ".ytp-videowall-still-image"
    ]

    let updating = false
    let href = document.location.href

    css()

    observation()

    init(10)

    window.addEventListener("scroll", update, true)

    function init(times) {
        for (let i = 0; i < times; i++) {
            // switch
            setTimeout(addButton, 500 * i)
            // hide targets
            for (const target of targets) {
                setTimeout(() => hideTarget(`${target}:not(.hide-set)`), 500 * i)
            }
        }
        // show targets
        showTarget()
    }

    function addButton() {
        // check exist
        if (!!document.querySelector(".switch")) return
        // get parent
        const logoPanel = document.querySelector("ytd-topbar-logo-renderer#logo")
        if (!logoPanel) return
        // add button
        const button = document.createElement("span")
        button.classList.add("switch")
        button.innerHTML = switchSVG()
        button.addEventListener("click", onClick)
        logoPanel.parentNode.insertBefore(button, logoPanel.nextSibling)
        // add "dark" attribute
        const attDark = document.createAttribute("dark")
        attDark.value = isDark()
        button.setAttributeNode(attDark)
    }

    function isDark() {
        return document.querySelector("html").getAttribute("dark") === ""
    }

    function switchSVG() {
        const on = (!isDark() && !window.location.href.includes("watch?v=")) ? on1 : on2
        const off = (!isDark() && !window.location.href.includes("watch?v=")) ? off1 : off2
        return getToggle() ? on : off
    }

    function onClick() {
        GM_setValue("switch", !getToggle())
        this.innerHTML = switchSVG()
        init(3)
    }

    function hideTarget(target) {
        // check toggle
        if (!getToggle()) return
        // hide target
        document.querySelectorAll(target).forEach(t => {
            t.classList.add("hide-set")
        })
    }

    function getToggle() {
        return GM_getValue("switch", true)
    }

    function showTarget() {
        // check toggle
        if (getToggle()) return
        // show targets
        document.querySelectorAll(".hide-set").forEach(target => {
            target.classList.remove("hide-set")
        })
    }

    function update() {
        if (updating) return
        updating = true
        init(3)
        setTimeout(() => { updating = false }, 1000)
    }

    function css() {
        const style = document.createElement("style")
        style.type = "text/css"
        style.innerHTML = textStyle
        document.head.appendChild(style)
    }

    function observation() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (href != document.location.href) {
                    href = document.location.href
                    init(10)
                }
            })
        })
        const target = document.querySelector("body")
        const config = { childList: true, subtree: true }
        observer.observe(target, config)
    }

})()
