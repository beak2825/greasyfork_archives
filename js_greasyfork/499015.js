// ==UserScript==
// @name         海角社区
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Shuaima
// @description  海角社区免金币钻石播放收费视频
// @match        *://*.top/post/details?*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499015/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/499015/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
  // Get the current URL
  var url = window.location.href;

  // Extract the pid value from the URL
  var pidRegex = /pid=(\d+)/;
  var match = url.match(pidRegex);

  if (match) {
    var pid = match[1];
    console.log("PID:", pid);
    var apiUrl = "http://www.djyun.icu/api/hjjx?id=" + pid;
    GM_xmlhttpRequest({
      method: "GET",
      url: apiUrl,
      onload: function(response) {
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        let match = response.responseText.match(urlRegex);
        //let secondLink = getStrUrl(match[0]);
        var m3u8URL = 'https://tools.liumingye.cn/m3u8/#' + match[0];
        const result = getFaviconAndTitle();
        GM_notification({
            title: result.pageTitle,
            text: "详情点击查看",
            onclick: function () {
                GM_openInTab(m3u8URL);
            }
        })
        
      },
      onerror: function() {
        GM_notification("接口请求失败");
      }
    });
  } else {
    console.log("PID not found in the URL");
  }
    function getStrUrl(s) {
        var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        s = s.match(reg);
        return(s&&s.length?s[1]:null);
    }

    // 获取网页图标和名字的函数
    function getFaviconAndTitle() {
        // 获取网页图标
        const favicon = document.querySelector('link[rel="shortcut icon"], link[rel="icon"]');
        const faviconUrl = favicon ? favicon.getAttribute('href') : '';

        // 获取网页标题
        const title = document.querySelector('title');
        const pageTitle = title ? title.textContent : '';

        return {
            faviconUrl,
            pageTitle
        };
    }
})();
