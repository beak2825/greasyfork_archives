// ==UserScript==
// @name         一键去除在线翻译网站的换行符
// @namespace    https://greasyfork.org/zh-CN/scripts/390059-%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6-%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C
// @version      2.4.3
// @description  在各大在线翻译网站的页面上增加了一个“格式化”按钮，用来移除从PDF等复制过来的文本中包含的回车符、换行符、"\n"等，支持DeepL翻译、谷歌翻译、百度翻译、网易有道翻译
// @author       Kevin Chen
// @match        https://fanyi.baidu.com/*
// @match        https://fanyi.youdao.com/*
// @match        https://translate.google.com/*
// @match        https://translate.google.com.hk/*
// @match        https://www.deepl.com/translator
// @match        https://fanyi.qq.com/*
// @match        https://dict.cnki.net/*
// @icon         https://translate.google.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/390059/%E4%B8%80%E9%94%AE%E5%8E%BB%E9%99%A4%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99%E7%9A%84%E6%8D%A2%E8%A1%8C%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/390059/%E4%B8%80%E9%94%AE%E5%8E%BB%E9%99%A4%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99%E7%9A%84%E6%8D%A2%E8%A1%8C%E7%AC%A6.meta.js
// ==/UserScript==

const FORMAT_CN = '格式化'
const LOADING_WAIT_TIME = 1000

// DeepL翻译CONFIG配置文件
const DEEPL_TRANSLATE_CONFIG = {
  host: 'www.deepl.com',
  inputAreaSelector: '#textareasContainer section div d-textarea > div:nth-child(1)',
  containerSelector: '#gatsby-focus-wrapper div.contents',
  translateButtonSelector: null,
  buttonClass: 'myCustomDeepLButtonClass',
  createButtonHtml: `<button type="button" tabindex="100" class="myCustomDeepLButtonClass"><span style="outline: none;">${FORMAT_CN}</span></button>`,
}

// 谷歌翻译（香港）CONFIG配置文件
const GOOGLE_FANYI_CONFIG = {
  host: 'translate.google.com.hk',
  inputAreaSelector: 'textarea',
  containerSelector: '#yDmH0d > c-wiz nav',
  translateButtonSelector: null,
  buttonClass: 'myCustomGoogleButtonClass',
  createButtonHtml: `<input class="myCustomGoogleButtonClass" type="button" value="${FORMAT_CN}">`,
}

// 谷歌翻译（国际）CONFIG配置文件
const GOOGLE_TRANSLATE_CONFIG = {
  host: 'translate.google.com',
  inputAreaSelector: 'textarea',
  containerSelector: '#yDmH0d > c-wiz nav',
  translateButtonSelector: null,
  buttonClass: 'myCustomGoogleButtonClass',
  createButtonHtml: `<input class="myCustomGoogleButtonClass" type="button" value="${FORMAT_CN}">`,
}

// 百度翻译CONFIG配置文件
const BAIDU_FANYI_CONFIG = {
  host: 'fanyi.baidu.com',
  inputAreaSelector: '#baidu_translate_input',
  containerSelector: '#main-outer div.trans-operation.clearfix',
  translateButtonSelector: '#translate-button',
  buttonClass: 'myCustomBaiduButtonClass',
  createButtonHtml: `<a href="javascript:" class="myCustomBaiduButtonClass">${FORMAT_CN}</a>`,
}

// 有道翻译CONFIG配置文件
const YOUDAO_FANYI_CONFIG = {
  host: 'fanyi.youdao.com',
  inputAreaSelector: '#js_fanyi_input',
  containerSelector: '#app > div.index.os_Mac > div.translate-tab-container > div.tab-header > div.tab-left',
  translateButtonSelector: '#TextTranslate > div.fixedBottomActionBar-border-box > div > div.sourceActionContainer > div > div > div.opt-right.yd-form-container > a',
  buttonClass: null,
  createButtonHtml: `<button class="tab-item color_text_3"><span class="color_text_1">${FORMAT_CN}</span></button>`,
}

// 腾讯翻译CONFIG配置文件
const TENCENT_FANYI_CONFIG = {
  host: 'fanyi.qq.com',
  inputAreaSelector: 'body > div.layout-container > div.textpanel > div.textpanel-container.clearfix > div.textpanel-source.active > div.textpanel-source-textarea > textarea',
  containerSelector: '#language-button-group-translate',
  translateButtonSelector: '#language-button-group-translate > div',
  buttonClass: null,
  createButtonHtml: `<div class="language-translate-button">${FORMAT_CN}</div>`
}

// CNKI翻译CONFIG配置文件
const CNKI_FANYI_CONFIG = {
  host: 'dict.cnki.net',
  inputTextSelector: '#app > div > section > div > div:nth-child(2) > div.translate > div.trans-left > div.trans-left-con > p > span > pre',
  inputAreaSelector: '#translateLeft',
  containerSelector: '#app > div > section > div > div.hanlder > div.hanlder-left > div.hanlder-left-right',
  translateButtonSelector: '#app > div > section > div > div.hanlder > div.hanlder-left > div.hanlder-left-right > button',
  buttonClass: null,
  createButtonHtml: `<button type="button" class="el-button el-button--primary el-button--mini">${FORMAT_CN}</button>`
}

