// ==UserScript==
// @name         seed Map自動入力
// @namespace    http://tampermonkey.net/
// @version      2024-04-03
// @description  -seed
// @author       tube
// @match        https://www.chunkbase.com/apps/seed-map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chunkbase.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491571/seed%20Map%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/491571/seed%20Map%E8%87%AA%E5%8B%95%E5%85%A5%E5%8A%9B.meta.js
// ==/UserScript==

const seed = document.getElementById('seed');
const Pcontent = seed.parentElement;
Pcontent.insertAdjacentHTML('beforeend', `<button id="randomBtn">ランダム</button>`);
const randomBtn = document.getElementById('randomBtn');

function random (){
    const random = Math.floor( Math.random() * 1e5 ) + 1e12;
    return -(random);
}

function localCnt(){
    let num = 0;
    if(localStorage.getItem('seedCnt')){

        const cnt = localStorage.getItem('seedCnt');
        const setNum = Number(cnt) - 1;
        localStorage.setItem('seedCnt',setNum)
        num = setNum;
        console.log(num)
    }else{
        localStorage.setItem('seedCnt',Number(-50))
        num = -50;
    }
    return num;
}


randomBtn.addEventListener("click",()=>{
    seed.value = localCnt();
      seed.dispatchEvent(new Event('change'));
})