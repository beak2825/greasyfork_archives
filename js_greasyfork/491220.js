// ==UserScript==
// @name         かんたんdel
// @namespace    https://2chan.net/
// @version      1.0.1
// @description  ふたばちゃんねるの削除依頼(del)をワンクリックで送信します
// @author       pissman
// @match        https://*.2chan.net/*/res/*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/491220/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93del.user.js
// @updateURL https://update.greasyfork.org/scripts/491220/%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93del.meta.js
// ==/UserScript==
(() => {
  const styleTag = `<style id="futaba-easy-del">
    #futaba-easy-del-toast {
      display: none;
      opacity: 0;
      position: fixed;
      top: 30px;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px 20px;
      background-color: #555;
      color: #fff;
      border-radius: 5px;
      animation: 1.5s linear toast;
    }
    @keyframes toast {
      0% {
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    .easy-del-link {
      color: maroon;
      margin-left: 12px;
      margin-right: 12px;
    }
  </style>`;
  const toastTag = '<div id="futaba-easy-del-toast"></div>';
  const delInterval = 3000;
  const deledHistoriesKey = `futaba-easy-del/deled/${window.location.host}`;
  const deledHistoriesLimit = 1000;
  const responseBodySameIP = '同じIPアドレスからの削除依頼があります';
  let deledHistories = [];

  const changeDelLinkState = (delLink, state) => {
    switch (state) {
      case 'initial':
        delLink.innerText = 'del';
        delLink.dataset.done = '';
        break;
      case 'running':
        delLink.innerText = 'del中…';
        delLink.dataset.done = 'true';
        break;
      case 'done':
        delLink.innerText = 'del済';
        delLink.dataset.done = 'true';
        break;
      default:
        break;
    }
  };

  const postDel = async (resNo) => {
    const boardId = window.location.pathname.split('/').filter(Boolean)[0];
    const response = await fetch(`${window.location.protocol}//${window.location.host}/del.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `mode=post&b=${boardId}&d=${resNo}&reason=110&responsemode=ajax`,
    });
    const arrayBuffer = await response.arrayBuffer();
    return new TextDecoder('shift-jis').decode(arrayBuffer);
  };

  const showToast = (body) => {
    const toast = document.getElementById('futaba-easy-del-toast');
    toast.innerText = body;
    toast.style.display = 'block';
  };

  const registerToastEvent = () => {
    const toast = document.getElementById('futaba-easy-del-toast');
    toast.addEventListener('animationend', () => {
      toast.style.display = 'none';
    });
  };

  const recordDeledNo = (resNo) => {
    if (deledHistories.includes(resNo)) return;

    deledHistories.push(resNo);
    if (deledHistories.length > deledHistoriesLimit) {
      deledHistories.shift();
    }
    localStorage.setItem(deledHistoriesKey, JSON.stringify(deledHistories));
  };

  const loadDeledHistories = () => {
    const deledHistoriesJSON = localStorage.getItem(deledHistoriesKey);
    if (deledHistoriesJSON) {
      deledHistories = JSON.parse(deledHistoriesJSON);
    }
  };

  const delWithLock = (delLink) => {
    if (delLink.dataset.done) return;

    changeDelLinkState(delLink, 'running');
    const resNo = Number(delLink.dataset.resNo);

    navigator.locks.request('futaba-easy-del', async () => {
      const responseBody = await postDel(resNo);
      if (responseBody === 'ok') {
        showToast(`No.${resNo}をdelしました。`);
        recordDeledNo(resNo);
        changeDelLinkState(delLink, 'done');
      } else if (responseBody === responseBodySameIP) {
        showToast(responseBody);
        recordDeledNo(resNo);
        changeDelLinkState(delLink, 'done');
      } else {
        showToast(responseBody);
        changeDelLinkState(delLink, 'initial');
      }

      await new Promise((resolve) => {
        setTimeout(resolve, delInterval);
      });
    });
  };

  const appendDelMenu = (resElement, targetElement) => {
    if (resElement.querySelector('.easy-del-link')) return;

    const delLink = document.createElement('a');
    delLink.href = 'javascript:void(0);';
    delLink.className = 'easy-del-link';
    delLink.dataset.resNo = resElement.querySelector('.cno').innerText.substring(3);

    if (deledHistories.includes(Number(delLink.dataset.resNo))) {
      changeDelLinkState(delLink, 'done');
    } else {
      changeDelLinkState(delLink, 'initial');
    }

    // そうだねの前に追加
    targetElement.parentElement.insertBefore(delLink, targetElement);
  };

  const appendDelMenuToResPopup = (resElement) => {
    appendDelMenu(resElement, resElement.querySelector('.qsd'));
  };

  const appendDelMenuToRes = (resElement) => {
    appendDelMenu(resElement, resElement.querySelector('.sod'));
  };

  const loadDelMenus = () => {
    // スレ本文
    const bodyElement = document.querySelector('.thre');
    if (bodyElement) {
      appendDelMenuToRes(bodyElement);
    }
    // レス
    const resElements = document.querySelectorAll('.rtd');
    resElements.forEach((resElement) => {
      appendDelMenuToRes(resElement);
    });
  };

  const registerDelEvents = () => {
    const threadElement = document.querySelector('.thre');
    threadElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('easy-del-link')) {
        delWithLock(e.target);
      }
    });
  };

  const observeNewResElements = () => {
    const threadElement = document.querySelector('.thre');
    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node.className === 'qtd') {
            // 標準ポップアップ
            appendDelMenuToResPopup(node);
          } else if (node instanceof Element) {
            const resElements = node.querySelectorAll('.rtd');
            resElements.forEach((resElement) => {
              appendDelMenuToRes(resElement);
            });
          }
        });
      });
    });
    // リロード
    observer.observe(threadElement, { childList: true });

    // ふたクロのレスポップアップ
    const resPopupAreaElement = document.getElementById('respopup_area');
    if (resPopupAreaElement) {
      observer.observe(resPopupAreaElement, { childList: true });
    }
  };

  const loadInitialTags = () => {
    document.head.insertAdjacentHTML('beforeend', styleTag);
    document.body.insertAdjacentHTML('beforeend', toastTag);
  };

  const initialize = () => {
    loadDeledHistories();
    loadInitialTags();
    loadDelMenus();
    observeNewResElements();
    registerDelEvents();
    registerToastEvent();
  };

  window.addEventListener('load', initialize);
})();
