// ==UserScript==
// @name         IBM-Weather-UI
// @name:ZH-CN   IBM-Weather-UI
// @name:ZH-TW   IBM-Weather-UI
// @namespace    https://github.com/li-zyang
// @version      1.0.1
// @description  An enchanced UI for weather.com
// @description:ZH-CN  一个用于 weather.com 的优化 UI
// @description:ZH-TW  一個用於 weather.com 的優化 UI
// @author       阿昭
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAADLklEQVRYhe2Wv46qQBTGeQQewUfgDeQNsKZZGwsqCS0ma4OlSGdBomtDosUaQotaKZ0kVFqoCZVGo4XSfre4Oyfin7vcTXbdwpOQDDBn+OXjzHeG4yQFvy24J1TGeEJljSdU1nhCZY3fD3U4JRhF86tLtXuPg5ouYuT1OnhZQ65UQV6vo+p4EHXzcVAsRN1E1fEAAFXHQ65UQaHWhKibWG12OJwSuu8H4eOghtEMgmqg7U9QtDoo1JroByF4WXsMFPt97Lmom+Akha5fAcWUAoBRNP8ZqLLdRcsfAwBa/hhlu5t6vj8mkGpNCKqBF+vtZ6AeHd8KNYrmOJyS/8678ilOUrDa7ND2J+AkBaNojn4QZi7oUTSnesyVKl+quSuleFlD259AtXvgJAUNd5Aq9lE0R8MdkAKrzQ4Nd0B+VbQ6EFQD4TKGqJto+xNUHQ+rzQ7A367RcAcEGy5jWvMuVKHWhGr3IOomBNVA0erQrmO+VLa7yJUqpEbZ7oKXNQJhvsbWKNSaqflFq4NcqYJ+EJIPvn6oexOq4Q7Ih9iYlzWMojmpUHU8+s39IIRq92jOpYWw/slKgZMUmlN1vJtt7ApqFM3Byxp4WcNyvU0ZJFNtGM0wjGb0kfcghKAan0Kxmu0HIYbRDNNFnA0KADhJoYm8rNF4GM1IflE3CZoppdo9NNwB1eUlFCsPUTdT9ZYJarqIsVxvaTxdxPRuud5iGM2wPyap++V6m8pZrreYLmLsjwn2xwTDaEZrMJVY/vn6d6EeHTehWIEXrQ5Wmx1ypcqXTDBLsFr8J5Rq9yCoBt6DkPof2znfEbfWvmuel4m8rNF2ZupxkgJBNQCAPIkV/v6Y0Hu24w6nBIJq0KExM9TNSR+LXjr7uf+IugnV7qEfhDSH5RWtDnkS+12cpCBcxtmhbil17kGrzQ6cpKBsd1NQVcej8WUeu3hZQ16vI6/Xybc+hWKJbX9CPe4SquEOqE0wNbJAtf0JNWnW626Wy63dxw52putjf0zw6njkR+yQ92K9Qao18ep4mC5itPwx+RXbIOd5zKda/hgv1htM1wcAvAdhqu/dhXp0PKGyxh869SPFcsnM3QAAAABJRU5ErkJggg==
// @license      CC0
// @include      https://weather.com/*
// @exclude      none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @connect      *
// @noframes
// @run-at       document-end
// @note         v1.0.0      2021-06-18  随便改了改
// @downloadURL https://update.greasyfork.org/scripts/428121/IBM-Weather-UI.user.js
// @updateURL https://update.greasyfork.org/scripts/428121/IBM-Weather-UI.meta.js
// ==/UserScript==

