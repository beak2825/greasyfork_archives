// ==UserScript==
// @name        i Open Limited Free
// @namespace   https://greasyfork.org/users/756764
// @version     2024.3.24
// @author      ivysrono
// @license     MIT
// @description 自动打开反斗限免链接的应用商城地址
// @match       *://free.apprcn.com/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM.openInTab
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424847/i%20Open%20Limited%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/424847/i%20Open%20Limited%20Free.meta.js
// ==/UserScript==

const windowCSS = `
#Cfg {
  height: auto !important;
  width: auto !important;
  background-color: lightblue;
}
`;

const opencfg = () => {
  // 避免在包含框架的页面打开造成多个设置界面重叠
  if (window.top === window.self) {
    gmc.open();
  }
};

const frame = document.createElement('div');
document.body.appendChild(frame);

let gmc = new GM_config({
  id: 'Cfg',
  title: 'auto Get Limited Free Settings',
  frame,
  fields: {
    ama: {
      label: 'Amazon',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
    goo: {
      label: 'Google',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
    ios: {
      label: 'Apple',
      labelPos: 'right',
      type: 'checkbox',
      default: false,
    },
    win: {
      label: 'Microsoft',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
  },
  css: windowCSS,
  events: {
    save: () => {
      gmc.close();
      location.reload();
    },
  },
});

// add settings button
setting_button = document.createElement('button');
setting_button.innerHTML = 'auto Get Settings';
setting_button.onclick = opencfg;
document.querySelector('header').appendChild(setting_button);

/**
 * Tests:
 * http://free.apprcn.com/amazon-china-giveaway-2-kindle-ebooks-for-free-79/
 * http://free.apprcn.com/get-kindle-ebook-anne-of-green-gables-for-free/
 *
 * http://free.apprcn.com/get-android-icon-packs-for-free-45/
 *
 * http://free.apprcn.com/daycost-pro-7/
 * http://free.apprcn.com/starlight-7/
 *
 * http://free.apprcn.com/wifi-tool/
 * http://free.apprcn.com/mental-hospital-iii/
 */

let host = new Map();
// key 与设置中键名保持一致，以便复用
host.set('ama', '//www.amazon.c');
host.set('goo', '//play.google.com/');
host.set('ios', '.apple.com/');
host.set('win', '//www.microsoft.com/');

(async () => {
  const myCfg = await GM_config.getValue('Cfg');
  const myCfgs = JSON.parse(myCfg);
  for (const key of host.keys()) {
    console.debug(key, myCfgs[key]);
    if (!myCfgs[key]) continue;
    const links = document.querySelectorAll(`a[href*="${host.get(key)}"]`);
    for (const link of links) {
      GM.openInTab(link.href, true);
    }
  }
})();
