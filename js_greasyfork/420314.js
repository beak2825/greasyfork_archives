// ==UserScript==
// @name           国语视界
// @description    基于大神的代码修改而来，感谢！
// @author         国语视界
// @contributor    国语视界
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/368137-encodeToGb2312/code/encodeToGb2312.js?version=601683
// @include        https://cnlang.org/*
// @version        1.0.1
// @icon           https://cnlang.org/favicon.ico
// @run-at         document-end
// @namespace      doveboy_js
// @downloadURL https://update.greasyfork.org/scripts/420314/%E5%9B%BD%E8%AF%AD%E8%A7%86%E7%95%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/420314/%E5%9B%BD%E8%AF%AD%E8%A7%86%E7%95%8C.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === "undefined") {
    alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
    return;
}

// 不属于豆瓣的页面
if (!/cnlang.org\/thread/.test(location.href)) {
    return; // 终止脚本运行，防止豆瓣的css以及js片段等污染页面
}

// 注入脚本相关的CSS，包括：隐藏、调整豆瓣原先的元素，脚本页面样式
let myScriptStyle = "@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#movie_home_left_bottom,#dale_movie_home_top_right,#dale_movie_home_side_top,#dale_movie_home_bottom_right,#dale_movie_home_inner_bottom,#dale_movie_home_download_bottom,#dale_movie_home_bottom_right_down,#dale_movie_towhome_explore_right,#dale_movie_chart_top_right,#dale_movie_tags_top_right,#dale_review_best_top_right,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,.extra,div.gray_ad,p.pl,div.ticket{display:none}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#c_dialog li{margin:10px}#c_dialog{text-align:center}#interest_sectl .rating_imdb{border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83c40b}#interest_sectl .rating_more .popularityDown{color:#930e02}.more{display:block;height:34px;line-height:34px;text-align:center;font-size:14px;background:#f7f7f7}div#drdm_setting input[type=checkbox]{display:none}div#drdm_setting input[type=checkbox]+label{display:inline-block;width:40px;height:20px;position:relative;transition:.3s;margin:0 20px;box-sizing:border-box;background:#ddd;border-radius:20px;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]+label:after,div#drdm_setting input[type=checkbox]+label:before{content:'';display:block;position:absolute;left:0;top:0;width:20px;height:20px;transition:.3s;cursor:pointer}div#drdm_setting input[type=checkbox]+label:after{background:#fff;border-radius:50%;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]:checked+label{background:#aedcae}div#drdm_setting input[type=checkbox]:checked+label:after{background:#5cb85c;left:calc(100% - 20px)}.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;margin-right:5px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:link,.top250 a:hover,.top250 a:active,.top250 a:visited{color:#744900;text-decoration:none;background:0}.top250-no{width:34%}.top250-link{width:66%}.drdm-dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.drdm-dl-horizontal dd{margin-left:180px}";
GM_addStyle(myScriptStyle);

// -- 定义基础方法 --

// 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
function page_parser(responseText) {
    // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
    responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
    responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
    return (new DOMParser()).parseFromString(responseText, 'text/html');
}

function getDoc(url, meta, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let doc = page_parser(responseDetail.responseText);
                callback(doc, responseDetail, meta);
            }
        }
    });
}

function getJSON(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                callback(JSON.parse(response.responseText), url);
            } else {
                callback(false, url);
            }
        }
    });
}

