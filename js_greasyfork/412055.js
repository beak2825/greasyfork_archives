// ==UserScript==
// @name        图片管理&点击图片复制链接
// @namespace   Violentmonkey Scripts
// @match       http://cncms.ds.gome.com.cn/gomeCmsImgInfo/list.do
// @grant       none
// @version     1.0
// @author      -
// @description 2020/9/27 下午3:09:56
// @downloadURL https://update.greasyfork.org/scripts/412055/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412055/%E5%9B%BE%E7%89%87%E7%AE%A1%E7%90%86%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

var my_css = `
  <style>
    .collapse.in>ul li {
      box-shadow: 0 0 8px 0 red inset;
    }
    .collapse.in>ul li.on {
    background: rgb(0, 255, 21);
  }

.collapse.in>ul li img {
width: 180px  !important;
}
  </style>
  `;
$("body").before(my_css)

function copyToClip(content) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

$(".collapse.in>ul li").click(function () {
  copyToClip("http:" + $(this).find("img").attr("src").trim())
  $(this).addClass("on")
  console.log("http:" + $(this).find("img").attr("src").trim())
  // alert("复制链接成功！");
})