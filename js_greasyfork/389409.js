// ==UserScript==
// @name         JustLogin
// @namespace    http://windylh.com/
// @version      0.11
// @description  I just want to login!!!!!
// @author       Windylh
// @include        http://10.13.0.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389409/JustLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/389409/JustLogin.meta.js
// ==/UserScript==

var info = window.location.search;
window.location.replace("http://login.gwifi.com.cn/cmps/admin.php/api/login/"+info);