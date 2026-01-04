// ==UserScript==
// @name           Douban Movie Search
// @author         无姓之人 修改版
// @include        *//movie.douban.com/subject/*
// @include        *//book.douban.com/subject/*
// @grunt          none
// @description    豆瓣电影资源快捷搜索
// @license MIT
// @version 1.3.4
//
// @namespace https://greasyfork.org/users/892218
// @downloadURL https://update.greasyfork.org/scripts/442059/Douban%20Movie%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/442059/Douban%20Movie%20Search.meta.js
// ==/UserScript==
function run () {
    var movieTitle = $('h1 span:eq(0)').text();//名称
    var title = $('html head title').text();//标题

    var IMDBID = $('#info').text().match(/IMDb: (.*)/);//IMDb值

    if(IMDBID == null){
        IMDBID = "";
    }else{
        IMDBID = $('#info').text().match(/IMDb: (.*)/)[1];//IMDb值
    };//判断“IMDb”是否存在

    var yearNum = $('.year').text().substring(1, 5);//年份

    var keyword1 = title.replace( '(豆瓣)', '' ).trim();//中文名称
    var keyword2 = encodeURIComponent( keyword1 );
    var keyword3 = encodeURIComponent( keyword2 );
    var mTeOthername = movieTitle.substring(keyword1.length+1);//中文名称旁边的标题（英语）
    if( mTeOthername == ''){
        mTeOthername  = keyword1;
    }
    var MovieOriginalTitle = movieTitle.replace(/^[^a-zA-Z]*/, "");//英语名
    var movieSimpleTitle = keyword1.replace(/第\S+季.*/, "");//中文名
    var movieFinalTitle = MovieOriginalTitle.replace(/Season\s/, "S");//最终英语名

    var OtherTitle = $('#info').text().match(/又名: (.*)/);//又名

    if( OtherTitle == null){
        OtherTitle = "无又名";
    }else{
        OtherTitle = $('#info').text().match(/又名: (.*)/)[1];//又名
    };//判断“又名是否存在”

    var EngTitle = [movieSimpleTitle, OtherTitle].join("/").split("/").filter(function (arr) {
        return /([a-zA-Z]){2,}/.test(arr);
    })[0] || "";//又名中的英语名

    EngTitle = EngTitle.trim()//去除首尾空格
    movieSimpleTitle = movieSimpleTitle.trim()//去除首尾空格

    var ZY_links = yearNum+'.'+movieSimpleTitle+'.'+movieFinalTitle+'.'+IMDBID;//资源名称

    if( movieFinalTitle == ''){
        movieFinalTitle  = EngTitle.replace(": ", ".");
        ZY_links = yearNum+'.'+movieSimpleTitle+'.'+movieFinalTitle+'.'+IMDBID;
    }
    ZY_links = ZY_links.replace(": ", ".").replace(/ /g, ".");
    //alert(ZY_links);弹窗

    var Movie_links = [
        //{ html: "Google", href:  "https://www.google.com/search?safe=off&q=%E5%9C%A8%E7%BA%BF+" + keyword1},
        //{ html: "Bing", href:  "https://cn.bing.com/search?q=" + movieFinalTitle + "&go=Search&qs=ds&form=QBRE"},
        //{ html: "RARBG", href: "https://rarbgmirror.org/torrents.php?search=" + IMDBID },//已挂，纪念
        //{ html: "ExtraNet", href: "https://extranet.torrentbay.net/search/?order=age&sort=desc&q=" + movieFinalTitle + " "+ yearNum},
        { html: "MagnetDL", href: "https://magnetdl.hair/xsearch?q=" + movieFinalTitle + " "+ yearNum },
        //{ html: "TorrentDL", href: "https://www.torrentdownload.info/searchd?q=" + movieFinalTitle + " "+ yearNum },
        //{ html: "GloTorrents", href: "https://glotorrents.nocensor.click/search_results.php?search=" + movieFinalTitle + " "+ yearNum},
        //{ html: "Torlock", href: "https://torlock.123unblock.art/?qq=1&q=" + movieFinalTitle + " "+ yearNum},
        { html: "TorrentGalaxy", href: "https://torrentgalaxy.one/get-posts/keywords:" + IMDBID },
        { html: "1337X", href: "https://www.1377x.to/sort-search/" + movieFinalTitle + " "+ yearNum + "/time/desc/1/"},
         //{ html: "1337X", href: "https://1337x.unblockit.ist/search/" + movieFinalTitle + " "+ yearNum + "/1/"},备用
        { html: "knaben", href: "https://knaben.eu/search/" + movieFinalTitle + " "+ yearNum + "/0/1/date"},
        //{ html: "Torrentz2", href: "https://torrentz2.in/?q=" + movieFinalTitle + " "+ yearNum},
        { html: "YTS", href: "https://yts.sx/?s=" + movieFinalTitle },
        { html: "Kat", href: "https://kat.am/usearch/" + movieFinalTitle +" "+ yearNum + "/"},
        //{ html: "Zooqle", href: "https://zooqle.torrentbay.to/search?q=" + movieFinalTitle +" "+ yearNum },已挂暂无替代
        { html: "Rutracker(俄)*", href: "https://rutracker.net/forum/tracker.php?nm=" + movieFinalTitle +" "+ yearNum },
        //{ html: "Demonoid*", href: "https://demonoid.is/files/?category=0&seeded=2&external=2&query=" + movieFinalTitle +" "+ yearNum +"&uid=&sort="},
        //{ html: "kickass", href: "https://kickasstorrents.cr/usearch/" + movieFinalTitle +" "+ yearNum + "/"},//备用
        //{ html: "Ettv", href: "https://www.ettv.be/torrents-search.php?search=" + movieFinalTitle +" "+ yearNum },//已挂暂无替代
        //{ html: "Limetorrents", href: "https://www.limetorrents.cc/search/all/" + movieFinalTitle + " "+ yearNum + "/" },
        { html: "TorrentKitty", href: "https://torkitty.net/search/" + keyword1 +"/"},//https://www.torrentkitty.lol/search/&https://www.torrentkitty.red/search/备用
        { html: "The Pirate Bay", href: "https://pirate-bays.net/search?q=" + movieFinalTitle + " "+ yearNum},
         //{ html: "海盗湾", href: "https://www1.thepiratebay3.to/s/?q=" + movieFinalTitle + " "+ yearNum},//https://tpb.proxyninja.org/备用
        { html: "EZTV(剧)", href: "https://eztv.re/search/" + movieFinalTitle + " "+ yearNum},
        //{ html: "DirtyTorrents", href: "https://dirtytorrents.unblockit.day/torrents/?search=" + movieFinalTitle + " "+ yearNum },
        { html: "Torrent9(法)", href: "https://www.torrent9.fm/search_torrent/" + movieFinalTitle + " "+ yearNum +".html"},
        //{ html: "oxtorrent(法)", href: "https://www.oxtorrent.gs/recherche/" + movieFinalTitle + " "+ yearNum },
        { html: "torrenthaja(韩)", href: "https://torrenthaja.com/bbs/search.php?search_flag=search&stx=" + movieFinalTitle },
        //{ html: "ilcorsaronero(意)", href: "https://ilcorsaronero.link/argh.php?search=" + movieFinalTitle + " "+ yearNum },
        { html: "RARBG(盗)", href: "https://rargb.to/search/?search=" + movieFinalTitle },
        //{ html: "爱笑聚*", href: "https://www.axjbd.com/app-thread-run?keywords=" + IMDBID +"&app=search"},
        { html: "不太灵", href: "https://www.butai0.club/search?sb=" + IMDBID },
        { html: "片源网*", href: "http://pianyuan.org/search?q=" + keyword1 +" "+ yearNum },
        { html: "BTSOW", href: "http://btsow.motorcycles/search/" + movieSimpleTitle },//主站btsow.com
        { html: "BT之家1lou", href: "https://www.1lou.me/search-" + movieSimpleTitle + ".htm" },//主站www.8btbtt.com
        { html: "音范丝", href: "http://www.yinfans.me/?s=" + keyword1 },
        //{ html: "嘎嘎影视", href: "http://www.gagays.xyz/movie/search?req%5Bkw%5D=" + movieSimpleTitle },///已经退休 纪念
        //{ html: "磁力猫", href: "https://clm302.buzz/search-" + movieSimpleTitle +" "+ yearNum +"-0-0-1.html"},//https://磁力猫.com/发布页
        //{ html: "BT1207", href: "https://bt1207ro.top/search?keyword=" + keyword3 },
        //{ html: "SkrBT", href: "https://skrbtqo.top/search?keyword=" + movieSimpleTitle},
        { html: "盘搜搜", href: "https://pansou.cc/s/" + keyword1 +"-1.html"},
        { html: "学霸盘", href: "https://www.xuebapan.com/s/" + keyword1 +"-1.html"},
        //{ html: "ED2000", href: "https://www.ed2000k.com/FileList.asp"},
        { html: "FIX字幕侠", href: "https://www.zimuxia.cn/?s=" + keyword1 },
        { html: "VK(俄在线)", href: "https://vk.com/video?q=" + movieFinalTitle + " "+ yearNum },
        { html: "动漫花园(镜)", href: "https://www.dongmanhuayuan.com/search/" + movieSimpleTitle + "/"},
        { html: "漫喵动漫", href: "http://5.comicat.115000.xyz/search.php?keyword=" + movieSimpleTitle},
        { html: "@无姓", href: "https://weibo.com/u/5226287147"},
    ];

    var Str_links = [
        { html: "SubHD", href: "https://subhd.tv/search/" + keyword1 },
        { html: "字幕库", href: "http://zimuku.org/search?q=" + keyword1 +" "+ yearNum },
        { html: "R3字幕网", href: "https://r3sub.com/search.php?s=" + keyword1 },
        { html: "伪射手", href: "https://assrt.net/sub/?searchword=" + keyword1 },
        { html: "点点字幕", href: "http://www.ddzimu.com/download/xslist.php?key=" + keyword1 },
        { html: "A4K字幕", href: "https://www.a4k.net/search?term=" + keyword1 },
        { html: "opensub", href: "https://www.opensubtitles.org/zh/search/imdbid-111161/sublanguageid-chi/moviename-" + mTeOthername},
        { html: "Subscene", href: "https://subscene.com/subtitles/title?q=" + movieFinalTitle + "&l="},
        { html: "YIFY Subtitles", href: "https://yifysubtitles.org/movie-imdb/" + IMDBID },

    ];

    var Info_links = [
        { html: "IMDb", href: "https://www.imdb.com/title/" + IMDBID + "/" },
        { html: "TMDB", href: "https://www.themoviedb.org/search?query=" + keyword1 },
        { html: "TVDB", href: "https://thetvdb.com/search?query=" + IMDBID },
        { html: "Reelgood", href: "https://reelgood.com/search?q=" + movieFinalTitle},
        { html: "letterboxd", href: "https://letterboxd.com/search/" + IMDBID +"/"},
        { html: "Blu-ray", href: "https://www.blu-ray.com/search/?quicksearch=1&quicksearch_country=US&quicksearch_keyword=" + movieFinalTitle},
        //{ html: "时光网", href: "http://film.mtime.com/search/movies/movies?q=" + keyword1 +"&suggestType=0"},



    ];

    var Book_links = [
        //{ html: "Z-Library", href: "},
        { html: "Library Genesis", href: "https://libgen.torrentbay.net/search.php?req=" + keyword1},
        { html: "盘搜搜", href: "http://www.pansoso.org/zh/" + keyword1 },
        { html: "BTSOW", href: "http://btsow.bond/search/" + keyword1 },//主站btsow.com

    ];

    var link = $("<div>").append(
        $("<span>").attr("class", "pl").html("传送链接: ")
    );


    switch(location.host){
        case "movie.douban.com":
            appendLinks(Movie_links, link);

            link.append('<br>')
                .append('<span class="pl">字幕链接: </span>');
            appendLinks(Str_links, link);
            link.append('<br>')
                .append('<span class="pl">资料链接: </span>');
            appendLinks(Info_links, link);
            break;


        case "book.douban.com":
            appendLinks(Book_links, link);
            break;
    }

    $('#info').append(link);


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
    //资源名称
    $("div#info").append(`<span class=\"pl\">资源名称: </span>${ZY_links}`);


}
run()