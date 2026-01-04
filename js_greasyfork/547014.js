// ==UserScript==
// @name         搜索引擎切换工具
// @namespace    https://greasyfork.org/zh-CN/users/1143571-xuanyue1024
// @version      0.1.34
// @description  能在搜索引擎左侧显示一个快速切换列表的油猴脚本，节省「另开搜索引擎」和「输入关键词」的动作和时间，提高搜索效率。对挡住搜索内容的网站,比如哔哩哔哩和博客园,默认隐藏搜索切换,鼠标放到左侧屏幕边界即可正常展示.在原作者基础上修改了部分内容，[原链接](https://greasyfork.org/zh-CN/scripts/440235)
// @author       竹林听雨, rockucn

// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://duckduckgo.com/*
// @match        *://search.brave.com/search*
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://weixin.sogou.com/weixin*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.zhihu.com/search*
// @match        *://search.cnki.com.cn/Search/Result*
// @match        *://www.sogou.com/web*
// @match        *://linux.do/search*
// @match        *://github.com/search*
// @match        *://stackoverflow.com/search*
// @match        *://search.bilibili.com/all*
// @match        *://zzkx.cnblogs.com/s*

// @grant        unsafeWindow
// @grant        window.onload
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/547014/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/547014/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 搜索网址配置
const urlMapping = [
  {
    name: "Bing (CN)",
    searchUrl: "https://cn.bing.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/cn\.bing\.com\/search.*/,
    hidden: false, // 设置为 true 则默认隐藏
  },
  {
    name: "Google",
    searchUrl: "https://www.google.com/search?q=",
    keyName: "q",
    testUrl: /^https:\/\/(?:www\.)?google\.[a-z.]+\/search/i,
    hidden: false,
  },
  {
    name: "GitHub 仓库",
    searchUrl: "https://github.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/github.com\/search.*/,
    hidden: true,
  },
  {
    name: "DuckDuckGo",
    searchUrl: "https://duckduckgo.com/?q=",
    keyName: "q",
    testUrl: /https:\/\/duckduckgo.com\/*/,
  },
  {
    name: "Bing",
    searchUrl: "https://www.bing.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.bing.com\/search.*/,
  },
  {
    name: "Brave",
    searchUrl: "https://search.brave.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/search.brave.com\/search.*/,
  },
  {
    name: "百度",
    searchUrl: "https://www.baidu.com/s?wd=",
    keyName: "wd",
    testUrl: /https:\/\/www.baidu.com\/s.*/,
  },
  {
    name: "搜狗",
    searchUrl: "https://www.sogou.com/web?query=",
    keyName: "query",
    testUrl: /https:\/\/www.sogou.com\/web.*/,
  },
  {
    name: "哔哩哔哩",
    searchUrl: "https://search.bilibili.com/all?keyword=",
    keyName: "keyword",
    testUrl: /https:\/\/search.bilibili.com\/all.*/,
    hidden: true,
  },
  {
    name: "微信文章",
    searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query=",
    keyName: "query",
    testUrl: /https:\/\/weixin.sogou.com\/weixin.*/,
  },
  {
    name: "知乎",
    searchUrl: "https://www.zhihu.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.zhihu.com\/search.*/,
  },
  {
    name: "博客园",
    searchUrl: "https://zzkx.cnblogs.com/s?w=",
    keyName: "w",
    testUrl: /https:\/\/zzkx.cnblogs.com\/s.*/,
    hidden: true
  },
  {
    name: "linux do",
    searchUrl: "https://linux.do/search?q=",
    keyName: "q",
    testUrl: /https:\/\/linux.do\/search.*/,
  },
  {
    name: "知网",
    searchUrl: "https://search.cnki.com.cn/Search/Result?content=",
    keyName: "content",
    testUrl: /https:\/\/search.cnki.com.cn\/Search\/Result.*/,
  },
  {
    name: "Stack Overflow",
    searchUrl: "https://stackoverflow.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/stackoverflow.com\/search.*/,
  },
];

