// ==UserScript==
// @name         MAL Sinopsisi Otomatik Türkçeye Çevirme
// @namespace    https://myanimelist.net/profile/kyoyatempest
// @version      1.0
// @description  Bu kullanıcı betiği, MyAnimeList'de anime ve manga sinopslarını Türkçeye çevirir.
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @author       kyoyacchi
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @run-at    document-end
// @downloadURL https://update.greasyfork.org/scripts/478058/MAL%20Sinopsisi%20Otomatik%20T%C3%BCrk%C3%A7eye%20%C3%87evirme.user.js
// @updateURL https://update.greasyfork.org/scripts/478058/MAL%20Sinopsisi%20Otomatik%20T%C3%BCrk%C3%A7eye%20%C3%87evirme.meta.js
// ==/UserScript==

(function() {
    'use strict';

  let isTranslated = false;
  let menuId = null;
    function translateSynopsis(tmsg, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURI(tmsg)}`,
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                const translated = result[0].map(function(el) { return el[0]; }).join('');
                callback(translated);
            }
        });
    }

    var desc =  document.querySelector('p[itemprop="description"]') ? document.querySelector('p[itemprop="description"]').textContent.trim() : document.querySelector('.tsynopsis-text') ? document.querySelector('.tsynopsis-text').textContent.trim() : null;

    var mobile = document.querySelector('.tsynopsis-text');
    var desktop = document.querySelector('p[itemprop="description"]');

    const synopsis =  desc;

function revert(){


  if (mobile){ mobile.textContent = synopsis; }
  else if (desktop){ desktop.textContent = synopsis }
isTranslated = false;
  GM_unregisterMenuCommand("Orijinal sinopsisi göster")
  return true;
}
  GM_registerMenuCommand("Orijinal sinopsisi göster",revert)










    if (synopsis) {
        translateSynopsis(synopsis, function(translated) {
          isTranslated = true;
            if (mobile) {
                mobile.textContent = translated;
            } else if (desktop) {
                desktop.textContent = translated;
            }
        });
    }

})();
