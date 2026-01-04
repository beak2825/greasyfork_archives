// ==UserScript==
// @name         [satology] Auto Claim Multiple Faucets with Monitor UI
// @description  Automatic rolls and claims for 50+ crypto faucets/PTC/miners (Freebitco.in BTC, auto promo code for 16 CryptosFaucet, FaucetPay, StormGain, etc)
// @description  Claim free ADA, BNB, BCH, BTC, DASH, DGB, DOGE, ETH, FEY, LINK, LTC, NEO, SHIB, STEAM, TRX, USDC, USDT, XEM, XRP, ZEC, ETC
// @version      3.0.57
// @author       satology
// @namespace    satology.onrender.com
// @homepage     https://criptologico.com/tools/cc
// @noframes

// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        GM_openInTab
// @grant        window.onurlchange
// @connect      criptologico.com


// @note         IMPORTANT
// @note         - To start the script you need to navigate to https://criptologico.com/tools/cc
// @note         - Each schedule will open it's own tab to allow multiclaiming

// @icon         https://www.google.com/s2/favicons?domain=criptologico.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/nearest-color/0.4.4/nearestColor.js
// @match        https://app.stormgain.com/crypto-miner/
// @match        https://app.freecardano.com/*
// @match        https://app.freebinancecoin.com/*
// @match        https://app.freebitcoin.io/*
// @match        https://app.freedash.io/*
// @match        https://app.free-doge.com/*
// @match        https://app.freeethereum.com/*
// @match        https://app.freecryptom.com/*
// @match        https://app.free-ltc.com/*
// @match        https://app.freeneo.io/*
// @match        https://app.freesteam.io/*
// @match        https://app.free-tron.com/*
// @match        https://app.freeusdcoin.com/*
// @match        https://app.freetether.com/*
// @match        https://app.freenem.com/*
// @match        https://app.freeshibainu.com/*
// @match        https://app.coinfaucet.io/*
// @match        https://app.freepancake.com/*
// @match        https://app.freematic.com/*
// @match        https://app.freebittorrent.com/*
// @match        https://app.freebfg.com/*
// @match        https://freebitco.in/*
// @match        https://faucetpay.io/*
// @match        https://bigbtc.win/*
// @match        https://www.bestchange.com/*
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
// @match        https://freegridco.in/*
// @match        https://james-trussy.com/*
// @match        https://www.only1024.com/f*
// @match        https://criptologico.com/tools/cc*
// @match        https://yescoiner.com/*
// @match        https://coindiversity.io/*
// @match        https://ltcfaucet.top/*
// @match        https://bnbfaucet.top/*
// @match        https://dogecoinfaucet.top/*
// @match        https://tronfaucet.top/*
// @match        https://ethfaucet.top/*
// @match        https://freebch.club/*
// @match        https://zecfaucet.net/*
// @match        https://faucet.monster/*
// @match        https://auto-crypto.ml/*
// @match        https://claimclicks.com/*
// @match        https://cryptoclicks.net/*
// @match        https://freeshiba.cf/*
// @match        https://auto-crypto.click/*
// @downloadURL https://update.greasyfork.org/scripts/425999/%5Bsatology%5D%20Auto%20Claim%20Multiple%20Faucets%20with%20Monitor%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/425999/%5Bsatology%5D%20Auto%20Claim%20Multiple%20Faucets%20with%20Monitor%20UI.meta.js
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

    const STATUS = {
        INITIALIZING: 0,
        IDLE: 1,
        CLAIMING: 2
    };

    const K = Object.freeze({
        WebType: {
            UNDEFINED: 0,
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
            BFBOX: 13,
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
            BSCADS: 27,
            CTOP: 28,
            AUTOCML: 29,
            CCLICKS: 30
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
                LOGIN: 7,
                GAMES: 8,
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
            FP_USERNAME: 99,
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
            FP_MATIC: 114,
            FP_XRP: 115,
            FP_ADA: 116,
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
        },
        LOCATION: {
            UNKNOWN: 0,
            MANAGER: 1,
            SITE: 2
        }
    });

    let persistence, shared, manager, ui, CFPromotions, interactions, CFHistory, SiteProcessor, eventer;
    let uiRenderer;

    Element.prototype.isVisible = function() {
        return !!(this.offsetWidth||this.offsetHeight||this.getClientRects().length);
    };
    Element.prototype.isUserFriendly = function(selector) {
        let e = selector ? this.querySelector(selector) : this;
        return e && e.isVisible()  ? e : null;
    };
    Document.prototype.isUserFriendly = Element.prototype.isUserFriendly;

    Number.prototype.toDate = function() {
        return new Date(this);
    };
    Number.prototype.msToCountdown = function() {
        const remainingSeconds = Math.ceil(this / 1000);
        const hours = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
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
    String.prototype.formatUnicorn =  function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
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
        typer: function(inputElm, value) {
            let lastValue = inputElm.value;
            inputElm.value = value;
            let event = new Event('input', { bubbles: true });
            event.simulated = true;
            let tracker = inputElm._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            inputElm.dispatchEvent(event);
        },

        hasValue: function (val) {
            return val !== null && val !== undefined;
        },
        getTdPrintableTime: function (date = new Date()) {
            if (date != null) {
                return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
            }
            return '';
        },
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
        randomHexColor: function() {
            const hexChars = '0123456789abcdef';
            let color = '';
            for (let i = 0; i < 6; i++) {
                color += hexChars[Math.floor(Math.random() * hexChars.length)];
            }
            return color;
        },
        randomString: function(length) {
            let str = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                str += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return str;
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
                case K.CF.PromoStatus.PENDING:
                    return '⏳';
                case K.CF.PromoStatus.ACCEPTED:
                    return '✔️';
                case K.CF.PromoStatus.USEDBEFORE:
                    return '🕙';
                case K.CF.PromoStatus.INVALID:
                    return '❌';
                case K.CF.PromoStatus.EXPIRED:
                    return '📅';
                case K.CF.PromoStatus.UNKNOWNERROR:
                    return '❗';
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
                if (url.endsWith('/games')) {
                    return K.CF.UrlType.GAMES;
                }
                if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                    if (url == helpers.getHost(url, true)) {
                        return K.CF.UrlType.HOME;
                    }
                }
                if (url.endsWith('/login')) {
                    return K.CF.UrlType.LOGIN;
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
        },
        textQuerySelector: function (selector, text) {
            let all = [...document.querySelectorAll(selector)].filter(x => x.innerText.toLowerCase() == text.toLowerCase())
            if (all.length == 1) {
                return all[0];
            }
            return undefined;
        }
    }

    class Persistence {
        constructor(prefix = 'autoWeb_') {
            this.prefix = prefix;
        }
        save(key, value, parseIt = false) {
            GM_setValue(this.prefix + key, parseIt ? JSON.stringify(value) : value);
        }
        load(key, parseIt = false) {
            let value = GM_getValue(this.prefix + key);
            if(value && parseIt) {
                value = JSON.parse(value);
            }
            return value;

        }
    }

    let objectGenerator = {
        createShared: function() {
            let config = {};
            function initializeConfig() {
                config = {
                    'devlog.enabled': false,
                    'devlog.maxLines': 200,
                    'defaults.extraInterval': true,
                    'defaults.timeout': 4,
                    'defaults.postponeMinutes': 65,
                    'defaults.postponeMinutes.min': 65,
                    'defaults.postponeMinutes.max': 65,
                    'defaults.workInBackground': true,
                    'defaults.nextRun.useCountdown': true,
                    'defaults.nextRun': 60,
                    'defaults.nextRun.min': 60,
                    'defaults.nextRun.max': 60,
                    'defaults.sleepMode': false,
                    'defaults.sleepMode.min': "00:00",
                    'defaults.sleepMode.max': "01:00",
                    'cf.tryGetCodes': false,
                    'cf.usePromoCodes': true,
                    'cf.rollOnce': false,
                    'cf.autologin': false,
                    'cf.credentials.mode': 1,
                    'cf.credentials.email': 'YOUR@EMAIL.com',
                    'cf.credentials.password': 'YOURPASSWORD',
                    'cf.sleepHoursIfIpBan': 8,
                    'fp.maxTimeInMinutes': 15,
                    'fp.randomPtcOrder': true,
                    'dutchy.useBoosted': false,
                    'bk.withdrawMode': "0",
                    'bk.hoursBetweenWithdraws': 4,
                    'bk.sleepMinutesIfIpBan': 75,
                    'bestchange.address': '101',
                    'ui.runtime': 0,
                    'bigbtc.postponeMinutes': '0',
                    'jtfey.credentials.mode': 2,
                    'jtfey.credentials.username': 'YOUR_USERNAME',
                    'jtfey.credentials.password': 'YOURPASSWORD',
                    'ycoin.credentials.mode': 2,
                    'ycoin.credentials.username': 'YOUR_ACCOUNT_NUMBER',
                    'ycoin.credentials.password': 'YOURPASSWORD',
                    'bkclass.coin': 'LTC',
                    'bkclass.bcoin': 'LTC',
                    'migrations': [
                        {version: '00200799', applied: false} // migration to change pcodes status from error to usable due to ui changes
                    ]
                };

                let storedData = persistence.load('config', true);
                if(storedData) {
                    for (const prop in config) {
                        if(storedData.hasOwnProperty(prop)) {
                            config[prop] = storedData[prop];
                        }
                    }
                }

                config.version = GM_info.script.version;
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
                    console.error(err);
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
                    msg = scheduleUuid ? `[${scheduleUuid}] ${msg}` : msg;
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

            function getRunningSites() {
                let ret = [];
                loadFlowControl();
                if(!runningSites || runningSites == {}) {
                    return ret;
                }
                for (const sch in runningSites) {
                    if (runningSites[sch].host) {
                        ret.push(runningSites[sch].host);
                    }
                }
                return ret;
            }

            let runningSites = {}
            let scheduleUuid = null;
            function isOpenedByManager() {
                loadFlowControl();
                if(!runningSites || runningSites == {}) {
                    return false;
                }
                let uuid = null;
                for (const sch in runningSites) {
                    if ( (runningSites[sch].host && runningSites[sch].host == window.location.host) ||
                         (runningSites[sch].params && runningSites[sch].params.trackUrl && window.location.href.includes(runningSites[sch].params.trackUrl))
                       ) {
                        uuid = sch;
                        break;
                    }
                }
                if (!uuid) {
                    return false;
                }

                if (runningSites[uuid].runStatus == 'COMPLETED') {
                    return false;
                } else {
                    scheduleUuid = uuid;
                    return true;
                }
            };
            function loadFlowControl() {
                runningSites = persistence.load('runningSites', true) || {};
            };
            function setFlowControl(schedule, id, url, webType, params = null) {
                runningSites[schedule] = {
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
                    runningSites[schedule].params = params;
                } else {
                    runningSites[schedule].params = {};
                }
                saveFlowControl(schedule);
            };
            function isCompleted(expectedId) {
                loadFlowControl();
                for(const sch in runningSites) {
                    if (runningSites[sch].id == expectedId) {
                        if (runningSites[sch].runStatus == 'COMPLETED') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                return false;
            };
            function isIncompleted(expectedId) {
                loadFlowControl();
                for(const sch in runningSites) {
                    if (runningSites[sch].id == expectedId) {
                        if (runningSites[sch].runStatus == 'WORKING') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                return false;
            };
            function hasErrors(expectedId) {
                for(const sch in runningSites) {
                    if (runningSites[sch].id == expectedId && runningSites[sch].error) {
                        return true;
                    }
                }
                return false;
            };
            function getResult(schedule) {
                if (schedule) {
                    return runningSites.hasOwnProperty(schedule) ? runningSites[schedule].result : {};
                }
                return runningSites.hasOwnProperty(scheduleUuid) ? runningSites[scheduleUuid].result : {};
            };
            function getCurrent(schedule) {
                if (schedule) {
                    return runningSites.hasOwnProperty(schedule) ? runningSites[schedule] : {};
                }
                return runningSites.hasOwnProperty(scheduleUuid) ? runningSites[scheduleUuid] : {};
            };
            function saveAndclose(runDetails, delay = 0) {
                markAsVisited(runDetails);
                if(delay) {
                    setTimeout(window.close, delay);
                } else {
                    setTimeout(window.close, 1000);
                }
            };
            function purgeFlowControlSchedules(validSchedules) {
                loadFlowControl();
                let deletables = [];
                for (var sch in runningSites) {
                    if (!validSchedules.includes(sch)) {
                        deletables.push(sch);
                    }
                }
                deletables.forEach(x => {
                    delete runningSites[sch];
                });
                persistence.save('runningSites', runningSites, true);
            };
            function saveFlowControl(schedule) {
                schedule = schedule ? schedule : scheduleUuid;
                if (!schedule) {
                    persistence.save('runningSites', runningSites, true);
                    return;
                }
                let tempFlow = persistence.load('runningSites', true);
                tempFlow[schedule] = runningSites[schedule];
                persistence.save('runningSites', tempFlow, true);
            };
            function markAsVisited(runDetails, runStatus = 'COMPLETED') {
                if (!scheduleUuid) {
                    return;
                }
                runningSites[scheduleUuid].opened = true;
                runningSites[scheduleUuid].runStatus = runStatus;
                runningSites[scheduleUuid].result = runDetails ? runDetails : runningSites[scheduleUuid].result;

                saveFlowControl(scheduleUuid);
            };
            function addError(errorType, errorMessage, schedule) {
                if (schedule) {
                    runningSites[schedule].error = true;
                    runningSites[schedule].result.errorType = errorType;
                    runningSites[schedule].result.errorMessage = errorMessage;
                } else {
                    runningSites[scheduleUuid].error = true;
                    runningSites[scheduleUuid].result.errorType = errorType;
                    runningSites[scheduleUuid].result.errorMessage = errorMessage;
                }

                saveFlowControl(schedule ? schedule : scheduleUuid);
            };
            function closeWithError(errorType, errorMessage) {
                addError(errorType, errorMessage);
                window.close();
                setInterval(() => {
                    window.close();
                }, 15000);
            };
            function clearFlowControl(schedule) {
                if (schedule && schedule != 'all') {
                    runningSites[schedule] = {};
                    saveFlowControl(schedule);
                } else if (schedule == 'all') {
                    runningSites = {};
                    persistence.save('runningSites', {}, true);
                }
            };
            function clearRetries() {
                loadFlowControl();
                runningSites[scheduleUuid].retrying = false;
                saveFlowControl(scheduleUuid);
                return false;
            };
            function isRetrying() {
                if(runningSites[scheduleUuid].retrying) {
                    return true;
                }
                runningSites[scheduleUuid].retrying = true;
                saveFlowControl(scheduleUuid);
                return false;
            };
            function setProp(key, val) {
                runningSites[scheduleUuid][key] = val;
                saveFlowControl(scheduleUuid);
            };
            function getProp(key) {
                return runningSites[scheduleUuid][key];
            };
            function getParam(key) {
                try {
                } catch {}
                return runningSites[scheduleUuid].params[key];
            };
            initializeConfig();
            return {
                devlog: devlog,
                getDevLog: getDevLog,
                setFlowControl: setFlowControl,
                isCompleted: isCompleted,
                isIncompleted: isIncompleted,
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
                getParam: getParam,
                migrationApplied: migrationApplied,
                purgeFlowControlSchedules: purgeFlowControlSchedules,
                getRunningSites: getRunningSites
            };
        },
        createCFPromotions: function() {
            let codes = [];

            function PromotionCode(id, code, repeatDaily = false, expiration = null, isRemoved = false) {
                this.id = id;
                this.code = code;
                this.added = new Date();
                this.statusPerFaucet = [];
                this.repeatDaily = repeatDaily;
                this.lastExecTimeStamp = null;
                this['expiration' + 'Date'] = expiration;
                this.isRemoved = isRemoved;
            };

            function getFaucetStatusInPromo(promo, faucetId) {
                let faucet = promo.statusPerFaucet.find(x => x.id == faucetId);
                if (faucet.status && promo.repeatDaily) {
                    if((faucet.status == K.CF.PromoStatus.ACCEPTED && (Date.now() - faucet.execTimeStamp.getTime()) > K.Integers.HS_26_IN_MILLISECONDS)
                       || (faucet.status == K.CF.PromoStatus.USEDBEFORE && (Date.now() - faucet.execTimeStamp.getTime()) > K.Integers.HS_2_IN_MILLISECONDS)) {
                        faucet.status = K.CF.PromoStatus.PENDING;
                    }
                }
                return faucet.status ?? K.CF.PromoStatus.NOCODE;
            };

            function addNew(code, repeatDaily = false, expiration = null) {
                let found = codes.find(x => x.code == code);
                if (found) {
                    found.repeatDaily = repeatDaily;
                    found['expiration' + 'Date'] = expiration;
                    found.isRemoved = false;
                } else {
                    found = new PromotionCode(codes.length, code, repeatDaily, expiration);
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

                save();
            };

            function includeNewCodes(newCodes) {
                for(let i=0; i<newCodes.length; i++) {
                    let item = newCodes[i];
                    let exists = codes.find(x => x.code.toLowerCase() == item.code.toLowerCase());
                    if (!exists) {
                        addNew(item.code, !item.oneTimeOnly, item['expiration' + 'Date']);
                    } else {
                    }
                }
            };

            function getAll() {
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
                save();
            };

            function removeAll() {
                codes.forEach(x => x.isRemoved = true);
                codes = codes.filter(x => x['expiration' + 'Date'] && Date.parse(x['expiration' + 'Date']) > Date.now());
                save();
            };

            function remove(id, code) {
                let idx = codes.findIndex(x => x.id == id && x.code == code);
                if(idx != -1) {
                    codes[idx].isRemoved = true;
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
            let firstRollCompleted = false;

            function init() {
                let urlType = helpers.cf.getUrlType(window.location.href);
                console.log('URL TYPE:', urlType)
                switch(urlType) {
                    case K.CF.UrlType.FREE:
                        if(localeConfig.setToEnglish) {
                            document.querySelector('.locale-changer .p-dropdown-trigger')?.click();
                            setTimeout(() => {
                                document.querySelector("#pv_id_3_3")?.click();
                            }, 1000);
                        }
                        addJS_Node (null, null, overrideSelectNativeJS_Functions);
                        interactions = objectGenerator.createInteractions();
                        run();
                        break;

                    case K.CF.UrlType.PROMOTION:
                        interactions = objectGenerator.createInteractions();
                        runPromotion();
                        break;
                    case K.CF.UrlType.GAMES:
                        location.replace('/free');
                        break;
                    case K.CF.UrlType.HOME:
                    case K.CF.UrlType.LOGIN:
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
                setInterval(tryClosePopup, helpers.randomMs(3000, 6000));
                setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
            };

            function doLogin() {
                navigationProcess = NavigationProcess.LOGIN;

                setTimeout(findLoginForm, helpers.randomMs(2000, 5000));
            };

            function isFullyLoaded() { //Waits 55 seconds max
                if(document.readyState == 'complete' || timeWaiting == -1) {
                    timeWaiting = 0;
                    if (firstRollCompleted) {
                        roll();
                    } else {
                        interact();
                    }
                } else {
                    timeWaiting = -1;
                    setTimeout(isFullyLoaded, helpers.randomMs(15000, 25000));
                }
            };
            function runPromotion() {
                navigationProcess = NavigationProcess.PROCESSING_PROMOTION
                setTimeout(findPromotionTag, helpers.randomMs(1000, 3000));
            };
            function tryClosePopup() {
                let popupBtn = document.querySelector('.p-dialog .p-dialog-header-close');
                if (popupBtn && popupBtn.isVisible()) {
                    popupBtn.click();
                }
            };
            function isRollResultVisible() {
                let rollDiv = document.querySelector('.result');
                if (rollDiv && rollDiv.isVisible() && rollDiv.innerText != '') {
                }
            };
            let waitRollNumberCount = 0;
            function closeToast() {
                document.querySelector('.p-toast-icon-close')?.click();
            }
            async function waitForRollNumber() {
                let newNumber = -1;
                try { // intento leer el rolled number
                    newNumber = [...document.querySelectorAll('.lucky-number-wrapper img')].map(x => x.src.split('/').slice(-1)[0].split('.').slice(-3)[0]).join('');
                    newNumber = parseInt(newNumber)
                } catch(err) {
                    newNumber = null;
                }
                if (newNumber === null) { // si no logro leerlo, bajo 1 en tempRollNumber
                    if (tempRollNumber < 0) {
                        tempRollNumber -= 1;
                    } else {
                        tempRollNumber = -1;
                    }
                    if (tempRollNumber < -5) {
                        processRunDetails();
                        return;
                    } else {
                        await wait(3000);
                        return waitForRollNumber();
                    }
                }

                if (newNumber == tempRollNumber) {
                    timeWaiting = 0;
                    if (shared.getConfig()['cf.rollOnce']) {
                        processRunDetails();
                        return;
                    } else {
                        firstRollCompleted = true;
                        closeToast();
                        setTimeout(findCountdownOrRollButton, helpers.randomMs(1000, 2000));
                        return;
                    }
                } else {
                    waitRollNumberCount++;
                    if (waitRollNumberCount > 15) {
                        setTimeout(() => { location.reload(); }, 5000);
                        return;
                    }

                    tempRollNumber = newNumber;
                    await wait(3000);
                    return waitForRollNumber();
                }

            };
            function isLoggedIn() {
                return !!document.querySelector('[data-icon="user"]');
            }

            function findCountdownOrRollButton() {
                if (!isLoggedIn()) {
                    location.reload();
                }
                if( isCountdownVisible() && !isRollButtonVisible() ) {
                    timeWaiting = 0;
                    processRunDetails();
                } else if ( !isCountdownVisible() && isRollButtonVisible() ) {
                    timeWaiting = 0;
                    setTimeout(isFullyLoaded, helpers.randomMs(1000, 5000));
                } else if ( isCountdownVisible() && isRollButtonVisible() ) {
                    try {
                        let minLeft = document.querySelector('.minutes .digits').innerText;
                        if (minLeft < 1) {
                            timeWaiting = 0;
                            setTimeout(isFullyLoaded, helpers.randomMs(1000, 5000));
                        }
                    } catch (err) { console.log(`Error on alt logic of CF roll: ${err}`); }
                } else {
                    if (timeWaiting/1000 > shared.getConfig()['defaults.timeout'] * 60) {
                        shared.closeWithError(K.ErrorType.TIMEOUT, '');
                        return;
                    }

                    timeWaiting += 3000;
                    setTimeout(findCountdownOrRollButton, helpers.randomMs(2000, 5000));
                }
            };
            function addUrlChangeListener() {
                if (window.onurlchange === null) {
                    window.addEventListener('urlchange', (data) => {
                        if (navigationProcess == NavigationProcess.LOGIN && !window.location.href.includes('/login')) {
                            loopingForErrors = false;
                            init();
                        }
                    });
                }    
            };
            function findLoginForm() {
                if ( document.querySelector('#email')?.isVisible() && document.querySelector('#password')?.isVisible() ) {
                    addUrlChangeListener();
                    let errElement = document.querySelector('.login-wrapper .error');
                    if( errElement && errElement.innerHTML != '') {
                        let errorMessage = errElement.innerText;
                        shared.closeWithError(K.ErrorType.LOGIN_ERROR, errorMessage);
                        return;
                    }
                    if(!loopingForErrors) {
                        if(shared.getConfig()['cf.credentials.mode'] == 1) {
                            timeWaiting = 0;
                            helpers.typer(document.querySelector('.login-wrapper input[name="email"],#email'), shared.getConfig()['cf.credentials.email']);
                            helpers.typer(document.querySelector('.login-wrapper input[name="password"],#password'), shared.getConfig()['cf.credentials.password']);
                            document.querySelector('#password')?.closest('div')?.querySelector('button')?.click();
                            loopingForErrors = true;
                        } else {
                            if(document.querySelector('.login-wrapper input[name="email"],#email').value != '' && document.querySelector('.login-wrapper input[name="password"],#password').value != '') {
                                document.querySelector('#password')?.closest('div')?.querySelector('button')?.click();
                                loopingForErrors = true;
                            } else {
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
                countdown = document.querySelectorAll('.minutes .digits');
                return (countdown.length > 0 && countdown[0].isVisible());
            };
            function isRollButtonVisible() {
                let rollButtonIcon = document.querySelector('.p-button [data-icon="gift"]');
                if (!rollButtonIcon) {
                    return false;
                }
                rollButton = rollButtonIcon.closest('button');
                return rollButton && !rollButton.disabled && rollButton.isVisible();
            };
            function roll() {
                rollButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
                rollButton.click();
                tempRollNumber = -1;
                setTimeout(waitForRollNumber, helpers.randomMs(4000, 7000));
            }
            function isPromotionTagVisible() {
                let pTag;
                try {
                    pTag = document.querySelectorAll('.p-message-text.p-message-text')[0];
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
                    shared.updateWithoutClosing(result, 'WORKING');
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
                let minsElement = document.querySelector('.minutes .digits');
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
                    claimed = document.querySelector('.p-toast-message-text .p-toast-detail').innerHTML;
                    claimed = claimed.trim();
                    claimed = claimed.split(' ').slice(-2)[0]
                } catch(err) { }
                return claimed;
            };
            function readRolledNumber() {
                let number = 0;
                try {
                    number = [...document.querySelectorAll('.lucky-number-wrapper img')].map(x => x.src.split('/').slice(-1)[0].split('.').slice(-3)[0]).join('');
                    number = parseInt(number);
                } catch(err) { }
                return number;
            };
            function readBalance() {
                let balance = "";
                try {
                    balance = document.querySelectorAll('header div div div > span span')[1].innerText.trim().split(' ')[0];
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
    };

    function overrideSelectNativeJS_Functions () {
        window.alert = function alert (message) {
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
    function addHtml(data) { // data = { target: '', where: '', content: '' }
        document.querySelector(data.target).insertAdjacentHTML(data.where, data.content);
    }
    function addTemplateTag(data) {
        let templateTag = document.createElement('template');
        templateTag.id = data.id;
        templateTag.innerHTML = data.content;
        let container = document.body || document.documentElement;
        container.appendChild(templateTag);
    }
    function useTemplate(data) { // data = { templateId: '', target: '', where: '', replacements: {} }
        let template = document.querySelector(`#${data.templateId}`).innerHTML;
        let content = template.formatUnicorn(data.replacements);
        addHtml({
            target: data.target,
            where: data.where,
            content: content
        });
    }

    function isExpectedPtc() {
        let runningList = shared.getRunningSites();
        let ptcHosts = ['faucetpay.io'];

        for (let i = 0; i < ptcHosts.length; i++) {
            if (document.referrer.includes(`//${ptcHosts[i]}`) && runningList.includes(ptcHosts[i])) {
                waitForCloseSignal(ptcHosts[i]);
                return true;
            }
        }
        return false;
    }

    async function waitForCloseSignal(host) {
        await wait(3000);
        const signal = GM_getValue(`ptc-close-signal-${host}`) || null;
        if (signal) {
            window.close();
        }
        return waitForCloseSignal(host);
    }

    function detectWeb() {
        if (isExpectedPtc()) {
            return;
        }
        if(!shared.isOpenedByManager()) {
            return;
        }
        instance = K.LOCATION.SITE;

        let typeFromManager = shared.getCurrent().type;

        siteTimer = new Timer({ isManager: false, delaySeconds: 20, uuid: shared.getProp('schedule'), webType: typeFromManager });
        switch( typeFromManager ) {
            case K.WebType.STORMGAIN:
                SiteProcessor = createSGProcessor();
                setTimeout(SiteProcessor.run, helpers.randomMs(10000, 20000));
                break;
            case K.WebType.CRYPTOSFAUCETS:
                SiteProcessor = objectGenerator.createCFProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(1000, 3000));
                break;
            case K.WebType.FREEBITCOIN:
                SiteProcessor = createFBProcessor();
                setTimeout(SiteProcessor.run, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.FAUCETPAY:
                SiteProcessor = new FPPtc();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(2000, 5000));
                break;
            case K.WebType.BIGBTC:
                SiteProcessor = createBigBtcProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(2000, 4000));
                break;
            case K.WebType.BESTCHANGE:
                SiteProcessor = createBestChangeProcessor();
                setTimeout(SiteProcessor.init, helpers.randomMs(4000, 6000));
                break;
            case K.WebType.BFBOX:
                SiteProcessor = new BFRoll(helpers.getEnumText(K.CMC, shared.getCurrent().params.cmc).toLowerCase());
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
            case K.WebType.FPB:
                SiteProcessor = new FPB(shared.getCurrent().params.sitePrefix);
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.FREEGRC:
                SiteProcessor = new GRCRoll();
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
            case K.WebType.CTOP:
                SiteProcessor = new CTop();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.AUTOCML:
                SiteProcessor = new AutoCMl();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            case K.WebType.CCLICKS:
                SiteProcessor = new CClicks();
                setTimeout(() => { SiteProcessor.init() }, helpers.randomMs(3000, 5000));
                break;
            default:
                break;
        }
    }

    class UiBaseRenderer {
        constructor(uiRenderer) { this.uiRenderer = uiRenderer; }
    }
    class UiSitesRenderer extends UiBaseRenderer {
        appendEventListeners() {

            document.querySelector('#modal-assign-schedule').addEventListener('click', this.onClickOnModalAssignSchedule.bind(this));
            eventer.on('siteChangedSchedule', (e) => {
                this.uiRenderer.toast(`Site moved to schedule ${e.scheduleId}`);
                manager.resyncAll({withUpdate: true}); // should act based on data only
            });

            document.querySelector('#schedule-table-body').addEventListener('click', this.onClickOnSitesTableBody.bind(this));

            document.querySelector('.action-edit-all-sites').addEventListener('click', this.onClickOnEditAllSites.bind(this));
            document.querySelector('.action-edit-all-sites-cancel').addEventListener('click', this.onClickOnCancelEditAllSites.bind(this));
            document.querySelector('.action-edit-all-sites-save').addEventListener('click', this.onClickOnSaveEditAllSites.bind(this));

            document.querySelector('.action-add-external-site').addEventListener('click', this.onClickOnAddSiteButton.bind(this));
            document.querySelector('#modal-add-site').addEventListener('click', this.onClickOnModalAddSite.bind(this));
            eventer.on('siteAdded', (e) => {
                this.uiRenderer.toast(`Site ${e.siteName} added`);
                manager.resyncAll({withUpdate: true}); // should act based on data only
            });
            eventer.on('siteRemoved', (e) => {
                this.uiRenderer.toast(`Site ${e.siteName} removed`);
                manager.resyncAll({withUpdate: true}); // should act based on data only
            });
        }

        _legacyAddBadges(stats) {
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

        removeDeletedSitesRows(validSiteIds) {
            let removableRows = [...document.querySelectorAll('#schedule-table-body tr')].filter(r => !validSiteIds.includes(r.dataset.id));
            removableRows.forEach(r => {
                r.remove();
            });
        }

        renderSiteRow(site) {

            let row = [...document.querySelectorAll('#schedule-table-body tr')]
                        .filter(r => r.dataset.id == site.id);

            if (row.length == 0) {
                row = document.createElement('tr');
                document.querySelector('#schedule-table-body').appendChild(row);
                row.setAttribute('aria-expanded', false);
                row.classList.add('align-middle');
                row.dataset.id = site.id;
                row.dataset.cmc = site.cmc;
            } else {
                row = row[0];
            }

            row.dataset.json = `${JSON.stringify(site)}`;
            row.dataset.schedule = site.schedule;
            row.dataset.nextRollTimestamp = site.nextRoll ? site.nextRoll.getTime() : 'null';
            row.dataset.enabled = site.enabled ? '1' : '0';
            if (site.balance) {
                if (typeof site.balance == 'string') {
                    row.dataset.balance = site.balance.split(' ')[0];
                } else {
                    row.dataset.balance = site.balance.toFixed(8);
                }
            } else {
                row.dataset.balance = '';
            }

            let tds = '';

            tds += '<td class="align-middle edit-status d-none em-only"><label class="switch"><input type="checkbox" data-original="' + (site.enabled ? '1' : '0') + '" ' + (site.enabled ? 'checked' : ' ') + '><span class="slider round"></span></label></td>';
            tds += '<td class="align-middle" title="' + helpers.getPrintableDateTime(site.nextRoll) + '"><span><i class="fas fa-square pr-1" style="color: #' + site.schedule + ';"></i></span>' + helpers.getTdPrintableTime(site.nextRoll) + '</td>';
            if (site.isExternal && site.clId == -1) {
                tds += '<td class="align-middle text-left"><a class="" title="Visit site" target="_blank" rel="noreferrer" href="' + site.url + '"><i class="fa fa-external-link-alt"></i></a></td>';
            } else {
                tds += '<td class="align-middle text-left"><a class="" title="Visit site" target="_blank" rel="noreferrer" href="' + (new URL(site.clId, 'https://criptologico.com/goto/')).href + '"><i class="fa fa-external-link-alt"></i></a></td>';
            }

            tds += '<td class="align-middle em-input text-left" data-field="displayName">';
            if (site.cmc) {
                tds +='<div class="input-group input-group-sm">';
                tds += '<div class="input-group-prepend"><span class="input-group-text">';
                if (site.cmc > 0) {
                    let cmcLower = helpers.getEnumText(K.CMC, site.cmc).toLowerCase();
                    tds += '<img loading="lazy" src="/static/c-icons/' + cmcLower + '.svg" height="20" alt="' + cmcLower + '">';
                } else {
                    tds += '<i class="fa fa-question-circle"></i>';
                }
                tds += '</span></div>';
            }
            tds += ' <span class="site-name-container px-1">' + site.name + '</span></div></td>';

            tds +='<td class="align-middle text-right">' + site.lastClaim.toFixed(Number.isInteger(site.lastClaim) ? 0 : 8) + '</td>';
            tds +='<td class="align-middle text-right">' + site.aggregate.toFixed(Number.isInteger(site.aggregate) ? 0 : 8) + '</td>';

            tds += '<td class="align-middle text-right">' + (+row.dataset.balance > 100 ? (+row.dataset.balance).toFixed(2) : row.dataset.balance)  + '</td>';
            tds +='<td class="align-middle text-right fiat-conversion em-hide"></td>';
            tds +='<td class="align-middle">' + this._legacyAddBadges(site.stats) + '</td>';
            tds +='<td class="align-middle justify-content-center em-hide">';

            tds += 
            `<div class="btn-group btn-group-sm">
                <button type="button" title="Run ASAP" class="btn btn-default action-run-asap">
                    <i class="fa fa-bolt"></i>
                </button>
                <button type="button" title="Schedule parameters..." 
                    class="btn btn-default action-edit-site ${Object.keys(site.params).some( k => k.endsWith('.override') && site.params[k] == true ) ? 'text-warning' : ''}">
                    <i class="fa fa-clock"></i>
                </button>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-default dropdown-toggle dropdown-icon" data-toggle="dropdown" aria-expanded="false">
                    </button>
                    <div class="dropdown-menu dropdown-menu-right text-sm" style="">
                        <a class="dropdown-item action-site-edit-parameters"><i class="fa fa-edit"></i> Site arguments...</a>
                        <a class="dropdown-item action-site-assign-schedule"><i class="fa fa-exchange-alt"></i> Move to...</a>`;
            if (site.isExternal) {
                tds += `<a class="dropdown-item action-site-remove-external"><i class="fa fa-trash"></i> Remove site</a>`;
            }
            tds += `</div></div></div>`;

            tds +='</td></tr>';

            row.innerHTML = tds;
        }

        legacyRenderSiteData(site, config) {
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
        }

        sortSitesTable() {
            const tbody = document.querySelector('#schedule-table-body');

            let rows, switching, i, shouldSwitch;
            switching = true;
            while (switching) {
                switching = false;
                rows = tbody.rows;

                for (i = 0; i < (rows.length - 1); i++) {
                    shouldSwitch = false;

                    let aNextRoll, bNextRoll, aHasLoginError, bHasLoginError, aName, bName;
                    aNextRoll = rows[i].dataset.nextRollTimestamp;
                    bNextRoll = rows[i + 1].dataset.nextRollTimestamp;
                    if (aNextRoll == 'null' && bNextRoll == 'null') {
                        aName = rows[i].querySelector('.site-name-container').innerText;
                        bName = rows[i + 1].querySelector('.site-name-container').innerText;
                        if (aName.toLowerCase() > bName.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    } else if (aNextRoll == 'null' || (aNextRoll > bNextRoll)) {
                        shouldSwitch = true;
                        break;
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }
        }

        onClickOnSitesTableBody(e) {
            let actionElement = e.target;
            if (actionElement.tagName === 'I') {
                actionElement = actionElement.parentElement;
            }
            const row = actionElement.closest('tr');
            if (actionElement.classList.contains('action-edit-site')) {
                e.stopPropagation();
                this.uiRenderer.openModal('modal-site', row.dataset.id);
            } else if (actionElement.classList.contains('action-run-asap')) {
                e.stopPropagation();
                Site.setAsRunAsap(row.dataset.id);
            } else if (actionElement.classList.contains('action-site-assign-schedule')) {
                this.uiRenderer.openModal('modal-assign-schedule', { site_id: row.dataset.id, schedule_id: row.dataset.schedule });
            } else if (actionElement.classList.contains('action-site-edit-parameters')) {
                this.uiRenderer.openModal('modal-site-parameters', { site_id: row.dataset.id });
            } else if (actionElement.classList.contains('action-site-remove-external')) {
                Site.remove(row.dataset.id);
                console.info('TODO: remove site and all the related configuration', row.dataset.id);
            }
        }

        onClickOnModalAssignSchedule(e) {
            const modalAssignScheduleToSite = document.querySelector('#modal-assign-schedule');
            let actionElement = e.target.tagName === 'I' ? e.target.parentElement : e.target;
            if (actionElement.classList.contains('modal-save')) {
                let data = this.uiRenderer.parseContainer(modalAssignScheduleToSite.querySelector('.form-container'));
                if (data.original_schedule_id == data.schedule) {
                } else {
                    Site.getById(data.site_id).changeSchedule(data.schedule);
                }
            }
        }

        onClickOnModalAddSite(e) {
            const modal = document.querySelector('#modal-add-site');
            let actionElement = e.target.tagName === 'I' ? e.target.parentElement : e.target;
            if (actionElement.classList.contains('modal-save')) {
                let formData = this.uiRenderer.parseContainer(modal.querySelector('.form-container'));
                let data = {};
                data.name = formData.site_name;
                data.url = new URL(formData.site_url);
                data.schedule = formData.schedule;
                data.clId = -1;
                data.id = 'ext_rnd_id_' + helpers.randomString(8);
                data.type = K.WebType.UNDEFINED;
                data.cmc = -1;
                data.rf = '';
                data.isExternal = true;

                console.warn('Savable new site');
                Site.add(data);
                return;
                if (data.original_schedule_id == data.schedule) {
                } else {
                    Site.getById(data.site_id).changeSchedule(data.schedule);
                }
            }
        }

        onClickOnEditAllSites(e) {
            document.querySelectorAll("#schedule-table-body td.em-input .site-name-container").forEach(function (x) {
                let val = x.innerHTML;
                x.innerHTML = "<input type=\'text\' class=\'form-control form-control-sm\' data-original=\'" + val.trim() + "\' value=\'" + val.trim() + "\' />";
            });
            document.querySelectorAll("#schedule-table-body td.edit-status").forEach(function (x) {
                x.classList.remove("d-none");
            });
            document.querySelectorAll(".em-only").forEach(x => x.classList.remove("d-none"));
            document.querySelectorAll(".em-hide").forEach(x => x.classList.add("d-none"));
        }

        onClickOnCancelEditAllSites(e) {
            document.querySelectorAll("#schedule-table-body td.em-input .site-name-container input").forEach(function(x) {
                x.parentNode.innerHTML = x.dataset.original;
            });
            document.querySelectorAll(".em-only").forEach(x => x.classList.add("d-none"));
            document.querySelectorAll(".em-hide").forEach(x => x.classList.remove("d-none"));
        }

        onClickOnSaveEditAllSites(e) {
            let updateObject;
            var updateData = document.getElementById("update-data");
            if (updateData.innerHTML != "") {
                updateObject = JSON.parse(updateData.innerHTML);
            } else {
                updateObject = {
                    runAsap: { ids: [], changed: false }, 
                    editSingle: { changed: false, items: [] }, 
                    wallet: { changed: false, items: [] }, 
                    config: { changed: false, items: [] }, 
                    site: { changed: false, list: [] }
                };
            }

            document.querySelectorAll("#schedule-table-body tr").forEach(function (row) {
                let textInputCell = row.querySelector(".em-input .site-name-container");
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
                this.uiRenderer.toast("Data will be updated as soon as possible");
            }

            document.querySelectorAll(".em-only").forEach(x => x.classList.add("d-none"));
            document.querySelectorAll(".em-hide").forEach(x => x.classList.remove("d-none"));
        }

        onClickOnAddSiteButton(e) {
            e.stopPropagation();
            this.uiRenderer.openModal('modal-add-site');
        }

        renderAddExternalSite() {
            const modalAssignSchedule = document.getElementById('modal-add-site');
            let selectElm = modalAssignSchedule.querySelector('select');
            let options = [];
            let firstSchedule = '';
            Schedule.getAllForCrud().forEach(sch => {
                if (firstSchedule == '') {
                    firstSchedule = sch.uuid;
                }
                options.push(`<option value="${sch.uuid}"><i class="fas fa-square" style="color: #${sch.uuid}"></i>${sch.name}</option>`)
            });
            selectElm.innerHTML = options.join('');
            selectElm.value = firstSchedule;
            return;
        }

        renderAssignScheduleToSite(values) {
            const modalAssignSchedule = document.getElementById('modal-assign-schedule');
            modalAssignSchedule.querySelector('input[name="site_id"]').value = values.site_id;
            modalAssignSchedule.querySelector('input[name="original_schedule_id"]').value = values.schedule_id;
            let selectElm = modalAssignSchedule.querySelector('select');
            let options = [];
            Schedule.getAllForCrud().forEach(sch => {
                options.push(`<option value="${sch.uuid}"><i class="fas fa-square" style="color: #${sch.uuid}"></i>${sch.name}</option>`)
            });
            selectElm.innerHTML = options.join('');
            selectElm.value = values.schedule_id || "";
            return;
        }
    }
    class UiPromosRenderer extends UiBaseRenderer {
        appendEventListeners() {
            document.querySelector('#promo-button').addEventListener('click', this.onClickSavePromoCode.bind(this));
            document.querySelector('#button-try-get-codes').addEventListener('click', this.onClickTryGetCodes.bind(this));
            document.querySelector('#promo-table-body').addEventListener('click', this.onClickOnPromoTableBody.bind(this));
        }

        onClickSavePromoCode(e) {
            var promoText = document.getElementById("promo-text-input");
            var promoCode = document.getElementById("promo-code-new");
            var promoDaily = document.getElementById("promo-daily");
            var promoObject = { action: "ADD", code: promoText.value.trim(), repeatDaily: promoDaily.checked };
            promoCode.innerHTML =JSON.stringify(promoObject);
            this.uiRenderer.toast("Adding promo code: " + promoObject.code + "...");
            promoText.value = '';
        }

        onClickTryGetCodes(e) {
            var promoCode = document.getElementById("promo-code-new");
            var promoObject = { action: "TRYGETCODES" };
            promoCode.innerHTML =JSON.stringify(promoObject);
            this.uiRenderer.toast("Fetching codes...");
        }

        _legacyRemoveUsedDailyCodes(codes) {
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

        legacyRenderPromotionTable(codes) {
            let tableBody = '';
            this._legacyRemoveUsedDailyCodes(codes);

            for(let c=0; c < codes.length; c++) {
                let data = codes[c];
                tableBody += '<tr data-promotion-code="' + data.code + '" data-promotion-id="' + data.id + '">';
                tableBody += '<td class="align-middle text-left ' + (data.repeatDaily ? 'text-warning' : '') + '">';
                tableBody += `<a class="action-remove-promo-code" data-toggle="tooltip" data-placement="left" title="Remove" onclick=""><i class="fa fa-times-circle"></i></a>`;
                tableBody += '<span  title="' + (data.repeatDaily ? 'Reusable Code' : 'One-time-only Code') + '">' + data.code + '</span></td>';
                tableBody +='<td class="align-middle" title="' + (data.repeatDaily ? 'Reusable Code' : 'One-time-only Code') + '">' + helpers.getPrintableDateTime(data.added) + '</td>';

                for(let i=0, all = data.statusPerFaucet.length; i < all; i++) {
                    tableBody +='<td class="align-middle" title="Runned @' + helpers.getPrintableDateTime(data.statusPerFaucet[i].execTimeStamp) + '">' + helpers.getEmojiForPromoStatus(data.statusPerFaucet[i].status ?? 0) + '</td>';
                }
                tableBody +='</tr>';
            }

            document.getElementById('promo-table-body').innerHTML = tableBody;
        }

        onClickOnPromoTableBody(e) {
            let actionElement = e.target;
            if (actionElement.tagName === 'I') {
                actionElement = actionElement.parentElement;
            }
            const row = actionElement.closest('tr');
            if (actionElement.classList.contains('action-remove-promo-code')) {
                e.stopPropagation();
                var promoCode = document.getElementById("promo-code-new");
                var promoObject = { action: "REMOVE", id: row.dataset.promotionId, code: row.dataset.promotionCode };
                promoCode.innerHTML =JSON.stringify(promoObject);
            }
        }
    }
    class UiConfigRenderer extends UiBaseRenderer {
        legacyRenderConfigData(data) {
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
            let elDevlogEnabled = document.querySelector('[data-prop="devlog.enabled"]');
            let elDevlogMaxLines = document.querySelector('[data-prop="devlog.maxLines"]');
            let elJtfeyCredentialsMode = document.querySelector('[data-prop="jtfey.credentials.mode"]');
            let elJtfeyCredentialsUsername = document.querySelector('[data-prop="jtfey.credentials.username"]');
            let elJtfeyCredentialsPassword = document.querySelector('[data-prop="jtfey.credentials.password"]');
            let elYCoinCredentialsMode = document.querySelector('[data-prop="ycoin.credentials.mode"]');
            let elYCoinCredentialsUsername = document.querySelector('[data-prop="ycoin.credentials.username"]');
            let elYCoinCredentialsPassword = document.querySelector('[data-prop="ycoin.credentials.password"]');

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

            elDevlogMaxLines.disabled = !elDevlogEnabled.checked;
            elDevlogEnabled.onchange = function (e) {
                document.querySelector('[data-prop="devlog.maxLines"]').disabled = !e.target.checked;
            }
        }
    }
    class UiWalletRenderer extends UiBaseRenderer {
        legacyRenderWalletTable(data) {
            let tableBody = '';

            for(let i=0, all = data.length; i < all; i++) {
                tableBody += '<tr class="align-middle" data-id="'+ data[i].id + '">';
                tableBody += '<td class="align-middle">' + data[i].name + '</td>';
                tableBody += '<td class="align-middle em-input"><input type="text" class="w-100" onfocus="this.select();" data-field="address" data-original="' + data[i].address + '" value="' + data[i].address + '"></td>';
                tableBody += '</tr>';
            }

            document.getElementById('wallet-table-body').innerHTML = tableBody;
        }
    }
    class UiSchedulesRenderer extends UiBaseRenderer {
        appendEventListeners() {
            document.querySelector('#schedules-toggler').addEventListener('change', this.onScheduleToggled.bind(this));
        }

        onScheduleToggled(e) {
            e.stopPropagation();
            let actionElement = e.target.tagName !== 'LABEL' ? e.target.closest('label') : e.target;
            let otherActiveLabels = [...actionElement.parentElement.querySelectorAll('label.active')].filter(l => l.dataset.schedule != actionElement.dataset.schedule);
            if (otherActiveLabels.length > 0) {
                otherActiveLabels.forEach(l => l.classList.remove('active'));
            }
            this.toggleSchedule(actionElement.dataset.schedule);
        }

        toggleSchedule(uuid) {

            if (uuid) {
                this.selectedSchedule = uuid;
            } else {
                if (!this.selectedSchedule) {
                    this.selectedSchedule = 'all';
                }
            }

            [...document.querySelectorAll('#schedule-table-body tr')].forEach((row) => {
                if (this.selectedSchedule == 'all') {
                    row.classList.remove('d-none');
                } else if (row.getAttribute('data-schedule') == this.selectedSchedule) {
                    row.classList.remove('d-none');
                } else {
                    row.classList.add('d-none');
                }
            });

            if (this.selectedSchedule == 'all') {
                [...document.querySelectorAll('#console-log tr')].forEach(x => {
                    x.classList.remove('d-none');
                })
            } else {
                [...document.querySelectorAll('#console-log tr')].forEach(x => {
                    if (x.getAttribute('data-schedule') == 'false' || x.getAttribute('data-schedule') == this.selectedSchedule) {
                        x.classList.remove('d-none');
                    } else {
                        x.classList.add('d-none');
                    }
                })
            }
        };

        renderTBody() {
            let rows = [];
            Schedule.getAllForCrud().forEach(sch => {
                rows.push(this.renderRow(sch));
            });
            return rows.join('');
        }

        renderRow(sch) {
            let row = 
            `<tr data-uuid="${sch.uuid}" 
                    data-order="${sch.order}" 
                    data-added="${sch.added ? 'true' : 'false'}" 
                    data-removed="false" 
                    data-updated="false" 
                    data-originals='${!sch.added ? JSON.stringify(sch) : ""}'>
                <td class="row-handle"><i class="fas fa-grip-vertical"></i></td>
                <td><div class="input-group input-group-sm color-picker colorpicker-element" style="max-width: 125px;">
                    <div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-square" style="color: #${sch.uuid}"></i></span></div>
                    <input type="text" name="uuid" class="form-control" data-original-title="" value="${sch.uuid}">
                </div></td>
                <td><input type="text" name="name" class="form-control form-control-sm" value="${sch.name}"></td>
                <td>
                    <button type="button" title="Remove" class="btn btn-default btn-sm action-schedule-remove"><i class="fa fa-trash"></i></button>
                </td>
            </tr>`;
            return row;
        }
    }
    class UiSiteParameterRenderer extends UiBaseRenderer {
        static handlers = new Map();

        static registerHandler(name, handler) {
            UiSiteParameterRenderer.handlers.set(name, handler);
        }

        static getHandler(name) {
            const handlerClass = UiSiteParameterRenderer.handlers.get(name);
            return handlerClass || false;
        }

        appendEventListeners() {
            document.querySelector('#modal-site-parameters').addEventListener('click', this.onClickOnModalSiteParameter.bind(this));
        }

        onClickOnModalSiteParameter(e) {
            const modal = document.querySelector('#modal-site-parameters');
            let actionElement = e.target.tagName === 'I' ? e.target.parentElement : e.target;
            if (actionElement.classList.contains('modal-save')) {
                e.preventDefault();
                let form = modal.querySelector('.form-container form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                let data = this.uiRenderer.parseContainer(form);
                $(modal).modal('hide');
            }
        }

        renderFields(values) {
            let fieldsHtml = '';
            values.forEach( field => {
                field.text = field.text || field.name.charAt(0).toUpperCase() + field.name.slice(1).toLowerCase().replaceAll('_', ' ');

                switch (field.type) {
                    case 'credentials_or_autofilled': // TODO: will need to condition username/email/password!
                        break;
                    case 'email':
                        fieldsHtml += uiRenderer.addInputEmailHtml(field);
                        break;
                    case 'password':
                        fieldsHtml += uiRenderer.addInputPasswordHtml(field);
                        break;
                    case 'checkbox':
                        field.value = (field.value === true || field.value === 'true' || field.value === 1 || field.value === "1") ? true : false;
                        fieldsHtml += uiRenderer.addSliderHtml(field);
                        break;
                    case 'numberInput':
                        fieldsHtml += uiRenderer.addInputNumberHtml(field);
                        break;
                    case 'textInput':
                    case 'username':
                        field.required = 'true';
                    default:
                        fieldsHtml += uiRenderer.addInputTextHtml(field);
                        break;
                }
            });
            const modalSiteParameters = document.getElementById('modal-site-parameters');
            modalSiteParameters.querySelector('.form-container form').innerHTML = fieldsHtml;
        }

        renderEditSiteParameters(args) { // { site_id: 'x' }
            const site = Site.getById(args.site_id);

            const siteParameters = site.getSiteParameters(); // async? for external site parameters that need to be loaded from other stg...

            if (!siteParameters) {
                console.warn(`Site ${site.id} ${site.name} does not require parameters setup.`);
                return;
            }

            if (!siteParameters.handler) {
                console.warn(`Handler name is missing`);
                return;
            }

            const handlerClass = UiSiteParameterRenderer.getHandler(siteParameters.handler);
            if (!handlerClass) {
                console.warn(`Invalid handler class name: ${siteParameters.handler}`);
                return;
            }

            const handler = new handlerClass(siteParameters.values);
            handler.preRender();

            let fields = [
                { name: 'AUTO_UPDATE_PROMO_CODES', type: 'checkbox', value: 'false' },
                { name: 'MAX_ROLLS_PER_VISIT', type: 'numberInput', value: 1, min: 0 },
                { name: 'AUTO_LOGIN', type: 'checkbox', value: 'true' },
                { name: 'EMAIL', type: 'email', value: '' },
                { name: 'PASSWORD', type: 'password', value: '' }
            ];

            fields.forEach( (f, idx) => {
                if (f.order == null || f.order == undefined) {
                    f.order = idx;
                }
            });

            let values = persistence.load(`site_parameters_${args.site_id}`, true) || [];
            for(const field of fields) {
                let vIdx = values.findIndex(v => v.name == field.name);
                if (vIdx > -1) {
                    field.value = values[vIdx].value;
                }
            }
            values = fields;

            this.renderFields(values);

            handler.postRender();
            return;
        }

    }

    class UiRenderer {
        constructor () {
            this.sites = new UiSitesRenderer(this);
            this.siteParameters = new UiSiteParameterRenderer(this);
            this.promos = new UiPromosRenderer(this);
            this.config = new UiConfigRenderer(this);
            this.wallet = new UiWalletRenderer(this);
            this.schedules = new UiSchedulesRenderer(this);
            this.selectedSchedule = null;
        }

        initialize() {
            this.appendCSS();
        }

        toast(msg, msgType = "info") {
            toastr[msgType](msg);
        }

        openModal(id, values = null) {
            const dlg = document.querySelector('#modal-dlg');
            dlg.querySelectorAll(".modal-content").forEach(x => x.classList.add('d-none'));
            switch (id) {
                case 'modal-backup':
                    console.info('TODO: GM_listValues => loop keys => save json as blob');
                    break;

                case 'modal-ereport':
                case 'modal-config':
                case 'modal-site':
                    document.getElementById("target-spinner").innerHTML = JSON.stringify({id: id, siteId: values});
                    document.getElementById("modal-spinner").classList.remove("d-none");
                    dlg.querySelector('div').classList.add('modal-lg');
                    break;
                case 'modal-add-site':
                    this.sites.renderAddExternalSite();
                    document.getElementById(id).classList.remove("d-none");
                    dlg.querySelector('div').classList.remove('modal-lg');
                    break;
                case 'modal-slAlert':
                    shortlinkAlert.load(id);
                    dlg.querySelector('div').classList.add('modal-lg');
                    break;
                case 'modal-schedules':
                    document.getElementById(id).querySelector('table tbody').innerHTML = this.schedules.renderTBody();
                    this.appendColorPickers('.color-picker');
                    dlg.querySelector('div').classList.remove('modal-lg');
                    document.getElementById(id).classList.remove("d-none");
                    break;
                case 'modal-assign-schedule':
                    this.sites.renderAssignScheduleToSite(values);
                    document.getElementById(id).classList.remove("d-none");
                    dlg.querySelector('div').classList.remove('modal-lg');
                    break;
                case 'modal-site-parameters':
                    this.siteParameters.renderEditSiteParameters(values);
                    document.getElementById(id).classList.remove("d-none");
                    dlg.querySelector('div').classList.remove('modal-lg');
                    break;
                default:
                    dlg.querySelector('div').classList.add('modal-lg');
                    document.getElementById(id).classList.remove("d-none");
                    break;
            }

            $(dlg).modal('show');
        }

        appendEventListeners() {
            for (const renderer in this) {
                if (this[renderer] && typeof this[renderer].appendEventListeners === 'function') {
                    this[renderer].appendEventListeners();
                }
            }
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover'
            });
        }

        appendCSS() {
            let css = document.createElement('style');
            css.innerHTML = `
                td.em-input {
                    padding-top: 0;
                    padding-bottom: 0;
                }
                pre {
                    height: 145px;
                    width:100%;
                    white-space: pre-wrap;
                    padding-left: 1em;
                }
                pre span {
                    display: block;
                }
                .row-schedule-handle {

                }
                .grabbable:not(.d-none):not(.in-use) {
                    cursor: move;
                    cursor: grab;
                    cursor: -moz-grab;
                    cursor: -webkit-grab;
                }

                .grabbable:not(.d-none):not(.in-use):active {
                    cursor: grabbing;
                    cursor: -moz-grabbing;
                    cursor: -webkit-grabbing;
                }

                .row-handle {
                    cursor: grab;
                }

                .dropdown-item {
                    cursor: pointer;
                }

                #schedule-table th,td {
                    vertical-align: middle;
                    padding-top: .25rem!important;
                    padding-bottom: .25rem!important;
                }

                #schedule-table-body td.em-input input[readonly] {
                    background-color:transparent;
                    border: 0;
                    font-size: 1em;
                }

                td[data-field="displayName"] .input-group-prepend .input-group-text {
                    background-color: transparent;
                    border-color: transparent;
                    font-size: 1em;
                }

                .custom-switch input,label {
                    cursor: pointer;
                }
                `;
            document.head.appendChild(css);
        }

        addLegacySliderHtml(propName, propValue, text) {
            return `<label class="switch"><input type="checkbox" ${propName}="${propValue}" data-original="1"><span class="slider round"></span></label> ${text}`;
        }

        addSliderHtml(field) {
            const rndStr = helpers.randomString(8);
            return `<div class="form-group"><div class="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                    <input type="checkbox" class="custom-control-input" name="${field.name}" id="${rndStr}" ${field.value ? 'checked' : ''}>
                    <label class="custom-control-label" for="${rndStr}">${field.text}</label>
                    </div></div>`;
        }

        addInputEmailHtml(field) {
            const rndStr = helpers.randomString(8);
            const pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
            return `<div class="form-group row"><label for="${rndStr}" class="col-sm-4 col-form-label">${field.text}</label>
            <div class="col-sm-8">
            <input type="email" class="form-control" required id="${rndStr}" placeholder="${field.placeholder || ' '}" name="${field.name}" pattern="${pattern}" value="${field.value || ''}">
            </div></div>`;

        }

        addInputPasswordHtml(field) {
            const rndStr = helpers.randomString(8);
            return `<div class="form-group row"><label for="${rndStr}" class="col-sm-4 col-form-label">${field.text}</label>
            <div class="col-sm-8">
            <input type="password" min="${field.min !== undefined ? field.min : ''}" min="${field.max !== undefined ? field.max : ''}" class="form-control" required id="${rndStr}" placeholder="${field.placeholder || ' '}" name="${field.name}" value="${field.value || ''}">
            </div></div>`;
        }

        addInputTextHtml(field) {
            const rndStr = helpers.randomString(8);
            return `<div class="form-group row"><label for="${rndStr}" class="col-sm-4 col-form-label">${field.text}</label>
            <div class="col-sm-8">
            <input type="text" class="form-control" required="${field.required || 'false'}" id="${rndStr}" placeholder="${field.placeholder || ' '}" name="${field.name}" value="${field.value || ''}">
            </div></div>`;
        }

        addInputNumberHtml(field) {
            const rndStr = helpers.randomString(8);
            return `<div class="form-group row"><label for="${rndStr}" class="col-sm-4 col-form-label">${field.text}</label>
            <div class="col-sm-8">
            <input type="number" step="${field.step || 1}" class="form-control" required id="${rndStr}" placeholder="${field.placeholder || ' '}" name="${field.name}" value="${field.value || ''}">
            </div></div>`;
        }

        parseContainer(container) {
            let obj = {};
            Object.assign(obj, container.dataset);
            let inputs = container.querySelectorAll('input, select');
            inputs.forEach(function (input) {
                if (input.type == 'checkbox') {
                    obj[input.name] = input.checked ? 'true' : 'false';
                } else if (input.type == 'number') {
                    obj[input.name] = +input.value;
                } else {
                    obj[input.name] = input.value;
                }
            });

            for (const p in obj) { // type converter. TODO: add int, float, etc.
                if (obj[p] === 'true') { obj[p] = true }
                if (obj[p] === 'false') { obj[p] = false }

                if (p == 'uuid') {
                    obj[p] = obj[p].toLowerCase().replace('#', '');
                }
                if (p == 'originals') {
                    try {
                        obj[p] = JSON.parse(obj[p]);
                    } catch (err) { delete obj[p]; }
                }
            }
            return obj;
        }

        parseTable(table) {
            let rows = table.querySelectorAll('tbody tr');
            let data = [];
            rows.forEach( (r, idx) => {
                let obj = this.parseContainer(r);
                obj.order = '' + idx; // fix order
                if (!(obj.added && obj.removed)) { // skip if it was just added and removed
                    data.push(obj);
                }
            });

            return data;
        }

        appendColorPickers(selector) {
            $(selector).each(function () {
                $(this).colorpicker();
                $(this).on('colorpickerChange', function(event) {
                    $(event.target.querySelector('.fa-square')).css('color', event.color.toString());
                });
            });
        }
    }

    class EventEmitter {
        constructor() {
            this.events = {};
        }

        on(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        }

        emit(eventName, data) {
            const eventCallbacks = this.events[eventName];
            if (eventCallbacks) {
                eventCallbacks.forEach(callback => {
                    callback(data);
                });
            }
        }
    }

    class Timeout {
        constructor() {
            this.startedAt;
            this.interval;
            this.cb = (() => { shared.closeWithError(K.ErrorType.TIMEOUT, '') });
            let paramTimeout =  shared.getParam('timeout');
            if (paramTimeout) {
                this.wait = paramTimeout * 60;
            } else {
                this.wait = shared.getConfig()['defaults.timeout'] * 60
            }
            this.wait += 30; // add a threshold
            this.restart();
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
        constructor(params) {
            Object.assign(this, params);
            if(!useTimer || (this.webType && !Timer.webTypes().includes(this.webType))) {
                return;
            }
            this.delay = this.delaySeconds * 1000;

        }

        static webTypes() {
            return [K.WebType.FREELITECOIN, K.WebType.FREEETHEREUMIO, K.WebType.BIGBTC, K.WebType.FCRYPTO, K.WebType.FPB] // , K.WebType.BSCADS]
        };

        startCheck(webType) {
            this.webType = webType;
            if(!useTimer || (helpers.hasValue(webType) && !Timer.webTypes().includes(webType))) {
                return;
            }
            persistence.save(this.uuid + '_lastAccess', Date.now());
            this.interval = setInterval(() => {
                this.isAlive();
            }, this.delay);
        }

        stopCheck() {
            if(!useTimer) {
                return;
            }
            clearInterval(this.interval);
        }

        tick() {
            if(!useTimer) {
                return;
            }
            persistence.save(this.uuid + '_lastAccess', Date.now());
        }

        isAlive() {
            return;
        }
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms || 3000));

    class CrawlerWidget {
        constructor(params) {
            if (!params || (!params.selector && !params.fnSelector)) {
                throw new Error('CrawlerWidget requires a selector or a function selector parameter');
            }
            this.context = this.context || document;
            Object.assign(this, params);
        }

        get isUserFriendly() {
            if (this.selector) {
                this.element = this.context.isUserFriendly(this.selector);
                return this.element;
            } else {
                this.element = this.fnSelector();
                return this.element;
            }
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
                return '';
            }
        }
    }

    class TextboxWidget extends CrawlerWidget {
        get value() {
            if (!this.isUserFriendly) {
                return '';
            }
            return this.element.value;
        }

        set value(newValue) {
            if (!this.isUserFriendly) {
                return '';
            }
            this.element.value = newValue;
            return '';
        }
    }

    class ButtonWidget extends CrawlerWidget {

        click() {
            if (this.isUserFriendly) {
                this.element.click();
                return Promise.resolve(true);
            } else {
            }
        }
    }

    class SubmitWidget extends CrawlerWidget {
        click() {
            if (this.isUserFriendly) {
                let frm = this.element;
                while(frm.nodeName != 'FORM' && frm.nodeName != null) {
                    frm = frm.parentElement;
                }
                if (frm.nodeName == 'FORM') {
                    frm.submit();
                } else {
                    return;
                }
                return Promise.resolve(true);
            } else {
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
                let val = elm.innerText.split(':')[0];
                val = val.replace(/[^\d.-]/g, '');
                return parseInt(val);
            } catch (err) {
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
        static bfBoxClaimed(elm) {
            try {
                let currency = elm.querySelector('.free-box__withdraw-currency').innerText;
                let val = elm.querySelector('.free-box__need-sum').innerText.replace(/ /g,'').split('/')[1];

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
                    return val;
                } else {
                    return null;
                }
            } catch (err) {
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
                    return null;
                }
            } catch (err) {
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
        static splitAndIdxToInt(elm, options) { // options: { splitter: ':', idx: 1} // '26 Minutes 23' w/spliiter='Minutes' => 26
            try {
                return parseInt(elm.innerText.split(options.splitter)[options.idx].trim());
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

    class CaptchaWidget extends CrawlerWidget {
        constructor(params) {
            super(params);
        }

        solve() { return true; }

        async isSolved() { return false; }
    }

    class RecaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: function() { return grecaptcha },
                waitMs: [1000, 5000],
                timeoutMs: 4 * 60 * 1000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        get isUserFriendly() {
            this.element = grecaptcha;
            return this.element;
        }

        async isSolved() {
            return wait().then( () => {
                try {
                    if (this.isUserFriendly && this.element.hasOwnProperty('getPageId') && this.element.getPageId() && this.element.hasOwnProperty('getResponse') && (typeof(this.element.getResponse) == 'function')
                        && this.element.getResponse().length > 0) {
                        return Promise.resolve(true);
                    }
                } catch (err) {}
                return this.isSolved();
            });
        }
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
                    this._imgProcessor = new ImageProcessor(img);
                    return Promise.resolve(true);
                }
                return this.isReady();
            });
        }

        async isSolved() {
            return this.isReady()
                .then( () => this.solve())
                .then( (solution) => {
                document.querySelector('input[name="kodecaptcha"]').value = solution;
                return Promise.resolve(true);
            })
                .catch(err => {
                return Promise.reject(`Error ${err}`);
            });
        }

        preProcessImage() {
            this._imgProcessor.toCanvas();
            this._imgProcessor.binarize(200);
            this._imgProcessor.invert();
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
            this.charList().filter(x => x.answer != '').forEach( function (elm) {
                if (bestGuess.exactMatch) {
                    return;
                }
                if (charElm.width == elm.width && charElm.height == elm.height) {
                    if (charElm.bools.join(',') == elm.bools.join(',')) {
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
            let solution = '';
            if(this._imgProcessor.isImageComplete()) {
                this.preProcessImage();
                this.splitInCharacters();

                this._characters.forEach( ch => {
                    let bestGuess = this.guess(ch);
                    solution += bestGuess.answer;
                });
            }
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
                    return Promise.resolve(true);
                }
                return this.isSolved();
            });
        }
    }

    class GeeTestCaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: '.geetest_captcha.geetest_lock_success,.geetest_ghost_success.geetest_success_animate', 
                waitMs: 2000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        async isSolved() {
            return wait().then( () => {
                if (this.isUserFriendly) {
                    return Promise.resolve(true);
                }
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
                    return Promise.resolve(true);
                }
                return wait().then( () => { this.isReady(); });
            });
        }

        async solve() {
            let answer = document.getElementById('captchainput').value;
            if (answer != '') {
                if (answer.startsWith('JJJ')) {
                    answer = answer.slice(3);
                    document.getElementById('captchainput').value = answer;
                }

                if (answer.length != 6) {
                    document.getElementById('captchainput').value ='';
                    window.location.reload();
                    return wait(10000).then( () => { this.solve(); });
                } else {
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
                    return Promise.resolve(true);
                }
                return this.isReady();
            });
        }

        async solve() {
            if (this._elements.answerSpan.isUserFriendly) {
                let answer = this._elements.answerSpan.value;
                answer = answer ? answer.trim() : answer;
                let input = document.querySelector(`input[value="${answer}"`);
                if (input) {
                    helpers.alternativeClick(input.parentElement.querySelector('i'));
                    return wait().then( () => { return true; } );
                } else {
                    return Promise.reject(`@D1Captcha input NOT FOUND for answer: ${answer}`);
                }
            } else {
                return Promise.reject('Answer span not found!!!');
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

    class Faucet {
        constructor(elements, actions = {}) {
            this._url = window.location.href;
            this._timeout = new Timeout(); // this.maxSeconds);
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

        hasCloudflare() {
            let h2 = document.querySelector('h2#challenge-running');
            let stage = document.querySelector('#challenge-stage');
            if (h2 || stage) {
                return true;
            }
            return false;
        }

        useUrlListener() {
            if (window.onurlchange === null) {
                window.addEventListener('urlchange', (data) => {
                    if (this._url != window.location.href) {
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
                        this.preRoll();
                    }
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
                this._elements.rollButton.element.scrollIntoView(false);
                this._elements.rollButton.click();
                this.validateRun();
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
                    if (this.failureValidation()) {
                        return;
                    }
                }
                if (this._elements.success?.isUserFriendly) {
                    return this.updateResult();
                } else if(this._actions.altValidation) {
                    if(this.altValidation()) {
                        return this.updateResult();
                    }
                }
                return wait(2000).then( () => { this.validateRun() });
            });
        }

        async updateResult() {
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
            if (this._actions.isMultiClaim) {
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
                    return helpers.addMinutes(this._elements.countdownMinutes.timeLeft);
                }
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
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
            } else {
            }

            try {
                if(this._elements.claimed.isUserFriendly) {
                    claimed = +claimed + +this._elements.claimed.value;
                } else {
                }
            } catch (err) { shared.devlog(`@readClaimed: ${err}`); }
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

        setCurrentCaptcha() {
            if ([...document.querySelectorAll('iframe')].map(x => x.src || '').filter(x => x.includes('hcaptcha.com')).length > 0) {
                return;
            }
            this._elements.captcha = new RecaptchaWidget();
        }
    }

    class BFRoll extends Faucet {
        constructor(coinPrefix, trySpin = false) {
            let elements = {
                preRunButton: new ButtonWidget({selector: '.free-box.free-box__' + coinPrefix + ' button'}), //'#' + coinPrefix + '_free_box_withdraw_page'}),
                captcha: new NoCaptchaWidget({ selector: '.free-box-withdraw__footer button' }), // .button_red.button_center.button_fullwidth' }),
                rollButton: new ButtonWidget({selector: '.free-box-withdraw__footer button' }), // .button_red.button_center.button_fullwidth'}),
                success: new ReadableWidget({selector: '.modal:not(.free-box-withdraw,fury-wheel-modal), .vue-notification-template.my-notify.success'}),
                claimed: new ReadableWidget({selector: '.free-box.free-box__' + coinPrefix, parser: Parsers.bfBoxClaimed}),
                progressBar: new ReadableWidget({selector: '.free-box.free-box__' + coinPrefix + ' .free-box__progress-bar progress'}),
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
            let clickables = document.querySelectorAll('.fury-wheel__wheel-btn, .fury-wheel__btn-wrap, .fury-wheel__btn-content, .fury-wheel__btn-img');
            if (clickables.length > 0) {
                clickables[Math.floor(Math.random()*clickables.length)].click();
                wait(15000).then ( () => { shared.closeWindow(this._result); } );
            }
            return;
        }

        async preRun() {
            return wait().then( () => {
                try {
                    let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw,fury-wheel-modal) .modal__btn-close');
                    if (popup) {
                        popup.click();
                        popup.click(); // twice
                    }
                } catch (err) {}

                if (this.trySpin) {
                    let spinUnavailable = document.querySelector('.bonus.bonus_furywheel.wait');
                    if (spinUnavailable) {
                    } else {
                        let spinBtn = document.querySelector('.wheel-amin'); //bonus bonus_furywheel wait
                        if (spinBtn) {
                            spinBtn.click();
                            wait(10000).then ( () => { this.spin() } );
                            return wait(60000).then ( () => { this.preRun(); } );
                        }
                    }
                }

                if (!this._elements.progressBar || !this._elements.progressBar.isUserFriendly) {
                    return this.preRun();
                }

                if (this._elements.preRunButton.isUserFriendly) {
                    if (!this._elements.preRunButton.isUserFriendly.disabled) {
                        return this._elements.preRunButton.click();
                    } else {
                        this._timeout.restart();
                        shared.closeWindow(this._result);
                        return;
                    }
                } else if (document.querySelectorAll('.free-box').length > 1) {
                    shared.closeWithError(K.ErrorType.ERROR, 'Box might not exist for your account.');
                    return;
                }
                return this.preRun();
            });
        }

        async validateRun() {
            return wait(7000).then( () => {
                let gtHook = document.querySelector('div.geetest_slice_bg');
                if (gtHook) {
                    if (gtHook.isUserFriendly()) {
                        return this.validateRun();
                    }
                }
                let popup = document.querySelector('.modal-wrapper .modal:not(.free-box-withdraw,fury-wheel-modal) .modal__btn-close');
                if (!popup) {
                    if (this._elements.preRunButton.isUserFriendly && !this._elements.preRunButton.isUserFriendly.disabled) {
                        this._elements.preRunButton.click();
                        return this.validateRun();
                    }
                } else {
                    try {
                        if (popup) {
                            popup.click();
                            popup.click();
                        }
                    } catch (err) {}
                }

                if (this._elements.success.isUserFriendly) {
                    return this.updateResult();
                } else if(this._actions.altValidation) {
                    if(this.altValidation()) {
                        return this.updateResult();
                    }
                }
                return this.validateRun();
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
                        try {
                            if (this._elements.confirmBoost.isUserFriendly) {
                                this._elements.confirmBoost.click();
                            }
                        } catch (err) {}
                    }, 8000);
                }
                return true;
            } else {
                this.setCurrentCaptcha();
                await wait();
                return this.preRun();
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
            let msgDiv;
            msgDiv = document.querySelector('p.info.success');
            if (msgDiv && msgDiv.innerText.includes('has been transferred')) {
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
                    let result = {};
                    result.nextRoll = helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                    shared.closeWindow(result);
                    return;
                } else if (msgDiv.innerText.includes('Please wait')) {
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
            msgDiv = document.querySelector('p.info.fail');
            if (msgDiv) {
                if (msgDiv.innerText.toLowerCase().includes('run out of bitcoin')) {
                    shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Out of Funds');
                    return;
                }
            }

            if (this._elements.captcha.isUserFriendly) {
            } else {
                if (this._elements.rollButton) {
                    this._elements.rollButton.click();
                    return;
                }
            }
        }

        async init() {
            if (this._url.includes('/faucet')) {
                let needToLoginButton = document.querySelector('input[type="submit"][value="Login / Signup"]');
                if (needToLoginButton) {
                    needToLoginButton.click();
                    return;
                }

                this.run();
                this.solveColorCaptcha();
                return;
            } else if (this._url.includes('/account')) {
                this.doLogin();
                return;
            }
        }

        async doLogin() {
            return wait().then( () => {
                let container = document.querySelector('#cc');
                if (container.innerText.includes('You are now logged in as account')) {
                    let toFaucetButton = document.querySelector('#mmenu a[href="/faucet"]');
                    if (toFaucetButton) {
                        toFaucetButton.click();
                        return;
                    }
                    return this.doLogin();
                }
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('#cc .info.fail');
                if (loginErrorDiv && loginErrorDiv.innerText.includes('Invalid')) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._elements.login.setCredentials != false) {
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

        async solveColorCaptcha() {
            await wait(2000);
            let optionInputs = [...document.querySelectorAll('#newch input[type="submit"]')];
            let options = optionInputs.map(x => x.style.background);
            let wantedColor = document.querySelector('#newch p b');
            if (options.length > 0 && wantedColor) {
                try {
                    let knownColors = Object.keys(nearestColor.STANDARD_COLORS);
                    let toColorName = nearestColor.from(nearestColor.STANDARD_COLORS);

                    options = options.map(x => toColorName(x).name);
                    wantedColor = wantedColor.innerText.toLowerCase();
                    if (wantedColor == 'grey') { wantedColor = 'gray'; }
                    let solutionIdx = options.findIndex(x => x.includes(wantedColor));
                    if (solutionIdx > -1) {
                        optionInputs[solutionIdx].click();
                        return;
                    }
                    if (wantedColor == 'green') {
                        wantedColor = 'lime';
                        solutionIdx = options.findIndex(x => x.includes(wantedColor));
                        if (solutionIdx > -1) {
                            optionInputs[solutionIdx].click();
                            return;
                        }
                    }
                    await wait(5000);
                    location.reload();
                } catch (err) {
                    await wait(15000);
                    location.reload();
                }
            } else {
                return this.solveColorCaptcha();
            }
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
                let result = {
                    claimed: claimed,
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            let nextRoll = this.readNextRoll();
            if(nextRoll) {
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
                this.updateResult();
                return;
            }
            let coinSelect = form.querySelector('select[name="coin"]');
            if (!coinSelect) {
                this.updateResult();
                return;
            }
            let userInput = form.querySelector('input[name="ado"]');
            if (!userInput) {
                this.updateResult();
                return;
            }
            let submitButton = form.querySelector('input[type="submit"]');
            if (!submitButton) {
                this.updateResult();
                return;
            }
            coinSelect.value = this.getCoin();
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
            if (this.isSecondStep()) {
                return this.run();
            }
            if (this.isFirstStep()) {
                return this.doFirstStep();
            }
        }

        isCountdownVisible() {
            let successDiv = document.querySelector('p.success');
            if (!successDiv) {
                return false;
            }
            if (successDiv.innerText.includes('0 claims')) {
                return true;
            }

            return false;
        }

        readClaimed() {
            let successDiv = document.querySelector('p.success');
            if (successDiv) {
                return successDiv.innerText.split(' ')[0];
            } else {
                return 0;
            }
        }

        readNextRoll() {
            try {
                let successDiv = document.querySelector('p.success');
                if (successDiv && successDiv.innerText.includes('You have')) {
                    let claimsLeft;
                    try {
                        claimsLeft = successDiv.innerText.split(' claims')[0].split('have ')[1];
                    } catch (err) {}
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
                        if (claimsLeft) {
                            return helpers.addMinutes(helpers.randomInt(6, 22));
                        }
                    }
                }

            } catch (err) { }
            return null;
        }
    }

    class CTop extends Faucet {
        constructor() {
            let elements = {
                claimed: new ReadableWidget({selector: 'p.success', parser: Parsers.trimNaNs}),
                captcha: new HCaptchaWidget(),
                rollButton: new ButtonWidget({selector: 'input[type="submit"]'}),
                addressInput: new TextboxWidget({ selector: 'form input[name="adr"], form input[name="a"]'})
            };
            let actions = {
                readTimeLeft: true,
                readRolledNumber: false,
                readBalance: false
            };
            super(elements, actions);
        }

        init() {
            if(this.hasErrorMessage('suspicious activity')) {
                shared.closeWithError(K.ErrorType.ERROR, 'Suspicious Activity Message Displayed');
                return;
            }
            if(this.hasErrorMessage('no funds left')) {
                shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Out of Funds');
                return;
            }
            if(this.hasErrorMessage('faucet is currently disabled')) {
                shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Faucet is disabled');
                return;
            }

            let claimed = this.readClaimed();
            if (claimed != 0) {
                let result = {
                    claimed: claimed,
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            let nextRoll = this.readNextRoll();
            if(nextRoll) {
                let result = {
                    nextRoll: nextRoll
                };
                shared.closeWindow(result);
                return;
            }

            this.solve();
        }

        hasErrorMessage(searchTerm) {
            return document.body.innerText.toLowerCase().includes(searchTerm);
        }

        isFirstStep() {
            return this._elements.addressInput.isUserFriendly;
        }

        async doFirstStep() {
            let form = document.querySelector('form');
            if (!form) {
                this.updateResult();
                return;
            }
            if (!this._elements.addressInput.isUserFriendly) {
                this.updateResult();
                return;
            }
            let submitButton = form.querySelector('input[type="submit"]');
            if (!submitButton) {
                this.updateResult();
                return;
            }
            this._elements.addressInput.value = this._params.address;

            submitButton.closest('form').submit();
            return;
        }

        isSecondStep() {
            let ps = [...document.querySelectorAll('p')];
            return ps.findIndex(x => x.innerText.toLowerCase().includes('one more step...')) >= 0;
        }

        async solve() {
            if (this.isSecondStep()) {
                return this.run();
            }
            if (this.isFirstStep()) {
                return this.doFirstStep();
            }
        }

        isCountdownVisible() {
            let successDiv = document.querySelector('p.success');
            if (!successDiv) {
                return false;
            }
            if (successDiv.innerText.includes('0 claims')) {
                return true;
            }

            return false;
        }

        readClaimed() {
            let successDiv = document.querySelector('p.success');
            if (successDiv) {
                return successDiv.innerText.split(' ')[0];
            } else {
                return 0;
            }
        }

        readNextRoll() {
            try {
                let successDiv = document.querySelector('p.success');
                if (successDiv && successDiv.innerText.includes('You have')) {
                    let claimsLeft;
                    try {
                        claimsLeft = successDiv.innerText.split(' claims')[0].split('have ')[1];
                    } catch (err) {}
                    if (claimsLeft) {
                        return helpers.addMinutes(helpers.randomInt(12, 22));
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
                            let unit = warnDiv.innerText.includes(' seconds') ? ' seconds ' : ' minutes ';
                            let val = warnDiv.innerText.split('Please wait ')[1].split(unit)[0].replace(/\D/g, '');
                            if (unit == ' seconds ') {
                                return helpers.addSeconds(val + helpers.randomInt(90, 180));
                            } else {
                                return helpers.addMinutes(val + helpers.randomInt(1, 5));
                            }
                        } catch { }
                        let claimsLeft;
                        try {
                            claimsLeft = warnDiv.innerText.split(' seconds')[0].split('wait ')[1];
                        } catch (err) {}
                        if (claimsLeft) {
                            return helpers.addMinutes(helpers.randomInt(12, 22));
                        }
                    }
                }

            } catch (err) { }
            return null;
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
            return wait().then( () => {
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('div.alert.alert-info');
                if (loginErrorDiv && loginErrorDiv.innerText.includes('not valid')) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._elements.login.setCredentials != false) {
                    this._elements.login.inputUser.value = this._elements.login.setCredentials.username;
                    this._elements.login.inputPass.value = this._elements.login.setCredentials.password;
                }

                try {
                    this._elements.login.rememberMe.isUserFriendly.checked = true;
                } catch (err) {}

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

        async detectAction() {
            return wait().then( () => {
                if ( this.isCountdownVisible() ) {
                    return Promise.resolve({action: 'needToWait'});
                } else if ( this._elements.success.isUserFriendly ) {
                    return this.updateResult();
                } else if ( this.isRollButtonVisible() ) {
                    return Promise.resolve({action: 'doRoll'});
                } else {
                    return this.detectAction();
                }
            });
        }

        clickRoll() {
            try {
                try {
                    window.scrollTo(0, document.body.scrollHeight);
                } catch (err) { }
                this._elements.rollButton.click();
                setTimeout( () => { this._elements.rollButton.click(); }, 5000);
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
                    inputUser: new TextboxWidget({ selector: '#email' }),
                    inputPass: new TextboxWidget({ selector: '#password' }),
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
                this.run();
                return;
            } else if (window.location.pathname.includes('/firewall')) {
                this.solveFirewall();
                return;
            } else if (window.location.pathname.includes('/dashboard')) {
                window.location.href = (new URL('faucet', window.location)).href;
                return;
            } else if (window.location.pathname == '/') {
                let loginBtn = document.querySelector('.btn.btn-success');
                if (loginBtn) {
                    loginBtn.click();
                    return;
                } else {
                    window.location.href = (new URL('login', window.location)).href;
                }
                return;
            } else if (this._url.includes('/login')) {

                let credentialsMode = this._params.credentials.mode;
                switch(credentialsMode) {
                    case -1:
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, 'Manual login required.');
                        break;
                    case 0:
                        shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, 'Login required and autologin is not configured.');
                        break;
                    default:
                        this.doLogin();
                        break;
                }
                return;
            }
        }

        async preRun() {
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
            return wait().then( () => {
                if (!this._elements.login.inputUser.isUserFriendly || !this._elements.login.inputPass.isUserFriendly || !this._elements.login.inputSubmit.isUserFriendly) {
                    return this.doLogin();
                }

                let loginErrorDiv = document.querySelector('div.alert.alert-danger');
                if (loginErrorDiv) {
                    shared.closeWithError(K.ErrorType.LOGIN_ERROR, loginErrorDiv.innerText);
                    return;
                }

                if (this._params.credentials.mode == 1) {
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
            this._isFMonster = location.host === 'faucet.monster';
        }

        init() {
            if(this.hasErrorMessage('no funds left')) {
                shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Out of Funds');
                return;
            }

            if (this.isCountdownVisible() || this.readClaimed() != 0) {
                this.updateResult();
                return;
            }

            this.solve();
        }

        hasErrorMessage(searchTerm) {
            return document.body.innerText.toLowerCase().includes(searchTerm);
        }

        getSpotsAvailable() {
            try {
                let soldSpots = document.querySelectorAll('.pos:not(.pfree)').length;
                let available = 1024-soldSpots;
                return {
                    sold: '' + soldSpots,
                    available: '' + available
                }
            } catch (err) {
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
            let spots;
            spots = this.getSpotsAvailable();
            if(!this._isFMonster && !spots) {
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
                this.updateResult();
                return;
            }

            let addrInput = document.querySelector('label input[name="a"]');
            if (addrInput) {
                addrInput.value = this._params.address;
            } else {
                this.updateResult();
                return;
            }
            await wait(helpers.randomInt(1500, 3000));

            if (this._isFMonster) {
                let usdtQuestion = document.querySelector('form p:nth-child(2)');
                if (!usdtQuestion || !usdtQuestion.innerText.toLowerCase().includes('faucet monitor lists tether faucets')) {
                    this.updateResult();
                    return;
                }
                let usdtAnswersList = [...document.querySelectorAll('select[name="fm"] option')];
                if (usdtAnswersList.length == 0) {
                    this.updateResult();
                    return;
                }
                usdtAnswersList = usdtAnswersList.map(x => x.value);
                let idxCorrect = usdtAnswersList.findIndex(x => x.toLowerCase() == 'yes' || x.toLowerCase() == 'y');
                if (idxCorrect === -1) {
                    this.updateResult();
                    return;
                }
                document.querySelector('select[name="fm"]').value = usdtAnswersList[idxCorrect];
            } else {
                let answersList = [...document.querySelectorAll('select[name="tt"] option')].map(x => x.value);
                if (answersList.includes(spots.sold)) {
                    document.querySelector('select[name="tt"]').value=spots.sold;
                } else if (answersList.includes(spots.available)) {
                    document.querySelector('select[name="tt"]').value=spots.available;
                } else {
                    this.updateResult();
                    return;
                }
            }
            await wait(helpers.randomInt(400, 5000));

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
            if (pars.find(x => x.innerText.includes('wait until next day'))) {
                return true;
            }

            if (pars.find(x => x.innerText.includes('PROBLEM'))) {
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
                if (pars.find(x => x.innerText.includes('until next day') || x.innerText.includes('ALL DAILY CLAIMS') || x.innerText.includes('You have 0 claims left'))) {
                    return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                }

                if (pars.find(x => x.innerText.includes('PROBLEM'))) {
                    return helpers.addMinutes(helpers.randomInt(6, 22));
                }

                if (pars.find(x => x.innerText.includes('You have'))) {
                    return helpers.addMinutes(helpers.randomInt(6, 22));
                }
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
            return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
        }
    }

 class FCryptoRoll extends Faucet {
     constructor() {
         let elements = {
             countdownMinutes: new CountdownWidget({selector: '.sidebar-links .cursor-not-allowed span.notranslate', parser: Parsers.splitAndIdxToInt, options: { splitter: ':', idx: 1} }), // '00:21:28'
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
             readRolledNumber: false,
         };
         super(elements, actions);
         this._paths = {
             faucet: '/task/faucet-claim',
             dashboard: '/dashboard'
         };
         this._linkSelectors = {
             Faucet: 'a[href="https://faucetcrypto.com/task/faucet-claim"]'
         }
         this.useUrlListener();
     }

     init() {
         this._elements.captcha = new HCaptchaWidget({selector: '#hcap-script > iframe'});
         this._elements.rollButton = new ButtonWidget({selector: '.flex.justify-center button.inline-flex.items-center:not(.hidden)'});
         if (this._url.endsWith(this._paths.dashboard)) {
             return this.runDashboard();
         } else if (this._url.includes(this._paths.faucet)) {
             return wait().then( () => { this.run(); });
         }

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
             this.sections['Faucet'].elm.click();
             return;
         } else {
             return wait().then( () => { this.run(); });
         }
     }

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
                 this._elements.captcha = new NoCaptchaWidget({selector: '.flex.justify-center button.inline-flex.items-center:not(.hidden)'});
                 return;
             }
         }
     }

     postRun() {

         if (this._url.endsWith(this._paths.dashboard) || this._oldClaimed != this._result.claimed) {
             try {
                 this._elements.claimed.isUserFriendly.parentElement.parentElement.parentElement.querySelector('button');
             } catch (err) {
             }
             this._oldClaimed = null;
             this.readSections();
             if (this.sections != {}) {
                 if (this.sections['Faucet'].elm) {
                     this.sections['Faucet'].elm.click();
                     return;
                 } else {
                 }
             } else {
             }
         } else {
         }

         this._result = shared.getProp('tempResults');
         shared.closeWindow(this._result);
         return;
     }

     async runPtcList() {
         let listItems = [...document.querySelectorAll('.grid.grid-responsive-3 .feather.feather-eye')].map(x => x.parentElement.parentElement).filter(x => x.isUserFriendly());
         if (listItems.length > 0) {
             listItems[0].click();
             return;
         } else {
             return wait().then( () => { this.runPtcList() } );
         }
     }

     runPtcSingleStart() {
         return this.run('doRoll');
     }

     runPtcSingleWait() {
         this._elements.captcha = new NoCaptchaWidget({selector: 'a.notranslate:not(.cursor-not-allowed)' });
         this._elements.rollButton = new ButtonWidget({selector: 'a.notranslate:not(.cursor-not-allowed)' });
         return this.run('doRoll');
     }
 }

    class FPPtc extends Faucet {
        constructor() {
            let elements = {
                claimButton: new ButtonWidget({selector: '#pop-up button.purpleButton:not([disabled])'}),
                claimButtonDisabled: new ButtonWidget({selector: '#pop-up button.purpleButton'}),
                openPtcButton: new ButtonWidget({fnSelector: function() {
                    let blacklistTitles = ['JOIN US ON WINTOMATO.COM'];
                    let btn = [...document.querySelectorAll('button')].filter(x => x.innerText.toLowerCase().includes('view'));
                    try {
                        btn = btn.filter(x => !blacklistTitles.includes(x.parentElement.parentElement.querySelector('h2').innerText.toUpperCase()));
                    } catch (err) {}
                    return (btn.length > 0) ? btn[0] : null;
                }}),
                claimed: new ReadableWidget({fnSelector: function() {
                    let divSpanSuccessClaim = [...document.querySelectorAll('div span')].filter(x => x.innerText.toLowerCase().includes('successfully credited with'));
                    return (divSpanSuccessClaim.length > 0) ? divSpanSuccessClaim[0] : null;
                }, parser: Parsers.trimNaNs}),
                captcha: new GeeTestCaptchaWidget(),
                success: new ReadableWidget({selector: 'div.ml-3.w-0 p span.text-yellow-500.font-medium'})
            };
            let actions = {
                isMultiClaim: true,
                preRoll: true,
                postRun: true,
                readRolledNumber: false,
            };
            super(elements, actions);
            this._paths = {
                ptcList: '/ptc',
                ptcSingleView: '/ptc/view',
                login: '/account/login',
                dashboard: '/user-admin'
            };
            this.useUrlListener();
        }

        init() {
            if (this._url.includes(this._paths.ptcSingleView)) {
                this.doPtcList(true);
                return;
            } else if (this._url.includes(this._paths.ptcList)) {
                this.doPtcList();
                return;
            } else if (this._url.includes(this._paths.login)) {
                this.doLogin();
                return;
            } else if (this._url.includes(this._paths.dashboard)) {
                return;
            }

            return;
        }

        hasExpired() {
            return document.body.innerText.includes('The session has expired');
        }

        hasError() {
            return document.body.innerText.includes('must finish watching') || document.title.includes('Tab Closed Error');
        }

        getETAWaitSeconds(btn) {
            try {
                let seconds = btn.nextSibling.firstChild.innerText.split('s')[0];
                return +seconds;
            } catch (err) {
            }
            return 15;
        }

        getPayout(btn) {
            this.lastClaimed = 0;
            try {
                let payout = btn.nextSibling.lastChild.innerText.split(' ')[0];
                this.lastClaimed = +payout;
            } catch (err) {
            }
        }

        async validateClaim() {
            await wait(1000);
            if (this.hasExpired()) {
                console.info('CLAIM => expired');
                await wait(2000);
                return false;
            }
            if (this._elements.claimed.isUserFriendly) {
                let claimed = this._elements.claimed.value;
                if (claimed) {
                    console.info('CLAIM => Returning claimed:', claimed);
                    await this.storeClaim();
                    await wait(2000);
                    return claimed;
                }
            }
            console.info('@validateClaim => Still waiting...');
            return this.validateClaim();
        }

        async storeClaim() {
            let result = shared.getResult();
            result.ptcsDone = (result.ptcsDone ?? 0) + 1;
            result.claimed = +(result.claimed ?? 0) + +this.lastClaimed;
            this.lastClaimed = 0;
            shared.updateWithoutClosing(result, 'WORKING');
        }

        async confirmClaim() {
            GM_setValue(`ptc-close-signal-faucetpay.io`, Date.now());
            await wait(5000);
            GM_deleteValue(`ptc-close-signal-faucetpay.io`);
            let captcha = new GeeTestCaptchaWidget();

            await captcha.isSolved();
            if (!this._elements.claimButton.isUserFriendly) {
                return;
            }
            this._elements.claimButton.click();
            let validation = await this.validateClaim();
            return this.doPtcList();
        }

        async startPtc() {
            await wait(1000);
            let minSeconds = this.getETAWaitSeconds(this._elements.openPtcButton.isUserFriendly);
            this.getPayout(this._elements.openPtcButton.isUserFriendly);
            this._elements.openPtcButton.click();
            await wait(4000);
            return this.waitPtcSeconds();
        }

        async waitPtcSeconds() {
            if (this._elements.claimButtonDisabled.isUserFriendly) {
                return this.confirmClaim();
            }
            if (!document.title.includes('PTC Ads') && document.title.includes('s |')) {
                await wait(5000);
                return this.waitPtcSeconds();
            }
            let iframe = document.querySelector('iframe[title="ptc-view"]');
            if (document.title.includes('PTC Ads') && iframe) {
                await wait(5000);
                return this.waitPtcSeconds();
            }
            return this.confirmClaim();
        }

        async doPtcList(isSingle = false) {
            if (document.title.includes('PTC Ads') || document.title.includes('Complete Visit')) {
                if (this._elements.claimButtonDisabled.isUserFriendly) {
                    return this.confirmClaim();
                } else {
                    if(isSingle) {
                        await wait(4000);
                        return this.doPtcList(true);
                    }
                    if (this._elements.openPtcButton.isUserFriendly) {
                        return this.startPtc();
                    } else {
                        shared.closeWindow();
                        return;
                    }
                }
            }
        }

        async doLogin() {
            let username = document.querySelector('input');
            let password = document.querySelector('input[type="password"]');
            let captcha = new GeeTestCaptchaWidget();
            let btn = document.querySelector('button[type="submit"');
            if (username && password && btn && username.value != '' && password.value != '') {
                await captcha.isSolved();
                btn.click();
                return;
            } else {
                shared.closeWithError(K.ErrorType.NEED_TO_LOGIN, '');
            }
        }
    }

    function createFBProcessor() {
        let countdownMinutes;
        let timeout = new Timeout(); // this.maxSeconds);
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

        return {
            run: run
        };
    }

    function createBigBtcProcessor() {
        let timeout = new Timeout(); // this.maxSeconds);
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
            window.scrollTo(0, document.body.scrollHeight);
            let m = document.getElementById('main'); if (m) { m.style.display='block'; }
            m = document.getElementById('block-adb-enabled'); if (m) { m.style.display='none'; }
            m = document.getElementById('ielement'); if (m) { m.style.display='block'; }
            setInterval(() => {
                let frames = [...document.querySelectorAll('iframe')];
                frames.forEach(x => {
                    if (!x.src.includes('hcaptcha')) {
                        x.remove()
                    }
                });
            }, 5000);

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
                doLogin();
                return;
            } else {
            }

            setTimeout(waitIfLoading, helpers.randomMs(5000, 7000));
        };
        function runFaucet() {
            let claimedAmount = selectElement.claimedAmount();
            if(claimedAmount) {
                processRunDetails();
                return;
            } else if (selectElement.countdown()) {
                let result = {};

                shared.closeWindow(result);
            } else {
                captcha.isSolved().then(() => { clickClaim(); });
            }
        }
        function clickClaim() {
            try {
                selectElement.claimButton().click();
                return;
            } catch (err) {
                shared.closeWithError(K.ErrorType.CLICK_ROLL_ERROR, err);
            }
        };
        function processRunDetails() {
            let claimedAmount = selectElement.claimedAmount();
            let balance = selectElement.balance();
            let countdown = selectElement.countdown();

            if (claimedAmount && balance) {
                let result = {};
                result.claimed = claimedAmount;
                result.balance = balance;

                shared.closeWindow(result);
                return;
            }

            setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
        };

        return {
            init: init
        };
    }

    function createBestChangeProcessor() {
        let timeout = new Timeout(); // this.maxSeconds);
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
                let btn = elements.claimButton();
                if(btn.isUserFriendly()) {
                    btn.click();
                    setTimeout(processRunDetails, helpers.randomMs(4000, 8000));
                } else {
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

                shared.closeWindow(result);
                return;
            }

            setTimeout(processRunDetails, helpers.randomMs(5000, 6000));
        };

        return {
            init: init
        };
    }

    function createSGProcessor() {
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
                    setTimeout(run, helpers.randomMs(5000, 10000));
                    activateMiner();
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
                return true;
            } else {
                return false;
            }
            return (!!timerSpans);
        };
        function activateMiner() {
            let activateButton = document.querySelector("#region-main button.activate.block.w-full.h-full.mx-auto.p-0.rounded-full.select-none.cursor-pointer.focus-outline-none.border-0.bg-transparent");
            if (activateButton) {
                activateButton.click();
                setTimeout(run, helpers.randomMs(10000, 20000));
            } else {
                processRunDetails()
            }
        };

        function processRunDetails() {
            let result = {};
            result.nextRoll = helpers.addMinutes(readCountdown().toString());
            result.balance = readBalance();
            shared.closeWindow(result);
        };

        function readCountdown() {
            let synchronizing = document.querySelector('.text-15.font-bold.text-center.text-accent'); // use
            let mins = 15;
            try {
                let timeLeft = timerSpans.innerText.split(':');
                if (timeLeft[0] == 'Synchronizing') {
                }

                if(timeLeft.length === 3) {
                    mins = parseInt(timeLeft[0]) * 60 + parseInt(timeLeft[1]);
                }
            } catch (err) { shared.devlog(`SG Error reading countdown: ${err}`); }
            return mins;
        };
        function readBalance() {
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
    }

    class AutoCMl extends Faucet {
        constructor() {
            let elements = {
                claimed: new ReadableWidget({selector: 'div.alert.alert-success', parser: Parsers.splitAndIdxTrimNaNs, options: { splitter: ' ', idx: 0} }),
                captcha: new HCaptchaWidget(),
                rollButton: new ButtonWidget({selector: 'input[type="submit"].claim-button'}),
                addressInput: new TextboxWidget({ selector: 'form[role="form"] input[type="text"]'})
            };
            let actions = {
                readTimeLeft: false,
                readRolledNumber: false,
                readBalance: false
            };
            super(elements, actions);
        }

        init() {
            this.hideAdBlocker();
            if(this.hasErrorMessage('suspicious activity')) {
                shared.closeWithError(K.ErrorType.ERROR, 'Suspicious Activity Message Displayed');
                return;
            }
            if(this.hasErrorMessage('no funds left') || this.hasErrorMessage('not have sufficient funds')) {
                shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Out of Funds');
                return;
            }

            if(this.hasErrorMessage('reached the daily claim limit')) {
                let result = {
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            let claimed = this.readClaimed();
            if (claimed != 0) {
                if (!location.href.includes('doge')) {
                    claimed = claimed/100000000;
                }
                let result = {
                    claimed: claimed,
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            let waitTime = this.hasWaitTime();
            if (waitTime) {
                let result = {
                    nextRoll: helpers.addMinutes(waitTime + 1)
                };
                shared.closeWindow(result);
                return;
            }

            if (this.changeCaptcha()) {
                return;
            }

            this.setCurrentCaptcha();

            if (this._elements.addressInput.isUserFriendly) {
                if (this._elements.addressInput.value != this._params.address) {
                    this._elements.addressInput.value = this._params.address;
                }
            }
            this.run();
        }

        hideAdBlocker() {
            try {
                document.getElementById("page-body").style.display = "block";
                document.getElementById("blocker-enabled").style.display = "none";
            } catch (err) {}
            setInterval(() => {
                try {
                    document.getElementById("page-body").style.display = "block";
                    document.getElementById("blocker-enabled").style.display = "none";
                } catch (err) {}
            }, 3000);
        }

        changeCaptcha() {
            let selections = [...document.querySelectorAll('div.text-center b')];
            if (selections.length == 0) {
                return false;
            }
            if (selections.filter(x => x.innerText.toLowerCase().includes('hcaptcha')).length != 1) {
                location.href = location.href.includes('?') ? (location.href + '&cc=hCaptcha') : (location.href + '?cc=hCaptcha');
                return true;
            }
            return false;
        }

        hasErrorMessage(searchTerm) {
            return document.body.innerText.toLowerCase().includes(searchTerm);
        }

        hasWaitTime() {
            try {
                let pInfos = [...document.querySelectorAll('p.alert.alert-info')].filter(x => x.innerText.toLowerCase().includes('you have to wait'));
                if (pInfos.length == 1) {
                    let time = +pInfos[0].innerText.toLowerCase().replace('you have to wait ', '').split(' ')[0];
                    return time;
                }
            } catch (err) {}
            return false;
        }

        readNextRoll() {
            try {
                let spans = [...document.querySelectorAll('div.row div.col-md-5ths span:not(.glyphicon)')];
                let idxClaimsLeft = spans.findIndex(x => x.innerText.includes('daily claims left'));
                if (idxClaimsLeft > -1) {
                    if (spans[idxClaimsLeft].innerText.includes('0')) {
                        return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
                    } else {
                        return helpers.addMinutes(helpers.randomInt(5, 12));
                    }
                }
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
            return helpers.addMinutes(60 * 24 + helpers.randomInt(10, 160));
        }
    }

    class CClicks extends Faucet {
        constructor() {
            let elements = {
                claimed: new ReadableWidget({selector: 'div.alert.alert-success', parser: Parsers.cbgClaimed}),
                captcha: new HCaptchaWidget(),
                rollButton: new ButtonWidget({selector: '#myModal input[type="submit"].btnclaim'}),
                addressInput: new TextboxWidget({ selector: '#myModal input[type="text"]'}),
                openModalButton: new ButtonWidget({selector: 'button[data-target="#myModal"]'})
            };
            let actions = {
                readTimeLeft: false,
                readRolledNumber: false,
                readBalance: false
            };
            super(elements, actions);
        }

        async init() {
            if (this.hasCloudflare()) {
                return;
            }

            if(this.hasErrorMessage('suspicious activity')) {
                shared.closeWithError(K.ErrorType.ERROR, 'Suspicious Activity Message Displayed');
                return;
            }
            if(this.hasErrorMessage('no funds left') || this.hasErrorMessage('not have sufficient funds')) {
                shared.closeWithError(K.ErrorType.FAUCET_EMPTY, 'Out of Funds');
                return;
            }
            if(this.hasErrorMessage('reached the daily claim limit') || this.hasErrorMessage('reached the daily limit')) {
                let result = {
                    nextRoll: helpers.addMinutes(60 * 8 + helpers.randomInt(15, 40))
                };
                shared.closeWindow(result);
                return;
            }

            let claimed = this.readClaimed();
            if (claimed != 0) {
                let result = {
                    claimed: claimed,
                    nextRoll: this.readNextRoll()
                };
                shared.closeWindow(result);
                return;
            }

            if (this.changeCaptcha()) {
                return;
            }

            if (this._elements.openModalButton.isUserFriendly) {
                this._elements.openModalButton.click();
                await wait(helpers.randomInt(1000, 2000));
            }

            if (this._elements.addressInput.isUserFriendly) {
                if (this._elements.addressInput.value != this._params.address) {
                    this._elements.addressInput.value = this._params.address;
                }
            }
            this.run();
        }

        changeCaptcha() {
            let selections = [...document.querySelectorAll('div.text-center b')];
            if (selections.length == 0) {
                return false;
            }
            if (selections.filter(x => x.innerText.toLowerCase().includes('hcaptcha')).length != 1) {
                location.href = location.href.includes('?') ? (location.href + '&cc=hCaptcha') : (location.href + '?cc=hCaptcha');
                return true;
            }
            return false;
        }

        hasErrorMessage(searchTerm) {
            return document.body.innerText.toLowerCase().includes(searchTerm);
        }

        readNextRoll() {
            try {
                let p = document.querySelector('p.alert.alert-success');
                if (p && p.innerText.toLowerCase().includes('daily')) {
                    p = p.innerText.split('\n')[1];
                    p = +p.split(' daily')[0];

                    if (p > 0) {
                        return helpers.addMinutes(helpers.randomInt(3, 9));
                    } else {
                        return helpers.addMinutes(60 * 8 + helpers.randomInt(15, 40));
                    }
                }
                return helpers.addMinutes(helpers.randomInt(3, 9));
            } catch (err) { shared.devlog(`@readNextRoll: ${err}`); }
            return helpers.addMinutes(60 * 8 + helpers.randomInt(15, 40));
        }
    }

    let landing, instance, siteTimer;
    let useTimer;

    class Site {
        constructor(params) {
            Object.assign(this, {
                schedule: '4a70e0', // Owner!
                id: null,
                name: null,
                cmc: null, // REVIEW LOCATION
                coinRef: null, // REVIEW LOCATION. Only for CFs?
                url: null, // REVIEW FORMAT. Only one/'start' url? What about complex scripts/rotators/SLs?
                rf: null, // ...
                type: null, // REVIEW DEFAULT. It should be something like 'Crawler' or 'Handler' and the site params should depend on this value
                clId: null,
                wallet: null, // should be part of site parameters/crawler based?
                enabled: false,
                lastClaim: 0,
                aggregate: 0,
                balance: 0,
                stats: {},
                nextRoll: null,
                params: {}, // should have schedule overrides and be called customExecution, scheduleParamaters or something like that
                firstRun: true,
                isExternal: false,
            }, params);

            this.setLegacyConditionalDefaults();

        }

        setLegacyConditionalDefaults() {
            if (this.type == K.WebType.CRYPTOSFAUCETS) {
                this.schedule = '65329c';
            }

            if (this.type == K.WebType.FREEBITCOIN) {
                this.params['custom.useWofRp'] = 0;
                this.params['custom.useFunRp'] = 0;
            }

            if (this.type == K.WebType.STORMGAIN) {
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = true;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 15;
                this.params['defaults.nextRun.max'] = 20;
            }
            if (this.type == K.WebType.FAUCETPAY) {
                this.params['defaults.workInBackground.override'] = true;
                this.params['defaults.workInBackground'] = false;
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = false;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 300;
                this.params['defaults.nextRun.max'] = 360;
            }
            if (this.type == K.WebType.BIGBTC) {
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = false;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 15;
                this.params['defaults.nextRun.max'] = 40;
            }
            if (this.type == K.WebType.DUTCHYROLL) {
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = true;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 30;
                this.params['defaults.nextRun.max'] = 35;
            }
            if (this.type == K.WebType.FCRYPTO) {
                this.params['defaults.workInBackground.override'] = true;
                this.params['defaults.workInBackground'] = false;
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = false;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 26;
                this.params['defaults.nextRun.max'] = 35;
                this.params['defaults.timeout.override'] = true;
                this.params['defaults.timeout'] = 3;
                this.params['defaults.postponeMinutes.override'] = true;
                this.params['defaults.postponeMinutes'] = 0;
                this.params['defaults.postponeMinutes.min'] = 12;
                this.params['defaults.postponeMinutes.max'] = 18;
            }
            if (this.type == K.WebType.FPB) {
                this.params['defaults.nextRun.override'] = true;
                this.params['defaults.nextRun.useCountdown'] = false;
                this.params['defaults.nextRun'] = 0;
                this.params['defaults.nextRun.min'] = 22;
                this.params['defaults.nextRun.max'] = 45;
            }
        }

        static _sites = [];
        static getAll() {
            return Site._sites;
        }

        static getById(siteId) {
            return Site.getAll().find(x => x.id == siteId) || false;
        }

        static createFromDataArray(newSites) {
            if (!Array.isArray(newSites)) {
                newSites = [...newSites];
            }
            newSites.forEach(s => Site.getAll().push(new Site(s)));
        }

        static add(data) { 
            let newSite = new Site(data);
            Site.getAll().push(newSite);

            let schedule = Schedule.getById(newSite.schedule);

            if (!schedule) {
                try {
                    schedule = Schedule.getAll()[0];
                } catch (err) {
                    console.warn('No schedules found! Reseting to default schedules');
                    let defaultSchedule = new Schedule({ uuid: '4a70e0', name: 'Default' });
                    let sampleSchedule = new Schedule({ uuid: '65329c', name: 'CF' });
                    if (Schedule.getAll().length == 0) {
                        Schedule.add(defaultSchedule);
                        Schedule.add(sampleSchedule);
                    }
                    schedule = Schedule.getAll()[0];
                }
            }

            if (!schedule) {
                console.warn('Schedule NOT found');
                console.warn(data);
                return;
            }
            schedule.addSite(newSite);

            eventer.emit('siteAdded', {
                siteId: newSite.id,
                siteName: newSite.name,
                scheduleId: newSite.schedule
            });
        }

        static remove(siteId) {
            let idx = this._sites.findIndex(x => x.id === siteId);
            if (idx > -1 && this._sites[idx].isExternal) {
                let siteName = this._sites[idx].name;
                this._sites = Site.getAll().filter(x => x.id !== siteId);
                Schedule.getAll().forEach(sch => {
                    sch.removeSite(siteId);
                });
                eventer.emit('siteRemoved', {
                    siteId: siteId,
                    siteName: siteName
                });
            }

        }

        static sortAll() {
            Site.getAll().sort( function(a,b) {
                if (a === b) {
                    return 0;
                } else if (a.nextRoll === null && b.nextRoll === null) {
                    let aHasLoginError = a.stats?.errors?.errorType == 2;
                    let bHasLoginError = b.stats?.errors?.errorType == 2;
                    if (aHasLoginError) {
                        return -1;
                    } else if (bHasLoginError) {
                        return 1;
                    }
                    return a.id > b.id ? -1 : 1
                } else if (a.nextRoll === null) {
                    return 1;
                } else if (b.nextRoll === null) {
                    return -1;
                } else {
                    return a.nextRoll.getTime() < b.nextRoll.getTime() ? -1 : 1;
                }
            });
        }

        static setAsRunAsap(siteId) {
            let site = Site.getById(siteId);
            if (!site) return false;

            try {
                let schedule = Schedule.getById(site.schedule);
                if (schedule.status == STATUS.CLAIMING) {
                    console.warn(`Setting ASAP as 1st in schedule time + 1`);
                    site.nextRoll = new Date(schedule.currentSite.nextRoll.getTime() + 1);
                } else {
                    let now = new Date();
                    if (!schedule.currentSite?.nextRoll) {
                        console.warn(`Setting ASAP as now()`);
                        site.nextRoll = now;
                    } else if (now < schedule.currentSite.nextRoll) {
                        console.warn(`Setting ASAP as now()`);
                        site.nextRoll = now;
                    } else {
                        console.warn(`Setting ASAP as 1st in schedule time - 1`);
                        site.nextRoll = new Date(schedule.currentSite.nextRoll.getTime() - 1);
                    }
                }
                site.enabled = true;

                console.warn(`[${site.schedule}] ${site.name} updated to run ASAP from Site`);
                eventer.emit('siteUpdated', site);
                return;
            } catch (err) {
                console.error(err);
                ui.log({msg: `Error setting faucet to run ASAP from Site: ${err}`});
            }
        }

        changeSchedule(newScheduleId) {
            let oldScheduleId = null;
            if (this.schedule) {
                oldScheduleId = this.schedule;
                Schedule.getById(this.schedule)?.removeSite(this.id);
            }
            this.schedule = newScheduleId;
            let newSchedule = Schedule.getById(this.schedule);
            newSchedule.addSite(this); // maybe use just the ids...
            eventer.emit('siteChangedSchedule', {
                siteId: this.id,
                scheduleId: this.schedule,
                oldScheduleId: oldScheduleId
            });
        }

        static saveAll() {
            persistence.save('webList', Site._sites.map(x => x.toStorage()), true);
        }

        toStorage() { // Single site
            if (!this.isExternal) {
                return {
                    id: this.id,
                    isExternal: this.isExternal || false,
                    name: this.name,
                    schedule:this.schedule,
                    lastClaim: this.lastClaim,
                    aggregate: this.aggregate,
                    balance: this.balance,
                    stats: this.stats,
                    nextRoll: this.nextRoll,
                    enabled: this.enabled,
                    params: this.params
                };
            } else {
                return {
                    id: this.id,
                    url: this.url.href,
                    clId: this.clId,
                    type: this.type,
                    cmc: this.cmc,
                    rf: this.rf,
                    name: this.name,
                    isExternal: this.isExternal || false,
                    schedule:this.schedule,
                    lastClaim: this.lastClaim,
                    aggregate: this.aggregate,
                    balance: this.balance,
                    stats: this.stats,
                    nextRoll: this.nextRoll,
                    enabled: this.enabled,
                    params: this.params
                };
            }
        }

        update(items) { // this should be for Parameters or Execution (custom)
            this.params = this.params || {};
            items.forEach( item => {
                this.params[item.prop] = item.value;
            });
            ui.log({schedule: this.schedule, siteName: this.name, msg: `Site ${this.name} updated`});
        }

        getSiteParameters() {
            if (this.type == K.WebType.CRYPTOSFAUCETS) {
                this.siteParameters = {
                    handler: 'CF',
                    fields: [
                        { name: 'try_get_codes', type: 'checkbox', value: 'false', text: 'Auto update promo codes' },
                        { name: 'max_rolls_per_visit', type: 'numberInput', value: 1, min: 0 },
                        { name: 'autologin', type: 'checkbox', value: 'true', text: 'Autologin when necessary' },
                        { name: 'credentials_mode', type: 'credentials_or_autofilled', value: '2' },
                        { name: 'email', type: 'email', value: '' },
                        { name: 'password', type: 'password', value: '' }
                    ]
                };
            }
            return this.siteParameters || false;
        }
    }
    class Schedule {
        constructor(params) {
            Object.assign(this, {
                uuid: '4a70e0',
                name: 'default_schedule',
                status: STATUS.INITIALIZING,
                currentSite: null,
                sites: [],
                tab: null,
                timer: null, // TBD
                timeWaiting: 0,
                timeUntilNext: null,
                worker: null
            }, params)
            this.timer = new Timer({ isManager: true, delaySeconds: 30, uuid: this.uuid, webType: null });
        }

        static schedules = [];

        static getAll() {
            return Schedule.schedules;
        }

        static getById(scheduleId) {
            return Schedule.getAll().find(x => x.uuid == scheduleId) || false;
        }

        static add(newSchedule) {
            Schedule.getAll().push(newSchedule);
        }

        static getAllForCrud() {
            return Schedule.getAll().map(x => {
                return {
                    uuid: x.uuid,
                    name: x.name,
                    hasSites: x.sites && x.sites.length > 0
                };
            });
        }

        static async initialize() {

            Schedule.loadAll();

            let defaultSchedule = new Schedule({ uuid: '4a70e0', name: 'Default' });
            let sampleSchedule = new Schedule({ uuid: '65329c', name: 'CF' });
            if (Schedule.getAll().length == 0) {
                Schedule.add(defaultSchedule);
                Schedule.add(sampleSchedule);
                return;
            }

            let idxDefault = Schedule.getAll().findIndex(x => x.uuid == '4a70e0');
            if (idxDefault == -1) {
                Schedule.add(defaultSchedule);
            }
        };

        static saveAll() {
            persistence.save('schedules', Schedule.schedules.map(x => {
                return {
                    uuid: x.uuid,
                    name: x.name
                };
            }), true);
        }

        static loadAll() {
            Schedule.schedules = [];
            let schedulesJson = persistence.load('schedules', true) || [];
            schedulesJson.forEach(function(element) {
                Schedule.getAll().push(new Schedule({
                    uuid: element.uuid,
                    name: element.name,
                }));
            });
        }

        sortSites() {
            this.sites.sort( function(a,b) {
                if (a === b) {
                    return 0;
                } else if (a.nextRoll === null && b.nextRoll === null) {
                    let aHasLoginError = a.stats?.errors?.errorType == 2;
                    let bHasLoginError = b.stats?.errors?.errorType == 2;
                    if (aHasLoginError) {
                        return -1;
                    } else if (bHasLoginError) {
                        return 1;
                    }
                    return a.id > b.id ? -1 : 1
                } else if (a.nextRoll === null) {
                    return 1;
                } else if (b.nextRoll === null) {
                    return -1;
                } else {
                    return a.nextRoll.getTime() < b.nextRoll.getTime() ? -1 : 1;
                }
            });
        }

        static crud(data) {
            let isInvalid = false;
            try {
                const orphanSites = [];
                data.forEach(x => {
                    if (x.added) {
                        if (Schedule.getById(x.uuid)) {
                            isInvalid = true;
                        } else {
                            let newSchedule = new Schedule({
                                uuid: x.uuid,
                                name: x.name,
                                order: x.order
                            })
                            Schedule.getAll().push(newSchedule);
                            newSchedule.start();
                        }
                    } else if (x.removed) {
                        let pos = Schedule.getAll().findIndex(s => s.uuid == x.originals.uuid);
                        orphanSites.push(...Schedule.getAll()[pos].sites);
                        Schedule.getAll().splice(pos, 1);
                    } else {
                        let sch = Schedule.getAll().find(s => s.uuid == x.originals.uuid);
                        if (Schedule.getById(x.uuid) && (Schedule.getById(x.uuid) != sch)) {
                            isInvalid = true;
                        } else {
                            sch.uuid = x.uuid;
                        }
                        sch.name = x.name;
                        sch.order = x.order;
                    }
                });

                Schedule.getAll().sort((a, b) => a.order - b.order);

                if (orphanSites.length > 0) {
                    orphanSites.forEach(x => {
                        x.schedule = Schedule.getAll()[0].uuid;
                    });

                    Schedule.getAll()[0].sites.push(...orphanSites);
                }
                Schedule.saveAll();
            } catch (err) {
                console.error(err);
                return false;
            }
            if (isInvalid) {
                return false;
            }
            return true;
        }

        addSite(site)     { this.sites.push(site) }
        removeSite(siteId)  {
            if (this.sites.findIndex(x => x.id === siteId) > -1) {
                this.sites = this.sites.filter(x => x.id !== siteId);
                this.setCurrentSite();
            }
        }

        setCurrentSite() {
            this.currentSite = this.sites[0];
        }

        start() {
            this.status = STATUS.IDLE;
            this.worker = setTimeout(() => {
                this.checkNextRoll();
            }, 2000);
        }

        checkNextRoll() {
            if (this.status != STATUS.IDLE) {
                return;
            }
            this.timer.stopCheck();
            clearTimeout(this.worker);
            if(!this.currentSite || this.currentSite.nextRoll == null) {
                document.querySelector(`#wait-times span[data-schedule="${this.uuid}"]`).setAttribute('data-nextroll', 'UNDEFINED');
                this.status = STATUS.IDLE;
                return;
            }

            if(this.currentSite.nextRoll.getTime() < Date.now()) {
                ui.log({ schedule: this.uuid, siteName: this.currentSite.name, msg: `Opening ${this.currentSite.name}`});
                document.querySelector(`#wait-times span[data-schedule="${this.uuid}"]`).setAttribute('data-nextroll', 'RUNNING');
                this.open();
                this.timeUntilNext = null;
                return;
            } else {
                this.timeUntilNext = this.currentSite.nextRoll.getTime() - Date.now() + helpers.randomMs(1000, 2000);

                document.querySelector(`#wait-times span[data-schedule="${this.uuid}"]`).setAttribute('data-nextroll', this.currentSite.nextRoll.getTime());
                this.worker = setTimeout(() => {
                    this.checkNextRoll();
                }, this.timeUntilNext);
                this.status = STATUS.IDLE;
            }
        }

        getCustomOrDefaultVal(param, useOverride = false) {
            let val;

            if (useOverride) {
                if (this.currentSite.params && this.currentSite.params.hasOwnProperty(param)) {
                    val = this.currentSite.params[param];
                    if (val != -1) {
                        return val;
                    }
                }
            }

            return shared.getConfig()[param];
        }

        useOverride(param) {
            let overrideFlag = param  + '.override';
            return this.currentSite.params && this.currentSite.params[overrideFlag];
        }

        closeTab() {
            try {
                this.tab.close();
            } catch (err) {
                console.warn('Error while trying to close tab', err);
            }
        };

        reopenTab() {
            this.tab = GM_openInTab(this.currentSite.url, { active: !this.getCustomOrDefaultVal('defaults.workInBackground', this.useOverride('defaults.workInBackground')) });
        };

        open(promoCodes) {
            this.status = STATUS.CLAIMING;
            let navUrl = this.currentSite.url;
            try {
                let params = this.currentSite.params || {};
                params.siteParams = this.currentSite.siteParams || { "test": "test_value" };

                if(promoCodes) {
                    navUrl = new URL('promotion/' + promoCodes[0], this.currentSite.url.origin);
                    ui.log({ schedule: this.uuid, siteName: this.currentSite.name, msg: `Opening ${this.currentSite.name} with ${promoCodes.length} Promo Codes [${promoCodes.join(',')}]`});
                    params.promoCodes = promoCodes;
                }

                if (this.currentSite.firstRun) {
                    if(Array.isArray(this.currentSite.rf) && this.currentSite.rf.length > 0) {
                        navUrl = new URL(navUrl.href + this.currentSite.rf[helpers.randomInt(0, this.currentSite.rf.length - 1)]);
                    }
                }

                if (this.currentSite.wallet) {
                    try {
                        params.address = manager.userWallet.find(x => x.type == this.currentSite.wallet)?.address;
                        if (!params.address) {
                            throw new Error('Address is not defined.');
                        }
                    } catch {
                        ui.log({ schedule: this.uuid, siteName: this.currentSite.name, msg: `Unable to launch ${this.currentSite.name}: Address not detected > add it to the wallet.`});
                        this.moveNextAfterTimeoutOrError();
                        return;
                    }
                }
                if(this.currentSite.type == K.WebType.BESTCHANGE) {
                    params.address = shared.getConfig()['bestchange.address'] == '1' ? manager.userWallet.find(x => x.type == 1).address : params.address;
                }
                params.timeout = this.getCustomOrDefaultVal('defaults.timeout', this.useOverride('defaults.timeout'));
                params.cmc = this.currentSite.cmc;

                if(this.currentSite.type == K.WebType.FPB) {
                    switch(this.currentSite.id) {
                        case '77':
                            params.sitePrefix = 'fpb';
                            break;
                        case '83':
                            params.sitePrefix = 'fbch';
                            break;
                        case '92':
                            params.sitePrefix = 'shost';
                            break;
                    }
                }

                if(this.currentSite.type == K.WebType.VIE) {
                    params.credentials = {
                        mode: shared.getConfig()['jtfey.credentials.mode'],
                        username: shared.getConfig()['jtfey.credentials.username'],
                        password: shared.getConfig()['jtfey.credentials.password']
                    };
                }

                shared.setFlowControl(this.uuid, this.currentSite.id, navUrl, this.currentSite.type, params);
                setTimeout(() => {
                    this.waitForResult();
                }, 15000);

                if (this.tab && !this.tab.closed) {
                        this.closeTab(); // this.tab.close();
                } else {
                }

                this.timer.startCheck(this.currentSite.type);
                let noSignUpList = [ K.WebType.BESTCHANGE, K.WebType.CBG, K.WebType.G8, K.WebType.O24, K.WebType.CDIVERSITY, K.WebType.CTOP, K.WebType.AUTOCML, K.WebType.CCLICKS ];
                let hrefOpener = navUrl.href;
                if (noSignUpList.includes(this.currentSite.type)) {
                    hrefOpener = (new URL(this.currentSite.clId, 'https://criptologico.com/goto/')).href;
                }

                this.tab = GM_openInTab(hrefOpener, { active: !this.getCustomOrDefaultVal('defaults.workInBackground', this.useOverride('defaults.workInBackground')) });
            } catch(err) {
                ui.log({ schedule: this.uuid, msg: `Error opening tab: ${err}`});
            }
        };

        waitForResult() {
            if(manager.isObsolete()) {
                return;
            }

            if(shared.isCompleted(this.currentSite.id)) {
                this.analyzeResult(); // rename to something else...
                return;
            }

            this.timeWaiting += 15;
            if(shared.isIncompleted(this.currentSite.id) && this.hasTimedOut()) {
                this.analyzeResult(); // rename to something else...
                return;
            }

            this.waitOrMoveNext(); // this should just be the error and timeout check
            return;

        };

        analyzeResult() {

            let currentSchedule = shared.getCurrent(this.uuid);
            currentSchedule.result = currentSchedule.result || {};
            currentSchedule.runStatus = currentSchedule.runStatus || false;

            if (currentSchedule.result) {
                this.updateWebListItem(currentSchedule);

                if (currentSchedule.result.closeParentWindow) {
                    ui.log({ schedule: this.uuid, msg: `Closing working tab per process request` });
                    this.closeTab();
                }

                if (shared.getConfig()['cf.usePromoCodes'] && this.currentSite.type == K.WebType.CRYPTOSFAUCETS) {
                    let promoCode = CFPromotions.hasPromoAvailable(this.currentSite.id);
                    if (promoCode) {
                        this.timeWaiting = 0;

                        this.currentSite.nextRoll = new Date(754000 + +this.currentSite.id);
                        manager.update(false);
                        this.open(promoCode);
                        return;
                    }
                }
            } else {
                ui.log({ schedule: this.uuid, siteName: this.currentSite.name, msg: `Unable to read last run result, for ID: ${this.currentSite.id} > ${this.currentSite.name}`});
            }

            this.timeWaiting = 0;
            this.status = STATUS.IDLE;
            shared.clearFlowControl(this.uuid);
            manager.update(true);
            manager.readUpdateValues(true);
            return;
        }

        waitOrMoveNext() {
            if (this.currentSite.isExternal) {
                if (!this.tab || (this.tab && this.tab.closed)) {
                    this.timeWaiting = this.getCustomOrDefaultVal('defaults.timeout', this.useOverride('defaults.timeout')) * 60 + 9999;
                }
            }
            if (!shared.hasErrors(this.currentSite.id) && !this.hasTimedOut()) {
                ui.log({ schedule: this.uuid, 
                    siteName: this.currentSite.name,
                    elapsed: this.timeWaiting, 
                    msg: `Waiting for ${this.currentSite.name} results...`});
                setTimeout(() => {
                    this.waitForResult();
                }, 15000);
                return;
            }

            if (shared.hasErrors(this.currentSite.id)) {
                this.currentSite.stats.errors = shared.getResult(this.uuid); // shared.getResult(this.uuid);

                ui.log({ schedule: this.uuid, siteName: this.currentSite.name, 
                    msg: `${this.currentSite.name} closed with error: ${helpers.getEnumText(K.ErrorType,this.currentSite.stats.errors.errorType)} ${this.currentSite.stats.errors.errorMessage}`});

                if(this.sleepIfBan()) {
                    return;
                }
            }

            if (this.hasTimedOut()) {
                if (this.currentSite.isExternal) {
                    this.currentSite.stats.countTimeouts = 0;
                    this.currentSite.stats.errors = null;
                    ui.log({ schedule: this.uuid, siteName: this.currentSite.name, 
                        msg: `Closing ${this.currentSite.name}` });
                        try {
                            this.closeTab();
                        } catch (err) { console.error('Unable to close working tab', err); }
                    this.moveAfterNormalRun();
                    return;
                } else {
                    if(this.currentSite.stats.countTimeouts) {
                        this.currentSite.stats.countTimeouts += 1;
                    } else {
                        this.currentSite.stats.countTimeouts = 1;
                    }

                    ui.log({ schedule: this.uuid, siteName: this.currentSite.name, 
                        msg: `Waited too much time for ${this.currentSite.name} results: triggering timeout` });
                }
            }

            this.moveNextAfterTimeoutOrError();
            return;
        }

        hasTimedOut() { // here or on a site level???
            let val = this.getCustomOrDefaultVal('defaults.timeout', this.useOverride('defaults.timeout')) * 60;
            return (this.timeWaiting > val);
        };

        sleepIfBan() { // This should be a SiteType hook
            if( (this.currentSite.stats.errors.errorType == K.ErrorType.IP_BAN && shared.getConfig()['cf.sleepHoursIfIpBan'] > 0)
            || ( (this.currentSite.stats.errors.errorType == K.ErrorType.IP_RESTRICTED || this.currentSite.stats.errors.errorType == K.ErrorType.IP_BAN) && shared.getConfig()['bk.sleepMinutesIfIpBan'] > 0) ) {
                if(this.currentSite.type == K.WebType.CRYPTOSFAUCETS) {
                    Site.getAll().filter(x => x.enabled && x.type == K.WebType.CRYPTOSFAUCETS)
                        .forEach( function(el) {
                        el.nextRoll = this.sleepCheck(helpers.addMs(helpers.getRandomMs(shared.getConfig()['cf.sleepHoursIfIpBan'] * 60, 2)).toDate());
                    });
                }

                shared.clearFlowControl(this.uuid);
                manager.update(true);
                this.timeWaiting = 0;
                this.status = STATUS.IDLE;
                shared.clearFlowControl(this.uuid);
                manager.readUpdateValues(true);
                return true;
            }
            return false;
        }

        updateWebListItem(currentSchedule) {
            let result = currentSchedule.result;

            ui.log({ schedule: this.uuid, 
                msg: `Updating data: ${JSON.stringify(result)}` });
            this.currentSite.stats.countTimeouts = 0;
            this.currentSite.stats.errors = null;

            if (result.claimed) {
                try {
                    result.claimed = parseFloat(result.claimed);
                } catch { }
                if(!isNaN(result.claimed)) {
                    this.currentSite.lastClaim = result.claimed;
                    this.currentSite.aggregate += result.claimed;
                }
            }
            if(result.balance) {
                this.currentSite.balance = result.balance;
            }
            this.currentSite.nextRoll = this.getNextRun(result.nextRoll ? result.nextRoll.toDate() : null);
            if(result.promoCodeResults) { // TODO: move to a processResult hook
                for(let i = 0; i < result.promoCodeResults.length; i++) {
                    let item = result.promoCodeResults[i];
                    CFPromotions.updateFaucetForCode(item.promoCode, this.currentSite.id, item.promoStatus);
                }
            }
            if(result.rolledNumber) {
                CFHistory.addRoll(result.rolledNumber);
            }
        }

        getNextRun(nextRollFromCountdown) {
            let useCustom = this.useOverride('defaults.nextRun');
            let useCountdown = this.getCustomOrDefaultVal('defaults.nextRun.useCountdown', useCustom);
            let nextRunMode = this.getCustomOrDefaultVal('defaults.nextRun', useCustom);
            let min = this.getCustomOrDefaultVal('defaults.nextRun.min', useCustom);
            let max = this.getCustomOrDefaultVal('defaults.nextRun.max', useCustom);
            let nextRun;

            if (useCountdown && nextRollFromCountdown) {
                nextRun = nextRollFromCountdown;
            } else {
                let minutes = (nextRunMode == 0) ? helpers.randomInt(min, max) : nextRunMode;
                let msDelay = helpers.getRandomMs(minutes, 1);

                nextRun = helpers.addMs(msDelay).toDate();
            }
            nextRun = this.sleepCheck(nextRun)

            return nextRun;
        }

        errorTreatment() { // Move to group custom getNextRoll
            try {
                switch(this.currentSite.stats.errors.errorType) {
                    case K.ErrorType.NEED_TO_LOGIN:
                        this.currentSite.enabled = false;
                        this.currentSite.nextRoll = null;
                        return true;
                    case K.ErrorType.FAUCET_EMPTY: // retry in 8 hours
                        this.currentSite.enabled = true;
                        this.currentSite.nextRoll = new Date(new Date().setHours(new Date().getHours() + 8));
                        return true;
                }
            } catch {}
            return false;
        }

        sleepCheck(nextRun) {
            let useCustom = this.useOverride('defaults.sleepMode');
            let sleepMode = this.getCustomOrDefaultVal('defaults.sleepMode', useCustom);

            if (sleepMode) {
                let intNextRunTime = nextRun.getHours() * 100 + nextRun.getMinutes();
                let min = this.getCustomOrDefaultVal('defaults.sleepMode.min', useCustom).replace(':', '');
                let max = this.getCustomOrDefaultVal('defaults.sleepMode.max', useCustom).replace(':', '');

                if (+min < +max) {
                    if (+min < intNextRunTime && intNextRunTime < +max) {
                        nextRun.setHours(max.slice(0, 2), max.slice(-2), 10, 10);
                        ui.log({ schedule: this.uuid, 
                            msg: `Next run adjusted by Sleep Mode: ${helpers.getPrintableDateTime(nextRun)}` });
                    }
                } else if (+min > +max) {
                    if (intNextRunTime > +min || intNextRunTime < +max) {
                        nextRun.setHours(max.slice(0, 2), max.slice(-2), 10, 10);
                        if (nextRun.getTime() < Date.now()) {
                            nextRun.setDate(nextRun.getDate() + 1);
                        }
                        ui.log({ schedule: this.uuid, 
                            msg: `Next run adjusted by Sleep Mode: ${helpers.getPrintableDateTime(nextRun)}` });
                    }
                }
            }
            return nextRun;
        }

        moveAfterNormalRun() {
            this.currentSite.nextRoll = this.getNextRun(null);

            shared.clearFlowControl(this.uuid);
            manager.update(true);
            this.timeWaiting = 0;
            this.status = STATUS.IDLE;
            shared.clearFlowControl(this.uuid);
            manager.readUpdateValues(true);
        }

        moveNextAfterTimeoutOrError() {
            let useCustom = this.useOverride('defaults.postponeMinutes');

            let mode = this.getCustomOrDefaultVal('defaults.postponeMinutes', useCustom);
            let min = this.getCustomOrDefaultVal('defaults.postponeMinutes.min', useCustom);
            let max = this.getCustomOrDefaultVal('defaults.postponeMinutes.max', useCustom);

            let minutes = (mode == 0) ? helpers.randomInt(min, max) : mode;
            let msDelay = helpers.getRandomMs(minutes, 5);

            this.currentSite.nextRoll = this.sleepCheck(helpers.addMs(msDelay).toDate());
            if(this.errorTreatment()) {
            }

            shared.clearFlowControl(this.uuid);
            manager.update(true);
            this.timeWaiting = 0;
            this.status = STATUS.IDLE;
            shared.clearFlowControl(this.uuid);
            manager.readUpdateValues(true);
        }
    }

    function createManager() {
        let timestamp = null;
        let intervalUiUpdate;
        let getFeedInterval;

        let userWallet = [];

        const sites = [
            { id: '1', name: 'CF ADA', cmc: '2010', coinRef: 'ADA', url: new URL('https://app.freecardano.com/free'), rf: '?ref=335463', type: K.WebType.CRYPTOSFAUCETS, clId: 45 },
            { id: '2', name: 'CF BNB', cmc: '1839', coinRef: 'BNB', url: new URL('https://app.freebinancecoin.com/free'), rf: '?ref=161127', type: K.WebType.CRYPTOSFAUCETS, clId: 42 },
            { id: '3', name: 'CF BTC', cmc: '1', coinRef: 'BTC', url: new URL('https://app.freebitcoin.io/free'), rf: '?ref=490252', type: K.WebType.CRYPTOSFAUCETS, clId: 40 },
            { id: '4', name: 'CF DASH', cmc: '131', coinRef: 'DASH', url: new URL('https://app.freedash.io/free'), rf: '?ref=124083', type: K.WebType.CRYPTOSFAUCETS, clId: 156 },
            { id: '5', name: 'CF ETH', cmc: '1027', coinRef: 'ETH', url: new URL('https://app.freeethereum.com/free'), rf: '?ref=204076', type: K.WebType.CRYPTOSFAUCETS, clId: 44 },
            { id: '6', name: 'CF LINK', cmc: '1975', coinRef: 'LINK', url: new URL('https://app.freecryptom.com/free'), rf: '?ref=78652', type: K.WebType.CRYPTOSFAUCETS, clId: 157 },
            { id: '7', name: 'CF LTC', cmc: '2', coinRef: 'LTC', url: new URL('https://app.free-ltc.com/free'), rf: '?ref=117042', type: K.WebType.CRYPTOSFAUCETS, clId: 47 },
            { id: '8', name: 'CF NEO', cmc: '1376', coinRef: 'NEO', url: new URL('https://app.freeneo.io/free'), rf: '?ref=100529', type: K.WebType.CRYPTOSFAUCETS, clId: 158 },
            { id: '9', name: 'CF STEAM', cmc: '825', coinRef: 'STEEM', url: new URL('https://app.freesteam.io/free'), rf: '?ref=117686', type: K.WebType.CRYPTOSFAUCETS, clId: 49 },
            { id: '10', name: 'CF TRX', cmc: '1958', coinRef: 'TRX', url: new URL('https://app.free-tron.com/free'), rf: '?ref=145047', type: K.WebType.CRYPTOSFAUCETS, clId: 41 },
            { id: '11', name: 'CF USDC', cmc: '3408', coinRef: 'USDC', url: new URL('https://app.freeusdcoin.com/free'), rf: '?ref=100434', type: K.WebType.CRYPTOSFAUCETS, clId: 51 },
            { id: '12', name: 'CF USDT', cmc: '825', coinRef: 'USDT', url: new URL('https://app.freetether.com/free'), rf: '?ref=181230', type: K.WebType.CRYPTOSFAUCETS, clId: 43 },
            { id: '13', name: 'CF XEM', cmc: '873', coinRef: 'XEM', url: new URL('https://app.freenem.com/free'), rf: '?ref=295274', type: K.WebType.CRYPTOSFAUCETS, clId: 46 },
            { id: '14', name: 'CF XRP', cmc: '52', coinRef: 'XRP', url: new URL('https://app.coinfaucet.io/free'), rf: '?ref=808298', type: K.WebType.CRYPTOSFAUCETS, clId: 48 },
            { id: '15', name: 'StormGain', cmc: '1', url: new URL('https://app.stormgain.com/crypto-miner/'), rf: 'friend/BNS27140552', type: K.WebType.STORMGAIN, clId: 35 },
            { id: '16', name: 'CF DOGE', cmc: '74', coinRef: 'DOGE', url: new URL('https://app.free-doge.com/free'), rf: '?ref=97166', type: K.WebType.CRYPTOSFAUCETS, clId: 50 },
            { id: '17', name: 'FreeBitco.in', cmc: '1', url: new URL('https://freebitco.in/'), rf: '?r=41092365', type: K.WebType.FREEBITCOIN, clId: 36 },
            { id: '18', name: 'FaucetPay PTC', cmc: '825', url: new URL('https://faucetpay.io/ptc'), rf: '?r=41092365', type: K.WebType.FAUCETPAY, clId: 159 },
            { id: '52', name: 'BigBtc', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://bigbtc.win/'), rf: '?id=39255652', type: K.WebType.BIGBTC, clId: 200 },
            { id: '53', name: 'BestChange', cmc: '1', url: new URL('https://www.bestchange.com/'), rf: ['index.php?nt=bonus&p=1QCD6cWJNVH4Cdnz85SQ2qtTkAwGr9fvUk'], type: K.WebType.BESTCHANGE, clId: 163 },
            { id: '58', name: 'BF BTC', cmc: '1', url: new URL('https://betfury.io/boxes/all'), rf: ['?r=608c5cfcd91e762043540fd9'], type: K.WebType.BFBOX, clId: 1 },
            { id: '61', name: 'Dutchy', cmc: '-1', url: new URL('https://autofaucet.dutchycorp.space/roll.php'), rf: '?r=corecrafting', type: K.WebType.DUTCHYROLL, clId: 141 },
            { id: '62', name: 'Dutchy Monthly Coin', cmc: '-1', url: new URL('https://autofaucet.dutchycorp.space/coin_roll.php'), rf: '?r=corecrafting', type: K.WebType.DUTCHYROLL, clId: 141 },
            { id: '68', name: 'CF SHIBA', cmc: '5994', coinRef: 'SHIBA', url: new URL('https://app.freeshibainu.com/free'), rf: '?ref=18226', type: K.WebType.CRYPTOSFAUCETS, clId: 167 },
            { id: '78', name: 'CF Cake', cmc: '7186', coinRef: 'CAKE', url: new URL('https://app.freepancake.com/free'), rf: '?ref=699', type: K.WebType.CRYPTOSFAUCETS, clId: 197 },
            { id: '80', name: 'FreeGRC', cmc: '833', url: new URL('https://freegridco.in/#free_roll'), rf: '', type: K.WebType.FREEGRC, clId: 207 },
            { id: '81', name: 'CF Matic', cmc: '3890', coinRef: 'MATIC', url: new URL('https://app.freematic.com/free'), rf: '?ref=6435', type: K.WebType.CRYPTOSFAUCETS, clId: 210 },
            { id: '84', name: 'JTFey', cmc: '-1', url: new URL('https://james-trussy.com/faucet'), rf: ['?r=corecrafting'], type: K.WebType.VIE, clId: 213 },
            { id: '85', name: 'O24', cmc: '1', wallet: K.WalletType.FP_BTC, url: new URL('https://www.only1024.com/f'), rf: ['?r=1QCD6cWJNVH4Cdnz85SQ2qtTkAwGr9fvUk'], type: K.WebType.O24, clId: 97 },
            { id: '87', name: 'CF BTT', cmc: '16086', coinRef: 'BTT', url: new URL('https://app.freebittorrent.com/free'), rf: '?ref=2050', type: K.WebType.CRYPTOSFAUCETS, clId: 218 },
            { id: '89', name: 'CF BFG', cmc: '11038', coinRef: 'BFG', url: new URL('https://app.freebfg.com/free'), rf: '?ref=117', type: K.WebType.CRYPTOSFAUCETS, clId: 219 },
            { id: '93', name: 'YCoin', cmc: '1', url: new URL('https://yescoiner.com/faucet'), rf: ['?ref=4729452'], type: K.WebType.YCOIN, clId: 234 },
            { id: '94', name: 'CDiversity', cmc: '-1', wallet: K.WalletType.FP_MAIL, url: new URL('http://coindiversity.io/free-coins'), rf: ['?r=1J3sLBZAvY5Vk9x4RY2qSFyL7UHUszJ4DJ'], type: K.WebType.CDIVERSITY, clId: 235 },
            { id: '96', name: 'Top Ltc', cmc: '2', wallet: K.WalletType.FP_LTC, url: new URL('https://ltcfaucet.top/'), rf: ['?r=MWSsGAQTYD7GH5o4oAehC8Et5PyMBfhnKK'], type: K.WebType.CTOP, clId: 239 },
            { id: '97', name: 'Top Bnb', cmc: '1839', wallet: K.WalletType.FP_BNB, url: new URL('https://bnbfaucet.top/'), rf: ['?r=0x1e8CB8A79E347C54aaF21C0502892B58F97CC07A'], type: K.WebType.CTOP, clId: 240 },
            { id: '98', name: 'Top Doge', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://dogecoinfaucet.top/'), rf: ['?r=D8Xgghu5gCryukwmxidFpSmw8aAKon2mEQ'], type: K.WebType.CTOP, clId: 241 },
            { id: '99', name: 'Top Trx', cmc: '1958', wallet: K.WalletType.FP_TRX, url: new URL('https://tronfaucet.top/'), rf: ['?r=TK3ofbD3AyXotN2111UvnwCzr2YaW8Qmx7'], type: K.WebType.CTOP, clId: 242 },
            { id: '100', name: 'Top Eth', cmc: '1027', wallet: K.WalletType.FP_ETH, url: new URL('https://ethfaucet.top/'), rf: ['?r=0xC21FD989118b8C0Db6Ac2eC944B53C09F7293CC8'], type: K.WebType.CTOP, clId: 243 },
            { id: '101', name: 'Top Bch', cmc: '1831', wallet: K.WalletType.FP_BCH, url: new URL('https://freebch.club/'), rf: ['?r=qq2qlpzs4rsn30utrumezpkzezpteqj92ykdgfeq5u'], type: K.WebType.CTOP, clId: 244 },
            { id: '102', name: 'Top Zec', cmc: '1437', wallet: K.WalletType.FP_ZEC, url: new URL('https://zecfaucet.net/'), rf: ['?r=t1erPs9qw3SgnX7kJPmR4uKFnLaoVww2jCy'], type: K.WebType.CTOP, clId: 245 },
            { id: '103', name: 'FMonster', cmc: '825', wallet: K.WalletType.FP_USDT, url: new URL('https://faucet.monster/'), rf: '', type: K.WebType.O24, clId: 246 },
            { id: '104', name: 'Auto-C BNB', cmc: '1839', wallet: K.WalletType.FP_BNB, url: new URL('https://auto-crypto.click/'), rf: ['?r=0x1e8CB8A79E347C54aaF21C0502892B58F97CC07A'], type: K.WebType.AUTOCML, clId: 247 },
            { id: '105', name: 'Auto-C DOGE', cmc: '74', wallet: K.WalletType.FP_DOGE, url: new URL('https://freeshiba.cf/'), rf: ['?r=D8Xgghu5gCryukwmxidFpSmw8aAKon2mEQ'], type: K.WebType.AUTOCML, clId: 248 },
            { id: '106', name: 'ClClicks DOGE', cmc: '74', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/doge/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 61 },
            { id: '107', name: 'ClClicks LTC', cmc: '2', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/ltc/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 62 },
            { id: '108', name: 'ClClicks TRX', cmc: '1958', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/trx/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 63 },
            { id: '109', name: 'ClClicks BTC', cmc: '1', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/btc/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 252 },
            { id: '110', name: 'ClClicks SOL', cmc: '5426', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/sol/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 253 },
            { id: '111', name: 'ClClicks BNB', cmc: '1839', wallet: K.WalletType.FP_USERNAME, url: new URL('https://claimclicks.com/bnb/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 254 },
            { id: '112', name: 'CrClicks DOGE', cmc: '74', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/doge/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 257 },
            { id: '113', name: 'CrClicks LTC', cmc: '2', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/ltc/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 258 },
            { id: '114', name: 'CrClicks TRX', cmc: '1958', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/trx/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 259 },
            { id: '115', name: 'CrClicks BTC', cmc: '1', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/btc/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 256 },
            { id: '116', name: 'CrClicks SOL', cmc: '5426', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/sol/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 261 },
            { id: '117', name: 'CrClicks BNB', cmc: '1839', wallet: K.WalletType.FP_USERNAME, url: new URL('https://cryptoclicks.net/bnb/'), rf: ['?r=corecrafting'], type: K.WebType.CCLICKS, clId: 260 },
        ];

        const wallet = [
            { id: '99', name: 'FaucetPay Username', type: K.WalletType.FP_USERNAME },
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
            { id: '114', name: 'FaucetPay MATIC (Polygon)', type: K.WalletType.FP_MATIC },
            { id: '116', name: 'FaucetPay ADA (Cardano)', type: K.WalletType.FP_ADA },
            { id: '200', name: 'ExpressCrypto (EC-UserId-XXXXXX)', type: K.WalletType.EC },
            { id: '1', name: 'BTC Alternative Address', type: K.WalletType.BTC }
        ];

        async function start() {
            await loader.initialize();
            ui.init(getCFlist(), Schedule.getAll());
            uiRenderer.appendEventListeners();
            shared.purgeFlowControlSchedules(Schedule.getAll().map(x => x.uuid));
            update();
            uiRenderer.wallet.legacyRenderWalletTable(userWallet);
            intervalUiUpdate = setInterval(readUpdateValues, 10000);
            Schedule.getAll().forEach(x => {
                x.start();
            });
            if (document.querySelector('#console-log').innerText == 'Loading...') {
                document.querySelector('#console-log').innerHTML = '<table><tr><td><b>Running...</b></td></tr></table>';
            }
            getFeedInterval = setInterval(getCodesFeed, 25000);
        };

        let loader = function() {
            async function initialize() {
                setTimestamp();
                await Schedule.initialize();
                await initializeSites();
                initializeUserWallet();
                initializePromotions();
                initializeHistory();
            };
            async function initializeSites() {
                Site.createFromDataArray(sites);
                await updateSitesWithStoredData();
                await addSitesToSchedules();
            };
            async function updateSitesWithStoredData() {
                let storedData = persistence.load('webList', true);
                if (storedData) {
                    storedData.forEach( function (stored) {
                        if (stored.isExternal) {
                            stored.url = new URL(stored.url);
                            Site.add(stored);
                        }
                        let site = Site.getById(stored.id);
                        if (!site) {
                            return;
                        }
                        for (const prop in stored) {
                            site[prop] = stored[prop];
                        }
                        if (!site.enabled) {
                            site.nextRoll = null;
                        } else {
                            site.nextRoll = site.nextRoll ? new Date(site.nextRoll) : new Date();
                        }
                        if (site.aggregate || site.balance) {
                            site.firstRun = false;
                        }
                    })
                }
            };
            async function addSitesToSchedules() {
                Site.getAll().forEach(site => {
                    let scheduleOfSite = Schedule.getById(site.schedule);
                    if (!scheduleOfSite) {
                        console.warn(`Attention! Site ${site.name} has a reference to a schedule that does not exist: (${site.schedule})`);
                        scheduleOfSite = Schedule.getAll()[0];
                        console.warn(`Assigning it to first schedule (${scheduleOfSite.uuid}) instead.`);
                        site.schedule = scheduleOfSite.uuid; // use .changeSchedule to save the change???
                    }
                    scheduleOfSite.addSite(site);
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
                            userWallet[idx].address = element.address ?? userWallet[idx].address;
                        }
                    });
                }
            };
            function initializePromotions() {
                let storedData = persistence.load('CFPromotions', true);
                if (storedData) {
                    let mig00200799 = false;
                    try {
                        mig00200799 = shared.getConfig().migrations.find(x => x.version == '00200799' && !x.applied);
                    } catch (err) {}

                    let allCFs = manager.getFaucetsForPromotion().map( cf => cf.id );
                    storedData.forEach( function (element, idx, arr) {
                        arr[idx].added = new Date(element.added);
                        arr[idx].statusPerFaucet.forEach( function (el, i, a) {
                            a[i].execTimeStamp = (el.execTimeStamp != null) ? new Date(el.execTimeStamp) : null;
                            if (mig00200799 && el.status == 4) {
                                a[i].status = 1;
                            }
                        });
                        allCFs.forEach( function (cf) {
                            if (!arr[idx].statusPerFaucet.find( x => x.id == cf )) {
                                let newCf = { id: cf, status: 1, execTimeStamp: null };
                                arr[idx].statusPerFaucet.push(newCf);
                            }
                        });
                    });
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
            return {
                initialize: initialize
            };
        }();
        function getCodesFeed(force = false) {
            clearInterval(getFeedInterval);
            if (!force) {
                let tryGet = shared.getConfig()['cf.tryGetCodes'] || false;
                if (!tryGet) {
                    return;
                }
            }

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
                                newCode['expiration' + 'Date'] = item.expiration_date.replace(' ', 'T') + 'Z';
                                newCode['expiration' + 'Date'] = new Date(newCode['expiration' + 'Date']);
                                newCodes.push(newCode);
                            }
                            CFPromotions.includeNewCodes(newCodes);
                            uiRenderer.promos.legacyRenderPromotionTable(CFPromotions.getAll());
                        }
                    } catch(err) {
                        console.error('unexpected error parsing codes list');
                        console.error(err);
                    }
                },
                onerror: function(e) {
                    console.error('error getting codes');
                    console.error(e);
                },
                ontimeout: function() {
                    console.error('timeout getting codes');
                },
            });
        }
        function readUpdateValues(forceCheck = false) {
            readPromoCodeValues();
            readModalData();

            if(true) {
                let updateDataElement = document.getElementById('update-data');
                let updateValues = updateDataElement.innerText.clean();

                if (updateValues != '') {
                    updateDataElement.innerText = '';
                    let updateObj = JSON.parse(updateValues);
                    if(updateObj.editSingle.changed) {
                        updateObj.editSingle.items.forEach(function (element, idx, arr) {
                            try {
                                let site = Site.getById(element.id);

                                site.name = element.displayName;

                                if (site.enabled != element.enabled) {
                                    site.enabled = element.enabled;
                                    if(site.enabled) {
                                        site.nextRoll = new Date(idx);
                                    } else {
                                        site.nextRoll = null;
                                    }
                                }
                                ui.log({ schedule: site.schedule,
                                    msg: `Faucet updated. New name: ${element.displayName}. Active: ${element.enabled}` });
                            } catch (err) {
                                ui.log({ schedule: this.uuid,
                                    msg: `Error updating faucet data: ${err}` });
                            }
                        });
                    }

                    if(updateObj.wallet.changed) {
                        updateObj.wallet.items.forEach(function (element) {
                            try {
                                let itemIndex = userWallet.findIndex(x => x.id == element.id);
                                userWallet[itemIndex].address = element.address;

                                ui.log({ msg: `Wallet Address updated [${userWallet[itemIndex].name}]: ${userWallet[itemIndex].address}` });
                            } catch (err) {
                                ui.log({ msg: `Error updating wallet/address: ${err}` });
                            }
                        });

                        uiRenderer.wallet.legacyRenderWalletTable(userWallet);
                        saveUserWallet();
                    }

                    if(updateObj.config.changed) {
                        try {
                            shared.updateConfig(updateObj.config.items);
                            ui.log({ msg: `Config updated. Reloading in a few seconds...` });
                            window.location.reload();
                            return;
                        } catch (err) {
                            ui.log({ msg: `Error updating config: ${err}` });
                        }

                    }

                    if(updateObj.site.changed) {
                        updateObj.site.list.forEach( (x) => {
                            try {
                                updateSite(x.id, x.items);
                            } catch (err) {
                                ui.log({ msg: `Error updating site: ${err}` });
                            }
                        });
                    }

                    if(updateObj.runAsap.changed || updateObj.editSingle.changed || updateObj.site.changed) {
                        resyncAll({ withUpdate: true });
                        return;
                    }
                }
            }
            if(forceCheck) {
                resyncAll({ withUpdate: false });
            }
        };
        function resyncAll(options = { withUpdate: false} ) {
            if (options.withUpdate) {
                update(true);
            }
            Schedule.getAll().forEach(x => {
                x.checkNextRoll();
            });
        }
        function updateSite(id, items) {
            let site = Site.getById(id);
            if (site) {
                site.params = site.params || {};
                items.forEach( (item) => {
                    site.params[item.prop] = item.value;
                });

                ui.log({ schedule: site.schedule, siteName: site.name, 
                    msg: `Site ${site.name} updated` });
            }
        }
        function readModalData() { // This should be migrated and dissapear!
            if(document.getElementById('modal-spinner').isVisible()) {
                let targetObject = JSON.parse(document.getElementById('target-spinner').innerHTML);
                let target = targetObject.id;
                if (target == 'modal-ereport') {
                    let temp = shared.getDevLog();
                    document.getElementById('log-textarea').value = temp.join('\n');
                } else if (target == 'modal-config') {
                    uiRenderer.config.legacyRenderConfigData(shared.getConfig());
                } else if (target == 'modal-site') {
                    let site = Site.getById(targetObject.siteId);
                    uiRenderer.sites.legacyRenderSiteData(site, shared.getConfig());
                }
                document.getElementById('modal-spinner').classList.toggle('d-none');
                document.getElementById(target).classList.toggle('d-none');
                document.getElementById('target-spinner').innerHTML = '';
            }
        }
        function sortSites () { // Temporary, just to decouple it...
            Site.sortAll();
            Schedule.getAll().forEach( schedule => schedule.sortSites() );
        };
        function update(sortIt = true) {
            if(sortIt) {
                sortSites();
                Schedule.getAll().forEach( schedule => schedule.setCurrentSite() );
            }

            Site.saveAll();
            Site.getAll().forEach(site => {
                uiRenderer.sites.renderSiteRow(site);
            });
            uiRenderer.sites.removeDeletedSitesRows(Site.getAll().map(x => x.id));
            convertToFiat();
            uiRenderer.sites.sortSitesTable(); // y reordenar
            uiRenderer.promos.legacyRenderPromotionTable(CFPromotions.getAll());
            updateRollStatsSpan();
        };

        function saveUserWallet() {
            const data = userWallet.map(x => {
                return {
                    id: x.id,
                    address: x.address
                };});

            persistence.save('userWallet', data, true);
        }

        function isObsolete() {
            let savedTimestamp = persistence.load('timestamp');
            if (savedTimestamp && savedTimestamp > timestamp) {
                ui.log({ msg: '<b>STOPING EXECUTION!<b> A new Manager UI window was opened. Process should continue there' });
                clearInterval(intervalUiUpdate);
                return true;
            }
            return false;
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
                        Schedule.getAll().forEach(s => {
                            if (s.status != STATUS.IDLE) {
                                s.currentSite.enabled = false;
                                s.closeTab();
                            }
                        });

                        update(true);
                        shared.clearFlowControl('all');
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);

                        promoCodeElement.innerText = '';
                        break;
                    case 'ADD':
                        CFPromotions.addNew(promoData.code, promoData.repeatDaily);
                        promoCodeElement.innerText = '';
                        document.getElementById('promo-text-input').value = '';
                        uiRenderer.toast("Code " + promoData.code + " added!");
                        ui.log({ msg: `Promo code ${promoData.code} added` });
                        uiRenderer.promos.legacyRenderPromotionTable(CFPromotions.getAll());
                        break;
                    case 'REMOVEALLPROMOS':
                        CFPromotions.removeAll();
                        promoCodeElement.innerText = '';
                        uiRenderer.toast("Promo codes removed!");
                        ui.log({ msg: `Promo codes removed` });
                        uiRenderer.promos.legacyRenderPromotionTable(CFPromotions.getAll());
                        break;
                    case 'REMOVE':
                        if(CFPromotions.remove(promoData.id, promoData.code) != -1) {
                            ui.log({ msg: `Promo code ${promoData.code} removed` });
                        } else {
                            ui.log({ msg: `Unable to remove code ${promoData.code}` });
                        }
                        promoCodeElement.innerText = '';
                        uiRenderer.promos.legacyRenderPromotionTable(CFPromotions.getAll());
                        break;
                    case 'TRYGETCODES':
                        getCodesFeed(true);
                        promoCodeElement.innerText = '';
                        uiRenderer.toast("Looking for new codes!");
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
            items = Site.getAll().filter(f => f.type === K.WebType.CRYPTOSFAUCETS);
            items = items.map(x => {
                return {
                    id: x.id,
                    name: x.coinRef
                };});
            items.sort((a, b) => (a.name > b.name) ? 1 : -1);

            return items;
        };

        function closeWorkingTab(schedule) {
            let sc = Schedule.getAll().find(x => x.uuid == schedule);
            if (sc) sc.closeTab()
        };
        function reloadWorkingTab(schedule) {
            let sc = Schedule.getAll().find(x => x.uuid == schedule);
            if (sc) {
                sc.closeTab();
                sc.reopenTab();
            }
        };
        function getAllSites() {
            return Site.getAll();
        }
        return{
            start: start,
            getFaucetsForPromotion: getCFlist,
            closeWorkingTab: closeWorkingTab,
            reloadWorkingTab: reloadWorkingTab,
            getAllSites: getAllSites,
            resyncAll: resyncAll,
            isObsolete: isObsolete,
            update: update,
            userWallet: userWallet,
            readUpdateValues: readUpdateValues
        };
    }
    function createUi() {

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
                        }).catch(err => {
                            console.error("[error] " + err.message);
                        });
                    } catch { }
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

                window.removePromoCode = function removePromoCode(id, code) {
                    var promoCode = document.getElementById("promo-code-new");
                    var promoObject = { action: "REMOVE", id: id, code: code };
                    promoCode.innerHTML =JSON.stringify(promoObject);
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
                        uiRenderer.toast("Faucet will be updated to run as soon as possible");
                    }
                };

                window.schedulesInterval = null;
                window.startSchedulesInterval = function startSchedulesInterval(uuids) {
                    if (window.schedulesInterval) {
                        clearInterval(window.schedulesInterval);
                    }

                    let innerWaitTimes = '';
                    uuids.forEach(x => {
                        innerWaitTimes += `<span data-schedule="${x}" data-nextroll="UNDEFINED" class="mx-1"><i class="fas fa-square pr-1" style="color: #${x};"></i><span></span></span>`;
                    });

                    let container = document.querySelector('#wait-times');
                    container.innerHTML = innerWaitTimes;
                    window.schedulesInterval = setInterval(() => {
                        [...document.querySelectorAll('#wait-times > span')].forEach(sp => {
                            let nroll = sp.getAttribute('data-nextroll');
                            let spanScheduleId = sp.getAttribute('data-schedule');
                            if (nroll == 'UNDEFINED') {
                                sp.querySelector('span').innerText = '-';
                            } else if (nroll == 'RUNNING') {
                                sp.querySelector('span').innerText = 'Running';
                                let inUseElm = document.querySelector(`#schedule-table tr[data-schedule="${spanScheduleId}"]`);
                                if (inUseElm) {
                                    inUseElm.classList.add('in-use');
                                }
                            } else {
                                let timeVal = +nroll - Date.now();
                                sp.querySelector('span').innerText = timeVal.msToCountdown();
                                if (timeVal < -60000) {
                                    console.info(`Resync required: ${timeVal}`);
                                }
                            }
                        })
                    }, 1000);
                }
                window.confirmable = {
                    open: function (req, details = null, params = null) {
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
                    toastr["info"]("Removing all promo codes... please wait");
                };

                window.forceStopFaucet = function forceStopFaucet() {
                    var promoCode = document.getElementById("promo-code-new");
                    var promoObject = { action: "FORCESTOPFAUCET" };
                    promoCode.innerHTML =JSON.stringify(promoObject);
                    toastr["info"]("Trying to stop... Please wait for reload");
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
                        } else {
                            document.getElementById(id).classList.remove("d-none");
                        }
                    },
                    save: function () {
                        localStorage.setItem("hideShortlinkAlerts", JSON.stringify(document.getElementById("hideShortlinkAlerts").checked));
                        window.open("https://example.com", "_blank");
                    }
                }
            }
        };

        let logLines = [];
        function init(cfFaucets, schedules) {
            appendJavaScript();
            appendHtml(schedules);
            updateSchedulesToggler();
            appendEventListeners();
            appendWidgets();
            setupEventerListeners();

            createPromoTable(cfFaucets);
            try {
                document.querySelector('.page-title h1').innerHTML = 'Auto Claim';
            } catch (err) {}
        };
        function setupEventerListeners() {
            eventer.on('siteUpdated', (site) => {
                Site.sortAll(); // en todos los sites...
                let schedule = Schedule.getById(site.schedule);
                schedule.sortSites(); // solo en el schedule de este site
                schedule.setCurrentSite(); // solo en el schedule de este site
                Site.saveAll();
                uiRenderer.sites.renderSiteRow(site); // solo la row de este site
                uiRenderer.sites.sortSitesTable(); // y reordenar

                schedule.checkNextRoll(); // solo en el schedule de este site    
                convertToFiat();
            });
        }
        function appendWidgets() {
            $('.tableSortable').sortable({
                placeholder:'sort-highlight',
                handle:'.row-handle',
                cursor: 'grabbing',
                axis: 'y',
                stop: function(event, ui) {
                    $("tbody.ui-sortable tr").each(function(index) {
                      $(this).attr("data-order", index);
                    });
                  }
            });
            $('#promo-daily').bootstrapSwitch();
            $('#bss-log').bootstrapSwitch({
                onSwitchChange(event, state) {
                    $('#console-log').collapse('toggle');
                },
                onInit: function(event, state) {
                    this.$element.closest('.bootstrap-switch-container').find('.bootstrap-switch-handle-on').first().addClass('fa fa-eye').text('');
                    this.$element.closest('.bootstrap-switch-container').find('.bootstrap-switch-handle-off').first().addClass('fa fa-eye-slash').text('');
                }
            });
        };
        function updateSchedulesToggler() {
            let container = document.querySelector('#schedules-toggler');
            let html = '<label class="btn btn-outline-primary active" data-schedule="all"><input type="radio" name="options" autocomplete="off" checked="true"> All</label>';
            Schedule.getAll().forEach(x => {
                html += `<label class="btn btn-outline-primary" data-schedule="${x.uuid}">
                <i class="fas fa-square pr-1" style="color: #${x.uuid};"></i>${x.name}
                <input type="radio" name="options" autocomplete="off">
                </label>`;
            });
            container.innerHTML = html;
            startSchedulesInterval(Schedule.getAllForCrud().map(x => x.uuid));
            uiRenderer.schedules.toggleSchedule('all');
        };
        function appendEventListeners() {
            document.querySelector('.dropdown-settings-menu').addEventListener('click', function(e) {
                let actionElement = e.target.tagName === 'I' ? e.target.parentElement : e.target;
                if (actionElement.dataset.target) {
                    e.stopPropagation();
                    uiRenderer.openModal(actionElement.dataset.target);
                }
            });

            const modalSchedules = document.querySelector('#modal-schedules');
            modalSchedules.addEventListener('click', function(e) {
                let actionElement = e.target.tagName === 'I' ? e.target.parentElement : e.target;
                if (actionElement.classList.contains('action-schedule-add')) {
                    e.stopPropagation();
                    let rows = modalSchedules.querySelectorAll('table tbody tr');
                    let rndColor = helpers.randomHexColor();
                    let rowTemplate = uiRenderer.schedules.renderRow({
                        uuid: rndColor,
                        name: rndColor,
                        order: rows.length,
                        added: true
                    });
                    $(modalSchedules.querySelector('table tbody tr:last-child')).after(rowTemplate);
                    uiRenderer.appendColorPickers('table tbody tr:last-child .color-picker');
                } else if (actionElement.classList.contains('action-schedule-remove')) {
                    let rows = modalSchedules.querySelectorAll('table tbody tr:not(.d-none)');
                    if (rows.length <= 1) {
                        alert('You need to keep at least 1 schedule');
                    } else {
                        let current = actionElement.closest('tr');
                        if (current.dataset.added === 'true') {
                            current.remove();
                        } else {
                            current.dataset.removed = 'true';
                            current.classList.add('d-none');
                        }
                    }
                } else if (actionElement.classList.contains('modal-save')) {
                    let data = uiRenderer.parseTable(modalSchedules.querySelector('table'));
                    let isValid = Schedule.crud(data);
                    updateSchedulesToggler();
                    manager.resyncAll({withUpdate: true});
                    if (!isValid) {
                        uiRenderer.toast('Some schedules might have errors/invalid colors', 'warning');
                    }
                }
            });
        };
        function appendJavaScript() {
            addJS_Node (null, null, injectables.managerJs);
        };
        function addCardHtml(obj) {
            return `<div class="card m-1"><div class="card-header">${obj.header}</div><div class="card-body px-4">${obj.body}</div></div>`;
        };
        function addRandomBetween(propSelect, propMin, propMax) {
            return `<table><tr><td>
              <select class="form-control" ${propSelect.name}="${propSelect.value}">
               <option value="0">Random between...</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="35">35 minutes</option><option value="45">45 minutes</option><option value="65">65 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option>
              </select></td>
              <td><input type="number" data-original="" ${propMin.name}="${propMin.value}" min="1" value="15" step="5" class="form-control"></td><td>and</td><td><input type="number" data-original="" ${propMax.name}="${propMax.value}" value="65" step="5" class="form-control"></td><td>minutes</td></tr></table>`;
        }
        function appendHtml(schedules) {
            let html ='';
            let tgt = document.querySelector('div.row.py-3');
            if (tgt) {
                let rowDiv = document.createElement('div');
                rowDiv.innerHTML = '<div class="row py-3 ac-log"><div class="col-12 justify-content-center"><div class="card"><div class="card-body" id="referral-table"></div></div></div></div>';
                tgt.after(rowDiv);
            }

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

            html += '<div class="modal-content bg-beige" id="modal-spinner"><div class="modal-body"><div class="d-flex justify-content-center"><span id="target-spinner" class="d-none"></span><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading data</div></div></div>';

            html += '  <div class="modal-content bg-beige d-none" id="modal-ereport">';
            html += '   <div class="modal-header"><h5 class="modal-title"><i class="fa fa-history"></i> Submit an Error</h5></div>';
            html += '    <div class="modal-body">';
            html += '     <div class="alert alert-danger">Don\'t send private information as data might be publicly access.</div>';
            html += '      <textarea rows="4" id="log-message" class="form-control" placeholder="PLEASE do not send logs without describing here the issue you are facing..."></textarea>';
            html += '      <label for="log-textarea">Log</label>';
            html += '      <textarea rows="10" id="log-textarea" class="form-control"></textarea>';
            html += '    </div>';
            html += '    <div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'ereport\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
            html += '    <a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'ereport\')" data-dismiss="modal"><i class="fa fa-paper-plane"></i> Send</a></div>';
            html += '  </div>';

            html += '  <div class="modal-content bg-beige d-none" id="modal-wallet">';
            html += '   <div class="modal-header"><h5 class="modal-title"><i class="fa fa-wallet"></i> Your Addresses</h5></div>';
            html += '    <div class="modal-body">';
            html += '     <div><table class="table custom-table-striped" id="wallet-table">';
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

            html += '  <div class="modal-content bg-beige d-none" id="modal-info">';
            html += '   <div class="modal-header"><h5 class="modal-title"><i class="fa fa-info"></i> Info</h5></div>';
            html += '    <div class="modal-body">';
            html += '<ul>';
            html += '<li>First of all, make sure you visit our <a href="https://discord.gg/gaYYBjJUhP" target="_blank">discord</a> server for specific issues with the script. Unfortunately, our original server and user account was disabled after +2 years. We are trying to bring the community together in a new one now.</li>';
            html += `<li>The script comes with <b>2 schedules</b> (Default and CF). You can add more from <i>Settings > Schedules...</i><br>About the <i>Schedules</i>:`;
            html += `<ul><li>Each schedule will open a new tab, so:<br>N schedules = N simultaneous tabs.</li>`;
            html += `<li>Each schedule has it's own list of sites.<br>You can have N sites per schedule, but each site can be in just 1 schedule to avoid overlapping.</li>`;
            html += `<li>We suggest you to test how many tabs you can run simultaneously before creating too many schedules.<br>Usually, with 4 or 5 it will run smoothly.</li></ul>`;
            html += `</li>`;
            html += '<li>Almost all sites in the list require an external hCaptcha solver or similar scripts/extensions. You can find our free suggestions in Settings > Other requirements...</li>';
            html += '<li>Stormgain requires a GeeTest solver. You can use <a href="https://greasyfork.org/en/scripts/444560" target="_blank">this script</a> to solve the captchas through 2Captcha API service.</li>';
            html += `<li>Some sites pay directly to <a href="https://faucetpay.io/?r=freebtc" target="_blank"><i class="fa fa-external-link-alt"></i> FaucetPay</a>. You need to add your FP addresses at <i>Settings > Wallet...</i> to claim from those sites.</li>`;
            html += `<li>You can set default configurations at <i>Settings > Defaults...</i></li>`;
            html += `<li>At <i>Settings > Defaults</i>, you will also find <i>Site Specific</i> settings like credentials for auto login.</li>`;
            html += '<li>You can override configurations for a specific site using the edit (<i class="fa fa-clock"></i>) buttons</li>';
            html += '<li>When enabling a new site, try it first with the tab on focus, to detect potential issues</li>';
            html += '</ul>';
            html += '    </div>';
            html += '<div class="modal-footer">';
            html += '<a class="btn m-2 anchor btn-outline-warning align-middle" data-dismiss="modal"><i class="fa fa-edit"></i> Close</a></div>';
            html += '   </div>';

            html += '<div class="modal-content bg-beige" id="modal-schedules">';
            html += '    <div class="modal-header py-2"><h5 class="modal-title"><i class="fa fa-stopwatch"></i> Schedules</h5>';
            html += '        <div class="ml-auto"><button type="button" class="btn btn-default btn-sm action-schedule-add">';
            html += '            <i class="fa fa-plus"></i> Add Schedule';
            html += '        </button></div>';
            html += '    </div>';
            html += '    <div class="modal-body">';
            html += '<div class="callout callout-warning m-0"><p class="text-justify">Each schedule opens sites in a new/different tab.<br>Colors must be unique.</p></div>';
            html += '    <table class="table">';
            html += '        <thead>';
            html += '        <tr><th></th><th class="text-center" width="35%">Color</th><th class="text-center">Name</th><th></th></tr>';
            html += '        </thead>';
            html += '        <tbody class="tableSortable">';
            html += '        </tbody>';
            html += '    </table>';
            html += '    </div>';
            html += '    <div class="modal-footer">';
            html += '    <a class="btn m-2 anchor btn-outline-danger align-middle" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
            html += '    <a class="btn m-2 anchor btn-outline-success align-middle modal-save" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a>';
            html += '    </div>';
            html += '</div>';

            html += '<div class="modal-content bg-beige" id="modal-assign-schedule">';
            html += '    <div class="modal-header py-2"><h5 class="modal-title"><i class="fa fa-exchange-alt"></i> Move to...</h5>';
            html += '    </div>';
            html += '    <div class="modal-body">';
            html += '      <div class="form-container">';
            html += '       <input type="hidden" name="site_id" value="not_set">';
            html += '       <input type="hidden" name="original_schedule_id" value="not_set">';
            html += '       <label class="control-label">Schedule</label>';
            html += '       <select class="form-control" name="schedule">';
            html += '       </select>';
            html += '      </div>';
            html += '    </div>';
            html += '    <div class="modal-footer">';
            html += '    <a class="btn m-2 anchor btn-outline-danger align-middle" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
            html += '    <a class="btn m-2 anchor btn-outline-success align-middle modal-save" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a>';
            html += '    </div>';
            html += '</div>';

            html += '<div class="modal-content bg-beige" id="modal-add-site">';
            html += '    <div class="modal-header py-2"><h5 class="modal-title"><i class="fa fa-code"></i> Add Site...</h5>';
            html += '    </div>';
            html += '    <div class="modal-body">';
            html += '      <div class="form-container">';
            html += uiRenderer.addInputTextHtml({ required: true, name: 'site_name', value: '', text: 'Display name'});
            html += uiRenderer.addInputTextHtml({ required: true, name: 'site_url', value: '', text: 'Url to open', placeholder: 'Example: https://freebitcoin.io/free' });
            html += '       <label class="control-label">Schedule</label>';
            html += '       <select class="form-control" name="schedule">';
            html += '       </select>';
            html += '      </div>';
            html += '    </div>';
            html += '    <div class="modal-footer">';
            html += '    <a class="btn m-2 anchor btn-outline-danger align-middle" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
            html += '    <a class="btn m-2 anchor btn-outline-success align-middle modal-save" data-dismiss="modal"><i class="fa fa-check-circle"></i> Save</a>';
            html += '    </div>';
            html += '</div>';

            html += '<div class="modal-content bg-beige" id="modal-site-parameters">';
            html += '    <div class="modal-header py-2"><h5 class="modal-title"><i class="fa fa-edit"></i> Edit Site Arguments...</h5>';
            html += '    </div>';
            html += '    <div class="modal-body">';
            html += '      <div class="form-container"><form action="">';
            html += `      <div>Soon you'll be able to edit the site's specific settings here (credentials, withdrawal configuration, etc.)<br>`;
            html += `You'll also see the site specific requirements, like required captcha solvers.<br>Meanwhile, go to Settings > Defaults > Site Specifics.<br>If there's something to configurate for this site, it'll be listed there.`;
            html += `<br>You can find a general requirements list in Settings > Other requirements...</div>`;
            html += '      </form></div>';
            html += '    </div>';
            html += '    <div class="modal-footer">';
            html += '    <a class="btn m-2 anchor btn-outline-danger align-middle" data-dismiss="modal"><i class="fa fa-times-circle"></i> Close</a>';
            html += '    </div>';
            html += '</div>';

            html += '  <div class="modal-content bg-beige d-none" id="modal-slAlert">';
            html += '   <div class="modal-header"><h5 class="modal-title">Attention</h5></div>';
            html += '    <div class="modal-body">';
            html += '     <div class="alert alert-warning">You will be redirected to a shortlink, and after completing it the new Twitter Daily Promo Code will be added to your table.<br>';
            html += 'This is an optional contribution. You can still get the code the old fashion way.</div>';
            html += uiRenderer.addLegacySliderHtml('id', 'hideShortlinkAlerts', `Stop warning me before a shortlink`);
            html += '   </div>';
            html += '<div class="modal-footer"><a class="btn m-2 anchor btn-outline-danger align-middle" onclick="modalCancel(\'slAlert\')" data-dismiss="modal"><i class="fa fa-times-circle"></i> Cancel</a>';
            html += '<a class="btn m-2 anchor btn-outline-success align-middle" onclick="modalSave(\'slAlert\')" data-dismiss="modal"><i class="fa fa-external-link-alt"></i> Lets Go!</a></div>';
            html += '   </div>';

            html += '  <div class="modal-content bg-beige d-none" id="modal-site">';
            html += '    <div class="modal-header"><h5 class="modal-title"><i class="fa fa-clock"></i> <span id="faucet-name" data-id=""></span> Schedule Parameters</h5></div>';
            html += '    <div class="modal-body">';
            html += '     <div class="alert alert-warning">Override Settings for the selected faucet.<br>Faucet-specific configurations will be moved here soon.</div>';
            html += '     <div class="row">';

            html += '     <div class="col-md-12 col-sm-12">';
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.workInBackground.override', 'Override Work Mode'),
                body: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.workInBackground', 'Open tab in background')
            });
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.nextRun.override', 'Override Next Run'),
                body: `<div>${uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.nextRun.useCountdown', 'Use faucet countdown when possible')}</div>` +
                `<label class="control-label">Otherwise wait:</label>` +
                addRandomBetween({ name: 'data-site-prop', value: 'defaults.nextRun' }, { name: 'data-site-prop', value: 'defaults.nextRun.min' }, { name: 'data-site-prop', value: 'defaults.nextRun.max' })
            });
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.sleepMode.override', 'Override Sleep Mode'),
                body: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.sleepMode', 'Sleep mode') +
                `<table><tr><td>Don't claim between </td><td><input type="time" data-original="" data-site-prop="defaults.sleepMode.min" class="form-control"></td><td>and</td>
              <td><input type="time" data-original="" data-site-prop="defaults.sleepMode.max" class="form-control"></td></tr></table>`
            });
            html += '         <div class="card m-1"><div class="card-header">Timeout</div>';
            html += '           <div class="card-body px-4">';
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.timeout.override', 'Override Timeout'),
                body: `<table><tr><td>After</td><td><input type="number" data-original="" data-site-prop="defaults.timeout" min="2" value="5" step="1" class="form-control"></td><td>minutes</td></tr></table>`
            });
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-site-prop', 'defaults.postponeMinutes.override', 'Override Postpone'),
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

            html += '<div class="modal-content bg-beige d-none" id="modal-config">';
            html += '  <div class="modal-header"><h5 class="modal-title"><i class="fa fa-cog"></i> Settings</h5></div>';
            html += '  <div class="modal-body">';
            html += '     <div class="row">';

            html += '     <div class="col-md-12 col-sm-12">';
            html += '         <div class="card card-info m-1"><div class="card-header">Defaults<div class="card-tools"><button type="button" class="btn btn-white btn-sm" data-card-widget="collapse" title="Collapse"><i class="fas fa-minus"></i></button></div></div>';
            html += '           <div class="card-body px-4">';
            html += `<div>${uiRenderer.addLegacySliderHtml('data-prop', 'defaults.workInBackground', 'Open tabs in background')}</div>`;
            html += `<div>${uiRenderer.addLegacySliderHtml('data-prop', 'defaults.extraInterval', 'Use extra timer to detect ad redirects faster')}</div>`;

            html += addCardHtml({
                header: 'Next Run',
                body: `<div>${uiRenderer.addLegacySliderHtml('data-prop', 'defaults.nextRun.useCountdown', 'Use faucet countdown when possible')}</div>` +
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
                body: `<div>${uiRenderer.addLegacySliderHtml('data-prop', 'devlog.enabled', 'Store log (enables the \'Log\' button)')}</div>` +
                `<table><tr><td>Max log size in lines:</td><td><input type="number" data-original="" data-prop="devlog.maxLines" min="100" step="100" class="form-control"></td></tr></table>`
            });
            html += addCardHtml({
                header: uiRenderer.addLegacySliderHtml('data-prop', 'defaults.sleepMode', 'Sleep mode'),
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
            html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.rollOnce" ><span class="slider round"></span></label> Roll once per round </div>';
            html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.usePromoCodes" ><span class="slider round"></span></label> Try to use promo codes every day (disable it if you are facing too many captcha timeouts) </div>';
            html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.tryGetCodes" ><span class="slider round"></span></label> Auto update promo codes </div>';
            html += '          <div><label class="switch"><input type="checkbox" data-prop="cf.autologin" ><span class="slider round"></span></label> Autologin when necessary</div>';
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

            html += '</div>';
            html += '</div>';

            html += '<section id="table-struct" class="fragment "><div class="container-fluid "><div class="py-1 "><div class="row mx-0 justify-content-center">';
            html += '<a class="btn m-2 anchor btn-outline-danger align-middle" data-toggle="modal" data-target="#confirmable-modal" onclick="confirmable.open(\'forceStopFaucet\', \'Running faucet will be disabled and the manager will reload.\')"><i class="fa fa-stop-circle"></i>Force Stop</a>';
            html += '</div>';

            html += '<div class="card">';

            html += '<div class="card-header">';
            html += '<div class="d-flex p-0">';

            html += '<div id="schedules-toggler" class="btn-group btn-group-toggle" data-toggle="buttons">';

            html += '</div>';

            html += '<div class="card-tools ml-auto mt-2 mr-1">';
            html += '<input type="checkbox" data-toggle="switch" data-label-text="Log" title="Show/Hide Log" id="bss-log" checked>';

            html += `<button type="button" class="btn btn-flat btn-sm btn-outline-primary mx-1 dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog"></i> Settings</button>
            <div class="dropdown-menu text-sm dropdown-settings-menu" style="">
            <a class="dropdown-item btn-open-dialog" data-target="modal-config"><i class="fa fa-cog"></i>&nbsp;Defaults...</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item btn-open-dialog" data-target="modal-schedules"><i class="fa fa-stopwatch"></i>&nbsp;Schedules...</a>
            <a class="dropdown-item btn-open-dialog" data-target="modal-wallet"><i class="fa fa-wallet"></i>&nbsp;Wallets...</a>
            <a class="dropdown-item btn-open-dialog" data-target="modal-requirements"><i class="fa fa-exclamation-circle"></i>&nbsp;Other requirements...</a>
            <!-- <a class="dropdown-item btn-open-dialog" data-target="modal-sites"><i class="fa fa-window-restore"></i>&nbsp;Sites...</a> -->
            <div class="dropdown-divider"></div>
            <a class="dropdown-item btn-open-dialog" data-target="modal-info"><i class="fa fa-info"></i>&nbsp;Help/Info...</a>
            </div>`;

            html += '<button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>';
            html += '<button type="button" class="btn btn-tool mx-1" data-card-widget="maximize"><i class="fas fa-expand"></i></button>';
            html += '</div></div>';
            html += '<div id="wait-times" class="row mx-0 p-0 justify-content-center"></div>';
            html += '</div>';

            html += '<div class="card-body table-responsive p-0" style="height: 400px;" id="schedule-container">';
            html += '<pre class="collapse show" id="console-log"><b>Loading...</b></pre>';
            html += '</div>';

            html += '</div>';

            html += '</div>';
            html += '<span id="update-data" style="display:none;"></span></section>';
            html += '<section id="table-struct-promo" class="fragment "><div class="container-fluid "><div class="py-1 ">';

            html += '<div class="card"><div class="card-header"><h3 class="card-title font-weight-bold">Promo Codes</h3><span id="promo-code-new" style="display:none;"></span>';
            html += '<div class="card-tools">';

            html += '<div class="input-group input-group-sm btn-tool">';
            html += '<input id="promo-text-input" type="text" name="table_search" class="form-control float-right" placeholder="CF Promo Code..." style="width:130px;">';
            html += '<input type="checkbox" data-toggle="switch" title="Check if the code can be reused every 24hs" id="promo-daily" data-on-text="Daily" data-off-text="1 Time">';
            html += '<div class="input-group-append"><button type="submit" class="btn btn-default" id="promo-button""><i class="fas fa-plus"></i> Add</button></div>';
            html += '<div class="input-group-append"><button type="submit" class="btn btn-default btn-outline-danger mx-1" data-toggle="modal" data-target="#confirmable-modal" onclick="confirmable.open(\'removeAllPromos\', \'All promo codes will be removed.\')"><i class="fas fa-times-circle"></i> Remove All</button></div>';
            html += '<div class="input-group-append"><button type="submit" class="btn btn-default btn-outline-primary" id="button-try-get-codes"><i class="fas fa-bolt"></i> Try to Get Codes</button></div>';
            html += '<div class="input-group-append"><button type="button" class="btn btn-tool btn-sm mx-1" data-card-widget="collapse" title="Collapse"><i class="fas fa-minus"></i></button></div>';
            html += '<div class="input-group-append"><button type="button" class="btn btn-tool btn-sm mx-1" data-card-widget="maximize" title="Maximize"><i class="fas fa-expand"></i></button></div>';
            html += '</div>';
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

            let target = document.getElementById('referral-table');
            target.parentNode.insertBefore(wrapper, target);
            document.getElementById('schedule-container').appendChild( createScheduleTable() );

            if (document.querySelector('.main-header .navbar-nav.ml-auto')) {
                let discord = document.createElement('li');
                discord.classList.add('nav-item');
                discord.innerHTML = '<a class="btn btn-primary btn-sm m-1" href="https://discord.gg/gaYYBjJUhP" target="_blank"><div class=""><span class="badge badge-pill badge-warning mr-2" title="">(new)</span>discord</div></a>';
                document.querySelector('.main-header .navbar-nav.ml-auto').prepend(discord);
            } else {
                let discord = document.createElement('div');
                discord.innerHTML = '<a class="btn m-2 btn-primary" href="https://discord.gg/gaYYBjJUhP" target="_blank"><div class=""><span class="badge badge-pill badge-warning mr-2" title="">(new)</span>discord</div></a>';
                document.querySelector('.navbar-nav').prepend(discord);
            }
            addHtml({
                target: '#modal-dlg .modal-dialog',
                where: 'afterbegin',
                content: `<div class="modal-content bg-beige d-none" id="modal-requirements">
    <div class="modal-header"><h5 class="modal-title"><i class="fa fa-exclamation-circle"></i> Other requirements</h5></div>
    <div class="modal-body">
        <div class="callout callout-warning m-3">
            <p class="text-justify">Some sites might require specific tools like captcha solvers that are not including in the script.</p>
        </div>
        <div>
            <table class="table custom-table-striped" id="requirements-table">
                <thead><tr><th class="">Name</th><th class="">Description</th><th class="">Suggestion</th></tr></thead>
                <tbody class="overflow-auto" id="requirements-table-body">
                </tbody>
            </table>
        </div>
    </div>
    <div class="modal-footer">
        <a class="btn m-2 anchor btn-outline-danger align-middle" data-dismiss="modal"><i class="fa fa-times-circle"></i> Close</a>
    </div>
</div>`
            });
            addTemplateTag({
                id: 'tpl-requirement-row',
                content: `<tr><td>{name}</td><td>{description}</td><td>{suggestion}</td></tr>`
            });
            const tempRequirementsList = [
                { id: '1', name: 'HCaptcha Solver', description: 'A solver for HCaptcha challenges', suggestion: `Latest github version of hektCaptcha extension (free)<br><a href="https://bit.ly/3Y24vg5" target="_blank"><i class="fa fa-external-link-alt"></i> Visit</a>` },
                { id: '2', name: 'Recaptcha Solver', description: 'A solver for ReCaptcha challenges', suggestion: `Latest github version of hektCaptcha extension (free)<br><a href="https://bit.ly/3Y24vg5" target="_blank"><i class="fa fa-external-link-alt"></i> Visit</a>` },
                { id: '3', name: 'Cloudflare Challenge Bypass', description: 'A solver for Cloudflare/Turnstile challenges', suggestion: `Auto clicker user script (free)<br><a  href="https://sharetext.me/knpmyolewq" target="_blank"><i class="fa fa-external-link-alt"></i> Visit</a>` },
                { id: '6', name: 'Active Tab/Window', description: 'The site requires the tab to be active. A good option is Tab Revolver Extension, which will loop the tabs opened in a specific window.', suggestion: `<a  href="https://bit.ly/3Y28lpA" target="_blank"><i class="fa fa-external-link-alt"></i> User Script</a> or <a href="https://bit.ly/3q0H4Ht" target="_blank"><i class="fa fa-external-link-alt"></i> Extension</a>` },
            ];
            for(let r=0; r< tempRequirementsList.length; r++) {
                let req = tempRequirementsList[r];
                useTemplate({
                    templateId: 'tpl-requirement-row',
                    target: '#requirements-table-body',
                    where: 'afterbegin',
                    replacements: req
                });
            }
        };
        function createPromoTable(faucets) {
            let table = document.createElement('table');
            let inner = '';
            table.classList.add('table', 'custom-table-striped');
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
            table.classList.add('table', 'custom-table-striped', 'table-head-fixed', 'text-nowrap');
            table.setAttribute('id','schedule-table');

            inner = '<thead><tr>';
            inner += '<th scope="col" class="edit-status d-none em-only" style="">Active</th><th class="">Next Roll</th><th class=""></th><th class="">Name</th><th class="text-center">Last Claim</th>';
            inner += '<th class="text-center">Aggregate</th><th class="text-center">Balance</th><th class="text-center em-hide" id="converted-balance-col">FIAT</th>';
            inner += '<th scope="col" class="text-center em-hide">Msgs</th>';
            inner += '<th scope="col" class="" style="">';
            inner += `<div class="btn-group btn-group-sm">
            <button type="button" data-toggle="tooltip" title="Add site..." class="btn btn-default action-add-external-site em-hide">
                <i class="fa fa-plus"></i>
            </button>
            <button type="button" title="Cancel" class="btn btn-danger action-edit-all-sites-cancel em-only d-none"><i class="fa fa-times-circle"></i> Cancel</button>
            <button type="button" title="Save" class="btn btn-success action-edit-all-sites-save em-only d-none"><i class="fa fa-check-circle"></i> Save</button>
            <button type="button" data-toggle="tooltip" title="Edit all..." class="btn btn-default action-edit-all-sites em-hide"><i class="fa fa-toggle-off"></i></button>
            </div>`;
            inner += '</th></tr></thead><tbody id="schedule-table-body"></tbody>';
            table.innerHTML = inner;

            return table;
        };
        function renderLogRow(data) {
            let tr = document.createElement('tr');
            tr.dataset.schedule = data.schedule;
            tr.dataset.ts = data.ts.getTime();
            tr.dataset.siteName = data.siteName || '';
            tr.dataset.elapsed = data.elapsed || '';
            let color = data.schedule ? `#${data.schedule}` : `transparent`;
            let showIt = !data.schedule || !uiRenderer.schedules.selectedSchedule 
                        || uiRenderer.schedules.selectedSchedule == 'all' || uiRenderer.schedules.selectedSchedule == data.schedule;
            if (!showIt) {
                tr.classList.add('d-none');
            }

            let tds = '';
            tds += `<td>${helpers.getPrintableTime(data.ts)}</td>`;
            tds += `<td><i class="fas fa-square pr-1" style="color: ${color};"></i></td>`;
            if (data.elapsed) {
                tds += `<td>${data.msg} [Elapsed time: ${data.elapsed} seconds]</td>`;
            } else {
                tds += `<td>${data.msg}</td>`;
            }
            tr.innerHTML = tds;

            document.querySelector('#console-log table').appendChild(tr);
        };
        function log(data) {
            if (!data || !data.msg) {
                console.warn(`Log attempt without data or msg!`, data);
                return;
            }
            data.ts = new Date();
            data.schedule = data.schedule || false;
            data.siteName = data.siteName || false;
            data.elapsed = data.elapsed || false;

            if(shared.getConfig()['devlog.enabled']) {
                if (data.schedule) {
                } else {
                }
            };

            if (data.elapsed) {
                let previous = logLines.find(x => x.msg == data.msg && x.schedule == data.schedule);
                if (previous) {
                    previous.elapsed = data.elapsed;
                    previous.ts = data.ts;
                    logLines.sort( (a, b) => b.ts.getTime() - a.ts.getTime());
                } else {
                    logLines.unshift(data);
                }
            } else {
                logLines.unshift(data);
            }
            while(logLines.length > 30) {
                logLines.pop();
            }

            document.querySelector('#console-log table').innerHTML = '';
            logLines.forEach(r => renderLogRow(r));
        };
        function legacyLog(data, elapsed = false) {
            if (!data || !data.msg) {
                return;
            }
            elapsed = data.elapsed || false;
            let msg = data.msg;
            if (data.schedule) {
                msg = `[${data.schedule}] ${data.msg}`;
            }

            if(shared.getConfig()['devlog.enabled']) { shared.devlog(msg, elapsed) };
            if(msg) {
                let waitingIdx = logLines.findIndex(line => {
                    let waitingMsg= line.split('&nbsp')[1];
                    if (waitingMsg == msg) {
                        return true;
                    }
                });

                let previous = waitingIdx > -1 ? logLines[waitingIdx].split('&nbsp')[1] : '';
                if (elapsed && (previous == msg)) {
                    logLines[waitingIdx] = helpers.getPrintableTime() + '&nbsp' + msg + '&nbsp[Elapsed time:&nbsp' + elapsed + '&nbspseconds]';
                } else {
                    while(logLines.length > 20) {
                        logLines.pop();
                    }
                    logLines.unshift(helpers.getPrintableTime() + '&nbsp' + msg);
                }

                document.getElementById('console-log').innerHTML = logLines.map(x => {
                    const regex = /\[([0-9a-fA-F]+)\]/;
                    const match = regex.exec(x);
                    let colorNumber = null;
                    if (match !== null) {
                      colorNumber = match[1];
                    }

                    let showIt = !colorNumber || !window.selectedSchedule || window.selectedSchedule == 'all' || window.selectedSchedule == colorNumber;

                    const formattedMsg = x.replace(/\[([0-9a-fA-F]+)\]/, '<i class="fas fa-square pr-1" style="color: #$1;"></i>');

                    let line = `<span data-schedule="${colorNumber ? colorNumber : ''}" class="${showIt ? '' : 'd-none'}">${formattedMsg}</span>`;
                    return line;
                }).join('');
            }
        };
        return {
            init: init,
            log: log
        }
    }

    async function init() {
        eventer = new EventEmitter();
        persistence = new Persistence();
        shared = objectGenerator.createShared();
        useTimer = shared.getConfig()['defaults.extraInterval'];
        if (location.href.startsWith('https://criptologico.com/tools/cc')) {
            landing = window.location.host;
            instance = K.LOCATION.MANAGER;
            manager = createManager();
            CFPromotions = objectGenerator.createCFPromotions();
            uiRenderer = new UiRenderer();
            uiRenderer.initialize();
            ui = createUi();
            CFHistory = objectGenerator.createCFHistory();

            await manager.start();
            try {
                if (!document.body.classList.contains('sidebar-collapse')) document.querySelector('a[data-widget="pushmenu"]').click()
            } catch {}
            setTimeout( () => { window.stop(); }, 10000);
        } else {
            instance = K.LOCATION.UNKNOWN;
            detectWeb();
        }
    }
    init();
})();