// button class styles
GM_addStyle(`
    .myCustomGoogleButtonClass {
        color: #1967d2; 
        background: transparent; 
        border-width: 1px; 
        border-radius: 4px; 
        border-style: solid; 
        padding: 0 15px 0 15px; 
        height: 36px; 
        font-size: .875rem; 
        border-color: #dadce0; 
        cursor:pointer
    }
    .myCustomGoogleButtonClass:hover {
        background-color: #f1f5f9; 
        color: #174ea6
    }
`)
GM_addStyle(`
    .myCustomBaiduButtonClass {
        text-align: center; 
        margin-left: 14px; 
        width: 106px; 
        height: 30px; 
        line-height: 30px; 
        font-size: 14px; 
        color: #4395ff; 
        letter-spacing: 2px; 
        background-color: #f9f9f9; 
        border: 1px solid #4395ff;
        border-radius: 3px
    }
`)
GM_addStyle(`
    .myCustomDeepLButtonClass {
        background-color: #fff; 
        border: 1px solid #e3e3e3; 
        border-radius: 8px; 
        cursor: pointer; 
        height: 66px; 
        min-width: 160px;
        box-shadow: 0px 4px 16px rgb(0 0 0 / 8%); 
        font-weight: 400; 
        font-size: 20px;
    }
`)

// convert string to web element
function parseDom(html) {
  console.log('【信息】parseDom before, html:', html)
  const e = document.createElement('div')
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    // 创建一个策略
    const policy = window.trustedTypes.createPolicy('default', {
        createHTML: (string) => {
            // 在这里执行必要的清理和验证
            // 假设string已经被安全地处理了
            return string;
        }
    });

    // 使用策略创建TrustedHTML
    const trustedHTML = policy.createHTML(html);

    // 使用TrustedHTML
    e.innerHTML = trustedHTML;
  } else {
    e.innerHTML = html
  }
  console.log('【信息】parseDom after')
  return e.firstChild
}

// get text context of node
function getTextContent(node) {
  console.log("【信息】开始获取处理前内容：", node)
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  let text = ' ';
  for (let i = 0, len = node.childNodes.length; i < len; i++) {
    text += getTextContent(node.childNodes[i]);
  }
  return text;
}

// simulate textArea input
function simulateInput(inputBox, value) {
  const properties = {
    value: value,
    writable: true,
    configurable: true
  };

  // 为input输入元素添加一个值属性
  Object.defineProperty(inputBox, 'value', properties);

  // 创建并分配一个新的input事件
  let inputEvent = new Event("input", { bubbles: true });
  inputBox.dispatchEvent(inputEvent);
}

// format code
function formatByConfig(config) {
  const inputArea = document.querySelector(config.inputAreaSelector)

  if (config.host == DEEPL_TRANSLATE_CONFIG.host) {
    let content = format(getTextContent(inputArea)).trim();
    inputArea.innerHTML = content;
    return
  }

  let txt = inputArea.value != null ? inputArea.value : inputArea.innerHTML
  if (inputArea.value != null) {
    inputArea.value = format(txt)
  } else {
    inputArea.innerHTML = format(txt)
  }

  // click translate button
  if (config.translateButtonSelector != null) {
    const translateButton = document.querySelector(config.translateButtonSelector)
    translateButton.click()
  }
}

function format (txt) {
  for (var i = 0; i < txt.length; i++) {
    if (txt.indexOf('\n')) txt = txt.replace('\n', ' ')
  }
  // merge space in txt
  return txt.replace(/\s+/g, ' ');
}

// create new button by config
function createButtonByConfig(config) {
  const newButton = parseDom(config.createButtonHtml)
  if (newButton == null) {
    console.info('【错误】创建的新按钮为空')
    return
  }
  newButton.onclick = () => {
    if (config.host == CNKI_FANYI_CONFIG.host) {
        let inputText = document.querySelector(config.inputTextSelector);
        let txt = inputText.innerHTML;
        txt = format(txt);
        simulateInput(document.querySelector(config.inputAreaSelector), txt);
    }
    formatByConfig(config)
  }
  const container = document.querySelector(config.containerSelector)
  if (container != null) {
    container.appendChild(newButton)
  } else {
    console.info('【错误】无法找到container，请检查站点 ' + config.host + ' 的CSS规则containerSelector是否有效：' + config.containerSelector)
  }
}

function findConfigByHost(host) {
  console.info('【信息】当前网页host：', host)
  if (host == GOOGLE_FANYI_CONFIG.host) {
  } else if (host == GOOGLE_TRANSLATE_CONFIG.host) {
    return GOOGLE_TRANSLATE_CONFIG
  } else if (host == BAIDU_FANYI_CONFIG.host) {
    return BAIDU_FANYI_CONFIG
  } else if (host == YOUDAO_FANYI_CONFIG.host) {
    return YOUDAO_FANYI_CONFIG
  } else if (host == DEEPL_TRANSLATE_CONFIG.host) {
    return DEEPL_TRANSLATE_CONFIG
  } else if (host == TENCENT_FANYI_CONFIG.host) {
    return TENCENT_FANYI_CONFIG
  } else if (host == CNKI_FANYI_CONFIG.host) {
    return CNKI_FANYI_CONFIG
  }
}

;(function () {
  //'use strict';
  console.log('【信息】%s毫秒后加载格式化按钮', LOADING_WAIT_TIME)
  window.setTimeout(function () {
    const config = findConfigByHost(window.location.host)
    createButtonByConfig(config)
    console.log('【信息】加载格式化按钮完成')
  }, LOADING_WAIT_TIME)
})()
