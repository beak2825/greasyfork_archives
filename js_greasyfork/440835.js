// ==UserScript==
// @name        SakuraFilterBeta
// @description Remove elements of the ad.
// @author      Sakura
// @namespace   http://extensions.fenrir-inc.com/list/author/Sakura_Kocho/
// @version     2025.09.22.008
// @match       http://*/*
// @match       https://*/*
// @exclude     https://seiga.nicovideo.jp
// @exclude     https://sp.seiga.nicovideo.jp*
// @downloadURL https://update.greasyfork.org/scripts/440835/SakuraFilterBeta.user.js
// @updateURL https://update.greasyfork.org/scripts/440835/SakuraFilterBeta.meta.js
// ==/UserScript==
var Filter = "Sakura"
var SakuraBlock;
var SakuraBlockAll;
var i;

function Remove() {
  try{
    for(i = 0;i < SakuraBlock.length;i++){
      SakuraBlock[i].remove();
    }
  } catch(e){}
};
function RemoveOne() {
  try{
    SakuraBlock.remove();
  } catch(e){}
};
function RemoveParent(level = 1) {
  try {
    for (let i = 0; i < SakuraBlock.length; i++) {
      let target = SakuraBlock[i];
      for (let n = 0; n < level; n++) {
        if (target && target.parentNode) {
          target = target.parentNode;
        } else {
          target = null;
          break;
        }
      }
      if (target && target.remove) {
        target.remove();
      }
    }
  } catch (e) {
    console.error(e);
  }
}
function Hide() {
  try {
    for (let i = 0; i < SakuraBlock.length; i++) {
      SakuraBlock[i].style.setProperty('display', 'none', 'important');
    }
  } catch (e) {}
}

function HideOne() {
  try {
    SakuraBlock.style.setProperty('display', 'none', 'important');
  } catch (e) {}
}

function HideParent(level = 1) {
  try {
    for (let i = 0; i < SakuraBlock.length; i++) {
      let target = SakuraBlock[i];
      for (let n = 0; n < level && target?.parentNode; n++) {
        target = target.parentNode;
      }
      if (target && target instanceof Element) {
        target.style.setProperty('display', 'none', 'important');
      }
    }
  } catch (e) {}
}
function RemoveParentDiv() {
  try{
    for(i = 0;i < SakuraBlock.length;i++){
      SakuraBlock[i].parentNode.querySelector('div').remove();
    }
  } catch(e){}
};
function RemoveXPathFirst() {
  try{
    var ResultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    document.evaluate(SakuraBlock, document, null, ResultType, null).singleNodeValue.remove();
  } catch(e){}
};
function RemoveXPathParent() {
  try{
    var ResultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    document.evaluate(SakuraBlock, document, null, ResultType, null).singleNodeValue.parentNode.remove();
  } catch(e){}
};
function RemoveXPathSET() {
  try{
    var ResultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    SakuraBlock = document.evaluate(SakuraBlock, document, null, ResultType, null).singleNodeValue;
  } catch(e){}
};
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}



if(/appmedia\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="ad_sp_header"]'); 									Remove();
    SakuraBlock = document.querySelectorAll('div[id*="mntad"]'); 											Remove();
    SakuraBlock = document.querySelectorAll('appmedia-ad-pr[id="ad_pr_ranking"]'); 							Remove();
    SakuraBlock = document.querySelectorAll('section[id="recommend_posts_ad"]'); 							Remove();
    SakuraBlock = document.querySelectorAll('a[href="https://appmedia.jp/appli-data?id=1063"]'); 			Remove();
    SakuraBlock = document.querySelectorAll('a[href="https://www.youtube.com/@FGOAppMedia"]'); 				Remove();
    SakuraBlock = document.querySelectorAll('iframe[id="vrizead-iframe-appmedia_footer"]'); 				Remove();
    SakuraBlock = document.querySelectorAll('ul[class="youtube_ul"]'); 										Remove();
    SakuraBlock = '//h2[@id="2"][text()="FGO攻略班の最新動画"]';											RemoveXPathSET();
    try{SakuraBlock.remove();} catch(e){}
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/ddd-smart\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('a[href*="lin.ee"]');													Remove();
    SakuraBlock = document.querySelectorAll('a[rel*="noopener"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[data-zone-id]');													RemoveParentDiv();
    SakuraBlock = document.querySelectorAll('div[class*="adContainer"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="article-card"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="video-card"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="video-play"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="adWrapper"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="slider"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="content-scroll-img"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class="favorite-btn-area"]');										Remove();
    SakuraBlock = '//h2[@class="card-panel white-text blue accent-2"][text()="本日のおすすめ作品"]';					RemoveXPathSET();
    try{SakuraBlock.nextElementSibling.remove();} catch(e){}
    try{SakuraBlock.remove();} catch(e){}
    SakuraBlock = '//h2[@class="card-panel white-text blue accent-2"][text()="同人誌ランキング"]';					RemoveXPathFirst();
    SakuraBlock = '//h2[@class="card-panel white-text blue accent-2"][text()="同人誌ランキング"]';					RemoveXPathFirst();
    SakuraBlock = document.querySelectorAll('div[id*="ranking_doujinshiweekly"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[id*="inviewstitial"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[id*="delaystitial"]');												Remove();
    SakuraBlock = '//h2[@class="card-panel white-text blue accent-2"][text()="ピックアップ同人誌"]';					RemoveXPathFirst();
    SakuraBlock = document.querySelectorAll('div[class*="list-all row"]')[1];										RemoveOne();
    SakuraBlock = '//h4[@class="card-panel white-text blue accent-2"][text()="色々な同人誌を探す"]';					RemoveXPathFirst();
    SakuraBlock = document.querySelectorAll('ul[class*="rss"]');													Remove();
    SakuraBlock = document.querySelectorAll('span[class*="pickup-header"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="site-link card-panel row card"]');							RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class*="card-wrap"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin:1em 0 2em 0; padding: 2px 0;"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin:1em 0 1em 0; padding: 2px 0;"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin-top:1em;"]');										Remove();
    SakuraBlock = '//h4[@class="card-panel white-text blue accent-2"][text()="おすすめエロサイト"]';					RemoveXPathFirst();
    SakuraBlock = document.querySelectorAll('section[class*="slidein"]');											Remove();
  }
  SiteRemove();
  document.cookie = "delaystitial_freqencyCap_ddd-smart.net=true; domain=.ddd-smart.net; max-age=86400; path=/;";
  setInterval(SiteRemove, 1000);
  for (i = 0; i < document.links.length; i++) {
    console.log(document.links[i].href);
    document.links[i].href = document.links[i].href.replace(/\/doujinshi3\/show-m\.php\?g=(\d*)?&dir=(\d*)?&.*/, "/dl-m-m.php?cn=$1/$2&all=true&from=img");
  }
};

