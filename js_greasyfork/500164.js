// ==UserScript==
// @name         直接跳转文本链接
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  识别并直接跳转普通文本链接
// @author       wcbblll
// @match        *://*/*
// @exclude       https://greasyfork.org/*
// @run-at      document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500164/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/500164/%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 移除重复项
  function removeDuplicates(arr) {
    return arr.filter((item, index, self) => self.indexOf(item) === index);
  }

  // 从后往前遍历数组

  function traverseArrayBackward(arr, callback) {
    for (let i = arr.length - 1; i >= 0; i--) {
      callback(arr[i], i, i === 0);
    }
  }

  let linkRegex = /((https?:\/\/)?|(\/\/))?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  // 文本全局匹配链接返回数组，数组里面是字符串
  function getTextLinks(text) {
    // const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    // const linkRegex = /((https?:\/\/)?|(\/\/))?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const links = text.match(linkRegex);
    return filterLinks(links || []);
  }

  // 文本全局匹配链接返回数组，数组里面是对象
  // 先用url匹配，匹配之后把匹配到的字符串替换为空符串在匹配host，解决url和host匹配两次的问题
  function getTextLinksList(text) {
    // const linkRegex = /((https?:\/\/)?|(\/\/))?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    // const linkRegex = /((https?:\/\/)?|(\/\/))?(www\.)?[a-zA-Z0-9#]{1,256}[-@:%._\+~=]*\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const hostRegex = /\b(?!\/\/)((?:www\.)?[a-zA-Z0-9_.-]+(?:\.[a-zA-Z0-9_.-]+)*\.[a-zA-Z]{2,})\b/g
    let newText = text
    // debugger
    function matchFunc(reg, type) {
      const matches = newText.matchAll(reg);
      const matchArr = []
      for (const match of matches) {
        const matchStr = match[0]
        const len = matchStr.length
        newText = newText.replace(matchStr, ' '.repeat(len))
        match.type = type
        matchArr.push(match)
      }
      return matchArr
    }
    return filterLinks([...matchFunc(linkRegex, 'url'), ...matchFunc(hostRegex, 'host')])
  }

  // 传参为一维数组或二维数组，二维数组取第一项，对传参进行过滤，链接必须包含顶级域名，ip必须是合法的ipv4地址。过滤，减少误判情况
  function filterLinks(links) {
    if (!links) return links
    // 常用的顶级域名列表，通过过滤，减少误判情况
    // eslint-disable-next-line
    const yuMingList = ['com', 'net', 'org', 'edu', 'gov', 'mil', 'info', 'biz', 'app', 'shop', 'store', 'xyz', 'top', 'live', 'cn', 'us', 'uk', 'jp', 'de', 'fr', 'ca', 'hk', 'tw', 'mo', 'eu', 'in', 'tv', 'cc', 'cloud']
    function isLink(link) {
      const find = yuMingList.find(item => link.includes(`.${item}`))
      if (find) return true
      const ipv4List = link.split('.')
      // ipv4必须包含4位数字
      const ipv4 = ipv4List.length >= 4 && ipv4List.reduce((pre, cur) => {
        if (Number(cur) === Number(cur)) pre++
        return pre
      }, 0) >= 4
      if (ipv4) return true
      return false
    }
    return links.filter((item) => {
      if (Array.isArray(item)) {
        // 二维数组
        return isLink(item[0])
      } else {
        // 普通数组
        return isLink(item)
      }
    })
  }

  /**
   * Splits a given text into an array of objects, where each object represents a segment of the text.
   *
   * @param {string} text - The text to be split.
   * @param {Array<Object>} arr - An array of objects, where each object contains a link and its index in the text.
   * @return {Array<Object>} An array of objects, where each object represents a segment of the text.
   */
  function splitText(text, arr) {
    if (!arr.length) return [{ text, type: 'text' }]
    let lastIndex = 0
    let returnArr = []
    arr.forEach((item, i) => {
      const link = item[0]
      const textObj = { text: text.slice(lastIndex, item.index), type: 'text' }
      const linkObj = { text: link, type: 'link' }
      returnArr.push(textObj, linkObj)
      lastIndex = item.index + link.length
      if (i === arr.length - 1 && lastIndex < text.length) {
        returnArr.push({ text: text.slice(lastIndex), type: 'text' })
      }
    })
    return returnArr
  }

  // 根据链接地址创建a标签，都当做绝对路径使用
  function createLink(link) {
    const a = document.createElement("a");
    a.href = link.indexOf('//') > -1 ? link : '//' + link;
    a.textContent = link;
    a.target = "_blank"; // 可选：在新标签页打开链接
    a.rel = 'noopener noreferrer nofollow'
    a.setAttribute('text-link', true)
    return a;
  }

  // 根据文字创建文本标签
  function createTextNode(text) {
    const textNode = document.createTextNode(text);
    return textNode;
  }

  // 根据类型返回不同的创建标签方法
  function createNode(type, text) {
    switch (type) {
      case 'link':
        return createLink(text);
      case 'text':
        return createTextNode(text);
      default:
        throw new Error('Invalid type');
    }
  }

  /*
{
  match: {
      node:[]
  }
}
*/
  // 排除列表，这些里面内容不需要处理
  const excludeList = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT']

  function createTextNodeTree(matchObj = {}, node, parent) {
    if (parent && excludeList.includes(parent.nodeName)) return matchObj
    if (node.nodeType === 3) {
      const textContent = node.textContent;
      let matches = getTextLinks(textContent)
      matches.forEach((match) => {
        if (matchObj[match] && matchObj[match].length > 0) {
          matchObj[match].push(node)
        } else {
          matchObj[match] = [node]
        }
      });
    }

    if (node.shadowRoot) {
      const shadowRoot = node.shadowRoot
      for (const shadowRootChild of shadowRoot.childNodes) {
        createTextNodeTree(matchObj, shadowRootChild, shadowRoot)
      }
    }
    for (let child of node.childNodes) {
      createTextNodeTree(matchObj, child, node)
    }

    return matchObj;
  }


  function debounce(func, delay) {
    let timer;

    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }


  function callback(mutationsList, observer) {
    const matchObj = createTextNodeTree({}, document.body, null);
    for (const match in matchObj) {
      if (Object.hasOwnProperty.call(matchObj, match)) {
        const nodeList = removeDuplicates(matchObj[match]);
        nodeList.forEach((node) => {
          const generateNodeList = splitText(node.textContent, getTextLinksList(node.textContent));
          traverseArrayBackward(generateNodeList, ({ type, text }, i, isLast) => {
            try {
              isLast ? node.parentNode.replaceChild(createNode(type, text), node) :
                node.nextSibling ?
                  node.parentNode.insertBefore(createNode(type, text), node.nextSibling) :
                  node.parentNode.appendChild(createNode(type, text));
            } catch (error) { }
          })
        })
      }
    }

  }

  let observer = new MutationObserver(debounce(callback, 1000));

  observer.observe(document.body, { childList: true, attributes: true });
})();