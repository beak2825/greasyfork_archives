// ==UserScript==
// @name         PttChrome+term.ptt.cc Add-on
// @license MIT
// @namespace    https://greasyfork.org/zh-TW/scripts/372391-pttchrome-add-on-ptt
// @description  new features for PttChrome+term.ptt.cc (show flags features code by osk2/ptt-comment-flag)
// @version      1.7.1
// @author       avan
// @match        https://iamchucky.github.io/PttChrome/*
// @match        term.ptt.cc/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://update.greasyfork.org/scripts/480183/1282331/GM_config_sync.js
// @require      https://greasyfork.org/scripts/372760-gm-config-lz-string/code/GM_config_lz-string.js?version=634230
// @require      https://greasyfork.org/scripts/372675-flags-css/code/Flags-CSS.js?version=632757
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/372391/PttChrome%2Btermpttcc%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/372391/PttChrome%2Btermpttcc%20Add-on.meta.js
// ==/UserScript==
"use strict";
//===================================
const pageUrl = window.location.href;
const isTerm = pageUrl.match(/term.ptt.cc/);
let configStatus = false, configBlackStatus = false, flagMap = {};
let fields = { // Fields object
  'isAddFloorNum': {
    'label': '是否顯示推文樓層', // Appears next to field
    'type': 'checkbox', // Makes this setting a checkbox input
    'default': true // Default value if user doesn't change it
  },
  'isShowFlags': {
    'label': '看板內若有IP(ex.Gossiping)，是否依IP顯示國旗', // Appears next to field
    'type': 'checkbox', // Makes this setting a checkbox input
    'default': true // Default value if user doesn't change it
  },
  'whenShowFlagsIgnoreSpecificCountrys': {
    'label': '指定國家不顯示 ex.「tw;jp」(ISO 3166-1 alpha-2)', // Appears next to field
    'type': 'text', // Makes this setting a text input
    'size': 35, // Limit length of input (default is 25)
    'default': '' // Default value if user doesn't change it
  },
  'isHndleAuthor': {
    'label': '是否合併相同作者連續留言的ID名稱', // Appears next to field
    'type': 'checkbox', // Makes this setting a checkbox input
    'default': false // Default value if user doesn't change it
  },
  'isShowDebug': {
    'label': '是否顯示DeBug紀錄', // Appears next to field
    'type': 'checkbox', // Makes this setting a checkbox input
    'default': false // Default value if user doesn't change it
  },
};
if (isTerm) {
  fields = Object.assign({
    'isAutoLogin': {
      'label': '是否自動登入', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'autoUser': {
      'label': '帳號', // Appears next to field
      'type': 'text', // Makes this setting a text input
      'size': 25, // Limit length of input (default is 25)
      'default': '' // Default value if user doesn't change it
    },
    'autoPassWord': {
      'label': '密碼', // Appears next to field
      'type': 'password', // Makes this setting a text input
      'size': 25, // Limit length of input (default is 25)
      'default': '' // Default value if user doesn't change it
    },
    'isAutoSkipInfo1': {
      'label': '是否自動跳過登入後歡迎畫面', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'isAutoToFavorite': {
      'label': '是否自動進入 Favorite 我的最愛', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'isEnableDeleteDupLogin': {
      'label': '當被問到是否刪除其他重複登入的連線，回答:', // Appears next to field
      'type': 'select', // Makes this setting a dropdown
      'options': ['N/A', 'Y', 'N'], // Possible choices
      'default': 'N/A' // Default value if user doesn't change it
    },
    'Button': {
      'label': '編輯黑名單', // Appears on the button
      'type': 'button', // Makes this setting a button input
      'size': 100, // Control the size of the button (default is 25)
      'click': function() { // Function to call when button is clicked
        if (configBlackStatus) gmcBlack.close();
        else if (!configBlackStatus) gmcBlack.open();
      }
    },
    'isHideViewImg': {
      'label': '是否隱藏黑名單圖片預覽', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    'isHideViewVideo': {
      'label': '是否隱藏黑名單影片預覽', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    "previewPbsTwimg": {
      'label': '是否預覽推特圖片',
      'type': 'checkbox',
      'default': true
    },
    "previewMeeeimg": {
      'label': '是否預覽Meee圖片',
      'type': 'checkbox',
      'default': true
    },
    "previewYoutube": {
      'label': '是否預覽Youtube影片',
      'type': 'checkbox',
      'default': true
    },
    /*
    'isHideAll': {
      'label': '是否隱藏黑名單推文', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'whenHideAllShowInfo': {
      'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
      'type': 'text', // Makes this setting a text input
      'size': 35, // Limit length of input (default is 25)
      'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
    },
    'whenHideAllShowInfoColor': {
      'label': '上述提示訊息之顏色', // Appears next to field
      'type': 'text', // Makes this setting a text input
      'class':'jscolor',
      'data-jscolor': '{hash:true}',
      'size': 10, // Limit length of input (default is 25)
      'default': '#c0c0c0' // Default value if user doesn't change it
    },
    'isReduceHeight': {
      'label': '是否調降黑名單推文高度', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    'reduceHeight': {
      'label': '設定高度值(單位em)', // Appears next to field
      'type': 'float', // Makes this setting a text input
      'min': 0, // Optional lower range limit
      'max': 10, // Optional upper range limit
      'size': 10, // Limit length of input (default is 25)
      'default': 0.4 // Default value if user doesn't change it
    },
    'isReduceOpacity': {
      'label': '是否調降黑名單推文透明值', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'reduceOpacity': {
      'label': '設定透明值', // Appears next to field
      'type': 'float', // Makes this setting a text input
      'min': 0, // Optional lower range limit
      'max': 1, // Optional upper range limit
      'size': 10, // Limit length of input (default is 25)
      'default': 0.05 // Default value if user doesn't change it
    },
    'isDisableClosePrompt': {
      'label': '是否停用關閉頁面提示', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    */
  }, fields);
} else {
  fields = Object.assign({
    'isHideAll': {
      'label': '是否隱藏黑名單推文', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'whenHideAllShowInfo': {
      'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
      'type': 'text', // Makes this setting a text input
      'size': 35, // Limit length of input (default is 25)
      'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
    },
    'whenHideAllShowInfoColor': {
      'label': '上述提示訊息之顏色', // Appears next to field
      'type': 'text', // Makes this setting a text input
      'class':'jscolor',
      'data-jscolor': '{hash:true}',
      'size': 10, // Limit length of input (default is 25)
      'default': '#c0c0c0' // Default value if user doesn't change it
    },
    'isHideViewImg': {
      'label': '是否隱藏黑名單圖片預覽', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    'isHideViewVideo': {
      'label': '是否隱藏黑名單影片預覽', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
    'isReduceHeight': {
      'label': '是否調降黑名單推文高度', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'reduceHeight': {
      'label': '設定高度值(單位em)', // Appears next to field
      'type': 'float', // Makes this setting a text input
      'min': 0, // Optional lower range limit
      'max': 10, // Optional upper range limit
      'size': 10, // Limit length of input (default is 25)
      'default': 0.4 // Default value if user doesn't change it
    },
    'isReduceOpacity': {
      'label': '是否調降黑名單推文透明值', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': false // Default value if user doesn't change it
    },
    'reduceOpacity': {
      'label': '設定透明值', // Appears next to field
      'type': 'float', // Makes this setting a text input
      'min': 0, // Optional lower range limit
      'max': 1, // Optional upper range limit
      'size': 10, // Limit length of input (default is 25)
      'default': 0.05 // Default value if user doesn't change it
    },
    'isAutoGotoAIDPage': {
      'label': '是否自動跳至AID文章，而非開啟www.ptt.cc網站', // Appears next to field
      'type': 'checkbox', // Makes this setting a checkbox input
      'default': true // Default value if user doesn't change it
    },
  }, fields);
};

// Convert number to it's base-64 representation, and reverse it. https://gist.github.com/meeDamian/5749143
const Number64 = {
  _rixits: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_",
  toHash: (n) => {
    if(isNaN(Number(n)) || n === null || n === Number.POSITIVE_INFINITY || n < 0 ) throw "The input(" + n + ") is not valid";
    n = Math.floor(n);
    let result = '';
    do result = Number64._rixits.charAt(n%64) + result;
    while(n = Math.floor(n/64));
    return result; // String
  },
  toNumber: (h) => {
    let result = 0;
    for(let i = 0; i < h.length; i++) result = (result*64) + Number64._rixits.indexOf(h.charAt(i));
    return result; // Integer
  }
}

//M.timestamp.A.random{0xfff}
//https://www.ptt.cc/man/C_Chat/DE98/DFF5/DB61/M.1419434423.A.DF0.html
unsafeWindow.AID = {
  patternEncode: (name) => {
    const pattern = /([\w-]*)\/{0,1}M\.(\d+)\.A\.(\w{3})/g;
    const match = pattern.exec(name); //['GroupName/M.1234567890.A.DEF', 'GroupName', '1234567890', 'DEF', index: 23, input:...]
    return match;
  },
  patternDecode: (aid) => {
    const pattern = /(?<![\w/'"<>;])#([\w-]{6})([\w-]{2})(?: *\(([\w-]+)\)){0,1}/g;
    const match = pattern.exec(aid); //['#19bWBItl (GroupName)', '19bWBI', 'tl', 'GroupName', index: 0, input: '#19bWBItl (GroupName)']
    return match;
  },
  patternDecodeAll: (text) => {
    const pattern = /(?<![\w/'"<>;])#([\w-]{6})([\w-]{2})(?: *\(([\w-]+)\)){0,1}/g;
    const matchs = [...new Set(text.matchAll(pattern))]//[...text.matchAll(pattern)]; //matchAll compatibility support in Chrome 73
    return matchs;
  },
  encode: (name) => {
    const match = unsafeWindow.AID.patternEncode(name);
    if (!match || match.length < 4) throw "The input(" + name + ") is not valid";
    const hash1 = Number64.toHash(match[2])
    const hash2 = Number64.toHash(parseInt("0x" + match[3]))
    let result = "#" + hash1 + hash2;
    if (match[1].length > 0) result += " (" + match[1] + ")"
    return result;
  },
  decode: (decodeMatch, defaultGroup) => {
    if (!decodeMatch || decodeMatch.length < 3) throw "The input is not valid";
    const timestamp = Number64.toNumber(decodeMatch[1]);
    const random = Number64.toNumber(decodeMatch[2]).toString(16).toUpperCase().padStart(3, '0');
    let result = "M." + timestamp + ".A." + random;
    if (decodeMatch[3] && decodeMatch[3].length > 0) defaultGroup = decodeMatch[3];
    result = "https://www.ptt.cc/bbs/" + defaultGroup + "/" + result + ".html";
    return result;
  },
  goto: (aid) => {
    if (isTerm) return
    if (unsafeWindow.pttchrome.app.view.bbscore.buf.pageState === 3) unsafeWindow.pttchrome.app.conn.send("[D[D")
    if (unsafeWindow.pttchrome.app.view.bbscore.buf.pageState === 5) unsafeWindow.pttchrome.app.conn.send("\r")
    unsafeWindow.pttchrome.app.buf.cancelPageDownAndResetPrevPageState()

    const aidArr = aid.split(" ", 2)
    if (aidArr.length > 1) {
      aid = aidArr[0]
      unsafeWindow.pttchrome.app.conn.send("s")
      unsafeWindow.pttchrome.app.conn.send(aidArr[1] + "\r\r[1~")
    }
    unsafeWindow.pttchrome.app.buf.cancelPageDownAndResetPrevPageState()

    if (unsafeWindow.pttchrome.app.view.bbscore.buf.BBSWin.innerText.includes("【看板列表】")) return

    unsafeWindow.pttchrome.app.conn.send(aid + "\r\r[1~")
  }
}

const queryConfigEl = (configSelectors, selectors, callback) => {
  let configEl = document.querySelector(configSelectors);
  if (!configEl) {
    setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
    return;
  }
  configEl = configEl.contentWindow.document.querySelector(selectors);
  if (!configEl) {
    setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
    return;
  }
  callback(configEl);
};

const addCssLink = (id, cssStr) => {
  let checkEl = document.querySelector(`#${id}`);
  if (checkEl) {
    checkEl.remove();
  }
  const cssLinkEl = document.createElement('link');
  cssLinkEl.setAttribute('rel', 'stylesheet');
  cssLinkEl.setAttribute('id', id);
  cssLinkEl.setAttribute('type', 'text/css');
  cssLinkEl.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(cssStr));
  document.head.appendChild(cssLinkEl);
};
const gmc = new ConfigLzString({
  'id': 'PttChromeAddOnConfig', // The id used for this instance of GM_config
  'title': 'PttChrome Add-on Settings', // Panel Title
  'fields': fields,
  'events': { // Callback functions object
    'open': function() {
      this.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 23em; height: 35em; position: fixed; top: 2.5em; right: 0.5em; z-index: 900;");

      configStatus = true;
    },
    'close': () => { configStatus = false;},
  },
  'css': `#PttChromeAddOnConfig * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfig { background-color: #111}`,
  'src':`https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.js`,
});
const gmcDebug = new ConfigLzString({
  'id': 'PttChromeAddOnConfigDebug', // The id used for this instance of GM_config
  'title': 'PttChrome Add-on DeBugLog', // Panel Title
  'fields': { // Fields object
    'showLog': {
      'label': 'Show log of debug text',
      'type': 'textarea',
      'default': ''
    },
  },
  'events': { // Callback functions object
    'open': () => {
      gmcDebug.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
    },
  },
  'css': `#PttChromeAddOnConfigDebug * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigDebug { background-color: #111} #PttChromeAddOnConfigDebug_field_showLog { width:26em; height: 24em;}`
});
const addBlackStyle = (blackList) => {
  if (blackList && blackList.trim().length === 0) return;
  blackList = blackList.replace(/\n$/g, '').replace(/\n\n/g, '\n');

  let opacityStyle = blackList.replace(/([^\n]+)/g, '.blu_$1').replace(/\n/g, ',');
  addCssLink('opacityStyle', `${opacityStyle} {opacity: 0.2;}`);

  if (gmc.get('isHideViewImg')) {
    let imgStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingImg').replace(/\n/g, ',');
    addCssLink('imgStyle', `${imgStyle} {display: none;}`);
  }
  if (gmc.get('isHideViewVideo')) {
    let videoStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingVideo').replace(/\n/g, ',');
    addCssLink('videoStyle', `${videoStyle} {display: none;}`);
  }
}
const gmcBlack = new ConfigLzString({
  'id': 'PttChromeAddOnConfigBlack', // The id used for this instance of GM_config
  'title': 'PttChrome Add-on Black List', // Panel Title
  'fields': { // Fields object
    'blackList': {
      'label': 'Black List',
      'type': 'textarea',
      'default': ''
    },
  },
  'events': { // Callback functions object
    'init': function() {
      addBlackStyle(this.get('blackList'));
    },
    'open': function() {
      gmcBlack.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
      configBlackStatus = true;
    },
    'save': function() {
      addBlackStyle(this.get('blackList'));
    },
    'close': function() { configBlackStatus = false;},
  },
  'css': `#PttChromeAddOnConfigBlack * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigBlack { background-color: #111} #PttChromeAddOnConfigBlack_field_blackList { width:26em; height: 24em;}`
});
const HOST = 'https://osk2.me:9977',
    ipValidation = /(\d{1,3}\.){3}\d{1,3}/,
    timerArray = [];

let timestamp = Math.floor(Date.now() / 1000);
const execInterval = () => {
  if (timerArray.length === 0) {
    timerArray.push(setInterval(excute, 1000));
  }
}
const stopInterval = () => {
  while (timerArray.length > 0) {
    clearInterval(timerArray .shift());
  }
}
let currentNum, currentPage, pageData = {}, currentGroup;
const excute = async () => {
  //console.log("do excute");
  const css = (elements, styles) => {
    elements = elements.length ? elements : [elements];
    elements.forEach(element => {
      for (var property in styles) {
        element.style[property] = styles[property];
      }
    });
  }
  const findAll = (elements, selectors) => {
    let rtnElements = [];
    elements = elements.length ? elements : [elements];
    elements.forEach(element => rtnElements.push.apply(rtnElements, element.querySelectorAll(selectors)));
    return rtnElements;
  }
  const innerHTMLAll = (elements) => {
    let rtn = "";
    elements = elements.length ? elements : [elements];
    elements.forEach(element => {element.innerHTML ? rtn += element.innerHTML : ""});
    return rtn;
  }
  const show = (elements, specifiedDisplay = 'block') => {
    elements = elements.length ? elements : [elements];
    elements.forEach(element => {
      if (!element.style) return;
      element.style.display = specifiedDisplay;
    });
  }
  const hide = (elements) => {
    elements = elements.length ? elements : [elements];
    elements.forEach(element => {
      if (!element.style) return;
      element.style.display = 'none';
    });
  }
  const generateImageHTML = (ip, flag) => {
    if (!flag) return;
    flag.countryCode = flag.countryCode ? flag.countryCode : "unknown";
    const ignoreCountrys = gmc.get('whenShowFlagsIgnoreSpecificCountrys').match(new RegExp(flag.countryCode, 'i'));
    if (ignoreCountrys && ignoreCountrys.length > 0) return;
    const imageTitile = `${flag.locationName || 'N/A'}<br><a href='https://www.google.com/search?q=${ip}' target='_blank'>${ip}</a>`;

    return `<div data-flag title="${imageTitile}" class="flag-${flag.countryCode}" style="background-repeat:no-repeat;background-position:left;float:right;height:0.8em;width:0.8em;cursor:pointer !important;"></div>`;
  }
  const chkBlackSpan = (isListPage) => {
    if (isTerm && isListPage) {
      let allNode = document.querySelectorAll('span[data-type="bbsline"]');
      if (allNode && allNode.length > 0) {
        allNode = [].filter.call(allNode, (element, index) => {
          if (element.dataset.type === 'bbsline') { //for term.ptt.cc
            let user = element.querySelectorAll('span[class^="q7"]')
            if (user && user.length > 1 && user[1].innerHTML.length > 10) {
              user = user[1].innerHTML.replace(/ +/g, ' ').split(' ');
              user = user && user.length > 3 ? user[1].toLowerCase() : "";
              user && user.match(/^[^\d][^ ]+$/) ? element.classList.add(`blu_${user}`) : null;
            }
            user = element.querySelector('span[class^="q15"]')
            if (user && user.innerHTML.trim().match(/^[^\d][^ ]+$/)) {
              user = user ? user.innerText.trim().toLowerCase() : "";
              user ? element.classList.add(`blu_${user}`) : null;
            }
          }
        });
      }
    }
    let blackSpan = document.querySelectorAll('span[style="opacity:0.2"]');
    let whenHideAllShowInfoCss = document.querySelector('#whenHideAllShowInfo');
    if (blackSpan.length > 0) {
      writeDebugLog(`黑名單筆數：${blackSpan.length}`);
      if (whenHideAllShowInfoCss) whenHideAllShowInfoCss.remove();
      gmc.get('isHideViewImg') && hide(findAll(blackSpan, 'img:not([style*="display: none"])'));
      gmc.get('isHideViewVideo') && hide(findAll(blackSpan, '.easyReadingVideo:not([style*="display: none"])'));
      if (gmc.get('isHideAll')) {
        if (gmc.get('whenHideAllShowInfo').length > 0 || isListPage) {
          addCssLink('whenHideAllShowInfo', `
span[type="bbsrow"][style="opacity:0.2"] {opacity:1 !important;visibility: hidden;}
span[type="bbsrow"][style="opacity:0.2"]:before {
visibility: visible;color: ${gmc.get('whenHideAllShowInfoColor')};
content: '                 -            ${gmc.get('whenHideAllShowInfo')}';
}`);
        } else {
          hide(blackSpan);
        }
      } else {
        !isListPage && gmc.get('isReduceHeight') && css(blackSpan, {
          'height': gmc.get('reduceHeight') + 'em',
          'font-size': (gmc.get('reduceHeight')/2) + 'em',
          'line-height': gmc.get('reduceHeight') + 'em'
        });
        gmc.get('isReduceOpacity') && css(blackSpan, {'opacity': gmc.get('reduceOpacity')});
      }
    }
  }
  const findPrevious = (element, selectors) => {
    if (!element) return;
    if (element.dataset.type === 'bbsline') { //for term.ptt.cc
      element = element.closest('span[type="bbsrow"]');
      element = element.parentElement;
    }
    element = element.previousElementSibling;
    if (!element) return;
    let rtnElement = element.querySelectorAll(selectors)
    if (rtnElement && rtnElement.length > 0) {
      return rtnElement;
    } else {
      return findPrevious(element, selectors);
    }
  }
  const firstEl = (element) => {
    if (!element) return;
    if (element.dataset.type === 'bbsline') { //for term.ptt.cc
      element = element.closest('span[type="bbsrow"]');
      element = element.parentElement;
    }
    element = element.nextElementSibling;
    if (!element) return;
    if (!element.textContent.startsWith("※")) {
      if (element.querySelector('span[data-type="bbsline"]')) { //for term.ptt.cc
        return element.querySelector('span[data-type="bbsline"]');
      } else if (element.classList.toString().match(/blu_[^ ]+/)) {
        return element;
      }
    } else {
      return firstEl(element);
    }
  }
  const queryPage = (node) => {
    let rtnPage;
    if (node && node.length > 0) {
      rtnPage = node[node.length -1].querySelector('span');
      if (!rtnPage) return;
      rtnPage = rtnPage.innerText.match(/瀏覽[^\d]+(\d+)\/(\d+)/);
      if (rtnPage && rtnPage.length === 3) {
        rtnPage = rtnPage[1];
        writeDebugLog(`警告：未啟用文章好讀模式，結果會不正確`);
        return rtnPage;
      }
    }
  }

  const adjAllNode = (allNode) => {
    let bluName = null;
    allNode.some((comment, index) => {
      try {
        const test = comment.innerHTML.match(/^[ \t]*\d+/);
        if (test && test.length > 0) return true;

        if (gmc.get('isAddFloorNum') && comment.classList && comment.classList.toString().match(/blu_[^ ]+/) && !comment.innerHTML.match(/data-floor/)) {
          //確認該行是否為"轉錄者"的節點
          if (isHasTranscriber && comment === transcriberNode) {
            currentNum = 1;
          }
          else if (currentNum > 0) {
            let upstairs = findPrevious(allNode[index], 'div[data-floor]');
            if (upstairs && upstairs.length > 0) {
              let upstairsNum = Number(upstairs[0].innerHTML);
              if (upstairsNum) {
                currentNum = Number(upstairs[0].innerHTML) + 1;
              }
            } else if (currentPage) { //非好讀模式才有頁數
              if (!pageData[currentPage]) pageData[currentPage] = currentNum;
              currentNum = pageData[currentPage];
            } else {
              currentNum = 1;
            }
          } else if (isHasFirst && comment === firstNode) {
            currentNum = 1;
          } else if (!isHasFirst) {
            currentNum = 1;
          }
          if (currentNum > 0) {
            count.commentCnt++
            const divCnt = `<div data-floor style="float:left;margin-left: 2.2%;height: 0em;width: 1.5em;font-size: 0.4em;font-weight:bold;text-align: right;">${currentNum}</div>`;
            comment.innerHTML = divCnt + comment.innerHTML.trim();
          } else {
            const divCnt = `<div data-floor></div>`;
            comment.innerHTML = divCnt + comment.innerHTML.trim();
          }
        } else if ((gmc.get('isAddFloorNum') && comment.classList && !comment.querySelector('.q2') && !comment.classList.toString().match(/blu_[^ ]+/))) {
          writeDebugLog(`警告 推文資料格式錯誤：${comment.innerHTML}`);
        } else if (comment.innerHTML.match(/data-floor/)) {
          count.completed++;
        }

        if (gmc.get("isHndleAuthor") && comment.classList && comment.classList.toString().match(/blu_[^ ]+/) ) {
          if (bluName && bluName === comment.classList.toString()) {
            const spans = comment.querySelectorAll("span[class]")
            if (spans.length >= 3) {
              spans[1].textContent = spans[1].textContent.replace(/./g, ' ') //將同一人的第二行的ID置換為空白
              spans[2].innerHTML   = spans[2].innerHTML.replace(/^:/g, ' ')
            }
          }
          bluName = comment.classList.toString()
        }

        if (!gmc.get('isShowFlags')) return;

        const ip = comment.innerHTML.match(ipValidation);

        if (!ip) return;
        if (comment.innerHTML.match(/data-flag/)) return;
        const imageHTML = generateImageHTML(ip[0], flagMap[ip[0]]);
        if (!imageHTML) return;

        const authorNode = comment.querySelector("span.q2");
        if (authorNode) {
          count.authorIp++;
          authorNode.innerHTML = imageHTML + authorNode.innerHTML.trim()
        } else {
          count.commentIp++;
          comment.innerHTML = imageHTML + comment.innerHTML.trim();
        }
        timestamp = Math.floor(Date.now() / 1000);
      } catch (e) {
        console.log("AdjAllNode failed, err:" + e);
      }
    });
    if (document.querySelectorAll("[data-flag]").length >= allNode.length) {
      const instance = tippy('[data-flag]', {
        arrow: true,
        size: 'large',
        placement: 'left',
        interactive: true
      });
    }
  }
  const currentTS = Math.floor(Date.now() / 1000);

  if ((currentTS - timestamp) > 2) stopInterval();

  const checkNodes = document.querySelectorAll('span.q2');
  let invalid = true;
  if (checkNodes.length > 0) {
    for (let spanQ2 of document.querySelectorAll('span.q2')) {
      if (invalid && spanQ2.innerHTML.length > 10) {
        invalid = false;
        break;
      }
    }
  }
  if (!invalid) chkBlackSpan();
  else {
    chkBlackSpan(true);
    const spanBBSrowSrow0 = document.querySelector('span[type="bbsrow"][srow="0"]');
    if (spanBBSrowSrow0) {
      const match = / +看板《([\w-]+)》/g.exec(spanBBSrowSrow0.textContent);
      if (match && match.length > 1 && match[1].length > 0) currentGroup = match[1];
    }
    return;
  }

  let currentURL, firstNode, isHasFirst, transcriberNode, isHasTranscriber, author, signGroup, allNode = document.querySelectorAll('span[type="bbsrow"]'), bbsline = document.querySelectorAll('span[data-type="bbsline"]');
  bbsline && bbsline.length > 0 ? allNode = bbsline : null; //for term.ptt.cc

  currentPage = queryPage(allNode);

  let count = {author:0, comment:0, authorCnt:0, commentCnt:0, authorIp:0, commentIp:0, completed: 0};
  allNode = [].filter.call(allNode, (element, index) => {
    if (element.dataset.type === 'bbsline') { //for term.ptt.cc
      let user = element.querySelector('span[class^="q11"]'); //ex.1.<span class="q11 b0">USERNAME</span> 2.<span class="q11 b0">USERNAME   </span>
      let name = user ? user.innerHTML.match(/^([^ ]+)[ ]*$/) : "";
      name && name.length > 0 ? element.classList.add(`blu_${name[1]}`) : null;
    }
    if (index === 0) { //從文章第一行中取得作者(author)與看板(signGroup)
      let articleInfos = element.textContent.match("作者 +(.*) +看板 +(.*) +")
      if (articleInfos && articleInfos.length > 2) {
        author = articleInfos[1].trim()
        signGroup = articleInfos[2].trim()
      }
    }

    const textLink = element.querySelector("a[href]:not([previewProcessed])")
    let previewElements = "";
    if (isTerm) {
      if (gmc.get("previewPbsTwimg")) {
        let imgUrls = element.textContent.match(/https{0,1}:\/\/pbs.twimg.com\/media\/[^ ]+/g);
        if (imgUrls && imgUrls.length) {
          for (let url of imgUrls) {
            if (url) previewElements += `<img class="easyReadingImg hyperLinkPreview" src="${url}">`
          }
        }
      }
      if (gmc.get("previewMeeeimg")) {
        let imgUrls = element.textContent.match(/https{0,1}:\/\/[^ ]*meee\.com\.tw\/[^ ]+/g);
        if (imgUrls && imgUrls.length) {
          for (let url of imgUrls) {
            if (url) {
              const url_ = new URL(url)
              if (!url_.pathname.includes(".")) url += ".jpg"
              previewElements += `<img class="easyReadingImg hyperLinkPreview" src="${url}">`
            }
          }
        }
      }
      if (gmc.get("previewYoutube")) {
        let youtubeUrls = element.textContent.match(/https{0,1}:\/\/[^ ]*youtu\.{0,1}be[^ ]*\/[^ ]*/g)
        if (youtubeUrls && youtubeUrls.length) {
          for (let url of youtubeUrls) {
            let VIDEO_ID = ""
            const url_ = new URL(url)
            const urlParams = url_.searchParams
            if (urlParams.get("v")) VIDEO_ID = urlParams.get("v")
            else if (url_.pathname) VIDEO_ID = url_.pathname.replace(/^\//,"")
            if (VIDEO_ID) previewElements += `<iframe width="50%" height="400px" class="easyReadingVideo hyperLinkPreview" src="https://www.youtube.com/embed/${VIDEO_ID}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
          }
        }
      }
    }
    else {
      let imgUrls = element.textContent.match(/https{0,1}:\/\/pbs.twimg.com\/media\/[^ ]+format=[^ ]+/g);
      if (imgUrls && imgUrls.length) {
        for (let url of imgUrls) {
          if (url) previewElements += `<img class="easyReadingImg hyperLinkPreview" src="${url}">`
        }
      }
    }
    if (textLink && previewElements !== "") {
      textLink.setAttribute("previewProcessed","")
      element.outerHTML += previewElements
    }

    let node = element.innerHTML.match('※ 文章網址:');
    if (node && node.length > 0) {
      isHasFirst = true;
      const currentLink = element.querySelector("a");
      if (currentLink) {
        currentURL = currentLink.href;
        const match = unsafeWindow.AID.patternEncode(currentURL);
        if (match && match.length > 1 && match[1].length > 0) currentGroup = match[1];
      }
      firstNode = firstEl(element);
      if (firstNode && !firstNode.innerHTML.match(/data-floor/)) {
        pageData = [];
        currentNum = -1;
      }
    }
    //Verify transcriber
    let transcriberElement = element.innerHTML.match('※ 轉錄者:');
    if (transcriberElement && transcriberElement.length > 0) {
      isHasTranscriber= true;
      transcriberNode = firstEl(element);
    }

    const elementSpan = isTerm ? element.querySelectorAll("span span[class]") : null
    const matchs = unsafeWindow.AID.patternDecodeAll(elementSpan && elementSpan.length === 1 ? elementSpan[0].innerHTML : element.innerHTML);
    if (matchs && matchs.length > 0) {
      matchs.forEach((match) => {
        if (match && match.length > 3) {
          let name = "";
          const subMatch = /本文轉錄自 +([\w-]+) +看板/g.exec(match.input);
          if (subMatch && subMatch.length > 1 && subMatch[1].length > 0) {
            if (!isHasTranscriber) name = unsafeWindow.AID.decode(match, subMatch[1]);
            else name = unsafeWindow.AID.decode(match, signGroup);
          } else {
            if (!isHasTranscriber) name = unsafeWindow.AID.decode(match, currentGroup);
            else name = unsafeWindow.AID.decode(match, signGroup);
          }
          if (!isTerm && gmc.get("isAutoGotoAIDPage")) element.innerHTML = element.innerHTML.replace(match[0], '<a href="' + name + '" target="_blank" onclick=\'AID.goto("' + match[0] + '");return false;\'>' + match[0] + '</a>')
          else element.innerHTML = element.innerHTML.replace(match[0], '<a href="' + name + '" target="_blank">' + match[0] + '</a>');
        }
      });
    }

    if (innerHTMLAll(findAll(element, "span.q2")).match(ipValidation)) {
      count.author++;
      return true;
    }
    if (element.classList && element.classList.toString().match(/blu_[^ ]+/)) {
      count.comment++;
      return true;
    }
  });
  writeDebugLog(`偵測 作者筆數：${count.author}、留言筆數：${count.comment}`);
  adjAllNode(allNode);
  if (count.comment !== count.completed) {
    writeDebugLog(`寫入 作者IP數：${count.authorIp}、留言樓層：${count.commentCnt}、留言IP數：${count.commentIp}`);
  }
  let allIpList = allNode.map(c => {
    const ip = c.innerHTML.match(ipValidation);
    if (ip && !flagMap[ip[0]]) return ip[0];
  });
  allIpList = new Set(allIpList);
  allIpList.delete(undefined);
  allIpList.delete(null);
  allIpList = Array.from(allIpList);
  if (allIpList && allIpList.length > 0 && allIpList[0]) {
    try {
      const flagsResponse = await axios.post(`${HOST}/ip`, { ip: allIpList}, {headers: {'Content-Type': 'application/json',}}),
          flags = flagsResponse.data;
      if (flags && flags.length > 0) {
        flags.forEach((flag, index) => {
          const ip = allIpList[index];
          if (!flag) {
            flag = [];
          } else if (flag.imagePath) {
            flag.countryCode = flag.imagePath.toLowerCase().replace('assets/','').replace('.png','');;
          }
          flag.ip = ip;
          flagMap[ip] = flag;
        });
        adjAllNode(allNode);
      }
    } catch (ex) {
      writeDebugLog(`查詢IP失敗...${ex}`);
      console.log(`查詢IP失敗...${ex}`);
    }
  }
}

const chkBeforeunloadEvents = () => {
  if (gmc.get('isDisableClosePrompt')) {
    window.addEventListener("beforeunload", function f() {
      window.removeEventListener("beforeunload", f, true);
    }, true);
    unsafeWindow.addEventListener("beforeunload", function beforeunload() {
      unsafeWindow.removeEventListener("beforeunload", beforeunload, true);
    }, true);
    if (window.getEventListeners) {
      window.getEventListeners(window).beforeunload.forEach((e) => {
        window.removeEventListener('beforeunload', e.listener, true);
      })
    } else if (unsafeWindow.getEventListeners) {
      unsafeWindow.getEventListeners(unsafeWindow).beforeunload.forEach((e) => {
        unsafeWindow.removeEventListener('beforeunload', e.listener, true);
      })
    } else {
      setTimeout(chkBeforeunloadEvents, 2000);
    }
  }
}

const CreateMutationObserver = () => {
  const container = document.querySelector('#mainContainer');
  if (!container) {
    setTimeout(CreateMutationObserver, 2000);
    return;
  }

  if (isTerm) {
    autoLogin(container);
    const reactAlert = document.querySelector('#reactAlert');
    const observerTerm = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (reactAlert.querySelector('p button')) {
          reactAlert.querySelector('p button').addEventListener("click", function(event) {
            autoLogin(container);
          });
        }
      });
    })
    observerTerm.observe(reactAlert, {childList: true,});
  }
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => execInterval());
  })
  observer.observe(container, {childList: true,});

  //chkBeforeunloadEvents();
}

const writeDebugLog = (log) => {
  if (gmc.get('isShowDebug')) {
    queryConfigEl('#PttChromeAddOnConfigDebug', 'textarea', el => {
      el.value = `${log}\n` + el.value;
    });
  }
}
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const autoLogin = async (container) => {
  const checkAndWait = async (container, keyword) => {
    if (container && container.innerText.match(keyword)) {
      await sleep(1000);
      return checkAndWait(container, keyword);
    }
  }
  const pasteInputArea = async (str) => {
    let inputArea = document.querySelector('#t');
    if (!inputArea) {
      await sleep(1000);
      return pasteInputArea(str);
    }

    const pasteE = new CustomEvent('paste');
    pasteE.clipboardData = { getData: () => str };
    inputArea.dispatchEvent(pasteE);
  }
  const autoSkip = async (node, regexp, pasteKey, isReCheck) => {
    if (node.innerText.match(regexp)) {
      await pasteInputArea(pasteKey);
      await checkAndWait(node, regexp);
    } else if (isReCheck) {
      await sleep(1000);
      return autoSkip(node, regexp, pasteKey, isReCheck)
    }
  }
  if (gmc.get('isAutoLogin')) {
    if (container.innerText.trim().length < 10) {
      await sleep(1000);
      return autoLogin(container);
    }
    const list = [];
    if (gmc.get('autoUser') && gmc.get('autoPassWord')) {
      list.push({regexp: /請輸入代號，或以/, pasteKey: `${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`, isReCheck: true});
    }

    if (gmc.get('isEnableDeleteDupLogin') !== "N/A") {
      list.push({regexp: /您有其它連線已登入此帳號/, pasteKey: `${gmc.get('isEnableDeleteDupLogin')}\n`, isReCheck: true});
    }

    if (gmc.get('isAutoSkipInfo1')) {
      list.push(
        {regexp: /正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久.../, pasteKey: '\n'},
        {regexp: /歡迎您再度拜訪，上次您是從/, pasteKey: '\n'},
        {regexp: /─+名次─+範本─+次數/, pasteKey: 'q'},
        {regexp: /發表次數排行榜/, pasteKey: 'q'},
        {regexp: /大富翁 排行榜/, pasteKey: 'q'},
        {regexp: /本日十大熱門話題/, pasteKey: 'q'},
        {regexp: /本週五十大熱門話題/, pasteKey: 'q'},
        {regexp: /每小時上站人次統計/, pasteKey: 'qq'},
        {regexp: /程式開始啟用/, pasteKey: 'q'},
        {regexp: /排名 +看 *板 +目錄數/, pasteKey: 'q'},
      );

    }
    if (gmc.get('isAutoToFavorite')) {
      list.push({regexp: /【主功能表】 +批踢踢實業坊/, pasteKey: `f\n`, isReCheck: true});
    }
    let isMatch = false;
    for (let idx=0;idx < list.length; idx++) {
      if (container.innerText.match(list[idx].regexp)) {
        isMatch = true;
        await autoSkip(container, list[idx].regexp, list[idx].pasteKey, list[idx].isReCheck);
      }
      if (idx == list.length-1 && !isMatch) {
        idx = 0;
        await sleep(500);
      }
    }
  }
}

(function() {
  try {
    window.addEventListener("load", function(event) {
      CreateMutationObserver();
    });
  } catch (ex) {
    writeDebugLog(`出現錯誤...${ex}`);
    console.error(ex);
  }

  const _button = document.createElement("div");
  _button.innerHTML = 'Settings';
  _button.onclick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (!configStatus) {
      configStatus = true;
      if (gmc) gmc.open();
      if (gmc.get('isShowDebug') && gmcDebug) gmcDebug.open();
    } else if (configStatus) {
      configStatus = false;
      if (gmc.isOpen) gmc.close();
      if (gmcDebug.isOpen) gmcDebug.close();
      if (gmcBlack.isOpen) gmcBlack.close();
    }
  }
  _button.style = "border: 1px solid #AAA;color: #999;background-color: #111;position: fixed; top: 0.5em; right: 0.5em; z-index: 900;cursor:pointer !important;"

  document.body.appendChild(_button)

  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = "https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.css";
  document.head.appendChild(el);
})();