if(/doujinnomori\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('a[href*="/ranking"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[id*="gn_interstitial_area"]');									RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[id*="delaystitial"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad_margin"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="adWrapper"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="AdnFullWide"]');										RemoveParent(2);
    SakuraBlock = document.querySelectorAll('div[class*="button"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="root"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="box-wrap"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="content-scroll-img"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class*="tab"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="video"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class="pc-none"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class="enlarge"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class="wrap"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class="ipprtcnt"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="out-scroll"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[style*="position: fixed;"]');		Remove();
    SakuraBlock = document.querySelectorAll('div[data-zone-id]');												Remove();
    SakuraBlock = document.querySelectorAll('aside[id*="sidebar"]');											Remove();
    SakuraBlock = document.querySelectorAll('section[class*="slided"]');										RemoveParent(2);
    SakuraBlock = '//span[@class="heading2__text"][text()="あなたにおすすめの作品を見る"]';					RemoveXPathParent();
    SakuraBlock = document.querySelectorAll('footer[id*="footer"]');											Remove();
    SakuraBlock = document.querySelectorAll('ul[class="rss"]');													RemoveParent(1);
    SakuraBlock = '//span[@class="heading2__text"][text()="他の作品を見る"]';									RemoveXPathParent()
    try{document.querySelectorAll('html')[0].classList.remove("gn_inst_scroll_cancel");} catch(e){}
    localStorage.setItem('BetterJsPop_lastOpenedAt', Date.now());
    localStorage.setItem('seenLanding_Spot', Date.now());
  }
  SiteRemove();
  document.cookie = "delaystitial_freqencyCap_doujinnomori.com=true; domain=.doujinnomori.com; max-age=86400; path=/;";
  for (i = 0; i < document.links.length; i++) {
    console.log(document.links[i].href);
    document.links[i].href = document.links[i].href.replace(/doujinnomori\.com\/comics\/detail\?uuid=(.+?)&type=prev/, "/doujinnomori.com/comics/detail?uuid=$1");
  }
  setInterval(SiteRemove, 1000);
};

if(/game8\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="ad"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[class*="l-fixedFunctionLinkContainer"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ad"]');														Remove();
    SakuraBlock = document.querySelectorAll('browsispot');															Remove();
    SakuraBlock = document.querySelectorAll('a[class*="pointLink"]');												Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/blog\.livedoor\.jp\/kinisoku/.test(location.href)){
  function SiteRemove() {
      try{
          SakuraBlock = document.querySelectorAll('aside[id="lite_link"]');								Remove();
          SakuraBlock = document.querySelectorAll('div[class="ad2"]');									Remove();
          SakuraBlock = document.querySelectorAll('div[class="plugin-extra plugin-box"]');				RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="blog_ad"]');								Remove();
          SakuraBlock = document.querySelectorAll('div[class*="gn_inline_exp"]');						Remove();
          SakuraBlock = document.querySelectorAll('div[class*="plugin-follow_buttons"]');				RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="plugin-twitter_follow_button"]');		RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="plugin-blogroll"]');						RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="plugin-twitter_profile"]');				RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="plugin-free_area"]');					RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[class*="ldapp-article-description"]');			Remove();
          SakuraBlock = document.querySelectorAll('div[id*="ad"]');										Remove();
          SakuraBlock = document.querySelectorAll('div[id="top_ad"]');									Remove();
          SakuraBlock = document.querySelectorAll('div[id="index_top_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="menubar_boundary"]');						Remove();
          SakuraBlock = document.querySelectorAll('div[id="index_foot_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_top"]');								Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_top_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_low_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_foot_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_mid_v2"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="article_bottom_v2"]');						Remove();
          SakuraBlock = document.querySelectorAll('div[id="bottom_space"]');							Remove();
          SakuraBlock = document.querySelectorAll('div[id="adstir_recommend"]');						RemoveParent(1);
          SakuraBlock = document.querySelectorAll('div[id*="adstir_inview"]');							Remove();
          SakuraBlock = document.querySelectorAll('section[class*="menu-bar-outer tracking"]');			Remove();
          SakuraBlock = document.querySelectorAll('footer[id="jp-footer"]'); 							Remove();
          SakuraBlock = document.querySelectorAll('iframe[data-tweet-id="1767084557575369183"]'); 		RemoveParent(1);
          SakuraBlock = '//span[text()="★おすすめピックアップ"]';										RemoveXPathSET();
          if (!!SakuraBlock) {
              SakuraBlock.parentNode.parentNode.parentNode.remove();
          }
          SakuraBlock = '//span[text()="★今週のおすすめ"]';										RemoveXPathSET();
          if (!!SakuraBlock) {
              SakuraBlock.parentNode.parentNode.parentNode.remove();
          }
      } catch(e){}
  }
  SiteRemove();
  addGlobalStyle('span[id*="jizsl"] { clip-path: polygon(1px 1px, 1px 1px, 1px 1px ,1px 1px) !important; }');
  addGlobalStyle('iframe[src="about:blank"] { width: 0px !important; }');
  addGlobalStyle('iframe[src="about:blank"] { clip-path: polygon(1px 1px, 1px 1px, 1px 1px ,1px 1px) !important; }');
  //  addGlobalStyle('iframe[src="about:blank"] { height: 0px !important; }');
  // addGlobalStyle('span[style*="display: block; margin: 0 auto;"] { display: none !important; }');
  // addGlobalStyle('iframe[src="about:blank"] { display: none !important; }');
  setInterval(SiteRemove, 1000);
};

