// ==UserScript==
// @name         Youtube smooth floating chat 丝滑悬浮弹幕
// @namespace    67373tools
// @version      0.1.32
// @description  Youtube floating chat 悬浮弹幕，丝滑滚动 # Danmaku barrage bullet curtain
// @author       XiaoMIHongZHaJi
// @match        https://www.youtube.com/*
// @match        https://www.twitch.tv/embed/*/chat?parent=*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500209/Youtube%20smooth%20floating%20chat%20%E4%B8%9D%E6%BB%91%E6%82%AC%E6%B5%AE%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500209/Youtube%20smooth%20floating%20chat%20%E4%B8%9D%E6%BB%91%E6%82%AC%E6%B5%AE%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

// ❤️ 广告：欢迎收看陈一发儿直播：https://67373.net
// 如果有 bug，在上面网站也可以找到反馈联系方式

// ✴️ 通用
localStorage.removeItem('danmuParams'); // 清除旧版数据;

let videoDoc = {}, configs;
if (!document.URL.startsWith('https://www.twitch.tv')) videoDoc = parent.document.querySelector('video').ownerDocument;
const defaultPosition =
  { top: 88, left: 58, maxHeight: 528, width: 528, fontSize: 15, gap: 3, transparent: 0.58 };
const defaultConfigs = {
  ...defaultPosition, showMode: 0, singleLine: false, /* 这里暂时不用但不要删除：*/fullLine: false,
  speed: 1, language: 'English', twitchLink: '', isTwitchActive: true,
  focusNames: [], highlightNames: [], blockNames: [],
  isFocusNames: false, isHighlightNames: false, isBlockNames: false,
};

const text = {
  English: {
    nextLanguage: '中文',
    menuSetting: 'Settings',
    menuResetPosition: 'Reset location',
    menuResetExceptNames: 'Reset all settings except username',
    menuResetAll: 'Reset all settings',
    menuResetAllConfirm: 'All settings will be reset, names lists will be cleared, continue?',
    modes: ['Show all', 'Short name', 'No name', 'Hide all'],
    fontSize: 'Font',
    speed: 'Speed',
    gap: 'Gap',
    transparency: 'Transparency',
    height: 'Height',
    settings: 'Settings',
    singleLine: 'Single Column',
    fullLine: 'Full line', // wasted
    twichTip: 'Twitch chat merge',
    twitchLinkPlaceholder: 'Enter Twitch room link',
    twitchUrlMatchAlert: 'The URL match failed. Please enter a valid Twitch room address.',
    focusMode: `Filter: Only show chats according to following rules`,
    highlightMode: `Highlight: highlight chats according to following rules`,
    blockMode: `Block: Chats that matching following rules will be blocked`,
    nameTip: `<p>Each line is a regular expression. By default, it filters usernames.
    <code>[chat]</code> indicates filtering chat content,
    <code>[off]</code> indicates that the rule is inactive.</p>
    <br/><p>Common filter examples:</p><ul>
      <li><code class="danmu-name-tip-code">chenyifaer</code> filters usernames containing "chenyifaer";</li>
      <li><code class="danmu-name-tip-code">^chenyifaer$</code>
        filters usernames exactly matching "chenyifaer";</li>
      <li><code class="danmu-name-tip-code">[chat]chenyifaer</code> filters messages containing "chenyifaer";</li>
      <li><code class="danmu-name-tip-code">[off]chenyifaer</code> indicates that this rule is not active;</li>
    </ul><br/><p>If you don't know how to write regular expressions, you can ask ChatGPT ~</p>`,
    cpoiedTip: 'Copied',
    popBoardConfirm: 'Close',
  },
  "中文": {
    nextLanguage: 'English',
    menuSetting: '设置',
    menuResetPosition: '重置位置',
    menuResetExceptNames: '重置除了名字列表外的所有设置',
    menuResetAll: '重置所有设置',
    menuResetAllConfirm: '所有设置都会重置，名字列表会被清空，是否继续',
    modes: ['全显示', '短用户名', '无用户名', '全隐藏'/*「全隐藏」这三个字不要改 */],
    fontSize: '字号',
    speed: '速度',
    gap: '间隔',
    transparency: '透明度',
    height: '高度',
    settings: '设置',
    singleLine: '单列',
    fullLine: '满行', // 弃用
    twichTip: 'Twitch 弹幕融合',
    twitchLinkPlaceholder: '请填入 Twitch 直播间链接',
    twitchUrlMatchAlert: '网址匹配失败，请输入正确的 Twitch 房间地址',
    focusMode: `过滤：只显示以下规则过滤弹幕`,
    highlightMode: `高亮：根据以下规则高亮弹幕`,
    blockMode: `屏蔽：屏蔽符合以下规则的弹幕`,
    nameTip: `<p>每行一条正则表达式。默认筛选用户名，
      <code>[chat]</code> 表示筛选弹幕，<code>[off]</code> 表示不生效。</p>
      <br/><p>常用筛选举例：</p>
      <ul><li><code class="danmu-name-tip-code">陈一发儿</code> 筛选包含「陈一发儿」的用户名；</li>
          <li><code class="danmu-name-tip-code">^陈一发儿$</code> 筛选等于「陈一发儿」的用户名；</li>
          <li><code class="danmu-name-tip-code">[chat]陈一发儿</code> 筛选包含「陈一发儿」的弹幕；</li>
          <li><code class="danmu-name-tip-code">[off]陈一发儿</code> 表示这条规则不生效；</li>
      </ul><br/><p>如果不会写正则表达式可以问 ChatGPT ~</p>`,
    cpoiedTip: '已复制',
    popBoardConfirm: '关闭',
  }
};

