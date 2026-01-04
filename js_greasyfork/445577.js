// ==UserScript==
// @name         Kinopoisk - AutoRedirection to Flicksbar
// @namespace    https://t.me/flicksbar
// @version      1.3.17
// @description  Дает возможность быстро перейти на зеркало Flicksbar, при открытии ссылки на фильм или сериал, автоматически предложит перейти и бесплатно ознакомиться, работает только на www.kinopoisk.ru, поэтому не помешает обладателям подписки.
// @author       Devitp001
// @match        https://www.kinopoisk.ru/series/*
// @match        https://www.kinopoisk.ru/film/*
// @match        https://www.google.com/*
// @icon         https://www.kinopoisk.ru/favicon.ico
// @icon64       https://www.kinopoisk.ru/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445577/Kinopoisk%20-%20AutoRedirection%20to%20Flicksbar.user.js
// @updateURL https://update.greasyfork.org/scripts/445577/Kinopoisk%20-%20AutoRedirection%20to%20Flicksbar.meta.js
// ==/UserScript==


const redirectURLaddress = 'https://flcksbr.top';

if (location.hostname.includes('google')) {
  'use strict';

  // Выбираем все ссылки на странице Google, которые ведут на kinopoisk.ru
  const links = document.querySelectorAll('a[href*="https://www.kinopoisk.ru/"]');

  // Фильтруем только ссылки на сериалы и фильмы
  const filteredLinks = Array.from(links).filter(function(link) {
    const href = link.getAttribute('href');
    const regex = /^https:\/\/www\.kinopoisk\.ru\/(film|series)\/[^/]+\/$/;
    return regex.test(href);
  });

  // Добавляем кнопку к каждой отфильтрованной ссылке
  filteredLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    const button = document.createElement('button');
    const flicksbarHref = href.replace('https://www.kinopoisk.ru', redirectURLaddress);
    button.textContent = 'F';
    button.addEventListener('click', function() {
      window.location.href = flicksbarHref;
    });
    link.parentNode.insertBefore(button, link.nextSibling);
  });
};

const currentUrl = window.location.origin + window.location.pathname;
const flicksbarUrl = currentUrl.replace('https://www.kinopoisk.ru', redirectURLaddress);

function goToFlicksbar() {
  const title = document.title.replace(/ — Кинопоиск/g, '').replace(/ — смотреть онлайн/g, '');
  const flicksbarParseURL = `${redirectURLaddress}${document.location.pathname}?t=${title}`;
  const answer = confirm(`Перейти на ссылке: ${flicksbarParseURL}?`);
  if (answer) {
    window.location.href = flicksbarParseURL;
  }
}

if (currentUrl.includes('https://www.kinopoisk.ru/series/') || currentUrl.includes('https://www.kinopoisk.ru/film/')) {
  goToFlicksbar();
} else {
  console.log('Неверный формат ссылки');
}