if(/mangagohan\.me/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="ads-btw"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="summary_content_wrap"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="manga-discussion wrapper"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class*="sidebar-col col-md-4 col-sm-4"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class*="main-sticky-mangas main-col-inner c-page"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="wpd-left-content"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="main-col col-12 col-sm-8 col-md-8 col-lg-8"]');			RemoveParent(1);
    SakuraBlock = document.querySelectorAll('footer[class*="site-footer"]');										Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/pixiv\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="ad-frame-container t_native_grid"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-frame-container"]');									RemoveParentDiv();
    SakuraBlock = document.querySelectorAll('div[class*="premium-lead-t-popular-d-body popular-search-trial"]');	Remove();
    SakuraBlock = document.querySelectorAll('div[class*="premium-lead-new-t-info-home-top"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-container"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-topmost-header"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-frame-headerbidding"]');								RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class*="premium-denki-t-footer"]');								RemoveParentDiv();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gamerstand\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="execphpwidget"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class="Bnr"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[style*="z-index: 2147483647;"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[class="rss-antenna"]');					RemoveParent(1);
  }
  try { document.body.style.position = "relative"; } catch(e) {}
  try { document.documentElement.className = ''; } catch(e) {}
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/matomegamer\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="glssp_div_container"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[class="headad"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="gn_delivery"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[id*="footer"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="header"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ranking"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="Ad"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ats-insert_ads"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[id*="glssp_wipe_container"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="zone_id_"]');							Remove();
    SakuraBlock = document.querySelectorAll('iframe');										Remove();
    SakuraBlock = '//p[text()="まとめゲームニュース速報"]';									RemoveXPathSET();
    if (!!SakuraBlock) {
      SakuraBlock.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }
  }
  try {
    document.querySelector('div[id="contents"]').style.margin = "5px 0px 0px 0px";
    document.querySelector('div[id="contents"]').style.width = "100%;";
    document.querySelectorAll('ul.article-list li').forEach(function(el) { el.style.margin = "0 5px 6px 5px"; });
  } catch(e) {}
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/doujinantena\.top/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="asmr18"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[id="player-container"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class="home-h"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[style*="max-width: 1000px"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="isboostSideSlideShow"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-banner-area"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[style*="margin-bottom"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style*="width: 300px;"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style*="clear: both;"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[id*="veot_contents"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[id*="lorl_content"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[id*="inst_area"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[style="max-width: 1200px; width: 92%; height: 400px; margin: 0 auto 80px auto; background-color: #fff;"]');						Remove();
    document.documentElement.classList.remove("inst_scrollCancel");
    localStorage.setItem('returnAdLastShow', Date.now());
    for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      if (key && key.startsWith('__PPU_SESSION_')) {
        sessionStorage.setItem(key, '4070908800000|4070908800000|4|4070908800000|0|0|4070908800000');
      }
    }
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
  window.addEventListener('popstate', function () {
    history.back();
  });
    (() => {
        const images = document.querySelectorAll('.post-list-image img');
        if (images.length === 0) return;

        images.forEach((img) => {
            const src = img.src;
            const testImg = new Image();

            testImg.onload = () => {
                if (!testImg.complete || testImg.naturalWidth <= 2 || testImg.naturalHeight <= 2) {
                    img.src = src.replace('1.webp', '2.webp');
                }
            };

            testImg.onerror = () => {
                img.src = src.replace('1.webp', '2.webp');
            };

            testImg.src = src;
        });
    })();
};

if(/mangarawjp\.so/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('a[class*="scrollup"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[style*="text-align: center"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[id*="footer-menu"]');						Remove();
    SakuraBlock = document.querySelectorAll('iframe');										Remove();
    window.localStorage.setItem("__PPU_SESSION_1_1951354", "0|" + Date.now() + "|1|" + Date.now() + "|1|0");
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/kemono\.su/.test(location.href)){
  function SiteRemove() {
//    SakuraBlock = document.querySelectorAll('div[class*="root--ujvuu"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style*="height: 100vh"]');					Remove();
    SakuraBlock = document.querySelectorAll('footer[class*="global-footer"]');				Remove();
    SakuraBlock = document.querySelectorAll('iframe');										Remove();
    try{
      if (!document.querySelector('div[style*="height: 100vh"]')) {
        document.querySelector('button[class*="close-button"]').click();
      }
    } catch(e){}
  }
  SiteRemove();
  window.localStorage.setItem("__SCSpotAppeared", Date.now());
  window.localStorage.setItem("scashSpotLastShown", Date.now());
  window.localStorage.setItem("last_checked_has_pending_review_dms", Date.now());
  window.localStorage.setItem("has_pending_review_dms", false);
  window.localStorage.setItem("__storage_test__", "__storage_test__");
  window.localStorage.setItem("tusSupport", "null");
  window.sessionStorage.setItem("__PPU_SESSION_1_1943108", Date.now() + "|" + Date.now() + "|1|" + Date.now() + "|0|0");
  setInterval(SiteRemove, 1000);
};

if(/kotobank\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('aside[id="ftInfo"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class*="sp-word-ad"]');					Remove();
  }
  document.querySelector('body').style.padding = "0";
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/dictionary\.goo\.ne\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="NR-ad"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id="app-promo-dialog"]');					Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/majikichi\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[id*="adspot"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="article_"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id*="index_foot"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[id="article_bottom_v2"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[id*="smac"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[id*="div_fam"]');							Remove();
    SakuraBlock = document.querySelectorAll('iframe[framespacing="0"]');					RemoveParent(1);
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