const twitchLinkEmbed = (link) => {
  if (link === '') return '';
  try {
    let name = link.match(/twitch\.tv\/(?:popout\/|embed\/|)([^\/?#]+)/)[1];
    return `https://www.twitch.tv/embed/${name}/chat?parent=www.youtube.com`;
  } catch {
    alert(text[configs.language].twitchUrlMatchAlert);
  };
};
// https://www.twitch.tv/popout/jinnytty/chat?popout=
// https://www.twitch.tv/embed/jinnytty/chat?parent=iframetester.com
// https://www.twitch.tv/jinnytty

function deepCopy(a) {
  try {
    return structuredClone(a);
  } catch (e) {
    console.log(e);
    return JSON.parse(JSON.stringify(a));
  }
};

getLocal();
function getLocal() {
  configs = deepCopy(defaultConfigs);
  const configsStr = localStorage.getItem('danmuConfigs') || '{}';
  configs = Object.assign({}, configs, JSON.parse(configsStr));
};
for (let key in configs) { // 删除旧版本的 key
  if (!(key in defaultConfigs)) delete configs[key];
};

setLocal();
function setLocal(params) {
  localStorage.setItem('danmuConfigs', JSON.stringify(Object.assign(configs, params)));
};

// ✴️ 主页面
if (location.href.startsWith('https://www.youtube.com/watch?v=')
  || location.href.startsWith('https://www.youtube.com/live/')) {
  let danmuEle;
  setStyle(); // 加 css 到 header
  danmuEleInit();
  function danmuEleInit() {
    let timer = setInterval(() => {
      if (document.querySelector('#danmu-ele')) {
        clearInterval(timer);
        return;
      }
      if (document.querySelector('#chat-container iframe')) { // 检测到iframe，说明不是普通视频页面
        try {
          danmuEle = getDanmuEle();
          danmuEle.danmuurl = videoDoc.URL;
          document.querySelector('body').appendChild(danmuEle)
        } catch (e) { console.log(e) };
      }
    }, 888);
    setTimeout(() => {
      clearInterval(timer);
    }, 28888) // 半分钟没检测到iframe，放弃
  }
  // 监听页面跳转事件
  (function (history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    function onStateChange(event) {
      let danmuEle = document.getElementById('danmu-ele');
      if (!danmuEle) {
        danmuEleInit();
      } else if (danmuEle.danmuurl != document.URL) danmuEle.parentNode.removeChild(danmuEle);
    };
    window.addEventListener('popstate', onStateChange);
    window.addEventListener('hashchange', onStateChange);
    history.pushState = function (state) {
      const result = pushState.apply(history, arguments);
      onStateChange({ state });
      return result;
    };
    history.replaceState = function (state) {
      const result = replaceState.apply(history, arguments);
      onStateChange({ state });
      return result;
    };
    const observer = new MutationObserver(() => {
      if (document.location.href !== observer.lastHref) {
        observer.lastHref = document.location.href;
        onStateChange({});
      }
    });
    observer.observe(document, { subtree: true, childList: true });
    observer.lastHref = document.location.href;
  })(window.history);

  // 监听 postMessage
  window.addEventListener('message', (event) => {
    if (!danmuEle) return;
    if (event.origin === 'https://www.twitch.tv') {
      let username = '';
      for (let i in event.data) {
        if (event.data[i][0] === 'username') {
          username = event.data[i][1];
          break;
        };
      };
      let content = '';
      for (let i in event.data) {
        if (event.data[i][0] === 'text') content += event.data[i][1];
      };
      let el = document.createElement('div');
      el.className = 'danmu-item';
      let matchChatRet = matchChat(username, content);
      if (matchChatRet.isNoShow) return;
      if (matchChatRet.isHighlight) el.className += ' danmu-highlight ';
      el.innerHTML += `<table><tbody><tr><td class="first-td"></td><td class="second-td"></td></tr></tbody></table>`
      for (let i in event.data) {
        switch (event.data[i][0]) {
          case 'img': {
            if (i == 0) {
              el.querySelector('.first-td').innerHTML += `<img src="${event.data[i][1]}">`
            } else {
              el.querySelector('.second-td').innerHTML += `<img src="${event.data[i][1]}">`
            }
            break;
          }
          case 'username':
            el.querySelector('.second-td').innerHTML += `<span class="danmu-username-long">${event.data[i][1]}：</span>`;
            el.querySelector('.second-td').innerHTML += `<span class="danmu-username-short">${event.data[i][1].substring(0, 1)}：</span>`;
            break;
          case 'text':
            el.querySelector('.second-td').innerHTML += event.data[i][1];
            break;
          default:
            break;
        };
      };
      danmuEle.querySelector('#danmu-content').appendChild(el);
      checkHeight(danmuEle);
    };
  });
};

// ✴️ YouTube chat iframe 页面
if (location.href.startsWith('https://www.youtube.com/live_chat')) {
  let danmuEle = parent.document.querySelector("#danmu-ele");
  if (document.readyState == "complete" || document.readyState == "loaded"
    || document.readyState == "interactive") {
    main();
  } else document.addEventListener("DOMContentLoaded", main);
  setInterval(getLocal, 1888); // 父页面操作的时候，很容易数据不同步。
  function main() {
    let config = { childList: true, subtree: true };
    let observer = new MutationObserver(mutations => {
      // 【】 if (mutations.length > 500) return; // 防止一次大量加载
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!danmuEle) {
            danmuEle = parent.document.querySelector("#danmu-ele");
            if (!danmuEle) return;
          };
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          if (!['yt-live-chat-text-message-renderer', 'yt-live-chat-paid-message-renderer', 'yt-live-chat-paid-sticker-renderer']
            .includes(node.tagName.toLowerCase())) return;
          if (mutations.length > 500 && node.getBoundingClientRect().right == 0) return;
          let el = digestYtChatDom(node);
          if (!el) return;
          danmuEle.querySelector('#danmu-content').appendChild(el);
          checkHeight(danmuEle);
        });
      });
    });
    let timer = setInterval(() => {
      let ytbChatEle = document.querySelector('#contents.style-scope.yt-live-chat-app');
      if (!ytbChatEle) return;
      clearInterval(timer);
      observer.observe(ytbChatEle, config);
    }, 888);
  };
};
// 检查不存在的元素
// getComputedStyle(a).display flex 无法判断
// getComputedStyle(a).visibility visible 无法判断
// a.getBoundingClientRect().width 911 无法判断
// a.getBoundingClientRect().height 32 无法判断
// a.getBoundingClientRect(). top right bottom left 0 正常是只有 left=0