// JS获取url参数
function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let pairs = query.split("&");
  for (let pair of pairs) {
    let [key, value] = pair.split("=");
    if (key == variable) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

// 从url中获取搜索关键词
function getKeywords() {
  let keywords = "";
  for (let item of urlMapping) {
    if (item.testUrl.test(window.location.href)) {
      keywords = getQueryVariable(item.keyName);
      break;
    }
  }
  console.log(keywords);
  return keywords;
}

// 适配火狐浏览器的百度搜索
const isFirefox = () => {
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    console.warn("[ Firefox ] 🚀");
    urlMapping[0].searchUrl = "https://www.baidu.com/baidu?wd=";
    urlMapping[0].testUrl = /https:\/\/www.baidu.com\/baidu.*/;
  } else {
    return;
  }
};

// 检查是否为暗色模式
function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// 获取主题颜色
function getThemeColors() {
  const dark = isDarkMode();
  return {
    background: dark ? 'hsla(220, 15%, 20%, .9)' : 'hsla(200, 40%, 96%, .8)',
    text: dark ? 'hsla(210, 20%, 85%, .9)' : 'hsla(211, 60%, 35%, .8)',
    hover: dark ? 'hsla(220, 15%, 30%, .9)' : 'hsla(211, 60%, 35%, .1)'
  };
}

// 检查当前页面是否需要隐藏面板
function shouldHidePanel() {
  for (let item of urlMapping) {
    if (item.testUrl.test(window.location.href)) {
      return item.hidden === true;
    }
  }
  return false;
}

// 添加节点
function addBox() {
  isFirefox();

  const isHidden = shouldHidePanel();
  const colors = getThemeColors();

  // 主元素
  const div = document.createElement("div");
  div.id = "search-app-box";
  const baseStyle = `
    position: fixed; 
    top: 140px; 
    left: ${isHidden ? '-88px' : '12px'}; 
    width: 88px; 
    background-color: ${colors.background}; 
    font-size: 12px; 
    border-radius: 6px; 
    z-index: 99999;
    transition: left 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);`;
  div.style = baseStyle;
  document.body.insertAdjacentElement("afterbegin", div);

  // 如果需要隐藏,添加触发区域和悬停逻辑
  if (isHidden) {
    // 创建触发区域
    const trigger = document.createElement("div");
    trigger.style = `
      position: fixed;
      top: 140px;
      left: 0;
      width: 10px;
      height: 300px;
      z-index: 99998;`;
    document.body.insertAdjacentElement("afterbegin", trigger);

    // 鼠标移入触发区域或面板时显示
    const showPanel = () => {
      div.style.left = '12px';
    };

    // 鼠标移出时隐藏
    const hidePanel = () => {
      div.style.left = '-88px';
    };

    trigger.onmouseenter = showPanel;
    div.onmouseenter = showPanel;
    div.onmouseleave = hidePanel;
  }

  // 标题
  let title = document.createElement("span");
  title.innerText = "搜索引擎";
  title.style = `
    display: block;
	color: ${colors.text};
    text-align: center;
    margin-top: 10px; 
    margin-bottom: 5px;
    font-size: 12px;
    font-weight: bold;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;`;
  div.appendChild(title);

  // 搜索列表
  for (let index in urlMapping) {
    let item = urlMapping[index];

    // 列表样式
    let style = `
        display: block; 
		color: ${colors.text} !important;
        padding: 8px; 
        text-decoration: none;`;
    let defaultStyle = style;
    let hoverStyle =
        style + `background-color: ${colors.hover};`;

    // 设置搜索引擎链接
    let a = document.createElement("a");
    a.innerText = item.name;
    a.style = defaultStyle;
    a.className = "search-engine-a";
    a.href = item.searchUrl + getKeywords();

    // 鼠标移入&移出效果，相当于hover
    a.onmouseenter = function () {
      this.style = hoverStyle;
    };
    a.onmouseleave = function () {
      this.style = defaultStyle;
    };
    div.appendChild(a);
  }

  // 监听系统主题变化,自动更新颜色
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(() => {
      location.reload(); // 简单方式:刷新页面
    });
  }
}

(function () {
  "use strict";
  window.onload = addBox();
})();