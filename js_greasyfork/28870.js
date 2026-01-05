// ==UserScript==
// @name        豆瓣电影页面右侧边栏添加搜索
// @description 基于 MyDoubanMovieHelper 的自用版本
// @author      douban movie
// @version     2020.0111
// @icon        https://img3.doubanio.com/favicon.ico
// @run-at      document-start
// @connect     imdb.com
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match       https://movie.douban.com/subject/*
// @namespace https://greasyfork.org/scripts/28870
// @downloadURL https://update.greasyfork.org/scripts/28870/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E5%8F%B3%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/28870/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E9%A1%B5%E9%9D%A2%E5%8F%B3%E4%BE%A7%E8%BE%B9%E6%A0%8F%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

GM_addStyle("@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#dale_movie_home_top_right,#dale_movie_home_top_midle,#dale_movie_home_middle_right,#dale_movie_home_bottom_super_banner,#dale_movie_home_bottom_right,#movie_home_left_bottom,#dale_book_home_top_super_banner,#dale_book_home_top_right,#dale_book_homepage_right_bottom,#dale_book_home_left_middle,#dale_book_home_bottem_right,#dale_book_home_left_top,#dale_book_subject_top_right,#dale_book_subject_middle_right,#dale_movie_subject_collections_bottom_right,#footer,.qrcode-app,.top-nav-doubanapp.pl,div.ticket{display:none}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:2px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:start;width:auto}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:activee8{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{text-decoration:line-through}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#interest_sectl .rating_imdb{border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_more{border-top:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}");
var aside_html = '<div class=c-aside > <h2><i class="">标题</i>· · · · · ·</h2> <div class=c-aside-body  style="padding: 0 0;"> <ul class=tags-body > </ul> </div> </div>';
if (!document.getElementById("TtRaih") && document.title.indexOf('豆瓣') != -1) {
    var TtRaih = document.createElement("a");
    TtRaih.id = "TtRaih";
    document.getElementsByTagName("html")[0].appendChild(TtRaih);

    if (location.href.startsWith('https://movie.douban.com/subject/')) {
        $(document).ready(function() {
            function getDoc(url, meta, callback) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-agent': window.navigator.userAgent,
                        'Content-type': null
                    },
                    onload: function(responseDetail) {
                        var doc = '';
                        if (responseDetail.status == 200) {
                            doc = new DOMParser().parseFromString(responseDetail.responseText, 'text/html');
                            if (doc === undefined) {
                                doc = document.implementation.createHTMLDocument("");
                                doc.querySelector('html').innerHTML = responseText;
                            }
                        }
                        callback(doc, responseDetail, meta);
                    }
                });
            }

            function parseURL(url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function() {
                        var ret = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length,
                            i = 0,
                            s;
                        for (; i < len; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    })(),
                    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: a.pathname.replace(/^\//, '').split('/')
                };
            }
            var detective = $(aside_html);
            detective.addClass("name-detective");
            detective.find("div.c-aside-body").addClass("detective-body");
            detective.find("h2 i").text("🔍 ");
            $("#content div.tags").before(detective);

            function update_detective_links(title, en) {
                title = encodeURI(title);
                if (en) {
                    var detective_links = {
                        //"人人影视": "http://www.zmz2019.com/search?keyword=" + title,
                        //"天天美剧": "http://www.ttmeiju.vip/index.php/search/?keyword=" + title,
                        //"RARBG": "https://rarbgprx.org/torrents.php?imdb=tt" + imdb_id + "&category=41;44;45&order=size",
                        //"Zooqle": "https://zooqle.com/search?q=tt" + imdb_id,
                        //"The Pirate Bay": "https://thepiratebay.org/s/?q=tt" + imdb_id,
                        //"Sub HD": "https://subhd.tv/search/" + title,
                        //"射手网 (伪)": "https://assrt.net/sub/?searchword=" + title,
                        //"哔哩哔哩": "https://search.bilibili.com/all?keyword=" + title,
                    };
                } else {
                    var detective_links = {
                        "在线观看": "https://cse.google.com/cse?cx=016236319849230842297:frfwdedclgc&q=" + title + "?cat=2",
                        "资源采集搜索": "https://cse.google.com/cse?cx=016236319849230842297:eubjceukshc&q=" + title,
                        "下载搜索": "https://cse.google.com/cse?cx=016236319849230842297:6x6a0azdra4&q=" + title,
                    };
                }
                for (var name in detective_links) {
                    link = detective_links[name];
                    link_parsed = parseURL(link);
                    link = $("<a></a>").attr("href", link);
                    link.attr("data-host", link_parsed.host);
                    link.attr("target", "_blank").attr("rel", "nofollow");
                    link.html(name);
                    $("#content div.detective-body ul").append(link);
                }
            }
            var title = title_sec = $("#content > h1 > span")[0].textContent.split(" ");
            title = title.shift();
            title_sec = title_sec.join(" ").trim();
            var title_en = "";
            update_detective_links(title);
            var imdb = $("div#info a[href^='https://www.imdb.com/title/tt']");
            if (imdb) {
                var imdb_href = imdb.attr('href');
                imdb_id = imdb.text();
                if (imdb && imdb_id.startsWith('tt')) {
                    imdb_id = imdb_id.slice(2);
                } else {
                    imdb_id = "";
                }
                getDoc(imdb_href, null, function(doc, resp, meta) {
                    title_en = $(doc).attr('title');
                    title_en = title_en.split(" (")[0];
                    update_detective_links(title_en, true);
                });
            }
        });
    }

}