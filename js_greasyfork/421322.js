// ==UserScript==
// @name         我們的浮游城 顯示剩餘時間
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  顯示剩餘時間
// @author       stanly
// @include      https://ourfloatingcastle.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/403344-moment-js-v2-25-3/code/Momentjs%20v2253.js?version=805187
// @downloadURL https://update.greasyfork.org/scripts/421322/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E9%A1%AF%E7%A4%BA%E5%89%A9%E9%A4%98%E6%99%82%E9%96%93.user.js
// @updateURL https://update.greasyfork.org/scripts/421322/%E6%88%91%E5%80%91%E7%9A%84%E6%B5%AE%E6%B8%B8%E5%9F%8E%20%E9%A1%AF%E7%A4%BA%E5%89%A9%E9%A4%98%E6%99%82%E9%96%93.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    // Your code here...
    function init() {
        let code = document.querySelector('code')
        let parent = code.parentElement
        let completetime = moment(code.textContent, 'MM/DD HH:mm:ss').format('x')
        let timeleft = moment.duration(Math.abs(completetime-Date.now()))
        let text = document.createTextNode(formatms(timeleft))
        parent.insertBefore(text,code.nextSibling)

        update()
    }

    function update() {
        let myTime = document.querySelector('code')
        let parent = myTime.parentElement
        let child = myTime.nextSibling
        try {
            if (child.textContent != ' 抵達'){
                parent.removeChild(child)
            }
        }
        catch{}

        let completetime = moment(myTime.textContent, 'MM/DD HH:mm:ss').format('x')
        console.log(completetime)
        if (completetime == 'Invalid date')
            return

        let timeleft = moment.duration(completetime-Date.now())
        let text = document.createTextNode(formatms(timeleft))
        parent.insertBefore(text,myTime.nextSibling)
    }

    function formatms(ms){
        let beforeafter
        if (ms>0){
            beforeafter = '後'
        }
        else{
            beforeafter = '前'
        }
        ms = Math.abs(ms)
        let text = '('
        if (Math.floor(ms/1000/60/60)>0){
            text = text + Math.floor(ms/1000/60/60) + '時'
        }
        if (Math.floor(ms/1000/60)%60>0){
            text = text + Math.floor(ms/1000/60)%60 + '分'
        }
        if (Math.floor(ms/1000)%60>0){
            text = text + Math.floor(ms/1000)%60 + '秒'
        }
        text += beforeafter
        text += ')'
        if (ms<1000){
            text = '0秒'
        }
        return text
    }

    //setTimeout(init,1000);
    setInterval(update,500);
})();