// ==UserScript==
// @name            Porn Video下载 + ThisAV 番号 + TAG翻译 + PotPlayer 播放
// @version          2.9.11.1
// @moddate          2021.01.12
// @icon            https://ssl-ccstatic.highwebmedia.com/favicons/favicon.ico
//
// ================ 已处理站点
// VideoTmpl('JWPlayer')
// @include         http*://upornia.com/*
// @include         http*://pornq.com/*
// @include         http*://*.hclips.com/*
// @include         http*://*.txxx.com/*
// @include         http*://*.hdzog.com/*
//
// 其它知名海外站
// @include         http*://*.pornhub.com/*
// @include         http*://xhamster.com/*
// @include         http*://www.empflix.com/*
//
// xvideos 模板
// @include         /^http*://([^\.]+\.)?xvideos.com/
// @include         /^http*://([^\.]+\.)?cbtownship.com/
// @include         /^http*://([^\.]+\.)?xnxx.com/
//
// 小众网站
// @include         http*://www.iyottube.com/*
// @include         https://www.homepornking.com/*
// @include         https://www.notpornstar.com/videos/*
//
//
// 系列网站
// @include         http*//www.porntube.com/*
// @include         http*://www.4tube.com/*
// @include         http://www.fux.com/video/*
//
// 国产网站
// @include         https://kaikuapa.xyz/vod/view/id/*.html
//
// M3U8
//
// 其它站点
// @include         http*://onejav.com/*
// @include         https://www.dlsite.com/*
//
// ***** 仅标签翻译网站 *****
// 框架网站
// @include         http*://rbreezy.net/*
//
// ================ 未处理站点
// @include         /https?://[^.]+.caribbeancom(pr)?.com/(?:eng/)?moviepages/\d{6}[-_]\d{3}/index.html/
// @include			http://www.pacopacomama.com/moviepages/*/index.html
// @include			http://www.muramura.tv/moviepages/*/index.html
// @include			http://www.gachinco.com/moviepages/*/index.html
// @include			http://www.heyzo.com/moviepages/*/index.html
// @include			http://www.aventertainments.com/product_lists.aspx?*
// @include			http*://www.mediafreakcity.com/product_lists.aspx?*
// @include			http://www.avfantasy.com/product_lists.aspx?*
// @include			http://www.dmm.co.jp/*/-/detail/=/cid=*
//
// include			http*://*.tumblr.com/
// include			http*://*.tumblr.com/post/*
// @include			http*://*.tumblr.com/video/*
//
// Online Video
//
// @include			http://www.bravotube.net/videos/*
// @include			http://www.bravoporn.com/videos/*
// @include			http://www.tubewolf.com/movies/*
// @include			http://www.seemyporn.com/videos/*
// @include			http://pornfun.com/videos/*
// @include			http*://*.tube8.com/*/*/*/
// @include			http://www.gotporn.com/*/video-*
// @include			http://www.thisav.com/photo/*
// @include			http://www.thisav.com/video/*
// @include			http://v.jav101.com/play/*
//
//
// 国产视频下载
// @include      http://*.avaotu.com/*
// @include         http://p.v2pv.com/v/*
// @include         http://v2.sv92.space/v/*
//
// 3ATV.cc
// @include      https://3atv.cc/*
// @include      https://app9751.com/*
// @include         https://app5700.com/*
//
// 蝌蚪窝模板
// @include         http://www.risex*.com/*
//
// 与凹凸同模板
// @include         http://www.aotu*.com/*
// @include         http://www.xiaobi*.com/*
//
// 特殊支持的网站
// @include			https://openload.co/embed/*
// @include			http*://*.chaturbate.com/*
// @include         http*://*.latinacamtv.com/*
// @include         https://chaturbate.sexhd.pics/*/
// @include			http://ecchi.iwara.tv/videos/*
// @include			http://ecchi.iwara.tv/images/*
//
//
// @include        http://*91porn.com/*
// @include        http://*.space/*
// @include        http://91dizhi.at.gmail.com.*.club/view_video.php?viewkey=*
//
// @connect        ahcdn.com
// @connect        caribbeancom.com
// @connect        caribbeancompr.com
// @require        https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require        https://cdn.bootcss.com/downloadjs/1.4.8/download.min.js
// @require        https://lib.baomitu.com/layer/2.3/layer.js
// @resource layerCSS https://lib.baomitu.com/layer/3.1.1/theme/default/layer.css
// @grant          unsafeWindow
// @run-at         document-idle
// @grant           GM.info
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceURL
// @noframes
// @namespace https://greasyfork.org/users/122964
// @description Porn Video 视频下载，WatchED 标记工具
// @downloadURL https://update.greasyfork.org/scripts/375267/Porn%20Video%E4%B8%8B%E8%BD%BD%20%2B%20ThisAV%20%E7%95%AA%E5%8F%B7%20%2B%20TAG%E7%BF%BB%E8%AF%91%20%2B%20PotPlayer%20%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/375267/Porn%20Video%E4%B8%8B%E8%BD%BD%20%2B%20ThisAV%20%E7%95%AA%E5%8F%B7%20%2B%20TAG%E7%BF%BB%E8%AF%91%20%2B%20PotPlayer%20%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


/*****
 * 更新日志 *
 ************
 * 2.9.11 2021.01.12
 1、修复 Pornhub.com 支持
 2、修复 pornhub.com 手机版面支持

 * 2.9.10 2021.01.11
 1、修复 chaturbate.com 支持

 * 2.9.9.23 2020.05.18 （Dev）
 1、修正 pornhub.com 手机版的支持，并提供多种清晰度的下载按钮

 * 2.9.8.22 2019.12.17（Dev）
 1、修正 avaotu.com 的支持
 2、修正 homepornking.com 的支持
 3、增加 notpornstar.com 的支持（跳转至homepornking.com）

 、调整 Pornhub.com 使用 PotPlayer 播放 720P 的源
 、优化 VideoTmpl \ watchVideoVisited 等核心功能


 * 2.9.7.21 2019.12.16
 1、增加 kaikuapa.xyz 的支持
 2、增加 homepornking.com 的支持
 3、修复 iyottube.com 的支持
 4、增加 Pornhub.com 的 1080p 视频支持
 5、优化 VideoFn \ watchVideoVisited

 * 2.8.6.41 2019.11.29
 1、更友好的子域名匹配，支持语区子域名
 2、支持 xxnx.com
 3、修正 chaturbate.com 的 PotPlayer 按钮支持
 4、暂停 pornhub.com 的广告过滤

 * 2.7.5.39 2019.11.14
 1、修正 pornhub.com 脚本无法使用问题
 2、修正 pornhub.com 登录按钮被当AD误过滤

 * 2.6.5.39 2019.11.13 修正 chaturbate.com 的 PotPlayer 按钮支持

*****/

