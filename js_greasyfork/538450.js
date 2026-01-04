// ==UserScript==
// @name         Mobile Refresh Button / Botão de Atualização Mobile
// @name:pt-BR   Botão de Atualização Mobile
// @namespace    https://github.com/BrunoFortunatto
// @version      1.5
// @description  [EN] Shows a refresh button after pulling down at the top of the page. No auto-refresh, optimized performance.
// @description:pt-BR Exibe um botão de atualização após gesto de puxar no topo da página. Sem recarregamento automático e otimizado.
// @author       Bruno Fortunato
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538450/Mobile%20Refresh%20Button%20%20Bot%C3%A3o%20de%20Atualiza%C3%A7%C3%A3o%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/538450/Mobile%20Refresh%20Button%20%20Bot%C3%A3o%20de%20Atualiza%C3%A7%C3%A3o%20Mobile.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Evitar execução dentro de iframes
  if (window.self !== window.top) return;

  // Evitar múltiplas instâncias
  if (document.getElementById('refreshBtn')) return;

  document.body.style.overscrollBehaviorY = 'contain';

  let touchStartY = 0;
  let pulling = false;
  let cooldown = false;
  let showTimeout = null;

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Detectar idioma do navegador
  const userLang = navigator.language.startsWith('pt') ? 'pt' : 'en';

  // Texto do botão em diferentes idiomas
  const buttonText = userLang === 'pt' ? 'Atualizar página' : 'Refresh page';

  // Criar estilos no <head> para evitar bloqueio de CSP
  const style = document.createElement('style');
  style.textContent = `
    #refreshBtn {
      position: fixed;
      top: -50px;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      padding: 12px;
      font-size: 16px;
      border-radius: 25px;
      border: none;
      z-index: 9999;
      background-color: ${isDark ? '#444' : '#2196f3'};
      color: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transition: top 0.3s ease-out, opacity 0.3s, transform 0.3s;
    }
    .refresh-icon {
      width: 22px;
      height: 22px;
    }
    @media (max-width: 480px) {
      #refreshBtn {
        font-size: 14px;
        padding: 10px;
      }
      .refresh-icon {
        width: 18px;
        height: 18px;
      }
    }
    @media (min-width: 1024px) {
      #refreshBtn {
        font-size: 18px;
        padding: 14px;
      }
      .refresh-icon {
        width: 24px;
        height: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  // Criar botão de atualização
  const refreshBtn = document.createElement('button');
  refreshBtn.id = 'refreshBtn';

  // Ícone SVG embutido
  refreshBtn.innerHTML = `
    <svg class="refresh-icon" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12H2C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7 11V13H13V11H7Z"/>
    </svg>
    ${buttonText}
  `;

  refreshBtn.addEventListener('click', () => {
    location.reload();
  });

  document.body.appendChild(refreshBtn);

  function showRefreshButton() {
    if (cooldown) return;
    cooldown = true;
    setTimeout(() => (cooldown = false), 1000);

    refreshBtn.style.display = 'flex';
    requestAnimationFrame(() => {
      refreshBtn.style.top = '10px';
      refreshBtn.style.opacity = '1';
      refreshBtn.style.transform = 'translateX(-50%) scale(1)';
    });

    if (showTimeout) clearTimeout(showTimeout);
    showTimeout = setTimeout(hideRefreshButton, 4000);
  }

  function hideRefreshButton() {
    refreshBtn.style.opacity = '0';
    refreshBtn.style.transform = 'translateX(-50%) scale(0.9)';
    refreshBtn.style.top = '-50px';
    setTimeout(() => {
      refreshBtn.style.display = 'none';
    }, 300);
  }

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY <= 0) {
      touchStartY = e.touches[0].clientY;
      pulling = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!pulling) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 25 && window.scrollY === 0) {
      showRefreshButton();
      pulling = false;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      pulling = false;
      hideRefreshButton();
    }
  }, { passive: true });

})();