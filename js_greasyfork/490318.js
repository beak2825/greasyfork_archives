// ==UserScript==
// @name         掘金小册转markdown
// @name:zh-CN   掘金小册转markdown
// @description  将掘金小册转存为markdown文件
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  掘金小册转存为markdown文件
// @author       BiubiuUp
// @match        *://juejin.cn/*
// @match        *://juejin.im/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAM1BMVEVHcEwegP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP/VLHvJAAAAEXRSTlMAyhfz/zIK5lxRm9aqaUMfhegzbbIAAACgSURBVHgBvNBFEsQwEATBllRm/P9n19xhvG6aQUP6hxD0JSZI8eMbq4+vGUCmD3lR5K/pSll5TVwBtXY1UJ3jNUCTn2/P6r2YjHMQxdaR6Tocs41SD8Waf0is0rAuKaDXCMtlEQCCFj3A6Oti9I1X5IUXVJVDeBytUzl5KzsVqRKg04nbc8PmwUj75cQzSuk0H3MyKPVqSOeip2FLYHQAAKNqBSDGkkobAAAAAElFTkSuQmCC
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license      MIT
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/490318/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E8%BD%ACmarkdown.user.js
// @updateURL https://update.greasyfork.org/scripts/490318/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E8%BD%ACmarkdown.meta.js
// ==/UserScript==

(async function () {
  // 'use strict';

  function getElement(parent, selector, timeout = 0) {
    return new Promise(resolve => {
      let result = parent.querySelector(selector);
      if (result) return resolve(result);
      let timer;
      const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
      if (mutationObserver) {
        const observer = new mutationObserver(mutations => {
          for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
              if (addedNode instanceof Element) {
                result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                if (result) {
                  observer.disconnect();
                  timer && clearTimeout(timer);
                  return resolve(result);
                }
              }
            }
          }
        });
        observer.observe(parent, {
          childList: true,
          subtree: true
        });
        if (timeout > 0) {
          timer = setTimeout(() => {
            observer.disconnect();
            return resolve(null);
          }, timeout);
        }
      } else {
        const listener = e => {
          if (e.target instanceof Element) {
            result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
            if (result) {
              parent.removeEventListener('DOMNodeInserted', listener, true);
              timer && clearTimeout(timer);
              return resolve(result);
            }
          }
        };
        parent.addEventListener('DOMNodeInserted', listener, true);
        if (timeout > 0) {
          timer = setTimeout(() => {
            parent.removeEventListener('DOMNodeInserted', listener, true);
            return resolve(null);
          }, timeout);
        }
      }
    });
  }
  function addScript(src, callback) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    s.onload = callback;
    document.body.appendChild(s);
  }
  function addButton(selector) {
    // 获取需要插入图标的元素
    let element = document.querySelector(selector);

    // 定义SVG下载图标的HTML代码
    let svgIcon = `
      <svg class="biubiu-download" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: relative; top: -25px; left: 36px; color: rgb(186, 186, 186)">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      `;

    // 在元素的末尾插入SVG下载图标
    element.insertAdjacentHTML('beforeend', svgIcon);
    return document.querySelector('.biubiu-download')
  }

  function saveAsMd(mdStr) {
    const blob = new Blob([mdStr], {
      type: 'text/markdown'
    })
    // 根据 blob生成 url链接
    const objectURL = URL.createObjectURL(blob)

    // 创建一个 a 标签Tag
    const aTag = document.createElement('a')
    // 设置文件的下载地址
    aTag.href = objectURL
    // 设置保存后的文件名称
    aTag.download = `${title}.md`
    // 给 a 标签添加点击事件
    aTag.click()
    // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
    // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
    URL.revokeObjectURL(objectURL)
  }
  let titleDom = await getElement(document, '.route-active .title-text')
  let index = document.querySelector('.route-active .index').textContent;
  // 获取span元素的文字内容
  const textContent = titleDom.textContent;
  // 去除标点符号
  const title = index + '.' + textContent.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
    '');
  // 调用函数开始遍历并删除 div
  // removeDivInPre(dom);
  // 引入 turndown
  addScript('https://unpkg.com/turndown/dist/turndown.js', () => {
    let downloadButton = addButton('.book-summary__footer')
    downloadButton.onclick = async () => {
      await getElement(document, '.markdown-body p')
      let dom = await getElement(document, '.markdown-body')
      let turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
      let markdown = turndownService.remove('style').remove(function (node, options) {
        return (
          node.nodeName === 'DIV' &&
          node.classList.contains('code-block-extension-header')
        )
      }).turndown(dom)
      markdown = `# ${textContent}\n\n${markdown}`;
      // console.log(markdown)
      saveAsMd(markdown)
    }
    // automa插件使用的next函数
    // automaNextBlock()
  })
  // automa插件使用的next函数
  // automaNextBlock()

  // let TurndownService = require('turndown')
})()


