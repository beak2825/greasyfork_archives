// ==UserScript==
// @name         고려대 실험실 안전교육 도움 (세종)
// @namespace    koreauniv.silhumsil
// @version      2025-10-13
// @description  고려대학교 실험실 안전교육에 도움을 줘요
// @author       You
// @match        https://sjsafe.korea.ac.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=korea.ac.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536470/%EA%B3%A0%EB%A0%A4%EB%8C%80%20%EC%8B%A4%ED%97%98%EC%8B%A4%20%EC%95%88%EC%A0%84%EA%B5%90%EC%9C%A1%20%EB%8F%84%EC%9B%80%20%28%EC%84%B8%EC%A2%85%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536470/%EA%B3%A0%EB%A0%A4%EB%8C%80%20%EC%8B%A4%ED%97%98%EC%8B%A4%20%EC%95%88%EC%A0%84%EA%B5%90%EC%9C%A1%20%EB%8F%84%EC%9B%80%20%28%EC%84%B8%EC%A2%85%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let video_autoplay_listener_added = false;

    setInterval(()=>{
        let video = document.querySelector("video");
        if (!video) return;
        video.playbackRate = 10;
        video.volume = 0;
        video.play();
        if (video_autoplay_listener_added) {
            video.addEventListener("load", ()=>video.play());
            video.addEventListener("pause", ()=>video.play());
        }

        video_autoplay_listener_added=true;

        if (video.currentTime == video.duration &&
            document.querySelector(`#footer > div > div.pageNumDiv > div.pageNum.cPageNum`).innerText.trim() != document.querySelector(`#footer > div > div.pageNumDiv > div.pageNum.tPageNum`).innerText.trim()
        )
        document.querySelector("#footer > div > div.moveBtnDiv > div.moveBtn.nextPageBtn")?.dispatchEvent(new Event("mousedown"));
    }, 100);

    setInterval(()=>{
        if (document.querySelector("#section > div.contentsDiv.movOut > div.quizIntro.sudden.view"))
        document.querySelector("#footer > div > div.moveBtnDiv > div.moveBtn.nextPageBtn")?.dispatchEvent(new Event("mousedown"));
    }, 100);

    let interval3 = setInterval(()=>{
        let quizIntro = document.querySelector(`.quizIntro.view`);
        if (quizIntro) {
            document.querySelector("#footer > div > div.moveBtnDiv > div.moveBtn.nextPageBtn")?.dispatchEvent(new Event("mousedown"));
            return clearInterval(interval3);
        }
    }, 4);
})();