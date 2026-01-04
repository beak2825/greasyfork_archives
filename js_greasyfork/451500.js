// ==UserScript==
// @name         hugeblock
// @version      1.2
// @description  hugeblock for TamperMonkey - a adblocker
// @author       Arjun J
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/960153
// @downloadURL https://update.greasyfork.org/scripts/451500/hugeblock.user.js
// @updateURL https://update.greasyfork.org/scripts/451500/hugeblock.meta.js
// ==/UserScript==
 

 
// This folllowing code is edited (a lot) from https://gist.github.com/kbauer/b524f6475c153e759dc28314175cd6a7 (AdBlock Simple)
console.log("========== hugeblock ==========")
console.log("A iframe-based adblocker")
 
    var origins = ["googleads.g.doubleclick.net"];
fetch('https://proxy.arjunjakkipally.repl.co/pgl.yoyo.org/adservers/serverlist.php?hostformat=nohtml&showintro=0&mimetype=plaintext')
  .then((response) => response.text())
  .then((data) => {
    origins.push(...data.split("\n"))
});
function remIF(e){
    // Edited AdBlock Simple
    if (origins.includes(e.src.replace("https://", "").replace("http://", "").replace("www.", ""))){
        console.log("removing " + e.src.replace("https://", "").replace("http://", "").replace("www.", ""))
        e.src = "https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80";
    }
}
function remIFs(){
  for(var e of document.getElementsByTagName('iframe')){
    remIF(e);
  }
    // This code is based upon Ad-B-Gone (https://gist.github.com/wernsey/a69341cffe3efcec2aacec6d9d18d7a4)
    var selectors = [
    '#advert', '#xrail', '#middle-article-advert-container',
    '#sponsored-recommendations', '#around-the-web', '#sponsored-recommendations',
    '#taboola-content', '#taboola-below-taboola-native-thumbnails', '#inarticle_wrapper_div',
    '#rc-row-container', '#ads', '#at-share-dock', '#at4-share', '#at4-follow', '#right-ads-rail',
    'div#ad-interstitial', 'div#advert-article', 'div#ac-lre-player-ph',
    '.ad', '.avert', '.avert__wrapper', '.middle-banner-ad', '.advertisement',
    '.GoogleActiveViewClass', '.advert', '.cns-ads-stage', '.teads-inread', '.ad-banner',
    '.ad-anchored', '.js_shelf_ads', '.ad-slot', '.antenna', '.xrail-content',
    '.advertisement__leaderboard', '.ad-leaderboard', '.trc_rbox_outer', '.ks-recommended',
    '.article-da', 'div.sponsored-stories-component', 'div.addthis-smartlayers',
    'div.article-adsponsor', 'div.signin-prompt', 'div.article-bumper', 'div.video-placeholder',
    'div.top-ad-container', 'div.header-ad', 'div.ad-unit', 'div.demo-block', 'div.OUTBRAIN',
    'div.ob-widget', 'div.nwsrm-wrapper', 'div.announcementBar', 'div.partner-resources-block',
    'div.arrow-down', 'div.m-ad', 'div.story-interrupt', 'div.taboola-recommended',
    'div.ad-cluster-container', 'div.ctx-sidebar', 'div.incognito-modal', '.OUTBRAIN', '.subscribe-button',
    '.ads9', '.leaderboards', '.GoogleActiveViewElement', '.mpu-container', '.ad-300x600', '.tf-ad-block',
    '.sidebar-ads-holder-top', '.ads-one', '.FullPageModal__scroller',
    '.content-ads-holder', '.widget-area', '.social-buttons', '.ac-player-ph',
    'aside#sponsored-recommendations', 'aside[role="banner"]',
    'amp-ad', 'span[id^=ad_is_]', 'div[class*="indianapolis-optin"]', 'div[id^=google_ads_iframe]',
    'div[data-google-query-id]', 'section[data-response]', 'ins.adsbygoogle', 'div[data-google-query-id]',
    'div[data-test-id="fullPageSignupModal"]', 'div[data-test-id="giftWrap"]' , "ytd-ad-slot-renderer"];
    for(let i in selectors) {
        let nodesList = document.querySelectorAll(selectors[i]);
        for(let i = 0; i < nodesList.length; i++) {
            let el = nodesList[i];
            if(el && el.parentNode) {
                
                el.innerHTML = `<img src="https://images.unsplash.com/photo-1484591974057-265bb767ef71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80" width="${el.offsetWidth}" height="${el.offsetHeight}">`;
            }
        }
    }
}
window.setInterval(remIFs,500);
