// ==UserScript==
// @name           MoviePlus
// @name:zh-CN     豆瓣电影增强
// @namespace      https://github.com/DCjanus/userscripts
// @description    在豆瓣电影页面右边增加若干按钮，一键搜索电影相关资源。Fork 自 https://github.com/94leon/movie.plus
// @author         DCjanus
// @match          https://movie.douban.com/subject/*/
// @match          https://movie.douban.com/subject/*/?*
// @exclude        https://movie.douban.com/subject/*/*/
// @icon           https://img1.doubanio.com/favicon.ico
// @version        20250817
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/469243/MoviePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/469243/MoviePlus.meta.js
// ==/UserScript==
'use strict';

const myScriptStyle = document.createElement('style');
myScriptStyle.innerHTML =
    '@charset utf-8;.c-aside {margin-bottom: 30px}  .c-aside-body {*letter-spacing: normal}  .c-aside-body a {border-radius: 6px;color: #37A;display: inline-block;letter-spacing: normal;margin: 0 8px 8px 0;padding: 0 8px;text-align: center;width: 65px}  .c-aside-body a:link, .c-aside-body a:visited {background-color: #f5f5f5;color: #37A}  .c-aside-body a:hover, .c-aside-body a:active {background-color: #e8e8e8;color: #37A}  .c-aside-body a.disabled {text-decoration: line-through}  .c-aside-body a.available {background-color: #5ccccc;color: #006363}  .c-aside-body a.available:hover, .c-aside-body a.available:active {background-color: #3cc}  .c-aside-body a.honse {background-color: #fff0f5;color: #006363}  .c-aside-body a.honse:hover, .c-aside-body a.honse:active {background-color: #3cc}  .c-aside-body a.sites_r0 {text-decoration: line-through}';
myScriptStyle.innerHTML +=
    ' .db-series-link, .db-series-link:link, .db-series-link:visited, .db-series-link:hover, .db-series-link:active { color: inherit !important; text-decoration: none !important; }';
document.getElementsByTagName('head')[0].appendChild(myScriptStyle);
const aside_html =
    '<div class=c-aside > <h2><i class="">四字标题</i>· · · · · · </h2> <div class=c-aside-body  style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>';

