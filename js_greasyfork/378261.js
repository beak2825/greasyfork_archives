// ==UserScript==
// @name         BZOJ 输入样例复制
// @namespace    https://rqy.moe/
// @version      0.1
// @description  添加复制 BZOJ 输入样例的按钮 ( 再也不用担心诡异的多余空行辣 )
// @author       _rqy
// @match        http*://*lydsy.com/JudgeOnline/problem.php*
// @lincense     WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378261/BZOJ%20%E8%BE%93%E5%85%A5%E6%A0%B7%E4%BE%8B%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/378261/BZOJ%20%E8%BE%93%E5%85%A5%E6%A0%B7%E4%BE%8B%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

// The function "deselectCurrent", "format" and "copy" below are copied from "BZOJ exports".
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

    let btn_div = document.createElement('div')
    btn_div.style = 'font-size: 15px; color: black'
    let btn = document.createElement('a')
    btn.href = 'javascript:void();'
    btn.text = 'Copy Input'
    btn.onclick = function() {
        let input_val = document.querySelector('body > div:nth-child(11)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n')
        console.log(input_val)
        copy(input_val)
    }
    document.querySelector('body > h2:nth-child(10)').append(btn_div)
    btn_div.append('[')
    btn_div.append(btn)
    btn_div.append(']')
})();