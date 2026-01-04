// ==UserScript==
// @name          謎検
// @name:ja       謎検
// @namespace     https://greasyfork.org/ja/users/570127
// @version       0.3.1
// @description   謎検で左右のキーで移動できるようになります
// @description:ja 謎検で左右のキーで移動できるようになります
// @author        universato
// @license       MIT
// @match         https://www.nazoken.com/*
// @icon          https://i.gyazo.com/03e05904834be84f1efd1c7dbaca00dd.jpg
// @supportURL    https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/456068/%E8%AC%8E%E6%A4%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/456068/%E8%AC%8E%E6%A4%9C.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
   * Quiz visibility controls
   * ========================= */

  const showAllQuestions = () => {
    document.querySelectorAll('.quiz').forEach(q => {
      q.style.display = 'block';
    });
  };

  const hideDoneQuestions = () => {
    document.querySelectorAll('.quiz.done').forEach(q => {
      q.style.display = 'none';
    });
  };

  const showOnlyMarkedQuestions = () => {
    document.querySelectorAll('.quiz').forEach(q => {
      if (!q.classList.contains('marked')) {
        q.style.display = 'none';
      }
    });
  };

  /* =========================
   * Button utilities
   * ========================= */

  const createButton = (label, onClick) => {
    const button = document.createElement('div');
    button.className = 'button';
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  };

  const buttonContainer = document.querySelector('.button__container');

  if (buttonContainer && buttonContainer.childElementCount > 0) {
    buttonContainer.appendChild(createButton('全問題を表示', showAllQuestions));
    buttonContainer.appendChild(createButton('回答済みを非表示', hideDoneQuestions));
    buttonContainer.appendChild(createButton('後で解くだけ表示', showOnlyMarkedQuestions));
  }

  /* =========================
   * Keyboard navigation
   * ========================= */

  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    if (active && /^(INPUT|TEXTAREA)$/.test(active.tagName)) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      document.querySelector('#arrow-label-left')?.click();
      return;
    }

    if (event.key === 'ArrowRight') {
      document.querySelector('#arrow-label-right')?.click();
      return;
    }
  });

})();
