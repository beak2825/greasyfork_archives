// ==UserScript==
// @name         Twitter Bookmark Extractor
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Extracts bookmarked tweets from Twitter bookmarks page
// @author       Thomas
// @match        https://twitter.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493568/Twitter%20Bookmark%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/493568/Twitter%20Bookmark%20Extractor.meta.js
// ==/UserScript==

const BOOKMARK_URL = "https://twitter.com/i/bookmarks";
const TWEET_TYPES = ["Tweet", "TweetWithVisibilityResults", "TimelineTimelineItem"];
const SEPARATOR = " https://t.co/";

(function () {
  // 存储所有数据的数组
  let allData = [];

  // 定义一个函数来处理请求
  function handleRequest(xhr) {
    // 检查响应是否成功
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // 解析响应数据
      let responseData = JSON.parse(xhr.responseText);
      // 将当前请求返回的数据添加到 allData 数组中
      allData = allData.concat(responseData);

      // 如果响应中包含 cursor，则继续获取下一批数据
      if (responseData.some((entry) => entry.cursorType === "Bottom")) {
        let nextCursor = responseData.find((entry) => entry.cursorType === "Bottom").value;
        // 复制原始请求参数和请求头信息
        let params = JSON.parse(xhr.params);
        let headers = JSON.parse(xhr.headers);
        // 设置新的 cursor 值
        params.cursor = nextCursor;
        // 重新发送请求
        let newXhr = new XMLHttpRequest();
        newXhr.open("POST", xhr.url);
        // 设置请求头信息
        Object.keys(headers).forEach((header) => {
          newXhr.setRequestHeader(header, headers[header]);
        });
        newXhr.onreadystatechange = function () {
          handleRequest(newXhr);
        };
        newXhr.send(JSON.stringify(params));
      } else {
        // 如果没有 cursor，说明已经获取到所有数据，可以进行后续处理了
        console.log("All data:", allData);
      }
    }
  }

  XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    this.wrappedSetRequestHeader(header, value);

    if (!this.headers) {
      this.headers = {};
    }

    if (!this.headers[header]) {
      this.headers[header] = [];
    }

    // Add the value to the header
    this.headers[header].push(value);
    if (this.url) {
      this.headers[header] = value;
    }
  };

  // 重写 XMLHttpRequest.prototype.open 方法
  let originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url.includes(`/Bookmarks?variables=`)) {
      const xhr = this;
      xhr.url = url;

      // 当请求完成时，调用 handleRequest 函数
      xhr.onload = function () {
        let result = JSON.parse(xhr.responseText);
        let entries = result.data.bookmark_timeline_v2.timeline.instructions[0].entries;
        // 将entries中的数据添加到allData中，并去重
        entries.forEach((entry) => {
          TWEET_TYPES.includes(entry.content.entryType) &&
            !allData.find((item) => item.entryId === entry.entryId) &&
            allData.push(entry);
          let loadingButton = document.querySelector(".loading-button");
          loadingButton && (loadingButton.innerHTML = `Got ${allData.length} bookmarks, please wait...`);
        });

        if (entries.length > 2) {
          const cursor = entries[entries.length - 1].content.value;
          // 解析url请求参数
          let params = new URLSearchParams(url.split("?")[1]);
          params.set("variables", JSON.stringify(Object.assign(JSON.parse(params.get("variables")), { cursor })));
          setTimeout(() => {
            // 创建一个新的请求
            let newXhr = new XMLHttpRequest();
            newXhr.open(method, `${url.split("?")[0]}?${params.toString()}`);
            // 设置请求头信息
            Object.keys(this.headers).forEach((header) => {
              newXhr.setRequestHeader(header, this.headers[header]);
            });
            newXhr.send(params.toString());
          }, 500);
        } else {
          let loadingButton = document.querySelector(".loading-button");
          let downloadButton = document.querySelector(".download-button");

          loadingButton && (loadingButton.style.display = "none");
          downloadButton && (downloadButton.innerHTML = `Got ${allData.length} bookmarks, click to download.`);
          downloadButton && (downloadButton.style.display = "");
        }
      };
    }

    // 调用原始 open 方法
    originalOpen.apply(this, arguments);
  };
  window.addEventListener("load", function () {
    // 获取visible
    const show = toggleDropdown();

    const dropdown = document.createElement("div");
    dropdown.style.position = "fixed";
    dropdown.style.display = "flex";
    dropdown.style.flexDirection = "column";

    dropdown.style.top = "20px";
    dropdown.style.right = "20px";
    dropdown.style.zIndex = "999999";
    dropdown.style.backgroundColor = "white";
    // dropdown.style.padding = "10px";
    dropdown.style.borderRadius = "4px";
    dropdown.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";
    dropdown.style.display = show ? "flex" : "none";
    dropdown.className = "dropdown";

    document.body.appendChild(dropdown);

    const createButton = (text, onclick, className, options) => {
      const button = document.createElement("button");
      if (className) button.className = className;

      button.style.display = (options || {}).isHide || false ? "none" : "inline-block";
      button.style.padding = "10px 20px";
      // button.style.margin = "10px";
      button.style.background = "#38A1F3";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.borderRadius = "4px";
      button.style.cursor = "pointer";
      button.style.fontFamily = "Arial, sans-serif";
      button.style.fontSize = "14px";
      button.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";

      button.textContent = text;
      button.onclick = onclick;
      document.querySelector(".dropdown").appendChild(button);
      return button;
    };

    // 在dropdown中添加一个加载图标
    createButton("Be getting, please wait...", function () {}, "loading-button");

    // 下载按钮
    createButton(
      `Download Bookmarks`,
      function () {
        const bookmarks = allData.map((entry) => {
          let tweetBody = entry.content.itemContent.tweet_results.result;

          if (tweetBody.__typename === "TweetWithVisibilityResults") {
            tweetBody = tweetBody.tweet;
          }

          const [title] = tweetBody.legacy.full_text.split(SEPARATOR);

          return {
            rest_id: tweetBody.rest_id,
            created_at: tweetBody.legacy.created_at,
            title,
            link: `https://twitter.com/x/status/${tweetBody.rest_id}`,
          };
        });

        // 下载bookmarks的json文件(bookmarks)
        const blob = new Blob([JSON.stringify(bookmarks)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bookmarks.json";
        document.body.appendChild(link);
        link.click();
      },
      "download-button",
      { isHide: true }
    );
  });
})();

// 隐藏显示dropdown
function toggleDropdown() {
  let show = false;
  if (window.location.href.includes(BOOKMARK_URL)) {
    show = true;
  }

  if (document.querySelector(".dropdown")) {
    document.querySelector(".dropdown").style.display = show ? "flex" : "none";
  }

  return show;
}

// 判断是否是书签页面，如果是则显示，否则隐藏所有 class 为bookmarks-button的按钮
function _wr(type) {
  let orig = history[type];
  return function () {
    let rv = orig.apply(this, arguments);
    let e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
}
history.pushState = _wr("pushState");
window.addEventListener("pushState", toggleDropdown);
