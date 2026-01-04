// ==UserScript==
// @name         Google reCAPTCHA Bypass to DuckDuckGo
// @name:zh-CN   Google 搜索需要验证时自动切换 DuckDuckGo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirects Google reCAPTCHA page to DuckDuckGo search with the same query
// @description:zh-cn Google 搜索需要验证时自动切换 DuckDuckGo 搜索相同内容
// @author       Dangel
// @license      MIT
// @match        https://www.google.com/sorry/index*
// @match        https://www.google.ad/sorry/index*
// @match        https://www.google.ae/sorry/index*
// @match        https://www.google.com.af/sorry/index*
// @match        https://www.google.com.ag/sorry/index*
// @match        https://www.google.com.ai/sorry/index*
// @match        https://www.google.al/sorry/index*
// @match        https://www.google.am/sorry/index*
// @match        https://www.google.co.ao/sorry/index*
// @match        https://www.google.com.ar/sorry/index*
// @match        https://www.google.as/sorry/index*
// @match        https://www.google.at/sorry/index*
// @match        https://www.google.com.au/sorry/index*
// @match        https://www.google.az/sorry/index*
// @match        https://www.google.ba/sorry/index*
// @match        https://www.google.com.bd/sorry/index*
// @match        https://www.google.be/sorry/index*
// @match        https://www.google.bf/sorry/index*
// @match        https://www.google.bg/sorry/index*
// @match        https://www.google.com.bh/sorry/index*
// @match        https://www.google.bi/sorry/index*
// @match        https://www.google.bj/sorry/index*
// @match        https://www.google.com.bn/sorry/index*
// @match        https://www.google.com.bo/sorry/index*
// @match        https://www.google.com.br/sorry/index*
// @match        https://www.google.bs/sorry/index*
// @match        https://www.google.bt/sorry/index*
// @match        https://www.google.co.bw/sorry/index*
// @match        https://www.google.by/sorry/index*
// @match        https://www.google.com.bz/sorry/index*
// @match        https://www.google.ca/sorry/index*
// @match        https://www.google.cd/sorry/index*
// @match        https://www.google.cf/sorry/index*
// @match        https://www.google.cg/sorry/index*
// @match        https://www.google.ch/sorry/index*
// @match        https://www.google.ci/sorry/index*
// @match        https://www.google.co.ck/sorry/index*
// @match        https://www.google.cl/sorry/index*
// @match        https://www.google.cm/sorry/index*
// @match        https://www.google.cn/sorry/index*
// @match        https://www.google.com.co/sorry/index*
// @match        https://www.google.co.cr/sorry/index*
// @match        https://www.google.com.cu/sorry/index*
// @match        https://www.google.cv/sorry/index*
// @match        https://www.google.com.cy/sorry/index*
// @match        https://www.google.cz/sorry/index*
// @match        https://www.google.de/sorry/index*
// @match        https://www.google.dj/sorry/index*
// @match        https://www.google.dk/sorry/index*
// @match        https://www.google.dm/sorry/index*
// @match        https://www.google.com.do/sorry/index*
// @match        https://www.google.dz/sorry/index*
// @match        https://www.google.com.ec/sorry/index*
// @match        https://www.google.ee/sorry/index*
// @match        https://www.google.com.eg/sorry/index*
// @match        https://www.google.es/sorry/index*
// @match        https://www.google.com.et/sorry/index*
// @match        https://www.google.fi/sorry/index*
// @match        https://www.google.com.fj/sorry/index*
// @match        https://www.google.fm/sorry/index*
// @match        https://www.google.fr/sorry/index*
// @match        https://www.google.ga/sorry/index*
// @match        https://www.google.ge/sorry/index*
// @match        https://www.google.gg/sorry/index*
// @match        https://www.google.com.gh/sorry/index*
// @match        https://www.google.com.gi/sorry/index*
// @match        https://www.google.gl/sorry/index*
// @match        https://www.google.gm/sorry/index*
// @match        https://www.google.gr/sorry/index*
// @match        https://www.google.com.gt/sorry/index*
// @match        https://www.google.gy/sorry/index*
// @match        https://www.google.com.hk/sorry/index*
// @match        https://www.google.hn/sorry/index*
// @match        https://www.google.hr/sorry/index*
// @match        https://www.google.ht/sorry/index*
// @match        https://www.google.hu/sorry/index*
// @match        https://www.google.co.id/sorry/index*
// @match        https://www.google.ie/sorry/index*
// @match        https://www.google.co.il/sorry/index*
// @match        https://www.google.im/sorry/index*
// @match        https://www.google.co.in/sorry/index*
// @match        https://www.google.iq/sorry/index*
// @match        https://www.google.is/sorry/index*
// @match        https://www.google.it/sorry/index*
// @match        https://www.google.je/sorry/index*
// @match        https://www.google.com.jm/sorry/index*
// @match        https://www.google.jo/sorry/index*
// @match        https://www.google.co.jp/sorry/index*
// @match        https://www.google.co.ke/sorry/index*
// @match        https://www.google.com.kh/sorry/index*
// @match        https://www.google.ki/sorry/index*
// @match        https://www.google.kg/sorry/index*
// @match        https://www.google.co.kr/sorry/index*
// @match        https://www.google.com.kw/sorry/index*
// @match        https://www.google.kz/sorry/index*
// @match        https://www.google.la/sorry/index*
// @match        https://www.google.com.lb/sorry/index*
// @match        https://www.google.li/sorry/index*
// @match        https://www.google.lk/sorry/index*
// @match        https://www.google.co.ls/sorry/index*
// @match        https://www.google.lt/sorry/index*
// @match        https://www.google.lu/sorry/index*
// @match        https://www.google.lv/sorry/index*
// @match        https://www.google.com.ly/sorry/index*
// @match        https://www.google.co.ma/sorry/index*
// @match        https://www.google.md/sorry/index*
// @match        https://www.google.me/sorry/index*
// @match        https://www.google.mg/sorry/index*
// @match        https://www.google.mk/sorry/index*
// @match        https://www.google.ml/sorry/index*
// @match        https://www.google.com.mm/sorry/index*
// @match        https://www.google.mn/sorry/index*
// @match        https://www.google.ms/sorry/index*
// @match        https://www.google.com.mt/sorry/index*
// @match        https://www.google.mu/sorry/index*
// @match        https://www.google.mv/sorry/index*
// @match        https://www.google.mw/sorry/index*
// @match        https://www.google.com.mx/sorry/index*
// @match        https://www.google.com.my/sorry/index*
// @match        https://www.google.co.mz/sorry/index*
// @match        https://www.google.com.na/sorry/index*
// @match        https://www.google.com.ng/sorry/index*
// @match        https://www.google.com.ni/sorry/index*
// @match        https://www.google.ne/sorry/index*
// @match        https://www.google.nl/sorry/index*
// @match        https://www.google.no/sorry/index*
// @match        https://www.google.com.np/sorry/index*
// @match        https://www.google.nr/sorry/index*
// @match        https://www.google.nu/sorry/index*
// @match        https://www.google.co.nz/sorry/index*
// @match        https://www.google.com.om/sorry/index*
// @match        https://www.google.com.pa/sorry/index*
// @match        https://www.google.com.pe/sorry/index*
// @match        https://www.google.com.pg/sorry/index*
// @match        https://www.google.com.ph/sorry/index*
// @match        https://www.google.com.pk/sorry/index*
// @match        https://www.google.pl/sorry/index*
// @match        https://www.google.pn/sorry/index*
// @match        https://www.google.com.pr/sorry/index*
// @match        https://www.google.ps/sorry/index*
// @match        https://www.google.pt/sorry/index*
// @match        https://www.google.com.py/sorry/index*
// @match        https://www.google.com.qa/sorry/index*
// @match        https://www.google.ro/sorry/index*
// @match        https://www.google.ru/sorry/index*
// @match        https://www.google.rw/sorry/index*
// @match        https://www.google.com.sa/sorry/index*
// @match        https://www.google.com.sb/sorry/index*
// @match        https://www.google.sc/sorry/index*
// @match        https://www.google.se/sorry/index*
// @match        https://www.google.com.sg/sorry/index*
// @match        https://www.google.sh/sorry/index*
// @match        https://www.google.si/sorry/index*
// @match        https://www.google.sk/sorry/index*
// @match        https://www.google.com.sl/sorry/index*
// @match        https://www.google.sn/sorry/index*
// @match        https://www.google.so/sorry/index*
// @match        https://www.google.sm/sorry/index*
// @match        https://www.google.sr/sorry/index*
// @match        https://www.google.st/sorry/index*
// @match        https://www.google.com.sv/sorry/index*
// @match        https://www.google.td/sorry/index*
// @match        https://www.google.tg/sorry/index*
// @match        https://www.google.co.th/sorry/index*
// @match        https://www.google.com.tj/sorry/index*
// @match        https://www.google.tl/sorry/index*
// @match        https://www.google.tm/sorry/index*
// @match        https://www.google.tn/sorry/index*
// @match        https://www.google.to/sorry/index*
// @match        https://www.google.com.tr/sorry/index*
// @match        https://www.google.tt/sorry/index*
// @match        https://www.google.com.tw/sorry/index*
// @match        https://www.google.co.tz/sorry/index*
// @match        https://www.google.com.ua/sorry/index*
// @match        https://www.google.co.ug/sorry/index*
// @match        https://www.google.co.uk/sorry/index*
// @match        https://www.google.com.uy/sorry/index*
// @match        https://www.google.co.uz/sorry/index*
// @match        https://www.google.com.vc/sorry/index*
// @match        https://www.google.co.ve/sorry/index*
// @match        https://www.google.vg/sorry/index*
// @match        https://www.google.co.vi/sorry/index*
// @match        https://www.google.com.vn/sorry/index*
// @match        https://www.google.vu/sorry/index*
// @match        https://www.google.ws/sorry/index*
// @match        https://www.google.rs/sorry/index*
// @match        https://www.google.co.za/sorry/index*
// @match        https://www.google.co.zm/sorry/index*
// @match        https://www.google.co.zw/sorry/index*
// @match        https://www.google.cat/sorry/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496718/Google%20reCAPTCHA%20Bypass%20to%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/496718/Google%20reCAPTCHA%20Bypass%20to%20DuckDuckGo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Extract the 'continue' parameter which contains the original search query
    const urlParams = new URLSearchParams(window.location.search);
    const continueUrl = urlParams.get('continue');

    if (continueUrl) {
        // Extract the 'q' parameter from the 'continue' URL
        const continueUrlParams = new URLSearchParams(new URL(continueUrl).search);
        const searchQuery = continueUrlParams.get('q');

        if (searchQuery) {
            // Decode the search query
            const decodedQuery = decodeURIComponent(searchQuery);

            // Construct the DuckDuckGo search URL
            const duckDuckGoUrl = `https://duckduckgo.com/?q=${encodeURIComponent(decodedQuery)}`;

            // Redirect to DuckDuckGo
            window.location.href = duckDuckGoUrl;
        }
    }
})();