// ==UserScript==
// @name          ВКонтакте: исправление новомодных названий меню
// @description   VK обозвал группы сообществами, сообщения – мессенджером, а новости – лентой. Не беда, ведь есть этот скрипт! Работает настолько быстро, насколько это возможно
// @namespace     https://greasyfork.org/users/424058
// @version       3.4.0
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @author        https://vk.me/id222792011
// @icon          https://t1.gstatic.com/faviconV2?client=SOCIAL&url=http://vk.com&size=32
// @match         https://vk.com/*
// @match         https://m.vk.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.5.1/arrive.min.js#sha512-S6/M9HI1VpYN4XEK7JQjSyroulxrXPBX82ckxB/vWa9jR1XVaiFgSNRSDrgQ0U/FmFwkkhhIPq33ZKE5ZoDBHQ==
// @run-at        document-start
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/393972/%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%3A%20%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%D0%BE%D0%B4%D0%BD%D1%8B%D1%85%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B5%D0%BD%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/393972/%D0%92%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5%3A%20%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%D0%BE%D0%B4%D0%BD%D1%8B%D1%85%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%D0%BC%D0%B5%D0%BD%D1%8E.meta.js
// ==/UserScript==

// Есть вопросы или предложения? Можно написать мне тут: vk.me/id222792011 или через систему обсуждений Greasy Fork

/*
 История изменений:

 3.4.0 (06.12.2024) Для ПК версии в левом меню "Новости" переименовали на "Лента". Исправлено
                    Другие незначительные исправления и улучшения связанные с работой скрипта
 3.3.6 (15.11.2024) Для ПК и мобильной версии скрипт не работал в левом меню. Исправлено
 3.3.5 (18.08.2024) Для мобильной версии скрипт не работал в левом меню. Исправлено
 3.3.4 (31.10.2023) Для мобильной версии скрипт работал некорректно в левом меню. Исправлено
 3.3.3 (07.05.2023) Для ПК версии скрипт снова перестал работать в левом меню. Исправлено
 3.3.2 (17.02.2023) Для ПК версии скрипт перестал работать в левом меню. Исправлено
 3.3.1 (22.01.2022) Исправление нерабочей иконки скрипта в меню Tampermonkey
 3.3.0 (15.01.2022) Исправлено замедление которое случилось из-за 3.1.2
 3.2.0 (15.01.2022) Теперь работает и для мобильной версии (m.vk.com)
 3.1.2 (12.04.2021) Исправлен редкий случай когда скрипт не работал если вкладка была открыта в фоне
 3.0.1 (19.11.2020) Исправление заголовка вкладки не работало если перейти по ссылке типа vk.me/id1. Исправлено
 3.0.0 (13.11.2020) Обновлена основа скрипта. Теперь скрипт работает настолько быстро, насколько это возможно
 2.0.0 (07.11.2020) Обновлена основа скрипта. Удаление рекламы AliExpress из слов "Скидка", "Распродажа" и т.д.
                    Подробнее о рекламе AliExpress: https://habr.com/ru/news/t/526524/
 1.1.0 (03.10.2020) "Мессенджер" исправляется на "Сообщения"
 1.0.0 (19.12.2019) Релиз. Исправление "Сообщества" на "Группы" в левом меню и в заголовке вкладки
*/

/* jshint esversion: 6 */

(function() {
  'use strict';

  const NODES_TO_CHECK = {
    pc: [
      '#l_nwsf > a > span > span > div',
      '#l_msg > a > span > span > div',
      '#l_gr  > a > span > span > div',
    ].join(', '),

    mobile: [
      'nav > ol > li > a[href="/mail"] div.vkuiHeadline--level-1',
      'nav > ol > li > a[href="/groups"] div.vkuiHeadline--level-1',
    ].join(', '),
  };

  const REPLACE_LIST = {
    'Лента': 'Новости',
    'Сообщества': 'Группы',
    'Мессенджер': 'Сообщения',
  };

  (function main() {
    if (!document.title || !document.documentElement) {
      return setTimeout(main);
    }

    handleTitle();

    if (location.hostname.startsWith('m.')) {
      document.arrive(NODES_TO_CHECK.mobile, { existing: true }, fixNodeWord);
    } else {
      document.arrive(NODES_TO_CHECK.pc, { existing: true }, fixNodeWord);
    }
  }());


  // utils -------------------------------------------------------------------

  function currentPathIsGroupsOrMail() {
    return !!(
      location.pathname === '/im' ||
      location.pathname === '/mail' ||
      location.pathname === '/groups' ||
      location.pathname === '/al_im.php' ||
      location.pathname.match(/^\/write\d?/)
    );
  }

  function fixNodeWord(node) {
    const textNode = node.childNodes[0];

    if (textNode.nodeType !== Node.TEXT_NODE) return;

    for (const sought in REPLACE_LIST) {
      const replaceTo = REPLACE_LIST[sought];

      if (textNode.textContent === sought) {
        textNode.textContent = replaceTo;
        return;
      }
    }
  }

  function fixStringWords(str) {
    for (const sought in REPLACE_LIST) {
      const replaceTo = REPLACE_LIST[sought];

      str = str.replace(sought, replaceTo);
    }

    return str;
  }

  function handleTitle() {
    const titleNode = document.querySelector('title');

    // чтобы не переименовывать вкладку, например,
    // с каким-нибудь видео под названием "Сообщества..."
    if (currentPathIsGroupsOrMail()) {
      document.title = fixStringWords(document.title);
    }

    const titleObs = new MutationObserver((mutations, observer) => {
      if (currentPathIsGroupsOrMail()) {
        document.title = fixStringWords(document.title);
        observer.takeRecords();
      }
    });

    titleObs.observe(titleNode, { childList: true });
  }

  // ------------------------------------------------------------------- utils
}());
