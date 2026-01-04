// ==UserScript==
// @name         냥냥두둥 방송화면 캡처
// @namespace    https://greasyfork.org/users/haruB
// @version      2025.08.06.1
// @description  냥냥두둥님의 Soop 라이브 방송화면을 캡처 해줍니다.
// @description:ko  냥냥두둥님의 Soop 라이브 방송화면을 캡처 해줍니다.
// @author       haruB☆
// @match        https://play.sooplive.co.kr/doodong*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544594/%EB%83%A5%EB%83%A5%EB%91%90%EB%91%A5%20%EB%B0%A9%EC%86%A1%ED%99%94%EB%A9%B4%20%EC%BA%A1%EC%B2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/544594/%EB%83%A5%EB%83%A5%EB%91%90%EB%91%A5%20%EB%B0%A9%EC%86%A1%ED%99%94%EB%A9%B4%20%EC%BA%A1%EC%B2%98.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // 날짜 포맷
  function getFormattedTimestamp() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${now.getFullYear().toString().slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  function showTemporaryMessage(msg, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = 9999;
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  function captureDoodong() {
    const video = document.querySelector('#livePlayer');
    if (!video) {
      alert('방송 영상 요소를 찾을 수 없습니다.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `냥냥두둥 방송 캡처 ${getFormattedTimestamp()}.png`;
      link.click();
      showTemporaryMessage('방송 화면이 성공적으로 저장되었습니다.');
    } catch (err) {
      alert('캡처 실패: ' + err);
      console.error(err);
    }
  }

  let html2canvasLoaded = false;

  function chattingCapture() {
    const chat = document.querySelector('#chatting_area')?.parentElement;
    if (!chat) {
      alert('채팅 화면을 찾을 수 없습니다');
      return;
    }

    function doCapture() {
      window.html2canvas(chat, {
        scale: 2,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `냥냥두둥 채팅 캡처 ${getFormattedTimestamp()}.png`;
        link.click();
        showTemporaryMessage('채팅 화면이 성공적으로 저장되었습니다.');
      }).catch(err => {
        showTemporaryMessage('캡처 실패: ' + err);
        console.error(err);
      });
    }

    if (html2canvasLoaded) {
      doCapture();
    } else {
      alert('캡처 준비 중입니다. 잠시만 기다려주세요...');
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      script.onload = () => {
        html2canvasLoaded = true;
        doCapture();
      };
      document.body.appendChild(script);
    }
  }

  function parseShortcut(input) {
    const parts = input.toLowerCase().split('+').map(p => p.trim());
    const shortcut = {
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      key: null
    };

    for (let part of parts) {
      if (part === 'alt') shortcut.altKey = true;
      else if (part === 'ctrl') shortcut.ctrlKey = true;
      else if (part === 'shift') shortcut.shiftKey = true;
      else if (/^f\d+$/.test(part)) {
        shortcut.key = part.toUpperCase(); // F1~F12
      }
      else if (/^[a-z]$/.test(part)) {
        shortcut.key = 'Key' + part.toUpperCase(); // A~Z
      }
      else if (/^\d$/.test(part)) {
        shortcut.key = 'Digit' + part; // 0~9
      }
      else {
        return null; // 허용되지 않는 키
      }
    }

    return shortcut.key ? shortcut : null;
  }


  function stringifyShortcut(shortcut) {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');

    if (shortcut.key.startsWith('Key')) {
      keys.push(shortcut.key.slice(3)); // KeyA → A
    } else if (shortcut.key.startsWith('Digit')) {
      keys.push(shortcut.key.slice(5)); // Digit1 → 1
    } else {
      keys.push(shortcut.key); // F1 등
    }

    return keys.join(' + ');
  }

  function isShortcutMatch(e, shortcut) {
    return (
      e.altKey === shortcut.altKey &&
      e.ctrlKey === shortcut.ctrlKey &&
      e.shiftKey === shortcut.shiftKey &&
      (e.code === shortcut.key || e.key === shortcut.key)
    );
  }

  let userShortcut = JSON.parse(localStorage.getItem('soop_shortcut') || 'null');

  function requestShortcutInput() {
    const current = userShortcut ? stringifyShortcut(userShortcut) : '없음';
    const input = prompt(
      `현재 단축키: ${current}\n\n원하시는 단축키를 입력하세요. (예: Alt + B 또는 F8 등등)\n브라우저 기본 단축키(F5, Ctrl+R 등)는 피해주세요`);

    if (input) {
      const parsed = parseShortcut(input);
      if (!parsed.key) {
        alert('올바른 키를 입력해주세요.');
        return;
      }
      userShortcut = parsed;
      localStorage.setItem('soop_shortcut', JSON.stringify(userShortcut));
      alert(`단축키가 [${stringifyShortcut(userShortcut)}]로 설정되었습니다.`);
    }
  }

  if (userShortcut) {
    console.log('현재 설정된 사용자 단축키:', stringifyShortcut(userShortcut));
  }

  document.addEventListener('keydown', (e) => {
    // 기본 단축키
    if (e.altKey && e.code === 'KeyS') {
      e.preventDefault();
      captureDoodong();
    }

    if (e.code === 'F2') {
      e.preventDefault();
      chattingCapture();
    }

    // 단축키 설정: Alt + C
    if (e.altKey && e.code === 'KeyC') {
      e.preventDefault();
      requestShortcutInput();
    }

    // 사용자 설정 단축키
    if (userShortcut && isShortcutMatch(e, userShortcut)) {
      e.preventDefault();
      captureDoodong();
    }
  });
})();