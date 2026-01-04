// ==UserScript==
// @name         Блокировщик рекламы вк
// @namespace    none
// @version      3.1
// @description  Заблокировать рекламу в вк
// @author       Dinaco Studio
// @match        https://*.vk.com/*
// @include      https://*.vk.com/*
// @include      https://*.vkvideo.ru/*
// @include      https://vkvideo.ru/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @grant        GM_webRequest
// @webRequest   [{"selector":"*://stats.vk-portal.net/web-stats/*","action":"cancel"},{"selector":"*://vk.com/al_audio.php?act=ad_event","action":"cancel"},{"selector":"*://vk.com/ads_rotate.php?act=al_update_ad","action":"cancel"},{"selector":"*://ad.mail.ru/*","action":"cancel"},{"selector":"*://trk.mail.ru/i/*","action":"cancel"},{"selector":"*://top-fwz1.mail.ru/js/code.js","action":"cancel"},{"selector":"*://ad.mail.ru/static/admanhtml/rbadman-html5.min.js","action":"cancel"},{"selector":"*://www.tns-counter.ru/*","action":"cancel"},{"selector":"*://r3.mail.ru/k?*","action":"cancel"},{"selector":"*://vk.com/js/lib/px.js","action":"cancel"}]
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/435244/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435244/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%B2%D0%BA.meta.js
// ==/UserScript==
const universal_ads = `.right_list:has([onclick*="return showApp"]),.CatalogSection:has(.audio_promo),[class^="ads_ad_"],[class^="ads"],.ads_ads_news_wrap,._ads_promoted_post_data_w,div#left_ads,div[data-ad-view],div[data-ad],div[ads_left],.post[data-ad],.post[data-ad-view],div[id^="postadsite_"],div#ads_left,[data-ad-view],div#games_catalog_header_content,#ads_left,.audio_subscribe_promo__content,#apps_ads_wrap,#ads_special_promo_wrap,#apps_ads_wrap,._ads_promoted_post_data_w,.ads_ads_news_wrap,div#left_ads,.ads_ads_box,.ads_ads_news_wrap,div[id^="vk_ads_"]`;

try{
    Object.defineProperty(unsafeWindow, 'MotionKit', {
                value: {},
                writable: false,      // Запрещает перезапись значения
                configurable: false   // Запрещает изменение дескрипторов свойства
});
}catch{
      Object.seal(unsafeWindow.MotionKit)
      Object.assign({}, unsafeWindow.MotionKit)
      unsafeWindow.MotionKit = {}
}
unsafeWindow.MotionKit = {}

function hookFunction(originalFunction, beforeHook, stopCondition) {
  return function(...args) {
    if (typeof beforeHook === 'function') {
      beforeHook(...args);
    }
    // Если условие остановки выполнено, прекращаем выполнение оригинальной функции
    if (typeof stopCondition === 'function' && stopCondition(...args)) {
        console.log("JOPA")
      return; // Можно вернуть значение по умолчанию или бросить ошибку
    }
    // Иначе вызываем оригинальную функцию
    return originalFunction(...args);
  };
}
function waitFor(conditionFn, { interval = 100 } = {}) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    (function checkCondition() {
      if (conditionFn()) {
        resolve();
      } else {
        setTimeout(checkCondition, interval);
      }
    })();
  });
}
window.onload = function() {
    waitFor(() => typeof unsafeWindow?.stManager?.add !== 'undefined').then(e=>{
        unsafeWindow.stManager.add = hookFunction(unsafeWindow.stManager.add,null,function(...args){
            return Array.isArray(args?.at(0)) && args?.at(0)?.find(e=>e.match(/ads_light\.js/))
        })
    })
    waitFor(() => typeof unsafeWindow?.vk !== 'undefined').then(e=>{
        set();
    })
    waitFor(() => typeof unsafeWindow?.browser !== 'undefined').then(e=>{
        unsafeWindow.browser.ios = true;
    })

    setInterval(block,100)
}

function set(){
    if (typeof unsafeWindow?.vk?.pe == 'undefined') return
    //unsafeWindow.vk.pe.tgb_adblock_protection = true;
    unsafeWindow.vk.audioAdsConfig = null;
    unsafeWindow.browser.ios = true;
    unsafeWindow.ap.ads._adEvents = [];
    unsafeWindow.ap.ads._isPlaying = false;
    unsafeWindow.noAdsAtAll = true
    unsafeWindow.PageBottomBanners.initUnauthBanner = function () { }
    unsafeWindow.Unauthorized2 = undefined
    unsafeWindow.noAds = true
    unsafeWindow.cur.no_left_ads = true;
    unsafeWindow.cur.isGamesInRightBlock = false;
    unsafeWindow.no_ads = true;
    unsafeWindow.isNoAdsForce = true;
    unsafeWindow.hide_ad = true
    unsafeWindow.vk__adsLight.yaDirectAdActive = false;
    unsafeWindow.ya_direct = false
}
function block(){
    set();
    localStorage.setItem("ads.events", null);
    if (typeof unsafeWindow?.vk !== 'undefined'){
        localStorage.setItem("ads.events_@id:"+unsafeWindow.vk.id,null)
    }
    let ad_blocks = document.querySelectorAll(universal_ads);
    for (let ad of ad_blocks){
        ad.outerHTML= '';
    }
    const videoplayer_ads_actions = document.querySelector('div.videoplayer_ads_actions')
    if (videoplayer_ads_actions)
        videoplayer_ads_actions.style.display = 'none'
    let el = document.querySelector("div.rb-adman-cta-block-wrapper") || document.querySelector("div.rb-adman-cta-btn") || document.querySelector("div.shadow-root-container")?.shadowRoot.querySelector("div.rb-adman-cta-block-wrapper")
    document.querySelector('div.rb-adman-ad-actions')?.remove()
    document.querySelector('div.videoplayer_ads_media_el')?.remove()
    document.querySelector('div.videoplayer_ads')?.remove()
    el?.remove()
}
