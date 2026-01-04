// ==UserScript==
// @name         FUT 21 Autobuyer Menu with TamperMonkey (Syntax Edit 2) - DEV
// @namespace    http://tampermonkey.net/
// @version      3.0.4
// @description  FUT Snipping Tool
// @author       CK Algos
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/416218/FUT%2021%20Autobuyer%20Menu%20with%20TamperMonkey%20%28Syntax%20Edit%202%29%20-%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/416218/FUT%2021%20Autobuyer%20Menu%20with%20TamperMonkey%20%28Syntax%20Edit%202%29%20-%20DEV.meta.js
// ==/UserScript==

(function () {
    'use strict';


    /////////////////////////////////////////
    // @OVERRIDE : Routine Min Buy Feature //
    /////////////////////////////////////////
    window.useDirectBuy = false;
    window.fastVersionDisablePinEvents = true;
    window.useFastBuyPlayer = true;
    window.useFastSearchMarket = true;
    window.useNoCache = true;
    window.useRequestTimestamp = true;
    window.useAntiCacheCountCriteria = true;

    window.doLog = function (name) {
        if (1 == 1) { return 0; }
        console.log('        ');
        console.log('----------------------------');
        console.log('--------' + name + '--------');
        console.log('----------------------------');
        console.log(JSON.stringify({
            'routineEnabled': window.routineEnabled,
            // 'currentPlayerPrices' : window.currentPlayerPrices,
            'playersToSell': window.playersToSell,
            'backupSettings': window.backupSettings,
            'backupSettingsPlayerName': window.backupSettingsPlayerName,
            'routineRunning': window.routineRunning,
            'routineSkipNext': window.routineSkipNext
        }));
        console.log('----------------------------');
        console.log('--------' + name + '--------');
        console.log('----------------------------');
        console.log('        ');
    }

    window.startTime = false;

    window.showElapsedTime = function (name) {
        var millis = Date.now() - window.startTimer;
        // console.log(`######### [${name}] seconds elapsed = ${(millis / 1000)}`);
    }

    window.routineEnabled = true;
    window.currentPlayerPrices = [];
    window.playersToSell = false;
    window.backupSettings = false;
    window.backupSettingsPlayerName = false;
    window.routineRunning = false;
    window.routineSkipNext = false;
    window.sellPriceList = [];
    window.lastMinBuyCounterOriginal = 2;
    window.lastMinBuyCounter = window.lastMinBuyCounterOriginal;

    window.globalCountCriteria = 21;
    window.getNextCountCriteria = function () {
        window.globalCountCriteria++;
        if (window.globalCountCriteria > 20) window.globalCountCriteria = 3;
        return window.globalCountCriteria;
    }

    // View Functions
    window.getSearchPlayerNameView = function () {
        return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().getView().getPlayerNameSearch();
    }
    window.getSearchPlayerNameSelected = function () {
        return window.getSearchPlayerNameView().getSelected();
    }
    window.setSearchPlayerNameSelected = function (data) {
        window.getSearchPlayerNameView().setPlayerData(data);
        getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().getView().getPlayerNameSearch().setPlayerData(data);
    }
    window.getSearchView = function () {
        return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().getView();
    }

    // Search Criteria Functions
    window.getSearchCriteria = function () {
        return getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;
    }
    window.backupCurrentSearchCriteria = function () {
        window.backupSettings = JSON.stringify(window.getSearchCriteria());
        window.backupSettingsPlayerName = window.getSearchPlayerNameSelected();
    }
    window.restoreSearchCriteria = function (searchCriteriaSettings, searchCriteriaPlayerName) {

        window.doLog('restoreSearchCriteria');
        window.getSearchView()._eResetButtonSelected();
        window.getSearchView().resetPlayerName();

        if (typeof searchCriteriaSettings === "undefined" && window.backupSettings)
            var searchCriteriaSettings = window.backupSettings;

        if (typeof searchCriteriaSettings !== "undefined" && searchCriteriaSettings !== false) {
            if (typeof searchCriteriaSettings == "string")
                searchCriteriaSettings = JSON.parse(searchCriteriaSettings);

            window.updateObject(window.getSearchCriteria(), searchCriteriaSettings);
            window.updateSearchCriteriaView();
            window.backupSettings = false;
        }

        if (typeof searchCriteriaPlayerName === "undefined" && window.backupSettingsPlayerName)
            var searchCriteriaPlayerName = window.backupSettingsPlayerName;

        if (typeof searchCriteriaPlayerName !== "undefined" && searchCriteriaPlayerName) {
            window.setSearchPlayerNameSelected(searchCriteriaPlayerName);
            window.updateSearchCriteriaView();
            window.backupSettingsPlayerName = false;
        }
    }


    // Routine Functions
    window.routineGetSellPriceFromPlayer = function (player, price) {
        var playerResourceId = window.getItemResourceId(player);
        window.doLog('routineGetSellPriceFromPlayer');

        if (window.currentPlayerPrices[playerResourceId] === undefined) {
            if (window.routineRunning === false) {
                window.lastMinBuyPrice = 99999999;
                window.lastMinBuyItem = null;

                // Routine pour obtenir le prix minium du joueur
                window.routineRunning = true;
                window.playersToSell = {
                    'item': player,
                    'buyPrice': price,
                    'sellPrice': false
                };

                // 1. On fait un backup du searchCriteria actuel
                window.backupCurrentSearchCriteria();

                // 2. Reset de la recherche (seulement le prix MaxBuy + le player name)
                // window.getSearchView()._eResetButtonSelected();
                window.getSearchCriteria().maxBuy = 0;
                window.getSearchView().resetPlayerName();

                // 3. Recherche le joueur
                window.getSearchCriteria().maskedDefId = playerResourceId;
                window.updateSearchCriteriaView();

            }

            return 0;
        } else {
            return window.currentPlayerPrices[playerResourceId];
        }
    }



    window.routineCheckMinBuyInSearchResult = function (items) {

        window.doLog('routineCheckMinBuyInSearchResult : DEBUT');
        var expiresLimit = 60 * 57; // 58 Min

        if (items.length > 0) {
            window.lastMinBuyPrice = items[0]._auction.buyNowPrice;
            window.lastMinBuyItem = items[0];
        }

        if (
            (items.length == 0 || (items[0]._auction.expires >= expiresLimit)) && window.lastMinBuyPrice != 99999999
        ) {
            writeToDebugLog("| (" + window.lastMinBuyCounter + ") Min buy found  : " + window.lastMinBuyPrice);
            window.lastMinBuyCounter--;

            // 1. On save le Min Buy pour ce joueur
            var playerResourceId = lastMinBuyItem.resourceId;

            if (items.length == 0) {
                var sellPrice = window.lastMinBuyPrice - window.getNextStepPrice(window.lastMinBuyPrice, 'down');
            } else {
                var sellPrice = window.lastMinBuyPrice;
            }

            // Il faut au moins faire du profit
            var profitTmp = (sellPrice / 100 * 95) - window.playersToSell.buyPrice;
            if (profitTmp <= 50) {
                writeToDebugLog("| No profit for this sellPrice  : " + sellPrice);
                window.lastMinBuyCounter++;
            } else {
                window.sellPriceList.push(sellPrice);
            }


            if (window.lastMinBuyCounter === 0) {

                var sellPriceFinal = Math.max.apply(null, window.sellPriceList);
                writeToDebugLog("| Final Min buy found  : " + sellPriceFinal);

                window.currentPlayerPrices[playerResourceId] = sellPriceFinal;
                window.playersToSell.sellPrice = sellPriceFinal;

                window.sellPriceList = [];
                window.lastMinBuyCounter = window.lastMinBuyCounterOriginal;

                // 2. On désactive la routine
                window.routineRunning = false;
                window.routineSkipNext = true;

                // 4. On restaure la recherche
                window.restoreSearchCriteria();

                // 5. Update view
                window.updateSearchCriteriaView();

                // 6. On vend le joueur au bon prix
                window.routineCheckPlayersToSell();
            } else {
                window.getSearchCriteria().maxBuy = '';
                window.updateSearchCriteriaView();
            }
        } else {
            var nextMaxBuyPrice = window.lastMinBuyPrice - window.getNextStepPrice(window.lastMinBuyPrice, 'down');
            window.getSearchCriteria().maxBuy = nextMaxBuyPrice;
            window.updateSearchCriteriaView();
        }
        window.doLog('routineCheckMinBuyInSearchResult : FIN');

    }

    window.routineCheckPlayersToSell = function () {
        if (window.playersToSell !== false && window.routineRunning === false) {
            var sellPrice = window.playersToSell.sellPrice;
            var price = window.playersToSell.buyPrice;
            var player = window.playersToSell.item;

            window.playersToSell = false;
            window.profit += (sellPrice / 100 * 95) - price;

            window.sellRequestTimeout = window.setTimeout(function () {
                window.sellPlayer(player, player.id, sellPrice);
                let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                writeToLog(sym + " | " + window.getItemName(player) + ' | ' + window.format_string(price.toString(), 6) + ' | buy | success | Found Min Buy -> selling for: ' + sellPrice);

                if (jQuery('#telegram_buy').val() == 'B' || jQuery('#telegram_buy').val() == 'A') {
                    let player_name = window.getItemName(player);
                    let sellPrice_txt = window.format_string(sellPrice.toString(), 6)
                    let price_txt = window.format_string(price.toString(), 6)
                    window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + '>' + sellPrice_txt.trim()  + ' | tot. profit : ' + window.profit);
                }
            }, 1000);
        }
    }


    ///////////////////////////////
    // @OVERRIDE : NEW FUNCTIONS //
    ///////////////////////////////

    // Timer Benchmark
    window.timerContainer = [];
    window.timerStart = function (name) {
        window.timerContainer[name] = new Date();
    }
    window.timerStop = function (name) {
        if (window.timerContainer[name] !== undefined) {
            var end = new Date();
            var time = end.getTime() - window.timerContainer[name].getTime();
            console.log('Timer:', name, 'finished in', time, 'ms');
        }
    }


    // Multi Sell Price
    window.getSellPriceFromPlayer = function (player, sellPriceValue) {
        if (sellPriceValue.indexOf(':') > -1) {
            var playerResourceId = window.getItemResourceId(player);
            sellPriceValue = sellPriceValue.split(',');
            var defaultSellPrice = 0;
            for (var i in sellPriceValue) {
                var sellPriceByPlayer = sellPriceValue[i].split(':');
                if (sellPriceByPlayer[0] != 'default' && parseInt(sellPriceByPlayer[0]) == playerResourceId)
                    return parseInt(sellPriceByPlayer[1]);
                else if (sellPriceByPlayer[0] == 'default')
                    defaultSellPrice = sellPriceByPlayer[0];
            }
            return parseInt(defaultSellPrice);
        } else {
            return parseInt(sellPriceValue);
        }
    }


    // Search Min Buy Action
    window.searchMinBuyEnabled = false;
    window.lastMinBuyPrice = 99999999;
    window.searchMinBuy = function () {
        if (window.searchMinBuyEnabled === true) {
            $('#search_minbuy_button').html('Search MinBuy Disabled');
            window.deactivateAutoBuyer(true);

            setTimeout(function () {
                window.searchMinBuyEnabled = false;
            }, 1000);
        } else {
            $("#ab_buy_price").val('');
            $("#ab_max_bid_price").val('');
            $('#search_minbuy_button').html('Search MinBuy Enabled');
            window.lastMinBuyPrice = 99999999;
            window.searchMinBuyEnabled = true;

            setTimeout(function () {
                window.activateAutoBuyer(true);
            }, 1000);
        }

    }
    jQuery(document).on('click', '#search_minbuy_button', searchMinBuy);


    window.checkMinBuyInSearchResult = function (items) {
        if (items.length > 0) {
            window.lastMinBuyPrice = items[0]._auction.buyNowPrice;
        }

        if (items.length < 20) {
            writeToDebugLog("| Min buy found : " + window.lastMinBuyPrice);
            $('#search_minbuy_button').html('Search MinBuy Disabled');
            window.deactivateAutoBuyer(true);

            setTimeout(function () {
                window.searchMinBuyEnabled = false;
            }, 1000);
        } else {
            var nextMaxBuyPrice = window.lastMinBuyPrice - window.getNextStepPrice(window.lastMinBuyPrice, 'down');
            var searchCriteria = window.getSearchCriteria();
            searchCriteria.maxBuy = nextMaxBuyPrice;
            window.updateSearchCriteriaView();
        }
    }

    window.updateSearchCriteriaView = function () {
        // Backup Player Name
        var backupPlayerName = window.getSearchPlayerNameSelected();
        if (window.backupSettingsPlayerName) backupPlayerName = window.backupSettingsPlayerName;

        getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController().viewDidAppear();

        // Restore Player Name
        if (backupPlayerName)
            window.setSearchPlayerNameSelected(backupPlayerName);
    }

    window.getNextStepPrice = function (val, direction) {
        if (val >= 100000) {
            if (val > 100000 || direction == 'up') return 1000;
            else return 500;
        }
        if (val >= 50000) {
            if (val > 50000 || direction == 'up') return 500;
            else return 250;
        }
        if (val >= 10000) {
            if (val > 10000 || direction == 'up') return 250;
            else return 100;
        }
        if (val >= 1000) {
            if (val > 1000 || direction == 'up') return 100;
            else return 50;
        }
        else {
            return 50;
        }
    }

    // Remove Filter Action
    window.removeFilter = function () {
        jQuery("#remove_filter").addClass("active");
        setTimeout(function () {
            var filterName = prompt("Enter a name for the filter to remove", $('select[name=filters] option').filter(':selected').val());
            GM_deleteValue(filterName);
            $('#filter-dropdown option[value="' + filterName + '"]').remove();

            jQuery("#remove_filter").removeClass("active");

            window.notify("Filter removed successfully");
        }, 200);
    }

    jQuery(document).on({
        mouseenter: function () {
            jQuery("#remove_filter").addClass("hover");
        },
        mouseleave: function () {
            jQuery("#remove_filter").removeClass("hover");
        },
        click: function () {
            removeFilter()
        }
    }, "#remove_filter");

    // @OVERRIDE FIN


    window.UTAutoBuyerViewController = function () {
        UTMarketSearchFiltersViewController.call(this);
        this._jsClassName = "UTAutoBuyerViewController";
    };

    window.sellList = [];
    window.autoBuyerActive = false;
    window.botStartTime = null;
    window.searchCountBeforePause = 10;
    window.defaultStopTime = 10;
    window.currentPage = 1;
    window.reListEnabled = false;
    window.currentChemistry = -1;
    window.purchasedCardCount = 0;
    window.bidExact = false;

    window.useRandMinBuy = false;
    window.useRandMinBid = false;
    window.captchaCloseTab = false;
    window.toggleMessageNotification = false;
    window.botStopped = true;

    var _searchViewModel = null;

    window.loadFilter = function () {
        var filterName = $('select[name=filters] option').filter(':selected').val()

        let settingsJson = GM_getValue(filterName);

        if (!settingsJson) {
            return;
        }

        settingsJson = JSON.parse(settingsJson);

        window.useDirectBuy = false;
        jQuery("#ab_direct_buy").removeClass("toggled");

        if (settingsJson.abSettings.buyPrice) {
            $("#ab_buy_price").val(settingsJson.abSettings.buyPrice);
        } else {
            $("#ab_buy_price").val('');
        }

        if (settingsJson.abSettings.cardCount) {
            $("#ab_card_count").val(settingsJson.abSettings.cardCount);
        }

        if (settingsJson.abSettings.maxBid) {
            $("#ab_max_bid_price").val(settingsJson.abSettings.maxBid);
        } else {
            $("#ab_max_bid_price").val('');
        }

        if (settingsJson.abSettings.itemExpiring) {
            $("#ab_item_expiring").val(settingsJson.abSettings.itemExpiring);
        }

        if (settingsJson.abSettings.bidExact) {
            window.bidExact = settingsJson.abSettings.bidExact;
            jQuery("#ab_bid_exact").addClass("toggled");
        }

        if (settingsJson.abSettings.sellPrice) {
            jQuery('#ab_sell_price').val(settingsJson.abSettings.sellPrice);
        } else {
            jQuery('#ab_sell_price').val('');
        }

        if (settingsJson.abSettings.minDeleteCount) {
            jQuery('#ab_min_delete_count').val(settingsJson.abSettings.minDeleteCount);
        }

        if (settingsJson.abSettings.reListEnabled) {
            window.reListEnabled = settingsJson.abSettings.reListEnabled;
            jQuery("#ab_sell_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.waitTime) {
            jQuery('#ab_wait_time').val(settingsJson.abSettings.waitTime);
        }

        if (settingsJson.abSettings.maxPurchases) {
            jQuery('#ab_max_purchases').val(settingsJson.abSettings.maxPurchases);
        }

        if (settingsJson.abSettings.pauseCycle) {
            jQuery('#ab_cycle_amount').val(settingsJson.abSettings.pauseCycle);
        }

        if (settingsJson.abSettings.pauseFor) {
            jQuery('#ab_pause_for').val(settingsJson.abSettings.pauseFor);
        }

        if (settingsJson.abSettings.stopAfter) {
            jQuery('#ab_stop_after').val(settingsJson.abSettings.stopAfter);
        }

        if (settingsJson.abSettings.minRate) {
            jQuery('#ab_min_rate').val(settingsJson.abSettings.minRate);
        }

        if (settingsJson.abSettings.maxRate) {
            jQuery('#ab_max_rate').val(settingsJson.abSettings.maxRate);
        }

        if (settingsJson.abSettings.randMinBid) {
            jQuery('#ab_rand_min_bid_input').val(settingsJson.abSettings.randMinBid);
        }

        if (settingsJson.abSettings.randMinBuy) {
            jQuery('#ab_rand_min_buy_input').val(settingsJson.abSettings.randMinBuy);
        }

        if (settingsJson.abSettings.useRandMinBuy) {
            window.useRandMinBuy = settingsJson.abSettings.useRandMinBuy;
            jQuery("#ab_rand_min_buy_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.useRandMinBid) {
            window.useRandMinBid = settingsJson.abSettings.useRandMinBid;
            jQuery("#ab_rand_min_bid_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.captchaCloseTab) {
            window.captchaCloseTab = settingsJson.abSettings.captchaCloseTab;
            jQuery("#ab_close_tab_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.notificationEnabled) {
            window.notificationEnabled = settingsJson.abSettings.notificationEnabled;
            jQuery("#ab_message_notification_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.soundEnabled) {
            window.soundEnabled = settingsJson.abSettings.soundEnabled;
            jQuery("#ab_sound_toggle").addClass("toggled");
        }

        if (settingsJson.abSettings.telegramBotToken) {
            jQuery('#telegram_bot_token').val(settingsJson.abSettings.telegramBotToken);
        }
        if (settingsJson.abSettings.telegramChatID) {
            jQuery('#telegram_chat_id').val(settingsJson.abSettings.telegramChatID);
        }
        if (settingsJson.abSettings.telegramBuy) {
            jQuery('#telegram_buy').val(settingsJson.abSettings.telegramBuy);
        }

        // Search Criteria
        if (!settingsJson.searchCriteria)
            settingsJson.searchCriteria = false;
        if (!settingsJson.searchCriteriaPlayerName)
            settingsJson.searchCriteriaPlayerName = false;
        window.restoreSearchCriteria(settingsJson.searchCriteria, settingsJson.searchCriteriaPlayerName);
    };

    window.sendPinEvents = function (pageId) {
        services.PIN.sendData(enums.PIN.EVENT.PAGE_VIEW, {
            type: PIN_PAGEVIEW_EVT_TYPE,
            pgid: pageId
        });
    }

    window.sendNotificationToUser = function (message) {
        if (window.notificationEnabled) {
            let bot_token = jQuery('#telegram_bot_token').val();
            let bot_chatID = jQuery('#telegram_chat_id').val();
            if (bot_token && bot_chatID) {
                let url = 'https://api.telegram.org/bot' + bot_token +
                    '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + message;
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }
    }

    window.activateAutoBuyer = function (isStart) {
        if (window.autoBuyerActive) {
            return;
        }

        if (window.botStopped && !isStart) {
            return;
        }

        window.botStartTime = new Date();
        window.searchCountBeforePause = 10;
        window.currentChemistry = -1;
        window.currentPage = 1;
        if ($('#ab_cycle_amount').val() !== '') {
            window.searchCountBeforePause = parseInt($('#ab_cycle_amount').val());
        }
        window.defaultStopTime = window.searchCountBeforePause;
        window.autoBuyerActive = true;
        window.botStopped = false;

        if (isStart) {
            window.purchasedCardCount = 0;
            window.firstSearch = true;
            window.notify('Autobuyer Started');

            if (window.searchMinBuyEnabled === false)
                window.sendNotificationToUser('Autobuyer Started');
        }
        else {
            writeToDebugLog('Autobuyer Resumed -----------------------------------');
            window.notify('Autobuyer Resumed');
        }
    };

    window.deactivateAutoBuyer = function (isStopped) {
        if (window.botStopped && !window.autoBuyerActive) {
            return;
        }

        window.autoBuyerActive = false;
        window.botStartTime = null;
        window.searchCountBeforePause = 10;
        window.currentChemistry = -1;
        window.currentPage = 1;

        if (isStopped) {
            window.purchasedCardCount = 0;
            window.botStopped = true;
        }

        window.defaultStopTime = window.searchCountBeforePause;
        window.notify((isStopped) ? 'Autobuyer Stopped' : 'Autobuyer Paused');

        if (isStopped) {
            writeToDebugLog('Autobuyer Stopped -----------------------------------');

            if (window.searchMinBuyEnabled === false) {
                window.sendNotificationToUser('Autobuyer Stopped ; COUNT: ' + window.searchCount);
            }

            if (window.routineRunning === true) {
                window.routineRunning = false;
                window.routineSkipNext = false;
                window.lastMinBuyPrice = 99999999;
                window.lastMinBuyItem = null;
                window.playersToSell = false;

                window.sellPriceList = [];
                window.lastMinBuyCounter = window.lastMinBuyCounterOriginal;

                window.restoreSearchCriteria();
                window.updateSearchCriteriaView();
            }


        } else {
            writeToDebugLog('Autobuyer Paused -----------------------------------');
        }
    };

    window.play_audio = function (event_type) {
        if (window.soundEnabled) {
            var elem = document.getElementById("win_mp3");

            if (event_type == "capatcha") {
                elem = document.getElementById("capatcha_mp3");
            }

            elem.currentTime = 0;
            elem.play();
        }
    };

    window.clearLog = function () {
        window.searchCount = 0;
        var $progressLog = jQuery('#progressAutobuyer');
        var $buyerLog = jQuery('#autoBuyerFoundLog');
        $progressLog.val("");
        $buyerLog.val("");
    };

    utils.JS.inherits(UTAutoBuyerViewController, UTMarketSearchFiltersViewController)
    window.UTAutoBuyerViewController.prototype.init = function init() {
        if (!this.initialized) {
            //getAppMain().superclass(),
            this._viewmodel || (this._viewmodel = new viewmodels.BucketedItemSearch),
                window.updateObject(this._viewmodel.searchCriteria, window.loadSearchCriteriaDetails()),
                this._viewmodel.searchCriteria.type === enums.SearchType.ANY && (this._viewmodel.searchCriteria.type = enums.SearchType.PLAYER);

            _searchViewModel = this._viewmodel;

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
                view.__root.style = "width: 50%; float: left;";
        }
    };

    function addTabItem() {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            getAppMain().getRootViewController().showGameView = function showGameView() {
                if (this._presentedViewController instanceof UTGameTabBarController)
                    return !1;
                var t, i = new UTGameTabBarController,
                    s = new UTGameFlowNavigationController,
                    o = new UTGameFlowNavigationController,
                    l = new UTGameFlowNavigationController,
                    u = new UTGameFlowNavigationController,
                    h = new UTGameFlowNavigationController,
                    st = new UTGameFlowNavigationController,
                    p = new UTTabBarItemView,
                    _ = new UTTabBarItemView,
                    g = new UTTabBarItemView,
                    m = new UTTabBarItemView,
                    ST = new UTTabBarItemView,
                    S = new UTTabBarItemView;
                if (s.initWithRootController(new UTHomeHubViewController),
                    o.initWithRootController(new UTSquadsHubViewController),
                    l.initWithRootController(new UTTransfersHubViewController),
                    u.initWithRootController(new UTStoreViewController),
                    h.initWithRootController(new UTClubHubViewController),
                    st.initWithRootController(new UTCustomizeHubViewController),
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
                    ST.init(),
                    ST.setTag(UTGameTabBarController.TabTag.STADIUM),
                    ST.setText(services.Localization.localize("navbar.label.customizeHub")),
                    ST.addClass("icon-stadium"),
                    s.tabBarItem = p,
                    o.tabBarItem = _,
                    l.tabBarItem = g,
                    u.tabBarItem = m,
                    h.tabBarItem = S,
                    st.tabBarItem = ST,
                    t = [s, o, l, u, st, h],
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
                    this.presentViewController(i, !0, function () {
                        services.URL.hasDeepLinkURL() && services.URL.processDeepLinkURL()
                    }),
                    !0
            };

            getAppMain().getRootViewController().showGameView();
        } else {
            window.setTimeout(addTabItem, 1000);
        }
    };

    window.createAutoBuyerInterface = function () {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            window.hasLoadedAll = true;
        }

        if (window.hasLoadedAll && getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._jsClassName) {
            if (!jQuery('.SearchWrapper').length) {
                var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._view;
                jQuery(view.__root.parentElement).prepend(
                    '<div id="InfoWrapper" class="ut-navigation-bar-view navbar-style-landscape">' +
                    '   <h1 class="title">AUTOBUYER STATUS: <span id="ab_status"></span> | COUNT: <span id="ab_request_count">0</span></h1> | PROFIT: <span id="profit_count">0</span></h1>' +
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
                    '   <div class="view-navbar-currency" style="margin-left: 10px;">' +
                    '       <div class="view-navbar-currency-coins" id="ab_coins"></div>' +
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
                    '</div>'
                );

                jQuery(view.__root.parentElement).append('<div id="SearchWrapper" style="width: 50%; right: 50%"><textarea readonly id="progressAutobuyer" style="font-size: 15px; width: 100%;height: 58%;"></textarea><label>Search Results:</label><br/><textarea readonly id="autoBuyerFoundLog" style="font-size: 10px; width: 100%;height: 26%;"></textarea></div>');

                var $log = jQuery('#progressAutobuyer');
                if ($log.val() == '') {
                    let time_txt = '[' + new Date().toLocaleTimeString() + '] ';
                    let log_init_text = 'Autobuyer Ready\n' +
                        time_txt + '------------------------------------------------------------------------------------------\n' +
                        time_txt + ' Index  | Item name       | price  | op  | result  | comments\n' +
                        time_txt + '------------------------------------------------------------------------------------------\n';
                    $log.val(log_init_text)
                }

            }

            if (jQuery('.search-prices').first().length) {
                if (!jQuery('#ab_buy_price').length) {

                    jQuery('.ut-item-search-view').first().prepend(
                        '<div class="button-container">' +
                        '<select id="filter-dropdown" name="filters" style="padding: 10px;width: 100%;font-family: UltimateTeamCondensed,sans-serif;font-size: 1.6em;color: #e2dde2;text-transform: uppercase;background-color: #171826;"></select>' +
                        '</div>');
                    jQuery('.search-prices').first().append(
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Buy/Bid Settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Direct Buy</span>' +
                        '           <div id="ab_direct_buy" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Buy Price:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_buy_price" placeholder="">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">No. of cards to buy:<br/><small>(Works only with Buy price)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_card_count" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Bid Price:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_max_bid_price" placeholder="">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Bid Exact Price</span>' +
                        '           <div id="ab_bid_exact" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Bid items expiring in:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_item_expiring" placeholder="1H">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +

                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Sell settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Sell Price:</span><br/><small>Receive After Tax: <span id="sell_after_tax">0</span></small>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_sell_price" placeholder="">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Clear sold count:<br/><small>(Clear sold items when reach a specified count)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_min_delete_count" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div style="padding-top : 20px" class="ut-toggle-cell-view">' +
                        '    <span class="ut-toggle-cell-view--label">Relist Unsold Items</span>' +
                        '    <div id="ab_sell_toggle" class="ut-toggle-control">' +
                        '        <div class="ut-toggle-control--track">' +
                        '        </div>' +
                        '        <div class= "ut-toggle-control--grip" >' +
                        '        </div>' +
                        '    </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Safety settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Wait Time:<br/><small>(Random second range eg. 7-15)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_wait_time" placeholder="7-15">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max purchases per search request:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_max_purchases" placeholder="3">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Pause Cycle :<br/><small>(Number of searches performed before triggerring Pause)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_cycle_amount" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Pause For:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_pause_for" placeholder="0S">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Stop After:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_stop_after" placeholder="1H">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Rating Filtering:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Min Rating:<br/><small>Minimum Player Rating</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_min_rate" placeholder="10" value="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max Rating:<br/><small>Maximum Player Rating</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_max_rate" placeholder="100" value="100">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Search settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max value of random min bid:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_rand_min_bid_input" placeholder="300">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Use random min bid</span>' +
                        '           <div id="ab_rand_min_bid_toggle" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max value of random min buy:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_rand_min_buy_input" placeholder="300">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Use random min buy</span>' +
                        '           <div id="ab_rand_min_buy_toggle" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Captcha settings:</h1>' +
                        '</div>' +

                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Close Web App on Captcha Trigger</span>' +
                        '           <div id="ab_close_tab_toggle" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Notification settings:</h1>' +
                        '</div>' +
                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Sound Notification</span>' +
                        '           <div id="ab_sound_toggle" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Bot Token<br/><small>Token of your own bot</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="telegram_bot_token">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Chat ID<br/><small>Your Telegram ChatID </small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="telegram_chat_id">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Buy Notification<br/><small>Type A for buy/loss notification, B for buy only or L for lost notification only </small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="telegram_buy">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +

                        '<div class="button-container">' +
                        '    <button class="btn-standard call-to-action" id="test_notification">Test Notification</button>' +
                        '</div>' +

                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Send Notification</span>' +
                        '           <div id="ab_message_notification_toggle" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="button-container">' +
                        '    <button class="btn-standard call-to-action" id="preserve_changes">Save Filter</button>' +
                        '    <button class="btn-standard call-to-action" id="remove_filter">Remove Filter</button>' +
                        '</div>' +
                        '<audio id="win_mp3" hidden">\n' +
                        '  <source src="https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.ogg" type="audio/ogg">\n' +
                        '  <source src="https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3" type="audio/mpeg">\n' +
                        '  Your browser does not support the audio element.\n' +
                        '</audio>' +
                        '<audio id="capatcha_mp3" hidden">\n' +
                        '  <source src="https://proxy.notificationsounds.com/wake-up-tones/alarm-frenzy-493/download/file-sounds-897-alarm-frenzy.ogg" type="audio/ogg">\n' +
                        '  <source src="https://proxy.notificationsounds.com/wake-up-tones/alarm-frenzy-493/download/file-sounds-897-alarm-frenzy.mp3" type="audio/mpeg">\n' +
                        '  Your browser does not support the audio element.\n' +
                        '</audio>'
                    );


                    let dropdown = $('#filter-dropdown');

                    dropdown.empty();

                    dropdown.append('<option selected="true" disabled>Choose filter to load</option>');
                    dropdown.prop('selectedIndex', 0);

                    var filterArray = GM_listValues();

                    // Populate dropdown with list of filters
                    for (var i = 0; i < filterArray.length; i++) {
                        dropdown.append($('<option></option>').attr('value', filterArray[i]).text(filterArray[i]));
                    }
                }
            }

            if (!jQuery('#search_cancel_button').length) {
                jQuery('#InfoWrapper').next().find('.button-container button').last().after('<button class="btn-standard" id="search_cancel_button">Stop</button><button class="btn-standard" id="clear_log_button">Clear Log</button><button class="btn-standard" id="search_minbuy_button" style="overflow: visible;">Search Min Buy</button>')
            }

            // @OVERRIDE
            $('#InfoWrapper').attr('style', 'position:fixed; z-index: 9999; padding-right: 121px;');
            $('.ut-market-search-filters-view').attr('style', 'width: 50%;float: left;margin-top: 64px;position: relative;');
            $('#clear_log_button').parent().attr('style', 'position: fixed;right: 25%;width: 50%;top: 0;padding: 0px;');
            $('#SearchWrapper').attr('style', 'width: 50%;right: 50%;margin-top: 66px;');


        } else {
            window.setTimeout(createAutoBuyerInterface, 1000);
        }
    }

    window.saveDetails = function () {

        jQuery("#preserve_changes").addClass("active");

        setTimeout(function () {

            let settingsJson = {};
            settingsJson.searchCriteria = _searchViewModel.searchCriteria;

            settingsJson.searchCriteriaPlayerName = window.getSearchPlayerNameSelected();

            settingsJson.abSettings = {};

            if (jQuery('#ab_buy_price').val() !== '') {
                settingsJson.abSettings.buyPrice = jQuery('#ab_buy_price').val();
            }

            if (jQuery('#ab_card_count').val() !== '') {
                settingsJson.abSettings.cardCount = jQuery('#ab_card_count').val();
            }

            if (jQuery('#ab_max_bid_price').val() !== '') {
                settingsJson.abSettings.maxBid = jQuery('#ab_max_bid_price').val();
            }

            if (jQuery('#ab_item_expiring').val() !== '') {
                settingsJson.abSettings.itemExpiring = jQuery('#ab_item_expiring').val();
            }

            if (window.bidExact) {
                settingsJson.abSettings.bidExact = window.bidExact;
            }

            if (jQuery('#ab_sell_price').val() !== '') {
                settingsJson.abSettings.sellPrice = jQuery('#ab_sell_price').val();
            }

            if (jQuery('#ab_min_delete_count').val() !== '') {
                settingsJson.abSettings.minDeleteCount = jQuery('#ab_min_delete_count').val();
            }

            if (window.reListEnabled) {
                settingsJson.abSettings.reListEnabled = window.reListEnabled;
            }

            if (jQuery('#ab_wait_time').val() !== '') {
                settingsJson.abSettings.waitTime = jQuery('#ab_wait_time').val();
            }

            if (jQuery('#ab_max_purchases').val() !== '') {
                settingsJson.abSettings.maxPurchases = jQuery('#ab_max_purchases').val();
            }

            if (jQuery('#ab_cycle_amount').val() !== '') {
                settingsJson.abSettings.pauseCycle = jQuery('#ab_cycle_amount').val();
            }

            if (jQuery('#ab_pause_for').val() !== '') {
                settingsJson.abSettings.pauseFor = jQuery('#ab_pause_for').val();
            }

            if (jQuery('#ab_stop_after').val() !== '') {
                settingsJson.abSettings.stopAfter = jQuery('#ab_stop_after').val();
            }

            if (jQuery('#ab_min_rate').val() !== '') {
                settingsJson.abSettings.minRate = jQuery('#ab_min_rate').val();
            }

            if (jQuery('#ab_max_rate').val() !== '') {
                settingsJson.abSettings.maxRate = jQuery('#ab_max_rate').val();
            }

            if (jQuery('#ab_rand_min_bid_input').val() !== '') {
                settingsJson.abSettings.randMinBid = jQuery('#ab_rand_min_bid_input').val();
            }

            if (jQuery('#ab_rand_min_buy_input').val() !== '') {
                settingsJson.abSettings.randMinBuy = jQuery('#ab_rand_min_buy_input').val();
            }

            if (window.useRandMinBuy) {
                settingsJson.abSettings.useRandMinBuy = window.useRandMinBuy;
            }

            if (window.useRandMinBid) {
                settingsJson.abSettings.useRandMinBid = window.useRandMinBid;
            }
            if (jQuery('#telegram_bot_token').val() !== '') {
                settingsJson.abSettings.telegramBotToken = jQuery('#telegram_bot_token').val();
            }
            if (jQuery('#telegram_chat_id').val() !== '') {
                settingsJson.abSettings.telegramChatID = jQuery('#telegram_chat_id').val();
            }
            if (jQuery('#telegram_buy').val() !== '') {
                settingsJson.abSettings.telegramBuy = jQuery('#telegram_buy').val();
            }

            if (window.notificationEnabled) {
                settingsJson.abSettings.notificationEnabled = window.notificationEnabled;
            }
            if (window.soundEnabled) {
                settingsJson.abSettings.soundEnabled = window.soundEnabled;
            }

            if (window.captchaCloseTab) {
                settingsJson.abSettings.captchaCloseTab = window.captchaCloseTab;
            }


            var filterName = prompt("Enter a name for this filter", $('select[name=filters] option').filter(':selected').val());

            $('#filter-dropdown option[value="' + filterName + '"]').remove();
            $('#filter-dropdown').append($('<option></option>').attr('value', filterName).text(filterName));

            GM_setValue(filterName, JSON.stringify(settingsJson));

            jQuery("#preserve_changes").removeClass("active");

            window.notify("Changes saved successfully");
        }, 200);
    }

    window.loadSearchCriteriaDetails = function () {
        let settingsJson = GM_getValue("SavedSettings");

        if (!settingsJson) {
            return;
        }

        settingsJson = JSON.parse(settingsJson);

        return settingsJson.searchCriteria;
    }

    window.clearABSettings = function () {
        $("#ab_buy_price").val('');
        $("#ab_card_count").val('');
        $("#ab_max_bid_price").val('');
        $("#ab_item_expiring").val('');
        window.bidExact = false;
        jQuery("#ab_bid_exact").removeClass("toggled");
        jQuery("#ab_direct_buy").removeClass("toggled");
        jQuery('#ab_sell_price').val('');
        jQuery('#ab_min_delete_count').val('');
        window.reListEnabled = false;
        jQuery("#ab_sell_toggle").removeClass("toggled");
        jQuery('#ab_wait_time').val('');
        jQuery('#ab_max_purchases').val('');
        jQuery('#ab_cycle_amount').val('');
        jQuery('#ab_pause_for').val('');
        jQuery('#ab_stop_after').val('');
        jQuery('#ab_min_rate').val('');
        jQuery('#ab_max_rate').val('');
        jQuery('#ab_rand_min_bid_input').val('');
        jQuery('#ab_rand_min_buy_input').val('');
        window.useRandMinBuy = false;
        jQuery("#ab_rand_min_buy_toggle").removeClass("toggled");
        window.bidExact = false;
        jQuery("#ab_rand_min_bid_toggle").removeClass("toggled");
        window.captchaCloseTab = false;
        jQuery("#ab_close_tab_toggle").removeClass("toggled");
        window.notificationEnabled = false;
        jQuery("#ab_message_notification_toggle").removeClass("toggled");
        window.soundEnabled = false;
        jQuery("#ab_sound_toggle").removeClass("toggled");
    }

    jQuery(document).on('click', '#search_cancel_button', deactivateAutoBuyer);
    jQuery(document).on('click', '#clear_log_button', clearLog);
    jQuery(document).on('click', 'button:contains("Reset")', clearABSettings);

    jQuery(document).on({
        mouseenter: function () {
            jQuery("#preserve_changes").addClass("hover");
        },
        mouseleave: function () {
            jQuery("#preserve_changes").removeClass("hover");
        },
        click: function () {
            saveDetails()
        }
    }, "#preserve_changes");

    jQuery(document).on({
        mouseenter: function () {
            jQuery("#test_notification").addClass("hover");
        },
        mouseleave: function () {
            jQuery("#test_notification").removeClass("hover");
        },
        click: function () {
            let bot_token = jQuery('#telegram_bot_token').val();
            let bot_chatID = jQuery('#telegram_chat_id').val();
            let message = "Test Notification Arrived";
            if (bot_token && bot_chatID) {
                let url = 'https://api.telegram.org/bot' + bot_token +
                    '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + message;
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
            }
            window.notify("Test Notification Sent");
        }
    }, "#test_notification");

    jQuery(document).on({
        change: function () {
            loadFilter()
        }
    }, "#filter-dropdown");

    window.toggleBidExact = function () {
        if (window.bidExact) {
            window.bidExact = false;
            jQuery("#ab_bid_exact").removeClass("toggled");
        } else {
            window.bidExact = true;
            jQuery("#ab_bid_exact").addClass("toggled");
        }
    };

    window.toggleDirectBuy = function () {
        if (window.useDirectBuy) {
            window.useDirectBuy = false;
            jQuery("#ab_direct_buy").removeClass("toggled");
        } else {
            window.useDirectBuy = true;
            jQuery("#ab_direct_buy").addClass("toggled");
        }
    };

    window.toggleUseRandMinBid = function () {
        if (window.useRandMinBid) {
            window.useRandMinBid = false;
            jQuery("#ab_rand_min_bid_toggle").removeClass("toggled");
        } else {
            window.useRandMinBid = true;
            jQuery("#ab_rand_min_bid_toggle").addClass("toggled");
        }
    };

    window.toggleUseRandMinBuy = function () {
        if (window.useRandMinBuy) {
            window.useRandMinBuy = false;
            jQuery("#ab_rand_min_buy_toggle").removeClass("toggled");
        } else {
            window.useRandMinBuy = true;
            jQuery("#ab_rand_min_buy_toggle").addClass("toggled");
        }
    };

    window.updateObject = function (defaultObject) {
        for (var i = 1; i < arguments.length; i++) {
            for (var prop in arguments[i]) {
                var val = arguments[i][prop];
                if (defaultObject) {
                    if (prop == 'rarities')
                        defaultObject[prop] = val;
                    if (prop == 'subtypes')
                        defaultObject[prop] = val;
                    if (prop == 'defId')
                        defaultObject[prop] = val;
                    if (prop == 'excludeDefIds')
                        defaultObject[prop] = val;

                    if (typeof val == "object")
                        updateObject(defaultObject[prop], val);
                    else
                        defaultObject[prop] = val;
                }
            }
        }
        return defaultObject;
    }

    window.toggleRelist = function () {
        if (window.reListEnabled) {
            window.reListEnabled = false;
            jQuery("#ab_sell_toggle").removeClass("toggled");
        } else {
            alert("Re-listing will list all the cards in the transfer list not only the card which bought by the tool. " +
                "Check the transfer list once and move the required cards to your club to avoid losing any required cards.")

            window.reListEnabled = true;
            jQuery("#ab_sell_toggle").addClass("toggled");
        }
    }

    window.toggleCloseTab = function () {
        if (window.captchaCloseTab) {
            window.captchaCloseTab = false;
            jQuery("#ab_close_tab_toggle").removeClass("toggled");
        } else {
            window.captchaCloseTab = true;
            jQuery("#ab_close_tab_toggle").addClass("toggled");
        }
    }

    window.toggleSolveCaptcha = function () {
        if (window.solveCaptcha) {
            window.solveCaptcha = false;
            jQuery("#ab_solve_captcha").removeClass("toggled");
        } else {
            window.solveCaptcha = true;
            jQuery("#ab_solve_captcha").addClass("toggled");
        }
    }

    window.toggleSound = function () {
        if (window.soundEnabled) {
            window.soundEnabled = false;
            jQuery("#ab_sound_toggle").removeClass("toggled");
        } else {
            window.soundEnabled = true;
            jQuery("#ab_sound_toggle").addClass("toggled");
        }
    }

    window.toggleMessageNotification = function () {
        if (window.notificationEnabled) {
            window.notificationEnabled = false;
            jQuery("#ab_message_notification_toggle").removeClass("toggled");
        } else {
            window.notificationEnabled = true;
            jQuery("#ab_message_notification_toggle").addClass("toggled");
        }
    }


    jQuery(document).on('click', '#ab_bid_exact', toggleBidExact);
    jQuery(document).on('click', '#ab_direct_buy', toggleDirectBuy);
    jQuery(document).on('click', '#ab_sell_toggle', toggleRelist);

    jQuery(document).on('click', '#ab_rand_min_bid_toggle', toggleUseRandMinBid);
    jQuery(document).on('click', '#ab_rand_min_buy_toggle', toggleUseRandMinBuy);
    jQuery(document).on('click', '#ab_close_tab_toggle', toggleCloseTab);
    jQuery(document).on('click', '#ab_sound_toggle', toggleSound);
    jQuery(document).on('click', '#ab_message_notification_toggle', toggleMessageNotification);
    //jQuery(document).on('click', '#ab_solve_captcha', toggleSolveCaptcha);


    jQuery(document).on('keyup', '#ab_sell_price', function () {
        jQuery('#sell_after_tax').html((jQuery('#ab_sell_price').val() - ((parseInt(jQuery('#ab_sell_price').val()) / 100) * 5)).toLocaleString());
    });

    window.updateAutoTransferListStat = function () {
        if (!window.autoBuyerActive) {
            return;
        }

        sendPinEvents("Hub - Transfers");

        setTimeout(function () {
            window.updateTransferList();
        }, 300);
    };

    window.writeToLog = function (message) {
        let time_txt = '[' + new Date().toLocaleTimeString() + '] '
        var $log = jQuery('#progressAutobuyer');
        if ($log.val() == '') {
            let time_txt = '[' + new Date().toLocaleTimeString() + '] ';
            let log_init_text = 'Autobuyer Ready\n' +
                time_txt + '------------------------------------------------------------------------------------------\n' +
                time_txt + ' Index  | Item name                 | price  | op  | result  | comments\n' +
                time_txt + '------------------------------------------------------------------------------------------\n';
            $log.val(log_init_text)
        }
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.writeToDebugLog = function (message) {
        var $log = jQuery('#autoBuyerFoundLog');
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.notify = function (message) {
        services.Notification.queue([message, enums.UINotificationType.POSITIVE])
    };

    window.getRandomWait = function () {
        var addedTime = 0;

        var wait = [7, 15];
        if (jQuery('#ab_wait_time').val()) {
            wait = jQuery('#ab_wait_time').val().split('-').map(a => parseInt(a));
        }
        window.searchCount++;
        return (Math.round((Math.random() * (wait[1] - wait[0]) + wait[0])) * 1000);
    };

    window.getTimerProgress = function (timer) {
        var time = (new Date()).getTime();

        return (Math.max(0, timer.finish - time) / (timer.finish - timer.start)) * 100;
    };

    window.updateStatistics = function () {
        jQuery('#ab_search_progress').css('width', window.getTimerProgress(window.timers.search));
        jQuery('#ab_statistics_progress').css('width', window.getTimerProgress(window.timers.transferList));

        jQuery('#ab_request_count').html(window.searchCount);

        jQuery('#ab_coins').html(window.futStatistics.coins);

        jQuery('#profit_count').css('color', '#2cbe2d').html(window.profit);

        if (window.autoBuyerActive && window.routineRunning) {
            jQuery('#ab_status').css('color', 'orange').html('SEARCH MIN BUY');
        } else if (window.autoBuyerActive) {
            jQuery('#ab_status').css('color', '#2cbe2d').html('RUNNING');
        } else {
            jQuery('#ab_status').css('color', 'red').html('IDLE');
        }

        jQuery('#ab-sold-items').html(window.futStatistics.soldItems);
        jQuery('#ab-unsold-items').html(window.futStatistics.unsoldItems);
        jQuery('#ab-available-items').html(window.futStatistics.availableItems);
        jQuery('#ab-active-transfers').html(window.futStatistics.activeTransfers);

        if (window.futStatistics.unsoldItems) {
            jQuery('#ab-unsold-items').css('color', 'red');
        } else {
            jQuery('#ab-unsold-items').css('color', '');
        }

        if (window.futStatistics.availableItems) {
            jQuery('#ab-available-items').css('color', 'orange');
        } else {
            jQuery('#ab-available-items').css('color', '');
        }
    };


    window.hasLoadedAll = false;
    window.searchCount = 0;
    createAutoBuyerInterface();
    addTabItem();

    window.getMaxSearchBid = function (min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.getRandNum = function (min, max) {
        return Math.round((Math.random() * (max - min) + min));
    };
    window.getItemName = function (itemObj) {
        return window.format_string(itemObj._staticData.name, 15);
    };
    window.getItemResourceId = function (itemObj) {
        return parseInt(itemObj.resourceId);
    }
    window.winCount = 0;
    window.lossCount = 0;
    window.bidCount = 0;
    window.searchCount = 0;
    window.profit = 0

    window.errorCodeLookUp = {
        '521': 'Server Rejected the request',
        '512': 'Server Rejected the request',
        '429': 'Bidding Rejected, too many request received from this user',
        '426': 'Bidding Rejected, other user won the (card / bid)',
        '461': 'Bidding Rejected, other user won the (card / bid)',
    };

    window.errorCodeLookUpShort = {
        '521': 'Rejected',
        '512': 'Rejected',
        '429': 'Too many requests',
        '426': 'Others won card/bid',
        '461': 'Others won card/bid',
    };

    window.format_string = function (str, len) {
        if (str.length <= len) {
            str += " ".repeat(len - str.length)
        }
        return str;
    };


    window.initStatisics = function () {
        window.futStatistics = {
            soldItems: '-',
            unsoldItems: '-',
            activeTransfers: '-',
            availableItems: '-',
            coins: '-',
            coinsNumber: 0
        };

        window.timers = {
            search: window.createTimeout(0, 0),
            coins: window.createTimeout(0, 0),
            transferList: window.createTimeout(0, 0),
            bidCheck: window.createTimeout(0, 0)
        };
    };

    window.bids = [];
    window.sellBids = [];

    window.createTimeout = function (time, interval) {
        return {
            start: time,
            finish: time + interval,
        };
    };

    window.processor = window.setInterval(function () {
        if (window.autoBuyerActive) {

            window.stopIfRequired();

            window.pauseIfRequired();

            var time = (new Date()).getTime();

            if (window.timers.search.finish == 0 || window.timers.search.finish <= time) {

                let searchRequest = 1;

                while (searchRequest-- > 0) {
                    window.searchFutMarket(null, null, null);
                }

                window.timers.search = window.createTimeout(time, window.getRandomWait());
            }

            if (window.timers.coins.finish == 0 || window.timers.coins.finish <= time) {
                window.futStatistics.coins = services.User.getUser().coins.amount.toLocaleString();
                window.futStatistics.coinsNumber = services.User.getUser().coins.amount;
                window.timers.coins = window.createTimeout(time, 2500);
            }

            if (window.timers.transferList.finish == 0 || window.timers.transferList.finish <= time) {
                window.updateTransferList();

                window.timers.transferList = window.createTimeout(time, 30000);
            }

            if (window.timers.bidCheck.finish == 0 || window.timers.bidCheck.finish <= time) {
                window.watchBidItems();

                window.timers.bidCheck = window.createTimeout(time, 20000);
            }
        } else {
            window.initStatisics();
        }

        window.updateStatistics();
    }, 500);

    window.stopIfRequired = function () {
        var stopAfter = "1H";
        if ($('#ab_stop_after').val()) {
            stopAfter = $('#ab_stop_after').val();
        }
        let interval = stopAfter[stopAfter.length - 1].toUpperCase();
        let time = parseInt(stopAfter.substring(0, stopAfter.length - 1));

        let multipler = (interval === "M") ? 60 : ((interval === "H") ? 3600 : 1)
        if (time) {
            time = time * multipler;

            let currentTime = new Date();

            let timeElapsed = (currentTime.getTime() - window.botStartTime.getTime()) / 1000;

            if (timeElapsed >= time) {
                window.deactivateAutoBuyer(true);
            }
        }

        if (window.buyCardCount && window.purchasedCardCount >= window.buyCardCount && window.routineRunning === false) {
            window.deactivateAutoBuyer(true);
        }
    }

    window.pauseIfRequired = function () {
        if (window.searchCountBeforePause <= 0) {
            var pauseFor = "0S";
            if ($('#ab_pause_for').val()) {
                pauseFor = $('#ab_pause_for').val();
            }
            let interval = pauseFor[pauseFor.length - 1].toUpperCase();
            let time = parseInt(pauseFor.substring(0, pauseFor.length - 1));

            let multipler = (interval === "M") ? 60 : ((interval === "H") ? 3600 : 1)
            if (time) {
                time = time * multipler * 1000;

                window.deactivateAutoBuyer();

                setTimeout(() => {
                    window.activateAutoBuyer(false);
                }, time);
            } else {
                window.searchCountBeforePause = window.defaultStopTime;
            }
        }
    };

    window.searchFutMarket = function (sender, event, data) {
        if (!window.autoBuyerActive) {
            return;
        }

        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;

        services.Item.clearTransferMarketCache();
        if (window.useNoCache === true) {
            services.Configuration.serverSettings.reset();
            services.Item._marketRepository.cacheSize = 0;
            services.Item._marketRepository.reset();
        }

        //accessobjects.Captcha.getCaptchaData().observe(this, (function (sender, response) {
        //    debugger;
        //    var data = response;
        //}));

        var expiresIn = 3600;
        if ($('#ab_item_expiring').val() !== '') {
            var expiresInString = "1H";
            if ($('#ab_item_expiring').val()) {
                expiresInString = $('#ab_item_expiring').val();
            }
            let expiresInterval = expiresInString[expiresInString.length - 1].toUpperCase();
            let expiresInTime = parseInt(expiresInString.substring(0, expiresInString.length - 1));

            let multipler = (expiresInterval === "M") ? 60 : ((expiresInterval === "H") ? 3600 : 1)
            if (expiresInTime) {
                expiresIn = expiresInTime * multipler;
            }
        }

        // Randomize search criteria min bid to clear cache
        if (window.useRandMinBid) {
            let user_min_bid_txt = $('#ab_rand_min_bid_input').val();
            if (user_min_bid_txt == '') { user_min_bid_txt = '300' }
            let user_min_bid = Math.round(parseInt(user_min_bid_txt));
            searchCriteria.minBid = window.fixRandomPrice(window.getRandNum(0, user_min_bid));
            window.currentPage = 1;
        }
        if (window.useRandMinBuy) {
            let user_min_buy_txt = $('#ab_rand_min_buy_input').val();
            if (user_min_buy_txt == '') { user_min_buy_txt = '300' }
            let user_min_buy = Math.round(parseInt(user_min_buy_txt));
            searchCriteria.minBuy = window.fixRandomPrice(window.getRandNum(0, user_min_buy));
            window.currentPage = 1;
        }

        if (window.currentPage === 1) {
            sendPinEvents("Transfer Market Search");
        }

        window.mbid = searchCriteria.minBid;
        window.mBuy = searchCriteria.minBuy;

        if ($('#ab_card_count').val() !== '') {
            window.buyCardCount = parseInt(jQuery('#ab_card_count').val());
        } else {
            window.buyCardCount = undefined;
        }

        let min_rate_txt = jQuery('#ab_min_rate').val();
        let max_rate_txt = jQuery('#ab_max_rate').val();
        if (min_rate_txt == '') {
            min_rate_txt = "10"
        }
        if (max_rate_txt == '') {
            max_rate_txt = "100"
        }
        let selected_min_rate = parseInt(min_rate_txt);
        let selected_max_rate = parseInt(max_rate_txt);

        var maxPurchasesInput = $('#ab_max_purchases').val();
        var bidPrice = parseInt(jQuery('#ab_max_bid_price').val());
        var userBuyNowPrice = parseInt(jQuery('#ab_buy_price').val());

        window.startTimer = Date.now();

        var argsForSearchResult = {
            'bidPrice': bidPrice,
            'selected_min_rate': selected_min_rate,
            'selected_max_rate': selected_max_rate,
            'userBuyNowPrice': userBuyNowPrice,
            'maxPurchasesInput': maxPurchasesInput,
            'expiresIn': expiresIn
        };

        if (window.useFastSearchMarket === true) {

            // Construction des paramètres

            var params = {};
            var self = searchCriteria;

            if (window.useAntiCacheCountCriteria === true && window.routineRunning === false) {
                params["num"] = window.getNextCountCriteria();
            } else {
                params["num"] = 20;
            }
            params["start"] = self.offset;
            params["type"] = self.type === SearchType.ANY ? SearchType.PLAYER : self.type;
            if (self["defId"]["length"] > 0) {
                var gtColumn = self["defId"][0];
                if (self["type"] === SearchType["PLAYER"]) params["definitionId"] = gtColumn;
                else params["definitionId"] = gtColumn & (enums["ItemMask"]["DATABASE"] | enums["ItemMask"]["REVISION"])
            } else if (self["maskedDefId"] >
                0) params["maskedDefId"] = self["maskedDefId"] & enums["ItemMask"]["DATABASE"];
            else if (self["category"] !== SearchCategory["ANY"]) params["cat"] = self["category"];
            if (self["zone"] !== -1) switch (self["zone"]) {
                case ZONE_DEFENDER_VALUE:
                    params["zone"] = "defense";
                    break;
                case ZONE_MIDFIELDER_VALUE:
                    params["zone"] = "midfield";
                    break;
                case ZONE_ATTACKER_VALUE:
                    params["zone"] = "attacker";
                    break;
                default:
                    DebugUtils["Assert"](![],
                        "Unsupported zone ID in market search.");
                    break
            } else if (self["position"] !== SearchType["ANY"]) params["pos"] = self["position"];
            if (params["type"] === SearchType["PLAYER"] && self["level"] === enums["SearchLevel"]["SPECIAL"]) params["rare"] = self["level"];
            else if (self["level"] !== enums["SearchLevel"]["ANY"]) params["lev"] = self["level"];
            if (self["nation"] > 0) params["nat"] = self["nation"];
            if (self["league"] > 0)
                if (self["category"] === SearchCategory["MANAGER_LEAGUE"]) params["amount"] = self["league"];
                else params["leag"] = self["league"];
            if (self["club"] > 0) params["team"] = self["club"];
            if (self["playStyle"] > 0) params["playStyle"] = self["playStyle"];
            if (self["minBid"]) params["micr"] = self["minBid"];
            if (self["maxBid"]) params["macr"] = self["maxBid"];
            if (self["minBuy"] >
                0) params["minb"] = self["minBuy"];
            if (self["maxBuy"] > 0) params["maxb"] = self["maxBuy"];
            if (self["rarities"]["length"] > 0) params["rarityIds"] = self["rarities"];

            if (window.useRequestTimestamp === true) {
                params['_'] = Date.now();
            }

            // Construction de la requête

            var auth = services.Authentication;
            var obs = new EAObservable,
                req = new UTHttpRequest(auth);

            var urlPath = "/ut/game/fifa21/transfermarket";

            if (window.useNoCache === true) {
                req.setCache(0);
                req.reset();
            }
            req.setPath(urlPath);
            req.setRequestType(HttpRequestMethod.GET);
            req.setUrlVariables(params);

            req.observe(this, (function (sender, response) {
                sender.unobserve(this);
                if (window.routineRunning === false && window.useDirectBuy === true ) {

                    // FAST DIRECT BUY

                    if (response.success && window.autoBuyerActive) {
                        window.searchCountBeforePause--;

                        if (response.response.auctionInfo.length > 0) {
                            var auction = response.response.auctionInfo[0];
                            var buyNowPrice = auction.buyNowPrice;
                            buyPlayer(auction, buyNowPrice, true);
                            
                            setTimeout(function() {
                                let player_rating = parseInt(auction.itemData.rating);
                                let rating_ok_txt = "ok";
                                let rating_txt = "(" + player_rating + "-" + rating_ok_txt + ") ";
                                let buy_txt = window.format_string(buyNowPrice.toString(), 6);
                                let player_name = auction.itemData.lastName;
                                let currentBid = auction.currentBid || auction.startingBid;
                                let bid_txt = window.format_string(currentBid.toString(), 6);
                                
                                let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);
                                let expire_time = window.format_string(expires, 15);
                                
                                writeToDebugLog('= Received ' + response.response.auctionInfo.length + ' items - from page (' + window.currentPage + ')  =>  config: (minbid:' + window.mbid + '-minbuy:' + window.mBuy + '-maxbuy:' + window.getSearchCriteria().maxBuy + ') ');
                                let action_txt = 'attempt buy: ' + buy_txt;
                                writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                                writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                                if (!window.bids.includes(auction.tradeId)) {
                                    window.bids.push(auction.tradeId);
                                    
                                    if (window.bids.length > 300) {
                                        window.bids.shift();
                                    }
                                }
                            }, 1000);
                        } else {
                            writeToDebugLog('= Received ' + response.response.auctionInfo.length + ' items - from page (' + window.currentPage + ')  =>  config: (minbid:' + window.mbid + '-minbuy:' + window.mBuy + '-maxbuy:' + window.getSearchCriteria().maxBuy + ') ');
                        }
                    } else if (!response.success) {
                        if (response.status == HttpStatusCode.CAPTCHA_REQUIRED) {
                            console.log('CAPTCHA REQUIRED, COUNT: ' + window.searchCount);
                            window.sendNotificationToUser('Captcha, please solve the problem so that the bot can work again.');

                            if (window.captchaCloseTab) {
                                window.setTimeout(function () {
                                    window.location.href = "about:blank";
                                    return;
                                }, 1500);
                            }
                            writeToLog('------------------------------------------------------------------------------------------');
                            writeToLog('[!!!] Autostopping bot since Captcha got triggered');
                            writeToLog('------------------------------------------------------------------------------------------');
                        } else {

                            window.sendNotificationToUser('Autostopping bot as search failed, please check if you can access transfer market in Web App.');

                            writeToLog('------------------------------------------------------------------------------------------');
                            writeToLog('[!!!] Autostopping bot as search failed, please check if you can access transfer market in Web App');
                            writeToLog('------------------------------------------------------------------------------------------');
                        }
                        window.play_audio('capatcha');
                        window.deactivateAutoBuyer(true);
                    }



                } else {
                    if (response["success"]) {
                        response["data"] = {};
                        response["data"]["items"] = factories.Item.generateItemsFromAuctionData(response.response.auctionInfo, response.response.duplicateItemIdList || []);
                    } else {
                        response["data"] = {};
                        response["data"]["items"] = [];
                    }

                    window.processSearchTransferMarketResponse(sender, response, argsForSearchResult);
                }
            }));

            req.send();
        } else {
            services.Item.searchTransferMarket(searchCriteria, window.currentPage).observe(this, (function (sender, response) {
                window.processSearchTransferMarketResponse(sender, response, argsForSearchResult);
            }));
        }
    };

    // maxPurchasesInput
    window.processSearchTransferMarketResponse = function (sender, response, args) {

        var maxPurchasesInput = args['maxPurchasesInput'];
        var expiresIn = args['expiresIn'];
        var bidPrice = args['bidPrice'];
        var selected_min_rate = args['selected_min_rate'];
        var selected_max_rate = args['selected_max_rate'];
        var userBuyNowPrice = args['userBuyNowPrice'];

        if (response.success && window.autoBuyerActive) {
            if (window.fastVersionDisablePinEvents == false) sendPinEvents("Transfer Market Results - List View");
            window.searchCountBeforePause--;
            writeToDebugLog('= Received ' + response.data.items.length + ' items - from page (' + window.currentPage + ')  =>  config: (minbid:' + window.mbid + '-minbuy:' + window.mBuy + '-maxbuy:' + window.getSearchCriteria().maxBuy + ') ');

            var maxPurchases = 3;
            if (maxPurchasesInput !== '') {
                maxPurchases = Math.max(1, parseInt(maxPurchasesInput));
            }
            if (window.currentPage <= 20 && response.data.items.length === 21) {
                window.currentPage++;
            } else {
                window.currentPage = 1;
            }

            response.data.items.sort(function (a, b) {
                var priceDiff = a._auction.buyNowPrice - b._auction.buyNowPrice;

                if (priceDiff != 0) {
                    return priceDiff;
                }
                return a._auction.expires - b._auction.expires;
            });

            // @OVERRIDE : Search Min Buy
            if (window.searchMinBuyEnabled === true) {
                window.checkMinBuyInSearchResult(response.data.items);
            }

            // @OVERRIDE : Routine Min Buy
            if (window.routineRunning === true) {
                window.routineCheckMinBuyInSearchResult(response.data.items);
            }

            if (response.data.items.length > 0) {
                writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                writeToDebugLog('| rating   | player name     | bid    | buy    | time            | action');
                writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                if (window.fastVersionDisablePinEvents == false) sendPinEvents("Item - Detail View");
                window.firstSearch = true;
            }

            for (let i = 0; i < response.data.items.length; i++) {
                let action_txt = 'none';
                let player = response.data.items[i];
                let auction = player._auction;
                let player_rating = parseInt(player.rating);

                let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);

                let buyNowPrice = auction.buyNowPrice;
                let currentBid = auction.currentBid || auction.startingBid;
                let isBid = auction.currentBid;

                let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);
                let checkPrice = (window.bidExact) ? priceToBid : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);

                let bid_buy_txt = "(bid: " + window.format_string(currentBid.toString(), 6) + " / buy:" + window.format_string(buyNowPrice.toString(), 7) + ")"
                let player_name = window.getItemName(player);
                let expire_time = window.format_string(expires, 15);
                let bid_txt = window.format_string(currentBid.toString(), 6)
                let buy_txt = window.format_string(buyNowPrice.toString(), 6)

                let rating_ok = false;

                let rating_ok_txt = "no";
                if (player_rating >= selected_min_rate && player_rating <= selected_max_rate) {
                    rating_ok = true;
                    rating_ok_txt = "ok";
                }
                let rating_txt = "(" + player_rating + "-" + rating_ok_txt + ") ";

                // ============================================================================================================
                // checking reasons to skip
                // ============================================================================================================

                if (window.routineRunning === true) {
                    action_txt = 'skip >>> (Routine ON)';
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    continue;
                }

                if (window.routineSkipNext === true) {
                    action_txt = 'skip >>> (Routine ON - Skip Next)';
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    continue;
                }

                if (isNaN(userBuyNowPrice) && isNaN(priceToBid)) {
                    action_txt = 'skip >>> (No action required)';
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    continue;
                }

                if (!rating_ok) {
                    action_txt = 'skip >>> (rating does not fit criteria)';
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    continue;
                }
                if (maxPurchases < 1) {
                    action_txt = 'skip >>> (Exceeded num of buys/bids per search)';
                    let player_name = window.getItemName(player);
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    continue;
                }
                // ============================================================================================================

                if (rating_ok && window.autoBuyerActive && buyNowPrice <= userBuyNowPrice && buyNowPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId)) {
                    action_txt = 'attempt buy: ' + buy_txt;
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);

                    buyPlayer(player, buyNowPrice, true);

                    maxPurchases--;
                    if (!window.bids.includes(auction.tradeId)) {
                        window.bids.push(auction.tradeId);

                        if (window.bids.length > 300) {
                            window.bids.shift();
                        }
                    }
                } else if (rating_ok && window.autoBuyerActive && bidPrice && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId)) {

                    if (auction.expires > expiresIn) {
                        action_txt = 'skip >>> (Waiting for specified expiry time)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }

                    action_txt = 'attempt bid: ' + bidPrice;
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    // window.timerStop('ATTEMPT');
                    buyPlayer(player, checkPrice);
                    maxPurchases--;
                    //setTimeout(function (){}, 1000);
                    if (!window.bids.includes(auction.tradeId)) {
                        window.bids.push(auction.tradeId);

                        if (window.bids.length > 300) {
                            window.bids.shift();
                        }
                    }
                } else {
                    if (buyNowPrice > userBuyNowPrice || currentBid > priceToBid) {
                        action_txt = 'skip >>> (higher than specified buy/bid price)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }
                    if (buyNowPrice > window.futStatistics.coinsNumber) {
                        action_txt = 'skip >>> (Insufficient coins)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }

                    action_txt = 'skip >>>';
                    writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                }
                window.firstSearch = false;
            }

            if (window.routineSkipNext === true) {
                window.routineSkipNext = false;
            }

            if (response.data.items.length > 0) {
                writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
            }
        } else if (!response.success) {
            if (response.status == HttpStatusCode.CAPTCHA_REQUIRED) {
                console.log('CAPTCHA REQUIRED, COUNT: ' + window.searchCount);
                window.sendNotificationToUser('Captcha, please solve the problem so that the bot can work again.');

                if (window.captchaCloseTab) {
                    window.setTimeout(function () {
                        window.location.href = "about:blank";
                        return;
                    }, 1500);
                }
                writeToLog('------------------------------------------------------------------------------------------');
                writeToLog('[!!!] Autostopping bot since Captcha got triggered');
                writeToLog('------------------------------------------------------------------------------------------');
            } else {

                window.sendNotificationToUser('Autostopping bot as search failed, please check if you can access transfer market in Web App.');

                writeToLog('------------------------------------------------------------------------------------------');
                writeToLog('[!!!] Autostopping bot as search failed, please check if you can access transfer market in Web App');
                writeToLog('------------------------------------------------------------------------------------------');
            }
            window.play_audio('capatcha');
            window.deactivateAutoBuyer(true);
        }


    }


    window.fixRandomPrice = function (price) {
        let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
            return price >= e.min
        });
        var nearestPrice = Math.round(price / range.inc) * range.inc;
        return Math.max(Math.min(nearestPrice, 14999000), 0);
    }

    window.watchBidItems = function () {

        services.Item.clearTransferMarketCache();

        services.Item.requestWatchedItems().observe(this, function (t, response) {

            var bidPrice = parseInt(jQuery('#ab_max_bid_price').val());
            var sellPrice = parseInt(jQuery('#ab_sell_price').val());

            let activeItems = response.data.items.filter(function (item) {
                return item._auction && item._auction._tradeState === "active";
            });

            services.Item.refreshAuctions(activeItems).observe(this, function (t, refreshResponse) {
                services.Item.requestWatchedItems().observe(this, function (t, watchResponse) {
                    if (window.autoBuyerActive && bidPrice) {

                        let outBidItems = watchResponse.data.items.filter(function (item) {
                            return item._auction._bidState === "outbid" && item._auction._tradeState === "active";
                        });

                        for (var i = 0; i < outBidItems.length; i++) {

                            let player = outBidItems[i];
                            let auction = player._auction;

                            let isBid = auction.currentBid;

                            let currentBid = auction.currentBid || auction.startingBid;

                            let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);

                            let checkPrice = (window.bidExact) ? bidPrice : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);

                            if (window.autoBuyerActive && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber) {
                                writeToDebugLog('Bidding on outbidded item -> Bidding Price :' + checkPrice);
                                buyPlayer(player, checkPrice);
                                if (!window.bids.includes(auction.tradeId)) {
                                    window.bids.push(auction.tradeId);

                                    if (window.bids.length > 300) {
                                        window.bids.shift();
                                    }
                                }
                            }
                        }
                    }

                    if (window.autoBuyerActive && sellPrice && !isNaN(sellPrice)) {

                        let boughtItems = response.data.items.filter(function (item) {
                            return item.getAuctionData().isWon() && !window.sellBids.includes(item._auction.tradeId);
                        });

                        for (var i = 0; i < boughtItems.length; i++) {
                            let player = boughtItems[i];
                            let auction = player._auction;

                            window.sellBids.push(auction.tradeId);
                            let player_name = window.getItemName(player);
                            writeToLog(" ($$$) " + player_name + '[' + player._auction.tradeId + '] -- Selling for: ' + sellPrice);

                            player.clearAuction();

                            window.sellRequestTimeout = window.setTimeout(function () {
                                services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                            }, window.getRandomWait());
                        }

                        services.Item.clearTransferMarketCache();
                    }
                });
            });
        });
    };


    window.sellPlayer = function (player, itemId, sellPrice) {
        var tradeId = player._auction.tradeId;
        var auth = services.Authentication;
        var obs = new EAObservable,
            req = new UTHttpRequest(auth);

        var urlPath = "/ut/game/fifa21/item";

        req.setPath(urlPath);
        req.setRequestType(HttpRequestMethod.PUT);
        req.setRequestBody({
            itemData: [{
                id: itemId,
                pile: 'trade'
            }],
        });

        req.observe(this, (function (sender, data) {
            sender.unobserve(this);
            services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
        }));
        req.send();
    }

    window.buyPlayer = function (player, price, isBin) {
        if (window.useFastBuyPlayer === true) {
            if (window.useFastSearchMarket === true && window.useDirectBuy === true && window.routineRunning == false) {
                var tradeId = player.tradeId;
            } else {
                var tradeId = player._auction.tradeId;
            }
            var auth = services.Authentication;
            var obs = new EAObservable,
                req = new UTHttpRequest(auth);

            var urlPath = "/ut/game/fifa21/trade/" + tradeId + "/bid";

            if (window.useRequestTimestamp === true) {
                urlPath += "?_=" + Date.now();
            }

            if (window.useNoCache === true) {
                req.setCache(0);
                req.reset();
            }
            req.setPath(urlPath);
            req.setRequestType(HttpRequestMethod.PUT);
            req.setRequestBody({
                bid: price
            });

            req.observe(this, (function (sender, data) {
                sender.unobserve(this);
                window.showElapsedTime('In Bid Request (FAST VERSION)');

                if (window.useFastSearchMarket === true && window.useDirectBuy === true && window.routineRunning == false) {
                    var playerItems = factories.Item.generateItemsFromAuctionData([player], []);
                    console.log(playerItems);
                    player = playerItems[0];
                }

                let price_txt = window.format_string(price.toString(), 6)
                let player_name = window.getItemName(player);
                if (data.success) {

                    if (isBin) {
                        window.purchasedCardCount++;
                    }

                    if (window.routineEnabled == true && jQuery('#ab_sell_price').val() == 'auto') {
                        var sellPrice = window.routineGetSellPriceFromPlayer(player, price);
                    } else {
                        var sellPrice = window.getSellPriceFromPlayer(player, jQuery('#ab_sell_price').val());
                    }

                    if (window.routineRunning) {
                        window.bidCount++;
                        let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                        writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | Search Min Buy before sell' : ' | bid | success | waiting to expire'));
                        window.play_audio('card_won');
                    } else {
                        if (isBin && sellPrice !== 0 && !isNaN(sellPrice)) {
                            window.winCount++;
                            let sym = " W:" + window.format_string(window.winCount.toString(), 4);
                            writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | selling for: ' + sellPrice : ' | bid | success |' + ' selling for: ' + sellPrice));
                            window.play_audio('card_won');

                            window.profit += (sellPrice / 100 * 95) - price;

                            window.sellRequestTimeout = window.setTimeout(function () {
                                window.sellPlayer(player, player.id, sellPrice);
                            }, window.getRandomWait());

                            if (jQuery('#telegram_buy').val() == 'B' || jQuery('#telegram_buy').val() == 'A') {
                                let sellPrice_txt = window.format_string(sellPrice.toString(), 6)
                                window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + '>' + sellPrice_txt.trim() + ' | tot. profit : ' + window.profit);
                            }

                        } else {
                            window.bidCount++;
                            // @OVERRIDE : On move pas vers le club
                            let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                            writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to pile' : ' | bid | success | waiting to expire'));
                            // services.Item.move(player, enums.FUTItemPile.CLUB).observe(this, (function (sender, moveResponse) {
                            //     let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                            //     writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to pile' : ' | bid | success | waiting to expire'));
                            // }));
                            
                            if (jQuery('#telegram_buy').val() == 'B' || jQuery('#telegram_buy').val() == 'A') {
                                window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | buy | Total Profit : ' + window.profit);
                            }
                        }
    
                    }

                } else {
                    window.lossCount++;

                    var millis = Date.now() - window.startTimer;
                    millis = ` ( ${(millis / 1000)} seconds ) `;

                    let sym = " L:" + window.format_string(window.lossCount.toString(), 4);
                    writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | failure |' : ' | bid | failure |') + ' ERR: ' + data.status + '-' + (errorCodeLookUpShort[data.status] || '') + millis);
                    if (jQuery('#telegram_buy').val() == 'L' || jQuery('#telegram_buy').val() == 'A') {
                        window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | failure |');
                    }
                }

                // window.timerStop('BUY');
            }));
            req.send();
        } else {

            // OLD VERSION

            services.Item.bid(player, price).observe(this, (function (sender, data) {
                window.showElapsedTime('In Bid Request');
                let price_txt = window.format_string(price.toString(), 6)
                let player_name = window.getItemName(player);
                if (data.success) {

                    if (isBin) {
                        window.purchasedCardCount++;
                    }

                    if (window.routineEnabled == true && jQuery('#ab_sell_price').val() == 'auto') {
                        var sellPrice = window.routineGetSellPriceFromPlayer(player, price);
                    } else {
                        var sellPrice = window.getSellPriceFromPlayer(player, jQuery('#ab_sell_price').val());
                    }

                    if (window.routineRunning) {
                        window.bidCount++;
                        let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                        writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | Search Min Buy before sell' : ' | bid | success | waiting to expire'));
                        window.play_audio('card_won');
                    } else {
                        if (isBin && sellPrice !== 0 && !isNaN(sellPrice)) {
                            window.winCount++;
                            let sym = " W:" + window.format_string(window.winCount.toString(), 4);
                            writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | selling for: ' + sellPrice : ' | bid | success |' + ' selling for: ' + sellPrice));
                            window.play_audio('card_won');

                            window.profit += (sellPrice / 100 * 95) - price;


                            window.sellRequestTimeout = window.setTimeout(function () {
                                services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                            }, window.getRandomWait());
                        } else {
                            window.bidCount++;
                            // @OVERRIDE : On move pas vers le club
                            let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                            writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to pile' : ' | bid | success | waiting to expire'));
                            // services.Item.move(player, enums.FUTItemPile.CLUB).observe(this, (function (sender, moveResponse) {
                            //     let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                            //     writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to pile' : ' | bid | success | waiting to expire'));
                            // }));
                        }
                    }

                    if (jQuery('#telegram_buy').val() == 'B' || jQuery('#telegram_buy').val() == 'A') {
                        window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | buy | tot. profit : ' + window.profit);
                    }

                } else {
                    window.lossCount++;
                    let sym = " L:" + window.format_string(window.lossCount.toString(), 4);

                    var millis = Date.now() - window.startTimer;
                    millis = ` ( ${(millis / 1000)} seconds ) `;

                    writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | failure |' : ' | bid | failure |') + ' ERR: ' + data.status + '-' + (errorCodeLookUpShort[data.status] || '') + millis);
                    if (jQuery('#telegram_buy').val() == 'L' || jQuery('#telegram_buy').val() == 'A') {
                        window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | failure |');
                    }
                }
            }));
        }
    };

    window.getSellBidPrice = function (bin) {
        if (bin <= 1000) {
            return bin - 50;
        }

        if (bin > 1000 && bin <= 10000) {
            return bin - 100;
        }

        if (bin > 10000 && bin <= 50000) {
            return bin - 250;
        }

        if (bin > 50000 && bin <= 100000) {
            return bin - 500;
        }

        return bin - 1000;
    };

    window.getBuyBidPrice = function (bin) {
        if (bin < 1000) {
            return bin + 50;
        }

        if (bin >= 1000 && bin < 10000) {
            return bin + 100;
        }

        if (bin >= 10000 && bin < 50000) {
            return bin + 250;
        }

        if (bin >= 50000 && bin < 100000) {
            return bin + 500;
        }

        return bin + 1000;
    };

    window.updateTransferList = function () {
        sendPinEvents("Transfer List - List View");
        services.Item.requestTransferItems().observe(this, function (t, response) {
            let sendEvent = true;
            let soldItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isSold();
            });

            window.futStatistics.soldItems = soldItems.length;

            if (sendEvent && window.futStatistics.soldItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            window.futStatistics.unsoldItems = response.data.items.filter(function (item) {
                return !item.getAuctionData().isSold() && item.getAuctionData().isExpired();
            }).length;


            if (sendEvent && window.futStatistics.unsoldItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            if (window.futStatistics.unsoldItems && window.reListEnabled) {
                services.Item.relistExpiredAuctions().observe(this, function (t, response) {
                });
            }

            window.futStatistics.activeTransfers = response.data.items.filter(function (item) {
                return item.getAuctionData().isSelling();
            }).length;

            if (sendEvent && window.futStatistics.activeTransfers) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            window.futStatistics.availableItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isInactive();
            }).length;

            if (sendEvent && window.futStatistics.availableItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            var minSoldCount = 10;
            if ($('#ab_min_delete_count').val() !== '') {
                minSoldCount = Math.max(1, parseInt($('#ab_min_delete_count').val()));
            }

            if (window.futStatistics.soldItems >= minSoldCount) {
                writeToLog('------------------------------------------------------------------------------------------');
                writeToLog('[TRANSFER-LIST] > ' + window.futStatistics.soldItems + " item(s) sold");
                writeToLog('------------------------------------------------------------------------------------------');
                window.clearSoldItems();
            }

            sendPinEvents("Hub - Transfers");
        });
    };

    window.clearSoldItems = function () {
        services.Item.clearSoldItems().observe(this, function (t, response) {
        });
    }
})();
