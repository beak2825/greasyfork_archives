// ==UserScript==
// @name         超星 mooc 暂停自动播放
// @namespace    chaoxing_fuck_auto_pause
// @version      0.1
// @description  此脚本仅适用于 mooc1.chaoxing.com 及 mooc1-2.chaoxing.com
// @author       NetTunnel
// @match        *://mooc1.chaoxing.com/*
// @match        *://mooc1-2.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/441217/%E8%B6%85%E6%98%9F%20mooc%20%E6%9A%82%E5%81%9C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441217/%E8%B6%85%E6%98%9F%20mooc%20%E6%9A%82%E5%81%9C%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  window.addEventListener('load', (event) => {
    if (window !== top) return;
    const videos = {}
    const find_videos = () => {
      Array.from(top?.frames?.[0]?.document?.getElementsByTagName('iframe'))?.forEach((frame,index)=> {
        const video = frame.contentWindow.document.getElementById('video_html5_api')
        if(video) videos[index] = {video,isEnd: false}
        console.log(videos);
      })
      window.a = videos
      if (!Object.keys(videos).length) {
        setTimeout(find_videos, 2000)
        return;
      }
      const set_video_pause_event = () => {
        for(let k in videos){
          let video = videos[k].video
          if(videos[k].isEnd) {
            continue;
          }
          let autoplay_on_pause = () => {
            if(!video.ended) {
              setTimeout(() => video.play() , 4);
            }
          }
          video.addEventListener('pause',autoplay_on_pause);
          video.addEventListener('ended', (event) => {
            video.removeEventListener('pause',autoplay_on_pause);
          });
          setInterval(() => {
            if(!video.paused && !video.ended) video.play();
          },4000)
        }
      }
      set_video_pause_event();
    }
    find_videos();
  });
})()
