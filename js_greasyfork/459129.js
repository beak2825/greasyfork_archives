// ==UserScript==
// @name 왓챠 구독 해지 UI 사용성 개선
// @description 왓챠 구독 해지 UI의 다크패턴을 제거하고 사용성을 개선합니다.
// @namespace https://github.com/seocochan
// @author seoco
// @grant none
// @version 0.1.0
// @license MIT
// @supportURL https://github.com/seocochan/decision-to-leave-watcha/issues
// @match https://watcha.com/*
// @run-at document-idle
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/459129/%EC%99%93%EC%B1%A0%20%EA%B5%AC%EB%8F%85%20%ED%95%B4%EC%A7%80%20UI%20%EC%82%AC%EC%9A%A9%EC%84%B1%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/459129/%EC%99%93%EC%B1%A0%20%EA%B5%AC%EB%8F%85%20%ED%95%B4%EC%A7%80%20UI%20%EC%82%AC%EC%9A%A9%EC%84%B1%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

let currentPath = window.location.pathname;

const pages = {
  '/settings': {
    isModified: false,
    handler() {
      const button = Array.from(document.getElementsByTagName('button'))
        .find(button => button.innerText === '해지 신청')
      const pElement = button ? button.closest('p') : null;
      if (!pElement) return;

      const liElement = Array.from(document.getElementsByTagName('a'))
        .find(a => a.getAttribute('href') === '/coupon/register')
        .closest('li');
      const clone = liElement.cloneNode(true);
      const aElement = clone.getElementsByTagName('a')[0];
      aElement.setAttribute('href', '/cancel/step1');
      aElement.innerText = button.innerText;

      liElement.after(clone);
      pElement.remove();
      this.isModified = true;
    }
  },
  '/cancel/step2': {
    isModified: false,
    handler() {
      const buttons = Array.from(document.getElementsByTagName('button'));
      const [button1, button2] = buttons.filter(button => {
        const divs = button.getElementsByTagName('div');
        return divs.length && [
          '이용 자격 유지하기',
          '이용 자격 이대로 포기하기'
        ].includes(divs[0].innerText);
      });
      if (!button1 || !button2) return;

      [button1.className, button2.className] = [button2.className, button1.className];
      this.isModified = true;
    }
  },
};

const initPagesStates = () => {
  Object.values(pages).forEach(page => page.isModified = false);
};

new MutationObserver((mutations, observer) => {
  const path = window.location.pathname;
  const page = pages[path];

  if (!page) {
    currentPath = path;
    return;
  }
  if (path === currentPath && page.isModified) {
    return;
  }
  if (path !== currentPath) {
    initPagesStates();
  }

  page.handler();
  currentPath = path;
}).observe(document.body, {childList: true, subtree: true});