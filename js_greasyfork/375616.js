// ==UserScript==
// @name         尔雅考试助手
// @namespace    monospaced
// @version      0.1
// @description  尔雅期末考试自动答题。
// @author       MetaDef
// @match        *://*.chaoxing.com/exam/test/*
// @run-at       document-end
// @connect      flora.moe
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375616/%E5%B0%94%E9%9B%85%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375616/%E5%B0%94%E9%9B%85%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function() {
    'use strict';
    function lookup() {
        const q = document.querySelector('.Cy_TItle.clearfix').querySelector('.clearfix').innerText
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://flora.moe:3000',
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                data: JSON.stringify([q]),
                onload(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText))
                    } else {
                        console.log(response.responseText)
                        reject(new Error(`Bad status code ${response.status}`))
                    }
                },
                ontimeout() {
                    reject(new Error('Connection timeout'))
                }
            })
        })
    }
    const answerToIndex = {
        '\u221a': 0,
        '\u00d7': 1,
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3
    }
    function autoClick(answer) {
        answer = answer.trim()
        const panel = document.querySelector('.Cy_ulBottom.clearfix')
        const options = panel.querySelectorAll('input[type="radio"],input[type="checkbox"]')
        if (answer.length === 1) {
            options[answerToIndex[answer]].click()
        } else {
            [...answer].forEach(c => options[answerToIndex[c]].click())
        }
    }

    const ui = {}

    function findAnswer() {
        lookup().then(answer => {
            ui.content.innerHTML = answer.map(s => `
<strong style="font-weight: bold; font-size: 18px">答案：</strong>${s.answer}<br>
<strong style="font-weight: bold; font-size: 18px">原题题干：</strong><br><span style="font-size: 14px">${s.title}</span><br>
<strong style="font-weight: bold; font-size: 18px">原题选项：</strong><br><span style="font-size: 14px">${s.options}</span><br>`).join('')
            try {
                autoClick(answer[0].answer)
            } catch (e) {
                console.log('Cannot auto click:', e)
            }
        }).catch(error => {
            ui.content.innerText = error.toString()
        })
    }

    setTimeout(() => {
        const popup = document.createElement('div')
        popup.style.position = 'fixed'
        popup.style.top = '100px'
        popup.style.width = '200px'
        popup.style.height = '400px'
        popup.style.backgroundColor = 'lightyellow'
        popup.style.fontSize = '16px'
        popup.style.padding = '16px'
        popup.style.border = '1px solid black'
        document.body.appendChild(popup)

        const info = document.createElement('p')
        info.innerText = '提示：页面加载完后将会自动查询答案。如因故答案没有加载，请点击下面的「查询答案」按钮重新查询。'
        info.style.width = '150px'
        info.style.padding = '8px'
        info.style.fontSize = '12px'
        info.style.border = '1px solid black'
        info.style.backgroundColor = 'lightblue'
        info.style.marginBottom = '16px'
        popup.appendChild(info)

        const content = document.createElement('p')
        content.innerText = '答案在将会在这里显示'
        popup.appendChild(content)

        const btn = document.createElement('button')
        btn.innerText = '查询答案'
        btn.style.fontSize = '16px'
        popup.appendChild(btn)
        btn.onclick = findAnswer

        ui.popup = popup
        ui.content = content
        ui.btn = btn

        findAnswer()
    }, 500)
})();