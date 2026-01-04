// ==UserScript==
// @name         HCAPTCHA WITH SHORTLINK FREE COIN ROTATOR
// @namespace    Earn Free Coin Instantly
// @version      8.0
// @description  Earn Free Coin Instantly
// @author       lotocamion
// @match        https://zadfaucet.com/*
// @match        https://dazfaucet.com/*
// @match        https://freecoiny.net/*
// @match        https://claim.faucet-bit.com/*
// @match        https://freelitecoin.top/*
// @match        https://gainbtc.click/*
// @match        https://earnheart.in/*
// @match        https://crypto-fun-faucet.de/*
// @match        https://cff-link.de/*
// @match        https://krypto-trend.de/*
// @match        https://litecoin.mundoby.xyz/*
// @match        https://multiclaim.net/*
// @connect      multiclaim.net
// @connect      litecoin.mundoby.xyz
// @connect      krypto-trend.de
// @connect      dazfaucet.com
// @connect      zadfaucet.com
// @connect      claim.faucet-bit.com
// @connect      freecoiny.net
// @connect      freelitecoin.top
// @connect      gainbtc.click
// @connect      doge.kartinks.xyz
// @connect      earnheart.in
// @connect      crypto-fun-faucet.de
// @connect      cff-link.de
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/442703/HCAPTCHA%20WITH%20SHORTLINK%20FREE%20COIN%20ROTATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/442703/HCAPTCHA%20WITH%20SHORTLINK%20FREE%20COIN%20ROTATOR.meta.js
// ==/UserScript==


unsafeWindow.open = function(){};

