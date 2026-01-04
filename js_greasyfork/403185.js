// ==UserScript==
// @name         千峰自动签到
// @namespace    xiyu
// @version      0.1
// @description  千峰自动签到脚本：会在1到3秒内进行自动签到（已失效）
// @author       xiyu
// @include        *://live.polyv.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403185/%E5%8D%83%E5%B3%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/403185/%E5%8D%83%E5%B3%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }
    let sign = document.querySelector(".player-signed")
    let signButton = sign.querySelector(".btn-signed")

    let observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach(mutationRecord => {
            setTimeout(()=> {
                let rect = signButton.getBoundingClientRect()
                var ev = document.createEvent('HTMLEvents')
                ev.pageX = rect.x + 10
                ev.pageY = rect.y + 22
                ev.initEvent('click', false, true)
                signButton.dispatchEvent(ev)
                console.log("签到成功: ", new Date())
            }, getRandomIntInclusive(1000, 3000))
        })
    });
    observer.observe(sign, {
        attributes: true
    })
    if(sign && signButton) {
        console.log("自动签到，启动成功");
    }
})();