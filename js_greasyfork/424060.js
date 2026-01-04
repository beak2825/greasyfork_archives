// ==UserScript==
// @name         Bangumi 声优出演角色按 ID 降序显示
// @namespace    https://github.com/bangumi/scripts/tree/master/infinityloop
// @version      0.1.0
// @icon         http://bangumi.tv/img/favicon.ico
// @author       InfinityLoop
// @description  对 Bangumi 中声优页面下的所演出角色按 ID 降序显示。
// @include      /^https?://((bangumi|bgm)|chii\.in)\.tv/person/\d+/works/voice/
// @supportURL   https://github.com/bangumi/scripts/issues/new?title=[%E5%A3%B0%E4%BC%98%E4%BD%9C%E5%93%81ID%E9%99%8D%E5%BA%8F]&body=@swsoyee%3Ch2%3E%E9%97%AE%E9%A2%98%E6%8A%A5%E5%91%8A%3C/h2%3E
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/424060/Bangumi%20%E5%A3%B0%E4%BC%98%E5%87%BA%E6%BC%94%E8%A7%92%E8%89%B2%E6%8C%89%20ID%20%E9%99%8D%E5%BA%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424060/Bangumi%20%E5%A3%B0%E4%BC%98%E5%87%BA%E6%BC%94%E8%A7%92%E8%89%B2%E6%8C%89%20ID%20%E9%99%8D%E5%BA%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';
    
    // get character id from image href
    const getId = (node) => {
        return (Number(node.querySelector("div>a").href.split("/").pop()));
    }

    // function for passing to sort()
    const sort_li = (prev, cur) => {
        return (getId(cur) > getId(prev) ? 1 : -1);
    }

    // sort character element
    $("li.item.clearit").sort(sort_li).appendTo("ul.browserList");

    // reset style
    $("li.item.clearit").each((index, element) => {
        $(element).attr("class", index % 2 == 0 ? 'item even clearit' : 'item odd clearit');
    })
})();
