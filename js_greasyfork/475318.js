// ==UserScript==
// @name           Anti anti-AdBlock
// @namespace      https://github.com/igorskyflyer
// @version        1.0.24
// @author         Igor Dimitrijević (@igorskyflyer)
// @description    Counters anti-AdBlock scripts
// @homepage       https://github.com/igorskyflyer/userscript-anti-anti-adblock
// @homepageURL    https://github.com/igorskyflyer/userscript-anti-anti-adblock
// @website        https://igorskyflyer.me
// @supportURL     https://github.com/igorskyflyer/userscript-anti-anti-adblock/issues
// @grant          unsafeWindow
// @match          *://*/*
// @run-at         document-end
// @license        GPL-V3
// @downloadURL https://update.greasyfork.org/scripts/475318/Anti%20anti-AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/475318/Anti%20anti-AdBlock.meta.js
// ==/UserScript==

unsafeWindow.dotcom = {
  flags: { adverts: true, analytics: true },
  userinfo: { ads: true },
  initAnalytics: function () {},
}
unsafeWindow.zaraz = { track: function () {} }
unsafeWindow.demandSupply = { pfAds: true, setPfAds: function () {} }
unsafeWindow.zarazData = {}
unsafeWindow.AdTrack = unsafeWindow._carbonads = { init: function () {} }
unsafeWindow.MDCore = { adblock: 0 }
unsafeWindow.adsconfig = {}

unsafeWindow.hasAdBlocker = unsafeWindow.abp = false

unsafeWindow.googleAd =
  unsafeWindow.isLoadAds =
  unsafeWindow.generatorAds =
  unsafeWindow.zfgloadedpopup =
  unsafeWindow.canRunAds =
  unsafeWindow.canRunAdvertise =
  unsafeWindow.isAdEnabled =
    true

unsafeWindow.google_ad_status = 1

unsafeWindow.GeneratorAds =
  unsafeWindow.Ads_PushPage =
  unsafeWindow.Ads_Popunder =
  unsafeWindow.Ads_Vignette =
  unsafeWindow.postAntiadblockInfo =
  unsafeWindow.AdsPlugin =
  unsafeWindow.AdscoreInit =
  unsafeWindow.GalaBanner =
    function () {}