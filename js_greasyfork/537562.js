// ==UserScript==
// @name         Cache Clear Link
// @namespace    cache clear
// @version      1.2
// @description  /cache-clear
// @match        *://*/*
// @grant        none
// @license     MIT
// @author      Samuel Araújo
// @icon        https://www.tiptip.pt/public/img/iconTiptip.png
// @description corre rota de cache-clear
// @downloadURL https://update.greasyfork.org/scripts/537562/Cache%20Clear%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/537562/Cache%20Clear%20Link.meta.js
// ==/UserScript==


(function () {
  if (window.top !== window.self) return;

  if (window.top.__clearCacheButtonInjected) return;
  window.top.__clearCacheButtonInjected = true;

  const originalUrl = location.href;

  const link = document.createElement('a');
  link.id = 'clear-cache-link';
  link.href = '#';
  link.textContent = 'clear';
  Object.assign(link.style, {
    position: 'fixed',
    bottom: '20px',
    left: '0px',
    zIndex: '9999',
    padding: '3px 6px',
    background: '#f00',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '10px',
  });

  link.addEventListener('click', function (e) {
    e.preventDefault();

    fetch(`${location.origin}/cache-clear`)
      .then(() => {
        location.href = originalUrl;
      })
      .catch(() => {
        location.href = originalUrl;
      });
  });

  window.top.document.documentElement.appendChild(link);
})();
