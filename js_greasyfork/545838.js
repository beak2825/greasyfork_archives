// ==UserScript==
// @name         DCinside댓글도배차단(PC&Mobile)test
// @version      4.0
// @description  같은 문장이 3번 이상 반복되거나, 유사 문구가 반복되면 도배로 간주하여 댓글과 대댓글을 모두 숨깁니다. PC/Mobile 겸용, 최적화 버전
// @author       ChatGPT
// @match        https://m.dcinside.com/board/*
// @match        https://gall.dcinside.com/board/*
// @match        https://gall.dcinside.com/mgallery/board/*
// @grant        none

// @namespace https://greasyfork.org/users/1480633
// @downloadURL https://update.greasyfork.org/scripts/545838/DCinside%EB%8C%93%EA%B8%80%EB%8F%84%EB%B0%B0%EC%B0%A8%EB%8B%A8%28PCMobile%29test.user.js
// @updateURL https://update.greasyfork.org/scripts/545838/DCinside%EB%8C%93%EA%B8%80%EB%8F%84%EB%B0%B0%EC%B0%A8%EB%8B%A8%28PCMobile%29test.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEL_TEXT = '이 댓글은 게시물 작성자가 삭제하였습니다.';
  const HIDDEN_CLASS = 'spam-hidden';
  const HIGHLIGHT_CLASS = 'spam-highlight';

  // CSS
  const style = document.createElement('style');
  style.textContent = `
    .${HIDDEN_CLASS} { display: none!important; }
    .${HIGHLIGHT_CLASS} { border: 4px solid darkorange!important; }
    #spam-toggle-btn {
      z-index: 9999;
      text-align: center;
      padding: 8px;
      margin: 8px 0;
      background: #eee;
      cursor: pointer;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // 텍스트 정규화
  const normalizeText = s =>
    s.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣.?!]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // 삭제 댓글 여부
  const isAuthorDeleted = li => {
    const t1 = li.querySelector('div.delted')?.innerText.trim() || '';
    const t2 = li.querySelector('p.del_reply')?.innerText.trim() || '';
    return [t1, t2].some(t => t.includes(DEL_TEXT));
  };

  // DC콘 여부
  const hasDccon = el =>
    !!el.querySelector('img[src*="dccon"], span.dccon, div.dccon-container, img[alt*="dc콘"]');

  // 반복 패턴 감지
  const hasPatternRepeat = txt => {
    const w = normalizeText(txt).split(' '), cnt = {}, win = 4;
    for (let i = 0; i <= w.length - win; i++) {
      const k = w.slice(i, i + win).join(' ');
      if (k.length < 10) continue;
      if ((cnt[k] = (cnt[k] || 0) + 1) >= 5) return true;
    }
    return false;
  };

  // 도배 여부
  const isSpam = (list, txt) => {
    const norm = normalizeText(txt);
    if (norm.length <= 1) return false;
    const dup = list.reduce((a, el) => {
      const p = el.querySelector('p.usertxt, p.txt');
      if (!p || hasDccon(el)) return a;
      return a + (normalizeText(p.innerText) === norm ? 1 : 0);
    }, 0);
    return dup >= 3 || hasPatternRepeat(txt);
  };

  // 대댓글 수집
  const collectReplies = (li, isMobile) => {
    const out = [];
    if (isMobile) {
      let n = li.nextElementSibling;
      while (n && n.matches('li.comment-add')) {
        out.push(n);
        n = n.nextElementSibling;
      }
    } else {
      const sib = li.nextElementSibling;
      if (sib && sib.querySelector('.reply_box')) out.push(sib);
    }
    return out;
  };

  // 빈 대댓글 래퍼 숨기기
  const hideEmptyReplyWrappers = hiddenList => {
    document.querySelectorAll('li>div.reply.show').forEach(div => {
      const w = div.closest('li');
      if (!w || w.querySelector('.reply_box')) return;
      if (w.querySelectorAll('li.ub-content:not(.' + HIDDEN_CLASS + ')').length === 0) {
        if (!w.classList.contains(HIDDEN_CLASS)) {
          w.classList.add(HIDDEN_CLASS);
          hiddenList.push(w);
        }
      }
    });
  };

  // 토글 버튼 업데이트
  const updateToggleButton = (sel, hiddenList) => {
    let btn = document.getElementById('spam-toggle-btn');
    if (!hiddenList.length) {
      btn?.remove();
      return;
    }
    if (btn) return;

    const first = document.querySelector(sel);
    if (!first) return;

    btn = document.createElement('div');
    btn.id = 'spam-toggle-btn';
    btn.textContent = '도배 댓글 보기';
    btn.addEventListener('click', () => {
      const showing = btn.textContent === '도배 댓글 보기';
      btn.textContent = showing ? '도배 댓글 숨기기' : '도배 댓글 보기';

      hiddenList.forEach(el => {
        el.classList.toggle(HIDDEN_CLASS, !showing);
        el.classList.toggle(HIGHLIGHT_CLASS, showing);
        el.querySelectorAll?.('li.ub-content').forEach(ch => {
          ch.classList.toggle(HIGHLIGHT_CLASS, showing);
        });
      });
    });

    // 댓글 목록 상단에 삽입
    const container = first.closest('ul, ol') || first.parentNode;
    container.insertBefore(btn, container.firstChild);
  };

  let prevFirst = null, hiddenList = [];
  const obs = new MutationObserver(() => filterComments());

  function filterComments() {
    const isM = location.hostname.startsWith('m.');
    const sel = isM ? 'li.comment:not(.comment-add), li.comment-add' : 'li.ub-content';
    const items = Array.from(document.querySelectorAll(sel));
    if (!items.length) return;

    if (items[0] !== prevFirst) {
      prevFirst = items[0];
      document.getElementById('spam-toggle-btn')?.remove();
      hiddenList = [];
    }

    items.forEach(li => {
      if (li.dataset.spamChecked) return;
      li.dataset.spamChecked = '1';

      const p = li.querySelector('p.usertxt, p.txt');
      const isDeleted = isAuthorDeleted(li);

      if ((p && isSpam(items, p.innerText)) || isDeleted) {
        const grp = [li, ...collectReplies(li, isM)];
        grp.forEach(el => {
          if (!el.classList.contains(HIDDEN_CLASS)) {
            el.classList.add(HIDDEN_CLASS);
            hiddenList.push(el);
          }
        });
      }
    });

    hideEmptyReplyWrappers(hiddenList);
    updateToggleButton(sel, hiddenList);
  }

  filterComments();
  obs.observe(document.body, { childList: true, subtree: true });
})();
