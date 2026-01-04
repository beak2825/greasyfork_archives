// ==UserScript==
// @name         增加“多标签搜索按钮”
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  增加“多标签搜索按钮”，原帖 http://bangumi.tv/group/topic/344240 ， 作者 windrises（http://bangumi.tv/user/windrises）
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in).*/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/34999/%E5%A2%9E%E5%8A%A0%E2%80%9C%E5%A4%9A%E6%A0%87%E7%AD%BE%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/34999/%E5%A2%9E%E5%8A%A0%E2%80%9C%E5%A4%9A%E6%A0%87%E7%AD%BE%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    let api_prefix = 'https://windrises.net/bgmtools/multitag/';
    let nav_a = $("div.headerNeueInner").find("a.nav");
    for(let i = 0;i < nav_a.length;i++) {
        let matcher = nav_a.eq(i).attr("href").match(/\/(.*)?\/tag/);
        matcher ? nav_a.eq(i).parent().after('<li><a target="_blank" href="' + api_prefix + matcher[1] + '" ckass="nav" style="display:block;">多标签搜索</a></li>') : null;
    }
})();