// ==UserScript==
// @name         Twitcasting Easy Send
// @namespace    https://twitter.com/72chihyaKR
// @version      1.01
// @description  트윗캐스팅에서 엔터키를 전송으로, Ctrl+엔터키를 줄바꿈으로 변경합니다.
// @author       72chihya
// @match        https://twitcasting.tv/*
// @exclude      https://twitcasting.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitcasting.tv
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/465439/Twitcasting%20Easy%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/465439/Twitcasting%20Easy%20Send.meta.js
// ==/UserScript==


const handleEvent = (e) => {
    const area = document.querySelectorAll(".tw-comment-post textarea.tw-textarea")[0]
    const button = document.querySelectorAll(".tw-comment-post button.tw-button-primary")[0]

    if(!area || !button || document.activeElement !== area){
        return
    }

    if(e.keyCode === 13){
        e.preventDefault()

        if(e.ctrlKey){
            var currentValue = area.value
            var caretPosition = area.selectionStart
            var newValue = currentValue.substring(0, caretPosition) + '\n' + currentValue.substring(caretPosition)
            area.value = newValue
            area.selectionStart = caretPosition + 1
            area.selectionEnd = caretPosition + 1
        }else{
            if(area.value !== ""){
                button.click()
            }
        }
    }
}

(function() {
    'use strict'

    document.addEventListener("keydown", handleEvent)
})();