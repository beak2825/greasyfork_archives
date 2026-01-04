// ==UserScript==
// @name         多重搜索 - 自用
// @namespace    https://greasyfork.org/zh-CN/scripts/490643
// @version      1.3
// @description  用于快速切换搜索引擎。有漂亮的高斯模糊外观和深色模式适配。当您滚动网页时，侧栏会自动收起，而当鼠标靠近时，侧栏则会弹出。您可以修改脚本以添加或重新排序搜索引擎。
// @author       Corlius
// @homepageURL  https://github.com/Corlius/Corlius-Scripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
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
// @match        *://fsoufsou.com/search*
// @match        *://www.xiaohongshu.com/search_result/*
// @match        *://www.douyin.com/search/*
// @match        *://www.douban.com/search*
// @match        *://search.bilibili.com/*
// @match        *://www.youtube.com/results?search_query=*
// @license      MIT
// @grant        unsafeWindow
// @grant        window.onload
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/534887/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%20-%20%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534887/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%20-%20%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

// 搜索网址配置
const urlMapping = [
  {
    name: "百度",
    searchUrl: "https://www.baidu.com/s?wd=",
    keyName: "wd",
    testUrl: /https:\/\/www.baidu.com\/.*/,
  },
  {
    name: "Bing",
    searchUrl: "https://www.bing.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.bing.com\/search.*/,
  },
  {
    name: "Google",
    searchUrl: "https://www.google.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.google.com\/search.*/,
  },
  {
    name: "Brave",
    searchUrl: "https://search.brave.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/search.brave.com\/search.*/,
  },
  {
    name: "Duck",
    searchUrl: "https://duckduckgo.com/?q=",
    keyName: "q",
    testUrl: /https:\/\/duckduckgo.com\/*/,
  },
  {
    name: "哔哩哔哩",
    searchUrl: "https://search.bilibili.com/all?keyword=",
    keyName: "keyword",
    testUrl: /https:\/\/search.bilibili.com\/all.*/,
  },
  {
    name: "抖音",
    searchUrl: "https://www.douyin.com/search/",
    keyName: "",
    testUrl: /https:\/\/www.douyin.com\/search.*/,
  },

  {
    name: "小红书",
    searchUrl: "https://www.xiaohongshu.com/search_result?keyword=",
    keyName: "keyword",
    testUrl: /https:\/\/www.xiaohongshu.com\/search_result.*/,
  },
  {
    name: "微信",
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
];

// 根据参数名获取URL中的参数值
function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let varPair of vars) {
    let [key, value] = varPair.split("=");
    if (key === variable) {
      // 对提取出的参数值进行URI解码
      return decodeURI(decodeURIComponent(value));
    }
  }
  return null;
}

// 从当前URL中提取搜索关键词
function getKeywords() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const url = window.location.href;

  // 特殊处理抖音搜索关键词
  if (hostname === 'www.douyin.com' && pathname.startsWith('/search/')) {
    const keywordPattern = /^\/search\/([^?]+)/;
    const match = pathname.match(keywordPattern);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  for (let mapping of urlMapping) {
    if (mapping.name === "Baidu") {
      const params = new URL(url).searchParams;
      if (params.has('wd')) {
        return params.get('wd');
      } else if (url.includes('word=')) {
        let wd = url.match(/word=([^&]*)/)[1];
        return decodeURI(decodeURIComponent(wd));
      }
    } else if (mapping.testUrl.test(url)) {
      return getQueryVariable(mapping.keyName) || "";
    }
  }
  return "";
}

// 特定的配置修改
function adjustForSpecificBrowsers() {
  // 适配火狐浏览器的百度搜索
  if (navigator.userAgent.includes("Firefox")) {
    const baiduMapping = urlMapping.find(item => item.name === "Baidu");
    if (baiduMapping) {
      baiduMapping.searchUrl = "https://www.baidu.com/baidu?wd=";
      baiduMapping.testUrl = /https:\/\/www.baidu.com\/baidu.*/;
    }
  }

  // 适配必应搜索
  if (window.location.hostname === 'cn.bing.com') {
    const bingMapping = {
      name: "Bing",
      searchUrl: "https://cn.bing.com/search?q=",
      keyName: "q",
      testUrl: /https:\/\/cn.bing.com\/search.*/,
    };
    const bingIndex = urlMapping.findIndex(item => item.name === "Bing");
    if (bingIndex !== -1) {
      urlMapping[bingIndex] = bingMapping;
    }
  }
}

