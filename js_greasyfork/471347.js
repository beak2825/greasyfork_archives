// ==UserScript==
// @name         选中自动朗读
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  选中自动朗读(🌈 支持大部份语言！！！🕶️)
// @license
// @author       lgldlk
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chrome.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @sandbox      JavaScript
// @downloadURL https://update.greasyfork.org/scripts/471347/%E9%80%89%E4%B8%AD%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/471347/%E9%80%89%E4%B8%AD%E8%87%AA%E5%8A%A8%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

// 定义一个防抖函数
function debounce(fn, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

// franc对应bcp 47语言
const codeMap = {
  cmn: 'zh-CN',
  spa: 'es',
  eng: 'en-GB',
  rus: 'ru',
  arb: 'ar',
  ben: 'bn',
  hin: 'hi',
  por: 'pt',
  ind: 'id',
  jpn: 'ja',
  fra: 'fr',
  deu: 'de',
  jav: 'jv',
  kor: 'ko',
  tel: 'te',
  vie: 'vi',
  mar: 'mr',
  ita: 'it',
  tam: 'ta',
  tur: 'tr',
  urd: 'ur',
  guj: 'gu',
  pol: 'pl',
  ukr: 'uk',
  kan: 'kn',
  mai: 'mai',
  mal: 'ml',
  pes: 'fa',
  mya: 'my',
  swh: 'sw',
  sun: 'su',
  ron: 'ro',
  pan: 'pa',
  bho: 'bho',
  amh: 'am',
  hau: 'ha',
  fuv: 'fuv',
  bos: 'bs',
  hrv: 'hr',
  nld: 'nl',
  srp: 'sr',
  tha: 'th',
  ckb: 'ku',
  yor: 'yo',
  uzn: 'uz',
  zlm: 'ms',
  ibo: 'ig',
  npi: 'ne',
  ceb: 'ceb',
  skr: 'skr',
  tgl: 'tl',
  hun: 'hu',
  azj: 'az',
  sin: 'si',
  koi: 'koi',
  ell: 'el',
  ces: 'cs',
  mag: 'mag',
  run: 'rn',
  bel: 'be',
  plt: 'mg',
  qug: 'qug',
  mad: 'mad',
  nya: 'ny',
  zyb: 'za',
  pbu: 'ps',
  kin: 'rw',
  zul: 'zu',
  bul: 'bg',
  swe: 'sv',
  lin: 'ln',
  som: 'so',
  hms: 'hms',
  hnj: 'hnj',
  ilo: 'ilo',
  jpn: 'ja',
  kaz: 'kk',
};

(function (window) {
  'use strict';

  const langScript = document.createElement('script');
  langScript.type = 'module';
  langScript.innerHTML = `
  import { franc, francAll } from 'https://cdn.jsdelivr.net/npm/franc-min@6.1.0/+esm';
  function debounce(fn, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    };
  }
  const selectText = debounce(() => {
    let selectText = String(document.getSelection());
    document.dispatchEvent(
      new CustomEvent('whatLang888', {
        detail: {
          fLang: franc(selectText),
          text: selectText,
        },
      })
    );
  }, 300);
  document.addEventListener('selectionchange', selectText);
`;
  document.head.appendChild(langScript);

  var menu_ALL = [['menu_disable', '🟢 已启用 (点击对当前网站禁用)', '🔴 已禁用 (点击对当前网站启用)', []]],
    menu_ID = [];

  let isDisable = menu_disable('check');
  let allLanguage = true;
  let limitTextLength = GM_getValue('menu_limitTextLength') ?? 500; // 超过多少字不朗读
  // 菜单开关
  function menu_switch(menu_status, Name, Tips) {
    if (menu_status == 'true') {
      GM_setValue(`${Name}`, false);
    } else {
      GM_setValue(`${Name}`, true);
    }

    registerMenuCommand(); // 重新注册脚本菜单
  }

  // 返回菜单值
  function menu_value(menuName) {
    for (let menu of menu_ALL) {
      if (menu[0] == menuName) {
        return menu[3];
      }
    }
  }
  for (let i = 0; i < menu_ALL.length; i++) {
    // 如果读取到的值为 null 就写入默认值
    if (GM_getValue(menu_ALL[i][0]) == null) {
      GM_setValue(menu_ALL[i][0], menu_ALL[i][3]);
    }
  }
  registerMenuCommand();
  // 注册脚本菜单
  function registerMenuCommand() {
    if (menu_ID.length != []) {
      for (let i = 0; i < menu_ID.length; i++) {
        GM_unregisterMenuCommand(menu_ID[i]);
      }
    }

    for (let i = 0; i < menu_ALL.length; i++) {
      // 循环注册脚本菜单
      menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
      if (menu_ALL[i][0] === 'menu_disable') {
        // 启用/禁用护眼模式 (当前网站)
        if (menu_disable('check')) {
          // 当前网站是否已存在禁用列表中
          menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][2]}`, function () {
            menu_disable('del');
          });
          return;
        } else {
          menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][1]}`, function () {
            menu_disable('add');
          });
        }
      } else {
        menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '🟢' : '🔴'} ${menu_ALL[i][1]}`, function () {
          menu_switch(`${menu_ALL[i][3]}`, `${menu_ALL[i][0]}`, `${menu_ALL[i][2]}`);
        });
      }
    }
    menu_ID[menu_ID.length] = GM_registerMenuCommand('📻 限制多少字以上不朗读(目前：' + limitTextLength + ')', function () {
      const aNumber = Number(window.prompt('请输入限制字数～', ''));
      if (isNaN(aNumber)) {
        alert('请输入数字');
        return;
      }
      if (aNumber < 0) {
        alert('请输入大于0的数字');
        return;
      }
      GM_unregisterMenuCommand('📻 限制多少字以上不朗读(目前：' + limitTextLength + ')');
      limitTextLength = aNumber;

      GM_setValue('menu_limitTextLength', aNumber);
      registerMenuCommand();
    });
    menu_ID[menu_ID.length] = GM_registerMenuCommand('📬  欢迎提出反馈和建议，我会非常重视您的意见。', function () {
      window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/471347/feedback', { active: true, insert: true, setParent: true });
    });
  }

  // 启用/禁用护眼模式 (当前网站)
  function menu_disable(type) {
    switch (type) {
      case 'check':
        return check();
      case 'add':
        add();
        break;
      case 'del':
        del();
        break;
    }

    function check() {
      // 存在返回真，不存在返回假
      let websiteList = menu_value('menu_disable'); // 读取网站列表
      if (websiteList.indexOf(location.host) === -1) return false; // 不存在返回假
      return true;
    }

    function add() {
      if (check()) return;
      let websiteList = menu_value('menu_disable'); // 读取网站列表
      websiteList.push(location.host); // 追加网站域名
      GM_setValue('menu_disable', websiteList); // 写入配置
      isDisable = true;
      registerMenuCommand();
    }

    function del() {
      if (!check()) return;
      let websiteList = menu_value('menu_disable'), // 读取网站列表
        index = websiteList.indexOf(location.host);
      websiteList.splice(index, 1); // 删除网站域名
      GM_setValue('menu_disable', websiteList); // 写入配置
      isDisable = false;
      registerMenuCommand();
    }
  }

  const speakFunc = ({ detail }) => {
    const { text, fLang } = detail;
    if (isDisable) return;
    if (!text.length || text.length > limitTextLength) return;
    let ssu = new SpeechSynthesisUtterance(text);
    ssu.lang = codeMap[fLang];
    speechSynthesis.cancel();
    speechSynthesis.speak(ssu);
  };
  document.addEventListener('whatLang888', speakFunc);
  /*
  啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。啊，这是什么？😮失忆喷雾？喷一下💦。

  😮💭💦💭😮💦💭😮💦💭😮💦💭😮💦💭😮💦💭😮💦💭😮💦

  😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪😮‍💨▪🈁🫡😶❔😮😥🤔⛲🌫❔⛲☝👇💦▪

   */
})(window);
