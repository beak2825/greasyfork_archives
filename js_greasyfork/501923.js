// ==UserScript==
// @license MIT
// @name         BiliBiliVideoControler
// @namespace    http://tampermonkey.net/
// @version      2024-07-27
// @description  Custom video controller for BiliBili videos
// @author       NastyBoogie
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501923/BiliBiliVideoControler.user.js
// @updateURL https://update.greasyfork.org/scripts/501923/BiliBiliVideoControler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
const vc = document.createElement('div');
vc.classList.add('videoControl');
document.body.appendChild(vc);
vc.innerHTML = `
  <div class='progressContainer'>
    <progress class='progress' value='0' max='100'></progress>
    <span class='time'>00:00 / 00:00</span>
    <span class='speed'>速度: 1.0</span>
  </div>
  <button class='play'>播放</button>
  <button class='pause'>暂停</button>
  <button class='mute'>静音</button>
  <button class='speedup'>速度+0.1</button>
  <button class='speeddown'>速度-0.1</button>
`;

const style = document.createElement('style');
style.innerHTML = `
  .videoControl {
    position: fixed;
    top: 30%;
    right: 0;
    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
    width: 150px;
    height: 350px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
  }

  .videoControl button {
    width: 90%;
    padding: 10px;
    margin: 5px 0;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    font-size: 14px;
  }

  .videoControl button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  .videoControl button:active {
    background-color: #003f7f;
  }

  .progressContainer {
    width: 100%;
    text-align: center;
  }

  .progress {
    width: 90%;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .time, .speed {
    display: block;
    margin-bottom: 10px;
    font-size: 14px;
  }
`;
document.head.appendChild(style);

const video = document.querySelector('video');
const doms = {
  play: vc.querySelector('.play'),
  pause: vc.querySelector('.pause'),
  mute: vc.querySelector('.mute'),
  speedup: vc.querySelector('.speedup'),
  speeddown: vc.querySelector('.speeddown'),
  progress: vc.querySelector('.progress'),
  time: vc.querySelector('.time'),
  speed: vc.querySelector('.speed'),
};

doms.play.addEventListener('click', () => {
  video.play();
});
doms.pause.addEventListener('click', () => {
  video.pause();
});
doms.mute.addEventListener('click', () => {
  video.muted = !video.muted;
});
doms.speedup.addEventListener('click', () => {
  video.playbackRate += 0.1;
  doms.speed.textContent = `速度: ${video.playbackRate.toFixed(1)}`;
});
doms.speeddown.addEventListener('click', () => {
  video.playbackRate -= 0.1;
  doms.speed.textContent = `速度: ${video.playbackRate.toFixed(1)}`;
});

video.addEventListener('timeupdate', () => {
  doms.progress.value = (video.currentTime / video.duration) * 100;
  const currentTime = formatTime(video.currentTime);
  const duration = formatTime(video.duration);
  doms.time.textContent = `${currentTime} / ${duration}`;
});

doms.progress.addEventListener('click', (e) => {
  const rect = doms.progress.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  video.currentTime = percent * video.duration;
});


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

})();
