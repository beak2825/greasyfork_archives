// ==UserScript==
// @name        武汉理工大学中国语文每19分钟刷新页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  菜鸡方便菜鸡
// @author       guo
// @include  http://59.69.102.9/zgyw/index.aspx
// @match        https://greasyfork.org/zh-CN/scripts/369625-%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397294/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E6%AF%8F19%E5%88%86%E9%92%9F%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/397294/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%9B%BD%E8%AF%AD%E6%96%87%E6%AF%8F19%E5%88%86%E9%92%9F%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

function myrefresh()
{
window.location.reload();
}
setTimeout('myrefresh()',1000*60*19);