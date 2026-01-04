// ==UserScript==
// @name         水源保障组模拟器
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  识别水源用户发言中的谐音词，追踪反贼的所有言论，不放过任何一个危害社区的言论
// @author       5ur01
// @match        https://shuiyuan.sjtu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_log
// @grant        GM_addStyle
// @require      https://unpkg.com/pinyin-pro
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487910/%E6%B0%B4%E6%BA%90%E4%BF%9D%E9%9A%9C%E7%BB%84%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/487910/%E6%B0%B4%E6%BA%90%E4%BF%9D%E9%9A%9C%E7%BB%84%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

let { pinyin } = pinyinPro;

function match(string, pattern, contextLength) {
    let patternStr = pattern.join('')
    let index = string.indexOf(patternStr)
    if (index != -1) {
        return Array.from({ length: pattern.length }, (_, i) => index + i)
    }
    let stringPos = 0
    let patternPos = 0
    let prevIsNotLetter = true
    let matchedPos = []
    while(true){
        if (patternPos == pattern.length) {
            if (pattern.length == 0 || contextLength <= 0 || stringPos - matchedPos[0] <= contextLength) {
                break
            } else {
                GM_log(matchedPos)
                stringPos = matchedPos[0] + 1
                patternPos = 0
                matchedPos = []
                prevIsNotLetter = false
                continue
            }
        }
        if (stringPos == string.length) {
            return []
        }
        let stringCur = string[stringPos].toLowerCase()
        let patternCur = pattern[patternPos]

        let isChinese = pinyin(stringCur) != stringCur

        let matchOne =
            (prevIsNotLetter || isChinese) ?
            pinyin(stringCur, { multiple: true, type: "array", pattern: "initial" }).some(c => c == patternCur)
        :false

        function isLetter(c) {
            return c.toLowerCase() != c.toUpperCase();
        }
        let isLetterCur = isLetter(stringCur)

        if (matchOne) {
            matchedPos.push(stringPos)
            stringPos = stringPos + 1
            patternPos = patternPos + 1
            prevIsNotLetter = !isLetterCur
        } else {
            stringPos = stringPos + 1
            prevIsNotLetter = !isLetterCur
        }
    }
    return matchedPos
}
function makeBold(string, pattern, contextLength) {
    let array = match(string, pattern, contextLength)
    let starts = [0].concat(array.map(value => value + 1))
    let ends = array.concat([string.length])
    return [array.length != 0, array.map((v, i, a) => string.substring(starts[i], ends[i]) + "<b>" + string[v] + "</b>").concat(string.substring(starts.at(-1), ends.at(-1))).join('')]
}


function divHoverme(content) {
    return "<span class=\"hoverme\">" + content + "</span>"
}
function divShowme(content) {
    return "<div class=\"showme\">" + content + "</div>"
}


(function () {
    'use strict';
    GM_addStyle(
        `
.showme {
  display: none;
}
.hoverme {
  color: gray;
  border:solid;
  border-radius: 2px;
  padding: 2px;
  margin: 2px;
}
.hoverme:hover + .showme {
  display: block;
  color: gray;
}`
    )
    let patterns = [["x", "j", "p"], ['p', 'l', 'y'], ['j', 'z', 'm'], ['b', 'x', 'l'], ['h', 'j', 't'], ['l', 'k', 'q'], ['zh', 'z', 'y'], ['z', 'z', 'y'], ['zh', 'zh', 'y'], ['z', 'zh', 'y'], ['w', 'j', 'b'], ['w', 'h', 'n'], ['m', 'z', 'd'], ['d', 'x', 'p']]
    let contextLength = 20
    function check(dom, contextLength) {
        let classDone = "done"
        if (!dom.className.includes(classDone)) {
            let extraHTML = ""
            patterns.forEach(
                pattern => {
                    let [matched, bold] = makeBold(dom.textContent, pattern, contextLength)
                    if (matched) {
                        dom.classList.add(classDone)
                        extraHTML += divHoverme(pattern.join('')) + divShowme(bold)
                    }
                }
            )
            if (extraHTML.length != 0) {
                dom.innerHTML += extraHTML
            }
        }
    }
    setInterval(
        () => {
            document.querySelectorAll("div.topic-body.clearfix > div.regular.contents > div.cooked")
                .forEach(x => check(x, contextLength))
            document.querySelectorAll("div.fps-topic > div.blurb.container")
                .forEach(x => check(x, contextLength))
        }
        , 1000)
})();