// ==UserScript==
// @name        Pt-InfoGen
// @namespace   blog.rhilip.info
// @version     20180812
// @author      Rhilip
// @description 从豆瓣获取种子简介信息，并填写对应信息，适用国内多数NP构架的站点
// @include     http://*/upload.php
// @include     https://*/upload.php
// @require     http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @run-at      document-end
// @connect     *
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371087/Pt-InfoGen.user.js
// @updateURL https://update.greasyfork.org/scripts/371087/Pt-InfoGen.meta.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

$(document).ready(function () {
    // 构造本脚本和用户交互行
    $('form#compose > table > tbody > tr:eq(1)').after('<tr><td class="rowhead" valign="top" align="right">InfoGen</td><td class="rowfollow" valign="top" align="left"><input type="text" name="gen_url" id="gen_url" placeholder="相应网站上资源信息页的 URL 或 资源名称" style="width: 500px;"> <input type="button" id="gen_btn" value="搜索/导入">&nbsp;&nbsp;<span id="gen_info"></span><br> 此功能可以从 豆瓣 上抓取信息，并生成标题部分信息及简介。目前仅建议 电影 / 剧集 区使用。<br><span id="gen_extra" style="display:none"></span></td></tr>');

    // 注册脚本添加的相关DOM
    var gen_info = $("#gen_info");
    var gen_extra = $("#gen_extra");

    function getDoc(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (res) {
                // 页面解析
                var doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');
                var body = doc.querySelector("body");
                var page = $(body); // 构造 jQuery 对象
                callback(res, doc, body, page);    // 回调地狱~
            },
            onerror: function (res) {
                gen_info.text("向对应服务器请求数据失败，可能是你的网络问题吧2333");
            }
        });
    }

    $('#gen_btn').click(function () {
        var subject_url = $('#gen_url').val().trim();

        if (subject_url.match(/^http/)) {
            gen_info.text("识别输入内容为链接格式，请求源数据中....");
            gen_extra.hide()

            if (subject_url.match(/movie\.douban\.com/)) {   // 豆瓣链接
                gen_info.text("你似乎输入的是豆瓣链接，尝试请求对应豆瓣页面....");
                var fetch = function (anchor) {
                    return anchor[0].nextSibling.nodeValue.trim();
                };

                getDoc(subject_url, function (res, doc, body, page) {
                    // 检查对应资源是否存在
                    if (/<title>页面不存在<\/title>/.test(res.responseText)) {
                        gen_info.text("该链接对应的资源似乎并不存在，你确认没填错");
                    } else {
                        gen_info.text("已成功获取源页面，开始解析");

                        var movie_id = res.finalUrl.match(/\/subject\/(\d+)/)[1];

                        var this_title, trans_title;
                        var chinese_title = doc.title.replace('(豆瓣)', '').trim();
                        var foreign_title = page.find('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
                        var aka_anchor = page.find('#info span.pl:contains("又名")');
                        var aka;
                        if (aka_anchor[0]) {
                            aka = fetch(aka_anchor).split(' / ').sort(function (a, b) {//首字(母)排序
                                return a.localeCompare(b);
                            }).join('/');
                        }
                        if (foreign_title) {
                            trans_title = chinese_title + (aka ? ('/' + aka) : '');
                            this_title = foreign_title;
                        } else {
                            trans_title = aka ? aka : '';
                            this_title = chinese_title;
                        }

                        var year = page.find('#content>h1>span.year').text().slice(1, -1);  //年代

                        var regions_anchor = page.find('#info span.pl:contains("制片国家/地区")');
                        var region = regions_anchor[0] ? fetch(regions_anchor).split(' / ').join('/') : null;  //产地
                        //类别
                        var genre = page.find('#info span[property="v:genre"]').map(function () {
                            return $(this).text().trim();
                        }).toArray().join('/');
                        //语言
                        var language_anchor = page.find('#info span.pl:contains("语言")');
                        var language = language_anchor[0] ? fetch(language_anchor).split(' / ').join('/') : null;
                        //上映日期
                        var playdate = page.find('#info span[property="v:initialReleaseDate"]').map(function () {
                            return $(this).text().trim();
                        }).toArray().sort(function (a, b) {//按上映日期升序排列
                            return new Date(a) - new Date(b);
                        }).join('/');
                        //IMDb链接
                        var imdb_link_anchor = page.find('#info span.pl:contains("IMDb链接")');
                        var imdb_link = imdb_link_anchor[0] ? imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/') : null;
                        //豆瓣链接
                        var douban_link = 'https://' + res.finalUrl.match(/movie.douban.com\/subject\/\d+\//);
                        //集数
                        var episodes_anchor = page.find('#info span.pl:contains("集数")');
                        var episodes = episodes_anchor[0] ? fetch(episodes_anchor) : null;
                        //片长
                        var duration_anchor = page.find('#info span.pl:contains("单集片长")');
                        var duration = duration_anchor[0] ? fetch(duration_anchor) : page.find('#info span[property="v:runtime"]').text().trim();

                        var director, writer, cast;
                        var awards;
                        var douban_average_rating, douban_votes, douban_rating, introduction, poster;
                        var imdb_average_rating, imdb_votes, imdb_rating;
                        var tags;

                        var descriptionGenerator = function () {
                            var descr = "";
                            descr += poster ? ('[img]' + poster + '[/img]\n\n') : "";
                            descr += trans_title ? ('◎译　　名　' + trans_title + "\n") : "";
                            descr += this_title ? ('◎片　　名　' + this_title + "\n") : "";
                            descr += year ? ('◎年　　代　' + year + "\n") : "";
                            descr += region ? ('◎产　　地　' + region + "\n") : "";
                            descr += genre ? ('◎类　　别　' + genre + "\n") : "";
                            descr += language ? ('◎语　　言　' + language + "\n") : "";
                            descr += playdate ? ('◎上映日期　' + playdate + "\n") : "";
                            descr += imdb_rating ? ('◎IMDb评分  ' + imdb_rating + "\n") : "";
                            descr += imdb_link ? ('◎IMDb链接  ' + imdb_link + "\n") : "";
                            descr += douban_rating ? ('◎豆瓣评分　' + douban_rating + "\n") : "";
                            descr += douban_link ? ('◎豆瓣链接　' + douban_link + "\n") : "";
                            descr += episodes ? ('◎集　　数　' + episodes + "\n") : "";
                            descr += duration ? ('◎片　　长　' + duration + "\n") : "";
                            descr += director ? ('◎导　　演　' + director + "\n") : "";
                            descr += writer ? ('◎编　　剧　' + writer + "\n") : "";
                            descr += cast ? ('◎主　　演　' + cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim() + "\n") : "";
                            descr += tags ? ('\n◎标　　签　' + tags + "\n") : "";
                            descr += introduction ? ('\n◎简　　介\n\n　　' + introduction.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";
                            descr += awards ? ('\n◎获奖情况\n\n　　' + awards.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";

                            $("textarea[name=descr]").val(descr);  // 填写简介

                            var douban_input_name = ['douban_url','dburl','url_douban'];

                            $(douban_input_name.map(x => `input[type=text][name=${x}]`).join(',')).val(
                                descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/) ? descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/)[1] : ""
                            );
                            $("input[type=text][name=url]").val(
                                descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/) ? descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/)[1] : ""
                            );
                            gen_info.text("已完成填写。");
                        };

                        descriptionGenerator();   // 预生成一次

                        // IMDb信息（最慢，最先请求）
                        if (imdb_link) {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: 'https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
                                onload: function (res) {
                                    var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                    var a = JSON.parse(try_match[1]);
                                    imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                    imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                    imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                    descriptionGenerator();   // 成功后刷新简介
                                }
                            });
                        }

                        // 该影片的评奖信息
                        getDoc(douban_link + 'awards', function (res, doc, body, page) {
                            awards = page.find('#content>div>div.article').html()
                                .replace(/[ \n]/g, '')
                                .replace(/<\/li><li>/g, '</li> <li>')
                                .replace(/<\/a><span/g, '</a> <span')
                                .replace(/<(div|ul)[^>]*>/g, '\n')
                                .replace(/<[^>]+>/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .replace(/ +\n/g, '\n')
                                .trim();
                            descriptionGenerator();
                        });

                        //豆瓣评分，简介，海报，导演，编剧，演员，标签
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'https://api.douban.com/v2/movie/' + movie_id,
                            onload: function (response) {
                                json = JSON.parse(response.responseText);
                                douban_average_rating = json.rating.average || 0;
                                douban_votes = json.rating.numRaters.toLocaleString() || 0;
                                douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
                                introduction = json.summary.replace(/^None$/g, '暂无相关剧情介绍');
                                poster = json.image.replace(/s(_ratio_poster|pic)/g, 'l$1');
                                director = json.attrs.director ? json.attrs.director.join(' / ') : '';
                                writer = json.attrs.writer ? json.attrs.writer.join(' / ') : '';
                                cast = json.attrs.cast ? json.attrs.cast.join('\n') : '';
                                tags = json.tags.map(function (member) {
                                    return member.name;
                                }).join(' | ');

                                descriptionGenerator();

                            }
                        });
                    }
                });
            }

        } else {
            gen_info.text("识别输入内容为文字格式，尝试搜索");

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.douban.com/v2/movie/search?q=" + subject_url, // 通过接口调用
                onload: function (res) {
                    if (res.status >= 200 && res.status < 400) {
                        gen_info.text("请求成功，请在下方选择对应链接。");
                        var resj = JSON.parse(res.responseText);  // 解析成Json格式
                        if (resj.total !== 0) {
                            var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"gen_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                            for (var i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                                var i_item = resj.subjects[i_douban];
                                search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year + "</td><td class='rowfollow' align='center'>" + i_item.subtype + "</td><td class='rowfollow'>" + i_item.title + "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.alt + "'>选择</a></td></tr>";
                            }
                            search_html += "</table>";
                            $("#gen_extra").html(search_html).show();

                            $("a.gen_search_choose").click(function () {
                                var tag = $(this);
                                $('#gen_url').val(tag.attr("data-url"));
                                $('#gen_btn').click();
                            });
                        } else {
                            gen_info.text("无搜索结果");
                        }
                    } else {
                        gen_info.text("不知道为什么失败了，原因为：" + res.status);
                    }
                },
                onerror: function () {
                    gen_info.text("向豆瓣API请求数据失败，可能是你的网络问题吧2333");
                }
            });
        }
    });
});


/**
 * Created by Rhilip on 2018/8/12.
 * 2018/8/12 从之前脚本适配修改
 */