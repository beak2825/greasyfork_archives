// ==UserScript==
// @name         小说阅读器
// @version      0.6
// @description  美化小说网站界面,支持笔趣阁系统的小说网站
// @author       Zee Kim
// @match  *://*/*.html
// @grant        none
// @namespace https://greasyfork.org/users/756252
// @downloadURL https://update.greasyfork.org/scripts/424670/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424670/%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var title = document.querySelector("title").innerHTML;
  if(!title.includes("小说")){
    return;
  }
  if (!document.getElementById("content")) {
    return;
  }
  var content = document.querySelector("#content").innerHTML;
  document.title = title;
  content = content.split("https://www.abcxs.com");
  content = content[0].replace(/&nbsp;/g, "");
  document.body.innerHTML = `<style>
    :root{
        --background:#F8F1E3;
        --text:#4F321C;
        --active:#e44343;
    }
    @media (prefers-color-scheme: dark) {
        :root{
            --background:#111;
            --text:#555;
            --active:#baae90;
        }
    }
    .xs_title{

        padding:10px 0px;
        font-weight:bold;
        font-family:SourceHanSerifCN-Bold,Microsoft JhengHei,STFangsong;
        font-size:3.2rem;
        line-height:1;
        color:var(--active);
    }
    .xs_title::after{
        display:block;
        content:"";
        width:50px;
        height:12px;
        border-radius:12px;
        background:var(--active);
        margin:10px 0;
    }

    </style>
    <div class="xs_title">${title}</div>${content}`;
    document.body.style.cssText = `
    max-width:1200px;
      font-family: "STYuanti-SC-Regular","幼圆";
      font-size: 2rem;
      padding: 6rem;
      background:var(--background) ;
      color:var(--text);
      line-height: 1.5;`;
})();
