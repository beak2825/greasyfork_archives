// ==UserScript==
// @name         ls alive
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ls alive!
// @author       You
// @match        */fpopulation/Login/toMain
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507086/ls%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/507086/ls%20alive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let origin = location.origin
    let accessToken = localStorage.getItem('accessToken')

    // Your code here...
    function beat(start = 9, end = 18){
        let now = new Date()
        let hour = now.getHours()
        let min = now.getMinutes()

        if (hour < start || hour >= end){
          console.log(`${hour}:${min}`, '非工作时间 快跑ε=ε=ε=ε=ε=┌(;￣◇￣)┘');
          return -1;
        }

        console.log(accessToken);
        fetch(`${origin}/fpopulation/Login/toHome?accessToken=${accessToken}`, {
            "headers": {
              "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6",
              "cache-control": "no-cache",
              "pragma": "no-cache",
              "x-requested-with": "XMLHttpRequest",
              "Upgrade-Insecure-Requests": 1,
            },
            "referrer": `${origin}/fpopulation/Login/toMain`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
          }).then(resp => console.log(resp.status, `${hour}:${min}`, 'beat sussces'));

          let rand = (9 + Math.random() * 5) * 60 * 1e3
          console.log(`${Math.floor(rand / 1e3 / 60)}min后续命`);
          setTimeout(beat, rand, start, end) // 随机9~14分钟加命
    }

    beat(9,21)
    // setInterval(beat, (9 + Math.random() * 6) * 60 * 1e3) // 随机9~15分钟加命
    // setInterval(beat, Math.random() * 5 * 20 * 1e3)

    // function test(){
    //   let time = (Math.random() * 6) * 1e3
    //   console.log(time);
    //   setTimeout(test, time)
    // }


})();