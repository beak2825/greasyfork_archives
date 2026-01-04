// ==UserScript==
// @name        百度网盘分享文件自动保存到个人网盘
// @namespace   Violentmonkey Scripts
// @match       https://pan.baidu.com/s/*
// @grant       none
// @version     1.4
// @author      cceevv
// @description 2023/6/8 11:25:42
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468180/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/468180/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%88%B0%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%9B%98.meta.js
// ==/UserScript==


function waitForSelector(selector, timeout) {
  return new Promise(resolve => {
    let startTime = Date.now();
    let interval = setInterval(() => {
      let el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  })
}

const logPane = document.createElement('div');
logPane.style.cssText = `
    position: fixed;
    top: 300px;
    right: 10px;
    display: flex;
    flex-flow: column wrap;
    gap: 6px;
    color: #666;
    width: 220px;
  `;
document.body.appendChild(logPane);

let title = document.createElement('h3');
title.innerText = '【插件日志】';
logPane.appendChild(title);

let idx = 0;
function trace(...args) {
  console.log(++idx, ...args);
  const msg = idx + '、' + args.join(' ');

  let span = document.createElement('span');
  span.innerText = msg;
  logPane.appendChild(span);
}

function checkTips() {
  let tipLayer = document.querySelector('.module-yun-tip');
  if (tipLayer) {
    let tips = tipLayer.querySelector('.tip-msg');
    tips && trace(tips.innerText);
    tipLayer.remove();
  }
}
setInterval(checkTips, 100);


const TIMEOUT = 1e3;
async function autoSave() {
  trace('寻找文件全选框');
  let btnSelectAll = await waitForSelector('li[data-key="server_filename"] div[node-type]', TIMEOUT);
  if (btnSelectAll) {
    trace('找到啦，点击全选文件');
    btnSelectAll.click();
  } else {
    trace('超时未找到全选框，是单文件？');
  }

  trace('寻找保存按钮');
  let btnSave = await waitForSelector('a.tools-share-save-hb[title="保存到网盘"]', TIMEOUT);
  if (btnSave) {
    trace('找到啦，点击保存按钮');
    btnSave.click();
  } else {
    trace('超时未找到保存按钮');
    return;
  }

  trace('寻找文件夹 a_yowa_install');
  let folder = await waitForSelector('.treeview-node:has(.treeview-node-handler .treeview-txt[node-path="/a_yowa_install"])', 2e3);
  if (folder) {
    trace('找到啦，选中它');
    folder.click();
  } else {
    trace('超时未找到文件夹 a_yowa_install');

    trace('寻找新建文件夹按钮');
    let btnNewFolder = await waitForSelector('a.g-button[title="新建文件夹"]', TIMEOUT);
    if (btnNewFolder) {
      trace('找到啦，点击新建文件夹按钮');
      btnNewFolder.click();

      trace('寻找输入框');
      let input = await waitForSelector('#plus-createFolder .plus-create-folder input', TIMEOUT)
      if (input) {
        trace('输入文件夹名 a_yowa_install');
        input.value = 'a_yowa_install';

        trace('点击确定');
        let btnSure = await waitForSelector('#plus-createFolder .plus-create-folder .sure', TIMEOUT)
        btnSure?.click();

        trace('寻找文件夹 a_yowa_install');
        folder = await waitForSelector('.treeview-node:has(.treeview-node-handler .treeview-txt[node-path="/a_yowa_install"])', TIMEOUT);
        if (folder) {
          trace('找到啦，选中它');
          folder.click();
        } else {
          trace('超时未找到文件夹 a_yowa_install');
          return;
        }
      } else {
        trace('超时未找到输入框');
        return;
      }
    } else {
      trace('超时未找到新建文件夹按钮');
      return;
    }
  }

  trace('寻找确定按钮');
  let btnOk = await waitForSelector('a.g-button[title="确定"]', TIMEOUT);
  if (btnOk) {
    trace('找到啦，点击确定按钮');
    btnOk.click();
  } else {
    trace('超时未找到确定按钮');
    return;
  }

  trace('等待保存结果');
  let result = await waitForSelector('.after-trans-dialog .info-section .info-section-title', TIMEOUT);
  if (result) {
    trace(result.innerText);
  }
}

async function run() {
  await autoSave();
  trace('插件运行结束');
}
run();