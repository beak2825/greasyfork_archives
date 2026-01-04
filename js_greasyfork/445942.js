// ==UserScript==
// @name            Qobuz: Change Country 
// @name:ru         Qobuz: Сменить Страну
// @description     Adds a button to change the country
// @description:ru  Добавляет кнопку для смены страны
// @namespace       qobuz-change-country.user.js
// @license         WTFPL
// @author          askornot
// @match           https://www.qobuz.com/*
// @grant           GM.notification
// @grant           GM_notification
// @version         1.1.1
// @compatible      chrome     Violentmonkey 2.20.0
// @compatible      firefox    Greasemonkey  4.10.0
// @compatible      firefox    Tampermonkey  4.11.6120
// @homepageURL     https://greasyfork.org/ru/scripts/445942-qobuz-change-country/
// @supportURL      https://greasyfork.org/ru/scripts/445942-qobuz-change-country/feedback
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/445942/Qobuz%3A%20Change%20Country.user.js
// @updateURL https://update.greasyfork.org/scripts/445942/Qobuz%3A%20Change%20Country.meta.js
// ==/UserScript==

(function (D, P) {
  'use strict';

  const DASH = '-';
  const SLASH = '/';

  function warn(text) {
    const details = {
      text: text,
      title: GM_info.script.name,
      timeout: 5000,
    };
    const fn = GM.notification || GM_notification;
    if (fn) fn(details);
  }

  function sub(str, sep) {
    if (str.startsWith(sep)) return str.substring(1);
    return str;
  }

  function firstPath(str, sep, entry) {
    const [first] = sub(str, sep).split(sep);
    if (first.includes(entry)) return first;
    return '';
  }

  const currentLocale = firstPath(P, SLASH, DASH);
  if (currentLocale === '') {
    const err =
      'Failed to extract locale for current page,' +
      'possible they change scheme of url!';
    warn(err);
    return;
  }

  const countries = D.querySelectorAll('.countries__items a');

  for (const country of countries) {
    const href = country.getAttribute('href');
    if (href === null) continue;
    const locale = firstPath(href, SLASH, DASH);
    if (locale === '') continue;
    const path = P.replace(currentLocale, locale);
    country.setAttribute('href', path);
  }

  const button = D.querySelector('[data-target="#modalCountries"]');
  const target = D.querySelector('.search-result-header, .product__header');
  if (button && target) {
    const cloned = button.cloneNode(true);
    cloned.style.margin = '0 10px 0 10px';
    target.appendChild(cloned);
  }
})(document, location.pathname);

