// ==UserScript==
// @name         Chunitora
// @namespace    https://chuni.xitora.cc/
// @version      2.0
// @description  하단 영역에 츄니토라 버튼 추가
// @match        https://chunithm-net-eng.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531126/Chunitora.user.js
// @updateURL https://update.greasyfork.org/scripts/531126/Chunitora.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const spriteImage = "https://tools.xitora.cc/assets/btn_home_chunitora.png";

  function insertChunitoraButton() {
    const container = document.querySelector('.home_submenu_block');
    if (!container) return;

    const newBtn = document.createElement('a');
    newBtn.href = 'javascript:void(0)';
    newBtn.className = 'btn_home_chunitora';
    newBtn.style.verticalAlign = 'top';
    newBtn.style.display = 'inline-block';
    newBtn.style.width = '76px';
    newBtn.style.height = '76px';
    newBtn.style.margin = '5px 13px';
    newBtn.style.backgroundImage = `url(${spriteImage})`;
    newBtn.style.backgroundSize = '100% 200%';
    newBtn.style.backgroundPosition = 'top';
    newBtn.style.borderRadius = '16px';
    newBtn.addEventListener('mousedown', () => { newBtn.style.backgroundPosition = 'bottom'; });
    newBtn.addEventListener('mouseup', () => { newBtn.style.backgroundPosition = 'top'; });
    newBtn.addEventListener('mouseleave', () => { newBtn.style.backgroundPosition = 'top'; });
    newBtn.addEventListener('touchstart', () => { newBtn.style.backgroundPosition = 'bottom'; });
    newBtn.addEventListener('touchend', () => { newBtn.style.backgroundPosition = 'top'; });
    newBtn.addEventListener('touchcancel', () => { newBtn.style.backgroundPosition = 'top'; });
    newBtn.onclick = () => {
      const t = document.createElement("script");
      t.src = "https://tools.xitora.cc/bookmarklet.js?v=" + Math.floor(Date.now() / 1e5);
      document.body.appendChild(t);
    };
    container.appendChild(newBtn);
  }
  window.addEventListener('load', () => {
    setTimeout(insertChunitoraButton, 100);
  });
})();