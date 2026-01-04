// ==UserScript==
// @name         enbita tvflix markblock
// @namespace    enbita tvflix markblock
// @version      1.0
// @description  enbita tvflix markblock script
// @author       You
// @match        *://player.bunny-frame.online/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530448/enbita%20tvflix%20markblock.user.js
// @updateURL https://update.greasyfork.org/scripts/530448/enbita%20tvflix%20markblock.meta.js
// ==/UserScript==

GM_addStyle(`
  /* 모자이크 기본 스타일 */
  .watermark-blur {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
    display: none; /* 기본적으로 숨김 */
  }
`);

(function() {
    'use strict';

    function applyBlurOverlay(video) {
      if (!video) return;

      let blurDiv = document.createElement('div');
      blurDiv.className = "watermark-blur";
      video.parentElement.appendChild(blurDiv); // 동영상 컨테이너에 추가


      function updateOverlay() {
        let rect = video.getBoundingClientRect();
        // 동영상 컨테이너 기준 상대적 위치 계산
        let videoWidth = video.clientWidth;
        let videoHeight = video.clientHeight;
        let add = (rect.width - (videoHeight *16/9)) / 2

        // 전체화면 감지
        let isFullscreen = document.fullscreenElement === video.parentElement;

        blurDiv.style.position = "absolute";

        if (isFullscreen) {
            blurDiv.style.backdropFilter = "blur(7px)";
        } else {
            blurDiv.style.backdropFilter = "blur(4px)";
        }

        blurDiv.style.top = videoHeight * 0.015 + "px";
        blurDiv.style.right = (videoWidth * 0.015) + add + "px";

        blurDiv.style.width = videoWidth * 0.057 + "px"; // 크기 조절
        blurDiv.style.height = videoHeight * 0.09 + "px";
      }


      function checkVideoTime() {
          if (video.currentTime < 181) {
              // 3분 1초 미만: 모자이크 표시
              blurDiv.style.display = "block";
              updateOverlay();
          } else {
              // 3분 1초 이상일 때: 일시정지 상태면 그대로 유지, 재생 중이면 숨김
              if (!video.paused) {
                  blurDiv.style.display = "none";
              }
          }
      }


      updateOverlay(); // 초기 위치 설정

      // 이벤트 리스너 추가
      window.addEventListener("resize", updateOverlay);
      document.addEventListener("fullscreenchange", updateOverlay);
      video.addEventListener("loadedmetadata", updateOverlay);
      video.addEventListener("timeupdate", checkVideoTime); // 현재 시간 감지
      video.addEventListener("pause", checkVideoTime); // 일시정지 감지

    }

    function waitForVideo() {
        let video = document.querySelector("video");
        if (video) {
            applyBlurOverlay(video);
        } else {
            setTimeout(waitForVideo, 50);
        }
    }

    waitForVideo();
})();