const en_total_reg = /^[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const en_end_reg = /\s[a-zA-Z\d\s-:·,/`~!@#$%^&*()_+<>?"{}.…;'[\]]+$/;
const cn_start_reg =
    /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+/;
const cn_total_reg =
    /^[\u4e00-\u9fa5a-zA-Z\d\s-：:·,，/`~!@#$%^&*()_+<>?"{}.…;'[\]！￥（—）；“”‘、|《。》？【】]+$/;
const symbol_delete_reg =
    /[-：:·,，/`~!@#$%^&*()_+<>?"{}.…;[\]！￥（—）；“”‘、|《。》？【】]/g;

function parseURL(url) {
    let a;
    a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            let i, len, ret, s, seg;
            ret = {};
            seg = a.search.replace(/^\?/, '').split('&');
            len = seg.length;
            i = 0;
            s = void 0;
            while (i < len) {
                if (!seg[i]) {
                    i++;
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
                i++;
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/'),
    };
}

function update_bt_site(title, year, douban_ID, IMDb_ID, title_cn) {
    let name, sites;
    title = title.trim();
    sites = {
        YIFY: 'https://yts.mx/browse-movies/' + title,
        'BTDigg EN':
            'https://www.btdig.com/search?q=' + title + ' ' + year + ' 1080p',
        'BTDigg 中': 'https://www.btdig.com/search?q=' + title_cn,
        'EXT.TO': 'https://ext.to/browse/?q=' + title,
        独播库:
            'https://www.duboku.tv/vodsearch/-------------.html?wd=' +
            title_cn +
            '&submit=',
        动漫花园: 'https://dmhy.org/topics/list?keyword=' + title,
    };

    if (is_series(title)) {
        sites['BTDigg EN'] =
            'https://www.btdig.com/search?q=' + title + ' 1080p';
    }

    for (name in sites) {
        let link = parse_sites(name, sites);
        $('#content div.site-bt-body ul').append(link);
    }
}

function update_sub_site(title, douban_ID, IMDb_ID) {
    let name, sites;
    title = encodeURI(title);

    sites = {
        SubHD: 'https://subhd.tv/d/' + douban_ID,
        字幕库: 'https://srtku.com/search?q=' + IMDb_ID,
        伪射手: 'https://assrt.net/sub/?searchword=' + title,
    };

    for (name in sites) {
        let link = parse_sites(name, sites);
        $('#content div.site-sub-body ul').append(link);
    }
}

function parse_sites(name, sites) {
    let link = sites[name],
        link_parsed = parseURL(link);
    let aTag = $('<a></a>');
    link = aTag.attr('href', link);
    link.attr('data-host', link_parsed.host);
    link.attr('target', '_blank').attr('rel', 'nofollow');
    link.html(name);

    return link;
}

function get_other_title_en(other_title) {
    let other_title_en = '';
    //获取第一个英文副标题
    other_title.split('/').some((item) => {
        if (en_total_reg.test(item)) {
            other_title_en = item;
            return true;
        }
    });
    return other_title_en;
}

function is_series(name) {
    return /S\d+$/.test(name);
}

function not_series_01(name) {
    return /S\d+$/.test(name) & !name.endsWith('S01');
}

function format_series_name(name) {
    if (!/\sSeason\s\d+$/.test(name)) return name;
    let name_arr = name.split('Season');
    let series_id = name_arr.slice(-1)[0].trim().padStart(2, '0');
    return name_arr[0] + 'S' + series_id;
}

function main() {
    const seBwhA = document.createElement('a');
    seBwhA.id = 'seBwhA';
    document.getElementsByTagName('html')[0].appendChild(seBwhA);

    $(document).ready(() => {
        let site_sub = $(aside_html),
            selector = $('#content div.aside');
        site_sub.addClass('name-offline');
        site_sub.find('div.c-aside-body').addClass('site-sub-body');
        site_sub.find('h2 i').text('字幕直达');
        selector.prepend(site_sub);

        let site_bt = $(aside_html);
        site_bt.addClass('site_bt');
        site_bt.find('div.c-aside-body').addClass('site-bt-body');
        site_bt.find('h2 i').text('BT 搜索');
        selector.prepend(site_bt);

        let h1_span,
            title_cn,
            title_en,
            title_en_sub,
            bt_title,
            year,
            douban_ID,
            IMDb_ID;

        h1_span = $('#content > h1 > span');
        let title_all = h1_span[0].textContent;

        if (cn_total_reg.test(title_all)) {
            //名称只有中英文时匹配英文——————————————
            title_en = title_all.match(en_end_reg);
            title_en = title_en ? title_en[0] : '';
        }

        if (title_en) {
            //有英文名时匹配中文——————————————
            title_cn = title_en ? title_all.split(title_en)[0] : '';
        } else {
            //直接匹配中文——————————————
            title_cn = title_all.match(cn_start_reg);
            title_cn = title_cn ? title_cn[0] : '';
        }

        //检查名称——————————————
        if (title_all.length !== (title_en + title_cn).length) {
            title_cn = '';
            let title_array = title_all.split(' ');
            title_array.some((item) => {
                if (!cn_total_reg.test(item)) return true;
                title_cn += item + ' ';
            });

            title_en = '';
        }

        // 中文标题若包含“第x季”，将序列名替换为搜索链接
        if (title_cn) {
            const m = title_cn.match(
                /^(.+?)\s*第([一二三四五六七八九十百\d]+)季/,
            );
            if (m && m[1]) {
                const seriesName = m[1].trim();
                const searchUrl =
                    'https://search.douban.com/movie/subject_search?search_text=' +
                    encodeURIComponent(seriesName);
                const titleSpanEl = h1_span[0];
                const escapeForRegExp = (s) =>
                    s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const leadingPattern = new RegExp(
                    '^' + escapeForRegExp(seriesName),
                );
                titleSpanEl.innerHTML = titleSpanEl.innerHTML.replace(
                    leadingPattern,
                    `<a class="db-series-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer nofollow" title="在豆瓣搜索「${seriesName}」的其他季">${seriesName}</a>`,
                );
            }
        }

        //解析info内容
        let info_text = $('#info')[0].innerText,
            info_map = {};
        info_text.split('\n').forEach((line) => {
            let index = line.indexOf(':');
            if (index > 0)
                info_map[line.slice(0, index).trim()] = line
                    .slice(index + 1)
                    .trim();
        });

        //匹配备用英文名——————————————
        title_en_sub = info_map['又名'];
        title_en_sub = title_en_sub ? get_other_title_en(title_en_sub) : '';

        bt_title = title_en || title_en_sub || title_cn;
        //规范的命名只保留英文字母
        bt_title = bt_title
            .replaceAll(symbol_delete_reg, ' ')
            .replace("'", '')
            .replace(/\s+/g, ' ')
            .trim();
        bt_title = format_series_name(bt_title);

        year = h1_span[1].textContent.substr(1, 4);

        douban_ID = location.href.split('/')[4] || title_cn;

        IMDb_ID = info_map['IMDb'];
        IMDb_ID = IMDb_ID ? IMDb_ID : title_cn;

        update_bt_site(bt_title, year, douban_ID, IMDb_ID, title_cn);
        update_sub_site(title_cn, douban_ID, IMDb_ID);
    });
}

main();
