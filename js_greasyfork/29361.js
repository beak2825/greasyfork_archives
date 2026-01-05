// ==UserScript==
// @name               MyTools
// @name:zh-CN         MyTools
// @name:zh-TW         MyTools
// @namespace          https://greasyfork.org/users/11804-jerryxia
// @version            1.0
// @author             JerryXia
// @description        整合常用功能，减少插件数量：绕过谷歌重定向、百度音乐盒去广告、豆瓣补全下载链接、网页右键解锁、购物党比价工具、解决百度云大文件下载限制、知乎界面美化、知乎真实链接地址重定向、全网主流视频网站VIP破解（免广告），呼出快捷键：ALT + M
// @description:zh-CN  整合常用功能，减少插件数量：绕过谷歌重定向、百度音乐盒去广告、豆瓣补全下载链接、网页右键解锁、购物党比价工具、解决百度云大文件下载限制、知乎界面美化、知乎真实链接地址重定向、全网主流视频网站VIP破解（免广告），呼出快捷键：ALT + M
// @description:zh-TW  整合常用功能，減少插件數量：绕过谷歌重定向、百度音樂盒去廣告、豆瓣補全下載鏈接、網頁右鍵解鎖、購物黨比價工具、解決百度雲大文件下載限制、知乎界面美化、知乎真實鏈接地址重定向、全網主流視頻網站VIP破解（免廣告），呼出快捷鍵：ALT + M
// @homepageURL        https://greasyfork.org/scripts/10453-mytools
// @icon               http://tampermonkey.net/favicon.ico
// @supportURL         http://blog.guqiankun.com/contact
// @include            /^https?\:\/\/(www|news|maps|docs|cse|encrypted)\.google\./
// @include            http://play.baidu.com/*
// @include            http://movie.douban.com/subject/*
// @include            http://book.douban.com/subject/*
// @match              *://*/*
// @exclude            http://localhost*
// @exclude            http://127.0.0.1*
// @exclude            *://g.alicdn.com/*
// @exclude            *://googleads.g.doubleclick.net/*
// @exclude            *://s.click.taobao.com/t_js*
// @exclude            http://www.jxhld.gov.cn/*
// @exclude            http://bbs.htpc1.com/*
// @exclude            *://exmail.qq.com/*
// @exclude            *://cas.edu.sh.cn/*
// @exclude            *://blog.guqiankun.com/*
// @exclude            *://outlook.live.com/*
// @exclude            *://bbs.dg2012.com/*
// @exclude            *://www.sexinsex.net/*
// @exclude            *://*.1688.com/*
// @exclude            *://outlook.office365.com/*
// @exclude            *://www.7xiazai.com/*
// @require            https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js
// @require            https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require            https://cdn.bootcss.com/mustache.js/2.2.1/mustache.min.js
// @require            https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min.js
// @run-at             document-end
// @connect            imdb.com
// @connect            6080.tv
// @connect            f4yy.com
// @connect            lbldy.com
// @connect            aaqqs.com
// @connect            jd.com
// @connect            jd.hk
// @connect            2345.com
// @connect            qiniudn.com
// @connect            taobao.com
// @connect            tmall.com
// @connect            47ks.com
// @connect            aikan-tv.com
// @connect            guqiankun.com
// @connect            yd-cn.cn
// @connect            greasyfork.org
// @connect            tmall.hk
// @connect            jaeapp.com
// @connect            iok.la
// @connect            baidu.com
// @grant              unsafeWindow
// @grant              GM_log
// @grant              GM_addStyle
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_getResourceText
// @grant              GM_getResourceURL
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @grant              GM_notification
// @license            The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/29361/MyTools.user.js
// @updateURL https://update.greasyfork.org/scripts/29361/MyTools.meta.js
// ==/UserScript==

var GmUtils = (function () {
    function GmUtils(environment) {
        this.env = environment;
    }
    GmUtils.prototype.setEnv = function (environment) {
        this.env = environment;
    };
    GmUtils.prototype.getAll = function () {
        var rtnVal = GM_listValues();
        this.log('getAll:' + rtnVal);
        return rtnVal;
    };
    GmUtils.prototype.getVal = function (key, defaultVal) {
        var rtnVal = GM_getValue(key, defaultVal);
        this.log('getVal:' + rtnVal);
        return rtnVal;
    };
    GmUtils.prototype.setVal = function (key, val) {
        GM_setValue(key, val);
    };
    GmUtils.prototype.delVal = function (key) {
        GM_deleteValue(key);
    };
    GmUtils.prototype.log = function (message) {
        //level 是可选的，默认值是0。其有效的值有：0 - 信息、1 - 警告、2 - 错误。
        if (this.env.toLowerCase() === 'debug') {
            GM_log('调试信息: ' + message);
        }
        else {
            //GM_log(message);
        }
    };
    GmUtils.prototype.addStyle = function(css){
        GM_addStyle(css);
    };
    GmUtils.prototype.DOMAttrModified = function(obj, fn){
        obj.addEventListener("DOMAttrModified", fn, false);
    };
    GmUtils.prototype.errlog = function(d) {
        var errorString = '';
        if (typeof d === 'object') {
            if(d.hasOwnProperty('message') ){
                errorString += d.message + '\n\n';
            }
            if(d.hasOwnProperty('stack') ){
                errorString += d.stack + '\n\n';
            }
            if(d.hasOwnProperty('lineno') ){
                errorString += 'lineno:' + d.lineno + '\n\n';
            }

            errorString += navigator.appVersion;
        }else{
            errorString = 'tryJson:' + JSON.stringify(d);
        }
        var logdata = { t: "", e: errorString };
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://793746.iok.la/mytoolserrlog.php',
            data: $.param(logdata),
            headers: { "Content-Type":"application/x-www-form-urlencoded" },
            timeout: 60000,
            onload: function(resultRes) {
               //
            }
        });
    };
    GmUtils.prototype.originHttpRequest = GM_xmlhttpRequest;
    return GmUtils;
})();


