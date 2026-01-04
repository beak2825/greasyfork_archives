// ==UserScript==
// @name         URL管理助手
// @namespace    http://tampermonkey.net/
// @version      0.2.12
// @description  提供便捷依次访问一组网址的能力
// @author       LLFish
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488156/URL%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488156/URL%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const KEY = 'ULR';
const SEPARATOR = '\r\n';

(function () {
  'use strict';
  init();
  // Your code here...
})();

function init() {
  const container = document.createElement('div');
  container.id = 'helper_container';

  container.innerHTML = `
    <button id="helper_next" class='el-button'>处理一个</button>
    <span id="helper_info">剩余: 0</span>
    <button id="helper_add" class='el-button'>添加新地址</button>
    <textarea></textarea>
    <style> ${css()} </style>
  `

  document.querySelector('body').appendChild(container);
  document.querySelector('#helper_add')?.addEventListener('click', add);
  document.querySelector('#helper_next')?.addEventListener('click', next);
  document.querySelector('#helper_info').textContent = `剩余：${getAllUrls().length}`;
}

// 添加一组信息
async function add() {
  // 解析剪切板信息
  let text;
  try {
    if (navigator.clipboard && navigator.permissions) {
      text = await navigator.clipboard.readText()
    }
  } catch {

  }
  const urls = text ? text.split(SEPARATOR).filter(e => isUrl(e)) : [];
  const input = document.querySelector('#helper_container > textarea');
  if (input) {
    let sep = '';
    if (input.value.indexOf(SEPARATOR) !== -1) {
      sep = SEPARATOR
    } else if (input.value.indexOf('\r') !== -1) {
      sep = '\r'
    } else if (input.value.indexOf('\n') !== -1) {
      sep = '\n'
    }
    urls.push(...(input.value.split(sep).filter(e => isUrl(e))))
  }
  if (!urls.length) return;

  // 添加并更新信息
  let allUrls = getAllUrls();
  allUrls = Array.from(new Set([...allUrls, ...urls]));
  setAllUrls(allUrls)
  navigator.clipboard.writeText('');
}

// 跳转到下个待处理的链接
function next() {
  const allUrls = getAllUrls();
  if (!allUrls.length) return;

  const url = allUrls.shift();
  setAllUrls(allUrls);
  window.location.href = url;
}

// 获取存储的所有 URL
function getAllUrls() {
  const str = localStorage.getItem(KEY) || '[]';
  const allUrls = JSON.parse(str);
  return allUrls;
}

// 存储所有的 URL
function setAllUrls(allUrls) {
  document.querySelector('#helper_info').textContent = `剩余：${allUrls.length}`;
  localStorage.setItem(KEY, JSON.stringify(allUrls))
}

function isUrl(str) {
  const pattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-z]{2,}(\/.*)?$/;
  return pattern.test(str);
}

function css() {
  return `
  #helper_container {
    font-family: Inter,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei;
    border: 2px dotted black;
    border-right: none;
    padding: .5em;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    background-color: #FAFAFA;
    color: #464749;
  }

  #helper_container > * {
    margin-bottom: .2em;
  }

  #helper_container > *:last-child {
    margin-bottom: 0;
  }

  #helper_info {
    display: flex;
    justify-content: center;
    font-weight: 600;
  }

  .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #409eff;
    border: 1px solid #409eff;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }

  .el-button:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }

  .el-button:active, .el-button:focus {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
  }
  `
}