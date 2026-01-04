// ==UserScript==
// @name              PTT 半自動登入
// @description       在登入畫面顯示獨立的密碼表單，以沿用瀏覽器內建密碼功能登入
// @version           1.1.0
// @license           MIT
// @author            bootleq
// @namespace         bootleq.com
// @homepageURL       https://github.com/bootleq/user-scripts
//
// @match             https://term.ptt.cc/*
// @run-at            document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496961/PTT%20%E5%8D%8A%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/496961/PTT%20%E5%8D%8A%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

// References:
// https://github.com/c910335/PTT-Chrome-Auto-Login
// https://greasyfork.org/zh-TW/scripts/35360-term-ptt-autologin
// https://greasyfork.org/zh-TW/scripts/368445-term-ptt-cc-自動登入
// https://greasyfork.org/zh-TW/scripts/372391-pttchrome-term-ptt-cc-add-on
// https://hidde.blog/making-password-managers-play-ball-with-your-login-form/

const loginQuestionClass = 'q7 b0';   // 登入頁訊息的 className
const loginQuestionText = '請輸入代號，或以 guest 參觀，或以 new 註冊: '; // 登入頁訊息的文字（注意包含末尾空白）
const disconnAlertText = '你斷線了!'; // 登入頁斷線提示框的文字（偵測用）
const findQuestionTimeout = 6000;     // 偵測登入頁的等待時間（ms），逾時則放棄
const containerId = 'PTTSemiLogin';   // 插入表單的 HTML id
const dialogHeader = '標準表單登入';  // 插入表單的標題文字
const hideIcon = '--';                // 插入表單的「暫時隱藏」按鈕文字
const closeIcon = '✖';                // 插入表單的「關閉」按鈕文字
const messagePrefix = containerId;    // 使用 console.log 時的固定訊息開頭

const formHTML = `
  <dialog>
    <div class='header'>
      <span>${dialogHeader}</span>
      <div class='actions'>
        <button data-action="hide" type="button">${hideIcon}</button>
        <button data-action="close" type="button">${closeIcon}</button>
      </div>
    </div>
    <div class='hint-for-disconnected' style='display: none'>已斷線，請連線後再試</div>
    <form method="dialog">
      <fieldset>
        <label>
          代號
          <input type="text" name="id" autocomplete="username" required autofocus>
        </label>
        <label>
          密碼
          <input type="password" name="password" autocomplete="current-password" required>
        </label>
      </fieldset>

      <button>送出</button>
    </form>
  </dialog>
  `;

const globalStyle = `
  :root {
    --${containerId}-gray-color: rgba(0, 0, 0, 0.6);
  }

  #${containerId} > dialog {
    padding: 0 1.5em 2em;
    font-size: initial;
    overflow: hidden;
    background-color: rgba(255, 255, 255, .85);
    border: 6px solid var(--${containerId}-gray-color);
    border-radius: 15px;
  }

  #${containerId} div.header {
    margin: 0.7em 0 1.9em;
    display: flex;
    justify-content: space-between;
    color: var(--${containerId}-gray-color);
    opacity: 0.6;
  }

  #${containerId} div.actions {
    margin-left: auto;
  }

  #${containerId} div.actions button {
    border: none;
    background: none;
    opacity: 0.6;
  }

  #${containerId} fieldset {
    display: inline-block;
  }

  #${containerId} label {
    margin-right: 8px;
    font-weight: normal;
  }

  #${containerId} label > input {
    margin: 0 4px;
  }

  #${containerId} .hint-for-disconnected {
    padding: 0.5em;
    margin: -0.8em 1em 1.2em;
    font-size: larger;
    font-weight: bold;
    text-align: center;
    background-color: black;
    color: red;
  }
`;

const stopPropagation = e => e.stopPropagation();

const findQuestion = () => {
  // 預期登入頁會出現的 HTML 內容：
  // <span class="q7 b0">請輸入代號，或以 guest 參觀，或以 new 註冊: </span>
  let xpath = `//span[@class='${loginQuestionClass}' and text() = '${loginQuestionText}']`;
  let result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  return result.snapshotLength === 1;
};

const waitLoginPage = function (interval, timeout) {
  return new Promise((resolve, reject) => {
    let startTime = Date.now();

    const id = setInterval(() => {
      if (findQuestion()) {
        clearInterval(id);
        resolve();
      }

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= timeout) {
        clearInterval(id);
        reject();
      }
    }, interval);
  });
};

const sendEnter = function (input) {
  input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', keyCode: 13, which: 13, bubbles: true}));
};

const doLogin = function (id, password) {
  let $t = document.getElementById('t');

  $t.value = id;
  $t.dispatchEvent(new Event('input'));
  sendEnter($t);

  $t.value = password;
  $t.dispatchEvent(new Event('input'));
  sendEnter($t);
};

const hasDisconnected = () => {
  const topAlert = document.querySelector('#reactAlert');
  return (topAlert && topAlert.querySelector('h4')?.textContent === disconnAlertText);
};

const hintForDisconnected = ($dialog) => {
  $dialog.querySelector('.hint-for-disconnected').style.display = 'block';
};

const insertLoginForm = function () {
  const $div = document.createElement('div');
  $div.innerHTML = formHTML;
  $div.id = containerId;

  document.body.appendChild($div);

  const $dialog = $div.querySelector('dialog');

  // 避免事件傳遞到頂層 PttChrome 的 handler，焦點管理會錯亂
  ['keydown', 'keyup', 'keypress'].forEach(eventName => {
    $div.addEventListener(eventName, stopPropagation);
  });

  $dialog.addEventListener('close', destroy);

  // Submit 按鈕
  $div.querySelector('form').addEventListener('submit', e => {
    if (hasDisconnected()) {
      hintForDisconnected($dialog);
      e.preventDefault();
      return;
    }

    let data = new FormData(e.target);

    if (needPasswordCredential()) {
      if ('PasswordCredential' in window) {
        const cred = {
          id: data.get('id'),
          password: data.get('password')
        };
        navigator.credentials.store(new PasswordCredential(cred));
      } else {
        log('瀏覽器不支援 PasswordCredential，可能無法記憶密碼');
      }
    }

    doLogin(data.get('id'), data.get('password'));
    destroy();
  });

  // Close 按鈕
  $div.querySelector('button[data-action="close"]').addEventListener('click', () => {
    $dialog.close();
  });

  // Hide 按鈕
  const hideBtn = $div.querySelector('button[data-action="hide"]');
  hideBtn.addEventListener('mousedown', () => { $dialog.style.opacity = 0.05; });
  ['mouseup', 'mouseout'].forEach(eventName => {
    hideBtn.addEventListener(eventName, () => { $dialog.style.opacity = 1; });
  });

  return $dialog;
};

const insertStyle = function (css) {
  const head = document.querySelector('head');
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
};

const log = function (...args) {
  console.log(`[${messagePrefix}]`, ...args);
};

const needPasswordCredential = function () {
  // Chrome 不會自動偵測到登入，所以「需要」用 PasswordCredential 要求儲存；
  // Firefox 目前 (126.0.1) 未支援 PasswordCredential，未來也許能統一作法
  if (GM_info?.platform?.name === 'firefox' || navigator.userAgent.includes('Firefox')) {
    return false;
  }

  return true;
};

const destroy = function () {
  document.getElementById(containerId).remove();
};

const onInit = function () {
  waitLoginPage(500, findQuestionTimeout).then(() => {
    insertStyle(globalStyle);
    let dialog = insertLoginForm();
    dialog.showModal();
  }).catch(() => {
    log('找不到「請輸入代號...」文字，放棄登入');
  });
};

onInit();
