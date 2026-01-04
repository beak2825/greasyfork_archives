// ==UserScript==
// @name         起点小说过滤
// @namespace    http://KzFbBg.net/
// @version      2.0
// @description  不显示不感兴趣的小说
// @author       LeifengXia
// @match        https://www.qidian.com/all**
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant GM_log
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427440/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/427440/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    // Your code here...
    const KEY = "filterd-articles";
    function getFilteredArticles() {
      let filtered = window.localStorage.getItem(KEY);
      if (filtered) {
        console.log("如下小说将不会显示在页面上：", filtered);
        return JSON.parse(filtered);
      } else {
        return [];
      }
    }
    const filteredArticles = getFilteredArticles();
  
    function createButton(articleTitle) {
      return (
        '<button type="button" onclick=window.notInterestedIn("' +
        articleTitle +
        '") style="margin-left:6px">不感兴趣</button>'
      );
    }
  
    unsafeWindow.notInterestedIn = function (articleTitle) {
      console.log("you are not interested in " + articleTitle + ".");
      $("#" + articleTitle).remove();
      filteredArticles.push(articleTitle);
      window.localStorage.setItem(KEY, JSON.stringify(filteredArticles));
      alert("添加成功，请刷新页面！");
    };
  
    $(document).ready(function () {
      let articlesRoot = $(".all-book-list");
      let articles = articlesRoot.find("li");
      articles.each((i, e) => {
        let ele = $(e);
        let articleTitle = String($(ele.find(".book-mid-info>h2>a")[0]).attr("title"));
        console.log(articleTitle);
        if (articleTitle) {
          if ($.inArray(articleTitle, filteredArticles) >= 0) {
            ele.remove();
          } else {
            ele.find("h2").append(createButton(articleTitle));
          }
        }
      });
    });
  })();
  