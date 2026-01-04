// ==UserScript==
// @name         聚合搜索V5
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  整合百度、F搜、Google、微信、Bing、知乎、知网空间搜索，提高搜索效率,可以自由添加和删除搜索引擎
// @author       Liao Brant
// @match        *://*/*
// @grant        unsafeWindow
// @grant        window.onload
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534508/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2V5.user.js
// @updateURL https://update.greasyfork.org/scripts/534508/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2V5.meta.js
// ==/UserScript==

const defaultUrlMap = [
  {
    name: 'ds',
    searchUrl: 'https://chat.baidu.com/search?word=%s',
    keyName: 'wd',
  },
  {
    name: '秘塔',
    searchUrl: 'https://metaso.cn/?s=&q=%s',
    keyName: 'q',
  },
  {
    name: 'kimi',
    searchUrl: 'https://kimi.moonshot.cn/_prefill_chat?send_immediately=true&prefill_prompt=%s',
    keyName: 'prefill_prompt',
  },
  {
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=%s',
    keyName: 'q',
  },
  {
    name: 'Bing',
    searchUrl: 'https://www.bing.com/search?ensearch=0&q=%s',
    keyName: 'q',
  },
      {
    name: '百度',
    searchUrl: 'https://www.baidu.com/s?wd=%s',
    keyName: 'wd',
  },
];

// 获取搜索配置
function getSearchConfig() {
  const urlConfig = GM_getValue('SearchList');
  if (!urlConfig || !urlConfig.length) {
    // 默认的网址配置
    GM_setValue('SearchList', defaultUrlMap);
    return defaultUrlMap;
  } else {
    return urlConfig;
  }
}

// 搜索网址配置
let urlMapping = getSearchConfig();

