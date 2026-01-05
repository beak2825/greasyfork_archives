// ==UserScript==
// @name           Wealth Evalugaytor
// @version        0.72
// @namespace      dogescripts
// @author         RevoDeeps
// @description    Add stack value, tab value, and sell to GE to comapp bank view
// @include        https://secure.runescape.com/m=world*/a=*/html5/comapp/*
// @include        https://secure.runescape.com/m=world*/html5/comapp/*
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/21716/Wealth%20Evalugaytor.user.js
// @updateURL https://update.greasyfork.org/scripts/21716/Wealth%20Evalugaytor.meta.js
// ==/UserScript==

(function () {
    var angular;

    var initWatcher = window.setInterval(function () {
        console.log('watch');
        if (unsafeWindow.angular && unsafeWindow.angular.element(document.body).injector()) {
            angular = unsafeWindow.angular;
            window.clearInterval(initWatcher);
            init();
        }
    }, 100);

    var init = function () {
        var formatVal = function (val) {
            if (val > 10000000000) {
                return (val / 1000000000).toFixed(1) + "B";
            }
            if (val > 10000000) {
                return (val / 1000000).toFixed() + "M";
            }
            if (val > 100000) {
                return (val / 1000).toFixed() + "k";
            }
            return val.toString();
        };
        var valColor = function (val) {
            if (val > 10000000000) {
                return "indianred";
            }
            if (val > 10000000) {
                return "springgreen";
            }
            if (val > 100000) {
                return "white";
            }
            return "yellow";
        };

        var $compile = angular.element(document.body).injector().get("$compile");
        var $root = angular.element(document.body).scope().$root;

        var updatedItems = 0;
        var totalItems = -1;

        var bankService = null;
        var geService = null;
        var timeoutHandle = -1;

        var priceCache = {};

        var unregisterListener = function () {
        };

//set price data when items array updated
        var itemListener = function (newVal) {
            if (newVal && newVal.length > 0) {
                //disable listener from triggering while data updated
                unregisterListener();
                updatedItems = 0;
                totalItems = newVal.length;
                for (var item of newVal) {
                    if (!setPrice(item.id)) {
                        //obfuscated method [6]
                        bankService._qmg(item.index); //fetch item info from interwebs
                    }
                }
            }
        };

        var setPrice = function (itemID) {
            if (priceCache[itemID]) {
                var bankList = document.querySelector("#bank-list");
                if (bankList) {
                    var bankScope = angular.element(bankList).scope();
                    var itemIndex = bankScope.items.findIndex(function (elem) {
                        return elem.id === itemID;
                    });
                    //append price and stack value info
                    if (itemIndex !== -1) {
                        var item = bankScope.items[itemIndex];
                        var itemPriceData = priceCache[itemID];
                        for (var attrname in itemPriceData) {
                            item[attrname] = itemPriceData[attrname];
                        }
                        item.stackVal = item.count * item.marketPrice;//item.stockmarket > 0 ? item.count * item.marketPrice : 0;
                        item.formattedStackVal = formatVal(item.stackVal);
                        item.stackCol = valColor(item.stackVal);
                    }

                    updatedItems++;
                    if (updatedItems === totalItems) {
                        updatedItems = 0;
                        totalItems = 0;
                        //calculate total value and restart listener
                        var bankList = document.querySelector("#bank-list");
                        if (bankList) {
                            bankScope.totalUValue = bankScope.items.reduce(function (a, b) {
                                return b.stackVal ? a + b.stackVal : a;
                            }, 0).toLocaleString();
                            bankScope.totalValue = bankScope.items.reduce(function (a, b) {
                                return (b.stackVal && b.stockmarket) ? a + b.stackVal : a;
                            }, 0).toLocaleString();
                            timeoutHandle = window.setTimeout(function () {
                                var bankList = document.querySelector("#bank-list");
                                if (bankList) {
                                    var bankScope = angular.element(bankList).scope();
                                    bankScope.$apply();
                                    unregisterListener = bankScope.$watch('items', itemListener, true);
                                }
                            }, 100);
                        }
                    }
                    return true;
                }
            }
            return false;
        };

//add price info to cache
        $root.$on("bankSlotUpdated", function (_, objdata) {
            priceCache[objdata.id] = {
                marketPrice: objdata.marketPrice,
                memberStatus: objdata.memberStatus,
                stockmarket: objdata.stockmarket
            };
            setPrice(objdata.id);
        });
//update listener for new tabs (new tab = new scope)
        $root.$on("bankTabsUpdated", function () {
            var bankScope = null;
            var switchWatcher = window.setInterval(function () {
                var bankList = document.querySelector("#bank-list");
                if (bankList) {
                    bankScope = angular.element(bankList).scope();
                    unregisterListener();
                    window.clearTimeout(timeoutHandle);
                    window.clearInterval(switchWatcher);
                    bankScope.totalValue = "Loading";
                    var itermWatcher = window.setInterval(function () {
                        if (bankScope.items && bankScope.items.length > 0) {
                            itemListener(bankScope.items, bankScope.items, bankScope);
                            window.clearInterval(itermWatcher);
                        }
                    }, 100);
                }
            }, 100);
        });
//update templates
        $root.$on('$locationChangeStart', function () {
            bankService = angular.element(document.body).injector().get("BankService");
            geService = angular.element(document.body).injector().get("GEService");

            var $templateCache = angular.element(document.body).injector().get("$templateCache");

//update bank views to display stack data
            $templateCache.put("views/bank_list.ws", "<section class=\"bank\">\n    <header class=\"header\">\n        <a class=\"back goto-home\" toggles-menu><i class=\"icon-home\"></i></a>\n        <a scrolls-to-top>\n            Bank -\n            <span ng-if=\"!fromSearch\">Tab [[ currentTab.id ]]</span>\n            <span ng-if=\"fromSearch\">Search</span>\n        </a>\n        <a style=\"position: absolute; right: 10px;\" ng-if=\"totalValue !== null\" ng-click=\'showUntradable = !showUntradable\'>[[ showUntradable ? totalUValue : totalValue ]]</a>\n    </header>\n    <div class=\"sub-header grey\">\n        <form class=\"wrapped-bar-form\" ng-submit=\"search()\">\n            <div class=\"wrap full\">\n                <label for=\"search\" class=\"magnifying-glass\"><i class=\"icon-search\"></i></label>\r\n<span>\r\n<input type=\"search\" id=\"search\" name=\"search\" placeholder=\"Item name. e.g. \'Mithril\'\" maxlength=\"200\" required\n       ng-model=\"searchTerm\"/>\r\n</span>\n            </div>\n        </form>\n    </div>\n    <div id=\"bank-list\" class=\"content push-top-double push-bottom-single-and-tiny\">\n        <div class=\"slot-usage\">\n            Bank slots used:\n            <span class=\"right\" ng-class=\" { \'error\': (usedSlotCount >= totalSlotCount) }\">[[ usedSlotCount ]] / [[ totalSlotCount ]]</span>\n        </div>\n        <ul class=\"grid items\" infinite-scroll ng-if=\"items.length\">\n            <li ng-repeat=\"item in items track by $index\">\n                <a title=\"[[ item.name ]]\" displays-bank-item item-index=\"[[ item.index ]]\">\n                    <img ng-src=\"[[ item.imgUrl ]]\" container=\"bank-list\">\n                    <span class=\"count\" ng-if=\"item.count > 1\">[[ item.formattedCount ]]</span>\n                    <span class=\"count\" ng-if=\"item.stackVal > 1\"\n                          style=\"top: initial;left: initial;bottom: 5px;right: 5px;color: [[ item.stackCol ]];opacity: [[item.stockmarket ? 1 : 0.5]];\">[[ item.formattedStackVal ]]</span>\n                </a>\n            </li>\n        </ul>\n        <p ng-if=\"hasSearched && !items.length\" class=\"empty-message error\">Your search returned no results.</p>\n        <p ng-if=\"!hasSearched && bankEmpty\" class=\"empty-message error\">There are no items in your bank.</p>\n    </div>\n    <div class=\"sub-footer tiny-footer gradient\">\n        Money Pouch:\n        <span class=\"right\">[[ playerGP | number ]] gp</span>\n    </div>\n    <footer class=\"footer\">\n        <div class=\"pill-wrap single\">\n            <a href=\"#!/bank/tab/[[ prevTab() ]]\" class=\"button pill\" ng-if=\"tabs.length > 1\"><i class=\"icon-back\"></i></a>\n            <span class=\"button pill disabled\" ng-if=\"tabs.length === 1\"><i class=\"icon-back\"></i></span>\n        </div>\n        <div class=\"select-wrap\">\n            <select ng-model=\"currentTab\" ng-options=\"\'Tab \' + tab.id + \' - \' + tab.name for tab in tabs\"\n                    ng-change=\"tabChanged(currentTab)\"></select>\n        </div>\n        <div id=\"tab-uncategorised\" class=\"hidden\">Uncategorised</div>\n        <div class=\"pill-wrap single\">\n            <a href=\"#!/bank/tab/[[ nextTab() ]]\" class=\"button pill\" ng-if=\"tabs.length > 1\"><i\n                    class=\"icon-forward\"></i></a>\n            <span class=\"button pill disabled\" ng-if=\"tabs.length === 1\"><i class=\"icon-forward\"></i></span>\n        </div>\n    </footer>\n</section>");
            $templateCache.put("views/ge_sell.ws", "<section class=\"bank\">\n    <header class=\"header\">\n        <a class=\"back\" ng-click=\"back()\"><i class=\"icon-back\"></i></a>\n        <a scrolls-to-top>GE Sell</a>\n        <a style=\"position: absolute; right: 10px;\" ng-if=\"totalValue !== null\" ng-click=\'showUntradable = !showUntradable\'>[[ showUntradable ? totalUValue : totalValue ]]</a>\n    </header>\n    <div class=\"sub-header grey\">\n        <form class=\"wrapped-bar-form\" ng-submit=\"search()\">\n            <div class=\"wrap full\">\n                <label for=\"search\" class=\"magnifying-glass\"><i class=\"icon-search\"></i></label>\n<span>\n<input type=\"search\" id=\"search\" name=\"search\" placeholder=\"Item name. e.g. \'Mithril\'\" maxlength=\"200\" required\n       ng-model=\"searchTerm\"/>\n</span>\n            </div>\n        </form>\n    </div>\n    <div id=\"bank-list\" class=\"content push-top-double push-bottom-single-and-tiny\">\n        <div class=\"slot-usage\" ng-if=\"!isTradeRestricted && geBuySellEnabled\">\n            Bank slots used:\n            <span class=\"right\" ng-class=\" { \'error\': (usedSlotCount >= totalSlotCount) }\">[[ usedSlotCount ]] / [[ totalSlotCount ]]</span>\n        </div>\n        <ul class=\"grid items\" infinite-scroll ng-if=\"items.length && !isTradeRestricted && geBuySellEnabled\">\n            <li ng-repeat=\"item in items track by $index\">\n                <a title=\"[[ item.name ]]\" displays-bank-item item-index=\"[[ item.index ]]\"\n                   template=\"partials/bank/item_sell.ws\" slot=\"[[ slotId ]]\">\n                    <img ng-src=\"[[ item.imgUrl ]]\" container=\"bank-list\">\n                    <span class=\"count\" ng-if=\"item.count > 1\">[[ item.formattedCount ]]</span>\n                    <span class=\"count\" ng-if=\"item.stackVal > 1\"\n                          style=\"top: initial;left: initial;bottom: 5px;right: 5px;color: [[ item.stackCol ]];opacity: [[item.stockmarket ? 1 : 0.5]];\">[[ item.formattedStackVal ]]</span>\n                </a>\n            </li>\n        </ul>\n        <p ng-if=\"hasSearched && !items.length && !isTradeRestricted && geBuySellEnabled\" class=\"empty-message error\">\n            Your search returned no results.</p>\n        <p ng-if=\"!hasSearched && bankEmpty && !isTradeRestricted && geBuySellEnabled\" class=\"empty-message error\">There\n            are no items in your bank.</p>\n        <p ng-if=\"isTradeRestricted\" class=\"empty-message error\">You cannot access the Grand Exchange from this\n            account.</p>\n        <p ng-if=\"!geBuySellEnabled && !isTradeRestricted\" class=\"empty-message error\">\n<span ng-if=\"!is2FactorEnabled\">\nYou need to <a href=\"https://secure.runescape.com/m=totp-authenticator/\" target=\"_blank\">add the RuneScape Authenticator to your account</a> before you can use the Grand Exchange to buy and sell items.\n</span>\n<span ng-if=\"!isComappTradingEnabled\">\nYou need to enable access by talking to the Grand Exchange Tutor in-game before you can use the Grand Exchange\nto buy and sell items.\n</span>\n        </p>\n    </div>\n    <div class=\"sub-footer tiny-footer gradient\">\n        Money Pouch:\n        <span class=\"right\">[[ playerGP | number ]] gp</span>\n    </div>\n    <footer class=\"footer\">\n        <div class=\"pill-wrap single\" ng-if=\"geBuySellEnabled\">\n            <a href=\"#!/grand-exchange/sell/tab/[[ prevTab() ]]?slot=[[ slotId ]]\" class=\"button pill\"\n               ng-disabled=\"tabs.length === 1\"><i class=\"icon-back\"></i></a>\n        </div>\n        <div class=\"select-wrap\" ng-if=\"geBuySellEnabled\">\n            <select ng-model=\"currentTab\" ng-options=\"\'Tab \' + tab.id + \' - \' + tab.name for tab in tabs\"\n                    ng-change=\"tabChanged(currentTab)\"></select>\n        </div>\n        <div id=\"tab-uncategorised\" class=\"hidden\">Uncategorised</div>\n        <div class=\"pill-wrap single\" ng-if=\"geBuySellEnabled\">\n            <a href=\"#!/grand-exchange/sell/tab/[[ nextTab() ]]?slot=[[ slotId ]]\" class=\"button pill\"\n               ng-disabled=\"tabs.length === 1\"><i class=\"icon-forward\"></i></a>\n        </div>\n    </footer>\n</section>");
            $templateCache.put("partials/bank/item.ws", "<a class=\"close\" ng-click=\"close()\"><i class=\"icon-discard\"></i></a>\n<div class=\"icon\">\n    <img ng-src=\"[[ item.imgUrl ]]\">\n    <span class=\"count\" ng-if=\"item.count > 1\">[[ formatNumber(item.count) ]]</span>\n    <div class=\"members icon-members\" ng-if=\"item.memberStatus\"></div>\n</div>\n<h2 ng-if=\"!item\" class=\"title\">Loading...</h2>\n<h2 ng-if=\"item\" class=\"title\">[[ item.name ]]</h2>\n<span ng-if=\"item && item.stockmarket\" class=\"subtitle\">\nTotal value: [[ (item.marketPrice * item.count) | number ]] gp\n<em ng-if=\"item.count > 1\">([[ item.marketPrice | number ]] gp each)</em>\n</span>\n<div ng-if=\"item && item.stockmarket\" class=\"pill-wrap triple\">\n    <a href=\"#!/grand-exchange/buy/[[ item.id ]]\" class=\"button pill\" ng-if=\"canTradeItem\">Buy</a>\n    <span class=\"button pill dark\" ng-if=\"!canTradeItem\">Buy</span>\n    <a href=\"#!/stockmarket/item/[[ item.id ]]\" class=\"button pill\"><i class=\"icon-stockmarket\"></i></a>\n    <a href=\"#!/grand-exchange/sell/[[ bankSlot ]]\" class=\"button pill\" ng-if=\"canTradeItem\">Sell</a>\n    <span class=\"button pill dark\" ng-if=\"!canTradeItem\">Sell</span>\n</div>\n<p ng-if=\"canTradeItem\" style=\'padding-top: 5px;\'>Quick sell</p>\n<div class=\"pill-wrap triple\" ng-if=\"item && item.stockmarket && canTradeItem\">\n    <select ng-init=\"offerQty = $root.qtyOptions[2]\" ng-model=\"offerQty\" style=\'height: 30px\'\n            ng-options=\"op.label for op in $root.qtyOptions\" class=\"button pill\"></select>\n    <select ng-init=\"offerPrice = $root.priceOptions[3]\" ng-model=\"offerPrice\" style=\'height: 30px\'\n            ng-options=\"op.label for op in $root.priceOptions\" class=\"button pill\"></select>\n    <span ng-click=\"$root.sellOffer(item.id, offerQty.fun(item.count), offerPrice.fun(item.marketPrice));close()\"\n          class=\"button pill\">Submit offer</span>\n</div>\n<p ng-if=\"item && !item.stockmarket\" class=\"error\"><i class=\"icon-attention\"></i> Item cannot be traded on the GE.</p>");
            $templateCache.put("views/ge_slots.ws", "<section class=\"ge-slots\">\n    <header class=\"header\">\n        <a class=\"back goto-home\" toggles-menu><i class=\"icon-home\"></i></a>\n        <a scrolls-to-top>Grand Exchange</a>\n    </header>\n    <div class=\"content push-top-single push-bottom-tiny\">\n        <ul class=\"generic-list large-icon normal-spacing slots\" ng-if=\"!isTradeRestricted\">\n            <li ng-repeat=\"slot in slots track by $index\" class=\"slot clearfix\" ng-swipe-left=\"$root.abortOffer(slot)\"\n                ng-class=\"{ \'complete\': slot.isComplete, \'aborted\': slot.isAborted, \'members-only\': slot.memberRestricted, \'buying\': slot.isBuying, \'selling\': slot.isSelling, \'empty\': slot.isEmpty }\">\n                <div ng-include=\"\'partials/ge/buying_slot.ws\'\" ng-if=\"slot.isBuying\"></div>\n                <div ng-include=\"\'partials/ge/selling_slot.ws\'\" ng-if=\"slot.isSelling\"></div>\n                <div ng-include=\"\'partials/ge/empty_slot.ws\'\" ng-if=\"slot.isEmpty\"></div>\n            </li>\n        </ul>\n        <p class=\"empty-message error\" ng-if=\"isTradeRestricted\">You cannot access the Grand Exchange from this\n            account.</p>\n    </div>\n    <footer class=\"footer tiny-footer gradient\" style=\'height: 60px\'>\n        Money Pouch:\n        <span class=\"right\">[[ playerGP | number ]] gp</span>\n        <a ng-click=\'$root.collectAll()\' class=\"button pill\">Collect all</a>\n    </footer>\n</section>");
            $templateCache.put("quick_abort.ws", "<h1>Abort Offer</h1>\n<div class=\"inner\">\n    <p>\n        Are you sure you want to abort your offer?\n    </p>\n    <div class=\"pill-wrap double\">\n        <a ng-click=\"modalCancel()\" class=\"button pill\">Cancel</a>\n        <a ng-click=\"modalSuccess()\" class=\"button pill\">OK</a>\n    </div>\n</div>");
        });


        //quick GE features
        $root.qtyOptions = [{
            label: "1", fun: function (qty) {
                return 1;
            }
        }, {
            label: "All but 1", fun: function (qty) {
                return qty - 1;
            }
        }, {
            label: "All", fun: function (qty) {
                return qty;
            }
        }];
        $root.priceOptions = [{
            label: "1 gp", fun: function (price) {
                return 1;
            }
        }, {
            label: "-10%", fun: function (price) {
                return Math.floor(price * 0.9);
            }
        }, {
            label: "-5%", fun: function (price) {
                return Math.floor(price * 0.95);
            }
        }, {
            label: "Market", fun: function (price) {
                return price;
            }
        }, {
            label: "+5%", fun: function (price) {
                return Math.floor(price * 1.05);
            }
        }];
        $root.sellOffer = function (id, qty, price) {
            //obfuscated sell method [14]
            geService._dya(undefined, id, qty, price, true);
            $root.$broadcast("pinUnlocked");
        };

        $root.collectAll = function () {
            var geView = document.querySelector(".ge-slots");
            var geScope = angular.element(geView).scope();
            for (var slotInd in geScope.slots) {
                var slot = geScope.slots[slotInd];
                for (var item of slot.collectInv) {
                    //obfuscated collect method [18]
                    geService._dyj(slot.slotId, item.invIndex);
                }
            }
            $root.$broadcast("pinUnlocked");
        };

        $root.abortOffer = function (slot) {
            var geView = document.querySelector(".ge-slots");
            var modalService = angular.element(geView).injector().get("ModalService");

            if (!slot.isComplete && !slot.isAborted && !slot.isEmpty) {
                modalService.create("quick_abort.ws", {
                    success: {
                        _dcr: function () {
                            //obfuscated abort method [16]
                            geService._dye(slot.slotId);
                            $root.$broadcast("pinUnlocked");
                        }
                    }, cancel: {
                        _dcr: function () {
                        }
                    }
                });
            }
        };

        console.log("Script Loaded");
    };
})();