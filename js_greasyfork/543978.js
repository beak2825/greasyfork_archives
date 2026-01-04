// ==UserScript==
// @name         Dcinside 단축키 복원
// @namespace    http://tampermonkey.net/
// @version      1
// @description  단축키 복원
// @match        *://gall.dcinside.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543978/Dcinside%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%EB%B3%B5%EC%9B%90.user.js
// @updateURL https://update.greasyfork.org/scripts/543978/Dcinside%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%EB%B3%B5%EC%9B%90.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    let key = e.key;

    if (key === '0') key = '10';
    if (!/^[1-9]$|^10$/.test(key)) return;

    const index = parseInt(key, 10) - 1;

    const posts = Array.from(document.querySelectorAll('.us-post'))
      .filter(row => !row.querySelector('.icon_notice'));

    if (index < posts.length) {
    const link = posts[index].querySelector('.gall_tit > a');
    if (link) {
       location.href = link.href;
    }
  }
});

  function goToPage(offset) {
    const url = new URL(location.href);
    const params = url.searchParams;
    let page = parseInt(params.get('page') || '1', 10);
    page += offset;
    if (page < 1) page = 1;
    params.set('page', page);
    url.search = params.toString();
    url.hash = '';
    location.href = url.toString();
  }

  function goToPost(offset) {
    const url = new URL(location.href);
    const params = url.searchParams;
    let no = parseInt(params.get('no') || '1', 10);
    no += offset;
    if (no < 1) no = 1;
    params.set('no', no);
    url.search = params.toString();
    url.hash = '';
    location.href = url.toString();
  }

  document.addEventListener('keydown', function (e) {
    const activeTag = document.activeElement.tagName;
    const key = e.key.toUpperCase();

    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

    if (key === 'F') {
      e.preventDefault();
      return;
    }

    const url = location.href;
    const isViewPage = url.includes('/view/');

    if (!isViewPage && !isNaN(key) && key >= 1 && key <= 9) {
      const posts = document.querySelectorAll('.ub-content.us-post');
      const index = parseInt(key, 10) - 1;
      if (posts[index]) {
        const link = posts[index].querySelector('a.ub-word');
        if (link) location.href = link.href;
      }
    }

    switch (key) {
      case 'W': {
        const writeBtn = document.querySelector('#btn_write');
        if (writeBtn) {
          const onclickAttr = writeBtn.getAttribute('onclick');
          if (onclickAttr && onclickAttr.includes('goWrite(')) {
            const urlMatch = onclickAttr.match(/goWrite\('([^']+)'/);
            if (urlMatch && urlMatch[1]) {
              location.href = urlMatch[1];
              break;
            }
          }
          writeBtn.click();
        }
        break;
      }
      case 'R':
        location.reload();
        break;
      case 'S': {
        const searchInput = document.querySelector('input.in_keyword[name="search_keyword"]');
        if (searchInput) {
          searchInput.focus();
          e.preventDefault();
        }
        break;
      }
      case 'C': {
        const commentLink = document.querySelector('a[href="#focus_cmt"]');
        if (commentLink) {
          commentLink.click();
        } else {
          const cmtSection = document.querySelector('#focus_cmt');
          if (cmtSection) {
            cmtSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      }
      case 'B': {
        if (isViewPage) {
          goToPost(-1);
        }
        break;
      }
      case 'N': {
        if (isViewPage) {
          goToPost(1);
        }
        break;
      }
      case 'U':
        window.scrollBy(0, 200);
        break;
      case 'I':
        window.scrollBy(0, -200);
        break;
      case 'J':
        window.scrollBy(0, window.innerHeight);
        break;
      case 'K':
        window.scrollBy(0, -window.innerHeight);
        break;
      case 'G':
        if (!isViewPage) goToPage(-1);
        break;
      case 'H':
        if (!isViewPage) goToPage(1);
        break;
      case 'L': {
        if (!isViewPage) {
          const url = new URL(location.href);
          url.searchParams.set('page', '1');
          url.hash = '';
          location.href = url.toString();
        }
        break;
      }
    }
  });
})();
