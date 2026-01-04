// ==UserScript==
// @name         【绅士向】比特球云盘番号查询快捷按钮
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  番号查询快捷按钮，适用于文件名中包含AAA-000，aaa000，aaa 000以及后缀为mkv|avi|mp4|flv等文件
// @license MIT
// @author       BW
// @match        https://pan.bitqiu.com/*
// @icon         https://pan.bitqiu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439463/%E3%80%90%E7%BB%85%E5%A3%AB%E5%90%91%E3%80%91%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%E7%95%AA%E5%8F%B7%E6%9F%A5%E8%AF%A2%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/439463/%E3%80%90%E7%BB%85%E5%A3%AB%E5%90%91%E3%80%91%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%E7%95%AA%E5%8F%B7%E6%9F%A5%E8%AF%A2%E5%BF%AB%E6%8D%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    "use strict"
    var targetNodes = []
    var regArr = [/[A-Z-a-z-]+[\d]+/g, /[A-Za-z]+[\d]+/g, /[A-Za-z\s]+[\d]+/g]


    function matchAVNumber(str) {
        var name = str.trim().slice(0, -4)
        for (var i = 0;i < regArr.length;i++) {
            if (regArr[i].test(name)){

                return name.match(regArr[i])[0]
            }
        }
    }

    function getNode() {
        var numberList = document.querySelector(".file-list-content.list").childNodes
        targetNodes = []
        numberList.forEach(function (node) {
            var str = node.children[0].innerText
            // 匹配视频文件
            if (/mp4|flv|mkv|avi/g.test(str)) {
                var number = matchAVNumber(str)
                if (number) {
                    node.number = number
                    targetNodes.push(node)
                }
            }
        })
        generateLinkToJavDB(targetNodes)
    }



    function generateLinkToJavDB(nodes) {
        nodes.forEach(function (node) {
            var number = node.number
            var button = document.createElement("button")
            button.innerHTML = "查询番号"
            button.style.position = "absolute"
            button.style.top = "50%"
            button.style.right = "10px"
            button.style.transform = "translateY(-50%)"
            button.style.background = "#0574ff"
            button.style.border = "none"
            button.style.color = "#fff"
            button.style.minWidth = "72px"
            button.style.padding = "0 16px"
            button.style.lineHeight = "30px"
            button.style.height = "32px"
            button.style.borderRadius = "4px"
            button.style.cursor = "pointer"
            button.style.fontSize = "14px"
            button.style.whiteSpace = "nowrap"
            button.onclick = function (e) {
                linkToJavDB(number)
                e.preventDefault()
                e.stopPropagation()
            }
            node.appendChild(button)
        })
    }

    function linkToJavDB(number) {
        window.open("https://javdb.com/search?q=" + number)
    }

    var _historyWrap = function (type) {
        var orig = history[type]
        var e = new Event(type)
        return function () {
            var rv = orig.apply(this, arguments)
            e.arguments = arguments
            window.dispatchEvent(e)
            return rv
        }
    }

    history.pushState = _historyWrap("pushState")
    history.replaceState = _historyWrap("replaceState")

    setTimeout(function () {
        getNode()
    }, 1000)

    window.addEventListener("hashchange", function () {
        setTimeout(function () {
            getNode()
        }, 1000)
    })

    window.addEventListener("pushState", function () {
        setTimeout(function () {
            getNode()
        }, 1000)
    })

    window.addEventListener("replaceState", function () {
        setTimeout(function () {
            getNode()
        }, 1000)
    })

    window.addEventListener("popstate", function () {
        setTimeout(function () {
            getNode()
        }, 1000)
    })
})()