// ==UserScript==
// @name         Claim Shortlinks Auto
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  Claim auto shortlink
// @author       Groland
// @match        https://coinpayz.xyz/*
// @match        https://keforcash.com/*
// @match        https://claimcoin.in/*
// @match        https://pepy.monster/*
// @match        https://bitfaucet.net/*
// @match        https://cryptifo.com/*
// @match        https://coinymate.com/*
// @match        https://adbitcoins.com/*
// @match        https://viefaucet.com/*
// @match        https://insfaucet.xyz/*
// @match        https://99faucet.com/*
// @match        https://autobitco.in/*
// @match        https://banfaucet.com/*
// @match        https://acryptominer.io/*
// @match        https://coinjo.top/*
// @match        https://feyorra.top/*
// @match        https://coingux.com/*
// @match        https://flukelabs.com/*
// @match        https://whoopyrewards.com/*
// @match        https://mezo.live/*
// @match        https://liteearn.com/*
// @match        https://tronpayz.com/*
// @match        https://autofaucet.top/*
// @match        https://autofaucet.org/*
// @match        https://cryptoviefaucet.com/*
// @match        https://claimcoins.net/*
// @match        https://coinjo.top/*
// @match        https://claimfreetrx.online/*
// @match        https://freeltc.fun/*
// @match        https://cryptofuture.co.in/*
// @match        https://onlyfaucet.com/*
// @match        https://claim88.fun/*
// @match        https://free-bonk.com/*
// @match        https://chillfaucet.in/*
// @match        https://litefaucet.in/*
// @match        https://memearns.com/*
// @match        https://www.freebnbcoin.com/*
// @match        https://earncryptowrs.in/*
// @match        https://earnfreebtc.io/*
// @match        https://claimtrx.com/*
// @match        https://feyorra.site/*
// @match        https://www.taboola.com/*
// @match        https://autoclaim.in/*
// @match        https://farazfaucets.com/*
// @match        https://claimercorner.xyz/*
// @match        https://tetheradclicks.com/*
// @match        https://ltcfaucet.io/*
// @match        https://cashbux.work/*
// @match        https://freeltc.online/*
// @match        https://faucet1.site/*
// @match        https://proinfinity.fun/*
// @match        https://altcryp.com/*
// @match        https://earn-pepe.com/*
// @icon         https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmtEHu6qsI8KT52OAW-9ch0BnCDWJqhfU8vvu4hi9m2vBkhkTMX7gULQOI_rfLmEYGXwtuywv7Pk8Nt30LTN8je3pyy9ZerWJCCVpDw4aKVrRsRuXgNeSJyiI_aQ7UUZrepS71GYufOuCdp4scX45lpSkoZtTWlBE1Yg-rwYZlfNCZKemY-oKcP5FX5EpS/s2200/3.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478842/Claim%20Shortlinks%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/478842/Claim%20Shortlinks%20Auto.meta.js
// ==/UserScript==


   (function() {
    'use strict';


        

    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-lg-3 > .card');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
        'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'Earnow',
        'Shortest',
        'easycut.io',
        'Shortino',
        'Shortano',
        'octolinkz',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        '1Short',
        'clks',
        'EarnNow',
        'Earnow',
        'PROMO',
        'Fc.lc',
        'MegaURL',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'dot link',
        'Doshrink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Adbits',
        'Clks',
        'ClickWiz',
        'btcut.io',
        'adlink.click',
        'ctr.sh',
        'rsshort.com',
        'LFly',
        'Link3s',
        'V2p',
        'faho',
        'earnow.online',
        'new',
        'URLCUT',
        'REVCUT',
        'Shrinkme',
        'ShrinkEarn',
        'ClkSh',
        'Shortlinks',
        'Clkst',
        'Clks.pro',
        'Inlinks',
        'Cutlink',
        'Vie Shorts',
        'linksfly Link',
        'Bitss',
        'Usalink',
        'EARN NOW 250 TOKEN',
        'AdLink',
        'Adbux',
        'Shortlno',
        'Shorts url',
        'Adlink',
        'Paylinks',
        'Chainfo',
        'Slfly.net',
        'Swiftlnx',
        '1Short',
        'Link Z Fly',
        'Swiftlinx',
        'Urlfly',
        'CLK 150 TOKEN',
        'Short1'
        /// (Coinpayz, Tronpayz, Freeltc.online)
    ];

    removeAreasByNames(namesToRemove);

(function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-lg-6 h3');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
         'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'clks',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Rsshort.com',
        'Wefly.me',
        'Chaininfo',
        'Fclc',
        'Birdurl',
        'Fc.lc',
        'MegaURL',
        'promo-visits.site',
        'Linkdam',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'Rsshort',
        'Shortme',
        'Adlink',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'cutlink',
        'shortano',
        'Flukesnips',
        'octolinkz',
        'BONK Links',
        'MS link',
        'shortano',
        'Cutlink',
        'shortino',
        'urlcut',
        'inlinks',
        'bitss',
        'earnow',
        'revcut',
        'Short1'
        /// (stakeone)
    ];

    removeAreasByNames(namesToRemove);

       (function() {
    'use strict';

if (window.location.href.includes("https://free-bonk.com/")){
    setTimeout(function(){
    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-lg-4.col-md-6 > .card > .text-center.card-body > .mt-0.f-w-700.f-24.card-title');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
         'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'clks',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Rsshort.com',
        'Wefly.me',
        'Fc.lc',
        'MegaURL',
        'promo-visits.site',
        'Linkdam',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'Rsshort',
        'Adlink',
        'EarnNow',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'Revcut',
        'cutlink',
        'shortano',
        'Flukesnips',
        'octolinkz',
        'BONK Links',
        'MS link',
        'shortano',
        'shortino',
        'Sharecut',
        'urlcut',
        'inlinks',
        'ShareCut',
        'Zshort',
        'bitss',
        'earnow',
        'revcut',
        'Short1'
        /// (free-bonk)
    ];

    removeAreasByNames(namesToRemove);
    }, 2000);

}




(function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-lg-4 .card-body.card');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
         'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'clks',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Rsshort.com',
        'Wefly.me',
        'Fc.lc',
        'MegaURL',
        'promo-visits.site',
        'Linkdam',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'Rsshort',
        'Adlink',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'cutlink',
        'shortano',
        'octolinkz',
        'shortano',
        'shortino',
        'urlcut',
        'inlinks',
        'bitss',
        'earnow',
        'revcut',
        'Short1'
        /// (whoopyreward)
    ];

    removeAreasByNames(namesToRemove);

     (function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.item  .desc');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
        'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Exe',
        'Earnow',
        'Shortyfi',
        'Shortino',
        'Shortano',
        'octolinkz',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'ghj',
        'Earnow',
        'PROMO',
        'Fc.lc',
        'MegaURL',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'dot link',
        'Doshrink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Adbits',
        'ClickWiz',
        'LFly',
        'Link3s',
        'V2p',
        'faho',
        'new',
        'URLCUT',
        'REVCUT',
        'Shrinkme',
        'ShrinkEarn',
        'ClkSh',
        'Clkst',
        'Usalink',
        'EARN NOW 250 TOKEN',
        'AdLink',
        'Easycut',
        'Adlink',
        'Genlink',
         'Adlink',
        'Genlink',
        'Shrinkearn',
        'Cuty',
        'Megaurl',
        'Megafly',
        'Clk-sh',
        'Shortox',
        'Powclick',
        'Fc-Lc',
        'Shrinkearn',
        'Cuty',
        'Megaurl',
        'Megafly',
        'Clk-sh',
        'Shortox',
        'Powclick',
        'Linkrex',
        'Fc-Lc',
        'Slfly.net',
        'Rsshort',
        'Short1'
        // (autobitcoin,autofaucet,autoclaim)
    ];

    removeAreasByNames(namesToRemove);
    (function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-sm-6 .card-title');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
        'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'AdLink',
        'Exe',
        'shortino',
        'Earnow',
        'Shortest',
        'Shortino',
        'Shortano',
        'octolinkz',
        'Gai',
        'Liksflyl',
        'Promo-Visits',
        'Shrinkearn',
        'Linksly',
        'PROMO',
        'Try2link',
        'MegaURL',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'dot link',
        'Doshrink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Adbits',
        'Clks',
        'ClickWiz',
        'LFly',
        'Link3s',
        'V2p',
        'LinksFly.link',
        'new',
        'ClockAd',
        'REVCUT',
        'Shrinkme',
        'ShrinkEarn',
        'ClkSh',
        'Clkst',
        'clks.pro',
        'clk.sh',
        'Lfly',
        'teralinks.in',
        'Clk.sh',
        'urlpay.in',
        'Inlinks',
        'AdLink',
        'shortano.link',
        'clks.pro',
        'Adbx',
        'Slfly.net',
        'Earnifypro',
        'Cutlink.xyz',
        'Rsshort.com',
        'shortino.link',
        'CLK 150 TOKEN',
        'Short1'
        /// (suites email adress)
    ];

    removeAreasByNames(namesToRemove);
       ///////////////////////////////////////////////////////////////

       (function() {
        'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-sm-4> .card');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
       'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'Earnow',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Wefly.me',
        'Fc.lc',
        'MegaURL',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'ghjm',
        'Adlink',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Lksfly',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Adbits',
        'Ctr.sh',
        'Earnow',
        'Clks',
        'Flyshort',
        'V2p',
        'Shrinkme',
        'Earn.now',
        'Linkfly',
        'Earnify pro',
        'ShrinkEarn',
        'ClkSh',
        'Slfly.net',
        'AdLink',
        'Short1'
        /// (insfaucet)
    ];

    removeAreasByNames(namesToRemove);

(function() {

    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-xl-4.col-md-6.col-12  .card-header');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
         'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'Edj',
        'Shortest',
        'Shortino',
        'Shortano',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'Fc.lc',
        'MegaURL',
        'promo-visits.site',
        'Linkdam',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'Doshrink',
        'clk.st',
        'adbit',
        'Try2link',
        'Revcut.net',
        'Adlink',
        'Shorti',
        'Usalink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'Rsshort.com',
        'octolinkz',
        'earnow',
        'Slfly.net',
        'Short1'
        /// (keforcash)
    ];

    removeAreasByNames(namesToRemove);

    (function() {
    'use strict';


    function removeAreasByNames(names) {
        var elements = document.querySelectorAll('.col-lg-4.col-md-6 .card-title');
elements.forEach(function(element) {
            var elementText = element.textContent.trim();
            names.forEach(function(name) {
                if (elementText.includes(name)) {
                    element.parentElement.remove();
                }
            });
        });
    }


    var namesToRemove = [
        'sli',
        'ShrinkEarn',
        'Octolinkz',
        'Uptolink',
        'Exe',
        'Earnow',
        'Shortest',
        'Shortino',
        'Shortano',
        'octolinkz',
        'Gainlink',
        'Exalink',
        'Promo-Visits',
        'ghj',
        'clks',
        'Earnow',
        'PROMO',
        'Fc.lc',
        'RSshort',
        'Try2link.com',
        'Shrinkearn.com',
        'Exe.io',
        'Cutp',
        'dot link',
        'Doshrink',
        'LTC25.in',
        'Wez.info',
        'FlyAd',
        'octolinkz',
        'earnow',
        'clkspro',
        '1short',
        'Adbits',
        'Clks',
        'ClickWiz',
        'LFly',
        'Link3s',
        'V2p',
        'faho',
        'new',
        'URLCUT',
        'REVCUT',
        'earnow.online',
        'shortino.link',
        'linksly.co',
        'Shortlinks',
        'Clkst',
        'Clks.pro',
        'RsShort',
        'Usalink',
        'EARN NOW 250 TOKEN',
        'AdLink',
        'Slfly.net',
        'adbx.pro',
        'CLK 150 TOKEN',
        'Short1'
        /// (claimcorner)
    ];

    removeAreasByNames(namesToRemove);



if (window.location.href.includes("https://banfaucet.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('div[class="col-lg-6 col-xl-4"]');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Earnow.Online") ||
                textoCartao.includes("#1 Shortener") ||
                textoCartao.includes("Bitss") ||
                textoCartao.includes("Inlinks") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Rsshort") ||
                textoCartao.includes("Cashfly") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

if (window.location.href.includes("https://cryptifo.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.carde');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Clks") ||
                textoCartao.includes("Adrinolinks") ||
                textoCartao.includes("Earnow") ||
                textoCartao.includes("Try2link") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Cutlink") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}


if (window.location.href.includes("https://adbitcoins.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-md-12');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Paycut") ||
                textoCartao.includes("sharecut") ||
                textoCartao.includes("linksflame") ||
                textoCartao.includes("Zshort") ||
                textoCartao.includes("SLfly") ||
                textoCartao.includes("linkswift") ||
                textoCartao.includes("EARNOW") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

  if (window.location.href.includes("https://acryptominer.io/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-md-4');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("10 / 10") ||
                textoCartao.includes("sharecut") ||
                textoCartao.includes("linksflame") ||
                textoCartao.includes("Zshort") ||
                textoCartao.includes("SLfly") ||
                textoCartao.includes("linkswift") ||
                textoCartao.includes("EARNOW") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

  if (window.location.href.includes("https://99faucet.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-lg-6');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Clks") ||
                textoCartao.includes("Rsshort") ||
                textoCartao.includes("linksflame") ||
                textoCartao.includes("Zshort") ||
                textoCartao.includes("SLfly") ||
                textoCartao.includes("linkswift") ||
                textoCartao.includes("EARNOW") ||
                textoCartao.includes("Shorti.Io") ||
                textoCartao.includes("Urlcut") ||
                textoCartao.includes("Chainfo") ||
                textoCartao.includes("V2p") ||
                textoCartao.includes("Usalink") ||
                textoCartao.includes("Coinfays") ||
                textoCartao.includes("Dutchycorp.Ovh") ||
                textoCartao.includes("Clks.Pro") ||
                textoCartao.includes("C2g") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

       if (window.location.href.includes("https://free-bonk.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-lg-4.col-md-6');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("1/10") ||
                textoCartao.includes("Clks.Pro")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

 if (window.location.href.includes("https://feyorra.site/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-lg-4.col-md-6 .btn');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("20") ||
                textoCartao.includes("COOLDOWN")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

if (window.location.href.includes("https://earn-pepe.com/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-lg-4.col-md-6 .btn');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("20") ||
                textoCartao.includes("Cooldown")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}

    if (window.location.href.includes("https://bitfaucet.net/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.col-xl-4.col-lg-6');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Thshort") ||
                textoCartao.includes("Surf") ||
                textoCartao.includes("Clks")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}
        if (window.location.href.includes("https://coinjo.top/")){
        function removerCartoes() {
        var cartoes = document.querySelectorAll('.p-4.bg-white.border.rounded-2lg');
        cartoes.forEach(function(cartao) {
            var textoCartao = cartao.innerText;
            if (textoCartao.includes("Linksflyl") ||
                textoCartao.includes("Revcut") ||
                textoCartao.includes("Clks")) {
                cartao.remove();
            }
        });
    }
        removerCartoes();
}
          if (window.location.href.includes("https://feyorra.site/")) {
            const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick(".col-lg-4.col-md-6 .btn")
    }, 1000);
        }

        if (window.location.href.includes("https://claimcoin.in/")){
          setTimeout (function() { document.querySelector('.col-lg-3.col-md-6:nth-of-type(1)').remove();}, 1000)
          setTimeout (function() { document.querySelector('.col-lg-3.col-md-6:nth-of-type(1)').remove();}, 1000)
}
        if (window.location.href.includes("https://coinjo.top/")){
        document.querySelector('.shadow-accent-volume.bg-accent.mt-4').click(); }
     
    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
        setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
         setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
         setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
        setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
        setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5)').remove();}, 4000)
}
          
    if (window.location.href.includes("https://bitfaucet.net/")){
     document.querySelector('.col-xl-4.col-lg-6 .w-100.gradient_btn.c_btn.btn').click();}   
       
    if (window.location.href.includes("https://claimcoin.in/")){
     setTimeout (function() { document.querySelector('.col-lg-3 .waves-light.waves-effect.btn-primary.btn').click();}, 100)
 }
      if (window.location.href.includes("https://flukelabs.com/")) {


                const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick("#pills-links-tab")
    }, 1000);


        }

            if (window.location.href.includes("https://flukelabs.com/")) {
            const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick(".col-lg-4.col-md-6:nth-of-type(3) .text-info.bg-light-info.mt-4.w-100.btn")
    }, 1000);
        }  

    if (window.location.href.includes("https://autoclaim.in/")){
     document.querySelector('.item  .visit-button.btn-success.btn > .fa-external-link-alt.fas').click();}
     
      if (window.location.href.includes("https://cryptifo.com/")){
     document.querySelector('.carde .start-button').click();}
    
    if (window.location.href.includes("https://autofaucet.org/")){
     document.querySelector('.item  .visit-button.btn-success.btn > .fa-external-link-alt.fas').click();}

    if (window.location.href.includes("https://autobitco.in/")){
     document.querySelector('.item  .visit-button.btn-success.btn > .fa-external-link-alt.fas').click();}

    if (window.location.href.includes("https://coinjo.top/")){
     document.querySelector('.layout-spacing.col-sm-4 .text-center.waves-light.waves-effect.btn-block.btn-success.btn').click(); }

    if (window.location.href.includes("https://freeltc.fun/") && document.body.innerHTML.includes("Claim")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://keforcash.com/")){
     document.querySelector('.col-xl-4.col-md-6.col-12 .btn-block.btn-lg.btn-primary.btn').click();}


    if (window.location.href.includes("https://insfaucet.xyz/")){
     document.querySelector('.layout-spacing.col-sm-4 .text-center.waves-light.waves-effect.btn-block.btn-success.btn').click(); }

    if (window.location.href.includes("https://feyorra.top/") && document.body.innerHTML.includes("Claim")){
     document.querySelector('.mb-lg-0.mb-3.col-lg-4.col-md-6:nth-of-type(1) .waves-light.waves-effect.w-100.btn-one.btn').click();}


    if (window.location.href.includes("https://claimtrx.com/")){
     document.querySelector('.mb-lg-0.mb-3.col-lg-4.col-md-6:nth-of-type(1) .w-100.btn-success.btn').click(); }


    if (window.location.href.includes("https://claimcoins.net/")){
     document.querySelector('.col-sm-6 .waves-light.waves-effect.btn-primary.btn').click(); }

    if (window.location.href.includes("https://cryptofuture.co.in/")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://coinjo.top/") && document.body.innerHTML.includes("Claim")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://earncryptowrs.in/links")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://chillfaucet.in/") && document.body.innerHTML.includes("Claim")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://onlyfaucet.com/") && document.body.innerHTML.includes("Claim")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://tronpayz.com/")){
     document.querySelector('.col-lg-3 .waves-light.waves-effect.btn-primary.btn').click(); }

    if (window.location.href.includes("https://liteearn.com/")){
     document.querySelector('.col-lg-3 .btn').click(); }

    if (window.location.href.includes("https://litefaucet.in/")){
     document.querySelector('.col-lg-3 .btn').click(); }

    if (window.location.href.includes("https://earnfreebtc.io/")){
     document.querySelector('.col-lg-3 .btn').click(); }

    if (window.location.href.includes("https://claim88.fun/")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://coinpayz.xyz/")){
     document.querySelector('.col-lg-3 .btn').click(); }

   if (window.location.href.includes("https://coinymate.com/")){
     document.querySelector('.col-lg-3 .waves-light.waves-effect.btn-primary.btn').click(); }


    if (window.location.href.includes("https://ltcfaucet.io/")){
     document.querySelector('.col-lg-3 .btn').click(); }

    if (window.location.href.includes("https://claimercorner.xyz/web/links")){
     document.querySelector('.col-lg-4.col-md-6 .btn').click(); }


    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(1) .Buttons_btn_2__5Hb6D').click();}, 14000)}

    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(2) .Buttons_btn_2__5Hb6D').click();}, 14000)}

    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(3) .Buttons_btn_2__5Hb6D').click();}, 14000)}

    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(4) .Buttons_btn_2__5Hb6D').click();}, 14000)}

    if (window.location.href.includes("https://farazfaucets.com/")) {
    setTimeout (function() { document.querySelector('.Shortlinks_shortlink_card__Cez5B:nth-of-type(5) .Buttons_btn_2__5Hb6D').click();}, 22000)}

    if (window.location.href.includes("https://farazfaucets.com/")){
     setTimeout (function() { document.querySelector('.Buttons_btn_1__4PfZq').click(); }, 16000)}

    if (window.location.href.includes("https://viefaucet.com/")) {
    setTimeout (function() { document.querySelector('.is-guttered.el-col-xl-8.el-col-lg-8.el-col-md-8.el-col-sm-12.el-col-xs-24.el-col-24.el-col  .el-button--success.el-button').click();}, 4000)};

    if (window.location.href.includes("https://tetheradclicks.com/")){
     document.querySelector('.col-md-12:nth-of-type(2) .btn-primary.btn-block.btn.card-link').click(); }

    if (window.location.href.includes("https://freeltc.online/")){
     document.querySelector('.col-lg-4 .btn').click(); }

    if (window.location.href.includes("https://faucet1.site/")){
     document.querySelector('.col-lg-3:nth-of-type(1) .waves-light.waves-effect.btn-primary.btn').click(); }

    if (window.location.href.includes("https://altcryp.com/")){
     document.querySelector('.col-sm-6 .btn').click(); }



     if (window.location.href.includes("https://earn-pepe.com/")){
       const bp = query => document.querySelector(query);const BpAll = query => document.querySelectorAll(query);
    function SubmitBp(selector, time = 1) {let elem = (typeof selector === 'string') ? bp(selector).closest('form') : selector; console.log(elem); setTimeout(() => {elem.submit();}, time * 1000);}
    function sleep(ms) {return new Promise((resolve) => setTimeout(resolve, ms));}
  function elementReady(selector) {return new Promise(function(resolve, reject) {let element = bp(selector);
      if (element) {resolve(element); return;} new MutationObserver(function(_, observer) {element = bp(selector);
      if (element) {resolve(element); observer.disconnect();}}).observe(document.documentElement, {childList: true, subtree: true});});}

    function ReadytoClick(selector, sleepTime = 0) {const events = ["mouseover", "mousedown", "mouseup", "click"];const selectors = selector.split(', ');
    if (selectors.length > 1) {return selectors.forEach(ReadytoClick);}if (sleepTime > 0) {return sleep(sleepTime * 1000).then(function() {ReadytoClick(selector, 0);});}
    elementReady(selector).then(function(element) {element.removeAttribute('disabled');element.removeAttribute('target');
        events.forEach(eventName => {const eventObject = new MouseEvent(eventName, {bubbles: true}); element.dispatchEvent(eventObject);});});}
setTimeout (function () {


      ReadytoClick(".w-100.text-white.btn-info.btn")
    }, 1000);

    }

    if (window.location.href.includes("https://claimfreetrx.online/")){
     document.querySelector('.col-sm-6 .btn').click(); }

    if (window.location.href.includes("https://cashbux.work/")){
     document.querySelector('.col-lg-3 .btn').click(); }
     
    if (window.location.href.includes("https://pepy.monster/")){
     document.querySelector('.col-lg-3 .btn').click(); } 

    if (window.location.href.includes("https://whoopyrewards.com/")){
     document.querySelector('.col-lg-4 .btn').click(); }

    if (window.location.href.includes("https://99faucet.com/")){
     document.querySelector('.col-lg-6 .w-100.text-white.claim-btn').click(); }



         if (window.location.href.includes("https://free-bonk.com/")){

    setTimeout(function() {document.querySelector('.col-lg-4.col-md-6 > .card > .text-center.card-body > .my-2.text-center > .waves-light.waves-effect.btn-primary.w-100.btn').click();}, 4000);

 }

     
        if (window.location.href.includes("https://adbitcoins.com/")){
                setTimeout (function() { document.querySelector('.col-md-12 > .text-center.text-white.bg-dark.border-danger.card > .card-body > .row > div.col:nth-of-type(4) > .btn-success.btn-block.btn-sm.card-link').click();}, 500);

          }
         
         if (window.location.href.includes("https://coingux.com/")){
     document.querySelector('.col-lg-4.col-md-6:nth-of-type(2) > .card > .text-center.card-body > .justify-content-between.align-items-center.flex-grow-1.row > div:nth-of-type(2) > .w-100.text-white.btn-sm.btn-info.btn.claim-button').click();
 }

         
  if (window.location.href.includes("https://acryptominer.io/")){
        var BOT = setInterval(function() {
 if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector(".col-md-4 > .wallet-card > .flex-wrap.wallet-item > .withdraw-btn.shortlinkBtn").click() ;
                clearInterval(BOT);

            }
        }, 140000);
                                }


   


    if (window.location.href.includes("https://www.freebnbcoin.com/")){
     document.querySelector('.col-lg-3 .btn').click(); }

    if (window.location.href.includes("https://memearns.com/")){
     document.querySelector('.col-lg-6 .w-100.text-white.text-center.surfbtn').click(); }
setTimeout (function () {
if (window.location.href.includes("https://proinfinity.fun/")){
     document.querySelector('.css-8fi2z5.MuiButton-containedSizeMedium.MuiButton-sizeMedium.MuiButton-containedPrimary.MuiButton-contained.MuiLoadingButton-root.MuiButton-root.MuiButtonBase-root').click(); }

}, 5000);

        if (window.location.href.includes("https://banfaucet.com/")){
     document.querySelector('.col-xl-4.col-lg-6 .btn-one').click();}




    if (window.location.href.includes("https://www.taboola.com/")){
   setTimeout (function () { window.close();},100);}

    if (swal){
     document.querySelector('.swal2-show.swal2-icon-warning.swal2-modal.swal2-popup .swal2-styled.swal2-confirm').click(); }

})();
})();
})();

    })();
})();

})();

})();

})();

})();
