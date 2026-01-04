// ==UserScript==
// @name         빈댓글 내용 바꾸기
// @namespace    http://tampermonkey.net/
// @version      1
// @license MIT
// @description  모든 빈 댓글에 자신이 원하는 내용을 삽입할 수 있음
// @author       사실나는클리앙을하는사람
// @match        https://www.clien.net/service/board/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543710/%EB%B9%88%EB%8C%93%EA%B8%80%20%EB%82%B4%EC%9A%A9%20%EB%B0%94%EA%BE%B8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/543710/%EB%B9%88%EB%8C%93%EA%B8%80%20%EB%82%B4%EC%9A%A9%20%EB%B0%94%EA%BE%B8%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function isEffectivelyEmpty(content) {
    const trimmed = content.trim();

    if (trimmed === "") return true;

    const mentionPattern = /^｢@[^＊]+＊[^＊]+＊님｣$/;
    if (mentionPattern.test(trimmed)) return true;

    return false;
  }

  function patchEmptyComments() {
    const commentContainers = document.querySelectorAll('.comment_content');

    commentContainers.forEach(container => {
      const view = container.querySelector('.comment_view');
      if (!view) return;

      const input = view.querySelector('input[data-comment-modify]');
      if (!input) return;

      const originalValue = input.value;

      if (isEffectivelyEmpty(originalValue)) {
        // 중복 삽입 방지
        if (!view.innerText.includes("전 당신의 의견에 동의하지는 않으니 빈댓글 보내겠습니다. 힘내세요.")) {
          view.appendChild(document.createTextNode("전 당신의 의견에 동의하지는 않으니 빈댓글 보내겠습니다. 힘내세요."));
          input.value = "전 당신의 의견에 동의하지는 않으니 빈댓글 보내겠습니다. 힘내세요.";
        }
      }
    });
  }

  patchEmptyComments();

  const observer = new MutationObserver(() => {
    patchEmptyComments();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
