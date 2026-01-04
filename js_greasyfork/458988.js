// ==UserScript==
// @name        douban爱看机器人
// @namespace   kitety ikanbot
// @match       *://movie.douban.com/subject/*
// @grant       none
// @version     1.0
// @author      kitety
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @description 2023/1/28 10:53:07
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458988/douban%E7%88%B1%E7%9C%8B%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/458988/douban%E7%88%B1%E7%9C%8B%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==
$(document).ready(function () {
    let douban_link, douban_id;

    douban_link = 'https://' + location.href.match(/douban.com\/subject\/\d+\//); //豆瓣链接
    douban_id = location.href.match(/(\d{7,8})/g);
    if (douban_id) {
        let is_movie = $("a.bn-sharing[data-type='电影']").length > 0;
        let is_series = $("a.bn-sharing[data-type='电视剧']").length > 0;
        let is_anime = $('span[property="v:genre"]:contains("动画")').length > 0;
        let is_document = $('span[property="v:genre"]:contains("纪录片")').length > 0;
        if (is_movie ||
            is_series ||
            is_anime ||
            is_document) {
            console.log('现在开始添加')
            const title = $('h1 span[property="v:itemreviewed"]').text()

            const link = `https://www.ikanbot.com/search?q=${title}`
            var $a = $(`<a target="_blank" href="${link}">ikanbot搜索</a>`);
            $("h1").append($a);

        }
    }
})