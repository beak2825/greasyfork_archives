// ==UserScript==
// @name         minimumAntennaSkipper
// @name:ja      minimumAntennaSkipper（なるべく最小の記述でアンテナをスキップするスクリプト）
// @namespace    minimumAntennaSkipper
// @version      0.1.9
// @description  A script that skips antenna sites with minimal writing. The number of supported sites is increased according to my needs.
// @description:ja  最低限の記述でアンテナサイトをスキップするスクリプトです。対応サイトは、自分の必要に応じて増やしています。
// @author   iHok
// @match        http*://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480953/minimumAntennaSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/480953/minimumAntennaSkipper.meta.js
// ==/UserScript==

//(function() {
setTimeout(()=>{
    'use strict';
    let eArr = [
     ['//url','//target'],
     ['https://finance.yahoo.co.jp','.pageLink a'],
     ['https://itest.5ch.net','#link_wrap a'],
     ["https://kitaaa.net",'a[rel~=\'nofollow\'].text-danger'],
     ['https://newmofu.doorblog.jp','.title_link a .linktitle, .title_link a:visited .linktitle, .title_link a:before'],
     ['https://baseball-mag.net','[style="color:#F33 !important;"]'],
     ['http://matometatta-news.net','#article-block [data-type="catchy"] .entry-title a'],
     ['https://kaihan-antenna.com','.content-list .list-selected'],
     ['http://tokkaban.com','.blogroll .container #blogroll-content li.current a'],
     ['https://kaigai.ch','section.e.pickup a.readmore'],
     ['http://kaigaiblog.antenam.biz','span.target_item a'],
     ['http://tokotoko.2chblog.jp','a.Bp2ArchiveOne:hover span.Bp2ATitle i, a.Bp2ATitleKiji span.Bp2ATitle i'],
     ['https://tokotoko.2chblog.jp','a.Bp2ArchiveOne:hover span.Bp2ATitle i, a.Bp2ATitleKiji span.Bp2ATitle i'],
     ['https://nonokoto.itigo.jp','.entry-content a[rel="noopener"][target="_blank"]'],
     ['https://nikkejp.antenam.jp','span.target_item a'],
     ['http://newresu1.blog.fc2.com','#pickupnews .title_link_a'],
     ["https://kimetsu.5chmap.com",".list-group-item:not([rel=\"nofollow\"]) [style=\"color:red;\"]"],
     ["https://asoku.net",".post_item_title"],
     ["http://newero1.blog.fc2.com","#pickupnews .title_link_a"],
     ["https://yuukoku.net",'a.hl_title1'],
     ["https://owata.chann.net",'li.pickup'],
     ["https://anaguro.yanen.org",'[style="background-color:#ffffe8;"] .title'],
     ["https://jump.5ch.net",'.url-redirect'],
     ["https://matomeja.jp",'.feed .contents .feed-list .entry-item.active'],
     ["https://ii-antenna.net",'[style="color:#F22;"]'],
     ["http://news.owata-net.com",'#headline_block .headline .active .title a'],
     ["http://anige.owata-net.com",'#headline_block .headline .active .title a'],
     ["http://2ch-mma.com","#article [data-type=\"catchy\"] .entry-title a"],
     ["https://asoku.net","[style=\"color:#f00;font-weight: bold;\"]"],
     ["http://news-choice.net","#article-block [data-type=\"catchy\"] .entry-title a"],
     ["https://kaigai-news.com","span[style=\"color:#f00;font-weight: bold;\"]"],
     ["https://newser.cc","tr.target td.news-link a"],
     ["https://world-best-news.doorblog.jp","font[color=\"RED\"]"],
     ["https://news-channel.doorblog.jp","font[color=\"RED\"]"],
     ["https://www.i-pclub.com",".ossm, .ossm2"],
     ["https://new-soku.net",".target_article"],
     ["https://sanyomu.blog.jp","a.Bp2ArchiveOne:hover span.Bp2ATitle i, a.Bp2ATitleKiji span.Bp2ATitle i"],
     ["https://kita-kore.com",".antenna-categories-index .top-area .articles-area .articles .article.active, .home-index .top-area .articles-area .articles .article.active, .archives-show .top-area .articles-area .articles .article.active, .websites-articles-index .top-area .articles-area .articles .article.active"],
     ["https://katuru.com",".rssget_red a"],
     ["http://newpuru.doorblog.jp","a.p.titlelink"],
     ["https://news-choice.net","#article-block [data-type=\"catchy\"] .entry-title a"],
     ["https://the-3rd.net","[style=\"background-color:rgb(231, 222, 220);\"]"],
     ["https://tokkaban.com",".blogroll .container #blogroll-content li.current a"],
     ["https://nullpoantenna.com","a.feed-click"],
     ["https://news.owata-net.com","#headline_block .headline .active .title a"],
     ["http://blog-news.doorblog.jp",".title_link"],
     ["https://moudamepo.com",".pickup"],
     ["https://get2ch.net","[style=\"color:#F55;font-weight:bold;\"]"],
     ["https://2channeler.com",".pickup"],
     ["https://newyaku.blog.fc2.com","#pickupnews .title_link_a"],
     ["http://newyaku.blog.fc2.com","#pickupnews .title_link_a"],
     ["https://2ch-c.net","[style=\"color:#d14 !important;\"]"],
     ["http://newmofu.doorblog.jp",".title_link a .linktitle, .title_link a:visited .linktitle, .title_link a:before"],
     ["https://matomeantena.com","#feed .main-box .list li.current a"],
     ["https://kaigai-antenna.com",".post.target a"]];
    eArr[-1]=["//notFindHost",false];
    const eX=document.querySelector(eArr[eArr.findIndex(([x]) => x === location.origin)][1]);
    if(eX){
        location.href=eX?.href||eX.querySelector("[href]")?.href||eX?.parentNode?.href||eX?.parentNode?.parentNode?.href||eX?.src;
    }
},100)
//})();