// ==UserScript==
// @name         豆瓣电影 正在上映 按评分排序
// @namespace    https://www.qs5.org/Post/671.html?douban_play_sort
// @version      0.1
// @description  花钱看电影，当然要看好看的啊~！
// @author       ImDong
// @match        https://movie.douban.com/cinema/nowplaying/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389319/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E6%AD%A3%E5%9C%A8%E4%B8%8A%E6%98%A0%20%E6%8C%89%E8%AF%84%E5%88%86%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389319/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%E6%AD%A3%E5%9C%A8%E4%B8%8A%E6%98%A0%20%E6%8C%89%E8%AF%84%E5%88%86%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    // 先对电影排序
    $('#nowplaying .lists>li').sort(function (a, b) {
        let a_num = parseFloat(a.dataset.score) + (a.querySelector('.new-show') ? 10 : 0),
            b_num = parseFloat(b.dataset.score) + (b.querySelector('.new-show') ? 10 : 0);
        return a_num > b_num ? -1 : a.dataset.score < b.dataset.score ? 1 : 0;
    }).detach().appendTo("#nowplaying .lists");

    // 然后尝试获取已看过的电影
    if ($('.nav-user-account').length > 0) {
        $.ajax({
            url: '/settings/',
            type: 'GET',
            contentType: 'text/html',
            success: function (res, status, xhr) {
                let url = $(res).find('.info li>a[href$="/collect"]')[0].href + '?sort=time&start=0&filter=schedule&mode=list&tags_sort=count';
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: 'text/html',
                    success: function (res, status, xhr) {
                        $(res).find('.article .list-view>li').each(function (index, item) {
                            let id = item.id.substr(4),
                                rating = /rating([0-5])-t/.exec($(item).find('.date>span')[0].classList.value)[1],
                                date = $(item).find('.date').text().replace(/\s/g, '');

                            $('#' + id).data('collect-star', rating * 10);
                            $('#' + id).data('collect-date', date);
                            $('#' + id + ' .stitle a').css({ color: 'green' });
                            $('#' + id + ' .subject-rate').append(' / ' + (rating * 2));

                        });
                    }
                });
            }
        });
    }

    // 修改tip模板
    let tpl = $('#db-tmpl-subject-tip').text();
    tpl = tpl.replace('</p>', "</p>{{if collectStar}}\n<p class=\"star\"><span class=\"allstar{{= collectStar}}\"></span><span class=\"rater-num\">({{= collectDate}} 已看过)</span></p>{{/if}}");
    $('#db-tmpl-subject-tip').text(tpl);
})($);
