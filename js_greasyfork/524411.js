// ==UserScript==
// @name          Bloqueio de Rastreadores
// @description   Bloquear rastreadores de dados pessoais em qualquer site, permitindo a pesquisa no Google
// @namespace     CowanBlock
// @license       GPL-3.0
// @version       3.0
// @author        Cowanbas
// @match         *://*/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/524411/Bloqueio%20de%20Rastreadores.user.js
// @updateURL https://update.greasyfork.org/scripts/524411/Bloqueio%20de%20Rastreadores.meta.js
// ==/UserScript==

// Bloqueio de Rastreadores
(function () {
  // Limpar cookies
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/(=.*|$)/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });

  // Bloquear rastreadores de scripts de terceiros
  const blockThirdPartyScripts = () => {
    const scriptTags = document.getElementsByTagName('script');
    const blockedDomains = [
      'google-analytics.com',
      'youtube.com',
      'google.com',
      'facebook.com',
      'doubleclick.net',
      'twitter.com',
      'instagram.com',
      'linkedin.com',
      'tiktok.com',
      'whatsapp.com',
      'snapchat.com',
      'pinterest.com',
      'tumblr.com',
      'reddit.com',
      'vk.com',
      'wechat.com',
      'qq.com',
      'telegram.org'
    ];
    for (let i = 0; i < scriptTags.length; i++) {
      let script = scriptTags[i];
      const src = script.getAttribute('src');
      if (blockedDomains.some(domain => src && src.includes(domain))) {
        script.parentNode.removeChild(script);
      }
    }
  };

  // Bloquear iframe de rastreadores
  const blockIframes = () => {
    const iframes = document.getElementsByTagName('iframe');
    const blockedDomains = [
      'youtube.com',
      'google.com',
      'twitter.com',
      'instagram.com',
      'linkedin.com',
      'tiktok.com',
      'whatsapp.com',
      'snapchat.com',
      'pinterest.com',
      'tumblr.com',
      'reddit.com',
      'vk.com',
      'wechat.com',
      'qq.com',
      'telegram.org'
    ];
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      const src = iframe.getAttribute('src');
      if (src && src.includes('google.com') && src.includes('search')) {
        continue; // Permite o iframe da pesquisa
      }
      if (blockedDomains.some(domain => src && src.includes(domain))) {
        iframe.parentNode.removeChild(iframe);
      }
    }
  };

  // Executar bloqueios ao carregar
  document.addEventListener('DOMContentLoaded', () => {
    blockThirdPartyScripts();
    blockIframes();
  });
})();

// Remover GoogleHistory
(function () {
  'use strict';

  // Desativa o Google Analytics
  if (typeof unsafeWindow !== 'undefined') {
    unsafeWindow._gaUserPrefs = {
      ioo() {
        return true;
      }
    };
  }

  // Impede a modificação da função rwt
  if (typeof Object.defineProperty !== 'undefined') {
    Object.defineProperty(unsafeWindow, 'rwt', {
      value: function () { },
      writable: false
    });
  }

  // Modifica os links nos resultados de pesquisa, removendo o redirecionamento do Google
  const cleanGoogleResults = () => {
    const results = document.querySelectorAll('a[href^="/url"]');
    for (let i = 0; i < results.length; i++) {
      const url = new URL(results[i].href);
      results[i].href = url.searchParams.get('q') || results[i].href;
    }
  };

  // Monitorar alterações na página
  const observer = new MutationObserver(cleanGoogleResults);
  observer.observe(document.body, { childList: true, subtree: true });

  // Executar ao carregar
  document.addEventListener('DOMContentLoaded', cleanGoogleResults);
})();

