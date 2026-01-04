// ==UserScript==
// @name         FUT 20 AutoBuyer
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  Guaranteed money making bot!
// @author       Amr
// @match        https://www.easports.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.easports.com/fifa/ultimate-team/web-app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405217/FUT%2020%20AutoBuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/405217/FUT%2020%20AutoBuyer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.getMaxSearchBid = function(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.searchCount = 0;
    window.searchFailed = 0;
    window.purchaseCount = 0;

    window.initStatisics = function() {
        window.futStatistics = {
            soldItems: '-',
            unsoldItems: '-',
            activeTransfers: '-',
            availableItems: '-',
            coins: '-',
        };

        window.timers = {
            search: window.createTimeout(0, 0),
            coins: window.createTimeout(0, 0),
            transferList: window.createTimeout(0, 0),
        };
    };

    window.bids = [];

    window.createTimeout = function(time, interval) {
        return {
            start: time,
            finish: time + interval,
        };
    };

    window.clearSoldItems = function() {
        services.Item.clearSoldItems().observe(this, function(t, response) {});
    }

    function getLeagueIdByAbbr(abbr) {
        var leagues = Object.values(repositories.TeamConfig._leagues._collection['11']._leagues._collection);
        var leagueId = 0;
        for(var i = 0; i < leagues.length; i++) {
            if (abbr === leagues[i].abbreviation) {
                leagueId = leagues[i].id;
                break;
            }
        }

        return leagueId;
    }

    window.UTAutoBuyerViewController = function () {
        UTMarketSearchFiltersViewController.call(this);
        this._jsClassName = "UTAutoBuyerViewController";
    }

    utils.JS.inherits(UTAutoBuyerViewController, UTMarketSearchFiltersViewController)
    window.UTAutoBuyerViewController.prototype.init = function init() {
        if (!this.initialized) {
            //getAppMain().superclass(),
            this._viewmodel || (this._viewmodel = new viewmodels.BucketedItemSearch),
                this._viewmodel.searchCriteria.type === enums.SearchType.ANY && (this._viewmodel.searchCriteria.type = enums.SearchType.PLAYER);
            var t = gConfigurationModel.getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE)
            , count = 1 + (utils.JS.isValid(t) ? t[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET] : 15);
            this._viewmodel.searchCriteria.count = count,
                this._viewmodel.searchFeature = enums.ItemSearchFeature.MARKET;
            var view = this.getView();
            view.addTarget(this, this._eResetSelected, UTMarketSearchFiltersView.Event.RESET),
                view.addTarget(this, window.activateAutoBuyer, UTMarketSearchFiltersView.Event.SEARCH),
                view.addTarget(this, this._eFilterChanged, UTMarketSearchFiltersView.Event.FILTER_CHANGE),
                view.addTarget(this, this._eMinBidPriceChanged, UTMarketSearchFiltersView.Event.MIN_BID_PRICE_CHANGE),
                view.addTarget(this, this._eMaxBidPriceChanged, UTMarketSearchFiltersView.Event.MAX_BID_PRICE_CHANGE),
                view.addTarget(this, this._eMinBuyPriceChanged, UTMarketSearchFiltersView.Event.MIN_BUY_PRICE_CHANGE),
                view.addTarget(this, this._eMaxBuyPriceChanged, UTMarketSearchFiltersView.Event.MAX_BUY_PRICE_CHANGE),
                this._viewmodel.getCategoryTabVisible() && (view.initTabMenuComponent(),
                                                            view.getTabMenuComponent().addTarget(this, this._eSearchCategoryChanged, enums.Event.TAP)),
                this._squadContext ? isPhone() || view.addClass("narrow") : view.addClass("floating"),
                view.getPlayerNameSearch().addTarget(this, this._ePlayerNameChanged, enums.Event.CHANGE),
                view.__root.style = "width: 60%; float: left;";
        }
    };

    function addTabItem() {
        var title = jQuery('h1.title').html();
        if (title == 'Home' || title == 'ACCUEIL') {
            getAppMain().getRootViewController().showGameView = function showGameView() {
                if (this._presentedViewController instanceof UTGameTabBarController)
                    return !1;
                var t, i = new UTGameTabBarController,
                    s = new UTGameFlowNavigationController,
                    o = new UTGameFlowNavigationController,
                    l = new UTGameFlowNavigationController,
                    u = new UTGameFlowNavigationController,
                    h = new UTGameFlowNavigationController,
                    p = new UTTabBarItemView,
                    _ = new UTTabBarItemView,
                    g = new UTTabBarItemView,
                    m = new UTTabBarItemView,
                    S = new UTTabBarItemView;
                if (s.initWithRootController(new UTHomeHubViewController),
                    o.initWithRootController(new UTSquadsHubViewController),
                    l.initWithRootController(new UTTransfersHubViewController),
                    u.initWithRootController(new UTStoreViewController),
                    h.initWithRootController(new UTClubHubViewController),
                    p.init(),
                    p.setTag(UTGameTabBarController.TabTag.HOME),
                    p.setText(services.Localization.localize("navbar.label.home")),
                    p.addClass("icon-home"),
                    _.init(),
                    _.setTag(UTGameTabBarController.TabTag.SQUADS),
                    _.setText(services.Localization.localize("nav.label.squads")),
                    _.addClass("icon-squad"),
                    g.init(),
                    g.setTag(UTGameTabBarController.TabTag.TRANSFERS),
                    g.setText(services.Localization.localize("nav.label.trading")),
                    g.addClass("icon-transfer"),
                    m.init(),
                    m.setTag(UTGameTabBarController.TabTag.STORE),
                    m.setText(services.Localization.localize("navbar.label.store")),
                    m.addClass("icon-store"),
                    S.init(),
                    S.setTag(UTGameTabBarController.TabTag.CLUB),
                    S.setText(services.Localization.localize("nav.label.club")),
                    S.addClass("icon-club"),
                    s.tabBarItem = p,
                    o.tabBarItem = _,
                    l.tabBarItem = g,
                    u.tabBarItem = m,
                    h.tabBarItem = S,
                    t = [s, o, l, u, h],
                    !isPhone()) {
                    var C = new UTGameFlowNavigationController,
                        T = new UTGameFlowNavigationController,
                        AB = new UTGameFlowNavigationController, //added row
                        v = new UTGameFlowNavigationController;
                    C.initWithRootController(new UTSBCHubViewController),
                        T.initWithRootController(new UTLeaderboardsHubViewController),
                        AB.initWithRootController(new UTAutoBuyerViewController), //added line
                        v.initWithRootController(new UTAppSettingsViewController);
                    var L = new UTTabBarItemView;
                    L.init(),
                        L.setTag(UTGameTabBarController.TabTag.SBC),
                        L.setText(services.Localization.localize("nav.label.sbc")),
                        L.addClass("icon-sbc");
                    var I = new UTTabBarItemView;
                    I.init(),
                        I.setTag(UTGameTabBarController.TabTag.LEADERBOARDS),
                        I.setText(services.Localization.localize("nav.label.leaderboards")),
                        I.addClass("icon-leaderboards");

                    //added section
                    var AutoBuyerTab = new UTTabBarItemView;
                    AutoBuyerTab.init(),
                        AutoBuyerTab.setTag(8),
                        AutoBuyerTab.setText('AutoBuyer'),
                        AutoBuyerTab.addClass("icon-transfer");

                    var P = new UTTabBarItemView;
                    P.init(),
                        P.setTag(UTGameTabBarController.TabTag.SETTINGS),
                        P.setText(services.Localization.localize("button.settings")),
                        P.addClass("icon-settings"),
                        C.tabBarItem = L,
                        T.tabBarItem = I,
                        v.tabBarItem = P,
                        AB.tabBarItem = AutoBuyerTab, //added line
                        t = t.concat([C, T, v, AB]) //added line
                }
                return i.initWithViewControllers(t),
                    i.getView().addClass("game-navigation"),
                    this.presentViewController(i, !0, function() {
                    services.URL.hasDeepLinkURL() && services.URL.processDeepLinkURL()
                }),
                    !0
            };

            getAppMain().getRootViewController().showGameView();
        } else {
            window.setTimeout(addTabItem, 1000);
        }
    };

    function createAutoBuyerInterface() {
        var title = jQuery('h1.title').html();
        if (title == 'Home' || title == 'ACCUEIL') {
            window.hasLoadedAllEnglish = true;
        }

        if (window.hasLoadedAllEnglish && getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._jsClassName) {
            if (!jQuery('.SearchWrapper').length) {
                var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._view;
                jQuery(view.__root.parentElement).prepend(
                    '<div id="InfoWrapper" class="ut-navigation-bar-view navbar-style-landscape" style="position: fixed; z-index: 100000; width: 93%">' +
                    '   <h1 class="title">AUTOBUYER STATUS: <span id="ab_status"></span> | SEARCH COUNT: <span id="ab_request_count">0</span></h1>' +
                    '   <div class="view-navbar-currency" style="margin-left: 10px;">' +
                    '       <div class="view-navbar-currency-coins" id="ab_coins"></div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Search:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="ab_search_progress" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Statistics:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="ab_statistics_progress" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo" style="border: none;">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Buy Attempts: <span id="ab-buy-attempts">0</span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Successful Buys: <span id="ab-successful-buys">0</span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Sold Items: <span id="ab-sold-items"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Unsold Items: <span id="ab-unsold-items"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo" style="border: none;">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Available Items: <span id="ab-available-items"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Active transfers: <span id="ab-active-transfers"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="ut-navigation-bar-view navbar-style-landscape" style="z-index: -100; opacity: 0;">' +
                    '</div>'

                );

                jQuery(view.__root.parentElement).append('<div id="SearchWrapper" style="width: 40%; right: 40%"><textarea readonly id="progressAutobuyer" style="font-size: 15px; width: 100%; height: 58%; font-family: UltimateTeam,sans-serif;"></textarea><label>Search Results:</label><br/><textarea readonly id="autoBuyerFoundLog" style="font-size: 10px; width: 100%;height: 26%; font-family: UltimateTeam,sans-serif;"></textarea></div>');

                writeToLog('Thank you for using FUT Sniping Bot. Due to technical reasons, we have decided to switch to using a new Chrome Extension instead, which uses email and password authentication. For more information, please message me on eBay so that we can help you to install the new extension. Also, please include a desired email and password which you wil be using to login to our chrome extension (make sure it is a valid email so that you can use it to reset your password if you ever forget it).');
                writeToLog('');
                writeToLog("Merci d'utiliser FUT Sniping Bot. Pour des raisons techniques, nous avons décidé de passer à la place à une nouvelle extension Chrome, qui utilise l'authentification par e-mail et mot de passe. Pour plus d'informations, veuillez m'envoyer un message sur eBay afin que nous puissions vous aider à installer la nouvelle extension. Veuillez également inclure un e-mail et un mot de passe que vous utiliserez pour vous connecter à notre extension chrome (assurez-vous qu'il s'agit d'un e-mail valide afin de pouvoir l'utiliser pour réinitialiser votre mot de passe si vous l'oubliez).");
                writeToLog('');
                writeToLog("Gracias por usar FUT Sniping Bot. Debido a razones técnicas, hemos decidido cambiar a una nueva extensión de Chrome, que utiliza autenticación de correo electrónico y contraseña. Para obtener más información, envíeme un mensaje en eBay para que podamos ayudarlo a instalar la nueva extensión. Además, incluya un correo electrónico y una contraseña deseados que utilizará para iniciar sesión en nuestra extensión de Chrome (asegúrese de que sea un correo electrónico válido para que pueda usarlo para restablecer su contraseña si alguna vez la olvida).");
                writeToLog('');
                writeToLog("Grazie per aver utilizzato FUT Sniping Bot. Per motivi tecnici, abbiamo deciso di passare a utilizzare una nuova estensione di Chrome, che utilizza l'autenticazione tramite email e password. Per ulteriori informazioni, inviami un messaggio su eBay in modo che possiamo aiutarti a installare la nuova estensione. Inoltre, includi un indirizzo email e una password desiderati che utilizzerai per accedere alla nostra estensione di Chrome (assicurati che sia un indirizzo email valido in modo da poterlo utilizzare per reimpostare la password se lo dimentichi).");
            }

            if (jQuery('.search-prices').first().length) {
                if (!jQuery('#ab_buy_price').length) {
                    jQuery('.search-prices').first().append(
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary" style="white-space: nowrap;">AutoBuyer Settings:</h1>' +
                        '</div>' +
                        '<p1 class="secondary" style="font-size: 1.2em; font-weight: normal; white-space: nowrap;">Minimum profit per purchase: <span id="profit">0</span></br>' +
                        '</br>' +
                        '</p1>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Sell Price:</span><br/><small style="color: #888c94">Leave this box empty to send players to the transfer list instead</small><br/><small style="color: #888c94">Money after tax: <span id="money_after_tax">0</span></small>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_sell_price" placeholder="7000">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Buy Price:<br/><small style="color: #888c94"><span id="reminder_1"></span><span id="reminder_value"></span><span id="reminder_2"></span></small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_buy_price" placeholder="5000">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Delay Time:<br/><small style="color: #888c94">Delay between searches</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_delay_time" placeholder="3-5">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Min Clear Count<br/><small style="color: #888c94">(Clear sold items if sold items count is more than than:)</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_min_delete_count" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Max Purchases Per Search</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_max_purchases" placeholder="3">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Searches Before Break<br/><small style="color: #888c94">Perform this many searches before the bot takes a break</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_search_number" placeholder="15">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<br>' +
                        '<br>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Break Duration (secs)</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_random_delay" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Purchases Until Stop<br/><small style="color: #888c94">Leave this empty if you want it to keep buying players</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_maxpurchases_count" placeholder="5">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label" style="color: #434853;">Search Failures Before Stop<br/><small style="color: #888c94">Stop when searches fail this many times in a row</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_searchfails_limit" placeholder="5">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>'
                    );
                }
            }

            if (!jQuery('#search_cancel_button').length) {
                jQuery('#InfoWrapper').next().next().find('.button-container button').first().after('<button class="btn-standard" id="search_cancel_button">Stop</button>')
            }
        } else {
            window.setTimeout(createAutoBuyerInterface, 1000);
        }
    }

    jQuery(document).on('keyup', '#ab_sell_price', function(){
        (jQuery('#money_after_tax').html((jQuery('#ab_sell_price').val() - ((parseInt(jQuery('#ab_sell_price').val()) / 100) * 5))).toLocaleString());
    });

    jQuery(document).on('keyup', '#ab_sell_price', function(){
        (jQuery('#profit').html((jQuery('#ab_sell_price').val() - ((parseInt(jQuery('#ab_sell_price').val()) / 100) * 5)) - (parseInt(jQuery('#ab_buy_price').val()))).toLocaleString());
    });

    jQuery(document).on('keyup', '#ab_buy_price', function(){
        (jQuery('#profit').html((jQuery('#ab_sell_price').val() - ((parseInt(jQuery('#ab_sell_price').val()) / 100) * 5)) - (parseInt(jQuery('#ab_buy_price').val()))).toLocaleString());
    });

    jQuery(document).on('keyup', '#ab_buy_price', function(){
        var buyPrice = parseInt(jQuery('#ab_buy_price').val());
        if (buyPrice !== 0 && !Number.isNaN(buyPrice) && jQuery('#ab_buy_price').val() !== ''){
            jQuery('#reminder_1').html('Remember to put ');
            jQuery('#reminder_value').html(buyPrice);
            jQuery('#reminder_2').html(' in the max buy now price box');
        } else{
            jQuery('#reminder_1').html('');
            jQuery('#reminder_value').html('');
            jQuery('#reminder_2').html('');
        }
    });

    window.updateAutoTransferListStat = function() {
        if (!window.autoBuyerActive) {
            return;
        }

        window.updateTransferList();
    };

    window.writeToLog = function(message) {
        var $log = jQuery('#progressAutobuyer');
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.writeToDebugLog = function(message) {
        var $log = jQuery('#autoBuyerFoundLog');
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.notify = function(message) {
        services.Notification.queue([message, enums.UINotificationType.POSITIVE])
    };

    window.hasLoadedAllEnglish = false;
    window.hasLoadedAllFrench = false;
    window.hasLoadedAllItalian = false;
    window.hasLoadedAllDutch = false;
    window.hasLoadedAllSpanish = false;
    window.searchCount = 0;
    window.attempts = 0;
    window.successfulBuys = 0;
    createAutoBuyerInterface();
    addTabItem();
})();