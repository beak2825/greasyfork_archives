// ==UserScript==
// @name        SakuraFilter
// @description Hide ads.
// @author      Sakura
// @namespace   http://extensions.fenrir-inc.com/list/author/Sakura_Kocho/
// @version     2022.03.03.3
// @match       *
// @downloadURL https://update.greasyfork.org/scripts/437402/SakuraFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/437402/SakuraFilter.meta.js
// ==/UserScript==
var Filter = "Sakura"

if (location.href.indexOf("1000giribest.com/") >= 0) {
  function removeads() {
    jQuery('a[href*="http://newmofu"]').remove();
    jQuery('aside[id*="text-14"]').remove();
    jQuery('aside[id*="text-20"]').remove();
    jQuery('aside[id*="text-24"]').remove();
    jQuery('img[width*="320"]').remove();
    jQuery('nav[class*="nav-single"]').remove();
    jQuery('span[style*="color:#FF0000"]').remove();
    jQuery('TABLE').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("2ch.net/") >= 0) {
  function removeads() {
    jQuery('div[class*="col-lg-12 col-md-12 hidden-sm hidden-xs padding-zero"]').remove();
    jQuery('div[class*="sproutad_frame"]').remove();
    jQuery('div[class*="supporter supporter-top"]').remove();
    jQuery('div[class*="supporter text-center"]').remove();
    jQuery('div[id*="_mgkb _mxkb _mykb"]').remove();
    jQuery('div[id*="js-bottom-ad"]').remove();
    jQuery('iframe[src*="//stab.thench.net"]').remove();
    jQuery('img[src*="//itest.2ch.net/assets/img/ronin_premium_640x100.png"]').remove();
    jQuery('li[class*="res_ad"]').remove();
    jQuery('li[class="ad"]').remove();
    jQuery('li[id*="instant_ad"]').remove();
    jQuery('li[id*="res_ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("5ch.net/") >= 0) {
  function removeads() {
    jQuery('div[class*="col-lg-12 col-md-12 hidden-sm hidden-xs padding-zero"]').remove();
    jQuery('div[class*="sproutad_frame"]').remove();
    jQuery('div[class*="supporter supporter-top"]').remove();
    jQuery('div[class*="supporter text-center"]').remove();
    jQuery('div[div*="thumb5ch"]').remove();
    jQuery('div[id*="_mgkb _mxkb _mykb"]').remove();
    jQuery('div[id*="js-bottom-ad"]').remove();
    jQuery('iframe[src*="//stab.thench.net"]').remove();
    jQuery('img[src*="//itest.2ch.net/assets/img/ronin_premium_640x100.png"]').remove();
    jQuery('li[class*="res_ad"]').remove();
    jQuery('li[class="ad"]').remove();
    jQuery('li[id*="instant_ad"]').remove();
    jQuery('li[id*="res_ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("ameblo.jp/") >= 0) {
  function removeads() {
    jQuery('aside[class*="SpTimelineAside"]').remove();
    jQuery('div[class*="SpAdInfeed"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/anzbooks\.com/.test(location.href)){
  function removeads() {
    jQuery('div[class="load1"]').remove();
    jQuery('div[class="load2"]').children('div[align="center"]').remove();
    jQuery('div[id*="ad"]').remove();
    jQuery('div[id*="act_secretboots"]').remove();
    jQuery('div[id*="active_overlay"]').remove();
    jQuery('div[id*="footer"]').remove();
    jQuery('div[id*="sidebar"]').remove();
    jQuery('iframe[id*="gn_delivery"]').parent('div[id*="ad"]').parent('div').parent('div[align*="center"]').remove();
    jQuery('section[class*="slided"]').parent('div').remove();
    jQuery('span[id*="backbtn"]').remove();
    jQuery('span[id*="bottombtn"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/apexlegends-news\.com/.test(location.href)){
  function removeads() {
    jQuery('div[class*="bottom_ad clearfix"]').remove();
    jQuery('div[class*="adarea"]').remove();
    jQuery('div[class*="glssp_div_container"]').remove();
    jQuery('div[id*="diver_widget_pcsp-"]').remove();
    jQuery('div[id*="diver_widget_profile-"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("appmedia.jp") >= 0) {
  function removeads() {
    jQuery('div[class="app_topic"]').remove();
    jQuery('div[class="apptuber_list"]').remove();
    jQuery("div[class='h2_div']:contains('おすすめゲームランキング')").remove();
    jQuery('div[class*="header_label"]').remove();
    jQuery('div[class*="news_main"]').remove();
    jQuery('div[class="pr_tabs"]').remove();
    jQuery('div[class*="scroll-back-to-top-wrapper show"]').remove();
    jQuery('div[class*="top_news"]').remove();
    jQuery('div[id*="_popIn_infeed"]').remove();
    jQuery('div[id*="mntad"]').remove();
    jQuery('div[id*="div-gpt-ad-"]').remove();
    jQuery('div[id*="scroll_sph_menu"]').remove();
    jQuery('div[id*="sp_comments_numwrapper"]').remove();
    jQuery('div[id*="top_link_btn_wrapper"]').remove();
    jQuery('div[id*="vrizead-tag"]').remove();
    jQuery('h2[class*="header_label"]').remove();
    jQuery("div[class='rank_label']:contains('6')").parent('a').parent('div[class*="thumbnail_wrapper"]').parent('li[class*="new_articles_item"]').remove();
    jQuery('section[id*="appmedia_ad_ranking"]').remove();
    jQuery('iframe[id*="vrizead-iframe-appmedia_footer"]').remove();
    jQuery('ins[id*="ads"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("appmedia.jp/fategrandorder") >= 0) {
  function removeads() {
    jQuery('a[class*="fgo-btn fgo-appli"]').remove();
    jQuery('a[href*="https://gamecomy.jp/community/"]').remove();
    jQuery('a[href*="https://play.google.com/store/apps/details?id=jp.co.fgo.appmedia"]').remove();
    jQuery('div[class*="_XL_recommend xl_class"]').remove();
    jQuery('div[class*="dac-ivt-root-container"]').remove();
    jQuery('div[id="side"]').remove();
    jQuery("h3:contains('AppMedia攻略ライター募集')").remove();
    jQuery("h3:contains('コミュニティアプリがリリース！')").remove();
    jQuery("ul:contains('GameComy')").parent('div[class*="bg_index"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("bbspink.com") >= 0) {
  function removeads() {
    jQuery('div[div*="thumbBBS"]').remove();
    jQuery('div[id*="announcement"]').remove();
    jQuery('div[id*="bbspink-bottom-ads"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

try{
var SiteID = ld_blog_vars.provider_name;
} catch(e){
}
if (SiteID === "livedoor"){
  function removeads() {
    jQuery('aside[class*="footer-blog-banner box"]').remove();
    jQuery('div[class*="article_mid"]').remove();
    jQuery('div[class*="footer-external-links box"]').remove();
    jQuery('div[class*="gn_inline_exp"]').remove();
    jQuery('div[class="plugin-blogroll plugin-box box box-margin box-border"]').remove();
    jQuery('div[class*="plugin-extra plugin-box"]').remove();
    jQuery('div[class*="plugin-follow_buttons plugin-box box box-padding box-margin box-border"]').remove();
    jQuery('div[class*="plugin-news plugin-box box box-margin box-border"]').remove();
    jQuery('div[id*="adstir"]').remove();
    jQuery('div[id*="article_foot_v2"]').remove();
    jQuery('div[id*="article_low"]').remove();
    jQuery('div[id*="article_overlay_v2"]').remove();
    jQuery('div[id*="index_foot_v2"]').remove();
    jQuery('div[id*="index_overlay_v2"]').remove();
    jQuery('footer[id="jp-footer"]').remove();
    jQuery('iframe[id*="comment-like-frame"]').remove();
    jQuery('nav[class*="footer-external-links box"]').remove();
    jQuery('nav[class*="footer-ranking box box-margin box-border"]').remove();
    jQuery('nav[class*="footer-ranking section-box box box-margin box-border"]').remove();
    jQuery('nav[class*="linelive-ranking box box-margin box-border"]').remove();
    jQuery('nav[class*="section-box pbp-ranking-v2 box box-margin box-border"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("blog.livedoor.jp/kinisoku/") >= 0) {
  function removeads() {
    jQuery('aside[id*="lite_link"]').remove();
    jQuery('div[class*="blog_ad"]').remove();
    jQuery('div[class*="gn_inline_exp"]').remove();
    jQuery('div[class*="maist"]').remove();
    jQuery('div[class*="plugin-ad plugin-box"]').remove();
    jQuery('div[class*="plugin-ad plugin-box"]').remove();
    jQuery('div[class="plugin-blogroll plugin-box box box-margin box-border"]').remove();
    jQuery('div[class*="plugin-extra plugin-box"]').remove();
    jQuery('div[class*="plugin-free_area plugin-box box box-padding box-margin box-border"]').remove();
    jQuery('div[class*="plugin-twitter_profile plugin-box box box-padding box-margin box-border"]').remove();
    jQuery('div[class="ad2"]').remove();
    jQuery('div[id="ad"]').remove();
    jQuery('div[id*="adstir"]').remove();
    jQuery('div[id*="article_foot_v2"]').remove();
    jQuery('div[id*="article_overlay_v2"]').remove();
    jQuery('div[id*="index_foot_v2"]').remove();
    jQuery('div[id*="index_overlay_v2"]').remove();
    jQuery('div[id*="menubar_boundary"]').remove();
    jQuery('footer[id="jp-footer"]').remove();
    jQuery('iframe[id*="comment-like-frame"]').remove();
    jQuery('nav[class*="footer-external-links box"]').remove();
    jQuery('nav[class*="footer-ranking box box-margin box-border"]').remove();
    jQuery('nav[class*="section-box pbp-ranking-v2 box box-margin box-border"]').remove();
    jQuery('section[class*="menu-bar-outer"]').remove();

  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("buhidoh.net") >= 0) {
  function removeads() {
    jQuery('div[class*="dlbox"]').remove();
    jQuery('div[class*="feedbox"]').remove();
    jQuery('div[class*="imentrymid"]').remove();
    jQuery('div[class*="imfooterbig"]').remove();
    jQuery('div[class*="imgbox spimg"]').parent('div[style*="width:320px;margin:5px auto;"]').remove();
    jQuery('div[class*="impage"]').remove();
    jQuery('div[class*="imtop"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);

  var images = document.images;
  for (var i = 0, n = images.length; i < n; i++) {
    var img = images[i];
    img.src = img.src.replace(/^(.*)_thumb(_\d)?\.jpg$/, '$1.jpg');
  }

  jQuery('a[href*="http://file.buhidoh.net/images/"]').children('img').each(function () {
    jQuery(this).unwrap();
  });
}

if (location.href.indexOf("chan.sankakucomplex.com/") >= 0) {
  function removeads() {
    jQuery('div[align*="center"]').remove();
    jQuery('div[id*="headerthumbs"]').remove();
    jQuery('div[id*="news-ticker"]').remove();
    jQuery('div[id*="sank-prestitial"]').remove();
    jQuery('span[class*="thumb blacklisted"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("chiebukuro.yahoo.co.jp/") >= 0) {
  function removeads() {
    jQuery('div[class*="spImBtm"]').remove();
    jQuery('div[class*="variableBanner"]').remove();
    jQuery('div[id*="ad-sqm"]').remove();
    jQuery('div[id*="ad1"]').remove();
    jQuery('div[id*="mhd_prem_header_sp"]').remove();
    jQuery('div[id*="yjSLink"]').remove();
    jQuery('aside[class*="Detail_chie-Pages__Ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("crazyrape.net") >= 0) {
  function removeads() {
    jQuery('div[id*="footer_widget"]').remove();
    jQuery('div[id*="header_widget"]').remove();
    jQuery('div[id*="inscrollarea"]').remove();
    jQuery('div[id*="interstitial"]').remove();
    jQuery('div[id*="touchevent_contents"]').remove();
    jQuery("h3:contains('PR')").remove();
    jQuery("iframe").remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("dic.nicovideo.jp/t/") >= 0) {
  function removeads() {
    jQuery('div[class*="__uz__credit"]').remove();
    jQuery('div[class*="ad_response"]').remove();
    jQuery('div[class*="bs-Wrapper"]').css('padding-top', '0px');
    jQuery('div[class*="logly-lift-ad logly-lift-ad-ad"]').remove();
    jQuery('div[class*="logly-lift-credit logly-lift-credit2"]').remove();
    jQuery('div[class*="st-Header_Ad"]').remove();
    jQuery('div[class*="sw-Article_Menu sw-Article_Menu-fixed"]').remove();
    jQuery('div[class="st-Footer"]').css('margin-top', '-123.75px');
    jQuery('div[id*="dic_sp_300x250_middle_down"]').remove();
    jQuery('div[id*="dic_sp_320x50_overlay"]').remove();
    jQuery('div[id*="dic_sp_watch_native_middle_in_recommend_news"]').remove();
    jQuery('div[id*="dic_sp_watch_native_middle_in_recommend_video"]').remove();
    jQuery('div[id*="logly-lift-"]').parent('section[class*="sw-Article_SubContents"]').remove();
    jQuery("h2[class*='sw-Column_Title']:contains('ニコニ広告された記事')").parent('section[id*="nicoad_article_sp"]').remove();
    jQuery('li[id*="dic_sp_native_in_hot_word"]').remove();
    jQuery("p[class*='sw-Article_SubContents-title sw-Article_SubContents-pushword']:contains('急上昇ワード')").parent('section[class*="sw-Article_SubContents"]').remove();
    jQuery('section[class*="st-Ad"]').remove();
    jQuery('section[class*="st-Topnews"]').remove();
    jQuery('section[class*="sw-Column tp-TrendWord"]').remove();
    jQuery('section[id*="_adsbygoogle_linkunit_north"]').remove();
    jQuery('section[id*="niconewsapp-a-Ad"]').remove();
    jQuery('section[id*="niconewsapp-g-Ad"]').remove();
    jQuery('span[class*="article"]').children('table').width("100%");
  }
  removeads();
  setInterval(removeads, 1000);
}


if (location.href.indexOf("dic.pixiv.net/a/") >= 0) {
  function removeads() {
    jQuery('body[class*="body_touch"]').css('padding-bottom', '0px');
    jQuery('div[class*="_sensitive-warning-container"]').remove();
    jQuery('div[class*="link-to-app"]').remove();
    jQuery('div[class*="pixivcomic_body_ad"]').remove();
    jQuery('div[class*="ranobe_body_ad"]').remove();
    jQuery('div[id*="ad-d-sp"]').parent('div').parent('div').remove();
    jQuery('div[id*="bottom_pixivcomic_touch"]').remove();
    jQuery('div[id*="bottom_spotlight_touch"]').remove();
    jQuery('ins[id*="ads"]').parent('div').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/dictionary\.goo\.ne\.jp/.test(location.href)){
  function removeads() {
    jQuery('div[style*="height: 50px; position: fixed; z-index: 998; bottom: 0; width: 100%; display: block; text-align: center; background-color: rgba(59,88,152,0.5);"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("ddd-smart.net") >= 0) {
  function removeads() {
    jQuery('a[rel*="noopener"]').remove();
    jQuery('a[href*="bitcasino.io"]').parent('div[align*="center"]').remove();
    jQuery('a[href*="mens-number.site"]').parent('div[align*="center"]').remove();
    jQuery('a[href*="https://lin.ee/BsHIoMt"]').parent('div[align*="center"]').remove();
    jQuery('div[class*="inlineAd"]').remove();
    jQuery('div[class*="site-group"]').prev('h4[class*="card-panel white-text blue accent-2"]').remove();
    jQuery('div[class*="site-group"]').prev('h4[class*="card-panel white-text blue accent-2"]').remove();
    jQuery('div[class*="site-group"]').remove();
    jQuery('div[class*="site-group"]').remove();
    jQuery('div[class*="slider"]').remove();
    jQuery('div[id*="active_overlay"]').remove();
    jQuery('div[id*="ad"]').remove();
    jQuery('div[id*="gn_interstitial_area"]').parent('div').remove();
    jQuery('div[id*="Inst_area_top_space"]').remove();
    jQuery('section[class*="slidein_"]').remove();
    jQuery("h2[class*='card-panel white-text blue accent-2']:contains('ピックアップ同人誌')").next('div[class*="list-all row"]').remove();
    jQuery("h2[class*='card-panel white-text blue accent-2']:contains('ピックアップ同人誌')").remove();
    jQuery("h2[class*='card-panel white-text blue accent-2']:contains('同人誌ランキング')").next('div[class*="row"]').remove();
    jQuery("h2[class*='card-panel white-text blue accent-2']:contains('同人誌ランキング')").remove();
    jQuery("h4[class*='card-panel white-text blue accent-2']:contains('人気アニメから同人誌を探す')").next('ul[class*="row sidebar-banner"]').remove();
    jQuery("h4[class*='card-panel white-text blue accent-2']:contains('人気アニメから同人誌を探す')").remove();
    jQuery("h4[class*='card-panel white-text blue accent-2']:contains('話題アニメから同人誌を探す')").next('ul[class*="row sidebar-banner"]').remove();
    jQuery("h4[class*='card-panel white-text blue accent-2']:contains('話題アニメから同人誌を探す')").remove();
    jQuery("span[class*='pickup-header']").next('a[href*="http://anzbooks.com/"]').remove();
    jQuery("span[class*='pickup-header']").remove();
  }
  removeads();
  setInterval(removeads, 1000);

  var target, i, l = document.links.length;
  for (i = 0; i < l; i++) {
    target = document.links[i].href;
    document.links[i].href = target.replace(/\/doujinshi3\/show-m\.php\?g=(\d*)?&dir=(\d*)?&.*/, "/dl-m-m.php?cn=$1/$2&all=true&from=img");
  }
}

if (location.href.indexOf("doujinantena.com/") >= 0) {
  function removeads() {
    jQuery('CENTER').remove();
    jQuery('div[align*="center"]').remove();
    jQuery('div[class*="listtype-b"]').remove();
    jQuery('div[class*="listtype-c"]').remove();
    jQuery('div[class*="tab-content"]').remove();
    jQuery('div[id*="active_overlay"]').remove();
    jQuery('div[id*="ad"]').remove();
    jQuery('div[id*="footer"]').remove();
    jQuery('div[id*="gn_expand_area"]').remove();
    jQuery('div[id*="gn_interstitial_area"]').remove();
    jQuery('div[id*="maist"]').remove();
    jQuery('h3:contains("サポートメニュー")').remove();
    jQuery('img[src*="./common/images/title_pickup.gif"]').remove();
    jQuery('img[src*="./common/images/title_sitemap.gif"]').remove();
    jQuery('img[src*="./common/images/title_siteranking.gif"]').remove();
    jQuery('img[src*="./common/images/top_img.jpg"]').remove();
    jQuery('p[class*="notice"]').remove();
    jQuery('span[id*="banner"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/doujinnomori\.com/.test(location.href)){
  function removeads() {
    jQuery('div[class*="ad_margin"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
  var target, i, l = document.links.length;
  for (i = 0; i < l; i++) {
    target = document.links[i].href;
    document.links[i].href = target.replace(/doujinnomori\.com\/comics\/detail\?uuid=(.+?)&type=prev/, "/doujinnomori.com/comics/detail?uuid=$1");
  }
}

if (location.href.indexOf("dropbooks.tv/") >= 0) {
  function removeads() {
    jQuery('center').remove();
    jQuery('div[class*="ad"]').remove();
    jQuery('div[class*="b_line"]').remove();
    jQuery('div[class*="floorlink"]').remove();
    jQuery('DIV[class*="med_bloc"]').remove();
    jQuery('div[id*="fam"]').remove();
    jQuery('div[id*="geniee_overlay"]').remove();
    jQuery('div[id*="octopus-scr"]').remove();
    jQuery('div[style*="margin-top:-1px;border-top-width: 1px;border-top-style: solid;border-top-color: #B3B3B3;padding-top: 5px;margin-bottom: 7px;"]').remove();
    jQuery('div[style*="padding-bottom: 10px;margin-bottom: -20px;"]').remove();
    jQuery('div[style*="position: relative;bottom: -10px!important;margin-bottom: 11px!important;clear: both!important;"]').remove();
    jQuery('LI[class*="underline"]').remove();
    jQuery('script[src*="//js.octopuspop.com/"]').remove();
    jQuery('script[src*="http://107.182.234.142/ad/"]').remove();
    jQuery('script[src*="http://click-plus.genieesspv.jp/"]').remove();
    jQuery('script[src*="http://fam-ad.com/"]').remove();

  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("e-hentai.org") >= 0) {
  function removeads() {
    jQuery('iframe').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("ejje.weblio.jp/") >= 0) {
  function removeads() {
    jQuery('a').parent('p').parent('div[class*="quickDefinitionBottom"]').remove();
    jQuery('a[id*="smp-android-app-link"]').remove();
    jQuery('aside[class*="ad"]').remove();
    jQuery('aside[id*="ad"]').remove();
    jQuery('div[class*="ad"]').remove();
    jQuery("h3:contains('英語でどう言うか知ってる？')").parent('div[class*="subDivision"]').parent('div[class*="division2"]').remove();
    jQuery('div[class*="division2"]').children('div[class*="subDivision"]').next('b[class*="clr"]').next('div').remove();
    jQuery('div[class*="division2"]').children('div[class*="subDivision"]').next('b[class*="clr"]').next('h3').remove();
    jQuery('div[class*="division2"]').children('div[class*="subDivision"]').next('b[class*="clr"]').next('div').remove();
    jQuery('div[class*="division2"]').children('div[class*="subDivision"]').next('b[class*="clr"]').next('ul').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("ero-video.net/") >= 0) {
  function removeads() {
    jQuery('div[class*="advert"]').remove();
    jQuery('div[id*="fam_"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/www\.fnn\.jp/.test(location.href)){
  function removeads() {
    jQuery('a[class*="_popIn_recommend_article_ad"]').remove();
    jQuery('div[class*="ad-bnr"]').remove();
    jQuery('div[class*="logly-lift-credit logly-lift-credit"]').remove();
    jQuery('div[class*="sherpa-footer"]').remove();
    jQuery('div[class*="logly-lift-ad"]').remove();
    jQuery('div[class*="ob_what ob_what_resp"]').remove();
    jQuery('div[class*="_popIn_recommend_credit"]').remove();
    jQuery('div[class*="visible active"]').remove();
    jQuery('div[class*="sherpa-article-pr"]').parent('div[class*="sherpa-article-content"]').parent('a[class*="sherpa-article"]').parent('div[class*="sherpa-component"]').remove();
    jQuery('span[class*="ob-unit ob-rec-source"]').parent('a[class*="ob-dynamic-rec-link"]').parent('li[class*="ob-dynamic-rec-container"]').remove();
    jQuery('span[class*="ob_sfeed_logo"]').parent('a').parent('div[class*="ob_what"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/www\.google\.co\.jp/.test(location.href)){
  function removeads() {
    jQuery('div[class="Fx4vi cNUdAd"]').parent('div[class="fbar"]').remove();
    jQuery('div[class="fbar smiUbb"]').remove();
    jQuery('div[class="uEierd"]').remove();
    jQuery('div[id="tvcap"]').remove();
    jQuery('div[id="tadsb"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/gameinn\.jp/.test(location.href)){
    jQuery('body').removeClass('is5x7asParentNoScroll');
  function removeads() {
    jQuery('div[class="gi-button"]').remove();
    jQuery('div[class="kanren pop-box "]').remove();
    jQuery('div[class="lodeo_ad_spot"]').remove();
    jQuery('div[class="sns-sp"]').remove();
    jQuery('div[class="p-linkList clearfix"]').remove();
    jQuery("div[class='rssbox']").parent('div[class="sidebar-box"]').remove();
    jQuery('div[data-google-query-id]').remove();
    jQuery('div[id*="ad_interstitial_nvgl"]').remove();
    jQuery('div[id*="logly-lift"]').remove();
    jQuery('div[id*="mntad"]').remove();
    jQuery("p[class='sidetop_p']:contains('おすすめ記事')").next('div[class="wp-rss-template-container"]').remove();
    jQuery("p[class='sidetop_p']:contains('おすすめ記事')").remove();
    jQuery("p[class='sidetop_p']:contains('おすすめコンテンツ')").parent('div[class="sidebar-box"]').remove();
    jQuery("p[class='sidetop_p']:contains('最近のコメント')").next('div[class="latest-comments"]').remove();
    jQuery("p[class='sidetop_p']:contains('最近のコメント')").remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/gamerstand\.net/.test(location.href)){
  function removeads() {
    jQuery('div[class="adspace"]').remove();
    jQuery('div[class="Bnr"]').remove();
    jQuery('div[class="execphpwidget"]').parent('div[style="margin-bottom:10px;"]').remove();
    jQuery('div[class="execphpwidget"]').parent('div[style="padding:20px 0px;"]').remove();
    jQuery('div[class="glssp_div_container"]').remove();
    jQuery('div[class="pcnone"]').remove();
    jQuery('div[class="rss-antenna"]').parent('div[class="classic-text-widget"]').parent('div[style="margin-bottom:10px;"]').remove();
    jQuery('div[class="rssbox"]').remove();
    jQuery('div[class="blogbox"]').next('p[class="today_ranking"]').remove();
    jQuery('div[class="blogbox"]').next('ul[class="today_ranking_linkarea"]').remove();
    jQuery('footer[id="footer"]').remove();
    jQuery("h2:contains('原神のこちらの記事もどうぞ')").parent('div[class="classic-text-widget"]').parent('div[style="padding-top:10px;"]').remove();
    jQuery("h4[class='menu_underh2']:contains('最近のコメント')").next('ul[id="recentcomments"]').remove();
    jQuery("h4[class='menu_underh2']:contains('最近のコメント')").remove();
    jQuery("h4[class='menu_underh2']:contains('おすすめサイト')").next('div[class="classic-text-widget"]').remove();
    jQuery("h4[class='menu_underh2']:contains('おすすめサイト')").remove();
    jQuery("h4[class='menu_underh2']:contains('Twitterで更新情報発信中！')").next('div[class="classic-text-widget"]').remove();
    jQuery("h4[class='menu_underh2']:contains('Twitterで更新情報発信中！')").remove();
    jQuery('iframe').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}


if (location.href.indexOf("gamewith.jp") >= 0) {
  function removeads() {
    jQuery('a[class*="to-btn js-to-btn js-target-hideonfocuskeyboard js-move-with-expand-network-ad to-btn--menu has-no-launch-btn"]').remove();
    jQuery('a[class*="to-btn js-to-btn js-target-hideonfocuskeyboard js-move-with-expand-network-ad to-btn--menu"]').remove();
    jQuery('div[class*="_XL_recommend"]').remove();
    jQuery('div[class*="c-rectangle-ad-wrap"]').remove();
    jQuery('div[class*="js-promotion-app-banner promotion-app-banner"]').remove();
    jQuery('div[class*="to-btn--deep-link"]').remove();
    jQuery('div[class*="w-twitter-widget-component"]').remove();
    jQuery('div[id*="c-sp-leaderboard-ad-overlay js-target-hideonfocuskeyboard"]').remove();
    jQuery('div[id*="js-ad-jack"]').remove();
    jQuery('div[id*="mhd_prem_header_sp"]').remove();
    jQuery('img[src*="c-progressive-img is-lazyloaded"]').parent('div[class*="js-lazyload-img-wrap c-thumb-placeholder"]').parent('div[class*="w-article-img"]').parent('a').remove();
    jQuery("div[class*='c-title']:contains('おすすめマンガ')").parent('div[class*="c-box"]').remove();
    jQuery("div[class*='c-title']:contains('注目の攻略記事')").parent('div[class*="c-box"]').remove();
    jQuery("h3:contains('GameWith攻略ライター募集中！')").next('a').remove();
    jQuery("h3:contains('GameWith攻略ライター募集中！')").remove();
    jQuery('ins[data-zucks-frame-id]').remove();
    jQuery("span:contains('広告')").parent('div').parent('div').parent('a').parent('div[class*="im-container"]').parent('div[id*="imobile_ad_native"]').parent('div[class*="_inner is-small"]').parent('li[class*="_item"]').remove();
    jQuery("span[class*='_text']:contains('マンガ')").parent('div[class*="article-manga-tag"]').parent('div[class*="media_body _body"]').parent('a[class*="media _inner"]').parent('li[class*="_item"]').remove();
    jQuery("span[class*='c-title_text']:contains('ゲームを探す')").parent('div[class*="c-title"]').parent('div[class*="c-box"]').remove();
    jQuery("span[class*='c-title_text']:contains('攻略取り扱いゲーム')").parent('div[class*="c-title"]').parent('div[class*="c-box"]').remove();
    jQuery("span[class*='nend_ad_define']:contains('広告')").parent('div[class*="attribution"]').parent('div[class*="nend-image"]').parent('').parent('div[class*="nend-container"]').parent('a[class*="nend-link"]').parent('div[class*="nend"]').parent('div[class*="_inner is-small"]').parent('li[class*="_item"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("gamewith.jp/fgo/") >= 0) {
  function removeads() {
    jQuery("h2:contains('FGOのコラボイベント')").next('iframe').remove();
    jQuery("h2:contains('FGOのコラボイベント')").next('iframe').remove();
    jQuery("h2:contains('FGOのコラボイベント')").next('p').remove();
    jQuery("h2:contains('FGOのコラボイベント')").next('p').remove();
    jQuery("h2:contains('FGOのコラボイベント')").next('p').remove();
    jQuery("h2:contains('FGOのコラボイベント')").remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").next('iframe').remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").next('iframe').remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").next('p').remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").next('p').remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").next('p').remove();
    jQuery("h2:contains('特異点を攻略して人理焼却を止めよう')").remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('div').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('div').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('div').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('h3').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('h3').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('noscript').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('noscript').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('noscript').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").next('p').remove();
    jQuery("h2[id*='how']:contains('FGOとは？')").remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("gazo-kore.com/") >= 0) {
  function removeads() {
    jQuery('div[align*="center"]').remove();
    jQuery('div[class*="topimg"]').remove();
    jQuery('div[id*="adroute"]').remove();
    jQuery('div[id*="geniee_overlay"]').remove();
    jQuery('div[id*="gn_delivery"]').remove();
    jQuery('div[id*="maincontent"]').children('div[class*="container"]').children('ul[class*="news"]').parent('').remove();
    jQuery('div[id*="ressp_div"]').remove();
    jQuery('div[id*="wrap_div"]').remove();
    jQuery('h2[class*="title"]').remove();
    jQuery('ul[class*="btnSns"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("gazo-kore.com/images/search?type=1&id=") >= 0) {
  function removeads() {
    jQuery('div[class*="container"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/genshin\.game-chan\.net/.test(location.href)){
  function removeads() {
    jQuery('div[class="adwidget"]').parent().parent().remove();
    jQuery('div[class="adspace"]').remove();
    jQuery('div[class="bottom_ad clearfix"]').remove();
    jQuery('div[class="container_top_widget"]').remove();
    jQuery('div[class="d_sp"]').remove();
    jQuery('div[class="glssp_div_container"]').remove();
    jQuery('div[class="header_small_menu clearfix"]').remove();
    jQuery('div[class="rss-antenna"]').parent('div[class="classic-text-widget"]').parent('div[id*="classictextwidget"]').remove();
    jQuery("div[class='single_title']:contains('の関連記事')").remove();
    jQuery("div[class='single_title']:contains('おすすめ「原神」記事')").parent('div[id*="classictextwidget"]').remove();
    jQuery("div[class='single_title']:contains('前日 人気記事ランキング')").parent('div[id*="diver_widget_popularpost"]').remove();
    jQuery("div[class='widgettitle']:contains('最近のコメント')").parent('div[id*="recent-comments"]').remove();
    jQuery('div[id*="execphp"]').remove();
    jQuery('div[id*="classictextwidget"]').remove();
    jQuery('div[id="nav_fixed"]').remove();
    jQuery("html").removeClass("gn_inst_scroll_cancel");
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/genshin\.gamers-labo\.com/.test(location.href)){
  function removeads() {
    jQuery('aside[class="widget_text widget widget-main  widget_custom_html"]').remove();
    jQuery('div[class*="code-block"][class*="ai-viewport"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/genshin\.matomegamer\.com/.test(location.href)){
  function removeads() {
    jQuery('div[class*="glssp_div_container"]').remove();
    jQuery('div[id*="gn_delivery"]').remove();
    jQuery('div[id*="footer"]').remove();
    jQuery('div[id*="header"]').remove();
    jQuery('div[id*="ranking"]').remove();
    jQuery('div[id*="Ad"]').remove();
    jQuery("p:contains('まとめゲームニュース速報')").parent('a').parent('td').parent('tr').parent('tbody').parent('table').parent('li').remove();
    jQuery("html").removeClass("gn_inst_scroll_cancel");
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/genshin\.more-gamer\.com/.test(location.href)){
  function removeads() {
    jQuery('body').css('position', 'static');
    jQuery('div[class*="adPopup"]').remove();
    jQuery('div[class*="code-block"][class*="ai-viewport"]').remove();
    jQuery('div[class*="bottom_ad"]').remove();
    jQuery('div[class="glssp_div_container"]').remove();
    jQuery('div[class="share"]').remove();
    jQuery('div[id*="diver_widget_pcsp"]').remove();
    jQuery('div[id*="header"]').remove();
    jQuery('div[id*="custom_html-"]').remove();
    jQuery('div[id*="gn_delivery"]').remove();
    jQuery('div[id*="gn_interstitial_area"]').parent('div').remove();
    jQuery('footer[class="article_footer"]').children('div[class="rss-site"]').remove();
    jQuery('nav[id*="scrollnav"]').remove();
    jQuery("html").removeClass("gn_inst_scroll_cancel");
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/genshin\.wikinis\.net/.test(location.href)){
  function removeads() {
    jQuery('body').css('padding-top', '0px');
    jQuery('div[class="adbox"]').remove();
    jQuery('div[class="rssbox"]').remove();
    jQuery('div[id*="nend_adspace_"]').remove();
    jQuery('div[id*="scrollad"]').remove();
    jQuery('footer').remove();
    jQuery("h4:contains('オススメ記事')").nextAll('p').remove();
    jQuery("h4:contains('オススメ記事')").remove();
    jQuery('hr[style="border-top: 3px #00A0E9 dotted; margin-bottom: 40px"]').remove();
    jQuery('iframe').remove();
    jQuery("p[class='menu_underh2']:contains('最近のコメント')").parent('div[class="ad"]').remove();
    jQuery("p[class='menu_underh2']:contains('アンテナサイト')").parent('div[class="ad"]').remove();
    jQuery("p[class='menu_underh2']:contains('公式ツイッター')").parent('div[class="ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("gigazine.net/") >= 0) {
  function removeads() {
    jQuery('div[class*="rcontent"]').remove();
    jQuery('div[id*="EndFooter"]').remove();
    jQuery('div[id*="UFad"]').remove();
    jQuery('ui[id*="ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("himado.in/") >= 0) {
  function removeads() {
    jQuery('div[class*="ad_area"]').remove();
    jQuery('div[id*="post_twitter"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/imascg-slstage-wiki\.gamerch.com/.test(location.href)){
  function removeads() {
    jQuery('div[class*="adsense"]').remove();
    jQuery('div[class*="ui-gc_articles"]').remove();
    jQuery('div[id*="markup-3rd-ad"]').remove();
    jQuery('div[id*="ui_sp_footer_ranking"]').remove();
    jQuery('div[id="sp5"]').remove();
    jQuery('table[id*="ui_wiki_pv_in_site"]').remove();
    jQuery('div[style="background:#ddd;width: 100%;"]').remove();
    jQuery('div[style="margin: 10px 0;text-align: center;"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/imascg-slstage\.boom-app\.wiki/.test(location.href)){
  function removeads() {
    jQuery('div[class*="ad-"]').remove();
    jQuery('div[class*="banner-footer"]').remove();
    jQuery('div[class*="banner-header"]').remove();
    jQuery('div[class*="glssp_div_container"]').remove();
    jQuery("h2[class='section-title']:contains('おすすめゲームアプリランキング')").parent('div').remove();
    jQuery("h3[class='section-title']:contains('おすすめ攻略記事')").next('ul').remove();
    jQuery("h3[class='section-title']:contains('おすすめ攻略記事')").remove();
    jQuery("h2[class='section-title']:contains('ゲーム攻略Wiki')").parent("div").parent("div[class='lo-side']").remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("jin115.com/") >= 0) {
  function removeads() {
    jQuery('aside[class*="footer-blog-banner box"]').remove();
    jQuery('div[class*="footer-external-links box"]').remove();
    jQuery('div[class*="image-item"]').remove();
    jQuery('div[class*="plugin-blogroll plugin-box box box-margin box-border"]').remove();
    jQuery('div[class*="plugin-follow_buttons plugin-box box box-padding box-margin box-border"]').remove();
    jQuery('div[class*="plugin-news plugin-box box box-margin box-border"]').remove();
    jQuery('img[src*="http://livedoor.blogimg.jp/jin115/imgs/5/2/52c7ee2e.gif"]').remove();
    jQuery('li[id*="ad_popular_articles"]').remove();
    jQuery('li[id*="article-1_5"]').remove();
    jQuery('nav[class*="footer-ranking section-box box box-margin box-border"]').remove();
    jQuery('nav[class*="linelive-ranking box box-margin box-border"]').remove();
    jQuery('table[style*="text-align:left;margin-left:0;margin-right:0;"]').remove();
    jQuery('ul[id*="ad_related"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("jumpmatome2ch.biz/") >= 0) {
  function removeads() {
    jQuery('div[class*="adbox"]').remove();
    jQuery('div[class*="comment-setumei"]').remove();
    jQuery('div[class*="gazo_kotei"]').remove();
    jQuery('div[class*="c_img"]').remove();
    jQuery('div[class*="kanren-ad"]').remove();
    jQuery('div[class*="ninja-recommend-block ninja-top"]').remove();
    jQuery('div[class*="p-navi"]').remove();
    jQuery('div[class*="rss-hd"]').remove();
    jQuery('div[class*="sp-ad"]').remove();
    jQuery('div[class*="sprss"]').remove();
    jQuery('div[class*="top-kijishita"]').remove();
    jQuery('div[class*="twibutton"]').remove();
    jQuery('div[class*="zatu_top"]').remove();
    jQuery('div[class="zatudan"]').remove();
    jQuery('div[id*="blogro"]').remove();
    jQuery('div[id*="2mdtx3xh"]').remove();
    jQuery('div[id*="comments"]').remove();
    jQuery('div[id*="page-naviicon"]').remove();
    jQuery('div[id*="reaction_buttons_post"]').remove();
    jQuery('footer').remove();
    jQuery('ul[class*="kotei"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("kasi-time.com/") >= 0) {
  function removeads() {
    jQuery('div[class*="ad2"]').remove();
    jQuery('div[class*="ranking"]').remove();
    jQuery('div[class*="youtube"]').remove();
    jQuery('h2').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("loveheaven.net") >= 0) {
  function removeads() {
    jQuery('br').remove();
    jQuery('center').remove();
    jQuery('div[class*="col-lg-4 col-sm-4"]').remove();
    jQuery('div[class*="col-md-8"]').remove();
    jQuery('div[class*="end"]').remove();
    jQuery('div[class*="fade in"]').remove();
    jQuery('div[class*="quang-cao"]').remove();
    jQuery('div[class*="tab_Comment"]').remove();
    jQuery('div[class*="topday"]').remove();
    jQuery('div[class*="glx-slider-container"]').remove();
    jQuery('div[id*="block_adexchange"]').remove();
    jQuery('div[id*="oa-"]').remove();
    jQuery('div[id*="report_error"]').remove();
    jQuery('div[id*="topcontrol"]').remove();
    jQuery('font[color*="white"]').remove();
    jQuery('iframe').remove();
    jQuery('"﻿').remove();
    jQuery('img[src*="https://s4.lhscanlation.club/images/20190814/Credit_LHScan_5d52edc2409e7.jpg"]').remove();
    jQuery('img[src*="https://s4.imgmirror.club/images/20200112/5e1ad960d67b2_5e1ad962338c7.jpg"]').remove();
    jQuery("a:contains('Ads by Galaksion')").parent('div[class*="glx-watermark-container"]').parent('div').parent('div').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("m.youtube.com/") >= 0) {
  function removeads() {
    jQuery('div[id*="_mgkb _mxkb _mykb"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("majikichi.com/") >= 0) {
  function removeads() {
    jQuery('aside[class*="footer-blog-banner box"]').remove();
    jQuery('aside[id*="lite_link"]').remove();
    jQuery('div[class*="footer-external-links box"]').remove();
    jQuery('div[class*="gn_inline_exp"]').remove();
    jQuery('div[class*="plugin-blogroll plugin-box box box-margin box-border"]').remove();
    jQuery('div[class*="plugin-extra plugin-box"]').remove();
    jQuery('div[class*="plugin-follow_buttons plugin-box box box-padding box-margin box-border"]').remove();
    jQuery('div[id*="adstir"]').remove();
    jQuery('div[id*="article_foot_v2"]').remove();
    jQuery('div[id*="article_mid_v2"]').remove();
    jQuery('div[id*="article_low_v2"]').remove();
    jQuery('div[id*="article_overlay_v2"]').remove();
    jQuery('div[id*="DLsite"]').remove();
    jQuery('div[id*="index_foot_v2"]').remove();
    jQuery('div[id*="index_overlay_v2"]').remove();
    jQuery('div[id*="gn_delivery_"]').parent('div').remove();
    jQuery('footer[id="jp-footer"]').remove();
    jQuery('iframe[id*="comment-like-frame"]').remove();
    jQuery('li[id*="ad_popular_articles_"]').remove();
    jQuery('li[id*="article-1_5"]').remove();
    jQuery('nav[class*="footer-external-links box"]').remove();
    jQuery('nav[class*="footer-ranking box box-margin box-border"]').remove();
    jQuery('nav[class*="footer-ranking section-box box box-margin box-border noimage"]').remove();
    jQuery('nav[class*="linelive-ranking box box-margin box-border"]').remove();
    jQuery('nav[class*="section-box pbp-ranking-v2 box box-margin box-border"]').remove();
    jQuery('ul[class*="related-articles-list sp-infeed-ad-list"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/manga100\d\.com/.test(location.href)){
  function removeads() {
    jQuery('center[style*=" margin-bottom: 10px; "]').remove();
    jQuery('div[class*="bottom-header"]').remove();
    jQuery('div[class*="share"]').remove();
    jQuery('div[class*="inner-wrapper"]').children('center').remove();
    jQuery('div[id*="exo_slider"]').remove();
    jQuery('footer[class*="site-footer"]').remove();
    jQuery('iframe').remove();
    jQuery('p[class*="has-text-color"]').remove();
    jQuery('span[style*="color: #000;"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("manga-spot.com/") >= 0) {
  function removeads() {
    jQuery('div[class*="wpp_title"]').remove();
    jQuery('div[id*="imp_plus_container"]').remove();
    jQuery('div[id*="related-entries"]').remove();
    jQuery('span[id*="ad_batsu"]').remove();
    jQuery('ul[class*="wpp-list"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("matome.naver.jp/") >= 0) {
  function removeads() {
    jQuery('div[class*="MdCMN10Ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/moeimg\.net/.test(location.href)){
  function removeads() {
    jQuery('div[class*="entryblock share"]').remove();
    jQuery('div[class*="entryblock follow"]').remove();
    jQuery('div[class*="intro"]').remove();
    jQuery('div[class*="news_3"]').prev('div[class*="box_title"]').parent('div[class*="entryblock"]').remove();
    jQuery('div[class*="sp_ad"]').remove();
    jQuery('div[id*="fam_fam8_ol"]').remove();
    jQuery('div[id*="footer"]').remove();
    jQuery('div[id*="pickup-link"]').remove();
    jQuery('div[id*="sp_ad_entry_header"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (/momoniji\.com/.test(location.href)){
  function removeads() {
    jQuery('aside[id*="execphp-"]').remove();
    jQuery('aside[id*="pc_text-"]').remove();
    jQuery('div[class*="entry-content"]').children('ol').nextAll().remove();
    jQuery('div[class*="img-src"]').prev('br').prev('script').prev('div').remove();
    jQuery('div[class*="sns-share"]').remove();
    jQuery('div[class*="sns-follow"]').remove();
    jQuery('div[class*="pcNone"]').remove();
    jQuery('aside[id*="mobile_text"]').remove();
    jQuery('div[id*="content-top"]').remove();
    jQuery('div[id*="content-bottom"]').remove();
    jQuery('div[id*="execphp"]').remove();
    jQuery('div[id*="fam_fam8_ol"]').remove();
    jQuery('div[id*="fam_adrt_ol_dir"]').remove();
    jQuery('div[id*="footer-in"]').remove();
    jQuery('div[id*="mobile_text"]').remove();
    jQuery('span[class*="pc-no"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("morofree.com/") >= 0) {
  function removeads() {
    jQuery('div[class*="adplayer"]').remove();
    jQuery('script[src*="http://fam-ad.com/"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/news\.mynavi\.jp/.test(location.href)){
    jQuery('.articleList-related-article').css('min-height', '0px');
    jQuery('.articleList-along').css('min-height', '0px');
    jQuery('.articleList-attention').css('min-height', '0px');
  function removeads() {
    jQuery('a[class*="_popIn_recommend_article_ad"]').parent('li').remove();
    jQuery('div[class*="_popIn_recommend_container"]').remove();
    jQuery('div[class*="c-sideBanner_articleBottom"]').remove();
    jQuery('div[class*="c-sideBlock c-sidePickup"]').remove();
    jQuery('div[class*="overLayBnr js-overLayBnr"]').remove();
    jQuery('div[class*="headerBillboard js-headerBillboard"]').remove();
    jQuery('div[id*="_popIn_kanren_life"]').remove();
    jQuery('div[id*="gn_interstitial_area"]').remove();
    jQuery('footer[class*="_popIn_recommend_footer"]').remove();
    jQuery('li[class*="c-sideBanner_articleBottom"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("nijie.info") >= 0) {
  function removeads() {
    jQuery('img[class*="login_mozaiku"]').removeClass("login_mozaiku");
    jQuery('section[id*="footer_ad"]').remove();
    jQuery('section[id*="header_ad"]').remove();
    jQuery('section[id*="tieup_column"]').remove();
    jQuery('section[id*="view_banner_ad"]').parent('div').remove();
    jQuery("p:contains('おすすめのイラスト')").parent('div').parent('div[id*="illust-list"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("nlab.itmedia.co.jp/") >= 0) {
  function removeads() {
    jQuery('div[class*="_popIn_recommend_article _popIn_recommend_article_ad"]').remove();
    jQuery('div[class*="y_ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("pixiv.net/") >= 0) {
  function removeads() {
    jQuery('div[class*="ad-frame-container t_native_grid"]').remove();
    jQuery('div[class*="ad-frame-container"]').parent('div').remove();
    jQuery('div[class="premium-lead-t-popular-d-body popular-search-trial"]').remove();
    jQuery('div[class="premium-lead-new-t-info-home-top"]').remove();
    jQuery('div[class*="ad-container"]').remove();
    jQuery('div[class*="ad-topmost-header"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if (location.href.indexOf("pornhub.com") >= 0) {
  function removeads() {
    jQuery('div[class*="adContainer"]').remove();
    jQuery('div[class*="topAdContainter"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}

if(/syosetu\.com/.test(location.href)){
  function removeads() {
    jQuery('div[class*="koukoku"]').remove();
    jQuery('div[class*="c-ad"]').remove();
  }
  removeads();
  setInterval(removeads, 1000);
}


if (location.href.indexOf("http") >= 0) {
  function removeads2() {
    jQuery('a[href*="spsvcsp.i-mobile.co.jp/ad_link.ashx"]').remove();
    jQuery('div[class*="adspace"]').remove();
    jQuery('div[class*="adwidget"]').remove();
    jQuery('div[class*="adingoFluctOverlay"]').remove();
    jQuery('div[class*="btn-ldb-bottomAdd"]').remove();
    jQuery('div[class*="yadsOverlay"]').remove();
    jQuery('div[id*="active_overlay"]').remove();
    jQuery('div[id*="adingoFluctOverlay"]').remove();
    jQuery('div[id*="ad_interstitial_nvgl"]').remove();
    jQuery('div[id*="ad_inview_area"]').remove();
    jQuery('div[id*="div_fam_async"]').remove();
    jQuery('div[id*="div-gpt-ad-"]').remove();
    jQuery('div[id*="gn_delivery_"]').remove();
    jQuery('div[id*="google_ads_iframe"]').remove();
    jQuery('div[id*="smac_"]').remove();
    jQuery('div[id*="unitedblades_div"]').remove();
    jQuery('iframe[id*="google_ads"]').remove();
    jQuery('ins[id*="ads"]').remove();
    jQuery('ins[id*="geniee_overlay_outer"]').remove();
    jQuery('ins[class*="adsbygoogle"]').remove();
  }
  removeads2();
  setInterval(removeads2, 1000);
}