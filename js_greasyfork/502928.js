// ==UserScript==
// @name         编程猫 Kitten N 源码源码下载
// @namespace    https://s-lightning.github.io/
// @version      0.0.1
// @description  下载编程猫 Kitten N 已发布作品的源代码。
// @author       SLIGHTNING
// @match        http://shequ.codemao.cn/work/*
// @match        https://shequ.codemao.cn/work/*
// @match        http://kn.codemao.cn/player?*
// @match        https://kn.codemao.cn/player?*
// @icon         https://kn.codemao.cn/icon.ico
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/502928/%E7%BC%96%E7%A8%8B%E7%8C%AB%20Kitten%20N%20%E6%BA%90%E7%A0%81%E6%BA%90%E7%A0%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502928/%E7%BC%96%E7%A8%8B%E7%8C%AB%20Kitten%20N%20%E6%BA%90%E7%A0%81%E6%BA%90%E7%A0%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    "use strict"

    let originalJSONParse = JSON.parse
    JSON.parse = function () {
        let result = originalJSONParse.apply(this, arguments)
        if ("projectName" in result) {
            parent.postMessage(result, "http://shequ.codemao.cn")
            parent.postMessage(result, "https://shequ.codemao.cn")
        }
        return result
    }

    addEventListener("message", function (event) {
        const { data } = event
        if (typeof data == "object" && "type" in data && data.type == "ON_LOAD_SUCCESS") {
        }
        if (typeof data == "object" && "projectName" in data) {
            setDownload(data)
        }
    })

    function setDownload(data) {
        console.log("setDownload")

        let operationBar = document.querySelector(".r-work-c-player--player_fun")

        let downloadButton = document.createElement("span")
        Object.assign(downloadButton.style, {
            width: "46px",
            height: "46px",
            float: "right",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        })
        downloadButton.addEventListener("click", function () {
            let URL = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
            let a = document.createElement("a")
            a.href = URL
            a.download = data.projectName + ".bcmkn"
            a.click()
        })

        let iconElement = document.createElement("div")
        Object.assign(iconElement.style, {
            width: "24px",
            height: "24px",
            backgroundImage: "url('https://creation.codemao.cn/716/appcraft/IMAGE_yV_JxR01q_1723082430647.png')",
            backgroundSize: "contain",
        })

        downloadButton.appendChild(iconElement)
        operationBar.appendChild(downloadButton)
    }
})()
