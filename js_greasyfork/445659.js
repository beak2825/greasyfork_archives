// ==UserScript==
// @name:zh-CN   快捷搜索-开发者搜索：覆盖掘金、react docs、google API、vscode插件市场搜索搜索、菜鸟搜索、docker hub、淘宝镜像官网、华为云镜像官网、jenkins、npmjs、mdn、ant.mobile.design、bilibili、github、prettier.io、等基本所有开发者常用网址
// @name         快捷搜索-开发者搜索：掘金、react、google API、vscode插件市场、菜鸟搜索、docker、淘宝、华为云镜像官网、npmjs、mdn、antd、bilib、github等开发者常用网址
// @namespace    http://tampermonkey.net/
// @version      3.32.0
// @description  google translate、mobile.ant.mobile、掘金、npmjs、bilibibli、bootstracpCDN、splunk、google API 快捷搜索，更多快捷搜索
// @license      MIT
// @author       zzailianlian
// @match        *://*.npmjs.com/*
// @match        http://portal.ai.babytree-inc.com/*
// @match        https://www.bootcdn.cn/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        http://splunk.ali.plt.babytree-inc.com/*
// @match        http://developer.chrome.com/*
// @match        *://code.visualstudio.com/*
// @match        *://juejin.cn/*
// @match        *://juejin.im/*
// @match        *://*.vuejs.org/*
// @match        https://developer.chrome.com/*
// @match        https://marketplace.visualstudio.com/*
// @match        https://mobile.ant.design/*
// @match        https://developer.mozilla.org/*
// @match        *://gitlab.babytree-inc.com/*
// @match        https://hellogithub.com/*
// @match        https://react.docschina.org/*
// @match        https://zh-hans.reactjs.org/*
// @match        https://eslint.org/docs/*
// @match        https://prettier.io/*
// @match        https://www.prettier.cn/*
// @match        https://translate.google.cn/*
// @match        *://npmmirror.com/*
// @match        *://*.github.com/*
// @match        *://hub.docker.com/*
// @match        *://mirrors.huaweicloud.com/*
// @match        *://jenkins3.plt.babytree-inc.com/*
// @match        *://www.typescriptlang.org/*
// @match        *://www.runoob.com/*
// @match        *://greasyfork.org/*
// @match        *://www.expressjs.com.cn/*
// @match        *://confluence.babytree-inc.com/*
// @match        *://space.babytree-inc.com/*
// @match        *://plugins.jetbrains.com/*
// @match        *://gitool.plt.babytree-inc.com/*
// @match        *://npm.baobaoshu.com/*
// @match        *://greasyfork.org/zh-CN/scripts
// @match        *://www.zhihu.com/*
// @match        *://www.swiper.com.cn/*
// @match        *://*.csdn.net/*
// @match        *://*.huaweicloud.com/*
// @match        *://huaweicloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445659/%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2-%E5%BC%80%E5%8F%91%E8%80%85%E6%90%9C%E7%B4%A2%EF%BC%9A%E6%8E%98%E9%87%91%E3%80%81react%E3%80%81google%20API%E3%80%81vscode%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E3%80%81%E8%8F%9C%E9%B8%9F%E6%90%9C%E7%B4%A2%E3%80%81docker%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%8D%8E%E4%B8%BA%E4%BA%91%E9%95%9C%E5%83%8F%E5%AE%98%E7%BD%91%E3%80%81npmjs%E3%80%81mdn%E3%80%81antd%E3%80%81bilib%E3%80%81github%E7%AD%89%E5%BC%80%E5%8F%91%E8%80%85%E5%B8%B8%E7%94%A8%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/445659/%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2-%E5%BC%80%E5%8F%91%E8%80%85%E6%90%9C%E7%B4%A2%EF%BC%9A%E6%8E%98%E9%87%91%E3%80%81react%E3%80%81google%20API%E3%80%81vscode%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E3%80%81%E8%8F%9C%E9%B8%9F%E6%90%9C%E7%B4%A2%E3%80%81docker%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E5%8D%8E%E4%B8%BA%E4%BA%91%E9%95%9C%E5%83%8F%E5%AE%98%E7%BD%91%E3%80%81npmjs%E3%80%81mdn%E3%80%81antd%E3%80%81bilib%E3%80%81github%E7%AD%89%E5%BC%80%E5%8F%91%E8%80%85%E5%B8%B8%E7%94%A8%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /**
   * config是一个基础对象
   * key 为 要匹配的url
   * value 为 针对已匹配的url所触发的键盘监听事件等一系列配置
   *  value {string | object | array[string|array|object]}
   *    为string时
   *      默认赋值给searchSelectorStr，其他options使用默认值
   *      例如：'www.baidu.com':'input'等同于'www.baidu.com':{searchSelectorStr:'input'}
   *    为object时
   *      keyCode {number} 监听键盘的keycode
   *      metaKey {boolean} 是否按下command或windows按键
   *      searchSelectorStr {string|array} 搜索框的css选择器，最终选择效果由document.querySelector(searchSelectorStr)来决定
   *        为string时，在触发指定键盘按键事件之后自动调用该选择器所选择元素的focus事件，也就是自动聚焦
   *        为array时，允许设置多个选择器字符串，这些字符串之间的关系是`||`，位于数组更前方的选择器优先级更大
   *      isESCblur {boolean} 是否在键入`ESC`按键之后取消聚焦状态
   *      cb {function} 触发指定键盘事件之后的回调函数，如果存在tragetdom ，则传入target dom作为cb的参数
   *      escCb {function} 触发`ESC`之后的回调函数
   *      preFocusEvent {function} 触发`focus`之前的事件函数，会传入target dom用作focus前的dom操作
   *    为array时
   *      允许配置多个键盘监听事件
   *        array item为string时，参考value为string的情况
   *        array item为array时，参考searchSelectorStr为array的情况
   *        array item为object时，参考value为object的情况
   *          
   * 
   * value的默认值为
   * 
   * const defaultOpts = {
      metaKey: true,
      isESCblur: true,
      keyCode: 71,
      isPreventDefault: true,
      searchSelectorStr: '',
      cb: () => { },
      escCb: () => { }
    }
   * 常用keyCode
      71 g
      70 f
      13 回车
      27 esc


  * Q: 如果我想要先查找dom1，再查找dom2，应该怎么写？
    A1: 'www.baidu.com': [['input1','input2']]
    A2: 或者：
        'www.baidu.com':{
          searchSelectorStr: [['input1','input2']]
        }
   */

  const isWindows = navigator.userAgent.includes('Windows') || navigator.userAgent.includes('Win');
  const config = {
    'hub.docker.com': 'input', // docker hub 市场搜索
    'www.swiper.com.cn': [
      'input[type="text"]',
      {
        searchSelectorStr: '.search-submit',
        keyCode: '13',
        cb(btn) {
          !!btn && btn.click();
        },
      },
    ], // swiper 搜索
    'greasyfork.org/zh-CN/scripts': 'input[type="search"]', // Greasy Fork 市场搜索
    'huaweicloud.com': [
      ['input[type="password"]', 'input'],
      {
        searchSelectorStr: '.devui-select-filter-input',
        preFocusEvent(target) {
          target && (target.style.display = 'block');
        },
      },
    ], // 华为cloud官网搜索 华为镜像市场
    'npm.baobaoshu.com': 'input', // 淘宝源 市场搜索
    'csdn.net': 'input', // csdn 搜索
    'code.visualstudio.com': 'input', // vscode api 搜索
    'www.zhihu.com': 'input', // 知乎 搜索
    'gitool.plt.babytree-inc.com': [
      '#commit_id',
      {
        searchSelectorStr: '.btn-success',
        keyCode: '13',
        cb(btn) {
          !!btn && btn.click();
        },
      },
    ], // gitTool 搜索
    'confluence.babytree-inc.com': 'input', // confluence 搜索
    'space.babytree-inc.com': 'input', // confluence 搜索
    'www.expressjs.com.cn': 'input', // express 搜索
    'greasyfork.org': 'input[type=search]', // greasyfork 搜索
    'www.runoob.com': '#s', // 菜鸟搜索
    'www.typescriptlang.org': 'input', // ts官网
    'jenkins3.plt.babytree-inc.com': 'input', // jenins搜索
    'npmmirror.com': 'input', //npm镜像官网
    // '.plt.babytree-inc.com': '.main-search__input',
    'www.npmjs.com': {
      keyCode: 71,
      metaKey: true,
      searchSelectorStr: "input[type='search']",
      isESCblur: true,
      cb: () => {},
    }, // npmjs 搜索
    'docs.npmjs.com': {
      keyCode: 71,
      metaKey: true,
      searchSelectorStr: 'input[type=text]',
      isESCblur: true,
      cb: () => {},
    }, // npmjs文档 搜索
    'www.bootcdn.cn': {
      searchSelectorStr: '.search-wraper input[type=text]',
    }, // bootcdn 搜索
    'plugins.jetbrains.com': 'input', // jetbrains的插件市场搜索
    'developer.chrome.com': '.search-box__input', // 谷歌api文档 搜索
    'cn.vuejs.org': '#search-query-nav', // vue官方文档 搜索
    'cli.vuejs.org': '#algolia-search-input', // vue-cli文档 搜索
    'mobile.ant.design': '.__dumi-default-search-input', // mobile ant 搜索
    juejin: {
      searchSelectorStr: 'input[type="search"]',
      cb: () => {
        [...document.querySelector('.main-header').classList].includes('visible')
          ? null
          : document.querySelector('.main-header').classList.add('visible');
        document.querySelector('input[type="search"]').focus();
      },
    }, // 掘金搜索
    'marketplace.visualstudio.com': '.search-input', // vscode 市场搜索
    'developer.mozilla.org': [['#hp-search-input', '#top-nav-search-input']], // mdn搜索
    gitlab: [['input[type="search"]', '#dashboard_search']], // gitlab搜索
    'splunk.ali.plt.babytree-inc.com': [
      '.ace_text-input', // splunk搜索
      {
        keyCode: 13,
        cb() {
          document
            .querySelector(
              'body > div.shared-page > div.main-section-body > div > div.section-padded.section-header > div.search-bar-wrapper.shared-searchbar > form > table > tbody > tr > td.search-button > a'
            )
            .click();
        },
      }, // splunk搜索按钮点击
    ],
    hellogithub: {
      cb: () => {
        const inputEl = document.querySelector('#search-input') || document.querySelector('#dashboard_search');
        if (inputEl) {
          inputEl.focus();
        } else {
          const homeEl = document.querySelector('.pure-menu-link');
          homeEl.click();
          setTimeout(() => {
            const inputEl = document.querySelector('#search-input') || document.querySelector('#dashboard_search');
            inputEl.focus();
          }, 500);
        }
      },
      escCb() {
        const inputEl = document.querySelector('#search-input') || document.querySelector('#dashboard_search');
        if (inputEl) {
          inputEl.blur();
        } else {
          const homeEl = document.querySelector('.pure-menu-link');
          homeEl.click();
          setTimeout(() => {
            const inputEl = document.querySelector('#search-input') || document.querySelector('#dashboard_search');
            inputEl.blur();
          }, 500);
        }
      },
    }, // splunk搜索
    'www.bilibili.com': 'input', // bilibili首页的搜索框定位
    'search.bilibili.com': '.search-input-el', // bilibili搜索页的搜索框定位
    react: '#algolia-doc-search', // react 官网搜索
    'eslint.org': '#search', // eslint.org 搜索
    prettier: '#search_input_react', // prettier.io 搜索
    'github.com': ['.application-main input[type=search]', '.application-main input[type=text]'], // github search your repositories
    // 'github.com': 'input.js-your-repositories-search', // github search your repositories
    'docs.github.com': 'input[type=search]', // github search your repositories
    // 该写翻译中英文了
    'translate.google.cn': [
      'textarea[aria-label="原文"]', // google translate
      {
        keyCode: 70,
        cb() {
          const enStr = 'sl=en';
          const cnStr = 'sl=zh-CN';
          const isEn = window.location.href.includes(enStr);
          var str = isEn
            ? getUrlWithObj({
                sl: 'zh-CN',
                tl: 'en',
              })
            : getUrlWithObj({
                sl: 'en',
                tl: 'zh-CN',
              });
          window.location.href = str;
        }, // 切换中英文
      },
    ],
    'portal.ai.babytree-inc.com': [
      '#search_content', // 埋点系统搜索
      {
        keyCode: 13,
        cb() {
          document
            .querySelector(
              'body > div.container-wrap.mb-g > div.vip-right > div.right-box > div.am-titlebar.am-titlebar-default.am-no-layout > nav > form > button:nth-child(9)'
            )
            .click();
        },
      }, // 埋点系统搜索按钮点击
      // {
      //   keyCode: 86,
      //   cb() {
      //     //  // meta（cmd/windows按键） + c  点击复制后直接调起筛选
      //     //       //document.querySelector("body > div.container-wrap.mb-g > div.vip-right > div.right-box > div.am-titlebar.am-titlebar-default.am-no-layout > nav > form > button:nth-child(9)").click();
      //   },
      // }, //  meta（cmd/windows按键） + c  点击复制后直接调起筛选
    ],
  };

  // 基于config生成指定监听事件
  const generateMain = () => {
    const defaultOpts = {
      metaKey: true,
      isESCblur: true,
      keyCode: 71,
      isPreventDefault: true,
      searchSelectorStr: '',
      cb: () => {},
      escCb: () => {},
      preFocusEvent: () => {},
    };
    document.onkeydown = function (event) {
      var e = event || window.event;
      const generateMainChild = (href, val) => {
        const { metaKey, isESCblur, keyCode, isPreventDefault, searchSelectorStr, cb, escCb, preFocusEvent } = {
          ...defaultOpts,
          ...val,
        };

        const isMetaKey = isWindows ? e.ctrlKey : e.metaKey && metaKey;
        const isEqualKeyCode = e.keyCode == keyCode;
        if (isMetaKey && isEqualKeyCode) {
          isPreventDefault && e.preventDefault();
          if (window.location.origin.includes(href)) {
            if (searchSelectorStr) {
              const searchCommonDom =
                searchSelectorStr instanceof Array
                  ? searchSelectorStr.map(selector => document.querySelector(selector)).find(Boolean)
                  : document.querySelector(searchSelectorStr);
              console.log('searchCommonDom', href, searchCommonDom);
              preFocusEvent && preFocusEvent(searchCommonDom);
              searchCommonDom && searchCommonDom.focus();
              return cb && cb(searchCommonDom);
            }
            cb && cb();
          }
        }
        if (isESCblur && e.keyCode === 27) {
          isPreventDefault && e.preventDefault();
          if (searchSelectorStr) {
            const searchCommonDom = document.querySelector(searchSelectorStr);
            searchCommonDom && searchCommonDom.blur();
          }
          escCb && escCb();
        }
      };
      Object.entries(config).map(item => {
        let [href, vals] = item;
        if (!window.location.origin.includes(href)) return;
        if (typeof vals === 'string') {
          return generateMainChild(href, { searchSelectorStr: vals });
        }
        if (vals instanceof Array) {
          return vals.map(valsItem => {
            if (typeof valsItem === 'string' || valsItem instanceof Array) {
              generateMainChild(href, {
                searchSelectorStr: valsItem,
              });
            } else {
              generateMainChild(href, valsItem);
            }
          });
        }
        generateMainChild(href, vals);
      });
    };
  };

  generateMain();

  // 获取url的params object
  const getUrlParams = () => {
    var obj = {};
    window.location.search
      .slice(1)
      .split('&')
      .map(item => {
        if (item.split('=')) {
          const [key, value] = item.split('=');
          if (key && value) {
            obj[key] = value;
          }
        }
      });
    return obj;
  };
  // 将新的参数已object的形式拼接到url上，如果key值相同，则后者覆盖前者
  const getUrlWithObj = obj => {
    const originHrefBase = window.location.href.split('?')[0];
    const originParamsObj = getUrlParams();
    const newObj = { ...originParamsObj, ...obj };
    const searchStr = Object.entries(newObj).reduce((pre, cur) => pre + `${cur[0]}=${cur[1]}&`, '');
    return `${originHrefBase}?${searchStr.slice(0, -1)}`;
  };
})();
