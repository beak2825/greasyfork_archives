// ==UserScript==
// @name         KometTube
// @namespace    Violentmonkey Scripts
// @version      250704
// @description  우클릭 시 유튜브 썸네일 미니플레이어 생성
// @match        *://www.youtube.com/*
// @grant        none
// @icon         https://i.imgur.com/3fkv1pI.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540452/KometTube.user.js
// @updateURL https://update.greasyfork.org/scripts/540452/KometTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let commentOpened = false;
  let originalPlayerWidth = null;

  function extractVideoId(url) {
    const match = url.match(/v=([^&]+)/) || url.match(/\/shorts\/([^/?]+)/);
    return match ? match[1] : null;
  }

  function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#4ea1f3';
        btn.style.color = '#fff';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '#222';
          btn.style.color = '#fff';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  function resizePlayer() {
    const wrapper = document.getElementById('vm-wrapper');
    const player = document.getElementById('vm-mini-player');
    if (!wrapper || !player) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let width = Math.min(vw * (commentOpened ? 0.7 : 0.85), 1280);
    let height = width * 9 / 16;

    if (height > vh * 0.85) {
      height = vh * 0.85;
      width = height * 16 / 9;
    }

    player.style.width = `${width}px`;
    player.style.maxHeight = `${vh * 0.85}px`;
    wrapper.style.transform = 'translate(-50%, -50%)';
  }

  function createMiniPlayer(videoId) {
    if (document.getElementById('vm-wrapper')) return;

    const overlay = document.createElement('div');
    overlay.id = 'vm-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(5px)',
      zIndex: 9998
    });

    const wrapper = document.createElement('div');
    wrapper.id = 'vm-wrapper';
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      zIndex: 9999,
      transform: 'translate(-50%, -50%)'
    });

    const player = document.createElement('div');
    player.id = 'vm-mini-player';
    Object.assign(player.style, {
      background: '#111',
      padding: '12px',
      borderRadius: '8px',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      overflow: 'hidden'
    });

    const titleBar = document.createElement('div');
    titleBar.textContent = '제목 불러오는 중...';
    Object.assign(titleBar.style, {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '8px',
      wordBreak: 'break-word',
      lineHeight: '1.4'
    });

    const iframeWrapper = document.createElement('div');
    Object.assign(iframeWrapper.style, {
      position: 'relative',
      paddingBottom: '56.25%',
      height: 0,
      marginBottom: '8px'
    });

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${location.origin}`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.frameBorder = '0';
    // 추가: referrerpolicy
    iframe.referrerPolicy = 'origin';
    Object.assign(iframe.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    });

    iframeWrapper.appendChild(iframe);

    const btnRow = document.createElement('div');
    btnRow.style.marginTop = '4px';

    const btnCopy = makeButton('🔗 공유', function() {
      copyToClipboard(`https://youtu.be/${videoId}`, this);
    });

    const btnComments = makeButton('💬 댓글');

    // 좋아요 버튼 관련 코드 전체 삭제
    // [btnCopy, btnLike, btnComments].forEach(btn => {
    //   btn.style.marginRight = '6px';
    //   btnRow.appendChild(btn);
    // });
    [btnCopy, btnComments].forEach(btn => {
      btn.style.marginRight = '6px';
      btnRow.appendChild(btn);
    });

    player.appendChild(titleBar);
    player.appendChild(iframeWrapper);
    player.appendChild(btnRow);
    wrapper.appendChild(player);
    document.body.appendChild(overlay);
    document.body.appendChild(wrapper);

    window.addEventListener('resize', resizePlayer);
    resizePlayer();

    overlay.addEventListener('click', () => {
      overlay.remove();
      wrapper.remove();
      commentOpened = false;
    });

    fetch(`https://www.youtube.com/watch?v=${videoId}`)
      .then(res => res.text())
      .then(html => {
        // 더 유연한 정규식으로 ytInitialPlayerResponse 파싱
        const match = html.match(/(?:var |let |const )?ytInitialPlayerResponse\s*=\s*(\{.*?\});/s);
        if (!match) {
          console.warn("KometTube: ytInitialPlayerResponse not found");
          console.log(html.slice(0, 1000)); // 응답 일부 출력
          return;
        }
        const data = JSON.parse(match[1]);
        const title = data.videoDetails?.title || '';
        const channel = data.videoDetails?.author || '';
        const chId = data.videoDetails?.channelId || '';
        const date = data.microformat?.playerMicroformatRenderer?.uploadDate || '';
        const isLive = data.videoDetails?.isLiveContent;

        titleBar.textContent = '';
        const link = document.createElement('a');
        link.href = `https://www.youtube.com/channel/${chId}`;
        link.target = '_blank';
        link.textContent = channel;
        link.style.color = '#4ea1f3';
        link.style.textDecoration = 'none';

        // 제목 표시줄
        titleBar.append(link, ` - ${title}`);

        // 업로드 날짜를 공유 버튼 오른쪽에 표시 (KST 변환 및 조회수 추가)
        if (date) {
          // date는 YYYY-MM-DD 또는 YYYY-MM-DDThh:mm:ssZ 등 다양한 형식일 수 있음
          let dateObj;
          if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            // YYYY-MM-DD 형식
            dateObj = new Date(date + 'T00:00:00+09:00'); // KST로 직접 지정
          } else {
            // 기타 형식 (이미 시간대가 포함된 경우)
            dateObj = new Date(date);
            // UTC 기준이면 KST로 변환
            if (!isNaN(dateObj.getTime()) && date.endsWith('Z')) {
              dateObj = new Date(dateObj.getTime() + 9 * 60 * 60 * 1000);
            }
          }
          // 날짜 파싱이 실패하면 NaN이 됨
          let kstStr = '';
          if (!isNaN(dateObj.getTime())) {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth()+1).padStart(2,'0');
            const d = String(dateObj.getDate()).padStart(2,'0');
            const hh = String(dateObj.getHours()).padStart(2,'0');
            const mm = String(dateObj.getMinutes()).padStart(2,'0');
            const ss = String(dateObj.getSeconds()).padStart(2,'0');
            kstStr = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
          } else {
            kstStr = date;
          }

          // 조회수
          let viewCount = data.videoDetails?.viewCount;
          if (viewCount) {
            viewCount = Number(viewCount).toLocaleString('ko-KR') + '회';
          } else {
            viewCount = '';
          }

          // 구분 공간
          const spacer = document.createElement('span');
          spacer.style.display = 'inline-block';
          spacer.style.width = '16px';
          btnCopy.insertAdjacentElement('afterend', spacer);

          // 조회수
          const viewSpan = document.createElement('span');
          viewSpan.textContent = viewCount;
          viewSpan.style.marginRight = '8px';
          viewSpan.style.fontSize = '14px';
          viewSpan.style.color = '#aaa';
          spacer.insertAdjacentElement('afterend', viewSpan);

          // 날짜
          const dateSpan = document.createElement('span');
          dateSpan.textContent = kstStr;
          dateSpan.style.fontSize = '14px';
          dateSpan.style.color = '#aaa';
          viewSpan.insertAdjacentElement('afterend', dateSpan);
        }

        if (!isLive) {
          btnComments.remove();
        } else {
          btnComments.onclick = () => toggleComments(videoId);
        }
      });
  }

  function toggleComments(videoId) {
    const wrapper = document.getElementById('vm-wrapper');
    const player = document.getElementById('vm-mini-player');
    const existing = document.getElementById('vm-comment-panel');

    if (!commentOpened && !existing) {
      commentOpened = true;
      originalPlayerWidth = player.offsetWidth;

      const panel = document.createElement('iframe');
      panel.id = 'vm-comment-panel';
      panel.src = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${location.hostname}`;
      Object.assign(panel.style, {
        width: '320px',
        height: `${player.offsetHeight}px`,
        border: 'none',
        borderRadius: '8px',
        background: '#fff',
        boxShadow: '0 0 8px rgba(0,0,0,0.3)'
      });

      wrapper.appendChild(panel);
      player.style.width = `${originalPlayerWidth - 332}px`;
    } else {
      commentOpened = false;
      existing?.remove();
      player.style.width = `${originalPlayerWidth}px`;
    }

    resizePlayer();
  }

  function makeButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
      border: '1px solid #444',
      background: '#222',
      color: '#fff'
    });
    if (onClick) btn.onclick = onClick;
    return btn;
  }

  document.addEventListener('contextmenu', e => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;
    const videoId = extractVideoId(link.href);
    if (videoId) {
      e.preventDefault();
      createMiniPlayer(videoId);
    }
  }, true);
})();