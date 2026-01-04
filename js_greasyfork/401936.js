// ==UserScript==
// @name         腾讯课堂自动献花
// @name:en     Tencent auto send flowers
// @namespace    http://tampermonkey.net/
// @version      1
// @description  献花
// @description:en  send flowers
// @author       Fun
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401936/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%8C%AE%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/401936/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%8C%AE%E8%8A%B1.meta.js
// ==/UserScript==
function getSendFlowersBtn(){
    return document.querySelector("#toolbar > button:nth-child(4)");
}

/*function sleep(time){
    return new Promise(()resolve,reject)=>{
        setTimeout(()) =>{
            resolve(time);
        },time);
        })
        }
(async() =>{
    while(1){
        getSendFlowersBtn.click();
        await sleep(3000);
    }
}
})();
*/

