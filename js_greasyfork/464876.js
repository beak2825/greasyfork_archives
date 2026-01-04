// ==UserScript==
// @name         Auto Claim Multiple Faucets with Monitor UI
// @description  Automatic rolls and claims for 50+ crypto faucets/PTC/miners (Freebitco.in BTC, auto promo code for 16 CryptosFaucet, FaucetPay, StormGain, etc)
// @description  Claim free ADA, BNB, BCH, BTC, DASH, DGB, DOGE, ETH, FEY, LINK, LTC, NEO, SHIB, STEAM, TRX, USDC, USDT, XEM, XRP, ZEC, ETC
// @version      2.9.3
// @author       satology
// @namespace    satology.onrender.com
// @homepage     https://criptologico.com/tools/cc

// @note         IMPORTANT
// @note         0. To start the script you need to navigate to https://criptologico.com/tools/cc
// @note         1. You must have a hCaptcha solver installed to claim from most of the faucets. Check the discord if you need one
// @note         2. If the faucets are opening popups/popunder despite having an ad blocker, you can install this script which is targeting specific ads of the faucets:
// @note            https://greasyfork.org/en/scripts/429739-closewindowbyname
// @note         3. The following script might help you prevent the focus detection (countdown stops), allowing you to do PTCs on background window:
// @note            https://greasyfork.org/en/scripts/427254-preventpagevisibility
// @note            I would suggest changing the match tag to make it run only on the sites you want

// @note         - MAIN FEATURES ------------------------------------------------------------------------------------------------------------------------------------------------
// @note         > Automatic rolls and claims for faucets/PTCs/miners
// @note         > Accepts promotion codes (http://twitter.com/cryptosfaucets, free roll shortlinks) for CF 16 faucets
// @note         > Simple Monitor UI on top of a website to track progress (claims, next rolls, promo codes)

// @note         CONSIDERATIONS
// @note         0. You need to enable popups on the Manager UI website to be able to open the faucets
// @note         1. CF Faucets need to open in English to recognize the promo code status after processing
// @note            In case you don't want to have them in English, you need to change the 3 strings the code uses for validation and change setToEnglish to false
// @note            (Search for localeStrings in the code)
// @note         2. Autorolls will trigger ONLY when the faucet was opened by the Manager UI.
// @note            This is to allow users to navigate the websites normally when manually visiting them
// @note         3. You can enable/disable faucets from the UI. By default they are all set to false.
// @note            It would be great if you could register using the open link next to each faucet on the list
// @note         4. All data stored for tracking and to be displayed is stored locally in your environment. Nothing is uploaded.

// @note         ----------------------------------------------------------------------------------------------------------------------------------------------------------------
// @note         DISCLAIMER: This script is shared to help. Use at your own discretion. I've being using it for months and works fine but I cannot
// @note         guarantee that the faucets won't ban your IP or account.
// @note         ----------------------------------------------------------------------------------------------------------------------------------------------------------------

// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        GM_openInTab
// @grant        window.onurlchange
// @connect      criptologico.com
// @icon         https://www.google.com/s2/favicons?domain=stormgain.com
// @match        https://app.stormgain.com/crypto-miner/
// @match        https://freecardano.com/*
// @match        https://freebinancecoin.com/*
// @match        https://freebitcoin.io/*
// @match        https://freedash.io/*
// @match        https://free-doge.com/*
// @match        https://freeethereum.com/*
// @match        https://freecryptom.com/*
// @match        https://free-ltc.com/*
// @match        https://freeneo.io/*
// @match        https://freesteam.io/*
// @match        https://free-tron.com/*
// @match        https://freeusdcoin.com/*
// @match        https://freetether.com/*
// @match        https://freenem.com/*
// @match        https://freeshibainu.com/*
// @match        https://coinfaucet.io/*
// @match        https://freebitco.in/
// @match        https://faucetpay.io/*
// @match        https://free-litecoin.com/*
// @match        https://www.free-ethereum.io/
// @match        https://www.free-ethereum.io/free/
// @match        https://btc-ok.net/*
// @match        https://dash-ok.net/*
// @match        https://dgb-ok.net/*
// @match        https://doge-ok.net/*
// @match        https://eth-ok.net/*
// @match        https://ltc-ok.net/*
// @match        https://trx-ok.net/*
// @match        https://bigbtc.win/*
// @match        https://www.bestchange.com/*
// @match        https://bitking.biz/*
// @match        https://litking.biz/*
// @match        https://faucetok.net/*
// @match        https://betfury.io/boxes/all*
// @match        https://www.free-doge.io/
// @match        https://www.free-doge.io/free/
// @match        https://autofaucet.dutchycorp.space/login.php*
// @match        https://autofaucet.dutchycorp.space/roll.php*
// @match        https://autofaucet.dutchycorp.space/coin_roll.php*
// @match        https://express.dutchycorp.space/index.php*
// @match        https://express.dutchycorp.space/roll.php*
// @match        https://express.dutchycorp.space/coin_roll.php*
// @match        https://faucetcrypto.com/dashboard
// @match        https://faucetcrypto.com/task/faucet-claim
// @match        https://faucetcrypto.com/ptc/*
// @match        https://faucetcrypto.com/task/ptc-advertisement/*
// @match        https://faupig-bit.online/page/dashboard*
// @match        https://faupig-bit.online/account/login/not-logged-in
// @match        https://freepancake.com/*
// @match        https://getfreetrx.com/*
// @match        https://freegridco.in/*
// @match        https://freematic.com/*
// @match        https://freebch.fun/page/dashboard*
// @match        https://freebch.fun/account/login/not-logged-in
// @match        https://james-trussy.com/*
// @match        https://cryptobaggiver.com/dogecoin-faucet/*
// @match        https://cryptobaggiver.com/ethereum-faucet/*
// @match        https://cryptobaggiver.com/litecoin-faucet/*
// @match        https://cryptobaggiver.com/bitcoin-cash-faucet/*
// @match        https://cryptobaggiver.com/digibyte-faucet/*
// @match        https://cryptobaggiver.com/dash-faucet/*
// @match        https://dogefaucet.cryptobaggiver.com/*
// @match        https://ethereumfaucet.cryptobaggiver.com/*
// @match        https://litecoinfaucet.cryptobaggiver.com/*
// @match        https://bitcoincashfaucet.cryptobaggiver.com/*
// @match        https://digibytefaucet.cryptobaggiver.com/*
// @match        https://dashfaucet.cryptobaggiver.com/*
// @match        https://www.only1024.com/f*
// @match        https://criptologico.com/tools/cc*
// @match        https://freebittorrent.com/*
// @match        https://freebfg.com/*
// @match        https://yescoiner.com/*
// @match        https://coindiversity.io/*
// @match        https://bscads.com/*
// @downloadURL https://update.greasyfork.org/scripts/464876/Auto%20Claim%20Multiple%20Faucets%20with%20Monitor%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/464876/Auto%20Claim%20Multiple%20Faucets%20with%20Monitor%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const localeConfig = {
        setToEnglish: true, // will set the faucets to English
        stringSearches: {
            promoCodeAccepted: 'roll',
            promoCodeUsed: 'already used',
            promoCodeInvalid: ['not found', 'only alphanumeric'],
            promoCodeExpired: ['ended']
        }
    };

    const K = Object.freeze({
        WebType: {
            CRYPTOSFAUCETS: 1,
            STORMGAIN: 2,
            FREEBITCOIN: 3,
            FAUCETPAY: 4,
            FREELITECOIN: 5,
            FREEETHEREUMIO: 6,
            BAGIKERAN: 7,
            OKFAUCET: 8,
            BIGBTC: 9,
            BESTCHANGE: 10,
            KINGBIZ: 11,
            BETFURYBOX: 13,
            FREEDOGEIO: 14,
            DUTCHYROLL: 15,
            FCRYPTO: 16,
            CPU: 17,
            CBG: 18,
            FPB: 19,
            G8: 20,
            FREEGRC: 21,
            HELI: 22,
            VIE: 23,
            O24: 24,
            YCOIN: 25,
            CDIVERSITY: 26,
            BSCADS: 27
        },
        CF: {
            UrlType: {
                HOME: 0,
                FREE: 1,
                CONTACTTWITTER: 2,
                PROMOTION: 3,
                STATS: 4,
                SETTINGS: 5,
                FREEROLLS: 6,
                IGNORE: 99
            },
            PromoStatus: {
                NOCODE: 0,
                PENDING: 1,
                ACCEPTED: 2,
                USEDBEFORE: 3,
                INVALID: 4,
                UNKNOWNERROR: 5,
                EXPIRED: 6
            },
            ReusableCodeSuggestions: ['q5rlm6ot3r', '55khv20st4', 'ykxlvmg9ja', 'vmuph8j0c6', 'd8fmqxjlma', 'rjnmzjs673', 'ki2r0jq5r0', '4obq1i3idd']
        },
        RandomInteractionLevel: {
            NONE: 0,
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3
        },
        Integers: {
            HS_26_IN_MILLISECONDS: 93600000, //Using 26 hs instead of 24hs
            HS_2_IN_MILLISECONDS: 7200000 //and 2hs gap retry when code is flagged as USEDBEFORE
        },
        WalletType: {
            FP_MAIL: 100,
            FP_BTC: 101,
            FP_BNB: 102,
            FP_BCH: 103,
            FP_DASH: 104,
            FP_DGB: 105,
            FP_DOGE: 106,
            FP_ETH: 107,
            FP_FEY: 108,
            FP_LTC: 109,
            FP_TRX: 110,
            FP_USDT: 111,
            FP_ZEC: 112,
            FP_SOL: 113,
            EC: 200,
            BTC: 1,
            LTC: 2
        },
        ErrorType: {
            ERROR: 0,
            TIMEOUT: 1,
            NEED_TO_LOGIN: 2,
            ROLL_ERROR: 3,
            CLICK_ROLL_ERROR: 4,
            LOGIN_ERROR: 5,
            CLAIM_ERROR: 6,
            ADDRESS_ERROR: 7,
            MIN_WITHDRAW_ERROR: 8,
            IP_BAN: 9,
            IP_RESTRICTED: 10,
            IP_ERROR: 11,
            FORCE_CLOSED: 12,
            NO_FUNDS: 13,
            VERIFY_EMAIL: 14,
            NO_ADDRESS: 15,
            FAUCET_EMPTY: 16
        },
        CMC: {
            MULT: '-1',
            BTC: '1',
            LTC: '2',
            XRP: '52',
            DOGE: '74',
            DGB: '109',
            DASH: '131',
            USDT: '825',
            XEM: '873',
            ETH: '1027',
            STEEM: '1230',
            NEO: '1376',
            ZEC: '1437',
            BCH: '1831',
            BNB: '1839',
            TRX: '1958',
            LINK: '1975',
            ADA: '2010',
            USDC: '3408',
            SOL: '5426',
            SHIB: '5994',
            FEY: '10361',
            BFG: '11038',
            CAKE: '7186',
            GRC: '833',
            MATIC: '3890',
            BABY: '10334',
            BTT: '16086',
            BSW: '10746',
        }
    });

    let persistence, shared, manager, ui, CFPromotions, interactions, CFHistory, SiteProcessor;

    Element.prototype.isVisible = function() {
        return !!(this.offsetWidth||this.offsetHeight||this.getClientRects().length);
    };
    Element.prototype.isUserFriendly = function(selector) {
        let e = selector ? this.querySelector(selector) : this;
        return e && e.isVisible()  ? e : null;
    };
    HTMLDocument.prototype.isUserFriendly = Element.prototype.isUserFriendly;

    Number.prototype.toDate = function() {
        return new Date(this);
    };
    String.prototype.clean = function() {
        let output = "";
        for (let i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) <= 127) {
                output += this.charAt(i);
            }
        }
        return output;
    };
    Array.prototype.shuffle = function () {
        let currentIndex = this.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this[currentIndex];
            this[currentIndex] = this[randomIndex];
            this[randomIndex] = temporaryValue;
        }

        return this;
    };

    let helpers = {
        getPrintableTime: function (date = new Date()) {
            if (date == null) {
                return '';
            }
            return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        },
        getPrintableDateTime: function (date) {
            if (date != null) {
                return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
            } else {
                return '';
            }
        },
        getEnumText: function (enm, value) {
            return Object.keys(enm).find(key => enm[key] === value) || '_ERR';
        },
        randomMs: function (a, b){
            return a + (b - a) * Math.random();
        },
        addMinutes: function(mins, date = new Date()) {
            return date.setMinutes(date.getMinutes() + +mins);
        },
        addSeconds: function(secs, date = new Date()) {
            return date.setSeconds(date.getSeconds() + +secs);
        },
        randomInt: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        addMs: function(ms, date = new Date()) {
            return date.setMilliseconds(date.getMilliseconds() + ms);
        },
        getRandomMs: function(minute, rangeDiffInPercentage) { // Now will be a random value between minute and minute + rangeDiffPercentage%; Example if minute = 30 and rangeDiffPercentage = 5 => random in the range [30, 31.5]
            let msMin = minute * 60 * 1000;
            let msMax = msMin + rangeDiffInPercentage/100 * msMin;
            return helpers.randomMs(msMin, msMax);
        },
        hsToMs: function(hours) {
            return hours * 60 * 60 * 1000;
        },
        minToMs: function(min) {
            return min * 60 * 1000;
        },
        getEmojiForPromoStatus: function(promoStatus) {
            switch (promoStatus) {
                case K.CF.PromoStatus.NOCODE:
                    return '⚪';
                    break;
                case K.CF.PromoStatus.PENDING:
                    return '⏳';
                    break;
                case K.CF.PromoStatus.ACCEPTED:
                    return '✔️';
                    break;
                case K.CF.PromoStatus.USEDBEFORE:
                    return '🕙';
                    break;
                case K.CF.PromoStatus.INVALID:
                    return '❌';
                    break;
                case K.CF.PromoStatus.EXPIRED:
                    return '📅';
                    break;
                case K.CF.PromoStatus.UNKNOWNERROR:
                    return '❗';
                    break;
            }
        },
        getHost: function(url, withHttps = false) {
            if (url.includes('//')) {
                url = url.split('//')[1];
            }
            url = url.split('/')[0];
            return withHttps ? ('https://' + url) : url;
        },
        cf: {
            getUrlType: function(url) {
                if (url.endsWith('/free-rolls')) {
                    return K.CF.UrlType.FREEROLLS;
                }
                if (url.split('?')[0].endsWith('/free')) {
                    return K.CF.UrlType.FREE;
                }
                if (url.includes('/promotion/')) {
                    return K.CF.UrlType.PROMOTION;
                }
                if (url.endsWith('/contact-twitter')) {
                    return K.CF.UrlType.CONTACTTWITTER;
                }
                if (url.endsWith('/settings')) {
                    return K.CF.UrlType.SETTINGS;
                }
                if (url.endsWith('/stats')) {
                    return K.CF.UrlType.STATS;
                }
                if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                    if (url == helpers.getHost(url, true)) {
                        return K.CF.UrlType.HOME;
                    }
                }

                return K.CF.UrlType.IGNORE;
            }
        },
        triggerMouseEvent: function (elm, eventType) {
            let clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent (eventType, true, true);
            elm.dispatchEvent (clickEvent);
        },
        alternativeClick: function (elm) {
            helpers.triggerMouseEvent (elm, "mouseover");
            helpers.triggerMouseEvent (elm, "mousedown");
            helpers.triggerMouseEvent (elm, "mouseup");
            helpers.triggerMouseEvent (elm, "click");
        }
    }

    let objectGenerator = {
        createPersistence: function() {
            const prefix = 'autoWeb_';
            function save(key, value, parseIt = false) {
                GM_setValue(prefix + key, parseIt ? JSON.stringify(value) : value);
            };
            function load(key, parseIt = false) {
                let value = GM_getValue(prefix + key);
                if(value && parseIt) {
                    value = JSON.parse(value);
                }
                return value;
            };
            return {
                save: save,
                load: load
            };
        },
        createShared: function() {
            let flowControl;
            let config = {};
            function initializeConfig() {
                // Defaults:
                config['devlog.enabled'] = false;
                config['devlog.maxLines'] = 200;
                // config['defaults.apikey'] = '';
                config['defaults.extraInterval'] = true;
                config['defaults.timeout'] = 4;
                config['defaults.postponeMinutes'] = 65; //0: Random between min and max
                config['defaults.postponeMinutes.min'] = 65;
                config['defaults.postponeMinutes.max'] = 65;
                config['defaults.workInBackground'] = true;
                config['defaults.nextRun.useCountdown'] = true;
                config['defaults.nextRun'] = 60; //0: Random between min and max
                config['defaults.nextRun.min'] = 60;
                config['defaults.nextRun.max'] = 60;
                config['defaults.sleepMode'] = false;
                config['defaults.sleepMode.min'] = "00:00";
                config['defaults.sleepMode.max'] = "01:00";
                config['cf.tryGetCodes'] = false;
                config['cf.rollOnce'] = false;
                config['cf.autologin'] = false;
                config['cf.credentials.mode'] = 1;
                config['cf.credentials.email'] = 'YOUR@EMAIL.com';
                config['cf.credentials.password'] = 'YOURPASSWORD';
                config['cf.sleepHoursIfIpBan'] = 8;
                // config['fb.activateRPBonus'] = true;
                // config['fp.hoursBetweenRuns'] = 6;
                config['fp.maxTimeInMinutes'] = 15;
                config['fp.randomPtcOrder'] = true;
                config['dutchy.useBoosted'] = false;
                config['bk.withdrawMode'] = "0";
                config['bk.hoursBetweenWithdraws'] = 4;
                config['bk.sleepMinutesIfIpBan'] = 75;
                config['bestchange.address'] = '101';
                config['ui.runtime'] = 0;
                config['fpb.credentials.mode'] = 2;
                config['fpb.credentials.username'] = 'YOUR_USERNAME';
                config['fpb.credentials.password'] = 'YOURPASSWORD';
                config['bigbtc.postponeMinutes'] = '0';
                config['fbch.credentials.mode'] = 2;
                config['fbch.credentials.username'] = 'YOUR_USERNAME';
                config['fbch.credentials.password'] = 'YOURPASSWORD';
                config['jtfey.credentials.mode'] = 2;
                config['jtfey.credentials.username'] = 'YOUR_USERNAME';
                config['jtfey.credentials.password'] = 'YOURPASSWORD';
                config['shost.credentials.mode'] = 2;
                config['shost.credentials.username'] = 'YOUR_USERNAME';
                config['shost.credentials.password'] = 'YOURPASSWORD';
                config['ycoin.credentials.mode'] = 2;
                config['ycoin.credentials.username'] = 'YOUR_ACCOUNT_NUMBER';
                config['ycoin.credentials.password'] = 'YOURPASSWORD';
                config['bkclass.coin'] = 'LTC';
                config['bkclass.bcoin'] = 'LTC';
                config['bscads.credentials.mode'] = 2;
                config['bscads.credentials.username'] = 'YOUR_USERNAME';
                config['bscads.credentials.password'] = 'YOURPASSWORD';
                config.migrations = [
                    {version: '00200799', applied: false} // migration to change pcodes status from error to usable due to ui changes
                ];

                let storedData = persistence.load('config', true);
                if(storedData) {
                    for (const prop in config) {
                        if(storedData.hasOwnProperty(prop)) {
                            config[prop] = storedData[prop];
                            // console.log(prop);
                        }
                    }
                }

                config.version = GM_info.script.version;
                // console.log('VERSION:', config.version);
            };
            function getConfig() {
                return config;
            };
            function updateConfig(items) {
                items.forEach( function (item) {
                    config[item.prop] = item.value;
                });
                persistence.save('config', config, true);
            };
            function migrationApplied(migrationVersion) {
                try {
                    let mig = config.migrations.find(x => x.version == migrationVersion);
                    mig.applied = true;
                    persistence.save('config', config, true);
                } catch (err) {
                    console.warn('Error saving migration as applied');
                    console.log(err);
                }
            };
            function devlog(msg, elapsed = false, reset = false) {
                if(!config['devlog.enabled']) {
                    return;
                }

                let log;
                if(reset) {
                    log = [`${helpers.getPrintableTime()}|Log cleared`];
                } else {
                    log = persistence.load('devlog', true);
                    log = log ?? [];
                }

                if(msg) {
                    let previous;
                    try {
                        previous = log[log.length - 1].split('|')[1];
                    } catch {}
                    if(elapsed && (previous == msg)) {
                        log[log.length - 1] = `${helpers.getPrintableTime()}|${msg}|[Elapsed time: ${elapsed} seconds]`;
                    } else {
                        log.push(`${helpers.getPrintableTime()}|${msg}`);
                    }
                }

                if(log.length > 200) {
                    log.splice(0, log.length - 200);
                }

                persistence.save('devlog', log, true);
            };
            function getDevLog() {
                let log;
                log = persistence.load('devlog', true);
                if(log) {
                    return log;
                }
            };
            function isOpenedByManager() {
                loadFlowControl();
                if(!flowControl) {
                    return false;
                }

                shared.devlog(`Visit to: ${flowControl.url}`);
                if (flowControl.type == K.WebType.CBG) {
                    if (window.location.href.includes(flowControl.url) || window.location.href.includes(flowControl.host)) {
                        shared.devlog(`Visit [CBG] returning true`);
                        return true;
                    } else {
                        shared.devlog(`Visit [CBG] returning false`);
                        return false;
                    }
                    // // Ignore if full domain
                    // if(flowControl.host == window.location.host) {
                    //     return false;
                    // }
                } else if (flowControl.host != window.location.host) {
                    return false;
                }

                if(flowControl.opened && flowControl.type != K.WebType.FAUCETPAY && flowControl.type != K.WebType.BAGIKERAN && flowControl.type != K.WebType.CRYPTOSFAUCETS) {
                    return false;
                }
                if(flowControl.type == K.WebType.BAGIKERAN && !window.location.href.includes(flowControl.params.trackUrl)) {
                    return false;
                }

                return true;
            };
            function setFlowControl(id, url, webType, params = null) {
                flowControl = {
                    id: id,
                    changedAt: Date.now(),
                    url: url,
                    host: url.host,
                    type: webType,
                    opened: false,
                    error: false,
                    result: {}
                };
                if(params) {
                    flowControl.params = params;
                }
                saveFlowControl();
            };
            function wasVisited(expectedId) {
                loadFlowControl();
                return flowControl.id == expectedId && flowControl.opened;
            };
            function hasErrors(expectedId) {
                return flowControl.id == expectedId && flowControl.error;
            };
            function getResult() {
                return flowControl.result;
            };
            function getCurrent() {
                return flowControl;
            };
            function saveAndclose(runDetails, delay = 0) {
                markAsVisited(runDetails);
                shared.devlog(`${window.location.href} closing`);
                if(delay) {
                    setTimeout(window.close, delay);
                } else {
                    setTimeout(window.close, 1000);
                }
            };
            function loadFlowControl() {
                flowControl = persistence.load('flowControl', true);
            };
            function saveFlowControl() {
                persistence.save('flowControl', flowControl, true);
            };
            function markAsVisited(runDetails) {
                flowControl.opened = true;
                if (runDetails) {
                    flowControl.result = runDetails
                }
                saveFlowControl();
            };
            function addError(errorType, errorMessage) {
                flowControl.error = true;

                flowControl.result.errorType = errorType;
                flowControl.result.errorMessage = errorMessage;

                saveFlowControl();
            };
            function closeWithError(errorType, errorMessage) {
                addError(errorType, errorMessage);
                shared.devlog(`${window.location.href} closing with error msg`);
                window.close();
            };
            function clearFlowControl() {
                flowControl = {};
                saveFlowControl();
            };
            function clearRetries() {
                loadFlowControl();
                flowControl.retrying = false;
                saveFlowControl();
                return false;
            };
            function isRetrying() {
                if(flowControl.retrying) {
                    return true;
                }
                flowControl.retrying = true;
                saveFlowControl();
                return false;
            };
            function setProp(key, val) {
                flowControl[key] = val;
                saveFlowControl();
            };
            function getProp(key) {
                return flowControl[key];
            };
            initializeConfig();
            return {
                devlog: devlog,
                getDevLog: getDevLog,
                setFlowControl: setFlowControl,
                wasVisited: wasVisited,
                isOpenedByManager: isOpenedByManager,
                saveFlowControl: saveFlowControl,
                getCurrent: getCurrent,
                getResult: getResult,
                addError: addError,
                closeWindow: saveAndclose,
                closeWithError: closeWithError,
                updateWithoutClosing: markAsVisited,
                hasErrors: hasErrors,
                clearFlowControl: clearFlowControl,
                getConfig: getConfig,
                updateConfig: updateConfig,
                clearRetries: clearRetries,
                isRetrying: isRetrying,
                setProp: setProp,
                getProp: getProp,
                migrationApplied: migrationApplied
            };
        },
        createManager: function() {
            const STATUS = {
                INITIALIZING: 0,
                IDLE: 1,
                CLAIMING: 2
            };

            let timestamp = null;
            let timeWaiting = 0;
            let uiUpdatesInterval;
            let getFeedInterval;
            let status = STATUS.INITIALIZING;
            let processTimer;
            let workingTab;

            let webList = [];
            let userWallet = [];
            let groups = [];
            groups.push({
                name: 'Default',
                color: '#fff',
                siteList: [], // ids?
                currentSite: null,
                status: STATUS.INITIALIZING
            });

            const sites = [
                { id: '1', name: 'CF ADA', cmc: '2010', coinRef: 'ADA', url: new URL('https://freecardano.com/free'), rf: '?ref=335463', type: K.WebType.CRYPTOSFAUCETS, clId: 45 },
                { id: '2', name: 'CF BNB', cmc: '1839', coinRef: 'BNB', url: new URL('https://freebinancecoin.com/free'), rf: '?ref=161127', type: K.WebType.CRYPTOSFAUCETS, clId: 42 },
                { id: '3', name: 'CF BTC', cmc: '1', coinRef: 'BTC', url: new URL('https://freebitcoin.io/free'), rf: '?ref=490252', type: K.WebType.CRYPTOSFAUCETS, clId: 40 },
                { id: '4', name: 'CF DASH', cmc: '131', coinRef: 'DASH', url: new URL('https://freedash.io/free'), rf: '?ref=124083', type: K.WebType.CRYPTOSFAUCETS, clId: 156 },
                { id: '5', name: 'CF ETH', cmc: '1027', coinRef: 'ETH', url: new URL('https://freeethereum.com/free'), rf: '?ref=204076', type: K.WebType.CRYPTOSFAUCETS, clId: 44 },
                { id: '6', name: 'CF LINK', cmc: '1975', coinRef: 'LINK', url: new URL('https://freecryptom.com/free'), rf: '?ref=78652', type: K.WebType.CRYPTOSFAUCETS, clId: 157 },
                { id: '7', name: 'CF LTC', cmc: '2', coinRef: 'LTC', url: new URL('https://free-ltc.com/free'), rf: '?ref=117042', type: K.WebType.CRYPTOSFAUCETS, clId: 47 },
                { id: '8', name: 'CF NEO', cmc: '1376', coinRef: 'NEO', url: new URL('https://freeneo.io/free'), rf: '?ref=100529', type: K.WebType.CRYPTOSFAUCETS, clId: 158 },
                { id: '9', name: 'CF STEAM', cmc: '1230', coinRef: 'STEEM', url: new URL('https://freesteam.io/free'), rf: '?ref=117686', type: K.WebType.CRYPTOSFAUCETS, clId: 49 },
                { id: '10', name: 'CF TRX', cmc: '1958', coinRef: 'TRX', url: new URL('https://free-tron.com/free'), rf: '?ref=145047', type: K.WebType.CRYPTOSFAUCETS, clId: 41 },
                { id: '11', name: 'CF USDC', cmc: '3408', coinRef: 'USDC', url: new URL('https://freeusdcoin.com/free'), rf: '?ref=100434', type: K.WebType.CRYPTOSFAUCETS, clId: 51 },
                { id: '12', name: 'CF USDT', cmc: '825', coinRef: 'USDT', url: new URL('https://freetether.com/free'), rf: '?ref=181230', type: K.WebType.CRYPTOSFAUCETS, clId: 43 },
                { id: '13', name: 'CF XEM', cmc: '873', coinRef: 'XEM', url: new URL('https://freenem.com/free'), rf: '?ref=295274', type: K.WebType.CRYPTOSFAUCETS, clId: 46 },
                { id: '14', name: 'CF XRP', cmc: '52', coinRef: 'XRP', url: new URL('https://coinfaucet.io/free'), rf: '?ref=808298', type: K.WebType.CRYPTOSFAUCETS, clId: 48 },
                { id: '15', name: 'StormGain', cmc: '1', url: new URL('https://app.stormgain.com/crypto-miner/'), rf: 'friend/BNS27140552', type: K.WebType.STORMGAIN, clId: 35 },
                { id: '16', name: 'CF DOGE', cmc: '74', coinRef: 'DOGE', url: new URL('https://free-doge.com/free'), rf: '?ref=97166', type: K.WebType.CRYPTOSFAUCETS, clId: 50 },
                { id: '17', name: 'FreeBitco.in', cmc: '1', url: new URL('https://freebitco.in/'), rf: '?r=41092365', type: K.WebType.FREEBITCOIN, clId: 36 },
                { id: '18', name: 'FaucetPay PTC', cmc: '1', url: new URL('https://faucetpay.io/ptc'), rf: '?r=41092365', type: K.WebType.FAUCETPAY, clId: 159 },
                // { id: '19', name: 'Free-Litecoin.com', cmc: '2', url: new URL('https://free-litecoin.com/'), rf: 'login?referer=1332950', type: K.WebType.FREELITECOIN, clId: 160 },
                // { id: '20', name: 'Free-Ethereum.io', cmc: '1027', url: new URL('https://www.free-ethereum.io/'), rf: '?referer=1064662', type: K.WebType.FREEETHEREUMIO, clId: 161 },
                // { id: '21', name: 'Bagi BTC', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://bagi.co.in/bitcoin/'), rf: ['?ref=53706', '?ref=63428', '?ref=54350'], type: K.WebType.BAGIKERAN, clId: 52 },
                // { id: '22', name: 'Bagi BNB', cmc: '1839', wallet: K.WalletType.FP_BNB, url: new URL('https://bagi.co.in/binance/'), rf: ['?ref=12529', '?ref=23852', '?ref=13847'], type: K.WebType.BAGIKERAN, clId: 142  },
                // { id: '23', name: 'Bagi BCH', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://bagi.co.in/bitcoincash/'), rf: ['?ref=44242', '?ref=50185', '?ref=41957'], type: K.WebType.BAGIKERAN, clId: 143 },
                // { id: '24', name: 'Bagi DASH', cmc: '131', wallet: K.WalletType.FP_DASH, url: new URL('https://bagi.co.in/dash/'), rf: ['?ref=32724', '?ref=38540', '?ref=40441'], type: K.WebType.BAGIKERAN, clId: 144 },
                // { id: '25', name: 'Bagi DGB', cmc: '109', wallet: K.WalletType.FP_DGB, url: new URL('https://bagi.co.in/digibyte/'), rf: ['?ref=22664', '?ref=27872', '?ref=29669'], type: K.WebType.BAGIKERAN, clId: 147 },
                // { id: '26', name: 'Bagi DOGE', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://bagi.co.in/dogecoin/'), rf: ['?ref=45047', '?ref=54217', '?ref=45568'], type: K.WebType.BAGIKERAN, clId: 145 },
                // { id: '27', name: 'Bagi ETH', cmc: '1027', wallet: K.WalletType.FP_ETH, url: new URL('https://bagi.co.in/ethereum/'), rf: ['?ref=24486', '?ref=27799', '?ref=24847'], type: K.WebType.BAGIKERAN, clId: 152 },
                // { id: '28', name: 'Bagi FEY', cmc: '10361', wallet: K.WalletType.FP_FEY, url: new URL('https://bagi.co.in/feyorra/'), rf: ['?ref=5049', '?ref=7433', '?ref=5318'], type: K.WebType.BAGIKERAN, clId: 153 },
                // { id: '29', name: 'Bagi LTC', cmc: '2', wallet: K.WalletType.FP_LTC, url: new URL('https://bagi.co.in/litecoin/'), rf: ['?ref=48335', '?ref=57196', '?ref=48878'], type: K.WebType.BAGIKERAN, clId: 146 },
                // { id: '30', name: 'Bagi TRX', cmc: '1958', wallet: K.WalletType.FP_TRX, url: new URL('https://bagi.co.in/tron/'), rf: ['?ref=22622', '?ref=31272', '?ref=23075'], type: K.WebType.BAGIKERAN, clId: 150 },
                // { id: '31', name: 'Bagi USDT', cmc: '825', wallet: K.WalletType.FP_USDT, url: new URL('https://bagi.co.in/tether/'), rf: ['?ref=25462', '?ref=32491', '?ref=25981'], type: K.WebType.BAGIKERAN, clId: 151 },
                // { id: '32', name: 'Bagi ZEC', cmc: '1437', wallet: K.WalletType.FP_ZEC, url: new URL('https://bagi.co.in/zcash/'), rf: ['?ref=9181', '?ref=15120', '?ref=9878'], type: K.WebType.BAGIKERAN, clId: 148 },
                // { id: '33', name: 'Keran BTC', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://keran.co/BTC/'), rf: ['?ref=73729', '?ref=92353', '?ref=79321'], type: K.WebType.BAGIKERAN, clId: 53 },
                // { id: '34', name: 'Keran BNB', cmc: '1839', wallet: K.WalletType.FP_BNB, url: new URL('https://keran.co/BNB/'), rf: ['?ref=19287', '?ref=31242', '?ref=20659'], type: K.WebType.BAGIKERAN, clId: 54 },
                // { id: '35', name: 'Keran BCH', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://keran.co/BCH/'), rf: ['?ref=58232', '?ref=67326', '?ref=70759'], type: K.WebType.BAGIKERAN, clId: 30 },
                // { id: '36', name: 'Keran DASH', cmc: '131', wallet: K.WalletType.FP_DASH, url: new URL('https://keran.co/DASH/'), rf: ['?ref=45229', '?ref=53041', '?ref=55716'], type: K.WebType.BAGIKERAN, clId: 127 },
                // { id: '37', name: 'Keran DGB', cmc: '109', wallet: K.WalletType.FP_DGB, url: new URL('https://keran.co/DGB/'), rf: ['?ref=32788', '?ref=39527', '?ref=42014'], type: K.WebType.BAGIKERAN, clId: 129 },
                // { id: '38', name: 'Keran DOGE', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://keran.co/DOGE/'), rf: ['?ref=73512', '?ref=85779', '?ref=89613'], type: K.WebType.BAGIKERAN, clId: 128 },
                // { id: '39', name: 'Keran ETH', cmc: '1027', wallet: K.WalletType.FP_ETH, url: new URL('https://keran.co/ETH/'), rf: ['?ref=32226', '?ref=36427', '?ref=32676'], type: K.WebType.BAGIKERAN, clId: 37 },
                // { id: '40', name: 'Keran FEY', cmc: '10361', wallet: K.WalletType.FP_FEY, url: new URL('https://keran.co/FEY/'), rf: ['?ref=6269', '?ref=9019', '?ref=6569'], type: K.WebType.BAGIKERAN, clId: 133 },
                // { id: '41', name: 'Keran LTC', cmc: '2', wallet: K.WalletType.FP_LTC, url: new URL('https://keran.co/LTC/'), rf: ['?ref=69102', '?ref=80726', '?ref=84722'], type: K.WebType.BAGIKERAN, clId: 29 },
                // { id: '42', name: 'Keran TRX', cmc: '1958', wallet: K.WalletType.FP_TRX, url: new URL('https://keran.co/TRX/'), rf: ['?ref=49686', '?ref=46544', '?ref=34485'], type: K.WebType.BAGIKERAN, clId: 162 },
                // { id: '43', name: 'Keran USDT', cmc: '825', wallet: K.WalletType.FP_USDT, url: new URL('https://keran.co/USDT/'), rf: ['?ref=40582', '?ref=48907', '?ref=41009'], type: K.WebType.BAGIKERAN, clId: 132 },
                // { id: '44', name: 'Keran ZEC', cmc: '1437', wallet: K.WalletType.FP_ZEC, url: new URL('https://keran.co/ZEC/'), rf: ['?ref=', '?ref=18976', '?ref=12487'], type: K.WebType.BAGIKERAN, clId: 130 },
                // { id: '45', name: 'OK Btc', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://btc-ok.net/'), rf: 'index.php?r=1QCD6cWJNVH4Cdnz85SQ2qtTkAwGr9fvUk', type: K.WebType.OKFAUCET },
                // { id: '46', name: 'OK Dash', cmc: '131', wallet: K.WalletType.FP_DASH, url: new URL('https://dash-ok.net/'), rf: 'index.php?r=Xbyi7Fk2NRmZ32SHpDhmpGHLa4NMokhmGR', type: K.WebType.OKFAUCET },
                // { id: '47', name: 'OK Dgb', cmc: '109', wallet: K.WalletType.FP_DGB, url: new URL('https://dgb-ok.net/'), rf: 'index.php?r=DSM93hgZuapnjeeDMe8spzwG9rMrw4sdua', type: K.WebType.OKFAUCET },
                // { id: '48', name: 'OK Doge', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://doge-ok.net/'), rf: 'index.php?r=DDaQWmD7vY1NhtK1M5Pno7sdccmgxNUfv1', type: K.WebType.OKFAUCET },
                // { id: '49', name: 'OK Eth', cmc: '1027', wallet: K.WalletType.FP_ETH, url: new URL('https://eth-ok.net/'), rf: 'index.php?r=0x7636f64a8241257b1edaf65ae943c66de87b1749', type: K.WebType.OKFAUCET },
                // { id: '50', name: 'OK Ltc', cmc: '2', wallet: K.WalletType.FP_LTC, url: new URL('https://ltc-ok.net/'), rf: 'index.php?r=MEmxLqYzZdMsEswUQkqL5aawT5UsqYwYgr', type: K.WebType.OKFAUCET },
                // { id: '51', name: 'OK Trx', cmc: '1958', wallet: K.WalletType.FP_TRX, url: new URL('https://trx-ok.net/'), rf: 'index.php?r=TSocuzJ6ADUoQ49v28BXN2jo3By6awwHvj', type: K.WebType.OKFAUCET },
                { id: '52', name: 'BigBtc', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://bigbtc.win/'), rf: '?id=39255652', type: K.WebType.BIGBTC, clId: 200 },
                { id: '53', name: 'BestChange', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://www.bestchange.com/'), rf: ['index.php?nt=bonus&p=1QCD6cWJNVH4Cdnz85SQ2qtTkAwGr9fvUk'], type: K.WebType.BESTCHANGE, clId: 163 },
                // { id: '54', name: 'Litking.biz', cmc: '2', url: new URL('https://litking.biz/'), rf: 'signup?r=159189', type: K.WebType.KINGBIZ, clId: 164 },
                // { id: '55', name: 'Bitking.biz', cmc: '1', url: new URL('https://bitking.biz/'), rf: 'signup?r=90003', type: K.WebType.KINGBIZ, clId: 165 },
                // { id: '56', name: 'OK Bch', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://faucetok.net/bch/'), rf: '?r=qz742nf2c30ktehlmn0pg6quqe8yuwp3evd75y8c0k', type: K.WebType.OKFAUCET }
                // { id: '57', name: 'OurBitco.in', cmc: '1', url: new URL('https://ourbitco.in/dashboard'), rf: '?r=gebcjvwpky', type: K.WebType.OURBITCOIN },
                { id: '58', name: 'BetFury BTC', cmc: '1', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BETFURYBOX, clId: 1 },
                { id: '59', name: 'BetFury BNB', cmc: '1839', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BETFURYBOX, clId: 1 },
                // { id: '60', name: 'Free-Doge.io', cmc: '74', url: new URL('https://www.free-doge.io/'), rf: '?referer=6695', type: K.WebType.FREEDOGEIO, clId: 166 },
                { id: '61', name: 'Dutchy', cmc: '-1', url: new URL('https://autofaucet.dutchycorp.space/roll.php'), rf: '?r=corecrafting', type: K.WebType.DUTCHYROLL, clId: 141 },
                { id: '62', name: 'Dutchy Monthly Coin', cmc: '-1', url: new URL('https://autofaucet.dutchycorp.space/coin_roll.php'), rf: '?r=corecrafting', type: K.WebType.DUTCHYROLL, clId: 141 },
                // { id: '63', name: 'Express', cmc: '-1', url: new URL('https://express.dutchycorp.space/roll.php'), rf: '?r=EC-UserId-428378', type: K.WebType.DUTCHYROLL },
                // { id: '64', name: 'Express Monthly Coin', cmc: '-1', url: new URL('https://express.dutchycorp.space/coin_roll.php'), rf: '?r=EC-UserId-428378', type: K.WebType.DUTCHYROLL },
                { id: '65', name: 'FCrypto Roll', cmc: '-1', url: new URL('https://faucetcrypto.com/dashboard'), rf: 'ref/704060', type: K.WebType.FCRYPTO, clId: 27 },
                // WIP { id: '66', name: 'CPU', cmc: '-1', url: new URL('https://www.coinpayu.com/dashboard'), rf: '?r=corecrafting', type: K.WebType.CPU },
                { id: '67', name: 'BetFury BFG', cmc: '11038', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BETFURYBOX, clId: 1 },
                { id: '68', name: 'CF SHIBA', cmc: '5994', coinRef: 'SHIBA', url: new URL('https://freeshibainu.com/free'), rf: '?ref=18226', type: K.WebType.CRYPTOSFAUCETS, clId: 167 },
                // { id: '69', name: 'Bagi SOL', cmc: '5426', wallet: K.WalletType.FP_SOL, url: new URL('https://bagi.co.in/solana/'), rf: ['?ref=2838'], type: K.WebType.BAGIKERAN, clId: 149 },
                // { id: '70', name: 'Keran SOL', cmc: '5426', wallet: K.WalletType.FP_SOL, url: new URL('https://keran.co/SOL/'), rf: ['?ref=4249'], type: K.WebType.BAGIKERAN, clId: 131 },
                // { id: '71', name: 'CBG Doge', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://cryptobaggiver.com/dogecoin-faucet/'), rf: ['?r=D8Xgghu5gCryukwmxidFpSmw8aAKon2mEQ'], type: K.WebType.CBG, clId: 110 },
                // { id: '72', name: 'CBG Eth', cmc: '1027', wallet: K.WalletType.FP_ETH, url: new URL('https://cryptobaggiver.com/ethereum-faucet/'), rf: ['?r=0xC21FD989118b8C0Db6Ac2eC944B53C09F7293CC8'], type: K.WebType.CBG, clId: 111 },
                // { id: '73', name: 'CBG Ltc', cmc: '2', wallet: K.WalletType.FP_LTC, url: new URL('https://cryptobaggiver.com/litecoin-faucet/'), rf: ['?r=MWSsGAQTYD7GH5o4oAehC8Et5PyMBfhnKK'], type: K.WebType.CBG, clId: 114 },
                // { id: '74', name: 'CBG Bch', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://cryptobaggiver.com/bitcoin-cash-faucet/'), rf: ['?r=qq2qlpzs4rsn30utrumezpkzezpteqj92ykdgfeq5u'], type: K.WebType.CBG, clId: 112 },
                // { id: '75', name: 'CBG Dgb', cmc: '109', wallet: K.WalletType.FP_DGB, url: new URL('https://cryptobaggiver.com/digibyte-faucet/'), rf: ['?r=DTn8mnXo655wdS78u2qSHHcqaiP5Z8Ewro'], type: K.WebType.CBG, clId: 113 },
                // { id: '76', name: 'CBG Dash', cmc: '131', wallet: K.WalletType.FP_DASH, url: new URL('https://cryptobaggiver.com/dash-faucet/'), rf: ['?r=XfYJ3XmbCHA1HcCFb5Qnyiq5YFFGVZYZv6'], type: K.WebType.CBG, clId: 115 },
                { id: '77', name: 'FPig', cmc: '825', wallet: K.WalletType.FP_USDT, url: new URL('https://faupig-bit.online/page/dashboard'), rf: [''], type: K.WebType.FPB, clId: 154 },
                { id: '78', name: 'CF Cake', cmc: '7186', coinRef: 'CAKE', url: new URL('https://freepancake.com/free'), rf: '?ref=699', type: K.WebType.CRYPTOSFAUCETS, clId: 197 },
                { id: '79', name: 'GetFreeTRX', cmc: '1958', wallet: K.WalletType.FP_TRX, url: new URL('https://getfreetrx.com/'), rf: '?r=TK3ofbD3AyXotN2111UvnwCzr2YaW8Qmx7', type: K.WebType.G8, clId: 201 },
                { id: '80', name: 'FreeGRC', cmc: '833', url: new URL('https://freegridco.in/#free_roll'), rf: '', type: K.WebType.FREEGRC, clId: 207 },
                { id: '81', name: 'CF Matic', cmc: '3890', coinRef: 'MATIC', url: new URL('https://freematic.com/free'), rf: '?ref=6435', type: K.WebType.CRYPTOSFAUCETS, clId: 210 },
                // { id: '82', name: 'Heli', cmc: '-1', url: new URL('https://helidrops.io/coins.php'), rf: 'OLPUAO', type: K.WebType.HELI, clId: 211 },
                // { id: '83', name: 'FreeBCH', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://freebch.fun/page/dashboard'), rf: ['?r=satology'], type: K.WebType.FPB, clId: 212 },
                { id: '84', name: 'JTFey', cmc: '-1', url: new URL('https://james-trussy.com/faucet'), rf: ['?r=corecrafting'], type: K.WebType.VIE, clId: 213 },
                { id: '85', name: 'O24', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://www.only1024.com/f'), rf: ['?r=1QCD6cWJNVH4Cdnz85SQ2qtTkAwGr9fvUk'], type: K.WebType.O24, clId: 97 },
                { id: '86', name: 'BF BABY', cmc: '10334', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BETFURYBOX, clId: 1 },
                { id: '87', name: 'CF BTT', cmc: '16086', coinRef: 'BTT', url: new URL('https://freebittorrent.com/free'), rf: '?ref=2050', type: K.WebType.CRYPTOSFAUCETS, clId: 218 },
                { id: '88', name: 'BF BSW', cmc: '10746', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BETFURYBOX, clId: 1 },
                { id: '89', name: 'CF BFG', cmc: '11038', coinRef: 'BFG', url: new URL('https://freebfg.com/free'), rf: '?ref=117', type: K.WebType.CRYPTOSFAUCETS, clId: 219 },
                // { id: '90', name: 'Keran.co', cmc: '-1', wallet: K.WalletType.FP_MAIL, url: new URL('https://keran.co/'), rf: ['?ref=91'], type: K.WebType.BAGIKERAN, clId: 220 },
                // { id: '91', name: 'Bagi.co.in', cmc: '-1', wallet: K.WalletType.FP_MAIL, url: new URL('https://bagi.co.in/'), rf: ['?ref=64'], type: K.WebType.BAGIKERAN, clId: 221 },
                // { id: '92', name: 'SatoHost', cmc: '825', wallet: K.WalletType.FP_USDT, url: new URL('http://sato.host/page/dashboard'), rf: ['?r=corecrafting'], type: K.WebType.FPB, clId: 233 },
                { id: '93', name: 'YCoin', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://yescoiner.com/faucet'), rf: ['?ref=4729452'], type: K.WebType.YCOIN, clId: 234 },
                { id: '94', name: 'CDiversity', cmc: '-1', wallet: K.WalletType.FP_MAIL, url: new URL('http://coindiversity.io/free-coins'), rf: ['?r=1J3sLBZAvY5Vk9x4RY2qSFyL7UHUszJ4DJ'], type: K.WebType.CDIVERSITY, clId: 235 },
                { id: '95', name: 'BscAds', cmc: '1839', url: new URL('https://bscads.com/'), rf: ['ref/corecrafting'], type: K.WebType.BSCADS, clId: 226 }
            ];

            const wallet = [
                { id: '100', name: 'FaucetPay Email', type: K.WalletType.FP_MAIL },
                { id: '101', name: 'FaucetPay BTC (Bitcoin)', type: K.WalletType.FP_BTC },
                { id: '102', name: 'FaucetPay BNB (Binance Coin)', type: K.WalletType.FP_BNB },
                { id: '103', name: 'FaucetPay BCH (Bitcoin Cash)', type: K.WalletType.FP_BCH },
                { id: '104', name: 'FaucetPay DASH (Dash)', type: K.WalletType.FP_DASH },
                { id: '105', name: 'FaucetPay DGB (DigiByte)', type: K.WalletType.FP_DGB },
                { id: '106', name: 'FaucetPay DOGE (Dogecoin)', type: K.WalletType.FP_DOGE },
                { id: '107', name: 'FaucetPay ETH (Ethereum)', type: K.WalletType.FP_ETH },
                { id: '108', name: 'FaucetPay FEY (Feyorra)', type: K.WalletType.FP_FEY },
                { id: '109', name: 'FaucetPay LTC (Litecoin)', type: K.WalletType.FP_LTC },
                { id: '110', name: 'FaucetPay TRX (Tron)', type: K.WalletType.FP_TRX },
                { id: '111', name: 'FaucetPay USDT (Tether TRC20)', type: K.WalletType.FP_USDT },
                { id: '112', name: 'FaucetPay ZEC (Zcash)', type: K.WalletType.FP_ZEC },
                { id: '113', name: 'FaucetPay SOL (Solana)', type: K.WalletType.FP_SOL },
                { id: '200', name: 'ExpressCrypto (EC-UserId-XXXXXX)', type: K.WalletType.EC },
                { id: '1', name: 'BTC Alternative Address', type: K.WalletType.BTC }
                //                { id: '2', name: 'LTC Address', type: K.WalletType.LTC }
            ];

            async function start() {
                await loader.initialize();
                ui.init(getCFlist());
                update();
                ui.refresh(null, null, userWallet);
                uiUpdatesInterval = setInterval(readUpdateValues, 10000);
                processTimer = setTimeout(manager.process, 2000);
                getFeedInterval = setInterval(getCodesFeed, 25000);
            };

            let loader = function() {
                async function initialize() {
                    setTimestamp();
                    await initializeWebList();
                    initializeUserWallet();
                    initializePromotions();
                    initializeHistory();
                };
                async function initializeWebList() {
                    await addSites();
                    addStoredSitesData();
                    // splitInSchedules();
                };
                async function addSites() {
                    sites.forEach(x => webList.push(x));
                    // Set some defaults
                    webList.forEach(function (element, idx, arr) {
                        arr[idx].enabled = false;
                        arr[idx].lastClaim = 0;
                        arr[idx].aggregate = 0;
                        arr[idx].balance = 0;
                        arr[idx].stats = {};
                        arr[idx].nextRoll = null;
                        arr[idx].params = {};
                        arr[idx].firstRun = true;
                        arr[idx].schedule = '#4a70e0';
                        // arr[idx].credentials = {
                        //     mode: -1, // need: not implemented, off, useCredentials, useThirdParty
                        //     username: '',
                        //     password: ''
                        // };

                        // TODO: review
                        if(arr[idx].type == K.WebType.BAGIKERAN) {
                            arr[idx].lastWithdraw = new Date();
                        }

                        if (element.id == '17') { //17: FB.in
                            arr[idx].params['custom.useWofRp'] = 0;
                            arr[idx].params['custom.useFunRp'] = 0;
                        }

                        if (element.id == '15') { //15: SG
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = true;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 15;
                            arr[idx].params['defaults.nextRun.max'] = 20;
                        }
                        if (element.id == '18') { //18: FPPTC
                            arr[idx].params['defaults.workInBackground.override'] = true;
                            arr[idx].params['defaults.workInBackground'] = false;
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 300;
                            arr[idx].params['defaults.nextRun.max'] = 360;
                        }
                        if (element.id == '52') { //52: BigBtc
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 15;
                            arr[idx].params['defaults.nextRun.max'] = 40;
                        }
                        if (element.id == '57') { //57: OB
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 15;
                            arr[idx].params['defaults.nextRun.max'] = 18;
                        }
                        if (element.id == '58' || element.id == '59' || element.id == '67' || element.id == '86' || element.id == '88') { //58, 59: BetFury x2 + 67: BFG
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 21;
                            arr[idx].params['defaults.nextRun.max'] = 25;
                        }
                        if (element.id == '61' || element.id == '62') { //61, 62: Dutchy x2
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = true;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 30;
                            arr[idx].params['defaults.nextRun.max'] = 35;
                        }
                        if (element.id == '65') { //65: FCrypto
                            arr[idx].params['defaults.workInBackground.override'] = true;
                            arr[idx].params['defaults.workInBackground'] = false;
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 26;
                            arr[idx].params['defaults.nextRun.max'] = 35;
                            arr[idx].params['defaults.timeout.override'] = true;
                            arr[idx].params['defaults.timeout'] = 3;
                            arr[idx].params['defaults.postponeMinutes.override'] = true;
                            arr[idx].params['defaults.postponeMinutes'] = 0;
                            arr[idx].params['defaults.postponeMinutes.min'] = 12;
                            arr[idx].params['defaults.postponeMinutes.max'] = 18;
                        }
                        // if (element.id == '71' || element.id == '72' || element.id == '73' || element.id == '74' || element.id == '75' || element.id == '76') {
                        //     arr[idx].params['defaults.nextRun.override'] = true;
                        //     arr[idx].params['defaults.nextRun.useCountdown'] = false;
                        //     arr[idx].params['defaults.nextRun'] = 0;
                        //     arr[idx].params['defaults.nextRun.min'] = 9;
                        //     arr[idx].params['defaults.nextRun.max'] = 22;
                        // }
                        if (element.id == '77') { //77: FPB
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 5;
                            arr[idx].params['defaults.nextRun.max'] = 90;
                        }
                        if (element.id == '83') { //FreeBCH
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 5;
                            arr[idx].params['defaults.nextRun.max'] = 35;
                        }
                        if (element.id == '84') { //JT
                            arr[idx].params['defaults.nextRun.override'] = true;
                            arr[idx].params['defaults.nextRun.useCountdown'] = false;
                            arr[idx].params['defaults.nextRun'] = 0;
                            arr[idx].params['defaults.nextRun.min'] = 22;
                            arr[idx].params['defaults.nextRun.max'] = 45;
                        }
                    });
                };
                function addStoredSitesData() {
                    let storedData = persistence.load('webList', true);
                    if(storedData) {
                        storedData.forEach( function (element) {
                            let idx = webList.findIndex(x => x.id == element.id);
                            if(idx != -1) {
                                webList[idx].name = element.name ?? webList[idx].name;
                                webList[idx].lastClaim = element.lastClaim ?? webList[idx].lastClaim;
                                webList[idx].aggregate = element.aggregate ?? webList[idx].aggregate;
                                webList[idx].balance = element.balance ?? webList[idx].balance;
                                webList[idx].stats = element.stats ?? webList[idx].stats;
                                webList[idx].enabled = element.enabled ?? webList[idx].enabled;
                                webList[idx].schedule = element.schedule ?? webList[idx].schedule;

                                if(!webList[idx].enabled) {
                                    webList[idx].nextRoll = null;
                                } else {
                                    webList[idx].nextRoll = element.nextRoll ? new Date(element.nextRoll) : new Date();
                                }

                                if(element.lastWithdraw) {
                                    webList[idx].lastWithdraw = new Date(element.lastWithdraw);
                                }
                                if(element.params) {
                                    for (var p in element.params) {
                                        webList[idx].params[p] = element.params[p];
                                    }
                                }
                                webList[idx].firstRun = element.firstRun ?? webList[idx].firstRun;
                                if(webList[idx].aggregate != 0 || webList[idx].balance != 0) {
                                    webList[idx].firstRun = false;
                                }
                                // webList[idx].params = element.params ?? webList[idx].params;
                            }
                        });
                    } else {
                        // webList.shuffle();
                    }
                };
                function splitInSchedules() {
                    let schedules = [];

                    webList.forEach((x, idx, elm) => {
                        if (x.type == 1) {
                            x.schedule = '#a0a0a0';
                        }
                        if(!schedules[x.schedule]) {
                            schedules[x.schedule] = []
                        };

                        schedules[x.schedule].push(elm);
                    });

                };
                function initializeUserWallet() {
                    addWallets();
                    addStoredWalletData();
                };
                function addWallets() {
                    wallet.forEach(x => userWallet.push(x));
                    userWallet.forEach(function (element, idx, arr) {
                        arr[idx].address = '';
                    });
                };
                function addStoredWalletData() {
                    let storedData = persistence.load('userWallet', true);
                    if(storedData) {
                        storedData.forEach( function (element) {
                            let idx = userWallet.findIndex(x => x.id == element.id);
                            if(idx != -1) {
                                userWallet[idx].address = element.address ?? webList[idx].address;
                            }
                        });
                    }
                };
                function initializePromotions() {
                    let storedData = persistence.load('CFPromotions', true);
                    if (storedData) {
                        let mig00200799 = false;
                        // check if we need this migration
                        try {
                            mig00200799 = shared.getConfig().migrations.find(x => x.version == '00200799' && !x.applied);
                        } catch (err) {}
                        console.log(`Migration 00200799: ${mig00200799 ? 'APPLYING' : 'previously applied or not needed'}`);

                        let allCFs = manager.getFaucetsForPromotion().map( cf => cf.id );
                        storedData.forEach( function (element, idx, arr) {
                            arr[idx].added = new Date(element.added);
                            arr[idx].statusPerFaucet.forEach( function (el, i, a) {
                                a[i].execTimeStamp = (el.execTimeStamp != null) ? new Date(el.execTimeStamp) : null;
                                if (mig00200799 && el.status == 4) {
                                    a[i].status = 1;
                                }
                            });
                            // Add new CFs
                            allCFs.forEach( function (cf) {
                                if (!arr[idx].statusPerFaucet.find( x => x.id == cf )) {
                                    let newCf = { id: cf, status: 1, execTimeStamp: null };
                                    arr[idx].statusPerFaucet.push(newCf);
                                }
                            });
                        });
                        // save migration 00200799 as applied
                        if (mig00200799) {
                            shared.migrationApplied('00200799');
                        }
                        CFPromotions.load(storedData);
                    }
                };
                function initializeHistory() {
                    CFHistory.initOrLoad();
                };
                function setTimestamp() {
                    timestamp = Date.now();
                    persistence.save('timestamp', timestamp);
                };
                function removeDisabledFaucets() {
                    webList = webList.filter(x => x.enabled);
                };
                return {
                    initialize: initialize
                };
            }();
            function getCodesFeed(force = false) {
                console.log('@getCodesFeed');
                clearInterval(getFeedInterval);
                if (!force) {
                    let tryGet = shared.getConfig()['cf.tryGetCodes'] || false;
                    if (!tryGet) {
                        console.log('feed interval cleared');
                        return;
                    }
                }
                // let key = shared.getConfig()['defaults.apikey'];
                // if (!key || key == '') {
                //     console.log('Api key looks invalid');
                // }
                let nextFeed = helpers.randomMs(2 * 60 * 60 * 1000, 4 * 60 * 60 * 1000);
                getFeedInterval = setInterval(getCodesFeed, nextFeed)

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://criptologico.com/api/?key=XI2HV-1P9PQ-W637F-68B9B-A248&requests[cf_codes]",
                    timeout: 10000,
                    onload: function(response) {
                        try {
                            let txt = response.responseText;
                            let parsed = JSON.parse(txt);
                            if (parsed.success) {
                                let newCodes = [];
                                for(let i = 0; i < parsed.cf_codes.length; i++) {
                                    let item = parsed.cf_codes[i];
                                    let newCode = {};
                                    newCode.code = item.code;
                                    newCode.oneTimeOnly = item.is_one_time == '1';
                                    newCode.expirationDate = item.expiration_date.replace(' ', 'T') + 'Z';
                                    newCode.expirationDate = new Date(newCode.expirationDate);
                                    newCodes.push(newCode);
                                }
                                CFPromotions.includeNewCodes(newCodes);
                                ui.refresh(null, CFPromotions.getAll());
                            }
                        } catch(err) {
                            console.log('unexpected error parsing codes list');
                            console.log(err);
                        }
                    },
                    onerror: function(e) {
                        console.log('error getting codes');
                        console.log(e);
                    },
                    ontimeout: function() {
                        console.log('timeout getting codes');
                    },
                });
            }
            function readUpdateValues(forceCheck = false) {
                readPromoCodeValues();
                readModalData();

                if(groups[0].status == STATUS.IDLE || forceCheck) {
                    let updateDataElement = document.getElementById('update-data');
                    let updateValues = updateDataElement.innerText.clean();

                    if (updateValues != '') {
                        updateDataElement.innerText = '';
                        let updateObj = JSON.parse(updateValues);
                        if(updateObj.runAsap.changed) {
                            updateObj.runAsap.ids.forEach(function (element, idx, arr) {
                                try {
                                    let itemIndex = webList.findIndex(x => x.id == element)
                                    webList[itemIndex].enabled = true;
                                    webList[itemIndex].nextRoll = new Date(754000 + idx);
                                    ui.log(`${webList[itemIndex].name} updated to run ASAP`);
                                } catch (err) {
                                    ui.log(`Error setting faucet to run ASAP: ${err}`);
                                }
                            });
                        }
                        if(updateObj.editSingle.changed) {
                            updateObj.editSingle.items.forEach(function (element, idx, arr) {
                                try {
                                    let itemIndex = webList.findIndex(x => x.id == element.id);
                                    webList[itemIndex].name = element.displayName;

                                    if (webList[itemIndex].enabled != element.enabled) {
                                        webList[itemIndex].enabled = element.enabled;
                                        if(webList[itemIndex].enabled) {
                                            webList[itemIndex].nextRoll = new Date(idx);
                                        } else {
                                            webList[itemIndex].nextRoll = null;
                                        }
                                    }
                                    ui.log(`Faucet updated. New name: ${element.displayName}. Active: ${element.enabled}`);
                                } catch (err) {
                                    ui.log(`Error updating faucet data: ${err}`);
                                }
                            });
                        }

                        if(updateObj.wallet.changed) {
                            updateObj.wallet.items.forEach(function (element) {
                                try {
                                    let itemIndex = userWallet.findIndex(x => x.id == element.id);
                                    userWallet[itemIndex].address = element.address;

                                    ui.log(`Wallet Address updated [${userWallet[itemIndex].name}]: ${userWallet[itemIndex].address}`);
                                } catch (err) {
                                    ui.log(`Error updating wallet/address: ${err}`);
                                }
                            });

                            ui.refresh(null, null, userWallet);
                            saveUserWallet();
                        }

                        if(updateObj.config.changed) {
                            try {
                                shared.updateConfig(updateObj.config.items);
                                ui.log(`Config updated. Reloading in a few seconds...`);
                                window.location.reload();
                                return;
                            } catch (err) {
                                ui.log(`Error updating config: ${err}`);
                            }

                        }

                        if(updateObj.site.changed) {
                            // console.log(JSON.stringify(updateObj));
                            updateObj.site.list.forEach( (x) => {
                                try {
                                    updateSite(x.id, x.items);
                                } catch (err) {
                                    ui.log(`Error updating site: ${err}`);
                                }
                            });
                        }

                        if(updateObj.runAsap.changed || updateObj.editSingle.changed || updateObj.site.changed) {
                            update(true);
                            process();
                            return;
                        }
                    }
                }
                if(forceCheck) {
                    process();
                }
            };
            function updateSite(id, items) {
                let idx = webList.findIndex(x => x.id == id);
                if (idx > -1) {
                    webList[idx].params = webList[idx].params || {};
                    items.forEach( (item) => {
                        webList[idx].params[item.prop] = item.value;
                    });
                    ui.log(`Site ${webList[idx].name} updated`);
                }
            }
            function readModalData() {
                if(document.getElementById('modal-spinner').isVisible()) {
                    let targetObject = JSON.parse(document.getElementById('target-spinner').innerHTML);
                    let target = targetObject.id;
                    if (target == 'modal-ereport') {
                        let temp = shared.getDevLog();
                        document.getElementById('log-textarea').value = temp.join('\n');
                    } else if (target == 'modal-config') {
                        ui.refresh(null, null, null, shared.getConfig());
                    } else if (target == 'modal-site') {
                        let site = webList.find(x => x.id == targetObject.siteId);
                        ui.refresh(null, null, null, null, { site: site, config: shared.getConfig() });
                    }
                    document.getElementById('modal-spinner').classList.toggle('d-none');
                    document.getElementById(target).classList.toggle('d-none');
                    document.getElementById('target-spinner').innerHTML = '';
                }
            }
            function update(sortIt = true) {
                // let updateRollStats = groups[0].currentSite && groups[0].currentSite.type == K.WebType.CRYPTOSFAUCETS;
                if(sortIt) {
                    webList.sort( function(a,b) {
                        if (a === b) {
                            return 0;
                        } else if (a.nextRoll === null && b.nextRoll === null) {
                            return a.id > b.id ? -1 : 1
                        } else if (a.nextRoll === null) {
                            return 1;
                        } else if (b.nextRoll === null) {
                            return -1;
                        } else {
                            return a.nextRoll.getTime() < b.nextRoll.getTime() ? -1 : 1;
                        }
                    });
                    groups[0].currentSite = webList[0];
                }

                saveWebList();
                ui.refresh(webList, CFPromotions.getAll());
                updateRollStatsSpan();
            };
            function saveWebList() {
                const data = webList.map(function(x) {
                    let ret = {
                        id: x.id,
                        name: x.name,
                        lastClaim: x.lastClaim,
                        aggregate: x.aggregate,
                        balance: x.balance,
                        stats: x.stats,
                        nextRoll: x.nextRoll,
                        enabled: x.enabled,
                        params: x.params
                    };

                    if (x.lastWithdraw) {
                        ret.lastWithdraw = x.lastWithdraw;
                    }

                    return ret;
                });

                persistence.save('webList', data, true);
            }
            function saveUserWallet() {
                const data = userWallet.map(x => {
                    return {
                        id: x.id,
                        address: x.address
                    };});

                persistence.save('userWallet', data, true);
            }
            function process() {
                if(isObsolete()) {
                    return;
                }
                timer.stopCheck();
                if(groups[0].currentSite.nextRoll == null) {
                    ui.log(`All faucets are disabled. Click edit and select those you want to run, or just hit the 'Run ASAP' link at the Actions column...`);
                    clearTimeout(processTimer);
                    groups[0].status = STATUS.IDLE;
                    return;
                }

                if(groups[0].currentSite.nextRoll.getTime() < Date.now()) {
                    ui.log(`Opening ${groups[0].currentSite.name}`);
                    clearTimeout(processTimer);
                    groups[0].status = STATUS.CLAIMING;
                    open();
                } else {
                    let timeUntilNext = groups[0].currentSite.nextRoll.getTime() - Date.now() + helpers.randomMs(1000, 2000);

                    // PROCESSING AGAIN LAST 'FORCE CLOSED' IN CASE WE HAVE A WINDOW OF TIME (MORE THAN TIMEOUT/2):
                    if (timeUntilNext > (shared.getConfig()['defaults.timeout'] * 60 * 1000 / 2)) {
                        let idx = -1;
                        for (let i = webList.length - 1; i >= 0; i--) {
                            if (webList[i].enabled && webList[i].stats && webList[i].stats.errors && webList[i].stats.errors.errorType == K.ErrorType.FORCE_CLOSED) {
                                idx = i;
                                break;
                            }
                        }
                        if (idx > -1) {
                            webList[idx].nextRoll = new Date(-20);
                            update(true);
                            process();
                            return;
                        }
                    }

                    ui.log(`Waiting ${(timeUntilNext/1000/60).toFixed(2)} minutes...`);
                    clearTimeout(processTimer);
                    processTimer = setTimeout(manager.process, timeUntilNext);
                    groups[0].status = STATUS.IDLE;
                }
            };
            function isObsolete() {
                let savedTimestamp = persistence.load('timestamp');
                if (savedTimestamp && savedTimestamp > timestamp) {
                    ui.log('<b>STOPING EXECUTION!<b> A new Manager UI window was opened. Process should continue there');
                    clearInterval(uiUpdatesInterval);
                    return true;
                }
                return false;
            };
            function open(promoCodes) {
                let navUrl = groups[0].currentSite.url;
                try {
                    let params = groups[0].currentSite.params || {};
                    if(promoCodes) {
                        navUrl = new URL('promotion/' + promoCodes[0], groups[0].currentSite.url.origin);
                        ui.log(`Opening ${groups[0].currentSite.name} with ${promoCodes.length} Promo Codes [${promoCodes.join(',')}]`);
                        params.promoCodes = promoCodes;
                    }

                    if (groups[0].currentSite.firstRun) {
                        if(Array.isArray(groups[0].currentSite.rf) && groups[0].currentSite.rf.length > 0) {
                            navUrl = new URL(navUrl.href + groups[0].currentSite.rf[helpers.randomInt(0, groups[0].currentSite.rf.length - 1)]);
                        }
                    }

                    if (groups[0].currentSite.wallet) {
                        //TODO: VALIDATE THAT ADDRESS EXISTS AND IS VALID!!!
                        try {
                            params.address = userWallet.find(x => x.type == groups[0].currentSite.wallet).address;
                            // console.log(params.address);
                        } catch {
                            shared.addError(K.ErrorType.NO_ADDRESS, 'You need to add your address to the wallet before claiming this faucet.');
                            ui.log(`Unable to launch ${groups[0].currentSite.name}: Address not detected > add it to the wallet.`);
                            moveNextAfterTimeoutOrError();
                            return;
                        }
                    }
                    console.log(params);
                    if(groups[0].currentSite.type == K.WebType.BESTCHANGE) {
                        params.address = shared.getConfig()['bestchange.address'] == '1' ? userWallet.find(x => x.type == 1).address : params.address;
                    }
                    if(groups[0].currentSite.type == K.WebType.BAGIKERAN) {
                        params.doWithdraw = getDoWithdraw(groups[0].currentSite.lastWithdraw);
                        params.doSignOut = (groups[0].currentSite.wallet == K.WalletType.FP_BCH ? true : false);
                        params.trackUrl = groups[0].currentSite.url;
                    }
                    params.cmc = groups[0].currentSite.cmc;

                    if(groups[0].currentSite.type == K.WebType.FPB) {
                        switch(groups[0].currentSite.id) {
                            case '77':
                                params.sitePrefix = 'fpb';
                                break;
                            case '83':
                                params.sitePrefix = 'fbch';
                                break;
                            case '92':
                                params.sitePrefix = 'shost';
                                break;
                                // case '84':
                                //     params.sitePrefix = 'jtfey';
                                //     break;
                        }
                    }

                    // TODO: create credentials on site level
                    if(groups[0].currentSite.type == K.WebType.VIE) {
                        params.credentials = {
                            mode: shared.getConfig()['jtfey.credentials.mode'],
                            username: shared.getConfig()['jtfey.credentials.username'],
                            password: shared.getConfig()['jtfey.credentials.password']
                        };
                    }

                    shared.setFlowControl(groups[0].currentSite.id, navUrl, groups[0].currentSite.type, params);
                    setTimeout(manager.resultReader, 15000);

                    // Try to close old workingTab if still opened
                    if (workingTab && !workingTab.closed) {
                        try {
                            shared.devlog(`Tab closed from Manager`);
                            workingTab.close();
                        } catch {
                            shared.devlog(`ERROR: unable to close tab from Manager`);
                        }
                    } else {
                        shared.devlog(`No open tabs detected`);
                    }

                    timer.startCheck(groups[0].currentSite.type);
                    let noSignUpList = [ K.WebType.BESTCHANGE, K.WebType.CBG, K.WebType.G8, K.WebType.O24, K.WebType.CDIVERSITY ];
                    let hrefOpener = navUrl.href;
                    if (noSignUpList.includes(groups[0].currentSite.type)) {
                        hrefOpener = (new URL(groups[0].currentSite.clId, 'https://criptologico.com/goto/')).href;
                    }
                    workingTab = GM_openInTab(hrefOpener, { active: !getCustomOrDefaultVal('defaults.workInBackground', useOverride('defaults.workInBackground')) });
                } catch(err) {
                    ui.log(`Error opening tab: ${err}`)
                }
            };

            function getDoWithdraw(lastWithdraw) {
                // switch (shared.getConfig()['bk.withdrawMode']) {
                //     case "0":
                //         return false;
                //         break;
                //     case "2":
                //         return true;
                //         break;
                //     case "1":
                //         if(lastWithdraw == null) {
                //             return true;
                //         }
                //         return (lastWithdraw && ( (Date.now() - lastWithdraw.getTime()) > helpers.hsToMs(shared.getConfig()['bk.hoursBetweenWithdraws'])));
                //         break;
                //     default:
                //         return false;
                // }
                return false;
            }

            function resultReaderV2() {
                if(isObsolete()) {
                    return;
                }

                let active = shared.getCurrent();

                switch(active.status) {
                    case 'STARTING':
                        return;
                    case 'WORKING':
                        return;
                    case 'PARTIAL_RESULTS':
                        return;
                    case 'FINISHED':
                        return;
                }
            }

            // REFACTOR
            function resultReader() {
                if(isObsolete()) {
                    return;
                }

                if ( ( (groups[0].currentSite.type == K.WebType.FAUCETPAY && timeWaiting < shared.getConfig()['fp.maxTimeInMinutes'] * 60) )
                    && workingTab && !workingTab.closed ) {
                    timeWaiting += 15;
                    ui.log(`Waiting for ${groups[0].currentSite.name} results...`, timeWaiting);
                    setTimeout(manager.resultReader, 15000);
                    return;
                }

                if (groups[0].currentSite.type == K.WebType.CRYPTOSFAUCETS && !hasTimedOut() && workingTab && !workingTab.closed) {
                    timeWaiting += 15;
                    ui.log(`Waiting for ${groups[0].currentSite.name} results...`, timeWaiting);
                    setTimeout(manager.resultReader, 15000);
                    return;
                }

                if(shared.wasVisited(groups[0].currentSite.id)) {
                    let result = shared.getResult();

                    if (result) {
                        updateWebListItem(result);

                        if (result.closeParentWindow) {
                            ui.log(`Closing working tab per process request`);
                            closeWorkingTab();
                        }

                        if ( (groups[0].currentSite.type == K.WebType.CRYPTOSFAUCETS) &&
                            (result.claimed) ) {
                            // ( (result.claimed) || (result.promoStatus && result.promoStatus != K.CF.PromoStatus.ACCEPTED) )) {
                            let promoCodes = CFPromotions.hasPromoAvailable(groups[0].currentSite.id);
                            if (promoCodes) {
                                timeWaiting = 0;
                                update(false);
                                open(promoCodes);
                                return;
                            }
                        }

                        if ( groups[0].currentSite.type == K.WebType.BAGIKERAN && shared.getCurrent().params.doWithdraw && !result.withdrawnAmount) {
                            if(!result.withdrawing) {
                                shared.updateWithoutClosing({ withdrawing: true });
                                update(false);
                                timeWaiting = 0;
                            }

                            if (hasTimedOut()) {
                                if(groups[0].currentSite.stats.countTimeouts) {
                                    groups[0].currentSite.stats.countTimeouts += 1;
                                } else {
                                    groups[0].currentSite.stats.countTimeouts = 1;
                                }

                                ui.log(`Waited too much time for ${groups[0].currentSite.name} results: triggering timeout`);
                                moveNextAfterTimeoutOrError();
                                return;
                            }

                            if (shared.hasErrors(groups[0].currentSite.id)) {
                                groups[0].currentSite.stats.errors = shared.getResult();
                                ui.log(`${groups[0].currentSite.name} closed with error: ${helpers.getEnumText(K.ErrorType, groups[0].currentSite.stats.errors.errorType)} ${groups[0].currentSite.stats.errors.errorMessage}`);

                                if(sleepIfBan()) {
                                    return;
                                }

                                moveNextAfterTimeoutOrError();
                                return;
                            }

                            timeWaiting += 15;
                            ui.log(`Waiting for ${groups[0].currentSite.name} withdraw...`, timeWaiting);
                            setTimeout(manager.resultReader, 15000);
                            return;
                        }
                    } else {
                        ui.log(`Unable to read last run result, for ID: ${groups[0].currentSite.id} > ${groups[0].currentSite.name}`);
                    }

                    timeWaiting = 0;
                    update(true);
                    readUpdateValues(true);
                    return;
                } else {

                    timeWaiting += 15;
                    if (!shared.hasErrors(groups[0].currentSite.id) && !hasTimedOut()) {
                        ui.log(`Waiting for ${groups[0].currentSite.name} results...`, timeWaiting);
                        setTimeout(manager.resultReader, 15000);
                        return;
                    }

                    if (shared.hasErrors(groups[0].currentSite.id)) {
                        groups[0].currentSite.stats.errors = shared.getResult();
                        ui.log(`${groups[0].currentSite.name} closed with error: ${helpers.getEnumText(K.ErrorType,groups[0].currentSite.stats.errors.errorType)} ${groups[0].currentSite.stats.errors.errorMessage}`);
                        if(groups[0].currentSite.type == K.WebType.CBG) {
                            ui.log(`Closing working tab per process request`);
                            closeWorkingTab();
                        }

                        if(sleepIfBan()) {
                            return;
                        }
                    }

                    if (hasTimedOut()) {
                        if(groups[0].currentSite.stats.countTimeouts) {
                            groups[0].currentSite.stats.countTimeouts += 1;
                        } else {
                            groups[0].currentSite.stats.countTimeouts = 1;
                        }

                        ui.log(`Waited too much time for ${groups[0].currentSite.name} results: triggering timeout`);
                    }

                    moveNextAfterTimeoutOrError();
                    return;
                }
            };

            function errorTreatment() {
                //TODO: validate that stats.errors.errorType exists
                shared.devlog(`@errorTreatment`);
                try {
                    switch(groups[0].currentSite.stats.errors.errorType) {
                        case K.ErrorType.NEED_TO_LOGIN:
                            groups[0].currentSite.enabled = false;
                            groups[0].currentSite.nextRoll = null;
                            return true;
                        case K.ErrorType.FAUCET_EMPTY: // retry in 8 hours
                            groups[0].currentSite.enabled = true;
                            groups[0].currentSite.nextRoll = new Date(new Date().setHours(new Date().getHours() + 8));
                            return true;
                    }
                } catch {}
                return false;
            }

            function sleepIfBan() {
                if( (groups[0].currentSite.stats.errors.errorType == K.ErrorType.IP_BAN && shared.getConfig()['cf.sleepHoursIfIpBan'] > 0)
                   || ( (groups[0].currentSite.stats.errors.errorType == K.ErrorType.IP_RESTRICTED || groups[0].currentSite.stats.errors.errorType == K.ErrorType.IP_BAN) && shared.getConfig()['bk.sleepMinutesIfIpBan'] > 0) ) {
                    if(groups[0].currentSite.type == K.WebType.CRYPTOSFAUCETS) {
                        webList.filter(x => x.enabled && x.type == K.WebType.CRYPTOSFAUCETS)
                            .forEach( function(el) {
                            el.nextRoll = sleepCheck(helpers.addMs(helpers.getRandomMs(shared.getConfig()['cf.sleepHoursIfIpBan'] * 60, 2)).toDate());
                        });
                    }

                    if(groups[0].currentSite.type == K.WebType.BAGIKERAN) {
                        webList.filter(x => x.enabled && x.type == K.WebType.BAGIKERAN && x.url.host == groups[0].currentSite.url.host)
                            .forEach( function(el) {
                            el.nextRoll = sleepCheck(helpers.addMs(helpers.getRandomMs(shared.getConfig()['bk.sleepMinutesIfIpBan'], 2)).toDate());
                        });
                    }

                    shared.clearFlowControl();
                    update(true);
                    timeWaiting = 0;
                    readUpdateValues(true);
                    return true;
                }
                return false;
            }

            function getCustomOrDefaultVal(param, useOverride = false) {
                let val;

                if (useOverride) {
                    if (groups[0].currentSite.params && groups[0].currentSite.params.hasOwnProperty(param)) {
                        val = groups[0].currentSite.params[param];
                        if (val != -1) {
                            return val;
                        }
                    }
                }

                // console.log(`Using Default for ${param}: ${shared.getConfig()[param]}`);
                return shared.getConfig()[param];
            }

            function useOverride(param) {
                let overrideFlag = param  + '.override';
                return groups[0].currentSite.params && groups[0].currentSite.params[overrideFlag];
            }

            function sleepCheck(nextRun) {
                // console.log(`sleepCheck for next run: ${nextRun}`);
                let useCustom = useOverride('defaults.sleepMode');
                // console.log(`Using Overide for sleepCheck: ${useCustom}`);
                let sleepMode = getCustomOrDefaultVal('defaults.sleepMode', useCustom);

                if (sleepMode) {
                    let intNextRunTime = nextRun.getHours() * 100 + nextRun.getMinutes();
                    let min = getCustomOrDefaultVal('defaults.sleepMode.min', useCustom).replace(':', '');
                    let max = getCustomOrDefaultVal('defaults.sleepMode.max', useCustom).replace(':', '');

                    if (+min < +max) {
                        if (+min < intNextRunTime && intNextRunTime < +max) {
                            shared.devlog(`Sleep Mode [${min} to ${max}]: adjusting next run. NextRunTimeInt => ${intNextRunTime}`);
                            nextRun.setHours(max.slice(0, 2), max.slice(-2), 10, 10);
                        }
                    } else if (+min > +max) {
                        if (intNextRunTime > +min || intNextRunTime < +max) {
                            shared.devlog(`Sleep Mode [${max} to ${min}]: adjusting next run. NextRunTimeInt => ${intNextRunTime}`);
                            nextRun.setHours(max.slice(0, 2), max.slice(-2), 10, 10);
                            if (nextRun.getTime() < Date.now()) {
                                // add 1 day
                                nextRun.setDate(nextRun.getDate() + 1);
                            }
                        }
                    }
                }
                return nextRun;
            }

            function getNextRun(nextRollFromCountdown) {
                let useCustom = useOverride('defaults.nextRun');
                let useCountdown = getCustomOrDefaultVal('defaults.nextRun.useCountdown', useCustom);
                let nextRunMode = getCustomOrDefaultVal('defaults.nextRun', useCustom);
                let min = getCustomOrDefaultVal('defaults.nextRun.min', useCustom);
                let max = getCustomOrDefaultVal('defaults.nextRun.max', useCustom);
                let nextRun;

                if (useCountdown && nextRollFromCountdown) {
                    nextRun = nextRollFromCountdown;
                } else {
                    let minutes = (nextRunMode == 0) ? helpers.randomInt(min, max) : nextRunMode;
                    let msDelay = helpers.getRandomMs(minutes, 1);

                    nextRun = helpers.addMs(msDelay).toDate();
                }
                nextRun = sleepCheck(nextRun)

                shared.devlog(`@getNextRun: ${nextRun}`);
                return nextRun;
            }

            function moveNextAfterTimeoutOrError() {
                let useCustom = useOverride('defaults.postponeMinutes');

                let mode = getCustomOrDefaultVal('defaults.postponeMinutes', useCustom);
                let min = getCustomOrDefaultVal('defaults.postponeMinutes.min', useCustom);
                let max = getCustomOrDefaultVal('defaults.postponeMinutes.max', useCustom);

                let minutes = (mode == 0) ? helpers.randomInt(min, max) : mode;
                let msDelay = helpers.getRandomMs(minutes, 5);


                groups[0].currentSite.nextRoll = sleepCheck(helpers.addMs(msDelay).toDate());
                if(errorTreatment()) {
                    shared.devlog(`@moveNextAfterTimeoutOrError: errorTreatment => true`);
                }
                shared.devlog(`@moveNextAfterTimeoutOrError: ${groups[0].currentSite.nextRoll}`);

                shared.clearFlowControl();
                update(true);
                timeWaiting = 0;
                readUpdateValues(true);
            }

            function hasTimedOut() {
                let val = getCustomOrDefaultVal('defaults.timeout', useOverride('defaults.timeout')) * 60;
                return (timeWaiting > val);
            };

            function updateWebListItem(result) {
                if (result.withdrawing) {
                    return;
                }

                ui.log(`Updating data: ${JSON.stringify(result)}`);
                groups[0].currentSite.stats.countTimeouts = 0;
                groups[0].currentSite.stats.errors = null;

                if (result.withdrawnAmount && result.withdrawnAmount > 0) {
                    groups[0].currentSite.lastWithdraw = new Date();
                    groups[0].currentSite.balance += result.withdrawnAmount;
                    groups[0].currentSite.lastClaim = 0;
                    groups[0].currentSite.aggregate = 0;
                    return;
                }

                if (result.claimed) {
                    try {
                        result.claimed = parseFloat(result.claimed);
                    } catch { }
                    if(!isNaN(result.claimed)) {
                        groups[0].currentSite.lastClaim = result.claimed;
                        groups[0].currentSite.aggregate += result.claimed;
                    }
                }
                if(result.balance) {
                    groups[0].currentSite.balance = result.balance;
                }
                groups[0].currentSite.nextRoll = getNextRun(result.nextRoll ? result.nextRoll.toDate() : null);
                if(result.promoCodeResults) {
                    for(let i = 0; i < result.promoCodeResults.length; i++) {
                        let item = result.promoCodeResults[i];
                        CFPromotions.updateFaucetForCode(item.promoCode, groups[0].currentSite.id, item.promoStatus);
                    }
                }
                // if(result.promoStatus) {
                //     CFPromotions.updateFaucetForCode(result.promoCode, groups[0].currentSite.id, result.promoStatus);
                // }
                if(result.rolledNumber) {
                    CFHistory.addRoll(result.rolledNumber);
                }
            };

            function readPromoCodeValues() {
                let promoCodeElement = document.getElementById('promo-code-new');
                let promoDataStr = promoCodeElement.innerText.clean();

                if (promoDataStr == '') {
                    return;
                }

                let promoData = JSON.parse(promoDataStr);

                if(promoData.action) {
                    switch (promoData.action) {
                        case 'FORCESTOPFAUCET':
                            console.log('manager needs to stop current running site');
                            groups[0].currentSite.enabled = false;
                            update(true);
                            window.location.reload();

                            promoCodeElement.innerText = '';
                            //ui.refresh with reload
                            break;
                        case 'ADD':
                            CFPromotions.addNew(promoData.code, promoData.repeatDaily);
                            promoCodeElement.innerText = '';
                            document.getElementById('promo-text-input').value = '';
                            toastr["info"]("Code " + promoData.code + " added!");
                            ui.log(`Promo code ${promoData.code} added`);
                            ui.refresh(null, CFPromotions.getAll());
                            break;
                        case 'REMOVEALLPROMOS':
                            CFPromotions.removeAll();
                            promoCodeElement.innerText = '';
                            toastr["info"]("Promo codes removed!");
                            ui.log(`Promo codes removed`);
                            ui.refresh(null, CFPromotions.getAll());
                            break;
                        case 'REMOVE':
                            if(CFPromotions.remove(promoData.id, promoData.code) != -1) {
                                ui.log(`Promo code ${promoData.code} removed`);
                            } else {
                                ui.log(`Unable to remove code ${promoData.code}`);
                            }
                            promoCodeElement.innerText = '';
                            ui.refresh(null, CFPromotions.getAll());
                            break;
                        case 'TRYGETCODES':
                            getCodesFeed(true);
                            promoCodeElement.innerText = '';
                            toastr["info"]("Looking for new codes!");
                            // ui.refresh(null, CFPromotions.getAll());
                            break;
                    }
                }
            };

            function updateRollStatsSpan() {
                let rollsSpanElement = document.getElementById('rolls-span');
                rollsSpanElement.innerText = CFHistory.getRollsMeta().join(',');
            };

            function getCFlist() {
                let items;
                items = webList.filter(f => f.type === K.WebType.CRYPTOSFAUCETS);
                items = items.map(x => {
                    return {
                        id: x.id,
                        name: x.coinRef
                    };});
                items.sort((a, b) => (a.name > b.name) ? 1 : -1);

                return items;
            };
            function closeWorkingTab() {
                workingTab.close();
            };
            function reloadWorkingTab() {
                workingTab.close();
                workingTab = GM_openInTab(shared.getCurrent().url, { active: !getCustomOrDefaultVal('defaults.workInBackground', useOverride('defaults.workInBackground')) });
            };
            return{
                init:start,
                process: process,
                resultReader: resultReader,
                getFaucetsForPromotion: getCFlist,
                readPromoCodeValues: readPromoCodeValues,
                closeWorkingTab: closeWorkingTab,
                reloadWorkingTab: reloadWorkingTab
            };
        },
        createUi: function() {

            let injectables = {
                managerJs: function () {

                    window.myBarChart = null;
                    window.landing = window.location.host;

                    window.sendErrorReport = function sendErrorReport() {
                        try {
                            let header = new Headers();
                            header.append("Content-Type", "application/json");
                            let description = document.getElementById("log-message").value;
                            let log = document.getElementById("log-textarea").value.split('\n');
                            let content = {"description":description, "log":log};
                            let opt = { method: "POST", header, mode: "cors", body: JSON.stringify(content) };
                            fetch("https://1d0103ec5a621b87ea27ffed3c072796.m.pipedream.net", opt).then(response => {
                                console.log(response);
                            }).catch(err => {
                                console.error("[error] " + err.message);
                            });
                        } catch { }
                    };

                    window.loadDlg = function loadDlg(id, siteId = null) {
                        document.querySelectorAll("#modal-dlg .modal-content").forEach(x => x.classList.add('d-none'));
                        if (id == "modal-ereport" || id == "modal-config" || id == "modal-site") {
                            document.getElementById("target-spinner").innerHTML = JSON.stringify({id: id, siteId: siteId});
                            document.getElementById("modal-spinner").classList.remove("d-none");
                            return;
                        } else if (id == 'model-slAlert') {
                            shortlinkAlert.load(id);
                        } else {
                            document.getElementById(id).classList.remove("d-none");
                        }
                    };

                    window.savePromoCode = function savePromoCode() {
                        var promoText = document.getElementById("promo-text-input");
                        var promoCode = document.getElementById("promo-code-new");
                        var promoDaily = document.getElementById("promo-daily");
                        var promoObject = { action: "ADD", code: promoText.value.trim(), repeatDaily: promoDaily.checked };
                        promoCode.innerHTML =JSON.stringify(promoObject);
                        toastr["info"]("Adding promo code: " + promoObject.code + "...");
                        promoText.value = '';
                    };

                    window.tryGetCodes = function tryGetCodes() {
                        var promoCode = document.getElementById("promo-code-new");
                        var promoObject = { action: "TRYGETCODES" };
                        promoCode.innerHTML =JSON.stringify(promoObject);
                        toastr["info"]("Fetching codes...");
                    };

                    window.removePromoCode = function removePromoCode(id, code) {
                        var promoCode = document.getElementById("promo-code-new");
                        var promoObject = { action: "REMOVE", id: id, code: code };
                        promoCode.innerHTML =JSON.stringify(promoObject);
                        toastr["info"]("Removing promo code " + code);
                    };

                    window.getUpdateObject = function getUpdateObject() {
                        let updateObject;
                        var updateData = document.getElementById("update-data");
                        if (updateData.innerHTML != "") {
                            updateObject = JSON.parse(updateData.innerHTML);
                        } else {
                            updateObject = { runAsap: { ids: [], changed: false}, editSingle: { changed: false, items: [] }, wallet: { changed: false, items: []}, config: { changed: false, items: []}, site: { changed: false, list: []} };
                        }
                        return updateObject;
                    };

                    window.editList = function editList() {
                        document.querySelectorAll("#schedule-table-body td.em-input span").forEach(function (x) {
                            let val = x.innerHTML;
                            x.innerHTML = "<input type=\'text\' class=\'form-control form-control-sm\' data-original=\'" + val.trim() + "\' value=\'" + val.trim() + "\' />";
                        });
                        document.querySelectorAll("#schedule-table-body td.edit-status").forEach(function (x) {
                            let activeSwitch = x.querySelector("input");
                            x.classList.remove("d-none");
                        });
                        document.querySelectorAll(".em-only").forEach(x => x.classList.remove("d-none"));
                        document.querySelectorAll(".em-hide").forEach(x => x.classList.add("d-none"));
                    };

                    window.editListSave = function editListSave() {
                        let updateObject = getUpdateObject();
                        document.querySelectorAll("#schedule-table-body tr:not(.fake-row)").forEach(function (row) {
                            let textInputCell = row.querySelector(".em-input span");
                            let textInput = textInputCell.querySelector("input");
                            let activeSwitch = row.querySelector("td.edit-status input");
                            let single = { id: row.dataset.id, displayName: textInput.dataset.original, enabled: activeSwitch.dataset.original };
                            textInputCell.innerHTML = textInput.value;
                            if(textInput.dataset.original != textInput.value) {
                                single.displayName = textInput.value;
                            }
                            if(activeSwitch.dataset.original != Boolean(activeSwitch.checked)) {
                                single.enabled = Boolean(activeSwitch.checked);
                            }
                            if(textInput.dataset.original != textInput.value || activeSwitch.dataset.original != Boolean(activeSwitch.checked)) {
                                updateObject.editSingle.items.push(single);
                                updateObject.editSingle.changed = true;
                            }
                        });
                        if(updateObject.editSingle.changed) {
                            document.getElementById("update-data").innerHTML = JSON.stringify(updateObject);
                            toastr["info"]("Data will be updated as soon as possible");
                        }

                        document.querySelectorAll(".em-only").forEach(x => x.classList.add("d-none"));
                        document.querySelectorAll(".em-hide").forEach(x => x.classList.remove("d-none"));
                    };

                    window.editListCancel = function editListCancel() {
                        document.querySelectorAll("#schedule-table-body td.em-input input").forEach(function(x) {
                            x.parentNode.innerHTML = x.dataset.original;
                        });
                        document.querySelectorAll(".em-only").forEach(x => x.classList.add("d-none"));
                        document.querySelectorAll(".em-hide").forEach(x => x.classList.remove("d-none"));
                    };

                    window.editWallet = {
                        save: function() {
                            let updateObject = getUpdateObject();
                            document.querySelectorAll("#wallet-table-body tr").forEach( function(row) {
                                let textInput = row.querySelector(".em-input input");
                                if(textInput.dataset.original != textInput.value) {
                                    let single = { id: row.dataset.id, address: textInput.value.trim() };
                                    updateObject.wallet.items.push(single);
                                    updateObject.wallet.changed = true;
                                }
                            });
                            if(updateObject.wallet.changed) {
                                document.getElementById("update-data").innerHTML = JSON.stringify(updateObject);
                                toastr["info"]("Wallet will be updated as soon as possible");
                            }
                        },
                        toggleJson: function(val) {
                            if (document.querySelector('#wallet-json').isVisible()) {
                                if(val != 'cancel') {
                                    editWallet.fromJson();
                                }
                            } else {
                                editWallet.toJson();
                            }
                            document.querySelector('.footer-json').classList.toggle('d-none');
                            document.querySelector('.footer-table').classList.toggle('d-none');
                            document.querySelector('#wallet-table').classList.toggle('d-none');
                            document.querySelector('#wallet-json').classList.toggle('d-none');
                        },
                        toJson: function() {
                            let j = [];
                            document.querySelectorAll('#wallet-table-body tr').forEach(function (row) {
                                j.push({ id: row.dataset.id, address: row.querySelector('.em-input input').value });
                            });
                            document.querySelector('#wallet-json').value = JSON.stringify(j);
                        },
                        fromJson: function() {
                            let j = JSON.parse(document.querySelector('#wallet-json').value);
                            document.querySelectorAll('#wallet-table-body tr').forEach(function (row) {
                                let element = j.find(x => x.id == row.dataset.id);
                                if (element) {
                                    row.querySelector('.em-input input').value = element.address;
                                }
                            });
                        },
                        cancel: function() {
                            document.querySelectorAll("#wallet-table-body .em-input input").forEach( function(x) {
                                x.value = x.dataset.original;
                            });
                        }
                    };

                    window.editConfig = {
                        save: function() {
                            let updateObject = getUpdateObject();
                            document.querySelectorAll("#modal-config [data-original][data-prop]").forEach(function(elm) {
                                let single = { prop: elm.dataset.prop, value: elm.dataset.value };
                                if(elm.dataset.original != elm.value && (elm.type == "select-one" || elm.type == "text" || elm.type == "password" || elm.type == "number" || elm.type == "time") ) {
                                    single.value = elm.value;
                                    updateObject.config.items.push(single);
                                    updateObject.config.changed = true;
                                } else if (elm.type == "checkbox" && ((elm.dataset.original == "0" && elm.checked) || (elm.dataset.original == "1" && !elm.checked)) ) {
                                    single.value = elm.checked;
                                    updateObject.config.items.push(single);
                                    updateObject.config.changed = true;
                                }
                            });
                            if(updateObject.config.changed) {
                                document.getElementById("update-data").innerHTML = JSON.stringify(updateObject);
                                toastr["info"]("Config will be updated as soon as possible");
                            }
                        },
                        cancel: function() {
                            document.querySelectorAll("#modal-config [data-original][data-prop]").forEach(function(elm) {
                                if(elm.type == "select-one" || elm.type == "text" || elm.type == "password" || elm.type == "number" || elm.type == "time") {
                                    elm.value = elm.dataset.original;
                                } else if (elm.type == "checkbox") {
                                    elm.checked = (elm.dataset.original == "1" ? true : false)
                                }
                            });
                        }
                    };

                    window.editSite = {
                        save: function() {
                            let updateObject = getUpdateObject();
                            let faucet = { id: document.querySelector("#faucet-name").dataset.id, items: [] };
                            document.querySelectorAll("#modal-site [data-original][data-site-prop]").forEach(function(elm) {
                                let single = { prop: elm.dataset.siteProp, value: elm.dataset.original };
                                if(elm.dataset.original != elm.value && (elm.type == "select-one" || elm.type == "text" || elm.type == "password" || elm.type == "number" || elm.type == "time") ) {
                                    single.value = elm.value;
                                    faucet.items.push(single);
                                    updateObject.site.changed = true;
                                } else if (elm.type == "checkbox" && ((elm.dataset.original == "0" && elm.checked) || (elm.dataset.original == "1" && !elm.checked)) ) {
                                    single.value = elm.checked;
                                    faucet.items.push(single);
                                    updateObject.site.changed = true;
                                }
                            });
                            if(updateObject.site.changed) {
                                updateObject.site.list.push(faucet);
                                document.getElementById("update-data").innerHTML = JSON.stringify(updateObject);
                                toastr["info"]("Site will be updated as soon as possible");
                            }

                        },
                        cancel: function() {
                            document.querySelectorAll("#modal-site [data-original][data-site-prop]").forEach(function(elm) {
                                if(elm.type == "select-one" || elm.type == "text" || elm.type == "password" || elm.type == "number" || elm.type == "time") {
                                    elm.value = elm.dataset.original;
                                } else if (elm.type == "checkbox") {
                                    elm.checked = (elm.dataset.original == "1" ? true : false)
                                }
                            });
                        }
                    };

                    window.editEreport = {
                        save: function() {
                            sendErrorReport();
                        },
                        cancel: function() {
                        }
                    };

                    window.modalSave = function modalSave(content) {
                        switch(content) {
                            case "wallet":
                                editWallet.save();
                                break;
                            case "ereport":
                                editEreport.save();
                                break;
                            case "config":
                                editConfig.save();
                                break;
                            case "site":
                                editSite.save();
                                break;
                            case "slAlert":
                                shortlinkAlert.save();
                                break;
                        }
                    };

                    window.modalCancel = function modalCancel(content) {
                        if(content == "wallet") {
                            editWallet.cancel();
                        } else if ("ereport") {
                            editEreport.cancel();
                        }
                        document.querySelectorAll("modal-content").forEach(x => x.classList.add("d-none"));
                    };

                    window.updateValues = function updateValues(type, values) {
                        let updateObject = getUpdateObject();
                        if (type == "runAsap") {
                            updateObject.runAsap.ids.push(values.id);
                            updateObject.runAsap.changed = true;
                            document.getElementById("update-data").innerHTML = JSON.stringify(updateObject);
                            toastr["info"]("Faucet will be updated to run as soon as possible");
                        }
                    };

                    window.confirmable = {
                        open: function (req, details = null, params = null) {
                            // open modal with req/action reference
                            let btn = document.getElementById("confirm-req-btn");
                            btn.setAttribute('data-request', req);
                            btn.setAttribute('data-params', params ? JSON.stringify(params) : '{}');

                            if(details) {
                                document.querySelector("#confirmable-modal p").innerText = details;
                            }
                            return;
                        },
                        accept: function () {
                            let btn = document.getElementById("confirm-req-btn");
                            let req = { type: '', params: {}};
                            req.type = btn.getAttribute('data-request');
                            req.params = JSON.parse(btn.getAttribute('data-params'));
                            switch(req.type) {
                                case 'removeAllPromos':
                                    window.removeAllPromos();
                                    break;
                                case 'forceStopFaucet':
                                    window.forceStopFaucet();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    window.removeAllPromos = function removeAllPromos() {
                        var promoCode = document.getElementById("promo-code-new");
                        var promoObject = { action: "REMOVEALLPROMOS" };
                        promoCode.innerHTML =JSON.stringify(promoObject);
                        toastr["info"]("This could take around a minute", "Removing all promo codes");
                    };

                    window.forceStopFaucet = function removeAllPromos() {
                        console.log('stopping current');
                        var promoCode = document.getElementById("promo-code-new");
                        var promoObject = { action: "FORCESTOPFAUCET" };
                        promoCode.innerHTML =JSON.stringify(promoObject);
                        toastr["info"]("Please wait for reload...", "Trying to stop");
                    };

                    window.openStatsChart = function openStatsChart() {
                        if(myBarChart) { myBarChart.destroy(); }
                        let statsFragment = document.getElementById("stats-fragment");
                        if (statsFragment.style.display === "block") { statsFragment.style.display = "none"; document.getElementById("stats-button").innerText = "Lucky Number Stats"; } else {
                            statsFragment.style.display = "block"; document.getElementById("stats-button").innerText = "Close Stats";
                            var canvas = document.getElementById("barChart");
                            var ctx = canvas.getContext("2d");
                            var dataSpan = document.getElementById("rolls-span");
                            var data = {
                                labels: ["0000-9885", "9886-9985", "9986-9993", "9994-9997", "9998-9999", "10000"],
                                datasets: [ { fill: false, backgroundColor: [ "#990000", "#660066", "#000099", "#ff8000", "#ffff00", "#00ff00"],
                                             data: dataSpan.innerText.split(",") } ] };
                            var options = { plugins: { legend: { display: false } }, title: { display: true, text: "Rolled Numbers", position: "top" }, rotation: -0.3 * Math.PI };
                            myBarChart = new Chart(ctx, { type: "doughnut", data: data, options: options });
                        }
                    };

                    window.shortlinkAlert = {
                        load: function(id, destination) {
                            let hideShortlinkAlerts = localStorage.getItem("hideShortlinkAlerts");
                            hideShortlinkAlerts = hideShortlinkAlerts ? JSON.parse(hideShortlinkAlerts) : false;

                            if (hideShortlinkAlerts) {
                                //do alert action without warning (go to SL)
                            } else {
                                document.getElementById(id).classList.remove("d-none");
                            }
                        },
                        save: function () {
                            localStorage.setItem("hideShortlinkAlerts", JSON.stringify(document.getElementById("hideShortlinkAlerts").checked));
                            // go to SL
                            window.open("https://example.com", "_blank");
                        }
                    }

                    window.hiddenSites = {
                        load: function () {
                            let hsi = localStorage.getItem("hiddenSiteIds");
                            return hsi ? JSON.parse(hsi) : [];
                        },
                        save: function (hsi) {
                            if (hsi) {
                                localStorage.setItem("hiddenSiteIds", JSON.stringify(hsi));
                            } else {
                                localStorage.removeItem("hiddenSiteIds");
                            }
                        },
                        add: function (siteId) {
                            let hsi = hiddenSites.load();
                            hsi.push(siteId);
                            hiddenSites.save(hsi);
                        },
                        removeAll: function () {
                            hiddenSites.save(null);
                        }
                    };
                    window.showHidden = function showHidden() {
                        document.querySelectorAll("#schedule-table tr.d-none").forEach(x => x.classList.toggle('d-none'));
                        document.querySelectorAll(".fake-row").forEach(x => x.parentElement.removeChild(x));
                        document.querySelector('#unhide-btn').classList.add("d-none");
                        hiddenSites.removeAll();
                    };
                    window.hideRow = function hideRow(siteId) {
                        let row = document.querySelector("#schedule-table tr[data-id='" + siteId + "']");
                        if (row) {
                            row.classList.toggle("d-none");
                            if (row.classList.contains("d-none")) {
                                var fakeRow = document.createElement('tr');
                                fakeRow.setAttribute("class", "fake-row");
                                row.insertAdjacentElement('afterend', fakeRow);
                                hiddenSites.add(siteId);
                                document.querySelector('#unhide-btn').classList.remove("d-none");
                            }
                        }
                    };
                }
            };

            let logLines = ['', '', '', '', ''];
            function init(cfFaucets) {
                appendCSS();
                appendJavaScript();
                appendHtml();
                $('#promo-daily').bootstrapSwitch();
                createPromoTable(cfFaucets);
                try {
                    document.querySelector('.page-title h1').innerHTML = 'Auto Claim';
                } catch (err) {}
            };
            function appendCSS() {
                let css = document.createElement('style');
                css.innerHTML = `
              td.em-input {
                padding-top: 0;
                padding-bottom: 0;
              }
              `;
                document.head.appendChild(css);
            };
            function appendJavaScript() {
                addJS_Node (null, null, injectables.managerJs);
            };
            function addCardHtml(obj) {
                return `<div class="card m-1"><div class="card-header">${obj.header}</div><div class="card-body px-4">${obj.body}</div></div>`;
            };
            function addSliderHtml(propName, propValue, text) {
                return `<label class="switch"><input type="checkbox" ${propName}="${propValue}" data-original="1"><span class="slider round"></span></label> ${text}`;
            };
            function addRandomBetween(propSelect, propMin, propMax) {
                return `<table><tr><td>
                  <select class="form-control" ${propSelect.name}="${propSelect.value}">
                   <option value="0">Random between...</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="35">35 minutes</option><option value="45">45 minutes</option><option value="65">65 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option>
                  </select></td>
                  <td><input type="number" data-original="" ${propMin.name}="${propMin.value}" min="1" value="15" step="5" class="form-control"></td><td>and</td><td><input type="number" data-original="" ${propMax.name}="${propMax.value}" value="65" step="5" class="form-control"></td><td>minutes</td></tr></table>`;
            }
            function appendHtml() {
                let html ='';
                let cardBody ='';

                html += '<div class="modal fade" id="confirmable-modal" tabindex="-1" role="dialog" aria-hidden="true">';
                html += '<div class="modal-dialog modal-sm modal-dialog-centered"><div class="modal-content">';
                html += '<div class="modal-header"><h4 class="modal-title">Are you sure?</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>';
                html += '<div class="modal-body"><p></p></div>';
                html += '<div class="modal-footer justify-content-between"><button type="button" class="btn btn-default" data-dismiss="modal">No</button>';
                html += '<button type="button" class="btn btn-primary" data-dismiss="modal" id="confirm-req-btn" onclick="confirmable.accept()">Yes</button></div>';
                html += '</div></div>';
                html += '</div>';

                html += '<div class="modal fade" id="modal-dlg" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true">';
                html += ' <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">';

                // MODAL CONTENTS
                //[Loading]
                html += '<div class="modal-content bg-beige" id="modal-spinner"><div class="modal-body"><div class="d-flex justify-content-center"><span id="target-spinner" class="d-none"></span><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading data</div></div></div>';

                //Error report
                html += '  <div class="modal-content bg-beige d-none" id="modal-ereport">';
                html += '   <div class="modal-header"><h5 class="modal-title">Submit an Error</h5></div>';
                html += '    <div class="modal-body">';
                html += '     <div class="alert alert-danger">Don\'t send private information as data might be publicly access.</div>';
                html += '      <textarea rows="4" id="log-message" class="form-control" placeholder="PLEASE do not send logs without describing here the issue you are facing..."></textarea>';
                html += '      <label for="log-textarea">Log</label>';
                html += '      <textarea rows="10" id="log-textarea" class="form-control"></textarea>';
                html += '    </div>';
                html += '    <div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'ereport\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '    <a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'ereport\')" data-dismiss="modal"><i class="fa fa-paper-plane"></i> Send</a></div>';
                html += '  </div>';

                //Wallet
                html += '  <div class="modal-content bg-beige d-none" id="modal-wallet">';
                html += '   <div class="modal-header"><h5 class="modal-title">Your Addresses</h5></div>';
                html += '    <div class="modal-body">';
                html += '     <div><table class="table table-striped" id="wallet-table">';
                html += '          <thead><tr><th class="">Name</th><th class="">Address</th></tr></thead>';
                html += '          <tbody class="overflow-auto" id="wallet-table-body"></tbody></table><textarea rows="14" id="wallet-json" class="d-none w-100"></textarea>';
                html += '     </div>';
                html += '    </div>';
                html += '<div class="modal-footer">';
                html += '<div class="footer-json d-none">';
                html += '<a class="btn m-2 anchor btn-outline-danger align-middle" onclick="editWallet.toggleJson(\'cancel\')"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '<a class="btn m-2 anchor btn-outline-primary align-middle" onclick="editWallet.toggleJson()"><i class="fa fa-edit"></i> Confirm</a></div>';
                html += '<div class="footer-table"><a class="btn m-2 anchor btn-outline-primary align-middle" onclick="editWallet.toggleJson()"><i class="fa fa-edit"></i> Edit as JSON</a>';
                html += '<a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'wallet\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '<a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'wallet\')" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a></div></div>';
                html += '   </div>';

                //Info
                html += '  <div class="modal-content bg-beige d-none" id="modal-info">';
                html += '   <div class="modal-header"><h5 class="modal-title">Info</h5></div>';
                html += '    <div class="modal-body">';
                html += '<ul>';
                html += '<li>Almost all sites in the list require an external hCaptcha solver, you can find one in our <a href="https://discord.gg/23s9fDgHqe" target="_blank">discord</a>.</li>';
                html += '<li>Stormgain requires a GeeTest solver. You can use <a href="https://greasyfork.org/en/scripts/444560" target="_blank">this script</a> to solve the captchas through 2Captcha API service.</li>';
                html += '<li>You can set default configurations at Settings</li>';
                html += '<li>You can override configurations for a specific site using the edit (<i class="fa fa-edit"></i>) buttons</li>';
                html += '<li>Some sites might only work if the tab running it is on focus</li>';
                html += '<li>When enabling a new site, try it first with the tab on focus, to detect potential issues</li>';
                html += '<li>You can enable the log in Settings to detect processing problems</li>';
                html += '</ul>';
                html += '    </div>';
                html += '<div class="modal-footer">';
                html += '<a class="btn m-2 anchor btn-outline-warning align-middle" data-dismiss="modal"><i class="fa fa-edit"></i> Close</a></div>';
                html += '   </div>';

                //Alert Msg
                html += '  <div class="modal-content bg-beige d-none" id="modal-slAlert">';
                html += '   <div class="modal-header"><h5 class="modal-title">Attention</h5></div>';
                html += '    <div class="modal-body">';
                html += '     <div class="alert alert-warning">You will be redirected to a shortlink, and after completing it the new Twitter Daily Promo Code will be added to your table.<br>';
                html += 'This is an optional contribution. You can still get the code the old fashion way.</div>';
                html += addSliderHtml('id', 'hideShortlinkAlerts', `Stop warning me before a shortlink`);
                html += '   </div>';
                html += '<div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'slAlert\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '<a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'slAlert\')" data-dismiss="modal"><i class="fa fa-external-link-alt"></i> Lets Go!</a></div>';
                html += '   </div>';

                //Edit Site / single faucet
                html += '  <div class="modal-content bg-beige d-none" id="modal-site">';
                html += '    <div class="modal-header"><h5 class="modal-title">Edit <span id="faucet-name" data-id=""></span> Configuration</h5></div>';
                html += '    <div class="modal-body">';
                html += '     <div class="alert alert-warning">Override Settings for the selected faucet.<br>Faucet-specific configurations will be moved here soon.</div>';
                html += '     <div class="row">';

                html += '     <div class="col-md-12 col-sm-12">';
                html += addCardHtml({
                    header: addSliderHtml('data-site-prop', 'defaults.workInBackground.override', 'Override Work Mode'),
                    body: addSliderHtml('data-site-prop', 'defaults.workInBackground', 'Open tab in background')
                });
                html += addCardHtml({
                    header: addSliderHtml('data-site-prop', 'defaults.nextRun.override', 'Override Next Run'),
                    body: `<div>${addSliderHtml('data-site-prop', 'defaults.nextRun.useCountdown', 'Use faucet countdown when possible')}</div>` +
                    `<label class="control-label">Otherwise wait:</label>` +
                    addRandomBetween({ name: 'data-site-prop', value: 'defaults.nextRun' }, { name: 'data-site-prop', value: 'defaults.nextRun.min' }, { name: 'data-site-prop', value: 'defaults.nextRun.max' })
                });
                html += addCardHtml({
                    header: addSliderHtml('data-site-prop', 'defaults.sleepMode.override', 'Override Sleep Mode'),
                    body: addSliderHtml('data-site-prop', 'defaults.sleepMode', 'Sleep mode') +
                    `<table><tr><td>Don't claim between </td><td><input type="time" data-original="" data-site-prop="defaults.sleepMode.min" class="form-control"></td><td>and</td>
                  <td><input type="time" data-original="" data-site-prop="defaults.sleepMode.max" class="form-control"></td></tr></table>`
                });
                html += '         <div class="card m-1"><div class="card-header">Timeout</div>';
                html += '           <div class="card-body px-4">';
                html += addCardHtml({
                    header: addSliderHtml('data-site-prop', 'defaults.timeout.override', 'Override Timeout'),
                    body: `<table><tr><td>After</td><td><input type="number" data-original="" data-site-prop="defaults.timeout" min="2" value="5" step="1" class="form-control"></td><td>minutes</td></tr></table>`
                });
                html += addCardHtml({
                    header: addSliderHtml('data-site-prop', 'defaults.postponeMinutes.override', 'Override Postpone'),
                    body: `<label class="control-label">After timeout/error, postpone for:</label>` +
                    addRandomBetween({ name: 'data-site-prop', value: 'defaults.postponeMinutes' }, { name: 'data-site-prop', value: 'defaults.postponeMinutes.min' }, { name: 'data-site-prop', value: 'defaults.postponeMinutes.max' })
                });
                html += '       </div>';
                html += '     </div>';
                html += '    </div>';
                html += '     </div>';
                html += '    </div>';
                html += '<div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'site\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '<a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'site\')" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a></div>';
                html += '   </div>';

                //Config
                html += '<div class="modal-content bg-beige d-none" id="modal-config">';
                html += '  <div class="modal-header"><h5 class="modal-title">Settings</h5></div>';
                html += '  <div class="modal-body">';
                html += '     <div class="alert alert-danger alert-dismissible fade show" id="alert-settings-01">This form does not upload data. Values are added to a span, then read by the script and locally stored by Tampermonkey using GM_setValue.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                html += '     <div class="alert alert-danger alert-dismissible fade show" id="alert-settings-02">Time values are estimated and will be randomly modified by +/-2% aprox.<br>The script will trigger a reload of the page after updating the data.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                html += '     <div class="row">';

                html += '     <div class="col-md-12 col-sm-12">';
                html += '         <div class="card card-info m-1"><div class="card-header">Defaults<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-minus"></i></button></div></div>';
                html += '           <div class="card-body px-4">';
                html += `<div>${addSliderHtml('data-prop', 'defaults.workInBackground', 'Open tabs in background')}</div>`;
                html += `<div>${addSliderHtml('data-prop', 'defaults.extraInterval', 'Use extra timer to detect ad redirects faster')}</div>`;

                html += addCardHtml({
                    header: 'Next Run',
                    body: `<div>${addSliderHtml('data-prop', 'defaults.nextRun.useCountdown', 'Use faucet countdown when possible')}</div>` +
                    `<label class="control-label">Otherwise wait:</label>` +
                    addRandomBetween({ name: 'data-prop', value: 'defaults.nextRun' }, { name: 'data-prop', value: 'defaults.nextRun.min' }, { name: 'data-prop', value: 'defaults.nextRun.max' })
                });
                html += addCardHtml({
                    header: 'Timeout',
                    body: `<table><tr><td>After</td><td><input type="number" data-original="" data-prop="defaults.timeout" min="2" value="5" step="1" class="form-control"></td><td>minutes</td></tr></table>` +
                    `<label class="control-label">After timeout/error, postpone for:</label>` +
                    addRandomBetween({ name: 'data-prop', value: 'defaults.postponeMinutes' }, { name: 'data-prop', value: 'defaults.postponeMinutes.min' }, { name: 'data-prop', value: 'defaults.postponeMinutes.max' })
                });
                html += addCardHtml({
                    header: 'Logging',
                    body: `<div>${addSliderHtml('data-prop', 'devlog.enabled', 'Store log (enables the \'Log\' button)')}</div>` +
                    `<table><tr><td>Max log size in lines:</td><td><input type="number" data-original="" data-prop="devlog.maxLines" min="100" step="100" class="form-control"></td></tr></table>`
                });
                html += addCardHtml({
                    header: addSliderHtml('data-prop', 'defaults.sleepMode', 'Sleep mode'),
                    body: `<table><tr><td>Don't claim between </td><td><input type="time" data-original="" data-prop="defaults.sleepMode.min" class="form-control"></td><td>and</td>
                  <td><input type="time" data-original="" data-prop="defaults.sleepMode.max" class="form-control"></td></tr></table>`
                });
                html += '       </div></div>';
                html += '     </div>';

                html += '     <div class="col-md-12 col-sm-12">';
                html += '         <div class="card card-info m-1"><div class="card-header">Site Specifics<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-minus"></i></button></div></div>';
                html += '           <div class="card-body px-4">';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">CryptosFaucets<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.tryGetCodes" ><span class="slider round"></span></label> Auto update promo codes </div>';
                html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.rollOnce" ><span class="slider round"></span></label> Roll once per round </div>';
                html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.autologin" ><span class="slider round"></span></label> Autologin when neccessary</div>';
                html += '           <select class="form-control" data-prop="cf.credentials.mode">';
                html += '            <option value="1">Use Email and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="cf.credentials.email" required="required" class="form-control" placeholder="Email address..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="cf.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '           <label class="control-label">Hours to wait If IP is banned:</label>';
                html += '           <select class="form-control" data-prop="cf.sleepHoursIfIpBan">';
                html += '            <option value="0">Disabled</option><option value="2">2</option><option value="4">4</option><option value="8">8</option><option value="16">16</option><option value="24">24</option><option value="26">26</option>';
                html += '           </select>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">FPig<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="fpb.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="fpb.credentials.username" required="required" class="form-control" placeholder="Email address..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="fpb.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">FreeBCH<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="fbch.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="fbch.credentials.username" required="required" class="form-control" placeholder="Email address..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="fbch.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">JTFey<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="jtfey.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="jtfey.credentials.username" required="required" class="form-control" placeholder="Email address..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="jtfey.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">BscAds<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="bscads.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="bscads.credentials.username" required="required" class="form-control" placeholder="Username..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="bscads.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">FaucetPay PTC<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <div><label class="switch"><input type="checkbox" data-prop="fp.randomPtcOrder" ><span class="slider round"></span></label> Random PTC order </div>';
                html += '           <label class="control-label">Max duration per run:</label>';
                html += '           <select class="form-control" data-prop="fp.maxTimeInMinutes">';
                html += '            <option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option>';
                html += '           </select>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">Dutchy<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <div><label class="switch"><input type="checkbox" data-prop="dutchy.useBoosted" ><span class="slider round"></span></label> Try boosted roll </div>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">BestChange<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">BTC Address:</label>';
                html += '           <select class="form-control" data-prop="bestchange.address">';
                html += '            <option value="101">Faucet Pay BTC</option><option value="1">BTC Alt Address</option>';
                html += '           </select>';
                html += '       </div></div>';

                // html += '         <div class="card m-1 collapsed-card"><div class="card-header">Bagi/Keran<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                // html += '           <div class="card-body px-4" style="display: none;">';
                // html += '           <label class="control-label">Keran - Crypto to claim: (make sure it exists/is enabled in the site)</label>';
                // html += '           <select class="form-control" data-prop="bkclass.coin">';
                // html += '            <option value="Random">Random</option><option value="LTC">LTC</option><option value="DOGE">DOGE</option><option value="ETH">ETH</option><option value="SOL">SOL</option>';
                // html += '           </select>';
                // html += '           <label class="control-label">Bagi - Crypto to claim: (make sure it exists/is enabled in the site)</label>';
                // html += '           <select class="form-control" data-prop="bkclass.bcoin">';
                // html += '            <option value="Random">Random</option><option value="LTC">LTC</option><option value="DOGE">DOGE</option><option value="ETH">ETH</option><option value="SOL">SOL</option>';
                // html += '           </select>';
                // // html += '           <label class="control-label">Auto withdraw:</label>';
                // // html += '           <select class="form-control" data-prop="bk.withdrawMode">';
                // // html += '            <option value="0">Disabled</option><option value="1">Once every X hours</option><option value="2">After each successful claim</option>';
                // // html += '           </select>';
                // // html += '           <label class="control-label">Hours (X) between withdraws:</label>';
                // // html += '           <select class="form-control" data-prop="bk.hoursBetweenWithdraws">';
                // // html += '            <option value="0">Disabled</option><option value="2">2</option><option value="4">4</option><option value="6">6</option><option value="8">8</option><option value="12">12</option><option value="24">24</option>';
                // // html += '           </select>';
                // html += '           <label class="control-label">Time to wait If IP is restricted:</label>';
                // html += '           <select class="form-control" data-prop="bk.sleepMinutesIfIpBan">';
                // html += '            <option value="0">Disabled</option><option value="45">45 minutes</option><option value="60">1hr</option><option value="75">1hr 15min</option><option value="90">1hr 30min</option><option value="120">2hrs</option><option value="180">3hrs</option><option value="240">4hrs</option>';
                // html += '           </select>';
                // html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">SatoHost<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="shost.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="shost.credentials.username" required="required" class="form-control" placeholder="Username..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="shost.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '         <div class="card m-1 collapsed-card"><div class="card-header">Yes Coiner<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-plus"></i></button></div></div>';
                html += '           <div class="card-body px-4" style="display: none;">';
                html += '           <label class="control-label">Login Mode</label>';
                html += '           <select class="form-control" data-prop="ycoin.credentials.mode">';
                html += '            <option value="1">Use Username and Password</option><option value="2">Filled by 3rd party software/extension</option>';
                html += '           </select>';
                html += '           <label class="control-label">E-Mail</label>';
                html += '           <input maxlength="200" type="text" data-prop="ycoin.credentials.username" required="required" class="form-control" placeholder="Account number..."/>';
                html += '           <label class="control-label">Password</label>';
                html += '           <input maxlength="200" type="password" data-prop="ycoin.credentials.password" required="required" class="form-control" placeholder="Password..."/>';
                html += '       </div></div>';

                html += '    </div></div>';
                html += '  </div>';
                html += ' </div>';
                html += '</div>';
                html += '<div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'config\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
                html += '<a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'config\')" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a></div>';
                html += '   </div>';
                //END OF MODAL CONTENTS

                html += '</div>';
                html += '</div>';


                html += '<div style="width:100%; padding-left: 1em;" id="console-log"><b>Loading...</b></div>';
                html += '<section id="table-struct" class="fragment "><div class="container-fluid "><div class="py-1 "><div class="row mx-0 justify-content-center">';
                if (shared.getConfig()['devlog.enabled']) {
                    html += '<a class="btn m-2 anchor btn-outline-primary align-middle" data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg(\'modal-ereport\')"><i class="fa fa-bug"></i> Log</a>';
                }
                html += '<a class="btn m-2 anchor btn-outline-primary align-middle" data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg(\'modal-config\')"><i class="fa fa-cog"></i> Settings</a>';
                html += '<a class="btn m-2 anchor btn-outline-primary align-middle" data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg(\'modal-wallet\')"><i class="fa fa-wallet"></i> Wallet</a>';
                html += '<a class="btn m-2 anchor btn-outline-primary align-middle" data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg(\'modal-info\')"><i class="fa fa-info"></i> Info</a>';
                html += '<a class="btn m-2 anchor btn-outline-danger align-middle" data-toggle="modal" data-target="#confirmable-modal" onclick="confirmable.open(\'forceStopFaucet\', \'Running faucet will be disabled and the manager will reload.\')"><i class="fa fa-stop-circle"></i> Force Stop</a>';
                // html += '<a class="btn m-2 anchor btn-outline-primary align-middle" data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg(\'modal-slAlert\')"><i class="fa fa-ad"></i> New CF Promo Code</a>';
                html += '</div>';


                html += '<div class="card"><div class="card-header"><h3 class="card-title font-weight-bold">Schedule</h3>';
                html += '<div class="card-tools">';

                html += '<button type="button" class="btn btn-tool-colorless btn-outline-success em-only d-none mx-1" onclick="editListSave()"><i class="fa fa-check-circle"></i> Save</button>';
                html += '<button type="button" class="btn btn-tool-colorless btn-outline-danger em-only d-none mx-1" onclick="editListCancel()"><i class="fa fa-times-circle"></i> Cancel</button>';
                html += `<button type="button" class="btn btn-tool-colorless btn-outline-primary mx-1 em-hide align-middle${localStorage.getItem("hiddenSiteIds") ? '' : ' d-none'}" id="unhide-btn" onclick="showHidden()"><i class="fa fa-eye"></i> Show Hidden</button>`;
                html += '<button type="button" class="btn btn-tool-colorless btn-outline-primary mx-1 em-hide" onclick="editList()"><i class="fa fa-edit"></i> Edit</button>';
                html += '<button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>';
                html += '<button type="button" class="btn btn-tool mx-1" data-card-widget="maximize"><i class="fas fa-expand"></i></button>';
                html += '</div></div>';

                html += '<div class="card-body table-responsive p-0" style="height: 400px;" id="schedule-container">';

                html += '</div></div>';

                html += '</div>';
                html += '<span id="update-data" style="display:none;"></span></section>';
                html += '<section id="table-struct-promo" class="fragment "><div class="container-fluid "><div class="py-1 ">';

                html += '<div class="card"><div class="card-header"><h3 class="card-title font-weight-bold">Promo Codes</h3><span id="promo-code-new" style="display:none;"></span>';
                html += '<div class="card-tools">';

                html += '<div class="input-group input-group-sm btn-tool">';
                html += '<input id="promo-text-input" type="text" name="table_search" class="form-control float-right" list="promoCode_list" placeholder="CF Promo Code..." style="width:130px;">';
                html += '<input type="checkbox" data-toggle="switch" title="Check if the code can be reused every 24hs" id="promo-daily" data-on-text="Daily" data-off-text="1 Time">';
                html += '<div class="input-group-append"><button type="submit" class="btn btn-default" id="promo-button" onclick="savePromoCode()"><i class="fas fa-plus"></i> Add</button></div>';
                html += '<div class="input-group-append"><button type="submit" class="btn btn-default btn-outline-danger mx-1" data-toggle="modal" data-target="#confirmable-modal" onclick="confirmable.open(\'removeAllPromos\', \'All promo codes will be removed.\')"><i class="fas fa-times-circle"></i> Remove All</button></div>';
                html += '<div class="input-group-append"><button type="submit" class="btn btn-default btn-outline-primary" id="promo-button" onclick="tryGetCodes()"><i class="fas fa-bolt"></i> Try to Get Codes</button></div>';
                html += '<button type="button" class="btn btn-tool mx-1" data-card-widget="maximize"><i class="fas fa-expand"></i></button></div>';
                html += '<datalist id="promoCode_list">';
                K.CF.ReusableCodeSuggestions.forEach( function(x) { html += '<option>' + x + '</option>' });
                html += '</datalist>';
                html += '</div>';

                html += '</div>';
                html += '<div class="card-body table-responsive p-0" id="promo-container">';
                html += '</div></div>';

                html +='</div></div></section>';
                html += '<section class="fragment"><div class="container-fluid ">';
                html += '<div class="row justify-content-center"><a class="btn  m-2 anchor btn-outline-primary" id="stats-button" onclick="openStatsChart()">CF Lucky Number Stats</a></div>';
                html +='<div class="py-1" id="stats-fragment" style="display:none;"><div class="row align-items-center text-center justify-content-center">';
                html += '<div class="col-md-12 col-lg-8"><canvas id="barChart"></canvas><span id="rolls-span" style="display:none;"></span></div></div></div></div></div></section>';

                let wrapper = document.createElement('div');
                wrapper.innerHTML = html.trim();

                let tgt = document.querySelector('div.row.py-3');
                if (tgt) {
                    let rowDiv = document.createElement('div');
                    rowDiv.innerHTML = '<div class="row py-3 ac-log"><div class="col-12 justify-content-center"><div class="card"><div class="card-body" id="referral-table"></div></div></div></div>';
                    tgt.after(rowDiv);
                }

                let target = document.getElementById('referral-table');
                target.parentNode.insertBefore(wrapper, target);
                document.getElementById('schedule-container').appendChild( createScheduleTable() );

                if (document.querySelector('.main-header .navbar-nav.ml-auto')) {
                    let discord = document.createElement('li');
                    discord.classList.add('nav-item');
                    discord.innerHTML = '<a class="btn btn-primary btn-sm m-1" href="https://discord.gg/23s9fDgHqe" target="_blank"><div class="">discord</div></a>';
                    document.querySelector('.main-header .navbar-nav.ml-auto').prepend(discord);
                } else {
                    let discord = document.createElement('div');
                    discord.innerHTML = '<a class="btn m-2 btn-primary" href="https://discord.gg/23s9fDgHqe" target="_blank"><div class="">discord</div></a>';
                    document.querySelector('.navbar-nav').prepend(discord);
                }
            };
            function createPromoTable(faucets) {
                let table = document.createElement('table');
                let inner = '';
                table.classList.add('table', 'table-striped');
                table.setAttribute('id','promo-table');

                inner += '<caption style="text-align: -webkit-center;">⏳ Pending ✔️ Accepted 🕙 Used Before ❌ Invalid code ❗ Unknown error ⚪ No code</caption>';
                inner += '<thead><tr><th class="">Code</th><th class="">Added</th>';

                for (let i = 0, all = faucets.length; i < all; i++) {
                    inner += '<th data-faucet-id="' + faucets[i].id + '">' + faucets[i].name + '</th>';
                }

                inner += '</tr></thead><tbody id="promo-table-body"></tbody></table>';

                table.innerHTML = inner
                document.getElementById('promo-container').appendChild( table );
            };
            function createScheduleTable() {
                let table = document.createElement('table');
                let inner;
                table.classList.add('table', 'table-striped', 'table-head-fixed', 'text-nowrap');
                table.setAttribute('id','schedule-table');

                inner = '<thead><tr>';
                inner += '<th scope="col" class="edit-status d-none em-only" style="">Active</th><th class="">Next Roll</th><th class=""></th><th class="">Name</th><th class="">Last Claim</th>';
                inner += '<th class="">Aggregate</th><th class="">Balance</th><th class="" id="converted-balance-col">FIAT</th>';
                inner += '<th scope="col" class="">Msgs</th><th scope="col" class="em-hide" style="">Actions</th></tr></thead><tbody id="schedule-table-body"></tbody>';
                table.innerHTML = inner;

                return table;
            };
            function loadScheduleTable(data) {
                let hsi = localStorage.getItem("hiddenSiteIds");
                hsi = hsi ? JSON.parse(hsi) : [];

                let tableBody = '';

                for(let i=0, all = data.length; i < all; i++) {
                    if(hsi.indexOf(data[i].id) > -1) {
                        tableBody += '<tr class="fake-row d-none"></tr>'; // nth background styling workaround
                    }
                    tableBody += `<tr class="align-middle${hsi.indexOf(data[i].id) > -1 ? ' d-none' : ''}" data-id="${data[i].id}" data-enabled="${(data[i].enabled ? '1' : '0')}" data-cmc="${data[i].cmc}" data-balance="`;
                    if (data[i].balance) {
                        if(typeof data[i].balance == 'string') {
                            tableBody += data[i].balance.split(' ')[0];
                        } else {
                            tableBody += data[i].balance.toFixed(8);
                        }
                    }
                    tableBody += '">';
                    tableBody +='<td class="align-middle edit-status d-none em-only"><label class="switch"><input type="checkbox" data-original="' + (data[i].enabled ? '1' : '0') + '" ' + (data[i].enabled ? 'checked' : ' ') + '><span class="slider round"></span></label></td>';
                    tableBody +='<td class="align-middle">' + helpers.getPrintableTime(data[i].nextRoll) + '</td>';
                    tableBody +='<td class="align-middle text-left">';
                    tableBody +='<a class="" title="Visit site" target="_blank" rel="noreferrer" href="' + (new URL(data[i].clId, 'https://criptologico.com/goto/')).href + '"><i class="fa fa-external-link-alt"></i></a> ';
                    tableBody += '</td>';
                    tableBody +='<td class="align-middle em-input text-left" data-field="displayName">';
                    if (data[i].cmc) {
                        tableBody +='<div class="input-group">';
                        if (data[i].cmc > 0) {
                            let cmcLower = helpers.getEnumText(K.CMC, data[i].cmc).toLowerCase();
                            tableBody +='<img loading="lazy" src="/static/c-icons/' + cmcLower + '.svg" height="20" alt="' + cmcLower + '">';
                        } else {
                            tableBody +='<i class="fa fa-question-circle"></i>';
                        }
                    }
                    tableBody += ' <span class="px-1">' + data[i].name + '</span></div></td>';

                    tableBody +='<td class="align-middle">' + data[i].lastClaim.toFixed(Number.isInteger(data[i].lastClaim) ? 0 : 8) + '</td>';
                    tableBody +='<td class="align-middle">' + data[i].aggregate.toFixed(Number.isInteger(data[i].aggregate) ? 0 : 8) + '</td>';

                    tableBody +='<td class="align-middle">';
                    if (data[i].balance) {
                        if(typeof data[i].balance == 'string') {
                            tableBody += data[i].balance.split(' ')[0];
                        } else {
                            tableBody += data[i].balance.toFixed(8);
                        }
                    }
                    tableBody + '</td>';
                    tableBody +='<td class="align-middle fiat-conversion"></td>';
                    tableBody +='<td class="align-middle">' + addBadges(data[i].stats) + '</td>';
                    tableBody +='<td class="align-middle justify-content-center em-hide">';
                    tableBody +='<a class="px-2" title="Run ASAP" href="javascript:updateValues(\'runAsap\', { id: ' + data[i].id + ' })" onclick=""><i class="fa fa-redo"></i></a>';
                    tableBody +=`<a class="px-2 ${Object.keys(data[i].params).some( k => k.endsWith('.override') && data[i].params[k] == true ) ? 'text-warning' : ''}" title="Edit..." data-toggle="modal" data-target="#modal-dlg" onclick="loadDlg('modal-site', '${data[i].id}')"><i class="fa fa-edit"></i></a>`;
                    tableBody += !data[i].enabled ? `<a class="px-2" title="Hide..." href="javascript:hideRow('${data[i].id}')" onclick=""><i class="fa fa-eye-slash"></i></a>` : ``;

                    tableBody +='</td></tr>';
                }

                document.getElementById('schedule-table-body').innerHTML = tableBody;

                location.href = 'javascript:convertToFiat();';
            };

            function addBadges(stats) {
                let consecutiveTimeout = stats.countTimeouts;
                let otherErrors = stats.errors;
                let html = ' ';

                if (consecutiveTimeout) {
                    html += `<span class="badge badge-pill badge-warning" title="${consecutiveTimeout} consecutive timeouts">${consecutiveTimeout}</span>`;
                }

                if (otherErrors) {
                    html += `<span class="badge badge-pill badge-warning" title="${otherErrors.errorMessage}">${helpers.getEnumText(K.ErrorType, otherErrors.errorType)}</span>`;
                }
                return html;
            }
            function removeUsedDailyCodes(codes) {
                if(codes && codes.length) {
                    codes.forEach(code => {
                        if(!code.repeatDaily) {
                            let counter = 0;
                            for(let i = 0; i < code.statusPerFaucet.length; i++) {
                                if(code.statusPerFaucet[i].execTimeStamp) {
                                    counter++;
                                }
                            }
                            if(counter == code.statusPerFaucet.length) {
                                setTimeout(() => removePromoCode(code.id, code.code), 20000);
                            }
                        }
                    });
                }
            }
            function loadPromotionTable(codes) {
                let tableBody = '';
                removeUsedDailyCodes(codes);

                for(let c=0; c < codes.length; c++) {
                    let data = codes[c];
                    tableBody += '<tr data-promotion-id="' + data.id + '">';
                    tableBody += '<td class="align-middle text-left ' + (data.repeatDaily ? 'text-warning' : '') + '">';
                    tableBody += '<a data-toggle="tooltip" data-placement="left" title="Remove" href="javascript:removePromoCode(' + data.id + ', \'' + data.code + '\')" onclick=""><i class="fa fa-times-circle"></i></a> ';
                    tableBody += '<span  title="' + (data.repeatDaily ? 'Reusable Code' : 'One-time-only Code') + '">' + data.code + '</span></td>';
                    tableBody +='<td class="align-middle" title="' + (data.repeatDaily ? 'Reusable Code' : 'One-time-only Code') + '">' + helpers.getPrintableDateTime(data.added) + '</td>';

                    for(let i=0, all = data.statusPerFaucet.length; i < all; i++) {
                        tableBody +='<td class="align-middle" title="Runned @' + helpers.getPrintableDateTime(data.statusPerFaucet[i].execTimeStamp) + '">' + helpers.getEmojiForPromoStatus(data.statusPerFaucet[i].status ?? 0) + '</td>';
                    }
                    tableBody +='</tr>';
                }

                document.getElementById('promo-table-body').innerHTML = tableBody;
            };
            function loadWalletTable(data) {
                let tableBody = '';

                for(let i=0, all = data.length; i < all; i++) {
                    tableBody += '<tr class="align-middle" data-id="'+ data[i].id + '">';
                    tableBody += '<td class="align-middle">' + data[i].name + '</td>';
                    tableBody += '<td class="align-middle em-input"><input type="text" class="w-100" onfocus="this.select();" data-field="address" data-original="' + data[i].address + '" value="' + data[i].address + '"></td>';
                    tableBody += '</tr>';
                }

                document.getElementById('wallet-table-body').innerHTML = tableBody;
            };
            function loadConfigData(data) {
                for (const prop in data) {
                    let element = document.querySelector('[data-prop="' + prop + '"]');
                    if(element) {
                        if(element.type == 'select-one' || element.type == 'text' || element.type == 'password' || element.type == 'number' || element.type == 'time') {
                            element.dataset.original = data[prop];
                            element.value = data[prop];
                        } else if (element.type == 'checkbox') {
                            element.dataset.original = (data[prop] ? "1" : "0");
                            element.checked = data[prop];
                        }
                    }
                }

                let elCfTryGetCodes = document.querySelector('[data-prop="cf.tryGetCodes"]')
                let elCredentialsAutologin = document.querySelector('[data-prop="cf.autologin"]');
                let elCredentialsMode = document.querySelector('[data-prop="cf.credentials.mode"]');
                let elCredentialsEmail = document.querySelector('[data-prop="cf.credentials.email"]');
                let elCredentialsPassword = document.querySelector('[data-prop="cf.credentials.password"]');
                // let elWithdrawMode = document.querySelector('[data-prop="bk.withdrawMode"]');
                // let elHoursBetweenWithdraws = document.querySelector('[data-prop="bk.hoursBetweenWithdraws"]');
                let elDevlogEnabled = document.querySelector('[data-prop="devlog.enabled"]');
                let elDevlogMaxLines = document.querySelector('[data-prop="devlog.maxLines"]');
                let elFpigCredentialsMode = document.querySelector('[data-prop="fpb.credentials.mode"]');
                let elFpigCredentialsUsername = document.querySelector('[data-prop="fpb.credentials.username"]');
                let elFpigCredentialsPassword = document.querySelector('[data-prop="fpb.credentials.password"]');
                let elFBchCredentialsMode = document.querySelector('[data-prop="fbch.credentials.mode"]');
                let elFBchCredentialsUsername = document.querySelector('[data-prop="fbch.credentials.username"]');
                let elFBchCredentialsPassword = document.querySelector('[data-prop="fbch.credentials.password"]');
                let elSHostCredentialsMode = document.querySelector('[data-prop="shost.credentials.mode"]');
                let elSHostCredentialsUsername = document.querySelector('[data-prop="shost.credentials.username"]');
                let elSHostCredentialsPassword = document.querySelector('[data-prop="shost.credentials.password"]');
                let elJtfeyCredentialsMode = document.querySelector('[data-prop="jtfey.credentials.mode"]');
                let elJtfeyCredentialsUsername = document.querySelector('[data-prop="jtfey.credentials.username"]');
                let elJtfeyCredentialsPassword = document.querySelector('[data-prop="jtfey.credentials.password"]');
                let elYCoinCredentialsMode = document.querySelector('[data-prop="ycoin.credentials.mode"]');
                let elYCoinCredentialsUsername = document.querySelector('[data-prop="ycoin.credentials.username"]');
                let elYCoinCredentialsPassword = document.querySelector('[data-prop="ycoin.credentials.password"]');
                let elBscadsCredentialsMode = document.querySelector('[data-prop="bscads.credentials.mode"]');
                let elBscadsCredentialsUsername = document.querySelector('[data-prop="bscads.credentials.username"]');
                let elBscadsCredentialsPassword = document.querySelector('[data-prop="bscads.credentials.password"]');

                let elPostpone = document.querySelector('[data-prop="defaults.postponeMinutes"]');
                let elPostponeMin = document.querySelector('[data-prop="defaults.postponeMinutes.min"]');
                let elPostponeMax = document.querySelector('[data-prop="defaults.postponeMinutes.max"]');
                elPostponeMin.disabled = (elPostpone.value > "0");
                elPostponeMax.disabled = (elPostpone.value > "0");
                if (elPostponeMin.disabled && elPostponeMax.disabled) {
                    elPostponeMin.value = elPostpone.value;
                    elPostponeMax.value = elPostpone.value;
                }
                elPostpone.onchange = function (e) {
                    document.querySelector('[data-prop="defaults.postponeMinutes.min"]').disabled = e.target.value > 0;
                    document.querySelector('[data-prop="defaults.postponeMinutes.max"]').disabled = e.target.value > 0;
                    if (e.target.value > 0) {
                        document.querySelector('[data-prop="defaults.postponeMinutes.min"]').value = e.target.value;
                        document.querySelector('[data-prop="defaults.postponeMinutes.max"]').value = e.target.value;
                    }
                }

                let elNextRun = document.querySelector('[data-prop="defaults.nextRun"]');
                let elNextRunMin = document.querySelector('[data-prop="defaults.nextRun.min"]');
                let elNextRunMax = document.querySelector('[data-prop="defaults.nextRun.max"]');
                let elNextRunUseCountdown = document.querySelector('[data-prop="defaults.nextRun.useCountdown"]');
                elNextRunMin.disabled = (elNextRun.value > "0");
                elNextRunMax.disabled = (elNextRun.value > "0");
                if (elNextRunMin.disabled && elNextRunMax.disabled) {
                    elNextRunMin.value = elNextRun.value;
                    elNextRunMax.value = elNextRun.value;
                }
                elNextRun.onchange = function (e) {
                    document.querySelector('[data-prop="defaults.nextRun.min"]').disabled = e.target.value > 0;
                    document.querySelector('[data-prop="defaults.nextRun.max"]').disabled = e.target.value > 0;
                    if (e.target.value > 0) {
                        document.querySelector('[data-prop="defaults.nextRun.min"]').value = e.target.value;
                        document.querySelector('[data-prop="defaults.nextRun.max"]').value = e.target.value;
                    }
                }

                let elSleepMode = document.querySelector('[data-prop="defaults.sleepMode"]');
                let elSleepModeMin = document.querySelector('[data-prop="defaults.sleepMode.min"]');
                let elSleepModeMax = document.querySelector('[data-prop="defaults.sleepMode.max"]');
                elSleepModeMin.disabled = !elSleepMode.checked;
                elSleepModeMax.disabled = !elSleepMode.checked;
                elSleepMode.onchange = function (e) {
                    document.querySelector('[data-prop="defaults.sleepMode.min"]').disabled = !e.target.checked;
                    document.querySelector('[data-prop="defaults.sleepMode.max"]').disabled = !e.target.checked;
                }

                elCredentialsMode.disabled = !elCredentialsAutologin.checked;

                elCredentialsEmail.disabled = ( (!elCredentialsAutologin.checked || elCredentialsMode.value == "2") ? true : false);
                elCredentialsPassword.disabled = ( (!elCredentialsAutologin.checked || elCredentialsMode.value == "2") ? true : false);

                // elHoursBetweenWithdraws.disabled = ( (elWithdrawMode.value == "0" || elWithdrawMode.value == "2") ? true : false);

                elCredentialsAutologin.onchange = function (e) {
                    document.querySelector('[data-prop="cf.credentials.mode"]').disabled = !e.target.checked;
                    if (elCredentialsMode.value == "2") {
                        document.querySelector('[data-prop="cf.credentials.email"]').disabled = true;
                        document.querySelector('[data-prop="cf.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="cf.credentials.email"]').disabled = false;
                        document.querySelector('[data-prop="cf.credentials.password"]').disabled = false;
                    }
                }

                elCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="cf.credentials.email"]').disabled = true;
                        document.querySelector('[data-prop="cf.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="cf.credentials.email"]').disabled = false;
                        document.querySelector('[data-prop="cf.credentials.password"]').disabled = false;
                    }
                }

                elFpigCredentialsUsername.disabled = ( (elFpigCredentialsMode.value == "2") ? true : false);
                elFpigCredentialsPassword.disabled = ( (elFpigCredentialsMode.value == "2") ? true : false);
                elFpigCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="fpb.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="fpb.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="fpb.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="fpb.credentials.password"]').disabled = false;
                    }
                }

                elSHostCredentialsUsername.disabled = ( (elSHostCredentialsMode.value == "2") ? true : false);
                elSHostCredentialsPassword.disabled = ( (elSHostCredentialsMode.value == "2") ? true : false);
                elSHostCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="shost.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="shost.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="shost.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="shost.credentials.password"]').disabled = false;
                    }
                }

                elYCoinCredentialsUsername.disabled = ( (elYCoinCredentialsMode.value == "2") ? true : false);
                elYCoinCredentialsPassword.disabled = ( (elYCoinCredentialsMode.value == "2") ? true : false);
                elYCoinCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="ycoin.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="ycoin.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="ycoin.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="ycoin.credentials.password"]').disabled = false;
                    }
                }

                elFBchCredentialsUsername.disabled = ( (elFBchCredentialsMode.value == "2") ? true : false);
                elFBchCredentialsPassword.disabled = ( (elFBchCredentialsMode.value == "2") ? true : false);
                elFBchCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="fbch.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="fbch.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="fbch.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="fbch.credentials.password"]').disabled = false;
                    }
                }

                elJtfeyCredentialsUsername.disabled = ( (elJtfeyCredentialsMode.value == "2") ? true : false);
                elJtfeyCredentialsPassword.disabled = ( (elJtfeyCredentialsMode.value == "2") ? true : false);
                elJtfeyCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="jtfey.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="jtfey.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="jtfey.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="jtfey.credentials.password"]').disabled = false;
                    }
                }

                elBscadsCredentialsUsername.disabled = ( (elBscadsCredentialsMode.value == "2") ? true : false);
                elBscadsCredentialsPassword.disabled = ( (elBscadsCredentialsMode.value == "2") ? true : false);
                elBscadsCredentialsMode.onchange = function (e) {
                    if (e.target.value == "2") {
                        document.querySelector('[data-prop="bscads.credentials.username"]').disabled = true;
                        document.querySelector('[data-prop="bsdads.credentials.password"]').disabled = true;
                    } else {
                        document.querySelector('[data-prop="bscads.credentials.username"]').disabled = false;
                        document.querySelector('[data-prop="bscads.credentials.password"]').disabled = false;
                    }
                }

                // elWithdrawMode.onchange = function (e) {
                //     if (e.target.value == "0" || e.target.value == "2") {
                //         document.querySelector('[data-prop="bk.hoursBetweenWithdraws"]').disabled = true;
                //     } else {
                //         document.querySelector('[data-prop="bk.hoursBetweenWithdraws"]').disabled = false;
                //     }
                // }

                elDevlogMaxLines.disabled = !elDevlogEnabled.checked;
                elDevlogEnabled.onchange = function (e) {
                    document.querySelector('[data-prop="devlog.maxLines"]').disabled = !e.target.checked;
                }

            };
            function loadSiteData(site, config) {
                document.querySelector('#faucet-name').innerHTML = site.name;
                document.querySelector('#faucet-name').dataset.id = site.id;
                let data = site.params || {};

                for (const prop in config) {
                    let overrideElement = document.querySelector('[data-site-prop="' + prop + '.override"]');
                    if (overrideElement) {
                        overrideElement.dataset.original = (data[prop + '.override'] ? "1" : "0");
                        overrideElement.checked = data[prop + '.override'];
                    }

                    let element = document.querySelector('[data-site-prop="' + prop + '"]');
                    if(element) {
                        if(element.type == 'select-one' || element.type == 'text' || element.type == 'password' || element.type == 'number' || element.type == 'time') {
                            element.dataset.original = data[prop] ?? config[prop];
                            element.value = data[prop] ?? config[prop];
                        } else if (element.type == 'checkbox') {
                            element.dataset.original = ((data[prop] ?? config[prop]) ? "1" : "0");
                            element.checked = data[prop] ?? config[prop];
                        }
                        element.disabled = true;
                    }
                }

                let elWorkInBackgroundOverride = document.querySelector('[data-site-prop="defaults.workInBackground.override"]');
                let elWorkInBackground = document.querySelector('[data-site-prop="defaults.workInBackground"]');
                elWorkInBackground.disabled = !elWorkInBackgroundOverride.checked;
                elWorkInBackgroundOverride.onchange = function (e) {
                    document.querySelector('[data-site-prop="defaults.workInBackground"]').disabled = !e.target.checked;
                }

                let elTimeoutOverride = document.querySelector('[data-site-prop="defaults.timeout.override"]');
                let elTimeout = document.querySelector('[data-site-prop="defaults.timeout"]');
                elTimeout.disabled = !elTimeoutOverride.checked;
                elTimeoutOverride.onchange = function (e) {
                    document.querySelector('[data-site-prop="defaults.timeout"]').disabled = !e.target.checked;
                }

                let elPostponeOverride = document.querySelector('[data-site-prop="defaults.postponeMinutes.override"]');
                let elPostpone = document.querySelector('[data-site-prop="defaults.postponeMinutes"]');
                let elPostponeMin = document.querySelector('[data-site-prop="defaults.postponeMinutes.min"]');
                let elPostponeMax = document.querySelector('[data-site-prop="defaults.postponeMinutes.max"]');
                elPostpone.disabled = !elPostponeOverride.checked;
                elPostponeMin.disabled = !elPostponeOverride.checked || (elPostpone.value > "0");
                elPostponeMax.disabled = !elPostponeOverride.checked || (elPostpone.value > "0");
                elPostponeOverride.onchange = function (e) {
                    let mode = document.querySelector('[data-site-prop="defaults.postponeMinutes"]');
                    mode.disabled = !e.target.checked;
                    document.querySelector('[data-site-prop="defaults.postponeMinutes.min"]').disabled = !e.target.checked || mode.value > 0;
                    document.querySelector('[data-site-prop="defaults.postponeMinutes.max"]').disabled = !e.target.checked || mode.value > 0;
                }
                elPostpone.onchange = function (e) {
                    document.querySelector('[data-site-prop="defaults.postponeMinutes.min"]').disabled = e.target.value > 0;
                    document.querySelector('[data-site-prop="defaults.postponeMinutes.max"]').disabled = e.target.value > 0;
                    if (e.target.value > 0) {
                        document.querySelector('[data-site-prop="defaults.postponeMinutes.min"]').value = e.target.value;
                        document.querySelector('[data-site-prop="defaults.postponeMinutes.max"]').value = e.target.value;
                    }
                }

                let elNextRunOverride = document.querySelector('[data-site-prop="defaults.nextRun.override"]');
                let elNextRun = document.querySelector('[data-site-prop="defaults.nextRun"]');
                let elNextRunMin = document.querySelector('[data-site-prop="defaults.nextRun.min"]');
                let elNextRunMax = document.querySelector('[data-site-prop="defaults.nextRun.max"]');
                let elNextRunUseCountdown = document.querySelector('[data-site-prop="defaults.nextRun.useCountdown"]');
                elNextRun.disabled = !elNextRunOverride.checked;
                elNextRunMin.disabled = !elNextRunOverride.checked || (elNextRun.value > "0");
                elNextRunMax.disabled = !elNextRunOverride.checked || (elNextRun.value > "0");
                elNextRunUseCountdown.disabled = !elNextRunOverride.checked;
                elNextRunOverride.onchange = function (e) {
                    let mode = document.querySelector('[data-site-prop="defaults.nextRun"]');
                    mode.disabled = !e.target.checked;
                    document.querySelector('[data-site-prop="defaults.nextRun.min"]').disabled = !e.target.checked || mode.value > 0;
                    document.querySelector('[data-site-prop="defaults.nextRun.max"]').disabled = !e.target.checked || mode.value > 0;
                    document.querySelector('[data-site-prop="defaults.nextRun.useCountdown"]').disabled = !e.target.checked;
                }
                elNextRun.onchange = function (e) {
                    document.querySelector('[data-site-prop="defaults.nextRun.min"]').disabled = e.target.value > 0;
                    document.querySelector('[data-site-prop="defaults.nextRun.max"]').disabled = e.target.value > 0;
                    if (e.target.value > 0) {
                        document.querySelector('[data-site-prop="defaults.nextRun.min"]').value = e.target.value;
                        document.querySelector('[data-site-prop="defaults.nextRun.max"]').value = e.target.value;
                    }
                }

                let elSleepOverride = document.querySelector('[data-site-prop="defaults.sleepMode.override"]');
                let elSleep = document.querySelector('[data-site-prop="defaults.sleepMode"]');
                let elSleepMin = document.querySelector('[data-site-prop="defaults.sleepMode.min"]');
                let elSleepMax = document.querySelector('[data-site-prop="defaults.sleepMode.max"]');
                elSleep.disabled = !elSleepOverride.checked;
                // elNextRun.disabled = !elNextRunOverride.checked;
                elSleepMin.disabled = !elSleepOverride.checked || !elSleep.checked;
                elSleepMax.disabled = !elSleepOverride.checked || !elSleep.checked;
                elSleepOverride.onchange = function (e) {
                    let mode = document.querySelector('[data-site-prop="defaults.sleepMode"]');
                    mode.disabled = !e.target.checked;
                    document.querySelector('[data-site-prop="defaults.sleepMode.min"]').disabled = !e.target.checked || !mode.checked;
                    document.querySelector('[data-site-prop="defaults.sleepMode.max"]').disabled = !e.target.checked || !mode.checked;
                }
                elSleep.onchange = function (e) {
                    document.querySelector('[data-site-prop="defaults.sleepMode.min"]').disabled = !e.target.checked;
                    document.querySelector('[data-site-prop="defaults.sleepMode.max"]').disabled = !e.target.checked;
                }

                return;
            };
            function refresh(scheduleData, promotionData, walletData, configData, siteData) {
                if (scheduleData) {
                    loadScheduleTable(scheduleData);
                }
                if (promotionData) {
                    loadPromotionTable(promotionData);
                }
                if (walletData) {
                    loadWalletTable(walletData);
                }
                if (configData) {
                    loadConfigData(configData);
                }
                if (siteData) {
                    loadSiteData(siteData.site, siteData.config);
                }
            };
            function log(msg, elapsed = false) {
                if(shared.getConfig()['devlog.enabled']) { shared.devlog(msg, elapsed) };
                if(msg) {
                    let previous = logLines[0].split('&nbsp')[1];
                    if(elapsed && (previous == msg)) {
                        logLines[0] = helpers.getPrintableTime() + '&nbsp' + msg + '&nbsp[Elapsed time:&nbsp' + elapsed + '&nbspseconds]';
                    } else {
                        logLines.pop();
                        logLines.unshift(helpers.getPrintableTime() + '&nbsp' + msg);
                    }
                    document.getElementById('console-log').innerHTML = logLines.join('<br>');
                }
            };
            return {
                init: init,
                refresh: refresh,
                loadPromotionTable: loadPromotionTable,
                log: log
            }
        },
        createCFPromotions: function() {
            let codes = [];

            function PromotionCode(id, code, repeatDaily = false, expirationDate = null, isRemoved = false) {
                this.id = id;
                this.code = code;
                this.added = new Date();
                this.statusPerFaucet = [];
                this.repeatDaily = repeatDaily;
                this.lastExecTimeStamp = null;
                this.expirationDate = expirationDate;
                this.isRemoved = isRemoved;
            };

            function getFaucetStatusInPromo(promo, faucetId) {
                let faucet = promo.statusPerFaucet.find(x => x.id == faucetId);
                if (faucet.status && promo.repeatDaily) {
                    //Using 26 hs instead of 24hs, and 2hs gap retry when code is flagged as USEDBEFORE
                    if((faucet.status == K.CF.PromoStatus.ACCEPTED && (Date.now() - faucet.execTimeStamp.getTime()) > K.Integers.HS_26_IN_MILLISECONDS)
                       || (faucet.status == K.CF.PromoStatus.USEDBEFORE && (Date.now() - faucet.execTimeStamp.getTime()) > K.Integers.HS_2_IN_MILLISECONDS)) {
                        faucet.status = K.CF.PromoStatus.PENDING;
                    }
                }
                return faucet.status ?? K.CF.PromoStatus.NOCODE;
            };

            function addNew(code, repeatDaily = false, expirationDate = null) {
                let found = codes.find(x => x.code == code);
                if (found) {
                    found.repeatDaily = repeatDaily;
                    found.expirationDate = expirationDate;
                    found.isRemoved = false;
                } else {
                    found = new PromotionCode(codes.length, code, repeatDaily, expirationDate);
                    codes.push(found);
                }

                found.statusPerFaucet = manager.getFaucetsForPromotion().map(x => {
                    return {
                        id: x.id,
                    };});
                found.statusPerFaucet.forEach(function (element, idx, arr) {
                    arr[idx].status = K.CF.PromoStatus.PENDING;
                    arr[idx].execTimeStamp = null;
                });

                // codes.push(newPromo);
                //codes.sort((a, b) => (a.id < b.id) ? 1 : -1);
                save();
            };

            function includeNewCodes(newCodes) {
                for(let i=0; i<newCodes.length; i++) {
                    let item = newCodes[i];
                    // let exists = codes.find(x => x.code.toLowerCase() == item.code.toLowerCase() && x.code.expirationDate != item.expirationDate);
                    let exists = codes.find(x => x.code.toLowerCase() == item.code.toLowerCase());
                    if (!exists) {
                        console.log(`${item.code} does not exist`);
                        addNew(item.code, !item.oneTimeOnly, item.expirationDate);
                    } else {
                        console.log(`${item.code} exists`);
                        // TODO: need to change status per faucet
                        // exists.expirationDate == item.expirationDate;
                    }
                }
            };

            function getAll() {
                // now is all with isremoved=false
                return codes.filter(x => !x.isRemoved);
            };

            function updateFaucetForCode(code, faucetId, newStatus) {
                let promo = codes.find(x => x.code == code);
                let faucet = promo.statusPerFaucet.find(x => x.id == faucetId);
                if(faucet) {
                    faucet.status = newStatus;
                    faucet.execTimeStamp = new Date();
                    promo.lastExecTimeStamp = faucet.execTimeStamp;
                }
                save();
            };

            function hasPromoAvailable(faucetId) {
                let resp = [];
                codes.forEach(function (promotion, idx, arr) {
                    let status = getFaucetStatusInPromo(promotion, faucetId);
                    if (status == K.CF.PromoStatus.PENDING && !promotion.isRemoved) {
                        resp.push(promotion.code);
                    }
                });
                if (resp.length > 0) {
                    return resp;
                } else {
                    return false;
                }
            };

            function save() {
                persistence.save('CFPromotions', codes, true);
            };

            function load(data) {
                codes = data;
                console.log({codes,});
                save();
            };

            function removeAll() {
                codes.forEach(x => x.isRemoved = true);
                codes = codes.filter(x => x.expirationDate && Date.parse(x.expirationDate) > Date.now());
                let dev = codes.map(x => {
                    return {
                        code: x.code,
                        isRemoved: x.isRemoved
                    };
                });
                console.log({dev,});
                // codes = [];
                save();
            };

            function remove(id, code) {
                let idx = codes.findIndex(x => x.id == id && x.code == code);
                if(idx != -1) {
                    codes[idx].isRemoved = true;
                    // codes.splice(idx, 1);
                    save();
                }

                return idx;
            };

            return {
                addNew: addNew,
                removeAll: removeAll,
                remove: remove,
                getAll: getAll,
                load: load,
                updateFaucetForCode: updateFaucetForCode,
                hasPromoAvailable: hasPromoAvailable,
                includeNewCodes: includeNewCodes
            }
        },
        createInteractions: function(){
            let randomInteractionLevel = K.RandomInteractionLevel.MEDIUM;
            let maxActions = 0;
            let performedActions = -1;
            let selectableElements;
            let actions = {
                available: [
                    function() {
                        $('html, body').animate({
                            scrollTop: helpers.randomInt(0, $('html, body').get(0).scrollHeight)
                        }, {
                            complete: setTimeout(interactions.addPerformed, helpers.randomMs(100, 3000)),
                            duration: helpers.randomMs(100, 1500)
                        });
                    },
                    function() {
                        let element = interactions.selectableElements[helpers.randomInt(0, interactions.selectableElements.length - 1)];

                        try {
                            if (document.body.createTextRange) {
                                const range = document.body.createTextRange();
                                range.moveToElementText(element);
                                range.select();
                            } else if (window.getSelection) {
                                const selection = window.getSelection();
                                const range = document.createRange();
                                range.selectNodeContents(element);
                                selection.removeAllRanges();
                                selection.addRange(range);
                            }
                        } catch (err) { }

                        interactions.addPerformed();
                    }
                ]
            };

            function start(selectableElements) {
                performedActions = 0;
                switch(randomInteractionLevel) {
                    case K.RandomInteractionLevel.NONE:
                        maxActions = 0;
                        break;
                    case K.RandomInteractionLevel.LOW:
                        maxActions = helpers.randomInt(2, 4);
                        break;
                    case K.RandomInteractionLevel.MEDIUM:
                        maxActions = helpers.randomInt(5, 8);
                        break;
                    case K.RandomInteractionLevel.HIGH:
                        maxActions = helpers.randomInt(12, 16);
                        break;
                }
                interactions.selectableElements = selectableElements;
                performActions();
            }

            function performActions() {
                if(performedActions >= maxActions) {
                    return;
                }
                let delay = 0;
                for(let i = 0; i < maxActions; i++) {
                    delay += helpers.randomMs(350, 1500);
                    setTimeout(actions.available[helpers.randomInt(0, actions.available.length - 1)], delay);
                }
            }

            function addPerformed() {
                performedActions++;
            }
            function completed() {
                return (performedActions >= maxActions);
            }

            return {
                start: start,
                completed: completed,
                addPerformed: addPerformed,
                selectableElements: selectableElements
            };
        },
        createSGProcessor: function() {
            let timerSpans;
            function run() {
                if(isLoading()) {
                    setTimeout(run, helpers.randomMs(5000, 10000));
                    return;
                } else if (hasPopup()) {
                    closePopup();
                    setTimeout(run, helpers.randomMs(5000, 10000));
                } else {
                    if(isMinerActive()) {
                        processRunDetails();
                    } else {
                        // Wait for captcha to be solved
                        setTimeout(run, helpers.randomMs(5000, 10000));
                        // activateMiner();
                    }
                }
            };
            function hasPopup() {
                if (document.querySelector('div.absolute.flex.top-0.right-0.cursor-pointer.p-4.text-white.md-text-gray-1')) {
                    return true;
                }
                return false;
            };
            function closePopup() {
                try {
                    shared.devlog(`@SG: closing popup`);
                    document.querySelector("div.absolute.flex.top-0.right-0.cursor-pointer.p-4.text-white.md-text-gray-1").click();
                    document.querySelector('svg.flex.w-8.h-8.fill-current').parentElement.click();
                } catch { shared.devlog(`@SG: error closing popup`); }
            };
            function isLoading() {
                return document.getElementById('loader-logo') ? true : false;
            };
            function isMinerActive() {
                timerSpans = document.querySelector('.font-bold.text-center.text-accent.w-11-12.text-18 span');

                if(timerSpans) {
                    shared.devlog(`SG: Miner is active`);
                    return true;
                } else {
                    shared.devlog(`SG: Miner is inactive`);
                    return false;
                }
                return (!!timerSpans);
            };
            function activateMiner() {
                let activateButton = document.querySelector("#region-main button.activate.block.w-full.h-full.mx-auto.p-0.rounded-full.select-none.cursor-pointer.focus-outline-none.border-0.bg-transparent");
                // let activateButton = document.querySelector('.mb-8 .wrapper button');
                if (activateButton) {
                    activateButton.click();
                    shared.devlog(`SG: Activate miner clicked`);
                    setTimeout(run, helpers.randomMs(10000, 20000));
                } else {
                    processRunDetails()
                }
            };

            function processRunDetails() {
                let result = {};
                shared.devlog(`SG: @processRunDetails`);
                result.nextRoll = helpers.addMinutes(readCountdown().toString());
                result.balance = readBalance();
                shared.closeWindow(result);
            };

            function readCountdown() {
                shared.devlog(`SG: @readCountdown`);
                let synchronizing = document.querySelector('.text-15.font-bold.text-center.text-accent'); // use
                let mins = 15;
                try {
                    let timeLeft = timerSpans.innerText.split(':');
                    if (timeLeft[0] == 'Synchronizing') {
                        //should retry to load the value
                    }
                    shared.devlog(`SG Countdown timeLeft spans:`);
                    shared.devlog(timeLeft);

                    if(timeLeft.length === 3) {
                        mins = parseInt(timeLeft[0]) * 60 + parseInt(timeLeft[1]);
                    }
                } catch (err) { shared.devlog(`SG Error reading countdown: ${err}`); }
                return mins;
            };
            function readBalance() {
                shared.devlog(`SG: @readBalance`);
                let balance = "";
                try {
                    balance = document.querySelector('span.text-accent').innerText + " BTC";
                } catch (err) { }
                return balance;
            };
            return {
                run: run,
                processRunDetails: processRunDetails
            };
        },
        createCFProcessor: function() {
            const NavigationProcess = {
                ROLLING: 1,
                PROCESSING_PROMOTION: 2,
                LOGIN: 3
            };
            let navigationProcess;
            let countdown;
            let rollButton;
            let promotionTag;
            let timeWaiting= 0;
            let loopingForErrors = false;
            let tempRollNumber = null;

            function init() {
                let urlType = helpers.cf.getUrlType(window.location.href);
                switch(urlType) {
                    case K.CF.UrlType.FREE:
                        if(localeConfig.setToEnglish) {
                            let refValue = document.querySelectorAll('.nav-item a')[4].innerHTML;
                            if (refValue != 'Settings') {
                                window.location.href = '/set-language/en';
                            }
                        }
                        addJS_Node (null, null, overrideSelectNativeJS_Functions);
                        interactions = objectGenerator.createInteractions();
                        run();
                        break;

                    case K.CF.UrlType.PROMOTION:
                        interactions = objectGenerator.createInteractions();
                        runPromotion();
                        break;

                    case K.CF.UrlType.HOME:
                        if (shared.getConfig()['cf.autologin']) {
                            addJS_Node (null, null, overrideSelectNativeJS_Functions);
                            doLogin();
                        } else {
                            shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                        }
                        break;

                    case K.CF.UrlType.CONTACTTWITTER:
                        shared.closeWithError(K.ErrorType.IP_BAN, '');
                        break;
                    default:
                        break;
                }
                return;
            }

            function run() {
                navigationProcess = NavigationProcess.ROLLING;
                displayStatusUi();
                setInterval(tryClosePopup, helpers.randomMs(3000, 6000));
                setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
            };

            function doLogin() {
                navigationProcess = NavigationProcess.LOGIN;
                displayStatusUi();

                setTimeout(findLoginForm, helpers.randomMs(2000, 5000));
            };

            function isFullyLoaded() { //Waits 55 seconds max
                if(document.readyState == 'complete' || timeWaiting == -1) {
                    document.getElementById('process-status').innerHTML = 'Interacting';
                    timeWaiting = 0;
                    interact();
                } else {
                    timeWaiting = -1;
                    document.getElementById('process-status').innerHTML = 'Waiting for document fully loaded';
                    setTimeout(isFullyLoaded, helpers.randomMs(15000, 25000));
                }
            };
            function runPromotion() {
                navigationProcess = NavigationProcess.PROCESSING_PROMOTION
                displayStatusUi();
                setTimeout(findPromotionTag, helpers.randomMs(1000, 3000));
            };
            function tryClosePopup() {
                let popupBtn = document.querySelector('.popup-close');
                if (popupBtn && popupBtn.isVisible()) {
                    shared.devlog(`Closing popup`);
                    popupBtn.click();
                }
            };
            function isRollResultVisible() {
                let rollDiv = document.querySelector('.result');
                if (rollDiv && rollDiv.isVisible() && rollDiv.innerText != '') {
                }
            };
            function waitForRollResult() {
                shared.devlog(`Looking for roll result`);
                let newNumber = -1;
                try { // intento leer el rolled number
                    newNumber = [...document.querySelectorAll('.lucky-number')].map(x => x.innerText).join('');
                    newNumber = parseInt(newNumber)
                    shared.devlog(`Roll #: ${newNumber}`);
                } catch(err) {
                    shared.devlog(`Roll #: error reading it`);
                    newNumber = null;
                }
                if (newNumber === null) { // si no logro leerlo, bajo 1 en tempRollNumber
                    shared.devlog(`Roll # is null`);
                    if (tempRollNumber < 0) {
                        tempRollNumber -= 1;
                    } else {
                        tempRollNumber = -1;
                    }
                    shared.devlog(`Temp Roll Reads: ${tempRollNumber}`);
                    if (tempRollNumber < -5) {
                        // something might be wrong, it's taking too much time. Closing
                        processRunDetails();
                        return;
                    } else {
                        // let's keep waiting
                        setTimeout(waitForRollResult, helpers.randomMs(2000, 4000));
                        return;
                    }
                }

                // tengo un numero. comparo con el guardado
                if (newNumber == tempRollNumber) {
                    timeWaiting = 0;
                    if (shared.getConfig()['cf.rollOnce']) {
                        processRunDetails();
                        return;
                    } else {
                        setTimeout(findCountdownOrRollButton, helpers.randomMs(1000, 2000));
                        return;
                    }
                } else {
                    // not the same number. save new one and keep waiting
                    tempRollNumber = newNumber;
                    setTimeout(waitForRollResult, helpers.randomMs(2000, 4000));
                    return;
                }
            };

            function findCountdownOrRollButton() {
                if( isCountdownVisible() && !isRollButtonVisible() ) {
                    timeWaiting = 0;
                    processRunDetails();
                } else if ( !isCountdownVisible() && isRollButtonVisible() ) {
                    timeWaiting = 0;
                    setTimeout(isFullyLoaded, helpers.randomMs(1000, 5000));
                } else if ( isCountdownVisible() && isRollButtonVisible() ) {
                    // if countdown 0/-1, try to roll
                    try {
                        let minLeft = document.querySelector('.minutes .digits').innerText;
                        if (minLeft < 1) {
                            timeWaiting = 0;
                            setTimeout(isFullyLoaded, helpers.randomMs(1000, 5000));
                        }
                    } catch (err) { shared.devlog(`Error on alt logic of CF roll: ${err}`); }
                } else {
                    if (timeWaiting/1000 > shared.getConfig()['defaults.timeout'] * 60) {
                        shared.closeWithError(K.ErrorType.TIMEOUT, '');
                        return;
                    }

                    timeWaiting += 3000;
                    setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
                }
            };
            function findLoginForm() {
                if ( document.querySelector('div.login-wrapper').isVisible() ) {
                    //Other possible error is if recaptcha did not load yet... so maybe wait til the web is fully loaded for low connection issues
                    let errElement = document.querySelector('.login-wrapper .error');
                    if( errElement && errElement.innerHTML != '') {
                        let errorMessage = errElement.innerText;
                        shared.closeWithError(K.ErrorType.LOGIN_ERROR, errorMessage);
                        return;
                    }
                    if(!loopingForErrors) {
                        if(shared.getConfig()['cf.credentials.mode'] == 1) {
                            timeWaiting = 0;
                            document.querySelector('.login-wrapper input[name="email"]').value = shared.getConfig()['cf.credentials.email'];
                            document.querySelector('.login-wrapper input[name="password"]').value = shared.getConfig()['cf.credentials.password'];
                            document.querySelector('.login-wrapper button.login').click();
                            loopingForErrors = true;
                        } else {
                            if(document.querySelector('.login-wrapper input[name="email"]').value != '' && document.querySelector('.login-wrapper input[name="password"]').value != '') {
                                document.querySelector('.login-wrapper button.login').click();
                                document.getElementById('process-status').innerHTML = 'Processing';
                                loopingForErrors = true;
                            } else {
                                document.getElementById('process-status').innerHTML = 'Waiting for credentials...';
                                if (timeWaiting/1000 > (shared.getConfig()['defaults.timeout'] / 1.5) * 60) {
                                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, 'No credentials were provided');
                                    return;
                                }
                            }
                        }
                    }
                }

                if (timeWaiting/1000 > shared.getConfig()['defaults.timeout'] * 60) {
                    shared.closeWithError(K.ErrorType.TIMEOUT, '');
                    return;
                }

                timeWaiting += 3000;
                setTimeout(findLoginForm, helpers.randomMs(2000, 5000));
            };
            function interact() {
                let selectables = [].concat([...document.querySelectorAll('td')], [...document.querySelectorAll('p')], [...document.querySelectorAll('th')]);

                interactions.start(selectables);
                setTimeout(waitInteractions, helpers.randomMs(2000, 4000));
            }
            function waitInteractions() {
                if(interactions.completed()) {
                    roll();
                } else {
                    setTimeout(waitInteractions, helpers.randomMs(2000, 4000));
                }
            }
            function isCountdownVisible() {
                countdown = document.querySelectorAll('.timeout-wrapper');
                return (countdown.length > 0 && countdown[0].isVisible());
            };
            function isRollButtonVisible() {
                rollButton = document.querySelectorAll('.main-button-2.roll-button.bg-2');
                return (rollButton.length > 0 && rollButton[0].isVisible());
            };
            function roll() {
                document.getElementById('process-status').innerHTML = 'Roll triggered';
                rollButton[0].click();
                tempRollNumber = -1;
                setTimeout(waitForRollResult, helpers.randomMs(4000, 7000));
            }
            function isPromotionTagVisible() {
                let pTag;
                try {
                    pTag = document.querySelectorAll('div.header-wrapper')[0];
                } catch(err) {
                    return false;
                }
                if (pTag) {
                    promotionTag = pTag;
                    return true;
                }
                return false;
            };
            function findPromotionTag() {
                if( isPromotionTagVisible() ) {
                    processRunDetails();
                } else {
                    setTimeout(findPromotionTag, helpers.randomMs(2000, 5000));
                }
            };
            function processRunDetails() {
                let result = {};
                if(navigationProcess == NavigationProcess.ROLLING) {
                    result.claimed = readClaimed();
                    result.balance = readBalance();
                    if(result.claimed != 0) {
                        result.rolledNumber = readRolledNumber();
                    }
                    // To adjust nextRoll if it failed to load before reading it:
                    let minOneHour = result.rolledNumber && result.rolledNumber != 0;
                    result.nextRoll = readCountdown(minOneHour);
                    result.balance = readBalance();
                } else if (navigationProcess == NavigationProcess.PROCESSING_PROMOTION) {
                    result = shared.getResult() || {};
                    if (!result.promoCodeResults) {
                        result.promoCodeResults = [];
                    }
                    let pc = {
                        promoCode: readPromoCode(),
                        promoStatus: readPromoStatus()
                    };

                    result.promoCodeResults.push(pc);
                    // if (result.promoStatus == K.CF.PromoStatus.ACCEPTED) {
                    //     result.nextRoll = (new Date(59000)).getTime();
                    // }
                    shared.updateWithoutClosing(result);
                    setTimeout(gotoNextPromoCode, helpers.randomMs(1000, 2500));
                    return;
                }
                shared.closeWindow(result);
            };
            function gotoNextPromoCode() {
                let codes = shared.getCurrent().params.promoCodes;
                if (!codes) {
                    shared.closeWindow();
                    return;
                }
                let pc = readPromoCode();
                let pcIdx = codes.findIndex(x => x == pc);
                if (pcIdx == -1 || pcIdx == codes.length - 1) {
                    shared.closeWindow();
                    return;
                }
                window.location.href = '/promotion/' + codes[pcIdx + 1];
            };
            function readCountdown(minOneHour = false) {
                let minsElement = document.querySelector('.timeout-container .minutes .digits');
                let mins = "0";
                if (minsElement) {
                    mins = minsElement.innerHTML;
                }
                if (mins) {
                    let estimated = helpers.addMinutes(+mins + 1);
                    let oneHour = Date.now() + (60*60*1000);
                    if (minOneHour && (oneHour > estimated) ) {
                        return oneHour;
                    }
                    return estimated;
                } else {
                    return null;
                }
            };
            function readClaimed() {
                let claimed = 0;
                try {
                    claimed = document.querySelector('.result').innerHTML;
                    claimed = claimed.trim();
                    claimed = claimed.slice(claimed.lastIndexOf(" ") + 1);
                } catch(err) { }
                return claimed;
            };
            function readRolledNumber() {
                let number = 0;
                try {
                    number = [...document.querySelectorAll('.lucky-number')].map(x => x.innerText).join('');
                    number = parseInt(number);
                } catch(err) { }
                return number;
            };
            function readBalance() {
                let balance = "";
                try {
                    balance = document.querySelector('.navbar-coins.bg-1 a').innerText;
                } catch(err) { }
                return balance;
            };
            function readPromoStatus() {
                let promoStatus = K.CF.PromoStatus.UNKNOWNERROR;
                try {
                    if(promotionTag.innerHTML.indexOf(localeConfig.stringSearches.promoCodeAccepted) > 0) {
                        return K.CF.PromoStatus.ACCEPTED;
                    } else if(promotionTag.innerHTML.indexOf(localeConfig.stringSearches.promoCodeUsed) > 0) {
                        return K.CF.PromoStatus.USEDBEFORE;
                    } else if(promotionTag.innerHTML.indexOf(localeConfig.stringSearches.promoCodeExpired) > 0) {
                        return K.CF.PromoStatus.EXPIRED;
                    } else if(localeConfig.stringSearches.promoCodeInvalid.findIndex(x => promotionTag.innerHTML.indexOf(x) > -1) == -1) {
                        return K.CF.PromoStatus.INVALID;
                    }
                } catch ( err ) { }
                return promoStatus;
            };
            function validatePromoString() {

            };
            function readPromoCode() {
                var urlSplit = window.location.href.split('/');
                return urlSplit[urlSplit.length - 1];
            };
            function displayStatusUi() {
                let wrapper = document.createElement('div');
                wrapper.innerHTML = '<div class="withdraw-button bg-2" style="top:30%; z-index:1500;" href="#">⚙️ <span id="process-status">Processing</span></div>';
                document.querySelector( 'body' ).prepend( wrapper.firstChild );
            };
            return {
                init: init
            };
        },
        createCFHistory: function() {
            let rollsMeta = [
                { id: 0, range: '0000-9885', count: 0 },
                { id: 1, range: '9886-9985', count: 0 },
                { id: 2, range: '9986-9993', count: 0 },
                { id: 3, range: '9994-9997', count: 0 },
                { id: 4, range: '9998-9999', count: 0 },
                { id: 5, range: '10000', count: 0 }
            ];

            function initOrLoad() {
                let storedData = persistence.load('CFHistory', true);
                if(storedData) {
                    rollsMeta = storedData;
                }
            };

            function addRoll(number) {
                switch(true) {
                    case (number <= 9885):
                        rollsMeta[0].count++;
                        break;
                    case (number <= 9985):
                        rollsMeta[1].count++;
                        break;
                    case (number <= 9993):
                        rollsMeta[2].count++;
                        break;
                    case (number <= 9997):
                        rollsMeta[3].count++;
                        break;
                    case (number <= 9999):
                        rollsMeta[4].count++;
                        break;
                    case (number == 10000):
                        rollsMeta[5].count++;
                        break;
                    default:
                        break;
                }
                save();
            };

            function getRollsMeta() {
                return rollsMeta.map(x => x.count);
            };

            function save() {
                persistence.save('CFHistory', rollsMeta, true);
            };

            return {
                initOrLoad: initOrLoad,
                addRoll: addRoll,
                getRollsMeta: getRollsMeta
            }
        },
        createFBProcessor: function() {
            let countdownMinutes;
            let timeout = new Timeout(this.maxSeconds);
            let captcha = new HCaptchaWidget();

            function run() {
                setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
            };
            function findCountdownOrRollButton() {
                if ( isCountdownVisible() ) {
                    timeout.restart();
                    countdownMinutes = +document.querySelectorAll('.free_play_time_remaining.hasCountdown .countdown_amount')[0].innerHTML + 1;
                    let result = {};
                    result.balance = readBalance();
                    result.nextRoll = helpers.addMinutes(countdownMinutes.toString());

                    shared.closeWindow(result);
                    return;
                }

                if ( isRollButtonVisible() ) {
                    // if (shared.getConfig()['fb.activateRPBonus']) {
                    //     if (!document.getElementById('bonus_container_free_points')) {
                    //         document.querySelector('a.rewards_link').click();
                    //         activateBonus(0);
                    //     }
                    // }

                    try {
                        let doBonus = false; // true;
                        if (doBonus) {
                            if (!document.getElementById('bonus_span_free_wof')) {
                                RedeemRPProduct('free_wof_5');
                                setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
                                return;
                            }
                        }
                    } catch { }

                    /* For 'Play without captcha accounts' */
                    if (!captcha.isUserFriendly) {
                        clickRoll()
                    } else {
                        captcha.isSolved().then(() => { clickRoll(); });
                    }
                } else {
                    setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
                }
            };
            function isCountdownVisible() {
                return document.querySelectorAll('.free_play_time_remaining.hasCountdown .countdown_amount').length > 0;
            };
            function isHCaptchaVisible() {
                let hCaptchaFrame = document.querySelector('.h-captcha > iframe');
                if (hCaptchaFrame && hCaptchaFrame.isVisible()) {
                    return true;
                }
                return false;
            };
            function isRollButtonVisible() {
                return document.getElementById('free_play_form_button').isVisible();
            };
            function clickRoll() {
                try {
                    document.getElementById('free_play_form_button').click();
                    setTimeout(processRunDetails, helpers.randomMs(3000, 10000));
                } catch (err) {
                    shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
                }
            };
            function processRunDetails() {
                if (document.getElementById('winnings').isVisible()) {
                    closePopup();

                    let result = {};
                    result.claimed = readClaimed();
                    result.balance = readBalance();
                    if(result.claimed != 0) {
                        result.rolledNumber = readRolledNumber();
                    }
                    shared.closeWindow(result);
                    return;
                }

                if (document.querySelector('.free_play_result_error').isVisible()) {
                    shared.closeWithError(K.ErrorType.ROLL_ERROR, document.querySelector('.free_play_result_error').innerHTML);
                    return;
                }

                if(document.getElementById('free_play_error').isVisible()) {
                    shared.closeWithError(K.ErrorType.ROLL_ERROR, document.querySelector('.free_play_error').innerHTML);
                    return;
                }

                if (document.getElementById('same_ip_error').isVisible()) {
                    shared.closeWithError(K.ErrorType.ROLL_ERROR, document.getElementById('same_ip_error').innerHTML);
                    return;
                }

                setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
            };
            function closePopup() {
                let closePopupBtn = document.querySelector('.reveal-modal.open .close-reveal-modal');
                if (closePopupBtn) {
                    closePopupBtn.click();
                }
            };
            function readRolledNumber() {
                let rolled = 0;
                try {
                    rolled = parseInt([... document.querySelectorAll('#free_play_digits span')].map( x => x.innerHTML).join(''));
                } catch { }
                return rolled;
            };
            function readBalance() {
                let balance = 0;
                try {
                    balance = document.getElementById('balance').innerHTML;
                } catch { }
                return balance;
            };
            function readClaimed() {
                let claimed = 0;
                try {
                    claimed = document.getElementById('winnings').innerHTML;
                } catch { }
                return claimed;
            };
            //             function activateBonus(i) {
            //                 if(document.querySelector('#reward_point_redeem_result_container_div .reward_point_redeem_result_error')) {
            //                     let closeBtn = document.querySelector('#reward_point_redeem_result_container_div .reward_point_redeem_result_box_close')
            //                     if (closeBtn.isVisible()) {
            //                         closeBtn.click();
            //                     }
            //                 } else if (document.querySelector('#reward_point_redeem_result_container_div .reward_point_redeem_result_success')) {
            //                     let closeBtn = document.querySelector('#reward_point_redeem_result_container_div .reward_point_redeem_result_box_close')
            //                     if (closeBtn.isVisible()) {
            //                         closeBtn.click();
            //                         document.querySelector('#free_play_link_li a').click();
            //                         setTimeout(findCountdownOrRollButton, helpers.randomMs(10000, 12000));
            //                         return;
            //                     }
            //                 }

            //                 try {
            //                     let redeemButtons = document.querySelectorAll('#free_points_rewards button');
            //                     redeemButtons[i].click();
            //                     i = i + 1;
            //                 } catch (err) {
            //                 }

            //                 if(i > 4) {
            //                     document.querySelector('#free_play_link_li a').click();
            //                     setTimeout(findCountdownOrRollButton, helpers.randomMs(10000, 12000));
            //                     return;
            //                 }
            //                 setTimeout(activateBonus.bind(null, i), 5000);
            //             };
            return {
                run: run
            };
        },
        createFPProcessor: function() {
            let timeout = new Timeout(this.maxSeconds);
            let captcha = new HCaptchaWidget();

            function init() {
                if(window.location.href.includes('ptc/view')) {
                    addDuration();
                    ptcSingle();
                } else if (window.location.href.includes('ptc')) {
                    ptcList();
                } else if (window.location.href.includes('account/login')) {
                    tryLogin();
                } else if (window.location.href.includes('page/user-admin')) {
                    window.location.href = 'https://faucetpay.io/ptc';
                }
                return;
            }

            function tryLogin() {
                let username = document.querySelector('input[name="user_name"');
                let password = document.querySelector('input[name="password"');
                let captcha = document.querySelector('.h-captcha > iframe');
                let btn = document.querySelector('button[type="submit"');
                if (username && password && btn && username.value != '' && password.value != '') {
                    //WAIT FOR CAPTCHA => THEN CLICK BTN
                    if ( captcha && captcha.getAttribute('data-hcaptcha-response').length > 0 ) {
                        btn.click();
                    } else {
                        setTimeout(tryLogin, helpers.randomMs(9000, 11000));
                    }
                } else {
                    shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                }
            }

            function addDuration() {
                let duration = document.querySelector('#duration');
                if(duration && !isNaN(duration.innerText)) {
                    timeout.restart(parseInt(duration.innerText));
                } else {
                    setTimeout(addDuration, 10000);
                }
            }

            function ptcList() {
                let result;
                let runMsgDiv = document.querySelector('.alert.alert-info');
                if (runMsgDiv) {
                    let runMsg = runMsgDiv.innerHTML;
                    if (runMsg.includes('invalid captcha')) {
                        // Warn? Usually an error if ptcList is refreshed
                    } else if (runMsg.includes('Good job')) {
                        // "Good job! You have been credited with 0.00000001 BTC."
                        try {
                            let idx = runMsg.search(/\d/);
                            let claimed = parseFloat(runMsg.slice(idx, idx + 10));
                            result = shared.getResult();
                            result.claimed = (result.claimed ?? 0) + claimed;
                            // result.nextRoll = helpers.addMs(helpers.getRandomMs(shared.getConfig()['fp.hoursBetweenRuns'] * 60, 2)); // Wait hoursBetweenRuns +/- 1% //TODO: SLEEP CHECK
                            shared.updateWithoutClosing(result);
                        } catch { }
                    }
                }

                if ([...document.querySelectorAll('b')].filter(x => x.innerText.includes('Whoops!')).length > 0) {
                    result = shared.getResult();
                    shared.closeWindow(result);
                    return;
                }

                let adButtons = [...document.querySelectorAll('button')].filter(x => x .innerHTML.includes('VISIT AD FOR'));

                if (adButtons.length > 0) {
                    if (shared.getConfig()['fp.randomPtcOrder']) {
                        adButtons[helpers.randomInt(0, adButtons.length-1)].click();
                    } else {
                        adButtons[0].click();
                    }
                    return;
                }

                setTimeout(ptcList, helpers.randomMs(10000, 12000));
            }

            function ptcSingle() {
                if(document.querySelector('input[name="complete"]').isVisible()) {
                    captcha.isSolved().then(() => { clickClaim(); });
                } else if (document.querySelector('body').innerText.toLowerCase().includes('ad does not exist')) {
                    window.location.href = 'https://faucetpay.io/ptc';
                } else {
                    setTimeout(ptcSingle, helpers.randomMs(5000, 6000));
                }
            }

            function clickClaim() {
                let input = document.querySelector('input[name="complete"]');
                input.focus();
                input.onclick = '';
                input.click();
                //force close with timeout in case it's still opened
                setTimeout(shared.closeWithError.bind(null, 'TIMEOUT', 'Timed out after clicking a CLAIM button.'), helpers.minToMs(shared.getConfig()['defaults.timeout']));
            }

            return {
                init: init
            };
        },
//         createBagiKeranProcessor: function() {
//             let timeout = new Timeout(this.maxSeconds);
//             let hcaptcha = new HCaptchaWidget({selector: '.h-captcha > iframe, .hcaptcha > iframe, .g-recaptcha > iframe'});
//             let captcha = new BKCaptchaWidget({selector: ''});
//             let elements = {
//                 errorDivs: function() {
//                     return document.querySelectorAll('.alert.alert-danger,article.message.danger,article.message.error,article.message.is-error');
//                 },
//                 warningDivs: function() {
//                     return document.querySelectorAll('.alert.alert-warning,article.message.warning,article.message.is-warning');
//                 },
//                 successDivs: function() {
//                     return document.querySelectorAll('.alert.alert-success,article.message.is-success');
//                 },
//                 blockCloudflare: function() {
//                     return document.querySelector('h1[data-translate="block_headline"]');
//                 },
//                 errorCloudflare: function() {
//                     if (document.title != 'Please Wait... | Cloudflare' && !document.querySelector('#cf-hcaptcha-container')) {
//                         return document.querySelector('#cf-error-details p');
//                     } else {
//                         return null;
//                     }
//                 },
//                 openLoginModalButton: function() {
//                     return document.querySelector('#submit,button[data-target="#myModal"]');
//                 },
//                 modal: function() {
//                     return document.querySelector('#myModal.show,#myModal.is-active');
//                 },
//                 addressInput: function() {
//                     return document.querySelector('input[name="address"]');
//                 },
//                 submitButton: function() {
//                     return document.querySelector('#myModal button[type="submit"]');
//                 },
//                 openClaimModalButton: function() {
//                     return document.querySelector('form button[type="submit"],button.is-link');
//                 },
//                 openWithdrawModal: function() {
//                     return document.querySelector('#submit,button[data-target="#myModal"]');
//                 },
//                 linkWithdrawMinNotReached: function() {
//                     return document.querySelector('a.btn.btn-primary.btn-block');
//                 }
//             };

//             function mapCoinToHref(coin) {
//                 switch(coin) {
//                     case 'BTC':
//                         return 'bitcoin';
//                     case 'BNB':
//                         return 'binance';
//                     case 'SOL':
//                         return 'solana';
//                     case 'XRP':
//                         return 'ripple';
//                     case 'DOGE':
//                         return 'dogecoin';
//                     case 'ETH':
//                         return 'ethereum';
//                     case 'BCH':
//                         return 'bitcoincash';
//                     case 'DASH':
//                         return 'dash';
//                     case 'DGB':
//                         return 'digibyte';
//                     case 'FEY':
//                         return 'feyorra';
//                     case 'LTC':
//                         return 'litecoin';
//                     case 'TRX':
//                         return 'tron';
//                     case 'USDT':
//                         return 'tether';
//                     case 'ZEC':
//                         return 'zcash';
//                     case 'MATIC':
//                         return 'polygon';
//                     default:
//                         return coin.toLowerCase();
//                 }
//             };

//             function pickCoin() {
//                 let linkButton;
//                 let isBagi = window.location.href.includes('bagi.co.in');
//                 let coin = isBagi ? shared.getConfig()['bkclass.bcoin'] : shared.getConfig()['bkclass.coin'];
//                 shared.devlog(`Coin to Claim: ${coin}`);
//                 if (coin == 'Random') {
//                     try {
//                         let linkButtons = document.querySelectorAll('ul.navbar-nav > li.nav-item > a,div.tabs.is-right > ul > li > a,.level-right a.button');
//                         linkButton = linkButtons[helpers.randomInt(0, linkButtons.length - 1)];
//                         shared.devlog(`Random pick: ${linkButton.innerText}`);
//                     } catch (err) {
//                         shared.devlog(`Random pick failed`);
//                         try {
//                             shared.devlog(err.message);
//                         } catch (e) {}
//                     }
//                 } else {
//                     if (isBagi) {
//                         coin = mapCoinToHref(coin);
//                         shared.devlog(`Coin mapped to: ${coin}`);
//                     }

//                     linkButton = document.querySelector(`a[href="/${coin}/"]`);
//                 }
//                 if (!linkButton) {
//                     shared.devlog(`@Link to ${coin} not found. Looking for Bitcoin link as fallback`);
//                     linkButton = document.querySelector('a[href="/BTC/"],a[href="/bitcoin/"],.level-right a.button[href="/ETH/"],.level-right a.button[href="/ethereum/"]');
//                 }
//                 if (linkButton) {
//                     shared.devlog(`@Moving to ${coin}`);
//                     linkButton.click();
//                     return;
//                 } else {
//                     shared.devlog(`@No button found. Retrying...`);
//                     setTimeout(init, helpers.randomMs(3000, 5000));
//                     return;
//                 }
//             };

//             function init() {
//                 if (window.location.href.includes('/dashboard')) {
//                     shared.devlog(`@Dashboard`);
//                     pickCoin();
//                     return;
//                 } else if(shared.getCurrent().params.doSignOut) { // Unexpected behavior with BCH @ Bagi: seems it didn't login when the previous run was TRX/USDT so it saved the roll with that address and you couldn't withdraw:
//                     //Before you can receive payments at FaucetPay.io with this address you must link it to an account. Create an account at FaucetPay.io and link your address, then come back and claim again
//                     shared.devlog(`${window.location.href} signing out`);
//                     shared.getCurrent().params.doSignOut = false;
//                     shared.saveFlowControl();
//                     window.location.href = (new URL('signout.php', window.location.href)).href;;
//                     return;
//                 }
//                 if (window.location.href.includes('captha.php')) {
//                     setTimeout(runCaptchaPage, helpers.randomMs(1000, 2000));
//                     return;
//                 } else if (window.location.href.includes('withdraw.php')) {
//                     setTimeout(runWithdraw, helpers.randomMs(1000, 2000));
//                     return;
//                 } else {
//                     setTimeout(run, helpers.randomMs(1000, 2000));
//                     return;
//                 }
//             }

//             function run() {
//                 readAlerts();
//                 processIndex();
//             };

//             function runCaptchaPage() {
//                 readAlerts();
//                 shared.clearRetries();
//                 processCaptchaPage();
//             }

//             function runWithdraw() {
//                 readAlerts();
//                 shared.clearRetries();
//                 processWithdraw();
//             }

//             function readAlerts() {
//                 let elm;

//                 elements.warningDivs().forEach(function (elem) {
//                     shared.devlog(`WARN msg detected`);
//                     if (elem && elem.innerText.toLowerCase().includes('your ip address already claimed')) {
//                         // let result = {};
//                         // result.nextRoll = helpers.addMinutes(60);
//                         shared.closeWithError(K.ErrorType.IP_ERROR, elem.innerText);
//                         // shared.closeWithError(result);
//                     } else if (elem && elem.innerText.includes('already claimed')) { // "You have already claimed in the last 60 minutes.<br>You can claim again in 59 minutes.<br>"
//                         let result = {};
//                         try {
//                             let mins = elem.innerText.split('\n')[1].replace(/\D/g, '');
//                             result.nextRoll = helpers.addMinutes(mins);
//                         } catch {
//                             result.nextRoll = helpers.addMinutes(60);
//                         } // result.nextRoll = helpers.addMinutes(60);

//                         if (shared.getCurrent().params.doWithdraw) {
//                             shared.updateWithoutClosing(result);
//                             window.location.href = (new URL('withdraw.php', window.location.href)).href;
//                         } else {
//                             shared.closeWindow(result);
//                         }
//                         return;
//                     }
//                 });

//                 elements.successDivs().forEach(function (elem) {
//                     if (elem) {
//                         if (elem.innerText.includes('claimed successfully')) { // "You've claimed successfully 2 Satoshi BTC." ...
//                             let result = {};
//                             // result.nextRoll = helpers.addMinutes(60);
//                             result.claimed = 0;

//                             try {
//                                 let val = elem.innerText.split('\n')[0].replace(/\D/g, '');
//                                 if (typeof val == 'string') {
//                                     val = +val;
//                                 }
//                                 if (Number.isInteger(val)) {
//                                     val = val / 100000000;
//                                 }

//                                 result.claimed = val;
//                             } catch { }

//                             try {
//                                 let mins = elem.innerText.split('\n')[1].replace(/\D/g, '');
//                                 result.nextRoll = helpers.addMinutes(mins);
//                             } catch {
//                                 result.nextRoll = helpers.addMinutes(mins);
//                             }

//                             if (shared.getCurrent().params.doWithdraw) {
//                                 shared.updateWithoutClosing(result);
//                                 let link = elem.querySelector('a');
//                                 if (link && link.innerText.includes('withdraw')) {
//                                     shared.devlog('Clicking: withdraw link');
//                                     link.click();
//                                     return;
//                                 } else {
//                                     window.location.href = (new URL('withdraw.php', window.location.href)).href;;
//                                 }
//                             }
//                             shared.closeWindow(result);
//                             return;
//                         } else if (elem.innerText.includes('was sent to')) { //2 satoshi was sent to <a target="_blank" href="https://faucetpay.io/page/user-admin">your account at FaucetPay.io</a>
//                             let result = {};
//                             result.claimed = 0;
//                             let val = elem.innerHTML.split(' ')[0];
//                             if (typeof val == 'string') {
//                                 val = +val;
//                             }
//                             if (Number.isInteger(val)) {
//                                 val = val / 100000000;
//                             }

//                             result.claimed = val;
//                             shared.closeWindow(result);
//                             return;
//                         }
//                     }
//                 });

//                 elm = elements.blockCloudflare();
//                 if (elm) {
//                     shared.closeWithError(K.ErrorType.IP_BAN, document.title + ' | ' + elm.innerText); // "Sorry, you have been blocked"
//                     return;
//                 }

//                 elm = elements.errorCloudflare();
//                 if (elm) {
//                     shared.closeWithError(K.ErrorType.IP_RESTRICTED, document.title + ' | ' + elm.innerText); // "Access denied | bagi.co.in used Cloudflare to restrict access" @document.title
//                     return;
//                 }

//                 elements.errorDivs().forEach(function (elem) {
//                     if (elem) {
//                         if (elem.innerText.toLowerCase().includes('vpn/proxy/tor')) { // "VPN/Proxy/Tor is not allowed on this faucet." ...
//                             shared.closeWithError(K.ErrorType.IP_ERROR, elem.innerText);
//                             return;
//                         } else if (elem.innerText.toLowerCase().includes('look valid')) { // The Bitcoin Address doesn't look valid
//                             //invalid address
//                             shared.closeWithError(K.ErrorType.ADDRESS_ERROR, elem.innerText);
//                             return;
//                         } else if (elem.innerText.toLowerCase().includes('login not valid')) { // Login Not Valid, Please reLogin
//                             // TODO: FIX => ITS NOT WORKING BECAUSE B/K REALOADS ITSELF TOO MANY TIMES
//                             // FORCE 1 RETRY as sometimes it might work
//                             if(shared.isRetrying()) {
//                                 shared.devlog(`${window.location.href} login retry failed`);
//                                 shared.closeWithError(K.ErrorType.LOGIN_ERROR, elem.innerText);
//                             } else {
//                                 shared.devlog(`${window.location.href} will retry to login`);
//                                 // @KayDee workaraound
//                                 var curLoc = window.location.href;
//                                 if (curLoc.includes('index')) {
//                                     window.location.replace(curLoc.replace('index','withdraw'));
//                                 }
//                                 else {
//                                     window.location.replace(curLoc+'index.php');
//                                 }
//                             }
//                             return;
//                         } else if (elem.innerText.toLowerCase().includes('claim not valid')) { // Claim not Valid, Please reClaim. Try again
//                             // FORCE 1 RETRY
//                             if(shared.isRetrying()) {
//                                 shared.devlog(`${window.location.href} claim retry failed`);
//                                 shared.closeWithError(K.ErrorType.CLAIM_ERROR, elem.innerText);
//                             } else {
//                                 shared.devlog(`${window.location.href} will retry to claim`);
//                                 // @KayDee workaraound
//                                 window.location.replace(window.location.href);
//                             }
//                             return;
//                         } else if (elem.innerText.toLowerCase().includes('captcha is wrong')) {
//                             // FORCE 1 RETRY
//                             if(shared.isRetrying()) {
//                                 shared.devlog(`${window.location.href} claim retry failed`);
//                                 shared.closeWithError(K.ErrorType.CLAIM_ERROR, elem.innerText);
//                             } else {
//                                 shared.devlog(`${window.location.href} will retry to claim`);
//                                 // @KayDee workaraound
//                                 window.location.replace(window.location.href);
//                             }
//                             return;
//                         } else {
//                             // Unknown issue
//                             shared.closeWithError(K.ErrorType.ERROR, elem.innerText);
//                             return;
//                         }
//                     }
//                 });

//                 elm = elements.linkWithdrawMinNotReached();
//                 if (elm) {
//                     if(elm.innerText.toLowerCase().includes('minimum withdraw')) { // Minimum Withdraw is ...
//                         shared.closeWithError(K.ErrorType.MIN_WITHDRAW_ERROR, elm.innerText);
//                         return;
//                     }
//                 }
//             }

//             async function solveCaptchas() {
//                 let promises = [];
//                 if (captcha.isUserFriendly) {
//                     shared.devlog(`BKCaptcha: YES`);
//                     promises.push(captcha.isSolved());
//                 } else {
//                     shared.devlog(`BKCaptcha: NO`);
//                 }

//                 if (hcaptcha.isUserFriendly) {
//                     shared.devlog(`HCaptcha: YES`);
//                     promises.push(hcaptcha.isSolved());
//                 } else {
//                     shared.devlog(`HCaptcha: NO`);
//                 }

//                 return Promise.all(promises);
//             }

//             function processIndex() {
//                 if (elements.modal() && elements.addressInput() && elements.submitButton()) { // 2. Fill address & click Login
//                     if(elements.addressInput().value != '') {

//                         solveCaptchas().then(() => {
//                             //   let kcInput = document.querySelector('input[name="kodecaptcha"]');
//                             if(elements.submitButton()) { // && kcInput && kcInput.value != '' ) {
//                                 shared.devlog('Clicking LOGIN');
//                                 elements.submitButton().click(); // should redirect
//                                 return;
//                             }
//                         });
//                         return;
//                         // elements.submitButton().click(); // shoud redirect but check for timeout
//                     } else {
//                         elements.addressInput().value = shared.getCurrent().params.address;
//                     }
//                     setTimeout(run, helpers.randomMs(2000, 4000));
//                     return;
//                 }

//                 if (elements.openLoginModalButton()) { // 1. Click the Get Started Button
//                     shared.devlog('Clicking: openLoginModalButton');
//                     elements.openLoginModalButton().click();
//                     timeout.restart();
//                     setTimeout(processIndex, helpers.randomMs(1000, 3000));
//                     return;
//                 }

//                 if (elements.openClaimModalButton()) { // Claim Bitcoin Button
//                     shared.devlog('Clicking: openClaimModalButton');
//                     elements.openClaimModalButton().click();
//                     timeout.restart();
//                     setTimeout(processIndex, helpers.randomMs(2000, 4000));
//                     return;
//                 }

//                 setTimeout(run, helpers.randomMs(2000, 4000));
//             };

//             function processCaptchaPage() {
//                 shared.devlog(`@processCaptchaPage`);
//                 if(elements.modal()) {
//                     solveCaptchas().then(() => {
//                         //   let kcInput = document.querySelector('input[name="kodecaptcha"]');
//                         if(elements.submitButton()) { // && kcInput && kcInput.value != '' ) {
//                             shared.devlog('Clicking SUBMIT');
//                             elements.submitButton().click(); // should redirect\
//                             return;
//                         }
//                     });
//                     return;
//                 }

//                 if (elements.openLoginModalButton()) { // 1. Click the Claim Button to open the modal w/the hCaptcha
//                     shared.devlog('Clicking: openLoginModalButton @processCaptchaPage');
//                     elements.openLoginModalButton().click();
//                     timeout.restart();
//                     setTimeout(processCaptchaPage, helpers.randomMs(1000, 3000));
//                     return;
//                 }
//                 setTimeout(runCaptchaPage, helpers.randomMs(2000, 4000));
//             }

//             function processWithdraw() {
//                 if(elements.modal()) {
//                     shared.devlog('Withdraw Modal is open');
//                     solveCaptchas().then(() => {
//                         // let kcInput = document.querySelector('input[name="kodecaptcha"]');
//                         if(elements.submitButton()) { // && kcInput && kcInput.value != '' ) {
//                             shared.devlog('Clicking SUBMIT');
//                             elements.submitButton().click(); // should redirect
//                             return;
//                         }
//                     });
//                     return;
//                 }

//                 if (elements.openWithdrawModal()) { // 1. Click the Withdraw to FaucetPay submit button to open the modal w/the hCaptcha
//                     shared.devlog('Clicking: openWithdrawModal @processWithdraw');
//                     elements.openWithdrawModal().click();
//                     timeout.restart();
//                     setTimeout(processWithdraw, helpers.randomMs(2000, 4000));
//                     return;
//                 }
//                 setTimeout(runWithdraw, helpers.randomMs(2000, 4000));
//             }

//             return {
//                 init: init
//             };
//         },
        createOkFaucetProcessor: function() {
            let timeout = new Timeout(this.maxSeconds);
            let countdownMinutes;
            let captcha = new HCaptchaWidget();

            let selectElement = {
                addressInput: function() {
                    return document.querySelector('input[type="text"]');
                },
                rollButton: function() {
                    return document.querySelector('input[type="submit"');
                },
                countdown: function() { // "You have to wait\n60 minutes"
                    let successDivs = document.querySelectorAll(".alert.alert-success");
                    if(successDivs.length == 1 && successDivs[0].isVisible()) {
                        return parseInt(successDivs[0].innerText.replace(/\D/g, ''));
                    }
                    return null;
                },
                rolledNumber: function() {
                    let successDivs = document.querySelectorAll(".alert.alert-success");
                    if(successDivs && successDivs.length > 1 && successDivs[0].isVisible()) {
                        return parseInt(successDivs[0].innerText);
                    } else {
                        return null;
                    }
                },
                claimedAmount: function() {
                    let successDivs = document.querySelectorAll(".alert.alert-success");
                    if(successDivs && successDivs.length > 1 && successDivs[0].isVisible()) {
                        let val = parseInt(successDivs[1].innerText.replace(/\D/g, ''));
                        if (Number.isInteger(val)) {
                            val = val / 100000000;
                        }

                        return val;
                    } else {
                        return null;
                    }
                },
                error: function () {
                    let errorDiv = document.querySelector(".alert.alert-danger");
                    if(errorDiv) {
                        if (errorDiv.innerText.toLowerCase().includes('not have sufficient funds')) {
                            shared.closeWithError(K.ErrorType.NO_FUNDS, errorDiv.innerText);
                        } else {
                            shared.closeWithError(K.ErrorType.ERROR, errorDiv.innerText);
                        }
                    } else {
                        return null;
                    }
                }
            };

            function init() {
                run();
            }

            function run() {
                try {
                    setTimeout(findResultCountdownOrRollButton, helpers.randomMs(12000, 15000));
                } catch (err) {
                    shared.closeWithErrors(K.ErrorType.ERROR, err);
                }
            };
            function findResultCountdownOrRollButton() {
                selectElement.error();

                if ( selectElement.countdown() ) {
                    shared.devlog(`Ok: countdown found`);
                    timeout.restart();
                    let result = {};
                    result.nextRoll = helpers.addMinutes(selectElement.countdown().toString());

                    shared.closeWindow(result);
                    return;
                }

                if ( isRollButtonVisible() ) {
                    startRoll();
                    return;
                }

                if (selectElement.claimedAmount()) {
                    processRunDetails();
                    return;
                }
                setTimeout(findResultCountdownOrRollButton, helpers.randomMs(10000, 12000));
            };
            function startRoll() {
                shared.devlog(`Ok: rollbutton found`);
                let addressInput = selectElement.addressInput();
                if (addressInput && addressInput.value != shared.getCurrent().params.address) {
                    addressInput.value = shared.getCurrent().params.address;
                    shared.devlog(`Ok: address filled`);
                }

                captcha.isSolved().then(() => { clickRoll(); });
            };
            function isHCaptchaVisible() {
                let hCaptchaFrame = document.querySelector('.h-captcha > iframe');
                if (hCaptchaFrame && hCaptchaFrame.isVisible()) {
                    return true;
                }
                return false;
            };
            function isRollButtonVisible() {
                let rollButton = selectElement.rollButton();
                return rollButton && rollButton.isVisible();
            };
            function clickRoll() {
                try {
                    shared.devlog(`Clicking roll button`);
                    selectElement.rollButton().click();
                    return;
                } catch (err) {
                    shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
                }
            };
            function processRunDetails() {
                shared.devlog(`Ok: claimedAmount found`);
                let claimedAmount = selectElement.claimedAmount();
                let rolledNumber = selectElement.rolledNumber();

                if (claimedAmount && rolledNumber) {
                    let result = {};
                    result.claimed = claimedAmount;
                    result.rolledNumber = rolledNumber;

                    shared.closeWindow(result);
                    return;
                }

                setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
            };

            return {
                init: init
            };

        },
        createBigBtcProcessor: function() {
            let timeout = new Timeout(this.maxSeconds);
            let countdownMinutes;
            let captcha = new HCaptchaWidget();
            let selectElement = {
                loadingDiv: function() {
                    let loading = document.querySelector('#loading');
                    if (loading && loading.isVisible()) {
                        return true;
                    } else {
                        return false;
                    }
                },
                addressInput: function() {
                    return document.querySelector('#login input[name="address"]');
                },
                loginButton: function() {
                    return document.querySelector('#login input[type="submit"]');
                },
                claimButton: function() {
                    return document.getElementById('claimbutn');
                },
                countdown: function() { // "You have to wait\n60 minutes"
                    let cd = document.getElementById('countdown');
                    if(cd && cd.isVisible()) {
                        return parseInt(cd.innerText);
                    }
                    return null;
                },
                claimedAmount: function() {
                    let elm = document.querySelector('.alert.alert-success.pulse'); //"Yuppie! You won 2 satoshi!"
                    if(elm && elm.isVisible()) {
                        let val = parseInt(elm.innerText.replace(/\D/g, ''));
                        if (Number.isInteger(val)) {
                            val = val / 100000000;
                        }

                        return val;
                    } else {
                        return null;
                    }
                },
                balance: function() {
                    let elm = document.querySelector('a b');
                    if (elm && elm.isVisible()) {
                        let val = parseInt(elm.innerText.replace(',', ''));
                        if (Number.isInteger(val)) {
                            val = val / 100000000;
                        }

                        return val;
                    } else {
                        return null;
                    }
                },
                error: function () {
                    return null;
                }
            };

            function init() {
                if (window.location.href.includes('/faucet')) {
                    setTimeout(runFaucet, helpers.randomMs(12000, 14000));
                    return;
                } else {
                    setTimeout(run, helpers.randomMs(3000, 5000));
                    return;
                }
            }

            function run() {
                try {
                    setTimeout(waitIfLoading, helpers.randomMs(12000, 15000));
                } catch (err) {
                    shared.closeWithErrors(K.ErrorType.ERROR, err);
                }
            };
            function doLogin() {
                let address = selectElement.addressInput();
                if(address && address.value != shared.getCurrent().params.address) {
                    address.value = shared.getCurrent().params.address;
                } else {
                    selectElement.loginButton().click();
                    return;
                }
                setTimeout( doLogin , helpers.randomMs(1000, 2000));
            };
            function waitIfLoading() {
                if ( !selectElement.loadingDiv() ) {
                    shared.devlog(`BigBtc: doing log in`);
                    doLogin();
                    return;
                } else {
                    shared.devlog(`BigBtc: waiting for login form`);
                }

                setTimeout(waitIfLoading, helpers.randomMs(5000, 7000));
            };
            function runFaucet() {
                let claimedAmount = selectElement.claimedAmount();
                if(claimedAmount) {
                    shared.devlog(`@runFaucet: has claimed amount: ${claimedAmount}`);
                    processRunDetails();
                    return;
                } else if (selectElement.countdown()) {
                    // need to wait
                    shared.devlog(`@runFaucet: has countdown: ${selectElement.countdown()}`);
                    let result = {};

                    shared.closeWindow(result);
                } else {
                    shared.devlog(`BigBtc: waiting for captcha`);
                    captcha.isSolved().then(() => { clickClaim(); });
                }
            }
            function clickClaim() {
                try {
                    shared.devlog('Clicking roll button');
                    selectElement.claimButton().click();
                    return;
                } catch (err) {
                    shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
                }
            };
            function processRunDetails() {
                shared.devlog(`BigBtc: processing results`);
                let claimedAmount = selectElement.claimedAmount();
                let balance = selectElement.balance();
                let countdown = selectElement.countdown();

                if (claimedAmount && balance) {
                    let result = {};
                    result.claimed = claimedAmount;
                    result.balance = balance;
                    // result.nextRoll = getDelayedNext();

                    shared.closeWindow(result);
                    return;
                }

                setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
            };

            return {
                init: init
            };
        },
        createBestChangeProcessor: function() {
            let timeout = new Timeout(this.maxSeconds);
            let countdownMinutes;
            let captcha = new HCaptchaWidget({selector: '.hcaptcha > iframe'});
            let elements = {
                captcha: function() {
                    return document.querySelector('.hcaptcha > iframe');
                },
                container: function() {
                    return document.querySelector('#info_bonus');
                },
                containerOpener: function() {
                    return document.querySelector('#tab_bonus a');
                },
                addressInput: function() {
                    return document.querySelector('#bonus_purse');
                },
                claimButton: function() {
                    return document.querySelector('#bonus_button');
                },
                countdown: function() { // Time left: mm:ss
                    let elm = document.querySelector('#bonus_button');
                    try {
                        if (elm.value) {
                            let timeLeft = elm.value.split(':');
                            if (timeLeft.length > 1) {
                                return parseInt(timeLeft[1]);
                            }
                        }
                    } catch (err) {
                        return null;
                    }
                },
                claimedAmount: function() {
                    let elm = document.querySelector("#bonus_status b");
                    try {
                        let sats = elm.innerText.replace(/\D/g, '');
                        return sats / 100000000;
                    } catch (err) {
                        return null;
                    }
                },
                balance: function() {
                    let elm = document.querySelector("#faucet_unpaid_balance b");
                    try {
                        let sats = elm.innerText.replace(/\D/g, '');
                        return sats / 100000000;
                    } catch (err) {
                        return null;
                    }
                }
            };

            function init() {
                run();
            }

            function run() {
                try {
                    if (!elements.container().isUserFriendly()) {
                        let co = elements.containerOpener();
                        if(co.isUserFriendly()) {
                            co.onclick = co.onmousedown;
                            co.click();
                        }
                    }
                    setTimeout(findCountdownOrRoll, helpers.randomMs(4000, 5000));
                } catch (err) {
                    shared.closeWithErrors(K.ErrorType.ERROR, err);
                }
            };
            function findCountdownOrRoll() {
                let countdown = elements.countdown();
                if(countdown) {
                    let result = { };
                    result.nextRoll = helpers.addMinutes(countdown.toString());

                    shared.closeWindow(result);
                    return;
                }

                let ai = elements.addressInput();

                if (ai.isUserFriendly()) {
                    if (ai.value != shared.getCurrent().params.address) {
                        ai.value = shared.getCurrent().params.address;
                    }
                    captcha.isSolved().then(() => { clickClaim(); });
                    return;
                }

                setTimeout(findCountdownOrRoll, helpers.randomMs(10000, 12000));
            };

            function clickClaim() {
                try {
                    shared.devlog('Clicking claim button');
                    let btn = elements.claimButton();
                    if(btn.isUserFriendly()) {
                        shared.devlog('Button found');
                        btn.click();
                        setTimeout(processRunDetails, helpers.randomMs(4000, 8000));
                    } else {
                        shared.devlog('Button not found. Retrying in 5 secs');
                        setTimeout(clickClaim, helpers.randomMs(4000, 8000));
                    }
                    return;
                } catch (err) {
                    shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
                }
            };

            function processRunDetails() {
                let claimedAmount = elements.claimedAmount();
                let balance = elements.balance();

                if (claimedAmount && balance) {
                    let result = {};
                    result.claimed = claimedAmount;
                    result.balance = balance;
                    // result.nextRoll = helpers.addMinutes(60);

                    shared.closeWindow(result);
                    return;
                }

                setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
            };

            return {
                init: init
            };
        },
    };

    function overrideSelectNativeJS_Functions () {
        window.alert = function alert (message) {
            console.log (message);
        }
    }
    function addJS_Node (text, s_URL, funcToRun) {
        var scriptNode= document.createElement ('script');
        scriptNode.type= "text/javascript";
        if (text)scriptNode.textContent= text;
        if (s_URL)scriptNode.src= s_URL;
        if (funcToRun)scriptNode.textContent = '(' + funcToRun.toString() + ')()';
        var element = document.getElementsByTagName ('head')[0] || document.body || document.documentElement;
        element.appendChild (scriptNode);
    }

    function detectWeb() {
        if(!shared.isOpenedByManager()) {
            shared.devlog(`${window.location.href} dismissed`);
            return;
        }
        shared.devlog(`${window.location.href} accepted`);

        let typeFromManager = shared.getCurrent().type;

        timer = new Timer(false, 20, typeFromManager);
        switch( typeFromManager ) {
            case K.WebType.STORMGAIN:
                SiteProcessor = objectGenerator.createSGProcessor();
                setTimeout(SiteProcessor.run, helpers.randomMs(10000, 20000));
                break;
            case K.WebType.CRYPTOSFAUCETS:
                SiteProcessor = objectGenerator.createCFProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(1000, 3000));
                break;
            case K.WebType.FREEBITCOIN:
                SiteProcessor = objectGenerator.createFBProcessor();
                setTimeout(SiteProcessor.run, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.FREELITECOIN:
                SiteProcessor = new FreeLitecoin();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.FREEETHEREUMIO:
                SiteProcessor = new FreeEthereumIo();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            // case K.WebType.BAGIKERAN:
            //     SiteProcessor = objectGenerator.createBagiKeranProcessor();
            //     setTimeout(SiteProcessor.init, helpers.randomMs(5000, 10000));
            //     break;
            case K.WebType.FAUCETPAY:
                SiteProcessor = objectGenerator.createFPProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.OKFAUCET:
                SiteProcessor = objectGenerator.createOkFaucetProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(4000, 6000));
                break;
            case K.WebType.BIGBTC:
                SiteProcessor = objectGenerator.createBigBtcProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(2000, 4000));
                break;
            case K.WebType.BESTCHANGE:
                SiteProcessor = objectGenerator.createBestChangeProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(4000, 6000));
                break;
            case K.WebType.KINGBIZ:
                SiteProcessor = new KingBiz();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.FREEDOGEIO:
                SiteProcessor = new FreeDogeIo();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.BETFURYBOX:
                SiteProcessor = new BetFuryBox(helpers.getEnumText(K.CMC, shared.getCurrent().params.cmc).toLowerCase());
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.DUTCHYROLL:
                SiteProcessor = new DutchyRoll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.FCRYPTO:
                SiteProcessor = new FCryptoRoll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.CBG:
                SiteProcessor = new CBGRoll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.FPB:
                SiteProcessor = new FPB(shared.getCurrent().params.sitePrefix);
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.G8:
                SiteProcessor = new G8();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.FREEGRC:
                SiteProcessor = new GRCRoll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.HELI:
                SiteProcessor = new Heli();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.VIE:
                SiteProcessor = new VieRoll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.O24:
                SiteProcessor = new O24Roll();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.YCOIN:
                SiteProcessor = new YCoin();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.CDIVERSITY:
                SiteProcessor = new CDiversity();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.BSCADS:
                SiteProcessor = new BscAds();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            default:
                break;
        }
    }

    // CLASSES (WIP)
    class ServerErrorRefresh {
        constructor () {
            this._refreshableTitles = [/500.*server error/, /524.*timeout/];
            this._interval = setInterval( () => {
                try {
                    let title = window.document.title;
                    if(title) {
                        if(this._refreshableTitles.some( (exp) => title.toLowerCase().match(exp) )) {
                            shared.devlog(`Refreshing site with title: ${title}`);
                            window.location.reload();
                        }
                        clearInterval(this._interval);
                    }
                } catch {}
            }, 15000);
        }
    }
    class Timeout {
        constructor(seconds) {
            this.wait = seconds || shared.getConfig()['defaults.timeout'] * 60;
            this.startedAt;
            this.interval;
            this.cb = (() => { shared.closeWithError(K.ErrorType.TIMEOUT, '') });
            this.restart();
            this._serverErrorRefresh = new ServerErrorRefresh();
        }

        get elapsed() {
            return Date.now() - this.startedAt;
        }

        restart(addSeconds = false) {
            if(this.interval) {
                clearTimeout(this.interval);
            }
            this.startedAt = Date.now();
            if(addSeconds) {
                this.wait = this.wait + addSeconds;
            }
            this.interval = setTimeout( () => { this.cb() }, this.wait * 1000);
        }
    }

    class Timer {
        constructor(isManager, delaySeconds, webType) {
            if(!useTimer || (webType && !Timer.webTypes().includes(webType))) {
                return;
            }
            this.delay = delaySeconds * 1000;

            if(!isManager) {
                this.tick();
                this.interval = setInterval(
                    () => { this.tick() }, this.delay);
            }
        }

        static webTypes() {
            return [K.WebType.FREELITECOIN, K.WebType.FREEETHEREUMIO, K.WebType.BAGIKERAN, K.WebType.BIGBTC, K.WebType.FCRYPTO, K.WebType.FPB, K.WebType.BSCADS]
        };

        startCheck(webType) {
            if(!useTimer || (webType && !Timer.webTypes().includes(webType))) {
                return;
            }
            persistence.save('lastAccess', Date.now());
            this.interval = setInterval(
                () => { this.isAlive() }, this.delay);
        }

        stopCheck() {
            if(!useTimer) {
                return;
            }
            clearInterval(timer.interval);
        }

        tick() {
            if(!useTimer) {
                return;
            }
            persistence.save('lastAccess', Date.now());
        }

        isAlive() {
            if(!useTimer) {
                return;
            }
            let now = Date.now();
            let newAccess = persistence.load('lastAccess');
            if(newAccess && (now - newAccess > this.delay)) {
                //Close working tab and force restart
                // shared.devlog(`Timer is closing the working tab`);
                // shared.addError(K.ErrorType.FORCE_CLOSED, 'Site was unresponsive or redirected');
                // manager.closeWorkingTab();
                // 20230121 : Attempt to reload original site after redirect
                shared.devlog(`Trying to reload original site instead of FORCE_CLOSED`);
                manager.reloadWorkingTab();
            }
        }
    }


    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 3000));

    class Parsers {
        static innerText(elm) { // '0.12341234' => '0.12341234'
            try {
                return elm.innerText;
            } catch (err) { }
        }
        static trimNaNs(elm) { // 'You won 0.12341234 TRX' => '0.12341234'
            try {
                return elm.innerText.replace(/[^\d.-]/g, '');
            } catch (err) { }
        }
        static splitAndIdxTrimNaNs(elm, options) { // '17.96 Coins (17.50 + 0.46)' => 17.96
            try {
                return elm.innerText.split(options.splitter)[options.idx].replace(/[^\d.-]/g, '');
            } catch (err) { }
        }
        static innerTextIntToFloat(elm) { // 'You won 1234 satoshis' => 0.00001234
            try {
                let sats = elm.innerText.replace(/\D/g, '');
                return sats / 100000000;
            } catch (err) { }
        }
        static innerTextJoinedToInt(elm) { // '7|2|9|6' => 7296
            try {
                return parseInt([... elm].map( x => x.innerText).join(''));
            } catch (err) { }
        }
        static stormGainCountdown(elm) { // '3:01:01' => 120000
            try {
                let timeLeft = elm.innerText.split(':');
                if (timeLeft[0] == 'Synchronizing') {
                    //TODO: should retry to load the value
                }

                if(timeLeft.length === 3) {
                    return parseInt(timeLeft[0]) * 60 + parseInt(timeLeft[1]);
                }
            } catch (err) {
                return null;
            }
        }
        static kingBizCountdown(elm) { // '4|2' => 42
            try {
                let itms = elm.querySelectorAll('.flip-clock-active .up');
                if (itms.length > 1 && itms[0].isVisible() && itms[1].isVisible()) {
                    return parseInt([itms[0].innerText, itms[1].innerText].join(''));
                }
            } catch (err) {
                return null;
            }
        }
        static freeGrcCountdown(elm) { // 'Wait for 53:31 before next roll' => 53
            try {
                shared.devlog(`@Parsers.freeGrcCountdown: with element [${elm}]`);
                let val = elm.innerText.split(':')[0];
                val = val.replace(/[^\d.-]/g, '');
                shared.devlog(`@Parsers.freeGrcCountdown returning`);
                return parseInt(val);
            } catch (err) {
                shared.devlog(`@Parsers.freeGrcCountdown error: ${err}`);
                return null;
            }
        }
        static bestChangeCountdown(elm) { // '00:58:35' => 58
            try {
                if (elm.value) {
                    let timeLeft = elm.value.split(':');
                    if (timeLeft.length > 1) {
                        return parseInt(timeLeft[1]);
                    }
                }
            } catch (err) {
                return null;
            }
        }
        static freeEthereumIoClaimed(elm) { // 'You won 0.12341234 TRX and rolled number 7623' => 0.12341234
            try {
                let line = elm.innerHTML;
                let idx = line.search(/0\./);
                return parseFloat(line.slice(idx, idx + 10));
            } catch (err) { }
        }
        static betFuryBoxClaimed(elm) {
            try {
                let currency = elm.querySelector('.free-box__withdraw-currency').innerText;
                let val = elm.querySelector('.free-box__need-sum').innerText.replace(/ /g,'').split('/')[1];

                // if (val.length < 10) {
                if (currency == 'Satoshi') {
                    val = val/100000000;
                }
                return val;
            } catch (err) {
                return null;
            }
        }
        static g8ClaimsLeft(elm) {
            try {
                if (elm.innerText.includes('\nYou have ')) { // 'Claim 183848 satoshi (0.00012 USD) every 20 Seconds\nYou have 70 claims left today.'
                    let val = elm.innerText.split('\nYou have ')[1].split(' ')[0];
                    // val = val/100000000;
                    return val;
                } else {
                    shared.devlog(`@Parsers.g8ClaimsLeft not read: with element [${elm}]`);
                    return null;
                }
            } catch (err) {
                shared.devlog(`@Parsers.g8ClaimsLeft not read: with element [${elm}] Error: ${err}`);
                return null;
            }
        }
        static cbgClaimed(elm) {
            try {
                if (elm.innerText.includes('was sent to')) { //?? was sent to you on...
                    let val = elm.innerText.trim().split(' ')[0];
                    if (elm.innerText.includes('oshi') || elm.innerText.includes('gwei')) {
                        val = val/100000000;
                    }
                    return val;
                } else {
                    shared.devlog(`@Parsers.cbgClaimed not read: with element [${elm}]`);
                    return null;
                }
            } catch (err) {
                shared.devlog(`@Parsers.cbgClaimed read error: with element [${elm}] Error: ${err}`);
                return null;
            }
        }
        static dutchysClaimed(elm) { // 'You Won :101  DUTCHY + 20 XP' => 101
            try {
                let splitted = elm.innerText.split('DUTCHY');
                return splitted[0].replace(/[^\d.-]/g, '');
            } catch (err) { shared.devlog(`@Parsers.dutchysClaimed, with element [${elm}] Error: ${err}`); }
        }
        static dutchysClaimedToFloat(elm) { // 'You Won :22437 ADA + 100 XP' => 0.00022437
            try {
                let sats = elm.innerText.split('+');
                sats = sats[0].replace(/\D/g, '');
                return sats / 100000000;
            } catch (err) { shared.devlog(`@Parsers.dutchysClaimedToFloat, with element [${elm}] Error: ${err}`); }
        }
        static splitAndIdxToInt(elm, options) { // '26 Minutes 23' w/spliiter='Minutes' => 26
            try {
                return parseInt(elm.innerText.split(options.splitter)[options.idx].trim());
                // return parseInt(elm.innerText.split('Minutes')[0].trim());
            } catch (err) { shared.devlog(`Error @Parsers.splitAndIdxToInt: ${err}`); }
        }
        static fromTextTimer(elm) { // '0 hours 11 minutes 1 seconds' => 12 minutes
            try {
                let hours, minutes;
                hours = +elm.innerText.split(' hours')[0].trim();
                minutes = +elm.innerText.split('hours ')[1].split('minutes')[0].trim();
                return hours * 60 + minutes + 1;
            } catch (err) { shared.devlog(`Error @Parsers.splitAndIdxToInt: ${err}`); }
        }
    }

    class CrawlerWidget {
        constructor(params) {
            if (!params || !params.selector) {
                throw new Error('CrawlerWidget requires a selector parameter');
            }
            this.context = this.context || document;
            Object.assign(this, params);
        }

        get isUserFriendly() {
            // Changed to select the element each time
            this.element = this.context.isUserFriendly(this.selector);
            return this.element;
            // this.element = this.element || this.context.isUserFriendly(this.selector);
            // return this.element;
        }
    }

    class ReadableWidget extends CrawlerWidget {
        constructor(params) {
            if (params && !params.parser) {
                params.parser = Parsers.innerText; //default parser
            }
            super(params);
        }

        get value() {
            if (this.isUserFriendly) {
                return this.parser(this.element, this.options);
            } else {
                shared.devlog(`ReadableWidget (selector: '${this.selector}') cannot be read with the assigned parser`);
                return '';
            }
        }
    }

    class TextboxWidget extends CrawlerWidget {
        get value() {
            if (!this.isUserFriendly) {
                shared.devlog(`TextboxWidget (selector: '${this.selector}') cannot be access with the assigned parser`);
                return '';
            }
            return this.element.value;
        }

        set value(newValue) {
            if (!this.isUserFriendly) {
                shared.devlog(`TextboxWidget (selector: '${this.selector}') cannot be access with the assigned parser`);
                return '';
            }
            this.element.value = newValue;
            return '';
        }
    }

    class ButtonWidget extends CrawlerWidget {
        // Overriding to select the button again, just in case fake buttons are used by the faucet
        // get isUserFriendly() {
        //     this.element = this.context.isUserFriendly(this.selector);
        //     return this.element;
        // }

        click() {
            if (this.isUserFriendly) {
                this.element.click();
                return Promise.resolve(true);
            } else {
                shared.devlog(`ButtonWidget (selector: '${this.selector}') cannot be clicked`);
            }
        }
    }

    class SubmitWidget extends CrawlerWidget {
        click() {
            shared.devlog(`SubmitWidget: click attempt`);
            if (this.isUserFriendly) {
                let frm = this.element;
                while(frm.nodeName != 'FORM' && frm.nodeName != null) {
                    frm = frm.parentElement;
                }
                if (frm.nodeName == 'FORM') {
                    shared.devlog(`SubmitWidget submitting`);
                    frm.submit();
                } else {
                    shared.devlog(`SubmitWidget form not found`);
                    return;
                }
                return Promise.resolve(true);
            } else {
                shared.devlog(`SubmitWidget (selector: '${this.selector}') cannot be trigger`);
            }
        }
    }

    class CountdownWidget extends CrawlerWidget {
        constructor(params) {
            if (params && !params.parser) {
                params.parser = Parsers.innerText; //default parser
            }
            super(params);
        }

        get timeLeft() {
            if (this.isUserFriendly) {
                return this.parser(this.element, this.options);
            } else {
                throw new Error(`CountdownWidget (selector: '${this.selector}') cannot be read`);
            }
        }
    }

    class CaptchaWidget extends CrawlerWidget {
        constructor(params) {
            super(params);
        }

        solve() { return true; }

        async isSolved() { return false; }
    }

    class HCaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: '.h-captcha > iframe',
                waitMs: [1000, 5000],
                timeoutMs: 4 * 60 * 1000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        async isSolved() {
            return wait().then( () => {
                if (this.isUserFriendly && this.element.hasAttribute('data-hcaptcha-response') && this.element.getAttribute('data-hcaptcha-response').length > 0) {
                    return Promise.resolve(true);
                }
                return this.isSolved();
            });
        }
    }

    class ImageProcessor {
        constructor(img) {
            this._img = img;
        }

        isImageComplete() {
            return this._img && this._img.complete;
        }

        createDrawer(width, height) {
            let canvas = document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            let ctx = canvas.getContext('2d');
            return {
                canvas: canvas,
                ctx: ctx
            };
        }

        getDrawer() {
            return this._drawer;
        }

        toCanvas() {
            this._drawer = this.createDrawer(this._img.width, this._img.height);
            this._drawer.ctx.drawImage(this._img, 0, 0);
        }

        foreach(filter) {
            let imgData = this._drawer.ctx.getImageData(0, 0, this._drawer.canvas.width, this._drawer.canvas.height);
            for (var x = 0; x < imgData.width; x++) {
                for (var y = 0; y < imgData.height; y++) {
                    var i = x * 4 + y * 4 * imgData.width;
                    var pixel = { r: imgData.data[i + 0], g: imgData.data[i + 1], b: imgData.data[i + 2] };

                    pixel = filter(pixel);

                    imgData.data[i + 0] = pixel.r;
                    imgData.data[i + 1] = pixel.g;
                    imgData.data[i + 2] = pixel.b;
                    imgData.data[i + 3] = 255;
                }
            }
            this._drawer.ctx.putImageData(imgData, 0, 0);
        }

        binarize (threshold) {
            var image = this._drawer.canvas.getContext('2d').getImageData(0, 0, this._drawer.canvas.width, this._drawer.canvas.height);
            for (var x = 0; x < image.width; x++) {
                for (var y = 0; y < image.height; y++) {
                    var i = x * 4 + y * 4 * image.width;
                    var brightness = 0.34 * image.data[i] + 0.5 * image.data[i + 1] + 0.16 * image.data[i + 2];
                    image.data[i] = brightness >= threshold ? 255 : 0;
                    image.data[i + 1] = brightness >= threshold ? 255 : 0;
                    image.data[i + 2] = brightness >= threshold ? 255 : 0;
                    image.data[i + 3] = 255;
                }
            }
            this._drawer.canvas.getContext('2d').putImageData(image, 0, 0);
        }

        invert(filter) {
            this.foreach(function (p) {
                p.r = 255 - p.r;
                p.g = 255 - p.g;
                p.b = 255 - p.b;
                return p;
            });
        }

        imgDataToBool(imgData) {
            let character = [];
            const data = imgData.data;
            for (let i = 0; i < imgData.data.length; i += 4) {
                let val = data[i] + data[i+1] + data[i+2];
                character.push(val == 0 ? true : false);
            }
            return character;
        }
    }

    class BKCaptchaWidget extends CaptchaWidget {
        constructor() {
            let defaultParams = {
                selector: 'img[src="antibot.php"]',
                waitMs: [1000, 5000],
                timeoutMs: 4 * 60 * 1000
            };
            super(defaultParams);
            this._imgProcessor;
            this._characters = [];
        }

        charList() {
            return [{"answer":"g","width":8,"height":9,"bools":[false,true,true,true,true,true,false,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"5","width":8,"height":10,"bools":[true,true,true,true,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"W","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"O","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"N","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,true,true,false,false,true,true,true,true,true,true,false,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,false,true,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"T","width":8,"height":10,"bools":[true,true,true,true,true,true,true,true,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"q","width":8,"height":9,"bools":[false,false,true,true,true,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true]},
                    {"answer":"l","width":4,"height":10,"bools":[true,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,true,true,true,true]},
                    {"answer":"B","width":8,"height":10,"bools":[true,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,false]},
                    {"answer":"3","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false,false]},
                    {"answer":"s","width":8,"height":7,"bools":[false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"p","width":8,"height":9,"bools":[true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,false,true,true,false,true,true,true,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"L","width":7,"height":10,"bools":[true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,true]},
                    {"answer":"Z","width":7,"height":10,"bools":[false,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,true]},
                    {"answer":"F","width":8,"height":10,"bools":[true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,true,true,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"p","width":8,"height":9,"bools":[true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,false,true,true,false,true,true,true,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"T","width":8,"height":10,"bools":[true,true,true,true,true,true,true,true,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"8","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"P","width":8,"height":10,"bools":[true,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"J","width":6,"height":10,"bools":[false,false,true,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,true,false,false,false,true,true,true,true,false,true,true,false,false,true,true,true,false,false]},
                    {"answer":"y","width":8,"height":9,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true,true,false,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"r","width":8,"height":7,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"R","width":8,"height":10,"bools":[true,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,false,false,false,true,true,false,false,true,true,false,false,true,true,false,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"M","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"d","width":8,"height":10,"bools":[false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,true,true,true,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true]},
                    {"answer":"E","width":7,"height":10,"bools":[true,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,true]},
                    {"answer":"7","width":8,"height":10,"bools":[true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"Z","width":7,"height":10,"bools":[true,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,true]},
                    {"answer":"l","width":4,"height":10,"bools":[true,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,true,true,true,true]},
                    {"answer":"K","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,false,false,true,true,false,false,true,true,false,true,true,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,false,true,true,false,false,true,true,false,false,true,true,false,false,false,true,true,false,true,true,false,false,false,false,true,true]},
                    {"answer":"6","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,false,false,false,false,true,true,true,true,false,false]},
                    {"answer":"H","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"5","width":8,"height":10,"bools":[true,true,true,true,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"Y","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"d","width":8,"height":10,"bools":[false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,true,true,true,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true]},
                    {"answer":"p","width":8,"height":9,"bools":[true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,false,true,true,false,true,true,true,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false]},
                    {"answer":"z","width":6,"height":7,"bools":[true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,true,true,false,false,false,true,true,false,false,false,true,true,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true]},
                    {"answer":"n","width":8,"height":7,"bools":[true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"a","width":8,"height":7,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,true,false,true,true,true,true,false,true,true]},
                    {"answer":"8","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"t","width":8,"height":9,"bools":[false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false]},
                    {"answer":"q","width":8,"height":9,"bools":[false,false,true,true,true,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true]},
                    {"answer":"a","width":8,"height":7,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,true,false,true,true,true,true,false,true,true]},
                    {"answer":"Z","width":7,"height":10,"bools":[true,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,true,true]},
                    {"answer":"1","width":6,"height":10,"bools":[false,false,true,true,false,false,false,true,true,true,false,false,true,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,true,true]},
                    {"answer":"m","width":8,"height":7,"bools":[true,false,true,true,false,true,true,false,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true]},
                    {"answer":"l","width":4,"height":10,"bools":[true,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,true,true,true,true]},
                    {"answer":"q","width":8,"height":9,"bools":[false,false,true,true,true,false,true,true,false,true,true,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true]},
                    {"answer":"C","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"a","width":8,"height":7,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,true,false,true,true,true,true,false,true,true]},
                    {"answer":"2","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,true,true]},
                    {"answer":"h","width":8,"height":10,"bools":[true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"F","width":7,"height":10,"bools":[true,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false]},
                    {"answer":"c","width":8,"height":7,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"P","width":8,"height":10,"bools":[true,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false]},
                    {"answer":"r","width":8,"height":7,"bools":[true,true,false,true,true,true,false,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false]},
                    {"answer":"Y","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"S","width":8,"height":10,"bools":[false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"u","width":8,"height":7,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,true,false,false,true,true,true,false,true,true]},
                    {"answer":"M","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"S","width":8,"height":10,"bools":[false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"g","width":8,"height":9,"bools":[false,true,true,true,true,true,false,true,true,true,false,false,false,true,true,true,true,true,false,false,false,true,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false,false,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,false,true,true,false,false,false,false,true,true,false,true,true,true,true,true,true,false]},
                    {"answer":"U","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"k","width":7,"height":10,"bools":[true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,true,true,false,true,true,false,true,true,false,false,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,false,false,true,true,false,false,true,true,false,true,true,false,false,false,true,true]},
                    {"answer":"4","width":8,"height":10,"bools":[false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,false,false,true,true,false,false,true,true,false,true,true,false,false,false,true,true,false,true,true,true,true,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false]},
                    {"answer":"A","width":8,"height":10,"bools":[false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"b","width":8,"height":10,"bools":[true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,true,true,true,false,false,true,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,true,false,false,true,true,false,true,true,false,true,true,true,false,false]},
                    {"answer":"I","width":6,"height":10,"bools":[true,true,true,true,true,true,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,true,true]},
                    {"answer":"o","width":8,"height":7,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false]},
                    {"answer":"i","width":6,"height":10,"bools":[false,false,true,true,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,true,true,true,true,true,true]},
                    {"answer":"C","width":8,"height":10,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"e","width":8,"height":7,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"w","width":8,"height":7,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,false,true,true,false,true,true,true,true,true,true,true,true,true,true,false,true,true,false,false,true,true,false]},
                    {"answer":"f","width":8,"height":10,"bools":[false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false]},
                    {"answer":"j","width":7,"height":12,"bools":[false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,false]},
                    {"answer":"F","width":6,"height":10,"bools":[true,true,true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,false]},
                    {"answer":"x","width":8,"height":7,"bools":[true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true]},
                    {"answer":"e","width":8,"height":7,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"G","width":8,"height":10,"bools":[false,false,true,true,true,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,true,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"0","width":8,"height":10,"bools":[false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"0","width":8,"height":10,"bools":[false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false]},
                    {"answer":"D","width":8,"height":10,"bools":[true,true,true,true,true,true,false,false,true,true,false,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,true,true,false,true,true,true,true,true,true,false,false]},
                    {"answer":"e","width":8,"height":7,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,false,true,false,false,false,false,false,false,false,true,true,false,false,false,true,true,false,false,true,true,true,true,true,false]},
                    {"answer":"X","width":8,"height":10,"bools":[true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true]},
                    {"answer":"Q","width":8,"height":10,"bools":[false,false,true,true,true,true,false,false,false,true,true,false,false,true,true,false,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,false,false,false,true,true,true,true,false,true,true,false,true,true,true,true,false,false,true,true,true,true,false,true,true,false,false,true,true,false,false,false,true,true,true,true,false,true]}];
        }

        async isReady() {
            return wait().then( () => {
                let img = document.querySelector(this.selector);
                if(img && img.complete) {
                    shared.devlog(`@BKCaptcha isReady : true`);
                    this._imgProcessor = new ImageProcessor(img);
                    return Promise.resolve(true);
                }
                shared.devlog(`@BKCaptcha isReady : false`);
                return this.isReady();
            });
        }

        async isSolved() {
            shared.devlog(`@BKCaptcha isSolved`);
            return this.isReady()
                .then( () => this.solve())
                .then( (solution) => {
                document.querySelector('input[name="kodecaptcha"]').value = solution;
                return Promise.resolve(true);
            })
                .catch(err => {
                shared.devlog(`@BKCaptcha error ${err}`);
                return Promise.reject(`Error ${err}`);
            });
        }

        preProcessImage() {
            this._imgProcessor.toCanvas();
            this._imgProcessor.binarize(200);
            this._imgProcessor.invert();
            shared.devlog(`@BKCaptcha preProcessImage: finished`);
        }

        cropCharacter(startFrom = 0) {
            let imgData = this._imgProcessor.getDrawer().ctx.getImageData(startFrom, 0, this._imgProcessor.getDrawer().canvas.width - startFrom, this._imgProcessor.getDrawer().canvas.height);
            let newBounds = { left: null, right:null, top: null, bottom: null };
            let readingCharacter = false;
            let endOfCharacter = null;

            for (var x = 0; x < imgData.width; x++) {
                if (endOfCharacter) {
                    newBounds.right = endOfCharacter;
                    break;
                }

                let isColumnEmpty = true;
                for (var y = 0; y < imgData.height; y++) {
                    var i = x * 4 + y * 4 * imgData.width;
                    var pixel = { r: imgData.data[i + 0], g: imgData.data[i + 1], b: imgData.data[i + 2] };

                    if (pixel.r + pixel.g + pixel.b == 0) {
                        if (newBounds.left == null || newBounds.left > x) {
                            newBounds.left = x;
                        }
                        if (newBounds.right == null || newBounds.right < x) {
                            newBounds.right = x;
                        }

                        if (newBounds.top == null || newBounds.top > y) {
                            newBounds.top = y;
                        }

                        if (newBounds.bottom == null || newBounds.bottom < y) {
                            newBounds.bottom = y;
                        }
                        readingCharacter = true;
                        isColumnEmpty = false;
                    }
                }

                if (isColumnEmpty && readingCharacter) {
                    endOfCharacter = x - 1;
                    break;
                }
            }

            return {
                x: startFrom + newBounds.left,
                y: newBounds.top,
                width: newBounds.right - newBounds.left + 1,
                height: newBounds.bottom - newBounds.top + 1,
                nextBegins: startFrom + newBounds.right + 1
            };
        }

        splitInCharacters() {
            let chars = [];
            let i =0;
            do {
                chars.push(this.cropCharacter( i== 0 ? 0 : chars[i-1].nextBegins ) );
                let copy = document.createElement('canvas').getContext('2d');
                copy.canvas.width = chars[i].width;
                copy.canvas.height = chars[i].height;

                let trimmedData = this._imgProcessor.getDrawer().ctx.getImageData(chars[i].x, chars[i].y, chars[i].width, chars[i].height);
                copy.putImageData(trimmedData, 0, 0);

                chars[i].bools = this._imgProcessor.imgDataToBool(trimmedData);
                chars[i].dataUrl = copy.canvas.toDataURL("image/png");

                i++;
            } while(i < 5);

            this._characters = chars;
        }

        guess(charElm) {
            let bestGuess = {
                answer: '',
                blacksMatched: 0,
                blacksMissed: 0,
                percentageBlacks: 0,
                exactMatch: false
            };

            let totalPixels = charElm.width * charElm.height;
            let totalBlacks = charElm.bools.filter(x => x === true).length;
            // console.log('Total Pixels:', totalPixels);
            // console.log('Total Blacks:', totalBlacks);
            // console.log(this.charList().length);
            this.charList().filter(x => x.answer != '').forEach( function (elm) {
                if (bestGuess.exactMatch) {
                    return;
                }
                if (charElm.width == elm.width && charElm.height == elm.height) {
                    // console.log(`${elm.answer} >> ${charElm.width} == ${elm.width} and ${charElm.height} == ${elm.height} > INSIDE`);
                    if (charElm.bools.join(',') == elm.bools.join(',')) {
                        // console.log(`EXACT MATCH!`);
                        bestGuess = {
                            answer: elm.answer,
                            percentageBlacks: 100,
                            exactMatch: true
                        };
                        return;
                    }

                    let blacksMatched = 0;
                    let blacksMissed = 0;
                    let percentageBlacks = 0;
                    for (let p = 0; p < totalPixels; p++) {
                        if (charElm.bools[p] === true || elm.bools[p] === true) {
                            if (elm.bools[p] == charElm.bools[p]) {
                                blacksMatched++;
                            } else {
                                blacksMissed++;
                            }
                        }
                    }

                    if (blacksMatched != 0 || blacksMissed != 0) {
                        percentageBlacks = blacksMatched/(blacksMatched + blacksMissed);
                    }

                    if (percentageBlacks > bestGuess.percentageBlacks) {
                        bestGuess = {
                            answer: elm.answer,
                            blacksMatched: blacksMatched,
                            blacksMissed: blacksMissed,
                            percentageBlacks: percentageBlacks
                        };
                    }
                }
            });
            return bestGuess;
        }

        async solve() {
            shared.devlog(`@BKCaptcha solve`);
            let solution = '';
            if(this._imgProcessor.isImageComplete()) {
                this.preProcessImage();
                this.splitInCharacters();

                this._characters.forEach( ch => {
                    let bestGuess = this.guess(ch);
                    solution += bestGuess.answer;
                    shared.devlog(`@BKCaptcha Guessing: ${bestGuess.answer}`);
                });
                shared.devlog(`@BKCaptcha SOLUTION: ${solution}`);
            }
            // shared.devlog(`@BKCaptcha REJECTING (WAITING)`);
            // return Promise.reject(`@BKCaptcha WAITING`);
            // return (solution.length == this._segments.qty) ? Promise.resolve(solution) : Promise.reject(solution);
            return Promise.resolve(solution);
        }
    }

    class NoCaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: 'svg.feather-check-circle',
                waitMs: 10000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        async isSolved() {
            return wait().then( () => {
                if (this.isUserFriendly) {
                    shared.devlog(`@NoCaptcha solved`);
                    return Promise.resolve(true);
                }
                shared.devlog(`@NoCaptcha waiting`);
                return this.isSolved();
            });
        }
    }

    class CBL01CaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: '',
                waitMs: 2000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        async isReady() {
            return wait(1).then( () => {
                if(this.isUserFriendly) {
                    shared.devlog(`@CBL01 isReady`);
                    return Promise.resolve(true);
                }
                return wait().then( () => { this.isReady(); });
            });
        }

        async solve() {
            let answer = document.getElementById('captchainput').value;
            if (answer != '') {
                // workaround for JJJ
                if (answer.startsWith('JJJ')) {
                    answer = answer.slice(3);
                    document.getElementById('captchainput').value = answer;
                }

                if (answer.length != 6) {
                    shared.devlog(`@CBL1 too short or too long. Refreshing`);
                    document.getElementById('captchainput').value ='';
                    window.location.reload();
                    return wait(10000).then( () => { this.solve(); });
                } else {
                    shared.devlog(`@CBL1 answer: ${answer}`);
                    return wait().then( () => { return true; } );
                }
            } else {
                return wait().then( () => { this.solve(); });
            }
        }

        async isSolved() {
            return this.isReady()
                .then( () => this.solve())
                .then( (solution) => {
                return Promise.resolve(true);
            })
                .catch(err => { shared.devlog(err); })
        }
    }

    class D1CaptchaWidget extends CaptchaWidget {
        constructor() {
            let defaultParams = {
                selector: '#submit_captcha span',
                waitMs: [1000, 5000],
                timeoutMs: 4 * 60 * 1000
            };
            super(defaultParams);
            this.selectors = {
                submitButton: '#submit',
                answerSpan: '#submit_captcha span'
            }
            this._elements = {
                submitButton: new ButtonWidget({selector: '#submit'}),
                answerSpan: new ReadableWidget({selector: '#submit_captcha span'})
            };
        }

        async isReady() {
            return wait().then( () => {
                if(this._elements.submitButton.isUserFriendly) {
                    shared.devlog(`@D1Captcha isReady`);
                    return Promise.resolve(true);
                }
                shared.devlog(`@D1Captcha waiting to be ready`);
                return this.isReady();
            });
        }

        async solve() {
            if (this._elements.answerSpan.isUserFriendly) {
                let answer = this._elements.answerSpan.value;
                answer = answer ? answer.trim() : answer;
                shared.devlog(`@D1Captcha answer: ${answer}`);
                let input = document.querySelector(`input[value="${answer}"`);
                if (input) {
                    shared.devlog(`@D1Captcha input for answer found!`);
                    helpers.alternativeClick(input.parentElement.querySelector('i'));
                    return wait().then( () => { return true; } );
                } else {
                    shared.devlog(`@D1Captcha input for answer NOT FOUND!`);
                    return Promise.reject(`@D1Captcha input NOT FOUND for answer: ${answer}`);
                }
            } else {
                shared.devlog(`@D1Captcha Answer span not found!!!`);
                return Promise.reject('Answer span not found!!!');
            }
        }

        async isSolved() {
            return this.isReady()
                .then( () => this.solve())
                .then( (solution) => {
                shared.devlog(`@D1Captcha => Solved`);
                return Promise.resolve(true);
            })
                .catch(err => { shared.devlog(err); })
        }
    }

    class Faucet {
        constructor(elements, actions = {}) {
            this._url = window.location.href;
            this._timeout = new Timeout(this.maxSeconds);
            this._elements = elements;
            this._actions = {
                preRun: false,
                preRoll: false,
                altValidation: false,
                readClaimed: true,
                readBalance: true,
                readTimeLeft: true,
                readRolledNumber: false,
                isMultiClaim: false,
                checkIfOutOfFunds: false,
                preSaveResult: false
            }
            this._actions = { ...this._actions, ...actions };
            this._params = shared.getCurrent().params || {};
            this._result = this._actions.isMultiClaim ? (shared.getProp('tempResults') || {}) : (shared.getResult() || {});
        }

        checkCloudflareError() {
            //TODO
        }

        useUrlListener() {
            if (window.onurlchange === null) {
                window.addEventListener('urlchange', (data) => {
                    if (this._url != window.location.href) {
                        shared.devlog(`Url changed from ${this._url} to ${window.location.href}`);
                        this._url = window.location.href;
                        this.resetRun();
                    }
                });
            }
        }

        resetRun() {
            wait().then( () => { this.init(); });
        }

        init() {
            throw new Error('Init not implemented!');
        }

        login() {
            throw new Error('Login not implemented!'); //return NEED_TO_LOGIN
        }

        async run(action = false) {
            if (this._actions.checkIfOutOfFunds) {
                this.checkIfOutOfFunds();
            }

            if (this._actions.preRun) {
                await wait().then( () => { this.preRun() } );;
            }

            if (!action) {
                this.detectAction().then( (resolve) => {
                    shared.devlog(`@Run - Action detected: ${resolve.action}`);
                    this.perform(resolve.action);
                });
            } else {
                this.perform(action);
            }
        }

        perform(action) {
            switch(action) {
                case 'doRoll':
                    if(this._actions.preRoll) {
                        shared.devlog(`@Run - PREROLL`);
                        this.preRoll();
                    }
                    shared.devlog(`@Run - Captcha`);
                    this._elements.captcha.isSolved().then(() => { this.clickRoll() });
                    break;
                case 'needToWait':
                    this.updateResult();
                    break;
                default:
                    break;
            }
        }

        async detectAction() {
            // shared.devlog(`@detectAction`);
            return wait().then( () => {
                if ( this.isCountdownVisible() ) {
                    return Promise.resolve({action: 'needToWait'});
                } else if ( this.isRollButtonVisible() ) {
                    return Promise.resolve({action: 'doRoll'});
                } else {
                    return this.detectAction();
                }
            });
        }

        preRoll() {
            throw new Error('PreRoll not implemented!');
        }

        preRun() {
            throw new Error('PreRun not implemented!');
        }

        altValidation() {
            throw new Error('AltValidation not implemented!');
        }

        isCountdownVisible() {
            return this._elements.countdownMinutes && this._elements.countdownMinutes.isUserFriendly;
        }

        isRollButtonVisible() {
            return this._elements.rollButton && this._elements.rollButton.isUserFriendly;
        }

        clickRoll() {
            try {
                shared.devlog('Clicking roll button');
                this._elements.rollButton.click();
                this.validateRun();
                // setTimeout(() => { this.validateRun() }, helpers.randomMs(10000, 12000));
            } catch (err) {
                shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
            }
        }

        failureValidation() {
            throw new Error('FailureValidation not implemented!');
        }

        async validateRun() {
            return wait(this._actions.useFailureValidation ? 6000 : null).then( () => {
                if (this._actions.useFailureValidation) {
                    shared.devlog('@Doing FailureValidation');
                    if (this.failureValidation()) {
                        shared.devlog('@FailureValidation true => @Incorrect captcha');
                        return;
                    }
                }
                if (this._elements.success.isUserFriendly) {
                    shared.devlog('Successful run');
                    return this.updateResult();
                } else if(this._actions.altValidation) {
                    if(this.altValidation()) {
                        shared.devlog('Alt validated');
                        return this.updateResult();
                    }
                }
                return wait(2000).then( () => { this.validateRun() });
            });
        }

        async updateResult() {
            // if (!this._actions.isMultiClaim) {
            if(this._actions.readClaimed) {
                this._result.claimed = this.readClaimed();
            }
            if(this._actions.readBalance) {
                this._result.balance = this.readBalance();
            }
            if(this._actions.readTimeLeft) {
                this._result.nextRoll = this.readNextRoll();
            }
            if(this._actions.readRolledNumber) {
                this._result.rolledNumber = this.readRolledNumber();
            }
            shared.devlog(`Result: ${JSON.stringify(this._result)}`);
            // }
            if (this._actions.isMultiClaim) {
                shared.devlog(`@updateResult as MultiClaim`);
                shared.setProp('tempResults', this._result);
                return this._actions.postRun ? this.postRun() : true;
            }
            if (this._actions.preSaveResult) {
                this.preSaveResult();
            }
            if (this._actions.updateWithoutClosing) {
                shared.updateWithoutClosing(this._result);
                return this._actions.postRun ? this.postRun() : true;
            } else {
                shared.closeWindow(this._result);
            }
        }

        readNextRoll() {
            try {
                if (this._elements.countdownMinutes && this._elements.countdownMinutes.isUserFriendly) {
                    shared.devlog(`@readNextRoll: ${helpers.addMinutes(this._elements.countdownMinutes.timeLeft)}`);
                    return helpers.addMinutes(this._elements.countdownMinutes.timeLeft);
                }
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
            //return helpers.addMinutes(60);
            return null;
        }

        readRolledNumber() {
            let rolled = 0;
            try {
                if(this._elements.rolledNumber.isUserFriendly) {
                    rolled = this._elements.rolledNumber.value;
                }
            } catch (err) { shared.devlog(`@readRolledNumber: ${err}`); }
            return rolled;
        }

        readBalance() {
            let balance = 0;
            try {
                if(this._elements.balance.isUserFriendly) {
                    balance = this._elements.balance.value;
                }
            } catch (err) { shared.devlog(`@readBalance: ${err}`); }
            return balance;
        }

        readClaimed() { //TODO: review if previous claimed should be received as arg
            let claimed = this._result.claimed ?? 0;
            if (this._actions.isMultiClaim) {
                this._oldClaimed = claimed;
                shared.devlog(`@readClaimed: oldClaimed set to ${this._oldClaimed}`);
            } else {
                shared.devlog(`@readClaimed: oldClaimed not set`);
            }

            try {
                shared.devlog(`@readClaimed: isUserFriendly => ${this._elements.claimed.isUserFriendly}`);
                if(this._elements.claimed.isUserFriendly) {
                    // shared.devlog(`@readClaimed: inside isUserFriendly`);
                    // shared.devlog(`InnerText: ${this._elements.claimed.isUserFriendly.innerText}`);
                    claimed = +claimed + +this._elements.claimed.value;
                } else {
                    shared.devlog(`@readClaimed: NOT isUserFriendly`);
                }
            } catch (err) { shared.devlog(`@readClaimed: ${err}`); }
            shared.devlog(`@readClaimed: returns ${claimed}`);
            return claimed;
        }

        checkIfOutOfFunds() {
            let divAlerts = [...document.querySelectorAll(this._elements.outOfFundsDivSelector)];
            divAlerts.forEach( function (d) {
                if (d.innerText.toLowerCase().includes('not have sufficient funds')) {
                    shared.closeWithError(K.ErrorType.FAUCET_EMPTY, d.innerText);
                    return;
                }
            });
        }
    }

    class FreeEthereumIo extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#cislo1'}),
                rollButton: new ButtonWidget({selector: '#rollform button'}),
                balance: new ReadableWidget({selector: '#cryptovalue'}),
                claimed: new ReadableWidget({selector: '#info', parser: Parsers.freeEthereumIoClaimed}),
                rolledNumber: new ReadableWidget({selector: '#numberroll'}),
                captcha: new CBL01CaptchaWidget({selector: '#captchainput' }),
                success: new ReadableWidget({selector: '#info'})
            };
            let actions = {
                readRolledNumber: true,
                useFailureValidation: true
            };
            super(elements, actions);
        }

        init() {
            let url = new URL(this._url);
            if (url.pathname == '/free/') {
                if (document.querySelector('.h-captcha > iframe')) {
                    captcha = new HCaptchaWidget();
                }
                this.run();
            } else if (url.pathname == '/') {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
            }
        }

        failureValidation() {
            let elm = document.querySelector('#info');
            if (elm && elm.innerText.toLowerCase().includes('incorrect')) {
                shared.devlog(`@CBL1 invalid answer`);
                document.getElementById('captchainput').value ='';
                window.location.reload();
                return true;
            } else {
                return false;
            }
        }
    }

    class FreeLitecoin extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#cislo1'}),
                rollButton: new ButtonWidget({selector: '#roll'}),
                balance: new ReadableWidget({selector: '#money'}),
                claimed: new ReadableWidget({selector: '#info', parser: Parsers.trimNaNs}),
                rolledNumber: new ReadableWidget({selector: '#numberroll'}),
                captcha: new CBL01CaptchaWidget({selector: '#captchainput' }),
                success: new ReadableWidget({selector: '#info'})
            };
            let actions = {
                readRolledNumber: true,
                useFailureValidation: true
            };
            super(elements, actions);
        }

        init() {
            let url = new URL(this._url);
            if (url.pathname == '/') {
                if (document.querySelector('.h-captcha > iframe')) {
                    captcha = new HCaptchaWidget();
                }
                this.run();
            } else if (url.pathname.includes('/login')) {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
            }
        }

        failureValidation() {
            let elm = document.querySelector('#numberroll');
            if (elm && elm.innerText.toLowerCase().includes('incorrect')) {
                shared.devlog(`@CBL1 invalid answer`);
                document.getElementById('captchainput').value ='';
                window.location.reload();
                return true;
            } else {
                return false;
            }
        }
    }

    class FreeDogeIo extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#cislo1'}),
                rollButton: new ButtonWidget({selector: '.btn.btn-success'}),
                balance: new ReadableWidget({selector: '#cryptovalue'}),
                claimed: new ReadableWidget({selector: '#info', parser: Parsers.freeEthereumIoClaimed}),
                rolledNumber: new ReadableWidget({selector: '#numberroll'}),
                captcha: new CBL01CaptchaWidget({selector: '#captchainput' }),
                success: new ReadableWidget({selector: '#info'})
            };
            let actions = {
                readRolledNumber: true,
                useFailureValidation: true
            };
            super(elements, actions);
        }

        init() {
            let url = new URL(this._url);
            if (url.pathname == '/free/') {
                if (document.querySelector('.h-captcha > iframe')) {
                    captcha = new HCaptchaWidget();
                }
                this.run();
            } else if (url.pathname == '/') {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
            }
        }

        failureValidation() {
            let elm = document.querySelector('#info');
            if (elm && elm.innerText.toLowerCase().includes('incorrect')) {
                shared.devlog(`@CBL1 invalid answer`);
                document.getElementById('captchainput').value = '';
                window.location.reload();
                return true;
            } else {
                return false;
            }
        }
    }

    class BetFuryBox extends Faucet {
        constructor(coinPrefix, trySpin = false) {
            let elements = {
                preRunButton: new ButtonWidget({selector: '.free-box.free-box__' + coinPrefix + ' button'}), //'#' + coinPrefix + '_free_box_withdraw_page'}),
                // captcha: new HCaptchaWidget({selector: '.free-box-withdraw__captcha iframe'}),
                captcha: new NoCaptchaWidget({ selector: '.free-box-withdraw__footer .button_red.button_center.button_fullwidth' }),
                //rollButton: new ButtonWidget({selector: '.modal__container button.button.button_md.button_red.fullwidth'}), //'#free_box_withdraw_popup'}),
                rollButton: new ButtonWidget({selector: '.free-box-withdraw__footer .button_red.button_center.button_fullwidth'}),
                success: new ReadableWidget({selector: '.modal:not(.free-box-withdraw,fury-wheel-modal), .vue-notification-template.my-notify.success'}),
                claimed: new ReadableWidget({selector: '.free-box.free-box__' + coinPrefix, parser: Parsers.betFuryBoxClaimed}),
                progressBar: new ReadableWidget({selector: '.free-box.free-box__' + coinPrefix + ' .free-box__progress-bar progress'}),
                // loggedElm: new ReadableWidget({selector: '.btn-container .btn-wallet'}),
                // notLoggedElm: new ReadableWidget({selector: '.btn-container.no-logged'}),
            };

            let actions = {
                preRun: true,
                readClaimed: true,
                readBalance: false,
                readRolledNumber: false
            };
            super(elements, actions);
            this.coinPrefix = coinPrefix;
            this.trySpin = trySpin;
        }

        init() {
            if (this._url.includes('https://betfury.io/boxes/all')) {
                this.run();
                return;
            } else {
                return;
            }
        }

        async spin() {
            shared.devlog('Spinning...');
            // TODO: wait for popup
            // Click wheel
            let clickables = document.querySelectorAll('.fury-wheel__wheel-btn, .fury-wheel__btn-wrap, .fury-wheel__btn-content, .fury-wheel__btn-img');
            if (clickables.length > 0) {
                clickables[Math.floor(Math.random()*clickables.length)].click();
                // Wait for result and save it somewhere
                // continue with the claim or just refresh the page to make it easier...
                wait(15000).then ( () => { shared.closeWindow(this._result); } );
            }
            return;
        }

        async preRun() {
            return wait().then( () => {
                try {
                    // close opened popups
                    let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw,fury-wheel-modal) .modal__btn-close');
                    // let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw) .modal__btn-close');
                    if (popup) {
                        popup.click();
                        popup.click(); // twice
                    }
                } catch (err) {}

                if (this.trySpin) {
                    let spinUnavailable = document.querySelector('.bonus.bonus_furywheel.wait');
                    if (spinUnavailable) {
                        shared.devlog('Spin not available');
                    } else {
                        let spinBtn = document.querySelector('.wheel-amin'); //bonus bonus_furywheel wait
                        if (spinBtn) {
                            shared.devlog('Attempting spin');
                            spinBtn.click();
                            wait(10000).then ( () => { this.spin() } );
                            return wait(60000).then ( () => { this.preRun(); } );
                        }
                    }
                }

                // wait for progress bar...
                if (!this._elements.progressBar || !this._elements.progressBar.isUserFriendly) {
                    return this.preRun();
                }

                if (this._elements.preRunButton.isUserFriendly) {
                    shared.devlog('@preRunButton is userfriendly');
                    if (!this._elements.preRunButton.isUserFriendly.disabled) {
                        shared.devlog('@preRunButton is userfriendly and enabled');
                        return this._elements.preRunButton.click();
                    } else {
                        this._timeout.restart();
                        shared.closeWindow(this._result);
                        return;
                    }
                } else if (document.querySelectorAll('.free-box').length > 1) {
                    shared.devlog('list of boxes is userfriendly');
                    shared.closeWithError(K.ErrorType.ERROR, 'Box might not exist for your account.');
                    return;
                }
                return this.preRun();
            });
        }

        // Custom Run Validation
        async validateRun() {
            shared.devlog('@validate BF');
            return wait(7000).then( () => {
                let gtHook = document.querySelector('div.geetest_slice_bg');
                if (gtHook) {
                    if (gtHook.isUserFriendly()) {
                        shared.devlog('@validate: gt hook present');
                        return this.validateRun();
                    }
                    shared.devlog('@validate: gt hook present but not user friendly');
                }
                let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw,fury-wheel-modal) .modal__btn-close');
                if (!popup) {
                    shared.devlog('@validate post run popup not found');
                    if (this._elements.preRunButton.isUserFriendly && !this._elements.preRunButton.isUserFriendly.disabled) {
                        shared.devlog('@valide trying re-click');
                        this._elements.preRunButton.click();
                        return this.validateRun();
                    }
                } else {
                    shared.devlog('@validate post run popup found');
                    try {
                        // let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw) .modal__btn-close');
                        if (popup) {
                            popup.click();
                            popup.click();
                        }
                    } catch (err) {}
                }

                if (this._elements.success.isUserFriendly) {
                    shared.devlog('@validate BF Successful run');
                    return this.updateResult();
                } else if(this._actions.altValidation) {
                    if(this.altValidation()) {
                        shared.devlog('Alt validated');
                        return this.updateResult();
                    }
                }
                return this.validateRun();
            });
        }
    }

    class KingBiz extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#show_countdown_clock', parser: Parsers.kingBizCountdown}),
                rollButton: new ButtonWidget({selector: 'input[value="ROLL"]:last-of-type'}),
                balance: new ReadableWidget({selector: 'li.top_balance', parser: Parsers.trimNaNs}),
                claimed: new ReadableWidget({selector: '#modal_header_msg', parser: Parsers.freeEthereumIoClaimed}),
                rolledNumber: new ReadableWidget({selector: '#show_roll_numbers span', parser: Parsers.innerTextJoinedToInt}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: '#show_roll_numbers span'})
            };
            let actions = {
                readRolledNumber: true,
                preRun: true
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('/faucet')) {
                this.run();
                return;
            } else if (this._url.includes('/login')) {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                return;
            }
        }

        async preRun() {
            let dangerDivs = document.querySelectorAll('.alert.alert-danger');

            if (dangerDivs.length > 0) {
                let flag = [...dangerDivs].find(x => x.innerText.includes('you need to confirm your email'));
                let txt = dangerDivs[0].innerText;
                if (flag) {
                    return shared.closeWithError(K.ErrorType.VERIFY_EMAIL, 'You need to verify your email address at the site. Go to ' + (new URL('settings', window.location)).href + ' to send the email.');
                }
            }
        }
    }

    class CPUFaucet extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#refilltimer', parser: Parsers.stormGainCountdown}), // <span id="refilltimer">00:47:19</span>
                rollButton: new ButtonWidget({selector: '#enablebtncaptca'}),
                balance: new ReadableWidget({selector: '#topcoins', parser: Parsers.trimNaNs}),
                claimed: new ReadableWidget({selector: '#modal_header_msg', parser: Parsers.freeEthereumIoClaimed}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: '#show_roll_numbers span'})
            };
            let actions = {
                readRolledNumber: false,
                preRun: false,
                altValidation: true
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('/faucet')) {
                // Pick faucet
                // Faucet list: let abc = [...document.querySelectorAll('.faucet-list-item')].map(x => x.parentElement)
                this.run();
                return;
            } else if (this._url.includes('/login')) {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                return;
            } else if (this._url.endsWith('_faucet')) {
                // Click claim now
                // Button might be: document.querySelector('.coinpayu-faucet-claim-msg button')
            } else if (this._url.endsWith('/claim')) {
                // Click to see captcha.. maybe: document.querySelector('.faucet-claim-box-button button')
                // and good luck...
            }
        }
    }

    class Heli extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#refilltimer', parser: Parsers.stormGainCountdown}), // <span id="refilltimer">00:47:19</span>
                rollButton: new ButtonWidget({selector: '#enablebtncaptca'}),
                balance: new ReadableWidget({selector: '#topcoins', parser: Parsers.trimNaNs}),
                claimed: new ReadableWidget({selector: '#modal_header_msg', parser: Parsers.freeEthereumIoClaimed}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: '#show_roll_numbers span'})
            };
            let actions = {
                readRolledNumber: false,
                preRun: false,
                altValidation: true
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('/coins.php')) {
                this.run();
                return;
            } else if (this._url.includes('/login.php')) {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                return;
            }
        }

        isCountdownVisible() {
            return this._elements.countdownMinutes && this._elements.countdownMinutes.isUserFriendly && this._elements.countdownMinutes.isUserFriendly.innerText != '00:00:00';
        }

        readClaimed() { // read from doc load function
            shared.devlog(`@Heli readClaimed`);
            let claimed = this._result.claimed ?? 0;
            try {
                let fLoad = document.body.onload;
                if (fLoad) {
                    fLoad = fLoad.toString().split('Successfully claimed ');
                    if (fLoad.length > 0) {
                        fLoad = fLoad[1].split(' ');
                        shared.devlog(`@Heli readClaimed => ${fLoad[0]}`);
                        claimed = +fLoad[0];
                    }
                }
            } catch (err) {
                shared.devlog(`@Heli readClaimed error: ${err}`);
            }
            return claimed;
        }
    }

    class CBGRoll extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: 'p.alert.alert-info', parser: Parsers.trimNaNs}),
                // rollButton: new SubmitWidget({selector: '#wpbf-claim-form'}),
                rollButton: new SubmitWidget({selector: '#wpbf-claim-form input[type="submit"]'}),
                claimed: new ReadableWidget({selector: 'div.alert.alert-success', parser: Parsers.cbgClaimed}),
                captcha: new HCaptchaWidget(),
                addressInput: new TextboxWidget({ selector: '#wpbf_address' }),
                success: new ReadableWidget({selector: 'div.alert.alert-success a[href="https://faucetpay.io/?r=2480995"]'})
            };
            let actions = {
                readRolledNumber: false,
                readClaimed: true,
                readBalance: false,
                preRun: true,
                preSaveResult: true
            };
            super(elements, actions);
        }

        init() {
            this._docType = (window != window.top ? 'IFRAME' : 'TOP');
            shared.devlog(`@CBG init (${window.location.host}) => ${this._docType}`);
            if (this._docType == 'IFRAME') {
                this.run();
                return;
            } else if(this._docType == 'TOP' && window.location.host.includes('.cryptobaggiver.com')) {
                // running iframe as top
                this.run();
                return;
            } else {
                //TODO: wait and close after claiming on the iframe
                return;
            }
        }

        async preRun() {
            shared.devlog(`@CBG preRun`);
            //TODO: fill INPUT ADDRESS

            let dangerDivs = document.querySelectorAll('div.alert.alert-danger');

            if (dangerDivs.length > 0) {
                return shared.closeWithError(K.ErrorType.ERROR, dangerDivs[0].innerText);
            }

            if (this._elements.addressInput.isUserFriendly) {
                if (this._elements.addressInput.value != shared.getCurrent().params.address) {
                    shared.devlog(`@CBG addressInput Found. Using ${shared.getCurrent().params.address}`);
                    this._elements.addressInput.value = shared.getCurrent().params.address;
                } else {
                    shared.devlog(`@CBG addressInput already filled`);
                }
            } else {
                shared.devlog(`@CBG addressInput not found`);
                return this.preRun();
            }

            return true;
        }

        async detectAction() {
            shared.devlog(`@CBGdetectAction Custom (${this._docType})`);
            return wait().then( () => {
                if ( this.isCountdownVisible() ) {
                    shared.devlog('needToWait');
                    return Promise.resolve({action: 'needToWait'});
                } else if ( this.isRollButtonVisible() ) {
                    shared.devlog('doRoll');
                    return Promise.resolve({action: 'doRoll'});
                } else if ( this._elements.success.isUserFriendly ) {
                    shared.devlog('Successful run');
                    return this.updateResult();
                } else {
                    return this.detectAction();
                }
            });
        }

        clickRoll() {
            try {
                shared.devlog('Clicking roll button');
                Element.prototype._addEventListener = Element.prototype.addEventListener;
                Element.prototype.addEventListener = function () {
                    let args = [...arguments]
                    let temp = args[1];
                    args[1] = function () {
                        let args2 = [...arguments];
                        args2[0] = Object.assign({}, args2[0])
                        args2[0].isTrusted = true;
                        return temp(...args2);
                    }
                    return this._addEventListener(...args);
                }
                this._elements.rollButton.click();
                this.validateRun();
                // setTimeout(() => { this.validateRun() }, helpers.randomMs(10000, 12000));
            } catch (err) {
                shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
            }
        }

        preSaveResult() {
            if (this._docType == 'IFRAME') {
                this._result.closeParentWindow = true;
            } else if(this._docType == 'TOP' && window.location.host.includes('.cryptobaggiver.com')) {
                this._result.closeParentWindow = true;
            }
        }
    }

    class G8 extends Faucet {
        constructor() {
            let elements = {
                preRunButton: new ButtonWidget({selector: 'button[data-target="#captchaModal"]'}),
                claimsLeft: new ReadableWidget({selector: '.alert.alert-info.fade.show', parser: Parsers.g8ClaimsLeft}),
                rollButton: new ButtonWidget({selector: '#login'}),
                claimed: new ReadableWidget({selector: '.alert.alert-success.fade.show', parser: Parsers.cbgClaimed}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: '.alert.alert-success.fade.show'}),
                addressInput: new TextboxWidget({ selector: '#address' }),
                outOfFundsDivSelector: '.alert.alert-danger'
            };
            let actions = {
                readTimeLeft: false,
                readRolledNumber: false,
                readClaimed: true,
                readBalance: false,
                preRun: true,
                checkIfOutOfFunds: true
            };
            super(elements, actions);
        }

        init() {
            shared.devlog(`@G8 init`);
            this.run();
            return;
        }

        async preRun() {
            shared.devlog(`@G8 preRun`);
            return wait().then( () => {
                if (document.querySelectorAll('.alert.alert-danger.fade.show').length > 0) {
                    let divErrMsg = document.querySelectorAll('.alert.alert-danger.fade.show')[0].innerText;
                    shared.devlog(`@G8 Claim error message: ${divErrMsg}`);
                    if(divErrMsg != 'Session invalid, try again') {
                        shared.closeWithError(K.ErrorType.ERROR, divErrMsg);
                        return;
                    }
                }

                if(this._elements.claimsLeft.isUserFriendly) {
                    shared.devlog(`@G8 ClaimsLeft Check`);
                    try {
                        shared.devlog(`@G8 ClaimsLeft: ${this._elements.claimsLeft.value}`);
                        if (+this._elements.claimsLeft.value <= 0) {
                            shared.closeWithError(K.ErrorType.ERROR, 'No more claims left today');
                            return;
                        }
                    } catch (err) {
                        shared.devlog(`@G8 ClaimsLeft: error reading claims left: ${err}`);
                    }
                }


                if (this._elements.preRunButton.isUserFriendly) {
                    shared.devlog(`@preRunButton is userfriendly`);
                    if (this._elements.addressInput.isUserFriendly) {
                        if (this._elements.addressInput.value != shared.getCurrent().params.address) {
                            this._elements.addressInput.value = shared.getCurrent().params.address;
                        }

                        if (!this._elements.preRunButton.isUserFriendly.disabled) {
                            return this._elements.preRunButton.click();
                        }
                    }
                }
                return this.preRun();
            });
        }

        async detectAction() {
            shared.devlog(`@detectAction Custom`);
            return wait().then( () => {
                if ( this.isCountdownVisible() ) {
                    return Promise.resolve({action: 'needToWait'});
                } else if ( this.isRollButtonVisible() ) {
                    return Promise.resolve({action: 'doRoll'});
                } else if ( this._elements.success.isUserFriendly ) {
                    shared.devlog('Successful run');
                    return this.updateResult();
                } else {
                    return this.detectAction();
                }
            });
        }
    }

    class DutchyRoll extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#timer', parser: Parsers.splitAndIdxToInt, options: { splitter: 'Minutes', idx: 0} }), // "26 Minutes 23"
                captcha: new HCaptchaWidget(),
                rollButton: new ButtonWidget({selector: '#claim'}), //w/booster video: '#unlockbutton' & then #claim_boosted
                success: new ReadableWidget({selector: '.card.green.pulse p,.card.blue.pulse,.card.green.animated,.card.green.pulse'}),
                claimed: new ReadableWidget({selector: '.card.green.pulse p,.card.blue.pulse,.card.green.animated,.card.green.pulse', parser: Parsers.freeEthereumIoClaimed}) //"You Won 0.00409070 TRX + 20 XP"
            };
            let actions = {
                preRun: true,
                readClaimed: true,
                readBalance: false,
                readRolledNumber: false
            };
            super(elements, actions);
        }

        init() {
            switch(window.location.host) {
                case 'autofaucet.dutchycorp.space':
                    if (this._url.includes('/roll.php')) {
                        this._elements.claimed = new ReadableWidget({selector: '.card.green.pulse p,.card.blue.pulse,.card.green.animated,.card.green.pulse', parser: Parsers.dutchysClaimed})
                    } else if (this._url.includes('/login.php')) {
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                        return;
                    }
                    break;
                case 'express.dutchycorp.space':
                    if (this._url.includes('/roll.php')) {
                        this._elements.claimed = new ReadableWidget({selector: '.card.green.pulse p,.card.blue.pulse,.card.green.animated,.card.green.pulse', parser: Parsers.dutchysClaimed})
                    } else if (this._url.includes('/coin_roll.php')) {
                        this._elements.claimed = new ReadableWidget({selector: '.card.green.pulse p,.card.blue.pulse,.card.green.animated,.card.green.pulse', parser: Parsers.dutchysClaimedToFloat})
                    } else if (this._url.includes('/index.php')) {
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, 'You need to login using ExpressCrypto (EC-UserId-XXXXXX).');
                        return;
                    }
                    break;
            }
            this.run();
            return;
        }

        async preRun() {
            if (this._elements.captcha.isUserFriendly) {
                if (shared.getConfig()['dutchy.useBoosted']) {
                    this._elements.rollButton = new ButtonWidget({selector: '#unlockbutton'});
                    this._elements.confirmBoost = new ButtonWidget({selector: '#claim_boosted'});
                    setInterval(() => {
                        shared.devlog(`@boost wait`);
                        try {
                            shared.devlog(`this._elements.confirmBoost`);
                            if (this._elements.confirmBoost.isUserFriendly) {
                                shared.devlog(`@boost clicking`);
                                this._elements.confirmBoost.click();
                            }
                        } catch (err) {}
                    }, 8000);
                }
                return true;
            } else {
                return wait().preRun();
                // if (document.readyState === 'complete') {
                //     shared.closeWithError(K.ErrorType.Error, `You need to set hCaptcha as default at ${(new URL('account.php', this._url)).href}`);
                // } else {
                //     return wait().preRun();
                // }
            }
        }
    }

    class YCoin extends Faucet {
        constructor() {
            let elements = {
                rollButton: new ButtonWidget({selector: 'input[type="submit"][value="Get Free Crypto!"]'}),
                claimed: new ReadableWidget({selector: 'div.alert.alert-info', parser: Parsers.freeEthereumIoClaimed}),
                captcha: new HCaptchaWidget(),
                balance: new ReadableWidget({selector: 'a.wha[href="/account?page=history"]', parser: Parsers.trimNaNs}),
                success: new ReadableWidget({selector: 'div.alert.alert-info'}),
                login: {
                    inputUser: new TextboxWidget({ selector: 'input[name="number"]' }),
                    inputPass: new TextboxWidget({ selector: 'input[name="pass"]' }),
                    inputSubmit: new SubmitWidget({ selector: 'input[type="submit"][value="Login!"]' }),
                    setCredentials: false
                },
                // outOfFundsDivSelector: '.alert.alert-info'
            };

            if(shared.getConfig()['ycoin.credentials.mode'] == 1) {
                elements.login.setCredentials = {
                    username: shared.getConfig()['ycoin.credentials.username'],
                    password: shared.getConfig()['ycoin.credentials.password']
                };
            }

            let actions = {
                preRun: true,
                readClaimed: true,
                readBalance: true,
                readRolledNumber: false,
                checkIfOutOfFunds: false
            };
            super(elements, actions);
        }

        async preRun() {
            shared.devlog(`@preRun`);
            // <p class="info success">0.00000007  has been transferred to your account! You have 6 claims left today.</p>
            let msgDiv;
            msgDiv = document.querySelector('p.info.success');
            if (msgDiv && msgDiv.innerText.includes('has been transferred')) {
                shared.devlog(`custom closing`);
                let result = {};
                if (msgDiv.innerText.includes('0 claims')) {
                    result.nextRoll = helpers.addMinutes(60 * 24 + helpers.randomInt(10, 50));
                } else {
                    result.nextRoll = helpers.addMinutes('60');
                }
                result.claimed = +msgDiv.innerText.split(' ')[0];
                result.balance = this.readBalance();
                shared.closeWindow(result);
                return;
            }

            msgDiv = document.querySelector('p.info.warn');
            if (msgDiv) {
                if (msgDiv.innerText.includes('can claim only')) {
                    shared.devlog(`@preRun -> wait 24 hs`);
                    let result = {};
                    result.nextRoll = helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                    shared.closeWindow(result);
                    return;
                } else if (msgDiv.innerText.includes('Please wait')) {
                    shared.devlog(`@preRun -> please wait found`);
                    let result = {};
                    try {
                        let unit = msgDiv.innerText.includes(' seconds') ? ' seconds' : ' minutes';
                        let val = msgDiv.innerText.split('Please wait ')[1].replace(/\D/g, '');
                        if (unit == ' seconds') {
                            result.nextRoll = helpers.addSeconds(val);
                        } else {
                            result.nextRoll = helpers.addMinutes(val);
                        }
                    } catch {
                        result.nextRoll = helpers.addMinutes(60);
                    }
                    shared.closeWindow(result);
                    return;
                }
            }

            if (this._elements.captcha.isUserFriendly) {
                shared.devlog(`Captcha found`);
            } else {
                shared.devlog(`Captcha not found`);
                if (this._elements.rollButton) {
                    shared.devlog(`Click getFreeCrypto no captcha`);
                    this._elements.rollButton.click();
                    return;
                }
            }
        }

        async init() {
            shared.devlog(`@init`);
            if (this._url.includes('/faucet')) {
                let needToLoginButton = document.querySelector('input[type="submit"][value="Login / Signup"]');
                if (needToLoginButton) {
                    shared.devlog(`GoTo Login`);
                    needToLoginButton.click();
                    return;
                }

                this.run();
                return;
            } else if (this._url.includes('/account')) {
                this.doLogin();
                return;
            }
        }

        async doLogin() {
            shared.devlog(`@doLogin`);
            return wait().then( () => {
                let container = document.querySelector('#cc');
                if (container.innerText.includes('You are now logged in as account')) {
                    shared.devlog(`@logged in OK`);
                    let toFaucetButton = document.querySelector('#mmenu a[href="/faucet"]');
                    if (toFaucetButton) {
                        toFaucetButton.click();
                        return;
                    }
                    return this.doLogin();
                }
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    shared.devlog(`Waiting form inputs`);
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('#cc .info.fail');
                if (loginErrorDiv && loginErrorDiv.innerText.includes('Invalid')) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._elements.login.setCredentials != false) {
                    shared.devlog(`Setting credentials from var`);
                    this._elements.login.inputUser.value = this._elements.login.setCredentials.username;
                    this._elements.login.inputPass.value = this._elements.login.setCredentials.password;
                }

                try {
                    this._elements.login.rememberMe.isUserFriendly.checked = true;
                } catch (err) {}

                if (this._elements.login.inputUser.value != '' && this._elements.login.inputPass.value != '' ) {
                    this._elements.login.inputSubmit.click();
                } else {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, 'No credentials were provided');
                    return;
                }
            });
        }

    }

    class CDiversity extends Faucet {
        constructor() {
            let elements = {
                claimed: new ReadableWidget({selector: 'p.success', parser: Parsers.trimNaNs}),
                captcha: new HCaptchaWidget(),
                rollButton: new ButtonWidget({selector: 'input[type="submit"][value="Get Free Crypto!"]'}),
            };
            let actions = {
                readTimeLeft: true,
                readRolledNumber: false,
                readBalance: false
            };
            super(elements, actions);
        }

        init() {
            if(this.hasErrorMessage()) {
                shared.closeWithError(K.ErrorType.ERROR, 'Suspicious Activity Message Displayed');
                return;
            }

            let claimed = this.readClaimed();
            if (claimed != 0) {
                shared.devlog(`closing because claim was read`);
                let result = {
                    claimed: claimed,
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            let nextRoll = this.readNextRoll();
            if(nextRoll) {
                shared.devlog(`closing with next roll`);
                let result = {
                    nextRoll: nextRoll
                };
                shared.closeWindow(result);
                return;
            }

            this.solve();
        }

        hasErrorMessage() {
            return document.body.innerText.toLowerCase().includes('suspicious activity');
        }

        isFirstStep() {
            return document.querySelector('form select[name="coin"]') ? true : false;
        }

        async doFirstStep() {
            let form = document.querySelector('form');
            if (!form) {
                shared.devlog(`Form element not found`);
                this.updateResult();
                return;
            }
            // TODO: read latest claims to find coin to use
            let coinSelect = form.querySelector('select[name="coin"]');
            if (!coinSelect) {
                shared.devlog(`coinSelect not found`);
                this.updateResult();
                return;
            }
            let userInput = form.querySelector('input[name="ado"]');
            if (!userInput) {
                shared.devlog(`userInput not found`);
                this.updateResult();
                return;
            }
            let submitButton = form.querySelector('input[type="submit"]');
            if (!submitButton) {
                shared.devlog(`submitButton not found`);
                this.updateResult();
                return;
            }
            // fill coin
            coinSelect.value = this.getCoin();
            // fill email
            userInput.value = this._params.address;

            submitButton.parentElement.submit();
            return;
        }

        getCoin() {
            try {
                let tds = document.querySelectorAll('table tr td:nth-child(2)');
                return tds[helpers.randomInt(0, 5)].innerText.split(' ')[1]
            } catch (err) {
                return 'BTC';
            }
        }

        isSecondStep() {
            let ps = [...document.querySelectorAll('p')];
            return ps.findIndex(x => x.innerText.toLowerCase().includes('one more step...')) >= 0;
        }

        async solve() {
            shared.devlog(`@solve`);
            if (this.isSecondStep()) {
                shared.devlog(`@2nd step`);
                return this.run();
            }
            if (this.isFirstStep()) {
                shared.devlog(`@1st step`);
                return this.doFirstStep();
            }
        }

        isCountdownVisible() {
            let successDiv = document.querySelector('p.success');
            if (!successDiv) {
                return false;
            }
            if (successDiv.innerText.includes('0 claims')) {
                // need to wait a day
                return true;
            }

            return false;
        }

        readClaimed() {
            let successDiv = document.querySelector('p.success');
            if (successDiv) {
                return successDiv.innerText.split(' ')[0];
            } else {
                shared.devlog(`successDiv not found`);
                return 0;
            }
        }

        readNextRoll() {
            // <p class="warn">Time between claims should be at least 1 minutes! Please wait 47 seconds before claiming again.</p>
            try {
                let successDiv = document.querySelector('p.success');
                if (successDiv && successDiv.innerText.includes('You have')) {
                    let claimsLeft;
                    try {
                        claimsLeft = successDiv.innerText.split(' claims')[0].split('have ')[1];
                    } catch (err) {}
                    shared.devlog(`claimsLeft: ${claimsLeft}`);
                    if (claimsLeft) {
                        return helpers.addMinutes(helpers.randomInt(6, 22));
                    } else if (claimsLeft === '0') {
                        return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                    }
                }
            } catch (err) { }

            try {
                let warnDiv = document.querySelector('p.warn');
                if (warnDiv) {
                    if (warnDiv.innerText.includes('You can claim only')) {
                        return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                    }

                    if (warnDiv.innerText.includes('Please wait ')) {
                        try {
                            let unit = warnDiv.innerText.includes(' seconds') ? ' seconds' : ' minutes';
                            let val = warnDiv.innerText.split('Please wait ')[1].split(unit)[0].replace(/\D/g, '');
                            if (unit == ' seconds') {
                                return helpers.addSeconds(val);
                            } else {
                                return helpers.addMinutes(val);
                            }
                        } catch { }
                        let claimsLeft;
                        try {
                            claimsLeft = warnDiv.innerText.split(' seconds')[0].split('wait ')[1];
                        } catch (err) {}
                        shared.devlog(`claimsLeft: ${claimsLeft}`);
                        if (claimsLeft) {
                            return helpers.addMinutes(helpers.randomInt(6, 22));
                        }
                    }
                }

            } catch (err) { }
            //return helpers.addMinutes(60);
            return null;
        }
    }

    class BscAds extends Faucet {
        constructor() {
            let elements = {
                rollButton: new ButtonWidget({selector: 'button.btn.btn-primary.btn-lg'}),
                claimed: new ReadableWidget({selector: 'div.alert.alert-success', parser: Parsers.trimNaNs}),
                captcha: new HCaptchaWidget(),
                countdownMinutes: new CountdownWidget({selector: '#faucet_timer', parser: Parsers.fromTextTimer }), // 0 hours 15 minutes 36 seconds
                success: new ReadableWidget({selector: 'div.alert.alert-success'}),
                login: {
                    inputUser: new TextboxWidget({ selector: 'input[name="username"]' }),
                    inputPass: new TextboxWidget({ selector: 'input[name="password"]' }),
                    inputSubmit: new ButtonWidget({ selector: 'button.btn' }),
                    setCredantials: false
                }
            }

            if(shared.getConfig()['bscads.credentials.mode'] == 1) {
                elements.login.setCredentials = {
                    username: shared.getConfig()['bscads.credentials.username'],
                    password: shared.getConfig()['bscads.credentials.password']
                };
            }

            let actions = {
                readClaimed: true,
                readBalance: false,
                readRolledNumber: false
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('/faucet/access')) {
                this.run();
                return;
            } else if (this._url.includes('/faucet')) {
                shared.devlog('@faucet pre/post step');
                this.doPrePostFaucet();
                return;
            } else if (this._url.includes('/login')) {
                this.doLogin();
                return;
            } else {
                location.replace('faucet');
                return;
            }
        }

        async doPrePostFaucet() {
            // pre faucet and post faucet
            return wait(10000).then( () => {
                let button = document.querySelector('button.btn.btn-primary.btn-lg');
                if (button) {
                    // is pre faucet
                    shared.devlog('pre-faucet button click');
                    button.click();
                    return;
                }
                if (!button) {
                    shared.devlog('post-faucet');
                    return this.run();
//                     // button not found. check if it's a post claim
//                     let successDiv = document.querySelector('div.alert.alert-success');
//                     if (successDiv && successDiv.innerText.includes('THE_SUCCESS_MESSAGE')) {

//                     }
//                     shared.devlog('button not found');
//                     shared.closeWithError(K.ErrorType.ERROR, 'Button not found on faucet pre step');
//                     return this.doPrePostFaucet();
                }
            });
        }

        async doLogin() {
            shared.devlog(`@doLogin`);
            // nothing if 'please wait during'
            if (document.body.innerText.toLowerCase().includes('please wait during')) {
                return wait(8000).then( () => {
                    shared.devlog(`redirecting to faucet from login countdown`);
                    location.replace('faucet');
                });
            }
            return wait().then( () => {
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    shared.devlog(`Waiting form inputs`);
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('div.alert.alert-danger');
                if (loginErrorDiv && loginErrorDiv.innerText.toLowerCase().includes('invalid')) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._elements.login.setCredentials != false) {
                    shared.devlog(`Setting credentials from var`);
                    this._elements.login.inputUser.value = this._elements.login.setCredentials.username;
                    this._elements.login.inputPass.value = this._elements.login.setCredentials.password;
                }

                try {
                    this._elements.login.rememberMe.isUserFriendly.checked = true;
                } catch (err) {}

                if (this._elements.login.inputUser.value != '' && this._elements.login.inputPass.value != '' ) {
                    shared.devlog(`@Run - Captcha`);
                    this._elements.captcha.isSolved().then(() => {
                        this._elements.login.inputSubmit.click();
                        return;
                    });
                } else {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, 'No credentials were provided');
                    return;
                }
            });
        }

        async preRun() {
            // <button class="btn btn-primary btn-lg">Claim Your Reward Now</button>
        }
    }

    class FPB extends Faucet {
        constructor(sitePrefix = null) {
            let elements = {
                rollButton: new ButtonWidget({selector: 'input[type="submit"][value="Claim From Faucet"],input[type="submit"][name="claim"]'}),
                claimed: new ReadableWidget({selector: 'div.alert.alert-info', parser: Parsers.freeEthereumIoClaimed}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: 'div.alert.alert-info'}),
                login: {
                    inputUser: new TextboxWidget({ selector: 'input[name="user_name"]' }),
                    inputPass: new TextboxWidget({ selector: 'input[name="password"]' }),
                    rememberMe: new TextboxWidget({ selector: 'input[name="remember_me"]' }),
                    inputSubmit: new ButtonWidget({ selector: 'input[type="submit"][name="login"]' }),
                    setCredentials: false
                },
                outOfFundsDivSelector: '.alert.alert-info'
            };

            if(shared.getConfig()[sitePrefix + '.credentials.mode'] == 1) {
                elements.login.setCredentials = {
                    username: shared.getConfig()[sitePrefix + '.credentials.username'],
                    password: shared.getConfig()[sitePrefix + '.credentials.password']
                };
            }

            let actions = {
                readClaimed: true,
                readBalance: false,
                readRolledNumber: false,
                checkIfOutOfFunds: true
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('/dashboard')) {
                this.run();
                return;
            } else if (this._url.includes('/login')) {
                this.doLogin();
                return;
            }
        }

        async doLogin() {
            shared.devlog(`@doLogin`);
            return wait().then( () => {
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    shared.devlog(`Waiting form inputs`);
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('div.alert.alert-info');
                if (loginErrorDiv && loginErrorDiv.innerText.includes('not valid')) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._elements.login.setCredentials != false) {
                    shared.devlog(`Setting credentials from var`);
                    this._elements.login.inputUser.value = this._elements.login.setCredentials.username;
                    this._elements.login.inputPass.value = this._elements.login.setCredentials.password;
                }

                try {
                    this._elements.login.rememberMe.isUserFriendly.checked = true;
                } catch (err) {}

                if (this._elements.login.inputUser.value != '' && this._elements.login.inputPass.value != '' ) {
                    shared.devlog(`@Run - Captcha`);
                    this._elements.captcha.isSolved().then(() => {
                        this._elements.login.inputSubmit.click();
                        return;
                    });
                } else {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, 'No credentials were provided');
                    return;
                }
            });
        }

        async detectAction() {
            shared.devlog(`@detectAction Custom`);
            return wait().then( () => {
                if ( this.isCountdownVisible() ) {
                    shared.devlog('needToWait');
                    return Promise.resolve({action: 'needToWait'});
                } else if ( this._elements.success.isUserFriendly ) {
                    shared.devlog('Successful run');
                    return this.updateResult();
                } else if ( this.isRollButtonVisible() ) {
                    shared.devlog('doRoll');
                    return Promise.resolve({action: 'doRoll'});
                } else {
                    return this.detectAction();
                }
            });
        }

        clickRoll() {
            try {
                shared.devlog(`@clickRoll custom`);
                try {
                    window.scrollTo(0, document.body.scrollHeight);
                    this._elements.rollButton.scrollIntoView(false);
                } catch (err) { }
                this._elements.rollButton.click();
                setTimeout( () => { this._elements.rollButton.click(); }, 5000);
                // setTimeout(() => { this.validateRun() }, helpers.randomMs(10000, 12000));
            } catch (err) {
                shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
            }
        }
    }

    class VieRoll extends Faucet {
        constructor() {
            let elements = {
                rollButton: new SubmitWidget({selector: '.main-content button[type="submit"]'}),
                claimed: new ReadableWidget({selector: '.swal2-html-container', parser: Parsers.trimNaNs}),
                captcha: new HCaptchaWidget(),
                success: new ReadableWidget({selector: '.swal2-success-ring'}),
                login: {
                    // captchaOptions: new SelectWidget({ selector: '#selectCaptcha', valueSeeked: 'hcaptcha' }),
                    inputUser: new TextboxWidget({ selector: '#email' }),
                    inputPass: new TextboxWidget({ selector: '#password' }),
                    // rememberMe: new TextboxWidget({ selector: 'input[name="remember_me"]' }),
                    inputSubmit: new SubmitWidget({ selector: 'button[type="submit"]' })
                }
            };

            let actions = {
                readClaimed: true,
                readBalance: false,
                readTimeLeft: false,
                readRolledNumber: false,
                preSaveResult: false,
                preRun: true
            };
            super(elements, actions);
        }

        getClaimsQty() {
            let statWidgets = document.querySelectorAll('.card.mini-stats-wid');
            if (statWidgets.length < 4) return false;

            let claimCounts = statWidgets[3].querySelector('p');
            if (!claimCounts) return false;

            claimCounts = claimCounts.innerText.split('/');
            if (claimCounts.length != 2) return false;

            return claimCounts[0];
        }

        async evalClaimsQty() {
            let current = this.getClaimsQty();

            if (current) {
                current = +current;
            } else {
                return;
            }

            let previous = await shared.getProp('tempClaimsQty') || 0;
            if (!isNaN(previous)) previous = +previous;

            if (current == previous) {
                return;
            } else if (current < previous) {
                return this.updateResult();
            } else {
                await shared.setProp('tempClaimsQty', current);
            }
        }

        readClaimed() {
            let claimed = 0.12;
            try {
                claimed = +document.querySelectorAll('.card.mini-stats-wid')[2].querySelector('p').innerText.split(' ')[0];
            } catch (err) { }
            return claimed;
        }

        async init() {
            await this.evalClaimsQty();

            if (window.location.pathname.includes('/faucet')) {
                shared.devlog(`@VieRoll => At Faucet starting claim`);
                this.run();
                return;
            } else if (window.location.pathname.includes('/firewall')) {
                shared.devlog(`@VieRoll => At Firewall`);
                this.solveFirewall();
                return;
            } else if (window.location.pathname.includes('/dashboard')) {
                shared.devlog(`@VieRoll => At Dashboard`);
                window.location.href = (new URL('faucet', window.location)).href;
                return;
            } else if (window.location.pathname == '/') {
                // At home => go to login
                let loginBtn = document.querySelector('.btn.btn-success');
                if (loginBtn) {
                    loginBtn.click();
                    return;
                } else {
                    shared.devlog(`@VieRoll => Home => Login button not found`);
                    window.location.href = (new URL('login', window.location)).href;
                }
                return;
            } else if (this._url.includes('/login')) {
                shared.devlog(`@VieRoll => At Login`);

                let credentialsMode = this._params.credentials.mode;
                switch(credentialsMode) {
                    case -1:
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, 'Manual login required.');
                        break;
                    case 0:
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, 'Login required and autologin is not configured.');
                        break;
                    default:
                        shared.devlog(`@VieRoll: Login attempt`);
                        this.doLogin();
                        break;
                }
                return;
            }
        }

        async preRun() {
            shared.devlog(`@preRun`);
            return;
        }

        async solveFirewall() {
            this.closeSwal();

            this._elements.captcha.isSolved().then(() => {
                let btn = new SubmitWidget({selector: 'form:not(.p-3) button[type="submit"]'});
                btn.click();
            });
        }

        async doLogin() {
            shared.devlog(`@doLogin`);
            return wait().then( () => {
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    shared.devlog(`Waiting form inputs`);
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('div.alert.alert-danger');
                if (loginErrorDiv) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._params.credentials.mode == 1) {
                    shared.devlog(`Setting credentials`);
                    this._elements.login.inputUser.value = this._params.credentials.username;
                    this._elements.login.inputPass.value = this._params.credentials.password;
                }

                if (this._elements.login.inputUser.value != '' && this._elements.login.inputPass.value != '' ) {
                    this._elements.captcha.isSolved().then(() => {
                        this._elements.login.inputSubmit.click();
                        return;
                    });
                } else {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, 'No credentials were provided');
                    return;
                }
            });
        }

        preSaveResult() {
            this.closeSwal();
        }

        closeSwal() {
            let okButton = document.querySelector('button.swal2-confirm');
            if (okButton) {
                okButton.click();
            }
        }
    }

    class GRCRoll extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '#roll_wait_text', parser: Parsers.freeGrcCountdown}),
                rollButton: new ButtonWidget({selector: 'input[id="roll_button"]'}),
                balance: new ReadableWidget({selector: '#balance', parser: Parsers.trimNaNs}),
                claimed: new ReadableWidget({selector: '#roll_comment .won', parser: Parsers.trimNaNs}),
                rolledNumber: new ReadableWidget({selector: '#roll_result', parser: Parsers.trimNaNs}),
                captcha: new NoCaptchaWidget({selector: '#roll_button'}),
                success: new ReadableWidget({selector: '#roll_result'})
            };
            let actions = {
                readTimeLeft: true,
                readRolledNumber: true
            };
            super(elements, actions);
        }

        init() {
            if (this._url.includes('#free_roll')) {
                if (document.querySelectorAll('a[href="#login"]').length > 0) {
                    shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
                    return;
                } else {
                    this.run();
                    return;
                }
            } else {
                return;
            }
        }

        isCountdownVisible() {
            return this._elements.countdownMinutes && this._elements.countdownMinutes.isUserFriendly && this._elements.countdownMinutes.isUserFriendly.innerText != '';
        }
    }

    class O24Roll extends Faucet {
        constructor() {
            let elements = {
                claimed: new ReadableWidget({selector: '#roll_comment .won', parser: Parsers.trimNaNs})
            };
            let actions = {
                readTimeLeft: true,
                readRolledNumber: false,
                readBalance: false
            };
            super(elements, actions);
        }

        init() {
            if (this.isCountdownVisible() || this.readClaimed() != 0) {
                this.updateResult();
                return;
            }

            this.solve();
        }

        getSpotsAvailable() {
            try {
                let soldSpots = document.querySelectorAll('.pos:not(.pfree)').length;
                let available = 1024-soldSpots;
                shared.devlog(`Spots read => available: ${available}, sold: ${soldSpots}`);
                return {
                    sold: '' + soldSpots,
                    available: '' + available
                }
                let elm = document.querySelector('.pos.pfree a');
                if (elm) {
                    return elm.innerText.split('$')[1].split('-')[0];
                } else {
                    shared.devlog(`Unable to find spots sold elm`);
                    return;
                }
            } catch (err) {
                shared.devlog(`Unable to read spots sold`);
                shared.devlog(err);
            }
        }

        isPrime(num) {
            for(var i = 2; i < num; i++){
                if(num % i === 0){
                    return false;
                }
            }
            return num > 1;
        }

        async solve() {
            let spots = this.getSpotsAvailable();
            if(!spots) {
                // close with error
                shared.devlog(`Could not find spots available`);
                this.updateResult();
                return;
            }

            const findNotPrime = document.querySelector('select[name="pr"]').parentElement.innerText.includes('not a prime')
            let numbers = [...document.querySelectorAll('select[name="pr"] option[value]')].map(x => x.innerText)
            let prime = null;
            if (findNotPrime) {
                prime = numbers.find(x => {
                    return !this.isPrime(x)
                });
            } else {
                prime = numbers.find(x => {
                    return this.isPrime(x)
                });
            }
            if(!prime) {
                // close with error
                shared.devlog(`Could not find ${findNotPrime ? 'not' : ''} prime number`);
                this.updateResult();
                return;
            }

            // fill address
            let addrInput = document.querySelector('label input[name="a"]');
            if (addrInput) {
                addrInput.value = this._params.address;
            } else {
                shared.devlog(`Could not find address input element`);
                this.updateResult();
                return;
            }
            await wait(helpers.randomInt(1500, 3000));

            // answer_1:
            let answersList = [...document.querySelectorAll('select[name="tt"] option')].map(x => x.value);
            if (answersList.includes(spots.sold)) {
                document.querySelector('select[name="tt"]').value=spots.sold;
            } else if (answersList.includes(spots.available)) {
                document.querySelector('select[name="tt"]').value=spots.available;
            } else {
                shared.devlog(`Could not find option for sold/available spots`);
                this.updateResult();
                return;
            }

            await wait(helpers.randomInt(400, 5000));

            // answer_2:
            let primeSelect = document.querySelector('select[name="pr"]');
            helpers.triggerMouseEvent (primeSelect, "mouseenter");
            await wait(helpers.randomInt(5600, 29000));
            helpers.triggerMouseEvent (primeSelect, "mouseout");
            primeSelect.value=prime.toString()
            await wait(helpers.randomInt(1500, 5000));

            let claimForm = document.querySelector('form');
            if(claimForm) {
                claimForm.submit();
            }
        }

        isCountdownVisible() {
            let pars = [...document.querySelectorAll('p')];
            if (pars.find(x => x.innerText.includes('please wait until next day'))) {
                // need to wait a day
                return true;
            }

            if (pars.find(x => x.innerText.includes('PROBLEM'))) {
                // need to wait at least 5 min
                return true;
            }

            return false;
        }

        readClaimed() {
            let pars = [...document.querySelectorAll('p')];
            let claimedElm = pars.find(x => x.innerText.includes('been transferred to your account'));
            if (claimedElm) {
                return claimedElm.innerText.split(' ')[0];
            } else {
                return 0;
            }
        }

        readNextRoll() {
            try {
                let pars = [...document.querySelectorAll('p')];
                if (pars.find(x => x.innerText.includes('PROBLEM'))) {
                    // need to wait
                    return helpers.addMinutes(helpers.randomInt(6, 22));
                }

                if (pars.find(x => x.innerText.includes('ALL DAILY CLAIMS') || x.innerText.includes('You have 0 claims left'))) {
                    // need to wait a day
                    return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                }

                if (pars.find(x => x.innerText.includes('You have'))) {
                    // need to wait a day
                    return helpers.addMinutes(helpers.randomInt(6, 22));
                }
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
            //return helpers.addMinutes(60);
            return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
        }
    }

    // TODO: refactor => separate in PTC and FAUCET, using a generic PTC class with PTCList, PTCSingle, etc
    //                   create a container class that has both PTC and FAUCET
    class FCryptoRoll extends Faucet {
        constructor() {
            let elements = {
                countdownMinutes: new CountdownWidget({selector: '.sidebar-links .cursor-not-allowed span.notranslate', parser: Parsers.splitAndIdxToInt, options: { splitter: ':', idx: 1} }), // '00:21:28'
                // rollButton: new ButtonWidget({selector: 'button.notranslate.inline-flex.items-center.text-center:not(.hidden)'}),
                rollButton: new ButtonWidget({selector: '.flex.justify-center button.inline-flex.items-center:not(.hidden)'}),
                balance: new ReadableWidget({selector: 'div.flex.badge.text-bg-yellow', parser: Parsers.trimNaNs}), // '405.81 Coins'
                claimed: new ReadableWidget({selector: 'div.ml-3.w-0 p span.text-yellow-500.font-medium', parser: Parsers.splitAndIdxTrimNaNs, options: { splitter: '(', idx: 0} }), // '25.05 Coins (12 + 13.05)'
                captcha: new HCaptchaWidget({selector: '#hcap-script > iframe'}),
                success: new ReadableWidget({selector: 'div.ml-3.w-0 p span.text-yellow-500.font-medium'})
            };
            let actions = {
                isMultiClaim: true,
                preRoll: true,
                postRun: true,
                // altValidation: true,
                readRolledNumber: false,
                // updateWithoutClosing: true
            };
            super(elements, actions);
            this._paths = {
                faucet: '/task/faucet-claim',
                // ptcList: '/ptc/list',
                // ptcSingleStart: '/task/ptc-advertisement',
                // ptcSingleWait: '/ptc/view',
                dashboard: '/dashboard'
            };
            this._linkSelectors = {
                Faucet: 'a[href="https://faucetcrypto.com/task/faucet-claim"]'
                // PtcList: 'a[href="https://faucetcrypto.com/ptc/list"]',
                // Shortlinks: 'a[href="https://faucetcrypto.com/shortlink/list"]',
                // Challenges: 'a[href="https://faucetcrypto.com/challenge/list"]'
            }
            this.useUrlListener();
        }

        init() {
            this._elements.captcha = new HCaptchaWidget({selector: '#hcap-script > iframe'});
            this._elements.rollButton = new ButtonWidget({selector: '.flex.justify-center button.inline-flex.items-center:not(.hidden)'});
            if (this._url.endsWith(this._paths.dashboard)) {
                shared.devlog(`@FC => @dashboard`);
                return this.runDashboard();
            } else if (this._url.includes(this._paths.faucet)) {
                shared.devlog(`@FC => @faucet`);
                return wait().then( () => { this.run(); });
                // } else if (this._url.endsWith(this._paths.ptcList)) {
                //     shared.devlog(`@FC => @ptcList`);
                //     return wait().then( () => { this.runPtcList(); });
                // } else if (this._url.includes(this._paths.ptcSingleStart)) {
                //     shared.devlog(`@FC => PTC Single Step 1`);
                //     return wait().then( () => { this.runPtcSingleStart(); });
                // } else if (this._url.includes(this._paths.ptcSingleWait)) {
                //     shared.devlog(`@FC => PTC Single Step 2`);
                //     return wait().then( () => { this.runPtcSingleWait(); });
            }

            shared.devlog(`@FC => No url match!`);
            return;
        }

        readSections() {
            let sections = {};
            try {
                for (var l in this._linkSelectors) {
                    sections[l] = {};
                    sections[l].elm = document.querySelector(this._linkSelectors[l]);
                    if (sections[l].elm) {
                        let qty = sections[l].elm.querySelector('span.ml-auto');
                        sections[l].qty = (qty && !isNaN(qty.innerText)) ? qty.innerText : 0;
                    }
                }
            } catch {}

            this.sections = sections;
        }

        runDashboard() {
            this.readSections();

            if (this.sections['Faucet'].elm) {
                shared.devlog(`@FC => goto faucet`);
                this.sections['Faucet'].elm.click();
                return;
            } else {
                // process Faucet results?
                shared.devlog(`@FC => processing faucet results`);
                return wait().then( () => { this.run(); });
            }
        }

        // TODO: refactor and move
        scrollTo() {
            let mainContainer = document.querySelector('main');
            if (mainContainer) {
                mainContainer.scrollTo(0, mainContainer.scrollHeight - mainContainer.offsetHeight);
            }
        }

        preRoll() { // search for 'You don't need to solve any captcha! The system is telling me that you are a good person :)'
            this.scrollTo();
            let checkCircleSpan = document.querySelector('p.font-medium.flex.justify-center.leading-0 span.text-green-500.mr-3 svg');
            if(checkCircleSpan) {
                if (checkCircleSpan.parentElement.parentElement.innerText.toLowerCase().includes('the system is telling me that you are a good person')) {
                    shared.devlog(`No captcha needed`);
                    // TODO: review the following selector as it's matching the countdown button
                    this._elements.captcha = new NoCaptchaWidget({selector: '.flex.justify-center button.inline-flex.items-center:not(.hidden)'});
                    return;
                }
            }
        }

        postRun() {
            shared.devlog(`@FC @postRun in ${window.location.href}`);

            // if ( this._url.endsWith(this._paths.dashboard) || (this._oldClaimed && this._result && this._result.claimed && this._oldClaimed != this._result.claimed) ) {
            if (this._url.endsWith(this._paths.dashboard) || this._oldClaimed != this._result.claimed) {
                shared.devlog(`@FC @postRun => Claim/Action finished [${this._oldClaimed} != ${this._result.claimed}]`);
                try {
                    this._elements.claimed.isUserFriendly.parentElement.parentElement.parentElement.querySelector('button');
                    shared.devlog(`@FC @postRun => closing claimed notification`);
                } catch (err) {
                    shared.devlog(`@FC @postRun => error closing claimed notification: ${err}`);
                }
                this._oldClaimed = null;
                this.readSections();
                if (this.sections != {}) {
                    if (this.sections['Faucet'].elm) {
                        shared.devlog(`@FC @postRun => goto faucet`);
                        this.sections['Faucet'].elm.click();
                        return;
                        // } else if (this.sections['PtcList'].elm && this.sections['PtcList'].qty > 0) {
                        //     shared.devlog(`@FC @postRun => has PTCs. goto ptcList`);
                        //     this.sections['PtcList'].elm.click();
                        //     return;
                    } else {
                        shared.devlog(`@FC @postRun => ignoring @1`);
                    }
                } else {
                    shared.devlog(`@FC @postRun => ignoring @2`);
                }
            } else {
                shared.devlog(`@FC @postRun => ignoring @3`);
            }

            this._result = shared.getProp('tempResults');
            shared.closeWindow(this._result);
            return;
        }

        async runPtcList() {
            shared.devlog(`@FC => @runPtcList`);
            let listItems = [...document.querySelectorAll('.grid.grid-responsive-3 .feather.feather-eye')].map(x => x.parentElement.parentElement).filter(x => x.isUserFriendly());
            if (listItems.length > 0) {
                shared.devlog(`@FC => goto PtcSingleStart`);
                listItems[0].click();
                return;
            } else {
                shared.devlog(`@FC => list invalid. Length: ${listItems.length}`);
                return wait().then( () => { this.runPtcList() } );
            }
        }

        runPtcSingleStart() {
            shared.devlog(`@FC => @runPtcSingleStart`);
            return this.run('doRoll');
        }

        runPtcSingleWait() {
            shared.devlog(`@FC => @runPtcSingleWait`);
            this._elements.captcha = new NoCaptchaWidget({selector: 'a.notranslate:not(.cursor-not-allowed)' });
            this._elements.rollButton = new ButtonWidget({selector: 'a.notranslate:not(.cursor-not-allowed)' });
            return this.run('doRoll');
        }
    }

    let timer, landing;
    let useTimer;
    async function init() {
        persistence = objectGenerator.createPersistence();
        shared = objectGenerator.createShared();
        useTimer = shared.getConfig()['defaults.extraInterval'];
        if (window.location.host === 'criptologico.com') {
            landing = window.location.host;
            timer = new Timer(true, 30);
            shared.devlog('Manager Reloaded');
            manager = objectGenerator.createManager();
            CFPromotions = objectGenerator.createCFPromotions();
            ui = objectGenerator.createUi();
            CFHistory = objectGenerator.createCFHistory();

            await manager.init();
            if (!document.querySelector('body.sidebar-collapse')) {
                try {
                    document.querySelector("body > div.wrapper > nav > ul:nth-child(1) > li:nth-child(1) > a").click();
                } catch (err) {}
            }
        } else {
            detectWeb();
        }
    }
    init();
})();
