// ==UserScript==
// @name        AnimeVost Player Enhancer
// @description Добавляет автоплей, шаг скорости 0.05 и запоминает настройки.
// @namespace   http://tampermonkey.net/
// @version     2.0
// @author      kiko
// @license     MIT
// @match       *://*.animevost.org/tip/tv/*
// @match       *://*.animevost.org/frame5.php*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=animevost.org
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/530289/AnimeVost%20Player%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/530289/AnimeVost%20Player%20Enhancer.meta.js
// ==/UserScript==
(function() {
    const applyStyles=(el)=>{el.style.backgroundColor=el.value==="1"?"rgb(0,144,255)":""}
    const injectAutoplayMenu = () => {
        const menuContainer=document.querySelector("#menu")
        if (menuContainer&&!document.querySelector("#autoplay-toggle")){
            const autoDiv=document.createElement('div').className='menu',isAuto=localStorage.getItem('av_autoplay')!=='false'?"1":"0",toggle=document.querySelector('#autoplay-toggle')
            autoDiv.innerHTML=`Автоплей <div class="menuval"><input id="autoplay-toggle" type="range" min="0" max="1" step="1" value="${isAuto}" style="cursor:pointer"></div>`;menuContainer.insertBefore(autoDiv,menuContainer.firstChild);applyStyles(toggle)
            toggle.addEventListener('input',(e)=>{localStorage.setItem('av_autoplay',e.target.value==="1");applyStyles(e.target)})
        }
    };
    const apply=()=>{
        injectAutoplayMenu();
        const video=document.querySelector('video'),sInput=document.querySelector("#speed"),sMeter=document.querySelector("#smeter"),savedSpeed=localStorage.getItem('av_speed')||"1.25";
        const vInput=document.querySelector("#volume-bar"),isAutoplayEnabled=localStorage.getItem('av_autoplay')!=='false',menuItems=document.querySelectorAll(".menu")
        menuItems.forEach(item=>{if(item.innerText.includes("PiP"))item.firstChild.textContent = "Окном"})
        if(sInput&&sInput.value!==savedSpeed){sInput.step="0.05";sInput.value=savedSpeed;if(sMeter)sMeter.innerText=savedSpeed+"x";if(typeof window.sch==='function')window.sch()}
        if(video&&video.playbackRate!==parseFloat(savedSpeed))video.playbackRate = parseFloat(savedSpeed)
        const savedVol=localStorage.getItem('av_vol');
        if(vInput&&savedVol!==null&&vInput.value!==savedVol){vInput.value=savedVol;if(typeof window.vch==='function')window.vch()}
        if(video&&isAutoplayEnabled&&video.paused&&!video.dataset.played){const playBtn=document.querySelector("#stplay");if(playBtn)playBtn.click();if(video.paused)video.play().catch(()=>console.log("Браузер ждет клика"));video.dataset.played="true"}
    }
    document.addEventListener('input', (e) => {if(e.target.id==='speed')localStorage.setItem('av_speed',e.target.value);const video=document.querySelector('video');if(video)video.playbackRate=parseFloat(e.target.value);if(e.target.id==='volume-bar')localStorage.setItem('av_vol', e.target.value)})
    const loop=setInterval(apply,300);setTimeout(()=>clearInterval(loop),10000)
})();