// ==UserScript==
// @name         标题显著,标识等级标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小小的插件，解决看文档时不知道标题到底是几级标题带来的困扰。
// @author       SunZhongyi
// @match        *://webpack.js.org/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447204/%E6%A0%87%E9%A2%98%E6%98%BE%E8%91%97%2C%E6%A0%87%E8%AF%86%E7%AD%89%E7%BA%A7%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/447204/%E6%A0%87%E9%A2%98%E6%98%BE%E8%91%97%2C%E6%A0%87%E8%AF%86%E7%AD%89%E7%BA%A7%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement('style')
    style.innerText = `
 h1:before {
    color: #f00;
    content: "#";
    margin-right:20px;
    float: left;
}
/* .post .postTitle:before{
  color: ;
  content: "#*1";
  margin-right:20px;
  float: left;
} */
 h2:before {
    color: #f00;
    content: "##";
    margin-right:20px;
    float: left;

}
h3:before {
    color: #f00;
    content: "###";
    margin-right:20px;
    float: left;

}
 h4:before {
    color: #f00;
    content: "#*4";
    margin-right:20px;
    float: left;

}
h5:before {
    color:#f00;
    content: "#*5";
    margin-right:20px;
    float: left;

}
h6:before {
    color: #f00;
    content: "#*6";
    margin-right:20px;
    float: left;

}
`
document.body.appendChild(style);
    // Your code here...
})();