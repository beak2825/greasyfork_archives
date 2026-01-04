// ==UserScript==
// @name            Mousewheel and keyboard control video HTML5 
// @name:en         Mousewheel and keyboard control video HTML5 
// @namespace       http://tampermonkey.net/
// @version         0.2
// @description     Add mousewheel & keyboard control to html5 video player.
// @description:en  Add mousewheel & keyboard control to html5 video player.
// @author          HoangNam
// @match           *://*/*
// @grant           none
// @license         MIT2
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/512694/Mousewheel%20and%20keyboard%20control%20video%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/512694/Mousewheel%20and%20keyboard%20control%20video%20HTML5.meta.js
// ==/UserScript==



// Thời gian tua tới/lùi (5 giây)
const seekTime = 2;

function handleWheel(event, seekTime) {
  // Kiểm tra xem sự kiện có phải là sự kiện wheel hay không
  if (event.type === 'wheel') {
    // Lấy phần tử video hoặc audio đang được trỏ chuột
    const isOverMedia = document.querySelector('video, audio');
    const isOverPlayer = document.querySelector('div.player');


    // Kiểm tra xem có phải ứng dụng Facebook không
    //const isFacebookApp = window.location.hostname.includes('facebook.com');
    // Kiểm tra xem có phải ứng dụng dailymotion không
   // const isYoutubeApp = window.location.hostname.includes('youtube.com');
    // Kiểm tra xem con trỏ chuột có trên video hoặc audio hay không
    // if ((!isOverMedia || !isOverMedia.contains(event.target)) && !isFacebookApp && !isYoutubeApp)
        // Tua tới/lùi 5 giây
        if (event.deltaY > 0) {
          // Tua tới
          isOverMedia.currentTime = Math.max(0, isOverMedia.currentTime - seekTime);
        } else {
          // Tua lùi
          isOverMedia.currentTime = Math.min(isOverMedia.duration, isOverMedia.currentTime + seekTime);
        }

  // Kiểm tra xem có phải đang cuộn trên các phần tử media không
  if (isOverPlayer) {
    // Nếu đúng thì ngăn chặn hành động cuộn
    event.preventDefault(), { passive: true };
  }
     if (isOverMedia && isOverMedia.contains(event.target))
    {

        // Tắt hành động mặc định của chuột
        event.preventDefault();
  event.stopPropagation();

    }
  }
}




// Thêm event listener cho sự kiện wheel với chế độ passive
document.addEventListener('wheel', (event) => handleWheel(event, seekTime), { passive: false, capture: true });

    window.addEventListener('load', function() {
        document.addEventListener('keydown', function(e) {
            console.log(e.keyCode);
            var player = document.getElementsByTagName('video')[0];
            if (!player) return;

            switch (e.keyCode) {
                case 37:
                    // Arrow Left lùi 5s
                    player.currentTime -= e.ctrlKey ? 30 : 5;
                    break;
                case 39:
                    // Arrow Right tiến 5s
                    player.currentTime += e.ctrlKey? 30 : 5;
                    break;
                case 32:
                    // Space tạm dừng
                    player.paused ? player.play() : player.pause();
                    break;
            }
        });
    });
