// ==UserScript==
// @author         Shyangs
// @name           wasabii登入頁密碼框可打字
// @namespace      http://zh.wikipedia.org/wiki/User:Shyangs
// @description    wasabii旗下網頁遊戲，登入頁密碼框改為可打字狀態
// @include        https://member.wasabii.com.tw/Login.aspx*
// @version        0.1
// @license        MIT License; http://opensource.org/licenses/mit-license.php
// @downloadURL https://update.greasyfork.org/scripts/226/wasabii%E7%99%BB%E5%85%A5%E9%A0%81%E5%AF%86%E7%A2%BC%E6%A1%86%E5%8F%AF%E6%89%93%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/226/wasabii%E7%99%BB%E5%85%A5%E9%A0%81%E5%AF%86%E7%A2%BC%E6%A1%86%E5%8F%AF%E6%89%93%E5%AD%97.meta.js
// ==/UserScript==

var pw=document.getElementById("Password");
pw.outerHTML='<input name="Password" maxlength="12" id="Password" class="Login_box" style="width:115px;border-width:1px;cursor:pointer;" type="password">';