// 根据搜索关键词和配置给搜索链接设置样式和动作
function setupSearchLinks(keywords) {

  // 判断是否为暗色模式
  let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // 如果当前页面是DouYin，则设置为深色模式
  if (window.location.hostname === 'www.douyin.com') {
    isDarkMode = true; // 强制深色模式
  }

  // 在文档中添加主容器
  const mainDiv = document.createElement("div");
  mainDiv.id = "search-app-box";
  Object.assign(mainDiv.style, {
    position: "fixed",
    top: "150px",
    left: "0px", // 初始位置在左侧
    width: "85px",
    fontSize: "13px",
    fontFamily: "sans-serif",
    backgroundColor: isDarkMode ? 'hsla(0, 0%, 15%, .8)' : 'hsla(0, 0%, 98%, .8)',
    backdropFilter: "blur(30px)",
    webkitBackdropFilter: "blur(30px)",
    borderRadius: "0 15px 15px 0",
    zIndex: "9999",
    transition: "left 0.5s ease-in-out", // 左侧滑动动画
    cursor: "pointer",
    boxShadow: "0 8px 10px rgba(0,0,0,0.06)",
    overflow: "hidden",
  });

  document.body.appendChild(mainDiv);

  // 在搜索引擎链接前添加居中显示的标题"Engines"
  const enginesTitle = document.createElement('div');
  enginesTitle.textContent = "Engines";
  Object.assign(enginesTitle.style, {
    fontSize: "15px",
    fontWeight: "bold",
    padding: '6px 0 6px 15px',
    color: isDarkMode ? 'hsla(0, 0%, 80%, 1)' : 'hsla(0, 0%, 20%, 1)',
    backgroundColor: isDarkMode ? 'hsla(0, 0%, 10%, .8)' : 'hsla(0, 0%, 80%, .8)',
  });
  mainDiv.appendChild(enginesTitle);

  // 为每个搜索引擎创建链接
  urlMapping.forEach(({ name, searchUrl }) => {
    const link = document.createElement('a');
    link.textContent = name;
    link.href = `${searchUrl}${encodeURIComponent(keywords)}`;
    mainDiv.appendChild(link);

    // 设置链接样式
    Object.assign(link.style, {
      display: 'block',
      padding: '5px 0 5px 15px',
      textDecoration: 'none',
      color: isDarkMode ? 'hsla(0, 0%, 80%, 1)' : 'hsla(0, 0%, 40%, 1)',
    });

    // 添加鼠标放置在链接上时的背景色变化
    link.addEventListener('mouseenter', () => {
      link.style.backgroundColor = isDarkMode ? 'hsla(0, 0%, 30%, .8)' : 'hsla(0, 0%, 92%, .8)';
    });

    // 当鼠标离开链接时恢复背景色
    link.addEventListener('mouseleave', () => {
      link.style.backgroundColor = '';
    });
  });

  // 滚动时隐藏主容器
  window.addEventListener('scroll', () => {
    mainDiv.style.left = "-75px";
  });

  // 鼠标接近主容器时显示容器
  window.addEventListener("mousemove", function (event) {
    const rect = mainDiv.getBoundingClientRect();
    const dx = Math.abs(event.clientX - rect.right);
    const dy = Math.abs(event.clientY - ((rect.top + rect.bottom) / 2));
    var dxLimit = 130;
    if (window.location.hostname === 'www.bing.com') {
      dxLimit = 25;
    }
    if (dx < dxLimit && dy < 200) {
      mainDiv.style.left = "0";
    }
  });


}

// 页面加载完成后进行初始化
window.addEventListener("DOMContentLoaded", function () {
  adjustForSpecificBrowsers(); // 调整特定浏览器的配置
  setupSearchLinks(getKeywords()); // 设置搜索链接
});