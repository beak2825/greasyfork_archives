// ==UserScript==
// @name        쇼츠 전환
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/shorts/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      KENAI
// @license     MIT
// @description 쇼츠를 일반 영상으로
// @downloadURL https://update.greasyfork.org/scripts/455923/%EC%87%BC%EC%B8%A0%20%EC%A0%84%ED%99%98.user.js
// @updateURL https://update.greasyfork.org/scripts/455923/%EC%87%BC%EC%B8%A0%20%EC%A0%84%ED%99%98.meta.js
// ==/UserScript==

console.log(location.href)
GM_registerMenuCommand("일반 영상으로 보기", ()=>{
  location.href = 'https://www.youtube.com/watch?v=' + location.href.split("shorts/")[1];
});

setTimeout(()=>{
  var M = document.getElementsByTagName("video");
  console.log(M)
  Array.from(M).forEach(V => {
    console.log(V.playbackRate)
    console.log(V.duration)
    console.log(V.currentTime)
  })
}, 4000)

