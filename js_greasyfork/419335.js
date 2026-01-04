// ==UserScript==
// @name           DCF 资源助手
// @description    有资源的网站显示绿色，没资源的网站显示黄色
// @author         BikeKoala
// @contributor    BikeKoala
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
// @include        https://movie.douban.com/*
// @include        http://media.gzdcf.cn:3001/*
// @version        0.2.0
// @icon           https://img3.doubanio.com/favicon.ico
// @run-at         document-end
// @namespace      bikekoala_js
// @downloadURL https://update.greasyfork.org/scripts/419335/DCF%20%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419335/DCF%20%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === "undefined") {
    alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
    return;
}

// 不属于豆瓣的页面
if (!/douban.com/.test(location.host)) {
    return; // 终止脚本运行，防止豆瓣的css以及js片段等污染页面
}

// 注入脚本相关的CSS，包括：隐藏、调整豆瓣原先的元素，脚本页面样式
let myScriptStyle = "@charset utf-8;#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#movie_home_left_bottom,#dale_movie_home_top_right,#dale_movie_home_side_top,#dale_movie_home_bottom_right,#dale_movie_home_inner_bottom,#dale_movie_home_download_bottom,#dale_movie_home_bottom_right_down,#dale_movie_towhome_explore_right,#dale_movie_chart_top_right,#dale_movie_tags_top_right,#dale_review_best_top_right,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,p.pl,div.ticket{display:none}.c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{border-radius:6px;color:#37A;display:inline-block;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;text-align:center;width:65px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.available{background-color:#5ccccc;color:#006363}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#c_dialog li{margin:10px}#c_dialog{text-align:center}#interest_sectl .rating_imdb{border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83c40b}#interest_sectl .rating_more .popularityDown{color:#930e02}.more{display:block;height:34px;line-height:34px;text-align:center;font-size:14px;background:#f7f7f7}div#drdm_setting input[type=checkbox]{display:none}div#drdm_setting input[type=checkbox]+label{display:inline-block;width:40px;height:20px;position:relative;transition:.3s;margin:0 20px;box-sizing:border-box;background:#ddd;border-radius:20px;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]+label:after,div#drdm_setting input[type=checkbox]+label:before{content:'';display:block;position:absolute;left:0;top:0;width:20px;height:20px;transition:.3s;cursor:pointer}div#drdm_setting input[type=checkbox]+label:after{background:#fff;border-radius:50%;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]:checked+label{background:#aedcae}div#drdm_setting input[type=checkbox]:checked+label:after{background:#5cb85c;left:calc(100% - 20px)}.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;margin-right:5px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:link,.top250 a:hover,.top250 a:active,.top250 a:visited{color:#744900;text-decoration:none;background:0}.top250-no{width:34%}.top250-link{width:66%}.drdm-dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.drdm-dl-horizontal dd{margin-left:180px}";
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

let delete_site_prefix = "delete_site_";