// ✴️ Twitch chat iframe 页面
if (document.URL.match(/https:\/\/www\.twitch\.tv\/embed\/[^\/]+\/chat\?parent=/)) {
  console.log('进入了 Twitch 的 chat iframe 页面：', document.URL);
  let config = { childList: true, subtree: true };
  let timer = setInterval(() => {
    let watchEl = document.querySelector('.simplebar-content');
    if (!watchEl) return;
    clearInterval(timer);
    observer.observe(watchEl, config);
  }, 888);
  let observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (!node.parentElement.parentElement.className == 'simplebar-content') return;
        let allNodes = extractTextNodes(node);
        if (allNodes.length === 0) return;
        unsafeWindow.parent.postMessage(allNodes, 'https://www.youtube.com');
      });
    });
  });

  function extractTextNodes(node) {
    let allNodes = [], username = '', ignoreName = '', imgCount = 0;
    function traverseNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        allNodes.push(['text', node.textContent.trim()]); // 仅保存非空文本
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('chat-author__display-name') && node.tagName.toLowerCase() === 'span') {
          username = node.textContent.trim();
        };
        if (node.classList.contains('chat-author__intl-login') && node.tagName.toLowerCase() === 'span') {
          ignoreName = node.textContent.trim();
        };
        if (node.tagName.toLowerCase() === 'img') {
          allNodes.push(['img', node.src]);
          imgCount++;
        }
        Array.from(node.childNodes).forEach(child => traverseNodes(child));
      };
    };
    traverseNodes(node);
    if (!username) {
      username = ignoreName;
      ignoreName = '';
    };
    if (allNodes.length == imgCount) return [];
    if (allNodes[0][1].match(/\d{2}:\d{2}/)) allNodes.shift(); //.splice(0, 1);
    if (allNodes[0][0] !== 'img') allNodes.unshift(['img', 'https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png']);
    // console.log(JSON.stringify(allNodes, null, 2));
    for (let i in allNodes) {
      if (allNodes[i][1] === ignoreName) {
        allNodes.splice(i, 1);
        break;
      };
    };
    for (let i in allNodes) {
      if (allNodes[i][1] === ':') {
        allNodes[i] = ['colon', '：'];
        break;
      };
    };
    for (let i in allNodes) {
      if (allNodes[i][1] === username) {
        if (username.length >= 21) username = username.substring(0, 18) + '...';
        allNodes[i] = ['username', username];
        break;
      };
    };
    return allNodes;
  };
};

// ⬜️ 获取聊天内容 小米（改
function matchChat(username, content) {
  let ret = {};
  function isMatched(username, content, reg) {
    if (reg.includes('[off]')) return;
    let str = username;
    if (reg.includes('[chat]')) str = content;
    reg = new RegExp(reg.replace('[chat]', ''), 'i');
    if (str.match(reg)) return true;
  };
  if (configs.isFocusNames) {
    ret.isNoShow = true;
    configs.focusNames.forEach(reg => {
      if (isMatched(username, content, reg)) ret.isNoShow = false;
    })
  }
  if (configs.isHighlightNames) {
    configs.highlightNames.forEach(reg => {
      if (isMatched(username, content, reg)) ret.isHighlight = true;
    })
  }
  if (configs.isBlockNames) {
    configs.blockNames.forEach(reg => {
      if (isMatched(username, content, reg)) ret.isNoShow = true;
    })
  };
  return ret;
};

function digestYtChatDom(dom) {
  const userPhotoElement = dom.querySelector("#author-photo #img");
  const userphoto = userPhotoElement ? userPhotoElement.outerHTML : '';
  const contentElement = dom.querySelector("#message");
  let content = contentElement ? contentElement.innerHTML : '';
  let usernameElement = dom.querySelector("#author-name");
  let username = usernameElement ? usernameElement.innerHTML : ''; // 这里参照原有代码，就不改了
  if (!username) return;
  username = username.match(/(.*?)</)[1];
  let el = videoDoc.createElement('div');
  el.className = 'danmu-item';
  let matchChatRet = matchChat(username, content);
  if (matchChatRet.isNoShow) return;
  if (matchChatRet.isHighlight) el.className += ' danmu-highlight ';
  let color = '';
  let shortUsername = username.substring(0, 1);
  if (username.length >= 21) username = username.substring(0, 18) + '...';
  if (dom.querySelector("#card") && dom.querySelector("#purchase-amount")) {
    username = "(SC) " + username;
    try {
      let price = dom.querySelector("#purchase-amount").innerText;
      content = `${price} ${content}`;
    } catch { };
    color = getComputedStyle(dom).getPropertyValue("--yt-live-chat-paid-message-primary-color");
    color = `style="color: ${color}"`;
  };
  if (dom.querySelector("#card") && dom.querySelector("#price-column")) {
    username = "(SC) " + username;
    color = getComputedStyle(dom.querySelector('#card')).backgroundColor;
    content = dom.querySelector("#price-column").innerText;
    color = `style="color: ${color}"`;
  }
  el.innerHTML += `<table><tbody><tr><td class="first-td"></td><td class="second-td"></td></tr></tbody></table>`;
  el.querySelector('.first-td').innerHTML += `${userphoto}`;
  let separator = content ? '：' : '';
  el.querySelector('.second-td').innerHTML += `<span class="danmu-username-long" ${color}>${username}<span class="danmu-badge">`
    + `</span>${separator}</span>`;
  el.querySelector('.second-td').innerHTML +=
    `<span class="danmu-username-short" ${color}>${shortUsername}<span class="danmu-badge">`
    + `</span>${separator}</span>`;
  el.querySelector('.second-td').innerHTML += `<span class="danmu-text" ${color}>${content}</span>`;
  setTimeout(() => {
    if (el.querySelector('img')?.src?.startsWith('data')) {
      el.querySelector('img').src = dom.querySelector("#author-photo #img").src;
    }
    try {
      let badge = [dom.querySelector("yt-icon div")?.cloneNode(true)];
      let path = badge[0]?.querySelector('path');
      if (path && path.getAttribute('d')?.startsWith('M9.64589146,7.05569719')) {
        switch (0) {
          case 0: {
            badge[0].style.width = '1em';
            badge[0].style.display = 'inline-block';
            badge[0].style.color = 'lightyellow';
            let badeges = el.querySelectorAll('.danmu-badge');
            for (let i = 0; i < badeges.length; i++) {
              badeges[i].appendChild(badge[i]);
              badge[i + 1] = badge[0].cloneNode(true);
            };
            break;
          }
          case 1:
            el.querySelector('.danmu-badge').innerText = '🔧';
            break;
        }
      }
    } catch (e) { };
  }, 588)
  return el;
};

// ⬜️ 动态滑动弹幕逻辑，略有些复杂
// css 的 transition 方案：弃用，自动设置时间，但多个元素一起变会卡
/* height 和 tramsform 方案：弃用，多个 div 位于一行时，高度设置没用，
    还是会挤住下面的元素，可能是 div 内部元素的问题，也可能是多个元素一起变化时就是会卡 */
