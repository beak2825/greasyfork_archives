// ==UserScript==
// @name         Facebook Hide Ads (a.k.a. sponsored posts)
// @namespace    https://openuserjs.org/users/burn
// @version      0.5.2
// @description  Removes ads (a.k.a. sponsored posts) from feed and sidebar
// @author       burn
// @copyright    2020, burn (https://openuserjs.org/users/burn)
// @license      MIT
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/404309/Facebook%20Hide%20Ads%20%28aka%20sponsored%20posts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404309/Facebook%20Hide%20Ads%20%28aka%20sponsored%20posts%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let languages = { // thanks to Ciscoheat https://greasyfork.org/en/users/51960-ciscoheat
        'af':      ['Geborg'],
        'am':      ['የተከፈለበት ማስታወቂያ'],
        'ar':      ['إعلان مُموَّل'],
        'as':      ['পৃষ্ঠপোষকতা কৰা'],
        'ay':      ['Yatiyanaka'],
        'az':      ['Sponsor dəstəkli'],
        'be':      ['Рэклама'],
        'bg':      ['Спонсорирано'],
        'br':      ['Paeroniet'],
        'bs':      ['Sponzorirano'],
        'bn':      ['সৌজন্যে'],
        'ca':      ['Patrocinat'],
        'cb':      ['پاڵپشتیکراو'],
        'co':      ['Spunsurizatu'],
        'cs':      ['Sponzorováno'],
        'cx':      ['Giisponsoran'],
        'cy':      ['Noddwyd'],
        'da':      ['Sponsoreret'],
        'de':      ['Gesponsert'],
        'el':      ['Χορηγούμενη'],
        'en':      ['Sponsored', 'Chartered'],
        'eo':      ['Reklamo'],
        'es':      ['Publicidad', 'Patrocinado'],
        'et':      ['Sponsitud'],
        'eu':      ['Babestua'],
        'fa':      ['دارای پشتیبانی مالی'],
        'fi':      ['Sponsoroitu'],
        'fo':      ['Stuðlað'],
        'fr':      ['Commandité', 'Sponsorisé'],
        'fy':      ['Sponsore'],
        'ga':      ['Urraithe'],
        'gl':      ['Patrocinado'],
        'gn':      ['Oñepatrosinapyre'],
        'gx':      ['Χορηγούμενον'],
        'hi':      ['प्रायोजित'],
        'hu':      ['Hirdetés'],
        'id':      ['Bersponsor'],
        'it':      ['Sponsorizzata'],
        'ja':      ['広告'],
        'jv':      ['Disponsori'],
        'kk':      ['Демеушілік көрсеткен'],
        'km':      ['បានឧបត្ថម្ភ'],
        'lo':      ['ໄດ້ຮັບການສະໜັບສະໜູນ'],
        'mk':      ['Спонзорирано'],
        'ml':      ['സ്പോൺസർ ചെയ്തത്'],
        'mn':      ['Ивээн тэтгэсэн'],
        'mr':      ['प्रायोजित'],
        'ms':      ['Ditaja'],
        'ne':      ['प्रायोजित'],
        'nl':      ['Gesponsord'],
        'or':      ['ପ୍ରଯୋଜିତ'],
        'pa':      ['ਸਰਪ੍ਰਸਤੀ ਪ੍ਰਾਪਤ'],
        'pl':      ['Sponsorowane'],
        'ps':      ['تمويل شوي'],
        'pt':      ['Patrocinado'],
        'ru':      ['Реклама'],
        'sa':      ['प्रायोजितः |'],
        'si':      ['අනුග්‍රහය දක්වන ලද'],
        'so':      ['La maalgeliyey'],
        'sv':      ['Sponsrad'],
        'te':      ['స్పాన్సర్ చేసినవి'],
        'th':      ['ได้รับการสนับสนุน'],
        'tl':      ['May Sponsor'],
        'tr':      ['Sponsorlu'],
        'tz':      ['ⵉⴷⵍ'],
        'uk':      ['Реклама'],
        'ur':      ['تعاون کردہ'],
        'vi':      ['Được tài trợ'],
        'zh-Hans': ['赞助内容'],
        'zh-Hant': ['贊助']
    },
    qS = function (el, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelector(el) || false;
    },
    qSall = function (els, scope) {
      scope = (typeof scope == 'object') ? scope : document;
      return scope.querySelectorAll(els) || false;
    },
    targetNode = qS('body'),
    observerConfig = {
      attributes: false,
      childList: true,
      subtree: true
    },
    getParentEl = function (elmChild) {
        return elmChild.closest('[data-pagelet^="FeedUnit_"]') || false;
    },
    removeAdsInFeed = function (ads) {
        Array.prototype.forEach.call(ads, function (el) {
            let wrapper = getParentEl(el);
            if (wrapper !== false) {
                console.log("Found wrapper for " + el);
                if (wrapper.parentNode != null)
                    wrapper.parentNode.removeChild(wrapper);
                else {
                    const evt = new Event('mouseenter');
                    wrapper.dispatchEvent(evt);
                    //console.log("event dispatched");
                }
            }
        });
    },
    removeAbsoluteSpans = function (elm) {
        Array.prototype.forEach.call(qSall('span[style="position: absolute; top: 3em;"]', elm), function (el) {
            console.log("rimuovo " + el.tagName);
            el.parentNode.removeChild(el);
        });
    },
    callback = function (mutationsList, observer) {
      mutationsList.forEach(function (mutation) {
        var entry = {
          mutation: mutation,
          el: mutation.target,
          value: mutation.target.textContent,
          oldValue: mutation.oldValue
        };

        removeAbsoluteSpans(entry.el);

        // ads in right sidebar, old fb design
        let ego_wrapper = qS('#pagelet_ego_pane', entry.el);
        if (ego_wrapper) ego_wrapper.parentNode.removeChild(ego_wrapper);

        /* new fb 2020 design */
        let lang = languages[document.documentElement.lang] || languages.en;
        if (lang.indexOf(entry.value) >= 0) {
            //console.log("sponsored found for " + entry.el);
            removeAdsInFeed([entry.el]);
        }
      });
    };

    removeAbsoluteSpans(qS('body'));
    // ads in right sidebar, old fb design
    let ego_wrapper = qS('#pagelet_ego_pane');
    if (ego_wrapper) ego_wrapper.parentNode.removeChild(ego_wrapper);

    var observer = new MutationObserver(callback);
    observer.observe(targetNode, observerConfig);
})();
