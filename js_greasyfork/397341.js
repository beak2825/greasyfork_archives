// ==UserScript==
// @name                SUSTech Email Login Suffix Switch
// @name:zh-CN          SUSTech邮箱登陆后缀切换
// @namespace           https://greasyfork.org/zh-CN/users/198554-huahuay
// @description         In SUSTech email login website, switch the email suffix from sustech.edu.cn to mail.sustech.edu.cn
// @description:zh-CN   在邮箱登陆页面，从sustech.edu.cn邮箱后缀切换到mail.sustech.edu.cn
// @version             1.0.0
// @author              HuaHuaY
// @include             *://www.sustech.edu.cn/mail/
// @downloadURL https://update.greasyfork.org/scripts/397341/SUSTech%20Email%20Login%20Suffix%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/397341/SUSTech%20Email%20Login%20Suffix%20Switch.meta.js
// ==/UserScript==

document.getElementsByName("domain")[0].value = "mail.sustech.edu.cn";
