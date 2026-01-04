// ==UserScript==
// @name         YandexMail: faster link opening - without intermediate Yandex page
// @description  It may be less secure - because maybe Yandex use such mechanism to block bad pages. Or better for your privacy - because maybe Yandex use that middle page to get stats.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Vitaly Zdanevich
// @match        https://mail.yandex.ru/*
// @homepageURL  https://gitlab.com/vitaly-zdanevich-userscripts/mail-yandex-ru-link-click-drop-intermediate-yandex-redirect
// @supportURL   https://gitlab.com/vitaly-zdanevich-userscripts/mail-yandex-ru-link-click-drop-intermediate-yandex-redirect
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498413/YandexMail%3A%20faster%20link%20opening%20-%20without%20intermediate%20Yandex%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/498413/YandexMail%3A%20faster%20link%20opening%20-%20without%20intermediate%20Yandex%20page.meta.js
// ==/UserScript==

const originalSetAttribute = HTMLAnchorElement.prototype.setAttribute;

HTMLAnchorElement.prototype.setAttribute = function(name, value) {
  if (name === 'href' && value.startsWith('https://mail.yandex.ru/re.jsx?') && this.getAttribute('target') === '_blank') {
    return;
  }

  return originalSetAttribute.call(this, name, value);
};
