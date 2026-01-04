// ==UserScript==
// @name        学习视频劫持
// @namespace   Violentmonkey Scripts
// @match       http://211.83.159.74/fzdx/play
// @grant       none
// @version     1.0
// @author      -
// @description 11/9/2023, 11:43:52 AM
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/479432/%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%8A%AB%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/479432/%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E5%8A%AB%E6%8C%81.meta.js
// ==/UserScript==


(function () {
    setInterval(() => {
      const target = document.querySelector('#wrapper > div > div.plyr__controls > div.plyr__controls__item.plyr__time--current.plyr__time');

      if (typeof target !== 'undefined') {
        document.title = target.innerText;
      }

    }, 1000);


    setTimeout(() => {

        const videoList = document.querySelectorAll('body > div > div.video_fixed.video_cut > div:nth-child(5) > ul > li');
        var next;
        if (typeof videoList !== 'undefined') {
            for (var i = 0; i < videoList.length; i++) {
                if (videoList[i].classList.contains('video_red1') && typeof videoList[i + 1] !== 'undefined') {
                    next = videoList[i + 1];
                    console.log(next.childNodes[1].href);

                    GM_setValue('next', next.childNodes[1].href);

                    break;
                }
            }
        }

        // 劫持自动暂停
        if (typeof loop_pause === 'function') {
            loop_pause = function () {
                console.log('劫持中 - 防止自动暂停');
            }
        }


        console.log('auto-play');
        // Chrome 限制
        player.muted = true;


        player.play();


        //     player.on('play', () => {
        //       try {
        //         current_time();
        //         studyTime();
        //       } catch (e) {
        //         console.log(e);
        //       }

        //     })


        // 劫持暂停函数
        player.on('pause', () => {
            if (!player.ended) {
                // console.log('劫持中 - 防止暂停');
                // setTimeout(() => {
                //     player.play();
                // }, 50);
            } else {
              console.log('劫持中 - 视频暂停且结束')
            }
        })


        player.pause = () => {
          console.log('劫持中 - pause');
          try {
              window.clearTimeout(flag);
              clearInterval(timer);   //定时器清除；
            console.log('模拟操作成功');
          } catch (e) {
            console.log('模拟操作失败');
          }
          player.play();
        }


        player.media.pause = () => {};


        // 监测 end
        setInterval(() => {
            if (player.ended) {
                console.log('劫持中 - 自动切换下一个视频');
                setTimeout(() => {
                    if (GM_getValue('next') != -1) {
                        window.location.href = GM_getValue('next');
                        // GM_setValue('next', -1);
                    } else {
                        console.log('Finish!');
                    }

                }, 10000);
            }
        }, 500);


        // 浏览器切换
        document.addEventListener('visibilitychange', function () {
            console.log('劫持中 - 界面切换/隐藏');
            // console.log(document.hidden, document.visibilityState);
        });


        Object.defineProperty(document, 'hidden', {
            configurable: true,
            get: function () {
                return false;
            }
        });

        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: function () {
                return 'visible';
            }
        });



    }, 2000);




}) ();