try{
  var SiteID = ld_blog_vars.provider_name;
} catch(e){}
if (SiteID === "livedoor"){
  function SiteRemove() {
      SakuraBlock = document.querySelectorAll('aside[id="lite_link"]');								Remove();
      SakuraBlock = document.querySelectorAll('div[class="ad2"]');									Remove();
      SakuraBlock = document.querySelectorAll('div[class="plugin-extra plugin-box"]');				RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[class*="blog_ad"]');								Remove();
      SakuraBlock = document.querySelectorAll('div[class*="gn_inline_exp"]');						Remove();
      SakuraBlock = document.querySelectorAll('div[class="ldapp-link"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[class*="plugin-follow_buttons"]');				RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[class*="plugin-twitter_follow_button"]');		RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[class*="plugin-blogroll"]');						RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[class*="plugin-twitter_profile"]');				RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[class*="plugin-free_area"]');					RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[id="app-follow-banner"]');						Remove();
      SakuraBlock = document.querySelectorAll('div[id="top_ad"]');									Remove();
      SakuraBlock = document.querySelectorAll('div[id="index_top_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="menubar_boundary"]');						Remove();
      SakuraBlock = document.querySelectorAll('div[id="index_foot_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="article_top_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="article_low_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="article_foot_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="article_mid_v2"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="article_bottom_v2"]');						Remove();
      SakuraBlock = document.querySelectorAll('div[id="index_overlay_v2"]');						Remove();
      SakuraBlock = document.querySelectorAll('div[id="bottom_space"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="adstir_recommend"]');						RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[id*="adstir_inview"]');							Remove();
      SakuraBlock = document.querySelectorAll('div[id="geniee_overlay_boots"]');					Remove();
      SakuraBlock = document.querySelectorAll('div[id*="ad-containe"]');							Remove();
      SakuraBlock = document.querySelectorAll('section[class*="menu-bar-outer tracking"]');			Remove();
      SakuraBlock = document.querySelectorAll('footer[id="jp-footer"]'); 							Remove();
      SakuraBlock = document.querySelectorAll('div[class="ldapp-article"]'); 						Remove();
      SakuraBlock = document.querySelectorAll('div[style*="height: 345px;"]'); 						Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
}

