// ==UserScript==
// @name         52用户屏蔽脚本
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=2027781
// @version      0.2
// @license MIT
// @description  52破解论坛用户屏蔽脚本，屏蔽消息页面，帖子列表，帖子详情.
// @author       zhuxiangyu1024
// @match        https://www.52pojie.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52pojie.cn
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        unsafeWindow
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/473500/52%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/473500/52%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

let block_name = ["ilovecomputer66"];
var jq = $.noConflict();
function block_user() {
  block_name.forEach(name => {
    let feed_page = jq("tbody:contains('" + name + "')");
    let notice_page = jq("dl.cl").find("dd:contains('" + name + "')");
    let conent_page = jq("div[id^='post_'").find(
      "div:contains('" + name + "')"
    );
    if (unsafeWindow.location.href.indexOf("type=reply") != -1) {
      feed_page.next().remove();
    }
    console.log(feed_page);
    console.log(conent_page);
    feed_page.remove();
    conent_page.remove();
    notice_page.parent().remove();
  });
}

setTimeout(() => {
  block_user();
}, 1000);

})();