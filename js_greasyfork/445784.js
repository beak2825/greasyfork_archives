// ==UserScript==
// @name         【自用】EROGAMESCAPE

// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  批评空间添加bangumi、 2d fun和百度的跳转
// @author       myself
// @match        https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*game.php?game*
// @match        https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*
// @match        https://bbs.9shenmi.com/index.php*
// @match        https://bbs.zdfx.net/search.php?mod=forum&adv=yes*
// @match        https://level-plus.net/search.php*
// @match        https://galge.fun/subjects/search?keyword=*
// @match        https://bgm.tv/subject_search/*
// @match        https://zodgame.xyz/search.php?mod=forum&adv=yes*
// @match        https://www.ggbases.com/search*
// @match        https://vndb.org/v*
// @grant        GM_openInTab
// @icon         https://inews.gtimg.com/newsapp_bt/0/12771684233/1000
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445784/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91EROGAMESCAPE.user.js
// @updateURL https://update.greasyfork.org/scripts/445784/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91EROGAMESCAPE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function pad(num, cover) {
        return String("0".repeat(cover) + num).slice(-cover);
    }
    var date = new Date();
    var year = date.getFullYear();
    var month =date.getMonth() + 1;

    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }

    function clickUrl(index){
        let urlList= document.querySelectorAll(index)
        for(let i =0; i< urlList.length;i++){
            GM_openInTab(urlList[i].href,true)
        }
    }

    function getName(url){
        return decodeURI(url.split('#')[1].split('=')[1]);
    }


    if(location.href.indexOf('erogamescape')!=-1){
        if(location.href.indexOf('kensaku.php?category=game&word_category=name&word=')!=-1 && location.href.indexOf('vndb')!=-1){
            if(document.querySelector("tbody")!=null){
                window.location.href = document.querySelector("a.tooltip").href
            }
        }
        if(document.querySelector("header")!=null)
            $("#container > header").after('<br><br><br><br>')
        else
            $('#header').after('<br><br><br><br>')
        $('#title > h1').append(`<br><a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_avg.php?count=200">統計表(平均値順)</a>
        &nbsp;&nbsp;<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_median.php?count=200">統計表(中央値順)</a><br>`).append
        (`<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_year_median.php?count=50&year=${year}">${year}年統計表(中央値順)</a>`).append
        (` &nbsp;&nbsp;&nbsp;<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_year_median.php?count=50&year=${year-1}">${year-1}年</a><br>`).append
        (`<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_hatubaibi_month.php?year=${year}&month=${pad(month,2)}"> ${year}年${month}月発売ゲーム</a>`).append
        (`&nbsp;&nbsp;&nbsp;<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_hatubaibi_month.php?year=${year2}&month=${pad(month2,2)}">${year2}年${month2}月</a>`)


        if(location.href.indexOf('game.php?game')!=-1){
            let name = document.querySelector("#game_title > a").innerText
            $('#soft-title').append(`<br>|<a href="https://bgm.tv/subject_search/${name}?cat=4#EROGAMESCAPE"
                                  class='info' target="_blank" style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            Bangumi</a>|`)
            $('#soft-title').append(`<a href="https://galge.fun/subjects/search?keyword=${name}#EROGAMESCAPE"
                                 class='info' target="_blank" style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            2dfun</a>|`)
            $('#soft-title').append(`<a href="https://bbs.9shenmi.com/index.php#search=${name}#EROGAMESCAPE"
                                 class='resource' target="_blank"  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            緋月</a>|`)
            $('#soft-title').append(`<a href="https://bbs.acgn.at/search/?kw=${name}&fid=0"
                                 class='resource' target="_blank"  style="text-decoration:none;display:inline-block;width:110px;text-align:center;">
            Kdays</a>|<br>`)

            $('#soft-title').append(`|<a href="https://tieba.baidu.com/f/search/res?qw=${name}&sm=2&cf=1&ie=utf-8"
                                 class='info' target="_blank"  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            貼吧 </a>|`)
            $('#soft-title').append(`<a href="https://www.douban.com/search?source=suggest&q=${name}"
                                 class='info' target="_blank"  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            豆瓣</a>|`)
            $('#soft-title').append(`<a href="https://bbs.zdfx.net/search.php?mod=forum&adv=yes#search=${name}#EROGAMESCAPE"
                                 target="_blank"  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            終点</a>|`)
            $('#soft-title').append(`<a href="https://level-plus.net/search.php#search=${name}#EROGAMESCAPE"
                                 target="_blank" class='resource' style="text-decoration:none;display:inline-block;width:110px;text-align:center;">
            南加</a>|<br>`)

            $('#soft-title').append(`|<a href="https://www.baidu.com/s?wd=${name}"
                                 target="_blank" style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            百度</a>|`)
            $('#soft-title').append(`<a href="https://www.google.com.tw/search?q=${name}"
                                 target="_blank"  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            谷歌       </a>|`)
            $('#soft-title').append(`<a href="https://search.bilibili.com/all?keyword=${name}"
                                target="_blank" class='info'  style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            bilibili       </a>|`)
            $('#soft-title').append(`<a href="https://vndb.org/v?sq=${name}"
                                  target="_blank" class='info' style="text-decoration:none;display:inline-block;width:110px;text-align:center;">
            VNDB      </a>|<br>`)
            $('#soft-title').append(`|<a href="https://zodgame.xyz/search.php?mod=forum&adv=yes#search=${name}#EROGAMESCAPE"
                                  target="_blank" style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            zod      </a>`)
            $('#soft-title').append(`|<a href="https://www.dlgal.com/search.so?p=0&title=${name}&&advanced=0"
                                  target="_blank" class='resource' style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            ggbase</a>|`)
            $('#soft-title').append(`<a href="https://sukebei.nyaa.si/?f=0&c=1_3&q=${name}&s=seeders&o=desc"
                                  target="_blank" class='resource' style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            Nyaa</a>|`)
            $('#soft-title').append(`<a href="https://store.steampowered.com/search/?sort_by=_ASC&term=${name}"
                                  target="_blank" class='download' style="text-decoration:none;display:inline-block;width:110px;text-align:center;">
            Steam      </a>|<br>`)
            $('#soft-title').append(`|<a target="_blank" class='info-button' style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            信息</a>|`)
            $('#soft-title').append(`<a target="_blank" class='resource-button' style="text-decoration:none;display:inline-block;width:90px;text-align:center;">
            下載</a>|`)
            document.querySelector("#soft-title > a.info-button").onclick=()=>{
                clickUrl(".info")
            }
            document.querySelector("#soft-title > a.resource-button").onclick=()=>{
                clickUrl(".resource")
            }


        }
        //拔作按时间顺序  //SQL检索
        if(location.href=='https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/'){
            $("#title > a").after(`<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=830">昇天率と平均点</a>`)
                .after(`<a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=2607">発売年別順</a>&nbsp;&nbsp;`)
                .after(`<br><a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=2743">評価順に表示</a>&nbsp;&nbsp;`)
            $('#nav_2 > div > ul:nth-child(3)').append(`<li><a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=1102">お好みおかず検索</a></li>`)
            $('#nav_2 > div > ul:nth-child(3)').append(`<li><a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=6">評価の多いソフト</a></li>`)
            $('#nav_2 > div > ul:nth-child(3)').append(`<li><a target='_blank' href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/usersql_exec.php?sql_id=102">最近話題のゲームベスト50</a></li>`)
        }

        if(location.href == 'https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/'){
            $('#nav_2 > div > h3:nth-child(9)').append(`<a href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_avg.php">統計表(平均値順)</a><br>`)
            $('#nav_2 > div > h3:nth-child(9)').append(`<a href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_year_median.php?year=${year}">${year}年統計表(中央値順)</a>`)
            $('#nav_2 > div > h3:nth-child(9)').append(`<a href="https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/toukei_hatubaibi_month.php?year=${year}&month=${pad(month,2)}"> ${year}年${month}月に発売されたゲーム</a>`)
        }

    }


    //绯月自动搜索
    if(location.href.indexOf('bbs.9shenmi.com/index.php')!=-1&& location.href.indexOf('EROGAMESCAPE')!=-1){
        document.querySelector("#alldiv > div:nth-child(3) > div:nth-child(1) > div.k_ale > form > input:nth-child(8)").value=getName(location.href)
        document.querySelector("#alldiv > div:nth-child(3) > div:nth-child(1) > div.k_ale > form > input.k_butt.k_blk.k_ansma").click()
        setTimeout(window.close(),1000);
    }

    //终点论坛自动搜索
    if(location.href.indexOf('bbs.zdfx.net/search.php?mod=forum&adv=yes')!=-1&& location.href.indexOf('EROGAMESCAPE')!=-1){
        document.querySelector("#srchtxt_1").value=getName(location.href)
        document.querySelector("#orderby1 > option:nth-child(2)").selected=true
        document.querySelector("#ct > div > div > div.bm_c > form > table > tbody > tr:nth-child(8) > td > button").click()
    }

    //南+自动搜索
    if(location.href.indexOf('https://level-plus.net/search.php')!=-1&& location.href.indexOf('EROGAMESCAPE')!=-1){
        document.querySelector("#main > form > div.t > table > tbody > tr:nth-child(3) > th:nth-child(1) > input.input").value=getName(location.href)
        document.querySelector("#main > form > div:nth-child(3) > input:nth-child(1)").click()
    }

    //zodgame自动搜索
    if(location.href.indexOf('https://zodgame.xyz/search.php?mod=forum&adv=yes')!=-1&& location.href.indexOf('EROGAMESCAPE')!=-1){
        document.querySelector("#srchtxt_1").value=getName(location.href)
        document.querySelector("#orderby1 > option:nth-child(2)").selected=true
        document.querySelector("#ct > div > div > div.bm_c > form > table > tbody > tr:nth-child(8) > td > button").click()
    }

    //2dfun自动点击搜索结果
    if(location.href.indexOf('galge.fun/subjects/search?keyword=')!=-1 && location.href.indexOf('EROGAMESCAPE')!=-1){
        if(document.querySelector("#subjects > li")!=null){
            location.href=document.querySelector("#subjects > li > div > h4 > a").href
        }
    }

    //Bangumi自动点击搜索结果
    if(location.href.indexOf('bgm.tv/subject_search/')!=-1 && location.href.indexOf('EROGAMESCAPE')!=-1){
        if(document.querySelector("#browserItemList > li")!=null){
            location.href=document.querySelector("#browserItemList > li").querySelector('h3>a').href
        }
    }

    //VNDB添加跳转链接
    if(location.href.indexOf('https://vndb.org/v')!=-1){
        let txt = document.querySelector(".alttitle").innerText;
        document.querySelector(".alttitle").innerText=''
        $(".alttitle").append(`
     <a target='_blank'
     href='https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/kensaku.php?category=game&word_category=name&word=${txt}&mode=normal#from vndb'>
     ${txt}<a/>`)
    }



})();