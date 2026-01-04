// ==UserScript==
// @name         果壳选课优化
// @namespace    https://jwxk.ucas.ac.cn/
// @version      0.4
// @description  优化果壳选课界面
// @author       YoRHaHa
// @include        *//jwxkts2.ucas.ac.cn/courseManage/*
// @include        *//jwxkts2.ucas.ac.cn/score/yjs/all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ucas.ac.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450503/%E6%9E%9C%E5%A3%B3%E9%80%89%E8%AF%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450503/%E6%9E%9C%E5%A3%B3%E9%80%89%E8%AF%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setFullCourseVisible(visible) {
        console.log(visible)
        let body = document.querySelector("#regfrm > table > tbody")
        if (body === null) {
            return
        }
        if (visible === false) {
            visible = 'none'
        }
        else {
            visible = 'table-row'
        }
        for (let i = 0; i < body.childElementCount; i++) {
            let node = body.children[i]
            if (node.firstElementChild.firstElementChild.disabled) {
                node.style.display = visible
            }
        }
    }

    function createButton(id, innerHTML, onclick) {
        let button = document.createElement('button')
        button.id = id
        button.innerHTML = innerHTML
        button.setAttribute('class', 'btn btn-primary')
        button.setAttribute('type', 'submit')
        button.onclick = onclick
        return button
    }

    function showEnglishCourseButton() {
        let box = document.querySelector("#regfrm2 > div:nth-child(9)")
        if (box === null) {
            return
        }
        let bar = document.createElement('div')
        bar.style.marginBottom = '4px'
        box.appendChild(bar)

        let button = createButton('jump-1', '跳转英语课',function() {
            document.querySelector("#id_915").checked = true
            document.querySelector("#regfrm2 > div:nth-child(9) > button").click()
        })
        button.style.marginRight = '4px'
        box.appendChild(button)

        button = createButton('jump-2', '跳转新中特/自辩',function() {
            document.querySelector("#id_964").checked = true
            document.querySelector("#regfrm2 > div:nth-child(9) > button").click()
        })
        button.style.marginRight = '4px'
        box.appendChild(button)

        button = createButton('jump-3', '跳转学术通论',function() {
            document.querySelector("#id_945").checked = true
            document.querySelector("#regfrm2 > div:nth-child(9) > button").click()
        })
        button.style.marginRight = '4px'
        box.appendChild(button)

        button = createButton('jump-4', '跳转工程伦理',function() {
            document.querySelector("#id_958").checked = true
            document.querySelector("#regfrm2 > div:nth-child(9) > button").click()
        })
        button.style.marginRight = '4px'
        box.appendChild(button)
    }

    function showCourseCount() {
        let body = document.querySelector("#regfrm > table > tbody")
        if (body === null) {
            return
        }
        let count = 0
        for (let i = 0; i < body.childElementCount; i++) {
            let node = body.children[i]
            if (!node.firstElementChild.firstElementChild.disabled) {
                count++
            }
        }
        let node = document.querySelector("#main-content > div > div.m-cbox.m-lgray > div.mc-body > div.alert-danger")
        node.innerHTML = node.innerHTML + '<br/>当前可选课程数量：' + count + '/' + body.childElementCount
    }

    function showVisibleSelector() {
        let node = document.querySelector("#main-content > div > div.m-cbox.m-lgray > div.mc-body > div.alert-danger")
        let selector = document.createElement('input')
        selector.setAttribute('type', 'checkbox')
        selector.setAttribute('name', 'full-visible')
        selector.setAttribute('id', 'visible-checkbox')
        selector.checked = false
        selector.onclick = function() {
            setFullCourseVisible(selector.checked)
        }
        selector.style.marginLeft = '12px'
        selector.onclick()
        node.appendChild(selector)
        let label = document.createElement('label')
        label.setAttribute('for', 'visible-checkbox')
        label.innerHTML = '显示已选满的课程'
        node.appendChild(label)
    }

    function showScore() {
        let lesson_list = {}
        let score_list = []
        fetch('https://jwxkts2.ucas.ac.cn/score/yjs/all.json')
            .then(response => response.text())
            .then(text => {
            lesson_list = eval('(' + text + ')').list
            for (let lesson of lesson_list) {
                score_list.push(lesson.score)
            }
            let idx = 1
            while (true) {
                let grid = document.querySelector("#main-content > div > div.m-cbox.m-lgray > div.mc-body > table > tbody > tr:nth-child(" + idx + ") > td:nth-child(3)")
                if (grid == null) {
                    break
                }
                grid.innerHTML = score_list[idx - 1]
                idx += 1
            }
        })
            .catch(error => console.error(error));
    }

    function start() {
        let url = window.parent.location.href
        console.log('url: ' + url)
        if (url === 'https://jwxkts2.ucas.ac.cn/courseManage/main') {
            showEnglishCourseButton()
        }
        if (url === 'https://jwxkts2.ucas.ac.cn/score/yjs/all') {
            showScore()
        }
        if (url.startsWith('https://jwxkts2.ucas.ac.cn/courseManage/selectCourse?s=')) {
            showCourseCount()
            showVisibleSelector()
            document.querySelector("#regfrm > div > button:nth-child(4)").style.marginRight = '32px'
        }
    }
    setTimeout(start, 50)
})();