// margin 的方案：弃用，多个元素还是会卡，看来多个元素一起变化的话无论如何都会卡
// 更好的方案：在外面再套一层 div，避免底端上移。但先不改了。
function linesInfo(danmuEle, ifFirstLine, ifSecondLine) {
  let children = danmuEle.querySelectorAll('.danmu-item');
  if (children.length == 0) return;
  let lastChild = children[children.length - 1];
  let lastChildRect = lastChild.getBoundingClientRect();
  let firstChildRect = children[0].getBoundingClientRect();
  let margin = parseFloat(getComputedStyle(children[0]).margin);
  let baseHeight = margin + firstChildRect.height;
  let diff = lastChildRect.bottom - danmuEle.getBoundingClientRect().bottom;
  let danmuCtrlRect = danmuEle.querySelector('#danmu-ctrl').getBoundingClientRect();
  let distance = firstChildRect.bottom - danmuCtrlRect.bottom;
  let isOverlap1 = firstChildRect.top < danmuCtrlRect.bottom;
  let firstLine, secondLine;
  if (ifFirstLine) {
    firstLine = [children[0]];
    for (let i = 1; i < children.length; i++) {
      if (children[i].getBoundingClientRect().top <= children[0].getBoundingClientRect().top + 3) {
        firstLine[i] = children[i];
      } else {
        if (ifSecondLine) {
          secondLine = [children[i]];
          for (let j = i + 1; j < children.length; j++) {
            if (children[j].getBoundingClientRect().top <= children[i].getBoundingClientRect().top + 3) {
              secondLine[j - i] = children[j];
            } else break;
          };
        }
        break;
      };
    }
  }
  return { notEmpty: true, children, distance, isOverlap1, diff, margin, baseHeight, firstLine, secondLine };
};
// -----------
function removeCoverdTops(danmuEle, force) {
  let l = linesInfo(danmuEle, true, false);
  try {
    while (l?.distance < 0 || (force && l?.firstLine) || l?.diff > 3 * l?.baseHeight) {
      force = false;
      for (let i = 0; i < l.firstLine.length; i++) {
        l.firstLine[i].parentNode.removeChild(l.firstLine[i]);
      };
      let contentEl = danmuEle.querySelector('#danmu-content');
      contentEl.style.marginTop =
        Math.min(0, parseFloat(getComputedStyle(contentEl).marginTop) + l.baseHeight) + 'px';
      l = linesInfo(danmuEle, true, false);
    };
  } catch (e) { console.log(e) };
  return l;
};
// 检查高度设计：
// 检查间隔 1/25 秒 timesVar
// 检查是否有完全覆盖的弹幕并删除
// 如果有 overlap 或 底部超框，说明需要调整
// -----------
// 移动基础1：下边超出距离 diff
// 移动基础2：第一行元素剩余距离 distance
// 本次移动最终目标：diff 和 distance 的最大值 move
// 本次移动阶段性目标：move * timesVar
// 移动基础3：最小值：基础高度 * timesVar，但不能超过 move
// 移动基础3：上限：0.8高度，但不能超过 move
// -----------
// 移动完后进入下一次检查
videoDoc.danmuObj = { isCheckingHeight: undefined };
const timesVar = 1 / 28;
function checkHeight(danmuEle) {
  if (videoDoc.danmuObj.isCheckingHeight) return;
  videoDoc.danmuObj.isCheckingHeight = true;
  if (getComputedStyle(danmuEle.querySelector('#danmu-content')).display == 'none') {
    let items = danmuEle.querySelectorAll('.danmu-item');
    for (let i = 0; i < items.length - 288; i++) {
      danmuEle.removeChild(items[i]);
    }
    videoDoc.danmuObj.isCheckingHeight = false;
    return;
  };
  try {
    // 检查是否有完全覆盖的弹幕并删除
    let l = removeCoverdTops(danmuEle);
    // 如果有 overlap 或 底部超框，说明需要调整
    if (!l) { videoDoc.danmuObj.isCheckingHeight = false; return; };
    if (!l.isOverlap1 && l.diff <= 0) { videoDoc.danmuObj.isCheckingHeight = false; return; };
    // 移动基础
    let move = Math.max(l.diff, l.distance);
    let currentMove = move * timesVar;
    currentMove = Math.max(l.baseHeight * timesVar, currentMove);
    // currentMove = Math.min(l.baseHeight * 0.8, currentMove); 这里限制了最高速度，现在解开
    currentMove = Math.min(move, currentMove);
    let opacity = l.distance / l.baseHeight;
    l.firstLine.forEach(node => {
      try { node.style.opacity = opacity } catch (e) { console.log(e) };
    });
    let contentEl = danmuEle.querySelector('#danmu-content');
    let currentTop = parseFloat(getComputedStyle(contentEl).marginTop);
    contentEl.style.marginTop = `${currentTop - currentMove}px`;
  } catch (e) {
    videoDoc.danmuObj.isCheckingHeight = false;
    console.log(e);
  };

  setTimeout(() => {
    videoDoc.danmuObj.isCheckingHeight = false;
    checkHeight(danmuEle);
  }, timesVar * 0.8 / configs.speed * 1000);
};

// ⬜️ 样式初始化（加到 head）
function styleCalc() {
  let danmuItemPaddingTop = configs.gap;
  let danmuItemMargin = configs.gap / 5 + 0.5;
  return {
    danmuItemPaddingTop, danmuItemMargin,
    danmuItemHeight: configs.fontSize + danmuItemPaddingTop + danmuItemMargin
  };
};

