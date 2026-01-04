// ==UserScript==
// @name         去除知乎登录框
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  知乎
// @author       jackpapapapa
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438627/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/438627/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    const simulateclick = (btn)=>{
        const event = new MouseEvent('click',{
          //view: window,
          bubbles: true,
          //cancelable: true
        })
        btn.dispatchEvent(event)
    }
    let time = setInterval(()=>{
        let btn = document.querySelector('.Button.Modal-closeButton.Button--plain')
        let login = document.querySelector('Button.AppHeader-login')
        let hasLogin = document.querySelector('.Popover.AppHeader-menu img')
        if(btn){
            simulateclick(btn)
            //alert('success!')
            clearInterval(time)
        }else if(hasLogin){
            clearInterval(time)
            console.log('has login')
        }else{
            console.log('fail')
        }
    },200)
})();