// ==UserScript==
// @name         rotator auto claim
// @version      0.5
// @description  Auto-claim cryptos in diferent faucets
// @author       white
// @match        https://cheezo.gq/*
// @match        https://etcoin.site/*
// @match        https://claimcoin.in/*
// @match        https://cryptogecko.net/*
// @match        https://skylitecoin.xyz/*
// @match        https://claimcoins.site/*
// @match        https://bitcoincuba.net/*
// @match        https://cryptoclicks.net/*
// @match        https://99makemoneyonline.com/*
// @match        https://lemontopup.com/*
// @match        https://deltacrypto.site/*
// @match        https://coinsrev.com/*
// @match        https://aruble.net/*
// @match        https://xcryptos.site/*
// @match        https://mo1be.com/*
// @match        https://fescrypto.com/*
// @match        https://treaw.com/*
// @match        https://kedch.com/*
// @match        https://coinhirek.com/*
// @match        https://claimclicks.com/*
// @match        https://tagecoin.com/*
// @match        https://eftacrypto.com/*
// @match        https://cryptofuture.co.in/*
// @connect      bitcoincuba.net
// @connect      skylitecoin.xyz
// @connect      99makemoneyonline.com
// @connect      cryptogecko.net
// @connect      coinsrev.com
// @connect      lemontopup.com
// @connect      deltacrypto.site
// @connect      cryptofuture.co.in
// @connect      cryptoclicks.net
// @connect      fescrypto.com
// @connect      claimcoin.in
// @connect      coinhirek.com
// @connect      claimclicks.com
// @connect      eftacrypto.com
// @connect      tagecoin.com
// @connect      xcryptos.site
// @connect      treaw.com
// @connect      kedch.com
// @connect      mo1be.com
// @connect      claimcoins.site
// @connect      aruble.net
// @connect      etcoin.site
// @connect      cheezo.gq
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link

// @namespace https://greasyfork.org/users/1147118
// @downloadURL https://update.greasyfork.org/scripts/473769/rotator%20auto%20claim.user.js
// @updateURL https://update.greasyfork.org/scripts/473769/rotator%20auto%20claim.meta.js
// ==/UserScript==


unsafeWindow.open = function(){};

(function() {
    'use strict';

    let timeout;

    function Timer() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            location.reload();
        }, 180000);
    }
    Timer();



    var faucetpayUsername = "";
    var faucetpayEmail = "";
    var bitcoin = "";
    var dogecoin = "";
    var litecoin = "";
    var tron = "";
    var tether = "";
    var binance = "";
    var ripple = "";
    var bitcoincash = "";
    var digibyte = "";
    var solana = "";
    var ethereum = "";
    var dash = "";


