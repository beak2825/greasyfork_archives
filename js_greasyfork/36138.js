// ==UserScript==
// @name         Copy Proxy Image URLs
// @version      0.3
// @description  Adds a Context Menu, or shift-left click, for copying direct URLs to proxied images
// @author       donkey/mrpoot
// @include      http*://redacted.ch/*
// @grant        none
// @namespace    https://greasyfork.org/users/162296
// @downloadURL https://update.greasyfork.org/scripts/36138/Copy%20Proxy%20Image%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/36138/Copy%20Proxy%20Image%20URLs.meta.js
// ==/UserScript==

(() => {

  const noticeStyles = `
    display: inline-block;
    position: fixed;
    left: 10px;
    bottom: 10px;
    padding: 15px;
    background: #151515;
    box-shadow: 0, 0, 5px, rgba(0,0,0,.4);
    color: #ccc;
    border: 1px solid #333;
    border-radius: 6px;
    opacity: 0.9;
  `;

  const copy = (str) => {
    const { body } = document;
    const temp = document.createElement('input');
    body.append(temp);
    temp.value = str;
    temp.select();
    document.execCommand('copy');
    body.removeChild(temp);

    const notice = document.createElement('div');
    notice.setAttribute('style', noticeStyles.replace(/[\n\r]+/g, ' '));
    notice.innerHTML = `Copied <strong>${str}</strong> to the clipboard!`;
    body.append(notice);
    setTimeout(() => body.removeChild(notice), 1500);
  };

  document.addEventListener('mouseup', (e) => {
    const { target } = e;
    if (target.nodeName !== 'IMG')
      return;

    const { src } = target;
    if (src.indexOf('https://redacted.ch/image.php?') !== 0)
      return false;

    const [, param] = src.match(/[?&]i=([^&]+)/);
    const originalURL = decodeURIComponent(param.replace(/\+/g, ' '));

    if (e.shiftKey) {
      copy(originalURL);
      e.preventDefault();

    } else if (e.button === 2 && !target.getAttribute('contextmenu')) {
      const id = `img_context_${Math.random() * 1e9 | 0}`;
      const menu = document.createElement('menu');
      menu.setAttribute('type', 'context');
      menu.setAttribute('id', id);

      const menuItem = document.createElement('menuitem');
      menuItem.setAttribute('label', 'Copy Proxied Image Location');
      menuItem.addEventListener('click', () => copy(originalURL));
      menu.appendChild(menuItem);

      const { parentNode } = target;
      parentNode.insertBefore(menu, target);

      target.setAttribute('contextmenu', id);
    }
  }, false);

})();
