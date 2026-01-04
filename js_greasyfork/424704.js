// ==UserScript==
// @name        ms-speech-to-text
// @namespace   Violentmonkey Scripts
// @match       https://azure.microsoft.com/*/services/cognitive-services/speech-to-text*
// @grant       all
// @require  https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @version     1.0.1
// @author      -
// @description 2021/3/18下午10:20:54
// @downloadURL https://update.greasyfork.org/scripts/424704/ms-speech-to-text.user.js
// @updateURL https://update.greasyfork.org/scripts/424704/ms-speech-to-text.meta.js
// ==/UserScript==
(() => {
  'use strict'
  $('#main').siblings().remove();
  $('#main > section.section.section-size4.cs-section').siblings().remove();
  $('#main > section > div:nth-child(2)').siblings().remove();
  $('#main > section > div > div > div:nth-child(3)').siblings().remove();
  $('#main > section').css({'padding':'0'});
  $('#main > section > div > div > div > div.column.medium-3.medium-offset-1 > form > div,#main > section > div > div > div > div.column.medium-7.end').css({'margin-top':'0'});
  $('#main > section > div > div > div > div.column.medium-3.medium-offset-1 > form > div.row.column.row-size1 > div > div').css({'margin':"0"});
  $('#main > section > div > div > div > div').css({'padding':'3px'});
})();