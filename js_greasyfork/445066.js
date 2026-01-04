// ==UserScript==
// @name           豆瓣图书资源全网免费搜索下载助手：一键搞定搞定豆瓣图书 PDF 下载【失效联系作者24小时更新】
// @description    安装脚本以后，一键下载豆瓣书籍 PDF
// @author         蜡小新
// @contributor    蜡小新
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
// @match        https://book.douban.com/*
// @version        1.0.1
// @icon           https://img3.doubanio.com/favicon.ico
// @run-at         document-end
// @namespace      doveboy_js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/445066/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E8%B5%84%E6%BA%90%E5%85%A8%E7%BD%91%E5%85%8D%E8%B4%B9%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%9A%E4%B8%80%E9%94%AE%E6%90%9E%E5%AE%9A%E6%90%9E%E5%AE%9A%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%20PDF%20%E4%B8%8B%E8%BD%BD%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445066/%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%E8%B5%84%E6%BA%90%E5%85%A8%E7%BD%91%E5%85%8D%E8%B4%B9%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%9A%E4%B8%80%E9%94%AE%E6%90%9E%E5%AE%9A%E6%90%9E%E5%AE%9A%E8%B1%86%E7%93%A3%E5%9B%BE%E4%B9%A6%20PDF%20%E4%B8%8B%E8%BD%BD%E3%80%90%E5%A4%B1%E6%95%88%E8%81%94%E7%B3%BB%E4%BD%9C%E8%80%8524%E5%B0%8F%E6%97%B6%E6%9B%B4%E6%96%B0%E3%80%91.meta.js
// ==/UserScript==

/* global $, jQuery, encodeToGb2312 */

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === "undefined") {
    alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
    return;
}


var seBwhA = document.createElement("a");
seBwhA.id = "seBwhA";
document.getElementsByTagName("html")[0].appendChild(seBwhA);

GM_addStyle(`
.c-aside{margin-bottom:30px}.c-aside-body a{color: #3377aa;margin-right: 5px;}.c-aside-body a:link,.c-aside-body a:visited{color: #3377aa;}.c-aside-body a:active,.c-aside-body a:hover{background-color: #3377aa;color: white;}.c-aside-body a.available{color:#3377aa}.c-aside-body a.available:active,.c-aside-body a.available:hover{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}
#c_dialog li{margin:10px}#c_dialog{text-align:center}
#interest_sectl .rating_imdb{border-top:1px solid #eaeaea;border-bottom:1px solid #eaeaea;padding-bottom:0}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{border-bottom:1px solid #eaeaea;color:#9b9b9b;margin:0;padding:15px 0;position:relative}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url(https://coding.net/u/Changhw/p/MyDoubanMovieHelper/git/raw/master/title_overview_sprite.png) no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83c40b}#interest_sectl .rating_more .popularityDown{color:#930e02}
.more{display:block;height:34px;line-height:34px;text-align:center;font-size:14px;background:#f7f7f7}
div#drdm_setting input[type=checkbox]{display:none}div#drdm_setting input[type=checkbox]+label{display:inline-block;width:40px;height:20px;position:relative;transition:.3s;margin:0 20px;box-sizing:border-box;background:#ddd;border-radius:20px;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]+label:after,div#drdm_setting input[type=checkbox]+label:before{content:'';display:block;position:absolute;left:0;top:0;width:20px;height:20px;transition:.3s;cursor:pointer}div#drdm_setting input[type=checkbox]+label:after{background:#fff;border-radius:50%;box-shadow:1px 1px 3px #aaa}div#drdm_setting input[type=checkbox]:checked+label{background:#aedcae}div#drdm_setting input[type=checkbox]:checked+label:after{background:#5cb85c;left:calc(100% - 20px)}
.top250{background:url(https://s.doubanio.com/f/movie/f8a7b5e23d00edee6b42c6424989ce6683aa2fff/pics/movie/top250_bg.png) no-repeat;width:150px;margin-right:5px;font:12px Helvetica,Arial,sans-serif;margin:5px 0;color:#744900}.top250 span{display:inline-block;text-align:center;height:18px;line-height:18px}.top250 a,.top250 a:active,.top250 a:hover,.top250 a:link,.top250 a:visited{color:#744900;text-decoration:none;background:0}.top250-no{width:34%}.top250-link{width:66%}
.drdm-dl-horizontal dt{float:left;width:160px;overflow:hidden;clear:left;text-align:right;text-overflow:ellipsis;white-space:nowrap}.drdm-dl-horizontal dd{margin-left:180px}
`);

