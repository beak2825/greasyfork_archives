// ==UserScript==
// @name         NEW FAST RECAPTCHA FREE COIN ROTATOR ABL 
// @namespace    Earn Free Coin Instantly
// @version      18.1
// @description  Earn Free Coin Instantly
// @author       lotocamion
// @match        https://satoshiwin.io/*
// @match        https://faucet4news.xyz/*
// @match        https://aruble.net/*
// @match        https://freefaucet.space/*
// @match        https://99faucets.com/*
// @match        https://hosting4lifetime.com/*
// @match        https://www.freefaucetpay.com/*
// @match        https://fast-ethereum.icu/*
// @match        https://fast-solana.icu/*
// @match        https://fast-litecoin.icu/*
// @match        https://fast-dash.icu/*
// @match        https://fast-zcash.icu/*
// @match        https://fast-tether.icu/*
// @match        https://fast-binance.icu/*
// @match        https://fast-dogecoin.icu/*
// @match        https://fast-tron.icu/*
// @match        https://fast-digibyte.icu/*
// @match        https://fast-bitcoincash.icu/*
// @match        https://fast-bitcoin.icu/*
// @match        https://claimfreecoins.io/*
// @match        https://turbo-eth.icu/*
// @match        https://turbo-btc.icu/*
// @match        https://turbo-sol.icu/*
// @match        https://turbo-ltc.icu/*
// @match        https://turbo-zec.icu/*
// @match        https://turbo-bnb.icu/*
// @match        https://turbo-dash.icu/*
// @match        https://turbo-usdt.icu/*
// @match        https://turbo-trx.icu/*
// @match        https://turbo-doge.icu/*
// @match        https://turbo-dgb.icu/*
// @match        https://cryptoclaim.io/*
// @match        https://cryptocurrencytracker.biz/link/*
// @match        https://starcoins.ws/*
// @match        https://funnyowl.one/*
// @match        https://unlimitedtrx.tk/*
// @match        https://tagecoin.com/*
// @match        https://fescrypto.com/*
// @connect      funnyowl.one
// @connect      fescrypto.com
// @connect      tagecoin.com
// @connect      unlimitedtrx.tk
// @connect      coinsfreeclaim.com
// @connect      aruble.net
// @connect      starcoins.ws
// @connect      cryptocurrencytracker.biz
// @connect      cryptoclaim.io
// @connect      turbo-eth.icu
// @connect      turbo-btc.icu
// @connect      turbo-ltc.icu
// @connect      turbo-zec.icu
// @connect      turbo-bnb.icu
// @connect      turbo-sol.icu
// @connect      turbo-dash.icu
// @connect      turbo-usdt.icu
// @connect      turbo-doge.icu
// @connect      turbo-trx.icu
// @connect      turbo-dgb.icu
// @connect      claimfreecoins.io
// @connect      fast-ethereum.icu
// @connect      fast-bitcoin.icu
// @connect      fast-solana.icu
// @connect      fast-litecoin.icu
// @connect      fast-dash.icu
// @connect      fast-zcash.icu
// @connect      fast-tether.icu
// @connect      fast-binance.icu
// @connect      fast-dogecoin.icu
// @connect      fast-tron.icu
// @connect      fast-digibyte.icu
// @connect      fast-bitcoincash.icu
// @connect      www.freefaucetpay.com
// @connect      freefaucet.space
// @connect      satoshiwin.io
// @connect      faucet4news.xyz
// @connect      99faucets.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/443129/NEW%20FAST%20RECAPTCHA%20FREE%20COIN%20ROTATOR%20ABL.user.js
// @updateURL https://update.greasyfork.org/scripts/443129/NEW%20FAST%20RECAPTCHA%20FREE%20COIN%20ROTATOR%20ABL.meta.js
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
    //    ENTER YOUR FAUCETPAY ADDRESS BELOW AND SAVE IT IN A NOTEPAD IN CASE THERE IS AN UPDATE       //
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


