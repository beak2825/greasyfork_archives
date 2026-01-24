// ==UserScript==
// @name       神乐直播间自动打卡
// @namespace  pyroho
// @version    2.2
// @description  一个简单的等待循环程序。有任何问题，欢迎反馈
// @author     PyroHo
// @match      https://www.douyu.com/*
// @run-at     document-start
// @grant      GM_xmlhttpRequest
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @icon       https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/462339/%E7%A5%9E%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/462339/%E7%A5%9E%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
  const originalConsole = console;
  const originalConsoleLog = console.log;

  Object.defineProperty(window, 'console', {
    get() {
      return originalConsole;
    },
    set() {
      throw new Error('console is read-only');
    },
    configurable: false
  });

  Object.defineProperty(console, 'log', {
    get() {
      return originalConsoleLog;
    },
    set() {
      throw new Error('console.log is read-only');
    },
    configurable: false
  });
})();

const CLOCKING_INTERVAL = 30 * 60 * 1000 + 10000; // 打卡间隔30分钟，单位为毫秒
const ROOM_ID = /(85894|122402|6566671|20415)/i.exec(window.location.href)?.[0] ?? 0; // 通过网页地址获取房间号
const TIME_SAVE = new Proxy({}, {
  get: (t, prop, r) => {
    const str = localStorage.getItem(`lastClockInTime${prop}`);
    return parseInt(str) || 0;
  },
  set: (t, prop, value, r) => localStorage.setItem(`lastClockInTime${prop}`, value),
  deleteProperty: (t, key) => localStorage.removeItem(`lastClockInTime${key}`),
});
let stopCountDown = (() => {});

// 插入按钮
function insertDom() {
  const toolbar = document.querySelector('div.ChatToolBar');
  // const chat = document.querySelector('.layout-Player-chat .Chat');
  const roomInfos = [
    ['星', '122402'],
    ['华', '85894'],
    ['粤', '6566671'],
    ['欧', '20415'],
  ];

  // 创建节点
  function createNode(tag, option = {}) {
    const node = document.createElement(tag);
    const noneProps = ['innerText', 'innerHTML', 'textContent', 'onclick'];
    Object.entries(option).forEach(([key, val]) => {
      if (key === 'class') {
        const clazz = (typeof val === 'string') ? [val] : val;
        node.classList.add(...clazz);
      } else if (noneProps.includes(key)) {
        node[key] = val;
      } else {
        node.setAttribute(key, val)
      }
    });
    return node;
  }

  roomInfos.forEach(([roomName, roomID]) => {
    const roomLink = createNode('a', {
      innerText: roomName,
      class: 'btn-ci',
      href: `/${roomID}`,
    });
    if (ROOM_ID === roomID) {
      roomLink.classList.add('btn-ci-cur');
      roomLink.removeAttribute('href');
    } else {
      // const iframe = createNode('iframe', {
      //   frameborder: 0,
      //   src: `//www.douyu.com/${roomID}`,
      // });
      // chat.appendChild(iframe);
    }
    toolbar.appendChild(roomLink);
  });

  const button = createNode('button', {
    innerText: '打卡',
    class: ['btn-ci', 'btn-clock-in'],
    onclick: () => autoClockIn(true),
  });
  toolbar.appendChild(button);
}

// 返回一个函数：调用即可停止
function startCoundDownIn(target, prop, { until = 0, onclose = () => { } }) {
  const endTime = new Date(Date.now() + until);
  const stop = setInterval(() => {
    const remainTime = new Date(endTime - Date.now());
    const timeStr = `${remainTime.getMinutes()}:${remainTime.getSeconds()}`;
    target.setAttribute(prop, `下次打卡：${timeStr}`);
    if (Date.now() > endTime) {
      clearInterval(stop);
      onclose();
    }
  }, 1000);
  return () => clearInterval(stop);
}

// 生成打卡文本
function getClockInText() {
  let suffix = new Date().toLocaleString().replaceAll('/', '-');
  return `#打卡#${suffix}`;
}

// 创建打卡，自带循环
function autoClockIn(force = false) {
  const textarea = document.querySelector('div.ChatSend-txt');
  const button = document.querySelector('button.ChatSend-button');
  const curr = Date.now(); // 获取当前时间
  const timeGoes = curr - TIME_SAVE[ROOM_ID]; // 已经流逝的时间
  let clockInRemain = CLOCKING_INTERVAL - timeGoes;
  textarea.setAttribute('maxlength', 2000);

  stopCountDown();
  if (force || timeGoes >= CLOCKING_INTERVAL) {
    const temp = textarea.innerText;

    textarea.innerText = getClockInText();
    // button.click();
    button.dispatchEvent(new Event('click', {
      bubbles: true, // 事件是否冒泡
      cancelable: true // 事件是否可取消
    }));

    TIME_SAVE[ROOM_ID] = curr; // 将本次打卡时间存储在本地存储中
    clockInRemain = CLOCKING_INTERVAL;

    textarea.innerText = temp;
  }

  stopCountDown = startCoundDownIn(textarea, 'placeholder', {
    until: clockInRemain,
    onclose: autoClockIn,
  });
}

function loadStyle(css) {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.appendChild(document.createTextNode(css));
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
}

// .layout-Player-aside .layout-Player-asideMainTop {
//   bottom: 228px;
// }
// .layout-Player-aside .layout-Player-chat .Chat {
//   height: 227px;
// }
const STYLE = `
  div[class*=host][class*=danmuItem] {
  display: none !important;
  }
  .btn-ci {
  display: inline-block;
  padding: 0 3px;
  border-radius: 3px;
  margin-right: 8px;
  vertical-align: middle;
  line-height: 1.5;
  font-size: 12px;
  cursor: pointer;
  color: #fff !important;
  background-color: #888 !important;
  }
  .btn-ci.btn-ci-cur {
  color: #7e7e7e !important;
  background-color: #464646 !important;
  /* cursor: not-allowed; */
  }
  .btn-ci.btn-clock-in {
  background-color: #4caf50 !important;
  }
`;

function removeOthersBut(selector) {
  const dom = document.querySelector(selector);
  document.head.appendChild(dom);
  document.body.innerHTML = '';
  document.body.appendChild(dom);
}

// 只在神乐直播间运行
ROOM_ID && (function loadApp(total = 1, stop = 0, fasrer = false) {
  // let once = true;
  if (document.readyState !== 'complete') {
    return setTimeout(() => loadApp(--total, stop), 300);
  }
  // if(window.frameElement) {
  //   once && removeOthersBut('.ChatSpeak');
  //   once = false;
  //   document.body.style.minWidth = 'initial';
  // } else {}
  if (!document.querySelector('.btn-clock-in')) {
    insertDom();
    loadStyle(STYLE);
  }
  stop || (stop = setTimeout(() => {
    stop = 0;
    if (document.querySelector('.btn-clock-in')) {
      autoClockIn();
    } else {
      loadApp(1, stop, true);
    }
  }, fasrer ? 0 : 4500));

})(100);
