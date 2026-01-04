// ==UserScript==
// @name         Auto-Reclamar Criptos ilimitadas
// @name:en      Auto-Claim Unlimited Cryptos
// @namespace    Criptomonedas Ilimitadas (Faucet)
// @namespace:en Unlimited Cryptocurrencys (Faucet)
// @version      2.2
// @description  Auto-claim criptos en diferentes paginas
// @description:en Auto-claim cryptos in diferent faucets
// @author       muñen
// @match        https://claimfreecoins.io/*
// @match        https://99faucets.com/*
// @match        https://www.trxclaim.com/*
// @match        https://aruble.net/*
// @match        https://fast-bitcoin.eu/*
// @match        https://fast-dogecoin.eu/*
// @match        https://fast-tron.eu/*
// @match        https://fast-dash.eu/*
// @match        https://fast-litecoin.eu/*
// @match        https://fast-solana.eu/*
// @match        https://fast-tether.eu/*
// @match        https://fast-zcash.eu/*
// @match        https://fast-digibyte.eu/*
// @match        https://fast-binance.eu/*
// @match        https://fast-ethereum.eu/*
// @match        https://fast-bitcoincash.eu/*
// @match        https://fast-feyorra.eu/*
// @match        https://starcoins.ws/*
// @match        https://www.cryptoforu.org/*
// @match        https://faucetpoint.net/*
// @match        https://bep20faucet.com/*
// @match        https://498faucet.com/*
// @match        https://cryptoclaim.cash/*
// @match        https://herafaucet.top/*
// @match        https://diamondfaucet.space/*
// @match        https://cryptoclaim.io/*
// @match        https://hosting4lifetime.com/*
// @match        https://abcshort.com/*
// @match        https://gobits.io/*
// @match        https://i-bits.io/*
// @match        https://ethiomi.com/*
// @match        https://coinsfreeclaim.com/*
// @connect      claimfreecoins.io
// @connect      99faucets.com
// @connect      www.trxclaim.com
// @connect      aruble.net
// @connect      fast-bitcoin.eu
// @connect      fast-dogecoin.eu
// @connect      fast-tron.eu
// @connect      fast-dash.eu
// @connect      fast-litecoin.eu
// @connect      fast-solana.eu
// @connect      fast-tether.eu
// @connect      fast-zcash.eu
// @connect      fast-digibyte.eu
// @connect      fast-binance.eu
// @connect      fast-ethereum.eu
// @connect      fast-bitcoincash.eu
// @connect      fast-feyorra.eu
// @connect      www.cryptoforu.org
// @connect      faucetpoint.net
// @connect      bep20faucet.com
// @connect      498faucet.com
// @connect      cryptoclaim.cash
// @connect      diamondfaucet.space
// @connect      herafaucet.top
// @connect      cryptoclaim.io
// @connect      gobits.io
// @connect      i-bits.io
// @connect      ethiomi.com
// @connect      coinsfreeclaim.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link

// @downloadURL https://update.greasyfork.org/scripts/443209/Auto-Reclamar%20Criptos%20ilimitadas.user.js
// @updateURL https://update.greasyfork.org/scripts/443209/Auto-Reclamar%20Criptos%20ilimitadas.meta.js
// ==/UserScript==

//Block All Pop ups
unsafeWindow.open = function(){};

