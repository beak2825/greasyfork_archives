// ==UserScript==
// @name 百度搜索结果居中
// @namespace http://tampermonkey.net/
// @version 0.0.1
// @description 搜索结果居中
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.baidu.com/s*
// @match https://baijiahao.baidu.com/s*
// @downloadURL https://update.greasyfork.org/scripts/447404/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/447404/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.baidu.com/s")) {
  css += `
  .fm{margin-left: 380px!important;}
  .s_tab_inner{margin-left: 350px!important;}
  #container{margin-left: 500px!important;}
  .school-wrapper_1Q5eI{margin-left: 350px!important;}
  .new-pmd.c-container, .new-pmd .c-span12, .new-pmd .c-color-text{width: 800px!important;}
  .new-pmd .c-gap-top-middle .c-span-last{width: 600px!important;}
  .page_2muyV .page-inner_2jZi2{margin-left: 350px!important;}
  #help{margin-left: 350px!important;}
  #content_right{display:none!important;}
  .sitelink {overflow-x: hidden;}
  `;
}
if (location.href.startsWith("https://baijiahao.baidu.com/s")) {
  css += `
  .app-module_contentWrapper_2jN0Z .app-module_articleWrapper_q1J1i .app-module_rightSection_2v051{display:none!important;}
  .app-module_contentWrapper_2jN0Z .app-module_articleWrapper_q1J1i .app-module_leftSection_EaCvy{width: 992px!important;}
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
