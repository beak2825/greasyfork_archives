// ==UserScript==
// @name        ms-speech-translation
// @namespace   Violentmonkey Scripts
// @match       https://azure.microsoft.com/*/services/cognitive-services/speech-translation*
// @grant       all
// @require  https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @version     1.0.0
// @author      -
// @description 2021/3/18下午10:20:54
// @downloadURL https://update.greasyfork.org/scripts/424714/ms-speech-translation.user.js
// @updateURL https://update.greasyfork.org/scripts/424714/ms-speech-translation.meta.js
// ==/UserScript==
(() => {
  'use strict'
  $('#main,#features').siblings().remove();
  $('#features > div.row.column.row-size1,#features > div > div.row.row-size3.column,#features > div > div > div:nth-child(2)').siblings().remove();
  $('#features,#features > div > div > div > div.column.medium-3.medium-offset-1 > form > div, #features > div > div,#features > div > div > div > div.column.medium-7.end').css({'padding':'0','margin':'0'});
  $('#speechout').css({'width':'99%','margin':'3px'});
})();