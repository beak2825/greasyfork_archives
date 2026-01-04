// ==UserScript==
// @name         Chzzk AutoBlock (프로필 페이지 이동 없이 치지직 유저 자동 차단 & 기록)
// @namespace    https://chzzk.naver.com/
// @version      1.4.3
// @description  치지직 채널 커뮤니티 탭에서 유저 닉네임 클릭 시 페이지 이동 없이 자동 차단, 기록 저장 및 차단 목록 iframe + 토스트 알림 제공
// @match        https://chzzk.naver.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537921/Chzzk%20AutoBlock%20%28%ED%94%84%EB%A1%9C%ED%95%84%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99%20%EC%97%86%EC%9D%B4%20%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9C%A0%EC%A0%80%20%EC%9E%90%EB%8F%99%20%EC%B0%A8%EB%8B%A8%20%20%EA%B8%B0%EB%A1%9D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537921/Chzzk%20AutoBlock%20%28%ED%94%84%EB%A1%9C%ED%95%84%20%ED%8E%98%EC%9D%B4%EC%A7%80%20%EC%9D%B4%EB%8F%99%20%EC%97%86%EC%9D%B4%20%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9C%A0%EC%A0%80%20%EC%9E%90%EB%8F%99%20%EC%B0%A8%EB%8B%A8%20%20%EA%B8%B0%EB%A1%9D%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentChannelName = null;
  let channelDetected = false;

  const channelObserver = new MutationObserver(() => {
    if (channelDetected) return;
    const el = document.querySelector('span[class^="name_text__"]');
    if (el && el.textContent.trim()) {
      currentChannelName = el.textContent.trim();
      channelDetected = true;
      console.log('[✅ 채널명 감지됨]:', currentChannelName);
    }
  });
  channelObserver.observe(document.body, { childList: true, subtree: true });

  document.body.addEventListener('click', (e) => {
    const span = e.target.closest('span[class^="name_text__"]');
    if (!span) return;

    const link = span.closest('a[href^="/"]');
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    const userIdMatch = link.getAttribute('href').match(/^\/([a-z0-9]{32})$/);
    if (!userIdMatch) {
      console.warn('[❌ 유효한 유저 ID 아님]');
      return;
    }

    const userId = userIdMatch[1];
    handleUserId(userId);
  });

  async function handleUserId(userId) {
    console.log('[🆔 유저 ID 감지]:', userId);
    const blockedList = GM_getValue('blockedUsers', []);
    const alreadyBlocked = blockedList.some(entry => entry.userId === userId);
    if (alreadyBlocked) {
      console.log('[⚠️ 이미 차단된 유저]:', userId);
      return;
    }

    try {
      const res = await fetch(`https://comm-api.game.naver.com/nng_main/v1/privateUserBlocks/${userId}?loungeId=`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'origin': 'https://game.naver.com',
          'referer': `https://game.naver.com/profile/${userId}`,
        },
      });

      if (res.ok) {
        const time = new Date().toISOString();
        const entry = { userId, channelName: currentChannelName || 'unknown', time };
        blockedList.push(entry);
        GM_setValue('blockedUsers', blockedList);
        showToast(`✅ ${userId} 차단됨`, 'success');
        console.log(`[✅ 차단 성공]: ${userId} | 채널명: ${entry.channelName} | 시각: ${entry.time}`);
      } else {
        console.warn('[❌ 차단 실패]:', userId);
      }
    } catch (err) {
      console.error('[❌ 차단 에러]:', err);
    }
  }

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const url = args[2];
    if (typeof url === 'string' && /^\/[a-z0-9]{32}$/.test(url)) {
      const userId = url.slice(1);
      handleUserId(userId);
      return;
    }
    return originalPushState.apply(this, args);
  };

  window.addEventListener('popstate', () => {
    const path = location.pathname;
    if (/^\/[a-z0-9]{32}$/.test(path)) {
      const userId = path.slice(1);
      handleUserId(userId);
    }
  });

  function insertListButton() {
    const target = Array.from(document.querySelectorAll('button[class^="community_detail_cell_button__"]'))
      .find(btn => btn.textContent.trim() === '목록');
    if (!target || document.getElementById('blockListBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'blockListBtn';
    btn.textContent = '📋 차단목록';
    Object.assign(btn.style, {
      marginLeft: '8px',
      fontSize: '12px',
      padding: '4px 8px',
      backgroundColor: '#222',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    });

    btn.onclick = showBlockList;

    target.parentNode.insertBefore(btn, target.nextSibling);
  }

  function showBlockList() {
    if (document.getElementById('blockListFrame')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'blockListFrame';
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      maxHeight: '80%',
      backgroundColor: '#111',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      overflowY: 'auto',
      zIndex: 99999,
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      fontSize: '13px',
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '닫기';
    Object.assign(closeBtn.style, {
      float: 'right',
      backgroundColor: '#444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      cursor: 'pointer',
    });
    closeBtn.onclick = () => wrapper.remove();
    wrapper.appendChild(closeBtn);

    const filterSelect = document.createElement('select');
    ['전체', '5분', '1시간', '1일', '1주', '1달'].forEach(option => {
      const o = document.createElement('option');
      o.value = option;
      o.textContent = option;
      filterSelect.appendChild(o);
    });
    filterSelect.onchange = () => renderList(wrapper, filterSelect.value);
    wrapper.appendChild(filterSelect);

    const listContainer = document.createElement('div');
    listContainer.id = 'blockListContent';
    listContainer.style.marginTop = '20px';
    wrapper.appendChild(listContainer);

    document.body.appendChild(wrapper);
    renderList(wrapper, '전체');
  }

  function renderList(wrapper, range) {
    const container = wrapper.querySelector('#blockListContent');
    container.innerHTML = '';

    const now = Date.now();
    const list = GM_getValue('blockedUsers', []).filter(entry => {
      const entryTime = new Date(entry.time).getTime();
      switch (range) {
        case '5분': return now - entryTime <= 5 * 60 * 1000;
        case '1시간': return now - entryTime <= 60 * 60 * 1000;
        case '1일': return now - entryTime <= 24 * 60 * 60 * 1000;
        case '1주': return now - entryTime <= 7 * 24 * 60 * 60 * 1000;
        case '1달': return now - entryTime <= 30 * 24 * 60 * 60 * 1000;
        default: return true;
      }
    });

    if (list.length === 0) {
      container.textContent = '차단된 유저가 없습니다.';
      return;
    }

    list.forEach(({ userId, channelName, time }, i) => {
      const div = document.createElement('div');
      div.textContent = `[${i + 1}] ${channelName} | ${userId} | ${time}`;
      div.style.marginBottom = '6px';
      container.appendChild(div);
    });
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: type === 'success' ? '#4caf50' : '#333',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '4px',
      zIndex: 99999,
      fontSize: '13px',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = 1;
    });

    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  }

  const buttonObserver = new MutationObserver(insertListButton);
  buttonObserver.observe(document.body, { childList: true, subtree: true });

  console.log('[치지직 자동 차단 + 목록 + 토스트] 스크립트 실행됨');
})();
