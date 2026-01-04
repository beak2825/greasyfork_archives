// ==UserScript==
// @name                Plurk 搜尋偷偷說
// @version             1.0.10
// @description         搜尋偷偷說的噗
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/NobhW0E.png
// @match               https://www.plurk.com/anonymous
// @grant               GM.getValue
// @grant               GM.setValue
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/443128/Plurk%20%E6%90%9C%E5%B0%8B%E5%81%B7%E5%81%B7%E8%AA%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/443128/Plurk%20%E6%90%9C%E5%B0%8B%E5%81%B7%E5%81%B7%E8%AA%AA.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict"

    const isAutoOpen = true
    const interval = 60000
    const KEYS = ["徵友", "徵男"]
    const URL = "https://www.plurk.com/Stats/getAnonymousPlurks?lang=zh&offset=0&limit=1000"
    const READ = "#a849ff"
    const STYLE = `
.filterWrap {
    position: fixed;
    display: flex;
    left: 25px;
    bottom: 25px;
}
.filterButton {
    display: flex;
    min-width: 70px;
    height: 30px;
    margin-right: 10px;
    justify-content: center;
}`

    let wrap

    css()

    init()

    async function init() {
        createWrap()
        while(true) {
            getAnonymousPlurks()
            await new Promise(r => setTimeout(r, interval))
        }
    }

    function createWrap() {
        wrap = document.createElement("div")
        wrap.className = "filterWrap"
        document.body.append(wrap)
    }

    function getAnonymousPlurks() {
        $.ajax({
            url: URL,
            dataType: "json",
            success: onResult
        });
    }

    function onResult(data) {
        if (!data) return
        let noMatch = true
        Object.keys(data).forEach(key => {
            if (!data[key]) return
            if (!data[key].content) return
            let isMatch = false
            KEYS.forEach(word => {
                if (!isMatch && data[key].content.includes(word)) {
                    noMatch = false
                    isMatch = true
                    const name = parseInt(data[key].id).toString(36)
                    const url = `https://www.plurk.com/p/${name}`
                    createButton(name, url)
                }
            })
        })
        if (!noMatch) return
        if (!!document.querySelectorAll(".filterButton").length) return
        createButton("沒有", "")
    }

    function createButton(name, url) {
        if (!wrap) return
        const className = name === "沒有" ? "nothing" : `_${name}`
        if (!!document.querySelector(`.${className}`)) return
        const button = document.createElement("button")
        button.className = `filterButton ${className}`
        button.innerHTML = name
        if (!!url) {
            document.querySelectorAll(".nothing").forEach(nothing => nothing.remove())
            button.addEventListener("click", () => {
                GM.setValue(name, true)
                button.style.background = READ
                window.open(url)
            })
        }
        alreadyRead(button, name)
        wrap.append(button)
    }

    async function alreadyRead(button, name) {
        const isNothing = name === "沒有"
        const isRead = await GM.getValue(name, false)
        if (isNothing || isRead) button.style.background = READ
        else if (isAutoOpen) button.click()
    }

    function css() {
        const style = document.createElement("style")
        style.type = "text/css"
        style.innerHTML = STYLE
        document.head.appendChild(style)
    }

})();
