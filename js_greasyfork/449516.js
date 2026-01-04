// ==UserScript==
// @name         はてなフィルタ User Script 版
// @namespace    http://twitter.com/euro_s
// @version      0.1.4
// @description  特定のドメインのブックマークを非表示します。
// @author       euro_s
// @match        https://b.hatena.ne.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hatena.ne.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449516/%E3%81%AF%E3%81%A6%E3%81%AA%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%20User%20Script%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/449516/%E3%81%AF%E3%81%A6%E3%81%AA%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%20User%20Script%20%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hide_domains = [
        "www.kakkoii-kosodate.info",
        "blog.tinect.jp",
        "gantokurasu.hatenablog.com",
        "twitter.com/HashimotoKotoe",
        "twitter.com/h_ototake",
        "www.kobonemi.com",
        "pukupuku25.hatenablog.jp",
        "koushi-blog.hatenablog.com",
        "www.fossiloftime.com",
        "communitybiz-symphonia.com",
        "mama-networkbusiness.com",
        "mubou.seesaa.net",
        "aizine.ai",
        "poppo-blog.hatenablog.com",
        "www.mmayuminn.com",
        "setochiyo-style.com",
        "catpower.hatenablog.com",
        "note.com/pottey",
        "www.jibun-iyashi.com",
        "eisomi.hatenablog.com",
        "news.mynavi.jp",
        "tomi-kun.hatenablog.com",
        "www.watto.nagoya",
        "junemutsumi.hatenablog.com",
        "net-tuu.com",
        "www.smilewithoutborders.com",
        "guitar-ijiri.com",
        "www.warakado-kanno.com",
        "rocketnews24.com",
        "monaka-shinnrikennkyuushitu.hatenablog.com",
        "photoshopvip.net",
        "paiza.hatenablog.com",
        "www.buzzfeed.com",
        "www.lifehacker.jp",
        "tabkul.com",
        "www.phileweb.com",
        "paytner.hatenablog.com",
        "nazology.net",
        "media.lifull.com",
        "twitter.com/fladdict",
        "qiita.com/SMAC",
        "kowakowa-kaidan.com",
        "www.narutabi.com",
        "omocoro.jp",
        "twitter.com/kanae_udemy",
        "qiita.com/delicha",
        "udemy.benesse.co.jp",
        "twitter.com/kensuu",
        "togetter.com",
        "kefuo.hatenablog.com",
        "qiita.com/KNR109",
        "twitter.com/mas__yamazaki",
        "twitter.com/jujulife7",
        "note.com/fladdict",
        "zenn.dev/shin_semiya",
        "karapaia.com",
        "gigazine.net",
        "www.bengo4.com",
        "zenn.dev/nameless_sn"
    ];

    const entries = document.querySelectorAll('li.js-keyboard-selectable-item');
    for (let entry of entries) {
        const domain = entry.querySelector('p.entrylist-contents-domain')?.innerText.trim();
        if (hide_domains.includes(domain)) {
            entry.style.display = 'none';
        }
    }
})();