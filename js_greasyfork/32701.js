// ==UserScript==
// @name         pixiv收藏整理⑤循环
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.pixiv.net/bookmark.php?type=illust_all&p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32701/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A4%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/32701/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A4%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==

var li_temp = document.getElementsByClassName('view_mypixiv')[0].childNodes[1];
var href_class = li_temp.getElementsByTagName('a')[0];
var url0 = href_class.href;
window.location.href = url0;