bitcoincash = bitcoincash.replaceAll("bitcoincash:","");
    var autoWithdraw = true;


    var websiteData = [
        {url : "https://cheezo.gq/?r=DCfdyk5EMyZt8S6Jgn6z9r2RhNVF4Hknwg", coin: "dogecoin", address: dogecoin},
        {url : "https://claimcoins.site/crypto/bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://etcoin.site/etcoin-faucet/bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://etcoin.site/etcoin-faucet/binance/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        {url : "https://aruble.net/?r=SqmVCeNrNY", coin: "BTC", address: faucetpayEmail},
        {url : "https://deltacrypto.site/earn/earn/binance/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://claimclicks.com/sol/?r=littlewhite", coin: "sol", address: faucetpayUsername},
        {url : "https://claimclicks.com/doge/?r=littlewhite", coin: "doge", address: faucetpayUsername},
        {url : "https://claimclicks.com/btc/?r=littlewhite", coin: "btc", address: faucetpayUsername},
        {url : "https://claimclicks.com/trx/?r=littlewhite", coin: "trx", address: faucetpayUsername},
        {url : "https://claimclicks.com/ltc/?r=littlewhite", coin: "ltc", address: faucetpayUsername},
        {url : "https://claimclicks.com/bnb/?r=littlewhite", coin: "bnb", address: faucetpayUsername},
        {url : "https://fescrypto.com/faucet/doge/?r=DCfdyk5EMyZt8S6Jgn6z9r2RhNVF4Hknwg", coin: "dogecoin", address: dogecoin},
        {url : "https://fescrypto.com/faucet/tron/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        {url : "https://fescrypto.com/faucet/binance/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        {url : "https://cryptoclicks.net/ltc/?r=littlewhite", coin: "ltc", address: faucetpayUsername},
        {url : "https://cryptoclicks.net/btc/?r=littlewhite", coin: "btc", address: faucetpayUsername},
        {url : "https://cryptoclicks.net/trx/?r=littlewhite", coin: "trx", address: faucetpayUsername},
        {url : "https://cryptoclicks.net/bnb/?r=littlewhite", coin: "bnb", address: faucetpayUsername},
        {url : "https://cryptoclicks.net/sol/?r=littlewhite", coin: "sol", address: faucetpayUsername},
        {url : "https://cryptofuture.co.in/page/btc/?r=whitelittle321@gmail.com", coin: "BTC", address: faucetpayEmail},
        {url : "https://cryptofuture.co.in/page/ltc/?r=whitelittle321@gmail.com", coin: "ltc", address: faucetpayEmail},
        {url : "https://cryptofuture.co.in/page/bch/?r=whitelittle321@gmail.com", coin: "bch", address: faucetpayEmail},
        {url : "https://cryptofuture.co.in/page/dash/?r=whitelittle321@gmail.com", coin: "dash", address: faucetpayEmail},
        {url : "https://cryptofuture.co.in/page/eth/?r=whitelittle321@gmail.com", coin: "eth", address: faucetpayEmail},
        {url : "https://cryptofuture.co.in/page/digibyte/?r=whitelittle321@gmail.com", coin: "digibyte", address: faucetpayEmail},
        {url : "https://eftacrypto.com/claim/Litecoin/?r=ltc1qtlmqlhk2jk3v4uaclzue8kv8m2c8xzhf6xqucv", coin: "litecoin", address: litecoin},
        {url : "https://eftacrypto.com/claim/tron/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        {url : "https://coinhirek.com/free-bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://tagecoin.com/page/faucet/binance/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        {url : "https://tagecoin.com/page/faucet/litecoin/?r=ltc1qtlmqlhk2jk3v4uaclzue8kv8m2c8xzhf6xqucv", coin: "litecoin", address: litecoin},
        {url : "https://tagecoin.com/page/faucet/tron/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        {url : "https://tagecoin.com/page/faucet/solana/?r=5vSsJ8hLEtJHyFhHfkPtqpYr2Fz3DjCLtZy5sSgmV2zL", coin: "solana", address: solana},
        {url : "https://tagecoin.com/page/faucet/ethereum/?r=0xa7b10766CDac908712ac939740B0f73BD4786E30", coin: "ethereum", address: ethereum},
        {url : "https://tagecoin.com/page/faucet/bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://coinsrev.com/free-btc/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://coinsrev.com/free-bnb/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        {url : "https://xcryptos.site/earn/bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://99makemoneyonline.com/faucetpay/usdt1?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tether", address: tether},
        {url : "https://lemontopup.com/trx?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        {url : "https://skylitecoin.xyz/faucet/btc/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://cryptogecko.net/reward/bitcoin-faucet/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        {url : "https://cryptogecko.net/reward/tron-faucet/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        {url : "https://cryptogecko.net/reward/binance-faucet/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        //{url : "https://99makemoneyonline.com/faucetpay/dash?r=XmYTTcyghFJins8pNCGHyaJdwgpJXyZ7Ek", coin "dash", address : dash},
        //{url : "https://bitcoincuba.net/freeusdt/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tether", address: tether},
        //{url : "https://bitcoincuba.net/freetrx/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        //{url : "https://bitcoincuba.net/freedoge/?r=DCfdyk5EMyZt8S6Jgn6z9r2RhNVF4Hknwg", coin: "dogecoin", address: dogecoin},
        //{url : "https://etcoin.site/etcoin-faucet/tether/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tether", address: tether},
        //{url : "https://etcoin.site/etcoin-faucet/litecoin/?r=ltc1qtlmqlhk2jk3v4uaclzue8kv8m2c8xzhf6xqucv", coin: "litecoin", address: litecoin},
        //{url : "https://etcoin.site/etcoin-faucet/ripple/?r=rhi77L73jGvGN3zQf3AEbYnjWYZu7CSTe8", coin: "ripple", address: ripple},
        //{url : "https://etcoin.site/etcoin-faucet/bitcoin-cash/?r=bitcoincash:qzzsqsl0jtr59e2gszwlzkcsxvecgt5quytngqs34k", coin: "bitcoincash", address: bitcoincash},
        //{url : "https://etcoin.site/etcoin-faucet/digibyte/?r=DHhjxaqp62km8CnmYBbAsALJNwNMfUnuWd", coin: "digibyte", address: digibyte},
        //{url : "https://mo1be.com/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tron", address: tron},
        //{url : "https://treaw.com/?r=TNRtv6eD9z17jP9Gy57ABdDPrBmjmtP71F", coin: "tether", address: tether},
        //{url : "https://kedch.com/?r=ltc1qtlmqlhk2jk3v4uaclzue8kv8m2c8xzhf6xqucv", coin: "litecoin", address: litecoin},
        //{url : "https://cryptofuture.co.in/page/sol/?r=whitelittle321@gmail.com", coin: "sol", address: faucetpayEmail},
        //{url : "https://fescrypto.com/faucet/bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        //{url : "https://eftacrypto.com/claim/binance/?r=0x75ACAEC42C277Ac8400dE5d13a520B54f37b36CF", coin: "binance", address: binance},
        //{url : "https://eftacrypto.com/claim/Bitcoin/?r=191wciJzU2niGFsFThuinrEYBnXJGq3LJA", coin: "bitcoin", address: bitcoin},
        //{url : "https://tagecoin.com/page/faucet/doge/?r=DCfdyk5EMyZt8S6Jgn6z9r2RhNVF4Hknwg", coin: "dogecoin", address: dogecoin},
        //{url : "https://99makemoneyonline.com/faucetpay/bch?r=bitcoincash:qzzsqsl0jtr59e2gszwlzkcsxvecgt5quytngqs34k", coin: "bitcoincash", address: bitcoincash},

/*
*/

    ];

    var websiteMap = [
                       {website : ["aruble.net"], inputTextSelector: "[name='address']",
                       inputTextSelectorButton: "input.btn.btn-block.btn-primary",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary","a.btn.btn-block.btn-primary"],
                       captchaButtonSubmitSelector: "#anti-bot",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["sufficient","try again", "invalid", "sufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

{website : ["cheezo.gq", "mo1be.com","treaw.com","kedch.com","eftacrypto.com"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: ".btn.btn-block.btn-primary.my-2[value='Verify Captcha']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: true
                      },
        {website : ["etcoin.site", "claimcoins.site","eftacrypto.com","deltacrypto.site","xcryptos.site"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: ".btn.btn-block.btn-primary.my-2[value='Verify Captcha']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: false
                      },
                {website : ["claimcoin.in","cryptofuture.co.in","tagecoin.com","fescrypto.com"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "input[id='login']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["later","try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: true
                      },
             {website : ["coinhirek.com","coinsrev.com","99makemoneyonline.com","lemontopup.com","bitcoincuba.net","cryptogecko.net"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: ["[data-target='#captchaModal']"],
                       captchaButtonSubmitSelector: "input[id='login']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: true
            },
            {website : ["skylitecoin.xyz"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: ["[data-target='#captchaModal']"],
                       captchaButtonSubmitSelector: "input[id='login']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: false
            },
              {website : ["claimclicks.com","cryptoclicks.net"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "input[type='submit']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["reached the daily claim","later","try again","Session invalid", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited","limit has been reached","limit reached"],
                       ablinks: false
                      },


                     ];

    var ablinksSolved = false;

                setTimeout(function() {
        var btcButton = document.querySelector('.btnbtc');
        if (btcButton) {
            btcButton.click();
        }
    }, 3000);

     if (window.location.href.includes("?r=littlewhite")) {
        var newURL = window.location.href.replace("?r=littlewhite", "?cc=hCaptcha");
        window.location.href = newURL;
    }



    function triggerEvent(el, type) {
        try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }catch(exception){
            console.log(exception);
        }
    }


    String.prototype.includesOneOf = function(arrayOfStrings) {


        if (!Array.isArray(arrayOfStrings)) {
            return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
        }

        for (var i = 0; i < arrayOfStrings.length; i++) {
            if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    var websiteDataValues = {};


    for (let value of Object.values(websiteMap)) {
        if(window.location.href.includesOneOf(value.website)){
            websiteDataValues.inputTextSelector= value.inputTextSelector;
            websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
            websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
            websiteDataValues.claimButtonSelectors = value.claimButtonSelectors;
            websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
            websiteDataValues.allMessageSelectors = value.allMessageSelectors;
            websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
            websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
            websiteDataValues.withdrawEnabled = value.withdrawEnabled;
            websiteDataValues.balanceSelector = value.balanceSelector;
            websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
            websiteDataValues.successMessageSelectors = value.successMessageSelectors;
            websiteDataValues.additionalFunctions = value.additionalFunctions;
            websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
            websiteDataValues.formSubmit = value.formSubmit;
            websiteDataValues.ablinks = value.ablinks;
            break;
        }
    }


    var count = 0;
    var addressAssigned = false;
    for (let value of Object.values(websiteData)){
        count = count + 1;
        if(value.url.includes(window.location.hostname) && (window.location.href.includes("/" + value.coin + "/") ||
                                                            window.location.href.includes("/" + value.coin + "-") ||
                                                            window.location.href.endsWith("/" + value.coin))){
            websiteDataValues.address = value.address;
            addressAssigned = true;
            break;
        }
    }


    if(!addressAssigned){
        count = 0;
        for (let value of Object.values(websiteData)) {
            count = count + 1;

            if(value.url.includes(window.location.hostname)){
                if(value.regex){
                    if(GM_getValue("UrlRegex")){
                        if(GM_getValue("UrlRegex") == value.regex){
                            websiteDataValues.address = value.address;
                            break;
                        }
                    }else{
                        GM_setValue("UrlRegex",value.regex);
                        websiteDataValues.address = value.address;
                        break;
                    }

                }else{
                    websiteDataValues.address = value.address;
                    break;
                }
            }
        }
    }




    async function getNextUrl(){


        if(count >= websiteData.length){
            count = 0;
        }

        websiteDataValues.nextUrl = websiteData[count].url;
        websiteDataValues.regex = websiteData[count].regex;


        pingTest(websiteDataValues.nextUrl);
    }

    var isNextUrlReachable = false;

    function pingTest(websiteUrl) {
        console.log(websiteUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 8000,
            onload: function(response) {
                //Website is reachable
                if(response && response.status == 200){
                    isNextUrlReachable = true;
                }else{
                    count=count+1;
                    getNextUrl();
                }
            },
            onerror: function(e) {
                count=count+1;
                getNextUrl();
            },
            ontimeout: function() {
                count=count+1;
                getNextUrl();
            },
        });

    }


    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    var movingToNextUrl = false;
    async function goToNextUrl() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            getNextUrl();
            while (!isNextUrlReachable) {
                await delay(3000);
            }

            if( websiteDataValues.regex){
                GM_setValue("UrlRegex", websiteDataValues.regex);
            }
            window.location.href = websiteDataValues.nextUrl;
            movingToNextUrl = true;
        }
    }

    async function goToWithdrawPage() {
        if(!movingToNextUrl){
            movingToNextUrl = true;
            window.location.href = websiteDataValues.withdrawPageUrl;
        }

    }


    var delayBeforeMovingToNextUrl = 180000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        movingToNextUrl = false;
        goToNextUrl();
    },delayBeforeMovingToNextUrl);


    if (window.location.href.includes("to=FaucetPay") || (websiteDataValues.address) && (websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_"))){
        goToNextUrl();
    }


    function messageSelectorsPresent(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
                        (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                         document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function checkMessageSelectorsLength(){
        if(websiteDataValues.allMessageSelectors){
            for(var j=0;j<websiteDataValues.allMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.length > 0) ||
                       (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
                        document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.length > 0)){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function successMessageSelectorsPresent(){
        if(websiteDataValues.successMessageSelectors){
            for(var j=0;j<websiteDataValues.successMessageSelectors.length;j++){
                for(var k=0; k< document.querySelectorAll(websiteDataValues.successMessageSelectors[j]).length;k++){
                    if(document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k] && document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)){
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function ablinksCaptcha() {

        setInterval(function(){

            if(document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("hcaptcha")){
                document.querySelector("#switch").click();
            } else if(document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("recaptcha")){
                document.querySelector("#switch").click();
            }
            var count = 0;

            var abModels = [ ".modal-content [href='/']", ".modal-body [href='/']", ".antibotlinks [href='/']"];
            var abModelsImg = [ ".modal-content [href='/'] img", ".modal-body [href='/'] img", ".antibotlinks [href='/'] img"];
            for(let j=0; j< abModelsImg.length;j++){
                if (document.querySelector(abModelsImg[j]) &&
                    document.querySelector(abModelsImg[j]).value == "####"){
                    goToNextUrl();
                    break;
                }
            }

            for(let i=0;i< 4;i++){
                for(let j=0; j< abModels.length;j++){
                    if (document.querySelectorAll(abModelsImg[j]).length ==4 &&
                        document.querySelectorAll(abModels[j])[i] &&
                        document.querySelectorAll(abModels[j])[i].style &&
                        document.querySelectorAll(abModels[j])[i].style.display == 'none') {
                        count ++;
                        break;
                    }
                }
            }
            if(count == 4){
                ablinksSolved = true;
            }
        },5000);

    }

    setTimeout(function(){
        if(document.querySelector("#invisibleCaptchaShortlink")){
            document.querySelector("#invisibleCaptchaShortlink").click();
        }

        if(document.querySelector(".btn.btn-success.btn-lg.get-link")){
            document.querySelector(".btn.btn-success.btn-lg.get-link").click();
        }

        if(window.location.href.includes("starcoins.ws") || window.location.href.includes("hosting4lifetime.com")){
            websiteDataValues.captchaButtonSubmitSelector = "#btn-before";
            let clicked = false;
            unsafeWindow.open = function(url){window.location.href = url};
            setInterval(function(){
                if(!clicked && document.querySelector("#btn6") && !document.querySelector("#btn6").disabled){
                    document.querySelector("#btn6").click();
                    clicked = true;
                }
            },7000)

            setTimeout(function(){
                window.location.href= websiteData[0].url;
            },120000)
        }

    },10000)


    function herafaucet(){
        if(document.querySelector("div.daily-claims.alert-info > div.text-right p") && Number(document.querySelector("div.daily-claims.alert-info > div.text-right p").innerText.split(" ")[0]) <= 0){
            goToNextUrl();
        }
    }

    function diamondfaucet() {
        if(document.querySelector("#first > p.alert.a-info") && Number(document.querySelector("#first > p.alert.a-info").innerText.split(".")[1].split(" ")[0]) <= 0) {
            goToNextUrl();
        }
    }



    setTimeout(function(){

        ablinksCaptcha();


        if(window.name == "nextWindowUrl"){
            window.name = "";
            goToNextUrl();
            return;
        }else{
            window.name = window.location.href;
        }


        if( websiteDataValues.additionalFunctions){
            websiteDataValues.additionalFunctions();
        }

        if(websiteDataValues.withdrawEnabled){
            if(websiteDataValues.balanceSelector && document.querySelector(websiteDataValues.balanceSelector)){
                var currentBalance = document.querySelector(websiteDataValues.balanceSelector).innerText;
                if(currentBalance > websiteDataValues.withdrawMinAmount && !window.location.href.includes(websiteDataValues.withdrawPageUrl)) {
                    goToWithdrawPage();
                }

            }else{
                if(successMessageSelectorsPresent()){
                    goToWithdrawPage();
                }
            }
        }


        if(!movingToNextUrl && messageSelectorsPresent()){
            goToNextUrl();
        }


        if(!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)){
            document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
            triggerEvent(document.querySelector(websiteDataValues.inputTextSelector), 'keypress');
            triggerEvent(document.querySelector(websiteDataValues.inputTextSelector), 'change');
            setTimeout(function(){
                if(websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)){
                    document.querySelector(websiteDataValues.inputTextSelectorButton).click();
                }

            },5000);
        }

        if(!movingToNextUrl && websiteDataValues.defaultButtonSelectors){
            for(let i=0;i<websiteDataValues.defaultButtonSelectors.length ;i++){
                if(document.querySelector(websiteDataValues.defaultButtonSelectors[i])){
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mousedown');
                    triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mouseup');
                    document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
                    break;
                }
            }
        }

        setTimeout(function(){

            if(!movingToNextUrl && websiteDataValues.claimButtonSelectors){
                for(let i=0;i<websiteDataValues.claimButtonSelectors.length ;i++){
                    if(document.querySelector(websiteDataValues.claimButtonSelectors[i])){
                        triggerEvent(document.querySelector(websiteDataValues.claimButtonSelectors[i]), 'mousedown');
                        triggerEvent(document.querySelector(websiteDataValues.claimButtonSelectors[i]), 'mouseup');
                        document.querySelector(websiteDataValues.claimButtonSelectors[i]).click();
                        break;
                    }
                }
            }
        },7000);



        var clicked = false;
        var captchaInterval = setInterval(function(){

            if(websiteDataValues.ablinks && !ablinksSolved){
                return;
            }

            try{
                if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0 &&
                   websiteDataValues.captchaButtonSubmitSelector && document.querySelector(websiteDataValues.captchaButtonSubmitSelector) &&
                   document.querySelector(websiteDataValues.captchaButtonSubmitSelector).style.display != 'none' &&
                   !document.querySelector(websiteDataValues.captchaButtonSubmitSelector).disabled) {
                    if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;

                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                    },5000);
                }
            }catch(e){

            }

            for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                if(! clicked && document.querySelectorAll("iframe")[hc] &&
                   document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
                   document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0 &&
                   websiteDataValues.captchaButtonSubmitSelector && document.querySelector(websiteDataValues.captchaButtonSubmitSelector) &&
                   document.querySelector(websiteDataValues.captchaButtonSubmitSelector).style.display != 'none' &&
                   !document.querySelector(websiteDataValues.captchaButtonSubmitSelector).disabled) {
                    if(websiteDataValues.formSubmit){
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
                    }else{
                        document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
                    }
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                        if(messageSelectorsPresent()){
                            goToNextUrl();
                        }
                    },5000);
                }
            }

        },5000);


    },7000);

})();