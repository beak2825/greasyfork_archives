// ==UserScript==
// @name         copy-notion-page-content-as-markdown
// @name:en Copy Notion Page Content AS Markdown
// @name:zh-CN 一键复制 Notion 页面内容为标准 Markdown 格式
// @namespace    https://github.com/Seven-Steven/tampermonkey-scripts/tree/main/copy-notion-page-content-as-markdown
// @supportURL https://github.com/Seven-Steven/tampermonkey-scripts/issues
// @description  一键复制 Notion 页面内容为标准 Markdown 格式。
// @description:zh-CN  一键复制 Notion 页面内容为标准 Markdown 格式。
// @description:en Copy Notion Page Content AS Markdown.
// @version      2.2
// @license MIT
// @author       Seven
// @homepage https://blog.diqigan.cn
// @match        *://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @downloadURL https://update.greasyfork.org/scripts/477050/copy-notion-page-content-as-markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/477050/copy-notion-page-content-as-markdown.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 复制按钮 ID
   */
  const DOM_ID_OF_COPY_BUTTON = 'tamper-monkey-plugin-copy-notion-content-as-markdown-copy-button';
  /**
   * Notion 页面祖先节点 Selector
   */
  const DOM_SELECTOR_NOTION_PAGE_ANCESTOR = '#notion-app';
  /**
   * 公共的 Notion Page Content Selector
   */
  const DOM_SELECTOR_NOTION_PAGE_CONTENT_COMMON = `${DOM_SELECTOR_NOTION_PAGE_ANCESTOR} .notion-page-content`;
  /**
   * 普通页面的 Notion Page Content Selector
   */
  const DOM_SELECTOR_NOTION_PAGE_CONTENT_NORMAL = `${DOM_SELECTOR_NOTION_PAGE_ANCESTOR} main.notion-frame .notion-page-content`;
  /**
   * 插件挂载状态
   */
  let PLUGIN_MOUNT_STATUS = false;

  init();

  /**
   * 初始化动作
   */
  function init() {
    console.log('init TamperMonkey plugin: Copy Notion Content AS Markdown.');

    const mountPlugin = () => {
      console.log('find Notion Page, mount Plugin directly.');
      onMount();
    };

    waitForElements(10000, 1000, DOM_SELECTOR_NOTION_PAGE_CONTENT_COMMON)
      // 对于 Notion Page 页面，直接初始化插件就好
      .then(mountPlugin).catch(() => { });

    waitForElements(10000, 1000, DOM_SELECTOR_NOTION_PAGE_CONTENT_NORMAL)
      .then(mountPlugin)
      // 对于 DataBase / View 等其他页面，需要监听 DOM 节点变化判断当前页面有没有 Notion Page Content DOM，进而装载 / 卸载插件
      .catch(() => {
        console.log('can not find notion page, add observe for ancestor.');
        autoMountOrUmountPluginByObserverFor(DOM_SELECTOR_NOTION_PAGE_ANCESTOR)
      });
  }

  /**
   * 监听指定 DOM 的子节点变化，并根据子节点变化动态装载 / 卸载插件
   * @param {string} selector 节点选择器
  */
  const autoMountOrUmountPluginDebounce = debounce(autoMountOrUmountPlugin, 500);
  function autoMountOrUmountPluginByObserverFor(selector) {
    const ancestorDOM = document.querySelector(selector);
    if (!ancestorDOM) {
      console.error('Ancestor DOM of Notion Page does not exist!');
      return;
    }

    // 创建 MutationObserver 实例，监听页面节点变化
    const observer = new MutationObserver(mutations => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          // 在页面节点子元素发生变化时，根据条件挂载/卸载插件
          autoMountOrUmountPluginDebounce();
          break;
        }
      }
    });

    // 配置 MutationObserver 监听选项
    const observerConfig = {
      childList: true,
      subtree: true,
      characterData: false,
      attributes: false,
    };

    // 开始监听页面节点变化
    observer.observe(ancestorDOM, observerConfig);
  }

  /**
   * 装载/卸载插件
   */
  function autoMountOrUmountPlugin() {
    console.log('auto solve plugin...');
    waitForElements(500, 100, DOM_SELECTOR_NOTION_PAGE_CONTENT_COMMON).then(() => {
      console.log('Find Notion Page Content, begin to mount plugin......');
      onMount();
    }).catch(() => {
      console.log('Can not find Notion Page Content, begin to umount plugin......');
      onUmount();
    })
  }

  /**
   * 装载插件
   */
  function onMount() {
    if (PLUGIN_MOUNT_STATUS) {
      console.log('Plugin already mounted, return.');
      return;
    }

    initCopyButton();
    window.addEventListener('copy', fixNotionMarkdownInClipboard);
    PLUGIN_MOUNT_STATUS = true;
    console.log('Plugin Mounted.');
  }

  /**
   * 卸载插件
   */
  function onUmount() {
    if (!PLUGIN_MOUNT_STATUS) {
      console.log('Plugin not mounted, return.');
      return;
    }

    removeCopyButton();
    window.removeEventListener('copy', fixNotionMarkdownInClipboard);
    PLUGIN_MOUNT_STATUS = false;
    console.log('Plugin UnMounted.');
  }

  /**
   * 修正剪切板中的 Notion Markdown 文本格式
   */
  function fixNotionMarkdownInClipboard() {
    navigator.clipboard.readText().then(text => {
      const markdown = fixMarkdownFormat(text);
      navigator.clipboard.writeText(markdown).then(() => {
        showMessage('复制成功');
      }, () => {
        console.log('failed.');
      })
    })
  }

  /**
   * 修正 markdown 格式
   */
  function fixMarkdownFormat(markdown) {
    if (!markdown) {
      return;
    }

    // 给没有 Caption 的图片添加默认 ALT 文字
    markdown = markdown.replaceAll(/^!(http\S+)$/gm, (match, imgUrl) => {
      return `![picture](${imgUrl})`;
    });
    // 给有 Caption 的图片去除多余文字
    const captionRegex = /(\!\[(?<title>.+?)\]\(.*?\)\s*)\k<title>\s*/g;
    return markdown.replaceAll(captionRegex, '$1');
  }

  /**
 * 初始化复制按钮
 */
  function initCopyButton() {
    const copyButton = document.createElement('div');

    copyButton.style.position = 'fixed';
    copyButton.style.width = '80px';
    copyButton.style.height = '22px';
    copyButton.style.lineHeight = '22px';
    copyButton.style.top = '14%';
    copyButton.style.right = '1%';
    copyButton.style.background = '#0084ff';
    copyButton.style.fontSize = '14px';
    copyButton.style.color = '#fff';
    copyButton.style.textAlign = 'center';
    copyButton.style.borderRadius = '6px';
    copyButton.style.zIndex = 10000;
    copyButton.style.cursor = 'pointer';
    copyButton.style.opacity = 0.7;
    copyButton.innerHTML = '复制内容';
    copyButton.id = DOM_ID_OF_COPY_BUTTON;
    copyButton.addEventListener('click', copyNotionPageContent);

    document.body.prepend(copyButton);
  }

  /**
   * 移除复制按钮
   */
  function removeCopyButton() {
    const copyButton = document.getElementById(DOM_ID_OF_COPY_BUTTON);
    if (!copyButton) {
      return;
    }

    copyButton.remove();
  }

  /**
   * 复制 Notion Page 内容
   */
  function copyNotionPageContent() {
    const selection = window.getSelection();
    selection.removeAllRanges();
    const pageContent = document.querySelector(DOM_SELECTOR_NOTION_PAGE_CONTENT_COMMON);
    if (!pageContent) {
      console.error("No Notion Page Content on Current Page.");
      return;
    }
    const range = new Range();

    const contentNextUncle = findNextElement(pageContent);
    range.setStart(pageContent, 0);
    if (contentNextUncle) {
      range.setEnd(contentNextUncle, 0);
    } else {
      range.setEndAfter(pageContent.lastChild);
    }

    selection.addRange(range);

    // console.log('childrenNodeCount', pageContent.childElementCount, pageContent.childNodes.length);
    // Array.from(pageContent.childNodes).forEach(e => console.log(selection.containsNode(e)));

    setTimeout(() => {
      document.execCommand('copy');
      selection.removeAllRanges();
    }, 500);
  }

  /**
   * 查找指定 DOM 的下一个元素
   * @param {Node} node DOM
   * @returns 指定 DOM 的下一个元素
   */
  function findNextElement(node) {
    while (node.nextSibling === null) {
      node = node.parentNode;
    }
    return node.nextSibling;
  }

  /**
   * 在页面显示提示信息
   */
  function showMessage(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  /**
   * 延迟执行
   **/
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 防抖方法，连续触发场景下只执行一次
   * 触发高频事件后一段时间（wait）只会执行一次函数，如果指定时间（wait）内高频事件再次被触发，则重新计算时间。
   * @param {function} func 待执行的方法
   * @param {number} wait 执行方法前要等待的毫秒数
   * @returns
   */
  function debounce(func, wait) {
    let timeout = null;
    return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }

  /**
   * 节流方法，连续触发场景下每 wait 时间区间执行一次
   * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
   * @param {function} func 待执行的方法
   * @param {number} wait 执行方法前要等待的毫秒数
   * @returns
   */
  function throttle(func, wait) {
    let timeout = null;
    return function () {
      let context = this;
      let args = arguments;
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    };
  }

  /**
   * 在 maxWait 时间内等待所有 selectors 对应的 DOM 全部加载完成，每隔 interval 毫秒检查一次
   * @param {number} maxWait 最大等待毫秒数
   * @param {number} interval 检查间隔毫秒数
   * @param  {...string} selectors DOM 选择器
   * @returns Promise
   */
  function waitForElements(maxWait, interval, ...selectors) {
    return new Promise((resolve, reject) => {
      const checkElements = () => {
        const elements = selectors.map(selector => document.querySelector(selector));
        if (elements.every(element => element != null)) {
          resolve(elements);
        } else if (maxWait <= 0) {
          reject(new Error('Timeout'));
        } else {
          setTimeout(checkElements, interval);
          maxWait -= interval;
        }
      };

      setTimeout(() => {
        reject(new Error('Timeout'));
      }, maxWait);

      checkElements();
    });
  }

})();
