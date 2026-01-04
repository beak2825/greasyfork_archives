// ==UserScript==
// @name         BZOJ exports
// @namespace    https://zhangzisu.cn/
// @version      0.2
// @description  Export problem data from BZOJ
// @author       ZhangZisu
// @match        https://www.lydsy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375472/BZOJ%20exports.user.js
// @updateURL https://update.greasyfork.org/scripts/375472/BZOJ%20exports.meta.js
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

    console.log(setInterval(() => {
        fetch('/')
    }, 60000))

    document.querySelector('body > center:nth-child(1) > div').remove()

    if(location.pathname === '/JudgeOnline/problem.php'){
        let id = /id=([0-9]+)/.exec(location.search)[1]
        if((id = parseInt(id))){
            let header = document.querySelector('body > center:nth-child(4)')
            if(id >= 1000 && id < 5000){
                let download = document.createElement("a")
                download.href = `https://lydsy.download/archive/${id}.zip`
                download.text = "Download"
                header.append("[")
                header.append(download)
                header.append("]")
            }

            let exp = document.createElement("a")
            exp.href = '#'
            exp.onclick = function (){
                let desc = document.querySelector('body > div:nth-child(6)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n\n')
                let input = document.querySelector('body > div:nth-child(8)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n\n')
                let output = document.querySelector('body > div:nth-child(10)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n\n')
                let samplein = document.querySelector('body > div:nth-child(12)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n')
                let sampleout = document.querySelector('body > div:nth-child(14)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n')
                let hint = document.querySelector('body > div:nth-child(16)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n\n')
                let source = document.querySelector('body > div:nth-child(18)').textContent.split('\n').map(x => x.trim()).filter(x => x.length).join('\n\n')
                let content =
                    `## Description
${desc}

## Input
${input}

## Output
${output}

## Sample Input
\`\`\`
${samplein}
\`\`\`

## Sample Output
\`\`\`
${sampleout}
\`\`\`

## Hint
${hint}

## Source
${source}
`

                let tags = ['BZOJ']
                let title = /[0-9]+: (.*)/.exec(document.querySelector('body > center:nth-child(4) > h2').textContent)[1]
                let exported = {content, tags, title}
                console.log(exported)
                let text = JSON.stringify(exported)
                console.log(text)
                copy(text)
                if(id >= 1000 && id < 5000 && confirm("Problem data is exported to your clipboard. Download testdata?")){
                    window.open(`https://lydsy.download/archive/${id}.zip`)
                }
            }
            exp.text = "Export"
            header.append("[")
            header.append(exp)
            header.append("]")
        }
    }
})();