(function() {
    'use strict';


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                 //
    //                                                                                                 //
    //    EDIT WITH YOUR FAUCETPAY ADDRESS BELOW AND SAVE IT IN A NOTEPAD IN CASE THERE IS AN UPDATE   //
    //                                                                                                 //
    //                                                                                                 //
    /////////////////////////////////////////////////////////////////////////////////////////////////////


    var btc ="ENTER_YOUR_FAUCETPAY_BITCOIN_ADDRESS";
    var bnb ="ENTER_YOUR_FAUCETPAY_BINANCE_ADDRESS";
    var bch ="ENTER_YOUR_FAUCETPAY_BITCOINCASH_ADDRESS";
    var dash ="ENTER_YOUR_FAUCETPAY_DASH_ADDRESS";
    var doge ="ENTER_YOUR_FAUCETPAY_DOGECOIN_ADDRESS";
    var dgb= "ENTER_YOUR_FAUCETPAY_DIGIBYTE_ADDRESS";
    var eth ="ENTER_YOUR_FAUCETPAY_ETHEREUM_ADDRESS";
    var fey ="ENTER_YOUR_FAUCETPAY_FEYORRA_ADDRESS";
    var ltc ="ENTER_YOUR_FAUCETPAY_LITECOIN_ADDRESS";
    var sol ="ENTER_YOUR_FAUCETPAY_SOLANA_ADDRESS";
    var tron ="ENTER_YOUR_FAUCETPAY_TRON_ADDRESS";
    var tether="ENTER_YOUR_FAUCETPAY_TETHER_ADDRESS";
    var zcash ="ENTER_YOUR_FAUCETPAY_ZCASH_ADDRESS";
    var Emailfaucetpay ="ENTER_YOUR_FAUCETPAY_EMAIL_ADDRESS";
    var UserNameFaucetpay ="ENTER_YOUR_FAUCETPAY_USERNAME";






        var websiteData = [


        {url : "https://zadfaucet.com/free-bitcoin?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "free-bitcoin", address: btc},//1min
        {url : "https://dazfaucet.com/free-bitcoin?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4 ", coin: "free-bitcoin", address: btc},//4min
        {url : "https://zadfaucet.com/free-doge?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-doge", address: doge},//1min
        {url : "https://dazfaucet.com/free-doge?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-doge", address: doge},//4min
        {url : "https://zadfaucet.com/free-ethereum?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-ethereum", address: eth},//1min
        {url : "https://dazfaucet.com/free-ethereum?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-ethereum", address: eth},//4min
        {url : "https://zadfaucet.com/free-tron?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},//1min
        {url : "https://dazfaucet.com/free-tron?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},//4min
        {url : "https://zadfaucet.com/free-litecoin?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},//1min
        {url : "https://dazfaucet.com/free-litecoin?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},//4min
        {url : "https://zadfaucet.com/free-binance?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "free-binance", address: bnb},//1min
        {url : "https://dazfaucet.com/free-binance?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "free-binance", address: bnb},//4min
        {url : "https://zadfaucet.com/free-solana?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "free-solana", address: sol},//1min
        {url : "https://dazfaucet.com/free-solana/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "free-solana", address: sol},//4min
        {url : "https://zadfaucet.com/free-tether?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tether", address: tether},//1min
        {url : "https://dazfaucet.com/free-tether?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tether", address: tether},//4min

        {url : "https://freecoiny.net/free-dogecoin?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-dogecoin", address: doge},//1min
        {url : "https://freecoiny.net/free-litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},//1min
        {url : "https://freecoiny.net/free-dgb/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "free-dgb", address: dgb},//1min
        {url : "https://freecoiny.net/free-tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},//1min

        {url : "https://claim.faucet-bit.com/btc?122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},//3min
        {url : "https://claim.faucet-bit.com/ltc?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltc", address: ltc},//3min
        {url : "https://claim.faucet-bit.com/doge?r=DJRVVPrCrYJn8WdZ67sbiJJ3AwG9tm4PrL", coin: "doge", address: doge},//3min
        {url : "https://claim.faucet-bit.com/bch?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", coin: "bch", address: bch},//3min
        {url : "https://claim.faucet-bit.com/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},//3min
        {url : "https://claim.faucet-bit.com/zec?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zec", address: zcash},//3min
        {url : "https://freelitecoin.top/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltc", address: ltc},//2min

        {url : "https://gainbtc.click/bitcoin/?r=lotocamion", coin: "bitcoin", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/litecoin/?r=lotocamion", coin: "litecoin", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/tron/?r=lotocamion", coin: "tron", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/binance/?r=lotocamion", coin: "binance", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/dash/?r=lotocamion", coin: "dash", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/tether/?r=lotocamion", coin: "tether", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/zcash/?r=lotocamion", coin: "zcash", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/digibyte/?r=lotocamion", coin: "digibyte", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/ethereum/?r=lotocamion", coin: "ethereum", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/bitcoin_cash/?r=lotocamion", coin: "bitcoin_cash", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/solana/?r=lotocamion", coin: "solana", address: UserNameFaucetpay},
        {url : "https://gainbtc.click/doge/?r=lotocamion", coin: "doge", address: UserNameFaucetpay},

        {url : "https://multiclaim.net/bitcoin/?r=lotocamion", coin: "bitcoin", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/litecoin/?r=lotocamion", coin: "litecoin", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/tron/?r=lotocamion", coin: "tron", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/binance/?r=lotocamion", coin: "binance", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/tether/?r=lotocamion", coin: "tether", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/zcash/?r=lotocamion", coin: "zcash", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/digibyte/?r=lotocamion", coin: "digibyte", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/ethereum/?r=lotocamion", coin: "ethereum", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/bitcoin_cash/?r=lotocamion", coin: "bitcoin_cash", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/solana/?r=lotocamion", coin: "solana", address: UserNameFaucetpay},
        {url : "https://multiclaim.net/doge/?r=lotocamion", coin: "doge", address: UserNameFaucetpay},

        {url : "https://earnheart.in/bnbfaucet?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "bnbfaucet", address: bnb},//10min
        {url : "https://earnheart.in/dogefaucet?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "dogefaucet", address: doge},//10min
        {url : "https://earnheart.in/btcfaucet?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btcfaucet", address: btc},//10min
        {url : "https://earnheart.in/ltcfaucet?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltcfaucet", address: ltc},//10min
        {url : "https://earnheart.in/solfaucet?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "solfaucet", address: sol},//10min
        {url : "https://earnheart.in/trxfaucet?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "trxfaucet", address: tron},//10min

        {url : "https://crypto-fun-faucet.de/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},//1min
        {url : "https://crypto-fun-faucet.de/btc/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},//1min
        {url : "https://crypto-fun-faucet.de/eth/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "eth", address: eth},//1min
        {url : "https://crypto-fun-faucet.de/bch/?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", coin: "bch", address: bch},//1min
        {url : "https://crypto-fun-faucet.de/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},//1min
        {url : "https://crypto-fun-faucet.de/dgb/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "dgb", address: dgb},//1min
        {url : "https://crypto-fun-faucet.de/ltc/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltc", address: ltc},//1min
        {url : "https://crypto-fun-faucet.de/trx/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "trx", address: tron},//1min
        {url : "https://crypto-fun-faucet.de/zec/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zec", address: zcash},//1min
        {url : "https://crypto-fun-faucet.de/usdt/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "usdt", address: tether},//1min
        {url : "https://crypto-fun-faucet.de/fey/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "fey", address: fey},//1min
        {url : "https://crypto-fun-faucet.de/bnb/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "bnb", address: bnb},//1min
        {url : "https://crypto-fun-faucet.de/sol/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "sol", address: sol},//1min

        {url : "https://krypto-trend.de/dogecoin-faucet-krypto-trend/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "dogecoin", address: doge},//5min
        {url : "https://krypto-trend.de/bitcoin-faucet-krypto-trend/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "bitcoin", address: btc},//5min
        {url : "https://krypto-trend.de/litecoin-faucet-krypto-trend/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin", address: ltc},//5min
        //{url : "https://krypto-trend.de/tron-faucet-krypto-trend/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},//5min
        //{url : "https://krypto-trend.de/ethereum-faucet-krypto-trend/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "ethereum", address: eth},//5min
        //{url : "https://krypto-trend.de/digibyte-faucet-krypto-trend/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "digibyte", address: dgb},//5min
        {url : "https://litecoin.mundoby.xyz/ltc?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltc", address: ltc},//1min
        ];



    var websiteMap = [



                       {website : ["cff-link.de","krypto-trend.de","crypto-fun-faucet.de","dazfaucet.com","zadfaucet.com","freecoiny.net","claim.faucet-bit.com","coinsfreeclaim.com","freelitecoin.top","earnheart.in"],
                       inputTextSelector: [".form-control"],
                       defaultButtonSelectors: ["a.btn.btn-success.btn-lg.get-link",".btn.btn-block.btn-primary.my-2",".btn.btn-block.btn-primary.text-uppercase","a.btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".fas.fa-exclamation-triangle",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["come back soon","You have to wait minutes","The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","Please try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },
                      {website : ["litecoin.mundoby.xyz"],
                       inputTextSelector: [".form-control"],
                       inputTextSelectorButton:[".btn.btn-primary.p-2.start_faucet"],
                       defaultButtonSelectors: [".btn.btp.btn-block.btn-primary.my-2","a.btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".fas.fa-exclamation-triangle",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["You have to wait minutes","The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                       {website : ["multiclaim.net","gainbtc.click"],
                       inputTextSelector: [".form-control"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
			           messagesToCheckBeforeMovingToNextUrl: ["Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },
                     ];


  //setInterval(function() {
    //if(document.querySelector("body > div.wrapper > div > div > section > div > div > div > div > div:nth-child(5) > a")) {
    //document.querySelector("body > div.wrapper > div > div > section > div > div > div > div > div:nth-child(5) > a").click()
           //}
    //}, 3000);




     var ablinksSolved = false;


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

            },30000)



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
                    },5000);

})();