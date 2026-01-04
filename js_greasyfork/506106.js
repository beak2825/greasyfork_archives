
// ==UserScript==
// @name         New_SSS
// @namespace    http://tampermonkey.net/
// @version      2024-08-36
// @description  自动战斗!
// @author       You
// @match        http://8.140.59.226:81/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=59.226
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506106/New_SSS.user.js
// @updateURL https://update.greasyfork.org/scripts/506106/New_SSS.meta.js
// ==/UserScript==

(function () {
    'use strict';

   window.onload = function(){
    setTimeout(() => {
        const allA = Array.from(document.querySelectorAll('a'))
        let flag = false;
        function findTextExec(text = '', quip = true) {
            if (flag) return false;
            const a = allA.filter(item => {
                if (quip) {
                    return item.text.trim() === (text)
                }
                return item.text.trim().includes(text)
            })[0]
            if (a) {
                a.click()

                flag = true
            }
        }
        
        findTextExec('离开(不拾取)')
        const hpDom = document.querySelector('.hpys')
        if (hpDom && hpDom.textContent < 550) {
            findTextExec('生命之', false)

        }
        findTextExec('攻击')
        findTextExec('全部拾取')

        if (allA.find(item => item.text === '商城')) {
            const a = allA.filter(item => item.href.includes('attackNPC') && !item.text.includes('魂系'))[0]
            if (a) {
                a.click()

            } else {

                findTextExec('刷新')
            }
        }
        findTextExec('返回', false)
        setTimeout(() => {
            location.reload()
        },12000)
    }, 800) 
   }
})();