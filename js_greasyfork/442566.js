// ==UserScript==
// @name         NEW HCAPTCHA FREE COIN ROTATOR
// @namespace    Earn Free Coin Instantly
// @version      21.0
// @description  Earn Free Coin Instantly
// @author       lotocamion
// @match        https://hosting4lifetime.com/*
// @match        https://abcshort.com/*
// @match        https://www.cryptoforu.org/*
// @match        https://diamondbnb.top/*
// @match        https://diamondfaucet.space/*
// @match        https://faucetcaptcha.co.in/*
// @match        https://ethiomi.com/*
// @match        https://fautsy.com/*
// @match        https://cryptorotator.website/*
// @match        https://qpcrypto.com/*
// @match        https://cryptoo.site/*
// @match        https://btcfaucet.site/*
// @match        https://bnbfaucet.site/*
// @match        https://gobits.io/*
// @match        https://i-bits.io/*
// @match        *://claimbits.io/*
// @match        *://starbits.io/*
// @match        https://faucet-bit.com/claim/*
// @connect      bnbfaucet.site
// @connect      faucet-bit.com
// @connect      gobits.io
// @connect      i-bits.io
// @connect      claimbits.io
// @connect      starbits.io
// @connect      cryptorotator.website
// @connect      btcfaucet.site
// @connect      cryptoo.site
// @connect      qpcrypto.com
// @connect      ethiomi.com
// @connect      fautsy.com
// @connect      faucetcaptcha.co.in
// @connect      diamondfaucet.space
// @connect      www.cryptoforu.org
// @connect      diamondbnb.top
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/442566/NEW%20HCAPTCHA%20FREE%20COIN%20ROTATOR.user.js
// @updateURL https://update.greasyfork.org/scripts/442566/NEW%20HCAPTCHA%20FREE%20COIN%20ROTATOR.meta.js
// ==/UserScript==

if(window.name && (!window.name.includes("https://") && window.name != "nextWindowUrl")){
    console.log("Window is considered as popup. Stopping the execution");
    return;
}


unsafeWindow.open = function(){};

