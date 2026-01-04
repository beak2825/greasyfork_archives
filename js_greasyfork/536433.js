// ==UserScript==
// @name         SearXNGでuBlacklist通知をモバイル最適化 📱
// @name:ja      SearXNGでuBlacklist通知をモバイル最適化 📱
// @name:en      Optimize uBlacklist Notice on SearXNG Mobile 📱
// @name:zh-CN   在 SearXNG 移动端优化 uBlacklist 通知 📱
// @name:zh-TW   在 SearXNG 行動版最佳化 uBlacklist 通知 📱
// @name:ko      SearXNG 모바일에서 UBlacklist 알림 최적화 📱
// @name:fr      Optimiser la notification uBlacklist sur SearXNG Mobile 📱
// @name:es      Optimizar notificación de uBlacklist en SearXNG móvil 📱
// @name:de      uBlacklist-Hinweise auf SearXNG mobil optimieren 📱
// @name:pt-BR   Otimizar notificação do uBlacklist no SearXNG Mobile 📱
// @name:ru      Оптимизировать уведомления uBlacklist на SearXNG Mobile 📱
// @version      1.0.0
// @description         Repositions uBlacklist notices below search filters on SearXNG mobile pages for better visibility.
// @description:ja      SearXNGの検索結果ページに表示されるuBlacklist通知を、モバイル表示時に見やすく再配置します。
// @description:en      Repositions uBlacklist notices on SearXNG mobile to a separate line below search filters for improved visibility.
// @description:zh-CN   在 SearXNG 移动端将 uBlacklist 通知移到搜索过滤器下方以提高可见性。
// @description:zh-TW   在 SearXNG 行動裝置上將 uBlacklist 通知移到搜尋篩選器下方以提升可見性。
// @description:ko      SearXNG 모바일 환경에서 uBlacklist 알림을 검색 필터 아래로 옮겨 가시성을 개선합니다。
// @description:fr      Sur SearXNG mobile, déplace les notifications uBlacklist sous les filtres pour une meilleure visibilité.
// @description:es      Mejora la visibilidad de las notificaciones de uBlacklist en móviles moviéndolas debajo de los filtros en SearXNG.
// @description:de      Verschiebt uBlacklist-Hinweise auf mobilen SearXNG-Seiten unter die Filter zur besseren Sichtbarkeit.
// @description:pt-BR   Melhora a visibilidade das notificações do uBlacklist no SearXNG mobile, reposicionando-as abaixo dos filtros.
// @description:ru      Перемещает уведомления uBlacklist под фильтры на мобильных страницах SearXNG для лучшей видимости.
// @namespace    https://github.com/koyasi777/searxng-ublacklist-mobile-notice-fix
// @author       koyasi777
// @match        *://*/searx/search*
// @match        *://*/searxng/search*
// @match        *://searx.*/*
// @match        *://*.searx.*/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/searxng-ublacklist-mobile-notice-fix
// @supportURL   https://github.com/koyasi777/searxng-ublacklist-mobile-notice-fix/issues
// @icon         https://docs.searxng.org/_static/searxng-wordmark.svg
// @downloadURL https://update.greasyfork.org/scripts/536433/SearXNG%E3%81%A7uBlacklist%E9%80%9A%E7%9F%A5%E3%82%92%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E6%9C%80%E9%81%A9%E5%8C%96%20%F0%9F%93%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/536433/SearXNG%E3%81%A7uBlacklist%E9%80%9A%E7%9F%A5%E3%82%92%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E6%9C%80%E9%81%A9%E5%8C%96%20%F0%9F%93%B1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function relocateUBlacklistNotice() {
    if (!isMobile()) return;

    const container = document.querySelector('.search_filters');
    if (!container) return;

    const computedStyle = getComputedStyle(container);
    const paddingLeft = computedStyle.paddingLeft || '1rem';
    const marginLeft = computedStyle.marginLeft || '0rem';

    const allSpans = Array.from(document.querySelectorAll('span')).filter(
      el => !el.dataset.relocated && el.querySelector('span.ub-button')
    );

    const notificationSpans = allSpans.filter(span => {
      const hasText = Array.from(span.childNodes).some(node =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
      );
      return hasText;
    });

    notificationSpans.forEach(span => {
      const wrapper = document.createElement('div');
      wrapper.style.marginTop = '8px';
      wrapper.style.marginBottom = '12px';
      wrapper.style.paddingLeft = paddingLeft;
      wrapper.style.marginLeft = marginLeft;
      wrapper.style.fontSize = '90%';
      wrapper.style.color = '#aaa';
      wrapper.style.display = 'block';

      span.dataset.relocated = 'true';
      wrapper.appendChild(span);
      container.insertAdjacentElement('afterend', wrapper);
    });
  }

  const observer = new MutationObserver(() => {
    relocateUBlacklistNotice();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('load', relocateUBlacklistNotice);
  document.addEventListener('DOMContentLoaded', relocateUBlacklistNotice);
})();
