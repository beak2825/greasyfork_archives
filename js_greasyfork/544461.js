// ==UserScript==
// @name         ニコ生 - 録画機能
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-02
// @description  ニコゲー非表示, 広告削除, 録画機能
// @author       ぐらんぴ
// @match        https://live.nicovideo.jp/watch/lv*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544461/%E3%83%8B%E3%82%B3%E7%94%9F%20-%20%E9%8C%B2%E7%94%BB%E6%A9%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/544461/%E3%83%8B%E3%82%B3%E7%94%9F%20-%20%E9%8C%B2%E7%94%BB%E6%A9%9F%E8%83%BD.meta.js
// ==/UserScript==

let m3u8, lastHref, recorder, chunks = [], isRecording = false, log = console.log;
let $s = (el) => document.querySelector(el), $sa = (el) => document.querySelectorAll(el), $c = (el) => document.createElement(el)

// 待機
window.onload = () => {
    nicoGame_remover()
    record()
    ad_remover()
}

function record(){
    let addon = $s(".addon-controller");
    let btn = $c('button');

    btn.textContent = `録画`;
    btn.className = "GRMP";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "black";
    btn.style.color = "white";
    btn.style.border = "none";

    let timerInterval;
    let recorder, chunks = [], isRecording = false;
    let seconds = 0;

    btn.addEventListener("click", () => {
        const video = $s("video");
        if(!video){
            alert("Video element not found.");
            return;
        }

        if(video.paused || video.readyState < 3){
            video.play().catch(err => console.warn("Video play failed:", err));
        }

        if(!isRecording){
            try{
                const stream = video.captureStream();
                if(!stream){
                    alert("Failed to capture stream.");
                    return;
                }

                recorder = new MediaRecorder(stream);
                chunks = [];

                recorder.ondataavailable = e => chunks.push(e.data);
                recorder.onstop = () => {
                    clearInterval(timerInterval);
                    btn.textContent = `録画`;

                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    let name = $s(".user-name-area > span > span > a") || $s(".channel-name-anchor")
                    let title = $s(".___program-title___vjykj > span").textContent.trim()
                    let date = $s(".___onair-time___c0czD").textContent.trim().replace('開始', '')
                    a.download = name.textContent.trim() + " - " + title + " - " + date + ".webm";
                    a.click();
                };

                recorder.start();
                isRecording = true;
                seconds = 0;
                btn.textContent = formatTime(seconds);

                timerInterval = setInterval(() => {
                    seconds++;
                    btn.textContent = formatTime(seconds);
                }, 1000);

            }catch(e){ alert("Recording failed: " + e);
                     }
        }else{
            recorder.stop();
            isRecording = false;
            clearInterval(timerInterval);
            btn.textContent = `録画`;
        }
    });
    addon.appendChild(btn);

    function formatTime(sec){
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }
}
function nicoGame_remover(){
    let parent = $s(".addon-controller"),
        btn = document.createElement("button");
    btn.className = "grmp";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "black";
    btn.style.border = "none";
    btn.setAttribute("aria-label", "ニコゲー非表示");
    btn.setAttribute("role", "img");

    btn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0,0,256,256"
     width="20px"
     height="20px">
  <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1"
     stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"
     stroke-dasharray="" stroke-dashoffset="0" font-family="none"
     font-weight="none" font-size="none" text-anchor="none"
     style="mix-blend-mode: normal">
     <g transform="scale(10.66667,10.66667)">
      <path d="M12,2c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c5.511,0 10,-4.489 10,-10c0,-5.511 -4.489,-10 -10,-10zM12,4c4.43012,0 8,3.56988 8,8c0,1.85307 -0.63074,3.55056 -1.68164,4.9043l-11.22266,-11.22266c1.35374,-1.0509 3.05123,-1.68164 4.9043,-1.68164zM5.68164,7.0957l11.22266,11.22266c-1.35374,1.0509 -3.05123,1.68164 -4.9043,1.68164c-4.43012,0 -8,-3.56988 -8,-8c0,-1.85307 0.63074,-3.55056 1.68164,-4.9043z"/>
    </g>
  </g>
</svg>`;
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "black";
    btn.style.border = "none";
    btn.className = "grmp";
    btn.addEventListener('click', ()=>{
        try{
            gameDisplay2 = $s("#akashic-gameview > div > div:nth-child(2)")
            gameDisplay3 = $s("#akashic-gameview > div > div:nth-child(3)")
            if(!!gameDisplay3){
                if(gameDisplay3.style.display !== 'none'){
                    gameDisplay3.style.display = 'none'
                }else(gameDisplay3.style.display = '')
            }else{
                if(gameDisplay2.style.display !== 'none'){
                    gameDisplay2.style.display = 'none'
                }else(gameDisplay2.style.display = '')
            }
        }catch(e){//log('nicoGame_remover: 'e)
        }
    })
    parent.appendChild(btn)

}
function ad_remover(){
    const ads = [
        ".ad-banner",
        ".ga-ns-player-ad-panel",
        ".___app-download-banner___B0Yqm",
        ".___program-information-ad-area___u0hZN",
        ".ga-ns-ad-footer",
        ".___premium-member-registration-appeal-panel___P3yv0",
        ".___premium-merit-appeal-banner___vvXtw",
    ];

    GM_addStyle(ads.map(sel => `${sel} { display: none !important; }`).join("\n"));
}