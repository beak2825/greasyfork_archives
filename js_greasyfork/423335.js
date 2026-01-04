// ==UserScript==
// @name         开课吧直播回复助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  直播右键回复助手
// @author       WumaCoder/BBK
// @match        https://play.kaikeba.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423335/%E5%BC%80%E8%AF%BE%E5%90%A7%E7%9B%B4%E6%92%AD%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/423335/%E5%BC%80%E8%AF%BE%E5%90%A7%E7%9B%B4%E6%92%AD%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('start Kaikeba')

    const sleep = (inter) => new Promise( resolve => setTimeout(resolve, inter))

    window.onload = async () => {
        let wrapper = null

        while(!wrapper){
            wrapper = document.querySelector('#bsy-msg-container')
            await sleep(100)
        }

        wrapper.addEventListener('contextmenu',function(e){
            e.preventDefault();

            const itemMsg = findMsgItem(e, 'new-item_msg-item')
            const itemWidth = itemMsg.clientWidth
            const itemMsgText = itemMsg.textContent.split("：")
            const sendMsg = `@${itemMsgText[0]}\n${itemMsgText[1]}\n${'.'.repeat(itemWidth/4)}\n`

            const textarea = document.querySelector("textarea")
            textarea.value = sendMsg
            textarea.focus()
        })

        const findMsgItem = ({path}, m) => {
            for(let i=0; i<path.length; i++){
                if(path[i].className.includes(m)){
                    return path[i]
                }
            }
            return null
        }

    }


    // Your code here...
})();