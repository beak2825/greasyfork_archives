// ==UserScript==
// @name         百度美化
// @namespace    http://ventroar.xyz/
// @version      0.2
// @description  一个很简单的简约美化百度搜索页面的小脚本，因为是大一学生所以知识点不牢固，写这个脚本纯粹锻炼自己技术
// @author       VentCat
// @match        https://www.baidu.com/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445984/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445984/%E7%99%BE%E5%BA%A6%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  let submitBtn = document.querySelector("#su");
  submitBtn.value = "浅浅百度下吧";
  submitBtn.style.width = "125px";

  let submitBtnStyle = document.querySelector(".s_btn");
  submitBtnStyle.style.backgroundColor = "#253446";

  let submitBtnInputStyle = document.querySelectorAll(
    "#s_kw_wrap input[type='text'],#kw,#s_kw_wrap"
  );
  submitBtnInputStyle.forEach(e => {
    e.style.borderRadius = "100px 0 0 100px";
    e.style.borderColor = "#253446";
  });

  let submitBtnInputStyleOnClick = document.querySelectorAll(
    "#s_kw_wrap input[type='text']:hover,#s_kw_wrap input[type='text']:focus"
  );
  submitBtnInputStyleOnClick.forEach(e => {
    e.style.border = "2px solid #253446";
    e.addEventListener("click", () => {
      e.className = "bg s_ipt_wr new-pmd quickdelete-wrap";
    });
  });

  let navBox = document.querySelector("#s_top_wrap");
  navBox.style.minWidth = "0";
  navBox.style.width = "0";

  let baiduLogo = document.querySelector("#s_lg_img");
  baiduLogo.style.display = "none";

  let baiduNavBar = document.querySelectorAll(
    "#s-top-left,.s-top-right,.s-bottom-layer-content,#bottom_layer"
  );
  baiduNavBar.forEach(e => (e.style.display = "none"));
  let s_main= document.querySelector("#s_main");
  s_main.style.display = "none";
})();
