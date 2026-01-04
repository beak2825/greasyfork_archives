// ==UserScript==
// @name           Twitter (X): Скрыть Текстовые Публикации
// @name:en        Twitter (X): Hide Text Posts
// @name:ru        Twitter (X): Скрыть Текстовые Публикации
// @name:zh        Twitter (X): 隐藏文本出版物
// @namespace      http://tampermonkey.net/
// @version        3.3
// @description    Сделайте ленту публикаций чище
// @description:en Make your feed cleaner
// @description:ru Сделайте ленту публикаций чище
// @description:zh 使出版物提要更清洁
// @author         Grihail
// @match          https://twitter.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant          GM_setValue
// @grant          GM_getValue
// @license        CC-BY
// @downloadURL https://update.greasyfork.org/scripts/475052/Twitter%20%28X%29%3A%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%A2%D0%B5%D0%BA%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/475052/Twitter%20%28X%29%3A%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%A2%D0%B5%D0%BA%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B5%20%D0%9F%D1%83%D0%B1%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==
 
//Локализация
const pageLanguage = document.documentElement.lang.toLowerCase();
const currentLanguage = pageLanguage.startsWith('ru') ? 'ru' : (pageLanguage.startsWith('zh') ? 'zh' : 'en'); // Добавлено определение для китайского языка
const translations = {
    en: {title: 'Hide:', textPost: 'Text post', textReply: 'Text reply:', textRepost: 'Text repost', textQuote: 'Text quote', selfRepost: 'Self repost',
    },
    ru: {title: 'Скрыть:', textPost: 'Текстовый пост', textReply: 'Текстовый ответ:', textRepost: 'Репост текста', textQuote: 'Цитата текста', selfRepost: 'Само-репост',
    },
    zh: {title: '隐藏：', textPost: '文本帖子', textReply: '文本回复：', textRepost: '文本转发', textQuote: '文本引用', selfRepost: '自我转发',
    }
};

// Интеграция интерфейса и функционал
function insertPostSettings() {
  const postSettingsHTML = `
    <div class="postSettings" style="border-radius: 16px; width: 90%; border-color: rgb(47, 51, 54); overflow: hidden; border-width: 1px; border-style: solid; display: flex; box-sizing: border-box; flex-direction: column; padding: 0 12px 12px 12px; margin-top: 16px;">
	<h2 style="margin-block: unset; display: flex; align-items: center; padding-left: 12px;" class="r-1h3ijdo r-1nao33i r-37j5jr r-adyw6z r-b88u0q r-135wba7 r-bcqeeo">
		<span>${translations[currentLanguage].title}</span></h2>
    <div class="textCheck" style="width: 90%;display: flex;justify-content: space-between;align-items: center;padding: 12px;">
    	<svg viewBox="0 0 24 24" style="margin-right: 12px;height: 1.25em;flex-shrink: 0;">
    	<g style="fill: #e7e9ea;">
        	<path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
    	<span class="r-1nao33i r-37j5jr r-a023e6 r-rjixqe" style="width: 100%;">${translations[currentLanguage].textPost}</span>
      <input type="checkbox" class="textPost" data-target-class="textPostHide" ${getCheckboxValue('textPost')}></input></div>
    <div class="replytextCheck" style="width: 90%;display: flex;justify-content: space-between;align-items: center;padding: 12px;">
    	<svg viewBox="0 0 24 24" style="margin-right: 12px;height: 1.25em;flex-shrink: 0;">
    	<g style="fill: #e7e9ea;"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
    	<span class="r-1nao33i r-37j5jr r-a023e6 r-rjixqe" style="width: 100%;">${translations[currentLanguage].textReply}</span>
    	<input type="checkbox" class="textReply" data-target-class="textReplyHide"${getCheckboxValue('textReply')}></input></div>
    <div class="repostCheck" style="width: 90%;display: flex;justify-content: space-between;align-items: center;padding: 12px;">
    	<svg viewBox="0 0 24 24" style="margin-right: 12px;height: 1.25em;flex-shrink: 0;">
    	<g style="fill: #e7e9ea;">
        	<path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
    	<span class="r-1nao33i r-37j5jr r-a023e6 r-rjixqe" style="width: 100%;">${translations[currentLanguage].textRepost}</span>
      <input type="checkbox" class="textRepost" data-target-class="textRepostHide"${getCheckboxValue('textRepost')}></input></div>
    <div class="selfrepostCheck" style="width: 90%;display: flex;justify-content: space-between;align-items: center;padding: 12px;">
        <svg viewBox="0 0 24 24" style="margin-right: 12px;height: 1.25em;flex-shrink: 0;">
	    <g style="fill: #e7e9ea;">
        	<path d="M14.23 2.854c.98-.977 2.56-.977 3.54 0l3.38 3.378c.97.977.97 2.559 0 3.536L9.91 21H3v-6.914L14.23 2.854zm2.12 1.414c-.19-.195-.51-.195-.7 0L5 14.914V19h4.09L19.73 8.354c.2-.196.2-.512 0-.708l-3.38-3.378zM14.75 19l-2 2H21v-2h-6.25z"></path></g></svg>
	    <span class="r-1nao33i r-37j5jr r-a023e6 r-rjixqe" style="width: 100%;">${translations[currentLanguage].textQuote}</span>
      <input type="checkbox" class="textQuote" data-target-class="textQuoteHide"${getCheckboxValue('textQuote')}></input></div>
    <div class="replyCheck" style="width: 90%;display: flex;justify-content: space-between;align-items: center;padding: 12px;">
    	<svg viewBox="0 0 24 24" style="margin-right: 12px;height: 1.25em;flex-shrink: 0;">
    	<g style="fill: #e7e9ea;">
        	<path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
    	<span class="r-1nao33i r-37j5jr r-a023e6 r-rjixqe" style="width: 100%;">${translations[currentLanguage].selfRepost}</span>
       <input type="checkbox" class="selfRepost" data-target-class="selfRepostHide"${getCheckboxValue('selfRepost')}></input></div></div>
  `;
   const targetSelector = "body > #react-root > div > div > div[data-at-shortcutkeys] > header > div > div > div > div:nth-child(1)";
  const targetElement = document.querySelector(targetSelector);

  if (!document.querySelector('.postSettings')) {
    targetElement.insertAdjacentHTML('beforeend', postSettingsHTML);

    const checkboxes = document.querySelectorAll('.postSettings input[type="checkbox"]');

    function updateVisibility() {
      if (window.location.href !== 'https://twitter.com/home') {
        // Если не на домашней странице Twitter, не обновляем видимость элементов
        return;
      }

      checkboxes.forEach(checkbox => {
        const dataAttribute = checkbox.getAttribute('data-target-class');
        const elementsToToggle = document.querySelectorAll(`.${dataAttribute}`);

        elementsToToggle.forEach(element => {
          element.style.display = checkbox.checked ? 'none' : 'block';
        });
      });

      // Сохраняем значения checkbox в localStorage
      setCheckboxValue('textPost', checkboxes[0].checked);
      setCheckboxValue('textReply', checkboxes[1].checked);
      setCheckboxValue('textRepost', checkboxes[2].checked);
      setCheckboxValue('textQuote', checkboxes[3].checked);
      setCheckboxValue('selfRepost', checkboxes[4].checked);
    }

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateVisibility);
    });

    setInterval(updateVisibility, 100);

    // Дополнительный код для управления видимостью интерфейса в зависимости от URL
    setInterval(() => {
      const currentURL = window.location.href;
      const postSettings = document.querySelector('.postSettings');
      if (currentURL === "https://twitter.com/home") {
        postSettings.style.opacity = '100%';
      } else {
        postSettings.style.opacity = '0%';
      }
    }, 700);
  }
}
// Функция для получения значения checkbox из localStorage
function getCheckboxValue(key) {
  const screenName = getCurrentUserScreenName();
  return localStorage.getItem(`${screenName}_${key}`) === 'false' ? '' : 'checked';
}
 