if(/matomegamer\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="rectangle_ad"]');					RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class="execphpwidget"]');					RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[id*="classictextwidget"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="textwidget"]');					RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[id*="diver_widget_popularpost-5"]');		Remove();
    SakuraBlock = document.querySelectorAll('div[data-item-syndicated="true"]');			Remove();
  }
  try {
    document.querySelector('div[class="headerInner"]').style.position = "relative";
  } catch(e) {}
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/klmanga\.su/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('iframe');										Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/chiebukuro\.yahoo\.co\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('aside[id*="ad-parent"]');				Remove();
    SakuraBlock = document.querySelectorAll('aside[class*="Ad"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ad-parent"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="yjsmhPremHeader"]');			Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/imascg-slstage\.boom-app\.wiki/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="ad-"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="banner-"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="gn-nad"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[id="fixed-nav-wrap"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[style="background-color:#fc1eca; padding: 3px;"]');	Remove();
    SakuraBlock = document.querySelectorAll('div[style="background-color:#f3f3f3;"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[style="background-color:#fffafa;"]');					Remove();
    SakuraBlock = '//h2[@class="section-title"][text()="[PR] おすすめゲームアプリランキング"]';		RemoveXPathParent()
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gameinn\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('a[href*="http://gameinn.jp/genshin/gacha"]');														Remove();
    SakuraBlock = document.querySelectorAll('a[href*="http://gameinn.jp/nikke/gacha"]');														Remove();
    SakuraBlock = document.querySelectorAll('a[href="http://gameinn.jp/gameranking/6/"]');														RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[style*="text-align: center; width: 300px; height: 250px;"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="sns"]');																				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="adstir"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[class*="assistad"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[class*="article-under-box"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[class*="redbox"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[class*="wp-rss-template-container"]');															Remove();
    SakuraBlock = document.querySelectorAll('div[class*="p-linkList clearfix"]');																Remove();
    SakuraBlock = document.querySelectorAll('div[style="text-align: center;"]');																Remove();
    SakuraBlock = document.querySelectorAll('p[style="text-align: center"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[id="csw_block"]');																				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="bnc_ad"]');																				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="StickyAd"]');																				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="adstir"]');																				RemoveParent(2);
    SakuraBlock = document.querySelectorAll('div[id*="DLsite_blog"]');																			RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[id="gn_interstitial_area"]');																	RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[style="padding-bottom: 10px;"]');																Remove();
    SakuraBlock = document.querySelectorAll('div[style="line-height:100%;text-align:center;"]');												Remove();
    SakuraBlock = document.querySelectorAll('iframe[id="vrizead-iframe-gameinn_footer_fundit"]');												Remove();
    SakuraBlock = document.querySelectorAll('iframe[id*="IFTG"]');																				Remove();
    SakuraBlock = document.querySelectorAll('img[src="http://cdn.gameinn.jp/wp-content/uploads/sites/61/2024/09/05151648/unnamed-file.jpg"]');	RemoveParent(1);
    SakuraBlock = '//p[@class="sidetop_p"][text()="おすすめコンテンツ"]';																		RemoveXPathParent()
    document.documentElement.classList.remove("gn_inst_scroll_cancel");
    document.documentElement.classList.remove("bn_inst_scroll_cancel");
    document.querySelector('body').style.padding = "0";
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/teyvatsokuho\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="adsbygoogle"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class*="sns"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="st-widgets-box"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id="st-header-under-widgets-box-wrap"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ads"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[id="mybox"]');											Remove();
    SakuraBlock = document.querySelectorAll('dl[class="google-auto-placed"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class="slide_wrap_gl"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[data-slot="teyvatsokuho_mobile"]');					Remove();
    document.querySelector('body').style.padding = "0";
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/weblio\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="adsbygoogle"]');								Remove();
    SakuraBlock = document.querySelectorAll('aside[class*="ad-blank"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-blank"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad_fixed"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="st-widgets-box"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id="eikaiwa-c-ad-content-sp"]');						Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/sexloveero\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[style="display: flex; gap:5px;"]');					Remove();
    SakuraBlock = document.querySelectorAll('a[href="https://fc2.com/"]');								Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/chan\.sankakucomplex\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('iframe');											Remove();
    SakuraBlock = document.querySelectorAll('div[class*="scad"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class="carousel"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id="headerthumbs"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[id="draggableElement"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class*="redirect"]');							Remove();
    try{
      document.querySelector('div[class=" ts-interstitial__btn_mobile"]').click();
    } catch(e){}
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gamewith\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="-ad-"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="_ad_"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-header"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class*="ad-sp-header"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class="browsi-atf"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[id*="zucksad"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[id="rise-interstitial-area"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class*="c-box walkthrough-gamewith-announces"]');	Remove();
    SakuraBlock = document.querySelectorAll('div[class*="p-search-recommend"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class*="_native_ad_item"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class*="walkthrough-hikari"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class*="walkthrough-ad"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class*="gdb-cta-banner-outer"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class*="profile-register-pr-warp"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="recom-user-slider-wrap"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="c-rectangle-ad-wrap"]');					Remove();
    SakuraBlock = document.querySelectorAll('div[class*="c-box fs-s"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class="u-bgc-white"]');							Remove();
    SakuraBlock = document.querySelectorAll('div[class="p-nps"]');									Remove();
    SakuraBlock = document.querySelectorAll('div[class="user_data"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[class="article-share-btn-wrap-mb"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[class*="_inner is-small"]');						RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class*="_member sub-info"]');						RemoveParent(1);
    SakuraBlock = '//span[@class="c-title_text"][text()="攻略取扱いゲーム"]';						RemoveXPathSET();
    try{
      SakuraBlock.parentNode.parentNode.remove();
    } catch(e){}
    SakuraBlock = '//span[@class="c-navbar_title"][text()="人気のコミュニティ"]';					RemoveXPathSET();
    try{
      SakuraBlock.parentNode.parentNode.remove();
    } catch(e){}
    SakuraBlock = '//div[@class="c-title"][text()="公式Discordサーバーに参加しよう！"]';				RemoveXPathParent()
    SakuraBlock = '//div[@class="_title"][text()="公式Discordサーバーに参加しよう！"]';				RemoveXPathParent()
    SakuraBlock = '//div[@class="c-title"][text()="注目の攻略記事"]';								RemoveXPathParent()
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/game-chan\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="extendedwopts-hide"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class="rss-antenna"]');								RemoveParent(2);
    SakuraBlock = document.querySelectorAll('div[id="diver_widget_popularpost-2"]');					Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/news-postseven\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[style*="z-index: 2147483646;"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[style="display:block; height:120px;"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin:0px auto; width:auto; text-align:center; margin-bottom: 5px; margin-top:-20px; min-height:245px;"]');				Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin:10px auto; width:100%; text-align:center; min-height: 120px;"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[style="min-height: 180px; margin-bottom:10px;"]');																					Remove();
    SakuraBlock = document.querySelectorAll('div[style="margin: 0px auto; margin-bottom:10px;"]');																					Remove();
    SakuraBlock = document.querySelectorAll('div[class="gmoam_outer_wrapper"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[id="ob_holder"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class="modal__overlay"]');								RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class="trv-player-container"]');						RemoveParent(1);
    SakuraBlock = document.querySelectorAll('div[class*="uz-ar"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class*="OUTBRAIN"]');									Remove();
    SakuraBlock = document.querySelectorAll('section[class="w-Manga"]');								RemoveParent(1);
    SakuraBlock = document.querySelectorAll('a[class="sw-Banner"]');									RemoveParent(1);
  }
  try {
    document.body.style.position = "relative";
  } catch(e) {}
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gamers-labo\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="ats"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[class*="postbottom"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[id*="vid-container"]');											Remove();
    SakuraBlock = document.querySelectorAll('div[id="browsi"]');													Remove();
    SakuraBlock = document.querySelectorAll('aside[class="social-bottom"]');										Remove();
    SakuraBlock = document.querySelectorAll('aside[class="widget_text widget widget-main  widget_custom_html"]');	Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/buhidoh\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="300x250"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class="overlaybox"]');												Remove();
    SakuraBlock = document.querySelectorAll('div[class*="feedbox"]');												Remove();
    SakuraBlock = document.querySelectorAll('aside[class="widget_text widget widget-main  widget_custom_html"]');	Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
  var images = document.images;
  for (var i = 0, n = images.length; i < n; i++) {
    var img = images[i];
    img.src = img.src.replace(/^(.*)_thumb(_\d)?\.jpg$/, '$1.jpg');
  }
  var imageslink = document.querySelectorAll('a[href*="https://file.buhidoh.net/images/"]');
  for (var i = 0, n = imageslink.length; i < n; i++) {
    while (imageslink[i].firstChild) {
	  imageslink[i].parentNode.insertBefore(imageslink[i].firstChild, imageslink[i]);
    }
  }
};

