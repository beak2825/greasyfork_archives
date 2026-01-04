// ==UserScript==
// @name         OneJAVOneWeb list
// @name:zh-CN   OneJAVOneWeb list自用版
// @namespace    https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list
// @version      2023.1029.1800
// @description  一个插件畅览N个JAV网站，涵盖车牌信息、演员信息、磁力种子、片花、在线观看、资讯、大缩略图等
// @author       匿名
// @license      GPL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAQCEeRdzAAAC1klEQVR4nK1V/U+NYRg+/4kxHylUxsx8bD4yH7PxAxmzMfO9qemkcyo5NX1wyEhD6WSpOSXmGG1+UBZJ0rA5FErIGbIoSowu9/1e7znvOfNbvNuznef+uO7rvp/reY4N9f7VWFLQjbh0YHrG6JbmKoZg2ZBQEEB0Kh3xowTUNVkwBMtmoMc6gakOc6Uhgq3+jkljTNCmMVNkxadbMWqTfBti9gEOL/D4NdDaCTS/AFYeAaaZBZYeApqeA2tPEESTL9wFqu8RUGOWHQYedAEpVQI4yQ5U3kHEt70MxhjihNXFFtqKbsCIVabtAdq02MQUYE8F9/k+AdSA5VLBc4vGknpg9gG2sDgPGPpB+/WHnFOUnQz123wGGJsMHK3jfuMpAdQZaOX1J2nc6WGSzm3TaYu1v4ctqi+zhjbXJWBMEnC1DRj+CSw4aALqHLeUMCj5vLQr+yhhk3sF+PUb6JAWv34HFuaSZWIRYytuAxP2Ak+l2LN3xjgswK2lfwNebgUCfUBpA30bigk4NxvoHwIa24FZWcC3YaC2xWBvAW47awFqkp6yVm7qkGKmL6OGhfRkH3UDXR+BdSbbrFojj4DKaIfHAtSZzs8BBqTNm09EDpX0nWvkDHV5m8UvLN3X6DNlZQHuKrcAx8tcEiVgZCRSTtqiHpay1ANRf9sr4EO/KMNlaJSyUUZJppZ2l1MKTi/32raKfVDk8+YTZ6YERCKhr8HPsQk5m1xqXp8yU4c6k3HJbE+/FW5Kw9dm7RVwkWj0yyBtx+o4BgNQgXoH6Ah8pqg14X4nT3JONqVRWBem01Qy7emjTfUaYhhsTb88H4NnZALdvSLmt7x+0WEqcFZzRAr48j1ZzssJPR42I9lexcpq1Nugz9iqQrmSbj4Gup+5H1hzXBi7GKOFEvLlhhVbr44BGGsyMClbT5SDWgzuNSn8ydKluWoLe+oiH9h/WdHBB/Y//wX8ASlYtkPZ5uteAAAAAElFTkSuQmCC
// @include      *://*.141jav.com/*
// @include      *://*.141ppv.com/*
// @include      *://*.g64w.com/*
// @include      *://*.u65w.com/*
// @include      *://*.h68g.com/*
// @include      *://*.c70j.com/*
// @include      *://*.f61m.com/*
// @include      *://*.g60y.com/*
// @include      *://*.jav321.com/*
// @include      *://*.javlib.com/*
// @include      *://*.javlibrary.com/*
// @include      *://*.n53i.com/*
// @include      *://*.onejav.com/*
// @include      *://*/cn/?v=jav*
// @include      *://*/en/?v=jav*
// @include      *://*/ja/?v=jav*
// @include      *://*/jp.page/movie?id=*
// @include      *://*/tw/?v=jav*
// @include      *://*/tw/movie/jav*
// @include      *://*/web/video?id=*
//
// 7mmtv
// @include      *://7mm*.*/*
// @include      *://aa1141.com/*
// @include      *://aa1142.com/*
// @exclude      https://7mm*/*/*search/*/*/1.html
// @exclude      https://aa*.com/*/*search/*/*/1.html
//
// 18AV視頻站 https://aabb1803.com/
// @include      *://18h.tv/*
// @include      *://a2a*/*
// @include      *://maa18*.com/*/chinese_content/*/*.html
// @include      *://maa18*.com/*/uncensored_content/*/*.html
// @match        *://maa18*.com/*/fc_search/all/*/1.html
// @exclude      https://maa18*.com/zh/*/1.html
// @exclude      https://maa18*.com/zh/*/all/*-*-*.html
// @exclude      https://maa18*.com/zh/*/all/index.html
// @exclude      https://maa18*.com/zh/*/list/index.html
//
// @include      *://9sex.tv/web/video?id=*
// @include      *://9sex.tv/web/skip/video?id=*
// @include      *://*/web/search?page=1&keyWord=*
// @include      *://airav*/*/playon.aspx*
// @include      *://freejavbt.com/*
// @include      *://freejavbt.xyz/*
// @include      *://hpav.tv/*
// @include      *://hpjav.tv/*
// @include      *://hdouban.com/moviedetail/*
// @include      *://byym21.com/moviedetail/*
// @include      *://jable.tv/*
// @include      *://jav.place/video/*
// @include      *://javbooks.com/content*censored/*.htm
// @include      *://javbooks.com/serch*
// @include      *://javmenu.com/*/*
// @include      *://jav-for.me/*.html
// @include      *://jav-for.me/?do=search*
// @include      *://www.mgstage.com/search*
// @include      *://onejav.com/torrent/*
// @include      *://paycalling.com/web/video?id=*
// @include      *://sextb.net/*
// @include      *://www.jav321.com/video/*
// @include      /^.*(avmoo|avsox)\..*$/
// @include      *://javdb*.com/v/*
// @include      *://javdb*.com/search?q=*
// @include      *://javdb*.com/actors/*
// @exclude      *://javdb*.com/actors/*?sort_type=*&vft=*
// @exclude      *://javdb*.com/actors/*?page=*&sort_type=*&vft=*
// @exclude      *://javdb*.com/actors/*?page=*&sort_type=*&t=*
// @exclude      *://javdb*.com/actors/*?t=*&sort_type=*
// @include      /^.*(jav|bus|dmm|see|cdn|fan){2}\..*$/
// @include      /^.*(hdouban)[0-9]*\..*$/
// @exclude	     *://onejav.com/search/*
// @exclude      *://javmenu.com/*/search?wd=*-*
// @exclude      *://javmenu.com/*/search?wd=*_*
// @exclude      /^https?:\/\/javmenu.com\/(?:zh-Hant|zh|en|ja|ko|de|es|fr|ru).*$\/FC2
// @exclude      /^https?:\/\/javmenu.com\/(?:zh-Hant|zh|en|ja|ko|de|es|fr|ru).*$\/censored
// @exclude      /^https?:\/\/javmenu.com\/(?:zh-Hant|zh|en|ja|ko|de|es|fr|ru).*$\/uncensored
// @exclude      /^https?:\/\/javmenu.com\/(?:zh-Hant|zh|en|ja|ko|de|es|fr|ru).*$\/western
// @exclude      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}(?:\.[A-Za-z0-9]+)?\/(?:forum|actresses|uncensored|genre|series|studio|page){1,}\/?\S*$/
// @exclude      https://javcv.com/search*
// @exclude      https://*.jd.com/*
// @match      *://*.141jav.com/*
// @match      *://*.141ppv.com/*
// @match      *://*.f61m.com/*
// @match      *://*.g60y.com/*
// @match      *://*.jav321.com/*
// @match      *://*.javlibrary.com/*
// @match      *://*.n53i.com/*
// @match      *://*.onejav.com/*
// @match      *://*/cn/?v=jav*
// @match      *://*/en/?v=jav*
// @match      *://*/ja/?v=jav*
// @match      *://*/jp.page/movie?id=*
// @match      *://*/tw/?v=jav*
// @match      *://*/tw/movie/jav*
// @match      *://*/web/video?id=*
// @match      *://*javlib.com/*
// @match      *://7mm*.*/*
// @match      *://9sex.tv/web/video?id=*
// @match      *://9sex.tv/web/skip/video?id=*
// @match      *://airav*/*/playon.aspx*
// @match      *://airav.fun/*/playon.aspx*
// @match      *://airav.fun/*/playon.aspx?hid=*
// @match      *://avmoo.cfd/*/movie/*
// @match      *://avsox.click/*/movie/*
// @match      *://db.msin.jp/jp.page/movie?id=*
// @match      *://db.msin.jp/page/movie?id=*
// @match      *://freejavbt.com/*
// @match      *://freejavbt.xyz/*
// @match      *://hpav.tv/*
// @match      *://hpjav.tv/*
// @match      *://hpjav.tv/ja/*
// @match      *://hdouban.com/moviedetail/*
// @match      *://byym21.com/moviedetail/*
// @match      *://jable.tv/*
// @match      *://jable.tv/videos/*
// @match      *://jav.place/video/*
// @match      *://jav.place/en/video/*
// @match      *://jav4.land/*/movie/jav*.html
// @match      *://jav4.dog/*/movie/jav*.html
//
// javbooks aabb1802.com
// @match      *://javbooks.com/content*censored/*.htm
// @match      *://jmvbt.com/content*censored/*.htm
// @match      *://*.com/content*censored/*.htm
//
// 98
// @match        https://www.sehuatang.net/thread-*
// @match        https://www.sehuatang.net/forum.php?mod=viewthread&tid=*
// @match        https://*/thread-*
// @match        https://*/forum.php?mod=viewthread&tid=*
//
// javhoo.org
// @match        https://www.javhoo.org/av/*
// @match        https://www.javhoo.org/search/*
// @match      *://javdb*.com/v/*
// @match      *://javdb*.com/search?q=*
// @match      *://javmenu.com/*/*
// @match      *://jav-for.me/*.html
// @match      *://onejav.com/torrent/*
// @match      *://paycalling.com/web/video?id=*
// @match      *://sextb.net/*
// @match      *://*.airav.wiki/video/*
// @match      *://www.141jav.com/torrent/*
// @match      *://www.buscdn.*/*
// @match      *://www.busdmm.*/*
// @match      *://www.busjav.*/*
// @match      *://www.cdnbus.*/*
// @match      *://www.jav321.com/video/*
// @match      *://www.javbus.com/*
// @match      *://www.javbus.*/*
// @match      *://www.javsee.*/*
// @match      *://www.seejav.*/*
// @match      *://fh.fanhaoben.bar/*/rsearch/?query=*
// @match      *://*/Search?s=*
// @match      *://projectjav.com/?searchTerm=*
// @match      *://www.r18.com/common/search/searchword=*
// @match      *://*.javfun.me/search/*
// @match      *://bejav.net/search/*
// @match      *://javhd.today/search/video/?s=*
// @match      *://javabc.com/search/*
// @match      *://svjav.com/search/*
// @match      *://*/search*
// @match      *://*/?s=*
// @match      *://*/*/main/search*

// @match      *://*/thread-*-1-*.html
// @match      *://javstore.net/*-pn.html
// @match      *://btsow.*/magnet/detail/hash/*
// @match      *://www.sexbartv.info/*
// @match      *://xslist.org/*/model/*.html
// @match      *://*/forum*
// @match      *://javcv.com/movie/*
// @match      *://javcv.com/fc2/movie/*

