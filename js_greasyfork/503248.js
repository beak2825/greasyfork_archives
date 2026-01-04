// ==UserScript==
// @name     SearXNG Remove Specified Languages for Japanese
// @name:tr  SearXNG'de Belirtilen Dilleri Kaldır
// @namespace
// @license GPL-3.0 license
// @version  1.8
// @grant    none
// @match    https://search.inetol.net/*
// @match    https://priv.au/*
// @match    https://searx.be/*
// @match    https://searx.tiekoetter.com/*
// @match    https://opnxng.com/*
// @match    https://searxng.hweeren.com/*
// @match    https://searx.perennialte.ch/*
// @author   Kdroidwin
// @description A script to remove specified languages from SearXNG
// @description:tr  SearXNG'den belirtilen dilleri kaldırmaya yarayan bir script.
// @icon     https://search.inetol.net/static/themes/simple/img/favicon.svg


// @namespace https://greasyfork.org/users/1344730
// @downloadURL https://update.greasyfork.org/scripts/503248/SearXNG%20Remove%20Specified%20Languages%20for%20Japanese.user.js
// @updateURL https://update.greasyfork.org/scripts/503248/SearXNG%20Remove%20Specified%20Languages%20for%20Japanese.meta.js
// ==/UserScript==

var languagesToRemove = ["af", "ca", "ca-ES", "da","da-DK", "de", "de-AT" ,"de-CT", "de-CH", "de-DE", "et", "et-EE", "en-AU", "en-CA", "en-GB", "en-IE",
  "en-IN", "en-NZ", "en-PH", "en-PK", "en-SG", "en-US", "en-ZA", "es", "es-AR",
  "es-CL", "es-CO", "es-ES", "es-MX", "es-PE", "fr", "fr-BE", "fr-CA", "fr-CH",
  "fr-FR", "gl", "hr", "id", "id-ID", "it", "it-CH", "it-IT", "lv", "lt", "hu",
  "hu-HU", "nl", "nl-BE", "nl-NL", "nb", "nb-NO", "pl", "pl-PL", "pt", "pt-BR",
  "pt-PT", "ro", "ro-RO", "sk", "sl", "fi", "fi-FI", "sv", "sv-SE", "vi", "vi-VN",
  "cs", "cs-CZ", "el", "el-GR", "be", "bg", "bg-BG", "ru", "ru-RU", "uk", "uk-UA",
  "tr", "tr-TR", "he", "ar", "fa", "mr", "hi", "ta", "kn", "ml", "th", "th-TH",
   "zh-TW", "zh-HK","ur","ar-SA", "zh-CN", "ko", "ko-KR", "cy", "ga", "gd", "sq", "te", "eu", "is", "de-BE"];
var select = document.getElementById("language");

function deleteSpecifiedLanguages() {
  for (var i = select.options.length - 1; i >= 0; i--) {
    var option = select.options[i];
    if (languagesToRemove.includes(option.value)) {
      select.remove(i);
    }
  }
}

deleteSpecifiedLanguages();