function setStyle() {
  let floatDanmuStyle = videoDoc.querySelector('#float-danmu-style');
  if (!floatDanmuStyle) {
    floatDanmuStyle = videoDoc.createElement('style');
    floatDanmuStyle.id = 'float-danmu-style';
    document.head.appendChild(floatDanmuStyle);
  }
  let danmuItemDisplay = configs.singleLine ? 'block' : (configs.fullLine ? 'inline' : 'inline-block');
  let danmuItemLineHeight = (!configs.singleLine && configs.fullLine)
    ? `line-height: ${1.28 * configs.fontSize + 2.18 * configs.gap}px` : '';
  let baseStyle = `
  .danmu-highlight {
    border: solid 1.8px rgba(255, 191, 0, 1.8);
    box-shadow: inset 0 0 ${configs.gap + configs.fontSize / 2}px rgba(255, 191, 0, 0.8); /* 内发光效果 */
  }
  #danmu-ele {
    position: absolute;
    color: white;
    height: auto;
    z-index: 911;
    top: ${configs.top}px;
    left: ${configs.left}px;
    width: ${configs.width}px;
  }
  #danmu-ctrl {
    z-index: 1013;
    position: relative;
    background-color: rgba(0,0,0,0.5);
    border: solid white 0.1px;
    padding: 2.8px;
    font-size: 12.8px;
  }
  #danmu-pop-board {
    max-width:100vw;
    overflow-x: auto;
    z-index: 418094;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
  }
  #danmu-pop-board-in {
    min-width: 788px;
    padding: 18px;
    color: black;
    font-size: 1.18em;
  }
  #danmu-pop-board .small-setting {
    display: inline-block;
    padding: 0.5em;
    background-color: #fafafa;
    border-radius: 0.5em;
    white-space: nowrap;
  }
  #danmu-name-container {
    margin:0.5em 0 1em 0;
    display: flex;
    gap: 1em;
    height: 288px;
    background-color: #fafafa;
    padding: 1em 0.8em;
    border-radius: 0.5em
  }
  #danmu-name-container div {
    width: 100%
  }
  #danmu-name-container textarea {
    width: 97%;
    height: 86%
  }
  #danmu-name-container label {
    display: inline-block;
    height: 3em;
  }
  #danmu-pop-board ul {
    list-style-type: disc;
    margin-left: 1.8em
  }
  #danmu-ele code {
    color: Brown;
  }
  #danmu-content {
    font-size: 0px;
    max-height: ${configs.maxHeight}px;
    height: auto;
  }
  .danmu-username-long, .danmu-username-short {
    color: rgb(200,200,200);
  }
  .danmu-item {
    font-size: ${configs.fontSize}px;
    width: fit-content;
    background-color: rgba(0, 0, 0, ${configs.transparent});
    border-radius: ${configs.gap / 1.8 + 1.8}px;
    padding: ${styleCalc().danmuItemPaddingTop}px ${configs.gap * 1.5}px;
    margin: ${styleCalc().danmuItemMargin}px;
    display: ${danmuItemDisplay};
    ${danmuItemLineHeight};
  }
  .danmu-item img {
    border-radius: 888px;
    width: auto;
    height: ${configs.fontSize * 1.18}px;
    margin-right: ${configs.fontSize / 3}px;
    display: inline;
    vertical-align: middle;
  }
  .danmu-item .first-td {
    vertical-align: super;
    width: 1.28em;
    min-width: 1.28em;
  }
  .danmu-item a {
    color: lightblue;
  }
  .danmu-text {
    color: white;
  }`;
  let showModeStyle = `#danmu-content { display: block; }`;
  switch (text['中文'].modes[configs.showMode]) {
    case '全隐藏':
      showModeStyle = `#danmu-content { display: none; }`;
      break;
    case '全显示':
      showModeStyle += `
        .danmu-username-long { display: inline !important; }
        .danmu-username-short { display: none !important; }`;
      break;
    case '短用户名':
      showModeStyle += `
        .danmu-username-long { display: none !important; }
        .danmu-username-short {
          display: inline-block !important;
          min-width: 2em;
        }`;
      break;
    case '无用户名':
      showModeStyle += `
        .danmu-username-long { display: none !important; }
        .danmu-username-short { display: none !important; }`;
      break;
  };
  floatDanmuStyle.textContent = baseStyle + showModeStyle;
};

// ⬜️ 文字 + 样式初始化
const danmuHTML = `
<div id="danmu-ctrl" >
  <button id="danmu-settings"></button>&nbsp;
  <button id="danmu-show-mode"></button>&nbsp;
  <button id="danmu-language"></button>&nbsp;
</div>
<div id="danmu-content"></div>
<div id="danmu-pop-board">
<div id="danmu-pop-board-in">
  <div style="display: flex; gap: 0.5em">
    <div class="small-setting">
      <label for="danmu-single-line">
        <input type="checkbox" id="danmu-single-line">abc
      </label>
    </div>
    <div class="small-setting">
      <span id="danmu-fontsize"></span>
      <button id="danmu-fontsize-add">+</button>
      <button id="danmu-fontsize-minus">-</button>
    </div>
    <div class="small-setting">
      <span id="danmu-speed"></span>
      <button id="danmu-speed-add">+</button>
      <button id="danmu-speed-minus">-</button>
    </div>
    <div class="small-setting">
      <span id="danmu-gap"></span>
      <button id="danmu-gap-add">+</button>
      <button id="danmu-gap-minus">-</button>
    </div>
    <div class="small-setting">
      <span id="danmu-transparent"></span>
      <button id="danmu-transparent-add">+</button>
      <button id="danmu-transparent-minus">-</button>
    </div>
    <div class="small-setting">
      <span id="danmu-height"></span>
      <button id="danmu-height-add">+</button>
      <button id="danmu-height-minus">-</button>
    </div>
  </div>
  <div style="margin: 0.8em 0; background-color: #fafafa; padding: 0.5em;
    border-radius: 0.5em; width: fit-content">
    <label for="danmu-twitch-active-check">
      <input type="checkbox" id="danmu-twitch-active-check">
      <span id="danmu-twitch-tip"></span>&nbsp;
    </label>
    <input type="text" id="danmu-twitch-link">&nbsp;
  </div>
  <div id="danmu-name-container">
    <div id="danmu-name-tip" style="line-height: 1.58em;
      overflow-y: auto; word-wrap: break-word; "></div>
    <div>
      <label for="danmu-is-focus-names">
        <input type="checkbox" id="danmu-is-focus-names">
      </label>
      <textarea id="danmu-focus-names"></textarea>
    </div>
    <div>
      <label for="danmu-is-highlight-names">
        <input type="checkbox" id="danmu-is-highlight-names">
      </label>
      <textarea id="danmu-highlight-names"></textarea>
    </div>
    <div>
      <label for="danmu-is-block-names">
        <input type="checkbox" id="danmu-is-block-names">
      </label>
      <textarea id="danmu-block-names"></textarea>
    </div>
  </div>
  <div style="display: inline-block; text-align: center;width: 100%;">
    <button id="danmu-pop-board-submit" style"display: inline-block; margin: 0 5px"></button>
  </div>
</div>
</div>
<iframe style="display: none;"></iframe>
`;

