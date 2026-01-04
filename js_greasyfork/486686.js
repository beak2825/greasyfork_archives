// ==UserScript==
// @name         屏蔽CSDN文章推荐
// @namespace    https://katorly.work
// @version      0.1.0-alpha02
// @description  在CSDN博客文章详情页下方“推荐文章”区域屏蔽指定的文章、所有下载和所有“chatgpt”生成的文档.
// @author       Katorly
// @match        *://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/486686/%E5%B1%8F%E8%94%BDCSDN%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/486686/%E5%B1%8F%E8%94%BDCSDN%E6%96%87%E7%AB%A0%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(async function () {
    'use strict'

    const button = document.createElement("button")
    button.classList.add("operating")
    button.style.cssText = "height: 2rem; background-color: #1CF0ED; cursor: pointer; text-align: center; color: #FFF; border-radius: 50px;"
    button.type = "button"

    if (GM_getValue(window.location.pathname)) { // If blocked, disable content
        const blocker = document.createElement("div")
        const text = document.createElement("h2")
        blocker.style.cssText = "position: absolute; display: flex; justify-content: center; align-items: center; flex-direction: column; z-index: 999999; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #FCFCFC;"
        text.innerHTML = "此文章已被您屏蔽"
        button.style.cssText += "height: 2.5rem; margin: 1rem 0 0; width: 6.5rem;"
        button.innerHTML = "解除屏蔽"
        button.addEventListener("click", function (e) {
            e.preventDefault()
            GM.deleteValue(window.location.pathname)
            location.reload()
        })
        blocker.append(text, button)
        document.body.appendChild(blocker)
        document.body.style.overflow = "hidden"
    } else { // If not blocked, display block button and filter recommendation section
        button.style.width = "3.5rem"
        button.innerHTML = "屏蔽"
        button.addEventListener("click", function (e) {
            e.preventDefault()
            GM.setValue(window.location.pathname, true)
            location.reload()
        })
        document.querySelector(".operating").replaceWith(button)
        const list = Array.from(await GM.listValues())
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for recommendation section to load
        Array.from(document.getElementsByClassName("recommend-item-box")).forEach((item) => {
            if (item.classList.contains("type_download") || item.classList.contains("type_chatgpt")) {
                item.style.display = "none"
            } else {
                try {
                    if (list.includes(new URL(item.getAttribute("data-url")).pathname)) item.style.display = "none"
                } catch (t) {
                }
            }
        })
    }
})();