// ==UserScript==
// @name         tank util 通用js工具脚本
// @homepage     https://github.com/dorisentomari/greasyfork-tank-util
// @namespace    http://overflow.cat/
// @version      1.4
// @description  通用js工具脚本
// @author       general
// @match        *://*/*
// @grant        none
// @license MIT
// ==/UserScript==
const ua = window.navigator.userAgent;

const tankUtils = {
  checkIsPlainObject,
  checkIsValidDom,
  commonSetDomStyle,
  commonSetDomAttributes,
  createElement,
  base64ToBlob,
  removeDom,
  domAddClassName,
  domRemoveClassName,
  domContainsClassName,
  checkIsMobilePhone,
  checkIsAndroid,
  checkIsIPhone,
  convertImageToCanvas,
  convertCanvasToImage,
  commonSetDomListStyleCssText,
  findDom,
  findDomList,
  isPC: !ua.includes('Android') && !ua.includes('iPhone'),
  isMobile: ua.includes('Android') || ua.includes('iPhone'),
  isAndroid: ua.includes('Android'),
  isIPhone: ua.includes('iPhone'),
};

if (typeof window !== 'undefined') {
  window.tankUtils = tankUtils;
}

/**
 * @description 检查是否有纯对象
 * @param obj
 */
function checkIsPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * @description 判断是否有效 dom
 * @param dom
 */
function checkIsValidDom(dom) {
  if (!dom) {
    return false;
  }

  if (Array.isArray(dom)) {
    return dom;
  }

  if (typeof HTMLElement === 'object') {
    return dom instanceof HTMLElement;
  }
  return dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
}

/**
 * @description 通用设置样式
 * @param selector {string | HTMLElement}
 * @param style {Object}
 */
function commonSetDomStyle(selector, style = {}) {
  if (!selector) {
    return;
  }

  let dom = null;
  if (typeof selector === 'string') {
    dom = document.querySelector(selector);
  } else if (checkIsValidDom(selector)) {
    dom = selector;
  }

  if (!checkIsValidDom(dom)) {
    return;
  }

  Object.keys(style).forEach((key) => {
    dom.style[key] = style[key];
  });
}

/**
 * @description 查找单个 dom
 * @param selector
 * @return {null}
 */
function findDom(selector) {
  if (!selector) {
    return null;
  }

  let dom = null;
  if (typeof selector === 'string') {
    dom = document.querySelector(selector);
  } else if (checkIsValidDom(selector)) {
    dom = selector;
  }

  if (!checkIsValidDom(dom)) {
    return null;
  }
  return dom;
}

/**
 * @description 查找 dom 列表
 * @param selector
 * @return {unknown[]|*[]}
 */
function findDomList(selector) {
  if (!selector) {
    return [];
  }

  let dom = null;
  if (typeof selector === 'string') {
    dom = document.querySelectorAll(selector);
  } else if (checkIsValidDom(selector)) {
    dom = selector;
  }

  if (!checkIsValidDom(dom)) {
    return [];
  }
  return Array.from(dom);
}

/**
 * 通过 dom 设置样式
 * @param selector
 * @param cssText
 */
function commonSetDomListStyleCssText(selector, cssText) {
  const domList = findDomList(selector);
  domList.forEach((domItem) => {
    domItem.style.cssText = cssText;
  });
}

/**
 * @description 通用设置属性
 * @param dom {HTMLElement}
 * @param attributes {Object}
 */
function commonSetDomAttributes(dom, attributes = {}) {
  if (!dom) {
    return;
  }

  Object.keys(attributes).forEach((key) => {
    dom[key] = attributes[key];
  });
}

/**
 * @description dom 添加类名
 * @param dom
 * @param className
 */
function domAddClassName(dom, className) {
  if (checkIsValidDom(dom)) {
    dom.classList.add(className);
  }
}

/**
 * @description dom 删除类名
 * @param dom
 * @param className
 */
function domRemoveClassName(dom, className) {
  if (checkIsValidDom(dom)) {
    dom.classList.remove(className);
  }
}

/**
 * @description 检查 dom 包含哪个类名
 * @param dom
 * @param className
 */
function domContainsClassName(dom, className) {
  if (checkIsValidDom(dom)) {
    dom.classList.contains(className);
  }
}

/**
 * @description 创建 dom
 * @param elem {string}
 * @param attributes {Object}
 * @param style {Object}
 */
function createElement(elem, attributes = {}, style = {}) {
  if (!elem) {
    return null;
  }

  const dom = document.createElement(elem);

  if (checkIsPlainObject(attributes)) {
    commonSetDomAttributes(dom, attributes);
  }

  if (checkIsPlainObject(style)) {
    commonSetDomStyle(dom, style);
  }

  return dom;
}

/**
 * @description bae64转为图片
 * @param urlData
 * @return {Blob}
 */
function base64ToBlob(urlData) {
  var arr = urlData.split(',');
  var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
  // 去掉url的头，并转化为byte
  var bytes = window.atob(arr[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length);
  // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
  var ia = new Uint8Array(ab);

  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }

  return new Blob([ab], {
    type: mime,
  });
}

/**
 * @description 删除 dom
 * @param className
 */
function removeDom(className) {
  try {
    const childDoms = document.querySelectorAll(className.trim());
    for (let i = 0; i < childDoms.length; i++) {
      const childDom = childDoms[i];
      childDom.parentNode.removeChild(childDom);
    }
  } catch (e) {
    console.log('e', e);
  }
}

/**
 * @description 检查是否是手机
 * @return {boolean}
 */
function checkIsMobilePhone() {
  return checkIsAndroid() || checkIsIPhone();
}

/**
 * @description 检查是否是安卓手机
 * @return {boolean}
 */
function checkIsAndroid() {
  return window.navigator.userAgent.includes('Android');
}

/**
 * @description 检查是否是苹果手机
 * @return {boolean}
 */
function checkIsIPhone() {
  return window.navigator.userAgent.includes('iPhone');
}

/**
 * @description 图片转为canvas
 * @param image
 * @return {HTMLCanvasElement}
 */
function convertImageToCanvas(image) {
  // 创建canvas DOM元素，并设置其宽高和图片一样
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
  const context = canvas.getContext('2d');
  if (context) {
    context.drawImage(image, 0, 0);
  }
  return canvas;
}

/**
 * @description 从 canvas 提取图片 image
 * @param canvas {HTMLCanvasElement}
 * @return {HTMLImageElement}
 */
function convertCanvasToImage(canvas) {
  //新Image对象，可以理解为DOM
  const image = new Image();
  // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
  // 指定格式 PNG
  image.src = canvas.toDataURL('image/png');
  return image;
}