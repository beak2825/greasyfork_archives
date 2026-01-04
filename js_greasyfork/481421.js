// ==UserScript==
// @name         Vitriol
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatic market-watcher script that can watch items and warn if it's available (or instantly buy them) if the price is below a set maximum value.
// @author       **********
// @include      https://*.the-west.*/game.php*
// @icon         https://www.deviantart.com/ahnorac/art/Vitriol-998868964
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481421/Vitriol.user.js
// @updateURL https://update.greasyfork.org/scripts/481421/Vitriol.meta.js
// ==/UserScript==

(function () {

    function ItemPrototype(item_id) {
        this.item_id = item_id;
        this.price = 0;
        this.instaBuy = false;
    }
    ItemPrototype.prototype = {
        setPrice: function (price) {
            this.price = price;
        },

        setInstaBuy: function (instaBuy) {
            this.instaBuy = instaBuy;
        }
    }


    function SearchPrototype(searchKey) {
        this.searchKey = searchKey;
        this.selectedItems = [];
    }
    SearchPrototype.prototype = {
        addItem: function (item) {
            this.selectedItems.push(item);
        },

        addItemByCreating: function (item) {
            var proto = new ItemPrototype(item.item_id);
            proto.setPrice(item.sell_price);
            proto.setInstaBuy(false);
            this.addItem(proto);
        },

        removeItem: function (item_id) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    this.selectedItems.splice(i, 1);
                    return;
                }
            }
        },

        isAdded: function (item_id) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    return true;
                }
            }
            return false;
        },
        getMoney: function (item_id) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    return this.selectedItems[i].price;
                }
            }
            return 9999999;
        },

        getInstaBuy: function (item_id) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    return this.selectedItems[i].instaBuy;
                }
            }
            return -1;
        },

        setInstaBuy: function (item_id, value) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    this.selectedItems[i].instaBuy = value;
                }
            }
        },

        setPrice: function (item_id, value) {
            for (var i = 0; i < this.selectedItems.length; i++) {
                if (this.selectedItems[i].item_id == item_id) {
                    this.selectedItems[i].price = value;
                }
            }
        }

    }

    Vitriol = {
        window: null,
        keywordFilter: "",
        itemNameFilter: "",
        searchTablePosition: { content: "0px", scrollbar: "0px" },
        selectedItemsTablePosition: { content: "0px", scrollbar: "0px" },
        legenda: true,
        selectedKeyword: -1,
        itemListLoaded: false,
        itemList: [],
        itemNames: [],
        searchKeys: [],
        selectedItems: [],
        selectedItemsInputFieldCount: 0,
        settings: {
            searchDelay: 60
        },
        isRunning: false,
        userMessages: [],
        lastMessage: 0,
        messageDelay: 2000,
        statistics: {
            boughtItems : 0
        }
    }

    Vitriol.log = function (message) {
        date = new Date();
        timeFormat = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] Vitriol: ";
        console.log(timeFormat + message);
    }

    Vitriol.logError = function (message) {
        document.querySelector("#errorMessage").innerHTML = message;
        date = new Date();
        timeFormat = "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] Vitriol: ";
        console.log("%c" + timeFormat + message, 'background: #f00; color: #ffff00');
    }

    Vitriol.searchMarketPage = async function (search_key, page) {
        var reqObj = {
            pattern: search_key,
            nav: 'first',
            page: page,
            sort: 'bid',
            order: 'asc',
            type: '',
            level_range_min: 0,
            level_range_max: 250,
            usable: true,
            has_effect: false,
            visibility: 2
        };

        var found = 0;
        var resultItems = [];
        await Ajax.remoteCall('building_market', 'search', reqObj, function (json) {
            if (json.error)
                console.log("Error!");
            if (json.msg.search_result.length == 0) {
                console.log("Nothing found")

            }
            for (var i = 0; i < json.msg.search_result.length; i++) {
                resultItems.push(json.msg.search_result[i]);
            }
            found = json.msg.search_result.length;
        }, MarketWindow);

        if (found == 31) {
            var other = await Vitriol.searchMarketPage(search_key, page+1);
            for (var i = 0; i < other.length; i++) {
                resultItems.push(other[i]); 
            }
        }

        return resultItems;
    }

    Vitriol.marketSearch = async function (search_key) {
        var result = await Vitriol.searchMarketPage(search_key, 1);
        return result;
    }



    Vitriol.getAllItems = function () {
        var items = [];
        var itemManagerItems = ItemManager.getAll();
        for (var k in itemManagerItems) {
            items.push(itemManagerItems[k]);
        }
        if(items.length > 0)
        {
            Vitriol.itemListLoaded = true;
        }
        return items;
    }

    Vitriol.getAllItemNames = function () {
        if (Vitriol.itemList.length == 0)
            Vitriol.log("Sh1te, no items!");
        else {
            for (var i = 0; i < Vitriol.itemList.length; i++) {
                Vitriol.itemNames.push(Vitriol.itemList[i].name);
            }
        }
    }


    Vitriol.itemSearch = function (keyword) {

        if(Vitriol.itemListLoaded == false)
        {
            Vitriol.itemList = Vitriol.getAllItems();
            Vitriol.getAllItemNames();
        }

        var lcKeyword = keyword.toLowerCase();

        var result = [];

        for (var i = 0; i < Vitriol.itemNames.length; i++) {
            var itemName = Vitriol.itemNames[i].toLowerCase();
            var item = Vitriol.itemList[i];

            if (itemName.includes(lcKeyword) && item.auctionable)
                result.push(Vitriol.itemList[i]);
        }
        return result;
    }

    Vitriol.addSearchKeyword = function (keyword) {
        var min_length = 2;
        if (keyword.length < min_length) {
            Vitriol.logError("Keyword is too short")
            return false;
        }
        for(var key = 0; key < Vitriol.searchKeys.length; key++)
        {
            if (Vitriol.searchKeys[key].searchKey.toLowerCase() === keyword.toLowerCase()) {
                Vitriol.logError("Keyword is already used")
                return false;
            }
        } 

        var addable = new SearchPrototype(keyword);
        Vitriol.searchKeys.push(addable);
        return true;
    }

    Vitriol.removeSearchKeyword = function (keyword) {
        
        for(var i = 0; i < Vitriol.searchKeys.length; i++)
            {
                if(keyword == Vitriol.searchKeys[i].searchKey)
                {
                    Vitriol.searchKeys.splice(i,1);
                }
            }
            Vitriol.selectTab('searchtab');
    }

    Vitriol.isSearchKeywordAdded = function (keyword) {
        for (var i = 0; i < Vitriol.searchKeys.length; i++) {
            if (Vitriol.searchKeys[i].searchKey.toLowerCase() === keyword.toLowerCase())
                return i;
        }
        return -1;
    }

    Vitriol.addItemToSearchKeyword = function (keyword, item_id, price, instaBuy) {
        var index = Vitriol.isSearchKeywordAdded(keyword);
        if (index == -1) {
            Vitriol.logError("Keyword is not added yet.");
            return;
        }
        var items = Vitriol.itemSearch(keyword);

        for (var i = 0; i < items.length; i++) {
            if (items[i].item_id == item_id) {
                var proto = new ItemPrototype(item_id);
                proto.setPrice(price);
                proto.setInstaBuy(instaBuy);
                Vitriol.searchKeys[index].addItem(proto);
                return;
            }
        }
        Vitriol.logError("Item ID not found in list.")
    }


    Vitriol.buyItem = function (item) {
        Ajax.remoteCall('building_market', 'bid', {
            bidtype: 0,
            bid: item.max_price,
            market_offer_id: item.market_offer_id
        }, function (resp) {
            if (resp.error)
                return new UserMessage(resp.msg).show();
            else {
                if (resp.msg.instantBuy) {
                    new UserMessage((Character.charSex == 'female') ? "Ezt a trgyat rversen szerezted." : "Ezt a trgyat rversen szerezted.", UserMessage.TYPE_SUCCESS).show();
                } else {
                    new UserMessage((Character.charSex == 'female') ? "Elkldted az rajnlatodat." : "Elkldted az rajnlatodat.", UserMessage.TYPE_SUCCESS).show();
                }
                Character.setMoney(resp.msg.money);
                Character.setDeposit(resp.msg.deposit);
            }
        }, MarketWindow);
        AudioController.play('mpi_game_ready_2');
        Vitriol.statistics.boughtItems++;
        Vitriol.setCookies();
    }

    Vitriol.warnUserForItem = function (item) {
        var baseId = item.item_id / 1000;
        Vitriol.log("Found: " + ItemManager.getAll()[baseId].name + " from " + item.seller_name + " for " + item.max_price + "(x" + item.item_count + ")");
        Vitriol.addUserMessage("Found: " + ItemManager.getAll()[baseId].name);

    }

    Vitriol.instaBuyItem = function (item) {
        var baseId = item.item_id / 1000;
        Vitriol.log("Instabuy: " + ItemManager.getAll()[baseId].name + " from " + item.seller_name + " for " + item.max_price + "(x" + item.item_count + ")");
        Vitriol.addUserMessage("Bought: " + ItemManager.getAll()[baseId].name);
        Vitriol.buyItem(item);
    }

    Vitriol.fullCheckMarket = async function () {
        for (var i = 0; i < Vitriol.searchKeys.length; i++) {
            var marketItems = await Vitriol.marketSearch(Vitriol.searchKeys[i].searchKey);
            for (var j = 0; j < marketItems.length; j++) {
                if (Vitriol.searchKeys[i].isAdded(marketItems[j].item_id))
                {
                    var goodPrice = Vitriol.searchKeys[i].getMoney(marketItems[j].item_id);
                    if (marketItems[j].max_price != null && (marketItems[j].max_price/marketItems[j].item_count) <= goodPrice) {
                        var instaBuy = Vitriol.searchKeys[i].getInstaBuy(marketItems[j].item_id);

                        var baseId = marketItems[j].item_id / 1000;

                        if (instaBuy == -1)
                            Vitriol.logError("Instabuy not found??");
                        else if (instaBuy)
                            Vitriol.instaBuyItem(marketItems[j]);
                        else
                            Vitriol.warnUserForItem(marketItems[j]);
                        
                    }
                }
            }
        }
    }

    Vitriol.setCookies = function () {
        var expiracyDatePermanent = new Date();
        expiracyDatePermanent.setDate(expiracyDatePermanent.getDate() + 360000);
        var permanentObject = {
            settings: Vitriol.settings,
            statistics: Vitriol.statistics,
            searchKeys: Vitriol.searchKeys

        };
        var jsonPermanent = JSON.stringify(permanentObject);
        document.cookie = "Vitriolpermanent=" + jsonPermanent + ";expires=" + expiracyDatePermanent.toGMTString() + ";";
    };
    Vitriol.getCookies = function () {
        var cookie = document.cookie.split("=");
        for (var i = 0; i < cookie.length; i++) {
            if (cookie[i].includes("Vitriolpermanent")) {
                var obj = cookie[i + 1].split(";");
                var permanentObject = JSON.parse(obj[0]);
                Vitriol.settings = permanentObject.settings;
                Vitriol.statistics = permanentObject.statistics;
                if (permanentObject.searchKeys) {
                    for (var i = 0; i < permanentObject.searchKeys.length; i++) {
                        var searchKey = permanentObject.searchKeys[i].searchKey;
                        Vitriol.addSearchKeyword(searchKey);
                        for (var j = 0; j < permanentObject.searchKeys[i].selectedItems.length; j++) {
                            var item = permanentObject.searchKeys[i].selectedItems[j];
                            var item_id = item.item_id;
                            var price = item.price;
                            var instaBuy = item.instaBuy;
                            Vitriol.addItemToSearchKeyword(searchKey, item_id, price, instaBuy);
                        }
                    }
                }

            }
        }
    };


    // =================== UI ===================

    Vitriol.createWindow = function () {
        var window = wman.open("Vitriol").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Vitriol");
        var content = $('<div class=\'Vitriolwindow\'/>');
        var tabs = {
            "searchtab": "Search",
            "itemstab": "Selected Items",
            "settings": "Settings"
        };

        for (var tab in tabs) {
            window.addTab(tabs[tab], tab, Vitriol.tabLogic);
        }
        Vitriol.window = window;
        Vitriol.selectTab("searchtab");
    };

    Vitriol.tabLogic = function (win, id) {
        var content = $('<div class=\'Vitriolwindow\'/>');
        switch (id) {
            case "searchtab":
                    Vitriol.removeActiveTab(this);
                    Vitriol.removeWindowContent();
                    Vitriol.addActiveTab("searchtab", this);
                    content.append(Vitriol.createSearchTab());
                    Vitriol.window.appendToContentPane(content);
                    Vitriol.addSearchTableCss();
                    $(".Vitriolwindow .tw2gui_scrollpane_clipper_contentpane").css({ "top": Vitriol.searchTablePosition.content });
                    $(".Vitriolwindow .tw2gui_scrollbar_pulley").css({ "top": Vitriol.searchTablePosition.scrollbar });
                break;
            case "itemstab":
                Vitriol.removeActiveTab(this);
                Vitriol.removeWindowContent();
                Vitriol.addActiveTab("itemstab", this);
                content.append(Vitriol.createSelectedItemsTab());
                Vitriol.window.appendToContentPane(content);
                $(".Kittymaticwindow .tw2gui_scrollpane_clipper_contentpane").css({ "top": Vitriol.selectedItemsTablePosition.content });
                $(".Kittymaticwindow .tw2gui_scrollbar_pulley").css({ "top": Vitriol.selectedItemsTablePosition.scrollbar });
                Vitriol.addSelectedItemsTableCss();
                Vitriol.addListenersToInputFields(Vitriol.selectedItemsInputFieldCount);
                Vitriol.addListenerToItemNameFilter();
                break;
            case "settings":
                Vitriol.removeActiveTab(this);
                Vitriol.removeWindowContent();
                Vitriol.addActiveTab("settings", this);
                content.append(Vitriol.createSettingsGui());
                Vitriol.window.appendToContentPane(content);
                break;
        }
    }

    Vitriol.selectTab = function (key) {
        Vitriol.window.tabIds[key].f(Vitriol.window, key);
    };

    Vitriol.removeActiveTab = function (window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active');
    };

    Vitriol.removeWindowContent = function () {
        $(".Vitriolwindow").remove();
    };

    Vitriol.addActiveTab = function (key, window) {
        $('div._tab_id_' + key, window.divMain).addClass('tw2gui_window_tab_active');
    };

    Vitriol.createRemoveKeywordButton = function (keyword) {
        var buttonAdd = new west.gui.Button("Remove", function () {
            Vitriol.removeSearchKeyword(keyword);
            Vitriol.searchTablePosition.content = $(".Vitriolwindow .tw2gui_scrollpane_clipper_contentpane").css("top");
            Vitriol.searchTablePosition.scrollbar = $(".Vitriolwindow .tw2gui_scrollbar_pulley").css("top");
        });
        buttonAdd.setWidth(100);
        return buttonAdd.getMainDiv();
    };

    Vitriol.filterSearchKeys = function (filter) {
        if (filter.length == 0)
            return Vitriol.searchKeys;

        var keys = [];

        for (var i = 0; i < Vitriol.searchKeys.length; i++) {
            if (Vitriol.searchKeys[i].searchKey.toLowerCase().includes(filter.toLowerCase()))
                keys.push(Vitriol.searchKeys[i]);
        }

        return keys;
    }

    Vitriol.createSearchTab = function () {
        var htmlSkel = $("<div id = \'search_overview'\></div>");
        var html = $("<div class = \'keywords_search'\ style=\'position:relative;'\><div id=\'keywordFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'errorMessageContainer'\><p id=\'errorMessage'\></p></div><div id=\'button_add_keyword'\style=\'position:absolute;top:5px;left:340px;'\></div><div id=\'button_filter_keywords'\style=\'position:absolute;top:5px;left:450px;'\></div></div>");
        var table = new west.gui.Table();
        table.addColumn("keyWord", "keyWord").addColumn("removeKeyword", "removeKeyword");
        table.appendToCell("head", "keyWord", "Keyword").appendToCell("head", "removeKeyword", "Remove Keyword");

        var filtered = Vitriol.filterSearchKeys(Vitriol.keywordFilter);

        for (var i = 0; i < filtered.length; i++) {
            table.appendRow().appendToCell(-1, "keyWord", filtered[i].searchKey).appendToCell(-1, "removeKeyword", Vitriol.createRemoveKeywordButton(filtered[i].searchKey));
        }

        var textfield = new west.gui.Textfield("keywordsearch").setPlaceholder("Select a keyword");

        if (Vitriol.keywordFilter != "") {
            textfield.setValue(Vitriol.keywordFilter);
        }

        var buttonAdd = new west.gui.Button("Add Keyword", function () {
            Vitriol.searchTablePosition.content = "0px";
            Vitriol.searchTablePosition.scrollbar = "0px";
            if(Vitriol.addSearchKeyword(textfield.getValue()))
            {
                Vitriol.setCookies();
                Vitriol.selectTab("searchtab"); 
            }
        });

        var buttonFilter = new west.gui.Button("Filter", function () {
            Vitriol.keywordFilter = textfield.getValue();
            Vitriol.searchTablePosition.content = "0px";
            Vitriol.searchTablePosition.scrollbar = "0px";
            Vitriol.selectTab("searchtab");
        });

        htmlSkel.append(table.getMainDiv());
        $('#keywordFilter', html).append(textfield.getMainDiv());
        $("#button_add_keyword", html).append(buttonAdd.getMainDiv());
        $("#button_filter_keywords", html).append(buttonFilter.getMainDiv());
        htmlSkel.append(html);
        return htmlSkel;
    };

    Vitriol.filterItemnames = function (items, filter) {

        if (filter.length == 0) {
            return items;
        }
        var goodItems = [];

        for (var i = 0; i < items.length; i++) {
            if (items[i].name.toLowerCase().includes(filter.toLowerCase())) {
                goodItems.push(items[i]);
            }
        }
        return goodItems;
    }

    Vitriol.addListenerToItemNameFilter = function () {

        $("#itemNameSearch").on("keyup", function (e)
        {
            Vitriol.itemNameFilter = e.target.value;
            Vitriol.selectTab("itemstab");
            $("#itemNameSearch").trigger('focus');
        })
    }

    Vitriol.createSelectedItemsTab = function () {
        var htmlSkel = $("<div id = \'items_overview'\></div>");
        var html = $("<div class = \'itemName_search'\ style=\'position:relative;'\><div id=\'itemNameFilter'\style=\'position:absolute;top:10px;left:15px'\></div><div id=\'combobox_keywords'\></div></div>");
        var combobox = new west.gui.Combobox("combobox_keywords");
        Vitriol.addComboboxItems(combobox);
        combobox = combobox.select(Vitriol.selectedKeyword);
        combobox.addListener(function (value) {
            Vitriol.selectedKeyword = value;
            Vitriol.selectTab("itemstab");
        });

        var table = new west.gui.Table();
        table.addColumn("watch", "watch").addColumn("itemLogo","itemLogo").addColumn("itemName", "itemName").addColumn("setPrice", "setPrice").addColumn("vitrioling","vitrioling");
        table.appendToCell("head", "watch", "Watched").appendToCell("head","itemLogo","").appendToCell("head", "itemName", "Item Name").appendToCell("head", "setPrice", "Max price").appendToCell("head", "vitrioling", "Automation");
        var selectedItems;
        Vitriol.selectedItemsInputFieldCount = 0;
        Vitriol.selectedItems = [];
        if(Vitriol.selectedKeyword != -1)
        {
            selectedItems = Vitriol.itemSearch(Vitriol.searchKeys[Vitriol.selectedKeyword].searchKey);
            selectedItems = Vitriol.filterItemnames(selectedItems, Vitriol.itemNameFilter);
            Vitriol.selectedItems = selectedItems;
            Vitriol.selectedItemsInputFieldCount = selectedItems.length;
            for (var i = 0; i < selectedItems.length; i++) {
                table.appendRow().appendToCell(-1, "watch", Vitriol.createWatchCheckbox(selectedItems, i)).appendToCell(-1,"itemLogo",Vitriol.getItemLogo(selectedItems, i)).appendToCell(-1, "itemName", selectedItems[i].name).appendToCell(-1, "setPrice", Vitriol.createItemInputField(selectedItems, i)).appendToCell(-1, "vitrioling", Vitriol.createVitriolCheckbox(selectedItems, i));
            }
        }

        var textfield = new west.gui.Textfield("itemNameSearch").setPlaceholder("Select an item");

        if (Vitriol.itemNameFilter != "") {
            textfield.setValue(Vitriol.itemNameFilter);
        }


        htmlSkel.append(table.getMainDiv());
        $('#itemNameFilter', html).append(textfield.getMainDiv());
        $('#combobox_keywords', html).append(combobox.getMainDiv());

        htmlSkel.append(html);

        return htmlSkel;
    };

    Vitriol.createSettingsGui = function () {
        var htmlSkel = $("<div id=\'settings_overview'\ style = \'padding:10px;'\></div>");

        var htmlSearchDelay = $("<div></div>");
        htmlSearchDelay.append("<span> Search delay (seconds): </span>");
        var htmlSearchDelayTextfield = new west.gui.Textfield("searchDelay");
        htmlSearchDelayTextfield.setValue(Vitriol.settings.searchDelay);
        htmlSearchDelayTextfield.setWidth(100);
        htmlSearchDelay.append(htmlSearchDelayTextfield.getMainDiv());

        var buttonApply = new west.gui.Button("Apply", function () {
            Vitriol.setCookies();
            if (Vitriol.isNumber(htmlSearchDelayTextfield.getValue())) {
                var searchDelay = parseInt(htmlSearchDelayTextfield.getValue());
                Vitriol.settings.searchDelay = searchDelay;
            }
            Vitriol.selectTab("settings");
        })

        var buttonStart = new west.gui.Button("Start", function () {
            Vitriol.isRunning = true;
            Vitriol.run();
            Vitriol.selectTab("settings");
        })


        var buttonStop = new west.gui.Button("Stop", function () {
            Vitriol.isRunning = false;
            Vitriol.selectTab("settings");
        })


        htmlSkel.append(htmlSearchDelay);
        htmlSkel.append("<br>");
        if (Vitriol.isRunning)
            htmlSkel.append("<p style=\"color: green; \" id='isRunning'><strong>Vitriol is running.</strong></p>");
        else
            htmlSkel.append("<p style=\"color: red; \" id='isRunning'><strong>Vitriol is not running.</strong></p>");
        htmlSkel.append("<br>");
        htmlSkel.append(buttonApply.getMainDiv());
        htmlSkel.append(buttonStart.getMainDiv());
        htmlSkel.append(buttonStop.getMainDiv());
        return htmlSkel;
    };

    Vitriol.isNumber = function (potentialNumber) {
        return Number.isInteger(parseInt(potentialNumber));
    };

    Vitriol.addComboboxItems = function (combobox) {
        combobox.addItem(-1, "None");
        for (var i = 0; i < Vitriol.searchKeys.length; i++) {
            combobox.addItem(i.toString(), Vitriol.searchKeys[i].searchKey);
        }
    };

    Vitriol.parseItemFields = function (selectedItems) {

        for (var i = 0; i < selectedItems.length; i++) {
            if (Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[i].item_id)) {
                var price = $(".Vitriolwindow #id-" + i).prop("value");
                if (Vitriol.isNumber(price)) {
                    if (price >= selectedItems[i].sell_price)
                        Vitriol.searchKeys[Vitriol.selectedKeyword].setPrice(selectedItems[i].item_id, price);
                    else
                        Vitriol.searchKeys[Vitriol.selectedKeyword].setPrice(selectedItems[i].item_id, selectedItems[i].sell_price);
                }
            }
        }
    }

    Vitriol.addListenersToInputFields = function (num) {

        var createFunction = function (j) {
            var i = j;
            var f = function (e) {
                if (Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(Vitriol.selectedItems[i].item_id)) {
                    var price = e.target.value;
                    if (Vitriol.isNumber(price)) {
                        if (price >= Vitriol.selectedItems[i].sell_price)
                            Vitriol.searchKeys[Vitriol.selectedKeyword].setPrice(Vitriol.selectedItems[i].item_id, price);
                        else
                            Vitriol.searchKeys[Vitriol.selectedKeyword].setPrice(Vitriol.selectedItems[i].item_id, Vitriol.selectedItems[i].sell_price);
                        Vitriol.setCookies();
                    }

                }

                console.log(e.target.value);
            }
            return f;
        }
        for (var i = 0; i < num; i++) {
            $(".Vitriolwindow #id-" + i).on("change", createFunction(i));
        }
    }

    Vitriol.getImageSkel = function () {
        return $("<img class='itemimage' src=''\>");
    };
    Vitriol.getItemImage = function (id) {
        return ItemManager.get(id).image;
    };

    Vitriol.getItemLogo = function (selectedItems, index) {
        return Vitriol.getImageSkel().attr("src", Vitriol.getItemImage(selectedItems[index].item_id));
    }

    Vitriol.createItemInputField = function (selectedItems, index) {
        var componentId = "id-" + index;
        var inputfield = new west.gui.Textfield("itemPrice").setPlaceholder("Price");
        inputfield.setId(componentId);

        

        var value = selectedItems[index].sell_price;
        if (Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[index].item_id))
            value = Vitriol.searchKeys[Vitriol.selectedKeyword].getMoney(selectedItems[index].item_id);
        inputfield.setValue(value);
        inputfield.setWidth(50);
        

        return inputfield.getMainDiv();
    };

    Vitriol.createVitriolCheckbox = function (selectedItems, index) {
        var checkbox = new west.gui.Checkbox();
        checkbox.setLabel("Auto Purchase");

        checkbox.setSelected(Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[index].item_id) && Vitriol.searchKeys[Vitriol.selectedKeyword].getInstaBuy(selectedItems[index].item_id));
        checkbox.setCallback(function () {


            if (this.isSelected()) {

                if (Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[index].item_id))
                    Vitriol.searchKeys[Vitriol.selectedKeyword].setInstaBuy(selectedItems[index].item_id, true);
            }
            else {
                if (Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[index].item_id))
                    Vitriol.searchKeys[Vitriol.selectedKeyword].setInstaBuy(selectedItems[index].item_id, false);
                Vitriol.setCookies();
            }
        });


        return checkbox.getMainDiv();
    };

    Vitriol.createWatchCheckbox = function (selectedItems, index) {
        var checkbox = new west.gui.Checkbox();
        checkbox.setLabel("");

        checkbox.setSelected(Vitriol.searchKeys[Vitriol.selectedKeyword].isAdded(selectedItems[index].item_id));

        checkbox.setCallback(function () {
            if (this.isSelected()) {
                Vitriol.searchKeys[Vitriol.selectedKeyword].addItemByCreating(selectedItems[index]);
            }
            else {
                Vitriol.searchKeys[Vitriol.selectedKeyword].removeItem(selectedItems[index].item_id);
            }
            Vitriol.setCookies();
        });

        return checkbox.getMainDiv();
    };

    Vitriol.addSearchTableCss = function () {
        $(".Vitriolwindow .keyWord").css({ "width": "150px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .removeKeyword").css({ "width": "140px", "position": "relative", "top": "5px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .removeKeyword").first().css({"top":"0px"});
        $(".Vitriolwindow .row").css({ "height": "40px" });
        $(".Vitriolwindow #errorMessageContainer").css({ "position": "relative", "left": "250px", "top": "45px"});
        $(".Vitriolwindow #errorMessageContainer").css({ "font-weight": "bold", "color": "red"});
        $('.Vitriolwindow').find('.tw2gui_scrollpane').css('height', '250px');
    };

    Vitriol.addSelectedItemsTableCss = function () {
        $(".Vitriolwindow .watch").css({ "position": "relative", "width": "100px", "top": "5px", "text-align": "center", "font-size": "small"});
        $(".Vitriolwindow .watch").first().css({ "position": "relative", "top": "0px", "width": "100px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .itemLogo").first().css({ "position": "relative", "top": "0px", "width": "30px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .itemLogo").css({"width": "30px", "text-align": "center" });
        $(".Vitriolwindow .itemimage").css({ "width": "25px", "height": "25px"});
        $(".Vitriolwindow .itemName").css({ "width": "150px", "text-align": "center", "font-size": "small"});
        $(".Vitriolwindow .itemName").first().css({ "width": "150px", "text-align": "center", "font-size": "larger"});
        $(".Vitriolwindow .setPrice").css({ "width": "80px", "text-align": "center" });
        $(".Vitriolwindow .setPrice").first().css({ "width": "80px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .vitrioling").css({ "width": "110px", "text-align": "center" });
        $(".Vitriolwindow .vitrioling").first().css({ "width": "110px", "text-align": "center", "font-size": "larger", "font-weight": "bold" });
        $(".Vitriolwindow .row").css({ "height": "40px" });
        $(".Vitriolwindow #combobox_keywords").css({ "position": "relative", "left": "110px", "top": "5px"});
        $('.Vitriolwindow').find('.tw2gui_scrollpane').css('height', '250px');
        $('.Vitriolwindow checkbox').css({ "position": "relative", "left": "100px"});
    };

    Vitriol.createMenuIcon = function () {
        var menuimage = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/500a81fb-2791-4d19-aad0-3d6b643fead6/dgip884-06ea316a-dde8-43d5-a2d0-b1b602ac8e95.png/v1/fill/w_25,h_25,q_80,strp/vitriol_by_ahnorac_dgip884-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjUiLCJwYXRoIjoiXC9mXC81MDBhODFmYi0yNzkxLTRkMTktYWFkMC0zZDZiNjQzZmVhZDZcL2RnaXA4ODQtMDZlYTMxNmEtZGRlOC00M2Q1LWEyZDAtYjFiNjAyYWM4ZTk1LnBuZyIsIndpZHRoIjoiPD0yNSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.fmPcGNHBjBn4bNnLhpgKJbu08Ul-uWnLd1lys5LfhQU';
        var div = $('<div class="ui_menucontainer" />');
        var link = $('<div id="Menu" class="menulink" onclick=Vitriol.createWindow(); title="Vitriol" />').css('background-image', 'url(' + menuimage + ')');
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'));
    };

    Vitriol.addUserMessage = function (msg) {
        Vitriol.userMessages.push(msg);
    }

    Vitriol.canSayUserMessage = function () {
        return Vitriol.userMessages.length > 0 && get_server_date().valueOf() >= Vitriol.lastMessage + Vitriol.messageDelay;
    }

    Vitriol.manageUserMessages = function() {
        new UserMessage(Vitriol.userMessages[0], UserMessage.TYPE_ERROR).show();
        Vitriol.lastMessage = get_server_date().valueOf();
        Vitriol.userMessages.splice(0, 1);
    }

    Vitriol.run = async function () {
        var nextCheck = get_server_date().valueOf();
        while (true) {
            if (!Vitriol.isRunning)
                break;
            if (get_server_date().valueOf() >= nextCheck)
            {
                Vitriol.fullCheckMarket();
                nextCheck = get_server_date().valueOf() + Vitriol.settings.searchDelay * 1000;
            }
            await new Promise(r => setTimeout(r, 500));
            if (Vitriol.canSayUserMessage())
                Vitriol.manageUserMessages();
        }
    }

    $(document).ready(function () {
        try {
            Vitriol.itemList = Vitriol.getAllItems();
            Vitriol.getAllItemNames();
            Vitriol.createMenuIcon();
            Vitriol.getCookies();

        } catch (e) {
            Vitriol.logError("exception occured");
        }
    });
})();