// Функция для сохранения значения checkbox в localStorage
function setCheckboxValue(key, value) {
  const screenName = getCurrentUserScreenName();
  localStorage.setItem(`${screenName}_${key}`, value);
}
 
// Функция для извлечения screenName из HTML кода
function extractScreenName(html) {
  var regex = /"screen_name":"([^"]+)"/;
  var match = html.match(regex);
 
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}
 // Функция для получения screenName текущего пользователя
function getCurrentUserScreenName() {
  var htmlCode = document.documentElement.outerHTML;
  var screenName = extractScreenName(htmlCode);
  return screenName ? screenName : 'unknown';
}
 
setInterval(function() {
  document.querySelectorAll('div:nth-child(1) > section > div:nth-child(2) > div > [data-testid="cellInnerDiv"]').forEach(function(element) {
    const media = element.querySelector('article > div > div > div:nth-child(2) > div:nth-child(2) > div[id] > div:not([id])');
    const reply = element.querySelector('article > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)');
    const lastReply = element.querySelector('article > div > div > div:nth-child(1) > div > div > div');
    const repost = element.querySelector('article > div > div > div:nth-child(1) > div > div > div > div');
    const quote = element.querySelector('article > div > div > div:nth-child(2) > div:nth-child(2) > div[id] > div[id]');
    const mediaQuote = element.querySelector('article > div > div > div:nth-child(2) > div:nth-child(2) > div[id] > div[id] > div[role] > div > div:nth-child(3)');

    const repostAuthor = element.querySelector('article > div > div > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div > div > div > a[href]');
    const postAuthor = element.querySelector('article > div > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div > a[href]');

    if (!media && !repost && !lastReply && !quote) {
      element.classList.add('textPostHide');
    }
    if (!media && (reply || lastReply)) {
      element.classList.add('textReplyHide');
    }
    if ((!media && repost) && (!reply || !lastReply)) {
      element.classList.add('textRepostHide');
    }
    if (!media && quote) {
      element.classList.add('textQuoteHide');
    }
    if (postAuthor && repostAuthor && postAuthor.href === repostAuthor.href) {
      element.classList.add('selfRepostHide');
    }})}, 1000);
 
// Основной код скрипта
setInterval(() => {
  const currentURL = window.location.href;
  if (currentURL === 'https://twitter.com/home') {
    insertPostSettings();
    addClassesToElements();
  }
}, 1000);