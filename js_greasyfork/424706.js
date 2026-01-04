// ==UserScript==
// @name        ms-text-to-speech
// @namespace   Violentmonkey Scripts
// @match       https://azure.microsoft.com/*/services/cognitive-services/text-to-speech*
// @grant       all
// @require  https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @version     1.0.3
// @author      -
// @description 2021/3/18下午10:20:54
// @description https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/
// @downloadURL https://update.greasyfork.org/scripts/424706/ms-text-to-speech.user.js
// @updateURL https://update.greasyfork.org/scripts/424706/ms-text-to-speech.meta.js
// ==/UserScript==
(() => {
  'use strict'
  $('#main').siblings().remove();
  $('#main > section:nth-child(7)').siblings().remove();
  $('#main > section > div.row.row-size1').siblings().remove();
  $('#main > section > div > div:nth-child(2)').siblings().remove();
  $('#item1Content > div > div:nth-child(1)').siblings().remove();
})();