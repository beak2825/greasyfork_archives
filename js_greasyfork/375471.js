// ==UserScript==
// @name         loj exports
// @namespace    http://zhangzisu.cn/
// @version      0.3
// @description  LibreOJ Helper
// @author       ZhangZisu
// @match        https://loj.ac/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375471/loj%20exports.user.js
// @updateURL https://update.greasyfork.org/scripts/375471/loj%20exports.meta.js
// ==/UserScript==

function deselectCurrent() {
    var selection = document.getSelection()
    if (!selection.rangeCount) {
        return function () { }
    }
    var active = document.activeElement

    var ranges = []
    for (var i = 0; i < selection.rangeCount; i++) {
        ranges.push(selection.getRangeAt(i))
    }

    switch (active.tagName.toUpperCase()) {
        case 'INPUT':
        case 'TEXTAREA':
            active.blur()
            break

        default:
            active = null
            break
    }

    selection.removeAllRanges()
    return function () {
        selection.type === 'Caret' &&
            selection.removeAllRanges()

        if (!selection.rangeCount) {
            ranges.forEach(function (range) {
                selection.addRange(range)
            })
        }

        active &&
            active.focus()
    }
}

function format(message) {
    var copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C'
    return message.replace(/#{\s*key\s*}/g, copyKey)
}

function copy(text) {
    var debug, message, reselectPrevious, range, selection, mark, success = false
    try {
        reselectPrevious = deselectCurrent()

        range = document.createRange()
        selection = document.getSelection()

        mark = document.createElement('span')
        mark.textContent = text
        // reset user styles for span element
        mark.style.all = 'unset'
        // prevents scrolling to the end of the page
        mark.style.position = 'fixed'
        mark.style.top = 0
        mark.style.clip = 'rect(0, 0, 0, 0)'
        // used to preserve spaces and line breaks
        mark.style.whiteSpace = 'pre'
        // do not inherit user-select (it may be `none`)
        mark.style.webkitUserSelect = 'text'
        mark.style.MozUserSelect = 'text'
        mark.style.msUserSelect = 'text'
        mark.style.userSelect = 'text'

        document.body.appendChild(mark)

        range.selectNode(mark)
        selection.addRange(range)

        var successful = document.execCommand('copy')
        if (!successful) {
            throw new Error('copy command was unsuccessful')
        }
        success = true
    } catch (err) {
        try {
            window.clipboardData.setData('text', text)
            success = true
        } catch (err) {
            message = format('Copy to clipboard: #{key}, Enter')
            window.prompt(message, text)
        }
    } finally {
        if (selection) {
            if (typeof selection.removeRange == 'function') {
                selection.removeRange(range)
            } else {
                selection.removeAllRanges()
            }
        }

        if (mark) {
            document.body.removeChild(mark)
        }
        reselectPrevious()
    }

    return success
}

(function() {
    'use strict'

    if(/ - 题目 - /.test(document.title)){
        let pid = /([0-9]+)/.exec(location.pathname)[1]
        let btn = document.createElement("a")
        btn.classList.add("small", "ui", "purple", "button")
        btn.text = "导出"
        btn.onclick = async function(){
            let res = await fetch(`https://loj.ac/problem/${pid}/export`).then(res => (res.json()))
            if(!res.success){
                alert("导出失败")
            }else{
                let content = ""
                content += "## 题目描述\n" + res.obj.description + "\n\n"
                content += "## 输入格式\n" + res.obj.input_format + "\n\n"
                content += "## 输出格式\n" + res.obj.output_format + "\n\n"
                content += "## 样例数据\n" + res.obj.example + "\n\n"
                content += "## 限制与提示\n" + res.obj.limit_and_hint + "\n\n"

                let exported = {content, tags: res.obj.tags, title: res.obj.title}
                console.log(exported)
                let text = JSON.stringify(exported)
                console.log(text)
                copy(text)
                if(confirm("Problem data is exported to your clipboard. Download testdata?")){
                    window.open(`https://loj.ac/problem/${pid}/testdata/download`)
                }
            }
        }
        document.querySelector('body > div:nth-child(2) > div.ui.main.container > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1)').append(btn)
    }
})()