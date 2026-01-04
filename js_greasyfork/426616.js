// ==UserScript==
// @name         小贝家园文章过滤
// @namespace    http://KzFbBg.net/
// @version      1.1
// @description  不显示不感兴趣的文章
// @author       LeifengXia
// @match        http://ispankhome.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant GM_log
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/426616/%E5%B0%8F%E8%B4%9D%E5%AE%B6%E5%9B%AD%E6%96%87%E7%AB%A0%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/426616/%E5%B0%8F%E8%B4%9D%E5%AE%B6%E5%9B%AD%E6%96%87%E7%AB%A0%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  const KEY = "filterd-articles";
  function getFilteredArticles() {
    let filtered = window.localStorage.getItem(KEY);
    if (filtered) {
      console.log("filtered", filtered);
      return JSON.parse(filtered);
    } else {
      return [];
    }
  }
  const filteredArticles = getFilteredArticles();

  function createButton(articleId) {
    return (
      '<button type="button" onclick=window.notInterestedIn("' +
      articleId +
      '")>不感兴趣</button>'
    );
  }

  unsafeWindow.notInterestedIn = function (articleId) {
    console.log("you are not interested in " + articleId + ".");
    $("#" + articleId).remove();
    filteredArticles.push(articleId);
    window.localStorage.setItem(KEY, JSON.stringify(filteredArticles));
  };

  $(document).ready(function () {
    let articleRoot = $("#threadlisttableid");
    let articles = articleRoot.children();
    articles.each((i, e) => {
      let ele = $(e);
      let id = String(ele.attr("id"));
      if (id.indexOf("normalthread") !== -1) {
        if ($.inArray(id, filteredArticles) >= 0) {
          $("#" + id).remove();
        } else {
          ele.find(".common").append(createButton(id));
        }
      }
    });
  });
})();
