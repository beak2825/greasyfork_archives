// ==UserScript==
// @name         futa-options
// @namespace    http://2chan.net/
// @version      0.1.0
// @description  ふたばちゃんねるを観る上で快適にするやつまとめ
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @match        http://kako.futakuro.com/futa/*
// @match        https://kako.futakuro.com/futa/*
// @match        https://tsumanne.net/si/data/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @resource     spStyle https://greasyfork.org/scripts/472499-futaba-sp-style/code/futaba-sp-style.user.css?v=0.2.0
// @resource     darkTheme https://greasyfork.org/scripts/472501-futaba-dark-theme/code/futaba-dark-theme.user.css?v=0.2.0
// @license      MIT
// @run-at       document-idle
// @connect      2chan.net
// @connect      *.2chan.net
// @connect      tsumanne.net
// @downloadURL https://update.greasyfork.org/scripts/472542/futa-options.user.js
// @updateURL https://update.greasyfork.org/scripts/472542/futa-options.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isDarkTheme = GM_getValue('isDarkTheme', false);
  const userjsStyle = `<style id="futaoptions-style">
  .futaoptions-dialog {
    position: fixed;
    right: 16px;
    bottom: 16px;
    padding: 8px 24px;
    max-width: 200px;
    line-height: 1.5;
    color: #fff;
    font-size: 1rem;
    background-color: #3e8ed0;
    border-radius: 6px;
    opacity: 1;
    transition: all 0.3s ease;
    transform: translateY(0px);
    z-index: 10000;
  }
  .futaoptions-dialog.is-hidden {
    opacity: 0;
    transform: translateY(100px);
  }
  .futaoptions-dialog.is-info {
    background-color: #3e8ed0;
    color: #fff;
  }
  .futaoptions-dialog.is-danger {
    background-color: #f14668;
    color: #fff;
  }
  .futaoptions-icon {
    position: fixed;
    right: 16px;
    bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    width: 40px;
    height: 40px;
    z-index: 9999;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgb(0 0 0 / 30%);
    cursor: pointer;
  }
  .futaoptions-icon::before {
    display: block;
    width: 24px;
    height: 24px;
    content: "";
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='100px' height='100px'%3E%3Cpath d='M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    transition: transform 0.3s ease;
    transform: rotate(0deg);
  }
  .futaoptions-icon.is-active::before {
    transform: rotate(180deg);
  }
  .futaoptions-settings {
    position: fixed;
    bottom: 72px;
    right: 16px;
    display: flex;
    flex-direction: column;
    padding: 16px;
    max-width: 80%;
    width: calc(350px - 32px);
    height: fit-content;
    color: #202020;
    background-color: #fff;
    border-radius: 6px;
    transition: transform 0.3s ease;
    transform: translateX(400px);
    z-index: 10001;
  }
  .futaoptions-settings p {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .futaoptions-settings p span {
    font-size: 13px;
  }
  .futaoptions-settings textarea {
    margin-top: 8px;
    padding: 8px;
    height: 150px;
    max-height: 400px;
    min-height: 100px;
    line-height: 1.3;
    letter-spacing: 0.5px;
    font-weight: 400;
    font-family: Verdana;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }
  .futaoptions-settings button {
    margin-top: 16px;
    padding: 8px 16px;
    width: fit-content;
    color: #fff;
    font-size: 13px;
    border: 0px;
    border-radius: 4px;
    background-color: #00d1b2;
    appearance: none;
    cursor: pointer;
  }
  .futaoptions-settings button:active {
    filter: saturate(150%);
  }
  .futaoptions-settings.is-visible {
    transform: translateX(0);
  }
  </style>`;
  const GLOBAL = {
    stickyObserver: undefined,
  };
  const addStyle = (data, id) => {
    const style = `<style id="${id}">${data}</style>`;
    document.head.insertAdjacentHTML('beforeend', style);
  };
  const createBtn = ({ id, textContent }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = id;
    btn.textContent = textContent;
    return btn;
  };
  const setStickyForm = () => {
    const formElm = document.querySelector('table[width="100%"]:has(th[bgcolor="#e04000"]) + #fm');
    if (!formElm) return;
    const cloneFormElm = formElm.cloneNode(true);
    if (cloneFormElm instanceof Element) {
      cloneFormElm.classList.add('futaoptions-form');
      const infoElm = cloneFormElm.querySelector('.ftb2');
      document.body.insertAdjacentElement('beforeend', cloneFormElm);
      formElm.remove();
      const resBtnElm = createBtn({
        id: 'futaoptions-resBtn',
        textContent: '書き込み',
      });
      document.body.insertAdjacentElement('beforeend', resBtnElm);
      resBtnElm.addEventListener('touchstart', () => cloneFormElm.classList.toggle('is-visible'));
      if (infoElm) {
        const div = document.createElement('div');
        const infoBtnElm = createBtn({
          id: 'futaoptions-infoBtn',
          textContent: '情報',
        });
        const eraseBtnElm = createBtn({
          id: 'futaoptions-eraseBtn',
          textContent: '全消去',
        });
        div.classList.add('futaoptions-btnWrap');
        div.insertAdjacentElement('beforeend', infoBtnElm);
        div.insertAdjacentElement('beforeend', eraseBtnElm);
        infoElm.insertAdjacentElement('beforebegin', div);
        infoBtnElm.addEventListener('touchstart', () => infoElm.classList.toggle('is-open'));
        eraseBtnElm.addEventListener('touchstart', () => {
          const textareaElm = document.querySelector('.futaoptions-form #ftxa');
          if (textareaElm instanceof HTMLTextAreaElement) {
            textareaElm.value = '';
          }
        });
      }
      return resBtnElm;
    }
    return false;
  };
  const stickyObserver = (resElm) => {
    if (GLOBAL.stickyObserver) {
      GLOBAL.stickyObserver.disconnect();
    }
    const threadElm = document.querySelector('.thre');
    const options = {
      rootMargin: '0px 0px -100% 0px',
    };
    GLOBAL.stickyObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        resElm.classList.add('is-sticky');
      } else {
        resElm.classList.remove('is-sticky');
      }
    }, options);
    if (threadElm) {
      GLOBAL.stickyObserver.observe(threadElm);
    }
  };
  const setMobileStyle = () => {
    document.documentElement.style.setProperty('--device-width', `${screen.width}`);
    const viewportElm = document.querySelector('meta[name="viewport"]');
    if (viewportElm === null) {
      const metaCode = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">`;
      document.head.insertAdjacentHTML('beforeend', metaCode);
    } else {
      viewportElm.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
    }
    document.querySelectorAll('iframe').forEach((el) => (el.scrolling = 'no'));
    addStyle(GM_getResourceText('spStyle'), 'userjs-sp-style');
    const resBtnElm = setStickyForm();
    if (resBtnElm instanceof HTMLButtonElement) {
      stickyObserver(resBtnElm);
    }
  };
  if (isMobile) {
    setMobileStyle();
  }
  if (isDarkTheme) {
    addStyle(GM_getResourceText('darkTheme'), 'userjs-dark-theme');
  }
  if (document.querySelector('#futaoptions-style') === null) {
    document.head.insertAdjacentHTML('beforeend', userjsStyle);
  }
  const delay = (time = 500) => new Promise((resolve) => setTimeout(() => resolve(true), time));
  const getStorageValue = async () => {
    const defaultValue = '["twitch.tv/rtainjapan","horaro.org/raidrta"]';
    const storageValue = await GM_getValue('futaoptions-condition');
    return JSON.parse(storageValue || defaultValue);
  };
  const setSetting = async () => {
    const value = (await getStorageValue()).join('\n');
    const toggleSetting = (e) => {
      const self = e.currentTarget;
      const settingElm = document.querySelector('[data-futaopt="settings"]');
      self.classList.toggle('is-active');
      settingElm?.classList.toggle('is-visible');
    };
    const saveSetting = async () => {
      const settingConditionElm = document.querySelector(`[data-futaopt="condition"]`);
      if (!settingConditionElm) return;
      const valueArray = settingConditionElm.value.split('\n').filter(Boolean);
      await GM_setValue('futaoptions-condition', JSON.stringify(valueArray));
      const settingElm = document.querySelector('[data-futaopt="settings"]');
      settingElm?.classList.remove('is-visible');
      await delay(300);
      location.reload();
    };
    const iconHTML = `<div class="futaoptions-icon" data-futaopt="icon"></div>`;
    const settingHTML = `<div class="futaoptions-settings" data-futaopt="settings">
      <p>スレ本文に以下の文字列がある場合のみ動作。改行でOR判定<br><span>※デフォルト値のようにURLの一部等の固有のキーワードを設定しないと全く関係の無い次スレに遷移する場合があります</span></p>
      <textarea data-futaopt="condition" class="futaoptions-settings-textarea">${value}</textarea>
      <button type="button" data-futaopt="save">条件を保存してリロード</button>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', iconHTML);
    document.body.insertAdjacentHTML('afterbegin', settingHTML);
    await delay(300);
    const settingIconElm = document.querySelector(`[data-futaopt="icon"]`);
    const settingSaveElm = document.querySelector(`[data-futaopt="save"]`);
    settingIconElm?.addEventListener('touchstart', toggleSetting);
    settingSaveElm?.addEventListener('touchstart', saveSetting);
  };
  // 良い感じのダイアログを出す
  const setDialog = async (dialogText, status) => {
    const html = `<div class="futaoptions-dialog is-hidden is-${status}">${dialogText}</div>`;
    const dialogElm = document.querySelector('.futaoptions-dialog');
    if (dialogElm) {
      dialogElm.remove();
    }
    document.body.insertAdjacentHTML('afterbegin', html);
    await delay(100);
    document.querySelector('.futaoptions-dialog')?.classList.remove('is-hidden');
  };
  const iconElm = document.querySelector('[data-futaopt="icon"]');
  const settingsElm = document.querySelector('[data-futaopt="settings"]');
  if (iconElm === null && settingsElm === null) {
    setSetting();
  }
})();
