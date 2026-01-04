// ==UserScript==
// @name        tame 12348
// @namespace   Vionlentmonkey
// @version     0.2.0
// @description 纯属内部使用，仅供学习测试，不得恶意滥用。
// @author      someone
// @license     MIT

// @match       *://wx.js.12348.gov.cn/*

// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js

// @run-at      document-idle

// @downloadURL https://update.greasyfork.org/scripts/428891/tame%2012348.user.js
// @updateURL https://update.greasyfork.org/scripts/428891/tame%2012348.meta.js
// ==/UserScript==

const windowCSS = `
#Cfg {
  height: auto;
  background-color: lightblue;
}
#Cfg .reset_holder {
  float: left;
  position: relative;
  bottom: -1em;
}
#Cfg .saveclose_buttons {
  margin: 1em;
  float: left;
}
`;

/**
 * 打开设置选项
 */
const openCfg = () => {
  // 避免在包含框架的页面打开造成多个设置界面重叠
  if (window.top !== window.self) return;
  GM_config.open();
};

// https://github.com/sizzlemctwizzle/GM_config/wiki#using-an-element-instead-of-an-iframe
const frame = document.createElement('div');
window.addEventListener('load', () => {
  document.body.appendChild(frame);
});

GM_config.init({
  id: 'Cfg',
  title: '⚙个性化设置⚙',
  frame,
  fields: {
    interval: {
      label: '间隔时间（分钟）；可填入任何数值，0 为禁用，默认为 π',
      labelPos: 'right',
      type: 'num',
      default: Math.PI,
    },
  },
  css: windowCSS,
  events: {
    save: () => {
      GM_config.close();
      location.reload();
    },
  },
});

const body = document.body || document.documentElement;

/**
 * 创建设置按钮
 * @param {Element} parent_node
 */
const addSettingButton = (parent_node) => {
  setting_button = document.createElement('button');
  setting_button.id = 'setting';
  setting_button.textContent = '⚙个性化设置⚙';
  setting_button.onclick = openCfg;
  parent_node.appendChild(setting_button);
};

const addSettingsAfter12348 = setInterval(() => {
  if (document.getElementsByClassName('hotLine').length === 1) {
    addSettingButton(document.getElementsByClassName('hotLine')[0]);
    clearInterval(addSettingsAfter12348);
    console.log(`插入设置按钮`);
  }
}, 1000);

if (GM_config.get('interval') === 0) return;

let i = 0;

setInterval(() => {
  if (location.href === 'http://wx.js.12348.gov.cn/#/homepage/homepage') {
    if (i === 0) {
      document.querySelector(`li[ng-click="toSearch()"]`).click();
      console.log('我要查询');
      i++;
    } else if (i === 1) {
      document.querySelector(`li[ng-click="toLawMap()"]`).click();
      i--;
      console.log('法律地图');
    }
  } else {
    document.querySelector(`li[ng-click="homepage()"]`).click();
    console.log('返回首页');
  }
}, Math.abs(GM_config.get('interval')) * 60 * 1000);
