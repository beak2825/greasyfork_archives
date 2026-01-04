// ==UserScript==
// @name         神乐直播间自动打卡
// @namespace    pyroho
// @version      2.1
// @description  一个简单的等待循环程序。有任何问题，欢迎反馈
// @author       PyroHo
// @match        https://www.douyu.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462339/%E7%A5%9E%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/462339/%E7%A5%9E%E4%B9%90%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==
const CLOCK_IN_INTERVAL = 30 * 60 * 1000 + 10000; // 打卡间隔30分钟，单位为毫秒
const ROOM_ID = /(85894|122402|6566671|20415)/i.exec(window.location.href)?.[0] ?? 0; // 通过网页地址获取房间号
const TimeSave = new Proxy({}, {
  get: (t, prop, r) => localStorage.getItem(`lastClockInTime${prop}`),
  set: (t, prop, value, r) => localStorage.setItem(`lastClockInTime${prop}`, value),
  deleteProperty: (t, key) => localStorage.removeItem(`lastClockInTime${key}`),
});
let timestop = ()=>{};
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

// 创建一个链接
function nodeLink(text, link) {
  let node = document.createElement("a");
  node.innerText = text;
  node.setAttribute('href', link);
  node.classList.add('btn-room-change');
  return node;
}
// 创建一个按钮节点
function nodeButton(text, onclick) {
    let btn = document.createElement("button");
    btn.addEventListener('click', onclick, false);
    btn.innerText = text;
    btn.classList.add('btn-ci', 'btn-clock-in');
    return btn;
}
// 插入按钮
function insertDom() {
  const wrap = document.querySelector('div.ChatToolBar');
  const domInfo = [ ['星', '85894']
    , ['华', '122402']
    , ['粤', '6566671']
    , ['欧', '20415']
  ];
  domInfo.forEach(([name, id]) => {
    let btn = nodeLink(name, `/${id}`);
    if(ROOM_ID === id) {
      btn.classList.add('btn-ci-cur');
      btn.removeAttribute('href');
    }
    btn.classList.add('btn-ci');
    wrap.appendChild(btn);
  });
  wrap.appendChild(nodeButton('打卡', () => autoClockIn(true)));
}
// 可读时间
function timeStr(ms) {
  const date = new Date(ms);
  return ['getMinutes', 'getSeconds'].map(f => date[f]()).join(':');
}
// 元素聚焦之后的一定时间内，保持元素聚焦
// function keepEleFocus(el, time = 8000) {
//   let timeout = false;
//   const setTimer = () => {
//     timeout = setTimeout(() => timeout=false, time)
//   };
//   const resetTimer = _.throttle(() => {
//     if(timeout) {
//       el.focus();
//       clearTimeout(timeout);
//       setTimer();
//     }
//   }, 300, { leading: true, trailing: true });
  
//   el.addEventListener('focus', () => timeout || setTimer(), false);

//   el.addEventListener('blur', resetTimer, false);
//   el.addEventListener('input', resetTimer, false);
// }
// 一秒钟刷新一次时间
// 返回一个函数：调用即可停止
function loopShowTimeInElement({ele, prop, delay=0, onclose=()=>{}}) {
  const targetTime = new Date(Date.now() + delay);
  let stop;
  (function updateTime() {
    ele.setAttribute(prop, `下次打卡：${timeStr(targetTime - Date.now())}`)
    if(Date.now() > targetTime) {
      clearTimeout(stop);
      onclose();
    } else {
      stop = setTimeout(updateTime, 1000);
    }
  })();
  return () => clearTimeout(stop);
}
// 创建打卡，自带循环
function autoClockIn(force = false) {
  const textarea = document.querySelector('textarea.ChatSend-txt');
  const button = document.querySelector('div.ChatSend-button');
  
  // keepEleFocus(textarea);

  const lastClockIn = parseInt(TimeSave[ROOM_ID]) || 0; // 获取上次打卡时间
  const now = Date.now(); // 获取当前时间
  const timeGoes = now - lastClockIn;
  let nextClockInDelay = CLOCK_IN_INTERVAL-timeGoes;

  timestop();
  if (force || timeGoes >= CLOCK_IN_INTERVAL) {
    const temp = textarea.value;
    // 如果上次打卡时间不存在或距离当前时间已经超过了30分钟，则进行打卡操作
    textarea.value = "#打卡";
    button.click();
    textarea.value = temp;
    TimeSave[ROOM_ID] = now; // 将本次打卡时间存储在本地存储中
    nextClockInDelay = CLOCK_IN_INTERVAL;
  }

  timestop = loopShowTimeInElement({
    ele: textarea,
    prop: 'placeholder',
    delay: nextClockInDelay,
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

ROOM_ID && (function loadApp(total, stop=0) {
  const appLoaded = document.readyState === 'complete'
                  && document.querySelector('.btn-clock-in') === null;
  if(appLoaded) {
    insertDom();
    loadStyle(STYLE);
    // clearTimeout(stop);
    stop || (stop = setTimeout(autoClockIn, 4500));
  }
  setTimeout(() => loadApp(--total, stop), 300);
})(100);
