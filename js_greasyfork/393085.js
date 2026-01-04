// ==UserScript==
// @name CommonsUtil
// @name:CN-zh_cn 工具类
// @version 1.1
// @description utility methods
// @author gaojr
// @namespace https://github.com/gaojr/scripts-styles
// @grant none
// @match https://*/*
// ==/UserScript==

/**
 * 类似jquery的选择器
 * @param {string} selector 选择器
 * @param {Element} ele 元素
 * @return {Element} 元素
 */
const _$ = (selector, ele) => {
  return (ele || document).querySelector(selector);
};

/**
 * 类似jquery的选择器
 * @param {string} selector 选择器
 * @param {Element} ele 元素
 * @return {NodeListOf<Element>} 元素
 */
const _$$ = (selector, ele) => {
  return [...(ele || document).querySelectorAll(selector)];
};

/**
 * 输出错误
 * @param {string} functionName 方法名
 * @param {Error} error 错误
 */
const ce = (functionName, error) => {
  let msg = '';
  if (!!functionName) {
    msg = 'function name: ' + functionName + '\nerror: ';
  }
  msg += error;
  console.error(msg);
};

/**
 * 循环移除元素
 * @param {Element} ele 元素
 */
const removeRecursively = (ele) => {
  try {
    let parent = ele.parentNode;
    ele.remove();
    if (parent && parent.innerHTML && !parent.innerHTML.match(/\S/)) {
      // 父元素存在且父元素内容为空
      removeRecursively(parent);
    }
  } catch (e) {
    ce('removeRecursively', e);
  }
};

/**
 * 移除选择器对象
 * @param {string} selector 选择器
 * @param {boolean} only 是否仅移除该对象
 */
const removeIt = (selector, only) => {
  try {
    if (only === false) {
      removeRecursively(_$(selector));
    } else {
      _$(selector).remove();
    }
  } catch (e) {
    ce('removeIt', e);
  }
};

/**
 * 移除选择器所有对象
 * @param {string} selector 选择器
 */
const removeAll = (selector) => {
  try {
    _$$(selector).forEach((ele) => {
      removeRecursively(ele);
    });
  } catch (e) {
    ce('removeAll', e);
  }
};

/**
 * 点击选择器对象
 * @param {string} selector 选择器
 */
const clickIt = (selector) => {
  try {
    _$(selector).click();
  } catch (e) {
    ce('clickIt', e);
  }
};

/**
 * 要在document加载完成后运行的函数
 */
const funcMap = new Map();

/**
 * 加入方法map
 * @param {string} name 名字
 * @param {Function} func 方法
 */
const addToFuncMap = (name, func) => {
  if (!funcMap.has(name)) {
    funcMap.set(name, func);
  }
};

let tempFunc = document.onreadystatechange;
document.onreadystatechange = () => {
  if (typeof tempFunc === 'function') {
    tempFunc();
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    funcMap.forEach((value, key) => {
      try {
        console.log('TMscript start: ' + key);
        value();
        console.log('TMscript end: ' + key);
      } catch (e) {
        console.log('TMscript error: ' + key);
        ce('', e);
      }
    });
  }
};