// 缓存相关方法
function CacheStorage(name, expire = null) {
    let now = Date.now();
    let cache_name = "drdm_cache_" + (name ? name : 'default');

    if (localStorage[cache_name + "_exp"]) {
        if (now > localStorage[cache_name + "_exp"]) {
            localStorage.removeItem(cache_name);
        }
    }

    let cache = localStorage[cache_name] ? JSON.parse(localStorage[cache_name]) : {};
    localStorage.setItem(cache_name + "_exp", now + expire);

    return {
        flush: function () {
            localStorage.setItem(cache_name, JSON.stringify(cache));
        },

        add: function (name, value) {
            cache[name] = value;
            this.flush();
        },

        del: function (name) {
            if (name) {
                delete cache[name];
                this.flush;
            } else {
                localStorage.removeItem(cache_name);
            }
        },

        get: function (name, def = null) {
            if (name) {
                return cache[name] ? cache[name] : def;
            } else {
                return cache;
            }
        }
        }
    }

    function clearExpiredCacheValue(force) {
        let StorageKey = [];
        for (let i = 0, len = localStorage.length; i < len; ++i) { // 先从里面取出所有的key
            StorageKey.push(localStorage.key(i));
        }

        let CacheKey = StorageKey.filter(function (x) {
            return x && x.match(/(drdm_cache_.+)_exp/);
        }); // 再从中提取出本脚本缓存的键值

        for (let i = 0,len = CacheKey.length ; i < len ; ++i) {
            let key_name = CacheKey[i];
            let exp_at = localStorage.getItem(key_name);
            if (force || exp_at < Date.now()) {
                localStorage.removeItem(key_name);
                localStorage.removeItem(key_name.slice(0,-4)); // 移除 _exp 后缀
            }
        }
    }

    let _version = GM_getValue("version", "轻量版");
    let delete_site_prefix = "delete_site_";

    if (typeof GM_registerMenuCommand !== "undefined") {
        function changeVersionConfirm() {
            if (confirm(`你当前版本是 ${_version}，是否进行切换？`)) {
                GM_setValue("version", _version === "完整版" ? "轻量版" : "完整版");
            }
        }
        GM_registerMenuCommand("脚本功能切换", changeVersionConfirm);

        function changeTagBColor() {
            let now_bcolor_list = [GM_getValue("tag_bcolor_exist", "#e3f1ed"), GM_getValue("tag_bcolor_not_exist", "#f4eac2"), GM_getValue("tag_bcolor_need_login", ""), GM_getValue("tag_bcolor_error", "")];
            let name = prompt("请依次输入代表'资源存在','资源不存在','站点需要登陆','站点解析错误'颜色的Hex值，并用英文逗号分割。当前值为：", `${now_bcolor_list.join(',')}`);
            if (name != null && name !== "") {
                try {
                    let bcolor_list = name.split(",");
                    GM_setValue("tag_bcolor_exist", bcolor_list[0] || "#e3f1ed");
                    GM_setValue("tag_bcolor_not_exist", bcolor_list[1] || "#f4eac2");
                    GM_setValue("tag_bcolor_need_login", bcolor_list[2] || "");
                    GM_setValue("tag_bcolor_error", bcolor_list[3] || "");
                } catch (e) {
                    alert("解析输入出错");
                }
            }
        }
        GM_registerMenuCommand("更改标签背景色", changeTagBColor);

        function changeTagFColor() {
            let now_fcolor_list = [GM_getValue("tag_fcolor_exist", "#3377aa"), GM_getValue("tag_fcolor_not_exist", "#3377aa"), GM_getValue("tag_fcolor_need_login", "#3377aa"), GM_getValue("tag_fcolor_error", "#3377aa")];
            let name = prompt("请依次输入代表'资源存在','资源不存在','站点需要登陆','站点解析错误'颜色的Hex值，并用英文逗号分割。当前值为：", `${now_fcolor_list.join(',')}`);
            if (name != null && name !== "") {
                try {
                    let fcolor_list = name.split(",");
                    GM_setValue("tag_fcolor_exist", fcolor_list[0] || "#3377aa");
                    GM_setValue("tag_fcolor_not_exist", fcolor_list[1] || "#3377aa");
                    GM_setValue("tag_fcolor_need_login", fcolor_list[2] || "#3377aa");
                    GM_setValue("tag_fcolor_error", fcolor_list[3] || "#3377aa");
                } catch (e) {
                    alert("解析输入出错");
                }
            }
        }
        GM_registerMenuCommand("更改标签文字色", changeTagFColor);

        function forceCacheClear() {
            if (confirm("清空所有缓存信息（包括资源存在情况、登陆情况等）")) {
                clearExpiredCacheValue(true);
            }
        }
        GM_registerMenuCommand("清空脚本缓存", forceCacheClear);
    }

    let fetch_anchor = function (anchor) {
        return anchor[0].nextSibling.nodeValue.trim();
    };

    function starBlock(source, source_link, _rating, _vote, max = 10) {
        let starValue = parseFloat(_rating) / 2;
        starValue = starValue % 1 > 0.5 ? Math.floor(starValue) + 0.5 : Math.floor(starValue);
        starValue *= (100 / max);

        return `<div class=rating_logo >${source} 评分</div><div class="rating_self clearfix" typeof="v:Rating"><strong class="ll rating_num" property="v:average">${parseFloat(_rating).toFixed(1)}</strong><span property="v:best" content=10.0 ></span><div class="rating_right "><div class="ll bigstar ${'bigstar' + starValue}"></div><div class="rating_sum"> <a href=${source_link}  class=rating_people target="_blank"><span property="v:votes">${_vote}</span>人${source === "MAL" ? "观看" : "评价"}</a> </div> </div> </div>`
    }

        $(document).ready(function () {
            let douban_link, douban_id;

            var html = document.getElementsByTagName('html')[0].outerHTML;

            var regexp = /(https|http)?:\/\/movie.douban.com\/subject\/(.{8}|.{7})/;
            var url = html.match(regexp);
            if(!url) return;

            url = url[0];

            douban_link = 'https://' + url.match(/movie.douban.com\/subject\/\d+\//);  //豆瓣链接
            douban_id = url.match(/(\d{7,8})/g);

            let site_map = [];

            /** label对象键值说明：
             * name:          String  站点名称，请注意该站点名称在不同的site_map中也应该唯一，以免脚本后续判断出错
             * method：       String  搜索请求方式，默认值为 "GET"
             * link：         String  构造好的请求页面链接，作为label的href属性填入，用户应该能直接点开这个页面。
             * ajax：         String  如果站点使用ajax的形式加载页面，则需要传入该值作为实际请求的链接，即优先级比link更高。
             * type：         String  返回结果类型，脚本默认按html页面解析；只有当传入值为"json"时，脚本按JSON格式解析
             * selector：     String  搜索成功判断结果，默认值为 "table.torrents:last > tbody > tr:gt(0)" (适用于国内多数NexusPHP构架的站点)
             *                        如果type为"page"（默认）时，为一个（jQuery）CSS选择器，
             *                        如果type为"json"或"jsonp"时，为一个具体的判断式。
             * selector_need_login    搜索需要登录的选择器，仅在type为默认时有用，其余用法同Selector一致。
             * data：         String  作为请求的主体发送的内容，默认为空即可
             * headers：      Object  修改默认请求头，（防止某些站点有referrer等请求头检查
             * rewrite_href:  Boolean 如果站点最终搜索显示的页面与实际使用搜索页面（特别是使用post进行交互的站点）不一致，
             *                        设置为true能让脚本存储最终url，并改写label使用的href属性
             * csrf:          Object  一个类似这样的字典 { name: "_csrf", update: "link"}
             *                        其中key为站点csrf防护的名称，update为需要更新的字段（一般为link或data）
             *
             * 注意： 1. 如果某键有默认值，则传入值均会覆盖默认值
             *        2. 关于请求方法请参考：https://github.com/scriptish/scriptish/wiki/GM_xmlhttpRequest
             * */
            if (douban_id) {
                clearExpiredCacheValue(false);  // 清理缓存
                let cache = CacheStorage(douban_id, 86400 * 7 * 1e3);
                let need_login_cache = CacheStorage("need_login", 86400 * 1e3);

                $(".pct:first").append(`
<h3 class="psth xs1"><div "style=" padding: 5px; margin-bottom: 20px; word-wrap: break-word;"><a href="javascript:;" style="color: #369;text-decoration: underline;" id="drdm_req_status_hide">显示站外资源</a></div></h3>
<div id="drdm_req_status" style="padding: 5px; margin-bottom: 20px; word-wrap: break-word;display: none;">
<p id="drdm_dep_notice" style="color: #C65E24;display:none;">脚本未完全加载，部分站点将受影响。请确保网络稳定或尝试重新刷新页面。</p>
<table margin-bottom: 20px;>
<tr><td width="25%">存在：<span id="drdm_req_success"></span></td><td width="25%">不存在：<span id="drdm_req_noexist"></span></td><td width="25%">请求中：<span id="drdm_req_asking"></span></td><td width="25%">失败或需要登陆：<span id="drdm_req_fail"></span></td></tr>

</table>
<span id="drdm_req_help"><hr>
<span>是否隐藏当前未成功的搜索项？  <a href="javascript:void();" id="drdm_hide_fail"> 是 </a>  /  <a href="javascript:void();" id="drdm_show_all"> 否 </a></span>
</span>
</div>
<div id='adv-sites' style="display: none;"></div>`);
                $("#drdm_req_status_hide").click(function () {
                    $("#drdm_req_status").show();
                    $("#adv-sites").show();
                });

                $("#drdm_hide_fail").click(function () {
                    $("#adv-sites a[title!=\"资源存在\"]").hide();
                    $('#adv-sites > div.c-aside.name-offline').each(function () {let that = $(this); if (that.find('> div > ul > a:visible').length == 0) {that.hide()}});
                });
                $("#drdm_show_all").click(function () { $("#adv-sites a:hidden").show(); $('#adv-sites > div.c-aside.name-offline').show(); });

                let update_status_interval;

                function update_req_status() {
                    let asking_length = $("#adv-sites a[title=\"正在请求信息中\"]").length;

                    $("#drdm_req_success").text($("#adv-sites a[title=\"资源存在\"]").length);
                    $("#drdm_req_asking").text(asking_length);
                    $("#drdm_req_noexist").text($("#adv-sites a[title=\"资源不存在\"]").length);
                    $("#drdm_req_fail").text($("#adv-sites a[title=\"站点需要登陆\"]").length + $("#adv-sites a[title=\"遇到问题\"]").length);

                    if (asking_length === 0) {
                        clearInterval(update_status_interval);  // 当所有请求完成后清除定时器
                        if (GM_getValue('enalbe_adv_auto_tip_hide', false)) {
                            $("#drdm_req_status_hide").click();
                        }
                    }
                }

                function _encodeToGb2312(str, opt) {
                    let ret = "";
                    try {
                        ret = encodeToGb2312(str, opt);
                    } catch (e) {
                        ret = Math.random() * 1e6;
                        $("#drdm_dep_notice").show();
                    }
                    return ret;
                }

                if (location.host === "cnlang.org") {
                    // Movieinfo信息生成相关
                    let this_title, trans_title, aka;
                    let year, region, genre, language, playdate;
                    let imdb_link, imdb_id, imdb_average_rating, imdb_votes, imdb_rating;
                    let douban_average_rating, douban_votes, douban_rating;
                    let episodes, duration;
                    let director, writer, cast;
                    let tags, introduction, awards;
                    let ld_json;

                    getDoc(url, null, function (doc) {
                        // 获得 <script type="application/ld+json" /> 里面的信息，这里面的东西和API返回需要的东西差不多

                        let aka_anchor = $('#info span.pl:contains("又名")',doc);
                        let has_aka = aka_anchor.length > 0;
                        let has_imdb = $('div#info a[href^=\'https://www.imdb.com/title/tt\']',doc).length > 0;
                        let is_movie = $("a.bn-sharing[data-type='电影']",doc).length > 0;
                        let is_series = $("a.bn-sharing[data-type='电视剧']",doc).length > 0;
                        let is_anime = $('span[property="v:genre"]:contains("动画")',doc).length > 0;
                        let is_document = $('span[property="v:genre"]:contains("纪录片")',doc).length > 0;

                        let chinese_title = doc.title.replace('(豆瓣)', '').trim();
                        let foreign_title = $('#content h1>span[property="v:itemreviewed"]',doc).text().replace(chinese_title, '').trim();

                        let title = $('#content > h1 > span',doc)[0].textContent.split(' ').shift().replace(/[，]/g, " ").replace(/：.*$/, "");

                        if (foreign_title) {
                            trans_title = chinese_title + (aka ? ('/' + aka) : '');
                            this_title = foreign_title;
                        } else {
                            trans_title = aka ? aka : '';
                            this_title = chinese_title;
                        }

                        let eng_title = [this_title, trans_title].join("/").split("/").filter(function (arr) {
                            return /([a-zA-Z]){2,}/.test(arr);
                        })[0] || "";

                        let is_chinese = title.match(/[^\x00-\xff]/);
                        let unititle = is_chinese ? title : eng_title;

                        year = ' ' + $('#content > h1 > span.year',doc).text().substr(1, 4);

                        let nian = is_movie ? year : "";

                        let imdb_link_anchor = $('#info span.pl:contains("IMDb链接")',doc);
                        imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/').replace("http://", "https://");
                        imdb_id = imdb_link.match(/tt\d+/)[0];

                        let dbzw = has_imdb ? imdb_id : unititle + nian;

                        let ywm = eng_title + nian;
                        let jingzhun = has_imdb ? imdb_id : ywm;

                        let gunititle = _encodeToGb2312(unititle, true);
                        let uunititle = encodeURI(unititle).replace(/%/g, "_");

                        site_map.push({
                            name: "精准中文字幕",
                            label: [
                                { name: 'r3sub', link: 'https://r3sub.com/search.php?s=' + dbzw, selector: "div.col-sm-8.col-md-9.col-lg-8 div.movie.movie--preview.ddd" },
                                { name: 'OpenSub', link: 'https://www.opensubtitles.org/zh/search/sublanguageid-chi,zht,zhe,eng/imdbid-' + imdb_id, selector: "#search_results tr.change" },
                                { name: '字幕库', link: 'http://www.zimuku.la/search?q=' + dbzw, selector: 'div.box.clearfix div.item.prel.clearfix' },
                            ]
                        });

                        site_map.push({
                            name: "中文影视字幕",
                            label: [
                                { name: '字幕天堂', method: "post", link: 'http://www.zmtiantang.com/e/search/', data: `keyboard=${unititle}&show=title&classid=1,3&tempid=1`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'table.data > tbody > tr:nth-child(2)' },
                                { name: '字幕组', link: 'http://www.zmz2019.com/search?type=subtitle&keyword=' + unititle, selector: ".search-result li" },
                                { name: 'Sub HD', link: 'http://subhd.tv/search0/' + unititle, selector: "div.col-md-9 div.box" },
                                { name: '伪射手', link: 'http://assrt.net/sub/?searchword=' + unititle, selector: "#resultsdiv a.introtitle" },
                                { name: '电波字幕', link: 'http://dbfansub.com/?s=' + unititle, selector: "div.panel-body article.panel.panel-default.archive" },
                                { name: '中文字幕网', link: 'http://www.zimuzimu.com/so_zimu.php?title=' + unititle, selector: "table.sublist a.othersub" },
                            ]
                        });

                        site_map.push({
                            name: "影视精准匹配",
                            label: [
                                { name: 'BD影视', link: 'https://www.bd-film.cc/search.jspx?q=' + dbzw, selector: '#content_list li.list-item' },
                                { name: 'RARBG', link: 'https://rarbgprx.org/torrents.php?search=' + jingzhun, selector: 'table.lista2t tr.lista2' },
                                { name: 'RARBT', link: 'http://www.rarbt.com/index.php/search/index.html?search=' + dbzw, selector: 'div.ml div.title' },
                                { name: 'TorGal', link: 'https://torrentgalaxy.to/torrents.php?search=' + jingzhun, selector: '#click' },
                                { name: 'Zooqle', link: 'https://zooqle.com/search?q=' + jingzhun, selector: 'div.panel-body a.small' },
                                { name: '爱笑聚', link: 'http://www.aixiaoju.com/app-index-run?app=search&keywords=' + dbzw, /*csrf: { name: 'csrf_token', update: "link" },*/ selector: 'div.search_content div.text' },
                                { name: '比特大雄', link: 'https://www.btdx8.com/?s=' + dbzw, selector: '#content div.post.clearfix' },
                                { name: '第一电影网', link: 'https://www.001d.com/?s=' + dbzw, selector: 'div.mainleft div.info' },
                                { name: '就爱那片', method: "post", link: 'http://www.inapian.com/index.php?s=vod-search&wd=' + dbzw, data: `wd=${unititle}`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'div.sortcon div.minfo' },
                                { name: '泡饭影视', link: 'http://www.chapaofan.com/search/' + dbzw, selector: 'div.content-side-left div.content-title + div.content-title' },
                                { name: '片源网', link: 'http://pianyuan.la/search?q=' + dbzw, selector: 'div.row ul.detail' },
                                { name: '迅雷影天堂', link: 'https://www.xl720.com/?s=' + dbzw, selector: '#content h3.entry-title' },
                                { name: '一只大榴莲', link: 'http://www.llduang.com/?s=' + dbzw, selector: 'div.mainleft div.info' },
                                { name: '音范丝', link: 'http://www.yinfans.me/?s=' + dbzw, selector: '#post_container div.article' },
                                { name: '中国高清网', link: 'http://gaoqing.la/?s=' + dbzw, selector: 'div.mainleft div.thumbnail' },
                            ]
                        });

                        if (is_movie) {
                            site_map.push({
                                name: "网盘搜电影",
                                label: [
                                    { name: '56网盘影', link: 'http://www.56wangpan.com/video/m1kw' + unititle, selector: 'div.title a' },
                                    { name: 'Pan58电影', link: 'http://www.pan58.com/s?wd=' + unititle + '&s=2&t=0&p=1', selector: `.filetext p.fname:contains(${unititle})` },
                                    { name: '大力盘电影', link: 'https://www.dalipan.com/search?type=1&keyword=' + unititle, selector: `h1.resource-title a:contains(${unititle})` },
                                    { name: '大圣盘电影', link: 'https://www.dashengpan.com/search?type=1&keyword=' + unititle, selector: `h1.resource-title a:contains(${unititle})` },
                                    { name: '凌风云电影', link: 'https://www.lingfengyun.com/search?wd=' + unititle + '&so_file=wang_pan&so_source=all_pan&so_ext=2&so_array=file_desc&so_accur=100', csrf: {name: "so_token", update:"link"}, rewrite_href: true, selector: '.x-box__text' },
                                    { name: '小昭来了影', link: 'https://www.xiaozhaolaila.com/s/search?q=' + unititle + '&currentPage=1&s=down&f=1', selector: `h4 a:contains(${unititle})` },
                                    { name: '一站搜电影', link: 'http://v.yizhansou.com/mv/search?kw=' + unititle, selector: 'table > tbody > tr:nth-child(2)' },
                                    { name: '云盘精灵影', link: 'https://www.yunpanjingling.com/search/' + unititle + '?filter_search=all&filter_mode=video&sort=size.desc', selector: 'div.search-list div.name' },
                                ]
                            });
                        }

                        if (is_document) {
                            site_map.push({
                                name: "纪录片下载站",
                                label: [
                                    { name: '盗火纪录片', link: 'http://www.daofire.com/search/titlesearch?keyword=' + unititle, selector: 'div.videos div.post_title' },
                                    { name: '纪录片天地', link: 'https://www.bing.com/search?q=site%3Awww.jlpcn.net+intitle%3A' + unititle, selector: '#b_content div.b_title' },
                                    { name: '熊猫盘纪录', link: 'http://xiongmaopan.com/search/' + unititle, selector: `h2 > a[title*='${unititle}']` },
                                ]
                            });
                        }
                        site_map.push({
                            name: "电影聚合搜索",
                            label: [
                                { name: 'DTorrent', link: 'https://dirtytorrents.com/torrents/?search=' + unititle, selector: '.topdiv .spanleft' },
                                { name: '疯狂影视', link: 'http://ifkdy.com/?q=' + unititle, selector: 'a span.site-name' },
                            ]
                        });
                        site_map.push({
                            name: "电影资源下载",
                            label: [
                                { name: '4K电影', link: 'https://4k-m.com/m/s.aspx?s=' + unititle, selector: 'div.list-pic div.txt' },
                                { name: '19影视', link: 'https://www.19kan.com/vodsearch.html?wd=' + unititle, selector: 'h1.fed-part-eone.fed-font-xvi a' },
                                { name: '66影视网', method: "post", link: 'https://www.66e.cc/e/search/index.php', data: `show=title%2Csmalltext&tempid=1&tbname=Article&keyboard=${gunititle}&submit=`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.listBox li" },
                                { name: '6V电影网', method: "post", link: 'http://www.6vhao.tv/e/search/index.php', data: `show=title%2Csmalltext&tempid=1&tbname=Article&keyboard=${gunititle}&Submit22=%E6%90%9C%E7%B4%A2`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.listBox li" },
                                { name: 'CK电影', link: 'http://www.ck180.net/search.html?q=' + unititle, selector: 'ul.serach-ul div.info' },
                                { name: 'LOL电影', link: 'http://www.993dy.com/index.php?m=vod-search&wd=' + unititle, selector: 'div.movielist a.play-img' },
                                { name: 'MP4电影', link: 'http://www.domp4.com/search/' + unititle + '-1.html', selector: `h2 a:contains(${unititle})` },
                                { name: 'OK资源网', link: 'http://www.okzyw.com/index.php?m=vod-search&wd=' + unititle, selector: 'div.xing_vb span.xing_vb4' },
                                { name: 'PianHD', link: 'http://www.pianhd.com/search/-------------.html?wd=' + unititle, selector: '.detail h3.title' },
                                { name: '比特影视', link: 'https://www.bteye.com/search/' + unititle, selector: '#main div.item' },
                                { name: '电影港', method: "post", link: 'http://so.dygang.com/e/search/index.php', data: `tempid=1&tbname=article&keyboard=${gunititle}&show=title%2Csmalltext&Submit=%CB%D1%CB%F7`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "table[width='100%'][border='0'][cellspacing='0'][cellpadding='0'] a.classlinkclass" },
                                { name: '电影天堂', method: "post", link: 'https://www.dy2018.com/e/search/index.php', data: `show=title%2Csmalltext&tempid=1&keyboard=${gunititle}&Submit=%C1%A2%BC%B4%CB%D1%CB%F7`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'div.co_content8 table' },
                                { name: '钉子电影', method: "post", link: 'http://www.dingzi66.com/q#search_' + unititle, data: `keyword=${unititle}`, csrf: { name: "_csrf", update: "data" }, headers: { "Content-Type": "application/x-www-form-urlencoded" }, selector: `h4 > a:contains(${unititle})` },
                                { name: '嘎嘎影视', link: 'http://www.gagays.xyz/movie/search?req%5Bkw%5D=' + unititle, selector: '#movie-sub-cont-db div.large-movie-detail' },
                                { name: '高清888', link: 'https://www.gaoqing888.com/search?kw=' + unititle, selector: 'div.wp-content div.video-row' },
                                { name: '高清电台', link: 'https://gaoqing.fm/s.php?q=' + unititle, selector: '#result1 div.row' },
                                //{ name: '狗哥电影', method: "post", link: 'https://www.gghd.cc/index.php?m=vod-search=wd=' +unititle, csrf: { name: "csrf_token", update: "link" }, headers: { "Content-Type": "application/x-www-form-urlencoded" }, ajax: "https://www.gghd.cc/index.php?m=vod-search=wd=" + unititle, headers: { "Content-Type": "application/x-www-form-urlencoded" }, selector: 'ul.topic-list div.index-topic-info' },
                                { name: "两个BT", link: 'https://www.bttwo.com/?s=' + unititle, selector: 'div.mi_cont h3.dytit' },
                                { name: '美剧鸟', link: 'http://www.meijuniao.com/search/?wd=' + unititle, selector: 'ul.serach-ul div.info' },
                                { name: '飘花资源网', link: 'https://www.piaohua.com/plus/search.php?kwtype=0&keyword=' + unititle, selector: 'div.container div.txt' },
                                { name: '下片片', link: 'http://search.xiepp.com/search.aspx?q=' + unititle, selector: 'div.searchlist h4.media-heading' },
                                { name: '新6V电影', method: "post", link: 'https://www.66s.cc/e/search/index.php', data: `show=title&tempid=1&tbname=article&mid=1&dopost=search&submit=&keyboard=${unititle}`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: '#post_container div.entry_post' },
                                { name: '迅播影院', link: 'http://www.22tu.tv/vodsearch/-------------/?wd=' + unititle + '&submit=%E6%90%9C+%E7%B4%A2', selector: 'ul.mlist div.info' },
                                { name: '影海', link: 'http://www.yinghub.com/search/list.html?keyword=' + unititle, selector: 'div.row div.info' },
                                { name: '影视看看', link: 'http://www.yskk7.com/index.php?m=vod-search&wd=' + unititle, selector: 'div.movielist li' },
                                { name: '悠悠MP4', link: 'https://www.uump4.net/search-' + uunititle + '.htm', selector: 'div.card-body2 div.dateline' },
                                { name: '宅腐资源站', link: 'http://www.zhaifu.tv/plus/search.php?kwtype=0&q=' + gunititle, selector: 'div.content a.focus' },
                                { name: '最新影视站', link: 'http://www.zxysz.com/?s=' + unititle, selector: '#content li.p-item' },
                            ]
                        });
                        site_map.push({
                            name: "BT国内网站",
                            label: [
                                { name: 'BT部落', link: 'http://www.btbuluo.com/s/' + unititle + '.html', selector: `h2 a:contains(${unititle})` },
                                { name: 'BT之家', link: 'https://www.btbtt.me/search-index-keyword-' + unititle + '.htm', selector: '#threadlist table' },
                                // { name: 'MVCAT', link: 'http://www.mvcat.com/search/?type=Title,subTitle,Tags&word=' + unititle, selector: 'h3.title' },
                                { name: 'MAG磁力', link: 'http://mag234.com/index/index?c=&k=' + unititle, selector: 'div.link-list-wrapper ul.link-list' },
                                { name: 'Tkitty', link: 'https://cn.torrentkitty.me/search/' + unititle, selector: `tbody td.name:not(:contains(没有结果))` },
                                { name: '小浣熊下载', link: `https://v1.xiaohx.org/search?key=${unititle}`, selector: `div.result_p a[title*='${unititle}']` },
                            ]
                        });
                        if (has_imdb) {
                            site_map.push({
                                name: "BT国外网站",
                                label: [
                                    { name: '1337X', link: 'https://1337x.to/search/' + ywm + '/1/', selector: 'table.table-list.table.table-responsive.table-striped td.coll-1.name' },
                                    //{ name: 'iDope', method: "post", link: 'https://idope.xyz/search-site/', data:`q=${ywm}&x=0&y=0`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'div.container div.opt-text-w3layouts' },
                                    { name: 'Lime', link: 'https://www.limetorrents.info/search/all/' + ywm, selector: 'table.table2 div.tt-name' },
                                    { name: 'Monova', link: 'https://monova.org/search?term=' + eng_title, selector: 'table.bordered.main-table td.torrent_name' },
                                    { name: 'Rutrack影', link: 'http://rutracker.org/forum/search_cse.php?q=' + ywm, ajax: `https://www.google.com/search?q=allintitle:+${ywm}+site:rutracker.org`,selector: 'div.rc h3' },
                                    { name: 'TorLock', link: 'https://www.torlock2.com/all/torrents/' + ywm.replace(/ /g, "-") + '.html', selector: 'table.table.table-striped.table-bordered.table-hover.table-condensed td.td' },
                                    { name: 'YTS', link: 'https://yts.am/browse-movies/' + eng_title, selector: 'div.row div.browse-movie-bottom' },
                                    { name: 'Кинозал', link: 'http://kinozal.tv/browse.php?s=' + ywm, selector: 'table.t_peer.w100p td.nam' },
                                    { name: '海盗湾', link: 'https://piratebay.live/search/' + ywm, selector: '#searchResult div.detName' },
                                ]
                            });
                        }

                        site_exist_status();
                    });
                } else if (location.host === "book.douban.com") {
                    let title = $('#wrapper > h1 > span')[0].textContent.replace(/[:\(].*$/, "");
                    let original_anchor = $('#info span.pl:contains("原作名")');
                    let original = original_anchor[0] ? fetch_anchor(original_anchor) : '';
                    let title_eng = title.match(/([a-zA-Z :,\(\)])+/);
                    let original_eng = original.match(/([a-zA-Z :,\(\)])+/);
                    let ywm = "";
                    if (title_eng) {
                        ywm = title;
                    } else if (original_eng) {
                        ywm = original.replace(/[:\(].*$/, "");
                    }
                    let has_ywm = title_eng + original_eng;
                    let stitle = ywm.toLowerCase().replace(/ /g, "-");
                    let is_writer = $('#info span.pl:contains("作者")').length > 0;
                    let writer = is_writer ? ' ' + $('#info span.pl:contains("作者")')[0].nextSibling.nextSibling.textContent.replace(/\[[^\]]+\]/g, '').replace(/（[^）]+）/g, '').replace(/^\s{1,}/g, '') : '';
                    let gtitle = _encodeToGb2312(title, true);
                    let ptitle = encodeURI(title).replace(/%/g, "%25");
                    let isbn_anchor = $('#info span.pl:contains("ISBN")');
                    let isbn = isbn_anchor[0] ? fetch_anchor(isbn_anchor) : '';

                    // 比较时无视英文名大小写
                    jQuery.expr[':'].Contains = function(a, i, m) {
                        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
                    };

                    function isbn13to10(str) {
                        //ISBN 10位和13位码互相转换
                        var s;
                        var c;
                        var checkDigit = 0;
                        var result = "";
                        s = str.substring(3,str.length);
                        for ( i = 10; i > 1; i-- ) {
                            c = s.charAt(10 - i);
                            checkDigit += (c - 0) * i;
                            result += c;
                        }
                        checkDigit = (11 - (checkDigit % 11)) % 11;
                        result += checkDigit == 10 ? 'X' : (checkDigit + "");
                        return ( result );
                    }

                    let isbn10 = isbn13to10 (isbn);

                    // 当前只对有isbn号的书籍开启中栏评分增强
                    if (isbn) {
                        let rating_more_hit = false;
                        $("div#interest_sectl").append(`<div class='rating_wrap clearbox' id='loading_more_rate'>加载第三方评价信息中.......</div>
                <div class="rating_wrap clearbox rating_amazon_cn" rel="v:rating" style="display:none"></div>
                <div class="rating_wrap clearbox rating_goodreads" style="display:none"></div>`);

                        if (GM_getValue("enable_book_amazon.cn_rate", true)) {
                            rating_more_hit = true;
                            // 通过ISBN信息在亚马逊中国上搜索
                            getDoc("https://www.amazon.cn/s/?url=search-alias%3Dstripbooks&field-keywords=" + isbn, null, function (doc) {
                                let result_0 = $('div[data-index="0"]', doc);
                                if (result_0.length > 0) { // 这本书在亚马逊中国上能搜索到
                                    let book_id_in_amazon = result_0.attr("data-asin");
                                    let book_url = "https://www.amazon.cn/dp/" + book_id_in_amazon;
                                    let vote_text = result_0.text().replace(/\n/g, " ");

                                    // 这是一个很取巧的获取方式，很可能因为页面结构更改而失效。 最近检查于 2019.09.25
                                    let _group = vote_text.match(/([\d.]+?) 颗星，最多 5 颗星 +([\d,]+)/);
                                    if (_group) {
                                        let _rating = _group[1];
                                        let _vote = _group[2];

                                        $('#interest_sectl div.rating_amazon_cn').html(starBlock("亚马逊中国", book_url, _rating, _vote, 5)).show();
                                    }
                                } else {
                                    $('#interest_sectl div.rating_amazon_cn').append(`<br>搜索亚马逊中国: <a target='_blank' href='${`https://www.amazon.cn/s?k=${encodeURI(title)}&i=stripbooks`}'>${title}</a>`);
                                }
                                $('#loading_more_rate').hide();
                            });
                        }

                        if (GM_getValue('enable_book_goodreads', false) && GM_getValue('apikey_goodreads', false)) {
                            rating_more_hit = true;
                            getJSON(`https://www.goodreads.com/book/review_counts.json?key=${GM_getValue('apikey_goodreads', '')}&format=json&isbns=${isbn}`, function (data) {
                                try {
                                    let book = data['books'][0];

                                    let goodread_id = book['id'];
                                    let goodread_url = `https://www.goodreads.com/book/show/${goodread_id}`;
                                    let rating = book['average_rating'];
                                    let vote = book['work_ratings_count'];
                                    $('#interest_sectl div.rating_goodreads').html(starBlock("GoodReads", goodread_url, rating, vote, 5)).show();
                                } catch (e) {
                                    $('#interest_sectl div.rating_goodreads').append(`<br>搜索GoodReads: <a target='_blank' href='${`https://www.goodreads.com/search?q=${encodeURI(title)}`}'>${title}</a>`);
                                }
                                $('#loading_more_rate').hide();
                            });
                        }

                        if (!rating_more_hit) {
                            $('#loading_more_rate').hide();
                        }
                    }

                    if (_version === "完整版") {
                        site_map.push({
                            name: "会员精准匹配",
                            label: [
                                { name: "iKanshu", link: "https://ikanshu.org/search?q=" + isbn, csrf: {name: "token", update:"link"}, rewrite_href: true, selector: "div.book-wrapper div.book-info" },
                                { name: "mLook", link: "http://plugin.mlook.mobi/search?q=" + isbn, selector: "div.books div.fl.meta" },
                            ]
                        });
                        site_map.push({
                            name: "图书会员网站",
                            label: [
                                { name: "ePUBee", method: "post", type: "json", link: "http://cn.epubee.com/books/?s=" + title, ajax: "http://cn.epubee.com/keys/get_ebook_list_search.asmx/getSearchList", data: `{skey:'${title}'}`, headers: { "Content-Type": "application/json; charset=UTF-8" }, selector: "d.length > 0" },
                                { name: 'IRead', link: 'http://www.iread.cf/?query=' + title, selector: 'li.book-item div.book-info' },
                                { name: "Kindle88", link: "http://www.kindle88.com/?s=" + title + writer, selector: "div.widget-content li.archive-thumb" },
                                { name: 'iamtxt', method: "post", link: 'http://www.iamtxt.com/e/search/index.php', data: `keyboard=${title}&show=title&tempid=2`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'div.row div.title' },
                                { name: "skEbooks", link: "https://skebooks.com/q?type=1&keyword=" + title, selector: "tbody a.book-tip" },
                                { name: "爱分享读书", link: "http://www.ishareread.com/searchbook.htm?keyWords=" + title, selector: `div.searchbooklist_bookitem div.author_container:contains(${writer.trim()})` },
                                { name: "拜读", link: "http://orzbook.com/?s=" + title + writer, selector: "#primary div.entry-content" },
                                { name: "必看网", link: "https://www.biikan.com/home/book/search.shtml?k=" + title, selector: "div.bookList.clearfix a.bookListImg" },
                                { name: "缤闹", method: "post", link: "http://www.binnao.com/search.php?mod=forum", data: `srchtxt=${title}${writer}&searchsubmit=yes`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "#threadlist li.pbw" },
                                { name: '布克书屋', link: 'https://www.bukebook.cn/?s=' + title, selector: `a[rel='bookmark']:contains(${title})` },
                                { name: "点书网", method: "post", link: "http://dianbook.cc/search.php?mod=forum", data: `srchtxt=${title}${writer}&searchsubmit=yes`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.tl li.pbw" },
                                { name: "看豆178", link: "http://www.seo630.com/search.aspx?book=" + title, selector: "div.search-list div.book" },
                                { name: "慢慢游书", link: 'https://mmy.la/search.php?mod=forum&searchsubmit=yes&srchtxt=' + title, selector: "div.tl li.pbw", selector_need_login: "#messagelogin" },
                                { name: "万千合集站", link: "http://www.hejizhan.com/bbs/?kw=" + title, selector: "div.container p.title" },
                                { name: "我的书屋", method: "post", link: "http://www.wode5.com/e/search/index.php", data: `tbname=book&tempid=1&show=title%2Csoftwriter%2Csoftsay&ecmsfrom=9&keyboard=${title}&submit=`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.am-u-sm-9.search-content div.item_info.am-fl", selector_need_login: "div[align='center'] > b:contains('权限')" },
                                { name: "我要读PDF", method: "post", link: "http://www.51dupdf.com/search.php?mod=forum", data: `srchtxt=${gtitle}&searchsubmit=yes`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.tl li.pbw" },
                                { name: "盘乐网书", link: 'http://www.pan6.com/search.php?mod=forum&searchsubmit=yes&srchtxt=' + title, selector: "div.tl li.pbw" },
                            ]
                        });
                    }
                    site_map.push({
                        name: "图书在线试读",
                        label: [
                            { name: '多看阅读', link: `http://www.duokan.com/search/${title}${writer}`, selector: `div.wrap > a:contains(${title}) ~ div.u-author > span:contains(${writer.trim()})` },
                            { name: '京东数字', link: `https://s-e.jd.com/Search?enc=utf-8&key=${title}${writer}`, selector: 'div.p-name a' },
                            { name: '亚马逊商店', link: 'https://www.amazon.cn/s?i=digital-text&k=' + isbn, selector: 'div.sg-col-inner h2' },
                        ]
                    });
                    site_map.push({
                        name: "图书精准匹配",
                        label: [
                            { name: 'B-OK', link: 'http://b-ok.cc/s/?e=1&q=' + isbn, selector: '#searchResultBox a.tdn' },
                            { name: "DownBooks", link: "http://download-books.com/?s=" + isbn, selector: "div.entry-content div.content" },
                            { name: "EBH", link: "http://ebookhunter.ch/search/?keyword=" + isbn, selector: "#mains_left div.index_box_title.list_title" },
                            { name: "LibGen", link: "http://gen.lib.rus.ec/search.php?column=title&req=" + isbn, selector: "table[rules='rows'] td[width='500']" },
                            { name: 'SoBooks', link: 'https://sobooks.cc/search/' + isbn, selector: `h3 > a[title*='${title}'], h1.article-title a` },
                            { name: '科学文库', link: 'http://book.sciencereading.cn/shop/book/Booksimple/list.do?showQueryModel.nameIsbnAuthor=' + isbn, selector: 'div.book_detail_title b.kc_title' },
                            { name: '每日书单', link: 'https://shudan.vip/search/' + isbn, selector: `h3 > a[title*='${title}'], h1.article-title a` },
                            { name: '图书馆联盟', link: 'http://book.ucdrs.superlib.net/search?Field=all&channel=search&sw=' + isbn, selector: '#leftcommon + td table.book1' },
                            { name: '云海图书馆', link: 'http://www.pdfbook.cn/?s=' + isbn, selector: '#main a.out' },
                        ]
                    });
                    site_map.push({
                        name: "图书网盘精准",
                        label: [
                            { name: 'Downtr❏', link: 'https://downtr.cc/?do=search&subaction=search&story=' + isbn10, selector: '#dle-content div.title', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'FilmSoft❏', link: 'http://filmsofts.com/?do=search&subaction=search&story=' + isbn10, selector: '#dle-content div.story', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'Freshwap❏', link: 'http://www.freshwap.cc/?do=search&subaction=search&story=' + isbn10, selector: '#dle-content div.maincont', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'OneDDL❏', link: 'https://oneddl.org/?do=search&subaction=search&story=' + isbn10, selector: '#dle-content div.con', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'SoftArch❏', link: 'https://sanet.st/search/?category=any&filehosting=any&isbn=' + isbn10, selector: 'div.titles_list_box a.cellMainLink', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'WarezSer❏', link: 'http://warez-serbia.com/index.php?do=search&subaction=search&story=' + isbn10, selector: '#dle-content div.post-info', selector_need_login: "h1 span:contains('Checking your browser')" },
                            { name: 'Win7DL❏', link: 'https://win7dl.org/?do=search&subaction=search&story=' + isbn10, selector: '#dle-content td.block_head_2', selector_need_login: "h1 span:contains('Checking your browser')" },
                        ]
                    });
                    site_map.push({
                        name: "图书免费网站",
                        label: [
                            { name: 'ePUBw', link: 'https://epubw.com/?s=' + title, selector: `img[referrerpolicy='no-referrer'][title*='${title}']` },
                            { name: 'LoreFree', link: 'http://ebook.lorefree.com/site/index?s=' + title, selector: 'div.body-content div.caption.book-content' },
                            { name: 'SaltTiger', link: 'https://salttiger.com/?s=' + title, selector: `h1.entry-title > a:contains(${title})` },
                            { name: '超级书库', link: 'https://shuayouxi.cn/?s=' + title, selector: `h2 a[title*='${title}']` },
                            { name: '高清PDF', link: 'https://hdpdf.blog/?s=' + title, selector: '#main h1.entry-title' },
                            { name: "苦瓜书盘", method: "post", link: "https://www.kgbook.com/e/search/index.php", data: `keyboard=${title}&show=title%2Cbooksay%2Cbookwriter&tbname=download&tempid=1&submit=%E6%90%9C%E7%B4%A2`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.small-12.columns span.text" },
                            { name: '内酷网', link: 'http://neikuw.com/?s=' + title, selector: 'div.container h2.post-title' },
                            { name: '偶书', link: 'https://obook.cc/?search-' + title + '.htm', selector: 'div.card-body li.media' },
                            { name: '台大图书馆', link: 'http://ebooks.lib.ntu.edu.tw/Home/ListBooks?type=KeywordSearch&h_tag=&pageNumber=1&searchTopic=title&record_per_page=10&send=%E6%9F%A5%E8%A9%A2&keyword=' + title, selector: 'tbody td.content' },
                            { name: '小浣熊图书', link: `https://www.xiaohx.org/search?cat=9&key=${title}`, selector: `div.result_p a[title*='${title}']` },
                            { name: '雅书', link: 'https://yabook.org/search.php?q=' + title, selector: 'div.main div.postinfo' },
                            { name: '夜读客', link: 'https://www.yeduk.com/search?name=' + title, selector: 'div.media-body h4.media-heading' },
                            { name: '中国哲学书', link: 'https://ctext.org/searchbooks.pl?if=gb&remap=gb&searchu=' + title, selector: 'ul.searchres div.ctext' },
                            { name: '周读', link: 'http://www.ireadweek.com/index.php?g=portal&m=search&a=index&keyword=' + title, selector: 'ul.hanghang-list a' },
                            { name: '子乌书简', link: 'https://5kindle.com/?s=' + title, selector: `h3 a:contains(${title})` },
                        ]
                    });
                    if (has_ywm) {
                        site_map.push({
                            name: "图书国外网站",
                            label: [
                                { name: 'BookFl', link: 'http://en.bookfi.net/s/?e=1&q=' + ywm, selector: `#searchResultBox h3.color1:Contains(${ywm})` },
                                { name: 'Booksee', link: 'http://en.booksee.org/s/?e=1&q=' + ywm, selector: `#searchResultBox h3.color1:Contains(${ywm})` },
                                { name: 'EPDF', link: 'https://epdf.tips/search/' + ywm, selector: `h3.note-title:Contains(${ywm})` },
                                { name: 'PDFDrive', link: 'https://www.pdfdrive.com/search?q=' + ywm, selector: `div.file-right a[href*='${stitle}']` },
                            ]
                        });
                    }
                    site_map.push({
                        name: "图书搜索引擎",
                        label: [
                            { name: '56网盘书', link: 'http://www.56wangpan.com/search/o2kw' + title, selector: `div.title > a[title*='${title}']` },
                            { name: '爱问资料', link: `http://ishare.iask.sina.com.cn/search/0-0-all-1-default?cond=${ptitle}`, selector: 'ul.landing-txt-list h4.data-name' },
                            { name: '凌风云搜书', link: 'https://www.lingfengyun.com/search?wd=' + title + '&so_file=wang_pan&so_source=all_pan&so_ext=4&so_array=&so_accur=100', csrf: {name: "so_token", update:"link"}, rewrite_href: true, selector: '.x-box__text' },
                            { name: '小白盘图书', link: 'http://www.xiaobaipan.com/list-' + title + '.html?order=size', selector: 'h4.job-title a' },
                            { name: '云盘精灵书', link: 'https://www.yunpanjingling.com/search/' + title + '?filter_mode=ebook', selector: 'div.search-list div.name' },
                        ]
                    });
                    site_map.push({
                        name: "有声在线试听",
                        label: [
                            { name: '懒人听书', link: 'http://www.lrts.me/search/book/' + title, selector: 'ul li.book-item' },
                            { name: '评书吧', link: 'http://www.pingshu8.com/search/1.asp?keyword=' + gtitle, selector: "table.TableLine div[align='left']" },
                            { name: '天方听书网', link: 'http://www.tingbook.com/Book/SearchResult.aspx?keyword=' + title, selector: 'ul.search_result_list h4.clearfix' },
                            { name: '听中国', link: 'http://www.tingchina.com/search1.asp?mainlei=0&lei=0&keyword=' + gtitle, selector: 'dl.singerlist1 li' },
                            { name: '喜马有声', link: 'https://www.ximalaya.com/search/' + title + '/', selector: `div.xm-album-cover__wrapper + a[title*='${title}']` },
                        ]
                    });
                    site_map.push({
                        name: "图书有声网站",
                        label: [
                            { name: 'ABB', link: 'http://audiobookbay.nl/?s=' + title, selector: '#content div.postTitle' },
                            { name: '趣听书', link: 'http://qutingshu.com/?s=' + title, selector: 'ul.books-list li' },
                            { name: '小浣熊有声', link: `https://www.xiaohx.org/search?cat=5&key=${title}`, selector: `div.result_p a[title*='${title}']` },
                        ]
                    });
                } else if (location.host === "music.douban.com") {
                    // 页面元素定位
                    let album_anchor = $('#info span.pl:contains("专辑类型")');  //专辑类型
                    let medium_anchor = $('#info span.pl:contains("介质")');  //介质
                    let album = album_anchor[0] ? fetch_anchor(album_anchor) : '';
                    let is_single = album.match(/单曲/);
                    let title = $('#wrapper > h1 > span')[0].textContent.split(' ').shift().replace(/[，]/g, " ").replace(/：.*$/, "");
                    let gtitle = _encodeToGb2312(title, true);
                    let ptitle = encodeURI(title).replace(/%/g, "%25");
                    let singer = ' ' + $('#info > span > span.pl > a')[0].textContent;
                    let gsinger = _encodeToGb2312(singer, true);
                    if (_version === "完整版") {
                        site_map.push({
                            name: "PT音乐顶配",
                            label: [
                                { name: "CHDBits♬", link: 'https://chdbits.co/torrents.php?cat406=1&cat408=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "CMCT♬", link: "https://hdcmct.org/torrents.php?cat508=1&incldead=1&search_area=1&notnewword=1&search=" + title + singer, },
                                { name: "HDChina♬", link: 'https://hdchina.org/torrents.php?cat408=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, selector: "table.torrent_list:last > tbody > tr:gt(0)" },
                                { name: "HDSky♬", link: 'https://hdsky.me/torrents.php?cat408=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "MTeam♬", link: 'https://pt.m-team.cc/torrents.php?cat408=1&cat434=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "OpenCD♬", link: 'https://open.cd/torrents.php?incldead=1&search_area=0&notnewword=1&search=' + title + singer, selector: "table.torrents:last > tbody > tr:gt(0)" },
                                { name: "OurBits♬", link: 'https://ourbits.club/torrents.php?cat=416&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "TTG♬", link: 'https://totheglory.im/browse.php?c=M&notnewword=1&search_field=分类%3A%60无损音乐FLAC%26APE%60+分类%3A%60%28电影原声%26Game%29OST%60 ' + title + singer, selector: "table#torrent_table:last > tbody > tr:gt(0)" },
                                { name: "U2♬", link: 'https://u2.dmhy.org/torrents.php?cat30=1&incldead=1&search_area=0&notnewword=1&search=' + title.split(' ')[0], },
                            ]
                        });
                        site_map.push({
                            name: "PT音乐标配",
                            label: [
                                { name: "HDCity♬", link: 'https://hdcity.city/pt?cat408=1&incldead=1&search_area=1&notnewword=1&iwannaseethis=' + title + singer, selector: "center > div > div > div.text" },
                                { name: "HDHome♬", link: 'https://hdhome.org/torrents.php?cat439=1&cat440=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "HDTime♬", link: 'https://hdtime.org/torrents.php?cat=408&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "JoyHD♬", link: 'https://www.joyhd.net/torrents.php?cat=414&incldead=1&search_area=1&notnewword=1&search=' + title + singer, },
                            ]
                        });
                        site_map.push({
                            name: "PT音乐教育",
                            label: [
                                { name: "NYPT♬", link: 'https://nanyangpt.com/torrents.php?cat407=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, selector: "table.torrents:last > tbody > tr" },
                                { name: "SJTU♬", link: 'https://pt.sjtu.edu.cn/torrents.php?cat420=1&cat421=1&cat422=1&cat423=1&cat425=1&cat426=1&incldead=1&search_area=1&notnewword=1&search=' + title + singer, selector: "table.torrents:last > tbody > tr" },
                            ]
                        });
                        site_map.push({
                            name: "PT音乐外站",
                            label: [
                                { name: "JPOP♬", link: 'https://jpopsuki.eu/torrents.php?searchstr=' + title + singer, selector: "#torrent_table > tbody > tr:gt(0)" },
                                { name: "Orpheus♬", link: 'https://orpheus.network/torrents.php?searchstr=' + title + singer, selector: "#torrent_table:last > tbody > tr.group_torrent:gt(0)" },
                                { name: "Red♬", link: 'https://redacted.ch/torrents.php?searchstr=' + title + singer, selector: "#torrent_table > tbody > tr.group_torrent:gt(0)" },
                                { name: "Waffles♬", link: 'https://waffles.ch/browse.php?q=' + title + singer, selector: "#browsetable:last > tbody > tr:gt(0)" },
                            ]
                        });
                        site_map.push({
                            name: "音乐论坛资源",
                            label: [
                                { name: "AIPT♬", link: 'http://pt.aipt123.org/table_list.php?search_area=1&notnewword=1&search=' + title + singer, },
                                { name: "磨坊", method: "post", link: "http://www.moofeel.com/search.php?mod=forum", data: `srchtxt=${gtitle}${gsinger}&searchsubmit=yes`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: "div.tl li.pbw" },
                                { name: "无损音乐网", link: 'https://www.so.com/s?q=site%3Awusunyinyue.cn+intitle:' + title + '%26%26' + singer.trim(), selector: 'ul.result li.res-list' },
                                { name: "盘乐网音", link: 'http://www.pan6.com/search.php?mod=forum&searchsubmit=yes&srchtxt=' + title, selector: "div.tl li.pbw" },
                                { name: "炫音音乐", link: `http://so.musicool.cn/cse/search?s=10523158750213826925&q=${title}${singer}`, selector: "#results h3.c-title" },
                            ]
                        });
                    }
                    site_map.push({
                        name: "在线音乐播放",
                        label: [
                            { name: 'QQ音乐', link: 'https://y.qq.com/portal/search.html#page=1&searchid=1&remoteplace=txt.yqq.top&t=album&w=' + title + singer, ajax: "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?t=8&format=json&w=" + title + singer, type: "json", selector: 'data.album.totalnum > 0' },
                            { name: '百度音乐', link: 'http://music.baidu.com/search/album?key=' + title + singer, selector: '#album_list div.album-info' },
                            { name: '酷我音乐', link: 'http://sou.kuwo.cn/ws/NSearch?type=album&key=' + title + singer, selector: 'div.album p.musicName' },
                            { name: '咪咕音乐', link: `http://music.migu.cn/v2/search?type=album&keyword=${title}${singer}`, selector: `div.album-name font:contains(${title})` },
                            { name: '虾米音乐', link: `https://www.xiami.com/search/album/?key=${title}${singer}`, selector: `p.name > a[title='${title}'] + a[title='${singer.trim()}']` },
                            { name: '网易云音乐', link: 'https://music.163.com/#/search/m/?type=10&s=' + title + singer, ajax: "https://api.imjad.cn/cloudmusic/?type=search&s=" + title + singer, type: "json", selector: 'result.songCount > 0' },
                        ]
                    });
                    if (is_single) {
                        site_map.push({
                            name: "单曲无损网站",
                            label: [
                                { name: '51Ape', link: 'https://www.bing.com/search?q=site%3Awww.51ape.com+intitle%3A' + title + '+intitle%3A' + singer, selector: '#b_content div.b_caption' },
                            ]
                        });
                    }
                    site_map.push({
                        name: "音乐免费网站",
                        label: [
                            { name: 'DTShot', link: 'http://www.dtshot.com/search/' + title + singer + '/', selector: `div.case_info div.meta-title:contains(${title})` },
                            { name: 'XZPC音乐', method: "post", link: 'http://www.xzpc6.com/#search_' + title, ajax: 'http://www.xzpc6.com/sou.php', data: `key=${title}`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, selector: 'p a' },
                            { name: '爱无损', link: 'http://www.lovewusun.com/?s=' + title + singer, selector: '#main h2.entry-title' },
                            { name: '小浣熊音乐', link: `https://www.xiaohx.org/search?cat=5&key=${title}${singer}`, selector: `div.result_p a[title*='${title}']` },
                        ]
                    });
                    site_map.push({
                        name: "音乐国内网盘",
                        label: [
                            { name: '56网盘音', link: 'http://www.56wangpan.com/search/o2kw' + title + singer, selector: `div.title > a[title*='${title}']` },
                            { name: '凌风云搜音', link: 'https://www.lingfengyun.com/search?wd=' + title + singer + '&so_file=wang_pan&so_source=all_pan&so_ext=&so_array=file_desc&so_accur=100', csrf: {name: "so_token", update:"link"}, rewrite_href: true, selector: '.x-box__text' },
                            { name: '小白盘音乐', link: 'http://www.xiaobaipan.com/list-' + title + '.html?order=size', selector: 'h4.job-title a' },
                            { name: '云盘精灵音', link: 'https://www.yunpanjingling.com/search/' + title + singer + '?sort=size.desc', selector: 'div.search-list div.name' },
                        ]
                    });
                    site_map.push({
                        name: "音乐国外网盘",
                        label: [
                            { name: 'AvaxHome♬', link: 'https://tavaz.xyz/search/?category_slug=music&query=' + title + singer, selector: 'div.col-xs-12.col-sm-8.col-md-8.col-lg-8 div.panel-heading' },
                            { name: 'Rutrack♬', link: 'http://rutracker.org/forum/search_cse.php?q=' + title, ajax: `https://www.google.com/search?q=allintitle:+${title}+site:rutracker.org`,selector: 'div.rc h3' },
                        ]
                    });
                }

                // 检查站点是否需要登陆的方法 res 应该是GM_xmlhttpRequests返回对象 ，返回bool值，true时为需要登陆
                function login_check(res) {
                    let need_login = false;
                    if (/login|verify|checkpoint|returnto/ig.test(res.finalUrl)) {
                        need_login = true;  // 检查最终的URL看是不是需要登陆
                    } else if (/refresh: \d+; url=.+login.+/ig.test(res.responseHeaders)) {
                        need_login = true;  // 检查responseHeader有没有重定向
                    } else {
                        let responseText = res.responseText;
                        if (typeof responseText === "undefined") {
                            need_login = true;  // 检查最终的Text，如果什么都没有也可能说明需要登陆
                        } else if (responseText.length < 800 && /login|not authorized/.test(responseText)) {
                            need_login = true;  // 对Text进行检查，断言“过短，且中间出现login字段”即说明可能需要登陆
                        }
                    }
                    return need_login;
                }

                function Exist_check(label) {
                    let site = label.name;
                    let psite = $(`a[data-name="${site}"]`);

                    function HideTag() {
                        if (GM_getValue('enable_adv_auto_hide',false)) {
                            $(psite).hide();
                        }
                    }

                    function TagExist(link) {
                        $(psite).css("background-color", GM_getValue("tag_bcolor_exist", "#e3f1ed"));
                        $(psite).css("color", GM_getValue("tag_fcolor_exist", "#3377aa"));
                        $(psite).attr("title", "资源存在");
                        let storage_data = true;
                        if (label.rewrite_href && label.rewrite_href === true) {   // 重写链接
                            storage_data = cache.get(site, link || $(psite).attr("href"));
                            $(psite).attr("href", storage_data);
                        }
                        cache.add(site, storage_data);
                    }

                    function TagNotExist() {
                        $(psite).css("background-color", GM_getValue("tag_bcolor_not_exist", "#f4eac2"));
                        $(psite).css("color", GM_getValue("tag_fcolor_not_exist", "#3377aa"));
                        $(psite).attr("title", "资源不存在");
                        $(psite).css("display", "none");
                        HideTag();
                    }

                    function TagNeedLogin() {
                        $(psite).css("background-color", GM_getValue("tag_bcolor_need_login", ""));
                        $(psite).css("color", GM_getValue("tag_fcolor_need_login", "#3377aa"));
                        need_login_cache.add(site, true);
                        $(psite).click(function () {
                            need_login_cache.del(site);
                        });
                        $(psite).attr("title", "站点需要登陆");
                        HideTag();
                    }

                    function TagError(errtype) {
                        $(psite).css("background-color", GM_getValue("tag_bcolor_error", ""));
                        $(psite).css("color", GM_getValue("tag_fcolor_error", "#3377aa"));
                        $(psite).attr("title", "遇到问题" + (errtype ? (" - " + errtype) : ""));
                        $(psite).css("display", "none");
                        HideTag();
                    }

                    // 这里假定有这个资源的就一直都有，直接使用第一次请求成功的时候缓存信息
                    if (cache.get(site)) { TagExist(); return; }

                    // 如果前次检查到这个站点需要登陆
                    if (need_login_cache.get(site)) { TagNeedLogin(); return; }

                    // 不然，则请求相关信息

                    // 重写请求参数
                    //if (typeof label.data === "object") {
                    //    let myData = new FormData();
                    //    for (let k in label.data) {
                    //        myData.append(k,label.data.k);
                    //    }
                    //    label.data = myData;
                    //}

                    // 请求核心方法
                    function check_core(label) {
                        GM_xmlhttpRequest({
                            method: label.method || "GET",
                            url: label.ajax || label.link,
                            data: label.data,
                            headers: label.headers,
                            timeout: 45e3,    // 默认45s服务器无响应算超时
                            onload: function (res) {
                                if (login_check(res)) {
                                    TagNeedLogin();
                                } else {
                                    try {// 开始解析返回信息
                                        let responseText = res.responseText;
                                        if (label.type && ["json", "jsonp"].includes(label.type)) { // 如果前面定义了返回类型是"json'或者"jsonp"
                                            if (label.type === "jsonp") {
                                                responseText = responseText.match(/[^(]+\((.+)\)/)[1];
                                            }
                                            let par = JSON.parse(responseText);
                                            if (eval("par." + label.selector)) {
                                                TagExist();
                                            } else {
                                                TagNotExist(); // 所有情况都失败则未存在
                                            }
                                        } else {  // 否则默认label.type的默认值为 html
                                            let doc = page_parser(res.responseText);
                                            let body = doc.querySelector("body");
                                            // 因为jQuery的选择器丰富，故这里不用 dom.querySelector() 而用 jQuery.find()
                                            if (label.selector_need_login && $(body).find(label.selector_need_login).length) {
                                                TagNeedLogin(); // 如果存在selector_need_login选择器，则先判断是否存在以确定是否需要登录
                                            } else if ($(body).find(label.selector || "table.torrents:last > tbody > tr:gt(0)").length) {
                                                TagExist(res.finalUrl);  // 最后使用selector选择器判断资源是否存在
                                            } else {
                                                TagNotExist(); // 所有情况都失败则未存在
                                            }
                                        }
                                    } catch (e) {
                                        TagError("解析错误");
                                    }
                                }
                            },
                            onerror: function () { TagError("请求故障"); },
                            ontimeout: function () { TagError("请求超时"); },
                        });
                    }

                    // 请求动作方法
                    function check_func() {
                        $(psite).attr("title", "正在请求信息中");
                        if (label.csrf) {  // 对某些启用了csrf的站点，先使用正常方式请求一次获取csrf值
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: label.link,
                                timeout: 45e3,    // 默认45s服务器无响应算超时
                                onload: function (res) {
                                    if (!login_check(res)) {
                                        try {
                                            let doc = page_parser(res.responseText);
                                            let csrf_ = $(`input[name='${label.csrf.name}'`, doc);
                                            let csrf_key = csrf_.attr("value");  // 获取csrf值
                                            label[label.csrf.update] += `&${label.csrf.name}=${csrf_key}`;   // 更新对应选项
                                            check_core(label);
                                        } catch (e) {
                                            TagError("解析故障");
                                        }
                                    }
                                },
                                onerror: function () { TagError("请求错误"); },
                                ontimeout: function () { TagError("请求超时"); },
                            });
                        } else {
                            check_core(label);
                        }
                    }

                    // 根据设置，是自动请求还是鼠标移动时在做请求
                    if (GM_getValue("enable_adv_auto_search", true)) {
                        check_func();
                    } else {
                        $(psite).mouseenter(function(e){  // 鼠标进入时才自动搜索并反馈
                            if ($(psite).attr('title') == 'empty') {  // 防止重复请求
                                check_func();
                                $(psite).unbind('mouseenter');
                            }
                        });
                    }
                }

                function site_exist_status() {
                   // $("#drdm_req_status").show();
                    for (let i = 0; i < site_map.length; i++) {
                        let map_dic = site_map[i];
                        if (GM_getValue(delete_site_prefix + map_dic.name, false)) {
                            continue;
                        }
                        $('#adv-sites').append(`<div class="c-aside name-offline" data-id="${i}"><h2><i>${map_dic.name}</i>· · · · · ·</h2><div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>`);

                        let in_site_html = $(`div[data-id='${i}'] ul.bs`);
                        for (let j = 0; j < map_dic.label.length; j++) {
                            let label = map_dic.label[j];
                            if (GM_getValue(delete_site_prefix + label.name, false)) {
                                continue;
                            }
                            in_site_html.append(`<a href="${label.link}" data-name="${label.name}" target="_blank" rel="nofollow" class="name-offline" title="empty">${label.name}</a>`);
                            Exist_check(label);
                        }
                    }

                    update_status_interval = window.setInterval(update_req_status, 1e3);

                    if (!GM_getValue("enable_adv_auto_search", true)) {
                        $("#drdm_req_status_hide").click();
                    }
                }

            }

            // 脚本页面切换方法
            function wrapper_change(id, html, callback) {
                if ($(`div#wrapper > div#${id}`).length === 0) {
                    $('div#wrapper').append(html);
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                let ele_inst = $(`div#wrapper > div#${id}`);
                ele_inst.siblings("div").hide();
                ele_inst.show();
            }

            // 加载豆列搜索
            if (GM_getValue("enable_doulist_search", true)) {
                $('div.nav-items ul').append('<li><a id="search_dlist" href="javascript:void(0);">豆列搜索</a></li>');
                $("#search_dlist").click(function () {
                    let int_html = `<div id='drdm_doulist'><h1>豆列搜索</h1><div class="grid-16-8 clearfix"><div class="article"><div class="indent"><div class="movie-list"></div><a class="more" href="javascript:;" style="display:none">加载更多</a></div></div><div class="aside"><div><h2>豆列搜索 · · · · · ·</h2><div><span><p><div id="form-doulist"><input class="doulist" id="input-doulist" placeholder="Criterion, 46534919, ..." value=""</input><input type="submit" id="doulist-submit" value="search" /input></div></p></span><span style="" class="search_result c-aside-body"></span></div></div><div class="doulist_intro"><h2>豆列搜索说明 · · · · · ·</h2><p>输入你想搜的关键词，点击搜索。就这么简单。</p></div></div></div></div>`;
                    wrapper_change("drdm_doulist", int_html, function () {
                        let load_more = $("#drdm_doulist a.more");
                        $('#doulist-submit').click(function () {
                            let doulist = $("#input-doulist").val();
                            $('div.movie-list').html("");
                            let get_doulist = function (doulist, page) {
                                load_more.text("加载中......").show();
                                getDoc('https://cn.bing.com/search?q=site%3awww.douban.com%2fdoulist+' + doulist + '&first=' + page, null, function (doc, res, meta) {
                                    let result = $('ol#b_results .b_algo', doc);
                                    result = result.filter(function () {
                                        return $("a[href^='https://www.douban.com/doulist/']", this).length > 0;
                                    });
                                    if (result.length === 0) {
                                        load_more.text('没有找到相关豆列');
                                    }
                                    else {
                                        result.each(function () {
                                            let title = $(this).find("a[href^='https://www.douban.com/doulist/']");
                                            let caption = $(this).find("div.b_caption");

                                            let id = title.attr("href").match(/doulist\/(\d+)/)[1];
                                            let title_clean = title.text().replace(/(\(豆瓣\)|\s-\s豆瓣电影|\s-\s豆瓣)/, '').replace(/ - douban.com/, '');
                                            caption.find("div.b_attribution").remove();
                                            let detail = caption.html();

                                            if ($(`div.movie-list > div[data-dlist=${id}]`).length === 0) {  // 重复的不再插入
                                                $('div.movie-list').append(`<div data-dlist="${id}"><div><h2 style="font-size:13px;"><a href="https://www.douban.com/doulist/${id}" target="_blank">${title_clean}</a></h2><div></div></div><div class="tags">${detail}<p class="ul"></p></div></div>`);
                                            }
                                        });

                                        // 更新加载信息
                                        let load_id = page + 10;
                                        load_more.text('加载更多');
                                        load_more.one("click", function () {
                                            get_doulist(doulist, load_id);
                                        });
                                    }
                                });
                            }
                            get_doulist(doulist, 1);
                        });
                    });
                });
            }

            // 脚本设置
            $("#db-global-nav > div > div.top-nav-info").append(`<a href="javascript:;" id="drdm_setting_btn">脚本设置</a>`);
            $("#drdm_setting_btn").click(function () {
                let int_html = `<div id='drdm_setting'><h2>脚本设置界面正在开发中，请等待完善......</h2></div>`;
                wrapper_change("drdm_setting", int_html, function () {
                    // TODO 评分信息，豆列搜索等杂项功能启用情况
                    let config_setting = "<h1>脚本基本功能启用状况</h1><dl class='drdm-dl-horizontal'>";

                    function config_setting_gen(name, key, note, def = true) {
                        config_setting += `<dt>${name}</dt><dd><input type="checkbox" id="drdm_config_${key}" ${GM_getValue(key, def) ? 'checked' : ''} data-config="${key}"><label for="drdm_config_${key}"></label> ${note} </dd>`;
                    }
                        config_setting_gen("豆列搜索", "enable_doulist_search", "对豆列进行搜索（通过\`cn.bing.com\`搜索）");
                        config_setting_gen("电影简介生成", "enable_mediainfo_gen", "生成符合PT站点电影简介信息（Mediainfogen格式）", false);
                        config_setting_gen("各类排行榜", "enable_top_rang_tag", `显示来自 <a href="https://github.com/bimzcy/rank4douban">bimzcy/rank4douban</a> 的各种排行榜`);
                        config_setting_gen("启用全站自动搜索", "enable_adv_auto_search", "启用可让脚本自动搜索全部站点（会消耗CPU及网络资源），不启用则仅当鼠标移至对应站点时搜索");
                        config_setting_gen("自动隐藏搜索失败站点","enable_adv_auto_hide","搜索时自动隐藏搜索失败（资源不存在,需要登陆,遇到问题）站点，默认关闭", false);
                        config_setting_gen("搜索完成后隐藏提示条","enalbe_adv_auto_tip_hide","搜索结束后自动隐藏搜索情况提示条，默认关闭且不建议开启", false);
                        config_setting_gen("展示IMDB增强信息", "enable_imdb_ext_info", "展示制片成本、本国首周票房、北美首周票房、总票房等来自IMDb的影片增强信息");
                        config_setting_gen("烂番茄评分", "enable_tomato_rate", "展示烂番茄评分信息");
                        config_setting_gen("动漫评分", "enable_anime_rate", "展示动漫影视的AniDB、Bgm、Mal等评分");
                        config_setting_gen("蓝光发售日", "enable_blue_date", "展示蓝光的发售日期(来自IMDb)");
                        config_setting_gen("亚马逊图书评分", "enable_book_amazon.cn_rate", `展示在<a href="https://www.amazon.cn/" target="_blank">亚马逊中国</a> 上有对应ISBN信息的图书评分信息`);
                        config_setting_gen("GoodReads图书评分","enable_book_goodreads",`展示在 <a href="https://www.goodreads.com" target="_blank">GoodReads</a> 上有对应ISBN信息的图书评分信息，设置你的APIKEY: <input id='drdm_setting_apikey_goodreads' type='text' value='${GM_getValue('apikey_goodreads','')}'></input> (<a href='//blog.rhilip.info/archives/1124/' target='_blank'>说明</a>)`,false);

                        config_setting += `</dl><br>`;

                        // 构造站点启用信息
                        let setting_site = "<h1>搜索站点启用情况(在当前页面条件下)</h1>";
                        for (let i = 0; i < site_map.length; i++) {
                            let map_dic = site_map[i];
                            setting_site += `<div><h2>${map_dic.name} <input type="checkbox" id="${'drdm_config_site_' + map_dic.name}" ${GM_getValue(delete_site_prefix + map_dic.name, false) ? '' : 'checked'} data-config="${delete_site_prefix + map_dic.name}" data-par="${map_dic.name}" data-type="map"><label for="${'drdm_config_site_' + map_dic.name}"></label></h2><table><tbody><tr>`;
                            for (let j = 0; j < map_dic.label.length; j++) {
                                let label = map_dic.label[j];
                                setting_site += `<td style="text-align:right;"><span>${label.name}</span><input type="checkbox" id="${'drdm_config_site_' + label.name}" ${GM_getValue(delete_site_prefix + map_dic.name, false) || GM_getValue(delete_site_prefix + label.name, false) ? '' : 'checked'} ${GM_getValue(delete_site_prefix + map_dic.name, false) ? 'disabled' : ''} data-config="${delete_site_prefix + label.name}" data-par="${map_dic.name}" data-type="site"><label for="${'drdm_config_site_' + label.name}"></label></td>`;
                                if ((j + 1) % 7 === 0) {
                                    setting_site += '</tr><tr>';
                                }
                            }
                            setting_site += "</tbody></table></div><hr>";
                        }
                        $("#drdm_setting").append(config_setting + setting_site);
                        $("input[id^='drdm_config_']").click(function () {
                            let that = $(this);
                            GM_setValue(that.attr("data-config"), that.attr("data-config").match(delete_site_prefix) ? !that.prop("checked") : that.prop("checked"));
                            if (that.attr("data-type") && that.attr("data-type") === "map") {
                                let par = that.attr("data-par");
                                $(`input[id^='drdm_config_site_'][data-type='site'][data-par=${par}]`).prop("disabled", !that.prop("checked")).prop("checked", that.prop("checked"));
                            }
                        });

                        // 其他回调
                        $('input#drdm_setting_apikey_goodreads').on('input change',function () {
                            let that = $(this);
                            GM_setValue('apikey_goodreads', that.val());
                        });
                    });
                });
            });