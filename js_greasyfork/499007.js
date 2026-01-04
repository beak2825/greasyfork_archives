// ==UserScript==
// @version      1.2.4
// @name         小红书/抖音排名统计
// @namespace    qinshaoyou
// @license      GNU GPLv3
// @description  小红书/抖音排名统计-油猴脚本 try to take over the world!
// @author       You
// @match        https://www.xiaohongshu.com/*
// @match        https://www.douyin.com/*
// @match        http://1.94.27.145:8111/*
// @match        https://www.baidu.com/*
// @match        https://www.taobao.com/*
// @grant        none
// @antifeature    referral-link 此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，实际使用无任何强制跳转，代码可查，请知悉。
// @downloadURL https://update.greasyfork.org/scripts/499007/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%8A%96%E9%9F%B3%E6%8E%92%E5%90%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/499007/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%8A%96%E9%9F%B3%E6%8E%92%E5%90%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Your code here...
  let 公用缓存api地址 = "http://1.94.27.145:8111";
  let 小红书参数 = {
    输入框选择器: "#search-input",
    持续查找搜索结果Task: {},
    搜索推荐结果列表: false,
    搜索关键词首个Dom: false,
    搜索关键词首个: false,
    上一个关键词: false,
    requestData: {
      title1: false,
      title2: "",
      key: "xiao_hong_shu",
      sort: 0,
      list: "",
    },
  };
  let 抖音视频参数 = {
    输入框选择器: 'input[placeholder="搜索你感兴趣的内容"]',
    持续查找搜索结果Task: {},
    搜索推荐结果列表: false,
    搜索关键词首个Dom: false,
    搜索关键词首个: false,
    上一个关键词: false,
    requestData: {
      title1: false,
      title2: "",
      key: "dyshipin",
      sort: 0,
      list: "",
    },
  };
  let 抖音参数 = {
    输入框选择器: 'input[placeholder="搜索你感兴趣的内容"]',
    持续查找搜索结果Task: {},
    搜索推荐结果列表: false,
    搜索关键词首个Dom: false,
    搜索关键词首个: false,
    上一个关键词: false,
    requestData: {
      title1: false,
      title2: "",
      key: "douyin",
      sort: 0,
      list: "",
    },
  };
  let 百度参数 = {
    输入框选择器: "#kw",
    持续查找搜索结果Task: {},
    搜索推荐结果列表: false,
    搜索关键词首个Dom: false,
    搜索关键词首个: false,
    上一个关键词: false,
    requestData: {
      title1: false,
      title2: "",
      key: "baidu",
      sort: 0,
      list: "",
    },
  };
  let 淘宝参数 = {
    输入框选择器: "#q",
    持续查找搜索结果Task: {},
    搜索推荐结果列表: false,
    搜索关键词首个Dom: false,
    搜索关键词首个: false,
    上一个关键词: false,
    requestData: {
      title1: false,
      title2: "",
      key: "taobao",
      sort: 0,
      list: "",
    },
  };
  window.onload = function () {
    let 地址 = location.href;
    if (地址.indexOf("xiaohongshu.com") > -1) {
      小红书fun();
    } else if (地址.indexOf(公用缓存api地址) > -1) {
      setTimeout(() => {
        // window.close()
      }, 10 * 1000);
    } else if (
      地址.indexOf("https://www.douyin.com/user/self?showTab=like") > -1
    ) {
      抖音fun();
    } else if (地址.indexOf("baidu.com") > -1) {
      百度fun();
    } else if (地址.indexOf("taobao.com") > -1) {
      淘宝fun();
    } else if (地址.indexOf("https://www.douyin.com/search") > -1) {
      抖音视频fun();
    }
  };
  function 百度fun() {
    百度参数.搜索关键词首个Dom = document.querySelector(百度参数.输入框选择器);
    if (百度参数.搜索关键词首个Dom) {
      百度参数.搜索关键词首个Dom.addEventListener("input", function (e) {
        百度参数.搜索关键词首个 = e.target.value;
        if (百度参数.搜索关键词首个) {
          setTimeout(() => {
            监听搜索结果任务_百度();
          }, 1000);
        }
      });
    }
  }

  function 监听搜索结果任务_百度() {
    百度参数.搜索推荐结果列表 = document.querySelectorAll(
      "#normalSugSearchUl li"
    );
    if (百度参数.搜索推荐结果列表 && 百度参数.搜索关键词首个) {
      clearTimeout(百度参数.持续查找搜索结果Task);
      百度参数.requestData.title1 = 百度参数.搜索关键词首个;
      百度参数.requestData.list = "";
      document.querySelector(百度参数.输入框选择器).value = "";

      百度参数.搜索推荐结果列表.forEach((container) => {
        // 获取容器及其子元素的所有文本内容
        let texts = container.innerText;
        百度参数.requestData.list += texts + "\n";
      });

      const params = new URLSearchParams(百度参数.requestData);
      // 转换为字符串
      const queryString = params.toString();
      百度参数.搜索关键词首个Dom.value = 0;
      let requestURLGET =
        公用缓存api地址 + "/api/tools/index/setCache?" + queryString;
      window.open(requestURLGET);
    } else {
      百度参数.持续查找搜索结果Task = setTimeout(() => {
        监听搜索结果任务_百度();
      }, 1000);
    }
  }

  function 淘宝fun() {
    持续查找搜索结果Fun_淘宝();
  }
  function 持续查找搜索结果Fun_淘宝() {
    淘宝参数.搜索关键词首个Dom = document.querySelector(淘宝参数.输入框选择器);
    if (淘宝参数.搜索关键词首个Dom) {
      淘宝参数.搜索关键词首个Dom.addEventListener("input", function (e) {
        淘宝参数.搜索关键词首个 = e.target.value;
        if (淘宝参数.搜索关键词首个) {
          setTimeout(() => {
            监听搜索结果任务_淘宝();
          }, 1000);
        }
      });
    }
  }

  function 监听搜索结果任务_淘宝() {
    淘宝参数.搜索推荐结果列表 = document.querySelectorAll(
      ".search-suggest-popup .search-suggest-menu .search-suggest-menu-item"
    );
    if (淘宝参数.搜索推荐结果列表 && 淘宝参数.搜索关键词首个) {
      clearTimeout(淘宝参数.持续查找搜索结果Task);
      淘宝参数.requestData.title1 = 淘宝参数.搜索关键词首个;
      淘宝参数.requestData.list = "";
      document.querySelector(淘宝参数.输入框选择器).value = "";

      淘宝参数.搜索推荐结果列表.forEach((container) => {
        // 获取容器及其子元素的所有文本内容
        let texts = container.innerText;
        淘宝参数.requestData.list += texts + "\n";
      });

      const params = new URLSearchParams(淘宝参数.requestData);
      // 转换为字符串
      const queryString = params.toString();
      淘宝参数.搜索关键词首个Dom.value = 0;
      let requestURLGET =
        公用缓存api地址 + "/api/tools/index/setCache?" + queryString;
      window.open(requestURLGET);
    } else {
      淘宝参数.持续查找搜索结果Task = setTimeout(() => {
        监听搜索结果任务_淘宝();
      }, 1000);
    }
  }

  function 抖音fun() {
    抖音参数.搜索关键词首个Dom = document.querySelector(抖音参数.输入框选择器);
    if (抖音参数.搜索关键词首个Dom) {
      抖音参数.搜索关键词首个Dom.addEventListener("input", function (e) {
        抖音参数.搜索关键词首个 = e.target.value;
        if (抖音参数.搜索关键词首个) {
          setTimeout(() => {
            监听搜索结果任务_抖音();
          }, 1000);
        }
      });
    }
  }

  function 监听搜索结果任务_抖音() {
    let inputElement = document.querySelector(抖音参数.输入框选择器);
    // 通过 input 元素找到上一级父元素 div
    let parentDiv = inputElement.parentElement;

    // 找到父元素的下一个兄弟元素
    let nextSiblingDiv = parentDiv.nextElementSibling;

    // 找到下一个兄弟元素的下一个兄弟元素
    抖音参数.搜索推荐结果列表 = nextSiblingDiv.nextElementSibling;
    if (抖音参数.搜索推荐结果列表 && 抖音参数.搜索关键词首个) {
      clearTimeout(抖音参数.持续查找搜索结果Task);
      抖音参数.requestData.title1 = 抖音参数.搜索关键词首个;
      抖音参数.requestData.list = "";
      document.querySelector(抖音参数.输入框选择器).value = "";
      抖音参数.requestData.list = 抖音参数.搜索推荐结果列表.innerText;
      const params = new URLSearchParams(抖音参数.requestData);
      // 转换为字符串
      const queryString = params.toString();
      抖音参数.搜索关键词首个Dom.value = 0;
      let requestURLGET =
        公用缓存api地址 + "/api/tools/index/setCache?" + queryString;
      window.open(requestURLGET);
    } else {
      抖音参数.持续查找搜索结果Task = setTimeout(() => {
        监听搜索结果任务_抖音();
      }, 1000);
    }
  }
  function 抖音视频fun() {
    抖音视频参数.搜索关键词首个Dom = document.querySelector(
      抖音视频参数.输入框选择器
    );
    if (抖音视频参数.搜索关键词首个Dom) {
      抖音视频参数.搜索关键词首个Dom.addEventListener("keydown", function (event) {
        console.log(event)
        if (event.key === "Enter" || event.keyCode === 13) {
          setTimeout(() => {
            监听搜索结果任务_抖音视频();
          }, 1000);
        }
      });
    }
  }

  function 监听搜索结果任务_抖音视频() {
    let inputElement = document.querySelector(抖音视频参数.输入框选择器);
    let searchText = location.href.substring(
      location.href.indexOf("search/") + "search/".length,
      location.href.indexOf("?")
    );
    抖音视频参数.搜索关键词首个 = decodeURIComponent(searchText);
    // 获取所有span元素
    const spans = document.querySelectorAll("span");
    let results = [];

    spans.forEach((span) => {
      if (span.textContent.trim() === "@") {
        // 获取相邻的 span 元素的内容
        const adjacentSpanContent = span.nextElementSibling
          ? span.nextElementSibling.textContent.trim()
          : "";

        // 获取 span 的上一级 span 的上一级 div
        const grandParentDiv =
          span.parentElement && span.parentElement.parentElement
            ? span.parentElement.parentElement
            : null;
        if (grandParentDiv) {
          // 获取 grandParentDiv 的相邻 div 元素的内容
          const adjacentDivContent = grandParentDiv.previousElementSibling
            ? grandParentDiv.previousElementSibling.textContent.trim()
            : "";

          // 组成对象
          const obj = {
            zuozhe_name: adjacentSpanContent,
            title: adjacentDivContent,
          };

          // 插入数组
          results.push(obj);
        }
      }
    });
    // 打印数组
    抖音视频参数.搜索推荐结果列表 = results;
    if (抖音视频参数.搜索推荐结果列表.length && 抖音视频参数.搜索关键词首个) {
      clearTimeout(抖音视频参数.持续查找搜索结果Task);
      抖音视频参数.requestData.title1 = 抖音视频参数.搜索关键词首个;
      抖音视频参数.requestData.list = "";
      document.querySelector(抖音视频参数.输入框选择器).value = "";
      抖音视频参数.搜索推荐结果列表.forEach((element) => {
        抖音视频参数.requestData.list +=
          "@" + element.zuozhe_name + " : " + element.title + "\n";
      });
      const params = new URLSearchParams(抖音视频参数.requestData);
      // 转换为字符串
      const queryString = params.toString();
      抖音视频参数.搜索关键词首个Dom.value = 0;
      let requestURLGET =
        公用缓存api地址 + "/api/tools/index/setCache?" + queryString;
      window.open(requestURLGET);
    } else {
      抖音视频参数.持续查找搜索结果Task = setTimeout(() => {
        监听搜索结果任务_抖音视频();
      }, 1000);
    }
  }

  function 小红书fun() {
    小红书参数.搜索关键词首个Dom = document.querySelector(
      小红书参数.输入框选择器
    );
    if (小红书参数.搜索关键词首个Dom) {
      小红书参数.搜索关键词首个Dom.addEventListener("input", function (e) {
        小红书参数.搜索关键词首个 = e.target.value;
        if (小红书参数.搜索关键词首个) {
          setTimeout(() => {
            监听搜索结果任务();
          }, 1000);
        }
      });
    }
  }

  function 监听搜索结果任务() {
    小红书参数.搜索推荐结果列表 = document.querySelectorAll(
      ".sug-container-wrapper"
    );
    if (
      小红书参数.搜索推荐结果列表 &&
      小红书参数.搜索推荐结果列表.length > 0 &&
      小红书参数.搜索关键词首个
    ) {
      clearTimeout(小红书参数.持续查找搜索结果Task);

      小红书参数.requestData.title1 = 小红书参数.搜索关键词首个;
      小红书参数.requestData.list = "";

      document.querySelector(小红书参数.输入框选择器).value = "";
      小红书参数.搜索推荐结果列表.forEach((container) => {
        // 获取容器及其子元素的所有文本内容
        let texts = container.innerText;
        小红书参数.requestData.list += texts;
      });
      const params = new URLSearchParams(小红书参数.requestData);
      // 转换为字符串
      const queryString = params.toString();
      小红书参数.搜索关键词首个Dom.value = 0;
      let requestURLGET =
        公用缓存api地址 + "/api/tools/index/setCache?" + queryString;
      window.open(requestURLGET);
    } else {
      小红书参数.持续查找搜索结果Task = setTimeout(() => {
        监听搜索结果任务();
      }, 1000);
    }
  }
  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined"
      ? ""
      : context;
  }
  function TimestampToDate2(Timestamp) {
    let now = new Date(Timestamp),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();
    return (
      // y +
      // "-" +
      (m < 10 ? "0" + m : m) +
      "-" +
      (d < 10 ? "0" + d : d) +
      " " +
      now.toTimeString().substr(0, 5)
    );
  }
})();