// @connect      pics.dmm.co.jp
// @connect      jp.netcdn.space
// @grant        window.close
// @grant        window.onurlchange
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449158/OneJAVOneWeb%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/449158/OneJAVOneWeb%20list.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.clear();
    console.time('JAV');
    /* Basic */
    class JAV {
        constructor(i) {
            [this.bango, this.fanHao, this.xiaxian, this.buwei, this.one, this.xiao] = (() => {
                const o = i.trim().replace(/ +/, '-');
                let t = o.match(/FC2-?P?P?V?-?_?(\d+)/i);
                if ((t = o.match(/FC2-?P?P?V?-?_?(\d+)/i))) {
                    return [`${t[1]}`, `${t[1]}`];
                }
                else if ((t = o.match(/([a-zA-Z]{2,12})-?(\d{2,12})/i))) {
                    return [
                        `${t[1].toUpperCase()}${t[2]}`,
                        `${t[1].toUpperCase()}-${t[2]}`,
                        `${t[1].toUpperCase()}_${t[2]}`,
                        `${t[1].toUpperCase()}00${t[2]}`,
                        `${t[1].toLowerCase().charAt(0)}`,
                        `${t[1].toLowerCase()}-${t[2]}`
                        //`${t[1].toUpperCase()}(Array(5).join('0') + ${t[2]}).slice(-5)`
                        //`${t[1].toUpperCase()}('0000'+${t[2]}).slice(-5)`
                        // 需要5位的有前置0的数据，那么首先不管当前数字是多少位的，都先补上4个前置0，然后再截取这个字符串最后的5位，那么获取到的就是需要的数据：
                        // return ('0000'+num).slice(-5);
                        // 改不好，暂时补位两个00，适配dmm
                    ];
                }
                else {
                    console.info(`JAV:${i}处理失败，反馈给作者修复bug`);
                    return [i, i, i, i, i, i];
                }

            })();

            this.data = {
                车牌信息: { zhushi: '车牌信息类', name: '车牌', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                javlibarary: {
                    zhushi: 'JavLibrary 是一个线上日本成人影片图书馆。',
                    name: 'JAVLibrary', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.u65w.com/favicon.ico',
                    origin: 'https://www.javlibrary.com',
                    uri: `/cn/vl_searchbyid.php?keyword=${this.fanHao}`
                },
                freejavbt: {
                    zhushi: 'JAV目錄大全| Free JAV BT，這是世界上最齊全的AV資料庫，成人影片資料庫及磁鏈分享',
                    name: 'FreeJavBt<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://freejavbt.com/assets/images/logo.png',
                    origin: 'https://freejavbt.com',
                    uri: `/search?wd=${this.fanHao}`
                },
                javbus: {
                    zhushi: 'JavBus - AV磁力連結分享 - 日本成人影片資料庫',
                    name: 'JavBus', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.javbus.com/favicon.ico',
                    origin: 'https://www.javbus.com',
                    uri: `/${this.fanHao}`
                },
                javdb: {
                    zhushi: 'JavDB 成人影片數據庫',
                    name: 'JavDB<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://javdb008.com/favicon.ico',
                    origin: 'https://javdb008.com',
                    uri: `/search?q=${this.xiaxian}`
                },
                jav321: {
                    zhushi: 'Free JAV Torrents',
                    name: 'JAV321', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://www.jav321.com/favicon.ico',
                    origin: 'https://www.jav321.com',
                    uri: `/?bango=${this.fanHao}`
                },
                mgstage: {
                    zhushi: 'mgstage',
                    name: 'mgstage', bgcolor: '', color: 'red',
                    ico: 'https://www.mgstage.com/favicon.ico',
                    origin: 'https://www.mgstage.com',
                    uri: `/search/cSearch.php?search_word=${this.fanHao}`
                },
                // 此战代码错误 暂时取消 hdouban: {zhushi: 'hdouban',name: 'hdouban直<sup>fc2</sup>',bgcolor: '',color: 'green',ico: 'https://byym21.com/favicon.ico', origin: 'https://byym21.com', uri: `/search?keywords=${this.fanHao}&ty=movie&page=1&pageSize=12`},
                javplace: {
                    zhushi: '磁力站点',
                    name: 'javplace', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://jav.place/logo.png',
                    origin: 'https://jav.place',
                    uri: `/video/${this.fanHao}`
                },
                // 【2022-10-17新增】最新免翻墙域名：https://kk4583.com/  https://aabb1803.com/
                javbooks: {
                    zhushi: 'javbooks',
                    name: 'javbooks', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://jbk009.com/logo.png',
                    origin: 'https://jbk009.com',
                    uri: `/serch_censored.htm?skey=${this.fanHao}`
                },
                // javland https://www.ebay.com/usr/javlandnet
                javland: {
                    zhushi: '磁力站点',
                    name: 'javland', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://jav4.land/favicon.ico',
                    origin: 'https://jav4.land',
                    uri: `/tw/id_search.php?keys=${this.fanHao}`
                },
                javmenu: {
                    zhushi: 'javmenu 在线全片 片花 种子下载',
                    name: 'javmenu<sup>fc2</sup><sub>∞</sub>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://javmenu.com/assets/images/logo.png',
                    origin: 'https://javmenu.com',
                    uri: `/zh/search?wd=${this.bango}`
                },
                javhoo: {
                    zhushi: 'javhoo  - 日本成人影片資料庫',
                    name: 'javhoo<sup>fc2</sup><sub>∞</sub>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.javhoo.org/favicon.ico',
                    origin: 'https://www.javhoo.org',
                    uri: `/search/${this.fanHao}`
                },
                演员信息: { zhushi: '演员信息类，打开后自行在地址栏修改想要搜的演员', name: '演员', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                Xslist: {
                    zhushi: 'Xslist.org - 健康的宅男偶像專題網站',
                    name: 'Xslist <sub>∞</sub>', bgcolor: '', color: 'red',
                    ico: 'https://xslist.org/favicon.ico',
                    origin: 'https://xslist.org',
                    uri: `/search?query=${this.fanHao}&lg=tw`
                },
                wikipedia: {
                    zhushi: 'wikipedia维基百科',
                    name: 'wikipedia', bgcolor: '', color: 'red',
                    ico: 'https://zh.m.wikipedia.org/favicon.ico',
                    origin: 'https://zh.m.wikipedia.org',
                    uri: `/zh-cn/%E4%B8%89%E4%B8%8A%E6%82%A0%E4%BA%9A`
                },
                airav: {
                    zhushi: 'airav 中文信息 预览10分钟',
                    name: 'airav', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://airav.fun/LOGO.ico',
                    origin: 'https://airav.fun',
                    uri: `/cn/searchresults.aspx?Search=%E4%B8%89%E4%B8%8A%E6%82%A0%E4%BA%9A`
                },
                msin: {
                    zhushi: 'msin 演员搜索 请修改地址栏后面的演员名',
                    name: 'msin演员', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://db.msin.jp/favicon.ico',
                    origin: 'https://db.msin.jp',
                    uri: `/jp.search/actress?str=%E6%B3%A2%E5%A4%9A%E9%87%8E%E7%B5%90%E8%A1%A3`
                },
                msin2: {
                    zhushi: 'msin 番号搜索',
                    name: 'msin番号', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://db.msin.jp/favicon.ico',
                    origin: 'https://db.msin.jp',
                    uri: `/jp.search/movie?str=${this.fanHao}`
                },
                sougouwiki: {
                    zhushi: 'sougouwiki 番号演员搜索',
                    name: 'sougouwiki', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'http://sougouwiki.com/favicon.ico',
                    origin: 'http://sougouwiki.com',
                    uri: `/search?keywords=${this.fanHao}`
                },
                第二排8: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                第二排9: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                第二排10: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                演员第一排10: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                演员第一排11: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                磁力种子: { zhushi: '磁力种子类', name: '磁力', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                // https://tellme.pw/btsow
                btsow: {
                    zhushi: 'btsow磁力链搜索。',
                    name: 'btsow', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://btsow.motorcycles/app/bts/View/img/favicon.ico',
                    origin: 'https://btsow.motorcycles',
                    uri: `/search/${this.fanHao}`
                },
                onejav: {
                    zhushi: 'Free JAV Torrents种子站',
                    name: 'OneJAV<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://onejav.com/static/img/onejav.5468a5a7d373.png',
                    origin: 'https://onejav.com',
                    uri: `/search/${this.bango}`
                },
                // https://tellme.pw/avmoo
                avmoo: {
                    zhushi: 'AVMOO',
                    name: 'AVMOO', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://avmoo.cfd/app/jav/View/img/favicon.ico',
                    origin: 'https://avmoo.cfd',
                    uri: `/cn/search/${this.fanHao}`
                },
                // https://tellme.pw/avsox
                AVSOX: {
                    zhushi: 'AVSOX',
                    name: 'AVSOX<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://avsox.click/app/javu/View/img/favicon.ico',
                    origin: 'https://avsox.click',
                    uri: `/cn/search/${this.fanHao}`
                },
                // 发布页 https://skrbtfabu.top/ https://skrbtdo.xyz
                skrbtdo: {
                    zhushi: '磁力站点',
                    name: 'skrbtdo', bgcolor: '', color: 'green',
                    ico: 'https://skrbtka.top/favicon.ico',
                    origin: 'https://skrbtka.top',
                    uri: `/search?keyword=${this.fanHao}`
                },
                sukebei: {
                    zhushi: '磁力站点',
                    name: 'sukebei', bgcolor: '', color: 'red',
                    ico: 'https://sukebei.nyaa.si/favicon.ico',
                    origin: 'https://sukebei.nyaa.si',
                    uri: `/?f=0&c=0_0&q=${this.fanHao}`
                },

                tokyotosho: {
                    zhushi: '磁力站点',
                    name: 'tokyotosho', bgcolor: '', color: 'green',
                    ico: 'https://www.tokyotosho.info/favicon.ico',
                    origin: 'https://www.tokyotosho.info',
                    uri: `/search.php?terms=${this.fanHao}`
                },
                // https://sosomagnet.com/
                kitty: {
                    zhushi: '磁力站点',
                    name: 'kitty', bgcolor: '', color: 'red',
                    ico: 'https://www.torrentkitty.cam/favicon.ico',
                    origin: 'https://www.torrentkitty.cam',
                    uri: `/search/${this.fanHao}`
                },
                btdig: {
                    zhushi: '磁力站点',
                    name: 'btdig', bgcolor: '', color: 'red',
                    ico: 'http://en.btdig.com/resources/icons/icon.png',
                    origin: 'http://en.btdig.com',
                    uri: `/search?q=${this.fanHao}`
                },
                idope: {
                    zhushi: '磁力站点',
                    name: 'idope', bgcolor: '', color: 'red',
                    ico: 'https://idope.se/favicon.ico',
                    origin: 'https://idope.se',
                    uri: `/torrent-list/${this.fanHao}/`
                },
                u9a9: {
                    zhushi: '磁力站点',
                    name: 'u9a9', bgcolor: '', color: 'red',
                    ico: 'https://u9a9.com/favicon.ico',
                    origin: 'https://u9a9.com',
                    uri: `/?type=2&search=${this.fanHao}`
                },
                磁力第二排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                avmans: {
                    zhushi: '磁力站点 由于站点有的加-有的不加，可自行尝试',
                    name: 'avmans<sup>fc2</sup><sub>∞</sub>', bgcolor: '', color: 'green',
                    ico: 'https://gbsj.xyz/favicon.ico',
                    origin: 'https://gbsj.xyz',
                    uri: `/Single/${this.bango}`
                },
                yesjav: {
                    zhushi: '磁力站点',
                    name: 'yesjav', bgcolor: '', color: 'red',
                    ico: 'http://www.yesjav.info/favicon.ico',
                    origin: 'http://www.yesjav.info',
                    uri: `/search.asp?q=${this.fanHao}&`
                },
                jav141: {
                    zhushi: '磁力种子',
                    name: '141jav', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.141jav.com/static/img/141jav.5468a5a7d373.png',
                    origin: 'https://www.141jav.com',
                    uri: `/torrent/${this.bango}`
                },
                ppv141: {
                    zhushi: '磁力种子',
                    name: '141ppv<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.141ppv.com/static/img/141jav.5468a5a7d373.png',
                    origin: 'https://www.141ppv.com',
                    uri: `/torrent/${this.bango}`
                },
                zhongzisou: {
                    zhushi: '种子搜',
                    name: 'ZhongZiSou', bgcolor: '', color: 'green',
                    ico: 'https://www.zhongziso.com/favicon.ico',
                    origin: 'https://www.zhongziso.com',
                    uri: `/list/${this.fanHao}/1`
                },
                anidex: {
                    zhushi: '磁力种子',
                    name: 'anidex', bgcolor: '', color: 'green',
                    ico: 'https://anidex.info/favicon.ico',
                    origin: 'https://anidex.info',
                    uri: `/?q=${this.fanHao}`
                },
                javjunkies: {
                    zhushi: '磁力种子',
                    name: 'javjunkies', bgcolor: '', color: 'green',
                    ico: 'http://javjunkies.org/favicon.ico',
                    origin: 'http://javjunkies.org',
                    uri: `/main/search/${this.bango}`
                },
                projectjav: {
                    zhushi: '磁力种子',
                    name: 'projectjav<sup>fc2</sup><sub>∞</sub>', bgcolor: '', color: 'green',
                    ico: 'https://projectjav.com/favicon.ico',
                    origin: 'https://projectjav.com',
                    uri: `/?searchTerm=${this.fanHao}`
                },
                nextjav: {
                    zhushi: '磁力种子',
                    name: 'nextjav', bgcolor: '', color: 'green',
                    ico: 'https://nextjav.com/media/favicon.ico',
                    origin: 'https://nextjav.com',
                    uri: `/torrent/detail/${this.fanHao}`
                },
                ijavtorrent: {
                    zhushi: 'ijavtorrent 磁力种子 大缩略图',
                    name: 'ijavtorrent', bgcolor: '', color: 'green',
                    ico: 'https://ijavtorrent.com/ijavtorrentfavicons/favicon-16x16.png',
                    origin: 'https://ijavtorrent.com',
                    uri: `/?searchTerm=${this.fanHao}`
                },
                // https://jg0.net/av_info/zh/?i=ajvr00152&is=AJVR-152
                jg0: {
                    zhushi: 'jg0 磁力种子 大缩略图',
                    name: 'jg0', bgcolor: '', color: 'green',
                    ico: 'https://jg0.net/favicon.ico',
                    origin: 'https://jg0.net',
                    uri: `/av_info/zh/?i=${this.buwei}&is=${this.fanHao}`
                },
                磁力第三排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                // https://search.torrends.to/ADN-322
                torrends: {
                    zhushi: 'torrends。',
                    name: 'torrends', bgcolor: '', color: 'green',
                    ico: 'https://search.torrends.to/favicon.ico',
                    origin: 'https://search.torrends.to',
                    uri: `/${this.fanHao}`
                },
                // https://www.btmet.com/search.php?q=SSIS-408&o=0&l=&c=1  https://github.com/btmet/home
                btmet: {
                    zhushi: 'btmet。',
                    name: 'btmet', bgcolor: '', color: 'green',
                    ico: 'https://www.btmet.com/favicon.ico',
                    origin: 'https://www.btmet.com',
                    uri: `/search.php?q=${this.fanHao}&o=0&l=&c=1`
                },
                // https://cld61.buzz/search-adn-322-0-0-1.html 磁力帝.com https://xn--tfrs1ysrv.xyz/ 磁力帝.xyz
                // 1024bt121.buzz 磁力搜索.xyz https://1024bt121.buzz/main-search-kw-adn-322-1.html
                BT1024: {
                    zhushi: '磁力搜索。',
                    name: '1024bt', bgcolor: '', color: 'green',
                    ico: 'https://1024185.xyz/favicon.ico',
                    origin: 'https://1024185.xyz',
                    uri: `/main-search-kw-${this.fanHao}-1.html`
                },
                // https://bitcq.com/search?q=adn-322
                // https://clmmm.cc/  永久域名：https://clmmdz.cyou https://磁力.xyz https://磁力妹.com https://磁力妹妹.com https://clmma33.buzz/search-adn-322-0-0-1.html
                clmmm: {
                    zhushi: '磁力妹妹。',
                    name: 'clmmm', bgcolor: '', color: 'green',
                    ico: 'https://clmma60.buzz/favicon.ico',
                    origin: 'https://clmma60.buzz',
                    uri: `/search-${this.fanHao}-0-0-1.html`
                },
                // https://u3c3.site/?search2=fjeofakansriji&search=adn-322
                u3c3: {
                    zhushi: 'u3c3。',
                    name: 'u3c3', bgcolor: '', color: 'green',
                    ico: 'https://u3c3.site/favicon.ico',
                    origin: 'https://u3c3.site',
                    uri: `/?search2=fjeofakansriji&search=${this.fanHao}`
                },
                // https://tw.souka.me/q/no=Adn-442
                souka: {
                    zhushi: 'souka。',
                    name: 'souka', bgcolor: '', color: 'green',
                    ico: 'https://tw.souka.me/favicon.ico',
                    origin: 'https://tw.souka.me',
                    uri: `/q/no=${this.fanHao}`
                },
                // https://www.sehuatang.net/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=" + code + "&searchsubmit=true
                sehuatang: {
                    zhushi: 'sehuatang 高清中文字幕 ,98堂[原色花堂]。',
                    name: 'sehuatang', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.sehuatang.net/favicon.ico',
                    origin: 'https://www.sehuatang.net',
                    uri: `/search.php?mod=forum&srchtype=title&srhfid=&srhlocality=forum::index&srchtxt=${this.fanHao}&searchsubmit=true`
                },
                // https://duo6.buzz/search-adn-332-rel-1.html  磁力多 bt113.com
                cilido: {
                    zhushi: '磁力多 bt113.com。',
                    name: 'duo6', bgcolor: '', color: 'green',
                    ico: 'https://i.loli.net/2021/04/24/ViPGBY8jyD4Z2Ns.png',
                    origin: 'https://om.cilido.top',
                    uri: `/search-${this.fanHao}-rel-1.html`
                },
                // https://wuqianra.top/search?keyword=adn-322 吴签磁力
                wuqianra: {
                    zhushi: '吴签磁力 右侧有封面图',
                    name: 'wuqianra', bgcolor: '', color: 'green',
                    ico: 'https://wuqianhu.top/favicon.ico',
                    origin: 'https://wuqianhu.top',
                    uri: `/search?keyword=${this.fanHao}`
                },
                磁力第三排11: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                磁力第三排12: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                宣传片: { zhushi: '宣传片类', name: '片花', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/441120-javbus-javdb-library-trailer', uri: `` },
                //xrmoo: {
                //zhushi: '闲人吧DMM视频预览系统。',
                //name: 'xrmoo',bgcolor: '',color: 'green',
                //ico: 'http://dmm.xrmoo.com/favicon.ico',
                //origin: 'http://dmm.xrmoo.com',
                //uri: `/sindex.php?searchstr=${this.fanHao}`
                //},
                // https://faleno.jp/top/works/fsdss529/
                faleno: {
                    zhushi: 'faleno 发行商为faleno的车牌预览',
                    name: 'faleno<sup>发</sup>', bgcolor: '', color: 'red',
                    ico: 'https://faleno.jp/LOGO.ico',
                    origin: 'https://faleno.jp',
                    uri: `/top/works/${this.bango}/`
                },
                airav2: {
                    zhushi: 'airav简介及10分钟预览',
                    name: 'airav简介10', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://airav.fun/LOGO.ico',
                    origin: 'https://airav.fun',
                    uri: `/cn/searchresults.aspx?Search=${this.fanHao}&Type=0`
                },
                airavwiki: {
                    zhushi: 'airav.wiki简介及10分钟预览',
                    name: 'airavwiki', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://www.airav.wiki/static/favicon.ico?v=1',
                    origin: 'https://www.airav.wiki',
                    uri: `/video/${this.fanHao}	`
                },
                xhamster: {
                    zhushi: 'xhamster',
                    name: 'xhamster', bgcolor: '', color: 'green',
                    ico: 'https://static-lvlt.xhcdn.com/xh-desktop/images/favicon/favicon.ico?1',
                    origin: 'https://zh.xhamster.com',
                    uri: `/search/${this.fanHao}	`
                },
                paycalling: {
                    zhushi: 'paycalling 预览片花',
                    name: 'paycalling', bgcolor: '', color: 'green',
                    ico: 'https://paycalling.com/static/icon/logo.png',
                    origin: 'https://paycalling.com',
                    uri: `/web/search?page=1&keyWord=${this.fanHao}	`
                },
                r18: {
                    zhushi: 'The Largest Japanese Porn Site',
                    name: 'r18', bgcolor: '', color: 'red',
                    ico: 'https://www.r18.com/assets/image/my/logo-dmm-01.png',
                    origin: 'https://www.r18.com',
                    uri: `/common/search/searchword=${this.fanHao}/`
                },
                dmm: {
                    zhushi: 'dmm片花',
                    name: 'dmm<sup>日.代</sup>', bgcolor: '', color: 'red',
                    ico: 'https://www.dmm.co.jp/favicon.ico',
                    origin: 'https://www.dmm.co.jp',
                    uri: `/digital/videoa/-/detail/=/cid=${this.buwei}/`
                },
                avpreview: {
                    zhushi: 'avpreview 预览片花',
                    name: 'avpreview', bgcolor: '', color: 'green',
                    ico: 'https://avpreview.com/avpreviewfavicon.ico',
                    origin: 'https://avpreview.com',
                    uri: `/zh/video/${this.buwei}	`
                },
                // https://maxjav.com/?s=KMVR-801
                maxjav: {
                    zhushi: 'maxjav',
                    name: 'maxjav', bgcolor: '', color: 'green',
                    ico: 'https://maxjav.com/favicon.ico',
                    origin: 'https://maxjav.com',
                    uri: `/?s=${this.fanHao}`
                },
                // https://jav9999.com/search?q=SSIS-408
                jav9999: {
                    zhushi: 'jav9999',
                    name: 'jav9999', bgcolor: '', color: 'green',
                    ico: 'https://jav9999.com/static/images/icon.ico',
                    origin: 'https://jav9999.com',
                    uri: `/search?q=${this.fanHao}`
                },
                // https://api1.javspyl.tk/?ADN-322
                javspyl: {
                    zhushi: 'javspyl推荐片花',
                    name: 'javspyl', bgcolor: '', color: 'green',
                    ico: '',
                    origin: 'https://javspyl.tk',
                    uri: `/${this.fanHao}`
                },
                在线观看: { zhushi: '在线观看类', name: '在线', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                mmtv: {
                    zhushi: '在线观看下载等 适合搜索骑兵和fc2',
                    name: '7mmtv', bgcolor: '#FAFAD2', color: '#cb000d',
                    ico: 'https://7mmtv.sx/favicon.ico',
                    origin: 'https://7mmtv.sx',
                    uri: `/zh/censored_search/all/${this.fanHao}/1.html`
                },
                javmovs: {
                    zhushi: '在线观看全片Japanese Porn Streaming | JAV Stream | JAV HD Online',
                    name: 'JAVMOVS', bgcolor: '', color: 'green',
                    ico: 'https://javmovs.com/favicon.ico',
                    origin: 'https://javmovs.com',
                    uri: `/${this.fanHao}`
                },
                jable: {
                    zhushi: 'Jable.TV | 免費高清AV在線看',
                    name: 'Jable<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://assets-cdn.jable.tv/assets/icon/favicon.ico',
                    origin: 'https://jable.tv',
                    uri: `/search/${this.fanHao}/`
                },
                javdoe: {
                    zhushi: '在线观看全片JavDisk javdoe - Free JAV Streaming - Japanese Porn Online Full HD',
                    name: 'javdoe<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javdoe.to/favicon-32x32.png',
                    origin: 'https://javdoe.to',
                    uri: `/search/movie/${this.fanHao}`
                },
                javfree: {
                    zhushi: '在线观看全片JAV Free Online - JAVFree.SH - Japanese Porn Sex Streaming',
                    name: 'Javfree直<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javfree.sh/favicon.ico',
                    origin: 'https://javfree.sh',
                    uri: `/search/movie/${this.fanHao}`
                },
                javfinder: {
                    zhushi: '在线观看全片JAV Free Online - javfinder - Japanese Porn Sex Streaming',
                    name: 'javfinder<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javfinder.li/favicon.ico',
                    origin: 'https://javfinder.li',
                    uri: `/search/movie/${this.fanHao}`
                },
                hpjav: {
                    zhushi: '在线观看全片 無料AV, エロ動画, AVフリー, 素人の高画質アダルト動画, HPJAV 老片',
                    name: 'HPJAV<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://hpjav.tv/wp-content/themes/dist/image/HP.ico',
                    origin: 'https://hpjav.tv',
                    uri: `/tw/?s=${this.fanHao}`
                },
                javhdporn: {
                    zhushi: 'Free JAV HD Videos, Japanese Porn Streaming Online - JAV HD Porn',
                    name: 'JAVHDPorn<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://img.pornfhd.com/favicon.ico',
                    origin: 'https://www2.javhdporn.net',
                    uri: `/video/${this.fanHao}/`
                },
                javfun: {
                    zhushi: 'DownLoad JAV HD Free, Jav porn, Watch the best uncensored JAPANESE porn videos in FULL HD quality!',
                    name: 'JAVFUN<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://www9.javfun.me/favicon.ico',
                    origin: 'https://www9.javfun.me',
                    uri: `/search/${this.fanHao}`
                },
                bejav: {
                    zhushi: 'BEJAV is a website watch JAV video HD for free without any account registration, Free Jav Streaming and Download the latest JAVHD, Japanese Porn, Asian Sex Videos ,Hot JAV Online, free porn japanese, Stream Adult Video japanese. Start watching Now',
                    name: 'BEJAV<sup>fc2</sup><sub>∞</sub>', bgcolor: '', color: 'red',
                    ico: 'https://bejav.net/wp-content/themes/bejav/favicon.ico',
                    origin: 'https://bejav.net',
                    uri: `/search/${this.fanHao}`
                },
                javhd: {
                    zhushi: '在线观看全片',
                    name: 'JAVHD', bgcolor: '', color: 'red',
                    ico: 'https://javhd.today/favicon.ico',
                    origin: 'https://javhd.today',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                在线第二排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                supjav: {
                    zhushi: 'Watch Free Jav Online, Japanese Porn HD Streaming Online',
                    name: 'SUPJAV<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://supjav.com/favicon.ico',
                    origin: 'https://supjav.com',
                    uri: `/zh/?s=${this.fanHao}`
                },
                svjav: {
                    zhushi: 'JAV HD streaming, free download JAV, Japanese porn tube',
                    name: 'SVJAV <sub>∞</sub>', bgcolor: '', color: 'red',
                    ico: 'https://svjav.com/wp-content/themes/svjav/favicon.ico',
                    origin: 'https://svjav.com',
                    uri: `/search/${this.fanHao}/`
                },
                fbjav: {
                    zhushi: 'JAV Online, Free Japanese adult video, Porn Streaming, Asian Sex Videos',
                    name: 'FBJAV', bgcolor: '', color: 'red',
                    ico: 'https://fbjav.com/favicon.ico',
                    origin: 'https://fbjav.com',
                    uri: `/${this.fanHao}/`
                },
                javhhh: {
                    zhushi: 'JAV Online, Free Japanese adult video, Porn Streaming, Asian Sex Videos',
                    name: 'JAVHHH<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javhhh.com/template/javhhh/images/favicon.ico',
                    origin: 'https://javhhh.com',
                    uri: `/video/${this.fanHao}/`
                },
                kissjav: {
                    zhushi: 'Asian Porn Movies, Jav Tube Porn, Korean Bj, Korean Porn, Amateur Porn',
                    name: 'KISSJAV<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://kissjav.lifavicon.ico',
                    origin: 'https://kissjav.li',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                javdragon: {
                    zhushi: 'Watch Free JAV Japanese Porn and Asian XX Videos at JavDragon - Watch Japanese Porn XXX videos in amazing 720p HD! Exclusive JAV videos with hot Asian girls',
                    name: 'JavDragon', bgcolor: '', color: 'red',
                    ico: 'https://javdragon.com/favicon.ico',
                    origin: 'https://javdragon.com',
                    uri: `/${this.bango}/`
                },
                javsky: {
                    zhushi: 'Watch Free Jav HD Porn Streaming Online',
                    name: 'JAVSKY直<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javsky.tv/favicon.ico',
                    origin: 'https://javsky.tv',
                    uri: `/search/movie/${this.fanHao}`
                },
                javbel: {
                    zhushi: 'Japanese Porn Videos, Asian Porn Tube, Japan Sex Movies',
                    name: 'JAVBEL', bgcolor: '', color: 'green',
                    ico: 'https://javbel.com/favicon.png',
                    origin: 'https://javbel.com',
                    uri: `/search.php?q=${this.fanHao}`
                },
                javmix: {
                    zhushi: '高画質で長時間の無料エロ動画',
                    name: 'Javmix<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javmix.tv/wp-content/themes/javmix/images/icon.ico',
                    origin: 'https://javmix.tv',
                    uri: `/video/${this.fanHao}/`
                },
                avdrive: {
                    zhushi: 'av-Drive [1080p Porn Videos] [Google Drive]',
                    name: 'av-Drive', bgcolor: '', color: 'red',
                    ico: 'https://av-drive.blogspot.com/favicon.ico',
                    origin: 'https://av-drive.blogspot.com',
                    uri: `/search?q=${this.fanHao}`
                },
                javfor: {
                    zhushi: 'Japanese Adult Video (JAV), Full Length XXX Movies, Watch Free Porn Videos 网站仅支持站内搜索 无法获取搜索地址',
                    name: 'JAV-FOR', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://jav-for.me/templates/e-hentai/images/favicon.png',
                    origin: 'https://jav-for.me',
                    uri: `/?do=search&subaction=search&story=${this.fanHao}`
                },
                在线第三排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                ggjav: {
                    zhushi: '最も完全な無料オンライン日本のAV、HD JAV、アダルト映画',
                    name: 'GGJAV<sup>fc2</sup><sub>∞</sub>', bgcolor: '', color: 'red',
                    ico: 'https://ggjav.com/resources/icons/icon.png',
                    origin: 'https://ggjav.com',
                    uri: `/ja/main/search?string=${this.fanHao}`
                },
                bestjavporn: {
                    zhushi: '在线观看',
                    name: 'bestjavporn<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://img.bestjavporn.net/favicon.ico',
                    origin: 'https://www3.bestjavporn.com',
                    uri: `/search/${this.fanHao}/`
                },
                javcl: {
                    zhushi: 'Free Jav Streaming Online Free Porn Full HD',
                    name: 'JAVCL', bgcolor: '', color: 'green',
                    ico: 'https://javcl.com/wp-content/themes/javcl/images/ico.png',
                    origin: 'https://javcl.com',
                    uri: `/search/${this.fanHao}/`
                },
                sextb: {
                    zhushi: 'Free JAV HD and XXX sex videos on the Japanese Porn',
                    name: 'SEXTB<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://sextb.net/favicon.ico',
                    origin: 'https://sextb.net',
                    uri: `/search/${this.fanHao}`
                },
                avgle: {
                    zhushi: '無修正エロ動画ファンにAVGLEが贈る、人気AV女優や可愛い素人の高画質独占配信アダルト動画・免費成人影片、日本AV、無碼高清視頻播放',
                    name: 'avgle<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://avgle.com/favicon.ico',
                    origin: 'https://avgle.com',
                    uri: `/search/videos?search_query=${this.fanHao}&search_type=videos	`
                },
                netflav: {
                    zhushi: 'Netflav 集結琳瑯滿目的精彩日本成人影片，只有在這才找得到，全部精心製作。',
                    name: 'netflav<sup>fc2</sup><sub>∞</sub>', bgcolor: '', color: 'red',
                    ico: 'https://netflav.com/static/assets/favicon.ico',
                    origin: 'https://netflav.com',
                    uri: `/search?type=title&keyword=${this.fanHao}`
                },
                missav: {
                    zhushi: '在线观看 大缩略图 无码流出',
                    name: 'missav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://missav.com/favicon.ico',
                    origin: 'https://missav.com',
                    uri: `/cn/search/${this.fanHao}/`
                },
                javguru: {
                    zhushi: '在线观看',
                    name: 'javguru<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://cdn.javsts.com/wp-content/uploads/2016/09/favicon.ico',
                    origin: 'https://jav.guru',
                    uri: `/?s=${this.fanHao}`
                },
                javmost: {
                    zhushi: '在线观看',
                    name: 'javmost<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://javmost.cx/favicon.ico',
                    origin: 'https://www.javmost.cx',  // https://www.javmost.xyz/
                    uri: `/search/${this.fanHao}/`
                },
                av01: {
                    zhushi: '在线观看',
                    name: 'av01<sup>fc2荐</sup>', bgcolor: '', color: 'green',
                    ico: 'https://www.av01.tv/favicon.ico',
                    origin: 'https://www.av01.tv',
                    uri: `/search/videos?search_query=${this.fanHao}`
                },
                paipancon: {
                    zhushi: '在线观看',
                    name: 'paipancon<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://paipancon.com/favicon.ico',
                    origin: 'https://paipancon.com',
                    uri: `/search/${this.fanHao}`
                },
                在线第四排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                javfc2: {
                    zhushi: '在线观看',
                    name: 'javfc2<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javfc2.net/favicon.ico',
                    origin: 'https://javfc2.net',
                    uri: `/?s=${this.fanHao}`
                },
                javchill: {
                    zhushi: '在线观看',
                    name: 'javchill', bgcolor: '', color: 'red',
                    ico: 'https://javchill.com/frontend/image/favicon.png',
                    origin: 'https://javchill.com',
                    uri: `/search?search=${this.fanHao}`
                },
                watchjav: {
                    zhushi: '在线观看',
                    name: 'watchjav', bgcolor: '', color: 'green',
                    ico: 'https://watchjav.site/favicon.ico',
                    origin: 'https://watchjav.site',
                    uri: `/search?q=${this.fanHao}`
                },
                thisav: {
                    zhushi: 'thisav在线观看',
                    name: 'thisav', bgcolor: '', color: 'green',
                    ico: 'https://www.thisav.com/favicon.ico',
                    origin: 'https://www.thisav.com',
                    uri: `/channel/${this.fanHao}`
                },
                youavhub: {
                    zhushi: 'youavhub 在线观看',
                    name: 'youavhub', bgcolor: '', color: 'red',
                    ico: 'https://youavhub.com/upload/site/20211104-1/d52f7e0836b763e70493a97efe577015.png',
                    origin: 'https://youavhub.com',
                    uri: `/index.php/vod/search.html?wd=${this.fanHao}`
                },
                eporner: {
                    zhushi: 'eporner 在线观看',
                    name: 'eporner', bgcolor: '', color: 'red',
                    ico: 'https://static-sg-cdn.eporner.com/favicon.png',
                    origin: 'https://www.eporner.com',
                    uri: `/search/${this.fanHao}/`
                },
                javseen: {
                    zhushi: 'javseen 在线观看',
                    name: 'javseen<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://javseen.tv/favicon-32x32.png',
                    origin: 'https://javseen.tv',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                av18pro: {
                    zhushi: '18av 在线观看',
                    name: '18avPro<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://18av.pro/template/18av/static/images/icon_32.ico',
                    origin: 'https://18av.pro',
                    uri: `/v/?wd=${this.fanHao}`
                },
                javopen: {
                    zhushi: 'javopen 在线观看',
                    name: 'javopen<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://javopen.co/wp-content/uploads/2020/01/logo1.png',
                    origin: 'https://javopen.co',
                    uri: `/?s=${this.fanHao}`
                },
                javhub: {
                    zhushi: 'javhub 在线观看 老片',
                    name: 'javhub', bgcolor: '', color: 'red',
                    ico: 'https://ja.javhub.net/favicon.ico',
                    origin: 'https://ja.javhub.net',
                    uri: `/search/${this.fanHao}`
                },
                highporn: {
                    zhushi: 'highporn 在线观看',
                    name: 'highporn <sub>∞</sub>', bgcolor: '', color: 'green',
                    ico: 'https://highporn.net/favicon.ico',
                    origin: 'https://highporn.net',
                    uri: `/search/videos?search_query=${this.fanHao}`
                },
                在线第五排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                japanhub: {
                    zhushi: 'japanhub 在线观看',
                    name: 'japanhub', bgcolor: '', color: 'green',
                    ico: 'https://japanhub.net/favicon.ico',
                    origin: 'https://japanhub.net',
                    uri: `/search/videos?search_query=${this.fanHao}`
                },
                goodav17: {
                    zhushi: 'goodav17 在线观看',
                    name: 'goodav17<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'http://goodav17.com/static/icon.ico',
                    origin: 'http://goodav17.com',
                    uri: `/search/${this.fanHao}/1/`
                },
                av1688: {
                    zhushi: 'av1688 在线观看',
                    name: 'av1688<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://av1688.cc/wp-content/uploads/2020/05/logo2.png',
                    origin: 'https://av1688.cc',
                    uri: `/?s=${this.fanHao}`
                },
                share920: {
                    zhushi: '920share 在线观看',
                    name: '920share<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://920share.com/wp-content/uploads/920.png',
                    origin: 'https://920share.com',
                    uri: `/?s=${this.fanHao}`
                },
                avbebe: {
                    zhushi: 'avbebe 在线观看',
                    name: 'avbebe<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://avbebe.com/avbebe-favicon.ico',
                    origin: 'https://avbebe.com',
                    uri: `/?s=${this.fanHao}`
                },
                avpanda: {
                    zhushi: 'avpanda 在线观看',
                    name: 'avpanda<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://avpanda.cc/wp-content/uploads/2020/08/avpandass.png',
                    origin: 'https://avpanda.cc',
                    uri: `/?s=${this.fanHao}`
                },
                ccavb: {
                    zhushi: 'ccavb 在线观看',
                    name: 'ccavb<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://ccavb.tv/favicon.svg',
                    origin: 'https://ccavb.tv',
                    uri: `/video/${this.fanHao}`
                },
                cowmm: {
                    zhushi: 'cowmm 在线观看',
                    name: 'cowmm<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://cowmm.com/wp-content/uploads/2020/02/favicons.ico',
                    origin: 'https://cowmm.com',
                    uri: `/?s=${this.fanHao}`
                },
                iijav: {
                    zhushi: 'iijav 在线观看',
                    name: 'iijav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://iijav.com/wp-content/themes/modown/static/img/logo.png',
                    origin: 'https://iijav.com',
                    uri: `/?s=${this.fanHao}/`
                },
                jav01: {
                    zhushi: 'jav01 在线观看',
                    name: 'jav01<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://jav01.cc/wp-content/uploads/2020/06/37c721bc4c659a8868b378b9478aaee4_resized.png',
                    origin: 'https://jav01.cc',
                    uri: `/?s=${this.fanHao}`
                },
                // https://www.ixxx.com/zh/search/pred-277
                ixxx: {
                    zhushi: 'ixxx 在线搜索观看',
                    name: 'ixxx', bgcolor: '', color: 'red',
                    ico: '',
                    origin: 'https://www.ixxx.com',
                    uri: `/zh/search/${this.fanHao}`
                },
                在线第六排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                javcc: {
                    zhushi: 'javcc 在线观看',
                    name: 'javcc<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://javcc.com/favicon.ico',
                    origin: 'https://javcc.com',
                    uri: `/?s=${this.fanHao}`
                },
                javfull: {
                    zhushi: 'javfull 在线观看',
                    name: 'javfull', bgcolor: '', color: 'red',
                    ico: 'https://javfull.net/wp-content/themes/javfullv2/icon/ico.png',
                    origin: 'https://javfull.net',
                    uri: `/${this.fanHao}/`
                },
                javsup: {
                    zhushi: 'javsup 在线观看',
                    name: 'javsup<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://javsup.com/wp-content/uploads/2022/05/letter-j.png',
                    origin: 'https://javsup.com',
                    uri: `/?s=${this.fanHao}`
                },
                macjav: {
                    zhushi: 'macjav 在线观看',
                    name: 'macjav<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://macjav.com/wp-content/uploads/2022/05/macs.png',
                    origin: 'https://macjav.com',
                    uri: `/?s=${this.fanHao}/`
                },
                theav: {
                    zhushi: 'theav 在线观看',
                    name: 'theav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://theav.xyz/static/favicon.ico?aaff',
                    origin: 'https://theav.xyz',
                    uri: `/search/${this.fanHao}`
                },
                tktube: {
                    zhushi: 'tktube 在线观看',
                    name: 'tktube<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://tktube.com/favicon.ico',
                    origin: 'https://tktube.com',
                    uri: `/search/${this.fanHao}/`
                },
                upjav: {
                    zhushi: 'upjav 在线观看',
                    name: 'upjav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://upjav.cc/wp-content/uploads/2020/10/favicon-32x32-1.png',
                    origin: 'https://upjav.cc',
                    uri: `/?s=${this.fanHao}`
                },
                jav223: {
                    zhushi: 'jav223 在线观看',
                    name: 'jav223<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://upload.cc/i1/2021/01/01/BsdRfA.png',
                    origin: 'https://www.jav223.com',
                    uri: `/?m=video_search*${this.fanHao}*1`
                },
                youav: {
                    zhushi: 'youav 在线观看',
                    name: 'youav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://www.youav.com/images/favicons/favicon-16x16.png',
                    origin: 'https://www.youav.com',
                    uri: `/search/videos/${this.fanHao}`
                },
                njav: {
                    zhushi: 'njav 在线观看',
                    name: 'njav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://static.njav.tv/assets/site/images/favicon.png?v=1',
                    origin: 'https://njav.tv',
                    uri: `/zh/search?keyword=${this.fanHao}`
                },
                // https://9527.today/MehXPt
                javdove: {
                    zhushi: 'javdove 在线观看【多结果无跳】',
                    name: 'javdove<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://javdove2.space/favicon.ico',
                    origin: 'https://javdove2.space',
                    uri: `/search/videos?search_query=${this.fanHao}`
                },
                在线第七排0: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                huangboav: {
                    zhushi: 'huangboav FC2及亚洲视讯 无日本AV【结果乱无跳】',
                    name: 'huangboav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://huangboav.com/favicon.ico',
                    origin: 'https://huangboav.com',
                    uri: `/?s=${this.fanHao}`
                },
                buzzav: {
                    zhushi: 'buzzav 在线观看【结果乱无跳】',
                    name: 'buzzav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://www.buzzav.com/images/favicons/favicon-16x16.png',
                    origin: 'https://www.buzzav.com',
                    uri: `/search/videos/${this.fanHao}`
                },
                // https://maa1830.com
                av18: {
                    zhushi: '18av 在线观看',
                    name: '18av<sup>fc2</sup><sub>∞</sub>', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://maa1830.com/favicon.ico',
                    origin: 'https://maa1830.com',
                    uri: `/zh/fc_search/all/${this.fanHao}/1.html`
                },
                // https://www.javjack.com/search?utf8=%E2%9C%93&query=SSNI-744
                // https://javleak.com/?s=BF-674
                javleak: {
                    zhushi: 'javleak 在线观看',
                    name: 'javleak', bgcolor: '', color: 'red',
                    ico: 'https://javleak.com/wp-content/uploads/2019/05/favicon-1.png',
                    origin: 'https://javleak.com',
                    uri: `/?s=${this.fanHao}`
                },
                // https://pornbraze.com/search/video/?s=MIDV-170
                pornbraze: {
                    zhushi: 'pornbraze 在线观看',
                    name: 'pornbraze', bgcolor: '', color: 'red',
                    ico: 'https://pornbraze.com/16x16.png',
                    origin: 'https://pornbraze.com',
                    uri: `/search/video/?s=${this.fanHao}`
                },
                // https://watchjavonline.com/CAWD-437/
                watchjavonline: {
                    zhushi: 'watchjavonline 在线观看',
                    name: 'watchjavOL', bgcolor: '', color: 'red',
                    ico: 'https://watchjavonline.com/wp-content/uploads/2020/09/wjoicon-110x110.png',
                    origin: 'https://watchjavonline.com',
                    uri: `/${this.fanHao}/`
                },
                // https://www.javbangers.com/search/SPRD-1458/
                javbangers: {
                    zhushi: 'javbangers 在线观看',
                    name: 'javbangers<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://www.javbangers.com/favicon.png',
                    origin: 'https://www.javbangers.com',
                    uri: `/search/${this.fanHao}/`
                },
                // https://vjav.com/search/1/?s=SDMU_849
                vjav: {
                    zhushi: 'vjav 在线观看',
                    name: 'vjav', bgcolor: '', color: 'red',
                    ico: 'https://vjav.com/static/images/favicons/favicon-16x16.png',
                    origin: 'https://vjav.com',
                    uri: `/search/1/?s=${this.fanHao}`
                },
                // https://www.hotsav.cc/index.php/vodsearch/-------------.html?wd=JUL-278
                // https://javcv.com/search?category=dvd_code&q=SSIS-408
                javcv: {
                    zhushi: 'javcv推荐片花',
                    name: 'javcv', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://javcv.com/images/favicon.png',
                    origin: 'https://javcv.com',
                    uri: `/search?category=dvd_code&q=${this.fanHao}`
                },
                javabc: {
                    zhushi: ' Watch Free Japanese Porn Movies Online HD',
                    name: 'javabc', bgcolor: '', color: 'green',
                    ico: 'https://javabc.com/wp-content/uploads/2018/11/icon.png',
                    origin: 'https://javabc.com',  //SEXTOP
                    uri: `/search/${this.fanHao}`
                },
                japteenx: {
                    zhushi: 'japteenx 在线观看 FC2',
                    name: 'japteenx<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://www.japteenx.com/android-icon-36x36.png',
                    origin: 'https://www.japteenx.com',
                    uri: `/search/videos?search_query=${this.fanHao}`
                },
                在线第八排1: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                porn78: {
                    zhushi: 'porn78 在线观看【多结果无跳】',
                    name: 'porn78<sup>fc2</sup>', bgcolor: '', color: 'green',
                    ico: 'https://porn78.info/img/favicon.ico?v=3',
                    origin: 'https://porn78.info',
                    uri: `/zh/video/index?search=${this.fanHao}`
                },
                // https://www.sexbartv.info/index.php/vodsearch/-------------.html?wd=JUL-278
                // https://javstudy.com/video/CAWD-432
                // https://www.porntw.com/?q=SSIS-408
                porntw: {
                    zhushi: 'porntw 在线观看',
                    name: 'porntw', bgcolor: '', color: 'red',
                    ico: 'https://www.porntw.com/images/website/3.webp?1639658234',
                    origin: 'https://www.porntw.com',
                    uri: `/?q=${this.fanHao}`
                },
                // https://www.jav777.xyz/?s=JUFE-386
                jav777: {
                    zhushi: 'jav777 在线观看',
                    name: 'jav777', bgcolor: '', color: 'red',
                    ico: '',
                    origin: 'https://www.jav777.xyz',
                    uri: `/?s=${this.fanHao}`
                },
                // https://avple.tv/search?key=AP-681&page=1&sort=date
                avple: {
                    zhushi: 'avple 在线观看',
                    name: 'avple<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: '',
                    origin: 'https://avple.tv',
                    uri: `/search?key=${this.fanHao}&page=1&sort=date`
                },
                // https://159i.com/video/search/CJOD_165/ 加勒逼A片網
                // https://18commmic.com/?cat=0&s=PFES-005
                // https://www.mmav.me/search/?keyword=ADN-322
                mmav: {
                    zhushi: 'mmav 在线观看',
                    name: 'mmav', bgcolor: '', color: 'red',
                    ico: 'https://www.mmav.me/favicon.ico',
                    origin: 'https://www.mmav.me',
                    uri: `/search/?keyword=${this.fanHao}`
                },
                // https://avee.cc/index.php/vod/search.html?wd=JUL-278
                // https://avhbo.com/?s=WAAA-212
                avhbo: {
                    zhushi: 'avhbo 在线观看',
                    name: 'avhbo', bgcolor: '', color: 'red',
                    ico: 'https://avhbo.com/wp-content/themes/chillcum/assets/play.png',
                    origin: 'https://avhbo.com',
                    uri: `/?s=${this.fanHao}`
                },
                // https://thtmod7.com/index.php/vodsearch/-------------.html?wd=SUPA-179
                thtmod7: {
                    zhushi: 'thtmod7 桃花堂在线观看',
                    name: 'thtmod7', bgcolor: '', color: 'red',
                    ico: 'https://thtmod7.com/favicon.ico',
                    origin: 'https://thtmod7.com',
                    uri: `/index.php/vodsearch/-------------.html?wd=${this.fanHao}`
                },
                // https://taiav.com/cn/search?q=SSIS-525
                taiav: {
                    zhushi: 'taiav 在线观看',
                    name: 'taiav', bgcolor: '', color: 'red',
                    ico: 'https://taiav.com/favicon.ico',
                    origin: 'https://taiav.com',
                    uri: `/cn/search?q=${this.fanHao}`
                },
                // https://www.mdavmod.cc/index.php/vodsearch/-------------/?wd=JUL-278
                // https://avjoy.me/search/videos/JUFD-714
                // https://hayav.com/search/SSIS-547
                hayav: {
                    zhushi: 'hayav 在线观看',
                    name: 'hayav', bgcolor: '', color: 'red',
                    ico: 'https://imgs.hayav.com/images/2020/09/favicon.ico',
                    origin: 'https://hayav.com',
                    uri: `/search/${this.fanHao}`
                },
                // https://gigolo.av.net/search?keyword=SSNI-348
                // https://www.hxaa11.com/#/search?name=SOAN-085
                // https://www.micmicdoll.com/search?q=hodv-21736 之前以为只有写真，后来才看到还可以看全片
                micmicdoll: {
                    zhushi: 'micmicdoll 在线搜索观看',
                    name: 'micmicdoll', bgcolor: '', color: 'red',
                    ico: '',
                    origin: 'https://www.micmicdoll.com',
                    uri: `/search?q=${this.fanHao}`
                },
                // https://www.jav19.com/v/?wd=HMDNC-549
                jav19: {
                    zhushi: 'jav19 在线搜索观看',
                    name: 'jav19', bgcolor: '', color: 'red',
                    ico: '',
                    origin: 'https://www.jav19.com',
                    uri: `/v/?wd=${this.fanHao}`
                },
                资讯: { zhushi: '中文简介 资讯等', name: '资讯', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                uuribao: {
                    zhushi: '番号 相关资讯类',
                    name: 'uuribao', bgcolor: '', color: 'red',
                    ico: 'https://uuribao.net/wp-content/uploads/2021/10/848357745020e39-150x150.jpg',
                    origin: 'https://uuribao.net',
                    uri: `/archives/tag/${this.fanHao}/`
                },
                uuribao2: {
                    zhushi: '演员 相关资讯类 请自行修改演员',
                    name: 'uuribao演员', bgcolor: '', color: 'red',
                    ico: 'https://uuribao.net/wp-content/uploads/2021/10/848357745020e39-150x150.jpg',
                    origin: 'https://uuribao.net',
                    uri: `/archives/tag/%E4%B8%89%E4%B8%8A%E6%82%A0%E4%BA%9A/`
                },
                sex9: {
                    zhushi: '9sex 中文简介',
                    name: '9sex', bgcolor: '#FAFAD2', color: 'green',
                    ico: 'https://9sex.tv/static/icon/logo.png',
                    origin: 'https://9sex.tv',
                    uri: `/web/search?page=1&keyWord=${this.fanHao}`
                },
                xcity: {
                    zhushi: 'xcity ',
                    name: 'xcity', bgcolor: '', color: 'green',
                    ico: 'https://faws.xcity.jp/image/parts/favicon/android-chrome-36x36.png',
                    origin: 'https://xcity.jp',
                    uri: `/result_published/?genre=%2Fresult_published%2F&q=${this.bango}&sg=avod&num=30`
                },
                fc2ppv: {
                    zhushi: 'fc2ppv ',
                    name: 'fc2ppv', bgcolor: '', color: 'green',
                    ico: 'https://fc2ppv.org/storage/1.jpg',
                    origin: 'https://fc2ppv.org',
                    uri: `/search?q=${this.fanHao}`
                },
                资讯第一排6: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                资讯第一排7: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                资讯第一排8: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                资讯第一排9: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                资讯第一排10: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                资讯第一排11: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                大缩略图: { zhushi: '大缩略图', name: '缩图', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },
                javstore: {
                    zhushi: 'utimate free download solution, free download jav, jav free, free japanese av, free download av',
                    name: 'javstore<sup>fc2</sup>', bgcolor: '#FAFAD2', color: 'red',
                    ico: 'https://javstore.net/upload/setting/zzzzzzz.png',
                    origin: 'https://javstore.net',
                    uri: `/search/${this.fanHao}.html`
                },
                memojav: {
                    zhushi: '在线观看 大缩略图  推荐',
                    name: 'memojav', bgcolor: '', color: 'green',
                    ico: 'https://memojav.com/favicon.ico',
                    origin: 'https://memojav.com',
                    uri: `/video/${this.fanHao}`
                },
                blogjav: {
                    zhushi: 'Jav Exclusively For You! Most Updated Daily!',
                    name: 'blogjav', bgcolor: '', color: 'green',
                    ico: 'https://blogjav.net/favicon.ico',
                    origin: 'https://blogjav.net',
                    uri: `/?s=${this.fanHao}`
                },
                javbest: {
                    zhushi: 'Javbest free update',
                    name: 'javbest', bgcolor: '', color: 'green',
                    ico: 'https://javbest.net/favicon.ico',
                    origin: 'https://javbest.net',
                    uri: `/?s=${this.fanHao}`
                },
                maddawgjav: {
                    zhushi: 'maddawgjav free update',
                    name: 'maddawgjav', bgcolor: '', color: 'green',
                    ico: 'https://maddawgjav.net/favicon.ico',
                    origin: 'https://maddawgjav.net',
                    uri: `/?s=${this.fanHao}`
                },
                // http://t2jav.com/?s=FSDSS-434
                t2jav: {
                    zhushi: 't2jav',
                    name: 't2jav<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://2.bp.blogspot.com/-IOSaes1Y1i0/VuJ9CYgYIqI/AAAAAAAAUBU/Ofq2SM_OYPEP1OYg8Reo1C5ucPZOswkFg/s1600/favicon.ico',
                    origin: 'http://t2jav.com',
                    uri: `/?s=${this.fanHao}`
                },
                // https://3xplanet.com/?s=FSDSS-434
                xplanet: {
                    zhushi: '3xplanet',
                    name: '3xplanet<sup>fc2</sup>', bgcolor: '', color: 'red',
                    ico: 'https://3xplanet.com/wp-content/uploads/2022/09/3xfavicon.png',
                    origin: 'https://3xplanet.com',
                    uri: `/?s=${this.fanHao}`
                },
                // http://javscreens.com/f/fsdss-090.html
                javscreens: {
                    zhushi: 'javscreens',
                    name: 'javscreens', bgcolor: '', color: 'red',
                    ico: 'http://javscreens.com/favicon.ico',
                    origin: 'http://javscreens.com',
                    uri: `/${this.one}/${this.xiao}.html`
                },
                大缩略图第一排10: { zhushi: '', name: '', bgcolor: '', color: '#00a2e8', ico: '', origin: 'https://greasyfork.org/zh-CN/scripts/449158-onejavoneweb-list', uri: `` },

            };
            for (let e in this.data) {
                this.data[e].url = `${this.data[e].origin}${this.data[e].uri}`;
                delete this.data[e].origin;
                delete this.data[e].uri;
            }
        }
        create_table(position = 0) {
            const rows = 12;
            const tableDataLength = Object.keys(this.data).length;
            let tableData = this.data;
            let htmlTable;
            if (position == 0) {
                // absolute
                htmlTable = `<div class="movieav" fr-fix-stroke="true"><table class="jav_table" width="100%" border="1" cellspacing="0">`;
            }
            else {
                // inherit
                htmlTable = `<div class="movieav" fr-fix-stroke="true"><table class="jav_table" width="100%" border="1" cellspacing="0">`;
            }
            let htmlTbody = ``;
            let o = 0;
            if (tableDataLength % rows != 0) {
                for (let index = tableDataLength; index < tableDataLength + rows - (tableDataLength % rows); index++) {
                    tableData[`temp_${index}`] = {
                        zhushi: '',
                        name: '',
                        color: '#ffffff',
                        bgcolor: '',
                        ico: '',
                        url: '#'
                    };
                }
            }
            for (let index in tableData) {
                if ((o + 1) % rows == 1) {
                    htmlTbody += '<tbody><tr>';
                }
                htmlTbody += `<td style="background-color:${tableData[index].bgcolor};"><a target="_blank" title="${tableData[index].zhushi}" style="color:${tableData[index].color}" href="${tableData[index].url}">${tableData[index].name}</a></td>`;
                if ((o + 1) % rows == 0) {
                    htmlTbody += '</tr></tbody>';
                }
                o++;
            }
            htmlTable += `${htmlTbody}`;

            // 删除鼠标离开隐藏 onMouseOut="document.getElementById('img_1').style.display = 'none'"
            htmlTable += `<tbody><tr><td colspan="${rows}" align="left"><a style="padding-left:5px;" href="https://image.memojav.com/image/screenshot/${this.fanHao}.jpg"  onMouseOver="document.getElementById('img_1').style.display = 'block'" target="_blank"><b><font color='green'>查看 大缩略图</font></b></a><img id="img_1" src="https://image.memojav.com/image/screenshot/${this.fanHao}.jpg" style="display:none" onclick="document.getElementById(\'img_1\').style.display=\'none\';">&nbsp;&nbsp;<span style='font-size:9px;font-family:MingLiU;'>车牌信息、演员信息、磁力种子、片花、在线观看、资讯、大缩略图&nbsp;&nbsp;<font color='green'>绿色</font>:免番羽&nbsp;&nbsp;<font color='red'>红色</font>:需番羽&nbsp;&nbsp;直：请直连Direct&nbsp;&nbsp;演员请自行修改</span></td></tr></tbody>`;
            // 从别的脚本看到一些 ¹⁸⁺ 图库，分享下 不想看到可以在下行前面添加注释符 //
            htmlTable += `<tbody><tr><td colspan="${rows}">图库¹⁸⁺:<a href="https://www.micmicidol.com/" style="padding:2px;">mic写真集</a><a href="https://www.wndfx.com/">Wndfx</a><a href="https://hentai-img.com/" style="padding:2px;">Hentai</a><a href="https://zh.hentai-cosplays.com/" style="padding:2px;">Cosplay</a><a href="https://zh.porn-images-xxx.com/" style="padding:2px;">Porn</a><a href="http://www.xiuren.org/" style="padding:2px;">Xiuren</a><a href="https://everia.club/" style="padding:2px;">Everia</a><a href="https://nsfwx.pics" style="padding:2px;">Nsfwpicx</a><a href="https://asiantolick.com" style="padding:2px;">Asian</a><a href="https://xchina.co" style="padding:2px;">小黄书</a><a href="https://jjgirls.com/" style="padding:2px;">Heyzo</a><a href="https://www.photos18.com/" style="padding:2px;">色圖</a><a href="https://mm.tvv.tw/" style="padding:2px;">tvv</a><br><a href="https://www.pornpics.com/" style="padding:2px;">Porn Pics</a><a href="https://idol.gravureprincess.date/" style="padding:2px;">Idol</a><a href="https://hotgirl.asia/" style="padding:2px;">HOTGIRL</a><a href="https://buondua.com/" style="padding:2px;">Buon Dua</a><a href="https://www.ilovexs.com/" style="padding:2px;">NongMo</a><a href="https://nudecosplaygirls.com/" style="padding:2px;">NUDECOSPLAY</a><a href="https://nudebird.biz/" style="padding:2px;">NudeBird</a><a href="https://goddess247.com/" style="padding:2px;">Goddess247</a><a href="https://tw.goddesssite.com/" style="padding:2px;">Kiss Goddess</a><a href="https://girlygirlpic.com/" style="padding:2px;">girlpic</a></td></tr></tbody>`;
            htmlTable += `</table></div>`;

            return htmlTable;
        }
    }
    //添加头部
    const meta = document.createElement('meta')
    meta.setAttribute('viewport', 'width=device-width, initial-scale=1')
    document.head.appendChild(meta)
    //添加头部结束
    GM_addStyle(`
            a{ text-decoration:none;font-size:14px;font-weight:blod;}
            a:hover{ text-decoration:underline}
            .movieav {
                margin: 0;
                padding: 5px 0 5px 0;
							  text-align: center;font-weight:600;font-size:14px;text-align: center;color:#000000;background: #EFEFEF;text-decoration: none;
            }
            .jav_table table {border: 1px solid #ccc; margin:0; padding:0; border-collapse: collapse; border-spacing: 0; margin: 0 auto;}
            .jav_table table tr {height:21px;vertical-align:bottom;font-weight:blod;font-size:14px;color:#000000;}
            .jav_table table th, .jav_table table td {padding: 1px; height:21px; text-align: center; border: 1px solid #999; display:table-cell; vertical-align:middle; word-break: break-all;}
            .jav_table table th {text-transform: uppercase; font-size: 14px; letter-spacing: 1px;}
            @media screen and (max-width: 300px) {
               .jav_table table {border: 0;}
               .jav_table table thead {display: none;}
               .jav_table table tr {margin-bottom: 10px; display: block; border: 2px solid #ddd;}
               .jav_table table td {display: block; text-align: right; font-size: 13px; border: 1px dotted #ccc;}
               .jav_table table td:last-child {}
               .jav_table table td:before {content: attr(data-label); float: left; text-transform: uppercase; font-weight: bold;}
               }

            `);

    /* OneJAV 141jav */
    if (null != location.hostname.match(/onejav.com|141jav.com|141ppv.com/)) {
        (() => {
            const bango = $('body > div.container > div.card.mb-3 > div > div > div.column.is-5 > div > h5').text().trim();
            const jav = new JAV(bango);
            $('body > div.container > div.card.mb-3 > div > div').after(jav.create_table());
            return false;
            // Show a table without no search reasult
            if (null != location.pathname.match(/\/search\/[a-zA-Z0-9-]/) && 0 == $('div.card.mb-3').length) {
                const jav = new JAV(location.pathname.substr(8));
                $('div.container').after(jav.create_table(1));
            }
        })();
    }

    /* avmoo javbus */
    if (null != location.hostname.match(/avmoo|avsox|javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav/)) {
        const showBoxes = $('.movie-box');
        if (showBoxes.length == 1 && GM_getValue('auto_jump', true)) {
            location.href = showBoxes[0].href;
        }
        const bango = $('body > div.container > h3').text().trim().split(' ')[0];
        const jav = new JAV(bango);
        $('body > div.container > #star-div').after(jav.create_table(1));
        $('body > div.container > #movie-share').before(jav.create_table(1));
    }

    /* Freejavbt  https://freejavbt.com/ADN-322 */
    if (null != location.hostname.match(/freejavbt/)) {
        (() => {
            const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
            const jav = new JAV(bango);
            //
            $('body > div.row.justify-content-center.mb-3.mw-100 > div:nth-child(1)').after(jav.create_table(1)); // body > div.row.justify-content-center.mb-3.mw-100 > div:nth-child(3)
            // $('#pills-0 > div > div').after(jav.create_table(1));
            return false;
        })();
    }


    /* airav 网站强制了表格样式 看起来有些错乱 先放着吧 */
    if (null != location.hostname.match(/airav/)) {
        (() => {
            const bango = $('#ContentPlaceHolder1_Label_barcode').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#form1 > div.position_wu').before(jav.create_table(1));
            return false;
        })();
    }

    /* jav.place */
    if (null != location.hostname.match(/place/)) {
        (() => {
            const bango = $('body > div.wrapper > div.content-wrapper > div > div > div.row.mb-3 > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > div.wrapper > div.content-wrapper > div > div > div.row.mb-3').after(jav.create_table(1));
            return false;
        })();
    }

    /* javbooks */
    if (null != location.href.match(/content_censored|content_uncensored/)) {
        (() => {
            const bango = $('#info > div:nth-child(2) > font').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#info').before(jav.create_table(1));
            return false;
        })();
    }

    /* msin.jp  */
    if (null != location.href.match(/db.msin.jp\/jp.page\/movie/)) {
        (() => {
            const bango = $('div.mv_pn').text().trim().split(' ')[0]; // #content > div:nth-child(4) > div.mv_pn  #content > div:nth-child(6) > div.mv_pn
            const jav = new JAV(bango);
            $('#breadcrumb').after(jav.create_table(1)); // #content > div:nth-child(4) > div.movie_image_ditail  #breadcrumb  .jump_movie
            return false;
        })();
    }
    /* msin.jp FC2 */
    if (null != location.href.match(/db.msin.jp\/page\/movie/)) {
        (() => {
            const bango = $('div.mv_fileName').text().trim().split(' ')[0]; // #content > div.movie_info_ditail > div.mv_fileName
            const jav = new JAV(bango);
            $('#breadcrumb').after(jav.create_table(1)); // #content > div:nth-child(4) > div.movie_image_ditail
            return false;
        })();
    }

    /* msin.jp  番号页面更改CSS 宽度  2023年3月改版后取消此处css样式修改*/


    /* JAVLibrary */
    if (null != location.hostname.match(/javlib|n53i|o58c|g60y|f61m|y62x|x63a|g64w|u65w|h68g|c70j/)) {
        (() => {
            const bango = $('#video_title > h3').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#video_favorite_edit').after(jav.create_table(1));
            return false;
        })();
    }

    /* JAV.Land */
    if (null != location.hostname.match(/jav[0-9]?.land|hidmm.com/)) {
        (() => {
            const bango = $('body > div.container-fluid > div > div.k-right > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > div.container-fluid > div > div.k-right > div:nth-child(2)').before(jav.create_table(1));
            return false;
        })();
    }
    /* JAV.dog */
    if (null != location.hostname.match(/jav.dog/)) {
        (() => {
            const bango = $('body > div.container-fluid > div > div.k-right > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > div.container-fluid > div > div.k-right > div:nth-child(2)').before(jav.create_table(1));
            return false;
        })();
    }
    /* AV大平台 */
    if (null != location.hostname.match(/9sex|paycalling/)) {
        (() => {
            const bango = $('#twigFilm > div.container.d-flex.flex-wrap.align-items-start.align-self-start.no-gutters > h1 > span.original_coded').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#lightgallery').before(jav.create_table(1));
            return false;
        })();
    }

    /* javmenu */
    if (null != location.hostname.match(/javmenu/)) {
        (() => {
            const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
            const jav = new JAV(bango);
            $('#app > div.page-wrapper > div.page-content > div.container-fluid.p-0 > div > div.col-md-9.px-0 > div.box.mb-3.col-12').before(jav.create_table(1)); // #app > div > div > div.container-fluid.p-0 > div > div.col-md-8.px-0 > div:nth-child(4)
            return false;
        })();
    }

    /* airav.wiki */
    if (null != location.hostname.match(/airav.wiki/)) {
        (() => {
            const bango = $('#__next > div.bg-dark.text-white.container-fluid > div.bgImage.row > div.col-12.col-md-10.mx-auto.footer-mb.main > div.min-h-500.row > div.col-12.col-md-5.col > div > h5.d-none.d-md-block.text-primary.mb-3').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#__next > div.bg-dark.text-white.container-fluid > div.bgImage.row > div.col-12.col-md-10.mx-auto.footer-mb.main > div.min-h-500.row').before(jav.create_table(1));
            return false;
        })();
    }

    /* 7mmtv.tv  7mm.tv */
    if (null != location.hostname.match(/7mm|aa1141|aa1142/)) {
        (() => {
            $('body > main > div > div > div.row.flex-lg-nowrap > div.col-12.col-fullvideo > div > div.fullvideo-text.block.mb-4.mb-lg-5 > div.ut_cg1_top').remove();
            const bango = $('body > main > div > div > div.row.flex-lg-nowrap > div.col-12.col-fullvideo > div > div.fullvideo-details.mb-2.mb-md-3 > div.d-flex.mb-4 > span:nth-child(1)').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > header > nav > div').after(jav.create_table(1));
            return false;
        })();
    }

    /* 18AV視頻站 maa */
    if (null != location.hostname.match(/maa18/i)) {
        (() => {
            // $('body > div:nth-child(7) > div > div > div.content.video').remove();
            const bango = document.title.split(" ")[0]; // body > div:nth-child(4) > div > div > div.left > div.posts-inner-details-text > div > span:nth-child(1) > ul > li:nth-child(2)
            const jav = new JAV(bango);
            $('body > div.htmleaf-container > div > ul').after(jav.create_table(1)); // #cover_information  body > div.di_img body > div.htmleaf-container > div > ul
            return false;
        })();
    }

    /* jav-for.me */
    if (null != location.hostname.match(/jav-for.me/)) {
        (() => {
            const bango = $('#dle-content > article > div.movie-cols.clearfix > div.movie-text > div.movie-title > div.movie-original').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('#cols-r').before(jav.create_table(1));
            return false;
        })();
    }
    /* javcv.com */
    if (null != location.hostname.match(/javcv.com/)) {
        (() => {
            const bango = $('#product-tab-description > div > div:nth-child(1) > ul > li:nth-child(1) > span').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > div.page-wrapper > main > div > div > div.tab.tab-nav-boxed.tab-nav-underline.product-tabs.mt-3').before(jav.create_table(1));
            return false;
        })();
    }
    /* sextb */
    if (null != location.hostname.match(/sextb/)) {
        (() => {
            const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
            const jav = new JAV(bango);
            $('body > div.container > section.tray.all > div.film-info > h1').after(jav.create_table(1));
            return false;
        })();
    }

    /* jav321 */
    if (null != location.hostname.match(/jav321/)) {
        (() => {
            if (location.pathname.match(/\/video\/[a-zA-Z0-9-]+/i)) {
                const hinban = $('body > div:nth-child(3) > div.col-md-7.col-md-offset-1.col-xs-12 > div:nth-child(1) > div.panel-body > div:nth-child(1) > div.col-md-9')
                    .text()
                    .match(/品番: ([a-zA-Z0-9-]+)/i);
                const jav = new JAV(hinban[1]);
                $('body > div:nth-child(3) > div.col-md-7.col-md-offset-1.col-xs-12 > div:nth-child(1) > div.panel-body').append(jav.create_table(1));
            }
            const searchParams = new URLSearchParams(location.search.substr(1));
            if (undefined != searchParams.get('bango')) {
                $('body > div:nth-child(2) > div > nav > div > form:nth-child(2) > div > input')[0].value =
                    searchParams.get('bango');
                $('body > div:nth-child(2) > div > nav > div > form:nth-child(2) > div > span > button')[0].click();
                window.close();
            }
        })();
    }

    /* hpjav */

    if (null != location.hostname.match(/hpj?av/)) {
        (() => {
            const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
            const jav = new JAV(bango);
            $('body > div.video-box-ather.container > div:nth-child(1) > div > div.video-countext-Models.col-md-12').append(jav.create_table(1));
            return false;
        })();
    }

    /* jable */
    if (null != location.hostname.match(/jable/i)) {
        (() => {
            const matches = location.pathname.match(/\/videos\/([a-zA-Z0-9-]+)\//i);
            if (matches) {
                const jav = new JAV(matches[1]);
                $('#site-content > div > div > div:nth-child(1) > section.video-info.pb-3').append(jav.create_table(1));
            }
        })();
    }
    /* javdb */
    if (null != location.hostname.match(/javdb/i)) {
        //const showBoxes = $('.box');
        const showBoxesA = document.querySelectorAll('.item a[href*="/v/"]');
        const showBoxesB = document.querySelectorAll('.box.actor-box a[href*="/actors/"]');
        if (showBoxesA.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxesA[0].href; }
        if (showBoxesB.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxesB[0].href; }
        const bango = $('body > section > div > div.video-detail > h2 > strong').text().trim().replace("10musu\_", "").split(' ')[0];
        const jav = new JAV(bango);
        $('body > section > div > div.video-detail > div.video-meta-panel').after(jav.create_table(1));
    }

    /* javdb actors */
    // 2023年3月8日，db網頁版已加入如下調整:演員、片商、系列、導演、番號頁默認调整为按「發布日期倒序」排序，并增加「想看人数倒序」和「看过人数倒序」。 此处修改取消
    //if (null != location.href.match(/javdb[0-9]*\.com\/actors/)) {
    //    const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
    //     if (bango.match(/[a-zA-Z0-9]{4}/)) {
    //    const url = "https://javdb.com/actors/";
    //    const jiamima = "?sort_type=1&vft=1";
    //    const resurl = url + bango + jiamima;;
    //						window.location.href=resurl;
    //														   		}
    //}

    /* 98堂 */
    if (document.title.indexOf("高清中文字幕") > 0 || document.title.indexOf("亚洲有码原创") > 0 || document.title.indexOf("4K原版") > 0 || document.title.indexOf("素人有码系列") > 0 || document.title.indexOf("PPV") > 0 && document.title.indexOf("色花堂") > 0) {
        const bango = document.getElementById("thread_subject").innerHTML.split(' ')[0];
        const jav = new JAV(bango);
        document.querySelector("#pgt").innerHTML = jav.create_table(1);  //append方式会以源代码方式注入

    }
    /* 98堂2  Discuz论坛系统强制宽版 对于删除版权的无效 */
    if (document.title.indexOf("Discuz") > 0) {
        GM_addStyle(` .wp {width: 98%;}   `);
    }
    /* javhd.today */
    if (null != location.hostname.match(/javhd.today/i)) {
        const showBoxes = $('.thumbnail');
        if (showBoxes.length == 1 && GM_getValue('auto_jump', true)) { location.href = showBoxes[0].href; }
    }
    /* javstore.net */
    if (null != location.hostname.match(/javstore/)) {
        //const bango = document.title.replace("6000Kbps ","").replace("FHD ","").replace("[VR] ","").replace("CHINASES SUB ","").replace("Reducing Mosaic ","").replace("[ENGSUB] ","").replace("[ENGLISH SUB]","").replace("10musume ","").replace("1pondo ","").replace("一本道 ","").replace("Caribbeancom ","").replace("Caribbeancompr ","").replace("FC2-PPV ","").replace("FC2 PPV ","").replace("HEYZO ","").replace("pacopacomama ","").replace("Tokyo Hot ","").split(" ")[0];
        const bango = document.title.replace(/(6000Kbps |FHD |\[VR\] |CHINASES SUB |Reducing Mosaic |\[ENGSUB\] |\[ENGLISH SUB\]|10musume |天然むすめ |1pondo |一本道 |1Pondo-|4k |Caribbeancom |Caribbean-|カリビアンコム |Caribbeancompr |FC2-PPV |FC2 PPV |FC2PPV |HEYZO |pacopacomama |パコパコママ |Tokyo Hot )/ig, "").split(" ")[0];
        const jav = new JAV(bango);
        $('body > div.all_page_javstore > div.all_page_javstore1 > div.boxoright > div.category_news_main_right > div.news > div.fisrst_sc').append(jav.create_table(1));
        return false;
    }
    /* btsow */
    if (null != location.href.match(/btsow.\w+\/search/)) {
        (() => {
            const bango = location.pathname.slice(location.pathname.lastIndexOf('/') + 1).toUpperCase();
            const jav = new JAV(bango);
            $('body > div.container').append(jav.create_table(1));
            let div = document.createElement("div");
            div.innerHTML = '<div style="height:700px;"></div>';
            document.body.append(div);
        })();
    }
    /* btsow2 */
    if (null != location.href.match(/magnet\/detail\/hash/)) {
        (() => {
            const bango = $('body > div.container > h3').text().trim().split(' ')[0];
            const jav = new JAV(bango);
            $('body > div.container').append(jav.create_table(1));
            let div = document.createElement("div");
            div.innerHTML = '<div style="height:700px;"></div>';
            document.body.append(div);
            return false;
        })();
    }
    /* xslist.org/tw/model/ */
    if (null != location.href.match(/xslist.org\/(zh|tw|en)\/model/)) {
        (() => {
            let div = document.createElement("div");
            div.innerHTML = '<div style="height:700px;"></div>';
            document.body.append(div);
            return false;
        })();
    }
    /* javhoo.org */
    if (null != location.hostname.match(/javhoo/i)) {
        (() => {
            const showBoxes = $('.thumbnail');
            if (showBoxes.length == 1 && GM_getValue('auto_jump', true)) {
                location.href = showBoxes[0].href;
            }
            const bango = document.title.split(" ")[0];
            const jav = new JAV(bango);
            $('body > section > div.content-wrap > div > article').after(jav.create_table(1));
            return false;
        })();
    }
    /* ggjav.com */
    if (null != location.hostname.match(/ggjav/i)) {
        $('.native_ads.columns.large-3.medium-6.small-12.item.float-left').remove();
    }
    /* sexbartv */
    if (null != location.hostname.match(/sexbartv/i)) {
        $('div.tags-cloud.box > .tags-cloud.box').remove();
        $('body > div.container > h1').remove();
        $('.all').remove();
    }
    /* javmenu */
    if (null != location.hostname.match(/javmenu/i)) {
        $('#app > div > div.page-content > div:nth-child(2) > div > div > div > div:nth-child(1) > div').remove();
    }
    console.timeEnd('JAV');
    function isURL(x) { if (window.location.href.indexOf(x) != -1) { return true; } else { return false; } }
    var wait = 500;
    if (isURL("af101")) { setTimeout(function () { document.querySelector("body > section > div > div:nth-child(3) > ul > li:nth-child(1) > header > h3 > a").click(); }, wait + 500); }
    if (isURL("avman")) { setTimeout(function () { document.querySelector("body > main > section:nth-child(3) > div > div.row.row-cols-1.row-cols-sm-1.row-cols-md-2.row-cols-lg-2.g-4.text-center > div > div > div > h2 > a").click(); }, wait + 500); }
    if (isURL("bejav")) { setTimeout(function () { document.querySelector("#main > div.widget.col-md-9 > div.widget-body > div > div.thumb > a").click(); }, wait + 500); }
    if (isURL("fc2ppv")) { setTimeout(function () { document.querySelector("#pjx-container > div.row > div.col-md-10.content_md > div > section:nth-child(2) > div.row > div > div > div.c-cntCard-110-f_thumb > a").click(); }, wait + 500); }
    if (isURL("ggjav")) { setTimeout(function () { document.querySelector("body > div:nth-child(8) > div > div.columns.large-3.medium-6.small-12.item.float-left > div.item_title > a").click(); }, wait + 3500); }
    if (isURL("highporn")) { setTimeout(function () { document.querySelector("#wrapper > div:nth-child(2) > div.row > div > div > div > div > a").click(); }, wait + 500); }
    if (isURL("javmenu")) { setTimeout(function () { document.querySelector("#app > div > div.page-content > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > a").click(); }, wait + 500); }
    if (isURL("netflav")) { setTimeout(function () { document.querySelector("#main_segment > div > div > div.video_grid_container > div.grid_root.grid_wide > div > a:nth-child(1)").click(); }, wait + 500); }
    if (isURL("projectjav")) { setTimeout(function () { document.querySelector("body > main > div.container-fluid > div.row.movie-list.mb-2 > div:nth-child(1) > div.name > a").click(); }, wait + 500); }
    if (isURL("svjav")) { setTimeout(function () { document.querySelector("#main > div > div.widget-body > div > div.thumb > a").click(); }, wait + 500); }
    if (isURL("xslist")) { setTimeout(function () { document.querySelector("body > ul > li > h3 > a").click(); }, wait + 500); }

})();