// ==UserScript==
// @name         YouTube Embed Video Description
// @namespace    GPT
// @version      1.0.8
// @description  Adds a button to the YouTube player to display the video description without conflicts, with a reliable download, Plain Text formatting, Close the button
// @description:ru  Добавляет кнопку в плеер YouTube для отображения описания видео без конфликтов, с надёжной загрузкой, plain text форматирование, с кнопкой закрыть
// @author       Wizzergod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://www.youtube.com/embed/*
// @match        *://www.youtube.com/watch?v=*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @resource     icon https://images.icon-icons.com/3361/PNG/512/communication_information_aid_disclaimer_customer_service_about_guide_help_info_icon_210836.png
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538933/YouTube%20Embed%20Video%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/538933/YouTube%20Embed%20Video%20Description.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const lang = navigator.language.startsWith('ru') ? 'ru' : 'en';
  const i18n = {
    ru: {
      title: 'Показать описание видео',
      loading: 'Загрузка описания...',
      notFound: 'Видео не найдено.',
      error: 'Ошибка загрузки описания.',
      close: '✖',
    },
    en: {
      title: 'Show video description',
      loading: 'Loading description...',
      notFound: 'Video not found.',
      error: 'Error loading description.',
      close: '✖',
    }
  };

  const t = i18n[lang];

  const iconURL = GM_getResourceURL('icon');

  GM_addStyle(`
    #wizzergod-yt-desc-btn {
      background-image: url(${iconURL});
      background-size: 26px 26px;
      background-repeat: no-repeat;
      background-position: center;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border: none;
      background-color: parent;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      ition: form 0.3s ease;
      z-index: 99999;
      margin: 0 8px;
    }
    #wizzergod-yt-desc-btn:hover {
      form: scale(1.15);
    }
    #wizzergod-yt-desc-btn:active {
      form: scale(0.9);
      background-color: rgba(255, 255, 255, 0.1);
    }

    #wizzergod-yt-desc-modal {
      position: fixed;
      top: 15vh;
      left: 10vw;
      width: 80vw;
      height: 50vh;
      background: rgba(17,17,17,0.95);
      color: white;
      padding: 20px;
      border-radius: 12px;
      z-index: 2147483647;
      display: none;
      flex-direction: column;
      resize: both;
      overflow: auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.8);
      font-family: Arial, sans-serif;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    #wizzergod-yt-desc-modal.show {
      display: flex;
    }
    #wizzergod-yt-desc-modal .close-btn {
      align-self: flex-end;
      font-size: 24px;
      cursor: pointer;
      padding: 5px 10px;
      user-select: none;
    }
    #wizzergod-yt-desc-modal .content {
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 14px;
      line-height: 1.4;
      flex-grow: 1;
      overflow-y: auto;
      text-align: center;
      margin-top: 10px;
    }
  `);

  function createButton() {
    const btn = document.createElement('button');
    btn.id = 'wizzergod-yt-desc-btn';
    btn.className = 'ytp-button';
    btn.title = t.title;
    btn.setAttribute('aria-label', t.title);
    btn.onclick = () => {
      toggleModal();
    };
    return btn;
  }

  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'wizzergod-yt-desc-modal';

    const close = document.createElement('div');
    close.className = 'close-btn';
    close.textContent = t.close;
    close.onclick = () => modal.classList.remove('show');

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = t.loading;

    modal.appendChild(close);
    modal.appendChild(content);
    document.body.appendChild(modal);

    return modal;
  }

  async function fetchDescription(videoId, modal) {
    try {
      const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, { cache: 'no-store' });
      const text = await res.text();
      const match = text.match(/"shortDescription":"(.*?)"/);
      const desc = match ? JSON.parse('"' + match[1] + '"') : t.notFound;

      const content = modal.querySelector('.content');
      content.textContent = desc;
    } catch (e) {
      const content = modal.querySelector('.content');
      content.textContent = t.error;
    }
  }

  function toggleModal() {
    let modal = document.getElementById('wizzergod-yt-desc-modal');
    if (!modal) modal = createModal();
    modal.classList.add('show');

    const content = modal.querySelector('.content');
    content.textContent = t.loading;

    const videoId = location.href.match(/embed\/([^?&]+)/)?.[1] || location.href.match(/[?&]v=([^?&]+)/)?.[1];
    if (videoId) {
      fetchDescription(videoId, modal);
    } else {
      content.textContent = t.notFound;
    }
  }

  function addButtonWhenReady() {
    const controlBarSelector = '.ytp-right-controls';
    const controls = document.querySelector(controlBarSelector);

    if (!controls) {
      setTimeout(addButtonWhenReady, 300);
      return;
    }

    if (document.getElementById('wizzergod-yt-desc-btn')) return;

    const btn = createButton();
    controls.insertBefore(btn, controls.firstChild);
  }

  const observer = new MutationObserver(() => {
    addButtonWhenReady();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  addButtonWhenReady();
})();