function eleRefresh(danmuEle) {
  danmuEle = danmuEle || videoDoc.querySelector('#danmu-ele');
  if (!danmuEle) return;
  danmuEle.querySelector('#danmu-settings').innerText = text[configs.language].settings;
  danmuEle.querySelector('#danmu-show-mode').innerText = text[configs.language].modes[configs.showMode];
  danmuEle.querySelector('#danmu-language').innerText = text[configs.language].nextLanguage;
  danmuEle.querySelector('#danmu-single-line').checked = configs.singleLine;
  danmuEle.querySelector('#danmu-single-line').nextSibling.textContent =
    `${text[configs.language].singleLine}`;
  danmuEle.querySelector('#danmu-fontsize').innerText = `${text[configs.language].fontSize} ${configs.fontSize}`;
  danmuEle.querySelector('#danmu-speed').innerText = `${text[configs.language].speed} ${configs.speed.toFixed(2)}`;
  danmuEle.querySelector('#danmu-gap').innerText = `${text[configs.language].gap} ${configs.gap}`;
  danmuEle.querySelector('#danmu-transparent').innerText =
    `${text[configs.language].transparency} ${configs.transparent.toFixed(2)}`;
  danmuEle.querySelector('#danmu-height').innerText = `${text[configs.language].height} ${configs.maxHeight}`;
  danmuEle.querySelector('#danmu-twitch-tip').innerText = text[configs.language].twichTip;
  danmuEle.querySelector('#danmu-twitch-link').placeholder = text[configs.language].twitchLinkPlaceholder;
  /* 文字更新的时间点：面板弹出 */
  danmuEle.querySelector('#danmu-twitch-active-check').checked = configs.isTwitchActive;
  if (configs.isTwitchActive && !danmuEle.querySelector('iframe').src && configs.twitchLink) {
    let embedLink = twitchLinkEmbed(configs.twitchLink);
    if (embedLink) danmuEle.querySelector('iframe').src = embedLink;
  };
  danmuEle.querySelector('#danmu-is-focus-names').checked = configs.isFocusNames;
  danmuEle.querySelector('#danmu-is-focus-names').nextSibling.textContent = `${text[configs.language].focusMode}`;
  danmuEle.querySelector('#danmu-is-highlight-names').checked = configs.isHighlightNames;
  danmuEle.querySelector('#danmu-is-highlight-names').nextSibling.textContent =
    `${text[configs.language].highlightMode}`;
  danmuEle.querySelector('#danmu-is-block-names').checked = configs.isBlockNames;
  danmuEle.querySelector('#danmu-is-block-names').nextSibling.textContent = `${text[configs.language].blockMode}`;
  danmuEle.querySelector('#danmu-name-tip').innerHTML = `${text[configs.language].nameTip}`;
  danmuEle.querySelector('#danmu-pop-board-submit').innerText = `${text[configs.language].popBoardConfirm}`;
  setStyle();
  let codeEles = danmuEle.querySelectorAll('code');
  codeEles.forEach(el => {
    el.addEventListener('click', e => {
      navigator.clipboard.writeText(el.innerText);
      alert(text[configs.language].cpoiedTip);
    });
  });
};

