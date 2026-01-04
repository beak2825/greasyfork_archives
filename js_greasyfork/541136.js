// ==UserScript==
// @name         쿠팡플레이 생방송 채팅 개선
// @namespace    coupangplaychating
// @version      2.2.5.3
// @description  타임 숨기기/깜빡임 제거/랜덤 밝은색 닉네임(고정)/유저 차단
// @author       쥐샛기
// @match        https://www.coupangplay.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GSetKI
// @downloadURL https://update.greasyfork.org/scripts/541136/%EC%BF%A0%ED%8C%A1%ED%94%8C%EB%A0%88%EC%9D%B4%20%EC%83%9D%EB%B0%A9%EC%86%A1%20%EC%B1%84%ED%8C%85%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/541136/%EC%BF%A0%ED%8C%A1%ED%94%8C%EB%A0%88%EC%9D%B4%20%EC%83%9D%EB%B0%A9%EC%86%A1%20%EC%B1%84%ED%8C%85%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // — CSS —
  GM_addStyle(`
    /* 시간 숨기기 */
    span[class*="ChatList_time"] { display: none !important; }
    /* 깜빡임/페이드아웃 제거 */
    .ChatList_chatItem__PC_JP {
      opacity: 1 !important;
      transition: none !important;
    }
    .ChatList_chatItem__PC_JP:hover { opacity:1 !important; }
    /* 차단하기 메뉴 */
    .cpec-block-btn {
      padding:4px 8px;
      cursor:pointer;
      user-select:none;
    }
    .cpec-block-btn:hover {
      background: rgba(0,0,0,0.05);
    }
  `);

  // 브라우저 종료 시 초기화되도록 sessionStorage 사용
  let blocked  = new Set(JSON.parse(sessionStorage.getItem('cpec_blocked') || '[]'));
  let colorMap = JSON.parse(sessionStorage.getItem('cpec_colors') || '{}');

  function saveBlocked(){
    sessionStorage.setItem('cpec_blocked', JSON.stringify([...blocked]));
  }
  function saveColors(){
    sessionStorage.setItem('cpec_colors', JSON.stringify(colorMap));
  }

  // 밝은 랜덤 HSL 컬러 생성
  function randomColor(){
    const h = Math.floor(Math.random()*360);
    const s = 60 + (Math.random()*30|0);
    const l = 55 + (Math.random()*25|0);
    return `hsl(${h},${s}%,${l}%)`;
  }

  // 모든 채팅 아이템에 컬러·차단 처리
  function scanChats(){
    document.querySelectorAll('.ChatList_chatItem__PC_JP').forEach(item=>{
      const sender = item.querySelector('span[class*="ChatList_sender"]');
      if(!sender) return;

      const name = sender.textContent.trim();
      item.dataset.cpecUid = name;  // 차단 키로도 사용

      // 1) 닉네임 색상 한 번만 적용하되, 같은 닉네임이면 저장된 색 사용
      if(!sender.dataset.cpecStyled){
        sender.dataset.cpecStyled = '1';

        if(!colorMap[name]){
          colorMap[name] = randomColor();
          saveColors();
        }
        sender.style.setProperty('color', colorMap[name], 'important');
        sender.style.setProperty('opacity','1','important');
      }

      // 2) 차단목록에 있으면 숨김
      item.style.display = blocked.has(name) ? 'none' : '';
    });
  }

  // 드롭다운에 “차단하기” 메뉴 추가
  function injectBlockButtons(){
    document.querySelectorAll('div[class*="ChatList_dropdownContent"]').forEach(cont=>{
      if(cont.dataset.cpecMenu) return;
      cont.dataset.cpecMenu = '1';

      // 기존 신고하기 버튼 찾기
      const reportBtn = [...cont.children].find(el=>el.textContent.includes('신고'));
      if(!reportBtn) return;

      const chatItem = cont.closest('.ChatList_chatItem__PC_JP');
      if(!chatItem) return;
      const name = chatItem.dataset.cpecUid;

      // 차단하기 버튼 생성
      const btn = document.createElement('div');
      btn.textContent = '차단하기';
      btn.className = 'cpec-block-btn';
      btn.addEventListener('click', e=>{
        blocked.add(name);
        saveBlocked();
        scanChats();  // 즉시 반영
        // 드롭다운 닫기
        const toggle = chatItem.querySelector('div[class*="ChatList_dropdownButton__"]');
        if(toggle) toggle.click();
        e.stopPropagation();
      });

      // 신고하기 뒤에 삽입
      const span = cont.querySelector('span');
      cont.insertBefore(btn, span);
    });
  }

  // 초기실행 + 신규메시지 감지
  setTimeout(()=>{
    scanChats();
    injectBlockButtons();
    new MutationObserver(()=>{
      scanChats();
      injectBlockButtons();
    }).observe(document.body, {childList:true, subtree:true});
  }, 800);

  console.log('[CPEC] v2.2.5 loaded');
})();
