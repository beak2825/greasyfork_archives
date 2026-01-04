// ==UserScript==
// @name         ac21542826跳转脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://www.acfun.cn/v/ac21542826
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419817/ac21542826%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419817/ac21542826%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function init() {
        const nodes = document.querySelectorAll('u')
        for(let item of nodes) {
            let html = item.innerHTML
            if (html.indexOf(':') !== -1) {
                let timeArr = html.split(':')
                let time
                if (timeArr.length === 2) {
                    time = parseInt(html.split(':')[0])*60 + parseInt(html.split(':')[1])
                } else {
                    time = parseInt(html.split(':')[0])*3600 + parseInt(html.split(':')[1])*60 + parseInt(html.split(':')[2])
                }
                item.addEventListener('click', ()=> {
                    document.querySelector('video').currentTime = time
                })
            }
        }
    }
    let interval = setInterval(()=>{
        if (document.querySelector('.ac-comment-list')) {
            clearInterval(interval)
            setTimeout(()=>{
                init()
            }, 3000)
        }
    }, 500)
    })();