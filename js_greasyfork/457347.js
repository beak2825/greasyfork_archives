// ==UserScript==
// @name         futakuro-auto-thread
// @namespace    https://2chan.net/
// @version      1.2.0
// @description  スレ本文に含まれるキーワードを設定から保存していた場合、ふたクロの「新着レスに自動スクロール」を自動クリックしスレが落ちるか1000に行ったら次スレを探して移動する
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @icon         https://www.2chan.net/favicon.ico
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457347/futakuro-auto-thread.user.js
// @updateURL https://update.greasyfork.org/scripts/457347/futakuro-auto-thread.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const inlineStyle = `<style id="fat-style">
  .fat-dialog {
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
  .fat-dialog.is-hidden {
    opacity: 0;
    transform: translateY(100px);
  }
  .fat-dialog.is-info {
    background-color: #3e8ed0;
    color: #fff;
  }
  .fat-dialog.is-danger {
    background-color: #f14668;
    color: #fff;
  }
  .fat-icon {
    position: fixed;
    right: 16px;
    bottom: 16px;
    padding: 8px;
    width: 24px;
    height: 24px;
    z-index: 9999;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgb(0 0 0 / 30%);
    cursor: pointer;
  }
  .fat-icon::before {
    display: block;
    width: 24px;
    height: 24px;
    content: "";
    background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='100px' height='100px'%3E%3Cpath d='M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: cover;
    transition: all 0.3s ease;
    transform: rotate(0deg);
  }
  .fat-icon:hover::before {
    transform: rotate(180deg);
  }
  .fat-settings {
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
  .fat-settings p {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }
  .fat-settings p span {
    font-size: 13px;
  }
  .fat-settings textarea {
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
  .fat-settings button {
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
  .fat-settings button:hover {
    filter: saturate(130%);
  }
  .fat-settings button:active {
    filter: saturate(150%);
  }
  .fat-settings.is-visible {
    transform: translateX(0);
  }
  </style>`;
  document.head.insertAdjacentHTML('beforeend', inlineStyle);
  const GLOBAL = {
    isThreadEnd: false,
  };
  const delay = (time = 500) => new Promise((resolve) => setTimeout(() => resolve(true), time));
  const getStorageValue = async () => {
    const defaultValue = '["twitch.tv/rtainjapan","horaro.org/raidrta"]';
    const storageValue = await GM.getValue('fat-condition');
    return JSON.parse(storageValue || defaultValue);
  };
  const setSetting = async () => {
    const value = (await getStorageValue()).join('\n');
    const toggleSetting = () => {
      const settingElm = document.querySelector('[data-fat="settings"]');
      settingElm?.classList.toggle('is-visible');
    };
    const saveSetting = async () => {
      const settingConditionElm = document.querySelector(`[data-fat="condition"]`);
      if (!settingConditionElm) return;
      const valueArray = settingConditionElm.value.split('\n').filter(Boolean);
      await GM.setValue('fat-condition', JSON.stringify(valueArray));
      const settingElm = document.querySelector('[data-fat="settings"]');
      settingElm?.classList.remove('is-visible');
      await delay(300);
      location.reload();
    };
    const iconHTML = `<div class="fat-icon" data-fat="icon"></div>`;
    const settingHTML = `<div class="fat-settings" data-fat="settings">
      <p>スレ本文に以下の文字列がある場合のみ動作。改行でOR判定<br><span>※デフォルト値のようにURLの一部等の固有のキーワードを設定しないと全く関係の無い次スレに遷移する場合があります</span></p>
      <textarea data-fat="condition" class="fat-settings-textarea">${value}</textarea>
      <button type="button" data-fat="save">条件を保存してリロード</button>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', iconHTML);
    document.body.insertAdjacentHTML('afterbegin', settingHTML);
    await delay(300);
    const settingIconElm = document.querySelector(`[data-fat="icon"]`);
    settingIconElm?.addEventListener('click', toggleSetting);
    const settingSaveElm = document.querySelector(`[data-fat="save"]`);
    settingSaveElm?.addEventListener('click', saveSetting);
  };
  const removeDialog = () => {
    const dialogElm = document.querySelector('.fat-dialog');
    if (dialogElm) {
      dialogElm.remove();
    }
  };
  const setDialog = async (dialogText, status) => {
    const html = `<div class="fat-dialog is-hidden is-${status}">${dialogText}</div>`;
    removeDialog();
    document.body.insertAdjacentHTML('afterbegin', html);
    await delay(100);
    document.querySelector('.fat-dialog')?.classList.remove('is-hidden');
  };
  const getFutabaJson = async (path) => {
    const options = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
    };
    const result = await fetch(path, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.arrayBuffer();
      })
      .catch((err) => {
        throw new Error(err);
      });
    try {
      const textDecoder = new TextDecoder('utf-8');
      const futabaJson = JSON.parse(textDecoder.decode(result));
      return futabaJson;
    } catch (e) {
      const textDecoder = new TextDecoder('Shift_JIS');
      const html = textDecoder.decode(result);
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const bodyText = dom?.body?.textContent;
      if (bodyText) {
        setDialog(bodyText, 'danger');
        if (bodyText.includes('満員')) {
          await delay(20000);
          return {
            res: {},
            maxres: '',
            old: 0,
            dielong: '',
          };
        }
      }
      throw new Error(String(e));
    }
  };
  const checkThreadEnd = async () => {
    const threadNum = location.pathname.split('/')?.pop()?.replace('.htm', '') || '';
    const cnoElms = document.querySelectorAll('.cno');
    const lastElm = cnoElms?.[cnoElms.length - 1];
    const resNo = lastElm?.textContent?.replace('No.', '');
    if (!resNo || !threadNum) return Promise.resolve(false);
    const path = `/b/futaba.php?mode=json&res=${threadNum}&start=${resNo}&end=${resNo}`;
    const threadStatus = await getFutabaJson(path);
    const resCount = (() => {
      const res = threadStatus?.res;
      const resKeys = Object.keys(res || {});
      const count = resKeys.length;
      if (count) {
        const lastResNum = resKeys[count - 1];
        const lastRes = res?.[lastResNum];
        return lastRes?.rsc || 0;
      }
      return 0;
    })();
    if (threadStatus?.dielong) {
      const dieDate = new Date(threadStatus.dielong).getTime();
      const nowDate = new Date().getTime();
      if (nowDate > dieDate) {
        return Promise.resolve(true);
      }
    }
    if (threadStatus.maxres !== '' || (threadStatus.old === 1 && resCount >= 950)) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  };
  const autoMoveThreads = async (matchText, threadNo) => {
    const catalog = await getFutabaJson('/b/futaba.php?mode=json&sort=6');
    const res = catalog?.res;
    const threadKeys = Object.keys(res);
    const targetKeyArr = [];
    for (const threadKey of threadKeys) {
      const threadNoNum = Number(threadNo);
      const threadKeyNum = Number(threadKey);
      // 見ていたスレッド or 今のスレッドより古いものは飛ばす
      if (threadNo === threadKey || threadNoNum > threadKeyNum) continue;
      try {
        const threadText = res[threadKey].com ?? false;
        if (threadText && threadText.includes(matchText)) {
          targetKeyArr.push(threadKeyNum);
        }
      } catch (e) {
        throw new Error(String(e));
      }
    }
    if (targetKeyArr.length) {
      const processThreadKey = async (recentThreadKey) => {
        // 見ていたスレッドより古いスレッドしかないならfalse
        if (Number(threadNo) > recentThreadKey) {
          return Promise.resolve(false);
        }
        const threadStatus = await getFutabaJson(`/b/futaba.php?mode=json&res=${String(recentThreadKey)}`);
        const resCount = Object.keys(threadStatus?.res || {}).length;
        const isMin950 = resCount >= 0 && resCount < 950;
        const isNotMaxRes = threadStatus.maxres === '';
        const isNotOld = threadStatus.old === 0;
        const allOK = isMin950 && isNotMaxRes && isNotOld;
        // レス数が950未満、maxresが空、oldが0なら新規スレッドとみなす
        if (allOK) {
          return Promise.resolve(`/b/res/${recentThreadKey}.htm`);
        }
        return Promise.resolve(false);
      };
      try {
        while (targetKeyArr.length > 0) {
          // スレ立て重複した場合はスレ立てが早い方(threadKeyが小さい方)を優先するのでMath.min
          const recentThreadKey = targetKeyArr.reduce((a, b) => Math.min(a, b));
          const result = await processThreadKey(recentThreadKey);
          if (result) {
            return result;
          }
          // targetKeyArrが3件以上の場合recentThreadKeyはスレ落ちしてる可能性があるためやり直す
          const index = targetKeyArr.indexOf(recentThreadKey);
          if (index > -1) {
            targetKeyArr.splice(index, 1);
          }
        }
      } catch (e) {
        return Promise.resolve(false);
      }
    }
    return Promise.resolve(false);
  };
  const observeThreadEnd = async (matchText, threadNo) => {
    const sec = 1000;
    let count = 0;
    let fetchTimer = 0;
    let observeTimer = 0;
    let isRequestOK = false;
    let scrollEventHandler = () => {};
    let nextThreadCheckInterval = 10000;
    let observer = null;
    const getTime = () => {
      const zeroPadding = (num) => String(num).padStart(2, '0');
      const time = new Date();
      const hour = zeroPadding(time.getHours());
      const minutes = zeroPadding(time.getMinutes());
      const seconds = zeroPadding(time.getSeconds());
      return `${hour}:${minutes}:${seconds}`;
    };
    const updateCheckInterval = (interval) => {
      if (count > interval / sec) {
        interval = interval * 2;
      }
      return interval;
    };
    const tryMoveThreads = async () => {
      if (isRequestOK) return;
      isRequestOK = true;
      window.removeEventListener('scroll', scrollEventHandler);
      if (count >= 30) {
        setDialog('次スレッドは見つかりませんでした', 'danger');
        return;
      }
      count += 1;
      nextThreadCheckInterval = updateCheckInterval(nextThreadCheckInterval);
      const dialogText = `[${getTime()}] 次のスレッドを探しています...<br>${count}巡目(${
        nextThreadCheckInterval / sec
      }秒間隔)`;
      setDialog(dialogText, 'info');
      const result = await autoMoveThreads(matchText, threadNo);
      if (typeof result === 'string') {
        if (GLOBAL.isThreadEnd) {
          if (confirm('スレッドが終わっています。次スレに遷移しますか？')) {
            return (location.href = result);
          } else {
            removeDialog();
            return;
          }
        }
        return (location.href = result);
      }
      await delay(nextThreadCheckInterval);
      isRequestOK = false;
      void tryMoveThreads();
    };
    const disconnectTryMoveThreads = () => {
      if (observer) observer.disconnect();
      void tryMoveThreads();
    };
    const checkThreadEndExec = async () => {
      const isThreadEnd = await checkThreadEnd();
      if (isThreadEnd) {
        disconnectTryMoveThreads();
      }
    };
    const resetTimer = () => {
      if (fetchTimer) {
        clearTimeout(fetchTimer);
      }
      if (observeTimer) {
        clearInterval(observeTimer);
      }
    };
    scrollEventHandler = () => {
      resetTimer();
      fetchTimer = window.setTimeout(() => checkThreadEndExec(), 6000);
    };
    const threadDown = document.querySelector('#thread_down');
    const observeCallback = () => {
      // スレが落ちたらfutakuroによって出現するID
      const threadDown = document.querySelector('#thread_down');
      const threadStateText = document.querySelector('#bottom_stat');
      resetTimer();
      if (threadStateText !== null) {
        const isThreadEnd = threadStateText.textContent?.includes('スレッドが落ちました');
        const isThreadMax = threadStateText.textContent?.includes('スレが1000に達しました');
        if (isThreadEnd || isThreadMax) {
          disconnectTryMoveThreads();
        }
      }
      if (threadDown !== null) {
        disconnectTryMoveThreads();
      } else {
        observeTimer = window.setInterval(() => checkThreadEndExec(), 10000);
      }
    };
    const resMenuElm = document.querySelector('#res_menu');
    await checkThreadEndExec();
    if (threadDown !== null) {
      resetTimer();
      void tryMoveThreads();
    } else if (resMenuElm !== null) {
      observer = new MutationObserver(observeCallback);
      observer.observe(resMenuElm, {
        childList: true,
        subtree: true,
      });
    }
    window.addEventListener('scroll', scrollEventHandler, {
      passive: false,
    });
  };
  const checkAutoLiveScroll = async () => {
    /** スレ本文の要素 */ const threadTopText = document.querySelector('#master')?.innerText;
    if (typeof threadTopText === 'undefined') return;
    /** 新着レスに自動スクロールチェックボックス(futakuro) */ let liveScrollCheckbox =
      document.querySelector('#autolive_scroll');
    while (liveScrollCheckbox === null) {
      await delay(1000);
      liveScrollCheckbox = document.querySelector('#autolive_scroll');
    }
    const hasBody = typeof threadTopText === 'string';
    const values = await getStorageValue();
    const matchTargetText = values.find((word) => threadTopText.includes(word));
    const threadNo = document.querySelector('[data-res]')?.getAttribute('data-res');
    if (liveScrollCheckbox !== null && !liveScrollCheckbox.checked && hasBody && matchTargetText) {
      liveScrollCheckbox.click();
      if (threadNo) {
        observeThreadEnd(matchTargetText, threadNo);
      }
    }
  };
  const callback = async (_, observer) => {
    const liveWindowElm = document.querySelector('#livewindow');
    if (liveWindowElm !== null) {
      await delay(1000);
      void checkAutoLiveScroll();
      observer.disconnect();
    }
  };
  setSetting();
  GLOBAL.isThreadEnd = await checkThreadEnd();
  const observer = new MutationObserver(callback);
  const liveScrollCheckbox = document.querySelector('#autolive_scroll');
  if (liveScrollCheckbox === null) {
    observer.observe(document.body, {
      childList: true,
    });
  } else {
    void checkAutoLiveScroll();
  }
})();
