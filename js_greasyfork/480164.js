// ==UserScript==
// @name         自动将网站字体改成浏览器默认字体
// @version      0.0.3
// @match        *://*/*
// @description  通过修改css的方法，自动将网站字体（TagName为h1、h2、h3、h4、h5、h6、div、p的元素）改成浏览器默认字体。

// @license      MIT
// @namespace https://greasyfork.org/users/187381
// @downloadURL https://update.greasyfork.org/scripts/480164/%E8%87%AA%E5%8A%A8%E5%B0%86%E7%BD%91%E7%AB%99%E5%AD%97%E4%BD%93%E6%94%B9%E6%88%90%E6%B5%8F%E8%A7%88%E5%99%A8%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/480164/%E8%87%AA%E5%8A%A8%E5%B0%86%E7%BD%91%E7%AB%99%E5%AD%97%E4%BD%93%E6%94%B9%E6%88%90%E6%B5%8F%E8%A7%88%E5%99%A8%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
const defaultFontFamily = `
  font-family: initial !important;
}
`;
const arr = ["html", "body", "h1", "h2", "h3", "h4", "h5", "h6","div", "p"];
for (const v of arr) {
  const elems = document.getElementsByTagName(v);
  for (var i = 0; i<elems.length; i++) {
    elems[i].style.cssText = defaultFontFamily; 

    }
}
