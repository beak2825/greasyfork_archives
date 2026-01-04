// ==UserScript==
// @name tao image search bs fix
// @version 0.1
// @namespace repfam
// @description  Fix tao img search bullshit
// @match https://s.taobao.com/search?*
// @author the legend himself
// @copyright Gp OP 2021
// @run-at      document-end
// @icon https://www.enjpg.com/img/2020/mai-sakurajima-1.png
// @downloadURL https://update.greasyfork.org/scripts/430656/tao%20image%20search%20bs%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/430656/tao%20image%20search%20bs%20fix.meta.js
// ==/UserScript==

document.evaluate("/html/body/div[1]/style",document.documentElement,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.remove()