// ==UserScript==
// @name         CodeSign访问密码自动填入
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过获取地址栏的code参数，自动填入访问密码
// @author       linmew
// @match        https://codesign.qq.com/*
// @require      https://update.greasyfork.org/scripts/462234/1451870/Message.js
// @icon         https://static.codesign.qq.com/prod/e61fd3f4/icons/icon_512x512.08bd91.png
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/513382/CodeSign%E8%AE%BF%E9%97%AE%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/513382/CodeSign%E8%AE%BF%E9%97%AE%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function (message) {
  "use strict";

  // 判断是否支持 Fetch API
  const supportsFetch = typeof fetch === "function";
  const pwd = getUrlParam("pwd");
  // 提取路径中的sharingId
  const pathRegex = /\/app\/s\/(\d+)(?:\/|\?|$)/;
  const sharingId = window.location.href.match(pathRegex)?.[1];
  if (pwd) {
    handleRequest({
      url: `//codesign.qq.com/api/sharings/${sharingId}/state-keys`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        password: pwd,
      }),
    })
      .then(function (res) {
        res = JSON.parse(res);
        window.localStorage.setItem("secret_" + sharingId, pwd);
        window.localStorage.setItem("_codesign_session_key_", res.key);
        let urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("pwd");
        const newQueryString = urlParams.toString();
        const newURL = newQueryString ? window.location.pathname + "?" + newQueryString : window.location.pathname;
        window.history.replaceState({}, "", newURL);
        window.location.reload();
      })
      .catch(function () {
        message.error("访问密码错误！");
      });
  }

  // 分享
  document.addEventListener('copy', function (event) {
    // 获取选中的文本
    let selection = window.getSelection().toString();
    // 定义用于提取链接的正则表达式
    const linkRegex = /(https?:\/\/[^\s]+)/;
    // 定义用于提取密码的正则表达式
    const pwdRegex = /访问密码：(\w+)/;
    // 提取链接
    const linkMatch = selection.match(linkRegex);
    const link = linkMatch ? linkMatch[1] : null;

    // 提取密码
    const pwdMatch = selection.match(pwdRegex);
    const password = pwdMatch ? pwdMatch[1] : null;

    if (link) {
      let modifiedLink = link;

      // 如果存在密码，则在链接后添加密码参数
      if (password) {
        // 确保链接末尾没有已有的查询参数
        if (link.includes('?')) {
          modifiedLink += `&pwd=${password}`;
        } else {
          modifiedLink += `?pwd=${password}`;
        }

        // 阻止默认的复制行为
        event.preventDefault();

        // 设置新的剪贴板内容
        event.clipboardData.setData('text/plain', selection + '\n免输密码地址：' + modifiedLink + '\n需配合Tampermonkey(请自行安装)浏览器插件使用，点击安装脚本：https://greasyfork.org/zh-CN/scripts/513382');
      }
    }
  });

  // 获取地址栏参数
  function getUrlParam (name) {
    if (!name) return null;
    // 获取查询字符串部分或哈希后的查询参数部分
    var queryParams = window.location.search.substring(1) || window.location.hash.split("?")[1] || "";
    if (!queryParams) return null;
    var reg = new RegExp("(^|&)" + encodeURIComponent(name) + "=([^&]*)(&|$)");
    var matches = queryParams.match(reg);
    if (matches) {
      return decodeURIComponent(matches[2]);
    }
    return null;
  }
  // 封装ajax
  function ajax (options) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      var method = (options.method || "GET").toUpperCase();
      var url = options.url;
      var isAsync = options.async !== false;
      var data = options.data || null;
      var timeout = options.timeout || 0;
      var headers = options.headers || {};
      var xhrFields = options.xhrFields || {};
      var beforeSend = options.beforeSend || function () { };
      var onUploadProgress = options.onUploadProgress || function () { };
      var onDownloadProgress = options.onDownloadProgress || function () { };

      // 处理GET请求中的数据作为URL参数
      if (method === "GET" && data) {
        var queryParams = "";
        if (typeof data === "string") {
          // 假设字符串已经是合适的查询字符串格式
          queryParams = data.startsWith("?") ? data.substring(1) : data;
        } else if (typeof data === "object") {
          // 将对象转换为查询字符串
          queryParams = new URLSearchParams(data).toString();
        }
        url += (url.includes("?") ? "&" : "?") + queryParams;
      }

      xhr.open(method, url, isAsync);
      beforeSend(xhr);

      for (let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      // 设置额外的XHR属性
      for (let field in xhrFields) {
        xhr[field] = xhrFields[field];
      }

      // 上传进度监控
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          onUploadProgress(event);
        }
      };

      // 下载进度监控
      xhr.onprogress = function (event) {
        if (event.lengthComputable) {
          onDownloadProgress(event);
        }
      };

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else if (xhr.status === 0) {
            reject(new Error("请求未发送或网络连接问题"));
          } else {
            reject(new Error("请求失败: 状态码 " + xhr.status + " " + xhr.statusText));
          }
        }
      };

      // 网络错误处理
      xhr.onerror = function () {
        reject(new Error("网络错误"));
      };

      // 超时处理
      xhr.timeout = timeout;
      xhr.ontimeout = function () {
        reject(new Error("请求超时"));
      };

      xhr.send(method === "POST" || method === "PUT" ? data : null);
    });
  }
  // 封装的 Fetch 请求
  function fetchRequest (options) {
    return new Promise((resolve, reject) => {
      const method = (options.method || "GET").toUpperCase();
      const headers = options.headers || {};
      let url = options.url;
      let body = options.data || null;

      // 处理GET请求中的数据作为URL参数
      if (method === "GET" && body) {
        let queryParams = "";
        if (typeof body === "string") {
          // 假设字符串已经是合适的查询字符串格式
          queryParams = body.startsWith("?") ? body.substring(1) : body;
        } else if (typeof body === "object") {
          // 将对象转换为查询字符串
          queryParams = new URLSearchParams(body).toString();
        }
        url += (url.includes("?") ? "&" : "?") + queryParams;
        body = null;
      }

      let fetchOptions = {
        method: method,
        headers: headers,
        body: method === "GET" ? null : body,
        // 默认使用同源策略
        credentials: options.credentials || "same-origin",
      };

      fetch(url, fetchOptions)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error(`请求失败: 状态码 ${response.status} ${response.statusText}`);
          }
        })
        .then((text) => resolve(text))
        .catch((error) => reject(error));
    });
  }
  // 封装请求
  function handleRequest (options, onSuccess, onError) {
    const requestFunction = supportsFetch ? fetchRequest : ajax;

    const promise = requestFunction(options)
      .then((response) => {
        if (typeof onSuccess === "function") {
          onSuccess(response);
        }
        return response;
      })
      .catch((error) => {
        if (typeof onError === "function") {
          onError(error);
        }
        throw error;
      });

    if (typeof onSuccess !== "function" && typeof onError !== "function") {
      return promise;
    }
  }
})(Qmsg);