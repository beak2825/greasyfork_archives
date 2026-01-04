// ==UserScript==
// @name              clean up deepl.com
// @author            jside
// @namespace         Cleans up ads and menubars
// @description       Cleans up ads and menubars
// @version           0.1.1
// @include           https://www.deepl.com/*
// @grant             GM_addStyle
// @grant             GM_log
// @run-at            document-start
// @supportURL        
// @note              Original by Hunlongyu (https://github.com/Hunlongyu, https://gist.github.com/Hunlongyu/2d7cc7db66b79831c3af23cc52a85845) edit by me
// @downloadURL https://update.greasyfork.org/scripts/441609/clean%20up%20deeplcom.user.js
// @updateURL https://update.greasyfork.org/scripts/441609/clean%20up%20deeplcom.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let css = `
    .dl_header{display: none !important;}
    #dl_career_container{display: none !important;}
    .dl_translator_page_container {min-height: 130px !important;}
    #dl_cookieBanner{display: none !important;}
    .lmt__language_container_sec{display: none !important;}
    #lmt_pro_ad_container{display: none !important;}
    #dl_quotes_container{display: none !important;}
    .eSEOtericText{display: none !important;}
    .lmt__rating {display: none !important;}
    .lmt__target_toolbar__share_container{display: none !important;}
  `
  try {
    GM_addStyle(css)
  } catch (e) {
    GM_log(new Error('GM_addStyle stopped working！'))
  }
})()