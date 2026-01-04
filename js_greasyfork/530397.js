// ==UserScript==
// @name    数据库浏览器导航（截取ajax）
// @description  湖南中医药大学图书馆 数据库导航点击链接方法重写
// @icon    https://ae01.alicdn.com/kf/Hac1a58055c5047cdb91349e91aa208d5k.jpg
// @author     ZK
// @license    GPL-3.0-only
// @create     2025-03-21
// @run-at     document-end
// @version    1.0.0
// @include    https://wisdom.chaoxing.com/newwisdom/doordatabase/*
// @home-url   https://greasyfork.org/zh-TW/scripts/14178
// @homepageURL  https://greasyfork.org/zh-TW/scripts/14178
// @copyright  2015-2025, AC
// @lastmodified  2025-03-12
// @feedback-url  https://github.com/langren1353/GM_script
// @resource  baiduCommonStyle   https://ibaidu.tujidu.com/newcss/baiduCommonStyle.less?t=27.04
// @resource  baiduOnePageStyle  https://ibaidu.tujidu.com/newcss/baiduOnePageStyle.less?t=27.04
// @resource  baiduTwoPageStyle  https://ibaidu.tujidu.com/newcss/baiduTwoPageStyle.less?t=27.04
// @resource  googleCommonStyle  https://ibaidu.tujidu.com/newcss/googleCommonStyle.less?t=27.04
// @resource  googleOnePageStyle https://ibaidu.tujidu.com/newcss/googleOnePageStyle.less?t=27.04
// @resource  googleTwoPageStyle https://ibaidu.tujidu.com/newcss/googleTwoPageStyle.less?t=27.04
// @resource  bingCommonStyle    https://ibaidu.tujidu.com/newcss/bingCommonStyle.less?t=27.04
// @resource  bingOnePageStyle   https://ibaidu.tujidu.com/newcss/bingOnePageStyle.less?t=27.04
// @resource  bingTwoPageStyle   https://ibaidu.tujidu.com/newcss/bingTwoPageStyle.less?t=27.04
// @resource  duckCommonStyle    https://ibaidu.tujidu.com/newcss/duckCommonStyle.less?t=27.04
// @resource  duckOnePageStyle   https://ibaidu.tujidu.com/newcss/duckOnePageStyle.less?t=27.04
// @resource  duckTwoPageStyle   https://ibaidu.tujidu.com/newcss/duckTwoPageStyle.less?t=27.04
// @resource  dogeCommonStyle    https://ibaidu.tujidu.com/newcss/dogeCommonStyle.less?t=27.04
// @resource  dogeOnePageStyle   https://ibaidu.tujidu.com/newcss/dogeOnePageStyle.less?t=27.04
// @resource  dogeTwoPageStyle   https://ibaidu.tujidu.com/newcss/dogeTwoPageStyle.less?t=27.04
// @resource  haosouCommonStyle    https://ibaidu.tujidu.com/newcss/haosouCommonStyle.less?t=27.04
// @resource  haosouOnePageStyle   https://ibaidu.tujidu.com/newcss/haosouOnePageStyle.less?t=27.04
// @resource  haosouTwoPageStyle   https://ibaidu.tujidu.com/newcss/haosouTwoPageStyle.less?t=27.04
// @resource  HuYanStyle         https://ibaidu.tujidu.com/newcss/HuYanStyle.less?t=27.04
// @resource  BgAutoFit          https://ibaidu.tujidu.com/newcss/BgAutoFit.less?t=27.04
// @resource  HuaHua-ACDrakMode  https://ibaidu.tujidu.com/newcss/HuaHua-ACDrakMode.less?t=27.04
// @resource  baiduLiteStyle     https://gitcode.net/-/snippets/1906/raw/master/LiteStyle.css?inline=false
// @require   https://cdn.jsdelivr.net/npm/less_browser_fix@4.2.2/dist/less.min.js
// @require   https://lib.baomitu.com/vue/3.2.31/vue.runtime.global.prod.min.js
// @require   https://lf6-cdn-tos.bytecdntp.com/cdn/expire-10-y/vue/3.2.31/vue.runtime.global.prod.min.js
// @noframes
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @grant    GM_addStyle
// @grant    GM_getResourceURL
// @grant    GM_listValues
// @grant    GM.getResourceUrl
// @grant    GM_xmlhttpRequest
// @grant    GM_getResourceText
// @grant    GM_registerMenuCommand
// @grant    GM_addValueChangeListener
// @grant    unsafeWindow
// @namespace 1353464539@qq.com
// @downloadURL https://update.greasyfork.org/scripts/530397/%E6%95%B0%E6%8D%AE%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%BC%E8%88%AA%EF%BC%88%E6%88%AA%E5%8F%96ajax%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/530397/%E6%95%B0%E6%8D%AE%E5%BA%93%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AF%BC%E8%88%AA%EF%BC%88%E6%88%AA%E5%8F%96ajax%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 从当前页面 URL 中提取所需参数
  const currentUrl = window.location.href;
  console.log(currentUrl, "当前页面链接");
  const wfwfidMatch = currentUrl.match(/wfwfid=(\d+)/);
  const wfwfid = wfwfidMatch ? wfwfidMatch[1] : null;

  if (!wfwfid) {
    console.log("未能从当前 URL 中提取到必要的参数");
    return;
  }

  // 动态生成目标接口地址
  const targetUrl = `https://wisdom.chaoxing.com/center/elecresource/resourcedetail/${doorid}.action?source=4&wfwfid=${wfwfid}`;
  console.log(targetUrl, "接口链接");

  // 发送请求并等待响应
  GM_xmlhttpRequest({
    method: "GET",
    url: targetUrl,
    onload: function (response) {
      console.log(response, "接口数据");
      console.log(response.status, "接口状态");
      if (response.status === 200) {
        // 请求成功，开始监听 DOM 变化
        waitForElements("span.link", function (linkElements) {
          console.log(linkElements, "元素数据");
          if (linkElements.length > 0) {
            // 处理第一个 link 元素
            const firstLink = linkElements[0];
            const firstLinkText = firstLink.textContent;
            const openurl = firstLinkText.split("(")[0];
            console.log("第一个链接的 openurl:", openurl);
            // 删除 onclick 属性
            firstLink.removeAttribute("onclick");
            // 为第一个 link 元素添加点击事件
            firstLink.addEventListener("click", function (event) {
              event.stopPropagation(); // 阻止事件冒泡
              event.preventDefault(); // 阻止默认行为
              window.open(openurl, "_blank"); // 在新窗口打开链接
            });

            if (linkElements.length > 1) {
              // 处理第二个 link 元素
              const secondLink = linkElements[1];
              const secondLinkText = secondLink.textContent;
              const url = secondLinkText.split("(")[0];
              console.log("第二个链接的 url:", url);
              // 删除 onclick 属性
              secondLink.removeAttribute("onclick");
              // 为第二个 link 元素添加点击事件
              secondLink.addEventListener("click", function (event) {
                event.stopPropagation(); // 阻止事件冒泡
                event.preventDefault(); // 阻止默认行为
                window.open(url, "_blank"); // 在新窗口打开链接
              });
            }
          } else {
            console.log("未找到 link 元素");
          }
        });
      } else {
        console.log("请求接口失败，状态码:", response.status);
      }
    },
    onerror: function (error) {
      console.log("请求接口发生错误:", error);
    },
  });

  // 等待指定元素出现的函数
  function waitForElements(selector, callback) {
    console.log(selector, "selector");
    const observer = new MutationObserver((mutationsList) => {
      console.log(mutationsList, "mutationsList");
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const elements = document.querySelectorAll(selector);
          console.log(elements, "elements");
          if (elements.length >= 1) {
            observer.disconnect();
            callback(elements);
            break;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
