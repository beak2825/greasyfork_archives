// ==UserScript==
// @name         Vie Faucet Website Rotator . Auto PTC, Auto Faucet & Auto Shortlinks Support
// @version      1.10.5
// @description  Automatically views all PTC ads and Rotate websites
// @author       stealtosvra
// @include /^(https?:\/\/)(.+)?(888satoshis|accessonto|bazadecrypto|bifaucet|bitcoinpayu|bitcointrophy|bdfaucet|bitefaucet|btcad24|btcbunch|claimprocoin|claimro|claimtrx|claimvip|clixhog|coin-4u|coingax|coinmb|coinpayu24|coinpayufree|coinsnopy|criptoshark|cryptospaying|dinofaucet|earnviv|faucet-satoushi|faucet4u|faucetbazzar|faucetcryptos|faucetinstant|faucetltc|faucetspeedbtc|faucetoshi|freebitcoingroup|furyfaucet|ganarbitcoindesdecuba|ignite-blockchain|james-trussy|kiddyearner|landofbits|litecoinline|lolfaucet|ltc24|miner-sim|mixfaucet|nobitafc|pinoyfaucet|ptc4btc|ptcbits|satoshiadview|takeclicks|teethblock|tikiearn|titansbrand|tron-free|usdtsurf|vivofaucet|viefaucet|wincrypt2|yfaucet|ziifaucet)(\.com)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bitsfree|claimtoro|coinoto|cryptoflare|cryptojunkie|faucetclub|faucetcrypto|multicoins|spaceshooter)(\.net)(\/.*)/
// @include /^(https?:\/\/)(.+)?(autolitecoin||claimercorner|claimsatoshi|coinpayz|cryptask|flashfaucet|paidbucks|satoshi-win)(\.xyz)(\/.*)/
// @include /^(https?:\/\/)(.+)?(coinfaucet|feyorra|forexfiter|freebinance|freebitcoin|freesolana|freetron|earnads)(\.top)(\/.*)/
// @include /^(https?:\/\/)(.+)?(coinpot|cryptomaker|gpflix)(\.in)(\/.*)/
// @include /^(https?:\/\/)(.+)?(crypto-farms|crypto143|etcoin)(\.site)(\/.*)/
// @include /^(https?:\/\/)(.+)?(buxcoin|starcrypto)(\.io)(\/.*)/
// @include /^(https?:\/\/)(.+)?(hatecoin|hatecoin)(\.me)(\/.*)/
// @include /^(https?:\/\/)(.+)?(bitfaucet|earnbtc)(\.pw)(\/.*)/
// @include /^(https?:\/\/)(.+)?(cryptobigpay|faucettr)(\.online)(\/.*)/
// @include /^(https?:\/\/)(.+)?(earncrypto|faucetcaptcha)(\.co.in(\/.*)/
// @match        https://bithub.win/*
// @match        https://bits.re/*
// @match        https://claimcash.cc/*
// @match        https://contentos.one/*
// @match        https://cryptoaffiliates.store/*
// @match        https://cryptoukr.in.ua/*
// @match        https://earnmoney.24payu.net/*
// @match        https://earnsolana.xyz/
// @match        https://earnsolana.xyz/login
// @match        https://earnsolana.xyz/dashboard
// @match        https://earnsolana.xyz/ptc
// @match        https://earnsolana.xyz/ptc/*
// @match        https://earnsolana.xyz/faucet
// @match        https://ezimg.co/*
// @match        https://faucet.pk/*
// @match        https://flycrypto.tn/*
// @match        https://freeshib.biz/*
// @match        https://goldsurferfaucet.de/*
// @match        https://myfaucet.pro/*
// @match        https://shiba.arbweb.info/*
// @match        https://xfaucet.org/*
// @match        https://xtrabits.click/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @namespace    VengeanceXBT
// @downloadURL https://update.greasyfork.org/scripts/460804/Vie%20Faucet%20Website%20Rotator%20%20Auto%20PTC%2C%20Auto%20Faucet%20%20Auto%20Shortlinks%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/460804/Vie%20Faucet%20Website%20Rotator%20%20Auto%20PTC%2C%20Auto%20Faucet%20%20Auto%20Shortlinks%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // INSERT YOUR CREDENTIALS
    const email = "email@gmail.com";
    const password = "123";

    const website = window.location.hostname;
    const domainParts = website.split(".");
    const tld = domainParts.pop();
    const domain = domainParts.pop();
    const key = `${domain}.${tld}`.replace(/^www\./, "");
    const currentUrl = window.location.href;
    const targetUrl = `https://${key}`;
    const linkElement = document.querySelector('a[target="_blank"].btn.btn-primary.waves-effect.waves-light');
    const anchorElement = document.querySelector('a[target="_blank"].btn.btn-success.waves-effect.waves-light');
    const emailField = document.querySelector("#email");
    const passwordField = document.querySelector("#password");
    const submitButton = document.querySelector("button[type='submit']");
    const selectElement = document.querySelector('.form-control');
    const countdown = document.getElementById("ptcCountdown");
    const iframe = document.createElement('iframe');

    const dropdown = document.createElement('div');
    dropdown.style.position = 'fixed';
    dropdown.style.bottom = '-100px';
    dropdown.style.right = '25px';
    dropdown.style.padding = '25px';
    dropdown.style.backgroundColor = 'rgba(255, 0, 0)';
    dropdown.style.zIndex = '99999';
    dropdown.style.borderRadius = '25px';
    dropdown.style.cursor = 'pointer';
    dropdown.style.opacity = '0';
    dropdown.style.transition = 'opacity 3s ease, bottom 3s ease';
    requestAnimationFrame(() => {dropdown.style.opacity = '1'; dropdown.style.bottom = '25px';});

    const button = document.createElement('button');
    button.textContent = 'Select Rotation';
    button.style.border = 'none';
    button.style.backgroundColor = 'transparent';
    button.style.color = '#fff';
    button.style.fontWeight = 'bold';
    button.style.textTransform = 'uppercase';
    button.addEventListener('click', toggleDropdown);

    const options = document.createElement('ul');
    options.style.listStyle = 'none';
    options.style.margin = '0';
    options.style.padding = '0';
    options.style.display = 'none';

    const hcaptcha = document.createElement('li');
    hcaptcha.style.cursor = 'crosshair';
    hcaptcha.style.color = '#fff';
    hcaptcha.style.fontSize = '14px';
    hcaptcha.addEventListener('click', () => {
        window.location.href = 'https://link1s.com/ZIJofc';});

    const hcaptchaIcon = document.createElement('img');
    hcaptchaIcon.src = 'https://cdn.worldvectorlogo.com/logos/hcaptcha-2.svg';
    hcaptchaIcon.width = '16';
    hcaptchaIcon.height = '16';
    hcaptcha.appendChild(hcaptchaIcon);
    hcaptcha.appendChild(document.createTextNode(' hCaptcha'));

    const recaptcha = document.createElement('li');
    recaptcha.style.cursor = 'crosshair';
    recaptcha.style.color = '#fff';
    recaptcha.style.fontSize = '14px';
    recaptcha.addEventListener('click', () => {
        window.location.href = 'https://link1s.com/9CwA2F';});

    const recaptchaIcon = document.createElement('img');
    recaptchaIcon.src = 'https://seeklogo.com/images/R/recaptcha-logo-B20692A07D-seeklogo.com.png';
    recaptchaIcon.width = '16';
    recaptchaIcon.height = '16';
    recaptcha.appendChild(recaptchaIcon);
    recaptcha.appendChild(document.createTextNode(' reCaptcha'));

    const mooncaptcha = document.createElement('li');
    mooncaptcha.style.cursor = 'crosshair';
    mooncaptcha.style.color = '#fff';
    mooncaptcha.style.fontSize = '14px';
    mooncaptcha.addEventListener('click', () => {
        window.location.href = 'https://link1s.com/3Vxieerp';});

    const mooncaptchaIcon = document.createElement('img');
    mooncaptchaIcon.src = 'https://i.imgur.com/sbEker1.png';
    mooncaptchaIcon.width = '16';
    mooncaptchaIcon.height = '16';
    mooncaptcha.appendChild(mooncaptchaIcon);
    mooncaptcha.appendChild(document.createTextNode(' Moon Captcha'));

    const shortlinks = document.createElement('li');
    shortlinks.style.cursor = 'crosshair';
    shortlinks.style.color = '#fff';
    shortlinks.style.fontSize = '14px';
    shortlinks.addEventListener('click', () => {
        window.location.href = `https://${key}/links`;});

    const shortlinksIcon = document.createElement('img');
    shortlinksIcon.src = 'https://cdn-icons-png.flaticon.com/512/2885/2885430.png';
    shortlinksIcon.width = '16';
    shortlinksIcon.height = '16';
    shortlinks.appendChild(shortlinksIcon);
    shortlinks.appendChild(document.createTextNode(' Shortlinks'));

    const faucets = document.createElement('li');
    faucets.style.cursor = 'crosshair';
    faucets.style.color = '#fff';
    faucets.style.fontSize = '14px';
    faucets.addEventListener('click', () => {
        window.location.href = `https://${key}/faucet`;});

    const faucetsIcon = document.createElement('img');
    faucetsIcon.src = 'https://seeklogo.com/images/T/TORNEIRA_-_FAUCET-logo-94353E191C-seeklogo.com.png';
    faucetsIcon.width = '16';
    faucetsIcon.height = '16';
    faucets.appendChild(faucetsIcon);
    faucets.appendChild(document.createTextNode(' Faucet'));
    options.appendChild(hcaptcha);
    options.appendChild(recaptcha);
    options.appendChild(mooncaptcha);
    options.appendChild(shortlinks);
    options.appendChild(faucets);
    dropdown.appendChild(button);
    dropdown.appendChild(options);
    document.body.appendChild(dropdown);


    const ptcLinks = [

        ["https://accessonto.com/ptc", "https://ouo.io/Z13skB"],
        ["https://bdfaucet.com/ptc", "https://link1s.com/dQTf34i"],
        ["https://bitfaucet.pw/ptc", "https://link1s.com/dQTf34i"],
        ["https://claimcash.cc/ptc", "https://ex-foary.com/Y832wzRe"],
        ["https://claimercorner.xyz/web/ptc", "http://nx.chainfo.xyz/BKvB"],
        ["https://coinmb.com/ptc", "https://ouo.io/DTPTu6"],
        ["https://contentos.one/ptc", "https://sox.link/AarLS"],
        ["https://cryptask.xyz/ptc", "https://ex-foary.com/aaEIgoIG"],
        ["https://cryptobigpay.online/ptc", "https://ouo.io/rdfwXTQ"],
        ["https://cryptojunkie.net/ptc", "https://loptelink.com/7Jof"],
        ["https://earnbtc.pw/ptc", "https://ouo.io/fOb0QJ"],
        ["https://earnviv.com/ptc", ""],
        ["https://faucet4u.com/ptc", "https://try2link.com/pDx2oO"],
        ["https://faucetbazzar.com/ptc", "https://wplink.online/wmZw"],
        ["https://nobitafc.com/ptc", "https://loptelink.com/1b68"],
        ["https://vivofaucet.com/ptc", "https://wplink.online/38q6"],
        ["https://xfaucet.org/ptc", "http://nx.chainfo.xyz/Oz0ZKpmn"],
        ["https://xtrabits.click/ptc", "https://ouo.io/uhZe6d"],
        ["https://bitfaucet.pw/ptc", "https://ouo.io/8fulsr"],
        ["https://bitsfree.net/ptc", "https://link1s.com/l0mXxo0"],
        ["https://coin-4u.com/ptc", "https://ex-foary.com/7Zwt7j"],
        ["https://claimvip.com/ptc", "http://nx.chainfo.xyz/dWFk9bbW"],
        ["https://freebitcoin.top/ptc", "https://wplink.online/2whaouL"],
        ["https://tikiearn.com/ptc", "https://ouo.io/bZ8nma"],
        ["https://titansbrand.com/ptc", "https://try2link.com/7e6t"],
        ["https://takeclicks.com/ptc", "http://nx.chainfo.xyz/pixvBEw"],
        ["https://wincrypt2.com/ptc", "https://ouo.io/uhZe6d"],
        ["https://888satoshis.com/ptc", "https://ouo.io/i7KviG"],
        ["https://autolitecoin.xyz/ptc", "https://link1s.com/QIlsyoH"],
        ["https://banfaucet.com/ptc", "http://nx.chainfo.xyz/9qPP"],
        ["https://bitcoinpayu.com/ptc", "https://wplink.online/7s7a"],
        ["https://bifaucet.com/ptc", "https://ouo.io/LzgV01"],
        ["https://bitfaucet.pw/ptc", "https://ex-foary.com/Flgd6"],
        ["https://bitsfree.net/ptc", "https://wplink.online/aGzwR"],
        ["https://btcad24.com/ptc", "https://ouo.io/wInn9n"],
        ["https://buxcoin.io/ptc", "https://loptelink.com/O13Rc"],
        ["https://claimcoin.in/ptc", "https://moneylink.tk/IL4iH"],
        ["https://coincet.com/ptc", "https://ex-foary.com/IZ8fr0BK"],
        ["https://coinfaucet.top/ptc", "https://try2link.com/wXPasNu"],
        ["https://coinpayu24.com/ptc", "http://link1s.net/hHc8t"],
        ["https://crypto-farms.site/ptc", "https://sox.link/GmCstwt"],
        ["https://coinpayufree.com/ptc", "https://loptelink.com/todPq4"],
        ["https://crypto143.site/ptc", "https://ouo.io/Igtrbk"],
        ["https://cryptofaucts.com/ptc", "https://short.nevcoins.club/sl/8x2rb"],
        ["https://cryptoflare.net/ptc", "https://ex-foary.com/OWYCD"],
        ["https://cryptomaker.in/ptc", "https://ouo.io/zhJeoO"],
        ["https://cryptospaying.com/ptc", "https://link1s.com/vL5y"],
        ["https://earnviv.com/ptc", "http://nx.chainfo.xyz/vAGuU"],
        ["https://dinofaucet.com/ptc", "https://ouo.io/v93Nyg"],
        ["https://faucetcrypto.net/ptc", "https://ex-foary.com/r8Q4g2"],
        ["https://faucetinstant.com/ptc", "https://wplink.online/zMUIXihw"],
        ["https://faucetoshi.com/ptc", "https://ouo.io/PG4rcw"],
        ["https://flashfaucet.xyz/ptc", "https://try2link.com/wqRkgRRJ"],
        ["https://forexfiter.top/ptc", "https://wplink.online/RTmInaK"],
        ["https://freebitcoingroup.com/ptc", "https://loptelink.com/kYHsa"],
        ["https://freecryptoss.com/ptc", "https://moneylink.tk/Y6TQOm60"],
        ["https://freesolana.top/ptc", "https://ouo.io/ERVIgQ1"],
        ["https://freeshib.biz/ptc", "https://link1s.com/z5kswas"],
        ["https://furyfaucet.com/ptc", "http://nx.chainfo.xyz/8V67"],
        ["https://ignite-blockchain.com/ptc", "https://ouo.io/IbycP6"],
        ["https://ganarbitcoindesdecuba.com/ptc", "https://ex-foary.com/pfgjc"],
        ["https://goldsurferfaucet.de/ptc", "https://wplink.online/f39i"],
        ["https://gpflix.in/ptc", "https://ouo.io/ijUitX"],
        ["https://hatecoin.me/ptc", "https://try2link.com/aAAO"],
        ["https://james-trussy.com/ptc", "https://go.birdurls.com/v9fD2C8n"],
        ["https://litecoinline.com/ptc", "https://moneylink.tk/tfVuF"],
        ["https://lolfaucet.com/ptc" , "https://sox.link/b3dcDQh6"],
        ["https://ltc24.com/ptc", "https://moneylink.tk/sc4b0a1m"],
        ["https://miner-sim.com/ptc", "https://wplink.online/EUSClYh"],
        ["https://mixfaucet.com/ptc", "http://link1s.net/2Z9cqz"],
        ["https://multicoins.net/ptc", "https://loptelink.com/N9AFkD"],
        ["https://myfaucet.pro/ptc", "https://ouo.io/5vBY8m"],
        ["https://nightfaucet.me/ptc", "https://wplink.online/Y03r1P"],
        ["https://paidbucks.xyz/ptc", "https://sox.link/JpN5"],
        ["https://poearn.com/ptc", "https://wplink.online/V0oS"],
        ["https://ptc4btc.com/ptc", "https://ouo.io/o7M1DTJ"],
        ["https://shiba.arbweb.info/ptc", "https://wplink.online/assBoP"],
        ["https://spaceshooter.net/ptc", "https://link1s.com/eFUfn"],
        ["https://starcrypto.io/ptc", "https://ouo.io/v8yLaz"],
        ["https://bits.re/ptc", "https://ouo.io/OG7fFQ2"],
        ["https://coinpayz.xyz/ptc", "https://link1s.com/MXpZCaK"],
        ["https://coinpot.in/ptc", "https://ex-foary.com/QNSq"],
        ["https://claimtrx.com/ptc", "http://nx.chainfo.xyz/d6puF"],
        ["https://feyorra.top/ptc", "https://ouo.io/DPXsLJ"]];

    const currentUrlptc = window.location.href;
    const nextLink = ptcLinks.find(link => link[0] === currentUrlptc);

    function toggleDropdown() {if (options.style.display === 'none') {options.style.display = 'block';options.style.bottom = `${button.offsetHeight}px`;}else {options.style.display = 'none';}}window.addEventListener('resize', () => {options.style.bottom = `${button.offsetHeight}px`;});
    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    if(window.location.href === `https://${key}/links`) {setTimeout(function() {if (linkElement) {linkElement.click();}if (anchorElement) {anchorElement.click();}}, 1000);}
    if(currentUrl === targetUrl + '/' || currentUrl === targetUrl + '/web') {window.location.replace(targetUrl + '/login');}else if (currentUrl.includes(targetUrl + '/dashboard')) {window.location.replace(targetUrl + '/ptc');}
    if(emailField) {emailField.value = email;}
    if(passwordField) {passwordField.value = password;}
    if(window.location.href.includes(`https://${key}/ptc/view`) || window.location.href.includes(`https://${key}/login`) || window.location.href.includes(`https://${key}/web/login`)) {const hcaptchaOption = selectElement.querySelector('option[value="hcaptcha"]');setTimeout(function() {hcaptchaOption.selected = true;selectElement.dispatchEvent(new Event('change'));}, 3000);}
    if(window.location.href.includes(`https://${key}/ptc`) || window.location.href.includes(`https://${key}/web/ptc`)) {setInterval(function() {if (document.querySelector("button.btn.btn-primary.btn-block")) {document.querySelector("button.btn.btn-primary.btn-block").click();}})}
    if(window.location.href === "https://coinpot.in/ptc") {setInterval(function() {document.querySelector("button.btn.bgc.w-100").click();}, 5000);}
    if(window.location.href === "https://claimercorner.xyz/web/") {window.location.href = ("https://claimercorner.xyz/web/login");}
    if(window.location.href === "https://claimercorner.xyz/web/dashboard") {window.location.href = ("https://claimercorner.xyz/web/ptc");}
    if(window.location.href.includes("https://criptoshark.com/ptc")) {setInterval(function() {if (document.querySelector("button.btn.btn-success.text-uppercase.w-100.mb-10")) {document.querySelector("button.btn.btn-success.text-uppercase.w-100.mb-10").click();}}, 5000);}
    if(nextLink) {let redirectTimer = setTimeout(() => {window.location.href = nextLink[1];}, 30000);window.addEventListener('beforeunload', () => {clearTimeout(redirectTimer);});}
    if(location.origin + location.pathname === 'https://viefaucet.com/app/ptc') {function clickButtonAfterDelay() {setTimeout(() => {const button = document.querySelector('button.el-button.el-button--primary.claim-button');button.click();clickButtonAfterDelay();}, 15000);}clickButtonAfterDelay();}setTimeout(() => {const spanElement = document.querySelector('.el-tag__content');if (spanElement && spanElement.innerText.includes("0")) {const element = document.querySelector('#tab-1.el-tabs__item.is-top');element.click();}}, 10000);
    if(window.location.href.includes("https://claimercorner.xyz/web/ptc")) {setInterval(function() {if (document.querySelector("button.btn.btn-success.text-uppercase.w-100.mb-10")) {document.querySelector("button.btn.btn-success.text-uppercase.w-100.mb-10").click();}})}
    if(window.location.href === "https://xtrabits.click/ptc") {document.querySelector("button.btn-one.w-100").click();}
    if(window.location.href === "https://bazadecrypto.com/ptc") {document.querySelector("button.claim-btn.w-100.text-white").click();}
    if(window.location.href === "https://bithub.win/ptc") {document.querySelector("button.btn.btn-one.w-100.text-white").click();}
    if(window.location.href.includes("https://bithub.win/ptc/view")) {setInterval(function() {document.querySelector("button.btn.btn-success.btn-block").click();}, 30000);}
    if(window.location.href === "https://bitcointrophy.com/ptc") {document.querySelector("button.default-btn.w-100.mb-2").click();}
    if(window.location.href === "https://kiddyearner.com/ptc") {document.querySelector("button.btn.btnc.btn-block.w-100").click();}
    if(window.location.href === "https://spaceshooter.net/ptc") {document.querySelector("button.btn.btn-info.btn-block").click();}
    if(window.location.href === "https://earnbtc.pw/ptc") {document.querySelector("button.btn-relief-primary").click();}
    if(window.location.href === "https://cryptojunkie.net/ptc") {document.querySelector("button.btn.btn-success.btn-block").click();}
    if(window.location.href === "https://autolitecoin.xyz/ptc") {setTimeout(function() {document.querySelector("button.btn.btn-danger").click();},5000);}
    if(window.location.href === "https://titansbrand.com/ptc") {document.querySelector("button.btn.btn-success.btn-block").click();}
    if(window.location.href === "https://earnmoney.24payu.net/ptc") {document.querySelector("button.btn.btn-primary.btn-block").click();}
    if(window.location.href === "https://shiba.arbweb.info/ptc") {document.querySelector("button.btn.btn-primary.btn-block").click();}
    if(window.location.href === "https://bits.re/ptc") {setTimeout(function() {document.querySelector("button.btn.btn-primary.btn-style-light.flex-grow-1.m-l-xxs").click();}, 5000);}
    if(window.location.href === "https://coinpayz.xyz/ptc") {setTimeout(function() {document.querySelector("button.btn.btn-info.btn-block").click();}, 5000);}
    if(window.location.href === "https://freebinance.top/ptc") {document.querySelector("button.btn.btn-primary").click();}
    if(window.location.href === "https://claimtoro.net/ptc") {document.querySelector("button.btn.btn-dark.waves-effect.waves-light").click();}
    if(window.location.href === "https://claimvip.com/ptc") {document.querySelector("button.btn.btn-dark.waves-effect.waves-light").click();}
    if(window.location.href === " https://freesolana.top/matic/ptc") {document.querySelector("button.btn.btn-primary").click();}
    if(window.location.href === "https://feyorra.top/ptc") {document.querySelector("button.btn-one.w-100").click();}
    if(window.location.href === "https://ezimg.co/ptc") {setTimeout(function(){document.querySelector("button.btn-one.w-100").click();}, 5000);}
    if(window.location.href === "https://cryptoflare.net/ads") {document.querySelector("button.claim-btn").click();}
    if(window.location.href === "https://faucetoshi.com/login") {setTimeout(function(){document.querySelector('button[type="submit"]').click();}, 20000);}
    if(window.location.href === "https://faucetoshi.com/login") {setTimeout(function(){document.querySelector('button[type="submit"]').click();}, 20000);}
    if(window.location.href === "https://faucetoshi.com/ptc/view/") {$("iframe").remove();const verify = setInterval( function() {if( $("#verify").is(":visible") ) {clearInterval( verify );setTimeout( function() { $("form:first").submit();}, ( 2000 ) );}}, 2000 );}
    if(window.location.href.includes("https://coinpayz.xyz/ptc/view") || window.location.href.includes("https://claimtrx.com/ptc/view") || window.location.href.includes("https://feyorra.top/ptc/view")  || window.location.href.includes("https://bits.re/ptc/view")  || window.location.href.includes("https://coinpot.io/ptc/view")) {
        if(window.location.href === `https://${key}/ptc/view/`) {setInterval(function() {if (hCaptcha()) {document.getElementById('verify').click();}}, 5000);} const interval = setInterval(() => {if (countdown.innerText === "0 second") {clearInterval(interval);setTimeout(() => {const verifyButton = document.getElementById("verify");verifyButton.click();}, 5000);}}, 1000);}

    setInterval(() => {if (hCaptcha() && submitButton) {submitButton.click();}}, 6000);
    //observer.observe(document.body, { attributes: true, childList: true, subtree: true });

})();