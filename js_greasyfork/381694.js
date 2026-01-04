// ==UserScript==
// @name         【购物必备】自动勾选7天无理由/包邮/赠送运费险
// @description  在搜索和列表界面自动勾选这2个,节省操作.
// @version      1.2
// @author      jO9GEc
// @match        https://s.taobao.com/*
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/14035
// @downloadURL https://update.greasyfork.org/scripts/381694/%E3%80%90%E8%B4%AD%E7%89%A9%E5%BF%85%E5%A4%87%E3%80%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%897%E5%A4%A9%E6%97%A0%E7%90%86%E7%94%B1%E5%8C%85%E9%82%AE%E8%B5%A0%E9%80%81%E8%BF%90%E8%B4%B9%E9%99%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/381694/%E3%80%90%E8%B4%AD%E7%89%A9%E5%BF%85%E5%A4%87%E3%80%91%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%897%E5%A4%A9%E6%97%A0%E7%90%86%E7%94%B1%E5%8C%85%E9%82%AE%E8%B5%A0%E9%80%81%E8%BF%90%E8%B4%B9%E9%99%A9.meta.js
// ==/UserScript==

if (location.href.match('s.taobao.com')){
// if(!/&auction_tag%5B%5D=385/.test(window.location.href)) window.location.href = window.location.href + '&auction_tag%5B%5D=385';
// if(!/&baoyou=1/.test(window.location.href)) window.location.href = window.location.href + '&baoyou=1';
// if(!/delivery=1/.test(window.location.href)) window.location.href = window.location.href + '&delivery=1';
if(!/&auction_tag%5B%5D=4806/.test(window.location.href)) window.location.href = window.location.href + '&auction_tag%5B%5D=4806';
}