// ==UserScript==
// @name         futaba-post-keybind
// @namespace    http://2chan.net/
// @version      0.2.0
// @description  ふたばちゃんねるの投稿フォーム周りにキーバインドを仕込みます
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @license      MIT
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/ua-parser-js@1.0.36/src/ua-parser.min.js
// @downloadURL https://update.greasyfork.org/scripts/475991/futaba-post-keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/475991/futaba-post-keybind.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const GLOBAL = {
    /** 「Enterキーで入力フォーム表示/非表示制御」が既にセットされているか */ isEnableEnterKeyEvent: false,
    /** 入力エリアにフォーカスがあるか */ isTextareaFocus: false,
  };
  const wait = (timer = 1000) => new Promise((resolve) => setTimeout(() => resolve(true), timer));
  const isMac = () => {
    const parser = typeof window.UAParser === 'function' ? new window.UAParser() : false;
    if (parser) {
      const os = (parser.getOS().name || '').toLowerCase();
      if (os.includes('mac')) {
        return true;
      }
    }
    return false;
  };
  const setEnterKeyEvent = () => {
    const formElm = document.querySelector('#postform') || document.querySelector('#fm');
    const textareaElm = document.querySelector('#ftxa');
    const reloadElm = document.querySelector('#fvw_loading') || document.querySelector('#contres > a:first-of-type');
    const submitElm = document.querySelector('#ftbl input[type="submit"]');
    if (!formElm || !textareaElm || !reloadElm || !submitElm) {
      return;
    }
    const hasMac = isMac();
    const scrollPos = () => {
      const hrPos = document.querySelector('.thre ~ hr')?.offsetTop ?? 0;
      const windowH = window.innerHeight;
      const result = hrPos - windowH;
      return result >= 0 ? result : 0;
    };
    const keydownHandler = async (e) => {
      const writeElm = document.querySelector('#write');
      const formOpacityValue = formElm.style.opacity;
      const isFormHidden = formOpacityValue === '0' || formOpacityValue === '';
      const isFormVisible = formOpacityValue === '1';
      const isCtrlKey = hasMac ? e.metaKey : e.ctrlKey;
      const textAreaValue = [...(textareaElm?.value || '')];
      if (e.key === 'Escape' && isFormVisible && writeElm) {
        writeElm.click();
      } else if (e.key === 'Enter' && textareaElm) {
        if (isFormHidden && writeElm) {
          writeElm.click();
          await wait(300);
          textareaElm.value = '';
        } else if (isCtrlKey && textAreaValue.length && GLOBAL.isTextareaFocus) {
          submitElm.click();
          textareaElm.value = '';
          await wait(1000);
          window.scrollTo({
            top: scrollPos(),
            left: 0,
            behavior: 'smooth',
          });
        }
      }
    };
    document.addEventListener('keydown', keydownHandler);
    textareaElm.addEventListener('focus', () => {
      GLOBAL.isTextareaFocus = true;
    });
    textareaElm.addEventListener('blur', () => {
      GLOBAL.isTextareaFocus = false;
    });
  };
  const changeSubmitText = () => {
    const submitElm = document.querySelector('#ftbl input[type="submit"]');
    if (submitElm) {
      const key = isMac() ? 'Cmd' : 'Ctrl';
      submitElm.value = `返信(${key}+Enter)`;
    }
  };
  const initialize = () => {
    if (GLOBAL.isEnableEnterKeyEvent === false) {
      GLOBAL.isEnableEnterKeyEvent = true;
      setEnterKeyEvent();
      changeSubmitText();
    }
  };
  initialize();
  window.addEventListener('load', () => initialize());
})();
