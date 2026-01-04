// ==UserScript==
// @name         Mobile Video Seek Gesture
// @namespace    http://tampermonkey.net/
// @version      8.4
// @description  On mobile, swipe left or right to seek the video, long press to speed up
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524654/Mobile%20Video%20Seek%20Gesture.user.js
// @updateURL https://update.greasyfork.org/scripts/524654/Mobile%20Video%20Seek%20Gesture.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ✅ 중복 실행 방지
  if (window.__mobileVideoGesture__) return;
  window.__mobileVideoGesture__ = true;

  const userPlaybackRates = new Map();

  // ✅ 범용 비디오 제어 래퍼 (다양한 플레이어 호환)
  function createVideoController(video) {
    return {
      el: video,
      get currentTime() {
        try {
          return (
            video.currentTime ?? // HTML5 표준 API
            video?.player?.currentTime?.() ??
            video?.plyr?.currentTime ??
            video?.shakaPlayer?.getMediaElement?.()?.currentTime ??
            video?.hls?.media?.currentTime ??
            0
          );
        } catch {
          return 0;
        }
      },
      set currentTime(t) {
        try {
          video.currentTime = t; // 기본 HTML5 방식
        } catch {}
        // Optional: Video.js 등 wrapper API 처리
        try {
          if (typeof video?.player?.currentTime === 'function') video.player.currentTime(t);
          if (video?.plyr) video.plyr.currentTime = t;
          if (video?.shakaPlayer) video.shakaPlayer.getMediaElement().currentTime = t;
          if (video?.hls) video.hls.media.currentTime = t;
        } catch {}
      },
      get duration() {
        return (
          video.duration ??
          video?.player?.duration?.() ??
          video?.plyr?.duration ??
          video?.shakaPlayer?.getDuration?.() ??
          video?.hls?.media?.duration ??
          0
        );
      },
      get playbackRate() {
        return (
          video.playbackRate ??
          video?.player?.playbackRate?.() ??
          video?.plyr?.speed ??
          video?.shakaPlayer?.getPlaybackRate?.() ??
          1
        );
      },
      set playbackRate(r) {
        try {
          video.playbackRate = r;
        } catch {}
        try {
          if (video?.player?.playbackRate) video.player.playbackRate(r);
          if (video?.plyr) video.plyr.speed = r;
          if (video?.shakaPlayer) video.shakaPlayer.setPlaybackRate(r);
        } catch {}
      },
    };
  }

  // ✅ 오버레이 생성
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0,0,0,0.7)',
    color: '#fff',
    fontSize: '18px',
    padding: '10px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    zIndex: 999999,
    display: 'none',
    lineHeight: '1.5',
  });
  document.body.appendChild(overlay);
  function showOverlay(text) { overlay.innerHTML = text; overlay.style.display = 'block'; }
  function hideOverlay() { overlay.style.display = 'none'; overlay.innerHTML = ''; }

  // ✅ 시간 형식 변환
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    let absSeconds = Math.floor(seconds); // 소수점 제거
    let hours = Math.floor(absSeconds / 3600);
    let minutes = Math.floor((absSeconds % 3600) / 60);
    let secs = absSeconds % 60;

    if (hours > 0) {
        return `${hours < 10 ? '0' : ''}${hours}:` +
               `${minutes < 10 ? '0' : ''}${minutes}:` +
               `${secs < 10 ? '0' : ''}${secs}`;
    } else {
        return `${minutes < 10 ? '0' : ''}${minutes}:` +
               `${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  // 시간 변화량을 형식화
  function formatDelta(seconds) {
    const sign = seconds < 0 ? '-' : '+';
    let absSeconds = Math.floor(Math.abs(seconds));
    let hours = Math.floor(absSeconds / 3600);
    let minutes = Math.floor((absSeconds % 3600) / 60);
    let secs = absSeconds % 60;

    if (hours > 0) {
        return `${sign}${hours < 10 ? '0' : ''}${hours}:` +
               `${minutes < 10 ? '0' : ''}${minutes}:` +
               `${secs < 10 ? '0' : ''}${secs}`;
    } else {
        return `${sign}${minutes < 10 ? '0' : ''}${minutes}:` +
               `${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  // ✅ 전역 터치 이벤트 적용
  window.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    const allVideos = findAllVideos();

    const video = allVideos.find(v => {
      const rect = v.getBoundingClientRect();
      return (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
      );
    });

    // video 아니라면 아예 중단
    if (!video) return;

    // video 위인 경우만 이벤트 등록
    const ctrl = createVideoController(video);
    const startX = touch.clientX;
    const initialTime = ctrl.currentTime;
    let seeking = false;

    const MOVE_THRESHOLD = 10;

    // 터치 이동
    const touchMoveHandler = eMove => {
      if (!seeking) {
          const deltaX = eMove.touches[0].clientX - startX;
          if (Math.abs(deltaX) > MOVE_THRESHOLD) seeking = true;
      }

      if (seeking) {
          const deltaX = eMove.touches[0].clientX - startX;
          const timeChange = deltaX * 0.05; // 민감도 값 조정
          ctrl.currentTime = Math.max(0, Math.min(initialTime + timeChange, ctrl.duration));
          showOverlay(`${formatTime(ctrl.currentTime)}<br>(${formatDelta(timeChange)})`);
      }
    };

    // 터치 종료
    const touchEndHandler = () => {
      seeking = false;
      hideOverlay();

      // 등록된 핸들러만 clean-up
      e.target.removeEventListener('touchmove', touchMoveHandler);
      e.target.removeEventListener('touchend', touchEndHandler);
      e.target.removeEventListener('touchcancel', touchEndHandler);
    };

    // e.target에 이벤트 등록
    e.target.addEventListener('touchmove', touchMoveHandler, { passive: true });
    e.target.addEventListener('touchend', touchEndHandler);
    e.target.addEventListener('touchcancel', touchEndHandler);
}, { passive: true, capture: true }); // capture: true 추가로 커스텀 플레이어 충돌 방지

  // ✅ 롱터치 전용 pointer 이벤트
  let longPressVideo = null;
  let longPressCtrl = null;
  let longPressFired = false;
  let longPressTimer = null;
  const LONG_PRESS_DELAY = 500;  // 롱터치 시간(ms)

  window.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;

    const allVideos = findAllVideos();
    const video = allVideos.find(v => {
      const rect = v.getBoundingClientRect();
      return e.clientX >= rect.left && e.clientX <= rect.right &&
             e.clientY >= rect.top && e.clientY <= rect.bottom;
    });
    if (!video) return;

    longPressVideo = video;
    longPressCtrl = createVideoController(video);
    longPressFired = false;

    longPressTimer = setTimeout(() => {
      longPressFired = true;
      userPlaybackRates.set(video, longPressCtrl.playbackRate);
      longPressCtrl.playbackRate = 2.0; // 배속 설정
      showOverlay('2x Speed');
    }, LONG_PRESS_DELAY);
  }, { capture: true });

  window.addEventListener('pointerup', e => {
    if (e.pointerType !== 'touch') return;

    clearTimeout(longPressTimer);

    if (longPressFired && longPressVideo && longPressCtrl) {
      longPressCtrl.playbackRate = userPlaybackRates.get(longPressVideo) ?? 1;
      userPlaybackRates.delete(longPressVideo);
      hideOverlay();
    }

    longPressVideo = null;
    longPressCtrl = null;
    longPressFired = false;
  }, { capture: true });

  window.addEventListener('pointercancel', e => {
    if (e.pointerType !== 'touch') return;

    clearTimeout(longPressTimer);
    longPressVideo = null;
    longPressCtrl = null;
    longPressFired = false;
    hideOverlay();
  }, { capture: true });

  // ✅ Shadow DOM 포함 탐색 (iframe도 탐색)
  function findAllVideos(root = document, found = new Set()) {
    const vids = [];
    try {
      root.querySelectorAll('video').forEach(v => {
        if (!found.has(v)) { found.add(v); vids.push(v); }
      });
      root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) vids.push(...findAllVideos(el.shadowRoot, found));
        if (el.tagName === 'IFRAME') {
          try { vids.push(...findAllVideos(el.contentDocument, found)); } catch {}
        }
      });
    } catch {}
    return vids;
  }

  // ✅ 반복 감시 및 초기화
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (node.tagName === 'VIDEO') {
          // 새 video 발견 시 초기화 필요하면 처리
        } else if (node.querySelectorAll) {
          node.querySelectorAll('video').forEach(v => {
            // 새 video 초기화 처리
          });
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // load 이벤트 후 초기 scan
  window.addEventListener('load', () => setTimeout(() => findAllVideos(), 1000));

})();
