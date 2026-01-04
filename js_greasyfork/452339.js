// ==UserScript==
// @name        滚动条美化
// @description 美化网站滚动条样式
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @exclude     *://127.0.0.1*
// @exclude     *://localhost*
// @grant       none
// @version     1.4.0
// @author      -
// @description 2022/10/1 21:54:49
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/452339/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452339/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

const styleSheet = document.createElement('style');
styleSheet.id = 'beautify-scrollbar';
document.head.appendChild(styleSheet);

const powerList = GM_getValue('powerList') || [];

const setDefaultStyle = (init = true) => {
  styleSheet.textContent = `
    body {
      overflow-y: overlay !important;
    }

    body::-webkit-scrollbar {
      width: 10px;
    }

    body::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 9999em;
    }
  `;
  if (!init) {
    for (const index in powerList) {
      if (powerList[index] === window.location.host.toString()) {
        powerList.splice(index, 1);
        GM_setValue('powerList', powerList);
        break;
      }
    }
  }
};

const enablePowerMode = (host = null) => {
  styleSheet.textContent += `
    html {
      overflow-y: overlay !important;
    }
  `;
  if (host) {
    powerList.push(host);
    GM_setValue('powerList', powerList);
  }
};

const hasPowerList = () => {
  const host = window.location.host;
  return powerList.includes(host);
};

let enableId;
// 添加油猴设置菜单
function addUserSetting() {
  enableId = GM_registerMenuCommand(`该网站${hasPowerList() ? '关闭' : '开启'}强力模式`, () => {
    hasPowerList() ? setDefaultStyle(false) : enablePowerMode(window.location.host);
    GM_unregisterMenuCommand(enableId);//删除菜单
    addUserSetting(); // 重新注册脚本菜单
  });
}

function init() {
  setDefaultStyle();
  hasPowerList() && enablePowerMode();
  addUserSetting();
}

init();
