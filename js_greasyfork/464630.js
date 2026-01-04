// ==UserScript==
// @name        心平气和看虎扑
// @namespace   Violentmonkey Scripts
// @match       https://bbs.hupu.com/*.html
// @license MIT
// @grant       none
// @version     1.11
// @author      -
// @description 2023/4/23 02:31:41
// @downloadURL https://update.greasyfork.org/scripts/464630/%E5%BF%83%E5%B9%B3%E6%B0%94%E5%92%8C%E7%9C%8B%E8%99%8E%E6%89%91.user.js
// @updateURL https://update.greasyfork.org/scripts/464630/%E5%BF%83%E5%B9%B3%E6%B0%94%E5%92%8C%E7%9C%8B%E8%99%8E%E6%89%91.meta.js
// ==/UserScript==



var containers = document.querySelectorAll(".wrapper-container");

for (let i = 1; i < containers.length; i++) {
  containers[i].style.display = 'none';
}


var replies = document.querySelectorAll(".post-reply-list-operate");

for (let i = 0; i < replies.length; i++) {
  replies[i].style.display = 'none';
}

// 屏蔽湿乎乎这个傻逼官方引战区:
var wholeScreen = document.querySelector("#__next");




var title = document.querySelector(".index_br__hJajv");
var section = title.querySelector(".index_hp-pc-breadcrumb___Sojb");

var children = section.querySelectorAll("span");


for (let child of children) {
  if (child.textContent === "湿乎乎的话题 » ") {
      
        const htmlString = `
<div>
  <h3>珍惜生命</h3>
  <h3>远离官方引战区</h3>
  <button>
    <a href="https://bbs.hupu.com/"> 回到首页 </a>
  </button>
  <div style="color:white">
   ${setTimeout(function() {
      window.location.href = 'https://bbs.hupu.com/';
    }, 5000)}
  </div>
</div>
`

      wholeScreen.innerHTML =htmlString;
      wholeScreen.style.width = '200px'; // set the width of the element
      wholeScreen.style.margin = 'auto'; // set the margin to auto to center horizontally and vertically

  }
}

