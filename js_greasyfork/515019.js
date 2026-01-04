// ==UserScript==
// @name        YouTube Speed Booster х2 on/off
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/*
// @grant       none
// @version     1.6
// @author      -
// @description Добавляет кнопку изменения скорости на YouTube возле Аккаунта.
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515019/YouTube%20Speed%20Booster%20%D1%852%20onoff.user.js
// @updateURL https://update.greasyfork.org/scripts/515019/YouTube%20Speed%20Booster%20%D1%852%20onoff.meta.js
// ==/UserScript==
const top = '12px'; // Меняйте если надо Положение кнопки отступа ОТ Верха
const right = '240px'; // Меняйте если надо Положение кнопки отсупа ОТ Павого борта.

let currentSpeedIndex = parseInt(localStorage.getItem('currentSpeedIndex')) || 0;
const speeds = [1.5, 2.0, 1.0, 0];
const speedButton = document.createElement('button');
let currentQualityIndex = parseInt(localStorage.getItem('currentQualityIndex')) || 0;

function setPlaybackSpeed() {
    const video = document.querySelector('video');
    if (video) {
        const currentSpeed = speeds[currentSpeedIndex];
        if (isMusicVideo()) {
            video.playbackRate = 1.0;
            currentSpeedIndex = 2; // Устанавливаем индекс на 1.0 для музыкальных видео
            localStorage.setItem('currentSpeedIndex', currentSpeedIndex);
        } else {
            if (currentSpeed > 0) {
                video.playbackRate = currentSpeed;
            }
        }
        speedButton.textContent = currentSpeed > 0 ? `Скорость ${currentSpeed}x` : 'Состояние Выкл';
    }
}

function isMusicVideo() {
    const videoTitle = document.title.toLowerCase();
    return /music|MV|AMV|song|official audio|official music video|clip|live|live performance|cover|музыка|песня|официальный аудио|официальный музыкальный видеоролик|клип|музыкальный клип|прямая трансляция|прямой эфир/i.test(videoTitle) || // Russia
           /musique|chanson|audio officiel|vidéo musicale officielle|clip|live|performance en direct|reprise/i.test(videoTitle) || // French
           /musik|lied|offizielle audio|offizielles musikvideo|clip|live-performance|cover|livestream/i.test(videoTitle) || // German
           /musica|canción|audio oficial|video musical oficial|clip|actuación en vivo|versión de|transmisión en vivo/i.test(videoTitle) || // Spanish
           /musica|canzone|audio ufficiale|video musicale ufficiale|clip|esibizione dal vivo|cover|diretta/i.test(videoTitle); // Italian
}

function toggleSpeed() {
  currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
  localStorage.setItem('currentSpeedIndex', currentSpeedIndex);
  if (speeds[currentSpeedIndex] === 0) {
    speedButton.textContent = 'Состояние Выкл'; // Текст для состояния "выкл"
  } else {
    speedButton.textContent = `Скорость ${speeds[currentSpeedIndex]}x`;
  }
  setPlaybackSpeed();
}

speedButton.textContent = `Скорость ${speeds[currentSpeedIndex]}x`;
speedButton.title = 'Нажмите для переключения скорости воспроизведения.';
speedButton.style.position = 'fixed';
speedButton.style.top = top;
speedButton.style.right = right;
speedButton.style.zIndex = '9999';
speedButton.style.padding = '10px 10px';
speedButton.style.backgroundColor = '#ff0000';
speedButton.style.color = '#ffffff';
speedButton.style.border = 'none';
speedButton.style.borderRadius = '50px';
speedButton.style.cursor = 'pointer';
speedButton.style.fontSize = '10px';

document.body.appendChild(speedButton);
speedButton.addEventListener('click', toggleSpeed);

window.addEventListener('load', () => {setPlaybackSpeed();});
document.addEventListener('fullscreenchange', () => {speedButton.style.display = document.fullscreenElement ? 'none' : 'block';});
const observer = new MutationObserver(() => {setPlaybackSpeed();});
observer.observe(document.body, { childList: true, subtree: true });