// IF YOU WANT TO DONATE // BTC = 122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4  // DOGE = DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1  //  LTC = MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD  // THANKS //

        var websiteData = [


        {url : "https://aruble.net/?r=1hFy9QhrJy", coin: "BTC", address:Emailfaucetpay},
        {url : "https://turbo-eth.icu/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", address: eth},
        {url : "https://turbo-btc.icu/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", address: btc},
        {url : "https://turbo-sol.icu/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", address: sol},
        {url : "https://turbo-ltc.icu/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", address: ltc},
        {url : "https://turbo-dash.icu/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", address: dash},
        {url : "https://aruble.net/page/faucet/DASH/", coin: "DASH", address:Emailfaucetpay},
        {url : "https://turbo-zec.icu/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", address: zcash},
        {url : "https://turbo-usdt.icu/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", address: tether},
        {url : "https://turbo-bnb.icu/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", address: bnb},
        {url : "https://turbo-doge.icu/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", address: doge},
        {url : "https://turbo-trx.icu/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", address: tron},
        {url : "https://aruble.net/page/faucet/ZEC/", coin: "ZEC", address:Emailfaucetpay},
        {url : "https://turbo-dgb.icu/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", address: dgb},
        {url : "https://claimfreecoins.io/free-bitcoin/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "free-bitcoin", address: btc},
        {url : "https://claimfreecoins.io/free-dogecoin/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-dogecoin", address: doge},
        {url : "https://claimfreecoins.io/free-litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},
        {url : "https://claimfreecoins.io/free-tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},
        {url : "https://aruble.net/page/faucet/ETH/", coin: "ETH", address:Emailfaucetpay},
        {url : "https://claimfreecoins.io/free-binance/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "free-binance", address: bnb},
        {url : "https://claimfreecoins.io/free-dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "free-dash", address: dash},
        {url : "https://claimfreecoins.io/free-tether/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tether", address: tether},
        {url : "https://claimfreecoins.io/free-zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "free-zcash", address: zcash},
        {url : "https://claimfreecoins.io/free-digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "free-digibyte", address: dgb},
        {url : "https://aruble.net/page/faucet/BNB/", coin: "BNB", address:Emailfaucetpay},
        {url : "https://claimfreecoins.io/free-ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-ethereum", address: eth},
        {url : "https://claimfreecoins.io/free-feyorra/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-feyorra", address: fey},
        {url : "https://fast-ethereum.icu/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", address: eth},
        {url : "https://fast-bitcoin.icu/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", address: btc},
        {url : "https://fast-solana.icu/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", address: sol},
        {url : "https://aruble.net/page/faucet/SOL/", coin: "SOL", address:Emailfaucetpay},
        {url : "https://fast-litecoin.icu/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", address: ltc},
        {url : "https://fast-dash.icu/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", address: dash},
        {url : "https://fast-zcash.icu/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", address: zcash},
        {url : "https://fast-tether.icu/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", address: tether},
        {url : "https://fast-binance.icu/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", address: bnb},
        {url : "https://aruble.net/page/faucet/DOGE/", coin: "DOGE", address:Emailfaucetpay},
        {url : "https://fast-dogecoin.icu/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", address: doge},
        {url : "https://fast-tron.icu/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", address: tron},
        {url : "https://fast-digibyte.icu/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", address: dgb},
        {url : "https://fast-bitcoincash.icu/?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", address: bch},
        {url : "https://starcoins.ws/bitcoin-faucet/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "bitcoin-faucet", address: btc},
        {url : "https://aruble.net/page/faucet/USDT/", coin: "USDT", address:Emailfaucetpay},
        {url : "https://starcoins.ws/dogecoin-faucet/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "dogecoin-faucet", address: doge},
        {url : "https://starcoins.ws/litecoin-faucet/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin-faucet", address: ltc},
        {url : "https://starcoins.ws/tron-faucet/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron-faucet", address: tron},
        {url : "https://starcoins.ws/bnb-faucet/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "bnb-faucet", address: bnb},
        {url : "https://starcoins.ws/dash-faucet/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash-faucet", address: dash},
        {url : "https://aruble.net/page/faucet/LTC/", coin: "LTC", address:Emailfaucetpay},
        {url : "https://starcoins.ws/tether-faucet/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tether-faucet", address: tether},
        {url : "https://starcoins.ws/zcash-faucet/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "zcash-faucet", address: zcash},
        {url : "https://starcoins.ws/digibyte-faucet/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "digibyte-faucet", address: dgb},
        {url : "https://starcoins.ws/ethereum-faucet/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "ethereum-faucet", address: eth},
        {url : "https://starcoins.ws/feyorra-faucet/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "feyorra-faucet", address: fey},
        {url : "https://aruble.net/page/faucet/FEY/", coin: "FEY", address:Emailfaucetpay},
        {url : "https://starcoins.ws/solana-faucet/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "solana-faucet", address: sol},
        {url : "https://freefaucet.space/doge?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://freefaucet.space/feyorra/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "feyorra", address: fey},
        {url : "https://freefaucet.space/litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin", address: ltc},
        {url : "https://freefaucet.space/tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},
        {url : "https://aruble.net/page/faucet/BCH/", coin: "BCH", address:Emailfaucetpay},
        {url : "https://freefaucet.space/usdt/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "usdt", address: tether},
        {url : "https://freefaucet.space/dgb/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "dgb", address: dgb},
        /*
        {url : "https://99faucets.com/solana/?r=lotocamion@gmail.com", coin: "solana", address: Emailfaucetpay},
        {url : "https://99faucets.com/dogecoin/?r=lotocamion@gmail.com", coin: "dogecoin", address: Emailfaucetpay},
        {url : "https://99faucets.com/litecoin/?r=lotocamion@gmail.com", coin: "litecoin", address: Emailfaucetpay},
        {url : "https://99faucets.com/tron/?r=lotocamion@gmail.com", coin: "tron", address: Emailfaucetpay},
        {url : "https://99faucets.com/zcash/?r=lotocamion@gmail.com", coin: "zcash", address: Emailfaucetpay},
        */
        {url : "https://faucet4news.xyz/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://www.freefaucetpay.com/doge?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://unlimitedtrx.tk/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},
        {url : "https://funnyowl.one/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "btc", address: btc},
        {url : "https://satoshiwin.io/free-bitcoin/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "free-bitcoin", address: btc},
        {url : "https://satoshiwin.io/faucets/free-dogecoin/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-dogecoin", address: doge},
        {url : "https://satoshiwin.io/faucets/free-litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},
        {url : "https://satoshiwin.io/faucets/free-dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "free-dash", address: dash},
        {url : "https://satoshiwin.io/faucets/free-digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "free-digibyte", address: dgb},
        {url : "https://satoshiwin.io/faucets/free-tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},
        {url : "https://satoshiwin.io/faucets/free-feyorra/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-feyorra", address: fey},
        {url : "https://satoshiwin.io/faucets/free-binance/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "free-binance", address: bnb},
        {url : "https://satoshiwin.io/faucets/free-tether/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tether", address: tether},
        {url : "https://satoshiwin.io/faucets/free-zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "free-zcash", address: zcash},
        {url : "https://satoshiwin.io/faucets/free-ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-ethereum", address: eth},
        {url : "https://tagecoin.com/page/faucet/bitcoin/?r=122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4", coin: "bitcoin", address: btc},
        {url : "https://tagecoin.com/page/faucet/litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "litecoin", address: ltc},
        {url : "https://tagecoin.com/page/faucet/dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "dash", address: dash},
        {url : "https://tagecoin.com/page/faucet/tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},
        {url : "https://tagecoin.com/page/faucet/solana/?r=4k6He1epedToQAz2pf78oHd5GQpdjkF8tJAiLrRtzEAK", coin: "solana", address: sol},
        {url : "https://tagecoin.com/page/faucet/ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "ethereum", address: eth},
        {url : "https://tagecoin.com/page/faucet/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://fescrypto.com/doge/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "doge", address: doge},
        {url : "https://fescrypto.com/tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "tron", address: tron},

        /*{url : "https://cryptoclaim.io/faucets/free-litecoin/?r=MThidmDerYdNaDw1QAdF1c2Xe3fbuaJ5ZD", coin: "free-litecoin", address: ltc},
        {url : "https://cryptoclaim.io/faucets/free-dash/?r=Xxph9N3ARXMmJemc1jVUJLXd7k7QRHvnJ3", coin: "free-dash", address: dash},
        {url : "https://cryptoclaim.io/faucets/free-tron/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tron", address: tron},
        {url : "https://cryptoclaim.io/faucets/free-tether/?r=TYyY9hqasmiWHsGcU8fAWH1Yj5kwLsJL3d", coin: "free-tether", address: tether},
        {url : "https://cryptoclaim.io/faucets/free-feyorra/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-feyorra", address: fey},
        {url : "https://cryptoclaim.io/faucets/free-binance/?r=0x91F2279fC46f0A93bF867f27A9D50B94786E1006", coin: "free-binance", address: bnb},
        {url : "https://cryptoclaim.io/faucets/free-zcash/?r=t1ehpKBLZqQ9bjFmtocHY3qzzGXaWAPiREw", coin: "free-zcash", address: zcash},
        {url : "https://cryptoclaim.io/faucets/free-digibyte/?r=D6wzdr8QAwnkwqaae8xRBvkGe3VxPdmnqn", coin: "free-digibyte", address: dgb},
        {url : "https://cryptoclaim.io/faucets/free-bitcoin-cash/?r=qrxywy4efsz25qech8t995kd67xahyga9qecvmlr24", coin: "free-bitcoin-cash", address: bch},
        {url : "https://cryptoclaim.io/faucets/free-ethereum/?r=0x494f4984614Ea885Eeda04D79e7a610df66D0E16", coin: "free-ethereum", address: eth},
        {url : "https://cryptoclaim.io/faucets/free-dogecoin/?r=DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1", coin: "free-dogecoin", address: doge},
        */



        ];





      var websiteMap = [{website : ["aruble.net"], inputTextSelector: "[name='address']",
                       inputTextSelectorButton: "input.btn.btn-block.btn-primary",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary","a.btn.btn-block.btn-primary"],
                       captchaButtonSubmitSelector: "#anti-bot",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["The faucet does not have sufficient funds for this transaction","Your daily claim limit has been reached","Please come back in tomorrow","Please try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },
                       {website : ["faucet4news.xyz"],
                       inputTextSelector: [".form-control"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-block.btn-primary.text-uppercase"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["sufficient","invalid", "insufficient","you have reached", "tomorrow","try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       },


                       {website : ["fescrypto.com","tagecoin.com","unlimitedtrx.tk","funnyowl.one","cryptofuture.co.in","www.freefaucetpay.com","99faucets.com","freefaucet.space"],
                       inputTextSelector: ["#address"],
                       defaultButtonSelectors: ["a.homebutton.faa-parent.animated-hover","button.btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["The send limit set","sufficient","insufficient","you have reached","tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                        {website : ["satoshiwin.io"],
                       inputTextSelector: ["#address"],
                       defaultButtonSelectors: ["a.homebutton.faa-parent.animated-hover","button.btn.btn-block.btn-primary.my-2",".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["The send limit set","sufficient","insufficient","you have reached","tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                       {website : [".icu"],
                       inputTextSelector: ".form-control",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary","input.btn.btn-block.btn-primary"],
                       captchaButtonSubmitSelector: ["#ncb > input"],
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["insufficient","you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                       {website : ["claimfreecoins.io","starcoins.ws"],
                       inputTextSelector: "[name='address']",
                       inputTextSelectorButton: "input.btn.btn-block.btn-primary",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary","div.form > a.btn.btn-block.btn-primary",".btn.btn-success.btn-lg.get-link"],
                       captchaButtonSubmitSelector: ["[name='captcha']"],
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["insufficient","you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                       {website : ["ethiomi.com"],
                       inputTextSelector: ".form-control",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                       },

                       {website : ["cryptoclaim.io"],
                       inputTextSelector: [".form-control"],
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2",".btn.btn-success.btn-lg.get-link"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["Safety Limit reached","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
			           //messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid","The faucet does not have sufficient funds for this transaction","insufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true

                      },

                       ];

    if(document.querySelector("#ads-show > div > div > div > form > input")){
    document.querySelector("#ads-show > div > div > div > form > input").click();
    }

    setTimeout(function() {
    if(window.location.href.includes("https://aruble.net/?r=1hFy9QhrJy")) {
    document.querySelector("#body > div.container-fluid.no-padding.no-margin > div > div > div:nth-child(10) > a").click();
    } },500);

    setTimeout(function() {
    if(document.querySelector("#faucet > div > div.alert.alert-danger")) {
    document.querySelector("#faucet > div > div.form > a").click();
    } },3000);



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
//////////////////
    var isNextUrlReachable = true;

    function pingTest(websiteUrl) {
        console.log(websiteUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: websiteUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 5000,
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
                await delay(5000);
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



    var delayBeforeMovingToNextUrl = 115000;
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
        setInterval(function() {
        if(document.querySelector(".btn.btn-success.btn-lg.get-link")){
        document.querySelector(".btn.btn-success.btn-lg.get-link").click();
        }

        //if(window.location.href.includes("starcoins.ws") || window.location.href.includes("hosting4lifetime.com")){
            //websiteDataValues.captchaButtonSubmitSelector = "#btn-before";
            //let clicked = false;
            //unsafeWindow.open = function(url){window.location.href = url};
            //setInterval(function(){
                //if(!clicked && document.querySelector("#btn6") && !document.querySelector("#btn6").disabled){
                    //document.querySelector("#btn6").click();
                    //clicked = true;
                    //}
                    //},7000)

            setTimeout(function(){
                window.location.href= websiteData[0].url;
            },120000)
            //}

            },5000)

            },5000)

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
                    },5000);




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