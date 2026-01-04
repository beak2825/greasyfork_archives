// ==UserScript==
// @name        禁用验证码框输入法 - oa.kylinos.cn
// @namespace   Violentmonkey Scripts
// @match       http://oa.kylinos.cn:5677/jsoa/login.jsp
// @grant       none
// @license     GPL-3.0-or-later
// @version     1.1
// @author      Xie Wei
// @description 2021/2/20 上午10:28:31
// @downloadURL https://update.greasyfork.org/scripts/422031/%E7%A6%81%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E6%A1%86%E8%BE%93%E5%85%A5%E6%B3%95%20-%20oakylinoscn.user.js
// @updateURL https://update.greasyfork.org/scripts/422031/%E7%A6%81%E7%94%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E6%A1%86%E8%BE%93%E5%85%A5%E6%B3%95%20-%20oakylinoscn.meta.js
// ==/UserScript==

$('#ImageCode')[0].style.imeMode='disabled'