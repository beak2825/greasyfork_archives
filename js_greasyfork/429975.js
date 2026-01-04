// ==UserScript==
// @name       pubg.op.gg战绩优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pubg.op.gg战绩优化,方便用户查看
// @author       You
// @match        https://pubg.op.gg/user/*
// @icon         https://www.google.com/s2/favicons?domain=op.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429975/pubgopgg%E6%88%98%E7%BB%A9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429975/pubgopgg%E6%88%98%E7%BB%A9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let list = document.getElementsByClassName('matches-item__reload-time')
    const tip = document.createElement('div')
    tip.setAttribute('style',
                     'position:absolute;top:10vh;left:0;width:100%;height:10vh;background-color:white;display:flex;justify-content:center;opacity:0.5;z-index:999;align-items:center;font-size:2rem;')
    console.log(list)
    let last = ''
    const init = () =>{
        for(let i =0;i<list.length;i+=1){
            let text = list[i].getAttribute('data-original-title')
            const [date, time] = text.split(' ')
            const [year,excludeYear] = date.split('年')
            const [month, excludeMonth] = excludeYear.split('月')
            const [day] = excludeMonth.split('日')
            list[i].innerText = `${year}.${month}.${day} ${time}`
            if(i === 0){
                last = list[i].innerText
            }
        }
        tip.innerText = `最后一把${last}`
    }
    init()
    setInterval(()=>{
        init()
    },1500)
    document.body.appendChild(tip)
})();