(function(gmUtils, MutationObserver){

    function newGuid() {
        var guid = '';
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20)){
                guid +=  "-";
            }
        }
        return guid;
    }
    String.format = function () {
        if (arguments.length == 0) return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var regExp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(regExp, arguments[i])
        }
        return str;
    };
    String.prototype.contains = function(s) {
        return -1 !== this.indexOf(s);
    };
    String.prototype.startsWith = function(s) {
        return this.slice(0, s.length) == s;
    };
    if (typeof Date.prototype.format == 'undefined') {
        Date.prototype.format = function (mask) {
            var d = this;
            var zeroize = function (value, length) {
                if (!length) length = 2;
                value = String(value);
                for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                    zeros += '0';
                }
                return zeros + value;
            };

            return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
                switch ($0) {
                    case 'd': return d.getDate();
                    case 'dd': return zeroize(d.getDate());
                    case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                    case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                    case 'M': return d.getMonth() + 1;
                    case 'MM': return zeroize(d.getMonth() + 1);
                    case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                    case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                    case 'yy': return String(d.getFullYear()).substr(2);
                    case 'yyyy': return d.getFullYear();
                    case 'h': return d.getHours() % 12 || 12;
                    case 'hh': return zeroize(d.getHours() % 12 || 12);
                    case 'H': return d.getHours();
                    case 'HH': return zeroize(d.getHours());
                    case 'm': return d.getMinutes();
                    case 'mm': return zeroize(d.getMinutes());
                    case 's': return d.getSeconds();
                    case 'ss': return zeroize(d.getSeconds());
                    case 'l': return zeroize(d.getMilliseconds(), 3);
                    case 'L': var m = d.getMilliseconds();
                        if (m > 99) m = Math.round(m / 10);
                        return zeroize(m);
                    case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
                    case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
                    case 'Z': return d.toUTCString().match(/[A-Z]+$/);
                        // Return quoted strings with the surrounding quotes removed
                    default: return $0.substr(1, $0.length - 2);
                }
            });
        };
    }

    function convertUrl2QR(url) {
        url = url || location.href;
        //var imgUrl = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=Q|0&chl=" + encodeURIComponent(url);
        //jQuery('#qr'+currentGuid).attr("src", imgUrl);
        try{
            var favUrl = jQuery("head link[rel*='icon']").attr('href') || '//' + location.hostname + '/favicon.ico';
            jQuery('#fav'+currentGuid).attr("src", favUrl).show();
            jQuery('#fav'+currentGuid, '#qr'+currentGuid).bind("error", function(e) {
                $(e.target).hide();
            });
            jQuery('#qr'+currentGuid).qrcode({ width: 200, height: 200, text: url });
        }catch(err){
            gmUtils.log(err);
        }
    }

    /*Direct Google*/
    function blockListeners(element, events) {
        function stopBubbling(event) {
            event.stopPropagation();
        }
        var eventList = events.split(' ');
        if(eventList) {
            var i, event;
            for(i = eventList.length - 1; i > -1; i--) {
                event = eventList[i].trim();
                if(event) {
                    element.removeEventListener(event, stopBubbling, true);
                    element.addEventListener(event, stopBubbling, true);
                }
            }
        }
    }
    function modifyGoogle() {
        var hostname = location.hostname;
        var pathname = location.pathname;
        var href = location.href;
        //remove web/video search redirects
        $('a[onmousedown^="return rwt("]').removeAttr('onmousedown');
        //remove custom search redirects
        $('.gsc-results a[href][data-cturl]').each(function() {
            blockListeners(this, 'mousedown');
        });
        //remove image search redirects
        $('a').filter('[class^="irc_"], [class*=" irc_"], [id^="irc_"]').each(function() {
            blockListeners(this, 'mousedown');
        });
        //remove news search redirects
        if(href.contains('tbm=nws') || hostname.startsWith('news.google.')) {
            $('a.article[href^="http"]').each(function() {
                blockListeners(this, 'click contextmenu mousedown mousemove');
            });
        }
        //remove shopping search redirects
        else if(href.contains('tbm=shop') || pathname.startsWith('/shopping/')) {
            $('a').filter('[href*="/aclk?"], [href*="/url?"]').each(function() {
                var m = this.href.match(/(?:\&adurl|\?q|\&url)\=(http.*?)(\&|$)/i);
                if(m && m[1]) {
                    var link = decodeURIComponent(m[1]);
                    m = link.match(/\=(https?(\%3A\%2F\%2F|\:\/\/).*?)(\&|$)/i);
                    if(m && m[1]) {
                        link = decodeURIComponent(m[1]);
                    }
                    this.href = link;
                }
            });
        }
        //remove map search redirects; does not remove redirects of advertisement
        else if(pathname.startsWith('/maps/') || '/maps' == pathname) {
            $('a[href^="http"]').each(function() {
                blockListeners(this, 'click contextmenu');
                //legacy
                if(this.href.contains('url?')) {
                    var m = this.href.match(/(?:\&|\?)q\=(http.*?)(\&|$)/i);
                    if(m && m[1]) {
                        this.href = decodeURIComponent(m[1]);
                    }
                }
            });
        }
        //remove legacy search redirects and docs redirects
        //should be done last as shopping uses the same url pattern
        $('a[href*="/url?"]').each(function() {
            var m = this.href.match(/\/url\?(?:url|q)\=(http.*?)(\&|$)/i);
            if(m && m[1]) {
                this.href = decodeURIComponent(m[1]);
            }
        });
        //expose cached links
        $('div[role="menu"] ul li a[href^="http://webcache.googleusercontent."]').each(
            function() {
                this.style.display = 'inline';
                $(this).closest('div.action-menu.ab_ctl, div._nBb')
                .after(' <a href="https' + this.href.substring(4) + '">(https)</a> ')
                .after($(this));
            }
        );
    }
    /* DouBanDownload */
    function appendLinks(items, appendTo){
        items.forEach(function(item, i){
            $("<a>")
            .html(item.html)
            .attr({
                href: item.href,
                target: "_blank"
            })
            .appendTo(appendTo);

            if(i != items.length -1){
                appendTo.append(" / ");
            }
        });
    }

    function startFeaturesByConfig(){
        gmUtils.log(location.hostname);
        if(vm.enabledBdMusicRemoveAd && location.hostname === 'play.baidu.com'){
            // 参考：https://greasyfork.org/zh-CN/scripts/2248-%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%E7%9B%92%E5%8E%BB%E5%B9%BF%E5%91%8A
            var i=0,t=window.setInterval(function(){//百度云把一些内容放到后面加载,因此我设置了一个延时循环，每隔100ms选择一下所需的元素，当所需的元素存在时，开始脚本，同时停止延时循环
                if($('#pauseAd').length>0 || i>100){
                    window.clearInterval(t);
                    var width_c4=$('.column4').width();
                    var right_c2=$('.column2').css('right');
                    $('.column3').css({'right':0});
                    $('.column4').css({'display':'none'});
                    $('.column2').css({'right':function(){return parseInt(right_c2,10)-width_c4;}});
                    $('.m-client-product').css({'display':'none'});
                    $('#pauseAd').remove();
                    $('.down-mobile').remove();
                    gmUtils.log('BdMusicRemoveAd:Ads have been removed by MyTools');
                }
                i++;
                gmUtils.log('BdMusicRemoveAd:waiting');
            }, 100);
        }

        var expTestDirectGoogle = /^https?\:\/\/(www|news|maps|docs|cse|encrypted)\.google\./.test(location.href);
        gmUtils.log('expTestDirectGoogle:'+expTestDirectGoogle);
        if(vm.enabledDirectGoogle && expTestDirectGoogle){
            // 参考：https://greasyfork.org/zh-CN/scripts/568-direct-google
            if(MutationObserver) {
                var observer = new MutationObserver(function(mutations) {
                    modifyGoogle();
                });
                //tiny delay needed for firefox
                setTimeout(function() {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    modifyGoogle();
                }, 100);
            }
            //for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
            else {
                setInterval(function() {
                    modifyGoogle();
                }, 500);
            }
        }

        if(vm.enabledDouBanDownload && (location.hostname.indexOf('movie.douban.com')>-1 || location.hostname.indexOf('book.douban.com')>-1)){
            // 参考：https://greasyfork.org/zh-CN/scripts/300-douban-download-search
            var movieTitle = $('h1 span:eq(0)').text();
            var title = $('html head title').text();
            var keyword1 = title.replace( '(豆瓣)', '' ).trim();
            var keyword2 = encodeURIComponent( keyword1 );
            var movieSimpleTitle = movieTitle.replace(/第\S+季.*/, "");
            var movieSubjectId = location.hostname === 'movie.douban.com'?location.pathname.split('/')[2]:'';

            var Movie_links = [
                // { html: "百度盘", href: "http://www.baidu.com/s?wd=" + encodeURIComponent(keyword1 + " site:pan.baidu.com")},
                { html: "豆瓣皮", href: "http://movie.doubanpi.com/subject/"+ movieSubjectId +"/#tab_link"},
                { html: "百度盘", href: "https://www.google.com/search?q=site:pan.baidu.com " + keyword2},
                { html: "bilibili", href: "http://search.bilibili.com/all?keyword=" + keyword2 },
                { html: "acfun", href: "http://www.acfun.tv/search/#query=" + keyword2 },
                //{ html: "人人影视", href: "http://www.yayaxz.com/search/" + movieSimpleTitle },
                { html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
                //{ html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
                //{ html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
                { html: "Torrent Project", href: "https://torrentproject.se/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
                { html: "Google MiniSD", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle + "+MiniSD" }
            ];
            var Book_links = [
                { html: "百度盘", href: "https://www.google.com/search?q=" + keyword1 + " site:pan.baidu.com"},
                { html: "mLook", href: "http://www.mlook.mobi/search?q=" + keyword2 },
                { html: "VeryCD", href: "http://www.verycd.com/search/folders/" + keyword2 },
                { html: "SimpleCD", href: "http://simplecd.me/search/entry/?query=" + keyword1 },
                { html: "Donkey4u", href: "http://donkey4u.com/search/" + movieTitle },
                { html: "Torrent Project", href: "http://torrentproject.com/?&btnG=Torrent+Search&num=20&start=0&s=" + keyword2 },
                { html: "Google", href: "https://www.google.com/search?ie=UTF-8&q=" + movieTitle },
            ];
            var link = $("<div>").append(
                $("<span>").attr("class", "pl").html("下载链接:")
            );
            switch(location.host){
                case "movie.douban.com":
                    appendLinks(Movie_links, link);

                    link.append('<br>')
                        .append('<span class="pl">字幕链接:</span>')
                        .append(
                            $("<a>").attr({
                                href: "https://secure.assrt.net/sub/?searchword=" + keyword2,
                                target: "_blank"
                            }).html("伪射手")
                        )
                        .append(' / ')
                        .append(
                            $("<a>").attr({
                                href: "http://subhd.com/search/" + keyword2,
                                target: "_blank"
                            }).html("subhd")
                        )
                        .append(' / ')
                        .append(
                            $("<a>").attr({
                                href: "http://www.zimuzu.tv/search?type=subtitle&keyword=" + keyword2,
                                target: "_blank"
                            }).html("zimuzu")
                        );
                    break;
                case "book.douban.com":
                    appendLinks(Book_links, link);
                    break;
            }
            $('#info').append(link);
        }
        if(vm.enabledDouBanDownload && location.href.indexOf('//movie.douban.com/subject')>-1){
            var aside_html = "";
            aside_html += '<div class="c-aside">';
            aside_html += '<h2><i class="">四字标题</i>· · · · · · </h2>';
            aside_html += '<div class="c-aside-body" style="padding: 0 18px;">';
            aside_html += '<ul class="bs">';
            aside_html += '</ul>';
            aside_html += '</div>';
            aside_html += '</div>';

            var imdb_html = "";
            imdb_html += '<div class="rating_wrap clearbox rating_imdb" rel="v:rating" style="padding-top: 0;">';
            imdb_html += '<div class="rating_logo">IMDB 评分</div>';
            imdb_html += '<div class="rating_self clearfix" typeof="v:Rating">';
            imdb_html += '<strong class="ll rating_num" property="v:average">0</strong>';
            imdb_html += '<span property="v:best" content="10.0"></span>';
            imdb_html += '<div class="rating_right ">';
            imdb_html += '<div class="ll"></div>';
            imdb_html += '<div class="rating_sum">';
            imdb_html += '<a href="collections" class="rating_people"><span property="v:votes">0</span>人评价</a>';
            imdb_html += '</div>';
            imdb_html += '</div>';
            imdb_html += '</div>';
            imdb_html += '</div>';
            var c_css = ".c-aside{margin-bottom:30px}.c-aside-body{*letter-spacing:normal}.c-aside-body a{color:#37A;width:65px;text-align:center;letter-spacing:normal;margin:0 8px 8px 0;padding:0 8px;display:inline-block;border-radius:6px}.c-aside-body a:link,.c-aside-body a:visited{background-color:#f5f5f5;color:#37A}.c-aside-body a:hover,.c-aside-body a:active{background-color:#e8e8e8;color:#37A}.c-aside-body a.disabled{text-decoration:line-through}.c-aside-body a.available{color:#006363;background-color:#5ccccc}.c-aside-body a.available:hover,.c-aside-body a.available:active{background-color:#3cc}.c-aside-body a.sites_r0{text-decoration:line-through}#interest_sectl .rating_imdb{padding-bottom:0;border-bottom:1px solid #eaeaea}#interest_sectl .rating_wrap{padding-top:15px}#interest_sectl .rating_more{position:relative;padding:15px 0;border-top:1px solid #eaeaea;color:#9b9b9b;margin:0}#interest_sectl .rating_more a{left:80px;position:absolute}#interest_sectl .rating_more .titleOverviewSprite{background:url('https://cdn.guqiankun.com/img/201702/20170213143823398995.png') no-repeat;display:inline-block;vertical-align:middle}#interest_sectl .rating_more .popularityImageUp{background-position:-14px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityImageDown{background-position:-34px -478px;height:8px;width:8px}#interest_sectl .rating_more .popularityUpOrFlat{color:#83C40B}#interest_sectl .rating_more .popularityDown{color:#930E02}#dale_movie_subject_top_right,#dale_movie_subject_top_right,#dale_movie_subject_top_midle,#dale_movie_subject_middle_right,#dale_movie_subject_bottom_super_banner,#footer,.qrcode-app,.top-nav-doubanapp,.extra,div.gray_ad,p.pl,div.ticket{display:none}";
            gmUtils.addStyle(c_css);
            $(function() {
                function getDoc(url, callback) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            'Content-type': null
                        },
                        onload: function(response) {
                            var doc = '';
                            if (response.status == 200) {
                                doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                                if (doc === undefined) {
                                    doc = document.implementation.createHTMLDocument("");
                                    doc.querySelector('html').innerHTML = responseText;
                                }
                            }
                            callback(doc, response.finalUrl);
                        }
                    });
                }

                function postDoc(url, callback, data) {
                    GM_xmlhttpRequest({
                        anonymous: true,
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded'
                        },
                        data: data,
                        onload: function(response) {
                            callback(response.responseText, response.finalUrl);
                        }
                    });
                }

                function getJSON(url, callback) {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            "Accept": "application/json"
                        },
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 400) {
                                callback(JSON.parse(response.responseText), url);
                            } else {}
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
                var site_online = $(aside_html);
                site_online.addClass("site_online");
                site_online.find("div.c-aside-body").addClass("site-online-body");
                site_online.find("h2 i").text("在线资源");
                $("#content div.tags").before(site_online);

                function update_site_online_sites(title, en) {
                    if (en) {} else {
                        var site_online_sites = {
                            "f4yy": "http://f4yy.com/index.php?m=vod-search-pg-1-wd-" + encodeURIComponent(title),
                            "电影6080": "http://www.6080.tv/book/search?action=search&t=8&tag=" + title,
                            "Bilibili": "http://search.bilibili.com/all?keyword=" + title,
                            "4K吧": "http://www.kkkkba.com/index.php?s=vod-search-wd-" + title + ".html",
                            "AcFun": "http://www.acfun.cn/search/#query=" + title,
                            "搜库": "http://www.soku.com/search_video/q_" + title
                        };
                        var sites_playBtn = $("div.gray_ad a.playBtn");
                        for (var i = 0, n;
                            (n = sites_playBtn[i]); i++) {
                            var t = $(n).text().replace(/\s/g, "").replace("视频", "");
                            var l = $(n).attr("href");
                            if (l == "javascript: void 0;") {
                                continue;
                            }
                            l = parseURL(l).params['url'];
                            l = decodeURIComponent(l);
                            l = "http://www.sfsft.com/admin.php?url=" + l;
                            site_online_sites[t] = l;
                        }
                    }
                    for (var name in site_online_sites) {
                        link = site_online_sites[name];
                        link_parsed = parseURL(link);
                        link = $("<a></a>").attr("href", link);
                        link.attr("data-host", link_parsed.host);
                        link.attr("target", "_blank").attr("rel", "nofollow");
                        if (link_parsed.host === 'www.sfsft.com' || link_parsed.host === 'search.bilibili.com') {
                            link.addClass('available');
                        }
                        link.html(name);
                        $("#content div.site-online-body ul").append(link);
                    }
                }
                var site_offline = $(aside_html);
                site_offline.addClass("name-offline");
                site_offline.find("div.c-aside-body").addClass("site-offline-body");
                site_offline.find("h2 i").text("离线资源");
                $("#content div.tags").before(site_offline);

                function update_site_offline_sites(title, en) {
                    if (en) {
                        var site_offline_sites = {
                            "海盗湾": "http://thepiratebay.ee/s/?q=" + title,
                            "kickass": "https://katcr.co/new/torrents-search.php?c69=1&c80=1&c79=1&c148=1&c149=1&c81=1&c78=1&c150=1&c71=1&c74=1&cat=0&incldead=0&freeleech=0&inclexternal=0&lang=0&search=" + title,
                            "rarbg": "https://rarbg.to/torrents.php?search=" + title,
                            "飘域家园": "http://bbs.homefei.net/searcher.php?keyword=" + title
                        };
                    } else {
                        var site_offline_sites = {
                            "龙部落": "http://www.lbldy.com/search/" + title,
                            "51下片": "http://www.51xiapian.com/search.php?submit=%E6%90%9C%E7%B4%A2&searchword=" + title,
                            "高清网": "http://gaoqing.la/?s=" + title,
                            "高清控": "http://www.gaoqingkong.com/?s=" + title,
                            "BT天堂": "http://www.bttt.la/s.php?q=" + title + "&sitesearch=www.bttt.la&domains=bttt.la&hl=zh-CN&ie=UTF-8&oe=UTF-8",
                            "BT吧": "http://www.btba.com.cn/search?keyword=" + title,
                            "movie吧": "http://www.52movieba.com/?s=" + title,
                            "动漫花园": "https://share.dmhy.org/topics/list?keyword=" + title,
                            "电影天堂": "http://zhannei.baidu.com/cse/search?q=" + title + "&s=4523418779164925033",
                            "飘花资源": "http://so.piaohua.com:8909/plus/search.php?kwtype=0&keyword=" + title,
                            "BT之家": "http://www.btbtt.la/search-index-keyword-" + title + ".htm",
                            "我飞网": "http://www.9kkz.com/search.php?keyword=" + title,
                            "片源网": "http://pianyuan.net/search?q=" + title,
                            "比特大雄": "http://www.btdx8.com/?s=" + title,
                            "RARBT": "http://www.rarbt.com/index.php/search/index.html?search=" + title,
                            "CILI001": "http://cili17.com/?topic_title3=" + title,
                            "哇呱影视": "http://www.gagays.com/movie/search?req%5Bkw%5D=" + title,
                            "天天美剧": "http://www.ttmeiju.com/index.php/search/index.html?keyword=" + title + "&range=0",
                            "深影论坛": "http://zhannei.baidu.com/cse/search?q=" + title + "&click=1&s=10886843873236087874&nsid="
                        };
                    }
                    for (var name in site_offline_sites) {
                        link = site_offline_sites[name];
                        link_parsed = parseURL(link);
                        link = $("<a></a>").attr("href", link);
                        link.attr("data-host", link_parsed.host);
                        link.attr("target", "_blank").attr("rel", "nofollow");
                        link.html(name);
                        $("#content div.site-offline-body ul").append(link);
                    }
                }
                var site_sub = $(aside_html);
                site_sub.addClass("name-offline");
                site_sub.find("div.c-aside-body").addClass("site-sub-body");
                site_sub.find("h2 i").text("字幕资源");
                $("#content div.related-info").after(site_sub);

                function update_site_sub_sites(title, en) {
                    if (en) {
                        var site_offline_sites = {
                            "射手伪": "http://assrt.net/sub/?searchword=" + title,
                        };
                    } else {
                        var site_offline_sites = {
                            "字幕库": "http://www.zimuku.net/search?q=" + title,
                            "字幕组": "http://www.zimuzu.tv/search/index?keyword=" + title,
                            "sub HD": "http://subhd.com/search/" + title,
                            "sub OM": "http://www.subom.net/search/" + title,
                            "163字幕": "http://www.163sub.com/Search?id=" + title,
                            "第三楼字幕": "http://zhannei.baidu.com/cse/search?click=1&s=8073048380622477318&nsid=&q=" + title,
                            "电波字幕": "http://dbfansub.com/?s=" + title,
                        };
                    }
                    for (var name in site_offline_sites) {
                        link = site_offline_sites[name];
                        link_parsed = parseURL(link);
                        link = $("<a></a>").attr("href", link);
                        link.attr("data-host", link_parsed.host);
                        link.attr("target", "_blank").attr("rel", "nofollow");
                        link.html(name);
                        $("#content div.site-sub-body ul").append(link);
                    }
                }
                var title = title_sec = $("#content > h1 > span")[0].textContent.split(" ");
                title = title.shift();
                title_sec = title_sec.join(" ").trim();
                var title_en = "";
                update_site_online_sites(title);
                update_site_offline_sites(title);
                update_site_sub_sites(title);
                (function() {
                    var imdb = $("div#info a[href^='http://www.imdb.com/title/tt']");
                    if (imdb) {
                        var imdb_href = imdb.attr('href');
                        imdb_id = imdb.text();
                        if (imdb && imdb_id.startsWith('tt')) {
                            imdb_id = imdb_id.slice(2);
                        } else {
                            imdb_id = "";
                        }
                        getDoc(imdb_href, function(doc, url) {
                            if ($(doc).find("div.notEnoughRatings").length) {
                                return;
                            }
                            title_imdb = $(doc).attr('title');
                            title_imdb = title_imdb.split(" (")[0];
                            update_site_offline_sites(title_imdb, true);
                            update_site_sub_sites(title_imdb, true);
                            var rating_douban = $("#interest_sectl .rating_wrap").addClass("rating_douban");
                            var rating_douban_ratingValue = $("#interest_sectl .rating_douban a.rating_people span[property^=v]").text();
                            rating_douban_ratingValue = (rating_douban_ratingValue + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
                            $("#interest_sectl .rating_douban a.rating_people span[property^=v]").text(rating_douban_ratingValue);
                            $("#interest_sectl").prepend($(imdb_html));
                            var rating_imdb = $("#interest_sectl .rating_imdb");
                            $("#interest_sectl .rating_imdb a.rating_people").attr("href", imdb_href + "/" + "ratings?ref_=tt_ov_rt");
                            var ratingValue = $('span[itemprop=ratingValue]', doc).text();
                            $("#interest_sectl .rating_imdb strong.rating_num").text(ratingValue);
                            var starValue = ratingValue / 2;
                            starValue = ((starValue % 1) > 0.5) ? Math.floor(starValue) + 0.5 : Math.floor(starValue);
                            starValue *= 10;
                            starValue = "bigstar" + starValue;
                            $("#interest_sectl .rating_imdb div.rating_right div.ll").addClass(starValue);
                            var ratingCount = $('span[itemprop=ratingCount]', doc).text();
                            $("#interest_sectl .rating_imdb a.rating_people span[property^=v]").text(ratingCount);
                            $("#interest_sectl").append($("<div></div>").addClass("rating_more"));
                            var rating_more = $("#interest_sectl .rating_more");
                            var titleReviewBarItem = $('div.titleReviewBarItem', doc);
                            var Metasocre = "";
                            for (var i = 0, n;
                                (n = titleReviewBarItem[i]); i++) {
                                var t = $(n).text();
                                if (t.indexOf("Metascore") != -1) {
                                    var Metascore = $(n).find("a[href^=criticreviews] span").text();
                                    rating_more.html(rating_more.html() + "Metasocre" + $("<a></a>").attr("href", imdb_href + "/" + "criticreviews?ref_=tt_ov_rt").text(Metascore)[0].outerHTML + "<br>");
                                } else if (t.indexOf("Reviews") != -1) {} else if (t.indexOf("Popularity") != -1) {
                                    var Popularity = $(n).find("span.subText").html();
                                    rating_more.html(rating_more.html() + "流行度&nbsp;&nbsp;" + Popularity + "<br>");
                                }
                            }
                        });
                    }
                })();
                (function() {
                    var site = $("div.aside a[data-host$='f4yy.com']");
                    if (site) {
                        var site_href = site.attr("href");
                        getDoc(site_href, function(doc) {
                            var lists = $("#contents li", doc);
                            var links = [];
                            for (var i = 0; i < lists.length; i++) {
                                var l = $(lists[i]);
                                links.push('http://f4yy.com' + l.find("a[href^='/vodhtml']").attr("href"));
                            }
                            if (links.length == 0) {
                                site.addClass("disabled");
                                return;
                            } else if (links.length == 1) {
                                site.attr('href', links[0]);
                                site.addClass('available');
                            }
                        });
                    }
                })();
                (function() {
                    var site = $("div.aside a[data-host$='lbldy.com']");
                    if (site) {
                        var site_href = site.attr("href");
                        getDoc(site_href, function(doc) {
                            var lists = $("div.col div.postlist", doc);
                            var links = [];
                            for (var i = 0; i < lists.length; i++) {
                                var l = $(lists[i]);
                                l = l.find("a");
                                links.push(l.attr("href"));
                            }
                            if (links.length == 0) {
                                site.addClass("disabled");
                                return;
                            } else if (links.length == 1) {
                                site.attr('href', links[0]);
                                site.addClass('available');
                            }
                        });
                    }
                })();
                (function() {
                    var site = $("div.aside a[data-host$='www.6080.tv']");
                    if (site) {
                        var site_href = site.attr("href");
                        getDoc(site_href, function(doc) {
                            var lists = $("div.bd ul.pic li", doc);
                            var links = [];
                            for (var i = 0; i < lists.length; i++) {
                                var l = $(lists[i]);
                                if (l.find("span > span").text().indexOf(title) != -1) {
                                    links.push('http://www.6080.tv' + l.find("a[href^='/note']").attr("href"));
                                }
                            }
                            if (links.length == 0) {
                                site.addClass("disabled");
                                return;
                            } else if (links.length == 1) {
                                site.attr('href', links[0]);
                                site.addClass('available');
                            }
                        });
                    }
                })();
                (function() {
                    if ($("#dale_movie_subject_top_right").length) {
                        $("#dale_movie_subject_top_right").remove();
                    }
                    if ($("#dale_movie_subject_top_right").length) {
                        $("#dale_movie_subject_top_right").remove();
                    }
                    if ($("#dale_movie_subject_top_midle").length) {
                        $("#dale_movie_subject_top_midle").remove();
                    }
                    if ($("#dale_movie_subject_middle_right").length) {
                        $("#dale_movie_subject_middle_right").remove();
                    }
                    if ($("#dale_movie_subject_bottom_super_banner").length) {
                        $("#dale_movie_subject_bottom_super_banner").remove();
                    }
                    if ($("#footer").length) {
                        $("#footer").remove();
                    }
                    if ($(".qrcode-app").length) {
                        $(".qrcode-app").remove();
                    }
                    if ($(".top-nav-doubanapp").length) {
                        $(".top-nav-doubanapp").remove();
                    }
                    if ($(".extra").length) {
                        $(".extra").remove();
                    }
                    if ($("div.gray_ad").length) {
                        $("div.gray_ad").remove();
                    }
                    if ($("p.pl").length) {
                        $("p.pl").remove();
                    }
                    if ($("div.ticket").length) {
                        $("div.ticket").remove();
                    }
                })();
            });
        }

        if(vm.enabledCopyPage){
            with (document.wrappedJSObject || document) {
                onmouseup = null;
                onmousedown = null;
                oncontextmenu = null;
                ondragstart = null;
                onselectstart = null;
                onselect = null;
                oncopy = null;
                onbeforecopy = null;
            }
            var arAllElements = document.getElementsByTagName('*');
            for (var i = arAllElements.length - 1; i >= 0; i--) {
                var elmOne = arAllElements[i];
                with (elmOne.wrappedJSObject || elmOne) {
                    onmouseup = null;
                    onmousedown = null;
                }
            }
        }

        if(vm.enabledGwd){
            var includeUrls = [
                'taobao.com',
                'tmall.com',
                'jd.com',
                'jd.hk',
                'amazon.cn',
                'amazon.com',
                'yhd.com',
                'suning.com',
                'gome.com.cn',
                'dangdang.com',
                'vip.com',
                'ebay.com',
                '6pm.com',
                'zol.com',
                'yixun.com',
                '51buy.com',
                'newegg.cn',
                'okhqb.com',
                'paipai.com',
                'sfbest.com',
                'womai.com',
                'kaola.com'
            ];
            for(var urlIndex = 0, len = includeUrls.length; urlIndex < len; urlIndex++){
                if(window.location.hostname.indexOf(includeUrls[urlIndex]) > -1){
                    var s = document.createElement("script");
                    s.type="text/javascript";
                    s.charset="utf-8";
                    s.src='https://browser.gwdang.com/get.js?f=/js/gwdang_extension.js';  //"//www.gwdang.com/get.js?f=/js/gwdang_extension.js";
                    document.body.appendChild(s);
                    break;
                }
            }
        }

        if(vm.enabledBdYunLargeFileDownload){
            var includeUrls = [
                'pan.baidu.com',
                'yun.baidu.com'
            ];
            for(var urlIndex = 0, len = includeUrls.length; urlIndex < len; urlIndex++){
                if(window.location.hostname.indexOf(includeUrls[urlIndex]) > -1){
                    //Object.defineProperty(navigator,"platform",{value:"sb_baidu",writable:false,configurable:false,enumerable:true});
                    if(window.location.protocol === 'http:' && /http:/.test(window.location.href)) {
                        window.location.href = 'https' + window.location.href.slice(4);
                    }
                }
            }
        }

        if(vm.enabledFlatZhihu){
            // 参考：https://github.com/Frizen/Plains-Gate/blob/master/flat_zhihu.CSS
            // @resource     wwwzhihucomcss http://7xrmpf.com1.z0.glb.clouddn.com/www.zhihu.com.css
            // @resource     zhuanlanzhihucomcss http://7xrmpf.com1.z0.glb.clouddn.com/zhuanlan.zhihu.com.css
            // @resource     wwwzhihucomquestioncss http://7xrmpf.com1.z0.glb.clouddn.com/www.zhihu.com_question.css
            var wwwzhihucomcss = '@media only screen and (-webkit-min-device-pixel-ratio:2),not all{i[class^=z-icon-],.modal-dialog-title-close,.goog-option-selected .goog-menuitem-checkbox,.zg-content-img-icon,.zg-content-video-icon,.tr-icon,.tr-inline-icon,.zg-icon,.icon-external,.ignore,.side-topic-item .up,.side-topic-item .delete,.zu-edit-button-icon,.zg-blue-edit,.zm-add-question-detail-icon,.zh-hovercard-arrow,.zu-top-live-icon,.zm-profile-details-items .zm-profile-tag-btn,.zm-item-top-btn,.zm-profile-icon,.zm-profile-header-icon,.zm-profile-empty-icon,.zu-global-notify-icon,.zu-global-notify-close,.zm-modal-dialog-guide-title-msg,.zm-modal-dialog-guide-title-dropdown,.zm-noti7-popup-tab-item .icon,.zu-noti7-popup .zu-top-live-icon,.icon-info,.icon-green-check,.icon-big-arrow-left,.icon-big-arrow-right,.icon-weibo,.icon-qzone,.icon-weibo-corner,.icon-big-white-sina,.icon-big-white-qq,.icon-big-white-mail,.icon-sign-arrow{background-image:url(https://ohupjrb3o.qnssl.com/sprites-1.1.2@2x.png);background-size:308px 250px;}}html body,html input,html textarea,html select,html button{font-family:".SFNSText-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;letter-spacing:0.02em;text-rendering:optimizeLegibility;}a{color:#259;text-decoration:none!important;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-ms-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;}i,em{font-style:normal!important;}strong,b{font-weight:600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}h1,h2,h3,h4,h5{font-weight:600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.zg-wrap{width:1200px;}@media (max-width:1024px) and (min-width:360px){.zu-main{padding:70px 0 50px!important;}}.zu-main{padding:25px 0 50px;}.zu-main-sidebar{margin:0 0 0 -310px;width:310px;}h1,h2,h3,h4,h5{font-size:15px;}body,input,textarea,select,button{font-size:15px;line-height:1.9;color:#444;}@media (max-width:1400px) and (min-width:961px){.zg-wrap{width:960px!important;}.zu-main.with-indention-votebar .zu-main-content-inner{margin-left:48px!important;}.zu-main-sidebar{margin:0 0 0 -270px!important;width:270px!important;}body,input,textarea,select,button{font-size:13px!important;}h1,h2,h3,h4,h5{font-size:14px!important;}}@media (max-width:960px){.zg-wrap{width:auto!important;}.zu-main.with-indention-votebar .zu-main-content-inner{margin-left:48px!important;}.zu-main-sidebar{width:270px!important;}.zu-top-search-form{width:240px!important;}.zu-top-nav-link{width:auto!important;padding:0 10px!important;}body,input,textarea,select,button{font-size:13px!important;}h1,h2,h3,h4,h5{font-size:14px!important;}}.feed-item .content h2{font-size:16px}.feed-item .entry-body,.feed-item .zm-item-answer{margin-top:5px;}.feed-main{margin:-5px 0 2px 48px;}.feed-item .author-info,.feed-item .author-info a{font-size:14px;}.feed-item .zm-item-answer-author-info{font-size:14px;font-weight:bold;}.zm-item-rich-text.js-collapse-body,.zm-item-answer-author-info,.zh-summary.summary.clearfix{line-height:1.9;}#zh-question-title>.zm-item-title{font-size:22px;}.zm-item-vote-info .text{font-size:14px;}.zm-item-vote-info{margin:5px 0;}.zm-meta-panel{padding:3px 0;font-size:14px;}.feed-item{padding:21px 0 18px 0;}.zh-summary{padding-top:3px;}@media (max-width:1400px) and (min-width:968px){html body,html input,html textarea,html select,html button{font-size:13px!important;line-height:1.9em!important;}.feed-main{margin-top:-3px;}.feed-main{margin-bottom:2px;}.feed-item .content h2{font-size:14px!important;}.feed-item .author-info,.feed-item .author-info a{font-size:13px!important;}.feed-item .zm-item-vote-info,.feed-item .zm-item-answer-author-info{font-size:13px!important;}.zm-item-rich-text.js-collapse-body,.zm-item-answer-author-info,.zh-summary.summary.clearfix{font-size:13px!important;line-height:1.9!important;}.feed-item .entry-body,.feed-item .zm-item-answer{margin-top:2px!important;}#zh-question-title>.zm-item-title{font-size:18px!important;}.zm-item-vote-info .text{font-size:12px!important;}.zm-item-vote-info{margin:7px 0!important;}.zm-meta-panel{padding:3px 0!important;font-size:13px!important;}.feed-item{padding:18px 0 13px 0;}.zh-summary{padding-top:0px;}}address,blockquote,sup{line-height:1.8em;}@media (max-width:1400px) and (min-width:968px){address,blockquote,sup{line-height:1.9em!important;}}.feed-source,.feed-source a{font-size:14px;}@media (max-width:1400px) and (min-width:968px){.feed-source,.feed-source a{font-size:13px!important;}}.zu-main-content-inner{position:relative;margin:0 388px 0 0!important;}@media (max-width:1400px) and (min-width:968px){.zu-main-content-inner{position:relative;margin:0 328px 0 0!important;}}.zm-side-nav-link{height:34px;}@media (max-width:1400px) and (min-width:968px){.zm-side-nav-link{height:31px!important;}}.zm-profile-header-main .top{margin-left:185px;}@media (max-width:1400px) and (min-width:968px){.zm-profile-header-main .top{margin-left:162px!important;}}.zm-item-answer-author-wrap{font-size:14px;}@media (max-width:1400px) and (min-width:968px){.zm-item-answer-author-wrap{font-size:13px!important;}}.zu-top-search{margin:7px 0 0 34px;}@media (max-width:1400px) and (min-width:968px){.zu-top-search{margin:7px 0 0 12px!important;}}.zu-top-search-form{width:400px;}@media (max-width:1400px) and (min-width:968px){.zu-top-search-form{width:367px!important;}}.zu-top-nav-ul{margin:0 0 0 40px;}@media (max-width:1400px) and (min-width:968px){.zu-top-nav-ul{margin:0 0 0 18px!important;}}.zu-top-nav-link{width:60px;height:46px;font-size:15px;}@media (max-width:1400px) and (min-width:968px){.zu-top-nav-link{width:54px!important;font-size:14px!important;}}.zu-noti7-popup.zu-top-nav-live{left:136px;top:50px;font-size:13px;}.zu-top-nav-count{left:45px;}@media (max-width:1400px) and (min-width:968px){.zu-noti7-popup.zu-top-nav-live{left:51px!important;}.zu-top-nav-count{left:31px!important;}}.feed-item .time{font-size:13px;margin-top:-6px;}.editable{font-size:14px;}@media (max-width:1400px) and (min-width:968px){.editable{font-size:13px!important;}}@media (max-width:1400px) and (min-width:968px){.feed-item .time{font-size:13px!important;margin-top:-4px!important;}}.comment-app-holder,.zm-comment-box{max-width:764px;}@media (max-width:1400px) and (min-width:968px){.comment-app-holder,.zm-comment-box{max-width:540px!important;}}.feed-item .author-info,.feed-item .author-info a{margin-bottom:5px!important;color:#444!important;}@media (max-width:1400px) and (min-width:968px){.feed-item .author-info,.feed-item .author-info a{margin-bottom:6px;}}.feed-item .zm-item-vote-info,.feed-item .zm-item-answer-author-info{margin:2px 0 5px 0;}@media (max-width:1400px) and (min-width:968px){.feed-item .zm-item-vote-info,.feed-item .zm-item-answer-author-info{margin:2px 0 6px 0!important;}}.zu-top-add-question{margin:7px 10px 0 0;}@media (max-width:1400px) and (min-width:968px){.zu-top-add-question{margin:7px 0 0 0!important;}}.zh-backtotop{margin-left:300px;}@media (max-width:1400px) and (min-width:968px){.zh-backtotop{margin-left:230px!important;}}.feed-item .source{font-size:13px;}@media (max-width:1400px) and (min-width:968px){.zm-side-my-columns .column-link{padding-bottom:4px!important;}}.zm-side-my-columns .column-link{line-height:32px;padding-bottom:2px;}.profile-navbar .item{padding:12px 30px;font-size:15px;line-height:30px;}@media (max-width:1400px) and (min-width:968px){.profile-navbar .item{padding:12px 20px!important;font-size:14px;line-height:22px;}}#zu-distraction-free-editor .title,#zu-distraction-free-editor .wrapper,#zu-distraction-free-editor .toolbar,#zu-distraction-free-editor .content{width:1200px;}#zu-distraction-free-editor .goog-scrollfloater{width:1200px;}@media (max-width:1400px) and (min-width:968px){#zu-distraction-free-editor .title,#zu-distraction-free-editor .wrapper,#zu-distraction-free-editor .toolbar,#zu-distraction-free-editor .content{width:800px!important;}}@media (max-width:1400px) and (min-width:968px){#zu-distraction-free-editor .goog-scrollfloater{width:800px!important;}}.zh-profile-card{width:400px;}.zh-profile-card .upper span.name{font-size:16px;}.zh-profile-card .upper div.tagline{font-size:14px;}@media (max-width:1400px) and (min-width:968px){.zh-profile-card{width:380px!important;}.zh-profile-card .upper span.name{font-size:13px!important;}.zh-profile-card .upper div.tagline{font-size:13px!important;}}.zu-top-nav-li{padding:0 6px;}@media (max-width:1400px) and (min-width:968px){.zu-top-nav-li{padding:0!important;}}.zm-profile-section-main.zm-profile-section-activity-main .question_link,.zm-profile-section-main.zm-profile-section-activity-main .post-link,h2.zm-profile-question{font-size:15px;}.skilled-topics .item .content .content-inner a,.skilled-topics .item .content .content-inner p,.zg-gray{font-size:14px;}.zm-profile-vote-count{height:42px;}.zm-profile-vote-num{padding:4px 0 4px;}.HomeEntry-box{margin-left:0px;border:0px solid #f0f0f0;background:#f9f9f9;}@media (max-width:1400px) and (min-width:968px){.zm-profile-section-main.zm-profile-section-activity-main .question_link,.zm-profile-section-main.zm-profile-section-activity-main .post-link,h2.zm-profile-question{font-size:14px!important;}.skilled-topics .item .content .content-inner a,.skilled-topics .item .content .content-inner p,.zg-gray{font-size:13px!important;}.zm-profile-vote-count{height:38px!important;}.zm-profile-vote-num{padding:2px 0 4px!important;}}.zm-editable-editor-field-wrap{padding:10px 24px;}@media (max-width:1400px) and (min-width:968px){.zm-editable-editor-field-wrap{padding:8px 10px!important;}}.zm-item-rich-text li,.zm-editable-content li,.editable li{margin:8px 5px 5px 30px;}@media (max-width:1400px) and (min-width:968px){.zm-item-rich-text li,.zm-editable-content li,.editable li{margin:8px 5px 5px 30px!important;}}blockquote{padding:0 0 0 16px;}.Avatar--l{width:150px;height:150px;border:none;border-radius:10px;position:absolute;}.zm-profile-header-main .top .bio{font-size:15px;}@media (max-width:1400px) and (min-width:968px){.Avatar--l{width:136px!important;height:136px!important;}.ProfileAvatarEditor{width:136px!important;height:136px!important;}.zm-profile-header-info{margin-left:120px!important;padding-top:0px;}.zm-profile-header-description.editable-group{margin:10px -18px 0px -122px!important;}.zm-profile-header .items{margin-left:40px!important;}.title-section.ellipsis{margin-left:46px!important;}.zm-profile-header-main .top .bio{font-size:13px;}.zm-profile-side-columns .link,.zm-profile-side-topics .link,.zm-profile-side-columns .Avatar,.zm-profile-side-topics .Avatar{height:34px!important;width:34px!important;}}.zm-profile-header-main{padding:12px 18px 0px 18px;}.zm-profile-header-description.editable-group{border-top:none;margin:18px -18px 0px -132px;color:#444;}.zm-profile-header-description{padding:0 0 6px 0;}.zm-profile-header .zm-profile-header-user-describe .item+.item{margin-top:5px;}.zm-profile-header-marked{padding:6px 18px 14px 18px;border-top:none;}.ProfileAvatarEditor{width:150px;height:150px;box-shadow:none;border-radius:10px;}.zm-profile-header .items{margin-left:50px;min-height:78px;color:#444;}.title-section.ellipsis{margin-left:65px;max-width:380px;color:#666;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.zm-profile-header-info{margin-left:132px;padding-top:5px;}.zg-link-litblue{font-size:inherit;}#zh-fav-list-side-related .zm-item-title{font-size:inherit;}.feed-item-l{display:none;}.feed-item-p{display:none;}.HomeEntry-boxArrow{display:none;}.HomeEntry-avatar{display:none;}.feed-item{padding:18px 0 13px 0;}#zh-home-list-title{color:#999;}.zm-noti-cleaner-setting{opacity:0;position:relative;top:2px;transition:none;}.zg-section:hover .zm-noti-cleaner-setting{opacity:1;}.zu-main-feed-con{border-top:1px solid #ddd;border-bottom:1px solid #ddd;}a.zu-main-feed-fresh-button{border:1px solid #f9f9f9;background-color:#f9f9f9;text-shadow:none;transition:all 0.2s ease-in-out;color:#999;}.zm-editable-content .answer-date-link-wrap{margin-top:5px;}a.zu-main-feed-fresh-button:hover,a.zu-main-feed-fresh-button:active{background:#E4EAFF;border:1px solid #E4EAFF;color:#698ebf;}.zg-btn-white.zu-button-more:hover{background-color:#E4EAFF;color:#698ebf!important;}.zg-btn-white.zu-button-more{background-color:#F9F9F9;transition:all 0.2s ease-in-out;}.zg-btn-white.zu-button-more:active{background:#daedf5;}._CommentBox_root_G_1m._CommentBox_bordered_3Fo-{box-shadow:none;border:none;border-top:1px solid #ddd;border-radius:0px;}.zm-comment-box{box-shadow:none;border:none;border-top:1px solid #ddd;border-radius:0px;}.zm-item-comment+.zm-item-comment{border-top:dotted 1px #ddd;}.zm-item-comment .zm-comment-hd,.zm-item-comment .zm-comment-ft{margin:4px 0 4px 0;}.zm-item-comment{border-bottom:dotted 1px #ddd;}.zm-item-comment+.zm-item-comment{border-bottom:dotted 1px #ddd;border-top:solid 0px #eee;}._CommentForm_bordered_2isg{background:none;border-radius:0px;border-top:0px dotted #ddd;border-bottom:1px solid #ddd;}._CommentBox_pagerBorder_yuO1{border-top:1px solid #eee;margin:0 1em 0 1em;border-bottom:1px solid #eee;}.zm-comment-box.empty.cannot-comment .zm-comment-box-ft,.zm-comment-box .zm-comment-box-ft{background:none;border-radius:0px;border-top:0px dotted #ddd;border-bottom:1px solid #ddd;}._InputBox_root_1Xwi{border:1px solid #ddddFF;border-radius:3px;box-shadow:none;color:#333;line-height:1.8;background-color:#F9F9FF;transition:all .2s ease-in-out;}._InputBox_root_1Xwi:focus{border:1px solid #ddddFF;background-color:#FCFCFF;}.zm-comment-form .zm-comment-textarea,.zm-comment-form .zm-comment-editable{border:1px solid #ddddFF;border-radius:3px;box-shadow:none;background-color:#F9F9FF;transition:all .2s ease-in-out;}.zm-comment-form .zm-comment-textarea,.zm-comment-form .zm-comment-editable:focus{border:1px solid #ddddFF;background-color:#FCFCFF;}.modal-dialog-buttons button[name=cancel]{color:#999;background:transparent;cursor:none;}html.no-touch .modal-dialog-buttons button[name=cancel]:hover{text-decoration:none;}.goog-buttonset-default{background-color:#2c93ee;background-image:none;text-shadow:none;border:0px;color:#fff!important;box-shadow:none;border-radius:3px;}.goog-buttonset-default:hover{background:#35A0FF;background-color:#35A0FF;background-image:none;box-shadow:none;}.goog-buttonset-default:active{background:#35A0FF;background-color:#35A0FF;background-image:none;box-shadow:none;}.zg-btn-blue{background-color:#2c93ee;background-image:none;text-shadow:none;border:0px;color:#fff!important;box-shadow:none;border-radius:3px;}.zg-btn-blue:hover{background:#35A0FF;background-color:#35A0FF;background-image:none;box-shadow:none;}.zg-btn-blue:active{background:#35A0FF;background-color:#35A0FF;background-image:none;box-shadow:none;}.zm-command-cancel{font-size:13px;margin:0px;border:0px solid #6EBBFF;padding:8px 11px 6px 11px;border-radius:3px 0px 0px 3px;line-height:1.7;color:#999}.zm-command-cancel:hover{text-decoration:none;}.feed-item .ignore:hover{background-position:-261px -62px;}.zm-comment-box .load-more{border:0px;border-bottom:1px dotted #ddd;color:#999;box-shadow:none;text-shadow:none;margin:0 12px;}.zm-comment-box .load-more{border:0px;border-bottom:1px dotted #ddd;color:#999;box-shadow:none;text-shadow:none;margin:0 12px;}html.no-touch .zm-comment-box .load-more:hover{background:#fcfcfc;text-decoration:none;}.feed-item .time{opacity:0;margin-top:-2px;transition:.1s;}.feed-item:hover .time{opacity:1;}.feed-item .avatar img{opacity:0.5;border-radius:3px;transition:.1s;}.feed-item:hover .avatar img{opacity:1;}.zm-item-vote-count{opacity:0.65;line-height:inherit;}.feed-item:hover .zm-item-vote-count{opacity:1;transition:.1s;}.feed-item .ignore{visibility:visible!important;opacity:0;right:-4px;}.feed-item:hover .ignore{opacity:1;}.zu-autohide{transition:.1s;}.feed-item.combine.first-combine .content,.feed-item.combine.first-combine .entry-body{margin-top:0px;}.zh-summary .inline-img{display:none;}.zh-summary{min-height:26px;}.video-box.thumbonly{display:none;}.video-box-thumbnail{display:none;}.video-box-thumbnail .thumbnail{display:none;}a.toggle-expand{transition:.1s;}.zm-noti7-frame-border.top::after{box-shadow:none;}.zm-noti7-frame-border.bottom::after{box-shadow:none;}.zm-comment-box .load-more+.zm-item-comment{border-top:0px solid #eee;}.toggle-expand.btn-toggle-question-detail{left:0;}.feed-item .roundtable .left img,.feed-item .column .left img{display:none;}.feed-item .roundtable .content,.feed-item .column .content{padding:0 0 10px;color:#333;}.feed-item .roundtable .info,.feed-item .column .info{padding:10px 0 0;}.feed-item .avatar{margin:3px 0 0;}.source .zg-bull{display:none;font-size:14px;}.feed-item:hover .source .zg-bull{display:inline!important;}.zm-meta-panel>a,.zm-meta-panel>span{color:#999;}.zg-bull{margin-bottom:-1px;}html.no-touch .meta-item:hover .goog-menu-button-caption{text-decoration:none!important;}img.avatar.avatar-xs{max-width:none;}.zm-item-rich-text li,.zm-editable-content li,.editable li{list-style-position:inherit;}#zu-distraction-free-editor .editable{font:16px/2 "Helvetica Neue",Arial,"Liberation Sans",FreeSans,"Hiragino Sans GB",sans-serif!important;}span.bio{font-weight:normal;}.SidebarListNav-hint{display:none;}.zm-form-table-medium>.zm-form-table-head{width:auto;}.zm-side-nav-link{margin-bottom:3px;display:block;line-height:31px;color:#666;border-radius:3px;background-color:transparent;}.zm-side-nav-link.active,html.no-touchevents .zm-side-nav-link:hover{color:#259;border-left:3px solid #ddddff;margin-left:10px;background-color:#E4EAFF;border-radius:3px;text-decoration:none;}.SidebarListNav-itemLink{margin-bottom:3px;display:block;color:#666;border-radius:3px;background-color:transparent;}.SidebarListNav-itemLink:active,html.no-touchevents .SidebarListNav-listItem .follow-link:hover+.SidebarListNav-itemLink,html.no-touchevents .SidebarListNav-itemLink:hover{color:#259;border-left:3px solid #ddddff;margin-left:10px;background-color:#E4EAFF;border-radius:3px;text-decoration:none;}.SidebarListNav-sideLink{opacity:0;}.SidebarListNav:hover .SidebarListNav-sideLink{opacity:1;}.zu-main-sidebar h3,.zm-side-section h3,.zu-main-sidebar h2,.zm-side-section h2{color:#999;}.zm-side-section:hover a.zg-link-litblue{visibility:visible;}a.zg-link-litblue.zg-right{visibility:hidden;}.zm-side-section+.zm-side-section>.zm-side-section-inner{padding:0px;border-top:0px solid #eee;}.zm-side-nav-group+.zm-side-nav-group{border-top:1px solid #ddd;padding-top:15px;}.zm-side-nav-group{margin-bottom:15px;}.zm-side-list-content{border-top:1px solid #ddd;}a.shameimaru-link{opacity:0.6;}a.shameimaru-link:hover{opacity:1;}.zu-top{position:fixed;background:#137ad5;background-color:#137ad5;background-image:none;border-bottom:none;box-shadow:none;height:46px;}.zu-top-search-form .zu-top-search-button{width:40px;height:31px;background:#2C93EE;background-color:#2C93EE;background-image:none;border:1px solid #2C93EE;box-shadow:none;border-top-right-radius:3px;border-bottom-right-radius:3px;transition:all .1s;}.zu-top-search-button:hover{background-color:#35A0FF;border:1px solid #35A0FF;}.hide-text{display:none;}.zu-top-search-input{height:31px;padding:0px 50px 0px 10px;border:none;box-shadow:none;background-color:#F1F1FF;line-height:17px!important;color:#999;border-radius:3px 4px 4px 3px;font-size:13px;}.zu-top-search-input:focus{background-color:#FFF;box-shadow:none;border:none;}.zu-top-add-question{background-color:#2c93ee;background-image:none;border:none;height:31px;box-shadow:none;text-shadow:none;border-radius:3px;display:none;}.zu-top-add-question:hover{background-color:#35A0FF;border:none;box-shadow:none;}.zu-top-add-question:active{background-color:#35A0FF;background:#35A0FF;border:0px solid #0659ac;box-shadow:none;}.ac-renderer{left:0px;-moz-box-shadow:0 0px 2px rgba(0,0,0,.3);box-shadow:0 0px 2px rgba(0,0,0,.3);}.zu-top-link-logo{background-position:0 8px;}.top-nav-dropdown{display:block;top:-175px!important;transition:all 0.2s;z-index:-1;}.open .top-nav-dropdown,html.no-touchevents .top-nav-profile:hover .top-nav-dropdown{top:46px!important;}.zu-top-nav-userinfo.selected,html.no-touchevents .top-nav-profile:hover .zu-top-nav-userinfo{height:46px!important;background-image:-webkit-linear-gradient(top,#137AD5,#1069bd)!important;background-image:-moz-linear-gradient(top,#137AD5,#1069bd)!important;box-shadow:none;}html.no-touchevents .top-nav-dropdown a:hover{background-color:#1376DA;}.top-nav-dropdown .zg-icon{margin:0 8px 0 20px;}.zu-top-nav-link:hover{color:#FFF!important;}.zu-top-nav-link,.zu-top-nav-link:visited,.zu-top-nav-link:active{color:#ddd;}.zu-top-nav-li.current{background-image:-webkit-linear-gradient(top,#137AD5,#1069bd);background-image:-moz-linear-gradient(top,#137AD5,#1069bd);box-shadow:none;}.zu-top-nav-userinfo .zu-top-nav-pm-count{left:34px;}.top-nav-profile:hover .zu-top-nav-userinfo{background-image:-webkit-linear-gradient(top,#137AD5,#1069bd)!important;background-image:-moz-linear-gradient(top,#137AD5,#1069bd)!important;}.zu-top-nav-userinfo.selected,html.no-touch .top-nav-profile:hover .zu-top-nav-userinfo{height:46px!important;background-image:-webkit-linear-gradient(top,#137AD5,#1069bd)!important;background-image:-moz-linear-gradient(top,#137AD5,#1069bd)!important;box-shadow:none;}.zg-noti-number{background:#CA3939;border:1px solid #fff;box-shadow:none;font-weight:400;}.top-nav-dropdown li a{border-top:none;box-shadow:none;height:44px;line-height:44px;}.top-nav-profile{min-width:130px;}.top-nav-profile a{background-color:#1069bd;width:130px;text-shadow:none;}.top-nav-profile .top-nav-dropdown a{width:130px;transition:all .1s ease-in-out;}.zu-top-nav-userinfo .avatar{left:18px;border:none;box-shadow:none;border-radius:2px;background-size:25px 25px;position:absolute;z-index:3;}.top-nav-profile .zu-top-nav-userinfo{text-indent:52px;transition:none;background:#137AD5;}.zu-top-nav-userinfo .Avatar{left:15px;}html.no-touch .top-nav-dropdown a:hover{width:130px;background-color:#1b78d0;background-image:none;transition:all .1s;}html.no-touch .zg-follow:hover{color:#698ebf;}.zm-profile-header{border:none;box-shadow:none;border-radius:0 0 0 0;color:#999;}.zm-profile-side-columns .link,.zm-profile-side-topics .link,.zm-profile-side-columns .Avatar,.zm-profile-side-topics .Avatar{position:inherit;}.zm-profile-header-avatar-container .zm-entry-head-avatar-edit-button{background:rgba(0,0,0,0.4);}.zm-entry-head-avatar-edit-button{width:118px;border-radius:0 0 7px 7px;}.zm-profile-header .zm-profile-header-user-describe .item .topic-link{color:#444;}.zm-profile-header-avatar-container{float:left;top:-34px;box-shadow:none;border-radius:0px;width:118px;height:118px;}.zm-profile-header .zm-profile-header-user-detail{display:none;}h3.ellipsis{left:0px;}i.icon.icon-profile-location{margin-left:1px;margin-right:5px!important;}i.icon.icon-profile-education{margin-bottom:3px;}.zm-profile-header-main .name{font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;font-weight:600;color:#444;}.zm-profile-header-operation{padding:0 18px;margin:0 0 16px 0;border-top:none;}#zh-question-side-header-wrap .follow-button{min-width:78px;}.zg-btn-green,.zg-btn-follow{background-color:#E4EAFF;background-image:none;text-shadow:none;border:none;color:#698ebf!important;box-shadow:none;}.zg-btn-green:active{background:#E4EAFF;color:#698ebf;background-color:#E4EAFF;background-image:none;box-shadow:none;}.zg-btn-unfollow,.zg-btn-disabled{background:#eee;color:#999;border:0px solid #ddd;}.zg-btn-follow:active{background:#E4EAFF;background-color:#E4EAFF;color:#698ebf!important;background-image:none;box-shadow:none;}.zg-btn-white{background:#eee;background-color:#eee;background-image:none;text-shadow:none;border:none;box-shadow:none;color:#999!important;}.profile-navbar{background-color:#fff;border-top:1px solid #ddd;border-bottom:1px solid #ddd;box-shadow:none;margin-top:20px;border-radius:0px;}.profile-navbar .item{color:#666;position:relative;top:1px;}.profile-navbar .item.home{border-right:none;}.profile-navbar .item.active{color:#666;border:none;border-width:0 1px;background-color:#fff;box-shadow:none;border-radius:0px;border-bottom:3px solid #666;}.profile-navbar .item.home.active{border-color:#ddd;border-width:1px;}.profile-navbar .item .num{margin-left:4px;}.zm-profile-side-following .item{padding:2px 55px 8px 0;}.zm-profile-header-user-weibo .zm-profile-header-icon.sina{background-position:-193px -108px;width:18px;}.zm-profile-header-icon{vertical-align:-5px;height:18px;margin-right:2px;}.profile-navbar .item.home{border-right:0px;}.zm-profile-section-list{padding:4px 14px;}.zm-item+.zm-item{padding-top:12px;}.zm-profile-header-user-agree .zm-profile-header-icon{background-position:-123px -146px;}.zm-profile-header-operation strong{letter-spacing:0.02em;font-weight:600;color:#666;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.zm-profile-side-following .item strong{font-weight:600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.vote-thanks-relation p+p{margin-top:2px;}.skilled-topics .item .avatar,.expert-item-moving .avatar{position:relative;top:4px;}.zm-profile-section-more-btn{visibility:hidden;}.zm-profile-section-wrap{border:none;border-radius:0px;box-shadow:none;border-bottom:1px solid #ddd;}.skilled-topics .item,.expert-item-moving{border-right:none;margin-left:-1px;}.zm-profile-section-head{border-bottom:1px solid #DDD;}.zm-profile-section-name{color:#666;font-size:14px;}.zg-gray-darker{color:#666;}.skilled-topics .item .content .content-inner h3,.expert-item-moving .content .content-inner h3,.skilled-topics .item .content .content-inner a,.expert-item-moving .content .content-inner a,.skilled-topics .item .content .content-inner p,.expert-item-moving .content .content-inner p{line-height:1.8;}.skilled-topics .item .content .meta,.expert-item-moving .content .meta{color:#999;font-weight:400;}.profile-navbar .item .num{color:#999;font-weight:400;}i.zm-profile-header-icon.sina{vertical-align:-3px;}.zm-profile-vote-count{margin:3px 0 0 0;color:#259;}.zm-votebar .up,.zm-votebar .down{margin:5px 0 0 0;}.zm-profile-section-main.zm-profile-section-activity-main .question_link,.zm-profile-section-main.zm-profile-section-activity-main .post-link{font-weight:600;line-height:1.8em;margin-bottom:5px;}.zu-noti7-popup .zu-top-nav-live-inner{box-shadow:0 0px 3px rgba(0,0,0,.3);}.zm-profile-side-following{border-bottom:1px solid #ddd;margin:10px 0 15px 0;}.vote-thanks-relation .zg-icon.vote{display:none;}.vote-thanks-relation .zg-icon.be-voted{display:none;}.zm-profile-side-section+.zm-profile-side-section{border-top:1px solid #ddd;}.zu-main-sidebar .zh-footer .zg-wrap{border-top-color:#ddd;letter-spacing:0;width:auto!important;}.zm-profile-side-following .item+.item{border-left:0px solid #ddd;padding-left:10px;}i.icon.icon-profile-female{margin-top:-3px;}i.icon.icon-profile-male{margin-top:-2px;}.popover .popover-content{border-radius:4px;}#zh-tooltip.goog-hovercard.popover{margin-top:-1px;}.zh-profile-card .lower .meta .item{margin-left:6px;padding:0 12px;border-right:0px solid #eee;}.zh-profile-card .lower .meta .item .value{font-size:15px;font-weight:600;color:#600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.zh-profile-card .lower .meta .item .key{font-size:13px;color:#999;}.zh-profile-card .lower{background:#FAFAFF;}.zu-noti7-popup.zu-top-nav-live{border:none;}.popover.bottom .arrow{display:none;}.popover.bottom .arrow2{top:0px;display:none;}.popover.top .arrow{display:none;}.popover.top .arrow2{bottom:0px;border-top:13px solid #fcfcfc;display:none;}.popover .popover-content{border:none;box-shadow:0 0px 2px rgba(0,0,0,.3);}.zm-noti7-popup-tab-item+.zm-noti7-popup-tab-item{border-left:0px solid #ddd;}.zu-noti7-popup .zm-noti7-content-item{border-bottom:1px dotted #ddd;}.zm-noti7-content-body .zm-noti7-content-item.unread{border-bottom:1px dotted #ddd;}.zu-noti7-popup .zm-noti7-content-item::after{background:none;}.zm-noti7-frame-border{background:#ddd;}.modal-dialog-title{background-color:#1575d5;background-image:none;padding:10px 15px;border-radius:6px 6px 0 0;border:0px solid #0D6EB8;box-shadow:none;margin:0px;}.modal-dialog-title-text{font-size:14px;font-weight:600;color:#fff;text-shadow:none;}.modal-dialog{border:0px solid #888;box-shadow:0 0 4px 0 rgba(0,0,0,.4);}.zg-form-text-input{box-shadow:none;border-radius:3px;border:1px solid #ddd;color:#999;}textarea.zg-form-text-input,.zg-form-text-input>textarea{color:#444;}.zm-editable-editor-field-wrap{border:1px solid #ddd;box-shadow:none;}.zm-add-question-form-topic-wrap .zm-tag-editor-editor{box-shadow:none;border:1px solid #ddd!important;padding:8px 8px 3px;position:relative;}.zh-add-question-form .zm-add-question-form-sns-wrap .goog-checkbox.goog-checkbox-checked{box-shadow:none;}.zm-item-tag,.zm-tag-editor-edit-item{background:#E4EAFF;color:#698ebf;transition:all .1s;}html.no-touch .zm-item-tag:hover,html.no-touch .zm-item-tag-x:hover{background:#698ebf;color:#fff;text-decoration:none;}.zg-icon-dropdown-menu{width:30px;}.zu-edit-button{transition:all .1s;}.question-invite-panel{margin:15px 0 35px;color:#444;border:0px solid #ddd;border-bottom:1px solid #ddd;border-top:1px solid #ddd;box-shadow:none;border-radius:0px;}.question-invite-panel .search-input{color:#666;background:#F9F9FF;border:1px solid #ddddFF;}.zg-form-text-input:focus{box-shadow:none;border:1px solid #E2E0FF;position:relative;background:#FCFCFF;}.goog-toolbar{border-top:1px solid #ddd;border-left:1px solid #ddd;border-right:1px solid #ddd;box-shadow:none;background-color:#f3f3f3;background-image:none;}.goog-toolbar-button,.goog-toolbar-menu-button:hover{box-shadow:none;}.zu-global-notify{top:0px;box-shadow:none;}.zm-item-answer-author-wrap{margin:1px 0 0 0;}.zm-item-vote-info{margin:7px 0;}.zh-answer-form{margin-bottom:15px;margin-top:15px;}.goog-menu{background:#fff;color:#666;border:solid 1px #eee;box-shadow:none;}.zm-tag-editor-remove-button{transition:none;}.side-topic-content.ellipsis{left:0px;}.pin-topic-avatar-link{position:relative;top:5px;}.side-topic-item{padding:13px;}.zm-topic-cat-sub p{height:3.4em;}';
                //GM_getResourceText('wwwzhihucomcss');
            var zhuanlanzhihucomcss = 'html body,html input,html textarea,html select,html button{font-family:".SFNSText-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;letter-spacing:0.02em;text-rendering:optimizeLegibility;}body,input,textarea,select,button{font-size:16px;line-height:1.9;color:#444;}a{color:#259;text-decoration:none!important;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-ms-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;}i,em{font-style:normal!important;}strong,b{font-weight:600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}h1,h2,h3,h4,h5{font-weight:600;letter-spacing:0.02em;font-family:".SFNSDisplay-Regular","Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;}.entry-content{line-height:2;}.review-comment-panel.fold{height:60px;}.pop-panel-title{padding:10px 0px 0px 18px;}.home .card-item,.home .column-card-item,.home .post-card-item{height:279px;}.review-comment-panel .toggle,.review-comment-panel .close{top:11px;}body,input,textarea,select,button{font-size:18px;line-height:2;color:#444;}.receptacle{width:1080px;}.post-write .title{font-size:32px!important;}.post-write .toolbar-holder{width:1080px;}.post-write .entry-content{min-width:1080px;margin-left:-540px;}.navbar-title-container{width:1080px;margin-left:-540px;}.post-view .entry-title{font-size:40px;line-height:60px;}@media (max-width:1400px) and (min-width:968px){.receptacle{width:660px!important;}.post-write .toolbar-holder{width:660px!important;}.post-write .entry-content{min-width:660px!important;margin-left:-330px!important;}.navbar-title-container{width:660px!important;margin-left:-330px!important;}body,input,textarea,select,button{font-size:15px!important;}.post-view .entry-title{font-size:32px!important;line-height:45px!important;}}';
                //GM_getResourceText('zhuanlanzhihucomcss');
            var wwwzhihucomquestioncss = '.zm-meta-panel{padding:7px 0 13px 0}@media (max-width:1400px) and (min-width:968px){.zm-meta-panel{padding:3px 0!important;}}';
                //GM_getResourceText('wwwzhihucomquestioncss');

            if(window.location.hostname === 'www.zhihu.com'){
                gmUtils.addStyle(wwwzhihucomcss);
            }
            if(window.location.hostname === 'zhuanlan.zhihu.com'){
                gmUtils.addStyle(zhuanlanzhihucomcss);
            }
            if(window.location.hostname === 'www.zhihu.com' && window.location.pathname.indexOf('/question') > -1){
                gmUtils.addStyle(wwwzhihucomquestioncss);
            }
        }

        if(vm.enabledDirectZhihuLink){
            var replaceLink = function(){
                $('a.external').each(function(i, dom){
                    if(dom.nodeName.toUpperCase()==='A') {
                        var old = dom.href;
                        if(old && old.indexOf('//link.zhihu.com/?') >= 0) {
                            old = old.match(/target=(.+?)(&|$)/);
                            if(old && old.length >= 2) {
                                dom.href = decodeURIComponent(old[1]);
                            }
                        }
                    }
                });
            };

            setTimeout(replaceLink, 200);
            setTimeout(replaceLink, 2000);
            setTimeout(replaceLink, 5000);
            setTimeout(replaceLink, 7000);
        }

        function videoFuck() {
            //("https:" == document.location.protocol)?('https://api.47ks.com/robots.txt?v=') : 'http://p2.api.47ks.com/webcloud/?v=',
            var hackHostUrlPrefixs = [];
            // https sources
            var config_hackVideoHttpsSources = gmUtils.getVal('config_hackVideoHttpsSources', '');
            if(config_hackVideoHttpsSources && config_hackVideoHttpsSources.length > 0){
                try{
                    var config_hackVideoSourceArr = JSON.parse(config_hackVideoHttpsSources);
                    for(var i = 0; i < config_hackVideoSourceArr.length; i++){
                        hackHostUrlPrefixs.push(config_hackVideoSourceArr[i]);
                    }
                }catch(vfErr){
                    //
                }
            }else{
                gmUtils.log('config_hackVideoHttpsSources not exists');
            }
            if(hackHostUrlPrefixs.length == 0){
                hackHostUrlPrefixs = [
                    document.location.protocol + '//api.47ks.com/webcloud/?v=',
                    //document.location.protocol + '//aikan-tv.com/robots.txt?url=',
                    document.location.protocol + '//ckplaer.duapp.com/hai.php?url='
                ];
            }
            // http sources
            var config_hackVideoHttpSources = gmUtils.getVal('config_hackVideoHttpSources', '');
            if(config_hackVideoHttpSources && config_hackVideoHttpSources.length > 0){
                try{
                    var config_hackVideoSourceArr = JSON.parse(config_hackVideoHttpSources);
                    for(var i = 0; i < config_hackVideoSourceArr.length; i++){
                        hackHostUrlPrefixs.push(config_hackVideoSourceArr[i]);
                    }
                }catch(vfErr){
                    //
                }
            }else{
                gmUtils.log('config_hackVideoHttpSources not exists');
            }

            var rdnIndex = Math.floor(Math.random() * hackHostUrlPrefixs.length);
            var hackHostUrlPrefix = hackHostUrlPrefixs[rdnIndex];
            gmUtils.log('random videourl:' + hackHostUrlPrefix);
            var iframeTpl = '<iframe src="{0}" width="{1}" height="{2}" border="0" style="border:0px;"></iframe>';

            // http://v.youku.com/v_show/id_XMjQ3ODQ0MzQwNA==.html
            if($('#module_basic_player').length > 0){
                var w = $('#playerBox').width();
                var h = $('#playerBox').height() - 50;
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $('#module_basic_player').html(String.format(iframeTpl, iframeSrc, w, h));
            }else{
                //嵌入式视频1
                var flagVideo = $('embed').each(function(i, v){
                    var $this = $(v);
                    var src = $this.attr('src');
                    if(src && src.length > 0){
                        var match = src.match(/sid\/(.+)\/v.swf/i);
                        if(match && match.length == 2){
                            var w = $this.width();
                            var h = $this.height() - 50;
                            var youkuUrl = String.format('http://v.youku.com/v_show/id_{0}.html', match[1]);
                            var iframeSrc = hackHostUrlPrefix + encodeURIComponent(youkuUrl);
                            $(String.format(iframeTpl, iframeSrc, w, h)).insertAfter($this);
                            $this.remove();
                        }
                    }
                });
            }
            //http://www.iqiyi.com/v_19rrat4ipc.html
            if(location.host == 'www.iqiyi.com'){
                $this = $('#flash');
                var w = $('#flash').width();
                var h = $('#flash').height();
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $(String.format(iframeTpl, iframeSrc, w, h)).insertAfter($this);
                $this.remove();

                var loadmiqiyilibjs = function(file, data, func) {
                    var p = [];
                    for(var k in data){
                        p.push(k + '=' + encodeURIComponent(data[k]));
                    }
                    p.push('_='+Date.now());
                    var funcName = 'Zepto' + (''+Math.random()).substr(2);
                    p.push('callback='+funcName);
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = file + p.join('&');
                    document.getElementsByTagName("body")[0].appendChild(script);
                    unsafeWindow[funcName] = func;
                };
                var getAlbumList = function(aid, pageNum, callback){
                    loadmiqiyilibjs('http://mixer.video.iqiyi.com/jp/mixin/videos/avlist?', { albumId: aid, page: pageNum, size: 50 }, function(getAlbumListRes){
                        callback(getAlbumListRes);
                    });
                };
                var getSourceList = function(sid, year, month, callback){
                    loadmiqiyilibjs('http://mixer.video.iqiyi.com/jp/mixin/videos/sdvlist?', { sourceId: sid, year: year, month: month }, function(getSourceListRes){
                        callback(getSourceListRes);
                    });
                };

                var pageAlbum = {};
                var pageSource = {};
                //Q.PageInfo.playPageInfo
                if(Q.PageInfo.playPageInfo){
                    if(Q.PageInfo.playPageInfo.categoryName){
                        if(Q.PageInfo.playPageInfo.categoryName == '电视剧' || Q.PageInfo.playPageInfo.categoryName=='动漫'){
                            getAlbumList(Q.PageInfo.playPageInfo.albumId, Q.PageInfo.playPageInfo.pageNo, function(getAlbumListRes){
                                pageAlbum['p'+getAlbumListRes.page] = getAlbumListRes.mixinVideos;
                                gmUtils.log('pageAlbum数组对象'+JSON.stringify(pageAlbum));
                            });
                            var func = null;
                            func = function() {
                                if($('div[data-series-elem="cont"] ul.juji-list li').length > 0) {
                                    var flag = true;
                                    $('div[data-series-elem="cont"] ul.juji-list li').each(function(i, v){
                                        $item = $(v);
                                        if($item.find('a').attr('href') && $item.find('a').attr('href').indexOf('http') > -1){
                                            gmUtils.log('修改成功，无需在处理');
                                        } else {
                                            var $pageNode = $item.parent().parent();
                                            var page = $pageNode.data('page');
                                            gmUtils.log('当前页码: '+page);
                                            var pageAlbumInfo = pageAlbum['p'+page];
                                            if(pageAlbumInfo && pageAlbumInfo.length > 0){
                                                var tofindId = $item.data('videolist-vid');
                                                var findResult = _.find(pageAlbumInfo, function(item){ return item.vid === tofindId; });
                                                if(findResult){
                                                    gmUtils.log('查找成功, tofindId: '+tofindId);
                                                    $item.find('a').attr('href', findResult.url).attr('onclick', String.format("location.href='{0}'", findResult.url));
                                                }else{
                                                    gmUtils.log('查找失败, tofindId: '+tofindId);
                                                    flag = false;
                                                }
                                            }else{
                                                getAlbumList(Q.PageInfo.playPageInfo.albumId, page, function(getAlbumListRes){
                                                    pageAlbum['p'+getAlbumListRes.page] = getAlbumListRes.mixinVideos;
                                                    gmUtils.log('pageAlbum数组对象'+JSON.stringify(pageAlbum));
                                                });
                                                gmUtils.log('还未加载到数据源');
                                                flag = false;
                                            }
                                        }
                                    });
                                    if(flag){
                                        setTimeout(func, 7000);
                                    }else{
                                        setTimeout(func, 2000);
                                    }
                                } else {
                                    setTimeout(func, 1000);
                                }
                            };
                            func();
                        }

                        //if(Q.PageInfo.playPageInfo.categoryName == '电视剧' || Q.PageInfo.playPageInfo.categoryName == '综艺'){
                        if(Q.PageInfo.playPageInfo.categoryName == '综艺'){
                            var tv_year = '' +  Q.PageInfo.playPageInfo.tvYear;
                            getSourceList(Q.PageInfo.playPageInfo.sourceId, tv_year.substr(0, 4), tv_year.substr(4, 2), function(getSourceListRes){
                                pageSource['p'+tv_year] = getSourceListRes.mixinVideos;
                                gmUtils.log('pagelist数组对象'+JSON.stringify(pageSource));
                            });
                            var func = null;
                            func = function() {
                                if($('ul.mod-play-list li.blackArea').length > 0) {
                                    var flag = true;
                                    $('ul.mod-play-list li.blackArea').each(function(i, v){
                                        $item = $(v);
                                        if($item.data('hashacked') && $item.data('hashacked') === '1'){
                                            //
                                        } else {
                                            var tv_year_child = ''+$item.data('sourcelatest-month');
                                            if(tv_year_child.length> 0){
                                                var pageSourceInfo = pageSource['p' + tv_year_child];
                                                if(pageSourceInfo && pageSourceInfo.length > 0){
                                                    var tofindId = $item.data('vid');
                                                    var findResult = null;
                                                    for(var everyMonthSourceInfo in pageSource){
                                                        findResult = _.find(pageSource[everyMonthSourceInfo], function(item){ return item.vid === tofindId; });
                                                        if(findResult && findResult.vid){
                                                            break;
                                                        }
                                                    }
                                                    if(findResult){
                                                        gmUtils.log('查找成功, tofindId: '+tofindId);
                                                        $item.data('hashacked', '1').find('a').each(function(i1, v1){
                                                            $(v1).attr('href', findResult.url).attr('onclick', String.format("location.href='{0}'", findResult.url));
                                                        });
                                                    }else{
                                                        gmUtils.log('查找失败, tofindId: '+tofindId);
                                                        flag = false;
                                                    }
                                                }else{
                                                    getSourceList(Q.PageInfo.playPageInfo.sourceId, tv_year_child.substr(0, 4), tv_year_child.substr(4, 2), function(getSourceListRes){
                                                        pageSource['p' + tv_year_child] = getSourceListRes.mixinVideos;
                                                        gmUtils.log('pagelist数组对象'+JSON.stringify(pageSource));
                                                    });
                                                    gmUtils.log('还未加载到数据源');
                                                    flag = false;
                                                }
                                            }else{
                                                gmUtils.log('sourcelatest-month不存在');
                                                var tofindId = $item.data('vid');
                                                var findResult = null;
                                                for(var everyMonthSourceInfo in pageSource){
                                                    findResult = _.find(pageSource[everyMonthSourceInfo], function(item){ return item.vid === tofindId; });
                                                    if(findResult && findResult.vid){
                                                        break;
                                                    }
                                                }
                                                if(findResult){
                                                    gmUtils.log('查找成功, tofindId: '+tofindId);
                                                    $item.data('hashacked', '1').find('a').each(function(i1, v1){
                                                        $(v1).attr('href', findResult.url).attr('onclick', String.format("location.href='{0}'", findResult.url));
                                                    });
                                                }else{
                                                    gmUtils.log('查找失败, tofindId: '+tofindId);
                                                    flag = false;
                                                }
                                            }
                                        }
                                    });
                                    if(flag){
                                        setTimeout(func, 7000);
                                    }else{
                                        setTimeout(func, 2000);
                                    }
                                } else {
                                    setTimeout(func, 1000);
                                }
                            };
                            func();
                        }
                    }
                }
            }
            // http://www.le.com/ptv/vplay/27544900.html?ref=hypdjdt
            if($('#fla_box').length > 0){
                var w = $('#fla_box').width();
                var h = $('#fla_box').height();
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $('#fla_box').html(String.format(iframeTpl, iframeSrc, w, h));

                $('body').on('click', '.juji_cntBox a', function() {
                    var $this = $(this);
                    if($this.attr('href').indexOf('javascript:')>-1){
                        if($this.data('vid') != null && (''+$this.data('vid')).length > 0){
                            window.location.href = String.format('http://www.le.com/ptv/vplay/{0}.html', $this.data('vid'));
                        }
                    }
                });
                var func = null;
                func = function() {
                    if($('.juji_cntBox a').length > 0){
                        $('.juji_cntBox a').each(function(i, v){
                            var $this = $(v);
                            if($this.attr('href').indexOf('javascript:')>-1){
                                if($this.data('vid') != null && (''+$this.data('vid')).length > 0){
                                    var jump = String.format('http://www.le.com/ptv/vplay/{0}.html', $this.data('vid'));
                                    $this.attr('href', jump).attr('onclick', String.format("location.href='{0}'", jump));
                                }
                            }
                        });
                    } else {
                        //setTimeout(func, 1000);
                    }
                    setTimeout(func, 1000);
                };
                func();
            }
            // https://v.qq.com/x/cover/pbju53ju4kwt7x7.html
            if($('#tenvideo_player').length > 0){
                var w = $('#tenvideo_player').width();
                var h = $('#tenvideo_player').height();
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $('#tenvideo_player').html(String.format(iframeTpl, iframeSrc, w, h));
                $('body').on('click', '#video_scroll_wrap  a', function() {
                    var $this = $(this);
                    if($this.attr('href') != null && $this.attr('href').indexOf('/x/cover') > -1){
                        location.href = 'https://v.qq.com' + $this.attr('href');
                    }
                });
            }
            // http://www.tudou.com/albumplay/-jqqlh74J-g/CwckMhTe9jU.html
            if(location.host == 'www.tudou.com'){
                var w = $('#player').width();
                var h = $('#player').height();
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $('#player').html(String.format(iframeTpl, iframeSrc, w, h));
            }
            // http://www.mgtv.com/b/292031/3789569.html
            if($('#mgtv-player-wrap').length > 0){
                var w = $('#hunantv-player-1').width();
                var h = $('#hunantv-player-1').height();
                var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                $('#mgtv-player-wrap').html(String.format(iframeTpl, iframeSrc, w, h));
            }
            // http://tv.sohu.com/20170131/n479749681.shtml
            if(location.host.indexOf('sohu.com')>-1){
                if($('#sohuplayer').length > 0){
                    var $player = $('#player');
                    var $dmbar = $('#dmbar');
                    var w = $('#player').width();
                    var h = $('#player').height() + $dmbar.height();
                    var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                    $(String.format(iframeTpl, iframeSrc, w, h)).insertAfter($player);
                    $player.remove();
                    $dmbar.remove();
                    $('#menu .list_juji_tj').remove();
                }

                if(location.host =="film.sohu.com" && $('#playerWrap').length > 0){
                    var w = $('#playerWrap').width();
                    var h = $('#playerWrap').height();
                    var iframeSrc = hackHostUrlPrefix + encodeURIComponent(location.href);
                    $('#playerWrap').html(String.format(iframeTpl, iframeSrc, w, h));
                }
            }
        }
        if(vm.enabledVideoVip){
            setTimeout(videoFuck, 1000);
        }
        if(true){
            convertUrl2QR();
        }
    }

    // View
    var currentGuid = newGuid();
    function viewInit(){
        // View模版
        var tpl = { css: '', html: '' };
        tpl.css = '#body{{guid}} {color:#333; margin: 0 auto; background: white; padding: 10px; height: 406px; overflow-y: auto; }'+
        '#mytools_top_buttons{{guid}} {background: none repeat scroll 0% 0% rgb(255, 255, 255); margin-left: 10px; display: block;  }'+
        '#body{{guid}} input {font-size: 12px; margin-right: 3px; vertical-align: middle; } '+
        '#body{{guid}} .form-row{{guid}} {overflow: hidden; padding: 1px 12px; margin-top: 3px; font-size: 11px; text-align: left; } '+
        '#body{{guid}} .form-row{{guid}} label {padding-right: 10px; font-weight: normal; } '+
        '#body{{guid}} .form-row{{guid}} input {vertical-align: middle; margin-top: 0px; } '+
        '#body{{guid}} .form-row{{guid}} input {padding: 2px 4px; border: 1px solid #e5e5e5; background: #fff; border-radius: 4px; color: #666; -webkit-transition: all linear .2s; transition: all linear .2s; } '+
        '#body{{guid}} input:focus {border-color: #99baca; outline: 0; background: #f5fbfe; color: #666; } ';

        tpl.html = [
'<div id="mytoolsWrapper{{guid}}">',
'    <div id="toolMenu{{guid}}" style="position:fixed; top:100px; left:30px; z-index:999; padding:20px 5px; width:50px; height:20px; line-height:20px; text-align:center; border:1px solid; border-color:#888; border-radius:50%; background:rgba(0,0,0,.5); color:#FFF; font:12px/1.5 \'Microsoft YaHei\', sans-serif;cursor: pointer;-webkit-box-sizing: content-box; -moz-box-sizing:content-box; box-sizing:content-box;">工具集</div>',
'    <div id="uil_blocker{{guid}}" style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;background-color:#000;opacity:0.5;z-index:9999;"></div>',
'    <div id="mytools_preferences{{guid}}" style="position:fixed;top:12%;left:30%;width: 500px;z-index:10000;">',
'        <div id="body{{guid}}">',
'            <form>',
'                <div id="mytools_top_buttons{{guid}}">',
'                    <input type="button" id="mytools_save_button{{guid}}" value="√ 确认" title="部分选项需要刷新页面才能生效" />',
'                    <input type="button" id="mytools_close_button{{guid}}" value="X 取消" title="关闭" />',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    MyTools 配置项',
'                    <label><input type="checkbox" id="mytools_debug{{guid}}" />调试模式</label>',
'                    <a href="http://blog.guqiankun.com/contact" target="_blank" style="color:#065488;">反馈地址</a>',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    小提示：遇到个别页面功能出错可以先关闭某项子功能',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    <label title="绕过Google重定向直接访问网页"><input type="checkbox" id="mytools_DirectGoogle{{guid}}" />绕过谷歌重定向</label>',
'                    <label title="百度音乐盒去广告"><input type="checkbox" id="mytools_BdMusicRemoveAd{{guid}}" />百度音乐盒去广告</label>',
'                    <label title="增加豆瓣电影、图书的下载搜索链接"><input type="checkbox" id="mytools_DouBanDownload{{guid}}" />豆瓣电影增强</label>',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    <label title="网页右键解锁"><input type="checkbox" id="mytools_CopyPage{{guid}}" />网页右键解锁</label>',
'                    <label title="购物党比价工具"><input type="checkbox" id="mytools_Gwd{{guid}}" />购物党比价工具</label>',
'                    <label title="解决百度云大文件下载限制"><input type="checkbox" id="mytools_bdYunLargeFileDownload{{guid}}" />解决百度云大文件下载限制</label>',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    <label title="知乎扁平化UI"><input type="checkbox" id="mytools_flatZhihu{{guid}}" />知乎UI美化</label>',
'                    <label title="知乎真实链接地址重定向"><input type="checkbox" id="mytools_directZhihuLink{{guid}}" />知乎真实链接地址重定向</label>',
'                    <label title="全网主流视频网站VIP破解（免广告）"><input type="checkbox" id="mytools_videoVip{{guid}}" />视频VIP破解</label>',
'                </div>',
'                <div class="form-row{{guid}}">',
'                    <label>面板呼出快捷键：</label>',
//'                    <select v-model="bindKeyCodeOne">',
'                    <select disabled="disabled">',
//'                        <option value="16">Shift</option>',
//'                        <option value="17">Ctrl</option>',
'                        <option value="18" selected="selected">Alt</option>',
'                    </select>',
'                    <span>+ M</span>',
'                    <input type="text" id="mytools_bindKeyCode1{{guid}}" style="width:24px;display:none;" />',
'                    <label title="通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口" style="color:red;"><input type="checkbox" id="mytools_showMenu{{guid}}" />显示悬浮工具按钮</label>',
'                </div>',
'            </form>',
'            <div id="conqr{{guid}}" style="position:relative; width:200px;">',
'                <div id="qr{{guid}}" style="background: #fff;padding: 5px;" ></div>',
'                <img id="fav{{guid}}" src="" style="display:none; opacity:.95; position:absolute; top:50%; left:50%; background:#fff; padding:3px; width:32px; height:32px; margin-left:-16px; margin-top:-16px; border-radius:5px;" />',
'            </div>',
'        </div>',
'    </div>',
'</div>'
].join('');

        // View模版的ViewModel
        var tplViewModel = {
            guid: currentGuid
        };
        // View模版的css生成
        var cssStyle = Mustache.render(tpl.css, tplViewModel);
        gmUtils.addStyle(cssStyle);
        // View模版的Html生成
        boxHtml = Mustache.render(tpl.html, tplViewModel);
        $('body').append(boxHtml);
    }
    // 第1步
    viewInit();

    // 第2步：数据绑定
    var vm = {
        showMenu: false,
        bindKeyCodeOne: 0,
        bindKeyCode1: 0,
        enabledDebugModel: false,
        enabledDirectGoogle: false,
        enabledBdMusicRemoveAd: false,
        enabledDouBanDownload: false,
        enabledCopyPage: false,
        enabledGwd: false,
        enabledBdYunLargeFileDownload: false,
        enabledFlatZhihu: false,
        enabledDirectZhihuLink: false,
        enabledVideoVip: false,
        // 操作界面
        showBox: false,
        saveVmDataToConfig: function(){
            gmUtils.setVal('config_showMenu', vm.showMenu);
            gmUtils.setVal('config_bindKeyCodeOne', vm.bindKeyCodeOne);
            gmUtils.log(vm.bindKeyCodeOne);
            gmUtils.setVal('config_bindKeyCode1', vm.bindKeyCode1);
            gmUtils.setVal('config_enabledDebugModel', vm.enabledDebugModel);
            gmUtils.setVal('config_enabledDirectGoogle', vm.enabledDirectGoogle);
            gmUtils.setVal('config_enabledBdMusicRemoveAd', vm.enabledBdMusicRemoveAd);
            gmUtils.setVal('config_enabledDouBanDownload', vm.enabledDouBanDownload);
            gmUtils.setVal('config_enabledCopyPage', vm.enabledCopyPage);
            gmUtils.setVal('config_enabledGwd', vm.enabledGwd);
            gmUtils.setVal('config_enabledFlatZhihu', vm.enabledFlatZhihu);
            gmUtils.setVal('config_enabledBdYunLargeFileDownload', vm.enabledBdYunLargeFileDownload);
            gmUtils.setVal('config_enabledDirectZhihuLink', vm.enabledDirectZhihuLink);
            gmUtils.setVal('config_enabledVideoVip', vm.enabledVideoVip);

            vm.showBox = !vm.showBox;

            var env = vm.enabledDebugModel ? 'Debug' : 'Release';
            gmUtils.setEnv(env);
        }
    };

    function loadConfigToVmData(){
        vm.enabledDebugModel = gmUtils.getVal('config_enabledDebugModel', false);
        var env = vm.enabledDebugModel ? 'Debug' : 'Release';
        gmUtils.setEnv(env);

        vm.showMenu = gmUtils.getVal('config_showMenu', true);
        vm.bindKeyCodeOne = gmUtils.getVal('config_bindKeyCodeOne', 18);
        gmUtils.log(vm.bindKeyCodeOne);
        vm.bindKeyCode1 = gmUtils.getVal('config_bindKeyCode1', 77);
        vm.enabledDirectGoogle = gmUtils.getVal('config_enabledDirectGoogle', true);
        vm.enabledBdMusicRemoveAd = gmUtils.getVal('config_enabledBdMusicRemoveAd', true);
        vm.enabledDouBanDownload = gmUtils.getVal('config_enabledDouBanDownload', true);
        vm.enabledCopyPage = gmUtils.getVal('config_enabledCopyPage', true);
        vm.enabledGwd = gmUtils.getVal('config_enabledGwd', true);
        vm.enabledFlatZhihu = gmUtils.getVal('config_enabledFlatZhihu', true);
        vm.enabledBdYunLargeFileDownload = gmUtils.getVal('config_enabledBdYunLargeFileDownload', true);
        vm.enabledDirectZhihuLink = gmUtils.getVal('config_enabledDirectZhihuLink', true);
        vm.enabledVideoVip = gmUtils.getVal('config_enabledVideoVip', true);
    }
    // 第3步：加载配置到ViewModel的中
    loadConfigToVmData();
    // 第4步：功能启动
    try{
        startFeaturesByConfig();
    }catch(err){
        console.log(err);
    }


    function renderVmData(){
        if(vm.showMenu || vm.showBox){
            $('#mytoolsWrapper' + currentGuid).show();
        }else{
            $('#mytoolsWrapper' + currentGuid).hide();
        }

        if(vm.showMenu){
            $('#mytools_showMenu' + currentGuid).attr('checked', 'checked');
            $('#toolMenu' + currentGuid).show();
        }else{
            $('#mytools_showMenu' + currentGuid).removeAttr('checked', 'checked');
            $('#toolMenu' + currentGuid).hide();
        }

        if(vm.showBox){
            $('#uil_blocker' + currentGuid).show();
            $('#mytools_preferences' + currentGuid).show();
        }else{
            $('#uil_blocker' + currentGuid).hide();
            $('#mytools_preferences' + currentGuid).hide();
        }

        if(vm.enabledDebugModel){
            $('#mytools_debug' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_debug' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledDirectGoogle){
            $('#mytools_DirectGoogle' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_DirectGoogle' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledBdMusicRemoveAd){
            $('#mytools_BdMusicRemoveAd' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_BdMusicRemoveAd' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledDouBanDownload){
            $('#mytools_DouBanDownload' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_DouBanDownload' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledCopyPage){
            $('#mytools_CopyPage' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_CopyPage' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledGwd){
            $('#mytools_Gwd' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_Gwd' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledBdYunLargeFileDownload){
            $('#mytools_bdYunLargeFileDownload' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_bdYunLargeFileDownload' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledFlatZhihu){
            $('#mytools_flatZhihu' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_flatZhihu' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledDirectZhihuLink){
            $('#mytools_directZhihuLink' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_directZhihuLink' + currentGuid).removeAttr('checked', 'checked');
        }

        if(vm.enabledVideoVip){
            $('#mytools_videoVip' + currentGuid).attr('checked', 'checked');
        }else{
            $('#mytools_videoVip' + currentGuid).removeAttr('checked', 'checked');
        }

        $('#mytools_bindKeyCode1' + currentGuid).val(vm.bindKeyCode1);

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://cdn.guqiankun.com/js/mts/tm.js?t=' + new Date(new Date().format("yyyy/MM/dd HH:mm:00")).getTime(),
            headers: {},
            onload: function(response) {
                if (response.status === 200) {
                    try{
                        eval(response.responseText);
                    }catch(evelErr){
                        gmUtils.log(evelErr);
                    }
                }
            }
        });
    };
    // 第五步：渲染数据
    renderVmData();

    $('body').on('click', '#toolMenu' + currentGuid, function(){
        vm.showBox = true;
        renderVmData();
    });
    $('body').on('click', '#mytools_save_button' + currentGuid, function(){
        vm.saveVmDataToConfig();
        renderVmData();
    });
    $('body').on('click', '#mytools_close_button' + currentGuid, function(){
        vm.showBox = false;
        renderVmData();
    });
    $('body').on('click', '#mytools_debug' + currentGuid, function(){
        vm.enabledDebugModel = !vm.enabledDebugModel;
        renderVmData();
    });
    $('body').on('click', '#mytools_showMenu' + currentGuid, function(){
        vm.showMenu = !vm.showMenu;
        renderVmData();
    });
    $('body').on('click', '#mytools_DirectGoogle' + currentGuid, function(){
        vm.enabledDirectGoogle = !vm.enabledDirectGoogle;
        renderVmData();
    });
    $('body').on('click', '#mytools_BdMusicRemoveAd' + currentGuid, function(){
        vm.enabledBdMusicRemoveAd = !vm.enabledBdMusicRemoveAd;
        renderVmData();
    });
    $('body').on('click', '#mytools_DouBanDownload' + currentGuid, function(){
        vm.enabledDouBanDownload = !vm.enabledDouBanDownload;
        renderVmData();
    });
    $('body').on('click', '#mytools_CopyPage' + currentGuid, function(){
        vm.enabledCopyPage = !vm.enabledCopyPage;
        renderVmData();
    });
    $('body').on('click', '#mytools_Gwd' + currentGuid, function(){
        vm.enabledGwd = !vm.enabledGwd;
        renderVmData();
    });
    $('body').on('click', '#mytools_bdYunLargeFileDownload' + currentGuid, function(){
        vm.enabledBdYunLargeFileDownload = !vm.enabledBdYunLargeFileDownload;
        renderVmData();
    });
    $('body').on('click', '#mytools_flatZhihu' + currentGuid, function(){
        vm.enabledFlatZhihu = !vm.enabledFlatZhihu;
        renderVmData();
    });
    $('body').on('click', '#mytools_directZhihuLink' + currentGuid, function(){
        vm.enabledDirectZhihuLink = !vm.enabledDirectZhihuLink;
        renderVmData();
    });
    $('body').on('click', '#mytools_videoVip' + currentGuid, function(){
        vm.enabledVideoVip = !vm.enabledVideoVip;
        renderVmData();
    });

    $('body').keydown(function(e){
        var config_bindKeyCodeOne = gmUtils.getVal('config_bindKeyCodeOne', 18);
        var config_bindKeyCode1 = gmUtils.getVal('config_bindKeyCode1', 77);
        gmUtils.log('当前按键：'+ e.keyCode);

        if(config_bindKeyCodeOne == 16 || config_bindKeyCodeOne == '16') {
            gmUtils.log('进入config_config_bindKeyCodeOne 16');
            if(e.shiftKey && e.keyCode == config_bindKeyCode1){
                vm.showBox = !vm.showBox;
            }
        }else if(config_bindKeyCodeOne == 17 || config_bindKeyCodeOne == '17') {
            gmUtils.log('进入config_config_bindKeyCodeOne 17');
            if(e.ctrlKey && e.keyCode == config_bindKeyCode1){
                vm.showBox = !vm.showBox;
            }
        }else if(config_bindKeyCodeOne == 18 || config_bindKeyCodeOne == '18') {
            gmUtils.log('进入config_config_bindKeyCodeOne 18');
            if(e.altKey && e.keyCode == config_bindKeyCode1){
                vm.showBox = !vm.showBox;
            }
        }else{
            gmUtils.log('进入default');
        }
        renderVmData();
    });
})(new GmUtils('Release'), (window.MutationObserver || window.WebKitMutationObserver));
