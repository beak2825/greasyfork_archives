// ==UserScript==
// 脚本名称
// @name         复制标题和地址（myFirstScript）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一键复制标题和地址为Markdown格式并带上当前时间（myFirstScript）
// @author       LiarCoder
// 在哪些页面生效, 支持通配符
// @match        *://*/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABTklEQVQ4jY3TO0tcURQF4G/ixFdhCIg2qWysZPwDsUkXSJk2Qso0IpLOTtLERkGwEjQhXV5d0gkGK6v7E/IHgg9EHR0nHLLvzGHujGbB5pzLOXvttfc6twaNRiMta1g1GG28xJfyRlEU6rF/FskpjvA4o7nABD7gM17hY3lYEjzHOd4NqP8QW3gURA+wJzYJI2hV0rq4xtfsexdPcwW3EQmLaSw4wVCQr+M1DtDEJt7iVz1jLRUsB0GOn9iPymWRJ7mChOFY5ysNVFHrHaKwKWEGUyG1HZcnMY4/0UarH0Ez1u+Yq9T8h5tw5BTTg1p4EYfNnuR6WC3srCgo+/odcRdK+7ubrGIRvfeLq7hz3KsgESXPE97HDFKfOUazxLFegst4MAmf7pGfkP6NNNAOwTesYAM/YkgdrzOcYRYLeJMTHMbTTE926T8U7GAb/gI+kkP5n3CsvwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/463174/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80%EF%BC%88myFirstScript%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/463174/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98%E5%92%8C%E5%9C%B0%E5%9D%80%EF%BC%88myFirstScript%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use msgict';

  // 该函数用于创建一个<eleName k="attrs[k]">text</eleName>样式的页面元素
  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    // innerText 也就是 <p>text会被添加到这里</p>
    ele.innerText = text;
    // attrs 的类型是一个 map
    for (let k in attrs) {
      // 遍历 attrs, 给节点 ele 添加我们想要的属性
      ele.setAttribute(k, attrs[k]);
    }
    // 返回节点
    return ele;
  }

  /**
   * 复制链接至剪贴板
   *
   * @param text
   */
  const copyToClipboard = (text) => {
    // 【更新：2021年9月12日22:48:36】添加了一个try catch来应对当前页面不能访问 navigator.clipboard 对象的问题
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("当前页面不支持访问 navigator.clipboard 对象：" + err);
      if (text && text.length) {
        const textarea = document.createElement("textarea");
        textarea.style.background = "transparent";
        textarea.style.color = "transparent";
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    }
  };

  let btnStyle = `
  #copy-title-and-location {
    position: fixed; top: 100px; left: -95px; opacity: 0.3; z-index: 2147483647; 
    background-image: none; cursor:pointer; color: #fff; background-color: #0084ff !important; 
    margin: 5px 0px; width: auto; border-radius: 3px; border: #0084ff; outline: none; padding: 3px 6px; height: 26px;
    font-family: Arial, sans-serif; font-size: 12px; transition: left, 0.5s;
    }
  #copy-title-and-location:hover {left: 0px; opacity: 1;}
  #copy-title-and-location svg {width: auto; vertical-align: middle; margin-left: 10px; border-style: none;text-align: center;display: inline-block !important;margin-bottom: 2px;}`;
  let styleTag = createEle("style", btnStyle, { type: "text/css" });

  // 将按钮图标由原来的img改为了svg，以增强适应性，同时也将对svg的样式设置移到了上面的 btnStyle 中
  let iconSVG =
    '<?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M8 6C8 4.89543 8.89543 4 10 4H30L40 14V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M16 20H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 28H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let btn = createEle("button", "", { id: "copy-title-and-location" });
  btn.innerHTML = "复制标题和地址" + iconSVG;

  const date = new Date();
  const timeStamp = `更新：${date
    .toLocaleDateString()
    .replace("/", "年")
    .replace("/", "月")}日${date.toLocaleTimeString("chinese", {
    hour12: false,
  })}`;
  const titleInfo = document.querySelector("title").innerText;
  const getAddress = (hasQuote = true) => {
    let address = `参考：[${titleInfo}](${location})`;
    // 匹配微信公众号的文章地址
    let regWeChat = /https:\/\/mp.weixin.qq.com\//;
    if (regWeChat.test(location.toString())) {
      let officialAccount = document.getElementById("js_name");
      let publishDate = document.getElementById("publish_time");
      publishDate.click();
      address = `参考：[【微信公众号：${officialAccount.innerText}${publishDate.innerText}】${titleInfo}](${location})`;
    }
    return hasQuote ? `\n> ${address}` : address;
  };

  btn.addEventListener("click", (e) => {
    copyToClipboard(timeStamp + getAddress());
  });

  btn.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    copyToClipboard(getAddress(false));
  });

  // document.body.appendChild(style); // 这种写法会导致脚本在<iframe>标签的html文档的body标签也被选中
  // self === top 是用来判断当前页面是否是在<iframe>标签内，如果为true则表示不<iframe>标签内
  if (window.self === window.top) {
    if (document.querySelector('body')) {
      document.body.appendChild(btn);
      document.body.appendChild(styleTag);
    } else {
      document.documentElement.appendChild(btn);
      document.documentElement.appendChild(styleTag);
    }
  }
})();