// ==UserScript==
// @name         Google - Middle Click Search
// @namespace    https://greasyfork.org/users/649
// @version      1.2.1
// @description  Opens search results in new tab when you middle click
// @author       Adrien Pyke
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/?(?:\?.*)?$/
// @include      /^https?:\/\/www\.google\.[a-zA-Z]+\/search\/?\?.*$/
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/22183/Google%20-%20Middle%20Click%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/22183/Google%20-%20Middle%20Click%20Search.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const setQueryParam = function (key, value, url = location.href) {
    const regex = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, 'giu');
    const hasValue =
      typeof value !== 'undefined' && value !== null && value !== '';
    if (regex.test(url)) {
      if (hasValue) {
        return url.replace(regex, `$1${key}=${value}$2$3`);
      } else {
        const [path, hash] = url.split('#');
        url = path.replace(regex, '$1$3').replace(/(&|\?)$/u, '');
        if (hash) url += `#${hash[1]}`;
        return url;
      }
    } else if (hasValue) {
      const separator = url.includes('?') ? '&' : '?';
      const [path, hash] = url.split('#');
      url = `${path + separator + key}=${value}`;
      if (hash) url += `#${hash[1]}`;
      return url;
    } else return url;
  };

  const getUrl = function (value) {
    if (
      window.location.href.match(
        /^https?:\/\/www\.google\.[a-zA-Z]+\/search\/?\?.*$/u
      )
    ) {
      return setQueryParam('q', encodeURIComponent(value));
    } else {
      return `${location.protocol}//${
        location.host
      }/search?q=${encodeURIComponent(value)}`;
    }
  };

  waitForElems({
    sel: '#_fZl',
    onmatch(btn) {
      const input = document.querySelector('#lst-ib');

      btn.onmousedown = e => {
        if (e.button === 1) {
          e.preventDefault();
        }
      };

      btn.onclick = e => {
        if (e.button === 1 && input.value.trim()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const url = getUrl(input.value);
          GM_openInTab(url, true);
          return false;
        }
      };

      btn.onauxclick = btn.onclick;
    }
  });

  waitForElems({
    sel: '.sbsb_b li .sbqs_c, .sbsb_b li .sbpqs_d',
    onmatch(elem) {
      elem.onclick = e => {
        if (e.button === 1) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const text = elem.classList.contains('sbpqs_d')
            ? elem.querySelector('span').textContent
            : elem.textContent;
          const url = getUrl(text);
          GM_openInTab(url, true);
          return false;
        }
      };
      elem.onauxclick = elem.onclick;
    }
  });
})();
