// ==UserScript==
// @name         空格之神
// @namespace    https://greasyfork.org/zh-CN/users/898390-adoyle
// @version      1.4.8
// @description  求你了, 加个空格吧!
// @author       Alger_Lee
// @license      MIT License
// @match        *://*/*
// @exclude      /\.(js|java|c|cpp|h|py|css|less|scss|json|yaml|yml|xml)$/
// @icon         https://s3.bmp.ovh/imgs/2022/04/18/51fe1daff46e443d.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506220/%E7%A9%BA%E6%A0%BC%E4%B9%8B%E7%A5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/506220/%E7%A9%BA%E6%A0%BC%E4%B9%8B%E7%A5%9E.meta.js
// ==/UserScript==

(function () {
  'use strict';
  class SpaceGod {
    constructor(target, invalidTags) {
      this.target = target;
      this.invalidTags = invalidTags;
      this.observer = new MutationObserver((mutations) => {
        const autofocusDom = document.querySelector('[autofocus]'); // 处理自动聚焦问题: 取消自动聚焦
        if (autofocusDom) {
          autofocusDom.removeAttribute('autofocus');
          autofocusDom.blur();
        }
        const focusDom = document.querySelector(':focus');
        if (
          focusDom &&
          (/input|textarea/i.test(focusDom.nodeName) ||
            focusDom.isContentEditable)
        ) {
          // 判断是否是输入状态, 如果是->跳过
          return;
        }
        for (let mutation of mutations) {
          let addedNodes = mutation.addedNodes;
          if (addedNodes.length === 0) {
            continue;
          } else {
            this.pray(addedNodes);
          }
        }
      });
    }
    init() {
      this.pray(this.target.childNodes);
      // 有些网页会延迟渲染, 导致空格效果失效
      let timer = setTimeout(() => {
        this.pray(this.target.childNodes);
        clearTimeout(timer);
      }, 1500);
      this.observer.observe(this.target, {
        childList: true,
        subtree: true,
      });
    }
    // 判断节点是否合法: 必须是元素节点(nodeType===1)/文本节点(nodeType===3) && 不属于非法节点(invalidTags)和他的子孙节点
    isValid(ele, rule) {
      let index = 0;
      while (
        ele &&
        ele.nodeName !== 'BODY' &&
        index < 2 // 只递归查找 2 层 节约性能
      ) {
        index++;
        if (ele.nodeType !== 1 && ele.nodeType !== 3) return false; // 排除非元素和非文本节点
        if (ele.nodeType === 1 && ele.getAttribute('isInvalidTag')) {
          // 当前元素节点有非法标记 --> 过滤, 并给子标签打标记
          ele.children.length <= 0 ??
            Array.from(ele.children).forEach((item) =>
              item.setAttribute('isInvalidTag', true)
            );
          return false;
        } else if (
          ele.parentNode &&
          ele.parentNode.getAttribute('isInvalidTag')
        ) {
          // 当前节点(文本/元素节点)无标记 && 父节点有 --> 过滤, 若是元素节点并给子标签打标记
          if (ele.nodeType === 1) {
            ele.setAttribute('isInvalidTag', true);
            ele.children.length <= 0 ??
              Array.from(ele.children).forEach((item) =>
                item.setAttribute('isInvalidTag', true)
              );
          }
          return false;
        } else if (rule.test(ele.nodeName)) {
          ele.setAttribute('isInvalidTag', true);
          ele.children.length <= 0 ??
            Array.from(ele.children).forEach((item) =>
              item.setAttribute('isInvalidTag', true)
            );
          return false;
        }
        // 过滤空节点
        if (
          !(ele.nodeValue ?? ele.innerText) ||
          /^\s*$/.test((ele.nodeValue ?? ele.innerText).trim())
        ) {
          return false;
        }
        ele = ele.parentNode;
      }
      return true;
    }
    // 筛选出节点集中所有的文本节点
    getAllTextNodes(childNodes, textNodes = []) {
      Array.from(childNodes)
        .filter((item) => this.isValid(item, invalidTags))
        .forEach((item) => {
          // console.log(
          //   item,
          //   '| 文本内容:' + (item.nodeValue ?? item.innerText)
          // );
          if (
            item.nodeType === 3
            // && item.nodeValue.trim() &&
            // !/^\n$/.test(item.nodeValue.trim()) // 已经在 isValid 判断过
          ) {
            textNodes.push(item);
          } else if (item.nodeType === 1 && item.innerText) {
            this.getAllTextNodes(item.childNodes, textNodes);
          }
        });
      return textNodes;
    }
    // 获取某个元素的第一个或者最后一个文本节点
    getBoundaryTextChild(ele, isLast = true) {
      // ele必须是元素节点
      const boundaryTextChild = isLast ? ele.lastChild : ele.firstChild;
      let sibling = isLast ? ele.nextSibling : ele.previousSibling;
      if (boundaryTextChild) {
        if (boundaryTextChild.nodeType === 3) return boundaryTextChild;
      } else {
        return this.getBoundaryTextChild(sibling, isLast);
      }
    }
    // 获取相邻文本节点
    getTextSibling(ele, isNext = true) {
      if (!ele) return null;
      let sibling = isNext ? ele.nextSibling : ele.previousSibling;
      if (sibling) {
        if (
          sibling.nodeType === 1 &&
          !this.invalidTags.test(sibling.nodeName)
        ) {
          if (sibling.innerText.trim()) {
            return this.getBoundaryTextChild(sibling);
          } else {
            return this.getTextSibling(sibling, isNext);
          }
        } else if (sibling.nodeType === 3) {
          if (sibling.nodeValue.trim()) {
            return sibling;
          } else {
            return this.getTextSibling(sibling, isNext);
          }
        } else {
          return this.getTextSibling(sibling, isNext);
        }
      } else {
        return this.getTextSibling(ele.parentNode, isNext);
      }
    }

    // 对称符号
    symmetricQuot(str, quot) {
      let tmp = '';
      let count = 0;
      return str.replace(new RegExp(quot, 'g'), ($1, _) => {
        // console.log(_,count);
        const pre = str.charAt(_ - 1);
        const next = str.charAt(_ + 1);
        if (/[\u4e00-\u9fa5]/.test(pre) && count % 2 === 0) {
          tmp = ' ' + $1;
        } else if (/[\u4e00-\u9fa5]/.test(next) && count % 2 === 1) {
          tmp = $1 + ' ';
        } else {
          tmp = $1;
        }
        count++;
        return tmp;
      });
    }
    // 非对称符号
    // asymmetricQuot(str) {
    //   return str
    //     .replace(/‘|“/g, ($1) => ' ' + $1)
    //     .replace(/’|”/g, ($1) => $1 + ' ');
    // }
    // 虔诚祈祷空格之神降临
    pray(childNodes) {
      // 过滤当前节点集合中的所有`非空`文本节点, 放入textNodes
      const textNodes = this.getAllTextNodes(childNodes);
      // console.log(textNodes);
      if (textNodes.length === 0) return;
      // textNodes 的首尾判断
      const firstNode = textNodes[0],
        nextNode = textNodes[textNodes.length - 1];
      const prev = this.getTextSibling(firstNode, false),
        next = this.getTextSibling(nextNode);
      if (prev) {
        textNodes.unshift(prev);
      }
      if (next) {
        textNodes.push(next);
      }
      // 遍历符合条件的文本节点, 并添加空格
      textNodes.forEach((item, index) => {
        // 文本节点内部判断
        item.nodeValue = item.nodeValue
          .replace(
            /(?<=[\u4e00-\u9fa5])[0-9a-zA-Z@\$\^&\*_\(\{\[±×÷=<≠≡≌≈≮≯≤≥％‰∞∝√∵∴∷∠⌒⊙○△⊥∪∩∫∑°℃]+/g,
            ($1) => ` ${$1}`
          )
          .replace(
            /[0-9a-zA-Z\?!\$\^&\*_;\)\}\]:\.,~±×÷=>≠≡≌≈≮≯≤≥％‰∞∝√∵∴∷∠⌒⊙○△⊥∪∩∫∑°℃]+(?=[\u4e00-\u9fa5])/g,
            ($1) => `${$1} `
          );

        // 当前节点非第一个节点 && 如果前一个文本节点以中文结尾 && 当前节点是英文开头
        if (
          index > 0 &&
          /[\u4e00-\u9fa5]$/.test(textNodes[index - 1].nodeValue) &&
          /^[0-9a-zA-Z@\$\^&\*_\(\{\[~±×÷=<≠≡≌≈≮≯≤≥％‰∞∝√∵∴∷∠⌒⊙○△⊥∪∩∫∑°℃]/.test(
            item.nodeValue
          )
        ) {
          textNodes[index - 1].nodeValue = `${textNodes[index - 1].nodeValue} `; // 空格总是加在前一个文本节点 因为上前个文本节点末尾可能是换行
        }
        // 当前节点非最后一个文本节点 && 如果后一个文本节点以中文开头 && 当前节点是英文结尾
        if (
          index < textNodes.length - 1 &&
          /^[\u4e00-\u9fa5]/.test(textNodes[index + 1].nodeValue) &&
          /[0-9a-zA-Z\?!\$\^&\*_;\)\}\]:\.,~±×÷=>≠≡≌≈≮≯≤≥％‰∞∝√∵∴∷∠⌒⊙○△⊥∪∩∫∑°℃]$/.test(
            item.nodeValue
          )
        ) {
          item.nodeValue = `${item.nodeValue} `;
        }
        // 处理对称相等符号符号(`'"#)等匹配问题
        item.nodeValue = this.symmetricQuot(item.nodeValue, "'");
        item.nodeValue = this.symmetricQuot(item.nodeValue, '"');
        item.nodeValue = this.symmetricQuot(item.nodeValue, '″');
        item.nodeValue = this.symmetricQuot(item.nodeValue, '#')
        // item.nodeValue = this.asymmetricQuot(item.nodeValue)
          /**
           * 修正表示范围的汉字连字符不规范的用法
           * 连字符一般有三种:
           * 一个字母长度的英文连字符: 用在英文字符和数字之间, 如 0-9 inner-text
           * 一个汉字长度/半个破折号长度: 用在中文表示范围, 通常是单位, 如 [35 万 —- 40 万]
           * 两个汉字长度的破折号 ----
           */
          .replace(/(?<=[\u4e00-\u9fa5])-/g, ' — ');
        if (
          // 相邻文本节点存在连字符
          index > 0 &&
          /[\u4e00-\u9fa5]$/.test(textNodes[index - 1].nodeValue) &&
          /^-/.test(item.nodeValue)
        ) {
          item.nodeValue = item.nodeValue.replace(/-/g, ' — ');
        }
      });
    }
  }
  const target = document.body;
  const invalidTags =
    /^(svg|canvas|head|(?:no|)script|style|meta|img|br|hr|form|input|textarea|code|isindex|area|base|basefont|bgsound|col|embed|keygen|link|nextid|param|plaintext|pre|spacer|wbr|ytd-thumbnail|iron-iconset-svg)$/i;

  new SpaceGod(target, invalidTags).init();
})();

