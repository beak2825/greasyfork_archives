// ==UserScript==
// @name         Universal Redirect Anonymity
// @name:es      Anonimato de Redirección Universal
// @name:fr      Anonymat par Redirection Universelle
// @name:zh-CN   通用重定向匿名
// @name:zh-TW   通用重定向匿名化
// @namespace    https://spin.rip/
// @match        *://*/*
// @exclude      *://anonredir.replit.app/*
// @grant        none
// @version      3.0
// @author       Spinfal
// @description  Replaces all link hrefs with anonredir.replit.app to preserve redirect privacy for the paranoid.
// @description:es Reemplaza todos los enlaces externos con redirecciones anonimizadas o agrega noreferrer para mayor privacidad.
// @description:fr Remplace tous les liens externes par des redirections anonymisées ou ajoute noreferrer pour plus de confidentialité.
// @description:zh-CN 将所有外部链接替换为匿名重定向或添加 noreferrer 以提高隐私性。
// @description:zh-TW 將所有外部連結替換為匿名重定向或添加 noreferrer 以提高隱私性。
// @license      AGPL-3.0 License
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529859/Universal%20Redirect%20Anonymity.user.js
// @updateURL https://update.greasyfork.org/scripts/529859/Universal%20Redirect%20Anonymity.meta.js
// ==/UserScript==


/*
 * 'true' will use "anonredir.replit.app" which is a basic html, css, and js page that has no server backend. the code is fully open to view by viewing the page source
 * 'false' will NOT use "anonredir.replit.app", but instead will add "noreferrer noopener" to all a tags that this script can find
 *
 * what's the difference?
 * * 'true' ensures more privacy by redirecting from a new page completely unrelated to your previous page, and uses location.replace to prevent the page from being saved in history. it will also try to strip all common url tracking params.
 * * 'false' simply adds "noreferrer noopener", which hides the page you were referred from but doesn't use location.replace and does not remove common url tracking params.
*/
const useExternal = true;
const noreferrerRegex = /noreferrer/;
const skipReplacement = ["javascript:", "mailto:", "tel:"]; // any text here will cause the code to NOT edit a HREF attribute

(function () {
  function processLinks(links) {
    links.forEach(link => {
      const rel = link.rel;
      const href = link.href;

      if (!noreferrerRegex.test(rel)) {
        if (useExternal && !skipReplacement.some((text) => href.includes(text)) && href) {
          link.href = `https://anonredir.replit.app/redir-hop?url=${encodeURIComponent(href)}`;
        } else {
          link.rel = rel ? `${rel} noreferrer noopener` : 'noreferrer noopener';
        }
      }
    });
  }

  window.addEventListener('load', () => {
    // Process initial links
    const initialLinks = Array.from(
      document.querySelectorAll('a:not([rel*="noreferrer"])')
    );
    processLinks(initialLinks);

    // Set up MutationObserver for dynamic content
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        Array.from(mutation.addedNodes).forEach(node => {
          if (node.tagName === 'A' && !noreferrerRegex.test(node.rel)) {
            processLinks([node]);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }, { once: true });
})();