// ==UserScript==
// @name         YouTube Skip Time Customizer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Customize YouTube skip time by arrow key and block Numpad0~Numpad9 function
// @author       TrainingDummy1
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/shorts*
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524391/YouTube%20Skip%20Time%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/524391/YouTube%20Skip%20Time%20Customizer.meta.js
// ==/UserScript==
(function() {
	'use strict';

	// You can change this constant to customize skip time
	const step = 0.8;
	let video;
  let searchCount = 0;
  let searchIndex = setInterval(function() {
    video = document.querySelector('video[src]');
    if(!video) {
      if(searchCount < 10) {
			  console.error(`비디오 요소를 찾을 수 없습니다. searchCount: ${searchCount}`);
      }
      else {
        console.error(`비디오 요소를 찾을 수 없습니다. 기능이 비활성화 됩니다.`);
        clearInterval(searchIndex);
      }
    }
    else {
      clearInterval(searchIndex);
    }
  }, 500)

	document.addEventListener('keydown', function(event) {
		// 입력이 콘텐츠 편집 영역에서 발생하지 않는지 확인
		if(event.target.getAttribute('contenteditable') !== 'true' && event.target.id !== 'contenteditable-root') {

			// ArrowRight 또는 ArrowLeft 키 눌렀을 때
			if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
				event.preventDefault();
				event.stopPropagation();

        if(!video || isNaN(video.duration) || isNaN(video.currentTime)) {
          video = document.querySelector('video[src]');
        }

				const direction = event.key === 'ArrowRight' ? 1 : -1;
				const targetTime = Math.max(0, Math.min(video.duration, video.currentTime + direction * step));

				// 정확하게 이동하기 위한 보정 함수
				let retries = 0;
				const maxRetries = 5;
				const tolerance = 0.15;

				function accurateSeek() {
					video.currentTime = targetTime;

					if(Math.abs(video.currentTime - targetTime) < tolerance || retries >= maxRetries) {
						return;
					}

					retries++;
					setTimeout(accurateSeek, 100);
				}

				accurateSeek();
			}
			// Numpad 동작 차단
			else if(event.code.match(/Numpad\d/)) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
	}, true);

	console.log(`화살표 키로 정확하게 ${step}초씩 이동하는 기능이 활성화되었습니다.`);
})();