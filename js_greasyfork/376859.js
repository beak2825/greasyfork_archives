// ==UserScript==
// @name 巴哈公會禁止回應
// @description gamer guild no response btn
// @namespace blankuser.gamer.guild
// @match https://guild.gamer.com.tw/guild.php
// @grant none
// @version 0.0.1.20190118180534
// @downloadURL https://update.greasyfork.org/scripts/376859/%E5%B7%B4%E5%93%88%E5%85%AC%E6%9C%83%E7%A6%81%E6%AD%A2%E5%9B%9E%E6%87%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376859/%E5%B7%B4%E5%93%88%E5%85%AC%E6%9C%83%E7%A6%81%E6%AD%A2%E5%9B%9E%E6%87%89.meta.js
// ==/UserScript==
var msgbox1sel = document.getElementById('msgbox1sel');
msgbox1sel.innerHTML += '<input type="checkbox" id="forbidden" name="forbidden">禁止他人回應　';
