// ==UserScript==
// @name         Dark Mode
// @name:zh-CN   Dark Mode
// @name:zh-TW   Dark Mode
// @name:en      Dark Mode
// @version      0.2
// @author       Jango
// @description  暗黑模式测试
// @description:zh-CN  暗黑模式测试
// @description:zh-TW  暗黑模式测试
// @description:en  Dark Mode Demo
// @match        *://*/*
// @namespace https://greasyfork.org/users/1255494
// @downloadURL https://update.greasyfork.org/scripts/486120/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/486120/Dark%20Mode.meta.js
// ==/UserScript==


addStyle();

// 添加样式
function addStyle() {
  let remove = false;
  let style_Add = document.createElement('style')
  style_Add.id = 'DarkMode';
  style_Add.type = 'text/css';
     let style = 'html{filter: invert(90%) !important;  text - shadow: 0 0 0!important;  } img, .img, .thumb-overlay-albums canvas, video, [style*="background"][style*="url"], svg{    filter: invert(1) !important;}'
  if (document.lastElementChild) {
    document.lastElementChild.appendChild(style_Add).textContent = style;
  } else {
    let timer1 = setInterval(function () {
      if (document.lastElementChild) {
        clearInterval(timer1);
        document.lastElementChild.appendChild(style_Add).textContent = style;
      }
    });
  }
}
