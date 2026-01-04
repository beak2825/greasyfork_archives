// ==UserScript==
// @name         Search Engine Switcher (Jerry Modified)
// @namespace    https://greasyfork.org/en/users/28298
// @version      0.1.36
// @description  More transparent and working better on both dark and light mode; added stackoverflow, devdocs etc; modified from https://greasyfork.org/en/scripts/446492
// @homepage     https://greasyfork.org/en/scripts/456231
// @author       https://greasyfork.org/en/users/28298

// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/baidu*
// @match        *://duckduckgo.com/*
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://scholar.google.com/*
// @match        *://translate.google.com/*
// // @match        *://www.youtube.com/*
// // @match        *://www.google.com/maps*
// @match        *://weixin.sogou.com/weixin*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.zhihu.com/search*
// @match        *://devdocs.io/*
// @match        *://stackoverflow.com/*
// @match        *://search.luxirty.com/*

// @grant        unsafeWindow
// @grant        window.onload
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body

// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/456231/Search%20Engine%20Switcher%20%28Jerry%20Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456231/Search%20Engine%20Switcher%20%28Jerry%20Modified%29.meta.js
// ==/UserScript==




// modified from https://greasyfork.org/en/scripts/446492
// 搜索网址配置 (* not show, i.e., 1 way)
const urlMapping = [
  {
    name: "Google",
    searchUrl: "https://www.google.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.google.com\/search.*/,
  },
  {
    name: "GImages",
    searchUrl: "https://www.google.com/search?tbm=isch&q=",
    keyName: "q",
    testUrl: /https:\/\/www.google.com\/search.*/,
  },
  {
    name: "Youtube",
    searchUrl: "https://www.youtube.com/results?search_query=",
    keyName: "search_query",
    testUrl: /https:\/\/www.youtube.com\/results.*/,
  },
  {
    name: "GScholars",
    searchUrl: "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C14&oq=&q=",
    keyName: "q",
    testUrl: /https:\/\/scholar.google.com\/scholar.*/,
  },
  {
    name: "GMaps",
    searchUrl: "https://maps.google.com/maps?q=",
    keyName: "q",
    testUrl: /https:\/\/maps.google.com\/maps.*/,
  },
//  {
//    name: "GTranslate",
//    searchUrl: "https://translate.google.com/?sl=auto&tl=en&op=translate&text=",
//    keyName: "text",
//    testUrl: /https:\/\/translate.google.com\/*/,
//  },
  {
    name: "Luxirty",
    searchUrl: "https://search.luxirty.com/search?q=",
    keyName: "text",
    testUrl: /https:\/\/search.luxirty.com\/search.*/,
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
    name: "Baidu",
    searchUrl: "https://www.baidu.com/s?wd=",
    keyName: "wd",
    testUrl: /https:\/\/www.baidu.com\/s.*/,
  },
  {
    name: "Wechat",
    searchUrl: "https://weixin.sogou.com/weixin?type=2&s_from=input&query=",
    keyName: "query",
    testUrl: /https:\/\/weixin.sogou.com\/weixin.*/,
  },
  {
    name: "Zhihu",
    searchUrl: "https://www.zhihu.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/www.zhihu.com\/search.*/,
  },
  {
    name: "StackOverflow",
    searchUrl: "https://stackoverflow.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/stackoverflow.com\/search.*/,
  },
  {
    name: "DevDocs",
    searchUrl: "https://devdocs.io/#q=",
    keyName: "q",
    testUrl: /https:\/\/devdocs.io\/*/,
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
    if (window.location.href.startsWith("https://www.google.com/maps")) {
      // jerry: fix google maps
      keywords = decodeURIComponent(window.location.href.split('/')[5]);
      break;
    } else if (window.location.href.startsWith("https://devdocs.io")) {
      // jerry: fix
      let myarray = window.location.href.split('/');
      keywords = decodeURIComponent(myarray[myarray.length-1]);
      break;
    } else if (window.location.href.startsWith("https://search.luxirty.com")) {
      // jerry: fix
      keywords = decodeURIComponent(window.location.href.split('/')[3].split('q=')[1].split('#')[0]);
      break;
    } else {
      if (item.testUrl.test(window.location.href)) {
        keywords = getQueryVariable(item.keyName);
        break;
      }
    }
  }
  console.log(keywords);
  return keywords;
}

// 适配火狐浏览器的百度搜索
const isFirefox = () => {
  if (navigator.userAgent.indexOf("Firefox") > 0) {
    console.warn("[ Firefox ] 🚀");
    for (var i = 0; i < urlMapping.length; i++) {
      if (urlMapping[i]['name']=='Baidu') {
        break;
      }
    }
    urlMapping[i].searchUrl = "https://www.baidu.com/baidu?wd=";
    urlMapping[i].testUrl = /https:\/\/www.baidu.com\/baidu.*/;
  } else {
    return;
  }
};