(function() {
    'use strict';


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                 //
    //                                                                                                 //
    // EDIT WITH YOUR FAUCETPAY ADDRESS BELOW AND SAVE IT IN A NOTEPAD IN CASE THERE IS AN UPDATE      //
    // THEN GOTO https://cryptorotator.website/zec_play/?r=lotocamion@gmail.com AND LEAVE THE TAB OPEN //                                                                //
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

        {url : "https://cryptorotator.website/zec_play/?r=lotocamion@gmail.com", coin: "zec_play", address: Emailfaucetpay},
        {url : "https://cryptorotator.website/dgb_play/?r=lotocamion@gmail.com", coin: "dgb_play", address:Emailfaucetpay},
        {url : "https://cryptorotator.website/doge_play/?r=lotocamion@gmail.com", coin: "doge_play", address: Emailfaucetpay},
        {url : "https://cryptorotator.website/ltc_play/?r=lotocamion@gmail.com", coin: "ltc_play", address:Emailfaucetpay},
        {url : "https://cryptorotator.website/sol_play/?r=lotocamion@gmail.com", coin: "sol_play", address: Emailfaucetpay},
        {url : "https://cryptorotator.website/trx_play/?r=lotocamion@gmail.com", coin: "trx_play", address: Emailfaucetpay},
        {url : "https://www.cryptoforu.org/fp_solana_faucet/sol/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "sol", address:sol},
        {url : "https://www.cryptoforu.org/fp_tether_faucet/tether?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tether", address:tether},
        {url : "https://www.cryptoforu.org/fp_eth_faucet/eth?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "eth", address:eth},
        {url : "https://gobits.io/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://i-bits.io/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "http://claimbits.io/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "http://starbits.io/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://diamondfaucet.space/ltc/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "ltc", address: ltc},
        {url : "https://diamondfaucet.space/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},
        {url : "https://diamondfaucet.space/bcash/?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", coin: "bcash", address: bch},
        {url : "https://diamondfaucet.space/usdt/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "usdt", address: tether},
        {url : "https://diamondfaucet.space/zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zcash", address: zcash},
        {url : "https://diamondfaucet.space/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://diamondbnb.top/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "bnb", address: bnb},
        {url : "https://diamondfaucet.space/btc/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://diamondfaucet.space/trx/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "trx", address: tron},
        {url : "https://faucetcaptcha.co.in/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", address:doge},
        {url : "https://btcfaucet.site/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://fautsy.com/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", address:btc},
        {url : "https://bnbfaucet.site/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "bnb", address: bnb},
        {url : "https://faucet-bit.com/claim/trx/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "trx", address: tron},
        {url : "https://ethiomi.com/tron/?r=lotocamion@gmail.com", coin: "tron", address: Emailfaucetpay},
        {url : "https://ethiomi.com/doge/?r=lotocamion@gmail.com", coin: "doge", address: Emailfaucetpay},
        {url : "https://ethiomi.com/ethereum/?r=lotocamion@gmail.com", coin: "ethereum", address: Emailfaucetpay},
        {url : "https://ethiomi.com/dash/?r=lotocamion@gmail.com", coin: "dash", address: Emailfaucetpay},
        {url : "https://ethiomi.com/digibyte/?r=lotocamion@gmail.com", coin: "digibyte", address: Emailfaucetpay},
        {url : "https://ethiomi.com/zcash/?r=lotocamion@gmail.com", coin: "zcash", address: Emailfaucetpay},
        {url : "https://ethiomi.com/bitcoin/?r=lotocamion@gmail.com", coin: "bitcoin", address: Emailfaucetpay},
        {url : "https://ethiomi.com/litecoin/?r=lotocamion@gmail.com", coin: "litecoin", address: Emailfaucetpay},
        {url : "https://qpcrypto.com/bitcoin/?r=r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "bitcoin", address: btc},
        {url : "https://qpcrypto.com/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://qpcrypto.com/litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin", address: ltc},
        {url : "https://qpcrypto.com/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},
        {url : "https://qpcrypto.com/digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "digibyte", address: dgb},
        {url : "https://qpcrypto.com/tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},
        {url : "https://qpcrypto.com/binance/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "binance", address: bnb},
        {url : "https://qpcrypto.com/tether/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tether", address: tether},
        {url : "https://qpcrypto.com/zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zcash", address: zcash},
        {url : "https://qpcrypto.com/ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "ethereum", address: eth},
        {url : "https://qpcrypto.com/solana/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "solana", address: sol},
        {url : "https://cryptoo.site/bitcoin/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "bitcoin", address: btc},
        {url : "https://cryptoo.site/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://cryptoo.site/litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin", address: ltc},
        {url : "https://cryptoo.site/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},
        {url : "https://cryptoo.site/digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "digibyte", address: dgb},
        {url : "https://cryptoo.site/tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},
        {url : "https://cryptoo.site/binance/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "binance", address: bnb},
        {url : "https://cryptoo.site/feyorra/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "feyorra", address: fey},
        {url : "https://cryptoo.site/zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zcash", address: zcash},
        {url : "https://cryptoo.site/ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "ethereum", address: eth},
        {url : "https://cryptoo.site/solana/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "solana", address: sol},

    ];


    var websiteMap = [
                       {website : ["www.cryptoforu.org"],
                       inputTextSelector: "[name='address']",
                       defaultButtonSelectors: [".btn.btn-block.btn-dark.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","Please try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "insufficient", "wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                      {website : ["faucet-bit.com","faucetcaptcha.co.in","fautsy.com"],
                       inputTextSelector: [".form-control","input.fname"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link",".mainbtn.mainbtn-1"],
                       captchaButtonSubmitSelector: ["#login","#ncb > input"],
                       allMessageSelectors: ["h1",".alert.alert-info",".alert.alert-success",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["it will be fixed soon","Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
			           //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true

                      },


                       {website : ["diamondbnb.top","diamondfaucet.space"], inputTextSelector: "#address",
                       inputTextSelectorButton: "#login",
                       claimButtonSelectors: ["#second > button"],
                       captchaButtonSubmitSelector: "#ncb > input",
                       allMessageSelectors: [".post",".alert.a-wait", ".alert.a-warning",".alert.a-info",".alert.a-success",".alert.a-danger","#cf-error-details", "#first"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["You've reached the daily claim limit of this faucet","Please come back in 24 hours","was sent to you on FaucetPay.io","The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","Please try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                      //messagesToCheckBeforeMovingToNextUrl: ["invalid", "sufficient","reached","Please try again","order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },


                       {website : ["ethiomi.com"],
                       inputTextSelector: ".form-control",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["API Key used","Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       //messagesToCheckBeforeMovingToNextUrl: ["try again","sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: false
                       },



                      {website : ["bnbfaucet.site","btcfaucet.site"],
                       inputTextSelector: [".form-control","input.fname"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link",".mainbtn.mainbtn-1"],
                       captchaButtonSubmitSelector: ["#login","#ncb > input"],
                       allMessageSelectors: [".alert.alert-info",".alert.alert-success",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["API Key used","Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
			           //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                       {website : ["qpcrypto.com"],
                       inputTextSelector: [".form-control","input.fname"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link",".mainbtn.mainbtn-1"],
                       captchaButtonSubmitSelector: ["#login","#ncb > input"],
                       allMessageSelectors: [".alert.alert-info",".alert.alert-success",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["API Key used","Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
			           //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: false
                       },

                       {website : ["cryptoo.site"],
                       inputTextSelector: [".form-control","input.fname"],
                       defaultButtonSelectors: ["button.btn.btn-primary",".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link",".mainbtn.mainbtn-1"],
                       captchaButtonSubmitSelector: ["#login","#ncb > input"],
                       allMessageSelectors: [".alert.alert-info",".alert.alert-success",".alert.alert-danger.fade.show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["API Key used","Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
			           //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: false
                       },

                      {website : ["cryptorotator.website"], inputTextSelector: "#address",
                      defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                      captchaButtonSubmitSelector: "#login",
                      allMessageSelectors: [".alert.alert-danger.fade show",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                      successMessageSelectors: [".alert.alert-success"],
                      messagesToCheckBeforeMovingToNextUrl: ["The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","Please try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                      ablinks: true
                      },

                      {website : ["gobits.io","i-bits.io","claimbits.io","starbits.io"],
                       inputTextSelector: ["input.fname","input.address"],
                       defaultButtonSelectors: ["a.clmnow","a.homebutton.faa-parent.animated-hover","a#box3.clmnow"],
                       captchaButtonSubmitSelector: "#ncb > input",
                       allMessageSelectors: [".alertbox.fullCenter",".alert.alert-info",".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },
                       ];





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

    var isNextUrlReachable = true;//default false

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
                    },5000);

})();