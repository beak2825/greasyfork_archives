// ==UserScript==
// @name         ニコニコ(Re:仮)、次の動画へGO!!
// @namespace    http://tampermonkey.net/
// @version      2024_6_26
// @description  次の動画に自動で行ったり前の動画に戻ったりできます
// @author       You
// @match        https://www.nicovideo.jp/watch_tmp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498286/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%3A%E4%BB%AE%29%E3%80%81%E6%AC%A1%E3%81%AE%E5%8B%95%E7%94%BB%E3%81%B8GO%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/498286/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%28Re%3A%E4%BB%AE%29%E3%80%81%E6%AC%A1%E3%81%AE%E5%8B%95%E7%94%BB%E3%81%B8GO%21%21.meta.js
// ==/UserScript==

(function() {

//読み込みの検知
function loaded(selector, func) {
    if(document.querySelector(selector)) {
        console.log('loaded');
        clearInterval(h);
        func();
    }
}

//下部の読み込み
let h = setInterval(() => {
    loaded(
        'footer'
        ,() => {
            setTimeout(() => scrollBy(0, 10000),450);
            setTimeout(() => scrollBy(0, -10000),500);
            h = setInterval(() => {
                loaded(
                '.d_flex.flex-wrap_wrap.justify_center.gap_16px>li',
                main
                )
            })
        }
    )
}, 10);

function main() {
    console.log('start');
    const $icons = document.querySelectorAll('.w_24px.h_24px.cursor_pointer');
    const $start_stop = $icons[0];
    const $loop = $icons[2];
    const $video_container = document.querySelector('[data-name=inner]').parentNode.parentNode;
    const cvs = document.querySelector('[data-name=inner]>div:nth-child(2)>canvas');
    const ctx = cvs.getContext('2d');
    const $video = document.querySelector('video');
    const $video_bar = document.querySelectorAll('.pos_absolute.z_1.origin_left.will-change_transform')[1];
    const $next_video = document.querySelectorAll('.d_flex.flex-wrap_wrap.justify_center.gap_16px>li')[Math.random()*10|0];
    let timer = 0;
    function get_is_finished() {
        return $video_bar.style.transform.match(/scaleX\((1|0.99999[89]?)\)/);
    }
    function turn_black() {
        ctx.rect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "black";
        ctx.fill();
    }
    let div = document.createElement('div');
    div.style.height = '100%';
    div.style.display = 'none';
    div.style.position = 'relative';
    div.style.zIndex = '1';
    div.innerHTML = `<div style="margin: auto; display: block;">${$next_video.innerHTML}<p class="text_#666" style="font-size: 0.8em;text-align: center;" id="remaining_seconds"></p></div>`;
    div = $video_container.appendChild(div);
    const $remaining_seconds = document.getElementById('remaining_seconds');
    let n = 0;
    let transitioned = 0;
    function if_finish() {
        if(get_is_finished() && $loop.style.opacity == '0.5') {
            if(timer < 5) {
                if($start_stop.childNodes[0].childNodes.length == 2) $start_stop.click();
                turn_black();
                div.style.display = 'flex';
                n = 1;
            } else if ($start_stop.childNodes[0].childNodes.length == 2) {
                if(n) {
                    $video_bar.nextSibling.click();
                }
            }
            if(timer * 60 < 7000) {
                const sec = (7999 - timer * 60) / 1000 | 0;
                const text = `${sec}s後に遷移します。`;
                console.log(sec);
                if($remaining_seconds.textContent != text) {
                    $remaining_seconds.innerHTML = text;
                }
            } else if(!transitioned) {
                location.href = div.querySelector('a').href;
                transitioned = 1;
            }
            timer += 1;
        } else {
            if(timer) {
                div.style.display = 'none';
            }
            timer = 0;
        }
    }
    setInterval(if_finish, 60);
}
})();