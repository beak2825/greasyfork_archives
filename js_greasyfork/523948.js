// ==UserScript==
// @name                  Limpa o Cache do Navegador
// @description           Limpa o cache sempre que uma nova guia for aberta
// @namespace             CowanCACHE
// @license               GPL-3.0
// @version               2.0
// @author                Cowanbas
// @match                 *://*/*
// @run-at                document-start
// @downloadURL https://update.greasyfork.org/scripts/523948/Limpa%20o%20Cache%20do%20Navegador.user.js
// @updateURL https://update.greasyfork.org/scripts/523948/Limpa%20o%20Cache%20do%20Navegador.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Armazena a chave única para o site atual no sessionStorage
  const siteKey = `cacheCleared:${window.location.hostname}`;

  // Verifica se a limpeza já foi realizada para esta aba
  if (sessionStorage.getItem(siteKey)) {
    console.log(`Cache already cleared for ${window.location.hostname}.`);
    return; // Sai do script se a limpeza já foi feita nesta sessão
  }

  // Marca a limpeza como feita para esta sessão
  sessionStorage.setItem(siteKey, 'true');

  // Limpa Service Workers
  function clearServiceWorkers() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(function (registration) {
          registration.unregister();
          console.log('Service worker cache cleared.');
        });
      });
    }
  }

  // Adiciona parâmetros únicos para evitar uso de cache nos recursos atuais
  function reloadWithoutCache() {
    const allLinks = document.querySelectorAll('link[rel="stylesheet"], script, img');
    allLinks.forEach(element => {
      const url = new URL(element.src || element.href, window.location.origin);
      url.searchParams.set('_nocache', Date.now());
      if (element.tagName === 'LINK' || element.tagName === 'SCRIPT') {
        element.href = url.toString();
      } else if (element.tagName === 'IMG') {
        element.src = url.toString();
      }
    });
    console.log('Resources reloaded with cache-busting parameters.');

    // Recarrega a página sem usar cache
    location.reload(); // Recarrega a página normalmente
  }

  // Executa a limpeza
  console.log(`Performing cache clear for ${window.location.hostname}.`);
  clearServiceWorkers();
  reloadWithoutCache();
})();