(function() {
    'use strict';

    //===============================================================================================
    //User configuration
    // Enter Your FaucetPay Faucet Address and Express Crypto below as mentioned in the example and
    // save the entered text in user configuration in a file. This is to ensure that you
    // don't repeat entering whenever there is an update.

    var faucetpayEmail = "Tu-Cuenta/Your-Account"; //Ex: var faucetpayEmail = "*****@gmail.com"
    var bitcoin="Tu-dirección/Your-adress";           // Ex: var bitcoin="1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
    var binance="Tu-dirección/Your-adress";
    var bitcoincash ="Tu-dirección/Your-adress";
    var dash ="Tu-dirección/Your-adress";
    var dogecoin ="Tu-dirección/Your-adress";
    var digibyte="Tu-dirección/Your-adress";
    var ethereum="Tu-dirección/Your-adress";
    var feyorra="Tu-dirección/Your-adress";
    var litecoin ="Tu-dirección/Your-adress";
    var solana ="Tu-dirección/Your-adress";
    var tron ="Tu-dirección/Your-adress";
    var tether="Tu-dirección/Your-adress";
    var zcash ="Tu-dirección/Your-adress";



    // Set the value to true if you want to autowithdraw after each claim
    // Set the value to false if you want to accumulate and withdraw later
    var autoWithdraw = true;

    //You can now save the file and start using


    //===============================================================================================

    //Replacing bitcoincash default value from faucetpay, since bagi and keran don't accept this format
    bitcoincash = bitcoincash.replaceAll("bitcoincash:","");

    //List of the faucet websites along with address
    //coin parameter is used as regex from the url
    //If url has */bitcoin/* then use "bitcoin" as coin, if it is */ETH/*, use "ETH" as coin
    //If there is no regex for coin, use only address
    // Comment the faucets which you do not wish to use or which don't have sufficient funds 
    var websiteData = [

        {url : "https://claimfreecoins.io/free-bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "free-bitcoin", address: bitcoin},
        {url : "https://claimfreecoins.io/free-dogecoin/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "free-dogecoin", address: dogecoin},
        {url : "https://claimfreecoins.io/free-litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "free-litecoin", address: litecoin},
        {url : "https://claimfreecoins.io/free-tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tron", address: tron},
        {url : "https://claimfreecoins.io/free-binance/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "free-binance", address: binance},
        {url : "https://claimfreecoins.io/free-dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "free-dash", address: dash},
        {url : "https://claimfreecoins.io/free-tether/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tether", address: tether},
        {url : "https://claimfreecoins.io/free-zcash/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "free-zcash", address: zcash},
        {url : "https://claimfreecoins.io/free-digibyte?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN/", coin: "free-digibyte", address: digibyte},
        {url : "https://claimfreecoins.io/free-ethereum/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-ethereum", address: ethereum},
        // {url : "https://claimfreecoins.io/free-bitcoin-cash/?r=bitcoincash:qpgph5jgnkypaunsrcmkags8eg09f36fa5f82a7mmz", coin: "free-bitcoin-cash", address: bitcoin},
        {url : "https://claimfreecoins.io/free-feyorra/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-feyorra", address: feyorra},
        //  {url : "https://99faucets.com/bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        //  {url : "https://99faucets.com/dogecoin/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "dogecoin", address: dogecoin},
        //  {url : "https://99faucets.com/litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "litecoin", address: litecoin},
        {url : "https://www.trxclaim.com/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "tron", address: tron},
        {url : "https://aruble.net/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "BTC", address: faucetpayEmail},
        {url : "https://fast-bitcoin.eu/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        {url : "https://fast-dogecoin.eu/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "dogecoin", address: dogecoin},
        {url : "https://fast-tron.eu/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "tron", address: tron},
        {url : "https://fast-litecoin.eu/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "litecoin", address: litecoin},
        {url : "https://fast-binance.eu/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "binance", address: binance},
        {url : "https://fast-solana.eu/?r=3Wj6LCiuX6hcSCh7R9qu9EnWcKukojZiMEBo7MmCVCxd", coin: "solana", address: solana},
        // {url : "https://fast-dash.eu/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "dash", address: dash},
        {url : "https://fast-tether.eu/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "tether", address: tether},
        {url : "https://fast-zcash.eu/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "zcash", address: zcash},
        {url : "https://fast-digibyte.eu/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "digibyte", address: digibyte},
        {url : "https://fast-ethereum.eu/?r=", coin: "ethereum", address: ethereum},
        // {url : "https://fast-bitcoincash.eu/?r=bitcoincash:qpgph5jgnkypaunsrcmkags8eg09f36fa5f82a7mmz", coin: "bitcoincash", address: bitcoincash},
        {url : "https://fast-feyorra.eu/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "feyorra", address: feyorra},
        {url : "https://www.cryptoforu.org/fp_solana_faucet/?r=3Wj6LCiuX6hcSCh7R9qu9EnWcKukojZiMEBo7MmCVCxd", coin: "fp_solana_faucet", address: solana},
        {url : "https://www.cryptoforu.org/fp_eth_faucet/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "fp_eth_faucet", address: ethereum},
        {url : "https://www.cryptoforu.org/fp_tether_faucet/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "fp_tether_faucet", address: tether},
        {url : "https://faucetpoint.net/free-binance/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "free-binance", address: binance},
        {url : "https://cryptoclaim.io/faucets/free-dogecoin/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "free-dogecoin", address: dogecoin},
        {url : "https://cryptoclaim.io/faucets/free-litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "free-litecoin", address: litecoin},
        {url : "https://cryptoclaim.io/faucets/free-dash/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "free-dash", address: dash},
        {url : "https://cryptoclaim.io/faucets/free-tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tron", address: tron},
        {url : "https://cryptoclaim.io/faucets/free-tether/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tether", address: tether},
        {url : "https://cryptoclaim.io/faucets/free-feyorra/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-feyorra", address: feyorra},
        {url : "https://cryptoclaim.io/faucets/free-binance/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "free-binance", address: binance},
        {url : "https://cryptoclaim.io/faucets/free-zcash/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "free-zcash", address: zcash},
        {url : "https://cryptoclaim.io/faucets/free-ethereum/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-ethereum", address: ethereum},
        {url : "https://cryptoclaim.io/free-feyorra/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-feyorra", address: feyorra},
        {url : "https://bep20faucet.com/dgb/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "dgb", address: digibyte},
        {url : "https://bep20faucet.com/doge/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "doge", address: dogecoin},
        {url : "https://bep20faucet.com/eth/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "eth", address: ethereum},
        {url : "https://bep20faucet.com/fey/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "fey", address: feyorra},
        {url : "https://bep20faucet.com/sol/?r=3Wj6LCiuX6hcSCh7R9qu9EnWcKukojZiMEBo7MmCVCxd", coin: "sol", address: solana},
        {url : "https://bep20faucet.com/trx/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "trx", address: tron},
        {url : "https://bep20faucet.com/usdt/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "usdt", address: tether},
        {url : "https://498faucet.com/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "doge", address: dogecoin},
        {url : "https://cryptoclaim.cash/faucets/free-bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "free-bitcoin", address: bitcoin},
        {url : "https://cryptoclaim.cash/faucets/free-dogecoin/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "free-dogecoin", address: dogecoin},
        {url : "https://cryptoclaim.cash/faucets/free-litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "free-litecoin", address: litecoin},
        {url : "https://cryptoclaim.cash/faucets/free-tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tron", address: tron},
        {url : "https://cryptoclaim.cash/faucets/free-binance/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "free-binance", address: binance},
        {url : "https://cryptoclaim.cash/faucets/free-dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "free-dash", address: dash},
        {url : "https://cryptoclaim.cash/faucets/free-tether/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tether", address: tether},
        {url : "https://cryptoclaim.cash/faucets/free-zcash/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "free-zcash", address: zcash},
        {url : "https://cryptoclaim.cash/faucets/free-digibyte/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "free-digibyte", address: digibyte},
        {url : "https://cryptoclaim.cash/faucets/free-ethereum/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-ethereum", address: ethereum},
        {url : "https://cryptoclaim.cash/faucets/free-feyorra/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-feyorra", address: feyorra},
        {url : "https://herafaucet.top/bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        {url : "https://herafaucet.top/ethereum/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "ethereum", address: ethereum},
        {url : "https://herafaucet.top/dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "dash", address: dash},
        {url : "https://herafaucet.top/digibyte/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "digibyte", address: digibyte},
        {url : "https://herafaucet.top/tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "tron", address: tron},
        {url : "https://diamondfaucet.space/btc/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        {url : "https://diamondfaucet.space/dgb/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "dgb", address: digibyte},
        {url : "https://diamondfaucet.space/doge/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "doge", address: dogecoin},
        {url : "https://diamondfaucet.space/dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "dash", address: dash},
        {url : "https://diamondfaucet.space/eth/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "eth", address: ethereum},
        {url : "https://diamondfaucet.space/fey/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "fey", address: feyorra},
        {url : "https://diamondfaucet.space/sol/?r=3Wj6LCiuX6hcSCh7R9qu9EnWcKukojZiMEBo7MmCVCxd", coin: "sol", address: solana},
        {url : "https://diamondfaucet.space/trx/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "trx", address: tron},
        {url : "https://diamondfaucet.space/usdt/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "usdt", address: tether},
        {url : "https://diamondfaucet.space/zcash/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "zcash", address: zcash},
        {url : "https://diamondfaucet.space/bnb/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "bnb", address: binance},
        {url : "https://diamondfaucet.space/bcash/?r=bitcoincash:qpgph5jgnkypaunsrcmkags8eg09f36fa5f82a7mmz", coin: "bcash", address: bitcoincash},
        
        {url : "https://gobits.io/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        {url : "https://i-bits.io/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
        {url : "https://ethiomi.com/tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "tron", address: tron},
        {url : "https://ethiomi.com/doge/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "doge", address: dogecoin},
        //{url : "https://ethiomi.com/ethereum/?r=1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5", coin: "ethereum", address: ethereum},
        //{url : "https://ethiomi.com/dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "dash", address: dash},
        {url : "https://ethiomi.com/digibyte/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "digibyte", address: digibyte},
        {url : "https://ethiomi.com/zcash/?r=t1J4qRKojQf8F4uLyZ6pNZvz1oi1V6QQmpU", coin: "zcash", address: zcash},
        // {url : "https://ethiomi.com/bitcoin-cash/?r=bitcoincash:qpgph5jgnkypaunsrcmkags8eg09f36fa5f82a7mmz", coin: "bitcoin-cash", address: bitcoincash},
        {url : "https://ethiomi.com/bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "bitcoin", address: bitcoin},
         // Shortlink faucet
        // {url : "https://ethiomi.com/litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "litecoin", address: litecoin},
/*
        {url : "https://coinsfreeclaim.com/free-bitcoin/?r=1LBPNSC19eyDWFbSmYZhe6RVV7VqQzpuSk", coin: "free-bitcoin", address: bitcoin},
        {url : "https://coinsfreeclaim.com/free-dogecoin/?r=DFPdtFo3hN72sfpC6onagvAQvxE9CMkvhc", coin: "free-dogecoin", address: dogecoin},
        {url : "https://coinsfreeclaim.com/free-litecoin/?r=MVBkKcnwyV32xri7zk5UHBaZ58GvSF8MDC", coin: "free-litecoin", address: litecoin},
        {url : "https://coinsfreeclaim.com/free-tron/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-tron", address: tron},
        {url : "https://coinsfreeclaim.com/free-binance/?r=0xDA7169fD95849bBEc26002e20F1B6ae4b2B11022", coin: "free-binance", address: binance},
        {url : "https://coinsfreeclaim.com/free-dash/?r=XoihPmU9hRtKPD6oQ98cwXGUSf5qfN7hgL", coin: "free-dash", address: dash},
        {url : "https://coinsfreeclaim.com/free-usdt/?r=TRtdQr6MyXn6jNJ75XPAQJiv1XqAyQFdgd", coin: "free-usdt", address: tether},
        {url : "https://coinsfreeclaim.com/free-digibyte/?r=D8A4vRFvi1UJffHoML1VToRHRE9wqXsKsN", coin: "free-digibyte", address: digibyte},
        {url : "https://coinsfreeclaim.com/free-ethereum/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-ethereum", address: ethereum},
        {url : "https://coinsfreeclaim.com/free-feyorra/?r=0x2A3F874ddb712e5917065C78e564a439D4DAE1AC", coin: "free-feyorra", address: feyorra},
        {url : "https://coinsfreeclaim.com/free-solana/?r=3Wj6LCiuX6hcSCh7R9qu9EnWcKukojZiMEBo7MmCVCxd", coin: "free-solana", address: solana},

*/

    ];


    //Add data for any new website with single pages
    //Message selectors are for success or failure to move on to the next website
    //AutoWithdraw is disabled by default(for bagi and keran)
    //Add only domain name in website as mentioned below. Follow the same pattern.
    //Use arrays wherever it is required
    //ToDo:Instead of reading messages, either visibility or length of the messages can be checked
    var websiteMap = [ {website : ["claimfreecoins.io", "fast-bitcoin.eu","fast-dogecoin.eu", "fast-tron.eu",
                                   "fast-litecoin.eu", "fast-binance.eu","fast-solana.eu","fast-dash.eu", "fast-tether.eu",
                                   "fast-zcash.eu", "fast-digibyte.eu", "fast-ethereum.eu", "fast-bitcoincash.eu","fast-feyorra.eu"], 
                        inputTextSelector: "[name='address']",
                        inputTextSelectorButton: "input.btn.btn-block.btn-primary",
                        defaultButtonSelectors: ["button.btn.btn-block.btn-primary","div.form > a.btn.btn-block.btn-primary"],
                        captchaButtonSubmitSelector: "[name='captcha']",
                        allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                        successMessageSelectors: [".alert.alert-success"],
                        messagesToCheckBeforeMovingToNextUrl: ["sufficient", "try again", "invalid", "sufficient","you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                        ablinks: true
                       },

                      {website : ["aruble.net"], inputTextSelector: "[name='address']",
                       inputTextSelectorButton: "input.btn.btn-block.btn-primary",
                       defaultButtonSelectors: ["button.btn.btn-block.btn-primary","a.btn.btn-block.btn-primary"],
                       captchaButtonSubmitSelector: "#anti-bot",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["sufficient","try again", "invalid", "sufficient","you have reached", "tomorrow","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                      {website : ["cryptoclaim.cash", "498faucet.com", "bep20faucet.com", "cryptoclaim.io", "faucetpoint.net", "99faucets.com", "www.trxclaim.com", "bnfaucet.com", "faucet-dgb.com"], inputTextSelector: "#address",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["sufficient","invalid", "insufficient","you have reached", "tomorrow","try again","wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                      {website : ["www.cryptoforu.org"],
                       inputTextSelector: "[name='address']",
                       defaultButtonSelectors: [".btn.btn-block.btn-dark.my-2"],
                       captchaButtonSubmitSelector: "#login",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["sufficient","try again", "invalid", "insufficient", "wrong order", "locked", "was sent to your", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                      {website : ["herafaucet.top"], inputTextSelector: "#address",
                       inputTextSelectorButton: ".button.alt.small",
                       claimButtonSelectors: ["#claim"],
                       captchaButtonSubmitSelector: "#ncb > input",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details", "#first"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["invalid", "sufficient","reached","Please try again","order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       additionalFunctions: herafaucet,
                       ablinks: true
                      },

                      {website : ["diamondfaucet.space"], inputTextSelector: "#address",
                       inputTextSelectorButton: "#login",
                       claimButtonSelectors: ["#second > button"],
                       captchaButtonSubmitSelector: "#ncb > input",
                       allMessageSelectors: [".alert.a-wait", ".alert.a-warning",".alert.a-info",".alert.a-success",".alert.a-danger","#cf-error-details", "#first"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["invalid", "sufficient","reached","Please try again","order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       additionalFunctions: diamondfaucet,
                       ablinks: true
                      },
                      
                       {website : ["gobits.io","i-bits.io"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: ["[data-target='#myModal']"],
                       captchaButtonSubmitSelector: "#ncb > input",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                      {website : ["ethiomi.com","coinsfreeclaim.com"],
                       inputTextSelector: "input[type='text']",
                       defaultButtonSelectors: [".btn.btn-block.btn-primary.my-2"],
                       captchaButtonSubmitSelector: ".form-group input[type='submit']",
                       allMessageSelectors: [".alert.alert-warning",".alert.alert-success",".alert.alert-danger","#cf-error-details"],
                       successMessageSelectors: [".alert.alert-success"],
                       messagesToCheckBeforeMovingToNextUrl: ["try again", "invalid", "sufficient", "wrong order", "locked", "was sent to you", "You have to wait","Login not valid","You have already claimed","claimed successfully","Claim not Valid","rate limited"],
                       ablinks: true
                      },

                     ];

    var ablinksSolved = false;

    //HtmlEvents dispatcher
    function triggerEvent(el, type) {
        try{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }catch(exception){
            console.log(exception);
        }
    }

    //Check if a string is present in Array
    String.prototype.includesOneOf = function(arrayOfStrings) {

        //If this is not an Array, compare it as a String
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

    //Get selector details from the websiteMap
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

    //Identify which coin to input, based on the url input
    //If the URL does not contain the coin, then use the default from the domain name
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

    //If URL does not have coin, check the default from the domain name
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



    //Get the next Url from the website data map
    async function getNextUrl(){

        //Go to the beginning if the end of the array is reached
        if(count >= websiteData.length){
            count = 0;
        }

        websiteDataValues.nextUrl = websiteData[count].url;
        websiteDataValues.regex = websiteData[count].regex;

        //Ping Test to check if a website is up before proceeding to next url
        pingTest(websiteDataValues.nextUrl);
    }

    var isNextUrlReachable = false;
    //Get the next Url from the website
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


    //Default Setting: After 180 seconds go to next Url
    var delayBeforeMovingToNextUrl = 180000;
    if(websiteDataValues.timeoutbeforeMovingToNextUrl){
        delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
    }

    setTimeout(function(){
        movingToNextUrl = false;
        goToNextUrl();
    },delayBeforeMovingToNextUrl);


    //Move to next URL if address is not mentioned above
    if (window.location.href.includes("to=FaucetPay") || (websiteDataValues.address) && (websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_"))){
        goToNextUrl();
    }

    //Returns true if message selectors are present
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

    //Returns true if any message is present in message selector
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

    //Returns true if message selectors are present
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
        
       //If the faucet was stopped in shortlinks go to next url
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

        //Look for all the default messages or errors before proceeding to next url
        //For other languages difference in the length of the strings can be compared or visibility of the style element
        if(!movingToNextUrl && messageSelectorsPresent()){
            goToNextUrl();
        }


        //Input the address and click the login button
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
        
        //Check for all the default button selectors and click
        //This will only click the first selector found, so mention the selectors with parent element wherever required
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
            //Check for all the default button selectors and click
            //This will only click the first selector found, so mention the selectors with parent element wherever required
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



        //Click the form button after solving captcha
        //Works for both recaptcha and hcaptcha
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