(function() {
    'use strict';
    var u=unsafeWindow,
        SiteHost=location.host.replace(/[^\.]*?\.([\w-]+\.(\w+|co.jp))$/i,'$1'),
        host=location.host.replace(/^www\./i,'').toLowerCase(),
        hosts=location.hostname,
        origin=location.origin,
        path=location.pathname,
        search=location.pathname,
        urls=location.href,
        webTitle=document.title,
        GMI=GM.info;
    //host=(/^www\./i.test(host))?host.replace(/^www\./i,''):host;

    if(host!='porntube.com'){
        u.String.prototype.SearchTest=function(regx, param){ //regx = 文本，或正则式，param 参数用于校验网址，并返回结果
            if(!regx instanceof RegExp) regx=new RegExp(regx, "gi"); //检验是否为正则表达式，否则进行转换
            if(param=='url'&&this.search(regx)>-1) return this;
            else if(this.search(regx)>-1) return true;
            else return false;
        }
    }

    var site={
        VideoID : function(title,ID){
            return title+' '+ID;
        },
        //***** 仅标签翻译网站 *****

        'rbreezy.net':{//框架网站
            AD:'.contain.refill[style="width:100%;padding-top: 15px"]',
            Tag: 'a[rel="tag"]',
        },
        //
        "dmm.co.jp" : {
            Lang:'ja',
            Tag: $('A[href*="article=keyword"],ul.genreTagList'),
            callback:function(){
                //标签谈价翻译添加样式
                GM_addStyle('A[href*="article=keyword"]{background-color:#d6dae3;word-spacing:5px;padding:1px 5px;-webkit-border-radius:5px;display:inline-block;margin-bottom:3px;}');
                var DMM_TitleTXT={
                    CheckMonoJump:function(){
                        $('.others a').each(function(){
                            if($(this).text()=='DVDを通販で購入する') return location.href=$(this).attr('href');
                        });
                    },
                    'シリーズ：':'系列：','メーカー：':'制造商：','ジャンル：':'类型：','レーベル：':'出版商：',
                    //.capt>:nth-child(1)>p
                    'この商品を買った人はこんな商品も買っています':'购买该产品的客户还购买了',
                    '最近チェックした商品':'最近浏览过的产品',
                    'この作品に出演しているAV女優':'AV女优出演过的作品',
                    //.headline>span.bold
                    'サンプル画像':'样图',
                    //.d-review__heading
                    'ユーザーレビュー':'网友评论'
                }
                $('table.mg-b20 .nw').each(function(){
                    $(this).text(DMM_TitleTXT[$(this).text().trim()]);
                })

                addMObserver('#recommend,#recommend_all',function(x){
                    if(!/mono/i.test(path)){
                        DMM_TitleTXT.CheckMonoJump();
                    }

                    $('.capt>:nth-child(1)>p,.headline>span.bold,.d-review__heading>h2').each(function(){
                        //console.log($(this).text(),DMM_TitleTXT[$(this).text().trim()]);
                        $(this).text(DMM_TitleTXT[$(this).text().trim()]);
                    });
                });
            }
        },
        "dlsite.com": {
            Lang: /ecchi\-eng/i.test(path)?'en':'ja',
            Tag:$('.main_genre a, .work_genre a'), TagSplit:true,
            callback:function(){
                GM_addStyle(`
a.work_thumb_inner:visited>img::before{position:absolute;left:10px;top:10px;color:#fff;background:red;font-size:14px;padding:3px 6px;content:"已浏览";font-weight:bold;border:1px solid;border-radius:15px;}
a.work_thumb_inner:visited{color:#333!Important;}
`);

                if(/product_id/i.test(location.href)) {
                    load_layer();
                    var Data=contents.detail[0],
                        ProductID=Data.id,
                        ProductName=Data.name,
                        ProductAuthor=$('#work_maker .maker_name').text().trim();
                    webTitle=document.title="【"+ProductID+"】"+"["+ProductAuthor+"] "+ProductName;

                    //产品信息中添加 ID 和 标题
                    $('<tr><th>ID</th><td>'+ProductID+'</td></tr>').click(function(){Copy(ProductID)}).insertBefore($('#work_outline>tbody>:nth-child(1)'));

                    $('<tr><th>标题</th><td>'+ProductName+'</td></tr>').click(function(){Copy(ProductName);}).insertBefore($('#work_outline>tbody>:nth-child(1)'));

                    //点击“分类标题”、“产品标题”可复制分类信息
                    $('#work_outline th:contains(ジャンル), #work_outline th:contains(分类)').click(function(){
                        let work_type=$('#work_outline th:contains(作品类型)').next().find('.icon_MOV, .icon_DNV, .icon_MNG, .icon_ICG'),
                            work_type_text=work_type.attr('class').replace('icon_','')+'/'+work_type.text();


                        Copy(work_type_text+" "+$(this).next().text().trim());
                        layer.tips('已复制作品种类信息', this, 3);
                    });

                    $('#work_outline th:contains(声優)').click(function(){
                        Copy("声优："+$(this).next().text().trim());
                        layer.tips('已复制声优信息', this);
                    });

                    //标题复制
                    $('#work_name').text(webTitle).click(function(){
                        Copy($(this).text())
                        layer.msg('test')
                    });

                    //注入搜索功能
                    SearchRes(ProductID, ProductName, 2);
                    $('link[hreflang]').each(function(){$('#BTLinks').append($('<A>').attr({'href':this.href,'target':'blank'}).text($(this).attr('hreflang')))});

                    var H2Title={
                        'この作品を買った人はこんな作品も買っています':'买这个作品的人也买了这样的作品','こちらの作品も見られています':'看了这个作品的人也看了这样的作品','最近チェックした作品':'你最近浏览过的作品','ユーザーレビュー':'用户评论','関連まとめ記事':'相关文章','サークル作品一覧':'作者作品一览'
                    },
                        Atext={'フォローする':'关注作者','お気に入りに追加':'加入收藏夹','カートに入れる':'加入购物车',
                               'ログイン':'登录','新規登録':'注册','ログイン中':'已登录','無料体験版':'免费体验版','コミュニティ':'社区','オンラインゲーム':'在线游戏'},
                        work_outline={'声優':'声优','ファイル形式':'文件格式','その他':'作品类型','ジャンル':'作品种类','ファイル容量':'作品容量','イベント':'活动事件','シナリオ':'脚本','イラスト':'插图'};
                    DlsiteTran([
                        {obj:'a', list:Atext},
                        {obj:'h2', list:H2Title},
                        {obj:'#work_outline>tbody>tr>th',list:work_outline}
                    ]);
                }
                //内容翻译器
                function DlsiteTran(data){
                    for(var i=0;i<data.length;i++){
                        $(data[i]['obj']).each(function(){
                            $(this).text(data[i]['list'][$(this).text().trim()]);
                        });
                    }
                }
            }
        },
        "caribbeancom.com":{
            Lang : $('html').attr('lang'),
            LangFn : function(){return getQueryString('lang',$('A[href*="https://www.d2pass.com/sqa/edit?lang="]').attr('href'))},
            Tag: $('.movie-info-cat A, .spec__tag'),
            Title: ' - 無修正アダルト動画 - カリビアンコム',
            callback:function(){
                var VideoID=Movie.movie_id,
                    MovieTitle=$('.heading-dense').text(); //番号标题
                var Actor=$('a[class="spec__tag"][itemprop="actor"]'); //出演女优
                var 配信日=$('.spec-title:contains(配信日)').next().text().replace(/\//g,'');

                TitleMod(VideoID, 'Caribbean', MovieTitle, Actor, 配信日);
                $('<span><a href="http://www.caribbeancom.com/moviepages/'+VideoID+'/images/l_l.jpg" class="aBox" download="Caribbean '+VideoID+' Cover" target="blank">Cover</a></span>').appendTo($('.heading-dense>h1'));
                SearchRes(VideoID, MovieTitle);
                $('<link>').attr({'rel':'stylesheet','href':'https://res.layui.com/layui/dist/css/modules/layer/default/layer.css?v=3.1.1'}).appendTo('head');

                $('.heading-dense').click(function(){
                    Copy(document.title);
                });
                $('.spec-title:contains(タグ)').click(function(){
                    Copy($(this).next().text().replace(/[\t\s]+/g,' '));
                });

                GM_addStyle('.aBox{border:#888 1px solid;background-color:ccc;padding:0 5px;}');

                checkurl('https://en.caribbeancom.com/eng/moviepages/VideoID/index.html', VideoID, function(e, url){
                    if(e.finalUrl!=='') $('<a>').attr({'href':url, 'target':'_blank','class':'aBox'}).text('EN').appendTo('.heading-dense>h1');
                });
                checkurl('https://cn.caribbeancom.com/moviepages/VideoID/index.html', VideoID, function(e, url){
                    if(e.finalUrl!=='https://cn.caribbeancom.com/index2.html') $('<a>').attr({'href':url, 'target':'_blank','class':'aBox'}).text('CN').appendTo('.heading-dense>h1');
                });

                function checkurl(url, id, success){
                    url=url.replace('VideoID',id);
                    GM_xmlhttpRequest({
                        url : url,
                        method: 'head',
                        onload: function(e){
                            success(e, url);
                        },
                        onreadystatechange:function(e){
                            console.log(e);
                        }
                    });
                }
            }
        },
        "caribbeancompr.com":{
            ID:(function(){return 'CaribbeanPr '+Movie.movie_id}),
            Lang : 'ja',
            Tag: $('.movie-info-cat A'),
            callback:function(){
                $('<span><a href="http://www.caribbeancompr.com/moviepages/'+Movie.movie_id+'/images/l_l.jpg" download="CaribbeanP '+Movie.movie_id+' Cover" target="blank">Cover</a></span>').css({'border':'#888 1px solid','background-color':'ccc','padding':'0 5px'}).appendTo($('.video-detail'));
                SearchRes(Movie.movie_id);

            }
        },
        'heyzo.com' : {
            ID: (function(){return 'Heyzo-'+emid}),
            Tag: $('.tag_cloud A'),
            callback:function(){
                $('.tag_cloud A').appendTo($('.tagkeyword')).wrap('<dd style="display:inline"></dd>').each(function(){
                    $(this).html('<span>'+$(this).text()+' </span>');
                });
            }
        },
        'pacopacomama.com':{
            Lang:'ja',
            ID: (function(){return 'pacopacomama '+movie_id}),
            Tag:$('.detail-info-l a'),
            callback:function(){

            }
        },
        'muramura.tv':{
            Lang:'ja',
            ID: (function(){return 'muramura '+movie_id}),
            Tag:$('.genre a'),
            callback:function(){

            }
        },
        'gachinco.com':{
            Lang:'ja',
            Tag:$('#tag a'),
            callback:function(){
                TitleMod(location.href.match(/gachi\d+/).toString(),'Gachinco',$('#middle_wrapper>.main_title_bar').text());
                var newTag=$('#movie_disc .movie_info>table>tbody>tr:nth-child(4)>td:nth-child(2)').text().trim().split(' ');

                $('#movie_disc').append('<div id="tag" class="bx2"></div>');
                for(var i=0;i<newTag.length;i++){
                    var txt=newTag[i].trim();
                    $('#tag').append($('<a>').attr({'href':'#'}).text(txt)).append(' ');
                }
            }
        },
        //Online Video
        'tumblr.com2':{
            callback:function(e){
                //https://www.tumblr.com/video/hffcv/149324933439/700/
                $('video').attr({'preload':true,'loop':false});
                var VideoUrl=$('video>source[type^="video/"]').attr('src').replace(/\/\d+$/i,'');
                var VideoType=$('video>source[type^="video/"]').attr('type').replace(/video\//i,'');
                var VideoHost=VideoUrl.match(/https?:\/\/([^\.]+.tumblr.com)/i)[1];
                var VideoID=VideoUrl.match(/\/video_file\/[^\/]+\/(\d+)/i)[1];
                $('<div id="DownVideo">').insertBefore('video');
                $('<A>').attr({'href':VideoUrl,'download':"["+VideoHost+"]"+"["+VideoID+"]"+"."+VideoType}).css({'color':'red'}).text('下载视频').appendTo('#DownVideo');
            }
        },
        '91porn.com':{
            Lang:'cn',
            callback:function(e){
                //window.addEventListener('storage',function(){new watchVideoVisited($('.listchannel'),"getQueryString('viewkey',$(this).find('a').attr('href'))")},true);
                new watchVideoVisited($('.listchannel'), "getQueryString('viewkey',$(this).find('a').attr('href'))");


                if(/view_video/.test(path)){
                    var viewkey=getQueryString('viewkey');
                    var VideoID=$('a[href="#featureVideo"').attr('onclick').match(/\d+/g)[1];				//获取视频ID
                    newTitles(VideoID,' -Chinese homemade video').Video();
                    $('<A>').attr({'id':'Download','download':'[91Porn.com]'+webTitle}).text('下载视频').appendTo($('.boxPart'));
                    $('<button>').attr('id','reDownLink').text('重新获取下载地址').appendTo($('.boxPart'));
                    $('<div id="FavTools">').text('收藏工具：').appendTo($('.boxPart'));
                    FavToolsFn(viewkey,$('#FavTools'));
                    if(path=='/view_video.php'){
                        var flashvars=$('#mpl').attr('flashvars');		//获取视频参数
                        var MaxVID=getQueryString('max_vid', flashvars);	//获取视频MAXVID
                        var seccode=getQueryString('seccode', flashvars);	//获取Key

                        $('#reDownLink').click(LoadVideoLink);LoadVideoLink();
                    } else if(path=='/view_video_hd.php'){
                        var ShareUrl=$('#fm-video_link').val();				//取得视频分享地址
                        $('#Download').attr('download','HD'+webTitle);
                        $('#reDownLink').click(HDLink);
                        HDLink();
                    }
                }

                function HDLink(){
                    GM_xmlhttpRequest({ //获取列表
                        method : "GET",
                        url : ShareUrl,
                        onload : function (e) {
                            $(e.responseText).each(function(){
                                if(this.id=='91') {
                                    //取得视频提取码
                                    seccode=getQueryString('video_id',this.src);
                                    console.log('视频提取码：'+seccode);
                                    //取得视频地址
                                    GM_xmlhttpRequest({
                                        method : "GET",
                                        url : 'http://91.9p91.com/getfile_jw.php?VID='+seccode,
                                        onload :function(data){
                                            var VideoUrl=getQueryString('file',data.responseText);
                                            console.log(VideoUrl);
                                            $('#Download').attr('href',VideoUrl);
                                        }
                                    });
                                }
                            })
                        }
                    });
                }

                function LoadVideoLink(){
                    $.ajax({
                        type: 'get',
                        url: hosts+'/getfile.php?VID='+VideoID+'&mp4=0&seccode='+seccode+'&max_vid='+MaxVID,
                        success: function(data){
                            var VideoUrl=getQueryString('file',data);
                            console.log(VideoUrl);
                            $('#Download').attr('href',VideoUrl);
                        }
                    });
                }
            }
        },
        'thisav.com':{
            callback:function(){
                $('body').removeAttr('oncontextmenu');
                if(/photo/.test(path)){
                    var src=$('.photo img').attr('src');
                    $('.photo img').attr('src',src.replace(/-m\.jpe?g$/,'.jpg'));
                } else {
                    var VideoID=video_id;
                    var VideoUrl=getQueryString('file',$('#mpl').attr('flashvars'))||$('#my-video_html5_api>source[type="video/mp4"],#my-video>source[type="video/mp4"]').attr('src');
                    //console.log(VideoUrl);
                    //VideoUrl=VideoUrl?$('#my-video_html5_api>source["video/mp4"]').attr('src'):null;
                    //console.log(VideoUrl,$('#my-video>source["video/mp4"]').attr('src'));
                    document.title=webTitle='【'+VideoID+'】'+webTitle.replace(' - 視頻 - ThisAV.com-世界第一中文成人娛樂網站','');
                    $('<div id="FavTools" class="">').text('收藏工具：').appendTo($('.video_info'));
                    $('<a>').attr({'download':webTitle,'title':webTitle,'href':VideoUrl}).text('Download | ').appendTo('#FavTools');
                    FavToolsFn(VideoID,$('#FavTools'));
                }
            }
        },
        'v.jav101.com':{
            callback:function(){
                var m3u8=data.video.specurl.m3u8;
                var mpd=data.video.specurl.mpd;
                var VideoID=data.video.id;
                var VideoUrl=data.video.specurl.dl;
                $('<div id="FavTools">').css({'font-size':'15px'}).text('收藏工具：').appendTo($('#msg-section_right30'));
                $('<a>').attr({'download':webTitle,'title':webTitle,'href':'PotPlayer://http:'+mpd}).text('PotPlayer | ').appendTo('#FavTools');
                $('<a>').attr({'download':webTitle,'title':webTitle,'href':m3u8}).text('m3u8 | ').appendTo('#FavTools');
                $('<a>').attr({'download':webTitle,'title':webTitle,'href':VideoUrl}).text('Download | ').appendTo('#FavTools');
                FavToolsFn(VideoID,$('#FavTools'));
            }
        },
        'bravotube.net':{
            Lang:'en',
            Tag:$('.categories A'),
            callback:function(){
                location.href="http://www.bravoporn.com/videos/"+params['video_id']+"/";
            }
        },
        'bravoporn.com':{
            Lang:'en',
            Tag:$('.categories A'),
            callback:function(e){
                var VideoID=flashvars['video_id'];
                var VideoHash=flashvars['video_url'].match(/\w{32}/i).toString();
                var VideoUrl=decodeURIComponent(flashvars['video_url']);
                var PreViewUrl=decodeURIComponent(flashvars['preview_url']);

                document.title=webTitle='【'+VideoID+'】'+webTitle;

                GM_addStyle('.newButton{float:left;padding-right:5px; margin: 0px 0 3px 0; display:inline-block; padding:11px 7px 12px; min-width:116px; border:1px solid #343434; background:#181818; color:#44A00E; text-align:center; font:300 12px/14px Nunito, sans-serif;}');
                $('<A>').attr({'class':'newButton','target':'blank','href':PreViewUrl,'download':'['+host+']'+webTitle}).text('PreView').insertBefore($('.fav-button'));
                $('<A>').attr({'class':'newButton','target':'blank','href':VideoUrl,'download':'['+host+']'+webTitle}).text('Download').insertBefore($('.fav-button'));
                $('<div id="FavTools" class="video_comments">').text('收藏工具：').css({'border':'1px solid #343434','font-size':'24px','text-align':'center','vertical-padding':'11px 7px 12px'}).insertBefore($('.video_comments'));
                FavToolsFn(VideoID,$('#FavTools'));
            }
        },
        'tubewolf.com':{
            Lang:'en',
            Tag:$('.movie-list-info A'),
            callback:function(){
                var VideoID=decodeURIComponent(flashvars['video_id']);
                var VideoUrl=decodeURIComponent(flashvars['video_url']);
                document.title=webTitle='【'+VideoID+'】'+webTitle.replace(/ - \w+ Porn/,'');
                $('.video-tools').append($('<li>').attr({'class':'tools-views'}).append($('<A>').attr({'href':VideoUrl,'target':'blank','download':'['+host+']'+webTitle}).text('download')));
                $('<div id="FavTools"></div>').text('收藏工具：').insertBefore($('.movie-list-info'));
                FavToolsFn(VideoID,$('#FavTools'));
                new watchVideoVisited($('.thumb'),"$(this).find('img').attr('src').match(/(\\d+)\\/240x140/)[1]");
            }
        },
        'seemyporn.com':{
            Lang:'en',
            Tag:$('.info A'),
            callback:function(){
                var VideoID=decodeURIComponent(flashvars['video_id']);
                var VideoUrl=decodeURIComponent(flashvars['video_url']);
                document.title=webTitle='【'+VideoID+'】'+webTitle.replace(/ - \w+ Porn/,'');
                $('.tabs-menu>ul').append($('<li>').append($('<A>').attr({'class':'toggle-button','href':VideoUrl,'target':'blank','download':'['+host+']'+webTitle}).css({'color':'red'}).text('download')));
                $('<div id="FavTools"></div>').text('收藏工具：').insertBefore($('.info'));
                FavToolsFn(VideoID,$('#FavTools'));
                new watchVideoVisited($('#list_videos_related_videos_items>.thumb'),"$(this).find('span').data('fav-video-id')");
            }
        },
        'pornfun.com':{
            Lang:'en',
            Tag:$('.specification a'),
            callback:function(){
                var VideoID=params['video_id'];
                document.title=webTitle='【'+VideoID+'】'+webTitle;
                $('#download_link_1').attr({'download':'[pornfun.com]'+webTitle});
                $('<div id="FavTools">').text('收藏工具：').insertBefore($('.specification'));
                FavToolsFn(VideoID,$('#FavTools'));
            }
        },

        //在线视频
        'pornhub.com':{
            Lang:$('HTML').attr('lang'),
            Tag:$('.categoriesWrapper a, .tagsWrapper a, .tags a'),
            AD : '#js-abContainterMain, .footer-title, .footer, .streamatesModelsContainer, a[href*="seedboxco.net"], #htcheck, #mobileContainer>.topAdContainter, .adContainer, .middleVideoAdContainer',
            Title : ' - Pornhub.com',
            callback:function(){
                let layerJS=false;

                //console.log('remove AD: ', $('a.removeAdLink:not(.uploadToolLink):not(#headerLoginLink)').parent().remove());
                GM_addStyle('div[data-tab="add-to-tab"]{color:red!important;font-weight:bold!important;}');

                //VIDEO_SHOW, flashvars
                if(path=='/interstitial') {
                    location.pathname='/view_video.php';
                }

                if(path=='/view_video.php') {
                    var d=u.VIDEO_SHOW, //视频数据
                        playerId=d.videoid||d.playerId||'flashvars_'+ad_player_id, //获取视频对象
                        ViewKey=d.vkey||u.MODEL_PROFILE.viewkey, //视频地址 vkey
                        trackVideoId=d.video_id||d.trackVideoId; //视频创建 id，获取视频地址使用

                    console.log(d, playerId);


                    var quality=eval(playerId.replace('playerDiv', 'flashvars'));

                    //console.log('quality:', quality);
                    var qualityList={};
                    for(var mediaObj of quality.mediaDefinitions){
                        if(mediaObj.format=='mp4') {
                            //获取视频地址
                            $.ajax({
                                'url': mediaObj.videoUrl,
                                success: function(result) {
                                    for(let VideoUrl of result) {
                                        qualityList[VideoUrl.quality]={url:VideoUrl.videoUrl, text:VideoUrl.quality};
                                    }
                                    getDownload();
                                    return result;
                                }
                            });
                        }
                    }

                    $('.title-container, .mobileContainer').click(function(){
                        u.layer.tips('已复制标题', '.title-container', {tips:4, time: 10000});
                    });

                    function getDownload(){
                        let VideoObj=qualityList[720]||qualityList[480]||qualityList[240]||qualityList[240],
                            VideoUrlDownload=(qualityList[1080]||VideoObj)['url'], //获取 2k、1080、720、480 的视频地址，用于下载
                            VideoUrlPlayer=VideoObj['url'], //获取 720、480、180 的视频地址，用于 HTML5 在线播放
                            Pornstar="",
                            VideoInfo=TagMark("Pornhub.com")+Pornstar+TagMark(trackVideoId)+TagMark(ViewKey)+TagMark((qualityList[1080]||VideoObj).text)+webTitle;

                        console.log(VideoInfo);
                        //手机模式
                        if($('#mobileContainer').length>0) {
                            console.log('mobile mode');
                            Pornstar=$('.fromRow>.verified-icon').prev().text();
                            VideoFn({'VideoID':trackVideoId,'VideoSrc':VideoUrlDownload, 'Download':VideoUrlDownload,'Info':VideoInfo,'width':H5width,'height':'480','Target':'#videoPlayerPlaceholder', FavTools:{'H5Btn':'off', 'PotBtn':'off', 'DownBtn': 'off', 'ThunderBtn':'off', target: '#videoPlayerPlaceholder'}});

                            GM_addStyle('#downloadTrigger, #downloadTansoDl {background:#FFE793;}');

                            new watchVideoVisited('div.mobileVideoListItem',"data-id", {videoid:trackVideoId});
                            //$('#downloadTrigger').html($('<a target="_blank">').attr({'href':VideoUrlDownload}).text(VideoUrl['text']+"\n Download"));
                        } else {
                            //PC端


                            new watchVideoVisited('.videoblock.videoBox',"data-id", {videoid:trackVideoId});
                            $('#js-shareData').css({'width':'auto'});

                            //插入H5视频
                            var H5width=VideoUrlPlayer.SearchTest("480P")?480:960;
                            VideoFn({'VideoID':trackVideoId,'VideoSrc':VideoUrlPlayer,'Download':VideoUrlDownload,'Info':VideoInfo,'width':H5width,'height':'480','Target':'#player'});

                            //位置调整
                            $('.video-wrapper>.hd.clear').remove();//移除视屏下方的广告
                            $('.video-actions-menu').insertBefore('#H5Player');//动作菜单移动到视频上方
                            $('div[data-tab="add-to-tab"]').click(function(){
                                $('.video-actions-container').insertAfter('.video-actions-menu');
                            });

                            GM_addStyle('.tab-menu-wrapper-cell{padding-left:5px;}');
                        }

                        //下载按钮容器
                        $('<div id="downloadTools" style="color:white;margin:4px;padding:3px 6px;background:#5c5c5c;">').text('Download: ').appendTo('#FavTools');
                        GM_addStyle('.downloadTools{background:#f90;margin:0 5px;padding:5px 10px;display:inline-block;color:white;border-radius:5px;font-weight:bold;}');

                        $('[data-mxptype]').each(function(){
                            if($(this).data('mxptype')=='Pornstar') Pornstar+=TagMark($(this).data('mxptext'));
                        });
                        if(!Pornstar) Pornstar=u.MODEL_PROFILE.username;
                        for(var index in qualityList) {
                            var url=qualityList[index].url, text=qualityList[index].text,
                                oTitle=TagMark("Pornhub.com")+TagMark(Pornstar)+TagMark(ViewKey)+TagMark(text)+webTitle;
                            console.log(ViewKey, url, text);
                            $('<a class="downloadTools">').attr({'href':url,'download':oTitle, 'data-clipboard-text':oTitle+".mp4"}).text(text).appendTo('#downloadTools');
                        }
                        clipboard('.downloadTools', 'clipboard-text')
                    }


                } else {
                    //对非视频页面
                    if(path.search('/recent')>0) {
                        new watchVideoVisited('.videoblock.videoBox',"data-id");

                        $('#moreDataBtn').click(function(){
                            addMObserver('#moreData', function(m, o){
                                var t=setInterval(function(){
                                    if($('#moreData').html()!==''&&$('#moreData>.videoBox').length>=48) {
                                        new watchVideoVisited('.videoblock.videoBox',"data-id");
                                        clearInterval(t);
                                    }
                                }, 500);
                            }, true);
                            $('#moreData').html('');
                        });
                    } else {
                        //new watchVideoVisited('.videoblock.videoBox',"data-id");
                    }
                }
            }
        },
        //JWPlayer 播放插件
        'hclips.com':{
            Lang: $('html').attr('lang'),
            Tag:$('.info_cats a'),
            AD:'#underplayer-vda, #native-vda, a[href*="/advertising"], a.nopop',
            callback:function(){
                if(/^\/videos\//i.test(path)) {
                    VideoTmpl('JWPlayer',{'Target':'#kt_player','thumbnail':'.lv-thumb','title':$('.album_title>h1'), 'FavTools':{'target':'.tabs_block','mode':'Before'}});
                }
                new watchVideoVisited('.thumb', "data-video-id");
                /*addMObserver('body',function(){
        $('a[href*="out.tubecorporate.com/"], iframe[name="_ym_native"], div.adv-box-holder, div.LciE65d, span.iRx9_wrt').remove();
      },false,{childList: true});*/
            }
        },
        'upornia.com':{
            Lang: $('html').attr('lang'),
            Tag:$('.label'),
            AD:'.vda-closeplay, a.nopop, .sidebar, .fel-footer',
            callback:function(){
                if(/^\/videos\//i.test(path)) {
                    $('.player-holder').css({'height':$('#kt_player').height()+70});
                    VideoTmpl('JWPlayer',{'Target':'#kt_player','thumbnail':'.thumbnail'});
                }
                new watchVideoVisited('.thumbnail', "data-video-id");
            }
        },
        'txxx.com':{
            Lang: $('html').attr('lang'),
            Tag:$('a.badge'),
            AD:'.underplayer_banner, .rek-desk-list, .player>span, a.nopop',
            callback:function(){
                if(/^\/videos\//i.test(path)) {
                    VideoTmpl('JWPlayer',{'Target':'.player','thumbnail':'.un-grid--thumb','VideoTitle':$('.video-info__title>h1').text()});
                }
                new watchVideoVisited('.un-grid--thumb', "data-video-id");
            }
        },
        'hdzog.com':{
            Lang: 'en',
            Tag:$('.categories>a'),
            AD:'#channel-banner, .player-showtime-two, #native-vda, #under-pl-ad',
            Title: ' - HdZog - Free XXX HD, High Quality Sex Tube',
            callback:function(){
                if(/^\/videos\//i.test(path)) {
                    VideoTmpl('JWPlayer',{'Target':'.player-container','thumbnail':'.thumb'});
                    //$('#kt_player').prevAll('span').remove();
                }
                new watchVideoVisited('.thumb', "data-video-id");
            }
        },
        'pornq.com':{
            Lang: $('html').attr('lang'),
            Tag:$('a.video__tag'),
            AD:'a.nopop, .thumb--adv, .video-adv, .afs_ads',
            callback:function(){
                $('.thumb__link').each(function(){
                    $(this).attr('data-video-id',this.href.replace(/.+\/videos\/(\d+)\/.+/i,'$1'));
                });
                if(/\/videos\//i.test(path)) {
                    var VideoID=path.replace(/.+\/videos\/(\d+)\/.+/i,'$1');
                    FavToolsFn(VideoID,'.video__player', false,{'mode':'After'});
                    $('<a>').attr({'href':$('.jw-title-primary>a')})
                }
                new watchVideoVisited('.thumb__link', "data-video-id");
            }
        },
        //知名海外视频============
        'xvideos.com':{
            Lang:'en',
            Tag:$('.video-tags-list a, .video-tags a'),
            AD: '#video-ad, #ad-footer',
            callback:function(){
                if(/^\/video\d+|\/video-\w/i.test(path)) {
                    $('#content').ready(function(){
                        var Xvdyn=xv.conf.dyn,
                            VideoID=Xvdyn.id,
                            VideoTitle=Xvdyn.video_title,
                            VideoUrlLow=html5player['url_low']+"&download=1",
                            VideoUrlHight=html5player['url_high']+"&download=1",
                            VideoQualityHigh=$('[id^="level"]:nth-child(2)').text(),
                            VideoUrlHls=html5player['url_hls'].replace('/hls.m3u8','/hls-'+VideoQualityHigh+".m3u8");
                        document.title=webTitle+VideoTitle;

                        VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrlHls,'Download':VideoUrlHight,'VideoTitle':webTitle,'Poster':html5player['url_thumb'],'Target':'#html5video'});
                        VideoTmpl('m3u8',{'VideoID':VideoID,'VideoUrlHls':VideoUrlHls, 'VideoQuality':VideoQualityHigh, 'VideoTitle':webTitle});
                    });
                }
                new watchVideoVisited('.thumb-block','data-id');
            }
        },
        'xhamster.com':{
            Lang:'en',
            Tag:$('.categories-container A'),
            AD:'.wid-banner-container, .wid-player',
            callback:function(){
                $('.thumb-image-container').each(function(){this.id=this.href.replace(/.+-(\d+$)/,'$1');});
                if(/^\/videos\//i.test(path)) {
                    var vData=initials.videoModel, VideoID=vData.id, VideoTitle=vData.title, VideoMP4=vData.sources.mp4,
                        //VideoDownload=vData.sources.download,
                        //VideoUrl=(VideoDownload['720p']||VideoDownload['480p']||VideoDownload['240p']||VideoDownload['144p']).link,
                        VideoMP4Url=VideoMP4['720p']||VideoMP4['480p']||VideoMP4['240p']||VideoMP4['144p'],
                        VideoPoster=vData.thumbURL;
                    document.title=webTitle=VideoTitle;

                    VideoFn({'VideoID':VideoID,'VideoSrc':VideoMP4Url,'Download':VideoMP4Url,'Poster':VideoPoster,'Target':'#player-container'});
                }
                new watchVideoVisited('.thumb-image-container', 'id');
            }
        },
        'empflix.com':{
            Lang:'en',
            Tag:$('._video_info a'),
            AD:'.pspBanner',
            callback:function(){
                if(/\/video\d+/i.test(path)){
                    var VideoUrl, Video={}, VideoID=$('#VID').val(), VideoPoster=$('meta[itemprop="image"]').attr('content');
                    if($('.mainTopPlayer #download_block a').length>1) {
                        $('.mainTopPlayer .vaDown').each(function(){
                            Video[$(this).data('format')]=this.href;
                        });
                        VideoUrl=Video['1080']||Video['720']||Video['480']||Video['360']||Video['240'];
                    } else if($('.mainTopPlayer #download_block a').length==1){
                        VideoUrl=$('#download_block a').attr('href');
                    }
                    VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrl,'Download':VideoUrl,'Poster':VideoPoster,'Target':'.vidVideo'});
                }
                new watchVideoVisited('.thumbsList>li', 'data-vid');
            }
        },
        'porntube.com':{
            Lang:'en',
            Tag:$('.tags a'),
            AD:'iframe[src^="https://ads.exosrv.com/"], .video-added.hidden-xs-down, .cppBanner.hidden-xs-down, .mobile-middle-banner, .pre-footer',
            callback:function(){
                $(document).ready(function(){
                    $('.video-item').each(function(){
                        this.id=$(this).find('.video-title>a').attr('href').replace(/.+_(\d+)$/,'$1');
                    });
                    new watchVideoVisited('.video-item',"id");
                });
                if(/\/videos\//i.test(path)){
                    $(document).ready(function(){
                        var VideoID=path.replace(/.+_(\d+)$/,'$1'), VideoQuality=[], VideoUrl, VideoData, VideoDownload;
                        var t=setInterval(function(){
                            $('.vjs-resolution .vjs-menu-item-text').each(function(){
                                VideoQuality.push($(this).text());
                            });
                            if(VideoQuality.length>0) {
                                VideoData=JSON.parse($('script:contains("HTML5 Flash")').text());
                                var o = location.protocol+"//"+"tkn." + host + "/" + VideoID + "/download/" + VideoQuality[0].replace(/p/i,''),
                                    VideoUrl=$('#vjs_video_3_html5_api').attr('src');
                                $.post(o,function(n) {
                                    VideoDownload=n.token;
                                    VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrl,'Download':VideoDownload,'Poster':VideoData.thumbnailUrl,'Target':'.video-player'});
                                });
                                clearInterval(t);
                            }
                        }, 500);
                    });
                }
            }
        },
        '4tube.com':{
            Lang:$('html').attr('lang'),
            Tag:$('.tags a'),
            AD:'.la-vane-frame, .col-xs-12>.cpp, .footer-la-jesi',
            PreProcess:function(){
                if(/\/videos\//i.test(path)){
                    var VideoID=u.wm_video_uuid, VideoUrl;
                    var t=setInterval(function(){
                        //新方法
                        if($('.qual').length>1){//获取视频质量内容信息
                            var VideoUrl=$('.qual').attr('src'), VideoTitle=$('meta[itemprop="name"]').attr('content');
                            //console.log(VideoID, VideoUrl, $('.qual'));
                            VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrl,'Download':VideoUrl,'Poster':$('meta[itemprop="image"]').attr('content'),'Target':'.player'});
                            clearInterval(t);
                        } else if($('#kodplayer').length>0){
                            //旧方法
                            var VideoQuality={}, VideoData, VideoDownload;
                            //http://tkn.porntube.com/249879/download/480
                            $('#download-links button[data-quality]').each(function(){
                                console.log(this, $(this).data('quality'));
                                var quality=$(this).data('quality'),
                                    o = location.protocol+"//"+"tkn." + host + "/" + VideoID + "/download/" + quality;
                                VideoQuality[quality]=o;
                                $.ajaxSettings.async = false;
                                $.post(o,function(n) {
                                    console.log(quality, o, n, n[quality], n[quality]['token']);
                                    var VideoUrl=n[quality]['token'];
                                    //VideoQuality[quality]=VideoUrl;
                                });
                            });
                            var VideoMP4Url=VideoQuality['1080']||VideoQuality['720']||VideoQuality['480']||VideoQuality['240']||VideoQuality['144'];
                            VideoFn({'VideoID':VideoID,'VideoSrc':'','Download':'','Poster':'','Target':'#video-multiple'});

                            //console.log(VideoQuality);
                            clearInterval(t);
                        }
                    },500);
                }
                new watchVideoVisited('.thumb_video',"data-video-uuid");
            }
        },
        //小众网站
        'iyottube.com':{
            Tag:$('.sub-label~a'),
            callback:function(){
                var VideoID=$('#rating_options').data('opt-id'),
                    VideoUrls=$('#thisPlayer_html5_api>source').attr('src'),
                    webTitle=$('meta[property="og:title"]').attr('content'),
                    VideoPoster=$('meta[property="og:image"]').attr('content');
                VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrls,'Download':VideoUrls,'VideoTitle':webTitle,'Poster':VideoPoster,'Target':'#thisPlayer'});
            }
        },
        //小众网站
        'homepornking.com':{
            Tag:$('.tags>a'),
            AD:'iframe[src*="/ads-iframe-display.php"]',
            callback:function(){
                if(path.SearchTest(/video/)) {
                    $('.tags>a').each(function(){
                        $(this).text($(this).text().replace(/-/g,' '));
                    });
                    var VideoID=$('link[rel="canonical"]').attr('href').replace(/.+\/video\/(\d+\/\d+\/\d+\/\d+)\//i,'$1').replace(/\//g,'-'),
                        VideoUrls=$('.mejs__player>source').attr('src'),
                        webTitle=$('.vtitle>h2').text(),
                        VideoPoster=$('.mejs__player').attr('poster');
                    VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrls,'VideoTitle':webTitle,'Poster':VideoPoster,'Target':'.mejs__player'});
                }

                $('.pics').each(function(){
                    var id=$(this).find('img').attr('src').replace(/.+\/thumbs\/(\d+\/\d+\/\d+\/\d+)\/.+/ig,'$1').replace(/\//g,'-');
                    this.id=id;
                });
                new watchVideoVisited('.pics', "id");
            }
        },
        'notpornstar.com':{
            callback: function(){
                location.href=urls.replace(/www.notpornstar.com\/videos\//i,'www.homepornking.com/video/')
            }
        },
        //论坛

        //国产视频网站
        '3atv.cc':{
            AD:'',
            callback:function(){
                let VideoUrl=u.mac_url, VideoID=u.SiteId;
                VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrl,'Download':VideoUrl,'VideoTitle':webTitle,'Target':'.MacPlayer'});

                $('ul.bread').append($('<a>').attr({'href':'/play/'+(parseInt(VideoID)-1)+'-1-1.html'}).text('上一页'), "     ", $('<a>').attr({'href':'/play/'+(parseInt(VideoID)+1)+'-1-1.html'}).text('下一页'));

                $('.thumb').each(function(){
                    this.dataset.id=$(this).find('a').attr('href').match(/\d+/).toString();
                });
                new watchVideoVisited('.thumb', 'data-id');

                PackUP('.panel-head.border-sub', '.line.grid.media-inline', true);
            }
        },
        'kaikuapa.xyz':{ //开胯啪
            callback:function(){
                $('a.vodlist_thumb').each(function(){
                    this.href=this.href.replace('detail','view');
                    var VideoID=this.href.replace(/.+\/id\/(\d+)\..+/i,'$1');
                    $(this).parent().attr('id',VideoID);
                });
                new watchVideoVisited('.vodlist_item',"id");

                var loadVideo=function(){
                    if($('script:contains("m3u8")').length>0) {
                        console.warn('ready:', $('script:contains("m3u8")'));
                        var VideoID=urls.replace(/.+\/id\/(\d+)\..+/i,'$1'),
                            VideoUrl=$('script:contains("myVideo")').text().match(/'(https?:\/\/[^']+)'/i)[1],
                            webTitle=document.title=$('.video_title>h2').text();
                        VideoFn({'VideoID':VideoID,'VideoSrc':VideoUrl,'Download':VideoUrl,'VideoTitle':webTitle,'Target':'.player_video'});
                    }
                }

                $(window).load(loadVideo);
            }
        },
        'avaotu.com':{ //凹凸视频
            AD: 'center>a, div.ads-player, div.ads-footer, [id^="guanggao"]',
            callback:function(){
                //$('center>a, div.ads-player, div.ads-footer, [id^="guanggao"]').remove();
                GM_addStyle(`
/*修正封面布局*/ .item .img img:first-child {position:initial;width:auto;height:auto;}
/*修正标记引起的布局变高*/.list-videos-screenshots .img, .list-videos .img{padding-bottom:0px;}`);

                if(urls.SearchTest(/video/)) {
                    VideoTmpl('kt_player', {'title':$('.headline>h1'), 'FavTools':{'target':'.video-info', mode:'Before'}});

                    $('#list_videos_related_videos_items>.item');
                    new watchVideoVisited('#list_videos_related_videos_items>.item',"data-fav-video-id");
                } else {
                    new watchVideoVisited('#list_videos_videos_watched_right_now_items>.item, #list_videos_most_recent_videos_items>.item, #list_videos_common_videos_list_items>.item',"data-fav-video-id", {width:"320", height:"180"});
                    addMObserver('.main-container', function(){
                        watchVideoVisited('#list_videos_videos_watched_right_now_items>.item, #list_videos_most_recent_videos_items>.item, #list_videos_common_videos_list_items>.item',"data-fav-video-id", {width:"320", height:"180", watch:true});
                    }, false, {childList:true});
                }
            }
        },
        'risex7.com':{ //蝌蚪窝
            callback:function(){
                let albumHash=$('[rel="canonical"]').attr('href').replace(/.+\/([\w-]+)\/$/i,'$1');

                $('.thumb--videos').each(function(){ //添加ID
                    console.log($(this).find('a').attr('href').match(/\/(\d+)\/[\w-]+\/$/)[1]);
                    this.id=$(this).find('a').attr('href').match(/\/(\d+)\/[\w-]+\/$/)[1];
                });

                new watchVideoVisited('.thumb--videos', "id");

                if(urls.SearchTest(/videos\/\d/i)) {
                    VideoTmpl('kt_player', {'title':$('h1.title'), Info: TagMark(hosts)+TagMark(u.pageContext.videoId)+TagMark(albumHash)+$('h1.title').text(), 'FavTools':{'target':'.info-bar'}});
                } else if(urls.SearchTest('albums')){
                    if($('.album-gallery-holder').length>0){
                        $('a.item').click(function(){

                            let imgSrc=this.href,
                                imgFileName=imgSrc.replace(/.+\/(\d+\.jpg)$/i,'$1');

                            this.download=TagMark(hosts)+TagMark(u.pageContext.albumId)+TagMark(albumHash)+imgFileName;

                            var _this=this;
                            GM_xmlhttpRequest({
                                url: this.href,
                                method: 'get',
                                responseType: 'blob',
                                async : false,
                                onload: function(e){
                                    console.log(e.response, _this.download);
                                    download(e.response, _this.download, "image/jpeg")
                                }
                            });
                            return false;
                        });
                    }
                    else if($('.btn--unlock').length>0) {
                        $('.btn--unlock').hide();

                        let holder=$('<div class="album-gallery-holder">');
                        $('.album-images__item').each(function(){
                            $(this).removeClass('disabled');
                            $(this).find('.btn btn--color').remove();
                            let img=$(this).find('img'),
                                imgSrc=img.data('src').replace('main/200x150', 'sources'),
                                imgFileName=imgSrc.replace(/.+\/(\d+\.jpg)$/i,'$1');
                            let imgA=$('<a>').attr({'href': imgSrc, download:TagMark(host)+'['+u.pageContext.albumId+']'+'['+albumHash+']'+imgFileName, 'target':'_self'}).click(function(){
                                var _this=this;
                                GM_xmlhttpRequest({
                                    url: this.href,
                                    method: 'get',
                                    responseType: 'blob',
                                    async : false,
                                    onload: function(e){
                                        console.log(e.response, _this.download);
                                        download(e.response, _this.download, "image/jpeg")
                                    }
                                });
                                return false;
                            });
                            console.log(this, imgFileName, albumHash);
                            $('.album-view>.album-images').before(holder.append(imgA.append($('<img>').attr({'src':imgSrc}).css({'width':'100%'}))));
                        });
                    }
                }
            }
        },
        'xiaobi009.com':{ //蝌蚪窝
            callback:function(){

                let albumHash=$('[rel="canonical"]').attr('href').replace(/.+\/([\w-]+)\/$/i,'$1');

                $('.thumb--videos').each(function(){ //添加ID
                    console.log($(this).find('a').attr('href').match(/\/(\d+)\/[\w-]+\/$/)[1]);
                    this.id=$(this).find('a').attr('href').match(/\/(\d+)\/[\w-]+\/$/)[1];
                });

                new watchVideoVisited('.thumb--videos', "id");

                if(urls.SearchTest(/videos\/\d/i)) {
                    VideoTmpl('kt_player', {'title':$('.headline>h1'), Info: TagMark(hosts)+TagMark(u.pageContext.videoId)+TagMark(albumHash)+$('.headline>h1').text(), 'FavTools':{'target':'.video-info', mode:'Before'}});
                }
            }
        },

        //资料库
        'onejav.com':{
            AD:'div[style*="z-index: 2147483647;"]',
            callback:function(){

            }
        },
        //============= 未处理站点
        'gotporn.com':{
            Lang:'en',
            Tag:$('ul.tag-suggestions a'),
            callback:function(){
                var VideoID=$('#video-player').data('id');
                newTitles(VideoID,/ on GotPorn \(\d+\)/);
                $('[data-action="download"]>span').html($('<a>').attr({'href':'http://www.gotporn.com/video/'+VideoID+'/download','download':'[GotPorn]'+document.title}).css({'color':'red'}).text('Download'));
                $('<div id="FavTools" style="font-size:14px;">').text('收藏工具：').appendTo($('.info>.metas'));
                FavToolsFn(VideoID,$('#FavTools'));
                new watchVideoVisited($('.video-item'),"$(this).data('id')");
            }
        },
        'fux.com':{
            PreProcess:function(){
                site['fux.com']=site['porntube.com'];
            }
        },
        'tube8.com':{
            Lang:'en',
            Tag:$('.tag-list a, .tags a'),
            callback:function(){
                setCookie('adBlockClosed',true,365);
                var VideoID=page_params.videoidVar;
                var VideoUrl=page_params.videoUrlJS;
                newTitles(VideoID,/ - Porn Video \d+ \| Tube8/i);
                //document.title=webTitle='【'+VideoID+'】'+webTitle.replace(' - Porn Video 251 | Tube8','');
                $('#downloadButton').attr({'download':'[tube8.com]'+webTitle, href:VideoUrl});
                VideoFn(flashvars.quality_180p, flashvars.image_url, 885, 470, '#playerContainerWrapper', VideoID);

                //$('<video>').attr({id:'video','src':flashvars.quality_180p,'poster':flashvars.image_url,'controls':'controls'}).css({'width':'885px','height':'470px'}).insertBefore('#playerContainerWrapper');

                //收藏工具
                watchVideoVisited($('.thumb_box'),"$(this).attr('id').replace('video_i','')");

                //视频质量切换按钮
                var quality=[2160,1080,720,480,240,180];
                for(var i=0;i<quality.length;i++) {
                    var thisQuality=eval("flashvars.quality_"+quality[i]+"p");
                    if(thisQuality) {
                        $('<a class="video-src" href="'+thisQuality+'" data-src="'+thisQuality+'">').text(quality[i]).attr({'download':'[tube8.com]'+webTitle}).click(function(){
                            $('#H5Player').attr('src',$(this).data('src'));
                            return false;
                        }).appendTo('#FavTools');
                    }
                }


                GM_addStyle('.video-src{font-size:18px;border:solid 1px #ccc;padding:2px;display:inline-block;} .gridList{display:block;}');
                //移除原视频
                $('#playerContainerWrapper').remove();
            }
        },
        'openload.co':{
            callback:function(){
                var Videotitle=$('.title').text();
                var VideoUrlStr=$('#streamurl').text();
                var VideoUrl='https://openload.co/stream/'+VideoUrlStr;
                var VideoPlayer=$('#olvideo_html5_api').attr({'src':VideoUrl});
                $.ajax({'url':'https://openload.co/logpopup/n~'+shouldreport+'?adblock=1'});
                $('body').html($('<a>').attr({'href':VideoUrl,'download':'['+host+']'+Videotitle,'target':'blank'}).text('下载：'+Videotitle));
                $('body').append(VideoPlayer);
            }
        },
        'chaturbate.com':{
            callback:function(){
                GM_addStyle('img[style*="position:absolute"][style*="left:45px"][style*="top:125px"]{display:none!important;}');//隐藏可能遮挡按钮的图片
                if(u.initialRoomDossier) {
                    /***** 2019.11.13 *****/
                    var RoomData=JSON.parse(u.initialRoomDossier),
                        hls_source=RoomData.hls_source;
                    PotPlayer(hls_source);
                } else {
                    /***** 2019.09.06 *****/
                    $(document).ready(function(){
                        addMObserver('body',function(e){
                            var sources=$('script:not([src]):contains(-sd-)').text().match(/initHlsPlayer\(jsplayer, '([^']+\/playlist.m3u8)[^']*?'\);/);
                            console.warn('chaturbate.com', sources);
                            if(sources&&sources.length==2) {
                                PotPlayer(sources[1]);
                            }
                        },true);
                    });
                }
                function PotPlayer(urls){
                    GM_addStyle(`.PotPlayer{
box-sizing: border-box;height:27px;
display: inline-block;padding: 5px 11px 0px;font-family: UbuntuMedium, Helvetica, Arial, sans-serif;border: 1px solid rgb(139, 179, 218);border-radius: 4px 4px 0px 0px;
font-size: 13px;
font-weight: bold;
color: rgb(94, 129, 164);
background-color : #FEFF38;
}`);
                    let Potplay=$('<A>').attr({"href":"PotPlayer://"+urls,'class':'PotPlayer'}).text("PotPlayer 播放");
                    let I=setInterval(function(){
                        if(document.querySelector('.followed_counts')) {
                            $('.followed_counts').parent().parent().prepend($('<div style="float: left; margin-right: 2px; position: relative;">').append(Potplay));
                            clearInterval(I);
                        }
                    }, 500);
                }
            }
        },
        'ecchi.iwara.tv':{
            callback:function(){
                var VideoTitle=$('.submitted>.title').text();
                $('[id^="node-"] .field-item.even>a').attr({'download':VideoTitle,'title':VideoTitle});
                addMObserver('.list-unstyled',function(){
                    $('.list-unstyled a').attr({'download':VideoTitle,'title':VideoTitle});
                    $('#download-options').removeClass();
                })
            }
        },
        'v2Porn.com':{
            callback:function(){
                $('script[src="http://static.vstatic.space/bundle/js/page-video-play-efcfbca884.min.js"], iframe').remove();
                var VideoData=unsafeWindow.xvideoData;
                var VideoID=VideoData.video_id;
                document.title=webTitle=webTitle.replace(' - V2视频','');
                console.log('xvideoData:',VideoData, VideoID);
                if(VideoID){
                    VideoFn({'VideoID':VideoID, 'VideoSrc':VideoData.html5_href, 'FileType':'mp4', 'Poster':'VideoData.thumb_href', 'Target':'#xvideo-player'});
                }
                //FavToolsFn(VideoID,$('.xvideo-video-operation-bar'),'Before');
                addMObserver('body',function(e){
                    $('div#layui-layer-shade4, div#layui-layer4').remove();//VIP充值提示
                    $('.layui-layer-shade, iframe[src="about:blank"], #xvideo-player').remove();
                    //console.log('MOB', e);
                },false,{childList: true});
            }
        }
    };

    var Tags={};

    var zhLang=[
        {ja:'月額動画',en:'',zh:'包月视频'},


        {ja:'クンニ',en:'',zh:'舔阴'},
        {ja:'潮吹き',en:'',zh:'潮吹'},
        {ja:'手コキ',en:'',zh:'手交'},{ja:'指マン',en:'',zh:'指法'},{ja:'アナルセックス',en:'',zh:'肛交'},

        {ja:'顔射',en:'',zh:'颜射'},{ja:'集体颜射',en:'',zh:'集体颜射'},{ja:'口内発射',en:'Oral Cumshot',zh:'口内射精'},{ja:'フェラ抜き',en:'',zh:'口交射精'},
        {ja:'微乳',en:'',zh:'贫乳'},{ja:'',en:'',zh:''},
        {ja:'美尻',en:'',zh:'美臀'},{ja:'アナル',en:'',zh:'肛门'},

        {ja:'乱交',en:'',zh:'滥交'},{ja:'レイプ',en:'',zh:'强奸'},{ja:'近親相姦',en:'',zh:'乱伦'},
        {ja:'ブルマー',en:'',zh:'灯笼裤'},

        {ja:'放尿',en:'',zh:'放尿'},

        {ja:'',en:'Stockings',zh:'长筒袜'},

        {ja:'',en:'',zh:''},{ja:'寝取り・寝取られ',en:'',zh:'被私通'},
        {ja:'ミニ系・小柄',en:'',zh:'迷你系・娇小'},{ja:'ロリ系',en:'',zh:'萝莉系'},
        {ja:'ぶっかけ',en:'Bukkake',zh:'颜射'},
        {ja:'お尻/ヒップ',en:'Buttocks',zh:'臀部'},
        /* -----===== 基础单词（英文） =====----- */
        {ja:'',en:'sperm',zh:'精子'},
        /*身材*/{ja:'',en:'chubby',zh:'丰满的'},
        /*性行为*/{ja:'',en:'masterbation',zh:'自慰',tips:'美式英语'},{ja:'',en:'masturbate',zh:'自慰',tips:'英式英语'},
        /**/{ja:'',en:'point of view',zh:'POV'},
        {ja:'',en:'Gangbang',zh:'轮奸'},
        {ja:'',en:'Bondage',zh:'奴役'},{ja:'',en:'Toys',zh:'玩具'},{ja:'',en:'Sex Toy',zh:'性爱玩具'},{ja:'',en:'Sex toys',zh:'性爱玩具'},
        {ja:'',en:'Massage',zh:'按摩'},{ja:'',en:'Cunnilingus',zh:'舔阴'},
        {ja:'',en:'Slut',zh:'荡妇'},

        {ja:'',en:'Big Cock',zh:'大鸡巴'},{ja:'',en:'Big Cocks',zh:'大鸡巴'},{ja:'',en:'Black Cock',zh:'黑鸡巴'},{ja:'',en:'Big Black Cock',zh:'大黑鸡巴'},
        {ja:'',en:'Big Clit',zh:'大阴蒂'},{ja:'',en:'Big Clits',zh:'大阴蒂'},
        {ja:'',en:'Anal',zh:'肛门'},{ja:'',en:'butt',zh:'屁股'},{ja:'',en:'big-butt',zh:'大屁股'},{ja:'',en:'big-ass',zh:'大屁股'},
        {ja:'',en:'Busty',zh:'巨乳'},{ja:'',en:'Tits',zh:'乳头'},{ja:'',en:'big-boobs',zh:'大胸部'},{ja:'',en:'Big Boobs',zh:'大胸部'},
        {ja:'',en:'Nipples',zh:'乳头'},{ja:'',en:'puffy nipples',zh:'丰满的乳头'},
        {ja:'',en:'Scandal',zh:'丑闻'},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},

        {ja:'',en:'moaning',zh:'呻吟'},
        {ja:'',en:'peeing',zh:'小便'},
        {ja:'',en:'Suck',zh:'吸允'},{ja:'',en:'sucking',zh:'吸允'},

        {ja:'',en:'Teen',zh:'青少年'},{ja:'',en:'young',zh:'年轻'},{ja:'',en:'Petite',zh:'身材娇小'},{ja:'',en:'wife',zh:'老婆'},{ja:'',en:'Pregnant',zh:'孕妇'},
        {ja:'',en:'tattoo',zh:'纹身'},{ja:'',en:'piercing',zh:'穿孔'},
        {ja:'',en:'cum on face',zh:'射精在脸上'},
        {ja:'',en:'beauty',zh:'漂亮'},{ja:'',en:'cute',zh:'可爱'},
        {ja:'',en:'Closeup',zh:'特写'},{jp:'',en:'close up',zh:'特写'},{ja:'',en:'Close-up',zh:'特写'},
        {ja:'',en:'uniform',zh:'制服'},{ja:'',en:'Uniforms',zh:'制服'},
        /*场景*/{ja:'',en:'hotel',zh:'旅馆'},{ja:'',en:'School',zh:'学校'},
        {ja:'',en:'car',zh:'车'},
        {ja:'',en:'JAV Uncensored',zh:'JAV无码'},{ja:'',en:'JAV Censored',zh:'JAV有码'},
        {ja:'',en:'Cartoon Sex',zh:'成人卡通'},

        {ja:'',en:'Straight',zh:'直的/异性恋'},
        {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        /* -----===== 基础单词（日文） =====----- */
        {ja:'恥辱',en:'',zh:'耻辱'},
        {ja:'調教',en:'',zh:'调教'},{ja:'',en:'',zh:''},
        {ja:'クスコ',en:'',zh:'宫腔镜'},
        {ja:'局部アップ',en:'',zh:'局部特写'},
        {ja:'二穴ファック',en:'Double Penetration',zh:'二穴插入'},
        {ja:'AV女優',en:'Pornstar',zh:'色情明星'},{ja:'',en:'',zh:''},

        {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        {ja:'電車',en:'',zh:'电车'},{ja:'お嬢様',en:'',zh:'大小姐'},
        /* -----===== 日英对照 =====----- */
        //普通名词
        {ja:'动画',en:'Anime',zh:'动画'},{ja:'ロマンチック',en:'romantic',zh:'浪漫'},
        {ja:'パイパン',en:'Hairless',zh:'剃毛'},{ja:'処女',en:'Virgin Female',zh:'处女'},{ja:'',en:'step fantasy',zh:''},
        /*形容词*/{ja:'羞恥',en:'Ashamed',zh:'羞耻'},
        {ja:'中出し',en:'Internal Cumshot',zh:'中出'},{ja:'射精',en:'Cumshots',zh:'射精'},{ja:'潮吹き',en:'Squirt',zh:'潮吹'},{ja:'女性アクメ',en:'Female Orgasm',zh:'女性高潮'},{ja:'連続絶頂',en:'Successive Orgasms',zh:'连续高潮'},
        {ja:'オナニー',en:'Masturbation',zh:'自慰'},{ja:'母乳',en:'Breast Milk',zh:'母乳'},
        {ja:'レズ',en:'Lesbian',zh:'女同性恋'},{ja:'乱暴なセックス',en:'Rough Sex',zh:'暴力的性行为'}, {ja:'ストリップ', en:'Striptease',zh:'脱衣舞'},
        /*性器官*/{ja:'ザーメン',en:'zamen',zh:'精液'},{ja:'ハードコア',en:'Hardcore',zh:'阴核'},
        /*性动作*/
        {ja:'運指',en:'fingering',zh:'手指抚弄'},{ja:'フェラ',en:'Blowjob',zh:'口交'},{ja:'パイズリ',en:'Breast Sex',zh:'乳交'},{ja:'手コキ',en:'Handjob',zh:'手交'},{ja:'フィストファック',en:'Fisting',zh:'拳交'},
        //体位
        {ja:'騎乗位',en:'Cowgirl',zh:'骑乘位'},
        //身体
        {ja:'',en:'feet',zh:'脚'},{ja:'ロングヘア',en:'Long Hair',zh:'长发'},{ja:'',en:'braid',zh:'辫子'},{ja:'三つ編み',en:'',zh:'三股辫'},
        //乳房
        {ja:'おっぱい',en:'Breasts',zh:'乳房'},{ja:'ピアス乳首',en:'Pierced nipples',zh:'乳头穿孔'},

        {ja:'バイブ',en:'',zh:'振动棒'},{ja:'ディルド',en:'dildo',zh:'假阴茎'},{ja:'デカチン',en:'Big Dick',zh:'大阴茎'},
        {ja:'尻',en:'Ass',zh:'屁股'},{ja:'デカ尻',en:'Big Ass',zh:'大屁股'},
        {ja:'黒髪',en:'Brunet Hair',zh:'黑发'},{ja:'赤毛',en:'Red Head',zh:'红发'},{ja:'金髪',en:'Blonde Hair',zh:'金发'},{ja:'茶髪',en:'Brunette',zh:'褐发'},
        {ja:'獣耳',en:'Animal Ears',zh:'动物耳朵'},
        {ja:'薬物',en:'Drug',zh:'药物'},{ja:'風俗/ソープ',en:'Soapland',zh:'泡泡浴'},{ja:'焦らし',en:'Tease',zh:'戏弄'},{ja:'おもらし',en:'Urination',zh:'漏尿'},
        //职业 & 人设 & 人称
        {ja:'コスプレ',en:'Cosplay',zh:'Cosplay'},{ja:'アイドル',en:'idol',zh:'偶像'},{ja:'ロリ',en:'Loli',zh:'萝莉'},{ja:'母親',en:'Mother',zh:'母亲'},{ja:'人妻',en:'married woman',zh:'人妻'},{ja:'ビッチ',en:'Bitch',zh:'婊子'},{ja:'双子',en:'Twins',zh:'双胞胎'},
        {ja:'美女',en:'Babe',zh:'美女'},{ja:'熟女',en:'MILF',zh:'熟女'},{ja:'ニューハーフ',en:'Shemale',zh:'人妖'},
        {ja:'ナース',en:'nurse',zh:'护士'},{ja:'看護婦',en:'nurse',zh:'护士'},{ja:'巫女',en:'Shrine Maiden',zh:'巫女'},
        {ja:'3p',en:'Threesome',zh:'3P'},{ja:'三つ巴',en:'Threesomes',zh:'3P'},


        /*服装*/{ja:'着衣',en:'Clothed',zh:'穿着衣服'},{ja:'パンツ',en:'Panties',zh:'内裤'},{ja:'ランジェリー',en:'Lingerie',zh:'情趣内衣'},{ja:'下着',en:'Underwear',zh:'内衣'},{ja:'エプロン',en:'epuron',zh:'围裙'},
        {ja:'水着',en:'Swimwear',zh:'泳衣'},{ja:'スクール水着',en:'School Swimwear',zh:'学校泳衣'},
        {ja:'ブルマ',en:'Gym Shorts',zh:'灯笼裤'},


        {ja:'お漏らし',en:'Pissing',zh:'小便'},
        {ja:'フェチ',en:'Fetish',zh:'恋物癖'},

        {ja:'リアル',en:'Reality',zh:'现实'},{ja:'',en:'Exclusive',zh:'独家'},{ja:'ウェブカメラ',en:'Webcam',zh:'网络视讯'},

        {ja:'エロアニメ',en:'Hentai',zh:'成人动画'},{ja:'',en:'3d hentai',zh:'3D成人动画'},{ja:'無修正 内部 エロアニメ',en:'Uncensored in Hentai',zh:'无码成人动画'},
        {ja:'無修正 内部 洋アニメ',en:'uncensored in cartoon',zh:'无码卡通'},
        {ja:'セクシー',en:'',zh:'性感的'},{ja:'スレンダー',en:'slim',zh:'苗条'},{ja:'',en:'Curvy',zh:'曲线玲珑'},
        {ja:'音楽',en:'Music',zh:'音乐'},{ja:'編集',en:'Compilation',zh:'编集'},{ja:'おもしろ映像',en:'Funny',zh:'有趣的视频'},{ja:'タバコ',en:'Smoking',zh:'抽烟'},{ja:'格闘',en:'Fight',zh:'格斗'},
        /*人/种族*/{ja:'',en:'chinese',zh:'中国人'},{ja:'日本',en:'Japanese',zh:'日本人'},{ja:'フランス人',en:'French',zh:'法国人'},{ja:'韓国人',en:'Korean',zh:'韩国人'},{ja:'ロシア人',en:'Russian',zh:'俄罗斯人'},{ja:'イギリス人',en:'British',zh:'英国人'},{ja:'ラテン人',en:'Latina',zh:'拉丁美洲女子'},{ja:'',en:'czech',zh:'捷克人'},{ja:'',en:'brazilian',zh:'巴西人'},
        {jp:'',en:'censored',zh:'马赛克'},
        /*形容词（人）*/{ja:'浮気',en:'Cheating',zh:'见异思迁'},{ja:'年上',en:'Senior',zh:'年长'},
        /*一般名词*/{ja:'癒し',en:'Healing',zh:'治疗'},{ja:'バイノーラル',en:'Binaural',zh:'立体声'},{ja:'パロディー',en:'Parody',zh:'模仿作品'},
        /*交通工具名词*/{ja:'',en:'train',zh:'火车'},
        /*物品*/{ja:'ローション',en:'Lotion',zh:'沐浴露'},
        /*Pornhub*/{ja:'認証済みユーザー',en:'Verified Amateurs',zh:'认证用户'},{ja:'認証済カップル',en:'Verified Couples',zh:'认证情侣'},
        /*====================================Other*/
        {ja:'ごっくん',en:'',zh:'喝精液'},
        {ja:'巨乳フェチ',en:'',zh:'恋乳癖'},{ja:'脚フェチ',en:'',zh:'恋脚癖'},{ja:'その他フェチ',en:'',zh:'其它恋物癖'},
        {ja:'マッサージ',en:'',zh:'按摩'},{ja:'パンチラ',en:'',zh:'走光'},
        {ja:'インストラクター',en:'',zh:'教练'},
        {ja:'アイドル・芸能人',en:'',zh:'偶像艺人'},{ja:'競泳・スクール水着',en:'',zh:'学校泳衣'},{ja:'電マ',en:'',zh:'电动棒'},

        {ja:'パンスト',en:'',zh:'连袜裤'},

        {ja:'辱め',en:'',zh:'羞辱'},{ja:'アクション・格闘',en:'',zh:'动作・格斗'},

        {ja:'ポルチオ',en:'',zh:'ポルチオ'},
        {ja:'学園もの',en:'',zh:'学校事件'},
        {ja:'デビュー作品',en:'',zh:'出道作品'},{ja:'ドキュメンタリー',en:'',zh:'纪录片'},

        {ja:'ギリモザ',en:'',zh:'马赛克'},{ja:'キャンペーン対象',en:'',zh:'活动对象'},

        {ja:'カテゴリー',en:'',zh:'类别'},
        /*==== DMM ====*/
        {ja:'不倫',en:'',zh:'不论'},{ja:'逆レイプ',en:'',zh:'反强奸'},
        {ja:'淫乱・ハード系',en:'',zh:'淫乱'},{ja:'ミニ系',en:'',zh:'萝莉',txt:'迷你'},
        {ja:'ドラッグ',en:'',zh:'药品'},
        {ja:'3P・4P',en:'',zh:'多P'},
        {ja:'ボディコン',en:'',zh:'紧身衣'},
        {ja:'尻フェチ',en:'',zh:'恋臀癖'},
        {ja:'4時間以上作品',en:'',zh:'4小时以上作品'},

        {ja:'ショタ',en:'',zh:'正太'},{ja:'ドラマ',en:'',zh:'戏剧性事件'},

        //角色
        {ja:'職業色々',en:'',zh:'各色职业'},{ja:'くノ一',en:'',zh:'女忍者'},

        {ja:'白人女優',en:'',zh:'白人女优'},
        {ja:'イメージビデオ',en:'',zh:'影像视频'},
        {ja:'エステ',en:'',zh:'美容院'},
        {ja:'単体作品',en:'',zh:'单体作品'},{ja:'独占配信',en:'',zh:'',txt:'独家'},{ja:'ブラウザ視聴',en:'',zh:'浏览器中查看'},{ja:'Android対応',en:'',zh:'',txt:'安卓对应'},{ja:'iPhone・iPad対応',en:'',zh:'',txt:'IOS对应'},
        {ja:'サンプル動画',en:'',zh:'',txt:'短片试看'},{ja:'DVDトースター',en:'',zh:'',txt:'DVD烧录'},{ja:'DVD',en:'',zh:'',txt:'DVD'},{ja:'デジモ',en:'',zh:'',txt:'数码'},{ja:'ハイビジョン',en:'',zh:'',txt:'高清电视'},

        {ja:'盗撮・のぞき',en:'',zh:'偷窥'},


        /*==== dlsite ====*/
        {ja:'音声あり',en:'Inc. Voice',zh:'语音'},{ja:'音楽あり',en:'Inc. Music',zh:'音乐'},{ja:'動画あり',en:'Inc. Anime',zh:'动画'},{ja:'体験版',en:'Trial',zh:'体验版'},
        {ja:'APK同梱',en:'APK Included',zh:'APK'},{ja:'HTML+画像',en:'',zh:'HTML+画像'},{ja:'アプリケーション',en:'EXE',zh:'EXE'},{ja:'ロールプレイング',en:'RPG',zh:'RPG'},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        /*作品形式*/{ja:'マンガ',en:'Manga',zh:'漫画'},{ja:'アドベンチャー',en:'',zh:'冒险'},
        {ja:'',en:'',zh:''},


        /*场景*/{ja:'屋外',en:'',zh:'室外'},{ja:'学校/学園',en:'',zh:'学校'},
        /*一般名词*/{ja:'アニメ',en:'',zh:'动画'},{ja:'萌え',en:'Moe',zh:'萌'},{ja:'歳の差',en:'',zh:'年龄差'},
        /*行为名词*/{ja:'露出',en:'Outdoor Exposure',zh:'露出'},{ja:'盗撮',en:'Upskirt/Spy Photo',zh:'偷拍'},{ja:'拡張',en:'stretch/expansion',zh:'扩张'},
        /*性行为*/{ja:'',en:'Hand Job',zh:'❤手淫'},{ja:'足コキ',en:'',zh:'脚交'},{ja:'フェラチオ',en:'',zh:'口交'},{ja:'イラマチオ',en:'Forced Oral/Irrumatio',zh:'强制口交'},{ja:'ごっくん/食ザー',en:'Cum Swallow',zh:'吞精液'},{id:495,ja:'睡眠姦',en:'Sleep Sex',zh:'睡着强奸'},{ja:'輪姦',en:'',zh:'轮奸'},{ja:'和姦',en:'',zh:'和奸'},{ja:'獣姦',en:'',zh:'兽奸'},{ja:'機械姦',en:'',zh:'机械奸'},{ja:'異種姦',en:'Interspecies Sex',zh:'异种奸'},{id:145,ja:'青姦',en:'Outdoor Sex',zh:'户外性爱'},
        /*性行为——SM*/{ja:'首輪/鎖/拘束具',en:'Collar/Chain/Hamper',zh:'项圈/锁链/捆绑'},
        /*性名词*/{id:139,ja:'痴漢',en:'Molestation',zh:'痴汉'},{ja:'淫乱',en:'Naughty',zh:'淫乱'},{ja:'寝取り',en:'',zh:'绿别人'},{ja:'寝取られ',en:'',zh:'被绿了/NTR'},{ja:'淫語',en:'Dirty Talk',zh:'淫语'},{ja:'放尿/おしっこ',en:'Golden Shower/Urination',zh:'放尿'},{ja:'強制/無理矢理',en:'',zh:'强迫'},{ja:'退廃/背徳/インモラル',en:'',zh:'放荡'},{ja:'陵辱',en:'',zh:'凌辱'},
        /*人称*/{ja:'男性/おやじ',en:'',zh:'老男人'},{ja:'妹',en:'Younger Sister',zh:'妹妹'},{ja:'兄',en:'Older Brother',zh:'哥哥'},{id:415,ja:'少女',en:'Girl',zh:'少女'},{ja:'ぼて腹/妊婦',en:'Pregnant Woman',zh:'孕妇'},{ja:'人外娘/モンスター娘',en:'Nonhuman/Monster Girl',zh:'怪物娘'},{ja:'エルフ/妖精',en:'Elf/Fairy',zh:'妖精'},{ja:'OL',en:'Office Worker',zh:'OL'},{id:485, jp:'秘書',en:'Secretary',zh:'秘书'},{id:190,ja:'ふたなり',en:'Futanari/Dick girl',zh:'雌雄同体'},{id:118,ja:'レズ/女同士',en:'',zh:'女同性恋'},{id:245,ja:'性転換(ts)',en:'Transsexual',zh:'变性者'},{id:434,ja:'男無',en:'No Male',zh:'没有男性'},{id:238,ja:'同性愛者',en:'Homosexual',zh:'同性恋'},{id:158,ja:'百合',en:'Yuri/Girls Love',zh:'百合'},{ja:'先輩/後輩',en:'',zh:'前辈/后辈'},{ja:'男性/おやじ',en:'',zh:'男性'},{ja:'ナース',en:'',zh:'护士'},{ja:'女教師',en:'Female Teacher',zh:'女教师'},{ja:'同級生/同僚',en:'Classmate',zh:'同学'},
        /*身材*/{ja:'むちむち',en:'Chubby/Plump',zh:'丰满'},{ja:'貧乳/微乳',en:'Tiny Breasts',zh:'贫乳'},{ja:'巨乳/爆乳',en:'Big Breasts',zh:'巨乳'},{ja:'つるぺた',en:'Childlike Build',zh:'【胸部】洗衣板'},
        {ja:'褐色/日焼け',en:'Tanned Skin/Suntan',zh:'褐色皮肤/晒黑'},
        /*特殊标签*/{id:71,ja:'断面図',en:'Cross-section View',zh:'断面图'},{ja:'汁/液大量',en:'Lots of White Cream/Juices',zh:'汁液大量'},
        /*其它名词*/{ja:'シリーズもの',en:'Serial Product',zh:'系列产品'},
        {ja:'売春/援交',en:'',zh:'援交'},{ja:'複数プレイ/乱交',en:'Orgy Sex',zh:'轮奸/滥交'},{ja:'妊娠/孕ませ',en:'Pregnancy/Impregnation',zh:'怀孕'},
        /*服装*/{ja:'きせかえ',en:'',zh:'换装'},{ja:'スーツ',en:'',zh:'套装'},{ja:'着物/和服',en:'',zh:'和服'},{ja:'体操着',en:'Gym Clothes',zh:'体操服'},{ja:'ニーソックス',en:'',zh:'过膝袜'},
        {ja:'ラブラブ/あまあま',en:'Romance',zh:'浪漫'},


        {ja:'ストッキング',en:'',zh:'丝袜'},{ja:'メガネ',en:'',zh:'眼睛'},

        {ja:'ポリゴン',en:'Polygon',zh:'多边形'},

        //
        {ja:'ハーレム',en:'',zh:'后宫'},

        {ja:'ファンタジー',en:'',zh:'奇幻'},

        {ja:'マニアック',en:'Maniac',zh:'色情狂'},

        {ja:'スカトロ',en:'',zh:'粪便'},
        {ja:'強制/無理矢理',en:'',zh:'强迫'},
        {ja:'変身ヒロイン',en:'',zh:'女主角变身'},{ja:'',en:'bishiri',zh:'美臀'},

        //官中
        {id:1,en:'school/academy',zh:'学校/学园'},
        {id:48,en:'Cuckoldry (Netorare)',zh:'被寝取/ntr'},
        {id:115,en:'reverse rape',zh:'逆强奸/女上男'},
        {id:138,en:'blowjob/fellatio',zh:'口交'},
        {id:157,en:'Hypnosis',zh:'催眠'},
        {id:166,en:'short hair',zh:'短发'},
        {id:222,en:'childhood friend',zh:'青梅竹马'},
        {id:285,en:'junior/senior (at work, school, etc)',zh:'前辈/后辈'},
        {id:295,en:'softcore eroticism',zh:''},
        {id:411,en:'jock/athlete/sports',zh:'体育会系/体育选手'},
        {id:423,ja:'叔父/義父',en:'Uncle/Stepfather',zh:'叔父/义父'},
        {id:432,en:'female protagonist',zh:'女主人公'},
        {id:433,en:'no reverse',zh:'无逆转'},
        {id:446,en:'prostitution/paid dating',zh:'卖春/援交'},
        {id:506,en:'succubus/incubus',zh:'魅魔/淫魔'},

        /*===== pornhub.com =====*/
        {ja:'女性（単身）',en:'Solo Female',zh:'女性独演'},{ja:'',en:'celebrity',zh:'名人'},
        /*性名词*/{ja:'',en:'insemination',zh:'授精'},{ja:'',en:'massive creampie',zh:'大量精液'},{ja:'',en:'cum inside pussy',zh:'射精在阴部里'},{ja:'',en:'bald pussy',zh:'白虎'},
        /*行为*/
        /*人名*/{ja:'',en:'sasha grey',zh:'【欧美女优】sasha grey'},
        //Tag

        {ja:'',en:'cum inside me',zh:'内射我'},
        {ja:'',en:'pink pussy',zh:'粉红的阴部'},{ja:'',en:'extreme tight pussy',zh:'非常禁的阴部'},
        {ja:'',en:'impregnation',zh:'注入'},{ja:'',en:'impregnate creampie',zh:'注入精液'},{ja:'',en:'dripping creampie',zh:'滴下精液'},

        {ja:'',en:'cock sucking',zh:'吸允鸡巴'},
        {ja:'洋アニメ',en:'Cartoon',zh:'卡通'},{ja:'年の差',en:'Old/Young',zh:'年龄差'},
        /*人称*/{ja:'女性向け',en:'For Women',zh:'女性向'},{ja:'女性に人気',en:'Popular With Women',zh:'受欢迎的女性'},{ja:'女子大生',en:'College',zh:'大学生'},{ja:'中年女性',en:'Mature',zh:'熟女'},{ja:'',en:'busty blonde',zh:'丰满的金发女郎'},{ja:'',en:'blonde big tits',zh:'金发大乳'},
        {ja:'認証済モデル',en:'Verified Models',zh:'验证模特'},
        /*名词*/{ja:'',en:'adult toys',zh:'成人玩具'},{ja:'',en:'hentai cartoon',zh:'成人卡通'},{ja:'',en:'hentai anime',zh:'成人动画'},{ja:'',en:'hentai game',zh:'成人游戏'},{ja:'',en:'hentai movie',zh:'成人电影'},
        /*服装*/{ja:'',en:'sports wear',zh:'运动服'},
        {ja:'',en:'reverse cowgirl pov',zh:'背对骑乘位POV'},{ja:'',en:'amateur couple',zh:'业余夫妇'},{ja:'',en:'cream pie',zh:'精液'},
        {ja:'',en:'oily ass',zh:'油亮的屁股'},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        {ja:'',en:'blonde slut',zh:'金发荡妇'},{ja:'',en:'verified amateur',zh:'认证用户'},{ja:'',en:'',zh:''},
        {ja:'足フェチ',en:'',zh:'恋足癖'},
        /*==== Caribbean.com ====*/
        {ja:'オリジナル動画',en:'original',zh:'原始视频'},
        {ja:'',en:'nicetitties',zh:'美乳'},{ja:'',en:'eatpussy',zh:'舔阴'},
        /*音译*/{ja:'',en:'kosupre',zh:'角色扮演'},{ja:'',en:'kyonyu',zh:'巨乳'},{ja:'',en:'school_mizugi',zh:'死库水'},{ja:'',en:'paipan',zh:'剃毛'},{ja:'',en:'buruma',zh:'灯笼裤'},{ja:'',en:'kounaihassha',zh:'口内射精'},{ja:'',en:'meido',zh:'女仆'},
        {ja:'ギャル',en:'Gal',zh:'少女'},{ja:'美脚',en:'bikyaku',zh:'美脚'},
        {ja:'人気シリーズ',en:'',zh:'人气系列'},{ja:'ハード系',en:'',zh:'激烈系'},
        {ja:'ベスト/オムニバス',en:'',zh:'精选集锦'},
        /**/
        {ja:'調教',en:'',zh:'调教'},
        {ja:'初裏',en:'',zh:'首次无码'},
        {ja:'シックスナイン',en:'',zh:'69式'},{ja:'69',en:'',zh:'69式'},

        {ja:'カメラ目線・主観映像',en:'POV',zh:'主观视角'},
        {ja:'カテゴリ一覧',en:'',zh:'分类列表'},{ja:'サンプル画像',en:'',zh:'样图'},{ja:'おススメ関連作品',en:'',zh:'相关作品'},{ja:'',en:'',zh:''},
        {ja:'企画物',en:'project',zh:'企划产品'},
        {ja:'アヘ顔',en:"ahegao",zh:"啊嘿颜"},

        /*==== gachinco.com ====*/
        {ja:'素人娘',en:'',zh:'素人'},

        /*==== pacopacomama.com ====*/
        {ja:'生ハメ・生姦',en:'',zh:'不戴套'},
        /*场景*/
        {ja:'ビーチ',en:'',zh:'海滩'},


        /*体位*/
        {ja:'',en:'Missionary',zh:'传教士体位'},
        {ja:'騎乗後背位',en:'',zh:'背对骑乘位'},{ja:'顔面騎乗',en:'',zh:'骑在脸上'},{ja:'バック',en:'',zh:'后入式'},{ja:'マングリ返し',en:'',zh:'打桩机'},

        /*==== 人物 ====*/
        {ja:'OL・オフィスレディ',en:'',zh:'OL'},{ja:'看護婦',en:'',zh:'护士'},
        {ja:'お姉さん',en:'',zh:'姐姐'},{ja:'メイド',en:'Maid',zh:'女仆'},{ja:'コンパニオン',en:'',zh:'礼仪小姐'},{ja:'花嫁・若妻',en:'',zh:'新娘子'},{ja:'キャバ嬢・風俗嬢',en:'',zh:'风俗娘'},
        {ja:'マニアックコスプレ',en:'',zh:'狂热的角色扮演'},


        /*==== 发型 ====*/
        {ja:'ポニーテール',en:'',zh:'马尾辫'},{ja:'ツインテール',en:'',zh:'双马尾'},

        /*==== 服装类型 ====*/
        {ja:'ビキニ',en:'',zh:'比基尼'},
        {ja:'セーラー服',en:'',zh:'水手服'},{ja:'網タイツ',en:'',zh:'网袜'},


        /*==== heyzo.com ====*/
        {ja:'風呂',en:'',zh:'洗澡'},{ja:'シャワー',en:'',zh:'淋浴'},{ja:'石鹸',en:'',zh:'肥皂'},{ja:'泡',en:'',zh:'泡沫'},{ja:'おもちゃ',en:'',zh:'玩具'},
        {ja:'関西弁',en:'',zh:'',txt:'关西方言'},
        {ja:'ぽっちゃり',en:'',zh:'大号美女'},{ja:'ハメ撮り',en:'',zh:'POV视角'},{ja:'Iカップ',en:'',zh:'I罩杯'},
        {ja:'連続イキ',en:'',zh:'连续高潮'},
        /*==== JaPron ====*/
        {ja:'生中出し',en:'',zh:'中出'},
        {ja:'生姦・ゴム無し',en:'',zh:'不戴套'},
        {ja:'美女・美人',en:'',zh:'美女'},{ja:'美少女・カワイイ系',en:'',zh:'美少女'},

        {ja:'背面騎乗位',en:'',zh:'背面骑乘位'},{ja:'グラインド騎乗位',en:'',zh:'扭腰骑乘位'},
        {ja:'カラダが柔らかい',en:'',zh:'柔体'},{ja:'細身・スレンダー',en:'',zh:'苗条'},{ja:'美肌・美白',en:'',zh:'美肌'},
        {ja:'巨乳・爆乳・超乳',en:'',zh:'巨乳'},{ja:'美乳・素敵なオッパイ',en:'',zh:'美乳'},{ja:'美尻・ケツがいい',en:'',zh:'美臀'},
        {ja:'ロリ声',en:'',zh:'萝莉声'},
        {ja:'ボンテージ',en:'',zh:'奴役'},{ja:'ぶっかけ・輪姦',en:'',zh:'轮奸'},
        {ja:'巨大電マ責め',en:'',zh:'巨大电动棒'},{ja:'ローションプレイ',en:'',zh:'润滑液'},
        {ja:'完全無修正',en:'',zh:'无码'},

        {ja:'強烈ピストンバック',en:'',zh:'激烈的活塞运动'},


        {ja:'立ちバック',en:'',zh:'',txt:'站立作背景'},
        {ja:'サンプル動画上映中',en:'',zh:'',txt:'样片上映中'},{ja:'店長推薦作品',en:'',zh:'',txt:'店长推荐'},{ja:'3D ブルーレイ・ディスク',en:'',zh:'',txt:'3D蓝光光盘'},
        {ja:'',en:'',zh:''},
        /*===== bravoporn.com =====*/
        {ja:'',en:'Big Tits',zh:'大乳头'},{ja:'',en:'Small Tits',zh:'小乳头'},
        {ja:'',en:'Natural Tits',zh:'自然乳头'},
        {ja:'',en:'Ball Licking',zh:'舔睾丸'},

        {ja:'',en:'Shaved Pussy',zh:'剃毛'},
        {ja:'',en:'Creampie',zh:'中出'},{ja:'',en:'Cumshot',zh:'射精'},{ja:'',en:'Orgasm',zh:'性高潮'},
        {ja:'',en:'Nice Ass',zh:'美臀'},
        {ja:'アジアン',en:'Asian',zh:'亚洲人'},{ja:'',en:'Pornstars',zh:'色情影星'},
        {ja:'',en:'Teens',zh:'青少年'},
        {ja:'',en:'Vibrator',zh:'振动器'},{ja:'',en:'Oiled',zh:'涂油'},
        {ja:'',en:'Brunettes',zh:'黑发'},{ja:'',en:'Blonde',zh:'金发'},{ja:'',en:'Blondes',zh:'金发'},{ja:'',en:'Redhead',zh:'红头发'},
        {ja:'',en:'Pigtails',zh:'辫子'},{ja:'',en:'Black Butt',zh:'黑屁股'},
        {ja:'',en:'Glasses',zh:'眼镜'},{ja:'',en:'Miniskirt',zh:'迷你裙'},
        {ja:'',en:'',zh:''},
        {ja:'',en:'Couple',zh:'二人'},
        {ja:'',en:'Public',zh:'公共场合'},
        {ja:'',en:'Erotic',zh:'色情'},

        {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        /*===== xhamster.com =====*/
        {ja:'',en:'Cum on Pussy',zh:'内射'},
        {ja:'',en:'Girlfriend',zh:'女朋友'},{ja:'',en:'My Whore',zh:'我的妓女'},
        {ja:'',en:'Little Big',zh:'有点大'},
        {ja:'',en:'Hairy',zh:'毛茸茸'},

        {ja:'',en:'Upskirts',zh:'裙底风光'},{ja:'',en:'Squirting',zh:'喷射'},{ja:'',en:'Gaping',zh:'张开'},

        {ja:'',en:'Amateur',zh:'业余'},

        {ja:'',en:'',zh:''},{ja:'',en:'',zh:''},{ja:'',en:'',zh:''},
        /*===== xvideos.com =====*/
        {ja:'',en:'verified profile',zh:'资料验证'},{ja:'',en:'dirty-talk',zh:'脏话'},
        {ja:'',en:'bigtits',zh:'大乳头'},
        {ja:'',en:'taiwan',zh:'台湾'},{ja:'',en:'',zh:''},
        {ja:'',en:'',zh:''},

        {ja:'',en:'',zh:''},

        /*===== pornfun.com =====*/
        {ja:'',en:'cum in mouth',zh:'射精在嘴里'},{ja:'',en:'mouth fucking',zh:'口交'},
        {ja:'',en:'deepthroat',zh:'深喉'},
        {ja:'',en:'hot girl',zh:'辣妹'},
        {ja:'',en:'doggy style',zh:'【体位】狗交式'},
        {ja:'',en:'bathroom',zh:'浴室'},

        {ja:'',en:'homemade',zh:'自拍'},{ja:'',en:'black hair',zh:'黑发'},
        /*===== porntube.com =====*/
        {ja:'毛深い陰部',en:'Hairy pussy',zh:'毛茸茸的阴部'},
        {ja:'マスターベーション',en:'',zh:'自慰'},
        {ja:'パンティー',en:'',zh:'内裤'},
        {ja:'Big dick',en:'',zh:'大鸡巴'},
        {ja:'異人種間の',en:'Interracial',zh:'种族间'},


        {ja:'ライディング',en:'Riding',zh:'【体位】骑马式'},{ja:'小犬スタイル',en:'Doggystyle',zh:'【体位】狗交式'},
        {ja:'剃毛',en:'Shaved',zh:'剃毛'},
        {ja:'猫なめる',en:'Pussy licking',zh:'舔阴'},{ja:'スキニー',en:'Skinny',zh:'苗条'},
        {ja:'ティーンエイジャー',en:'Teenager',zh:'青少年'},{ja:'女の子女の子',en:'Girl on girl',zh:'百合'},{ja:'スペルマ·スワップ',en:'Cum swap',zh:'精液交换'},
        {ja:'ブルネット',en:'Brunette',zh:'褐发'},{ja:'お尻クソ',en:'Ass fucking',zh:'肛交'},
        {ja:'Sucking',en:'吸い',zh:'吸允'},

        {ja:'フェイシャル',en:'Facial',zh:'面部'},{ja:'',en:'',zh:''},

        /*===== japorn.tv =====*/

        /*===== Other =====*/
        {ja:'',en:'Filipina',zh:'菲律宾妇女'},


        /*===== homepornking.com =====*/
        {ja:'',en:'close unshaved',zh:'无剃毛特写'},{ja:'',en:'close pussy video',zh:'阴部特写'},{ja:'',en:'close toying',zh:'玩弄特写'},{ja:'',en:'clit licking pleasure',zh:'舔阴蒂快感'},{ja:'',en:'clit intense pleasure',zh:'阴蒂激烈快感'},
        {ja:'',en:'toying pussy solo',zh:'独自玩弄阴部'},{ja:'',en:'girl big bust',zh:'巨乳女孩'},
        {ja:'',en:'sexy fucking vagina',zh:'阴道性交'},{ja:'',en:'huge dildo toy',zh:'巨大的假阳具玩具'},


    ];


    //备用域名对照表
    var HostToList={},
        HostToListArr={
            '3atv.cc':['app9751.com','app5700.com'],
            'avaotu.com':['aotu08.com','aotu23.com','aotu24.com','aotu40.com','aotu42.com','xiaobi009.com'],
            'risex7.com':['risex9.com'],
            'v2Porn.com':['media.vsteam.space','v2.sv92.space','email.v2dizhi.at.gmail.com.v2p2.space'],
            'xhamster.com':['video2.xhcdn.com','video3.xhcdn.com'],
            'txxx.com':['cn.txxx.com'],
            '91porn.com':['91p01.space','91p02.space','email.91dizhi.at.gmail.com.7h1.space','91dizhi.at.gmail.com.9p3.space','email.91dizhi.at.gmail.com.t9i.club'],
            'chaturbate.com':['zh.chaturbate.com','latinacamtv.com','chaturbate.sexhd.pics'],
            'xvideos.com':['cbtownship.com','xnxx.com'],
            'caribbeancom.com':['en.caribbeancom.com','cn.caribbeancom.com']
        };
    //对照表克隆数据
    for(var i in HostToListArr){
        for(var j=0;j<HostToListArr[i].length;j++){
            HostToList[HostToListArr[i][j]]=i;
        }
    }
    //脚本开始工作
    //检查克隆对照表，如果当前网站为备用域名，更新 host 信息
    if(HostToList[host]) SiteHost=HostToList[host];

    //----------备用域名对照表 End

    console.group("%c "+GMI.script.name, "color: red");
    console.table(host, SiteHost, HostToList[host], HostToList[SiteHost]);
    //console.log('对照表网站');console.table(HostToList);
    var conf = site[host]||site[SiteHost];													//设置主域名
    if(conf){	//检查是否为匹配的网站
        if(conf.PreProcess) conf.PreProcess(),conf = site[host];
        if(conf.Title) document.title=webTitle=webTitle.replace(conf.Title,'');
        if(conf.ID) TitleMod(conf.ID(),conf.Product||null,conf.newTitle);	//网页标题追加番号
        if(conf.callback) conf.callback();
        if(conf.AD) $(conf.AD).remove(), GM_addStyle(conf.AD+'{display:none!important;}');   //移除广告
        if(conf.Tag) Tran(conf.Tag);       //标签翻译
    }
    //console.log('conf: ', host, site[host], conf);

    switch(host){
        case "aventertainments.com":
        case "mediafreakcity.com":
        case "avfantasy.com":
            TitleMod($('.top-title').text().match(/\w+-\d+$/i).toString(),null,$('.top-title~h2').text());
            var webLang=$('meta[property="og:locale"]').attr('content').match(/(ja|en)/i)[0];
            Tran($('#detailbox A'));					//关键字翻译
            Tran($('SPAN.title'));			//标题翻译
            Tran($('li.TabbedPanelsTab'));	//导航翻译
            $('#detailbox A').each(function(){
                $(this).text(' '+$(this).text());
            });
            break;
    }
    console.groupEnd();

    function Copy(text){
        GM_setClipboard(text);
    }

    function TagMark(obj, type){
        var $str='';
        var T2=function(str){
            if(!type) return "["+str+"]";
            else if(type==2) return "【"+str+"】";
        }

        if(typeof(obj)=='undefined'){
            return;
        } else if(typeof(obj)=='string'||typeof(obj)=='number') {
            $str=T2(obj);
        } else {
            console.log(obj);
            obj.each(function(){
                $str+=T2($(this).text());
            });
        }
        return $str;
    }

    function TitleMod(number, Product, newTitle, Actor, 配信日){//番号，产品名，新标题
        newTitle=newTitle||webTitle;
        newTitle=(Actor?TagMark(Actor):'')+newTitle;
        Product=Product||'';
        webTitle=document.title=(配信日?TagMark(配信日):'')+Product+"【"+number+"】"+newTitle;
    }

    function newTitles(ID, title, newTitle){
        console.log(ID);
        document.title=webTitle="【"+ID+"】"+webTitle.replace(title, newTitle||'');
        return {
            Video:function(){
                webTitle;
            },
            File:function(number,Product){
                Product=Product||'';
                document.title=Product+webTitle;
            }
        }
    }

    function Tran(obj){
        //转化合并 日/英 关键字表
        for(var i=0;i<zhLang.length;i++){
            Tags[zhLang[i].ja]={"zh":zhLang[i].zh,"en":zhLang[i].en.toLowerCase()}
            Tags[zhLang[i].en.toLowerCase()]={"zh":zhLang[i].zh,"ja":zhLang[i].ja}
        }
        obj.each(function(){//如果不是数组
            var txt=$(this).text().toLowerCase().trim();
            //console.log(txt,Tags[txt]);
            if(Tags[txt]) {
                if(!this.title) this.title=$(this).text().trim();           //设置title
                $(this).attr('data-text',$(this).text().trim());			//设置对象自身的 data-text 为当前文本
                $(this).text(Tags[txt]['zh']).addClass('TagContent');		//设置对象的文本为中文翻译
            } else {
                //标签Ctrl点击复制行为
                $(this).click(function(e){
                    var ja, en, zh;
                    ja="{ja:'"+txt+"',en:'',zh:''},";
                    en="{ja:'',en:'"+txt+"',zh:''},";

                    switch(host) {
                        case 'dlsite.com':
                            var id=this.href.match(/\d+/)[0];
                            en="{id:"+id+",en:'"+txt+"',zh:''},";
                            break;
                    }

                    if(e.ctrlKey) {
                        if(/[\u30a0-\u30fa\u30fc-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/.test(txt)) GM_setClipboard(ja);//如果为日语
                        else GM_setClipboard(en);
                        return false;
                    }
                    if(e.altKey) {
                        GM_openInTab('https://translate.google.cn/#view=home&op=translate&sl=en&tl=zh-CN&text='+txt,{active:true})
                        GM_setClipboard(en);
                        return false;
                    }
                });
            }
        });
        //关键字后插入空格
        if(conf.TagSplit) obj.each(function(){
            $(this).after(' ');
        });

        /*
	var SiteTag=Site[host]['Tag'];
	for(var i=0;i<SiteTag.length;i++){
		var str=SiteTag[i].textContent.toLowerCase();
		if(Tags[str]) SiteTag[i].textContent=Tags[str]['zh'];
	}

	var Class=Site[host]['Class'];
	if(!Class){
		for(var i=0;i<Class.length;i++){
			var str=Class[i].textContent.toLowerCase();
			if(Tags[str]) Class[i].textContent=Tags[str]['zh'];
		}
	}
    */
    }

    function SearchRes(ProductID, ProductName, sort){
        // <!----------------- 浮动工具模块 Begin
        GM_addStyle('#BTLinks>a:before{content:"|"} #BTLinks>a{margin:0 2px;} titleMod{-webkit-appearance:checkbox;}');
        var BTLinkData=[
            //sort = 1、JAV，2、Anime，3、All
            //{sort:2,'name':'','urls':''+ProductID},
            {sort:1,'name':'JavLib','urls':'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword='+ProductID},
            {sort:1,'name':'AVDB','urls':'https://www.avmoo.com/cn/search/'+ProductID},
            {sort:1,'name':'GavBus','urls':'https://www.gavbus5.com/video/'+ProductID+'.html'},
            {sort:2,'name':'aniDB','urls':'http://anidb.net/perl-bin/animedb.pl?adb.search='+ProductName+'&show=search&do.search=search'},
            {sort:2,'name':'FapForFun','urls':'http://fapforfun.net/?s='+ProductName},
            {sort:3,'name':'nyaa','urls':'https://sukebei.nyaa.si/?f=0&c=0_0&q='+(sort==2?ProductID:ProductName)},
            {sort:3,'name':'TorrentKitty','urls':'https://www.torrentkitty.tv/search/'+ProductID},
            {sort:3,'name':'BTSpread','urls':'https://btsow.pw/search/'+ProductID},
            {sort:3,'name':'JoJoDL','urls':'https://jojodl.pw/zh/search/ac0/s_'+ProductName},
            {sort:3,'name':'e-hentai','urls':'https://e-hentai.org/?f_search='+ProductName}
        ],
            BTLink=$('<div id="BTLinks">').css({'position':'fixed','left':'10px','bottom':'10px','z-index':'100','padding':'5px','background':'#ccc'}),
            BTLinkMod=$('<input id="titleMod" type="checkbox" title="使用标题作为搜索关键字"><label for="titleMod">使用标题作为搜索关键字</label>').change(function(){
                var TagA=$('#BTLinks A');
                if(this.checked){
                    TagA.each(function(){this.href=this.href.replace(ProductID, encodeURIComponent(ProductName));});
                } else if(!this.checked) {
                    TagA.each(function(){this.href=this.href.replace(encodeURIComponent(ProductName), ProductID);});
                }
            });
        BTLink.append(BTLinkMod).appendTo('body');
        for(var i=0;i<BTLinkData.length;i++) {
            if(sort==BTLinkData[i].sort||BTLinkData[i].sort==3) BTLink.append($('<A>').attr({'target':'blank','href':BTLinkData[i].urls}).text(BTLinkData[i].name));
        }
    }

    function StorageDB(collectionName) {
        //如果没有 集合名，则使用默认 default
        collectionName = collectionName ? collectionName : 'default';
        //创建JSON缓存，如果缓存存在，则转为JSON，否则新建
        var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : {};

        return {
            add : function(name, value) {
                cache[name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            del:function(name) {
                if(name) {
                    console.log(cache,cache[name]);
                    delete cache[name];
                    localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                } else {
                    //删除整个 localStorage 数据
                    localStorage.removeItem(name);
                }
            },
            insert: function(obj){
                localStorage.setItem(collectionName, JSON.stringify(obj));
            },
            Updata : function(name,obj,value){
                cache[obj]=cache[obj]||{};
                cache[obj][name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            Query : function(obj,name){
                return cache[obj]?name?(cache[obj][name]?cache[obj][name]:null):cache[obj]:null;
            },
            find : function(name) {
                if(!collectionName) return false;
                return cache[name];
            },
            read : function(){
                return $.isEmptyObject(cache)?null:cache;//如果为空，则返回 null
            }
        };
    }

    function watchVideoVisited(obj, IDRule, param, ready){ //遍历的目标，ID规则（识别标签），默认添加当前页面为已访问标记，ready：等待页面加载完毕时再进行标记
        //console.log(obj, IDRule, 'watchVideoID: ', watchVideoID, ready);
        //if(localStorage['webVistied']) delete localStorage['webVistied'];

        if(/pornhub/i.test(host)) {
            GM_addStyle(`
.watchVideoVisited{background:red;position:absolute;opacity:0.3;z-index:999;}
.watchedVideoText{background:red;font-size:14px;padding:3px 6px;font-weight:bold;border:1px solid;border-radius:15px;}
`);
        } else {
            GM_addStyle(`
.watchVideoVisited{background:red;position:absolute;opacity:0.3;z-index:999;}
.watchVideoVisited::before{position:absolute;left:10px;top:10px;color:#fff;background:red;font-size:14px;padding:3px 6px;content:"Watched";font-weight:bold;border:1px solid;border-radius:15px;}
`);
        }

        if(!param) param={};
        //首次执行的时候，对当前页面添加已访问状态
        if(param.videoid) StorageDB('webVistied').add('VideoID', param.videoid);
        var width, height;

        var watchVideo={
            //缩略图添加标记功能，用于访问网页时进行标记操作
            watch : function(){
                //console.group('-----===== Watched 开始标记 =====-----');
                var thumbBlock=$(obj);
                //console.log('Watch 预览图：', thumbBlock);

                //遍历页面中匹配属性的缩览图
                thumbBlock.each(function(){
                    //var thumbID=$(this).attr(IDRule)||$(this).data(IDRule)||$(this).find('img').attr(IDRule)||$(this).find('img').data(IDRule)||$(this).find(IDRule).attr(IDRule)||$(this).find(IDRule).data(IDRule),

                    var thumbID=$(this).find('['+IDRule+']').attr(IDRule)?$(this).find('['+IDRule+']').attr(IDRule):$(this).attr(IDRule),
                        FindIMG=$(this).find('img'),
                        ParentFindIMG=$(this).find('['+IDRule+']').parent().find('img'),
                        target=FindIMG.length>0?FindIMG:(ParentFindIMG.length>0?ParentFindIMG:$(this)), //查找目标对象内是否有 IMG 标签
                        FindWatchVideoVisised=$(this).find('.watchVideoVisited').length==0;
                    width=width||param.width||target.width();
                    height=height||param.height||target.height();

                    console.log(thumbID, 'w: ', param.width, 'h: ', target.width(), target, FindWatchVideoVisised);

                    console.log(IDRule, thumbID, target, '未查看标记：', FindWatchVideoVisised, '已查看记录：',StorageDB('Vistied').find(thumbID));
                    //检查是否有存在标记信息，并标记视频
                    if(StorageDB('Favorites').find(thumbID)&&FindWatchVideoVisised) $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'red'}).insertBefore(target);

                    else if(StorageDB('Cut').find(thumbID)&&FindWatchVideoVisised) $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'springgreen'}).insertBefore(target);

                    else if(StorageDB('Vistied').find(thumbID)&&FindWatchVideoVisised) $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'paleturquoise'}).insertBefore(target);
                });
                console.groupEnd('-----===== Watched 开始标记结束 =====-----');
            },
            //监听功能 localstorage 变化时，查找页面上是否有对应的ID
            listen : function(){
                window.addEventListener('storage',function(){
                    console.group('-----===== Watched 监听开始 =====-----');

                    console.log('规则标签：', IDRule, StorageDB('webVistied').find('VideoID'));

                    var ListenVideoID=StorageDB('webVistied').find('VideoID'),
                        selector=$(obj+'['+IDRule+'*="'+ListenVideoID+'"], '+obj+'[data-'+IDRule+'*="'+ListenVideoID+'"], '+obj+' ['+IDRule+'*="'+ListenVideoID+'"], '+obj+' [data-'+IDRule+'*="'+ListenVideoID+'"]');

                    console.log(selector);

                    selector.each(function(){
                        var FindIMG=$(this).find('img'),
                            ParentFindIMG=$(this).parent().find('img'),
                            target=$(this).is('img')?$(this):FindIMG.length>0?FindIMG:(ParentFindIMG.length>0?ParentFindIMG:$(this)), //获取ID对应的对象
                            targetFind=target.parent().find('.watchVideoVisited');
                        console.log('目标对象：', this);
                        console.log('目标对象是否为图像：', $(this).is('img'));
                        console.log('监听的视频ID：', ListenVideoID);
                        console.log(obj);
                        console.log(target);
                        console.log(targetFind);

                        if(StorageDB('Favorites').find(ListenVideoID)) {
                            console.log("%c “最爱”视频", 'color: red;');
                            if(targetFind.length>0) targetFind.css({'background':'red'});
                            else $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'red'}).insertBefore(target);
                        }
                        else if(StorageDB('Cut').find(ListenVideoID)) {
                            console.log("%c “不爱”视频", 'color: green;');
                            if(targetFind.length>0) targetFind.css({'background':'springgreen'});
                            else $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'springgreen'}).insertBefore(target);
                        }
                        else if(StorageDB('Vistied').find(ListenVideoID)&&targetFind.length==0) $('<div class="watchVideoVisited"></div>').css({'width':width,'height':height,'background':'paleturquoise'}).insertBefore(target);
                    });

                    console.groupEnd('-----===== Watched 监听结束 =====-----');
                }, true);
            },
            init: function(){
                this.watch();
                this.listen();
            }
        }
        if(ready) $(document).ready(watchVideo.init);
        else {

            if(param.watch) watchVideo.watch();
            else if(param.listen) watchVideo.listen();
            else watchVideo.init();
        }
    }


    function PackUP(title, target, now){ //收起展开
        //title 为点击的目标，需要具体到文本位置
        let text=$(title).text().trim(),
            titleTarget=$(title).find(':contains("'+text+'")');
        titleTarget.click(function(){
            $(target).slideToggle(100, function(){
                if(this.style.display=='none') titleTarget.text(text+"︽");
                else if(this.style.display) titleTarget.text(text+"︾");
            });
        });
        if(now) titleTarget.click();
    }

    function getQueryString(name,url) {//筛选参数
        url=url?url.replace(/^.+\?/,''):location.search;	//网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = url.replace(/^\?/,'').match(reg);
        //console.log(str[0]);		//所筛选的完整参数串
        //console.log(str[1]);		//所筛选的参数名
        //console.log(str[2]);		//所筛选的参数值
        if (str != null) return unescape(str[2]);
        return null;
    }

    function setCookie(CookieName, Cookievalue,CookieDays) {//添加Cookies
        var str = CookieName + "=" + escape(Cookievalue);
        if(CookieDays> 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            var ms = CookieDays*24*3600*1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        document.cookie = str;
    }

    function addMObserver(selector, callback, Kill, option) {
        var watch = document.querySelector(selector);

        if (!watch) {
            return;
        }
        console.warn('watch:', watch, selector);
        var observer = new MutationObserver(function(mutations){
            console.log('mutations:', mutations);
            var nodeAdded = mutations.some(function(x){
                console.log(x);
                return x.addedNodes.length > 0;
            });
            console.log(nodeAdded);
            if (nodeAdded) {
                console.log(mutations, observer);
                callback(mutations, observer);
                if(Kill) {
                    console.log('停止'+selector+'的监控');
                    observer.disconnect();
                }
            }
        });
        observer.observe(watch, option||{childList: true, subtree: true});//
    }

    function MObserver(selector, callback, kill, option){
        var watch = document.querySelector(selector);
        if (!watch) {
            return;
        }
        var observer = new MutationObserver(function(mutations){
            callback(mutations);
            if(kill) {
                console.log('停止'+selector+'的监控');
                observer.disconnect();
            }
        });
        observer.observe(watch, option||{childList: true, subtree: true});
    }

    function FavToolsFn(VideoID, obj, VideoInfo){
        var Thunder, Download, PotPlayer, tips,
            mode=VideoInfo.Config.mode?VideoInfo.Config.mode:'After',
            PotBtn=VideoInfo.Config.PotBtn||'on', H5Btn=VideoInfo.Config.H5Btn||'on', DownBtn=VideoInfo.Config.DownBtn||'on', ThunderBtn=VideoInfo.Config.ThunderBtn||'on';
        GM_addStyle('#FavTools{font-size:18px;margin:4px 4px;padding:3px 6px;background:#3a3a3a;color:#fff;line-height:30px;} #FavTools>span{cursor:pointer;} #H5PlayerTips{margin-left:10px;}\
.FavTools_Thunder {margin-left:10px;} .FavTools_Thunder img{vertical-align:middle;}\
.FavTools_Download, .FavTools_Download>a, FavTools_Download>a:visited{color:red;font-weight:blod;}\
.FavTools_Potplayer, .FavTools_Potplayer>a, .FavTools_Potplayer>a:visited{color:yellow;font-weight:blod;}\
.FavTools_Download::before{padding:2px 4px;content:"↓";font-size:16px;margin:0 2px 0 10px;font-wehight:blod;border:1px solid;-webkit-text-stroke: 2px red;}\
.FavTools_Potplayer::before{padding:2px 6px;content:"▶";font-size:16px;margin:0 2px;font-weight:bold;border:1px solid;border-radius:15px;}');

        var Color={'Fav':'red','Cut':'springgreen','Visited':'#00edD5'};
        var Tools=$('<span id="Cut">✄</span> | <span id="Favorites">❤</span> | <span id="Visited" class="Visited">ↂ</span>');

        if(VideoInfo) {
            if(VideoInfo.href) {

                var ThunderData={ //传递给本地脚本的信息
                    href:(VideoInfo.href||VideoInfo.Player),
                    filename: encodeURIComponent(VideoInfo.download),
                    webpage: encodeURIComponent(urls),
                    cookie: encodeURIComponent(document.cookie),
                    info: ''
                },
                    ThunderJS=ThunderData.href+","+ThunderData.filename+","+ThunderData.webpage+","+ThunderData.cookie;

                console.log('ThunderBtn', ThunderBtn);
                if(ThunderBtn=='on') Thunder=$('<span>').attr({'class':'FavTools_Thunder'}).append($('<a>').attr({'target':'_self','href':'thunderjs://'+ThunderJS}).append('<img src="'+thunderICO()+'">'));
                if(DownBtn=='on') Download=$('<span>').attr({'class':'FavTools_Download','title':'高清晰度'}).append($('<a>').attr(VideoInfo).text('Download'));
                if(H5Btn=='on') tips=$('<span id="H5PlayerTips"></span><span id="H5PlayerProgress"></span>');
                if(PotBtn=='on'&&VideoInfo.Player) { //PotPlayer 按钮
                    PotPlayer=$('<span>').attr({'class':'FavTools_Potplayer'}).append($('<a>').attr({'target':'_self','href':'PotPlayer://'+VideoInfo.Player,'title':VideoInfo.quality||'高清晰度'}).text('PotPlayer'));
                }
            }
        }

        var insertWhere=$('<div id="FavTools">').text('收藏工具：').append(Tools).append(Thunder).append(Download).append(PotPlayer).append(tips);
        switch(mode) {
            case 'Before': insertWhere.insertBefore(obj);break;
            case 'After': insertWhere.insertAfter(obj);break;
            default : Tools.appendTo(obj);
        }

        $('#Favorites').click(function(){
            if(StorageDB('Favorites').find(VideoID)) {
                StorageDB('Favorites').del(VideoID,true);
                $(this).css('color','');
            } else {
                StorageDB('Favorites').add(VideoID,true);
                $(this).css('color',Color['Fav']);
            }
        });
        $('#Cut').click(function(){
            if(StorageDB('Cut').find(VideoID)) {
                StorageDB('Cut').del(VideoID,true);
                $(this).css('color','');
            } else {
                StorageDB('Cut').add(VideoID,true);
                $(this).css('color',Color['Cut']);
            }
        });
        $('#Vistied').click(function(){
            if(StorageDB('Vistied').find(VideoID)) {
                StorageDB('Vistied').del(VideoID,true);
                $(this).RemoveClass('Visited');
            } else {
                StorageDB('Vistied').add(VideoID,true);
                $(this).addClass('Visited');
            }
        });
        StorageDB('Vistied').add(VideoID,true);
        $('#Visited').css('color',Color['Visited']);
        StorageDB('webVistied').add('VideoID', VideoID);
        if(StorageDB('Favorites').find(VideoID)) $('#Favorites').css('color',Color['Fav']);
        else if(StorageDB('Cut').find(VideoID)) $('#Cut').css('color',Color['Cut']);
    }

    //VideoFn({'VideoID':trackVideoId,'VideoSrc':VideoUrlPlayer,'Download':VideoUrlDownload,'Info':VideoInfo,'width':H5width,'height':'480','Target':'#videoPlayerPlaceholder', FavTools:{'target':'插入目标','mode':'插入位置模式（Before, After, 无选项默认为 appendTo）','H5Btn':'off'||'on'(default), 'PotBtn':'off'||'on'(default)}});
    function VideoFn(VideoData){
        console.log(VideoData, VideoData.H5Btn);
        var VideoID=VideoData.VideoID||'',
            VideoSrc=VideoData.VideoSrc||'',
            VideoQuality=VideoData.VideoQuality||'',
            VideoPoster=VideoData.Poster||'',
            VideoTitle=VideoData.VideoTitle||webTitle,
            VideoTarget=VideoData.Target, //工具嵌入的位置
            VideoWidth=VideoData.width||$(VideoTarget).width(),
            VideoHeight=VideoData.height||$(VideoTarget).height(),
            VideoDownload=VideoData.Download||VideoData.VideoSrc, //下载地址，未分配下载地址时使用视频地址
            VideoInfo=VideoData.Info||'['+host+']['+VideoID+']'+VideoTitle, //Info 为 Download 属性使用
            VideoH5Player=StorageDB('H5Player').find('show')||false,
            VideoFavTools=VideoData.FavTools||false, //独立的 FavTools 对象，无指定将嵌入到视频的下方（{'target':'插入目标','mode':'插入位置模式（Before, After, 无选项默认为 appendTo）'}）;
            H5Btn=VideoFavTools.H5Btn||'on'; //H5Btn 的显示开关
        //FileType='.'+(VideoData.FileType||/(?:\.(\w+)(?:\?|\/\?|$))/i.test(VideoSrc)?VideoSrc.match(/(?:\.(\w+)(?:\?|\/\?|$))/i)[1])||'';

        console.log('VideoInfo: ', VideoInfo, VideoData.Info)
        console.warn('VideoData: ', VideoData);

        if(!VideoTarget){
            alert('H5Player 视频无效的插入目标');
            return false;
        }

        if(VideoID&&VideoTitle) document.title=VideoInfo||VideoTitle.search(VideoID)>0?//先检测标题中有没有视频ID等信息
            VideoTitle:'['+SiteHost+']'+'['+VideoID+']'+VideoTitle;
        //视频地址，缩览图，宽，高，插入的目标，视频ID
        if(VideoSrc) {
            var H5PlayerFn = {
                tips : function(txt) {
                    $('#H5PlayerTips').text(txt);
                },
                progress : function(txt) {
                    $('#H5PlayerProgress').html($('<A>').text(txt).css({'cursor':'pointer'}).click(function(){
                        //document.querySelector('#H5Player').currentTime=txt;
                    }));
                },
                PlayerEvent : function(e, tips){
                    console.log('PlayerTime', this, e, tips);
                    //当前不是所记录的视频时，重新记录进度
                    if(VideoID != StorageDB('PlayerTime').find('VideoID')){
                        StorageDB('PlayerTime').add('VideoID', VideoID);
                        StorageDB('PlayerTime').add('currentTime', e.currentTime);
                        this.tips(tips+e.currentTime);
                    }
                }
            }
            //生成视频对象
            var H5Player=$('<video>').attr({'id':'H5Player','poster':VideoPoster,'src':VideoSrc,'controls':true,'autoplay':false,'preload':true,'width':VideoWidth,'height':VideoHeight}).on({
                'dblclick' : function(e){this.paused ? this.play() : this.pause();},	//双击播放
                'click' : function(e){
                    console.log('当前对象高度：',this.clientHeight , '鼠标点击对象的相对位置：', e.screenY);
                    if(!this.paused && e.screenY<this.clientHeight*0.8) this.pause();//单击画面上部分80%的区域时，暂停画面
                },
                'keydown' : function(e){
                    switch(e.keyCode){
                        case '37' : this.currentTime-=3; H5PlayerFn.tips("后退：3秒"); break;
                        case '39' : this.currentTime+=3; H5PlayerFn.tips("快进：3秒"); break;
                        case '97' : this.width*=0.5;break;
                        case '98' : this.width*=1;break;
                        case '99' : this.width*=1.5;break;
                        case '100' : this.width*=2;break;
                    }
                }
            }).bind({
                'embed' : function(e){
                    var VideoTime=parseInt(this.currentTime);
                    if(VideoID!= StorageDB('PlayerTime').find('VideoID')){
                        StorageDB('PlayerTime').add('VideoID', VideoID);
                        H5PlayerFn.tips('开始播放：');
                    } else {
                        H5PlayerFn.tips('存在上一次播放进度：');
                    }
                    StorageDB('PlayerTime').add('currentTime', VideoTime);
                    H5PlayerFn.progress(VideoTime);

                    var t=window.setInterval(function(){
                        StorageDB('PlayerTime').add('currentTime', VideoTime);
                        H5PlayerFn.progress(VideoTime);
                    },5000);
                    $(this).bind('pause', function(e){ //在播放暂停时
                        StorageDB('PlayerTime').add('currentTime', VideoTime);
                        H5PlayerFn.tips('暂停：');
                        H5PlayerFn.progress(VideoTime);
                        clearInterval(t);
                    });
                },  //在媒体开始播放时触发
                'seeked' : function(e){
                    var VideoTime=parseInt(this.currentTime);
                    StorageDB('PlayerTime').add('currentTime', VideoTime);
                    H5PlayerFn.tips('跳转到：');
                    H5PlayerFn.progress(VideoTime);
                },
                'loadeddata' : function(e){
                    H5PlayerFn.tips('视频加载完毕！');
                },
                'error':function(e){
                    //视频加载失败时使用的事件
                    console.log('error', e);
                }
            });
            var VideoH5PlayerFn=function(){
                H5Player.replaceAll(VideoTarget);
                var _H5Player=document.querySelector('#H5Player');
                //对 video 增强
                if($('#H5PlayerTools').length===0){
                    //生成视频播放控制对象
                    $('<div id="H5PlayerTools">').append('画面缩放：<button class="H5Size" value="0.5">0.5</button><button class="H5Size" value="1">1</button><button class="H5Size" value="1.5">1.5</button><button class="H5Size" value="2">2</button><button id="H5Player_Control_Add" value="39">快进3秒</button><button id="H5Player_Control_Less" value="37">后退3秒</button><button id="H5Player_Reload">重新加载</button><button id="H5Player_Transform">旋转90度</button><span id="VideoTips"></span><span id="VideoProgress"></span>').insertAfter('#H5Player');
                    //播放控制工具
                    $('#H5PlayerTools>button').click(function(){
                        if(this.className=='H5Size') $('#H5Player').attr({'width':VideoWidth*this.value});
                        if(this.id=='H5Player_Control_Add') H5Player.currentTime+=3, H5Player.tips("快进：3秒");
                        if(this.id=='H5Player_Control_Less') H5Player.currentTime-=3, H5Player.tips("后退：3秒");
                        if(this.id=='H5Player_Reload') H5Player.src=VideoSrc;
                        if(this.id=='H5Player_Transform') {
                            var H5wt=_H5Player.style.webkitTransform;
                            _H5Player.width=480;
                            H5wt='rotate('+(H5wt?parseInt(H5wt.match(/\d+/).toString())+90:90)+'deg)';
                        };
                    });
                    $(document).on('keydown', function(e){
                        switch(e.keyCode){
                            case '37' : _H5Player.currentTime-=3;H5PlayerFn.tips("后退：3秒");break;
                            case '39' : _H5Player.currentTime+=3;H5PlayerFn.tips("快进：3秒");break;
                            case '97' : _H5Player.width*=0.5;break;
                            case '98' : _H5Player.width*=1;break;
                            case '99' : _H5Player.width*=1.5;break;
                            case '100' : _H5Player.width*=2;break;
                        }
                    });
                    GM_addStyle('.H5Size{width:30px;} #H5PlayerTools>button{margin:1px;padding:2px;background:#ccc;}');
                }
            }
            if(VideoH5Player) VideoH5PlayerFn();

            var H5Player_Control=StorageDB('H5Player').find('show');
            var H5Player_btn=$('<button>').text(!VideoH5Player?'开启H5Player':'关闭H5Player').click(function(){
                if(!VideoH5Player) {
                    VideoH5Player=true;
                    VideoH5PlayerFn();
                } else {
                    VideoH5Player=false;
                }
                this.textContent=!VideoH5Player?'开启H5Player':'关闭H5Player';
                StorageDB('H5Player').add('show', VideoH5Player);
            });
        }
        //window.history.pushState('state', 'title', SrcHost);

        FavToolsFn(VideoID, VideoH5Player?'#H5Player':VideoFavTools?VideoFavTools.target:VideoTarget, {'href':VideoDownload, 'Player':VideoSrc, 'download':VideoInfo,'quality':VideoQuality, Config:VideoFavTools});
        if(H5Btn=='on') $('#FavTools').append(H5Player_btn);
    }

    function VideoTmpl(tmpl, VideoData){
        var u=unsafeWindow, VideoID;
        switch(tmpl){
            case 'JWPlayer':
                console.group('********** JWPlayer 播放插件 **********');
                VideoID=VideoData.VideoID=u.video_id||jwsettings.video_id;
                new watchVideoVisited(VideoData.thumbnail, "video-id", VideoID);
                var t=setInterval(function(){
                    if(u.video_url.SearchTest('^http')) {
                        var VideoUrl=VideoData.VideoUrl=u.video_url,
                            VideoTitle=VideoData.VideoTitle||u.video_title||webTitle,
                            VideoTarget=VideoData.Target,
                            VideoFavTools=VideoData.FavTools||false,  //工具组（{'target':'插入目标','mode':'插入位置模式（Before, After, 无选项默认为 appendTo）'}）;
                            VideoPreview=VideoData.Poster=jwsettings.playlist[0].image,
                            VideoInfo=VideoData.Info||'';
                        //console.log('VideoTmpl VideoData: ',VideoData);
                        VideoFn({'VideoID':VideoID,'VideoTitle':VideoTitle,'VideoSrc':VideoUrl,'Download':VideoUrl,'Poster':VideoPreview,'FavTools':VideoFavTools,'width':VideoData.width||$(VideoTarget).width(),'height':VideoData.height||$(VideoTarget).height(), 'Target':VideoTarget, Info:VideoInfo});
                        clearInterval(t);
                    }
                }, 100);
                //console.log('u.video_url: ', u, u.video_url, u.video_url.SearchTest('http'), u.video_url.SearchTest('http','url'));
                //new watchVideoVisited($(VideoData.thumbnail),"$(this).find('img').data('video-id')", VideoID);
                console.groupEnd();
                break;
                /*
      case 'CKPlayer':
        console.group('CKPlayer 播放插件');
        var VideoID=VideoData.VideoID,
            VideoUrl=VideoData.VideoUrl,
            VideoTitle=VideoData.VideoTitle;
        break;
        */
            case 'kt_player':
                console.group('********** kt_player flashvars 播放插件 **********');
                var t=setInterval(function(){
                    var flashvars=u.flashvars;
                    console.log('flashvars: ', flashvars, 'FavTools: ', VideoData.FavTools);
                    if($('#kt_player').length>0&&flashvars) {
                        var VideoID=VideoData.VideoID||flashvars.video_id,
                            VideoTitle=VideoData.VideoTitle,
                            VideoUrl=VideoData.VideoUrl||flashvars.video_url,
                            VideoPreview=VideoData.VideoPreview||VideoData.Poster||flashvars.preview_url,
                            VideoFavTools=VideoData.FavTools||true,
                            VideoTarget=VideoData.VideoTarget||'#kt_player',
                            VideoInfo=VideoData.Info||'';
                        VideoFn({'VideoID':VideoID,'VideoTitle':VideoTitle,'VideoSrc':VideoUrl,'Download':VideoUrl,'Poster':VideoPreview,'FavTools':VideoFavTools,'width':VideoData.width||$(VideoTarget).width(),'height':VideoData.height||$(VideoTarget).height(),'Target':VideoTarget, Info:VideoInfo});
                        console.groupEnd('********** kt_player flashvars 播放插件 **********');
                        clearInterval(t);
                    }
                }, 500);
                break;
            case 'm3u8':
                GM_addStyle('#M3U8_Download{color:blue;}\
#M3U8_Download:before{color:blue;padding:2px 6px;content:"☄";font-size:16px;margin:0 2px;font-weight:bold;border:1px solid;border-radius:15px;background:#fff;}');
                var M3U8_Download=$('<a>').attr({'id':'M3U8_Download','href':'ffmpeg://'+VideoData.VideoUrlHls+","+encodeURIComponent('['+host+']['+VideoData.VideoID+']'+VideoData.VideoTitle)}),
                    M3U8_A=$('<a>').attr({'href':VideoData.VideoUrlHls}).text(VideoData.VideoQuality+' M3U8');
                $('#FavTools').append(M3U8_Download).append(M3U8_A);
                break;
        }
    }

    function thunderICO(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATTSURBVHjanJVbiJVVFMd/a+/9nXM+jzOjzkwzZppZ2gWjsh6EnipIYlBIiELtQlEglL0YXaEIIovqIYqgl6J66Gr2kJJERUE3a0rs3hTZ6HiZMzfPnDmXb++9ejhnBqeLgR8sPlh8e6/1rfX7ryVljezcM7Xuld3+iYmyzkvyZoqTfBTwGcW0oCO39eXuWXtxukPe6Z+65vrHpl5PXI5T5huiRvRkbhYQQEQolQP1iuf5+4ob5MqHR7/eM2BXLesxhKicdPYqKGBEsSL8MRy54HT9xg2P+GWLuhKyoK1Umlmo/n8wEQDh6ERktKyc2aukeYcPyqmdhtHxbIlJnYt4MBqRKJgomKgYBaNgW+/jzQFGhQNH4Kf9njO6AtvvgrUXRg4NKyYqREgSrFMDQcCKkLMZw2UhC455Rah5KCSQWCVqs8bGCIMlpVxpsOYC5dY1BfouKVKtT7HtbcUmQhAlqoIRddM9qnuhoyPQtwIa6vhgbyCxyuFRJUksS7uFUhkGDnkuOSvy0LUF+lblaf5P5ManPV8MGFYuUXwAFUFRnAJGFSuRw+N5iknkspUNNt+VsHxhnj2/Vrn3Jc/n31p6ez2PbUq4c22BvEvxCk7go+8qvNsfOGuha16uisaIquJQJQpYA6lV9g0Ku74SnskpFy1NuGxlnhfuqHPvy2W2rM1z+flzCSqMVwPWGtpy8OmPgZwDI/wNDkFWby2NjGW5BTkTp31MTAkEz84HC5y7aA4NrxScJ2IZryoxCIqhey7s3lth/eN1Tl1gSRNmNOSjMCcJY05VZrzSaohB6WgHsUIWPeNVg3MW76cxVjqKkf1jVW55qkKllBDmSQtbRVtAiCoOHCaCkQgYEMgaQk+v0JkaynWhEQKNMJv/mjcMT8CmKxwjk9D/e+Cng9DdJnS2QS3OIO2J4ogIQhPHJIGRSaWcRbpS8F6RZnot1cLIRGRZT8qjN6RARiXz7Oyv8/yuyMCQJU3Bi+JAmxWS1kkRiqkycFDZuafGlqscw2rwIWBFaHjomS8UC8qRcoMvf8v49IdmAnOcIzERYwRRARWcqsWqIK3um2YMutosT77l6W6f5LpLU45UDUfGPV1twsf7qrz2SWTkmGPwqHJg2OByEQN0t7VEmgkmRhxAQLBYVBWh2fS2IpSO5dnyXMZnP1fYcHnCeUsdOQyDw/DGe0p3r6FjrmH5YiWqb7Gi1IMSxTTxX7T67rurwaZWdJojAEKEYh6sM3y41/B+f8boMc+yhdB3YZHvj3q+O6j0tBti1Okx2UwQmr20sWZONCmDQj6BFacJjZDniTeFjdvq7Buqs3W9peigngGiCBbBzhJZE3kBaMr6vywEpT2NnLPY8suBPFfeV6MaIjevsQyVYouP2DJtqVlRFBOjyvGlOdHSigpLeyM+5Lj9WaG9WOfsxYFaQ/5rCYmpNdQYo8c5T7xofISFnZHSmLL9E0uxICCzz0hL7ZkP0Zwy3w78eTTMGlSq/EupmDEfoKsdxictQ6OGvGPWd8bAUCnQVjSD8sZXUxs3PTLxiksSuua5VjniDBP6j0IxizZhRqozFJUmItVKg5fvb79JxlTZ8fHk1S/urm+r1k2nM1KT1r2zwf33vhwfThXxQdNCjrHN6/IPXLd6zqt/DQDR/JI5fvsenAAAAABJRU5ErkJggg=="
    }

    function msg(title, obj, css){
        if(typeof(title)=='object') {
            console.group('%c -----***** ' + title.title + ' *****-----', title.css);
        } else {
            console.group('-----***** ', title, ' *****-----');
        }

        if(typeof(obj)=='object') { //用法一，目标为对象，直接使用 table 输出
            console.table(obj);
        } else {
            $.each(obj, function(i, val){ //用法二，目标为数组，则对数组内容进行数据识别
                if(Array.isArray(val)) { //如果数组内容为数组，且数组长度为 2，则直接输出数组内容，否则输出数组
                    if(val.length==2) console.log(val[0], val[1]);
                    else console.log(val);
                } else if(typeof(val)=='object') { //如果数组内容为对象，则以table输出
                    console.table(val);
                } //其它情况（字符串、数字）时，直接以文本输出
                else console.log('%c '+val, /color/i.test(css) ? css: 'color:'+css);
            });
        }
        console.groupEnd();
    }

    function clipboard(eve, txt, tips){
        $(eve).click(function(e){
            if(tips) u.layer.tips('已复制标题', this);

            GM_setClipboard($(this).data(txt));
        });
    }

    function layerCSS(){
        (async function() {
            let s = document.createElement("link");
            s.href = await GM_getResourceURL("layerCSS");
            s.rel = "stylesheet";
            document.body.appendChild(s);
        })();
    }

    function load_layer(callback, version){
        if(!callback) callback=()=>{};
        var layerUrl;
        switch(version){
            case 2:
                layerUrl='https://lib.baomitu.com/layer/2.3/layer.js';
                break;
            default: layerUrl='https://lib.baomitu.com/layer/3.1.1/layer.js';
        }

        $('<link>').attr({rel:"stylesheet", href:GM_getResourceURL("layerCSS")}).appendTo('body');

        if(layer) {
            callback();
        } else if(!u.layer){
            $.getScript(layerUrl, function(e){
                console.log(e);
                var s = document.createElement("link");
                s.href = GM_getResourceURL("layerCSS");
                s.rel = "stylesheet";
                document.body.appendChild(s);
                callback();
            });
        } else {
            callback();
        }
    }
}


)();