// 适配cn.bing.com的必应域名
const cnBing = {
    name: "Bing",
    searchUrl: "https://cn.bing.com/search?q=",
    keyName: "q",
    testUrl: /https:\/\/cn.bing.com\/search.*/,
};

// 匹配到cn.bing就修改必应配置对象
if(window.location.hostname === 'cn.bing.com'){
  for(let item of urlMapping){
    if(item.name === "Bing"){
      item = cnBing
    }
  }
}

// 添加节点
function addBox() {
  isFirefox();
  // 主元素
  // original: background-color: hsla(200, 40%, 96%, .8);
  // word-break: normal; !important; for sogou
  const div = document.createElement("div");
  div.id = "search-app-box";
  var divstyle = `
    position: relative;
    display: flex;
    width: 100px;
    margin-bottom: 0px;
    word-break: normal;
    font-size: 13px;
    z-index: 99999;`;
  // console.log(divstyle)
  if (location.hostname=="duckduckgo.com") {
    divstyle += "top: 115px; left: 150px;";
  } else if (location.hostname=="www.bing.com") {
    divstyle += "top: 130px; left: 165px;";
  } else if (location.hostname=="www.google.com") {
    divstyle += "top: 150px; left: 210px;";
  } else if (location.hostname=="search.luxirty.com") {
    divstyle += "top: -840px; left: 210px;";
  } else {
    divstyle += "top: 1px; left: 150px;";
  }
  // console.log(divstyle)
  div.style = divstyle;
  document.body.insertAdjacentElement("afterbegin", div);

  // 搜索列表
  for (let index in urlMapping) {
    let item = urlMapping[index];

    // 列表样式
    let style = `
        font-weight: bold;
        color: #FFFFFF; background-color: #b60002; box-shadow:0 2px 5px 0 #888;
        margin: 0; padding-top: 0px; padding-bottom: 0px; padding-left: 8px; padding-right: 8px;
        text-decoration: none;`;
    // jerry: color: hsla(211, 20%, 64%, .4) lighter fonts
    // background-color: hsla(211, 20%, 64%, 0.1); color: hsla(211, 100%, 100%, .8)
    let defaultStyle = style + "!important;";
    let hoverStyle =
      style + "color:#91C5EE; box-shadow:0 3px 3px 0 #888; !important;";

    // 设置搜索引擎链接
    let a = document.createElement("a");
    a.innerText = item.name;
    if (index==0) {
      a.style = defaultStyle + "border-top-left-radius: 5px; border-bottom-left-radius: 5px";
      a.onmouseenter = function () {
        this.style = hoverStyle +"border-top-left-radius: 5px; border-bottom-left-radius: 5px";
      };
      a.onmouseleave = function () {
        this.style = defaultStyle + "border-top-left-radius: 5px; border-bottom-left-radius: 5px";
      };
    } else if (index==(urlMapping.length-1)) {
      a.style = defaultStyle + "border-top-right-radius: 5px; border-bottom-right-radius: 5px";
      a.onmouseenter = function () {
        this.style = hoverStyle +"border-top-right-radius: 5px; border-bottom-right-radius: 5px";
      };
      a.onmouseleave = function () {
        this.style = defaultStyle + "border-top-right-radius: 5px; border-bottom-right-radius: 5px";
      };
    } else {
      a.style = defaultStyle;
      // 鼠标移入&移出效果，相当于hover
      a.onmouseenter = function () {
        this.style = hoverStyle;
      };
      a.onmouseleave = function () {
        this.style = defaultStyle;
      };
    }
    a.className = "search-engine-a";
    a.href = item.searchUrl + getKeywords();

    div.appendChild(a);
  }
}

(function () {
  "use strict";
  window.onload = addBox();
})();