if(/xn--o9j0bk\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class*="adarea"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[class="ats-overlay-bottom-wrapper-rendered"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class="widget widget-single-content-top widget_text"]');				Remove();
    SakuraBlock = document.querySelectorAll('ul[class="ranking_area"]');												Remove();
    SakuraBlock = '//div[@class="widget-single-content-top-title main-widget-label"][text()="崩壊スタレの人気記事"]';		RemoveXPathSET();
    try{
      SakuraBlock.remove();
    } catch(e){}
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/dic\.pixiv\.net/.test(location.href)){
  function SiteRemove() {
    console.log("test");
    SakuraBlock = document.querySelectorAll('div[id="news_touch"]');													Hide();
    SakuraBlock = document.querySelectorAll('div[id*="ad"]');															HideParent(1);
    SakuraBlock = document.querySelectorAll('div[class*="ad"]');														Hide();
    SakuraBlock = document.querySelectorAll('div[id="bottom_pixivcomic_touch"]');										Hide();
    SakuraBlock = document.querySelectorAll('div[id="novels_uploaded_to_pixiv_2col"]');									Hide();
    SakuraBlock = document.querySelectorAll('div[id*="attention-area"]');												Hide();
    SakuraBlock = document.querySelectorAll('div[id="bottom_infobar_touch"]');											Hide();
    SakuraBlock = document.querySelectorAll('div[id="bottom_spotlight_touch"]');										Hide();
    SakuraBlock = document.querySelectorAll('section[class="pixivision-article-section"]');								Hide();
    SakuraBlock = document.querySelectorAll('section[id="article-related-pixivision"]');									Hide();
    SakuraBlock = document.querySelectorAll('div[id="article-pixivcomic-comic"]');											Hide();
    SakuraBlock = document.querySelectorAll('div[id="article-pixivision"]');												Hide();
    SakuraBlock = document.querySelectorAll('div[id="attention-area-mobile-bottom"]');										Hide();
    SakuraBlock = document.querySelectorAll('div[id="attention-area"]');													Hide();
    SakuraBlock = document.querySelectorAll('div[class="h-[50px]"]');														Hide();
    SakuraBlock = document.querySelectorAll('div[class="h-[250px] mx-[-16px] w-[calc(100%+32px)]"]');						Hide();
    SakuraBlock = document.querySelectorAll('div[class="mb-[36px] mt-[20px] h-[250px] mx-[-16px] w-[calc(100%+32px)]"]');	Hide();
    SakuraBlock = document.querySelectorAll('div[class="h-[40px] w-full overflow-hidden bg-background1 pt-8 border-b-[1px] border-[#00000014]"]');	Hide();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/xn--o9j0bk\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[id="popular_entries-4"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[class="sns-share ss-col-3 bc-brand-color sbc-hide ss-bottom"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[class="rss-antenna"]');													RemoveParent(1);
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/more-gamer\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="ats-sm-wrapper"]');													Remove();
    SakuraBlock = document.querySelectorAll('div[class="sns-share ss-col-3 bc-brand-color sbc-hide ss-bottom"]');			Remove();
    SakuraBlock = document.querySelectorAll('div[class="rss-antenna"]');													RemoveParent(1);
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/news\.yahoo\.co\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[type="enm"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[type="mmon"]');																		Remove();
    SakuraBlock = document.querySelectorAll('li[class="newsFeed_item"]');																Remove();
    SakuraBlock = document.querySelectorAll('div[id="articleAdOverlay"]');																Remove();
    SakuraBlock = document.querySelectorAll('div[id="yjsmhPremHeader"]');																Remove();
    SakuraBlock = document.querySelectorAll('div[id="adOverlay"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ad"]');																			Remove();
    SakuraBlock = document.querySelectorAll('li[class*="dCMFqd"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[class="yads_stb_item"]');																RemoveParent(1);
    SakuraBlock = document.querySelectorAll('a[href="https://app.adjust.com/ah3wy9w"]');												RemoveParent(1);
    SakuraBlock = document.querySelectorAll('img[alt="Yahoo!ニュース公式アプリ"]');														RemoveParent(2);
    SakuraBlock = document.querySelectorAll('li[data-ual*="element_id:second-paid_article_detail-recommend"]');							Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/nikke-jp-news\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="ad_comment"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[class="add contentunder"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[class="related_post rss_aritcle"]');															Remove();
    SakuraBlock = document.querySelectorAll('div[class="blogroll_wrapper"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[id="recent_comments-3"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[id="single-page-top"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[class*="dlsite-box"]');																		Remove();
    SakuraBlock = document.querySelectorAll('ul[class="sns_btn__ul"]');																			Remove();
    SakuraBlock = '//h3[@class="related_post"][text()="おすすめ記事（外部サイト）"]';															RemoveXPathFirst();
    SakuraBlock = '//span[text()="最近のコメント"]';																							RemoveXPathParent()
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gameleaks\.org/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('nav[id="navi"]');																				Remove();
    SakuraBlock = document.querySelectorAll('div[class="text-mobile"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[class*="box"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[class*="rss-blogroll"]');																	Remove();
    SakuraBlock = document.querySelectorAll('div[class*="sns-share"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[class*="_img"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[id="content-top"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[id*="mobile_ad"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[id="go-to-top"]');																			Remove();
    SakuraBlock = document.querySelectorAll('div[id="adstir_web_inter"]');																	Remove();
    SakuraBlock = document.querySelectorAll('aside[id*="mobile_ad"]');																		Remove();
    SakuraBlock = document.querySelectorAll('aside[id*="categories"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[style="display:flex;flex-wrap:wrap;text-align:center;margin:0px;padding:0px;"]');			Remove();
    SakuraBlock = document.querySelectorAll('iframe[id]');																					Remove();
    try{document.querySelectorAll('body')[0].classList.remove("adstir-instl-noscroll");} catch(e){}
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/teyvatsokuho\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="microad-overlay-footer"]');															Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/dic\.nicovideo\.jp/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('section[class*="Ad"]');																	Remove();
    SakuraBlock = document.querySelectorAll('section[id="sukinamono_lives"]');															Remove();
    SakuraBlock = document.querySelectorAll('section[class="sw-Column tp-TrendWord"]');													Remove();
    SakuraBlock = document.querySelectorAll('section[id="nicoad_article_sp"]');															Remove();
    SakuraBlock = document.querySelectorAll('div[id*="overlay"]');																		Remove();
    SakuraBlock = document.querySelectorAll('div[class="sw-Article_Menu sw-Article_Menu-fixed"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[style="text-align: center;margin-top:12px;"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[id="_popIn_recommend_sp"]');															RemoveParent(1);
    SakuraBlock = document.querySelectorAll('p[class="sw-Article_SubContents-title sw-Article_SubContents-pushword"]');					RemoveParent(1);
    document.querySelector('div[class="st-Footer"]').style.height = "50px";
    document.querySelector('div[class="st-Footer"]').style.marginTop = "-50px";
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/5ch\.net/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="ad_nth"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[class="quotes js-render-after"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class="center"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[id="add_nth_overlay"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ads"]');											Remove();
    SakuraBlock = document.querySelectorAll('li[class="ad_nth"]');										Remove();
  }
  document.cookie = "5chClassic=on; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
  if (link.href.includes("static.seesaawiki.jp/css/") || location.href.includes("seesaawiki.jp/")) {
    setInterval(SiteRemove = () => {
      SakuraBlock = document.querySelectorAll('div[class*="adsense-"]'); 													Remove();
      SakuraBlock = document.querySelectorAll('div[class="ads-box"]'); 														Remove();
      SakuraBlock = document.querySelectorAll('div[class*="ad-"]'); 														Remove();
      SakuraBlock = document.querySelectorAll('div[id*="ad-"]'); 															Remove();
      SakuraBlock = document.querySelectorAll('div[id*="ad"][style*="z-index: 2147483647;"]'); 								Remove();
      SakuraBlock = document.querySelectorAll('div[id="StickyAd"]'); 														Remove();
      SakuraBlock = document.querySelectorAll('div[style="text-align: center;width: 300px;margin: 0 auto;"]');			 	RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[style="line-height:100%;text-align:center;"]'); 							RemoveParent(1);
      SakuraBlock = document.querySelectorAll('div[style="display: inline-block; width: 412px; height: 343.333px;"]'); 		Remove();
    }, 1000);
    break;
  }
  if (/^https:\/\/.*\.up\.seesaa\.net\/.*\.css/.test(link.href) || location.href.includes("hoge.seesaa.net/")) {
    setInterval(SiteRemove = () => {
      SakuraBlock = document.querySelectorAll('div[id*="Adstir"]'); 											Remove();
      SakuraBlock = document.querySelectorAll('div[id*="logly-lift-"]'); 										Remove();
      SakuraBlock = document.querySelectorAll('div[id="article-ad"]'); 											Remove();
      SakuraBlock = '//h2[@class="section-title"][text()="今、あなたにオススメ"]'; 							RemoveXPathFirst();
    }, 1000);
    break;
  }
}

if(/2ch-c\.net\/\?.*?eid=/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = location.href.match(/eid=(\d+)/)?.[1];
    if (SakuraBlock) {
      const targetLink = document.querySelector(`a[eid="${CSS.escape(SakuraBlock)}"]`);
      if (targetLink) {
        location.href = targetLink.href;
      }
    }
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/matomeantena\.com\/feed\//.test(location.href)){
  function SiteRemove() {
    SakuraBlock = location.href.match(/feed\/(\d+)/)?.[1];
    if (SakuraBlock) {
      const targetLink = document.querySelector(`a[href*="/feed-click/${CSS.escape(SakuraBlock)}"]`);
      if (targetLink) {
        location.href = targetLink.href;
      }
    }
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/antenam\.jp\/items\/view\//.test(location.href)){
  function SiteRemove() {
    SakuraBlock = location.href.match(/view\/(\d+)/)?.[1];
    if (SakuraBlock) {
      const targetLink = document.querySelector(`a[href*="/items/click/${CSS.escape(SakuraBlock)}"]`);
      if (targetLink) {
        location.href = targetLink.href;
      }
    }
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/gamerstand\.net\//.test(location.href)){
  function SiteRemove() {
    SakuraBlock = document.querySelectorAll('div[class="classic-text-widget"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class="quotes js-render-after"]');						Remove();
    SakuraBlock = document.querySelectorAll('div[class="center"]');										Remove();
    SakuraBlock = document.querySelectorAll('div[id="add_nth_overlay"]');								Remove();
    SakuraBlock = document.querySelectorAll('div[id*="ads"]');											Remove();
    SakuraBlock = document.querySelectorAll('li[class="ad_nth"]');										Remove();
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

if(/x\.com/.test(location.href)){
  function SiteRemove() {
    SakuraBlock = '//span[text()="プロモーション"]';																																															RemoveXPathSET();
    try{SakuraBlock.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.setProperty('display', 'none', 'important');} catch(e){}
    SakuraBlock = '//span[text()="おすすめユーザー"]';																																															RemoveXPathSET();
    try{SakuraBlock.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.setProperty('display', 'none', 'important');} catch(e){}
    SakuraBlock = document.querySelectorAll('button[data-testid="UserCell"]');																																									HideParent(3);
    SakuraBlock = document.querySelectorAll('a[href*="/i/connect_people"]');																																									HideParent(3);
  }
  SiteRemove();
  setInterval(SiteRemove, 1000);
};

function RemoveAll() {
  try{
    for(i = 0;i < SakuraBlockAll.length;i++){
      SakuraBlockAll[i].remove();
    }
  } catch(e){}
};

if (location.href.indexOf("http") >= 0) {
  function AllRemove() {
    try{
      SakuraBlockAll = document.querySelectorAll('a[class*="tx_af_"]');								RemoveAll();
      SakuraBlockAll = document.querySelectorAll('a[href*="kpia.shop/"]');							RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="adingoFluctOverlay"]');				RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="adspace"]');							RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="adwidget"]');							RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="btn-ldb-bottomAdd"]');				RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="bn_swipe_outer"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="gn_inline_exp"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="gn_scrollCatchAd"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="inlineAd_right"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="isboostMouseCursor"]');				RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="isboostLowerLeft"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class*="yadsOverlay"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[class="uniquest"]');							RemoveAll();
      try{ document.querySelector('div[class="uniquest-close"]').click(); } catch(e){}
      SakuraBlockAll = document.querySelectorAll('div[class="wipe-ad-div-class"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="active_overlay"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="ad_inview_area"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="ad_scale_area"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="adingoFluctOverlay"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="div-gpt-ad-"]');							RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="div_fam_async"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="div_fam8_async"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="gn_delivery_"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="google_ads_iframe"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="gladOV_wrap"]');							RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id^="glssp_"]');								RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="mixx-ad"]');								RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="smac_"]');								RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="unitedblades_div"]');					RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id="interstitial-ad-div-id"]');				RemoveAll();
      SakuraBlockAll = document.querySelectorAll('div[id*="browsi_"]');								RemoveAll();
      SakuraBlockAll = document.querySelectorAll('iframe[id*="google_ads"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('ins[class*="adsbygoogle"]');						RemoveAll();
      SakuraBlockAll = document.querySelectorAll('ins[id*="ads"]');									RemoveAll();
      SakuraBlockAll = document.querySelectorAll('ins[id*="geniee_overlay_outer"]');				RemoveAll();
      SakuraBlockAll = document.querySelector('div[id*="interstitial_ad_close_btn_view"]');
      if (SakuraBlockAll) SakuraBlockAll.childNodes[1]?.click();
      SakuraBlockAll = document.querySelector('div[id*="ad_close_button_view_nvgl"]');
      if (SakuraBlockAll) SakuraBlockAll.childNodes[0]?.click();
    } catch(e){}
  }
  AllRemove();
  setInterval(AllRemove, 1000);
};