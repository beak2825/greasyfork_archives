// ==UserScript==
// @name        AV Info Saver - AV 作品信息一键保存工具
// @namespace
// @version     1.0.1
// @author      TROJAN <ytj1996@gmail.com>
// @source      https://github.com/trojanyao/AV-Info-Saver
// @license     MIT
// @match       https://*.1pondo.tv/movies/*
// @match       https://*.caribbeancom.com/moviepages/*
// @match       https://*.tokyo-hot.com/product/*
// @match       https://*.attackers.net/works/detail/*
// @match       https://*.ideapocket.com/works/detail/*
// @match       https://*.madonna-av.com/works/detail/*
// @match       https://*.mousouzoku-av.com/works/detail/*
// @match       https://s1s1s1.com/*
// @match       https://moodyz.com/*
// @match       https://honnaka.jp/*
// @match       https://premium-beauty.com/*
// @match       https://mvg.jp/*
// @match       https://*.prestige-av.com/goods/*
// @match       https://*.sod.co.jp/prime/videos/*
// @match       https://*.brazzers.com/video/*
// @match       https://*.naughtyamerica.com/scene/*
// @match       https://*.mgstage.com/product/product_detail/*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/axios@0.26.0/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.1.11/dist/axiosGmxhrAdapter.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM.download
// @connect     httpbin.org
// @run-at      document-end
// @namespace https://greasyfork.org/users/889507
// @description 将厂商、系列、发布日期、演员名、番号等 AV 作品信息作为封面图片文件名，一键保存到本地的油猴脚本。
// @downloadURL https://update.greasyfork.org/scripts/482729/AV%20Info%20Saver%20-%20AV%20%E4%BD%9C%E5%93%81%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482729/AV%20Info%20Saver%20-%20AV%20%E4%BD%9C%E5%93%81%E4%BF%A1%E6%81%AF%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/create-btn.ts
function createBtn() {
  /* ========== 界面 ========== */
  // === 容器 ===
  const wrapper = document.createElement('div');
  wrapper.style.background = 'rgba(255, 255, 255, 0.60)';
  wrapper.style.borderRadius = '16px';
  wrapper.style.border = '1px solid #F1F1F1';
  wrapper.style.padding = '16px';
  wrapper.style.backdropFilter = 'blur(18px)';
  wrapper.style.boxShadow = '0px 2px 24px 0px rgba(0, 0, 0, 0.03)';
  wrapper.style.position = 'fixed';
  wrapper.style.top = '120px';
  wrapper.style.right = '16px';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.zIndex = '99999';
  document.querySelector('body').appendChild(wrapper); // === 下载按钮 ===

  const a = document.createElement('a');
  a.target = '_blank';
  a.style.width = a.style.height = '48px';
  a.style.background = 'linear-gradient(180deg, #F7F7F7 0%, #F0F0F0 100%)';
  a.style.borderRadius = '50%';
  a.style.boxShadow = '-1px -1px 2px 0px rgba(207, 207, 207, 0.25) inset, 1px 1px 2px 0px rgba(255, 255, 255, 0.30) inset';
  a.style.display = 'flex';
  a.style.justifyContent = a.style.alignItems = 'center'; // 按钮按下

  a.onmousedown = () => {
    a.style.background = 'linear-gradient(0, #F7F7F7 0%, #F0F0F0 100%)';
    a.style.boxShadow = '-1px -1px 2px 0px rgba(219, 219, 219, 0.50) inset, 1px 1px 2px 0px rgba(229, 229, 229, 0.30) inset';
  }; // 按钮释放


  a.onmouseup = () => {
    a.style.background = 'linear-gradient(180deg, #F7F7F7 0%, #F0F0F0 100%)';
    a.style.boxShadow = '-1px -1px 2px 0px rgba(207, 207, 207, 0.25) inset, 1px 1px 2px 0px rgba(255, 255, 255, 0.30) inset';
  };

  wrapper.appendChild(a); // 图标

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svgIcon = document.createElementNS(SVG_NS, 'svg');
  svgIcon.setAttribute('width', '24px');
  svgIcon.setAttribute('height', '24px');
  svgIcon.setAttribute('viewBox', '0 0 24 24');
  svgIcon.setAttribute('fill', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M12 13.5L18 7.5H13.5V1.5H10.5V7.5H6L12 13.5ZM17.454 11.046L15.7725 12.7275L21.8685 15L12 18.6795L2.1315 15L8.2275 12.7275L6.546 11.046L0 13.5V19.5L12 24L24 19.5V13.5L17.454 11.046Z');
  path.setAttribute('fill', '#58CB5C');
  svgIcon.appendChild(path);
  a.appendChild(svgIcon); // === 标题 & 菜单 ===

  const menuDiv = document.createElement('div');
  menuDiv.style.display = 'flex';
  menuDiv.style.flexDirection = 'column';
  menuDiv.style.gap = '8px';
  wrapper.appendChild(menuDiv); // 标题

  const titleDiv = document.createElement('div');
  titleDiv.innerText = 'AV 作品信息一键保存工具';
  titleDiv.style.color = '#282828';
  titleDiv.style.fontSize = '16px';
  titleDiv.style.fontFamily = '"PingFang SC", sans-serif';
  titleDiv.style.fontWeight = '600';
  titleDiv.style.lineHeight = '1';
  menuDiv.appendChild(titleDiv); // 菜单容器

  const toggleDiv = document.createElement('div');
  toggleDiv.style.display = 'flex';
  toggleDiv.style.justifyContent = 'space-between';
  toggleDiv.style.alignItems = 'center';
  menuDiv.appendChild(toggleDiv); // 文本

  const toggleText = document.createElement('div');
  toggleText.innerText = '打开作品页后自动保存';
  toggleText.style.color = '#515151';
  toggleText.style.fontSize = '14px';
  toggleText.style.fontFamily = '"PingFang SC", sans-serif';
  toggleText.style.fontWeight = '450';
  toggleText.style.lineHeight = '1';
  toggleDiv.appendChild(toggleText); // === 开关 ===

  const autoSave = localStorage.getItem('av-info-saver-auto-save'); // 自动保存开关状态

  const toggleBtnBgNormal = 'linear-gradient(180deg, #FFF 0%, #F1F1F1 100%)'; // 开关默认的背景

  const toggleBtnBgActived = 'linear-gradient(90deg, #4CAF50 0%, #2DE035 100%)'; // 开关打开时的背景

  const toggleBtnShadowNormal = '5px 5px 13px 0px rgba(219, 219, 219, 0.60) inset, -5px -5px 10px 0px rgba(255, 255, 255, 0.90) inset, 5px -5px 10px 0px rgba(219, 219, 219, 0.20) inset, -5px 5px 10px 0px rgba(219, 219, 219, 0.20) inset'; // 开关默认的内阴影

  const toggleBtnShadowActived = '-5px -5px 10px 0px rgba(33, 201, 39, 0.90) inset, 5px -5px 10px 0px rgba(88, 203, 92, 0.20) inset, -5px 5px 10px 0px rgba(88, 203, 92, 0.20) inset'; // 开关打开时的内阴影

  const toggleBtn = document.createElement('div');
  toggleBtn.style.width = '32px';
  toggleBtn.style.height = '16px';
  toggleBtn.style.background = autoSave ? toggleBtnBgActived : toggleBtnBgNormal;
  toggleBtn.style.borderRadius = '100px';
  toggleBtn.style.border = '1px solid #58CB5C';
  toggleBtn.style.boxSizing = 'border-box';
  toggleBtn.style.boxShadow = autoSave ? toggleBtnShadowActived : toggleBtnShadowNormal;
  toggleBtn.style.position = 'relative';
  toggleBtn.style.transition = 'all 200ms ease-out';
  toggleBtn.style.cursor = 'pointer';
  toggleDiv.appendChild(toggleBtn); // 开关按钮

  const btn = document.createElement('div');
  const btnTransformDefault = 'translateX(0)'; // 开关按钮默认偏移量

  const btnTransformActived = 'translateX(16px)'; // 开关按钮打开时的偏移量

  btn.style.position = 'absolute';
  btn.style.width = btn.style.height = '14px';
  btn.style.background = '#FFF';
  btn.style.borderRadius = '50%';
  btn.style.boxShadow = '1px 1px 2px 0px rgba(255, 255, 255, 0.30) inset, -1px -1px 2px 0px rgba(219, 219, 219, 0.50) inset';
  btn.style.display = 'flex';
  btn.style.justifyContent = btn.style.alignItems = 'center';
  btn.style.transform = autoSave ? btnTransformActived : btnTransformDefault;
  btn.style.transition = 'all 200ms ease-out';
  toggleBtn.appendChild(btn); // 小圆点

  const dot = document.createElement('div');
  dot.style.width = dot.style.height = '4px';
  dot.style.background = 'radial-gradient(50% 50% at 50% 50%, #54CB59 45.31%, #20C927 100%)';
  dot.style.borderRadius = '50%';
  btn.appendChild(dot); // 开关切换

  toggleBtn.onclick = () => {
    const autoSave = localStorage.getItem('av-info-saver-auto-save');

    if (!autoSave) {
      // === 打开开关 ===
      toggleBtn.style.background = toggleBtnBgActived;
      toggleBtn.style.boxShadow = toggleBtnShadowActived;
      btn.style.transform = btnTransformActived;
      localStorage.setItem('av-info-saver-auto-save', 'yes');
    } else {
      // === 关闭开关 ===
      toggleBtn.style.background = toggleBtnBgNormal;
      toggleBtn.style.boxShadow = toggleBtnShadowNormal;
      btn.style.transform = btnTransformDefault;
      localStorage.removeItem('av-info-saver-auto-save');
    }
  };

  return a;
}
;// CONCATENATED MODULE: external "axios"
const external_axios_namespaceObject = axios;
;// CONCATENATED MODULE: external "axiosGmxhrAdapter"
const external_axiosGmxhrAdapter_namespaceObject = axiosGmxhrAdapter;
;// CONCATENATED MODULE: ./src/utils.ts


function get(url, config) {
  return axios.get(url, {
    adapter,
    ...config
  });
}
function post(url, data, config) {
  return axios.post(url, data, {
    adapter,
    ...config
  });
} // 代码暂停执行

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
;// CONCATENATED MODULE: ./src/utils/get-info.ts
const DEFAULT_KEY_LIST = {
  seriesKey: 'シリーズ',
  dateKey: '発売日',
  actressKey: '女優',
  codeKey: '品番'
};
/**
 * 从详情列表中查找返回对应信息
 * @param {Array<any>} infoList 作品信息列表
 * @param {string} selector 列表项下信息值对应的 CSS 选择器
 * @param {InfoKeyList} keyList 查询的信息键列表
 */

function getInfo(infoList, selector) {
  var _getValue, _getValue2, _getValue3, _getValue3$, _getValue4;

  let keyList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_KEY_LIST;
  let actressSelector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  keyList = { ...DEFAULT_KEY_LIST,
    ...keyList
  };

  function getValue(key) {
    if (!key) {
      return;
    }

    const infoItem = infoList === null || infoList === void 0 ? void 0 : infoList.find(info => {
      var _innerText;

      return info === null || info === void 0 ? void 0 : (_innerText = info.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    let tempSelector = key === keyList.actressKey ? actressSelector || selector : selector;
    return Array.from(infoItem === null || infoItem === void 0 ? void 0 : infoItem.querySelectorAll(tempSelector), item => (item === null || item === void 0 ? void 0 : item.innerText) || '');
  }

  return {
    seriesName: (_getValue = getValue(keyList.seriesKey)) === null || _getValue === void 0 ? void 0 : _getValue[0],
    date: (_getValue2 = getValue(keyList.dateKey)) === null || _getValue2 === void 0 ? void 0 : _getValue2[0],
    actress: getValue(keyList.actressKey),
    code: (_getValue3 = getValue(keyList.codeKey)) === null || _getValue3 === void 0 ? void 0 : (_getValue3$ = _getValue3[0]) === null || _getValue3$ === void 0 ? void 0 : _getValue3$.replace('DVD', ''),
    duration: (_getValue4 = getValue(keyList.durationKey)) === null || _getValue4 === void 0 ? void 0 : _getValue4[0]
  };
}
;// CONCATENATED MODULE: ./src/utils/datify.ts
/**
 * 将不同格式的発売日标准化为统一格式
 * YYYY.MM.DD
 *
 * @param {string} date 未处理的日期字符串
 * @returns {string} 处理后的标准日期格式
 */
function datify(date) {
  var _date$match, _date$match2, _date$match3;

  let newDate; // 符合标准格式：直接返回

  if (/\d{4}\.\d{2}\.\d{2}/.test(date)) {
    newDate = date;
    return newDate;
  } // 使用 “/” 作为分隔符的格式


  if (/\d+\/\d+\/\d+/.test(date)) {
    newDate = new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replaceAll('/', '.');
    return newDate;
  } // 含有汉字的格式


  let year = (_date$match = date.match(/(\d{4})年/)) === null || _date$match === void 0 ? void 0 : _date$match[1];
  let month = (_date$match2 = date.match(/(\d{1,2})月/)) === null || _date$match2 === void 0 ? void 0 : _date$match2[1];
  let day = (_date$match3 = date.match(/(\d{1,2})日/)) === null || _date$match3 === void 0 ? void 0 : _date$match3[1];
  newDate = year && month && day ? `${year}.${(month === null || month === void 0 ? void 0 : month.length) === 1 ? '0' + month : month}.${(day === null || day === void 0 ? void 0 : day.length) === 1 ? '0' + day : day}` : '未知日期';
  return newDate;
}
;// CONCATENATED MODULE: ./src/utils/codify.ts
/**
 * 将不同格式的番号标准化为统一格式
 *
 * @param {string} code 传入的未处理的番号
 * @returns {string} 标准化处理后的番号
 */
function codify(code) {
  /**
   * 无需处理
   * - 東京熱番号
   * - 包含连字符的番号
   */
  if (/n\d+/.test(code) || /-/.test(code)) {
    return code;
  }
  /* 有字母的番号 */


  if (/[a-z,A-Z]/.test(code)) {
    const codeNum = code.match(/\d+/); // 数字

    const codeCap = code.match(/[A-Z,a-z]+/); // 字母

    let newCodeNum; // 处理番号数字位大于3，有多个0的情况

    if (codeNum[0] && codeNum[0].length > 3) {
      newCodeNum = codeNum[0].slice(-3);
      code = code.replace(codeNum[0], newCodeNum);
    }

    return `${codeCap}-${codeNum}`.toUpperCase();
  }
  /* 其他情况 */


  return code;
}
;// CONCATENATED MODULE: ./src/utils/refine-title.ts
/**
 * 删除作品标题头尾包含的演员名
 * 
 * @param {AVWork} av 未处理的 AV 对象
 * @returns {AVWork} 处理后的 AV 对象
 */
function refineTitle(av) {
  // 去头尾演员名
  let startAct = new RegExp('^' + av.actress, 'g');
  let endAct = new RegExp(av.actress + '$', 'g');
  let titleHasActress = startAct.test(av.workName) || endAct.test(av.workName); // 替换斜线

  av.workName = av.workName.replaceAll('/', ' ');

  if (titleHasActress) {
    var _av$actress;

    av.workName = av.workName.replace((_av$actress = av.actress) === null || _av$actress === void 0 ? void 0 : _av$actress.join(' '), '');
  } // 头尾去空格


  av.workName = av.workName.trim();
  return av;
}
;// CONCATENATED MODULE: ./src/utils/refine-actress.ts
/**
 * 美化演员列表
 * - 剔除头尾空格
 * - 剔除名字内空格（日本演员）
 *
 * @param {AVWork} av 未处理的 AV 对象
 * @returns {AVWork} 处理后的 AV 对象
 */
function refineActress(av) {
  av.actress = av.actress.map(a => {
    // 先剔除头尾空格
    let newA = a.trim(); // 剔除内部空格（仅作用于非英文名演员、非素人演员）

    if (!newA.match(/[a-zA-Z]+/g) && !av.actressRealName) {
      newA = newA.replaceAll(/\s/g, '');
    }

    return newA;
  });
  return av;
}
;// CONCATENATED MODULE: ./src/utils/check-indicator.ts
// 编号标识列表
const INDICATORS = ['vol.', 'Vol.', 'VOL.', 'Case.', 'File.', 'FILE.', 'Part', 'Talk.', 'パート'];
/**
 * 检测系列作品的标题中是否包含有标识的编号
 *
 * @param {string} workName 作品名
 * @returns {string | undefined} 检测出的标识和编号或 undefined
 */

function checkIndicator(workName) {
  // 是否包含编号标识
  const indicator = INDICATORS.find(d => workName.includes(d));

  if (indicator) {
    var _workName$match;

    // 包含编号标识：返回标识和编号部分
    // 标识符和编号部分
    const regExp = new RegExp(indicator + '\\s{0,3}\\d+');
    const num = (_workName$match = workName.match(regExp)) === null || _workName$match === void 0 ? void 0 : _workName$match[0];
    return num;
  } // 不包含编号标识：返回 undefined


  return undefined;
}
;// CONCATENATED MODULE: ./src/utils/check-digit.ts
/**
 * 检测系列作品的标题中是否包含纯数字编号
 *
 * @param {string} workName 作品名
 * @param {string} seriesName 系列名
 * @returns { string | undefined } 检测出的纯数字编号或 undefined（未检测出）
 */
function checkDigit(workName, seriesName) {
  const seriesNameNoSpace = seriesName.replaceAll(' ', '');
  /* 有纯数字编号也肯定是在标题中的系列名后跟着纯数字 */
  // 兼容「系列名 纯数字」和「#纯数字」两种格式

  const reg = new RegExp(`(?:\\s*${seriesNameNoSpace}\\s*(\\d+))|(?:#(\\d+))`, 'g');
  const matches = [...workName.replaceAll(' ', '').matchAll(reg)];

  for (const match of matches) {
    if (match.length >= 2) {
      // 说明匹配到了捕获组，将其返回（系列编号）
      return match[1] || match[2];
    }
  } // 不包含纯数字


  return undefined;
}
;// CONCATENATED MODULE: ./src/makers/02-censored/ca-group.ts


/**
 * 根据域名判断厂商名
 * @returns
 */
function getMakerName() {
  const host = window.location.host;
  let makerName = '';

  switch (host) {
    case 'attackers.net':
      makerName = 'Attackers';
      break;

    case 'ideapocket.com':
      makerName = 'Idea Pocket';
      break;

    case 'madonna-av.com':
      makerName = 'Madonna';
      break;

    case 'moodyz.com':
      makerName = 'MOODYZ';
      break;

    case 'premium-beauty.com':
      makerName = 'Premium';
      break;

    case 's1s1s1.com':
      makerName = 'S1';
      break;

    case 'honnaka.jp':
      makerName = '本中';
      break;

    case 'mvg.jp':
      makerName = 'MVG';
      break;
  }

  return makerName;
}

async function CA() {
  var _img$dataset, _document$querySelect;

  // 厂商名
  const makerName = getMakerName(); // 封面地址

  const swiperSlide = document.querySelectorAll('.p-slider img');
  const img = (swiperSlide === null || swiperSlide === void 0 ? void 0 : swiperSlide[1]) || (swiperSlide === null || swiperSlide === void 0 ? void 0 : swiperSlide[0]);
  let imgUrl = (img === null || img === void 0 ? void 0 : img.src) || (img === null || img === void 0 ? void 0 : (_img$dataset = img.dataset) === null || _img$dataset === void 0 ? void 0 : _img$dataset.src); // 跨域获取

  const res = await fetch(imgUrl);

  try {
    const blob = await res.blob();
    imgUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    throw new Error(`[下载图片失败] ${e}`);
  } // 作品名


  const workName = (_document$querySelect = document.querySelector('h2.p-workPage__title')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerText; // 页面数据列表

  let infoList = [...document.querySelectorAll('.p-workPage__table > .item')];
  const tempAV = getInfo(infoList, '.item');
  const av = {
    makerName,
    workName,
    imgUrl,
    ...tempAV
  };
  return { ...av,
    finalName: ca_group_final(av)
  };
}





 // 序号优先的系列

const DIGIT_FIRST_SERIES = [];
/**
 * 拼接最终文件名
 */

function ca_group_final(av) {
  let finalName;
  /* === 1. 处理演员名 === */

  av = refineActress(av);
  const actressString = av.actress.join(' ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理番号 === */

  av.code = codify(av.code);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName} ${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString}`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName}`;
  }

  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/utils/first-letter-uppercase.ts
/**
 * 将句子转换为每个单词首字母大写、其他字母小写的格式
 */
function firstLetterUppercase(original) {
  var _original$split$map;

  return original === null || original === void 0 ? void 0 : (_original$split$map = original.split(/\s/).map(word => word.charAt(0) + word.slice(1).toLowerCase())) === null || _original$split$map === void 0 ? void 0 : _original$split$map.join(' ');
}
;// CONCATENATED MODULE: ./src/makers/03-western/naughty-america.ts

async function NA() {
  var _document$querySelect, _document$querySelect2, _sceneInfo$querySelec, _sceneInfo$querySelec2, _sceneInfo$querySelec3, _sceneInfo$querySelec4, _sceneInfo$querySelec5, _sceneInfo$querySelec6;

  // 封面地址
  let imgUrl = `https:${(_document$querySelect = document.querySelector('.play-trailer > picture > source')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.dataset) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.srcset}`.replace('webp', 'jpg');
  const res = await fetch(imgUrl);

  try {
    const blob = await res.blob();
    imgUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    throw new Error(`[下载图片失败] ${e}`);
  } // 页面数据容器


  const sceneInfo = document.querySelector('.scene-info'); // 作品名

  const workName = firstLetterUppercase((_sceneInfo$querySelec = sceneInfo.querySelector('.scene-title')) === null || _sceneInfo$querySelec === void 0 ? void 0 : _sceneInfo$querySelec.innerText); // 系列名

  const seriesName = firstLetterUppercase((_sceneInfo$querySelec2 = sceneInfo.querySelector('.site-title')) === null || _sceneInfo$querySelec2 === void 0 ? void 0 : _sceneInfo$querySelec2.innerText); // 日期

  const date = new Date((_sceneInfo$querySelec3 = sceneInfo.querySelector('.entry-date')) === null || _sceneInfo$querySelec3 === void 0 ? void 0 : _sceneInfo$querySelec3.innerText).toLocaleDateString('zh-CN'); // 演员列表

  const actress = Array.from(sceneInfo.querySelectorAll('.performer-list > a'), a => firstLetterUppercase(a === null || a === void 0 ? void 0 : a.innerText)); // 时长

  const duration = ((_sceneInfo$querySelec4 = sceneInfo.querySelector('.duration')) === null || _sceneInfo$querySelec4 === void 0 ? void 0 : (_sceneInfo$querySelec5 = _sceneInfo$querySelec4.innerText) === null || _sceneInfo$querySelec5 === void 0 ? void 0 : (_sceneInfo$querySelec6 = _sceneInfo$querySelec5.match(/\d+\smin/)) === null || _sceneInfo$querySelec6 === void 0 ? void 0 : _sceneInfo$querySelec6[0].replace(' ', '')) ?? '未知时长';
  const labels = sceneInfo.querySelectorAll('.flag-bg');
  const resolutions = Array.from(labels, label => (label === null || label === void 0 ? void 0 : label.innerText) === 'HD' ? '1080p' : label === null || label === void 0 ? void 0 : label.innerText);
  const av = {
    makerName: 'Naughty America',
    workName,
    seriesName,
    date,
    actress,
    duration,
    resolutions,
    imgUrl
  };
  return { ...av,
    finalName: naughty_america_final(av)
  };
}

/**
 * 拼接最终文件名
 */

function naughty_america_final(av) {
  var _av$resolutions;

  //【厂商】（日期）演员 - 作品名
  av.seriesName = av.seriesName.trim();
  const finalName = `${av.seriesName}（${datify(av.date)}）${av.actress.join(', ')} - ${av.workName} [${av.duration}; ${(_av$resolutions = av.resolutions) === null || _av$resolutions === void 0 ? void 0 : _av$resolutions.join(', ')}]`;
  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/makers/01-uncensored/1pondo.ts
async function OnePondo() {
  var _getInfo, _getInfo$trim, _document$URL, _document$URL$match, _getInfo2;

  // 作品名
  const workName = document.querySelector('.movie-overview h1').innerText; // 展开信息列表

  const showInfo = document.querySelector('button.see-more');
  await showInfo.click(); // 作品详情列表

  const infoList = [...(document.querySelectorAll('.movie-detail > ul > li') || [])];
  /**
   * 从详情列表中查找返回对应信息
   */

  function getInfo(key) {
    var _infoItem$querySelect;

    const infoItem = infoList === null || infoList === void 0 ? void 0 : infoList.find(info => {
      var _innerText;

      return info === null || info === void 0 ? void 0 : (_innerText = info.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    return (infoItem === null || infoItem === void 0 ? void 0 : (_infoItem$querySelect = infoItem.querySelector('span:last-child')) === null || _infoItem$querySelect === void 0 ? void 0 : _infoItem$querySelect.innerText) || '';
  } // 系列名


  const seriesName = getInfo('シリーズ') || ''; // 日期

  const date = getInfo('配信日') || ''; // 演员列表

  const actress = ((_getInfo = getInfo('出演')) === null || _getInfo === void 0 ? void 0 : (_getInfo$trim = _getInfo.trim()) === null || _getInfo$trim === void 0 ? void 0 : _getInfo$trim.split(/\s/)) || []; // 番号

  const code = ((_document$URL = document.URL) === null || _document$URL === void 0 ? void 0 : (_document$URL$match = _document$URL.match(/\d+_\d+/)) === null || _document$URL$match === void 0 ? void 0 : _document$URL$match[0]) || ''; // 封面地址

  const imgUrl = `https://www.1pondo.tv/assets/sample/${code}/str.jpg`; // 时长

  const duration = ((_getInfo2 = getInfo('再生時間')) === null || _getInfo2 === void 0 ? void 0 : _getInfo2.replaceAll(':', '.')) || '';
  const av = {
    makerName: '1 Pondo',
    workName,
    seriesName,
    date,
    actress,
    code,
    imgUrl,
    duration
  };
  return { ...av,
    finalName: _1pondo_final(av)
  };
}





 // 序号优先的系列

const _1pondo_DIGIT_FIRST_SERIES = [];
/**
 * 拼接最终文件名
 */

function _1pondo_final(av) {
  let finalName;
  /* === 1. 处理演员名 === */

  av = refineActress(av);
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = _1pondo_DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName} ${numType1 || numType2}（${datify(av.date)}）${av.actress}（${av.code}）[${av.duration}]`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${av.actress} [${av.duration}]`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${av.actress}（${av.code}）[${av.duration}]`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${av.actress}（${codify(av.code)}）${av.workName} [${av.duration}]`;
  }

  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/utils/final.ts







/**
 * 是否需要移除系列名后的空格
 * @param list 需要移除的系列列表
 * @param seriesName 当前作品系列名
 */
function seriesEndSpace(list, seriesName) {
  return list !== null && list !== void 0 && list.includes(seriesName) ? '' : ' ';
}
/**
 * 拼接最终文件名（无码）
 */


function finalUncensored(av) {
  var _av, _av2, _av2$resolutions;

  let DIGIT_FIRST_SERIES = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let finalName;
  /* === 1. 处理演员名 === */

  av = refineActress(av);
  const actressString = av.actress.join(' ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName} ${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}）`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString} `;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName} `;
  }

  return `【${av.makerName}】${finalName}[${av.duration}${(_av = av) !== null && _av !== void 0 && _av.resolutions ? `; ${(_av2 = av) === null || _av2 === void 0 ? void 0 : (_av2$resolutions = _av2.resolutions) === null || _av2$resolutions === void 0 ? void 0 : _av2$resolutions.join(', ')}` : ''}].jpg`;
}
/**
 * 拼接最终文件名（有码）
 */

function finalCensored(av) {
  let digitFirstSeriesList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let noSeriesEndSpaceList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let finalName;
  /* === 1. 处理演员名 === */

  av = refineActress(av);
  const actressString = av.actress.join(' ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理番号 === */

  av.code = codify(av.code);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = digitFirstSeriesList.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        var _av3;

        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName}${seriesEndSpace(noSeriesEndSpaceList, (_av3 = av) === null || _av3 === void 0 ? void 0 : _av3.seriesName)}${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}）`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString}`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName}`;
  }

  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/makers/02-censored/prestige.ts
 // 厂商名转换列表

const MAKER_TRANS = {
  プレステージ: 'Prestige'
};
async function Prestige() {
  var _document$querySelect, _document$querySelect2, _document$querySelect3, _ref, _ref$src;

  // 作品名
  const spanText = (_document$querySelect = document.querySelector('.min-h-main h1 span')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerText;
  const workName = (_document$querySelect2 = document.querySelector('.min-h-main h1')) === null || _document$querySelect2 === void 0 ? void 0 : (_document$querySelect3 = _document$querySelect2.innerText) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.replace(spanText, '').trim(); // 封面地址

  const imgList = document.querySelectorAll('img.swiper-picture');
  const imgUrl = (_ref = (imgList === null || imgList === void 0 ? void 0 : imgList[1]) || document.querySelector('img.swiper-picture')) === null || _ref === void 0 ? void 0 : (_ref$src = _ref.src) === null || _ref$src === void 0 ? void 0 : _ref$src.replace(/\?\S+/, ''); // 作品详情列表

  const infoList = [...document.querySelectorAll('.text-xl > .hidden > div.flex')]; // 查找对应的详情

  function getInfo(key) {
    var _infoItem$querySelect;

    const infoItem = infoList === null || infoList === void 0 ? void 0 : infoList.find(info => {
      var _innerText;

      return info === null || info === void 0 ? void 0 : (_innerText = info.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    if (!infoItem) return;
    const list = infoItem !== null && infoItem !== void 0 && (_infoItem$querySelect = infoItem.querySelectorAll('div.flex-1 a')) !== null && _infoItem$querySelect !== void 0 && _infoItem$querySelect.length ? [...infoItem.querySelectorAll('div.flex-1 a')] : [...infoItem.querySelectorAll('div.flex-1 p')];
    const valueList = Array.from(list, item => item === null || item === void 0 ? void 0 : item.innerText);
    return key === '出演者' ? valueList : valueList === null || valueList === void 0 ? void 0 : valueList[0];
  } // 厂商名


  const makerValue = getInfo('メーカー');
  const makerName = MAKER_TRANS[makerValue] || makerValue; // 系列名

  const seriesName = getInfo('シリーズ'); // 日期

  const date = getInfo('発売日'); // 番号

  const code = getInfo('品番'); // 演员

  const actress = getInfo('出演者');
  let av = {
    makerName,
    workName,
    seriesName,
    date,
    actress,
    code,
    imgUrl
  };
  return { ...av,
    finalName: finalCensored(av, prestige_DIGIT_FIRST_SERIES, NO_End_SPACE_SERIES)
  };
} // 编号在前的系列

const prestige_DIGIT_FIRST_SERIES = ['人妻さんいらっしゃい！', '職女。']; // 无需加尾空格的系列

const NO_End_SPACE_SERIES = ['人妻さんいらっしゃい！', '職女。'];
;// CONCATENATED MODULE: ./src/makers/01-uncensored/tokyo-hot.ts
/**
 * 手动维护系列列表，从作品名中识别
 */
 // 系列列表

const seriesList = ['鬼逝', 'Wカン', '東熱激情 淫乱女教師中出授業 特集', '東熱激情 密着パンスト24時！特集'];

function getSeriesName(workName) {
  return seriesList === null || seriesList === void 0 ? void 0 : seriesList.find(item => workName === null || workName === void 0 ? void 0 : workName.includes(item));
}

async function TokyoHot() {
  var _document$querySelect, _document$querySelect2, _getInfo, _getInfo2, _getInfo3, _getInfo3$, _document$querySelect3;

  // 作品名
  const workName = (_document$querySelect = document.querySelector('.contents > h2')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerText; // 封面地址

  let imgUrl = (_document$querySelect2 = document.querySelector('video')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.poster;

  try {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    imgUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    throw new Error(`[下载图片失败] ${e}`);
  } // 系列名


  const seriesName = getSeriesName(workName); // 作品信息列表

  const keyList = [...document.querySelectorAll('dl.info > dt')];

  function getInfo(key) {
    const keyItem = keyList === null || keyList === void 0 ? void 0 : keyList.find(item => {
      var _innerText;

      return item === null || item === void 0 ? void 0 : (_innerText = item.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    if (!keyItem) return;
    const valueItem = keyItem === null || keyItem === void 0 ? void 0 : keyItem.nextElementSibling;
    if (!valueItem) return;
    return key === '出演者' ? Array.from(valueItem === null || valueItem === void 0 ? void 0 : valueItem.querySelectorAll('a'), x => x === null || x === void 0 ? void 0 : x.innerText) : [valueItem === null || valueItem === void 0 ? void 0 : valueItem.innerText];
  } // 日期


  const date = (_getInfo = getInfo('配信開始日')) === null || _getInfo === void 0 ? void 0 : _getInfo[0]; // 演员

  const actress = getInfo('出演者'); // 番号

  const code = (_getInfo2 = getInfo('作品番号')) === null || _getInfo2 === void 0 ? void 0 : _getInfo2[0]; // 时长

  const duration = (_getInfo3 = getInfo('収録時間')) === null || _getInfo3 === void 0 ? void 0 : (_getInfo3$ = _getInfo3[0]) === null || _getInfo3$ === void 0 ? void 0 : _getInfo3$.replaceAll(':', '.'); // 清晰度和大小

  const sizeList = (_document$querySelect3 = document.querySelectorAll('.download')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3[1].querySelectorAll('.dbox');
  let resolutions = [];
  sizeList.forEach(sizeItem => {
    var _sizeItem$querySelect, _sizeItem$querySelect2, _sizeItem$querySelect3;

    const format = (_sizeItem$querySelect = sizeItem.querySelector('h4').innerText.match(/MP4|WMV/g)) === null || _sizeItem$querySelect === void 0 ? void 0 : _sizeItem$querySelect[0];
    const size = (_sizeItem$querySelect2 = sizeItem.querySelector('h4').innerText.match(/\d+.\d+/g)) === null || _sizeItem$querySelect2 === void 0 ? void 0 : _sizeItem$querySelect2[0];
    const resolution = (_sizeItem$querySelect3 = sizeItem.querySelector('p').innerText.match(/x(\d+)/)) === null || _sizeItem$querySelect3 === void 0 ? void 0 : _sizeItem$querySelect3[1];

    if (parseInt(resolution) >= 720) {
      resolutions.push(`${parseFloat(size).toFixed(1)}GB-${format}-${resolution}p`);
    }
  });
  const av = {
    makerName: '東京熱',
    workName,
    seriesName,
    date,
    actress,
    code,
    imgUrl,
    duration,
    resolutions
  };
  return { ...av,
    finalName: finalUncensored(av)
  };
}
;// CONCATENATED MODULE: ./src/makers/03-western/brazzers.ts
async function Brazzers() {
  var _infoDiv$querySelecto, _infoDiv$querySelecto2, _infoDiv$querySelecto3, _infoDiv$querySelecto4, _infoDiv$querySelecto5, _infoDiv$querySelecto6, _imgUrl$match;

  // 信息容器
  const infoDiv = document.querySelector('#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > div > section > div > div'); // 作品名

  const workName = infoDiv === null || infoDiv === void 0 ? void 0 : (_infoDiv$querySelecto = infoDiv.querySelector('h2.font-secondary')) === null || _infoDiv$querySelecto === void 0 ? void 0 : _infoDiv$querySelecto.innerText; // 日期

  const date = new Date(infoDiv === null || infoDiv === void 0 ? void 0 : (_infoDiv$querySelecto2 = infoDiv.querySelectorAll('div')) === null || _infoDiv$querySelecto2 === void 0 ? void 0 : (_infoDiv$querySelecto3 = _infoDiv$querySelecto2[0]) === null || _infoDiv$querySelecto3 === void 0 ? void 0 : _infoDiv$querySelecto3.innerText).toLocaleDateString('zh-CN'); // 演员列表

  const actress = (infoDiv === null || infoDiv === void 0 ? void 0 : (_infoDiv$querySelecto4 = infoDiv.querySelectorAll('div')) === null || _infoDiv$querySelecto4 === void 0 ? void 0 : (_infoDiv$querySelecto5 = _infoDiv$querySelecto4[1]) === null || _infoDiv$querySelecto5 === void 0 ? void 0 : (_infoDiv$querySelecto6 = _infoDiv$querySelecto5.innerText) === null || _infoDiv$querySelecto6 === void 0 ? void 0 : _infoDiv$querySelecto6.split(', ')) || []; // 封面地址

  let imgUrl = document.querySelector('video + div').style['background-image'];
  imgUrl = (_imgUrl$match = imgUrl.match(/"(\S+)"/)) === null || _imgUrl$match === void 0 ? void 0 : _imgUrl$match[1]; // 跨域获取

  const res = await fetch(imgUrl);
  const blob = await res.blob();
  imgUrl = window.URL.createObjectURL(blob);
  const av = {
    makerName: 'Brazzers',
    workName,
    seriesName: '系列名待补充',
    date,
    actress,
    imgUrl
  };
  return { ...av,
    finalName: brazzers_final(av)
  };
}

/**
 * 拼接最终文件名
 */

function brazzers_final(av) {
  //【厂商】（日期）演员 - 作品名
  av.seriesName = av.seriesName.trim();
  const finalName = `${av.seriesName}（${datify(av.date)}）${av.actress.join(', ')} - ${av.workName}`;
  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/makers/01-uncensored/caribbean.ts
async function Caribbean() {
  var _document$querySelect, _document$querySelect2, _bgImg$match, _bgImg$match$, _document$querySelect3, _getInfo, _getInfo$trim, _document$URL, _document$URL$match, _getInfo2;

  // 封面地址
  const bgImg = (_document$querySelect = document.querySelector('.vjs-poster')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.style) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.backgroundImage;
  const imgUrl = `https://www.caribbeancom.com${(_bgImg$match = bgImg.match(/"\S+"/)) === null || _bgImg$match === void 0 ? void 0 : (_bgImg$match$ = _bgImg$match[0]) === null || _bgImg$match$ === void 0 ? void 0 : _bgImg$match$.replaceAll('"', '')}`; // 作品名

  const workName = (_document$querySelect3 = document.querySelector('.heading > h1')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.innerText; // 页面数据列表

  let infoList = Array.from(document.querySelectorAll('.movie-info > ul > li'));
  /**
   * 从详情列表中查找返回对应信息
   */

  function getInfo(key) {
    var _infoItem$querySelect;

    const infoItem = infoList === null || infoList === void 0 ? void 0 : infoList.find(info => {
      var _innerText;

      return info === null || info === void 0 ? void 0 : (_innerText = info.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    return (infoItem === null || infoItem === void 0 ? void 0 : (_infoItem$querySelect = infoItem.querySelector('span:last-child')) === null || _infoItem$querySelect === void 0 ? void 0 : _infoItem$querySelect.innerText) || '';
  } // 系列名


  const seriesName = getInfo('シリーズ') || ''; // 日期

  const date = getInfo('配信日') || ''; // 演员列表

  const actress = ((_getInfo = getInfo('出演')) === null || _getInfo === void 0 ? void 0 : (_getInfo$trim = _getInfo.trim()) === null || _getInfo$trim === void 0 ? void 0 : _getInfo$trim.split(/\s/)) || []; // 番号

  const code = ((_document$URL = document.URL) === null || _document$URL === void 0 ? void 0 : (_document$URL$match = _document$URL.match(/\d{6}-\d{3}/g)) === null || _document$URL$match === void 0 ? void 0 : _document$URL$match[0]) || ''; // 时长

  const duration = ((_getInfo2 = getInfo('再生時間')) === null || _getInfo2 === void 0 ? void 0 : _getInfo2.replaceAll(':', '.')) || '';
  const av = {
    makerName: '加勒比',
    workName,
    seriesName,
    date,
    actress,
    code,
    imgUrl,
    duration
  };
  return { ...av,
    finalName: caribbean_final(av)
  };
}





 // 序号优先的系列

const caribbean_DIGIT_FIRST_SERIES = ['新入社員のお仕事'];
/**
 * 拼接最终文件名
 */

function caribbean_final(av) {
  let finalName;
  /* === 1. 处理演员名 === */

  av = refineActress(av);
  const actressString = av.actress.join(' ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = caribbean_DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName} ${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}）[${av.duration}]`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString} [${av.duration}]`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）[${av.duration}]`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName} [${av.duration}]`;
  }

  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/makers/02-censored/sod.ts


async function SOD() {
  var _document$querySelect, _document$querySelect2;

  // 作品名
  const workName = document.querySelector('#videos_head > h1 + h1').innerText; // 封面地址

  let imgUrl = (_document$querySelect = document.querySelector('.videos_samimg > a')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.href) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.replace('http:', 'https:'); // 跨域获取

  try {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    imgUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    throw new Error(`[下载图片失败] ${e}`);
  } // 页面数据列表


  const infoList = [...document.querySelectorAll('#v_introduction tr')];
  const tempAV = getInfo(infoList, '.v_intr_tx', {
    dateKey: '発売年月日',
    actressKey: '出演者'
  }, '.v_intr_tx a');
  const av = {
    makerName: 'SODクリエイト',
    workName,
    imgUrl,
    ...tempAV
  };
  return { ...av,
    finalName: sod_final(av)
  };
} // 系列字段中不是系列的名称

const NotRealSeries = ['おねだりプリン']; // 处理系列名

function refineSeries(seriesName) {
  const subList = NotRealSeries.filter(x => (x === null || x === void 0 ? void 0 : x.includes(seriesName)) || seriesName.includes(x));
  let newSeriesName = seriesName;
  subList.forEach(item => {
    var _newSeriesName;

    newSeriesName = (_newSeriesName = newSeriesName) === null || _newSeriesName === void 0 ? void 0 : _newSeriesName.replace(item, '');
  });
  return newSeriesName;
}

function sod_final(av) {
  av.seriesName = refineSeries(av.seriesName);
  return finalCensored(av);
}
;// CONCATENATED MODULE: ./src/makers/04-amateur/mgstage.ts
async function MGS() {
  var _document$querySelect, _document$querySelect2, _document$querySelect3, _getInfo;

  // 作品名
  const workName = (_document$querySelect = document.querySelector('.common_detail_cover h1')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerText; // 封面地址

  let imgUrl = (_document$querySelect2 = document.querySelector('.detail_data h2 img')) === null || _document$querySelect2 === void 0 ? void 0 : (_document$querySelect3 = _document$querySelect2.src) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.replace(/\w{2}_\w{1,2}_/, 'pb_e_');
  const res = await fetch(imgUrl);

  try {
    const blob = await res.blob();
    imgUrl = window.URL.createObjectURL(blob);
  } catch (e) {
    throw new Error(`[下载图片失败] ${e}`);
  } // 作品详情列表


  const infoList = [...document.querySelectorAll('.detail_data > table:last-child > tbody > tr')];
  /**
   * 从详情列表中查找返回对应信息
   */

  function getInfo(key) {
    const infoItem = infoList.find(info => {
      var _info$querySelector, _info$querySelector$i;

      return info === null || info === void 0 ? void 0 : (_info$querySelector = info.querySelector('th')) === null || _info$querySelector === void 0 ? void 0 : (_info$querySelector$i = _info$querySelector.innerText) === null || _info$querySelector$i === void 0 ? void 0 : _info$querySelector$i.includes(key);
    });
    let info = '';

    if (infoItem) {
      if (key === '出演') {
        var _infoItem$querySelect, _Array$from;

        /**
         * 演员名有链接：取 <a> 标签
         * 演员名无链接：取 <td> 标签
         */
        const hasLink = infoItem === null || infoItem === void 0 ? void 0 : (_infoItem$querySelect = infoItem.querySelectorAll('td > a')) === null || _infoItem$querySelect === void 0 ? void 0 : _infoItem$querySelect.length;
        info = (_Array$from = Array.from(hasLink ? infoItem === null || infoItem === void 0 ? void 0 : infoItem.querySelectorAll('td > a') : infoItem === null || infoItem === void 0 ? void 0 : infoItem.querySelectorAll('td'), a => {
          var _innerText;

          return a === null || a === void 0 ? void 0 : (_innerText = a.innerText) === null || _innerText === void 0 ? void 0 : _innerText.trim();
        })) === null || _Array$from === void 0 ? void 0 : _Array$from.join(', ');
      } else {
        var _infoItem$querySelect2;

        info = infoItem === null || infoItem === void 0 ? void 0 : (_infoItem$querySelect2 = infoItem.querySelector('td')) === null || _infoItem$querySelect2 === void 0 ? void 0 : _infoItem$querySelect2.innerText;
      }
    }

    return info;
  } // 厂商名


  const makerName = getInfo('メーカー'); // 系列名

  const seriesName = getInfo('シリーズ'); // 日期

  const date = getInfo('配信開始日'); // 演员列表

  const actress = (_getInfo = getInfo('出演')) === null || _getInfo === void 0 ? void 0 : _getInfo.split(', '); // 番号

  const code = getInfo('品番'); // 时长

  const duration = getInfo('収録時間');
  const av = {
    workName,
    imgUrl,
    makerName,
    seriesName,
    date,
    actress,
    actressRealName: 'xxx',
    code,
    duration
  };
  return { ...av,
    finalName: mgstage_final(av)
  };
}


 // import { refineActress } from '@/utils/refine-actress'


 // 序号优先的系列

const mgstage_DIGIT_FIRST_SERIES = ['ラグジュTV', 'マジ軟派、初撮。', '働くドMさん.']; // 厂商名转换列表

const mgstage_MAKER_TRANS = {
  'プレステージプレミアム(PRESTIGE PREMIUM)': 'Prestige Premium'
};
/**
 * 是否需要移除系列名后的空格
 */

function mgstage_seriesEndSpace(name) {
  const noEndSpaceSeries = ['マジ軟派、初撮。'];
  return noEndSpaceSeries !== null && noEndSpaceSeries !== void 0 && noEndSpaceSeries.includes(name) ? '' : ' ';
}
/**
 * 拼接最终文件名
 */


function mgstage_final(av) {
  let finalName;
  /* === 1. 处理演员名 === */
  // av = refineActress(av)

  const actressString = av.actress.join(', ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = mgstage_DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        var _av;

        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）素人女优真实姓名 [时长]
        finalName = `${av.seriesName}${mgstage_seriesEndSpace((_av = av) === null || _av === void 0 ? void 0 : _av.seriesName)}${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}）${av.actressRealName} [${av.duration}]`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名（素人女优真实姓名）[时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString}（${av.actressRealName}）[${av.duration}]`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）素人女优真实姓名 [时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）${av.actressRealName} [${av.duration}]`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名（素人女优真实姓名）[时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName}（${av.actressRealName}）[${av.duration}]`;
  }

  return `【${(mgstage_MAKER_TRANS === null || mgstage_MAKER_TRANS === void 0 ? void 0 : mgstage_MAKER_TRANS[av.makerName]) || av.makerName}】${finalName}.jpg`.replaceAll('/', '-');
}
;// CONCATENATED MODULE: ./src/makers/02-censored/mousouzoku.ts
// 官网没有系列字段，从作品名中识别
const series = ['OLスーツ倶楽部'];
async function Mousouzoku() {
  var _document$querySelect, _document$querySelect2;

  // 作品名
  const workName = (_document$querySelect = document.querySelector('h1.ttl-works')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.innerText; // 封面地址

  const imgUrl = (_document$querySelect2 = document.querySelector('.tmb-img')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.href; // 页面数据列表

  let infoWrap = document.querySelector('dl.bx-info');
  /**
   * 根据属性名查找对应的属性值
   */

  function getInfo(key) {
    var _ref, _infoKey$nextElementS;

    const infoKey = (_ref = [...infoWrap.querySelectorAll('dt')]) === null || _ref === void 0 ? void 0 : _ref.find(item => {
      var _innerText;

      return item === null || item === void 0 ? void 0 : (_innerText = item.innerText) === null || _innerText === void 0 ? void 0 : _innerText.includes(key);
    });
    if (!infoKey) return;
    const valueList = Array.from(infoKey === null || infoKey === void 0 ? void 0 : (_infoKey$nextElementS = infoKey.nextElementSibling) === null || _infoKey$nextElementS === void 0 ? void 0 : _infoKey$nextElementS.querySelectorAll('p'), x => x === null || x === void 0 ? void 0 : x.innerText);
    return (valueList === null || valueList === void 0 ? void 0 : valueList.length) > 1 || key === '出演者' ? valueList : valueList === null || valueList === void 0 ? void 0 : valueList[0];
  } // 厂商名


  const makerName = getInfo('メーカー'); // 系列名

  const seriesName = series === null || series === void 0 ? void 0 : series.find(x => workName === null || workName === void 0 ? void 0 : workName.includes(x)); // 日期

  const date = getInfo('発売日'); // 演员列表

  const actress = getInfo('出演者'); // 番号

  const code = getInfo('品番');
  const av = {
    makerName,
    workName,
    seriesName,
    date,
    actress,
    code,
    imgUrl
  };
  return { ...av,
    finalName: mousouzoku_final(av)
  };
}





 // 序号优先的系列

const mousouzoku_DIGIT_FIRST_SERIES = [];
/**
 * 拼接最终文件名
 */

function mousouzoku_final(av) {
  let finalName;
  /* === 处理厂商名 === */

  av.makerName = av.makerName.replace('/', '·'); // 替换子厂商后的左斜杠

  /* === 1. 处理演员名 === */

  av = refineActress(av);
  const actressString = av.actress.join(' ');
  /* === 2. 处理标题 === */

  av = refineTitle(av);
  /* === 3. 处理番号 === */

  av.code = codify(av.code);
  /* === 3. 处理系列名 === */

  if (av && av.seriesName) {
    /* 系列作品 */
    av.seriesName = av.seriesName.trim();
    const numType1 = checkIndicator(av.workName); // 标识 + 编号

    const numType2 = checkDigit(av.workName, av.seriesName); // 纯数字编号

    if (numType1 || !numType1 && numType2) {
      /* 包含编号标识 || 不包含编号标识但包含纯数字 */
      const digitFirstSeries = mousouzoku_DIGIT_FIRST_SERIES.find(x => av.seriesName === x);

      if (digitFirstSeries) {
        // 系列编号在前：【厂商】系列名 编号（日期）演员名（番号）[时长]
        finalName = `${av.seriesName} ${numType1 || numType2}（${datify(av.date)}）${actressString}（${av.code}）`;
      } else {
        // 系列编号在后：【厂商】系列名（日期）编号（番号）演员名 [时长]
        finalName = `${av.seriesName}（${datify(av.date)}）${numType1 || numType2}（${av.code}）${actressString}`;
      }
    } else {
      /* 不含编号标识：【厂商】系列名（日期）演员名（番号）[时长] */
      finalName = `${av.seriesName}（${datify(av.date)}）${actressString}（${av.code}）`;
    }
  } else {
    /* 非系列作品：【厂商】（日期）演员（番号）作品名 [时长] */
    finalName = `（${datify(av.date)}）${actressString}（${codify(av.code)}）${av.workName}`;
  }

  return `【${av.makerName}】${finalName}.jpg`;
}
;// CONCATENATED MODULE: ./src/index.ts


/* ===== Makers ===== */












window.onload = async () => {
  await main();
};

async function main() {
  const a = createBtn(); // 创建按钮

  const domain = window.location.host;
  const av = await trySwitch(domain);

  if (av) {
    a.download = av.finalName;
    a.href = av.imgUrl; // eslint-disable-next-line

    console.log(a.download); // 自动保存开启

    if (localStorage.getItem('av-info-saver-auto-save') === 'yes') {
      a.click();
    }
  }
}
/**
 * 根据不同厂商，使用不同的处理脚本，设置不同的按钮内容
 * @param domain 网站域名
 */


async function trySwitch(domain) {
  let av = {};

  switch (domain) {
    /* ========== 无码 ========== */
    case 'www.1pondo.tv':
      av = await OnePondo();
      break;

    case 'www.caribbeancom.com':
      av = await Caribbean();
      break;

    case 'my.tokyo-hot.com':
      av = await TokyoHot();
      break;

    /* ========== 有码 ========== */
    // CA 集团

    case 'attackers.net':
    case 'honnaka.jp':
    case 'ideapocket.com':
    case 'madonna-av.com':
    case 'moodyz.com':
    case 'mvg.jp':
    case 'premium-beauty.com':
    case 's1s1s1.com':
      av = await CA();
      break;

    case 'www.mousouzoku-av.com':
      av = await Mousouzoku();
      break;
    // Prestige 集团

    case 'www.prestige-av.com':
      av = await Prestige();
      break;
    // SOD 集团

    case 'ec.sod.co.jp':
      av = await SOD();
      break;

    /* ========== 欧美 ========== */

    case 'www.brazzers.com':
      await sleep(5000);
      av = await Brazzers();
      break;

    case 'www.naughtyamerica.com':
      av = await NA();
      break;

    /* ========== 素人 ========== */

    case 'www.mgstage.com':
      av = await MGS();
      break;

    default:
      break;
  }

  return av;
}
/******/ })()
;