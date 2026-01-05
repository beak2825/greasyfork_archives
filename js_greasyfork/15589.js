// ==UserScript==
// @name        AntennaSkipper
// @namespace   jp.gr.java_conf.kyu49.antenna_skipper
// @description アンテナサイトをGoogle 検索経由でスキップする
// @include http*
// @version     7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15589/AntennaSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/15589/AntennaSkipper.meta.js
// ==/UserScript==
var array=[
  "2ch.logpo.jp",
  "2ch-2",
  "2ch-a.net",
  "2ch-b.net",
  "2ch-c.net",
  "2ch-n.net",
  "2ch.jpn.org",
  "2ch-mma.com",
  "2ch-matome",
  "2ch-matomato",
  "2ch.logpo.jp",
  "konowaro.net",
  "kita-kore.com",
  "kanone.biz",
  "2chmatomeru.info",
  "antennash.com",
  "anipo.jp",
  "applinews24",
  "blog.livedoor.jp/akb48summary",
  "besttrendnews.net",
  "choco-board.com",
  "logpo.jp",
  "matomeume.com",
  "matomeye.com",
  "modezeichnen.com",
  "omatome-antenna.com",
  "newresu1.blog.fc2.com",
  "news-channel.doorblog.jp",
  "newpuru.doorblog.jp",
  "news-three-stars.net",
  "newyaku.blog.fc2.com",
  "ii-antenna.net",
  "jyouhouya3.net",
  "watch2ch.2chblog.jp",
  "merry-news.com",
  "matometatta-news.net",
  "matomeantena.com",
  "matomeye.com",
  "the-3rd.net",
  "egone.org",
  "espacesuite.com",
  "news-choice.net",
  "new-soku.net",
  "sta-navi.net",
  "giko-news.com",
  "gatyapin.info",
  "matomeja.jp",
  "afo-news.com",
  "blog-news.doorblog.jp",
  "blog.livedoor.jp/houkagoguide",
  "blog.livedoor.jp/ind_bikkuri",
  "www.miji.be",
  "okkaban.com",
  "owata-net.com",
  "owata.chann.net",
  "antennabank.com",
  "rss.harikonotora.net",
  "newspickup.com",
  "newmofu.doorblog.jp",
  "newresu1.blog.fc2.com",
  "lifeantenna.com/feed",
  "www.tarikin.net/view",
  "nullpoantenna.com",
  "newser.cc",
  "owata.chann.net",
  "kateich.net",
  "news-pod.net",
  "uhouho2ch.com",
  "rd.app-heaven.net",
  "news-select.net",
  "matomeja.jp",
  "matome-alpha.com",
  "moudamepo.com",
  "anaguro.yanen.org",
  "jiwaxbuzz.link/ouou",
  "antenam.info",
  "besttrendnews.net",
  "news.harikonotora.net",
  "wk-tk.net",
  "modezeichnen.com",
  "news-three-stars.net",
  "uhouho2ch.com",
  "webnew.net",
  "get2ch.net",
  "wantena.net"
];
if(self.location.href.substring(0,15) === top.location.href.substring(0,15)){
  //デバッグ用
}else{
  return;
}
var len_target=array.length;
var href;
setTimeout(function(){
  if(location.href.indexOf("-youtube+-youtube")!=-1){
    var tags=document.getElementsByClassName("g");
    for(var i=0; i<tags.length; i++){
      href=tags[i].getElementsByTagName("a")[0].href;
      if(href.indexOf("youtube")==-1){
        location.href=href;
        break;
      }
    }
  }else{
    var links=document.getElementsByTagName('a');
    var len_links=links.length;
    var link;
    for(var i = 0; i<len_links; i++){
      for(var j =0; j<len_target; j++){
        if(links[i].href.indexOf(array[j])!=-1){
          //link=encodeURI(links[i].text.replace(/<.+?>/g,"").substr(0, 20));
          link=encodeURI(links[i].text.replace(/<.+?>/g,"").replace(/(\(.+?\))|([.+?])|(【.+?】)/g,""));
          links[i].href="http://www.google.com/search?q="+link+"+-youtube+-youtube";
        }
      }
    }
  }
}, 1000);