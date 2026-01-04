// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-01-18
// @author       You
// @description  null
// @match        https://shuiyuan.sjtu.edu.cn/t/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_log
// @grant        GM_addStyle
// @require      https://unpkg.com/pinyin-pro
// @license      GPL-3.0
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/486067/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/486067/New%20Userscript.meta.js
// ==/UserScript==

let { pinyin } = pinyinPro;

function match(string, pattern, contextLength) {
    let patternStr = pattern.join('')
    let index = string.indexOf(patternStr)
    if (index != -1) {
        return Array.from({ length: pattern.length }, (_, i) => index + i)
    }
    function matchImpl(stringPos, patternPos, matchedPos, prevIsNotLetter) {
        if (patternPos == pattern.length) {
            if (pattern.length == 0 || contextLength <= 0 || stringPos - matchedPos[0] <= contextLength) {
                return matchedPos
            } else {
                return matchImpl(matchedPos[0] + 1, 0, [], !isLetter(matchedPos[0]))
            }
        }
        if (stringPos == string.length) {
            return []
        }
        function stringCur() {
            return string[stringPos].toLowerCase()
        }
        function patternCur() {
            return pattern[patternPos]
        }
        function isChinese() {
            return pinyin(stringCur()) != stringCur()
        }
        function matchOne() {
            if (prevIsNotLetter || isChinese()) {
                return pinyin(stringCur(), { multiple: true, type: "array", pattern: "initial" }).some(c => c == patternCur())
            }
            return false
        }
        function isLetter(c) {
            return c.toLowerCase() != c.toUpperCase();
        }
        function isLetterCur() {
            return isLetter(stringCur())
        }
        if (matchOne()) {
            matchedPos.push(stringPos)
            return matchImpl(stringPos + 1, patternPos + 1, matchedPos, !isLetterCur())
        } else {
            return matchImpl(stringPos + 1, patternPos, matchedPos, !isLetterCur())
        }
    }
    return matchImpl(0, 0, [], true)
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
        }
        , 1000)
})();