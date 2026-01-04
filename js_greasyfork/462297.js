// ==UserScript==
// @name         c.pc.qq.com Alert Auto Redirect
// @namespace    https://jmpyx.github.io/
// @version      1.0.4
// @description  Fuck Tencent QQ/TIM's stupid alert! 当腾讯 QQ/TIM 打开网页时显示「当前网页非官方页面」、「非官方页面，请勿输入QQ帐号和密码，如需访问，请复制后使用浏览器访问」时，自动跳转到打开的链接。
// @author       ImAyx
// @license      GPLv3
// @match        http://c.pc.qq.com/middlem.html?pfurl=*
// @match        https://c.pc.qq.com/middlem.html?pfurl=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462297/cpcqqcom%20Alert%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/462297/cpcqqcom%20Alert%20Auto%20Redirect.meta.js
// ==/UserScript==
var url = getParams("pfurl");
if (url != null) {
    window.location.href = url;
}
