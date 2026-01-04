// ==UserScript==
// @name         Hide Advertisement at X/Twitter site
// @name:ar          إخفاء الإعلانات في موقع X/Twitter
// @name:bg          Скриване на реклами в сайта на X/Twitter
// @name:cs          Skrýt reklamy na webu X/Twitter
// @name:da          Skjul reklamer på X/Twitter-siden
// @name:de          Werbung auf der X/Twitter-Seite ausblenden
// @name:el          Απόκρυψη διαφημίσεων στον ιστότοπο X/Twitter
// @name:en          Hide Advertisement at X/Twitter site
// @name:eo          Kaŝi Reklamojn ĉe la retejo X/Twitter
// @name:es          Ocultar publicidad en el sitio X/Twitter
// @name:fi          Piilota mainokset X/Twitter-sivustolla
// @name:fr          Masquer les publicités sur le site X/Twitter
// @name:fr-CA       Masquer les publicités sur le site X/Twitter (Canada)
// @name:he          הסתר פרסומות באתר X/Twitter
// @name:hr          Sakrij oglase na stranici X/Twitter
// @name:hu          Hirdetések elrejtése az X/Twitter webhelyen
// @name:id          Sembunyikan Iklan di situs X/Twitter
// @name:it          Nascondi la pubblicità sul sito X/Twitter
// @name:ja          X/Twitterサイトの広告を非表示にする
// @name:ka          რეკლამის დამალვა X/Twitter-ის საიტზე
// @name:ko          X/Twitter 사이트에서 광고 숨기기
// @name:nb          Skjul reklame på X/Twitter-siden
// @name:nl          Advertenties verbergen op de X/Twitter-site
// @name:pl          Ukryj reklamy na stronie X/Twitter
// @name:pt-BR       Ocultar anúncios no site X/Twitter
// @name:ro          Ascunde reclamele de pe site-ul X/Twitter
// @name:ru          Скрыть рекламу на сайте X/Twitter
// @name:sk          Skryť reklamu na stránke X/Twitter
// @name:sr          Sakrij reklame na X/Twitter sajtu
// @name:sv          Dölj annonser på X/Twitter-sidan
// @name:th          ซ่อนโฆษณาในเว็บไซต์ X/Twitter
// @name:tr          X/Twitter sitesindeki reklamları gizle
// @name:ug          X/Twitter تور بېتىدىكى ئېلاننى يوشۇرۇڭ
// @name:uk          Приховати рекламу на сайті X/Twitter
// @name:vi          Ẩn Quảng cáo trên trang X/Twitter
// @name:zh          在 X/Twitter 网站隐藏广告
// @name:zh-CN       在 X/Twitter 网站隐藏广告
// @name:zh-HK       在 X/Twitter 網站隱藏廣告
// @name:zh-SG       在 X/Twitter 网站隐藏广告
// @name:zh-TW       在 X/Twitter 網站隱藏廣告
// @description  Hide specific advertisements at X/Twitter site
// @description:ar   إخفاء إعلانات محددة في موقع X/Twitter
// @description:bg   Скриване на конкретни реклами в сайта на X/Twitter
// @description:cs   Skrýt konkrétní reklamy na webu X/Twitter
// @description:da   Skjul specifikke reklamer på X/Twitter-siden
// @description:de   Bestimmte Werbung auf der X/Twitter-Seite ausblenden
// @description:el   Απόκρυψη συγκεκριμένων διαφημίσεων στον ιστότοπο X/Twitter
// @description:eo   Kaŝi specifajn reklamojn ĉe la retejo X/Twitter
// @description:es   Ocultar anuncios específicos en el sitio X/Twitter
// @description:fi   Piilota tietyt mainokset X/Twitter-sivustolla
// @description:fr   Masquer des publicités spécifiques sur le site X/Twitter
// @description:fr-CA   Masquer des publicités spécifiques sur le site X/Twitter (Canada)
// @description:he   הסתר פרסומות ספציפיות באתר X/Twitter
// @description:hr   Sakrij određene oglase na stranici X/Twitter
// @description:hu   Adott hirdetések elrejtése az X/Twitter webhelyen
// @description:id   Sembunyikan iklan tertentu di situs X/Twitter
// @description:it   Nascondi annunci specifici sul sito X/Twitter
// @description:ja   X/Twitterサイトで特定の広告を非表示にする
// @description:ka   კონკრეტული რეკლამების დამალვა X/Twitter-ის საიტზე
// @description:ko   X/Twitter 사이트에서 특정 광고 숨기기
// @description:nb   Skjul spesifikke annonser på X/Twitter-siden
// @description:nl   Specifieke advertenties verbergen op de X/Twitter-site
// @description:pl   Ukryj określone reklamy na stronie X/Twitter
// @description:pt-BR   Ocultar anúncios específicos no site X/Twitter
// @description:ro   Ascunde reclame specifice de pe site-ul X/Twitter
// @description:ru   Скрыть определенную рекламу на сайте X/Twitter
// @description:sk   Skryť konkrétne reklamy na stránke X/Twitter
// @description:sr   Sakrij određene reklame na X/Twitter sajtu
// @description:sv   Dölj specifika annonser på X/Twitter-sidan
// @description:th   ซ่อนโฆษณาที่เฉพาะเจาะจงบนเว็บไซต์ X/Twitter
// @description:tr   X/Twitter sitesindeki belirli reklamları gizle
// @description:ug   X/Twitter تور بېتىدىكى كونكرېت ئېلاننى يوشۇرۇڭ
// @description:uk   Приховати конкретні оголошення на сайті X/Twitter
// @description:vi   Ẩn các quảng cáo cụ thể trên trang X/Twitter
// @description:zh          在 X/Twitter 网站隐藏特定广告
// @description:zh-CN       在 X/Twitter 网站隐藏特定广告
// @description:zh-HK       在 X/Twitter 網站隱藏特定廣告
// @description:zh-SG       在 X/Twitter 网站隐藏特定广告
// @description:zh-TW       在 X/Twitter 網站隱藏特定廣告
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       aspen138
// @match        *://x.com/*
// @match        *://*.x.com/*
// @match        *://twitter.com/*
// @match        *://*.twitter.com/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/491294/Hide%20Advertisement%20at%20XTwitter%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/491294/Hide%20Advertisement%20at%20XTwitter%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide ads
    function hideAds() {
        // Find all span elements that contain the text "Ad"
        document.querySelectorAll('span').forEach(span => {
            if (span.textContent.trim() === 'Ad') {
                // Find the closest parent article to the span and hide it
                let adArticle = span.closest('article');
                if (adArticle) {
                    adArticle.style.display = 'none';
                }
            }
        });
    }

    // Run the hideAds function on page load
    window.addEventListener('load', hideAds);

    // Optionally, to account for dynamic content loading
    setInterval(hideAds, 5000); // Check every 5 seconds
})();