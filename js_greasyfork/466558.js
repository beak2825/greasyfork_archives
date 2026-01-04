// ==UserScript==
// @license MIT
// @name         CSDN_Auto_Comment
// @namespace    http://maxcool.buzz
// @version      0.1
// @description  CSDN一键点赞评论（学习）
// @author       maxcool
// @match        https://blog.csdn.net/*/article/details/*
// @include		 https://blog.csdn.net/*/article/details/*
// @exclude		 https://blog.csdn.net/weixin_54858833/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466558/CSDN_Auto_Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/466558/CSDN_Auto_Comment.meta.js
// ==/UserScript==
(function() {
    'use strict';

      var styleMap = {
        display: "inline-block",
        "background-color": "red",
        cursor: "pointer",
        "user-select": "none",
        "min-width": "74px",
        height: "28px",
        "border-radius": "16px",
        color: "#fff",
        "font-size": "14px",
        "line-height": "28px",
        "text-align": "center",
        padding: "0px 10px",
        "margin-left": "16px",
      };
      var commentList = [
          "针不戳呀，写的针不戳！",
          "分享技术，不错哦!",
          "大佬牛批，写的很详细！",
          "感谢博主，你的文章让我得到一些收获！(￣ˇ￣)",
      ];

  var randomNum = Math.random() * 4;
  console.log("randomNum", ~~randomNum);

     // 移除广告
     var ad = document.querySelector("#recommendAdBox");
    ad.parentNode.removeChild(ad)

      // 创建按钮
      var btn = document.createElement("div");
      btn.innerHTML = "一键点赞评论";

      // 添加样式
      for (let i in styleMap) {
        btn.style[i] = styleMap[i];
      }

      // 添加点击事件
      btn.addEventListener("click", clickBtn);

      function clickBtn() {

        var isLike = document.querySelector("#is-like");
        isLike.click();

        var comment_content = document.querySelector("#comment_content");
        comment_content.click();
        comment_content.value = commentList[~~randomNum];

        var submit = document.querySelector("[value='发表评论']");
        submit.click();
      }

      var toolbox = document.querySelector(".toolbox-right");

      // 追加到 toolbox
      toolbox.appendChild(btn);
})();