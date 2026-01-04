// ==UserScript==
// @name          tame QTKJ jslawyer
// @namespace     Vionlentmonkey
// @version       2.1.1
// @description   at the end of with it.
// @author        someone
// @license       MIT

// @match         http://180.101.234.37:10011/jslawyer/index.html*

// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require       https://unpkg.com/vm.shortcut
// @require       https://greasyfork.org/scripts/410150-addstyle/code/addStyle.js

// @grant         GM_registerMenuCommand
// @grant         GM_openInTab

// @run-at        document-start

// @downloadURL https://update.greasyfork.org/scripts/386623/tame%20QTKJ%20jslawyer.user.js
// @updateURL https://update.greasyfork.org/scripts/386623/tame%20QTKJ%20jslawyer.meta.js
// ==/UserScript==

const body = document.body || document.documentElement;

const windowCSS = `
#tameCfg {background-color: lightblue;}
#tameCfg .reset_holder {float: left; position: relative; bottom: -1em;}
#tameCfg .saveclose_buttons {margin: 1em;}
`;

const opencfg = () => {
  // 避免在包含框架的页面打开造成多个设置界面重叠
  if (window.top === window.self) {
    GM_config.open();
  }
};

GM_registerMenuCommand('tame QTKJ jslawyer Settings', opencfg);

GM_config.init({
  id: 'tameCfg',
  title: 'tame QTJK',
  fields: {
    open_close: {
      section: ['keyCode', '批量打开链接的快捷键'],
      label: '10s 后关闭',
      labelPos: 'right',
      type: 'text',
      default: 'F4',
    },
    open_unclose: {
      label: '不关闭',
      labelPos: 'right',
      type: 'text',
      default: 'F8',
    },
  },
  css: windowCSS,
  events: {
    save: () => {
      GM_config.close();
    },
  },
});

const css = `
  /*全局隐藏没用的转圈，隐藏密码修改框*/
  div.content-loading, #password, #passwordInfo {display: none !important;}
  /*全局退回按钮红色高亮*/
  a.btns-icon[ng-show="currWorkStatus>=firstWorkStatus"] {color: red !important;}
  /*首页修复图标重叠*/
  /*左下*/
  .tableTab[style="height: 36%;width: 35%;left:0%;top:66%;"] h3 .tab li {min-width: 22% !important;}
  /*中下。市局有调档通知，别的层级可能可以再放大些。*/
  .tableTab[style="height: 36%;width: 25%;left:35.5%;top:66%;"] h3 .tab li {min-width: 27% !important;}
  /*右下*/
  .tableTab[style="height: 36%;width: 38%;left:61%;top:66%;"] h3 .tab li {min-width: 17% !important;}
  `;
addStyle(css);

// 红色高亮 —— 数据来源：退回。不能终止重复执行，否则会导致切换页面后不再高亮。
const highlight = () => {
  if (document.querySelectorAll('td.ng-binding').length === 0) return;
  for (const tuihui of document.querySelectorAll('td.ng-binding')) {
    if (tuihui.textContent.includes('退回')) {
      tuihui.style.color = 'red';
    }
  }
};

// 修复 '停止执业期间违法执业' 等件数指向 —— 太垃圾了，Firefox 和 Edge 肯定不能正常解析。
const safe = () => {
  const unsafes = document.querySelectorAll('a.ng-binding[href="unsafe:javascript:void(0)"]');
  if (unsafes.length === 0) return;
  for (const unsafe of unsafes) {
    unsafe.setAttribute('href', 'javascript:void(0)'); // 奇怪，不能用 .href 来实现。
    console.log('safe');
  }
};

let document_observer = new MutationObserver(() => {
  highlight();
  safe();
});
document_observer.observe(body, {
  attributes: true,
  subtree: true,
});

const shortcutRegister = async () => {
  const myTameCfg = await GM_config.getValue('tameCfg');
  if (!myTameCfg) return;
  const myTameCfgs = JSON.parse(myTameCfg);

  const open_close_key = myTameCfgs.open_close;
  const open_unclose_key = myTameCfgs.open_unclose;

  VM.registerShortcut(open_close_key, () => {
    const attachments = document.querySelectorAll('a.ng-binding[ng-href^="attachment/file/"]');
    if (attachments.length === 0) return;
    for (let i = attachments.length - 1; i >= 0; i--) {
      if (attachments[i].getAttribute('href') === 'attachment/file/') continue;
      const openattach = GM_openInTab(attachments[i].href, true);
      setTimeout(() => {
        openattach.close();
      }, 10000);
    }
  });
  VM.registerShortcut(open_unclose_key, () => {
    const attachments = document.querySelectorAll('a.ng-binding[ng-href^="attachment/file/"]');
    if (attachments.length === 0) return;
    for (let i = attachments.length - 1; i >= 0; i--) {
      if (attachments[i].getAttribute('href') === 'attachment/file/') continue;
      GM_openInTab(attachments[i].href, true);
    }
  });
};
shortcutRegister();