// ⬜️⬜️ 建立基本元素
function getDanmuEle() {
  let danmuEle = document.createElement('div')
  danmuEle.id = 'danmu-ele';
  const policy = window.trustedTypes.createPolicy('default', {
    createHTML: a => a
  })
  danmuEle.innerHTML = policy.createHTML(danmuHTML);
  eleRefresh(danmuEle);
  let danmuContentEl = danmuEle.querySelector('#danmu-content');

  // ⬜️ 油猴脚本按钮初始化
  let menuIndex = {};
  function resetEl(danmuEle) {
    eleRefresh(danmuEle);
    danmuEle.style.top = '';
    danmuEle.style.left = '';
    danmuEle.querySelector('#danmu-ctrl').style.visibility = 'visible';
    danmuEle.querySelector('#danmu-content').style.height = defaultPosition.maxHeight + 'px';
    danmuEle.querySelector('#danmu-content').style.maxHeight = defaultPosition.maxHeight + 'px';
  }
  const menuFuncs = {
    menuSetting: settingsPopout,
    menuResetPosition: () => {
      setLocal(defaultPosition);
      resetEl(danmuEle);
    },
    menuResetExceptNames: () => {
      let oldConfigs = deepCopy(configs);
      localStorage.removeItem('danmuConfigs');
      getLocal();
      setLocal({
        focusNames: oldConfigs.focusNames,
        highlightNames: oldConfigs.highlightNames,
        blockNames: oldConfigs.blockNames
      });
      resetEl(danmuEle);
    },
    menuResetAll: () => {
      if (confirm(text[configs.language].menuResetAllConfirm)) {
        setLocal(defaultConfigs);
        getLocal();
        setLocal();
        resetEl(danmuEle);
      } else return;
    },
  };
  menuRefresh();
  function menuRefresh() {
    for (let i in menuIndex) GM_unregisterMenuCommand(menuIndex[i]);
    for (let i in menuFuncs) menuIndex[i] = GM_registerMenuCommand(text[configs.language][i], menuFuncs[i]);
  };

  // ⬜️⬜️ 阻断点击事件穿透 #屏蔽
  danmuEle.querySelector('#danmu-ctrl').addEventListener('click', event => event.stopPropagation());
  danmuEle.querySelector('#danmu-ctrl').addEventListener('dblclick', event => event.stopPropagation());

  // ⬜️ 设置按钮 面板弹出
  function settingsPopout() {
    if (danmuEle.querySelector('#danmu-pop-board').style.display == 'block') {
      settingSubmit();
    } else { // 标记：设置中的所有文字更新都要看看这里
      danmuEle.querySelector('#danmu-twitch-link').value = configs.twitchLink;
      danmuEle.querySelector('#danmu-focus-names').value = configs.focusNames.join('\n');
      danmuEle.querySelector('#danmu-highlight-names').value = configs.highlightNames.join('\n');
      danmuEle.querySelector('#danmu-block-names').value = configs.blockNames.join('\n');
      eleRefresh(danmuEle);
      danmuEle.querySelector('#danmu-pop-board').style.display = 'block';
      videoDoc.querySelector('#masthead-container').style.display = 'none'; // 避免 YouTube 遮挡
    };
  }
  danmuEle.querySelector('#danmu-settings').addEventListener('click', settingsPopout);

  // ⬜️ 显示模式切换 全显示 长短名字 全隐藏
  danmuEle.querySelector('#danmu-show-mode').addEventListener('click', () => {
    setLocal({ showMode: (configs.showMode + 1) % text[configs.language].modes.length });
    danmuEle.querySelector('#danmu-show-mode').innerText = text[configs.language].modes[configs.showMode];
    checkHeight(danmuEle);
    setStyle();
  });

  // ⬜️ 语言切换
  danmuEle.querySelector('#danmu-language').addEventListener('click', () => {
    setLocal({ language: text[configs.language].nextLanguage });
    eleRefresh(danmuEle);
    menuRefresh();
  });

  // ⬜️ 行显示模式 单列多列
  danmuEle.querySelector('#danmu-single-line').addEventListener('change', event => {
    setLocal({ singleLine: event.target.checked });
    setStyle();
    checkHeight(danmuEle);
  });

  // ⬜️ 控制功能 - 字号大小
  function fontSizeChange(change) {
    setLocal({ fontSize: Math.max(0, configs.fontSize + change) });
    danmuEle.querySelector('#danmu-fontsize').innerText = `${text[configs.language].fontSize} ${configs.fontSize}`;
    setStyle();
  };
  danmuEle.querySelector('#danmu-fontsize-add').addEventListener('click', e => fontSizeChange(1));
  danmuEle.querySelector('#danmu-fontsize-minus').addEventListener('click', e => fontSizeChange(-1));

  // ⬜️ 控制功能 - 速度
  function speedChange(change) {
    setLocal({ speed: Math.max(0, Number((configs.speed + change).toFixed(2))) });
    danmuEle.querySelector('#danmu-speed').innerText = `${text[configs.language].speed} ${configs.speed.toFixed(2)}`;
    setStyle();
  };
  danmuEle.querySelector('#danmu-speed-add').addEventListener('click', e => speedChange(0.05));
  danmuEle.querySelector('#danmu-speed-minus').addEventListener('click', e => speedChange(-0.05));

  // ⬜️ 控制功能 - 间距大小
  function gapChange(change) {
    setLocal({ gap: configs.gap + change });
    danmuEle.querySelector('#danmu-gap').innerText = `${text[configs.language].gap} ${configs.gap}`;
    setStyle();
  };
  danmuEle.querySelector('#danmu-gap-add').addEventListener('click', e => gapChange(1));
  danmuEle.querySelector('#danmu-gap-minus').addEventListener('click', e => gapChange(-1));

  // ⬜️ 控制功能 - 透明度
  let transparentTimerI;
  function transparentChange(change) {
    change = Number((configs.transparent + change).toFixed(2));
    change = Math.max(0, change);
    change = Math.min(1, change);
    setLocal({ transparent: change });
    danmuEle.querySelector('#danmu-transparent').innerText =
      `${text[configs.language].transparency} ${configs.transparent.toFixed(2)}`;
    setStyle();
  };
  function transparentMouseDown(change) {
    transparentChange(change);
    transparentTimerI = setInterval(() => {
      transparentChange(change * 8);
    }, 888)
    videoDoc.addEventListener('mouseup', transparentMouseStop);
  };
  function transparentMouseStop() {
    clearInterval(transparentTimerI);
    videoDoc.removeEventListener('mouseup', transparentMouseStop);
  }
  danmuEle.querySelector('#danmu-transparent-add')
    .addEventListener('mousedown', e => transparentMouseDown(0.01));
  danmuEle.querySelector('#danmu-transparent-minus')
    .addEventListener('mousedown', e => transparentMouseDown(-0.01));

  // ⬜️ 控制功能 - 高度
  function setHeight(num) {
    setLocal({ maxHeight: Math.max(0, configs.maxHeight + num) });
    danmuContentEl.style.height = `${configs.maxHeight - 1}px`;
    danmuContentEl.style.maxHeight = `${configs.maxHeight}px`;
    danmuEle.querySelector('#danmu-height').innerText = `${text[configs.language].height} ${configs.maxHeight}`;
    setStyle();
  }
  danmuEle.querySelector('#danmu-height-add').addEventListener('click', e => setHeight(18));
  danmuEle.querySelector('#danmu-height-minus').addEventListener('click', e => setHeight(-18));

  // ⬜️ twitch 链接
  danmuEle.querySelector('#danmu-twitch-link').addEventListener('change', event => {
    setLocal({ twitchLink: event.target.value });
    if (configs.isTwitchActive) {
      let embedLink = twitchLinkEmbed(event.target.value);
      if (embedLink !== undefined) danmuEle.querySelector('iframe').src = embedLink;
    };
  });
  danmuEle.querySelector('#danmu-twitch-active-check').addEventListener('change', e => {
    setLocal({ isTwitchActive: e.target.checked });
    if (configs.isTwitchActive) {
      let embedLink = twitchLinkEmbed(configs.twitchLink);
      if (embedLink !== undefined) danmuEle.querySelector('iframe').src = embedLink;
    } else danmuEle.querySelector('iframe').src = '';
  });

  // ⬜️ 弹幕过滤设置开关、规则编辑
  danmuEle.querySelector('#danmu-is-focus-names').addEventListener('change', event => {
    setLocal({ isFocusNames: event.target.checked });
  });
  danmuEle.querySelector('#danmu-is-highlight-names').addEventListener('change', event => {
    setLocal({ isHighlightNames: event.target.checked });
  });
  danmuEle.querySelector('#danmu-is-block-names').addEventListener('change', event => {
    setLocal({ isBlockNames: event.target.checked });
  });
  function namesSave(toChange) {
    toChange = toChange ? [].concat(toChange) : ['focus', 'highlight', 'block'];
    toChange.forEach(item => {
      setLocal({
        [`${item}Names`]: danmuEle.querySelector(`#danmu-${item}-names`).value.split('\n').filter(item => item.trim())
      });
    })
  }
  danmuEle.querySelector('#danmu-focus-names').addEventListener('change', e => namesSave('focus'));
  danmuEle.querySelector('#danmu-highlight-names').addEventListener('change', e => namesSave('highlight'));
  danmuEle.querySelector('#danmu-block-names').addEventListener('change', e => namesSave('block'));

  // ⬜️ 面板关闭
  function settingSubmit() {
    danmuEle.querySelector('#danmu-pop-board').style.display = 'none';
    videoDoc.querySelector('#masthead-container').style.display = 'block';
  };
  danmuEle.querySelector('#danmu-pop-board-submit').addEventListener('click', e => settingSubmit());

  // ⬜️ 移入移出显示
  let isMouseIn;
  danmuEle.addEventListener('mouseenter', () => {
    isMouseIn = true;
    danmuEle.querySelector('#danmu-ctrl').style.visibility = 'visible';
    danmuContentEl.style.borderBottom = 'Coral solid 0.1px';
    danmuContentEl.style.borderLeft = '8.8px dashed Coral';
    danmuContentEl.style.borderRight = '8.8px dashed Coral';
    danmuContentEl.style.height = `${configs.maxHeight - 1}px`;
  });
  danmuEle.addEventListener('mouseleave', () => {
    isMouseIn = false;
    setTimeout(() => {
      if (!isMouseIn) {
        danmuEle.querySelector('#danmu-ctrl').style.visibility = 'hidden';
        danmuContentEl.style.borderBottom = '';
        danmuContentEl.style.borderLeft = '';
        danmuContentEl.style.borderLeft = '';
        danmuContentEl.style.border = '';
        danmuContentEl.style.height = 'auto';
      }
    }, 158)
  });

  // ⬜️ 鼠标边缘箭头
  let mouseStatus = { width: 0, height: 0, left: 0 };
  const cursorStyles = ['n-resize', 'ne-resize', 'e-resize', 'se-resize',
    's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
  let cursorIndex = { index: 0, time: Date.now() };
  function changeCursor() {
    let time = Date.now();
    if (time - cursorIndex.time > 88) {
      cursorIndex.time = time;
      danmuContentEl.style.cursor = cursorStyles[(++cursorIndex.index) % cursorStyles.length];
    } else danmuContentEl.style.cursor = cursorStyles[cursorIndex.index % cursorStyles.length];
  }
  danmuContentEl.addEventListener('mousemove', function (event) {
    const rect = danmuContentEl.getBoundingClientRect();
    const offset = 18;
    if (event.clientX <= rect.right && event.clientX >= rect.right - offset &&
      event.clientY <= rect.bottom && event.clientY >= rect.bottom - offset) {
      // danmuContentEl.style.cursor = 'nwse-resize'; // 右下
      // mouseStatus = { width: 1, height: 1, left: 0 };
    } else if (event.clientX >= rect.left && event.clientX <= rect.left + offset &&
      event.clientY <= rect.bottom && event.clientY >= rect.bottom - offset) {
      // danmuContentEl.style.cursor = 'nesw-resize'; // 左下
      // mouseStatus = { width: -1, height: 1, left: 1 };
    } else if (event.clientX >= rect.left && event.clientX <= rect.left + offset) {
      // danmuContentEl.style.cursor = 'ew-resize'; // 左
      // mouseStatus = { width: -1, height: 0, left: 1 };
      // danmuContentEl.style.cursor = 'all-scroll';
      changeCursor();
      mouseStatus = { width: -1, height: 1, left: 1 };
    } else if (event.clientX <= rect.right && event.clientX >= rect.right - offset) {
      // danmuContentEl.style.cursor = 'ew-resize'; // 右
      // mouseStatus = { width: 1, height: 0, left: 0 };
      // danmuContentEl.style.cursor = 'all-scroll';
      changeCursor();
      mouseStatus = { width: 1, height: 1, left: 0 };
    } else if (event.clientY <= rect.bottom && event.clientY >= rect.bottom - offset) {
      // danmuContentEl.style.cursor = 'ns-resize'; // 下
      // mouseStatus = { width: 0, height: 1, left: 0 };
    } else {
      danmuContentEl.style.cursor = 'default'; // 默认箭头
      mouseStatus = { width: 0, height: 0, left: 0 };
    }
  });

  // ⬜️ 边缘拖拽
  danmuContentEl.addEventListener('mousedown', function (event) {
    event.stopPropagation();
    let doc = event.target.ownerDocument;
    let x = event.clientX;
    let y = event.clientY;
    let width = danmuEle.offsetWidth;
    let height = danmuContentEl.offsetHeight;
    let left = danmuEle.offsetLeft;
    let mouse = deepCopy(mouseStatus); // 以免在移动中变化

    function doDrag(e) {
      e.stopPropagation();
      danmuEle.style.width = width + mouse.width * (e.clientX - x) + 'px';
      danmuContentEl.style.height = height + mouse.height * (e.clientY - y) + 'px';
      danmuContentEl.style.maxHeight = height + mouse.height * (e.clientY - y) + 'px';
      danmuEle.style.left = left + mouse.left * (e.clientX - x) + 'px';
    };

    function stopDrag(e) {
      mouseStatus = { width: 0, height: 0, left: 0 };
      e.stopPropagation();
      videoDoc.body.style.userSelect = '';
      videoDoc.body.style.webkitUserSelect = '';
      videoDoc.body.style.msUserSelect = '';
      videoDoc.body.style.mozUserSelect = '';
      setLocal({
        width: danmuContentEl.offsetWidth,
        maxHeight: danmuContentEl.offsetHeight,
        left: danmuEle.offsetLeft
      });
      eleRefresh(danmuEle);
      checkHeight(danmuEle);
      doc.removeEventListener('mousemove', doDrag);
      doc.removeEventListener('mouseup', stopDrag);
    };

    if (mouseStatus.width || mouseStatus.height) {
      videoDoc.body.style.userSelect = 'none';
      videoDoc.body.style.webkitUserSelect = 'none';
      videoDoc.body.style.msUserSelect = 'none';
      videoDoc.body.style.mozUserSelect = 'none';
      doc.addEventListener('mousemove', doDrag);
      doc.addEventListener('mouseup', stopDrag);
    };
  });

  // ⬜️ 整体拖拽
  danmuEle.querySelector('#danmu-ctrl').style.cursor = 'grab';
  danmuEle.querySelector('#danmu-ctrl').addEventListener('mousedown', drag);
  function drag(e) {
    let doc = e.target.ownerDocument;
    e.stopPropagation();
    e.preventDefault();
    let shiftX = e.clientX - danmuEle.getBoundingClientRect().left;
    let shiftY = e.clientY - danmuEle.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
      danmuEle.querySelector('#danmu-ctrl').style.visibility = 'visible';
      configs.top = pageY - shiftY;
      configs.left = pageX - shiftX;
      danmuEle.style.top = configs.top + 'px';
      danmuEle.style.left = configs.left + 'px';
    }
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
    doc.addEventListener('mousemove', onMouseMove);
    doc.addEventListener('mouseup', function () {
      setLocal();
      doc.removeEventListener('mousemove', onMouseMove);
      doc.onmouseup = null;
    }, { once: true });
  }
  return danmuEle;
};

// ⬜️ 蜂鸣器，调试用
function beep() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4音
  oscillator.connect(audioCtx.destination);
  oscillator.start();
  setTimeout(() => { oscillator.stop() }, 1000);
}

// console. log('YouTube 悬浮弹幕');
// 边缘测试：
//   iframe重新加载时，会不会清空
//   从直播跳到视频时，会不会清空
// greasyfork: https://greasyfork.org/en/scripts/500209-
// 代码 https://github.com/67373net/youtube-float-danmu/blob/main/index.js
// 测试地址
//   弹幕慢：https://www.youtube.com/live/5FUWAwWJrkQ?t=3341s
//   弹幕快：https://www.youtube.com/live/m8nButUrSYk?si=6ezF7VgSTtEKeoQl&t=6452
//   直播中：https://www.youtube.com/watch?v=jfKfPfyJRdk
//   带链接：https://www.youtube.com/live/hs6WyhTWrRE?si=lxRnec0kyNO0EHFt&t=2097