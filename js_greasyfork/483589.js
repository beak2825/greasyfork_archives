// ==UserScript==
// @name         复制标题和地址
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  一键复制标题和地址为Markdown格式并带上当前时间（myFirstScript）
// @author       LiarCoder
// @match        *://*/*
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4jY3TO0tcURQF4G/ixFdhCIg2qWysZPwDsUkXSJk2Qso0IpLOTtLERkGwEjQhXV5d0gkGK6v7E/IHgg9EHR0nHLLvzGHujGbB5pzLOXvttfc6twaNRiMta1g1GG28xJfyRlEU6rF/FskpjvA4o7nABD7gM17hY3lYEjzHOd4NqP8QW3gURA+wJzYJI2hV0rq4xtfsexdPcwW3EQmLaSw4wVCQr+M1DtDEJt7iVz1jLRUsB0GOn9iPymWRJ7mChOFY5ysNVFHrHaKwKWEGUyG1HZcnMY4/0UarH0Ez1u+Yq9T8h5tw5BTTg1p4EYfNnuR6WC3srCgo+/odcRdK+7ubrGIRvfeLq7hz3KsgESXPE97HDFKfOUazxLFegst4MAmf7pGfkP6NNNAOwTesYAM/YkgdrzOcYRYLeJMTHMbTTE926T8U7GAb/gI+kkP5n3CsvwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/483589/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/483589/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 创建DOM元素
   * @param {string} eleName - 元素标签名
   * @param {string} text - 元素的文本内容
   * @param {Object} attrs - 元素的属性键值对
   * @returns {HTMLElement} 创建的DOM元素
   */
  function createEle(eleName, text, attrs) {
    const ele = document.createElement(eleName);
    ele.innerText = text;
    for (const k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  // 添加提示框样式
  const btnStyle = `
    #copy-title-and-location {
      position: fixed;
      top: 100px;
      left: -95px;
      opacity: 0.3;
      z-index: 2147483647;
      background-image: none;
      cursor: pointer;
      color: #fff;
      background-color: #0084ff !important;
      margin: 5px 0px;
      width: auto;
      border-radius: 3px;
      border: #0084ff;
      outline: none;
      padding: 3px 6px;
      height: 26px;
      font-family: Arial, sans-serif;
      font-size: 12px;
      transition: left, 0.5s;
    }

    #copy-title-and-location:hover {
      left: 0px;
      opacity: 1;
    }

    #copy-title-and-location svg {
      width: auto;
      vertical-align: middle;
      margin-left: 10px;
      border-style: none;
      text-align: center;
      display: inline-block !important;
      margin-bottom: 2px;
    }
  `;

  // 将按钮图标由原来的img改为了svg，以增强适应性，同时也将对svg的样式设置移到了上面的 btnStyle 中
  const iconSVG =
    '<?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M8 6C8 4.89543 8.89543 4 10 4H30L40 14V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M16 20H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 28H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const btn = createEle("button", "", { id: "copy-title-and-location" });
  btn.innerHTML = "复制标题和地址" + iconSVG;

  const date = new Date();
  const timeStamp = `更新：${date
    .toLocaleDateString()
    .replace("/", "年")
    .replace("/", "月")}日${date.toLocaleTimeString("chinese", {
    hour12: false,
  })}`;

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本内容
   */
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("尝试使用备用复制方法：" + err);
      try {
        // 创建临时textarea元素用于复制
        const textarea = document.createElement("textarea");
        textarea.style.cssText = 'position:fixed;top:-999px;left:-999px;';
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.error("复制失败：", err);
      }
    }
  };

  /**
   * 获取当前页面的引用地址
   * @param {boolean} hasQuote - 是否添加引用符号(>)
   * @returns {string} 格式化后的引用地址
   */
  const getAddress = (hasQuote = true) => {
    const titleInfo = document.title;
    let address = `参考：[${titleInfo}](${location})`;
    
    // 针对不同网站的特殊处理规则
    const siteHandlers = {
      'mp.weixin.qq.com': () => {
        const officialAccount = document.getElementById("js_name");
        const publishDate = document.getElementById("publish_time");
        if (officialAccount && publishDate) {
          publishDate.click();
          return `参考：[【微信公众号：${officialAccount.innerText}${publishDate.innerText}】${titleInfo}](${location})`;
        }
        return address;
      }
      // 可在此处添加其他网站的特殊处理规则
    };

    const domain = location.hostname;
    for (const site in siteHandlers) {
      if (domain.includes(site)) {
        address = siteHandlers[site]();
        break;
      }
    }
    
    return hasQuote ? `\n> ${address}` : address;
  };

  // 注册按钮事件
  btn.addEventListener("click", async (e) => {
    await copyToClipboard(timeStamp + getAddress());
  });

  btn.addEventListener("contextmenu", async (e) => {
    e.preventDefault();
    await copyToClipboard(getAddress(false));
  });

  // document.body.appendChild(style); // 这种写法会导致脚本在<iframe>标签的html文档的body标签也被选中
  // self === top 是用来判断当前页面是否是在<iframe>标签内，如果为true则表示不<iframe>标签内
  if (window.self === window.top) {
    if (document.querySelector('body')) {
      document.body.appendChild(btn);
      GM_addStyle(btnStyle);
    } else {
      document.documentElement.appendChild(btn);
      GM_addStyle(btnStyle);
    }
  }
})();