(function(window, $) {
  'use strict';
  
  window.IBMWeatherUIJS = {};
  var s = window.IBMWeatherUIJS;
  
  function isDescendentOf (elem, pElemList) {
    while (!$(elem).filter('html').length) {
      var parent = $(elem).parent();
      for (var pElem of pElemList) {
        if (parent[0] == pElem) {
          return true;
        }
      }
      elem = parent;
    }
    return false;
  }
  
  s.isDescendentOf = isDescendentOf;
  
  if (location.toString().match(/https?:\/\/weather.com\/((\w|-)*\/)?weather\/today\//)) {

    $('[id*="WxuAirQuality-sidebar-"]').after($('#todayDetails'));
    
  } else if (
    location.toString().match(/https?:\/\/weather.com\/((\w|-)*\/)?weather\/hourbyhour\//) ||
    location.toString().match(/https?:\/\/weather.com\/((\w|-)*\/)?weather\/tenday\//)
  ) {
  
    $('aside.region-sidebar').prepend($('[id*="WxuTodayMapCard-main-"]'));
    
  }
  
  $('html').append($(`
  <style class="IBMWeatherUIJS">
  
    [dir] [class*="gradients--rainyDay--"] {
      background-image: linear-gradient(#e1eaec,#d0f0d7,#f4fbf6);
    }
    [dir] [class*="gradients--cloudyFoggyDay--"] {
      background-image: linear-gradient(#dac8eb,#f5e2da,#fcf9f7);
    }
    [dir] [class*="gradients--default--"] {
      background-image: linear-gradient(#c0d6f2,#d4e2f5,#ffffff);
    }
    [dir] [class*="gradients--clearNight--"] {
      background-image: linear-gradient(#aab5ce,#a4cce2,#dfe7ea);
    }
    [class*="styles--overflowNav--"] {
      height: 50px;
    }
    [class*="styles--button--"] {
      height: 100%;
    }
    .LargeScreen [class*="CurrentConditions--header--"] [class*="CurrentConditions--timestamp--"] {
      font-size: 1rem;
    }
    [class*="styles--SavedLocations--"] {
      display: none;
    }
    [class*="MainMenuHeader--twcLogo--"] {
      width: 30px !important;
      height: 30px !important;
    }
    [class*="MainMenuHeader--wrapper--"] {
      height: auto;
    }
    [class*="AirQuality--AirQualityCard--"] {
      height: 270px;
      padding-left: 40px;
      padding-right: 40px;
    }
    [class*="AirQuality--leftCol--"],
    [class*="AirQuality--center--"] {
      width: 100% !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
    }
    [class*="AirQuality--leftCol--"] [class*="AirQuality--col--"]:first-of-type {
      width: 180px;
      height: 180px;
      padding: 0px !important;
      margin: 20px 0px 10px 0px;
    }
    [class*="AirQuality--AirQualityCard--"] [class*="DonutChart--donutchart--"] {
      transform: scale(3);
      transform-origin: 0 0;
    }
    [class*="DonutChart--innerValue--"] {
      font-size: 1.6em;
    }
    [class*="AirQuality--sm--"] [class*="AirQuality--leftCol--"] [class*="AirQuality--col--"]:last-of-type {
      padding: 0px !important;
      margin: 10px 0px 10px 0px;
    }
    [class*="AirQualityText--severity--"] {
      padding-bottom: 7px;
    }
    [dir] [class*="gradients--cloudyFoggyDay-contrast--"] {
      background-image: linear-gradient(#6e3f98,#a37697) !important;
    }
    [dir] [class*="gradients--clearNight-contrast--"] {
      background-image: linear-gradient(#113076,#135899) !important;
    }
    [class*="TodayDetailsCard--detailsContainer--"] {
      margin-bottom: 16px;
    }
    .video-label,
    .video-title {
      font-size: 14px !important;
    }
    [class*="DetailsSummary--wxIcon--"] {
      filter: brightness(0.9) saturate(2);
    }
    aside [id*="WxuTodayMapCard-main-"] [class*="Slideshow--Slideshow--"] {
      height: 600px;
    }
    [class*="TodayDetailsCard--detailsContainer--"] > div {
      margin: 0px 3px !important;
    }
    [class*="DetailsSummary--precip--"] > span {
      font-weight: bold;
    }
    [dir] [class*="DailyContent--narrative--"] {
      margin: 14px 0 14px 0;
      font-size: 0.9rem;
    }
    [id*="WxuAd-contentTop"] [class*="BaseAd--adWrapper--"] {
      margin: 0;
    }
    [id*="WxuAd-contentTop"] div[id*="google_ads_iframe"] {
      width: 100%;
    }
    [id*="WxuAd-contentTop"] iframe[id*="google_ads_iframe"] {
      width: 100%;
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0 0 12px 0 rgba(0,0,0,.2);
    }
    [id*="WxuAd-contentTop"] > div {
      padding: 0 !important;
    }
  
  </style>
  `));
  
})(window.unsafeWindow, $);