if (GM_getValue('enable_extra_stylesheet', true)) {
    GM_addStyle('#dale_movie_chart_top_right,#dale_movie_home_bottom_right,#dale_movie_home_bottom_right_down,#dale_movie_home_download_bottom,#dale_movie_home_inner_bottom,#dale_movie_home_side_top,#dale_movie_home_top_right,#dale_movie_subject_bottom_super_banner,#dale_movie_subject_download_middle,#dale_movie_subject_inner_middle,#dale_movie_subject_middle_right,#dale_movie_subject_top_midle,#dale_movie_subject_top_right,#dale_movie_tags_top_right,#dale_movie_towhome_explore_right,#dale_review_best_top_right,#footer,#movie_home_left_bottom,.extra,.mobile-app-entrance.block5.app-movie,.qrcode-app,.top-nav-doubanapp,div.gray_ad,div.ticket{display:none}');
}

function page_parser(responseText) {
    return (new DOMParser()).parseFromString(responseText, 'text/html');
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

let fetch_anchor = function (anchor) {
    return anchor[0].nextSibling.nodeValue.trim();
};

$(document).ready(function () {
    let douban_link, douban_id;

    douban_link = 'https://' + location.href.match(/douban.com\/subject\/\d+\//); //豆瓣链接
    douban_id = location.href.match(/(\d{7,8})/g);

    let site_map = [];

    if (douban_id) {
        clearExpiredCacheValue(false); // 清理缓存
        let cache = CacheStorage(douban_id, 86400 * 7 * 1e3);
        let need_login_cache = CacheStorage("need_login", 86400 * 1e3);
        $("#content div.aside").prepend(`<div id='db_new_sites'></div>`);
        function _encodeToGb2312(str, opt) {
            let ret = "";
            try {
                ret = encodeToGb2312(str, opt);
            } catch (e) {
                ret = Math.random() * 1e6;
            }
            return ret;
        }

        if (location.host === "book.douban.com") {
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
                for (let i = 10; i > 1; i-- ) {
                    c = s.charAt(10 - i);
                    checkDigit += (c - 0) * i;
                    result += c;
                }
                checkDigit = (11 - (checkDigit % 11)) % 11;
                result += checkDigit == 10 ? 'X' : (checkDigit + "");
                return ( result );
            }

            let isbn10 = isbn13to10 (isbn);

            site_map.push({
                name: "免费网盘 PDF 下载",
                label: [
                    { name: '56网盘书', link: 'http://www.56wangpan.com/search/o2kw' + title, selector: `div.title > a[title*='${title}']` },
                    { name: '爱问资料', link: `http://ishare.iask.sina.com.cn/search/home.html?ft=all&cond=${ptitle}`, selector: 'ul.landing-txt-list h4.data-name' },
                    { name: '小白盘图书', link: 'http://www.xiaobaipan.com/list-' + title + '.html?order=size', selector: 'h4.job-title a' },
                ]
            });
            site_map.push({
                name: "免费获得纸质书籍",
                label: [
                    { name: '华章出版社', link: `http://www.hzbook.com/index.php/Book/search.html?k=${title}`, selector: `div.comControlBook > a:contains(${title})` },
                ]
            });
            site_map.push({
                name: "二手书购买",
                label: [
                    { name: '淘宝', link: `https://s.taobao.com/search?tab=old&q=${isbn}`, selector: `div` },
                    { name: '京东', link:  `https://search.jd.com/search?keyword=${title}二手书`, selector: `div` },
                ]
            });
            site_map.push({
                name: "正版书购买",
                label: [
                    { name: '淘宝', link: `https://s.taobao.com/search?q=${isbn}`, selector: `div` },
                    { name: '京东', link:  `https://search.jd.com/search?keyword=${title}`, selector: `div` },
                ]
            });
            site_map.push({
                name: "电子书购买",
                label: [
                    { name: '多看阅读', link: `http://www.duokan.com/search/${title}`, selector: `div.wrap > a:contains(${title})` },
                    { name: '京东数字', link: `https://s-e.jd.com/Search?enc=utf-8&key=${title}${writer}`, selector: 'div.p-name a' },
                    { name: '亚马逊商店', link: 'https://www.amazon.cn/s?i=digital-text&k=' + isbn, selector: 'div.sg-col-inner h2' },
                ]
            });
            site_map.push({
                name: "免费在线听书",
                label: [
                    { name: '懒人听书', link: 'http://www.lrts.me/search/book/' + title, selector: 'ul li.book-item' },
                    { name: '评书吧', link: 'http://www.pingshu8.com/search/1.asp?keyword=' + gtitle, selector: "table.TableLine div[align='left']" },
                    { name: '天方听书网', link: 'http://www.tingbook.com/Book/SearchResult.aspx?keyword=' + title, selector: 'ul.search_result_list h4.clearfix' },
                    { name: '听中国', link: 'http://www.tingchina.com/search1.asp?mainlei=0&lei=0&keyword=' + gtitle, selector: 'dl.singerlist1 li' },
                    { name: '喜马有声', link: 'https://www.ximalaya.com/search/' + title + '/', selector: `div.xm-album-cover__wrapper + a[title*='${title}']` },
                ]
            });
        }

        function login_check(res) {
            let need_login = false;
            if (/login|verify|checkpoint|returnto/ig.test(res.finalUrl)) {
                need_login = true; 
            } else if (/refresh: \d+; url=.+login.+/ig.test(res.responseHeaders)) {
                need_login = true; 
            } else {
                let responseText = res.responseText;
                if (typeof responseText === "undefined") {
                    need_login = true; 
                } else if (responseText.length < 800 && /login|not authorized/.test(responseText)) {
                    need_login = true; 
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
                let storage_data = true;
                if (label.rewrite_href && label.rewrite_href === true) { 
                    storage_data = cache.get(site, link || $(psite).attr("href"));
                    $(psite).attr("href", storage_data);
                }
                cache.add(site, storage_data);
            }

            function TagNotExist() {
                $(psite).attr("title", "资源不存在");
                HideTag();
            }

            function TagNeedLogin() {
                need_login_cache.add(site, true);
                $(psite).click(function () {
                    need_login_cache.del(site);
                });
                $(psite).attr("title", "站点需要登陆");
                HideTag();
            }

            function TagError(errtype) {
                $(psite).attr("title", "遇到问题" + (errtype ? (" - " + errtype) : ""));
                HideTag();
            }

            if (cache.get(site)) { TagExist(); return; }

            if (need_login_cache.get(site)) { TagNeedLogin(); return; }

            function check_core(label) {
                GM_xmlhttpRequest({
                    method: label.method || "GET",
                    url: label.ajax || label.link,
                    data: label.data,
                    headers: label.headers,
                    timeout: 45e3, 
                    onload: function (res) {
                        if (login_check(res)) {
                            TagNeedLogin();
                        } else {
                            try { 
                                let responseText = res.responseText;
                                if (label.type && ["json", "jsonp"].includes(label.type)) { 
                                    if (label.type === "jsonp") {
                                        responseText = responseText.match(/[^(]+\((.+)\)/)[1];
                                    }
                                    let par = JSON.parse(responseText);
                                    if (eval("par." + label.selector)) {
                                        TagExist();
                                    } else {
                                        TagNotExist(); 
                                    }
                                } else { // 否则默认label.type的默认值为 html
                                    let doc = page_parser(res.responseText);
                                    let body = doc.querySelector("body");
                                    // 因为jQuery的选择器丰富，故这里不用 dom.querySelector() 而用 jQuery.find()
                                    if (label.selector_need_login && $(body).find(label.selector_need_login).length) {
                                        TagNeedLogin(); // 如果存在selector_need_login选择器，则先判断是否存在以确定是否需要登录
                                    } else if ($(body).find(label.selector || "table.torrents:last > tbody > tr:gt(0)").length) {
                                        TagExist(res.finalUrl); // 最后使用selector选择器判断资源是否存在
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
                if (label.csrf) { // 对某些启用了csrf的站点，先使用正常方式请求一次获取csrf值
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: label.link,
                        timeout: 45e3, // 默认45s服务器无响应算超时
                        onload: function (res) {
                            if (!login_check(res)) {
                                try {
                                    let doc = page_parser(res.responseText);
                                    let csrf_ = $(`input[name='${label.csrf.name}'`, doc);
                                    let csrf_key = csrf_.attr("value"); // 获取csrf值
                                    label[label.csrf.update] += `&${label.csrf.name}=${csrf_key}`; // 更新对应选项
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
                $(psite).mouseenter(function(e){ // 鼠标进入时才自动搜索并反馈
                    if ($(psite).attr('title') == 'empty') { // 防止重复请求
                        check_func();
                        $(psite).unbind('mouseenter');
                    }
                });
            }
        }

        function site_exist_status() {
            for (let i = 0; i < site_map.length; i++) {
                let map_dic = site_map[i];
                if (GM_getValue(delete_site_prefix + map_dic.name, false)) {
                    continue;
                }
                $('#db_new_sites').append(`<div class="c-aside name-offline" style="padding: 18px 16px;background: #F6F6F2;" data-id="${i}"><h2><i>${map_dic.name}</i>· · · · · ·</h2><div class=c-aside-body style="padding: 0 12px;"> <ul class=bs > </ul> </div> </div>`);

                let in_site_html = $(`div[data-id='${i}'] ul.bs`);
                for (let j = 0; j < map_dic.label.length; j++) {
                    let label = map_dic.label[j];
                    if (GM_getValue(delete_site_prefix + label.name, false)) {
                        continue;
                    }
                    in_site_html.append(`<a href="${label.link}" data-name="${label.name}" target="_blank" rel="nofollow" title="empty">${label.name}</a>`);
                    Exist_check(label);

                }
            }
        }
        site_exist_status();
    }
});