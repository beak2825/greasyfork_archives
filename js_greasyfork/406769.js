// ==UserScript==
// @name         获取豆瓣信息
// @namespace    http://tampermonkey.net/
// @version      0.1.13
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://movie.douban.com/subject/*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/limonte-sweetalert2/8.11.8/sweetalert2.all.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @require      https://cdn.staticfile.org/lodash.js/4.17.19/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/406769/%E8%8E%B7%E5%8F%96%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/406769/%E8%8E%B7%E5%8F%96%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

/* global swal */

(function() {
    'use strict';

    if (!/^https:\/\/movie\.douban\.com\/subject\/\d+\/$/.test(location.href)) {
        return;
    }

    function handleInfo(val) {
        const lines = handleSummary(val);
        const result = lines.map(function(line) {
            let line_str = line;
            let site = '';
            let link = '';
            if (_.endsWith(line, '更多...')) {
                line_str = line.replace(/更多\.\.\.$/, '');
            }
            if (_.startsWith(line, '官方网站')) {
                site = line.replace(/^官方网站:\s+/, '');
                link = site;
                if (!_.startsWith(site, 'http://') && !_.startsWith(site, 'https://')) {
                    link = `http://${site}`;
                }
                site = `<a href="${link}" rel="noopener noreferrer" target="_blank">${site}</a>`;
                line_str = `官方网站: ${site}`;
            }
            return line_str;
        });
        return result;
    }
    function handleSummary(val) {
        const lines = val.split("\n").map(function(line) {
            return line.replace(/^\s+/g, '').replace(/\s+$/g, '');
        });
        const result = lines.filter(function(line) {
            return line;
        });
        return result;
    }
    function handleTitle(info) {
        let title = document.title.replace(/\s+\(豆瓣\)$/g, '');
        let year = $('.year').text().replace(/[\(\)]/g, '');
        let is_movie = $('[name="description"]').attr('content').search(/电影简介和剧情介绍/) > -1;
        let type = is_movie ? '日影' : '日剧';
        if (info.indexOf('类型: 纪录片') > -1) {
            type = '纪录片';
        }
        if (info.match(/类型:.+?动画/)) {
            type = is_movie ? '日影动画' : '电视动画';
        }
        let episodes = info.match(/集数: (\d+)/);
        let episode_num = episodes ? `${episodes[1]}集全` : '';
        return is_movie
            ? `${year}${type}《${title}》xx字幕/磁力下载`
            : `${year}${type}《${title}》xx字幕/${episode_num}/磁力下载`;
    }
    function handleGenre() {
        let tags = $('.tags-body').text().split("\n").map(function(line) {
            return line.replace(/^\s+/g, '').replace(/\s+$/g, '');
        });
        tags = tags.filter(function(line) {
            return line;
        });
        $('[property="v:genre"]').each(function(i, el) {
            tags.push($(el).text());
        });
        return _.uniq(tags).join(',');
    }
    function handleActor() {
        let result = [];
        $('[rel="v:starring"]').each(function(i, el) {
            result.push($(el).text());
        });
        return result.join(',');
    }

    setTimeout(function() {
        const info = handleInfo($('#info').text()).join("\n");
        const title = handleTitle(info);
        const $summary_all = $('#link-report > .all.hidden');
        const $summary = $summary_all.length ? $summary_all : $('[property="v:summary"]');
        const summary = handleSummary($summary.text()).join("\n\n");
        const genre = handleGenre();
        const actor = handleActor();

        Swal.fire({
            html:
            '<div class="swal2-html-container" style="text-align: left;">标题</div>' +
            '<textarea class="swal2-textarea imzhi-copy-btn" id="imzhi-douban-title" rows="2" style="height: auto;" data-clipboard-target="#imzhi-douban-title">'+title+'</textarea>' +
            '<div class="swal2-html-container" style="text-align: left;">信息</div>' +
            '<textarea class="swal2-textarea imzhi-copy-btn" id="imzhi-douban-info" rows="5" style="height: auto;" data-clipboard-target="#imzhi-douban-info">'+info+'</textarea>' +
            '<div class="swal2-html-container" style="text-align: left;">简介</div>' +
            '<textarea class="swal2-textarea imzhi-copy-btn" id="imzhi-douban-summary" rows="5" style="height: auto;" data-clipboard-target="#imzhi-douban-summary">'+summary+'</textarea>' +
            '<div class="swal2-html-container" style="text-align: left;">类型</div>' +
            '<input type="text" class="swal2-input imzhi-copy-btn" id="imzhi-douban-genre" value="'+genre+'" data-clipboard-target="#imzhi-douban-genre">' +
            '<div class="swal2-html-container" style="text-align: left;">演员</div>' +
            '<textarea class="swal2-textarea imzhi-copy-btn" id="imzhi-douban-actor" rows="3" style="height: auto;" data-clipboard-target="#imzhi-douban-actor">'+actor+'</textarea>',
            showConfirmButton: false,
            onOpen: function() {
                new ClipboardJS('.imzhi-copy-btn');
            },
        });
    }, 200);
})();