// JS获取url参数
function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let pairs = query.split('&');
  for (let pair of pairs) {
    let [key, value] = pair.split('=');
    if (key == variable) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// 从url中获取搜索关键词
function getKeywords() {
  let keywords = '';
  for (let item of urlMapping) {
    // 判断url是否符合搜索配置的条件
    if (item.searchUrl.includes(window.location.hostname + window.location.pathname)) {
      keywords = getQueryVariable(item.keyName);
      break;
    }
  }
  console.log(keywords);
  return keywords;
}

// 域名
const hostname = window.location.hostname;

let isBlank = GM_getValue('isBlank');

console.log('新标签页打开？', isBlank);
if (isBlank === undefined) {
  GM_setValue('isBlank', false);
  isBlank = false;
}

// 改变打开搜索引擎的方式
const engine = document.getElementsByClassName('search-engine-a');
function triggerAttribute(value) {
  for (const item of engine) {
    item.target = value;
  }
}

// 适配火狐浏览器的百度搜索
const isFirefox = () => {
  if (navigator.userAgent.indexOf('Firefox') > 0) {
    console.warn('[ Firefox ] 🚀');
    urlMapping[0].searchUrl = 'https://www.baidu.com/baidu?wd=%s';
  } else {
  }
};

// 适配cn.bing.com的必应域名
const cnBing = {
  name: 'Bing',
  searchUrl: 'https://cn.bing.com/search?q=%s',
  keyName: 'q',
};
// 匹配到cn.bing就修改必应配置对象
if (window.location.hostname === 'cn.bing.com') {
  for (let item of urlMapping) {
    if (item.name === 'Bing') {
      item = cnBing;
    }
  }
}

// 添加自定义样式
function addStyle() {
  const styleSheet = document.createElement('style');
  document.head.appendChild(styleSheet);

  styleSheet.textContent = `
  .search-container {
    position: fixed;
    top: 160px;
    left: 20px;
    width: 100px;
    background-color: #EEEEEE;
    font-size: 12px;
    z-index: 99999;
  }

  .search-title {
    display: block;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }

  .search-list__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333333 !important;
    padding-right: 6px;
  }
  .search-list__item:hover {
    color: #ffffff !important;
    background-color: #666666;
  }

  .search-list__item .search-engine-a {
    color: inherit !important;
    padding: 10px 6px 10px 20px;
    text-decoration: none;
    flex-grow: 2;
  }

  .search-list__close {
    width: 12px;
    height: 12px;
    opacity: 0;
    z-index: 10;
  }
  .search-list__close:hover {
    opacity: 1;
  }

  #search-black_over {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    // background-color: #F0F5FF;
    background-color: #f0f5ffe3;
    z-index: 999;
  }
  #search-popup {
    position: fixed;
    top: 50vh;
    left: 50vw;
    background-color: #FFFFFF;
    width: 460px;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  #setting-engine-ul {
    padding: 20px;
    height: 60vh;
    min-height: 400px;
    overflow: auto;
  }
  #setting-engine-ul::-webkit-scrollbar {
    width: 10px;
  }

  #setting-engine-ul::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 9999em;
  }
  .setting-engine-item{
    margin-bottom: 10px;
    padding: 10px 0;
    border-radius: 4px !important;
    box-shadow: 0 2px 8px rgb(22 93 255 / 8%) !important;
  }
  .engine-info{
    margin: 5px;
  }
  .engine-label{
    width: 70px;
    display: inline-block;
  }
  .engine-info input {
    width: 275px;
  }

  .setting-engine-header, .setting-engine-footer{
    display: flex;
    padding: 15px;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e8e8e8;
  }
`;
}

// 添加节点
function addBox() {
  // 主元素
  const div = document.createElement('div');
  div.id = 'search-app-box';
  div.className = 'search-container';
  document.body.insertAdjacentElement('afterBegin', div);

  // 标题
  let title = document.createElement('span');
  title.innerText = '聚合搜索';
  title.className = 'search-title';
  title.style.textDecoration = isBlank ? 'underline' : '';
  title.ondblclick = () => {
    title.style.textDecoration = !isBlank ? 'underline' : '';
    GM_setValue('isBlank', !isBlank);
    isBlank = !isBlank;
    triggerAttribute(isBlank ? '_blank' : '');
  };
  div.appendChild(title);

  // 搜索列表
  for (let index in urlMapping) {
    const item = urlMapping[index];
    // 单个搜索引擎
    const searchItem = document.createElement('div');
    searchItem.className = 'search-list__item';
    const a_target = !item.searchUrl.includes(hostname) && isBlank ? '_blank' : '';

    searchItem.innerHTML = `
      <a class="search-engine-a" href="${item.searchUrl.replace('%s', getKeywords())}" ${a_target}>
        ${item.name}
      </a>
    `;
    // 移除按钮
    const closeImg = document.createElement('img');
    closeImg.className = 'search-list__close';
    closeImg.src =
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjY4ODU1MDA0ODc1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI2ODEiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkxIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik01MDkuMjYyNzEzIDUuNDc0NTc0YzI4MS4yNzIxNjIgMCA1MDkuMjYyNzEzIDIyOC4wMjIzOCA1MDkuMjYyNzEzIDUwOS4yNjI3MTMgMCAyODEuMjcyMTYyLTIyNy45OTA1NTEgNTA5LjI2MjcxMy01MDkuMjYyNzEzIDUwOS4yNjI3MTNzLTUwOS4yNjI3MTMtMjI3Ljk5MDU1MS01MDkuMjYyNzEzLTUwOS4yNjI3MTNjMC0yODEuMjQwMzMzIDIyNy45OTA1NTEtNTA5LjI2MjcxMyA1MDkuMjYyNzEzLTUwOS4yNjI3MTN6IG0xMzUuMDUwMTA2IDI3OC43MjU4NDlMNTA5LjI2MjcxMyA0MTkuMjUwNTI4bC0xMzUuMDUwMTA2LTEzNS4wNTAxMDUtOTAuMDEyMTg0IDkwLjAxMjE4NEw0MTkuMTg2ODcxIDUwOS4yNjI3MTNsLTEzNS4wMTgyNzcgMTM1LjA4MTkzNSA5MC4wMTIxODQgOTAuMDEyMTg0TDUwOS4yNjI3MTMgNTk5LjI3NDg5N2wxMzUuMDUwMTA2IDEzNS4wNTAxMDYgOTAuMDEyMTg0LTkwLjAxMjE4NEw1OTkuMjc0ODk3IDUwOS4yNjI3MTNsMTM1LjA1MDEwNi0xMzUuMDUwMTA2LTkwLjAxMjE4NC05MC4wMTIxODR6IiBwLWlkPSIyNjgyIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4Ljc3ODEwNjkuMC5pMCIgY2xhc3M9IiIgZmlsbD0iI2UxNjUzMSI+PC9wYXRoPjwvc3ZnPg==';
    // 点击按钮移除节点
    closeImg.onclick = function () {
      urlMapping.splice(index, 1);
      searchItem.remove();
      GM_setValue('SearchList', urlMapping);
    };

    searchItem.appendChild(closeImg);
    div.appendChild(searchItem);
  }
}
// 重新生成节点
function addBoxAgain() {
  document.getElementById('search-app-box')?.remove();
  addBox();
}
// 关闭面板
closePanel = () => {
  document.getElementById('search-black_over')?.remove();
  document.getElementById('search-popup')?.remove();
};
// 新增搜索引擎
addEngine = () => {
  const engineUl = document.getElementById('setting-engine-ul');
  const li = document.createElement('li');
  li.className = 'setting-engine-item';
  li.innerHTML = `
    <div class="engine-info">
      <label class="engine-label">引擎名称</label>
      <input class="GF-engine-name__input" />
    </div>
    <div class="engine-info">
      <label class="engine-label">引擎地址</label>
      <input class="GF-engine-url__input"/>
    </div>
    <div class="engine-info">
      <label class="engine-label">搜索参数</label>
      <input class="GF-engine-key__input" />
    </div>
  `;
  engineUl.appendChild(li);
};
// 重置配置
resetEngineConfig = () => {
  urlMapping = defaultUrlMap;
  addBoxAgain();
  closePanel();
};
// 保存配置
saveEngineConfig = () => {
  const list = [];
  const names = document.getElementsByClassName('GF-engine-name__input');
  const urls = document.getElementsByClassName('GF-engine-url__input');
  const keys = document.getElementsByClassName('GF-engine-key__input');

  for (let index = 0; index < names.length; index++) {
    list.push({
      name: names[index]?.value,
      searchUrl: urls[index]?.value,
      keyName: keys[index]?.value,
    });
  }

  urlMapping = list;
  GM_setValue('SearchList', list);
  addBoxAgain();
  closePanel();
};
// 创建设置面板
function createSettingPanel() {
  // 遮罩
  const over = document.createElement('div');
  over.id = 'search-black_over';
  // 弹窗
  const popup = document.createElement('div');
  popup.id = 'search-popup';

  let engineList = '';
  urlMapping.forEach((item) => {
    engineList += `<li class="setting-engine-item">
      <div class="engine-info">
        <label class="engine-label">引擎名称</label>
        <input class="GF-engine-name__input" value="${item.name}" />
      </div>
      <div class="engine-info">
        <label class="engine-label">引擎地址</label>
        <input class="GF-engine-url__input" value="${item.searchUrl}" />
      </div>
      <div class="engine-info">
        <label class="engine-label">搜索参数</label>
        <input class="GF-engine-key__input" value="${item.keyName}" />
      </div>
    </li>`;
  });

  popup.innerHTML = `
    <div class="setting-engine-header">
      <button id="setting-engine-reset" onclick="closePanel()">关闭</button>
      <button id="setting-engine-save" onclick="addEngine()">新增</button>
    </div>
    <ul id="setting-engine-ul">${engineList}</ul>
    <div class="setting-engine-footer">
      <button id="setting-engine-reset" onclick="resetEngineConfig()">重置</button>
      <button id="setting-engine-save" onclick="saveEngineConfig()">保存</button>
    </div>
  `;

  document.body.insertAdjacentElement('afterBegin', popup);
  document.body.insertAdjacentElement('afterBegin', over);
}
// 添加油猴设置菜单
function addUserSetting() {
  GM_registerMenuCommand('设置', createSettingPanel);
}
// 初始化
function init() {
  if (!getKeywords()) return;
  addStyle();
  isFirefox();
  addBox();
  addUserSetting();
}

(function () {
  'use strict';
  window.onload = init();
})();