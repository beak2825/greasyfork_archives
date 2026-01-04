// ==UserScript==
// @name        Steam, Legendary Market
// @description Steam Market
// @namespace   org.userscript.bunnelby
// @include     https://steamcommunity.com/*
// @include     https://store.steampowered.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     1
// @runat       document-start
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @nowrap
// @downloadURL https://update.greasyfork.org/scripts/433189/Steam%2C%20Legendary%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/433189/Steam%2C%20Legendary%20Market.meta.js
// ==/UserScript==
(function () {
    var SEARCH_KEY = "tradeoffer_search";
    var DB_NAME = "steam", DB_VER = 1, MARKET_STORE = "market", HISTORY_STORE = "history";
    var window = typeof unsafeWindow === "undefined" ? window : unsafeWindow;
    var $$ = window.jQuery;
    var TRADE_BLACKLIST = "";
    var TRADE_OFFER_LINK = "https://steamcommunity.com/tradeoffer/new/?partner=408831628&token=jTXresXQ";

    var Page = {
        inMarket: location.pathname === "/market/",
        inMarketListings: location.pathname.indexOf("/market/listings/") >= 0,
        inInventory: !!location.pathname.match(/\/id\/[^\/]+\/inventory(\/|$)/gm),
        inModalInventory: location.search.indexOf("?modal=1&market=1") >= 0,
        inMarketMultiSell: location.pathname.indexOf("/mavrket/multisell") >= 0,
        inMarketMultiBuy: location.pathname.indexOf("/market/multibuy") >= 0,
        inMarketSearch: location.pathname === "/market/search",
        inGameCards: !!location.pathname.match(/\/(id|profiles)\/[^\/]+\/gamecards\/\d+(\/|$)/),
        inAgeCheck: location.pathname === "/agecheck/app/",
        inStore: location.pathname.indexOf("/app/") === 0,
        inTradeNew: location.pathname.indexOf("/tradeoffer/new") >= 0,
        inTradeOffers: location.pathname.indexOf("/tradeoffer/") >= 0,
        inForum: location.pathname.match(/\/app\/\d+\/(tradingforum|forum)(\/|$)/),
        inGroup: location.pathname.indexOf("/groups/") >= 0,
        inMultiSell: location.pathname.indexOf("/market/multisell?") == 0,
    };

    String.prototype.mapTag = function (map) {
        var out = this;
        for (var key in map) {
            var value = map[key];
            if (value === true) {
                out = out.replace("{" + key + "}", "<" + key + ">");
                out = out.replace("{/" + key + "}", "</" + key + ">");
            } else if (typeof value === "string" && value !== "") {
                out = out.replace("{" + key + "}", "<" + value + ">");
                out = out.replace("{/" + key + "}", "</" + value + ">");
            } else if (typeof value === "object" && value.name) {
                var attrs = "";
                for (var attrName in value) {
                    attrs += " " + attrName + "=\"" + value[attrName] + "\"";
                }
                out = out.replace("{" + key + "}", "<" + value.name + attrs + ">");
                out = out.replace("{/" + key + "}", "</" + value.name + ">");
            } else {
                out = out.replace("{" + key + "}", "");
                out = out.replace("{/" + key + "}", "");
            }
        }
        return out;
    };
    Function.prototype.toComment = function () {
        return this.toString().match(/\/\*([^]*)\*\//)[1];
    };

    openDB = function () {
        var req = indexedDB.open(DB_NAME, DB_VER);
        req.onupgradeneeded = function (ev) {
            log("db upgrade", config);

            var db = ev.target.result;
            var market = db.createObjectStore(MARKET_STORE, { keyPath: "app_id" });
            var history = db.createObjectStore(HISTORY_STORE, { keyPath: "history_id" });
            history.createIndex("app_id", "app_id");

            var config = {
                market: {
                    app_id: "ゲームのfeeID (key_path)",
                    worth: {
                        app_id: "ゲームのfeeID",
                        title: "ゲーム名",
                        cards: "",
                        //	buyable_cards: "",
                        //	notable_cards: "",
                        worth: "SCEの価格",
                        cards_in_stack: "SCEの所持枚数",
                        total_cards: "SCEの最大所持枚数",
                        available_cards: "",
                        disable_cards: "",
                    },
                    price: {
                        app_id: "ゲームのfeeID",
                        title: "ゲーム名",
                        total_cards: "カードの総枚数",
                        price_doller: "価格 $",
                        your_level: "バッジのレベル",
                        last_update: "最終更新日時"
                    },
                },
                history: {
                    history_id: "履歴のID (key_path)",
                    app_id: "ゲームのfeeID (indexed)",
                    hash_name: "カードのHash名",
                    is_sell: "売却取引",
                    is_buy: "購入取引",
                    is_publish: "売却掲載",
                    is_cancel: "掲載取り下げ",
                }
            };
        };
        return req;
    }

    // DOMNodeInserted など連続した関数の実行を制限する
    safeFunction = (function () {
        var maps = {};
        return function (name, func, interval) {
            if (interval === null || isNaN(interval)) {
                interval = 100;
            }
            maps[name] = 0;
            return function () {
                // log(maps);
                if (maps[name] === 0) {
                    var timer = maps[name] = setTimeout(function () {
                        if (maps[name] === timer) {
                            maps[name] = 0;
                        }
                    }, interval);

                    $.proxy(func, this)(arguments);
                }
            };
        };
    })();
    $.fn.findText = function (text) {
        $(this).find(":not(iframe)").addBack().contents().filter(function() {
            return this.nodeType === 3 && this.textContent.indexOf(text) >= 0;
        });
    };
    $.fn.$$ = function () {
        log("$$(): " + this.selector);
        if (this.selector) {
            return $$(this.selector);
        } else {
            console.error("not has selector from .$$()");
            return this;
        }
    };
    $.fn.between = function (begin, end) {
        var isFound = false;
        var founds = [];

        this.each(function (i, element) {
            if (!isFound && begin.apply(this, [i, element])) {
                founds.push(element);
                isFound = true;
            } else if (isFound) {
                founds.push(element);
                if (end.apply(this, [i, element])) {
                    return false;
                }
            }
        });

        return $(founds);
    };
    function log(args) {
        return console.log.apply(window, Array.isArray(args) ? args : [args]);
    }


    function Inventory() {
        console.log("Inventory()");

        /// 自動チェック
        ($("#market_sell_dialog_accept_ssa").get(0) || {}).checked = true;

        // コンテキストメニューを無効化
        $("#inventories").bind("contextmenu", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
        });
        var Selling = new SellingClass();
        var Crafting = new CraftingClass();
        var Unpacking = new UnpackingClass();

        var $targetedItemsPreview = $("#inventory_pagecontrols").next().attr("id", "targetedItemsPreview");

        var $toolbar = $("<div />").attr("id", "legendaryToolbar").insertAfter("#filter_options");
        function createButton(text, container) {
            return $("<a />")
                .addClass("item_market_action_button item_market_action_button_green")
                .append('<span class="item_market_action_button_edge item_market_action_button_left"></span><span class="item_market_action_button_contents">' + text + '</span><span class="item_market_action_button_edge item_market_action_button_right"></span><span class="item_market_action_button_preload"></span>');
        }
        createButton("untarget").click(onUntarget).appendTo($toolbar);
        createButton("sell").click(Selling.onSell).appendTo($toolbar);
        createButton("craft").click(Crafting.onCraft).appendTo($toolbar);
        createButton("unpack").click(Unpacking.onUnpack).appendTo($toolbar);

        // インベントリ自動更新
        setInterval(updateInventory, 1000);

        // 全てのアイテムを操作の対象から外す
        function onUntarget() {
            $targetedItemsPreview.find(".item").each((i, el) => untargetItem(el));
        }

        var lastCurrencyPrice = 0;
        var lastBuyerCurrencyPrice = 0;
        function savePrice() {
            // 値段を控えておく
            var price = parseFloat($("#market_sell_currency_input").val().replace(/[^\d\.]/gm, ""));
            if (!isNaN(price) && price > 0) {
                lastCurrencyPrice = price;
            }

            price = parseFloat($("#market_sell_buyercurrency_input").val().replace(/[^\d\.]/gm, ""));
            if (!isNaN(price) && price > 0) {
                lastBuyerCurrencyPrice = price;
            }
            log("save price", lastCurrencyPrice, lastBuyerCurrencyPrice);
        }
        $(document).on("change", "#market_sell_currency_input", savePrice);
        $(document).on("change", "#market_sell_buyercurrency_input", savePrice);

        function SellingClass () {
            var self = this;
            self.queue = [];
            self.isSelling = false;

            self.next = () => {
                var element = self.queue.shift();
                if (element && self.isSelling) {
                    var rgItem = $("#inventories #" + element.id)[0].rgItem;
                    if (rgItem) {
                        SellItemDialog.Show.apply(SellItemDialog, [rgItem]);
                        if (lastCurrencyPrice > 0) {
                            $("#market_sell_currency_input").val(lastCurrencyPrice);
                        }
                        if (lastBuyerCurrencyPrice > 0) {
                            $("#market_sell_buyercurrency_input").val(lastBuyerCurrencyPrice);
                        }
                    }
                } else {
                    self.isSelling = false;
                }
            };

            self.SellDialogOnSuccessOverride = function (transport) {
                console.log("onSuccess", transport);

                var item = SellItemDialog.m_item;
                item.selling = true;
                $(item.element).addClass("selling");
                untargetItem(item.element);

                this.m_bWaitingForUserToConfirm = false;
                this.m_bWaitingOnServer = false;
                this.Dismiss();

                if (self.isSelling) {
                    setTimeout(() => self.next(), 500);
                }
            };

            self.onSell = function (ev) {
                self.isSelling = true;
                self.queue = $targetedItemsPreview.find(".item").toArray();
                self.next();
            };
            self.onModalObserve = function (ev) {
                if (self.isSelling && !SellItemDialog.m_modal) {
                    self.next();
                }
            };

            var SellDialogOnSuccess = SellItemDialog.OnSuccess;
            SellItemDialog.OnSuccess = self.SellDialogOnSuccessOverride;

            self.observeIntervalKey = setInterval(self.onModalObserve, 1000);
        }

        function CraftingClass () {
            var self = this;
            self.queue = [];
            self.isCrafting = false;

            self.onCraft = function () {
                if (self.isCrafting) return;
                ShowConfirmDialog("Legendary market", "Do you craft all selected items ?").done(function() {
                    if (self.isCrafting) return;
                    self.isCrafting = true;
                    self.queue = $targetedItemsPreview.find(".item").toArray();
                    self.next();
                });
            };

            self.ShowFailDialog = function (xhr) {
                self.isCrafting = false;
                if (xhr.responseJSON && xhr.responseJSON.message)
                {
                    ShowAlertDialog('失敗', xhr.responseJSON.message);
                }
                else
                {
                    ShowAlertDialog('失敗', 'ネットワークとの通信中に問題が発生しました。後でもう一度お試しください。');
                }
            }

            self.next = function () {
                var item = self.queue.pop();
                if (!item) {
                    self.isCrafting = false;
                    return;
                }

                // 753_6_6890542742
                var id = $(item).attr("id").split("_");
                var $item = $("#" + $(item).attr("id"));
                var fee = $item[0].rgItem.description.market_fee_app;

                var params = {
                    sessionid: g_sessionID,
                    appid: fee,
                    assetid: id[2],
                    contextid: id[1],
                };

                var url = g_strProfileURL + "/ajaxgetgoovalue/";
                $J.get(url, params).done(function(data) {
                    url = g_strProfileURL + "/ajaxgrindintogoo/";
                    params.goo_value_expected = data.goo_value;
                    $J.post(url, params).done(function(data) {
                        // crafted
                        $item.addClass("crafted");
                        untargetItem($item[0]);
                        setTimeout(self.next, 500);
                    }).fail(self.ShowFailDialog);
                }).fail(self.ShowFailDialog);
            }
        }

        function UnpackingClass () {
            var self = this;
            self.isUnpacking = false;

            self.onUnpack = function () {

            };
        }

        var oldGrindIntoGoo = GrindIntoGoo;
        GrindIntoGoo = NewGrindIntoGoo;

        function NewGrindIntoGoo( appid, contextid, itemid )
        {
            var onFail = function( xhr ) {
                if ( xhr.responseJSON && xhr.responseJSON.message )
                {
                    ShowAlertDialog( '失敗', xhr.responseJSON.message );
                }
                else
                {
                    ShowAlertDialog( '失敗', 'ネットワークとの通信中に問題が発生しました。後でもう一度お試しください。' );
                }
            };

            var rgAJAXParams = {
                sessionid: g_sessionID,
                appid: appid,
                assetid: itemid,
                contextid: contextid
            };
            var strActionURL = g_strProfileURL + "/ajaxgetgoovalue/";
            $J.get( strActionURL, rgAJAXParams ).done( function( data ) {
                var $Content = $J(data.strHTML);
                var strDialogTitle = data.strTitle;
                ShowConfirmDialog( strDialogTitle, $Content ).done( function() {
                    strActionURL = g_strProfileURL + "/ajaxgrindintogoo/";
                    rgAJAXParams.goo_value_expected = data.goo_value;
                    $J.post( strActionURL, rgAJAXParams).done( function( data ) {
                        ShowAlertDialog( strDialogTitle, data.strHTML );
                        //$item.addClass("crafted");
                        //untargetItem($item[0]);
                    }).fail(onFail);
                });
            }).fail(onFail);
        }

        // インベントリのアイテム情報を更新する
        function updateInventory() {
            $(".inventory_page:visible .item:visible:not(.initilized)").each((i, element) => {
                if (!element.rgItem) return;

                var $item = $(element);
                var desc = element.rgItem.description;

                $item.find(".tag").remove();
                // アイテムのレア度
                for (var j = desc.tags.length - 1; j >= 0; j--) {
                    // 絵文字、背景以外の場合、レア度は表示しない
                    if (desc.tags[j].category === "item_class" && desc.tags[j].internal_name.match(/item_class_[01256789]/gm)) {
                        $item.find(".tag.droprate").remove();
                        break;
                    }
                    if (desc.tags[j].category === "droprate") {
                        var rate = desc.tags[j].internal_name;
                        if (rate === "droprate_0") {
                            $("<span />").addClass("tag droprate common").appendTo($item);
                        } else if (rate === "droprate_1") {
                            $("<span />").addClass("tag droprate uncommon").appendTo($item);
                        } else if (rate === "droprate_2") {
                            $("<span />").addClass("tag droprate rare").appendTo($item);
                        }
                    }
                }
                // マーケット
                $("<span />").addClass(desc.marketable === 1 ? "tag marketable" : "tag disagreement").appendTo($item);
                // トレード可能
                if (desc.tradable === 1) {
                    $("<span />").addClass("tag tradable").appendTo($item);
                }
                // マーケット、トレード利用可能になる日付
                if (desc.owner_descriptions && desc.owner_descriptions[0]) {
                    var match = desc.owner_descriptions[0].value.match(/\[date\](\d+)\[\/date\]/);
                    if (match) {
                        var date = new Date(parseInt(match[1]) * 1000);
                        var dateText = `${date.getMonth() + 1}/${date.getDate()}`;
                        if ($item.find(".item_currency_amount").length > 0) {
                            $item.find(".item_currency_amount").append("<br>" + dateText);
                        } else {
                            var $date = $("<div />").addClass("item_currency_amount date").text(dateText).appendTo($item);
                        }
                    }
                }
                if (element.rgItem.selling) {
                    $item.addClass("selling");
                }
                $item.addClass("initilized");

                // db
                openDB().onsuccess = (ev) => {
                    ev.target.result
                        .transaction(MARKET_STORE)
                        .objectStore(MARKET_STORE)
                        .get(desc.market_fee_app)
                        .onsuccess = (ev) => {
                        var result = ev.target.result;
                        if (result) {
                            if (result.lower_price && result.lower_price[desc.market_hash_name]) {
                                $("<span />")
                                    .addClass("old_lower_price")
                                    .text(result.lower_price[desc.market_hash_name])
                                    .appendTo($item);
                            }
                            if (result.worth) {
                                $("<span />")
                                    .addClass("sce_worth")
                                    .text(result.worth.worth)
                                    .appendTo($item);
                            }
                        }
                    };
                };
            });
        }
        // プレビューの画像を読み込む
        function updatePreviewItems() {
            $targetedItemsPreview.find("img[src='http://steamcommunity-a.akamaihd.net/public/images/trans.gif']").each(function () {
                var $item = $(this).parents(".item");
                $item.attr("src", $("#inventories #" + $item.attr("id")).find("img").attr("src"));
            });
        }

        var lastUpdateItem;
        function updateActiveInfo(item) {
            if (!item) return;
            if (lastUpdateItem && lastUpdateItem == item) return;
            lastUpdateItem = item;

            var $info = $("#iteminfo0");
            var $contaienr = $info.find(".item_desc_icon");
            var $actions = $info.find(".item_owner_actions");

            // タグ
            $contaienr.find(".tag").remove();
            $("#inventories .item.activeInfo").find(".tag").clone().appendTo($contaienr);

            function createButton(className, href, innerHtml) {
                var $button = $("<a />")
                .addClass("card_worth btn_small btn_grey_white_innerfade " + className)
                .attr("href", href)
                .attr("target", "_blank")
                .append("<span>" + innerHtml + "</span>");

                return $button;
            }

            // Steam Card Exchange
            if (true) {
                $info.find(".sce_link").remove();
                openDB().onsuccess = (ev) => {
                    ev.target.result
                        .transaction(MARKET_STORE)
                        .objectStore(MARKET_STORE)
                        .get(item.description.market_fee_app)
                        .onsuccess = (ev) => {
                        var entry = ev.target.result;
                        if (!entry) return;

                        var url = "http://www.steamcardexchange.net/index.php?inventorygame-appid-" + item.description.market_fee_app;
                        createButton("sce_link", url, `${entry.worth.worth} worth, ${entry.worth.cards_in_stack} / ${entry.worth.available_cards * 8} cards`)
                            .appendTo($actions);
                    };
                };
            }

            // マーケット検索
            if (true) {
                $info.find(".search_series_in_market_link .in_market_link").remove();
                createButton("in_market_link",
                             `http://steamcommunity.com/market/listings/${item.description.appid}/${item.description.market_hash_name}`,
                             "マーケットで表示").appendTo($actions);
                createButton("search_series_in_market_link",
                             `http://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_${item.description.market_fee_app}&category_753_item_class[]=tag_item_class_2&category_753_item_class[]=tag_item_class_5#p1_price_asc`,
                             "シリーズ検索").appendTo($actions);
                createButton("tradeing_thread_link", `http://steamcommunity.com/app/${item.description.market_fee_app}/tradingforum/`);
                // $(".item_scrap_actions").hide();
            }
        }

        // アイテムを操作の対象にする
        function targetItem(element) {
            var $item = $(element);
            if ($item.is(".itemHolder")) {
                $item = $item.find(".item");
            }
            if ($item.is(".inventory_item_link")) {
                $item = $item.parents(".item");
            }
            if ($item.is(".targeted, .selling, .crafted")) {
                return;
            }

            // .targetedクラスを付加し、プレビューにコピー
            $item.addClass("targeted");
            $targetedItemsPreview.append($item.clone());
        }
        // アイテムを操作の対象から外す
        function untargetItem(element) {
            var $item = $(element);
            if ($item.is(".itemHolder")) {
                $item = $item.find(".item");
            }
            if ($item.is(".inventory_item_link")) {
                $item = $item.parents(".item");
            }
            if (!$item.hasClass("targeted")) {
                return;
            }

            // .targetedクラスを除去し、プレビューからも削除
            $item.removeClass("targeted");
            $targetedItemsPreview.find(`[id='${$item.attr("id")}']`).remove();
        }

        // 同じアイテムを操作の対象にする（外す）
        function toggleSameItems(element) {
            var $item = $(element);
            if ($item.hasClass("itemHolder")) {
                $item = $item.find(".item");
            }

            var isTargeted = $item.hasClass("targeted");
            var hashName = $item[0].rgItem.description.market_hash_name;

            // インベントリ内捜索
            function search(inventory) {
                if (!inventory) return;

                var elements = inventory.m_rgItemElements;
                if (!elements) return;

                elements.forEach(($element) => {
                    if (!$element) return;
                    var element = $element[0];

                    if (!element) return;
                    if (!element.rgItem) return;

                    if (element.rgItem.description.market_hash_name == hashName) {
                        if (isTargeted) {
                            untargetItem(element);
                        }else {
                            targetItem(element);
                        }
                    }
                });
            }

            // アクティブなインベントリ
            search(g_ActiveInventory);
            // アクティブな子インベントリ
            var children = g_ActiveInventory.m_rgChildInventories;
            for (var appid in children) {
                search(children[appid]);
            }
        }

        // カードを選択する
        function onTargetItemInInventory (element) {
            var $item = $(element);
            // Shift or Ctrl + 左クリックでまとめて操作対象 or 解除
            var $startAt = $("#inventories .item.targetStartAt:visible, #inventories .item.untargetStartAt");
            if ($startAt.length > 0) {
                var startAtId = $startAt.attr("id");
                var itemId = $item.attr("id");
                // targetStartAt:Shift + 左クリックで選択、untargetStartAt:Ctrl + 左クリック未選択
                var isTargeting = $startAt.hasClass("targetStartAt");

                // 選択したアイテムから今クリックしたアイテムまでを全て操作する
                $(".inventory_ctn .item").between(
                    (i, el) => $(el).attr("id") === startAtId || $(el).attr("id") === itemId,
                    (i, el) => $(el).attr("id") === startAtId || $(el).attr("id") === itemId
                ).each((i, el) => {
                    var $item = $(el);
                    if (isTargeting) {
                        if (!$item.hasClass("targeted")) {
                            targetItem($item);
                        }
                    } else {
                        if ($item.hasClass("targeted")) {
                            untargetItem($item);
                        }
                    }
                });
            } else if ($item.hasClass("targeted")) {
                untargetItem($item);
            } else {
                targetItem($item);
            }
        }

        // アクティブなアイテムの情報を #iteminfo0 のみに表示
        CInventory.prototype.SelectItem = SelectItemOverride;
        function SelectItemOverride(event, elItem, rgItem, bUserAction) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }

            var $info = $("#iteminfo0");

            // 現在と同じIDのアイテムを選択しない
            var lastBuiltItem = $info[0].builtFor;
            if (lastBuiltItem && rgItem &&
                lastBuiltItem.element.id == rgItem.element.id) {
                return;
            }

            // アイテム詳細更新
            $(".activeInfo").removeClass("activeInfo");
            BuildHover("iteminfo0", rgItem, UserYou );
            $(`[id='${rgItem.element.id}']`).addClass("activeInfo");
            g_ActiveInventory.selectedItem = rgItem;
            updateActiveInfo(rgItem);

            // 表示する
            $("#iteminfo1").hide();
            $info.show();
        }

        // コンテキストメニュー、ダブルクリックを無効化
        $("#inventories").on("dbclick contextmenu", ".inventory_item_link", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
        });
        $("#inventories").on("click auxclick", ".inventory_item_link", (ev) => {
            ev.preventDefault();

            var elItem = $(ev.target).parents(".item")[0];
            if (elItem && elItem.rgItem) {
                if (ev.which === 1) {
                    if (ev.shiftKey) {
                        var $shiftAt = $("#inventories .item.targetStartAt:visible");
                        if ($shiftAt.length == 0) {
                            $("#" + elItem.id).addClass("targetStartAt");
                            $(".untargetStartAt").removeClass("untargetStartAt");
                        } else {
                            onTargetItemInInventory(elItem);
                        }
                    } else if (ev.ctrlKey) {
                        var $ctrlAt = $("#inventories .item.untargetStartAt:visible");
                        if ($ctrlAt.length == 0) {
                            $("#" + elItem.id).addClass("untargetStartAt");
                            $(".targetStartAt").removeClass("targetStartAt");
                        } else {
                            onTargetItemInInventory(elItem);
                        }
                    }else if (ev.altKey) {
                        toggleSameItems(elItem);
                    }
                } else if (ev.which === 3) {
                    if (ev.altKey) {
                        toggleSameItems(elItem);
                    } else {
                        // right, カードを操作対象にする
                        onTargetItemInInventory(elItem);
                    }
                }
            }
        });

        $(document).on("keydown keypress keyup", (ev)=> {
            // Alt
            if (ev.which === 18 || ev.altKey) {
                // メニューバー出現防止
                ev.preventDefault();
            }
        });
        $(document).on("mousemove mouseenter mouseleave keyup", ".inventory_item_link", (ev) =>{
            var $item = $(ev.target);
            if (!ev.shiftKey) {
                $(".targetStartAt").removeClass("targetStartAt");
            }
            if (!ev.ctrlKey) {
                $(".untargetStartAt").removeClass("untargetStartAt");
            }
        });
        $targetedItemsPreview.on("contextmenu dbclick", ".inventory_item_link", (ev) =>{
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
        });
        $targetedItemsPreview.on("click auxclick", ".inventory_item_link",  (ev) => {
            ev.preventDefault();

            // インベントリ内の要素を取得
            var $item = $("#inventories #" + $(ev.target).parents(".item").attr("id"));
            if (ev.which === 1) {
                if (ev.ctrlKey) {
                    var $untargetAt = $targetedItemsPreview.find(".item.untargetStartAt");
                    if ($untargetAt.length > 0) {
                        $targetedItemsPreview.find(".item").between(
                            (i, el) => $item.attr("id") == el.id || $untargetAt.attr("id") == el.id,
                            (i, el) => $item.attr("id") == el.id || $untargetAt.attr("id") == el.id
                        ).each((i, el) => untargetItem(el));
                    } else {
                        $("#" + $item.attr("id")).addClass("untargetStartAt");
                        $(".targetStartAt").removeClass("targetStartAt");
                    }
                } else if (ev.altKey) {
                    toggleSameItems($item);
                } else {
                    SelectItemOverride(ev, $item[0], $item[0].rgItem, true);
                }
            } else if (ev.which === 3) {
                if (ev.altKey) {
                    toggleSameItems($item);
                } else {
                    untargetItem($item);
                }
            }
        });

        $J(".inventory_page_right").bind("v_contentschanged", function(ev) {
            var $this = $(ev.target);
            // \u00a5 = ¥
            if ($this.is("#iteminfo0_item_market_actions")) {
                var m = $this.text().match(/\u00a5.*?[\d\.]+/gm);
                if (m) {
                    var builtFor = $("#iteminfo0")[0].builtFor;
                    if (!builtFor.lower_price) {
                        builtFor.lower_price = m[0];

                        $(".item:visible:not(:has(.lower_price))").each((i, el) => {
                            if (el.rgItem.description.market_hash_name == builtFor.description.market_hash_name) {
                                $(el).find(".old_lower_price, .lower_price").remove();
                                $("<span />")
                                    .addClass("lower_price")
                                    .text(builtFor.lower_price)
                                    .appendTo(el);
                            }
                            // db
                            openDB().onsuccess = (ev) => {
                                ev.target.result
                                    .transaction(MARKET_STORE, "readwrite")
                                    .objectStore(MARKET_STORE)
                                    .get(builtFor.description.market_fee_app)
                                    .onsuccess = (ev) => {
                                    var result = ev.target.result;
                                    if (result) {
                                        result.lower_price = result.lower_price || {};
                                        result.lower_price[builtFor.description.market_hash_name] = builtFor.lower_price;
                                        ev.target.source.put(result);
                                    }
                                };
                            };
                        });
                    }
                }
            }
        });

        // リンクを新しいウィンドウで開く
        $(document).on("click", ".inventory_iteminfo a", function (ev) {
            var href = $(this).attr("href");
            if (href.indexOf("http://") === 0) {
                window.open(href, href);
                ev.preventDefault();
            }
        });

        $("<style />").text(function () {/*
        #legendaryToolbar { padding: 0 11px; }
        #legendaryToolbar .item_market_action_button { margin-right: 5px; }
        .trade_item_box .item:after {
            display: block; content: ""; position: absolute;
            top:0 ;left: 0; right: 0; bottom: 0;
            border: dashed rgba(0,0,0,0) 2px;
        }
        #filter_options { margin-bottom: 12px }
        .trade_item_box .item.targeted:after { border-color: lightgrey; }
        .trade_item_box .item.targetStartAt:after { border-color: yellow; }
        .trade_item_box .item.untargetStartAt:after { border-color: red; }
        .itemHolder .tag {
            display: inline-block; position: relative;
            width: 16px; height: 16px; z-index: 100;
            background-size: contain; background-repeat: no-repeat;
        }
        .tag.rare { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAeNQTFRF////zAAz/xpNxgA5/xNMvwAy/w5HwgA0/w5HwwA1/w5IwgA2/w9HwgA1/w5HwQA1/w9GwgA2/w9HwgA1/w9HwgA1/w9HwgA1/w5H/Q5GwgA1/w9HwgA1/w9HwgA1/w9HwgA1wgE1wwI2xAA1xAE2xAI3xgE2yAI3ygI3zAI4zQM4zwM50AM50wQ61QU71TRW2QY82wY83T5c3kxk3wk+3zFV4Qg+4VZr4hFD4wg/5Qk/5TJX5WBx5wlA6AlA6QtC6Wp36gpB6gxC6kBg7ApB7HN97QtC7R1M7jZb7wtC73V+8BFG8DRa8jVb8wxD8wxE82R19g1E9w1F+A1F+Q5F+g5G+j5h+0Vl/RZL/hBI/lJt/qOb/qSc/w9H/xBH/xFI/xJJ/xNJ/xRK/xhM/xlM/xpN/xtO/xxO/yBR/yRT/yZU/ydV/ypW/y9Z/zFb/zJb/z1h/z5i/z9i/0Bj/0Fj/0Jk/0Nl/0Rl/0Vm/0dn/0lo/01q/01r/05r/1Ft/1Nu/1hx/1py/150/191/2B1/2F2/2J2/2N3/2d5/2d6/2h6/2x8/3B+/3F//3eC/36G/36H/4OJ/4eM/4iM/4mM/4qN/4uN/4yO/5KR/5qW/56Y/6Ga/6Wc/6Wd/6ed/6ee/6iewq67RAAAACB0Uk5TAAoKGxskJGxsbm52dn5+rq7IyM7O0NDU1Nbr6/39/v4aPQLRAAAB7klEQVQ4y41T91eTUQz9EBVE2SDIjAsURcWNCi5wCwjivupnnSijQpWhCNa0KmWqII6SP5V8He/Qoqfc397LPclNbmJZS7EqdVN+SpL1b6TlFeYUA0RF2QW565bHNyAMCmN9XHh1Rjng6hoYHm1vbqipJCpLT14SXptVCjzysINQmvoKopLMNYaQpX8dI+wPTM7Nz44Nddpoq9YymSZ/KR72Mo//kgh+dgN126gkWiUD6GX/zIIYBH026ojSI/rL0cH+eYnBDxvVVBbqJU31jfCMxMGHNlXqzCMP8PC45p/ucbvdg2/dPcf3tmiVbtQT5SqhEC72q76/X19qM319wLldt36rUhuVVKCEHHRxQHN+53fAY6/3CW5fButHJ2ooW/0pxgBPivz5wvwCr5k9eP4KzzTFEBqoKMlKBYZ5TuSbTvG9y8v86engG8AnMoZmohRrIzDK2uOHfsXVs4or/TfPnD4vMot2onxDmLJV4knHyFocpe2XDCFaQiYeANcdQmvr1i2NYkpERYoE7gO7iaqwZ/Mp5x0RadoU+QzUEh2+SCdCz0ibZlCKj7hG1FR1JGxpdFBm1Io72Lnj2IGwoWbUMWbdOLhvf7xZMXYHLxwKxtsduzB37y1fmMQrl3BpE699wsNZwemt4Hj/d/6LnMkq4z3d6M4AAAAASUVORK5CYII=); }
        .tag.common { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAANwAAADcAaIUQOMAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAEJklEQVRYR8WXyW9TVxSHWfMvsCXEGSA4g+MMJIBTwpSQGNfOCKERIRDHkAAmSatQkKq2AiF1WrABOquLRh2kCgk6SEUoCBSlUlRYILWFFcoGCQk6wen5Hb/zfP1yg20J1YvPfu++e88590z3vRUnKJE3Ta83rKxLBuJ1xwO/+sJr5n3honjJy8UrbXOzYR30wsoS9ScCc/y/wP+zzCJDgA1QFplZZoGZYxI2WV6sgyasJKnKbLCi55G0yTSxDoLGV4OreMfTrOSZKtswXU9b32+hzs/bKPpVJ3VfjlDwWA0FjlRR9YifKvaVU2m02DTgGTPN4Vll0wGWDLDS1fXJwAwrfKqK2Rja9fEO6vshtgSdY1I1vJ5KIhmGPOU8mSnuKFrt1ZdxAxzlrrDQmY3U/V1ElPX/1EWDN/vp4O1BOnx/mI4/TFDi3jDtm+2jyJe7qPXdEDVMBWVdcLya1vaVmkYwRTNefRk3cDsvlp03TAap/cPt7k4Hb+2h5KMjNPXvsecy9mCEtn3Q4vFG2hPecGQY4MRcFqpy7Hr0tyGa+ueoVaEVntv/Y5frDRhheGLa1Ole8ERkuyQc3K7K4WarkhxAeNQIIxxITLc65Mepc5mIhNOYy84tgvMBnoBc5IQnMaVP6O7n1ADNdsTcdPvI3f3UdnEbtV9KE/6inTo+3SnXeNbCntv8ZhP1Xo2mjWAZmhOeUMyZHkCHkzpX15sJN/n3OO291kMtZzeKINfYj7YLel8Tr6TynhJqfK2OJh6PueuRmBoKo08smB5Ae5UmI7vnUtPFYPSPAzKOUlNlTSfZWN4p4LPBGa+l4NEaucZ8UwZKFONoVo4Bs2IADhZ+IL0dHQ4LUee6cPKv1O4xDkJvN4ug9kvpEkXYMLbpjQ300rlNct18ujHDC2o8OqZjwCIOMLg/jgcA7RUC0WR04ejvqd0rkZmOVKiwex3/PkbNpxpSOfFJyhiABFQ5aFYYQ9t2DGCK4nD/vC5Ab4dAs/Ri34Sp87OdGbS+F6Id57dk0PpOSJ7BgOq4n6oP+SUXVA5KEjpwdqQNWDOf1YCDdwbdBFIMN7r4hyrkWc1opdyze+mVG33ZDcgWAjD0ywDVT9S6BiDRDCFCLdc58O1m5VzvA9d7M2QsG4JsSaigMpDlagTKTQWVdZfI2Lo9ZWIAcsK7ftkkzKUMlb0/97gGwOVqgH//Otf1sW/D1rXLliF+sjUik94rURFUO8budgwIHK4SL6AKbGtyaURZW7FJ9OtOmVvW5aPSmI8qD1RIK7bNzbUV530YtV3YKq6vGCgX99rmgJwOI8cL+R3HvDMo3vxW07Keyvk4VtgTeb2QTDwZo8k/x5eMY27eLySg4K9koKAvpYDDUNjXcgXhcHLi//0w8cKKC/NpZuL0icJ8nNp4cZ/niRX/ASx3VgsgYvGbAAAAAElFTkSuQmCC); }
        .tag.uncommon { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAANwAAADcAaIUQOMAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAD3UlEQVRYR8VXWU9TQRTmmVhKyw5FSeCXyS4VCSQQQQFBVtkCQhBNZMcFEBRQQkKiCaaRQjBBFrc/wJuJj3A83/Sedm6Z2jYx9uFr7507c75vzjb3Jv36XRg3BvvTkns63d7uDtdRebHjgOH1VjiSTXOjwTgYDiar7u107/P/If/7GGcMAphccMbwMQ4Z++UljmqTrXAYB3UwSb2QmWCRR0K9yaYO4yDQ1+PO4x03M8mFkA30uenJRAY9m8+ipcUser2aTV3tLmprSaXmxlRqqHNSVblNwAWjubLMkWfiAC4NMGkRY5kJz4WYxdDcTCZtrOdcgszR0dTgJCbVhZyXFTuWS69fKQrns90AFnnQ2NhIOq2uZCuytxs5tL2dSzs7Htrby6fDL1fJz/9bW7n08kUWPX6UrsRiXUebi2qrU3QRBBHhfLYbuJ0Xq50/6HbT7HRo1yA+OrlGX38W/BUHn/NVmGQD8EZFacgT4eGwCbBirhYKOXb9addjJIuIHwW0wevEGxCheaJZ5wxe8ERku0o4uF3I4WYjSQzw+/ODIrRwIDGD1aF+eOeoczURCyTmce/cAHgCdpETtsS0+oTsfl8ESLYj5rohn89D01OZNKPh+UIWzc8FrvFsqD+NeDO0yuUZXMvhkJwIC8W+7gF0OFXn4no94U7ZyOZmLo09TFeGBLMsFpD7lqZUuuVNUV48/hoSj8SUUGh94lD3ANqrUmra/a7fo8ZRakI2yGLX13IU+GwIjHe5qb3Vpa4xX7eBEsU4mpUlwKcE4GDhB6q3o8NhIepcFp5+592/CzWe0eEA2YxWoggbxkaG0mh8LEA0NJBm84KIR8e0BJzhAIP7vXgAoL3CIJqMLEQiChEAQwgVdi5juEb8kRNzs6GQIAHFDpoVxtC2LQGAF+4/kAXo7TCol97yUjYtcKLpGB9Np4lxO5AfeAZvYJd3bzuJj+ugHXRMcODs0AQcRBWw89ETTCABjGtGFBrrnbZnldz9ELqoAqKFAHj/IU+1ZpnXaTei0HHPpVBR4lCtV3c/EDEE0ZJQgMpAlouIGi43MVRdlaLG6mp4jAWsvNL6gIWISRhLGQrgUswD4HIRgOvWOwHDSETT2ohliJ9ojUjH2puAiPvsbhEAt8ILU5OZxjWxNKKorVjH0mK2mnvzhoPYjcoDqATT3FhbcdyH0eTTDEVcX+ukYW5ApjlATIeR5YX4jmPeGWq/r9etrk1zYj6OBeyJuF5Ijr8V0Anj0jMWFPcLCcALEvtKBrAXEvdSCrCAxL6WCxAOKyf+74dJOJg4MZ9mOtgTifs4NeHffZ4XJv0B3xbX8BtQIPkAAAAASUVORK5CYII=); }
        .tag.tradable { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAaFQTFRF////Sdu2QL+fSsqqR8ytQsWgSsyqPcKhRs6rQMKjQMmlR8+sR86sRs6tPsWiR86sPcOiR8+sPMOhR86sR82qRsyqR86sO8CfO8GfPMGgR82sR86sR86sOL2cOL2dN72cNruaN72bOLybOL2cObybOb+dOb+eOrycOr+eO72dPL2dPL6ePb2dQL6fQr+gRMupRcChRsCiRsyqRs2rR8ipR86sSMGjSc6sSsGkSs+tS8GkS86tTMKlTM6uTM+uT8+vUcaqUsSoUtCxV8WqWMarWNCyWtGzW9GzYMivYciwYdG1YtK3Y8qxa9S6bMy1bc63cs64c9S9dM65d8+6eNa/edC8etG9etbAf9jDgdLAgdjEh9nGitXEj9vKmNrLm9rNnN7QndvNntvOn9zPoNzPot3Qot7RpeHUruDWruHWr+DWseLYsePZsuLYsuPZteTaueTcueXcuuXdu+TdvOXdvebev+bfwOfgyOjjyenjy+nlzOrlzerl0uvo0uzp1ezp1e3q1+3q1+3r2O3r2O7r2e7s2u7s3O/t3e/t3e/u9Pb55QoqpwAAACB0Uk5TAAcIGBkjLTZJUGOEl5iwwcjIy9rc3ePq6uvy8/X7/f5TUSsIAAABrElEQVQ4y3WTZ0PCMBCG24KKUCzDXZWIeyGIEfdeOHDiFkVQcaPi3gvRX21HSlOo75ekuaeXu8sdQSRF6oyMlWWtjFFHEunS0sUwqWJam2KmDCVQoRIDhds1Zpgms0a2Z+ZDFeVnJv9XtXME8kFh/rsmpwexW8Q4DNJ3z+brx+XJ08/xmHRiEPKT4l+LbzkBJ7v/fb8X5cJnSyP7+oMLINUELzziIc3Vj6/P4gRcuW0CskJHbrFiJKHj1+WD1s82gCs2IxI6wsgvHfHAji9ixwDvdZVAGAlGALd/E1GvwsVtt0AwhFUARnYHgFIOAHjCSrBiuM3lIF0cwUrAfwSLroB9KcRAuF0g8lCQo3fNOOGNJn4Dwq5QTBPCmymMsEd84UC8kt+axEJBOBerwH10ftVHZvmNXiw1p9MQRjjuF8DwPLcpI5OP5TkPNkiE63EVebJgz92197bUwhPOrbgf2W1ZeMO4+w+/n8+uPl42GqVQcpQt564GjvGhOrkYRVRK03IErtKMtLZXEKXZKoPjrpX9Z6iOnkTYcqh/hlcgyixZKvONxj+3wKTHxv8PcqGZgETbMRwAAAAASUVORK5CYII=); }
        .tag.marketable { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAADdAAAA3QFwU6IHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAftQTFRF/////21t/4Bg43Fx5oBm446A/3Vq/3Bm/3FstYKG/3Bp/3BoxJSK/29p/3BqvpaO/3Bo/3BpsIKKnnuMtJSQ/3Bp/3Bon4uToZCUi3yS/3Bp/3Bp/3Bp2HR3k4+Yg4WZcn6cd4Cba3+ebICfcYCccoOddIeldIileIWcfoGZhXyVh5Gmj3uRm5eppKq0qXmIrbK6rnuJtrrBwL3Hya23zrO703R51nR41nt+49nR6HNy7nJv8HFu8urg+nBr+/bu/NZP/NdQ/Nhn/dBS/dJS/dJT/dKZ/dRo/dZP/dZW/ddQ/dhQ/dhR/dlR/dmq/qld/r9X/sBX/sNX/sVW/s+O/tCP/txT/3Bp/3Jq/3No/3Nq/3Ro/3Rt/3dw/3hs/3tt/35t/35v/39v/394/4Bm/4Nx/4Vl/4Vx/4Z5/4dy/4xj/4x0/491/5B2/5Fj/5F2/5R3/5l5/5p6/5t6/5t7/5x7/517/6F9/6N9/6d//6qA/6uB/62B/66C/7CB/7CD/7SE/7aF/7mG/7qH/7qS/7q3/7uP/7yN/72F/72I/7+J/8CJ/8GK/8KK/8OK/8SL/8aM/8eM/8iZ/8mJ/8mN/8qN/8yO/86P/9CP/9CQ/9GQ/9lu/9yq/+K6/+Pi/+Tc/+XW/+jH/+nK//Xo//ju//v1//z7//78////iQSipQAAACJ0Uk5TAAcICQoSGBktN0mElpeYoMHIzM7X2uPk6fHy8/X2+vz+/rre7nQAAAGoSURBVDjLY2CAA0YuPgFRaWlRAT4uRgZMwM4rFQ4HUrzsaNJM3DLhKECGmwlZnk0wHAMIsiHkOcTCsQAxDrh+rPJAFVAzmATDcQBBiDu4MWUioDQ32H+o7i+ub+qbNrMqDuIXkG95UbTWzoKAaWUR4TGGWsLA8EMKn6wgz9l1OcVTwUr6c5fpKimyMnAh5PO8vL29A8PDS6CmLNVTUuJn4EMoCPby8XVw7+iFys9aYqCkJMEggFDg7OUR5rRwFhwsNlJSkmMQRSjw93b08nVNza/qm9jdWF1eON9YSUmeQRqhIDrAy8slDcFvNVFTVkBWEB4emYISJjZm5rLIVmADoiBH2llbJeNSIMAgpKmipKS9oq25acLUmiQMBXwMPEpAoLx8DthjU8AqEjIro2AKuBiYNUAq7OdCvD6zp6F90uTpXRNboIkTmHzFQQpsF4FkQ0NnzAp185s1q7M4A6KAFxibnKpABZYLSvMrGqfMmhUya1ZfeSI86YITt4iSkrrpPLBAfHZBUTqSE8EJhoFFUkffIhZPkiOYaAkne8IZh3DWI5x5cWd/AOZ4E6RUkDKZAAAAAElFTkSuQmCC); }
        .tag.disagreement { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAWhSURBVFjDvVdrTFtlGMaZLCYuhh9LFhONZon+2VyiZEILlDoZbVk4PafINBsZiUyNi1FnjJsuyOaFGadGmQoDxrh2G5cyzYjEbYwNYYUhlHEZ5bJSOrB0YLEUeoH29f0OPXB6gzKW/Xhz0p7zfc/zve/zXr4wAAgLyVJS1ttldIJTyvxslzINDimjnZHQVnM8PTu5gzaMxtH9uliqXR9HfWoSp2wIdd8VP7C+Sm0ioAhoQYPlzCZhwPSKHPoElGsolro1Ity19f4J4IkdMvoLh1RhXQnY19BDMCqWQ3dUkvtODHV9OY8EPTUCN4UARrwyFey9ZScNPYIk6BNSlmDe8PvDkSh/ARcbgmza6ZTR787JmLgZieLJxXU0He6UJb/olCoO4Dfd/DXWBIYQIETmDSJKsSyBhZMHAJcwvQ4JvRs/fyQUYdmktBjXtXLrZ1EbvegJQsLXE94xD+x2t12anBhytnhlDZPD7fMfhuNW1EI4+JpYcj0ruKCxttsljHTVJNBIyLh9jJghnZFJQITpRcAjOl+1zz0oErguj8sOEgriCS4UCywX8pwPNuiU0C/j8981k9DVhEN3VZrznf19ZA+TxwukTiwQYGPvW2ToVJaYRPHSfZHor94MQzUfwqCqHgZr5tDArVHWc17oQg+guYkWwkh59QHohqNH1y3GMCQS+P1AdRSCZiFoNwEMYK65t/c3k/VDMRTrBVK2/dyPDN/3E1IgEonJdlfpiUwELcDNjUFAvcx96RTrhXFeGMI8jWWJgCQ5HjrE4dCzZX0wEnbmdXD9kbu08UANzHZVwERLGThvVwUncbuKrQ1T8TRLoD+aMoeRrsYn4KoSvwcagQ3NBB2Rz4Em6iB0CAbxdwZHwnrkINy9dgbuqUvB2FQCussFMPRnPow1FiEZVVAC89pqkyNRMUuqIyHQK6AchMA0j8A0Al1EA9Y6oj7Bp8Pzex7aIjYSErPpb1qGPaDE7lwqAGNjkd3V7w9OvGPtPA///FWM3+WDLXXfGBEiIUCE6EtgBlqjFQhmgU6BHgk8ix7QLJARDF789fBmVfbnb9Uf+yhL9/Uh+92Sb8GQ+xXovzkM7q4Kty84CYe+vnCRKJJ22felWTkCPVGUyy8EjgRmK3Ruexw6hEdAI2yEduFr+EyoO/XxrprsDDcaEKvNPQZXCrOgXfUjzPX5x93RWwnDV06zp8bQ6DFcGeb09Ge4BkUIaIVJk34ixKxIA030lsUwaASjRIS/nczMqcv7EhqKj8ONs99By/nvQXMhGxwBRGfpOMvqYuRqoX1KXR7h06QWRTgUI2/zS0OnlM4GdeQTCDztIXBVrTyxDQFNBPRm5Q+grcuB8RvFficnmWBoOMO6e6T+tN3Scu75QH2BS8NhEVUQqBC1sAu6tj+NGtgLPeINXRd++kVXnw/mv8uBLzQiMFt3BUy2liFwoUeQ+WBSnQTH7j3exQpbOZkn+IXIIJLvCVKKmTe4hXPaylgEnV5KJRVMa87BePNS+nE2VpfnnvngAH8fG7ZyCdttcZ7gl2IyrunEdHiwZjTJTTzG5pKb5jYlmNvKYfR6kRcgOS3WgwlTc2mluVUZ52lgU35lG+cJdqjhNaPhWHnlCu2YriXvTM0lv/NBSSqhqrUmdclxq1q5ya9sSxXbEczsO9Tw2zEpQDqx+LGVBxIZc2isTblxvKn4mrGp+PKEuox0yXUrDiEJdESABrY4kOhFVOYqRjK61msADXUSSpRH8ocabiTD+n9v9UMpaoIvzGUNWzmZJ8hQE3AoFVGitYzlLaROkGLFVsyUlEfJmlmZ4inSRUkrDzqWY9kd20EnPOiLyYxPLwl4MRmIpoy+J38oV7M+YZJtJE7+2UO/nGqF1LwuhlJxqbYmAitdzy07mUl0dRNe0ZV6kTzXEEulkgoX6r7/A+kqzPz6kx4tAAAAAElFTkSuQmCC); }
        .item_currency_amount { background: rgba(0,0,0,0.8); }
        .item .lower_price { position: absolute; display: block; right: 0; bottom: 0; background: rgba(0,0,0,0.8); color: #fff; }
        .item.selling .inventory_item_link { background: rgba(200,0,0,0.3); }
        .item.crafted .inventory_item_link { background: rgba(0,200,0,0.3); }
        .item .lower_price, .item .old_lower_price, .item .sce_worth {
            position: absolute; display: inline-block; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); color: lightgrey; font-size: 10px; padding 1px 2px;
        }
        .item .sce_worth { left: 0; right: unset; }
        #targetedItemsPreview .item { display: inline-block; width: 30px; }
        #targetedItemsPreview .item img:not(.item_throbber) { position: relative; width: 30px; }
        #targetedItemsPreview .item:after {
            position: absolute; display: block; content: "";
            top: 0; left: 0; right: 0; bottom: 0;
            border: dashed rgba(0,0,0,0) 1px;
        }
        #targetedItemsPreview .item.targetStartAt:after { border-color: yellow; }
        #targetedItemsPreview .item.untargetStartAt:after { border-color: red; }
        #targetedItemsPreview :-moz-any(.item_currency_amount, .item_currency_name) { font-size: 10px; z-index: 1; }
        #targetedItemsPreview .item.lower_price { display: none; }
        #iteminfo0_item_tags { display: none; }
        #iteminfo0_item_descriptors { display: none; }
        .item_scrap_actions div:nth-child(3) { display: none; }
        .item_actions .btn_small, .item_owner_actions .btn_small { margin-right: 8px; margin-bottom: 8px; }
        .inventory_iteminfo .item_desc_content { background-image: none; padding: 11px; min-height: auto; }
        .item_desc_content .tag { width: 32px; height: 32px; display: inline-block; }
        .item_desc_icon { position: relative; left: 0; top: 0; right: 0; padding-left: 120px; min-height: 128px; }
        .item_desc_icon_center { display: inline-block; position: absolute; height: 128px; text-align: left; left: 0 }
        .item_desc_icon_center img { position: absolute; height: 128px; }
        .item_desc_game_info { font-size: 11px; }
        .item_desc_game_info .item_desc_game_icon { height: 24px; width: 24px; }
        .item img:not(.item_throbber) { position: absolute; }
        */}.toComment()).appendTo("head");
        // .toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    }


    function GameCards() {
        console.log("GameCards()");

        var hashNameList = [];
        var appId = location.pathname.match(/\/gamecards\/(\d+)/)[1];

        function addButton(href, text, blank, onclick) {
            var $button = $("<a />")
            .attr({ href: href })
            .addClass("btn_grey_grey btn_grey_grey btn_medium")
            .append("<span>" + text + "</span>")
            .css({ marginRight: "3px", marginLeft: "3px", marginBottom: "3px" });
            if (blank) {
                $button.attr({ target: "_blank" });
            }
            if (onclick) {
                $button.click(onclick);
            }
            $button.appendTo($(".gamecards_inventorylink")[0] || $(".badge_detail_tasks"));
        }

        addButton("https://steamcommunity-a.akamaihd.net/market/multibuy?appid=753&contextid=6", "Buy these cards on the Market", false, function () {
            var params = "";
            for (var i = 0; i < hashNameList.length; i++) {
                params += "&items[]=" + encodeURIComponent(hashNameList[i]) + "&qty[]=0";
            };
            $(this).attr("href", "https://steamcommunity-a.akamaihd.net/market/multibuy?appid=753&contextid=6" + params);
        });
        addButton("http://steamcommunity.com/app/" + appId + "/tradingforum/", "トレード掲示板");
        addButton("http://www.steamcardexchange.net/index.php?inventorygame-appid-" + appId, "Steam Card Exchange で開く");
        addButton("http://store.steampowered.com/app/" + appId + "/", "ストアを開く");
        addButton("http://steamcommunity.com/app/" + appId + "/", "コミュニティを開く", true);

        $(".badge_card_set_card").css({ position: "relative" }).each(function (i, el) {
            $("<span />").text(i + 1)
                .css({
                position: "absolute",
                left: "15px",
                top: "15px",
                zIndex: 100,
                fontSize: 70,
                opacity: 0.8,
                textShadow: "1px 1px 1px #000"
            }).appendTo(this);
        });

        var cards = {};
        /// カードをクリックで単品のマーケットページへ
        $(".badge_card_set_card .game_card_ctn").each(function () {
            var cardName = $(this).next().text().trim().replace(/^\(\d+\)/, "").trim()
            cards[cardName] = $(this);
            $(this).attr({
                onclick: ""
            })
                .removeClass("with_zoom")
                .css({ cursor: "pointer" })
                .find(".game_card_hover")
                .remove();
        }).click(function (event) {
            window.open("http://steamcommunity.com/market/listings/753/" + encodeURIComponent($(this).attr("hash-name")));
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        });
        console.log(cards);

        /// カードの値段と販売数を表示する
        $.get(location.protocol + "//steamcommunity.com/market/search/render", {
            start: 0,
            count: 30,
            search_descriptions: "0",
            sort_column: "popular",
            sort_dir: "desc",
            appid: "753",
            "category_753_cardborder[]": "tag_cardborder_0",
            "category_753_Game[]": "tag_app_" + appId,
            "category_753_item_class[]": "tag_item_class_2"
        }, function (result) {
            $(".market_listing_row", result.results_html).each(function () {
                var name = $(this).find(".market_listing_item_name").text().replace(/\(トレーディングカード\)/, "").trim();
                var price = $(this).find(".market_table_value > .normal_price").text();
                var qty = $(this).find(".market_listing_num_listings_qty").text();
                var hashName = $(this).attr("data-hash-name");
                var img = $(this).find(".market_listing_item_img").attr("src");
                cards[name]
                    .attr("hash-name", hashName)
                    .parent()
                    .append($('<span class="market_value" />').text(qty + " @ " + price));
                hashNameList.push(hashName);
            });
            $(".badge_card_set_card:not(:has(.market_value))").append("N/A");

            console.log(hashNameList);
        });
    }


    /* ***
     * /market/litings/
     */
    function MarketListings() {
        console.log("MarketListings()");

        /// 自動チェック
        $("#market_buyorder_dialog_accept_ssa").get(0).checked = true;

        /// カードが見つからないとき、カード名に(Trading Card)を付与
        if ($("#searchResultsTable:only-child").length === 1) {
            if (location.pathname.indexOf(encodeURIComponent(" (Trading Card)")) === -1 &&
                location.pathname.indexOf(" (Trading Card)") === -1) {
                var url = location.href.replace("?", "%3F");
                location.href = url + " (Trading Card)";
            }
        }

        /// アクションリンク
        var appid = location.href.split("/").splice(-1).join("").match(/\d+/)[0];

        addButton(`http://steamcommunity.com/app/${appid}/tradingforum/`, "トレード掲示板");
        addButton(`http://store.steampowered.com/app/${appid}/`, "ストアページを開く");
        addButton("#", "オファーで検索する").click(function () {
            var q = $("#largeiteminfo_item_name").text() + " " + $("#largeiteminfo_item_type").text();
            localStorage[SEARCH_KEY] = JSON.stringify(q.trim());
        }).attr("target", "");
        // SCE
        addButton(`http://www.steamcardexchange.net/index.php?inventorygame-appid-${appid}`, "Steam Card Exchange を開く");
        // バッチ
        var profileUrl = $("#global_actions .user_avatar").attr("href");
        addButton(`${profileUrl}gamecards/${appid}/`, "バッチの進行度を開く");
        addButton(`${profileUrl}gamecards/${appid}/?border=1`, "キラバッチの進行度を開く");
        // ブースターパック
        addButton("", "ブースターパックのマーケットページを開く");
        // トレーディングカード
        var $nav = $($(".market_listing_nav a").get(1));
        addButton($nav.attr("href") + "&category_753_item_class[]=tag_item_class_2&category_753_item_class[]=tag_item_class_5#p1_price_asc",
                  "トレーディングカードのマーケットページを開く");

        function addButton(url, text) {
            return $("<a />")
                .attr({
                href: url,
                target: "_blank"
            })
                .css({ margin: "3px", display: "inlineBlock" })
                .addClass("btn_grey_grey btn_small")
                .append("<span>" + text + "</span>")
                .insertAfter("#largeiteminfo_game_info");
        }

        try {
            function addOrder(price, qty) {
                var $order = $("<a >")
                .attr({ price: price, qty: qty })
                .text("buy ￥" + price + " - qty " + qty)
                .click(function () {
                    $(".market_commodity_buy_button").first().trigger("click");
                    $("#market_buy_commodity_input_price").val($(this).attr("price"));
                    $("#market_buy_commodity_input_quantity").val($(this).attr("qty"));
                    CreateBuyOrderDialog.UpdateTotal();
                });
                $(".market_commodity_orders_block").first().append($order).append("<br />");
            }

            var item = g_rgAssets[753][6];
            item = item[Object.keys(item)[0]];

            var isCard = !(item.type.indexOf("背景") >= 0 || item.type.indexOf("絵文字") >= 0);
            if (isCard) {
                addOrder(1, 20);
            } else {
                addOrder(0.7, 30);
                addOrder(0.66, 30);
                addOrder(0.55, 30);
            }
        }
        catch (ex) {}

        var $history_sell = $("<div />").appendTo("#market_activity_section");
        var $history_buy = $("<div />").appendTo("#market_activity_section");

        /*
        openDB().onsuccess = (ev) => {
            ev.target.result
                .transaction(HISTORY_STORE)
                .objectStore(HISTORY_STORE)
                .index("app_id")
                .get(parseInt(appid))
                .onsuccess = (ev) => {
                var result = ev.target.result;
                if (result) {
                    for (var id in result) {
                        var item = result[id];
                        if (item.is_sell) {
                            $('<span class="item"><span class="action">sold</span> by <span class="price">{price}</span></span>'.map({ price: item.price })).appendTo($history_sell);
                        }
                        if (item.is_buy) {
                            $('<span class="item"><span class="action">bought</span> by <span class="price">{price}</span></span>'.map({ price: item.price })).appendTo($history_buy);
                        }
                    }
                }
            };
        };*/

        $(".market_commodity_orders_block").css({ boxSizing: "border-box" });
    }


    /* =========================================
     * コミュニティ/マーケット /market/
     * マーケット注文リスト、履歴
     * SteamCardExchangeとのインベントリ、価格同期
     * ========================================= */
    function Market() {
        log("Market()");

        $("<style />").text(function () {/*
.my_listing_section .my_market_header_active {
cursor: pointer;
text-decoration: underline;
}
.my_listing_section.hidden .my_market_header_active:before {
display: inline;
content: '[+]';
margin-right: 3px;
text-decoration: none;
}
.my_listing_section.hidden .market_listing_row {
display: none;
}
*/}.toComment()).appendTo("head");


        /// 出品リスト、注文リストを折りたたむ
        // .my_listing_section に hidden クラスを付加
        $("body")
            .on("click", ".my_market_header", safeFunction("market_toggle", function (args) {
            log("toggle myListings " + $(this).text());
            $(this).parents(".my_listing_section").toggleClass("hidden");
        }));


        /// 出品リスト、注文リストをソート可能にする
        // .my_listing_section に orderby 属性を付加
        $("body")
            .on("click", ".market_listing_table_header > span", safeFunction("orderby_clicked", function () {
            log("Sort()");

            var $all_listings = $(".my_listings_section");
            var $listings = $(this).parents(".my_listing_section");

            // orderby="{kind}_{desc}"
            var orderby = ($listings.attr("orderby") || "_").split("_"),
                isReverse = false;

            // 注文数、値段のソート用Attributeを追加する
            $(this).parents(".my_listing_section").find(".market_listing_row")
                .each(function () {
                var $price = $(this).find(".market_listing_price").first();
                var inlinePrice = $price.text().split("@");

                $(this).attr({ current_order_qty: parseInt(inlinePrice[0]) });
                if (inlinePrice[1] != null) {
                    $(this).attr({ current_price: parseFloat(inlinePrice[1].replace(/[^\d\.]/gm, "")) });
                }
            });

            if ($(this).hasClass("market_listing_listed_date")) {
                log("sort by listed_date");

                isReverse = orderby[0] === "date" && orderby[1] === "asc";

                $listings
                    .find(".market_listing_row")
                    .sort(function (a, b) {
                    var aValue = parseInt($(a).attr("listed_date"));
                    var bValue = parseInt($(b).attr("listed_date"));
                    if (aValue < bValue) {
                        return isReverse ? 1 : -1;
                    } else if (aValue > bValue) {
                        return isReverse ? -1 : 1;
                    } else {
                        return $(a).attr("game_name") > $(b).attr("game_name") ? 1 : -1;
                    }
                }).appendTo($listings.find("[id*=MyListing]")[0] || $listings);

                $listings.attr("orderby", "date_" + (isReverse ? "desc" : "asc"));
            }
            // 注文数でソートする
            else if ($(this).hasClass("market_listing_buyorder_qty")) {
                log("sort by qty");

                isReverse = orderby[0] === "qty" && orderby[1] === "asc";

                $listings
                    .find(".market_listing_row")
                    .sort(function (a, b) {
                    var aValue = parseInt($(a).attr("current_order_qty"));
                    var bValue = parseInt($(b).attr("current_order_qty"));
                    if (aValue < bValue) {
                        return isReverse ? 1 : -1;
                    } else if (aValue > bValue) {
                        return isReverse ? -1 : 1;
                    } else {
                        return $(a).attr("game_name") > $(b).attr("game_name") ? 1 : -1;
                    }
                })
                    .appendTo($listings.find("[id*=MyListing]")[0] || $listings);

                $listings.attr("orderby", "qty_" + (isReverse ? "desc" : "asc"));
            }
            // 値段でソートする
            else if ($(this).hasClass("market_listing_my_price")) {
                log("sort by price");

                isReverse = orderby[0] === "price" && orderby[1] === "asc";

                $listings
                    .find(".market_listing_row")
                    .sort(function (a, b) {
                    var aValue = parseFloat($(a).attr("current_price"));
                    var bValue = parseFloat($(b).attr("current_price"));
                    if (aValue < bValue) {
                        return isReverse ? 1 : -1;
                    } else if (aValue > bValue) {
                        return isReverse ? -1 : 1;
                    } else {
                        return $(a).attr("game_name") > $(b).attr("game_name") ? 1 : -1;
                    }
                })
                    .appendTo($listings.find("[id*=MyListing]")[0] || $listings);

                $listings.attr("orderby", "price_" + (isReverse ? "desc" : "asc"));
            }
            // placeholder
            else if ($(this).hasClass("placeholder")) {
                // blank
            }
            // ゲーム名でソートする
            else {
                log("sort by gamename");

                isReverse = orderby[0] === "name" && orderby[1] === "asc";

                $listings
                    .find(".market_listing_row")
                    .sort(function (a, b) {
                    if (isReverse) {
                        return $(a).attr("game_name") > $(b).attr("game_name") ? -1 : 1;
                    } else {
                        return $(a).attr("game_name") > $(b).attr("game_name") ? 1 : -1;
                    }
                })
                    .appendTo($listings.find("[id*=MyListing]")[0] || $listings);

                $listings.attr("orderby", "name_" + (isReverse ? "desc" : "asc"));
            }
            log("ordered by " + $listings.attr("orderby"));

            $all_listings.addClass("hidden");
            $listings.removeClass("hidden");

        }, 1000));

        // リストのDOM更新時に呼び出す
        var myListings = safeFunction("MyListingsUpdated", function () {
            log("myListings() " + new Date().getTime());

            new Promise(function (resolve) {
                var req = openDB();
                req.onerror = (ev) => {
                    log("db load error");
                    log(event);
                    resolve({ success: false, event: ev });
                };
                req.onsuccess = (ev) => {
                    resolve({ success: true, db: ev.target.result });
                };
            }); // promise
            // .then(function (prev) {
            $(".market_listing_row").each(() => {
                var self = this;
                // ゲーム名のソート用Attriuteを追加する
                $(this).attr({
                    game_name: $(this).find(".market_listing_game_name").text()
                });
                var $listed_date = $(this).find(".market_listing_listed_date");
                if ($listed_date.length > 0) {
                    var date = $listed_date.text().match(/\d+/gm);
                    var date1 = parseInt(date.pop());
                    var date2 = parseInt(date.pop()) * 100;
                    var date3 = (parseInt(date.pop()) || 0) * 10000;
                    $(this).attr({ listed_date: date1 + date2 + date3 });
                }

                /*
                    // 出品にSCEのWorthを追記
                    if (prev.success) {
                        var db = prev.db;
                        var tran = db.transaction(["market"]);
                        var sotre = tran.objectStore("market");
                        var req = store.get();
                        req.onerror = function () {
                            log("db write error");
                        };
                        req.onsuccess = function (event) {
                            var worth = event.result.worth;
                            $(self).attr({ worth: worth });
                        };
                    }*/
            }); // .each

            // 出品リスト、注文リストの名前のヘッダー要素をクリックしやすくする
            $(".market_listing_table_header").map(function () {
                return $(this).find("span").last();
            }).css({
                width: "430px",
                display: "inline-block"
            });
        }, 1000);

        $("body").on("DOMNodeInserted", "#tabContentsMyListings", myListings);
        if (location.hash.indexOf("opened") === -1) {
            myListings();
        }

        var historyToAssets = {};
        // ホバー作成関数をフックして要素とAssetsを関連づける
        function hookCreateItemHoverFromContainer() {
            // CreateItemHoverFromContainer( g_rgAssets, 'history_row_1712920262077603619_1712920262077603620_name', 753, '6', '4716013374', 0 );
            var original = CreateItemHoverFromContainer;
            if (original.hooked) return;

            var hook = function (container, id, appid, contextid, assetid, amount) {
                if (id.indexOf("history_row_") === 0 && id.indexOf("_name") >= 0) {
                    var assets = container[appid][contextid][assetid];
                    var historyId = id.replace("_name", "");
                    // なければ追加
                    if (!historyToAssets[historyId]) {
                        historyToAssets[historyId] = assets;
                        original(container, id, appid, contextid, assetid, amount);
                    }
                    // 要素にカードにリンクを保持させる
                    $("#" + historyId).attr("href", `http://steamcommunity.com/market/listings/${assets.market_hash_name}/${assets.appid}`);
                }
            };
            hook.hooked = true;
            CreateItemHoverFromContainer = hook;
            console.log("CreateItemHoverFromContainer().hooked");
        }

        // リストをクリックしたとき、カードのページを表示
        $(document).on("click", "#tabContentsMyMarketHistoryRows .market_listing_item_name_block, #tabContentsMyMarketHistoryRows .market_listing_item_img", (ev) => {
            var $row = $(ev.target).parents(".market_listing_row");
            window.open($row.attr("href"));
        });

        function syncMarketPrices() {
            console.log("update prices()");

            function getSteamCardExchangeInventory(data) {
                data = data || {};
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        url: "http://www.steamcardexchange.net/api/request.php?GetInventory",
                        method: "GET",
                        onload: (result) => {
                            data.worthes = JSON.parse(result.response).data;
                            resolve(data);
                        },
                        onerror: (result) => {
                            console.log(result);
                        }
                    });
                });
            }
            function getSteamCardExchangeBadgePrices(data) {
                data = data || {};
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        url: "http://www.steamcardexchange.net/api/request.php?GetBadgePrices_Member",
                        method: "GET",
                        onload: (result) => {
                            data.prices = JSON.parse(result.response).data;
                            resolve(data);
                        },
                        onerror: (result) => {
                            //console.log(result);
                        }
                    });
                });
            }
            function saveResponse(data) {
                data = data || {};
                var apps = {}, app_id;

                for (var i = 0; i < data.worthes.length; i++) {
                    var w = data.worthes[i];
                    app_id = w[0][0];
                    if (!apps[app_id]) {
                        apps[app_id] = { app_id: app_id };
                    }
                    apps[app_id].worth = {
                        app_id: app_id,
                        title: w[0][1],
                        cards: w[0][2],
                        //	buyable_cards: w[0][3],
                        //	notable_cards: w[0][4],
                        worth: w[1],
                        cards_in_stack: w[2],
                        total_cards: w[3][0],
                        available_cards: w[3][1],
                        disable_cards: w[3][2]
                    };
                }

                for (var j = 0; j < data.prices.length; j++) {
                    var p = data.prices[j];
                    app_id = p[0][0];
                    if (!apps[app_id]) {
                        apps[app_id] = { app_id: app_id };
                    }
                    apps[app_id].price = {
                        app_id: app_id,
                        title: p[0][1],
                        total_cards: p[1],
                        price_doller: p[2],
                        your_level: p[3],
                        last_update: p[4]
                    };
                }

                var req = openDB();
                req.onerror = (ev) => {
                    log("db load error");
                    log(ev);
                    alert("db load error");
                };
                req.onsuccess = (ev) => {
                    var store = ev.target.result
                    .transaction(MARKET_STORE, "readwrite")
                    .objectStore(MARKET_STORE);

                    for (var id in apps) {
                        store.put(apps[id]);
                    }
                };
            }

            getSteamCardExchangeInventory()
                .then(getSteamCardExchangeBadgePrices)
                .then(saveResponse);
        }

        function fetchHistoryFromHtml(html) {
            var $html = $(html);
            var outputs = [];
            $html.find(".market_listing_row").each((e, ele) => {
                var $e = $(ele);
                var data = {};
                data.historyId = $e.attr("id");
                data.price = $e.find(".market_listing_price").text().replace(/[\t\n\s]/gm, "");
                var $date = $e.find(".market_listing_listed_date");
                data.start = $($date[0]).text().replace(/[\t\n\s]/gm, "");
                data.end = $($date[1]).text().replace(/[\t\n\s]/gm, "");
                data.is_buy = $e.find(".market_listing_gainorloss").text().trim().replace(/[\t\n\s]/gm, "") === "+";
                data.is_sell = $e.find(".market_listing_gainorloss").text().trim().replace(/[\t\n\s]/gm, "") === "-";
                data.is_publish = false;
                data.is_cancel = false;
                if (data.is_buy && data.is_sell) {
                    if ($e.find("market_listing_whoactedwith").text().indexOf("掲載") >= 0) {
                        data.is_publish = true;
                    }
                    if ($e.find("market_listing_whoactedwith").text().indexOf("キャンセル") >= 0) {
                        data.is_cancel = true;
                    }
                }
                outputs.push(data);
            });
            return outputs;
        }

        function onMyHistoryPageChangedHandler() {
            console.log("page changed");

            openDB().onsuccess = (ev) => {
                var store = ev.target.result.transaction(HISTORY_STORE, "readwrite").objectStore(HISTORY_STORE);
                var history = fetchHistoryFromHtml($("#tabContentsMyMarketHistoryRows"));

                history.forEach((data) => {
                    try {
                        var assets = historyToAssets[data.historyId];
                        data.app_id = assets.market_fee_app;
                        data.hash_name = assets.card_hash_name;
                        store.put(data);
                    } catch(ex) {
                        console.log(ex);
                    }
                });
            };
        }

        /* =====
        Toolbar
        * =====*/

        function makeButton(text) {
            return $("<a/>")
                .addClass("item_market_action_button item_market_action_button_green")
                .append(`<span class="item_market_action_button_contents">${text}</span>`);
        }

        $("<div />").attr("id", "market-toolbar").prependTo("#BG_bottom");

        makeButton("マーケット価格の同期")
            .appendTo("#market-toolbar")
            .click(syncMarketPrices);

        $("<style />").text(function () {/*
#market-toolbar input { width: 30px; height: 16px; margin: 2px 0; display: inline-block; }
#market-toolbar input + input { margin-right: 5px; }
#market-toolbar .item_market_action_button_contents { float: none; display: inline-block; margin-right: 5px; }
.market_listing_row :-moz-any(.market_listing_item_name_block, .market_listing_item_img) { cursor: pointer; }

        */}.toComment()).appendTo("head");

        function onMyListingsPageChanged() {
        }

        /* =====
         Interval Hooking
         * ====*/

        var hookInterval = function (func, interval) {
            var timer = 0;
            function clear() {
                timer = clearInterval(timer);
            }
            timer = setInterval(() => {
                func(clear);
            }, interval);
        };

        // SetPageChangedHandler
        hookInterval((clear) => {
            if (g_oMyListings) {
                clear();
                g_oMyListings.SetPageChangedHandler(onMyListingsPageChanged);
            }
        }, 100);

        // マーケット履歴を100件ごとに表示
        hookInterval((clear) => {
            if (LoadMarketHistory) {
                clear();
                console.log(LoadMarketHistory.toString())
                LoadMarketHistory = LoadMarketHistoryOverride;
            }
        }, 100);

        function LoadHistory(page, count) {
            g_bBusyLoadingMarketHistory = true;
            var start = (page - 1) * count;

            GM.xmlHttpRequest({
                url: `http://steamcommunity.com/market/myhistory?start=${start}&query=&count=${count}`,
                method: 'GET',
                headers: { "Accept": "application/json" },
                onload: function( xhr ) {
                    // console.log(xhr);
                    var response = xhr.responseJSON;
                    if (!response) {
                        response = JSON.parse(xhr.responseText);
                    }
                    if (response)
                    {
                        $("#tabContentsMyMarketHistory").html(response.results_html);
                        MergeWithAssetArray(response.assets);
                        window["eval"](response.hovers);

                        g_oMyHistory = new CAjaxPagingControls(
                            {
                                query: '',
                                total_count: response.total_count,
                                pagesize: response.pagesize,
                                prefix: 'tabContentsMyMarketHistory',
                                class_prefix: 'market'
                            }, 'https://steamcommunity.com/market/myhistory/'
                        );
                    }
                    g_bBusyLoadingMarketHistory = false;
                },
                onerror: function() { g_bBusyLoadingMarketHistory = false; }
            });
        }

        // 履歴読み込み関数を上書きする関数
        function LoadMarketHistoryOverride()
        {
            if ( g_bBusyLoadingMarketHistory )           {
                return;
            }
            g_bBusyLoadingMarketHistory = true;
            // added
            hookCreateItemHoverFromContainer();
            LoadHistory(1, 100);

            $(window).on("click", ".market_paging_pagelink", function () {
                LoadHistory(parseInt($(this).text()), 100);
            });
            $(window).on("click", "#tabContentsMyMarketHistory_btn_prev", function () {
                LoadHistory(parseInt($(".market_paging_pagelink.active").text()) - 1, 100);
            });
            $(window).on("click", "#tabContentsMyMarketHistory_btn_next", function () {
                LoadHistory(parseInt($(".market_paging_pagelink.active").text()) + 1, 100);
            });
        }
    }

    function MarketSearch() {
        log("MargetSearch()");
        var LevelColors = ["#256EBD", "#70B04A", "#9E2020", "#8650AC", "#505FAC", "#E46100"];

        function write($target, data) {
            if ($target.attr("data-has-details") === "true") {
                return;
            }

            var price_yen = parseFloat($target.find(".market_table_value .normal_price").text().slice(1));
            var text = "<br>";
            if (data && data.worth) {
                text += "{b}worth: ${data.worth.worth}{/b}<br>".mapTag({
                    b: {
                        name: "span",
                        style: price_yen === 0 ? "" :
                        data.worth.worth <= 6 && price_yen * 6 < data.worth.worth ? "color: limegreen;" :
                        price_yen * 4 < data.worth.worth ? "color: limegreen;" :
                        price_yen > data.worth.worth * 0.8 ? "color: orange" :
                        ""
                    }
                });
            }
            if (data && data.price) {
                var ppc = price_yen / data.price.total_cards;
                ppc = Math.floor(ppc * 100) / 100;
                text += `ppc: ¥ ${ppc}<br>`;
            }
            $target.find(".market_table_value:last").append(text);

            text = "<br>";
            if (data && data.worth) {
                text += `{b1}cards: ${data.worth.total_cards}{/b1}<br>{b2}stacks: ${data.worth.cards_in_stack} / ${data.worth.total_cards * 8}{/b2}<br>`.mapTag({
                    b1: {
                        name: "span",
                        style: data.worth.total_cards <= 10 ? "color: limegreen;" : "",
                    },
                    b2: {
                        name: "span",
                        style: data.worth.cards_in_stack <= data.worth.total_cards * 2 ? "color: firebrick;" :
                        data.worth.cards_in_stack <= data.worth.total_cards * 6 ? "color: limegreen;" :
                        "color: orange;"
                    }
                });
            }
            if (data && data.price) {
                text += `{b}level: ${data.price.your_level}{/b}<br>`.mapTag({
                    b: {
                        name: "span",
                        style: "color: " + LevelColors[data.price.your_level] + ";"
                    }
                });
            }
            $target.find(".market_listing_num_listings_qty").after(text);

            $target.attr("data-has-details", true);
            $target.find(".market_table_value").css({ overflow: "visible" });
        }
        var apps = {};

        $(document).on("DOMNodeInserted", "#searchResultsRows", safeFunction("search", function (event) {
            log(event);
            $(".market_listing_row_link").each(function () {
                var $this = $(this);

                var app_id = $this.attr("href").match(/(\d+)/g)[1];
                if (apps[app_id]) {
                    write($this, apps[app_id]);
                    return;
                }
                log(app_id);

                var req = openDB();
                req.onerror = function (event) {
                    log(ev);
                };
                req.onsuccess = function (event) {
                    var db = event.target.result;
                    var tran = db.transaction(MARKET_STORE);
                    tran.onerror = function () {
                        console.log("db error");
                    };
                    tran.oncomplete = function () {
                        console.log("db complete");
                    };

                    var store = tran.objectStore(MARKET_STORE);
                    req = store.get(parseInt(app_id));
                    req.onsuccess = function (event) {
                        if (req.result) {
                            write($this, req.result);
                        }
                    };
                };
            });

            $("#searchResults_controls").append();
        }))
            .$$().trigger("DOMNodeInserted");
    }

    function MarketMultiSell() {
        console.log("MarketMultiSell()");
        var $under = $("<td />")
        .addClass("multisell_menu")
        .attr("colspan", 10)
        .appendTo($(".market_multi_table"));

        $("<a />").text("Fill Amounts with 0").click(function () {
            $(".market_multi_quantity").val(0);
            UpdateOrderTotal();
        }).appendTo($under);

        $("<a />").text("Fill price with first").click(function () {
            if (Page.inMarketMultiSell) {
                var paidValue = $(".market_multi_price_paid").first().val();
                var recvValue = $(".market_multi_price_recv").first().val();
                $(".market_multi_price_paid").val(paidValue);
                $(".market_multi_price_recv").val(recvValue);
            } else {
                var value = $(".market_multi_price").first().val();
                $(".market_multi_price").val(value);
            }
            UpdateOrderTotal();
        }).appendTo($under);

        $("<a />").text("Fill qty with first").click(function () {
            var qty = $(".market_multi_quantity").first().val();
            $(".market_multi_quantity").val(qty);
            UpdateOrderTotal();
        }).appendTo($under);

        $(".market_multi_quantity").after($("<a />").text("+10").click(function (ev) {
            var $qty = $(ev.target).prevAll(".market_multi_quantity");
            if (Page.inMarketMultiSell) {
                var maxAmount = parseInt($pty.nextAll(".market_multi_qtyown").text().replace(/of|\\/, ""));
                $qty.val(Math.min(parseInt($qty.val()) + 10, maxAmount)).trigger("change");
            } else {
                $qty.val($qty.val() + 10).trigger("change");
            }
            UpdateOrderTotal();
        }));

        $(".market_multi_quantity").after($("<a />").text("+5").click(function (ev) {
            var $qty = $(ev.target).prevAll(".market_multi_quantity");
            if (Page.inMarketMultiSell) {
                var maxAmount = parseInt($pty.nextAll(".market_multi_qtyown").text().replace(/of|\\/, ""));
                $qty.val(Math.min(parseInt($qty.val()) + 5, maxAmount)).trigger("change");
            } else {
                $qty.val($qty.val() + 5).trigger("change");
            }
            UpdateOrderTotal();
        }));
        $(".market_multi_table tr").first().before($("<tr />").append($under.clone(true)));

        $("<style />").text(function (){/*
.multisell_menu a { margin-left: 5px; line-height: 30px; text-decoration: underline; }
*/}.toComment()).appendTo("body");

        var count = 0;
        $(".market_multi_table tbody tr").each(function (i, tr) {
            setTimeout(function () {
                var nameid = $(tr).attr("data-nameid") || $(tr).find(".market_multi_itemname").attr("id").split("_")[1];
                GM.xmlHttpRequest({
                    url: `https://steamcommunity.com/market/itemordershistogram?country=JP&language=english&currency=8&item_nameid=${nameid}&two_factor=0`,
                    method: 'GET',
                    headers: { "Accept": "application/json" },
                    onload: function( xhr ) {
                        var json = xhr.responseJSON || JSON.parse(xhr.responseText);
                        if (json.success != "1") return;
                        var $title = $(".market_multi_itemname", tr).parents("td");
                        $(json.sell_order_table).addClass("market_commodity_orders_table_sell").click(function (ev) {
                            $(".market_multi_price_paid", tr).val(parseFloat($(ev.target).text().substr(2)) - 0.1);
                            $(".market_multi_quantity", tr).trigger("change");
                            UpdateOrderTotal();
                        }).appendTo($title);
                        $(json.buy_order_table).addClass("market_commodity_orders_table_buy").click(function (ev) {
                            UpdateOrderTotal();
                        }).appendTo($title);
                    },
                    onerror: function() { }
                });
            }, 1500 * count);
            count++;
        });
        console.log(count);
        $("<style />").text(function () {/*
input.market_dialog_input {
    width: 100px;
}
.market_commodity_orders_table {
display: inline-table;
}
.market_commodity_orders_table td {
height: unset;
width: 30px;
padding: 0;
min-width: unset;
}
.market_commodity_orders_table::before {
    content: "buy";
    display: block;
    position: absolute;
    font-size: 50px;
    margin: 40px 60px;
    opacity: 0.3;
    z-index: 0;
    pointer-events: none;
}
.market_commodity_orders_table_sell::before {
    content: "sell";
}
.market_commodity_orders_table_buy::before {
    content: "buy";
}
*/}.toComment()).appendTo("head");
    }

    function InventoryModalToBuy() {
        log("InventoryModalToBuy()");

        /// マーケットの個別ページから「売却する」ボタンでインベントリを開いたとき
        /// 該当するカードを自動で絞り込む
        if (window.parent) {
            // 親ページにアクセス、jQueryは使えない
            var doc = window.parent.document;
            var gameName = $(doc.querySelector("#largeiteminfo_item_type")).text();
            var cardName = $(doc.querySelector("#largeiteminfo_item_name")).text();

            $("#filter_control")
                .val(gameName + " " + cardName)
                .trigger("click");
        }
    }

    /*
     * /trade/new
     */
    function TradeClass() {
        log("Trade()");

        var self = this;
        self.inventory = {};
        self.you = {};
        self.them = {};
        self.blacklist = TRADE_BLACKLIST.split(",");

        self.onLoaded = function (inventory) {
            for (var id in inventory) {
                var card = inventory[id];

                var type = card.type.replace("トレーディングカード", "");
                var name = card.name.replace("(トレーディングカード)", "");
                card._title = type + " - " + name;

                self.inventory[id] = card;
            }
        };

        self.search = function (q) {
            log("search(): " + q);

            q = q.trim();
            $("#inventory_box .card").remove();

            if (q === "") {
                return;
            }

            localStorage[SEARCH_KEY] = q;

            var inventory = self.inventory;

            var result = [];

            for (var id in inventory) {
                var card = inventory[id];
                if (card._title.indexOf(q) >= 0) {
                    result.push(card);
                }
            }

            result = result.sort(function (a, b) {
                if (a._title == b._title) {
                    return !!self.you[card.id];
                } else {
                    return a._title > b._title;
                }
            });

            for (var i = 0; i < result.length; i++) {
                var card = result[i];
                $("<div />")
                    .addClass("card")
                    .text(card._title)
                    .attr("data-card-id", card.id)
                    .css({
                    display: "block",
                    background: self.you[card.id] ? "#2A0A0A" : "#0A2A0A"
                })
                    .click(function () {
                    $(this).css("opacity", 0.5);
                    window.MoveItemToTrade(inventory[$(this).attr("data-card-id")].element);
                })
                    .appendTo("#inventory_box");
            }
        };

        function isNormalCard(item) {
            if (item.appid != "753") return false;
            var isTradingCard = false;
            for (var i = 0; i < item.tags.length; i++) {
                if (item.tags[i].category === "item_class" && item.tags[i].internal_name === "item_class_2") {
                    isTradingCard = true;
                }
                if (item.tags[i].category === "cardborder" && item.tags[i].internal_name === "cardborder_1") {
                    return false;
                }
            }
            return isTradingCard;
        }

        function randomArray(array) {
            for(var i = array.length - 1; i > 0; i--){
                var r = Math.floor(Math.random() * (i + 1));
                var tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }
        }

        self.onMatch = function () {
            var app_id = $("#cardMatchBox").val().match(/\d+/)[0];
            console.log("onMatch(): ", app_id);

            // バッチページから所持カード数、バッチレベルなどを取得する
            GM_xmlhttpRequest({
                url: "http://steamcommunity.com/id/noguchii/gamecards/" + app_id +  "/",
                method: "GET",
                onload: (result) => {
                    var $result = $(result.response);

                    // ゲーム名
                    var gameTitle = $result.find(".profile_small_header_location").last().text().trim();
                    self.search(gameTitle);

                    // レベル
                    var currentLevel = 0;
                    $result.find(".badge_info_description").remove(".badge_info_title, .badge_info_unlocked");
                    var m = $result.find(".badge_info_description").text().match(/(\d+)/gm);
                    if (m) {
                        currentLevel = parseInt(m[0]);
                    }
                    console.log("level: " + currentLevel);

                    var needCards = [];
                    var enoughCards = [];

                    $result.find(".badge_card_set_card").each(function (i, element) {
                        console.log(element);
                        var $this = $(element);

                        // 所持カード数
                        var count = 0;
                        var m = $this.find(".badge_card_set_text_qty").text().match(/\d+/);
                        if (m) {
                            count = parseInt(m[0]);
                        }

                        // カード名
                        $this.find(".badge_card_set_text").first().find("div").remove();
                        var name = $this.find(".badge_card_set_text").first().text().trim();

                        console.log(`${name} : has ${count}, need ${currentLevel - count}`);

                        var needCount = currentLevel - count;
                        if (needCount < 0) {
                            for (var yid in self.you) {
                                if (self.you[yid].market_hash_name == app_id + "-" + name) {
                                    needCount++;
                                    enoughCards.push(self.you[yid]);
                                    if (needCount >= 0) break;
                                }
                            }
                        } else if (needCount > 0) {
                            for (var tid in self.them) {
                                if (self.them[tid].market_hash_name == app_id + "-" + name) {
                                    needCount--;
                                    needCards.push(self.them[tid]);
                                    if (needCount <= 0) break;
                                }
                            }
                        }
                    });

                    var tradeCount = Math.min(needCards.length, enoughCards.length);
                    for (var i = 0; i < tradeCount; i++) {
                        window.MoveItemToTrade(needCards[i].element);
                        window.MoveItemToTrade(enoughCards[i].element);
                    }
                },
                onerror: (result) => {
                    console.log(result);
                }
            });
        };

        function getLevels(enableCache) {
            var BADGE_LEVELS_KEY = "BADGE_LEVELS";
            var BADGE_LEVELS_EXPIRE_KEY = "BADGE_LEVELS_EXPIRE";
            return new Promise(function (resolve, reject) {
                if (enableCache && new Date().getTime() < localStorage[BADGE_LEVELS_EXPIRE_KEY]) {
                    console.log("Levels from cache");
                    resolve(JSON.parse(localStorage[BADGE_LEVELS_KEY]));
                    return;
                }

                // SCEから取得
                GM_xmlhttpRequest({
                    url: "http://www.steamcardexchange.net/api/request.php?GetBadgePrices_Member&_" + new Date().getTime(),
                    method: "GET",
                    onload: (result) => {
                        var expire = new Date();
                        expire.setDate(expire.getDate() + 7);

                        var data = {};
                        var levels = JSON.parse(result.response).data;
                        // console.log(levels);

                        for (var i = 0; i < levels.length; i++) {
                            var fee = levels[i][0][0];
                            var lvl = parseInt(levels[i][3]);

                            if (lvl > 0) {
                                data[fee] = Math.max(data[fee] || 0, lvl);
                            }
                        }

                        localStorage[BADGE_LEVELS_EXPIRE_KEY] = expire.getTime();
                        localStorage[BADGE_LEVELS_KEY] = JSON.stringify(data);

                        console.log("Levels from SCE");
                        console.log(data);
                        resolve(data);
                    },
                    onerror: (result) => {
                        reject(result);
                    }
                });
            });
        }

        // バッチレベルに関係なく5枚以上のカードと5枚以下のカードを交換
        self.onAllMatch = async function () {
            var c, fee, hash;
            // Them側重複のみトレードする
            var isDupsTrade = jQuery("#cardMatchDupsForThem")[0].checked;
            var maxCard = parseInt(jQuery("#wantCardsCount").val());
            var isNoCaps = jQuery("#isThroughLevels")[0].checked;

            // 全てのカードを[market_app_fee][market_hash_name]の二階層にネストする
            var youCards = {};
            var themCards = {};

            // you
            for (var yid in self.you) {
                c = self.you[yid];
                fee = c.market_fee_app;
                hash = c.market_hash_name;

                // filtering
                if (c.element.parentNode.parentNode.className.indexOf("trade_slot") >=0) continue;
                if (!isNormalCard(c)) continue;
                if (self.blacklist.indexOf(fee) >= 0) continue;

                youCards[fee] = youCards[fee] || {};
                if (!youCards[fee][hash]) {
                    youCards[fee][hash] = [];
                }
                youCards[fee][hash].push(c);
            }

            // them
            for (var tid in self.them) {
                c = self.them[tid];
                fee = c.market_fee_app;
                hash = c.market_hash_name;

                // filtering
                if (c.element.parentNode.parentNode.className.indexOf("trade_slot") >=0) continue;
                if (!isNormalCard(c)) continue;
                if (self.blacklist.indexOf(fee) >= 0) continue;

                themCards[fee] = themCards[fee] || {};
                if (!themCards[fee][hash]) {
                    themCards[fee][hash] = [];
                }
                themCards[fee][hash].push(c);
            }

            // バッチレベルを取得
            var levels = isNoCaps ? {} : await getLevels(true);
            console.log("levels:", levels);

            var enough = {};
            var need = {};

            // 余っているカードを探す
            for (var fee in youCards) {
                enough[fee] = [];
                var currentLevel = parseInt(levels[fee]);
                if (isNaN(currentLevel)) {
                    currentLevel = 0;
                }


                for (hash in youCards[fee]) {
                    if (youCards[fee][hash].length > maxCard - currentLevel) {
                        enough[fee] = enough[fee].concat(youCards[fee][hash].slice(maxCard - currentLevel));
                    }
                }
            }

            // 必要なカードを探す
            for (fee in themCards) {
                if (!enough[fee]) continue;

                need[fee] = [];
                currentLevel = parseInt(levels[fee]);
                if (isNaN(currentLevel)) {
                    currentLevel = 0;
                }

                for (hash in themCards[fee]) {
                    var hasCount = 0;
                    if (youCards[fee][hash]) {
                        hasCount = youCards[fee][hash].length;
                    }

                    if (hasCount < maxCard - currentLevel) {
                        if (isDupsTrade) {
                            // 重複のみトレードの場合、一枚残す
                            need[fee] = need[fee].concat(themCards[fee][hash].slice(1, maxCard - currentLevel - hasCount));
                        } else {
                            need[fee] = need[fee].concat(themCards[fee][hash].slice(- (maxCard - currentLevel - hasCount)));
                        }
                    }
                }

                // 1:1トレード可能な数だけトレードする
                var count = Math.min(enough[fee].length, need[fee].length);
                if (count > 0) {
                    randomArray(enough[fee]);
                    randomArray(need[fee]);
                    for (var i = 0; i < count; i++) {
                        window.MoveItemToTrade(enough[fee][i].element);
                        window.MoveItemToTrade(need[fee][i].element);
                    }
                }
            }
            alert("end all match!");
        };

        // You のインベントリ読み込み完了を監視し、初期化
        var observeYouTimer = 0;
        self.observeYou = function () {
            try {
                if (!window.UserYou && !window.UserYou.rgContexts) {
                    return;
                }

                // unsafeWindowにアクセス
                var you = window.UserYou.rgContexts[753][6].inventory;
                if (you && you.rgInventory) {
                    timerYou = clearInterval(observeYouTimer);

                    $("#inventory_select_your_inventory div").text("loaded YOU");
                    self.you = you.rgInventory;
                    self.onLoaded(you.rgInventory);
                    self.search(localStorage[SEARCH_KEY]);

                    $$("#inventory_select_their_inventory").trigger("click");

                    console.log("loaded you");
                }
            } catch (ex) {
                //
            }
        };

        // Them のインベントリ読み込みを監視、初期化
        var observeThemTimer = 0;
        self.observeThem = function () {
            try {
                var them = window.UserThem.rgContexts[753][6].inventory;
                if (them && them.rgInventory) {
                    timerThem = clearInterval(observeThemTimer);

                    $("#inventory_select_their_inventory div").text("loaded THEM");
                    self.them = them.rgInventory;
                    self.onLoaded(them.rgInventory);
                    self.search(localStorage[SEARCH_KEY]);

                    console.log("loaded them");
                }
            } catch (ex) {
                //
            }
        };

        // 他のウィンドウでの検索を監視
        self.observeSearchInput = function () {
            var $search = $("#cardSearchBox");
            var q = $search.val().trim();
            if (q != localStorage[SEARCH_KEY]) {
                $search.val(q);
                self.search(q);
            }
        };

        self.initilize = function () {
            $(function () {/*
<div id="tradeSearchExtra">
<label>Search: </label>
<input type="text" id="cardSearchBox" />
<hr />
<label>App ID: </label>
<input type="text" id="cardMatchBox" />
<div>
<input type="checkbox" id="cardMatchDupsForThem" value="" />
<label for="cardMatchDupsForThem">Them are duplicate cards only</label>
<br />
<input type="checkbox" id="isThroughLevels" value="" />
<label for="isThroughLevels">Not use level cap</label>
<br />
<label>I want cards each</label>
<input type="input" id="wantCardsCount" value="5" />
<br />
<button id="cardSingleMatchButton">MATCH ONE</button>
<button id="cardMultiMatchButton">ALL MATCH</button>
</div>
</div>
            */}.toComment()).appendTo("#inventory_box");

            var searchTimer = 0;
            $("#cardSearchBox")
                .val(localStorage[SEARCH_KEY])
                .keyup(function (event) {
                searchTimer = clearTimeout(searchTimer);
                searchTimer = setTimeout(function () {
                    self.search();
                }, 1000);
            });
            $("#cardSingleMatchButton").click(self.onMatch);
            $("#cardMultiMatchButton").click(self.onAllMatch);

            $(document).on("click", ".inventory_item_link", function (ev) {
                var fee;
                if (ev.ctrlKey) {
                    fee = $(this).parent()[0].rgItem.market_fee_app;
                    window.open(window.UserThem.strProfileURL + "/gamecards/" + fee + "/");
                } else if (ev.shiftKey) {
                    fee = $(this).parent()[0].rgItem.market_fee_app;
                    window.open(window.UserYou.strProfileURL + "/gamecards/" + fee + "/");
                } else if (ev.altKey) {
                    window.MoveItemToInventory($(this).parent()[0].rgItem.element);
                } else {
                    var gameTag = $(this).parent()[0].rgItem.tags.find(function (item) {
                        if (item.category == "Game") {
                            return true;
                        }
                    });
                    $("#cardSearchBox").val(gameTag.name);
                    self.search(gameTag.name);
                }
            });

            setInterval(self.observeSearchInput, 3000);
            observeYouTimer = setInterval(self.observeYou, 500);
            observeThemTimer = setInterval(self.observeThem, 500);

            $("<a />")
                .addClass("action")
                .text("アイテムを除去")
                .click(function () {
                $("#your_slots .item")
                    .add("#their_slots .item")
                    .each(function () {
                    var app_id = $(this).attr("id").match(/(\d+)$/)[1];
                    window.MoveItemToInventory(self.inventory[app_id].element);
                });
            }).appendTo("#trade_area");

            $("<a />")
                .addClass("action")
                .text("アイテムを100残す")
                .click(function () {
                $("#your_slots .item").each(function (i) {
                    if (i < 100) return;
                    var app_id = $(this).attr("id").match(/(\d+)$/)[1];
                    window.MoveItemToInventory(self.inventory[app_id].element);
                });
                $("#their_slots .item").each(function (i) {
                    if (i < 100) return;
                    var app_id = $(this).attr("id").match(/(\d+)$/)[1];
                    window.MoveItemToInventory(self.inventory[app_id].element);
                });
            }).appendTo("#trade_area");

            var $beforeUnload = $("<a />")
            .addClass("action")
            .css({ marginLeft: "5px" })
            .text("ページ移動を確認")
            .click(function () {
                // ページから離れるとき
                window.eval("(" + (function () {
                    window.onbeforeunload = function (event) {
                        return "alert";
                    };
                }).toString() + ")();");
                $beforeUnload.remove();
            })
            .appendTo("#trade_area");

            $("<style />").text(function () {/*
            #tradeSearchExtra { padding: 0 16px 8px 16px; line-height: 2em; }
            #cardSearchBox + hr { background-color: #252525; height: 1px; border: none; }
            #cardMatchBox + div { text-align: right; }
            #cardSearchBox, #cardMatchBox { width: 300px; }
            .trade_area .trade_right { float: left; width: 324px; margin-left: 20px; }
            #trade_area .action { display: block; }
            */}.toComment()).appendTo("head");

            console.log("end");
        };
        // end initilize
    }
    function Trade() {
        var instance = new TradeClass();
        instance.initilize();
        return instance;
    }

    /*
     * /id/{userid}/tradeoffer/
     */
    function TradeOffers() {
        var _BuildHover = BuildHover;
        BuildHover = (prefix, item, owner) => {
            $(`[data-economy-item^='classinfo\/${item.appid}/${item.classid}']`).click(()=>{
                window.open(`http://steamcommunity.com/market/listings/${item.appid}/${item.market_hash_name}`);
            });
            _BuildHover(prefix, item, owner);
        };

        $("<style />").text(function () {/*
            .trade_item { cursor: pointer; }
        */}.toComment()).appendTo("head");


        var instance = new TradeClass();
        instance.initilize();
        return instance;
    }
    function AppStore() {
        console.log("AppStore()");
        var makeButton = function (label, href) {
            $("<div />")
                .addClass(".queue_control_button")
                .css({ display: "inline-block", marginLeft: "3px" })
                .append($("<a />")
                        .attr({
                target: "_blank",
                href: href
            })
                        .addClass("btnv6_blue_hoverfade  btn_medium queue_btn_inactive")
                        .append("<span>" + label + "</span>"))
                .insertAfter(".queue_control_button:last");
        };

        var appId = location.pathname.match(/\d+/)[0];
        makeButton("Barter.vg", "https://barter.vg/search?q=" + $(".apphub_AppName").text());
        makeButton("最安値", "https://steamdb.info/app/" + appId + "/");
        makeButton("クーポン", "http://new.steam.nyan.link/#/coupons/?expiresIn=0&filterCouponsByWishlistedGames=false&filterCouponsByOwnedGames=false&byPercentsW=%3C%3D%3E&byPercentsX=Any&onlyApplicableWithDiscounts=false&expires=false&gameName=" + $(".apphub_AppName").text());
        makeButton("カード一覧", "http://steamcommunity.com/id/noguchii/gamecards/" + appId);
        makeButton("Steamクライアント", "steam://store/" + appId);
        makeButton("トレード掲示板", "http://steamcommunity.com/app/" + appId + "/tradingforum/");
    }

    function AgeCheck() {
    }

    function Forum() {
        $(".apphub_sectionTabs").append(TRADE_OFFER_LINK);
    }

    function Group () {
        $(".grouppage_header_content").append(TRADE_OFFER_LINK);
    }

    $(function () {
        log("on Ready");
        log(location.pathname);

        if (Page.inMarket) {
            Market();
        }
        if (Page.inMarketListings) {
            MarketListings();
        }
        if (Page.inMarketMultiSell || Page.inMarketMultiBuy) {
            MarketMultiSell();
        }
        if (Page.inInventory) {
            Inventory();
            if (Page.inModalInventory) {
                InventoryModalToBuy();
            }
        }
        if (Page.inMarketSearch) {
            MarketSearch();
        }
        if (Page.inGameCards) {
            GameCards();
        }
        if (Page.inAgeCheck) {
            AgeCheck();
        }
        if (Page.inStore) {
            AppStore();
        }
        if (Page.inTradeNew || Page.inTradeOffers) {
            Trade();
        }
        if (Page.inForum) {
            Forum();
        }
        if (Page.inGroup) {
            Group();
        }
    });
})();