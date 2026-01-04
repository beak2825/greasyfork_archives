// ==UserScript==
// @name        via-复制markdown链接
// @namespace   https://yangerle.github.io/
// @version     0.5
// @description 点击按钮，获取markdown格式的链接，以在手机端快速记录
// @author:     Le
// @license     MIT
// @createTime  2022年04月13日 11:01
// @updateTime  2022年04月14日 10:25
// @include     *
// @downloadURL https://update.greasyfork.org/scripts/443317/via-%E5%A4%8D%E5%88%B6markdown%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/443317/via-%E5%A4%8D%E5%88%B6markdown%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Your code here...
  if (window.top !== window.self) {
    return
  }
  function _appendCss(css, name) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.setAttribute("data-component", name);
    style.innerHTML = css;
    head.appendChild(style);
  }
  function addStyle() {
    //debugger;
    let via_markdown_css = `.via-markdown-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}.via-markdown-btn-sm{height: 20px; line-height: 20px; padding: 0 6px; font-size: 12px;}`;
    _appendCss(via_markdown_css, "btn");
  }
  //创建复制按钮
  function addBtn() {
    var btn = document.createElement('button');
    btn.style = "bottom: 10px;right:0px; position: fixed;z-index:1000;cursor:pointer;background:green;"
    btn.className = "via-markdown-btn via-markdown-btn-sm"
    btn.innerHTML = "复制"
    btn.id = "copyBtn"
    document.body.appendChild(btn);
  }
  addStyle();
  addBtn();
  let isclick = false; // 防止过快重复点击
  var $btn = document.getElementById("copyBtn")
  $btn.addEventListener("click", function () {
    if (!isclick) {
      var text = `[${document.title}](${document.URL})`
      console.log("copy=> " + text);
      let oInput = document.createElement("input");
      oInput.value = text;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      $btn.style.background = "red";
      $btn.innerHTML = "复制成功";
      setTimeout(() => {
        $btn.style.background = "green";
        $btn.innerHTML = "复制";
      }, 3000);
      isclick = true;
      setTimeout(() => {
        isclick = false;
      }, 3000);
    }
  });
})();