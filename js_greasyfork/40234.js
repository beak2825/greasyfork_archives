// ==UserScript==
// @name         Taobao mobile link converter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto Redirect from mobile to desktop links
// @author       AColdWall
// @match        https://m.intl.taobao.com/detail/detail.html*

// @run-at      document-start
// @icon	http://www.taobao.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/40234/Taobao%20mobile%20link%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/40234/Taobao%20mobile%20link%20converter.meta.js
// ==/UserScript==

var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("id");
window.location.href = "https://item.taobao.com/item.htm?id=" + c + "&rd=t";
