// ==UserScript== 
// @name         Popup Blocker Script
// @name:zh-CN   弹窗阻止程序脚本
// @namespace    https://popupblockerscript.com/
// @version      0.6
// @description  The most efficient user script for blocking popups of all types. Designed to fight the sneakiest popups including the ones on adult and streaming websites.
// @description:zh-CN 用于阻止所有类型弹窗的最有效用户脚本。为防范最狡猾的弹窗而设计，包括成人和流媒体网站上的弹窗。
// @author       Mike Kyshenko
// @match        https://*/*
// @match        http://*/*
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @connect     re.popupblockerscript.com
// @connect     self
// @connect     *
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418443/Popup%20Blocker%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/418443/Popup%20Blocker%20Script.meta.js
// ==/UserScript==
const LANG = {
    EN: {
        "notificationMessage": {
            "message": "Popup Blocked"
        },
        "overlayWasBlocked": {
            "message": "Overlay Blocked"
        },
        "allowOnce": {
            "message": "Show popup once"
        },
        "allowAlways": {
            "message": "Whitelist this site"
        },
        "NTF_allowOverlayOnce": {
            "message": "Allow overlay once"
        }
    },

    "CN":{
        "notificationMessage": {
            "message": "弹窗被阻止"
        },
        "overlayWasBlocked": {
            "message": "叠加弹窗被阻止"
        },
        "allowOnce": {
            "message": "显示一次弹窗"
        },
        "allowAlways": {
            "message": "允许此网站上的弹窗"
        },
        "NTF_allowOverlayOnce": {
            "message": "显示一次弹窗"
        }
    }
  };
  !function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
        module.l = !0, module.exports;
    }
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 1);
}([ function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_exports__.a = {
        defaultWhiteList: [ "engage.wixapps.net", "linkedin.com", "google", "www.gmail.com", "www.pinterest.com", "www.youtube.com", "www.facebook.com", "search.yahoo.com", "chrome://newtab", "www.food.com" ],
        defaultBlackList: [ "adrunnr", "successforyu.clickfunnels.com", "fmovies.se", "in-365-tagen.info", "5000-settimanale.com", "shop.mazzugioielli.com", "maxigossip.com", "lp.yazizim.com", "beyourxfriend.com", "99tab.com", "zzqrt.com", "canuck-method.net", "bewomenly.com", "playnow.guru", "datingforyou-48e1.kxcdn.com", "trafficnetworkads24.com", "sistemadedinerogratis.com", "canuckmethodprofit.co", "consumerresearchnetwork.com", "securemacfix.com", "zz3d3.ru", "zd1.quebec-bin.com", "hot-games4you.xyz", "om.elvenar.com", "superpccleanup.com", "gomediaz.com", "judithi.xyz", "free.atozmanuals.com", "yoursuccess.ravpage.co.il", "123hop.ir", "quizcliente.pw", "aussiemethod.biz", "hlpnowp-c.com", "picbumper.com", "shaneless.com", "anacondamonster.com", "altrk1.com", "health.todaydiets.com", "download.weatherblink.com", "happyluketh.com", "go.ameinfo.com", "50kaweek.net", "thepornsurvey.com", "ofsiite.ru", "fulltab.com", "1000spins.com", "time2play-online.net", "vintacars.com", "welcome.pussysaga.com", "free-desktop-games.com", "download.televisionfanatic.com", "theprofitsmaker.net", "sgad.info", "algocashmaster.net", "sunmaker.com", "topvipdreams.com", "watchmygirlfriend.gfpornvideos.com", "filesharefanatic.com", "safedownloadhub.com", "7awlalalam.blogspot.com", "tvplusnewtab.com", "trendingpatrol.com", "moneymorning.com", "ifileyou.com", "classifiedcanada.ca", "firefan.com", "methode-binaire.com", "letmetell.com", "kenduktur.com", "getafuk.com", "yotraleplahnte.ru", "jackpot.88beto.com", "pwwysydh.com", "search.queryrouter.com", "v.lvztxy.com", "pussysaga.com", "saffamethod.com", "prezzonline.com", "searchprivacy.website", "3d2819216eb4e1035879-7c248de0c99745406e9b749fc86ec3e4.ssl.cf1.rackcdn.com", "only2date.com", "mysagagame.com", "themillionaireinpjs.net", "wlt.kd2244.com", "quickprivacycheck.com", "hotchatdate.com", "autotraderbot.com", "z1.zedo.com", "youlucky2014.com", "traffic.getmyads.com", "appcloudprotected.com", "safensecure.com-allsites3.xyz", "newpoptab.com", "static.williamhill.com", "myhealthyblog.co", "greatestmobideals.com", "sweetclarity.com", "mgid.com", "securepccure.com", "autopengebygger.com", "am15.net", "es.reimageplus.com", "o2.promos-info.com", "it.reimageplus.com", "westsluts.com", "spinandwin.com-ser.pw", "reimageplus.com", "vodafone.promos-info.com", "vinnmatpengar.se", "movie.ienjoyapps.com", "love4single.com", "origin.getprice.com.au", "ohmydating.com", "lp.want-to-win.com", "yabuletchrome.ru", "bamdad.net", "gotositenow.com", "vcrypt.pw", "newtabtv.com", "mon.setsu.xyz", "youforgottorenewyourhosting.com", "zone-telechargement.ws", "land.pckeeper.software", "ad.adpop-1.com", "advancedpctools.com", "videos.randolphcountyheraldtribune.com", "web-start.org", "softreadynow.installupgradenowfreshandforyou.website", "uplod.ws", "pornhubcasino.com", "maxbet.ro", "2016prizefeed.com", "thevideo.me", "wantubad.com", "tavanero.com", "xcusmy.club", "daclips.in", "gaymenofporn.online", "jackpotcitycasino.com", "italian-method.com", "getsearchincognito.com", "youjustwonprize.com", "finanz-nachrichten.me", "quizcliente.site", "da.reimageplus.com", "jkanime.net", "britmoneymethod.com", "uae.souq.com", "ka.azzer.net", "safensecure.xyz", "8t.hootingrhejkz.online", "www6.blinkx.com", "wizzcaster.com", "comparaison-prix.com", "vodlocker.lol", "fr.reimageplus.com", "free.fromdoctopdf.com", "userscloud.com", "myprivatesearch.com", "fanli90.cn", "tutticodicisconto.it", "mediadec.com", "gogamego.thewhizproducts.com", "download.weatherblink.com", "free.videodownloadconverter.com", "we-are-gamers.com", "sesso.communityadult.net", "lp.blpmovies.com", "search.queryrouter.com", "bbb-johannesburg.localspecific.com", "lp.blpmovies.com", "go.ppixelm.com", "r0.ru", "sesso.communityadult.net", "bbb-johannesburg.localspecific.com", "ppixelm.com", "cyberguardianspe.info", "we-are-gamers.com", "loginfaster.com/new", "www.alfacart.com", "www.foresee.com", "mobile-win.com", "www.plusnetwork.com", "www.amicafarmacia.com", "www.ienjoyapps.com", "cheapcheap.io", "screenaddict.thewhizproducts.com", "nova.rambler.ru", "free.gamingwonderland.com", "p9328ujeiw1.ru", "mobilecasinoclub.co.uk", "pfhsystem.com", "regtuneup.com", "theprofitsmaker.net", "bodogpromotions.eu", "heroesreplay.org", "financialsecrets.info", "mymoneymakingapp.com", "sunmaker.com", "888casino-promotions.com", "vogliosesso.com", "scienceremix.com", "allinonedocs.com", "arabia.starzplay.com", "allirishcasino.com", "advancepctools.info", "movie.ienjoyapps.com", "surveyform001.s3-website-us-east-1.amazonaws.com", "mgs188.com", "pfhsystem.com", "lpeva.com", "ddsh8.com", "theprofitsmaker.net", "b2.ijquery11.com", "sporthero.thewhizmarketing.com", "securefastmac.tech", "seen-on-screen.thewhizmarketing.com", "1000spins.com", "search.queryrouter.com", "pfhsystem.com", "reimageplus.com", "offer.alibaba.com", "searchlistings.org", "search.queryrouter.com", "search.queryrouter.com", "mybinaryoptionsrobot.com", "duplicashapp.com", "search.queryrouter.com", "bestgame.directory", "droidclub.net", ".rivalo.com", "yoursuperprize.com", "mediaexplained.com", "om.elvenar.com", "shinar.club", "revitoleczemacream.com", "freelotto.com", "screenaddict.thewhizproducts.com", "download.bringmesports.com/", "allinonedocs.com", "driver-fixer.com", "arabydeal.com", "cleanyourcomputertoday.com", "arabydeal.com", "music.mixplugin.com", "1se.info", "survey12.com", "freesoftwaredlul.com", "pldist01.com", "ad.adpop-1.com", "searchanonymous.net", "abrst.pro", "muzikfury.thewhizmarketing.com", "lp.mbtrx.com", "th1.forfun.maxisize-pro.com", "watchmygirlfriend.gfpornbox.com", "new.freelotto.com", "desktoptrack.com", "search.queryrouter.com", "offer.alibaba.com", "1000spins.com", "promotions.coral.co.uk", "search.queryrouter.com", "tbsia.com", "tbsia.com", "multtaepyo.com", "search.queryrouter.com", "czechmethod.com", "consumerview.co", "wayretail.com", "72onbase.com", "funsafetab.com", "search.queryrouter.com", "speedyfiledownload.com", "driver-fixer.com", "arabydeal.com", "cleanyourcomputertoday.com", "arabydeal.com", "music.mixplugin.com", "1se.info", "survey12.com", "freesoftwaredlul.com", "pldist01.com", "ad.adpop-1.com", "searchanonymous.net", "abrst.pro", "muzikfury.thewhizmarketing.com", "lp.mbtrx.com", "th1.forfun.maxisize-pro.com", "watchmygirlfriend.gfpornbox.com", "new.freelotto.com", "desktoptrack.com", "search.queryrouter.com", "offer.alibaba.com", "1000spins.com", "promotions.coral.co.uk", "search.queryrouter.com", "tbsia.com", "tbsia.com", "surveyform001.s3-website-us-east-1.amazonaws.com", "mgs188.com", "pfhsystem.com", "lpeva.com", "ddsh8.com", "theprofitsmaker.net", "quantomcoding.com", "sporthero.thewhizmarketing.com", "popads.net", "onclkds.com", "consumerview.co", "12kotov.ru", "ruhotpair2.fingta.com", "easytelevisionaccessnow.com", "ahwrd.com", "lpeva.com", "ppgzf.com", "zjstx.com", "kituure.xyz", "join.pro-gaming-world.com", "mackeeperapp.mackeeper.com", "tracknotify.com", "2075.cdn.beyondhosting.net", "idollash.com", "ds.moviegoat.com", "fulltab.com", "rackcdn.com", "prestoris.com", "adsterra.com", "swampssovuuhusp.top", "streesusa.info", "freesoftwaredlul.com", "adreactor.com", "a-static.com", "codeonclick.com", "heheme.com", "adf.ly", "seen-on-screen.thewhizmarketing.com", "openload.co" ]
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var storage = {
        get: () => new Promise(resolve => {
            const items = [ ...arguments ];
            if (1 == items.length) resolve(GM_getValue(items[0])); else {
                const data = {};
                items.forEach(item => {
                    data[item] = GM_getValue(item);
                }), resolve(data);
            }
        }),
        set(key, value) {
            GM_setValue(key, value);
        }
    };
    class OverlayDectector {
        constructor() {
            this.winWidth = window.innerWidth, this.winHeight = window.innerHeight;
        }
        ALGO2({x: x, y: y, mw: mw, mh: mh}) {
            let overlay, element = document.elementFromPoint(x, y);
            if (element && this.notRootElement(element)) do {
                this.isOverlayish({
                    el: element,
                    minWidth: mw,
                    minHeight: mh
                }) && (overlay = element), element = element.parentNode;
            } while (!overlay && this.notRootElement(element));
            return overlay;
        }
        notRootElement(element) {
            return element != document.body && element != document && element != document.documentElement;
        }
        detectOverlayLayer(detectRange) {
            for (let coords of detectRange) {
                let overlay = this.ALGO2(coords);
                if (overlay) return this.getRecipe(overlay);
            }
            return !1;
        }
        find() {
            const detect = {
                AnySize: [ {
                    x: this.winWidth / 2,
                    y: this.winHeight / 2,
                    mw: 100,
                    mh: 100
                }, {
                    x: this.winWidth / 2,
                    y: this.winHeight / 3,
                    mw: 100,
                    mh: 100
                } ],
                FullScreen: [ {
                    x: this.winWidth / 2,
                    y: this.winHeight / 2,
                    mw: .9 * this.winHeight,
                    mh: .9 * this.winHeight
                } ]
            };
            let recipe, overlays = [];
            return (recipe = this.detectOverlayLayer(detect.AnySize)) && (overlays.push(this.hideByRecipe(recipe)),
            (recipe = this.detectOverlayLayer(detect.FullScreen)) && overlays.push(this.hideByRecipe(recipe))),
            overlays;
        }
        getRecipe(el) {
            let recipe = [];
            const isSingleInstanceInDocument = recipe => 1 == $(recipe.join(" > ")).length;
            do {
                let node = el.nodeName.toLowerCase(), id = el.getAttribute("id"), className = el.getAttribute("class"), style = el.getAttribute("style");
                if (id) {
                    recipe.unshift("#" + id.trim());
                    break;
                }
                if (className ? recipe.unshift(node + "." + className.trim().replace(/\s+/g, ".")) : recipe.unshift(node + '[style="' + style + '"]'),
                isSingleInstanceInDocument(recipe)) break;
                el = el.parentNode;
            } while (el != document.body);
            return !!isSingleInstanceInDocument(recipe) && recipe.join(" > ");
        }
        hideByRecipe(recipe) {
            let el = $(recipe), css = el.prop("style").cssText;
            return el.prop("style").cssText = `${css};display:none !important;`, {
                el: el,
                recipe: recipe,
                css: css
            };
        }
        isOverlayish({el: el, minWidth: minWidth, minHeight: minHeight}) {
            let css = window.getComputedStyle(el);
            return !!("none" != css.display && "hidden" != css.visibility && /fixed|absolute/.test(css.position) && ("auto" == css.zIndex || parseInt(css.zIndex) >= 0) && el.offsetWidth >= minWidth && el.offsetHeight >= minHeight) && [ el, 1 * css.zIndex ];
        }
    }
    var content_overlayKiller = class extends OverlayDectector {
        constructor(props = {}) {
            super(), this.activeBlockList = [], this.activeRecepiesList = [], this.onAutoDetect = props.onAutoDetect || (() => {}),
            this.onUserRemove = props.onUserRemove || (() => {}), this.onBlockListFound = props.onBlockListFound || (() => {}),
            this.onRecipeFound = props.onRecipeFound || (() => {}), this.onRecipeNotFound = props.onRecipeNotFound || (() => {}),
            this.blackListPromise = this.createBlockListFromStorage(), window == top && this.autoDetect();
        }
        hide(recepies) {
            this.last = [], recepies.forEach(recipe => {
                this.last.push(this.hideByRecipe(recipe));
            });
        }
        restore() {
            this.last.forEach(item => {
                let {el: el, recipe: recipe, css: css} = item;
                el.prop("style").cssText = css + ";display: block", [ ...$("style.pp-remove-overlay") ].forEach(style => {
                    (style = $(style)).data("recipe") == btoa(recipe) && $(style).remove();
                });
            }), window.dispatchEvent(new Event("resize"));
        }
        remove(props = {}) {
            let overlays = this.find();
            overlays.length ? (this.last = overlays, this.createGlobalCSS(), this.onUserRemove({
                success: !0,
                recepies: overlays.map(o => o.recipe),
                props: props
            })) : this.onUserRemove({
                success: !1,
                props: props
            });
        }
        addToLocalBlacklist() {
            const domain = document.domain, url = location.href;
            PBStorageSync.pb_overlayBlockedList.update((list = {}) => {
                let blocks = list[domain] || [];
                return blocks.push({
                    id: `block-${blocks.length}`,
                    url: url,
                    domain: domain,
                    recipe: this.last.map(item => item.recipe).join(", ")
                }), list[domain] = blocks, list;
            });
        }
        removeFromLocalBlacklist() {
            const domain = document.domain;
            PBStorageSync.pb_overlayBlockedList.update((list = {}) => {
                let blocks = list[domain] || [], lastRecepies = this.last.map(item => item.recipe);
                return blocks = blocks.filter(item => -1 == lastRecepies.indexOf(item.recipe)),
                list[domain] = blocks, list;
            });
        }
        autoDetect(attempt = 0) {
            if (attempt < 40) {
                let foundBlockList = this.forceBlock(this.activeBlockList), foundRecipeList = this.forceBlock(this.activeRecepiesList);
                foundBlockList.length && this.onBlockListFound({
                    found: foundBlockList
                }), foundRecipeList.length && this.onRecipeFound({
                    found: foundRecipeList
                }), setTimeout(() => {
                    this.autoDetect(++attempt);
                }, 250);
            } else this.checkRecepiesSuccess();
        }
        createBlockListFromStorage() {
            return new Promise(resolve => {
                storage.get("pb_overlayBlockedList").then((list = {}) => {
                    list[document.domain] && (this.activeBlockList = list[document.domain], this.createBlockCSS(this.activeBlockList)),
                    resolve();
                });
            });
        }
        createBlockListFromRecepies(recepies) {
            this.blackListPromise.then(() => {
                const blockList = this.activeBlockList.map(item => item.recipe);
                recepies = recepies.map(recipe => ({
                    recipe: recipe,
                    found: !1
                })).filter(item => -1 == blockList.indexOf(item.recipe)), this.activeRecepiesList = recepies,
                this.createBlockCSS(recepies);
            });
        }
        checkRecepiesSuccess() {
            const notFound = this.activeRecepiesList.filter(item => !item.found);
            notFound.length && this.onRecipeNotFound(notFound);
        }
        createGlobalCSS() {
            const htmlStyle = $("html").attr("style"), bodyStyle = $("body").attr("style");
            $('<style type="text/css">html, body {overflow:auto !important; }</style>').appendTo("head"),
            $("html").attr("style", (htmlStyle ? htmlStyle + ";" : "") + "overflow:auto !important;"),
            $("body").attr("style", (bodyStyle ? bodyStyle + ";" : "") + "overflow:auto !important;");
        }
        createBlockCSS(list) {
            this.createGlobalCSS(), list.forEach(item => {
                let css = item.recipe + " { display:none !important; }";
                $(`<style class="pp-remove-overlay" data-recipe="${btoa(item.recipe)}" type="text/css">${css}</style>`).appendTo("head");
            });
        }
        forceBlock(list) {
            let hide = [];
            return list.filter(item => !item.found).forEach(item => {
                $(item.recipe).length && (item.found = !0, hide.push(item.recipe));
            }), hide.length && this.hide(hide), hide;
        }
    };
    function inject() {
        const originalWindowOpenFn = window.open, originalCreateElementFn = document.createElement, originalAppendChildFn = HTMLElement.prototype.appendChild, originalCreateEventFn = document.createEvent, windowsWithNames = {};
        let fullScreenOpenTime, lastBlockTime, timeSinceCreateAElement = 0, lastCreatedAElement = null, winWidth = window.innerWidth, winHeight = window.innerHeight, abd = !1;
        const parentOrigin = window.location != window.parent.location ? document.referrer || window.parent.location || "*" : document.location, parentRef = window.parent;
        function newWindowOpenFn() {
            const openWndArguments = arguments;
            let useOriginalOpenWnd = !0, generatedWindow = null;
            function getWindowName(openWndArguments) {
                const windowName = openWndArguments[1];
                return null == windowName || [ "_blank", "_parent", "_self", "_top" ].includes(windowName) ? null : windowName;
            }
            let capturingElement = null, srcElement = null, closestParentLink = null;
            null != window.event && (capturingElement = window.event.currentTarget, srcElement = window.event.srcElement),
            null != srcElement && srcElement instanceof HTMLElement && (closestParentLink = srcElement.closest("a")) && closestParentLink.href && (openWndArguments[3] = closestParentLink.href);
            try {
                if (null == capturingElement) {
                    let caller = openWndArguments.callee;
                    for (;null != caller.arguments && null != caller.arguments.callee.caller; ) caller = caller.arguments.callee.caller;
                    null != caller.arguments && caller.arguments.length > 0 && null != caller.arguments[0].currentTarget && (capturingElement = caller.arguments[0].currentTarget);
                }
            } catch (e) {}
            null == capturingElement ? (window.pbreason = "Blocked a new window opened without any user interaction",
            useOriginalOpenWnd = !1) : null != capturingElement && (capturingElement instanceof Window || function() {
                try {
                    return !!(parent.Window && capturingElement instanceof parent.Window);
                } catch (e) {
                    return !1;
                }
            }() || capturingElement === document || null != capturingElement.URL && null != capturingElement.body || null != capturingElement.nodeName && ("body" == capturingElement.nodeName.toLowerCase() || "document" == capturingElement.nodeName.toLowerCase())) ? (window.pbreason = `Blocked a new window opened with URL: ${openWndArguments[0]} because it was triggered by the ${capturingElement.nodeName} element`,
            useOriginalOpenWnd = !1) : !function(el) {
                let style = el && el.style;
                return !!(style && /fixed|absolute/.test(style.position) && el.offsetWidth >= .6 * winWidth && el.offsetHeight >= .75 * winHeight);
            }(capturingElement) ? useOriginalOpenWnd = !0 : (window.pbreason = "Blocked a new window opened when clicking on an element that seems to be an overlay",
            useOriginalOpenWnd = !1);
            document.webkitFullscreenElement || document.mozFullscreenElement || document.fullscreenElement;
            (new Date().getTime() - fullScreenOpenTime < 1e3 || isNaN(fullScreenOpenTime) && (document.fullScreenElement && null !== document.fullScreenElement || null != document.mozFullscreenElement || null != document.webkitFullscreenElement)) && (window.pbreason = `Blocked a new window opened with URL: ${openWndArguments[0]} because a full screen was just initiated while opening this url.`,
            document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen(),
            useOriginalOpenWnd = !1);
            let openUrl = openWndArguments[0], inWhitelist = isInWhitelist(openUrl);
            if (inWhitelist ? useOriginalOpenWnd = !0 : isInList(openUrl, pb_blacklist) && (useOriginalOpenWnd = !1),
            1 == useOriginalOpenWnd) {
                generatedWindow = originalWindowOpenFn.apply(this, openWndArguments);
                let windowName = getWindowName(openWndArguments);
                if (null != windowName && (windowsWithNames[windowName] = generatedWindow), generatedWindow !== window) {
                    const openTime = new Date().getTime(), originalWndBlurFn = generatedWindow.blur;
                    generatedWindow.blur = (() => {
                        new Date().getTime() - openTime < 1e3 && !inWhitelist ? (window.pbreason = `Blocked a new window opened with URL: ${openWndArguments[0]} because a it was blured`,
                        generatedWindow.close(), blockedWndNotification(openWndArguments)) : originalWndBlurFn();
                    });
                }
            } else {
                const location = {
                    href: openWndArguments[0]
                };
                location.replace = (url => {
                    location.href = url;
                }), generatedWindow = {
                    close: () => !0,
                    test: () => !0,
                    blur: () => !0,
                    focus: () => !0,
                    showModelessDialog: () => !0,
                    showModalDialog: () => !0,
                    prompt: () => !0,
                    confirm: () => !0,
                    alert: () => !0,
                    moveTo: () => !0,
                    moveBy: () => !0,
                    resizeTo: () => !0,
                    resizeBy: () => !0,
                    scrollBy: () => !0,
                    scrollTo: () => !0,
                    getSelection: () => !0,
                    onunload: () => !0,
                    print: () => !0,
                    open() {
                        return this;
                    },
                    opener: window,
                    closed: !1,
                    innerHeight: 480,
                    innerWidth: 640,
                    name: openWndArguments[1],
                    location: location,
                    document: {
                        location: location
                    }
                }, function(src, dest) {
                    let prop;
                    for (prop in src) try {
                        void 0 === dest[prop] && src[prop] && (dest[prop] = src[prop]);
                    } catch (e) {}
                }(window, generatedWindow), generatedWindow.window = generatedWindow;
                let windowName = getWindowName(openWndArguments);
                if (null != windowName) try {
                    windowsWithNames[windowName].close();
                } catch (err) {}
                let fnGetUrl = function() {
                    let url;
                    url = generatedWindow.location instanceof Object ? generatedWindow.document.location instanceof Object ? null != location.href ? location.href : openWndArguments[0] : generatedWindow.document.location : generatedWindow.location,
                    openWndArguments[0] = url, blockedWndNotification(openWndArguments);
                };
                top == self ? setTimeout(fnGetUrl, 100) : fnGetUrl();
            }
            return generatedWindow;
        }
        function onFullScreen(isInFullScreenMode) {
            fullScreenOpenTime = isInFullScreenMode ? new Date().getTime() : NaN;
        }
        function isInWhitelist(url) {
            return isInList(url, pb_whitelist);
        }
        function isInList(url, list) {
            return !!list && list.some(li => new RegExp("https?://(www.|.*.)?" + li + "+").test(url));
        }
        function blockedWndNotification(openWndArguments) {
            var baseURL;
            (!lastBlockTime || lastBlockTime < Date.now() - 1e3) && (openWndArguments[0] = (baseURL = openWndArguments[0],
            /^about:blank/i.test(baseURL) ? baseURL : /^(https?:)?\/\//.test(baseURL) ? baseURL : baseURL = location.origin + (/^\//.test(baseURL) ? "" : "/") + baseURL),
            openWndArguments.abd = abd, parentRef.postMessage({
                type: "blockedWindow",
                args: JSON.stringify(openWndArguments)
            }, parentOrigin)), lastBlockTime = Date.now();
        }
        window.open = function() {
            try {
                return newWindowOpenFn.apply(this, arguments);
            } catch (err) {
                return null;
            }
        }, HTMLElement.prototype.appendChild = function() {
            const newElement = originalAppendChildFn.apply(this, arguments);
            if ("IFRAME" == newElement.nodeName && newElement.contentWindow) try {
                let code = `(function () {\n          var pb_blacklist = ${JSON.stringify(pb_blacklist)};\n          var pb_whitelist = ${JSON.stringify(pb_whitelist)};\n          ${inject.toString()};\n          inject();\n        })();`, s = document.createElement("script");
                s.text = code, newElement.contentWindow.document.body.appendChild(s);
            } catch (e) {}
            return newElement;
        }, document.createElement = function() {
            const newElement = originalCreateElementFn.apply(document, arguments);
            if ("a" == arguments[0] || "A" == arguments[0]) {
                timeSinceCreateAElement = new Date().getTime();
                const originalDispatchEventFn = newElement.dispatchEvent;
                newElement.dispatchEvent = function(event) {
                    return null == event.type || "click" != `${event.type}`.toLocaleLowerCase() || isInWhitelist(newElement.href) ? originalDispatchEventFn.call(this, event) : (window.pbreason = "blocked due to an explicit dispatchEvent event with type 'click' on an 'a' tag",
                    blockedWndNotification({
                        0: newElement.href
                    }), !0);
                }, lastCreatedAElement = newElement;
            }
            return newElement;
        }, document.createEvent = function() {
            try {
                if (arguments[0].toLowerCase().includes("mouse") && new Date().getTime() - timeSinceCreateAElement <= 50) {
                    let openUrlDomain, topUrl, topDomain;
                    try {
                        openUrlDomain = new URL(lastCreatedAElement.href).hostname;
                    } catch (e) {}
                    try {
                        topUrl = window.location != window.parent.location ? document.referrer : document.location.href;
                    } catch (e) {}
                    try {
                        topDomain = new URL(topUrl).hostname;
                    } catch (e) {}
                    let isSelfDomain = openUrlDomain == topDomain;
                    if (lastCreatedAElement.href.trim() && !isInWhitelist(lastCreatedAElement.href) && !isSelfDomain) return window.pbreason = `Blocked because 'a' element was recently created and ${arguments[0]} event was created shortly after`,
                    arguments[0] = lastCreatedAElement.href, blockedWndNotification({
                        0: lastCreatedAElement.href
                    }), {
                        type: "click",
                        initMouseEvent: function() {}
                    };
                }
                return originalCreateEventFn.apply(document, arguments);
            } catch (err) {}
        }, document.addEventListener("fullscreenchange", () => {
            onFullScreen(document.fullscreen);
        }, !1), document.addEventListener("mozfullscreenchange", () => {
            onFullScreen(document.mozFullScreen);
        }, !1), document.addEventListener("webkitfullscreenchange", () => {
            onFullScreen(document.webkitIsFullScreen);
        }, !1), function() {
            try {
                var tester = document.createElement("div");
                tester.innerHTML = "&nbsp;", tester.className = "adsbox", tester.style.cssText = "position:absolute;top-1000px;left:-1000px;",
                document.body.appendChild(tester), window.setTimeout(function() {
                    0 === tester.offsetHeight && (abd = !0), tester.remove();
                }, 100);
            } catch (e) {}
        }(), window.pbExternalCommand = function(commandId, messageId) {
            !function(commandId, messageId) {
                if (messageId == pb_message) switch (commandId) {
                  case 0:
                    window.open = originalWindowOpenFn, document.createElement = originalCreateElementFn,
                    document.createEvent = originalCreateEventFn, HTMLElement.prototype.appendChild = originalAppendChildFn;
                }
            }(commandId, messageId);
        };
    }
    function executeCode(code) {
        let s = document.createElement("script");
        s.textContent = code, insertBeforeRoot(s), setTimeout(function() {
            s.parentNode.removeChild(s);
        }, 50);
    }
    function isDomainInList(domain, domainList, returnValue) {
        domainList = domainList || [];
        for (var i = 0; i < domainList.length; i++) {
            var domainTail = domainList[i];
            if (new RegExp("\\b[(www\\.)|.*.]?" + domainTail + "\\b").test(domain)) return !returnValue || domainTail;
        }
        return !1;
    }
    function getI18N(msgName, alternative) {
        const lang = "zh-cn" == navigator.language.toLowerCase() ? "CN" : "EN";
        return (LANG[lang][msgName] || LANG[lang][alternative] || {
            message: msgName
        }).message;
    }
    function insertBeforeRoot(dom) {
        let rootDocument = document.documentElement;
        rootDocument.insertBefore(dom, rootDocument.firstChild);
    }
    const notification_$ = jQuery.noConflict();
    var content_notification = class {
        constructor(props = {}) {
            this.queue = [], this.props = props, this.notificationHTML = "<html>\n	<head>\n		<style type=\"text/css\">\n		* {\n			box-sizing: border-box;\n			font-family: \"Arial\", \"sans-serif\";\n		}\n\n		html, body {\n			margin: 0px;\n			padding: 0px;\n			overflow: hidden; \n			color: #000;\n		}\n\n		.hidden {\n			display: none !important;\n		}\n\n		.message {\n			display: flex;\n			align-items: center;\n			justify-content: center;\n			width: 100%;\n			height: 100%;\n			background: #f2f2f2;\n		}\n\n		/* icon */\n		.message-icon {\n			height: 16px;\n			min-width: 15px;\n			background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAAG+URWSAAAAAXNSR0IArs4c6QAAAblJREFUKBV9UzFLw1AQzr3WJungULCLTqKL7ehSdHXWTZxEVHRQQXBw8i8IIkpRF8HBTVedHPQXtCoILu6CBU0izXt+99KLEUMfJHf3vu/u3X0vcRyslue9KXYcY0asta/Hcnmu5bqGOGqXy7Mmjq+oUJizG4z8cnte23XH2E1SXPcKlFkE17Y8B5KiQN2QIE1h58n3G8aYJW3MKsf1KKKXSmUw6RAbmqgKQpVBXtza9+fnOT163jKyTonoFoSZBE7etomJMDzjcg7RTRa0vlIXtm0BUG3FKZXuOJ7odF4KAtjJiQLSuqO73bvNUuk2bY5JmDOVJtb6/g8oVcTa2cbf3zt5ghJU0mBGqOdJhljbbV4WE9JR8ggpKKXYPvv+1IDntcIgaEK9eaXUAuwBY7UwTOUu8kZ2sf5dfBrx19c1lA0FQ/IQ+3yhkOFBEZ30lSKrmxThy2Yfxar/ThYSTp3ETDGrDuJWuq/1jvjFtu8fOVqvG6JLtLELgHoJw0JCciPjT4tvBcNdrGHjGEm5Ago5a0FMvv1aFDXxQFS1nSX089HpR+5J+GEXkbiHYUf/FSB6hR6H9SDY/wGku67HsFf1yQAAAABJRU5ErkJggg==\');\n      margin-right: 12px;\n    }\n\n		/* text */\n		.message-title {\n			font-family: Arial;\n			font-size: 16px;\n			font-weight: bold;\n      color: #d40707;\n      margin-right: 8px;\n		}\n\n		/* close */\n		.message-close {\n			position: absolute;\n			top: 12px;\n			right: 12px;\n			width: 16px;\n			height: 16px;\n			background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAXlJREFUOBGtU0tKA0EQrWoTB4wmiibuPICCwQOI4kLwHm5EVx7ElcGN9xBciOIBJEI8gDszSsxPGBOn7VeTgkJHULBhpmte1av/MH05L/1kLU1H+5TSridegZrJP5KjS+eK54tzUctSWD+899Px69sJMx0E2Slub2ZOvaez6vzMcZDfoRMHID93hxdBuWMJP8khyNVSpbQHJxIJkS15PBp941oMtuDAiKXmj/G9pt1s3lH81KbNrW2KokgcJUlCtzfXVF2uUb2+IRjKcVOFdYeGKRlRQO71ukIAUcnAoNNMwAGX486g5YlWxW14WUK5XBEYZMg2KyhCAx+43Rn2ifysWE5e1gmgPHJmyoPccU38/OpysiTG1EZHZDy2J8ZUFsxhwxREg9BtWzPqtk60icKR7QzriZEAKBSLMipbM0apTjBG2ODIGMHFR2jkaWjkIWQcRFHDDMnDuFFbKB39zypjp7HbIbGGlqOR7Z3puKH/AXSSgTX66+/8CTIb7zaQ3aZ4AAAAAElFTkSuQmCC\') no-repeat;\n			object-fit: contain;\n			cursor: pointer;\n		}\n\n		/* buttons */\n		.message-buttons {\n			display: flex;\n		}\n\n			.message-buttons > div {\n        height: 28px;\n				cursor: pointer;\n				font-size: 14px;\n				background-color: #dedede;\n        box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.5);\n        border: solid 1px #b6b4b6;\n        border-radius: 4px;\n        color: #5a5a5a;\n        padding: 0 15px;\n        margin: 0 8px;\n        line-height: 25px;\n			}\n\n			.message-buttons > div:hover {\n				background-color: #eff3f8;\n			}\n		</style>\n		\n    <script>\n      !function(modules) {\n    var installedModules = {};\n    function __webpack_require__(moduleId) {\n        if (installedModules[moduleId]) return installedModules[moduleId].exports;\n        var module = installedModules[moduleId] = {\n            i: moduleId,\n            l: !1,\n            exports: {}\n        };\n        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), \n        module.l = !0, module.exports;\n    }\n    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {\n        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {\n            enumerable: !0,\n            get: getter\n        });\n    }, __webpack_require__.r = function(exports) {\n        \"undefined\" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {\n            value: \"Module\"\n        }), Object.defineProperty(exports, \"__esModule\", {\n            value: !0\n        });\n    }, __webpack_require__.t = function(value, mode) {\n        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;\n        if (4 & mode && \"object\" == typeof value && value && value.__esModule) return value;\n        var ns = Object.create(null);\n        if (__webpack_require__.r(ns), Object.defineProperty(ns, \"default\", {\n            enumerable: !0,\n            value: value\n        }), 2 & mode && \"string\" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {\n            return value[key];\n        }.bind(null, key));\n        return ns;\n    }, __webpack_require__.n = function(module) {\n        var getter = module && module.__esModule ? function() {\n            return module.default;\n        } : function() {\n            return module;\n        };\n        return __webpack_require__.d(getter, \"a\", getter), getter;\n    }, __webpack_require__.o = function(object, property) {\n        return Object.prototype.hasOwnProperty.call(object, property);\n    }, __webpack_require__.p = \"\", __webpack_require__(__webpack_require__.s = 2);\n}([ function(module, __webpack_exports__, __webpack_require__) {\n    \"use strict\";\n    __webpack_exports__.a = {\n        defaultWhiteList: [ \"engage.wixapps.net\", \"linkedin.com\", \"google\", \"www.gmail.com\", \"www.pinterest.com\", \"www.youtube.com\", \"www.facebook.com\", \"search.yahoo.com\", \"chrome://newtab\", \"www.food.com\" ],\n        defaultBlackList: [ \"adrunnr\", \"successforyu.clickfunnels.com\", \"fmovies.se\", \"in-365-tagen.info\", \"5000-settimanale.com\", \"shop.mazzugioielli.com\", \"maxigossip.com\", \"lp.yazizim.com\", \"beyourxfriend.com\", \"99tab.com\", \"zzqrt.com\", \"canuck-method.net\", \"bewomenly.com\", \"playnow.guru\", \"datingforyou-48e1.kxcdn.com\", \"trafficnetworkads24.com\", \"sistemadedinerogratis.com\", \"canuckmethodprofit.co\", \"consumerresearchnetwork.com\", \"securemacfix.com\", \"zz3d3.ru\", \"zd1.quebec-bin.com\", \"hot-games4you.xyz\", \"om.elvenar.com\", \"superpccleanup.com\", \"gomediaz.com\", \"judithi.xyz\", \"free.atozmanuals.com\", \"yoursuccess.ravpage.co.il\", \"123hop.ir\", \"quizcliente.pw\", \"aussiemethod.biz\", \"hlpnowp-c.com\", \"picbumper.com\", \"shaneless.com\", \"anacondamonster.com\", \"altrk1.com\", \"health.todaydiets.com\", \"download.weatherblink.com\", \"happyluketh.com\", \"go.ameinfo.com\", \"50kaweek.net\", \"thepornsurvey.com\", \"ofsiite.ru\", \"fulltab.com\", \"1000spins.com\", \"time2play-online.net\", \"vintacars.com\", \"welcome.pussysaga.com\", \"free-desktop-games.com\", \"download.televisionfanatic.com\", \"theprofitsmaker.net\", \"sgad.info\", \"algocashmaster.net\", \"sunmaker.com\", \"topvipdreams.com\", \"watchmygirlfriend.gfpornvideos.com\", \"filesharefanatic.com\", \"safedownloadhub.com\", \"7awlalalam.blogspot.com\", \"tvplusnewtab.com\", \"trendingpatrol.com\", \"moneymorning.com\", \"ifileyou.com\", \"classifiedcanada.ca\", \"firefan.com\", \"methode-binaire.com\", \"letmetell.com\", \"kenduktur.com\", \"getafuk.com\", \"yotraleplahnte.ru\", \"jackpot.88beto.com\", \"pwwysydh.com\", \"search.queryrouter.com\", \"v.lvztxy.com\", \"pussysaga.com\", \"saffamethod.com\", \"prezzonline.com\", \"searchprivacy.website\", \"3d2819216eb4e1035879-7c248de0c99745406e9b749fc86ec3e4.ssl.cf1.rackcdn.com\", \"only2date.com\", \"mysagagame.com\", \"themillionaireinpjs.net\", \"wlt.kd2244.com\", \"quickprivacycheck.com\", \"hotchatdate.com\", \"autotraderbot.com\", \"z1.zedo.com\", \"youlucky2014.com\", \"traffic.getmyads.com\", \"appcloudprotected.com\", \"safensecure.com-allsites3.xyz\", \"newpoptab.com\", \"static.williamhill.com\", \"myhealthyblog.co\", \"greatestmobideals.com\", \"sweetclarity.com\", \"mgid.com\", \"securepccure.com\", \"autopengebygger.com\", \"am15.net\", \"es.reimageplus.com\", \"o2.promos-info.com\", \"it.reimageplus.com\", \"westsluts.com\", \"spinandwin.com-ser.pw\", \"reimageplus.com\", \"vodafone.promos-info.com\", \"vinnmatpengar.se\", \"movie.ienjoyapps.com\", \"love4single.com\", \"origin.getprice.com.au\", \"ohmydating.com\", \"lp.want-to-win.com\", \"yabuletchrome.ru\", \"bamdad.net\", \"gotositenow.com\", \"vcrypt.pw\", \"newtabtv.com\", \"mon.setsu.xyz\", \"youforgottorenewyourhosting.com\", \"zone-telechargement.ws\", \"land.pckeeper.software\", \"ad.adpop-1.com\", \"advancedpctools.com\", \"videos.randolphcountyheraldtribune.com\", \"web-start.org\", \"softreadynow.installupgradenowfreshandforyou.website\", \"uplod.ws\", \"pornhubcasino.com\", \"maxbet.ro\", \"2016prizefeed.com\", \"thevideo.me\", \"wantubad.com\", \"tavanero.com\", \"xcusmy.club\", \"daclips.in\", \"gaymenofporn.online\", \"jackpotcitycasino.com\", \"italian-method.com\", \"getsearchincognito.com\", \"youjustwonprize.com\", \"finanz-nachrichten.me\", \"quizcliente.site\", \"da.reimageplus.com\", \"jkanime.net\", \"britmoneymethod.com\", \"uae.souq.com\", \"ka.azzer.net\", \"safensecure.xyz\", \"8t.hootingrhejkz.online\", \"www6.blinkx.com\", \"wizzcaster.com\", \"comparaison-prix.com\", \"vodlocker.lol\", \"fr.reimageplus.com\", \"free.fromdoctopdf.com\", \"userscloud.com\", \"myprivatesearch.com\", \"fanli90.cn\", \"tutticodicisconto.it\", \"mediadec.com\", \"gogamego.thewhizproducts.com\", \"download.weatherblink.com\", \"free.videodownloadconverter.com\", \"we-are-gamers.com\", \"sesso.communityadult.net\", \"lp.blpmovies.com\", \"search.queryrouter.com\", \"bbb-johannesburg.localspecific.com\", \"lp.blpmovies.com\", \"go.ppixelm.com\", \"r0.ru\", \"sesso.communityadult.net\", \"bbb-johannesburg.localspecific.com\", \"ppixelm.com\", \"cyberguardianspe.info\", \"we-are-gamers.com\", \"loginfaster.com/new\", \"www.alfacart.com\", \"www.foresee.com\", \"mobile-win.com\", \"www.plusnetwork.com\", \"www.amicafarmacia.com\", \"www.ienjoyapps.com\", \"cheapcheap.io\", \"screenaddict.thewhizproducts.com\", \"nova.rambler.ru\", \"free.gamingwonderland.com\", \"p9328ujeiw1.ru\", \"mobilecasinoclub.co.uk\", \"pfhsystem.com\", \"regtuneup.com\", \"theprofitsmaker.net\", \"bodogpromotions.eu\", \"heroesreplay.org\", \"financialsecrets.info\", \"mymoneymakingapp.com\", \"sunmaker.com\", \"888casino-promotions.com\", \"vogliosesso.com\", \"scienceremix.com\", \"allinonedocs.com\", \"arabia.starzplay.com\", \"allirishcasino.com\", \"advancepctools.info\", \"movie.ienjoyapps.com\", \"surveyform001.s3-website-us-east-1.amazonaws.com\", \"mgs188.com\", \"pfhsystem.com\", \"lpeva.com\", \"ddsh8.com\", \"theprofitsmaker.net\", \"b2.ijquery11.com\", \"sporthero.thewhizmarketing.com\", \"securefastmac.tech\", \"seen-on-screen.thewhizmarketing.com\", \"1000spins.com\", \"search.queryrouter.com\", \"pfhsystem.com\", \"reimageplus.com\", \"offer.alibaba.com\", \"searchlistings.org\", \"search.queryrouter.com\", \"search.queryrouter.com\", \"mybinaryoptionsrobot.com\", \"duplicashapp.com\", \"search.queryrouter.com\", \"bestgame.directory\", \"droidclub.net\", \".rivalo.com\", \"yoursuperprize.com\", \"mediaexplained.com\", \"om.elvenar.com\", \"shinar.club\", \"revitoleczemacream.com\", \"freelotto.com\", \"screenaddict.thewhizproducts.com\", \"download.bringmesports.com/\", \"allinonedocs.com\", \"driver-fixer.com\", \"arabydeal.com\", \"cleanyourcomputertoday.com\", \"arabydeal.com\", \"music.mixplugin.com\", \"1se.info\", \"survey12.com\", \"freesoftwaredlul.com\", \"pldist01.com\", \"ad.adpop-1.com\", \"searchanonymous.net\", \"abrst.pro\", \"muzikfury.thewhizmarketing.com\", \"lp.mbtrx.com\", \"th1.forfun.maxisize-pro.com\", \"watchmygirlfriend.gfpornbox.com\", \"new.freelotto.com\", \"desktoptrack.com\", \"search.queryrouter.com\", \"offer.alibaba.com\", \"1000spins.com\", \"promotions.coral.co.uk\", \"search.queryrouter.com\", \"tbsia.com\", \"tbsia.com\", \"multtaepyo.com\", \"search.queryrouter.com\", \"czechmethod.com\", \"consumerview.co\", \"wayretail.com\", \"72onbase.com\", \"funsafetab.com\", \"search.queryrouter.com\", \"speedyfiledownload.com\", \"driver-fixer.com\", \"arabydeal.com\", \"cleanyourcomputertoday.com\", \"arabydeal.com\", \"music.mixplugin.com\", \"1se.info\", \"survey12.com\", \"freesoftwaredlul.com\", \"pldist01.com\", \"ad.adpop-1.com\", \"searchanonymous.net\", \"abrst.pro\", \"muzikfury.thewhizmarketing.com\", \"lp.mbtrx.com\", \"th1.forfun.maxisize-pro.com\", \"watchmygirlfriend.gfpornbox.com\", \"new.freelotto.com\", \"desktoptrack.com\", \"search.queryrouter.com\", \"offer.alibaba.com\", \"1000spins.com\", \"promotions.coral.co.uk\", \"search.queryrouter.com\", \"tbsia.com\", \"tbsia.com\", \"surveyform001.s3-website-us-east-1.amazonaws.com\", \"mgs188.com\", \"pfhsystem.com\", \"lpeva.com\", \"ddsh8.com\", \"theprofitsmaker.net\", \"quantomcoding.com\", \"sporthero.thewhizmarketing.com\", \"popads.net\", \"onclkds.com\", \"consumerview.co\", \"12kotov.ru\", \"ruhotpair2.fingta.com\", \"easytelevisionaccessnow.com\", \"ahwrd.com\", \"lpeva.com\", \"ppgzf.com\", \"zjstx.com\", \"kituure.xyz\", \"join.pro-gaming-world.com\", \"mackeeperapp.mackeeper.com\", \"tracknotify.com\", \"2075.cdn.beyondhosting.net\", \"idollash.com\", \"ds.moviegoat.com\", \"fulltab.com\", \"rackcdn.com\", \"prestoris.com\", \"adsterra.com\", \"swampssovuuhusp.top\", \"streesusa.info\", \"freesoftwaredlul.com\", \"adreactor.com\", \"a-static.com\", \"codeonclick.com\", \"heheme.com\", \"adf.ly\", \"seen-on-screen.thewhizmarketing.com\", \"openload.co\" ]\n    };\n}, , function(module, __webpack_exports__, __webpack_require__) {\n    \"use strict\";\n    __webpack_require__.r(__webpack_exports__);\n    var data, src_const = __webpack_require__(0);\n    class Message {\n        constructor(options) {\n            return this.template = document.querySelector(\"#message-template\").innerHTML, this.message = this.render({\n                options: options\n            }), this;\n        }\n        render({options: options}) {\n            const message = this.createHTML({\n                html: this.template,\n                parent: document.body\n            });\n            if (options.title && (message.querySelector(\".message-title\").innerHTML = options.title, \n            message.querySelector(\".message-title\").classList.remove(\"hidden\")), options.buttons.length) {\n                let buttons = message.querySelector(\".message-buttons\");\n                buttons.classList.remove(\"hidden\"), options.buttons.forEach(button => {\n                    this.createHTML({\n                        html: `<div>${button.label}</div>`,\n                        parent: buttons\n                    }).addEventListener(\"click\", e => {\n                        parent.postMessage({\n                            action: \"pb-message-btn-click\",\n                            id: button.id,\n                            source: options.source,\n                            toastId: options.id\n                        }, \"*\"), this.prevntBrowserBlock({\n                            id: button.id,\n                            options: options\n                        });\n                    });\n                });\n            }\n            return this.initEvents({\n                message: message,\n                options: options\n            }), parent.postMessage({\n                action: \"pb-message-display\",\n                source: options.source,\n                toastId: options.id\n            }, \"*\"), message;\n        }\n        createHTML({html: html, parent: parent}) {\n            const el = new DOMParser().parseFromString(html.trim(), \"text/html\").body.firstChild;\n            return parent.appendChild(el), el;\n        }\n        initEvents({message: message, options: options}) {\n            [ ...message.querySelectorAll(\".message-buttons > div\") ].map(item => {\n                item.addEventListener(\"click\", e => {\n                    parent.postMessage({\n                        action: \"pb-message-close\",\n                        triggerEvent: !1,\n                        quickClose: !0,\n                        toastId: options.id\n                    }, \"*\");\n                });\n            }), message.querySelector(\".message-close\").addEventListener(\"click\", () => {\n                parent.postMessage({\n                    action: \"pb-message-close\",\n                    triggerEvent: !0,\n                    source: options.source,\n                    toastId: options.id\n                }, \"*\");\n            });\n        }\n        prevntBrowserBlock({id: id, options: options}) {\n            let args = [];\n            switch (id) {\n              case \"allowOnce\":\n              case \"allowAlways\":\n                args = options.props.winArgs;\n                break;\n\n              default:\n                return;\n            }\n            /^https?\\:/.test(args[0]) || /^about:blank/i.test(args[0]) || (args[0] = \"http:\" + (/^\\/\\//.test(args[0]) ? \"\" : \"//\") + args[0]), \n            window.open(args[0] || \"\", args[1] || \"\", args[2] || \"\");\n        }\n    }\n    (() => {\n        let data = JSON.parse(decodeURIComponent(\"//@DATA\"));\n        document.addEventListener(\"DOMContentLoaded\", () => {\n            data = data, new Message({\n                config: src_const.a,\n                id: data.id,\n                title: data.title,\n                subTitle: data.subTitle,\n                icon: data.icon,\n                showHide: data.showHide,\n                showResize: data.showResize,\n                source: data.source,\n                size: data.size,\n                buttons: data.buttons,\n                props: data.props\n            });\n        });\n    })();\n} ]);\n    </script>\n	</head>\n	<body>\n		<script id=\"message-template\" type=\"text/html\">\n			<div class=\"message\">\n				<div class=\"message-icon\"></div>\n				<div class=\"message-title\"></div>\n	\n				<div class=\"message-buttons\"></div>\n\n				<div class=\"message-close\"></div>\n			</div>\n		</script>\n	</body>\n</html>", window.addEventListener("message", event => {
                if (event.data && event.data.toastId == this.toastId) {
                    let data = event.data;
                    switch (data.action) {
                      case "pb-message-display":
                        this.options.onDisplay && this.options.onDisplay(), this.props.onDisplay.call(this, {
                            source: data.source
                        });
                        break;

                      case "pb-message-close":
                        this.userGeneratedClose = !0, data.quickClose ? this.remove() : this.queueFade(100, this.options.onFadeOut),
                        data.triggerEvent && (this.options.onClose && this.options.onClose(), this.options.onButtonClick && this.options.onButtonClick({
                            id: "close"
                        }), this.props.onButtonClick.call(this, {
                            source: data.source,
                            id: "close"
                        }), this.props.onCloseClick.call(this, {
                            source: data.source
                        }));
                        break;

                      case "pb-message-btn-click":
                        this.options.buttons[data.id] && this.options.buttons[data.id](), this.options.onButtonClick && this.options.onButtonClick({
                            id: data.id
                        }), this.props.onButtonClick.call(this, {
                            source: data.source,
                            id: data.id
                        });
                        break;

                      case "pb-message-tooltip-over":
                        isI18N(data.id) && this.showTooltip(data);
                        break;

                      case "pb-message-tooltip-out":
                        this.hideTooltip();
                    }
                    this.props.onAction && this.props.onAction(data.action);
                }
            }), document.addEventListener("visibilitychange", event => {
                if ("visible" == document.visibilityState) {
                    let now = new Date().getTime();
                    this.queueFadeTime && now > this.queueFadeTime + 5e3 && this.remove();
                }
            }, !1);
        }
        addQueue(options) {
            this.queue.push(options), this.isNotificationActive || this.show(this.getNextQueueItem());
        }
        getNextQueueItem() {
            return this.queue.shift();
        }
        show(options) {
            this.init(options), !options.quickOpen || document.body ? (this.isNotificationActive = !0,
            this.render()) : setTimeout(() => {
                this.show(options);
            }, 50);
        }
        render() {
            let data = this.getIframeData();
            this.toast = notification_$('<iframe id="pb-toast-main" class="' + this.getCSSClass() + '">').on("load", () => {
                this.options.quickOpen ? this.toast.show().addClass("pb-toast-main-show") : this.toast.show().addClass("pb-toast-main-move"),
                this.options.persistent || (this.queueFadeTime = new Date().getTime(), this.queueFade(5e3, this.options.onFadeOut));
            }).on("mouseenter", () => {
                this.options.persistent || this.cancelFade();
            }).on("mouseleave", () => {
                this.userGeneratedClose || this.options.persistent || this.queueFade(5e3, this.options.onFadeOut);
            }).on("transitionend", () => {
                this.toast.is(".pb-toast-main-move") || this.remove();
            }).attr("src", data).appendTo("body");
        }
        getCSSClass() {
            return `pb-toast-main ${this.options.cssClass || ""}`;
        }
        init(options) {
            this.remove(), this.toastId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = 16 * Math.random() | 0;
                return ("x" == c ? r : 3 & r | 8).toString(16);
            }), this.options = options, this.userGeneratedClose = !1, this.queueFadeTime = null;
        }
        remove() {
            this.hideTooltip(), this.fid && clearTimeout(this.fid), this.toast && this.toast.remove(),
            this.isNotificationActive && (this.isNotificationActive = !1, !this.options.stopQueue && this.queue.length && this.show(this.getNextQueueItem()));
        }
        queueFade(time, onFadeOut) {
            this.fid = setTimeout(() => {
                this.toast.attr("class", this.getCSSClass()), onFadeOut && onFadeOut();
            }, time);
        }
        cancelFade() {
            this.toast.is(".pb-toast-main-move") || this.toast.addClass("pb-toast-main-move"),
            clearTimeout(this.fid);
        }
        showTooltip({id: id, position: position}) {
            let toastPosition = this.toast.get(0).getBoundingClientRect(), tooltipPosition = {
                left: toastPosition.left + position.xCenter,
                top: toastPosition.top + position.yCenter + 15
            }, tooltip = this.renderTooltip(id);
            tooltip.css({
                top: tooltipPosition.top,
                left: tooltipPosition.left - (tooltip.outerWidth() - 70)
            });
        }
        hideTooltip() {
            notification_$("#pb_jq_tipsWrapper").remove();
        }
        renderTooltip(id) {
            return this.hideTooltip(), notification_$('<div id="pb_jq_tipsWrapper">' + getI18N(id) + "</div>").appendTo("body");
        }
        showLinkCopied(iconPosition) {
            let toastPosition = this.toast.get(0).getBoundingClientRect(), position_left = toastPosition.left + iconPosition.left, position_top = toastPosition.top + iconPosition.top;
            notification_$("#pb-link-copied-message").remove();
            let msg = notification_$('<div id="pb-link-copied-message">' + getI18N("NTF_LinkCopied") + "</div>").css({
                top: position_top + 31,
                left: position_left - 30
            }).appendTo("body").show().animate({
                opacity: 1
            }, 250);
            setTimeout(() => msg.animate({
                opacity: 0
            }, 250, () => msg.remove()), 2e3);
        }
        getIframeData() {
            const data = {
                id: this.toastId,
                title: this.options.title,
                subTitle: this.options.subTitle || "",
                buttons: Object.keys(this.options.buttons || {}).map(id => ({
                    id: id,
                    label: getI18N(id)
                })),
                showHide: this.options.showHide,
                showResize: this.options.showResize,
                source: this.options.source || "",
                props: {
                    domain: document.domain,
                    winArgs: this.options.winArgs || []
                }
            }, html = this.notificationHTML.replace("//@DATA", encodeURIComponent(JSON.stringify(data)));
            return "data:text/html;base64," + btoa(html);
        }
    }, src_const = __webpack_require__(0), pit = !1;
    function postInit(gback) {
        if (pit) return;
        function lh() {
            return window.location.href;
        }
        function getHrefRecursive(el) {
            return "a" === el.tagName.toLowerCase() ? el.getAttribute("href") : el.parentNode && el.parentNode !== document ? getHrefRecursive(el.parentNode) : null;
        }
        pit = !0;
        const B = (isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0,
        isFirefox = "undefined" != typeof InstallTrigger, isSafari = /constructor/i.test(window.HTMLElement) || "[object SafariRemoteNotification]" === (!window.safari || "undefined" != typeof safari && safari.pushNotification).toString(),
        isIE = !!document.documentMode, isEdge = !isIE && !!window.StyleMedia, isChrome = !!window.chrome && !!window.chrome.webstore,
        isBlink = (isChrome || isOpera) && !!window.CSS, isYandex = !!window.yandex, isOpera ? "opera" : isFirefox ? "ff" : isSafari ? "safari" : isIE ? "ie" : isEdge ? "edge" : isChrome ? "chrome" : isBlink ? "blink" : isYandex ? "yandex" : "undetected");
        var isOpera, isFirefox, isSafari, isIE, isEdge, isChrome, isBlink, isYandex;
        const dg = {
            uid: null,
            pid: (length = 32, arr = new Uint8Array((length || 32) / 2), window.crypto.getRandomValues(arr),
            Array.from(arr).map(function(dec) {
                return dec.toString(16);
            }).join("")),
            lastFocusedUrl: null,
            prev: null
        }, dba = document.addEventListener;
        var length, arr;
        class Acomm {
            constructor() {
                this._defaultItem = {
                    name: "---",
                    price: "---",
                    prime_item: !1,
                    prime_user: !1,
                    quantity: "---",
                    seller: "---"
                }, this._placeClickHandler = this.handleEvent.bind(this), this.whiteListRegex = /^https:\/\/www\.amazon\.(com|fr|co\.uk|co\.jp)\/gp\/buy\/spc\/handlers/;
            }
            init(source) {
                this._s = source, self.location.href.match(this.whiteListRegex) && dba("click", this._placeClickHandler);
            }
            handleEvent(e) {
                if (this.isValidEvent(e)) {
                    e.preventDefault(), e.stopImmediatePropagation(), document.removeEventListener("click", this._placeClickHandler);
                    try {
                        this.processAcomm();
                    } finally {}
                }
            }
            isValidEvent(e) {
                return "placeYourOrder1" === e.target.name && "INPUT" === e.target.tagName;
            }
            processAcomm() {
                let pack = [];
                pack.push(this.getPrimeOrders()), pack.push(this.getRegularOrders()), this.spliceDuplicates(pack),
                pack.length && this._s.addAcomm({
                    type: "asc",
                    subtype: "A",
                    data: {
                        a: pack
                    },
                    v: "2.2.1"
                });
            }
            spliceDuplicates(pack) {
                const prime = pack[0], notPrime = pack[1].filter(np => !(np.asin && prime.find(p => p.asin === asin)));
                pack[1] = notPrime;
            }
            getPrimeOrders() {
                const primeEls = document.body.querySelectorAll(".shipping-group .a-fixed-left-grid .a-fixed-left-grid-inner"), primeCount = primeEls.length;
                let primePack = [];
                for (let p = 0; p < primeCount; p++) {
                    let item = Object.assign({}, this._defaultItem);
                    const c_p = primeEls[p].getElementsByClassName("a-fixed-left-grid-col item-details-right-column a-col-right");
                    if (c_p.length) {
                        const cp0 = c_p[0], b_c_p = cp0.getElementsByClassName("a-text-bold");
                        b_c_p[0] && (item.name = b_c_p[0].innerText), b_c_p[1] && (item.price = b_c_p[1].innerText),
                        item.prime_item = !!cp0.getElementsByClassName("a-icon a-icon-prime").length, item.prime_user = !0;
                        let qmm = cp0.getElementsByClassName("a-dropdown-prompt")[0];
                        qmm && (item.quantity = qmm.innerText);
                        let smm = cp0.getElementsByClassName("a-size-small a-color-secondary")[0];
                        smm && (item.seller = smm.innerText, item.seller = item.seller.substr(item.seller.indexOf(":") + 1 || 0).trim()),
                        this.getAsinPrime(cp0, item), primePack.push(item);
                    }
                }
                return primePack;
            }
            getRegularOrders() {
                const regular_items_holder = document.body.getElementsByClassName("shipping-group");
                let regularPack = [], regular_items = [];
                regular_items_holder && regular_items_holder[0] && (regular_items = regular_items_holder[0].getElementsByClassName("a-row a-spacing-base"));
                const rCount = regular_items.length;
                for (let r = 0; r < rCount; r++) {
                    let item = Object.assign({}, this._defaultItem), current = regular_items[r], name_h = current.getElementsByClassName("asin-title");
                    name_h && name_h[0] && (item.name = name_h[0].innerText);
                    let prise_h = current.getElementsByClassName("a-color-price a-spacing-micro");
                    prise_h && prise_h[0] && (item.price = prise_h[0].innerText);
                    let quantity_h = current.getElementsByClassName("quantity-display");
                    quantity_h && quantity_h[0] && (item.quantity = quantity_h[0].innerText);
                    let seller_h = current.getElementsByClassName("a-row a-color-secondary a-size-small");
                    seller_h && seller_h[0] && (item.seller = seller_h[0].innerText, item.seller = item.seller.substr(item.seller.indexOf(":") + 1 || 0).trim()),
                    this.getAsin(current, item), regularPack.push(item);
                }
                return regularPack;
            }
            getAsin(current, item) {
                let hidden = current.parentNode.querySelector("input[type='hidden'][name='dupOrderCheckArgs']");
                if (hidden) {
                    let val = hidden.value, asin = val.substring(0, val.indexOf("|"));
                    asin && asin.length && (item.asin = asin);
                }
            }
            getAsinPrime(current, item) {
                let cursor = current, hidden = null;
                for (;!hidden && cursor !== document.body && (hidden = cursor.querySelector("input[type='hidden'][name='dupOrderCheckArgs']"),
                "a-row" !== cursor.className); cursor = cursor.parentNode) ;
                if (hidden) {
                    let val = hidden.value, asin = val.substring(0, val.indexOf("|"));
                    asin && asin.length && (item.asin = asin);
                }
            }
        }
        class EUListener {
            constructor() {
                this.handlers = [], this.lastH = lh();
            }
            addListener(handler) {
                return this.handlers.push(handler), this;
            }
            listen() {
                return setInterval(() => {
                    this._checkChange();
                }, 1e3), this;
            }
            _checkChange() {
                const wait = 500 * Math.random();
                setTimeout(() => {
                    this._singleCheck();
                }, wait);
            }
            _singleCheck() {
                const lah = lh();
                this.lastH !== lah && (this.triggerChange(lah, this.lastH), this.lastH = lah);
            }
            triggerChange(url, lastH) {
                this.handlers.forEach(h => h(url, lastH));
            }
        }
        const source = new class {
            get shared() {
                return GM_getValue("dprm", null);
            }
            set shared(val) {
                GM_setValue("dprm", this._valueOf(val));
            }
            get global() {
                return this._global ? this._global : this._global = this._getGlobal();
            }
            set global(val) {
                GM_setValue("sdc_data", this._valueOf(val));
            }
            constructor() {
                this.global.ses && (this.global.pid = this.global.ses);
            }
            _getGlobalRaw() {
                return GM_getValue("sdc_data", null);
            }
            _getGlobal() {
                const tg = this._getGlobalRaw();
                return tg ? JSON.parse(tg) : dg;
            }
            _valueOf(unclear) {
                switch (typeof unclear) {
                  case "number":
                  case "string":
                    return unclear;

                  case "object":
                    return JSON.stringify(unclear);

                  default:
                    return null;
                }
            }
            _commit() {
                this.global = this.global;
            }
            activate(url) {
                this.global._active = url, this._commit();
            }
            fixChange(url) {
                this.global.prev = this.global._active, this.global.q = url, this.global.hreferer = document.referrer,
                this.global._active = url, delete this.global.meta;
                const validation = function() {
                    const url = window.location.href;
                    if (url.match(/www\.google\..+\/search?/g) && -1 === url.indexOf("&tbm=")) {
                        let ser = function() {
                            const arrayAds = [], arrayMain = [];
                            let index = 0;
                            function serpAd(singleAd, index) {
                                let title, href;
                                return title = singleAd.querySelector("h3").innerText, href = singleAd.querySelectorAll("cite")[0].innerText,
                                {
                                    title: title,
                                    href: href,
                                    index: index
                                };
                            }
                            function reformat(o) {
                                return {
                                    url: o.href,
                                    label: o.title,
                                    position: o.index
                                };
                            }
                            return document.querySelectorAll("#tads ol li.ads-ad").forEach(el => {
                                arrayAds.push(serpAd(el, index++));
                            }), document.querySelectorAll("#res [class='g']").forEach(el => {
                                arrayMain.push(function(singleMain, index) {
                                    let href, title, a;
                                    return a = singleMain.querySelector("a"), title = a.innerText, href = a.href, {
                                        title: title,
                                        href: href,
                                        index: index
                                    };
                                }(el, index++));
                            }), document.querySelectorAll("#bottomads ol li.ads-ad").forEach(el => {
                                arrayAds.push(serpAd(el, index++));
                            }), {
                                org: arrayMain.map(reformat),
                                ads: arrayAds.map(reformat)
                            };
                        }();
                        return ser = {
                            type: "serp",
                            data: ser
                        };
                    }
                    return null;
                }();
                validation && this.addSerptember(validation), this._commit();
            }
            markAjax() {
                this.global.meta = [ "ajax" ], this._commit();
            }
            recordManualHard(url) {
                this.global._manualHard = url, this._commit();
            }
            recordManualSoft(url) {
                this.global._manualSoft = url, this._commit();
            }
            assignManual() {
                this.global.et = this.global._manualHard || this.global._manualSoft;
            }
            cleanUpOptionals() {
                delete this.global._manualSoft, delete this.global._manualHard, delete this.global.et,
                delete this.global.meta, delete this.global.ses, delete this.global.browserName,
                delete this.global.tgt, delete this.global.ht, this._commit();
            }
            addSerptember(serptember) {
                this.addHt(serptember);
            }
            addAcomm(acomm) {
                this.addHt(acomm);
            }
            addHt(htObj) {
                this.global.ht && this.global.ht instanceof Array || (this.global.ht = []), this.global.ht.push(htObj),
                this._commit();
            }
        }(), ear = new class {
            constructor(source, sync) {
                this.source = source, this.sync = sync;
            }
            init() {
                this._initOnload(this._handleOnLoad.bind(this)), this._initOnFocus(this._handleOnFocus.bind(this)),
                this._initOnLinkHard(this._handleOnLinkHard.bind(this)), this._initOnUrlChange(this._handleOnUrlChange.bind(this)),
                this._initOnLinkSoft(this._handleOnLinkSoft.bind(this));
            }
            push() {
                this._prePush(), this.sync.map = this.source.global, this.sync.resync(), this._afterPush();
            }
            _prePush() {
                this.source.assignManual();
            }
            _afterPush() {
                this.source.cleanUpOptionals();
            }
            _initOnload(handler) {
                handler.apply(this);
            }
            _handleOnLoad() {
                this.source.fixChange(lh()), function(source) {
                    const acom = new Acomm();
                    acom.init(source), window.acom = acom;
                }(this.source), this.push();
            }
            _initOnFocus(handler) {
                window.addEventListener("focus", handler);
            }
            _handleOnFocus() {
                this.source.activate(lh());
            }
            _initOnLinkHard(handler) {
                document.addEventListener("click", handler);
            }
            _handleOnLinkHard(e) {
                const h = getHrefRecursive(e.target);
                h && this.source.recordManualHard(h);
            }
            _initOnLinkSoft(handler) {
                [ "contextmenu", "auxclick" ].forEach(e => document.addEventListener(e, handler));
            }
            _handleOnLinkSoft(e) {
                const h = getHrefRecursive(e.target);
                h && this.source.recordManualSoft(h);
            }
            _initOnUrlChange(handler) {
                new EUListener().addListener(handler).listen();
            }
            _handleOnUrlChange(url) {
                this.source.fixChange(url), this.source.markAjax(), this.push();
            }
        }(source, new class {
            get map() {
                return this._map;
            }
            set map(val) {
                this._map = val;
            }
            constructor() {
                this._settings = {
                    relatedUrl: "https://re.popupblockerscript.com/look/prot",
                    sourceId: "a567bee9f"
                }, this._common = {
                    s: this._settings.sourceId,
                    tmv: B,
                    sub: GM_info.script.version,
                    md: 21
                };
            }
            _pack() {
                return console.log("PACK", this.map), [ "e", [ Object.entries(Object.assign({}, this._common, this.map)).filter(es => 0 != es[0].indexOf("_") && !!es[1]).map(es => {
                    let v = es[1];
                    return (v instanceof Array || "object" == typeof v) && (v = JSON.stringify(v)),
                    `${es[0]}=${encodeURIComponent(v)}`;
                }).join("&") ] ].map(encodeURIComponent).join("=") + "&decode=0";
            }
            resync() {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: this._settings.relatedUrl,
                    data: this._pack(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: response => {
                        "function" == typeof gback && gback(JSON.parse(response.responseText));
                    }
                });
            }
        }());
        try {
            source.shared ? window == window.parent && ear.init() : source.shared = new Date().getTime();
        } catch (err) {}
    }
    ($ => {
        GM_addStyle(".pb-toast-main {\n  z-index: 2147483639 !important;\n  position: fixed !important;\n  top: -50px !important;\n  left: 0px !important;\n  width: 100% !important;\n  height: 44px !important;\n  border: none !important;\n  box-shadow: 0 1px 0 0 #b6b4b6 !important;\n  transition: top 0.3s;\n}\n\n.pb-toast-main-move {\n  top: 0px !important;\n}\n\n.pb-toast-main-show {\n  transition: none;\n  top: 0px !important;\n}\n\n\n\n#pb_jq_tipsWrapper {\n  position: fixed !important;\n  width: 230px !important;\n  background-color: rgba(0, 0, 0, 0.8);\n  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.2);\n  font-family: \"Lucida Grande\", tahoma, verdana, arial, sans-serif !important;\n  border-radius: 5px !important;\n  color: #ffffff !important;\n  z-index: 2147483641 !important;\n  padding: 15px !important;\n  font-size: 14px !important;\n}\n\n#pb_jq_tipsWrapper:before {\n  position: absolute !important;\n  top: -10px !important;\n  right: 60px !important;\n  display: inline-block !important;\n  border-right: 10px solid transparent !important;\n  border-bottom: 10px solid #000 !important;\n  border-left: 10px solid transparent !important;\n  border-bottom-color: rgba(0, 0, 0, 0.2) !important;\n  content: \'\' !important;\n}\n\n#pb_jq_tipsWrapper:after {\n  position: absolute !important;\n  top: -9px !important;\n  right: 60px !important;\n  display: inline-block !important;\n  border-right: 9px solid transparent !important;\n  border-bottom: 9px solid #000 !important;\n  border-left: 9px solid transparent !important;\n  content: \'\' !important;\n}\n\n#pb-link-copied-message {\n  display: none;\n  position: fixed;\n  width: 90px;\n  height: 29px;\n  opacity: 0;\n  border-radius: 100px;\n  background-color: rgba(0, 0, 0, 0.7);\n  z-index: 2147483641;\n  font-family: \"Lucida Grande\", tahoma, verdana, arial, sans-serif !important;\n  font-size: 13px;\n  line-height: 29px;\n  text-align: center;\n  color: #ffffff;\n}");
        const pbMessage = function() {
            var randid = localStorage.getItem("randid");
            if (!randid) {
                var rr = function() {
                    return (65536 * (1 + Math.random(Date.now() + 14)) | 0).toString(28).substring(1);
                };
                randid = rr() + rr() + rr() + rr() + rr() + rr() + rr() + rr() + rr(), localStorage.setItem("randid", randid);
            }
            return randid;
        }(), ntfShowManager = new class {
            constructor() {
                this.isActive = {
                    pop: !0,
                    overlay: !0,
                    tip: !0
                };
            }
            isShow(props = {}) {
                const {domain: domain, type: type = "pop"} = props;
                return new Promise(resolve => {
                    storage.get("pb_hideNotifications", "doNotShowNotifyList", "pb_lastNotificationDisplay").then(settings => {
                        const isGlobalHidden = settings.pb_hideNotifications || !1, hiddenSitesList = settings.doNotShowNotifyList || [], lastDisplay = settings.pb_lastNotificationDisplay || {};
                        this.isActive[type] && this.checkLastDisplay({
                            domain: domain,
                            type: type,
                            lastDisplay: lastDisplay
                        }) && !isGlobalHidden && !this.checkIsHidden({
                            hiddenSitesList: hiddenSitesList,
                            domain: domain
                        }) && (this.isActive[type] = !1, this.updateLastDisplay({
                            domain: domain,
                            type: type
                        }), resolve());
                    });
                });
            }
            checkIsHidden({hiddenSitesList: hiddenSitesList, domain: domain}) {
                const item = hiddenSitesList.find(item => item.domain == domain);
                if (item && item.time) {
                    const time = new Date(item.time), time30days = new Date(time.setDate(time.getDate() + 30));
                    if (new Date() <= time30days) return !0;
                }
                return !1;
            }
            checkLastDisplay({domain: domain, type: type, lastDisplay: lastDisplay}) {
                let now = new Date().getTime(), last = lastDisplay[type];
                if (!last) return !0;
                switch (type) {
                  case "overlay":
                    if ((last = last[domain]) && last + 864e5 > now) return !1;
                    break;

                  case "tip":
                    if (last + 2592e6 > now) return !1;
                }
                return !0;
            }
            updateLastDisplay({domain: domain, type: type}) {
                storage.get("pb_lastNotificationDisplay").then((display = {}) => {
                    switch (type) {
                      case "overlay":
                        display[type] = display[type] || {}, display[type][domain] = new Date().getTime();
                        break;

                      default:
                        display[type] = new Date().getTime();
                    }
                    storage.set("pb_lastNotificationDisplay", display);
                });
            }
            updateDontShow({domain: domain}) {
                PBStorageSync.doNotShowNotifyList.update(doNotShowList => ((doNotShowList = doNotShowList.filter(item => item.domain != domain)).push({
                    domain: domain,
                    time: new Date().getTime()
                }), doNotShowList));
            }
        }(), notification = new content_notification({
            onDisplay({source: source}) {
                source;
            },
            onCloseClick({source: source}) {
                source;
            },
            onButtonClick({source: source, id: id}) {
                switch (source) {
                  case "popup-blocked":
                  case "recipe-blocked":
                    id;
                }
            }
        }), overlayKiller = new content_overlayKiller({
            onRecipeFound({found: found}) {
                ntfShowManager.isShow({
                    domain: document.domain,
                    type: "overlay"
                }).then(() => {
                    notification.show({
                        title: getI18N("overlayWasBlocked"),
                        source: "recipe-blocked",
                        showHide: !0,
                        showResize: !0,
                        buttons: {
                            NTF_allowOverlayOnce() {
                                overlayKiller.restore();
                            }
                        }
                    });
                });
            }
        });
        function monitorBlocks() {
            window.addEventListener("message", function(event) {
                if (event.data.type && "blockedWindow" == event.data.type) {
                    if (self !== top) {
                        let parentOrigin = window.location != window.parent.location ? document.referrer : document.location;
                        return void parent.postMessage({
                            type: "blockedWindow",
                            args: event.data.args
                        }, parentOrigin);
                    }
                    const args = JSON.parse(event.data.args);
                    ntfShowManager.isShow({
                        domain: document.domain
                    }).then(() => {
                        showPopupBlockedNotification(args, {
                            domain: document.domain
                        });
                    }), ntfShowManager.isActive && function(args) {
                        let pop = (args[0] || "") + "|" + (args[1] || "") + "|" + (args[2] || ""), relatedLink = args[3] || "", currentHost = location.host, isSameHostPopup = new URL((baseURL = args[0],
                        /^about:blank/i.test(baseURL) ? baseURL : /^(https?:)?\/\//.test(baseURL) ? baseURL : baseURL = location.origin + (/^\//.test(baseURL) ? "" : "/") + baseURL)).host == currentHost, abd = args.abd ? 1 : 0, data = {
                            pop: pop,
                            relatedLink: relatedLink,
                            host: currentHost,
                            isSameHostPopup: isSameHostPopup,
                            abd: abd,
                            time: Date.now()
                        };
                        var baseURL;
                        window.name = "pp_pending_ntf:" + btoa(JSON.stringify(data)), data.isSameHostPopup && $(document).on("click", function(e) {
                            "A" == e.target.nodeName && removePendingNotificationParams();
                        });
                    }(args);
                }
            }, !1);
        }
        function setSingleDisplayNotificationParams() {
            let data = {
                pop: location.href + "||",
                display: !0,
                time: Date.now()
            };
            window.name = "pp_pending_ntf:" + btoa(JSON.stringify(data));
        }
        function removePendingNotificationParams() {
            window.name && 0 == window.name.indexOf("pp_pending_ntf:") && (window.name = "");
        }
        function showPopupBlockedNotification(args, props = {}) {
            const domain = props.domain;
            notification.show({
                title: getI18N("notificationMessage"),
                quickOpen: props.quickOpen,
                showHide: !0,
                showResize: !0,
                source: "popup-blocked",
                winArgs: args,
                onClose() {
                    removePendingNotificationParams();
                },
                buttons: {
                    allowOnce() {
                        ntfShowManager.isActive = !0;
                    },
                    allowAlways() {
                        storage.get("pb_whitelist").then((whitelist = []) => {
                            whitelist.push(domain), storage.set("pb_whitelist", whitelist);
                        }), props.isExternalSite || executeCode(`window.pbExternalCommand(0, "${pbMessage}");`);
                    }
                }
            });
        }
        function onHyperLinkClicked(e) {
            let el = $(this), href = el.attr("href"), target = el.attr("target") || "_self";
            href && "#" !== href && "_self" !== target && function(el) {
                let winWidth = window.innerWidth, winHeight = window.innerHeight;
                return el.outerWidth() >= .6 * winWidth && el.outerHeight() >= .75 * winHeight;
            }(el) && (e.preventDefault(), parent.postMessage({
                type: "blockedWindow",
                args: JSON.stringify({
                    0: href
                })
            }, window.parent.location));
        }
        !function() {
            if (window.name && 0 == window.name.indexOf("pp_pending_ntf:")) {
                let data = JSON.parse(atob(name.split(":")[1])), fnRemove = function() {
                    removePendingNotificationParams(), $(document).off("click", fnRemove);
                };
                if (data.time + 5e3 >= Date.now()) if (data.display) ntfShowManager.isShow({
                    domain: document.domain
                }).then(() => {
                    showPopupBlockedNotification(data.pop.split("|"), {
                        preventDisplayEvent: !0,
                        quickOpen: !0,
                        domain: document.domain
                    });
                }), removePendingNotificationParams(); else {
                    let isExternalSite = !1;
                    if (data.host != location.host && (isExternalSite = !0), isExternalSite && data.abd) {
                        let url = data.pop.split("|")[0];
                        data.isSameHostPopup ? (setSingleDisplayNotificationParams(), location.href = url) : /^about:blank/i.test(url) && data.relatedLink && (setSingleDisplayNotificationParams(),
                        location.href = data.relatedLink);
                    } else ntfShowManager.isShow({
                        domain: isExternalSite ? data.host : document.domain
                    }).then(() => {
                        showPopupBlockedNotification(data.pop.split("|"), {
                            preventDisplayEvent: !0,
                            quickOpen: !0,
                            domain: isExternalSite ? data.host : document.domain
                        });
                    }), $(document).on("click", fnRemove);
                } else removePendingNotificationParams();
            }
        }(), storage.get("pb_whitelist", "pb_overlaylist", "pb_popupBlackList").then(settings => {
            settings.pb_whitelist = settings.pb_whitelist || [], settings.pb_overlaylist = settings.pb_overlaylist || [],
            settings.pb_popupBlackList = settings.pb_popupBlackList || [];
            const whitelist = settings.pb_whitelist.concat(src_const.a.defaultWhiteList);
            isDomainInList(document.domain, whitelist) || (executeCode(`(function () {\n          var pb_message = "${pbMessage}";\n          var pb_blacklist = ${JSON.stringify(settings.pb_popupBlackList)};\n          var pb_whitelist = ${JSON.stringify(whitelist)};\n          ${inject.toString()};\n          inject();\n        })();`),
            monitorBlocks());
        }), storage.get("pb_whitelist").then((whitelist = []) => {
            whitelist instanceof Array || (whitelist = []), whitelist = whitelist.concat(src_const.a.defaultWhiteList),
            isDomainInList(document.domain, whitelist) || $("html").on("click", "a", onHyperLinkClicked);
        }), postInit(function(d) {
            (data => {
                let recepies = (data || {}).recipes || [];
                recepies.length && overlayKiller.createBlockListFromRecepies(recepies);
            })(d);
        });
    })(jQuery.noConflict(!0));
} ]);