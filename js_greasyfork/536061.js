// ==UserScript==
// @name         联通内网 - 纪检监察
// @namespace    http://unicom.studio/
// @version      2025-05-15
// @description  创新与灵感的交汇处
// @author       easterNday
// @match        http://aiportal.unicom.local/modules/subsite/jijianjiancha/*
// @icon         https://unicom.studio/Unicom.svg
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      data:application/javascript,window.LAYUI_GLOBAL=%7Bdir:'https://unpkg.com/layui@2.10.3/dist/'%7D
// @require      https://unpkg.com/layui@2.10.3/dist/layui.js
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536061/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91%20-%20%E7%BA%AA%E6%A3%80%E7%9B%91%E5%AF%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/536061/%E8%81%94%E9%80%9A%E5%86%85%E7%BD%91%20-%20%E7%BA%AA%E6%A3%80%E7%9B%91%E5%AF%9F.meta.js
// ==/UserScript==
(function () {
  "use strict";

  // 存储提取的请求头信息的全局变量
  const extractedHeaders = {
    pid: "",
    ut: "",
    wid: "",
  };

  // 拦截XMLHttpRequest
  function setupXHRInterceptor() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSetRequestHeader =
      XMLHttpRequest.prototype.setRequestHeader;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    // 存储请求头信息
    const requestHeaders = new Map();

    // 覆盖open方法
    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      // 存储URL以便后续在setRequestHeader中使用
      this._url = url;
      return originalXHROpen.apply(this, arguments);
    };

    // 覆盖setRequestHeader方法
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      // 如果是我们关注的URL，存储请求头
      if (
        this._url &&
        this._url.includes("/wsq/metrics/v1/") &&
        this._url.includes("/uv")
      ) {
        if (!requestHeaders.has(this._url)) {
          requestHeaders.set(this._url, {});
        }

        const headers = requestHeaders.get(this._url);
        headers[header] = value;
      }

      return originalXHRSetRequestHeader.apply(this, arguments);
    };

    // 覆盖send方法
    XMLHttpRequest.prototype.send = function (body) {
      // 如果是我们关注的URL，检查并提取请求头
      if (
        this._url &&
        this._url.includes("/wsq/metrics/v1/") &&
        this._url.includes("/uv")
      ) {
        const headers = requestHeaders.get(this._url) || {};

        // 提取Pid、Ut和Wid字段
        const pid = headers["Pid"] || headers["pid"] || "";
        const ut = headers["Ut"] || headers["ut"] || "";
        const wid = headers["Wid"] || headers["wid"] || "";

        // 只有当找到有效值时才更新全局变量
        if (pid) extractedHeaders.pid = pid;
        if (ut) extractedHeaders.ut = ut;
        if (wid) extractedHeaders.wid = wid;

        console.log("========== 拦截到目标请求 ==========");
        console.log(`URL: ${this._url}`);
        console.log(`Pid: ${extractedHeaders.pid}`);
        console.log(`Ut: ${extractedHeaders.ut}`);
        console.log(`Wid: ${extractedHeaders.wid}`);
        console.log("===================================");

        // 清理存储的请求头，避免内存泄漏
        requestHeaders.delete(this._url);
      }

      return originalXHRSend.apply(this, arguments);
    };

    console.log("XHR拦截器已设置");
  }

  /**
   * 初始化函数，在点击按钮后执行
   * @param {Function} callback - 操作完成后的回调函数
   */
  function init(callback) {
    console.log("开始执行一键三连操作");

    // 获取页面中所有的a标签
    const links = document.querySelectorAll("a");

    // 存储提取的参数
    const extractedParams = [];
    let processedCount = 0;
    let totalRequests = 0;

    // 遍历所有链接
    links.forEach((link) => {
      const href = link.getAttribute("href");

      // 检查href是否存在且匹配特定格式
      if (
        href &&
        (href.includes("newsdetail.html?id=") ||
          href.includes("newsdetail.html?wid="))
      ) {
        // 使用正则表达式提取id和wid参数
        const idMatch = href.match(/[?&]id=([^&]+)/);
        const widMatch = href.match(/[?&]wid=([^&]+)/);

        if (idMatch && widMatch) {
          const id = idMatch[1];
          const wid = widMatch[1];

          // 将提取的参数添加到数组中
          extractedParams.push({ id, wid, href });

          // 在控制台输出提取的参数
          console.log(`提取到参数 - ID: ${id}, WID: ${wid}`);
          console.log(`原始链接: ${href}`);

          // 每个ID会发送3个请求
          totalRequests += 3;

          // 发送各种请求
          sendLikeRequest(id, 1, () => {
            processedCount++;
            checkCompletion();
          });

          sendCollectRequest(id, 1, () => {
            processedCount++;
            checkCompletion();
          });

          sendViewRequest(id, () => {
            processedCount++;
            checkCompletion();
          });
        }
      }
    });

    // 检查是否所有请求都已完成
    function checkCompletion() {
      if (processedCount >= totalRequests) {
        console.log(`所有请求已完成: ${processedCount}/${totalRequests}`);
        if (callback) callback(extractedParams.length);
      }
    }

    // 如果没有找到匹配的链接
    if (extractedParams.length <= 0) {
      console.log("未找到匹配的链接");
      if (callback) callback(0);
    }

    // 如果没有发送任何请求
    if (totalRequests === 0 && callback) {
      callback(0);
    }

    return extractedParams.length;
  }

  /**
   * 准备请求头
   * @returns {Object} 包含提取的请求头的对象
   */
  function prepareHeaders() {
    const headers = {};

    // 如果已经提取到了请求头信息，添加到请求中
    if (extractedHeaders.pid) {
      headers["Pid"] = extractedHeaders.pid;
    }

    if (extractedHeaders.ut) {
      headers["Ut"] = extractedHeaders.ut;
    }

    if (extractedHeaders.wid) {
      headers["Wid"] = extractedHeaders.wid;
    }

    return headers;
  }

  /**
   * 发送点赞请求
   * @param {string} articleId - 文章ID
   * @param {number} status - 状态，默认为1
   * @param {Function} callback - 请求完成后的回调函数
   */
  function sendLikeRequest(articleId, status = 1, callback) {
    const url = `http://aiportal.unicom.local/pcm/mslike/v1/like?articleid=${articleId}&status=${status}`;

    console.log(`发送点赞请求: ${url}`);

    // 准备请求头
    const headers = prepareHeaders();

    // 记录使用的请求头
    Object.keys(headers).forEach((key) => {
      console.log(`添加请求头 ${key}: ${headers[key]}`);
    });

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: headers,
      onload: function (response) {
        console.log(`点赞请求成功 - 文章ID: ${articleId}`);
        console.log(`状态码: ${response.status}`);
        console.log(`响应内容: ${response.responseText}`);
        if (callback) callback();
      },
      onerror: function (error) {
        console.error(`点赞请求失败 - 文章ID: ${articleId}`);
        console.error(error);
        if (callback) callback();
      },
    });
  }

  /**
   * 发送收藏请求
   * @param {string} articleId - 文章ID
   * @param {number} status - 状态，默认为1
   * @param {Function} callback - 请求完成后的回调函数
   */
  function sendCollectRequest(articleId, status = 1, callback) {
    const url = `http://aiportal.unicom.local/pcm/collect/v1/collect?articleid=${articleId}&status=${status}`;

    console.log(`发送收藏请求: ${url}`);

    // 准备请求头
    const headers = prepareHeaders();

    // 记录使用的请求头
    Object.keys(headers).forEach((key) => {
      console.log(`添加请求头 ${key}: ${headers[key]}`);
    });

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: headers,
      onload: function (response) {
        console.log(`收藏请求成功 - 文章ID: ${articleId}`);
        console.log(`状态码: ${response.status}`);
        console.log(`响应内容: ${response.responseText}`);
        if (callback) callback();
      },
      onerror: function (error) {
        console.error(`收藏请求失败 - 文章ID: ${articleId}`);
        console.error(error);
        if (callback) callback();
      },
    });
  }

  /**
   * 发送浏览请求
   * @param {string} articleId - 文章ID
   * @param {Function} callback - 请求完成后的回调函数
   */
  function sendViewRequest(articleId, callback) {
    const url = `http://aiportal.unicom.local/pcm/msview/v1/view?articleid=${articleId}`;

    console.log(`发送浏览请求: ${url}`);

    // 准备请求头
    const headers = prepareHeaders();

    // 记录使用的请求头
    Object.keys(headers).forEach((key) => {
      console.log(`添加请求头 ${key}: ${headers[key]}`);
    });

    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: headers,
      onload: function (response) {
        console.log(`浏览请求成功 - 文章ID: ${articleId}`);
        console.log(`状态码: ${response.status}`);
        console.log(`响应内容: ${response.responseText}`);
        if (callback) callback();
      },
      onerror: function (error) {
        console.error(`浏览请求失败 - 文章ID: ${articleId}`);
        console.error(error);
        if (callback) callback();
      },
    });
  }

  /**
   * 创建悬浮按钮
   */
  function createFloatingButton() {
    // 确保layui已加载
    if (typeof layui === "undefined") {
      console.error("Layui未加载");
      // 如果layui未加载，尝试再次加载
      setTimeout(createFloatingButton, 1000);
      return;
    }

    // 创建按钮容器
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "fixed";
    buttonContainer.style.right = "20px";
    buttonContainer.style.bottom = "20px";
    buttonContainer.style.zIndex = "9999";
    document.body.appendChild(buttonContainer);

    // 使用layui创建按钮
    layui.use(["layer"], function () {
      const $ = layui.$;
      const layer = layui.layer;

      // 创建按钮元素
      const button = $(
        '<button class="layui-btn layui-btn-radius layui-btn-normal layui-btn-lg">' +
          '<i class="layui-icon layui-icon-release"></i> 一键三连' +
          "</button>"
      );

      // 添加点击事件
      button.on("click", function () {
        // 显示确认对话框
        layer.confirm(
          "确定要执行一键三连操作吗？",
          {
            icon: 3,
            title: "确认",
            btn: ["确定", "取消"],
          },
          function (index) {
            // 用户点击确定
            layer.close(index);

            // 显示加载中提示
            const loadingIndex = layer.load(1, {
              shade: [0.3, "#fff"],
            });

            // 执行初始化操作
            init(function (count) {
              // 关闭加载提示
              layer.close(loadingIndex);

              if (count > 0) {
                // 显示操作成功的提示
                layer.msg(`操作完成！成功处理了${count}个链接`, {
                  icon: 1,
                  time: 3000,
                });
              } else {
                // 显示未找到链接的提示
                layer.msg("未找到匹配的链接，请确认当前页面是否包含有效内容", {
                  icon: 2,
                  time: 3000,
                });
              }
            });
          }
        );
      });

      // 将按钮添加到容器中
      $(buttonContainer).append(button);

      // 添加按钮悬停效果
      button.hover(
        function () {
          $(this).addClass("layui-btn-warm");
        },
        function () {
          $(this).removeClass("layui-btn-warm");
        }
      );

      // 添加按钮阴影效果
      button.css({
        "box-shadow": "0 2px 5px rgba(0,0,0,0.2)",
        transition: "all 0.3s",
      });

      // 添加按钮点击效果
      button
        .on("mousedown", function () {
          $(this).css("transform", "scale(0.95)");
        })
        .on("mouseup mouseleave", function () {
          $(this).css("transform", "scale(1)");
        });
    });
  }

  // 在脚本开始时设置XHR拦截器
  setupXHRInterceptor();

  // 页面加载完成后创建悬浮按钮
  window.addEventListener("load", function () {
    // 等待一段时间确保layui完全加载
    setTimeout(createFloatingButton, 1000);
  });
})();