if (typeof GM_registerMenuCommand !== "undefined") {

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

    douban_link = 'https://' + location.href.match(/douban.com\/subject\/\d+\//);  //豆瓣链接
    douban_id = location.href.match(/(\d{7,8})/g);

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
     *       2. 关于请求方法请参考：https://github.com/scriptish/scriptish/wiki/GM_xmlhttpRequest
     * */
    if (douban_id) {
        clearExpiredCacheValue(false); // 清理缓存
        let cache = CacheStorage(douban_id, 86400 * 7 * 1e3);
        let need_login_cache = CacheStorage("need_login", 86400 * 1e3);

        $("#content div.aside").prepend(`
          <div id="drdm_req_status" style="color: #C65E24; background: #F4F4EC; padding: 10px; margin-bottom: 20px; word-wrap: break-word; display: none;">
            <div style="text-align: center;">DCF 资源助手</div>
            <div style="border-bottom: 1px solid #ddd; margin: 5px 0;"></div>
            <p id="drdm_dep_notice" style="color: #C65E24; display: none;">脚本未完全加载，部分站点将受影响。请确保网络稳定或尝试重新刷新页面。</p>
            <div>卓亚检测：<span id="zhuoya_check_value">检测中...</span></div>
          </div>
        <div id='adv-sites'></div>
        `);

        if (location.host === "movie.douban.com") {
            // 查看原图
            if ($('#mainpic p.gact').length === 0) { // 在未登录的情况下添加空白元素以方便查看原图交互按钮的定位
                $("#mainpic").append("<p class=\"gact\"></p>");
            }
            let posterAnchor = document.querySelector('#mainpic > a > img');
            let postersUrl, rawUrl;
            if (posterAnchor) {
                postersUrl = posterAnchor.getAttribute("src");
                rawUrl = postersUrl.replace(/photo\/[sl](_ratio_poster|pic)\/public\/(p\d+).+$/, "photo/raw/public/$2.jpg");
                $('#mainpic p.gact').after(`<a target="_blank" rel="nofollow" href="${rawUrl}">查看原图</a>`);
            }

            // 调整底下剧情简介的位置
            let interest_sectl_selector = $('#interest_sectl');
            interest_sectl_selector.after($('div.grid-16-8 div.related-info'));
            interest_sectl_selector.attr('style', 'float:right');
            $('div.related-info').attr('style', 'width:480px;float:left');

            // Movieinfo信息生成相关
            let this_title, trans_title, aka;
            let year, region, genre, language, playdate;
            let imdb_link, imdb_id, imdb_average_rating, imdb_votes, imdb_rating;
            let douban_average_rating, douban_votes, douban_rating;
            let episodes, duration;
            let director, writer, cast;
            let tags, introduction, awards;

            // 获得 <script type="application/ld+json" /> 里面的信息，这里面的东西和API返回需要的东西差不多
            let ld_json;
            try {
               ld_json = JSON.parse($('head > script[type="application/ld+json"]').text().replace(/\n/ig,''));
            } catch (e) {}

            // 先对一些关键信息进行判断
            let aka_anchor = $('#info span.pl:contains("又名")');
            let has_aka = aka_anchor.length > 0;
            let has_imdb = $('div#info a[href^=\'https://www.imdb.com/title/tt\']').length > 0;
            let is_movie = $("a.bn-sharing[data-type='电影']").length > 0;
            let is_series = $("a.bn-sharing[data-type='电视剧']").length > 0;
            let is_anime = $('span[property="v:genre"]:contains("动画")').length > 0;
            let is_document = $('span[property="v:genre"]:contains("纪录片")').length > 0;

            // 页面元素定位
            let regions_anchor = $('#info span.pl:contains("制片国家/地区")'); //产地
            let language_anchor = $('#info span.pl:contains("语言")'); //语言
            let episodes_anchor = $('#info span.pl:contains("集数")'); //集数
            let duration_anchor = $('#info span.pl:contains("单集片长")'); //片长

            // 基础Movieinfo信息
            let chinese_title = document.title.replace('(豆瓣)', '').trim();
            let foreign_title = $('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
            let poster = rawUrl ? rawUrl.replace('raw','l_ratio_poster').replace('img3','img1') : '';

            if (has_aka) {
                aka = fetch_anchor(aka_anchor).split(' / ').sort(function (a, b) { //首字(母)排序
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

            playdate = $('#info span[property="v:initialReleaseDate"]').map(function () { //上映日期
                return $(this).text().trim();
            }).toArray().sort(function (a, b) { //按上映日期升序排列
                return new Date(a) - new Date(b);
            }).join('/');

            year = ' ' + $('#content > h1 > span.year').text().substr(1, 4);
            region = regions_anchor[0] ? fetch_anchor(regions_anchor).split(' / ').join('/') : '';
            language = language_anchor[0] ? fetch_anchor(language_anchor).split(' / ').join('/') : '';
            episodes = episodes_anchor[0] ? fetch_anchor(episodes_anchor) : '';
            duration = duration_anchor[0] ? fetch_anchor(duration_anchor) : $('#info span[property="v:runtime"]').text().trim();

            let is_europe = region.match(/美国|英国|加拿大|丹麦/);
            let is_japan = region.match(/日本/);
            let is_korea = region.match(/韩国/);
            let is_thai = region.match(/泰国/);
            let is_india = region.match(/印度/);
            let is_pakistan = region.match(/巴基斯坦|Pakistan/)
            let is_mainland = region.match(/中国大陆/);
            let is_mandarine = language.match(/汉语普通话/);
            let is_otherlan = language.match(/\//);

            genre = $('#info span[property="v:genre"]').map(function () { //类别
                return $(this).text().trim();
            }).toArray().join('/');

            // Add top rank tag
            if (GM_getValue("enable_top_rang_tag", true)) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: "https://bimzcy.github.io/rank4douban/data.json",
                    onload: function (response) {
                        let rank_json = JSON.parse(response.responseText);
                        let insert_html_list = [];
                        for (let i in rank_json) {
                            let top_list = rank_json[i];
                            let list_num = top_list.list[douban_id];
                            if (list_num) {
                                let list_order = top_list.top;
                                insert_html_list[list_order] = `<div class="top250"><span class="top250-no">${top_list.prefix ? top_list.prefix : "No."}${list_num}</span><span class="top250-link"><a href="${top_list.href}" title="${top_list.title}">${top_list.short_title}</a></span></div>`;
                            }
                        }
                        if (insert_html_list) {
                            insert_html_list.push("<div style=\"display: none;\" id='rank_toggle' data-toggle='show'><a href=\"javascript::\">展示剩余 →</a></div>");
                            let after = $("#dale_movie_subject_top_icon") || $("#content > h1");
                            after.before(insert_html_list.join(' '));
                            let top_selector = $(".top250");
                            top_selector.css("display", "inline-block");
                            if (top_selector.length > 4) {
                                $(".top250:gt(3)").hide();
                                $("#rank_toggle").show().css("display", "inline-block").click(function () {
                                    if ($(this).attr("data-toggle") === "show") {
                                        top_selector.show();
                                        $(this).attr("data-toggle", "hide").html("<a href=\"javascript::\">隐藏剩余 ←</a>");
                                    } else {
                                        $(".top250:gt(3)").hide();
                                        $(this).attr("data-toggle", "show").css("display", "inline-block").html("<a href=\"javascript::\">展示剩余 →</a>");
                                    }
                                })
                            }
                        }
                    }
                });
            }

            // 从中栏中先获取豆瓣评分信息（此时还没有imdb等第三方评价信息）
            let douban_vote_another = $('div[typeof="v:Rating"]:eq(0)');
            if (douban_vote_another.length > 0) {
                douban_average_rating = douban_vote_another.find('[property="v:average"]').length > 0 ? douban_vote_another.find('[property="v:average"]').text() : 0;
                douban_votes = douban_vote_another.find('[property="v:votes"]').length > 0 ? douban_vote_another.find('[property="v:votes"]').text() : 0;
                douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
            }

            // 获取电影名
            let title = $('#content > h1 > span')[0].textContent.split(' ').shift().replace(/[，]/g, " ").replace(/：.*$/, "");
            let eng_title = [this_title, trans_title].join("/").split("/").filter(function (arr) {
                return /([a-zA-Z]){2,}/.test(arr);
            })[0] || "";
            let is_chinese = title.match(/[^\x00-\xff]/);
            let unititle = is_chinese ? title : eng_title;

            // 剧集修正季数名
            eng_title = eng_title.match(/Season\s\d\d/) ? eng_title.replace(/Season\s/, "S") : eng_title.replace(/Season\s/, "S0");
            eng_title = eng_title.replace(/[:,!\-]/g, "").replace(/ [^a-z0-9]+$/, "").replace(/ +/g," ");
            let eng_title_clean = eng_title.replace(/ S\d\d*$/, "");
            let has_entitle= eng_title_clean;

            // 电影+年份 (只有电影才搜索并赋值年份)
            chinese_title = chinese_title.replace(/[：，]/, " ");
            let gunititle = encode2gb2312(unititle, true);

            // 资源名称
            let zwzy = (unititle.replace(/ /g, ".").replace("：", ".").replace(/\.\./g, ".") + "." + eng_title.replace(": ", ".").replace(/ /g, ".") + "." + year.replace(/ /, "")).replace(/\.{2,}/g, ".");
            let imdbzy = has_imdb ? "." + imdb_id : "";
            $("div#info").append(`<span class=\"pl\">资源名称: </span>${zwzy}${imdbzy}`);

            let neizhan = has_imdb ? imdb_id : ('/subject/' + douban_id);  // PT内站 智能判定是用IMDB ID还是豆瓣ID

            site_map.push({
                name: "资源",
                label: [
                    { name: '片库', link: 'https://www.pianku.li/s/go.php?q=' + unititle, selector: '.sr_lists dl' },
                    { name: '迷客电影', link: 'https://www.mini4k.com/search?term=' + unititle, selector: 'div.search-item-list li' },
                    // { name: '钉子电影', method: "post", link: 'http://www.dingzi77.com/q', data: `keyword=${unititle}`, csrf: { name: "_csrf", update: "data" }, headers: { "Content-Type": "application/x-www-form-urlencoded" }, selector: `h4 > a:contains(${unititle})` },
                    { name: 'BT部落', link: 'https://www.btbuluo.net/s/' + unititle + '.html', selector: `h2 a:contains(${unititle})` },
                    { name: '高清电台', link: 'https://gaoqing.fm/s.php?q=' + unititle, selector: '#result1 div.row' },
                    { name: '电影天堂', method: "post", link: 'https://www.dy2018.com/e/search/index.php', data: `show=title%2Csmalltext&tempid=1&keyboard=${gunititle}&Submit=%C1%A2%BC%B4%CB%D1%CB%F7`, headers: { "Content-Type": "application/x-www-form-urlencoded" }, rewrite_href: true, selector: 'div.co_content8 table' },
                ]
            });
            /*site_map.push({
                name: "在线",
                label: [
                    { name: '哔哩哔哩', link: 'https://search.bilibili.com/all?keyword=' + unititle, selector: 'li.pgc-item' },
                    { name: '优酷视频', link: 'https://so.youku.com/search_video/q_' + unititle, selector: 'span[class^="movie-span_"]' },
                    { name: '爱奇艺视频', link: 'https://so.iqiyi.com/so/q_' + unititle, selector: "a.qy-search-result-btn" },
                    { name: '腾讯视频', link: 'https://v.qq.com/x/search/?q=' + unititle, selector: 'div.wrapper_main div._infos' },
                    { name: '搜狐视频', link: 'https://so.tv.sohu.com/mts?wd=' + unititle, selector: 'div.wrap.cfix div.cfix.resource' },
                ]
            });*/
            if (is_anime) {
                site_map.push({
                    name: "动漫",
                    label: [
                        { name: 'ACG.RIP', link: 'https://acg.rip/?term=' + unititle, selector: 'tbody tr' },
                        { name: 'ACG搜', link: 'http://www.acgsou.com/search.php?keyword=' + unititle, selector: 'tbody span.bts_1' },
                        { name: 'Mikan', link: 'https://mikanani.me/Home/Search?searchstr=' + unititle, selector: 'table.table.table-striped.tbl-border.fadeIn a.magnet-link-wrap' },
                        { name: 'MioBT', link: 'http://www.miobt.com/search.php?keyword=' + unititle, selector: '#data_list tr[class*=alt]' },
                        { name: 'VCB-S', link: 'https://vcb-s.com/?s=' + unititle, selector: '#article-list div.title-article' },
                        { name: '爱恋动漫', link: 'http://www.kisssub.org/search.php?keyword=' + unititle, selector: 'tbody span.bts_1' },
                        { name: '动漫花园', link: 'https://share.dmhy.org/topics/list?keyword=' + unititle, selector: 'tbody span.btl_1' },
                        { name: '漫喵动漫', link: 'http://www.comicat.org/search.php?keyword=' + unititle, selector: '#data_list tr' },
                        { name: "萌番组", method: "post", type: "json", link: "https://bangumi.moe/search/title#search_" + unititle, ajax: "https://bangumi.moe/api/v2/torrent/search", data: `{"query":"${unititle}"}`, headers: { "Content-Type": "text/plain;charset=UTF-8" }, selector: "count > 0" },
                        { name: '末日动漫', link: 'https://share.acgnx.se/search.php?sort_id=0&keyword=' + unititle, selector: '#listTable tr[class*=alt]' },
                        { name: '魔法少女', link: 'https://www.mahou-shoujo.moe/?s=' + this_title, selector: '#main div.entry-summary' },
                        { name: '怡萱动漫', link: 'http://www.yxdm.tv/search.html?title=' + unititle, selector: 'div.main p.stars1' },
                    ]
                });
            }
            if (is_series && is_japan && !is_anime) {
            }
            if (is_series && is_korea && !is_anime) {
            }
            if (is_series && is_thai && !is_anime) {
            }

            // 卓亚检测
            const _checkPlaySource = (source) => {
                return $('.gray_ad a').text().includes(source);
            }
            const _isMovieUsed = (name, callback) => {
                const encodedName = encodeToGb2312(name)
                const api = 'http://media.gzdcf.cn:3001/special/zhuoya/isMovieUsed?name=' + encodedName
                getJSON(api, callback)
            }
            _isMovieUsed(unititle, (ret) => {
                if (!ret.data && !_checkPlaySource('腾讯视频')) {
                    $('#zhuoya_check_value').html('已通过（<a href="javascript:;" id="zhuoya_copy_meta"> 复制元信息 </a>）');
                    $('#zhuoya_copy_meta').click(() => {
                        const content = [unititle, year, region, genre, douban_link].join('\t')
                        copy2clip(content)
                    });
                } else {
                    $('#zhuoya_check_value').text('未通过');
                }
            })
        }


        function copy2clip(content) {
            let aux = document.createElement('input');
            aux.setAttribute('value', content);
            document.body.appendChild(aux);
            aux.select();
            document.execCommand('copy');
            document.body.removeChild(aux);
        }

        function encode2gb2312(str, opt) {
            let ret = "";
            try {
                ret = encodeToGb2312(str, opt);
            } catch (e) {
                ret = Math.random() * 1e6;
                $("#drdm_dep_notice").show();
            }
            return ret;
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
                if (GM_getValue('enable_adv_auto_hide',true)) {
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
            $("#drdm_req_status").show();
            for (let i = 0; i < site_map.length; i++) {
                let map_dic = site_map[i];
                if (GM_getValue(delete_site_prefix + map_dic.name, false)) {
                    continue;
                }
                $('#adv-sites').append(`<div class="c-aside name-offline" data-id="${i}"><h2><i>${map_dic.name}</i> · · · · · ·</h2><div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>`);

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

            if (!GM_getValue("enable_adv_auto_search", true)) {
                $("#drdm_req_status_hide").click();
            }
        }

        site_exist_status();
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
            config_setting_gen("各类排行榜", "enable_top_rang_tag", `显示来自 <a href="https://github.com/bimzcy/rank4douban">bimzcy/rank4douban</a> 的各种排行榜`);
            config_setting_gen("启用全站自动搜索", "enable_adv_auto_search", "启用可让脚本自动搜索全部站点（会消耗CPU及网络资源），不启用则仅当鼠标移至对应站点时搜索");
            config_setting_gen("自动隐藏搜索失败站点","enable_adv_auto_hide","搜索时自动隐藏搜索失败（资源不存在,需要登陆,遇到问题）站点，默认开启", true);
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